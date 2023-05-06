<template>
  <vxe-modal width="auto" height="70%" v-model="showIn" title="选择付款账户" show-footer show-close @hide="handleClose">
    <template #footer>
      <vxe-button status="primary" @click="onSure">确定</vxe-button>
      <vxe-button @click="handleClose">取消</vxe-button>
    </template>
    <div style="padding-top:3px;padding-bottom:10px">
      <el-input  clearable style="width: 200px;margin-right: 20px;" class="filter-item" placeholder="付款人搜索" v-model="filterFormData.payer" size="small"> </el-input>
      <el-button class="filter-item" icon="el-icon-search" @click="handleRefresh" size="small">搜索</el-button>
      <el-button class="filter-item" icon="el-icon-refresh" @click="handleRefresh" size="small">刷新</el-button>
    </div>
    <template>
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
        height="75%"
        :row-config="{isHover: true,isCurrent: true}"
        :data="tableData">
        <vxe-column type="seq" title="序号" width="60"></vxe-column>
        <vxe-column field="payer" title="付款人名称" width="150"></vxe-column>
        <vxe-column field="payAccount" title="付款账户" width="300"></vxe-column>
        <vxe-column title="操作" width="90" fixed="right" align="center" show-overflow>
          <template #default="{ row }">
            <vxe-button v-if="!selectedRowGuids.includes(row.payerGuid)" type="text" size="mini" status="success" @click="handleChooseIt(row)" content="选中"></vxe-button>
            <vxe-button v-if="selectedRowGuids.includes(row.payerGuid)" type="text" size="mini" status="danger" @click="handleCancelChooseIt(row)" content="取消选中"></vxe-button>
          </template>
        </vxe-column>
      </vxe-table>
    </template>
    <el-pagination style="float:right" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="filterFormData.currentPage" :page-sizes="[10,20,30, 50,100,200,500]" :page-size="filterFormData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>

  </vxe-modal>
</template>

<script>
import { pageApi } from '@/api/business/payerApi'
import mixins from '@/mixin/commonMixin.js'
export default {
  mixins: [mixins],
  name: 'payerChooseComponentVue',
  props: {
    show: {
      type: Boolean,
      default() {
        return false
      }
    },
    payerTableDate: {
      type: Array,
      default() {
        return []
      }
    },
    defaultSelectedGuids: { type: Array, default() { return [] } },
    defaultselectedRows: { type: Array, default() { return [] } }
  },
  data() {
    return {
      tableData: this.payerTableDate,
      showIn: this.show,
      listLoading: false,
      selectedRows: this.defaultselectedRows || [],
      total: null,
      selectedRowGuids: this.defaultSelectedGuids || [],
      filterFormData: {
        currentPage: 1,
        pageSize: 20,
        payer: ''
      }
    }
  },
  methods: {
    // 刷新方法
    handleRefresh() {
      this.pageList()
    },
    handleClose() {
      this.selectedRows = []
      this.selectedRowGuids = []
      this.showIn = false
      this.$emit('update:show', false)
    },
    onSure() {
      console.log('确定选择')
      this.$emit('onSureClick', this.selectedRows)
      this.handleClose()
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
    // 过滤方法
    handleFilter(params) {
    // 对象拷贝，防止数据污染
      this.buildConditionData('payer', '4', params, true)
    },
    handleChooseIt(row) {
      this.selectedRows.push(row)
      this.selectedRowGuids.push(row.payerGuid)
    },
    handleCancelChooseIt(row) {
      this.selectedRowGuids.splice(this.selectedRowGuids.indexOf(row.payerGuid), 1)
      this.selectedRows.forEach(element => {
        if (element.payerGuid === row.payerGuid) {
          this.selectedRows.splice(this.selectedRows.indexOf(element), 1)
        }
      })
      console.log(this.selectedRows)
    },
    handleCurrentChange(val) {
      this.filterFormData.currentPage = val
      this.pageList()
    },
    handleSizeChange(val) {
      this.filterFormData.pageSize = val
      this.pageList()
    }
  },
  created() {
  },
  mounted() {
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
