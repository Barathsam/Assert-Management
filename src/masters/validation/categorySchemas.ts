import Joi from 'joi'

export const categorySchema = Joi.object({
    code: Joi.string().trim().max(8).required(),
    name: Joi.string().trim().max(80).required(),
    description: Joi.string().trim().max(2000).allow('').empty('').default(null)
})

export const categoryToggleSchema = Joi.object({})
