let assert = require('assert');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
let createError = require('http-errors');
let express = require('express');
let router = express.Router();
let client = require('../db');
let secretKey = "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c";


/* helper function */

/* check if a request meet requirements. e.g. such as if not formatting data in JSON, not including required data, etc. Return 400 */
function checkReq (req, res, method) {
 // if (method == "GET" || method == "DELETE") {
    if (method == "GET" ) {
      if (req.params.postid && isNaN(parseInt(req.params.postid))) {
          res.sendStatus(400);
          console.log("The postid is invalid.");
          return false;
      }
        if (parseInt(req.params.postid) < 0)
        {
            res.sendStatus(400);
            console.log("The postid is invalid.");
            return false;
        }

  }
    if (method == "DELETE"){

        if ( isNaN(parseInt(req.params.postid))) {
          res.sendStatus(400);
          console.log("The postid is invalid.");
          return false;
      }
        if (parseInt(req.params.postid) < 0)
        {
            res.sendStatus(400);
            console.log("The postid is invalid.");
            return false;
        }
    }
  if (method == "POST" || method == "PUT") {
      if (req.body.title == null || req.body.body == null) {
        res.sendStatus(400);
        console.log("The request must have title and body.");
        return false;
      }
      if (!req.headers['content-type'] || req.headers['content-type'].indexOf('application/json') !== 0) {
        res.sendStatus(400);
        console.log("Not a formatting data in JSON.")
        return false;
      }
  }
  //Above conditions pass, mean the request meet all requirements.
  return true;
}
/* Check  if the API is protected.  If not protected -> 401.*/
function checkJwt (req, res) {
    let token = req.cookies.jwt;
    let authentication;
    let expiration = Math.floor(Date.now() / 1000);
    if (!token) {
        res.sendStatus(401);
        console.log("Do not have jwt token.");
        return false;
    }
    try {
        authentication = jwt.verify(token, secretKey);
    }catch(err) {
        res.sendStatus(401);
        return false;
    }
    if (authentication.exp <= expiration) {
        res.sendStatus(401);
        console.log("The included jwt has expired.");
        return false;
    } else if (authentication.usr != req.params.username) {
        res.sendStatus(401);
        console.log("The username in jwt does not match the username in the URL.");
        return false;
    }
    return true;
}


/* Return all blog posts by username */
router.get('/:username', async function(req, res, next) {
    try {
        if (checkReq(req, res, "GET") && checkJwt(req, res)) {
            /* Connect MongoDB */
            let collection = client.db('BlogServer').collection('Posts');
            //search username
            let result = await collection.find({'username': req.params.username,
                                                'postid': { $exists: true },
                                                'title': { $exists: true },
                                                'body': { $exists: true },
                                                'created': { $exists: true },
                                                'modified': { $exists: true }
                                                }).toArray();
            res.status(200);
            res.json(result);
            }
        } catch (err) {
        res.sendStatus(400);
        console.exception(err);
    }
});


/* Return the blog post. If exist -> 200. If not -> 404 */
router.get('/:username/:postid', async function(req, res, next) {
 //   console.log("didi");
    try {
     //   console.log("execute");
        let username = req.params.username;
        let postid =  parseInt(req.params.postid);
        if (checkReq(req, res, "GET") && checkJwt(req, res)) {
            /* Connect MongoDB */
           // console.log("if statment did run");
            let collection = client.db('BlogServer').collection('Posts');

            /*
            collection.findOne({
                'username': username,
                'postid': postid
            }, function (err, result) {
                if (err) throw err;
                if (result) {
                    res.sendStatus(200);
                    res.json(result);
                }else {
                    res.sendStatus(404);
                    console.log("post does not exist.");
                    res.json(result);
                }
            });
                 */
            let result = await collection.find({'username': username,
                                                'postid': postid,
                                                'title': { $exists: true },
                                                'body': { $exists: true },
                                                'created': { $exists: true },
                                                'modified': { $exists: true }
                                                }).toArray();
                console.log(result);
                if (result.length != 0) {
                    res.status(200);
                    console.log("post exists");
                    res.json(result);
                }else {
                    res.status(404); //username not found
                    console.log("Post not exist! 404!");
                    res.json(result);
                }
        }
    } catch (err) {
        res.sendStatus(400);
        console.log("error");
    }

});

/* insert a new blog post, success -> return 201 =, if already exist in server,  return 400 "bad request" */
router.post('/:username/:postid', async function(req, res, next) {
    try {
        let username = req.params.username;
        let postid =  parseInt(req.params.postid);
       // let currentTime = (new Date).getTime();
        if (checkReq(req, res, "POST") && checkJwt(req, res)) {
            /* Connect MongoDB */
            let collection = client.db('BlogServer').collection('Posts');
            /*
            collection.findOne({
                'username': username,
                'postid': postid
            }, function (err, result) {
                if (err) throw err;
                if (result) {
                    res.sendStatus(400); //Already exists, bad request. insert new post

                }else {
                    // Insert new doc
                    collection.insertOne({'postid': postid,
                                                'username': username,
                                                'created': Date.now(),
                                                'modified': Date.now(),
                                                'title': req.body.title,
                                                'body': req.body.body}, function(err2, docs) {
                                if (err2) throw err2;
                                console.log(" a new post inserted. ");
                                res.status(201).send('The new post is inserted');
                            });
                }
            });
             */
            let result = null;
            result = await collection.find({'username': username,
                                                'postid': parseInt(req.params.postid),
                                                'title': { $exists: true },
                                                'body': { $exists: true },
                                                'created': { $exists: true },
                                                'modified': { $exists: true }
                                                }).toArray();
            console.log("content: " + result);
            console.log("postid: " + postid);
            console.log("username: " + username);
           // if (result != null){
          //      res.sendStatus(400);    //Already exist
          //      console.log("Post already exists.");
          //  }
            if ( result.length != 0) {
                res.sendStatus(400);    //Already exist
                console.log("Post already exists.");
            }
            else {
                let insert =  await collection.insertOne({ 'username': username,
                                            'postid': postid,
                                            'title': req.body.title,
                                            'body': req.body.body,
                                            'created': Date.now(),
                                            'modified': Date.now(),
                });
                res.sendStatus(201); //Created
                console.log("Insert a post successful.");
            }
        }
    } catch (err) {
        res.status(400).send(err);
        console.log("here");
    }
});

/* Update the existing blog post. Success -> 200, no blog post -> 400 */
router.put('/:username/:postid', async function(req, res, next) {
    try {
        let username = req.params.username;
        let postid =  parseInt(req.params.postid);
       // let currentTime = (new Date).getTime();
        if (checkReq(req, res, "PUT") && checkJwt(req, res)) {
            /* Connect MongoDB */
            let collection = client.db('BlogServer').collection('Posts');
            let updatePart = {
                $set :{
                    'title':req.body.title,
                    'body':req.body.body,
                    'modified': Date.now(),
                }
            };
            let result = await collection.updateOne({'username': username,
                                                'postid': postid,
                                                'title': { $exists: true },
                                                'body': { $exists: true },
                                                'created': { $exists: true },
                                                'modified': { $exists: true }
                                                }, updatePart );
            if (result.length != 0) {
                res.sendStatus(200);    //Already exist
                console.log("Updated.");
            } else {
                    res.sendStatus(400);
                    console.log("Update fail. No such post with this postid by this username");
                }
            }
        } catch(err) {
         res.sendStatus(400);
        console.exception(err);
    }

});

/* Delete the existing post. Success -> 204, no such post -> 400 */
router.delete('/:username/:postid', async function (req, res, next) {
    try {
        let username = req.params.username;
        let postid =  parseInt(req.params.postid);
       // let currentTime = (new Date).getTime();
        if (checkReq(req, res, "DELETE") && checkJwt(req, res)) {
            /* Connect MongoDB */
            let collection = client.db('BlogServer').collection('Posts');
            // Removes a single document from a collection. Return "deletedcount" = 1 if succeed
            let result = await collection.deleteOne({'username': username,
                                                'postid': postid,
                                                'title': { $exists: true },
                                                'body': { $exists: true },
                                                'created': { $exists: true },
                                                'modified': { $exists: true }
                                                });
            //Delete successful
            if (result.deletedCount == 1) {
                res.sendStatus(204);    //Succeed, Not Content
                console.log("Updated. 204: Not content");
            } else {
                    res.sendStatus(400); //No such post, Bad request
                    console.log("No such post, bad request");
                }
            }
        } catch(err) {
        res.sendStatus(400);
        console.exception(err);
    }


});

module.exports = router;