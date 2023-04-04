// 入库组件
<template>
<vxe-modal v-model="showIn" title="添加箱单" :visible.sync="dialogFormVisible"
        @close="handleClose" width="60%">
    <template #footer>
      <vxe-button status="primary" @click="onSure">确定</vxe-button>
      <vxe-button @click="handleClose">取消</vxe-button>
    </template>
    <vxe-form ref="createFrom" title-width="100" title-align="right" titleColon
      :data="createFormData" :rules="createFromRules" :items="createFormItems"
      @submit="handleSubmitCreate('createFrom')" @reset="handleCancelCreate('createFrom')">
        <template #outTime="{ data }">
          <el-date-picker style="width:100%" v-model="data.outTime" type="date" size="small" placeholder="请选择日期" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </template>
    </vxe-form>
  </vxe-modal>
</template>

<script>
import { addApi } from '@/api/business/packingListApi.js'
import mixins from '@/mixin/commonMixin.js'
export default {
  mixins: [mixins],
  components: { },
  name: 'InContainerComponent',
  props: {
    // 显示标识
    show: {
      type: Boolean,
      default() {
        return false
      }
    },
    // 操作数据
    selectionOperateDatas: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      selectionOperateDatasIn: this.selectionOperateDatas,
      showIn: this.show,
      shopGoodsInfoIn: {},
      createFormData: {
        packingNo: '',
        limitWeight: '',
        limitVolume: '',
        outTime: '',
        statusCode: '未出'
      },
      createFromRules: {},
      createFormItems: [
        {
          title: '',
          span: 23,
          children: [
            { field: 'packingNo', title: '箱单号', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入单箱重称重' } } },
            { field: 'limitWeight', title: '上线重量', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入单箱重称重' } } },
            { field: 'limitVolume', title: '上线体积', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入单箱重称重' } } },
            { field: 'outTime', title: '出库时间', span: 12, slots: { default: 'outTime' } },
            {
              field: 'statusCode',
              title: '箱单状态',
              span: 12,
              itemRender: {
                name: '$select',
                options: [{ value: '未出', label: '未出' }, { value: '运输中', label: '运输中' }, { value: '已完成', label: '已完成' }],
                props: { disabled: true, placeholder: '请输入箱唛' }
              }
            }]
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
    // 方法
    handleClose() {
      this.showIn = false
      this.$emit('update:show', false)
    },
    // 确定
    onSure() {
      const rows = this.$refs.shopGoodsVue.$refs.vxeTableRef.selection
      if (!rows || rows.length !== 1) {
        this.$message.warning('请选择一条数据')
      } else {
        this.shopGoodsInfoIn = rows[0]
        console.log(rows)
        this.$emit('onSureClick', this.shopGoodsInfoIn)
        this.handleClose()
      }
    },
    // 保存接口
    handleSubmitCreate() {
      this.handleHttpMethod(addApi(this.createFormData), true, '正在保存中', true, '信息保存成功').then(res => {
        if (res) {
          this.dialogFormVisible = false
          this.pageList()
        }
      })
    }
  },
  crated() {},
  mounted() {}
}
</script>

<style lang='scss'>
</style>
