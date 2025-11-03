import { createApp } from './infraestructure/app';
import { config } from './config/config';

const startServer = (): void => {
  const app = createApp();

  const server = app.listen(config.port, () => {
    console.log(`Servidor Corriendo en el puerto: ${config.port} in ${config.nodeEnv} mode`);
    console.log(`Health check: http://localhost:${config.port}/health`);
    console.log(`API endpoints: http://localhost:${config.port}/api/tasks`);
  });

  
  const gracefulShutdown = (): void => {
    server.close(() => {
      console.log('Servidor Cerrado');
      process.exit(0);
    });
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
};

if (!config.isTest) {
  startServer();
}

export { createApp };
