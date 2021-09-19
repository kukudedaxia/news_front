const state = {
  name: 'video',
  attr: {
    status: 0, //上传状态 0， 1，2，3
    media_id: '',
    pid: '',
    duration: '',
    count: 0,
  },
};
const mutations = {
  setStatus(state, val) {
    state.status = val;
  },
  setMediaId(state, val) {
    state.media_id = val;
  },
  setData(state, data) {
    state.attr = { ...state.attr, ...data };
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};
