import { QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { docClient } from './utils/dynamodb.util';

class WorkTableIndexAction {
  public async action() {
    const input: QueryCommandInput = {
      TableName: 'DynamoDB-Demo-WorkTable',
      IndexName: 'BreakIndex',
      KeyConditionExpression: 'yearMonth = :yearMonth and break = :break',
      ExpressionAttributeValues: {
        ':yearMonth': '2023-01',
        ':break': 60,
      },
    };
    const result = await docClient.send(new QueryCommand(input));
    return result;
  }
}

export const workTableIndexAction = new WorkTableIndexAction();
