const state = {
  imgList: [],
  videoParam: {},
};

const getters = {
  getUploadImg(state) {
    return state.imgList;
  },
  getUploadVideo(state) {
    return state.videoParam;
  },
};

const mutations = {
  setUploadImg(state, val) {
    state.imgList = val;
  },
  setUploadVideo(state, val) {
    state.videoParam = val;
  },
};

const actions = {
  setUploadImg({ commit }, val) {
    commit('setUploadImg', val);
  },
  setUploadVideo({ commit }, val) {
    commit('setUploadVideo', val);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
