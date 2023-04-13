import { ScanCommand, ScanCommandInput } from '@aws-sdk/lib-dynamodb';
import { docClient } from './utils/dynamodb.util';

class WorkTableScanAction {
  public async action() {
    const input: ScanCommandInput = {
      TableName: 'DynamoDB-Demo-WorkTable',
      FilterExpression: 'startTime = :startTime',
      ExpressionAttributeValues: {
        ':startTime': '09:00',
      },
    };
    const result = await docClient.send(new ScanCommand(input));
    return result;
  }
}

export const workTableScanAction = new WorkTableScanAction();
