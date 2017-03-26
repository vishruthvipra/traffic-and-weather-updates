var express = require('express');
var app = express();

var mongoose = require("mongoose");
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// configure a public directory to host static content
app.use(express.static(__dirname + '/public'));

//var connectionString = 'mongodb://assgn-user:assgn-pass@ds129090.mlab.com:29090/assgn';

var connectionString = 'mongodb://127.0.0.1:27017/project';
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

require("./serverfiles/models.server.js")(app,mongoose);

var port = process.env.PORT || 3000;

app.listen(port);
