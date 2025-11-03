import request from 'supertest';
import { createApp } from '../../infraestructure/app';
import { TaskStatus } from '../../domain/entities/Task';
import { Application } from 'express';

describe('Pruebas de Integración de API de Tareas', () => {
  let app: Application;

  beforeEach(() => {
    app = createApp();
  });

  describe('GET /health', () => {
    it('debería retornar el estado de salud', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Servidor funcionando correctamente');
    });
  });

  describe('POST /api/tasks', () => {
    it('debería crear una tarea con datos válidos', async () => {
      const taskData = {
        title: 'Tarea de Prueba',
        description: 'Descripción de Prueba',
        status: TaskStatus.PENDING,
      };

      const response = await request(app).post('/api/tasks').send(taskData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe(taskData.title);
      expect(response.body.data.description).toBe(taskData.description);
    });

    it('debería crear una tarea con campos mínimos', async () => {
      const taskData = {
        title: 'Tarea Mínima',
      };

      const response = await request(app).post('/api/tasks').send(taskData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(taskData.title);
    });

    it('debería rechazar tarea con título menor a 3 caracteres', async () => {
      const taskData = {
        title: 'Ab',
      };

      const response = await request(app).post('/api/tasks').send(taskData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('debería rechazar tarea sin título', async () => {
      const taskData = {
        description: 'Sin título',
      };

      const response = await request(app).post('/api/tasks').send(taskData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('debería rechazar tarea con estado inválido', async () => {
      const taskData = {
        title: 'Tarea de Prueba',
        status: 'estado_invalido',
      };

      const response = await request(app).post('/api/tasks').send(taskData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/tasks', () => {
    it('debería retornar un array vacío cuando no hay tareas', async () => {
      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
      expect(response.body.count).toBe(0);
    });

    it('debería retornar todas las tareas', async () => {
      await request(app).post('/api/tasks').send({ title: 'Tarea 1' });
      await request(app).post('/api/tasks').send({ title: 'Tarea 2' });

      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.count).toBe(2);
    });

    it('debería filtrar tareas por estado', async () => {
      await request(app).post('/api/tasks').send({ title: 'Tarea 1', status: TaskStatus.PENDING });
      await request(app)
        .post('/api/tasks')
        .send({ title: 'Tarea 2', status: TaskStatus.COMPLETED });

      const response = await request(app).get('/api/tasks?status=pending');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].status).toBe(TaskStatus.PENDING);
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('debería retornar una tarea por id', async () => {
      const createResponse = await request(app).post('/api/tasks').send({ title: 'Tarea de Prueba' });
      const taskId = createResponse.body.data.id;

      const response = await request(app).get(`/api/tasks/${taskId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(taskId);
    });

    it('debería retornar 404 para tarea no existente', async () => {
      const response = await request(app).get(
        '/api/tasks/00000000-0000-0000-0000-000000000000',
      );

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('debería retornar 400 para formato de id inválido', async () => {
      const response = await request(app).get('/api/tasks/id-invalido');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('debería actualizar una tarea', async () => {
      const createResponse = await request(app).post('/api/tasks').send({ title: 'Original' });
      const taskId = createResponse.body.data.id;

      const updateData = {
        title: 'Título Actualizado',
        status: TaskStatus.COMPLETED,
      };

      const response = await request(app).put(`/api/tasks/${taskId}`).send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.status).toBe(updateData.status);
    });

    it('debería retornar 404 para tarea no existente', async () => {
      const response = await request(app)
        .put('/api/tasks/00000000-0000-0000-0000-000000000000')
        .send({ title: 'Actualizado' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('debería rechazar actualización con título inválido', async () => {
      const createResponse = await request(app).post('/api/tasks').send({ title: 'Original' });
      const taskId = createResponse.body.data.id;

      const response = await request(app).put(`/api/tasks/${taskId}`).send({ title: 'Ab' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('debería eliminar una tarea', async () => {
      const createResponse = await request(app).post('/api/tasks').send({ title: 'Tarea de Prueba' });
      const taskId = createResponse.body.data.id;

      const response = await request(app).delete(`/api/tasks/${taskId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const getResponse = await request(app).get(`/api/tasks/${taskId}`);
      expect(getResponse.status).toBe(404);
    });

    it('debería retornar 404 para tarea no existente', async () => {
      const response = await request(app).delete(
        '/api/tasks/00000000-0000-0000-0000-000000000000',
      );

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Manejador 404', () => {
    it('debería retornar 404 para rutas no existentes', async () => {
      const response = await request(app).get('/ruta-no-existente');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Ruta no encontrada');
    });
  });
});
