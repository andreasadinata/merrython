//list out things that we need
DATABASE_URL =
    'mongodb://localhost/where-to-hike-db';

//db settings
const mongoose = require('mongoose');
//const {
//    TEST_DATABASE_URL
//} = require('../config');
const {
    Comment
} = require('../models');

//chai settings
const chai = require('chai');
const chaiHTTP = require('chai-http');
const faker = require('faker');
const should = chai.should();
chai.use(chaiHTTP);

//server settings
const {
    app, runServer, closeServer
} = require('../server');


//start with faker to create a random data that we can use to test
function seedCommentData() {
    console.info('seeding the database');
    const seedData = [];
    for (let i = 1; i <= 10; i++) {
        seedData.push(generateData())
    }
    return Comment.insertMany(seedData);
}

function generateData() {
    data = {
        username: faker.name.findName(),
        userLocation: faker.address.zipCode(),
        postDate: faker.date.recent(),
        eventName: faker.lorem.sentence(),
        userComment: faker.lorem.text()
    };
    return data;
}

//reset function
function tearDownDb() {
    console.warn('Deleting Database');
    return mongoose.connection.dropDatabase();
}


describe('active-test', function () {
    //instruction before everything start to make sure
    //before and after steps
    before(function () {
        return runServer(TEST_DATABASE_URL);
    });
    beforeEach(function () {
        return seedCommentData();
    });


    //main part of the test
    //start with get
    describe('test GET endpoint', function () {
        it('should list all the data', function () {
            return chai.request(app)
                .get('/active')
                .then(function (_res) {
                    res = _res;
                    res.should.have.status(200);
                    res.body.should.have.length.of.at.least(1);
                    return Comment.count(); //
                })
                .then(count => {
                    res.body.should.have.length.of(count);
                });
        });
    });

    //continue with post
    describe('Test POST endpoint', function () {
        it('should add new comment', function () {
            const newPost = generateData();
            chai.request(app)
                .post('/post-comment')
                .send(newPost)
                .then(function (res) { //ask marius the process of first and second then
                    res.should.have.status(201);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.include.keys(
                        'id', 'username', 'userLocation', 'postDate', 'eventName', 'userComment');
                    res.body.username.should.equal(newPost.username);
                    // cause Mongo should have created id on insertion
                    res.body.id.should.not.be.null;
                    res.body.userLocation.should.equal(newPost.userLocation);
                    res.body.postDate.should.equal(newPost.postDate);
                    res.body.eventName.should.equal(newPost.eventName);
                    res.body.userComment.should.equal(newPost.userComment);

                    return Comment.findById(res.body.id).exec();
                })
                .then(function (post) { //what makes these two functions are different?
                    post.username.should.equal(newPost.username);
                    post.userLocation.should.equal(newPost.userLocation);
                    post.postDate.should.equal(newPost.postDate);
                    post.eventName.should.equal(newPost.eventName);
                    post.userComment.should.equal(newPost.userComment);
                });
        });
    });

    describe('Test PUT endpoint', function () {
        it('should update fields which are being sent', function () {
            const updateData = {
                username: 'cats cats cats',
                eventName: 'Go run go!',
                userComment: 'dogs dogs dogs'
            }
            return Comment.findOne()
                .exec()
                .then(post => {
                    updateData.id = post.id;
                    return chai.request(app)
                        .put(`/update-comment/${post.id}`)
                        .send(updateData);
                })
                .then(res => {
                    res.should.have.status(201);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.username.should.equal(updateData.username);
                    res.body.eventName.should.equal(updateData.eventName);
                    res.body.userComment.should.equal(updateData.userComment);
                    return Comment.findById(res.body.id).exec();
                })
                .then(post => {
                    post.username.should.equal(updateData.username);
                    post.eventName.should.equal(updateData.eventName);
                    post.userComment.should.equal(updateData.userComment);
                });
        });
    });
    describe('Check Delete endpoint', function () {
        it('should delete a post based on the id', function () {
            let post;
            return Comment.findOne().exec()
                .then(_post => {
                    post = _post;
                    return chai.request(app).delete(`/delete-comment/${post.id}`);
                })
                .then(res => {
                    res.should.have.status(204);
                    return Comment.findById(post.id);
                });
        });
    });

    afterEach(function () {
        return tearDownDb();
    });
    after(function () {
        return closeServer();
    });
});
