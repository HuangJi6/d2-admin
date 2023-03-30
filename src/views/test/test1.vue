
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
          <el-form-item prop="item_id" label="选择商品">
            <el-input type="text" v-model="formLogin.item_id" placeholder="请输入item_id">
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
      <div class="form-group">
        <el-card>
          <vxe-table
            :row-config="{isHover: true}"
            :data="tableData">
            <vxe-column type="seq" width="60"></vxe-column>
            <vxe-column field="name" title="Name"></vxe-column>
            <vxe-column field="sex" title="Sex"></vxe-column>
            <vxe-column field="age" title="Age"></vxe-column>
          </vxe-table>
        </el-card>
      </div>
      <div class="form-group">
        <vxe-table
          border
          class="mytable-scrollbar"
          show-footer
          height="200"
          :footer-method="footerMethod"
          :data="tableData">
          <vxe-column type="seq" width="60"></vxe-column>
          <vxe-column field="name" title="Name"></vxe-column>
          <vxe-column field="sex" title="Sex"></vxe-column>
          <vxe-column field="age" title="Age"></vxe-column>
          <vxe-column width="200" field="address" title="Address" show-overflow></vxe-column>
        </vxe-table>
      </div>
      <div class="form-group">
        <vxe-table
          border
          show-footer
          class="mytable-scrollbar"
          height="400"
          :footer-method="footerMethod"
          :data="tableData">
          <vxe-column type="seq" width="60" fixed="left"></vxe-column>
          <vxe-column field="name" title="Name" width="300"></vxe-column>
          <vxe-column field="sex" title="Sex" width="250"></vxe-column>
          <vxe-column field="age" title="Age" width="250"></vxe-column>
          <vxe-column field="role" title="Role" width="300"></vxe-column>
          <vxe-column field="address" title="Address" width="350" show-overflow></vxe-column>
        </vxe-table>
      </div>
      <!-- <div class="form-group">
        <vxe-form :data="formData4" :items="formItems4" @submit="submit1" titleColon>
          <template #myregion="{ data }">
            <vxe-input v-model="data.region" placeholder="自定义插槽模板"></vxe-input>
          </template>
        </vxe-form>
        <vxe-button status="primary" content="手动提交方式"></vxe-button>
          <vxe-button content="重置"></vxe-button>
      </div> -->
        <vxe-form
          title-colon
          ref="xForm"
          title-align="right"
          title-width="100"
          :data="formData2"
          :rules="formRules2"
          :loading="loading2"
          @submit="submitEvent2"
          @reset="resetEvent">
          <vxe-form-gather span="12">
            <vxe-form-item title="名称" field="name" span="24"></vxe-form-item>
            <vxe-form-item title="昵称" span="24">
              <template #title>
                <span style="color: red;">自定义标题</span>
              </template>
              <template #default="{ data }">
                <span>自定义 {{ data.nickname }}</span>
              </template>
            </vxe-form-item>
            <vxe-form-item title="标题貌似有点长呢" field="sex" span="24" :item-render="{}" title-overflow>
              <template #default="params">
                <vxe-select v-model="params.data.sex" placeholder="请选择性别" clearable @change="itemSexChange(params)">
                  <vxe-option value="1" label="女"></vxe-option>
                  <vxe-option value="2" label="男"></vxe-option>
                </vxe-select>
              </template>
            </vxe-form-item>
            <vxe-form-item title="标题貌似有点长呢" field="age" span="24" :item-render="{}" title-overflow="title">
              <template #default="params">
                <vxe-input v-model="params.data.age" type="integer" placeholder="请输入年龄" clearable @input="$refs.xForm.updateStatus(params)"></vxe-input>
              </template>
            </vxe-form-item>
            <vxe-form-item title="标题貌似有点长呢" field="date" span="24" :item-render="{}" title-overflow="ellipsis">
              <template #default="params">
                <vxe-input v-model="params.data.date" type="date" placeholder="请选择日期" clearable @change="$refs.xForm.updateStatus(params)"></vxe-input>
              </template>
            </vxe-form-item>
          </vxe-form-gather>
          <vxe-form-gather span="12">
            <vxe-form-item title="标题貌似有点长呢标题貌似有点长呢" field="address" span="24" :item-render="{}">
              <template #default="params">
                <vxe-textarea v-model="params.data.address" placeholder="请输入地址" :autosize="{minRows: 6, maxRows: 10}" clearable @input="$refs.xForm.updateStatus(params)"></vxe-textarea>
              </template>
            </vxe-form-item>
          </vxe-form-gather>
          <vxe-form-item align="center" span="24" :item-render="{}">
            <template #default>
              <vxe-button type="submit" status="primary">基本表单</vxe-button>
              <vxe-button type="reset">重置</vxe-button>
            </template>
          </vxe-form-item>
        </vxe-form>
        <vxe-button @click="submit3" status="primary">手动校验</vxe-button>
        <div class="form-group">
          <vxe-form :data="formData3">
            <vxe-form-item align="center" span="24" :item-render="{}">
              <vxe-input ref="uploadInput" style="float:left;width:400px" v-model="formData3.name" placeholder="自定义插槽模板"></vxe-input>
              <vxe-button ref="uploadButton" style="float:right;width:100px" type="text" status="primary" icon="vxe-icon-cloud-download" @click="handleUpload(formData3)">上传图片</vxe-button>
              <vxe-button ref="uploadButton1" status="primary" icon="vxe-icon-cloud-download" @click="saveUpload(formData3)">保存</vxe-button>
            </vxe-form-item>
          </vxe-form>
        </div>
        <div class="form-group">
          <el-upload
            class="upload-demo"
            action="http://localhost:9991/api/mkd/business/sysFile/uploadFiles"
            :on-preview="handlePreview"
            :before-upload="handleBeforeUpload"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :on-success="handleUploadSuccess"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList">
            <vxe-button type="text" status="primary" icon="vxe-icon-cloud-download">上传图片</vxe-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </div>
  </d2-container>
</template>

<script>
import VXETable from 'vxe-table'
import { getItemInfo, postItemInfo, putItemInfo, delItemInfo } from '@/api/variations/index'
import { removeFilesApi } from '@/api/common/commonApi.js'

import requestHandler from '@/plugin/axios/requestHandler.js'
export default {
  mixins: [requestHandler],
  data() {
    return {
      fileList: [],
      loading2: false,
      shopOptions: [{ label: 'A店', value: 'a', key: 'a' }, { label: 'B店', value: 'b', key: 'b' }],
      formLogin: {
        client_id: '',
        item_id: ''
      },
      rules: {
        clientId: [
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
      containerType: 'full',
      scrollDelay: 10,
      scrollTop: 0,
      tableData: [
        { id: 10001, name: 'Test1', role: 'Develop', sex: 'Man', age: 28, address: 'test abc' },
        { id: 10002, name: 'Test2', role: 'Test', sex: 'Women', age: 22, address: 'Guangzhou' },
        { id: 10003, name: 'Test3', role: 'PM', sex: 'Man', age: 32, address: 'Shanghai' },
        { id: 10004, name: 'Test4', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' }
      ],
      formData3: {
        name: '',
        file: {}
      },
      formData4: {
        name: '',
        nickname: '',
        sex: '0',
        role: '',
        age: 22,
        val1: [],
        val2: false,
        val3: '',
        flag: false
      },
      formItems4: [
        {
          title: '左侧',
          span: 12,
          children: [
            { field: 'name', title: '名称', span: 8, itemRender: { name: '$input', props: { placeholder: '请输入名称' } } },
            { field: 'sex', title: '性别', span: 8, itemRender: { name: '$select', options: [{ value: '0', label: '女' }, { value: '1', label: '男' }], props: { placeholder: '请选择性别' } } },
            { field: 'role', title: '角色', span: 8, itemRender: { name: '$input', props: { placeholder: '请输入角色' } } },
            { field: 'age', title: '年龄', span: 24, itemRender: { name: '$input', props: { type: 'number', placeholder: '请输入年龄' } } },
            { field: 'val1', title: '复选框-组', span: 12, itemRender: { name: '$checkbox', options: [{ label: '爬山', value: '11' }, { label: '健身', value: '22' }] } },
            { field: 'val2', title: '复选框', span: 12, itemRender: { name: '$checkbox' } },
            { field: 'val3', title: '单选框', span: 12, itemRender: { name: '$radio', options: [{ label: '是', value: 'Y' }, { label: '否', value: 'N' }] } },
            { field: 'flag', title: '开关', span: 24, itemRender: { name: '$switch', props: { openLabel: '是', closeLabel: '否' } } },
            { field: 'region', title: '地区', span: 24, slots: { default: 'myregion' } }
          ]
        },
        {
          title: '右侧',
          span: 12,
          children: [
            { field: 'nickname', title: '昵称', span: 24, itemRender: { name: '$input', props: { placeholder: '请输入昵称' } } }
          ]
        },
        {
          align: 'center',
          span: 24,
          itemRender: {
            name: '$buttons',
            children: [
              { props: { type: 'submit', content: '配置式表单', status: 'primary' } },
              { props: { type: 'reset', content: '重置' } }
            ]
          }
        }
      ],
      formData2: {
        name: 'test1',
        nickname: 'Testing',
        sex: '',
        age: 26,
        date: null,
        address: '左右布局'
      },
      formRules2: {
        name: [
          { required: true, message: '请输入名称' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符' }
        ],
        nickname: [
          { required: true, message: '请输入昵称' }
        ],
        sex: [
          { required: true, message: '请选择性别' }
        ],
        age: [
          { required: true, message: '请输入年龄' },
          {
            validator ({ itemValue }) {
              // 自定义校验
              if (Number(itemValue) > 35 || Number(itemValue) < 18) {
                return new Error('年龄在 18 ~ 35 之间')
              }
            }
          }
        ],
        date: [
          { required: true, message: '必填校验' }
        ],
        address: [
          { required: true, message: '必填校验' }
        ]
      }

    }
  },
  methods: {
    handleBeforeUpload(file) {
      this.fileList.forEach(item => {
        if (item.name === file.name) {
          this.$message.warning('存在同名文件已上传')
          return false
        }
      })
      console.log(file)
    },
    handlePreview() {

    },
    handleUploadSuccess(response, file, fileList) {
      const fileItem = { name: file.name }
      fileList.push(fileItem)
      this.fileList = fileList
      console.log(response)
    },
    handleRemove() {
      this.handleHttpMethod(removeFilesApi())
    },
    // 上传附件
    async handleUpload(row) {
    // 读取附件
      try {
        const { file } = await VXETable.readFile({
          types: ['png', 'jpg', 'xlsx', 'html']
        })
        VXETable.modal.alert(`文件名：${file.name}，文件大小：${file.size}`)
        row.file = file
        row.name = file.name
      } catch (e) {}
    },
    saveUpload() {
      console.log(this.formData3)
      this.handleHttpMethod(postItemInfo(this.formData3), true, '请求中...', true, '请求成功')
    },
    itemSexChange(params) {
      this.$refs.xForm.updateStatus(params)
      console.log(params)
    },
    submit1() {
      this.$notify({
        title: '创建成功',
        message: 'GET请求创建失败1',
        type: 'warning',
        duration: 2000
      })
    },
    submit2() {
      this.$notify({
        title: '创建成功',
        message: 'GET请求创建失败2',
        type: 'warning',
        duration: 2000
      })
    },
    submit3() {
      this.$refs.xForm.validate().then((valid) => {
        if (!valid) {
          VXETable.modal.message({ message: '保存成功', status: 'success' })
        }
      })
    },
    submitGet() {
      const loading = this.$loading({
        lock: true,
        text: '正在请求中',
        spinner: 'ri-loader-4-line roll',
        background: 'rgba(0, 0, 0, 0.7)'
      })
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
      loading.close()
    },
    submitPost() {
      this.handleHttpMethod(postItemInfo(this.formLogin), true, '请求中...', true, '请求成功')
      // this.$refs.formLogin.validate(valid => {
      //   if (valid) {
      //     // todo 发送请求
      //     postItemInfo(this.formLogin).then(response => {
      //       console.log(response)
      //     })
      //     this.$notify({
      //       title: '成功',
      //       message: 'POST创建成功',
      //       type: 'success',
      //       duration: 2000
      //     })
      //   } else {
      //     this.$notify({
      //       title: '失败',
      //       message: '失败111',
      //       type: 'warning',
      //       duration: 2000
      //     })
      //   }
      // })
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
    },
    sumNum (list, field) {
      let count = 0
      list.forEach(item => {
        count += Number(item[field])
      })
      return count
    },
    footerMethod ({ columns, data }) {
      const sums = []
      columns.forEach((column, columnIndex) => {
        if (columnIndex === 0) {
          sums.push('和值')
        } else {
          sums.push(this.sumNum(data, column.property))
        }
      })
      // 返回一个二维数组的表尾合计
      return [sums]
    },
    submitEvent2 () {
      this.loading2 = true
      setTimeout(() => {
        this.loading2 = false
        VXETable.modal.message({ message: '保存成功', status: 'success' })
      }, 1000)
    },
    searchEvent () {
      VXETable.modal.message({ message: '查询事件', status: 'info' })
    },
    resetEvent () {
      VXETable.modal.message({ message: '重置事件', status: 'info' })
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
