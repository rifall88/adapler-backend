import Joi from "joi";

export const paramsValidation = Joi.object({
  id: Joi.string().trim().guid({ version: "uuidv4" }).required().messages({
    "string.empty": "ID cannot be empty",
    "string.guid": "Invalid ID format",
    "any.required": "ID parameter is required",
  }),
});

export const materialIdValidation = Joi.object({
  materialId: Joi.string()
    .trim()
    .guid({ version: "uuidv4" })
    .required()
    .messages({
      "string.empty": "Material ID cannot be empty",
      "string.guid": "Invalid Material ID format",
      "any.required": "Material ID is required",
    }),
});
