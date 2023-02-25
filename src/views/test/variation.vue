
<template>
  <d2-container ref="container" @scroll="({x, y}) => { scrollTop = y }">
    <template slot="header">添加多属性页面</template>
    <div class="form-group">
      <el-alert>该功能仅提供无法添加variations时使用</el-alert>
      <el-card>
        <vxe-form v-if ="formLoginShow" ref="formLogin" :data="formLogin" :items="variationItem" :rules="variationRules">
        </vxe-form>
        <div style="margin-left:80px;margin-top:10px">
          <vxe-button style="width:100px" @click="submitAddVariation" status="primary" content="提交"></vxe-button>
        </div>
      </el-card>
    </div>
  </d2-container>
</template>

<script>
import mixins from '@/mixin/commonMixin.js'
import { addColorVariations, getAllApplication } from '@/api/variations/index'
export default {
  mixins: [mixins],
  data() {
    return {
      formLoginShow: true,
      formLogin: {
        client_id: '',
        item_id: ''
      },
      variationRules: {
        client_id: [
          {
            required: true,
            message: '请输入用户',
            trigger: 'blur'
          }
        ],
        item_id: [
          {
            required: true,
            message: '请输入账户',
            trigger: 'blur'
          }
        ]
      },
      scrollDelay: 10,
      scrollTop: 0,
      variationItem: [
        {
          title: '左侧',
          span: 24,
          align: 'center',
          children: [
            {
              field: 'client_id',
              title: '选择店铺',
              span: 24,
              itemRender: {
                name: '$select',
                props: {
                  placeholder: '请选择店铺',
                  clearable: true
                },
                options: []
              }
            },
            {
              field: 'item_id',
              title: '选择商品',
              span: 24,
              itemRender: { name: '$input', props: { placeholder: '请输入商品item_id' } }
            }
          ]
        }
      ]

    }
  },
  methods: {
    submitAddVariation() {
      this.$refs.formLogin.validate().then((valid) => {
        if (!valid) {
          this.handleHttpMethod(addColorVariations(this.formLogin), true, '请求中...', true, '添加变体成功')
        }
      })
    },
    initMounted() {
      console.log('initMounted...')
    },
    initCreated() {
      console.log('initCreated...')
      // 查询所有的店铺
      this.handleHttpMethod(getAllApplication(), true, '请求中...').then(res => {
        this.$set(this.variationItem[0].children[0].itemRender, 'options', res.data)
      })
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
