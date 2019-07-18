// miniprogram/pages/leaveMessage/leaveMessage.js
const collection = 'msg';
const util = require('../util/util.js');
let offset = 0;
const pageNum = 6;
const app = getApp();

Page({

  /**
   * Page initial data
   */
  data: {
    userName: '',
    avatarUrl: '',
    isLoading: false, //loading spinner for msg
    isInput: false,
    inputContent: '',
    msgList: [],
    leaveMessage: true
  },
  handleToggleClick: function () {
    if (this.data.isInput) {
      this.addMessage();
    } else {
      this.setData({
        isInput: true
      });
    }
  },
  handleInputChange: function (e) {
    this.setData({
      inputContent: e.detail.value
    })
  },
  addMessage: function () {
    const msg = this.data.inputContent;
    if (msg && msg.trim().length > 0) {
      this.setData({
        isLoading: true
      })
      const db = wx.cloud.database();
      db.collection(collection).add({
        data: {
          detail: msg,
          avatarUrl: this.data.avatarUrl,
          userName: this.data.userName,
          date: new Date()
        },
        success: res => {
          // 在返回结果中会包含新创建的记录的 _id
          this.setData({
            inputContent: ''
          });
          this.getMessages();
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '新增记录失败'
          })
          this.setData({
            isLoading: false
          })
          console.error('[数据库] [新增记录] 失败：', err)
        }
      })
    } else {
      wx.showToast({
        title: '留言不能为空',
        icon: 'none',
        duration: 1000
      });
    }
  },
  getMessages: function (setLoading = true, offset = 0) {
    if (setLoading) {
      this.setData({ isLoading: true });
    }

    const db = wx.cloud.database();
    // 查询当前用户所有的 counters
    db.collection(collection).orderBy('date', 'desc').skip(offset).limit(pageNum).where({

    }).get({
      success: res => {
        const newMsgs = util.formateMsgList(res.data);
        if (offset > 0) {
          this.setData({
            msgList: [...this.data.msgList, ...newMsgs],
            isLoading: false
          });

          if (newMsgs.length === 0) {
            wx.showToast({
              title: "没有更多啦",
              icon: "none"
            })
          }
        } else {
          this.setData({
            msgList: newMsgs,
            isLoading: false
          })
        }
        wx.stopPullDownRefresh();
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        this.setData({
          isLoading: false
        });
        wx.stopPullDownRefresh();
        console.error('[数据库] [查询记录] 失败：', err)
      }
    });
  },
  loadMore() {
    offset = offset + pageNum;
    this.getMessages(true, offset);
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setData({
      userName: app.globalData.userInfo.nickName,
      avatarUrl: app.globalData.userInfo.avatarUrl,
      leaveMessage: app.globalData.configuration.leaveMessage
    });
    setTimeout(()=>{
      this.getMessages();
    }, 500);
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
    this.getMessages(true, 0);
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