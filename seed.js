const db = require('./models');

var loc_list = [
	{
		loc: "the park"
	},
	{
		loc: "school"
	}
];

// remove all records that match {} -- which means remove ALL records
db.Loc.remove({}, function(err, locs){
    if(err) {
      console.log('Error occurred in remove', err);
    } else {
      console.log('removed all locs');

    // create new records based on the array loc_list
  db.Loc.create(loc_list, function(err, locs){
    if (err) { return console.log('err', err); }
      console.log("created", locs.length, "locs");
      process.exit();
    });
  }
});