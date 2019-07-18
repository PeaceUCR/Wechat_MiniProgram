// pages/blogPage/component/editable-view.js
Component({
  /**
   * Component properties
   */
  properties: {
    placeholder: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal) { } // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    },
    contentType: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal) { } // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    },
    isEditable:{
      type: Boolean
    },
    initValue: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal) {
        if (newVal) {
          if(this.data.contentType === "upload"){
            
            wx.showLoading({
              title: 'Loading...',
            });
            let that = this;
            let images = newVal.split(",");
            console.log(images);
            wx.cloud.getTempFileURL({
              fileList: images,
              success: res => {
                // get temp file URL
                console.log(res.fileList);
                const clouds = [];
                const urls =[];
                if (res.fileList && res.fileList.length>0){
                  res.fileList.forEach((item)=>{
                    clouds.push(item.fileID); 
                    urls.push(item.tempFileURL); 
                  });
                }
                that.setData({
                  images: clouds,
                  imageUrls: urls
                }, () => {
                  wx.hideLoading();
                });
              },
              fail: err => {
                // handle error
                console.log(err);
                wx.hideLoading();
                wx.showToast({
                  title: '加载失败！'
                })
              }
            });
          }else{
            this.setData({
              value: newVal
            });
          }
        }

       } // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    },

  },
  //组件的生命周期函数， 和page的不一样注意！
  //https://developers.weixin.qq.com/miniprogram/dev/reference/api/Component.html
  //通过生命周期传值没用，拿不到properties，只能通过watch
  attached: function(){
    //console.log(this.data);
  },

  /**
   * Component initial data
   */
  data: {
    isEdit: false,
    value: '',
    images:[],
    imageUrls: []
  },

  /**
   * Component methods
   */
  methods: {
    enableEditable: function (){
      this.setData({
        isEdit: true
      })
    },
    disableEditable: function () {
      this.setData({
        isEdit: false
      })
    },
    handleInputChange: function (e) {
      this.setData({
        value: e.detail.value
      })
    },
    // 上传图片
    doUpload: function () {
      const that = this;
      // 选择图片, count = 9 by default
      // 暂时一次只上传一张图片
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {

          wx.showLoading({
            title: '上传中',
          })

          const filePath = res.tempFilePaths[0];
          

          // 上传图片
          const cloudPath = Date.now() + filePath.match(/\.[^.]+?$/)[0]
          wx.cloud.uploadFile({
            cloudPath,
            filePath,
            success: res => {
              console.log('[上传文件] 成功：', res);

              console.log(res);
              wx.cloud.getTempFileURL({
                fileList: [res.fileID],
                success: res => {
                  // get temp file URL
                  console.log(res.fileList);
                  that.setData({
                    images:[...that.data.images, res.fileList[0].fileID],
                    imageUrls: [...that.data.imageUrls, res.fileList[0].tempFileURL]
                  }, () => {
                    wx.hideLoading();
                  });
                },
                fail: err => {
                  // handle error
                  console.log(err);
                  wx.hideLoading();
                }
              });
            },
            fail: e => {
              console.error('[上传文件] 失败：', e)
              wx.showToast({
                icon: 'none',
                title: '上传失败',
              })
            }
          })

        },
        fail: e => {
          console.error(e)
        }
      })
    },
    previewImg: function(e){
      wx.previewImage({
        current: this.data.imageUrls[e.target.dataset.index], // 当前显示图片的http链接
        urls: [this.data.imageUrls[e.target.dataset.index]] // 需要预览的图片http链接列表
      });
      wx.showToast({
        title: '再点一下退出啦',
        icon: 'none',
        duration: 1500,
        mask: true
      });
    }
  }
})
