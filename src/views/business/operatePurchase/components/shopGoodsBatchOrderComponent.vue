<template>
  <div v-show="show" width="auto">
    <vxe-modal v-if="show" title="批量下单" v-model="show" :visible.sync="show" show-footer show-zoom resize
    @close="handleClose" width="85%" height="700px">
      <vxe-form ref="createFrom" title-width="150" title-align="right" titleColon
      :data="createFormData" :items="createForm" :rules="createFromRules" style="height:30%;">
        <template #supplierGuidSlot="{ data }">
          <vxe-select v-model="data.supplierGuid" placeholder="可搜索" :options="supplierSelectData" filterable @change="supplierChange"></vxe-select>
        </template>
        <template #shopGoodsSlot="{ data }">
          <span> {{ data.goodsName }}  </span>
          <!-- <vxe-button status="primary" content="选择店铺商品"  @click="handleChooseGoods(data)"></vxe-button> -->
        </template>
        <template #purTimeSlot="{ data }">
          <el-date-picker style="width:100%" v-model="data.purTime" type="date" size="small" placeholder="请选择日期" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </template>
        <template #completeTimeSlot="{data}">
          <el-date-picker style="width:100%" v-model="data.completeTime" type="date" size="small" placeholder="供应商做完后请选择交货日期" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </template>
      </vxe-form>
      <vxe-table
        class="mytable-scrollbar"
        size="medium"
        header-cell-class-name="headerClassName"
        cell-class-name="cellClassName"
        ref="vxeTableRef"
        border
        style="width:auto;min-height: 400px;"
        resizable
        height="65%"
        show-overflow
        keep-source
        :data="selectionGoodsDatasIn"
        :edit-rules="editTableRules"
        :edit-config="{trigger: 'click', mode: 'cell', showStatus: true}">
        <vxe-column type="seq" title="序号" width="60"></vxe-column>
        <vxe-column field="goodsName" title="商品名称" width="250"></vxe-column>
        <vxe-column field="purNumber" title="采购数量" width="100"></vxe-column>
        <vxe-column field="boxQuantity" title="单箱产品数" width="120"></vxe-column>
        <vxe-column field="totalBox" title="总箱数" width="80"></vxe-column>
        <vxe-column field="boxVolume" title="单箱体积/m³" width="120"></vxe-column>
        <vxe-column field="purVolume" title="采购体积/m³" width="120"></vxe-column>
        <vxe-column field="purUnitPrice" title="采购单价" width="130" :edit-render="{autofocus: '.vxe-input--inner'}" :formatter="formatterAmount">
          <template #edit="{ row }">
            <vxe-input v-model="row.purUnitPrice" type="float" @change="purUnitPriceChange(row)"></vxe-input>
          </template>
        </vxe-column>
        <vxe-column field="purAmount" title="采购金额" width="110" :formatter="formatterAmount"></vxe-column>
        <vxe-column field="shipAmount" title="其他费用" width="130" :edit-render="{autofocus: '.vxe-input--inner'}" :formatter="formatterAmount">
          <template #edit="{ row }">
            <vxe-input v-model="row.shipAmount" type="float" @change="shipAmountChange(row)"></vxe-input>
          </template>
        </vxe-column>
        <vxe-column field="sumAmount" title="采购总额" width="130" :formatter="formatterAmount"></vxe-column>
        <vxe-column field="shippingMark" title="箱唛" width="120" :edit-render="{autofocus: '.vxe-input--inner'}">
          <template #edit="{ row }">
            <vxe-input v-model="row.shippingMark" type="text"></vxe-input>
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
import $Big from '@/libs/big.js'
import ShopGoodsComponent from '@/views/business/shopGoods/components/shopGoodsComponent'
import { updateBatchApi } from '@/api/business/shopGoodsOperateApi.js'
export default {
  mixins: [mixins],
  components: { ShopGoodsComponent },
  name: 'ShopGoodsBatchOrderComponentVue',
  props: {
    show: {
      type: Boolean,
      default() {
        return false
      }
    },
    defaultTableDataList: {
      type: Array,
      default() {
        return []
      }
    },
    defaultFormData: {
      type: Object,
      default() {
        return {}
      }
    },
    defaultsupplierSelectData: {
      type: Array,
      default() {
        return []
      }
    },
    defaultsupplierGoodsData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      createFormData: this.defaultFormData,
      createFromRules: {
        goodsName: [
          { required: true, message: '请输入商名称', trigger: 'blur' }
        ],
        supplierGuid: [
          { required: true, message: '请输入选择供应商', trigger: 'blur' }
        ],
        statusCode: [
          { required: true, message: '请输入状态标识', trigger: 'blur' }
        ],
        purTime: [
          { required: true, message: '请输入采购时间', trigger: 'blur' }
        ],
        isComplete: [
          { required: true, message: '请选择是否已交货', trigger: 'blur' }
        ]
      },
      editTableRules: {
        purUnitPrice: [
          { required: true, message: '采购单价不能为空', trigger: 'blur' }
        ],
        shipAmount: [
          { required: true, message: '其他金额不能为空', trigger: 'blur' }
        ]
      },
      supplierSelectData: this.defaultsupplierSelectData,
      supplierGoodsData: this.defaultsupplierGoodsData,
      selectionGoodsDatasIn: this.defaultBatchOrderTableDataList,
      showIn: this.show,
      showGoodsComponent: false,
      createForm: [
        {
          title: '',
          span: 23,
          children: [
            { field: 'shopName', title: '店铺名称', span: 8, itemRender: { name: '$input', props: { disabled: true, placeholder: '请输入店铺名称' } } },
            // { field: 'goodsName', title: '店铺商品', span: 12, slots: { default: 'shopGoodsSlot' } },
            { field: 'supplierGuid', title: '供应商', span: 8, slots: { default: 'supplierGuidSlot' } },
            {
              field: 'statusCode',
              title: '状态标识',
              span: 8,
              itemRender: {
                name: '$select',
                options: [{ value: '待下单', label: '待下单' }, { value: '已下单', label: '已下单' }],
                props: { placeholder: '请输入状态标识' }
              }
            },
            { field: 'shipAmount', title: '其他费用/RMB', span: 8, itemRender: { name: '$input', props: { placeholder: '其他费用(PS:运输金额等)单位人民币' } } },
            {
              field: 'isComplete',
              title: '是否已交货',
              span: 8,
              itemRender: {
                name: '$select',
                options: [{ value: '是', label: '是' }, { value: '否', label: '否' }],
                props: { placeholder: '制作商是否已经做完货物' }
              }
            },
            { field: 'purTime', title: '采购时间', span: 8, slots: { default: 'purTimeSlot' } },
            { field: 'shipType', title: '运输方式', span: 8, itemRender: { name: '$input', props: { placeholder: '请输入运输方式' } } },
            { field: 'completeTime', title: '交货日期', span: 8, slots: { default: 'completeTimeSlot' } },
            { field: 'remark', title: '备注', span: 8, itemRender: { name: '$input', props: { placeholder: '请输入备注' } } }]
        }
      ]
    }
  },
  methods: {
    handleClose() {
      this.showIn = false
      this.selectionGoodsDatasIn = []
      this.createFormData = {}
      this.supplierSelectData = []
      this.supplierGoodsData = []
      this.$emit('update:defaultsupplierSelectData', [])
      this.$emit('update:defaultsupplierGoodsData', [])
      this.$emit('update:defaultBatchOrderTableDataList', [])
      this.$emit('update:defaultTableDataList', [])
      this.$emit('update:defaultFormData', {
        shopName: '',
        supplierGuid: '',
        statusCode: '',
        shipAmount: '',
        shipType: '',
        purTime: '',
        isComplete: '',
        completeTime: '',
        remark: ''
      })
      this.$emit('update:show', false)
    },
    // 提交保存按钮
    handleSubmitCreate() {
      if (!this.selectionGoodsDatasIn) {
        this.$message.warning('数据为空!')
      } else {
        let flag = false
        this.selectionGoodsDatasIn.forEach(item => {
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
    async submitBatchCreate() {
      const $table = this.$refs.vxeTableRef
      const errMap = await $table.validate(true).catch(errMap => errMap)
      if (!errMap) {
        const refs = this.$refs
        refs.createFrom.validate().then((valid) => {
          if (!valid) {
            const batchOrderList = this.buildBatchOrderData()
            this.handleHttpMethod(updateBatchApi(batchOrderList), true, '正在保存中', true, '信息保存成功').then(res => {
              if (res) {
                this.handleClose()
                this.pageList()
              }
            })
          }
        })
      }
    },
    buildBatchOrderData() {
      const batchOrderList = []
      this.selectionGoodsDatasIn.forEach(item => {
        item.statusCode = this.createFormData.statusCode
        item.isComplete = this.createFormData.isComplete
        item.purTime = this.createFormData.purTime
        item.shipType = this.createFormData.shipType
        item.completeTime = this.createFormData.completeTime
        item.remark = this.createFormData.remark
        batchOrderList.push(item)
      })
      return batchOrderList
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
    },
    supplierChange() {

    },
    purUnitPriceChange(row) {
      row.purAmount = new $Big(row.purUnitPrice || 0).times(row.purNumber || 0).toFixed(2).toString()
      row.sumAmount = new $Big(row.purUnitPrice || 0).times(row.purNumber || 0).plus(new $Big(row.shipAmount || 0)).toFixed(2).toString()
    },
    shipAmountChange(row) {
      row.sumAmount = new $Big(row.purUnitPrice || 0).times(row.purNumber || 0).plus(new $Big(row.shipAmount || 0)).toFixed(2).toString()
    }
  },
  created() {
  },
  mounted() {
  },
  watch: {
    defaultTableDataList: {
      handler(nval, oval) {
        if (nval && !(JSON.stringify(nval) === '[]')) {
          this.selectionGoodsDatasIn = JSON.parse(JSON.stringify(nval))
        }
      },
      immediate: true,
      deep: true
    },
    show: {
      handler(nval, oval) {
        if (nval) {
          console.log('页面打开')
        }
      }
    },
    'createFormData.supplierGuid': {
      handler(nval, oval) {
        console.log('供应商改变')
        this.selectionGoodsDatasIn.forEach(item => {
          this.supplierGoodsData.forEach(element => {
            if (item.goodsGuid === element.goodsGuid && element.supplierGuid === nval) {
              item.supplierGuid = nval
              item.supplierName = element.supplierName
              item.boxQuantity = element.boxQuantity
              item.boxVolume = element.boxVolume
              item.totalBox = new $Big(item.purNumber || 0).div(item.boxQuantity).toFixed(1).toString()
              item.purVolume = new $Big(item.boxVolume || 0).times(item.totalBox || 0).toFixed(3).toString()
            }
          })
        })
      }
    },
    'createFormData.shipAmount': {
      handler(nval, oval) {
        console.log('其他费用改变')
        let purTotal = 0
        this.selectionGoodsDatasIn.forEach(item => {
          purTotal = purTotal + item.purNumber
        })
        this.selectionGoodsDatasIn.forEach(item => {
          item.shipAmount = new $Big(nval || 0).div(purTotal).times(item.purNumber).toFixed(2).toString()
          item.sumAmount = new $Big(item.purAmount || 0).plus(new $Big(item.shipAmount || 0)).toFixed(2).toString()
        })
      }
    }
  }
}
</script>
