<template>
    <div class="statement-record">
        <div class="title-box">
            <div class="current-tip">
                <div class="statement-tip">正在录制：{{currentTip}}</div>
                <div class="statement-icon">
                    <img :src="downImg" alt="">
                </div>
            </div>
            <div class="next-tip" v-if="hasNext">
                <div class="statement-tip">下一个：{{nextTip}}</div>
            </div>
        </div>
        <div class="contenct">
            <div class="voiceStep">
                <div class="statement-tip-step">
                  请用标准普通话准确朗读以下明内容
                </div>
                <div class="statement-icon-step">
                    <img :src="downImg" alt="">
                </div>
            </div>
            <div class="recordContent">
                <div class="recordBox">
                    <div class="deviceBg"></div>
                </div>
                <div class="recordText">
                    <div class="textContent">
                        <div class="textInfo">
                        <p class="text_content" v-html="htmlText"></p>
                        </div>
                    </div>
                    <div class="textFooter">
                        若已录制完成，请点击下方屏幕的<span>【录制完成】</span>按钮
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash'
import sysConfig from "../../config/sysConfig"
import { readFileBase64 } from "../../device/changcheng/chrome/localApi";
import { checkImageStatus } from "../../service/image-service";
import storage from "../../tools/storage";
import defineConfig from '../../config/defineConfig';
export default {
    data() {
        return {
            downImg: require("@icons/yinheVTM/imageNode/record/icon-record-downarrow-small.svg"),
            htmlText: '',
            camera: {},
            hasNext: false,
            currentTip: '',
            nextTip: '',
            reRecord: false,
            grabTimer: null,
        }
    },
    props: [
      "orderType", 
      "voiceText", 
      "voiceInfoObj", 
      "voiceList", 
      "voiceIndex", 
      "getMessageNum",
      "qualityControl",
      "custInfo",
      "videoName"
    ],
    watch: {
      getMessageNum: function () {
        // 停止录制 结束录制 
        if (this.orderType == "endRecord") {
          this.reset();
          this.$emit("closeSingleView");
        } 
        // 重新录制
        else if (this.orderType == "reRecord") {
          // 1. 重新连接打开窗口
          this.reRecord = true;
          // 2. 关闭所有调用
          this.reset();
        }
      },
    },
    mounted() {
      let that = this;
      that.htmlText = that.voiceText;
      that.currentTip = that.voiceInfoObj.title;
      if (!_.isEmpty(that.voiceList[that.voiceIndex + 1])) {
        that.hasNext = true;
        that.nextTip = that.voiceList[that.voiceIndex + 1].title;
      }
      window.utyDevice = window.opener.utyDevice;
      // 1. 进入页面 打开摄像头连接 打开摄像头连接
      that.initBindCamera();
    },
    methods: {
      // 关闭所有调用
      reset() {
        if (this.grabTimer) {
          clearInterval(this.grabTimer)
        }
        setTimeout(() => {
          // 1. 停止录制 并关闭窗口
          this.stopRecord();
        }, 500)
      },
      // 停止录制
      stopRecord() {
          let that = this;
          try {
              console.log("结束录制");
              that.camera.stopVideoRecord();
          } catch(err) {
              console.error("结束录制失败");
          }
      },
      startSetGrab() {
        // 开启截图
        setTimeout(() => {
          // 每隔10s截一次图
          this.grabTimer = setInterval(() => {
            this.camera.setGrab()
          }, 6000);
        }, 2000);
      },
      initBindCamera() {
        let that = this;
        that.camera = window.opener.camera;
        let params = that.getParams();
        that.camera.cameraInstance(function(cbParams) {
            switch (cbParams.type) {
                case "OpenDisplayOver":
                    console.log("打开预览窗口!!")
                    // 预览窗口打开完成后开始播放
                    that.openRecord();
                    break;
                case "CloseDisplayOver":
                    console.log("关闭预览窗口成功!!")
                    break;
                case "StartVideoRecordOver":
                    that.reRecord = false;
                    if (that.qualityControl == "1") {
                      that.startSetGrab();
                    }
                    // 1. 此时设置客户可以点击录制按钮进行录制  或者 直接开始录制
                    that.sendMasssage("canRecord");
                    break;
                case "StopVideoRecordOver":
                    if (that.reRecord) {
                      that.initBindCamera();
                    } else {
                      // 将数据传回下屏
                      console.log("获取到的视频base64: " + JSON.stringify(cbParams.data));
                      // 如果是 结束录制  则提交数据
                      if (that.orderType == "endRecord") {
                        that.sendMasssage("recordOver");
                      }
                    }
                    break;
                case "SetGrabOver":
                    that.sendMessageGrab("setGrabOver");
                    break;
                case "DeviceError":
                    that.sendMasssage("deviceError,"+ cbParams.msg);
                    console.log("视频录制DeviceError:" + JSON.stringify(cbParams));
                    break
                default:
                    console.log("走了默认的事件");
                    break;  
            }
        }, params);
      },
      // 开启录制
      openRecord() {
          let that = this;
          console.log("启动录制了");
          try {
              that.camera.startVideoRecord();
          } catch(err) {
              console.error("启动录制失败");
          }
      },
      getParams() {
        let that = this;
        let baseParams = {
              // 摄像头编号
              index: 1,
              // 操作类型 0 开始  1 结束
              actionNum: 0,
              // 是否录音 0 不录音 1 录音
              wAudioOption: 1,
              // 视频保存路径
              lpszRecordFile: "D:/KIOSK/Camera/" + that.videoName,
              // 水平像素
              wHpixel: 640,
              // 垂直像素
              wVpixel: 480,
              // 帧率
              wFps: 15,
              // 位置宽高
              iwidth: 777,
              iheight: 677,
              ileft: 2136,
              itop: 235
        }
        let params = {};
        params = Object.assign({}, baseParams, {
          index: 1,
          // 位置宽高
          iwidth: 777,
          iheight: 667,
          ileft: 2123,
          itop: 235
        })
        return params;
      },
      sendMasssage (data) {
        console.log("录制向下屏发送的数据----" + data);
        // 如果在之前已经存在了数据 则不再进行覆盖， 保证每个值都会被传到下屏
        if (window.opener.document.getElementById("secondReceive").value != '') {
          return;
        }
        // window.opener属性是一个可读可写的属性，可返回对创建该窗口的 Window 对象的引用。
        window.opener.document.getElementById("secondReceive").value = data;
      },
      // 质检请求发送数据
      sendMessageGrab(data) {
        this.checkRecordStatus();
      },
      // 质检
      async checkRecordStatus() {
        let that = this;
        let picVal = await readFileBase64("D:/KIOSK/Camera/grab.jpg")
        return checkImageStatus({
          CUST_NAME: that.custInfo.CUST_NAME,
          ID_CODE: that.custInfo.ID_CODE,
          CUST_CODE: that.custInfo.CUST_CODE,
          ID_TYPE: that.custInfo.ID_TYPE,
          IMG_PHOTO1: picVal.data, // 现场照
        }).then(res => {
          // 过程中如果出现了遮挡人脸
          let item = res.Data[0];
          if (item.ERROR_CODE === "0" && item.RESULT_LIST) {
            let resObj = item.RESULT_LIST[0],num = 0;
            _.each(resObj.DIFF, function(subDiff){
                let isPass = subDiff.IS_PASS === "1";
                if(!isPass){
                  // 不合格 
                  that.$message({
                    customClass:"toast",
                    center: true,
                    offset: "22",
                    duration: "8000",
                    type: 'warning',
                    message: "请保持在画面中，不要戴口罩、墨镜等面部遮挡物！"
                  });
                }else{
                  num++;
                }
            });
          } else {
            // 不合格
            that.$message({
              customClass:"toast",
              center: true,
              offset: "22",
              duration: "8000",
              type: 'warning',
              message: "请保持在画面中，不要戴口罩、墨镜等面部遮挡物！"
            });
          }
        }).catch(err => {
          console.error("质检失败")
          console.error(err);
        })
      }
    },
    beforeDestroy () {
      this.reset();
    }
}
</script>

<style lang="less">
.el-message--warning.toast {
  font-size: 35px;
  .el-message__content {
    font-size: 35px;
  }
}
.statement-record {
    position: relative;
    width: 100%;
    height: 100%;
    .title-box {
      width: 94%;
      margin: 0 auto;
      display: flex;
      height: 90px;
      .current-tip {
        display: flex;
        .statement-tip {
          font-family: Alibaba PuHuiTi;
          font-weight: 700;
          color: #fffdfd;
          font-size: 32px;
          line-height: 90px;
        }
        .statement-icon {
          img {
            height: 105px;
          }
        }
      }
      .next-tip {
        .statement-tip {
          opacity: 0.7;
          width: 307px;
          height: 33px;
          font-family: Alibaba PuHuiTi;
          color: #fffdfd;
          font-size: 24px;
          line-height: 90px;
        }
      }
    }


    .contenct{
        width: 94%;
        margin: 0 auto;
        background: white;
        border-radius: 4px;
        height: 84%;
        .voiceStep {
          width: 1804px;
          margin: 0 auto;
          box-shadow: 0px 5px 5px gray;
          margin-bottom: 5px;
          height: 60px;
          line-height: 60px;
          display: flex;
          justify-content: center;
          .statement-tip-step {
            font-family: Alibaba PuHuiTi;
            color: #eb6e20;
            font-size: 28px;
          }
          .statement-icon-step {
            img {
              height: 70px;
            }
          }
        }
    }
    .recordContent {
    width: 100%;
    height: 837px;
    margin: 0 auto;
    background: white;
    border-radius: 4px;
    display: flex;
    .recordBox {
      width: 52%;
      height: 752px;
      margin-top: 30px;
      margin-right: 25px;
      margin-left: 44px;
      background-color: #ebf0ff;
      border-radius: 4px;
      position: relative;
      border: 2px solid #86b5f0;
      .deviceBg {
        background-color: rgb(70, 69, 74);
        width: 89%;
        height: 90%;
        position: absolute;
        top: 36px;
        left: 60px;
        border-radius: 4px;
      }
    }
    .recordText {
      width: 42%;
      margin-top: 30px;
      .textHeard {
        display: flex;
        font-size: 24px;
        margin-top: 10px;
        .icon {
          padding-right: 11px;
        }
        .currentText{
          padding-right: 14px;
        }
        .currentTitle {
          color: #606060;
        }
      }
      .textContent {
        height: 695px;
        background-color:#f7f7fa;
        border-radius: 4px;
        .textInfo {
          //width: 100%;
          text-indent: 50px;
          font-size: 30px;
          line-height: 40px;
          padding-top: 30px;
          padding-left: 30px;
          padding-right: 20px;
          color:#222222;
          p {
            height: 500px;
            margin: 0;
            padding: 0;
            overflow-y: scroll;
            overflow-y: hidden;
            span {
              color: rgb(131, 0, 0);
              font-size: 30px;
            }
          }
        }
      }
      .textFooter {
        width: 757px;
        height: 50px;
        margin-top: 5px;
        background-color: #ffffff;
        border: 1px solid;
        border-color: #eaeaea;
        border-radius: 4px;    
        font-family:Alibaba PuHuiTi;
        color:#252525;
        font-size:24px;
        text-align: center;
        line-height: 50px;
        span {
          color:#1f59db;
        }
      }
    }
  }
}
</style>