import fetch from '@/plugin/axios'

/**
 * 测试请求GET
 * @param {data} query
 * @returns object
 */
export function getItemInfo(query) {
  return fetch({
    url: '/mkd/getTestInfo',
    method: 'get',
    params: query
  })
}

/**
 * 测试请求POST
 * @param {data} params
 * @returns object
 */
export function postItemInfo(params) {
  return fetch({
    url: '/mkd/postTestInfo',
    method: 'post',
    data: params
  })
}

/**
 * 测试请求POST
 * @param {data} params
 * @returns object
 */
export function putItemInfo(params) {
  return fetch({
    url: '/mkd/putTestInfo',
    method: 'put',
    data: params
  })
}

/**
 * 测试请求POST
 * @param {data} params
 * @returns object
 */
export function delItemInfo(params) {
  return fetch({
    url: '/mkd/delTestInfo',
    method: 'delete',
    data: params
  })
}
