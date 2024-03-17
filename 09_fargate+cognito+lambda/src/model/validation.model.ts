const sub = { type: 'string', description: 'ユーザID', maxLength: 36, minLength: 36 } as const;
const name = { type: 'string', description: 'ユーザ名', maxLength: 100 } as const;
const phone = { type: 'string', description: '電話番号', maxLength: 15 } as const;
const email = { type: 'string', description: 'メール', format: 'email' } as const;
const code = { type: 'string', description: '認証コード' } as const;
const role = { type: 'string', description: 'ロール', enum: ['1', '2', '3'] } as const;
const key = { type: 'string', description: '認証キー' } as const;
const message = { type: 'string', description: 'メッセージ' } as const;

export default {
  properties: {
    user: { sub, name, phone, email, role, code },
    auth: { key, code },
  },
  result: { message },
} as const;
