import { FromSchema } from 'json-schema-to-ts';
import { FastifySchema } from 'fastify';
import { Validation } from '@/model';

/**
 * request body Schema
 */
const bodyJsonSchema = {
  type: 'object',
  required: ['sub', 'name', 'phone', 'email', 'role'],
  properties: {
    sub: Validation.properties.user.sub,
    name: Validation.properties.user.name,
    phone: Validation.properties.user.phone,
    email: Validation.properties.user.email,
    role: Validation.properties.user.role,
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
  summary: 'ユーザ追加',
  tags: ['user'],
  body: bodyJsonSchema,
  response: {
    200: replyJsonSchema,
  },
} as const;
