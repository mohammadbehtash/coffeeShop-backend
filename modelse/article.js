const mongoose = require('mongoose');
const { hrefArticleValidator, articleValidator } = require('../validators/article');

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    href: {
        type: String,
     
      
    },
    cover: {
        type: String,
        required: true
    },
    categoryID: {
        type: mongoose.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    creator: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    publish: {
        type: Number,
        required: true
    }
}, { timestamps: true });

schema.statics.validation = function(body) {
    return articleValidator.validate(body, { abortEarly: false });
}

schema.statics.hrefvalidation = function(body) {
    return hrefArticleValidator.validate(body, { abortEarly: false });
}

const model = mongoose.model('Article', schema);
module.exports = model;
