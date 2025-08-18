import { AESEncryptor } from './crypt';

/** 加密本地 localStorage 存储 */
export const cryptLocalStorage = () => {
  const needCrypt = import.meta.env.MODE !== 'development';

  return {
    getItem<T>(key: string): T | null | undefined {
      const value = localStorage.getItem(key);
      if (!value) {
        return null;
      } else if (value !== 'undefined' && value !== 'null') {
        const encryptedValue = needCrypt
          ? AESEncryptor.decrypt(value)
          : JSON.parse(value);

        if (
          encryptedValue &&
          Date.now() - encryptedValue.time > encryptedValue.expire
        ) {
          localStorage.removeItem(key);
          return null;
        }

        return encryptedValue.data;
      }
    },
    setItem: (key: string, value: any, expires: number = 24 * 60) => {
      const options = {
        data: value,
        time: Date.now(),
        expire: expires * 60 * 1000 // 把分钟转为毫秒
      };
      localStorage.setItem(
        key,
        needCrypt ? AESEncryptor.encrypt(options) : JSON.stringify(options)
      );
    },
    removeItem: (key: string) => {
      localStorage.removeItem(key);
    },
    clear: () => {
      localStorage.clear();
    }
  };
};

/** 加密会话 sessionStorage 存储 */
export const cryptSessionStorage = () => {
  const needCrypt = import.meta.env.MODE !== 'development';

  return {
    getItem<T>(key: string): T | null {
      const value = sessionStorage.getItem(key);
      if (!value || value === '' || value === 'undefined' || value === 'null') {
        return null;
      } else {
        return needCrypt ? AESEncryptor.decrypt(value) : JSON.parse(value);
      }
    },
    setItem: (key: string, value: any) => {
      sessionStorage.setItem(
        key,
        needCrypt ? AESEncryptor.encrypt(value) : JSON.stringify(value)
      );
    },
    removeItem: (key: string) => {
      sessionStorage.removeItem(key);
    },
    clear: () => {
      sessionStorage.clear();
    }
  };
};
