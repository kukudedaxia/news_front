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
    tab: [],
    access: false, //利雅德白名单
    pageLoading: false,
  },
  getters: {
    video: state => state.video.attr,
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
    setTab(state, data) {
      state.tab = data;
    },
    setPageLoading() {},
    setRiyadhAcess(state, data) {
      state.access = data;
    },
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
        onNetworkError: () => {
          if (param.scene == 'upload_video' && param.retry > 1) {
            obj.retry -= 1;
            ctx.dispatch('send', obj);
          }
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
          try {
            if (
              res &&
              res.data &&
              (res.data.error_code === 10000 || res.data.error === 'success')
            ) {
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
            if (reqConf.url !== 'api/log/m?enc=0') {
              Message.error(i18n.t('netError'));
            }
            payload.onComplete && payload.onComplete();
          } else {
            if (err == 'Internal Server Error') {
              payload.onComplete && payload.onComplete(err, null, reqConf, null);
              return Message.error(i18n.t('internalerror'));
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
            ctx.state.userInfo = {
              id: res.data.user.id,
              nickname: res.data.user.nickname,
              username: res.data.user.username,
              SUB: Cookies.get('SUB'),
            };
            Cookies.set('userInfo', JSON.stringify(ctx.state.userInfo));
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
    // 获取权限
    async getTab(ctx) {
      return new Promise((rs, rj) => {
        ctx.dispatch('ajax', {
          req: {
            method: 'get',
            url: `api/pc/login/tab/display`,
          },

          onSuccess: res => {
            let arr = [];
            let userInfo = {};
            if (Cookies.get('userInfo')) {
              userInfo = JSON.parse(Cookies.get('userInfo'));
            }
            for (let key in res.data.allTab) {
              let obj = {};
              obj.key = key;
              obj.name = res.data.allTab[key];
              obj.show = res.data.tab[key];
              if (obj.name == 'live') {
                if (userInfo.id == '1000435467') {
                  obj.show = true;
                } else {
                  obj.show = false;
                }
              }
              arr.push(obj);
            }

            arr.sort((a, b) => {
              return b.key - a.key;
            });
            Cookies.set('tabs', JSON.stringify(arr));
            ctx.commit('setTab', JSON.parse(Cookies.get('tabs')));
            ctx.commit('setRiyadhAcess', res.data.bd);
            rs(arr);
          },
          onFail: res => {
            console.log(res);
            rj();
          },
        });
      });
    },
  },
  modules,
});
