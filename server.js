var express       = require('express');
var mongoose      = require("mongoose");
var bodyParser    = require('body-parser');
var passport      = require('passport');
var cookieParser  = require('cookie-parser');
var session       = require('express-session');


var app = express();

app.use(session({
    secret: 'this is the secret',
    resave: true,
    saveUninitialized: true
}));

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// configure a public directory to host static content
app.use(express.static(__dirname + '/public'));

// var connectionString = 'mongodb://username:password@ds143900.mlab.com:43900/project';
var connectionString = 'mongodb://username:password@ds149040.mlab.com:49040/project';

// mongoose.connect(connectionString);
// if(process.env.MLAB_USERNAME) {
//     connectionString = process.env.MLAB_USERNAME + ":" +
//         process.env.MLAB_PASSWORD + "@" +
//         process.env.MLAB_HOST + ':' +
//         process.env.MLAB_PORT + '/' +
//         process.env.MLAB_APP_NAME;
// }
//

console.log(connectionString);
mongoose.connect(connectionString);

require("./serverfiles/models.server.js")(app, mongoose, passport);

var port = process.env.PORT || 3000;

app.listen(port);
