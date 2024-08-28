const Joi=require('joi')
const createMenuValidator=Joi.object({
    title:Joi.string().required().empty('').messages({
         'any.required': 'عنوان الزامی است',
        'string.empty': 'عنوان نمی‌تواند خالی باشد'
    }),
    href:Joi.string().required().empty('').messages({
         'any.required': 'مسیر الزامی است',
        'string.empty': 'مسیر نمی‌تواند خالی باشد'
    }),
    parent: Joi.string().optional() 
})


module.exports=createMenuValidator