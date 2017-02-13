## moke聊天室

## 项目说明：

- 基于socket协议开发的在线多聊天室
- 使用技术：**node.js、javascript、jq**

## 使用方法：
~~~
npm install
node server.js
~~~
浏览器输入localhost:8080即可看到效果

## 项目结构
    ├─.README.md
    ├─.gitnore
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