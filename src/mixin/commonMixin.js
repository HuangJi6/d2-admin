import { Message } from 'element-ui'
import XEUtils from 'xe-utils'

export default {
  methods: {

    /**
     * 格式化数据保留两位金额方式
     * @param {*} param0 列
     * @param {*} digits 保留小数点后几位
     * @returns 格式化后数据
     */
    formatterAmount(object, digits = 2) {
      if (object.cellValue !== null && object.cellValue !== '' && object.cellValue !== undefined) {
        return XEUtils.commafy(XEUtils.toNumber(object.cellValue), { digits: digits })
      } else {
        return object.cellValue
      }
    },
    /**
     * 格式化数据保留3位方式
     * @param {*} param0 列
     * @param {*} digits 保留小数点后几位
     * @returns 格式化后数据
    */
    formatterVolume(object, digits = 3) {
      if (object.cellValue !== null && object.cellValue !== '' && object.cellValue !== undefined) {
        return XEUtils.toFixed(XEUtils.round(object.cellValue, digits), digits)
      } else {
        return object.cellValue
      }
    },
    /**
     * 格式化数据保留3位方式
     * @param {*} param0 列
     * @param {*} digits 保留小数点后几位
     * @returns 格式化后数据
    */
    formatterTwoPoint(object, digits = 2) {
      if (object.cellValue !== null && object.cellValue !== '' && object.cellValue !== undefined) {
        return XEUtils.toFixed(XEUtils.floor(object.cellValue, digits), digits)
      } else {
        return object.cellValue
      }
    },
    /**
     * 格式化数据保留3位方式
     * @param {*} param0 列
     * @param {*} digits 保留小数点后几位
     * @returns 格式化后数据
     */
    formatterOnePoint(object, digits = 1) {
      return XEUtils.toFixed(XEUtils.floor(object.cellValue, digits), digits)
    },
    /**
     * 统一调用接口处理方法
     * @param {*} promise 接口函数
     * @param {*} needLoading 是否需要loading框
     * @param {*} message loading框显示提示
     * @param {*} showSuccess 是否需要显示返回成功信息
     * @param {*} successMessage 返回成功显示提示
     * @returns 数据
     */
    handleHttpMethod(promise, needLoading = false, message, needSuccess = false, successMessage) {
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
              if (needSuccess) {
                Message({ message: successMessage, type: 'success', duration: 3 * 1000 })
              }
              resolve({ data: res.data })
            } else {
              console.log(res.msg)
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
    },

    /**
     *
     * @param {条件名称} conditionName
     * @param {条件类型} conditionType条件类型 #1:=;2:<;3:>;4:模糊like;5:<=;6:>=;7:between;8:模糊:notlike;9:!=;10:in;11:likeright;12:likeleft
     * @param {数据} data
     * @param {是否移除数据钟的属性} removeFlag
     * @returns 高级查询对象
     */
    buildCondition(conditionName, conditionType, data, removeFlag) {
      if (data[conditionName]) {
        const condition = {
          conditionName: conditionName,
          conditionType: conditionType,
          conditionValue: data[conditionName]
        }
        if (removeFlag) {
          this.$delete(data, conditionName)
        }
        return condition
      }
    },

    /**
     *
     * @param {条件名称} conditionName
     * @param {条件类型} conditionType条件类型 #1:=;2:<;3:>;4:模糊like;5:<=;6:>=;7:between;8:模糊:notlike;9:!=;10:in;11:likeright;12:likeleft
     * @param {数据} data
     * @param {是否移除数据钟的属性} removeFlag
     * @returns 高级查询对象
     */
    buildConditionData(conditionName, conditionType, data, removeFlag) {
      const condition = this.buildCondition(conditionName, conditionType, data, removeFlag)
      if (condition) {
        let conditionList = []
        if (data.conditionList) {
          conditionList = data.conditionList
        }
        conditionList.push(condition)
        data.conditionList = conditionList
      }
    }
  }
}
