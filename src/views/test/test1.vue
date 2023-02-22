
<template>
  <d2-container ref="container" :type="containerType" :better-scroll="betterScroll"
    :scroll-delay="scrollDelay" @scroll="({x, y}) => { scrollTop = y }">
    <template slot="header">添加多属性页面</template>
    <div class="form-group">
      <el-alert>改功能仅提供无法添加variations时使用</el-alert>
      <el-card>
        <el-form :rules="rules" ref="formLogin" style="width:400px" label-width="200px" :model="formLogin">
          <el-form-item prop="clientId" label="选择店铺">
            <el-select v-model="formLogin.clientId" placeholder="请选择店铺">
              <el-option v-for="item in shopOptions" :key="item.key" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="itemId" label="选择商品">
            <el-input type="text" v-model="formLogin.itemId" placeholder="请输入item_id">
            </el-input>
          </el-form-item>
          <el-button-group style="margin-left:80px;width:500px">
            <el-button size="" @click="submitGet" type="primary">GET请求</el-button>
            <el-button size="" @click="submitPost" type="success">POST请求</el-button>
            <el-button size="" @click="submitPut" type="warning">PUT请求</el-button>
            <el-button size="" @click="submitDel" type="danger">DEL请求</el-button>
          </el-button-group>
        </el-form>
      </el-card>
    </div>
  </d2-container>
</template>

<script>
import { getItemInfo, postItemInfo, putItemInfo, delItemInfo } from '@/api/variations/index'
export default {
  data() {
    return {
      shopOptions: [{ label: 'A店', value: 'a', key: 'a' }, { label: 'B店', value: 'b', key: 'b' }],
      formLogin: {
        clientId: '',
        itemId: ''
      },
      rules: {
        clientId: [
          {
            required: true,
            message: '请输入用户',
            trigger: 'blur'
          }
        ],
        itemId: [
          {
            required: true,
            message: '请输入账户',
            trigger: 'blur'
          }
        ]
      },
      containerType: 'full',
      scrollDelay: 10,
      scrollTop: 0
    }
  },
  methods: {
    submitGet() {
      this.$refs.formLogin.validate(valid => {
        if (valid) {
          // todo 发送请求
          getItemInfo(this.formLogin).then(response => {
            console.log(response)
          })
          this.$notify({
            title: '成功',
            message: 'GET请求创建成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '失败',
            message: 'GET请求创建失败',
            type: 'warning',
            duration: 2000
          })
        }
      })
    },
    submitPost() {
      this.$refs.formLogin.validate(valid => {
        if (valid) {
          // todo 发送请求
          postItemInfo(this.formLogin).then(response => {
            console.log(response)
          })
          this.$notify({
            title: '成功',
            message: 'POST创建成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '失败',
            message: '失败111',
            type: 'warning',
            duration: 2000
          })
        }
      })
    },
    submitPut() {
      this.$refs.formLogin.validate(valid => {
        if (valid) {
          // todo 发送请求
          putItemInfo(this.formLogin).then(response => {
            console.log(response)
          })
          this.$notify({
            title: '成功',
            message: 'POST创建成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '失败',
            message: '失败111',
            type: 'warning',
            duration: 2000
          })
        }
      })
    },
    submitDel() {
      this.$refs.formLogin.validate(valid => {
        if (valid) {
          // todo 发送请求
          delItemInfo(this.formLogin).then(response => {
            console.log(response)
          })
          this.$notify({
            title: '成功',
            message: 'POST创建成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '失败',
            message: '失败111',
            type: 'warning',
            duration: 2000
          })
        }
      })
    }
  },
  computed: {
    // 是否开启 better scroll
    betterScroll() {
      return this.$route.query.bs === 'true'
    },
    // 根据滚动位置返回文章的样式
    articleStyle() {
      return {
        opacity: this.scrollTop > 55 ? '1' : '.1'
      }
    }
  }
}
</script>

<style lang="scss">
.form-group {
  width: 600px; // 重新设置卡片阴影
}
</style>
