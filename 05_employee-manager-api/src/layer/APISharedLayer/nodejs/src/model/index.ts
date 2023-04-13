import { APIGatewayProxyEvent, Context } from 'aws-lambda';

export * from './src/work.model';
export * from './src/employee.model';
export * from './src/error.model';
export * from './src/common.model';
export * from './src/submit.model';
export * from './src/weekly-report.model';

export type Func<T> = (event: APIGatewayProxyEvent, context: Context) => Promise<T>;
