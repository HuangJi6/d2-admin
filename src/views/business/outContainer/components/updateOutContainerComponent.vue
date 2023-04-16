// 入库组件
<template>
<vxe-modal v-model="showIn" title="更新出库信息" :visible.sync="showIn" @close="handleClose" width="60%">
    <vxe-form ref="createFrom" title-width="120" title-align="right" titleColon
      :data="createFormData" :rules="createFromRules" :items="createFormItems"
      @submit="handleSubmitCreate('createFrom')" @reset="handleCancelCreate('createFrom')">
        <template #outTime="{ data }">
          <el-date-picker style="width:100%" v-model="data.outTime" type="date" size="small" placeholder="请选择日期" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </template>
    </vxe-form>
  </vxe-modal>
</template>

<script>
import { updateApi } from '@/api/business/outContainerApi.js'
import mixins from '@/mixin/commonMixin.js'
export default {
  mixins: [mixins],
  components: { },
  name: 'updateOutContainerComponent',
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
            { field: 'shippingMark', title: '箱唛', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入箱唛' } } },
            { field: 'ctnNo', title: '制造商编号', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入制造商编号' } } },
            { field: 'packingBox', title: '出库箱数', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入出库箱数' } } },
            { field: 'packingOutNumber', title: '出库数量', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入出库数量' } } },
            { field: 'isRepacking', title: '是否变更箱规', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入是否重新装箱' } } }
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
    }
  }
}
</script>

<style lang='scss'>
</style>
