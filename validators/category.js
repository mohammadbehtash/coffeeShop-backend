const Joi=require('joi')

const categoryValidator=Joi.object({
    title:Joi.string().required().empty('').messages({
        'any.required': 'عنوان الزامی است',

        'string.empty': '  عنوان نمی‌تواند خالی باشد'
    }),
    href:Joi.string().required().empty('').messages({
        'any.required': 'مسیر الزامی است',
        'string.empty': 'مسیر نمی‌تواند خالی باشد'
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

module.exports=categoryValidator