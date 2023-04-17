import fetch from '@/plugin/axios'

export function pageApi(params) {
  return fetch({ url: '/api/mkd/business/busPackingList/pageDto', method: 'post', data: params })
}

export function pageMapApi(params) {
  return fetch({ url: '/api/mkd/business/busPackingList/pageMap', method: 'post', data: params })
}

export function addApi(params) {
  return fetch({ url: '/api/mkd/business/busPackingList/post', method: 'post', data: params })
}

export function updateApi(guid, params) {
  return fetch({ url: '/api/mkd/business/busPackingList/patch/' + guid, method: 'patch', data: params })
}

export function getOneApi(query) {
  return fetch({ url: '/api/mkd/business/busPackingList/getDto/' + query, method: 'get' })
}

export function deleteApi(guid) {
  return fetch({ url: '/api/mkd/business/busPackingList/delete/' + guid, method: 'delete' })
}

export function getUnOutPackingList() {
  return fetch({ url: '/api/mkd/business/busPackingList/getUnOutPackingList', method: 'get' })
}

export function queryListMap(params) {
  return fetch({ url: '/api/mkd/business/busPackingList/queryListMap', method: 'post', data: params })
}
