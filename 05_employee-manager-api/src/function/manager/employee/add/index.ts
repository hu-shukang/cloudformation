import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { Func } from 'model';
import { lambdaHandler, validatorUtil } from 'utils';
import { schema } from './schema';
import { employeeService } from 'service';

const func: Func<string> = async (event: APIGatewayProxyEvent, _: Context): Promise<string> => {
  const form = validatorUtil.parse(schema, event.body);
  await employeeService.addEmployee(form);
  return 'OK';
};

export const handler = lambdaHandler(func);
