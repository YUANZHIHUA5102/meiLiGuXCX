// pages/test/register.js
const app = getApp()
import {
  ajax
} from "../../utils/util.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber: '',
    confirmcode: '',
    passwrod: '',
    sountDown: 0
  },

  // 获取输入手机
  phoneInput: function(e) {
    this.setData({
      phoneNumber: e.detail.value
    })
  },
  // 获取输入密码 
  passwordInput: function(e) {
    this.setData({
      password: e.detail.value.replace(/[^\w\.\/]/ig, "")
    })
  },
  // 获取输入验证码 
  confirmcodeInput: function(e) {
    this.setData({
      confirmcode: e.detail.value
    })
  },
  confirm: function() {
    var that = this;
    let phoneNumber = that.data.phoneNumber
    let confirmcode = that.data.confirmcode
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
    if (!confirmcode) {
      that.toast.showToast({
        toastType: "error",
        message: '请输入验证码',
      })
      return
    }
    if (!password) {
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
    ajax.post("/FindPassword", {
      mobile: phoneNumber,
      openID: that.data.openid,
      vcode: confirmcode,
      password: password
    }).then(res => {
      if (res) {
        that.toast.showToast({
          toastType: "none",
          message: "重置成功",
        })
        console.log(res)
        ajax.post("/WXLogin", { //------------------返回所有用户信息和token
          openID: that.data.openid
        }).then(res => {
          console.log(res)
          app.globalData.userInfo = res
          wx.setStorageSync("UserInfo", res)
          //wx.setStorageSync("token", res.token)
          wx.reLaunch({
            url: "../home/home"
          })
        })
      } else {
        that.toast.showToast({
          toastType: error,
          message: "验证码错误",
        })
      }

    }).catch(err => {
      that.toast.showToast({
        toastType: error,
        message: "验证码错误",
      })
    })
  },
  //-------------发送验证码函数
  sendcode: function() {
    var that = this
    let phoneNumber = that.data.phoneNumber
    if (that.data.sountDown > 0) return
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
    ajax.post("/TestPhone", {
      mobile: phoneNumber
    }).then(res => { //------------验证手机号是否在数据库中
      console.log(res)
      if (res == 0) {
        that.toast.showToast({
          toastType: "none",
          message: "未查询到该用户",
        })
        return
      } else {
        that.toast.showToast({
          toastType: "loading",
          message: '发送验证码中...',
          duration: 60000
        })
        ajax.post("/SendCode", {
          mobile: phoneNumber
        }).then(res => {
          that.toast.showToast({
            toastType: "none",
            message: res,
          })
          that.startSountDown()
        }).catch(err => {
          that.toast.showToast({
            toastType: "error",
            message: '发送验证码失败',
          })
        })
      }
    })


  },
  startSountDown: function() {
    var time = 60
    var inter = setInterval(() => {
      this.setData({
        sountDown: time
      })
      time--
      if (time < 0) {
        time = 0
        clearInterval(inter)
      }
    }, 1000)
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
    this.toast = this.selectComponent("#toast");
    let openid = wx.getStorageSync("openid")
    this.setData({
      openid: openid
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