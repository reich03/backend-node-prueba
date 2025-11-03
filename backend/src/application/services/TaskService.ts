import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { CreateTaskDTO, Task } from '../../domain/entities/Task';
import { NotFoundError } from '../../domain/errors/AppError';


export class TaskService {
  constructor(private taskRepository: ITaskRepository) {}

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


}
