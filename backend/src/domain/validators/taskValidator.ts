import { z } from 'zod';
import { TaskStatus, } from '../entities/Task';


export const createTaskSchema = z.object({
  title: z
    .string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(100, 'El título no debe exceder 100 caracteres'),
  description: z.string().max(500, 'La descripción no debe exceder 500 caracteres').optional(),
  status: z.nativeEnum(TaskStatus).optional().default(TaskStatus.PENDING),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(100, 'El título no debe exceder 100 caracteres')
    .optional(),
  description: z.string().max(500, 'La descripción no debe exceder 500 caracteres').optional(),
  status: z.nativeEnum(TaskStatus).optional(),
});

export const taskIdSchema = z.string().uuid('Formato de ID de tarea inválido');


export const taskQuerySchema = z.object({
  status: z.nativeEnum(TaskStatus).optional(),
});
