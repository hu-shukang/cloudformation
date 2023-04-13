import { TransactWriteItem } from '@aws-sdk/client-dynamodb';
import {
  BatchGetCommand,
  BatchGetCommandInput,
  DeleteCommand,
  DeleteCommandInput,
  GetCommand,
  GetCommandInput,
  PutCommand,
  PutCommandInput,
  QueryCommand,
  QueryCommandInput,
  TransactWriteCommand,
  TransactWriteCommandInput,
  UpdateCommand,
  UpdateCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { AttributeMap, EmployeeInfoEntity, EmpolyeeRecordWithInfo, SubmitInfoEntify } from 'model';
import { Const } from 'utils';
import { BaseRepository } from './base.repository';

export class EmployeeRepository extends BaseRepository {
  public async getEmployee<T>(id: string, prop: string) {
    const input: GetCommandInput = {
      TableName: Const.EMPLOYEE_TABLE_NAME,
      Key: {
        id: id,
        prop: prop,
      },
    };
    const data = await this.dynamoDocClient.send(new GetCommand(input));
    return data.Item as T;
  }

  public async getEmployeeRecordWithInfo<T>(id: string, prop: string): Promise<EmpolyeeRecordWithInfo<T>> {
    const requestItems: any = {};
    requestItems[Const.EMPLOYEE_TABLE_NAME] = {
      Keys: [
        { id: id, prop: Const.INFO },
        { id: id, prop: prop },
      ],
    };
    const input: BatchGetCommandInput = {
      RequestItems: requestItems,
    };
    const data = await this.dynamoDocClient.send(new BatchGetCommand(input));
    const result: EmpolyeeRecordWithInfo<T> = {};
    if (data.Responses == undefined) {
      return result;
    }
    for (let record of data.Responses[Const.EMPLOYEE_TABLE_NAME]) {
      if (record.type == Const.INFO) {
        result.info = record as EmployeeInfoEntity;
      } else {
        result.record = record as T;
      }
    }
    return result;
  }

  public async putEmployee(data: any) {
    const input: PutCommandInput = {
      TableName: Const.EMPLOYEE_TABLE_NAME,
      Item: data,
    };
    await this.dynamoDocClient.send(new PutCommand(input));
  }

  public async putManyEmployee(...data: any[]) {
    const transactItems: TransactWriteItem[] = [];
    for (const d of data) {
      transactItems.push({
        Put: {
          TableName: Const.EMPLOYEE_TABLE_NAME,
          Item: d,
        },
      });
    }
    const input: TransactWriteCommandInput = {
      TransactItems: transactItems,
    };
    await this.dynamoDocClient.send(new TransactWriteCommand(input));
  }

  public async updateEmployee(
    id: string,
    prop: string,
    data: any,
    conditionExpression?: string,
    expressionAttributeNames: AttributeMap = {},
    expressionAttributeValues: AttributeMap = {}
  ) {
    const updateExpression: string[] = [];
    expressionAttributeNames['#id'] = 'id';
    Object.keys(data).forEach((key) => {
      const value = data[key];
      updateExpression.push(`#${key} = :${key}`);
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = value;
    });
    if (conditionExpression) {
      conditionExpression += ' AND attribute_exists(#id)';
    } else {
      conditionExpression = 'attribute_exists(#id)';
    }
    const input: UpdateCommandInput = {
      TableName: Const.EMPLOYEE_TABLE_NAME,
      Key: {
        id: id,
        prop: prop,
      },
      ConditionExpression: conditionExpression,
      UpdateExpression: 'set ' + updateExpression.join(', '),
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    };
    await this.dynamoDocClient.send(new UpdateCommand(input));
  }

  public async deleteEmployee(id: string) {
    const data = {
      status: Const.STATUS_DELETED,
    };
    await this.updateEmployee(id, Const.INFO, data);
  }

  public async deleteEmployeeRecord(
    id: string,
    prop: string,
    conditionExpression?: string,
    expressionAttributeNames?: AttributeMap,
    expressionAttributeValues?: AttributeMap
  ) {
    const input: DeleteCommandInput = {
      TableName: Const.EMPLOYEE_TABLE_NAME,
      Key: {
        id: id,
        prop: prop,
      },
      ConditionExpression: conditionExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    };
    await this.dynamoDocClient.send(new DeleteCommand(input));
  }

  public async queryEmployeeByStatus(status: string) {
    const input: QueryCommandInput = {
      TableName: Const.EMPLOYEE_TABLE_NAME,
      IndexName: 'status_index',
      KeyConditionExpression: '#status = :status',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':status': status,
      },
    };
    const data = await this.dynamoDocClient.send(new QueryCommand(input));
    return data.Items;
  }

  public async queryEmployeeByBossId(bossId: string): Promise<EmployeeInfoEntity[]> {
    const input: QueryCommandInput = {
      TableName: Const.EMPLOYEE_TABLE_NAME,
      IndexName: 'boss_employee_index',
      KeyConditionExpression: '#bossId = :bossId',
      ExpressionAttributeNames: {
        '#bossId': 'bossId',
      },
      ExpressionAttributeValues: {
        ':bossId': bossId,
      },
    };
    const data = await this.dynamoDocClient.send(new QueryCommand(input));
    return data.Items as EmployeeInfoEntity[];
  }

  public async querySubmitInfo(submit: string, type?: string): Promise<SubmitInfoEntify[]> {
    let keyConditionExpression = '#submit = :submit';
    const expressionAttributeNames: any = { '#submit': 'submit' };
    const expressionAttributeValues: any = { ':submit': submit };
    if (type) {
      keyConditionExpression += 'AND #type = :type';
      expressionAttributeNames['#type'] = 'type';
      expressionAttributeValues[':type'] = type;
    }
    const input: QueryCommandInput = {
      TableName: Const.EMPLOYEE_TABLE_NAME,
      IndexName: 'submit_index',
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    };
    const data = await this.dynamoDocClient.send(new QueryCommand(input));
    return data.Items as SubmitInfoEntify[];
  }

  public async queryEmployeeByPropPrefix(
    id: string,
    propPrefix: string,
    projectionExpression?: string,
    expressionAttributeNames?: AttributeMap,
    expressionAttributeValues?: AttributeMap
  ) {
    const input: QueryCommandInput = {
      TableName: Const.EMPLOYEE_TABLE_NAME,
      KeyConditionExpression: '#id = :id AND begins_with(#prop, :prop)',
      ProjectionExpression: projectionExpression,
      ExpressionAttributeNames: {
        '#id': 'id',
        '#prop': 'prop',
        ...expressionAttributeNames,
      },
      ExpressionAttributeValues: {
        ':id': id,
        ':prop': propPrefix,
        ...expressionAttributeValues,
      },
    };
    const data = await this.dynamoDocClient.send(new QueryCommand(input));
    return data.Items;
  }
}
