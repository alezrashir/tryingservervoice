var express = require('express');
var router = express.Router();
var url = require('url');
/* GET users listing. */
router.get('/', function(req, res, next) {
    var queryData = url.parse(req.url, true).query;
    var mysql = require('mysql');
    var config = {
         host: 'mysql6001.site4now.net',
        user: 'a35176_fridge',
        password: 'login12345',
        database: 'db_a35176_fridge',

    }

    var connection = mysql.createConnection(config);

    connection.connect();


    switch(queryData.function){
        case "Login":



           connection.query("SELECT  fridgeid  from users where username='" + queryData.username +  "'and password='" + queryData.password + "'",
               function (err, rows, fields) {
                   if (!err) {

                       if (rows.length > 0) {
                           var login = {msg: rows}
                           res.send(login);
                       }

                       else {
                           var error = {msg: 'user is not valid'}
                           res.send(error);
                       }
                   }
                   else {
                       var error = {msg: ' error-problem!'}
                       res.send(error);
                   }

               });

break;


case "updateUser":
    connection.query("update users SET password='"+queryData.password+"' , email='"+queryData.email+"' , phone='"+queryData.phone+"' WHERE username='"+queryData.username+"'",
        function(err,rows2,fileds2) {
            if(!err){
                var Update = {msg: 'Update done'}
                res.send(Update);
            }
        });
    break;

        case "getUserInfo":

            connection.query("SELECT  *  from users where username='" + queryData.username +  "'",
                function (err, rows, fields) {
                    if (!err) {

                        if (rows.length > 0) {
                            var login = {msg: rows}
                            res.send(login);
                        }

                        else {
                            var error = {msg: 'user is not valid'}
                            res.send(error);
                        }
                    }
                    else {
                        var error = {msg: ' error-problem!'}
                        res.send(error);
                    }

                });

            break;

        case "Register":


            connection.query("SELECT * from fridges where fridgeid='" + queryData.fridge +  "'and password='" + queryData.fridgecode + "'",
                function (err, rows,fields) {
                   if(!err)
                   {

                       if(rows.length == 0){
                           var  Register= {msg: 'Fridge Connection Error'}
                           res.send(Register);

                        }


                   }
                   else
                    {

                        var error = {msg: ' error-problem!'}
                        res.send(error);
                    }

                });




    connection.query("SELECT * from users where username='"+queryData.username+"' and password='"+queryData.password+"'",
                function(err,rows1,fileds1)
                {
                    if(!err){
                        if(rows1.length>0){
                            var Register = {msg: 'User Taken'}
                            res.send(Register);
                        }

                    }
                    else{
                        var error = {msg: ' error-problem!'}
                        res.send(error);
                    }

                });

            connection.query("INSERT INTO users (username,fridgeid,password,email,phone) VALUES ('"+queryData.username+"','"+queryData.fridge+"','"+queryData.password+"','"+queryData.email+"','"+queryData.phone+"')",

           function(err,rows2,fileds2) {
            if(!err){
            var Register = {msg: 'register done'}
            res.send(Register);
             }
           });
            break;


        case "FridgeSign":

            connection.query("SELECT * from fridges where fridgeid='" + queryData.fridge +  "'",
                function (err, rows,fields) {
                    if(!err)
                    {

                        if(rows.length > 0){
                            var  Register= {msg: 'Fridge Taken'}
                            res.send(Register);

                        }


                    }
                    else
                    {

                        var error = {msg: ' error-problem!'}
                        res.send(error);
                    }

                });

            connection.query("INSERT INTO fridges (fridgeid,password,address) VALUES ('"+queryData.fridge+"','"+queryData.fridgecode+"','"+queryData.address+"')",
                function (err,rows1,fields1) {
                if(!err){
                    var  Register= {msg: 'register done'}
                    res.send(Register);

                }

                else{
                    var error = {msg: ' error-problem!'}
                    res.send(error);
                }

                });

break;


             }




    connection.end();
});








module.exports = router;





