<!--店铺管理-->
<template>
  <d2-container>
    <template slot="header">
      <div style="height:40px">
        <div style="float:left;padding-top:3px;width:80%">
          <el-input @keyup.enter.native="handleFilter" clearable style="width: 10%;margin-right: 20px;" class="filter-item" placeholder="店铺搜索" v-model="filterFormData.shopName" size="small"> </el-input>
          <el-input @keyup.enter.native="handleFilter" clearable style="width: 10%;margin-right: 20px;" class="filter-item" placeholder="SKU搜索" v-model="filterFormData.sku" size="small"> </el-input>
          <el-input @keyup.enter.native="handleFilter" clearable style="width: 10%;margin-right: 20px;" class="filter-item" placeholder="ITEM ID搜索" v-model="filterFormData.itemId" size="small"> </el-input>
          <el-input @keyup.enter.native="handleFilter" clearable style="width: 10%;margin-right: 20px;" class="filter-item" placeholder="商名称搜索" v-model="filterFormData.goodsName" size="small"> </el-input>
          <el-input @keyup.enter.native="handleFilter" clearable style="width: 10%;margin-right: 20px;" class="filter-item" placeholder="商品类别搜索" v-model="filterFormData.goodsCategory" size="small"> </el-input>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleRefresh" size="small">搜索</el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="handleRefresh" size="small">刷新</el-button>
        </div>
        <div style="float:right;">
          <el-button icon="vxe-icon-square-plus" type="success" size="medium" style="width:100px" @click="handleCreate">新增</el-button>
          <el-button type="primary" size="medium" style="width:100px" @click="pageList()">刷新</el-button>
        </div>
      </div>
    </template>

    <template>
      <vxe-toolbar style="height:8%" :refresh="{query: pageList}" export custom zoom>
        <template #buttons>
          <el-button icon="vxe-icon-table" size="mini" style="width:120px">商品表格</el-button>
          <!-- <el-button icon="vxe-icon-chart-pie" size="mini" style="width:120px" @click="filterDialogVisibleClick">过滤数据</el-button> -->
        </template>
      </vxe-toolbar>
      <!-- style="min-height: 500px;" 设置最小高度不然vxe-table会报错! -->
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
        style="min-height: 600px;"
        :row-config="{isHover: true}"
        @cell-click="handleCellClickEvent"
        :data="tableData">
        <vxe-column type="checkbox" width="60"></vxe-column>
        <vxe-column type="seq" title="序号" width="60"></vxe-column>
        <vxe-column field="shopName" title="店铺名称" width="100"></vxe-column>
        <vxe-column field="optimizeStatus" title="优化标识" width="80"></vxe-column>
        <!-- <vxe-column field="statusCode" title="状态标识" width="150" align="center">
          <template #default="{ row }">
            <el-button v-if="row.statusCode==='暂定'" size="mini">{{ row.statusCode }}</el-button>
            <el-button v-if="row.statusCode==='未出售-未上架'" type="primary" size="mini">{{ row.statusCode }}</el-button>
            <el-button v-if="row.statusCode==='未出售-库存不足'" type="danger" size="mini">{{ row.statusCode }}</el-button>
            <el-button v-if="row.statusCode==='已出售-库存充足'" type="success" size="mini">{{ row.statusCode }}</el-button>
            <el-button v-if="row.statusCode==='已出售-库存不足'" type="warning" size="mini">{{ row.statusCode }}</el-button>
            <el-button v-if="row.statusCode==='不出售-商品下架'" type="info" size="mini">{{ row.statusCode }}</el-button>
          </template>
        </vxe-column> -->
        <vxe-column field="sku" title="SKU" width="120"></vxe-column>
        <vxe-column field="itemId" title="ITEM ID" width="120"></vxe-column>
        <vxe-column field="mlCode" title="ML CODE" width="120"></vxe-column>
        <vxe-column field="upcCode" title="UPC码" width="100"></vxe-column>
        <vxe-column field="goodsName" title="商品名称" width="150"></vxe-column>
        <vxe-column field="imgLink" title="产品图片" width="100" align="center">
          <template #default="{ row }">
            <el-image style="width: auto; height: 50px" :src="row.imgLink" :preview-src-list="[row.imgLink]"> </el-image>
          </template>
        </vxe-column>
        <vxe-column field="hsCode" title="HS CODE" width="120"></vxe-column>
        <vxe-column field="goodsLink" title="商品链接" width="150"></vxe-column>
        <vxe-column field="imgLink" title="图片链接" width="150"></vxe-column>
        <vxe-column field="material" title="材料" width="100"></vxe-column>
        <vxe-column field="grade" title="评级" width="100"></vxe-column>
        <vxe-column field="goodsLength" title="商品-长" width="100"></vxe-column>
        <vxe-column field="goodsWidth" title="商品-宽" width="100"></vxe-column>
        <vxe-column field="goodsHigh" title="商品-高" width="100"></vxe-column>
        <vxe-column field="goodsWeight" title="商品-重量" width="100"></vxe-column>
        <vxe-column field="goodsPrice" title="商品-单价" width="100"></vxe-column>
        <vxe-column field="goodsUse" title="商品-用途" width="100"></vxe-column>
        <vxe-column field="brand" title="商品-品牌" width="100"></vxe-column>
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
            <template #goodsNameSlots="{ data }">
              <span> {{ data.goodsName }}  </span>
              <vxe-button status="primary" content="选择商品"  @click="handleChooseGoods(data)"></vxe-button>
              <vxe-button status="primary" content="新增商品"  @click="handleChooseGoods(data)"></vxe-button>
            </template>
          </vxe-form>
        </vxe-modal>
      </div>
      <GoodsShowComponent
        v-if="showGoodsComponent"
        :show.sync="showGoodsComponent"
        @onSureClick="selectedGoods"
      ></GoodsShowComponent>
    </template>

    <template slot="footer">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="filterFormData.currentPage" :page-sizes="[10,20,30, 50]" :page-size="filterFormData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </template>
  </d2-container>
</template>

<script>
import mixins from '@/mixin/commonMixin.js'
import GoodsShowComponent from '@/views/business/goods/components/goodsShowComponent.vue'
import { myMethods } from './js/shopGoodsMethod.js'
export default {
  name: 'shopGoods',
  mixins: [mixins],
  components: { GoodsShowComponent },
  data() {
    return {
      goodsInfo: {},
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
        goodsCategory: '',
        shopName: '',
        sku: '',
        itemId: ''
      },
      createFormData: {
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
            {
              field: 'clientId',
              title: '店铺名称',
              span: 12,
              itemRender: {
                name: '$select',
                options: [{ value: '0', label: '女' }, { value: '1', label: '男' }],
                props: { clearable: true, placeholder: '请输入名称' }
              }
            },
            { field: 'goodsName', title: '商品名称', span: 12, slots: { default: 'goodsNameSlots' } },
            {
              field: 'optimizeStatus',
              title: '优化标识',
              span: 12,
              itemRender: {
                name: '$select',
                options: [{ value: '未优化', label: '未优化' }, { value: '已优化', label: '已优化' }],
                props: { placeholder: '请输入优化标识' }
              }
            },
            { field: 'sku', title: 'SKU', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入SKU' } } },
            { field: 'itemId', title: 'ITEM ID', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入供应商地址' } } },
            { field: 'mlCode', title: 'ML CODE', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入供应类别' } } },
            // {
            //   field: 'statusCode',
            //   title: '状态标识',
            //   span: 12,
            //   itemRender: {
            //     name: '$select',
            //     options: [
            //       { value: '暂定', label: '暂定' },
            //       { value: '未出售-未上架', label: '未出售-未上架' },
            //       { value: '未出售-库存不足', label: '未出售-库存不足' },
            //       { value: '已出售-库存充足', label: '已出售-库存充足' },
            //       { value: '已出售-库存不足', label: '已出售-库存不足' },
            //       { value: '不出售-商品下架', label: '不出售-商品下架' }],
            //     props: { placeholder: '请输入付款账户' }
            //   }
            // },
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
