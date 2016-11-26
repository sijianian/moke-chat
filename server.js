var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),//引入socket.io模块并绑定到服务器
    users = [];//保存所有在线用户的昵称
app.use('/', express.static(__dirname + '/www'));
server.listen(8080);
//socket部分
io.on('connection', function (socket) {
    //昵称设置
    socket.on('login', function (nickname) {
        if (users.indexOf(nickname) > -1) {
            socket.emit('nickExisted');
        }
        else {
            socket.userIndex = users.length - 1;
            socket.nickname = nickname;
            users.push(nickname);
            socket.emit('loginSuccess');
            io.sockets.emit('system', nickname, users.length, 'login');//向所有连接到服务器的客户端发送当前登录用户的昵称
        }
    });
    //断开连接的事件
    socket.on('disconnect', function () {
        users.splice(socket.userIndex, 1);
        socket.broadcast.emit('system', socket.nickname, users.length, 'logout');
    });
    //显示他人的信息
    socket.on('postMsg', function (msg, color) {
        socket.broadcast.emit('newMsg', socket.nickname, msg, color);
    });
    //接收用户发来的图片
    socket.on('img', function (imgData,color) {
        socket.broadcast.emit('newImg', socket.nickname, imgData,color);
    });
});
