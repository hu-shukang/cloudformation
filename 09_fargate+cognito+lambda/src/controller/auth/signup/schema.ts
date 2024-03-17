import { FromSchema } from 'json-schema-to-ts';
import { FastifySchema } from 'fastify';
import { Validation } from '@/model';

/**
 * request body Schema
 */
const bodyJsonSchema = {
  type: 'object',
  required: ['email'],
  properties: {
    email: Validation.properties.user.email,
  },
  additionalProperties: false,
} as const;

/**
 * request body Type
 */
export type Body = FromSchema<typeof bodyJsonSchema>;

/**
 * 200 response body schema
 */
const replyJsonSchema = {
  description: 'Success',
  type: 'object',
  required: ['message'],
  properties: {
    message: Validation.result.message,
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
  summary: 'ユーザ登録',
  tags: ['auth'],
  body: bodyJsonSchema,
  response: {
    200: replyJsonSchema,
  },
} as const;
