/**
  1.公安联网校验
 */
<template>
  <div>
    <div class="police-check-wrap" v-show="!isPass">
      <div class="contentResult">
          公安联网校验界面
      </div>
    </div>
    <loading :showLoading='loading' :loadingStatue='loadingStatue' :loadingText='loadingText'></loading> 
    <loading-page :showLoadingPage="showLoadingPage" :loadingContents='loadingContents' :loadingInterTimeStep='loadingInterTimeStep' :loadingTextRepeatBool='loadingTextRepeatBool'></loading-page>
  </div>
</template>

<script>
import { googlePlayVoice, googleStopVoice } from "../../device/voice/voice"
import custSerivce from "../../service/cust-service.js";
import csdcService from "../../service/csdc-service.js"
import loading from '../../components/common/loading'
import loadingPage from '../../components/common/loadingPage'

export default {
  data() {
    return {
      custData:{},
      loading:"",
      loadingStatue:"progress",
      loadingText:"",
      isPass: true, //是否通过公安联网校验
      showLoadingPage: false,
      loadingContents: "",
      loadingInterTimeStep:"",
      loadingTextRepeatBool:"",
    };
  },
  components: {
    loading,
    loadingPage
  },
  computed: {
    cardData(){
      return this.$store.state.cardData || {};
    },
    customerInfo(){
      return this.$storage.getJsonSession(this.$definecfg.CUSTOMER_INFO);
    },
    userType() {
      return this.$store.state.usertype;
    },
  },
  props:['isJustCustLogin' ,'busiCode'],
  mounted() {
    this.initPage();
  },
  activated() {
    this.initPage();
  },
  methods: {
    initPage() {
      let that = this;
      that.$syscfg.getSysConfig('IS_MUST_POLICE_VALIDATE').then((data) => {
        if(data.Code == 0){
          //公安联网校验通过系统公参控制是否校验 1：校验 0：不校验
          if(data.Data[0] && data.Data[0].PAR_VAL == '0'){
            //公安联网校验后一项必做人脸识别
            that.$router.replace({ name: "readFace", params: {isJustCustLogin: true, busiCode: that.busiCode} });
          }else{
            that.initCheck();
          }
        }else{
          that.alert('是否公安联网校验--系统公共参数查询失败')
        }
      });
    },
    initCheck(){
      let that = this;
      // 个人客户取客户信息
      if (that.userType == "0") {
        that.custData = that.$storage.getJsonSession(that.$definecfg.CUSTOMER_INFO) || {};
      }
      //机构客户取经办人信息
      else {
        that.custData = that.$storage.getJsonSession(that.$definecfg.ORG_CURRENT_AGENT) || {};
      }
      //读卡支持港澳台居住证和身份证 所有需要公安联网校验
      if(that.custData.ID_TYPE == '00' ){
        //公安联网校验
        that.runPoliceValidate();
      }else{ 
        that.$router.replace({ name: "readFace", params: {isJustCustLogin: true, busiCode: that.busiCode} });
      }
    },
    getPoliceCheckData() {
      let custData = this.custData; //客户登录进行公安联网校验的数据一定是系统内的
      return {
          ID_CODE: custData.ID_CODE,
          USER_NAME: custData.CUST_FNAME || custData.CUST_NAME || custData.USER_FNAME || custData.USER_NAME || custData.ASSOCIATE_NAME,
      }
    },
    getCsdcCheckData() {
      let custData = this.custData;
      return {
        CUST_FNAME: custData.CUST_FNAME || custData.CUST_NAME || custData.USER_FNAME || custData.USER_NAME || custData.ASSOCIATE_NAME,
        ID_TYPE: custData.ID_TYPE,
        ID_CODE: custData.ID_CODE,
        USER_TYPE: "0",
      }
    },
    goToNext() {

    },
    runPoliceValidate(){
      let that = this;
      that.showLoadingPage = true;
      that.loadingContents = ['公安联网校验中.....']
      let csdcParams = that.getCsdcCheckData();
      // 目前想做的是 先进行中登身份校验，中登校验不通过时再进行
      return csdcService.validate(csdcParams).then(res => {
        
        console.log(res)
        // 如果中登校验 通过则直接下一步
        if (res && res.ISSAMEFLAG) {
          // 中登头像数据   res.CSDCCUSTINFO.IMG_DATA
          that.$storage.setSession(that.$definecfg.POLICE_IMG_DATA, res.CSDCCUSTINFO.IMG_DATA);
          that.$storage.setSession(that.$definecfg.POLICE_VALID_PASS_FLAG, '1');
          that.$router.replace({ 
            name: "readFace", 
            params: {
              isJustCustLogin: true, 
              busiCode: that.busiCode
            }
          });
          
        } else {
          let params = that.getPoliceCheckData();
          return custSerivce.runPoliceValidate(params).then(function (resultData) {
            if(resultData.flag){
              that.$storage.setSession(that.$definecfg.POLICE_IMG_DATA, resultData.IMG_DATA);
              that.$storage.setSession(that.$definecfg.POLICE_VALID_PASS_FLAG, '1');
              // 校验成功
              that.$router.replace({ 
                name: "readFace", 
                params: {
                  isJustCustLogin: true, 
                  busiCode: that.busiCode
                } 
              });
            }
            // 校验过程中接口出错
            else if (resultData.isError){
              that.policeValidateFaild(`公安联网校验失败，请联系现场工作人员协助处理！`);
            }
            // 单纯校验失败
            else {
              that.policeValidateFaild(`公安联网校验失败，请联系现场工作人员协助处理！`);
              // that.isPass = false;
              // googlePlayVoice('公安联网校验失败，请联系现场工作人员协助处理！');
            }
          }).catch(err => {
            that.policeValidateFaild(`公安联网校验失败，请联系现场工作人员协助处理！`);
          })
        }
      }).finally(() => {
        setTimeout(() => {
          that.showLoadingPage = false;
        }, 2000);
      })
    },
    policeValidateFaild(message){
      let that = this;
      googlePlayVoice(message);
      setTimeout(() => {
        that.messageBox({
          typeMessage: 'error',
          imageTipName: 'error',
          messageText: '公安联网校验失败',
          secondTip: '请点击返回首页，或联系现场工作人员处理',
          confirmedAction: function() {
            that.$router.push({path: that.$bizhomecfg.getHomeCustomerConfig()});
          }
        })
      }, 1000);
    },
    goHome(){
      //必须清掉客户信息，不然无法退出登录
      this.$storage.removeSession(this.$definecfg.CUSTOMER_INFO)
      this.$router.replace({path: this.$bizhomecfg.getHomeConfig()});
    },
    
  },
  destroyed() {
    googleStopVoice();
  }
};
</script>

<style lang="less" scoped>
.police-check-wrap{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0, .5);
  border-radius: 4px;
  position: fixed;
  top: 0;
  left: 0;
  .contentResult {
    width: 68%;
    height: 77%;
    background: #fff;
    border-radius: 8px;
    position: relative;
    .policeImg {
      width: 120px;
      height: 120px;
      right: 164px;
      top: 237px;
      background: gainsboro;
      position: absolute;
    }
    .mainImg{
      position: fixed;
      top: 63px;
      left: 900px;
    }
    .helpImgBox{
      float: right;
      width: 249px;
      height: 70px;
    }
    .policeValidate {
      margin-top: 110px;
      .checkTitle {
        text-align: center;
        font-size: 36px;
        font-weight: 700;
        color: #1f1f1f;
      }
      .resultContent {
        border: 1px solid #c3c3c3;
        width: 80%;
        margin: 0 auto;
        margin-top: 25px;
        border-radius: 8px;
        .resultTitle {
          .titleRow {
            display: flex;
            background-color: #f4f4f4;
            border-radius: 8px 8px 0 0;
            font-size: 24px;
            line-height: 46px;
            color: black;
            font-weight: 700;
            .labelTitle {
              width: 18.1%;
            }
            .localTitle {
              width: 40%;
              border-left: 1px solid #cfc6c6;
              padding-left: 33px;
            }
            .policeTitle {
              width: 40%;
              border-left: 1px solid #cfc6c6;
              padding-left: 33px;
            }
          }
        }
        .policeResultContent {
          .resultRow {
            display: flex;
            font-size: 24px;
            line-height: 36px;
            /* width: 100%; */
            height: 400px;
            .label {
              width: 168px;
              padding-right: 20px;
              padding-top: 10px;
              text-align: right;
              color: black;
            }
            .localResult {
              width: 40%;
              padding-top: 10px;
              border-left: 1px solid #cfc6c6;
              padding-left: 33px;
              color: #403434;
            }
            .policeResult {
              width: 40%;
              padding-top: 10px;
              border-left: 1px solid #cfc6c6;
              padding-left: 33px;
              color: #403434;
            }
            .content {
              width: 330px;
            }
          }
        }
      }
    }
    .tips {
      text-align: center;
      margin-top: 24px;
      font-size: 24px;
      color: #2f2f2f;
    }
    .exitLogin {
      text-align: center;
      margin-top: 35px;
      .el-button {
        width: 200px;
        height: 60px;
        font-size: 24px;
        color: #1951cf;
        border: 1px solid #4680ff;
      }
    }
  }
}
</style>