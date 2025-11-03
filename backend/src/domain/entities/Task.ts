
export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}


export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}


export interface CreateTaskDTO {
  title: string;
  description?: string;
  status?: TaskStatus;
}


export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
}


export interface TaskQueryParams {
  status?: TaskStatus;
}
