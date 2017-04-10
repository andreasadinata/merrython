const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
        name: {
            type: String
        },
        location: {
            type: String
        },
        event: {
            type: String
        },
        content: {
            type: String
        },
        created: {
            type: String
        }
    }
    //, {
    //    collection: 'blog'
    //}
);

const comment = mongoose.model('comment', blogPostSchema);

module.exports = {
    comment
};
