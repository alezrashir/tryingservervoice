var express = require('express');
//var router = express.Router();
var app = express();

/* GET home page. */
app.get('/', function(req, res, next) {
  res.end('shirrrr');
});


app.get('/function', function(req, res, next) {
    res.end('function');
});

;
        module.exports = app;
