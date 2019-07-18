// miniprogram/pages/blogsPage/blogsPage.js
const collection = 'blog';

const app = getApp();

let offset = 0;

const util = require('../util/util.js');

const pageNum = 10;
Page({
  /**
   * Page initial data
   */
  data: {
    blogsList: [],
    userInfo:{}
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.getBlogs();
    if (app.globalData.userInfo){
      this.setData({
        userInfo: app.globalData.userInfo
      });
    }
  },

  goTo:function(e) {
    console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: `../blogPage/blogPage?id=${e.currentTarget.dataset.id}&isEdit=false`,
    });
  } , 

  delete: function(e){
    console.log(e.target.dataset.id);
    wx.showLoading({
      title: '删除中...',
    });
    if (e.target.dataset.id){
      const db = wx.cloud.database();
      db.collection(collection).doc(e.target.dataset.id).remove({
        success: res => {
          this.getBlogs(false);
        },
        fail: err => {
          wx.showToast({
            title: '删除失败！',
            icon: 'none'
          });
        }
      });
    }
  },

  deleteFake : function(e){
    wx.showToast({
      title: '暂时禁止删除啦！',
      icon: 'none'
    })
  },

  edit: function(e){
    wx.redirectTo({
      url: `../blogPage/blogPage?id=${e.currentTarget.dataset.id}&isEdit=true`,
    });
  },

  getBlogs: function(showLoading = true, offset = 0){
    if (showLoading){
      wx.showLoading({
        title: 'Loading...',
      });
    }
    const db = wx.cloud.database();
    db.collection(collection).orderBy('date', 'desc').skip(offset).limit(pageNum).where({
    }).get({
      success: res => {
        if(offset !== 0){
          if(res.data && res.data.length>0){
            const newList = [...this.data.blogsList, ...res.data];
            this.setData({
              blogsList: util.formateBlogsList(newList),
            });
          }else{
            wx.showToast({
              title: '没有更多啦！',
              icon: 'none'
            })
          }
        }else{
          this.setData({
            blogsList: util.formateBlogsList(res.data),
          });
        }
        wx.hideLoading();
        wx.stopPullDownRefresh();
        console.log('[数据库] [查询记录] 成功: ', res);
      },
      fail: err => {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        console.error('[数据库] [查询记录] 失败：', err);
      }
    })
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
    this.getBlogs(true, 0);
  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {
    offset = offset + pageNum;
    this.getBlogs(true, offset);
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})