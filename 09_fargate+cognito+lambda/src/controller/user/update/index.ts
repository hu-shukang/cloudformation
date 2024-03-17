import { FastifyInstance } from 'fastify';
import { schema, Params, Body, Reply } from './schema';
import { UserEntity } from '@/entity/user.entity';
import { Errors } from '@/model';

const routes = async (fastify: FastifyInstance) => {
  fastify.put<{ Params: Params; Body: Body; Reply: Reply }>('/user/:sub', { schema: schema }, async (request) => {
    const { sub } = request.params;
    const form = request.body;
    const result = await fastify.db.getRepository(UserEntity).update(sub, form);
    if (result.affected !== 1) {
      throw Errors.badRequest;
    }
    return { result: 'OK' };
  });
};

export default routes;
