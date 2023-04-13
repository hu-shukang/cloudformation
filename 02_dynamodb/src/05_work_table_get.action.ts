import { GetCommand, GetCommandInput } from '@aws-sdk/lib-dynamodb';
import { docClient } from './utils/dynamodb.util';

class WorkTableGetAction {
  public async action() {
    const input: GetCommandInput = {
      TableName: 'DynamoDB-Demo-WorkTable',
      Key: {
        userId: 'A001',
        date: '2023-01-02',
      },
    };
    const result = await docClient.send(new GetCommand(input));
    return result;
  }
}

export const workTableGetAction = new WorkTableGetAction();
