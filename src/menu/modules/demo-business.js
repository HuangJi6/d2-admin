export default {
  path: '/business',
  title: '业务管理',
  icon: 'puzzle-piece',
  children: [
    { path: '/business/application', title: '店铺管理', icon: 'user' },
    { path: '/business/supplier', title: '供应商管理', icon: 'user' },
    { path: '/business/goods', title: '商品管理', icon: 'user' },
    { path: '/business/containerManage', title: '待出库存装箱单', icon: 'user' }
  ]
}
