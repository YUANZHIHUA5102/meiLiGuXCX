// pages/map.js
const app = getApp()
import {
  ajax,
  https
} from "../../utils/util.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rankList: [],
    presentView: 'T'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this

    // ajax.get("/GetTenUsers").then(res => {
    //   // console.log(res)
    //   that.setData({
    //     rankList: res
    //   })
    // }).catch(err => {
    //   this.toast.showToast({
    //     toastType: "error",
    //     message: err
    //   })
    // })
    wx.request({
      //url: "http://10.20.10.123:8080/exchange-0.0.1/GetTenUsers?type=T",
      url: https+"/GetTenUsers?type=T" ,
      method: 'get',
      success: function (res) {
        console.log('res', res.data);
        that.setData({
          rankList: res.data
        })
      }
    })
  },
  // 点击排行tab执行函数2019-3-5-yzh
  onClickTitle: function(e) {
    var that = this;
    var pre = e.currentTarget.dataset.pre;
    that.setData({
      presentView: pre
    })

    wx.request({
      //url: "https://mlg.proya.com/exchange-0.0.1/GetTenUsers?type=" + pre,
      url: https+"/GetTenUsers?type=" + pre,
      method: 'get',
      success: function(res) {
        console.log('res', res.data);
        that.setData({
          rankList: res.data
        })
      }
    })



    // ajax.post("/GetTenUsers").then(res => {
    //    console.log(res)
    //   that.setData({
    //     rankList: res
    //   })
    // }).catch(err => {
    //   this.toast.showToast({
    //     toastType: "error",
    //     message: err
    //   })
    // })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
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