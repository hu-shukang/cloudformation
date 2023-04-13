import {
  QueryCommand,
  QueryCommandInput,
  TransactWriteCommand,
  TransactWriteCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { docClient } from './utils/dynamodb.util';

class WorkTableMultiUpdateAction {
  public async action() {
    // 1. ユーザIDで「userId」「date」のペアを検索する
    const queryInput: QueryCommandInput = {
      TableName: 'DynamoDB-Demo-WorkTable',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': 'A001',
      },
    };
    const queryResult = await docClient.send(new QueryCommand(queryInput));
    const workDataList = queryResult.Items;

    // 2. 検索結果から、トランザクションのCommandを組んで、一括でUpdateする
    if (workDataList) {
      const transactItems = [];
      for (const workData of workDataList) {
        transactItems.push({
          Update: {
            TableName: 'DynamoDB-Demo-WorkTable',
            Key: {
              userId: workData.userId,
              date: workData.date,
            },
            UpdateExpression: 'set startTime = :startTime, endTime = :endTime',
            ExpressionAttributeValues: {
              ':startTime': '10:00',
              ':endTime': '19:00',
            },
          },
        });
      }
      const input: TransactWriteCommandInput = {
        TransactItems: transactItems,
      };
      const result = await docClient.send(new TransactWriteCommand(input));
      return result;
    }
    return 'no data updated';
  }
}

export const workTableMultiUpdateAction = new WorkTableMultiUpdateAction();
