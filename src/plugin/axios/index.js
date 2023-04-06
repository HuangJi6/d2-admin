import store from '@/store'
import axios from 'axios'
import router from '@/router/index'
import { Message } from 'element-ui'
import util from '@/libs/util'
import loading from '@/libs/loading'
// import permission from '@/libs/permission'

// axios.defaults.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept,tokenid,appguid'

// 记录和显示错误
function errorLog(err) {
  // 添加到日志
  store.dispatch('d2admin/log/add', {
    type: 'error',
    err,
    info: '数据请求异常'
  })
  // 打印到控制台
  if (process.env.NODE_ENV === 'development') {
    util.log.danger('>>>>>> Error >>>>>>')
    console.log(err)
  }
  // 显示提示
  Message({
    message: err.message,
    type: 'error',
    duration: 5 * 1000
  })
}

// 创建一个 axios 实例
const service = axios.create({
  // 网关地址
  baseURL: 'http://localhost:9991',
  timeout: 20000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // if (!permission.access(config, store)) {
    //   // eslint-disable-next-line no-throw-literal
    //   throw {
    //     type: '403',
    //     config: config
    //   }
    // }
    loading.show(config)
    // 在请求发送之前做一些处理
    if (!(/^https:\/\/|http:\/\//.test(config.url))) {
      const token = util.cookies.get('token')
      if (token && token !== 'undefined') {
        // 让每个请求携带token-- ['Authorization']为自定义key 请根据实际情况自行修改
        config.headers.Authorization = 'Bearer ' + token
      }
      // 业务数据全局过滤条件
      const clientIds = store.state.d2admin.shopCheck.checkedClientIds
      if (clientIds && clientIds !== 'undefined' && clientIds !== 'null' && clientIds.length !== 0) {
        config.headers.clientIds = JSON.stringify(clientIds)
      }
    }
    return config
  },
  error => {
    // 发送失败
    console.log(error)
    Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    loading.hide(response.config)
    return response.data
  },
  error => {
    console.log(error)
    loading.hide(error.config)
    if (error.response && error.response.status === 401) {
      util.cookies.remove()
      if (error.config.url.indexOf('logout') === -1) {
        Message({
          message: '登陆信息已过期,请重新登陆!',
          type: 'error',
          duration: 3 * 1000
        })
      }
      setTimeout(() => {
        // 删除cookie
        util.cookies.remove('token')
        util.cookies.remove('uuid')
        // 跳转路由
        router.push({
          name: 'login'
        })
      }, 1000)
    } else if (error.response && error.response.status === 500) {
      errorLog(new Error(`系统错误!: ${error.config.url}`))
    } else if (error.message && error.message.indexOf('timeout') > -1) {
      errorLog(new Error(`网络超时!: ${error.config.url}`))
    } else if (error.type === '403') {
      errorLog(new Error(`没有请求权限!: ${error.config.url}`))
    } else {
      // errorLog(new Error(`网络错误!: ${error.config.url}`))
    }
    return Promise.reject(error)
  }
)

export default service
