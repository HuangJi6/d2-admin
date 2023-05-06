import { deleteByOperateGuids, getOneApi, updateApi, addApi, pageOperateMapApi, getOperatePayOneApi, pageMapApi } from '@/api/business/operatePayApi.js'
// import { getAllApplication } from '@/api/business/applicationApi.js'
import { postSupplierListApi } from '@/api/business/supplierApi.js'
import $Big from '@/libs/big.js'
import moment from 'moment'

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
      brand: '',
      isComplete: '否',
      purTime: moment().format('YYYY-MM-DD h:mm:ss'),
      sumAmount: '',
      shipAmount: ''
    }
    this.supplierData = []
  },
  pageList() {
    if (this.filterFormData.statusCode === '待付款') {
      this.pageOperateMap()
    }
    if (this.filterFormData.statusCode === '付款记录') {
      this.pageOperatePayMap()
    }
  },
  // 查询未付款数据
  pageOperateMap() {
    this.listLoading = true
    const paramsCopy = Object.assign({}, this.filterFormData)
    this.handleFilter(paramsCopy)
    this.handleHttpMethod(pageOperateMapApi(paramsCopy || {}), true).then(res => {
      this.tableData = res.data.dataList
      this.total = res.data.total
      this.listLoading = false
    }).catch(err => {
      console.log(err)
      this.listLoading = false
    })
  },
  // 查询已支付数据
  pageOperatePayMap() {
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
      this.createFormData.isComplete = '否'
      this.createFormData.statusCode = '已下单'
      this.createFormData.purTime = moment().format('YYYY-MM-DD h:mm:ss')
      this.getSupplierData(row.goodsGuid)
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
    })
  },
  // 删除信息
  handleRemoveOperatePay() {
    const selectionDatas = this.$refs.vxeTableRef.selection
    if (!selectionDatas || selectionDatas.length !== 1) {
      this.$message.warning('请选择一条数据')
    } else {
      const operateGuids = []
      selectionDatas.forEach(item => {
        operateGuids.push(item.guid)
      })
      this.$confirm('此操作将移除该数据付款记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleHttpMethod(deleteByOperateGuids(operateGuids), true, '正在删除中', true, '删除成功').then(res => {
          this.pageList()
        })
      }).catch(() => {
      })
    }
  },
  // 过滤方法
  handleFilter(params) {
    // 对象拷贝，防止数据污染
    const conditionParams = [
      { name: 'goodsName', type: '4', remove: true },
      { name: 'purNo', type: '4', remove: true },
      { name: 'shopName', type: '4', remove: true },
      { name: 'sku', type: '4', remove: true },
      { name: 'itemId', type: '4', remove: true }]
    if (conditionParams) {
      conditionParams.forEach(item => {
        this.buildConditionData(item.name, item.type, params, item.remove)
      })
    }
    if (params.statusCode === '待付款') {
      params.statusCode = '待下单'
      this.buildConditionData('statusCode', 9, params, true)
      if (!this.showAll) {
        params.noPayAmount = '0'
        this.buildConditionData('noPayAmount', 3, params, true)
      }
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
          this.createFormData.purVolume = new $Big(item.boxVolume || 0).times(this.createFormData.totalBox || 0).toFixed(3).toString()
        }
      })
    }
  },
  // 采购付款
  handleOperatePay() {
    const selectionDatas = this.$refs.vxeTableRef.selection
    if (!selectionDatas || selectionDatas.length !== 1) {
      this.$message.warning('请选择一条数据')
    } else {
      const row = selectionDatas[0]
      // 查询采购付款记录
      this.handleHttpMethod(getOperatePayOneApi(row.guid), true, '查询数据中...').then(res => {
        this.dialogFormVisible = true
        this.operatePayData = res.data
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
