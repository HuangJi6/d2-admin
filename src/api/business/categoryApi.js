import fetch from '@/plugin/axios'

export function getTreeCategoryApi(query) {
  return fetch({ url: '/api/mkd/business/busCategory/getTreeCategory', data: query, method: 'post' })
}

export function queryListApi(query) {
  return fetch({ url: '/api/mkd/business/busCategoryRelation/queryList', data: query, method: 'post' })
}

export function queryCategoryListApi(query) {
  return fetch({ url: '/api/mkd/business/busCategory/queryList', data: query, method: 'post' })
}
