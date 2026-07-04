import Joi from "joi";

export const createChatHistoryValidation = Joi.object({
  pesan: Joi.string().trim().required().messages({
    "string.empty": "Message cannot be empty or just spaces",
    "any.required": "Message is required",
  }),
});

export const deleteChatHistoryValidation = Joi.object({
  id: Joi.string().trim().guid({ version: "uuidv4" }).required().messages({
    "string.empty": "ID cannot be empty",
    "string.guid": "Invalid ID format",
    "any.required": "ID parameter is required",
  }),
});
