const mongoose = require('mongoose');
if (process.env.NODE_ENV == "production") {
  console.log("connecting to... " + process.env.NODE_ENV)
  console.log("also connecting to mlab  " + process.env.MLAB_URL)
  mongoose.connect(process.env.MLAB_URL)
} else {
  console.log("this is local ")
  mongoose.connect("mongodb://localhost/sprout");
}

const saltFactor = 10;
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
var UserSchema = new Schema({
  email: {type: String, required: true},
  passwordDigest: {type: String, required: true},
  cName: {type: String, required: true},
  ppPhone: {type: Number, required: true}
});

//creating secure password
UserSchema.statics.createSecure = function(email, password, callback){
  let UserModel = this;
  bcrypt.genSalt(saltFactor, function(err, salt){
    console.log("salt is: ", salt);
    bcrypt.hash(passwordDigest, salt, function(err, hashPassword){
      UserModel.create({
        email : email,
        passwordDigest : hashPassword
      }, callback);
    });
  });
};

UserSchema.methods.checkPassword = function(password) {
  return bcrypt.compareSync(password, this.passwordDigest)
};

//authenticate login
UserSchema.statics.authenticate = function (email, password, callback) {
  this.findOne({email: email}, function (err, returningUser) { 
    console.log(returningUser);
    if (!returningUser) {
      console.log('There is no user with the email ' + email);
      callback("No user found with that email", null); 
    } else if (returningUser.checkPassword(password)) { 
      callback(null, returningUser);
    } else {
      callback("Incorrect password! Please try again.", null);
    }
  });
};

var User = mongoose.model('User', UserSchema);

module.exports = User;