import { FastifyInstance } from 'fastify';

const routes = async (fastify: FastifyInstance) => {
  fastify.get('/healthcheck', { logLevel: 'silent' }, async (_, reply) => {
    reply.status(200);
  });
};

export default routes;
