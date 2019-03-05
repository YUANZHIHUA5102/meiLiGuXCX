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
    sountDown: 0,
    userinfo: []
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
    console.log(e.detail.value)
  },
  //------------------------------点击注册函数
  register: function() {
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
    if (!password || password.length < 6) {
      that.toast.showToast({
        toastType: "error",
        message: '请输入6-11位密码',
      })
      return
    }
    let openid = wx.getStorageSync("openid")
    that.toast.showToast({
      toastType: "loading",
      message: '登录中...',
      duration: 60000
    })
    console.log(phoneNumber)
    console.log(password)
    console.log(openid)
    ajax.post("/UserRegister", {
      mobile: phoneNumber, //
      vcode: confirmcode,
      password: password,
      openID: openid,
      icon: that.data.userinfo.userInfo.avatarUrl
    }).then(res => {
      if (res) {
        ajax.post("/WXLogin", { //------------------返回所有用户信息和token
          openID: that.data.openid
        }).then(res => {
          console.log(res)
          app.globalData.user = res
          app.globalData.first = true
          app.globalData.userInfo = res
          
          wx.setStorageSync("UserInfo", res)
          ajax.post("/GetPoint", {
            "badge": res.badge
          }).then(res => {
            console.log(res)
            that.setData({
              point: res
            })
            wx.setStorageSync("Point", res)
            })
            that.toast.showToast({
              toastType: "none",
              message: "注册成功",
            })
          wx.reLaunch({
            url: "../home/home"
          })
        })
        // ajax.post("/UserLogin", { //------------------返回所有用户信息
        //   "mobile": phoneNumber, //
        // }).then(res => {
        //   console.log(res)
        //   app.globalData.user = res
        //   wx.setStorageSync("UserInfo", res)
        //   //wx.setStorageSync("token", res.token)
        //   ajax.post("/GetPoint", {
        //     "badge": res.badge
        //   }).then(res => {
        //     console.log(res)
        //     that.setData({
        //       point: res
        //     })
        //     wx.setStorageSync("Point", res)
        //     wx.setStorageSync("Point", res)
        //     that.toast.showToast({
        //       toastType: "none",
        //       message: "注册成功",
        //     })
        //     wx.reLaunch({
        //       url: "../home/home"
        //     })
        //   })
        // })
        
      } else {
        that.toast.showToast({
          toastType: "error",
          message: "验证码错误",
        })
      }

    }).catch(err => {
      that.toast.showToast({
        toastType: "error",
        message: "注册失败",
      })
    })


  },
  //-------------发送验证码函数
  sendcode: function() {
    var that = this
    if (that.data.sountDown > 0) return
    let phoneNumber = that.data.phoneNumber
    if (!(/^1[345789]\d{9}$/.test(phoneNumber))) {
      that.toast.showToast({
        toastType: "error",
        message: '请输入正确的手机号码',
      })
      return
    }

    ajax.post("/TestPhone", {
      "mobile": phoneNumber
    }).then(res => { //------------验证手机号是否在数据库中
      if (res == 0) {
        that.toast.showToast({
          toastType: "none",
          message: "该手机号不是员工手机号，无法注册",
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getUserInfo({
      success: function(res) {
        console.log(res)
        that.setData({
          userinfo: res
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.toast = this.selectComponent("#toast")
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
})