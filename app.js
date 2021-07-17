const express = require('express');
const path = require('path');

const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');

require('./passport');
const config = require('./config');

const indexRoute = require('./routes/index');
const authRoute = require('./routes/auth');
const taskRoute = require('./routes/task');

mongoose.connect(config.dbConnString, {useNewUrlParser: true});
global.User = require('./models/user');
global.Task = require('./models/task');
const app = express();

app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'hbs')

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValidator());

app.use(cookieParser());
app.use(session({
    secret: config.sessionKey,
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, '/public')));

app.use(function(req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }
    next();
});

app.use('/', indexRoute);
app.use('/', authRoute);
app.use('/', taskRoute);

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;