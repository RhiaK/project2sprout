// const mongoose = require('mongoose');
// if (process.env.NODE_ENV == "production") {
//   console.log("connecting to... " + process.env.NODE_ENV)
//   console.log("also connecting to mlab  " + process.env.MLAB_URL)
//   mongoose.connect(process.env.MLAB_URL)
// } else {
//   console.log("this is local ")
//   mongoose.connect("mongodb://localhost/sprout");
// }

// const Schema = mongoose.Schema;

// let LocSchema = new Schema({
//   loc: String
// });

// var Loc = mongoose.model('Loc', LocSchema);
// module.exports = Loc;

// LocSchema.create = function(loc, callback){
//   let LocModel = this;
//     console.log("location is: ", loc);

//       LocModel.create({
//         loc: loc
//       }, callback);
// };
