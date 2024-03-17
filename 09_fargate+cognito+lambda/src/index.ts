import 'reflect-metadata';
import fastify from 'fastify';
import AutoLoad from '@fastify/autoload';
import path from 'path';
import routes from '@fastify/routes';
import { v4 } from 'uuid';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

declare module 'fastify' {
  interface FastifyInstance {
    db: DataSource;
  }
}

console.log(`DB_HOST: ${process.env.DB_HOST}`);
console.log(`DB_USERNAME: ${process.env.DB_USERNAME}`);
console.log(`DB_PASSWORD: ${process.env.DB_PASSWORD}`);
console.log(`DB_NAME: ${process.env.DB_NAME}`);

if (process.env.NODE_ENV === 'local') {
  const envPath = path.join(__dirname, `../env/.env.${process.env.NODE_ENV}`);
  dotenv.config({ path: envPath });
}

export const server = fastify({ logger: true, genReqId: () => v4() });

server.register(routes);
server.register(AutoLoad, {
  dir: path.join(__dirname, 'plugin'),
  matchFilter: (path) => path.includes('plugin'),
});

server.register(AutoLoad, {
  dir: path.join(__dirname, 'controller'),
  dirNameRoutePrefix: false,
  matchFilter: (path) => path.includes('index'),
  options: { prefix: '/api' },
});

server.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
  console.log(server.routes);
});
