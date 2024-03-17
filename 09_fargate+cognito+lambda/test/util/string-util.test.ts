import { stringUtil } from '@/util';

describe('string util', () => {
  it('randomString', () => {
    const result = stringUtil.randomString();
    console.log(result);
  });

  it('encrypt', () => {
    const text = 'hello@mail.com';
    const secret = '12345';
    const result = stringUtil.encrypt(text, secret);
    console.log(result);
  });

  it('decrypt', () => {
    const encryptedText = '1Dr2Zg3NQukhFu8f1y5/8A==:ZtvAJ9HEHaEH5WkdRhxHxg==';
    const secret = '12345';
    const result = stringUtil.decrypt(encryptedText, secret);
    console.log(result);
  });
});
