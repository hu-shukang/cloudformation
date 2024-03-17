import swagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fp from 'fastify-plugin';

export default fp((server, _opt, done) => {
  if (process.env.NODE_ENV === 'local') {
    server.register(swagger, {
      swagger: {
        info: {
          title: 'API swagger',
          description: 'Testing the Fastify swagger API',
          version: '0.1.0',
        },
        externalDocs: {
          url: 'https://swagger.io',
          description: 'Find more info here',
        },
        host: 'localhost',
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
        tags: [
          { name: 'user', description: 'User related end-points' },
          { name: 'auth', description: 'auth related end-points' },
        ],
      },
    });
    server.register(fastifySwaggerUi, {
      routePrefix: '/doc',
    });
  }

  done();
});
