// 变更箱规组件
<template>
<vxe-modal v-model="showIn" title="变更箱规" :visible.sync="showIn" @close="handleClose" width="60%">
    <vxe-form ref="createFrom" title-width="120" title-align="right" titleColon
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
      createFromRules: {
        packingNo: [
          { required: true, message: '请输入商名称', trigger: 'blur' }
        ],
        shippingMark: [
          { required: true, message: '请输入商品类别', trigger: 'blur' }
        ],
        goodsName: [
          { required: true, message: '请输入商品类别', trigger: 'blur' }
        ],
        sku: [
          { required: true, message: '请输入商品类别', trigger: 'blur' }
        ],
        itemId: [
          { required: true, message: '请输入商品类别', trigger: 'blur' }
        ],
        packingBox: [
          { required: true, message: '请输入商品类别', trigger: 'blur' }
        ],
        packingOutNumber: [
          { required: true, message: '请输入商品类别', trigger: 'blur' }
        ],
        packingBoxQuantity: [
          { required: true, message: '请输入商品类别', trigger: 'blur' }
        ],
        packingLength: [
          { required: true, message: '请输入商品类别', trigger: 'blur' }
        ],
        packingWidth: [
          { required: true, message: '请输入商品类别', trigger: 'blur' }
        ],
        packingHigh: [
          { required: true, message: '请输入商品类别', trigger: 'blur' }
        ],
        packingBoxVolume: [
          { required: true, message: '请输入商品类别', trigger: 'blur' }
        ],
        packingTotalVolume: [
          { required: true, message: '请输入商品类别', trigger: 'blur' }
        ],
        packingBoxWeight: [
          { required: true, message: '请输入商品类别', trigger: 'blur' }
        ],
        packingTotalWeight: [
          { required: true, message: '请输入商品类别', trigger: 'blur' }
        ]
      },
      createFormItems: [
        {
          title: '',
          span: 23,
          children: [
            { field: 'packingNo', title: '箱单号', span: 12, itemRender: { name: '$input', props: { disabled: true, placeholder: '请输入箱单号' } } },
            { field: 'shippingMark', title: '箱唛', span: 12, itemRender: { name: '$input', props: { disabled: true, placeholder: '请输入箱唛' } } },
            { field: 'goodsName', title: '商品名称', span: 12, itemRender: { name: '$input', props: { disabled: true, placeholder: '请输入商品名称' } } },
            { field: 'sku', title: 'SKU', span: 12, itemRender: { name: '$input', props: { disabled: true, placeholder: '请输入SKU' } } },
            { field: 'itemId', title: 'itemId', span: 12, itemRender: { name: '$input', props: { disabled: true, placeholder: '请输入itemId' } } },
            { field: 'packingBox', title: '箱数', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入出库箱数' } } },
            { field: 'packingOutNumber', title: '出库数量', span: 12, itemRender: { name: '$input', props: { placeholder: '出库数量,需要出多少数量的货物' } } },
            { field: 'packingBoxQuantity', title: '单箱数量', span: 12, itemRender: { name: '$input', props: { placeholder: '每箱能装多少数量的货物' } } },
            { field: 'packingLength', title: '装箱长/CM', span: 12, itemRender: { name: '$input', props: { placeholder: '装箱长，更改箱规后箱子的长' } } },
            { field: 'packingWidth', title: '装箱宽/CM', span: 12, itemRender: { name: '$input', props: { placeholder: '装箱宽，更改箱规后箱子的宽' } } },
            { field: 'packingHigh', title: '装箱高/CM', span: 12, itemRender: { name: '$input', props: { placeholder: '装箱高，更改箱规后箱子的高' } } },
            { field: 'packingBoxVolume', title: '单箱体积/m³', span: 12, itemRender: { name: '$input', props: { placeholder: '单箱体积，更改箱规后箱子的高' } } },
            { field: 'packingTotalVolume', title: '总体积/m³', span: 12, itemRender: { name: '$input', props: { placeholder: '总体积，更改箱规后箱子占的总体积' } } },
            { field: 'packingBoxWeight', title: '单箱重量/KG', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入单箱重量' } } },
            { field: 'packingTotalWeight', title: '总重量/KG', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入总重量' } } }
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
        this.createFormData.packingBoxVolume = new $Big(nval || 0).times(this.createFormData.packingWidth || 0).times(this.createFormData.packingHigh || 0).div(1000000).toFixed(4).toString()
        this.createFormData.packingTotalVolume = new $Big(nval || 0).times(this.createFormData.packingWidth || 0).times(this.createFormData.packingHigh || 0).times(this.createFormData.packingBox || 0).div(1000000).toFixed(4).toString()
      }
    },
    'createFormData.packingWidth': {
      handler(nval, oval) {
        this.createFormData.packingBoxVolume = new $Big(nval || 0).times(this.createFormData.packingLength || 0).times(this.createFormData.packingHigh || 0).div(1000000).toFixed(4).toString()
        this.createFormData.packingTotalVolume = new $Big(nval || 0).times(this.createFormData.packingLength || 0).times(this.createFormData.packingHigh || 0).times(this.createFormData.packingBox || 0).div(1000000).toFixed(4).toString()
      }
    },
    'createFormData.packingHigh': {
      handler(nval, oval) {
        this.createFormData.packingBoxVolume = new $Big(nval || 0).times(this.createFormData.packingLength || 0).times(this.createFormData.packingWidth || 0).div(1000000).toFixed(4).toString()
        this.createFormData.packingTotalVolume = new $Big(nval || 0).times(this.createFormData.packingLength || 0).times(this.createFormData.packingWidth || 0).times(this.createFormData.packingBox || 0).div(1000000).toFixed(4).toString()
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
