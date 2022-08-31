import Vue from 'vue';
import VueRouter from 'vue-router';
import { loadLanguageAsync } from '../utils/i18n';
import { initTheme } from '@/utils/theme';
import store from '../store';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Indicators.vue'),
    meta: {
      title: 'Bcaca-监控看板',
      uicode: '10000006',
    },
  },
  {
    path: '/indicators/:id',
    name: 'Indicators',
    component: () => import('../views/IndicatorsDetail.vue'),
    meta: {
      title: 'Bcaca-监控详情',
      uicode: '10000007',
    },
  },
  // {
  //   path: '/news',
  //   name: 'Home',
  //   component: () => import('../views/Home.vue'),
  //   meta: {
  //     title: 'Bcaca-区块链讯息聚合器',
  //     keepAlive: true,
  //     uicode: '10000001',
  //   },
  // },
  {
    path: '/detail/:id',
    name: 'Detail',
    component: () => import('../views/Detail.vue'),
    meta: {
      title: 'Bcaca-消息快讯',
      uicode: '10000002',
    },
  },
  {
    path: '/article',
    name: 'Article',
    component: () => import('../views/Article.vue'),
    meta: {
      title: 'Bcaca-热门文章',
      keepAlive: false,
      uicode: '10000004',
      refresh: false,
    },
  },
  {
    path: '/article/:id',
    name: 'ArticleDetail',
    component: () => import('../views/Detail.vue'),
    meta: {
      title: 'Bcaca-文章阅读',
      uicode: '10000005',
    },
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: {
      title: 'Bcaca-关于我们',
      uicode: '10000003',
    },
  },
  {
    path: '/help',
    name: 'Help',
    component: () => import('../views/Help.vue'),
    meta: {
      title: 'Bcaca-机器人指南',
      uicode: '10000008',
    },
  },
  {
    path: '/example',
    name: 'Example',
    component: () => import('../views/Example.vue'),
    meta: {
      title: 'Bcaca-Example',
      uicode: '10000009',
    },
  },
  {
    path: '/drop',
    name: 'Drop',
    component: () => import('../views/Drop.vue'),
    meta: {
      title: 'Bcaca-空投讯息',
      uicode: '100000010',
    },
  },
  // {
  //   path: '/finance',
  //   name: 'Finance',
  //   component: () => import('../views/Finance.vue'),
  //   meta: {
  //     title: 'Bcaca-融资频道',
  //     uicode: '100000011',
  //   },
  // },
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
  // 离开行为
  store.commit('changeFromPage', from);
  store.commit('changeToPage', to);
  if (to.meta.uicode) {
    store.dispatch('send', { action: '1001', id: to.params.id });
  }
  window._czc && window._czc.push(['_trackEvent', '页面', '路由打开', to.meta.uicode, 5141]);
  next();
});

export default router;
