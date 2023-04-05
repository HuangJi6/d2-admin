<!--店铺管理-->
<template>
  <d2-container>
    <template slot="header">
      <div style="float:left;padding-top:3px">
        <el-radio-group @input="pageList()" v-model="filterFormData.statusCode" size="medium">
          <el-radio-button label="全部" @click="pageList()">全部</el-radio-button>
          <el-radio-button label="未出" @click="pageList()">未出</el-radio-button>
          <el-radio-button label="运输中" @click="pageList()">运输中</el-radio-button>
          <el-radio-button label="已完成" @click="pageList()">已完成</el-radio-button>
        </el-radio-group>
      </div>
      <div style="float:right;">
        <el-button icon="vxe-icon-square-plus" type="success" size="medium" style="width:100px" @click="handleCreate">新增</el-button>
        <el-button type="primary" size="medium" style="width:100px" @click="pageList()">刷新</el-button>
      </div>
    </template>

    <template>
      <vxe-toolbar style="height:8%" :refresh="{query: pageList}" export print custom zoom>
        <template #buttons>
          <el-button icon="vxe-icon-table" size="mini" style="width:120px">箱单表</el-button>
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
        <vxe-column field="packingNo" title="箱单号" width="150"></vxe-column>
        <vxe-column field="outTime" title="出库时间" width="150"></vxe-column>
        <vxe-column field="statusCode" title="状态" width="150"></vxe-column>
        <vxe-column field="outTotalVolume" title="出库总体积" width="120"></vxe-column>
        <vxe-column field="outTotalWeight" title="出库总重量" width="120"></vxe-column>
        <vxe-column field="outTotalAmount" title="出库总金额" width="120"></vxe-column>
        <vxe-column field="limitVolume" title="上限体积" width="120"></vxe-column>
        <vxe-column field="limitWeight" title="上限重量" width="120"></vxe-column>
        <vxe-column field="outExpenses" title="箱单运费" width="120"></vxe-column>
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
            <template #outTime="{ data }">
              <el-date-picker style="width:100%" v-model="data.outTime" type="date" size="small" placeholder="请选择日期" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
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
import { myMethods } from './js/packingListMethod.js'
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
        statusCode: '全部',
        packingNo: '',
        outTime: ''
      },
      searchForm: [
        {
          title: '左侧',
          span: 24,
          children: [
            { field: 'packingNo', title: '箱单号', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入店铺名称' } } },
            { field: 'outTime', title: '出库时间', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入商品名称' } } }
          ]
        }
      ],
      createFormData: {
        packingNo: '',
        outTime: '',
        statusCode: '',
        outTotalVolume: '',
        outTotalWeight: '',
        outTotalAmount: '',
        limitVolume: '',
        limitWeight: '',
        outExpenses: '',
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
            { field: 'packingNo', title: '箱单号', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入箱唛' } } },
            { field: 'outTime', title: '出库时间', span: 12, slots: { default: 'outTime' } },
            {
              field: 'statusCode',
              title: '箱单状态',
              span: 12,
              itemRender: {
                name: '$select',
                options: [{ value: '未出', label: '未出' }, { value: '运输中', label: '运输中' }, { value: '已完成', label: '已完成' }],
                props: { placeholder: '请输入箱唛' }
              }
            },
            { field: 'outTotalVolume', title: '出库总体积', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入供应商地址' } } },
            { field: 'outTotalWeight', title: '出库总重量', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入供应商地址' } } },
            { field: 'outTotalAmount', title: '出库总金额', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入供应商地址' } } },
            { field: 'limitVolume', title: '上限体积', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入供应商地址' } } },
            { field: 'limitWeight', title: '上限重量', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入供应类别' } } },
            { field: 'outExpenses', title: '箱单运费', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入供应类别' } } },
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
