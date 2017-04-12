//list out things that we need
const chai = require('chai');
const chaiHTTP = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const should = chai.should();
const {
    comment
} = require('../models');
const {
    app, runServer, closeServer
} = require('../server');
const {
    TEST_DATABASE_URL
} = require('../config');
chai.use(chaiHTTP);
