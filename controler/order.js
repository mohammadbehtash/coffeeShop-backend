const orderModel = require('../modelse/order');
const productModel = require('../modelse/product');
const userModel = require('../modelse/user');

exports.purchaseCart = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id).populate('cart.items.productId');
        if (!user || user.cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty or user not found' });
        }

        // محاسبه مجموع مبلغ سفارش
        const items = user.cart.items.map(item => {
            const product = item.productId;
            const discountedPrice = product.price * (1 - (product.discount / 100));
            return {
                productId: product._id,
                quantity: item.quantity,
                price: discountedPrice
            };
        });
        
        for (const item of items) {
            const product = await productModel.findById(item.productId);
            if (!product || product.number < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for product ${product.name}` });
            }
        }

        // کسر موجودی محصولات
        for (const item of items) {
            await productModel.findByIdAndUpdate(item.productId, {
                $inc: { number: -item.quantity }
            });
        }

        const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // ایجاد سفارش جدید
        const order = new orderModel({
            userId: user._id,
            items: items,
            totalAmount: totalAmount,
            status: 'Pending', // وضعیت سفارش در حال انتظار
            isSend:0
        });
        await order.save();
        await order.populate('items.productId', 'code');
        // پاک کردن سبد خرید کاربر
        await user.clearCart()
        // user.cart.items = [];
        await user.save();
        return res.status(201).json({ message: 'Order placed successfully', order });
    } catch (err) {
        next(err);
    }
};

// exports.getUserOrder=async(req,res,next)=>{
//     try{
//  const userOrder=await orderModel.find({userId:req.user._id})
//     let price=0
//     let products=[]

//    for(const order of userOrder){
//     price+= order.totalAmount
//     for(const item of order.items){
//         const product =await productModel.findById(item.productId)
//         if(product){
//             products.push(product)
//         }
//     }
//    }
//     return res.json({price,products})
    
//     }catch(err){
//         next(err)
//     }
   
// }

exports.getOneUserOrder=async(req,res,next)=>{
    try {
        const orders = await orderModel.find({ userId: req.user._id }).populate('items.productId').lean();
        
        if (!orders || orders.length === 0) {
            return res.json({ message: 'No orders found' });
        }
      
        

        
        let allProducts = [];
        let totalAmount = 0;

       
        orders.forEach(order => {
            totalAmount += order.totalAmount;
            
            
            order.items.forEach(item => {
                allProducts.push({
                    productId: item.productId._id,
                    productName: item.productId.title,
                    productHref: item.productId.href,
                    productCover: item.productId.cover,
                    quantity: item.quantity,
                    price: item.price,
                    date:order.createdAt
                });
            });
        });

        return res.json({
            products: allProducts,
            totalAmount: totalAmount,
           
        });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        return res.status(500).json({ message: 'Error fetching user orders' });
    }
}

exports.ShowAllOrders=async(req,res,next)=>{
    try{
        const products=await orderModel.find({}).populate('items.productId').populate('userId','-password -refreshToken -cart').lean()
        if(!products){
            return res.status(404).json({mesage:'orders ont found'})
        }
        return res.json(products)
    }catch(err){
        next(err)
    }
}
exports.sendProductSuccessfully=async(req,res,next)=>{
    try{
        const{id}=req.params
        const order=await orderModel.findByIdAndUpdate({_id:id},{isSend:1},{new:true})
        if(!order){
            return res.status(404).json({message:"order not found"})
        }
        return res.json(order)
    }catch(err){
        next(err)
    }
}