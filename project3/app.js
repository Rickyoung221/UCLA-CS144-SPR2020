var createError = require('http-errors');
let express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let client = require('./db');
let router = express.Router();


//entrance of "middleware" that process the request
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var blogRouter = require('./routes/blog');
var loginRouter = require('./routes/login');
var apiRouter = require('./routes/api');

var app = express();

// set up the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// set up the body parser "middleware"
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// set up the static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/blog', blogRouter);
app.use('/login', loginRouter);
app.use('/api', apiRouter);

// mongo connection on start
client.connect('mongodb://localhost:27017/', function (err) {
    if (err) {
        console.log('Unable to connect to Mongo.');
        process.exit(1);
    } else {
       // app.listen(3000, function () {
            console.log('Listening on port 3000...');
          //  });
    }
});
// When the app starts, it connects to MongoDB server using the connect() method of our db.js module and listens on port 3000

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//export app
module.exports = app;
