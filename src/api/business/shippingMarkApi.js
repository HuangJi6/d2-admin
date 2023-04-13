import fetch from '@/plugin/axios'

export function insertByOutContainer(params) {
  return fetch({ url: '/api/mkd/business/busShippingMark/insertByOutContainer', method: 'post', data: params })
}

export function pageMapApi(params) {
  return fetch({ url: '/api/mkd/business/busShippingMark/pageMap', method: 'post', data: params })
}
