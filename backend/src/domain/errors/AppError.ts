
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}


export class NotFoundError extends AppError {
  constructor(message: string = 'Recurso no encontrado') {
    super(message, 404);
  }
}


export class ValidationError extends AppError {
  constructor(message: string = 'Validación fallida') {
    super(message, 400);
  }
}


export class BadRequestError extends AppError {
  constructor(message: string = 'Petición incorrecta') {
    super(message, 400);
  }
}
