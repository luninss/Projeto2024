var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jwt = require('jsonwebtoken'); 
var axios = require('axios');

var indexRouter = require('./routes/index');
var acordaosRouter = require('./routes/acordao');
var tribunalRouter = require('./routes/tribunal');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para variaveis de login e nivel de acesso
app.use((req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, 'PROJETO-EW', (err, decoded) => {
      if (err) {
        res.clearCookie('token');
        res.redirect('/login');
        res.locals.level = false;
        res.locals.loggedin = false;
      } else {
        res.locals.level = decoded.level === 'admin';
        res.locals.loggedin = true;
      }
      next();
    });
  } else {
    res.locals.level = false;
    res.locals.loggedin = false;
    next();
  }
});

// Define routes
app.use('/', indexRouter);
app.use('/acordao', acordaosRouter);
app.use('/tribunal', tribunalRouter);


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  console.log(err);
});

module.exports = app;
