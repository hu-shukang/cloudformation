import { FastifyInstance } from 'fastify';
import { schema, Body, Reply } from './schema';
import { SignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import { AWS, stringUtil } from '@/util';

const routes = async (fastify: FastifyInstance) => {
  fastify.post<{ Body: Body; Reply: Reply }>('/auth/signup', { schema: schema }, async (request, reply) => {
    const { email } = request.body;
    const command = new SignUpCommand({
      ClientId: process.env.USER_POOL_CLIENT_ID,
      Username: email,
      Password: stringUtil.randomString(),
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
      ],
      ClientMetadata: {
        host: request.hostname,
      },
    });

    const resp = await AWS.cognito.send(command);
    reply.log.info(resp, 'User signed up successfully:');

    return {
      message: 'OK',
    };
  });
};

export default routes;
