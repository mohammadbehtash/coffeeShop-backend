const express=require('express')
const verifyToken=require('../middlewares/verifytoken')
const isAdmin=require('../middlewares/isAdmin')
const controlerProduct=require('../controler/product')
const controlerOrder=require('../controler/order')
const multer = require('multer')
const multerStorage=require('../utils/uploder')
const router=express.Router()

// router.route('/getall').get( verifyToken, controlerOrder.getUserOrder);
router.route('/get-one-order').get( verifyToken, controlerOrder.getOneUserOrder);
router.route('/show-all-orders').get( verifyToken,isAdmin, controlerOrder.ShowAllOrders);
router.route('/ordr-isend/:id').put( verifyToken,isAdmin, controlerOrder.sendProductSuccessfully);

router.route('/').post(multer({storage:multerStorage,limits:{fieldSize:1000000000}})
.single('cover'),verifyToken,isAdmin,controlerProduct.create)
.get(controlerProduct.getAll)

router.route('/category/:href').get(controlerProduct.getProductByCategory)

router.route('/related/:href').get(controlerProduct.RelatedProduct)//محصولات مرتبط

router.route('/:href').get(controlerProduct.getOne)

router.route('/:id').delete(verifyToken,isAdmin,controlerProduct.remove)

router.route('/:id').put(multer({storage:multerStorage,limits:{fieldSize:1000000000}})
.single('cover'),verifyToken,isAdmin,controlerProduct.update)



router.route('/cart/add').post(verifyToken,controlerProduct.addToCart)

router.route('/cart/decimal').post(verifyToken,controlerProduct.decrementCartItemQuantity)

router.route('/cart/increment').post(verifyToken,controlerProduct.incrementCartItemQuantity)

router.route('/cart/remove/:id').delete(verifyToken, controlerProduct.removeFromCart)

router.route('/cart/clear').post(verifyToken, controlerProduct.clearCart)

router.route('/purchase-cart').post( verifyToken, controlerOrder.purchaseCart);


module.exports=router