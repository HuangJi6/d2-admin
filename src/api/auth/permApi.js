import fetch from '@/plugin/axios'

export function loginApi(params) {
  return fetch({ url: '/api/mkd/auth/perm/login', method: 'post', data: params })
}
