import Joi from "joi";

export const loginValidation = Joi.object({
  identifier: Joi.string().trim().required().messages({
    "string.empty": "Email or Username cannot be empty",
    "any.required": "Email or Username is required",
  }),

  password: Joi.string().required().messages({
    "string.empty": "Password cannot be empty",
    "any.required": "Password is required",
  }),
});

export const googleLoginValidation = Joi.object({
  idToken: Joi.string().trim().required().messages({
    "string.empty": "ID token cannot be empty",
    "any.required": "ID token is required",
  }),
});
