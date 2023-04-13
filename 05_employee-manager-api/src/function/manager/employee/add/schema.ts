import { EmployeeInfoAddForm } from 'model';
import { JSONSchemaType } from 'ajv';

export const schema: JSONSchemaType<EmployeeInfoAddForm> = {
  type: 'object',
  required: ['id', 'name', 'department', 'bossId', 'email'],
  properties: {
    id: {
      type: 'string',
      errorMessage: {
        type: '社員番号は文字列型です',
      },
    },
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
    email: {
      type: 'string',
      errorMessage: {
        type: 'メールアドレスは文字列型です',
      },
    },
  },
  additionalProperties: false,
  errorMessage: {
    type: 'JSONフォーマットは正しくない',
    required: {
      id: '社員番号は必須です',
      name: '名前は必須です',
      department: '所属部門は必須です',
      bossId: '上司を指定する必要があります',
      email: 'メールアドレスは必須です',
    },
    additionalProperties: '定義外のフィールドがありました',
  },
};
