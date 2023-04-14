<template>
  <vxe-modal v-model="showIn" width="50%" height="50%" title="装箱确认" show-footer show-close @hide="handleClose">
    <template #footer>
      <vxe-button status="primary" @click="onSure">确定</vxe-button>
      <vxe-button @click="handleClose">取消</vxe-button>
    </template>
    <div>
      确定装箱箱唛:<br>
      <div style="color:#F56C6C;font-weight:20px;font-size:18px;word-break:break-all;"><strong>{{JSON.stringify(this.shippingMarks)}}</strong></div>
    </div>
  </vxe-modal>
</template>
<script>
import mixins from '@/mixin/commonMixin.js'
import { insertByOutContainer } from '@/api/business/shippingMarkApi.js'
export default {
  mixins: [mixins],
  name: 'encasementShippingMarkComponent',
  props: {
    show: {
      type: Boolean,
      default() {
        return false
      }
    },
    shippingMarks: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      showIn: this.show
    }
  },
  methods: {
    // 方法
    handleClose() {
      this.showIn = false
      this.$emit('update:show', false)
      this.$emit('update:shippingMarks', [])
    },
    onSure() {
      this.handleHttpMethod(insertByOutContainer({ shippingMarks: this.shippingMarks }), true, '装箱中...', true, '装箱成功').then(res => {
        this.handleClose()
        this.$emit('onSureClick')
      })
    }
  },
  created() {},
  mounted() {},
  watch: {}
}
</script>
