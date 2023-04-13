import { PutCommand, PutCommandInput } from '@aws-sdk/lib-dynamodb';
import { docClient } from './utils/dynamodb.util';

/**
 * 勤務表テーブルにデータを挿入するAction
 */
class WorkTableAddAction {
  public async action() {
    // 1. 挿入データを用意する
    const input: PutCommandInput = {
      TableName: 'DynamoDB-Demo-WorkTable',
      Item: {
        userId: 'A001',
        date: '2023-01-20',
        startTime: '09:00',
        endTime: '18:00',
        break: 60,
      },
    };
    // 2. APIを通して挿入する
    const result = await docClient.send(new PutCommand(input));
    return result;
  }
}

export const workTableAddAction = new WorkTableAddAction();
