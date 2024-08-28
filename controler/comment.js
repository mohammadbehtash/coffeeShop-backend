const productModel=require('../modelse/product')
const commentModel=require('../modelse/comment')
const userModel=require('../modelse/user')
const { default: mongoose } = require('mongoose')



exports.create=async(req,res,next)=>{
    try{
        const {error}=commentModel.creatCommentValidation(req.body)
if(error){
    return res.status(400).json({error:error.details})
}
const {body,productHref,score}=req.body
const product=await productModel.findOne({href:productHref}).lean()
if(!product){
    return res.status(404).json({message:'product not found'})
}

const comment=await commentModel.create({
    body,
    product:product._id,
    create:req.user._id,
    score,
    isAnswer:0,
    iaAccept:0
})
return res.status(200).json(comment)
}catch(err){
next(err)
    }
}

exports.getAll=async(req,res,next)=>{
try{
const allComment=await commentModel.find({}).populate('product','title').populate('create','-password').lean()
// 
if(allComment.length===0){
    return res.status(404).json({ message: "no comments found!" });
}
let comments=[]
allComment.forEach(comment=>{
    let mainCommentAnsverInfo=null
    allComment.forEach(ansverComment=>{
        if(String(comment._id)==String(ansverComment.mainCommendID)){
            mainCommentAnsverInfo={...ansverComment}
        }
    })
    if(!comment.mainCommendID){
        comments.push({
            ...comment,
            product:comment.product,
            answerComment:mainCommentAnsverInfo
        })
    }
})
return res.json(comments)
}catch(err){
    next(err)
}
}
exports.remove=async(req,res,next)=>{
    try{
 const {error}=commentModel.CommentIdValidation(req.params)
    if(error){
        return res.status(400).json({error:error.details})
    }
    const { id } = req.params
    const isValidID = mongoose.Types.ObjectId.isValid(id)
    if (!isValidID) {
        return res.status(406).json({ message: "session Id is not valid" })
    }
    const removecomment=await commentModel.findOneAndDelete({_id:id})
    const removecommentَAnswer=await commentModel.findOneAndDelete({mainCommendID:id})
    
    if(!removecomment){
        return res.status(404).json({message:'Comment not found'})
    }
    return res.status(200).json({message:'comment is deleted'})

    }catch(err){
        next(err)
    }
   
}
exports.accept=async(req,res,next)=>{
try{
    const {error}=commentModel.CommentIdValidation(req.params)
    if(error){
        return res.status(400).json({error:error.details})
    }
    const{id}=req.params
    const isValidID = mongoose.Types.ObjectId.isValid(id)
    if (!isValidID) {
        return res.status(406).json({ message: "session Id is not valid" })
    }
    const acceptcomment=await commentModel.findOneAndUpdate({_id:id},{
        iaAccept:1
    })
    if(!acceptcomment){
        return res.status(404).json({message:'Comment not found'})
    }
    return res.json({message:'Comment accebted'})
}catch(err){
    next(err)
}
}
exports.reject=async(req,res,next)=>{
    try{
        const {error}=commentModel.CommentIdValidation(req.params)
        if(error){
            return res.status(400).json({error:error.details})
        }
        const{id}=req.params
        const isValidID = mongoose.Types.ObjectId.isValid(id)
        if (!isValidID) {
            return res.status(406).json({ message: "session Id is not valid" })
        }
        const acceptcomment=await commentModel.findOneAndUpdate({_id:id},{
            iaAccept:0
        })
        if(!acceptcomment){
            return res.status(404).json({message:'Comment not found'})
        }
        return res.json({message:'Comment accebted'})
    }catch(err){
        next(err)
    }
}
exports.answer=async(req,res,next)=>{
try{
    const {error}=commentModel.answerCommentValidation(req.body)
    if(error){
        return res.status(400).json({error:error.details})
    }
    const{id}=req.params
    const isValidID = mongoose.Types.ObjectId.isValid(id)
    if (!isValidID) {
        return res.status(406).json({ message: "session Id is not valid" })
    }
    const{body}=req.body
    const acceptedComment=await commentModel.findOneAndUpdate({_id:id},{
        isAnswer:1
    })
    if(!acceptedComment){
        return res.status(404).json({message:'comment not found'})
    }
    const answerComment=await commentModel.create({
        body,
        product:acceptedComment.product,
        create:req.user._id,
        isAnswer:1,
        iaAccept:1,
        mainCommendID:id
    })
    return res.status(201).json(answerComment)
}catch(err){
    next(err)
}
}