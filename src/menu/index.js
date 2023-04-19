import { uniqueId } from 'lodash'

// 插件
// import demoPlugins from './modules/demo-plugins'
// 组件
// import demoComponents from './modules/demo-components'
// 功能
// import demoPlayground from './modules/demo-playground'
// 测试
// import demoTest from './modules/demo-test'
// 用户权限管理
// import demoAuth from './modules/demo-auth'
// 业务管理
// import demoStore from './modules/demo-business.js'

// import demoStoreHeader from './modules/demo-business-header.js'

// import demoAuthHeader from './modules/demo-auth-header'

/**
 * @description 给菜单数据补充上 path 字段
 * @description https://github.com/d2-projects/d2-admin/issues/209
 * @param {Array} menu 原始的菜单数据
 */
function supplementPath(menu) {
  return menu.map(e => ({
    ...e,
    path: e.path || uniqueId('d2-menu-empty-'),
    ...e.children ? {
      children: supplementPath(e.children)
    } : {}
  }))
}

// 菜单 侧边栏
export const menuAside = supplementPath([

])

// 菜单 顶栏
export const menuHeader = supplementPath([
  {
    path: '/index',
    title: '首页',
    icon: 'home'
  }
])
