const { default: mongoose } = require('mongoose');
const userModel = require('../modelse/user')
const bcrypt = require("bcrypt");
exports.getAll = async (req, res, next) => {
    try {
        const users = await userModel.find({}).select('-password -refreshToken').lean()
        return res.json(users)
    } catch (err) {
        console.log(err);
    }

}

exports.updatedUser = async (req, res, next) => {
    try {
        const { error } = userModel.updatedUserValidation(req.body)
        if (error) return res.status(400).json({ error: error.details })


        const { name, username, email, phone } = req.body
        const user = await userModel.findByIdAndUpdate({ _id: req.user._id }, {
            name, username, email, phone
        }, { new: true }).select('-password').lean()
        return res.json(user)
    } catch (err) {
        next(err)
    }
}

exports.updatePassword = async (req, res, next) => {
    try {
        const { error } = userModel.updatedPasswordValidation(req.body)
        if (error) return res.status(400).json({ error: error.details })

        const { password, newpassword } = req.body

        const verifypass = await bcrypt.compare(password, req.user.password)

        if (!verifypass) {
            return res.json({ ms: "password rejected" })
        }
        const hashPassword = await bcrypt.hash(newpassword, 12)
        const user = await userModel.findByIdAndUpdate({ _id: req.user._id }, {
            password: hashPassword
        })
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }
        return res.json({ message: "password Updated" })
    } catch (err) {

    }
}

exports.removeUser = async (req, res, next) => {
    try {

        const isValidID=mongoose.Types.ObjectId.isValid(req.params.id)
        if(!isValidID){
            return res.status(409).json({message:'user Id is not valid'})
        }
        const removeUser=await userModel.findByIdAndDelete({_id:req.params.id})
        if(!removeUser){
            return res.status(404).json({message:'there is no user '})
        }
        return res.status(200).json({message:"user removed successfuly"})
    } catch (err) {
        next(err)
    }
}

exports.changeRoule = async (req, res, next) => {
const {id}=req.body
const isValidID=mongoose.Types.ObjectId.isValid(id)
if (!isValidID) {
    return res.status(409).json({
      message: "User ID is not valid !!",
    });
  }
  const user=await userModel.findById(id)
  if(!user){
    return res.status(404).json({message:'user not fund'})
  }
  let newRole=user.role==='ADMIN'?'USER':'ADMIN'
  const updatedUser=await userModel.findByIdAndUpdate({_id:id},{
    role:newRole
  })
  if(updatedUser){
    return res.json({message:'user role change '+newRole})
  }
}

exports.showCart=async(req,res,next)=>{
    try {
       
        const userId = req.user._id.toString();

        
        const isValidID = mongoose.Types.ObjectId.isValid(userId);
        if (!isValidID) {
            return res.status(409).json({ message: 'User ID is not valid' });
        }

        
        const user = await userModel.findById(userId).populate('cart.items.productId');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
       

        const filteredItems = user.cart.items.filter(item => item.productId.number !== 0);

        return res.json({ items: filteredItems });
        
    } catch (error) {
        next(error);
    }
}

