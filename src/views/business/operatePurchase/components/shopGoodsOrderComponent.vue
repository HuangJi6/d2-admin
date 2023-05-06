<template>
  <div v-show="show" width="auto">
    <vxe-modal v-if="show" title="新增下单" v-model="show" :visible.sync="show" show-footer show-zoom resize
    @close="handleClose" width="auto">
      <vxe-toolbar>
        <template #buttons>
          <el-button icon="vxe-icon-star-fill" type="primary" size="mini" style="width:120px" @click="handleChooseGoods">选择下单商品</el-button>
          <span style="margin-left:10px;color:red;">采购商品统称:</span>
          <vxe-input v-model="purGoodsName" style="width:300px" placeholder="将用来识别采购记录,具体商品看采购明细"></vxe-input>
        </template>
      </vxe-toolbar>
      <vxe-table
        class="mytable-scrollbar"
        size="medium"
        header-cell-class-name="headerClassName"
        cell-class-name="cellClassName"
        ref="vxeTableRef"
        border
        style="width:auto;min-height: 500px;"
        resizable
        height="85%"
        show-overflow
        :data="selectionGoodsDatasIn"
        :edit-config="{trigger: 'click', mode: 'cell', showStatus: true}">
        <vxe-column type="checkbox" width="45"></vxe-column>
        <vxe-column type="seq" title="序号" width="60"></vxe-column>
        <vxe-column field="shopName" title="店铺名称" width="150"></vxe-column>
        <vxe-column field="goodsName" title="商品名称" width="280"></vxe-column>
        <vxe-column field="purNumber" title="采购数量" width="150" :edit-render="{autofocus: '.vxe-input--inner'}">
          <template #edit="{ row }">
            <vxe-input v-model="row.purNumber" type="text"></vxe-input>
          </template>
        </vxe-column>
      </vxe-table>
      <template #footer>
        <vxe-button status="primary" @click="handleSubmitCreate">确定</vxe-button>
        <vxe-button @click="handleClose">取消</vxe-button>
      </template>
      <ShopGoodsComponent
        v-if="showGoodsComponent"
        :show.sync="showGoodsComponent"
        @onSureClick="selectedShopGoods"
      ></ShopGoodsComponent>
    </vxe-modal>
  </div>
</template>

<script>
import mixins from '@/mixin/commonMixin.js'
import ShopGoodsComponent from '@/views/business/shopGoods/components/shopGoodsComponent'
import { addBatchApi, updateBatchApi } from '@/api/business/shopGoodsOperateApi.js'
export default {
  mixins: [mixins],
  components: { ShopGoodsComponent },
  name: '',
  props: {
    show: {
      type: Boolean,
      default() {
        return false
      }
    },
    defaultFormDataList: {
      type: Array,
      default() {
        return []
      }
    },
    dialogStatus: {
      type: String,
      default() {
        return ''
      }
    },
    defaultPurGoodsName: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      purGoodsName: this.defaultPurGoodsName,
      selectionGoodsDatasIn: [],
      showIn: this.show,
      showGoodsComponent: false
    }
  },
  methods: {
    handleClose() {
      this.showIn = false
      this.selectionGoodsDatasIn = []
      this.$emit('update:defaultFormDataList', [])
      this.$emit('update:show', false)
    },
    // 提交保存按钮
    handleSubmitCreate() {
      if (!this.selectionGoodsDatasIn) {
        this.$message.warning('数据为空!')
      } else {
        if (this.purGoodsName === '') {
          this.$message.warning('请输入采购商品统称!')
          return
        }
        let flag = false
        this.selectionGoodsDatasIn.forEach(item => {
          item.purGoodsName = this.purGoodsName
          if (item.purNumber === '' || item.purNumber === '0') {
            flag = true
          }
        })
        if (flag) {
          this.$message.warning('存在采购数量为空的数据!')
          return
        }
        this.submitBatchCreate()
      }
    },
    // 批量保存
    submitBatchCreate() {
      if (this.dialogStatus === 'create') {
        this.handleHttpMethod(addBatchApi(this.selectionGoodsDatasIn), true, '正在保存中', true, '信息保存成功').then(res => {
          if (res) {
            this.handleClose()
            this.pageList()
          }
        })
      }
      if (this.dialogStatus === 'update') {
        this.handleHttpMethod(updateBatchApi(this.selectionGoodsDatasIn), true, '正在保存中', true, '信息保存成功').then(res => {
          if (res) {
            this.handleClose()
            this.pageList()
          }
        })
      }
    },
    pageList() {
      this.$emit('onSureClick')
    },
    // 选择商品点击事件,显示商品选择弹框
    handleChooseGoods() {
      this.showGoodsComponent = true
    },
    // 回调函数，选择店铺商品后的回调函数
    selectedShopGoods(shopGoodsInfo) {
      this.selectionGoodsDatasIn = shopGoodsInfo
      this.selectionGoodsDatasIn.forEach(item => {
        this.$set(item, 'purNumber', '')
        this.$set(item, 'shopGoodsGuid', item.guid)
        item.statusCode = '待下单'
        item.guid = ''
      })
    }
  },
  created() {
  },
  mounted() {
  },
  watch: {
    defaultFormDataList: {
      handler(nval, oval) {
        if (nval && !(JSON.stringify(nval) === '[]')) {
          this.selectionGoodsDatasIn = JSON.parse(JSON.stringify(nval))
        }
      },
      immediate: true,
      deep: true
    },
    dialogStatus: {
      handler(nval, oval) {
        this.dialogStatusIn = nval
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
