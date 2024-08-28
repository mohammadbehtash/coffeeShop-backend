const Joi=require('joi')

const articleValidator=Joi.object({
    title: Joi.string().trim().empty('').required().messages({
        'any.required': 'عنوان  مقاله الزامی می باشد',
        'string.empty': 'عنوان نمی‌تواند خالی باشد'
      }),
      body: Joi.string().required().empty('').trim().messages({
        'any.required': "متن  مقاله الزامی می باشد",
        'string.empty': 'متن مقاله نمی‌تواند خالی باشد'
      }),
      description: Joi.string().empty('').required().trim().messages({
        'any.required': "توضیحات کوتاه  مقاله الزامی می باشد",
        'string.empty': 'توضیحات نمی‌تواند خالی باشد'
      }),
      href: Joi.string().trim().empty('').required().messages({
        'any.required': "اسم کوتاه  مقاله الزامی می باشد",
        'string.empty': 'اسم کوتاه نمی‌تواند خالی باشد'
      }),
      cover: Joi.object({
        size: Joi.number().max(30 * 1024 * 1024).messages({
          'number.max': 'حجم تصویر نباید بیشتر از 30 مگابایت باشد'
        }),
        mimetype: Joi.string().valid('image/jpeg', 'image/jpg', 'image/png', 'image/webp').required().messages({
          'any.only': 'فرمت تصویر باید jpeg یا png یا webp باشد',
          'any.required': 'تصویر الزامی است'
        })
      }),
      categoryID: Joi.string().empty('').required().pattern(/^[0-9a-fA-F]{24}$/).messages({
        'any.required': 'شناسه دسته‌بندی الزامی است',
        'string.pattern.base': 'شناسه دسته‌بندی معتبر نیست',
        'string.empty': 'شناسه دسته بندی نمی‌تواند خالی باشد'
      })
})

const hrefArticleValidator=Joi.object({
    href: Joi.string().trim().empty('').required().messages({
        'any.required': "اسم کوتاه  مقاله الزامی می باشد",
        'string.empty': 'اسم کوتاه نمی‌تواند خالی باشد'
      })
})

module.exports={articleValidator,
    hrefArticleValidator}