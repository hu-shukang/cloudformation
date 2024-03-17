import { FastifyInstance } from 'fastify';
import { schema, Query, Reply } from './schema';
import { ConfirmSignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import { AWS, stringUtil } from '@/util';

const routes = async (fastify: FastifyInstance) => {
  fastify.get<{ Querystring: Query; Reply: Reply }>(
    '/auth/signup-confirm',
    { schema: schema },
    async (request, reply) => {
      const { key, code } = request.query;
      const secret = await AWS.secret.getCryptoKey();
      const jsonText = stringUtil.decrypt(key, secret);
      reply.log.info({ name: 'decrypt result' }, jsonText);
      const { email, redirect } = JSON.parse(jsonText);
      const command = new ConfirmSignUpCommand({
        ClientId: process.env.USER_POOL_CLIENT_ID,
        Username: email,
        ConfirmationCode: code,
      });

      const resp = await AWS.cognito.send(command);
      reply.log.info('User signed up confirm successfully:', resp);

      reply.redirect(301, `http://${redirect}`);
    },
  );
};

export default routes;
