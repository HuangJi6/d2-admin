/**
 * 权限控制
 */
export default {
  install(Vue, options) {
    debugger
    const store = options.store
    Vue.directive('permission', {
      inserted: function (el, binding, vnode) {
        const isAdmin = true
        // 先默认管理员store.state.d2admin.permission.isAdmin
        if (isAdmin) {
          return
        }
        let checkCodes = []
        if (binding.arg === 'function') {
          checkCodes = store.state.d2admin.permission.functions
        } else if (binding.arg === 'role') {
          checkCodes = store.state.d2admin.permission.roles
        } else {
          checkCodes = store.state.d2admin.permission.functions.concat(store.state.d2admin.permission.roles)
        }
        let access = true
        if (binding.modifiers.all) {
          for (const need of binding.value) {
            if (checkCodes.some(s => s !== need)) {
              access = false
              break
            }
          }
        } else {
          access = false
          for (const need of binding.value) {
            if (checkCodes.some(s => s === need)) {
              access = true
              break
            }
          }
        }
        if (!access) {
          el.parentNode.removeChild(el)
        }
      }
    })
    Vue.prototype.hasPermissions = (permissions) => {
      const isAdmin = store.state.d2admin.permission.isAdmin
      if (isAdmin) {
        return true
      }
      let has = false
      const checkCodes = store.state.d2admin.permission.functions.concat(store.state.d2admin.permission.roles)
      for (const need of permissions) {
        if (checkCodes.some(s => s === need)) {
          has = true
          break
        }
      }
      return has
    }
    Vue.prototype.hasFunctions = (functions) => {
      const isAdmin = store.state.d2admin.permission.isAdmin
      if (isAdmin) {
        return true
      }
      let has = false
      const checkCodes = store.state.d2admin.permission.functions
      for (const need of functions) {
        if (checkCodes.some(s => s === need)) {
          has = true
          break
        }
      }
      return has
    }
    Vue.prototype.hasRoles = (roles) => {
      const isAdmin = store.state.d2admin.permission.isAdmin
      if (isAdmin) {
        return true
      }
      let has = false
      const checkCodes = store.state.d2admin.permission.roles
      for (const need of roles) {
        if (checkCodes.some(s => s === need)) {
          has = true
          break
        }
      }
      return has
    }
  }
}
