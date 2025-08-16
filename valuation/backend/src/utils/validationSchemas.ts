import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  license_number: Joi.string().allow("").optional(),
  membership_category: Joi.string().valid("professional", "regulatory").allow("").optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(3).max(255).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
  license_number: Joi.string().allow("").optional(),
  membership_category: Joi.string().valid("professional", "regulatory").allow("").optional(),
});

