import { UpdateCommand, UpdateCommandInput } from '@aws-sdk/lib-dynamodb';
import { docClient } from './utils/dynamodb.util';

class WorkTableUpdateAction {
  public async action() {
    const input: UpdateCommandInput = {
      TableName: 'DynamoDB-Demo-WorkTable',
      Key: {
        userId: 'A001',
        date: '2023-01-01',
      },
      UpdateExpression: 'set startTime = :startTime, endTime = :endTime',
      ExpressionAttributeValues: {
        ':startTime': '09:30',
        ':endTime': '18:30',
      },
    };
    const result = await docClient.send(new UpdateCommand(input));
    return result;
  }
}

export const workTableUpdateAction = new WorkTableUpdateAction();
