import fetch from '@/plugin/axios'

export function pageApi(params) {
  return fetch({ url: '/api/mkd/business/sysApplication/pageDto', method: 'post', data: params })
}

export function addApi(params) {
  return fetch({ url: '/api/mkd/business/sysApplication/post', method: 'post', data: params })
}

export function updateApi(guid, params) {
  return fetch({ url: '/api/mkd/business/sysApplication/patch/' + guid, method: 'patch', data: params })
}

export function getOneApi(query) {
  return fetch({ url: '/api/mkd/business/sysApplication/getDto/' + query, method: 'get' })
}

export function deleteApi(guid) {
  return fetch({ url: '/api/mkd/business/sysApplication/deleteByGuid/' + guid, method: 'delete' })
}

export function getAllApplication(params) {
  return fetch({ url: '/api/mkd/business/sysApplication/getAllApplication', method: 'get', data: params })
}

export function queryApplication(params) {
  return fetch({ url: '/api/mkd/business/sysApplication/queryApplication', method: 'post', data: params })
}
