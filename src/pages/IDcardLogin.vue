<template>
  <div>
    <div style="display: flex; align-items: center; justify-content: center; height: 10vh;">
      <p
        style="font-size: 60px; position: fixed; top: 20%; left: 50%; transform: translate(-50%, -50%); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;color:white">
        {{ text }}</p>
      <div class="id-card-container">
        <div class="id-card">
          <div class="placeholder" :style="{ transform: `scale(${scale})` }"></div>
          <!-- 在这里添加动态图 -->
          <img :src="src" :style="{ filter: isReading ? '' : '' }" alt="Dynamic Image"
            style="position: absolute; top: 80%; left: 10%; transform: translate(-40%, 0%);" v-if="showDynamicImage" />
        </div>
      </div>
    </div>
   <!-- <button @click="startReading" style="position: fixed; bottom: 20px; right: 20px;">确认</button>-->
    <!--
    <div class="reading-indicator" v-if="isReading"
      style="position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);">正在读取身份证信息...</div>
      -->
  </div>

</template>

<script>
import IdCard from '../device/changcheng/chrome/idcard.js'
import {loginIdcode} from '../util/connect'

export default ({
  data() {
      return {
        isReading: false, // 是否正在读取身份证信息
        scale: 1, // 动画缩放比例
        src: '/IDcard.jpg', // 动态图的路径
        showDynamicImage: true, // 是否显示动态图
        text:"请将身份证放置于NFC读取区域"
      };
    },
  mounted() {
    loginIdcode("2","222222","zhe")
    
    this.animateCard();
    console.log("初始化读卡")
    this.initBindIdCard();
    let signSucc = new Audio()
    signSucc.src = require("../asset/video/test.wav")
    signSucc.play()
    


  },
  methods: {
    /**
* 对身份证动画进行初始化和设置
*/
    animateCard() {
      const scaleStart = 1;
      const scaleEnd = 0.5;
      const duration = 1000;
      const easing = 'ease-in-out';

      const animation = {
        from: { transform: `scale(${scaleStart})` },
        to: { transform: `scale(${scaleEnd})` },
        duration,
        easing
      };

      const idCard = document.querySelector('.id-card .placeholder');
      idCard.animate(animation);
    },
    startReading() {
      //this.isReading = true;
      this.text= "正在读取身份证信息..."
      this.showDynamicImage = true;
      this.showMask = true;
      // 在这里添加读取身份证信息的代码
      // 更改动态图的路径为loading.jpg
     // this.src = require('../asset/image/loading.gif');
    },
    toggleMask() {
      this.showMask = !this.showMask;
    },
    initBindIdCard() {
    //  googlePlayVoice("请将身份证放置在读卡区");
      let that = this;
      // device/changcheng/chrome 目录下
      // cbParams 返回得是回调函数
      const idCard = new IdCard();  // 确保实例化 IdCard
      idCard.IdCardInstance((cbParams) => {  // 使用箭头函数
        switch (cbParams.type) {
          case "OpenConnectionOver":          //打开连接成功回调
            // this.startReading();//这里是我后加的
            console.log("readcard 打开连接成功了");
            break;
          case "AcceptAndReadTracksOver":     // 获取到得读卡数据回调
            console.log("准备要把卡弹出去了");
            console.log("读卡返回得数据cardData:" + cbParams.cardData);
            setTimeout(() => {
              this.$router.push({ path: '/kaihu' }); // 使用箭头函数确保this指向Vue组件实例
            }, 1000);
            this.startReading();
            that.EjectStart();
            break;
          case "CardInvalid":                 // 非法卡片回调
            console.log("非法磁道信息 可能插入的不是身份证！！");
            break;
          case "ErrorInfoReceived":           // 设备错误回调
            console.log("设备错误回调");
            break;
          case "EjectOver":                   // 退卡结束回调
            that.EjectOver();
            googleStopVoice();
            setTimeout(() => {
              googlePlayVoice("请取走您的身份证");
            }, 500);
            break;
          case "CardTaken":                   // 取卡回调 读卡失败时的取卡回调
            console.log("卡被取走了");
            break;
          case "hasNodata":                   // 读卡信息为空的回调
            console.log("读卡信息为空:" + cbParams.msg);
            that.cardReadSuccess = false;
            break;
          case "CardInserted":                // 卡插入时的回调
            console.log("有卡插入");
            that.CardInserted();
            break;
          case "readCardSuccess":             // 取卡回调 取卡成功时的取卡回调
            console.log("读取数据成功，取卡！！ cardData" + cbParams.cardData);
            that.cardReadSuccess = true;
            that.readCardSuccess(cbParams.cardData);
            break;
          case "DeviceError":
            that.cardReadSuccess = false;
            console.error("DeviceError")
            that.isReRead();
            break;
          default:
            if (cbParams.args == "-14" || cbParams.args == "-48" || cbParams.args == "-205") {
              that.alert(cbParams.msg);
            }
        }
      }, 776);
 
    },
  }

})
</script>

<style>
.reading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 70px;
  margin-top: 100%;
}

.id-card-container {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 100vh;
}

.id-card {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

/* 添加以下样式以缩小动态图 */
.id-card img {
  width: 864px; /* 图片宽度缩小到原来的50% */
  height: 582px; /* 高度自动调整 */
}
</style>

