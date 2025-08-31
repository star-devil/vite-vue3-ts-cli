// import { useUserStoreHook } from '@/store/modules/user';
// import { message } from '@/utils/message';
// import { getToken } from '@/utils/auth';

export const DEFAULT_API = import.meta.env.VITE_PROXY;

export const TIMEOUT_EXEMPT_URLS = ['/upload', '/download']; // 超时豁免接口
export const DIRECT_RETURN_PATTERNS = [/\/download/]; // 直接返回数据流接口
export const WHITE_LIST = ['/login', '/public-key']; // 不需要 token 校验接口

const ERROR_MESSAGES = {
  NETWORK: {
    301: '请求资源被永久移动到新位置,请访问我们的新网址',
    302: '网站正在维护中',
    400: '请检查您的输入是否正确，或者联系管理员获得帮助',
    401: '登录失效，需要重新登录。',
    403: '您正在尝试访问未授权的资源，请联系管理员获得进一步帮助',
    404: '您请求访问的资源不存在',
    405: '请求方法未允许',
    408: '服务器响应时间较长，请您稍后再试',
    422: '请求的数据格式不符合要求，请检查',
    500: '很抱歉，系统似乎出了些问题，请稍后再试',
    501: '网络未实现',
    502: '网络错误',
    503: '服务不可用',
    504: '网络超时',
    505: 'http版本不支持该请求'
  },
  AUTH: {
    4001: '用户名或密码错误',
    4002: '很抱歉，您没有访问权限',
    4003: '登录信息无效，请重新登录',
    4004: '登录失效，需要重新登录',
    4006: '该账户已被禁用，请联系超级管理员',
    10034: '该用户未注册，请联系管理员注册用户',
    10038: '账号未找到'
  }
};

/**
 * @description blob转 json
 */
async function blobToJson(blob) {
  const response = new Response(blob);
  return await response.json();
}

/**
 * 请求的调整 给请求头带上token等
 * @param config
 */
export const handleChangeRequestHeader = (config) => {
  if (!WHITE_LIST.some((url) => config.url?.endsWith(url))) {
    // const token = getToken();
    const token = 'mocked_token'; // mock数据，请按需替换
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
  }
  return config;
};

/** 处理网络错误：HTTP响应失败（未到达业务层）
 * @param errStatus 错误状态码
 */
export const handleNetworkError = (errStatus) => {
  const errMessage = errStatus
    ? ERROR_MESSAGES.NETWORK[errStatus] || `其他连接错误 --${errStatus}`
    : `无法连接到服务器！`;

  /** isTokenExpiredHandle: token是否已过期
   * 如果没有过期，就是其他错误，合并提示网络错误信息
   * 如果过期，直接提示一次过期并重新登录
   * 合并提示？
   *    网络错误会导致所有接口请求受阻，不合并的话当一个页面初始化时有很多请求，页面就会出现很多一样的错误提示
   *    合并是用的 elementplus 的 message 组件自带的功能，其他框架需自行处理
   * 后期增加了用户信息和 token 之后可以解开注释，取消 console.log，并删掉此段注释
   */
  // const userStore = useUserStoreHook();

  // if (userStore.isTokenExpiredHandle) {
  //   message(errMessage, {
  //     type: 'error'
  //   });
  // } else {
  //   message(errMessage, {
  //     type: 'error',
  //     grouping: true
  //   });
  // }

  console.log(errMessage);

  /**
   * 对401或403错误的额外处理，说明用户未授权或登录失效，设置 token 为已过期，并退出登录
   * 还有其他错误需要特殊处理的也可以写在这里，设置完成请删掉此段注释
   */
  // if (errStatus === 401 || errStatus === 403) {
  //   userStore.setTokenHandle(true);
  //   userStore.logOut();
  // }
};

/**
 * 响应拦截 授权错误处理
 * @param errno 错误码
 */
const handleAuthError = (errno) => {
  // const userStore = useUserStoreHook();

  const errMessage = ERROR_MESSAGES.AUTH[errno];

  if (errMessage) {
    /** 解释同handleNetworkError */
    // if (userStore.isTokenExpiredHandle) {
    //   message(errMessage, {
    //     type: 'error'
    //   });
    // } else {
    //   message(errMessage, {
    //     type: 'error',
    //     grouping: true
    //   });
    // }
    // userStore.setTokenHandle(true);
    // userStore.logOut();
    console.log(errMessage);
    return false;
  }
  return true;
};

/**
 * 响应拦截 请求成功后的普通业务错误处理
 * @param response 响应数据
 */
const handleGeneralError = async (response) => {
  let data;
  // 因为对下载接口做了封装，定义了返回类型为 blob，但是接口响应失败的时候返回的是 json，需要单独处理才能触发正常的错误提示
  if (
    response.data instanceof Blob &&
    response.headers['content-type'] === 'application/json'
  ) {
    data = await blobToJson(response.data);
  } else {
    data = response.data;
  }
  if (data instanceof Blob) {
    return true;
  } else if (data.code !== 200) {
    // const userStore = useUserStoreHook();

    const msg = ERROR_MESSAGES.NETWORK[data.code] || data.msg;

    // message(msg || '未知错误', {
    //   type: 'error',
    //   grouping: true
    // });
    console.log(msg || '未知错误');

    // 401 直接退出，也可以进行其他处理，比如只提示不退出等。按需处理后删除注释
    if (data.code === 401) {
      // userStore.setTokenHandle(true);
      // userStore.logOut();
    }

    return false;
  }
  return true;
};

/**
 * 错误处理函数
 * @param response 已响应（响应数据存在错误）
 * @param data 响应数据
 */
async function handleError(response, data) {
  if (!handleAuthError(data.code)) {
    throw new Error('认证错误');
  }
  const generalErrorResult = await handleGeneralError(response);
  if (!generalErrorResult) {
    throw new Error(data.msg || '未知错误');
  } else {
    return data;
  }
}

// 主要的Axios响应处理函数 直接返回服务器结果
export function handleResponseData(response) {
  const { data } = response;
  try {
    return handleError(response, data);
  } catch (error) {
    return Promise.reject(error);
  }
}
