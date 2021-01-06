import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    language: '',
  },
  mutations: {
    setLanguage(state, lang) {
      state.language = lang;
    },
  },
  actions: {
    changeLanguage({ commit }, lang) {
      commit('setLanguage', lang);
    },
  },
  modules: {},
});
