var app = getApp();
import {
  ajax,
  formatTime
} from "../../utils/util.js"
Page({
  data: {
    islist: false, //购物车内是否有物品
    buylist: [], //已购列表
    list: app.globalData.Cart, //当前购物车内物品列表
    allSelect: "circle", //全选图标类型
    num: 0, //商品数量
    count: 0, //商品总数
    point: [] //用户积分信息
  },
  //跳转商品详情
  goods_detail: function(e) {
    var prizeuid = e.currentTarget.dataset.prizeuid
    wx.navigateTo({
      url: '../order/goods_detail?prizeuid=' + prizeuid,
    })
  },
  //返回积分商城界面
  inte_exchange: function() {
    wx.navigateTo({
      url: '../Integral/integral_exchange'
    })
  },
  //改变选框状态
  change: function(e) {
    var that = this
    //得到下标
    var index = e.currentTarget.dataset.index
    //得到选中状态
    var select = e.currentTarget.dataset.select
    if (select == "circle") {
      var stype = "success"
    } else {
      var stype = "circle"
    }
    //把新的值给新的数组
    var newList = that.data.list
    newList[index].select = stype
    //把新的数组传给前台
    that.setData({
      list: newList
    })
    //调用计算数目方法
    that.countNum()
    //计算金额
    that.count()
    //判断是否全选
    that.ISallSelect()
  },
  //加法
  addtion: function(e) {
    var that = this
    //得到下标
    var index = e.currentTarget.dataset.index
    //得到点击的值
    var num = e.currentTarget.dataset.num
    //不大于生于数量
    if (num < that.data.list[index].remaincount) {
      num++
    } else {
      return;
    }
    //把新的值给新的数组
    var newList = that.data.list
    newList[index].num = num

    //把新的数组传给前台
    that.setData({
      list: newList
    })
    //调用计算数目方法
    that.countNum()
    //计算金额
    that.count()
  },
  //减法
  subtraction: function(e) {
    var that = this
    //得到下标
    var index = e.currentTarget.dataset.index
    //得到点击的值
    var num = e.currentTarget.dataset.num
    //把新的值给新的数组
    var newList = that.data.list
    //当1件时，点击移除
    if (num == 1) {
      newList.splice(index, 1)
    } else {
      num--
      newList[index].num = num
    }
    //把新的数组传给前台
    that.setData({
      list: newList
    })
    //调用计算数目方法
    that.countNum()
    //计算金额
    that.count()
  },
  //全选
  allSelect: function(e) {
    var that = this
    if (e.currentTarget.dataset.select == undefined) {
      return;
    }
    //先判断现在选中没
    var allSelect = e.currentTarget.dataset.select

    var newList = that.data.list
    if (allSelect == "circle") {
      //先把数组遍历一遍，然后改掉select值
      for (var i = 0; i < newList.length; i++) {
        newList[i].select = "success"
      }
      var select = "success"
    } else {
      for (var i = 0; i < newList.length; i++) {
        newList[i].select = "circle"
      }
      var select = "circle"
    }
    that.setData({
      list: newList,
      allSelect: select
    })
    //调用计算数目方法
    that.countNum()
    //计算金额
    that.count()
  },
  //判断当前是否是全选
  ISallSelect: function() {
    var that = this;
    var newList = that.data.list
    if (newList.length == 0) {
      return;
    }
    for (var i = 0; i < newList.length; i++) {
      if (newList[i].select == "circle") {
        var select = "circle";
        break;
      }
      var select = "success"
    }
    that.setData({
      allSelect: select
    })
  },
  //计算数量
  countNum: function() {
    var that = this
    //遍历数组，把既选中的num加起来
    var newList = that.data.list
    var allNum = 0
    for (var i = 0; i < newList.length; i++) {
      if (newList[i].select == "success") {
        allNum += parseInt(newList[i].num)
      }
    }
    parseInt
    that.setData({
      num: allNum
    })
    if (this.data.list.length == 0) { //购物车没东西时触发
      that.setData({
        islist: false
      })
    }
  },
  //计算金额方法
  count: function() {
    var that = this
    //思路和上面一致
    //选中的订单，数量*价格加起来
    var newList = that.data.list
    var newCount = 0
    for (var i = 0; i < newList.length; i++) {
      if (newList[i].select == "success") {
        newCount += newList[i].num * newList[i].cost
      }
    }
    that.setData({
      count: newCount
    })
  },
  onLoad: function() {},
  onReady: function() {
    this.toast = this.selectComponent("#toast");
    var point = wx.getStorageSync("Point")
    var user = wx.getStorageSync("UserInfo")
    this.setData({
      point: point,
      user: user
    })
  },
  onShow: function() {
    this.setData({
      list: app.globalData.Cart
    })
    this.count()
    this.countNum()
    this.ISallSelect()
    if (this.data.list.length != 0) {
      this.setData({
        islist: true
      })
    } else {
      this.setData({
        islist: false
      }) 
    }
  },
  //直接兑换方法
  Topay: function() {
    var that = this;
    if (that.data.count == 0) {
      return;
    }
    //比较用户积分是否足够
    var point = wx.getStorageSync("Point")
    if (point.currentPoint < that.data.count) {
      that.toast.showToast({
        toastType: "none",
        message: "积分不足 兑换失败"
      })
      return
    }
    wx.showModal({
      title: '提示',
      content: '是否确认兑换',
      success(res) {
        if (res.confirm) {
          //显示兑换成功
          that.toast.showToast({
            toastType: "none",
            message: "兑换成功"
          })
          //去除从购物车兑换物品
          app.globalData.Cart = that.remove(that.data.list, "success");
          for (var index in that.data.buylist) {
            var createTime = "buylist[" + index + "].createTime"
            var totalcost = "buylist[" + index + "].totalcost"
            var status = "buylist[" + index + "].status"
            var badge = "buylist[" + index + "].badge"
            var prizenum = "buylist[" + index + "].prizenum"
            that.setData({
              [createTime]: formatTime(new Date),
              [status]: "1",
              [totalcost]: that.data.buylist[index].num * that.data.buylist[index].cost,
              [badge]: that.data.user.badge,
              [prizenum]: that.data.buylist[index].num
            })
          }
          ajax.post("/AddOrder", {
            orderlist: that.data.buylist
          }).then(res => {
            console.log(res)
            that.setData({
              oldlist: res
            })
          }).catch(err => {
            that.toast.showToast({
              toastType: "error",
              message: err
            })
          })

          that.setData({
            buylist: []
          })
          //跳转至订单界面
          wx.navigateTo({
            url: '../order/order',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  //计算总价
  Totalprice: function(arr) {
    for (var index = 0; index < arr.length; index++) {
      var list = arr
      list[index].cost = list[index].cost * list[index].num
    }
    return list;
  },
  // 删除方法
  remove: function(array, val) {
    var that = this;
    var j = array.length
    for (var i = j - 1; i >= 0; i--) {
      if (array[i].select == val) {
        that.setData({
          buylist: that.data.buylist.concat(array[i])
        })
        array.splice(i, 1);
      }
    }
    return array;
  }
})