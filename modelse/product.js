const mongoose=require('mongoose')
const { createValidator, hrefvalidator } = require('../validators/product')
const schema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    cover:{
        type:String,
        required:true
    },
    href:{
        type:String,
        required:true
    },
    creator:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    },
    categoryId:{
        type:mongoose.Types.ObjectId,
        ref:'Category',
        required:true
    },

    discount:{//تخفیف
        type:Number,
        required:true
    },
    Score:{//امتیاز
        type:Number,
        required:true
    },
    number:{//تعداد
        type:Number,
        required:true
    },
    weight:{//وزن
        type:Number,
        required:true
    },
    packageWeight:{//وزن بسته بندی
        type:Number,
        required:true
    },
    dimensions:{//ابعاد بسته بندی
        type:String,
        required:true
    },
    type:{//نوع بسته بندی
        type:String,
        required:true
    },
    numberHygiene:{//شماره پروانه
        type:String,
        required:true
    },
    brand:{//برند
        type:String,
        required:true
    },
    code:{
        type:String,
        required:true,
        unique: true 
    },
    combinations:{//ترکیبات
        type:String,
        required:true,
    },
    
},{timestamps:true})

schema.virtual('comment',{
    ref:'Comment',
    localField:'_id',
    foreignField:'product'
})


schema.statics.createValidation=function(body){
    return createValidator.validate(body,{abortEarly:false}) 
}
schema.statics.hrefValidation=function(params){
    return hrefvalidator.validate(params,{abortEarly:false}) 
}



const model=mongoose.model('Product',schema)
module.exports=model