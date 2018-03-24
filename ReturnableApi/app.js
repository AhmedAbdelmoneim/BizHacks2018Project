var express        = require('express');
var MongoClient    = require('mongodb').MongoClient;
var bodyParser     = require('body-parser');

// Set up express app
var app = express();
app.use(bodyParser.urlencoded({extended: true}));


// Start up server
app.listen(8000, function () {
  console.log('Server Started!');
})
