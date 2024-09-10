/* 
*   个人开户-关联人信息模块
*   方法封装
*   @author  linsc
*/

import bizPublicSaveMethod from '../../../../businessTools/bizPublicSaveMethod'
import oppService from '../../../../../service/opp-service.js'
import date from '../../../../../tools/date.js'
import * as utils from "../../../../../tools/util"
import stringConfig from '../../../../../tools/stringConfig'


export default {
  //----------------------------------钩子函数----------------------//
  /*
  *@method openBizCustRelaInfoNodeBeforeLoadBiz
  *@desc 钩子函数 加载历史数据之前触发
  *@MethodAuthor  linsc
  *@Date: 2019-06-11 15:19:09
  */
  openBizCustRelaInfoNodeBeforeLoadBiz: function (_this) {
    return new Promise((resolve, rejects) => {
        _this.groupDatas.CUST_INFO.BENEFICIARY_INFO[0].FIELDS.OCCU_TYPE.FIELD_FUNCTION = '';
        _this.groupDatas.CUST_INFO.CONTROLER_INFO[0].FIELDS.OCCU_TYPE.FIELD_FUNCTION = '';
        console.log("custInfoBeforeLoadBiz")
        resolve()
    })
  },
  /*
   *@method openBizCustRelaInfoNodeAfterLoadBiz
   *@desc  钩子函数  加载历史数据后触发
   *@MethodAuthor  linsc
   *@Date: 2019-06-13 09:42:56
  */
  openBizCustRelaInfoNodeAfterLoadBiz: function (_this) {

  },
  /*
  *@method openBizCustRelaInfoNodeBeforeSave
  *@desc 钩子函数 自定义保存数
  *@MethodAuthor  linsc
  *@Date: 2019-06-11 15:19:09
  */
  openBizCustRelaInfoNodeBeforeSave: async function (_this, params) {
    // 开户OPER_TYPE为0
    let tempSaveBeneficiaryArr = [];
    _.each(_this.groupDatas.CUST_INFO.BENEFICIARY_INFO, (c, v) => {
        let custBeneficiaryInfoObj = {};
        _this.$blMethod.changeObjKeys(_this.groupDatas.CUST_INFO.BENEFICIARY_INFO[v].FIELDS, custBeneficiaryInfoObj);
        tempSaveBeneficiaryArr.push(_.extend({}, custBeneficiaryInfoObj, {OPER_TYPE: '0'}));
    })
    let tempSaveControlerArr = [];
    _.each(_this.groupDatas.CUST_INFO.CONTROLER_INFO, (c, v) => {
        let tempSaveControlerObject = {};
        _this.$blMethod.changeObjKeys(_this.groupDatas.CUST_INFO.CONTROLER_INFO[v].FIELDS, tempSaveControlerObject);
        tempSaveControlerArr.push(_.extend({}, tempSaveControlerObject, {OPER_TYPE: '0'}));
    })
    let beneficiaryImgIsMust = _.filter(tempSaveBeneficiaryArr, function (obj) {  //只要存在非本人 就需要采集身份证明文件
      return obj.BENEFICIARY_RELA !== "0Z" && obj.OPER_TYPE !== "2";
    }).length ? "1" : "0";

    let controllerImgIsMust = _.filter(tempSaveControlerArr, function (obj) {  //只要存在非本人 就需要采集身份证明文件
      return obj.CONTROLER_RELATION !== "0Z";
    }).length ? "1" : "0";
    let resultObj = {
      FLOW_TURN_FLAG: 0,
      BLACK_INFO: [],
      NEW_IS_AGENT: "0", //是否开通代理人 用于影像采集
      NEW_AGT_ID_TYPE: "",
      AGENT_CSDC_VALID_FLAG: "",
      // 由于适当性信息拆分独立节点，需要拓展进去，避免覆盖适当性信息节点内容
      RELA_INFO: Object.assign({}, params.RELA_INFO, {
        CUST_CONTROLER_INFO: tempSaveControlerArr,
        CUST_OTHER_LINK_INFO: [],
        CUST_BENEFICIARY_INFO: tempSaveBeneficiaryArr,
        CUST_GUARDIAN_INFO: [],
        CUST_OTHER_INFO: {},
        ASSIGN_INFO: {}
      }),
      CONTROLLER_IMG_IS_MUST: controllerImgIsMust, //控制人身份证必采
      BENEFICIARY_IMG_IS_MUST: beneficiaryImgIsMust //受益人身份证必采
    }
    params.BENEFICIARY_IMG_IS_MUST = "0";
    params.CONTROLLER_IMG_IS_MUST = "0";
    Object.assign(params, resultObj)
  },
  /*
  *@method openBizCustRelaInfoNodeValidate
  *@desc 钩子函数 下一步验证
  *@MethodAuthor  linsc
  *@Date: 2019-06-11 15:19:09
  */
  openBizCustRelaInfoNodeValidate: function (_this) {
      if (_this.moduleId[0] == 'BENEFICIARY_INFO') {
        let formDataArr = [];
        _.each(_this.groupDatas.CUST_INFO.BENEFICIARY_INFO, (c, v) => {
            let custBeneficiaryInfoObj = {};
            _this.$blMethod.changeObjKeys(_this.groupDatas.CUST_INFO.BENEFICIARY_INFO[v].FIELDS, custBeneficiaryInfoObj);
            formDataArr.push(custBeneficiaryInfoObj.BENEFICIARY_ID);
        })
        if (_.uniq(formDataArr).length < _this.groupDatas.CUST_INFO.BENEFICIARY_INFO.length) {
            _this.$blMethod.showMsgBox(_this,"受益人信息的证件号码有重复记录，请删掉重复记录！",()=>{
            })
            return false;
        }
      }
      return true;
  },

  /*
  *@method openBizCustRelaInfoNodeGetData
  *@desc 拼接数据
  *@MethodAuthor  linsc
  *@Date: 2019-06-11 15:19:09
  */
  openBizCustRelaInfoNodeGetData: function (_this, params) {
  },

  /*
  *@method openBizCustRelaInfoNodePageActivated
  *@desc 钩子函数：页面激活
  *@MethodAuthor  linsc
  *@Date: 2019-06-11 15:19:09
  */
  openBizCustRelaInfoNodePageActivated: function (_this, groupId) {
    console.log("openBizCustRelaInfoNodePageActivated")
    let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
    if (!(customerInfo.SUBJECT_IDENTITY == "2" || (customerInfo.SUBJECT_IDENTITY == "1" && customerInfo.UNDER_AGE != "2"))) {
      _this.groupDatas.CUST_INFO.CONTROLER_INFO[0].MODULE_ADD = "0";
      _this.groupDatas.CUST_INFO.CONTROLER_INFO[0].FIELDS.CONTROLER_RELATION.DEFAULT_VALUE = "0Z";
      _this.groupDatas.CUST_INFO.CONTROLER_INFO[0].FIELDS.CONTROLER_RELATION.FIELD_CONTROL = "2";
    }
  },

  //----------------------业务函数----------------------------------//


  // /**
  // * openBizCustRelaInfoNodeLoadBizData 数据解析或回填
  // * @param _this
  // */
  // openBizCustRelaInfoNodeLoadBizData : async function(_this,busiData){
  //     return this.openBizCustRelaInfoNodeParseOldBiz(_this, busiData)
  // },

  // /**
  // * openBizCustRelaInfoNodeParseOldBiz 重新加载转换之后的历史数据
  // * @param _this
  // */
  // openBizCustRelaInfoNodeParseOldBiz :function (_this, bdata) { // 解析身份证读卡数据
  //     console.log("openBizCustRelaInfoNodeParseOldBiz==========开始")
  //     for(let bk in bdata) {
  //         if(bk in _this.groupDatas) {
  //           let bd = bdata[bk];
  //           let md = _this.groupDatas[bk];
  //           for(let bdk in bd) {
  //             if(bdk in md) {
  //               let mdtpl = _.cloneDeep(md[bdk][0]);
  //               mdtpl["MODULE_NUM"] = ""; //先清掉module_num
  //               for(let i = 0; i < bd[bdk].length; i++) {
  //                 let bdd = bd[bdk][i];
  //                 let mdd = i < md[bdk].length ? md[bdk][i] : _.cloneDeep(mdtpl);
  //                 for(let fk in bdd) {
  //                   if(fk in mdd.FIELDS && bdd[fk] !== null){
  //                     //需要根据数据类型来赋值
  //                     mdd["FIELDS"][fk]["DEFAULT_VALUE"] = (typeof(bdd[fk]) === 'object' && Object.prototype.toString.call(bdd[fk]) !== '[object Array]') ? bdd[fk]["newVal"] : bdd[fk];
  //                     // 如果当前历史数据模块字段里面为null为删除模块，中断并过滤此模块
  //                     if(mdd["FIELDS"][fk]["DEFAULT_VALUE"] === null) {
  //                       mdd = null;
  //                       break;
  //                     }
  //                   } else if("MODULE_NUM_FIELD" in mdd && fk === mdd["MODULE_NUM_FIELD"]) { // 多组数据，取出一柜通NUM字段值并赋值MODULE_NUM
  //                     mdd["MODULE_NUM"] = bdd[fk];
  //                   }
  //                 }

  //                 if(i > 0 && mdd) 
  //                   mdd.MODULE_SEQ = parseInt(mdd["MODULE_SEQ"]) + i + "";

  //                 // md[bdk][i] = mdd;
  //                 md[bdk][i] = mdd;
  //               }
  //               md[bdk] = _.filter(md[bdk], (item) => { return item !== null });
  //             }
  //           }
  //         }
  //     }
  //     console.log("openBizCustRelaInfoNodeParseOldBiz==========结束")
  // },
  //--------------------------------------------------检查逻辑--------------------------------------------------
  "CHECK_CONTROLER_RELATION": (_this, field, fieldData) => {
    let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
    if (field.DEFAULT_VALUE == "0Z") {
      fieldData.CONTROLER_NAME.FIELD_CONTROL = "2";
      fieldData.CONTROLER_ID_TYPE.FIELD_CONTROL = "2";
      fieldData.CONTROLER_ID_NO.FIELD_CONTROL = "2";
      fieldData.CONTROLER_ID_EXP_DATE.FIELD_CONTROL = "2";

      fieldData.CONTROLER_NAME.DEFAULT_VALUE = customerInfo.CUST_FNAME;
      fieldData.CONTROLER_ID_TYPE.DEFAULT_VALUE = customerInfo.ID_TYPE;
      fieldData.CONTROLER_ID_NO.DEFAULT_VALUE = customerInfo.ID_CODE;
      fieldData.CONTROLER_ID_EXP_DATE.DEFAULT_VALUE = customerInfo.ID_EXP_DATE;

      let CUST_LINK_INFO = _this.groupDatas.CUST_INFO.CUST_LINK_INFO[0].FIELDS;
      fieldData.CONTROLER_EMAIL.DEFAULT_VALUE = CUST_LINK_INFO.EMAIL.DEFAULT_VALUE;
      fieldData.NATION.DEFAULT_VALUE = customerInfo.CITIZENSHIP;
      fieldData.OCCU_TYPE.DEFAULT_VALUE = customerInfo.OCCU_TYPE;
      fieldData.ZIP_CODE.DEFAULT_VALUE = CUST_LINK_INFO.ZIP_CODE.DEFAULT_VALUE;
      fieldData.CONTROLER_SEX.DEFAULT_VALUE = customerInfo.SEX;
      fieldData.REG_DATE.DEFAULT_VALUE = customerInfo.BIRTHDAY;
      fieldData.REG_ADDR.DEFAULT_VALUE = CUST_LINK_INFO.MAIL_ADDR.DEFAULT_VALUE;
      fieldData.REG_ADDR.FIELD_CONTROL = "2"
      if (stringConfig.isNotEmptyStr(_this.groupDatas.CUST_INFO.CUST_LINK_INFO[0].FIELDS.MOBILE_TEL.DEFAULT_VALUE)) {
        fieldData.CONTROLER_TEL.DEFAULT_VALUE = _this.groupDatas.CUST_INFO.CUST_LINK_INFO[0].FIELDS.MOBILE_TEL.DEFAULT_VALUE;
        fieldData.CONTROLER_TEL.FIELD_CONTROL = "2";
      } else {
        fieldData.CONTROLER_TEL.FIELD_CONTROL = "0"
      }
    } else {
      fieldData.CONTROLER_NAME.FIELD_CONTROL = "0";
      fieldData.CONTROLER_ID_TYPE.FIELD_CONTROL = "0"
      fieldData.CONTROLER_ID_NO.FIELD_CONTROL = "0"
      fieldData.CONTROLER_TEL.FIELD_CONTROL = "0"
      fieldData.CONTROLER_ID_EXP_DATE.FIELD_CONTROL = "0";

      fieldData.CONTROLER_NAME.DEFAULT_VALUE = "";
      fieldData.CONTROLER_ID_TYPE.DEFAULT_VALUE = ""
      fieldData.CONTROLER_ID_NO.DEFAULT_VALUE = ""
      fieldData.CONTROLER_TEL.DEFAULT_VALUE = ""
      fieldData.CONTROLER_ID_EXP_DATE.DEFAULT_VALUE = "";
      fieldData.CONTROLER_EMAIL.DEFAULT_VALUE = ""
      fieldData.CONTROLER_EMAIL.FIELD_CONTROL = "0"
      fieldData.NATION.DEFAULT_VALUE = ""
      fieldData.NATION.FIELD_CONTROL = "0"
      fieldData.OCCU_TYPE.DEFAULT_VALUE = ""
      fieldData.OCCU_TYPE.FIELD_CONTROL = "0"
      fieldData.ZIP_CODE.DEFAULT_VALUE = ""
      fieldData.ZIP_CODE.FIELD_CONTROL = "0"
      fieldData.CONTROLER_SEX.DEFAULT_VALUE = ""
      fieldData.CONTROLER_SEX.FIELD_CONTROL = "0"
      fieldData.REG_DATE.DEFAULT_VALUE = ""
      fieldData.REG_DATE.FIELD_CONTROL = "0"
      fieldData.REG_ADDR.DEFAULT_VALUE = ""
      fieldData.REG_ADDR.FIELD_CONTROL = "0"
    }
  },
  "CHECK_BENEFICIARY_RELA": (_this, field, fieldData) => {
    let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
    if (field.DEFAULT_VALUE == "0Z") {
      fieldData.BENEFICIARY_NAME.FIELD_CONTROL = "2";
      fieldData.BENEFICIARY_ID_TYPE.FIELD_CONTROL = "2";
      fieldData.BENEFICIARY_ID.FIELD_CONTROL = "2";
      fieldData.BENEFICIARY_NAME.DEFAULT_VALUE = customerInfo.CUST_FNAME;
      fieldData.BENEFICIARY_ID_TYPE.DEFAULT_VALUE = customerInfo.ID_TYPE;
      fieldData.BENEFICIARY_ID.DEFAULT_VALUE = customerInfo.ID_CODE;
      let CUST_LINK_INFO = _this.groupDatas.CUST_INFO.CUST_LINK_INFO[0].FIELDS;
      fieldData.EMAIL.DEFAULT_VALUE = CUST_LINK_INFO.EMAIL.DEFAULT_VALUE;
      fieldData.NATION.DEFAULT_VALUE = customerInfo.CITIZENSHIP;
      fieldData.OCCU_TYPE.DEFAULT_VALUE = customerInfo.OCCU_TYPE;
      fieldData.ZIP_CODE.DEFAULT_VALUE = CUST_LINK_INFO.ZIP_CODE.DEFAULT_VALUE;
      fieldData.SEX.DEFAULT_VALUE = customerInfo.SEX;
      fieldData.BIRTHDAY.DEFAULT_VALUE = customerInfo.BIRTHDAY;
      fieldData.BENEFICIARY_ADDR.DEFAULT_VALUE = CUST_LINK_INFO.MAIL_ADDR.DEFAULT_VALUE;
      fieldData.BENEFICIARY_ADDR.FIELD_CONTROL = '2';
      if (stringConfig.isNotEmptyStr(_this.groupDatas.CUST_INFO.CUST_LINK_INFO[0].FIELDS.MOBILE_TEL.DEFAULT_VALUE)) {
        fieldData.BENEFICIARY_TEL.DEFAULT_VALUE = _this.groupDatas.CUST_INFO.CUST_LINK_INFO[0].FIELDS.MOBILE_TEL.DEFAULT_VALUE;
        fieldData.BENEFICIARY_TEL.FIELD_CONTROL = "2";
      } else {
        fieldData.BENEFICIARY_TEL.FIELD_CONTROL = "0"
      }
    } else {
      fieldData.BENEFICIARY_NAME.FIELD_CONTROL = "0";
      fieldData.BENEFICIARY_ID_TYPE.FIELD_CONTROL = "0"
      fieldData.BENEFICIARY_ID.FIELD_CONTROL = "0"
      fieldData.BENEFICIARY_TEL.FIELD_CONTROL = "0"
      fieldData.BENEFICIARY_NAME.DEFAULT_VALUE = "";
      fieldData.BENEFICIARY_ID_TYPE.DEFAULT_VALUE = ""
      fieldData.BENEFICIARY_ID.DEFAULT_VALUE = ""
      fieldData.BENEFICIARY_TEL.DEFAULT_VALUE = ""
      fieldData.EMAIL.DEFAULT_VALUE = ""
      fieldData.EMAIL.FIELD_CONTROL = "0"
      fieldData.NATION.DEFAULT_VALUE = ""
      fieldData.NATION.FIELD_CONTROL = "0"
      fieldData.OCCU_TYPE.DEFAULT_VALUE = ""
      fieldData.OCCU_TYPE.FIELD_CONTROL = "0"
      fieldData.ZIP_CODE.DEFAULT_VALUE = ""
      fieldData.ZIP_CODE.FIELD_CONTROL = "0"
      fieldData.SEX.DEFAULT_VALUE = ""
      fieldData.SEX.FIELD_CONTROL = "0"
      fieldData.BIRTHDAY.DEFAULT_VALUE = ""
      fieldData.BIRTHDAY.FIELD_CONTROL = "0"
      fieldData.BENEFICIARY_ADDR.DEFAULT_VALUE = ""
      fieldData.BENEFICIARY_ADDR.FIELD_CONTROL = "0"
    }
  },
  "addModuleFinished": (_this, fieldData) => {
    if (_this.moduleId.indexOf("CUST_CREDIT_INFO") != -1) {
      let creditLength = _this.groupDatas.CUST_BASE_INFO.CUST_CREDIT_INFO.length;
      if (creditLength > 1) {
        let hasCheck = [];
        _.each(_this.groupDatas.CUST_BASE_INFO.CUST_CREDIT_INFO, function (v) {
          if (v.FIELDS.RECORD_SOURCE.DEFAULT_VALUE && v.FIELDS.RECORD_SOURCE.DEFAULT_VALUE != "") {
            //保存已选中的诚信记录类型
            hasCheck.push(v.FIELDS.RECORD_SOURCE.DEFAULT_VALUE);
          }
        });
        fieldData.FIELDS.RECORD_SOURCE.FIELD_DICT_NAME = _.filter(fieldData.FIELDS.RECORD_SOURCE.FIELD_DICT_NAME, function (v) {
          //将 无 和 已选中诚信记录类型从字典中除去
          return hasCheck.indexOf(v.DICT_ITEM) == -1 && v.DICT_ITEM != "ZZ"
        });
        //上一条诚信记录的诚信记录类型变为不可编辑
        _this.groupDatas.CUST_BASE_INFO.CUST_CREDIT_INFO[creditLength - 2].FIELDS.RECORD_SOURCE.FIELD_CONTROL = "2";
      }
    } else if (_this.moduleId.indexOf("CONTROLER_INFO") != -1) {
      let controlerLength = _this.groupDatas.CUST_INFO.CONTROLER_INFO.length;
      if (controlerLength > 1) {
        let hasCheck = [];
        _.each(_this.groupDatas.CUST_INFO.CONTROLER_INFO, function (v) {
          if (v.FIELDS.CONTROLER_RELATION.DEFAULT_VALUE && v.FIELDS.CONTROLER_RELATION.DEFAULT_VALUE != "") {
            hasCheck.push(v.FIELDS.CONTROLER_RELATION.DEFAULT_VALUE);
          }
        });
        fieldData.FIELDS.CONTROLER_RELATION.FIELD_DICT_NAME = _.filter(fieldData.FIELDS.CONTROLER_RELATION.FIELD_DICT_NAME, function (v) {
          return hasCheck.indexOf(v.DICT_ITEM) == -1;
        });
      }
    } else if (_this.moduleId.indexOf("BENEFICIARY_INFO") != -1) {
      let controlerLength = _this.groupDatas.CUST_INFO.BENEFICIARY_INFO.length;
      if (controlerLength > 1) {
        let hasCheck = [];
        _.each(_this.groupDatas.CUST_INFO.BENEFICIARY_INFO, function (v) {
          if (v.FIELDS.BENEFICIARY_RELA.DEFAULT_VALUE && v.FIELDS.BENEFICIARY_RELA.DEFAULT_VALUE != "") {
            hasCheck.push(v.FIELDS.BENEFICIARY_RELA.DEFAULT_VALUE);
          }
        });
        fieldData.FIELDS.BENEFICIARY_RELA.FIELD_DICT_NAME = _.filter(fieldData.FIELDS.BENEFICIARY_RELA.FIELD_DICT_NAME, function (v) {
          return hasCheck.indexOf(v.DICT_ITEM) == -1;
        });
      }
    }
  },
}