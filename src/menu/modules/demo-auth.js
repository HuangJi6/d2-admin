export default {
  path: '/auth',
  title: '权限管理',
  icon: 'puzzle-piece',
  children: [
    { path: '/auth/userManage', title: '用户管理', icon: 'user' },
    { path: '/auth/roleManage', title: '角色管理', icon: 'users' },
    { path: '/auth/resourceManage', title: '资源管理', icon: 'folder-open' },
    { path: '/auth/businessManage', title: '业务管理', icon: 'briefcase' }
  ]
}
