// 初始化方法
const initMethods = {
  initMounted() {
    console.log('initMounted...')
    this.pageList()
  },
  initCreated() {
    console.log('initCreated...')
  }
}
// 接口方法
const interfaceMethods = {}
// 数据方法
const dataMethods = {
  // 过滤方法
  handleFilter() {
    // 对象拷贝，防止数据污染
    const params = Object.assign({}, this.listQuery)
    this.buildConditionData('userName', '4', params, true)
    this.pageList(params)
  },
  // 刷新方法
  handleRefresh() {
    this.pageList()
  }
}
// 校验方法
const validateMethods = {}
// 工具方法
const utilMethods = {}
// 前端操作事件
const handleMethods = {
  handleSizeChange(val) {
    this.listQuery.pageSize = val
    this.pageList()
  },
  handleCurrentChange(val) {
    this.listQuery.currentPage = val
    this.pageList()
  }
}

export const myMethods = {
  ...initMethods,
  ...interfaceMethods,
  ...dataMethods,
  ...validateMethods,
  ...utilMethods,
  ...handleMethods
}
