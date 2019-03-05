Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持 
  },
  /** 
   * 私有数据,组件的初始数据 
   * 可用于模版渲染 
   */
  data: { // 弹窗显示控制 
    animationData: {},
    content: '提示内容',
    hidden: //false  
      true
  },
  /**
   * 组件的方法列表 
   */
  methods: {
    /** 
     * 显示toast，定义动画
     */
    hideModal() {
      this.setData({
        hidden: true
      })
    },
    showModal(val) {
      var that = this
      this.setData({
        hidden: false,
        content: val
      })
      console.log(1);
      var animation = wx.createAnimation({
        duration: 800,
        timingFunction: 'ease-in-out',
      })
      setTimeout(function() {
        animation.translate(0, 400).step()
        this.setData({
          animationData: animation.export(),
          hidden: false
        })
      }.bind(this), 1200)
    }
  }
})