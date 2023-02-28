<template>
  <d2-container>
    <template slot="header">
      <el-input @keyup.enter.native="handleFilter" clearable="true" style="width: 200px;margin-right: 20px;" class="filter-item" placeholder="姓名搜索" v-model="listQuery.user_name" size="small"> </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" size="small">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="handleRefresh" size="small">刷新</el-button>
    </template>
    <el-button class="filter-item"  v-permission:function="['userManager:btn_add']"  style="margin-left: 10px;" @click="handleCreate" type="primary" size="mini" icon="el-icon-circle-plus">添加</el-button>
  <el-table :key='tableKey' :data="list" v-loading.body="listLoading" size="small" stripe highlight-current-row style="width: 100%;margin-top: 10px">
    <el-table-column width="200" align="center" label="姓名"> <template slot-scope="scope" >
        <span>{{scope.row.user_name}}</span>
      </template> </el-table-column>
    <el-table-column width="110" align="center" label="账户"> <template slot-scope="scope" >
            <span>{{scope.row.user_code}}</span>
          </template> </el-table-column>
    <el-table-column width="110" align="center" label="性别"> <template slot-scope="scope" >
            <span>{{scope.row.user_sex}}</span>
          </template> </el-table-column>
    <el-table-column width="110" align="center" label="电话号码"> <template slot-scope="scope" >
            <span>{{scope.row.user_phone}}</span>
          </template> </el-table-column>
    <el-table-column width="200" align="center" label="备注"> <template slot-scope="scope" >
            <span>{{scope.row.description}}</span>
          </template> </el-table-column>
    <el-table-column width="100" align="center" label="最后时间"> <template slot-scope="scope" >
          <span>{{scope.row.update_time}}</span>
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
  </el-table>
  <!-- <div v-show="!listLoading" class="pagination-container"> -->
  <template slot="footer">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.currentPage" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
  </template>
  <!-- </div> -->
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="姓名" prop="user_name">
        <el-input v-model="form.user_name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="登录账户" prop="user_code">
        <el-input v-if="dialogStatus == 'create'" v-model="form.user_code" placeholder="请输入账户"></el-input>
        <el-input v-else v-model="form.user_code" placeholder="请输入账户" readonly></el-input>
      </el-form-item>
      <el-form-item label="登录密码" placeholder="请输入密码" prop="user_password">
        <el-input type="password" v-model="form.user_password"></el-input>
      </el-form-item>
      <el-form-item label="电话号码" prop="user_phone">
        <el-input v-model="form.user_phone" placeholder="请输入联系方式"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-select class="filter-item" v-model="form.user_sex" placeholder="请选择">
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
  </el-dialog>
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
      form: {
        guid: undefined,
        user_name: undefined,
        user_code: undefined,
        user_sex: '男',
        user_password: undefined,
        description: undefined,
        user_phone: undefined
      },
      rules: {
        user_name: [
          { required: true, message: '请输入用户', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        user_code: [
          { required: true, message: '请输入账户', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        user_password: [
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
        user_name: undefined
      },
      sexOptions: ['男', '女'],
      dialogFormVisible: false,
      dialogStatus: '',
      userManager_btn_edit: true,
      userManager_btn_del: false,
      userManager_btn_add: false,
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
    cancel (formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
    },
    resetTemp () {
      this.form = {
        username: undefined,
        name: undefined,
        sex: '男',
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
