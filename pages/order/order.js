// pages/order/order.js
var app = getApp();
import {
  formatTime,
  ajax
} from "../../utils/util.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: [],
    itemheight: 0,
    isIphoneX: app.globalData.isIphoneX,
    currtab: 1, //当前显示订单类型
    oldlist: [],
    swipertab: [{name: '已完成',index: 0},{name: '待处理',index: 1},{ name: '已失效',index: 2}],
    alreadyOrder: [], //完成订单
    waitPayOrder: [], //待处理订单
    lostOrder: [] //失效订单
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    let user = wx.getStorageSync("UserInfo")
    ajax.post("/GetPoint", {
      badge: user.badge
    }).then(res => {
      console.log(res)
      that.setData({
        point: res
      })
      wx.setStorageSync("Point", res)
    })
    if (options.currtab) {
      that.setData({
        currtab: options.currtab,
      })
    }

    that.orderShow()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function(e) {
    // 页面渲染完成
    var that = this;
    this.toast = this.selectComponent("#toast");
  },
  /**
   * @Explain：选项卡点击切换
   */
  tabSwitch: function(e) {
    var that = this
    if (this.data.currtab === e.target.dataset.current) {
      return false
    } else {
      that.setData({
        currtab: e.target.dataset.current
      })
    }
  },

  tabChange: function(e) {
    this.setData({
      currtab: e.detail.current
    })
    this.orderShow()
  },
  orderShow: function() {
    let that = this
    switch (this.data.currtab) {
      case 0:
        that.alreadyShow()
        break
      case 1:
        that.waitPayShow()
        break
      case 2:
        that.lostShow()
        break
    }
  },
  alreadyShow: function() {
    var that = this;
    let user = wx.getStorageSync("UserInfo")
    ajax.post("/GetalreadyOrder", {
      badge: user.badge
    }).then(res => {
      //console.log(res)
      var i = res.length
      for (var j = 0; j < i; j++) {
        res[j].finishTime = res[j].finishTime.substring(0, 19)
      }
      that.setData({
        itemheight: i * 202.4 + 100,
        alreadyOrder: that.reverse(res),
      })
      console.log(res)
    }).catch(err => {
      that.toast.showToast({
        toastType: "error",
        message: err
      })
    })
  },

  waitPayShow: function() {
    var that = this
    let user = wx.getStorageSync("UserInfo")
    //-------------------发送请求获取待处理订单
    ajax.post("/GetwaitPayOrder", {
      badge: user.badge
    }).then(res => {
      console.log(res)
      var i = res.length
      for (var j = 0; j < i; j++) {
        res[j].createTime = res[j].createTime.substring(0, 19)
      }
      that.setData({
        itemheight: i * 202.4 + 100,
        waitPayOrder: that.reverse(res),
      })
    }).catch(err => {
      that.toast.showToast({
        toastType: "error",
        message: err
      })
    })
  },

  lostShow: function() {
    var that = this;
    let user = wx.getStorageSync("UserInfo")
    ajax.post("/GetlostOrder", {
      badge: user.badge
    }).then(res => {
      console.log(res)
      var i = res.length
      for (var j = 0; j < i; j++) {
        res[j].finishTime = res[j].finishTime.substring(0, 19)
      }
      that.setData({
        itemheight: i * 202.4 + 100,
        lostOrder: that.reverse(res),
      })
    }).catch(err => {
      that.toast.showToast({
        toastType: "error",
        message: err
      })
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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
    this.orderShow();
    wx.stopPullDownRefresh();
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
  reverse: function(list) {
    var newlist = [];
    for (var i = list.length, j = 0; j < list.length; j++, i--) {
      newlist[i - 1] = list[j];
    }
    return newlist;
  }

})