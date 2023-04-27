import fetch from '@/plugin/axios'

export function pageApi(params) {
  return fetch({ url: '/api/mkd/business/busShopGoodsOperate/pageDto', method: 'post', data: params })
}

export function pageMapApi(params) {
  return fetch({ url: '/api/mkd/business/busShopGoodsOperate/pageMap', method: 'post', data: params })
}

export function addApi(params) {
  return fetch({ url: '/api/mkd/business/busShopGoodsOperate/post', method: 'post', data: params })
}

export function updateApi(guid, params) {
  return fetch({ url: '/api/mkd/business/busShopGoodsOperate/patch/' + guid, method: 'patch', data: params })
}

export function updateComplate(params) {
  return fetch({ url: '/api/mkd/business/busShopGoodsOperate/updateOperateComplate', method: 'post', data: params })
}

export function getOneApi(query) {
  return fetch({ url: '/api/mkd/business/busShopGoodsOperate/getDto/' + query, method: 'get' })
}

export function deleteApi(guid) {
  return fetch({ url: '/api/mkd/business/busShopGoodsOperate/deleteByGuid/' + guid, method: 'delete' })
}
