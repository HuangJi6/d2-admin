import fetch from '@/plugin/axios'

export function pageApi(params) {
  return fetch({ url: '/api/mkd/business/busSupplier/pageDto', method: 'post', data: params })
}

export function addApi(params) {
  return fetch({ url: '/api/mkd/business/busSupplier/post', method: 'post', data: params })
}

export function addByDtoApi(params) {
  return fetch({ url: '/api/mkd/business/busSupplier/postByDto', method: 'post', data: params })
}

export function updateApi(guid, params) {
  return fetch({ url: '/api/mkd/business/busSupplier/patch/' + guid, method: 'patch', data: params })
}

export function updateByDtoApi(guid, params) {
  return fetch({ url: '/api/mkd/business/busSupplier/patchByDto/' + guid, method: 'patch', data: params })
}

export function getOneApi(query) {
  return fetch({ url: '/api/mkd/business/busSupplier/getDto/' + query, method: 'get' })
}

export function deleteApi(guid) {
  return fetch({ url: '/api/mkd/business/busSupplier/deleteByGuid/' + guid, method: 'delete' })
}

export function deleteByGuidApi(guid) {
  return fetch({ url: '/api/mkd/business/busSupplier/deleteByGuid/' + guid, method: 'delete' })
}

export function postSupplierListApi(params) {
  return fetch({ url: '/api/mkd/business/busSupplier/postSupplierList', method: 'post', data: params })
}
