export default {
  namespaced: true,
  state: {
    // 灰度
    checkedClientIds: [],
    // 所有用户信息
    allClientInfos: []
  },
  actions: {
    setCheckShop({ state }, params) {
      state.checkedClientIds = params
    },
    setAllClientInfos({ state }, params) {
      state.allClientInfos = params
    }
  },
  mutations: {
    setCheckedShop(state, params) {
      state.checkedClientIds = params
    }
  }
}
