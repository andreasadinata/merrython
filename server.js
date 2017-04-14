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
    Comment
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
    //ask marius about how to get current date on the correct format in node
    var emitter = new events.EventEmitter();
    unirest.get('http://api.amp.active.com/v2/search/?near=' + data + '&query=hiking&radius=80&country=United+States&current_page=1&per_page=20&start_date=2017-01-01..&sort=distance&api_key=c7uavra377u4dbmbkhs7h52h')
        //        .header({
        //            'Accept': 'application/json'
        //        })
        //        .end(function (res) {
        //            console.log(res.status, res.headers, res.body)
        //        })
        .header("Accept", "application/json")
        .end(function (result) {

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
    Comment.find(function (err, items) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(200).json(items);
    });
});


app.post('/post-comment', function (req, res) {
    var requiredFields = ['username', 'userLocation', 'postDate', 'eventName', 'userComment'];
    for (var i = 0; i < requiredFields.length; i++) {
        var field = requiredFields[i];
        if (!(field in req.body)) {
            var message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    Comment.create({
        username: req.body.username,
        userLocation: req.body.userLocation,
        postDate: req.body.postDate,
        eventName: req.body.eventName,
        userComment: req.body.userComment
    }, function (err, item) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(201).json(item);
    });
});

//broken code
//app.post('/post-comment', function (req, res) {
//    const requiredFields = ['username', 'userLocation', 'postDate', 'eventName', 'userComment'];
//    for (let i = 0; i < requiredFields.length; i++) {
//        const field = requiredFields[i];
//        if (!(field in req.body)) {
//            const message = `Missing \`${field}\` in request body`
//            console.error(message);
//            return res.status(400).send(message);
//        }
//    }
//    Comment
//        .create({
//            username: req.body.username,
//            userLocation: req.body.userLocation,
//            postDate: req.body.postDate,
//            eventName: req.body.eventName,
//            userComment: req.body.userComment
//        })
//        .then(Comment => res.status(201).json(Comment.apiRepr()))
//        .catch(err => {
//            console.error(err);
//            res.status(500).json({
//                error: 'Something went wrong'
//            });
//        });
//});


//app.post('/posts', (req, res) => {
//    const requiredFields = ['title', 'content', 'author'];
//    for (let i = 0; i < requiredFields.length; i++) {
//        const field = requiredFields[i];
//        if (!(field in req.body)) {
//            const message = `Missing \`${field}\` in request body`
//            console.error(message);
//            return res.status(400).send(message);
//        }
//    }
//    BlogPost
//        .create({
//            title: req.body.title,
//            content: req.body.content,
//            author: req.body.author
//        })
//        .then(blogPost => res.status(201).json(blogPost.apiRepr()))
//        .catch(err => {
//            console.error(err);
//            res.status(500).json({
//                error: 'Something went wrong'
//            });
//        });
//
//});







module.exports = {
    runServer, app, closeServer
};
