import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';
import { loadLanguageAsync } from '../utils/i18n';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: 'beeto',
      uicode: '30000652',
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {
      title: 'login',
    },
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: {
      title: 'beeto',
    },
  },
  {
    path: '/concat',
    name: 'Concat',
    component: () => import('../views/Concat.vue'),
    meta: {
      title: 'beeto',
    },
  },
  {
    path: '/community',
    name: 'Community',
    component: () => import('../views/Community.vue'),
    meta: {
      title: 'beeto',
    },
  },
  {
    path: '/terms',
    name: 'Term',
    component: () => import('../views/Term.vue'),
    meta: {
      title: 'beeto',
    },
  },
  {
    path: '/policy',
    name: 'Policy',
    component: () => import('../views/Policy.vue'),
    meta: {
      title: 'beeto',
    },
  },
  {
    path: '*',
    redirect: { name: 'Home' },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes,
  // 可以记录页面的滚动条位置
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

//路由导航冗余报错（路由重复）
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0);
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  // 离开行为
  store.commit('changeFromPage', from);
  store.commit('changeToPage', to);
  // 持续保持语言
  if (localStorage.getItem('lanuage')) {
    const lang = localStorage.getItem('lanuage');
    loadLanguageAsync(lang).then(() => {
      next();
    });
  }
  //埋点
  if (to.meta.uicode) {
    store.dispatch('send', { action: '5141' });
  }
  next();
});

export default router;
