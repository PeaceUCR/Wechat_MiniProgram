// miniprogram/pages/aiPage/aiPage.js

const util = require('../util/util.js');

const fileSystemManager = wx.getFileSystemManager();

Page({
  /**
   * Page initial data
   */
  data: {
    array: ["看图说话", "图像标签", "物品识别", "场景识别","鉴黄"],
    index: '0',
    imageSrc: '',
    canvasPath: '',
    canvasWidth: 0,
    canvasHeight: 0,
    canvasImageSize: 0,
    originalTagList: [],
    result: '',
    showDetails: true
  },

  bindPickerChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  doUpload: function(e){
      const that = this;
      const screenWidth = wx.getSystemInfoSync().windowWidth;
      that.setData({
        imageSrc: '',
        originalTagList: [],
        result: '',
      });
      //const ctx = wx.createCanvasContext('aiCanvasId');
      // 选择图片, count = 9 by default
      // 暂时一次只上传一张图片
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          wx.showLoading({
            title: '处理中',
          });
          const filePath = res.tempFilePaths[0];

          that.setData({
            imageSrc: filePath,
            canvasImageSize: Math.floor(res.tempFiles[0].size / 1000)
          });

          if (Math.floor(res.tempFiles[0].size / 1000) > 1000) {
            wx.showToast({
              title: '图片大小大于1mb,识别失败！',
              icon: 'none',
              duration: 2000
            })
          }else{
            wx.getImageInfo({
              src: filePath,
              success(res) {
                if (screenWidth < res.width) {
                  that.setData({
                    canvasWidth: screenWidth,
                    canvasHeight: Math.ceil(screenWidth * res.height / res.width)
                  });
                } else {
                  that.setData({
                    canvasWidth: res.width,
                    canvasHeight: res.height
                  });
                }
                console.log(filePath);
                //https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.readFile.html
                fileSystemManager.readFile({
                  filePath: filePath,
                  success: res => {
                    //把arraybuffer转成base64
                    let base64 = wx.arrayBufferToBase64(res.data);

                    //打印出base64字符串，可复制到网页校验一下是否是你选择的原图片呢
                    //console.log(base64);
                    //console.log(typeof that.data.index);
                    wx.cloud.callFunction({
                      name: 'aiapi',
                      data: {
                        imageBase64String: base64,
                        type: that.data.index
                      },
                      success: res => {
                        console.log(res);
                        wx.hideLoading();
                        if (that.data.index == 0 && res.result.data && res.result.data.text) {
                          that.setData({
                            result: res.result.data.text
                          });
                        } else if (that.data.index == 1 && res.result.data && res.result.data.tag_list && res.result.data.tag_list.length > 0) {
                          const tagList = res.result.data.tag_list;
                          that.setData({
                            originalTagList: util.formateTagResult(tagList),
                          });
                        } else if (that.data.index == 2 && res.result.data && res.result.data.object_list && res.result.data.object_list.length > 0) {
                          const objectList = res.result.data.object_list;
                          that.setData({
                            originalTagList: util.formateObjectResult(objectList),
                          });
                        } else if (that.data.index == 3 && res.result.data && res.result.data.scene_list && res.result.data.scene_list.length > 0) {
                          const sceneList = res.result.data.scene_list;
                          that.setData({
                            originalTagList: util.formateSceneResult(sceneList),
                          });
                        } else if (that.data.index == 4 && res.result.data && res.result.data.tag_list && res.result.data.tag_list.length > 0) {
                          const tagList = res.result.data.tag_list;
                          that.setData({
                            originalTagList: tagList,
                            result: util.formatePornResult(tagList)
                          });

                        } else {
                          wx.showToast({
                            title: 'oh，出错啦，稍后再试',
                            icon: 'none'
                          });
                          that.setData({
                            result: ''
                          })
                        }

                      },
                      fail: err => {
                        wx.hideLoading();
                        wx.showToast({
                          title: '识别失败！',
                          icon: 'none'
                        });
                        console.error('[云函数] [sum] 调用失败：', err)
                      }
                    })
                  },
                  fail: error => {
                    wx.showToast({
                      title: '请求图片失败！',
                      icon: 'none'
                    })
                  }
                });
                // url invalid in device!
                // wx.request({
                //   url: filePath,
                //   responseType: 'arraybuffer', //最关键的参数，设置返回的数据格式为arraybuffer
                //   success: res => {
                //     //把arraybuffer转成base64
                //     let base64 = wx.arrayBufferToBase64(res.data);

                //     //打印出base64字符串，可复制到网页校验一下是否是你选择的原图片呢
                //     //console.log(base64);
                //     //console.log(typeof that.data.index);
                //     wx.cloud.callFunction({
                //       name: 'aiapi',
                //       data: {
                //         imageBase64String: base64,
                //         type: that.data.index
                //       },
                //       success: res => {
                //         console.log(res);
                //         wx.hideLoading();
                //         if (that.data.index == 0 && res.result.data && res.result.data.text) {
                //           that.setData({
                //             result: res.result.data.text
                //           });
                //         } else if (that.data.index == 1 && res.result.data && res.result.data.tag_list && res.result.data.tag_list.length > 0) {
                //           const tagList = res.result.data.tag_list;
                //           that.setData({
                //             originalTagList: util.formateTagResult(tagList),
                //           });
                //         } else if (that.data.index == 2 && res.result.data && res.result.data.object_list && res.result.data.object_list.length > 0) {
                //           const objectList = res.result.data.object_list;
                //           that.setData({
                //             originalTagList: util.formateObjectResult(objectList),
                //           });
                //         } else if (that.data.index == 3 && res.result.data && res.result.data.scene_list && res.result.data.scene_list.length > 0) {
                //           const sceneList = res.result.data.scene_list;
                //           that.setData({
                //             originalTagList: util.formateSceneResult(sceneList),
                //           });
                //         } else if (that.data.index == 4 && res.result.data && res.result.data.tag_list && res.result.data.tag_list.length > 0) {
                //           const tagList = res.result.data.tag_list;
                //           that.setData({
                //             originalTagList: tagList,
                //             result: util.formatePornResult(tagList)
                //           });

                //         } else {
                //           wx.showToast({
                //             title: 'oh，出错啦，稍后再试',
                //             icon: 'none'
                //           });
                //           that.setData({
                //             result: ''
                //           })
                //         }

                //       },
                //       fail: err => {
                //         wx.hideLoading();
                //         wx.showToast({
                //           title: '识别失败！',
                //           icon: 'none'
                //         });
                //         console.error('[云函数] [sum] 调用失败：', err)
                //       }
                //     })
                //   },
                //   fail: error => {
                //     wx.showToast({
                //       title: '请求图片失败！',
                //       icon: 'none'
                //     })
                //   }
                // });

                //ctx.drawImage(filePath, 0, 0, that.data.canvasWidth, that.data.canvasHeight);

                // ctx.draw(true, () => {
                //   wx.canvasToTempFilePath({
                //     canvasId: 'aiCanvasId',
                //     success: function success(res) {
                //       console.log(res.tempFilePath);
                //       that.setData({
                //         canvasPath: res.tempFilePath
                //       });

                //     }, fail: function (e) {
                //       console.log(e);
                //     }
                //   });
                // });
              }
            });
          }
          //https://blog.csdn.net/qq_36875339/article/details/81086205
          

        },
        fail: e => {
          console.error(e)
        }
      })
  },

  previewImg: function(e){
    wx.previewImage({
      current: e.target.dataset.src, // 当前显示图片的http链接
      urls: [this.data.imageSrc] // 需要预览的图片http链接列表
    });
  },

  showModal: function (e) {
    wx.showModal({
      title: '关于图片识别',
      content: '看图说话：用一句话描述图片内容。图片识别对图片大小有限制，容易失败，请稍后再试，谢啦！',
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