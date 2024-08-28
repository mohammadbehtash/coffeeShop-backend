const mongoose=require('mongoose')
const{createOffValidator,
    getOneOffvalidator,
    setDiscountOneValidator}=require('../validators/off')
const schema=new mongoose.Schema({
    code:{
        type:String,
        required:true
    },
    percent:{
        type:Number,
        required:true
    },
    // product:{
    //     type:mongoose.Types.ObjectId,
    //     ref:'Product',
    //     required:true
    // },
    max:{
        type:Number,
        required:true
    },
    uses:{
        type:Number,
        required:true
    },
    creator:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    }
},{timestamps:true})


schema.statics.getOneOffvalidator=function(body){
    return getOneOffvalidator.validate(body, { abortEarly: false })
}
schema.statics.createOffvalidator=function(body){
    return createOffValidator.validate(body, { abortEarly: false })
}
schema.statics.setAllOffvalidator=function(body){
    return setDiscountOneValidator.validate(body, { abortEarly: false })
}


const model=mongoose.model('Off',schema)
module.exports=model