const MongoClient = require('mongodb').MongoClient;

let client = null;

// create a connection to url and call callback()
module.exports.connect = function (url, callback) {
    if (client) {
        // Connection has already been established
        callback();
    }
    // create a new connection
    client = new MongoClient(url, { useUnifiedTopology: true });
    client.connect(function (err) {
        if (err) {
            client = null;
            callback(err);
        } else {
            callback();
        }
    });
}

// get database using pre-established connection
module.exports.db = function (dbName) {
    return client.db(dbName);
}

// close open connection
module.exports.close = function () {
    if (client) {
        client.close();
        client = null;
    }
}