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
    <vxe-column type="checkbox" width="60"></vxe-column>
    <vxe-column type="seq" title="序号" width="60"></vxe-column>
    <vxe-column field="shopName" title="店铺名称" width="150"></vxe-column>
    <vxe-column field="goodsName" title="中文品名" width="150" :edit-render="{autofocus: '.vxe-input--inner'}">
      <template #edit="{ row }">
        <vxe-input v-model="row.goodsName" type="text"></vxe-input>
      </template>
    </vxe-column>
    <vxe-column field="shippingMark" title="箱唛编号" width="150"></vxe-column>
    <vxe-column field="ctnNo" title="制造商编号" width="120" :edit-render="{autofocus: '.vxe-input--inner'}">
      <template #edit="{ row }">
        <vxe-input v-model="row.ctnNo" type="text"></vxe-input>
      </template>
    </vxe-column>
    <vxe-column field="purNumber" title="库存数量" width="100"></vxe-column>
    <vxe-column field="totalBox" title="总箱数" width="100"></vxe-column>
    <vxe-column field="boxQuantity" title="单箱数量" width="100"></vxe-column>
    <vxe-column field="packingBox" title="出库箱数" width="100" :edit-render="{autofocus: '.vxe-input--inner'}">
      <template #edit="{ row }">
        <vxe-input v-model="row.packingBox" type="text" @change="packingBoxChange(row)"></vxe-input>
      </template>
    </vxe-column>
    <vxe-column field="outNumber" title="出库数量" width="100">
      <template #edit="{ row }">
        <vxe-input v-model="row.outNumber" type="text"></vxe-input>
      </template>
    </vxe-column>
  </vxe-table>
  <InContainerChooseComponentVue
    v-if="showInContainerChoose"
    :show.sync="showInContainerChoose"
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
  name: 'InContainerComponent',
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
      showIn: this.show,
      shopGoodsInfoIn: {},
      createFormData: {
        packingGuid: '',
        inContainerGuid: '',
        operateGuid: '',
        outNumber: '',
        outTime: '',
        isRepacking: '',
        packingLenhth: '',
        packingWidth: '',
        packingHigh: '',
        packingVolume: '',
        packingWeight: '',
        goodsName: '',
        goodsNameE: '',
        shopName: '',
        shippingMark: '',
        packingNo: '',
        packingBox: '',
        ctnNo: ''
      },
      createFromRules: {},
      createFormItems: [
        {
          title: '',
          span: 23,
          children: [
            // { field: 'shopName', title: '店铺名称', span: 12, itemRender: { name: '$input', props: { disabled: true, placeholder: '请输入单箱重称重' } } },
            // { field: 'shippingMark', title: '箱唛', span: 12, itemRender: { name: '$input', disabled: true, props: { disabled: true, placeholder: '请输入单箱重称重' } } },
            // { field: 'goodsName', title: '中文品名', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入单箱重称重' } } },
            // { field: 'goodsNameE', title: 'Goods Name', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入单箱重称重' } } },
            { field: 'packingGuid', title: '箱单号', span: 12, itemRender: { name: '$select', props: { placeholder: '请输入单箱重称重' } } }
            // { field: 'ctnNo', title: '制造商编号', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入出库箱数' } } },
            // { field: 'boxQuantity', title: '总箱数', span: 12, itemRender: { name: '$input', props: { disabled: true, placeholder: '请输入出库箱数' } } },
            // { field: 'packingBox', title: '出库箱数', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入出库箱数' } } }
          ]
        }
        // {
        //   align: 'right',
        //   span: 23,
        //   itemRender: {
        //     name: '$buttons',
        //     children:
        //       [{ props: { type: 'submit', content: '保存', status: 'primary' } },
        //         { props: { type: 'reset', content: '取消', status: 'warning' } }]
        //   }
        // }
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
      this.selectionOperateDatasIn.forEach(ele => {
        const eleCopy = Object.assign({}, ele)
        eleCopy.guid = ''
        eleCopy.packingGuid = this.createFormData.packingGuid
        eleCopy.inContainerGuid = ele.guid
        eleCopy.isRepacking = '否'
        insertList.push(eleCopy)
      })
      this.handleHttpMethod(addBatchApi(insertList), true, '正在保存中', true, '信息保存成功').then(res => {
        if (res) {
          this.dialogFormVisible = false
          this.pageList()
        }
      })
    },
    // 点击选择商品
    HandleChooseDialogClick() {
      this.showInContainerChoose = true
    },
    // 直接出库选中回调函数
    onSureSelectedClick(selectedRows) {
      console.log(selectedRows)
      this.selectionOperateDatasIn = selectedRows
      // 直接选择默认出库箱数以及制造商编号等
      this.selectionOperateDatasIn.forEach(item => {
        item.ctnNo = item.totalBox
        item.ctnNo = item.totalBox
      })
    },
    packingBoxChange(row) {
      console.log(row)
      row.outNumber = row.packingBox * row.boxQuantity
    }
  },
  crated() {
    console.log('initCreated...')
    this.handleHttpMethod(getUnOutPackingList(), true, '请求中...').then(res => {
      this.createFormItems.children.array.forEach(element => {
        if (element.field === 'packingNo') {
          this.$set(element.itemRender, 'options', res.data)
        }
      })
    })
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
    'createFormData.packingNo': {
      handler(nval, oval) {
        if (nval) {
          this.unOutPackingList.forEach(ele => {
            if (ele.lable === nval) {
              this.createFormData.packingGuid = ele.guid
            }
          })
        }
      }
    },
    'createFormData.packingBox': {
      handler(nval, oval) {
        if (nval) {
          debugger
          this.createFormData.outNumber = this.createFormData.packingBox * this.createFormData.boxQuantity
        }
      }
    }
  }
}
</script>

<style lang='scss'>
</style>
