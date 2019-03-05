const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}

const ajax = {
  //get方法：用来获取数据
  get: function(url, data) {
    return request('GET', url, data);
  },
  //post方法：用来更新数据
  post: function(url, data) {
    return request('POST', url, data);
  },
  //put方法
  put: function(url, data) {
    return request('PUT', url, data);
  },
  //delete方法
  delete: function(url, data) {
    return request('DELETE', url, data);
  }
}

function request(method, url, data) {
  //返回一个promise实例
  return new Promise((resolve, reject) => {
    let str;
    if (url.indexOf("https://127.0.0.1/exchange-0.0.1") > -1) { //https://mlg.proya.com/exchange-0.0.1
      str = url
    } else {
      str = "https://mlg.proya.com/exchange-0.0.1" + url
    }
    wx.request({
      url: str,
      method: method,
      data: data,
      header: {
        //Authorization: "Bearer " + wx.getStorageSync("token") || ""
        //'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        if (res.statusCode == 401 || res.statusCode == 403) {
          var pages = getCurrentPages() //获取加载的页面
          var currentPage = pages[pages.length - 1] //获取当前页面的对象
          setTimeout(() => {
            if (currentPage.route.indexOf('consumerPages') != -1) {
              wx.reLaunch({
                url: "../user_login/login",
              })
            } else {
              wx.reLaunch({
                url: "../user_login/login",
              })
            }
          }, 2500)
          reject("登录信息过期，请重新登录");
        }
        if (res.statusCode != 200 && res.statusCode != 201) {
          if (res.statusCode == 500) {
            reject("服务器异常");
          } else {
            reject(res.data);
          }
        } else {
          resolve(res.data)
        }
      },
      fail: function(res) {
        reject(res);
      },
      complete: function() {}
    })
  })
}

module.exports = {
  formatTime: formatTime,
  ajax: ajax
}