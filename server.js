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
    var d = new Date();
    var currentDate = (d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate())
    var emitter = new events.EventEmitter();
    unirest.get('http://api.amp.active.com/v2/search/?query=hiking&query=marathon&query=cycling&query=climbing&query=marathon&near=' + data + '&radius=80&country=United+States&current_page=1&per_page=15&kids=false&start_date=' + currentDate + '..&sort=date&api_key=c7uavra377u4dbmbkhs7h52h')
        .header("Accept", "application/json")
        .end(function (result) {
            if (result.ok) {
                emitter.emit('end', result.body);
            }
            //failure scenario
            else {
                emitter.emit('error', result.code);
            }
        });
    return emitter;
};

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

app.delete('/delete-comment/:id', function (req, res) {
    Comment.findByIdAndRemove(req.params.id)
        .exec()
        .then(() => {
            res.status(204).json({
                message: 'success'
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: 'something went terribly wrong'
            });
        });
});

app.put('/update-comment/:id', function (req, res) {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        res.status(400).json({
            error: 'Request path id and request body id values must match'
        });
    }
    const updated = {};
    const updateableFields = ['username', 'eventName', 'userComment'];
    updateableFields.forEach(field => {
        if (field in req.body) {
            updated[field] = req.body[field];
        }
    });

    Comment
        .findByIdAndUpdate(req.params.id, {
            $set: updated
        }, {
            new: true
        })
        .exec()
        //        .then(updatedPost => res.status(201).json(updatedPost.apiRepr()))
        .catch(err => res.status(500).json({
            message: 'Something went wrong'
        }));

});



module.exports = {
    runServer, app, closeServer
};
