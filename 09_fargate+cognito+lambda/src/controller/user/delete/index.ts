import { FastifyInstance } from 'fastify';
import { schema, Params, Reply } from './schema';
import { Errors } from '@/model';
import { UserEntity } from '@/entity/user.entity';

const routes = async (fastify: FastifyInstance) => {
  fastify.delete<{ Params: Params; Reply: Reply }>('/user/:sub', { schema: schema }, async (request) => {
    const { sub } = request.params;
    const result = await fastify.db.getRepository(UserEntity).softDelete(sub);
    if (result.affected !== 1) {
      throw Errors.badRequest;
    }
    return { result: 'OK' };
  });
};

export default routes;
