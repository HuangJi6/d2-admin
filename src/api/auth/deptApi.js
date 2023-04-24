import fetch from '@/plugin/axios'

export function queryDeptTree(params) {
  return fetch({ url: '/api/mkd/auth/sysDept/deptTree', method: 'post', data: params })
}

export function getOneApi(query) {
  return fetch({ url: '/api/mkd/auth/sysDept/getDto/' + query, method: 'get' })
}

export function addApi(params) {
  return fetch({ url: '/api/mkd/auth/sysDept/post', method: 'post', data: params })
}

export function updateApi(guid, params) {
  return fetch({ url: '/api/mkd/auth/sysDept/patch/' + guid, method: 'patch', data: params })
}

export function deleteApi(guid) {
  return fetch({ url: '/api/mkd/auth/sysDept/deleteByGuid/' + guid, method: 'delete' })
}
