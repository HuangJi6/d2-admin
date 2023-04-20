<template>
<el-row>
  <el-col :span="24">
    <el-button type="primary" @click="update">保存</el-button>
  </el-col>
  <el-col :span="24" style="margin-top:15px;height:500px">
    <el-input placeholder="输入关键字进行过滤" v-model="filterText"> </el-input>
    <el-tree class="filter-tree"
      node-key="id"
      :data="treeData"
      show-checkbox
      highlight-current
      :props="defaultProps"
      :filter-node-method="filterNode"
      ref="menuTree"
      default-expand-all>
    </el-tree>
  </el-col>
</el-row>
</template>

<script>
import mixins from '@/mixin/commonMixin.js'
import { queryListMap, refreshRoleResources } from '@/api/auth/roleResourceApi.js'
import {
  queryMenuTree
} from '@/api/auth/menuApi'
export default {
  mixins: [mixins],
  props: {
    groupId: {
      default: '1'
    }
  },
  data () {
    return {
      filterText: '',
      list: null,
      total: null,
      listQuery: {
        name: undefined
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      }
      //   currentId: -1
    }
  },
  watch: {
    // filterText (val) {
    //   this.$refs.menuTree.filter(val)
    // }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.handleHttpMethod(queryMenuTree(this.listQuery), true, '请求中').then(res => {
        this.treeData = res.data
        this.initAuthoritys()
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getTreeNodeKey (node) {
      return node.id
    },
    update () {
      debugger
      this.$emit('closeAuthorityDialog')
      const nodes = this.$refs.menuTree.getCheckedNodes()
      const ids = []
      for (let i = 0; i < nodes.length; i++) {
        ids.push(nodes[i].id)
      }
      this.handleHttpMethod(refreshRoleResources({ roleGuid: this.groupId, resourceGuids: ids, resourceType: 'menu' }), true, '请求中').then(() => {
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    // 默认选中
    initAuthoritys () {
      this.handleHttpMethod(queryListMap({ roleGuid: this.groupId, resourceType: 'menu' })).then(res => {
        const result = []
        if (res.data && res.data.length > 0) {
          for (let i = 0; i < res.data.length; i++) {
            result.push(res.data[i].resourceGuid)
          }
          this.$refs.menuTree.setCheckedKeys(result)
        } else {
          this.$refs.menuTree.setCheckedKeys(result)
        }
      })
    }
  }
}
</script>
