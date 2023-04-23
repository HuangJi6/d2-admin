<!--店铺管理-->
<template>
  <d2-container>
    <template slot="header">
      <div style="float:left;padding-top:3px;width:70%">
        <el-input @keyup.enter.native="handleFilter" clearable style="width: 200px;margin-right: 20px;" class="filter-item" placeholder="商名称搜索" v-model="filterFormData.goodsName" size="small"> </el-input>
        <el-input @keyup.enter.native="handleFilter" clearable style="width: 200px;margin-right: 20px;" class="filter-item" placeholder="商品类别搜索" v-model="filterFormData.goodsCategory" size="small"> </el-input>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleRefresh" size="small">搜索</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="handleRefresh" size="small">刷新</el-button>
      </div>
      <div style="float:right;">
        <el-button icon="vxe-icon-square-plus" type="success" size="medium" style="width:100px" @click="handleCreate">新增</el-button>
        <el-button type="primary" size="medium" style="width:100px" @click="pageList()">刷新</el-button>
        <el-button v-if="!showGlobalSave" size="medium" style="width:100px" @click="handleUpdateGlobal">全局修改</el-button>
        <el-button v-if="showGlobalSave" size="medium" style="width:100px" @click="handleUpdateGlobalSave">保存</el-button>
        <el-button v-if="showGlobalSave" size="medium" style="width:100px" @click="handleUpdateGlobalCancel">取消</el-button>
      </div>
    </template>

    <template>
      <vxe-toolbar style="height:8%" :refresh="{query: pageList}" export custom zoom>
        <template #buttons>
          <el-button icon="vxe-icon-table" size="mini" style="width:120px">商品表格</el-button>
          <!-- <el-button icon="vxe-icon-chart-pie" size="mini" style="width:120px" @click="filterDialogVisibleClick">过滤数据</el-button> -->
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
        keep-source
        ref="vxeTableRef"
        height="92%"
        :edit-rules="createFromRules"
        :edit-config="editTableConfig"
        :row-config="{isHover: true}"
        @cell-click="handleCellClickEvent"
        :data="tableData">
        <vxe-column type="checkbox" width="45"></vxe-column>
        <vxe-column type="seq" title="序号" width="60"></vxe-column>
        <vxe-column field="goodsName" title="商品名称" width="150"></vxe-column>
        <vxe-column field="goodsCategory" title="商品类别" width="150" :edit-render="{autofocus: '.vxe-input--inner'}">
          <template #edit="{ row }">
            <vxe-input v-model="row.goodsCategory" type="text" @blur="categoryItemBlur(row)"></vxe-input>
          </template>
        </vxe-column>
        <vxe-column field="goodsLink" title="商品链接" width="150" :edit-render="{autofocus: '.vxe-input--inner'}">
          <template #edit="{ row }"><vxe-input v-model="row.goodsLink" type="text"></vxe-input></template>
        </vxe-column>
        <vxe-column field="imgLink" title="图片链接" width="150" :edit-render="{autofocus: '.vxe-input--inner'}">
          <template #edit="{ row }"><vxe-input v-model="row.imgLink" type="text"></vxe-input></template>
        </vxe-column>
        <vxe-column field="imgLink" title="产品图片" width="100">
          <template #default="{ row }">
            <el-image style="width: auto; height: 50px" :src="row.imgLink" :preview-src-list="[row.imgLink]"></el-image>
          </template>
        </vxe-column>
        <vxe-column field="material" title="材料" width="100" :edit-render="{autofocus: '.vxe-input--inner'}">
          <template #edit="{ row }"><vxe-input v-model="row.material" type="text"></vxe-input></template>
        </vxe-column>
        <vxe-column field="hsCode" title="HS CODE" width="120" :edit-render="{autofocus: '.vxe-input--inner'}">
          <template #edit="{ row }"><vxe-input v-model="row.hsCode" type="text"></vxe-input></template>
        </vxe-column>
        <vxe-column field="goodsNature" title="货物性质" width="120" :edit-render="{autofocus: '.vxe-input--inner'}">
          <template #edit="{ row }"><vxe-input v-model="row.goodsNature" type="text"></vxe-input></template>
        </vxe-column>
        <vxe-column field="outGoodsName" title="外部名称" width="120" :edit-render="{autofocus: '.vxe-input--inner'}">
          <template #edit="{ row }"><vxe-input v-model="row.outGoodsName" type="text"></vxe-input></template>
        </vxe-column>
        <vxe-column field="outEnglishGoodsName" title="英文名称" width="120" :edit-render="{autofocus: '.vxe-input--inner'}">
          <template #edit="{ row }"><vxe-input v-model="row.outEnglishGoodsName" type="text"></vxe-input></template>
        </vxe-column>
        <vxe-column field="grade" title="评级" width="100"></vxe-column>
        <vxe-column field="goodsLength" title="商品-长/CM" width="100"></vxe-column>
        <vxe-column field="goodsWidth" title="商品-宽/CM" width="100"></vxe-column>
        <vxe-column field="goodsHigh" title="商品-高/CM" width="100"></vxe-column>
        <vxe-column field="goodsWeight" title="商品-重量" width="100"></vxe-column>
        <vxe-column field="goodsPrice" title="商品-单价" width="100"></vxe-column>
        <vxe-column field="goodsUse" title="用途" width="120" :edit-render="{autofocus: '.vxe-input--inner'}">
          <template #edit="{ row }"><vxe-input v-model="row.goodsUse" type="text"></vxe-input></template>
        </vxe-column>
        <vxe-column field="brand" title="品牌" width="100" :edit-render="{autofocus: '.vxe-input--inner'}">
          <template #edit="{ row }"><vxe-input v-model="row.brand" type="text"></vxe-input></template>
        </vxe-column>
        <vxe-column field="remark" title="备注" width="200"></vxe-column>
        <vxe-column title="操作" align="center" width="145" fixed="right" show-overflow>
          <template #default="{ row }">
            <vxe-button style="width:40px;margin-left:0px;padding-right:0px;padding-left:0px" type="text" status="primary" content="复制" @click="handleCopy(row)"></vxe-button>
            <vxe-button style="width:40px;margin-left:0px;padding-right:0px;padding-left:0px" type="text" status="success" content="修改" @click="handleUpdate(row)"></vxe-button>
            <vxe-button style="width:40px;margin-left:0px;padding-right:0px;padding-left:0px" type="text" status="danger" content="删除" @click="handleRemove(row)"></vxe-button>
          </template>
        </vxe-column>
      </vxe-table>
      <div v-show="dialogFormVisible" width="60%">
        <vxe-modal v-if="dialogFormVisible" title="新增数据页面" v-model="dialogFormVisible" :visible.sync="dialogFormVisible"
        @close="createModalClose" width="60%">
          <vxe-form ref="createFrom" title-width="120" title-align="right" titleColon
          :data="createFormData" :items="createForm" :rules="createFromRules"
          @submit="handleSubmitCreate('createFrom')" @reset="handleCancelCreate('createFrom')">
          <template #goodsCategorySlot>
            <ChooseCategoryComponentsVue
            :selectedCategory="createFormData.goodsCategory"
            :defaultCheckedKeys="[createFormData.categoryGuid]"
            :busGuid="createFormData.guid"
            :singleSelect="true"
            @onSureClick="categorySureClick"
            >
            </ChooseCategoryComponentsVue>
          </template>
          </vxe-form>
        </vxe-modal>
      </div>
    </template>

    <template slot="footer">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="filterFormData.currentPage" :page-sizes="[10,20,30, 50]" :page-size="filterFormData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </template>
  </d2-container>
</template>

<script>
import mixins from '@/mixin/commonMixin.js'
import { myMethods } from './js/goodsMethod.js'
import ChooseCategoryComponentsVue from '../category/components/chooseCategoryComponents.vue'
export default {
  components: { ChooseCategoryComponentsVue },
  name: 'goods',
  mixins: [mixins],
  data() {
    return {
      categoryList: [],
      showGlobalSave: false,
      editTableConfig: {},
      dialogStatus: '',
      dialogFormVisible: false,
      tableData: [],
      listLoading: false,
      total: null,
      filterFormData: {
        currentPage: 1,
        pageSize: 20,
        goodsName: '',
        goodsCategory: ''
      },
      createFormData: {
        goodsNature: '',
        goodsName: '',
        goodsCategory: '',
        categoryGuid: '',
        goodsLink: '',
        imgLink: '',
        material: '',
        grade: '',
        goodsLength: '',
        goodsWidth: '',
        goodsHigh: '',
        goodsWeight: '',
        goodsPrice: '',
        goodsUse: '',
        brand: '',
        remark: ''
      },
      createFromRules: {
        goodsName: [
          { required: true, message: '请输入商名称', trigger: 'blur' }
        ],
        goodsLink: [
          { required: true, message: '请输入商品链接', trigger: 'blur' }
        ],
        goodsCategory: [
          { required: true, message: '请输入商品类别', trigger: 'blur' }
        ],
        imgLink: [
          { required: true, message: '请输入商品图片', trigger: 'blur' }
        ],
        hsCode: [
          { required: true, message: '请输入商品HS CODE', trigger: 'blur' }
        ],
        goodsNature: [
          { required: true, message: '请选择商品货物性质', trigger: 'blur' }
        ],
        outGoodsName: [
          { required: true, message: '请输入外部名称,该字段将用于箱单表中', trigger: 'blur' }
        ],
        outEnglishGoodsName: [
          { required: true, message: '请输入英文名称,该字段将用于箱单表中', trigger: 'blur' }
        ],
        goodsUse: [
          { required: true, message: '请输入用途将用于箱单表中,格式:中文 (英文)' }
        ],
        material: [
          { required: true, message: '请输入材质将用于箱单表中,格式:中文 (英文)' }
        ],
        brand: [
          { required: true, message: '请输入品牌将用于箱单表中如无请填写: 无' }
        ]
      },
      createForm: [
        {
          title: '',
          span: 23,
          children: [
            { field: 'goodsName', title: '商品名称', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入商品名称' } } },
            { field: 'goodsCategory', title: '商品类别', span: 12, slots: { default: 'goodsCategorySlot' } },
            { field: 'goodsLink', title: '商品链接', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入商品链接' } } },
            { field: 'imgLink', title: '图片链接', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入图片链接' } } },
            { field: 'material', title: '材质', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入材质将用于箱单表中,格式:中文 (英文)' } } },
            { field: 'hsCode', title: 'HS CODE', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入海关编码' } } },
            {
              field: 'goodsNature',
              title: '货物性质',
              span: 12,
              itemRender: {
                name: '$select',
                options: [{ label: '普货', value: '普货' }, { label: '纺织品', value: '纺织品' }, { label: '带电产品', value: '带点产品' }, { label: '敏感货', value: '敏感货' }],
                props: { placeholder: '请输入货物性质' }
              }
            },
            { field: 'outGoodsName', title: '外部名称', span: 12, itemRender: { name: '$input', props: { placeholder: '外部名称,用于对外展示如箱单中的中文品名' } } },
            { field: 'outEnglishGoodsName', title: '英文名称', span: 12, itemRender: { name: '$input', props: { placeholder: '英文名称,用于对外展示箱单中的GOODS NAME' } } },
            { field: 'goodsPrice', title: '商品-单价', span: 12, itemRender: { name: '$input', props: { placeholder: '输入商品-单价,用于建议采购价格' } } },
            { field: 'goodsUse', title: '商品-用途', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入用途将用于箱单表中,格式:中文 (英文)' } } },
            { field: 'brand', title: '商品-品牌', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入商品-品牌,如无请填写: 无' } } },
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
            { field: 'goodsLength', title: '商品-长/CM', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入商品-长/CM,选填字段' } } },
            { field: 'goodsWidth', title: '商品-宽/CM', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入商品-宽/CM,选填字段' } } },
            { field: 'goodsHigh', title: '商品-高/CM', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入商品-高/CM,选填字段' } } },
            { field: 'goodsWeight', title: '商品-重量/KG', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入商品-重量,选填字段' } } },
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
      ]
    }
  },
  methods: {
    ...myMethods
  },
  created() {
    this.initCreated()
  },
  mounted() {
    this.initMounted()
  }
}
</script>
