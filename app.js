var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

///////////////////////////////////
const cors = require('cors')
var session = require('express-session')
const bcrypt = require('bcrypt');


/////////////////////////////////////
const db = require('./Connection/Connection')

db.connect(() => {
        console.log("database connected sucessfully")
    })
    //////////////////////////////////////



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/////////////////////////////////////
// these two are use in middlware section this portion is the middleware section


app.use(cors())
    //////////////////////////////
app.use(session({
        secret: 'password',
        // resave: false,
        // saveUninitialized: true,
        cookie: { maxAge: 10000 }
    }))
    ///////////////////////////////////

app.use('/', indexRouter);
app.use('/users', usersRouter);

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