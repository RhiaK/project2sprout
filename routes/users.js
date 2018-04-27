var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// create a new user with a hashed password
userSchema.statics.createSecure = function (email, password, callback) {
  var UserModel = this;
  bcrypt.genSalt(function (err, salt) {
  console.log('salt: ', salt);  
    bcrypt.hash(password, salt, function (err, hash) {

      UserModel.create({
        email: email,
        passwordDigest: hash
      }, callback);
    });
  });
};

//authenticate user
userSchema.statics.authenticate = function (email, password, callback) {
	this.findOne({email: email}, function (err, foundUser) {
		console.log(foundUser);
		if (!foundUser) {
			console.log('No user with email ' + email);
		} else if (foundUser.checkPassword(password)) {
			callback (null, foundUser);
		} else {
			callback('Error: incorrect password', null);
		}
	});
};

module.exports = router;
