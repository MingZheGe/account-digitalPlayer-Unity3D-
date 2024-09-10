/* 
*   产品开户 关联信息分组节点封装
*   方法封装
*   @author  linsc
*/

import oppService from '../../../../../service/opp-service.js'
import date from '../../../../../tools/date.js'
import smsService from '../../../../../service/sms-service'
import * as utils from "../../../../../tools/util"
import * as openBizPubTools from "./openBizPublicTools"


export default {
  //----------------------------------钩子函数----------------------//
  /*
  *@method openBizProRelaInfoNodeBeforeLoadBiz
  *@desc 钩子函数 加载历史数据之前触发
  *@MethodAuthor  linsc
  *@Date: 2019-06-11 15:19:09
  */
  openBizProRelaInfoNodeBeforeLoadBiz: function (_this) {
    return new Promise((resolve, rejects) => {
      console.log("custInfoBeforeLoadBiz")
      resolve()
    })
  },
  /*
    *@method openBizProRelaInfoNodeAfterLoadBiz
    *@desc  钩子函数  加载历史数据后触发
    *@MethodAuthor  linsc
    *@Date: 2019-06-13 09:42:56
  */
  openBizProRelaInfoNodeAfterLoadBiz: function (_this) {

  },
  /*
  *@method openBizProRelaInfoNodeBeforeSave
  *@desc 钩子函数 自定义保存数
  *@MethodAuthor  linsc
  *@Date: 2019-06-11 15:19:09
  */
  openBizProRelaInfoNodeBeforeSave: async function (_this, params) {
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
  *@method openBizProRelaInfoNodeValidate
  *@desc 钩子函数 下一步验证
  *@MethodAuthor  linsc
  *@Date: 2019-06-11 15:19:09
  */
  openBizProRelaInfoNodeValidate: function (_this) {
    return true;
  },

  /*
  *@method openBizProRelaInfoNodeGetData
  *@desc 拼接数据
  *@MethodAuthor  linsc
  *@Date: 2019-06-11 15:19:09
  */
  openBizProRelaInfoNodeGetData: function (_this, params) {
  },

  /*
  *@method openBizProRelaInfoNodePageActivated
  *@desc 钩子函数：页面激活
  *@MethodAuthor  linsc
  *@Date: 2019-06-11 15:19:09
  */
  openBizProRelaInfoNodePageActivated: function (_this, groupId) {
    console.log("openBizProRelaInfoNodePageActivated")
    if (groupId === "RELA_INFO") {
      //1.设置各模块下证件类型
      // 产品托管人信息
      if (_this.groupDatas["RELA_INFO"]["PRO_TRUSTEE_INFO"]) {
        _this.groupDatas["RELA_INFO"]["PRO_TRUSTEE_INFO"][0]["FIELDS"]["PRO_TRUSTEE_ID_TYPE"].FIELD_DICT_FILTER = _this["oppBusiData"]["VALID_ID_TYPE_FOR_ORG"]
      }
      //产品投顾信息
      if (_this.groupDatas["RELA_INFO"]["PRO_INVEST_ADVISER_INFO"]) {
        _this.groupDatas["RELA_INFO"]["PRO_INVEST_ADVISER_INFO"][0]["FIELDS"]["INVESTASER_ID_TYPE"].FIELD_DICT_FILTER = _this["oppBusiData"]["VALID_ID_TYPE_FOR_ORG"]
        _this.groupDatas["RELA_INFO"]["PRO_INVEST_ADVISER_INFO"][0]["FIELDS"]["INVEST_REP_ID_TYPE"].FIELD_DICT_FILTER = _this["oppBusiData"]["VALID_ID_TYPE_FOR_PERSON"]
      }
      //份额登记机构信息
      if (_this.groupDatas["RELA_INFO"]["PRO_SHAREREG_ORG_INFO"]) {
        _this.groupDatas["RELA_INFO"]["PRO_SHAREREG_ORG_INFO"][0]["FIELDS"]["SHAREREG_ORG_ID_TYPE"].FIELD_DICT_FILTER = _this["oppBusiData"]["VALID_ID_TYPE_FOR_ORG"]
      }

      // 产品联系人信息  
      if (_this.groupDatas["RELA_INFO"]["ORG_LINKMAN_INFO"]) {
        _this.groupDatas["RELA_INFO"]["ORG_LINKMAN_INFO"][0]["FIELDS"]["LINKMAN_ID_TYPE"].FIELD_DICT_FILTER = _this["oppBusiData"]["VALID_ID_TYPE_FOR_PERSON"]
        if (openBizPubTools.getBusiCommParam(_this, "MAX_LENGTH")) {
          //设置产品联系人信息模块最大分组数量
          _this.groupDatas["RELA_INFO"]["ORG_LINKMAN_INFO"][0]["MAX_LENGTH"] = openBizPubTools.getBusiCommParam(_this, "MAX_LENGTH");
        }
      }
      // 开户经办人信息  
      if (_this.groupDatas["RELA_INFO"]["ORG_ASSIGN_PERSON_INFO"]) {
        _this.groupDatas["RELA_INFO"]["ORG_ASSIGN_PERSON_INFO"][0]["FIELDS"]["ASSIGN_PERSON_ID_TYPE"].FIELD_DICT_FILTER = _this["oppBusiData"]["VALID_ID_TYPE_FOR_PERSON"]
      }
      // 产品信息
      if (_this.groupDatas["RELA_INFO"]["PRODUCT_INFO"]) {
        // 托管人证件类型
        _this.groupDatas["RELA_INFO"]["PRO_TRUSTEE_INFO"][0]["FIELDS"]["PRO_TRUSTEE_ID_TYPE"].FIELD_DICT_FILTER = _this["oppBusiData"]["VALID_ID_TYPE_FOR_ORG"]
      }
      //同步法人代表数据到开户经办人
      if (_this.groupDatas.RELA_INFO.ORG_ASSIGN_PERSON_INFO[0].FIELDS.USESAME_INFO) {
        _this.busiLogic["CHECK_USESAME_INFO"](_this, _this.groupDatas["RELA_INFO"]["ORG_ASSIGN_PERSON_INFO"][0].FIELDS.USESAME_INFO, _this.groupDatas["RELA_INFO"]["ORG_ASSIGN_PERSON_INFO"][0].FIELDS)
      }
      //设置 经办人信息模块下 电话类型 为只有城市区号+电话号码
      _this.groupDatas["RELA_INFO"]["ORG_ASSIGN_PERSON_INFO"][0].FIELDS.ASSIGN_PERSON_TEL.telPhoneType = "1";
    }
  },

  //----------------------业务函数----------------------------------//


  /**
  * openBizProRelaInfoNodeLoadBizData 数据解析或回填
  * @param _this
  */
  openBizProRelaInfoNodeLoadBizData: async function (_this, busiData) {
    return this.openBizProRelaInfoNodeParseOldBiz(_this, busiData)
  },

  /**
  * openBizProRelaInfoNodeParseOldBiz 重新加载转换之后的历史数据
  * @param _this
  */
  openBizProRelaInfoNodeParseOldBiz: function (_this, bdata) { // 解析身份证读卡数据
    console.log("openBizProRelaInfoNodeParseOldBiz==========开始")
    console.log("openBizProRelaInfoNodeParseOldBiz==========结束")
  },
  //--------------------------------------------------检查逻辑--------------------------------------------------
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
   * 【CHECK_HAS_TRUSTEE】是否有托管人
   *  a) "1": 有 显示所有字段， 0:无 隐藏其他字段
   */
  "CHECK_HAS_TRUSTEE": (_this, field, fieldData) => {
    for (let fk in fieldData) {
      if (fk != field.FIELD_ID)
        fieldData[fk].FIELD_CONTROL = field.DEFAULT_VALUE == "0" ? "1" : "0";
    }
  },
  /**
   * 【CHECK_HAS_INVEST_ADVISER】是否产品投顾
   *  a) "1": 有 显示所有字段， 0:无 隐藏其他字段
   */
  "CHECK_HAS_INVEST_ADVISER": (_this, field, fieldData) => {
    for (let fk in fieldData) {
      if (fk != field.FIELD_ID)
        fieldData[fk].FIELD_CONTROL = field.DEFAULT_VALUE == "0" ? "1" : "0";
    }
  },
  /**
   * 【CHECK_INVEST_REP_ID_TYPE】 投资顾问代表证件类型
   *  设置证件号码过滤类型 清除证件号码
   */
  "CHECK_INVEST_REP_ID_TYPE": (_this, field, fieldData) => {
    openBizPubTools.filterIdCode(_this, field, fieldData["INVEST_REP_ID_CODE"], fieldData)
  },
  /**
  * 【CHECK_INVESTASER_ID_TYPE】投资顾问证件类型
  * 设置证件号码过滤类型 清除证件号码
  */
  "CHECK_INVESTASER_ID_TYPE": (_this, field, fieldData) => {
    if (_this.userType == "2") {
      openBizPubTools.filterIdCode(_this, field, fieldData["INVESTASER_ID_CODE"], fieldData)
    }
  },
  /**
   * 【CHECK_PRO_TRUSTEE_ID_TYPE】托管人证件类型
   * 设置证件号码过滤类型 清除证件号码
   */
  "CHECK_PRO_TRUSTEE_ID_TYPE": (_this, field, fieldData) => {
    if (_this.userType == "2") {
      openBizPubTools.filterIdCode(_this, field, fieldData["PRO_TRUSTEE_ID_CODE"], fieldData)
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
   * 【CHECK_ASSIGN_PERSON_ID_TYPE】机构开户 开户经办人 证件类别：
   *  a)如果证件类别是身份证、临时身份证，证件号码的验证类型是身份证。
   */
  CHECK_ASSIGN_PERSON_ID_TYPE: (_this, field, fieldData) => {
    openBizPubTools.filterIdCode(_this, field, fieldData["ASSIGN_PERSON_ID"], fieldData)
  },
}