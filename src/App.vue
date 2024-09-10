<template>
  <div>
    <!--
    <audio src="timmy.mp3" autoplay>  
  </audio>
-->
    <router-view>
    </router-view>
  </div>
</template>
<script>
import axios from 'axios';
import { googlePlayVoice } from './device/voice/voice';
import device from './device/index.js';
import {getText} from './util/connect'
/*
const connect = {
  eroll: (ref) => {
    const url = 'http://10.110.4.0:8089/contact/get';
    const data = {
      userId:1
    }
    return axios.post(url, data);
  },
}
connect.eroll()
  .then((res) => {
    console.log(res.data);
  })
  .catch((err) => {
    console.log(err);
  });
  */
  
 // googlePlayVoice("请将放入扫描箱");


export default {
  name: 'App',

  methods: {
  initHardare() {
    let that = this;
    this.$nextTick(function () {
          // 初始化驱动
          device.load("changcheng/chrome");
          setTimeout(() => {
              console.log("初始化所有硬件")
              device.init("changcheng/chrome", that);
              // that.keyboardControl();
          }, 1000);
      })
    },


    
  },
  mounted
() {
    this.initHardare();
    getText();
  },

}
</script>

<style>
  body {
  margin: 0;
  padding: 0;
}
</style>
