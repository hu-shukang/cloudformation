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
 * request body Schema
 */
const bodyJsonSchema = {
  type: 'object',
  required: ['name', 'phone', 'email', 'role'],
  properties: {
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
  summary: 'ユーザ編集',
  tags: ['user'],
  params: paramsJsonSchema,
  body: bodyJsonSchema,
  response: {
    200: replyJsonSchema,
  },
} as const;
