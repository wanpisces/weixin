var urlParams = _GetUrlParams();
var code = urlParams.code || false;
if (code) {
    localStorage.setItem('code', code);
    window.location.search = ''
} else {
    code = localStorage.getItem('code') || 0;
}

function _GetUrlParams() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = {};
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
window.onload = function() {

    var waike = document.getElementById('waike');
    var danmu = document.getElementById('danmu');
    //var code = "";
    var openid = "";
    var mac = ""; //唯一识别的mac
    var appId = "";
    var activeId = "14635563";
    var aReardId = [];
    var serialId = "";
    var _msg = "";
    var serverUrl = "http://servicebeta15.handsight.cn";
    // var serverUrl = "http://192.168.10.14:1235";
    // var arr = ['感谢++送来的一个血瓶', '恭喜刘木木获得一等奖', '恭喜王某某获得一等奖', '恭喜-德玛-获得一等奖'];
    var q = 0;

    var oUl = document.getElementById('suduWrap');
    var oLi = oUl.getElementsByClassName('reward');
    var startBtn = document.getElementById('startBtn');
    var speed = 1500, //转动开始速度
        index = 2, //开始位置
        cricle = 0, //转动多少圈开始抽奖
        times = 7, //转动10圈开始抽奖
        timer = null,
        position = 0,
        mark = true,
        borderStyle = ".05333rem solid #fff799", //border样式
        borderShadow = "0px 0px 10px #fff799";

    // //获取Url中的所有参数


    var length = oLi.length;
    var popup = document.getElementById('popup');
    // var popBtn = popup.getElementsByTagName("button")[0];
    var text = popup.getElementsByClassName("text")[0];
    var checkReward = document.getElementById("checkReward");
    var submitInfo = document.getElementById("submitInfo");
    var prompt = document.getElementById("prompt");
    var rewardImg = reward.data.rewards;
    for (var i = 0; i < length; i++) {
        oUl.getElementsByClassName("index" + (i + 1))[0].getElementsByClassName("img-container")[0].innerHTML = "<img src=" + rewardImg[i].rewardImg + ">";
    }

    appId = getAppIdFromCache();
    if (appId && appId.length > 1) {
        //如果已经有appId 直接请求 活动详情.
        getActiveInfo(appId, activeId);
        getRewardedInfo(appId, activeId);
        checkReward.onclick = function() {
            getrewardList(appId);
        };
    } else {
        // 没有缓存的appId 那么新申请一个appId
        randomMac();
    }

    // 生成随机mac唯一标识
    function randomMac() {
        var mac = localStorage.getItem('mac')
        if (!mac) {
            var timestamp = new Date().getTime();
            var random = "";
            for (var i = 0; i < 4; i++) {
                random += Math.round(Math.random() * 9);
            }
            var mac = "hs" + timestamp + random;
            localStorage.setItem('mac', mac);
        }
        getAppId(mac);
    }

    //获取appID 当code值为0时直接去请求展示详情
    function getAppId(mac) {
        var codeLength = code.length;
        var tempAppId = localStorage.getItem('tempAppId');
        // var newAppId = localStorage.getItem('appId');
        if (tempAppId && code !== 0 && codeLength == 32) {
            getUserInfo(appId, code);
        } else if (code !== 0 && codeLength == 32) {
            var appidUrl = serverUrl + "/user/appid?mac=" + mac;
            _ajax("GET", appidUrl, function(response) {
                if (response.success) {
                    var json = response.data;
                    var data = JSON.parse(json);
                    appId = data.data;
                    localStorage.setItem('tempAppId', appId);
                    getUserInfo(appId, code);
                } else {
                    popUp("<div class = 'timesPopup'><div>请求超时，请检查网络</div><div class = 'rewardBtn'>确定</div></div>");
                }
            });
        } else if (!appId) {
            window.location.href = "http://weixin.handsight.cn";
            // popUp("<p>没有授权，请重新登陆授权!</p><div class = 'aLogin'><a href = 'http://weixin.handsight.cn'>点击这里</a>参加活动</div>");
        }

    }

    function getAppIdFromCache() {
        return localStorage.getItem('appId') || '';
    }
    //获取用户信息
    function getUserInfo(appId, code) {
        var userUrl = serverUrl + "/thirdparty/user/getUserInfo?appId=" + appId + "&code=" + code + "&typeName=wx";
        _ajax("GET", userUrl, function(response) {
            if (response.success) {
                var json = JSON.parse(response.data);
                appId = JSON.parse(json.data).appId;
                localStorage.setItem('appId', appId);
                getActiveInfo(appId, activeId);
                getRewardedInfo(appId, activeId);
                checkReward.onclick = function() {
                    getrewardList(appId);
                };
            }
        });
    }

    //获取活动基本信息
    function getActiveInfo(appId, activeId) {
        var activeUrl = serverUrl + "/active/get_active?appId=" + appId + "&activeId=" + activeId;
        _ajax("GET", activeUrl, function(response) {
            if (response.success) {
                var data = JSON.parse(response.data);
                var rewards = data.data.rewards;
                var content = JSON.parse(data.data.content)[0].content;
                var deContent = decodeURIComponent(content);
                // deContent = deContent.substring(3,deContent.length-4);
                rewardDraw(rewards);
                drawCount(appId, activeId);
                document.getElementById("rule").onclick = function() {
                    // popBtn.style.display = "none";
                    popUp("<div class = 'activePopup'><div class = 'contentDiv'>" + deContent+"</div><div class = 'rewardBtn'>确定</div></div>");
                }
            } else {
                popUp("<div class = 'timesPopup'><div>请求超时，请检查网络</div><div class = 'rewardBtn'>确定</div></div>");
            }

        });
    }
    //获取已中奖人信息
    function getRewardedInfo(appId, activeId) {
        var rewardUrl = serverUrl + "/activity/drawResultList?appId=" + appId + "&activeId=" + activeId + "&type=0";
        _ajax("GET", rewardUrl, function(response) {
            if (response.success) {
                document.getElementById('shade').style.display = 'none';
                var arr = JSON.parse(response.data).data;
                var data = [];
                var json = JSON.parse(arr);
                if (json.length != 0) {
                    _Danmu(json, danmu);
                    waike.setAttribute('style', 'height:' + danmu.offsetHeight + 'px;position:relative;');
                    danmu.className = 'marquee';
                } else {
                    var oLi = document.createElement("p");
                    oLi.innerHTML = '还没有人中奖哦！！';
                    ele.appendChild(oLi);
                    _Danmu(json, danmu);
                    waike.setAttribute('style', 'height:' + danmu.offsetHeight + 'px;position:relative;');
                    danmu.className = 'marquee';
                }
            } else {
                popUp("<div class = 'timesPopup'><div>请求超时，请检查网络</div><div class = 'rewardBtn'>确定</div></div>");
                return false;
            }
        });
    }

    /*跑马灯*/
    function _Danmu(data, ele) {
        for (var i = 0; i < data.length; i++) {
            var oLi = document.createElement("p");
            oLi.className = 'oLi';
            oLi.innerHTML = '<span>恭喜*' + data[i].nickName + '*获得' + data[i].rewardsName + '</span><span style="float:right;">' + data[i].createTime + '</span>';
            ele.appendChild(oLi);
        }
    }

    //奖品图片布局
    function rewardDraw(rewards) {
        var rewardImg = reward.data.rewards;
        for (var i = 0; i < 7; i++) {
            oUl.getElementsByClassName("index" + (i + 1))[0].getElementsByClassName("img-container")[0].innerHTML = "<img src=" + rewardImg[i].rewardImg + ">";
        }
        for (var j = 0; j < 7; j++) {
            aReardId.push(rewards[j].rewardId);
        }
    }

    //查询当天次数
    function drawCount(appId, activeId) {
        var drawCountUrl = serverUrl + "/activity/drawCount/get?appId=" + appId + "&activeId=" + activeId;
        _ajax("GET", drawCountUrl, function(response) {
            if (response.success) {
                var count = JSON.parse(response.data).data;
                var timess = startBtn.getElementsByClassName("times")[0];
                timess.innerText = "剩余" + count + "次";
                startBtn.onmousedown = function() { this.style.backgroundColor = "#c0975a"; };
                startBtn.onmouseup = function() { this.style.backgroundColor = "#d8ab67"; };
                if (count == null) {
                    timess.innerText = "剩余0次";
                }
                startBtn.onclick = function() {
                    if (count == null) {
                        popUp("<div class = 'timesPopup'><div>对不起，活动还没有开展</div><div class = 'rewardBtn'>确定</div></div></div>");
                    }
                    if (mark) {
                        for (var i = 0; i < 8; i++) {
                            oLi[i].style.border = ".05333rem solid #4b140d";
                            oLi[i].style.boxShadow = "";
                        }
                        oUl.getElementsByClassName("index1")[0].style.border = borderStyle;
                        oUl.getElementsByClassName("index1")[0].style.boxShadow = borderShadow;
                        if (count > 0) {
                            // drawCount(appId, activeId);
                            timer = null;
                            getReword(appId, activeId);

                        } else if (count == 0) {
                            drawCount(appId, activeId);
                            var timesHtml = "<div class = 'timesPopup'><img src = './WeDay_files/times.png'/> <div>很抱歉，你今天的次数已经用完</div> <div class = 'rewardBtn'>确定</div></div>"
                            popUp(timesHtml);
                        }
                    }
                };
            } else {
                popUp("<div class = 'timesPopup'><div>请求超时，请检查网络</div><div class = 'rewardBtn'>确定</div></div>");
                return false;
            }
        });
    }

    //获取已中奖用户信息
    function barrage(arr) {
        var danmu = document.getElementById('danmu');
        danmu.className = 'marquee';
        if (q < arr.length) {
            danmu.innerHTML = arr[q];
            var wid = danmu.offsetWidth;
            danmu.style.marginLeft = -wid / 2 + 'px';
            q++;
            setTimeout(function() {
                barrage(arr);
            }, 3000);
        } else if (q == arr.length) {
            q = 0;
            barrage(arr);
        }
    }


    window.aReardId = aReardId;
    //获得奖项
    function getReword(appId, activeId) {
        prizeDraw(appId, activeId, function(rewardId, msg) {
            for (var i = 0, length1 = aReardId.length; i < length1; i++) {
                if (rewardId == aReardId[i]) {
                    position = i + 1;
                    borderMove(position, 2);
                    // setTimeout(function() {
                        _msg = "<div class = 'rewardPopup'><img src = './WeDay_files/popUp.png'/><div>" + msg + "</div><div><img class = 'codeImg' src = './WeDay_files/code.png'/></div><div>长按二维码进入公众号，<br/>输入手机号或QQ号领取奖品</div><div class = 'rewardBtn'>确定</div></div>";
                        // popUp(msg);
                    // }, 16500);
                } else if (rewardId == "-1") {
                    borderMove(8, 2);
                    // setTimeout(function() {
                        _msg = "<div class = 'rewardPopup'><img class = 'codeImg_sorry' src = './WeDay_files/sorry.png'/><div>很抱歉，没有抽到奖品，<br/>明日再来一战吧</div><div><img class = 'codeImg' src = './WeDay_files/code.png'/></div><div>长按二维码进入公众号，<br/>查看更多精彩内容</div><div class = 'rewardBtn'>确定</div></div>";
                        // popUp(sorryHtml);
                        // drawCount(appId, activeId);
                    // }, 16500);
                    break;
                }
            }
        });
    };


    //拉取已中奖列表
    function getrewardList(appId) {
        var type = "1";
        var prizeInfo = document.getElementById("prizeInfo");
        var prizeUl = prizeInfo.getElementsByTagName("ul")[0];
        var prizeBtn = document.getElementById("prizeBtn");
        var prizeHtml = "";
        var checkRewardUrl = serverUrl + "/activity/drawResultList?type=" + type + "&appId=" + appId + "&activeId=" + activeId;
        _ajax("GET", checkRewardUrl, function(response) {
            if (JSON.parse(response.data).success) {
                var arr = JSON.parse(response.data).data;
                var json = JSON.parse(arr);
                for (var i = json.length - 1; i >= 0; i--) {
                    prizeHtml += "<li>" + json[i].nickName.replace(json[i].nickName.slice(2),"…") + "获得：" + json[i].rewardsName + "&nbsp;" + json[i].createTime + "</li>";
                }
                prizeUl.innerHTML = prizeHtml;
                prizeInfo.style.display = "block";
                prizeBtn.onclick = function() {
                    prizeInfo.style.display = "none";
                }
            } else {
                popUp("<div class = 'timesPopup'><div> 请求超时，请检查网络</div><div class = 'rewardBtn'>确定</div></div>");
                return false;
            }

        });
    }
    //跑马灯顺序移动
    function borderMove(_p, _i) {
        var cle = _p + times * 8 - 1;
        //debugger;
        if (cricle < cle) {
            mark = false;
            for (var i = 0; i < 8; i++) {
                oLi[i].style.border = ".05333rem solid #000";
                oLi[i].style.boxShadow = "";
            }
            oUl.getElementsByClassName("index" + _i)[0].style.border = borderStyle;
            oUl.getElementsByClassName("index" + _i)[0].style.boxShadow = borderShadow;
            _i++;
            if (_i > 8) {
                _i = 1;
            }
            if (cricle >= cle *0.75) {
                speed += 15;
                console.log(speed)
                if (speed>150) {
                    speed = 150;
                }
            } else {
                speed *= 0.5
                if (speed<80) {
                    speed = 60;
                }

            }
            cricle++;

            timer = setTimeout(function() {
                borderMove(_p, _i);
            }, speed);
        }
        if (cricle >= cle) {
            clearTimeout(timer);
            setTimeout(function() {
                cricle = 0;
                speed = 1500;
                mark = true;
                //index = 2;
                popUp(_msg);
                drawCount(appId, activeId);
            }, 1000);
        }
    }

    //请求抽奖
    function prizeDraw(appId, activeId, callback) {
        var prizeUrl = serverUrl + "/active/get_draw_result?appId=" + appId + "&activeId=" + activeId;
        _ajax('GET', prizeUrl, function(reward) {
            var data = reward.data;
            var json = JSON.parse(data);
            if (json.success) {
                var rewardData = json.data;
                if (rewardData) {
                    if (rewardData.rewardsId != "-1") {
                        serialId = rewardData.serialId;
                        callback(rewardData.rewardsId, json.msg);
                    } else if (rewardData.rewardsId == "-1") {
                        callback("-1");
                    }
                }

            } else {
                popUp("<div class = 'timesPopup'><div>请求超时，请检查网络</div><div class = 'rewardBtn'>确定</div></div>");
                return false;
            }
        });
    }

    //提交中奖用户信息
    function submitUserInfo(appId, activeId, serialId, content) {
        var subUrl = serverUrl + "/active/upload_luck1.2?serialId=" + serialId + "&activeId=" + activeId + "&content=" + content + "&appId=" + appId;
        _ajax("GET", subUrl, function(response) {
            if (response.success) {
                popUp("<div>提交数据成功！</div><div class = 'rewardBtn'>确定</div>");
                prompt.innerText = "";
            } else {
                popUp(response.msg);
            }
        });
    }

    //弹出层
    function popUp(html) {
        text.innerHTML = "";
        popup.style.display = "block";
        submitInfo.style.display = "none";
        text.innerHTML = html;
        var rewardBtn = popup.getElementsByClassName("rewardBtn")[0];
        var close = popup.getElementsByClassName("close")[0];
        if (rewardBtn) {
            rewardBtn.onclick = function() {
                popup.style.display = "none";
            };
        }
        if (close) {
            close.onclick = function() {
                popup.style.display = "none";
            };
        }

    }

    //中奖人信息提交框
    function prizePopup(appId) {
        popup.style.display = "none";
        submitInfo.style.display = "block";
        // var subCloseBtn = submitInfo.getElementsByClassName("close")[0];
        var subSure = document.getElementById("subSure");
        var qqRe = /[1-9][0-9]{4,9}/,
            numberRe = /^1(3|4|5|7|8)\d{9}$/;
        var userNameId = document.getElementById("userName");
        var userNumberId = document.getElementById("userNumber");
        var qqNumberId = document.getElementById("qqNumber");
        subSure.onclick = function() {
            userName = userNameId.value;
            userNumber = userNumberId.value;
            qqNumber = qqNumberId.value;
            var userJson = {
                userName: userName,
                userNumber: userNumber,
                qqNumber: qqNumber
            };
            var content = JSON.stringify(userJson);
            if (userName.length < 1) {
                prompt.innerText = "请输入姓名！";
            } else if (numberRe.test(userNumber) == false) {
                prompt.innerText = "请输入正确的电话！";
            } else if (qqRe.test(qqNumber) == false) {
                prompt.innerText = "请输入正确的QQ号！";
            } else {
                submitInfo.style.display = "none";
                submitUserInfo(appId, activeId, serialId, content);
            }
        };
        subCloseBtn.onclick = function() {
            submitInfo.style.display = "none";
        }
    }



    /*ajax函数*/
    function _ajax(type, url, param, callback) {
        if (typeof param == "undefined" && typeof callback == "undefined") {
            param = {};
            callback = null;
        } else if (typeof callback == "undefined") {
            if (typeof param == "function") {
                callback = param;
                param = {};
            } else {
                param = param || {};
                callback = null;
            }
        } else if (typeof param == "undefined") {
            if (typeof callback == "function") {
                param = {};
            } else {
                param = callback || {};
                callback = null;
            }
        } else {
            if (typeof param == "function") {
                param = {};
            } else {
                param = param || {};
            }

            if (typeof callback != "function") {
                callback = null;
            }
        }
        var paramStr = "";
        for (var p in param) {
            paramStr += p + "=" + param[p] + "&";
        }
        if (param.length > 0) {
            paramStr = paramStr.substr(0, paramStr.length - 1);
        }
        var _xmlhttp;
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            _xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            _xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        _xmlhttp.onreadystatechange = function() {
            if (_xmlhttp.readyState == 4 && _xmlhttp.status == 200) {
                callback && callback({
                    success: true,
                    data: _xmlhttp.response || _xmlhttp.responseText,
                    msg: "异步加载成功!",
                    type: null,
                    code: 200
                });
            } else {
                //console.log("异步加载ing _xmlhttp.status  :" + _xmlhttp.status + "  _xmlhttp.readyState  :" + _xmlhttp.readyState);
            }
        };
        // ajax处理请求超时
        _xmlhttp.ontimeout = function() {
            callback && callback({
                success: false,
                data: null,
                msg: "请求超时",
                type: null,
                code: 0
            });
        };
        //ajax 请求出错的时候
        _xmlhttp.onerror = function() {
            callback && callback({
                success: false,
                data: null,
                msg: "请求出错",
                type: null,
                code: 0
            });
        };
        //  处理 Get 或者Post
        if (type == "GET") {
            _xmlhttp.open("GET", url + paramStr, true);
            _xmlhttp.timeout = 3000;
            _xmlhttp.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
            _xmlhttp.send();
        } else {
            _xmlhttp.open("POST", url, true);
            _xmlhttp.timeout = 3000;
            _xmlhttp.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
            _xmlhttp.send(paramStr);
        }
    }







}
