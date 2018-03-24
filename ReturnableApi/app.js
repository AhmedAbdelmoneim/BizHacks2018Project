var express        = require('express');
var bodyParser     = require('body-parser');

// Set up express app
var app = express();
app.use(bodyParser.urlencoded({extended: true}));

// Home page
app.get('/', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.json(JSON.stringify({ a: "1" }, null, 3));
})

// Post Request with ID
app.get('/:id', function(req, res, next){
    console.log(req.params.id);
    res.redirect("/");
});

 // Start up server
 app.listen(8000, function () {
   console.log('Server Started!');
 })
