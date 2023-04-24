import fetch from '@/plugin/axios'

export function pageApi(params) {
  return fetch({ url: '/api/mkd/business/busPayer/pageDto', method: 'post', data: params })
}

export function addApi(params) {
  return fetch({ url: '/api/mkd/business/busPayer/post', method: 'post', data: params })
}

export function updateApi(guid, params) {
  return fetch({ url: '/api/mkd/business/busPayer/patch/' + guid, method: 'patch', data: params })
}

export function getOneApi(query) {
  return fetch({ url: '/api/mkd/business/busPayer/getDto/' + query, method: 'get' })
}

export function deleteApi(guid) {
  return fetch({ url: '/api/mkd/business/busPayer/deleteByGuid/' + guid, method: 'delete' })
}

export function getAllApplication(params) {
  return fetch({ url: '/api/mkd/business/busPayer/getAllApplication', method: 'get', data: params })
}

export function queryApplication(params) {
  return fetch({ url: '/api/mkd/business/busPayer/queryApplication', method: 'post', data: params })
}
