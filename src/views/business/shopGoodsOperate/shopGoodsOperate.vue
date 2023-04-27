<!--店铺管理-->
<template>
  <d2-container>
    <template slot="header">
      <div style="float:left;padding-top:3px">
        <el-radio-group @input="pageList()" v-model="filterFormData.statusCode" size="medium">
          <el-radio-button label="待下单" @click="pageList()">待下单</el-radio-button>
          <el-radio-button label="已下单" @click="pageList()">已下单</el-radio-button>
          <el-radio-button label="已入库" @click="pageList()">已入库</el-radio-button>
          <el-radio-button label="全部" @click="pageList()">全部</el-radio-button>
        </el-radio-group>
      </div>
      <div  style="float:right;" v-if="filterFormData.statusCode === '待下单'" >
        <el-button icon="vxe-icon-square-plus" size="medium" style="width:100px" @click="handleCreateOrder">新增</el-button>
        <el-button size="medium" style="width:100px" @click="handleUpdate">修改</el-button>
        <el-button size="medium" style="width:100px" @click="handleRemove">删除</el-button>
        <el-button size="medium" style="width:100px" @click="pageList()">刷新</el-button>
      </div>
      <div style="float:right;" v-if="filterFormData.statusCode === '已下单'">
        <el-button type="primary" size="medium"  @click="handleComplete">工厂已完工</el-button>
        <el-button size="medium" style="width:100px" @click="handleUpdate">修改</el-button>
        <el-button size="medium" style="width:100px" @click="pageList()">刷新</el-button>
      </div>
    </template>

    <template>
      <vxe-toolbar style="height:8%" :refresh="{query: pageList}" export custom zoom>
        <template #buttons>
          <el-button icon="vxe-icon-table" size="mini" style="width:120px">运营概况表</el-button>
          <el-button icon="vxe-icon-chart-pie" size="mini" style="width:120px" @click="HandlefilterDialogClick">过滤数据</el-button>
        </template>
      </vxe-toolbar>
      <vxe-table
        class="mytable-scrollbar"
        size="medium"
        header-cell-class-name="headerClassName"
        cell-class-name="cellClassName"
        border
        resizable
        show-overflow
        show-header-overflow
        v-loading.body="listLoading"
        ref="vxeTableRef"
        height="92%"
        :row-config="{isHover: true}"
        @cell-click="handleCellClickEvent"
        :data="tableData">
        <vxe-column type="checkbox" width="45"></vxe-column>
        <vxe-column type="seq" title="序号" width="60"></vxe-column>
        <vxe-column field="purNo" title="采购单号" width="150" align="center"></vxe-column>
        <vxe-column field="shopName" title="店铺名称" width="100"></vxe-column>
        <vxe-column field="goodsName" title="商品名称" width="150"></vxe-column>
        <vxe-column field="statusCode" title="状态标识" width="100"></vxe-column>
        <vxe-column field="sku" title="SKU" width="120"></vxe-column>
        <vxe-column field="itemId" title="ITEM ID" width="120"></vxe-column>
        <vxe-column field="shippingMark" title="箱唛" width="120"></vxe-column>
        <vxe-column field="purNumber" title="采购数量" width="120"></vxe-column>
        <vxe-column field="boxQuantity" title="单箱数量" width="120"></vxe-column>
        <vxe-column field="totalBox" title="总箱数" width="120"></vxe-column>
        <vxe-column field="purVolume" title="采购体积" width="120"></vxe-column>
        <vxe-column field="purUnitPrice" title="采购单价" width="120"></vxe-column>
        <vxe-column field="purAmount" title="采购金额" width="120"></vxe-column>
        <vxe-column field="shipType" title="运输方式" width="120"></vxe-column>
        <vxe-column field="shipAmount" title="运输价格" width="120"></vxe-column>
        <vxe-column field="sumAmount" title="采购总额" width="120"></vxe-column>
        <vxe-column field="purTime" title="采购时间" width="120"></vxe-column>
        <vxe-column field="boxLength" title="单箱长/CM" width="120"></vxe-column>
        <vxe-column field="boxWidth" title="单箱宽/CM" width="120"></vxe-column>
        <vxe-column field="boxHigh" title="单箱高/CM" width="120"></vxe-column>
        <vxe-column field="boxVolume" title="单箱体积/M" width="120"></vxe-column>
        <vxe-column field="singleAmount" title="原始单价" width="120"></vxe-column>
        <vxe-column field="isComplete" title="是否已完工" width="120"></vxe-column>
        <vxe-column field="completeTime" title="完工日期" width="120"></vxe-column>
        <vxe-column field="remark" title="备注" width="200"></vxe-column>
        <vxe-column v-if="filterFormData.statusCode==='待下单'" title="操作" align="center" width="100" fixed="right" show-overflow>
          <template #default="{ row }">
            <vxe-button v-if="filterFormData.statusCode==='待下单'" size="mini" type="text" status="success"  @click="handleOrder(row)" content="下单"></vxe-button>
          </template>
        </vxe-column>
      </vxe-table>
      <div v-show="dialogFormVisible" width="60%">
        <vxe-modal v-if="dialogFormVisible" title="填写下单信息" v-model="dialogFormVisible" :visible.sync="dialogFormVisible"
        @close="createModalClose" width="60%">
          <vxe-form ref="createFrom" title-width="150" title-align="right" titleColon
          :data="createFormData" :items="createForm" :rules="createFromRules"
          @submit="handleSubmitCreate('createFrom')" @reset="handleCancelCreate('createFrom')">
            <template #supplierGuidSlot="{ data }">
              <vxe-select v-model="data.supplierGuid" placeholder="可搜索" :options="supplierData" filterable @change="supplierChange"></vxe-select>
            </template>
            <template #shopGoodsSlot="{ data }">
              <span> {{ data.goodsName }}  </span>
              <!-- <vxe-button status="primary" content="选择店铺商品"  @click="handleChooseGoods(data)"></vxe-button> -->
            </template>
            <template #purTimeSlot="{ data }">
              <el-date-picker style="width:100%" v-model="data.purTime" type="date" size="small" placeholder="请选择日期" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </template>
            <template #completeTimeSlot="{data}">
              <el-date-picker style="width:100%" v-model="data.completeTime" type="date" size="small" placeholder="供应商做完后请选择完工日期" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </template>
          </vxe-form>
        </vxe-modal>
      </div>
      <div v-show="filterDialogVisible" width="30%">
        <vxe-modal :visible.sync="filterDialogVisible" id="filterForm" :position="{top: 245, left: 210}" :mask="false" :mask-closable="true"
        title="填写过滤条件" v-model="filterDialogVisible" width="600" min-width="460" resize remember storage transfer>
          <vxe-form :data="filterFormData" :items="searchForm" titleColon></vxe-form>
            <div style="margin-top:10px;float:right;margin-right:20px">
            <el-button type="danger" @click="filterDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="pageList">确 定</el-button>
            </div>
        </vxe-modal>
      </div>
      <GoodsShowComponent
        v-if="false"
        :show.sync="showGoodsComponent"
        @onSureClick="selectedGoods"
      ></GoodsShowComponent>
      <ShopGoodsComponent
        v-if="showGoodsComponent"
        :show.sync="showGoodsComponent"
        @onSureClick="selectedShopGoods"
      ></ShopGoodsComponent>
      <ShopGoodsOrderComponentVue
        v-if="showOrderComponent"
        :show.sync="showOrderComponent"
        :defaultFormData="createOrderFormData"
        :dialogStatus="dialogStatus"
        @onSureClick="pageList"
      ></ShopGoodsOrderComponentVue>
    </template>

    <template slot="footer">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="filterFormData.currentPage" :page-sizes="[10,20,30, 50]" :page-size="filterFormData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </template>
  </d2-container>
</template>

<script>
import mixins from '@/mixin/commonMixin.js'
import GoodsShowComponent from '@/views/business/goods/components/goodsShowComponent.vue'
import ShopGoodsComponent from '@/views/business/shopGoods/components/shopGoodsComponent'
import ShopGoodsOrderComponentVue from '@/views/business/shopGoodsOperate/components/shopGoodsOrderComponent.vue'
import { myMethods } from './js/shopGoodsOperateMethod.js'
import $Big from '@/libs/big.js'
import moment from 'moment'

export default {
  name: 'shopGoods',
  mixins: [mixins],
  components: { GoodsShowComponent, ShopGoodsComponent, ShopGoodsOrderComponentVue },
  data() {
    return {
      showOrderComponent: false,
      filterDialogVisible: false,
      goodsInfo: {},
      supplierData: [],
      applicationData: [],
      showGoodsComponent: false,
      dialogStatus: '',
      dialogFormVisible: false,
      tableData: [],
      listLoading: false,
      total: null,
      filterFormData: {
        currentPage: 1,
        pageSize: 20,
        goodsName: '',
        purNo: '',
        shopName: '',
        sku: '',
        itemId: '',
        statusCode: '待下单',
        shippingMark: ''
      },
      searchForm: [
        {
          title: '左侧',
          span: 24,
          children: [
            { field: 'purNo', title: '采购单号', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入采购单号' } } },
            { field: 'shopName', title: '店铺名称', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入店铺名称' } } },
            { field: 'goodsName', title: '商品名称', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入商品名称' } } },
            { field: 'suk', title: 'SKU', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入SKU' } } },
            { field: 'itemId', title: 'ITEM ID', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入ITEM ID' } } },
            { field: 'shippingMark', title: '箱唛', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入箱唛' } } }
          ]
        }
      ],
      createOrderFormData: {
        shopGoodsGuid: '',
        clientId: '',
        goodsName: '',
        goodsGuid: '',
        statusCode: '待下单',
        purNumber: ''
      },
      createFormData: {
        boxVolume: '',
        boxQuantity: '',
        supplierGuid: '',
        shopGoodsGuid: '',
        shopName: '',
        purNo: '',
        clientId: '',
        goodsName: '',
        goodsGuid: '',
        optimizeStatus: '未优化',
        sku: '',
        itemId: '',
        mlCode: '',
        statusCode: '已下单',
        remark: '',
        hsCode: '',
        goodsCategory: '',
        goodsLink: '',
        upcCode: '',
        imgLink: '',
        material: '',
        grade: '',
        goodsLength: '',
        goodsWidth: '',
        goodsHigh: '',
        goodsWeight: '',
        goodsPrice: '',
        goodsUse: '',
        brand: '',
        purTime: moment().format('YYYY-MM-DD h:mm:ss'),
        isComplete: '否',
        completeTime: '',
        sumAmount: '',
        shipAmount: ''
      },
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
        purNumber: [
          { required: true, message: '请输入采购数量', trigger: 'blur' }
        ],
        boxQuantity: [
          { required: true, message: '请输入单箱产品数', trigger: 'blur' }
        ],
        totalBox: [
          { required: true, message: '请输入总箱数', trigger: 'blur' }
        ],
        boxVolume: [
          { required: true, message: '请输入单箱体积', trigger: 'blur' }
        ],
        purVolume: [
          { required: true, message: '请输入采购体积', trigger: 'blur' }
        ],
        purUnitPrice: [
          { required: true, message: '请输入采购单价', trigger: 'blur' }
        ],
        purAmount: [
          { required: true, message: '请输入采购金额', trigger: 'blur' }
        ],
        shipAmount: [
          { required: true, message: '请输入其他费用', trigger: 'blur' }
        ],
        sumAmount: [
          { required: true, message: '请输入采购总额', trigger: 'blur' }
        ],
        purTime: [
          { required: true, message: '请输入采购时间', trigger: 'blur' }
        ],
        isComplete: [
          { required: true, message: '请选择是否已完工', trigger: 'blur' }
        ]
      },
      createForm: [
        {
          title: '',
          span: 23,
          children: [
            { field: 'shopName', title: '店铺名称', span: 12, itemRender: { name: '$input', props: { disabled: true, placeholder: '请输入店铺名称' } } },
            { field: 'goodsName', title: '店铺商品', span: 12, slots: { default: 'shopGoodsSlot' } },
            { field: 'supplierGuid', title: '供应商', span: 12, slots: { default: 'supplierGuidSlot' } },
            {
              field: 'statusCode',
              title: '状态标识',
              span: 12,
              itemRender: {
                name: '$select',
                options: [{ value: '待下单', label: '待下单' }, { value: '已下单', label: '已下单' }],
                props: { placeholder: '请输入状态标识' }
              }
            },
            { field: 'purNumber', title: '采购数量', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入采购数量' } } },
            { field: 'boxQuantity', title: '单箱产品数', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入单箱产品数' } } },
            { field: 'totalBox', title: '总箱数', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入总箱数' } } },
            { field: 'boxVolume', title: '单箱体积/m³', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入单箱体积' } } },
            { field: 'purVolume', title: '采购体积/m³', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入采购体积' } } },
            { field: 'purUnitPrice', title: '采购单价/RMB', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入采购单价单位人民币' } } },
            { field: 'purAmount', title: '采购金额/RMB', span: 12, itemRender: { name: '$input', props: { disabled: true, placeholder: '请输入采购金额单位人民币' } } },
            { field: 'shipAmount', title: '其他费用/RMB', span: 12, itemRender: { name: '$input', props: { placeholder: '其他费用(PS:运输金额等)单位人民币' } } },
            { field: 'sumAmount', title: '采购总额/RMB', span: 12, itemRender: { name: '$input', props: { disabled: true, placeholder: '请输入采购总额单位人民币' } } },
            { field: 'shippingMark', title: '箱唛', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入箱唛' } } },
            { field: 'shipType', title: '运输方式', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入运输方式' } } },
            { field: 'purTime', title: '采购时间', span: 12, slots: { default: 'purTimeSlot' } },
            {
              field: 'isComplete',
              title: '是否已完工',
              span: 12,
              itemRender: {
                name: '$select',
                options: [{ value: '是', label: '是' }, { value: '否', label: '否' }],
                props: { placeholder: '制作商是否已经做完货物' }
              }
            },
            { field: 'completeTime', title: '完工日期', span: 12, slots: { default: 'completeTimeSlot' } },
            { field: 'remark', title: '备注', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入备注' } } }]
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
      ]
    }
  },
  methods: {
    ...myMethods
  },
  created() {
    this.initCreated()
  },
  mounted() {
    this.initMounted()
  },
  watch: {
    'createFormData.clientId': {
      handler(nval, oval) {
        this.applicationData.forEach(element => {
          if (element.value === nval) {
            this.createFormData.shopName = element.label
          }
        })
      }
    },
    'createFormData.purUnitPrice': {
      handler(nval, oval) {
        if (nval) {
          this.createFormData.purAmount = new $Big(nval || 0).times(this.createFormData.purNumber || 0).toString()
          this.createFormData.sumAmount = new $Big(nval || 0).times(this.createFormData.purNumber || 0).plus(new $Big(this.createFormData.shipAmount || 0)).toString()
        } else {
          this.createFormData.purAmount = 0
        }
      }
    },
    'createFormData.shipAmount': {
      handler(nval, oval) {
        if (nval) {
          this.createFormData.sumAmount = new $Big(nval || 0).plus(this.createFormData.purAmount || 0).toString()
        } else {
          this.createFormData.sumAmount = this.createFormData.purAmount
        }
      }
    }
  }
}
</script>
