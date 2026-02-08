import { serve } from '@hono/node-server';
import { swaggerUI } from '@hono/swagger-ui';
import { Hono } from 'hono';
import { openAPIRouteHandler } from 'hono-openapi';
import { app } from './routes/index.js';
const DEV_SERVER_PORT = 3000;
const devServer = new Hono()
    .route('/', app)
    .get('/openapi', openAPIRouteHandler(app, {
    documentation: {
        info: {
            title: 'Hono API',
            version: '1.0.0',
            description: 'Greeting API',
        },
        servers: [
            {
                url: `http://localhost:${DEV_SERVER_PORT.toString()}`,
                description: 'Local Server',
            },
        ],
    },
}))
    .get('/docs/*', swaggerUI({ url: '/openapi' }));
serve({
    fetch: devServer.fetch,
    port: DEV_SERVER_PORT,
}, (info) => {
    console.log(`Dev server running at: http://localhost:${info.port.toString()}`);
    console.log(`OpenAPI spec available at: http://localhost:${info.port.toString()}/openapi`);
    console.log(`Swagger UI available at: http://localhost:${info.port.toString()}/docs`);
});
