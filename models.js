const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
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
    versionKey: false
}, {
    collection: 'comment'
});

const Comment = mongoose.model('Comment', CommentSchema);

CommentSchema.methods.apiRepr = function () {
    return {
        id: this._id,
        username: this.username,
        userLocation: this.userLocation,
        postDate: this.postDate,
        eventName: this.eventName,
        userComment: this.userComment
    };
}

module.exports = {
    Comment
};
