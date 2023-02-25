import { Message } from 'element-ui'

export default {
  methods: {
    handleHttpMethod(promise, needLoading = false, message, showSuccess = false, successMessage) {
      let loading = {
        close: () => { }
      }
      if (needLoading) {
        loading = this.$loading({
          lock: true,
          text: message || '正在请求中',
          spinner: 'ri-loader-4-line roll',
          background: 'rgba(0, 0, 0, 0.7)'
        })
      }
      return new Promise((resolve, reject) => {
        promise.then(res => {
          if (res) {
            if (res.code === '100000') {
              if (showSuccess) {
                Message({ message: successMessage, type: 'success', duration: 3 * 1000 })
              }
              resolve({ data: res.data })
            } else {
              console.log(res.errorInfor)
              if (res.msg) {
                Message({ message: `错误：[${res.code}-${res.msg}]`, type: 'error', duration: 5 * 1000 })
              } else if (res.message) {
                Message({ message: `错误：[${res.code}-${res.message}]`, type: 'error', duration: 5 * 1000 })
              } else {
                Message({ message: '未知错误', type: 'error', duration: 5 * 1000 })
              }
            }
          } else {
            Message({ message: '请求失败!', type: 'error', duration: 5 * 1000 })
            console.log(res)
          }
          loading.close()
          resolve(false)
        }).catch(err => {
          loading.close()
          Message({ message: '网络连接失败，请查看日志', type: 'error', duration: 5 * 1000 })
          console.log(err)
          resolve(false)
        })
      })
    }
  }
}
