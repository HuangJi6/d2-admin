import { deleteApi, getOneApi, updateApi, addApi, pageApi, updateBatchApi } from '@/api/business/goodsApi.js'
import { queryCategoryListApi } from '@/api/business/categoryApi.js'
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
  // 重置表单数据
  resetCreateForm() {
    this.createFormData = {
      goodsNature: '',
      goodsName: '',
      goodsCategory: '',
      categoryGuid: '',
      goodsLink: '',
      imgLink: '',
      material: '',
      grade: '',
      goodsLength: '',
      goodsWidth: '',
      goodsHigh: '',
      goodsWeight: '',
      goodsPrice: '',
      goodsUse: '',
      brand: '',
      remark: ''
    }
  },
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
  // 提交保存
  submitCreate(formName) {
    const refs = this.$refs
    refs[formName].validate().then((valid) => {
      if (!valid) {
        if (this.dialogStatus === 'create') {
          this.handleHttpMethod(addApi(this.createFormData), true, '正在保存中', true, '信息保存成功').then(res => {
            if (res) {
              this.dialogFormVisible = false
              this.pageList()
            }
          })
        }
        if (this.dialogStatus === 'update') {
          this.handleHttpMethod(updateApi(this.createFormData.guid, this.createFormData), true, '正在保存中', true, '信息保存成功').then(res => {
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
  },
  categorySureClick(checkedData) {
    this.createFormData.goodsCategory = checkedData.checkedStr
    if (checkedData.checkedKeys || checkedData.checkedKeys === 1) {
      this.createFormData.categoryGuid = checkedData.checkedKeys[0]
    }
  },
  categoryItemBlur(rowData) {
    console.log(rowData)
    debugger
    if (rowData.goodsCategory) {
      this.categoryList.forEach(item => {
        if (rowData.goodsCategory === item.categoryName) {
          rowData.categoryGuid = item.guid
        }
      })
    }
    if (!rowData.categoryGuid) {
      this.$message({ message: '类目信息输入无效,请输入准确的类目名称', type: 'warning' })
    }
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
  // 复制
  handleCopy(row) {
    this.getOne(row.guid).then(response => {
      this.createFormData = response.data
      this.createFormData.guid = ''
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
    })
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
      this.handleHttpMethod(deleteApi(row.guid), true, '正在删除中', true, '删除成功').then(res => {
        this.pageList()
      })
    }).catch(() => {
    })
  },
  // 过滤方法
  handleFilter(params) {
    // 对象拷贝，防止数据污染
    const conditionParams = [
      { name: 'goodsName', type: '4', remove: true },
      { name: 'goodsCategory', type: '4', remove: true }]
    if (conditionParams) {
      conditionParams.forEach(item => {
        this.buildConditionData(item.name, item.type, params, item.remove)
      })
    }
    params.orderSqlSegment = 'goods_name,update_time'
  },
  // 刷新方法
  handleRefresh() {
    this.pageList()
  },
  // 取消保存
  handleCancelCreate() {
    this.dialogFormVisible = false
    this.resetCreateForm()
  },
  // 表格点击事件
  handleCellClickEvent(row, column, rowIndex) {
  },
  handleUpdateGlobal() {
    this.handleHttpMethod(queryCategoryListApi({})).then(res => {
      this.editTableConfig = { trigger: 'dblclick', mode: 'cell', showStatus: true }
      this.showGlobalSave = true
      this.categoryList = res.data
    })
  },
  // 全局更新保存
  async handleUpdateGlobalSave() {
    const $table = this.$refs.vxeTableRef
    const errMap = await $table.validate()
    if (!errMap) {
      // 重置数据源为最新数据
      const updateRecords = $table.getUpdateRecords()
      updateRecords.forEach(item => {
        $table.reloadRow(item, {})
      })
      this.handleHttpMethod(updateBatchApi(updateRecords), true, '全局更新中...', true, '更新完成').then(res => {
        this.pageList()
      })
      // 关闭修改
      this.editTableConfig = {}
      this.showGlobalSave = false
      console.log(updateRecords)
    }
  },
  // 全局更新取消
  async handleUpdateGlobalCancel() {
    this.$confirm('确定取消全局修改?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      const $table = this.$refs.vxeTableRef
      $table.revertData()
      this.showGlobalSave = false
      this.editTableConfig = {}
    }).catch(() => {
    })
  },
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
