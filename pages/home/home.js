//index.js
//获取应用实例
const app = getApp()
import {
  ajax
} from "../../utils/util.js"
let touchDotX = 0; //X按下时坐标
let touchDotY = 0; //y按下时坐标
let interval; //计时器
let time = 0; //从按下到松开共多少时间*100
Page({
  data: {
    isIphoneX: app.globalData.isIphoneX,
    user: [],
    point: [],
    hasUserInfo: false,
    Au_num: '',
    Ag_num: '',
    Cu_num: '',
    i: 0,
    imgurls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 4000,
    duration: 1000,
    imgShow: [],
    avatarUrl: ''
  },
  RightArrow: function() {
    var j = this.data.i;
    if (j == (this.data.imgurls.length - 3)) {
      return;
    }
    j = j * 1 + 1;
    this.setData({
      i: j
    })
  },
  LeftArrow: function() {
    var j = this.data.i;
    if (j == 0) {
      return;
    }
    j = j * 1 - 1;
    this.setData({
      i: j
    })
  },
  // 触摸开始事件
  touchStart: function(e) {
    touchDotX = e.touches[0].pageX; // 获取触摸时的原点
    touchDotY = e.touches[0].pageY;
    // 使用js计时器记录时间    
    interval = setInterval(function() {
      time++;
    }, 100);
  },
  // 触摸结束事件
  touchEnd: function(e) {
    var that = this;
    let touchMoveX = e.changedTouches[0].pageX;
    let touchMoveY = e.changedTouches[0].pageY;
    let tmX = touchMoveX - touchDotX;
    let tmY = touchMoveY - touchDotY;
    if (time < 20) {
      let absX = Math.abs(tmX);
      let absY = Math.abs(tmY);
      if (absX > 2 * absY) {
        if (tmX < 0) {
          console.log("左滑=====")
          that.RightArrow();
        } else {
          console.log("右滑=====")
          that.LeftArrow();
        }
      }
      if (absY > absX * 2 && tmY < 0) {
        console.log("上滑动=====")
      }
    }
    clearInterval(interval); // 清除setInterval
    time = 0;
  },
  CompareDate: function(d1, d2) {
    return ((new Date(d1.replace(/-/g, "\/"))) > (new Date(d2.replace(/-/g, "\/"))));
  },
  ChangToHelp: function() {

    wx.navigateTo({
      url: '../Integral/integral_method'　　 // 页面 积分获取规则
    })
  },
  ChangToList: function() {
    wx.navigateTo({
      url: '../Integral/integral_rank?type=T'
    })
  },
  ChangTo: function() {
    wx.navigateTo({
      url: '../Integral/integral_exchange'
    })
  },
  ChangToUserinfo: function() {
    wx.navigateTo({
      url: '../user_info/userinfo'
    })
  },
  //事件处理函数
  onLoad: function() {
    var that = this;
    var avatarUrl = wx.getStorageSync("avatarUrl")
    that.setData({
      avatarUrl: avatarUrl
    })
    wx.getUserInfo({
      success: function(res) {
        ajax.post("/SetAvatarUrl", {
          badge: that.data.user.badge,
          icon: res.userInfo.avatarUrl
        }).then(res => {
          that.setData({
            hasUserInfo: true,
          })
        }).catch(err => {})
      }
    })
    let user = wx.getStorageSync("UserInfo")
    let point = wx.getStorageSync("Point")
    that.setData({
      user: user,
      point:point
      // Au_num: point.rankinfo.goldnumber,
      // Ag_num: point.rankinfo.silvernumber,
      // Cu_num: point.rankinfo.coppernumber
    })
    that.calculater();
    ajax.get("/GetGoodsList").then(res => {
      wx.setStorageSync("GoodsList", res)
      that.setData({
        imgurls: res
      })
    }).catch(err => {
      that.toast.showToast({
        toastType: error,
        message: 'error'
      })
    })
    ajax.get("/GetShowActivitiesList").then(res => {
      that.setData({
        imgShow: res
      })
    }).catch(err => {
      that.toast.showToast({
        toastType: "none",
        message: 'error'
      })
    })
  },
  onReady: function() {
    //获得popup组件
    var that = this;
    this.toast = this.selectComponent("#toast") //异常提示组件
    this.update = this.selectComponent("#update") //升级弹窗组件
    this.welcome = this.selectComponent("#welcome") //欢迎弹窗组件
    let point = wx.getStorageSync("Point")
    console.log(app.globalData.user)
    if (app.globalData.first) { //判断是否第一次登录
      this.welcome.showModal("");
      app.globalData.first=false;
    } else {
      if (point.isupdate) { //判断用户等级是否提升
        this.update.showModal("");
      }
      ajax.get("/GetActivitiesList").then(res => {
        wx.setStorageSync("GetActivitiesList", res)
      })
    }
  },
  onShow: function() {
    var that = this;
    let user = wx.getStorageSync("UserInfo")
    ajax.post("/GetPoint", {
      badge: user.badge
    }).then(res => {
      that.setData({
        point: res
      })
      wx.setStorageSync("Point", res)
    })
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  calculater: function() {
    var that = this;
    let point = wx.getStorageSync("Point")
    var a = point.totalPoint;
    var Au_num = parseInt(a / 1250);
    var Ag_num = parseInt((a - Au_num * 1250) / 250)
    var Cu_num = parseInt((a - Au_num * 1250 - Ag_num * 250) / 50)
    that.setData({
      Au_num: Au_num,
      Ag_num: Ag_num,
      Cu_num: Cu_num
    })
  }
})