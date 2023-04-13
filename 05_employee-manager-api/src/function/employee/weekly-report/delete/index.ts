import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { weeklyReportService } from 'service';
import { Const, lambdaHandler, validatorUtil } from 'utils';
import { schema } from './schema';

const func = async (event: APIGatewayProxyEvent, _: Context): Promise<string> => {
  const form = validatorUtil.parse(schema, JSON.stringify(event.pathParameters));
  const id = Const.EMPLOYEE_ID;
  await weeklyReportService.deleteWeeklyReport(id, form.start, form.end);
  return 'OK';
};

export const handler = lambdaHandler(func);
