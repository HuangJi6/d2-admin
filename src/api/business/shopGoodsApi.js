import fetch from '@/plugin/axios'

export function pageApi(params) {
  return fetch({ url: '/api/mkd/business/busShopGoods/pageDto', method: 'post', data: params })
}

export function pageMapApi(params) {
  return fetch({ url: '/api/mkd/business/busShopGoods/pageMap', method: 'post', data: params })
}

export function addApi(params) {
  return fetch({ url: '/api/mkd/business/busShopGoods/post', method: 'post', data: params })
}

export function updateApi(guid, params) {
  return fetch({ url: '/api/mkd/business/busShopGoods/patch/' + guid, method: 'patch', data: params })
}

export function getOneApi(query) {
  return fetch({ url: '/api/mkd/business/busShopGoods/getDto/' + query, method: 'get' })
}

export function deleteApi(guid) {
  return fetch({ url: '/api/mkd/business/busShopGoods/deleteByGuid/' + guid, method: 'delete' })
}
