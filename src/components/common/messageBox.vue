<template>
  <div class="message-box-wrap" 
    :class="[messageBoxProps.hasMask ? '' : 'no-mask', messageBoxProps.ownClass ? messageBoxProps.ownClass : '']" 
    @click.self="handleWrapperClick"
    v-if='showMsgBoxFlag'>
    <div class="messageBox_back"></div>
    <div class="sign-loading-wrap">
        <span class="icon-box" :class='iconClass'></span>
        <!-- <span class="message-pic" v-show="messageBoxProps.showPic" :class='messagePicture'></span> -->
        <span class="message-text" v-if='messageBoxProps.messageText' v-html="messageBoxProps.messageText"></span>
        <el-row class='button-wrap' v-if='messageBoxProps.cancelButtonText||messageBoxProps.confirmButtonText'>
          <el-button @click="canceled" class='cancel-button' v-if='messageBoxProps.cancelButtonText'>{{messageBoxProps.cancelButtonText}}</el-button>
          <el-button type="primary" @click="confirmed" v-if='messageBoxProps.confirmButtonText'>{{messageBoxProps.confirmButtonText}}</el-button>
        </el-row>
    </div>
  </div>
</template>

<script type="text/babel">
/*
*@author movi
*
* @param {object}     messageBoxProps           初始值
* @param {boolean}    showMsgBox                显示提示框       
* @param {string}     ownClass                  自定义class       
* @param {boolean}    hasMask                   是否有遮罩层   
* @param {string}     typeMessage              
* 提示框类型 
* 默认是正确   
* 目前可传warn 警告类型
* wait  开发中，请等待图标类型     
* sign  扫描，请先扫描     
* @param {string}     messageText               提示文字
* @param {string}     cancelButtonText          取消按钮文字
* @param {string}     confirmButtonText         确认按钮文字
* @param {function}   confirmedAction           确认按钮操作的回调函数
*
*  

*使用方法 <message-box :messageBoxProps='messageBoxProps'  @confirmed='confirmed' @canceled='canceled'  ></message-box>

*
* messageBoxProps:{
*   hasMask:true,
*   messageText:'我正在加载中有完没完啊，我正在加载中',
*   typeMessage:'warn',
*   confirmButtonText:'重新测评',
*   cancelButtonText:'取消', 
*   ownClass:'movi', 
*   showMsgBox:true, 
*   confirmedAction:function(){console.log("可选的确认按钮点击事件")}
*   canceledAction:function(){console.log("可选的取消按钮点击事件")}
* }
*
*/
  export default {
    data() {
      return {
        showMsgBoxFlag:false
      };
    },
    props:['messageBoxProps'],
    mounted() {
      console.log("messageBox");
    },
    activated() {
      console.log("messageBoxActivated");
    },
    computed: {
      iconClass(){
        switch(this.messageBoxProps.typeMessage){
          case 'warn':
            return 'warn-icon';
            break;
          case 'wait':
            return 'wait-icon';
            break;
          case 'sign':
            return 'sign-icon';
            break;
          case 'back':
            return 'back-icon';
            break;
          case 'question':
            return 'question-icon';
            break;
          default:
            return '';
            break;
        }
      },
      showMsgBox(){
        return this.messageBoxProps.showMsgBox;
      },
      messagePicture() {
        let messPic = this.messageBoxProps.messagePic || this.messageBoxProps.typeMessage;
        switch(messPic){
          case 'warn':
            return 'warn-pic';
            break;
          case 'wait':
            return 'wait-pic';
            break;
          case 'sign':
            return 'sign-pic';
            break;
          case 'back':
            return 'back-pic';
            break;
          case 'question':
            return 'quit-biz';
            break;
          default:
            return 'information-pic';
            break;
        }
      }
    },
    watch:{
      showMsgBox(val){
        this.showMsgBoxFlag = val;
      }
    },
    methods:{
      handleWrapperClick() {
        if (this.messageBoxProps.closeOnClickModal) {
          this.canceled();
        }
      },
      confirmed(){
        this.messageBoxProps.showMsgBox = false;
        if(this.messageBoxProps.confirmedAction){
          this.messageBoxProps.confirmedAction();
        }else{
          this.$emit('confirmed');
        }
      },
      canceled(){
        this.messageBoxProps.showMsgBox = false;
        if(this.messageBoxProps.canceledAction){
          this.messageBoxProps.canceledAction();
        }else{
          this.$emit('canceled');
        }
      }
    }
  };
</script>


<style lang="less" scoped>
 .message-box-wrap{
    align-items: center;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999999999;//确保弹窗在loading上面
    // background: #000000;
    // opacity: 0.5;
    // background: linear-gradient(30deg, rgba(113,65,193,0.8) 0%, rgba(68,135,236,0.8) 100%);
    &.no-mask{
      background: none;
    }
    .messageBox_back {
        background: rgba(0,0,0,0.80);
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
      }
    .sign-loading-wrap {
      position: relative;
      width: 830px;
      height:506px;
      margin-left: 536px;
      margin-top: 200px;
      background: #FFFFFF;
      box-shadow: 0 8px 20px 0 rgba(0,0,0,0.25);
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .message-text {
        padding: 0 66px;
        width: 100%;
        box-sizing: border-box;
        font-size: 32px;
        font-weight: 700;
        color: #222222;
        letter-spacing: 0;
        text-align: center;
        line-height: 48px;
        display: inline-block;
        width: 100%;
        margin: 213px 95px 133px;
      }
      .button-wrap{
        display: flex;
        justify-content: space-around;
        margin-bottom: 40px;
        button{
          width: 194px;
          height: 60px;
          border-radius: 4px;
          font-size: 24px;
          background-image: linear-gradient(270deg, #1f59db 0%, #217fff 100%);
        }
        .cancel-button{
          background: #FFFFFF;
          color: #1f59db;
          border: solid 1px #1f59db;
          margin-right: 40px;
        }
      }
      .message-pic {
        // width: 217px;
        // height: 217px;
        width: 272px;
        height: 272px;
        background-color: #f0f7ff;
        border-radius: 30px;
        background-repeat: no-repeat;
        background-position: center;
        margin-top: 132px;
        &.warn-pic {
          background-image: url('../../icons/common/pic-Verification-failed.svg');
        }
        &.wait-pic {
          background-image: url('../../icons/common/pic-Calibration-progress.svg');
        }
        &.sign-pic {
          background-image: url('../../icons/common/pic-Verification-succeeded.svg');
        }
        &.back-pic {
          background-image: url('../../icons/common/pic-Calibration-progress.svg');
        }
        &.question-pic {
          background-image: url('../../icons/common/pic-Information-inquiry.gif');
        }
        &.information-pic {
          background-image: url('../../icons/common/pic-quit-biz.svg');       
        }
        &.quit-biz {
          background-image: url('../../icons/common/pic-quit-biz.svg');       
        }
      }
    }
    .icon-box {
      position: absolute;
      top: -64px;
      left: 348px;
      display: block;
      margin: 0 auto;
      width: 128px;
      height: 128px;
      background-image: url("../../icons/common/icon-Verification-succeeded.svg");
      background-size:cover;
    }
    .warn-icon{
      background-image: url("../../icons/common/icon-termination.svg");
    }
    .wait-icon{
      background-image: url('../../icons/common/icon-Improve-information.svg');
    }
    .sign-icon{
      background-image: url('../../icons/common/icon-Signing of agreement.svg');
    }
    .back-icon{
      background-image: url('../../icons/common/getback.svg');
    }
    .question-icon{
      background-image: url('../../icons/common/icon-question.svg');
    }
  }

</style>