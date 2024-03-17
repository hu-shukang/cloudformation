export type Context = {
  account: string;
  region: string;
  appName: string;
  env?: string;
};

export const context = {
  account: '', // AWSアカウント
  region: 'ap-northeast-1',
  appName: '', // アプリ名
};
