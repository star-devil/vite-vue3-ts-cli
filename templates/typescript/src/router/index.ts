import {
  createRouter,
  createWebHashHistory,
  createWebHistory
} from 'vue-router';
import homeRoutes from './modules/home';

import { setupRouterGuards } from './guards';

export default function setupRouter() {
  const router = createRouter({
    history:
      import.meta.env.VITE_ROUTER_HISTORY === 'hash'
        ? createWebHashHistory()
        : createWebHistory(),
    routes: [...homeRoutes]
  });
  setupRouterGuards(router);
  return router;
}
