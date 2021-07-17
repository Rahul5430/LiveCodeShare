const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/login', function(req, res, next) {
    res.render('login', {title: 'Login To Your Account'});
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}), function(req, res) {});

router.get('/register', function(req, res, next) {
    res.render('register', {title: 'Register Your Account'});
});

router.post('/register', function(req, res, next) {
    req.checkBody('name', 'Empty Name').notEmpty();
    req.checkBody('email', 'Invalid Email').isEmail();
    req.checkBody('password', 'Empty Password').notEmpty();
    req.checkBody('password', 'Password do not match').equals(req.body.confirmPassword).notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            name: req.body.name,
            email: req.body.email,
            errorMessages: errors
        });
    } else {
        var user = new User();
        user.name = req.body.name
        user.email = req.body.email
        user.setPassword(req.body.password);
        user.save(function(err) {
            if (err) {
                console.log(err);
                res.redirect('register', {errorMessages: err});
            } else {
                res.redirect('login');
            }
        });
    }
});

router.get('/logout', function(req, res) {
    req.logOut();
    res.redirect('/');
});

module.exports = router;