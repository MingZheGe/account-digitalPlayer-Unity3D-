<template>
  <div class="face-recog-box" :class="{noRecoged:!isrecoged}">
    <div class="start-camera" v-if="currentStep == 'startCamera'">
      <div class="camera-logo">
        <img :src="require('@icons/yinheVTM/camera/icon-upscreen-video-load.svg')">
      </div>
      <div class="camera-loading">
        <img :src="require('@icons/yinheVTM/camera/video-loading-3.gif')">
      </div>
      <div class="camera-tips" style="font-size:24px">
        正在启动摄像头，请正视<span style="color: #ff8400;font-weight: 700;">下方左侧摄像头</span>...
      </div>
    </div>
    <div class="face-recog-header" v-if="currentStep == 'canCapture' || currentStep == 'captureOver'" >
        <div class="header-title">人脸识别</div>
        <div class="header-time">{{currentTime}}</div>
    </div>
    <div class="face-recog-frame" v-if="currentStep == 'canCapture' || currentStep == 'captureOver'">
      <div class="frame-content" v-show="!isrecoged">
        <div class="objectBox" v-if="currentStep == 'captureOver'">
          <div>
            <img :src="require('@icons/yinheVTM/camera/icon-result-sucess.svg')" alt="">
          </div>
          <div class="success-tips">
            采集成功!
          </div>
          <div class="see-down-tips">
            请在下方屏幕确认您的照片是否清晰
          </div>
        </div>
        <div v-if="currentStep == 'canCapture'" style="position: absolute;bottom: 4px;left: 280px;font-size: 42px;">
          现场照采集中，请正视<span style="color: #ff8400;font-weight: 700;">下方左侧摄像头</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  created () {
  },
  data () {
    return {
      faceImg: "",
      isrecoged: false,      //是否获取照片
      cameraYc: null,
      currentTime: "",
      timerInt: null,
      // startCamera canCapture captureOver
      currentStep: 'startCamera'
    }
  },
  props: ["stopFaceRecog", "isLoginOut", "showType", "isCollectImg"],
  beforeCreate() {
    console.log("人脸识别窗口创建之前");
  },
  created() {
    console.log("人脸识别窗口创建");
  },
  beforeMount() {
    console.log("人脸识别挂载前");
  },
  mounted () {
    this.timeFormate(new Date());
    this.timerInt = setInterval(()=>{
      this.timeFormate(new Date());
    },1000)
    console.log("进入了人脸识别mounted")
    // 初始化中间件自带的云从人脸摄像头
    this.initBindCameraYc()
    
  },
  components: {
  },
  beforeDestroy () {
    this.closeCamera();
    console.log("人脸识别beforeDestory");
  },
  destroyed() {
    clearInterval(this.timerInt);
    console.log("人脸识别destroyed")
  },
  computed: {
    isReadCard () {
      return this.$storage.getSession(this.$definecfg.READ_CARD);
    },
  },
  watch: {
    stopFaceRecog: function (val) {
      if (val == "closeRecog") {
        this.closeCamera();
        this.$emit("closeFaceRecog");
      } else if (val == "jumpTo") {
        this.closeCamera();
        this.$emit("closeFaceRecog");
      } else if (val == "recogAgain") {
        this.isrecoged = false;
        this.initBindCameraYc();
      }
    },
    showType:function(val){
      if(val=="faceReg"){
        this.isrecoged = false;
        setTimeout(()=>{
          this.initBindCameraYc();
        },100)
      }else{
        this.isrecoged = false;
      }
    }
  },
  methods: {
      timeFormate(timeStamp) {
        let year = new Date(timeStamp).getFullYear();
        let month =new Date(timeStamp).getMonth() + 1 < 10? "0" + (new Date(timeStamp).getMonth() + 1): new Date(timeStamp).getMonth() + 1;
        let date =new Date(timeStamp).getDate() < 10? "0" + new Date(timeStamp).getDate(): new Date(timeStamp).getDate();
        let hh =new Date(timeStamp).getHours() < 10? "0" + new Date(timeStamp).getHours(): new Date(timeStamp).getHours();
        let mm =new Date(timeStamp).getMinutes() < 10? "0" + new Date(timeStamp).getMinutes(): new Date(timeStamp).getMinutes();
        let ss =new Date(timeStamp).getSeconds() < 10? "0" + new Date(timeStamp).getSeconds(): new Date(timeStamp).getSeconds();
        let week = new Date(timeStamp).getDay();
        let weeks = ["日","一","二","三","四","五","六"];
        let getWeek = "星期" + weeks[week];
        this.currentTime = year + "年" + month + "月" + date +"日"+" "+hh+":"+mm+':'+ss +" "+getWeek  ;
      },
    initBindCameraYc() {
      let that = this;
      that.currentStep='startCamera';
      that.cameraYc = window.opener.cameraYC;
      that.cameraYc.cameraInstance(function(cbParams) {
        switch (cbParams.type) {
          case "StartTakePictureOver":
            that.currentStep='canCapture';
            console.log("自定义初始化设备完成，界面展示成功！！");
            that.sendMasssage("canJumpTo");
            that.cameraYc.Capture();
            break;
          case "TakePictureOver":
            that.currentStep='captureOver';
            console.log("自定义人脸拍照成功，返回的照片数据为:" + cbParams.collectedImage);
            let split = "PEOPLE_AND_FACE";
            that.sendMasssage("faceRecogSuccess," + cbParams.collectedImage + split + cbParams.faceImage);
            break;
          case "DeviceError":
            console.error("自定义硬件错误：" + cbParams.msg);
            that.sendMasssage("faceRecogFail," + cbParams.msg);
            break;
          default:
            console.log("自定义默认回调");
            break;
        }
      }, {
        iwidth: 960,
        iheight: 720,
        ileft: 2395,
        itop: 230
      });
    },
    //关闭摄像头，调用ocx的关闭摄像头
    closeCamera () {
      try {
        this.cameraYc.hidCameraWin();
      } catch (error) {
        console.error("关闭摄像头释放资源失败，原因：" + error)
      }
    },
    sendMasssage (data) {
      // window.opener属性是一个可读可写的属性，可返回对创建该窗口的 Window 对象的引用。
      window.opener.document.getElementById("secondReceive").value = data;
    }
  },
}
</script>
<style lang="less" scoped>

.face-recog-box {
  width: 100%;
  height: 100%;
  position: relative;
  box-sizing: border-box;
  padding: 21px 56px 34px;
  .start-camera {
    width: 768px;
    height: 768px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background-image: linear-gradient(359.28deg,#ffffff 0%,rgba(255, 255, 255, 0.8) 100%);
  }
  .face-recog-header {
        .header-title {
            font-family:Alibaba PuHuiTi;
            font-weight:700;
            color:#fffdfd;
            font-size:32px;
            line-height: 44px;
        }
        .header-time {
            line-height:35px;
            font-family:Alibaba PuHuiTi;
            color:#ffffff;
            font-size:26px;
        }
  }
    .face-recog-frame {
        width: 100%;
        height: 926px;
        margin-top: 20px;
        background-image:linear-gradient(89.77deg,#f7fafe 0%,#ffffff 100%);
        border-radius:8px;
        box-shadow:0px 4px 16px rgba(0, 0, 0, 0.06);
        padding: 34px 0;
        box-sizing: border-box;
        .frame-content{
            position: relative;
            width: 1218px;
            height: 100%;
            margin: 0 auto;
            background-color:#ebf0ff;
            border:2px solid #3b6aff;;
            border-radius:8px;
            box-shadow:0px 6px 16px rgba(1, 87, 203, 0.23);
            .objectBox {
              width: 1160px;
              height: 828px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              border-radius: 4px;
              background-image: linear-gradient(359.28deg,#ffffff 0%,rgba(255, 255, 255, 0.8) 100%);
              .success-tips {
                padding: 10px 0px;
                opacity: 0.7;
                font-size: 42px;
                font-weight: 700;
                color: #252525;
              }
              .see-down-tips {
                font-size: 26px;
                color: #666666;
              }
            }
        }
    }
  
}
.face-recog-box.noRecoged {
  background-color: #f0f3f5;
  background-size: 100% 100%;
  background-image: url('../../images/home/homeYinhe/homeMain.jpg');
}
</style>
