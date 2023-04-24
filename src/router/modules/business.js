import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

const meta = { auth: true }

export default {
  path: '/business',
  name: 'demo-business',
  meta,
  // redirect: { name: 'demo-components-index' },
  component: layoutHeaderAside,
  children: [
    { path: 'containerManage', name: 'business-containerManage', component: _import('business/container/containerManage.vue'), meta: { ...meta, title: '待出库存装箱单' } },
    { path: 'application', name: 'business-application', component: _import('business/application/application.vue'), meta: { ...meta, title: '店铺管理' } },
    { path: 'supplier', name: 'business-supplier', component: _import('business/supplier/supplier.vue'), meta: { ...meta, title: '供应商管理' } },
    { path: 'goods', name: 'business-goods', component: _import('business/goods/goods.vue'), meta: { ...meta, title: '商品管理' } },
    { path: 'shopGoods', name: 'business-shopGoods', component: _import('business/shopGoods/shopGoods.vue'), meta: { ...meta, title: '店铺商品管理' } },
    { path: 'supplierGoods', name: 'business-supplierGoods', component: _import('business/supplierGoods/supplierGoods.vue'), meta: { ...meta, title: '供应商商品管理' } },
    { path: 'inContainer', name: 'business-inContainer', component: _import('business/inContainer/inContainer.vue'), meta: { ...meta, title: '仓库入库管理' } },
    { path: 'outContainer', name: 'business-outContainer', component: _import('business/outContainer/outContainer.vue'), meta: { ...meta, title: '仓库出库管理' } },
    { path: 'inContainerOuter', name: 'business-inContainerOuter', component: _import('business/inContainerOuter/inContainerOuter.vue'), meta: { ...meta, title: '仓库管理(外部)' } },
    { path: 'packingList', name: 'business-packingList', component: _import('business/packingList/packingList.vue'), meta: { ...meta, title: '箱单管理' } },
    { path: 'payer', name: 'business-payer', component: _import('business/payer/payer.vue'), meta: { ...meta, title: '付款人管理' } },
    { path: 'shopGoodsOperate', name: 'business-shopGoodsOperate', component: _import('business/shopGoodsOperate/shopGoodsOperate.vue'), meta: { ...meta, title: '运营采购管理' } }
  ]
}
