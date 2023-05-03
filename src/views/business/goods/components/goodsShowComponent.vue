<template>
  <vxe-modal v-model="showIn" title="商品列表"
    width="80%"
    height="80%"
    show-zoom
    resize
    remember
    transfer
    show-footer
    show-close
    @hide="handleClose">
    <template #footer>
      <vxe-button status="primary" @click="onSure">确定</vxe-button>
      <vxe-button @click="handleClose">取消</vxe-button>
    </template>
    <div style="height:90%">
      <div style="padding-top:3px;padding-bottom:8px;width:80%">
        <el-input @keyup.enter.native="handleFilter" clearable style="width: 200px;margin-right: 20px;" class="filter-item" placeholder="商名称搜索" v-model="filterFormData.goodsName" size="small"> </el-input>
        <el-input @keyup.enter.native="handleFilter" clearable style="width: 200px;margin-right: 20px;" class="filter-item" placeholder="商品类别搜索" v-model="filterFormData.goodsCategory" size="small"> </el-input>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleRefresh" size="small">搜索</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="handleRefresh" size="small">刷新</el-button>
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
        height="95%"
        :row-config="{isHover: true}"
        :data="tableData">
        <vxe-column type="radio" width="50"></vxe-column>
        <vxe-column type="seq" title="序号" width="60"></vxe-column>
        <vxe-column field="goodsName" title="商品名称" width="250"></vxe-column>
        <vxe-column field="goodsCategory" title="商品类别" width="150"></vxe-column>
        <vxe-column field="goodsLink" title="商品链接" width="150"></vxe-column>
        <vxe-column field="upcCode" title="UPC码" width="100"></vxe-column>
        <vxe-column field="imgLink" title="图片链接" width="150"></vxe-column>
        <vxe-column field="imgLink" title="产品图片" width="100">
          <template #default="{ row }">
            <el-image style="width: auto; height: 50px" :src="row.imgLink" :preview-src-list="[row.imgLink]"> </el-image>
          </template>
        </vxe-column>
        <vxe-column field="material" title="材料" width="100"></vxe-column>
        <vxe-column field="grade" title="评级" width="100"></vxe-column>
        <vxe-column field="goodsLength" title="商品-长/CM" width="100"></vxe-column>
        <vxe-column field="goodsWidth" title="商品-宽/CM" width="100"></vxe-column>
        <vxe-column field="goodsHigh" title="商品-高/CM" width="100"></vxe-column>
        <vxe-column field="goodsWeight" title="商品-重量" width="100"></vxe-column>
        <vxe-column field="goodsPrice" title="商品-单价" width="100"></vxe-column>
        <vxe-column field="goodsUse" title="商品-用途" width="100"></vxe-column>
        <vxe-column field="brand" title="商品-品牌" width="100"></vxe-column>
        <vxe-column field="remark" title="备注" width="200"></vxe-column>
      </vxe-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="filterFormData.currentPage" :page-sizes="[10,20,30, 50,100,200,500]" :page-size="filterFormData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
  </vxe-modal>
</template>

<script>
import mixins from '@/mixin/commonMixin.js'
import { myMethods } from '../js/goodsMethod.js'
export default {
  mixins: [mixins],
  name: 'GoodsShowComponent',
  props: {
    show: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      showIn: this.show,
      goodsInfoIn: {},
      listLoading: false,
      tableData: [],
      total: null,
      filterFormData: {
        currentPage: 1,
        pageSize: 20,
        goodsName: '',
        goodsCategory: ''
      }
    }
  },
  methods: {
    ...myMethods,
    // 方法
    handleClose() {
      this.showIn = false
      this.$emit('update:show', false)
    },
    // 确定
    onSure() {
      const rows = this.$refs.vxeTableRef.selectRow
      if (!rows) {
        this.$message.warning('请选择一条数据')
      } else {
        this.goodsInfoIn = rows
        console.log(rows)
        this.$emit('onSureClick', this.goodsInfoIn)
        this.handleClose()
      }
    }
  },
  crated() {},
  mounted() {
    this.initMounted()
  }
}
</script>

<style lang='scss'>
</style>
