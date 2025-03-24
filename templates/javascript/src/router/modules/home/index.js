const homeRoutes = [
  {
    path: '/',
    name: 'HelloWorld',
    component: () => import('@/components/HelloWorld.vue'),
    meta: {
      title: 'Hello World',
      keepAlive: true
    }
  }
];

export default homeRoutes;
