const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    username: {
        type: String
    },
    userLocation: {
        type: String
    },
    postDate: {
        type: String
    },
    eventName: {
        type: String
    },
    userComment: {
        type: String
    }
}, {
    collection: 'where-to-hike-db'
});

const comment = mongoose.model('comment', commentSchema);

module.exports = {
    comment
};
