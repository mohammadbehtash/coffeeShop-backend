const express=require('express')
const searchControler=require('../controler/search')

const router=express.Router()

router.route('/:value').get(searchControler.get)

module.exports=router

