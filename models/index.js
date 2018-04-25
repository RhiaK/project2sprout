
var mongoose = require("mongoose");
// mongoose.connect('mongodb://localhost/sprout');
module.exports.User = require("./user.js");
// module.exports.Session = require('./session.js');
if (process.env.NODE_ENV == "production") {
  mongoose.connect(process.env.MLAB_URL);
} else {
  mongoose.connect("mongodb://localhost/sprout");
}