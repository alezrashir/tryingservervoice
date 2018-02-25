var express = require('express');
//var router = express.Router();
var app = express();
var path = require('path');
var fs = require('fs');
cloudconvert = new (require('cloudconvert'))('5NuswuAozpRdbnOP2xyTijteFhOOx9yZm4dkJDqMbWtLBDSQ7gIu7RofWKL5PaWg8pbB13OdpuEVOwao6EbmwQ');
var busboy = require('connect-busboy');
var result;
var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var speech_to_text = new SpeechToTextV1({
    username: '1704b858-59b1-408b-b6e8-133935058cbb',
    password: 'ERtjQIOZJ0VS'
});
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

        var saveTo = path.join('.', 'input.3gp');

      //  console.log('Uploading: ' + saveTo);

        var f =   file.pipe(fs.createWriteStream(saveTo));
        f.on('finish', function () {




    //        console.log("the input file is loaded");
            cloudconvert.convert({
                inputformat: '3gp',
                outputformat: 'mp3',
                file: fs.createReadStream('./input.3gp'),

            }).on('error', function (err) {
            //    console.error('Failed: ' + err);
            }).on('finished', function (data) {
             //   console.log('Done:!!!!!!!!!!!!!!!!! ' + data.message);
                var f2 = this.pipe(fs.createWriteStream('./output.mp3'));
                f2.on('finish', function () {
            //        console.log("output loaded!!!!!!!!!");


                    var params = {
                        audio: fs.createReadStream('./output.mp3'),
                        content_type: 'audio/mp3',
                        timestamps: true,
                        word_alternatives_threshold: 0.9,
                        keywords: ['tomatoes', 'tomato', 'tomatos'],
                        keywords_threshold: 0.5
                    };
                    speech_to_text.recognize(params, function (error, transcript) {
                        if (error)
                            console.log('Error:', error);
                        else {
                            console.log(JSON.stringify(transcript, null, 2));
                            console.log(transcript.results[0].alternatives[0].transcript);
                        
                            result = JSON.stringify(transcript, null, 2)
                        }
                    });
                });
            }).on('downloaded', function (destination) {
                console.log('Downloaded to: ' + destination.path);
            });

        });

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
