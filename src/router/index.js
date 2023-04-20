import Vue from 'vue'
import VueRouter from 'vue-router'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import store from '@/store/index'
import util from '@/libs/util.js'
import * as permService from '@/api/auth/permApi'
// 路由数据
import routes from './routes'
import { menuHeader, menuAside } from '@/menu'

// fix vue-router NavigationDuplicated
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return VueRouterPush.call(this, location).catch(err => err)
}
const VueRouterReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace(location) {
  return VueRouterReplace.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

// 导出路由 在 main.js 里使用
const router = new VueRouter({
  routes
})

// 获取到的权限菜单
let permissionMenu = []
// 标记是否已经拉取权限信息

const fetchPermissionInfo = async () => {
  try {
    const uuid = util.cookies.get('uuid') || 'ghost-uuid'
    const userPermissionInfo = await permService.userMenuTree({ userGuid: uuid })
    // userInfo.name = userPermissionInfo.userName
    // userInfo.avatarUrl = userPermissionInfo.avatarUrl

    permissionMenu = userPermissionInfo.data
    // permissionHeader = userPermissionInfo.accessHeader
    // permissionRouter = userPermissionInfo.accessRoutes
    // permission.functions = userPermissionInfo.userPermissions
    // permission.roles = userPermissionInfo.userRoles
    // permission.interfaces = util.formatInterfaces(userPermissionInfo.accessInterfaces)
    // permission.isAdmin = userPermissionInfo.isAdmin === 1
  } catch (ex) {
    console.log(ex)
  }

  // formatRoutes(permissionRouter)
  console.log(permissionMenu)
  console.log(menuAside)
  const allMenuAside = [...menuAside, ...permissionMenu]
  const allMenuHeader = [...menuHeader, ...permissionMenu]
  // 动态添加路由
  // router.addRoutes(permissionRouter)
  // store.dispatch('d2admin/user/set', userInfo)
  // 处理路由 得到每一级的路由设置
  // store.commit('d2admin/page/init', [...frameInRoutes, ...permissionRouter])
  // 设置顶栏菜单
  store.commit('d2admin/menu/headerSet', allMenuHeader)
  // 设置侧边栏菜单
  store.commit('d2admin/menu/fullAsideSet', allMenuAside)
  // 设置需要重新加载菜单
  store.commit('d2admin/menu/isFetchPermissionInfoSet', true)
  // 初始化菜单搜索功能
  // store.commit('d2admin/search/init', allMenuAside)
  // 设置权限信息
  // store.commit('d2admin/permission/set', permission)
  // 加载上次退出时的多页列表
  // store.dispatch('d2admin/page/openedLoad')
  await Promise.resolve()
}

/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach(async (to, from, next) => {
  // 确认已经加载多标签页数据 https://github.com/d2-projects/d2-admin/issues/201
  await store.dispatch('d2admin/page/isLoaded')
  // 确认已经加载组件尺寸设置 https://github.com/d2-projects/d2-admin/issues/198
  await store.dispatch('d2admin/size/isLoaded')
  // 进度条
  NProgress.start()
  // 关闭搜索面板
  store.commit('d2admin/search/set', false)
  // 验证当前路由所有的匹配中是否需要有登录验证的
  if (to.matched.some(r => r.meta.auth)) {
    // 这里暂时将cookie里是否存有token作为验证是否登录的条件
    // 请根据自身业务需要修改
    const token = util.cookies.get('token')
    if (token && token !== 'undefined') {
      debugger
      const isFetchPermissionInfo = store.state.d2admin.menu.isFetchPermissionInfo
      if (!isFetchPermissionInfo) {
        debugger
        await fetchPermissionInfo()
        next(to.path, true)
      } else {
        next()
      }
    } else {
      // 没有登录的时候跳转到登录界面
      // 携带上登陆成功之后需要跳转的页面完整路径
      next({
        name: 'login',
        query: {
          redirect: to.fullPath
        }
      })
      // https://github.com/d2-projects/d2-admin/issues/138
      NProgress.done()
    }
  } else {
    // 不需要身份校验 直接通过
    next()
  }
})

router.afterEach(to => {
  // 进度条
  NProgress.done()
  // 多页控制 打开新的页面
  store.dispatch('d2admin/page/open', to)
  // 更改标题
  util.title(to.meta.title)
})

export default router
