import { GetCommand, GetCommandInput } from '@aws-sdk/lib-dynamodb';
import { docClient } from './utils/dynamodb.util';

class RensyuTableGetEmpAction {
  /**
   * 社員IDにより、社員情報を取得する
   */
  public async action() {
    const input: GetCommandInput = {
      TableName: 'DynamoDB-Demo-RensyuTable',
      Key: {
        pk: 'E001',
        sk: 'INFO',
      },
    };
    const result = await docClient.send(new GetCommand(input));
    return result;
  }
}

export const rensyuTableGetEmpAction = new RensyuTableGetEmpAction();
