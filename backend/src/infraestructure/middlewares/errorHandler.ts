import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../domain/errors/AppError';


export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.error('Error:', error);


  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      statusCode: error.statusCode,
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    statusCode: 500,
  });
};
