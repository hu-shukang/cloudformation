import {
  TransactWriteCommand,
  TransactWriteCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { docClient } from './utils/dynamodb.util';

class WorkTableTransactAction {
  public async action() {
    const input: TransactWriteCommandInput = {
      TransactItems: [
        {
          Update: {
            TableName: 'DynamoDB-Demo-WorkTable',
            Key: {
              userId: 'A001',
              date: '2023-01-10',
            },
            UpdateExpression: 'set startTime = :startTime, endTime = :endTime',
            ExpressionAttributeValues: {
              ':startTime': '10:00',
              ':endTime': '19:00',
            },
          },
        },
      ],
    };
    const result = await docClient.send(new TransactWriteCommand(input));
    return result;
  }
}

export const workTableTransactAction = new WorkTableTransactAction();
