import type { ServerOptions } from 'vite';

export default function (
  VITE_PORT: number,
  VITE_PROXY: string,
  VITE_SERVER_URL: string
) {
  console.log(VITE_PORT, VITE_PROXY, VITE_SERVER_URL);
  const server: ServerOptions = {
    // 服务器主机名，如果允许外部访问，可设置为"0.0.0.0"
    host: '0.0.0.0',
    // 服务器端口号
    port: VITE_PORT,
    // 是否自动打开浏览器
    open: true
    // proxy: {
    //   [VITE_PROXY]: {
    //     target: VITE_SERVER_URL, //  代理的请求服务器地址
    //     changeOrigin: true, // 跨域
    //     rewrite: (path: string) => path.replace(RegExp(VITE_PROXY), '')
    //   }
    // }
  };
  return server;
}
