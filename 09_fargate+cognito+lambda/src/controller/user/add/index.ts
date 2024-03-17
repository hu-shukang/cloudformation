import { FastifyInstance } from 'fastify';
import { schema, Body, Reply } from './schema';
import { UserEntity } from '@/entity/user.entity';

const routes = async (fastify: FastifyInstance) => {
  fastify.post<{ Body: Body; Reply: Reply }>('/user', { schema: schema }, async (request) => {
    const form = request.body;
    await fastify.db.createQueryBuilder().insert().into(UserEntity).values([form]).execute();
    return { result: 'OK' };
  });
};

export default routes;
