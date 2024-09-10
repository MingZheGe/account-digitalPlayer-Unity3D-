<template>
  <div
    ref="messageTip"
    class="message-box-wrap el-msg"
    :class="[hasMask ? '' : 'no-mask', ownClass ? ownClass : '']"
    v-show="isShowMsgBox"
    v-if="showMsgBox"
  >
    <article
      :class="['sign-loading-wrap', 
                {'sign-loading-wrap--alert': typeMessage==='alert'}, 
                {'sign-loading-wrap--custeval': typeMessage==='custEval'},
                {'sign-loading-wrap--relationship': typeMessage==='relationshipMsg'},
                {'sign-loading-wrap--threeElement': typeMessage==='threeElement'},
                {'sign-loading-wrap--readCardMsg': typeMessage === 'readCardMsg'},
                {'sign-loading-wrap--profTips': typeMessage === 'profTips'},
                {'sign-loading-wrap--password': typeMessage === 'password'},
                {'sign-loading-wrap--password': typeMessage === 'passwordInput'},
                {'sign-loading-wrap--editBox': typeMessage === 'editBox'},
                {'sign-loading-wrap--tableBox': typeMessage === 'tableBox'},
                {'sign-loading-wrap--matchTip': typeMessage === 'matchTip'},
                {'sign-loading-wrap--letterBox': typeMessage === 'letterBox'},
                {'sign-loading-wrap--excl': typeMessage === 'excl'},
                {'sign-loading-wrap--verify': typeMessage === 'userVerify'},
                {'sign-loading-wrap--tips': typeMessage === 'tips'}]"
    >
      <div class="msg-icon" v-if="msg_icon" :class="msg_icon">
      </div>
      <!---- error content ----->
      <section class="content">
        <div v-if="typeMessage==='dialog'" class="dialog" :ref="typeMessage">
          <!-- <div v-if="typeMessage==='alert'" class="alert-icon" :class="msg_icon"></div> -->

          <span
            v-for="item in text"
            :key="item"
            :class="['message-text',{'message-label':true}]"
            v-html="item"
          ></span>
        </div>
        <matchTip
          v-if="typeMessage==='matchTip'"
          :title="tip.title"
          :content="tip.content"
        >
        </matchTip>
        <excl
          v-if="typeMessage==='excl'"
          :exclTitle="excl.exclTitle"
          :exclArr="excl.exclArr">
        </excl>
        <userVerify
          v-if="typeMessage==='userVerify'"
          :ref="typeMessage"
          :errorText="userVerifyInfo.errorText"
          >
        </userVerify>
        <cust-eval
          v-if="typeMessage==='custEval'"
          :ref="typeMessage"
          :title="custEvaluate.title"
          :lv="custEvaluate.lv"
          :score="custEvaluate.score"
          :lvDate="custEvaluate.lvDate"
          :lvExpDate="custEvaluate.lvExpDate"
          :remainingEval="custEvaluate.remainingEval"
          :surveyName="custEvaluate.surveyName"
          :intervalDays="custEvaluate.intervalDays"
        ></cust-eval>

        <password
          v-if="typeMessage === 'password'"
          :ref="typeMessage"
          :title="password.title"
          :showForget="password.showForget"
          @forgetPassword='forgetPassword'
        ></password>

        <password-input
          v-if="typeMessage === 'passwordInput'"
          :ref="typeMessage"
          :title="password.title"
          :showForget="password.showForget"
          :passwordTips="password.passwordTips"
          @forgetPassword='forgetPassword'
        ></password-input>
        
        <prof-tips 
          v-if="typeMessage === 'profTips'"
          :ref="typeMessage"
          :profMessageContent='profMessageContent'
        ></prof-tips>

        <message-box
          v-if="typeMessage == 'messageBox'"
          :ref="typeMessage"
          :imageTipName='messageBoxContent.imageTipName'
          :messageText='messageBoxContent.messageText'
          :secondTip='messageBoxContent.secondTip'
        >
        </message-box>

          <message-box-new
          v-if="typeMessage == 'messageBoxNew'"
          :ref="typeMessage"
          :title='messageBoxNewContent.title'
          :imageTipName='messageBoxNewContent.imageTipName'
          :messageText='messageBoxNewContent.messageText'
          :secondTip='messageBoxNewContent.secondTip'
        >
        </message-box-new>
        
        <edit-box
          v-if="typeMessage == 'editBox'"
          :ref="typeMessage"
          :title="editBox.title"
          :options="editBox.options">
        </edit-box>

        <letter-box
          v-if="typeMessage == 'letterBox'"
          :ref="typeMessage"
          :title="letterBox.title"
          :letterContent="letterBox.letterContent"
          :tip="letterBox.tip">
        </letter-box>

        <table-box 
          v-if="typeMessage == 'tableBox'"
          :ref="typeMessage"
          :title="tableBox.title"
          :headerTableData="tableBox.headerTableData"
          :tableData="tableBox.tableData"
          :options="tableBox.options" ></table-box>

        <tips
          v-if="typeMessage == 'tips'"
          :ref="typeMessage"
          :tipList="tipsInfo.tipList">

        </tips>
      </section>

      <!----------- button wrap ----------------->
      <footer class="footer">
        <!-- confirm btn -->
        <!-- alert btn-->
        <div class="confirm-wrap">
          <button @click="canceled" class="confirm-btn cancel-btn" v-if="cancelText">
            <i v-show="cancel_icon.length > 0" class="btn-icon cancel-icon" :class="cancel_icon"></i>
            {{cancelText}}
          </button>
          <button class="confirm-btn" @click="confirmed" v-if="confirmText">
            <i v-show="confirm_icon.length > 0" class="btn-icon confirm-icon" :class="confirm_icon"></i>
            {{confirmText}}
          </button>
        </div>
      </footer>
    </article>
  </div>
</template>

<script type="text/babel">
/*
*@author liwei
*@author lianjf
*
* @param {string}     msg_icon                  提示图标       [reset, submit, edit, cancel | alert, question, warn, card-error(证件有误)]
* @param {string}     confirm_icon              确认按钮图标   [reload, upload, edit, smile,go]
* @param {string}     cancel_icon               取消按钮图标   [ smile, cancel, account(账号登录)，check(查看校验结果), refresh(刷新), service(呼叫人工)]
*
* @param {boolean}    showMsgBox                显示提示框       
* @param {string}     ownClass                  自定义class       
* @param {boolean}    hasMask                   是否有遮罩层              
* 
* @param {string}     messageText               提示文字
* @param {string}     cancelButtonText          取消按钮文字
* @param {string}     confirmButtonText         确认按钮文字
* @param {function}   confirmedAction           确认按钮操作的回调函数
* @param {function}   canceledAction            取消按钮事件
*  

*使用方法 
  this.alert("我正在加载中有完没完啊，我正在加载中")
  this.confirm({
    hasMask:true,
    messageText:'我正在加载中有完没完啊，我正在加载中',
    msg_icon: "reset",
    confirm_icon: "",
    cancel_icon: "",
    confirmButtonText:'重新测评',
    cancelButtonText:'取消', 
    ownClass:'movi', 
    confirmedAction:function(){console.log("可选的确认按钮点击事件")}
    canceledAction:function(){console.log("可选的取消按钮点击事件")}
  })

* this.alert('提示框')
* 
*
*/
import ErrorContent from "./content/error";
import UserMsgContent from './content/userMsg'
import CustEval from './content/custEvaluate'
import RelationshipMsg from './content/relationshipMsg'
import ThreeElement from './content/threeElement'
import readCardMsg from './content/readCardMsg'
import checkCode from './content/checkCode'
import profTips from './content/profType'
import password from './content/password'
import passwordInput from './content/passwordNew'
import messageBox from './content/messageBox'
import messageBoxNew from './content/messageBoxNew'
import editBox from './content/editBox'
import tableBox from './content/tableBox.vue'
import letterBox from './content/letterBox.vue'
import matchTip from './content/matchTip.vue'
import excl from "./content/excl.vue";
import userVerify from "./content/userVerify.vue"
import tips from "./content/tips.vue"

export default {
  name: "kui-message",
  components: {
    ErrorContent,
    UserMsgContent,
    CustEval,
    RelationshipMsg,
    ThreeElement,
    readCardMsg,
    checkCode,
    profTips,
    password,
    passwordInput,
    messageBox,
    messageBoxNew,
    editBox,
    tableBox,
    letterBox,
    matchTip,
    excl,
    userVerify,
    tips
  },
  data () {
    return {
      hasMask: true,
      messageText: "",
      typeMessage: "dialog",
      cancelButtonText: "",
      confirmButtonText: "确定",
      showMsgBox: false,
      isShowMsgBox: true,

      ownClass: "",
      validType: "",

      error_title: "",
      error_info: "",
      msg_icon: "question",
      confirm_icon: "",
      cancel_icon: "cancel",

      evaluate: { //评测弹框
        title: "",
        lv: "",
        info: "",
        point: 0
      },

      userMsg: {
        user_img: 'https://biz_complete/01.png',
        enter_name: '李远航',
        return_name: '王德发',
        enter_code: '356583199502215467',
        return_code: '441625199409225074'
      },
      password: {
        title: '',
        psd: '',
        info: '',
        errorText: '',
        showForget: false
      },
      passwordInput: {
        title: '',
        psd: '',
        info: '',
        errorText: '',
        showForget: false,
        passwordTips: ''
      },
      readCardMsg: {
        title: "系统信息校验结果",
        custName: "",
        custIdCode: "",
        cardName: "",
        cardIdCode: ""
      },
      checkCode: {
        title: "请输入验证码",
        imgSrc: ""
      },
      profMessageContent: {
        messageTitle: "请确认本次申请的专业投资者类型",
        messageProfType: "",
        messageExpDate: "",
      },
      messageBoxContent: {
        imageTipName: '',
        messageText: '',
        secondTip: ''
      },
      tip: {
        title: '',
        content: ''
      },
      messageBoxNewContent: {
        title: '',
        imageTipName: '',
        messageText: '',
        secondTip: ''
      },
      editBox:{
        title: '',
        options: {},
      },
      letterBox: {
        title: '',
        letterContent: '',
        tip: '',
      },
      tableBox:{
        title: '',
        options: {},
        headerTableData: [],
        tableData: []
      },
      tipsInfo: {
        tipList: []
      },
      excl: {
        exclTitle: '',
        exclArr: []
      },
      userVerifyInfo: {
        errorText: ""
      },
      keydownSure: false
    };
  },
  computed: {
    text () {
      return this.messageText.split('&')
    },
    confirmText () {
      return this.confirmButtonText;
    },
    cancelText () {
      return this.cancelButtonText;
    },
  },
  watch: {
    keydownSure(val){
        if (val) {
            this.confirmed();
        }
    },
    showMsgBox() {
      console.log(this.$refs)
      this.$nextTick(() => {
        console.log(this.$refs)
        this.keyPressInterceptor();
      })
      console.log("message-keypress");
    }
  },
  methods: {
    beforeConfirmAction() {
      let that = this;
      return new Promise((resolve,reject) => {
        if(that.$refs[that.typeMessage] && that.$refs[that.typeMessage]["beforeConfirmAction"]){
          resolve(that.$refs[that.typeMessage].beforeConfirmAction());
        }else{
          resolve(true);
        }
      })
    },
    afterConfirmAction(res) {
      let that = this;
      return new Promise((resolve,reject) => {
        if(that.$refs[that.typeMessage] && that.$refs[that.typeMessage]["afterConfirmAction"]){
          resolve(that.$refs[that.typeMessage].afterConfirmAction(res));
        }else{
          resolve(true);
        }
      })
    },
    confirmed () {
      let that = this;
      let isHideBoxInProcess = that.options && that.options.isHideBoxInProcess == '1' || false;
      // 这个地方判断一下是否存在参数，收集一下页面上的数据
      if (that.confirmedAction) {
        return that.beforeConfirmAction().then(res1 => {
          if(res1 === false){
            return;
          }else{
            if(isHideBoxInProcess) {
              that.isShowMsgBox = false;
            }
            return Promise.all([that.confirmedAction(res1 || {})]).then(res2 => {
              return that.afterConfirmAction(res2[0]).then(res3 => {
                that.isShowMsgBox = true;
                if(res3 !== false){
                  that.showMsgBox = false;
                  that.$emit("confirmed");
                }
              });
            })
          }
        })
      } else {
        that.showMsgBox = false;
        that.$emit("confirmed");
      }
    },
    canceled () {
      let that = this;
      this.showMsgBox = false;

      if (this.canceledAction) {
        this.canceledAction();
      } else {
        this.$emit("canceled");
      }
    },
    close() {
      this.showMsgBox = false;
    },
    // 收集一下页面上的数据
    collectParams() {
      console.log(this.$refs);
      if (this.$refs.password) {
        var params = {
          password: this.$refs.password.passwordValue,
          canPass: this.$refs.password.canPass,
        }
        return params
      }
    },
    additonalAction () {
      this.$emit("additonalAction");
    },
    forgetPassword() {
      console.log("forgetPasswordAction");
      this.showMsgBox = false;
      this.forgetPasswordAction && this.forgetPasswordAction();
    },
    keyPressInterceptor() {
      let that = this;
      // 实现对字符码的截获， keypress中屏蔽了这些功能按键
      that.$refs.messageTip && (that.$refs.messageTip.onkeypress = function(e) {
        console.log("that.$refs.messageTip.onkeypress");
        that.banBackSpace(e);
      })
      that.$refs.messageTip && (that.$refs.messageTip.onkeydown = function(e) {
        console.log("that.$refs.messageTip.onkeydown");
        that.banBackSpace(e);
      })
    },
    banBackSpace (e) {
      var ev = e || window.event;
      //各种浏览器下获取事件对象
      var obj = ev.relatedTarget || ev.srcElement || ev.target || ev.currentTarget;
      //按下Backspace键
      if (ev.keyCode == 8) {
        console.log('按了back')
        var tagName = obj.nodeName //标签名称
        //如果标签不是input或者textarea则阻止Backspace
        if (tagName != 'INPUT' 
        && tagName != 'TEXTAREA') {
          return this.stopIt(ev);
        }
        var tagType = obj.type.toUpperCase(); //标签类型
        //input标签除了下面几种类型，全部阻止Backspace
        if (tagName == 'INPUT' 
              && (tagType != 'TEXT' 
              && tagType != 'TEXTAREA' 
              && tagType != 'PASSWORD' 
              && tagType != 'NUMBER')) {
          return this.stopIt(ev);
        }
        //input或者textarea输入框如果不可编辑则阻止Backspace
        if ((tagName == 'INPUT' || tagName == 'TEXTAREA') 
            && (obj.readOnly == true || obj.disabled == true)) {
          return this.stopIt(ev);
        }
      } else if (ev.keyCode == 13) {
        this.keydownSure = true;
        setTimeout(() => {
          this.keydownSure = false;
        }, 1000)
      }
    },
    stopIt (ev) {
      if (ev.preventDefault) {
        //preventDefault()方法阻止元素发生默认的行为
        ev.preventDefault();
      }
      if (ev.returnValue) {
        //IE浏览器下用window.event.returnValue = false;实现阻止元素发生默认的行为
        ev.returnValue = false;
      }
      return false;
    },
  }
};
</script>


<style lang="less" scoped>
.message-box-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 3020;
  background: rgba(0, 0, 0, 0.6);
  &.no-mask {
    background: none;
  }
}
.sign-loading-wrap {
  box-sizing: border-box;
  position: relative;
  margin: 0 auto;
  width: 820px;
  min-height: 500px;
  border-radius: 10px;
  text-align: center;
  background: #fff;
  overflow: visible;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  .msg-icon {
    width: 128px;
    height: 128px;
    margin: 0 auto;
    background-size: 100% auto;
    position: relative;
    top: -64px;

    &.info{
      background-image: url('~@icons/common/icon-notic-info-small.svg');
    }
    &.question {
      background-image: url('~@icons/common/icon-question.svg');
    }
    &.warn {
      background-image: url('~@icons/common/icon-notice-info.svg');
    }
    &.lock {
      background-image: url('~@icons/common/icon-psw-big.svg')
    }
    &.error {
      background-image: url('~@icons/common/icon-error.svg');
    }
    &.edit {
      background-image:  url('~@icons/common/icon-sign-name.svg');
    }
  }
  .content {
    width: 100%;
    box-sizing: border-box;
    max-height: 800px;
    padding: 0 90px;
    overflow: visible;
    .dialog{
      .message-text {
        width: 100%;
        // margin-top: 72px;
        box-sizing: border-box;
        display: inline-block;
        font-weight:700;
        color:#222222;
        font-size:32px;
        line-height:48px;
      }
    }
  }
  .footer{
    width: 100%;
    height: 160px;
    align-self: flex-end;
    .confirm-wrap{
      border:none;
      display: flex;
      justify-content:center;
      align-items: center;
      height: 160px;
      .confirm-btn{
        background-image:linear-gradient(90deg,#3b6aff 0%,#208bff 100%);
        color: #fffdfd;
        font-weight:500;
        font-size:24px;
        width: 170px;
        height: 60px;
        border-radius: 2px;
        flex-grow:0;
        border:none;
        &.cancel-btn{
          background: #ffffff;
          color: #3b6aff;
          box-sizing: border-box;
          border:1px solid #3b6aff;
          margin-right: 48px;
        }
      }
    }
  }
  &.sign-loading-wrap--letterBox {
    display: block;
    .content {
      padding: 0 50px;
      margin-top: -64px;
    }
    .footer {
      margin-top: 0px;
    }
  }
  &.sign-loading-wrap--dialog {
    width: 820px;
    min-height: 500px;
    .msg-icon {
      width: 128px;
      height: 128px;
    }
  }
  &.sign-loading-wrap--matchTip {
    width: 900px;
  }
  &.sign-loading-wrap--relationship {
    width: 1000px;
    min-height: 800px;
    .content {
      padding: 0;
    }
    .confirm-wrap {
      align-items: center;
      justify-content: center;
      .confirm-btn {
        .confirm-icon {
          display: none;
        }
        flex: 0 0 220px;
        height: 80px;
        font-size: 32px;
        font-weight: 500;
        color: #fff;
        background: linear-gradient(
          45deg,
          rgba(53, 86, 221, 1),
          rgba(70, 103, 233, 1)
        );
        border-radius: 4px;
      }
    }
  }
  &.sign-loading-wrap--readCardMsg {
    .content {
      padding: 0;
    }
  }
  &.sign-loading-wrap--custeval{
    width: 1020px;
    height: 714px;
    overflow: visible;
    .content{
      padding: 0;
      overflow: visible;
    }
  }
  &.sign-loading-wrap--excl {
    width: 1020px;
    height: 714px;
    overflow: visible;
    .content{
      padding: 0;
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
    }
  }
  &.sign-loading-wrap--verify {
    width: 900px;
    height: 640px;
    .content {
      display: flex;
      height: 321px;
    }
  }
  &.sign-loading-wrap--tips {
    width: 1390px;
    height: 900px;
    .content {
      padding: 0;
      position: absolute;
      top: 70px;
    }
  }
  &.sign-loading-wrap--profTips {
    width: 826px;
    height: 560px;
    min-height: 560px;
    position: relative;
    overflow: inherit;
    .content{
      padding: 0px;
    }
  }
  &.sign-loading-wrap--password {
    width: 900px;
  }
  &.sign-loading-wrap--editBox{
    .content{
      width: 100%;
      padding: 0 50px;
    }
  }
  &.sign-loading-wrap--tableBox {
    width: 1200px;
    box-sizing: border-box;
    .content {
      padding: 0 30px;
    }
  }
}
</style>