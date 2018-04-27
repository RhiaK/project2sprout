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
  saveUnitialized: true,
  resave: true,
	secret: "TrentisaSprout",
  cookie: {maxAge:14*24*60*60*1000}
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

// app.post('/users', function (req, res) {
//   // use the email and password to authenticate here
//   db.User.createSecure(req.body.email, req.body.password, function (err, newUser) {
//     req.session.userID = newUser._id;
//     res.json(user);
//     res.redirect('/profile');
//   });
// });

//creating user 
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

//use session
app.post('/sessions', (req, res) => {
	db.User.authenticate(req.body.email, req.body.password, function (err, loggedInUser) {
		if (err) {
		console.log('authentication error: ', err);
		res.status(500).send();
		} else {
		console.log('setting session user id ', loggedInUser._id);
		req.session.userId = loggedInUser._id;
		res.redirect('/profile');
		}
			
	});
});

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

//session expiration
// app.use(session({
// 	store: new MongoStore({
// 		url: 'mongodb://localhost/sprout',
// 		ttl: 14 * 24 * 60 * 60 //2 week, default
// 	})
// }));

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
// client.messages
//   .create({
//     to: '+17193298921',
//     from: '+17197223736',
//     body: 'Your child has arrived!',
//   })
//   .then(message => console.log(message.sid));


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
