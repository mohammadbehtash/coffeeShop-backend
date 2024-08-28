const Joi=require('joi')

const createOffValidator=Joi.object({
    code:Joi.string().required().empty('').messages({
         'any.required': 'کد الزامی است',
        'string.empty': 'کد نمی‌تواند خالی باشد'
    }),
    product:Joi.string().required().empty('').pattern(/^[0-9a-fA-F]{24}$/).messages({
        'string.pattern.base': 'شناسه معتبر نیست',
        'any.required': 'شناسه دوره الزامی است'
    }),
    percent:Joi.number().required().empty('').min(0).max(100).messages({
         'number.min': 'تخفیف نباید منفی باشد',
        'number.max': 'تخفیف نباید بیشتر از 100 باشد',
        'any.required': 'درصد تخفیف الزامی است',
        'string.empty': 'کد نمی‌تواند خالی باشد'
    }),
    max:Joi.number().required().empty('').messages({
         'string.pattern.base': 'تعداد استفاده معتبر نیست',
        'any.required': 'تعداد استفاده الزامی است'
    })
})

const getOneOffvalidator=Joi.object({
    code:Joi.string().required().empty('').messages({
         'any.required': 'کد الزامی است',
        'string.empty': 'کد نمی‌تواند خالی باشد'
    }),
    product:Joi.string().required().empty('').pattern(/^[0-9a-fA-F]{24}$/).messages({
         'string.pattern.base': 'شناسه معتبر نیست',
        'any.required': 'شناسه دوره الزامی است'
    })
})

const setDiscountOneValidator=Joi.object({
    discount:Joi.number().required().min(0).max(100).message({
        'number.min': 'تخفیف نباید منفی باشد',
        'number.max': 'تخفیف نباید بیشتر از 100 باشد',
        'any.required': 'درصد تخفیف الزامی است'
    })
})

module.exports={
    createOffValidator,
getOneOffvalidator,
setDiscountOneValidator
}