// pages/activity/activity_detail.js
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
    ActivityNumber: 0,
    islimit: true,
    limitnum: 0,
    activityuid: 0,
    issign: false, //当前用户是否已经报名
    tempFilePaths: "",
    overdue: false, //是否过期
    type: 0 //默认为0，1为全员通知
  },
  ToSignUp: function() {
    var that = this
    if (this.data.issign) {
      return
    }
    if (this.data.islimit == true && this.data.limitnum <= this.data.ActivityNumber) {
      that.toast.showToast({
        toastType: "none",
        message: "当前报名人数已满"
      })
      return
    }
    var that = this
    var createTime = formatTime(new Date());
    var user = wx.getStorageSync("UserInfo")
    ajax.post("/ToSignUp", {
      activityuid: that.data.activityuid,
      badge: user.badge,
      createTime: createTime
    }).then(res => {
      if (res) {
        that.setData({
          issign: res,
          //ActivityNumber: that.data.ActivityNumber+1
        })
        ajax.post("/GetNumOfActivity", {
          activityuid: that.data.activityuid
        }).then(res => {
          that.setData({
            ActivityNumber: res
          })
        })
      }
    }).catch(err => {
      that.toast.showToast({
        toastType: "error",
        message: err
      })
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var activities = wx.getStorageSync("GetActivitiesList")
    for (var i = 0; i < activities.length; i++) {
      activities[i].endTime = activities[i].endTime.substring(0, 10);
      that.setData({
        overdue: this.CompareDate(formatTime(new Date()), activities[i].endTime)
      })
      if (activities[i].activityuid == options.activityuid) {
        that.setData({
          activityuid: activities[i].activityuid,
          tempFilePaths: activities[i].detailsimg,
          limitnum: activities[i].limit,
          type: activities[i].type
        })
        if (activities[i].type == 1) { //全员通知 样式与过期活动一样
          that.setData({
            overdue: true
          })
        }
        // if (activities[i].type==1){ //type=1 全员参与类活动
        //   that.setData({
        //     islimit:false
        //   })
        // }
        break;
      }
    }


    var user = wx.getStorageSync("UserInfo")
    ajax.post("/IsSignUp", {
      badge: user.badge,
      activityuid: options.activityuid
    }).then(res => {
      that.setData({
        issign: res
      })
    })
    ajax.post("/GetNumOfActivity", {
      activityuid: options.activityuid
    }).then(res => {
      that.setData({
        ActivityNumber: res
      })
    })
  },
  CompareDate: function(d1, d2) {
    return ((new Date(d1.replace(/-/g, "\/"))) > (new Date(d2.replace(/-/g, "\/"))));
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // 页面渲染完成  
    this.toast = this.selectComponent("#toast")

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