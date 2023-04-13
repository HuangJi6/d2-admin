<template>
  <vxe-modal  v-model="showIn" title="选择出库商品" show-footer show-close @hide="handleClose">
    <template #footer>
      <vxe-button status="primary" @click="onSure">确定</vxe-button>
      <vxe-button @click="handleClose">取消</vxe-button>
    </template>
  </vxe-modal>
</template>

<script>
import mixins from '@/mixin/commonMixin.js'
export default {
  mixins: [mixins],
  name: '',
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
      showIn: this.show
    }
  },
  methods: {
    handleClose() {
      this.showIn = false
      this.$emit('update:show', false)
    },
    onSure() {

    }
  },
  created() {
  },
  mounted() {
  },
  watch: {
  }
}
</script>
