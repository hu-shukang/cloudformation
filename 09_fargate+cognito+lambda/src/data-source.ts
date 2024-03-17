import { DataSource } from 'typeorm';

/**
 * DataSource定義
 *
 * username, password, databaseの値は環境変数から設定された場合は環境変数を使用し、そうでなければ初期値を使用する
 *
 * DBの環境変数は.envファイルで設定するではなく、buildspec経由でAWS Secrets Managerから設定する
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: 5432,
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? '12345',
  database: process.env.DB_NAME ?? 'test',
  synchronize: false,
  logging: true,
  entities: ['src/entity/**/*entity*'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: [],
  migrationsTableName: 'migrations',
  poolSize: 10,
});
