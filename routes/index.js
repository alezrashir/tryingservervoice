var express = require('express');
//var router = express.Router();
var app = express();
var Busboy = require('busboy');
var multer = require('multer')
var mysql = require('mysql');
var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var speech_to_text = new SpeechToTextV1({
    username: '1704b858-59b1-408b-b6e8-133935058cbb',
    password: 'ERtjQIOZJ0VS'
});
cloudconvert = new (require('cloudconvert'))('7EnsKfcob6yc2oibRZn7xk_KTXGlb9VOX0p7afpReUueOBnr4s_hh41Hv0PQ7NGZ5-WaRLZ3S4-YaPmYUSjJqA');
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

                          var  stringresult = transcript.results[0].alternatives[0].transcript.toString();


                            var config = {
                                host: 'mysql6001.site4now.net',
                                user: 'a35176_fridge',
                                password: 'login12345',
                                database: 'db_a35176_fridge',
                                multipleStatements: true

                            }

                            var connection = mysql.createConnection(config);
                            var arr = stringresult.split(" ");

                            var sqlstring ="select vegetablesphrase.itemid FROM vegetablesphrase WHERE vegetablesphrase.name LIKE '%"+arr[0]+"%'";

                            connection.connect();

                            for(var i=1;i<arr.length-1;i++) {
                              sqlstring = sqlstring+" OR vegetablesphrase.name LIKE '%"+arr[i]+"%'";
                            }

                           console.log(sqlstring);

                            connection.query(sqlstring,
                                function (err,rows1,fields1) {
                                    if(!err) {
                                        var list = {msg: rows1}
                                        res.send(list);
                                    }else{}

                                });
                            connection.end();

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
