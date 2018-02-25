var express = require('express');
//var router = express.Router();
var app = express();

var busboy = require('connect-busboy');
var result;

app.use(busboy());
/* GET home page. */
app.get('/', function(req, res, next) {
  res.end('shirrrr');
});


app.get('/function', function(req, res, next) {
    res.end('function');
});
app.post('/function', function (req, res) {



    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
console.log("onnnnn");
        result = filename;
        console.log('test!!!!!!!!!!!!!!1'+filename);
        res.end(result);
    });
    req.busboy.on('finish', function () {
     //   console.log('Upload complete doneeee');
        res.writeHead(200, { 'Connection': 'close' });
        console.log('test!!!!!!!!!!!!!!1');
        res.end(result);

    });
})
;
        module.exports = app;
