import CryptoJS from 'crypto-js';

/** AES加密解密对象 */
class AESEncryptor {
  // 生成密钥
  static generateAesKey(): string {
    return import.meta.env.VITE_SECRET_KEY || ''; // 密钥请自行生成并保存（去掉 || ''）。
  }

  // 加密
  static encrypt(data: any): string {
    const iv = CryptoJS.lib.WordArray.random(16); // 随机生成初始化向量

    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      this.generateAesKey(),
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );

    // 返回加密数据和密钥
    return iv.toString() + ':' + encrypted.toString();
  }

  // 解密
  static decrypt(cipherText: string) {
    if (!cipherText) {
      return null;
    }
    const [iv, cipher] = cipherText.split(':');
    const bytes = CryptoJS.AES.decrypt(cipher, this.generateAesKey(), {
      iv: CryptoJS.enc.Utf8.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    try {
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch {
      throw new Error('解密失败: 无效的密钥或数据格式');
    }
  }
}

/** RSA加密对象: 需要接口返回公钥，可以使用jsencrypt库实现加密 */

export { AESEncryptor };
