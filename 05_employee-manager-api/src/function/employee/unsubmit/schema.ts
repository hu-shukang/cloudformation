import { EmployeeInfoAddForm, WorkRosterForm, WorkRosterRow, SubmitForm } from 'model';
import { JSONSchemaType } from 'ajv';
import { Const } from 'utils';

export const schema: JSONSchemaType<SubmitForm> = {
  type: 'object',
  required: ['prop'],
  properties: {
    prop: {
      type: 'string',
      errorMessage: {
        type: 'propは文字列型です',
      },
    },
  },
  additionalProperties: false,
  errorMessage: {
    type: '選択肢のJSONフォーマットは正しくない',
    required: {
      type: 'propは必須項目です',
    },
    additionalProperties: '定義外のフィールドがありました',
  },
};
