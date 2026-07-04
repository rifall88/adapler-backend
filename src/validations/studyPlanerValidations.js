import Joi from "joi";

export const createStudyPlannerValidation = Joi.object({
  startTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({
      "string.empty": "Start time cannot be empty",
      "string.pattern.base": "Start time must use HH:mm format",
      "any.required": "Start time is required",
    }),
});

export const deleteStudyPlannerValidation = Joi.object({
  id: Joi.string().trim().guid({ version: "uuidv4" }).required().messages({
    "string.empty": "ID cannot be empty",
    "string.guid": "Invalid ID format",
    "any.required": "ID parameter is required",
  }),
});
