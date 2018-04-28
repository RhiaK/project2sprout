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
// app.get('/', (req, res) => {
//   res.render('index');
// });



// app.get('/', function (req, res) {
//   db.User.find({}, function(err, allUsers){
//     if(allUsers){
//       res.render('index.ejs', { users: allUsers });
//     } else {
//       res.status(500).send('server error');
//     }
//   });
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

app.get('/profile/loc', (req, res) => {
  res.render('loc');
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
app.post('/login', function (req, res) {
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

// //use session
// app.post('/sessions', (req, res) => {
// 	db.User.authenticate(req.body.email, req.body.passwordDigest, function (err, loggedInUser) {
// 		if (err) {
// 		console.log('authentication error: ', err);
// 		res.status(500).send();
// 		} else {
// 		console.log('setting session user id ', loggedInUser._id);
// 		req.session.userId = loggedInUser._id;
// 		res.redirect('/profile');
// 		}
			
// 	});
// });

//profile
app.get('/profile', function (req, res) {
	db.User.findOne({_id: req.session.userId}, function (err, currentUser) {
		if (err){
			res.redirect('/login');
		} else {
			res.render ('profile', {user:currentUser});
		}
	});
});

//this route works with my ajax get to display the seeded data on the dom
app.get('profile/:id/loc', function (req, res, next) {
    console.log('hello') 
    db.Loc.find(function(err, loc) {
      if (err) {
      console.log("index error: " + err);
        res.sendStatus(500);
      } else {
        res.json(loc);
      }  
    });
});

//create new location
app.post('/profile/:id/locs', function(req, res) {
  // create new loc with form data (`req.body`)
  var newLoc = req.body;
    db.User.create(newLoc, function(err, newLocItem){
      if (err) {
        console.log("index error: " + err)
        res.sendStatus(500)  
      } else {
      //executed only in the success case, where there's no error
        res.json(newLocItem);  
      }
    });
});

// // delete loc
// app.delete('/profile/:id/loc/:id', function (req, res) {
//   // get to do id from url params (`req.params`)
//   let locToDelete = req.params.id;
//   db.Loc.findOneAndRemove({_id: req.params.id}, function(err, locs) {
//     if (err) {
//       console.log("index error: " + err);
//       res.sendStatus(500);
//     }
//     // get the id of the to do to delete
//     res.json(locToDelete);
//   });
// })

// // update loc list item
// app.put('/profile/:id/loc/:id', function(req,res){
//   console.log(req.params.id);
//   let loc1 = req.body.loc1;
//   console.log(loc1);

//   db.User.findOneAndUpdate(
//       {_id: req.params.id}, {$set:{loc: loc1}}, {new: true}, function (err, update) {
//         if (err) {
//       console.log("index error: " + err);
//       res.sendStatus(500);
//         } else {
//       //doc is the json object that is being sent (refer to 'json' callback in JS functions)
//       console.log(update);
//       res.json(update);
//       }
//   });
// });

//logout
app.get('/logout', (req,res) => {
	console.log(req.session);
	req.session.userId = null;
	res.redirect('/login');
});

//login view
// //protected login
// app.get('/protected', (req, res) => {
// 	console.log(req.session);
// 	if(!req.session.user) {
// 		return res.status(401).send('Sorry, you are not allowed, please sign in');
// 	} else {
// 		return res.status(200).send('Welcome to the protected area');
// 	}	
// });


//twilio send message
function send() {
  let phone = db.User.ppphone;
  let msg = (db.User.name + " has arrived at " + db.User.loc)

client.messages
  .create({
    to: phone,
    from: '+17197223736',
    body: msg
  })
  .then(message => console.log(message.sid));
};


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
