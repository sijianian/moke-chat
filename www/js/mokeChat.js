// 页面加载
$(function () {
    var mokeChat = new MokeChat();
    mokeChat.init();
});
//定义MokeChat类
var MokeChat = function () {
    this.socket = null;
};
//向原型添加业务方法
MokeChat.prototype = {
    init: function () {//此方法初始化程序
        var that = this;
        var width = $(window).width();
        var height = $(window).height();
        this.socket = io.connect();
        this.socket.on('connect', function () {
            $('#info').text('请输入你的昵称');
            $('#nickWrapper').show("fast");
            $('#nicknameInput').focus();
        });
        //昵称设置的确定按钮
        $('#loginBtn').click(function () {
            var $nicknameInput = $('#nicknameInput'),
                nickName = $nicknameInput.val();
            if (nickName.trim().length == 0) {
                $nicknameInput.focus();
            } else {
                that.socket.emit('login', nickName);
            }
        });
        //显示昵称被占用的提示
        this.socket.on('nickExisted', function () {
            $('#info').text('昵称已经被占用，请输入其他的昵称');
        });
        //用户登录成功
        this.socket.on('loginSuccess', function () {
            $(document).attr('title', 'mokechat | ' + $('#nicknameInput').val());
            $('#loginWrapper').hide('fast');
            $('#inputMessage').focus();
        });
        /*输入框获得焦点*/
        $('#inputMessage').focus(function () {
            document.body.scrollTop =  document.body.scrollHeight;
            document.documentElement.scrollTop =  document.body.scrollHeight;
            window.pageYOffset =document.body.scrollHeight;
        });
        //系统提示信息
        this.socket.on('system', function (nickName, userCount, type) {
            var msg = nickName + (type == 'login' ? ' joined' : ' left');
            that.displayNewMsg('system', msg, '#009cff');
            $('#status').text(userCount + (userCount > 1 ? ' users' : ' user') + ' online').css({
                'color': '#515151'
            });
        });
        //点击发送按钮的
        $('#btnSend').click(function () {
            var $messageInput = $('#inputMessage'),
                msg = $messageInput.val(),
                color = $('#colorStyle').val();
            $messageInput.val('');
            //获取颜色值
            if (msg.trim().length != 0) {
                that.socket.emit('postMsg', msg, color);
                that.displayNewMsg('me', msg, color);
            }
        });
        this.socket.on('newMsg', function (user, msg, color) {
            that.displayNewMsg(user, msg, color);
        });

        this.socket.on('newImg', function (user, img, color) {
            that.displayImage(user, img, color);
        });
        //检查是否有文件被选中
        $('#sendImage').change(function () {
            var file = this.files[0],
                color = $('#colorStyle').val(),
                reader = new FileReader();
            if (!reader) {
                that.displayNewMsg('system', '你的浏览器支持file上传', 'red');
                this.val('');
                return;
            }
            reader.onload = function (e) {
                this.value = '';
                that.socket.emit('img', e.target.result, color);
                that.displayImage('me', e.target.result, color);
                e.stopPropagation();
            };
            reader.readAsDataURL(file);
        });
        //初始化表情
        this.initialEmoji();
        //表情被点击的时候
        $('#emoji').click(function (e) {
            var $emojiwrapper = $('#emojiWrapper');
            if ($emojiwrapper.css('display') == 'block') {
                $emojiwrapper.hide('fast');
            }
            else if ($emojiwrapper.css('display') == 'none') {
                $emojiwrapper.show('fast');
            }
            e.stopPropagation();
        });
        //more点击
        $('#btnMore').click(function (e) {
            var $items = $('.items');
            if ($items.css('display') == 'block') {
                $items.hide('fast');
            }
            else if ($items.css('display') == 'none') {
                $items.show('fast');
            }
            e.stopPropagation();
        });
        //页面其他地方点击时，表情块隐藏
        $(window).click(function (e) {
            var $emojiwrapper = $('#emojiWrapper');
            if (e.target != $emojiwrapper) {
                $emojiwrapper.hide('fast');
            }
        });
        //表情展示区被点击时
        $('#emojiWrapper').click(function (e) {
            var target = e.target;
            if (target.nodeName.toLowerCase() == 'img') {
                var $messageInput = $('#inputMessage');
                $messageInput.focus().val($messageInput.val() + '[emoji:' + target.title + ']');
            }
        });
        //昵称确认按键
        $('#nicknameInput').keyup(function (e) {
            if (e.keyCode == 13) {
                var nickName = $('#nicknameInput').val();
                if (nickName.trim().length != 0) {
                    that.socket.emit('login', nickName);
                }
            }
        });
        //消息发送按键
        $('#inputMessage').keyup(function (e) {
            var $messageInput = $('#inputMessage'),
                msg = $messageInput.val(),
                color = $('#colorStyle').val();
            if (e.keyCode == 13 && msg.trim().length != 0) {
                $messageInput.val('');
                that.socket.emit('postMsg', msg, color);
                that.displayNewMsg('me', msg, color);
            }
        });
        //消息清屏按键
        $('#clearBtn').click(function (e) {
            var $historyMsg = $('#historyMsg');
            $historyMsg.html('');
        });
        this.changeBgPic();
        setInterval(function () {
            var $bgPic = $('.bgPic'),
                r = Math.floor(Math.random() * 25) + 1;
            if (width > 414) {
                $bgPic.css({
                    'background': 'url("../images/bgPic' + r + '.jpg")',
                    'background-repeat': 'no-repeat',
                    'background-size': 'auto 1000px',
                    'background-position': 'center'
                });
            } else {
                $bgPic.css({
                    'background': '#ececec'
                })
            }
        }, 60000);
    },
    //改变背景图片
    changeBgPic: function () {
        var width = $(window).width();
        var $bgPic = $('.bgPic'),
            r = Math.floor(Math.random() * 25) + 1;
        if (width > 414) {
            $bgPic.css({
                'background': 'url("../images/bgPic' + r + '.jpg")',
                'background-repeat': 'no-repeat',
                'background-size': 'auto 1000px',
                'background-position': 'center'
            });
        } else {
            $bgPic.css({
                'background': '#ececec'
            })
        }

    },
    //显示新的消息
    displayNewMsg: function (user, msg, color) {
        var $containner = $('#historyMsg'),
            $msgToDisplay = $('<P></P>'),
            date = new Date().toTimeString().substr(0, 8);
        msg = this.showEmoji(msg);
        color = color || '#000';
        $msgToDisplay.css({
            'margin': '0.7rem auto',
            'color': color,
            'clear': 'both',
        });
        if (user == 'me') {
            $msgToDisplay.css({
                'float': 'right'
            }).html('<span class="msg-span-right">' + msg + '<span class="arrow-right"></span></span>' + user);
        }
        else if (user == 'system') {
            $msgToDisplay.css({
                'text-align': 'center',
                'background': 'none'
            }).html(user + '<span class="timespan">(' + date + '):</span>' + msg);
        }
        else {
            $msgToDisplay.css({
                'float': 'left',
            }).html(user + '<span class="msg-span-left">' + msg + '<span class="arrow-left"></span></span>' + '<span class="arrow-left"></span>');
        }
        $containner.append($msgToDisplay);
        $(document).scrollTop($(document).height());
    },
    //展示图片
    displayImage: function (user, imgData, color) {
        var $container = $('#historyMsg'),
            $msgToDisplay = $('<p></p>'),
            date = new Date().toTimeString().substr(0, 8);
        color = color || '#000';
        $msgToDisplay.css({
            'margin': '0.7rem',
            'text-align': 'center',
            'color': color,
            'clear': 'both',
        });
        if (user == 'me') {
            $msgToDisplay.css({
                'float': 'right'
            }).html('<br/>' + '<span class="msg-span-right"><a href="' + imgData + '" target="_blank"><img src="' + imgData + '"/></a><span class="arrow-right"></span></span>' + user);
        }
        else if (user == 'system') {
            $msgToDisplay.css({
                'text-align': 'center',
                'background': 'none'
            }).html(user + '<span class="timespan">(' + date + '): </span> <br/>' + '<a href="' + imgData + '" target="_blank"><img src="' + imgData + '"/></a>');
        }
        else {
            $msgToDisplay.css({
                'float': 'left'
            }).html('<br/>' + user + '<span class="msg-span-left"><a href="' + imgData + '" target="_blank"><img src="' + imgData + '"/></a><span class="arrow-left"></span></span>');
        }
        $container.append($msgToDisplay);
        $(document).scrollTop($(document).height());
    },
    //初始化表情
    initialEmoji: function () {
        var $emojiContainer = $('#emojiWrapper');
        for (var i = 69; i > 0; i--) {
            var $emojiTtem = $('<img>').attr({
                'src': '../images/emoji/' + i + '.gif',
                'title': i
            });
            $emojiContainer.append($emojiTtem);
        }
    },
    //展示表情
    showEmoji: function (msg) {
        var match, result = msg,
            reg = /\[emoji:\d+\]/g,
            emojiIndex,
            totalEmojiNum = document.getElementById('emojiWrapper').children.length;
        while (match = reg.exec(msg)) {
            emojiIndex = match[0].slice(7, -1);
            if (emojiIndex > totalEmojiNum) {
                result = result.replace(match[0], '[X]');
            } else {
                result = result.replace(match[0], '<img class="emoji" src="../images/emoji/' + emojiIndex + '.gif" />');
            }
        }
        return result;
    }
};
