import Vue from 'vue';
import VueRouter from 'vue-router';
import { loadLanguageAsync } from '../utils/i18n';
import { initTheme } from '@/utils/theme';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: 'bcaca',
      keepAlive: true,
    },
  },
  {
    path: '/detail/:id',
    name: 'Detail',
    component: () => import('../views/Detail.vue'),
    meta: {
      title: 'bcaca detail',
    },
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: {
      title: 'about bcaca',
    },
  },
  {
    path: '*',
    redirect: { name: 'Home' },
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
  // 可以记录页面的滚动条位置
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
});

//路由导航冗余报错（路由重复）
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

router.beforeEach(async (to, from, next) => {
  window.scrollTo(0, 0);
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;

  if (localStorage.getItem('theme')) {
    const theme = localStorage.getItem('theme');
    await initTheme(theme);
  } else {
    await initTheme('light');
  }
  // 持续保持语言
  if (localStorage.getItem('lanuage')) {
    const lang = localStorage.getItem('lanuage');
    await loadLanguageAsync(lang);
  }
  //埋点
  next();
});

export default router;
