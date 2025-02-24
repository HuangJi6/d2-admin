export default {
  path: '/business',
  title: '业务管理',
  icon: 'puzzle-piece',
  children: [
    { path: '/business/application', title: '店铺管理', icon: 'building' },
    { path: '/business/supplier', title: '供应商管理', icon: 'cubes' },
    { path: '/business/goods', title: '商品管理', icon: 'archive' },
    { path: '/business/supplierGoods', title: '供应商商品管理', icon: 'window-restore' },
    { path: '/business/shopGoods', title: '店铺商品管理', icon: 'asl-interpreting' },
    { path: '/business/shopGoodsOperate', title: '运营采购管理', icon: 'cart-plus' },
    { path: '/business/packingList', title: '箱单管理', icon: 'align-left' },
    { path: '/business/inContainerOuter', title: '仓库管理(外部)', icon: 'truck' },
    { path: '/business/outContainer', title: '仓库管理(内部)', icon: 'ship' },
    { path: '/business/inContainer', title: '仓库入库管理', icon: 'bank' },
    { path: '/business/containerManage', title: '待出库存装箱单', icon: 'user' }
  ]
}
