const express=require('express')
const categoryControler=require('../controler/category')
const verifyToken=require('../middlewares/verifytoken')
const isAdmin=require('../middlewares/isAdmin')
const multer = require('multer')
const multerStorage=require('../utils/uploder')
const router=express.Router()

router.route('/').post(multer({storage:multerStorage,limits:{fieldSize:1000000000}})
.single('cover'),verifyToken,isAdmin,categoryControler.create)
.get(categoryControler.getAll)

router.route('/:id').delete(verifyToken,isAdmin,categoryControler.remove)
.put(multer({storage:multerStorage,limits:{fieldSize:1000000000}})
.single('cover'),verifyToken,isAdmin,categoryControler.update)

module.exports=router