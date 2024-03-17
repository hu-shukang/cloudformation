import crypto from 'crypto';

class StringUtil {
  private static readonly SEEDS = [
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    'abcdefghijklmnopqrstuvwxyz',
    '0123456789',
    '!@#$%^&*()_+-=',
  ];
  private static readonly CRYPT_ALGORITHM = 'aes-256-cbc';

  /**
   * ランダムの文字列を生成する、「大文字」「小文字」「数字」「符号」
   * @param length 文字列の長さ
   * @returns ランダム文字列
   */
  public randomString(length: number = 10) {
    const bytes = crypto.randomBytes(length);
    let result = '';
    for (let i = 0; i < length; i++) {
      const seed = StringUtil.SEEDS[i % StringUtil.SEEDS.length];
      result += seed[bytes[i] % seed.length];
    }
    return result;
  }

  /**
   * 暗号化メソッド
   * @param text 平文
   * @param secret 暗号鍵
   * @returns 暗号化情報
   */
  public encrypt(text: string, secret: string) {
    const key = crypto.createHash('sha256').update(secret).digest('base64').substring(0, 32);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(StringUtil.CRYPT_ALGORITHM, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    return `${iv.toString('base64')}:${encrypted}`;
  }

  /**
   * 復号メソッド
   * @param encryptedText 暗号化情報
   * @param secret 暗号鍵
   * @returns 平文
   */
  public decrypt(encryptedText: string, secret: string) {
    const [ivBase64, encrypted] = encryptedText.split(':');
    const key = crypto.createHash('sha256').update(secret).digest('base64').substring(0, 32);
    const iv = Buffer.from(ivBase64, 'base64');

    const decipher = crypto.createDecipheriv(StringUtil.CRYPT_ALGORITHM, key, iv);
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}

export default new StringUtil();
