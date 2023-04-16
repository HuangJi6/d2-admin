<!--店铺管理-->
<template>
  <d2-container>
    <template slot="header">
      <div style="float:left;padding-top:3px">
        <el-input @keyup.enter.native="handleFilter" clearable style="width: 200px;margin-right: 20px;" class="filter-item" placeholder="店铺名称搜索" v-model="filterFormData.shopName" size="small"> </el-input>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleRefresh" size="small">搜索</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="handleRefresh" size="small">刷新</el-button>
      </div>
      <div style="float:right;">
        <el-button icon="vxe-icon-square-plus" type="success" size="medium" style="width:100px" @click="handleCreate">新增</el-button>
        <el-button type="primary" size="medium" style="width:100px" @click="pageList()">刷新</el-button>
      </div>
    </template>

    <template>
      <vxe-toolbar ref="vxeToolBarRef" style="height:8%" :refresh="{query: pageList}" custom zoom>
        <template #buttons>
          <el-button icon="vxe-icon-table" size="mini" style="width:120px">店铺管理</el-button>
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
        <vxe-column type="checkbox" width="45"></vxe-column>
        <vxe-column type="seq" title="序号" width="60"></vxe-column>
        <vxe-column field="shopName" title="店铺名称" width="200"></vxe-column>
        <vxe-column field="clientId" title="店铺id" width="200"></vxe-column>
        <vxe-column field="shopEmail" title="店铺邮箱" width="200"></vxe-column>
        <vxe-column field="shopPhone" title="店铺联系电话" width="200"></vxe-column>
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
          <vxe-form ref="createFrom" title-width="120" title-align="right" titleColon
          :data="createFormData" :items="createForm" :rules="createFromRules"
          @submit="handleSubmitCreate('createFrom')" @reset="handleCancelCreate('createFrom')">
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
import { myMethods } from './js/applicationMethod.js'
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
        shopName: ''
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
