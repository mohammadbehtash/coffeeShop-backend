const express=require('express')
const multer=require('multer')
const multerStorage=require('../utils/uploder')
const verifyToken=require('../middlewares/verifytoken')
const isAdmin=require('../middlewares/isAdmin')
const articleControler=require('../controler/article')

const router=express.Router()

router.route('/').post(multer({storage:multerStorage,limits:{fileSize:1000000000}}).single('cover'),verifyToken,isAdmin,articleControler.create)
.get(verifyToken,isAdmin,articleControler.getAllAdmin)

router.route('/all').get(articleControler.getAllclient)

router.route('/:href').get(articleControler.getOne)

router.route('/related/:href').get(articleControler.RelatedProduct)

router.route('/update/:id').put(multer({storage:multerStorage,limits:{fileSize:1000000000}}).single('cover'),verifyToken,isAdmin,articleControler.update)

router.route('/publish-one/:id').put(verifyToken,isAdmin,articleControler.publishOne)

router.route('/publish-zero/:id').put(verifyToken,isAdmin,articleControler.publishZero)

router.route('/remove/:id').delete(verifyToken,isAdmin,articleControler.remove)

module.exports=router