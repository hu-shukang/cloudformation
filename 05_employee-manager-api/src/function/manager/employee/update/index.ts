import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { Func, HttpError } from 'model';
import { lambdaHandler, validatorUtil, Const } from 'utils';
import { schema } from './schema';
import { employeeService } from 'service';

const func: Func<string> = async (event: APIGatewayProxyEvent, _: Context): Promise<string> => {
  const id = event.pathParameters?.id;
  if (id == undefined) {
    throw new HttpError(Const.HTTP_STATUS_400, '社員IDはありません');
  }
  const form = validatorUtil.parse(schema, event.body);
  await employeeService.updateEmployeeInfo(id, form);
  return 'OK';
};

export const handler = lambdaHandler(func);
