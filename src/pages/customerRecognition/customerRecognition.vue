/**
  开户三要素添加
 */

<template>
  <div class="icustomer-recoginition-wrap">
    <div class="customerloginmain">
      <div class="loginImgBox">
        <div class='title'>{{title}}</div>
        <img src="../../icons/yinheVTM/pic/pic-keybroad-psw.png">
      </div>
      <div class="customer-recoginition-contenet">
        <div class="inputCustInfo">
          <div class="loginTitleItem" label-width="0px" size='mini'>
            <p class="loginTitle">开户资料录入</p>
            <p class="loginSubTitle">{{subTitle}}</p>
            <div class='loginErrorBlock' v-show='showErrorMsg'>
              <img src='../../icons/common/warning.svg'><a class='loginError'>{{loginErrorMsg}}</a>
            </div>
          </div>
          <el-form :class="userType != '0' ? 'noPerson' : ''" ref="custInfo">
            <k-input id="CUST_FNAME" la label="名称" :labelWidth='120' :width="380" placeholder="请输入名称"
              :value.sync="inputCustInfo.CUST_FNAME" :validtype="custFnameValidType" :disabled="custFnameDisable"
              required />
            <k-selector class="selectClass" id="ID_TYPE" label="证件类型" :labelWidth='120' :width="380"
              placeholder="请选择证件类型" :value.sync="inputCustInfo.ID_TYPE" :dicts="ID_TYPE_ARR" :disabled="idTypeDisable"
              :dictfilter="idTypeDictfilter" required :fieldChange="checkIdType" />
            <k-input id="ID_CODE" label="证件号码" :labelWidth='120' :width="380" placeholder="请输入证件号码"
              :value.sync="inputCustInfo.ID_CODE" :validtype="idCodeValidtype" :disabled="idcodeDisable" required
              :fieldChange="checkIdCode" />
            <k-input class="ORG_ID_CODE" v-if="userType != '0'" :labelWidth='120' :width="380" id="ORG_ID_CODE"
              label="组织机构代码证" placeholder="请输入组织机构代码证" :value.sync="inputCustInfo.ORG_ID_CODE"
              :validtype="orgIdCodeValidtype" :disabled="orgIdcodeDisable" required :fieldChange="checkOrgIdCode" />
          </el-form>
          <div class="buttonSubmit">
            <el-button @click="gotoNext">开户</el-button>
          </div>
        </div>
        <div class="other-login-content">
          <el-button class="other-login" @click="jumpTo">{{readCardText}}</el-button>
        </div>
      </div>
    </div>
    <police-validate v-if="showPoliceValidate" @re-check="reCheckPolice"></police-validate>
    <loading :showLoading='isLoading' loadingText='正在初始化'></loading>
  </div>
</template>

<script>
import custService from "../../service/cust-service"
import kInput from '../../components/baseUI/kInput'
import kSelector from '../../components/baseUI/kSelector'
import messageBox from '../../components/common/messageBox'
import loading from '../../components/common/loading'
import {getCustName} from '../../tools/util'
import policeValidate from '../policevalidate/policeValidate'
import bizPublicMethod from "../../business/businessTools/bizPublicMethod.js"
export default {
  data() {
    return {
      custInfo: '', //客户信息
      allFieldDictValsObj: {}, //所有字段值的字典项
      inputCustInfo:{
        CUST_FNAME: '',
        ID_TYPE: '',
        ID_CODE: '',
        ORG_ID_CODE: ''
      },
      ID_TYPE_ARR: [],
      //中泰 个人开户姓名只能输入中英文数字跟. 北京ca不支持其他的字符 不然无法签名
      custFnameValidType: "val[4,256]|on-blur",
      idCodeValidtype: "en_num_sym[1,64]|on-blur",
      orgIdCodeValidtype: "numCharMinus[4,32]|on-blur",
      idTypeDisable: false,
      custFnameDisable: false,
      idcodeDisable: false,
      idCodepromptvalue:'',
      idTypeDictfilter: [],
      isLoading:true, 
      canNotChange: false,
      title: '请在下屏录入姓名、证件类型、证件号码',
      readCardText:"读卡识别 >",
      loginErrorMsg: "",
      showErrorMsg:"",
      showPoliceValidate: false,
      subTitle: "",
      orgIdcodeDisable: false,
    }; 
  },
  components:{
    kInput,
    kSelector,
    messageBox,
    loading,
    policeValidate
  },
  created() {
    let that = this;
    this.initSubTitle();
    Promise.all([
      //获取该业务对应的可用证件类型
      custService.queryValidIDType(this.userType)
    ]).then((res) => {
      console.log("查询结果", res)
      //将所有字段的字典值请求回来存放在data里面
      that.ID_TYPE_ARR = res[0] && res[0] || []
      // 个人客户新开户时无需展示02-军官证、03-士兵证、04-回乡证、05-户口本证件、09-其他证件
      that.ID_TYPE_ARR =  that.ID_TYPE_ARR.filter(v=>{
        return !["02","03","04","05", "09"].includes(v.DICT_ITEM) 
      })
      // 机构、产品开户无需展示 14-境外有效商业登记证明文件、19-其它证书
      that.ID_TYPE_ARR =  that.ID_TYPE_ARR.filter(v=>{
        return !["14", "19"].includes(v.DICT_ITEM);
      })
      that.$nextTick(()=>{
        if(that.bizConfig.supportIdType && that.bizConfig.supportIdType.length > 1){
          that.idTypeDictfilter = that.bizConfig.supportIdType;
          that.idTypeDisable = false;
        }else if(that.bizConfig.supportIdType && that.bizConfig.supportIdType.length == 1){
          that.idTypeDictfilter = that.bizConfig.supportIdType;
          that.idTypeDisable = true;
          that.inputCustInfo.ID_TYPE = that.bizConfig.supportIdType[0];
        }else{
          that.idTypeDictfilter = [];
          that.idTypeDisable = false;
          that.inputCustInfo.ID_TYPE = "";
        }
        //如果有读卡信息则自动回填 禁止编辑
        if(!_.isEmpty(that.cardData)){
          that.inputCustInfo.CUST_FNAME = that.cardData.CUST_FNAME;
          that.inputCustInfo.ID_TYPE = that.cardData.ID_TYPE;
          that.inputCustInfo.ID_CODE = that.cardData.ID_CODE;
          that.custFnameDisable = true;
          that.idcodeDisable = true;
          that.idTypeDisable = true;
          that.idCodepromptvalue = that.cardData.ID_CODE
        }
      })

      that.isLoading = false;
    });
  },
  computed: {
    busiCode() {
      return this.$store.state.busicode || '';
    },
    userType(){
      return this.$store.state.usertype;
    },
    cardData(){
      return this.$store.state.cardData || {};
    },
    userInfo: function() {
       return this.$storage.getJsonSession(this.$definecfg.USER_INFO) || {};
    },
    bizConfig() {
      return this.$bizcfg.getBizConfig(this.busiCode, this.userType);
    },
  },
  watch: {
  },
  methods: {
    validateField: async function(refName){
      let that = this,
          isPass = true;
      //先校验基本信息里面所有必填字段
      return new Promise((resolve,reject)=>{
        that.$refs[refName].$children.forEach(function(bNode){
          bNode.$children[0].$refs[bNode.id].validate("blur");
          bNode.$children[0].$refs[bNode.id].validate("custom");
          console.log("主动触发各个子组件的事件",  bNode.$children[0].$refs[bNode.id])
        })
        that.$nextTick(()=>{
          that.$refs[refName].$children.forEach(function(bNode){
            console.log("bNode.field.correct",bNode.field.correct)
            if(!bNode.field.correct){ //校验不通过
              isPass = false
            };
          })
          console.log(" resolve(isPass)",isPass)
          resolve(isPass)
        })
      })
    },  
    checkIdType(field){
      let idType = field.DEFAULT_VALUE;
      this.$refs.custInfo.$children[2].field.message=""
      if (_.isEmpty(this.cardData) && idType != field.lastDefalut) {
        this.inputCustInfo.ORG_ID_CODE = "";
        this.inputCustInfo.ID_CODE = "";
      }
      field.lastDefalut = idType;
      this.orgIdcodeDisable = false;
      //根据证件类型更新证件号码校验规则
      this.idCodeValidtype = this.$blMethod.getIdCodeValidType(idType);
      
    },
    checkIdCode(field) {
      this.orgIdcodeDisable = false;
      if (field.DEFAULT_VALUE != field.lastDefalut) {
        this.inputCustInfo.ORG_ID_CODE = "";
      }
      field.lastDefalut = field.DEFAULT_VALUE;
      if (this.isAbleToAutofillOrgIdCode(this.inputCustInfo.ID_TYPE, field)) {
            this.autofillOrgIdCode(field.DEFAULT_VALUE);
      }
    },
    isAbleToAutofillOrgIdCode(idType, idCodeField) {
      let idCodeLength = idCodeField.DEFAULT_VALUE.length;
      // return idType == "10" && (idCodeLength == 18 || idCodeLength == 24);
      return idType == "10" && idCodeLength == 18;
    },
    autofillOrgIdCode(idCode) {
        this.inputCustInfo.ORG_ID_CODE = this.parseOrgIdCode(idCode);
        this.orgIdcodeDisable = true;
    },
    parseOrgIdCode(idCode) {
      let orgIdCode = "";
      if (typeof idCode == "string" && idCode.length == 18) {
          orgIdCode = idCode.substring(8, 16) + "-" + idCode.substr(16, 1);
      } 
      // if (typeof idCode == "string" && idCode.length == 24) {
      //     orgIdCode = idCode.substring(15, 23) + "-" + idCode.substr(23, 1);
      // }
      return orgIdCode;
    },
    checkOrgIdCode(field) {

    },
    gotoNext(){
      let that = this;
      that.validateField("custInfo").then(function(flag){
        console.log("flag==",flag)
        if(!flag){
           that.messageBox({
            hasMask:true,
            messageText:"请输入正确的客户信息",
            confirmButtonText:'确定',
            showMsgBox:true, 
            typeMessage: "warn",
          })
          return false
        }else{
          let userInfo = that.$storage.getJsonSession(that.$definecfg.USER_INFO);
          let OPEN_ORG_INFO = that.$storage.getJsonSession(that.$definecfg.OPEN_ORG_INFO) || {};
          that.inputCustInfo.USER_TYPE = that.userType;
          that.inputCustInfo.USER_FNAME =  that.inputCustInfo.CUST_FNAME;
          that.inputCustInfo.CUST_NAME =  getCustName(that.inputCustInfo.CUST_FNAME);
          that.inputCustInfo.USER_NAME =  that.inputCustInfo.CUST_FNAME;
          that.inputCustInfo.CUST_FNAME =  that.inputCustInfo.CUST_FNAME;
          that.inputCustInfo.ID_CODE = _.trim(that.inputCustInfo.ID_CODE)
          that.inputCustInfo.INT_ORG = OPEN_ORG_INFO.ORG_CODE;
          that.inputCustInfo.ORG_CODE = OPEN_ORG_INFO.ORG_CODE;
          that.inputCustInfo.ORG_NAME = OPEN_ORG_INFO.ORG_NAME;
          let custInfo =  that.$storage.getJsonSession(that.$definecfg.CUSTOMER_INFO) || {};
          Object.assign(custInfo,that.inputCustInfo);
          that.$storage.setSession(that.$definecfg.CUSTOMER_INFO, custInfo);  
          //开户 如果证件类型为可以读卡识别的类型，比如身份证 还是要进行读卡
          //也就是用身份证进行个人开户，必须读卡

          if (that.inputCustInfo.USER_TYPE === "0"){
            that.$syscfg.getSysConfig('IS_MUST_READ_CARD').then((data) => {
                if(data.Code == 0){
                  let isMustReadCard = data.Data.length && data.Data[0].PAR_VAL;
                  if(( that.inputCustInfo.ID_TYPE == '00' ||  that.inputCustInfo.ID_TYPE == '0s') && _.isEmpty(that.cardData) && that.$basecfg.isProd && isMustReadCard=='1'){ 
                    that.$router.replace({ name: 'readCard', params: { isByForce: true, idType:  that.inputCustInfo.ID_TYPE}});
                  }else{
                    that.showPoliceValidate = true;
                  }
                }else{
                  console.warn('系统公共参数查询失败');
                  that.$blMethod.showMsgBox(that,"系统公共参数查询失败"+data.Msg)
                }
            }).catch(err => {
              console.warn('系统公共参数查询失败,原因：'+ err)
              that.$blMethod.showMsgBox(that,"系统公共参数查询失败"+err.toString())
            })
          }else{
            //机构/产品需要验证经办人信息
            if (that.$syscfg.isOpenAcctBiz(that.busiCode) || that.$syscfg.isOpenDobuleBiz(that.busiCode)){
              that.$router.push({ path: '/readCard', query: { isOrgManager: true }});
            }else{
              that.showPoliceValidate = true;
            }
          }
        }
      }).catch(err=>{
        console.error(err)
      })
    },
    reCheckPolice(val) {
      this.showPoliceValidate = val;
    },
    jumpTo() {
      if(['V0050', 'V0051'].indexOf(this.busiCode) > -1) {
        this.$router.replace({path: '/readCard', query: { "ocrCardType": '1'}});
      }
      else {
        this.$router.replace({path: '/readCard'});
      }
    },
    initSubTitle() {
      if (this.userType == "0") {
        this.subTitle = "请录入您的名称、证件类型、证件号码";
        this.title = "请在下屏录入姓名、证件类型、证件号码";
        this.readCardText = "读卡识别 >";
      } else if (this.userType == "1") {
        this.subTitle = "请录入机构的名称、证件类型、证件号码、组织机构代码证";
        this.title = "请在下屏录入姓名、证件类型、证件号码、组织机构代码证";
        this.readCardText = "拍证识别 >";
      } else if (this.userType == "2") {
        this.subTitle = "请录入产品的名称、证件类型、证件号码、组织机构代码证";
        this.title = "请在下屏录入姓名、证件类型、证件号码、组织机构代码证";
        this.readCardText = "拍证识别 >";
      }
    }

  }
};
</script>

<style lang="less">
.icustomer-recoginition-wrap{
  position: relative;
  z-index: 2;
  width: 1802px;
  height: 926px;
  position: absolute;
  color: #4A90E2;
  text-align: center;
  background-image: linear-gradient(270deg, #E0EEFF 0%, #EAF3FC 100%);
	border-radius: 4px;
  // height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto;
  margin: 10px 60px 32px; 
  padding: 0;
  .customerloginmain{
    height: 100%;
    width: 100%;
    flex-direction: row;
    display: flex;
    .loginImgBox{
      box-sizing: border-box;
      text-align: center;
      height: 100%;
      padding-left: 155px;
      padding-top: 87px;
      padding-right: 118px;
      .title{
        font-family:Alibaba PuHuiTi;
        color:#252525;
        font-size:26px;
        font-family: Alibaba PuHuiTi;
        font-size: 26px;
        font-weight: normal;
        line-height: 35px;
        color: #222222;
      }
      img{
        margin-top: -35px;
        width: 686.151px;
        height: 671.947px;
        background-size: 100% 100%;
      }
    }
    .customer-recoginition-contenet{
      height: 100%;
      width: 754px;
      .inputCustInfo{
        width: 100%;
        height: 650px;
        position: relative;
        margin: 128px 0 0; 
        border-radius: 8px;	
        background-color: #fdfeff;
        box-sizing: border-box;
        padding-top: 78px;
        padding-left: 98px;
        border-radius:8px;
        box-shadow:0px 2px 10px rgba(0, 79, 255, 0.2);
        .loginTitleItem{
					.loginTitle{
            text-align: left;
            font-family: Alibaba PuHuiTi;
            font-weight: 700;
            color: #252525;
            font-size: 42px;
            line-height: 61px;
            margin: 0;
          }
          .loginSubTitle {
            text-align: left;
            font-family: Alibaba PuHuiTi;
            color: #464646;
            font-size: 24px;
            margin: 18px 0 0 0;
          }
        }
        .el-form{
          margin-top: 45px;
          text-align: left;
          .kui-combobox {
            padding: 0 0 36px 0;
            .kui-combobox-title {
              text-align: left;
            }
          }
          .kui-textinput {
            padding: 0 0 36px 0;
            .kui-textinput-title {
              text-align: left;
            }
          }
          &.noPerson {
            .kui-combobox {
              padding: 0 0 16px 0;
            }
            .kui-textinput {
              padding: 0 0 16px 0;
            }
          }
          .ORG_ID_CODE {
            .kui-textinput {
              padding: 0 0 36px 0;
              .kui-textinput-title {
                line-height: 1.1;
              }
            }
          }
        }
        .buttonSubmit {
          padding-left: 132px;
          text-align: left;
          .el-button {
              width: 380px;
              height: 55px;
              color: white;
              font-size: 24px;
              background-image: linear-gradient(90deg,#3b6aff 0%,#208bff 100%);
              border-radius: 4px;
          }
        }
      }
      .other-login-content {
          position: absolute;
          right: 0px;
          top: 818px;
          .other-login {
              background: rgba(1,1,1,0);
              margin-right: 91px;
              border: none;
              color: #3b6aff;
              font-size: 26px;
              padding: 0;
              &.is-disabled {
                  opacity: 0.5;
              }
          }
      }
    }
  }
  
	.el-footer{
		text-align: center;
		font-size: 24px;
		height: 120px !important;
    width: 100%;
    position: relative;
    bottom: 30px;
    display:flex;
		.el-button {
			background-color:rgba(0,0,0,0.0);
			border-radius: 100px;
			border: none;
			width: 176px;
			height: 49px;
			span{
        background: rgba(1,1,1,0);
        border: none;
        color: #1f5ade;
        font-size: 26px;
			}
    }
		.other-login{
			font-size: 24px;
			color: white;
			text-decoration: none;
      margin: auto 30px 33px auto;
		}
		.other-login.is-disabled.el-button:hover{
			background: none;
		}
	}
}
 .el-select-dropdown{
      .el-scrollbar{
        .el-scrollbar__wrap--hidden-default{
          .el-select-dropdown__list{
            .el-select-dropdown__item {
              font-size: 21px;
              padding: 0 1.042vw;
              position: relative;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              color: #606266;
              height: 44px;
              line-height: 44px;
              -webkit-box-sizing: border-box;
              box-sizing: border-box;
              cursor: pointer;
            }
          }
        }
      }
  }
</style>