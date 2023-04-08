<template>
  <div>

  </div>
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
      showIn: this.show,
      shop: null,
      applicationData: []
    }
  },
  methods: {
  },
  created() {
  },
  mounted() {
  },
  watch: {
  }
}
</script>
