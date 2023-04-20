import fetch from '@/plugin/axios'

export function getOneApi(query) {
  return fetch({ url: '/api/mkd/auth/sysRole/getDto/' + query, method: 'get' })
}

export function addApi(params) {
  return fetch({ url: '/api/mkd/auth/sysRole/post', method: 'post', data: params })
}

export function updateApi(guid, params) {
  return fetch({ url: '/api/mkd/auth/sysRole/patch/' + guid, method: 'patch', data: params })
}

export function deleteApi(guid) {
  return fetch({ url: '/api/mkd/auth/sysRole/delete/' + guid, method: 'delete' })
}

export function queryListMap(params) {
  return fetch({ url: '/api/mkd/auth/sysRole/queryListMap', method: 'post', data: params })
}

export function queryRoleTree(params) {
  return fetch({ url: '/api/mkd/auth/sysRole/roleTree', method: 'post', data: params })
}

export function getRoleResourceByRoleId(query) {
  return fetch({ url: '/api/mkd/auth/sysRole/getRoleResourceByRoleId/' + query, method: 'get' })
}
