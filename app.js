var express  = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

//Connect to Mongo
mongoose.connect('mongodb://localhost/testForAuth');
var db = mongoose.connection; 

//handle errors from mongo
db.on('error',console.error.bind(console, 'connection error:'));
db.once('open', function(){
//cpnnected
});


//use sessions for tracking logins
app.use(session({
secret: 'Work',
resave: true,
saveUninitialized:false,
store: new MongoStore({
    mongooseConnection:db
})
}));

//parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Server files
app.use(express.static(__dirname + '/templateLogReg'));

//Include routes
var routes = require('./routes/router');
app.use('/',routes);

//404
app.use(function(req,res,next){
var err = new Error('File Not Found');
err.status = 404;
next(err);
});

//error handler
//define as callback
app.use(function (err, req, res, next){
res.status(err.status||500);
res.send(err.message);
});


//app.get('/', (req,res) => res.send('Hello World'))

app.listen(3000, () => console.log('App is live'))