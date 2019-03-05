// pages/logs/test.js
const app = getApp()
import {
  ajax
} from "../../utils/util.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    PointNum: []
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
    let user = wx.getStorageSync("UserInfo")
    this.setData({
      user: user,
    })
    ajax.post("/GetPointDetail", {
      badge: this.data.user.badge
    }).then(res => {
      console.log(res)
      this.setData({
        PointNum: res
      })
    }).catch(err => {
      this.toast.showToast({
        toastType: error,
        message: "err"
      })
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
    ajax.post("/GetPointDetail", {
      badge: this.data.user.badge
    }).then(res => {
      console.log(res)
      this.setData({
        PointNum: res
      })
    }).catch(err => {
      this.toast.showToast({
        toastType: "error",
        message: err
      })
    })
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

  }
})