import fetch from '@/plugin/axios'

export function pageApplicationApi(params) {
  return fetch({ url: '/api/mkd/business/sysApplication/pageDto', method: 'post', data: params })
}

export function addApplicationContainerApi(params) {
  return fetch({ url: '/api/mkd/business/sysApplication/post', method: 'post', data: params })
}

export function updateApplicationContainerApi(guid, params) {
  return fetch({ url: '/api/mkd/business/sysApplication/patch/' + guid, method: 'patch', data: params })
}

export function getOneApi(query) {
  return fetch({ url: '/api/mkd/business/sysApplication/getDto/' + query, method: 'get' })
}

export function deleteApplicationApi(guid) {
  return fetch({ url: '/api/mkd/business/sysApplication/delete/' + guid, method: 'delete' })
}
