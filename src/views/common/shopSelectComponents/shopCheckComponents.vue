<template>
  <vxe-select clearable style="width:150px" v-model="shop" multiple placeholder="选择店铺" prefix-icon="vxe-icon-question-circle-fill">
    <vxe-option v-for="ele in applicationData" :key="ele.clientId" :value="ele.clientId" :label="`${ele.shopName}`"></vxe-option>
  </vxe-select>
</template>

<script>
import store from '@/store'
import mixins from '@/mixin/commonMixin.js'
import { getAllApplication } from '@/api/business/applicationApi.js'
export default {
  mixins: [mixins],
  name: 'ShopCheckComponents',
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
      shop: null,
      applicationData: []
    }
  },
  methods: {
    // 确定
    setCheckedShop(nval) {
      store.dispatch('d2admin/shopCheck/setCheckShop', nval)
      console.log(store.state.d2admin.shopCheck.checkedClientIds)
    }
  },
  created() {
    this.handleHttpMethod(getAllApplication(), true, '请求中...').then(res => {
      this.applicationData = res.data
      console.log(this.applicationData)
    })
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
