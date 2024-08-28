const express=require('express')
const offControler=require('../controler/off')
const verifyToken=require('../middlewares/verifytoken')
const isAdmin=require('../middlewares/isAdmin')
const { model } = require('mongoose')
const router=express.Router()

router.route('/').get(verifyToken,isAdmin,offControler.getAll)
.post(verifyToken,isAdmin,offControler.create)

router.route('/all').post(verifyToken,isAdmin,offControler.setAll)

router.route('/:code').post(verifyToken,offControler.getOne)

router.route('/:id').delete(verifyToken,offControler.remove)

module.exports=router