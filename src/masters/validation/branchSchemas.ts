import Joi from 'joi'

const blankToNull = (max: number) => Joi.string().trim().max(max).allow('').empty('').default(null)

export const branchSchema = Joi.object({
    code: Joi.string().trim().max(8).required(),
    name: Joi.string().trim().max(120).required(),
    city: blankToNull(80),
    state: blankToNull(80)
})

export const branchToggleSchema = Joi.object({})
