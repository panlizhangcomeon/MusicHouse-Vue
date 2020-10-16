<template>
    <div id="parent">
        <div id="userList">
            <a-list item-layout="horizontal" :data-source="data" v-bind:header="`当前在线${data.length}人`">
                <a-list-item slot="renderItem" slot-scope="item">
                    <a-list-item-meta
                            :description="item.joinTime"
                    >
                        <a slot="title" href="javascript:void 0" @click="getOtherInfo(item.username)">{{ item.username }}</a>
                        <a-avatar
                                slot="avatar"
                                :src="this.HTTP_URL + `user/img?imgPath=` + item.avatar"
                        />
                    </a-list-item-meta>
                </a-list-item>
            </a-list>
        </div>
    </div>
</template>

<script>
    import * as socket from "../assets/socket";
    export default {
        name: 'UserList',
        data() {
            return {
                data: []
            };
        },
        created() {
            let _this = this;
            //设置延迟500ms后执行
            setTimeout(function () {
                _this.getRoomUserList();
            }, 1000);
        },
        methods:{
            //获取房间下的在线用户
            getRoomUserList() {
                let _this = this;
                let action = {
                    "controller":"RoomController",
                    "action":"getRoomUserList",
                    "params":{
                        "roomid":localStorage.getItem('roomid'),
                        "token":localStorage.getItem('token')
                    }
                };
                socket.sendSock(action, _this.getResult)
            },
            getResult(res) {
                let _this = this;
                let username = localStorage.getItem('username');
                if (res.action === 'getRoomUserList') {
                    if (res.status === 0) {
                        _this.data = res.userlist;
                    } else {
                        _this.$message.error("获取播放列表失败");
                    }
                } else if (res.action === 'otherJoinRoom') {
                    if (username !== res.username) {
                        _this.$message.info('用户' + res.username + '加入房间');
                        _this.getRoomUserList();
                    }
                } else if (res.action === 'otherQuitRoom') {
                    if (username !== res.username) {
                        _this.$message.info('用户' + res.username + '退出房间');
                        _this.getRoomUserList();
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
            },
            //查看他人信息
            getOtherInfo(username) {
                this.$router.push({
                    path:'/otherInfo',
                    query:{username:username}
                });
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
    #userList {
        text-align: center;
        width: 108%;
        height: 700px;
        overflow-y: scroll;
    }
    .ant-list-item {
        padding: 5px;
    }
</style>
