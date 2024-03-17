import { Callback, Context } from 'aws-lambda';
import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import crypto from 'crypto';

const getCryptoKey = async () => {
  const secretClient = new SecretsManagerClient({});
  const command = new GetSecretValueCommand({ SecretId: process.env.CRYPTO_KEY });
  const data = await secretClient.send(command);
  console.log(data);
  return data.SecretString!;
};

/**
 * 暗号化メソッド
 * @param text 平文
 * @param secret 暗号鍵
 * @returns 暗号化情報
 */
const encrypt = (text: string, secret: string) => {
  const key = crypto.createHash('sha256').update(secret).digest('base64').substring(0, 32);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  return `${iv.toString('base64')}:${encrypted}`;
};

exports.handler = async (event: any, _context: Context, callback: Callback) => {
  const email = event.request.userAttributes.email;
  if (event.triggerSource === 'CustomMessage_SignUp') {
    const code = event.request.codeParameter;
    const host = event.request.clientMetadata.host;
    const secret = await getCryptoKey();
    const text = JSON.stringify({ email: email, redirect: host });
    const encryptedText = encrypt(text, secret);
    const uriText = encodeURIComponent(encryptedText);
    const url = `http://<server-api-host>/api/auth/signup-confirm?code=${code}&key=${uriText}`;
    event.response = {
      emailSubject: 'ユーザ登録',
      emailMessage: `リンクをクリックしてメール認証を行う: ${url}`,
      smsMessage: `リンクをクリックしてメール認証を行う: ${url}`,
    };
  }
  callback(null, event);
};
