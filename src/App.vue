<template>
  <div id="app">
    <TopNavBar ref="topNavBar"></TopNavBar>
    <div v-if="this.$route.path === '/'">
      <HomeList></HomeList>
    </div>
    <div v-else-if="this.$route.path === '/homelist'">
      <HomeList></HomeList>
    </div>
    <div v-else-if="this.$route.path === '/home'">
      <MyHomeList></MyHomeList>
    </div>
    <div v-else-if="this.$route.path === '/register'">
      <Register></Register>
    </div>
    <div v-else-if="this.$route.path === '/login'">
      <Login @parentFun="childFun"></Login>
    </div>
    <div v-else-if="this.$route.path === '/changePassword'">
      <ChangePassword></ChangePassword>
    </div>
    <div v-else-if="this.$route.path === '/userInfo'">
      <UserInfo></UserInfo>
    </div>
    <div v-else-if="this.$route.path === '/otherInfo'">
      <OtherInfo></OtherInfo>
    </div>
    <div v-else-if="this.$route.path === '/homeDetail'">
      <HomeDetail @parentFun="childFun"></HomeDetail>
    </div>
    <div v-else-if="this.$route.path === '/musicList'">
      <MusicList @parentFun="childFun"></MusicList>
    </div>
    <BottomBar ref="child"></BottomBar>
  </div>
</template>

<script>
  import TopNavBar from "./components/TopNavBar";
  import MyHomeList from "./views/MyHomeList";
  import HomeList from "./views/HomeList";
  import Register from "./views/Register";
  import Login from "./views/Login";
  import ChangePassword from "./views/ChangePassword";
  import UserInfo from "./views/UserInfo";
  import HomeDetail from "./views/HomeDetail";
  import BottomBar from "./components/BottomBar";
  import MusicList from "./views/MusicList";
  import OtherInfo from "./views/OtherInfo";
  export default {
    name:"App",
    components:{
      TopNavBar, MyHomeList, HomeList, Register, Login, ChangePassword, UserInfo, HomeDetail, BottomBar, MusicList, OtherInfo
    },
    methods:{
      childFun: function($event) {
        let _this = this;
        console.log($event)
        if ($event === 'login') {
          _this.$refs.topNavBar.getIsLogin();
        } else if ($event === 'StopMusic') {
          _this.$refs.child.stopMusic();
        } else {
          _this.$refs.child.getMusic($event);
        }
      },
    },
    created() {
    },
    mounted() {
        // //关闭一个窗口时清空所有localStorage缓存,所有页面都需要重新登录
        // let beginTime = 0;//开始时间
        // let differTime = 0;//时间差
        // window.onunload = function (){
        //     differTime = new Date().getTime() - beginTime;
        //     if(differTime <= 5) localStorage.clear();
        // };
        // window.onbeforeunload = function (){
        //     beginTime = new Date().getTime();
        // };
    }
  }
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
