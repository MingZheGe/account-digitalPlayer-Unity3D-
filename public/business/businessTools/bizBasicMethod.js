/* 
*   客户基本信息公共方法
*   方法封装
*   @author  yangyp
*/
import oppService from '../../service/opp-service.js'
import bizPublicMethod from './bizPublicMethod.js'
import * as utils from "../../tools/util";
import stringConfig from '../../tools/stringConfig.js';
export default  {
  parseCustomer : function(_this) { // 解析客户账户数据
      _this.historyData = Object.assign(_this.historyData, _this.oppBusiData);
      let basicInfo = _this.oppBusiData.custBaseInfo;
      // 客户三要素信息
      _this.oppBusiData["ID_TYPE"]    = basicInfo.ID_TYPE;
      _this.oppBusiData["ID_CODE"]    = basicInfo.ID_CODE;
      _this.oppBusiData["CUST_FNAME"] = "CUST_FNAME" in basicInfo ? basicInfo["CUST_FNAME"] : basicInfo["USER_FNAME"]
      _this.oppBusiData["CUST_NAME"]  = "CUST_NAME" in basicInfo ? basicInfo["CUST_NAME"] : basicInfo["USER_NAME"]
      _this.oppBusiData["USER_FNAME"] = "USER_FNAME" in basicInfo ? basicInfo["USER_FNAME"] : basicInfo["CUST_FNAME"]
      _this.oppBusiData["USER_NAME"]  = "USER_NAME" in basicInfo ? basicInfo["USER_NAME"] : basicInfo["CUST_NAME"]
      
      //客户证件信息
      _this.oppBusiData["ID_BEG_DATE"] =  basicInfo.ID_BEG_DATE;
      _this.oppBusiData["ID_EXP_DATE"] =   basicInfo.ID_EXP_DATE;
      _this.oppBusiData["ID_ISS_AGCY"] =  basicInfo.ID_ISS_AGCY;
      _this.oppBusiData["ID_ADDR"] =  basicInfo.ID_ADDR;
      _this.oppBusiData["IDCARD_TYPE"] =  basicInfo.IDCARD_TYPE;
      //客户其他资料信息
      _this.oppBusiData["EDUCATION"] =  basicInfo.EDUCATION;
      _this.oppBusiData["CIF_TRADE"] =  basicInfo.TRADE;
      _this.oppBusiData["OCCU_TYPE"] =  basicInfo.OCCU_TYPE;
      _this.oppBusiData["MAIL_ADDR"] =  basicInfo.MAIL_ADDR;
      _this.oppBusiData["MAIL_ZIP_CODE"] =  basicInfo.MAIL_ZIP_CODE;
  
      //机构和产品数据
      if(_this.userType == "1" || _this.userType == "2"){
      _this.oppBusiData["ID_ADDR"] = basicInfo.ID_ADDR;
      }
      _this.oppBusiData["FULLNAME"] = _this.oppBusiData.bankAcctInfo&&_this.oppBusiData.bankAcctInfo[0]&&_this.oppBusiData.bankAcctInfo[0].FULLNAME;
      _this.oppBusiData["IDTYPE"] = _this.oppBusiData.bankAcctInfo&&_this.oppBusiData.bankAcctInfo[0]&&_this.oppBusiData.bankAcctInfo[0].IDTYPE;
      _this.oppBusiData["IDNO"] = _this.oppBusiData.bankAcctInfo&&_this.oppBusiData.bankAcctInfo[0]&&_this.oppBusiData.bankAcctInfo[0].IDNO;
      _this.oppBusiData["EMAIL"] =  basicInfo.EMAIL;
      _this.oppBusiData["BIRTHDAY"] =  basicInfo.BIRTHDAY;
      //获取涉税信息标识
      _this.oppBusiData["TAX_RESIDENT_TYPE"] = basicInfo.TAX_FLAG; //关键信息没有用到，但是资料完善业务有用到
  
      _this.oppBusiData["OTHER_ID_TYPE"] =  _this.oppBusiData.custAssociateInfo && _this.oppBusiData.custAssociateInfo.ID_TYPE||"";
      _this.oppBusiData["OTHER_ID_EXP_DATE"] =  _this.oppBusiData.custAssociateInfo &&  _this.oppBusiData.custAssociateInfo.ID_EXP_DATE || "";
      _this.oppBusiData["OTHER_ID_CODE"] =  _this.oppBusiData.custAssociateInfo &&  _this.oppBusiData.custAssociateInfo.ID_CODE || "";
      _this.oppBusiData["OTHER_CUST_NAME"] =  _this.oppBusiData.custAssociateInfo &&  _this.oppBusiData.custAssociateInfo.ASSOCIATE_NAME || "";
      // // 补充：非关键信息变更
      // _this.oppBusiData["SEX"] = basicInfo.SEX || ""
      // _this.oppBusiData["CITIZENSHIP"] = basicInfo.CITIZENSHIP || ""
      // _this.oppBusiData["NATIVE_PLACE"] = basicInfo.NATIVE_PLACE || ""
      // _this.oppBusiData["MOBILE_TEL"] = basicInfo.MOBILE_TEL || ""
      // _this.oppBusiData["LINKMAN"] = _this.oppBusiData.LINKMAN_INFO && _this.oppBusiData.LINKMAN_INFO[0].LINKMAN || ""
      // _this.oppBusiData["LINKMAN_MOBILE"] = _this.oppBusiData.LINKMAN_INFO && _this.oppBusiData.LINKMAN_INFO[0].LINKMAN_MOBILE || ""
      
      //由于账户与一柜通的联系信息模块名称不同所以要先构造客户联系信息数据，方便后续赋值解析
      for(let gk in _this.groupDatas) {
          for (let md in _this.groupDatas[gk]){
              for(let fk in _this.oppBusiData) {
                  if(fk in _this.groupDatas[gk][md][0].FIELDS) {
                    if(gk == "CUST_INFO_PAGE1" || gk == "CUST_INFO_PAGE2"|| gk == "CUST_BASIC_INFO"){
                      if(stringConfig.isEmptyStr(_this.groupDatas[gk][md][0]["FIELDS"][fk]["DEFAULT_VALUE"])){
                        _this.groupDatas[gk][md][0]["FIELDS"][fk]["DEFAULT_VALUE"]  = _this.oppBusiData[fk];
                      }
                    }
                  }
              }
          }
      }
  },
  
  /**
  * isDoubleChange 判断是否是双改
  * @param _this
  */
  isDoubleChange : function(_this) {
      let oldBaseForm = _this.oppBusiData.custBaseInfo;
      let newBaseForm = {};
      if(_this.busiCode == "V0011" && _this.userType != 0){
          newBaseForm = _this.groupDatas.CUST_BASIC_INFO.CUST_BASIC_INFO_STEP1[0].FIELDS;
      }else{
          newBaseForm = _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS;
      }
      if(_this.userType == "0" && bizPublicMethod.$blMethod.getCustomerAllData(_this).ID_TYPE == "00"  && oldBaseForm.ID_CODE.length == 15){
        let tempOldCode = utils.updateCardNo(oldBaseForm.ID_CODE);
        // if(newBaseForm.ID_CODE.DEFAULT_VALUE.length == 15){
        //   return "error";
        // }
        return oldBaseForm.USER_FNAME != newBaseForm.USER_FNAME.DEFAULT_VALUE
          && tempOldCode != newBaseForm.ID_CODE.DEFAULT_VALUE;
      }else{
        return oldBaseForm.USER_FNAME != newBaseForm.USER_FNAME.DEFAULT_VALUE
          && oldBaseForm.ID_CODE != newBaseForm.ID_CODE.DEFAULT_VALUE;
      }
      
    },
    //是否显示银行模块
    isShowBankPwd : function(_this){
      //获取不需要同步银行的银行信息
      let that = this;
      let asynchronyBankStr= oppService.getBusiCommonParamsByCode(_this.oppBusiData.busiCommonParamsArray,'ASYNCHRONY_BANK');
      let asynchronyBankArr = [];
      if(asynchronyBankStr){
        asynchronyBankArr = asynchronyBankStr.split(",");
      }
      
      if(_this.oppBusiData.bankSignInfo && _this.oppBusiData.bankSignInfo.length){

        if(asynchronyBankArr.length){
          _this.oppBusiData.bankSignInfo.forEach(element => {
            console.log('asynchronyBankArr====', element.EXT_ORG);
            if(_.indexOf(asynchronyBankArr,element.EXT_ORG) != -1 && element.CONTRACT_STATUS == "0"){
              console.log('asynchronyBankArr====', element.EXT_ORG_TEXT );
              console.log('不需要同步银行');
              let showText = element.EXT_ORG_TEXT;
              if(showText.indexOf("交行三方") != -1) {
                showText = "交通银行";
              }else if(showText.indexOf("中行三方") != -1) {
                showText = "中国人民银行";
              }else if(showText.indexOf("三方") != -1) {
                showText = showText.replace("三方","银行");
              }
              _this.$refs.flowTip.pushFlowTip({
                title : "您好，为不影响您银证转账，请您及时前往"+ showText +"修改银行账户信息！",
                type:'warning',
                key:'name'
              })
            }
          });
        }
       
        //获取同步银行需要客户输入密码的银行信息
        let syncBankNeedPwdStr= oppService.getBusiCommonParamsByCode(_this.oppBusiData.busiCommonParamsArray,'SYN_BANK_NEED_PWD');
        let syncBankNeedPwdArr = [];
        if(syncBankNeedPwdStr){
          syncBankNeedPwdArr = syncBankNeedPwdStr.split(",");
        }
        let showBankPwdBool = false;
        if(syncBankNeedPwdStr.length){
          _this.oppBusiData.bankSignInfo.forEach(element => {
            console.log('显示密码', element.EXT_ORG);
            if(_.indexOf(syncBankNeedPwdArr,element.EXT_ORG) != -1){
              //需要显示银行密码字段
              showBankPwdBool =  true;
              return false;
            }
          })
        }
       
        if((_this.userType == "1"||_this.userType =="2")&&_this.busiCode != "V0009"){
          if(showBankPwdBool == false){
            _this.groupDatas.CUST_BASIC_INFO.CUST_BANK_INFO[0].FIELDS.BANK_AUTH_DATA.FIELD_CONTROL = "1";
          }else{
            _this.groupDatas.CUST_BASIC_INFO.CUST_BANK_INFO[0].FIELDS.BANK_AUTH_DATA.VALID_TYPE = "num[6]|on-blur|password"
            _this.groupDatas.CUST_BASIC_INFO.CUST_BANK_INFO[0].FIELDS.BANK_AUTH_DATA.IS_SHOW_BUTTON = true;
            _this.groupDatas.CUST_BASIC_INFO.CUST_BANK_INFO[0].FIELDS.BANK_AUTH_DATA.FIELD_BUTTON_TXT = '输入完毕';
            _this.groupDatas.CUST_BASIC_INFO.CUST_BANK_INFO[0].FIELDS.BANK_AUTH_DATA.FIELD_CONTROL = "0";
          }
        }else{
          if(showBankPwdBool == false){
            _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.BANK_AUTH_DATA.FIELD_CONTROL = "1";
          }else{
            _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.BANK_AUTH_DATA.VALID_TYPE = "num[6]|on-blur|password"
            _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.BANK_AUTH_DATA.IS_SHOW_BUTTON = true;
            _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.BANK_AUTH_DATA.FIELD_BUTTON_TXT = '输入完毕';
            _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.BANK_AUTH_DATA.FIELD_CONTROL = "0";
          }
        }
        
      }
    },
    updateId15to18:function(_this, field, fieldData) { // 身份证升位，15升18位
      let id = field.DEFAULT_VALUE;
      field.IS_SHOW_BUTTON = false;
      let lastNumber;
      //取得前面17位号码
      let zone = id.substring(0, 6);
      let year = "19" + id.substring(6, 8);
      let mdo = id.substring(8, 15);
      id = zone + year + mdo;
    
      //取得最后的检验码
      var getNum = eval(id.charAt(0) * 7 + id.charAt(1) * 9 + id.charAt(2) * 10 + id.charAt(3) * 5 + id.charAt(4) * 8 + id.charAt(5) * 4 + id.charAt(6) * 2 + id.charAt(7) * 1 + id.charAt(8) * 6 + id.charAt(9) * 3 + id.charAt(10) * 7 + id.charAt(11) * 9 + id.charAt(12) * 10 + id.charAt(13) * 5 + id.charAt(14) * 8 + id.charAt(15) * 4 + id.charAt(16) * 2);
      getNum = getNum % 11;
      switch (getNum) {
          case 0:
               lastNumber = "1"; 
              break;
          case 1:
               lastNumber = "0"; 
              break;
          case 2:
               lastNumber = "X"; 
              break;
          case 3:
               lastNumber = "9"; 
              break;
          case 4:
               lastNumber = "8"; 
              break;
          case 5:
               lastNumber = "7"; 
              break;
          case 6:
                lastNumber = "6"; 
              break;
          case 7:
               lastNumber = "5"; 
              break;
          case 8:
               lastNumber = "4"; 
              break;
          case 9:
               lastNumber = "3"; 
              break;
          case 10:
               lastNumber = "2"; 
              break;
      }
      field.DEFAULT_VALUE = id + lastNumber;
    },
    //判断是否需要同步银行密码
    synsBankNeedInputPwd:function(_this){
      //获取同步银行需要客户输入密码的银行信息
      let syncBankNeedPwdStr= oppService.getBusiCommonParamsByCode(_this.oppBusiData.busiCommonParamsArray,'SYN_BANK_NEED_PWD');
      let syncBankNeedPwdArr = [];
      if(syncBankNeedPwdStr){
        syncBankNeedPwdArr = syncBankNeedPwdStr.split(",");
      }
     
      let showBankName = "";
      if(syncBankNeedPwdArr.length){
        _this.oppBusiData.bankSignInfo.forEach(element => {
          console.log('显示密码', element.EXT_ORG);
          if(_.indexOf(syncBankNeedPwdArr,element.EXT_ORG) != -1 && element.CONTRACT_STATUS == "0"){
            //需要显示银行密码字段
            let showText = element.EXT_ORG_TEXT;
            if(showText.indexOf("民行三方") != -1) {
              showText = "民生银行";
            }else if(showText.indexOf("中行三方") != -1) {
              showText = "中国人民银行";
            }else if(showText.indexOf("三方") != -1) {
              showText = showText.replace("三方","银行");
            }
            showBankName =  showText;
            return false;
          }
        })
      }
      
      return showBankName;
    }
}