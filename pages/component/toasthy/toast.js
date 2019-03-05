// components/toast/toast.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    pixelRatio: app.globalData.pixelRatio,
    message: "请稍后..",
    toastType: "error",
    show: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    preventTouchMove: function () { },
    showToast: function (obj) {
      let duration = obj.duration || 2200
      let val = typeof obj.message == "object" ? JSON.stringify(obj.message) : obj.message
      this.setData({
        show: true,
        message: val || "请稍后..",
        toastType: obj.toastType || "loading"
      })
      setTimeout(() => {
        this.setData({
          show: false
        })
      }, duration)
    },
    hideToast: function () {
      this.setData({
        show: false
      })
    }
  }
})
