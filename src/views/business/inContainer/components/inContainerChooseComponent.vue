
<template>
  <vxe-modal v-model="showIn" title="选择出库商品" width="80%" height="80%" show-footer show-close
    @hide="handleClose">
    <template #footer>
      <vxe-button status="primary" @click="onSure">确定</vxe-button>
      <vxe-button @click="handleClose">取消</vxe-button>
    </template>
    <div style="height:40px">
      <div style="float:left;padding-top:3px; width:80%">
        <el-input @keyup.enter.native="handleFilter" clearable style="width: 15%;margin-right: 20px;" class="filter-item" placeholder="SKU搜索" v-model="filterFormData.sku" size="small"> </el-input>
        <el-input @keyup.enter.native="handleFilter" clearable style="width: 15%;margin-right: 20px;" class="filter-item" placeholder="ITEM ID搜索" v-model="filterFormData.itemId" size="small"> </el-input>
        <el-input @keyup.enter.native="handleFilter" clearable style="width: 15%;margin-right: 20px;" class="filter-item" placeholder="商品名称搜索" v-model="filterFormData.goodsName" size="small"> </el-input>
        <el-input @keyup.enter.native="handleFilter" clearable style="width: 15%;margin-right: 20px;" class="filter-item" placeholder="箱唛搜索" v-model="filterFormData.shippingMark" size="small"> </el-input>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="pageList" size="small">搜索</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="pageList" size="small">刷新</el-button>
      </div>
    </div>
    <vxe-table
      class="mytable-scrollbar"
      size="medium"
      header-cell-class-name="headerClassName"
      cell-class-name="cellClassName"
      border
      resizable
      show-overflow
      show-header-overflow
      v-loading.body="listLoading"
      ref="vxeTableRef"
      height="84%"
      :row-config="{isHover: true}"
      @cell-click="handleCellClickEvent"
      :data="tableData">
      <vxe-column type="seq" title="序号" width="60"></vxe-column>
      <vxe-column field="shopName" title="店铺名称" width="100"></vxe-column>
      <vxe-column field="shippingMark" title="箱唛" width="120"></vxe-column>
      <vxe-column field="goodsName" title="商品名称" width="250"></vxe-column>
      <vxe-column field="sku" title="SKU" width="120"></vxe-column>
      <vxe-column field="itemId" title="ITEM ID" width="120"></vxe-column>
      <vxe-column field="statusCode" title="状态标识" width="100"></vxe-column>
      <vxe-column field="purNumber" title="总数量" width="120"></vxe-column>
      <vxe-column field="purNumber" title="已出库数量" width="120"></vxe-column>
      <vxe-column field="purNumber" title="未出库数量" width="120"></vxe-column>
      <vxe-column field="totalBox" title="总箱数" width="120"></vxe-column>
      <vxe-column field="boxQuantity" title="单箱数量" width="120"></vxe-column>
      <vxe-column field="remeasureWeight" title="单箱重新称重" width="120"></vxe-column>
      <vxe-column field="remeasureTotalWeight" title="总重新称重" width="120"></vxe-column>
      <vxe-column field="remeasureLength" title="重新测量长" width="120"></vxe-column>
      <vxe-column field="remeasureWidth" title="重新测量宽" width="120"></vxe-column>
      <vxe-column field="remeasureHigh" title="重新测量高" width="120"></vxe-column>
      <vxe-column field="remeasureVolume" title="重新测量体积" width="120"></vxe-column>
      <vxe-column field="purVolume" title="原体积" width="120"></vxe-column>
      <vxe-column field="goodsNature" title="货物性质" width="120"></vxe-column>
      <vxe-column field="qualityCode" title="质检情况" width="120"></vxe-column>
      <vxe-column field="inTime" title="入库日期" width="120"></vxe-column>
      <vxe-column field="outTime" title="出库日期" width="120"></vxe-column>
      <vxe-column field="remark" title="备注" width="120"></vxe-column>
      <vxe-column title="操作" width="100" fixed="right" align="center" show-overflow>
        <template #default="{ row }">
          <vxe-button v-if="!selectedRowGuids.includes(row.guid)" size="mini" status="success" @click="handleChooseIt(row)" content="选中"></vxe-button>
          <vxe-button v-if="selectedRowGuids.includes(row.guid)" size="mini" status="danger" @click="handleCancelChooseIt(row)" content="取消选中"></vxe-button>
        </template>
      </vxe-column>
    </vxe-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="filterFormData.currentPage" :page-sizes="[10,20,30, 50,100,200,500]" :page-size="filterFormData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
  </vxe-modal>
</template>

<script>
import mixins from '@/mixin/commonMixin.js'
import { pageMapApi } from '@/api/business/inContainerApi.js'
export default {
  name: 'InContainerMainTable',
  mixins: [mixins],
  props: {
    // 显示标识
    show: { type: Boolean, default() { return false } },
    // 回显数据-暂时不用
    defaultSelectedGuids: { type: Array, default() { return [] } }
  },
  data() {
    return {
      filterDialogVisible: false,
      showIn: this.show,
      searchForm: {},
      selectedRows: [],
      selectedRowGuids: [],
      filterFormData: {
        currentPage: 1,
        pageSize: 20,
        goodsName: '',
        shopName: '',
        sku: '',
        itemId: '',
        statusCode: '已入库',
        shippingMark: ''
      },
      tableData: [],
      listLoading: false,
      total: null
    }
  },
  methods: {
    // 方法
    handleClose() {
      this.showIn = false
      this.$emit('update:show', false)
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
      // 如果状态为未入库则查询运营采购表中已下单的数据
      if (params.statusCode === '待检测') {
        params.statusCode = '已下单'
      }
    },
    onSure() {
      console.log('确定选择')
      this.$emit('onSureClick', this.selectedRows)
      this.handleClose()
    },
    handleCellClickEvent() {},
    handleSizeChange(val) {
      this.filterFormData.pageSize = val
      this.pageList()
    },
    HandlefilterDialogClick() {
      if (this.filterDialogVisible) {
        this.filterDialogVisible = false
      } else {
        this.filterDialogVisible = true
      }
    },
    handleRefresh() {

    },
    handleChooseIt(row) {
      this.selectedRows.push(row)
      this.selectedRowGuids.push(row.guid)
    },
    handleCancelChooseIt(row) {
      this.selectedRowGuids.splice(this.selectedRowGuids.indexOf(row.guid), 1)
      this.selectedRows.forEach(element => {
        if (element.guid === row.guid) {
          this.selectedRows.splice(this.selectedRows.indexOf(element), 1)
        }
      })
      console.log(this.selectedRows)
    },
    handleCurrentChange(val) {
      this.filterFormData.currentPage = val
      this.pageList()
    }
  },
  watch: {
    showIn: {
      handler(nval, oval) {
        if (nval === true) {
          this.pageList()
        }
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
