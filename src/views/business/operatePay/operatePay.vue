<!--店铺管理-->
<template>
  <d2-container>
    <template slot="header">
      <div style="float:left;padding-top:3px">
        <el-radio-group @input="pageList()" v-model="filterFormData.statusCode" size="medium">
          <el-radio-button label="待付款" @click="pageList()">待付款</el-radio-button>
          <!-- <el-radio-button label="付款记录" @click="pageList()">付款记录</el-radio-button> -->
        </el-radio-group>
      </div>
      <div style="float:right;">
        <el-button v-show="filterFormData.statusCode === '待付款'" icon="vxe-icon-square-plus" size="medium" style="width:100px" @click="handleOperatePay">付款</el-button>
        <!-- <el-button v-show="filterFormData.statusCode === '待付款'" size="medium" @click="handleRemoveOperatePay">清空付款信息</el-button> -->
        <el-button type="primary" size="medium" style="width:100px" @click="pageList()">刷新</el-button>
      </div>
    </template>

    <template>
      <vxe-toolbar ref="vxeToolBarRef" style="height:8%" :refresh="{query: pageList}" custom zoom>
        <template #buttons>
          <el-button icon="vxe-icon-table" size="mini" style="width:120px">采购付款</el-button>
          <el-button icon="vxe-icon-chart-pie" size="mini" style="width:120px" @click="HandlefilterDialogClick">过滤数据</el-button>
          <el-switch v-if="filterFormData.statusCode === '待付款'" style="margin-left:20px" v-model="showAll" active-text="展示全部" inactive-text="展示待付"></el-switch>
        </template>
      </vxe-toolbar>
      <vxe-table
        v-if="filterFormData.statusCode === '待付款'"
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
        :checkbox-config="{highlight: true}"
        :tree-config="{transform: true, rowField: 'guid', parentField: 'batchId',lazy:true,hasChild: 'hasChild',loadMethod: loadChildrenMethod}"
        :row-config="{isHover: true,isCurrent: true}"
        :data="tableData">
        <vxe-column type="checkbox" width="45"></vxe-column>
        <vxe-column type="seq" title="序号" width="60" tree-node></vxe-column>
        <vxe-column field="purNo" title="采购单号" width="150" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.hasChild">{{row.purNo}}</el-tag>
          </template>
        </vxe-column>
        <vxe-column field="shopName" title="店铺名称" width="100"></vxe-column>
        <vxe-column field="goodsName" title="商品名称" width="250"></vxe-column>
        <vxe-column field="sku" title="SKU" width="120"></vxe-column>
        <vxe-column field="itemId" title="ITEM ID" width="120"></vxe-column>
        <vxe-column field="purNumber" title="采购数量" width="120"></vxe-column>
        <vxe-column field="purAmount" title="采购金额" width="120" :formatter="formatterAmount"></vxe-column>
        <vxe-column field="shipAmount" title="运输价格" width="120" :formatter="formatterAmount"></vxe-column>
        <vxe-column field="sumAmount" title="采购总额" width="120" :formatter="formatterAmount"></vxe-column>
        <vxe-column field="hasPayAmount" title="已支付金额" width="120" :formatter="formatterAmount">
          <template #default="{ row }">
            <vxe-button v-if="row.hasChild" type="text" @click="findPurPayDetail(row)" style="color:#37a700">{{formatterAmount({cellValue:row.sumAmount-row.noPayAmount})}}</vxe-button>
          </template>
        </vxe-column>
        <vxe-column field="noPayAmount" title="未支付金额" width="120" :formatter="formatterAmount">
          <template #default="{ row }">
            <span v-if="row.hasChild" style="color:red">{{formatterAmount({cellValue:row.noPayAmount})}}</span>
          </template>
        </vxe-column>
        <vxe-column field="payer" title="付款人" width="120"></vxe-column>
        <vxe-column v-if="filterFormData.statusCode==='待付款'" title="操作" width="100" fixed="right" align="center" show-overflow>
          <template #default="{ row }">
            <vxe-button v-if="row.hasChild" size="mini" status="danger"  @click="handleRemoveOperatePay1(row)" content="移除付款"></vxe-button>
          </template>
        </vxe-column>
      </vxe-table>
      <vxe-table
        v-if="false"
        class="mytable-scrollbar"
        size="medium"
        header-cell-class-name="headerClassName"
        cell-class-name="cellClassName"
        border
        resizable
        show-overflow
        show-header-overflow
        v-loading.body="listLoading"
        ref="vxeTableRef1"
        height="92%"
        :row-config="{isHover: true,isCurrent: true}"
        :data="tableData">
        <vxe-column type="checkbox" width="45"></vxe-column>
        <vxe-column type="seq" title="序号" width="60"></vxe-column>
        <vxe-column field="purNo" title="采购单号" width="150" align="center"></vxe-column>
        <vxe-column field="shopName" title="店铺名称" width="100"></vxe-column>
        <vxe-column field="goodsName" title="商品名称" width="250"></vxe-column>
        <vxe-column field="sku" title="SKU" width="120"></vxe-column>
        <vxe-column field="itemId" title="ITEM ID" width="120"></vxe-column>
        <vxe-column field="purAmount" title="采购金额" width="120"></vxe-column>
        <vxe-column field="shipAmount" title="运输价格" width="120"></vxe-column>
        <vxe-column field="sumAmount" title="采购总额" width="120"></vxe-column>
        <vxe-column field="payer" title="付款人" width="120"></vxe-column>
        <vxe-column field="payAccount" title="付款账户" width="120"></vxe-column>
        <vxe-column field="payAmount" title="付款金额" width="120"></vxe-column>
        <vxe-column field="purTime" title="采购时间" width="120"></vxe-column>
      </vxe-table>
      <OperatePayChooseComponent
      v-if="dialogFormVisible"
      :show.sync="dialogFormVisible"
      :operatePayData="operatePayData"
      @onSureClick="pageList">
      </OperatePayChooseComponent>
    </template>

    <template slot="footer">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="filterFormData.currentPage" :page-sizes="[10,20,30, 50,100,200,500]" :page-size="filterFormData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </template>
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
  </d2-container>
</template>

<script>
import mixins from '@/mixin/commonMixin.js'
import { myMethods } from './js/operatePayMethod.js'
import OperatePayChooseComponent from '@/views/business/operatePay/components/operatePayChooseComponent'
export default {
  name: 'application',
  mixins: [mixins],
  components: { OperatePayChooseComponent },
  data() {
    return {
      showAll: false,
      filterDialogVisible: false,
      operatePayData: {},
      dialogStatus: '',
      dialogFormVisible: false,
      tableData: [],
      listLoading: false,
      total: null,
      filterFormData: {
        currentPage: 1,
        pageSize: 20,
        shopName: '',
        statusCode: '待付款'
      },
      createFormData: {
        shopName: '',
        clientId: '',
        shopEmail: '',
        shopPhone: ''
      },
      createFromRules: {
        shopName: [
          { required: true, message: '请输入用户', trigger: 'blur' }
        ],
        clientId: [
          { required: true, message: '请输入clientId', trigger: 'blur' }
        ]
      },
      createForm: [
        {
          title: '',
          span: 23,
          children: [
            { field: 'shopName', title: '店铺名称', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入店铺名称' } } },
            { field: 'clientId', title: '店铺ID', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入店铺ID' } } },
            { field: 'shopEmail', title: '店铺邮箱', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入店铺邮箱' } } },
            { field: 'shopPhone', title: '联系电话', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入店铺联系电话' } } }
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
      searchForm: [
        {
          title: '左侧',
          span: 24,
          children: [
            { field: 'purNo', title: '采购单号', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入采购单号' } } },
            { field: 'shopName', title: '店铺名称', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入店铺名称' } } },
            { field: 'goodsName', title: '商品名称', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入商品名称' } } },
            { field: 'suk', title: 'SKU', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入SKU' } } },
            { field: 'itemId', title: 'ITEM ID', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入ITEM ID' } } }]
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
    showAll: {
      handler(nval, oval) {
        this.pageList()
      }
    }
  }
}
</script>
