// pages/component/inputpopup/inputpopup.js


Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },

  /**
   * 组件的初始数据
   */
  data: {
    showDialog: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //隐藏弹框
    hidePopup: function() {
      this.setData({
        showDialog: !this.data.showDialog
      })
    },
    //展示弹框
    showPopup() {
      this.setData({
        showDialog: !this.data.showDialog,

      })
      console.log(2)
    },
    /*
     * 内部私有方法建议以下划线开头
     * triggerEvent 用于触发事件
     */
    _success() {
      //触发成功回调
      console.log(111)
      this.triggerEvent("success");
    }
  }
})