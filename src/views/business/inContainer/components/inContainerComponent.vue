// 入库组件
<template>
<vxe-modal v-model="showIn" title="箱唛变更"
    width="80%"
    height="60%"
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
    <vxe-form ref="createFrom" title-width="auto" title-align="right" titleColon
      :data="createFormData" :rules="createFromRules"
      @submit="handleSubmitCreate('createFrom')" @reset="handleCancelCreate('createFrom')">
      <vxe-form-item title="出库箱唛编码" field="name" :item-render="{}">
        <template #default="{ data }">
          <vxe-input v-model="data.name" placeholder="请输入出库箱唛编码" clearable></vxe-input>
        </template>
      </vxe-form-item>
    </vxe-form>

    <vxe-toolbar>
      <template #buttons>
        <el-button icon="vxe-icon-chart-pie" size="mini" style="width:120px" @click="HandlefilterDialogClick">选择出库商品</el-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      class="mytable-scrollbar"
      size="medium"
      header-cell-class-name="headerClassName"
      cell-class-name="cellClassName"
      border
      style="width:auto;"
      resizable
      height="60%"
      show-overflow
      :data="selectionOperateDatasIn"
      :edit-config="{trigger: 'click', mode: 'cell', showStatus: true}">
      <vxe-column type="checkbox" width="60"></vxe-column>
      <vxe-column type="seq" title="序号" width="60"></vxe-column>
      <vxe-column field="shopName" title="商品名称" width="200"></vxe-column>
      <vxe-column field="shippingMark" title="原箱唛编号" width="200"></vxe-column>
      <vxe-column field="purNumber" title="商品数量" width="200"></vxe-column>
      <vxe-column field="boxQuantity" title="单箱数量" width="200"></vxe-column>
      <vxe-column field="outNumber" title="出库数量" width="200" :edit-render="{autofocus: '.vxe-input--inner', defaultValue: 'purNumber'}">
        <template #edit="{ row }">
          <vxe-input v-model="row.outNumber" type="text"></vxe-input>
        </template>
      </vxe-column>
      <vxe-column field="outVolume" title="是否需要重新装箱" width="200" :edit-render="{autofocus: '.vxe-input--inner', defaultValue: 'purNumber'}"></vxe-column>
    </vxe-table>
  </vxe-modal>
</template>

<script>
import mixins from '@/mixin/commonMixin.js'
export default {
  mixins: [mixins],
  components: { },
  name: 'InContainerComponent',
  props: {
    // 显示标识
    show: {
      type: Boolean,
      default() {
        return false
      }
    },
    // 操作数据
    selectionOperateDatas: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      selectionOperateDatasIn: this.selectionOperateDatas,
      showIn: this.show,
      shopGoodsInfoIn: {},
      createFormData: {},
      createFromRules: {}
    }
  },
  methods: {
    // 方法
    handleClose() {
      this.showIn = false
      this.$emit('update:show', false)
    },
    // 确定
    onSure() {
      const rows = this.$refs.shopGoodsVue.$refs.vxeTableRef.selection
      if (!rows || rows.length !== 1) {
        this.$message.warning('请选择一条数据')
      } else {
        this.shopGoodsInfoIn = rows[0]
        console.log(rows)
        this.$emit('onSureClick', this.shopGoodsInfoIn)
        this.handleClose()
      }
    }
  },
  crated() {},
  mounted() {}
}
</script>

<style lang='scss'>
</style>
