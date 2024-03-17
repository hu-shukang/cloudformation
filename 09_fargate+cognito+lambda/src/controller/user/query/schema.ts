import { FromSchema } from 'json-schema-to-ts';
import { FastifySchema } from 'fastify';
import { Validation } from '@/model';

/**
 * request body Schema
 */
const querystringJsonSchema = {
  type: 'object',
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
 * query string params Type
 */
export type Query = FromSchema<typeof querystringJsonSchema>;

/**
 * 200 response body schema
 */
const replyJsonSchema = {
  description: 'Success',
  type: 'array',
  items: {
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
  },
} as const;

/**
 * 200 response body type
 */
export type Reply = FromSchema<typeof replyJsonSchema>;

/**
 * api schema
 */
export const schema: FastifySchema = {
  summary: 'ユーザ検索',
  tags: ['user'],
  querystring: querystringJsonSchema,
  response: {
    200: replyJsonSchema,
  },
} as const;
