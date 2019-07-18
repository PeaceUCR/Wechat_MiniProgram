/*
// pages/chooseLib/chooseLib.js
Page({

//页面的初始数据
data: {

},

//生命周期函数--监听页面加载

onLoad: function (options) {

},

//生命周期函数--监听页面初次渲染完成

onReady: function () {

},

// 生命周期函数--监听页面显示

onShow: function () {

},

//生命周期函数--监听页面隐藏

onHide: function () {

},


 // 生命周期函数--监听页面卸载

onUnload: function () {

},

//页面相关事件处理函数--监听用户下拉动作

onPullDownRefresh: function () {

},

//页面上拉触底事件的处理函数
 
onReachBottom: function () {

},

 //用户点击右上角分享

onShareAppMessage: function () {

}
})
*/
//index.js
const app = getApp();


let polling;

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isAuthrized: false,
    avatarUrl: './user-unlogin.png',
    userName: '',
    userInfo: {},
    showIcons: false,
    showTrialIcons: false,
    greetings: '',
    title: '',
    showFooter: false
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }



    const that = this;  

    wx.cloud.database().collection('configuration').doc('bc51dbcc-ac6f-4517-9086-73b6c188b26c').get().then(res => {
      that.setData({
        showIcons: res.data.showIcons,
        showTrialIcons: res.data.showTrialIcons,
        greetings: res.data.greetings.split(''),
        showFooter: res.data.showFooter
      });
      wx.setNavigationBarTitle({
        title: res.data.title
      });
      app.globalData.configuration = res.data;
      wx.hideLoading();
    });

    wx.showLoading({
      title: '加载中...',
      mask: true
    });

    // check cache
    try {
      let userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        console.log(userInfo);
        that.setData({
          avatarUrl: userInfo.avatarUrl,
          userInfo: userInfo,
          userName: userInfo.nickName,
          isAuthrized: true
        });
        app.globalData.userInfo = userInfo;

      }else{
        
      }

    } catch (e) {
      // Do something when catch error
    }
    // 查看是否授权
    // wx.getSetting({
    //   success: function (res) {
    //     if (res.authSetting['scope.userInfo']) {
    //       wx.getUserInfo({
    //         success: res => {
    //           //console.log(res.userInfo);
    //           that.setData({
    //             avatarUrl: res.userInfo.avatarUrl,
    //             userInfo: res.userInfo,
    //             userName: res.userInfo.nickName,
    //             isAuthrized: true
    //           });
    //           app.globalData.userInfo = res.userInfo;

    //           wx.hideLoading();
    //           that.getMessages();
    //           // //prevent auto refresh
    //           // polling = setInterval(()=>{
    //           //   that.getMessages(false);
    //           // },8000);
    //         },
    //         fail: () => {
    //           wx.hideLoading();
    //         }
    //       });
    //     }else {
    //       setTimeout(() => {
    //         wx.hideLoading();
    //       }, 500);
    //     }
    //   },
    //   fail:function(){
    //     setTimeout(() => {
    //       wx.hideLoading();
    //     }, 500);
    //   }
    // });
  },
  onHide: function () {
    if (polling){
      clearInterval(polling);
    }
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
          app.globalData.userInfo = res.userInfo;
          wx.setStorage({
            key: "userInfo",
            data: res.userInfo
          });
          //this.getMessages();
          // polling = setInterval(() => {
          //   this.getMessages(false);
          // }, 8000);
        }
      });
      //console.log(this.data.canIUse);
    } else {
      //用户按了拒绝按钮
      console.log("User reject auth!");
      //console.log(this.data.canIUse);
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
          mask: true
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res);
            
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
  showModal: function(e) {
    wx.showModal({
      title: '帮助',
      content: '这是由peace开发的个人小程序，如果发现bug请麻烦留言，谢啦！',
      showCancel: false,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    })

  }
})
