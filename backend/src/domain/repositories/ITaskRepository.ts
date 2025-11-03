import { Task, CreateTaskDTO,UpdateTaskDTO } from '../entities/Task';


export interface ITaskRepository {

  findAll(status?: string): Promise<Task[]>;
  findById(id: string): Promise<Task | null>;
  create(data: CreateTaskDTO): Promise<Task>;
  update(id: string, data: UpdateTaskDTO): Promise<Task | null>;
  delete(id: string): Promise<boolean>;
}
