import fetch from '@/plugin/axios'

export function pageApi(params) {
  return fetch({ url: '/api/mkd/business/busInContainer/pageDto', method: 'post', data: params })
}

export function pageMapApi(params) {
  return fetch({ url: '/api/mkd/business/busInContainer/pageMap', method: 'post', data: params })
}

export function addApi(params) {
  return fetch({ url: '/api/mkd/business/busInContainer/post', method: 'post', data: params })
}

export function addBatchApi(params) {
  return fetch({ url: '/api/mkd/business/busInContainer/postBatch', method: 'post', data: params })
}

export function updateApi(guid, params) {
  return fetch({ url: '/api/mkd/business/busInContainer/patch/' + guid, method: 'patch', data: params })
}

export function getOneApi(query) {
  return fetch({ url: '/api/mkd/business/busInContainer/getDto/' + query, method: 'get' })
}

export function deleteApi(guid) {
  return fetch({ url: '/api/mkd/business/busInContainer/delete/' + guid, method: 'delete' })
}

export function pageNotCheckMapApi(params) {
  return fetch({ url: '/api/mkd/business/busInContainer/pageNotCheckMapApi', method: 'post', data: params })
}

export function deleteBatchByGuids(params) {
  return fetch({ url: '/api/mkd/business/busInContainer/deleteBatchByGuids', method: 'post', data: params })
}
// export function directOutContainerApi(params) {
//   return fetch({ url: '/api/mkd/business/busOutContainer/directOutContainerApi', method: 'post', data: params })
// }
