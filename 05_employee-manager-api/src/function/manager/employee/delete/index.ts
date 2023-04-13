import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { Func, HttpError } from 'model';
import { Const, lambdaHandler } from 'utils';
import { employeeService } from 'service';

const func: Func<string> = async (event: APIGatewayProxyEvent, _: Context): Promise<string> => {
  const id = event.pathParameters?.id;
  if (id == undefined) {
    throw new HttpError(Const.HTTP_STATUS_400, '社員IDはありません');
  }
  await employeeService.deleteEmployee(id);
  return 'OK';
};

export const handler = lambdaHandler(func);
