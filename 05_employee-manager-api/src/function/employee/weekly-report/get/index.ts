import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { weeklyReportService } from 'service';
import { WeeklyReportEntity } from 'model';
import { Const, lambdaHandler, validatorUtil } from 'utils';
import { schema } from './schema';

const func = async (event: APIGatewayProxyEvent, _: Context): Promise<WeeklyReportEntity> => {
  const form = validatorUtil.parse(schema, JSON.stringify(event.pathParameters));
  const id = Const.EMPLOYEE_ID;
  const result = await weeklyReportService.getWeeklyReport(id, form.start, form.end);
  return result;
};

export const handler = lambdaHandler(func);
