import fetch from '@/plugin/axios'

export function pageApi(params) {
  return fetch({ url: '/api/mkd/business/busOutContainer/pageDto', method: 'post', data: params })
}

export function pageMapApi(params) {
  return fetch({ url: '/api/mkd/business/busOutContainer/pageMap', method: 'post', data: params })
}

export function addApi(params) {
  return fetch({ url: '/api/mkd/business/busOutContainer/post', method: 'post', data: params })
}

export function addBatchApi(params) {
  return fetch({ url: '/api/mkd/business/busOutContainer/postBatch', method: 'post', data: params })
}

export function updateApi(guid, params) {
  return fetch({ url: '/api/mkd/business/busOutContainer/patch/' + guid, method: 'patch', data: params })
}

export function getOneApi(query) {
  return fetch({ url: '/api/mkd/business/busOutContainer/getDto/' + query, method: 'get' })
}

export function deleteApi(guid) {
  return fetch({ url: '/api/mkd/business/busOutContainer/delete/' + guid, method: 'delete' })
}

export function pageNotCheckMapApi(params) {
  return fetch({ url: '/api/mkd/business/busOutContainer/pageNotCheckMapApi', method: 'post', data: params })
}

export function deleteBatchByGuids(params) {
  return fetch({ url: '/api/mkd/business/busOutContainer/deleteBatchByGuids', method: 'post', data: params })
}

export function outContainerGroup(params) {
  return fetch({ url: '/api/mkd/business/busOutContainer/outContainerGroup', method: 'post', data: params })
}
