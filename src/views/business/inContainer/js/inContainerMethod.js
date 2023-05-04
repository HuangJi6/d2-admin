import { deleteApi, getOneApi, updateApi, pageMapApi as pageInContainerList, addBatchApi } from '@/api/business/inContainerApi.js'
import { pageMapApi as pageOutContainerList, deleteBatchByGuids, getOneApi as getOutOnApi } from '@/api/business/outContainerApi.js'
import { pageMapApi as operatePageMapApi } from '@/api/business/shopGoodsOperateApi.js'
import { pageMapApi as pageShippingMarkList } from '@/api/business/shippingMarkApi.js'
import moment from 'moment'

// 初始化方法
const initMethods = {
  initMounted() {
    console.log('initMounted...')
    this.pageOperateList()
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
      goodsName: '',
      itemId: '',
      sku: '',
      operateGuid: '',
      purNumber: '',
      purInNumber: '',
      purOutNumber: '',
      remeasureLength: '',
      remeasureWidth: '',
      remeasureHigh: '',
      remeasureVolume: '0',
      remeasureTotalVolume: '0',
      remeasureWeight: '',
      remeasureTotalWeight: '0',
      boxWeight: '',
      statusCode: '',
      goodsNature: '',
      qualityCode: 'OK',
      inTime: moment().format('YYYY-MM-DD h:mm:ss'),
      outTime: '',
      shippingMark: '',
      remark: ''
    }
  },
  pageList() {
    this.listLoading = true
    const paramsCopy = Object.assign({}, this.filterFormData)
    if (paramsCopy.statusCode === '已入库') {
      this.handleFilter(paramsCopy)
      this.handleHttpMethod(pageInContainerList(paramsCopy || {}), true).then(res => {
        this.tableData = res.data.dataList
        this.total = res.data.total
        this.listLoading = false
      }).catch(err => {
        console.log(err)
        this.listLoading = false
      })
    } else if (paramsCopy.statusCode === '待出库') {
      this.handleHttpMethod(pageOutContainerList(paramsCopy || {}), true).then(res => {
        this.tableData = res.data.dataList
        this.total = res.data.total
        this.listLoading = false
      }).catch(err => {
        console.log(err)
        this.listLoading = false
      })
    }
    this.listLoading = false
  },
  // 查询已下单的数据
  pageOperateList() {
    this.listLoading = true
    const paramsCopy = Object.assign({}, this.filterFormData)
    this.handleFilter(paramsCopy)
    this.handleHttpMethod(operatePageMapApi(paramsCopy || {}), true).then(res => {
      this.tableData = res.data.dataList
      this.total = res.data.total
      this.listLoading = false
    }).catch(err => {
      console.log(err)
      this.listLoading = false
    })
  },
  // 查询已入库的数据
  pageInContainerList() {
    this.listLoading = true
    const paramsCopy = Object.assign({}, this.filterFormData)
    this.handleFilter(paramsCopy)
    this.handleHttpMethod(pageInContainerList(paramsCopy || {}), true).then(res => {
      this.tableData = res.data.dataList
      this.total = res.data.total
      this.listLoading = false
    }).catch(err => {
      console.log(err)
      this.listLoading = false
    })
  },
  // 查询已出库的数据
  pageOutContainerList() {
    this.listLoading = true
    const paramsCopy = Object.assign({}, this.filterFormData)
    this.handleFilter(paramsCopy)
    this.handleHttpMethod(pageOutContainerList(paramsCopy || {}), true).then(res => {
      this.tableData = res.data.dataList
      this.total = res.data.total
      this.listLoading = false
    }).catch(err => {
      console.log(err)
      this.listLoading = false
    })
    // 调用子组件的汇总数据
    if (this.$refs.packingListTopGather) {
      this.$refs.packingListTopGather.refreshContainerGroup()
    }
  },
  pageShippingMarkList() {
    this.listLoading = true
    const paramsCopy = Object.assign({}, this.filterFormData)
    this.handleFilter(paramsCopy)
    this.handleHttpMethod(pageShippingMarkList(paramsCopy || {}), true).then(res => {
      this.tableData = res.data.dataList
      this.total = res.data.total
      this.listLoading = false
    }).catch(err => {
      console.log(err)
      this.listLoading = false
    })
    // 调用子组件的汇总数据
    if (this.$refs.packingListTopGather) {
      this.$refs.packingListTopGather.refreshContainerGroup()
    }
  },
  // 提交保存
  handleSubmitInContainer(formName) {
    const refs = this.$refs
    refs[formName].validate().then((valid) => {
      if (!valid) {
        if (this.dialogStatus === 'create') {
          const selectionDatas = this.$refs.vxeTableRef.selection
          const beforeCheckDatas = []
          selectionDatas.forEach(ele => {
            const formDataCopy = Object.assign({}, this.createFormData)
            formDataCopy.operateGuid = ele.guid
            formDataCopy.shippingMark = ele.shippingMark
            formDataCopy.statusCode = '已入库'
            formDataCopy.purNumber = ele.purNumber
            formDataCopy.purInNumber = ele.purNumber
            formDataCopy.purOutNumber = 0
            beforeCheckDatas.push(formDataCopy)
          })
          this.handleHttpMethod(addBatchApi(beforeCheckDatas), true, '正在保存中', true, '信息保存成功').then(res => {
            if (res) {
              this.dialogFormVisible = false
              this.pageOperateList()
            }
          })
        }
        if (this.dialogStatus === 'update') {
          this.handleHttpMethod(updateApi(this.createFormData.guid, this.createFormData), true, '正在保存中', true, '信息保存成功').then(res => {
            if (res) {
              this.dialogFormVisible = false
              this.handleRefreshPageList()
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
    this.createFormData.goodsName = goodsInfo.goodsCategory + '—' + goodsInfo.goodsName
  },
  createFormItemChange() {
  },
  // 保存入库前检测信息
  submitBeforeCheck() {
    const selectionDatas = this.$refs.vxeTableRef.selection
    const beforeCheckDatas = []
    selectionDatas.forEach(ele => {
      const formDataCopy = Object.assign({}, this.createFormData)
      formDataCopy.operateGuid = ele.guid
      formDataCopy.shippingMark = ele.shippingMark
      formDataCopy.statusCode = '已入库'
      formDataCopy.purInNumber = formDataCopy.purNumber
      formDataCopy.purOutNumber = 0
      beforeCheckDatas.push(formDataCopy)
    })
    console.log(beforeCheckDatas)
    this.handleHttpMethod(addBatchApi(beforeCheckDatas), true, '正在保存中', true, '信息保存成功').then(res => {
      if (res) {
        this.dialogFormVisible = false
        this.handleRefreshPageList()
      }
    })
  },
  // 删除已出库数据
  removeOutContainerData(params) {
    this.$confirm('此操作将删除数据, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.handleHttpMethod(deleteBatchByGuids(params), true, '正在删除中', true, '删除成功').then(res => {
        this.handleRefreshPageList()
      })
    }).catch(() => {
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
    this.handleRefreshPageList()
  },
  handleCurrentChange(val) {
    this.filterFormData.currentPage = val
    this.handleRefreshPageList()
  },
  // 新增按钮
  handleCreate() {
    this.resetCreateForm()
    this.dialogStatus = 'create'
    this.dialogFormVisible = true
    this.showInContainerComponent = true
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
      this.createFormData.goodsName = row.goodsName
      this.createFormData.itemId = row.itemId
      this.createFormData.sku = row.sku
      this.createFormData.totalBox = row.totalBox
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
        this.handleRefreshPageList()
      })
    }).catch(() => {
    })
  },
  // 过滤方法
  handleFilter(params) {
    // 对象拷贝，防止数据污染
    const conditionParams = [
      { name: 'goodsName', type: '4', remove: true },
      { name: 'goodsCategory', type: '4', remove: true },
      { name: 'shopName', type: '4', remove: true },
      { name: 'sku', type: '4', remove: true },
      { name: 'itemId', type: '4', remove: true },
      { name: 'shippingMark', type: '4', remove: true }]
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
  // 取消保存
  handleCancelInContainer() {
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
    this.createFormData.goodsName = shopGoodsInfo.shopName + '—' + shopGoodsInfo.goodsName
  },
  // 入库前填写检测信息
  handleBeforeCheck() {
    // 校验是否选择数据
    const selectionDatas = this.$refs.vxeTableRef.selection
    if (!selectionDatas || selectionDatas.length !== 1) {
      this.$message.warning('请选择一条数据')
    } else {
      // 如果选择多条数据，判断商品信息是否一致
      // this.resetCreateForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    }
    this.createFormData.goodsName = selectionDatas[0].goodsName
    this.createFormData.itemId = selectionDatas[0].itemId
    this.createFormData.sku = selectionDatas[0].sku
    this.createFormData.totalBox = selectionDatas[0].totalBox
    this.createFormData.purInNumber = selectionDatas[0].purNumber
    this.createFormData.purOutNumber = 0
    this.createFormData.purNumber = selectionDatas[0].purNumber
  },
  // 入库前保存检测信息
  handleBeforeCheckSave() {
    this.submitBeforeCheck()
  },
  // 箱唛变更出库
  handleChangeOutContainer() {
    this.showChangeOutContainerComponent = true
    const selectionDatas = this.$refs.vxeTableRef.selection
    if (!selectionDatas || selectionDatas.length < 1) {
      this.$message.warning('请选择一条或一条以上数据')
    } else {
      this.selectionOperateDatas = selectionDatas
      this.showChangeOutContainerComponent = true
    }
  },
  // 直接出库，不需要拆箱
  handleDirectOutContainer() {
    this.showDirectOutContainer = true
  },
  // 添加箱单
  handleAddPackingList() {
    this.showAddPackingListFormDialog = true
  },
  // 刷新按钮点击
  handleRefreshPageList() {
    if (this.filterFormData.statusCode === '已下单') {
      this.pageOperateList()
    }
    if (this.filterFormData.statusCode === '已入库') {
      this.pageInContainerList()
    }
    if (this.filterFormData.statusCode === '待出库') {
      this.pageOutContainerList()
    }
    if (this.filterFormData.statusCode === '已出完') {
      this.pageShippingMarkList()
    }
  },
  handleDeleteOutContainer() {
    const selectionDatas = this.$refs.vxeTableRef.selection
    if (!selectionDatas || selectionDatas.length < 1) {
      this.$message.warning('请选择一条或一条以上数据')
    } else {
      const guids = []
      selectionDatas.forEach(item => {
        guids.push(item.guid)
      })
      this.removeOutContainerData(guids)
    }
  },
  // 点击变更箱规按钮
  handleChangePacking() {
    const selectionDatas = this.$refs.vxeTableRef.selection
    if (!selectionDatas || selectionDatas.length !== 1) {
      this.$message.warning('请选择一条数据')
    } else {
      let flag = false
      selectionDatas.forEach(item => {
        if (item.isRepacking === '否') {
          flag = true
        }
      })
      if (flag) {
        this.$message.warning('请选择需要变更箱规的数据!')
        return
      }
      this.handleHttpMethod(getOutOnApi(selectionDatas[0].guid), true).then(response => {
        this.changePackingForm = response.data
        this.showChangePacking = true
      })
    }
  },
  // 待出库点击编辑按钮
  handleUpdateOutContainer(row) {
    if (row.isRepacking === '否') {
      this.$message.warning('请选择需要变更箱规的数据!')
      return
    }
    this.handleHttpMethod(getOutOnApi(row.guid), true).then(response => {
      this.updateOutContainerForm = response.data
      this.showUpdateOutContainerComponent = true
      this.outContainerDialogStatus = 'update'
    })
  },
  // 点击箱单回调函数
  changePackingList(value) {
    this.filterFormData.packingGuid = value
    if (this.filterFormData.statusCode === '待出库') {
      this.pageOutContainerList()
    }
    if (this.filterFormData.statusCode === '已出完') {
      this.pageShippingMarkList()
    }
  },
  // 装箱
  handleEncasement() {
    const selectionDatas = this.$refs.vxeTableRef.selection
    if (!selectionDatas || selectionDatas.length < 1) {
      this.$message.warning('请选择一条或一条以上数据')
    } else {
      this.encasementShippingMark = []
      selectionDatas.forEach(item => {
        if (!this.encasementShippingMark.includes(item.shippingMark)) {
          this.encasementShippingMark.push(item.shippingMark)
        }
      })
      this.showEncasement = true
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
