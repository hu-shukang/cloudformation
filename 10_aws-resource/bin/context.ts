export type Context = {
  account: string;
  region: string;
  appName: string;
  env?: string;
};

export const context = {
  account: '471112651100', // AWSアカウント
  region: 'ap-northeast-1',
  appName: 'chat', // アプリ名
};
