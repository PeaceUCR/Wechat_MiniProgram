// miniprogram/pages/qrcode/qrcode.js
const drawQrcode = require('../../weapp.qrcode.min.js');
Page({

  /**
   * Page initial data
   */
  data: {
    scanResult: '',
    inputValue: '',
    showDownload: false,
    canvasPath: ''
  },

  scanCode() {
    let that = this;
    wx.scanCode({
      success(res) {
        that.setData({
          scanResult:res.result
          });
        wx.showToast({
          title: '扫码成功！',
          icon: 'success',
          duration: 2000
        });

      }
    })
  },

  copy(){
    const text = this.data.scanResult;
    wx.setClipboardData({
      data: text,
      success(res) {
        wx.getClipboardData({
          success(res) {
            wx.showToast({
              title: '已复制到剪贴板！',
              icon: 'success',
              duration: 2000
            });
          }
        })
      }
    })
  },

  drawCode(e) {
    const text = this.data.inputValue;
    const that = this;
    drawQrcode({
      width: 200,
      height: 200,
      canvasId: 'qrcode',
      // ctx: wx.createCanvasContext('myQrcode'),
      text: text,
      // v1.0.0+版本支持在二维码上绘制图片
      image: {
        imageResource: '../../peace.jpeg',
        dx: 70,
        dy: 70,
        dWidth: 60,
        dHeight: 60
      }
    });

    wx.canvasToTempFilePath({
      canvasId: 'qrcode',
      success: function success(res) {
        that.setData({
          canvasPath: res.tempFilePath
        });

      }, fail: function (e) {
        console.log(e);
      }
    });
    this.setData({
      showDownload: true
    });
  },

  preview(){
      wx.previewImage({
        current: this.data.canvasPath, // 当前显示图片的http链接
        urls: [this.data.canvasPath] // 需要预览的图片http链接列表
      });

  },

  download() {
    const that = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.writePhotosAlbum']) {
          that.save();
        } else {
          wx.showToast({
            title: '请打开保存到相册功能！不然保存不了',
            icon: 'none',
            duration: 2000
          }),
          wx.openSetting({
            success(res) {
              console.log(res.authSetting);
              if (res.authSetting['scope.writePhotosAlbum']){
                wx.showToast({
                  title: '保存到相册功能已打开，可以点保存啦！',
                  icon: 'none',
                  duration: 2000
                });
              }

            }
          })
        }
      },
      fail: function () {
        wx.hideLoading();
      }
    });

    
  },
  save(){
    wx.canvasToTempFilePath({
      canvasId: 'qrcode',
      success: function success(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '已保存到相册！',
              icon: 'success',
              duration: 2000
            });
          },
          fail(err) {
            console.log(err);
          }
        });
      }, fail: function (e) {
        console.log(e);
      }
    });
  },
  handleInputChange: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  showModal: function (e) {
    wx.showModal({
      title: '帮助',
      content: '二维码有时候下载不了是因为没有写用户相册的权限😂',
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