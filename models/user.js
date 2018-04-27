
var mongoose = require('mongoose'),
	bcrypt = require('bcrypt'),
	Schema = mongoose.Schema;

var userSchema = new Schema({
  email: String,
  passwordDigest: String
});


userSchema.methods.checkPAssword = function (password) {
	return bcrypt.compareSync(password, this.passwordDigest);
};

var User = mongoose.model('User', userSchema);

module.exports = User;