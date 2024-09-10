/* 
*   机构开户-机构基本信息模块
*   方法封装
*   @author  linsc
*/

import oppService from '../../../../../service/opp-service.js'
import date from '../../../../../tools/date.js'
import custService from '../../../../../service/cust-service'
import * as utils from "../../../../../tools/util"
import fieldConfig from '../../../../../config/fieldConfig'

/**
 * 获取业务公共参数值
 * @param {commparamName} comparaName  业务公共参数名称
 */
export const getBusiCommParam = function (_this, commparaName) {
  return _this.oppBusiData["busiCommonParams"][commparaName];
}

/**
 * 重新设置与xx保持一致标题
 * @param taxInfoArr
 * @returns {Array}
*/
export const resetUseSameInfoTitle = function (_this, moduleDatas, text) {
  if (!moduleDatas.ORG_ASSIGN_PERSON_INFO[0].FIELDS.USESAME_INFO) {
    return;
  }
  let LEGAL_REP_FIELDSET_TITLE = text || "法定代表人信息";
  moduleDatas.ORG_ASSIGN_PERSON_INFO[0].FIELDS.USESAME_INFO.FIELD_DICT_NAME = [{
    DICT_ITEM: "1",
    DICT_ITEM_NAME: "代理人"
  }, {
    DICT_ITEM: "0",
    DICT_ITEM_NAME: "与" + LEGAL_REP_FIELDSET_TITLE + "一致"
  }];
  //改控股股东
  moduleDatas.ORG_STOCKHOLDER_INFO[0].FIELDS.MODULE_RADIO_BUTTON.FIELD_TITLE = "与" + LEGAL_REP_FIELDSET_TITLE + "一致";
  //改实际控制人 与xx保持一致按钮标题
  moduleDatas.ORG_CONTROLER_INFO[0].FIELDS.MODULE_RADIO_BUTTON.FIELD_TITLE = "与" + LEGAL_REP_FIELDSET_TITLE + "一致";
};
/**
 * 将字符串按冒号分隔，返回一个数组
 * @param val
 * @param len 返回数组的长度
 * @returns {Array}
 */
export const splitForColon = function (val, len) {
  var arr = [];
  if (_.isEmpty(val)) {
    return arr;
  }
  var a = val.split(":");
  len = Math.max(len || 0, a.length);
  for (var i = 0; i < len; i++) {
    arr.push("");
  }
  arr.splice.apply(arr, [0, a.length].concat(a));
  return arr;
}
/*
*@method clearGroupDatas
*@desc 更换证件号码后 清空所有已填字段值
*@MethodAuthor  linsc
*@Date: 2019-06-11 15:19:09
*/
/**
 * 更换证件号码后 清空所有已填字段值
 * @param taxInfoArr
 * @returns {Array}
*/
export const clearGroupDatas = function (_this) {
  if (_.isEmpty(_this.historyData)) {
    //如果历史流水为空的话，不需要清除
    return;
  }
  for (let gd in _this.groupDatas) {
    for (let md in _this.groupDatas[gd]) {
      for (let i = 0; i < _this.groupDatas[gd][md].length; i++) {
        let fields = _this.groupDatas[gd][md][i].FIELDS;
        for (let fk in fields) {
          if (fields[fk].FIELD_CONTROL == "2") {
            //如果字段禁止编辑不清理
          } else if (_this.userType == 0 && gd == "CUST_INFO" && md == "CUST_BASIC_INFO" && (fk == "ID_CODE" || fk == "ID_TYPE")) {
            //基础信息 证件号码不清空
          } else if ((_this.userType == 1 || _this.userType == 2) && gd == "ORG_INFO" && md == "ORG_BASIC_INFO" && (fk == "ID_CODE" || fk == "ID_TYPE")) {
            //基础信息 证件号码不清空
          } else {
            fields[fk].DEFAULT_VALUE = "";
          }
          if (fk == "ID_ADDR") {
            fields[fk].DEFAULT_VALUE = "不详不详不详";
          }
        }
      }
    }
  }
}
/**
 *设置私募基金管理人编码dom
 * @param flag
 * @returns {Array}
*/
export const isShowPrivateFundManager = function (fieldData, flag) {
  if (!flag) {
    fieldData.SMFUND_MANAGER_ID.DEFAULT_VALUE = "";
    fieldData.SMFUND_MANAGER_ID.FIELD_CONTROL = "1";
  } else {
    fieldData.SMFUND_MANAGER_ID.FIELD_CONTROL = "0";
  }
};
/**
 * 有效证件类型查询，从开户信息逻辑配置的证件类型获取
 * */
export const getValidIdTypeData = (_this) => {
  if (_this.$syscfg.isQSJG(_this.$definecfg.QSJGDM_CONST.ZHONGTAI)) {
    //中泰YG003409是查询系统时间的。直接写死证件类型
    // 根据公参配置的可用类型 构造数据
    let AVAILABLE_ID_TYPE = _this.oppBusiData.busiCommonParams.AVAILABLE_ID_TYPE
    let allIdType = []
    //0 开头的是个人 1开头的是机构
    AVAILABLE_ID_TYPE.split(",").forEach(item=>{
      if(item.charAt(0) == "0"){
        allIdType.push({ "USER_TYPE": "0", "ID_TYPE": item  })
      }else{
        allIdType.push({ "USER_TYPE": "1", "ID_TYPE": item  })
      }
    })
   return { Data: allIdType, Code: "0" }
  }
  return _this.$syscfg.K_Request("YG003409", {});
};
/**
 * 查询证券账户开户初始化数据
 */
export const getAcctOpenInitData = (_this) => {
  return _this.$syscfg.K_Request("W0000075", {
    BUSI_CODE: _this.busiCode,
    USER_TYPE: _this.userType
  });
};
/**
 * 查询证券账户开户机构
 */
export const getOrgList = (_this) => {
  return _this.$syscfg.K_Request("Y1000200", {
    ORG_TYPE: "0"
  });
};

// 新开户生成新客户代码
export const getNewCustCode = (_this) => {
  let userInfo = _this.$storage.getJsonSession(_this.$definecfg.USER_INFO);
  return _this.$syscfg.K_Request("Y1100001", {
    INT_ORG: userInfo.ORG_CODE,
    USER_ROLE: "1" // 传1生成客户代码
  });
};
//对模块下所有字段进行检查，只要有一个有值，所有字段变为必填，否则为非必填
export const changeModuleAllFieldsRequired = (_this, targetModuleArr) => {
  for (let i = 0; i < targetModuleArr.length; i++) {
    //1.检查是否有某个字段已输入
    let hasInput = false;
    for (let fk in targetModuleArr[i].FIELDS) {
      if (targetModuleArr[i].FIELDS[fk].DEFAULT_VALUE != "") {
        hasInput = true;
        break;
      }
    }
    //如果已填一个字段，就全部必填，如果全部为空则非必填
    for (let i = 0; i < targetModuleArr.length; i++) {
      for (let fk in targetModuleArr[i].FIELDS) {
        targetModuleArr[i].FIELDS[fk].FIELD_REQUIRED = hasInput ? "1" : "0"
      }
    }
  }
};
/**
 * 设置境外机构不显示组织机构代码证、国税登记证和地税登记证信息dom
 *  @param value 0境内 1境外
 * @param flag
 * @param idCode
 */
export const isShowOrgImportantDom = function (_this, value, idType, idCode) {
  // 设置境外机构不显示组织机构代码证、国税登记证和地税登记证信息
  //tmpArr1 组织机构代码跟有效期 国税号码跟有效期 
  var tmpArr1 = ["ORG_ID_CODE", "ORG_ID_EXP_DATE", "BUSINESS_TAX_NO", "TAX_NO_EXP_DATE","LAND_TAX_NO", "LAND_TAX_NO_EXP_DATE"]
  let importInfos = _this.groupDatas["ORG_INFO"]["ORG_IMPORT_INFO"][0].FIELDS;
  if (value == "0") {
    //境内 手机号码必填
    _this.groupDatas.ORG_INFO.ORG_LINK_INFO[0].FIELDS.MOBILE_TEL.FIELD_REQUIRED = "1"
    tmpArr1.forEach((v) => {
      importInfos[v].FIELD_CONTROL = "0";
    })
  } else {
    //境外 手机号码非必填
    // _this.groupDatas.ORG_INFO.ORG_LINK_INFO[0].FIELDS.MOBILE_TEL.FIELD_REQUIRED = "0"
    //组织机构代码  国税登记证 地税登记证   隐藏
    tmpArr1.forEach((v) => {
      //组织机构代码  国税登记证 地税登记证 号码跟有效期都隐藏
      importInfos[v].DEFAULT_VALUE = "";
      importInfos[v].FIELD_CONTROL = "1";
    })
  }
};
/**
 * 同步产品户实际控制人信息到实际操作人模块和受益人模块
 * @param loadWhichDataArr
 */
export const syncControlerInfo = (_this) => {
  if (_this.userType != '2') {
    return;
  }
  //同步产品户实际控制人信息到实际操作人模块
  let module1 = _this.groupDatas["ORG_INFO"]["ORG_CONTROLER_INFO"];
  let module2 = _this.groupDatas["ORG_INFO"]["ORG_ACTUAL_CONTROLER_INFO"];
  syncModule1Tomodule2(_this, module1, module2, "CONTROLER", "CONTROLER");
  //同步产品户实际控制人信息到"产品受益人信息"
  module2 = _this.groupDatas["ORG_INFO"]["ORG_BENEFICIARY_INFO"];
  syncModule1Tomodule2(_this, module1, module2, "CONTROLER", "BENEFICIARY", [], [["CONTROLER_ID_NO", "BENEFICIARY_ID"], ["CONTROLER_ID_EXP_DATE", "BENEFICIARY_EXP_DATE"]]);
}
/**
* 同步到控股股东模块
* @param _this
*/
export const syncOrgLegalRepInfo = (_this) => {
  // if(_this.userType != '2'){
  //   return;
  // }
  // let groupId = _this.userType == "1" ? "RELA_INFO" : "MANAGER_INFO";
  let groupId =  "RELA_INFO";
  let orgLegalRepArr = _this.groupDatas[groupId] && _this.groupDatas[groupId]["ORG_LEGAL_REP_INFO"];
  //产品户 同步法定代表人信息模块 到 控股股东模块
  let orgStockArr = _this.groupDatas[groupId]&&_this.groupDatas[groupId]["ORG_STOCKHOLDER_INFO"];
  if (orgLegalRepArr && orgStockArr && orgStockArr[0]["FIELDS"]["MODULE_RADIO_BUTTON"] && orgStockArr[0]["FIELDS"]["MODULE_RADIO_BUTTON"].DEFAULT_VALUE == "true") {
    //勾选了一致才能同步
    for (let i = 0; i < orgLegalRepArr.length; i++) {
      let fieldDatas = orgLegalRepArr[i]["FIELDS"];
      if (orgStockArr.length <= i) {
        //先添加一个分组
        let moduleInit = _.cloneDeep(_this.groupDatasTpl[groupId]["ORG_STOCKHOLDER_INFO"][0]);
        for (let fk in moduleInit.FIELDS) {
          //先更新过滤项在增加模块
          moduleInit.FIELDS[fk].FIELD_DICT_FILTER = _this.moduleDatas["ORG_STOCKHOLDER_INFO"][0].FIELDS[fk].FIELD_DICT_FILTER
        }
        moduleInit["MODULE_DELETE"] = "1";
        moduleInit["MODULE_ADD"] = "1";
        //强制显示新增的分组
        moduleInit["MODULE_CONTROL"] = "1";
        moduleInit["MODULE_SEQ"] = parseInt(orgStockArr[i - 1]["MODULE_SEQ"]) + 1 + "";
        //隐藏与XX一致单选框
        if (moduleInit.FIELDS.MODULE_RADIO_BUTTON != undefined) {
          moduleInit.FIELDS.MODULE_RADIO_BUTTON.FIELD_CONTROL = "1";
        }
        //清空添加的新结构
        orgStockArr.push(moduleInit);
      }
      //同步字段值
      let fieldDatas1 = orgLegalRepArr[i]["FIELDS"];
      let fieldDatas2 = orgStockArr[i]["FIELDS"];
      fieldDatas2["CONTROLLER"].DEFAULT_VALUE = fieldDatas1["LEGAL_REP"].DEFAULT_VALUE;
      fieldDatas2["CONTROLLER_ID_TYPE"].DEFAULT_VALUE = fieldDatas1["LEGAL_REP_ID_TYPE"].DEFAULT_VALUE;
      fieldDatas2["CONTROLLER_ID_CODE"].DEFAULT_VALUE = fieldDatas1["LEGAL_REP_ID_CODE"].DEFAULT_VALUE;
      fieldDatas2["CONTROLLER_ID_EXP_DATE"].DEFAULT_VALUE = fieldDatas1["LEGAL_REP_ID_EXP_DATE"].DEFAULT_VALUE;

      //不可编辑
      fieldDatas2["CONTROLLER"].FIELD_CONTROL = "2";
      fieldDatas2["CONTROLLER_ID_TYPE"].FIELD_CONTROL = "2";
      fieldDatas2["CONTROLLER_ID_CODE"].FIELD_CONTROL = "2";
      fieldDatas2["CONTROLLER_ID_EXP_DATE"].FIELD_CONTROL = "2";
    }
  }
}
/**
   * 字段关联过滤方法
   * @param _this
   * @param field
   * @param fieldData
   */
export const fieldFilter = (_this, field, fieldData) => {
  let userType = _this.userType;
  let busiCode = _this.busiCode;
  if (fieldConfig[busiCode] && userType in fieldConfig[busiCode]) {
    // 获取对应(业务代码+客户类别)的字段配置
    let dictCfg = fieldConfig[busiCode][userType]
    for (let fieldKey in dictCfg) {
      // 判断是否存在当前字段的配置 , 例如“ID_TYPE”
      if (fieldKey == field.FIELD_ID) {
        for (let key in dictCfg[fieldKey]) {
          let cdtItem = dictCfg[fieldKey][key];
          _(cdtItem.FILTER).forEach(function (item) {
            let ifStr = true;
            if (item.CONDITION.constructor == String) {
              let exstr = item.CONDITION.replace("[key]", field.DEFAULT_VALUE);
              if (!(eval(exstr))) {
                ifStr = false;
              }
            } else if (item.CONDITION.constructor == Object) {
              for (let conditionKey in item.CONDITION) {
                if (_.indexOf(item.CONDITION[conditionKey], fieldData[conditionKey].DEFAULT_VALUE) < 0) {
                  ifStr = false;
                }
              }
            } else if (item.CONDITION.constructor == Array) {
              if (_.indexOf(item.CONDITION, field.DEFAULT_VALUE) < 0) {
                ifStr = false;
              }
            } else {
              ifStr = false;
            }

            if (ifStr && cdtItem.FIELD in fieldData) {
              let fs = fieldData[cdtItem.FIELD];
              // promiseFn().then(function () {
              if ("VALUE" in item) {
                fs.FIELD_DICT_FILTER = item.VALUE;
              }
              // }).then(function () {
              if ("DISABLED" in item) {
                if (fs.FIELD_CONTROL != "3") {
                  fs.FIELD_CONTROL = item.DISABLED;
                }
              }
              if ("REQUIRED" in item) {
                fs.FIELD_REQUIRED = item.REQUIRED;
              }
              if ("DEFAULT" in item) {
                if (item.DEFAULT === "") {
                  fs.DEFAULT_VALUE = "";
                } else if (_.indexOf(fs.FIELD_DICT_FILTER, item.DEFAULT) > -1) {
                  fs.DEFAULT_VALUE = item.DEFAULT;
                }
              }
              // });
            }
          });
        }
      }
    }
  }
};
/**
 * 中登实名制主体检查：根据客户三要素，校验实名制受限主体
  */
export const getCsdcValidateInfo =  function (_this, params) {
  var that = this;
  var custFname = params.CUST_FNAME,
      idTypeVal = params.ID_TYPE,
      idCodeVal = params.ID_CODE;

  if (custFname && idTypeVal && idCodeVal) {
    _this.$syscfg.K_Request("W0000119",{
      bex_codes: "YGT_X2100004",
      ID_TYPE: idTypeVal,
      ID_CODE: idCodeVal,
      USER_NAME: custFname,
      LIMIT_METHOD: "1"
    }).then(function (res) {
      if(res.Code == "0" && res.Data[0]){
        res.Data[0].IS_LIMIT_USER == "1" && (_this.$blMethod.showMsgBox(_this, "该名投资者为中国结算推送涉案账户主体，请进一步确认是否允许其办理此业务!" + res.Msg))
      }else{
        _this.$blMethod.showMsgBox(_this, "中登实名制主体检查失败：" + res.Msg)
      }
    })
  };
}
/**
 * 判断是否属于重点监控账户，且未签协议
 */
export const isKeyAcctMonitor =  function (_this, custObj) {
  return custService.getKeyMonitorListByCustInfo(custObj).then(function(res) {
    if(res.Code !== "0"){
      throw "重点监控账户检查失败" + res.Msg
    }
    let KeyCustData = res.Data;
    if(KeyCustData && KeyCustData[0]
        && KeyCustData[0].MONITOR_STATUS == '1' && KeyCustData[0].LIMIT_DATE_END >= date.getClientDate("yyyyMMdd")){
        //如果是重点监控对象 检查是否已签协议
        return custService.getAddSignAgreements(custObj).then(function(res2){
          if(res2.Code !== "0"){
            throw "重点监控账户检查失败" + res2.Msg
          }
          let custAgree = res2.Data;
          if(custAgree && custAgree[0] && custAgree[0].EXP_DATE >= date.getClientDate("yyyyMMdd")){
            return false
          }
          return true;
        })
    }else {
      return false;
    }
  });
}
// 用于开户业务，根据证件号的证件类型查询客户已经提交的预录入数据
export const checkBlackListAndRepeat = (_this, idCode, idType, custName, cityzenShip) => {
  //进行黑名单校验前，必须保证三要素已填好
  if (!idType || !custName) {
    field.DEFAULT_VALUE = "";
    let err = "";
    if (fieldData.ID_TYPE.DEFAULT_VALUE === "") {
      err = "证件类型不能为空";
    } else if (fieldData.CUST_FNAME.DEFAULT_VALUE === "") {
      err = "客户全称不能为空";
    }
    _this.$blMethod.showMsgBox(_this, err)
    idCode = "";
    return;
  }
  //客户开户机构默认用柜员所属机构
  let userOrgCode = _this.$storage.getJsonSession(_this.$definecfg.USER_INFO) && _this.$storage.getJsonSession(_this.$definecfg.USER_INFO).ORG_CODE;
  _this.loading = true;
  let custObj = {
    USER_NAME: custName,
    CUST_NAME: custName,
    ID_TYPE: idType,
    ID_CODE: idCode,
    CITIZENSHIP: cityzenShip,
    F_CUST_ORG_CODE: userOrgCode
  }
  _this.userType == "0" && (custObj.EUSER_TYPE = "3")//经纪业务开户黑名单
  //检查客户黑名单
  let that = this;
  that.isInBlackList(custObj).then(function (isAllflag) {
    if (isAllflag) {
      _this.loading = true;
      _this.getCustInfoInThisCompany({ // 判断是否重复开户
        "ID_TYPE": idType,
        "ID_CODE": idCod,
      }).then((data) => {
        console.log("------是否重复开户---2--------", data);
        //todo 通过拓展属性判断存在OTC不允许开基金账户
        if (data.Code == "0" && data.Data && data.Data.length) {
          // 过滤掉销户状态的记录
          data.Data = _.filter(data.Data || [], function (v) { return v.USER_STATUS != "9"; });
          var isHasOpen = false, isCurrentOrg = false;
          _.find(data.Data, function (obj) {
            if (obj.ID_TYPE === idType && obj.ID_CODE === idCod) {
              isHasOpen = true;
              if (obj.INT_ORG === userOrgCode) {
                isCurrentOrg = true;
                return true;
              }
            }
          });
          if (getBusiCommParam(_this, "FORBIT_REPEAT_OPEN") == "1") {
            let notAllowInfo = isHasOpen && isCurrentOrg ? "客户已在本分支机构开户，不能重复开户！" : "客户已在我司别的分支机构开户，不能重复开户！";
            _this.$blMethod.showMsgBox(_this, notAllowInfo,function () {
              _this.$router.replace("/home");
              // if(_this.userType != "0"){
              //   that.setBusinessTaxNo(_this.groupDatas.ORG_INFO.ORG_IMPORT_INFO[0].FIELDS, idType, idCod)
              // }
            },null,"确认", "");
          } else if (getBusiCommParam(_this,"ALLOWED_REPEAT_OPEN_ACCOUNT") == "0") {
            let notAllowInfo = isHasOpen && isCurrentOrg ? "客户已在本分支机构开户，不能重复开户！" : "客户已在我司别的分支机构开户，不能重复开户！";
            idCod = "";
            _this.$blMethod.showMsgBox(_this, notAllowInfo,function () {
              _this.$router.replace("/home");
              if(_this.userType != "0"){
                that.setBusinessTaxNo(_this.groupDatas.ORG_INFO.ORG_IMPORT_INFO[0].FIELDS, idType, idCod)
              }
            },null,"确认", "");
          } else {
            let info = isHasOpen && isCurrentOrg ? "客户已在本分支机构开户，请确认是否继续开户！" : "客户已在我司别的分支机构开户，请确认是否继续开户！";
            _this.$blMethod.showMsgBox(_this, info,  function () {
              console.log("继续开户")
              // if(_this.userType != "0"){
              //   that.setBusinessTaxNo(_this.groupDatas.ORG_INFO.ORG_IMPORT_INFO[0].FIELDS, idType, idCod)
              // }
            }, function () {
              _this.$router.replace("/home");
            },"继续开户", "退出办理");
          }
        }
      }).catch((error) => {
        _this.oppBusiData["busiData"]["isSearchBlackListFlag"] = false;
        console.error("查询是否已开户信息失败", error);
        _this.messageType = "loadFail";
        _this.messageTypeShow = true;
      }).finally(() => {
        _this.loading = false;
      });
    }
  }).finally(() => {
    _this.loading = false;
  })
};
/**
 * 检查客户黑名单
 * @param _this
 * @param type 证件类型
 * @param code 证件号码
 */
export const isInBlackList = function (custObj) {
  return custService.isInBlackList(custObj).then(function (blackObj) {
    var obj = blackObj || {};
    //对于禁入黑名单客户，应在受理端控制不允许开户
    if (obj.CHECK_RESULT == "1") {
      _this.$blMethod.showMsgBox(_this, "该客户[" + obj.MATCH_MODE_TEXT + "]已被列入证券市场禁入者名单，不允许办理业务！")
      return false;
    } else if (obj.CHECK_RESULT == "2") {
      let confirmAction = function () { return true; }, canceledAction = function () { return false; };
      _this.$blMethod.showMsgBox(_this, "该客户已被列入证券市场禁入者名单，确定继续办理业务？", "继续", "退出", confirmAction, canceledAction)
    } else {
      return true;
    }
  })
};
/**
 * 加载历史流水数据
 * @param _this
 * @param bdata
 */
export const loadHistoryData = function (_this, bdata) {
  _this.loading = true;
  if (!bdata) {
    return;
  }
  _this.$store.commit(_this.$types.UPDATE_FORBIN_RULES, { "isForbin": true });//关闭关联逻辑的执行
  _this.historyData = Object.assign(_this.historyData, bdata);
  let gk = _this.oppBusiData.relaInfoGroupId;
  // //如果是机构开户，客户基础信息模块的注册资金为万元，需要将流水的值除以10000
  // if(_this.userType == "1" && bdata["ORG_INFO"] && bdata["ORG_INFO"]["ORG_BASIC_INFO"] && bdata["ORG_INFO"]["ORG_BASIC_INFO"][0]["REGISTER_FUND"]){
  //   let tval = bdata["ORG_INFO"]["ORG_BASIC_INFO"][0]["REGISTER_FUND"];
  //   bdata["ORG_INFO"]["ORG_BASIC_INFO"][0]["REGISTER_FUND"] = divide(tval, 10000);
  // }
  //由于涉税信息模块与控制人涉税信息模块 提交的数据结构与配置的字段结构不同，所以加载历史数据之前要先处理一下
  if (_this.userType == "0" && bdata["RELA_INFO"] && bdata["RELA_INFO"]["CUST_TAX_INFO"]
    && bdata["RELA_INFO"]["CUST_TAX_INFO"].length) {
    let custTaxInfo = bdata["RELA_INFO"]["CUST_TAX_INFO"][0];
    if (custTaxInfo) {
      bdata["RELA_INFO"]["CUST_TAX_COUNTRY_INFO"] = transTaxInfoToArr(custTaxInfo);
    }
    let taxAssetInfo = bdata["RELA_INFO"]["TAX_ASSET_INFO"][0];
    if (taxAssetInfo) {
      bdata["RELA_INFO"]["TAX_ASSET_INFO"] = transTaxAssetInfoToArr(taxAssetInfo, _this);
    }
  } else if ((_this.userType == "1" || _this.userType == "2") && bdata["RELA_INFO"] && bdata["RELA_INFO"]["ORG_TAX_INFO"]) {
    //还原机构户的客户涉税的子模块 税收居民国/地区模块信息
    let orgTaxInfo = _.cloneDeep(bdata["RELA_INFO"]["ORG_TAX_INFO"][0]);
    if (orgTaxInfo) {
      bdata["RELA_INFO"]["ORG_TAX_COUNTRY_INFO"] = transTaxInfoToArr(orgTaxInfo);
      bdata["RELA_INFO"]["TAX_ASSET_INFO"] = transTaxAssetInfoToArr(orgTaxInfo, _this);
      if (bdata["RELA_INFO"]["TAX_ASSET_INFO"].length == 0) {
        bdata["RELA_INFO"]["TAX_ASSET_INFO"].push({});
      }
      //手动还原资产信息第一个分组的 
      bdata["RELA_INFO"]["TAX_ASSET_INFO"][0]["MONAMNT"] = bdata["RELA_INFO"]["ORG_TAX_INFO"][0]["MONAMNT"]
      bdata["RELA_INFO"]["TAX_ASSET_INFO"][0]["CURR_CODE"] = bdata["RELA_INFO"]["ORG_TAX_INFO"][0]["CURR_CODE"]
    }
    //如果存在控制人涉税也要同样处理
    if (bdata["RELA_INFO"]["ORG_TAX_INFO"].length > 1) {
      //还原机构户的实际控制人涉税的子模块 税收居民国/地区模块信息
      let contrlOrgTaxCountryInfo = _.cloneDeep(bdata["RELA_INFO"]["ORG_TAX_INFO"][1]);
      bdata["RELA_INFO"]["ORG_TAX_INFO"] = [];
      bdata["RELA_INFO"]["ORG_TAX_INFO"].push(contrlOrgTaxCountryInfo);
      if (contrlOrgTaxCountryInfo) {
        let taxCountryInfo = transTaxInfoToArr(contrlOrgTaxCountryInfo);
        bdata["RELA_INFO"]["ORG_TAX_COUNTRY_INFO"] = taxCountryInfo;
      }
      //删掉多余数据
      bdata["RELA_INFO"]["ORG_TAX_INFO"].splice(1, 1);
    }
    //移动端 特别处理 
    //如果是移动平台 gk=“ARRP_INFO" 需要把涉税几个模块跟诚信记录从RELA_INFO分组移动到"APPR_INFO"里
    if (_this.$basecfg.platform != "vtm") {
      //复制适当性里的涉税信息和诚信记录到关联信息分组
      let modIds = ["ORG_TAX_INFO", "ORG_TAX_COUNTRY_INFO", "ORG_TAX_INFO", "TAX_ASSET_INFO"];
      if (bdata["RELA_INFO"]) {
        let relaInfos = bdata["RELA_INFO"];
        bdata[gk] = {}
        modIds.map(function (v) {
          if (bdata["RELA_INFO"][v]) {
            bdata[gk][v] = _.cloneDeep(bdata["RELA_INFO"][v]);
            delete bdata["RELA_INFO"][v]
          }
        });
      }
    }
  }
  //中山个性化 传生成的或者历史流水中复用的合同编码（CUST_CODE）
  if (_this.$syscfg.isQSJG(_this.$definecfg.QSJGDM_CONST.ZHONGSHAN) && "PRE_CONTRACT_SN" in bdata) {
    _this.$storage.setSession(_this.$definecfg.CONTRACTNUM, bdata["PRE_CONTRACT_SN"]);
    //更新导航栏的编号
    _this.$store.commit(_this.$types.UPDATE_CONTRACT_NUM, bdata["PRE_CONTRACT_SN"]);
  }
  //开始解析历史数据
  parseOldBiz(_this,bdata);
  //手动计算一下模块的隐藏，否则回退的时候，最后一页本来是隐藏的也可能显示出来
  //比如风险评测回退到了税收居民国
  if (_this.isBack && _this.userType == "0" && _this.groupDatas[gk] && _this.groupDatas[gk]["CUST_TAX_COUNTRY_INFO"]) {
    let fieldData = _this.groupDatas[gk]["CUST_TAX_INFO"][0].FIELDS;
    if (fieldData["TAX_RESIDENT_TYPE"]) {
      let field = fieldData["TAX_RESIDENT_TYPE"];
      //选择了1.仅为中国税收居民，显示投资人标识 税收居民身份 字段 隐藏税收居民国模块
      //选择了2.仅为非居民或者3.既为中国也是其他国家税收居民  全部显示
      if (field.DEFAULT_VALUE == "1") {
        let taxCountryInfo = _this.groupDatas[gk]["CUST_TAX_COUNTRY_INFO"];
        taxCountryInfo = taxCountryInfo.map((v) => {
          v.MODULE_CONTROL = "0";
        });
      } else {
        let taxCountryInfo = _this.groupDatas[gk]["CUST_TAX_COUNTRY_INFO"];
        taxCountryInfo = taxCountryInfo.map((v) => {
          v.MODULE_CONTROL = "1";
        });
      }
    }
  }
  setTimeout(() => {
    _this.loading = false;
    //forbinFieldRules为true时，所有字段变化自动触发关联逻辑都不会触发，runFieldRules不受影响
    _this.$store.commit(_this.$types.UPDATE_FORBIN_RULES, { "isForbin": false });
  }, 2000); // 设500ms以显示加载框
  //主动触发 加载关联逻辑，runFieldRules执行关联逻辑后能还原被清空的值
  _this.runFieldRules && _this.runFieldRules();
};
/**
* 解析历史流水数据
* @param _this
*/
export const parseOldBiz = function (_this, bdata) {
  if (!bdata || _.isEmpty(bdata)) {
    return;
  }
  console.log("parseOldBiz==========开始")
  for (let bk in bdata) {
      if (bk in _this.groupDatas) {
          let bd = bdata[bk];
          let md = _this.groupDatas[bk];
          for (let bdk in bd) {
              if (bdk in md) {
                  let mdtpl = _.cloneDeep(md[bdk][0]);
                  mdtpl["MODULE_NUM"] = ""; //先清掉module_num
                  for (let i = 0; i < bd[bdk].length; i++) {
                      let bdd = bd[bdk][i];
                      let mdd = i < md[bdk].length ? md[bdk][i] : _.cloneDeep(mdtpl);
                      for (let fk in bdd) {
                          if (fk in mdd.FIELDS && bdd[fk] !== null) {
                              // if (_this.userType == "1" && fk == "REGISTER_FUND") {
                              //     let tval = (typeof (bdd[fk]) === 'object' && Object.prototype.toString.call(bdd[fk]) !== '[object Array]') ? bdd[fk]["newVal"] : bdd[fk];
                              //     mdd["FIELDS"][fk]["DEFAULT_VALUE"] = utils.divide(tval, 10000);
                              // } else {
                                  //需要根据数据类型来赋值
                                  mdd["FIELDS"][fk]["DEFAULT_VALUE"] = (typeof (bdd[fk]) === 'object' && Object.prototype.toString.call(bdd[fk]) !== '[object Array]') ? bdd[fk]["newVal"] : bdd[fk];
                              // }
                              // 如果当前历史数据模块字段里面为null为删除模块，中断并过滤此模块
                              if (mdd["FIELDS"][fk]["DEFAULT_VALUE"] === null) {
                                  mdd = null;
                                  break;
                              }
                          } else if ("MODULE_NUM_FIELD" in mdd && fk === mdd["MODULE_NUM_FIELD"]) { // 多组数据，取出一柜通NUM字段值并赋值MODULE_NUM
                              mdd["MODULE_NUM"] = bdd[fk];
                          }
                      }

                      if (i > 0 && mdd)
                          mdd.MODULE_SEQ = parseInt(mdd["MODULE_SEQ"]) + i + "";

                      // md[bdk][i] = mdd;
                      md[bdk][i] = mdd;
                  }
                  md[bdk] = _.filter(md[bdk], (item) => { return item !== null });
              }
          }
      }
  }
  console.log("parseOldBiz==========结束")
}
/**
* tmpbool 1 清除数据并关闭弹窗 0关闭弹窗
* @param _this
*/
export const clearHistory = function (_this, isClear) {
  if (isClear === "1") {
    //没有获取到流水  如果不加此设置，如果用户先获取流水，再输入其他证件号码，取的会是上一次的流水号
    _this.$storage.removeSession(_this.$definecfg.B_SNO);
    _.forIn(_this.historyData, function (value, key) { delete _this.historyData[key]; });
    _this.$storage.removeSession(_this.$definecfg.CUSTOMER_INFO);
    console.log("没有获取到客户流水 清掉历史流水跟客户信息")
  }
  _this.loading = false;
  setTimeout(() => {
    _this.oppBusiData["busiData"]["isLoadHistoryData"] = false;
  }, 500)
}

/**
 * filterIdCode 设置证件号码校验函数
 * @param _this
 */
export const filterIdCode = function (_this, idTypefield, idCodeField, fieldData) {
  if (!idCodeField || !idTypefield) {
    return;
  }
  let idType = idTypefield.DEFAULT_VALUE;
  if (idType == "00" || idType == "08") {
    idCodeField.VALID_TYPE = "cardno[true]|" + idCodeField.VALID_TYPE; // 更新证件号码的验证类型为身份证验证
  } else if (idType == "10" && _this.$syscfg.isQSJG(_this.$definecfg.QSJGDM_CONST.ZHONGSHAN)) {
    idCodeField.VALID_TYPE = "licensecode|" + idCodeField.VALID_TYPE; // 中山个性 更新证件号码的验证类型为工商营业执照
  } else {
    idCodeField.VALID_TYPE = idCodeField.VALID_TYPE.replace('cardno[true]|', '').replace('|cardno[true]', '').replace('cardno', '').replace('licensecode|', '');
  }
  //如果 勾选与XXX信息保持一致或者经办人类型选了与**保持一致 则不清空证件号码
  if (!((fieldData.MODULE_RADIO_BUTTON && fieldData.MODULE_RADIO_BUTTON.DEFAULT_VALUE == "true") || (fieldData.USESAME_INFO && fieldData.USESAME_INFO.DEFAULT_VALUE == "0"))) {
    idCodeField.DEFAULT_VALUE = "";
  }
}
//设置模块数组 显示或者隐藏 gid分组id mid 模块id moduleContrl 0为隐藏 1位显示
export const setModulesControl = function (_this, gid, mid, moduleContrl) {
  _this.groupDatas[gid] && _this.groupDatas[gid][mid] && _this.groupDatas[gid][mid][0] && _this.groupDatas[gid][mid].forEach(md => {
    md.MODULE_CONTROL = moduleContrl;
  })
}
//转换控制人涉税信息
export const parseControlTaxInfoOldData = (_this, busiData, index) => {
  //再转换控制人涉税基本信息，涉税居住信息，控制人出生信息以及涉税居民国信息
  let pickMd2 = ["ORG_TAX_INFO", "ORG_TAX_ADDRESS_INFO", "ORG_TAX_BIRTH_INFO", "ORG_TAX_COUNTRY_INFO"];
  for (let md in _this.groupDatas.APPR_INFO) {
    if (pickMd2.indexOf(md) !== -1) {
      let pickFieldId = _.keys(_this.groupDatas.APPR_INFO[md][0].FIELDS)
      if (busiData.TAXINFO_CONTROLER_DATA && busiData.TAXINFO_CONTROLER_DATA.length) {
        let moduleData = _.cloneDeep(busiData.TAXINFO_CONTROLER_DATA[index]);
        busiData.APPR_INFO[md] = []
        //切割未取得识别号原因字段
        if (moduleData && moduleData["NO_TAXPAYERID_REASON"]) {
          var str = splitForColon(moduleData["NO_TAXPAYERID_REASON"], 2);
          moduleData["NO_TAXPAYERID_REASON"] = str.shift();
          moduleData["NO_TAXPAYERID_REASON_INPUT"] = str.shift();
        }
        if (moduleData && moduleData["NO_TAXPAYERID_REASON2"]) {
          var str = splitForColon(moduleData["NO_TAXPAYERID_REASON2"], 2);
          moduleData["NO_TAXPAYERID_REASON2"] = str.shift();
          moduleData["NO_TAXPAYERID_REASON2_INPUT"] = str.shift();
        }
        if (moduleData && moduleData["NO_TAXPAYERID_REASON3"]) {
          var str = splitForColon(moduleData["NO_TAXPAYERID_REASON3"], 2);
          moduleData["NO_TAXPAYERID_REASON3"] = str.shift();
          moduleData["NO_TAXPAYERID_REASON3_INPUT"] = str.shift();
        }
        busiData.APPR_INFO[md].push(_.pick(moduleData, pickFieldId))
      }
    }
  }
  console.log("转换后的控制人涉税历史数据",  busiData.APPR_INFO)
}
//转换居民涉税信息
export const parseTaxInfoOldData = (_this, busiData) => {
  busiData.APPR_INFO = busiData.APPR_INFO || {};
  //转换客户涉税基本信息，客户涉税居住信息，以及客户涉税居民国信息
  let pickMd = ["ORG_TAX_INFO", "ORG_TAX_ADDRESS_INFO", "ORG_TAX_COUNTRY_INFO"];
  for (let md in _this.groupDatas.APPR_INFO) {
    if (pickMd.indexOf(md) !== -1) {
        let moduleData = _.cloneDeep(busiData.TAXINFO_USER_DATA);
        busiData.APPR_INFO[md] = []
        //切割未取得识别号原因字段
        if (moduleData && moduleData["NO_TAXPAYERID_REASON"]) {
          var str = splitForColon(moduleData["NO_TAXPAYERID_REASON"], 2);
          moduleData["NO_TAXPAYERID_REASON"] = str.shift();
          moduleData["NO_TAXPAYERID_REASON_INPUT"] = str.shift();
        }
        if (moduleData && moduleData["NO_TAXPAYERID_REASON2"]) {
          var str = splitForColon(moduleData["NO_TAXPAYERID_REASON2"], 2);
          moduleData["NO_TAXPAYERID_REASON2"] = str.shift();
          moduleData["NO_TAXPAYERID_REASON2_INPUT"] = str.shift();
        }
        if (moduleData && moduleData["NO_TAXPAYERID_REASON3"]) {
          var str = splitForColon(moduleData["NO_TAXPAYERID_REASON3"], 2);
          moduleData["NO_TAXPAYERID_REASON3"] = str.shift();
          moduleData["NO_TAXPAYERID_REASON3_INPUT"] = str.shift();
        }
      let pickFieldId = _.keys(_this.groupDatas.APPR_INFO[md][0].FIELDS)
      busiData.APPR_INFO[md] = [_.pick(moduleData, pickFieldId)];
    }
  }
  console.log("转换后的涉税历史数据",  busiData.APPR_INFO)
};

/**
 * 获取合同编号
 */
export const getContractSN = (_this) => {
  return _this.$syscfg.K_Request("YG003690", {
  });
};
/**
  * 通用模块间同步逻辑
  * 同步 模块1 到  模块2
  * @param module1 源模块 必传
  * @param module2 目标模块 必传
  * @param prefixField1 模块1字段id前缀 比如CONTROLLER_ID_TYPE的前缀就是CONTROLLER，由于不同模块间字段id前缀不同，需要把模块下字段起始id前缀传入  必传
  * @param prefixField2 模块2字段id前缀 必传
  * @param ignoreFields 不同步的字段id数组 例如不想同步姓名跟证件号码 ["USER_NAME","ID_CODE"] 默认为空
  * @param forceSyncFields 强制同步的字段id数组 例如想强制模块1的USER_NAME跟模块2的CUST_NAME [["USER_NAME","CUST_NAM"] 默认为空
  * @param _this
  */
export const syncModule1Tomodule2 = (_this, module1, module2, prefixField1, prefixField2, ignoreFields, forceSyncFields) => {
  console.log("开始同步模块1" + module1[0].MODULE_ID + "到模块2" + module2[0].MODULE_ID)
  //勾选了一致才能同步
  for (let i = 0; i < module1.length; i++) {
    let fieldDatas = module1[i]["FIELDS"];
    if (module2.length <= i) {
      //先添加一个分组
      let moduleInit = _.cloneDeep(_this.groupDatasTpl[groupId][module2.MODULE_ID][0]);
      for (let fk in moduleInit.FIELDS) {
        //先更新过滤项在增加模块
        moduleInit.FIELDS[fk].FIELD_DICT_FILTER = module2[0].FIELDS[fk].FIELD_DICT_FILTER
      }
      moduleInit["MODULE_DELETE"] = "1";
      moduleInit["MODULE_ADD"] = "1";
      //强制显示新增的分组
      moduleInit["MODULE_CONTROL"] = "1";
      moduleInit["MODULE_SEQ"] = parseInt(module2[i - 1]["MODULE_SEQ"]) + 1 + "";
      //隐藏与XX一致单选框
      if (moduleInit.FIELDS.MODULE_RADIO_BUTTON != undefined) {
        moduleInit.FIELDS.MODULE_RADIO_BUTTON.FIELD_CONTROL = "1";
      }
      //清空添加的新结构
      module2.push(moduleInit);
    }
    //同步字段值
    let fieldDatas1 = module1[i]["FIELDS"];
    let fieldDatas2 = module2[i]["FIELDS"];
    //源模块的所有字段id
    let allFieldIds = _.values(_.mapValues(fieldDatas1, "FIELD_ID"))
    //源模块的所有字段后缀id 比如ID_CODE
    let allsubFieldIds = [];
    allFieldIds.map(function (fid) {
      if (prefixField1 == "") {
        allsubFieldIds.push(fid.replace(prefixField1, ""));
      } else {
        allsubFieldIds.push(fid.replace(prefixField1 + "_", ""));
      }
    });
    console.log("模块1的所有字段id,allFieldIds=", allFieldIds)
    for (let key in fieldDatas2) {
      let field = fieldDatas2[key];
      if (field.FIELD_ID == "MODULE_RADIO_BUTTON") {
        //按钮不做处理同步
        continue;
      }
      //如果设置了忽略字段，则只有不属于忽略同步的字段才能同步
      if (!ignoreFields || ignoreFields.indexOf(field.FIELD_ID) == -1) {
        //如果设置了强制匹配的话，优先用强制匹配数组
        //否则就只有后缀字段id相同的才能同步
        let fkey = "";
        if (forceSyncFields && forceSyncFields.length > 0) {
          for (let i = 0; i < forceSyncFields.length; i++) {
            //如果该字段是强匹配字段，获取对应源模块的字段id
            if (forceSyncFields.length > 1 && forceSyncFields[i][1] == field.FIELD_ID) {
              fkey = forceSyncFields[i][0]
              console.log("匹配成功" + field.FIELD_ID + ",FKEY===" + fkey)
            }
          }
          console.log("11111111111111")
        }
        if (fkey == "" && ((prefixField2 == "" && allsubFieldIds.indexOf(field.FIELD_ID.replace(prefixField2, "")) != -1)
          || (prefixField2 != "" && allsubFieldIds.indexOf(field.FIELD_ID.replace(prefixField2 + "_", "")) != -1))) {
          console.log("222222222222222")
          if (prefixField2 == "") {
            //如果模块2的所有字段都没有前缀的话，那么模块1对应的字段就等于模块1的字段前缀+模块2的id
            fkey = prefixField1 + "_" + field.FIELD_ID;
          } else {
            fkey = field.FIELD_ID.replace(prefixField2, prefixField1)
          }
          console.log("匹配成功" + field.FIELD_ID + ",FKEY===" + fkey)
        }
        if (fkey != "" && fieldDatas1[fkey]) {
          field.DEFAULT_VALUE = fieldDatas1[fkey].DEFAULT_VALUE
          field.FIELD_CONTROL = "2"
        }
      }
    }
  }
}
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
export const setBusinessTaxNo = function (fieldData, idTypeVal, idCodeVal) {
    var fieldArr = ["ORG_ID_CODE", "ORG_ID_EXP_DATE", "BUSINESS_TAX_NO", "TAX_NO_EXP_DATE"];
    if (_.indexOf(["10", "11", "12", "13", "1A"], idTypeVal) !== -1 && idCodeVal.length === 18) {
        //主体标识码（组织机构代码）（第 9—17 位）
        fieldData.ORG_ID_CODE.DEFAULT_VALUE = idCodeVal.substring(8, 16)+"-"+idCodeVal.substring(16, 17)
        fieldData.BUSINESS_TAX_NO.DEFAULT_VALUE = idCodeVal;
        fieldArr.forEach(fk=>{
          if(fieldData.fk){
            fieldData.fk.FIELD_CONTROL = "2" 
          }
        })
    } else {
      fieldArr.forEach(fk=>{
        if(fieldData.fk){
          fieldData.fk.DEFAULT_VALUE = "";
          fieldData.fk.FIELD_CONTROL = "0" 
        }
      })
    }
}
/**
 * 根据 传入的字段id清除字段值
 * @param loadWhichDataArr
 */
export const clearFieldValue = (fieldData, fks) => {
  //过滤前 先清除字段的值
  fks.forEach((v) => {
    if (fieldData[v]) {
      fieldData[v].DEFAULT_VALUE = "";
    }
  })
}
/**
 * 逐个过滤出开户逻辑数据
 * @param param
 * @param acctOpenLogicData
 */
export const filterAcctOpenLogicData = (param, acctOpenLogicData) => {
  var rtnObj = {
    SUBJECT_IDENTITY: [],
    INOUTSIDE_IDENTITY: [],
    OCCU_TYPE: [],
    LEGAL_REP_TYPE: [],
    SZORG_TYPE: [],
    CITIZENSHIP: [],
    // TRADE: [],
    // PRO_CLS: []
  };
  if (!param || _.isEmpty(param)) {
    return rtnObj;
  }
  // 证件不为空
  if (!!param.ID_TYPE) {
    acctOpenLogicData = _.filter(acctOpenLogicData, function (v) {
      return v.ID_TYPE == param.ID_TYPE // 匹配当前证件类型
        || v.ID_TYPE == "@"  // 全部证件类型
        || (_.indexOf(["00", "08"], param.ID_TYPE) == -1 && v.ID_TYPE == "99"); // 若当前证件类型不是身份证、临时身份证、还需返回99类型的
    })
  }
  // 主体身份不为空
  if (!!param.SUBJECT_IDENTITY) {
    acctOpenLogicData = _.filter(acctOpenLogicData, function (v) {
      return _.indexOf(v.SUBJECT_IDENTITY.split(","), param.SUBJECT_IDENTITY) != -1;
    })
  }
  // 境内外标识不为空
  if (!!param.INOUTSIDE_IDENTITY) {
    acctOpenLogicData = _.filter(acctOpenLogicData, function (v) {
      return v.INOUTSIDE_IDENTITY == param.INOUTSIDE_IDENTITY || v.INOUTSIDE_IDENTITY == "@";
    })
  }
  // 职业类型不为空
  if (!!param.OCCU_TYPE) {
    acctOpenLogicData = _.filter(acctOpenLogicData, function (v) {
      return _.indexOf(v.OCCU_TYPE.split(","), param.OCCU_TYPE) != -1;
    })
  }
  // 法人类型不为空
  if (!!param.LEGAL_REP_TYPE) {
    acctOpenLogicData = _.filter(acctOpenLogicData, function (v) {
      return _.indexOf(v.LEGAL_REP_TYPE.split(","), param.LEGAL_REP_TYPE) != -1;
    })
  }
  // 机构类型不为空
  if (!!param.SZORG_TYPE) {
    acctOpenLogicData = _.filter(acctOpenLogicData, function (v) {
      return _.indexOf(v.SZORG_TYPE.split(","), param.SZORG_TYPE) != -1;
    })
  }

  // 多条配置数据整合
  _.each(rtnObj, function (value, key) {
    _.each(acctOpenLogicData, function (item) {
      rtnObj[key] = _.union(rtnObj[key], item[key] && item[key].split(","));
    });
  });
  // 若境内外身份包含全部，转译为境内、境外
  if (_.indexOf(rtnObj.INOUTSIDE_IDENTITY, "@") != -1) {
    rtnObj.INOUTSIDE_IDENTITY = ["0", "1"];
  }
  return rtnObj;
}
/**
 * 获取当前年龄
 * 传入数据：身份证号码
 */
export const getAge = (ID_CODE) => {
  var data = new Date();
  let AGE = utils.getBirthday(ID_CODE);
  AGE = AGE.substring(0, 4);
  let year = data.getFullYear() - AGE;
  return year;
};
/**
 * 获取最大的节点下标
 * 传入数据：新的节点下标
 */
export const getMaxStep = (_this,newIndex) => {
  let oldIndex = _this.oppBusiData.CURRENT_STEP || 0;
  return Math.max(parseInt(newIndex), parseInt(oldIndex));
}


/**
 * 为字典添加序号
 * 传入数据：FIELD_DICT_NAME
 */
export const addDictItemForDict = (_this, dict) => {
    _.each(dict,function (c){
        c.DICT_ITEM_NAME = c.DICT_ITEM+"-"+c.DICT_ITEM_NAME;
    })
    return dict;
}