import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

// ====================================================================
// DynamoDB
// ====================================================================
const dynamoDBclient = new DynamoDBClient({
  region: process.env.REGION,
});

const marshallOptions = {
  // 空の文字列、バイナリ、およびセットを自動的に「null」に変換するか
  convertEmptyValues: false, // デフォルト値：false
  // 挿入時に未定義の値を削除するか
  removeUndefinedValues: true, // デフォルト値：false
  // オブジェクトを map 型に変換するか
  convertClassInstanceToMap: false, // デフォルト値：false
};

const unmarshallOptions = {
  // 数値をJavaScriptのNumber型に変換するのではなく、文字列として返すか
  wrapNumbers: false, // デフォルト値：false
};

const translateConfig = { marshallOptions, unmarshallOptions };

const db = DynamoDBDocumentClient.from(dynamoDBclient, translateConfig);

// ====================================================================
// Cognito
// ====================================================================
const cognito = new CognitoIdentityProviderClient({});

// ====================================================================
// SecretsManager
// ====================================================================
const secretClient = new SecretsManagerClient({});
const secret = {
  lient: secretClient,
  getCryptoKey: async () => {
    const command = new GetSecretValueCommand({ SecretId: process.env.CRYPTO_KEY });
    const data = await secretClient.send(command);
    console.log(data);
    return data.SecretString!;
  },
};

// ====================================================================
// Export
// ====================================================================
const AWS = {
  db,
  cognito,
  secret,
};

export default AWS;
