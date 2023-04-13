import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { WeeklyReportDesc } from 'model';
import { weeklyReportService } from 'service';
import { Const, lambdaHandler, validatorUtil } from 'utils';
import { schema } from './schema';

const func = async (event: APIGatewayProxyEvent, _: Context): Promise<WeeklyReportDesc[]> => {
  const form = validatorUtil.parse(schema, JSON.stringify(event.queryStringParameters));
  const id = Const.EMPLOYEE_ID;
  const date = Number(form.date);
  const data = await weeklyReportService.listWeeklyReport(id, date);
  return data;
};

export const handler = lambdaHandler(func);
