import Joi from "joi";

export const updateProfileValidation = Joi.object({
  full_name: Joi.string().trim().min(8).max(255).allow("").optional().messages({
    "string.empty": "Full name cannot be empty or just spaces",
    "string.min": "Full name must be at least 8 characters long",
    "string.max": "Full name must be at most 255 characters long",
  }),

  birth_date: Joi.date().iso().allow("").optional().messages({
    "date.format": "Please provide a valid birth date format (YYYY-MM-DD)",
    "date.base": "Birth date must be a valid date",
  }),

  bio: Joi.string().trim().max(500).allow("").optional().messages({
    "string.empty": "Bio cannot be empty or just spaces",
    "string.max": "Bio must be at most 500 characters long",
  }),

  jenjang_pendidikan: Joi.string()
    .trim()
    .max(100)
    .allow("")
    .optional()
    .messages({
      "string.empty": "Education level cannot be empty or just spaces",
      "string.max": "Education level must be at most 100 characters long",
    }),

  jurusan: Joi.string().trim().max(100).allow("").optional().messages({
    "string.empty": "Major cannot be empty or just spaces",
    "string.max": "Major must be at most 100 characters long",
  }),

  target_akademik: Joi.string().trim().max(1000).allow("").optional().messages({
    "string.empty": "Academic goal cannot be empty or just spaces",
    "string.max": "Academic goal must be at most 1000 characters long",
  }),

  jam_belajar_harian: Joi.number()
    .integer()
    .min(1)
    .max(8)
    .allow("")
    .optional()
    .messages({
      "number.base": "Daily study hours must be a number",
      "number.integer": "Daily study hours must be an integer",
      "number.min": "Daily study hours must be at least 1 hour",
      "number.max": "Daily study hours cannot exceed 8 hours",
    }),

  profile_image: Joi.any().optional(),
});
