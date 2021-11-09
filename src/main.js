import Vue from 'vue';
import App from './App.vue';
import router from './router';
import i18n, { setI18nLanguage } from './utils/i18n';
import store from './store';
import VueClipboard from 'vue-clipboard2';

import ElementUI from 'element-ui';
import './theme/element/index.css';
import 'element-ui/lib/theme-chalk/index.css';

import './less/dark.less';

import moment from 'moment';
// import { Toast } from 'vant';

Vue.use(ElementUI)
  .use(VueClipboard)
  .use(VueWechatTitle);
// 动态title库
import VueWechatTitle from 'vue-wechat-title';
Vue.use(VueWechatTitle);
Vue.prototype.$moment = moment;
// Vue.prototype.$toast = Toast;
import './directive';
import tools from './utils/tools';
import './APP.less';

Vue.config.productionTip = false;
Vue.$i18n = i18n;
Vue.prototype.tools = tools;

setI18nLanguage(i18n.locale);

if (process.env.NODE_ENV === 'development') {
  document.cookie =
    'SUB=_2AijzqpvturQ7DaklCUXeSJDqy0mtWH0mZK4Pj-Q9nawzs3Wy53M7lY2ZGMyvWxwVtwBMlKWDH_spGNYisUZvZU51l_pl;path=/;';

  Vue.config.detools = true;
}

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app');

