import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { CreateTaskDTO,UpdateTaskDTO, Task } from '../../domain/entities/Task';
import { NotFoundError } from '../../domain/errors/AppError';


export class TaskService {
  constructor(private taskRepository: ITaskRepository) { }

  async getAllTasks(status?: string): Promise<Task[]> {
    return this.taskRepository.findAll(status);
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundError(`Tarea con ID ${id} no encontrada`);
    }

    return task;
  }

  async createTask(data: CreateTaskDTO): Promise<Task> {
    return this.taskRepository.create(data);
  }

  async updateTask(id: string, data: UpdateTaskDTO): Promise<Task> {
    const updatedTask = await this.taskRepository.update(id, data);

    if (!updatedTask) {
      throw new NotFoundError(`Tarea con ID ${id} no encontrada`);
    }

    return updatedTask;
  }

  async deleteTask(id: string): Promise<void> {
    const deleted = await this.taskRepository.delete(id);

    if (!deleted) {
      throw new NotFoundError(`Tarea con ID ${id} no encontrada`);
    }
  }
}
