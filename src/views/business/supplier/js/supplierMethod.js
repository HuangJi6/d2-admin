import {
  deleteByGuidApi,
  getOneApi,
  pageApi
} from '@/api/business/supplierApi.js'

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
  pageList() {
    this.listLoading = true
    const paramsCopy = Object.assign({}, this.filterFormData)
    this.handleFilter(paramsCopy)
    this.handleHttpMethod(pageApi(paramsCopy || {}), true).then(res => {
      this.tableData = res.data.dataList
      this.total = res.data.total
      this.listLoading = false
    }).catch(err => {
      console.log(err)
      this.listLoading = false
    })
  },
  // 查询单条数据
  getOne(id) {
    return this.handleHttpMethod(getOneApi(id), true)
  }
}
// 校验方法
const validateMethods = {}
// 工具方法
const utilMethods = {}
// 前端操作事件
const handleMethods = {
  handleSizeChange(val) {
    this.filterFormData.pageSize = val
    this.pageList()
  },
  handleCurrentChange(val) {
    this.filterFormData.currentPage = val
    this.pageList()
  },
  // 新增按钮
  handleCreate() {
    this.dialogStatus = 'create'
    this.dialogFormVisible = true
  },
  // 点击编辑按钮事件
  handleUpdate(row) {
    this.getOne(row.guid).then(response => {
      this.createFormData = response.data
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
    })
  },
  // 删除信息
  handleRemove(row) {
    this.$confirm('此操作将删除数据, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.handleHttpMethod(deleteByGuidApi(row.guid), true, '正在删除中', true, '删除成功').then(res => {
        this.pageList()
      })
    })
  },
  // 过滤方法
  handleFilter(params) {
    // 对象拷贝，防止数据污染
    const conditionParams = [
      { name: 'supName', type: '4', remove: true },
      { name: 'supCategory', type: '4', remove: true }]
    if (conditionParams) {
      conditionParams.forEach(item => {
        this.buildConditionData(item.name, item.type, params, item.remove)
      })
    }
  },
  // 刷新方法
  handleRefresh() {
    this.pageList()
  },
  // 访问链接
  handleUrlLink(url) {
    window.open(url, '_blank')
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
