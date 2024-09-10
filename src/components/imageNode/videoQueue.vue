<template>
  <div class="videoQueue">
    <input type="text" id="secondReceive" style="display:none" />
  </div>
</template>

<script>
import { openView } from "../../service/record-service.js";
import dateFormat from '../../tools/format.js';
import oppService from "../../service/opp-service.js";
export default {
  computed: {
  },
  created() {
  },
  data() {
    return {
      waitNum: 0,
      anychatServer: "",
      anychatPort: "",
      videoServerUrl: "",
      videoServerPort: "",
      anychatAppid: "",
      socketUrl: "",
      anychatType: "doubleVideoView",
      socket: "",
      videoId: "",
      anychatParam: {},
      basedata: {},
    }
  },
  props: ["startQueue", "fromImageNode"],
  mounted() {
  },
  components: {
  },
  deactivated() {
    if (this.socket) {
      this.socket.close();
    }
  },
  destroyed() {
    if (this.socket) {
      this.socket.close();
    }
  },
  computed: {
    busiCode() {
      return this.$store.state.busicode;
    },
    isRecord() {
      return this.$store.state.isrecord;
    }
  },
  watch: {
    startQueue: function (val) {
      console.log("发起排队标志位", val)
      if (this.anychatType == "doubleVideoView") {
        if (val) {
          if (this.fromImageNode) {
            this.$store.commit(this.$types.UPDATE_QUEUE_WAIT_NUM, 0);
          } else {
            let parData = {
              screenType: "queueWait",
              waitNum: this.waitNum,
              stopQueueWait: false,
            };
            openView(parData);
            this.$store.commit(this.$types.UPDATE_QUEUE_WAIT_NUM, this.waitNum);
          }
          this.setBusiInfo();
          let B_SNO = this.$storage.getSession(this.$definecfg.B_SNO);
          if (B_SNO) {
            this.forwardRecode();
          } else {
            this.creatBsno();
          }
        } else {
          if (!this.isRecord) {
            this.socket.close();
            let parData = {
              screenType: "queueWait",
              waitNum: this.waitNum,
              stopQueueWait: true,
            };
            if (!this.fromImageNode) {
              openView(parData);
            }
          } else {
            let params = {
              "videoId": "",
              "userCode": this.basedata.OP_CODE,
              "showCambox": true,
              "anychatParam": this.anychatParam,
              "screenType": "doubleVideoView",
              "imageclick": "",
              "stopDoubleView": true,
            };
            if (!this.fromImageNode) {
              openView(params);
            }
            this.$store.commit(this.$types.UPDATE_IS_RECORD, false);
          }
        }
      } else if (this.anychatType == "anychatQueue") {
        if (val) {
          this.setBusiInfo();
          let params = {
            "basedata": this.basedata,
            "anychatParam": this.anychatParam,
            "screenType": "anychatQueue",
          };
          openView(params);
        } else {
          let params = { screenType: "quitToHome" };
          openView(params);
          this.$store.commit(this.$types.UPDATE_IS_RECORD, false);
        }
      }
    },
  },
  methods: {
    getRecordeUrl() {
      let testArr = ["video.anychat.server", "video.anychat.port", "video.queue.socket.url", "video.anychatyun.server", "video.anychatyun.port", "video.anychatyun.appid", "app.video.anychat.server", "app.video.anychat.port", "app.video.queue.socket.url"]
      let that = this;
      return new Promise((resolve, reject) => {
        that.$syscfg.K_Request("W0000128", {
          service: "W0000128",
          properties: testArr.join(",")
        }).then((data) => {
          if (data.Code != "0" || !data.Data["0"]) {
            that.showMessageBox("获取anychat服务器地址失败");
          }
          if (data.Data["0"]["video.anychatyun.server"]) {
            // that.$store.commit(that.$types.UPDATE_ANYCHAT_QUEUE_TYPE,"anychatQueue");
            // that.$store.commit(that.$types.UPDATE_ANYCHAT_QUEUE_TYPE,"doubleVideoView");
            that.anychatServer = data.Data["0"]["video.anychatyun.server"];
            that.anychatPort = data.Data["0"]["video.anychatyun.port"];
            that.anychatAppid = data.Data["0"]["video.anychatyun.appid"];
            that.anychatParam = {
              serverAddr: that.anychatServer,
              // serverAddr:"10.137.35.173",
              serverPort: that.anychatPort,
              anychatAppid: that.anychatAppid,
            }
          } else {
            that.anychatServer = data.Data["0"]["app.video.anychat.server"] ? data.Data["0"]["app.video.anychat.server"] : data.Data["0"]["video.anychat.server"];
            that.anychatPort = data.Data["0"]["app.video.anychat.port"] ? data.Data["0"]["app.video.anychat.port"] : data.Data["0"]["video.anychat.port"];
            that.socketUrl = data.Data["0"]["app.video.queue.socket.url"] ? data.Data["0"]["app.video.queue.socket.url"] : data.Data["0"]["video.queue.socket.url"];
            // that.socketUrl = "ws://119.163.195.189:8181";
          }
          if (!that.socketUrl) {
            that.messageBox({
              hasMask: true,
              messageText: '获取排队服务器地址失败',
              confirmButtonText: '确定',
              typeMessage: 'warn',
              showMsgBox: true,
              confirmedAction: () => {
                resolve(that.getRecordeUrl());
              }
            })
          } else {
            resolve(true);
          }
        })
      })
    },
    // 远程双录执行函数,进行排队服务
    async forwardRecode() {
      let flag = await this.getRecordeUrl();
      if (!flag) {
        return
      }
      this.setBusiInfo();
      let socketData = {
        code: 101,
        body: {
          sessionId: this.basedata.ID_CODE,
          custInfo: this.basedata,
        }
      };
      if (this.socket) {
        this.socket.close();
      }
      this.socket = new WebSocket(this.socketUrl + "/client?clientId=" + this.basedata.ID_CODE);
      this.socket.onopen = (event) => {
        console.log("像坐席岗发送数据", JSON.stringify(socketData));
        this.socket.send(JSON.stringify(socketData));
      };
      this.socket.onclose = (event) => {
        console.log("socket close....", event)
      };
      this.socket.onerror = (event) => {
        this.messageBox({
          hasMask: true,
          messageText: '连接排队服务器失败',
          confirmButtonText: '确定',
          typeMessage: 'warn',
          showMsgBox: true,
          confirmedAction: () => {
            this.getRecordeUrl();
          }
        })
        //监听到返回的数据变化了
      };
      this.socket.onmessage = (event) => {
        let data = JSON.parse(event.data);
        switch (data.code) {
          case 206:
            break;
          case 207:
            this.waitNum = data.body.position;
            console.log("当前排队人数", data.body.position);
            if (this.fromImageNode) {
              this.$store.commit(this.$types.UPDATE_QUEUE_WAIT_NUM, this.waitNum);
            } else {
              let parData = {
                screenType: "queueWait",
                waitNum: this.waitNum,
                stopQueueWait: false,
              };
              openView(parData);
              this.$store.commit(this.$types.UPDATE_QUEUE_WAIT_NUM, this.waitNum);
            }
            break;
          case 208:
            this.videoId = data.body.videoId;
            this.anychatParam = {
              serverAddr: this.anychatServer,
              // serverAddr:"10.137.35.173",
              serverPort: this.anychatPort,
              OP_CODE: this.basedata.OP_CODE,
            }
            let params = {
              "videoId": this.videoId,
              "userCode": this.basedata.OP_CODE,
              "showCambox": true,
              "anychatParam": this.anychatParam,
              "screenType": "doubleVideoView",
              "imageclick": "",
              "stopDoubleView": false,
            };
            if (this.fromImageNode) {
              params.bsnoInfo = this.$storage.getSession(this.$definecfg.B_SNO);
            }
            console.log("获取到的坐席id", this.videoId);
            openView(params);
            this.$storage.setSession(this.$definecfg.WITNESS_VIDEO_ID, data.body.videoId);
            this.$store.commit(this.$types.UPDATE_IS_RECORD, true);
            break;
          case 225:
            console.log("保持连接");
        }
      };
    },
    setBusiInfo() {
      let userInfo = JSON.parse(this.$storage.getSession(this.$definecfg.USER_INFO));
      let customerInfo = JSON.parse(this.$storage.getSession(this.$definecfg.CUSTOMER_INFO));
      this.basedata = {
        "OP_START_TIME": dateFormat(new Date(), "YYYYMMDD HH:mm:ss"),
        "B_SNO": this.$storage.getSession(this.$definecfg.B_SNO),
        "BUSI_SCOPE": this.$storage.getSession(this.$definecfg.BUSI_SCOPE),
        "PROC_STATUS": "02",
        "YZT_CHANNEL": this.$syscfg.getYztChannel() || "4",
        "CUST_ORG_CODE": customerInfo != null ? customerInfo.INT_ORG : userInfo.ORG_CODE,
        "BUSI_CODE": this.busiCode,
        "USER_TYPE": customerInfo != null ? customerInfo.USER_TYPE : this.userType,
        "ID_TYPE": customerInfo != null ? customerInfo.ID_TYPE : "",
        "ID_CODE": customerInfo != null ? customerInfo.ID_CODE : "",
        "OP_CODE": userInfo.OP_CODE,
        "OP_ORG": userInfo.ORG_CODE,
        "ORG_CODE": customerInfo != null ? customerInfo.INT_ORG : userInfo.ORG_CODE, // 优先传一柜通坐席柜员机构代码
        "ORG_FULL_NAME": customerInfo != null ? customerInfo.ORG_FULL_NAME : "",
        "CUST_CODE": customerInfo != null ? customerInfo.CUST_CODE : "",
        "CUST_FNAME": customerInfo != null ? customerInfo.USER_FNAME : "",
        "CUACCT_CODE": customerInfo != null ? customerInfo.CUACCT_CODE : "",
        "OPER_TIME": dateFormat(new Date(), "YYYY-MM-DD HH:mm:ss"),
        "CUST_NAME": customerInfo != null ? customerInfo.CUST_NAME : "",
        "INT_ORG": customerInfo != null ? customerInfo.INT_ORG : "",
        "VTM_FLAG": "1",
        "ASSISTANT_FLAG": "1",
        "F_CUST_ORG_CODE": customerInfo && customerInfo.F_CUST_ORG_CODE || customerInfo.INT_ORG || ""
      }
      if (this.fromImageNode) {
        this.basedata.ASSISTANT_FLAG = "0";
      }
    },
    showMessageBox(mestext) {
      this.messageBox({
        hasMask: true,
        messageText: mestext,
        confirmButtonText: '重试',
        typeMessage: 'warn',
        showMsgBox: true,
      })
    },
    creatBsno() {
      oppService.saveBizData({}).then((flowData) => {
        console.log("创建流水号", flowData);
        if (flowData.Code == "0") {
          this.$storage.setSession(this.$definecfg.B_SNO, flowData.Data[0].B_SNO);
          if (this.startQueue) {
            this.forwardRecode();
          }
        } else {
          this.showMessageBox("创建流水号失败，请稍后重试！")
        }
      }).catch(() => {
        this.showMessageBox("创建流水号失败，请稍后重试！")
      })
    }
  }
}
</script>
<style lang="less">
</style>
