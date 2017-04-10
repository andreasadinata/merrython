//explain packages that we need
const app = express();
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const unirest = require('unirest');
const events = require('events');
//take data from config and models
const {
    DATABASE_URL, PORT
} = require('./config');
const {
    comment
} = require('./models');
//define usage of the app
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(express.static('public'));
mongoose.Promise = global.Promise;
app.use('*', function (req, res) {
    res.status(404).json({
        message: 'Not Found'
    });
});

// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl = DATABASE_URL, port = PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, err => {
            if (err) {
                return reject(err);
            }
            server = app.listen(port, () => {
                    console.log(`Your app is listening on port ${port}`);
                    resolve();
                })
                .on('error', err => {
                    mongoose.disconnect();
                    reject(err);
                });
        });
    });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

//request data from API Call
function getData(data) {
    unirest.get('http://api.amp.active.com/v2/search/?near=San+Diego&radius=50&city=San+Diego&country=United+States&current_page=1&per_page=10&sort=distance&exclude_children=true&api_key=C7UAVRA377U4DBMBKHS7H52H')
        .headers({
            'Accept': 'application/json'
        })
        .end(function (res) {
            console.log(res.status, res.headers, res.body)
        })
}




// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
    runServer().catch(err => console.error(err));
};

module.exports = {
    runServer, app, closeServer
};
