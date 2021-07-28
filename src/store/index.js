import Vue from 'vue';
import Vuex from 'vuex';
import request from '../utils/request';
import { sendReport } from '../server/index';
import i18n from '../utils/i18n';
import { Message } from 'element-ui';
import Cookies from 'js-cookie';

Vue.use(Vuex);
const modulesFiles = require.context('./modules', true, /\.js$/);
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  let moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
  let value = modulesFiles(modulePath);
  modules[moduleName] = value.default;
  return modules;
}, {});

export default new Vuex.Store({
  state: {
    language: '',
    fromPage: {},
    toPage: {},
    uicode: '',
    luicode: '',
    slideIndex: 1,
    loginType: 'normal', //facebook, google, apple, normal
    // uid: '',
    userInfo: {},
    pageLoading: false,
  },
  mutations: {
    setLanguage(state, lang) {
      state.language = lang;
    },
    changeFromPage(state, page) {
      state.luicode = page.meta.uicode || '';
      state.fromPage = page;
    },
    changeToPage(state, page) {
      state.uicode = page.meta.uicode || '';
      state.toPage = page;
    },
    setSlide(state, index) {
      state.slideIndex = index;
    },
    setUid(state, data) {
      state.uid = data;
    },
    setLoginType(state, data) {
      state.loginType = data;
    },
    setUser(state, data) {
      state.userInfo = data;
    },
    setPageLoading() {},
  },
  actions: {
    changeLanguage({ commit }, lang) {
      commit('setLanguage', lang);
    },
    changeSlide({ commit }, index) {
      commit('setSlide', index);
    },
    changeUid({ commit }, data) {
      commit('setUid', data);
    },
    // 埋点
    // eslint-disable-next-line no-empty-pattern
    send(ctx, obj) {
      const param = { uicode: ctx.state.uicode, luicode: ctx.state.luicode, ...obj };
      sendReport(param, {
        onSuccess: () => {
          // console.log(res, 'res');
        },
        onFail: () => {
          // console.log('error');
        },
        onComplete: () => {
          // console.log('完成');
        },
      });
    },
    /**
     * @description: 单次ajax请求，回调方式
     * @param {object} payload
     * @param {object} payload.req axios请求配置
     * @param {function} payload.onSuccess 成功回调
     * @param {function} payload.onFail 失败回调
     * @param {function} payload.onError 错误回调
     * @param {function} payload.onNetworkError 网络错误回调
     * @param {function} payload.onComplete 完成回调。
     * @return {boolean} 成功true 失败false
     */
    ajax(ctx, payload) {
      if (!payload) {
        return false;
      }
      let req = {
        baseURL: '/',
        method: 'get',
        headers: {
          'content-type': 'application/json',
          auth_uid: 1000003338,
        },
      };
      let reqConf = Object.assign({}, req, payload.req);
      let emptyFunc = () => {};
      // 多语言请求
      if (request.defaults.headers.common['Accept-Language'] == 'ar') {
        reqConf.params = { ...reqConf.params, language: 1 };
      }
      payload.onFail = payload.onFail || emptyFunc;
      payload.onComplete = payload.onComplete || emptyFunc;
      payload.onError = payload.onError || emptyFunc;

      request(reqConf)
        .then(res => {      
          if (res && res.data && (res.data.error_code === 10000 || res.data.error === 'success')) {
            payload.onSuccess && payload.onSuccess(res.data, reqConf, res);
          } else {
            payload.onFail && payload.onFail(res.data, reqConf, res);
          }
          payload.onComplete && payload.onComplete(null, res.data, reqConf, res);
        })
        .catch(err => {
          if (!navigator.onLine) {
            payload.onNetworkError && payload.onNetworkError(err, reqConf);
            Message.error(i18n.t('netError'));
          } else {
            // 400、500 异常
            payload.onError && payload.onError(err, reqConf);
            Message.error(String(err));
          }
          payload.onComplete && payload.onComplete(err, null, reqConf, null);
        });
      return true;
    },
    // 获取用户信息 校验用户是否存在 存入cookie
    async getUser(ctx, uid) {
      return new Promise(resolve => {
        ctx.dispatch('ajax', {
          req: {
            method: 'get',
            url: '/api/dispatch/to',
            params: {
              direct: 'user_profile_header',
              uid,
            },
          },
          onSuccess: res => {
            ctx.state.userInfo = res.data.user;
            Cookies.set('userInfo', JSON.stringify(res.data.user));
            resolve(res.data);
          },
          onFail: () => {
            resolve(false);
          },
          onComplete: () => {},
          onError: () => {
            resolve(false);
          },
        });
      });
    },
  },
  modules,
});
