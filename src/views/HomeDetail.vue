<template>
    <div id="components-layout-demo-basic">
        <a-layout>
            <a-layout-header>
                <a-breadcrumb style="float: left;margin-left: -50px;">
                    <a-breadcrumb-item><router-link to="/homelist">房间列表</router-link></a-breadcrumb-item>
                    <a-breadcrumb-item><router-link to="/homeDetail">我的房间</router-link></a-breadcrumb-item>
                </a-breadcrumb>
                <HomeHeader></HomeHeader>
            </a-layout-header>
            <a-layout class="Content">
                <a-layout-content v-if="contentReset">
                    <CommentList v-if="show === 'Comment'" @parentFun2="listenChild"></CommentList>
                    <PlayList ref="playList" v-else-if="show === 'PlayList'" @parentFun2="listenChild"></PlayList>
                </a-layout-content>
                <a-layout-sider>
                    <UserList ref="userList" @parentFun2="listenChild"></UserList>
                </a-layout-sider>
            </a-layout>
            <a-layout-footer>
                <HomeFooter @parentFun3="changeItem"></HomeFooter>
            </a-layout-footer>
        </a-layout>
    </div>
</template>


<script>
    import CommentList from "../components/CommentList";
    import UserList from "./UserList";
    import HomeHeader from "./HomeHeader";
    import HomeFooter from "./HomeFooter";
    import PlayList from "../components/PlayList";
    export default {
        name: 'HomeDetail',
        data() {
            return {
                hash:'',
                play_url:'',
                show:'PlayList',
                contentReset:true
            }
        },
        created() {
            document.title = localStorage.getItem('roomName');
        },
        components: {
            CommentList, UserList, HomeFooter, HomeHeader, PlayList
        },
        methods:{
            //监听子组件
            listenChild($event) {
                let _this = this;
                if ($event === 'getPlayList') {
                    _this.$refs.playList.getRoomMusicList();
                } else if ($event === 'getUserList') {
                    _this.$refs.userList.getRoomUserList();
                } else {
                    _this.$emit('parentFun', $event);
                }
            },
            //切换评论和歌曲列表时执行
            changeItem($event) {
                let _this = this;
                if ($event === 'Comment' || $event === 'PlayList') {
                    _this.show = $event;
                    this.contentReset = false;
                    this.$nextTick( () => {
                        this.contentReset = true;
                    } );
                } else if ($event === 'StopMusic') {
                    _this.$emit('parentFun', 'StopMusic')
                }
            }
        }
    }
</script>

<style>
    #components-layout-demo-basic {
        text-align: center;
        padding: 10px 100px;
        color: #000000;
    }
    #components-layout-demo-basic .ant-layout-header,
    #components-layout-demo-basic .ant-layout-footer {
        background: #F8F8F8;
        color: #fff;
    }
    #components-layout-demo-basic .ant-layout-footer {
        line-height: 1;
    }
    #components-layout-demo-basic .ant-layout-sider {
        background: #ffffff;
        color: #fff;
        height: 700px;
    }
    #components-layout-demo-basic .ant-layout-content {
        background: #ffffff;
        color: #fff;
    }
    #components-layout-demo-basic > .ant-layout {
        margin-bottom: 48px;
    }
    #components-layout-demo-basic > .ant-layout:last-child {
        margin: 0;
    }
</style>
