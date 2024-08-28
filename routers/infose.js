const express=require('express')
const infosControler=require('../controler/infose')
const verifyToken=require('../middlewares/verifytoken')
const isAdmin=require('../middlewares/isAdmin')
const multer = require('multer')
const multerStorage=require('../utils/uploder')
const router=express.Router()

router.route('/index').get(infosControler.getIndex);

router.route('/p-admin').get(verifyToken,isAdmin,infosControler.getPanelAdmin)

router.route('/info-create').post(multer({storage:multerStorage,limits:{fieldSize:1000000000}}).single('logo'),verifyToken,isAdmin,infosControler.create)

router.route('/info-update/:id').put(multer({storage:multerStorage,limits:{fieldSize:1000000000}}).single('logo'),verifyToken,isAdmin,infosControler.updatedInfo)

router.route('/info-delet/:id').delete(verifyToken,isAdmin,infosControler.Delete)

module.exports=router

