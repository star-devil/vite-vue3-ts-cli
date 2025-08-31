import type {
  Method,
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig
} from 'axios';

export type resultType = {
  accessToken?: string;
};

export type RequestMethods = Extract<
  Method,
  'get' | 'post' | 'put' | 'delete' | 'patch' | 'option' | 'head'
>;

export interface PureHttpError extends AxiosError {
  isCancelRequest?: boolean;
}

export interface PureHttpResponse extends AxiosResponse {
  config: PureHttpRequestConfig;
}

export interface PureHttpRequestConfig extends AxiosRequestConfig {
  beforeRequestCallback?: (request: PureHttpRequestConfig) => void;
  beforeResponseCallback?: (response: PureHttpResponse) => void;
}

export interface IResponse<T = any> {
  code: number;
  data: T;
  msg: string;
}

export interface ListResponse<T = any> {
  pageInfo: {
    page: number;
    size: number;
    totalElements: number;
  };
  content: array<T>;
}
