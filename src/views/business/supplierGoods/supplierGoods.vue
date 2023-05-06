<!--店铺管理-->
<template>
  <d2-container>
    <template slot="header">
      <div style="float:left;padding-top:3px;width:80%">
        <el-input @keyup.enter.native="handleFilter" clearable style="width: 200px;margin-right: 20px;" class="filter-item" placeholder="供应商名称搜索" v-model="filterFormData.supplierName" size="small"> </el-input>
        <el-input @keyup.enter.native="handleFilter" clearable style="width: 200px;margin-right: 20px;" class="filter-item" placeholder="商名称搜索" v-model="filterFormData.goodsName" size="small"> </el-input>
        <el-input @keyup.enter.native="handleFilter" clearable style="width: 200px;margin-right: 20px;" class="filter-item" placeholder="商品类别搜索" v-model="filterFormData.goodsCategory" size="small"> </el-input>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleRefresh" size="small">搜索</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="handleRefresh" size="small">刷新</el-button>
      </div>
      <div style="float:right;">
        <el-button icon="vxe-icon-square-plus" type="success" size="medium" style="width:100px" @click="handleCreate">新增</el-button>
        <el-button icon="vxe-icon-edit" size="medium" style="width:100px" @click="handleUpdateBatch">修改</el-button>
        <el-button icon="vxe-icon-refresh" size="medium" style="width:100px" @click="pageList()">刷新</el-button>
      </div>
    </template>

    <template>
      <vxe-toolbar style="height:8%" :refresh="{query: pageList}" export custom zoom>
        <template #buttons>
          <el-button icon="vxe-icon-table" size="mini" style="width:120px">供应商商品表格</el-button>
          <!-- <el-button icon="vxe-icon-chart-pie" size="mini" style="width:120px" @click="filterDialogVisibleClick">过滤数据</el-button> -->
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
        :row-config="{isHover: true,isCurrent: true}"
        @cell-click="handleCellClickEvent"
        :data="tableData">
        <vxe-column type="checkbox" width="45"></vxe-column>
        <vxe-column type="seq" title="序号" width="60"></vxe-column>
        <vxe-column field="supplierName" title="供应商名称" width="120"></vxe-column>
        <vxe-column field="goodsName" title="商品名称" width="250"></vxe-column>
        <vxe-column field="goodsCategory" title="商品类别" width="150"></vxe-column>
        <vxe-column field="imgLink" title="产品图片" width="100" align="center">
          <template #default="{ row }">
            <el-image style="width: auto; height: 50px" :src="row.imgLink" :preview-src-list="[row.imgLink]"> </el-image>
          </template>
        </vxe-column>
        <vxe-column field="boxLength" title="单箱长/CM" width="100" :formatter="formatterTwoPoint"></vxe-column>
        <vxe-column field="boxWidth" title="单箱宽/CM" width="100" :formatter="formatterTwoPoint"></vxe-column>
        <vxe-column field="boxHigh" title="单箱高/CM" width="100" :formatter="formatterTwoPoint"></vxe-column>
        <vxe-column field="boxVolume" title="单箱体积/m³" width="120" :formatter="formatterVolume"></vxe-column>
        <vxe-column field="boxQuantity" title="每箱产品数" width="120"></vxe-column>
        <vxe-column field="singleAmount" title="单个价格" width="100" :formatter="formatterAmount"></vxe-column>
        <vxe-column field="boxWeight" title="单箱重量/KG" width="120" :formatter="formatterTwoPoint"></vxe-column>
        <vxe-column field="grade" title="评级" width="100" align="center"></vxe-column>
        <vxe-column field="supLink" title="供应链接" width="120">
          <template #default="{ row }">
            <vxe-button type="text" @dblclick="handleUrlLink(row.supLink)">{{ row.supLink }}</vxe-button>
          </template>
        </vxe-column>
        <vxe-column field="remark" title="备注" width="200"></vxe-column>
        <vxe-column title="操作" width="80" fixed="right" align="center" show-overflow>
          <template #default="{ row }">
            <!-- <vxe-button size="mini" type="text" status="success" icon="vxe-icon-edit" @click="handleUpdate(row)" content="修改"></vxe-button> -->
            <vxe-button size="mini" type="text" status="danger" icon="vxe-icon-delete" @click="handleRemove(row)" content="删除"></vxe-button>
          </template>
        </vxe-column>
      </vxe-table>
      <div v-show="dialogFormVisible" width="60%">
        <vxe-modal v-if="dialogFormVisible" title="新增数据页面" v-model="dialogFormVisible" :visible.sync="dialogFormVisible"
        @close="createModalClose" width="60%">
          <vxe-form ref="createFrom" title-width="120" title-align="right" titleColon
          :data="createFormData" :items="createForm" :rules="createFromRules"
          @submit="handleSubmitCreate('createFrom')" @reset="handleCancelCreate('createFrom')">
            <template #supplierGuidSlot="{ data }">
              <vxe-select v-model="data.supplierGuid" placeholder="请先选择商品信息" :options="supplierListData" filterable></vxe-select>
            </template>
            <template #buttonSlot>
              <vxe-button status="primary" content="新增供应商"  @click="handleAddSupplier()"></vxe-button>
            </template>
            <template  #goodsNameSlots="{ data }">
              <div v-if="dialogStatus==='create'">
                <el-tag :key="goods.guid" v-for="goods in selectedGoodsListData" closable :disable-transitions="false"
                @close="handleCloseGoodsTag(goods)">{{goods.goodsName}}</el-tag>
                <vxe-button status="primary" content="选择商品" style="margin-left:10px"  @click="handleChooseGoods(data)"></vxe-button>
              </div>
              <div v-if="dialogStatus==='update'">
                <el-tag :key="goods.guid" v-for="goods in selectedGoodsListData">{{goods.goodsName}}</el-tag>
              </div>
            </template>
          </vxe-form>
        </vxe-modal>
      </div>
      <GoodsShowComponent
        v-if="showGoodsComponent"
        :show.sync="showGoodsComponent"
        @onSureClick="selectedGoods"
      ></GoodsShowComponent>
      <SupplierAddComponentVue
        v-if="showAddSupplierComponent"
        :show.sync="showAddSupplierComponent"
        :dialogStatus="'create'"
        @onSureClick="getSupplierData(goodsInfo.categoryGuid)">
      </SupplierAddComponentVue>
    </template>

    <template slot="footer">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="filterFormData.currentPage" :page-sizes="[10,20,30, 50,100,200,500]" :page-size="filterFormData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </template>
  </d2-container>
</template>

<script>
import $Big from '@/libs/big.js'
import mixins from '@/mixin/commonMixin.js'
import GoodsShowComponent from '@/views/business/goods/components/goodsShowComponent.vue'
import SupplierAddComponentVue from '../supplier/components/supplierAddComponent.vue'

import { myMethods } from './js/supplierGoodsMethod.js'
export default {
  name: 'shopGoods',
  mixins: [mixins],
  components: { GoodsShowComponent, SupplierAddComponentVue },
  data() {
    return {
      selectedGoodsListData: [],
      showAddSupplierComponent: false,
      goodsInfo: {},
      supplierListData: [],
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
        supplierName: ''
      },
      createFormData: {
        categoryGuid: '',
        supplierGuid: '',
        supplierName: '',
        goodsName: '',
        goodsGuid: '',
        boxQuantity: '',
        grade: '',
        boxLength: '',
        boxWidth: '',
        boxHigh: '',
        boxVolume: '0',
        boxAmount: '',
        singleAmount: '',
        boxWeight: '',
        supLink: '',
        remark: ''
      },
      createFromRules: {
        supplierGuid: [
          { required: true, message: '请选择供应商', trigger: 'blur' }
        ],
        boxLength: [
          { required: true, message: '请输入单箱长', trigger: 'blur' }
        ],
        boxWidth: [
          { required: true, message: '请输入单箱宽', trigger: 'blur' }
        ],
        boxHigh: [
          { required: true, message: '请输入单箱高', trigger: 'blur' }
        ],
        boxVolume: [
          { required: true, message: '请输入单箱体积', trigger: 'blur' }
        ],
        boxQuantity: [
          { required: true, message: '请输入单箱产品数', trigger: 'blur' }
        ],
        singleAmount: [
          { required: true, message: '请输入单个价格', trigger: 'blur' }
        ]
      },
      createForm: [
        {
          title: '',
          span: 23,
          children: [
            { field: 'goodsName', title: '商品名称', span: 24, slots: { default: 'goodsNameSlots' } },
            {
              field: 'supplierGuid',
              title: '供应商',
              span: 9,
              slots: { default: 'supplierGuidSlot' }
            },
            {
              field: '',
              title: '',
              span: 3,
              slots: { default: 'buttonSlot' }
            },
            { field: 'boxLength', title: '单箱长/CM', span: 12, itemRender: { name: '$input', props: { type: 'float', placeholder: '请输入单箱长' } } },
            { field: 'boxWidth', title: '单箱宽/CM', span: 12, itemRender: { name: '$input', props: { type: 'float', placeholder: '请输入单箱宽' } } },
            { field: 'boxHigh', title: '单箱高/CM', span: 12, itemRender: { name: '$input', props: { type: 'float', placeholder: '请输入单箱高' } } },
            { field: 'boxVolume', title: '单箱体积/m³', span: 12, itemRender: { name: '$input', props: { type: 'float', placeholder: '请输入单箱体积' } } },
            { field: 'boxQuantity', title: '单箱产品数', span: 12, itemRender: { name: '$input', props: { type: 'integer', placeholder: '请输入单箱产品数量' } } },
            { field: 'singleAmount', title: '单个价格', span: 12, itemRender: { name: '$input', props: { type: 'float', placeholder: '具体看运营采购价格,此处只做估计' } } },
            { field: 'boxWeight', title: '单箱重量/KG', span: 12, itemRender: { name: '$input', props: { type: 'float', placeholder: '请输入单箱重量' } } },
            { field: 'supLink', title: '供应链接', span: 12, itemRender: { name: '$input', props: { placeholder: '建议填写具体商品供应链接,如无填写“无”' } } },
            { field: 'grade', title: '评级', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入评级' } } },
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
    'createFormData.supplierGuid': {
      handler(nval, oval) {
        this.supplierListData.forEach(element => {
          if (element.value === nval) {
            this.createFormData.supplierName = element.label
            this.createFormData.supplierGuid = nval
          }
        })
      }
    },
    'createFormData.boxLength': {
      handler(nval, oval) {
        this.createFormData.boxVolume = new $Big(nval || 0).times(this.createFormData.boxWidth || 0).times(this.createFormData.boxHigh || 0).div(1000000).toFixed(3).toString()
        console.log(this.createFormData.boxVolume)
      }
    },
    'createFormData.boxWidth': {
      handler(nval, oval) {
        this.createFormData.boxVolume = new $Big(nval || 0).times(this.createFormData.boxLength || 0).times(this.createFormData.boxHigh || 0).div(1000000).toFixed(3).toString()
      }
    },
    'createFormData.boxHigh': {
      handler(nval, oval) {
        this.createFormData.boxVolume = new $Big(nval || 0).times(this.createFormData.boxLength || 0).times(this.createFormData.boxWidth || 0).div(1000000).toFixed(3).toString()
      }
    }
  }
}
</script>
<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
