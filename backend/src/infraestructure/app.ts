import express, { Application } from 'express';
import cors from 'cors';
import { createTaskRouter } from './routes/taskRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { TaskController } from './controllers/TaskController';
import { TaskService } from '../application/services/TaskService';
import { InMemoryTaskRepository } from './repositories/InMemoryTaskRepository';



export const createApp = (): Application => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', (_req, res) => {
    res.status(200).json({
      success: true,
      message: 'Servidor funcionando correctamente',
      timestamp: new Date().toISOString(),
    });
  });

  const taskRepository = new InMemoryTaskRepository();
  const taskService = new TaskService(taskRepository);
  const taskController = new TaskController(taskService);
  app.use('/api/tasks', createTaskRouter(taskController));

  // 404 handler
  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      message: 'Ruta no encontrada',
      statusCode: 404,
    });
  });

  app.use(errorHandler);
  return app;
};
