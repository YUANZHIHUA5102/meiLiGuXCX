// pages/activity/activity_list.js
const app = getApp()
import {
  ajax,
  formatTime
} from "../../utils/util.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowActivitiesList: [],
    lostActivitiesList: [],
    swipertab: [{
      name: '当前活动',
      index: 0
    }, {
      name: '历史活动',
      index: 1
    }],
    currtab: 0, //当前显示订单类型
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
  },

  Todetail: function(e) {
    wx.navigateTo({
      url: '../activity/activity_detail?activityuid=' + e.currentTarget.dataset.id,
    })
  },
  CompareDate: function(d1, d2) {
    return ((new Date(d1.replace(/-/g, "\/"))) > (new Date(d2.replace(/-/g, "\/"))));
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
    this.toast.showToast({
      toastType: "loading",
      message: '加载中...',
      duration: 60000
    })
    ajax.get("/GetActivitiesList").then(res => {
      wx.setStorageSync("GetActivitiesList", res)
      var ActivitiesList = wx.getStorageSync("GetActivitiesList")
      var lostActivitiesList = [];
      for (var j = 0; j < ActivitiesList.length; j++) {
        if (ActivitiesList[j].description.length > 15) {
          ActivitiesList[j].description = ActivitiesList[j].description.substring(0, 15) + '...'
        }
        ActivitiesList[j].startTime = ActivitiesList[j].startTime.substring(0, 10);
        ActivitiesList[j].endTime = ActivitiesList[j].endTime.substring(0, 10);
        if (this.CompareDate(formatTime(new Date()), ActivitiesList[j].endTime)) { //过期的
          lostActivitiesList = lostActivitiesList.concat(ActivitiesList[j])
          ActivitiesList.splice(j, 1);
          j--; //ActivitiesList.length--;
        }
      }
      this.setData({
        nowActivitiesList: ActivitiesList,
        lostActivitiesList: lostActivitiesList
      })
      this.toast.hideToast();
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