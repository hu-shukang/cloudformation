import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export class BaseRepository {
  protected dynamoClient: DynamoDBClient;
  protected dynamoDocClient: DynamoDBDocumentClient;
  constructor() {
    this.dynamoClient = new DynamoDBClient({ region: 'ap-northeast-1' });
    this.dynamoDocClient = DynamoDBDocumentClient.from(this.dynamoClient);
  }
}
