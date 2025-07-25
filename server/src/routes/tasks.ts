import { Router } from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} from '../controllers/task.controller';
import { validateRequest, validateQuery, validateParams } from '../middleware/validation';
import {
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
  taskParamsSchema
} from '../schemas/task.schemas';

const router = Router();

router.get('/', validateQuery(taskQuerySchema), getTasks);

router.get('/:id', validateParams(taskParamsSchema), getTaskById);

router.post('/', validateRequest(createTaskSchema), createTask);

router.put('/:id', 
  validateParams(taskParamsSchema),
  validateRequest(updateTaskSchema),
  updateTask
);

router.delete('/:id', validateParams(taskParamsSchema), deleteTask);

export default router;