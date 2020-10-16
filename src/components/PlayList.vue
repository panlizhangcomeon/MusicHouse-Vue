<template>
    <div id="playList" v-if="hackReset1">
        <a-table :columns="columns" :data-source="musicList" :row-key="`hash`">
            <a slot="name" slot-scope="text">{{ text }}</a>
            <span slot="action" slot-scope="text, record">
                <a href="javascript:void 0"><a-icon type="caret-right" @click="play(record.hash)"/></a>
                <a-divider type="vertical" />
                <a href="javascript:void 0"><a-icon type="delete" @click="deleteMusicList(record.hash, record.songname)" /></a>
            </span>
        </a-table>
    </div>
</template>

<script>
    import * as socket from "../assets/socket"
    const columns = [
        {
            title:'播放列表',
            dataIndex: 'songname',
            key: 'songname',
            scopedSlots: { customRender: 'name' },
        },
        {
            dataIndex: 'singername',
            key: 'singername',
            width: 120,
        },
        {
            key: 'action',
            scopedSlots: { customRender: 'action' },
        },
    ];
    export default {
        name:"PlayList",
        data() {
            return {
                search:'',
                hackReset1:true,
                musicList:[],
                columns
            }
        },
        created() {
            let _this = this;
            _this.getRoomMusicList();
        },
        methods:{
            //获取房间播放列表
            getRoomMusicList: function () {
                let _this = this;
                let roomid = localStorage.getItem('roomid');
                let token = localStorage.getItem('token');
                let actions = {
                    "controller":"RoomController",
                    "action":"getRoomMusicList",
                    "params":{
                        "roomid":roomid,
                        "token":token
                    }
                };
                socket.sendSock(actions, _this.getResult);
            },
            //播放音乐
            play(hash) {
                let _this = this;
                _this.$emit('parentFun2', hash)
            },
            //删除播放列表
            deleteMusicList(hash, songname) {
                let _this = this;
                let roomid = localStorage.getItem('roomid');
                let token = localStorage.getItem('token');
                let actions = {
                    "controller":"RoomController",
                    "action":"deleteRoomMusicList",
                    "params":{
                        "roomid":roomid,
                        "hash":hash,
                        "songname":songname,
                        "token":token
                    }
                };
                socket.sendSock(actions, _this.getResult);
            },
            getResult(res) {
                let _this = this;
                let username = localStorage.getItem('username');
                if (res.action === 'getRoomMusicList') {
                    if (res.status === 0) {
                        _this.musicList = res.data;
                    } else {
                        _this.$message.error("获取播放列表失败");
                    }
                } else if (res.action === 'deleteRoomMusicList') {
                    if (res.status === 0) {
                        _this.hackReset1 = false;
                        _this.$nextTick( () => {
                            //重新初始化，重新获取播放列表
                            _this.hackReset1 = true;
                            _this.getRoomMusicList();
                        } );
                    } else {
                        _this.$message.error("移除失败");
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
                        _this.getRoomMusicList();
                    }
                } else if (res.action === 'otherDelMusic') {
                    if (username !== res.username) {
                        _this.$message.info('用户' + res.username + '删除了歌曲：' + res.songname);
                        _this.getRoomMusicList();
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
    #playList {
        z-index: 99;
        color: black;
    }
</style>
