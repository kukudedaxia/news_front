const state = {
  imgList: [],
  videoParam: {},
  // 草稿数
  draftNums: 0,
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
  setDraftNums(state, val) {
    state.draftNums = val;
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
