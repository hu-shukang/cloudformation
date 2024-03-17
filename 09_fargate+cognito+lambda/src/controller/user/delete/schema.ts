import { FromSchema } from 'json-schema-to-ts';
import { FastifySchema } from 'fastify';
import { Validation } from '@/model';

/**
 * request params Schema
 */
const paramsJsonSchema = {
  type: 'object',
  required: ['sub'],
  properties: {
    sub: Validation.properties.user.sub,
  },
  additionalProperties: false,
} as const;

/**
 * request params Type
 */
export type Params = FromSchema<typeof paramsJsonSchema>;

/**
 * 200 response body schema
 */
const replyJsonSchema = {
  description: 'Success',
  type: 'object',
  required: ['result'],
  properties: {
    result: Validation.result.message,
  },
  additionalProperties: false,
} as const;

/**
 * 200 response body type
 */
export type Reply = FromSchema<typeof replyJsonSchema>;

/**
 * api schema
 */
export const schema: FastifySchema = {
  summary: 'ユーザ削除',
  tags: ['user'],
  params: paramsJsonSchema,
  response: {
    200: replyJsonSchema,
  },
} as const;
