// 直接出库管理
<template>
<div>
<vxe-modal v-model="showIn" title=" "
      @close="handleClose" width="60%" height="80%" show-footer show-zoom resize>
  <template #footer>
    <vxe-button status="primary" @click="handleSubmitCreate">确定</vxe-button>
    <vxe-button @click="handleClose">取消</vxe-button>
  </template>
  <el-descriptions style="height:200px;" title="采购信息" :column="3" extra="单位: 元  " border>
    <el-descriptions-item label="采购单号" labelStyle="border" label-class-name="my-label11">{{operatePayData.purNo}}</el-descriptions-item>
    <el-descriptions-item label="采购商品">{{operatePayData.goodsName}}</el-descriptions-item>
    <!-- <el-descriptions-item label="采购人">{{operatePayData.purNo}}</el-descriptions-item> -->
    <el-descriptions-item label="采购数量">{{operatePayData.purNumber}}</el-descriptions-item>
    <el-descriptions-item label="采购金额">{{operatePayData.purAmount}}</el-descriptions-item>
    <el-descriptions-item label="其他费用">{{operatePayData.shipAmount}}</el-descriptions-item>
    <el-descriptions-item label="采购总额" label-class-name="my-content">{{operatePayData.sumAmount}}</el-descriptions-item>
    <el-descriptions-item label="未付金额" label-class-name="my-content">{{this.noPayAmount}}</el-descriptions-item>
    <!-- <el-descriptions-item label="金额单位"><el-tag size="small">元</el-tag></el-descriptions-item> -->
  </el-descriptions>
  <vxe-toolbar>
    <template #buttons>
      <el-button icon="vxe-icon-chart-pie" size="mini" style="width:120px" @click="HandleChooseDialogClick">选择付款人</el-button>
    </template>
  </vxe-toolbar>
  <vxe-table
    ref="vxeTableRef"
    height="44%"
    style="width:100%;min-height: 100px;"
    align="center"
    show-overflow
    show-footer
    :footer-method="footerMethod"
    :data="selectionOperateDatasIn"
    :edit-config="{trigger: 'click', mode: 'cell', showStatus: true}">
    <vxe-column type="seq" title="序号" width="60"></vxe-column>
    <vxe-column field="payer" title="付款人" width="20%"></vxe-column>
    <vxe-column field="payAccount" title="付款账户" width="40%"></vxe-column>
    <vxe-column field="payAmount" title="付款金额" width="20%" :edit-render="{autofocus: '.vxe-input--inner'}">
      <template #edit="{ row }">
        <vxe-input v-model="row.payAmount" type="text"></vxe-input>
      </template>
    </vxe-column>
  </vxe-table>
  <PayerChooseComponentVue
  v-if="showInContainerChoose"
  :show.sync="showInContainerChoose"
  :defaultSelectedGuids="defaultSelectedGuids"
  :defaultselectedRows="defaultselectedRows"
  @onSureClick="onSureSelectedClick">
  </PayerChooseComponentVue>
</vxe-modal>
</div>
</template>

<script>
import { addBatchApi } from '@/api/business/operatePayApi.js'
import mixins from '@/mixin/commonMixin.js'
import PayerChooseComponentVue from '../../payer/components/payerChooseComponent.vue'
export default {
  mixins: [mixins],
  components: { PayerChooseComponentVue },
  name: 'operatePayChooseComponent',
  props: {
    // 显示标识
    show: {
      type: Boolean,
      default() {
        return false
      }
    },
    operatePayData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      noPayAmount: 0,
      showInContainerChoose: false,
      selectionOperateDatasIn: this.operatePayData.payList || [],
      defaultSelectedGuids: [],
      showIn: this.show
    }
  },
  methods: {
    // 方法
    handleClose() {
      this.selectionOperateDatasIn = []
      this.showIn = false
      this.$emit('update:show', false)
    },
    // 保存接口
    handleSubmitCreate() {
      const insertList = []
      let flag = false
      if (!this.selectionOperateDatasIn || this.selectionOperateDatasIn.length === 0) {
        this.$message.error('请选择付款人')
        return
      }
      let sumPay = 0
      this.selectionOperateDatasIn.forEach(ele => {
        const eleCopy = Object.assign({}, ele)
        if (!eleCopy.payAmount || Number(eleCopy.payAmount).toFixed(2) === '0.00') {
          flag = true
        }
        if (!eleCopy.payerGuid) {
          eleCopy.payerGuid = eleCopy.guid
        }
        if (!eleCopy.operateGuid) {
          eleCopy.operateGuid = this.operatePayData.guid
        }

        eleCopy.guid = ''
        insertList.push(eleCopy)
        sumPay = sumPay + Number(eleCopy.payAmount)
      })
      if (this.noPayAmount < 0) {
        this.$message.error('支付金额超出未支付额度')
        return
      }
      if (flag) {
        this.$message.error('请移除付款金额为0的数据')
        return
      }
      console.log(insertList)
      this.handleHttpMethod(addBatchApi(insertList), true, '正在保存中', true, '信息保存成功').then(res => {
        if (res) {
          this.handleClose()
          this.$emit('onSureClick')
        }
      })
    },
    // 点击选择付款人
    HandleChooseDialogClick() {
      this.defaultSelectedGuids = []
      this.defaultselectedRows = []
      const tableData = this.$refs.vxeTableRef.getTableData().tableData
      if (tableData) {
        tableData.forEach(item => {
          this.defaultSelectedGuids.push(item.payerGuid)
        })
        this.defaultselectedRows = JSON.parse(JSON.stringify(tableData))
      }
      this.showInContainerChoose = true
    },
    // 直接出库选中回调函数
    onSureSelectedClick(selectedRows) {
      console.log(selectedRows)
      this.selectionOperateDatasIn = selectedRows
      this.selectionOperateDatasIn.forEach(item => {
        if (!item.payAmount) {
          this.$set(item, 'payAmount', '0')
        }
      })
    },
    footerMethod({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 2) {
            return '总金额'
          }
          if (['payAmount'].includes(column.field)) {
            return this.sumNum(data, column.field)
          }
          return null
        })
      ]
    },
    sumNum(list, field) {
      let count = 0
      list.forEach(item => {
        count += Number(item[field])
      })
      this.noPayAmount = this.operatePayData.sumAmount - Number(count)
      return Number(count).toFixed(2)
    }
  },
  created() {
    console.log('initCreated...')
  },
  mounted() {
  },
  watch: {
    showIn: {
      handler(nval, oval) {
        if (nval === true) {
        }
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<style lang='scss'>
  .my-label11 {
    background: #E1F3D8 !important;
  }
  .my-content {
    background: #FDE2E2!important;
  }
  .el-descriptions__body {
    color: #2c2c2e;
}
.el-descriptions .is-bordered .el-descriptions-item__cell {
    border: 1px solid #8d8d8d;
    padding: 12px 10px;
}
</style>
