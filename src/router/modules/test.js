import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

const meta = { auth: true }

export default {
  path: '/test',
  name: 'demo-test',
  meta,
  redirect: { name: 'demo-components-index' },
  component: layoutHeaderAside,
  children: [
    { path: 'test1', name: 'test-test1', component: _import('test/test1.vue'), meta: { ...meta, title: '测试页面1' } },
    { path: 'variation', name: 'test-variation', component: _import('test/variation.vue'), meta: { ...meta, title: '变体添加' } },
    { path: 'echarts', name: 'test-echarts', component: _import('test/echarts.vue'), meta: { ...meta, title: 'echarts测试菜单' } }
  ]
}
