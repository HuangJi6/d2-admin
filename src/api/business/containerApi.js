import fetch from '@/plugin/axios'

export function pageContainerApi(params) {
  return fetch({ url: '/api/mkd/business/storeContainer/pageDto', method: 'post', data: params })
}

export function addStoreContainerApi(params) {
  return fetch({ url: '/api/mkd/business/storeContainer/post', method: 'post', data: params })
}

export function getOneApi(query) {
  return fetch({ url: '/api/mkd/business/storeContainer/getDto/' + query, method: 'get' })
}

export function updateStoreContainerApi(guid, params) {
  return fetch({ url: '/api/mkd/business/storeContainer/patch/' + guid, method: 'patch', data: params })
}

export function deleteStoreContainerApi(guid) {
  return fetch({ url: '/api/mkd/business/storeContainer/delete/' + guid, method: 'delete' })
}
