export default {
  namespaced: true,
  state: {
    // 灰度
    checkedClientIds: []
  },
  actions: {
    setCheckShop({ state }, params) {
      state.checkedClientIds = params
    }
  },
  mutations: {
    setCheckedShop(state, params) {
      state.checkedClientIds = params
    }
  }
}
