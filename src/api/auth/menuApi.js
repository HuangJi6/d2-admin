import fetch from '@/plugin/axios'

export function queryMenuTree(params) {
  return fetch({ url: '/api/mkd/auth/sysMenu/menuTree', method: 'post', data: params })
}

export function getOneApi(query) {
  return fetch({ url: '/api/mkd/auth/sysMenu/getDto/' + query, method: 'get' })
}

export function addApi(params) {
  return fetch({ url: '/api/mkd/auth/sysMenu/post', method: 'post', data: params })
}

export function updateApi(guid, params) {
  return fetch({ url: '/api/mkd/auth/sysMenu/patch/' + guid, method: 'patch', data: params })
}

export function deleteApi(guid) {
  return fetch({ url: '/api/mkd/auth/sysMenu/deleteByGuid/' + guid, method: 'delete' })
}
