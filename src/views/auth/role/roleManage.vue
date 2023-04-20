<template>
<el-row>
  <el-col :span="24" style="margin-top:20px">
    <el-button-group>
      <el-button type="primary" icon="plus" @click="handlerAdd">添加</el-button>
      <el-button type="primary" icon="edit" @click="handlerEdit">编辑</el-button>
      <el-button type="primary" icon="delete" @click="handleDelete">删除</el-button>
      <el-button type="primary" @click="handlerAuthority">权限分配</el-button>
      <el-button type="primary" @click="handlerUser">关联用户</el-button>
    </el-button-group>
  </el-col>
  <el-col :span="8" style='margin-top:15px;'>
    <el-input placeholder="输入关键字进行过滤" v-model="filterText"> </el-input>
    <el-tree class="filter-tree" :data="treeData" node-key="id" highlight-current :props="defaultProps" :filter-node-method="filterNode" ref="groupTree" @node-click="getNodeData" default-expand-all> </el-tree>
  </el-col>
  <el-col :span="16" style='margin-top:15px;'>
    <el-form :label-position="labelPosition" label-width="80px" :model="form" ref="form">
      <el-form-item label="名称">
        <el-input v-model="form.roleName" :disabled="formEdit"></el-input>
      </el-form-item>
      <el-form-item label="排序">
        <el-input v-model="form.orderNum" :disabled="formEdit"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.remark" :disabled="formEdit"></el-input>
      </el-form-item>
      <el-form-item v-if="formStatus == 'update'">
        <el-button type="primary" @click="update">更新</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
      <el-form-item v-if="formStatus == 'create'">
        <el-button type="primary" @click="create">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-col>
  <el-dialog :title="dialogAuthorityName" size="large" :visible.sync="dialogAuthorityVisible">
    <GroupAuthorityVue :groupId="currentId" @closeAuthorityDialog="closeAuthorityDialog" ref="groupAuthority"></GroupAuthorityVue>
  </el-dialog>
</el-row>
</template>

<script>
import {
  queryRoleTree,
  getOneApi,
  addApi,
  deleteApi,
  updateApi
} from '@/api/auth/roleApi'
import { mapGetters } from 'vuex'
import mixins from '@/mixin/commonMixin.js'
import GroupAuthorityVue from './groupAuthority.vue'
export default {
  mixins: [mixins],
  name: 'groupDetail',
  components: { GroupAuthorityVue },
  props: {
    type: {
      default: '1'
    }
  },
  data () {
    return {
      filterText: '',
      list: null,
      total: null,
      formEdit: true,
      formAdd: true,
      formStatus: '',
      dialogUserVisible: false,
      dialogUserName: '关联用户',
      dialogAuthorityVisible: false,
      dialogAuthorityName: '关联资源',
      listQuery: {
        name: undefined
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      labelPosition: 'right',
      groupManager_btn_edit: false,
      groupManager_btn_del: false,
      groupManager_btn_add: false,
      groupManager_btn_userManager: false,
      groupManager_btn_resourceManager: false,
      form: {
        roleName: undefined,
        remark: undefined,
        orderNum: undefined
      },
      currentId: -1
    }
  },
  watch: {
    filterText (val) {
      this.$refs.groupTree.filter(val)
    }
  },
  created () {
    this.getList()
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    getList () {
      this.handleHttpMethod(queryRoleTree(this.listQuery), true, '请求中').then(res => {
        this.treeData = res.data
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getNodeData (data) {
      if (!this.formEdit) {
        this.formStatus = 'update'
      }
      this.handleHttpMethod(getOneApi(data.id)).then(res => {
        this.form = res.data
        this.currentId = this.form.guid
      })
    },
    handlerEdit () {
      if (this.form.guid) {
        this.formEdit = false
        this.formStatus = 'update'
      }
    },
    handlerAdd () {
      this.resetForm()
      this.formEdit = false
      this.formStatus = 'create'
    },
    handleDelete () {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleHttpMethod(deleteApi(this.currentId), true, '删除中').then(() => {
          this.getList()
          this.resetForm()
          this.onCancel()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    update () {
      this.handleHttpMethod(updateApi(this.form.guid, this.form), true, '修改中').then(() => {
        this.getList()
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    create () {
      this.handleHttpMethod(addApi(this.form), true, '保存中').then(() => {
        this.getList()
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    onCancel () {
      this.formEdit = true
      this.formStatus = ''
    },
    resetForm () {
      this.form = {
        name: undefined,
        orderNum: undefined,
        remark: undefined
      }
    },
    handlerUser () {
      this.dialogUserVisible = true
      if (this.$refs.groupUser !== undefined) {
        this.$refs.groupUser.groupId = this.currentId
        this.$refs.groupUser.initUsers()
      }
    },
    handlerAuthority () {
      this.dialogAuthorityVisible = true
      if (this.$refs.groupAuthority !== undefined) {
        this.$refs.groupAuthority.groupId = this.currentId
        this.$refs.groupAuthority.initAuthoritys()
      }
    },
    closeUserDialog () {
      this.dialogUserVisible = false
    },
    closeAuthorityDialog () {
      this.dialogAuthorityVisible = false
    }
  }
}
</script>
