<template>
  <div class="container">
    <p class="scan-instruction" v-if="showInstructionText">
      请扫描:居民身份证
    </p>
    <p class="scan-instructions" v-if="showInstructionText">
      (请将证件横向放入扫描箱)
    </p>
    <div class="image-container" v-if="showText">
      <p class="text-center">{{ instructionText }}</p>
    </div>
    <div class="camera-wrapper" v-if="showText">
      <video ref="video" autoplay></video>
    </div>

    <img :src="imageData" alt="">


    <div v-if="showText" class="button-container">
      <el-button @click="openDevice">
        开启摄像头
      </el-button>
      <el-button @click="show">
        重拍
      </el-button>
      <el-button @click="hide">
        关闭摄像头
      </el-button>
      <el-button @click="startScan">
        拍照
      </el-button>
      <el-button @click="endScan">
        拍照完成
      </el-button>
    </div>
    <div class="images-container" v-if="!showText">
      <div class="image-container">
        <img :src="frontData" alt="Front Image" @click="toggleImagesAndText('front')" />
      </div>
      <div class="image-container">
        <img :src="backData" alt="Back Image" @click="toggleImagesAndText('back')" />
      </div>
    </div>
  </div>
</template>



<script>

import siuModule from '../device/changcheng/chrome/siu';
import { idCardPhoto } from '../util/connect'

export default {
  props: {
        nextClick: Number
    },
  data() {
    return {
      showText: false,
      showInstructionText: true,
      instructionText: "请将身份证正面向上放入扫描箱",
      iwidth: 700,
      iheight: 1000,
      itop: 250,
      ileft: 250,
      vtmImageResrtictPos: {},
      imageData: '',
      whichOne: '',
      frontData: require('../asset/image/front.jpg'),
      backData: require('../asset/image/back.jpg')
    };
  },
  methods: {
    toggleImagesAndText(type) {
      if (type === 'front') {
        this.showText = true;
        this.whichOne = "front";
        this.showInstructionText = false;
        this.instructionText = "请将身份证正面正面向上放入扫描箱";
        let that = this;
        that.initBindHighcamera();//高拍仪自己调siu
        console.log("开始siu")
        siuModule.init();
      } else if (type === 'back') {
        this.showText = true;
        this.whichOne = "back";
        this.showInstructionText = false;
        this.instructionText = "请将身份证背面正面向上放入扫描箱";
        let that = this;
        that.initBindHighcamera();//高拍仪自己调siu
        console.log("开始siu")
        siuModule.init();
      }
    },
    openDevice() {


      let that = this;
      that.initBindHighcamera();//高拍仪自己调siu
      console.log("开始siu")
      siuModule.init();

      // siu.ControlGuideLightSync(3, 4, 0);//siu模块还控制所有指示灯,3表示高拍仪，128表示持续往里传他自己会变成128，然后不用调
    },
    startScan() {
      highcamera.Capture();
      highcamera.destroyHighCamera();
    },
    endScan() {
      highcamera.destroyHighCamera();
      this.showText = false;
      this.showInstructionText = true;
      if (this.whichOne == "front") {
        this.frontData = this.imageData;
      } else {
        this.backData = this.imageData;
      }
      this.imageData = '';

    },
    show() {
      highcamera.showHighCamera();
      this.imageData = '';
    },
    hide() {
      highcamera.hidCameraWin();
    },
    initBindHighcamera() {
      let that = this;
      let param = {
        iwidth: that.iwidth,
        iheight: that.iheight,
        itop: that.itop,
        ileft: that.ileft,
        RWidth: that.vtmImageResrtictPos.RWidth || 600,
        RHeight: that.vtmImageResrtictPos.RHeight || 900,
        RX: that.vtmImageResrtictPos.RX || 0,
        RY: that.vtmImageResrtictPos.RY || 0,
      };

      highcamera.HighCameraInstance(function (cbParams) {
        switch (cbParams.type) {
          case "StartTakePictureOver":
            console.log("Start taking picture event completed.");
            // Handle logic after taking picture
            break;
          case "GetPictureSyncOver":
            if (cbParams.result === "0") {
              console.log("Picture captured successfully:", cbParams.collectedImage);
              console.log("出不来了")
              if (that.whichOne == "front") {
                console.log("发送")
                idCardPhoto("1", "Fo", "idFront", "", cbParams.collectedImage, "");//localStorage.getItem("UserId")
              } else {
                console.log("发送")
                idCardPhoto("1", "Be", "idFront", "", cbParams.collectedImage, "");//localStorage.getItem("UserId")
              }

              // Resize image logic
              let img = new Image();
              img.onload = function () {
                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext('2d');
                canvas.width = 800; // Set your desired width
                canvas.height = 450; // Set your desired height
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                let resizedImageData = canvas.toDataURL('image/jpeg'); // or 'image/png'

                // Update imageData state
                that.imageData = resizedImageData;
              };
              img.src = 'data:image/jpeg;base64,' + cbParams.collectedImage;
            
            } else {
              console.error("Failed to capture picture.");
              // Handle error condition
            }
            break;
          case "DeviceError":
            console.error("Device error:", cbParams.msg);
            break;
          default:
            console.log("Default case reached.");
            break;
        }
      }, param);
    }

  },
  mounted() {
    //   this.initHardare();

    //userId,fileType, fileName,fileId,fileContext,fileState
    console.log("userid")
    console.log(localStorage.getItem("UserId"))
    wife.doAction("伸右手说话")
    // idCardPhoto("1","Fo","idFront","","0","");//localStorage.getItem("UserId")
    let signSucc = new Audio()
     signSucc.src = require("../asset/video/12.wav")
     signSucc.play()

  },
  watch: {
        nextClick: {
            handler(newVal, oldVal) {
                this.$emit('approve', 'ok')
            },
            deep: true
        }
    }
}

</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  flex-direction: column;
  /* Arrange items in a column */
}

.scan-instruction {
  font-size: 50px;
  text-align: center;
  margin-bottom: 20px;
}

.scan-instructions {
  font-size: 50px;
  text-align: center;
  margin-bottom: 100px;
}

.images-container {

  justify-content: center;
  align-items: center;
}

.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 100px;
  /* Add some margin between images */
}

.image-container img {
  width: 600px;
  height: 350px;
  cursor: pointer;
}

.text-center {
  position: static;
  top: 20%;
  left: 13%;
  right: 0;
  text-align: center;
  /* Center text horizontally */
  font-size: 50px;
  margin: 0;
}

.camera-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  /*width: 40%; /* Set width to 40% of the container */
  /*height: 40%; /* Set height to 40% of the container */
}

.camera-wrapper video {
  width: 100%;
  /* Let the video fill its parent container */
  height: 100%;
  /* Let the video fill its parent container */
  object-fit: cover;
  /* Keep video aspect ratio and fill the area */
}

.button-container {
  margin-top: auto;
  /* Push the buttons to the bottom */
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 200px;
  /* Optional: Add some space above the buttons */
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
