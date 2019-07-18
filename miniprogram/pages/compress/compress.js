// miniprogram/pages/compress/compress.js
Page({

  /**
   * Page initial data
   */
  data: {
    originalPath: '',
    originalWidth: 0,
    originalHeight: 0,
    originalSize: 0,
    canvasPath: '',
    canvasWidth: 0,
    canvasHeight: 0,
    canvasSize: 0
  },

  doCompress: function(){
    const that = this;
    const screenWidth = wx.getSystemInfoSync().windowWidth;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        const filePath = res.tempFilePaths[0];


        wx.getFileInfo({
          filePath: filePath,
          success(res){
            //console.log('file info');
            that.setData({
              originalSize: Math.ceil(res.size / 1000)
            });
          }
        });
        const ctx = wx.createCanvasContext('canvasId');

        wx.getImageInfo({
          src: filePath,
          success(res) {
            that.setData({
              originalWidth: res.width,
              originalHeight: res.height,
              originalPath: filePath
            });
            //console.log(res);

            if (res.width > screenWidth){
              let height = Math.ceil(screenWidth * res.height / res.width);
              that.setData({
                canvasWidth: screenWidth,
                canvasHeight: height
              });
              ctx.drawImage(filePath, 0, 0, screenWidth, height);
            }else{
              that.setData({
                canvasWidth: res.width,
                canvasHeight: res.height
              });
              ctx.drawImage(filePath, 0, 0, res.width, res.height);
            }


            ctx.draw(true, () => {

              wx.canvasToTempFilePath({
                canvasId: 'canvasId',
                success: function success(res) {
                  //console.log(res.tempFilePath);
                  that.setData({
                    canvasPath: res.tempFilePath
                  });
                  wx.getFileInfo({
                    filePath: res.tempFilePath,
                    success(res) {
                      //console.log('file info');
                      that.setData({
                        canvasSize: Math.ceil(res.size / 1000)
                      });
                    }
                  });
                }, fail: function (e) {
                  console.log(e);
                }
            });

            })
        }
        });
      }
    })
  },

  previewImg: (e)=>{
    wx.previewImage({
      current: e.target.dataset.src, // 当前显示图片的http链接
      urls: [e.target.dataset.src] // 需要预览的图片http链接列表
    });
  },

  download:function(){
    if(this.data.canvasPath){
      console.log(this.data.canvasPath);
      wx.saveImageToPhotosAlbum({
        filePath: this.data.canvasPath,
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
    }
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