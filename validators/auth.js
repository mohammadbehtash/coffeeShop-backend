const Joi = require('joi')

const registerValidator = Joi.object({
    username: Joi.string().required().empty('').messages({
        'any.required': 'نام کاربری الزامی است'
    }),
    name: Joi.string().required().empty('').messages({
        'any.required': 'نام الزامی است'
    }),
   
    password: Joi.string().required().empty('').messages({
        'any.required': 'پسورد الزامی است'
    }),
    phone: Joi.string().required().empty('').messages({
        'any.required': 'شماره تلفن الزامی است'
    })

})

const loginvalidator=Joi.object({
    identifier:Joi.string().required().empty('').messages({
        'any.required': 'شناسه کاربری الزامی است'
    }),
    password:Joi.string().required().empty('').messages({
        'any.required': ' پسورد الزامی است'
    })
})
const emailvalidator=Joi.object({
    email: Joi.string().email().required().empty('').messages({
        'any.required': 'ایمیل الزامی است',
        'string.email': 'فرمت ایمیل معتبر نیست',
        'string.empty': 'ایمیل نمی‌تواند خالی باشد'
    }),
})


module.exports={registerValidator,loginvalidator,emailvalidator}