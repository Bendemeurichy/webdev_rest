let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
let logger = require('morgan');
let mongoose = require('mongoose');
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let vacatureRouter = require('./routes/vacatures');
let bedrijfRouter = require('./routes/bedrijven')

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

mongoose.set('strictQuery',false);
app.use('/users', usersRouter);
app.use('/vacatures',vacatureRouter);
app.use('/bedrijven',bedrijfRouter);
app.use('/', indexRouter);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




// Define the database URL to connect to.
const mongoDB = "mongodb://localhost:27017/restApi";

// Wait for database to connect, logging an error if there is a problem
dbconnection().catch(err => console.log(err));
async function dbconnection() {
  await mongoose.connect(mongoDB);
  console.log("connected to db")
}
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
