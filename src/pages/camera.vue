<template>
    <div>
        人脸识别
       <el-button @click="readFace">
            人脸识别
        </el-button>
    </div>
</template>

<script>
import cameraYC from "../device/changcheng/chrome/cameraYc.js";

export default {
    data() {
        return {
        }
    },
    mounted() {
        this.initBindCameraYc();  
    },
    beforeDestroy() {
        this.closeCamera();
    },
    methods: {
        readFace() {
            let that = this;
            that.initBindCameraYc();
        },
        initBindCameraYc() {
            let that = this;
            const camerayc = new cameraYC();
            camerayc.cameraInstance(function(cbParams) {
            switch (cbParams.type) {
                case "StartTakePictureOver":
                    console.log("自定义初始化设备完成，界面展示成功！！");
                    camerayc.Capture();
                    camerayc.CloseConnection()
                    break;
                case "TakePictureOver":
                    console.log("自定义人脸拍照成功，返回的照片数据为:" + cbParams.collectedImage);
                    that.closeCamera()
                    break;
                case "DeviceError":
                    console.log("自定义硬件错误：" + cbParams.msg);
                    break;
                default:
                    console.log("自定义默认回调");
                    break;
                }
            }, {
                iwidth: 1000,
                iheight: 1000,
                ileft: 50,
                itop: 250
            }

    
           
        );
        },
        //关闭摄像头，调用ocx的关闭摄像头
        closeCamera () {
            try {
                let that = this;
                const camerayc = new cameraYC();
                camerayc.CloseConnection()
            } catch (error) {
                console.error("关闭摄像头释放资源失败，原因：" + error)
            }
        },
    } 
}
</script>

<style>

</style>