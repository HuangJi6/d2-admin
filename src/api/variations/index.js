import fetch from '@/plugin/axios'

/**
 * 测试请求GET
 * @param {data} query
 * @returns object
 */
export function getItemInfo(query) {
  return fetch({
    url: '/api/mkd/business/test/getTestInfo',
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
    url: '/api/mkd/business/test/postTestInfo',
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
    url: '/api/mkd/business/test/putTestInfo',
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
    url: '/api/mkd/business/test/delTestInfo',
    method: 'delete',
    data: params
  })
}

/**
 * 添加变体从无变体到有变体
 * @param {data} params
 * @returns object
 */
export function addColorVariations(params) {
  return fetch({
    url: '/mkd/addColorVariations',
    method: 'post',
    data: params
  })
}

/**
 * 添加变体从无变体到有变体
 * @param {data} params
 * @returns object
 */
export function getAllApplication(params) {
  return fetch({
    url: '/mkd/application/getAllApplication',
    method: 'get',
    data: params
  })
}
