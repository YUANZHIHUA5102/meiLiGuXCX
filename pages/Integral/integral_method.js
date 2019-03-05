// pages/logs/input.js
const app = getApp()
import {
  ajax
} from "../../utils/util.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ruleList: [
      // { detail: "1.xxxxxxxxxxxxxxxxxxxx" }, 
      // { detail: "2.xxxxxxxxxxxxxxxxxxxx" },
      // { detail: '3.加油努力加油努力加油努力加油努力加油努力加油努力加油努力加油努力加油努力加油努' },
      // { detail: '4.加油努力加油努力加油努力加油努力加油努力加油努力加油努力加油努力加油努力加油努' },
      // { detail: '5.加油努力加油努力加油努力加油努力加油努力加油努力加油努力加油努力加油努力加油努' },
      // { detail: '6.加油努力加油努力加油努力加油努力加油努力加油努力加油努力加油努力加油努力加油努' },
      // { detail: '7.加油努力加油努力加油努力加油努力加油努力加油努力加油努力加油努力加油努力加油努' },
      // { detail: '8.加油努力加油努力加油努力加油努力加油努力加油努力加油努力加油努力加油努力加油努' },
      // { detail: '9.加油努力加油努力加油努力加油努力加油努力加油努力加油努力加油努力加油努力加油努' }
    ]
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
    var that = this
    that.toast = that.selectComponent("#toast");
    this.toast.showToast({
      toastType: "loading",
      message: '加载中...',
      duration: 60000
    })
    ajax.get("/GetRuleList").then(res => {
      console.log(res)
      this.setData({
        ruleList: res
      })
    }).catch(err => {
      this.toast.showToast({
        toastType: "error",
        message: err
      })
    })
    this.toast.hideToast();
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