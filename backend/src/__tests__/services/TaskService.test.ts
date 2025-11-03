import { TaskService } from '../../application/services/TaskService';
import { InMemoryTaskRepository } from '../../infraestructure/repositories/InMemoryTaskRepository';
import { TaskStatus } from '../../domain/entities/Task';
import { NotFoundError } from '../../domain/errors/AppError';

describe('TaskService', () => {
  let taskService: TaskService;
  let taskRepository: InMemoryTaskRepository;

  beforeEach(async () => {
    taskRepository = new InMemoryTaskRepository();
    taskService = new TaskService(taskRepository);
    await taskRepository.clear();
  });

  describe('getAllTasks', () => {
    it('debería retornar todas las tareas', async () => {
      await taskRepository.create({ title: 'Tarea 1' });
      await taskRepository.create({ title: 'Tarea 2' });

      const tasks = await taskService.getAllTasks();
      expect(tasks).toHaveLength(2);
    });

    it('debería filtrar tareas por estado', async () => {
      await taskRepository.create({ title: 'Tarea 1', status: TaskStatus.PENDING });
      await taskRepository.create({ title: 'Tarea 2', status: TaskStatus.COMPLETED });

      const pendingTasks = await taskService.getAllTasks(TaskStatus.PENDING);
      expect(pendingTasks).toHaveLength(1);
      expect(pendingTasks[0].status).toBe(TaskStatus.PENDING);
    });
  });

  describe('getTaskById', () => {
    it('debería retornar la tarea cuando se encuentra', async () => {
      const created = await taskRepository.create({ title: 'Tarea de Prueba' });
      const task = await taskService.getTaskById(created.id);

      expect(task).toEqual(created);
    });

    it('debería lanzar NotFoundError cuando la tarea no se encuentra', async () => {
      await expect(taskService.getTaskById('id-no-existente')).rejects.toThrow(NotFoundError);
    });
  });

  describe('createTask', () => {
    it('debería crear una tarea con todos los campos', async () => {
      const taskData = {
        title: 'Nueva Tarea',
        description: 'Descripción de la Tarea',
        status: TaskStatus.IN_PROGRESS,
      };

      const task = await taskService.createTask(taskData);

      expect(task.title).toBe(taskData.title);
      expect(task.description).toBe(taskData.description);
      expect(task.status).toBe(taskData.status);
      expect(task).toHaveProperty('id');
      expect(task).toHaveProperty('createdAt');
      expect(task).toHaveProperty('updatedAt');
    });

    it('debería crear una tarea con campos mínimos', async () => {
      const taskData = {
        title: 'Nueva Tarea',
      };

      const task = await taskService.createTask(taskData);

      expect(task.title).toBe(taskData.title);
      expect(task).toHaveProperty('id');
    });
  });

  describe('updateTask', () => {
    it('debería actualizar los campos de la tarea', async () => {
      const created = await taskRepository.create({ title: 'Título Original' });

      const updated = await taskService.updateTask(created.id, {
        title: 'Título Actualizado',
        status: TaskStatus.COMPLETED,
      });

      expect(updated.title).toBe('Título Actualizado');
      expect(updated.status).toBe(TaskStatus.COMPLETED);
    });

    it('debería lanzar NotFoundError cuando la tarea no se encuentra', async () => {
      await expect(
        taskService.updateTask('id-no-existente', { title: 'Nuevo Título' }),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteTask', () => {
    it('debería eliminar una tarea existente', async () => {
      const created = await taskRepository.create({ title: 'Tarea de Prueba' });

      await taskService.deleteTask(created.id);

      await expect(taskService.getTaskById(created.id)).rejects.toThrow(NotFoundError);
    });

    it('debería lanzar NotFoundError cuando la tarea no se encuentra', async () => {
      await expect(taskService.deleteTask('id-no-existente')).rejects.toThrow(NotFoundError);
    });
  });
});
