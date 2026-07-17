import type { Router } from 'vue-router';
import NProgress from '@/utils/progress';

export function setupRouterGuards(router: Router) {
  router.beforeEach((_to, _from, next) => {
    NProgress.start();
    // 在此处添加权限校验等逻辑
    next();
  });

  router.afterEach((to) => {
    NProgress.done();
    if (to.meta?.title) {
      document.title = `${to.meta.title} - App`;
    }
  });

  router.onError((error) => {
    NProgress.done();
    console.error('[Router Error]', error);
  });
}
