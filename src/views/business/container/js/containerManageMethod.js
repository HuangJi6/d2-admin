import { pageContainerApi, addStoreContainerApi, getAllApplication, getOneApi, updateStoreContainerApi, deleteStoreContainerApi } from '@/api/business/containerApi.js'
import { removeFilesApi } from '@/api/common/commonApi.js'

const initMethods = {
  initMounted() {
    console.log('initMounted...')
    this.pageList()
  },
  initCreated() {
    console.log('initCreated...')
    this.handleHttpMethod(getAllApplication(), true, '请求中...').then(res => {
      this.applicationData = res.data
      this.$set(this.createForm[0].children[0].itemRender, 'options', res.data)
    })
  }
}
const interfaceMethods = {

}
/**
 * 数据处理方法
 */
const dataMethods = {
  // 查询用户信息
  pageList() {
    this.listLoading = true
    const paramsCopy = Object.assign({}, this.filterFormData)
    if (paramsCopy.storeStatus === '0') {
      this.$delete(paramsCopy, 'storeStatus')
    }
    this.handleFilter(paramsCopy)
    this.handleHttpMethod(pageContainerApi(paramsCopy || {}), true).then(res => {
      this.tableData = res.data.dataList
      this.total = res.data.total
      this.listLoading = false
    }).catch(err => {
      console.log(err)
      this.listLoading = false
    })
  },
  // 添加信息
  submitCreate(formName) {
    const set = this.$refs
    set[formName].validate().then((valid) => {
      if (!valid) {
        const params = this.buildSubmitCreateData(this.createFormData)
        if (this.dialogStatus === 'create') {
          this.handleHttpMethod(addStoreContainerApi(params), true, '正在保存中', true, '信息保存成功').then(res => {
            if (res) {
              this.dialogFormVisible = false
              this.pageList()
            }
          })
        }
        if (this.dialogStatus === 'update') {
          this.handleHttpMethod(updateStoreContainerApi(params.guid, params), true, '正在保存中', true, '信息保存成功').then(res => {
            if (res) {
              this.dialogFormVisible = false
              this.pageList()
            }
          })
        }
      }
    })
  },
  // 构建数据
  buildSubmitCreateData(params) {
    const data = Object.assign({}, params)
    this.applicationData.forEach(element => {
      if (element.clientId === data.shopName) {
        data.shopName = element.shopName
        data.clientId = element.clientId
      }
    })
    // 文件列表
    if (this.fileList) {
      data.photoId = this.fileList[0].response.data[0].groupGuid
    }
    return data
  },
  // 单个用户
  getOne(id) {
    return this.handleHttpMethod(getOneApi(id), true)
  },
  // 重置新增页面数据
  resetTemp() {
    this.createFormData = {
      shopName: '',
      cname: '',
      goodsName: '',
      skuCode: '',
      itemId: '',
      ctnNo: '',
      fbaMl: '',
      referenceId: '',
      quantity: '',
      totalCtn: '',
      weight: '',
      cartonLength: '',
      cartonWidth: '',
      cartonHeight: '',
      ctnMeasurement: '',
      totalVolume: '',
      material: '',
      storeFunction: '',
      brand: '',
      unitPrice: '',
      totalValue: '',
      hsCode: '',
      photoId: '',
      photoUrl: '',
      amazonUrl: '',
      personUrl: '',
      mkdUrl: '',
      urgency: ''
    }
    this.fileList = []
  }

}
/**
 * 前端操作事件
 */
const handleMethods = {
  // 上传附件
  handleUploadSuccess(response, file, fileList) {
    this.fileList = JSON.parse(JSON.stringify(fileList))
    this.fileList.forEach(item => {
      if (item.response) {
        item.guid = item.response.data[0].guid
      }
    })
    if (response.code === '100000') {
      this.$message.success('文件上传成功')
    } else {
      this.$message.warning(file.name + '文件上传失败')
    }
  },
  handleUploadRemove(file, fileList) {
    console.log(this.fileList)
    const index = this.fileList.forEach(item => {
      if (item.uid === file.uid) {
        return true
      }
    })
    const removeFile = this.fileList.splice(index, 1)
    console.log(this.fileList)
    if (removeFile[0].guid) {
      const params = {
        guid: removeFile[0].guid
      }
      this.handleHttpMethod(removeFilesApi(params), false, '', true, '文件移除成功')
    }
  },
  handleUploadError(err, file, fileList) {
    console.log(err)
    console.log(fileList)
    this.$message.warning(file.name + '文件上传失败')
  },
  // 删除用户信息
  handleRemove(row) {
    this.$confirm('此操作将删除数据, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.handleHttpMethod(deleteStoreContainerApi(row.guid), true, '正在删除中', true, '删除成功').then(res => {
        this.pageList()
      })
    })
  },
  // 过滤查询按钮
  handleFilter(paramsCopy) {
    const conditionParams = [
      { name: 'shopName', type: '4', remove: true },
      { name: 'cname', type: '4', remove: true }]
    if (conditionParams) {
      conditionParams.forEach(item => {
        this.buildConditionData(item.name, item.type, paramsCopy, item.remove)
      })
    }
  },
  // 刷新按钮
  handleRefresh() {
    this.pageList()
  },
  // 新建按钮
  handleCreate() {
    this.resetTemp()
    this.dialogStatus = 'create'
    this.dialogFormVisible = true
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
  cancel(formName) {
    this.dialogFormVisible = false
    this.resetTemp()
  },
  createModalClose() {
    this.cancel()
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
  ...utilMethods,
  ...handleMethods
}
