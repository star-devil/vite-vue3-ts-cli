export default function (env) {
  const server = {
    // 服务器主机名，如果允许外部访问，可设置为"0.0.0.0"
    host: '0.0.0.0',
    // 服务器端口号
    port: env.VITE_APP_PORT,
    // 是否自动打开浏览器
    open: true,
    proxy: {
      // '/api'
      [env.VITE_APP_BASE_API]: {
        target: env.VITE_API_URL, //  代理的请求服务器地址
        changeOrigin: true, // 跨域
        rewrite: (path) =>
          path.replace(new RegExp('^' + env.VITE_APP_BASE_API), '')
      }
    }
  };
  return server;
}
