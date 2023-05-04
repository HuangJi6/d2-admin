<template>
  <d2-container>
    <div class="filter-container" style="margin-top:15px;">
      <el-button-group>
        <el-button type="primary" icon="plus" @click="handlerAdd">添加</el-button>
        <el-button type="primary" icon="edit" @click="handlerEdit">编辑</el-button>
        <el-button type="primary" icon="delete" @click="handleDelete">删除</el-button>
        <el-button type="primary" icon="delete" @click="getList">刷新</el-button>
      </el-button-group>
    </div>
    <el-row>
      <el-col :span="8" style='margin-top:15px;'>
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText">
        </el-input>
        <el-tree
          class="filter-tree"
          :data="treeData"
          node-key="id"
          highlight-current
          :props="defaultProps"
          :filter-node-method="filterNode"
          ref="menuTree"
          @node-click="getNodeData"
          default-expand-all
          >
        </el-tree>
      </el-col>
      <el-col :span="16" style='margin-top:15px;'>
        <el-card class="box-card">
        <el-form :label-position="labelPosition" label-width="100px" :model="form" ref="form">
          <el-form-item label="部门编码" prop="code">
              <el-input v-model="form.deptCode" :disabled="formEdit" placeholder="请输入部门编码"></el-input>
          </el-form-item>
              <el-form-item label="部门名称" prop="title">
              <el-input v-model="form.deptName" :disabled="formEdit"  placeholder="请输入部门名称"></el-input>
          </el-form-item>
          <el-form-item label="父级节点" prop="parentId">
              <el-input v-model="form.parentId" :disabled="formEdit" placeholder="请输入父级节点"></el-input>
          </el-form-item>
          <el-form-item label="级别" prop="href">
              <el-input v-model="form.levelNo" :disabled="formEdit" placeholder="请输入部门级别"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="orderNum">
              <el-input v-model="form.orderNo" :disabled="formEdit" placeholder="请输入排序"></el-input>
          </el-form-item>
          <el-form-item label="部门负责人" prop="orderNum">
              <el-input v-model="form.deptManager" :disabled="formEdit" placeholder="请输入部门负责人"></el-input>
          </el-form-item>
          <el-form-item label="是否启用" prop="description">
            <el-select v-model="form.isEnabled" :disabled="formEdit" placeholder="请输入是否启用">
              <el-option :key="1" label="是" value="1"> </el-option>
              <el-option :key="0" label="否" value="0"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述"   prop="description">
              <el-input v-model="form.remark" :disabled="formEdit" placeholder="请输入描述"></el-input>
          </el-form-item>
          <el-form-item v-if="formStatus === 'update'">
            <el-button type="primary" @click="update">更新</el-button>
            <el-button @click="onCancel">取消</el-button>
          </el-form-item>
          <el-form-item v-if="formStatus === 'create'">
            <el-button type="primary" @click="create">保存</el-button>
            <el-button @click="onCancel">取消</el-button>
          </el-form-item>
        </el-form>
        </el-card>
        <!-- <el-card class="box-card">
            <span>按钮或资源</span>
          <menu-element :menuId='currentId' ref="menuElements"></menu-element>
        </el-card> -->
      </el-col>
    </el-row>
  </d2-container>
</template>

<script>
import {
  getOneApi, addApi, deleteApi, updateApi, queryDeptTree
} from '@/api/auth/deptApi.js'
import mixins from '@/mixin/commonMixin.js'

import { mapGetters } from 'vuex'

export default {
  mixins: [mixins],
  name: 'menuManager',
  data () {
    return {
      filterText: '',
      list: null,
      total: null,
      formEdit: true,
      formAdd: true,
      formStatus: '',
      showElement: false,
      typeOptions: ['menu', 'dirt', 'sys'],
      listQuery: {
        name: undefined
      },
      treeData: [
        { label: '一级部门', id: '1', children: [] }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      labelPosition: 'right',
      form: {
        deptName: '',
        deptCode: undefined,
        parentId: undefined,
        levelNo: '',
        orderNo: '',
        deptManager: '',
        remark: '',
        isEnabled: ''
      },
      currentId: '0'
    }
  },
  watch: {
    filterText (val) {
      this.$refs.menuTree.filter(val)
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
      this.handleHttpMethod(queryDeptTree(this.listQuery), true, '请求中').then(res => {
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
      this.handleHttpMethod(getOneApi(data.guid), true, '请求中').then(res => {
        this.form = res.data
      })
      this.currentId = data.guid
      this.showElement = true
      // this.$refs.menuElements.menuId = data.id
      // this.$refs.menuElements.getList()
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
      this.form.parentId = this.currentId
    },
    handleDelete () {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleHttpMethod(deleteApi(this.currentId), true, '删除中...').then(res => {
          if (res) {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          }
          this.getList()
          this.resetForm()
          this.onCancel()
        })
      }).catch(() => {
      })
    },
    update () {
      this.handleHttpMethod(updateApi(this.form.guid, this.form), true, '保存中').then(res => {
        if (res) {
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
        }
        this.getList()
        this.onCancel()
      })
    },
    create () {
      this.handleHttpMethod(addApi(this.form), true, '保存中...').then(res => {
        if (res) {
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
        }
        this.getList()
        this.onCancel()
      })
    },
    onCancel () {
      this.formEdit = true
      this.formStatus = ''
    },
    resetForm () {
      this.form = {
        deptName: '',
        deptCode: undefined,
        parentId: undefined,
        levelNo: '',
        orderNo: '',
        deptManager: '',
        remark: '',
        isEnabled: ''
      }
    }
  }
}
</script>
