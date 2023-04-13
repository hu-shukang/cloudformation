import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { SubmitListVo } from 'model';
import { submitService } from 'service';
import { lambdaHandler, validatorUtil } from 'utils';
import { schema } from './schema';

const func = async (event: APIGatewayProxyEvent, _: Context): Promise<SubmitListVo> => {
  const form = validatorUtil.parse(schema, JSON.stringify(event.pathParameters));
  const id = '00000';
  const date = Number(form.date);
  const data = await submitService.listSubmit(id, date);
  return data;
};

export const handler = lambdaHandler(func);
