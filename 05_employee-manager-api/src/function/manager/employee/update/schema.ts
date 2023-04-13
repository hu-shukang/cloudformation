import { EmployeeInfoUpdateForm } from 'model';
import { JSONSchemaType } from 'ajv';

export const schema: JSONSchemaType<EmployeeInfoUpdateForm> = {
  type: 'object',
  required: ['name', 'department', 'bossId'],
  properties: {
    name: {
      type: 'string',
      errorMessage: {
        type: '名前は文字列型です',
      },
    },
    department: {
      type: 'string',
      errorMessage: {
        type: '所属部門は文字列型です',
      },
    },
    bossId: {
      type: 'string',
      errorMessage: {
        type: '上司の社員番号は文字列型です',
      },
    },
  },
  additionalProperties: false,
  errorMessage: {
    type: 'JSONフォーマットは正しくない',
    required: {
      name: '名前は必須です',
      department: '所属部門は必須です',
      bossId: '上司を指定する必要があります',
    },
    additionalProperties: '定義外のフィールドがありました',
  },
};
