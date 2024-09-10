<template>
<div v-if="isShowLoadingPage" class="refresh_content-page">
    <div class="coverbox">
      <el-button class="loading-close" v-if='showCloseBtn'  @click="closeLoading">关闭</el-button>
      <div class="coverbox-bg">
        <div class="coverbox-bg-loading">
          <div class="loading-work"></div>
          <!-- <img :src="loadingImage" class="loading-work"/> -->
        </div>
        <div class="coverbox-bg-text">
          <span>{{loadingText || "即将进入下个环节，请稍候..."}}</span>
        </div>
      </div>
      <div class="process-bar">
        <!-- 进度条 -->
        <div class="process">
          <div class="bar">
            <div class="bar-left" ref="left" ></div>
            <div class="bar-right" ref="right" ></div>
            <div>
                <img :src="flyImage" class="fly" ref="fly">
            </div>
          </div>
        </div>
        <div class="content">
          <span>数据加载中，请稍候...</span>
        </div>
      </div>
      <div class = 'bottomImg'></div>
    </div>
</div>
</template>

<script type="text/babel">

export default {
  data() {
    return {
      // loadingImage: require("../../icons/yinheVTM/loading-yh.gif"),
      loadingBottom: require("../../icons/yinheVTM/bg-login-checkbg.svg"),
      flyImage: require("../../icons/yinheVTM/icon-loding-rocket.svg"),
      percentage: 0.99,
      loadingText: '',
      contentIndex: 0,
      isShowLoadingPage: false,
      interval: null,
      showCloseBtn:true,
    }
  },
  props: ['showLoadingPage', 'loadingContents','loadingInterTimeStep','loadingTextRepeatBool'],
  created() {
    console.log('xxx');
  },
  mounted() {
    this.isShowLoadingPage = this.showLoadingPage;
    this.percentage = 0.01;
    if(this.loadingContents.length){
      this.loadingText = this.loadingContents[0];
    }
    this.interval = setInterval(this.changeContent, this.loadingInterTimeStep * 1000);
  },
  deactivated() {
    clearInterval(this.interval);
  },
  watch: {
    showLoadingPage(flag) {
      this.isShowLoadingPage = flag;
      if (!flag){
        clearInterval(this.interval);
        this.contentIndex = 0;
         this.showCloseBtn = false;
      } else {
        this.percentage = 1;
        if( this.loadingContents.length){
          this.loadingText = this.loadingContents[0]
        }
        this.setTimeout10CLose();
      }
    }
  },
  methods: {
    changeContent() {
      if (this.contentIndex >= this.loadingContents.length) {
        if(this.loadingTextRepeatBool){
          this.contentIndex = 0;
        }else{
          clearInterval(this.interval);
          return;
        }
      }
      this.loadingText = this.loadingContents[this.contentIndex]
      this.contentIndex++;
    },
    setTimeout10CLose(){
      //5s后出现关闭图标 可关闭loading
      this.timeoutNum = setTimeout(function(){
        this.showCloseBtn = true;
      }.bind(this),5000)
    },
    closeLoading(){
        this.isShowLoadingPage = false;
        this.$emit('changeLoadingStatus',this.isShowLoadingPage);
      },
  }
}
</script>

<style scoped lang="less">
.refresh_content-page{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:url('../../images/home/homeYinhe/homeMain.jpg');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    z-index: 999999;
    .loading-close{
        position: absolute;
        top: 120px;
        right: 60px;
        width: 168px;
        height: 46px;
        border-radius: 24px;
        border: solid 1px #ffffff;
        font-size: 22px;
        color: #ffffff;
        background: rgba(0,0,0,0);
    }
    .coverbox-bg {
        padding-top: 186px;
        .coverbox-bg-loading {
            display: flex;
            justify-content: center;
            .loading-work {
                width:596px;
                height: 447px;
                background-image: url("../../icons/yinheVTM/loading-yh.gif");
            }
        }
        .coverbox-bg-text{
            line-height: 44px;
            font-family: Alibaba PuHuiTi;
            color: #ffffff;
            font-size: 32px;
            text-align: center;
            margin-top: 90px;
        }
    }
    
    
    .process-bar{
        margin-top: 84px;
        flex-direction: column;
        justify-content: center;
        .process{
            .bar {
                width: 1100px;
                position: relative;
                margin: 0 auto;
                height: 10px;
                .bar-left{
                    width: 0px;
                    height: 10px;
                    background-color:#3b6aff;
                    position: absolute;
                    border-radius: 8px;
                    animation: moveLeft 15s infinite;
                    left: 0;
                    top: 0;
                    z-index: 2;
                }
                .bar-right{
                    width: 99%;
                    height: 10px;
                    background-color: rgba(255, 255, 255, 0.8);
                    top: 34px;
                    border-radius: 8px;
                    position: absolute;
                    left: 0;
                    top: 0;
                }
                .fly {
                    z-index: 3;
                    top: 4px;
                    left: 0;
                    transform: translate(-50%, -50%);
                    position: absolute;
                    animation: flymove 15s infinite;
                }
                
                @keyframes moveLeft{
                    from {width:0px;}
                    to {width:99%;}
                }
                @keyframes flymove{
                    from {left:0;}
                    to {left:99%;}
                }
            }
        }
        .content{
            line-height: 35px;
            font-family: Alibaba PuHuiTi;
            color: #ffffff;
            font-size: 26px;
            text-align: center;
            margin-top: 38px;
        }
    }
    .bottomImg{
        bottom: 0;
        left: 0px;
        position: absolute;
        width: 100%;
        height: 138px;
        background-image: url("../../icons/yinheVTM/bg-btn.svg");
        background-repeat: no-repeat;
        background-size: cover;
    }

    
}


</style>
