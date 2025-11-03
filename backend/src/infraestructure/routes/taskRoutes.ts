import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { validateBody, validateParams, validateQuery } from '../middlewares/validationMiddleware';
import {
  createTaskSchema,
  taskIdSchema,
  updateTaskSchema,
  taskQuerySchema,
} from '../../domain/validators/taskValidator';
import { z } from 'zod';


export const createTaskRouter = (taskController: TaskController): Router => {
  const router = Router();

  router.get('/', validateQuery(taskQuerySchema), taskController.getAllTasks);

  router.get(
    '/:id',
    validateParams(z.object({ id: taskIdSchema })),
    taskController.getTaskById,
  );

  router.post('/', validateBody(createTaskSchema), taskController.createTask);

  router.put(
    '/:id',
    validateParams(z.object({ id: taskIdSchema })),
    validateBody(updateTaskSchema),
    taskController.updateTask,
  );

  router.delete(
    '/:id',
    validateParams(z.object({ id: taskIdSchema })),
    taskController.deleteTask,
  );
  return router;
};
