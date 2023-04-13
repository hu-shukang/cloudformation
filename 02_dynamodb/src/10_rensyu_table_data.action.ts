import { PutCommand, PutCommandInput } from '@aws-sdk/lib-dynamodb';
import { docClient } from './utils/dynamodb.util';

class RensyuTableDataAction {
  public async action() {
    const dataList = [
      // 部門情報
      { pk: 'DEPARTMENT', sk: 'D001', departmentName: '営業部' },
      { pk: 'DEPARTMENT', sk: 'D002', departmentName: '総務部' },
      // 社員情報(Aさん)
      { pk: 'E001', sk: 'INFO', employeeName: 'Aさん', email: 'abc@mail.com', departmentId: 'D001', departmentName: '営業部' },
      { pk: 'E001', sk: 'WORK#2023#01#01', startTime: '09:00', endTime: '18:00', break: 60 },
      { pk: 'E001', sk: 'WORK#2023#01#02', startTime: '09:00', endTime: '18:00', break: 60 },
      // 社員情報(Bさん)
      { pk: 'E002', sk: 'INFO', employeeName: 'Bさん', email: 'bcd@mail.co.jp', departmentId: 'D002', departmentName: '総務部' },
      { pk: 'E002', sk: 'WORK#2023#01#01', startTime: '10:00', endTime: '19:00', break: 60 },
      { pk: 'E002', sk: 'WORK#2023#01#02', startTime: '10:00', endTime: '19:00', break: 60 },
    ];
    for (const data of dataList) {
      const input: PutCommandInput = {
        TableName: 'DynamoDB-Demo-RensyuTable',
        Item: data,
      };
      await docClient.send(new PutCommand(input));
    }
  }
}

export const rensyuTableDataAction = new RensyuTableDataAction();
