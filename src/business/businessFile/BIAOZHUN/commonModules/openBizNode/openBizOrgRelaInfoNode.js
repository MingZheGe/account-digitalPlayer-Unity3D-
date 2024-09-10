/* 
*   个人基本信息模块
*   方法封装
*   @author  linsc
*/

import oppService from '../../../../../service/opp-service.js'
import date from '../../../../../tools/date.js'
import * as utils from "../../../../../tools/util"
import * as openBizPubTools from "./openBizPublicTools"

export default {
  //----------------------------------钩子函数----------------------//
  /*
  *@method openBizOrgRelaInfoNodeBeforeLoadBiz
  *@desc 钩子函数 加载历史数据之前触发
  *@MethodAuthor  linsc
  *@Date: 2019-06-11 15:19:09
  */
  openBizOrgRelaInfoNodeBeforeLoadBiz: function (_this) {
    return new Promise((resolve, rejects) => {
      console.log("custInfoBeforeLoadBiz")
      resolve()
    })
  },
  /*
    *@method openBizOrgRelaInfoNodeAfterLoadBiz
    *@desc  钩子函数  加载历史数据后触发
    *@MethodAuthor  linsc
    *@Date: 2019-06-13 09:42:56
  */
  openBizOrgRelaInfoNodeAfterLoadBiz: function (_this) {

  },
  /*
  *@method openBizOrgRelaInfoNodeBeforeSave
  *@desc 钩子函数 自定义保存数
  *@MethodAuthor  linsc
  *@Date: 2019-06-11 15:19:09
  */
  openBizOrgRelaInfoNodeBeforeSave: async function (_this, params) {
    if (_this.userType == "1" && _this.groupId == "RELA_INFO") {
      //机构户 将受益所有人，实际机构控制人，机构控股股东模块 三大模块的一致按钮值转为一柜通的USESAME_INFO
      let mds = ["ORG_BENEFICIARY_INFO", "ORG_CONTROLER_INFO", "ORG_STOCKHOLDER_INFO"];
      mds.map((md) => {
        if (_this.moduleId.indexOf(md) != -1 && params["RELA_INFO"][md]) {
          for (let i = 0; i < params[_this.groupId][md].length; i++) {
            let mdd = params[_this.groupId][md][i];
            mdd["USESAME_INFO"] = mdd["MODULE_RADIO_BUTTON"] == "true" ? "1" : "0";
          }
        }
      })
    }
  },
  /*
  *@method openBizOrgRelaInfoNodeValidate
  *@desc 钩子函数 下一步验证
  *@MethodAuthor  linsc
  *@Date: 2019-06-11 15:19:09
  */
  openBizOrgRelaInfoNodeValidate: function (_this) {
    return true;
  },
  /*
  *@method openBizOrgRelaInfoNodeGetData
  *@desc 拼接数据
  *@MethodAuthor  linsc
  *@Date: 2019-06-11 15:19:09
  */
  openBizOrgRelaInfoNodeGetData: function (_this, params) {
  },

  /*
  *@method openBizOrgRelaInfoNodePageActivated
  *@desc 钩子函数：页面激活
  *@MethodAuthor  linsc
  *@Date: 2019-06-11 15:19:09
  */
  openBizOrgRelaInfoNodePageActivated: function (_this, groupId) {
    console.log("openBizOrgRelaInfoNodePageActivated")
    if (groupId === "RELA_INFO") {
      //如果是中山则隐藏邮箱 电话不必填
      if (this.$syscfg.isQSJG(this.$definecfg.QSJGDM_CONST.ZHONGSHAN)) {
        _this.groupDatas.RELA_INFO.ORG_CONTROLER_INFO[0].FIELDS.CONTROLER_TEL.FIELD_REQUIRED = '0';
        _this.groupDatas.RELA_INFO.ORG_CONTROLER_INFO[0].FIELDS.CONTROLER_EMAIL.FIELD_CONTROL = '1';
      }
      /**
       * 判断显示 法定代表人/执行事务合伙人负责人信息
       * 法人类型为01内资企业法人、02特殊法人机构时展示法定代表人信息(法定代表人证件类型控制为个人证件)
       * 法人类型为08合伙企业时展示执行事务合伙人负责人信息(执行事务合伙人证件类型可以为个人也可以为机构)
       */
      // 法人类型 
      let legalRepType = _this.groupDatas["ORG_INFO"]["ORG_BASIC_INFO"][0]["FIELDS"]["LEGAL_REP_TYPE"].DEFAULT_VALUE;
      let partnerInfoArr = _this.groupDatas["RELA_INFO"]["ORG_PARTNER_INFO"];
      // let legalClientInfoArr = _this.groupDatas["RELA_INFO"]["ORG_LEGAL_CLIENT_INFO"];
      // console.log("-------法人类别-------",legalRepType);
      let text = "";
      if (legalRepType === "08") {
        text = "执行事务合伙人负责人信息";
      } else {
        text = "法定代表人信息";
      }
      if (_this.groupDatas["RELA_INFO"]["ORG_LEGAL_REP_INFO"]) {
        _this.groupDatas["RELA_INFO"]["ORG_LEGAL_REP_INFO"][0].MODULE_TITLE = text;
        _this.groupDatas["RELA_INFO"]["ORG_LEGAL_REP_INFO"][0]["FIELDS"]["LEGAL_REP_ID_TYPE"].FIELD_DICT_FILTER = text == "执行事务合伙人负责人信息" ? _this["oppBusiData"]["VALID_ID_TYPE_FOR_BOTH"] : _this["oppBusiData"]["VALID_ID_TYPE_FOR_PERSON"];
      }
      let moduleC = text == "执行事务合伙人负责人信息" ? "1" : "0";
      //显示合伙企业
      if (_this.groupDatas["RELA_INFO"]["ORG_PARTNER_INFO"]) {
        for (let i = 0; i < partnerInfoArr.length; i++) {
          partnerInfoArr[i].MODULE_CONTROL = moduleC;
        }
      }
      // //显示委派代表信息
      // if (_this.groupDatas["RELA_INFO"]["ORG_LEGAL_CLIENT_INFO"]) {
      //   for (let i = 0; i < partnerInfoArr.length; i++) {
      //     legalClientInfoArr[i].MODULE_CONTROL = moduleC
      //   }
      // }
      //修改控股股东信息 与xx保持一致
      openBizPubTools.resetUseSameInfoTitle(_this, _this.groupDatas["RELA_INFO"], text)
      // 移动端 需要合伙人的情况：
      // 华林证券 1）法人类别为08-合伙企业；
      // 其他券商 2）机构类别为25-私募基金管理人   
      let szOrgType = _this.groupDatas["ORG_INFO"]["ORG_BASIC_INFO"][0]["FIELDS"]["SZORG_TYPE"].DEFAULT_VALUE;
      let isPartnerFlag = false;
      _this.oppBusiData["isPrivatFund"] = szOrgType === "25" || szOrgType === "25a" || szOrgType === "25b"
      isPartnerFlag = this.$syscfg.isQSJG(this.$definecfg.QSJGDM_CONST.HUALIN) ? legalRepType === "08" : szOrgType === "21" || szOrgType === "22" || szOrgType === "23" || szOrgType === "24" || szOrgType === "25a";
      if (_this.oppBusiData["isPrivatFund"]) {
        //主体身份 私募基金管理人 机构类别 私募基金管理人 合伙企业资料 字段都为非必填
        //但是填了一个就得全部变为必填
        for (let i = 0; i < partnerInfoArr.length; i++) {
          for (let fk in partnerInfoArr[i].FIELDS) {
            partnerInfoArr[i].FIELDS[fk].FIELD_REQUIRED = "0"
          }
        }
      } else {
        //主体身份:普通 机构类别:08合伙企业  的合伙企业资料 字段都为必填
        for (let i = 0; i < partnerInfoArr.length; i++) {
          for (let fk in partnerInfoArr[i].FIELDS) {
            partnerInfoArr[i].FIELDS[fk].FIELD_REQUIRED = "1"
          }
        }
      }
      //显示隐藏合伙企业
      if (_this.groupDatas["RELA_INFO"]["ORG_PARTNER_INFO"]) {
        for (let i = 0; i < partnerInfoArr.length; i++) {
          partnerInfoArr[i].MODULE_CONTROL = isPartnerFlag ? "1" : "0"
        }
      }
      // //显示隐藏委托代表信息
      // if (_this.groupDatas["RELA_INFO"]["ORG_LEGAL_CLIENT_INFO"]) {
      //   for (let i = 0; i < partnerInfoArr.length; i++) {
      //     legalClientInfoArr[i].MODULE_CONTROL = isPartnerFlag ? "1" : "0"
      //   }
      // }
      // 判断实际控制人、控股股东、受益人的单选按钮
      if (_this.groupDatas["RELA_INFO"]["ORG_CONTROLER_INFO"]) {
        let controlerInfo = _this.groupDatas["RELA_INFO"]["ORG_CONTROLER_INFO"][0];
        if (controlerInfo["FIELDS"].MODULE_RADIO_BUTTON.DEFAULT_VALUE != "true"
          && controlerInfo["FIELDS"].MODULE_RADIO_BUTTON.DEFAULT_VALUE != "false") {
          //DEFAULT_VALUE的值只能为"false" "true"，不能为空字符“”或者其他，防止复选框出现全选
          controlerInfo["FIELDS"].MODULE_RADIO_BUTTON.DEFAULT_VALUE = "false";
        }
        if (controlerInfo["FIELDS"].MODULE_RADIO_BUTTON.DEFAULT_VALUE === "true") {
          let field = _this.groupDatas["RELA_INFO"]["ORG_CONTROLER_INFO"][0]["FIELDS"]["MODULE_RADIO_BUTTON"];
          let fieldData = _this.groupDatas["RELA_INFO"]["ORG_CONTROLER_INFO"][0].FIELDS;
         _this.busiLogic["CHECK_MODULE_RADIO"](_this, field, fieldData);
        }
        _this.groupDatas["RELA_INFO"]["ORG_CONTROLER_INFO"][0]["FIELDS"]["CONTROLER_ID_TYPE"].FIELD_DICT_FILTER = _this["oppBusiData"]["VALID_ID_TYPE_FOR_PERSON"]
      }

      if (_this.groupDatas["RELA_INFO"]["ORG_STOCKHOLDER_INFO"]) {
        let stockholder_info = _this.groupDatas["RELA_INFO"]["ORG_STOCKHOLDER_INFO"][0];
        if (stockholder_info["FIELDS"].MODULE_RADIO_BUTTON.DEFAULT_VALUE != "true" && stockholder_info["FIELDS"].MODULE_RADIO_BUTTON.DEFAULT_VALUE != "false") {
          //DEFAULT_VALUE的值只能为"false" "true"，不能为空字符“”或者其他，防止复选框出现全选
          stockholder_info["FIELDS"].MODULE_RADIO_BUTTON.DEFAULT_VALUE = "false";
        }
        if (stockholder_info["FIELDS"].MODULE_RADIO_BUTTON.DEFAULT_VALUE === "true") {
          let field = _this.groupDatas["RELA_INFO"]["ORG_STOCKHOLDER_INFO"][0]["FIELDS"]["MODULE_RADIO_BUTTON"];
          let fieldData = _this.groupDatas["RELA_INFO"]["ORG_STOCKHOLDER_INFO"][0].FIELDS;
         _this.busiLogic["CHECK_MODULE_RADIO"](_this, field, fieldData);
        }
        stockholder_info["FIELDS"]["CONTROLLER_ID_TYPE"].FIELD_DICT_FILTER = _this["oppBusiData"]["VALID_ID_TYPE_FOR_BOTH"]
      }
      if (_this.groupDatas["RELA_INFO"]["ORG_BENEFICIARY_INFO"]) {
        let beneficiaryInfoArr = _this.groupDatas["RELA_INFO"]["ORG_BENEFICIARY_INFO"];
        beneficiaryInfoArr[0]["FIELDS"]["BENEFICIARY_ID_TYPE"].FIELD_DICT_FILTER = _this["oppBusiData"]["VALID_ID_TYPE_FOR_PERSON"];
        for (let i = 0; i < beneficiaryInfoArr.length; i++) {
          let beneficiaryInfo = beneficiaryInfoArr[i]["FIELDS"];
          if (beneficiaryInfo["MODULE_RADIO_BUTTON"].DEFAULT_VALUE != "true"
            && beneficiaryInfo["MODULE_RADIO_BUTTON"].DEFAULT_VALUE != "false") {
            //DEFAULT_VALUE的值只能为"false" "true"，不能为空字符“”或者其他，防止复选框出现全选
            beneficiaryInfo["MODULE_RADIO_BUTTON"].DEFAULT_VALUE = "false";
          }
          if (beneficiaryInfo["MODULE_RADIO_BUTTON"].DEFAULT_VALUE === "true") {
            let field = _this.groupDatas["RELA_INFO"]["ORG_BENEFICIARY_INFO"][i]["FIELDS"]["MODULE_RADIO_BUTTON"];
            let fieldData = _this.groupDatas["RELA_INFO"]["ORG_BENEFICIARY_INFO"][i].FIELDS;
           _this.busiLogic["CHECK_MODULE_RADIO"](_this, field, fieldData);
          }
        }
      }

      if (_this.groupDatas["RELA_INFO"]["ORG_BENEFICIARY_OWNER_INFO"]) {
        let beneficiaryInfoArr = _this.groupDatas["RELA_INFO"]["ORG_BENEFICIARY_OWNER_INFO"];
        beneficiaryInfoArr[0]["FIELDS"]["BENEFICIARY_ID_TYPE"].FIELD_DICT_FILTER = _this["oppBusiData"]["VALID_ID_TYPE_FOR_PERSON"];
        for (let i = 0; i < beneficiaryInfoArr.length; i++) {
          let beneficiaryInfo = beneficiaryInfoArr[i]["FIELDS"];
          if (beneficiaryInfo["MODULE_RADIO_BUTTON"].DEFAULT_VALUE != "true"
            && beneficiaryInfo["MODULE_RADIO_BUTTON"].DEFAULT_VALUE != "false") {
            //DEFAULT_VALUE的值只能为"false" "true"，不能为空字符“”或者其他，防止复选框出现全选
            beneficiaryInfo["MODULE_RADIO_BUTTON"].DEFAULT_VALUE = "false";
          }
          if (beneficiaryInfo["MODULE_RADIO_BUTTON"].DEFAULT_VALUE === "true") {
            let field = _this.groupDatas["RELA_INFO"]["ORG_BENEFICIARY_OWNER_INFO"][i]["FIELDS"]["MODULE_RADIO_BUTTON"];
            let fieldData = _this.groupDatas["RELA_INFO"]["ORG_BENEFICIARY_OWNER_INFO"][i].FIELDS;
           _this.busiLogic["CHECK_MODULE_RADIO"](_this, field, fieldData);
          }
        }
      }
      if (_this.groupDatas["RELA_INFO"]["ORG_BENEFICIARY_ALL_INFO"]) {
        let beneficiaryInfoArr = _this.groupDatas["RELA_INFO"]["ORG_BENEFICIARY_ALL_INFO"];
        for (let i = 0; i < beneficiaryInfoArr.length; i++) {
          let beneficiaryInfo = beneficiaryInfoArr[i]["FIELDS"];
          if (beneficiaryInfo["MODULE_RADIO_BUTTON"].DEFAULT_VALUE != "true"
            && beneficiaryInfo["MODULE_RADIO_BUTTON"].DEFAULT_VALUE != "false") {
            //DEFAULT_VALUE的值只能为"false" "true"，不能为空字符“”或者其他，防止复选框出现全选
            beneficiaryInfo["MODULE_RADIO_BUTTON"].DEFAULT_VALUE = "false";
          }
          if (beneficiaryInfo["MODULE_RADIO_BUTTON"].DEFAULT_VALUE === "true") {
            let field = _this.groupDatas["RELA_INFO"]["ORG_BENEFICIARY_ALL_INFO"][i]["FIELDS"]["MODULE_RADIO_BUTTON"];
            let fieldData = _this.groupDatas["RELA_INFO"]["ORG_BENEFICIARY_ALL_INFO"][i].FIELDS;
           _this.busiLogic["CHECK_MODULE_RADIO"](_this, field, fieldData);
          }
        }
        //修改旧数据里的MODULE_RADIO_BUTTON的值，防止添加分组时显示全选
        _this.oldGroupDatas["RELA_INFO"]["ORG_BENEFICIARY_ALL_INFO"] = _this.groupDatas["RELA_INFO"]["ORG_BENEFICIARY_ALL_INFO"];
        _this.groupDatas["RELA_INFO"]["ORG_BENEFICIARY_ALL_INFO"][0]["FIELDS"]["BENEFICIARY_ID_TYPE"].FIELD_DICT_FILTER = _this["oppBusiData"]["VALID_ID_TYPE_FOR_PERSON"]
      }

      if (_this.groupDatas["RELA_INFO"]["ORG_LINKMAN_INFO"]) {
        _this.groupDatas["RELA_INFO"]["ORG_LINKMAN_INFO"][0]["FIELDS"]["LINKMAN_ID_TYPE"].FIELD_DICT_FILTER = _this["oppBusiData"]["VALID_ID_TYPE_FOR_PERSON"]
      }

      if (_this.groupDatas["RELA_INFO"]["ORG_PARTNER_INFO"]) {
        _this.groupDatas["RELA_INFO"]["ORG_PARTNER_INFO"][0]["FIELDS"]["PID_TYPE"].FIELD_DICT_FILTER = _this["oppBusiData"]["VALID_ID_TYPE_FOR_PERSON"]
      }

      if (_this.groupDatas["RELA_INFO"]["ORG_ASSIGN_PERSON_INFO"]) {
        _this.groupDatas["RELA_INFO"]["ORG_ASSIGN_PERSON_INFO"][0]["FIELDS"]["ASSIGN_PERSON_ID_TYPE"].FIELD_DICT_FILTER = _this["oppBusiData"]["VALID_ID_TYPE_FOR_PERSON"]
      }
      // _this.groupDatas["ORG_INFO"]["ORG_BASIC_INFO"][0]["FIELDS"]["PROF_INVESTOR_TYPE"].DEFAULT_VALUE = "0";
      // _this.groupDatas["ORG_INFO"]["ORG_BASIC_INFO"][0]["FIELDS"]["PROF_INVESTOR_SOURCE"].DEFAULT_VALUE = "00";

      //设置 经办人信息模块下 电话类型 为只有城市区号+电话号码
      _this.groupDatas["RELA_INFO"]["ORG_ASSIGN_PERSON_INFO"][0].FIELDS.ASSIGN_PERSON_TEL.telPhoneType = "1";
    }
  },

  //----------------------业务函数----------------------------------//


  /**
  * openBizOrgRelaInfoNodeLoadBizData 数据解析或回填
  * @param _this
  */
  openBizOrgRelaInfoNodeLoadBizData: async function (_this, busiData) {
    return this.openBizOrgRelaInfoNodeParseOldBiz(_this, busiData)
  },
  //------------------------------页面字段相关逻辑----------------------------------------//
  /**
    * 【CONTROLER_RELATION】实际控制人信息-与本人关系
    *  如果选择本人, 填写本人信息，且不可编辑
    *  如果不是本人, 数据清空
    */
  "CHECK_CONTROLER_RELATION": (_this, field, fieldData) => {
    // 控制人信息
    // let controlerInfo = _this.pages[1]["实际控制人信息"];
    if (field.DEFAULT_VALUE == "0Z") {
      let custBasicInfo = _this.groupDatas["CUST_INFO"]["CUST_BASIC_INFO"][0].FIELDS;
      let custLinkInfo = _this.groupDatas["CUST_INFO"]["CUST_LINK_INFO"][0].FIELDS;
      for (let key in fieldData) {
        if (key !== "CONTROLER_RELATION") {
          fieldData[key].FIELD_CONTROL = "2";
        }
      }
      //
      fieldData["CONTROLER_NAME"].DEFAULT_VALUE = "CUST_FNAME" in custBasicInfo ? custBasicInfo["CUST_FNAME"].DEFAULT_VALUE : custBasicInfo["USER_FNAME"].DEFAULT_VALUE;
      fieldData["CONTROLER_ID_TYPE"].DEFAULT_VALUE = custBasicInfo["ID_TYPE"].DEFAULT_VALUE;
      fieldData["CONTROLER_ID_NO"].DEFAULT_VALUE = custBasicInfo["ID_CODE"].DEFAULT_VALUE;
      fieldData["CONTROLER_ID_EXP_DATE"].DEFAULT_VALUE = custBasicInfo["ID_EXP_DATE"].DEFAULT_VALUE;
      fieldData["CONTROLER_TEL"].DEFAULT_VALUE = custLinkInfo["MOBILE_TEL"].DEFAULT_VALUE;
    } else {
      for (let key in fieldData) {
        if (key != "CONTROLER_RELATION") {
          fieldData[key].FIELD_CONTROL = "0";
          fieldData[key].DEFAULT_VALUE = "";
        }
      }
    }

   _this.busiLogic["CHECK_CONTROLER_ID_NO"](_this, fieldData["CONTROLER_ID_NO"], fieldData);
  },

  /**
   * 【CHECK_CONTROLER_ID_TYPE】实际控制人证件类别：
   *  a)如果实际控制人证件类别是身份证、临时身份证，实际控制人证件号码的验证类型是身份证。
   */
  "CHECK_CONTROLER_ID_TYPE": (_this, field, fieldData) => {
    openBizPubTools.filterIdCode(_this, field, fieldData["CONTROLER_ID_NO"], fieldData)
    //如果 没有勾选与XXX信息保持一致 清空证件号码
    if ("MODULE_RADIO_BUTTON" in fieldData && fieldData["MODULE_RADIO_BUTTON"].DEFAULT_VALUE == "false") {
      fieldData["CONTROLER_ID_NO"].DEFAULT_VALUE = "";
    }
    //同步机构实际控制人信息 证件类型 到受益人信息
    let beneficiaryArr = _this.groupDatas["RELA_INFO"]["ORG_BENEFICIARY_INFO"];
    for (let i = 0; i < beneficiaryArr.length; i++) {
      if (beneficiaryArr[i]["FIELDS"]["MODULE_RADIO_BUTTON"].DEFAULT_VALUE === "true") {
        beneficiaryArr[i]["FIELDS"]["BENEFICIARY_ID_TYPE"].DEFAULT_VALUE = field.DEFAULT_VALUE
      }
    }
    //同步实际控制人信息到 收益所有人模块 反洗钱专有模块信息
    // let module1 = _this.groupDatas["RELA_INFO"]["ORG_CONTROLER_INFO"];
    // if (field.MODULE_ID == "ORG_CONTROLER_INFO") {
    //   //同步实际控制人信息到    
    //   let module2 = _this.groupDatas["RELA_INFO"]["ORG_BENEFICIARY_OWNER_INFO"];
    //   openBizPubTools.syncModule1Tomodule2(_this, module1, module2, "CONTROLER", "BENEFICIARY", [], [["CONTROLER_ID_NO", "BENEFICIARY_ID"], ["CONTROLER_ID_EXP_DATE", "BENEFICIARY_EXP_DATE"]]);
    //   let module3 = _this.groupDatas["RELA_INFO"]["ORG_AML_INFO"];
    //   openBizPubTools.syncModule1Tomodule2(_this, module1, module3, "CONTROLER", "", [], [["CONTROLER_NAME", "USER_NAME"], ["CONTROLER_ID_NO", "ID_CODE"]]);
    // }
  },
  /**
   * 【CONTROLER_ID_NO】实际控制人证件号码
   *  非本人时，实际控制人证件号码不能是本人证件号码
   *  实际控制人证件号码不能重复
   */
  "CHECK_CONTROLER_ID_NO": (_this, field, fieldData) => {
    let controlerInfo = _this.groupDatas["RELA_INFO"]["ORG_CONTROLER_INFO"];
    let formDataArr = [];
    // 实际控制人信息
    for (let i = 0; i < controlerInfo.length; i++) {
      formDataArr.push(controlerInfo[i]["FIELDS"]["CONTROLER_ID_NO"].DEFAULT_VALUE)
    }
    if (_.uniq(formDataArr).length < formDataArr.length) {
      field.correct = false;
      field.message = "实际控制人证件号码已经存在，不能重复添加！";
    } else {
      field.correct = true;
      field.showerr = false;
      field.message = "";
    }
    let beneficiaryArr = _this.groupDatas["RELA_INFO"]["ORG_BENEFICIARY_INFO"];
    for (let i = 0; i < beneficiaryArr.length; i++) {
      if (beneficiaryArr[i]["FIELDS"]["MODULE_RADIO_BUTTON"].DEFAULT_VALUE === "true") {
        beneficiaryArr[i]["FIELDS"]["BENEFICIARY_ID"].DEFAULT_VALUE = field.DEFAULT_VALUE
      }
    }
    //同步实际控制人信息到 收益所有人模块 反洗钱专有模块信息
    // let module1 = _this.groupDatas["RELA_INFO"]["ORG_CONTROLER_INFO"];
    // if (field.MODULE_ID == "ORG_CONTROLER_INFO") {
    //   //同步实际控制人信息到    
    //   let module2 = _this.groupDatas["RELA_INFO"]["ORG_BENEFICIARY_OWNER_INFO"];
    //   openBizPubTools.syncModule1Tomodule2(_this, module1, module2, "CONTROLER", "BENEFICIARY", [], [["CONTROLER_ID_NO", "BENEFICIARY_ID"], ["CONTROLER_ID_EXP_DATE", "BENEFICIARY_EXP_DATE"]]);
    //   let module3 = _this.groupDatas["RELA_INFO"]["ORG_AML_INFO"];
    //   openBizPubTools.syncModule1Tomodule2(_this, module1, module3, "CONTROLER", "", [], [["CONTROLER_NAME", "USER_NAME"], ["CONTROLER_ID_NO", "ID_CODE"]]);
    // }
  },

  /**
   * 【CHECK_CONTROLER_ID_EXP_DATE】实际控制人证件有效期
   */
  "CHECK_CONTROLER_ID_EXP_DATE": (_this, field, fieldData) => {
    if (_this.userType == "1") {
      //同步实际控制人证件有效期 到受益人模块
      let beneficiaryArr = _this.groupDatas["RELA_INFO"]["ORG_BENEFICIARY_INFO"];
      for (let i = 0; i < beneficiaryArr.length; i++) {
        if (beneficiaryArr[i]["FIELDS"]["MODULE_RADIO_BUTTON"].DEFAULT_VALUE === "true") {
          beneficiaryArr[i]["FIELDS"]["BENEFICIARY_EXP_DATE"].DEFAULT_VALUE = field.DEFAULT_VALUE;
        }
      }
      //同步实际控制人信息到 收益所有人模块 反洗钱专有模块信息
      // let module1 = _this.groupDatas["RELA_INFO"]["ORG_CONTROLER_INFO"];
      // if (field.MODULE_ID == "ORG_CONTROLER_INFO") {
      //   //同步实际控制人信息到    
      //   let module2 = _this.groupDatas["RELA_INFO"]["ORG_BENEFICIARY_OWNER_INFO"];
      //   openBizPubTools.syncModule1Tomodule2(_this, module1, module2, "CONTROLER", "BENEFICIARY", [], [["CONTROLER_ID_NO", "BENEFICIARY_ID"], ["CONTROLER_ID_EXP_DATE", "BENEFICIARY_EXP_DATE"]]);
      //   let module3 = _this.groupDatas["RELA_INFO"]["ORG_AML_INFO"];
      //   openBizPubTools.syncModule1Tomodule2(_this, module1, module3, "CONTROLER", "", [], [["CONTROLER_NAME", "USER_NAME"], ["CONTROLER_ID_NO", "ID_CODE"]]);
      // }
    }
  },
  /**
   * 【CHECK_CONTROLER_TEL】实际控制人电话
   */
  "CHECK_CONTROLER_TEL": (_this, field, fieldData) => {
    if (_this.userType == "1") {
      //同步实际控制人电话  到受益人模块
      let beneficiaryArr = _this.groupDatas["RELA_INFO"]["ORG_BENEFICIARY_INFO"];
      for (let i = 0; i < beneficiaryArr.length; i++) {
        if (beneficiaryArr[i]["FIELDS"]["MODULE_RADIO_BUTTON"].DEFAULT_VALUE === "true") {
          beneficiaryArr[i]["FIELDS"]["BENEFICIARY_TEL"].DEFAULT_VALUE = field.DEFAULT_VALUE
        }
      }
      //同步实际控制人信息到 收益所有人模块 反洗钱专有模块信息
      // let module1 = _this.groupDatas["RELA_INFO"]["ORG_CONTROLER_INFO"];
      // if (field.MODULE_ID == "ORG_CONTROLER_INFO") {
      //   //同步实际控制人信息到    
      //   let module2 = _this.groupDatas["RELA_INFO"]["ORG_BENEFICIARY_OWNER_INFO"];
      //   openBizPubTools.syncModule1Tomodule2(_this, module1, module2, "CONTROLER", "BENEFICIARY", [], [["CONTROLER_ID_NO", "BENEFICIARY_ID"], ["CONTROLER_ID_EXP_DATE", "BENEFICIARY_EXP_DATE"]]);
      //   let module3 = _this.groupDatas["RELA_INFO"]["ORG_AML_INFO"];
      //   openBizPubTools.syncModule1Tomodule2(_this, module1, module2, "CONTROLER", "", [], [["CONTROLER_NAME", "USER_NAME"], ["CONTROLER_ID_NO", "ID_CODE"]]);
      // }
    }
  },
  /**
   * 【CHECK_CONTROLER_NAME】实际控制人名称
   */
  "CHECK_CONTROLER_NAME": (_this, field, fieldData) => {
    if (_this.userType == "1") {
      let beneficiaryArr = _this.groupDatas["RELA_INFO"]["ORG_BENEFICIARY_INFO"];
      for (let i = 0; i < beneficiaryArr.length; i++) {
        if (beneficiaryArr[i]["FIELDS"]["MODULE_RADIO_BUTTON"].DEFAULT_VALUE === "true") {
          beneficiaryArr[i]["FIELDS"]["BENEFICIARY_NAME"].DEFAULT_VALUE = field.DEFAULT_VALUE
        }
      }
      //同步实际控制人信息到 收益所有人模块 反洗钱专有模块信息
      let module1 = _this.groupDatas["RELA_INFO"]["ORG_CONTROLER_INFO"];
      // if (field.MODULE_ID == "ORG_CONTROLER_INFO") {
      //   //同步实际控制人信息到    
      //   let module2 = _this.groupDatas["RELA_INFO"]["ORG_BENEFICIARY_OWNER_INFO"];
      //   openBizPubTools.syncModule1Tomodule2(_this, module1, module2, "CONTROLER", "BENEFICIARY", [], [["CONTROLER_ID_NO", "BENEFICIARY_ID"], ["CONTROLER_ID_EXP_DATE", "BENEFICIARY_EXP_DATE"]]);
      //   let module3 = _this.groupDatas["RELA_INFO"]["ORG_AML_INFO"];
      //   openBizPubTools.syncModule1Tomodule2(_this, module1, module3, "CONTROLER", "", [], [["CONTROLER_NAME", "USER_NAME"], ["CONTROLER_ID_NO", "ID_CODE"]]);
      // }
    }
  },
  /**
 * 【CHECK_BENEFICIARY_ID_TYPE】受益人证件类别：
 *  a)如果受益人证件类别是身份证、临时身份证，受益人证件号码的验证类型是身份证。
 */
  CHECK_BENEFICIARY_ID_TYPE: (_this, field, fieldData) => {
    openBizPubTools.filterIdCode(_this, field, fieldData["BENEFICIARY_ID"], fieldData)
    //如果 没有勾选与XXX信息保持一致 清空证件号码
    if ("MODULE_RADIO_BUTTON" in fieldData && fieldData["MODULE_RADIO_BUTTON"].DEFAULT_VALUE == "false") {
      fieldData["BENEFICIARY_ID"].DEFAULT_VALUE = "";
    }
  },
  /**
   * 【BENEFICIARY_ID】受益人证件号码
   *  非本人时，受益人证件号码不能是本人证件号码
   *  受益人证件号码不能重复
   */
  CHECK_BENEFICIARY_ID: (_this, field, fieldData) => {
    let moudleId = field.MODULE_ID; //增加模块ID 这里有可能是受益人和收益所有人 处理逻辑一样
    let beneficiaryInfo = _this.groupDatas["RELA_INFO"][moudleId];
    let formDataArr = [];
    // 受益人信息
    for (let i = 0; i < beneficiaryInfo.length; i++) {
      let benType = beneficiaryInfo[i]["FIELDS"]["BENEFICIARY_ID_TYPE"];
      let benId = beneficiaryInfo[i]["FIELDS"]["BENEFICIARY_ID"];
      formDataArr.push({ "ID_TYPE": benType.DEFAULT_VALUE, "ID_CODE": benId.DEFAULT_VALUE })
    }
    if (_.unionWith(formDataArr, function (item1, item2) { return item1["ID_TYPE"] == item2["ID_TYPE"] && item1["ID_CODE"] == item2["ID_CODE"] }).length < formDataArr.length) {
      field.correct = false;
      field.message = "同样的受益人证件类型和证件号码已经存在，不能重复添加！";
    } else {
      field.correct = true;
      field.showerr = false;
      field.message = "";
    }
  },
  /**
   * 【CHECK_AML_ID_TYPE】反洗钱专有模块下 证件类型  
   *  a)如果证件类别是身份证、临时身份证，证件号码的验证类型是身份证。
   */
  CHECK_AML_ID_TYPE: (_this, field, fieldData) => {
    fieldData["ID_CODE"].VALID_TYPE = "numCharMinus[0,48]"
    openBizPubTools.filterIdCode(_this, field, fieldData["ID_CODE"], fieldData)
  },
  CHECK_AML_ID_CODE: (_this, field, fieldData) => {
    let amlInfo = _this.groupDatas["RELA_INFO"]["ORG_AML_INFO"]
    let formDataArr = [];
    // 受益人信息
    for (let i = 0; i < amlInfo.length; i++) {
      let benType = amlInfo[i]["FIELDS"]["ID_TYPE"];
      let benId = amlInfo[i]["FIELDS"]["ID_CODE"];
      formDataArr.push({ "ID_TYPE": benType.DEFAULT_VALUE, "ID_CODE": benId.DEFAULT_VALUE })
    }
    if (_.unionWith(formDataArr, function (item1, item2) { return item1["ID_TYPE"] == item2["ID_TYPE"] && item1["ID_CODE"] == item2["ID_CODE"] }).length < formDataArr.length) {
      field.correct = false;
      field.message = "同样的证件类型和证件号码已经存在，不能重复添加！";
    } else {
      field.correct = true;
      field.showerr = false;
      field.message = "";
    }
  },
  /**
   * 【CHECK_LINKMAN_ID_TYPE】机构开户 联系人证件类别：
   *  a)如果证件类别是身份证、临时身份证，证件号码的验证类型是身份证。
   */
  CHECK_LINKMAN_ID_TYPE: (_this, field, fieldData) => {
    fieldData["LINKMAN_ID"].VALID_TYPE = "numCharMinus[0,48]"
    openBizPubTools.filterIdCode(_this, field, fieldData["LINKMAN_ID"], fieldData)
  },
  /**
   * 【CHECK_LINKMAN_ID】机构开户 联系人证件号码：
   * 新模块的证件类型跟证件号码不能与已有的重复
   */
  CHECK_LINKMAN_ID: (_this, field, fieldData) => {
    let linkManInfo = _this.groupDatas["RELA_INFO"]["ORG_LINKMAN_INFO"];
    let formDataArr = [];
    // 受益人信息
    for (let i = 0; i < linkManInfo.length; i++) {
      let benType = linkManInfo[i]["FIELDS"]["LINKMAN_ID_TYPE"];
      let benId = linkManInfo[i]["FIELDS"]["LINKMAN_ID"];
      formDataArr.push({ "ID_TYPE": benType.DEFAULT_VALUE, "ID_CODE": benId.DEFAULT_VALUE })
    }
    if (_.unionWith(formDataArr, function (item1, item2) { return item1["ID_TYPE"] == item2["ID_TYPE"] && item1["ID_CODE"] == item2["ID_CODE"] }).length < formDataArr.length) {
      field.correct = false;
      field.message = "同样的联系人证件类型和证件号码已经存在，不能重复添加！";
    } else {
      field.correct = true;
      field.showerr = false;
      field.message = "";
    }
  },
  /**
   * 【CHECK_LINKMAN_NAME】其他联系人姓名：
   *  1.其他联系人信息的姓名不能是客户本人的姓名！
   *  2.如果其他联系人姓名填写后，其他联系人联系电话必填。
   */
  CHECK_LINKMAN_NAME: (_this, field, fieldData) => {
    // 其他联系人信息
    let fields = _this.groupDatas["ORG_INFO"]["ORG_BASIC_INFO"][0].FIELDS
    let custName = "CUST_FNAME" in fields ? fields["CUST_FNAME"].DEFAULT_VALUE : fields["USER_FNAME"].DEFAULT_VALUE;
    if (field.DEFAULT_VALUE != "" && field.DEFAULT_VALUE == custName) {
      field.correct = false;
      field.message = "其他联系人信息的姓名不能是客户本人的姓名";
    }
    fieldData["LINKMAN_MOBILE_TEL"].FIELD_REQUIRED = !field.DEFAULT_VALUE ? "0" : "1"
    fieldData["LINKMAN_NAME"].VALID_TYPE = "linkman_name"
  },
  /**
   * 【CHECK_LINKMAN_MOBILE_TEL】其他联系人联系电话：
   *  1.其他联系人信息的手机号码不能是客户本人的手机号码！
   *  2.如果其他联系人联系电话填写后，其他联系人姓名必填。
   */
  CHECK_LINKMAN_MOBILE_TEL: (_this, field, fieldData) => {
    // 其他联系人信息
    let mobileTel = _this.groupDatas["ORG_INFO"]["ORG_LINK_INFO"][0].FIELDS["MOBILE_TEL"].DEFAULT_VALUE;
    //1
    if (field.DEFAULT_VALUE != "" && field.DEFAULT_VALUE == mobileTel) {
      field.correct = false;
      field.message = "不能是客户本人的手机号码";
    }
    fieldData["LINKMAN_NAME"].FIELD_REQUIRED = !field.DEFAULT_VALUE ? "0" : "1"
  },
  /**  
 * 1.【CHECK_PID_CODE】机构开户 合伙人证件号码 
 * 新模块的证件类型跟证件号码不能与已有的重复
 */
  CHECK_PID_CODE: (_this, field, fieldData) => {
    if (field.MODULE_ID == "ORG_PARTNER_INFO") {
      let gk = "RELA_INFO";
      let linkManInfo = _this.groupDatas[gk]["ORG_PARTNER_INFO"];
      let formDataArr = [];
      // 受益人信息
      for (let i = 0; i < linkManInfo.length; i++) {
        let benType = linkManInfo[i]["FIELDS"]["PID_TYPE"];
        let benId = linkManInfo[i]["FIELDS"]["PID_CODE"];
        formDataArr.push({ "ID_TYPE": benType.DEFAULT_VALUE, "ID_CODE": benId.DEFAULT_VALUE })
      }
      if (_.unionWith(formDataArr, function (item1, item2) { return item1["ID_TYPE"] == item2["ID_TYPE"] && item1["ID_CODE"] == item2["ID_CODE"] }).length < formDataArr.length) {
        field.correct = false;
        field.message = "同样的合伙人证件类型和证件号码已经存在，不能重复添加！";
      } else {
        field.correct = true;
        field.showerr = false;
        field.message = "";
      }
      let partnerInfoArr = _this.groupDatas[gk]["ORG_PARTNER_INFO"];
      //修改合伙人的必填属性
      if (_this.oppBusiData["isPrivatFund"]) {
        //主体身份 私募基金管理人 机构类别 私募基金管理人 合伙企业资料 字段都为非必填
        //但是填了一个就得全部变为必填
        openBizPubTools.changeModuleAllFieldsRequired(_this, partnerInfoArr);
      }
    }
  },
  /**
   *  2.【CHECK_LIAB_TYPE】机构开户 合伙人模块 责任承担模式
   *  主体身份 私募基金管理人 机构类别 私募基金管理人 合伙企业资料 字段都为非必填
   *  但是填了一个就得全部变为必填
   */
  CHECK_LIAB_TYPE: (_this, field, fieldData) => {
    if (field.MODULE_ID == "ORG_PARTNER_INFO") {
      let partnerInfoArr = _this.groupDatas["RELA_INFO"]["ORG_PARTNER_INFO"];
      //修改合伙人的必填属性
      if (_this.oppBusiData["isPrivatFund"]) {
        //主体身份 私募基金管理人 机构类别 私募基金管理人 合伙企业资料 字段都为非必填
        //但是填了一个就得全部变为必填
        openBizPubTools.changeModuleAllFieldsRequired(_this, partnerInfoArr);
      }
    }
  },
  /**
 *  3.【CHECK_LIAB_TYPE】机构开户 合伙人模块 证件类型
 *  主体身份 私募基金管理人 机构类别 私募基金管理人 合伙企业资料 字段都为非必填
 *  但是填了一个就得全部变为必填
 */
  CHECK_PID_TYPE: (_this, field, fieldData) => {
    if (field.MODULE_ID == "ORG_PARTNER_INFO") {
      let partnerInfoArr = _this.groupDatas["RELA_INFO"]["ORG_PARTNER_INFO"];
      //修改合伙人的必填属性
      if (_this.oppBusiData["isPrivatFund"]) {
        //主体身份 私募基金管理人 机构类别 私募基金管理人 合伙企业资料 字段都为非必填
        //但是填了一个就得全部变为必填
        openBizPubTools.changeModuleAllFieldsRequired(_this, partnerInfoArr);
      }
    }
  },
  /**
 *  4.【CHECK_ID_DATE】机构开户 合伙人模块 合伙人证件有效期
 *  主体身份 私募基金管理人 机构类别 私募基金管理人 合伙企业资料 字段都为非必填
 *  但是填了一个就得全部变为必填
 */
  CHECK_ID_DATE: (_this, field, fieldData) => {
    if (field.MODULE_ID == "ORG_PARTNER_INFO") {
      let partnerInfoArr = _this.groupDatas["RELA_INFO"]["ORG_PARTNER_INFO"];
      //修改合伙人的必填属性
      if (_this.oppBusiData["isPrivatFund"]) {
        //主体身份 私募基金管理人 机构类别 私募基金管理人 合伙企业资料 字段都为非必填
        //但是填了一个就得全部变为必填
        openBizPubTools.changeModuleAllFieldsRequired(_this, partnerInfoArr);
      }
    }
  },
  /**
 *  5.【CHECK_PARTNER_NAME】机构开户 合伙人模块 合伙人名称
 *  主体身份 私募基金管理人 机构类别 私募基金管理人 合伙企业资料 字段都为非必填
 *  但是填了一个就得全部变为必填
 */
  CHECK_PARTNER_NAME: (_this, field, fieldData) => {
    if (field.MODULE_ID == "ORG_PARTNER_INFO") {
      let partnerInfoArr = _this.groupDatas["RELA_INFO"]["ORG_PARTNER_INFO"];
      //修改合伙人的必填属性
      if (_this.oppBusiData["isPrivatFund"]) {
        //主体身份 私募基金管理人 机构类别 私募基金管理人 合伙企业资料 字段都为非必填
        //但是填了一个就得全部变为必填
        openBizPubTools.changeModuleAllFieldsRequired(_this, partnerInfoArr);
      }
    }
  },
  /**
 * 【CHECK_RECORD_SOURCE】诚信记录来源：
 *  a) 为“其他”时诚信备注为必填项
 */
  "CHECK_RECORD_SOURCE": (_this, field, fieldData) => {
    if (field.DEFAULT_VALUE == "99") {
      fieldData["RECORD_TXT"].FIELD_REQUIRED = "1"
    } else {
      fieldData["RECORD_TXT"].FIELD_REQUIRED = "0"
    }
  },

  /**
   * 【CHECK_LEGAL_REP】法定代表人名称
   */
  "CHECK_LEGAL_REP": (_this, field, fieldData) => {
    let controler = _this.groupDatas["RELA_INFO"]["ORG_CONTROLER_INFO"] && _this.groupDatas["RELA_INFO"]["ORG_CONTROLER_INFO"][0]["FIELDS"];
    let stockholder = _this.groupDatas["RELA_INFO"]["ORG_STOCKHOLDER_INFO"] && _this.groupDatas["RELA_INFO"]["ORG_STOCKHOLDER_INFO"][0]["FIELDS"];
    if (controler["MODULE_RADIO_BUTTON"].DEFAULT_VALUE === "true") {
      controler["CONTROLER_NAME"].DEFAULT_VALUE = field.DEFAULT_VALUE;
    }
    if (stockholder["MODULE_RADIO_BUTTON"].DEFAULT_VALUE === "true") {
      stockholder["CONTROLLER"].DEFAULT_VALUE = field.DEFAULT_VALUE;
      _this.groupDatas["RELA_INFO"]["ORG_BENEFICIARY_INFO"][0]["FIELDS"]["BENEFICIARY_NAME"].DEFAULT_VALUE = stockholder["CONTROLLER"].DEFAULT_VALUE;
    }
    //同步到控股股东模块
    openBizPubTools.syncOrgLegalRepInfo(_this)
    //同步法人代表数据到开户经办人
    if (_this.groupDatas.RELA_INFO.ORG_ASSIGN_PERSON_INFO[0].FIELDS.USESAME_INFO) {
      _this.busiLogic.CHECK_USESAME_INFO(_this, _this.groupDatas["RELA_INFO"]["ORG_ASSIGN_PERSON_INFO"][0].FIELDS.USESAME_INFO, _this.groupDatas["RELA_INFO"]["ORG_ASSIGN_PERSON_INFO"][0].FIELDS)
    }
  },

  /**
   * 【CHECK_LEGAL_REP_ID_CODE】法定代表人证件号码
   */
  "CHECK_LEGAL_REP_ID_CODE": (_this, field, fieldData) => {
    let controler = _this.groupDatas["RELA_INFO"]["ORG_CONTROLER_INFO"][0]["FIELDS"];
    let stockholder = _this.groupDatas["RELA_INFO"]["ORG_STOCKHOLDER_INFO"][0]["FIELDS"];
    if (controler["MODULE_RADIO_BUTTON"].DEFAULT_VALUE === "true") {
      controler["CONTROLER_ID_NO"].DEFAULT_VALUE = field.DEFAULT_VALUE;
    }
    if (stockholder["MODULE_RADIO_BUTTON"].DEFAULT_VALUE === "true") {
      stockholder["CONTROLLER_ID_CODE"].DEFAULT_VALUE = field.DEFAULT_VALUE;
      _this.groupDatas["RELA_INFO"]["ORG_BENEFICIARY_INFO"][0]["FIELDS"]["BENEFICIARY_ID"].DEFAULT_VALUE = stockholder["CONTROLLER_ID_CODE"].DEFAULT_VALUE;

    }
    //同步到控股股东模块
    openBizPubTools.syncOrgLegalRepInfo(_this)
    //同步法人代表数据到开户经办人
    if (_this.groupDatas.RELA_INFO.ORG_ASSIGN_PERSON_INFO[0].FIELDS.USESAME_INFO) {
      _this.busiLogic["CHECK_USESAME_INFO"](_this, _this.groupDatas["RELA_INFO"]["ORG_ASSIGN_PERSON_INFO"][0].FIELDS.USESAME_INFO, _this.groupDatas["RELA_INFO"]["ORG_ASSIGN_PERSON_INFO"][0].FIELDS)
    }

  },

  /**
   * 【CHECK_LEGAL_REP_ID_EXP_DATE】法定代表人证件有效期
   */
  "CHECK_LEGAL_REP_ID_EXP_DATE": (_this, field, fieldData) => {
    let controler = _this.groupDatas["RELA_INFO"]["ORG_CONTROLER_INFO"][0]["FIELDS"];
    let stockholder = _this.groupDatas["RELA_INFO"]["ORG_STOCKHOLDER_INFO"][0]["FIELDS"];
    if (controler["MODULE_RADIO_BUTTON"].DEFAULT_VALUE === "true") {
      controler["CONTROLER_ID_EXP_DATE"].DEFAULT_VALUE = field.DEFAULT_VALUE;
    }
    if (stockholder["MODULE_RADIO_BUTTON"].DEFAULT_VALUE === "true") {
      stockholder["CONTROLLER_ID_EXP_DATE"].DEFAULT_VALUE = field.DEFAULT_VALUE;
      _this.groupDatas["RELA_INFO"]["ORG_BENEFICIARY_INFO"][0]["FIELDS"]["BENEFICIARY_EXP_DATE"].DEFAULT_VALUE = stockholder["CONTROLLER_ID_EXP_DATE"].DEFAULT_VALUE;

    }
    //同步到控股股东模块
    openBizPubTools.syncOrgLegalRepInfo(_this)
    //同步法人代表数据到开户经办人
    if (_this.groupDatas.RELA_INFO.ORG_ASSIGN_PERSON_INFO[0].FIELDS.USESAME_INFO) {
      _this.busiLogic["CHECK_USESAME_INFO"](_this, _this.groupDatas["RELA_INFO"]["ORG_ASSIGN_PERSON_INFO"][0].FIELDS.USESAME_INFO, _this.groupDatas["RELA_INFO"]["ORG_ASSIGN_PERSON_INFO"][0].FIELDS)
    } 
  },

  /**
   * 【CHECK_LEGAL_REP_ID_TYPE】法定代表人证件类型
   */
  "CHECK_LEGAL_REP_ID_TYPE": (_this, field, fieldData) => {
    if (field.FIELD_DICT == "ID_TYPE") {
      openBizPubTools.filterIdCode(_this, field, fieldData["LEGAL_REP_ID_CODE"], fieldData)
    }
    let controler = _this.groupDatas["RELA_INFO"]["ORG_CONTROLER_INFO"][0]["FIELDS"];
    let stockholder = _this.groupDatas["RELA_INFO"]["ORG_STOCKHOLDER_INFO"][0]["FIELDS"];
    if (controler["MODULE_RADIO_BUTTON"].DEFAULT_VALUE === "true") {
      controler["CONTROLER_ID_TYPE"].DEFAULT_VALUE = field.DEFAULT_VALUE;
    }
    if (stockholder["MODULE_RADIO_BUTTON"].DEFAULT_VALUE === "true") {
      stockholder["CONTROLLER_ID_TYPE"].DEFAULT_VALUE = field.DEFAULT_VALUE;
      _this.groupDatas["RELA_INFO"]["ORG_BENEFICIARY_INFO"][0]["FIELDS"]["BENEFICIARY_ID_TYPE"].DEFAULT_VALUE = stockholder["CONTROLLER_ID_TYPE"].DEFAULT_VALUE;
    }
    // 法人代表为机构，默认显示委派代表信息，也可以由公参决定隐藏
    let SHOW_LEGAL_CLIENT = (openBizPubTools.getBusiCommParam(_this, "SHOW_LEGAL_CLIENT") || "1") == "1";
    //证件类型为机构才能显示
    // let idType = field.DEFAULT_VALUE;
    // if (SHOW_LEGAL_CLIENT && idType && idType.charAt(0) != "0") {
    //   _this.groupDatas["RELA_INFO"]["ORG_LEGAL_CLIENT_INFO"][0].MODULE_CONTROL = '1';
    // } else {
    //   _this.groupDatas["RELA_INFO"]["ORG_LEGAL_CLIENT_INFO"][0].MODULE_CONTROL = '0';
    // }
    //同步到控股股东模块
    openBizPubTools.syncOrgLegalRepInfo(_this)
    if (_this.userType == "1" && _this.groupDatas.RELA_INFO.ORG_ASSIGN_PERSON_INFO[0].FIELDS.USESAME_INFO) {
      //同步法人代表数据到开户经办人
      _this.busiLogic["CHECK_USESAME_INFO"](_this, _this.groupDatas["RELA_INFO"]["ORG_ASSIGN_PERSON_INFO"][0].FIELDS.USESAME_INFO, _this.groupDatas["RELA_INFO"]["ORG_ASSIGN_PERSON_INFO"][0].FIELDS)
    }
  },
    /**
   * 【CHECK_CONTROLLER_ID_CODE】控股股东证件类型
   */
  "CHECK_CONTROLLER_ID_TYPE": (_this, field, fieldData) => {
    if (field.FIELD_DICT == "ID_TYPE") {
      openBizPubTools.filterIdCode(_this, field, fieldData["CONTROLLER_ID_CODE"], fieldData)
    }
    //如果 没有勾选与XXX信息保持一致 清空证件号码
    if ("MODULE_RADIO_BUTTON" in fieldData && fieldData["MODULE_RADIO_BUTTON"].DEFAULT_VALUE == "") {
      fieldData["CONTROLLER_ID_CODE"].DEFAULT_VALUE = "";
    }
  },
}