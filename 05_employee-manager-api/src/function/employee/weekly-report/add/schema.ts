import { Delta, Op, WeeklyReportForm } from 'model';
import { JSONSchemaType } from 'ajv';

type InsertType = object | string;

const insertSchema: JSONSchemaType<InsertType> = {
  anyOf: [
    {
      type: 'object',
      nullable: true,
    },
    {
      type: 'string',
      nullable: true,
    },
  ],
  errorMessage: 'insertは型不正',
};

const opSchema: any = {
  type: 'object',
  properties: {
    insert: insertSchema,
    delete: {
      type: 'number',
      nullable: true,
      errorMessage: 'deleteは型不正',
    },
    retain: {
      type: 'number',
      nullable: true,
      errorMessage: 'retainは型不正',
    },
    attributes: {
      type: 'object',
      nullable: true,
      errorMessage: 'attributesは型不正',
    },
  },
  additionalProperties: false,
  errorMessage: {
    type: '選択肢のJSONフォーマットは正しくない',
    additionalProperties: '定義外のフィールドがありました',
  },
};

const opsSchema: JSONSchemaType<Op[]> = {
  type: 'array',
  items: opSchema,
  errorMessage: {
    type: '詳細情報は配列型です',
  },
};

const deltaSchema: JSONSchemaType<Delta> = {
  type: 'object',
  required: ['ops'],
  properties: {
    ops: opsSchema,
  },
  additionalProperties: false,
  errorMessage: {
    type: 'JSONフォーマットは正しくない',
    required: {
      ops: 'opsは必須項目です',
    },
    additionalProperties: '定義外のフィールドがありました',
  },
};

export const schema: JSONSchemaType<WeeklyReportForm> = {
  type: 'object',
  required: ['start', 'end', 'workContent', 'problemAndSolution', 'study', 'matter'],
  properties: {
    start: {
      type: 'number',
      errorMessage: {
        type: '日付は数値型です',
      },
    },
    end: {
      type: 'number',
      errorMessage: {
        type: '日付は数値型です',
      },
    },
    workContent: deltaSchema,
    problemAndSolution: deltaSchema,
    study: deltaSchema,
    matter: deltaSchema,
  },
  additionalProperties: false,
  errorMessage: {
    type: 'JSONフォーマットは正しくない',
    required: {
      start: '開始日は必須項目です',
      end: '終了日は必須項目です',
      workContent: '作業内容は必須項目です',
      problemAndSolution: '課題と解決策は必須項目です',
      study: '学びと気づきは必須項目です',
      matter: '報告・相談事項は必須項目です',
    },
    additionalProperties: '定義外のフィールドがありました',
  },
};
