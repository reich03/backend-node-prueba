import { InMemoryTaskRepository } from '../../infraestructure/repositories/InMemoryTaskRepository';
import { TaskStatus } from '../../domain/entities/Task';

describe('InMemoryTaskRepository', () => {
  let repository: InMemoryTaskRepository;

  beforeEach(async () => {
    repository = new InMemoryTaskRepository();
    await repository.clear();
  });

  describe('create', () => {
    it('debería crear una tarea con todos los campos', async () => {
      const taskData = {
        title: 'Tarea de Prueba',
        description: 'Descripción de Prueba',
        status: TaskStatus.PENDING,
      };

      const task = await repository.create(taskData);

      expect(task).toHaveProperty('id');
      expect(task.title).toBe(taskData.title);
      expect(task.description).toBe(taskData.description);
      expect(task.status).toBe(taskData.status);
      expect(task).toHaveProperty('createdAt');
      expect(task).toHaveProperty('updatedAt');
    });

    it('debería crear una tarea sin campos opcionales', async () => {
      const taskData = {
        title: 'Tarea de Prueba',
      };

      const task = await repository.create(taskData);

      expect(task).toHaveProperty('id');
      expect(task.title).toBe(taskData.title);
      expect(task.description).toBe('');
      expect(task.status).toBe(TaskStatus.PENDING);
    });

    it('debería generar IDs únicos para cada tarea', async () => {
      const task1 = await repository.create({ title: 'Tarea 1' });
      const task2 = await repository.create({ title: 'Tarea 2' });

      expect(task1.id).not.toBe(task2.id);
    });
  });

  describe('findAll', () => {
    it('debería retornar un array vacío cuando no hay tareas', async () => {
      const tasks = await repository.findAll();
      expect(tasks).toEqual([]);
    });

    it('debería retornar todas las tareas', async () => {
      await repository.create({ title: 'Tarea 1' });
      await repository.create({ title: 'Tarea 2' });

      const tasks = await repository.findAll();
      expect(tasks).toHaveLength(2);
    });

    it('debería filtrar tareas por estado', async () => {
      await repository.create({ title: 'Tarea 1', status: TaskStatus.PENDING });
      await repository.create({ title: 'Tarea 2', status: TaskStatus.COMPLETED });
      await repository.create({ title: 'Tarea 3', status: TaskStatus.PENDING });

      const pendingTasks = await repository.findAll(TaskStatus.PENDING);
      expect(pendingTasks).toHaveLength(2);
      expect(pendingTasks.every((task) => task.status === TaskStatus.PENDING)).toBe(true);
    });
  });

  describe('findById', () => {
    it('debería retornar la tarea cuando se encuentra', async () => {
      const created = await repository.create({ title: 'Tarea de Prueba' });
      const found = await repository.findById(created.id);

      expect(found).toEqual(created);
    });

    it('debería retornar null cuando la tarea no se encuentra', async () => {
      const found = await repository.findById('id-no-existente');
      expect(found).toBeNull();
    });
  });

  describe('update', () => {
    it('debería actualizar los campos de la tarea', async () => {
      const created = await repository.create({ title: 'Título Original' });

      await new Promise(resolve => setTimeout(resolve, 10));

      const updated = await repository.update(created.id, {
        title: 'Título Actualizado',
        status: TaskStatus.COMPLETED,
      });

      expect(updated).not.toBeNull();
      expect(updated?.title).toBe('Título Actualizado');
      expect(updated?.status).toBe(TaskStatus.COMPLETED);
      expect(updated?.updatedAt.getTime()).toBeGreaterThanOrEqual(created.updatedAt.getTime());
    });

    it('debería retornar null al actualizar una tarea no existente', async () => {
      const updated = await repository.update('id-no-existente', { title: 'Nuevo Título' });
      expect(updated).toBeNull();
    });

    it('debería actualizar solo los campos proporcionados', async () => {
      const created = await repository.create({
        title: 'Título Original',
        description: 'Descripción Original',
      });

      const updated = await repository.update(created.id, { title: 'Título Actualizado' });

      expect(updated?.title).toBe('Título Actualizado');
      expect(updated?.description).toBe('Descripción Original');
    });
  });

  describe('delete', () => {
    it('debería eliminar una tarea existente', async () => {
      const created = await repository.create({ title: 'Tarea de Prueba' });
      const deleted = await repository.delete(created.id);

      expect(deleted).toBe(true);

      const found = await repository.findById(created.id);
      expect(found).toBeNull();
    });

    it('debería retornar false al eliminar una tarea no existente', async () => {
      const deleted = await repository.delete('id-no-existente');
      expect(deleted).toBe(false);
    });
  });
});
