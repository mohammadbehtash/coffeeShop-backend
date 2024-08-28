const Joi = require('joi')

const createValidator = Joi.object({
    title:Joi.string().required().empty('').messages({
          'any.required': 'عنوان الزامی است',
        'string.empty': 'عنوان نمی‌تواند خالی باشد'
    }),
    price:Joi.number().empty('').required().messages({
          'any.required': 'قیمت الزامی است',
        'string.empty': 'قیمت نمی‌تواند خالی باشد'
    }),
    description:Joi.string().empty('').required().messages({
          'any.required': 'توضیحات الزامی است',
        'string.empty': 'توضیحات نمی‌تواند خالی باشد'
    }),
    href:Joi.string().empty('').required().messages({
          'any.required': 'مسیر الزامی است',
        'string.empty': 'مسیر نمی‌تواند خالی باشد'
    }),
    categoryId:Joi.string().empty('').required().messages({
          'any.required': 'شناسه دسته بندی الزامی است',
        'string.empty': 'شناسه دسته بندی نمی‌تواند خالی باشد'
    }),
    discount:Joi.number().empty('').required().messages({
          'any.required': 'تخفیف الزامی است',
        'string.empty': 'تخفیف نمی‌تواند خالی باشد'
    }),
    number:Joi.number().empty('').required().messages({
          'any.required': 'تعداد موجود الزامی است',
        'string.empty': 'تعداد موجود نمی‌تواند خالی باشد'
    }),
    weight:Joi.number().empty('').required().messages({
          'any.required': 'وزن الزامی است',
        'string.empty': 'وزن نمی‌تواند خالی باشد'
    }),
    packageWeight:Joi.number().empty('').required().messages({
          'any.required': 'وزن بسته بندی الزامی است',
        'string.empty': 'وزن بسته بندی نمی‌تواند خالی باشد'
    }),
    dimensions:Joi.string().empty('').required().messages({
          'any.required': 'ابعاد بسته بندی الزامی است',
        'string.empty': 'ابعاد بسته بندی نمی‌تواند خالی باشد'
    }),
    type:Joi.string().empty('').required().messages({
          'any.required': 'نوع بسته بندی الزامی است',
        'string.empty': 'نوع بسته بندی نمی‌تواند خالی باشد'
    }),
    numberHygiene:Joi.string().empty('').required().messages({
          'any.required': 'شماره پروانه الزامی است',
        'string.empty': 'شماره پروانه نمی‌تواند خالی باشد'
    }),
    
    brand:Joi.string().empty('').required().messages({
          'any.required': ' برند الزامی است',
        'string.empty': ' برند نمی‌تواند خالی باشد'
    }),
    code:Joi.string().empty('').required().messages({
          'any.required': ' کد محصول الزامی است',
        'string.empty': ' کد محصول نمی‌تواند خالی باشد'
    }),
    combinations:Joi.string().empty('').required().messages({
          'any.required': 'ترکیبات  الزامی است',
        'string.empty': ' ترکیبات نمی‌تواند خالی باشد'
    }),
    cover: Joi.object({
      size: Joi.number().max(30 * 1024 * 1024).messages({
        'number.max': 'حجم تصویر نباید بیشتر از 30 مگابایت باشد'
      }),
      mimetype: Joi.string().valid('image/jpeg', 'image/jpg', 'image/png', 'image/webp').required().messages({
        'any.only': 'فرمت تصویر باید jpeg یا png یا webp باشد',
        'any.required': 'تصویر الزامی است'
      })
    })
})

const hrefvalidator=Joi.object({
    href:Joi.string().empty('').required().messages({
          'any.required': 'مسیر الزامی است',
        'string.empty': 'مسیر نمی‌تواند خالی باشد'
    })
})

module.exports={
    createValidator,
hrefvalidator
}