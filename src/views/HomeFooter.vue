<template>
    <div id="footer">
        <a-row>
            <a-col :span="12">
                <a-textarea v-model="comment" style="display: inline;" id="sendComment" placeholder="输入评论" :auto-size="{ minRows: 1, maxRows: 3 }" allow-clear />
                <a-button style="display: inline" type="primary" @click="addComment">发送</a-button>
            </a-col>
            <a-col :span="8">
                <div id="footerButtons">
                    <a-button class="button" type="primary" @click="getComment()">查看评论</a-button>
                    <a-button class="button" type="primary" @click="getPlayList()">房间歌曲列表</a-button>
                    <a-button class="button" type="danger" @click="quitRoom()">退出房间</a-button>
                </div>
            </a-col>
        </a-row>
    </div>
</template>

<script>
    import * as socket from "../assets/socket"
    export default {
        name: "HomeFooter",
        data() {
          return {
              comment: ''
          }
        },
        methods:{
            //退出房间
            quitRoom: function () {
                let _this = this;
                let roomid = localStorage.getItem('roomid');
                let token = localStorage.getItem('token');
                let actions = {
                    "controller":"RoomController",
                    "action":"quitRoom",
                    "params":{
                        "roomid":roomid,
                        "token":token
                    }
                };
                socket.sendSock(actions, _this.getResult);
            },
            //添加评论
            addComment: function () {
                let _this = this;
                let roomid = localStorage.getItem('roomid');
                let token = localStorage.getItem('token');
                let actions = {
                    "controller":"RoomController",
                    "action":"addComment",
                    "params":{
                        "roomid":roomid,
                        "token":token,
                        "comment":_this.comment
                    }
                };
                socket.sendSock(actions, _this.getResult);
            },
            //查看评论
            getComment:function () {
                let _this = this;
                _this.$emit("parentFun3", "Comment")
            },
            //查看歌曲列表
            getPlayList:function () {
                let _this = this;
                _this.$emit("parentFun3", "PlayList")
            },
            getResult(res) {
                let _this = this;
                let username = localStorage.getItem('username');
                if (res.action === 'quitRoom') {
                    if (res.status === 0) {
                        localStorage.removeItem('roomid');
                        localStorage.removeItem('roomName');
                        localStorage.removeItem('play_url');
                        localStorage.removeItem('hash');
                        localStorage.removeItem('audio_name');
                        localStorage.removeItem('lyric');
                        localStorage.removeItem('type');
                        _this.$emit('parentFun3', 'StopMusic');
                        _this.$router.push({
                            path:'/homelist'
                        });
                    } else {
                        _this.$message.error("退出房间失败")
                    }
                } else if (res.action === 'addComment') {
                    if (res.status === 0) {
                        console.log(res);
                        _this.$message.info("添加成功");
                        _this.getComment();
                    } else {
                        _this.$message.error("添加评论失败")
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
        }
    }
</script>

<style>
    #sendComment {
        width: 500px;
    }
    .button {
        margin-left: 10px;
    }
</style>
