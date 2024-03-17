import { HttpError } from '@/model';
import fp from 'fastify-plugin';

export default fp((server, _opt, done) => {
  server.setErrorHandler((error, request, reply) => {
    let statusCode = 500;
    let message = 'サーバエラーが発生しました';
    if (error instanceof HttpError) {
      statusCode = error.statusCode;
      message = error.message;
    } else if (error.validation) {
      statusCode = 400;
      message = 'ユーザ入力値不正';
    }
    reply.log.error(
      {
        request: {
          url: request.url,
          method: request.method,
          body: request.body,
          params: request.params,
          headers: request.headers,
          query: request.query,
        },
        error: error,
      },
      message,
    );
    reply.status(statusCode).send({ message: message });
  });
  done();
});
