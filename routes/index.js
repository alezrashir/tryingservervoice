var express = require('express');
//var router = express.Router();
var app = express();
var Busboy = require('busboy');
var multer = require('multer')
var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var speech_to_text = new SpeechToTextV1({
    username: '1704b858-59b1-408b-b6e8-133935058cbb',
    password: 'ERtjQIOZJ0VS'
});
cloudconvert = new (require('cloudconvert'))('xbXk2aWeBSPNEZJnS4kQ10JZTxi96fWWXIbXTXKBBNZwmv11zd4ZSGy8HmyItytFqR1ZOw_iE7JHl7M31vNoyQ');
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

            console.log("the file name is " + filename);

            c.put(file, '/site1/input.3gp', function (err) {
                if (err) throw err;

                console.log("the input file is loaded");
                cloudconvert.convert({
                    inputformat: '3gp',
                    outputformat: 'mp3',
                    input: {
                        ftp: {
                            host: 'ftp-eu.site4now.net',
                            port: '21',
                            user: 'myfridgeapp2-001',
                            password: 'login12345'
                        }
                    },
                    file: '/site1/input.3gp',
                    filename: 'input.3gp',
                    output: {
                        ftp: {
                            host: 'ftp-eu.site4now.net',
                            port: '21',
                            user: 'myfridgeapp2-001',
                            password: 'login12345',
                            path: '/site1/output.mp3'
                        }
                    }

                }).on('error', function (err) {
                    console.error('Failed convert: ' + err);
                }).on('finished', function (data) {
                    console.log('Done convert:!!!!!!!!!!!!!!!!! ' + data.message);

                    c.get('/site1/output.mp3', function (err, stream) {
                        if (err) throw err;


                    var params = {
                        audio: stream,
                        content_type: 'audio/mp3',
                        timestamps: true,
                        word_alternatives_threshold: 0.9,
                        keywords: ['tomatoes', 'tomato', 'tomatos', 'cucamber', 'cucumber', 'grapes'],
                        keywords_threshold: 0.5
                    };
                    speech_to_text.recognize(params, function (error, transcript) {
                        if (error)
                            console.log('Error watson:', error);
                        else {
                            console.log(JSON.stringify(transcript, null, 2));
                           var result =JSON.stringify(transcript, null, 2);

                               //  console.log(transcript.results[0].alternatives[0].transcript);
                           console.log("final text");

                          console.log(transcript.results[0].alternatives[0].transcript.toString());
//                            console.log(transcript.results[1].alternatives[0].transcript.toString());

                          var  stringresult = {msg: transcript.results[0].alternatives[0].transcript.toString()};

                            res.send(stringresult);
                        }
                    });
                });
                    //  var f2 = this.pipe(fs.createWriteStream('./output.mp3'));


                });
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




    });
    req.pipe(busboy);

});


        module.exports = app;
