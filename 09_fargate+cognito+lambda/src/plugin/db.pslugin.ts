import { AppDataSource } from '@/data-source';
import fp from 'fastify-plugin';

export default fp(async (server, _opt) => {
  const dataSource = await AppDataSource.initialize();
  server.decorate('db', dataSource);
  server.addHook('onClose', async () => {
    await dataSource.destroy();
  });
});
