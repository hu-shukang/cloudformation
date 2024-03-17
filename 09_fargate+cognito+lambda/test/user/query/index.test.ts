import { server } from '@/index';

describe('user query api', () => {
  afterAll(() => {
    server.close();
  });

  test('testcase 01', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/user',
    });

    console.log(response.json());
  });
});
