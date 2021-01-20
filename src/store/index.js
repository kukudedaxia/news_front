import Vue from 'vue';
import Vuex from 'vuex';
import { sendReport } from '../server/index';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    language: '',
    fromPage: {},
    topage: {},
    uicode: '',
    luicode: '',
    slideIndex: 1,
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
  },
  actions: {
    changeLanguage({ commit }, lang) {
      commit('setLanguage', lang);
    },
    changeSlide({ commit }, lang) {
      commit('setSlide', lang);
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
  },
  modules: {},
});
