import { QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { docClient } from './utils/dynamodb.util';

class RensyuTableQueryDepAction {
  /**
   * 部門一覧を取得する
   */
  public async action() {
    const input: QueryCommandInput = {
      TableName: 'DynamoDB-Demo-RensyuTable',
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': 'DEPARTMENT',
      },
      ScanIndexForward: true, // 並び順: trueは昇順、falseは降順 (default値: true)
    };
    const result = await docClient.send(new QueryCommand(input));
    return result;
  }
}

export const rensyuTableQueryDepAction = new RensyuTableQueryDepAction();
