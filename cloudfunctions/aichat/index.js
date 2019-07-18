// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'dev-nv9fr'
});

const { TencentAI } = require('@khs1994/tencent-ai');

const APP = {
  // 设置请求数据（应用密钥、接口请求参数）
  appkey: 'OqxQwpn6vvg8BFmN',
  appid: '2118453554'
}

const ai = new TencentAI(APP.appkey, APP.appid);

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const sessionID = cloud.getWXContext().OPENID;
    const result = await ai.nlp.textChat(event.text, sessionID);
    return result;
  } catch (error) {
    return error;
  }
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}