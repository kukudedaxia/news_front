const state = {
  living: false, // 是否正在直播中
  leaveLivingDialog: false, // 确认离开直播弹窗
};

const getters = {
  getLiving(state) {
    return state.living;
  },
  getLeaveLivingDialog(state) {
    return state.leaveLivingDialog;
  },
};

const mutations = {
  setLiving(state, val) {
    state.living = val;
  },
  setLeaveLivingDialog(state, val) {
    state.leaveLivingDialog = val;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
};
