import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../../application/services/TaskService';
import { CreateTaskDTO, UpdateTaskDTO, TaskQueryParams } from '../../domain/entities/Task';


export class TaskController {
    constructor(private taskService: TaskService) { }


    getAllTasks = async (
        req: Request<unknown, unknown, unknown, TaskQueryParams>,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const { status } = req.query;
            const tasks = await this.taskService.getAllTasks(status);

            res.status(200).json({
                success: true,
                data: tasks,
                count: tasks.length,
            });
        } catch (error) {
            next(error);
        }
    };


    getTaskById = async (
        req: Request<{ id: string }>,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const task = await this.taskService.getTaskById(req.params.id);

            res.status(200).json({
                success: true,
                data: task,
            });
        } catch (error) {
            next(error);
        }
    };

    createTask = async (
        req: Request<unknown, unknown, CreateTaskDTO>,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const task = await this.taskService.createTask(req.body);

            res.status(201).json({
                success: true,
                data: task,
                message: 'Tarea creada exitosamente',
            });
        } catch (error) {
            next(error);
        }
    };

    updateTask = async (
        req: Request<{ id: string }, unknown, UpdateTaskDTO>,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const task = await this.taskService.updateTask(req.params.id, req.body);

            res.status(200).json({
                success: true,
                data: task,
                message: 'Tarea actualizada exitosamente',
            });
        } catch (error) {
            next(error);
        }
    };


    deleteTask = async (
        req: Request<{ id: string }>,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            await this.taskService.deleteTask(req.params.id);

            res.status(200).json({
                success: true,
                message: 'Tarea eliminada exitosamente',
            });
        } catch (error) {
            next(error);
        }
    };
}
