<template>
  <div class="myHomeList">
    <div>
      <div :style="{ width: '300px', border: '1px solid #d9d9d9', borderRadius: '5px' }">
        <a-calendar :fullscreen="false" @panelChange="onPanelChange" />
      </div>
    </div>
  </div>
</template>

<script>
  import * as socket from "../assets/socket"
  export default {
      name: "MyHomeList",
      methods: {
        onPanelChange : function (value, mode) {
          console.log(value, mode);
        }
      },
      created() {
        document.title = '主页';
        // websocket连接
        socket.initWebSocket();
      },
      data() {
        return {
          data: [],
        }
      }
  }
</script>

<style>
  .myHomeList {
    padding: 10px 200px;
  }
  .delRoom {
    margin-left: 10px;
  }
</style>
