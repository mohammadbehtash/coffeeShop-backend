const { default: mongoose } = require('mongoose')
const offModel=require('../modelse/off')
const productModel=require('../modelse/product')


exports.getAll=async(req,res,next)=>{
try{
    const offs=await offModel.find({},'-__v').populate('product','title href').populate('creator','name').lean()
    if(offs.length===0){
        return res.status(404).json({message:'No Off Availble'})
    }
    return res.json(offs)
}catch(err){
    next(err)
}
}
exports.create=async(req,res,next)=>{
    try{
        const { error } = offModel.createOffvalidator(req.body)
        if (error) {
            return res.status(400).json({ error: error.details });
        }

        const{code,percent,product,max}=req.body
        const newOff=await offModel.create({
            code,
            product,
            percent,
            max,
            uses:0,
            creator:req.user._id
        })
        return res.status(201).json(newOff)
    }catch(err){
        next(err)
    }
}
exports.setAll=async(req,res,next)=>{
    try{
        const { error } = offModel.setAllOffvalidator(req.body)
  if (error) {
      return res.status(400).json({ error: error.details });
  }
        const{discount}=req.body
        await productModel.updateMany({discount})
        return res.json({message:'discounts set Ok'})
    }catch(err){
        next(err)
    }
}
exports.getOne=async(req,res,next)=>{
    try{
        const { code } = req.params;
        // const { product } = req.body;

    const { error } =offModel.getOneOffvalidator({
        code: req.params.code,
        // product: req.body.product
      });
    
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }



    const off=await offModel.findOne({code}).lean()
    if(!off){
        return res.status(404).json({message:'code is not valid'})
    }else if(off.max===off.uses){
        return res.status(409).json({mesage:'This code already used'})
    }else{
        await offModel.findOneAndUpdate({code},{
            uses:off.uses+1
        })
        return res.json(off)
    }
    }catch(err){
        next(err)
    }
 
}
exports.remove=async(req,res,next)=>{
    try{
        const{id}=req.params
        const isvalidId=mongoose.Types.ObjectId.isValid(id)
        if(!isvalidId){
            return res.json({message:'id is not valid'})
        }
        const deleteOff=await offModel.findOneAndDelete({_id:id})
        if(!deleteOff){
            return res.status(404).json({message:'off code not found'})
        }
        return res.json(deleteOff)
    }catch(err){
        next(err)
    }
}