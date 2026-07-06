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

export const updateStudyPlannerValidation = Joi.object({
  detail_jadwal: Joi.object({
    total_jam_belajar: Joi.number().integer().min(1).max(8).messages({
      "number.base": "Total study hours must be a number",
      "number.integer": "Total study hours must be an integer",
      "number.min": "Total study hours must be at least 1 hour",
      "number.max": "Total study hours cannot exceed 8 hours",
    }),

    target_harian: Joi.string().trim().messages({
      "string.base": "Daily target must be a string",
      "string.empty": "Daily target cannot be empty",
    }),

    jadwal: Joi.array()
      .items(
        Joi.object({
          tipe: Joi.string().trim().required().messages({
            "string.base": "Schedule type must be a string",
            "string.empty": "Schedule type cannot be empty",
            "any.required": "Schedule type is required",
          }),
          waktu: Joi.string()
            .trim()
            .pattern(
              /^([01]\d|2[0-3]):([0-5]\d)\s-\s([01]\d|2[0-3]):([0-5]\d)$/,
            )
            .required()
            .messages({
              "string.base": "Schedule time must be a string",
              "string.empty": "Schedule time cannot be empty",
              "string.pattern.base":
                "Schedule time must be in the format HH:mm - HH:mm",
              "any.required": "Schedule time is required",
            }),
          aktivitas: Joi.string().trim().required().messages({
            "string.base": "Activity must be a string",
            "string.empty": "Activity cannot be empty",
            "any.required": "Activity is required",
          }),

          prioritas: Joi.string().trim().required().messages({
            "string.base": "Priority must be a string",
            "string.empty": "Priority cannot be empty",
            "any.required": "Priority is required",
          }),
        }),
      )
      .messages({
        "array.base": "Schedule must be an array",
      }),
  })
    .min(1)
    .required()
    .messages({
      "object.base": "Study planner details must be an object",
      "object.min": "At least one field must be provided for update",
      "any.required": "Study planner details are required",
    }),
});
