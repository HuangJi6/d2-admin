<!--店铺管理-->
<template>
  <d2-container>
    <template slot="header">
      <div style="float:left;padding-top:3px">
        <el-radio-group @input="pageList()" v-model="filterFormData.statusCode" size="medium">
          <el-radio-button label="待检测" @click="pageOperateList()">待检测</el-radio-button>
          <el-radio-button label="已入库" @click="pageList()">已入库</el-radio-button>
          <el-radio-button label="待出库" @click="pageList()">待出库</el-radio-button>
          <el-radio-button label="待重新装箱" @click="pageList()">待重新装箱</el-radio-button>
          <el-radio-button label="已出库" @click="pageOperateList()">已出完</el-radio-button>
        </el-radio-group>
      </div>
      <div style="float:right;" v-if="filterFormData.statusCode === '待检测'" >
        <el-button icon="vxe-icon-square-plus" size="medium" @click="handleBeforeCheck">检测入库</el-button>
        <el-button  size="medium" style="width:100px" @click="pageList()">刷新</el-button>
      </div>
      <div style="float:right;" v-if="filterFormData.statusCode === '已入库'" >
        <el-button icon="vxe-icon-square-plus" size="medium" @click="handleAddPackingList">添加箱单</el-button>
        <el-button icon="vxe-icon-square-plus" size="medium" @click="handleDirectOutContainer">直接出库</el-button>
        <el-button icon="vxe-icon-square-plus" size="medium" @click="handleChangeOutContainer">变更出库</el-button>
        <el-button size="medium" style="width:100px" @click="pageList()">刷新</el-button>
      </div>
    </template>

    <template>
      <vxe-toolbar style="height:8%" :refresh="{query: pageList}" export custom zoom>
        <template #buttons>
          <el-button icon="vxe-icon-table" size="mini" style="width:120px">仓库出库计划表</el-button>
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
        <vxe-column type="checkbox" width="60"></vxe-column>
        <vxe-column type="seq" title="序号" width="60"></vxe-column>
        <vxe-column field="shopName" title="店铺名称" width="100"></vxe-column>
        <vxe-column field="shippingMark" title="箱唛" width="120"></vxe-column>
        <vxe-column field="goodsName" title="商品名称" width="150"></vxe-column>
        <vxe-column field="sku" title="SKU" width="120"></vxe-column>
        <vxe-column field="itemId" title="ITEM ID" width="120"></vxe-column>
        <vxe-column field="statusCode" title="状态标识" width="100"></vxe-column>
        <vxe-column field="purNumber" title="总数量" width="120"></vxe-column>
        <vxe-column field="purNumber" title="已出库数量" width="120"></vxe-column>
        <vxe-column field="purNumber" title="未出库数量" width="120"></vxe-column>
        <vxe-column field="totalBox" title="总箱数" width="120"></vxe-column>
        <vxe-column field="boxQuantity" title="单箱数量" width="120"></vxe-column>
        <vxe-column field="remeasureWeight" title="单箱重新称重" width="120"></vxe-column>
        <vxe-column field="remeasureTotalWeight" title="总重新称重" width="120"></vxe-column>
        <vxe-column field="remeasureLength" title="重新测量长" width="120"></vxe-column>
        <vxe-column field="remeasureWidth" title="重新测量宽" width="120"></vxe-column>
        <vxe-column field="remeasureHigh" title="重新测量高" width="120"></vxe-column>
        <vxe-column field="remeasureVolume" title="重新测量体积" width="120"></vxe-column>
        <vxe-column field="purVolume" title="原体积" width="120"></vxe-column>
        <vxe-column field="goodsNature" title="货物性质" width="120"></vxe-column>
        <vxe-column field="qualityCode" title="质检情况" width="120"></vxe-column>
        <vxe-column field="inTime" title="入库日期" width="120"></vxe-column>
        <vxe-column field="outTime" title="出库日期" width="120"></vxe-column>
        <vxe-column field="remark" title="备注" width="120"></vxe-column>
        <vxe-column title="操作" width="100" fixed="right" show-overflow>
          <template #default="{ row }">
            <vxe-button size="mini" type="text" status="success" icon="vxe-icon-edit" @click="handleUpdate(row)" content="修改"></vxe-button>
          </template>
        </vxe-column>
      </vxe-table>
      <div v-show="dialogFormVisible" width="60%">
        <vxe-modal v-if="dialogFormVisible" title="填充检测数据" v-model="dialogFormVisible" :visible.sync="dialogFormVisible"
        @close="handleCancelCreate" width="60%">
          <vxe-form ref="createFrom" title-width="100" title-align="right" titleColon
          :data="createFormData" :items="createForm" :rules="createFromRules"
          @submit="submitCreate('createFrom')" @reset="handleCancelCreate('createFrom')">
            <template #inTimeSlot="{ data }">
              <el-date-picker style="width:100%" v-model="data.inTime" type="date" size="small" placeholder="请选择日期" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
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
    </template>
    <InContainerComponent
      v-if="false"
      :show.sync="showChangeOutContainerComponent"
      :selectionOperateDatas = selectionOperateDatas>
    </InContainerComponent>
    <!-- 添加箱单组件 -->
    <AddPackingListFormDialogVue
      v-if="showAddPackingListFormDialog"
      :show.sync="showAddPackingListFormDialog">
    </AddPackingListFormDialogVue>
    <!-- 直接出库组件 -->
    <DirectOutContainerComponentVue
      v-if="showDirectOutContainer"
      :show.sync="showDirectOutContainer">
    </DirectOutContainerComponentVue>
    <!-- 变更出库组件 -->
    <ChangeOutContainerComponentVue
      v-if="showChangeOutContainerComponent"
      :show.sync="showChangeOutContainerComponent">
    </ChangeOutContainerComponentVue>
    <template slot="footer">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="filterFormData.currentPage" :page-sizes="[10,20,30, 50]" :page-size="filterFormData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </template>
  </d2-container>
</template>

<script>
import $Big from '@/libs/big.js'
import mixins from '@/mixin/commonMixin.js'
import InContainerComponent from '@/views/business/inContainer/components/inContainerChangeChooseComponent.vue'
import AddPackingListFormDialogVue from '@/views/business/packingList/components/addPackingListFormDialog.vue'
import DirectOutContainerComponentVue from '../outContainer/components/directOutContainerComponent.vue'
import ChangeOutContainerComponentVue from '../outContainer/components/changeOutContainerComponent.vue'
import { myMethods } from './js/inContainerMethod.js'
export default {
  name: 'shopGoods',
  mixins: [mixins],
  components: { InContainerComponent, AddPackingListFormDialogVue, DirectOutContainerComponentVue, ChangeOutContainerComponentVue },
  data() {
    return {
      showDirectOutContainer: false,
      showAddPackingListFormDialog: false,
      filterDialogVisible: false,
      goodsInfo: {},
      supplierData: [],
      applicationData: [],
      selectionOperateDatas: [],
      showChangeOutContainerComponent: false,
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
        statusCode: '待检测',
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
        goodsName: '',
        itemId: '',
        sku: '',
        operateGuid: '',
        remeasureLength: '',
        remeasureWidth: '',
        remeasureHigh: '',
        remeasureVolume: '0',
        remeasureWeight: '',
        remeasureTotalWeight: '0',
        boxWeight: '',
        statusCode: '',
        goodsNature: '',
        qualityCode: '',
        inTime: '',
        outTime: '',
        shippingMark: '',
        remark: ''
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
            { field: 'goodsName', title: '商品名称', span: 12, itemRender: { name: '$input', props: { disabled: true, placeholder: '请输入单箱重称重' } } },
            { field: 'itemId', title: 'ITEM ID', span: 12, itemRender: { name: '$input', props: { disabled: true, placeholder: '请输入单箱重称重' } } },
            { field: 'sku', title: 'sku', span: 12, itemRender: { name: '$input', props: { disabled: true, placeholder: '请输入单箱重称重' } } },
            { field: 'totalBox', title: '总箱数', span: 12, itemRender: { name: '$input', props: { disabled: true, placeholder: '请输入单箱重称重' } } },
            { field: 'remeasureWeight', title: '单箱重称重', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入单箱重称重' } } },
            { field: 'remeasureTotalWeight', title: '总重量', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入单箱重称重' } } },
            { field: 'remeasureLength', title: '重新测量长', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入重新测量长' } } },
            { field: 'remeasureWidth', title: '重新测量宽', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入重新测量宽' } } },
            { field: 'remeasureHigh', title: '重新测量高', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入重新测量高' } } },
            { field: 'remeasureVolume', title: '重测量体积', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入重测量体积' } } },
            { field: 'goodsNature', title: '货物性质', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入货物性质' } } },
            { field: 'qualityCode', title: '质检情况', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入质检情况' } } },
            { field: 'inTime', title: '入库时间', span: 12, slots: { default: 'inTimeSlot' } },
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
    'createFormData.remeasureLength': {
      handler(nval, oval) {
        debugger
        this.createFormData.remeasureVolume = new $Big(nval || 0).times(this.createFormData.remeasureWidth || 0).times(this.createFormData.remeasureHigh || 0).toString()
      }
    },
    'createFormData.remeasureWidth': {
      handler(nval, oval) {
        this.createFormData.remeasureVolume = new $Big(nval || 0).times(this.createFormData.remeasureLength || 0).times(this.createFormData.remeasureHigh || 0).toString()
      }
    },
    'createFormData.remeasureHigh': {
      handler(nval, oval) {
        this.createFormData.remeasureVolume = new $Big(nval || 0).times(this.createFormData.remeasureLength || 0).times(this.createFormData.remeasureWidth || 0).toString()
      }
    },
    'createFormData.remeasureWeight': {
      handler(nval, oval) {
        this.createFormData.remeasureTotalWeight = new $Big(nval || 0).times(this.createFormData.totalBox || 0).toString()
      }
    }
  }
}
</script>
