const mongoose = require('mongoose')
const createMenuValidator = require('../validators/menu')

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    href: {
        type: String,
        required: true
    },
    parent: {
        type: mongoose.Types.ObjectId,
        ref: 'Menu',
       
    }
}, { timestamps: true })

schema.statics.createValidation=function(body){
    return createMenuValidator.validate(body,{abortEarly:false})
}

const model = mongoose.model('Menu', schema)
module.exports = model