<template>
  <div class="home">
    <a-list :grid="{ gutter: 16, column: 4 }" :data-source="data">
      <a-list-item slot="renderItem" slot-scope="item">
        <a-card :title="item.title">
            <a href="javascript:void 0" @click="joinRoom(item.id, item.title)">{{ item.desc }}</a>
            <a-button class="delRoom" type="danger" size="small" v-if="item.creator === username" @click="delRoom(item.id)">删除</a-button>
        </a-card>
      </a-list-item>
    </a-list>
    <div>
      <a-tooltip title="创建房间">
        <a-icon type="plus-circle" :style="{ fontSize: '32px' }" v-on:click="addRoom" />
      </a-tooltip>
        <a-tooltip title="回到上次房间">
        <a-icon type="rollback" :style="{ fontSize: '32px' }" v-on:click="backRoom" style="margin-left: 50px;" />
      </a-tooltip>
    </div>
    <a-drawer title="添加房间" :placement="placement" :closable="false" :visible="visible" @close="onClose" height="400">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item ref="roomTitle" label="房间名" prop="roomTitle" has-feedback="">
            <a-input v-model="form.roomTitle" @blur="() => {$refs.name.onFieldBlur();}" autocomplete="off"/>
          </a-form-model-item>
          <a-form-model-item label="房间描述" prop="roomDesc" has-feedback="">
            <a-input v-model="form.roomDesc" type="textarea" />
          </a-form-model-item>
          <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
            <a-button type="primary" @click="onSubmit">
              提交
            </a-button>
            <a-button style="margin-left: 10px;" @click="resetForm">
              重置
            </a-button>
          </a-form-model-item>
        </a-form-model>
    </a-drawer>
  </div>
</template>

<script>
  import * as socket from "../assets/socket"

  export default {
        name: 'HomeList',
        data:function () {
            return {
                joinRoomid:'',
                roomName:'',
                username:'',
                labelCol: { span: 4 },
                wrapperCol: { span: 14 },
                data: [],
                visible:false,
                placement:'bottom',
                form: {
                    roomTitle: '',
                    roomDesc:'',
                },
                rules: {
                    roomTitle: [
                      { required: true, message: '请输入房间名', trigger: 'blur' },
                      { min: 1, max: 50, message: '房间名长度在1到50位之间', trigger: 'blur' },
                    ],
                    roomDesc: [
                      { required: true, message: '房间描述不可为空', trigger: 'blur' },
                    ],
                },
            };
        },
        methods: {
            onSubmit() {
              let _this = this;
              _this.$refs.ruleForm.validate(valid => {
                  if (valid) {
                      let actions = {
                        "controller":"RoomController",
                        "action":"addRoom",
                        "params":{
                          "token":localStorage.getItem('token'),
                          "roomtitle":_this.form.roomTitle,
                          'roomdesc':_this.form.roomDesc
                        }
                      };
                      socket.sendSock(actions, _this.getResult);
                  } else {
                      console.log('error submit!!');
                      return false;
                  }
              });
            },
            resetForm() {
                this.$refs.ruleForm.resetFields();
            },
            //根据localstorage存储的token判断登陆状态
            getIsLogin : function () {
                let _this = this;
                let token = localStorage.getItem('token');
                _this.$http.get(_this.HTTP_URL + "user/getUserInfo", {
                    params:{token:token}
                }).then(function (res) {
                    if (res.data.result.status !== 0) {
                        console.log('判断登陆状态===============');
                        _this.$message.warn('请先登录');
                        _this.$router.push({
                          path:'/login'
                        })
                    } else {
                        _this.username = localStorage.getItem('username');
                    }
                }).catch(function (error) {
                    console.log(error)
                })
            },
              //添加房间
            addRoom: function () {
                let _this = this;
                let actions = "PING";
                socket.sendSock(actions); //心跳检测
                let roomid = localStorage.getItem('roomid');
                if (roomid !== null) {
                    _this.$message.error('请先退出当前房间');
                    return;
                }
                this.showDrawer();
            },
              //回到上次房间
            backRoom: function() {
                let _this = this;
                let roomid = localStorage.getItem('roomid');
                if (roomid === null) {
                    _this.$message.warn('您未进入过任何房间');
                    return;
                }
                this.joinRoom(roomid);
            },
              //获取房间列表
            getRoomList: function () {
                let _this = this;
                let actions = {
                    "controller":"RoomController",
                    "action":"getRoomList",
                    "params":{
                        "token":localStorage.getItem('token'),
                        "roomid":localStorage.getItem('roomid')
                    }
                };
                socket.sendSock(actions, _this.getResult);
            },
              //加入房间
            joinRoom: function (roomid, roomName) {
                let _this = this;
                let existRoomId = localStorage.getItem('roomid');
                _this.joinRoomid = roomid;
                _this.roomName = roomName;
                if (existRoomId == null) {
                    //本地无房间id，则调接口进入房间
                    let actions = {
                        "controller":"RoomController",
                        "action":"joinRoom",
                        "params":{
                            "roomid":roomid,
                            "token":localStorage.getItem('token')
                        }
                    };
                    socket.sendSock(actions, _this.getResult);
                } else {
                    //如果本地存了房间id，说明仍在房间中
                    if (existRoomId != roomid) {
                        //如果要进入的房间id和本地不同，说明是其他房间
                        _this.$message.error('您已加入其他房间');
                        return false;
                    } else {
                        //进入上次房间
                        _this.$router.push({
                            path:'/homeDetail'
                        });
                    }
                }
            },
            //删除房间
            delRoom: function (roomid) {
                let _this = this;
                let existRoomId = localStorage.getItem('roomid');
                if (existRoomId !== null) {
                    //如果要进入的房间id和本地不同，说明是其他房间
                    _this.$message.error('请先退出当前房间');
                    return false;
                }
                let actions = {
                    "controller":"RoomController",
                    "action":"delRoom",
                    "params":{
                      "token":localStorage.getItem('token'),
                      "roomid":roomid
                    }
                };
                socket.sendSock(actions, _this.getResult);
            },
            //显示抽屉
            showDrawer:function () {
                this.visible = true;
            },
            //关闭抽屉
            onClose:function () {
                this.visible = false;
            },
            getResult(res) {
                let _this = this;
                let username = localStorage.getItem('username');
                if (res.action === 'addRoom') {
                    if (res.status === 0) {
                        _this.$message.info('添加成功');
                        _this.onClose();
                        _this.getRoomList();
                    } else {
                        _this.$message.info('添加失败');
                    }
                } else if (res.action === 'getRoomList') {
                    if (res.status === 0) {
                        _this.data = res.room_list;
                        console.log(_this.data);
                    }
                } else if (res.action === 'joinRoom') {
                    if (res.status === 0) {
                        _this.$router.push({
                          path:'/homeDetail'
                        });
                        localStorage.setItem('roomid', _this.joinRoomid);
                        localStorage.setItem('roomName', _this.roomName);
                    } else {
                        _this.$message.error("加入房间失败")
                    }
                } else if (res.action === 'delRoom') {
                    if (res.status === 0) {
                        _this.$message.info('删除成功');
                        _this.getRoomList();
                    } else {
                        _this.$message.error(res.errorMsg);
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
        created() {
            let _this = this;
            document.title = '房间列表';
            _this.getIsLogin();
            // websocket连接
            socket.initWebSocket();
            _this.getRoomList()
        }
    }
</script>

<style>
  .home {
    padding: 10px 100px;
  }
  .delRoom {
    margin-left: 10px;
  }
</style>
