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
app.post('/function', function (req, res) {
  console.log('post shir')
res.end("post happend");



})

        module.exports = app;
