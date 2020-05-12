let assert = require('assert');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');
let createError = require('http-errors');
let express = require('express');
let router = express.Router();
let client = require('../db');
let secretKey = "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c";

// User Logic page method
router.get('/', function(req, res, next) {
    let redirect = "";
    if (req.query.redirect) {
        redirect = req.query.redirect;
    }
    //For testing
    console.log(redirect);
    res.render('login', {'redirect': redirect , 'username':"", 'password':"", 'message':"Please enter your information."});
});


router.post('/', function(req, res) {
    // Connect to the MongoDB server
    let collection = client.db('BlogServer').collection('Users');
    let passwordRaw = req.body.password;
    // Search the password and username
    collection.findOne({'username': req.body.username},function(err, dbRes){
        if (err) throw err;
        // Username Found
        if (dbRes) {
            //Check Password
            let name = dbRes.username
            console.log(name);
            pwHash = dbRes.password;
            bcrypt.compare(passwordRaw, pwHash, function(err2, pwRes){
                if (err2) throw err2;
                //Password correct, set up jwt cookies
                if (pwRes == true){
                    let expiration = new Date();
                    expiration.setHours(expiration.getHours() + 2);

                    let payload = {
                        "exp": expiration.getTime(), //Math.floor(Date.now() / 1000) + 7200,    //expiration time two hours, unit sec
                        "usr": req.body.username
                        };                                       //authenticated username
                    let token = jwt.sign(payload, secretKey, {header: { "alg": "HS256", "typ": "JWT" }});
                    res.cookie("jwt", token);
                    res.status(200);

                    if (!req.body.redirect){
                        res.status(200);
                        res.send("Login Successful!");

                    }else {
                        console.log(req.body.redirect)
                        res.redirect(req.body.redirect);
                    }
                }
                //Password incorrect, return 401
                else{
                    res.status(401);
                    res.render('login', {'username': req.body.username,
                                        'password': req.body.password,
                                        'redirect': req.body.redirect,
                                        'message': "Incorrect Password."});
                }

            });
        }
        // Username Not Found, return 401 and login page
        else {
            res.status(401);
            res.render('login', {'username': req.body.username,
                                 'password': req.body.password,
                                 'redirect': req.body.redirect,
                                 'message': "Invalid password or username."});
        }

    });
        //If any input is null， return 401
    if (req.body.username == null || req.body.password == null){
        res.status(401);
        res.render('login', {'redirect': req.body.redirect, 'username': "", 'password':"",
            'message':"Need to enter both username and password"});
    }
});



module.exports = router;
