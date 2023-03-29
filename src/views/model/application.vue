<!--店铺管理-->
<template>
  <d2-container>
    <template slot="header">
      <el-input @keyup.enter.native="handleFilter" clearable style="width: 200px;margin-right: 20px;" class="filter-item" placeholder="店铺名称搜索" v-model="listQuery.userName" size="small"> </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" size="small">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="handleRefresh" size="small">刷新</el-button>
    </template>

    <template>

    </template>

    <template slot="footer">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.currentPage" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </template>
  </d2-container>
</template>

<script>
import mixins from '@/mixin/commonMixin.js'
import { myMethods } from './js/applicationMethod.js'
export default {
  name: 'application',
  mixins: [mixins],
  data() {
    return {
      total: null,
      listQuery: {
        currentPage: 1,
        pageSize: 20,
        userName: undefined
      }
    }
  },
  methods: {
    ...myMethods
  }
}
</script>
