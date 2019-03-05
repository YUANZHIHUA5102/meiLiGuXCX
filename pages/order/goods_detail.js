const app = getApp()
import {
  ajax
} from "../../utils/util.js"
Page({
  data: {
    isIphoneX: app.globalData.isIphoneX,
    item: {},
    isLike: true, //是否收藏
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔,3s
    duration: 1000, //  滑动动画时长1s

  },
  //预览图片
  previewImage: function(e) {
    var that = this
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: that.data.item.imgviceurllist // 需要预览的图片http链接列表  
    })
  },
  onLoad: function(options) {
    var that = this
    //---------------------------发送请求获取对应商品信息
    ajax.post("/GetGoodDetail", {
      prizeuid: options.prizeuid
    }).then(res => {
      that.setData({
        item: res
      })
    }).catch(err => {
      wx.showToast({
        title: '参数无效',
        icon: 'loading',
      })
    })
  },
  onReady: function() {},
})