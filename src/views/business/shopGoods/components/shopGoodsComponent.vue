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
    <ShopGoodsVue ref="shopGoodsVue"></ShopGoodsVue>
  </vxe-modal>
</template>

<script>
import mixins from '@/mixin/commonMixin.js'
import ShopGoodsVue from '../shopGoods.vue'
export default {
  mixins: [mixins],
  components: { ShopGoodsVue },
  name: 'ShopGoodComponent',
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
      shopGoodsInfoIn: []
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
      if (!rows) {
        this.$message.warning('请选择一条以上数据')
      } else {
        this.shopGoodsInfoIn = rows
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
