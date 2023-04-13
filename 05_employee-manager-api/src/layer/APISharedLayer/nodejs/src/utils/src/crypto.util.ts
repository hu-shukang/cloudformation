import crypto from 'crypto';

export class CryptoUtil {
  public hash(content: string) {
    const md5 = crypto.createHash('md5');
    return md5.update(content, 'binary').digest('hex');
  }
}
