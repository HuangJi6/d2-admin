<template>
  <d2-container>
    <!-- <template slot="header">
      <el-input @keyup.enter.native="handleFilter" clearable style="width: 200px;margin-right: 20px;" class="filter-item" placeholder="姓名搜索" v-model="listQuery.userName" size="small"> </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" size="small">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="handleRefresh" size="small">刷新</el-button>
    </template> -->
    <template slot="header">
      <div style="float:left;padding-top:3px">
        <el-input @keyup.enter.native="handleFilter" clearable style="width: 200px;margin-right: 20px;" class="filter-item" placeholder="用户名称搜索" v-model="filterFormData.userName" size="small"> </el-input>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleRefresh" size="small">搜索</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="handleRefresh" size="small">刷新</el-button>
      </div>
      <div style="float:right;">
        <el-button icon="vxe-icon-square-plus" type="success" size="medium" style="width:100px" @click="handleCreate">新增</el-button>
        <el-button type="primary" size="medium" style="width:100px" @click="pageList()">刷新</el-button>
      </div>
    </template>
    <!-- <el-button class="filter-item"  v-permission:function="['userManager:btn_add']"  style="margin-left: 10px;" @click="handleCreate" type="primary" size="mini" icon="el-icon-circle-plus">添加</el-button> -->
    <template>
      <vxe-toolbar ref="vxeToolBarRef" style="height:8%" :refresh="{query: pageList}" custom zoom>
        <template #buttons>
          <el-button icon="vxe-icon-table" size="mini" style="width:120px">店铺管理</el-button>
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
        <vxe-column field="userName" title="姓名" width="200"></vxe-column>
        <vxe-column field="userCode" title="账户" width="200"></vxe-column>
        <vxe-column field="userSex" title="性别" width="200"></vxe-column>
        <vxe-column field="userPhone" title="电话号码" width="200"></vxe-column>
        <vxe-column field="description" title="备注" width="200"></vxe-column>
        <vxe-column title="操作" width="160" fixed="right" show-overflow>
          <template #default="{ row }">
            <vxe-button type="text" status="success" icon="vxe-icon-edit" @click="handleUpdate(row)">修改</vxe-button>
            <vxe-button type="text" status="danger" icon="vxe-icon-delete" @click="handleDelete(row)">删除</vxe-button>
          </template>
        </vxe-column>
      </vxe-table>
    </template>
  <!-- <el-table :key='tableKey' :data="list" v-loading.body="listLoading" size="small" stripe highlight-current-row style="width: 100%;margin-top: 10px">
    <el-table-column width="200" align="center" label="姓名"> <template slot-scope="scope" >
        <span>{{scope.row.userName}}</span>
      </template> </el-table-column>
    <el-table-column width="110" align="center" label="账户"> <template slot-scope="scope" >
            <span>{{scope.row.userCode}}</span>
          </template> </el-table-column>
    <el-table-column width="110" align="center" label="性别"> <template slot-scope="scope" >
            <span>{{scope.row.userSex}}</span>
          </template> </el-table-column>
    <el-table-column width="110" align="center" label="电话号码"> <template slot-scope="scope" >
            <span>{{scope.row.userPhone}}</span>
          </template> </el-table-column>
    <el-table-column width="200" align="center" label="备注"> <template slot-scope="scope" >
            <span>{{scope.row.description}}</span>
          </template> </el-table-column>
    <el-table-column width="100" align="center" label="最后时间"> <template slot-scope="scope" >
          <span>{{scope.row.updateTime}}</span>
        </template> </el-table-column>
    <el-table-column width="100" align="center" label="最后更新人"> <template slot-scope="scope" >
            <span>{{scope.row.updater}}</span>
          </template> </el-table-column>
    <el-table-column align="center" label="操作" width="150"> <template slot-scope="scope" >
    <el-button v-permission:function="['userManager:btn_edit']" size="small" type="success" @click="handleUpdate(scope.row)">编辑
    </el-button>
    <el-button v-permission:function="['userManager:btn_del']" size="small" type="danger" @click="handleDelete(scope.row)">删除
    </el-button>
      </template> </el-table-column>
  </el-table> -->
  <!-- <div v-show="!listLoading" class="pagination-container"> -->
  <div v-show="dialogFormVisible" width="60%">
    <vxe-modal v-if="dialogFormVisible" width="60%" title="新增数据页面" v-model="dialogFormVisible" :visible.sync="dialogFormVisible"
    @close="createModalClose">
      <vxe-form ref="createFrom" title-width="200" title-align="right" titleColon
      :data="createFormData" :items="createForm" :rules="createFromRules"
      @submit="handleSubmitCreate('createFrom')" @reset="handleCancelCreate('createFrom')">
      </vxe-form>
    </vxe-modal>
  </div>
  <template slot="footer">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.currentPage" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
  </template>
  <!-- </div> -->
  <!-- <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="姓名" prop="userName">
        <el-input v-model="form.userName" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="登录账户" prop="userCode">
        <el-input v-if="dialogStatus == 'create'" v-model="form.userCode" placeholder="请输入账户"></el-input>
        <el-input v-else v-model="form.userCode" placeholder="请输入账户" readonly></el-input>
      </el-form-item>
      <el-form-item label="登录密码" placeholder="请输入密码" prop="userPassword">
        <el-input type="password" v-model="form.userPassword" show-password></el-input>
      </el-form-item>
      <el-form-item label="电话号码" prop="userPhone">
        <el-input v-model="form.userPhone" placeholder="请输入联系方式"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-select class="filter-item" v-model="form.userSex" placeholder="请选择">
          <el-option v-for="item in  sexOptions" :key="item" :label="item" :value="item"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入内容" v-model="form.description"> </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel('form')">取 消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
      <el-button v-else type="primary" @click="update('form')">确 定</el-button>
    </div>
  </el-dialog> -->
  </d2-container>
</template>

<script>
import mixins from '@/mixin/commonMixin.js'
import { } from '@/api/variations/index'
import { myMethods } from './js/userManageMethod.js'
export default {
  name: 'userManager',
  mixins: [mixins],
  data() {
    return {
      filterFormData: {
        userName: ''
      },
      tableData: [],
      createFormData: {
        guid: undefined,
        userName: undefined,
        userCode: undefined,
        userSex: '男',
        userPassword: undefined,
        description: undefined,
        userPhone: undefined
      },
      createForm: [
        {
          title: '',
          align: 'center',
          span: 23,
          children: [
            { field: 'userName', title: '姓名', span: 20, itemRender: { name: '$input', props: { placeholder: '请输入姓名' } } },
            { field: 'userCode', title: '登录账户', span: 20, itemRender: { name: '$input', props: { placeholder: '请输入登录账户' } } },
            { field: 'userPassword', title: '登录密码', span: 20, itemRender: { name: '$input', props: { type: 'password', placeholder: '请输入登录密码' } } },
            { field: 'userPhone', title: '电话号码', span: 20, itemRender: { name: '$input', props: { placeholder: '请输入电话号码' } } },
            {
              field: 'userSex',
              title: '性别',
              span: 20,
              itemRender: {
                name: '$select',
                options: [{ label: '男', value: '男' }, { label: '女', value: '女' }],
                props: { placeholder: '请输入性别' }
              }
            },
            { field: 'description', title: '描述', span: 20, itemRender: { name: '$input', props: { placeholder: '请输入描述' } } }
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
      createFromRules: {
        userName: [
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        userCode: [
          { required: true, message: '请输入用户登录code', trigger: 'blur' }
        ],
        userPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      rules: {
        userName: [
          { required: true, message: '请输入用户', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        userCode: [
          { required: true, message: '请输入账户', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        userPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
        ]
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        currentPage: 1,
        pageSize: 20,
        userName: undefined
      },
      sexOptions: ['男', '女'],
      dialogFormVisible: false,
      dialogStatus: '',
      userManager_btn_edit: this.hasPermissions(['userManager:btn_edit']),
      userManager_btn_del: false,
      userManager_btn_add: true,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
    }
  },
  methods: {
    ...myMethods,
    handleSizeChange (val) {
      this.listQuery.pageSize = val
      this.pageList()
    },
    handleCurrentChange (val) {
      this.listQuery.currentPage = val
      this.pageList()
    },
    handleCreate () {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleCancelCreate (formName) {
      this.dialogFormVisible = false
      this.resetTemp()
    },
    resetTemp () {
      this.createFormData = {
        username: undefined,
        name: undefined,
        userSex: '男',
        password: undefined,
        description: undefined
      }
    }
  },
  created() {
    this.initCreated()
  },
  mounted() {
    this.initMounted()
  }

}
</script>

<style lang="scss">
.form-group {
  width: 600px; // 重新设置卡片阴影
}
</style>
