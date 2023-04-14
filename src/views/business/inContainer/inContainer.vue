<!--店铺管理-->
<template>
  <d2-container>
    <template slot="header">
      <div style="float:left">
        <el-radio-group @input="handleRefreshPageList()" v-model="filterFormData.statusCode" size="medium">
          <el-radio-button label="已下单" @click="pageOperateList()">已下单</el-radio-button>
          <el-radio-button label="已入库" @click="pageList()">已入库</el-radio-button>
          <el-radio-button label="待出库" @click="pageList()">待出库</el-radio-button>
          <el-radio-button label="已出完" @click="pageShippingMarkList()">已出完</el-radio-button>
          <el-radio-button label="全部" @click="pageOperateList()">全部</el-radio-button>
        </el-radio-group>
      </div>
      <div style="float:right;" v-if="filterFormData.statusCode === '已下单'" >
        <el-button icon="vxe-icon-square-plus" size="medium" @click="handleBeforeCheck">检测入库</el-button>
        <el-button  size="medium" style="width:100px" @click="handleRefreshPageList()">刷新</el-button>
      </div>
      <div style="float:right;" v-if="filterFormData.statusCode === '已入库'" >
        <el-button icon="vxe-icon-square-plus" size="medium" @click="handleAddPackingList">添加箱单</el-button>
        <el-button icon="vxe-icon-square-plus" size="medium" @click="handleDirectOutContainer">直接出库</el-button>
        <el-button icon="vxe-icon-square-plus" size="medium" @click="handleChangeOutContainer">变更出库</el-button>
        <el-button size="medium" style="width:100px" @click="handleRefreshPageList()">刷新</el-button>
      </div>
      <div style="float:right;" v-if="filterFormData.statusCode === '待出库'" >
        <el-button icon="vxe-icon-square-plus" size="medium" @click="handleEncasement">装箱</el-button>
        <el-button icon="vxe-icon-square-plus" size="medium" @click="handleChangePacking">变更箱规</el-button>
        <el-button icon="vxe-icon-square-plus" size="medium" @click="handleDeleteOutContainer">删除</el-button>
        <el-button size="medium" style="width:100px" @click="handleRefreshPageList()">刷新</el-button>
      </div>
    </template>

    <template>
      <vxe-toolbar style="height:8%" :refresh="{query: handleRefreshPageList}" export custom zoom>
        <template #buttons>
          <div>
            <el-button icon="vxe-icon-table" size="mini" style="width:120px">仓库出库计划表</el-button>
            <el-button icon="vxe-icon-chart-pie" size="mini" style="width:120px" @click="HandlefilterDialogClick">过滤数据</el-button>
          </div>
          <PackingListTopGatherComponentVue
            ref="packingListTopGather"
            v-if="filterFormData.statusCode === '待出库'||filterFormData.statusCode === '已出完'"
            @onChangePackingList="changePackingList"
          ></PackingListTopGatherComponentVue>
        </template>
        <template template #tools>
          <ExportButtonVue
            :tableRefsName="'vxeTableRef'"
            :vuePageName="'inContainer'"
            :fileName="'装箱表'"
            :tableDataTotal="parseInt(total/filterFormData.pageSize)+1"
            :tableDataFunction="handleRefreshPageList"
            :tableDataParams="filterFormData"
          ></ExportButtonVue>
        </template >
      </vxe-toolbar>
      <div style="height:92%" v-show="this.filterFormData.statusCode !== '待出库'&&filterFormData.statusCode !== '已出完'">
        <vxe-table
          v-if="this.filterFormData.statusCode !== '待出库'"
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
          height="100%"
          :row-config="{isHover: true}"
          @cell-click="handleCellClickEvent"
          :data="tableData">
          <vxe-column type="checkbox" width="45"></vxe-column>
          <vxe-column type="seq" title="序号" width="60"></vxe-column>
          <vxe-column field="shopName" title="店铺名称" width="100"></vxe-column>
          <vxe-column field="shippingMark" title="箱唛" width="120"></vxe-column>
          <vxe-column field="goodsName" title="商品名称" width="150"></vxe-column>
          <vxe-column field="sku" title="SKU" width="120"></vxe-column>
          <vxe-column field="itemId" title="ITEM ID" width="120"></vxe-column>
          <!-- <vxe-column field="statusCode" title="状态" width="80"></vxe-column> -->
          <vxe-column field="purNumber" title="总数量" width="80"></vxe-column>
          <vxe-column field="purOutNumber" title="出库数" width="100"></vxe-column>
          <vxe-column field="purInNumber" title="未出库数" width="100"></vxe-column>
          <vxe-column field="totalBox" title="总箱数" width="80"></vxe-column>
          <vxe-column field="boxQuantity" title="单箱数" width="80"></vxe-column>
          <vxe-column field="remeasureLength" title="重测长/CM" width="100"></vxe-column>
          <vxe-column field="remeasureWidth" title="重测宽/CM" width="100"></vxe-column>
          <vxe-column field="remeasureHigh" title="重测高/CM" width="100"></vxe-column>
          <vxe-column field="remeasureVolume" title="重测单箱体积/M" width="120"></vxe-column>
          <vxe-column field="remeasureTotalVolume" title="重测总体积/M" width="120"></vxe-column>
          <vxe-column field="purVolume" title="原体积" width="120"></vxe-column>
          <vxe-column field="remeasureWeight" title="单箱重称重/KG" width="120"></vxe-column>
          <vxe-column field="remeasureTotalWeight" title="总重称重/KG" width="120"></vxe-column>
          <vxe-column field="goodsNature" title="货物性质" width="120"></vxe-column>
          <vxe-column field="qualityCode" title="质检情况" width="120"></vxe-column>
          <vxe-column field="inTime" title="入库日期" width="120"></vxe-column>
          <vxe-column field="outTime" title="出库日期" width="120"></vxe-column>
          <vxe-column field="remark" title="备注" width="120"></vxe-column>
          <vxe-column v-if="filterFormData.statusCode!=='已下单'" title="操作" width="80" fixed="right" align="center" show-overflow>
            <template #default="{ row }">
              <vxe-button size="mini" type="text" status="success" icon="vxe-icon-edit" @click="handleUpdate(row)" content="修改"></vxe-button>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
      <!-- 出库表头 -->
      <div style="height:92%" v-show="this.filterFormData.statusCode === '待出库'">
        <vxe-table
          v-if="this.filterFormData.statusCode === '待出库'"
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
          height="100%"
          :row-config="{isHover: true}"
          @cell-click="handleCellClickEvent"
          :data="tableData">
          <vxe-column type="checkbox" width="45"></vxe-column>
          <vxe-column type="seq" title="序号" width="60"></vxe-column>
          <vxe-column field="shopName" title="店铺名称" width="100"></vxe-column>
          <vxe-column field="packingNo" title="箱单" width="120"></vxe-column>
          <vxe-column field="shippingMark" title="箱唛" width="120"></vxe-column>
          <vxe-column field="isRepacking" title="是否变更箱规" width="140"></vxe-column>
          <vxe-column field="goodsName" title="商品名称" width="150"></vxe-column>
          <vxe-column field="sku" title="SKU" width="120"></vxe-column>
          <vxe-column field="itemId" title="ITEM ID" width="120"></vxe-column>
          <vxe-column field="packingOutNumber" title="出库数量" width="100"></vxe-column>
          <vxe-column field="packingBox" title="出库箱数" width="100"></vxe-column>
          <vxe-column field="packingBoxQuantity" title="单箱数量" width="80"></vxe-column>
          <vxe-column field="packingLength" title="装箱长/CM" width="100"></vxe-column>
          <vxe-column field="packingWidth" title="装箱宽/CM" width="100"></vxe-column>
          <vxe-column field="packingHigh" title="装箱高/CM" width="100"></vxe-column>
          <vxe-column field="packingBoxVolume" title="装箱体积/M" width="120"></vxe-column>
          <vxe-column field="packingTotalVolume" title="装箱总体积/M" width="120"></vxe-column>
          <vxe-column field="packingBoxWeight" title="装箱称重/KG" width="120"></vxe-column>
          <vxe-column field="packingTotalWeight" title="总装箱重/KG" width="120"></vxe-column>
          <vxe-column field="goodsNature" title="货物性质" width="120"></vxe-column>
          <vxe-column field="qualityCode" title="质检情况" width="120"></vxe-column>
          <vxe-column field="inTime" title="入库日期" width="120"></vxe-column>
          <vxe-column field="outTime" title="出库日期" width="120"></vxe-column>
          <vxe-column field="remark" title="备注" width="120"></vxe-column>
          <vxe-column v-if="filterFormData.statusCode!=='已下单'" title="操作" width="80" fixed="right" align="center" show-overflow>
            <template #default="{ row }">
              <vxe-button size="mini" type="text" status="success" icon="vxe-icon-edit" @click="handleUpdateOutContainer(row)" content="修改"></vxe-button>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
      <div style="height:92%" v-show="this.filterFormData.statusCode === '已出完'">
        <vxe-table
          v-if="this.filterFormData.statusCode === '已出完'"
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
          height="100%"
          :row-config="{isHover: true}"
          @cell-click="handleCellClickEvent"
          :data="tableData">
          <vxe-column type="checkbox" width="45" fixed="left"></vxe-column>
          <vxe-column type="seq" title="序号" width="60" fixed="left"></vxe-column>
          <vxe-column field="outGoodsName" title="中文品名" width="100" fixed="left"></vxe-column>
          <vxe-column field="outEnglishGoodsName" title="Goods Name" width="120"></vxe-column>
          <vxe-column field="ctnNo" title="制造商编号" width="120"></vxe-column>
          <vxe-column field="mlCode" title="FBA/ML-编码" width="140"></vxe-column>
          <vxe-column field="clientId" title="Reference ID" width="150"></vxe-column>
          <vxe-column field="quantity" title="数量" width="120"></vxe-column>
          <vxe-column field="totalBox" title="总箱数" width="120"></vxe-column>
          <vxe-column field="weight" title="重量" width="100"></vxe-column>
          <vxe-column field="length" title="长" width="100"></vxe-column>
          <vxe-column field="width" title="宽" width="80"></vxe-column>
          <vxe-column field="high" title="高" width="100"></vxe-column>
          <vxe-column field="boxVolume" title="单箱体积" width="100"></vxe-column>
          <vxe-column field="totalVolume" title="总体积" width="100"></vxe-column>
          <vxe-column field="material" title="材质" width="120"></vxe-column>
          <vxe-column field="goodsUse" title="用途" width="120"></vxe-column>
          <vxe-column field="brand" title="品牌" width="120"></vxe-column>
          <vxe-column field="unitPrice" title="单价" width="120"></vxe-column>
          <vxe-column field="totalPrice" title="总价" width="120"></vxe-column>
          <vxe-column field="hsCode" title="海关编码" width="120"></vxe-column>
          <vxe-column field="goodsNature" title="货物性质" width="120"></vxe-column>
          <vxe-column type="image" field="imgLink" title="产品图片" width="120">
            <template #default="{ row }">
            <el-image style="width: auto; height: 50px" :src="row.imgLink" :preview-src-list="[row.imgLink]"> </el-image>
          </template>
          </vxe-column>
          <vxe-column field="mkdUrl" title="mkd地址" width="120"></vxe-column>
          <vxe-column field="amzUrl" title="amz地址" width="120"></vxe-column>
          <vxe-column field="personUrl" title="私人地址" width="120"></vxe-column>
          <vxe-column field="urgencyLevel" title="紧急程度" width="120"></vxe-column>
          <vxe-column field="remark" title="备注" width="120"></vxe-column>
          <vxe-column v-if="filterFormData.statusCode!=='已下单'" title="操作" width="80" fixed="right" align="center" show-overflow>
            <template #default="{ row }">
              <vxe-button size="mini" type="text" status="success" icon="vxe-icon-edit" @click="handleUpdateOutContainer(row)" content="修改"></vxe-button>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
      <div v-show="dialogFormVisible" width="60%">
        <vxe-modal v-if="dialogFormVisible" title="填充检测数据" v-model="dialogFormVisible" :visible.sync="dialogFormVisible"
        @close="handleCancelInContainer" width="60%">
          <vxe-form ref="createFrom" title-width="150" title-align="right" titleColon
          :data="createFormData" :items="createForm" :rules="createFromRules"
          @submit="handleSubmitInContainer('createFrom')" @reset="handleCancelInContainer('createFrom')">
            <template #inTimeSlot="{ data }">
              <el-date-picker style="width:100%" v-model="data.inTime" type="date" size="small" placeholder="请选择日期" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
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
            <el-button type="primary" @click="handleRefreshPageList">确 定</el-button>
            </div>
        </vxe-modal>
      </div>
    </template>
    <!-- 添加箱单组件 -->
    <AddPackingListFormDialogVue
      v-if="showAddPackingListFormDialog"
      :show.sync="showAddPackingListFormDialog">
    </AddPackingListFormDialogVue>
    <!-- 直接出库组件 -->
    <DirectOutContainerComponentVue
      v-if="showDirectOutContainer"
      :show.sync="showDirectOutContainer"
      @onSureClick="pageInContainerList">
    </DirectOutContainerComponentVue>
    <!-- 变更出库组件 -->
    <ChangeOutContainerComponentVue
      v-if="showChangeOutContainerComponent"
      :show.sync="showChangeOutContainerComponent"
      @onSureClick="pageInContainerList">
    </ChangeOutContainerComponentVue>
    <!-- 更新出库信息组件 -->
    <UpdateOutContainerComponentVue
      v-if="showUpdateOutContainerComponent"
      :show.sync="showUpdateOutContainerComponent"
      :defaultFormData="updateOutContainerForm"
      :dialogStatus="outContainerDialogStatus"
      @onSureClick="pageOutContainerList">
    </UpdateOutContainerComponentVue>
    <ChangePackingComponentVue
      v-if="showChangePacking"
      :show.sync="showChangePacking"
      :defaultFormData="changePackingForm"
      @onSureClick="pageOutContainerList">
    </ChangePackingComponentVue>
    <!-- 装箱组件 -->
    <EncasementShippingMarkComponentVue
      v-if="showEncasement"
      :show.sync="showEncasement"
      :shippingMarks="encasementShippingMark"
      @onSureClick="pageOutContainerList">
    </EncasementShippingMarkComponentVue>
    <template slot="footer">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="filterFormData.currentPage" :page-sizes="[10,20,30, 50]" :page-size="filterFormData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </template>
  </d2-container>
</template>

<script>
import $Big from '@/libs/big.js'
import mixins from '@/mixin/commonMixin.js'
import AddPackingListFormDialogVue from '@/views/business/packingList/components/addPackingListFormDialog.vue'
import DirectOutContainerComponentVue from '../outContainer/components/directOutContainerComponent.vue'
import ChangeOutContainerComponentVue from '../outContainer/components/changeOutContainerComponent.vue'
import UpdateOutContainerComponentVue from '../outContainer/components/updateOutContainerComponent.vue'
import ChangePackingComponentVue from '../outContainer/components/changePackingComponent.vue'
import PackingListTopGatherComponentVue from '../packingList/components/packingListTopGatherComponent.vue'
import EncasementShippingMarkComponentVue from './components/encasementShippingMarkComponent.vue'
import ExportButtonVue from '@/views/common/exportButton/exportButton.vue'
import { myMethods } from './js/inContainerMethod.js'
import moment from 'moment'
export default {
  name: 'inContainer',
  mixins: [mixins],
  components: {
    AddPackingListFormDialogVue,
    DirectOutContainerComponentVue,
    ChangeOutContainerComponentVue,
    UpdateOutContainerComponentVue,
    ChangePackingComponentVue,
    PackingListTopGatherComponentVue,
    EncasementShippingMarkComponentVue,
    ExportButtonVue
  },
  data() {
    return {
      encasementShippingMark: [],
      showEncasement: false,
      showChangePacking: false,
      outContainerDialogStatus: '',
      updateOutContainerForm: {},
      changePackingForm: {},
      showDirectOutContainer: false,
      showAddPackingListFormDialog: false,
      filterDialogVisible: false,
      goodsInfo: {},
      supplierData: [],
      applicationData: [],
      selectionOperateDatas: [],
      showChangeOutContainerComponent: false,
      showUpdateOutContainerComponent: false,
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
        statusCode: '已下单',
        shippingMark: '',
        packingGuid: ''
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
        totalBox: '',
        operateGuid: '',
        purNumber: '',
        purInNumber: '',
        purOutNumber: '',
        remeasureLength: '',
        remeasureWidth: '',
        remeasureHigh: '',
        remeasureVolume: '0',
        remeasureTotalVolume: '0',
        remeasureWeight: '',
        remeasureTotalWeight: '0',
        boxWeight: '',
        statusCode: '',
        goodsNature: '',
        qualityCode: 'OK',
        inTime: moment().format('YYYY-MM-DD h:mm:ss'),
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
            { field: 'sku', title: 'SKU', span: 12, itemRender: { name: '$input', props: { disabled: true, placeholder: '请输入单箱重称重' } } },
            { field: 'purNumber', title: '总数量', span: 12, itemRender: { name: '$input', props: { disabled: true, placeholder: '请输入单箱重称重' } } },
            { field: 'totalBox', title: '总箱数', span: 12, itemRender: { name: '$input', props: { disabled: true, placeholder: '请输入单箱重称重' } } },
            { field: 'remeasureWeight', title: '单箱重称重', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入单箱重称重' } } },
            { field: 'remeasureTotalWeight', title: '总重量', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入单箱重称重' } } },
            { field: 'remeasureLength', title: '重新测量长/CM', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入重新测量长' } } },
            { field: 'remeasureWidth', title: '重新测量宽/CM', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入重新测量宽' } } },
            { field: 'remeasureHigh', title: '重新测量高/CM', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入重新测量高' } } },
            { field: 'remeasureVolume', title: '重测体积/M', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入重测量体积' } } },
            { field: 'remeasureTotalVolume', title: '重测总体积/M', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入重测量体积' } } },
            {
              field: 'qualityCode',
              title: '质检情况',
              span: 12,
              itemRender: {
                name: '$select',
                options: [{ label: 'OK', value: 'OK' }, { label: 'NO', value: 'NO' }],
                props: { placeholder: '请输入质检情况' }
              }
            },
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
        this.createFormData.remeasureVolume = new $Big(nval || 0).times(this.createFormData.remeasureWidth || 0).times(this.createFormData.remeasureHigh || 0).div(1000000).toFixed(2).toString()
        this.createFormData.remeasureTotalVolume = new $Big(nval || 0).times(this.createFormData.remeasureWidth || 0).times(this.createFormData.remeasureHigh || 0).times(this.createFormData.totalBox || 0).div(1000000).toFixed(2).toString()
      }
    },
    'createFormData.remeasureWidth': {
      handler(nval, oval) {
        this.createFormData.remeasureVolume = new $Big(nval || 0).times(this.createFormData.remeasureLength || 0).times(this.createFormData.remeasureHigh || 0).div(1000000).toFixed(2).toString()
        this.createFormData.remeasureTotalVolume = new $Big(nval || 0).times(this.createFormData.remeasureLength || 0).times(this.createFormData.remeasureHigh || 0).times(this.createFormData.totalBox || 0).div(1000000).toFixed(2).toString()
      }
    },
    'createFormData.remeasureHigh': {
      handler(nval, oval) {
        this.createFormData.remeasureVolume = new $Big(nval || 0).times(this.createFormData.remeasureLength || 0).times(this.createFormData.remeasureWidth || 0).div(1000000).toFixed(2).toString()
        this.createFormData.remeasureTotalVolume = new $Big(nval || 0).times(this.createFormData.remeasureLength || 0).times(this.createFormData.remeasureWidth || 0).times(this.createFormData.totalBox || 0).div(1000000).toFixed(2).toString()
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
