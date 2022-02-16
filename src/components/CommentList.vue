<template>
    <div id="parent">
        <div id="commentList">
            <a-list class="comment-list" v-bind:header="`${data.length} 条评论`" item-layout="horizontal" v-bind:data-source="data">
                <a-list-item slot="renderItem" slot-scope="item">
                    <a-comment v-bind:author="item.author" v-bind:avatar="item.avatar" id="author">
                        <template slot="actions">
                            <span v-for="action in item.actions" v-bind:key="action" @click="delComment(item.id)">{{ action }}</span>
                        </template>
                        <p slot="content">
                            {{ item.content }}
                        </p>
                        <a-tooltip slot="datetime" :title="item.datetime.format('YYYY-MM-DD HH:mm:ss')">
                            <span>{{ item.datetime.fromNow() }}</span>
                        </a-tooltip>
                    </a-comment>
                </a-list-item>
            </a-list>
        </div>
    </div>
</template>

<script>
    import * as socket from "../assets/socket"
    import moment from 'moment';
    export default {
        name: 'CommentList',
        data() {
            return {
                data: [],
                moment,
            };
        },
        created() {
            this.getRoomComment();
        },
        methods:{
            //获取房间下的评论
            getRoomComment() {
                let _this = this;
                let actions = {
                    "controller":"RoomController",
                    "action":"getRoomComment",
                    "params":{
                        "token":localStorage.getItem('token'),
                        "roomid":localStorage.getItem('roomid'),
                    }
                };
                socket.sendSock(actions, _this.getResult);
            },
            //删除评论
            delComment(id) {
                let _this = this;
                let actions = {
                    "controller":"RoomController",
                    "action":"delComment",
                    "params":{
                        "token":localStorage.getItem('token'),
                        "id":id,
                        "roomid":localStorage.getItem('roomid'),
                    }
                };
                socket.sendSock(actions, _this.getResult);
            },
            getResult(res) {
                console.log('bottomBar get Result 2')
                let _this = this;
                let username = localStorage.getItem('username');
                if (res.action === 'getRoomComment') {
                    if (res.status === 0) {
                        let commentList = res.data;
                        let length = commentList.length;
                        let i;
                        let arr = new Array();
                        for (i = 0; i < length; i ++) {
                            arr[i] = {
                                id:commentList[i]['id'],
                                author:commentList[i]['creator'],
                                avatar:_this.HTTP_URL + 'user/img?imgPath=' + commentList[i]['avatar'],
                                content:commentList[i]['comment'],
                                datetime:moment(commentList[i]['create_time'], "YYYY-MM-DD HH:mm:ss"),
                            };
                            if (username === commentList[i]['creator']) {
                                arr[i]['actions'] = ['删除'];
                            }
                        }
                        _this.data = arr;
                    } else {
                        _this.$message.error('获取评论列表失败')
                    }
                } else if (res.action === 'delComment') {
                    if (res.status === 0) {
                        _this.$message.info('删除成功');
                        _this.getRoomComment();
                    }
                } else if (res.action === 'otherJoinRoom') {
                    if (username !== res.username) {
                        _this.$message.info('用户' + res.username + '加入房间');
                        _this.$emit('parentFun2', 'getUserList') //重新获取用户列表
                    }
                } else if (res.action === 'otherQuitRoom') {
                    if (username !== res.username) {
                        _this.$message.info('用户' + res.username + '退出房间');
                        _this.$emit('parentFun2', 'getUserList') //重新获取用户列表
                    }
                } else if (res.action === 'otherAddMusic') {
                    if (username !== res.username) {
                        _this.$message.info('用户' + res.username + '添加了新歌：' + res.songname);
                        _this.$emit('parentFun2', 'getPlayList') //重新获取播放列表
                    }
                } else if (res.action === 'otherDelMusic') {
                    if (username !== res.username) {
                        _this.$message.info('用户' + res.username + '删除了歌曲：' + res.songname);
                        _this.$emit('parentFun2', 'getPlayList') //重新获取播放列表
                    }
                } else if (res.action === 'otherAddComment') {
                    if (username !== res.username) {
                        _this.$message.info('用户' + res.username + '添加了一条评论');
                        _this.getRoomComment();
                    }
                } else if (res.action === 'otherDelComment') {
                    if (username !== res.username) {
                        _this.$message.info('用户' + res.username + '删除了一条评论');
                        _this.getRoomComment();
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
    #parent {
        width: 100%;
        height: 700px;
        overflow: hidden;
    }
    #commentList {
        padding: 0 20px;
        width: 102%;
        height: 700px;
        overflow-y: scroll;
    }
    .ant-list-item {
        padding: 5px;
    }
</style>
