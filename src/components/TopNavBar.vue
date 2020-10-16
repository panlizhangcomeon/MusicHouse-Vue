<template>
    <div id="top">
        <a-menu v-model="current" mode="horizontal" id="topNavBar">
            <a-menu-item key="Logo" class="logo" disabled><img src="../assets/logo.png" alt=""></a-menu-item>
            <a-menu-item key="homeList"><router-link to="/homelist"><span><a-icon style="color: white" type="align-left" />房间列表</span></router-link></a-menu-item>
            <a-menu-item key="home"><router-link to="/home"><span><a-icon type="home" />主页</span></router-link></a-menu-item>
            <a-sub-menu v-if="isLogin === 1">
                <span slot="title" class="submenu-title-wrapper">
                    <a-avatar class="MyAvatar" icon="user" :src="avatar"/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ username }}
                </span>
                <a-menu-item key="setting:1">
                    <router-link to="/userInfo">
                        个人信息
                    </router-link>
                </a-menu-item>
                <a-menu-item key="setting:2">
                    <router-link to="/changePassword">
                        修改密码
                    </router-link>
                </a-menu-item>
                <a-menu-item key="setting:3" v-on:click="logOut">
                    退出登陆
                </a-menu-item>
            </a-sub-menu>
            <a-sub-menu v-else>
                <span slot="title" class="submenu-title-wrapper">
                    <a-avatar class="MyAvatar" icon="user"/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;未登录
                </span>
                <a-menu-item key="login"><router-link to="/login">登录</router-link></a-menu-item>
                <a-menu-item key="register"><router-link to="/register">注册</router-link></a-menu-item>
            </a-sub-menu>
        </a-menu>
    </div>
</template>
<script>
    export default {
        name: "TopNavBar",
        data() {
            return {
                avatar:'',
                current: ['mail'],
                username: '',
                isLogin:0, //本地有token，证明已登录
            };
        },
        methods: {
            //退出登陆
            logOut : function () {
                let _this = this;
                let roomid = localStorage.getItem('roomid');
                let username = localStorage.getItem('username');
                _this.$http.get(_this.HTTP_URL + "user/logout", {
                    params:{roomid:roomid, username:username}
                }).then(function (res) {
                    if (res.data.result.status === 0) {
                        _this.$message.info('已注销');
                        _this.logout();
                        setTimeout(function () {
                            location.reload();
                        }, 500);
                    }
                }).catch(function (error) {
                    console.log(error)
                });
            },
            //根据localstorage存储的token判断登陆状态，验证token有效性
            getIsLogin : function () {
                let _this = this;
                let token = localStorage.getItem('token');
                _this.$http.get(_this.HTTP_URL + "user/getUserInfo", {
                    params:{token:token}
                }).then(function (res) {
                    if (res.data.result.status === 0) {
                        _this.username = res.data.result.username;
                        _this.isLogin = 1;
                        if (res.data.result.avatar !== '') {
                            _this.avatar = _this.HTTP_URL + 'user/img?imgPath=' + res.data.result.avatar;
                        }
                    }
                }).catch(function (error) {
                    console.log(error)
                })
            }
        },
        created() {
            this.getIsLogin();
        }
    };
</script>

<style>
    #topNavBar {
        background-color: #242424;
    }
    #top span {
        color: white;
    }
    .MyAvatar {
        text-align: right;
    }
    .logo {
        margin-right: 20px;
    }
    img {
        width: 50px
    }
</style>
