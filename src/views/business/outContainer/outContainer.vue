<template>
  <d2-container>
    <template slot="header">
      <div style="float:left;padding-top:3px">
        <el-radio-group @input="pageList()" v-model="filterFormData.statusCode" size="medium">
          <el-radio-button label="已入库" @click="pageOperateList()">已入库</el-radio-button>
          <el-radio-button label="待重新装箱" @click="pageList()">待重新装箱</el-radio-button>
          <el-radio-button label="已出库" @click="pageOperateList()">已出库</el-radio-button>
        </el-radio-group>
      </div>
      <div style="float:right;" v-if="filterFormData.statusCode === '已入库'" >
        <el-button icon="vxe-icon-square-plus" size="medium" @click="handleAddPackingList">添加箱单</el-button>
        <el-button  size="medium" style="width:100px" @click="pageList()">刷新</el-button>
      </div>
      <div style="float:right;" v-if="filterFormData.statusCode === '待重新装箱'" >
        <el-button icon="vxe-icon-square-plus" size="medium" @click="handleBeforeCheck">添加箱单</el-button>
        <el-button size="medium" style="width:100px" @click="pageList()">刷新</el-button>
      </div>
    </template>

    <div v-if="filterFormData.statusCode==='待重新装箱'" style="height: 100%;">
      <SplitPane :min-percent='15' :max-percent='15' :default-percent='15' split="vertical">
        <template slot="paneL"><div style="margin: 10px;">左</div></template>
        <template slot="paneR">
          <div style="margin: 10px;">右上</div>
        </template>
      </SplitPane>
    </div>
    <AddPackingListFormDialogVue
      v-if="showAddPackingListFormDialog"
      :show.sync="showAddPackingListFormDialog">
    </AddPackingListFormDialogVue>
  </d2-container>
</template>

<script>
import Vue from 'vue'
import SplitPane from 'vue-splitpane'
import { myMethods } from './js/outContainerMethod.js'
import AddPackingListFormDialogVue from '@/views/business/packingList/components/addPackingListFormDialog.vue'
Vue.component('SplitPane', SplitPane)
export default {
  components: { AddPackingListFormDialogVue },
  mounted () {
    // 加载完成后显示提示
    this.showInfo()
  },
  data() {
    return {
      showAddPackingListFormDialog: false,
      filterFormData: {
        statusCode: '已入库'
      }
    }
  },
  methods: {
    ...myMethods,
    // 显示提示
    showInfo () {
      // this.$notify({
      //   title: '提示',
      //   message: '在横向或者纵向的分割线上拖拽调整分区大小'
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
.d2-container-full__body {
  margin: 0px
}
</style>
