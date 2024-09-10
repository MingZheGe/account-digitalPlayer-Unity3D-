<template>
    <div>
        <p class="promote">
            在点击“开始双录”按钮后，请大声说出下面的文字，说完后点击“结束双录”按钮。
        </p>
        <div class="text-container">
            <p>我已知晓所有风险可能，同意所有协议，我填写的信息准确无误</p>
        </div>

        <div class="button-container">
            <el-button @click="doubleRecord">开始双录</el-button>
            <el-button @click="endRecord" style="margin-left: 10px;">结束双录</el-button>
        </div>

        <div v-if="showVideo" class="video-container">
            <video ref="myVideo" controls :src="videoBlobUrl" @loadedmetadata="onVideoLoaded"></video>
        </div>
    </div>
</template>
    
<script>
export default {
    props: {
        nextClick: Number
    },
    data() {
        return {
            videoLoaded: false, // 标记视频是否加载完成
            videoBlobUrl: '',
            cameraType: '环境摄像头',
            showVideo: false
        }
    },
    methods: {
        doubleRecord() {
            this.initBindCamera();
        },
        initBindCamera() {
            let that = this;
            let baseParams = {
                index: 0,
                actionNum: 0,
                wAudioOption: 1,
                lpszRecordFile: "D:/KIOSK/Camera/record.mp4",
                wHpixel: 640,
                wVpixel: 480,
                wFps: 15,
                iwidth: 737,
                iheight: 677,
                ileft: 2146,
                itop: 215
            };
            camera.cameraInstance(function (cbParams) {
                switch (cbParams.type) {
                    case "OpenDisplayOver":
                        that.startRecord();
                        break;
                    case "StopVideoRecordOver":
                        that.convertBase64ToBlob(cbParams.data);
                        break;
                    case "DeviceError":
                        console.error("设备错误：" + cbParams.msg);
                        break;
                    default:
                        console.log("默认回调事件");
                        break;
                }
            }, baseParams);
        },
        onVideoLoaded() {
            console.log("加载完了")
      this.videoLoaded = true;
    },
        startRecord() {
            try {
                camera.startVideoRecord();
            } catch (err) {
                console.error("启动录制失败：" + err);
            }
        },
        endRecord() {
            this.stopRecord();
        },
        stopRecord() {
            this.showVideo = true;
            try {
                camera.stopVideoRecord();
            } catch (err) {
                console.error("结束录制失败：" + err);
            }
        },
        // 在 convertBase64ToBlob 方法中添加对 base64Data 的有效性检查和调试信息输出
        convertBase64ToBlob(base64Data) {
            try {
                if (!base64Data || typeof base64Data !== 'string') {
                    throw new Error('Invalid base64Data');
                }
                const byteString = atob(base64Data); // 解码
                // 将解码后的字符串转换为 ArrayBuffer
                const mimeString = 'video/mp4';
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                const blob = new Blob([ab], { type: mimeString });
                this.videoBlobUrl = URL.createObjectURL(blob);
            } catch (err) {
                console.error("转换 base64 数据失败：" + err);
                console.log("Invalid base64Data:", base64Data); // 输出 base64Data 进行调试
            }
        }

    },
    mounted() {
        let signSucc = new Audio();
        signSucc.src = require("../asset/video/17.wav");
        signSucc.play();
    },
    watch: {
        nextClick: {
            handler(newVal, oldVal) {
                this.$emit('approve', 'ok');
            },
            deep: true
        }
    }
}
</script>
    
<style>
.promote {
    display: flex;
    font-size: 23px;
    justify-content: center;
    align-items: center;
    height: 300px;
}

.text-container {
    border: 1px solid #ccc;
    padding: 10px;
    margin-top: 20px;
    margin-bottom: 100px;
    display: flex;
    font-size: 23px;
    justify-content: center;
    align-items: center;
    height: 300px;
}

.button-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.video-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
</style>
    