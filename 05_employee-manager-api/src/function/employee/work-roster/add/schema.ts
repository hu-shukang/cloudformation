import { EmployeeInfoAddForm, WorkRosterForm, WorkRosterRow } from 'model';
import { JSONSchemaType } from 'ajv';
import { Const } from 'utils';

const workRosterRowSchema: JSONSchemaType<WorkRosterRow> = {
  type: 'object',
  required: ['date', 'in', 'out'],
  properties: {
    date: {
      type: 'number',
      errorMessage: {
        type: '日付は数値型です',
      },
    },
    in: {
      type: 'string',
      format: 'HHmm',
      errorMessage: {
        type: '出勤は文字列型です',
        format: '正しい時刻(HH:mm)を入れて下さい',
      },
    },
    out: {
      type: 'string',
      format: 'HHmm',
      after: { $data: '1/in' },
      errorMessage: {
        type: '退勤は文字列型です',
        format: '正しい時刻(HH:mm)を入れて下さい',
        after: '出勤より後の時刻を入れて下さい',
      },
    },
    break: {
      type: 'string',
      nullable: true,
      pattern: `^(|${Const.PATTERN_BREAK})$`,
      errorMessage: {
        type: '通常休憩は文字列型です',
        pattern: '通常休憩の値は不正です',
      },
    },
    midnightBreak: {
      type: 'string',
      nullable: true,
      pattern: `^(|${Const.PATTERN_BREAK})$`,
      errorMessage: {
        type: '深夜休憩は文字列型です',
        pattern: '深夜休憩の値は不正です',
      },
    },
    timeOff: {
      type: 'string',
      nullable: true,
      pattern: `^(|${Const.PATTERN_TIME_OFF})$`,
      errorMessage: {
        type: '休暇は文字列型です',
        pattern: '休暇の値は不正です',
      },
    },
    comment: {
      type: 'string',
      nullable: true,
      errorMessage: {
        type: 'コメントは文字列型です',
      },
    },
  },
  additionalProperties: false,
  errorMessage: {
    type: '選択肢のJSONフォーマットは正しくない',
    required: {
      date: '日付は必須項目です',
      in: '出勤は必須項目です',
      out: '退勤は必須項目です',
    },
    additionalProperties: '定義外のフィールドがありました',
  },
};

const listSchema: JSONSchemaType<WorkRosterRow[]> = {
  type: 'array',
  items: workRosterRowSchema,
  errorMessage: {
    type: '詳細情報は配列型です',
  },
};

export const schema: JSONSchemaType<WorkRosterForm> = {
  type: 'object',
  required: ['list', 'date'],
  properties: {
    date: {
      type: 'number',
      errorMessage: {
        type: '日付は数値型です',
      },
    },
    list: listSchema,
  },
  additionalProperties: false,
  errorMessage: {
    type: 'JSONフォーマットは正しくない',
    required: {
      date: '年月は必須項目です',
      list: '勤務詳細は必須項目です',
    },
    additionalProperties: '定義外のフィールドがありました',
  },
};
