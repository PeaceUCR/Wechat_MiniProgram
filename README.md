# 云开发 quickstart

这是云开发的快速启动指引，其中演示了如何上手使用云开发的三大基础能力：

- 数据库：一个既可在小程序前端操作，也能在云函数中读写的 JSON 文档型数据库
- 文件存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理
- 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写业务逻辑代码

## 参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)



---------------------My ReadMe---------------------------------------
the miniprogram including several pages, details can be found at app.json

pages folder:


addFunction: example for call the cloud addFunction

aiChat: page for chat with robot

aiPage: page for image reconginze

compress: page for convert image to drawing in canvas

databaseGuide: example for manupulating(CRUD) the db from front-end

deployFunction: tips for deploy cloud function

index: homepage

leaveMessage: 留言

login: try login get unique session, but no use for personal app

openapi:关于模版消息https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/template-message/templateMessage.addTemplate.html

qrcode: 二维码page

storageConsole: 文件相关

useConsole; openid related

util: for formate databaseGuide

总结:小程序开发

前端页面对应的是wxml, 对应的是html，tag的名字都变了
wxss, 对应的是css,大部分都一样，少数用不了
json,配置一些自定义控件和行为（下拉刷新），比如 blogPage.json，index.json
js, 主要里面一上来就是page对象以及其对应的生命周期，在里面添加各种event handler

小程序还自带各种loading，popup,以及独立的ajax call 方法


