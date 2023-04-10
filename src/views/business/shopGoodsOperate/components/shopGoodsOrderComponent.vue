<template>
  <div v-show="show" width="40%">
    <vxe-modal v-if="show" title="新增数据页面" v-model="show" :visible.sync="show"
    @close="handleClose" width="40%">
      <vxe-form ref="createFrom" title-width="100" title-align="right" titleColon
      :data="createFormData" :items="createForm" :rules="createFromRules"
      @submit="handleSubmitCreate('createFrom')" @reset="handleClose('createFrom')">
        <template #shopGoodsSlot="{ data }">
          <span> {{ data.goodsName }}  </span>
          <vxe-button status="primary" content="选择店铺商品"  @click="handleChooseGoods(data)"></vxe-button>
        </template>
      </vxe-form>
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
import { updateApi, addApi } from '@/api/business/shopGoodsOperateApi.js'
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
      showIn: this.show,
      showGoodsComponent: false,
      createFormData: {
        shopGoodsGuid: '',
        clientId: '',
        goodsName: '',
        goodsGuid: '',
        statusCode: '待下单',
        purNumber: ''
      },
      createForm: [
        {
          title: '',
          span: 23,
          children: [
            { field: 'goodsName', title: '店铺商品', span: 12, slots: { default: 'shopGoodsSlot' } },
            { field: 'purNumber', title: '采购数量', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入采购数量' } } }

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
      ],
      createFromRules: {
        goodsName: [
          { required: true, message: '请选择商品', trigger: 'blur' }
        ],
        purNumber: [
          { required: true, message: '请输入采购数量', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleClose() {
      this.showIn = false
      this.resetCreateForm()
      this.$emit('update:show', false)
    },
    // 提交保存按钮
    handleSubmitCreate(formName) {
      this.submitCreate(formName)
    },
    submitCreate(formName) {
      const refs = this.$refs
      refs[formName].validate().then((valid) => {
        if (!valid) {
          if (this.dialogStatus === 'create') {
            this.handleHttpMethod(addApi(this.createFormData), true, '正在保存中', true, '信息保存成功').then(res => {
              if (res) {
                this.handleClose()
                this.pageList()
              }
            })
          }
          if (this.dialogStatus === 'update') {
            this.handleHttpMethod(updateApi(this.createFormData.guid, this.createFormData), true, '正在保存中', true, '信息保存成功').then(res => {
              if (res) {
                this.handleClose()
                this.pageList()
              }
            })
          }
        }
      })
    },
    // 重置表单数据
    resetCreateForm() {
      this.createFormData = {
        shopGoodsGuid: '',
        clientId: '',
        goodsName: '',
        goodsGuid: '',
        statusCode: '待下单',
        purNumber: ''
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
      this.createFormData.shopGoodsGuid = shopGoodsInfo.guid
      this.createFormData.goodsGuid = shopGoodsInfo.goodsGuid
      this.createFormData.clientId = shopGoodsInfo.clientId
      this.createFormData.goodsName = shopGoodsInfo.goodsName
    }
  },
  created() {
  },
  mounted() {
  },
  watch: {
    defaultFormData: {
      handler(nval, oval) {
        if (nval && !(JSON.stringify(nval) === '{}')) {
          this.createFormData = Object.assign({}, nval)
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
