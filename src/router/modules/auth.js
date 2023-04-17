import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

const meta = { auth: true }

export default {
  path: '/auth',
  name: 'demo-auth',
  meta,
  // redirect: { name: 'auth-userManage' },
  component: layoutHeaderAside,
  children: [
    { path: 'userManage', name: 'auth-userManage', component: _import('auth/user/userManage.vue'), meta: { ...meta, title: '用户管理' } },
    { path: 'roleManage', name: 'auth-roleManage', component: _import('auth/role/roleManage.vue'), meta: { ...meta, title: '角色管理' } },
    { path: 'resourceManage', name: 'auth-resourceManage', component: _import('auth/resource/resourceManage.vue'), meta: { ...meta, title: '资源管理' } },
    { path: 'businessManage', name: 'auth-businessManage', component: _import('auth/business/businessManage.vue'), meta: { ...meta, title: '业务管理' } }
  ]
}
