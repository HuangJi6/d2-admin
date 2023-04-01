import { deleteApi, getOneApi, updateApi, addApi, pageMapApi } from '@/api/business/shopGoodsOperateApi.js'
// import { getAllApplication } from '@/api/business/applicationApi.js'
import { getSupplierListApi } from '@/api/business/supplierApi.js'

// 初始化方法
const initMethods = {
  initMounted() {
    console.log('initMounted...')
    this.pageList()
  },
  initCreated() {
    console.log('initCreated...')
    this.handleHttpMethod(getSupplierListApi(), true, '请求中...').then(res => {
      this.supplierData = res.data
      // this.$set(this.createForm[0].children[1].itemRender, 'options', res.data)
    })
  }
}
// 接口方法
const interfaceMethods = {}
// 数据方法
const dataMethods = {
  // 重置表单数据
  resetCreateForm() {
    this.createFormData = {
      shopGoodsGuid: '',
      shopName: '',
      clientId: '',
      goodsName: '',
      goodsGuid: '',
      optimizeStatus: '未优化',
      sku: '',
      itemId: '',
      mlCode: '',
      statusCode: '',
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
    this.createFormData.goodsName = goodsInfo.goodsCategory + '—' + goodsInfo.goodsName
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
    this.createFormData.goodsName = shopGoodsInfo.shopName + '—' + shopGoodsInfo.goodsName
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
