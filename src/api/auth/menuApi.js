import fetch from '@/plugin/axios'

export function queryListMap(params) {
  return fetch({ url: '/api/mkd/auth/sysMenu/menuTree', method: 'post', data: params })
}
