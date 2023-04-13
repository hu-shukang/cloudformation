import { DeleteCommand, DeleteCommandInput } from '@aws-sdk/lib-dynamodb';
import { docClient } from './utils/dynamodb.util';

/**
 * 勤務表テーブルからデータを削除するAction
 */
class WorkTableDeleteAction {
  public async action() {
    // 1. テーブル名と削除したいデータのキー情報を設定する
    const input: DeleteCommandInput = {
      TableName: 'DynamoDB-Demo-WorkTable',
      Key: {
        userId: 'A001',
        date: '2023-01-01',
      },
    };
    // 2. APIを通して削除する
    const result = await docClient.send(new DeleteCommand(input));
    return result;
  }
}

export const workTableDeleteAction = new WorkTableDeleteAction();
