<template>
    <div id="musicList">
        <div id="search">
            <a-breadcrumb style="float:left;margin-bottom: 5px;">
                <a-breadcrumb-item><router-link to="/homelist">房间列表</router-link></a-breadcrumb-item>
                <a-breadcrumb-item><router-link to="/homeDetail">我的房间</router-link></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">搜索歌曲</a></a-breadcrumb-item>
            </a-breadcrumb>
            <a-input-search placeholder="搜索歌曲" size="default" allow-clear @search="onSearch()" v-model="search"/>
            <a-table :columns="columns" :data-source="musicList" :row-key="`hash`">
                <a slot="name" slot-scope="text">{{ text }}</a>
                <span slot="action" slot-scope="text, record">
                    <a href="javascript:void 0"><a-icon type="caret-right" @click="play(record.hash)"/></a>
                    <a-divider type="vertical" />
                    <a href="javascript:void 0"><a-icon type="plus" @click="addMusicList(record)" /></a>
                </span>
            </a-table>
        </div>
    </div>
</template>

<script>
    import * as socket from "../assets/socket"
    const columns = [
        {
            title: '歌曲名',
            dataIndex: 'songname',
            key: 'songname',
            scopedSlots: { customRender: 'name' },
        },
        {
            title: '歌手',
            dataIndex: 'singername',
            key: 'singername',
            width: 120,
        },
        {
            title: '专辑',
            dataIndex: 'album_name',
            key: 'album_name',
            width: 250,
        },
        {
            title: '时长',
            dataIndex: 'duration',
            key: 'duration',
            width: 80,
        },
        {
            title: '操作',
            key: 'action',
            scopedSlots: { customRender: 'action' },
        },
    ];
    export default {
        name:"MusicList",
        data() {
            return {
                search:'',
                musicList:[],
                columns
            }
        },
        created() {
            document.title = '歌曲搜索';
            this.search = this.$route.query.keyword;
            if (this.search !== '') {
                this.onSearch();
            }
        },
        methods:{
            onSearch() {
                let _this = this;
                this.$http.get('http://10.100.50.130:9501/music/getMusicList', {
                    params:{keyword:this.search}
                }).then(function (res) {
                    _this.musicList = res.data.result;
                }).catch(function (error) {
                    _this.$message.error(error);
                })
            },
            //播放音乐
            play(hash) {
                let _this = this;
                _this.$emit('parentFun', hash)
            },
            //添加到播放列表
            addMusicList(record) {
                let _this = this;
                let roomid = localStorage.getItem('roomid');
                let token = localStorage.getItem('token');
                let actions = {
                    "controller":"RoomController",
                    "action":"addRoomMusicList",
                    "params":{
                        "roomid":roomid,
                        "songname":record.songname,
                        "singername":record.singername,
                        "album":record.album_name,
                        "hash":record.hash,
                        "token":token
                    }
                };
                socket.sendSock(actions, _this.getResult);
            },
            getResult(res) {
                let _this = this;
                let username = localStorage.getItem('username');
                if (res.action === 'addRoomMusicList') {
                    if (res.status === 0) {
                        _this.$message.info('添加成功');
                    } else {
                        _this.$message.error("添加失败");
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
    #search {
        width: 60%;
        margin: 10px auto;
    }
</style>
