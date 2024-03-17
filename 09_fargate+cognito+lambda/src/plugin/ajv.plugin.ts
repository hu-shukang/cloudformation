import Ajv, { Options } from 'ajv';
import addFormats from 'ajv-formats';
import fp from 'fastify-plugin';

const ajv = (options?: Options) => {
  const ajvInstance = new Ajv({
    removeAdditional: false,
    coerceTypes: false,
    allErrors: true,
    $data: true,
    ...options,
  });
  addFormats(ajvInstance);
  return ajvInstance;
};

const schemaCompilers: Record<string, Ajv> = {
  body: ajv(),
  params: ajv(),
  querystring: ajv({ coerceTypes: true }),
  headers: ajv(),
};

export default fp((server, _opt, done) => {
  server.setValidatorCompiler((req) => {
    if (!req.httpPart) {
      throw new Error('Missing httpPart');
    }
    const compiler = schemaCompilers[req.httpPart];
    if (!compiler) {
      throw new Error(`Missing compiler for ${req.httpPart}`);
    }
    return compiler.compile(req.schema);
  });
  done();
});
