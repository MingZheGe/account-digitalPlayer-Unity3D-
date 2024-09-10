<template>
  <div class="singleAnychatBox">
    <div class="signBox" v-if="isSignVideo">
      <div id="recordVideo">
        <div class="up-heard-tips">即将进行签名视频录制，请<span class="blur">摘下口罩、帽子等面部遮挡物并抬头注视上方摄像头</span>后再进行签字</div>
        <div class="recordBox">
          <div class="deviceBg"></div>
        </div>
      </div>
    </div>
    <div class="headerContent" v-else>
      <div class="title">视频录制</div>
      <div class="currentDate">{{currentTime}}</div>
    </div>
    <div class="contenct" v-if="!isSignVideo">
      <div class="voiceStep">
        <div class="step" v-for="(item, index) in voiceList" :key="index">
          <div class="title" :class="(index + 1) <= voiceIndex ? 'success' : ''">{{index + 1}}、{{item.TMPL_NAME}}</div>
          <div class="img" v-if="index != voiceList.length - 1">
            <img :src="(index + 1) < voiceIndex ? activiteStep : waitStep" alt="">
          </div>
        </div>
      </div>
      <div class="recordContent">
        <div class="recordBox">
          <div class="deviceBg"></div>
        </div>
        <div class="recordText">
          <div class="textHeard">
            <div class="icon">
              <img :src="speaker" alt="">
            </div>
            <div class="currentText">正在播放</div> 
            <div class="currentTitle">{{voiceIndex + "." +voiceInfoObj.TMPL_NAME}}</div>
          </div>
          <div class="textContent">
            <div class="textInfo">
              <p class="text_content" v-html="htmlText"></p>
            </div>
          </div>
          <div class="textFooter" v-show="showAnswer">
            <!-- <div class="chooseTips">请在下方屏幕做出选择</div>
            <div class="imgDown"><img src="../../icons/common/yarrow_down.gif" alt /></div> -->
            <div class="choose-box">
              <div class="title">请在<b>指定时间</b>内<b>大声</b>回答:</div>
              <div class="choose-content">
                  <div class="choose-yes">是</div>
                  <div class="choose-or">或</div>
                  <div class="choose-no">否</div>
              </div>
            </div>
            <div class="choose-tips">
              <template v-if="answerSecond <= 0">
                <!-- 回答后在下方屏幕点击<span class="choose-next">{{voiceIndex == voiceList.length ? '【录制完成】' : '【下一题】'}}</span> -->
                语音识别中，请稍后...
              </template>
              <template v-else>
                请在<span class="choose-next">{{answerSecond}}</span>秒范围内回答完成
              </template>
            </div>
          </div>
        </div>
      </div>  
    </div>
    <div class="friendly-tips-box" v-if="showFriendly">
      <div class="friendly-tips">
          <div class="friendly-tips-title">即将进行双录视频录制，请特别注意：</div>
          <div class="friendly-tips-item">
            <img :src="attention1">
            <div class="friendly-tips-item-content"><div>双录过程需客户单人入境，工作人员不得一同入境参与视频录制</div></div>
          </div> 
          <div class="friendly-tips-item" style="margin-top: 14px;">
            <img :src="attention2">
            <div class="friendly-tips-item-content"><div>工作人员在双录过程中，请勿提示客户作答</div></div>
          </div> 
      </div>
    </div>
  </div>
</template>

<script>
import definecfg from "../../config/defineConfig.js";
import baseConfig from '../../config/baseConfig';
import { createVoice, stopPlayVoice, justPlayVoice, getVoiceLength, clearVoiceFile } from "../../device/voice/voice";
import sysConfig from "../../config/sysConfig"
import { readFileBase64, stopVoice, startVoice } from "../../device/changcheng/chrome/localApi";
import { checkImageStatus } from "../../service/image-service";
import storage from "../../tools/storage";
import defineConfig from '../../config/defineConfig';

export default {
  props: [
    "orderType", 
    "voiceText", 
    "voicePath", 
    "getMessageNum", 
    "anychatParam", 
    "userCode", 
    "isRecord", 
    "isLoginOut", 
    "showType", 
    "signBackgroundImg", 
    "busiDataParam", 
    "recordNode", 
    //"doubleRecordSetting", 
    "voiceInfoObj", 
    "voiceIndex",
    "voiceList",
    "showButtonFlag",
    "qualityControl",
    "custInfo",
    "videoName"
  ],
  created () {
  },
  data () {
    return {
      activiteStep: require("../../icons/yinheVTM/upscreen/icon-upscreen-step1.svg"),
      waitStep: require("@icons/yinheVTM/upscreen/icon-upscreen-step2.svg"),
      speaker: require("@icons/yinheVTM/upscreen/icon-upscreen-speaker.svg"),
      attention1: require("@icons/yinheVTM/upscreen/icon-vedio-attention1.svg"),
      attention2: require("@icons/yinheVTM/upscreen/icon-vedio-attention2.svg"),
      voiceTimer: null,
      voiceTimerScroll: null,
      answerSecondInterval: null,
      videoDeviceList: [],
      camera: null, // 摄像头实例
      currentTime: '',
      htmlText: '',
      // 用于判断离开界面是否需要 关闭摄像头
      needStopCamera: false,
      // 中断 创建语音递归
      breakTimer: false,
      grabTimer: null,
      // 用于判断是否重新录制
      reRecord: false,
      answerSecond: 5,
      showAnswer: false,
      showFriendly: false,
    }
  },
  components: {
  },
  mounted () {
    let that = this;
    that.timeFormate(new Date());
    that.timerInt = setInterval(()=>{
      that.timeFormate(new Date());
    }, 1000);
    window.utyDevice = window.opener.utyDevice;
    // 1. 进入页面 打开摄像头连接 打开摄像头连接
    that.initBindCamera();
  },
  beforeDestroy () {
    if (this.needStopCamera) {
      this.reset();
    }
  },
  computed: {
    isSignVideo () {
      return this.recordNode == "formSign";
    },
  },
  watch: {
    getMessageNum: function () {
      // 结束录制 
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
      } else if (this.orderType == "closeSingleView") {
        this.$emit("closeSingleView");
      }
    },
    voiceText: function (val) {
      let that = this;
      // 加这个判断可能由于 签名录制时走这个内容导致报错
      if (val && !this.reRecord) {
        that.htmlText = val.replace(/\[n[012]\]/g,"");
        if (that.answerSecondInterval) {
          clearInterval(that.answerSecondInterval);
        }
        that.$nextTick(() => {
          that.scrollText();
          that.playVoiceStip(val);
        })
      }
    }
  },
  methods: {
    clear() {
      if (this.voiceTimerScroll) {
        clearInterval(this.voiceTimerScroll);
      }
      if (this.answerSecondInterval) {
        clearInterval(this.answerSecondInterval);
      }
      if (this.voiceTimer) {
        clearTimeout(this.voiceTimer);
      }
      if (this.grabTimer) {
        clearInterval(this.grabTimer)
      }
      this.answerSecondInterval = null;
      this.voiceTimerScroll = null;
      this.voiceTimer = null;
    },
    // 关闭所有调用
    reset() {
      // 是否中断 计时器的调用
      this.breakTimer = true;
      this.needStopCamera = false;
      this.showAnswer = false;
      this.clear();
      !this.isSignVideo && stopPlayVoice();
      setTimeout(() => {
        //console.log("reset----clearVoiceFile")
        //!this.isSignVideo && clearVoiceFile();
        // 1. 停止录制 并关闭窗口
        this.stopRecord();
      }, 500)
    },
    scrollText() {
      let that = this;
      let textContent = document.getElementsByClassName("text_content");
      if (that.voiceTimerScroll) {
        clearInterval(that.voiceTimerScroll);
      }
      textContent[0].scrollTop = 0;
      let domscroll = -100;
      that.voiceTimerScroll = setInterval(() => {
        //console.log("textcontent[0]", textContent[0])
        if (textContent[0].scrollTop + textContent[0].offsetHeight <= textContent[0].scrollHeight) {
          domscroll = domscroll + 9;
          textContent[0].scrollTop = domscroll;
        } else {
          clearInterval(that.voiceTimerScroll);
        }
      }, 1000);
    },
    playVoiceStip(text) {
      let that = this;
      let texts = text.match(/[^；。]+[；。]?|[；。]/g);
      _.remove(texts, item => {
        return item === " " || item === "" || item === "\r\n"
      })
      let count = 0;
      that.playVoiceTips(texts, count);
    },
    playVoiceTips(texts, count) {
      let that = this;
      // 停止录制了则不再进行创建和播放
      // 已经创建
      console.log("playVoiceTips----createVoice")
      createVoice(texts[count], function(voice) {
        let nextText = texts[count].replace(/\[n[012]\]/g,"");
        if (texts[count - 1]) {
          let preText = texts[count - 1].replace(/\[n[012]\]/g,"");
          that.htmlText = that.htmlText.replace("<span>" + preText + "</span>", preText);
          that.htmlText = that.htmlText.replace(nextText, "<span>" + nextText + "</span>")
        } else {
          that.htmlText = that.htmlText.replace(nextText, "<span>" + nextText + "</span>")
        }
        console.log('--替换后的语音播放--');
        console.log(texts[count]);
        if (that.breakTimer) {
          clearVoiceFile();
          return;
        }
        console.log(texts[count]);
        if (count == 0) {
          that.sendMasssage("firstVoice,"+ Date.now());
        }
        // 这个返回大概750ms-760ms
        
        justPlayVoice(voice, () => {
          getVoiceLength().then(res => {
            let voiceLength = res;
            let delTime = 1.5;
            if (count == texts.length -1 
              && that.showButtonFlag[that.voiceIndex - 1]){
                delTime = 0.76;
            }
            let timeNum = Number(voiceLength) - delTime;
            console.log("当前语音播放时长",timeNum);
            if(that.voiceTimer){
              window.clearTimeout(that.voiceTimer);
              that.voiceTimer = null;
            }
            console.error("timeNum:" + timeNum)
            console.error("voiceLength:" + voiceLength)
            that.voiceTimer = setTimeout(()=>{
              if (count == texts.length -1) {
                console.log("播放完成");
                if (that.showButtonFlag[that.voiceIndex - 1]) {
                  that.getRecordText()
                } else {
                  setTimeout(() => {
                    that.sendMasssage("finishVoice");
                  }, 200);
                }
              } else {
                that.playVoiceTips(texts, count + 1);
              }
            }, timeNum * 1000);
          })
        });
      });
    },
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
    //绑定回调事件
    initBindCamera () {
        let that = this;
        !that.isSignVideo ? (that.showFriendly = true) : "";
        // return;
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
                    console.log("开始录制视频回调事件 needStopCamera....... true")
                    that.needStopCamera = true;
                    that.reRecord = false;
                    that.breakTimer = false;
                    if (!that.isSignVideo && that.qualityControl == "1") {
                      that.startSetGrab();
                    }
                    that.showFriendly = false;
                    // 1. 此时设置客户可以点击录制按钮进行录制  或者 直接开始录制
                    that.sendMasssage("canRecord");
                    that.startRecord();
                    break;
                case "StopVideoRecordOver":
                    console.log("StopVideoRecordOver needStopCamera....... false")
                    if (!that.isSignVideo && that.qualityControl == "1") {
                      clearInterval(that.grabTimer);
                    }
                    if (that.reRecord) {
                      that.initBindCamera();
                    } else {
                      // 将数据传回下屏
                      console.log("获取到的视频base64: " + JSON.stringify(cbParams.data));
                      that.needStopCamera = false;
                      // 结束录制 关闭预览窗口及连接
                      // 如果是 结束录制  则提交数据
                      if (that.orderType == "endRecord" && !that.isSignVideo) {
                        that.sendMasssage("recordOver");
                      } else if (that.orderType == "endRecord" && that.isSignVideo) {
                        that.sendMasssage("formRecordOver");
                      }
                    }
                    break;
                case "SetGrabOver":
                    that.sendMessageGrab("setGrabOver");
                    break;
                case "DeviceError":
                    that.sendMasssage("deviceError,"+ cbParams.msg);
                    console.log("双录" + that.recordNode + "DeviceError:" + JSON.stringify(cbParams));
                    break
                default:
                    console.log("走了默认的事件");
                    break;  
            }
        }, params);
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
            itop: 275
      }
      let params = {};
      // 表单签署调用的摄像头属性
      if (that.isSignVideo) {
        params = Object.assign({}, baseParams, {
          index: 0,
          // 先给一点宽高 用来试验
          iwidth: 500,
          iheight: 500,
          ileft: 2635,
          itop: 295
        })
      } else {
        params = Object.assign({}, baseParams, {
          index: 1,
          // 位置宽高
          iwidth: 777,
          iheight: 667,
          ileft: 2117,
          itop: 265
        })
      }
      return params;
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
    startRecord() {
      let that = this;
      // 加这个判断可能由于 签名录制时走这个内容导致报错
      if (that.voiceText) {
        setTimeout(function() {
          that.htmlText = that.voiceText;
          that.$nextTick(() => {
            that.scrollText();
            that.playVoiceStip(that.voiceText);
          })
        }, 1000)
      }
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
        }, 10000)
      }, 2000)
    },
    sendMasssage (data) {
      console.log("录制向下屏发送的数据----" + Date.now() + ":" + data);
      // 如果在之前已经存在了数据 则不再进行覆盖， 保证每个值都会被传到下屏
      if (window.opener.document.getElementById("secondReceive").value != '') {
        return;
      }
      // window.opener属性是一个可读可写的属性，可返回对创建该窗口的 Window 对象的引用。
      window.opener.document.getElementById("secondReceive").value = data;
    },
    // 质检请求发送数据
    sendMessageGrab(data) {
      // 上屏直接做质检 不往下屏发送消息进行交互
      this.checkRecordStatus()
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
    },
    // 回答倒计时
    countDown() {
      this.showAnswer = true;
      if (this.showButtonFlag[this.voiceIndex - 1]) {
        this.answerSecond = 5;
        if (this.answerSecondInterval) {
          clearInterval(this.answerSecondInterval);
        }
        this.answerSecondInterval = setInterval(()=>{
          this.$nextTick(() => {
            this.answerSecond--;
          })
        }, 1000);
      }
    },
    // 前五秒录音 后两秒翻译  上屏展示前6s显示录音中，后一直显示翻译中，有结果或者翻译报错
    async getRecordText() {
      let that = this;
      // 文件名称命名 客户代码_影像类别_模板ID
      let fileName = that.custInfo.CUST_CODE + "_" + that.busiDataParam.BUSI_CODE + "_"+ that.busiDataParam.IMG_CLS + "_" + this.voiceIndex;
      // 开始录音
      await startVoice(fileName);
      that.countDown();
      // 录音结束
      setTimeout(async () => {
        await stopVoice(fileName);
        let picVal = await utyDevice.onExec("readfile64", {
            "filename": "D:/KIOSK/voice/" + fileName + ".wav"
        });
        if (picVal.data) {
          let res = await that.reqTran(picVal.data);
          let tranResult = _.get(res, "Data[0].RESULT_TEXT", "");
          console.error("tranResult:" + tranResult);
          if ((tranResult.includes("是") && (!tranResult.includes("不是") && tranResult != "否"))) {
            that.$notify({
              title: '通过',
              message: '语音识别通过',
              type: 'success'
            });
          }  else {
            that.$notify({
              title: '完成',
              message: '语音识别完成，请查看下方屏幕',
              type: 'warning'
            });
          }
          that.sendMasssage("finishVoice," + tranResult);
          that.showAnswer = false;
        } else {
          that.$notify({
            title: '完成',
            message: '语音识别完成，请查看下方屏幕',
            type: 'warning'
          });
          that.sendMasssage("finishVoice,获取音频文件失败");
          that.showAnswer = false;
        }
      }, 5000)
    },
    // 请求京东接口进行翻译
    reqTran(base64) {
      return sysConfig.$syscfg.K_Request("W0000356",{
        SERVICE_CODE:"I9900003",
        SERVICE_NUMBER:"50005",
        HOTWORDS:"否#20",
        IMG_PHOTO1: base64,
        B_SNO: this.busiDataParam.KIDM_SNO || "",
      }, false, {
          timeout: 20000,
      }).catch(err => {
        console.error(err)
        return {
          // 如果超时 默认返回为是
          Data: [{RESULT_TEXT: "语音识别服务超时"}]
        }
      })
    },
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
.singleAnychatBox {
  position: relative;
  width: 100%;
  height: 100%;

  .headerContent{
    width: 94%;
    margin: 0 auto;
    height: 11%;
    color: white;
    .title {
      padding-top: 22px;
      font-size: 30px;
      padding-bottom: 5px;
    }
  }
  .contenct{
    width: 94%;
    margin: 0 auto;
    background: white;
    border-radius: 4px;
    height: 84%;
  }
  .voiceStep{
    width: 97%;
    margin: 0 auto;
    box-shadow: 0px 5px 5px gray;
    margin-bottom: 10px;
    height: 60px;
    line-height: 60px;
    padding-left: 50px;
    display: flex;
    .step {
      display: flex;
      color: #b9b9b9;
      .img{
        width: 110px;
        text-align: center;
      }
      .title.success {
        color: #3056e4;
        font-weight: 700;
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
        height: 554px;
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
          color:#606060;
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
        height: 560px;
        position: relative;
        background-color: #ffffff;
        border: 1px solid;
        border-color: #eaeaea;
        margin-top: -554px;
        border-radius: 0px 0px 15px 15px;
        background-repeat: no-repeat;
        background-position: bottom;
        background-size: 100%;
        background-image: url("~@icons/yinheVTM/upscreen/bg-record-answerbg.svg");
        .choose-box {
          display: flex;
          flex-direction: column;
          height: 280px;
          font-family: Alibaba PuHuiTi;
          color: #666666;
          font-size: 24px;
          line-height: 35px;
          border-bottom: 1px solid;
          border-color: #eaeaea;
          .title {
            font-size: 28px;
            padding-top: 10px;
            padding-left: 15px;
          }
          .choose-content {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 20px;
            height: 200px;
            font-size: 30px;
            .choose-yes {
              width: 90px;
              height: 90px;
              background-color: #f8f8f8;
              border-radius: 50%;
              color:#1f59db;
              text-align: center;
              line-height: 90px;
            }
            .choose-or {
              padding: 0 35px;
              color:#999999;
            }
            .choose-no {
              width: 90px;
              height: 90px;
              background-color: #f8f8f8;
              border-radius: 50%;
              color:#1f59db;
              text-align: center;
              line-height: 90px;
            }
          }
        }
        .choose-tips {
          height: 280px;
          text-align: center;
          font-family:Alibaba PuHuiTi;
          color:#252525;
          font-size:48px;
          line-height:280px;
          .choose-next {
            font-family:Alibaba PuHuiTi;
            color:#1f59db;
            font-weight: 700;
            font-size:48px;
            line-height:280px;
          }
        }
      }
    }
  }
  .friendly-tips-box {
    width: 100%;
    height: 100%;
    background: #00000073;
    position: fixed;
    left: 0;
    top: 0;
  }
  .friendly-tips {
    position: absolute;
    top: 259px;
    left: 560px;
    width: 828px;
    height: 548px;
    background: white;
    // background-image: linear-gradient(360deg, #a2c1f3 0%, #c2e9fb 100%);
    border-radius: 10px;
    // box-shadow: 1px 1px 10px 2px #ebe3e3;
    color: #000;
    z-index: 1;
    .friendly-tips-title {
      padding: 84px 24px 43px 78px;
      font-size: 32px;
      font-weight: 700;
    }
    .friendly-tips-item {
      padding-left: 75px;
      font-size: 24px;
      font-weight: 700;
      position: relative;
      display: flex;
      align-items: center;
      .friendly-tips-item-content {
        position: relative;
        left: -54px;
        width: 614px;
        height: 104px;
        background: #f2f6ff;
        border-radius: 15px;
        z-index: -1;
        color: #424954;
        font-size: 28px;
        div {
          width: 471px;
          margin-left: 86px;
          margin-top: 14px;
        }
      }
    }
  }
  .signBox {
    width: 100%;
    height: 100%;
    image {
      width: 100%;
      height: 100%;
    }
    #recordVideo {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #bfb2b2;
      opacity: 0.7;
      position: relative;
      .up-heard-tips {
        position: absolute;
        top: 74px;
        font-size: 36px;
        .blur {
          color: blue;
        }
      }
      .recordBox {
        width: 600px;
        height: 600px;
        background-color: #ebf0ff;
        border-radius: 4px;
        position: relative;
        border: 2px solid #86b5f0;
        .deviceBg {
          background-color: rgb(70, 69, 74);
          width: 500px;
          height: 500px;
          position: absolute;
          top: 50px;
          left: 50px;
          border-radius: 4px;
        }
      }
    }
  }
}
</style>
