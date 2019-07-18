// miniprogram/pages/aiChat/aiChat.js
Page({

  /**
   * Page initial data
   */
  data: {
    inputValue: '',
    messages: []
  },
  handleInputChange: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  send: function(e){
    const text = this.data.inputValue.trim();
    const that = this;
    if(text){
      wx.showLoading({
        title: 'loading...',
      });
      that.setData({
        messages: [...that.data.messages, {text: text, sender:'user'}]
      });
      that.scrollToBottom();
      wx.cloud.callFunction({
        name: 'aichat',
        data: {
          text: text
        },
        success: res => {
          console.log(res);
          wx.hideLoading();
          if (res.result && res.result.data && res.result.data.answer){
            that.setData({
              inputValue: '',
              messages: [...that.data.messages, { text: res.result.data.answer , sender: 'robot'}]
            });
          }else{
            wx.showToast({
              title: '出错啦！',
              icon: 'none'
            });
          }
          that.scrollToBottom();
          
        },
        fail: error => {
          wx.showToast({
            title: '出错啦！',
            icon: 'none'
          });
          wx.hideLoading();
        }});
    }else{
      wx.showToast({
        title: '输入不能为空！',
        icon: 'none'
      });
    }
  },

  scrollToBottom: function(){
    wx.createSelectorQuery().select('#ai-chat-page').boundingClientRect(function (rect) {
      // 使页面滚动到底部
      wx.pageScrollTo({
        scrollTop: rect.bottom
      })
    }).exec()
  },

  showModal: function (e) {
    wx.showModal({
      title: '关于聊天服务',
      content: '闲聊服务基于AI Lab领先的NLP引擎能力、数据运算能力和千亿级互联网语料数据的支持。偶尔会处理失败，麻烦重试，暂时不存储历史聊天信息。',
      showCancel: false,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    })

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