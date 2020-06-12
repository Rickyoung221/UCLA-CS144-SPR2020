var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//
// place your code here
//
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
    if (err) throw err;
    console.log("Connected successfully to server");
    var db = client.db("Final");
    client.close();
});

var fetch = require("node-fetch");
app.post("/proxy/", function (req, res, next) {
    fetch('http://oak.cs.ucla.edu/classes/cs144/examples/exam/proxy/', {
        method: 'post',
        body: JSON.stringify(req.body),
        headers: {
            'Content-Type': req.headers["content-type"],
            'Content-Length': req.headers["content-length"]
        },
    }).then(
        function (fres) {
            fres.text().then(
                function (text) {
                    res.set({
                        "Content-Type": fres.headers.get('content-type'),
                        "Content-Length": fres.headers.get('content-length'),
                        "Host": req.hostname
                    });
                    res.status(fres.status);
                    res.send(text);
                    res.end();
                },
                function (err) {
                    res.status(500);
                    res.send(err);
                    res.end();
                }
            );
        },
        function (err) {
            res.status(500);
            res.send(err);
            res.end();
        }
    )
});

app.get("/api/", function (req, res, next) {
    var sid = req.query.sid;
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        db.db("Final").collection("Students").findOne({ "sid": Number(sid) }).then(
            (stu) => {
                try {
                    res.setHeader('Content-Type', 'application/json; charset=utf-8');
                    if (stu == null) {
                        res.status(404).send(createError.NotFound());
                    } else {
                        res.status(200);
                        delete stu._id;
                        res.send(stu);
                    }
                    res.end();
                } catch (error) {
                    res.status(500).send(error).end();
                }
            },
            (err) => {
                res.status(500).send(err).end();
            }
        );
    });
});

app.get("/student/", function (req, res, next) {
    var sid = req.query.sid;
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        db.db("Final").collection("Students").findOne({ "sid": Number(sid) }).then(
            (stu) => {
                try {
                    res.setHeader('Content-Type', 'text/html; charset=utf-8');
                    if (stu == null) {
                        res.status(404).render("error", {
                            message: "No such student",
                            error: createError.NotFound()
                        });
                    } else {
                        res.status(200);
                        res.render("student", stu);
                    }
                } catch (error) {
                    res.status(500).render("error", {
                        message: "No such student",
                        error: error
                    });
                }
            },
            (err) => {
                res.status(500).render("error", {
                    message: "No such student",
                    error: err
                });
            }
        );
    });
});

module.exports = app;
