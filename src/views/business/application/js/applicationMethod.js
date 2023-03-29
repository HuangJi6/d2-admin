import { pageApplicationApi, addApplicationContainerApi, updateApplicationContainerApi, getOneApi, deleteApplicationApi } from '@/api/business/applicationApi.js'

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
  handleFilter(params) {
    // 对象拷贝，防止数据污染
    this.buildConditionData('shopName', '4', params, true)
  },
  // 刷新方法
  handleRefresh() {
    this.pageList()
  },
  // 重置表单数据
  resetCreateForm() {

  },
  pageList() {
    this.listLoading = true
    const paramsCopy = Object.assign({}, this.filterFormData)
    this.handleFilter(paramsCopy)
    this.handleHttpMethod(pageApplicationApi(paramsCopy || {}), true).then(res => {
      this.tableData = res.data.dataList
      this.total = res.data.total
      this.listLoading = false
    }).catch(err => {
      console.log(err)
      this.listLoading = false
    })
  },
  // 提交保存
  submitCreate(formName) {
    const refs = this.$refs
    refs[formName].validate().then((valid) => {
      if (!valid) {
        if (this.dialogStatus === 'create') {
          this.handleHttpMethod(addApplicationContainerApi(this.createFormData), true, '正在保存中', true, '信息保存成功').then(res => {
            if (res) {
              this.dialogFormVisible = false
              this.pageList()
            }
          })
        }
        if (this.dialogStatus === 'update') {
          this.handleHttpMethod(updateApplicationContainerApi(this.createFormData.guid, this.createFormData), true, '正在保存中', true, '信息保存成功').then(res => {
            if (res) {
              this.dialogFormVisible = false
              this.pageList()
            }
          })
        }
      }
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
    this.resetCreateForm()
    this.dialogStatus = 'create'
    this.dialogFormVisible = true
  },
  // 关闭创建窗口
  createModalClose() { },
  // 提交保存按钮
  handleSubmitCreate(formName) {
    this.submitCreate(formName)
  },
  // 点击编辑按钮事件
  handleUpdate(row) {
    this.getOne(row.guid).then(response => {
      this.createFormData = response.data
      if (response.data.fileList) {
        this.fileList = response.data.fileList
      }
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
      this.handleHttpMethod(deleteApplicationApi(row.guid), true, '正在删除中', true, '删除成功').then(res => {
        this.pageList()
      })
    })
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
