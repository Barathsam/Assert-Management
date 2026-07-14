import Joi from 'joi'
import { RETURN_REASONS } from '../../common/types/returnReason'

const optionalText = Joi.string().allow('').optional()
const optionalDate = Joi.string().allow('').optional()

export const issueSchema = Joi.object({
    employeeId: Joi.number().integer().positive().required(),
    issueDate: optionalDate,
    remarks: optionalText
})

export const returnSchema = Joi.object({
    reason: Joi.string()
        .valid(...RETURN_REASONS)
        .required()
        .messages({ 'any.only': 'A valid return reason is required.', 'any.required': 'Return reason is required.' }),
    returnDate: optionalDate,
    remarks: optionalText
})

export const sendToRepairSchema = Joi.object({
    date: optionalDate,
    vendor: optionalText,
    remarks: optionalText
})

export const repairCompleteSchema = Joi.object({
    date: optionalDate,
    cost: Joi.number().min(0).precision(2).default(0),
    vendor: optionalText,
    remarks: optionalText
})

export const scrapSchema = Joi.object({
    date: optionalDate,
    scrapValue: Joi.number().min(0).precision(2).default(0),
    reason: Joi.string().trim().min(1).required().messages({ 'any.required': 'Scrap reason is required.' }),
    returnReason: Joi.string()
        .valid(...RETURN_REASONS)
        .optional(),
    remarks: optionalText
})
