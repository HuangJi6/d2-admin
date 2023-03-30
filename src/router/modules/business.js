import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

const meta = { auth: true }

export default {
  path: '/business',
  name: 'demo-business',
  meta,
  redirect: { name: 'demo-components-index' },
  component: layoutHeaderAside,
  children: [
    { path: 'containerManage', name: 'business-containerManage', component: _import('business/container/containerManage.vue'), meta: { ...meta, title: '待出库存装箱单' } },
    { path: 'application', name: 'business-application', component: _import('business/application/application.vue'), meta: { ...meta, title: '店铺管理' } },
    { path: 'supplier', name: 'business-supplier', component: _import('business/supplier/supplier.vue'), meta: { ...meta, title: '供应商管理' } }
  ]
}
