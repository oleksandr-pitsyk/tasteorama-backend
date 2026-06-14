import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Tasteorama API',
    description: 'API documentation for Tasteorama project',
    version: '1.0.0',
  },
  host: 'localhost:3000',
  basePath: '/',
  schemes: ['http'],
};

// Файл, який створиться автоматично (кладемо його в src)
const outputFile = './src/swagger-output.json';

// Шлях до твого головного файлу сервера, де підключаються всі роути
const routesEndpointsFiles = ['./src/server.js'];

swaggerAutogen()(outputFile, routesEndpointsFiles, doc);
