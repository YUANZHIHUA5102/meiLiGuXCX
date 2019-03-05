// pages/map.js
const app = getApp()
import {
  ajax
} from "../../utils/util.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rankList: [
      // {
      //   url: 'http://www.shundecity.com/uploads/allimg/c121204/13545V25ZP-51363.jpg',
      //   text: '第一名',
      //   UserName: '明',
      //   CurrentPoint: 5100
      // },
      // {
      //   url: 'http://px.thea.cn/Public/Upload/1646772/Intro/1444203830.jpg',
      //   text: '第二名',
      //   UserName: '李四',
      //   CurrentPoint: 40
      // },
      // {
      //   url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542021828923&di=7dfdd2c7c5a1605ff2c1dc164b72d72b&imgtype=0&src=http%3A%2F%2Fwww.cqxdfpr.com%2Fuploads%2F180809%2F180809%2F28-1PP915521B21.png',
      //   text: '第三名',
      //   UserName: '张三峰',
      //   CurrentPoint: 30
      // },
      // {
      //   url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542021828923&di=7dfdd2c7c5a1605ff2c1dc164b72d72b&imgtype=0&src=http%3A%2F%2Fwww.cqxdfpr.com%2Fuploads%2F180809%2F180809%2F28-1PP915521B21.png',
      //   text: '第四名',
      //   UserName: '王五奇迹',
      //   CurrentPoint: 20
      // },
      // {
      //   url: 'http://px.thea.cn/Public/Upload/1646772/Intro/1444203830.jpg',
      //   text: '第六名',
      //   UserName: '李七',
      //   CurrentPoint: 10
      // },
      // {
      //   url: 'http://px.thea.cn/Public/Upload/1646772/Intro/1444203830.jpg',
      //   text: '第七名',
      //   UserName: '李八',
      //   CurrentPoint: 5
      // }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    ajax.get("/GetTenUsers").then(res => {
      console.log(res)
      that.setData({
        rankList: res
      })
    }).catch(err => {
      this.toast.showToast({
        toastType: "error",
        message: err
      })
    })
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