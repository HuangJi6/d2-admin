import fetch from '@/plugin/axios'

export function pageApi(params) {
  return fetch({ url: '/api/mkd/business/busGoods/pageDto', method: 'post', data: params })
}

export function addApi(params) {
  return fetch({ url: '/api/mkd/business/busGoods/post', method: 'post', data: params })
}

export function updateApi(guid, params) {
  return fetch({ url: '/api/mkd/business/busGoods/patch/' + guid, method: 'patch', data: params })
}

export function getOneApi(query) {
  return fetch({ url: '/api/mkd/business/busGoods/getDto/' + query, method: 'get' })
}

export function deleteApi(guid) {
  return fetch({ url: '/api/mkd/business/busGoods/deleteByGuid/' + guid, method: 'delete' })
}

export function updateBatchApi(params) {
  return fetch({ url: '/api/mkd/business/busGoods/patchBatch', method: 'patch', data: params })
}
