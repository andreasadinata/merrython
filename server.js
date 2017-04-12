//explain packages that we need

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
const app = express();
//define usage of the app
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(express.static('public'));
mongoose.Promise = global.Promise;
//app.use('*', function (req, res) {
//    res.status(404).json({
//        message: 'Not Found'
//    });
//});

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
    console.log("inside the get data function = ", data);
    var emitter = new events.EventEmitter();
    unirest.get('http://api.amp.active.com/v2/search/?near=' + data + '&radius=50&country=United+States&current_page=1&per_page=10&sort=distance&exclude_children=true&api_key=c7uavra377u4dbmbkhs7h52h')
        //        .header({
        //            'Accept': 'application/json'
        //        })
        //        .end(function (res) {
        //            console.log(res.status, res.headers, res.body)
        //        })
        .header("Accept", "application/json")
        .end(function (result) {
            //console.log(result.status, result.headers, result.body);
            //success scenario
            if (result.ok) {
                emitter.emit('end', result.body);

            }
            //failure scenario
            else {
                emitter.emit('error', result.code);
                console.log("hello");
            }
        });

    return emitter;
};

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
    runServer().catch(err => console.error(err));
};

app.get('/activity/:name', function (req, res) {


    //    external api function call and response

    var searchReq = getData(req.params.name);

    //get the data from the first api call
    searchReq.on('end', function (item) {
        res.json(item);
    });

    //error handling
    searchReq.on('error', function (code) {
        res.sendStatus(code);
    });

});

app.get('/active', function (req, res) {
    comment
        .find()
        .exec()
        .then()
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: 'something went terribly wrong'
            });
        });
});
app.post('/post-comment', function (req, res) {
    const requiredFields = ['username', 'userLocation', 'postDate', 'eventName', 'userComment'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    comment
        .create({
            'username': req.body.username,
            'userLocation': req.body.userLocation,
            'postDate': req.body.postDate,
            'eventName': req.body.eventName,
            'userComment': req.body.userComment
        })
        .then(comment => res.status(201).json(comment.apiRepr()))
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: 'Something went wrong'
            });
        });
});



module.exports = {
    runServer, app, closeServer
};
