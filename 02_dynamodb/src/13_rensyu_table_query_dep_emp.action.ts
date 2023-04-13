import { QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { docClient } from './utils/dynamodb.util';

class RensyuTableQueryDepEmpAction {
  /**
   * 部門IDにより、配下の社員情報を取得する
   */
  public async action() {
    const input: QueryCommandInput = {
      TableName: 'DynamoDB-Demo-RensyuTable',
      IndexName: 'DepartmentIndex',
      KeyConditionExpression: 'departmentId = :departmentId',
      ExpressionAttributeValues: {
        ':departmentId': 'D001',
      },
      ScanIndexForward: true, // 並び順: trueは昇順、falseは降順 (default値: true)
    };
    const result = await docClient.send(new QueryCommand(input));
    return result;
  }
}

export const rensyuTableQueryDepEmpAction = new RensyuTableQueryDepEmpAction();
