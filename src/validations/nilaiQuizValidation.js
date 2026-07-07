import Joi from "joi";

export const submitKuisValidation = Joi.object({
  jawabanUser: Joi.object()
    .pattern(
      Joi.string().uuid().messages({
        "string.guid": "Quiz ID keys must be a valid UUID",
      }),
      Joi.string().valid("A", "B", "C", "D").required().messages({
        "any.only": "Answer values must be exactly 'A', 'B', 'C', or 'D'",
        "string.empty": "Answer value cannot be empty",
      }),
    )
    .required()
    .messages({
      "object.base": "User answers must be an object",
      "any.required": "User answers are required",
    }),
});
