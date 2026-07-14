import Joi from 'joi'

const blankToNull = (max: number) => Joi.string().trim().max(max).allow('').empty('').default(null)

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

export const employeeSchema = Joi.object({
    employeeCode: Joi.string().trim().max(32).required(),
    firstName: Joi.string().trim().max(80).required(),
    lastName: Joi.string().trim().max(80).required(),
    email: blankToNull(160).email(),
    phone: blankToNull(20),
    designation: blankToNull(80),
    department: blankToNull(80),
    branchId: Joi.number().integer().positive().required(),
    dateOfJoining: blankToNull(10).pattern(ISO_DATE)
})

export const employeeStatusSchema = Joi.object({})
