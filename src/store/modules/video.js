const state = {
  status: 0, //上传状态 0， 1，2，3
  media_id: '',
};
const mutations = {
  setStatus(state, val) {
    state.status = val;
  },
  setMediaId(state, val) {
    state.media_id = val;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};
