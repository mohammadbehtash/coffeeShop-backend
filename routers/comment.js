const express=require('express')
const commentControler=require('../controler/comment')
const verifyToken=require('../middlewares/verifytoken')
const isAdmin=require('../middlewares/isAdmin')
const router=express.Router()

router.route('/').post(verifyToken,commentControler.create).get(verifyToken,isAdmin,commentControler.getAll)
router.route('/:id').delete(verifyToken,isAdmin,commentControler.remove)
router.route('/:id/accept').put(verifyToken,isAdmin,commentControler.accept)
router.route('/:id/reject').put(verifyToken,isAdmin,commentControler.reject)
router.route('/:id/anser').post(verifyToken,isAdmin,commentControler.answer)



module.exports=router