const { default: mongoose } = require('mongoose')
const categoryModel=require('../modelse/category')
const fs = require('fs')
const path = require('path')

exports.create=async(req,res,next)=>{
    try{
        const {error}=categoryModel.categoryValidation(req.body)
        if(error){
            return res.status(404).json({error:error.details})
        }
        const {title,href}=req.body
        const category=await categoryModel.create({ 
            title,
            href,
            cover:req.file.filename})
        return res.status(201).json(category)
    }catch(err){
        next(err)
    }
}
exports.getAll=async(req,res,next)=>{
    try{
        const categorys=await categoryModel.find({}).lean()
        if(categorys.length===0){
            return res.status(404).json({message:'Ther are no categoris availble'})
        }
        return res.json(categorys)
    }catch(err){
        next(err)
    }

}
exports.remove=async(req,res,next)=>{
    try{
        const {id}=req.params
        const isValidID=mongoose.Types.ObjectId.isValid(id)
        if(!isValidID){
            return res.status(406).json({message:"category Id is not valid"})
        }
        const deletecategory=await categoryModel.findByIdAndDelete({_id:id})
        if(!deletecategory){
            return res.status(404).json({message:'category is not found'})
        }
        const imgPath = path.join(__dirname,'..','public','img', deletecategory.cover)
        fs.unlink(imgPath, async (err) => {
            if (err) {
                console.log(err);
            }
        });

        return res.json({mesage:'category is deleted'})
    }catch(err){
next(err)
    }
}
exports.update=async(req,res,next)=>{
try{
    const {id}=req.params
    const isValidID=mongoose.Types.ObjectId.isValid(id)
    if(!isValidID){
        return res.status(406).json({message:"category Id is not valid"})
    }
    const {error}=categoryModel.categoryValidation(req.body)
    if(error){
        return res.status(404).json({error:error.details})
    }
    const {title,href}=req.body
    const updateCategory=await categoryModel.findByIdAndUpdate({_id:id},{
        title,
        href,
        cover:req.file.filename
    },{new:true})
    if(!updateCategory){
        return res.status(404).json({mesage:'category not found'})
    }
    return res.json(updateCategory)
}catch(err){
    next(err)
}
}