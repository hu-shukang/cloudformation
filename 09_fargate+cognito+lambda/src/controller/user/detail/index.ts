import { FastifyInstance } from 'fastify';
import { schema, Params, Reply } from './schema';
import { Errors } from '@/model';
import { UserEntity } from '@/entity/user.entity';

const routes = async (fastify: FastifyInstance) => {
  fastify.get<{ Params: Params; Reply: Reply }>('/user/:sub', { schema: schema }, async (request) => {
    const { sub } = request.params;
    const result = await fastify.db.getRepository(UserEntity).findOne({ where: { sub }, withDeleted: false });
    if (result === null) {
      throw Errors.badRequest;
    }
    return result;
  });
};

export default routes;
