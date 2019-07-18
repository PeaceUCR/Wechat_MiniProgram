// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”
//https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/login.html
const cloud = require('wx-server-sdk');
const request = require('request');
const appId = 'wxda1f6a54b87f0ad8';
const appSecret = '462ff7289c36f8c0e0be527067bf15df';
const collection = 'loginUser'

// 初始化 cloud
cloud.init();
const db = cloud.database();

const fetchSession = (code) => {
  return new Promise((resolve, reject)=>{
    request(`https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`, function (error, response, body) {

      if(error){
        reject(error);
      }
      resolve(JSON.parse(body));
    });
  });
}

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = async (event, context) => {
  try {
    const dbUser = await db.collection(collection).limit(1).get({
      openID: cloud.getWXContext().OPENID
    });
    // db doc exist?
    if (dbUser.data[0]){
      return dbUser.data[0];
    }else{
      const parsedBody = await fetchSession(event.code);
      return await db.collection(collection).add({
        data: {
          openID: parsedBody['openid'],
          sessionKey: parsedBody['session_key'],
          date: new Date()
        }
      });
    }
  } catch (e) {
    console.error(e)
  }
  // return new Promise((resolve, reject) => {
  //   const wxContext = cloud.getWXContext();
  //   const openid = wxContext.OPENID;
  //   db.collection(collection).where({

  //   }).get({
  //     success: res => {
  //       resolve(res.data);
  //     },
  //     fail: err => {
  //       reject(err);
  //     }
  //   });
    //api for request https://www.npmjs.com/package/request
    // request(`https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${event.code}&grant_type=authorization_code`, function (error, response, body) {

    //   console.log('statusCode:', response && response.statusCode);
    //   console.log('body:', body); 
    //   console.log('error:', error);
      
    //   const parsedBody = JSON.parse(body);
    //   
      // db.collection(collection).add({
      //   data: {
      //     openID: parsedBody['openid'],
      //     sessionKey: parsedBody['session_key'],
      //     date: new Date()
      //   },
      //   success: res => {
      //     resolve(res);
      //   },
      //   fail: err => {
      //     reject(err);
      //   }
      // });
    // });
  //});
  // 可执行其他自定义逻辑
  // console.log 的内容可以在云开发云函数调用日志查看

  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
  // const wxContext = cloud.getWXContext()

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}
