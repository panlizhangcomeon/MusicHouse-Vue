<template>
    <div id="bottom">
        <span :style="{ fontSize: '20px',color:'#01E5FF',position:'relative',bottom:'16px',marginRight:'120px' }">{{ showLyric }}</span>
        <span :style="{ fontSize: '20px',color:'white',position:'relative',bottom:'16px',marginRight:'60px' }">{{ audioName }}</span>
        <a-tooltip title="随机播放">
            <a-icon type="swap"  @click="changeType" v-if="type == 0" :style="{ fontSize: '20px',color:'white',position:'relative',bottom:'16px',marginRight:'10px' }"/>
        </a-tooltip>
        <a-tooltip title="循环播放">
            <a-icon type="retweet"  @click="changeType" v-if="type == 1" :style="{ fontSize: '20px',color:'white',position:'relative',bottom:'16px',marginRight:'10px' }"/>
        </a-tooltip>
        <a-tooltip title="单曲循环">
            <a-icon type="reload"  @click="changeType" v-if="type == 2" :style="{ fontSize: '20px',color:'white',position:'relative',bottom:'16px',marginRight:'10px' }"/>
        </a-tooltip>
        <a-icon type="step-backward" :style="{ fontSize: '20px',color:'white',position:'relative',bottom:'16px' }" @click="prevMusic"/>
        <a-icon type="step-forward" :style="{ fontSize: '20px',color:'white',position:'relative',bottom:'16px',marginRight:'10px' }" @click="endMusic"/>
        <audio  controls autoplay preload  name="media" style="text-align: center" v-if="hackReset" id="videoPlayer"
               @pause="pauseMusic" @ended="endMusic" @timeupdate="timeupdate" @play="playMusic()">
            <source :src="play_url" type="audio/mpeg">
        </audio >
    </div>
</template>

<script>
    import * as socket from "../assets/socket";
    export default {
        name:"BottomBar",
        data() {
            return {
                play_url:localStorage.getItem('play_url'),
                hackReset:true,
                hash:'',
                audioName:'',
                lyricArr:'',
                showLyric:'',
                type:localStorage.getItem('type')
            }
        },
        methods:{
            //改变播放类型
            changeType() {
                console.log(this.type);
                if (this.type == 0) {
                    this.type = 1;
                    localStorage.setItem('type', '1');
                } else if (this.type == 1) {
                    this.type = 2;
                    localStorage.setItem('type', '2');
                } else {
                    this.type = 0;
                    localStorage.setItem('type', '0');
                }
            },
            //获取歌曲详情
            getMusic(hash) {
                let _this = this;
                _this.$http.get(_this.HTTP_URL + 'music/getMusic', {
                    params:{hash:hash}
                }).then(function (res) {
                    let resData = res.data.result;
                    if (resData.status === 0) {
                        if (resData.play_url !== '') {
                            _this.play_url = resData.play_url;
                            _this.audioName = resData.audio_name;
                            _this.lyricArr = resData.lyrics;
                            localStorage.setItem('audio_name', resData.audio_name);
                            localStorage.setItem('play_url', _this.play_url);
                            localStorage.setItem('hash', hash);
                            localStorage.setItem('lyric', JSON.stringify(_this.lyricArr));
                            _this.changeMusic(); //播放歌曲
                        } else {
                            _this.$message.warn('该歌曲暂无资源');
                        }
                    }
                }).catch(function (error) {
                    _this.$message.error(error);
                });
            },
            //切换歌曲
            changeMusic(){
                //搜索的歌曲列表中点击播放，或者点击上一首/下一首，或者在播放列表中切换时触发
                console.log('切换歌曲');
                this.play_url = localStorage.getItem('play_url');
                this.showLyric = this.audioName;
                this.hackReset = false;
                this.$nextTick( () => {
                    this.hackReset = true;
                } );
            },
            //歌曲停止
            stopMusic() {
                this.audioName = '';
                this.showLyric = '';
                this.changeMusic();
            },
            //播放事件，则通知房间内其他客户端播放
            playMusic() {
                // Media.play(); //播放
                console.log('继续播放')
            },
            //暂停事件，则通知房间内其他客户端暂停
            pauseMusic() {
                // Media.pause(); //暂停
                console.log('暂停');
            },
            //播放结束/点击下一首，则通知房间内其他客户端播放结束
            endMusic() {
                let _this = this;
                console.log('播放结束');
                let roomid = localStorage.getItem('roomid');
                let token = localStorage.getItem('token');
                let hash = localStorage.getItem('hash');
                let actions = {
                    "controller":"RoomController",
                    "action":"getNextMusic",
                    "params":{
                        "roomid":roomid,
                        "hash":hash,
                        "token":token,
                        "type":_this.type
                    }
                };
                socket.sendSock(actions, _this.getResult);
            },
            //点击上一首
            prevMusic() {
                let _this = this;
                let roomid = localStorage.getItem('roomid');
                let token = localStorage.getItem('token');
                let hash = localStorage.getItem('hash');
                let actions = {
                    "controller":"RoomController",
                    "action":"getPrevMusic",
                    "params":{
                        "roomid":roomid,
                        "hash":hash,
                        "token":token,
                        "type":1
                    }
                };
                socket.sendSock(actions, _this.getResult);
            },
            //播放时间改变，则通知房间内其他客户端更改播放时间(不改变播放状态)
            timeupdate() {
                let _this = this;
                let myVid = document.getElementById("videoPlayer");
                if (_this.isArray(_this.lyricArr)) {
                    let len = _this.lyricArr.length;
                    if (len > 1) {
                        for (let i = 0; i < len; i ++) {
                            if (myVid.currentTime >= _this.lyricArr[i]['time']) {
                                if (_this.lyricArr[i + 1] !== undefined) {
                                    if (myVid.currentTime < _this.lyricArr[i + 1]['time']) {
                                        _this.showLyric = _this.lyricArr[i]['lyric']
                                    }
                                } else {
                                    _this.showLyric = _this.lyricArr[i]['lyric']
                                }

                            }
                        }
                    } else {
                        _this.showLyric = _this.lyricArr[0]['lyric']
                    }
                }
                // console.log(myVid.currentTime);
                // myVid.currentTime = 10; //设置播放时间
            },
            getResult(res) {
                let _this = this;
                let username = localStorage.getItem('username');
                if (res.action === 'getNextMusic' || res.action === 'getPrevMusic') {
                    if (res.status === 0) {
                        localStorage.setItem('hash', res.hash);
                        _this.getMusic(res.hash);
                        _this.changeMusic();
                    } else {
                        _this.$message.error("播放下一首失败")
                    }
                } else if (res.action === 'otherJoinRoom') {
                    if (username !== res.username) {
                        _this.$message.info('用户' + res.username + '加入房间');
                    }
                } else if (res.action === 'otherQuitRoom') {
                    if (username !== res.username) {
                        _this.$message.info('用户' + res.username + '退出房间');
                    }
                } else if (res.action === 'otherAddMusic') {
                    if (username !== res.username) {
                        _this.$message.info('用户' + res.username + '添加了新歌：' + res.songname);
                    }
                } else if (res.action === 'otherDelMusic') {
                    if (username !== res.username) {
                        _this.$message.info('用户' + res.username + '删除了歌曲：' + res.songname);
                    }
                } else if (res.action === 'otherAddComment') {
                    if (username !== res.username) {
                        _this.$message.info('用户' + res.username + '添加了一条评论');
                    }
                } else if (res.action === 'otherDelComment') {
                    if (username !== res.username) {
                        _this.$message.info('用户' + res.username + '删除了一条评论');
                    }
                } else if (res.action === 'updateToken') {
                    localStorage.setItem('token', res.token);
                } else if (res.action === 'no login') {
                    _this.logout();
                }
            }
        },
        mounted() {
        },
        created() {
            socket.initWebSocket();
            localStorage.setItem('type', 0);
            this.audioName = localStorage.getItem('audio_name');
            this.lyricArr = JSON.parse(localStorage.getItem('lyric'))
        }
    }
</script>

<style>
    /*屏幕尺寸大于600小于2000时*/
    @media screen and (min-width: 800px) and (max-width: 2000px){
        #bottom {
            background-color: #242424;
            position: fixed;
            margin: 0 auto;
            left: 0;
            right: 0;
            bottom: 0;
        }
    }
    /*屏幕尺寸小于600时*/
    @media (max-width: 800px) {
        #bottom {
            background-color: #242424;
            margin: 0 auto;
            left: 0;
            right: 0;
            bottom: 0;
        }
    }
    audio {
        opacity:0.3;
        width: 40%;
        position: relative;
        top: 4px;
    }
</style>
