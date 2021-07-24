const state = {
  loading: false,
};

const getters = {
  getLoading(state) {
    return state.loading;
  },
};

const mutations = {
  setLoadingState(state, val) {
    state.loading = val;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
};
