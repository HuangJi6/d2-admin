import fetch from '@/plugin/axios'

export function pageApi(params) {
  return fetch({ url: '/api/mkd/business/busOperatePay/pageDto', method: 'post', data: params })
}

export function pageMapApi(params) {
  return fetch({ url: '/api/mkd/business/busOperatePay/pageMap', method: 'post', data: params })
}

export function pageOperateMapApi(params) {
  return fetch({ url: '/api/mkd/business/busOperatePay/pageOperateMapApi', method: 'post', data: params })
}

export function addApi(params) {
  return fetch({ url: '/api/mkd/business/busOperatePay/post', method: 'post', data: params })
}

export function addBatchApi(params) {
  return fetch({ url: '/api/mkd/business/busOperatePay/postBatch', method: 'post', data: params })
}

export function updateApi(guid, params) {
  return fetch({ url: '/api/mkd/business/busOperatePay/patch/' + guid, method: 'patch', data: params })
}

export function getOneApi(query) {
  return fetch({ url: '/api/mkd/business/busOperatePay/getDto/' + query, method: 'get' })
}

export function getOperatePayOneApi(query) {
  return fetch({ url: '/api/mkd/business/busOperatePay/getOperatePayOneApi/' + query, method: 'get' })
}

export function deleteApi(guid) {
  return fetch({ url: '/api/mkd/business/busOperatePay/deleteByGuid/' + guid, method: 'delete' })
}
