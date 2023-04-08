<!--店铺管理-->
<template>
  <d2-container>
    <template slot="header">
      <div style="float:left;padding-top:3px;width:80%">
        <el-input @keyup.enter.native="handleFilter" clearable style="width: 200px;margin-right: 20px;" class="filter-item" placeholder="供应商名称搜索" v-model="filterFormData.supName" size="small"> </el-input>
        <el-input @keyup.enter.native="handleFilter" clearable style="width: 200px;margin-right: 20px;" class="filter-item" placeholder="供应类别搜索" v-model="filterFormData.supCategory" size="small"> </el-input>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleRefresh" size="small">搜索</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="handleRefresh" size="small">刷新</el-button>
      </div>
      <div style="float:right;">
        <el-button icon="vxe-icon-square-plus" type="success" size="medium" style="width:100px" @click="handleCreate">新增</el-button>
        <el-button type="primary" size="medium" style="width:100px" @click="pageList()">刷新</el-button>
      </div>
    </template>

    <template>
      <vxe-toolbar style="height:8%" :refresh="{query: pageList}" export custom zoom>
        <template #buttons>
          <el-button icon="vxe-icon-table" size="mini" style="width:120px">供应商管理</el-button>
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
        :row-config="{isHover: true}"
        :data="tableData">
        <vxe-column type="checkbox" width="60"></vxe-column>
        <vxe-column type="seq" title="序号" width="60"></vxe-column>
        <vxe-column field="supName" title="供应商名称" width="200"></vxe-column>
        <vxe-column field="linkName" title="联系人" width="150"></vxe-column>
        <vxe-column field="linkPhone" title="联系电话" width="200"></vxe-column>
        <vxe-column field="supAddress" title="供应商地址" width="200"></vxe-column>
        <vxe-column field="supCategory" title="供应类别" width="200"></vxe-column>
        <vxe-column field="account" title="付款账号" width="200"></vxe-column>
        <vxe-column field="grade" title="评级" width="100"></vxe-column>
        <vxe-column field="qualification" title="资质信息" width="200"></vxe-column>
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
        @close="createModalClose" width="60%">
          <vxe-form ref="createFrom" title-width="100" title-align="right" titleColon
          :data="createFormData" :items="createForm" :rules="createFromRules"
          @submit="handleSubmitCreate('createFrom')" @reset="handleCancelCreate('createFrom')">
          <template #supCategorySlot>
            <ChooseCategoryComponentsVue
            :selectedCategory="createFormData.supCategory"
            :defaultCheckedKeys="createFormData.categoryGuids"
            :busGuid="createFormData.guid"
            @onSureClick="categorySureClick">
            </ChooseCategoryComponentsVue>
          </template>
          </vxe-form>
        </vxe-modal>
      </div>
    </template>

    <template slot="footer">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="filterFormData.currentPage" :page-sizes="[10,20,30, 50]" :page-size="filterFormData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </template>
  </d2-container>
</template>

<script>
import mixins from '@/mixin/commonMixin.js'
import { myMethods } from './js/supplierMethod.js'
import ChooseCategoryComponentsVue from '../category/components/chooseCategoryComponents.vue'
export default {
  components: { ChooseCategoryComponentsVue },
  name: 'application',
  mixins: [mixins],
  data() {
    return {
      busGuid: '',
      defaultCheckedKeys: [],
      categoryList: [],
      dialogStatus: '',
      dialogFormVisible: false,
      tableData: [],
      listLoading: false,
      total: null,
      filterFormData: {
        currentPage: 1,
        pageSize: 20,
        supName: '',
        supCategory: ''
      },
      createFormData: {
        supName: '',
        linkName: '',
        linkPhone: '',
        supAddress: '',
        supCategory: '',
        account: '',
        grade: '',
        qualification: '',
        remark: '',
        categoryGuids: []
      },
      createFromRules: {
        supName: [
          { required: true, message: '请输入供应商名称', trigger: 'blur' }
        ]
      },
      createForm: [
        {
          title: '',
          span: 23,
          children: [
            { field: 'supName', title: '供应商名称', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入供应商名称' } } },
            { field: 'supCategory', title: '供应类别', span: 12, slots: { default: 'supCategorySlot' } },
            { field: 'linkName', title: '联系人', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入联系人' } } },
            { field: 'linkPhone', title: '联系电话', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入联系电话' } } },
            { field: 'supAddress', title: '供应商地址', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入供应商地址' } } },
            { field: 'account', title: '付款账户', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入付款账户' } } },
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
            { field: 'qualification', title: '资质信息', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入资质信息' } } },
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
