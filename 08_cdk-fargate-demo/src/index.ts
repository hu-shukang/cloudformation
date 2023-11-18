import Autoload from '@fastify/autoload';
import fastify from 'fastify';
import path from 'path';

const server = fastify({
  logger: true,
});

server.register(Autoload, {
  dir: path.join(__dirname, 'controller'),
  matchFilter: (p) => p.includes('index'),
  dirNameRoutePrefix: false,
  options: { prefix: '/api' },
});

server.listen({ host: '0.0.0.0', port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(server.printRoutes({ includeHooks: true }));
  console.log(`server listening at ${address}`);
});
