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
 * 200 response body type
 */
export type Reply = FromSchema<typeof replyJsonSchema>;

/**
 * api schema
 */
export const schema: FastifySchema = {
  summary: 'ユーザ詳細',
  tags: ['user'],
  params: paramsJsonSchema,
  response: {
    200: replyJsonSchema,
  },
} as const;
