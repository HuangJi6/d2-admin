// 直接出库管理
<template>
<vxe-modal v-model="showIn" title="直接出库"
      @close="handleClose" width="80%" show-footer show-zoom resize>
  <template #footer>
    <vxe-button status="primary" @click="handleSubmitCreate">确定</vxe-button>
    <vxe-button @click="handleClose">取消</vxe-button>
  </template>
  <vxe-form ref="createFrom" title-width="" title-align="right" titleColon
    :data="createFormData" :rules="createFromRules" :items="createFormItems">
  </vxe-form>
  <vxe-toolbar>
    <template #buttons>
      <el-button icon="vxe-icon-chart-pie" size="mini" style="width:120px" @click="HandleChooseDialogClick">选择出库商品</el-button>
    </template>
  </vxe-toolbar>
  <vxe-table
    class="mytable-scrollbar"
    size="medium"
    header-cell-class-name="headerClassName"
    cell-class-name="cellClassName"
    border
    style="width:auto;min-height: 500px;"
    resizable
    height="80%"
    show-overflow
    :data="selectionOperateDatasIn"
    :edit-config="{trigger: 'click', mode: 'cell', showStatus: true}">
    <vxe-column type="checkbox" width="45"></vxe-column>
    <vxe-column type="seq" title="序号" width="60"></vxe-column>
    <vxe-column field="shopName" title="店铺名称" width="150"></vxe-column>
    <vxe-column field="goodsName" title="中文品名" width="150"></vxe-column>
    <vxe-column field="shippingMark" title="箱唛编号" width="150"></vxe-column>
    <vxe-column field="purNumber" title="库存数量" width="100"></vxe-column>
    <vxe-column field="totalBox" title="总箱数" width="100"></vxe-column>
    <vxe-column field="boxQuantity" title="单箱数量" width="100"></vxe-column>
    <vxe-column field="packingBox" title="出库箱数" width="100">
    </vxe-column>
    <vxe-column field="packingOutNumber" title="出库数量" width="100">
      <!-- <template #edit="{ row }">
        <vxe-input v-model="row.outNumber" type="text"></vxe-input>
      </template> -->
    </vxe-column>
    <vxe-column field="ctnNo" title="制造商编号" width="140" :edit-render="{autofocus: '.vxe-input--inner'}">
      <template #edit="{ row }">
        <vxe-input v-model="row.ctnNo" type="text"></vxe-input>
      </template>
    </vxe-column>
  </vxe-table>
  <InContainerChooseComponentVue
    v-if="showInContainerChoose"
    :show.sync="showInContainerChoose"
    :defaultSelectedGuids="defaultSelectedGuids"
    @onSureClick="onSureSelectedClick">
  </InContainerChooseComponentVue>
</vxe-modal>
</template>

<script>
import { getUnOutPackingList } from '@/api/business/packingListApi.js'
import { addBatchApi } from '@/api/business/outContainerApi.js'
import mixins from '@/mixin/commonMixin.js'
import InContainerChooseComponentVue from '../../inContainer/components/inContainerChooseComponent.vue'
export default {
  mixins: [mixins],
  components: { InContainerChooseComponentVue },
  name: 'directOutContainerComponent',
  props: {
    // 显示标识
    show: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      showInContainerChoose: false,
      unOutPackingList: [],
      selectionOperateDatasIn: this.selectionOperateDatas,
      defaultSelectedGuids: [],
      showIn: this.show,
      shopGoodsInfoIn: {},
      createFormData: {
        packingGuid: '',
        packingNo: ''
      },
      createFromRules: {},
      createFormItems: [
        {
          title: '',
          span: 23,
          children: [
            { field: 'packingGuid', title: '箱单号', span: 12, itemRender: { name: '$select', props: { placeholder: '请选择箱单' } } }
          ]
        }
      ]
    }
  },
  methods: {
    // 方法
    handleClose() {
      this.showIn = false
      this.$emit('update:show', false)
    },
    // 保存接口
    handleSubmitCreate() {
      const insertList = []
      debugger
      this.selectionOperateDatasIn.forEach(ele => {
        const eleCopy = Object.assign({}, ele)
        eleCopy.guid = ''
        eleCopy.packingNo = this.createFormData.packingNo
        eleCopy.packingGuid = this.createFormData.packingGuid
        eleCopy.packingBox = ele.totalBox
        eleCopy.packingBoxQuantity = ele.boxQuantity
        eleCopy.packingLength = ele.remeasureLength
        eleCopy.packingWidth = ele.remeasureWidth
        eleCopy.packingHigh = ele.remeasureHigh
        eleCopy.packingBoxVolume = ele.remeasureVolume
        eleCopy.packingTotalVolume = ele.remeasureTotalVolume
        eleCopy.packingBoxWeight = ele.remeasureWeight
        eleCopy.packingTotalWeight = ele.remeasureTotalWeight
        eleCopy.inContainerGuid = ele.guid
        eleCopy.isRepacking = '否'
        insertList.push(eleCopy)
      })
      this.handleHttpMethod(addBatchApi(insertList), true, '正在保存中', true, '信息保存成功').then(res => {
        if (res) {
          this.handleClose()
          this.$emit('onSureClick')
        }
      })
    },
    // 点击选择商品
    HandleChooseDialogClick() {
      // 判断是否选择了箱单数据
      if (this.createFormData.packingGuid && this.createFormData.packingGuid !== '') {
        this.showInContainerChoose = true
      } else {
        this.$message.warning('请先选择箱单')
      }
    },
    // 直接出库选中回调函数
    onSureSelectedClick(selectedRows) {
      console.log(selectedRows)
      this.selectionOperateDatasIn = selectedRows
      // 直接选择默认出库箱数以及制造商编号等
      this.selectionOperateDatasIn.forEach(item => {
        item.ctnNo = `1-${item.totalBox}`
        this.$set(item, 'packingBox', item.totalBox)
        this.$set(item, 'packingOutNumber', item.purNumber)
      })
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
          this.isRepacking = '否'
          this.handleHttpMethod(getUnOutPackingList(), true, '请求中...').then(res => {
            this.unOutPackingList = res.data
            this.createFormItems[0].children.forEach(element => {
              if (element.field === 'packingGuid') {
                this.$set(element.itemRender, 'options', res.data)
              }
            })
          })
        }
      },
      immediate: true,
      deep: true
    },
    'createFormData.packingGuid': {
      handler(nval, oval) {
        if (nval) {
          this.unOutPackingList.forEach(ele => {
            if (ele.value === nval) {
              this.createFormData.packingNo = ele.packingNo
            }
          })
        }
      }
    }
  }
}
</script>

<style lang='scss'>
</style>
