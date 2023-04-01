<!--店铺管理-->
<template>
  <d2-container>
    <template slot="header">
      <div style="float:left;padding-top:3px">
        <el-radio-group @input="pageList()" v-model="filterFormData.statusCode" size="medium">
          <el-radio-button label="全部" @click="pageList()">全部</el-radio-button>
          <el-radio-button label="在途" @click="pageList()">在途</el-radio-button>
          <el-radio-button label="已售" @click="pageList()">已售</el-radio-button>
          <el-radio-button label="售罄" @click="pageList()">售罄</el-radio-button>
          <el-radio-button label="已下单" @click="pageList()">已下单</el-radio-button>
        </el-radio-group>
      </div>
      <div style="float:right;">
        <el-button icon="vxe-icon-square-plus" type="success" size="medium" style="width:100px" @click="handleCreate">新增</el-button>
        <el-button type="primary" size="medium" style="width:100px" @click="pageList()">刷新</el-button>
      </div>
    </template>

    <template>
      <vxe-toolbar style="height:10%" :refresh="{query: pageList}" export print custom zoom>
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
        height="90%"
        :row-config="{isHover: true}"
        @cell-click="handleCellClickEvent"
        :data="tableData">
        <vxe-column type="checkbox" width="60"></vxe-column>
        <vxe-column type="seq" title="序号" width="60"></vxe-column>
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
        <vxe-column field="purAmount" title="采购总额" width="120"></vxe-column>
        <vxe-column field="shipType" title="运输方式" width="120"></vxe-column>
        <vxe-column field="shipAmount" title="运输价格" width="120"></vxe-column>
        <vxe-column field="shipPayAmount" title="运输已支付费用" width="120"></vxe-column>
        <vxe-column field="purWeight" title="采购重量" width="120"></vxe-column>
        <vxe-column field="purTime" title="采购时间" width="120"></vxe-column>
        <vxe-column field="boxLength" title="单箱长" width="120"></vxe-column>
        <vxe-column field="boxWidth" title="单箱宽" width="120"></vxe-column>
        <vxe-column field="boxHigh" title="单箱高" width="120"></vxe-column>
        <vxe-column field="boxVolume" title="单箱体积" width="120"></vxe-column>
        <vxe-column field="singleAmount" title="原始单价" width="120"></vxe-column>
        <vxe-column field="grade" title="评级" width="100"></vxe-column>
        <vxe-column field="remark" title="备注" width="200"></vxe-column>
        <vxe-column title="操作" width="120" fixed="right" show-overflow>
          <template #default="{ row }">
            <vxe-button size="mini" type="text" status="success"  @click="handleUpdate(row)" content="修改"></vxe-button>
            <vxe-button size="mini" type="text" status="danger"  @click="handleRemove(row)" content="删除"></vxe-button>
          </template>
        </vxe-column>
      </vxe-table>
      <div v-show="dialogFormVisible" width="60%">
        <vxe-modal v-if="dialogFormVisible" title="新增数据页面" v-model="dialogFormVisible" :visible.sync="dialogFormVisible"
        @close="createModalClose" width="60%">
          <vxe-form ref="createFrom" title-width="100" title-align="right" titleColon
          :data="createFormData" :items="createForm" :rules="createFromRules"
          @submit="handleSubmitCreate('createFrom')" @reset="handleCancelCreate('createFrom')">
            <template #supplierGuidSlot="{ data }">
              <vxe-select v-model="data.supplierGuid" placeholder="可搜索" :options="supplierData" filterable></vxe-select>
            </template>
            <template #shopGoodsSlot="{ data }">
              <span> {{ data.goodsName }}  </span>
              <vxe-button status="primary" content="选择店铺商品"  @click="handleChooseGoods(data)"></vxe-button>
            </template>
            <template #purTimeSlot="{ data }">
              <el-date-picker style="width:100%" v-model="data.purTime" type="date" size="small" placeholder="请选择日期" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
              <!-- <vxe-input v-model="data.purTime" type="date" placeholder="请选择日期" clearable></vxe-input> -->
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
import { myMethods } from './js/shopGoodsOperateMethod.js'
export default {
  name: 'shopGoods',
  mixins: [mixins],
  components: { GoodsShowComponent, ShopGoodsComponent },
  data() {
    return {
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
        shopName: '',
        sku: '',
        itemId: '',
        statusCode: '全部',
        shippingMark: ''
      },
      searchForm: [
        {
          title: '左侧',
          span: 24,
          children: [
            { field: 'shopName', title: '店铺名称', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入店铺名称' } } },
            { field: 'goodsName', title: '商品名称', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入商品名称' } } },
            { field: 'suk', title: 'SKU', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入SKU' } } },
            { field: 'itemId', title: 'ITEM ID', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入ITEM ID' } } },
            { field: 'shippingMark', title: '箱唛', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入箱唛' } } }
          ]
        }
      ],
      createFormData: {
        shopGoodsGuid: '',
        shopName: '',
        clientId: '',
        goodsName: '',
        goodsGuid: '',
        optimizeStatus: '未优化',
        sku: '',
        itemId: '',
        mlCode: '',
        statusCode: '',
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
        brand: ''
      },
      createFromRules: {
        goodsName: [
          { required: true, message: '请输入商名称', trigger: 'blur' }
        ],
        goodsCategory: [
          { required: true, message: '请输入商品类别', trigger: 'blur' }
        ],
        upcCode: [
          { required: true, message: '请输入商品类别', trigger: 'blur' }
        ],
        imgLink: [
          { required: true, message: '请输入商品类别', trigger: 'blur' }
        ]
      },
      createForm: [
        {
          title: '',
          span: 23,
          children: [
            { field: 'goodsName', title: '店铺商品', span: 12, slots: { default: 'shopGoodsSlot' } },
            { field: 'suplierGuid', title: '供应商', span: 12, slots: { default: 'supplierGuidSlot' } },
            {
              field: 'statusCode',
              title: '状态标识',
              span: 12,
              itemRender: {
                name: '$select',
                options: [{ value: '在途', label: '在途' }, { value: '已售', label: '已售' }, { value: '售罄', label: '售罄' }, { value: '已下单', label: '已下单' }],
                props: { clearable: true, placeholder: '请输入状态标识' }
              }
            },
            { field: 'shippingMark', title: '箱唛', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入箱唛' } } },
            { field: 'purNumber', title: '采购数量', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入采购数量' } } },
            { field: 'totalBox', title: '总箱数', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入供应商地址' } } },
            { field: 'purVolume', title: '采购体积', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入供应商地址' } } },
            { field: 'purUnitPrice', title: '采购单价', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入供应商地址' } } },
            { field: 'purAmount', title: '采购总额', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入供应商地址' } } },
            { field: 'shipType', title: '运输方式', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入供应类别' } } },
            { field: 'shipAmount', title: '运输总额', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入供应类别' } } },
            { field: 'shipPayAmount', title: '运输已支付', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入供应类别' } } },
            { field: 'purWeight', title: '采购重量', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入供应类别' } } },
            { field: 'purTime', title: '采购时间', span: 12, slots: { default: 'purTimeSlot' } },
            { field: 'grade', title: '评级', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入供应类别' } } },
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
    }
  }
}
</script>
