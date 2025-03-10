/*
 * @Author: wangqiaoling
 * @LastEditors: wangqiaoling
 * @Description: 路由入口文件
 */
import { createRouter, createWebHistory } from 'vue-router';
import homeRoutes from './modules/home';

const router = createRouter({
  history: createWebHistory(),
  routes: [...homeRoutes]
});

export default router;
