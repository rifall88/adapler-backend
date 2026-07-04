import Joi from "joi";

export const createTaskValidation = Joi.object({
  task_name: Joi.string().trim().min(3).max(100).required().messages({
    "string.empty": "Task name cannot be empty or just spaces",
    "string.min": "Task name must be at least 3 characters long",
    "string.max": "Task name must be at most 100 characters long",
    "any.required": "Task name is required",
  }),

  deadline_date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      "date.format": "Please provide a valid date format (YYYY-MM-DD)",
      "any.required": "Deadline date is required",
    }),

  deadline_time: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({
      "string.empty": "Deadline time cannot be empty",
      "string.pattern.base": "Deadline time must use HH:mm format",
      "any.required": "Deadline time is required",
    }),

  progres: Joi.number().integer().min(0).max(100).required().messages({
    "number.base": "Progres must be a number",
    "number.integer": "Progres must be an integer",
    "number.min": "Progres must be at least 0%",
    "number.max": "Progres cannot exceed 100%",
    "any.required": "Progres is required",
  }),

  prioritas: Joi.string()
    .valid("tinggi", "sedang", "rendah")
    .required()
    .messages({
      "any.only": 'Priority must be either "tinggi", "sedang", or "rendah"',
      "any.required": "Priority is required",
    }),

  status: Joi.string().valid("selesai", "belum_selesai").required().messages({
    "any.only": 'Status must be either "selesai" or "belum_selesai"',
    "any.required": "Status is required",
  }),
});

export const taskParamsValidation = Joi.object({
  id: Joi.string().trim().guid({ version: "uuidv4" }).required().messages({
    "string.empty": "ID cannot be empty",
    "string.guid": "Invalid ID format",
    "any.required": "ID parameter is required",
  }),
});

export const updateTaskValidation = Joi.object({
  task_name: Joi.string().trim().min(3).max(100).allow("").optional().messages({
    "string.min": "Task name must be at least 3 characters long",
    "string.max": "Task name must be at most 100 characters long",
  }),

  deadline_date: Joi.string().allow("").optional().messages({
    "date.format": "Please provide a valid date format (YYYY-MM-DD)",
  }),

  deadline_time: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .allow("")
    .optional()
    .messages({
      "string.pattern.base": "Deadline time must use HH:mm format",
    }),

  progres: Joi.number()
    .integer()
    .min(0)
    .max(100)
    .allow("")
    .optional()
    .messages({
      "number.base": "Progres must be a number",
      "number.integer": "Progres must be an integer",
      "number.min": "Progres must be at least 0%",
      "number.max": "Progres cannot exceed 100%",
    }),

  prioritas: Joi.string()
    .valid("tinggi", "sedang", "rendah")
    .allow("")
    .optional()
    .messages({
      "any.only": 'Priority must be either "tinggi", "sedang", or "rendah"',
    }),

  status: Joi.string()
    .valid("selesai", "belum_selesai")
    .allow("")
    .optional()
    .messages({
      "any.only": 'Status must be either "selesai" or "belum_selesai"',
    }),
});
