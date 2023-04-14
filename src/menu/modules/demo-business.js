export default {
  path: '/business',
  title: '业务管理',
  icon: 'puzzle-piece',
  children: [
    { path: '/business/application', title: '店铺管理', icon: 'user' },
    { path: '/business/supplier', title: '供应商管理', icon: 'user' },
    { path: '/business/goods', title: '商品管理', icon: 'user' },
    { path: '/business/supplierGoods', title: '供应商商品管理', icon: 'user' },
    { path: '/business/shopGoods', title: '店铺商品管理', icon: 'user' },
    { path: '/business/shopGoodsOperate', title: '运营采购管理', icon: 'user' },
    { path: '/business/inContainer', title: '仓库入库管理', icon: 'user' },
    { path: '/business/inContainerOuter', title: '仓库管理(外部)', icon: 'user' },
    { path: '/business/packingList', title: '箱单管理', icon: 'user' },
    { path: '/business/outContainer', title: '仓库管理(内部)', icon: 'user' },
    { path: '/business/containerManage', title: '待出库存装箱单', icon: 'user' }
  ]
}
