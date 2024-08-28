const mongoose=require('mongoose')
const {registerValidator, loginvalidator, emailvalidator} = require('../validators/auth')
const { updatedUserValidator, updatedPasswordValidator } = require('../validators/user')

const schema=new mongoose.Schema({
    username:{
        type:String,
      
    },
    name:{
        type:String,
       
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
      
    },
    phone:{
        type:String,
       
    },
    role:{
        type:String,
        enum:['ADMIN','USER'],
        default:'USER'
    },
    refreshToken:String,
    cart:{
        items:[{
            productId:{
                type:mongoose.Types.ObjectId,
                ref:'Product',
                required:true
            },
            quantity:{
                type:Number,
                required:true,
                
            }
        }]
    },
    verificationCode: {
        type: String,
        // این فیلد کد تایید ارسال شده به ایمیل کاربر را ذخیره می‌کند
    },
    isVerified: {
        type: Boolean,
        default: false // این فیلد وضعیت تایید ایمیل را نشان می‌دهد
    }
},{timestamps:true})


schema.methods.addToCart = function(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    
    // if (cartProductIndex >= 0) {
    //     newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    //     updatedCartItems[cartProductIndex].quantity = newQuantity;
    // } else {
    //     updatedCartItems.push({
    //         productId: product._id,
    //         quantity: newQuantity
    //     });
    // }
    
    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    }

    // بررسی موجودی محصول
    if (newQuantity > product.number) {
        throw new Error(`تعداد موجودی محصول ${product.title} کافی نمی‌باشد.`); // خطا در صورت نبود موجودی کافی
    }

    if (cartProductIndex >= 0) {
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
        updatedCartItems.push({
            productId: product._id,
            quantity: newQuantity
        });
    }

    this.cart = { items: updatedCartItems };
    return this.save();
}


schema.methods.incrementCartItemQuantity = function(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });

    if (cartProductIndex >= 0) {
        this.cart.items[cartProductIndex].quantity += 1;
    } else {
        this.cart.items.push({
            productId: product._id,
            quantity: 1
        });
    }

    return this.save();
};

schema.methods.decrementCartItemQuantity = function(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });

    if (cartProductIndex >= 0) {
        const currentQuantity = this.cart.items[cartProductIndex].quantity;
        if (currentQuantity > 1) {
            this.cart.items[cartProductIndex].quantity -= 1;
        } else {
            // Optional: Remove the product from the cart if the quantity is 1 and user attempts to decrement
            this.cart.items.splice(cartProductIndex, 1);
        }
    }

    return this.save();
};


schema.methods.removeFromCart = function(productId) {
    const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
}

schema.methods.clearCart = function() {
    this.cart = { items: [] };
    return this.save();
}

schema.statics.registerValidation=function(body){
    return registerValidator.validate(body,{abortEarly:false})
  }
schema.statics.loginvalidation=function(body){
    return loginvalidator.validate(body,{abortEarly:false})
  }
schema.statics.updatedUserValidation=function(body){
    return  updatedUserValidator.validate(body,{abortEarly:false})
  }
schema.statics.updatedPasswordValidation=function(body){
    return updatedPasswordValidator.validate(body,{abortEarly:false})
  }
schema.statics.uemailValidation=function(body){
    return emailvalidator.validate(body,{abortEarly:false})
  }


const model=mongoose.model('User',schema)
module.exports=model