const express=require('express')
const contactControler=require('../controler/contact-us')
const verifyToken=require('../middlewares/verifytoken')
const isAdmin=require('../middlewares/isAdmin')
const router=express.Router()

router.route('/').get(verifyToken,isAdmin,contactControler.getAll)
.post(contactControler.create)

router.route('/:id').delete(verifyToken,isAdmin,contactControler.remove)

router.route('/answer').post(verifyToken,isAdmin,contactControler.answer)

module.exports=router