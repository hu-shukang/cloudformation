import { QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { docClient } from './utils/dynamodb.util';

class RensyuTableQueryWorkAction {
  /**
   * 社員IDと年月により、月ごとの社員勤務情報を取得する
   */
  public async action() {
    const input: QueryCommandInput = {
      TableName: 'DynamoDB-Demo-RensyuTable',
      KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk)',
      ExpressionAttributeValues: {
        ':pk': 'E001',
        ':sk': 'WORK#2023#01',
      },
      ScanIndexForward: true, // 並び順: trueは昇順、falseは降順 (default値: true)
    };
    const result = await docClient.send(new QueryCommand(input));
    return result;
  }
}

export const rensyuTableQueryWorkAction = new RensyuTableQueryWorkAction();
