import Vue from 'vue';
import App from './App.vue';
import router from './router';
import i18n, { setI18nLanguage } from './utils/i18n';
import store from './store';
import VueClipboard from 'vue-clipboard2';

import ElementUI from 'element-ui';
// import './theme/index.css';
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/display.css';
// import './config/vantConfig.js';

// import './less/dark.less';

import moment from 'moment';

// import { Toast } from 'vant';

Vue.use(ElementUI)
  .use(VueClipboard)
  .use(VueWechatTitle);
// 动态title库
import './config/vantConfig.js';

import VueWechatTitle from 'vue-wechat-title';
Vue.use(VueWechatTitle);
Vue.prototype.$moment = moment;
// Vue.prototype.$toast = Toast;
import './directive';
import './APP.less';

import tools from './utils/tools';
Vue.config.productionTip = false;
Vue.$i18n = i18n;
Vue.prototype.tools = tools;
Vue.prototype.moment = moment;

setI18nLanguage(i18n.locale);

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app');
