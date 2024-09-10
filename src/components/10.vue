<template>
    <div style="text-align: center; margin-top: 20px; font-size: 70px;">
        <div>请正视右侧摄像头</div> <!-- Move this text to the top center -->
        <div class="containerccc">
            <p class="loading" v-if="!imageData">
                加载中...
            </p>
            <img v-else :src="imageData" alt="">
        </div>
        <el-button @click="readFace">
            人脸识别
        </el-button>
    </div>
</template>


<script>
import cameraYc from '../device/changcheng/chrome/cameraYc';
export default {
    props: {
        nextClick: Number
    },
    data() {
        return {
            imageData: '',
            ifClose:1
        }
    },
    mounted() {
      this.initBindcameraYC();  
      wife.doAction("伸右手说话")  
      let signSucc = new Audio()
     signSucc.src = require("../asset/video/11.wav")
     signSucc.play()
    },
    beforeDestroy() {
        if(this.ifClose === 1)
    {
        let that = this;
        that.closeCamera()

    }
       
    },

    methods: {
        open(){
            cameraYc.openHighCamera()
        },
        hide(){
            cameraYc.hidCameraWin()

        },
        readFace() {
            let that = this;
            that.initBindcameraYC();
        },
        initBindcameraYC() {
            let that = this;
            cameraYC.cameraInstance(function (cbParams) {
                switch (cbParams.type) {
                    case "StartTakePictureOver":
                        console.log("自定义初始化设备完成，界面展示成功！！");
                        cameraYC.Capture();
                        break;
                    case "TakePictureOver":
                        console.log("自定义人脸拍照成功，返回的照片数据为:" + cbParams.collectedImage);//这里传回来两个collectedImage和faceImage，环境照和人脸照
                        that.closeCamera()
                        that.ifClose = 0
                        that.imageData = 'data:image/jpeg;base64,' + cbParams.collectedImage
                        this.$emit('approve', 'ok')
                        break;
                    case "DeviceError":
                        console.log("自定义硬件错误：" + cbParams.msg);
                        break;
                    default:
                        console.log("自定义默认回调");
                        break;
                }
            }, {
                iwidth: 700,
                iheight: 800,
                ileft: 270,
                itop: 350
            }



            );
        },
        //关闭摄像头，调用ocx的关闭摄像头
        closeCamera() {
            try {
                let that = this;
                // const cameraYC = new cameraYC();
                cameraYC.CloseConnection()
            } catch (error) {
                console.error("关闭摄像头释放资源失败，原因：" + error)
            }
        },
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

<style>

.containerccc{
    display: flex;
    font-size: 50px;
    justify-content: center;
    align-items: center;
    height :1000px;
}
</style>