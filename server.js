const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const db = require('./models');
const mongoose = require('mongoose');
const session = require('express-session');
const User = require('./models/user');
const Loc = require('./models/loc');
// const MongoStore = require('connect-mongo')(session);
require('dotenv').config({silent: true})

const app = express();

// require the Twilio module and create a REST client
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/profile', express.static('profile'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//create sessions
app.use(session({
  resave: true,
  secret: "TrentisaSprout",
  saveUninitialized: true,
	// store: new MongoStore({url: 'mongodb://localhost/sprout'})
}));
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

//index
app.get('/', (req, res) => {
  res.render('index');
});
//show signup
app.get('/signup', (req, res) => {
	res.render('signup');
});
//show login
app.get('/login', (req, res) => {
	res.render('login');
});
//show profile
app.get('/profile', (req, res) => {
  res.render('profile');
});

app.get('/profile/locs', (req, res) => {
  res.json(db.User.Loc);
});

// app.post('/users', function (req, res) {
//   // use the email and password to authenticate here
//   db.User.createSecure(req.body.email, req.body.password, function (err, newUser) {
//     req.session.userID = newUser._id;
//     res.json(user);
//     res.redirect('/profile');
//   });
// });

//create user 
app.post('/signup', function (req, res) {
  db.User.createSecure(req.body.email, req.body.passwordDigest, req.body.child, req.body.ppphone, function(err, newUser) {
    console.log(req.body.email);
    console.log(req.body.passwordDigest);
    console.log("this is the signup");
    if (err) {
      console.log("index error: " + err);
      res.sendStatus(500);
    } else {
      req.session.userId = newUser.id;
      res.json(newUser);
    }
  });
});

//login
app.post('/sessions', function (req, res) {
  db.User.authenticate(req.body.email, req.body.passwordDigest, function (err, returningUser) {
    if (err) {
      console.log("index error: " + err);
      res.sendStatus(500);
    } else {
      req.session.userId = returningUser.id;
      res.json(returningUser);
    }
  });
});



// //SHOW PROFILE PAGE for user in session
// app.get('/profile', function (req, res) {
//   db.User.findOne({_id: req.session.userId}, function (err, currentUser) {
//     res.render('profile.ejs', {user: currentUser});
//   });
// });

// app.session = function(req, res) {
//   db.User.authenticate(req.body.email, req.body.password, function (err, existingUser){
//     if (err) {
//       console.log(error);
//     }
//     req.session.userId = existingUser._id;
//     res.json(existingUser);
//   })


// //profile
// app.get('/profile/user', function (req, res) {
//  db.User.findOne({_id: req.session.userId}, function (err, currentUser) {
//    if (err){
//      res.redirect('/login');
//    } else {
//      res.render ('profile', {user:currentUser});
//    }
//  });
// });

//sends user data to view
app.get('/profile/user', function (req, res) {
    db.User.findOne({_id: req.session.userId}, function (err, user) {
    if(err) {
      console.log("user error " + err);
      res.sendStatus(500);
    } else {
    console.log(user);
    }
    res.json(user);
  });
});

//create
app.put('/profile', function (req,res) {
  var newLoc = req.body;
  db.User.findOneAndUpdate(
    {_id: req.session.userId},
    {$push: {loc: newLoc}},
    {new: true},
    function (err, myloc) {
      if (err) {
        console.log("can't add new location to user");
      } else {
        res.json(myloc);
      }  
  });
});


// app.get('/loc', function (req, res){
//   console.log('hello');
//   db.User.find(function(err, myloc){
//     res.json(myloc);
//   });
// });

// // update loc
// app.put('/loc/:id', function (req, res) {
//   console.log(req.params.id);
//   let input = req.body.input;
//   db.User.findOneAndUpdate(
//     {_id: req.params.id}, {$set:{input: input}}, {new: true},
//     function (err, update) {
//       if (err) {
//         console.log("can't update location");
//       } else {
//         console.log(update);
//         res.json(update);
//       }
//     }
//   );
// });

//delete
app.put('/userRemoveLoc', function (req, res) {

  User.findOneAndUpdate(
    {_id: req.session.userId},
    { $pull: {loc: {_id: req.body.removedLoc}}},
    { new: true},
    function (err, updatedLocationArray) {
      if (err) {
        console.log("can't remove location from user!");
      } else {
        res.json(updatedLocationArray);
      }
    }
  );
});


//logout
app.get('/logout', (req,res) => {
	console.log(req.session);
	req.session.userId = null;
	res.redirect('/login');
});

//twilio send message
//need to access user ppphone and name from signed in user (front end?)
//need to activate msg send with arrived button
// db.User.find(ppphone, name);
// function send() {
//   let phone = db.User.ppphone;
//   let msg = (db.User.name + " has arrived at ")

// client.messages
//   .create({
//     to: phone,
//     from: '+17197223736',
//     body: msg
//   })
//   .then(message => console.log(message.sid));
// };


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// module.exports = app;
  app.set('port', process.env.PORT || 3001);

  app.listen(app.get('port'), () => {
    console.log(`✅ PORT: ${app.get('port')} 🌟`)
  });

// let dbs = mongoose.connection;
// dbs.on('error', console.error.bind(console, 'MongoDB connection error:'));
