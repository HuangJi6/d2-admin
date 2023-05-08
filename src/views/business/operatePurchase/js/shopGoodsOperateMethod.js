import { getOneApi, updateApi, addApi, deleteBatchByBatchIds, queryListMap, pageOperatePurchaseGroup, updateComplate, deleteBatchByGuids } from '@/api/business/shopGoodsOperateApi.js'
import { postSupplierListApi } from '@/api/business/supplierApi.js'
import { checkSameSupplier } from '@/api/business/supplierGoodsApi'
import { getOperatePayByBatch } from '@/api/business/operatePayApi.js'

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
      supplierGuid: '',
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
    this.listLoading = true
    const paramsCopy = Object.assign({}, this.filterFormData)
    this.handleFilter(paramsCopy)
    this.handleHttpMethod(pageOperatePurchaseGroup(paramsCopy || {}), true).then(res => {
      this.tableData = res.data.dataList
      this.total = res.data.total
      this.listLoading = false
      this.$refs.vxeTableRef.refreshColumn()
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
  },
  // 底部汇总行方法
  footerMethod({ columns, data }) {
    const footerData = [
      columns.map((column, columnIndex) => {
        if (columnIndex === 1) {
          return '合计'
        }
        if (['purNumber', 'purVolume', 'purAmount', 'shipAmount', 'sumAmount'].includes(column.property)) {
          return this.sumNum(data, column.field)
        }
        return null
      })
    ]
    return footerData
  },
  sumNum(list, field) {
    let count = 0
    list.forEach(item => {
      count = new $Big(count || 0).plus(item[field] || 0).toString()
    })
    return count
  },
  loadChildrenMethod({ row }) {
    console.log('加载子节点')
    // 异步加载子节点
    let statusCode = this.filterFormData.statusCode
    if (this.filterFormData.statusCode === '全部') {
      statusCode = ''
    }
    return this.handleHttpMethod(queryListMap({ statusCode: statusCode, batchId: row.batchId }), true, '查询中...').then(res => {
      return res.data
    })
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
    if (this.filterFormData.statusCode === '待下单') {
      this.newOrderUpdate()
    }
    if (this.filterFormData.statusCode === '已下单') {
      if (!selectionDatas || selectionDatas.length !== 1) {
        this.$message.warning('请选择一条数据修改')
      } else {
        const row = selectionDatas[0]
        this.getOne(row.guid).then(response => {
          this.getSupplierData(row.goodsGuid)
          this.createFormData = response.data
          this.createFormData.shopName = row.shopName
          this.dialogFormVisible = true
          this.dialogStatus = 'update'
        })
      }
    }
  },
  newOrderUpdate() {
    const selectionDatas = this.$refs.vxeTableRef.selection
    if (!selectionDatas || selectionDatas.length < 1) {
      this.$message.warning('请选择一条以上数据')
    } else {
      const batchId = this.checkSameBatchId(selectionDatas)
      if (!batchId) {
        this.$message.warning('请所选数据不是同一个采购单号')
        return
      }
      this.defaultPurGoodsName = selectionDatas[0].purGoodsName
      this.handleHttpMethod(queryListMap({ statusCode: this.filterFormData.statusCode, batchId: batchId }), true, '查询中...').then(response => {
        this.createOrderListData = response.data
        this.showOrderComponent = true
        this.dialogStatus = 'update'
      })
    }
  },
  // 工厂已交货
  handleComplete() {
    this.purCompleteData = {
      batchIds: [],
      purNos: [],
      isComplete: true,
      completeTime: moment().format('YYYY-MM-DD h:mm:ss')
    }
    const selectionDatas = this.$refs.vxeTableRef.selection
    if (!selectionDatas || selectionDatas.length < 1) {
      this.$message.warning('请选择一条或一条以上数据')
    } else {
      let batchIds = []
      let purNos = []
      selectionDatas.forEach(item => {
        batchIds.push(item.batchId)
        purNos.push(item.purNo)
      })
      batchIds = [...new Set(batchIds)]
      purNos = [...new Set(purNos)]
      this.purCompleteData.batchIds = batchIds
      this.purCompleteData.purNos = purNos
      this.showPurchaseComplete = true
    }
  },
  // 完工提交
  completeSubmit() {
    if (this.purCompleteData.isComplete) {
      if (this.purCompleteData.completeTime === '') {
        this.$message.warning('请选择完成日期')
        return
      }
    }
    this.$confirm('确定订单交货状态？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      const params = { batchIds: this.purCompleteData.batchIds, isComplete: this.purCompleteData.isComplete ? '是' : '否', completeTime: this.purCompleteData.completeTime }
      this.handleHttpMethod(updateComplate(params), true, '正在更新中', true, '更新成功').then(res => {
        this.pageList()
        this.showPurchaseComplete = false
      })
    }).catch(() => {
    })
  },
  // 下单操作
  handleOrder(row) {
    this.getOne(row.guid).then(response => {
      this.createFormData = response.data
      this.createFormData.shopName = row.shopName
      this.createFormData.isComplete = '否'
      this.createFormData.statusCode = '已下单'
      this.createFormData.purTime = moment().format('YYYY-MM-DD h:mm:ss')
      this.getSupplierData(row.goodsGuid)
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
    })
  },
  // 删除信息
  handleRemove() {
    const selectionDatas = this.$refs.vxeTableRef.selection
    const guids = []
    if (!selectionDatas || selectionDatas.length < 1) {
      this.$message.warning('请选择一条或一条以上数据')
    } else {
      this.$confirm('此操作将删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const parent = selectionDatas.filter(item => { return item.hasChild === 1 })
        if (parent && parent.length > 0) {
          const batchIds = []
          parent.forEach(item => {
            batchIds.push(item.batchId)
          })
          this.handleHttpMethod(deleteBatchByBatchIds(batchIds), true, '正在删除中', true, '删除成功').then(res => {
            this.pageList()
          }).catch(() => {
          })
        }
        const child = selectionDatas.filter(item => { return item.hasChild !== 1 })
        if (child && child.length > 0) {
          child.forEach(item => {
            guids.push(item.guid)
          })
          this.handleHttpMethod(deleteBatchByGuids(guids), true, '正在删除中', true, '删除成功').then(res => {
            this.pageList()
          })
        }
      }).catch(() => {
      })
    }
  },
  // 过滤方法
  handleFilter(params) {
    // 对象拷贝，防止数据污染
    const conditionParams = [
      { name: 'purNo', type: '4', remove: true },
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
    // 排序
    params.orderSqlSegment = 'pur_no'
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
    this.defaultPurGoodsName = ''
    this.createOrderListData = []
    this.showOrderComponent = true
    this.dialogStatus = 'create'
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
  // 付款
  handlePay() {
    const selectionDatas = this.$refs.vxeTableRef.selection
    if (!selectionDatas || selectionDatas.length < 1) {
      this.$message.warning('请选择一条或一条以上数据')
    } else {
      // 校验是否是同一个item_id
      const itemId = selectionDatas[0].itemId
      let flag = false
      selectionDatas.forEach(item => {
        if (itemId !== item.itemId) {
          flag = true
        }
      })
      if (flag) {
        this.$message.warning('相同item_id的数据才能同时付款')
        return
      }
      this.dialogOperatePayVisible = true
      this.operateTableDataList = selectionDatas
    }
  },
  // 采购付款
  handleOperatePay() {
    const selectionDatas = this.$refs.vxeTableRef.selection
    if (!selectionDatas || selectionDatas.length < 1) {
      this.$message.warning('请选择一条数据')
    } else {
      const parent = selectionDatas.filter(item => { return item.hasChild === 1 })
      if (!parent || parent.length !== 1) {
        this.$message.warning('请选择一条汇总数据')
        return
      }
      const row = parent[0]
      // 查询采购付款记录
      this.handleHttpMethod(getOperatePayByBatch(row.batchId), true, '查询数据中...').then(res => {
        this.dialogOperatePayVisible = true
        this.operatePayData = res.data
        // this.operatePayData.purAmount = this.formatterAmount({ cellValue: this.operatePayData.purAmount }, 2)
        // this.operatePayData.shipAmount = this.formatterAmount({ cellValue: this.operatePayData.shipAmount }, 2)
        // this.operatePayData.sumAmount = this.formatterAmount({ cellValue: this.operatePayData.sumAmount }, 2)
        // this.operatePayData.noPayAmount = this.formatterAmount({ cellValue: this.operatePayData.noPayAmount }, 2)
      })
    }
  },
  // 批量下单
  async handleBatchOrder() {
    // 校验item_id是否是一致的,并且拥有同一个供应商
    const selectionDatas = this.$refs.vxeTableRef.getCheckboxRecords()
    if (!selectionDatas || selectionDatas.length < 1) {
      this.$message.warning('请选择一条或一条以上数据')
    } else {
      // selectionDatas = selectionDatas.filter(item => { return item.hasChild !== 1 })
      const batchId = this.checkSameBatchId(selectionDatas)
      if (!batchId) {
        this.$message.warning('请选择相同采购批次的商品下单')
        return
      }
      await this.setDefaultBatchOrderData(selectionDatas[0].shopName, batchId)
    }
  },
  setDefaultBatchOrderData(shopName, batchId) {
    this.defaultBatchOrderFormData = {
      shopName: '',
      supplierGuid: '',
      statusCode: '',
      shipAmount: '',
      shipType: '',
      purTime: '',
      isComplete: '',
      completeTime: '',
      remark: ''
    }
    this.defaultBatchOrderFormData.shopName = shopName
    this.defaultBatchOrderFormData.isComplete = '否'
    this.defaultBatchOrderFormData.statusCode = '已下单'
    this.defaultBatchOrderFormData.purTime = moment().format('YYYY-MM-DD h:mm:ss')
    const goodsGuids = []
    this.handleHttpMethod(queryListMap({ statusCode: this.filterFormData.statusCode, batchId: batchId }), true, '查询中...').then(response => {
      this.defaultBatchOrderTableDataList = response.data
      if (this.defaultBatchOrderTableDataList[0].supplierGuid) {
        this.defaultBatchOrderFormData.supplierGuid = this.defaultBatchOrderTableDataList[0].supplierGuid
      }
      this.defaultBatchOrderTableDataList.forEach(item => {
        goodsGuids.push(item.goodsGuid)
      })

      // 校验是否有相同的供应商
      this.handleHttpMethod(checkSameSupplier(goodsGuids), true, '检验数据中').then(res => {
        if (res.data.success) {
          this.showBatchOrderComponent = true
          this.supplierSelectDataList = res.data.data.selectList
          this.supplierGoodsDataList = res.data.data.supplierGoodsList
        } else {
          this.$message.warning(res.data.message)
        }
      })
    })
  },
  checkSameBatchId(selectionDatas) {
    const batchId = selectionDatas[0].batchId
    let flag = false
    selectionDatas.forEach(item => {
      if (batchId !== item.batchId) {
        flag = true
      }
    })
    if (flag) {
      return ''
    } else {
      return batchId
    }
  },
  isPayOverClick(row) {
    this.handleHttpMethod(getOperatePayByBatch(row.batchId), true, '查询数据中...').then(res => {
      this.dialogOperatePayVisible = true
      this.operatePayData = res.data
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
