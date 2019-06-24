//index.js
const app = getApp()
const collection = 'msg';

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isAuthrized: false,
    isLoading: false,
    avatarUrl: './user-unlogin.png',
    userName: '',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    isInput: false,
    inputContent: '',
    msgList: []
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    let that = this;
    this.setData({ isLoading: true });
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              that.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo,
                userName: res.userInfo.nickName,
                isAuthrized: true
              });
              that.getMessages();
              setInterval(()=>{
                that.getMessages(false);
              },8000);
            }
          })
        }
      },
      fail:function(){
        that.setData({ isLoading: false });
      }
    });
  },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      wx.getUserInfo({
        success: res => {
          this.setData({
            avatarUrl: res.userInfo.avatarUrl,
            userInfo: res.userInfo,
            userName: res.userInfo.nickName,
            isAuthrized: true
          });
          this.getMessages();
        }
      });
      console.log(this.data.canIUse);
    } else {
      //用户按了拒绝按钮
      console.log("User reject auth!");
      console.log(this.data.canIUse);
    }
  },
  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },
  
  handleToggleClick: function() {
    if(this.data.isInput){
      this.addMessage();
    }else{
      this.setData({
        isInput: true
      });
    }
  },
  handleInputChange: function(e) {
    this.setData({
      inputContent: e.detail.value
    })
  },
  addMessage: function() {
      const msg = this.data.inputContent;
      if(msg && msg.trim().length>0){
        this.setData({
          isLoading: true
        })
        const db = wx.cloud.database();
        let query = wx.createSelectorQuery();
        console.log(query.select(".input-field"));
        db.collection(collection).add({
          data: {
            detail: msg,
            avatarUrl: this.data.avatarUrl,
            userName: this.data.userName
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
      }
  },
  getMessages: function(setLoading = true) {
      if(setLoading){
        this.setData({ isLoading: true });
      }
      
      const db = wx.cloud.database();
      // 查询当前用户所有的 counters
      db.collection(collection).where({
        _openid: this.data.openid
      }).get({
        success: res => {
          this.setData({
            msgList: res.data.reverse(),
            isLoading: false
          })
          console.log('[数据库] [查询记录] 成功: ', res)
        },
        fail: err => {
          this.setData({
            isLoading: false
          })
          console.error('[数据库] [查询记录] 失败：', err)
        }
      })
  }
})
