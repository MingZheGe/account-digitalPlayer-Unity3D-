<template>
<div v-if="isShowLoading" class="loading-wrap" :class='[ ownClass ? ownClass : ""]'>
  <div class="loading_back"></div>
  <span class="icon-loading" :class='[whiteIcon ? "white-icon" : ""]' v-if="typeLoading=='single'"></span>
  <div class="sign-loading-mask" :class="loadingClass" v-else>
    <div class="sign-loading-wrap">
        <!-- <i class="loading-status"  :class="[ loadingStatue =='success' ? 'success-icon': loadingStatue =='fail' ? 'fail-icon' : loadingStatue =='progress' ? 'progress-icon' : '']"></i> -->
        <i class="loading-pic"  :class="loadingPicClass"></i>
        <span class="loading-text" v-if='loadingText'>{{loadingText}}</span>
        <img @click="closeLoading" class="loading-close" v-if='showCloseBtn' src='../../icons/common/icon-windows-close.svg'/>
    </div>
  </div>
</div>
</template>

<script type="text/babel">
/*
*@author movi
*
* @param {string}     loadingText    要显示的文字      非必传
* @param {string}     ownClass      自定义class       非必传
* @param {boolean}   showloading    是否显示loading   必传
* @param {string}     typeLoading    loading三种形式   非必传
* 第一种：no-mask-grey   没有遮罩层，没有白色弹框，灰色loading加文字
* 第二种：no-box-white   没有遮罩层，没有白色弹框，白色loading加白色文字
* 第三种： 有遮罩层，有白色弹框，灰色loading加灰色文字  默认
* 第四种： 无遮罩层，有灰色底框，白色loading  
* @param {string}   loadingStatue  loading状态 非必传
* 第一种 success-icon 成功
* 第二种 fail-icon 失败
* 第三种 progress-icon 进程
* 第四种 默认 无
* @param {string}   loadingPic  loading中间展示图片 可以自行添加图片样式
* 第一种 :loadingPic verification-failed 失败
** @param {boolean}     whiteIcon   使用白色loading的icon   非必传

*使用方法 <loading loadingText='' :showLoading='showloading' ownClass='movi'></loading> 
*
*/
  export default {
    data() {
      return {
        isShowLoading:false,
        showCloseBtn:false,
        needClose: true
      };
    },
    props:[
      'loadingText',
      'ownClass',
      'showLoading',
      'typeLoading',
      'whiteIcon',
      'loadingPic',
      'loadingStatue',
      'needCloseIcon'
    ],
    mounted() {
      this.isShowLoading = this.showLoading;
      this.needClose = this.needCloseIcon === false ? false : true;
      this.needClose && this.setTimeout10CLose();
    },
    computed: {
      loadingClass(){
        switch(this.typeLoading){
          case 'no-mask-grey':
            return 'no-mask';
            break;
          case 'no-box-white':
            return 'no-box';
            break;
          case 'no-mask-box-white':
            return 'no-mask-box-white';
            break;
          default:
            return '';
            break;
        }
      },
      loadingPicClass() {
        let temLoading = this.loadingPic || this.loadingStatue
        switch(temLoading) {
          case 'fail':
            return 'pic-Verification-failed'
            break;
          case 'success':
            return 'pic-Verification-succeeded'
            break;
          case 'progress':
            return 'pic-Calibration-progress'
            break;
          default: {
            return 'pic-loading-waiting'
            break;
          }
        }
      }
    },
    watch: {
      showLoading(flag){
        this.isShowLoading = flag;
        if (this.needClose) {
          if(flag){
            this.setTimeout10CLose();
          }else{
            this.showCloseBtn = false;
            clearTimeout(this.timeoutNum);
          }
        }
      }
    },
    methods: {
      closeLoading(){
        this.isShowLoading = false;
        this.$emit('changeLoadingStatus',this.isShowLoading);
      },
      setTimeout10CLose(){
        clearTimeout(this.timeoutNum);
        //15s后出现关闭图标 可关闭loading
        this.timeoutNum = setTimeout(() => {
          this.showCloseBtn = true;
        }, 15000)
      }
    },
  };
</script>

<style lang="less" scoped>
.loading-wrap{
  background: rgba(0,0,0,0.80);
  width: 1920px;
  height: 1080px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999999;
  .icon-loading{
    display: block;
    margin: 0 auto;
    width: 73px;
    height: 72px;
    background-image: url("../../icons/common/loading-grey2.svg");
    background-size:cover;
    animation: rotation 1s infinite steps(10);
    &.white-icon{
      background-image: url("../../icons/common/loading-white.svg");
    }
  }
  .loading_back {
    background: rgba(0,0,0,0.80);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2018;
  }
  .sign-loading-mask {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2018;
    &.no-mask{
      background:none;
      .sign-loading-wrap{
        background:none;
        box-shadow:none;
      }
    }
    &.no-box{
      background: none;
      .sign-loading-wrap{
        background:none;
        box-shadow:none;
        .icon-loading {
          background-image: url("../../icons/common/loading-white.svg");
        }
        .loading-text{
          color: white;
        }
      }
    }
    &.no-mask-box-white{
      background: none;
      .sign-loading-wrap{
        box-shadow: none;
        width: 140px;
        height: 140px;
        background: rgba(0,0,0,0.90);
        border-radius: 6px;
      }
      .icon-loading {
        margin-top: 34px!important;
        background-image: url("../../icons/common/loading-white.svg");
      }
    }
    .sign-loading-wrap {
        position: relative;
        width:826px;
        height: 561px;
        background: #fff;
        margin: 0 auto;
        background: #FFFFFF;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        .icon-loading {
          // margin-top: 132px;
        }
        .loading-close{
          position: absolute;
          top: -70px;
          right: -70px;
        }
        .loading-text {
          color: #222222;
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 0;
          text-align: center;
          display: inline-block;
          width: 100%;
          margin-top: 60px;
        }
        .loading-status {
          position: absolute;
          width: 128px;
          height: 128px;
          top: -64px;
          right: 350px;
          background-repeat: no-repeat;
          background-position: center;
          &.success-icon{
            background-image: url("../../icons/common/icon-Verification-succeeded.svg");
          }
          &.fail-icon {
            background-image: url("../../icons/common/icon-Verification-failed.svg");
          }
          &.progress-icon {
            background-image: url("../../icons/common/icon-Calibration-progress.svg");
          }
        }
        .loading-pic {
          // width: 217px;
          // height: 217px;
          width: 272px;
          height: 272px;
          background-color: #f0f7ff;
          border-radius: 30px;
          background-repeat: no-repeat;
          background-position: center;
          }
          .pic-Verification-failed {
            .loading-pic();
            background-image: url("../../icons/common/pic-Verification-failed.svg");
          }
          .pic-Information-inquiry {
            .loading-pic();
            background-image: url("../../icons/common/pic-Information-inquiry.gif");
          }
          .pic-Verification-succeeded {
            .loading-pic();
            background-image: url("../../icons/common/pic-Verification-succeeded.svg");
          }
          .pic-Calibration-progress {
            .loading-pic();
            background-image: url("../../icons/common/pic-Calibration-progress.svg");
          }          

        .pic-loading-waiting {
          width: 826px;
          height: 418px;
          border-radius: 10px 10px 0px 0px;
          background-color: #F0F7FF;
          background-repeat: no-repeat;
          background-position: top;
          background-image: url("../../icons/common/pic-loading-waiting.gif");
        }
    }

  }
}  
@keyframes rotation {
    from {
        -webkit-transform: none;
        -ms-transform: none;
    }
    to {
        -webkit-transform: rotate(360deg);
        -ms-transform: rotate(360deg);
    }
}
</style>