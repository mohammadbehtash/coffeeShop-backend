const mongoose=require('mongoose')
const categoryValidator = require('../validators/category')

const schema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    href:{
        type:String,
        required:true
    },
    cover:{
        type:String,
    }
},{timestamps:true})

schema.statics.categoryValidation=function(body){
    return categoryValidator.validate(body,{abortEarly:false})
}

const model=mongoose.model('Category',schema)
module.exports=model