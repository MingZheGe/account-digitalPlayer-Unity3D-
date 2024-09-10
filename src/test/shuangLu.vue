<template>
    <el-container style="height: 100vh; solid #eee">
    <el-aside width="15vw" style="background-color: #545c64;padding: 10px">
        <el-steps  direction="vertical" finish-status="success">
            <!--<el-step title="资料录入" icon="el-icon-edit"></el-step>-->
            <el-step title="资料录入证件信息"></el-step>
            <el-step title="资料录入基本信息"></el-step>
            <el-step title="资料录入联系信息"></el-step>
            <el-step title="资料录入关联人信息"></el-step>

            <!--<el-step title="风险测评" icon="el-icon-upload"></el-step>-->
            <el-step title="风险测评答题"></el-step>
            <el-step title="风险测评测评结果"></el-step>

            <!--<el-step title="账户信息" icon="el-icon-edit"></el-step>-->
            <el-step title="开立证券账户"></el-step>
            <el-step title="存管银行签约"></el-step>
            <el-step title="设置交易账户密码"></el-step>

            <el-step title="视频录入" icon="el-icon-picture"></el-step>
            <el-step title="证件采集" icon="el-icon-picture"></el-step>
            <el-step title="签署协议" icon="el-icon-picture"></el-step>
            <el-step title="业务提交" icon="el-icon-picture"></el-step>
        </el-steps>

    </el-aside>
    <el-container>
        <el-header style="text-align: right; font-size: 12px">
            <el-dropdown>
                <i class="el-icon-setting" style="margin-right: 15px"></i>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>查看</el-dropdown-item>
                    <el-dropdown-item>新增</el-dropdown-item>
                    <el-dropdown-item>删除</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <span>王小虎</span>
        </el-header>
        <el-main>

<div>
    <p class="promote">
          在点击“开始双录”按钮后，请大声说出下面的文字，说完后点击“结束双录”按钮。
    </p>
    <div style="border: 1px solid #ccc; padding: 10px; margin-top: 20px; margin-bottom: 100px; display: flex;
font-size: 23px;
justify-content: center;
align-items: center;
height :300px;">
                    <p>我已知晓所有风险可能，同意所有协议，我填写的信息准确无误</p>
                </div>

                <div style="display: flex; justify-content: center; margin-top: 20px;">
                    <el-button @click="doubleRecord">开始双录</el-button>
                    <el-button @click="endRecord" style="margin-left: 10px;">结束双录</el-button>
                </div>

                <div v-if="showVideo" style="display: flex; justify-content: center; margin-top: 20px;">
                    <video v-if="videoData" controls :src="videoData"></video>
                </div>

</div>

</el-main>
    </el-container>
</el-container>
</template>

<script>
export default {
data() {
    return {
        videoData: '',
        // Set the default camera type to "环境摄像头"
        cameraType: '环境摄像头',
        showVideo: false
    }
},
methods: {
    doubleRecord() {
        let that = this;
        //绑定回调事件
        that.initBindCamera();
    },
    //绑定回调事件
    initBindCamera () { 
        let that = this;
        let baseParams = {
            // 摄像头编号 0 环境摄像头  1 双目摄像头
            index: that.index,
            // 操作类型 0 开始  1 结束
            actionNum: 0,
            // 是否录音 0 不录音 1 录音
            wAudioOption: 1,
            // 视频保存路径
            lpszRecordFile: "D:/KIOSK/Camera/record.mp4",
            // 水平像素
            wHpixel: 640,
            // 垂直像素
            wVpixel: 480,
            // 帧率
            wFps: 15,
            // 位置宽高
            iwidth: 737,
            iheight: 677,
            ileft: 2146,
            itop: 215
        };
        camera.cameraInstance(function(cbParams) {
            switch (cbParams.type) {
                case "OpenDisplayOver":
                    console.log("打开预览窗口!!")
                    // 预览窗口打开完成后开始播放
                    that.startRecord();
                    break;
                case "CloseDisplayOver":
                    console.log("关闭预览窗口成功!!")
                    break;
                case "StartVideoRecordOver":
                    console.log("开始录制视频回调事件")
                    break;
                case "StopVideoRecordOver":
                    console.log("结束视频录制回调事件")
                    // 将数据传回下屏
                    console.log("获取到的视频base64: " + cbParams.data);
                    // 结束录制 关闭预览窗口及连接
                    that.videoData = 'data:video/mp4;base64,' + cbParams.data
                    //that.closeVideo();
                    break;
                case "DeviceError":
                    break
                default:
                    console.log("走了默认的事件");
                    break;  
            }
        }, baseParams);
    },
    // 录制
    startRecord() {
        let that = this;
        console.log("启动录制了");
        try {
            camera.startVideoRecord();
        } catch(err) {
            console.log("启动录制失败");
        }
    },
    endRecord() {
        this.stopRecord();
    },
    // 停止录制
    stopRecord() {
        let that = this;
        this.showVideo = true;
        try {
            console.log("结束录制");
            camera.stopVideoRecord();
        } catch(err) {
            console.log("结束录制失败");
        }
    },
    closeVideo () {
        let that = this;
        try {
            camera.hidCameraWin();
        } catch (err) {
            console.error('停止视频录制' + err)
        }
    },
}
}
</script>
<style>

.promote{
display: flex;
font-size: 23px;
justify-content: center;
align-items: center;
height :300px;
}

.el-button{

justify-content: center;
align-items: center;

}
</style>