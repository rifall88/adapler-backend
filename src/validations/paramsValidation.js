import Joi from "joi";

export const paramsValidation = Joi.object({
  id: Joi.string().trim().guid({ version: "uuidv4" }).required().messages({
    "string.empty": "ID cannot be empty",
    "string.guid": "Invalid ID format",
    "any.required": "ID parameter is required",
  }),
});
