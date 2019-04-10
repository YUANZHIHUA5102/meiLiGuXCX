//app.js
App({
  onLaunch: function() {

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                this.globalData.userInfo = res.userInfo
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              }
            })
          }
        }
      }),
      wx.getSystemInfo({
        success: (res) => {
          console.log(res)
          let modelmes = res.model;
          if (modelmes.search('iPhone X') != -1) {
            this.globalData.isIphoneX = true
          }
          if (modelmes.search("iPhone") > -1) wx.setStorageSync("modelmes", "iPhone")
          this.globalData.screenHeight = res.screenHeight
          this.globalData.screenWidth = res.screenWidth
          this.globalData.pixelRatio = Math.round(res.pixelRatio)
        },
      })
  },
  globalData: {
    screenHeight: 0,
    screenWidth: 0,
    isIphoneX: false,
    userInfo: null,
    Cart: [],
    pixelRatio: 0,
    first:false
  }
})