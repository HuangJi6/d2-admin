<template>
  <vxe-select size="small" clearable style="width:150px;margin-right:10px" v-model="shop" placeholder="选择店铺" prefix-icon="vxe-icon-question-circle-fill">
    <vxe-option v-for="ele in applicationData" :key="ele.clientId" :value="ele.clientId" :label="`${ele.shopName}`"></vxe-option>
  </vxe-select>
</template>

<script>
import store from '@/store'
import mixins from '@/mixin/commonMixin.js'
export default {
  mixins: [mixins],
  name: 'shopFilterSelectComponet',
  props: {
    show: {
      type: Boolean,
      default() {
        return false
      }
    },
    bindShop: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      showIn: this.show,
      shop: this.bindShop,
      applicationData: []
    }
  },
  methods: {
    // 确定
    setCheckedShop(nval) {
      this.$emit('update:bindShop', nval)
      this.$emit('shopChange', nval)
      console.log(nval)
    }
  },
  created() {
    this.applicationData = store.state.d2admin.shopCheck.allClientInfos
  },
  mounted() {
  },
  watch: {
    shop: {
      handler(nval, oval) {
        this.setCheckedShop(nval)
      }
    }
  }
}
</script>
