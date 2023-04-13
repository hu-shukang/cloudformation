import { JSONSchemaType } from 'ajv';

type PathParameterType = {
  start: string;
  end: string;
};

export const schema: JSONSchemaType<PathParameterType> = {
  type: 'object',
  required: ['start', 'end'],
  properties: {
    start: {
      type: 'string',
      format: 'date',
      errorMessage: 'startは不正です',
    },
    end: {
      type: 'string',
      format: 'date',
      errorMessage: 'endは不正です',
    },
  },
  additionalProperties: false,
  errorMessage: {
    type: 'JSONフォーマットは正しくない',
    required: {
      start: 'startは必須項目です',
      end: 'endは必須項目です',
    },
    additionalProperties: '定義外のフィールドがありました',
  },
};
