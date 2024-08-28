const productModel=require('../modelse/product')
const articleModel=require('../modelse/article')

exports.get=async(req,res,next)=>{
    try{
        const {value}=req.params
        const product=await productModel.find({
            title:{
                $regex:".*"+value+".*"
            }
        })
        const article=await articleModel.find({
            title:{
                $regex:".*"+value+".*"
            },
            publish:1
        })
        return res.json({
            product,article
        })
    }catch(err){
        next(err)
    }
}