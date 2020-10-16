var websock = null;
var global_callback = null;
var WEBSOCKET_URL = "ws://192.168.10.18:9501";

//socket心跳连接相关
var global_lockReconnect = false;//是否真正建立连接
var global_timeout = 30*1000;//30秒一次心跳
var global_timeoutObj = null;//心跳倒计时
var global_timeoutnum = null;//断开 重连倒计时

//初始化websocket
function initWebSocket() {
    console.log("初始化websocket");
    //初始化weosocket
    //ws地址
    var wsUri = WEBSOCKET_URL;
    websock = new WebSocket(wsUri);
    websock.onmessage = function(e) {
        websocketonmessage(e);
    };
    websock.onclose = function(e) {
        websocketclose(e);
    };
    websock.onopen = function() {
        websocketOpen();
    };

    //连接发生错误的回调方法
    websock.onerror = function() {
        console.log("WebSocket连接发生错误");
        reconnect();
    };
}

// 实际调用的方法
function sendSock(agentData, callback) {
    if(agentData != 'PING') {
        global_callback = callback;
    }
    if(global_lockReconnect) return;
    console.log(agentData,"发送数据====="+websock.readyState+"======"+websock.OPEN)
    if (websock.readyState === websock.OPEN) {
        //若是ws开启状态
        websocketsend(agentData);
    } else if (websock.readyState === websock.CONNECTING) {
        // 若是 正在开启状态，则等待1s后重新调用
        setTimeout(function() {
            sendSock(agentData, callback);
        }, 1000);
    } else {
        // 若未开启 ，则等待1s后重新调用
        setTimeout(function() {
            sendSock(agentData, callback);
        }, 1000);
    }
}

//数据接收
function websocketonmessage(e) {
    e.data=="PONG" ? console.log(e.data,"获取数据1") : console.log(JSON.parse(e.data),"获取数据2");
    if(e.data!="PONG" && typeof global_callback == "function") {
        let param = JSON.parse(e.data);
        global_callback(param);
    }
    //收到服务器信息，心跳重置
    reset();
}

//数据发送
function websocketsend(agentData) {
    if(agentData=="PING") return websock.send(agentData);
    websock.send(JSON.stringify(agentData));
}

//关闭
function websocketclose(e) {
    console.log("连接关闭" + e);
}

//连接
function websocketOpen(e) {
    console.log("连接成功" + e);
    //开启心跳
    start();
}

//重新连接
function reconnect() {
    if(global_lockReconnect) return;
    global_lockReconnect = true;
    //没连接上会一直重连，设置延迟避免请求过多
    global_timeoutnum && clearTimeout(global_timeoutnum);
    global_timeoutnum = setTimeout(function () {
        //新连接
        console.log("重新链接");
        initWebSocket();
        global_lockReconnect = false;
    },5000);
}

//重置心跳时间
function reset(){
    //清除时间
    clearTimeout(global_timeoutObj);
    //重启心跳
    start();
}

//开启心跳
function start() {
    if(global_lockReconnect) return;
    global_timeoutObj && clearTimeout(global_timeoutObj);
    global_timeoutObj = setTimeout(function(){
        //这里发送一个心跳，后端收到后，返回一个心跳消息，
        console.log("链接状态readyState："+websock.readyState+"链接状态open："+websock.OPEN)
        if (websock.readyState == 1) {//如果连接正常 发送一个心跳链接
            sendSock("PING");
        }else if (websock.readyState == 0){//正在链接
            // 若是 正在开启状态，则等待1s后重新调用
            setTimeout(function() {
                start();
            }, 1000);
        } else{//否则重连
            reconnect();
        }
    }, global_timeout)
}

// 断开不重连
function closeSock() {
    websocketclose();
    global_lockReconnect = true;
}

// initWebSocket();

export { initWebSocket, sendSock, closeSock, WEBSOCKET_URL };
