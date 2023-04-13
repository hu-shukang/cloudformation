import { QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { Holidays } from 'model';
import { Const } from 'utils';
import { BaseRepository } from './base.repository';

export class MasterRepository extends BaseRepository {
  public async selectHolidaysByRange(start: number, end: number): Promise<Holidays> {
    const input: QueryCommandInput = {
      TableName: Const.MASTER_TABLE_NAME,
      KeyConditionExpression: '#category = :category AND #prop BETWEEN :start AND :end',
      ExpressionAttributeNames: {
        '#category': Const.CATEGORY,
        '#prop': Const.PROP,
      },
      ExpressionAttributeValues: {
        ':category': Const.CATEGORY_HOLIDAYS,
        ':start': start.toString(),
        ':end': end.toString(),
      },
    };
    const result = await this.dynamoDocClient.send(new QueryCommand(input));
    const holidays: Holidays = {};
    result.Items?.forEach((record) => {
      holidays[record.prop] = record.value;
    });
    return holidays;
  }
}
