import fetch from '@/plugin/axios'

export function pageUserInfoApi(params) {
  return fetch({ url: '/api/mkd/auth/user/page', method: 'post', data: params })
}

export function addUserInfoApi(params) {
  return fetch({ url: '/api/mkd/auth/user/post', method: 'post', data: params })
}

export function getOneApi(query) {
  return fetch({ url: '/api/mkd/auth/user/get/' + query, method: 'get' })
}

export function updateUserInfoApi(guid, params) {
  return fetch({ url: '/api/mkd/auth/user/patch/' + guid, method: 'patch', data: params })
}

export function deleteUserInfoApi(guid) {
  return fetch({ url: '/api/mkd/auth/user/delete/' + guid, method: 'delete' })
}
