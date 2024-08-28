const express=require('express')
const verifyToken=require('../middlewares/verifytoken')
const isAdmin=require('../middlewares/isAdmin')
const menuControlet=require('../controler/menu')
const router=express.Router()

router.route('/').get(menuControlet.getAll)
.post(verifyToken,isAdmin,menuControlet.create)

router.route('/all').get(verifyToken,isAdmin,menuControlet.getAllInPanel)

router.route('/:id').delete(verifyToken,isAdmin,menuControlet.remove)
.put(verifyToken,isAdmin,menuControlet.update)

module.exports=router