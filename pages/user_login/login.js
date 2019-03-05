var app = getApp();
import {
  ajax
} from "../../utils/util.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pixelRatio: app.globalData.pixelRatio,
    isIphoneX: app.globalData.isIphoneX,
    phoneNumber: '',
    password: '',
  },
  findpassword: function(e) {
    wx.navigateTo({
      url: '../find_password/findpwd',
    })
  },

  // 获取输入账号 
  phoneInput: function(e) {
    this.setData({
      phoneNumber: e.detail.value
    })
  },

  // 获取输入密码 
  passwordInput: function(e) {
    this.setData({
      password: e.detail.value
    })
  },

  // ------------------------------------------------登录验证函数 
  login: function() {
    var that = this
    let phoneNumber = that.data.phoneNumber
    let password = that.data.password
    if (!phoneNumber) {
      that.toast.showToast({
        toastType: "error",
        message: '请输入手机号码',
      })
      return
    }
    if (!(/^1[345789]\d{9}$/.test(phoneNumber))) {
      that.toast.showToast({
        toastType: "error",
        message: '请输入正确的手机号码',
      })
      return
    }
    if (!password || password == 0) {
      that.toast.showToast({
        toastType: "error",
        message: '请输入密码',
      })
      return
    }
    that.toast.showToast({
      toastType: "loading",
      message: '登录中...',
      duration: 60000
    })
    ajax.post("/AccountLogin", {
      "mobile": phoneNumber,
      "password": password
    }).then(res => {
      console.log(res)
      if (res) {
        ajax.post("/UserLogin", { //------------------返回所有用户信息
          "mobile": phoneNumber,
        }).then(res => {
          console.log(res)
          wx.setStorageSync("UserInfo", res)
          ajax.post("/GetPoint", {
            "badge": res.badge
          }).then(res => {
            console.log(res)
            console.log(app.globalData.point)
            wx.setStorageSync("Point", res)
            that.toast.showToast({
              toastType: "none",
              message: "登录成功",
            })
            wx.reLaunch({
              url: "../home/home"
            })
          })
        })
      } else {
        this.toast.showToast({
          toastType: "error",
          message: "用户名或密码不正确",
        })
      }
      //wx.setStorageSync("token", res.token)
    }).catch(err => {
      this.toast.showToast({
        toastType: "error",
        message: err,
      })
    })

  },
  wxlogin: function() {
    console.log(22222)
    var that = this;
    //----------------核对OPENDID是否已经存在   返回exsit and token
    let openid = wx.getStorageSync("openid")
    ajax.post("/WXLogin", {
      openID: openid
    }).then(res => {
      if (res) {
        console.log(res)
        app.globalData.user = res
        wx.setStorageSync("UserInfo", res)
        ajax.post("/GetPoint", {
          "badge": res.badge
        }).then(res => {
          wx.setStorageSync("Point", res)
          
          that.toast.showToast({
            toastType: "none",
            message: "快速登录成功",
            duration: 60000
          })
          wx.reLaunch({
            url: "../home/home"
          })
        })
      } else {
        console.log(openid)
        console.log(111111222)
        that.toast.showToast({
          toastType: "error",
          message: "当前微信用户未注册，请前往注册"
        })
      }
    }).catch(err => {
      // that.toast.showToast({
      //   toastType: "error",
      //   message: err
      // })
    })
  },
  register: function() {
    wx.navigateTo({
      url: '../register/register',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.toast = this.selectComponent("#toast")
    var that = this;
    //----------------------------------------获取OPENID函数
    wx.login({
      //获取code
      success: function (res) {
        var code = res.code; //返回code
        console.log('code=' + code);
        ajax.post("/getWxUserOpenid", {
          "code": res.code
        }).then(res => {
          console.log(res)
          wx.setStorageSync("openid", res.openid)
          that.wxlogin();
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})