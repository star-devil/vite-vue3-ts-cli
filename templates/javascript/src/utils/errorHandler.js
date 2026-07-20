export function setupErrorHandler(app) {
  app.config.errorHandler = (err, instance, info) => {
    console.error(`[Global Error]`, err);
    console.error(`[Component]`, instance);
    console.error(`[Info]`, info);
    if (import.meta.env.MODE === 'production') {
      // 生产环境可接入错误监控服务，如 Sentry
    }
  };

  app.config.warnHandler = (msg, instance, trace) => {
    if (import.meta.env.MODE === 'development') {
      console.warn(`[Vue Warn] ${msg}`, trace);
    }
  };

  window.addEventListener('unhandledrejection', (event) => {
    console.error(`[Unhandled Promise Rejection]`, event.reason);
    event.preventDefault();
  });
}
