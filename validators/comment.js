const Joi=require('joi')

const creatCommentvalidator = Joi.object({
    body: Joi.string().required().messages({
      'any.required': 'متن کامنت الزامی است',
      'string.empty': 'متن کامنت نباید خالی باشد'
    }),
    productHref: Joi.string().required().messages({
      
      'string.empty': 'شناسه دوره نباید خالی باشد'
    }),
    score: Joi.number().required().messages({
      'any.required': 'امتیاز الزامی است',
      'number.empty': 'امتیاز نباید خالی باشد'
    })
  });


const commentIdValidator=Joi.object({
  id:Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/).messages({
    'any.required': 'شناسه جلسه الزامی است',
    'string.pattern.base': 'شناسه جلسه معتبر نیست'
  })
})

const answerCommentValidator=Joi.object({
  body:Joi.string().required().messages({ 'any.required': 'متن پاسح  الزامی است'})
})

module.exports={
    creatCommentvalidator,
    commentIdValidator,
    answerCommentValidator
}