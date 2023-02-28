import { pageUserInfoApi, addUserInfoApi, getOneApi, updateUserInfoApi, deleteUserInfoApi } from '@/api/auth/userApi'
const initMethods = {
  initMounted() {
    console.log('initMounted...')
    this.pageList()
  },
  initCreated() {
    console.log('initCreated...')
  }
}
const interfaceMethods = {

}
// 数据方法
const dataMethods = {
  // 查询用户信息
  pageList(params) {
    this.listLoading = true
    this.handleHttpMethod(pageUserInfoApi(params || {}), true).then(res => {
      this.list = res.data.dataList
      this.total = res.data.total
      this.listLoading = false
    })
  },
  // 添加用户信息
  create(formName) {
    const set = this.$refs
    set[formName].validate(valid => {
      if (valid) {
        this.handleHttpMethod(addUserInfoApi(this.form), true, '正在保存中', true, '用户信息保存成功').then(res => {
          this.dialogFormVisible = false
          this.pageList()
        })
      }
    })
  },
  // 单个用户
  getOne(id) {
    return this.handleHttpMethod(getOneApi(id), true)
  },
  // 点击编辑按钮事件
  handleUpdate(row) {
    this.getOne(row.guid).then(response => {
      this.form = response.data
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
    })
  },
  // 更新接口
  update(formName) {
    const set = this.$refs
    set[formName].validate(valid => {
      if (valid) {
        this.handleHttpMethod(updateUserInfoApi(this.form.guid, this.form), true, '正在保存中', true, '用户信息保存成功').then(res => {
          this.dialogFormVisible = false
          this.pageList()
        })
      }
    })
  },
  // 删除用户信息
  handleDelete(row) {
    this.$confirm('此操作将删除数据, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.handleHttpMethod(deleteUserInfoApi(row.guid), true, '正在删除中', true, '删除成功').then(res => {
        this.pageList()
      })
    })
  },
  handleFilter() {
    // 对象拷贝，防止数据污染
    const params = Object.assign({}, this.listQuery)
    this.buildConditionData('user_name', '4', params, true)
    this.pageList(params)
  },

  handleRefresh() {
    this.pageList()
  }
}
const validateMethods = {

}
const utilMethods = {

}
export const myMethods = {
  ...initMethods,
  ...interfaceMethods,
  ...dataMethods,
  ...validateMethods,
  ...utilMethods
}
