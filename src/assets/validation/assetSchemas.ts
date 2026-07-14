import Joi from 'joi'

const optionalText = Joi.string().allow('').optional()

const assetFields = {
    serialNumber: Joi.string().trim().uppercase().min(1).max(120).required(),
    categoryId: Joi.number().integer().positive().required(),
    branchId: Joi.number().integer().positive().required(),
    make: Joi.string().trim().min(1).max(80).required(),
    model: Joi.string().trim().min(1).max(80).required(),
    specification: optionalText,
    vendor: optionalText,
    invoiceNo: optionalText,
    warrantyExpiry: Joi.string().allow('').optional(),
    notes: optionalText
}

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/

export const createAssetSchema = Joi.object({
    ...assetFields,
    purchaseDate: Joi.string()
        .pattern(DATE_ONLY)
        .required()
        .messages({ 'string.pattern.base': 'Purchase date must be a date.' }),
    purchaseCost: Joi.number().min(0).precision(2).required()
})

export const updateAssetSchema = Joi.object(assetFields)
