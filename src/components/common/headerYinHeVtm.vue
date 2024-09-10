<template>
  <div class="yinhe-vtm-header-wrapper">
    <div class="headerVtm-contrainer">
      <!-- 左边侧 分为 两种 ，一种显示券商logo+时间 一种显示菜单标题+时间 由路由配置控制-->
      <div class='left-view-log' v-show="showLogo"> 
        <div class="logo-img" @click="$emit('request-menu')"><img :src="leftMenuLogo"></div>
        <div class="sysTime">{{currentTime}}</div>
        <div v-if="isForTest && !userIsLogin" class="sysEnv-no-break-line">
          {{sysEveText}}
        </div>
        <div v-else-if="isForTest && userIsLogin" class="sysEnv-break-line">
          {{userInfo && userInfo.ORG_NAME ? sysEveText + `
          ` + userInfo.ORG_NAME : sysEveText}}
        </div>
        <div v-else-if="userIsLogin" class="sysEnv-no-break-line">
          {{userInfo.ORG_NAME}}
        </div>
      </div>
      <div class="left-view-busi" v-show="!showLogo">
        <div class="busiName"> {{title}}</div>
        <div class="sysTime">{{currentTime}}</div>
      </div>
      <!-- 右侧 固定一个home按钮（默认显示。可以由路由配置隐藏） +右边一个按钮；右边按钮 分为未登录跟登录两种，未登录 显示登录按钮，左边登录的图标右边文字； 登录为退出按钮，右边文字左边图标 -->
      <div class='gotoHome' v-show='showRight' > 
        <el-button :class= "showClass2?'homeBtn':'homeBtn homeBtn2'" v-show="showHome" @click="$emit('left-click', 'onBackHome')"> 
          <div class='right-view right-view-noLogin'>
          <div class="login-img right-img"><img :src="require('@icons/yinheVTM/headerVtm/icon-go-index.svg')"></div>
          <div class="sysTime right-text">返回首页</div>
          </div>
        </el-button>
        <div class='right-view right-view-Login'  v-show='showLogoutBtn'> 
          <div class="custName right-text" @click="custNameClick()">
            {{custName}}
            <i class="el-icon-caret-bottom" v-if="show360icon()"></i>
          </div>
          <div class="log-out-img right-img" @click="$emit('left-click', 'loginOut')">
            <img :src="require('@icons/yinheVTM/headerVtm/icon-user-logout.svg')">
            <span class="log-out-word">退出</span>
          </div>
        </div>
        <div class='right-view right-view-noLogin' v-show='showLoginBtn' @click="$emit('left-click', 'login')"> 
          <div class="login-img right-img"><img :src="require('@icons/yinheVTM/headerVtm/icon-login-user.svg')"></div>
          <div class="sysTime right-text">欢迎登录</div>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="showCustInfo" :append-to-body='true' width="550px"  :modal="false" custom-class="cust-info" :show-close="false" top="100px">
      <span class="caret"><i class="el-icon-caret-top"></i></span>
      <div class="info-box">
        <div class="cust-head-icon"><img :src="custImg" onerror="imgOnError($event);"></div>
        <div class="cust-info-wrap">
          <div class="cust-name">{{custName}}</div>
          <div class="cuacct"><span class="label">资金账号：</span>{{custInfo.CUACCT_CODE}}</div>
          <div class="idcode"><span class="label">证件号码：</span>{{custInfo.ID_CODE}}</div>
          <!-- <div class="more-info" @click="showMoreInfo">查看更多...</div> -->
        </div>
      </div>
      <div class="border-line"></div>
      <div class="show-info-busi">
        <div class="info-busi-btn info-btn" @click="showMoreInfo">我的资料</div>
        <div class="btn-line"></div>
        <div class="info-busi-btn busi-btn" @click="showTask">我的业务</div>
      </div>
    </el-dialog>
    <cust360 ref="cust360" v-if='isShowCust360' @close360="close360" > </cust360>
    <cust-task ref="custTask" v-if='isShowTask' @closeTask="closeTask"></cust-task>
  </div>
</template>

<script>
import navStep from "./navStep.vue";
import date from '../../tools/date.js';
import imageConfig from '../../config/imageConfig'
import baseConfig from '../../config/baseConfig'
import cust360 from './cust360.vue'
import custTask from '../../pages/custTask/custTask.vue'

export default {
    data() {
      return {
        currentTime:"",
        timerInt:null,
        leftMenuLogo:imageConfig.$imgcfg[baseConfig.$basecfg.qsVersion].leftMenuLogo,
        userTypeText:"",
        showCustInfo:false,
        isShowCust360: false,
        isShowTask: false,
        custImg: require("@icons/yinheVTM/icon-user-head-big.svg"),
        recorder: null
      }
    },
    components: {
      navStep,
      cust360,
      custTask,
    },
    computed: {
      busiName(){
        return this.$storage.getSession(this.$definecfg.BUSI_NAME);
      },
      isAidedUserLogin() {
        return this.$store.state.isAidedUserLogin;
      },
      aidedUserInfo() {
        return this.$store.state.aidedUserInfo;
      },
      custName(){
        if (this.isAidedUserLogin == "1") {
          //路由跳转时，重新加载计算属性
          let route = this.$store.state.route;
          return this.aidedUserInfo.USER_NAME
        } else {
          let custInfo = this.$storage.getJsonSession(this.$definecfg.CUSTOMER_INFO);
          //路由跳转时，重新加载计算属性
          let route = this.$store.state.route;
          if(custInfo && custInfo.USER_TYPE == "0"){
            return custInfo && custInfo.CUST_FNAME || (this.$store.state.custInfo && this.$store.state.custInfo.CUST_FNAME);
          }else if (custInfo && custInfo.USER_TYPE != "0"){
            return custInfo && custInfo.CUST_NAME || (this.$store.state.custInfo && this.$store.state.custInfo.CUST_NAME);
          }
        }
      },
      isOpenAcctBiz() {
        return this.$syscfg.isOpenAcctBiz(this.$store.state.busicode);
      },
      isCustLogin(){
        //路由跳转时，重新加载计算属性
        let route = this.$store.state.route;
        return this.$syscfg.isCustLogin();
      },
      showRight(){
        return this.$route.meta.showRight !== false
      },
      showLogOut(){
        return this.$route.meta.showLogOut !== false
      },
      showLogIn(){
        return this.$route.meta.showLogIn !== false
      },
      showLogo () {
        return this.$route.meta.showLogo; 
      },
      showHome () {
        // 柜员没登录 走之前逻辑
        return (this.$route.meta.showHome !== false && this.isAidedUserLogin == "0") 
        // 客户登录了 还需保证当前页面登录后不展示返回首页的按钮
        || (this.$route.meta.showHome !== false && !this.$route.meta.loginNotShowHome && this.isAidedUserLogin == "1"); 
      },
      showLogoutBtn(){
        return (this.isAidedUserLogin == "1" || this.isCustLogin) && this.showLogOut
      },
      showLoginBtn(){
        return (this.isAidedUserLogin == "0") && !this.isCustLogin && this.showLogIn && !this.$syscfg.isOpenAcctBiz(this.$store.state.busicode) 
      },
      showClass2(){
        return this.showLoginBtn || this.showLogoutBtn;
      },
      userType() {
          return this.$store.state.usertype;
      },
      custInfo() {
        let route = this.$store.state.route;
        return this.$storage.getJsonSession(this.$definecfg.CUSTOMER_INFO) || {};
      },
      userInfo() {
        return this.$store.state.postInfo || {}
      },
      userIsLogin() {
        return this.$store.state.isPostLogin;
      }
    },
    watch: {
      showCustInfo(val) {
        if (val) {
          this.custImg = this.$storage.getSession(this.$definecfg.HISTORY_IMG_SRC) || require("@icons/yinheVTM/icon-user-head-big.svg");
        }
      },

    },
    props: {
      title: String,
      useNavStep: Boolean,
      showBigHeader:Boolean,
      isForTest: Boolean,
      sysEveText: String,
    },
    
    methods: {
      custNameClick(){
        !this.isOpenAcctBiz && this.$storage.getJsonSession(this.$definecfg.IS_PASSWORD_LOGIN) == true && (this.showCustInfo = !this.showCustInfo);
      },
      show360icon(){
        return (this.isAidedUserLogin == "0") && !this.isOpenAcctBiz && (_.indexOf(["V0131"],this.$store.state.busicode) == -1)  && this.$storage.getJsonSession(this.$definecfg.IS_PASSWORD_LOGIN) == true;
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
      imgOnError(event){
        let img = event.currentTarget;
        img.src = require("@icons/yinheVTM/icon-user-head-big.svg");
        img.onerror = null;
      },
      showMoreInfo(){
        this.isShowCust360 = true;
        this.showCustInfo = false;
      },
      showTask() {
        this.showCustInfo = false;
        this.isShowTask = true;
      },
      closeTask() {
        this.isShowTask = false;
      },
      close360 () {
        this.isShowCust360 = false;
      },
      getSysTime() {
          this.$syscfg.getSysDateTime().then(res => {
            let date = res.substring(0, 4) + "-" + res.substring(4, 6) + "-" + res.substring(6, 8) + res.substring(8)
            let startTime = new Date(date);
            this.timeFormate(startTime);
            let nextTime = startTime.getTime();
            this.timerInt = setInterval(()=>{
              nextTime += 1000;
              this.timeFormate(nextTime);
            },1000)
          }).catch(err => {
            console.error(err)
            console.error(err)
            this.messageBox({
              messageText: '网络异常请重试',
              confirmedAction: () => {
                this.getSysTime();
              },
              cancelButtonText: '取消',
              confirmButtonText: '重试',
            });
          })
      }
    }, 
    created() {
      console.log("headerYiHeVtm.vue created");
    },
    beforeMount() {
      console.log("headerYiHeVtm.vue beforeMount")
    },
    mounted() {
      console.log("headerYiHeVtm.vue mounted");
      this.getSysTime();
    },
    destroyed() {
      clearInterval(this.timerInt);
    },
};
</script>

<style lang="less" scoped>
@import '../../styles/less/variable.less';

.yinhe-vtm-header-wrapper {
  height: 120px;
  position: absolute;
  //z-index: 3;
  width: 100%;
  .imgBgClass{
    width: 100%;
  }
  .headerVtm-contrainer{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    box-sizing: border-box;
    padding: 0 57px;
    .left-view-busi{
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100%;
      .busiName{
        font-size: 28px;
        padding-left:20px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 36px;
        letter-spacing: 0px;
        color: #fffdfd;
      }
      .sysTime{
        padding-left:20px;
        width: 450px;
        font-size: 22px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 35px;
        letter-spacing: 0px;
        color: #ffffff;
      }
    }
    .left-view-log{
      display: flex;
      justify-content: center;
      align-items: center;
      .logo-img{
      }
      .sysTime{
        font-family: Alibaba PuHuiTi;
        color: #ffffff;
        font-size: 28px;
        margin-left: 41px;
      }
      .sysEnv-break-line {
        margin-left: 41px;
        font-size: 28px;
        color: #FFF;
        white-space: pre-line;
      }
      
      .sysEnv-no-break-line {
        margin-left: 41px;
        font-size: 28px;
        color: #FFF;
        white-space: nowrap;
      }
    }
    .gotoHome{
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .homeBtn{
        background: initial;
        border: 0;
        padding: 0 26px 0;
        width: 230px;
        border-right: 1px solid white;
      }
      .homeBtn2{
        border-right: 0;
      }
      .right-view {
        display: flex;
        height: 40px;
        .right-img{
          margin: 0 0 0 26px;
        }
        .custName{
          margin-left: 24px;
          margin-right: 0;
        }
        .log-out-img{
          display: flex;
          align-items: center;
          .log-out-word{
            margin-left: 5px;
            font-size: 28px;
            color: #FFF;
          }
        } 
      }
      .right-text{
        font-size: 26px;
        line-height: 40px;
        color: rgba(255, 255, 255, 1);
        margin-left: 14px;
      }
    }
  }
}
.el-dialog__wrapper{
    /deep/.el-dialog.cust-info{
      float: right;
      margin-right: 90px;
      border-radius: 8px;
      box-shadow: 0px 6px 32px rgba(0, 0, 0, 0.06);
      .el-dialog__header{
        display: none;
      }
      .el-dialog__body{
        padding: 30px 35px;
        .caret{
          font-size: 30px;
          color: #fff;
          position: absolute;
          top: -22px;
          right: 84px;
        }
        .info-box{
          display: flex;
          .cust-head-icon{
            margin-right: 20px;
            >img{
              width: 88px;
              height: 88px;
            }
          }
          .cust-info-wrap{
            padding-top: 10px;
            .cust-name{
              color:#252525;
              font-size:32px;
              line-height:48px;
              margin-bottom: 10px;
            }
            .cuacct,.idcode{
              color:#666666;
              font-size:22px;
              line-height:32px;
              margin-bottom: 20px;
              .label{
                color: #252525;
              }
            }
            .more-info{
              color:#3b6aff;
              font-size:22px;
              line-height:32px;
            }
          }
        }
        .border-line {
          width: 549px;
          height: 1px;
          position: absolute;
          left: 0px;
          background: #cecece;
        }
        .show-info-busi {
          width: 551px;
          height: 43px;
          position: relative;
          display: flex;
          left: -35px;
          line-height: 75px;
          font-size: 24px;
          color: #4566ec;
          .info-busi-btn {
            width: 50%;
            text-align: center;
          }
          .btn-line {
            height: 74px;
            width: 1px;
            position: absolute;
            //bottom: 0px;
            left: 275px;
            background: #cecece;
          }
        }
      }
    }
  }
@media (max-width: 850px) {
}

@media (max-width: 700px) {
    .header {
      .container {
        padding: 0 12px;
      }
    }
}
</style>