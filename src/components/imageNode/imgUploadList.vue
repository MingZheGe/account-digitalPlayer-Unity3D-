<template>
  <div class="upload-list-warp"  :class="hiddenContent ? 'hidden-upload-content' : ''">
    <div class="upload-content">
      <!-- tabs标签有问题.... -->
      <div class="choose">
        <div class="tab-item" :class="activateIndex == 0 ? 'tab-item-activate': ''" @click="handChoose(0)">正在上传({{ uploadList.length }})</div>
        <div class="tab-item" :class="activateIndex == 1 ? 'tab-item-activate': ''" @click="handChoose(1)">上传完成({{ uploadCompleteList.length }})</div>
      </div>
      <div class="upload-list" id="upload-list">
        <div v-for="(item, index) in getUploadList()" class="file-item">
          <div class="file-icon">
            <img :src="item.icon"/>
          </div>
          <div class="file-detile">
            <div class="file-name">
              {{ item.name }}
            </div>
            <div class="file-time">
              <span class="time-title">时间:</span>
              <span class="up-time">{{ item.time }}</span>
            </div>
          </div>
          <div class="file-process">
            <div class="file-process-content">
              <el-progress :text-inside="true" :stroke-width="26" :percentage="item.percentage"></el-progress>
              <span v-if="item.status != 0" class="status-text" :class="item.status == 1 ? 'status-text-fail' : 'status-text-success'">{{ item.status == 1 ? "上传失败" : "上传成功" }}</span>
            </div>
            <div class="file-process-error" v-if="item.errMsg != ''">
              {{ item.errMsg }}
            </div>
          </div>
          <div class="file-btn" v-if="item.showRetry">
            <el-button icon="el-button-retry" @click="retry(item)">  重试</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
import _ from 'lodash'

export default {
  data() {
    return {
      activateIndex: 0,
      // icon-file-doc icon-file-pdf icon-file-png icon-file-jpg
      // icons: ["icon-file-doc", "icon-file-pdf", "icon-file-png", "icon-file-jpg"],
      /**
       * 
       * 
       {
        imgCls: "item.imageCls",
        name: "item.IMG_CLS_NAME",
        time: "item.OPER_TIME",
        percentage: 100,
        icon: require("@icons/yinheVTM/imageNode/" + "icon-file-pdf" + ".svg"),
        showRetry: true,
        uploadObj: "item",
        status: 1,
        errMsg: "删除影像信息失败红红火火恍恍惚惚或或或或或或或或或或或或或或或或或或或或或或或或或或"
      }
       */
      uploadList: [],
      uploadCompleteList: [],
      hiddenContent: true,
    }
  },
  watch: {
    uploadList(val) {
      if (!val || val.length == 0) {
        this.$emit("changeUploadStatus", true)
      }
    }
  },
  mounted() {

  },
  methods: {
    handChoose(index) {
      // 正在上传
      this.activateIndex = index;
    },
    getUploadList() {
      if (this.activateIndex == 0) {
        return this.uploadList;
      } else {
        return this.uploadCompleteList;
      }
    },
    addUploadObj(item) {
      let obj = {
        imgCls: item.imageCls,
        name: item.IMG_CLS_NAME,
        time: item.OPER_TIME,
        percentage: item.PROCESS,
        icon: require("@icons/yinheVTM/imageNode/" + item.cls + ".svg"),
        showRetry: false,
        uploadObj: item,
        status: 0,
        errMsg: ''
      }
      item.addAspectjMethod(KidmUpload.ASPECTJ_METHODS.PROCESS_UPDATE, (status, process) => {
        console.log(status, process);
        obj.percentage = process;
        obj.status = status;
        if (obj.status == 1) {
          obj.errMsg = item.ERROR_MSG
          obj.showRetry = true;
          this.checkUploadStatus();
        }
        // 上传成功
        if (status == 2 && process == 100) {
          let index = _.findIndex(this.uploadList, objF => {
            return objF.imgCls == item.imageCls && objF.status == 2
          });
          let completeObj = this.uploadList.splice(index, 1);
          completeObj && completeObj.length && this.uploadCompleteList.push(completeObj[0])
        }
      })
      item.submit()
      this.uploadList.push(obj)
    },
    // 检查影像上传是否存在上传失败
    checkUploadStatus() {
      let hasFailItem = false;
      _.each(this.uploadList, item => {
        if (item.status == 1) {
          hasFailItem = true;
        }
      })
      if (hasFailItem) {
        this.$emit("changeUploadStatus", false)
      }
    },
    changeStatus(val) {
      if (val !== undefined) {
        this.hiddenContent = val
      } else {
        this.hiddenContent = !this.hiddenContent;
      }
    },
    // 重置上传列表
    resetUploadList() {
      this.uploadList = [];
      this.uploadCompleteList = [];
    },
    retry(item) {
      item.uploadObj.submit();
      item.errMsg = "";
      item.showRetry = false;
    },
    // 检查上传列表是否上传完成
    uploadOver() {
      if (this.uploadList.length == 0) {
        return true;
      }
      let hasFailItem = false;
      _.each(this.uploadList, item => {
        if (item.status == 1) {
          hasFailItem = true;
        }
      })
      // 存在失败项
      if (hasFailItem) {
        // this.hiddenContent = false;
        return false;
      }
    }
  }
}
</script>

<style lang="less">
.upload-list-warp {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0, 0.5);
  z-index: 9999;
  &.hidden-upload-content {
    width: 0px;
    height: 0px;
    overflow: hidden;
  }
  .upload-content {
    width:1802px;
    height:925px;
    background:#ffffff;
    border-radius:4px;
    position: absolute;
    left: 59px;
    top: 120px;
    
    .choose {
      width: 1710px;
      height: 60px;
      display: flex;
      padding-left: 50px;
      border-bottom: 1px solid #e8e8e8;
      .tab-item {
        width:239px;
        height:60px;
        color:#999999;
        font-size:24px;
        letter-spacing:7.14px;
        text-align: center;
        line-height: 60px;
        &.tab-item-activate {
          color:#152a4a;
          border-bottom:4px solid;
          border-color:#3860f0;
        }
      }
    }
    #upload-list {
      height: 835px;
      margin-left: 76px;
      overflow: scroll;
      &::-webkit-scrollbar {
          display: block;
          width: 5px
      }
      &::-webkit-scrollbar-track {
          background-color: rgba(128, 128, 128, 0);
          -webkit-border-radius: 2em;
          -moz-border-radius: 2em;
          border-radius: 2em
      }
      &::-webkit-scrollbar-thumb {
          background-color: #dbdbdb;
          -webkit-border-radius: 2em;
          -moz-border-radius: 2em;
          border-radius: 2em
      }
      .file-item {
        width: 1681px;
        height: 139px;
        display: flex;
        border-bottom: 2px solid #e1e1e6;
        .file-icon {
          width: 79px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .file-detile {
          width: 642px;
          padding-left: 46px;
          .file-name {
            margin-top: 29px;
            color:#152a4a;
            font-size:24px;
          }
          .file-time {
            margin-top: 19px;
            .time-title {
              color:#252525;
              font-size:22px;
            }
            .up-time {
              color:#696969;
              font-size:21px;
            }
          }
        }
        .file-process {
          width: 575px;
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: center;
          .file-process-content {
            width: 575px;
            display: flex;
            flex-direction: row;
            align-items: center;
          }
          .file-process-error {
            color: #e73e3e;
          }
          .el-progress {
            width: 393px;
            .el-progress-bar {
              .el-progress-bar__outer {
                border-radius: 0px;
                .el-progress-bar__inner {
                  border-radius: 0px;
                  .el-progress-bar__innerText {
                    font-size: 20px;
                  }
                }
              }
            }
          }
          .status-text {
            font-size: 24px;
            padding-left: 11px;
            // color: #ef4848;
          }
          .status-text-success {
            color: #3e70fe;
          }
          .status-text-fail {
            color: #ef4848;
          }
        }
        .file-btn {
          width: 334px;
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: center;

          .el-button {
            width: 107px;
            border: 1px solid;
            border-color: #3e70fe;
            border-radius: 4px;
            color: #3e70fe;
            font-size: 22px;
            .el-button-retry {
              background: url("~@icons/yinheVTM/imageNode/icon-list-refresh.svg");
              background-size: cover;
            }
            .el-button-retry::before {
                content: "重";
                font-size: 24px;
                visibility: hidden;
            }
          }
        }
      }
    }
  }
}
</style>