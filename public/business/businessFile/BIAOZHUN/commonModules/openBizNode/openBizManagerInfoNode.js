/* 
*   产品开户 产品管理人信息模块
*   方法封装
*   @author  linsc
*/

import * as utils from "../../../../../tools/util"
import * as openBizPubTools from "./openBizPublicTools"


export default {
  //----------------------------------钩子函数----------------------//
  /*
  *@method openBizManagerInfoNodeBeforeLoadBiz
  *@desc 钩子函数 加载历史数据之前触发
  *@MethodAuthor  linsc
  *@Date: 2019-06-11 15:19:09
  */
  openBizManagerInfoNodeBeforeLoadBiz: function (_this) {
  },
  /*
   *@method openBizManagerInfoNodeAfterLoadBiz
   *@desc  钩子函数  加载历史数据后触发
   *@MethodAuthor  linsc
   *@Date: 2019-06-13 09:42:56
  */
  openBizManagerInfoNodeAfterLoadBiz: function (_this) {
  },
  /*
  *@method openBizManagerInfoNodeBeforeSave
  *@desc 钩子函数 自定义保存数
  *@MethodAuthor  linsc
  *@Date: 2019-06-11 15:19:09
  */
  openBizManagerInfoNodeBeforeSave: async function (_this, params) {
    if (_this.groupId == "MANAGER_INFO") {
      //产品户 将机构控股股东模块 模块的一致按钮值转为一柜通的USESAME_INFO
      let mds = ["ORG_STOCKHOLDER_INFO"];
      mds.map((md) => {
        if (_this.moduleId.indexOf(md) != -1 && params[_this.groupId][md]) {
          for (let i = 0; i < params[_this.groupId][md].length; i++) {
            let mdd = params[_this.groupId][md][i];
            mdd["USESAME_INFO"] = mdd["MODULE_RADIO_BUTTON"] == "true" ? "1" : "0";
          }
        }
      })
    }
  },
  /*
  *@method openBizManagerInfoNodeValidate
  *@desc 钩子函数 下一步验证
  *@MethodAuthor  linsc
  *@Date: 2019-06-11 15:19:09
  */
  openBizManagerInfoNodeValidate: function (_this) {
    if (_this.groupId == "MANAGER_INFO" && _this.groupDatas["MANAGER_INFO"]["PRO_MANAGER_IMPORT_INFO"] && _this.oppBusiData.USER_TYPE != '2') {
      // 境内机构客户，国税与地税信息两类中必填其中一类(但银河的产品户不需要，暂时先略过产品户)
      let idTypeVal = _this.groupDatas["MANAGER_INFO"]["PRO_MANAGER_INFO"][0]["FIELDS"]["PRO_MANAGER_ID_TYPE"].DEFAULT_VALUE,
        importfs = _this.groupDatas["MANAGER_INFO"]["PRO_MANAGER_IMPORT_INFO"][0]["FIELDS"];
      if (idTypeVal != "14") {
        if (!((importfs["BUSINESS_TAX_NO"].DEFAULT_VALUE !== "" && importfs["TAX_NO_EXP_DATE"].DEFAULT_VALUE !== "")
          || (importfs["LAND_TAX_NO"].DEFAULT_VALUE !== "" && importfs["LAND_TAX_NO_EXP_DATE"].DEFAULT_VALUE !== ""))) {
          _this.$blMethod.showMsgBox(_this, "境内产品管理人，国税与地税信息两类中必填其中一类")
          return false;
        }
      }
    }
    return true;
  },

  /*
  *@method openBizManagerInfoNodeGetData
  *@desc 拼接数据
  *@MethodAuthor  linsc
  *@Date: 2019-06-11 15:19:09
  */
  openBizManagerInfoNodeGetData: function (_this, params) {
  },

  /*
  *@method openBizManagerInfoNodePageActivated
  *@desc 钩子函数：页面激活
  *@MethodAuthor  linsc
  *@Date: 2019-06-11 15:19:09
  */
  openBizManagerInfoNodePageActivated: function (_this, groupId) {
    console.log("openBizManagerInfoNodePageActivated")
    if (groupId == "MANAGER_INFO") {
      if (_this.groupDatas["MANAGER_INFO"]["PRO_MANAGER_INFO"]) {
        //设置管理人基础信息模块 法人类别过滤项
        _this.groupDatas["MANAGER_INFO"]["PRO_MANAGER_INFO"][0]["FIELDS"]["LEGAL_REP_TYPE"].FIELD_DICT_FILTER = (openBizPubTools.getBusiCommParam(_this, "PRO_LEGAL_REP_TYPE") && openBizPubTools.getBusiCommParam(_this, "PRO_LEGAL_REP_TYPE").split(',')) || ['01', '03', '07', '08'];
      }

      if (_this.groupDatas["MANAGER_INFO"]["PRO_MANAGER_INFO"]) {
        _this.groupDatas["MANAGER_INFO"]["PRO_MANAGER_INFO"][0]["FIELDS"]["PRO_MANAGER_ID_TYPE"].FIELD_DICT_FILTER = _this["oppBusiData"]["VALID_ID_TYPE_FOR_ORG"]
      }
      //判断控股股东
      if (_this.groupDatas["MANAGER_INFO"]["ORG_STOCKHOLDER_INFO"]) {
        _this.groupDatas["MANAGER_INFO"]["ORG_STOCKHOLDER_INFO"][0]["FIELDS"]["CONTROLLER_ID_TYPE"].FIELD_DICT_FILTER = _this["oppBusiData"]["VALID_ID_TYPE_FOR_BOTH"]
      }
      //修改法人代表电话类型为只显示电话
      _this.groupDatas["MANAGER_INFO"]["ORG_LEGAL_REP_INFO"][0].FIELDS.LEGAL_PERSON_TEL.telPhoneType = "2";
    }
  },

  //----------------------业务函数----------------------------------/
  openBizManagerInfoNodeGetCustInfo: function (_this, groupId) {
  },

  /**
  * openBizManagerInfoNodeLoadBizData 数据解析或回填
  * @param _this
  */
  openBizManagerInfoNodeLoadBizData: async function (_this, busiData) {
    return this.openBizManagerInfoNodeParseOldBiz(_this, busiData)
  },

  /**
  * openBizManagerInfoNodeParseOldBiz 重新加载转换之后的历史数据
  * @param _this
  */
  openBizManagerInfoNodeParseOldBiz: function (_this, bdata) { // 解析身份证读卡数据
  },

  //------------------------------页面字段相关逻辑----------------------------------------//
  /**
   * 【CHECK_PRO_MANAGER_ID_TYPE】管理人证件类型：
   *  如果选了14境外 显示管理人重要信息 其他隐藏并清空 
   * 如果选了其他则显示正常
   */
  "CHECK_PRO_MANAGER_ID_TYPE": (_this, field, fieldData) => {
    let proManImportInfo = _this.groupDatas["MANAGER_INFO"]["PRO_MANAGER_IMPORT_INFO"][0]
    if (field.DEFAULT_VALUE == "14") {
      proManImportInfo.MODULE_CONTROL = "0";
      for (let fk in proManImportInfo.FIELDS) {
        proManImportInfo["FIELDS"][fk].FIELD_CONTROL = "0";
        proManImportInfo["FIELDS"][fk].DEFAULT_VALUE = "";
      }
    } else {
      proManImportInfo.MODULE_CONTROL = "1";
      for (let fk in proManImportInfo.FIELDS) {
        proManImportInfo.FIELDS[fk].FIELD_CONTROL = '0';
      }
    }
    openBizPubTools.filterIdCode(_this, field, fieldData["PRO_MANAGER_ID_CODE"], fieldData)
    //选择证件类型为10-工商营业执照之后后管理人重要信息模块的信息
    let importInfos = _this.groupDatas["MANAGER_INFO"]["PRO_MANAGER_IMPORT_INFO"][0]["FIELDS"];
    for (let fk in importInfos) {
      importInfos[fk].DEFAULT_VALUE = "";
      importInfos[fk].FIELD_CONTROL = '0';
    }
  },
  /**
   * 【CHECK_PRO_MANAGER_ID_CODE】管理人号码
   */
  "CHECK_PRO_MANAGER_ID_CODE": (_this, field, fieldData) => {
    if (_this.userType == "2") {
      /**
       *   若选择工商营业执照/事业法人/社团法人/机关法人。
       若录入18账号，自动填充组织机构代码、国税登记证。
        若为15位账户，组织机构代码、税务登记证由其分别选择手动录入，不自动填充。
        必填项，若基本信息中证件类型为组织机构代码证1A则系统自动变更，不可编辑
        根据统一社会信用代码编码规则， 18 位
        社会信用代码由登记管理部门代码（第 1 位）、机构类别代码（第 2位）、登记管理机关行政区划码（第 3—8 位）、
        主体标识码（组织机构代码）（第 9—17 位）、校验码（第 18 位）五部分组成。
        税务登记证号码与统一社会信用的代码证一致
        * @param idTypeVal
        * @param idCodeVal
        */

      if (fieldData["PRO_MANAGER_ID_TYPE"].DEFAULT_VALUE == "10" && field.DEFAULT_VALUE.length != 18) {
        _this.showMsgBox(_this, "有效证明文件为“工商营业执照”时 ,证件号码只允许18位!")
        _this.$blMethod.changeFieldError(_this, false, "有效证明文件为“工商营业执照”时 ,证件号码只允许18位!")
        return;
      }
      let idTypeVal = fieldData["PRO_MANAGER_ID_TYPE"].DEFAULT_VALUE,
        idCodeVal = field.DEFAULT_VALUE,
        importfs = _this.groupDatas["MANAGER_INFO"]["PRO_MANAGER_IMPORT_INFO"][0]["FIELDS"];
      //自动填充管理人信息模块
      let orgIdField, orgExpdateField;
      orgIdField = importfs["PRO_MANAGER_ASSI_CODE"]
      orgExpdateField = importfs["PRO_MANAGER_ASSI_EXP"]
      if (_.indexOf(["10"], fieldData["PRO_MANAGER_ID_TYPE"].DEFAULT_VALUE) !== -1 && idCodeVal.length === 18) {
        //主体标识码（组织机构代码）（第 9—17 位）
        orgIdField.DEFAULT_VALUE = idCodeVal.substring(8, 16) + "-" + idCodeVal.substring(16, 17);
        orgIdField.FIELD_CONTROL = "2";
        orgExpdateField.FIELD_CONTROL = "2";
        orgExpdateField.DEFAULT_VALUE = fieldData["PRO_MANAGER_ID_EXP_DATE"].DEFAULT_VALUE;

        importfs["BUSINESS_TAX_NO"].DEFAULT_VALUE = idCodeVal.substring(2, 17);
        importfs["BUSINESS_TAX_NO"].FIELD_CONTROL = "2";
        importfs["TAX_NO_EXP_DATE"].FIELD_CONTROL = "2";
        importfs["TAX_NO_EXP_DATE"].DEFAULT_VALUE = fieldData["PRO_MANAGER_ID_EXP_DATE"].DEFAULT_VALUE;

        importfs["LAND_TAX_NO"].DEFAULT_VALUE = idCodeVal.substring(2, 17);
        importfs["LAND_TAX_NO"].FIELD_CONTROL = "2";
        importfs["LAND_TAX_NO_EXP_DATE"].FIELD_CONTROL = "2";
        importfs["LAND_TAX_NO_EXP_DATE"].DEFAULT_VALUE = fieldData["PRO_MANAGER_ID_EXP_DATE"].DEFAULT_VALUE;
      }
    }
  },
  /**
  * 【CHECK_PRO_MANAGER_ID_EXP_DATE】管理人证件有效期：
  */
  CHECK_PRO_MANAGER_ID_EXP_DATE: (_this, field, fieldData) => {
    if (_this.userType == "2") {
      let idTypeVal = fieldData["PRO_MANAGER_ID_TYPE"].DEFAULT_VALUE,
        idCodeVal = fieldData["PRO_MANAGER_ID_CODE"].DEFAULT_VALUE,
        idExpDate = field.DEFAULT_VALUE,
        importfs = _this.groupDatas["MANAGER_INFO"]["PRO_MANAGER_IMPORT_INFO"][0]["FIELDS"];
      let orgExpdateField;
      orgExpdateField = importfs["PRO_MANAGER_ASSI_EXP"]
      if (_.indexOf(["10"], idTypeVal) !== -1) {
        orgExpdateField.DEFAULT_VALUE = idExpDate;
        importfs["TAX_NO_EXP_DATE"].DEFAULT_VALUE = idExpDate;
        importfs["LAND_TAX_NO_EXP_DATE"].DEFAULT_VALUE = idExpDate;
      }
    }
  },
  /**
 * 【CHECK_SZORG_TYPE】机构类别：
 *  1.机构
 *  a)为私募基金管理人，显示“私募基金管理人编码”字段，否则隐藏
 *  b)为私募基金管理人，显示《合伙人信息》且为非必填
 * 2.产品
 *   若管理人属性选择“25a”或“25b”或“25”时，私募基金管理人编码字段为必填，其他的不显示
 *   当管理人属性选择“21,22,23,24,25a”时，“合伙人信息”一栏展示，管理人属性选择其他选项时，该栏不展示
 */
  "CHECK_SZORG_TYPE": (_this, field, fieldData) => {
    if (_this.userType == '2') {
      // 若管理人属性选择“25a”或“25b”或“25”时，为必填，其他的不显示
      let PRO_SZORG_TYPE_FOR_SMFUND_MANAGER_ID = openBizPubTools.getBusiCommParam(_this, "PRO_SZORG_TYPE_FOR_SMFUND_MANAGER_ID") || "25,25a,25b";
      var fk = fieldData["SMFUND_MANAGER_ID"];
      if (_.indexOf(PRO_SZORG_TYPE_FOR_SMFUND_MANAGER_ID.split(","), field.DEFAULT_VALUE) != -1) {
        fk.FIELD_CONTROL = "0";
      } else {
        fk.DEFAULT_VALUE = '';
        fk.FIELD_CONTROL = "1";
      }
      // 当管理人属性选择“21,22,23,24,25a”时，“合伙人信息”一栏展示，管理人属性选择其他选项时，不展示合伙人
      let arr = openBizPubTools.getBusiCommParam(_this, "PRO_SZORG_TYPE_FOR_PARTNER") || "21,22,23,24,25a";
      arr = arr.split(",");
      let flag = _.indexOf(arr, field.DEFAULT_VALUE) != -1,
        hasShowPartnerView = _this.groupDatas["MANAGER_INFO"]["ORG_PARTNER_INFO"][0].MODULE_CONTROL == "1" ? true : false;
      if (flag && !hasShowPartnerView) {
        //显示合伙人信息
        _this.groupDatas["MANAGER_INFO"]["ORG_PARTNER_INFO"][0].MODULE_CONTROL = "1";
      } else {
        let changeFileds = function () {
          // 变更，则需要删除 合伙人模块
          _this.groupDatas["MANAGER_INFO"]["ORG_PARTNER_INFO"][0].MODULE_CONTROL = "0";
          for (let fk in _this.groupDatas["MANAGER_INFO"]["ORG_PARTNER_INFO"][0].FIELDS) {
            _this.groupDatas["MANAGER_INFO"]["ORG_PARTNER_INFO"][0]["FIELDS"][fk].DEFAULT_VALUE = "";
          }
        }
        let canceledAction = function () {
          //一柜通逻辑，取消变更的话，需要恢复旧值 
          //移动端做不到，直接清掉值
          field.DEFAULT_VALUE = "";
        }
        if (_this.groupDatas["MANAGER_INFO"]["ORG_PARTNER_INFO"][0].MODULE_CONTROL == "1") {
          //如果控制人涉税已经显示了
          _this.$blMethod.showMsgBox(_this, "管理人属性变更为“" + "”将清空界面已录入的合伙人信息，确定变更？", "确定", "取消", changeFileds, canceledAction)
        }
      }
    }
  },
  /**
  * 【CHECK_LEGAL_REP_TYPE】法人类别：
  * 
  */
  "CHECK_LEGAL_REP_TYPE": (_this, field, fieldData) => {
    if (_this.userType == "2") {
      /**
       * 根据管理人法人类型自动匹配模块title与证件过滤
       * 1）若为“08-合伙企业”，为执行事务合伙人负责人，其他为法定代表人
       * 2）法定代表人证件类型控制为个人有效证件；
       * 3）执行事务合伙人证件类型可以为个人有效也可以为机构
       */
      let fieldsetTitle = "法定代表人信息";
      let idTypeArr = _this["oppBusiData"]["VALID_ID_TYPE_FOR_PERSON"];
      if (field.DEFAULT_VALUE == "08") {
        fieldsetTitle = "执行事务合伙人负责人信息";
        //执行事务合伙人证件类型可以为个人也可以为机构
        idTypeArr = _this["oppBusiData"]["VALID_ID_TYPE_FOR_BOTH"]
      }
      if(!_.isEmpty(_this.moduleDatas["ORG_LEGAL_REP_INFO"])) {

        _this.moduleDatas["ORG_LEGAL_REP_INFO"][0].FIELDS["LEGAL_REP_ID_TYPE"].FIELD_DICT_FILTER = idTypeArr;
        //修改法定代表人模块名称 
        _this.moduleDatas["ORG_LEGAL_REP_INFO"][0].MODULE_TITLE = fieldsetTitle;
        //修改控股股东信息 与xx保持一致
        let text = "与" + fieldsetTitle + "一致";
        _this.moduleDatas["ORG_STOCKHOLDER_INFO"].forEach((v) => {
          v["FIELDS"]["MODULE_RADIO_BUTTON"].FIELD_TITLE = text;
        });
        let LEGAL_REP_FIELDSET_TITLE = text || "法定代表人信息";
        if (_this.groupDatas.RELA_INFO.ORG_ASSIGN_PERSON_INFO[0].FIELDS.USESAME_INFO) {
          _this.groupDatas.RELA_INFO.ORG_ASSIGN_PERSON_INFO[0].FIELDS.USESAME_INFO.FIELD_DICT_NAME = [{
            DICT_ITEM: "1",
            DICT_ITEM_NAME: "代理人"
          }, {
            DICT_ITEM: "0",
            DICT_ITEM_NAME: "与" + fieldsetTitle + "一致"
          }];
        }
      }

    }
  },

  /**  
 * 1.【CHECK_PID_CODE】机构开户 合伙人证件号码 
 * 新模块的证件类型跟证件号码不能与已有的重复
 */
  CHECK_PID_CODE: (_this, field, fieldData) => {
    if (field.MODULE_ID == "ORG_PARTNER_INFO") {
      let gk = "MANAGER_INFO"
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
   * 【CHECK_LEGAL_REP】法定代表人名称
   */
  "CHECK_LEGAL_REP": (_this, field, fieldData) => {
    let stockholder = _this.groupDatas["MANAGER_INFO"]["ORG_STOCKHOLDER_INFO"] && _this.groupDatas["MANAGER_INFO"]["ORG_STOCKHOLDER_INFO"][0]["FIELDS"];
    if (stockholder["MODULE_RADIO_BUTTON"].DEFAULT_VALUE === "true") {
      stockholder["CONTROLLER"].DEFAULT_VALUE = field.DEFAULT_VALUE;
    }
    //同步到控股股东模块
    openBizPubTools.syncOrgLegalRepInfo(_this)
  },

  /**
   * 【CHECK_LEGAL_REP_ID_CODE】法定代表人证件号码
   */
  "CHECK_LEGAL_REP_ID_CODE": (_this, field, fieldData) => {
    let stockholder = _this.groupDatas["MANAGER_INFO"]["ORG_STOCKHOLDER_INFO"] && _this.groupDatas["MANAGER_INFO"]["ORG_STOCKHOLDER_INFO"][0]["FIELDS"];
    if (stockholder["MODULE_RADIO_BUTTON"].DEFAULT_VALUE === "true") {
      stockholder["CONTROLLER_ID_CODE"].DEFAULT_VALUE = field.DEFAULT_VALUE;
    }
    //同步到控股股东模块
    openBizPubTools.syncOrgLegalRepInfo(_this)
  },

  /**
   * 【CHECK_LEGAL_REP_ID_EXP_DATE】法定代表人证件有效期
   */
  "CHECK_LEGAL_REP_ID_EXP_DATE": (_this, field, fieldData) => {
    let stockholder = _this.groupDatas["MANAGER_INFO"]["ORG_STOCKHOLDER_INFO"] && _this.groupDatas["MANAGER_INFO"]["ORG_STOCKHOLDER_INFO"][0]["FIELDS"];
    if (stockholder["MODULE_RADIO_BUTTON"].DEFAULT_VALUE === "true") {
      stockholder["CONTROLLER_ID_EXP_DATE"].DEFAULT_VALUE = field.DEFAULT_VALUE;
    }
    //同步到控股股东模块
    openBizPubTools.syncOrgLegalRepInfo(_this)
  },

  /**
   * 【CHECK_LEGAL_REP_ID_TYPE】法定代表人证件类型
   */
  "CHECK_LEGAL_REP_ID_TYPE": (_this, field, fieldData) => {
    if (field.FIELD_DICT == "ID_TYPE") {
      openBizPubTools.filterIdCode(_this, field, fieldData["LEGAL_REP_ID_CODE"], fieldData)
    }
    let stockholder = _this.groupDatas["MANAGER_INFO"]["ORG_STOCKHOLDER_INFO"] && _this.groupDatas["MANAGER_INFO"]["ORG_STOCKHOLDER_INFO"][0]["FIELDS"];
    if (stockholder["MODULE_RADIO_BUTTON"].DEFAULT_VALUE === "true") {
      stockholder["CONTROLLER_ID_TYPE"].DEFAULT_VALUE = field.DEFAULT_VALUE;
    }
    //同步到控股股东模块
    openBizPubTools.syncOrgLegalRepInfo(_this)
  },
    /**
   * 【CHECK_CONTROLLER_ID_CODE】控股股东证件类型
   */
  "CHECK_CONTROLLER_ID_TYPE": (_this, field, fieldData) => {
    if (field.FIELD_DICT == "ID_TYPE") {
      openBizPubTools.filterIdCode(_this, field, fieldData["CONTROLLER_ID_CODE"], fieldData)
    }
    if ("MODULE_RADIO_BUTTON" in fieldData && fieldData["MODULE_RADIO_BUTTON"].DEFAULT_VALUE == "") {
      fieldData["CONTROLLER_ID_CODE"].DEFAULT_VALUE = "";
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