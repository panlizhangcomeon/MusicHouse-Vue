import Vue from 'vue';
import {Avatar, Button} from "ant-design-vue";
import { Row } from "ant-design-vue";
import { Col } from "ant-design-vue";
import { Icon } from "ant-design-vue";
import { Menu } from "ant-design-vue";
import { Calendar } from "ant-design-vue";
import { List } from "ant-design-vue";
import { Card } from "ant-design-vue";
import { Message } from "ant-design-vue";
import { FormModel } from "ant-design-vue";
import { Input } from "ant-design-vue";
import { Select } from "ant-design-vue";
import { Checkbox } from "ant-design-vue";
import { Radio } from "ant-design-vue";
import { Switch } from "ant-design-vue";
import { DatePicker } from "ant-design-vue";
import { Tooltip } from "ant-design-vue";
import { Layout } from "ant-design-vue";
import { Comment } from "ant-design-vue";
import { Table } from "ant-design-vue";
import { Divider } from "ant-design-vue";
import { Dropdown } from "ant-design-vue";
import { Drawer } from "ant-design-vue";
import { Upload } from "ant-design-vue";
import { Breadcrumb } from "ant-design-vue";
import Axios from "axios";
// import Button from 'ant-design-vue/lib/button';
// import 'ant-design-vue/dist/antd.css';
import App from './App.vue';

// eslint-disable-next-line no-unused-vars
import HelloWorld from "./components/HelloWorld";

import router from './router'

Vue.component(Button.name, Button);
Vue.component(Row.name, Row);
Vue.component(Col.name, Col);
Vue.component(Icon.name, Icon);
Vue.component(Avatar.name, Avatar);
Vue.component(Calendar.name, Calendar);
Vue.use(Menu);
Vue.use(List);
Vue.use(Card);
Vue.use(Message);
Vue.use(FormModel);
Vue.use(Input);
Vue.use(Select);
Vue.use(Checkbox);
Vue.use(Radio);
Vue.use(Switch);
Vue.use(DatePicker);
Vue.use(Tooltip);
Vue.use(Layout);
Vue.use(Comment);
Vue.use(Table);
Vue.use(Divider);
Vue.use(Dropdown);
Vue.use(Drawer);
Vue.use(Upload);
Vue.use(Breadcrumb);

Vue.prototype.HTTP_URL = 'http://172.17.20.88:9501/';

Vue.config.productionTip = false;
Vue.prototype.$message = Message; //注入全局属性$message
Message.config({
  duration: 1,// 持续时间
  top:`10px`, // 到页面顶部距离
  maxCount: 3 // 最大显示数, 超过限制时，最早的消息会被自动关闭
});

//全局方法，注销
Vue.prototype.logout = function() {
    localStorage.removeItem('token');
    localStorage.removeItem('roomid');
    localStorage.removeItem('roomName');
    localStorage.removeItem('username');
    localStorage.removeItem('avatar');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('play_url');
    localStorage.removeItem('hash');
    localStorage.removeItem('audio_name');
    localStorage.removeItem('lyric');
    localStorage.removeItem('type');
    this.$message.warn('请先登录');
    this.$router.push({
        path:'/login'
    });
};

//判断是不是数组
Vue.prototype.isArray = function(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
};

Vue.prototype.$http = Axios; //注入全局属性$http
Axios.defaults.timeout = 120000;
//请求拦截器
Axios.interceptors.request.use(
    // 在发送请求之前做些什么
    function (config) {
      return config;
    },
    function (error) {
      // 对请求错误做些什么
      return Promise.reject(error)
    }
);
//响应拦截器
Axios.interceptors.response.use(
    function (config) {
      // 对响应数据做点什么
      return config;
    },
    function (error) {
      // 对响应错误做点什么
      return Promise.reject(error);
    }
);

// eslint-disable-next-line no-unused-vars
const app = new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
