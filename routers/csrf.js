const express=require('express')
const csrfControler=require('../controler/csrf')
const router=express.Router()

router.route('/csrf-token').get(csrfControler.csrf)

module.exports=router