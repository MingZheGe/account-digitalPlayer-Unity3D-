/*
*   机构涉税信息模块
*   方法封装
*   @author linsc
*/
import oppService from '../../../../../service/opp-service.js'
import date from '../../../../../tools/date.js'
import * as utils from "../../../../../tools/util"
import * as openBizPubTools from "./openBizPublicTools"

/**
 * 税收居民国信息转换为数组类型数据
 * @param taxInfoObj
 * @returns {Array}
 */
const transTaxInfoToArr = function (taxInfoObj) {
    var taxInfo = taxInfoObj || {},
      commonReason = "居民国(地区)不发放纳税人识别号",//常用理由
      otherReasonPrefix = "账户持有人未能取得纳税人识别号:",//其他理由的前缀
      rtnArr = [];
    if (taxInfo.TAX_RESIDENT_TYPE && taxInfo.TAX_RESIDENT_TYPE != "1") {
      var mainKey = "CITIZENSHIP",
        arrKeys = _.chain(taxInfo).keys().filter(function (v) {
          return v.indexOf(mainKey) == 0
        }).value();
      _.each(arrKeys, function (key, i) {
        if (taxInfo[key]) {
          let index = key.replace(mainKey, "");
          let taxNo = taxInfo["TAXPAYER_IDNO" + index];
          let reasonVal = taxInfo["NO_TAXPAYERID_REASON" + index] && taxInfo["NO_TAXPAYERID_REASON" + index].replace(otherReasonPrefix, "");
          let obj = {
            TAX_ID: index || "0",
            CITIZENSHIP: taxInfo[key],
            HAS_TAXPAYER_IDNO: !taxNo ? "0" : "1", // 临时字段转换：是否存在纳税人识别号
            TAXPAYER_IDNO: taxNo,  // 纳税人识别号
            OPP_NO_TAXPAYERID_REASON: !taxNo ? (reasonVal == commonReason ? "1" : "2") : "", // 临时字段转换：无纳税识别号原因，需要判断是否存在纳税人识别号
            NO_TAXPAYERID_REASON: reasonVal == commonReason ? "" : reasonVal // 未取得纳税人识别号原因
          };
          // 需要判断特殊情况
          if (obj.OPP_NO_TAXPAYERID_REASON == "1") {
            obj.NO_TAXPAYERID_REASON = commonReason
          }
          rtnArr.push(obj);
        }
      })
    }
    return rtnArr;
  }
/**
 * 资产信息转换为对象数据类型
 * @param taxInfoArr
 * @returns {Array}
 */
const transTaxAssetInfoToObj = function (taxInfoArr) {
    var itemKeys = ["PAYMENT_TYPE", "PAYMENT_CURR", "PAYMENT_ASSET", "PAYMENT_AMNT"],
        rtnObj = {};

    _.each(taxInfoArr, function (v) {
        //PAYMENT_ASSET为空时PAYMENT_AMNT不能送&&，否则CRS非居民涉税信息收集有报错 by hew
        v.PAYMENT_AMNT = v.PAYMENT_ASSET ? v.PAYMENT_ASSET + "&&" + v.PAYMENT_CURR : "";
    });

    // 账户存储数据特殊性，需要拼接多条资产信息
    _.each(taxInfoArr || [], function (taxInfo) {
        _.each(itemKeys, function (key) {
        rtnObj[key + taxInfo.TAX_ID] = taxInfo[key];
        });
    });

    return rtnObj;
};
/**
 * 税收居民国信息转换为对象数据类型
 * @param taxInfoArr
 * @returns {Array}
 */
const transTaxInfoToObj = function (taxInfoArr) {
    var commonReason = "居民国(地区)不发放纳税人识别号",//常用理由
        otherReasonPrefix = "账户持有人未能取得纳税人识别号:",//其他理由的前缀
        itemKeys = ["CITIZENSHIP", "TAXPAYER_IDNO", "OPP_NO_TAXPAYERID_REASON", "NO_TAXPAYERID_REASON"],
        rtnObj = {};
    // 账户存储数据特殊性，需要拼接多条纳税居民国信息
    _.each(itemKeys || [], function (key) {
        _.each(taxInfoArr || [], function (taxInfo) {
        taxInfo[key] = taxInfo[key] || "";
        if (taxInfo.TAX_ID == "0") {
            rtnObj[key] = taxInfo[key];
        } else {
            rtnObj[key + taxInfo.TAX_ID] = taxInfo[key];
        }
        });
    });
    // 1）如果居民国不发放纳税识别号，需要把原因填充到NO_TAXPAYERID_REASON
    // 2）如果不是上面的原因，需要拼接前缀到所录入的原因里面
    _.each(rtnObj, function (v, k) {
        if (k.indexOf("OPP_NO_TAXPAYERID_REASON") == 0 && v) {
        var key = k.replace("OPP_", ""),
            taxNo = rtnObj["TAXPAYER_IDNO" + k.replace("OPP_NO_TAXPAYERID_REASON", "")];
        // 无纳税识别号时
        rtnObj[key] = !taxNo ? (v == "1" ? commonReason : otherReasonPrefix + rtnObj[key]) : "";
        }
    });
    return rtnObj;
}
/**
 * 资产信息转换为数组类型数据
 * @param taxInfoObj
 * @returns {Array}
 */
const transTaxAssetInfoToArr = function (taxInfoObj, _this) {
    var taxInfo = taxInfoObj || {},
        rtnArr = [];
    //机构产品
    // 1）选择“1-仅为中国税收居民”，且“消极非金融机构标识”选择“是”“1”或“2”时
    // 2）税收居民身份选择“2”或“3”或“4”显示
    //个人  税收居民身份选择“2”或“3”或“4”显示
    if (taxInfo.TAX_RESIDENT_TYPE && (taxInfo.TAX_RESIDENT_TYPE !== "1" || _this.userType != "0" && ["1", "2"].indexOf(taxInfo.PASSIVE_NFE) != -1)) {
        var mainKey = "PAYMENT_TYPE",
        arrKeys = _.chain(taxInfo).keys().filter(function (v) {
            return v.indexOf(mainKey) === 0;
        }).value();
        _.each(arrKeys, function (key) {
        if (taxInfo[key]) {
            var index = key.replace(mainKey, ""),
            //历史数据中 PAYMENT_TYPE和PAYMENT_ASSET是由PAYMENT_AMNT拼接保存的
            PAYMENT_AMNT = taxInfo["PAYMENT_AMNT" + index] ? taxInfo["PAYMENT_AMNT" + index].split("&&") : [],
            obj = {
                TAX_ID: index || "0",
                PAYMENT_TYPE: taxInfo["PAYMENT_TYPE" + index],
                PAYMENT_CURR: taxInfo["PAYMENT_CURR" + index] || (PAYMENT_AMNT.length > 1 ? PAYMENT_AMNT[1] : ""),
                PAYMENT_ASSET: taxInfo["PAYMENT_ASSET" + index] || (PAYMENT_AMNT.length > 0 ? PAYMENT_AMNT[0] : "")
            };
            rtnArr.push(obj);
        }
        });
    }
    return rtnArr;
};
/**
 * 获取空的居民国信息
 * @returns {{CITIZENSHIP: string, CITIZENSHIP2: string, CITIZENSHIP3: string, TAXPAYER_IDNO: string, TAXPAYER_IDNO2: string, TAXPAYER_IDNO3: string, NO_TAXPAYERID_REASON: string, NO_TAXPAYERID_REASON2: string, NO_TAXPAYERID_REASON3: string}}
 */
const getEmptyTaxCountry = function () {
    return {
        CITIZENSHIP: "",
        CITIZENSHIP2: "",
        CITIZENSHIP3: "",
        TAXPAYER_IDNO: "",
        TAXPAYER_IDNO2: "",
        TAXPAYER_IDNO3: "",
        NO_TAXPAYERID_REASON: "",
        NO_TAXPAYERID_REASON2: "",
        NO_TAXPAYERID_REASON3: ""
    };
};

/**
 * 获取空的资产信息
 * @returns
 */
const getEmptyTaxAsset = function () {
  return {
      PAYMENT_TYPE1: "",
      PAYMENT_TYPE2: "",
      PAYMENT_TYPE3: "",
      PAYMENT_TYPE4: "",
      PAYMENT_CURR1: "",
      PAYMENT_CURR2: "",
      PAYMENT_CURR3: "",
      PAYMENT_CURR4: "",
      PAYMENT_ASSET1: "",
      PAYMENT_ASSET2: "",
      PAYMENT_ASSET3: "",
      PAYMENT_ASSET4: ""
  };
};
/**
 *设置涉税信息模块的字段显示
 * @param fieldData
 * @returns 
*/
const showTaxInfoFields = function (_this, fieldData) {
  let orgBasicInfo = _this.groupDatas["ORG_INFO"]["ORG_BASIC_INFO"][0]
  let orgLinkInfo = _this.groupDatas["ORG_INFO"]["ORG_LINK_INFO"][0]
  let isChinese = orgBasicInfo.FIELDS["CITIZENSHIP"].DEFAULT_VALUE == "CHN" ? true : false;
  let officeAddr = orgLinkInfo.FIELDS["OFFICE_ADDR"].DEFAULT_VALUE || "";
  if (!fieldData.TAX_RESIDENT_TYPE.DEFAULT_VALUE) {
    return;
  }
  //如果居民身份选了2仅为非居民，税收居民国信息模块的税收居民国/地区字段需要过滤掉中国
  if (fieldData.TAX_RESIDENT_TYPE.MODULE_ID == 'ORG_TAX_INFO') {
    _this.groupDatas["APPR_INFO"]["ORG_TAX_COUNTRY_INFO"].forEach((v) => {
      // if(v["FIELDS"]["CITIZENSHIP"].DEFAULT_VALUE == "CN"){
      //   v["FIELDS"]["CITIZENSHIP"].DEFAULT_VALUE = "";
      // }
      if (fieldData.TAX_RESIDENT_TYPE.DEFAULT_VALUE == '2') {
        v["FIELDS"]["CITIZENSHIP"].FIELD_DICT_FILTER = _.chain(v["FIELDS"]["CITIZENSHIP"].FIELD_DICT_NAME).filter(function (s) {
          return s.DICT_ITEM != "CN";
        }).map(function (o) {
          return o.DICT_ITEM
        }).value();
      } else {
        v["FIELDS"]["CITIZENSHIP"].FIELD_DICT_FILTER = [];
      }
    })
  }
  
  let fields = ["NAME_ENG", "ADDRESS_TYPE", "ADDRESS", "ADDRESS_ENG", "CITY_ENG", "PROVINCE_ENG", "NATION_ENG", "PROVINCE", "CITYCN", "DISTRICT_NAME"];
  // 以下两个条件之一即可显示姓名，地址类型，街道地址，机构地址字段
  // 1）选择“1-仅为中国税收居民”，且“消极非金融机构标识”选择“是”“1”或“2”时
  // 2）税收居民身份选择“2”或“3”或“4”
  if (fieldData["TAX_RESIDENT_TYPE"].DEFAULT_VALUE == "1" && _.indexOf(["1", "2"], fieldData["PASSIVE_NFE"].DEFAULT_VALUE) != -1 || fieldData["TAX_RESIDENT_TYPE"].DEFAULT_VALUE != "1") {
    for (let fk in fields) {
      if (fields[fk] in fieldData) {
        //显示姓名，地址类型，街道地址，机构地址
        fieldData[fields[fk]].FIELD_CONTROL = "0";
      }
    }
    fieldData["ADDRESS"].DEFAULT_VALUE = isChinese ? officeAddr : "";
    fieldData["ADDRESS"].FIELD_REQUIRED = isChinese
    //显示资产模块
    _this.groupDatas["APPR_INFO"]["TAX_ASSET_INFO"].forEach((v) => {
      v.MODULE_CONTROL = "1";
    })
  } else {
    for (let fk in fields) {
      if (fields[fk] in fieldData) {
        //隐藏姓名，地址类型，街道地址，机构地址
        fieldData[fields[fk]].FIELD_CONTROL = "1";
        fieldData[fields[fk]].DEFAULT_VALUE = "";
      }
    }
    fieldData["ADDRESS"].DEFAULT_VALUE = "";
    fieldData["ADDRESS"].FIELD_REQUIRED = false;
    //隐藏资产
    _this.groupDatas["APPR_INFO"]["TAX_ASSET_INFO"].forEach((v) => {
      v.MODULE_CONTROL = "0";
    })
  }
};
export default {
  openBizOrgTaxInfoNodeBeforeLoadBiz: function(_this){
    let gk = "APPR_INFO";
    //由于一柜通涉税居民国字段代码CITIZENSHIP,且字典为CITIZENSHIP_ST
    //而同名字段在VTM中已分配给了基础信息的国家字段，且字典为CITIZENSHIP,两个字段字典不一致，
    //所以涉税居民国字段的字段配置为CITIZENSHIP_ST，以作区分，
    //但是加载的时候，先把该字段名字改为与一柜通同名的，提交后一柜通才能取到值  
    if (_this.groupDatas[gk]["ORG_TAX_COUNTRY_INFO"]) {
        let fields = _this.groupDatas[gk]["ORG_TAX_COUNTRY_INFO"][0].FIELDS;
        //将所有字段变为json，替换掉所有的CITIZENSHIP_ST,再解析为字段对象
        fields = JSON.parse(JSON.stringify(fields).replace(/CITIZENSHIP_ST/g, "CITIZENSHIP"));
        _this.groupDatas[gk]["ORG_TAX_COUNTRY_INFO"][0].FIELDS = fields;
        _this.groupDatasTpl = _.cloneDeep(_this.groupDatas);
    }
    if (_this.groupDatas[gk] && _this.groupDatas[gk]["CONTROL_ORG_TAX_COUNTRY_INFO"]) {
        let fields = _this.groupDatas[gk]["CONTROL_ORG_TAX_COUNTRY_INFO"][0].FIELDS;
        //将所有字段变为json，替换掉所有的CITIZENSHIP_ST,再解析为字段对象
        fields = JSON.parse(JSON.stringify(fields).replace(/CITIZENSHIP_ST/g, "CITIZENSHIP"));
        _this.groupDatas[gk]["CONTROL_ORG_TAX_COUNTRY_INFO"][0].FIELDS = fields;
        _this.groupDatasTpl = _.cloneDeep(_this.groupDatas);
    }
    //todo
    //构造涉税信息模块下地址类型字典
    if (_this.groupDatas[gk]) {
      _this.groupDatas[gk]["ORG_TAX_INFO"][0].FIELDS["ADDRESS_TYPE"].FIELD_DICT_NAME = [
        { "DICT_ITEM": "0", "DICT_ITEM_NAME": "办公地址" }, { "DICT_ITEM": "1", "DICT_ITEM_NAME": "注册地址" }
      ];
    }
    //显示资产信息模块第一组所有字段
    let assestInfoFields = _this.groupDatas[gk]["TAX_ASSET_INFO"][0].FIELDS;
    for (let fk in assestInfoFields) {
      assestInfoFields[fk]["FIELD_CONTROL"] = "0";
    }
    //中泰证券 隐藏 资产
    if(_this.$syscfg.isQSJG(_this.$definecfg.QSJGDM_CONST.ZHONGTAI)){
      openBizPubTools.setModulesControl(_this, gk, "TAX_ASSET_INFO", "0")
      //构造原因
      _this.groupDatas[gk]["ORG_TAX_COUNTRY_INFO"][0].FIELDS["OPP_NO_TAXPAYERID_REASON"].FIELD_DICT_NAME = [
        { "DICT_ITEM": "1", "DICT_ITEM_NAME": "1居民国(地区)不发放纳税人识别号" }, { "DICT_ITEM": "2", "DICT_ITEM_NAME": "2账户持有人未能取得纳税人识别号" }
      ];
      _this.groupDatasTpl[gk]["ORG_TAX_COUNTRY_INFO"][0].FIELDS["OPP_NO_TAXPAYERID_REASON"].FIELD_DICT_NAME = [
        { "DICT_ITEM": "1", "DICT_ITEM_NAME": "1居民国(地区)不发放纳税人识别号" }, { "DICT_ITEM": "2", "DICT_ITEM_NAME": "2账户持有人未能取得纳税人识别号" }
      ];
      //控制人模块也要
       //构造原因
       _this.groupDatas[gk]["CONTROL_ORG_TAX_COUNTRY_INFO"][0].FIELDS["OPP_NO_TAXPAYERID_REASON"].FIELD_DICT_NAME = [
        { "DICT_ITEM": "1", "DICT_ITEM_NAME": "1居民国(地区)不发放纳税人识别号" }, { "DICT_ITEM": "2", "DICT_ITEM_NAME": "2账户持有人未能取得纳税人识别号" }
      ];
      _this.groupDatasTpl[gk]["CONTROL_ORG_TAX_COUNTRY_INFO"][0].FIELDS["OPP_NO_TAXPAYERID_REASON"].FIELD_DICT_NAME = [
        { "DICT_ITEM": "1", "DICT_ITEM_NAME": "1居民国(地区)不发放纳税人识别号" }, { "DICT_ITEM": "2", "DICT_ITEM_NAME": "2账户持有人未能取得纳税人识别号" }
      ];
    }
  },
  openBizOrgTaxInfoNodeAfterLoadBiz: function(_this){
    this.openBizOrgTaxInfoNodeLoadbizData(_this);
  },
  openBizOrgTaxInfoNodeLoadbizData: function(_this){
     
  },
  openBizOrgTaxInfoNodeValidate: function(_this){
    return true;
  },
  openBizOrgTaxInfoNodePageActivated: function(_this){
  },
  openBizOrgTaxInfoNodeBeforeSave: function(_this,params){
    // this.getData(_this,params);
    // let gk = "APPR_INFO";
    // if (_this.groupId == gk
    //     && params[gk] && params[gk]["ORG_TAX_INFO"] && !(_this.userType == '2' && _this.oppBusiData["busiCommonParams"]["IS_SHOW_TAX_INFO"] == "0")) {
    //     //构建送给一柜通的涉税信息模块数据
    //     //如果产品户不显示涉税则不处理
    //     let orgTaxInfo = params[gk]["ORG_TAX_INFO"];
    //     if (orgTaxInfo.length < 2)
    //       orgTaxInfo.push({});
    //     //如果居民身份不是仅为中国税收居民，要把税收居民国/地区信息 资产信息合并到客户涉税信息里 
    //     if (orgTaxInfo[0].TAX_RESIDENT_TYPE != 1 && "ORG_TAX_COUNTRY_INFO" in params[gk]) {
    //       let taxIds = ["0", "2", "3"];
    //       for (let i = 0; i < params[gk]["ORG_TAX_COUNTRY_INFO"].length; i++) {
    //         let fields = params[gk]["ORG_TAX_COUNTRY_INFO"][i];
    //         fields["TAX_ID"] = taxIds[i];
    //       }
    //       Object.assign(orgTaxInfo[0],getEmptyTaxCountry(), transTaxInfoToObj(params[gk].ORG_TAX_COUNTRY_INFO))
    //       delete params[gk].ORG_TAX_COUNTRY_INFO
    //     }
    //     if ((orgTaxInfo[0].TAX_RESIDENT_TYPE != 1 || ["1", "2"].indexOf(orgTaxInfo[0].PASSIVE_NFE) != -1) && "TAX_ASSET_INFO" in params[gk]) {
    //       orgTaxInfo[0]["MONAMNT"] = params[gk].TAX_ASSET_INFO[0]["MONAMNT"];
    //       orgTaxInfo[0]["CURR_CODE"] = params[gk].TAX_ASSET_INFO[0]["CURR_CODE"];

    //       let taxIds = ["1", "2", "3", "4"];
    //       for (let i = 0; i < params[gk]["TAX_ASSET_INFO"].length; i++) {
    //         let fields = params[gk]["TAX_ASSET_INFO"][i];
    //         fields["TAX_ID"] = taxIds[i];
    //       }
    //       Object.assign(orgTaxInfo[0], getEmptyTaxAsset(), transTaxAssetInfoToObj(params[gk].TAX_ASSET_INFO))
    //       delete params[gk].TAX_ASSET_INFO
    //     }
    //     // 涉税信息需要添加CTRL_FLAG给一柜通，
    //     for (let i = 0; i < orgTaxInfo.length; i++) {
    //       if (i == 0) // 客户涉税信息 CTRL_FLAG 标识为0
    //         orgTaxInfo[0]["CTRL_FLAG"] = "0";
    //     }
    //     //修改同步字段，避免账户系统CRS非居民涉税信息导出报送出错
    //     orgTaxInfo[0] = Object.assign({}, orgTaxInfo[0], {
    //       LIVING_COUNTRY:orgTaxInfo[0].NATION_ENG,
    //       CITYEN:orgTaxInfo[0].CITY_ENG
    //     });
    //     // 如果为消极非金融机构，存在控制人涉税信息，需处理控制人涉税信息
    //     if (orgTaxInfo[0].PASSIVE_NFE != "3" && _this.groupId == gk
    //       && params[gk] && params[gk]["CONTROL_ORG_TAX_INFO"]) {
    //       let contrlOrgTaxInfo = params[gk]["CONTROL_ORG_TAX_INFO"][0];
    //       let contrlOrgTaxCountryInfo = params[gk]["CONTROL_ORG_TAX_COUNTRY_INFO"];

    //       if (contrlOrgTaxInfo.TAX_RESIDENT_TYPE == "1") {
    //         Object.assign(contrlOrgTaxInfo, {
    //           TAX_RESIDENT_TYPE: "1",
    //           CTRL_FLAG: "1",
    //           PASSIVE_NFE: "",
    //           CTRL_NON_RESIDENT: "",
    //           ADDRESS: "",
    //           BIRTH_ADDRESS: ""
    //         })
    //       } else {
    //         Object.assign(contrlOrgTaxInfo, {
    //           CTRL_FLAG: "1",
    //           PASSIVE_NFE: "",
    //         })
    //         if ("CONTROL_ORG_TAX_COUNTRY_INFO" in params[gk]) {
    //           let taxIds = ["0", "2", "3"];
    //           for (let i = 0; i < params[gk]["CONTROL_ORG_TAX_COUNTRY_INFO"].length; i++) {
    //             let fields = params[gk]["CONTROL_ORG_TAX_COUNTRY_INFO"][i];
    //             fields["TAX_ID"] = i;
    //           }
    //           Object.assign(contrlOrgTaxInfo, getEmptyTaxCountry(), transTaxInfoToObj(contrlOrgTaxCountryInfo));
    //           if (_this.moduleId.indexOf("CONTROL_ORG_TAX_COUNTRY_INFO") != -1)
    //             delete params[gk].CONTROL_ORG_TAX_COUNTRY_INFO
    //         }
    //       }
    //       orgTaxInfo[1] = Object.assign({}, contrlOrgTaxInfo);
    //       //修改同步字段，避免账户系统CRS非居民涉税信息导出报送出错
    //       orgTaxInfo[1] = Object.assign({},  orgTaxInfo[1], {
    //         BIRTH_COUNTRY:orgTaxInfo[1].BIRTH_NATION_ENG,
    //         LIVING_COUNTRY:orgTaxInfo[1].NATION_ENG,
    //         CITYEN:orgTaxInfo[1].CITY_ENG
    //       });
    //       if (_this.moduleId.indexOf("CONTROL_ORG_TAX_COUNTRY_INFO") != -1)
    //         delete params[gk].CONTROL_ORG_TAX_INFO;
    //     }
    //     if(gk == "APPR_INFO"){           
    //       //复制适当性里的涉税信息和诚信记录等模块到关联信息分组
    //       params["RELA_INFO"] = Object.assign(params["RELA_INFO"], _.cloneDeep(params[gk]))
    //       delete params[gk];
    //     }
    // }
  },
  openBizOrgTaxInfoNodeAfterSave: function(_this){
    let gk = "APPR_INFO";
    //点击下一步需要跳回控制人涉税列表页面
    //除非当前页面是控制人涉税，且下一页需要显示控制人涉税-税收居民国页面
    if(!(_this.moduleId.indexOf("CONTROL_ORG_TAX_INFO") != -1 && _this.groupDatas[gk]["CONTROL_ORG_TAX_COUNTRY_INFO"][0].MODULE_CONTROL == "1")) {
      let index = -1;
      for(let i = 0; i < _this.$store.state.bizRouteTable.length; i++) {
        let r = _this.$store.state.bizRouteTable[i];
        if(r.name == "控制人涉税信息") {
          index = i;
          break;
        }
      }
      if(index > -1){
      //   bizTaxMethod.saveTaxControlData(_this);
        _this.$router.goRoute(index);
        //阻止框架的下一步
        throw "preventNextStep"
      }
    }
  },
  //-----字段关联逻辑-----//
  /*
  * CHECK_PAYMENT_TYPE 收入类型
  * 1.选了收入类型就把收入金额 货币类型改为必填
  */
  "CHECK_PAYMENT_TYPE": (_this, field, fieldData) => {
    if (field.DEFAULT_VALUE !== '' && fieldData.PAYMENT_ASSET && fieldData.PAYMENT_CURR) {
      fieldData.PAYMENT_CURR.FIELD_REQUIRED = "1";
      fieldData.PAYMENT_ASSET.FIELD_REQUIRED = "1";
    } else if (field.DEFAULT_VALUE === '' && fieldData.PAYMENT_ASSET && fieldData.PAYMENT_CURR) {
      fieldData.PAYMENT_CURR.FIELD_REQUIRED = "0";
      fieldData.PAYMENT_ASSET.FIELD_REQUIRED = "0";
    }
  },
  /*
  * CHECK_PROVINCE 省代码
  * 1.选了省 就过滤出对应的市区代码
  */
  "CHECK_PROVINCE": (_this, field, fieldData) => {
    if (field.DEFAULT_VALUE !== '') {
      fieldData["CITYCN"].FIELD_DICT_FILTER = _.chain(fieldData["CITYCN"].FIELD_DICT_NAME).filter(function (v) {
        return v.DICT_ITEM.substr(0, 2) == field.DEFAULT_VALUE.substr(0, 2);
      }).map(function (o) {
        return o.DICT_ITEM
      }).value();
    }
  },
  /*
  * CHECK_CITYCN 市区代码
  * 1.选了那个市 就过滤出对应的县区代码
  */
  "CHECK_CITYCN": (_this, field, fieldData) => {
    let specialCityArr = ['110000', '120000', '310000', '500000'];
    if (field.DEFAULT_VALUE !== '') {
      fieldData["DISTRICT_NAME"].FIELD_DICT_FILTER = _.chain(fieldData["DISTRICT_NAME"].FIELD_DICT_NAME).filter(function (v) {
        return specialCityArr.indexOf(field.DEFAULT_VALUE) !== -1 ? v.DICT_ITEM.substr(0, 2) == field.DEFAULT_VALUE.substr(0, 2) : v.DICT_ITEM.substr(0, 4) == field.DEFAULT_VALUE.substr(0, 4);
      }).map(function (o) {
        return o.DICT_ITEM
      }).value();
    }
  },
   /**
   * 【TAXINFO_TAX_RESIDENT_TYPE】税收居民身份：
   */
  "CHECK_TAX_RESIDENT_TYPE": (_this, field, fieldData) => {
    if (field.DEFAULT_VALUE == "") {
      return;
    }
    if (field.DEFAULT_VALUE == "4" && _this.busiCode == "Z0035") {
      field.DEFAULT_VALUE = "";
      //如果控制人涉税已经显示了
      if (_this.$basecfg.platform == "vtm") {
        _this.messageBox({
          hasMask: true,
          messageText: "客户不配合提供税收居民身份声明，不允许开户!",
          confirmButtonText: '确定',
          typeMessage: 'error',
          showMsgBox: true
        })
      } else {
        _this.$vux.alert.show({
          title: "操作提示",
          content: "客户不配合提供税收居民身份声明，不允许开户!"
        })
      }
      return;
    }
    openBizPubTools.fieldFilter(_this, field, fieldData);
    let gk = _this.oppBusiData["busiData"].relaInfoGroupId;
    if (_this.userType == "1" || _this.userType == "2") {
      if (field.MODULE_ID == "ORG_TAX_INFO") {
        //设置消极非金融机构的过滤项
        let PASSIVE_NFE_OBJ = {
          "1": ["1", "3"],        // 税收居民身份选择“1”，只能选“1-居民消极非金融机构”或“3-其他机构”
          "2": ["2", "3"],        // 税收居民身份选择“2”，只能选“2-非居民消极非金融机构”或“3-其他机构”
          "3": ["2", "3"],        // 税收居民身份选择“3”，只能选“2-非居民消极非金融机构”或“3-其他机构”
          "4": ["1", "2", "3"]    // 税收居民身份选择“4”，下拉选择不控制
        };
        fieldData["PASSIVE_NFE"].FIELD_DICT_FILTER = PASSIVE_NFE_OBJ[field.DEFAULT_VALUE]
        //选择税收居民身份 切换显示的基础字段
        let showfields = ["NAME_ENG", "ADDRESS_TYPE", "ADDRESS", "ADDRESS_ENG", "CITY_ENG", "PROVINCE_ENG", "NATION_ENG", "PROVINCE", "CITYCN", "DISTRICT_NAME"];
        //选择了1.仅为中国税收居民，把其他字段隐藏了，把税收居民国/地区信息分组模块也隐藏了
        //选择了2.仅为非居民或者3.既为中国也是其他国家税收居民 显示详细的地址点段和 税收居民国/地区信息 
        if (field.DEFAULT_VALUE == "1") {
          if(_this.userType == "1" && _this.groupDatas[gk]["ORG_TAX_COUNTRY_INFO"]){
            for(let i = 0; i < _this.groupDatas[gk]["ORG_TAX_COUNTRY_INFO"].length; i++)
              _this.groupDatas[gk]["ORG_TAX_COUNTRY_INFO"][i].MODULE_CONTROL = "0";
          }
          showfields.forEach((fk) => {
            if (fk in fieldData) {
              fieldData[fk].FIELD_CONTROL = "1";
              fieldData[fk].DEFAULT_VALUE = " ";
            }
          });
        } else {
          if (_this.groupDatas[gk]["ORG_TAX_COUNTRY_INFO"]) {
            for (let i = 0; i < _this.groupDatas[gk]["ORG_TAX_COUNTRY_INFO"].length; i++)
              _this.groupDatas[gk]["ORG_TAX_COUNTRY_INFO"][i].MODULE_CONTROL = "1";
          }
          showfields.forEach((fk) => {
            if (fk in fieldData) {
              fieldData[fk].FIELD_CONTROL = "0";
            }
          });
        }
        showTaxInfoFields(_this, fieldData)
      } else if (field.MODULE_ID == "CONTROL_ORG_TAX_INFO") {
        //如果居民身份选了2仅为非居民，税收居民国信息模块的税收居民国/地区字段需要过滤掉中国
        _this.groupDatas["APPR_INFO"]["CONTROL_ORG_TAX_COUNTRY_INFO"].forEach((v) => {
          if (fieldData.TAX_RESIDENT_TYPE.DEFAULT_VALUE == '2') {
            v["FIELDS"]["CITIZENSHIP"].FIELD_DICT_FILTER = _.chain(v["FIELDS"]["CITIZENSHIP"].FIELD_DICT_NAME).filter(function (s) {
              return s.DICT_ITEM != "CN"
            }).map(function (o) {
              return o.DICT_ITEM
            }).value();
          } else {
            v["FIELDS"]["CITIZENSHIP"].FIELD_DICT_FILTER = [];
          }
        })

        let fieldControl = "1";
        let moduleControl = "0";
        if (field.DEFAULT_VALUE == "1") {
          //如果控制人的税收居民身份为1.仅为中国税收 或者为空 则只显示一个税收居民身份其他字段隐藏，税收居民国地区模块也隐藏
          fieldControl = "1";
          moduleControl = "0";
          fieldData["CTRL_NON_RESIDENT"].DEFAULT_VALUE =  "";
          fieldData["CTRL_NON_RESIDENT"].FIELD_CONTROL =   fieldControl;
        } else {
          // 若居民身份选择2和3，非居民控制人标识栏位应该默认为是，且不可更改,如果选了4则清空且可选
          fieldData["CTRL_NON_RESIDENT"].DEFAULT_VALUE = field.DEFAULT_VALUE == "4" ? "" : "1";
          fieldData["CTRL_NON_RESIDENT"].FIELD_CONTROL = field.DEFAULT_VALUE == "4" ? "0" : "2";
          fieldControl = "0";
          moduleControl = "1";
        }
        for (let fk in fieldData) {
          if (fk != "TAX_RESIDENT_TYPE" && fk != "CTRL_NON_RESIDENT") {
            fieldData[fk].FIELD_CONTROL = fieldControl;
          }
        }
        let ctrlTaxCounInfos = _this.groupDatas[gk]['CONTROL_ORG_TAX_COUNTRY_INFO'];
        for (let i = 0; i < ctrlTaxCounInfos.length; i++)
          ctrlTaxCounInfos[i].MODULE_CONTROL = moduleControl;
      }
    }
  },
  // 是否为金融消费机构处理函数
  "CHECK_PASSIVE_NFE": (_this, field, fieldData) => {
    if (field.DEFAULT_VALUE == "") {
      return;
    }
    let gk = "APPR_INFO";
    if (_this.groupDatas[gk]["ORG_TAX_INFO"]) {
      let controlTaxInfo = _this.groupDatas[gk]["CONTROL_ORG_TAX_INFO"][0];
      if (field.DEFAULT_VALUE === "1" || field.DEFAULT_VALUE === "2") {
        controlTaxInfo.MODULE_CONTROL = "1";
        showTaxInfoFields(_this, fieldData)
      } else if (field.DEFAULT_VALUE === "3") {
        let existLen = controlTaxInfo.MODULE_CONTROL;
        let changeFileds = function () {
          // 变更，则需要删除控制人涉税模块
          controlTaxInfo.MODULE_CONTROL = "0";
          //清除控制人涉税信息
          //需要隐藏掉控制人以及控制人税收居民国信息模块
          let fields = _this.groupDatas[gk]["CONTROL_ORG_TAX_COUNTRY_INFO"][0].FIELDS;
          for (let fk in fields) {
            fields[fk].DEFAULT_VALUE = "";
          }
          let fields2 = _this.groupDatas[gk]["CONTROL_ORG_TAX_INFO"][0].FIELDS;
          for (let fk in fields2) {
            fields2[fk].DEFAULT_VALUE = "";
          }
          _this.groupDatas[gk]["CONTROL_ORG_TAX_COUNTRY_INFO"][0].MODULE_CONTROL = "0";
          showTaxInfoFields(_this, fieldData)
        }
        let canceledAction = function () {
          //一柜通逻辑，取消变更的话，需要恢复旧值 
          //移动端做不到，直接清掉值
          field.DEFAULT_VALUE = "";
        }
        if (existLen == "1") {
          //如果控制人涉税已经显示了
          if (_this.$basecfg.platform == "vtm") {
            _this.messageBox({
              hasMask: true,
              messageText: "变更“消极非金融机构”为其它机构，将会删除控制人涉税信息，确定变更吗？",
              confirmButtonText: '确定',
              typeMessage: 'warn',
              showMsgBox: true,
              canceledAction: canceledAction,
              confirmAction: changeFileds
            })
          } else {
            _this.$vux.confirm.show({
              title: "操作提示",
              content: "变更“消极非金融机构”为其它机构，将会删除控制人涉税信息，确定变更吗？",
              onConfirm: changeFileds,
              canceledAction: canceledAction
            })
          }
        }
      }
    }
  },
  /**
   * 【TAXINFO_GET_INVEST_CERFLAG】取得投人资声明标识
   */
  "CHECK_GET_INVEST_CERFLAG": (_this, field, fieldData) => {
    openBizPubTools.fieldFilter(_this, field, fieldData);
    console.log(fieldData);
  },
  /**
   * 【CHECK_NATION_ENG】机构所在国家(英文/拼音)
   * 1.如果为CN中国 则三个省市区代码字段必填 显示 机构地址也必填
   * 2.如果是外国 隐藏三个省市区代码 且结构地址非必填
   */
  "CHECK_NATION_ENG": (_this, field, fieldData) => {
    if (_this.userType != '0') {
      fieldData["ADDRESS"].FIELD_REQUIRED = field.DEFAULT_VALUE == "CN" ? "1" : "0";
      fieldData["PROVINCE"].FIELD_REQUIRED = field.DEFAULT_VALUE == "CN" ? "1" : "0";
      fieldData["CITYCN"].FIELD_REQUIRED = field.DEFAULT_VALUE == "CN" ? "1" : "0";
      fieldData["DISTRICT_NAME"].FIELD_REQUIRED = field.DEFAULT_VALUE == "CN" ? "1" : "0";

      fieldData["PROVINCE"].FIELD_CONTROL = field.DEFAULT_VALUE == "CN" ? "0" : "1";
      fieldData["CITYCN"].FIELD_CONTROL = field.DEFAULT_VALUE == "CN" ? "0" : "1";
      fieldData["DISTRICT_NAME"].FIELD_CONTROL = field.DEFAULT_VALUE == "CN" ? "0" : "1";
    }
  },
  /**
   * 【CHECK_LIVING_COUNTRY】控制人涉税信息模块 现居国家(英文/拼音)
   * 1.如果为CN中国 则三个省市区代码字段必填 显示 机构地址也必填
   * 2.如果是外国 隐藏三个省市区代码 且结构地址非必填
   */
  "CHECK_LIVING_COUNTRY": (_this, field, fieldData) => {
    if (_this.userType != '0') {
      fieldData["ADDRESS"].FIELD_REQUIRED = field.DEFAULT_VALUE == "CN" ? "1" : "0";
      fieldData["PROVINCE"].FIELD_REQUIRED = field.DEFAULT_VALUE == "CN" ? "1" : "0";
      fieldData["CITYCN"].FIELD_REQUIRED = field.DEFAULT_VALUE == "CN" ? "1" : "0";
      fieldData["DISTRICT_NAME"].FIELD_REQUIRED = field.DEFAULT_VALUE == "CN" ? "1" : "0";

      fieldData["PROVINCE"].FIELD_CONTROL = field.DEFAULT_VALUE == "CN" ? "0" : "1";
      fieldData["CITYCN"].FIELD_CONTROL = field.DEFAULT_VALUE == "CN" ? "0" : "1";
      fieldData["DISTRICT_NAME"].FIELD_CONTROL = field.DEFAULT_VALUE == "CN" ? "0" : "1";
    }
  },
  /**
   * 【TAXINFO_HAS_TAXPAYER_IDNO】是否有纳税人识别号：
   */
  "CHECK_HAS_TAXPAYER_IDNO": (_this, field, fieldData) => {
    openBizPubTools.fieldFilter(_this, field, fieldData);
  },

  /**
   * 【TAXINFO_OPP_NO_TAXPAYERID_REASON】无纳税人识别号原因：
   */
  "CHECK_OPP_NO_TAXPAYERID_REASON": (_this, field, fieldData) => {
    openBizPubTools.fieldFilter(_this, field, fieldData);
  },
}