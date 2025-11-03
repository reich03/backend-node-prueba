import { v4 as uuidv4 } from 'uuid';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { Task, CreateTaskDTO, TaskStatus } from '../../domain/entities/Task';


export class InMemoryTaskRepository implements ITaskRepository {
    private tasks: Map<string, Task> = new Map();


    async findAll(status?: string): Promise<Task[]> {
        let tasks = Array.from(this.tasks.values());

        if (status) {
            tasks = tasks.filter((task) => task.status === status);
        }

        return tasks;
    }


    async findById(id: string): Promise<Task | null> {
        const task = this.tasks.get(id);
        return task || null;
    }


    async create(data: CreateTaskDTO): Promise<Task> {
        const now = new Date();
        const task: Task = {
            id: uuidv4(),
            title: data.title,
            description: data.description || '',
            status: data.status || TaskStatus.PENDING,
            createdAt: now,
            updatedAt: now,
        };

        this.tasks.set(task.id, task);
        return task;
    }
    async clear(): Promise<void> {
        this.tasks.clear();
    }
}
