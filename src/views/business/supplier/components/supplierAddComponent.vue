<template>
  <div v-show="show" width="60%">
    <vxe-modal v-if="show" title="新增供应商页面" v-model="show" :visible.sync="show"
    @close="handleClose" width="60%">
      <vxe-form ref="createFrom" title-width="100" title-align="right" titleColon
      :data="createFormData" :items="createForm" :rules="createFromRules"
      @submit="handleSubmitCreate('createFrom')" @reset="handleClose('createFrom')">
        <template #supCategorySlot>
          <ChooseCategoryComponentsVue
          :selectedCategory="createFormData.supCategory"
          :defaultCheckedKeys="createFormData.categoryGuids"
          :busGuid="createFormData.guid"
          @onSureClick="categorySureClick">
          </ChooseCategoryComponentsVue>
        </template>
      </vxe-form>
    </vxe-modal>
  </div>
</template>

<script>
import ChooseCategoryComponentsVue from '@/views/business/category/components/chooseCategoryComponents.vue'
import mixins from '@/mixin/commonMixin.js'
import { updateByDtoApi, addByDtoApi } from '@/api/business/supplierApi.js'
export default {
  mixins: [mixins],
  components: { ChooseCategoryComponentsVue },
  name: '',
  props: {
    show: {
      type: Boolean,
      default() {
        return false
      }
    },
    defaultFormData: {
      type: Object,
      default() {
        return {}
      }
    },
    dialogStatus: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      showIn: this.show,
      dialogStatusIn: this.dialogStatus,
      shop: null,
      applicationData: [],
      defaultFormDataIn: this.defaultFormData,
      createFormData: {
        supName: '',
        linkName: '',
        linkPhone: '',
        supAddress: '',
        supCategory: '',
        account: '',
        grade: '',
        qualification: '',
        remark: '',
        categoryGuids: []
      },
      createForm: [
        {
          title: '',
          span: 23,
          children: [
            { field: 'supName', title: '供应商名称', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入供应商名称' } } },
            { field: 'supCategory', title: '供应类别', span: 12, slots: { default: 'supCategorySlot' } },
            { field: 'linkName', title: '联系人', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入联系人' } } },
            { field: 'linkPhone', title: '联系电话', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入联系电话' } } },
            { field: 'supAddress', title: '供应商地址', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入供应商地址' } } },
            { field: 'account', title: '付款账户', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入付款账户' } } },
            {
              field: 'grade',
              title: '评级',
              span: 12,
              itemRender: {
                name: '$select',
                options: [{ label: 'A', value: 'A', key: 'A' }, { label: 'B', value: 'B', key: 'B' }, { label: 'C', value: 'C', key: 'C' }],
                props: { placeholder: '请输入评级' }
              }
            },
            { field: 'qualification', title: '资质信息', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入资质信息' } } },
            { field: 'remark', title: '备注', span: 24, itemRender: { name: '$input', props: { placeholder: '请输入备注' } } }
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
        supName: [
          { required: true, message: '请输入供应商名称', trigger: 'blur' }
        ],
        supCategory: [
          { required: true, message: '请输入供应商类别', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleClose() {
      this.showIn = false
      this.resetCreateForm()
      this.$emit('update:show', false)
    },
    // 提交保存按钮
    handleSubmitCreate(formName) {
      this.submitCreate(formName)
    },
    // 确定选中类目后
    categorySureClick(checkedData) {
      this.createFormData.supCategory = checkedData.checkedStr
      this.createFormData.categoryGuids = checkedData.checkedKeys
    },
    submitCreate(formName) {
      const refs = this.$refs
      refs[formName].validate().then((valid) => {
        if (!valid) {
          if (this.dialogStatusIn === 'create') {
            this.handleHttpMethod(addByDtoApi(this.createFormData), true, '正在保存中', true, '信息保存成功').then(res => {
              if (res) {
                this.handleClose()
                this.pageList()
              }
            })
          }
          if (this.dialogStatusIn === 'update') {
            this.handleHttpMethod(updateByDtoApi(this.createFormData.guid, this.createFormData), true, '正在保存中', true, '信息保存成功').then(res => {
              if (res) {
                this.handleClose()
                this.pageList()
              }
            })
          }
        }
      })
    },
    // 重置表单数据
    resetCreateForm() {
      this.createFormData = {
        supName: '',
        linkName: '',
        linkPhone: '',
        supAddress: '',
        supCategory: '',
        account: '',
        grade: '',
        qualification: '',
        remark: '',
        categoryGuids: []
      }
    },
    pageList() {
      this.$emit('onSureClick')
    }
  },
  created() {
  },
  mounted() {
  },
  watch: {
    defaultFormData: {
      handler(nval, oval) {
        if (nval && !(JSON.stringify(nval) === '{}')) {
          this.createFormData = Object.assign({}, nval)
        }
      },
      immediate: true,
      deep: true
    },
    dialogStatus: {
      handler(nval, oval) {
        this.dialogStatusIn = nval
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
