import fetch from '@/plugin/axios'

export function pageApi(params) {
  return fetch({ url: '/api/mkd/business/busSupplierGoods/pageDto', method: 'post', data: params })
}

export function pageMapApi(params) {
  return fetch({ url: '/api/mkd/business/busSupplierGoods/pageMap', method: 'post', data: params })
}

export function addApi(params) {
  return fetch({ url: '/api/mkd/business/busSupplierGoods/post', method: 'post', data: params })
}

export function addBatchApi(params) {
  return fetch({ url: '/api/mkd/business/busSupplierGoods/postBatch', method: 'post', data: params })
}

export function updateApi(guid, params) {
  return fetch({ url: '/api/mkd/business/busSupplierGoods/patch/' + guid, method: 'patch', data: params })
}

export function updateBatchApi(params) {
  return fetch({ url: '/api/mkd/business/busSupplierGoods/patchBatch', method: 'patch', data: params })
}

export function getOneApi(query) {
  return fetch({ url: '/api/mkd/business/busSupplierGoods/getDto/' + query, method: 'get' })
}

export function queryListByGuids(guids) {
  return fetch({ url: '/api/mkd/business/busSupplierGoods/queryListByGuids', method: 'post', data: guids })
}

export function deleteApi(guid) {
  return fetch({ url: '/api/mkd/business/busSupplierGoods/deleteByGuid/' + guid, method: 'delete' })
}
