const Joi=require('joi')

const createContactValidator=Joi.object({
    name:Joi.string().empty('').trim().required().messages({
        'any.required': 'نام الزامی است',
         'string.empty': 'نام نمی‌تواند خالی باشد'
    }),
    email:Joi.string().email().empty('').trim().required().messages({
        'any.required': 'ایمیل الزامی است',
         'string.empty': 'ایمیل نمی‌تواند خالی باشد'
    }),
    phone:Joi.string().empty('').required().pattern(/^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/).messages({
        'any.required': 'تلفن الزامی است',
        'string.pattern.base': 'تلفن معتبر نیست',
         'string.empty': 'تلفن نمی‌تواند خالی باشد'
      }),
      body:Joi.string().empty('').trim().required().messages({
        'any.required': "متن الزامی است",
        'string.empty': 'متن نمی‌تواند خالی باشد'
   })
})

const answerValidator=Joi.object({
    email:Joi.string().email().empty('').trim().required().messages({
        'any.required': 'ایمیل الزامی است',
         'string.empty': 'ایمیل نمی‌تواند خالی باشد'
    }),
    answer:Joi.string().empty('').trim().required().messages({
'any.required': "متن الزامی است",
 'string.empty': 'متن نمی‌تواند خالی باشد'
    })
}) 

const removeValidator=Joi.object({
    id:Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
         'any.required': 'شناسه الزامی است',
        'string.pattern.base': 'شناسه معتبر نیست'
    })
})

module.exports={
    createContactValidator,
answerValidator,
removeValidator
}