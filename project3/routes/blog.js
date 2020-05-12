let express = require('express');
let commonmark = require('commonmark');
const assert = require('assert');
let reader = new commonmark.Parser();
let writer = new commonmark.HtmlRenderer();
let router = express.Router();
var client= require('../db')
//let app = express();
/* GET users post. */
router.get('/:username/:postid', function (req, res) {
  console.log('received username and postid');
  let username = req.params.username;

  let postid =  parseInt(req.params.postid);
  let posts = [];
  let collection = client.db('BlogServer').collection('Posts');

  //console.log(collection.find());
  collection.findOne({
              "username": username,
              "postid": postid
            }, function(err, result)  {
            if (err) throw err;
            if (result != null) {
                console.log('Get result');
                let title = result.title;
                let body = result.body;
                let parsedTitle = reader.parse(title);
                let htmlTitle = writer.render(parsedTitle);

                let parsedBody = reader.parse(body);
                let htmlBody = writer.render(parsedBody);
                let post = {
                  title: htmlTitle,
                  body: htmlBody
                };
                posts.push(post);
            }
              res.render('blog', {
                username: username,

                posts: posts,
                nextid: null
              });

            });



});


router.get('/:username', function (req, res) {
  console.log('received username and postid');
  let username = req.params.username;
  let startid = req.query.start;
  let nextid = null;

  //let postid =  parseInt(req.params.postid);
  let posts = [];
  let collection = client.db('BlogServer').collection('Posts')
  if (startid == null){
  collection.find({"username": username}).toArray(function(err, result){
    if (err) throw err;
    if(result.length > 5) {
        nextid = result[5].postid
        result = result.slice(0,5)
        }
    for (let doc of result){
        console.log('Get result');
        let title = doc.title;
        let body = doc.body;
        let parsedTitle = reader.parse(title);
        let htmlTitle = writer.render(parsedTitle);

        let parsedBody = reader.parse(body);
        let htmlBody = writer.render(parsedBody);
        let post = {
            title: htmlTitle,
            body: htmlBody
            };
        posts.push(post);
        }
    res.render('blog', {
                       username: username,
                       posts: posts,
                       nextid: nextid
                       });
  });
  }else{
    collection.find({"username": username,'postid': {$gte: parseInt(startid, 10)}})
    .toArray(function(err, result){
        if (err) throw err;
        if(result.length > 5) {
                nextid = result[5].postid
                result = result.slice(0,5)
            }
        for (let doc of result){
                console.log('Get result');
                let title = doc.title;
                let body = doc.body;
                let parsedTitle = reader.parse(title);
                let htmlTitle = writer.render(parsedTitle);

                let parsedBody = reader.parse(body);
                let htmlBody = writer.render(parsedBody);
                let post = {
                    title: htmlTitle,
                    body: htmlBody
                    };
                posts.push(post);
                }
        res.render('blog', {
                               username: username,
                               posts: posts,
                               nextid: nextid
                               });
    });
    }
  });
module.exports = router;