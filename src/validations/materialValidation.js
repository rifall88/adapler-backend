import Joi from "joi";

export const updateMaterialValidation = Joi.object({
  ringkasan: Joi.string().trim().optional().messages({
    "string.empty": "Summary cannot be empty or just spaces",
  }),

  poin_penting: Joi.array().items(Joi.string().trim()).optional().messages({
    "array.base": "Important points must be formatted as an array",
    "string.empty": "Important points cannot contain empty strings",
  }),

  kata_kunci: Joi.array().items(Joi.string().trim()).optional().messages({
    "array.base": "Keywords must be formatted as an array",
    "string.empty": "Keywords cannot contain empty strings",
  }),
});
