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
const express = require('express');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
let Loc = require('./loc');

var UserSchema = new Schema({
  email: {type: String, required: true},
  password: {type: String, required: true},
  child: {type: String, required: true},
  ppphone: {type: Number, required: true},
  loc: [Loc.schema]
});

//creating secure password
UserSchema.statics.createSecure = function(email, password, child, ppphone, callback){
  let UserModel = this;
  bcrypt.genSalt(saltFactor, function(err, salt){
    console.log("salt is: ", salt);
    bcrypt.hash(password, salt, function(err, hashPassword){

      // this is where we are creating the new mongo document. create is a mongoose function.
      // we're passing in email, encrypted password, child and ppphone into the new document
      // so that it matches the schema
      UserModel.create({
        email : email,
        password : hashPassword,
        child: child,
        ppphone: ppphone
      }, callback);
    });
  });
};

UserSchema.methods.checkPassword = function(password) {
  return bcrypt.compareSync(password, this.password)
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