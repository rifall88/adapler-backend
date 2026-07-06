import Joi from "joi";

export const createChatHistoryValidation = Joi.object({
  pesan: Joi.string().trim().required().messages({
    "string.empty": "Message cannot be empty or just spaces",
    "any.required": "Message is required",
  }),
});
