import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

const routes = async (fastify: FastifyInstance, _options: any) => {
  fastify.get('/healthcheck', async (_request: FastifyRequest, reply: FastifyReply) => {
    reply.status(200);
  });
};

export default routes;
