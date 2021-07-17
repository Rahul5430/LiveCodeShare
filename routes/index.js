const express = require('express');
const router = express.Router();

const nodemailer = require('nodemailer');
const config = require('../config');
const transporter = nodemailer.createTransport(config.mailer);

router.get('/', function(req, res, next) {
    res.render('index', {title: 'LiveCodeShare'});
});

router.get('/about', function(req, res, next) {
    res.render('about', {title: 'LiveCodeShare'});
});

router.route('/contact')
    .get(function(req, res, next) {
        res.render('contact', {title: 'LiveCodeShare'});
    })
    .post(function (req, res, next) {
        req.checkBody('name', 'Empty name').notEmpty();
        req.checkBody('email', 'Invalid email').isEmail();
        req.checkBody('message', 'Empty message').notEmpty();
        var errors = req.validationErrors();

        if (errors) {
            res.render('contact', {
                title: 'Code4Share - a platform for sharing code.',
                name: req.body.name,
                email: req.body.email,
                message: req.body.message,
                errorMessages: errors
            });
        } else {
            var mailoptions = {
                from: 'LiveCodeShare <no-reply@livecodeshare.com>',
                to: 'rahul213himani@gmail.com',
                subject: 'You got a new message from the visitor',
                text: `${req.body.name} (${req.body.email}) says: ${req.body.message}`
            };
            console.log(mailoptions);
            transporter.sendMail(mailoptions, function (error, info) {
                if (error) {
                    return console.log(error);
                }
                res.render('thank', {title: 'Code4Share - a platform for sharing code.'});
            });
        }
    });

module.exports = router;