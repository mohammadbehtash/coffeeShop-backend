const mongoose=require('mongoose')

const{createContactValidator,
    answerValidator,
    removeValidator
}=require('../validators/contact')


const schema=new mongoose.Schema({
    name:{type:String,
        required:true
    },
    email:{type:String,
        required:true
    },
    phone:{type:String,
        required:true
    },
    answer:{
        type:Number,
        required:true
    },
    body:{
        type:String,
        required:true
    },
},{timestamps:true})


schema.statics.createValidation=function(body){
    return createContactValidator.validate(body,{abortEarly:false})
}
schema.statics.answerValidation=function(body){
    return answerValidator.validate(body,{abortEarly:false})
}
schema.statics.removeValidation=function(params){
    return removeValidator.validate(params,{abortEarly:false})
}

const model=mongoose.model('ContactUs',schema)
module.exports=model