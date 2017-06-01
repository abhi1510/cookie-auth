var express = require('express');
var morgan = require('morgan');
var cookieParser = require('cookie-parser'); //step 1

var hostname = 'localhost';
var port = 3000;

var app = express();

app.use(morgan('dev'));
app.use(cookieParser('12345-67890-09876-54321')); //step 2 secret key

function auth(req, res, next) {
    console.log(req.headers);

    if(!req.signedCookies.user) {
        var authHeader = req.headers.authorization;
        if(!authHeader) {
            var err = new Error("You are not authenticated!")
            err.status = 401; //authorization failed
            next(err);
            return;
        }
        var auth = new Buffer(authHeader.split(' ')[1], "base64").toString().split(':');
        var user = auth[0];
        var pass = auth[1];
        if(user === "admin" && pass === "password") {
            res.cookie('user', 'admin', {signed: true}); // step 3 set cookie on successful auth and set it in res
            next(); //authorized
        } else {
            var err = new Error("You are not authenticated!")
            err.status = 401; //authorization failed
            next(err);
        }
    } else {
        
    }
}

app.use(express.static(__dirname+'/public/'))

app.listen(port, hostname, function() {
    console.log("Server running at http://"+hostname+":"+port)
})
