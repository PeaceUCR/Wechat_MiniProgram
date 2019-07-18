// 云函数入口文件
const cloud = require('wx-server-sdk');
const fs = require('fs');
const request = require('request');
const imageThumbnail = require('image-thumbnail');
const path = require('path');

const download = function (uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

cloud.init();



// 云函数入口函数
exports.main = async (event, context) => {
  //https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/functions/async.html
  return new Promise((resolve, reject) => {
    download('https://6465-dev-nv9fr-1259489329.tcb.qcloud.la/1562555562973.jpg', path.resolve(__dirname) + '/test.jpg', function () {
      resolve('done');
    });
  })
}