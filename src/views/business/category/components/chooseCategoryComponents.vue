<template>
  <div>
    <div style="height:20px;width:auto;">
      <div style="width:75%; heiht:20px;float:left;padding-right:5px">
        <vxe-input v-model="selectedCategoryIn"></vxe-input>
      </div>
      <div style="width:20%; heiht:20px;float:right">
        <vxe-button status="primary" content="选择类别"  @click="handleChooseCategory()"></vxe-button>
      </div>
    </div>
    <vxe-modal
      v-model="show"
      width="50%"
      height="80%" title="类别列表" show-footer>
      <template #footer>
        <vxe-button status="primary" @click="onSure">确定</vxe-button>
        <vxe-button @click="handleClose">取消</vxe-button>
      </template>
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText">
      </el-input>
      <el-tree ref="tree" show-checkbox :data="treeData" :props="defaultProps"
      node-key="id"
      :default-checked-keys="defaultCheckedKeysIn"
      :filter-node-method="filterNode">
      </el-tree>
    </vxe-modal>
  </div>
</template>
<script>
import mixins from '@/mixin/commonMixin.js'
import { getTreeCategoryApi, queryListApi } from '@/api/business/categoryApi.js'
export default {
  mixins: [mixins],
  name: 'chooseCategoryComponent',
  props: {
    selectedCategory: {
      type: String,
      default() {
        return ''
      }
    },
    defaultCheckedKeys: {
      type: Array,
      default() {
        return []
      }
    },
    busGuid: {
      type: String,
      default() {
        return ''
      }
    },
    singleSelect: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      singleSelectIn: this.singleSelect,
      // 默认选中
      defaultCheckedKeysIn: this.defaultCheckedKeys,
      show: false,
      selectedCategoryIn: this.selectedCategory,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      treeData: [{
        id: '1',
        label: '一级 1',
        parentId: '0',
        extraField: 666,
        weight: 'Animals and Pets',
        children: [{
          id: '4',
          label: '二级 1-1',
          children: [{
            id: '9',
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }],
      filterText: ''
    }
  },
  methods: {
    handleChooseCategory() {
      this.handleHttpMethod(getTreeCategoryApi({}), true, '正在查询').then(res => {
        this.treeData = res.data
        this.show = true
      })
      if (this.busGuid) {
        this.handleHttpMethod(queryListApi({ busGuid: this.busGuid })).then(res1 => {
          // debugger
          if (res1.data) {
            this.defaultCheckedKeysIn = res1.data.map(ele => { return ele.categoryGuid })
            console.log(this.defaultCheckedKeysIn)
          }
        })
      }
    },
    handleCheckChange() {},
    onSure() {
      const checkedNodes = this.$refs.tree.getCheckedNodes()
      const treeCheckedData = { checkedStr: '', checkedKeys: [], checkedNodes: [] }
      if (checkedNodes && checkedNodes.length > 0) {
        let treeCheckedStr = ''
        const treeCheckedKeys = []
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
          }
          treeCheckedKeys.push(element.id)
        })
        // 单选校验
        if (this.singleSelectIn && checkedNum !== 1) {
          this.$message({ message: '仅能选择一个节点', type: 'warning' })
          return
        }
        treeCheckedData.checkedStr = treeCheckedStr.substring(0, treeCheckedStr.length - 1)
        treeCheckedData.checkedKeys = treeCheckedKeys
        treeCheckedData.checkedNodes = checkedNodes
        console.log(treeCheckedData)
        this.defaultCheckedKeysIn = treeCheckedData.checkedKeys
      }
      this.selectedCategoryIn = treeCheckedData.checkedStr
      this.show = false
      this.$emit('onSureClick', treeCheckedData)
    },
    handleClose() {
      this.show = false
    },
    handleNodeClick(data) {
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    }
  },
  created() {},
  mounted() {

  },
  watch: {
    filterText: {
      handler(nval, oval) {
        if (nval) {
          this.$refs.tree.filter(nval)
        } else {
          this.$refs.tree.filter('')
        }
      }
    }
  }
}
</script>
