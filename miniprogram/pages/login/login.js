// miniprogram/pages/login/login.js
Page({

  /**
   * Page initial data
   */
  data: {

  },
  wechatLogin: function() {
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          wx.cloud.callFunction({
            name: 'login',
            data: {
              code: res.code
            },
            success: res => {
              console.log(res.result);
            
            },
            fail: err => {
              wx.showToast({
                icon: 'none',
                title: '调用失败',
              })
              console.error('[云函数] [sum] 调用失败：', err)
            }
          });
        
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },

  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})