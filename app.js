require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
// const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');

require ('./config/db.config');
require ('./config/passport.config').init(passport);


const sessionRouter = require('./routes/sessions.routes');
const adminsRouter = require('./routes/admins.routes');
const groupsRouter = require('./routes/groups.routes');
const paymentRouter = require('./routes/payments.routes');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: process.env.COOKIE_SECRET || 'Super Secret',
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 60*60*24*2
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', sessionRouter);
app.use('/admins', adminsRouter);
app.use('/groups', groupsRouter);
app.use('/payments',paymentRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err)

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

module.exports = app;
