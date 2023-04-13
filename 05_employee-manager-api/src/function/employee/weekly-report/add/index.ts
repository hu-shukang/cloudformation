import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { Func } from 'model';
import { weeklyReportService } from 'service';
import { Const, lambdaHandler, validatorUtil } from 'utils';
import { schema } from './schema';

const func: Func<string> = async (event: APIGatewayProxyEvent, _: Context): Promise<string> => {
  const form = validatorUtil.parse(schema, event.body);
  const id = Const.EMPLOYEE_ID;
  await weeklyReportService.addWeeklyReport(id, form);
  return 'OK';
};

export const handler = lambdaHandler(func);
