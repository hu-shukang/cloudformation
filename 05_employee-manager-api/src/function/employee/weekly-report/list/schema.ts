import { JSONSchemaType } from 'ajv';

type QueryParameterType = {
  date: string;
};

export const schema: JSONSchemaType<QueryParameterType> = {
  type: 'object',
  required: ['date'],
  properties: {
    date: {
      type: 'string',
      pattern: '^[0-9]+$',
      errorMessage: '日付は不正です',
    },
  },
  additionalProperties: false,
  errorMessage: {
    type: 'JSONフォーマットは正しくない',
    required: {
      date: '日付は必須項目です',
    },
    additionalProperties: '定義外のフィールドがありました',
  },
};
