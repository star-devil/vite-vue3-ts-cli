export {};

/**
 * 全局类型声明，无需引入直接在 `.vue` 、`.ts` 、`.tsx` 文件使用即可获得类型提示
 */
declare global {
  /**
   * 平台的名称、版本、运行所需的`node`和`pnpm`版本、依赖、最后构建时间的类型提示
   */
  const __APP_INFO__: {
    pkg: {
      name: string;
      version: string;
      engines: {
        node: string;
        pnpm: string;
      };
      dependencies: Recordable<string>;
      devDependencies: Recordable<string>;
    };
    lastBuildTime: string;
  };

  /**
   * Window 的类型提示
   */
  interface Window {
    // Global vue app instance
    __APP__: App<Element>;
    webkitCancelAnimationFrame: (handle: number) => void;
    mozCancelAnimationFrame: (handle: number) => void;
    oCancelAnimationFrame: (handle: number) => void;
    msCancelAnimationFrame: (handle: number) => void;
    webkitRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    mozRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    oRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    msRequestAnimationFrame: (callback: FrameRequestCallback) => number;
  }

  /**
   * Document 的类型提示
   */
  interface Document {
    webkitFullscreenElement?: Element;
    mozFullScreenElement?: Element;
    msFullscreenElement?: Element;
  }

  /**
   * 路由模式类型声明
   */
  type RouterHistory = 'hash' | 'h5' | 'base' | 'hash,base' | 'h5,base';

  /**
   * 打包压缩格式的类型声明
   */
  type ViteCompression = 'none' | 'gzip' | 'gzip-clear';

  /**
   * @description 全局自定义环境变量的类型声明
   * @params VITE_PORT 端口号
   * @params VITE_PUBLIC_PATH 公共路径
   * @params VITE_ROUTER_HISTORY 路由模式
   * @params VITE_COMPRESSION 压缩模式
   * @params VITE_PROXY 代理地址
   * @params VITE_SERVER_URL 服务器地址
   */
  interface ViteEnv {
    VITE_PORT: number;
    VITE_PUBLIC_PATH: string;
    VITE_ROUTER_HISTORY: RouterHistory;
    VITE_COMPRESSION: ViteCompression;
    VITE_PROXY: string;
    VITE_SERVER_URL: string;
  }
}
