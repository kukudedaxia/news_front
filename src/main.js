import Vue from 'vue';
import App from './App.vue';
import router from './router';
import i18n, { setI18nLanguage } from './utils/i18n';
import store from './store';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
// 动态title库
import VueWechatTitle from 'vue-wechat-title';
Vue.use(VueWechatTitle);

import './APP.less';

Vue.config.productionTip = false;
Vue.$i18n = i18n;

setI18nLanguage(i18n.locale);


// eslint-disable-next-line no-unused-vars
function init() {
  // eslint-disable-next-line no-undef
  gapi.load('auth2', function() {
     console.log(2222)
  });
}

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app');
