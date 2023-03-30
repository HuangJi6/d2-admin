<!--店铺管理-->
<template>
  <d2-container>
    <template slot="header">
      <div style="float:left;padding-top:3px;width:80%">
        <el-input @keyup.enter.native="handleFilter" clearable style="width: 200px;margin-right: 20px;" class="filter-item" placeholder="商名称搜索" v-model="filterFormData.goodsName" size="small"> </el-input>
        <el-input @keyup.enter.native="handleFilter" clearable style="width: 200px;margin-right: 20px;" class="filter-item" placeholder="商品类别搜索" v-model="filterFormData.goodsCategory" size="small"> </el-input>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleRefresh" size="small">搜索</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="handleRefresh" size="small">刷新</el-button>
      </div>
      <div style="float:right;">
        <el-button icon="vxe-icon-square-plus" type="success" size="medium" style="width:100px" @click="handleCreate">新增</el-button>
        <el-button type="primary" size="medium" style="width:100px" @click="pageList()">刷新</el-button>
      </div>
    </template>

    <template>
      <vxe-toolbar style="height:10%" :refresh="{query: pageList}" export print custom zoom>
        <template #buttons>
          <el-button icon="vxe-icon-table" size="mini" style="width:120px">商品表格</el-button>
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
        height="90%"
        :row-config="{isHover: true}"
        @cell-click="handleCellClickEvent"
        :data="tableData">
        <vxe-column type="checkbox" width="60"></vxe-column>
        <vxe-column type="seq" title="序号" width="60"></vxe-column>
        <vxe-column field="goodsName" title="商品名称" width="150"></vxe-column>
        <vxe-column field="goodsCategory" title="商品类别" width="150"></vxe-column>
        <vxe-column field="goodsLink" title="商品链接" width="150"></vxe-column>
        <vxe-column field="upcCode" title="UPC码" width="100"></vxe-column>
        <vxe-column field="imgLink" title="图片链接" width="150"></vxe-column>
        <vxe-column field="imgLink" title="产品图片" width="100">
          <template #default="{ row }">
            <el-image style="width: auto; height: 50px" :src="row.imgLink" :preview-src-list="[row.imgLink]"> </el-image>
            <!-- <img v-if="row.imgLink" :src="row.imgLink" height="45"> -->
          </template>
        </vxe-column>
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
        <vxe-column title="操作" width="160" fixed="right" show-overflow>
          <template #default="{ row }">
            <vxe-button type="text" status="success" icon="vxe-icon-edit" @click="handleUpdate(row)">修改</vxe-button>
            <vxe-button type="text" status="danger" icon="vxe-icon-delete" @click="handleRemove(row)">删除</vxe-button>
          </template>
        </vxe-column>
      </vxe-table>
      <div v-show="dialogFormVisible" width="60%">
        <vxe-modal v-if="dialogFormVisible" title="新增数据页面" v-model="dialogFormVisible" :visible.sync="dialogFormVisible"
        @close="createModalClose" width="1600">
          <vxe-form ref="createFrom" title-width="100" title-align="right" titleColon
          :data="createFormData" :items="createForm" :rules="createFromRules"
          @submit="handleSubmitCreate('createFrom')" @reset="handleCancelCreate('createFrom')">
          </vxe-form>
        </vxe-modal>
      </div>
      <div v-show="dialogImgVisible" width="50%">
        <el-image style="width: 100px; height: 100px" :src="imgShowUrl" :preview-src-list="srcList">
        </el-image>
      </div>
    </template>

    <template slot="footer">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="filterFormData.currentPage" :page-sizes="[10,20,30, 50]" :page-size="filterFormData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </template>
  </d2-container>
</template>

<script>
import mixins from '@/mixin/commonMixin.js'
import { myMethods } from './js/goodsMethod.js'
export default {
  name: 'application',
  mixins: [mixins],
  data() {
    return {
      dialogStatus: '',
      dialogFormVisible: false,
      tableData: [],
      listLoading: false,
      total: null,
      filterFormData: {
        currentPage: 1,
        pageSize: 20,
        goodsName: '',
        goodsCategory: ''
      },
      createFormData: {
        goodsName: '',
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
            { field: 'goodsName', title: '商品名称', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入供应商名称' } } },
            { field: 'goodsCategory', title: '商品类别', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入联系人' } } },
            { field: 'goodsLink', title: '商品链接', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入联系电话' } } },
            { field: 'upcCode', title: 'UPC码', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入供应商地址' } } },
            { field: 'imgLink', title: '图片链接', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入供应类别' } } },
            { field: 'material', title: '材料', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入付款账户' } } },
            {
              field: 'grade',
              title: '评级',
              span: 12,
              itemRender: {
                name: '$select',
                options: [{ label: 'A', value: 'A', key: 'A' }, { label: 'B', value: 'B', key: 'B' }, { label: 'C', value: 'C', key: 'C' }],
                props: { placeholder: '请输入评级' }
              }
            },
            { field: 'goodsLength', title: '商品-长', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入资质信息' } } },
            { field: 'goodsWidth', title: '商品-宽', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入资质信息' } } },
            { field: 'goodsHigh', title: '商品-高', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入资质信息' } } },
            { field: 'goodsWeight', title: '商品-重量', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入资质信息' } } },
            { field: 'goodsPrice', title: '商品-单价', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入资质信息' } } },
            { field: 'goodsUse', title: '商品-用途', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入资质信息' } } },
            { field: 'brand', title: '商品-品牌', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入资质信息' } } },
            { field: 'remark', title: '备注', span: 24, itemRender: { name: '$input', props: { placeholder: '请输入备注' } } }
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
  }
}
</script>
