import { deleteApi, getOneApi, updateApi, addApi, pageMapApi } from '@/api/business/shopGoodsOperateApi.js'
// import { getAllApplication } from '@/api/business/applicationApi.js'
import { postSupplierListApi } from '@/api/business/supplierApi.js'
import $Big from '@/libs/big.js'

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
      boxVolume: '',
      boxQuantity: '',
      suplierGuid: '',
      shopGoodsGuid: '',
      shopName: '',
      clientId: '',
      goodsName: '',
      goodsGuid: '',
      optimizeStatus: '未优化',
      sku: '',
      itemId: '',
      mlCode: '',
      statusCode: '已下单',
      remark: '',
      hsCode: '',
      goodsCategory: '',
      goodsLink: '',
      upcCode: '',
      imgLink: '',
      material: '',
      grade: '',
      goodsLength: '',
      goodsWidth: '',
      goodsHigh: '',
      goodsWeight: '',
      goodsPrice: '',
      goodsUse: '',
      brand: ''
    }
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
  selectedGoods(goodsInfo) {
    this.createFormData.goodsGuid = goodsInfo.guid
    this.createFormData.goodsName = goodsInfo.goodsName
  },
  createFormItemChange() {
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
  handleUpdate() {
    const selectionDatas = this.$refs.vxeTableRef.selection
    if (!selectionDatas || selectionDatas.length !== 1) {
      this.$message.warning('请选择一条数据')
    } else {
      const row = selectionDatas[0]
      this.getOne(row.guid).then(response => {
        if (this.filterFormData.statusCode === '待下单') {
          this.createOrderFormData = response.data
          this.showOrderComponent = true
          this.dialogStatus = 'update'
        }
        if (this.filterFormData.statusCode === '已下单') {
          this.createFormData = response.data
          this.dialogFormVisible = true
          this.dialogStatus = 'update'
        }
      })
    }
  },
  // 下单操作
  handleOrder(row) {
    this.getOne(row.guid).then(response => {
      this.createFormData = response.data
      this.createFormData.statusCode = '已下单'
      this.getSupplierData(row.goodsGuid)
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
    })
  },
  // 删除信息
  handleRemove() {
    const selectionDatas = this.$refs.vxeTableRef.selection
    if (!selectionDatas || selectionDatas.length !== 1) {
      this.$message.warning('请选择一条数据')
    } else {
      const row = selectionDatas[0]
      this.$confirm('此操作将删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleHttpMethod(deleteApi(row.guid), true, '正在删除中', true, '删除成功').then(res => {
          this.pageList()
        })
      })
    }
  },
  // 过滤方法
  handleFilter(params) {
    // 对象拷贝，防止数据污染
    const conditionParams = [
      { name: 'goodsName', type: '4', remove: true },
      { name: 'goodsCategory', type: '4', remove: true },
      { name: 'shopName', type: '4', remove: true },
      { name: 'sku', type: '4', remove: true },
      { name: 'itemId', type: '4', remove: true }]
    if (conditionParams) {
      conditionParams.forEach(item => {
        this.buildConditionData(item.name, item.type, params, item.remove)
      })
    }
    // 如果状态为全部则不过滤状态
    if (params.statusCode === '全部') {
      params.statusCode = ''
    }
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
  // 过滤按钮点击事件
  HandlefilterDialogClick() {
    if (this.filterDialogVisible) {
      this.filterDialogVisible = false
    } else {
      this.filterDialogVisible = true
    }
  },
  selectedShopGoods(shopGoodsInfo) {
    this.createFormData.shopGoodsGuid = shopGoodsInfo.guid
    this.createFormData.goodsGuid = shopGoodsInfo.goodsGuid
    this.createFormData.clientId = shopGoodsInfo.clientId
    this.createFormData.goodsName = shopGoodsInfo.goodsName
    // 发送请求获取供应商信息
    this.getSupplierData(shopGoodsInfo.goodsGuid)
  },
  getSupplierData(goodsGuid) {
    this.handleHttpMethod(postSupplierListApi({ goodsGuid: goodsGuid }), true, '请求中...').then(res => {
      this.supplierData = res.data
    })
  },
  // 新增采购订单
  handleCreateOrder() {
    this.showOrderComponent = true
    this.dialogStatus = 'create'
    this.createOrderFormData = {}
  },
  supplierChange(param) {
    if (param) {
      this.supplierData.forEach(item => {
        if (item.supplierGuid === param.value) {
          this.createFormData.boxVolume = item.boxVolume
          this.createFormData.boxQuantity = item.boxQuantity
          this.createFormData.totalBox = new $Big(this.createFormData.purNumber || 0).div(item.boxQuantity).toFixed(1).toString()
          this.createFormData.purVolume = new $Big(item.boxVolume || 0).times(this.createFormData.totalBox || 0).toFixed(2).toString()
        }
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
