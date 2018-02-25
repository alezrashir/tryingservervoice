var express = require('express');
//var router = express.Router();
var app = express();
var Busboy = require('busboy');
var result;

/* GET home page. */
app.get('/', function(req, res, next) {
  res.end('shirrrr');
});


app.get('/function', function(req, res, next) {
    res.end('function');
});
app.post('/function', function (req, res) {
  console.log('post shir')
    var busboy = new Busboy({ headers: req.headers });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        console.log("In bus boy");
        // We are streaming! Handle chunks
        file.on('data', function(data) {
            // Here we can act on the data chunks streamed.
            console.log("Chunk mila");
        });

        // Completed streaming the file.
        file.on('end', function() {
            console.log('Finished with ' + fieldname);
            result={msg: filename  };
        });
    });
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
        console.log('Field [' + fieldname + ']: value: ' + inspect(val));
    });

    busboy.on('finish', function() {
        console.log("out of busboy");



        res.send(result);
    });
    req.pipe(busboy);
});


        module.exports = app;
