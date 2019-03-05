// pages/test/showinfo.js
const app = getApp()
import {
  ajax
} from "../../utils/util.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
    reset_mail: false,
    message: '',
    hasUserInfo: false,
    userInfo: null,
    showModal: false,
    password: '',
    email: ''
  },
  onReady: function() {
    this.toast = this.selectComponent("#toast");
    let user = wx.getStorageSync("UserInfo")
    this.setData({
      user: user,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {



    var that = this;
    //----------------获取用户信息
    var avatarUrl = wx.getStorageSync("avatarUrl")
    that.setData({
      hasUserInfo: true,
      avatarUrl: avatarUrl
    })


    //   //----------------------头像处理
    //   if (app.globalData.userInfo) {
    //     this.setData({
    //       userInfo: app.globalData.userInfo,
    //       hasUserInfo: true
    //     })
    //   } else if (this.data.canIUse) {
    //     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //     // 所以此处加入 callback 以防止这种情况
    //     app.userInfoReadyCallback = res => {
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   } else {
    //     // 在没有 open-type=getUserInfo 版本的兼容处理
    //     wx.getUserInfo({
    //       success: res => {
    //         app.globalData.userInfo = res.userInfo
    //         this.setData({
    //           userInfo: res.userInfo,
    //           hasUserInfo: true
    //         })
    //       }
    //     })
    //   } 
  },


  //重置密码
  resetpwd: function(e) {
    this.setData({
      showModal: true,
      message: "请输入新密码",
      reset_mail: false
    })
  },
  inputChange: function(e) {
    if (this.data.reset_mail) {
      this.setData({
        email: e.detail.value
      })
    } else {
      this.setData({
        password: e.detail.value.replace(/[^\w\.\/]/ig, "")
      })
    }
  },
  //重置邮箱
  setemail: function(e) {
    var UserCode = this.data.user.UserCode;
    this.setData({
      showModal: true,
      message: "请输入新邮箱",
      reset_mail: true
    })
  },
  showDialogBtn: function() {
    this.setData({
      showModal: true
    })
  },

  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function() {},
  /**
   * 隐藏模态对话框
   */
  hideModal: function() {
    this.setData({
      showModal: false,
      email: '',
      password: ''
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function() {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function() {
    var that = this;
    //-------------------------------发送新邮箱
    if (that.data.reset_mail && that.checkEmail(that.data.email)) {
      ajax.post("/ChangeEmail", {
        badge: that.data.user.badge,
        email: that.data.email
      }).then(res => {
        this.toast.showToast({
          toastType: "none",
          message: "修改邮箱成功"
        })
        ajax.post("/UserLogin", { //------------------返回所有用户信息
          "mobile": this.data.user.mobile,
        }).then(res => {
          wx.setStorageSync("UserInfo", res)
          that.setData({
            user: res
          })
        })
        this.hideModal();
        that.setData({
          reset_mail: false
        })
      }).catch(err => {
        that.toast.showToast({
          toastType: "error",
          message: err
        })
      })
    } else if (!that.data.reset_mail) {
      if (!that.data.password) {
        that.toast.showToast({
          toastType: "error",
          message: '请输入密码',
        })
        return
      }
      //-------------------------------发送新密码
      ajax.post("/ChangePassword", {
        badge: that.data.user.badge,
        password: that.data.password
      }).then(res => {
        that.toast.showToast({
          toastType: "none",
          message: "修改密码成功"
        })
        that.setData({
          reset_mail: false
        })
        this.hideModal();
      }).catch(err => {
        that.toast.showToast({
          toastType: "error",
          message: err
        })
      })
    }
  },
  previewImage: function(e) {
    var current = this.data.userInfo.avatarUrl;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: [this.data.userInfo.avatarUrl]
      // 需要预览的图片http链接列表
    })
  },
  checkEmail: function(email) {
    let str = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
    if (str.test(email)) {
      return true
    } else {
      this.toast.showToast({
        toastType: "error",
        message: "请输入正确的邮箱"
      })
      return false
    }
  }
})