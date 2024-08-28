const express=require('express')
const controler=require('../controler/user')
const verifyToken=require('../middlewares/verifytoken')
const isAdmin=require('../middlewares/isAdmin')



const router=express.Router()

router.route('/').get(verifyToken,controler.getAll)
.put(verifyToken,controler.updatedUser)

router.route('/update-password').put(verifyToken,controler.updatePassword)

router.route('/:id').delete(verifyToken,isAdmin,controler.removeUser)

router.route('/cart').get(verifyToken,controler.showCart)

router.route('/role').put(verifyToken,isAdmin,controler.changeRoule)

module.exports=router