import axios from 'axios';

import { stringify } from 'qs';
import NProgress from '../progress';
import {
  handleChangeRequestHeader,
  TIMEOUT_EXEMPT_URLS,
  DIRECT_RETURN_PATTERNS,
  handleResponseData,
  handleNetworkError
} from './config';
import { downloadFile } from '@utils/tools';

// Default config
const defaultConfig = {
  timeout: 60000 * 3,
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  paramsSerializer: {
    serialize: stringify
  }
};

// Custom error classes
class TimeoutError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TimeoutError';
  }
}

// Main HTTP client class
export class PureHttp {
  static instance = axios.create(defaultConfig);
  static initConfig = {};

  constructor() {
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }

  httpInterceptorsRequest() {
    PureHttp.instance.interceptors.request.use(
      async (config) => {
        NProgress.start();

        // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
        if (typeof config.beforeRequestCallback === 'function') {
          config.beforeRequestCallback(config);
          return config;
        }
        if (PureHttp.initConfig.beforeRequestCallback) {
          PureHttp.initConfig.beforeRequestCallback(config);
          return config;
        }
        // 添加请求头
        config = handleChangeRequestHeader(config);

        // 为豁免接口移除超时设置
        if (TIMEOUT_EXEMPT_URLS.some((url) => config.url?.includes(url))) {
          config.timeout = 0;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  httpInterceptorsResponse() {
    PureHttp.instance.interceptors.response.use(
      (response) => {
        NProgress.done();

        // 处理直接返回流
        if (
          DIRECT_RETURN_PATTERNS.some((pattern) =>
            pattern.test(response.config.url || '')
          ) &&
          response.headers['content-type'] === 'application/octet-stream'
        ) {
          return response;
        }

        // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
        if (typeof response.config.beforeResponseCallback === 'function') {
          response.config.beforeResponseCallback(response);
          return response.data;
        }
        if (PureHttp.initConfig.beforeResponseCallback) {
          PureHttp.initConfig.beforeResponseCallback(response);
          return response.data;
        }

        // 只处理 2xx http状态码
        if (response.status >= 200 && response.status < 300) {
          try {
            return handleResponseData(response);
          } catch (error) {
            return error instanceof Error
              ? Promise.reject(error.message || '处理响应出现错误')
              : Promise.reject(error || '未知错误类型');
          }
        } else {
          return Promise.reject('非2xx的状态码：' + response.status);
        }
      },
      (error) => {
        NProgress.done();
        error.isCancelRequest = axios.isCancel(error);

        if (
          error.code === 'ECONNABORTED' &&
          error.message.includes('timeout')
        ) {
          return Promise.reject(new TimeoutError('请求超时，请稍后重试'));
        } else if (error.response) {
          // 服务器响应了请求但有错误状态码
          handleNetworkError(error?.response?.status);
          return Promise.reject(error.response);
        } else if (error.request) {
          // 请求已发出但没有收到响应
          return Promise.reject('无响应：' + error.message);
        } else {
          // 在设置请求时触发了错误
          return Promise.reject('请求错误：' + error.message);
        }
      }
    );
  }

  cancelTokenSource() {
    return axios.CancelToken.source();
  }

  request(method, url, param, axiosConfig) {
    const config = {
      method,
      url,
      ...param,
      ...axiosConfig
    };

    return new Promise((resolve, reject) => {
      PureHttp.instance
        .request(config)
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
  }

  get(url, params, config) {
    return this.request('get', url, { params }, config);
  }

  post(url, data, config) {
    return this.request('post', url, { data }, config);
  }

  put(url, data, config) {
    return this.request('put', url, { data }, config);
  }

  delete(url, config) {
    return this.request('delete', url, {}, config);
  }

  /**
   * @description 处理文件流: 下载、预览时可用
   * @param url 文件流地址
   * @param method 请求方法
   * @param config 请求配置
   * @returns 文件名和文件blob对象
   */
  async getFileStream(url, method, config) {
    try {
      const response = await (method === 'post'
        ? PureHttp.instance.post(url, config, {
            responseType: 'blob',
            headers: { Accept: 'application/octet-stream' }
          })
        : PureHttp.instance.get(url, {
            responseType: 'blob',
            headers: { Accept: 'application/octet-stream' }
          }));
      // 如果接口响应失败，返回的responseType是 json,这个在错误处理中统一处理了。
      // 所以接口响应失败后将获取不到response.headers，这个方法会直接 catch

      const contentType =
        response.headers['content-type'] || 'application/octet-stream';
      const contentDisposition = response.headers['content-disposition'];
      // 如果服务端设置了文件名，优先使用服务端的文件名，这里取文件名的方法需要根据服务端实际的格式进行调整
      const serverFilename = contentDisposition
        ? contentDisposition.includes("filename*=utf-8''")
          ? decodeURIComponent(contentDisposition.split("filename*=utf-8''")[1])
          : decodeURIComponent(
              contentDisposition.split('filename=')[1]?.replace(/["']/g, '')
            )
        : '';

      const blob = new Blob([response.data], { type: contentType });

      return {
        serverFilename,
        blob
      };
    } catch (error) {
      console.error('获取文件失败:', error);
      throw error;
    }
  }

  /**
   * @description 下载文件
   * @param url 文件流地址
   * @param method 请求方法
   * @param filename 文件名
   * @param config 请求配置
   */
  async downloadFileByStream(url, method, filename, config) {
    const { serverFilename, blob } = await this.getFileStream(
      url,
      method,
      config
    );
    const downloadFilename =
      serverFilename.split('-')[1] || filename || 'download';

    downloadFile(blob, downloadFilename);
  }

  /**
   * @description 单文件上传：一次请求只上传一个文件
   * @param url 上传地址
   * @param file 要上传的文件
   * @param config 请求配置
   * @param onProgress 上传进度回调
   * @returns 上传结果
   */
  async uploadFile(url, file, config, onProgress) {
    const formData = new FormData();
    const fieldName = config?.fieldName || 'file';

    // 添加文件
    formData.append(fieldName, file);

    // 添加额外数据
    if (config?.additionalData) {
      Object.keys(config.additionalData).forEach((key) => {
        formData.append(key, config.additionalData[key]);
      });
    }

    // 构建请求配置
    const requestConfig = {
      method: 'post',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      }
    };

    return this.request('post', url, { data: formData }, requestConfig);
  }

  /**
   * @description 并发批量上传（大）文件：某个文件上传失败不影响其他文件
   * @param url 上传地址
   * @param files 要上传的文件数组
   * @param config 请求配置
   * @param onProgress 上传进度回调
   * @returns 上传结果数组
   */
  async uploadMultipleFiles(url, files, config, onProgress) {
    const concurrent = config?.concurrent || 3;
    const results = [];

    // 分批处理文件
    for (let i = 0; i < files.length; i += concurrent) {
      const batch = files.slice(i, i + concurrent);
      const batchPromises = batch.map(async (file, batchIndex) => {
        const fileIndex = i + batchIndex;
        try {
          const result = await this.uploadFile(
            url,
            file,
            config,
            (progress) => {
              if (onProgress) {
                onProgress(progress, file, fileIndex);
              }
            }
          );
          return result;
        } catch (error) {
          throw error;
        }
      });

      const batchResults = await Promise.allSettled(batchPromises);
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results[i + index] = result.value;
        } else {
          results[i + index] = {
            code: -1,
            data: null,
            msg: `文件 ${files[i + index].name} 上传失败: ${result.reason}`
          };
        }
      });
    }

    return results;
  }

  /**
   * @description 批量上传文件到单个请求（推荐用于小文件）：文件只能一起成功/失败
   * @param url 上传地址
   * @param files 要上传的文件数组
   * @param config 请求配置
   * @param onProgress 上传进度回调
   * @returns 上传结果
   */
  async uploadFilesAsBatch(url, files, config, onProgress) {
    const formData = new FormData();
    const fieldName = config?.fieldName || 'files';

    // 添加所有文件
    files.forEach((file, index) => {
      formData.append(`${fieldName}[${index}]`, file);
    });

    // 添加额外数据
    if (config?.additionalData) {
      Object.keys(config.additionalData).forEach((key) => {
        formData.append(key, config.additionalData[key]);
      });
    }

    // 构建请求配置
    const requestConfig = {
      method: 'post',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      }
    };

    return this.request('post', url, { data: formData }, requestConfig);
  }
}

export const http = new PureHttp();
