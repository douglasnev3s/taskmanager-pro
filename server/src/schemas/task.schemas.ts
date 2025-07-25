import Joi from 'joi';

export const createTaskSchema = Joi.object({
  title: Joi.string().min(1).max(200).required().messages({
    'string.empty': 'Title is required',
    'string.min': 'Title must be at least 1 character',
    'string.max': 'Title cannot exceed 200 characters'
  }),
  description: Joi.string().max(1000).optional().allow('').messages({
    'string.max': 'Description cannot exceed 1000 characters'
  }),
  priority: Joi.string().valid('low', 'medium', 'high').default('medium').messages({
    'any.only': 'Priority must be one of: low, medium, high'
  }),
  status: Joi.string().valid('todo', 'in-progress', 'completed').default('todo').messages({
    'any.only': 'Status must be one of: todo, in-progress, completed'
  }),
  dueDate: Joi.date().iso().optional().messages({
    'date.format': 'Due date must be in ISO format'
  }),
  tags: Joi.array().items(Joi.string().max(50)).max(10).optional().messages({
    'array.max': 'Cannot have more than 10 tags',
    'string.max': 'Each tag cannot exceed 50 characters'
  })
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().min(1).max(200).optional().messages({
    'string.empty': 'Title cannot be empty',
    'string.min': 'Title must be at least 1 character',
    'string.max': 'Title cannot exceed 200 characters'
  }),
  description: Joi.string().max(1000).optional().allow('').messages({
    'string.max': 'Description cannot exceed 1000 characters'
  }),
  priority: Joi.string().valid('low', 'medium', 'high').optional().messages({
    'any.only': 'Priority must be one of: low, medium, high'
  }),
  status: Joi.string().valid('todo', 'in-progress', 'completed').optional().messages({
    'any.only': 'Status must be one of: todo, in-progress, completed'
  }),
  dueDate: Joi.date().iso().optional().allow(null).messages({
    'date.format': 'Due date must be in ISO format'
  }),
  tags: Joi.array().items(Joi.string().max(50)).max(10).optional().messages({
    'array.max': 'Cannot have more than 10 tags',
    'string.max': 'Each tag cannot exceed 50 characters'
  })
});

export const taskQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).optional(),
  limit: Joi.number().integer().min(1).max(100).default(10).optional(),
  status: Joi.string().valid('todo', 'in-progress', 'completed').optional(),
  priority: Joi.string().valid('low', 'medium', 'high').optional(),
  search: Joi.string().max(200).optional(),
  sortBy: Joi.string().valid('createdAt', 'updatedAt', 'dueDate', 'priority', 'title').default('createdAt').optional(),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc').optional()
});

export const taskParamsSchema = Joi.object({
  id: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/).messages({
    'string.pattern.base': 'Invalid task ID format'
  })
});