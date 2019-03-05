// pages/logs/logs.js
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
    isIphoneX: app.globalData.isIphoneX,
    point: [],
    showModalStatus: false, //是否显示
    //---------------当前选中的商品的信息
    imgurl: '', //商品图片
    prizeuid: 0, //规格ID
    name: '', //规格文本
    tag: '', //规格文本1
    taglist: [],
    cost: 0, //规格价格
    remaincount: 0, //剩余数量
    num: 1, //初始数量
    list: [], //当前购物车列表
    stylelist: [],
    imgurls: [],
    fillnum: 0
  },
  filter: function(e) {
    var that = this
    var prizeuid = e.currentTarget.dataset.prizeuid
    var name = e.currentTarget.dataset.name
    var tag = e.currentTarget.dataset.tag
    var taglist = e.currentTarget.dataset.taglist
    var cost = e.currentTarget.dataset.cost
    var imgurl = e.currentTarget.dataset.imgurl
    var remaincount = e.currentTarget.dataset.remaincount
    console.log(imgurl)
    that.setData({
      prizeuid: prizeuid,
      cost: cost,
      imgurl: imgurl,
      name: name,
      tag: tag,
      taglist: taglist,
      remaincount: remaincount
    });
    this.showModal();
  },
  numInput: function(e) {
    this.setData({
      num: e.detail.value
    })
  },
  //跳转商品详情界面
  goods_detail: function(e) {
    var prizeuid = e.currentTarget.dataset.prizeuid
    wx.navigateTo({
      url: '../order/goods_detail?prizeuid=' + prizeuid,
    })
  },

  /* 点击减号 */
  bindMinus: function() {
    var num = this.data.num;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 点击加号 */
  bindPlus: function() {
    var num = this.data.num;
    // 不作过多考虑自增1  
    if (num < this.data.remaincount) {
      num++;
    } else {
      return;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },

  //显示对话框
  showModal: function() {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true,
      num: 1
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function() {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  //直接兑换方法
  goods_buy: function() {
    var that = this;
    if (that.data.point.currentPoint < that.data.cost * that.data.num) {
      that.toast.showToast({
        toastType: "none",
        message: "积分不足 兑换失败"
      })
      return
    }
    wx.showModal({
      title: '提示',
      content: '确认兑换' + that.data.name + ' ' + that.data.num + '个',
      success(res) {
        if (res.confirm) {

          var prizeuid = that.data.prizeuid;
          var name = that.data.name;
          var tag = that.data.tag;
          var cost = that.data.cost;
          var remaincount = that.data.remaincount;
          var num = that.data.num;
          var imgurl = that.data.imgurl;
          ajax.post("/AddwaitPayOrder", {
            badge: that.data.point.badge,
            prizeuid: prizeuid,
            name: name,
            tag: tag,
            cost: cost,
            totalcost: num * cost,
            prizenum: num,
            status: 1,
            createTime: formatTime(new Date)
          }).then(res => {
            wx.showToast({
              title: '购买成功',
              icon: 'success',
              duration: 1200
            })
            wx.navigateTo({
              url: '../order/order',
            })
          }).catch(err => {

          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  //加入购物车方法
  addCart: function(e) {
    var that = this;
    var prizeuid = that.data.prizeuid;
    var name = that.data.name;
    var tag = that.data.tag;
    var taglist = that.data.taglist;
    var cost = that.data.cost;
    var remaincount = that.data.remaincount;
    var num = that.data.num;
    var imgurl = that.data.imgurl;


    wx.showToast({
      title: '已加入购物车',
      icon: 'success',
      duration: 1200
    })

    var hasgoods = false;
    //判断购物车内是否已经有该物品，若无则加入购物车，有则增加数量
    for (var i = 0; i < that.data.list.length; i++) {
      if (that.data.list[i].prizeuid == prizeuid) {

        that.data.list[i].num = that.data.list[i].num * 1 + num * 1;
        if (that.data.list[i].num > that.data.list[i].remaincount) {
          that.data.list[i].num = that.data.list[i].remaincount
        }
        hasgoods = true;
        console.log(hasgoods)
        break;
      }
    }
    if (!hasgoods) {
      console.log(hasgoods)
      that.setData({
        list: that.data.list.concat({
          prizeuid: prizeuid, //规格ID
          name: name, //规格文本
          imgurl: imgurl, //图片地址
          tag: tag, //规格文本1
          taglist: taglist,
          cost: cost, //规格价格
          select: "success", //选中状态
          num: num, //商品数量
          remaincount: remaincount, //剩余数量
        })
      });
    }
    app.globalData.Cart = that.data.list
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
    //----获取商品列表
    let goodslist = wx.getStorageSync("GoodsList")
    var fillnum = (3 - goodslist.length % 3) % 3
    let point = wx.getStorageSync("Point")
    this.setData({
      list: app.globalData.Cart,
      imgurls: goodslist,
      point: point,
      fillnum: fillnum
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
    var that = this;
    ajax.get("/GetGoodsList").then(res => {
      console.log(res)
      wx.setStorageSync("GoodsList", res)
      that.setData({
        imgurls: res
      })
    }).catch(err => {
      that.toast.showToast({
        toastType: error,
        message: "error"
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