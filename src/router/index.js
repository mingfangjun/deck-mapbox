import { createWebHashHistory, createRouter } from 'vue-router'

const routes = [
  {
    path: "/",
    name: "school",
    component: () => import("../views/line.vue"),
  },
  // {
  //   path: '/login',
  //   name: 'login',
  //   component: () => import('../views/login/index')
  // },
  // { path: '/', name: 'Index', component: () => import('../views/warnTime.vue') },

  // {
  //   path: '/test',
  //   name: 'test',
  //   component: () => import('../views/warnTime')
  // }
];

// const router = new VueRouter({
//   mode: 'history',
//   base: '/home/',
//   // base: process.env.BASE_URL,
//   routes
// })

const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
});

export default router;
