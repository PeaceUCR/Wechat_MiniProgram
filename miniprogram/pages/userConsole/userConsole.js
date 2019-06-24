// pages/userConsole/userConsole.js
Page({

  data: {
    openid: ''
  },

  onLoad: function (options) {
    console.log(getApp().globalData);
    this.setData({
      openid: getApp().globalData.openid
    })
  }
})