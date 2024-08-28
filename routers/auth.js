const express=require('express')
const controler=require('../controler/auth')
const verifyToken=require('../middlewares/verifytoken')
const isAdmin = require('../middlewares/isAdmin')

const router=express.Router()
// router.post('/verify-email', controler.verifyEmail);
router.post('/register',controler.registe)

router.post('/login',controler.login)

router.post('/logout',controler.logout)

router.route('/refresh-token').post(controler.refreshToken)

router.route('/access-token').get(controler.getCookie)

router.get('/me',verifyToken,controler.getMe)

router.put('/updat-user',verifyToken,isAdmin,controler.updatedUserByAdmin)


router.post('/send-verification-code',controler.validEmail)

router.post('/verify-code-and-register',controler.verifycode)


module.exports=router