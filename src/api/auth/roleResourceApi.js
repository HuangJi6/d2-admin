import fetch from '@/plugin/axios'

export function queryListMap(params) {
  return fetch({ url: '/api/mkd/auth/sysRoleResource/queryListMap', method: 'post', data: params })
}
export function refreshRoleResources(params) {
  return fetch({ url: '/api/mkd/auth/sysRoleResource/refreshRoleResources', method: 'post', data: params })
}
