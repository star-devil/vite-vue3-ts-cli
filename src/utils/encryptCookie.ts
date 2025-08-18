import { AESEncryptor } from './crypt';

interface CookieOptions {
  end?: number | string | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
}

const getRawCookie = (key: string): string | null => {
  const regex = new RegExp(
    `(?:^|;\\s*)${encodeURIComponent(key).replace(/[-.+*]/g, '\\$&')}\\s*\\=\\s*([^;]*)`
  );
  const match = document.cookie.match(regex);
  return match ? decodeURIComponent(match[1]) : null;
};

const formatExpires = (end: number | string | Date): string => {
  if (typeof end === 'number') {
    if (end === Infinity) {
      return 'expires=Fri, 31 Dec 9999 23:59:59 GMT';
    }
    return `max-age=${end * 24 * 60 * 60}`;
  }

  if (end instanceof Date) {
    return `expires=${end.toUTCString()}`;
  }

  if (typeof end === 'string') {
    return `expires=${end}`;
  }

  return '';
};

// 加密的Cookie操作对象
export const cryptDocCookies = {
  needCrypt: import.meta.env.MODE !== 'development',
  /**
   * 获取Cookie值（自动解密）
   * @param key Cookie键名
   * @returns 解密后的值，如果不存在或解密失败返回null
   */
  getItem(key: string): string | null {
    try {
      const encryptedValue = getRawCookie(key);
      if (!encryptedValue) return null;

      const decryptedValue = this.needCrypt
        ? AESEncryptor.decrypt(encryptedValue)
        : encryptedValue;
      const stringValue =
        typeof decryptedValue === 'string'
          ? decryptedValue
          : JSON.stringify(decryptedValue);
      return JSON.parse(stringValue);
    } catch (error) {
      console.warn(`Cookie解密失败 [${key}]:`, error);
      return null;
    }
  },

  /**
   * 设置Cookie值（自动加密）
   * @param key Cookie键名
   * @param value 要存储的值
   * @param options Cookie配置选项
   * @returns 是否设置成功
   */
  setItem(key: string, value: any, options: CookieOptions = {}): boolean {
    if (!key || /^(?:expires|max-age|path|domain|secure)$/i.test(key)) {
      return false;
    }

    try {
      // 加密值
      const jsonValue = JSON.stringify(value);
      const encryptedValue = this.needCrypt
        ? AESEncryptor.encrypt(jsonValue)
        : jsonValue;

      // 构建Cookie字符串
      const cookieParts = [
        `${encodeURIComponent(key)}=${encodeURIComponent(encryptedValue)}`
      ];

      // 处理过期时间
      if (options.end) {
        const expires = formatExpires(options.end);
        if (expires) cookieParts.push(expires);
      }

      // 添加其他选项
      if (options.domain) cookieParts.push(`domain=${options.domain}`);
      if (options.path) cookieParts.push(`path=${options.path}`);
      if (options.secure) cookieParts.push('secure');

      document.cookie = cookieParts.join('; ');
      return true;
    } catch (error) {
      console.error(`Cookie加密失败 [${key}]:`, error);
      return false;
    }
  },

  /**
   * 删除Cookie
   * @param key Cookie键名
   * @param path Cookie路径
   * @param domain Cookie域名
   * @returns 是否删除成功
   */
  removeItem(key: string, path = '/', domain = ''): boolean {
    if (!key || !this.hasItem(key)) {
      return false;
    }

    const cookieParts = [
      `${encodeURIComponent(key)}=`,
      'expires=Thu, 01 Jan 1970 00:00:00 GMT'
    ];
    if (domain) cookieParts.push(`domain=${domain}`);
    if (path) cookieParts.push(`path=${path}`);

    document.cookie = cookieParts.join('; ');
    return true;
  },

  /**
   * 检查Cookie是否存在
   * @param key Cookie键名
   * @returns 是否存在
   */
  hasItem(key: string): boolean {
    return new RegExp(
      `(?:^|;\\s*)${encodeURIComponent(key).replace(/[-.+*]/g, '\\$&')}\\s*\\=`
    ).test(document.cookie);
  },

  /**
   * 获取所有Cookie键名
   * @returns Cookie键名数组
   */
  keys(): string[] {
    if (!document.cookie) return [];

    return document.cookie
      .split(';')
      .map((cookie) => cookie.trim().split('=')[0])
      .filter(Boolean)
      .map((key) => decodeURIComponent(key));
  },

  /**
   * 清空所有Cookie
   */
  clear(): void {
    const keys = this.keys();
    keys.forEach((key) => this.removeItem(key));
  }
};
