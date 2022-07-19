import Vue from 'vue';
import Vuex from 'vuex';
import request from '../utils/request';
import { Message } from 'element-ui';
import { sendReport } from '../server/index';

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
    slideMenuShow: false, //侧边菜单
    channelId: '', //当前快讯频道
    language: 'zh',
    pageLoading: false, //页面loading
    vant_overlay: false,
    vant_overlay1: {
      state: false,
      data: {},
    }, //生成长图弹窗
    uicode: '',
    luicode: '',
    fromPage: location.pathname,
    toPage: location.pathname,
  },
  getters: {
    video: state => state.video.attr,
  },
  mutations: {
    setKey(state, obj) {
      state[obj.key] = obj.val;
    },
    setLanguage(state, lang) {
      state.language = lang;
    },
    setChannel(state, val) {
      state.channelId = val;
    },
    setPageLoading() {},
    setoverlay(state, val) {
      state.vant_overlay = val;
    },
    setoverlay1(state, val) {
      state.vant_overlay1 = val;
    },
    changeFromPage(state, page) {
      state.luicode = page.meta.uicode || '';
      state.fromPage = page;
    },
    changeToPage(state, page) {
      state.uicode = page.meta.uicode || '';
      state.toPage = page;
    },
  },
  actions: {
    changeLanguage({ commit }, lang) {
      commit('setLanguage', lang);
    },
    changeOverlay({ commit }, val) {
      commit('setoverlay', val);
    },
    changeOverlay1({ commit }, val) {
      commit('setoverlay1', val);
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
        baseURL: '/api/',
        method: 'get',
        headers: {
          'content-type': 'application/json',
        },
      };
      let reqConf = Object.assign({}, req, payload.req);
      let emptyFunc = () => {};

      payload.onFail = payload.onFail || emptyFunc;
      payload.onComplete = payload.onComplete || emptyFunc;
      payload.onError = payload.onError || emptyFunc;
      request(reqConf)
        .then(res => {
          try {
            if (res && res.data) {
              payload.onSuccess && payload.onSuccess(res.data, reqConf, res);
            } else {
              payload.onFail && payload.onFail(res.data, reqConf, res);
              if (res.data.error_code == 50001) {
                window.location.href = window.location.origin;
              }
            }
            payload.onComplete && payload.onComplete(null, res.data, reqConf, res);
          } catch (err) {
            console.log(err);
          }
        })
        .catch(err => {
          if (!navigator.onLine) {
            payload.onNetworkError && payload.onNetworkError(err, reqConf);
            Message.error('netError');
            payload.onComplete && payload.onComplete();
          } else {
            if (err == 'Internal Server Error') {
              payload.onComplete && payload.onComplete(err, null, reqConf, null);
              return Message.error('internalerror');
            }
            if (err.data.error_code !== 35000) {
              // 400、500 异常
              payload.onError && payload.onError(err, reqConf);
              Message.error(String(err));
            }
            payload.onComplete && payload.onComplete(err, null, reqConf, null);
          }
        });
      return true;
    },

    send(ctx, obj) {
      const param = { uicode: ctx.state.uicode, ...obj };

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
        onNetworkError: () => {
          if (param.retry > 1) {
            obj.retry -= 1;
            ctx.dispatch('send', obj);
          }
        },
      });
    },
  },
  modules,
});
