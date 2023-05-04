import { deleteApi, getOneApi, updateBatchApi, addBatchApi, pageMapApi, queryListByGuids } from '@/api/business/supplierGoodsApi.js'
import { postSupplierListApi } from '@/api/business/supplierApi.js'

// 初始化方法
const initMethods = {
  initMounted() {
    console.log('initMounted...')
    this.pageList()
  },
  initCreated() {

  }
}
// 接口方法
const interfaceMethods = {}
// 数据方法
const dataMethods = {
  // 重置表单数据
  resetCreateForm() {
    this.createFormData = {
      categoryGuid: '',
      supplierGuid: '',
      supplierName: '',
      goodsName: '',
      goodsGuid: '',
      boxQuantity: '',
      grade: '',
      boxLength: '',
      boxWidth: '',
      boxHigh: '',
      boxVolume: '0',
      boxAmount: '',
      singleAmount: '',
      boxWeight: '',
      supLink: '',
      remark: ''
    }
    this.supplierListData = []
  },
  pageList() {
    this.listLoading = true
    const paramsCopy = Object.assign({}, this.filterFormData)
    this.handleFilter(paramsCopy)
    this.handleHttpMethod(pageMapApi(paramsCopy || {}), true).then(res => {
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
    if (!this.selectedGoodsListData || this.selectedGoodsListData.length < 1) {
      this.$message.warning('请选择商品信息后保存')
      return
    }
    const refs = this.$refs
    refs[formName].validate().then((valid) => {
      if (!valid) {
        if (this.dialogStatus === 'create') {
          // 批量新增数据处理
          const addBatchList = this.buildAddBatchData()
          console.log(addBatchList)
          this.handleHttpMethod(addBatchApi(addBatchList), true, '正在保存中', true, '信息保存成功').then(res => {
            if (res) {
              this.dialogFormVisible = false
              this.pageList()
            }
          })
        }
        if (this.dialogStatus === 'update') {
          const addBatchList = this.buildUpdateBatchData()
          console.log(addBatchList)
          this.handleHttpMethod(updateBatchApi(addBatchList), true, '正在保存中', true, '信息保存成功').then(res => {
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
  selectedGoods(goodsInfo) {
    this.selectedGoodsListData = goodsInfo
    this.goodsInfo = goodsInfo
    this.createFormData.goodsGuid = goodsInfo.guid
    this.createFormData.goodsName = goodsInfo.goodsName
    this.createFormData.categoryGuid = goodsInfo.categoryGuid
    this.createFormData.supplierName = ''
    this.createFormData.supplierGuid = ''
    // 发送请求获取供应商信息
    this.getSupplierData(goodsInfo[0].categoryGuid)
  },
  createFormItemChange() {
  },
  getSupplierData(categoryGuid) {
    this.handleHttpMethod(postSupplierListApi({ categoryGuid: categoryGuid }), true, '请求中...').then(res => {
      this.supplierListData = res.data
    })
  },
  buildAddBatchData() {
    const addBatchList = []
    this.selectedGoodsListData.forEach(item => {
      const addData = Object.assign({}, this.createFormData)
      this.$set(addData, 'goodsGuid', item.guid)
      this.$set(addData, 'goodsName', item.goodsName)
      this.$set(addData, 'categoryGuid', item.categoryGuid)
      addBatchList.push(addData)
    })
    return addBatchList
  },
  buildUpdateBatchData() {
    const updateBatchList = []
    this.selectedGoodsListData.forEach(item => {
      const updateData = Object.assign({}, this.createFormData)
      this.$set(updateData, 'guid', item.guid)
      this.$set(updateData, 'goodsGuid', item.goodsGuid)
      this.$set(updateData, 'goodsName', item.goodsName)
      this.$set(updateData, 'categoryGuid', item.categoryGuid)
      updateBatchList.push(updateData)
    })
    return updateBatchList
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
    this.selectedGoodsListData = []
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
      this.getSupplierData(this.createFormData.categoryGuid)
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
    })
  },
  // 过滤方法
  handleFilter(params) {
    // 对象拷贝，防止数据污染
    const conditionParams = [
      { name: 'goodsName', type: '4', remove: true },
      { name: 'goodsCategory', type: '4', remove: true },
      { name: 'supplierName', type: '4', remove: true }]
    if (conditionParams) {
      conditionParams.forEach(item => {
        this.buildConditionData(item.name, item.type, params, item.remove)
      })
    }
    params.orderSqlSegment = 'update_time'
    params.order = 'desc'
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
  // 选择商品点击事件,显示商品选择弹框
  handleChooseGoods() {
    this.showGoodsComponent = true
  },
  handleAddSupplier() {
    this.showAddSupplierComponent = true
  },
  // 关闭商品标签
  handleCloseGoodsTag(goods) {
    this.selectedGoodsListData.splice(this.selectedGoodsListData.indexOf(goods), 1)
  },
  // 批量修改数据
  handleUpdateBatch() {
    // this.getOne(row.guid).then(response => {
    //   this.createFormData = response.data
    //   this.getSupplierData(this.createFormData.categoryGuid)
    //   this.dialogFormVisible = true
    //   this.dialogStatus = 'update'
    // })
    const selectionDatas = this.$refs.vxeTableRef.selection
    if (!selectionDatas || selectionDatas.length < 1) {
      this.$message.warning('请选择一条或一条以上数据')
    } else {
      const supplierGuid = selectionDatas[0].supplierGuid
      const category = selectionDatas[0].goodsCategory
      let flag = false
      const guids = []
      // 判断商品类目是否相同
      selectionDatas.forEach(item => {
        guids.push(item.guid)
        if (supplierGuid !== item.supplierGuid) {
          flag = true
        }
        if (category !== item.goodsCategory) {
          flag = true
        }
      })
      if (flag) {
        this.$message.warning('请选择相同供应商且相同类目数据')
        return
      }
      this.handleHttpMethod(queryListByGuids(guids), true, '查询中...').then(response => {
        this.selectedGoodsListData = response.data
        this.createFormData = response.data[0]
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.getSupplierData(this.createFormData.categoryGuid)
      })
    }
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
