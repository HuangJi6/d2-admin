// toolBar箱单汇总功能
<template>
  <div style="margin:auto;width:800px;border:10px;solid:#000;">
    <vxe-select clearable  size="mini" style="width:150px;margin-left:10px" v-model="packingChoosedValue" placeholder="选择箱单" prefix-icon="vxe-icon-question-circle-fill">
      <vxe-option v-for="ele in unOutPackingList" :key="ele.guid" :value="ele.guid" :label="`${ele.packingNo}`"></vxe-option>
    </vxe-select>
    当前箱单号: <b style="color:#F56C6C;font-size:18px;width:100px;">{{this.packingData.packingNo}}</b> 总体积: <b style="color:#F56C6C;font-size:18px">{{this.packingData.packingTotalVolume}}</b> m³
    总重量: <b style="color:#F56C6C;font-size:18px">{{this.packingData.packingTotalVolume}}</b> kg 总箱数: <b style="color:#F56C6C;font-size:18px">{{this.packingData.packingTotalBox}}</b>
  </div>
</template>
<script>
import mixins from '@/mixin/commonMixin.js'
import { getUnOutPackingList } from '@/api/business/packingListApi.js'
import { outContainerGroup } from '@/api/business/outContainerApi'
export default {
  mixins: [mixins],
  name: 'packingListTopGatherComponent',
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
      packingChoosedValue: '',
      unOutPackingList: [],
      packingData: {
        packingNo: '-',
        packingTotalVolume: '-',
        packingTotalWeight: '-',
        goodsTotalAmount: '-',
        packingTotalBox: '-'
      }

    }
  },
  methods: {
    // 更新汇总
    refreshContainerGroup() {
      this.sendOutContainerGroup({ packingGuid: this.packingChoosedValue })
    },
    // 发送请求
    sendOutContainerGroup(params) {
      this.handleHttpMethod(outContainerGroup(params), true, '请求中...').then(res => {
        if (res && res.data && res.data.length > 0) {
          this.packingData = Object.assign(this.packingData, res.data[0])
        } else {
          this.packingData = {
            packingNo: '-',
            packingTotalVolume: '-',
            packingTotalWeight: '-',
            goodsTotalAmount: '-',
            packingTotalBox: '-'
          }
        }
      })
    }
  },
  created() {
    this.handleHttpMethod(getUnOutPackingList(), true, '请求中...').then(res => {
      this.unOutPackingList = res.data
      if (this.unOutPackingList && this.unOutPackingList.length > 0) {
        this.packingChoosedValue = this.unOutPackingList[0].guid
      }
    })
  },
  mounted() {

  },
  watch: {
    packingChoosedValue: {
      handler(nval, oval) {
        if (nval) {
          this.$emit('onChangePackingList', nval)
          this.sendOutContainerGroup({ packingGuid: nval })
        }
      }
    }
  }
}
</script>
