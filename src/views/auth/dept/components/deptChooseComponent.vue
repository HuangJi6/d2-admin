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
        ref="deptTree"
        default-expand-all>
      </el-tree>
    </el-col>
  </vxe-modal>
</template>

<script>
import mixins from '@/mixin/commonMixin.js'
import {
  queryDeptTree
} from '@/api/auth/deptApi'

export default {
  name: 'deptChooseComponent',
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
      this.handleHttpMethod(queryDeptTree(this.listQuery), true, '请求中').then(res => {
        this.treeData = res.data
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getTreeNodeKey (node) {
      return node.id
    },
    // 确定选择按钮
    onSure() {
      const checkedNodes = this.$refs.deptTree.getCheckedNodes()
      const treeCheckedData = { checkedStr: '', checkedKeys: [], checkedNodes: [], treeCheckedIds: [], treeCheckedCodes: [], treeCheckedNames: [] }
      if (checkedNodes && checkedNodes.length > 0) {
        let treeCheckedStr = ''
        const treeCheckedKeys = []
        const treeCheckedNames = []
        const treeCheckedCodes = []
        const treeCheckedIds = []
        let checkedNum = 0
        checkedNodes.forEach(element => {
          let flag = true
          checkedNodes.forEach(ele2 => {
            if (element.id === ele2.parentId) {
              flag = false
            }
          })
          // 如果不是子节点,则过滤
          if (flag) {
            checkedNum = checkedNum + 1
            treeCheckedStr = treeCheckedStr + element.label + '/'
            treeCheckedNames.push(element.deptName)
            treeCheckedCodes.push(element.deptCode)
            treeCheckedIds.push(element.id)
          }
          treeCheckedKeys.push(element.id)
        })
        // 单选校验
        if (checkedNum !== 1) {
          this.$message({ message: '仅能选择一个节点', type: 'warning' })
          return
        }
        treeCheckedData.checkedStr = treeCheckedStr.substring(0, treeCheckedStr.length - 1)
        treeCheckedData.checkedKeys = treeCheckedKeys
        treeCheckedData.checkedNodes = checkedNodes
        treeCheckedData.treeCheckedIds = treeCheckedIds
        treeCheckedData.treeCheckedCodes = treeCheckedCodes
        treeCheckedData.treeCheckedNames = treeCheckedNames
        console.log(treeCheckedData)
      }
      this.handleClose()
      this.$emit('onSureClick', treeCheckedData)
    }

  }
}
</script>
