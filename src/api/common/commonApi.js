import fetch from '@/plugin/axios'

export function removeFilesApi(params) {
  return fetch({ url: '/api/mkd/business/sysFile/removeFiles', method: 'post', data: params })
}

export function removeFileByGuidApi(guid) {
  return fetch({ url: '/api/mkd/business/sysFile/deleteByGuid/' + guid, method: 'delete' })
}
