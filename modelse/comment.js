const mongoose=require('mongoose')
const{creatCommentvalidator,
    commentIdValidator,
    answerCommentValidator
  }=require('../validators/comment')
const { min } = require('../validators/category')

const schema=new mongoose.Schema({
    body:{
        type:String,
        require:true
    },
    product:{
        type:mongoose.Types.ObjectId,
        ref:'Product'
    },
    create:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    },
    iaAccept:{
        type:Number,//1 0
        default:0
    },
    score:{
        type:Number,
        min:0,
        max:5
    },
    isAnswer:{//کامت اصلی0        کامنت پاسخ1
        type:Number,
        required:true
    },
    mainCommendID: {//برای کدوم کامنت پاسخ هست 
        type: mongoose.Types.ObjectId,
        ref: "Comment",
      }
},{timestamps:true})

schema.statics.creatCommentValidation=function(body){
    return creatCommentvalidator.validate(body,{abortEarly:false})
  }
  schema.statics.CommentIdValidation=function(params){
    return commentIdValidator.validate(params,{abortEarly:false})
  }
  schema.statics.answerCommentValidation=function(body){
    return answerCommentValidator.validate(body,{abortEarly:false})
  }
  

const model=mongoose.model('Comment',schema)
module.exports=model