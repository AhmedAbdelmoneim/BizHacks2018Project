var express        = require('express');
var bodyParser     = require('body-parser');
var request        = require('request');

// Set up express app
var app = express();
app.use(bodyParser.urlencoded({extended: true}));

// Home page
app.get('/', function (req, res) {
  //res.setHeader('Content-Type', 'application/json');
  //res.json(JSON.stringify({ a: "1" }, null, 3));
})

// Get Request with ID
app.get('/:id', function(req, res, next){
  var id = req.params.id;
  var temp;
  var url = 'https://bizhacks.bbycastatic.ca/mobile-si/si/v4/pdp/overview/' + id +'?lang=en';
      request(url,function(error,response,body){
            body = JSON.parse(body);
            temp = body.categoryId;
            //res.setHeader('Content-Type', 'application/json');
            res.json(JSON.stringify({ categoryID: temp }, null, 3));
            res.redirect("/");
      });
});

 // Start up server
 app.listen(8000, function () {
   console.log('Server Started!');
 })
