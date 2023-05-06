<template>
  <d2-container>
    <template slot="header">
      <div style="float:left;padding-top:3px">
        <el-radio-group @input="pageList()" v-model="filterFormData.storeStatus" size="medium">
          <el-radio-button label="0" @click="pageList()">全部</el-radio-button>
          <el-radio-button label="1" @click="pageList()">未初始</el-radio-button>
          <el-radio-button label="2" @click="pageList()">待入库</el-radio-button>
          <el-radio-button label="3" @click="pageList()">已出库</el-radio-button>
        </el-radio-group>
      </div>
      <div style="float:right;">
        <el-button icon="vxe-icon-square-plus" type="success" size="medium" style="width:100px" @click="handleCreate">新增</el-button>
        <el-button type="primary" size="medium" style="width:100px" @click="pageList()">刷新</el-button>
      </div>
    </template>
    <template>
      <vxe-toolbar style="height:8%" :refresh="{query: pageList}" export custom zoom>
        <template #buttons>
          <el-button icon="vxe-icon-table" size="mini" style="width:120px">待出库存装箱单</el-button>
          <el-button icon="vxe-icon-chart-pie" size="mini" style="width:120px" @click="filterDialogVisibleClick">过滤数据</el-button>
        </template>
      </vxe-toolbar>
      <vxe-table
        class="mytable-scrollbar"
        size="medium"
        header-cell-class-name="headerClassName"
        cell-class-name="cellClassName"
        border
        resizable
        show-overflow
        show-header-overflow
        v-loading.body="listLoading"
        ref="vxeTableRef"
        height="92%"
        :row-config="{isHover: true,isCurrent: true}"
        :data="tableData">
        <vxe-column type="checkbox" width="45"></vxe-column>
        <vxe-column type="seq" title="序号" width="60"></vxe-column>
        <vxe-column field="shopName" title="店铺名称" width="100"></vxe-column>
        <vxe-column field="cname" title="中文品名" width="150"></vxe-column>
        <vxe-column field="goodsName" title="Goods Name" width="150"></vxe-column>
        <vxe-column field="skuCode" title="SKU" width="100"></vxe-column>
        <vxe-column field="itemId" title="ITEM_ID" width="100"></vxe-column>
        <vxe-column field="ctnNo" title="制造商编号" width="150"></vxe-column>
        <vxe-column field="fbaMl" title="FBA/ML-编码" width="150"></vxe-column>
        <vxe-column field="referenceId" title="Reference ID" width="150" show-overflow></vxe-column>
        <vxe-column field="quantity" title="数量" width="80" show-overflow></vxe-column>
        <vxe-column field="totalCtn" title="总箱数" width="80"></vxe-column>
        <vxe-column field="weight" title="重量" width="80"></vxe-column>
        <vxe-column field="cartonLength" title="外箱尺寸-长" width="100"></vxe-column>
        <vxe-column field="cartonWidth" title="外箱尺寸-宽" width="100"></vxe-column>
        <vxe-column field="cartonHeight" title="外箱尺寸-高" width="100"></vxe-column>
        <vxe-column field="ctnMeasurement" title="单箱体积" width="80"></vxe-column>
        <vxe-column field="totalVolume" title="总体积" width="80"></vxe-column>
        <vxe-column field="material" title="材质" width="150"></vxe-column>
        <vxe-column field="storeFunction" title="用途" width="150"></vxe-column>
        <vxe-column field="brand" title="品牌" width="120"></vxe-column>
        <vxe-column field="unitPrice" title="单价" width="100"></vxe-column>
        <vxe-column field="totalValue" title="总价" width="100"></vxe-column>
        <vxe-column field="hsCode" title="海关编码" width="100"></vxe-column>
        <vxe-column field="photoUrl" title="产品图片" width="100">
          <template #default="{ row }">
            <img v-if="row.photoUrl" :src="row.photoUrl" height="45">
          </template>
        </vxe-column>
        <vxe-column field="amazonUrl" title="Amazon地址" width="100"></vxe-column>
        <vxe-column field="personUrl" title="私人地址" width="100"></vxe-column>
        <vxe-column field="mkdUrl" title="美客多地址" width="100"></vxe-column>
        <vxe-column field="urgency" title="紧急程度" width="100"></vxe-column>
        <vxe-column title="操作" width="160" fixed="right" show-overflow>
        <template #default="{ row }">
          <vxe-button type="text" status="success" icon="vxe-icon-edit" @click="handleUpdate(row)">修改</vxe-button>
          <vxe-button type="text" status="danger" icon="vxe-icon-delete" @click="handleRemove(row)">删除</vxe-button>
        </template>
        </vxe-column>
      </vxe-table>
      <!-- 过滤条件弹框 -->
      <div v-show="filterDialogVisible" width="30%">
        <vxe-modal :visible.sync="filterDialogVisible" id="filterForm" :position="{top: 245, left: 210}" :mask="false" :mask-closable="true"
        title="填写过滤条件" v-model="filterDialogVisible" width="600" min-width="460" resize remember storage transfer>
          <vxe-form :data="filterFormData" :items="searchForm" titleColon></vxe-form>
            <div style="margin-top:10px;float:right;margin-right:20px">
            <el-button type="danger" @click="filterDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="pageList">确 定</el-button>
            </div>
        </vxe-modal>
      </div>
      <!-- 新增页面弹框 -->
      <div v-show="dialogFormVisible" width="60%">
        <vxe-modal v-if="dialogFormVisible" title="新增数据页面" v-model="dialogFormVisible" :visible.sync="dialogFormVisible"
        @close="createModalClose" width="60%">
          <vxe-form ref="createFrom" title-width="120" title-align="right" titleColon
          :data="createFormData" :items="createForm" :rules="createFromRules"
          @submit="submitCreate('createFrom')" @reset="cancel('createFrom')">
            <template #myregion="{ data }">
              <el-upload
                class="upload-demo"
                action="http://localhost:9991/api/mkd/business/sysFile/uploadFiles"
                :on-preview="handlePreview(data)"
                :on-success="handleUploadSuccess"
                :on-error="handleUploadError"
                :on-remove="handleUploadRemove"
                :before-remove="beforeRemove"
                multiple
                :limit="1"
                :on-exceed="handleExceed"
                :file-list="fileList">
                <vxe-button type="text" status="primary" icon="vxe-icon-cloud-download">上传图片</vxe-button>
              </el-upload>
            </template>
          </vxe-form>
        </vxe-modal>
      </div>
    </template>
  <!-- <div v-show="!listLoading" class="pagination-container"> -->
  <template slot="footer">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="filterFormData.currentPage" :page-sizes="[10,20,30, 50,100,200,500]" :page-size="filterFormData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
  </template>

  </d2-container>
</template>

<script>
import mixins from '@/mixin/commonMixin.js'
import { } from '@/api/variations/index'
import { myMethods } from './js/containerManageMethod.js'
export default {
  name: 'userManager',
  mixins: [mixins],
  data() {
    return {
      fileList: [],
      applicationData: [],
      filterDialogVisible: false,
      filterFormData: {
        currentPage: 1,
        pageSize: 20,
        storeStatus: '0',
        shopName: '',
        cname: '',
        goodsName: '',
        skuCode: '',
        itemId: ''
      },
      searchForm: [
        {
          title: '左侧',
          span: 24,
          children: [
            { field: 'shopName', title: '店铺名称', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入名称' } } },
            { field: 'cname', title: '中文品名', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入名称' } } },
            { field: 'skuCode', title: 'SKU', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入名称' } } },
            { field: 'itemId', title: 'ITEM_ID', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入名称' } } }
          ]
        }
      ],
      createForm: [
        {
          title: '',
          span: 23,
          children: [
            {
              field: 'shopName',
              title: '店铺名称',
              span: 8,
              itemRender: {
                name: '$select',
                options: [],
                props: { clearable: true, placeholder: '请输入名称' }
              }
            },
            { field: 'cname', title: '中文品名', span: 8, itemRender: { name: '$input', props: { placeholder: '请输入名称' } } },
            { field: 'goodsName', title: 'Goods Name', span: 8, itemRender: { name: '$input', props: { placeholder: '请输入名称' } } },
            { field: 'skuCode', title: 'SKU', span: 8, itemRender: { name: '$input', props: { placeholder: '请输入名称' } } },
            { field: 'itemId', title: 'ITEM_ID', span: 8, itemRender: { name: '$input', props: { placeholder: '请输入名称' } } },
            { field: 'ctnNo', title: '制造商编号', span: 8, itemRender: { name: '$input', props: { placeholder: '请输入名称' } } },
            { field: 'fbaMl', title: 'FBA/ML-编码', span: 8, itemRender: { name: '$input', props: { placeholder: '请输入名称' } } },
            { field: 'referenceId', title: 'Reference ID', span: 8, itemRender: { name: '$input', props: { placeholder: '请输入名称' } } },
            { field: 'quantity', title: '数量', span: 8, itemRender: { name: '$input', props: { placeholder: '请输入名称' } } },
            { field: 'totalCtn', title: '总箱数', span: 8, itemRender: { name: '$input', props: { placeholder: '请输入名称' } } },
            { field: 'weight', title: '重量', span: 8, itemRender: { name: '$input', props: { placeholder: '请输入名称' } } },
            { field: 'cartonLength', title: '外箱尺寸-长', span: 8, itemRender: { name: '$input', props: { placeholder: '请输入名称' } } },
            { field: 'cartonWidth', title: '外箱尺寸-宽', span: 8, itemRender: { name: '$input', props: { placeholder: '请输入名称' } } },
            { field: 'cartonHeight', title: '外箱尺寸-高', span: 8, itemRender: { name: '$input', props: { placeholder: '请输入名称' } } },
            { field: 'ctnMeasurement', title: '单箱体积', span: 8, itemRender: { name: '$input', props: { placeholder: '请输入名称' } } },
            { field: 'totalVolume', title: '总体积', span: 8, itemRender: { name: '$input', props: { placeholder: '请输入名称' } } },
            { field: 'material', title: '材质', span: 8, itemRender: { name: '$input', props: { placeholder: '请输入名称' } } },
            { field: 'storeFunction', title: '用途', span: 8, itemRender: { name: '$input', props: { placeholder: '请输入名称' } } },
            { field: 'brand', title: '品牌', span: 8, itemRender: { name: '$input', props: { placeholder: '请输入名称' } } },
            { field: 'unitPrice', title: '单价', span: 8, itemRender: { name: '$input', props: { placeholder: '请输入名称' } } },
            { field: 'totalValue', title: '总价', span: 8, itemRender: { name: '$input', props: { placeholder: '请输入名称' } } },
            { field: 'hsCode', title: '海关编码', span: 8, itemRender: { name: '$input', props: { placeholder: '请输入名称' } } },
            { field: 'amazonUrl', title: 'Amazon地址', span: 8, itemRender: { name: '$input', props: { placeholder: '请输入名称' } } },
            { field: 'personUrl', title: '私人地址', span: 8, itemRender: { name: '$input', props: { placeholder: '请输入名称' } } },
            { field: 'mkdUrl', title: '美客多地址', span: 8, itemRender: { name: '$input', props: { placeholder: '请输入名称' } } },
            { field: 'urgency', title: '紧急程度', span: 8, itemRender: { name: '$input', props: { placeholder: '请输入名称' } } },
            { field: 'photo', title: '产品图片', span: 10, slots: { default: 'myregion' } }
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
      createFormData: {
        shopName: '',
        cname: '',
        goodsName: '',
        skuCode: '',
        itemId: '',
        ctnNo: '',
        fbaMl: '',
        referenceId: '',
        quantity: '',
        totalCtn: '',
        weight: '',
        cartonLength: '',
        cartonWidth: '',
        cartonHeight: '',
        ctnMeasurement: '',
        totalVolume: '',
        material: '',
        storeFunction: '',
        brand: '',
        unitPrice: '',
        totalValue: '',
        hsCode: '',
        photoId: '',
        photoUrl: '',
        amazonUrl: '',
        personUrl: '',
        mkdUrl: '',
        urgency: ''
      },
      createFromRules: {
        cname: [
          { required: true, message: '请输入用户', trigger: 'blur' }
        ]
      },
      tableData: [],
      form: {
        guid: undefined,
        user_name: undefined,
        user_code: undefined,
        user_sex: '男',
        user_password: undefined,
        description: undefined,
        user_phone: undefined
      },
      rules: {
        user_name: [
          { required: true, message: '请输入用户', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        user_code: [
          { required: true, message: '请输入账户', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        user_password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
        ]
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        currentPage: 1,
        pageSize: 10,
        user_name: undefined
      },
      sexOptions: ['男', '女'],
      dialogFormVisible: false,
      dialogStatus: '',
      userManager_btn_edit: true,
      userManager_btn_del: false,
      userManager_btn_add: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      queryFormItemConfig: {},
      queryFormData: {}
    }
  },
  methods: {
    ...myMethods,
    handlePreview(data) {
      console.log(data)
    },
    beforeRemove() {
      console.log('beforeRemove')
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
      console.log('handleExceed')
    },
    upload() {
      console.log('88888')
    },
    filterDialogVisibleClick() {
      if (this.filterDialogVisible) {
        this.filterDialogVisible = false
      } else {
        this.filterDialogVisible = true
      }
    },
    searchData() {},
    resetData() {},
    itemChange() {},
    handleSizeChange (val) {
      this.filterFormData.pageSize = val
      this.pageList()
    },
    handleCurrentChange (val) {
      this.filterFormData.currentPage = val
      this.pageList()
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
.headerClassName {
  background-color: #eff3ff;
  color: #454545;
  font-size: 15px;
  height: 10px;
}
.cellClassName{
  font-size: 16px;
  color: #545454;
}
</style>
