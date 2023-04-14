<template>
  <div style="margin-right:15px">
    <el-dropdown ref="dropdownButton" trigger="click" @command="handleCommand">
      <el-button size="small" circle>
        <i class="vxe-button--icon vxe-icon-download"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="exportCurrentPage">导出当前页</el-dropdown-item>
        <el-dropdown-item command="exportCheckedLine">导出选中行</el-dropdown-item>
        <el-dropdown-item command="exportAll">导出全部</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
import mixins from '@/mixin/commonMixin.js'
import moment from 'moment'
import table2excel from 'js-table2excel'
export default {
  mixins: [mixins],
  name: 'exportButton',
  props: {
    tableRefsName: {
      type: String,
      default() {
        return ''
      }
    },
    vuePageName: {
      type: String,
      default() {
        return ''
      }
    },
    tableDataTotal: {
      type: Number,
      default() {
        return 0
      }
    },
    tableDataFunctionName: {
      type: String,
      default() {
        return ''
      }
    },
    tableDataFunction: { // 节点被点击时的回调
      type: Function,
      default: function() { }
    },
    tableDataParams: { // 方法参数
      type: Object,
      default() { return {} }
    },
    fileName: {
      type: String,
      default() { return {} }
    }
  },
  data() {
    return {
      tableRefsNameIn: this.tableRefsName,
      tableDataTotalIn: this.tableDataTotal,
      vuePageNameIn: this.vuePageName,
      tableDataParamsIn: this.tableDataParams
    }
  },
  methods: {
    handleCommand(command) {
      if (this.tableRefsNameIn) {
        const parent = this.findParentComponent(this, this.vuePageNameIn)
        const tableRefs = parent.$refs[this.tableRefsNameIn]
        const columns = tableRefs.getColumns()
        const column = []
        const fileName = this.fileName + moment().format('YYYYMMDDhmmss')
        columns.forEach(item => {
          if (item.field) {
            const a = {
              key: item.field,
              title: item.title,
              type: item.type
            }
            if (item.type === 'image') {
              a.height = 50
              a.width = 50
            }
            column.push(a)
          }
        })
        if (command === 'exportCurrentPage') {
          const data = tableRefs.getTableData().fullData
          // 组件导出
          table2excel(column, data, fileName)
        }
        if (command === 'exportCheckedLine') {
          const selectionData = tableRefs.selection
          if (selectionData && selectionData.length > 0) {
            table2excel(column, selectionData, fileName)
          } else {
            this.$message({ message: '请选择数据', type: 'warning' })
          }
        }
        if (command === 'exportAll') {
          parent.listLoading = true
          const that = this
          setTimeout(async () => {
            // 获取表格数据
            const list = []
            for (let i = 0; i < that.tableDataTotalIn; i++) {
              const params = Object.assign({}, that.tableDataParamsIn)
              params.currentPage = i + 1
              const result = await that.tableDataFunction(params)
              if (result && result.length > 0) {
                result.forEach(element => {
                  list.push(element)
                })
              }
            }
            if (list && list.length > 0) {
              table2excel(column, list, fileName)
            }
            tableRefs.listLoading = false
          }, 200)
        }
      }
    },
    findParentComponent (vueIns, name) {
      let parent = vueIns.$parent
      while (parent) {
        const componentName = parent.$options.componentName || parent.$options.name
        if (componentName !== name) {
          parent = parent.$parent
        } else {
          return parent
        }
      }
      return false
    }
  },
  created() {},
  mounted() {},
  watch: {

  }
}
/**
VUE:
<template template #tools>
<ExportButtonVue
  : tableRefsName="'vxeTableRef'" 需要导出的table的ref
  : vuePageName="'application'" 父组件的页面的name
  : fileName="'店铺表'" 导出的文件名称后面会加时间
  : tableDataTotal="parseInt(total/filterFormData.pageSize)+1" 导出的总页数
  : tableDataFunction="selectPageList" // 全量导出的方法
  : tableDataParams="filterFormData" // 过滤参数
></ExportButtonVue>
</template >
import ExportButtonVue from '@/views/common/exportButton/exportButton.vue'
components: { ExportButtonVue },

JS: 全量导出需要一个同步调用的方法
  async selectPageList(params) {
    this.listLoading = true
    const result = { tableData: [], total: 0 }
    await this.handleHttpMethod(pageApi(params || {}), true).then(res => {
      result.tableData = res.data.dataList
      result.total = res.data.total
      this.listLoading = false
    }).catch(err => {
      console.log(err)
      this.listLoading = false
    })
    return result.tableData
  },
 */
</script>
