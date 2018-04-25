var express = require('express');
var router = express.Router();
// router.use('/signup', require('./signup'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
