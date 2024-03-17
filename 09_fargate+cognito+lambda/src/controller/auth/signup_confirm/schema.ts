import { FromSchema } from 'json-schema-to-ts';
import { FastifySchema } from 'fastify';
import { Validation } from '@/model';

/**
 * request body Schema
 */
const queryStringSchema = {
  type: 'object',
  required: ['code', 'key'],
  properties: {
    code: Validation.properties.auth.code,
    key: Validation.properties.auth.key,
  },
  additionalProperties: false,
} as const;

/**
 * request body Type
 */
export type Query = FromSchema<typeof queryStringSchema>;

/**
 * 301 response body schema
 */
const replyJsonSchema = {
  description: 'リダイレクト',
  headers: {
    Location: {
      type: 'string',
      description: 'リダイレクトURL',
    },
  },
  type: 'object',
  properties: {},
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
  summary: '登録後のメール認証',
  tags: ['auth'],
  querystring: queryStringSchema,
  response: {
    301: replyJsonSchema,
  },
} as const;
