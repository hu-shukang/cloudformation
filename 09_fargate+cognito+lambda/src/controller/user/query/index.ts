import { FastifyInstance } from 'fastify';
import { schema, Query, Reply } from './schema';
import { UserEntity } from '@/entity/user.entity';

const routes = async (fastify: FastifyInstance) => {
  fastify.get<{ Querystring: Query; Reply: Reply }>('/user', { schema: schema }, async (request) => {
    const query = request.query;
    const result = await fastify.db.getRepository(UserEntity).find({ where: query, withDeleted: false });
    return result;
  });
};

export default routes;
