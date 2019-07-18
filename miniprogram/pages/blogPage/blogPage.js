const collection = 'blog';
const app = getApp();
// pages/chooseLib/chooseLib.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      showOptions: false,
      editableComponentsList: [
        { type: "text", placeholder: "标题"},
        { type: "textarea", placeholder: "内容"},
        { type: "upload"}
      ],
      id: '',
      isEdit: false,
      userName: '',
      avatarUrl: '',
      date: ''
  },

  save: function(e){
  //https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/events.html
  //https://my.oschina.net/tianma3798/blog/2247088
    const list = this.selectAllComponents(".editable-view");
    const title = list[0].data.value;
    const body = list[1].data.value;
    for(let i=0; i<list.length; i++){
      if(this.data.editableComponentsList[i].type === "upload"){
        this.data.editableComponentsList[i].images = list[i].data.images;
      }else{
        this.data.editableComponentsList[i].value = list[i].data.value;
      }
    }

    if (title.trim().length > 0 && body.trim().length > 0) {
      wx.showLoading({
        title: '保存中',
      });
      const db = wx.cloud.database();

      const options = {
        data: {
          avatarUrl: app.globalData.userInfo.avatarUrl,
          userName: app.globalData.userInfo.nickName,
          date: new Date(),
          editableComponentsList: this.data.editableComponentsList
        },
        success: res => {
          // 在返回结果中会包含新创建的记录的 _id
          wx.hideLoading();
          wx.showModal({
            title: '保存成功！',
            confirmText: '确定',
            cancelText: '返回列表',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定');
              } else if (res.cancel) {
                wx.redirectTo({
                  url: '../blogsPage/blogsPage'
                });
              }
            }
          })
        },
        fail: err => {
          wx.hideLoading();
          wx.showToast({
            icon: 'none',
            title: '保存失败！'
          });
        }
      }
      if(this.data.id){
        db.collection(collection).doc(this.data.id).update(options)
      }else{
        db.collection(collection).add(options);
      }
    }else{
      wx.showToast({
        title: '标题和内容不能为空',
        icon: 'none',
        duration: 2000
      });
    }
  },

  delete: function(e){
      console.log(e.target.dataset.index);
      const newList = [...this.data.editableComponentsList];
    newList.splice(e.target.dataset.index, 1); 
      this.setData({
          editableComponentsList: newList
      });
  },

  toggleOptions: function (){
    this.setData({
      showOptions: !this.data.showOptions
    })
  },

  addTextContent: function (){
    this.setData({
      editableComponentsList: [...this.data.editableComponentsList,
        { type: "textarea", placeholder: "内容" }]
    });
  },

  addUploadContent: function () {
    this.setData({
      editableComponentsList: [...this.data.editableComponentsList,
      { type: "upload" }]
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if(options.isEdit === "true"){
      this.setData({
        isEdit: true
      });
    }
    if(options.id){
      wx.showLoading({
        title: 'Loading...',
      });
      const id = options.id;
      const db = wx.cloud.database();
      db.collection(collection).orderBy('date', 'desc').limit(1).where({
        _id: id
      }).get({
        success: res => {
          this.setData({
            editableComponentsList: res.data[0].editableComponentsList,
            id: options.id,
            userName: res.data[0].userName,
            date: res.data[0].date.toLocaleString("zh-CN"),
            avatarUrl: res.data[0].avatarUrl
          });
          console.log('[数据库] [查询记录] 成功: ', res);
          wx.hideLoading();
          console.log(this.data);
        },
        fail: err => {
          console.error('[数据库] [查询记录] 失败：', err);
          wx.hideLoading();
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})