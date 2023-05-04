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
    const paramsCopy = Object.assign({}, this.filterFormData)
    this.handleFilter(paramsCopy)
    this.handleHttpMethod(pageUserInfoApi(paramsCopy || {}), true).then(res => {
      this.tableData = res.data.dataList
      this.total = res.data.total
      this.listLoading = false
    })
  },
  // 添加用户信息
  handleSubmitCreate(formName) {
    const set = this.$refs
    set[formName].validate(valid => {
      if (!valid) {
        if (this.dialogStatus === 'create') {
          this.handleHttpMethod(addUserInfoApi(this.createFormData), true, '正在保存中', true, '信息保存成功').then(res => {
            if (res) {
              this.dialogFormVisible = false
              this.pageList()
            }
          })
        }
        if (this.dialogStatus === 'update') {
          this.handleHttpMethod(updateUserInfoApi(this.createFormData.guid, this.createFormData), true, '正在保存中', true, '信息保存成功').then(res => {
            if (res) {
              this.dialogFormVisible = false
              this.pageList()
            }
          })
        }
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
      this.createFormData = response.data
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
    })
  },
  resetCreateForm() {
    this.createFormData = {
      guid: undefined,
      userName: undefined,
      userCode: undefined,
      userSex: '男',
      userPassword: undefined,
      description: undefined,
      userPhone: undefined,
      deptGuid: '',
      deptCode: '',
      deptName: ''
    }
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
    }).catch(() => {
    })
  },
  handleFilter(params) {
    // 对象拷贝，防止数据污染
    this.buildConditionData('userName', '4', params, true)
  },

  handleRefresh() {
    this.pageList()
  },
  createModalClose() { },
  // 用户授权角色
  handleAuthRole() {
    const selectionDatas = this.$refs.vxeTableRef.selection
    if (!selectionDatas || selectionDatas.length !== 1) {
      this.$message.warning('请选择一条数据')
    } else {
      this.showAuthRole = true
      this.selectedUserId = selectionDatas[0].guid
    }
  },
  // 选择部门
  handleChooseDept() {
    this.showDeptChoose = true
  },
  // 部门选择回调
  onSureDeptClick(params) {
    if (params.checkedStr) {
      console.log(params)
      this.createFormData.deptName = params.treeCheckedNames[0]
      this.createFormData.deptCode = params.treeCheckedCodes[0]
      this.createFormData.deptGuid = params.treeCheckedIds[0]
    }
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
