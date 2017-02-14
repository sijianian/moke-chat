## moke聊天室

## 项目说明

- 基于socket协议开发的在线多聊天室
- 使用技术：**node.js、javascript、jq**

## 开发


## 使用方法
~~~
$ git clone git@github.com:sijianian/moke-chat.git
$ npm install
$ gulp build
$ node server.js
~~~
浏览器输入http://localhost:8080，即可浏览

## 项目结构
    ├─README.md
    ├─.gitnore
    ├─gulpfile.js       # gulp 配置
    ├─package.json      # 项目引用的包相关
    ├─server.js         # node后端服务
    └─www               # 项目前端
        │  index.html
        ├─css
        │      main.css
        ├─images
        │  ├─emoji
        │  └─icon        
        └─js
          ├─jquery-1.4.2.min.js
          └─mokeChat.js