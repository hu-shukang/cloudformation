import { DeleteCommand, DeleteCommandInput, PutCommand, PutCommandInput, ScanCommand, ScanCommandInput } from '@aws-sdk/lib-dynamodb';
import { docClient } from './utils/dynamodb.util';

class TestDataAction {
  public async action() {
    // delete all items
    const scanInput: ScanCommandInput = {
      TableName: 'DynamoDB-Demo-WorkTable',
    };
    const resultList = await docClient.send(new ScanCommand(scanInput));
    if (resultList.Items && resultList.Items.length > 0) {
      for (const item of resultList.Items) {
        const deleteInput: DeleteCommandInput = {
          TableName: 'DynamoDB-Demo-WorkTable',
          Key: {
            userId: item.userId,
            date: item.date,
          },
        };
        await docClient.send(new DeleteCommand(deleteInput));
      }
    }

    // insert data
    const dataList = [
      { userId: 'A001', date: '2023-01-01', yearMonth: '2023-01', start: '09:00', end: '18:00', break: 30 },
      { userId: 'A001', date: '2023-01-02', yearMonth: '2023-01', start: '09:00', end: '18:00', break: 30 },
      { userId: 'A001', date: '2023-02-01', yearMonth: '2023-02', start: '09:00', end: '18:00', break: 60 },
      { userId: 'A001', date: '2023-02-02', yearMonth: '2023-02', start: '09:00', end: '18:00', break: 60 },
      { userId: 'A002', date: '2023-01-01', yearMonth: '2023-01', start: '09:00', end: '18:00', break: 60 },
      { userId: 'A002', date: '2023-01-02', yearMonth: '2023-01', start: '09:00', end: '18:00', break: 60 },
      { userId: 'A002', date: '2023-02-01', yearMonth: '2023-02', start: '09:00', end: '18:00', break: 60 },
      { userId: 'A002', date: '2023-02-02', yearMonth: '2023-02', start: '09:00', end: '18:00', break: 60 },
      { userId: 'A003', date: '2023-01-01', yearMonth: '2023-01', start: '09:00', end: '18:00', break: 60 },
      { userId: 'A003', date: '2023-01-02', yearMonth: '2023-01', start: '09:00', end: '18:00', break: 60 },
      { userId: 'A003', date: '2023-02-01', yearMonth: '2023-02', start: '09:00', end: '18:00', break: 60 },
      { userId: 'A003', date: '2023-02-02', yearMonth: '2023-02', start: '09:00', end: '18:00', break: 60 },
    ];
    for (const data of dataList) {
      const input: PutCommandInput = {
        TableName: 'DynamoDB-Demo-WorkTable',
        Item: data,
      };
      await docClient.send(new PutCommand(input));
    }
  }
}

export const testDataAction = new TestDataAction();
