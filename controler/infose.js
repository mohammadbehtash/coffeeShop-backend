const fs = require('fs')
const path = require('path')
const userModel = require('../modelse/user')
const productModel = require('../modelse/product')
const orderModel = require('../modelse/order')
const infosModel = require('../modelse/infose')
const { default: mongoose } = require('mongoose')

exports.getPanelAdmin = async (req, res, next) => {
    try {
        const user = await userModel.countDocuments();
        const product = await productModel.countDocuments();
        const order = await orderModel.find({}).lean()

        const admin = await userModel.findById({ _id: req.user._id })
        let total = 0
        for (let item of order) {
            total += item.totalAmount
        }
        return res.json({
            infos: [
                {
                    count: user,
                    title: 'تعداد کاربران'
                },
                {
                    count: product,
                    title: 'تعداد محصولات'
                },
                {
                    count: total,
                    title: 'جمع مبلغ فروش'
                }
            ],
            adminName: admin.name
        })
    } catch (err) {
        next(err)
    }
}

exports.getIndex = async (req, res, next) => {
    try {
        const info = await infosModel.find({}).lean()
        return res.json({
            id: info[0]._id,
            phone: info[0].phone,
            email: info[0].email,
            logo: info[0].logo,

        });
    } catch (err) {
        next(err)
    }
}

exports.create = async (req, res, next) => {
    try {
        const { email, phone } = req.body
        const logo = req.file.filename
        await infosModel.create({
            email,
            phone,
            logo
        })
        return res.json({ message: 'created infose' })
    } catch (err) {
        next(err)
    }
}
exports.updatedInfo=async(req,res,next)=>{
    try{
        const {id, email, phone } = req.body
        const logo = req.file.filename
        const update=await infosModel.findByIdAndUpdate({_id:id},{
            email,phone,logo
        },{new:true})
        if(!update){
            return res.status(409).json({message:'info not updated'})
        }
        return res.json(update)
        return 
    }catch(err){
        next(err)
    }
}

exports.Delete=async(req,res,next)=>{
    try{
        const{id}=req.params
        const isValidId = mongoose.Types.ObjectId.isValid(id);
        if (!isValidId) { 
            return res.status(404).json({ message: 'Id is not Valid' });
        }
        const removeInfo=await infosModel.findOneAndDelete({_id:id})
        if(!removeInfo){
            return res.status(409).json({message:"info is not deleted"})
        }
        const imgPath = path.join(__dirname, '..', 'public', 'img', removeInfo.logo)
        fs.unlink(imgPath, async (err) => {
            if (err) {
                console.log(err);
            }
        });
        return res.json({message:'info is deleted successfully'})
    }catch(err){
        next(err)
    }
}