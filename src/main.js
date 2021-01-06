import Vue from 'vue';
import App from './App.vue';
import router from './router';
import i18n, { setI18nLanguage } from './utils/i18n';
import store from './store';
import { Popover } from 'element-ui';

Vue.use(Popover);
import './APP.less';

Vue.config.productionTip = false;

setI18nLanguage(i18n.locale);

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app');
