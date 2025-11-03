import express, { Application } from 'express';
import cors from 'cors';



export const createApp = (): Application => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', (_req, res) => {
    res.status(200).json({
      success: true,
      message: 'Servidor funcionando correctamente',
      timestamp: new Date().toISOString(),
    });
  });


  // 404 handler
  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      message: 'Ruta no encontrada',
      statusCode: 404,
    });
  });


  return app;
};
