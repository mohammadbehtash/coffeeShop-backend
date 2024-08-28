const Joi=require('joi')

const updatedUserValidator=Joi.object({
    name:Joi.string().empty('').required().messages({
        'any.required': 'نام الزامی است',
       
        'string.empty': 'نام نمی‌تواند خالی باشد'
    }),
    username:Joi.string().empty('').required().messages({
        'any.required': 'نام کاربری الزامی است',

        'string.empty': 'نام کاربری نمی‌تواند خالی باشد'
    }),
    email:Joi.string().empty('').email().required().messages({
        'any.required': 'ایمیل الزامی است',
        'string.email': 'فرمت ایمیل معتبر نیست',
        'string.empty': 'ایمیل نمی‌تواند خالی باشد'
    }),
    phone:Joi.string().empty('').required().messages({
        'any.required': 'تلفن الزامی است',

        'string.empty': 'تلفن نمی‌تواند خالی باشد'
    })
})

const updatedPasswordValidator=Joi.object({
    password:Joi.string().empty().required().messages({ 
        'any.required': 'کلمه عبور فعلی الزامی است',
        'string.empty': 'کلمه عبور فعلی نمی‌تواند خالی باشد'}),
    newpassword:Joi.string().empty().required().messages({
        'any.required': 'کلمه عبور جدید الزامی است',

        'string.empty': 'کلمه عبور جدید نمی‌تواند خالی باشد'
    })
})

module.exports={
    updatedUserValidator,
updatedPasswordValidator
    
}