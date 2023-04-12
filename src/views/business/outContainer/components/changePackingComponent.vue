// 变更箱规组件
<template>
<vxe-modal v-model="showIn" title="变更箱规" :visible.sync="showIn" @close="handleClose" width="60%">
    <vxe-form ref="createFrom" title-width="100" title-align="right" titleColon
      :data="createFormData" :rules="createFromRules" :items="createFormItems"
      @submit="handleSubmitCreate('createFrom')" @reset="handleClose('createFrom')">
        <template #outTime="{ data }">
          <el-date-picker style="width:100%" v-model="data.outTime" type="date" size="small" placeholder="请选择日期" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </template>
    </vxe-form>
  </vxe-modal>
</template>

<script>
import { updateApi } from '@/api/business/outContainerApi.js'
import mixins from '@/mixin/commonMixin.js'
import $Big from '@/libs/big.js'
export default {
  mixins: [mixins],
  components: { },
  name: 'changePackingComponent',
  props: {
    // 显示标识
    show: {
      type: Boolean,
      default() {
        return false
      }
    },
    defaultFormData: {
      type: Object,
      default() {
        return {}
      }
    },
    dialogStatus: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      selectionOperateDatasIn: this.selectionOperateDatas,
      showIn: this.show,
      shopGoodsInfoIn: {},
      createFormData: {
        guid: '',
        packingNo: '',
        limitWeight: '',
        limitVolume: '',
        outTime: '',
        statusCode: '未出'
      },
      createFromRules: {},
      createFormItems: [
        {
          title: '',
          span: 23,
          children: [
            { field: 'packingNo', title: '箱单号', span: 12, itemRender: { name: '$input', props: { disabled: true, placeholder: '请输入箱单号' } } },
            { field: 'shippingMark', title: '箱唛', span: 12, itemRender: { name: '$input', props: { disabled: true, placeholder: '请输入箱唛' } } },
            { field: 'goodsName', title: '商品名称', span: 12, itemRender: { name: '$input', props: { disabled: true, placeholder: '请输入商品名称' } } },
            { field: 'sku', title: 'SKU', span: 12, itemRender: { name: '$input', props: { disabled: true, placeholder: '请输入商品名称' } } },
            { field: 'itemId', title: 'itemId', span: 12, itemRender: { name: '$input', props: { disabled: true, placeholder: '请输入商品名称' } } },
            { field: 'packingBox', title: '箱数', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入出库箱数' } } },
            { field: 'packingOutNumber', title: '装箱数量', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入出库数量' } } },
            { field: 'packingBoxQuantity', title: '单箱数量', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入出库数量' } } },
            { field: 'packingLength', title: '装箱长/CM', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入出库数量' } } },
            { field: 'packingWidth', title: '装箱宽/CM', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入出库数量' } } },
            { field: 'packingHigh', title: '装箱高/CM', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入出库数量' } } },
            { field: 'packingBoxVolume', title: '单箱体积/M', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入出库数量' } } },
            { field: 'packingTotalVolume', title: '总体积/M', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入出库数量' } } },
            { field: 'packingBoxWeight', title: '单箱重量/KG', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入出库数量' } } },
            { field: 'packingTotalWeight', title: '总重量/KG', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入出库数量' } } }
          ]
        },
        {
          align: 'right',
          span: 23,
          itemRender: {
            name: '$buttons',
            children:
              [{ props: { type: 'submit', content: '保存', status: 'primary' } },
                { props: { type: 'reset', content: '取消', status: 'warning' } }]
          }
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
      this.handleHttpMethod(updateApi(this.createFormData.guid, this.createFormData), true, '正在保存中', true, '信息保存成功').then(res => {
        if (res) {
          this.handleClose()
          this.$emit('onSureClick')
        }
      })
    }
  },
  crated() {},
  mounted() {},
  watch: {
    defaultFormData: {
      handler(nval, oval) {
        if (nval && !(JSON.stringify(nval) === '{}')) {
          this.createFormData = Object.assign({}, nval)
        }
      },
      immediate: true,
      deep: true
    },
    'createFormData.packingLength': {
      handler(nval, oval) {
        this.createFormData.packingBoxVolume = new $Big(nval || 0).times(this.createFormData.packingWidth || 0).times(this.createFormData.packingHigh || 0).div(1000000).toFixed(2).toString()
        this.createFormData.packingTotalVolume = new $Big(nval || 0).times(this.createFormData.packingWidth || 0).times(this.createFormData.packingHigh || 0).times(this.createFormData.packingBox || 0).div(1000000).toFixed(2).toString()
      }
    },
    'createFormData.packingWidth': {
      handler(nval, oval) {
        this.createFormData.packingBoxVolume = new $Big(nval || 0).times(this.createFormData.packingLength || 0).times(this.createFormData.packingHigh || 0).div(1000000).toFixed(2).toString()
        this.createFormData.packingTotalVolume = new $Big(nval || 0).times(this.createFormData.packingLength || 0).times(this.createFormData.packingHigh || 0).times(this.createFormData.packingBox || 0).div(1000000).toFixed(2).toString()
      }
    },
    'createFormData.packingHigh': {
      handler(nval, oval) {
        this.createFormData.packingBoxVolume = new $Big(nval || 0).times(this.createFormData.packingLength || 0).times(this.createFormData.packingWidth || 0).div(1000000).toFixed(2).toString()
        this.createFormData.packingTotalVolume = new $Big(nval || 0).times(this.createFormData.packingLength || 0).times(this.createFormData.packingWidth || 0).times(this.createFormData.packingBox || 0).div(1000000).toFixed(2).toString()
      }
    },
    'createFormData.packingBoxWeight': {
      handler(nval, oval) {
        this.createFormData.packingTotalWeight = new $Big(nval || 0).times(this.createFormData.packingBox || 0).toString()
      }
    }
  }
}
</script>

<style lang='scss'>
</style>
