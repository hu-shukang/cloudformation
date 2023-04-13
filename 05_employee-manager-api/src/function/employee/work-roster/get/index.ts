import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { Func, HttpError, WorkRosterVo } from 'model';
import { workRosterService } from 'service';
import { Const, lambdaHandler, validatorUtil } from 'utils';
import { schema } from './schema';

const func = async (event: APIGatewayProxyEvent, _: Context): Promise<WorkRosterVo> => {
  const form = validatorUtil.parse(schema, JSON.stringify(event.pathParameters));
  const id = Const.EMPLOYEE_ID;
  const date = Number(form.date);
  const data = await workRosterService.getWorkRoster(id, date);
  return data;
};

export const handler = lambdaHandler(func);
