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
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
//so that I can store twilio info in .env folder in gitignore
const dotenv = require("dotenv");
const { error } = dotenv.config();
if (error) {
  throw error
}

const app = express();

// Twilio Credentials
// const twilioLogin = ('.env');
// const accountSid = ('.env');
// const authToken = ('.env');

// require the Twilio module and create a REST client
const client = require('twilio')(dotenv.TWILIO_ACCOUNT_SID, dotenv.TWILIO_AUTH_TOKEN);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// //create sessions using connect-mongo
// app.use(session({
// 	secret: "Trent is Sprout",
// 	// store: new MongoStore({url: 'mongodb://localhost/sprout'})
// }));
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

app.get('/index', function (req, res) {
  db.User.find({}, function(err, allUsers){
    if(allUsers){
      res.render('index.ejs', { users: allUsers });
    } else {
      res.status(500).send('server error');
    }
  });
});
//show signup
app.get('/signup', (req, res) => {
	res.render('signup');
});


app.post('/users', function (req, res) {
  // use the email and password to authenticate here
  db.User.createSecure(req.body.email, req.body.password, function (err, newUser) {
  	req.session.userID = newUser._id;
    res.json(user);
    res.redirect('/profile');
  });
});

app.get('/login', (req, res) => {
	res.render('login');
});
// //sign in
// app.post('/signup', (req, res) => {
// 	let username = req.body.username;
// 	let enteredPassword = req.body.password;
// 	User.findOne({username: username}, function(err, user){
// 		if(user) {
// 			bcrypt.compare(enteredPassword, user.passwordDigest, (err, result) => {
// 				if(err) {
// 					console.log("Incorrect password!!");
// 				}
// 				if(result) {
// 					console.log("Logged In!");
// 					req.session.user = user;
// 					res.redirect('/profile');
// 				}
// 			});
// 		if(err) {
// 			console.log(err);
// 			res.redirect('/');
// 		}	
// 		}
// 	});
// });

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
			res.render ('user-show.ejs', {user:currentUSer});
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
client.messages
  .create({
    to: '+17193298921',
    from: '+17197223736',
    body: 'Your child has arrived!',
  })
  .then(message => console.log(message.sid));


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

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
