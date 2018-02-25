var express = require('express');
//var router = express.Router();
var app = express();
var Busboy = require('busboy');
var multer = require('multer')

//cloudconvert = new (require('cloudconvert'))('5NuswuAozpRdbnOP2xyTijteFhOOx9yZm4dkJDqMbWtLBDSQ7gIu7RofWKL5PaWg8pbB13OdpuEVOwao6EbmwQ');
var result;
var Client = require('ftp');

var c = new Client();



app.get('/', function(req, res, next) {
  res.end('shirrrr');
});


app.get('/function', function(req, res, next) {
    res.end('function');
});
app.post('/function', function (req, res) {
  console.log('post shir');
    var busboy = new Busboy({ headers: req.headers });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        console.log("In bus boy");
        var c = new Client();
        c.on('ready', function() {

           console.log("the file name is "+filename);

                c.put(file, '/site1/'+filename, function(err) {
                    if (err) throw err;
                    c.end();
                });
            });

        c.connect({
            host: 'ftp-eu.site4now.net',
            user: 'myfridgeapp2-001',
            port: 21,
            password: 'login12345',
            secure: true,
            secureOptions: { rejectUnauthorized: false }
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
