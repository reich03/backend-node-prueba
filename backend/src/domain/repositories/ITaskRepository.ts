import { Task, CreateTaskDTO } from '../entities/Task';


export interface ITaskRepository {

  findAll(status?: string): Promise<Task[]>;

  
  findById(id: string): Promise<Task | null>;

  
  create(data: CreateTaskDTO): Promise<Task>;

}
