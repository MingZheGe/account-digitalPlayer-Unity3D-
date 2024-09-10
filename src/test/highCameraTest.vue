<template>
    <div >
        <img :src="imageData" alt="">
        高拍仪
      <el-button @click="openDevice">
            开启
        </el-button> 
        <el-button @click="show">
            展示
        </el-button>
        <el-button @click="hide">
            隐藏
        </el-button>
        <el-button @click="startScan">
            开始拍照
        </el-button>
        <el-button @click="endScan">
            拍照完成
        </el-button>
        
    </div>
</template>
<script>

import siuModule from '../device/changcheng/chrome/siu';
var digitalPlayer;

export default {
    data() {
        return {
            iwidth: 520,
            iheight: 690,
            itop: 0,
            ileft: 0,
            vtmImageResrtictPos: {},
            imageData: ''
        }
    },
    methods: {
     
        openDevice() {
            //console.log(wife)
           // wife.turnRight()//这是数字人老婆
            /*
            
            var digitalPlayer;
  console.log("主")
  if(!digitalPlayer){
				DigitalPlayer.init("digitalPlayer", "unityContainer", null, function (instance) {
					digitalPlayer = instance;
					console.log(digitalPlayer);
				});
			}
    window.digitalPlayer = digitalPlayer;
            if(digitalPlayer){
				console.log(digitalPlayer)
				digitalPlayer.turnRight();
			}
               */ 
            
           // console.log(digitalService)
     
            //DigitalPlayer.doAllAction();
          //  digitalPlayer.doAllAction()
            
            let that = this;
            that.initBindHighcamera();//高拍仪自己调siu
            console.log("开始siu")
            siuModule.init();
            
           // siu.ControlGuideLightSync(3, 4, 0);//siu模块还控制所有指示灯,3表示高拍仪，128表示持续往里传他自己会变成128，然后不用调
        },
        startScan() {
            highcamera.Capture();
        },
        endScan() {
            highcamera.destroyHighCamera();
        },
        show() {
            highcamera.showHighCamera();
        },
        hide() {
            highcamera.hidCameraWin();
        },
        initBindHighcamera() {
            let that = this;
            try {
                let param = {
                    iwidth: that.iwidth,
                    iheight: that.iheight,
                    itop: that.itop,
                    ileft: that.ileft,
                    RWidth: that.vtmImageResrtictPos.RWidth || 675, //690
                    RHeight: that.vtmImageResrtictPos.RHeight || 900, //900
                    RX: that.vtmImageResrtictPos.RX || 0,
                    RY: that.vtmImageResrtictPos.RY || 0,
                };
                highcamera.HighCameraInstance(function (cbParams) {
                    switch (cbParams.type) {
                        case "StartTakePictureOver":
                            console.log("开始拍照事件完成了");
                            that.StartTakePictureOver();
                            break;
                        case "StartDisplayBOver":
                            console.log("打开限定框完成");
                            break;
                        case "StopTakePictureOver":
                            console.log("关闭高拍仪窗口成功");
                            console.log("外传的停止关闭高拍仪");
                            break;
                        case "GetPictureSyncOver":
                            if (cbParams.result == "0") {
                                console.log("这里是结果")
                                console.log(cbParams.collectedImage);
                                that.imageData = 'data:image/jpeg;base64,' + cbParams.collectedImage
                            } else {
                                that.alert("拍照失败");
                            }
                            break;
                        case "DeviceError":
                            console.log("拍照失败" + cbParams.msg);
                            break;
                        default:
                            console.log("走了默认的事件");
                            break;
                    }
                }, param);
            } catch (err) {
                console.error("高拍仪初始化失败:" + err);
            }
        }
    },
    mounted() {
     //   this.initHardare();
     
        
       
    },
}
</script>