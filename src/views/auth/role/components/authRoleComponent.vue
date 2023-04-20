<template>
  <vxe-modal height="700px" width="600px"  v-model="showIn" title="角色用户"
    show-zoom
    resize
    remember
    transfer
    show-footer
    show-close @hide="handleClose">
    <template #footer>
      <vxe-button status="primary" @click="onSure">确定</vxe-button>
      <vxe-button @click="handleClose">取消</vxe-button>
    </template>
    <el-col :span="24" style="margin-top:15px;height:500px">
      <el-input placeholder="输入关键字进行过滤" v-model="filterText"> </el-input>
      <el-tree class="filter-tree"
        node-key="id"
        :data="treeData"
        show-checkbox
        highlight-current
        :props="defaultProps"
        :filter-node-method="filterNode"
        :default-checked-keys="defaultCheckedKeysIn"
        ref="roleTree"
        default-expand-all>
      </el-tree>
    </el-col>
  </vxe-modal>
</template>

<script>
import mixins from '@/mixin/commonMixin.js'
import { queryListMap, refreshUserRoles } from '@/api/auth/userRoleApi'
import {
  queryRoleTree
} from '@/api/auth/roleApi'

export default {
  name: 'authRoleComponent',
  mixins: [mixins],
  props: {
    groupId: {
      default: '1'
    },
    show: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data () {
    return {
      defaultCheckedKeysIn: [],
      filterText: '',
      list: null,
      total: null,
      listQuery: {
        name: undefined
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      showIn: this.show
    }
  },
  watch: {
  },
  created () {
    this.getList()
  },
  methods: {
    handleClose() {
      this.showIn = false
      this.$emit('update:show', false)
    },
    getList () {
      this.handleHttpMethod(queryRoleTree(this.listQuery), true, '请求中').then(res => {
        this.treeData = res.data
        this.handleHttpMethod(queryListMap({ userGuid: this.groupId }), true, '请求中').then(res => {
          if (res.data && res.data.length > 0) {
            const all = []
            res.data.forEach(item => {
              all.push(item.roleGuid)
            })
            this.defaultCheckedKeysIn = all
          }
        })
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getTreeNodeKey (node) {
      return node.id
    },
    // 确定授权按钮
    onSure() {
      const checkedNodes = this.$refs.roleTree.getCheckedNodes()
      console.log(checkedNodes)
      if (checkedNodes && checkedNodes.length > 0) {
        const roleguids = []
        checkedNodes.forEach(item => {
          roleguids.push(item.id)
        })
        this.handleHttpMethod(refreshUserRoles({ userGuid: this.groupId, roleGuids: roleguids })).then(res => {
          if (res) {
            this.handleClose()
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success',
              duration: 2000
            })
          }
        })
      }
    }

  }
}
</script>
