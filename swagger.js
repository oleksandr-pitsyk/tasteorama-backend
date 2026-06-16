import swaggerAutogen from 'swagger-autogen';

const publicApiUrl = process.env.RENDER_EXTERNAL_URL ?? process.env.PUBLIC_API_URL;
let swaggerHost = 'localhost:3000';
let swaggerSchemes = ['http'];

if (publicApiUrl) {
  try {
    const parsedUrl = new URL(publicApiUrl);
    swaggerHost = parsedUrl.host;
    swaggerSchemes = [parsedUrl.protocol.replace(':', '')];
  } catch {
    // Use defaults when PUBLIC_API_URL is invalid.
  }
}

const doc = {
  info: {
    title: 'Tasteorama API',
    description: 'API documentation for Tasteorama project',
    version: '1.0.0',
  },
  host: swaggerHost,
  basePath: '/',
  schemes: swaggerSchemes,
};

// Файл, який створиться автоматично (кладемо його в src)
const outputFile = './src/swagger-output.json';

// Шлях до твого головного файлу сервера, де підключаються всі роути
const routesEndpointsFiles = ['./src/server.js'];

swaggerAutogen()(outputFile, routesEndpointsFiles, doc);
