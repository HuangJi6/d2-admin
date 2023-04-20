import fetch from '@/plugin/axios'

export function queryListMap(params) {
  return fetch({ url: '/api/mkd/auth/sysUserRole/queryListMap', method: 'post', data: params })
}
export function refreshUserRoles(params) {
  return fetch({ url: '/api/mkd/auth/sysUserRole/refreshUserRoles', method: 'post', data: params })
}
