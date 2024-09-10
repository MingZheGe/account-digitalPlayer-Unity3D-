/* 
*   机构开户-机构基本信息模块
*   方法封装
*   @author  linsc
*/

import oppService from '../../../../../service/opp-service.js'
import date from '../../../../../tools/date.js'
import smsService from '../../../../../service/sms-service'
import * as utils from "../../../../../tools/util"
import * as openBizPubTools from "./openBizPublicTools"
import bizPublicSaveMethod from '../../../../businessTools/bizPublicSaveMethod'
import custService from '../../../../../service/cust-service.js'

const filterOpenLogicData = function (_this, param) {
    let rtnObj = {
        SUBJECT_IDENTITY: [],
        INOUTSIDE_IDENTITY: [],
        OCCU_TYPE: [],
        LEGAL_REP_TYPE: [],
        SZORG_TYPE: [],
        CITIZENSHIP: [],
        TRADE: [],
        PRO_CLS: []
    };
    let openLogicData = _this.oppBusiData.allAcctOpenLogicData;
    if (!param || _.isEmpty(param)) {
        return rtnObj;
    }
    // 证件不为空
    if (param.ID_TYPE) {
        openLogicData = _.filter(openLogicData, function (v) {
            return v.ID_TYPE == param.ID_TYPE // 匹配当前证件类型
                || (_.indexOf(["00", "08"], param.ID_TYPE) == -1 && v.ID_TYPE == "99"); // 若当前证件类型不是身份证、临时身份证、还需返回99类型的
        });
    }
    // 主体身份不为空
    if (param.SUBJECT_IDENTITY) {
        openLogicData = _.filter(openLogicData, function (v) {
            return _.indexOf(v.SUBJECT_IDENTITY.split(","), param.SUBJECT_IDENTITY) != -1;
        });
    }
    // 境内外标识不为空
    if (param.INOUTSIDE_IDENTITY) {
        openLogicData = _.filter(openLogicData, function (v) {
            return v.INOUTSIDE_IDENTITY == param.INOUTSIDE_IDENTITY;
        });
    }
    // 职业类型不为空
    if (param.OCCU_TYPE) {
        openLogicData = _.filter(openLogicData, function (v) {
            return _.indexOf(v.OCCU_TYPE.split(","), param.OCCU_TYPE) != -1;
        });
    }
    // 法人类型不为空
    if (param.LEGAL_REP_TYPE) {
        openLogicData = _.filter(openLogicData, function (v) {
            return _.indexOf(v.LEGAL_REP_TYPE.split(","), param.LEGAL_REP_TYPE) != -1;
        });
    }
    // 机构类型不为空
    if (param.SZORG_TYPE) {
        openLogicData = _.filter(openLogicData, function (v) {
            return _.indexOf(v.SZORG_TYPE.split(","), param.SZORG_TYPE) != -1;
        });
    }
    // 行业类型类型不为空
    if (param.TRADE) {
        openLogicData = _.filter(openLogicData, function (v) {
            return _.indexOf(v.TRADE.split(","), param.TRADE) != -1;
        });
    }
    // 产品类型不为空
    if (param.PRO_CLS) {
        openLogicData = _.filter(openLogicData, function (v) {
            return _.indexOf(v.PRO_CLS.split(","), param.PRO_CLS) != -1;
        });
    }
    // 国籍地区不为空
    if (param.CITIZENSHIP) {
        openLogicData = _.filter(openLogicData, function (v) {
            return _.indexOf(v.CITIZENSHIP.split(","), param.CITIZENSHIP) != -1;
        });
    }
    // 多条配置数据整合
    _.each(rtnObj, function (value, key) {
        _.each(openLogicData, function (item) {
            rtnObj[key] = _.union(rtnObj[key], item[key].split(","));
        });
    });
    return rtnObj;
}
export default {
    //----------------------------------钩子函数----------------------//
    /*
    *@method openBizOrgInfoNodeBeforeLoadBiz
    *@desc 钩子函数 加载历史数据之前触发
    *@MethodAuthor  linsc
    *@Date: 2019-06-11 15:19:09
    */
    openBizOrgInfoNodeBeforeLoadBiz: function (_this) {
        //默认填写客户三要素
        let custInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO)
        _this.groupDatas.ORG_INFO.ORG_BASIC_INFO[0].FIELDS.CUST_FNAME.DEFAULT_VALUE = custInfo.CUST_FNAME;
        _this.groupDatas.ORG_INFO.ORG_BASIC_INFO[0].FIELDS.ID_TYPE.DEFAULT_VALUE = custInfo.ID_TYPE;
        _this.groupDatas.ORG_INFO.ORG_BASIC_INFO[0].FIELDS.ID_CODE.DEFAULT_VALUE = custInfo.ID_CODE;
        //保存读卡信息
        if (_this.cardData) {
            _this.oppBusiData.cardData = _this.cardData;
        }

        return _this.$syscfg.K_Request_ALL([
            openBizPubTools.getAcctOpenInitData(_this),
            openBizPubTools.getValidIdTypeData(_this),
            _this.$syscfg.getSysConfig("AML_ENABLE"),
            custService.getOpenTemplateData(_this),
            custService.getCustModelSet(_this)
        ]).then((res) => {
            console.log("开户逻辑res", res)
            if (res[0].Data.length == 0) {
                _this.$blMethod.showMsgBox(_this, "开户逻辑配置为空！")
            }
            //开户逻辑
            _this.oppBusiData["allAcctOpenLogicData"] = _.get(res[0], "Data[0].openLogicData", {});
            _this.oppBusiData["rateObj"] = _.get(res[3], "Data[0]", {});
            // 客户模板设置
            _this.oppBusiData["templData"] = _.get(res[4], "Data", []);
            // 过滤出当前用户类型且取第一个模板
            _this.oppBusiData["templData"] = _.filter(_this.oppBusiData["templData"], item => {
                return item.USER_TYPE == _this.userType;
            }) || [];
            let rateObj = _this.oppBusiData["rateObj"];
            _this.oppBusiData.OPEN_TEMPLATE = _.extend(_this.oppBusiData["templData"][0] || {}, {
                RMB_INT_RATE_SN: rateObj.RMB_INT_RATE_SN,
                HK_INT_RATE_SN: rateObj.HK_INT_RATE_SN,
                US_INT_RATE_SN: rateObj.US_INT_RATE_SN,
                RMB_DR_RATE_GRP: rateObj.RMB_DR_RATE_GRP,
                HK_DR_RATE_GRP: rateObj.HK_DR_RATE_GRP,
                US_DR_RATE_GRP: rateObj.US_DR_RATE_GRP
            })
            if (!_this.oppBusiData["allAcctOpenLogicData"]) {
                _this.$blMethod.showMsgBox(_this, "开户逻辑配置为空！")
            }
            //证件类型 分类
            var validIdTypeObj = { "0": [], "1": [], "2": [] };
            res[1] && res[1].Data.forEach((v) => {
                validIdTypeObj[v.USER_TYPE].push(v.ID_TYPE)
            })
            //个人证件类型数组
            _this["oppBusiData"]["VALID_ID_TYPE_FOR_PERSON"] = validIdTypeObj["0"];
            //机构证件类型编码数组
            _this["oppBusiData"]["VALID_ID_TYPE_FOR_ORG"] = validIdTypeObj["1"];
            //产品证件类型编码数组  
            _this["oppBusiData"]["VALID_ID_TYPE_FOR_PRO"] = validIdTypeObj["2"]
            //机构+个人 证件类型合并数组
            _this["oppBusiData"]["VALID_ID_TYPE_FOR_BOTH"] = validIdTypeObj["0"].concat(validIdTypeObj["1"])
            
            // 设置证件类型
            _this.groupDatas.ORG_INFO.ORG_BASIC_INFO[0].FIELDS.ID_TYPE.FIELD_DICT_FILTER = _this["oppBusiData"]["VALID_ID_TYPE_FOR_ORG"];
        }).catch((err) => {
            console.error("---------Z0035 开户初始化错误:---------", err.toString());
            _this.$blMethod.showMsgBox(_this, "获取开户初始化数据失败:" + err.toString() || JSON.stringify(err && err.message))
            throw err;
        }).finally(() => {
            console.log("custInfoBeforeLoadBiz end")
        });
    },
    /*
     *@method openBizOrgInfoNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     *@MethodAuthor  linsc
     *@Date: 2019-06-13 09:42:56
    */
    openBizOrgInfoNodeAfterLoadBiz: function (_this) {
        //如果历史流水里有一人多户信息，需要展示出来
        if (_this.historyData && _this.historyData.CHECK_ARR && _this.historyData.CHECK_ARR[0]) {
            let checkArr = _this.groupDatas.ORG_INFO.CHECK_ARR;
            for (let i = 0; i < checkArr.length; i++) {
                checkArr[i].MODULE_CONTROL = "1";
                let allfds = checkArr[i].FIELDS;
                allfds.CHECK_STATUS.FIELD_DICT_NAME = [{ DICT_ITEM: "0", DICT_ITEM_NAME: "否" }, { DICT_ITEM: "1", DICT_ITEM_NAME: "是" }]
                allfds.INT_ORG.FIELD_DICT_NAME = _this.groupDatas.ORG_INFO.CUST_ACCT_INFO[0].FIELDS["CUST_ORG_CODE"].FIELD_DICT_NAME
                for (let fk in allfds) {
                    allfds[fk].FIELD_TYPE = "normalText";
                }
            }

        }
        //重新解析历史数据
        this.openBizOrgInfoNodeLoadBizData(_this, _this.historyData)
    },
    /*
    *@method openBizOrgInfoNodeBeforeSave
    *@desc 钩子函数 自定义保存数
    *@MethodAuthor  linsc
    *@Date: 2019-06-11 15:19:09
    */
    openBizOrgInfoNodeBeforeSave: async function (_this, params) {
        // 客户基本信息
        let orgBasicInfo = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "ORG_BASIC_INFO");
        //如果是机构开户，客户基础信息模块的注册资金为万元，需要除以10000 转为元存到流水里
        let registerFund = orgBasicInfo.REGISTER_FUND;
        orgBasicInfo.REGISTER_FUND = registerFund ? utils.multi(parseInt(registerFund), 10000) : 0;

        // 客户其他信息
        let orgOtherInfo = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "ORG_OTHER_INFO");

        //开户时，需要把客户资料保存到sessionStorage里和客户资料里
        //机构开户 需要保存法人类型在最外层 不然获取不到法人相关的影像
        let custInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO) || {};
        let userInfo = _this.$storage.getJsonSession(_this.$definecfg.USER_INFO) || {};
        
        custInfo = _.extend({}, custInfo, orgBasicInfo, orgOtherInfo);
        custInfo["INT_ORG"] = userInfo["ORG_CODE"];
        custInfo["ORG_FULL_NAME"] = userInfo["ORG_FULL_NAME"];
        custInfo["USER_TYPE"] = _this.userType;
        custInfo["USER_FNAME"] = custInfo["CUST_FNAME"];
        if (_this.userType == "1" || _this.userType == "2") {
            custInfo["CUST_ORG_NAME"] = userInfo["ORG_FULL_NAME"];
        }
        _this.$storage.setSession(_this.$definecfg.CUSTOMER_INFO, custInfo);
        //传生成的或者历史流水中复用的客户代码（CUST_CODE）
        if ("CUST_CODE" in _this.historyData || "CUST_CODE" in params) {
            custInfo["CUST_CODE"] = _this.historyData["CUST_CODE"]; // 如果历史流水中有生成的客户代码，直接复用
        } else {
            let res = await openBizPubTools.getNewCustCode(_this);
            if (res.Code == "0") {
                params["CUST_CODE"] = res.Data && res.Data[0] && res.Data[0].USER_CODE || "";
                custInfo["CUST_CODE"] = res.Data && res.Data[0] && res.Data[0].USER_CODE || "";
                console.log("生成新的客户号", params["CUST_CODE"]);
            } else {
                console.error("生成客户号,接口报错", res.Msg);
                throw "生成客户号,接口报错" + res.Msg
            }
        }
        // 基本信息最终要保存的所有数据的结构
        let returnObj = {
            USER_TYPE: custInfo.USER_TYPE,
            ORG_CODE: userInfo.ORG_CODE,            // 取柜台所属营业部
            CUST_CODE: custInfo.CUST_CODE,
            OP_REMARK: custCodeCreateInfo.OP_REMARK, // todo liu 
            CUST_FNAME: orgBasicInfo.CUST_FNAME,
            CUST_NAME: orgBasicInfo.CUST_NAME,
            USER_CODE: custInfo.CUST_CODE,//用来覆盖流程中的柜员信息值  且填银河影像表单的数据
            USER_FNAME: orgBasicInfo.CUST_FNAME,//用来覆盖流程中的柜员信息值 且填银河影像表单的数据
            USER_NAME: orgBasicInfo.CUST_NAME,//用来覆盖流程中的柜员信息值 且填银河影像表单的数据
            ID_TYPE: orgBasicInfo.ID_TYPE,
            ID_CODE: orgBasicInfo.ID_CODE,
            CUST_ORG_NAME: userInfo.ORG_NAME,
            PROF_INVESTOR_SOURCE: orgBasicInfo.PROF_INVESTOR_SOURCE,
            SIGN_DATE: date.getClientDate("yyyyMMdd"), //用于填充影像模板
            PROF_EXP_DATE: orgBasicInfo.PROF_INVESTOR_SOURCE === "10" ? "30001231" : "",
            // 法人类别
            LEGAL_REP_TYPE: orgOtherInfo.LEGAL_REP_TYPE,
            AGE: orgBasicInfo.AGE,
            // 机构类别
            SZORG_TYPE: orgOtherInfo.SZORG_TYPE,
            ORG_INFO: {
                // 合并基本信息和其他信息
                ORG_BASIC_INFO: Object.assign({}, orgBasicInfo, orgOtherInfo),
                ORG_IMPORT_INFO: orgImportInfo,
                ORG_LINK_INFO: orgLinkInfo,
                ORG_OPEN_TEMPLATE: _this.oppBusiData.OPEN_TEMPLATE
            },
            CSDC_ORG_CHECK_INFO: orgBasicInfo.CSDC_ORG_CHECK_INFO, // 中登机构信息核查数据，用于回填下一节点的法人信息
            AML_FLAG: _this.oppBusiData.AML_FLAG,//是否启用反洗钱功能
            APPO_INFO: _this.oppBusiData.APPO_INFO,
            APPT_SERIAL_NO: _this.oppBusiData.APPT_SERIAL_NO,
            // 主体身份
            SUBJECT_IDENTITY: orgOtherInfo.SUBJECT_IDENTITY,
            INOUTSIDE_IDENTITY: orgOtherInfo.INOUTSIDE_IDENTITY,
            CHANGE_NATION_ATTR: _this.oppBusiData.CHANGE_NATION_ATTR,   //国有属性标志
            custCsdcInfo: _this.oppBusiData.custCsdcInfo,
            AML_CUST_TYPE: orgOtherInfo.AML_CUST_TYPE || ""//反洗钱客户类型 放在最外层用于表单配置
        };
        Object.assign(params, returnObj);
    },
    /*
    *@method openBizOrgInfoNodeValidate
    *@desc 钩子函数 下一步验证
    *@MethodAuthor  linsc
    *@Date: 2019-06-11 15:19:09
    */
    openBizOrgInfoNodeValidate: function (_this) {
        if (_this.moduleId.indexOf("ORG_IMPORT_INFO") != -1) {
            // 境内机构客户，国税与地税信息两类中必填其中一类
            let idTypeVal = _this.groupDatas["ORG_INFO"]["ORG_BASIC_INFO"][0]["FIELDS"]["ID_TYPE"].DEFAULT_VALUE,
                importfs = _this.groupDatas["ORG_INFO"]["ORG_IMPORT_INFO"][0]["FIELDS"];
            if (idTypeVal != "14") {
                if (!((importfs["BUSINESS_TAX_NO"].DEFAULT_VALUE !== "" && importfs["TAX_NO_EXP_DATE"].DEFAULT_VALUE !== "")
                    || (importfs["LAND_TAX_NO"].DEFAULT_VALUE !== "" && importfs["LAND_TAX_NO_EXP_DATE"].DEFAULT_VALUE !== ""))) {
                    _this.$blMethod.showMsgBox(_this, "境内机构客户，国税与地税信息两类中必填其中一类")
                    return false;
                }
            }
        }
        return true;
    },

    /*
    *@method openBizOrgInfoNodeGetData
    *@desc 拼接数据
    *@MethodAuthor  linsc
    *@Date: 2019-06-11 15:19:09
    */
    openBizOrgInfoNodeGetData: function (_this, params) {
        //手动转换为VTM数据
        //把客户其他信息合并到客户基础信息模块里
        let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
        if (_this.groupId == "ORG_INFO") {
            console.log("cusinfo", customerInfo);
            console.log("customerInfo.CUST_FNAME", customerInfo.CUST_FNAME);
            let custInfo = {
                ORG_BASIC_INFO: [{
                    CUST_FNAME: customerInfo.CUST_FNAME,
                    CUST_NAME: utils.cutCustFullName(customerInfo.CUST_FNAME),
                    ID_TYPE: customerInfo.ID_TYPE,
                    ID_CODE: customerInfo.ID_CODE
                }],
                // CUST_LINK_INFO:[{}]
            }
            params = _.merge(params, { "ORG_INFO": custInfo })
            let custFname = customerInfo.USER_FNAME || customerInfo.CUST_FNAME
            //将数据保存到客户信息里
            params["CUST_CODE"] && _this.$blMethod.saveCustInfoTosession(_this, "CUST_CODE", params["CUST_CODE"])
            params["CUST_CODE"] && _this.$blMethod.saveCustInfoTosession(_this, "CUACCT_CODE", params["CUST_CODE"])
            params.CUST_ORG_CODE && _this.$blMethod.saveCustInfoTosession(_this, "CUST_ORG_CODE", params["CUST_ORG_CODE"])
            params.CUST_ORG_CODE && _this.$blMethod.saveCustInfoTosession(_this, "INT_ORG", params["CUST_ORG_CODE"])
            params.CUST_ORG_NAME && _this.$blMethod.saveCustInfoTosession(_this, "CUST_ORG_NAME", params["CUST_ORG_NAME"])
            params.ORG_INFO.ORG_BASIC_INFO[0].CUST_NAME = utils.cutCustFullName(params.ORG_INFO.ORG_BASIC_INFO[0].CUST_FNAME)
            _this.$blMethod.saveCustInfoTosession(_this, "CUST_NAME", params.ORG_INFO.ORG_BASIC_INFO[0].CUST_NAME)
            params = _.merge(params, basseData);
            params = _.merge(params, {
                RELA_INFO: {
                    CUST_CONTROLLER_INFO: params.ORG_INFO.CUST_CONTROLLER_INFO,
                    CUST_BENEFICIARY_INFO: params.ORG_INFO.CUST_BENEFICIARY_INFO,
                    CUST_GUARDIAN_INFO: {},
                    CUST_ACCOUNT_MANAGER_INFO: {},
                    CUST_OTHER_LINK_INFO: {},
                }
            })
        }
    },

    /*
    *@method openBizOrgInfoNodePageActivated
    *@desc 钩子函数：页面激活
    *@MethodAuthor  linsc
    *@Date: 2019-06-11 15:19:09
    */
    openBizOrgInfoNodePageActivated: function (_this, groupId) {
        console.log("openBizOrgInfoNodePageActivated")
        if (groupId === "ORG_INFO") {
            if (_this.groupDatas["ORG_INFO"]["ORG_BASIC_INFO"]) {
                _this.groupDatas["ORG_INFO"]["ORG_BASIC_INFO"][0]["FIELDS"]["ID_TYPE"].FIELD_DICT_FILTER = _this["oppBusiData"]["VALID_ID_TYPE_FOR_ORG"];
                //隐藏证件地址 发证机关的下拉框
                _this.groupDatas["ORG_INFO"]["ORG_BASIC_INFO"][0]["FIELDS"]["ID_ADDR"]["showAddrSelector"] = false;
                _this.groupDatas["ORG_INFO"]["ORG_BASIC_INFO"][0]["FIELDS"]["ID_ISS_AGCY"]["showAddrSelector"] = false;
            }
        }
    },
    /**
    * openBizOrgInfoNodeLoadBizData 数据解析或回填
    * @param _this
    */
    openBizOrgInfoNodeLoadBizData: async function (_this, busiData) {
        if (!busiData || _.isEmpty(busiData)) {
            return;
        }
        //由于涉税信息模块与控制人涉税信息模块 提交的数据结构与配置的字段结构不同，所以加载历史数据之前要先处理一下
        if ((_this.userType == "1" || _this.userType == "2") && busiData["APPR_INFO"] && busiData["APPR_INFO"]["ORG_TAX_INFO"]) {
            //还原机构户的客户涉税的子模块 税收居民国/地区模块信息
            let orgTaxInfo = _.cloneDeep(busiData["APPR_INFO"]["ORG_TAX_INFO"][0]);
            if (orgTaxInfo) {
                busiData["APPR_INFO"]["ORG_TAX_COUNTRY_INFO"] = transTaxInfoToArr(orgTaxInfo);
                busiData["APPR_INFO"]["TAX_ASSET_INFO"] = transTaxAssetInfoToArr(orgTaxInfo, _this);
                if (busiData["APPR_INFO"]["TAX_ASSET_INFO"].length == 0) {
                    busiData["APPR_INFO"]["TAX_ASSET_INFO"].push({});
                }
                //手动还原资产信息第一个分组的 
                busiData["APPR_INFO"]["TAX_ASSET_INFO"][0]["MONAMNT"] = busiData["RELA_INFO"]["ORG_TAX_INFO"][0]["MONAMNT"]
                busiData["APPR_INFO"]["TAX_ASSET_INFO"][0]["CURR_CODE"] = busiData["RELA_INFO"]["ORG_TAX_INFO"][0]["CURR_CODE"]
            }
            //如果存在控制人涉税也要同样处理
            if (busiData["APPR_INFO"]["ORG_TAX_INFO"].length > 1) {
                //还原机构户的实际控制人涉税的子模块 税收居民国/地区模块信息
                let contrlOrgTaxCountryInfo = _.cloneDeep(busiData["RELA_INFO"]["ORG_TAX_INFO"][1]);
                busiData["APPR_INFO"]["CONTROL_ORG_TAX_INFO"] = [];
                busiData["APPR_INFO"]["CONTROL_ORG_TAX_INFO"].push(contrlOrgTaxCountryInfo);
                if (contrlOrgTaxCountryInfo) {
                let taxCountryInfo = transTaxInfoToArr(contrlOrgTaxCountryInfo);
                    busiData["APPR_INFO"]["CONTROL_ORG_TAX_COUNTRY_INFO"] = taxCountryInfo;
                }
                //删掉多余数据
                busiData["APPR_INFO"]["ORG_TAX_INFO"].splice(1, 1);
            }
            //如果是移动平台 gk=“ARRP_INFO" 需要把涉税几个模块跟诚信记录从RELA_INFO分组移动到"APPR_INFO"里
            //复制适当性里的涉税信息和诚信记录到关联信息分组
            let modIds = ["ORG_TAX_INFO", "ORG_TAX_COUNTRY_INFO", "CONTROL_ORG_TAX_COUNTRY_INFO", "CONTROL_ORG_TAX_INFO", "CREDIT_RECORD_INFO", "TAX_ASSET_INFO"];
            if (busiData["APPR_INFO"]) {
                busiData["APPR_INFO"] = {}
                modIds.map(function (v) {
                    if (busiData["APPR_INFO"][v]) {
                        busiData[gk][v] = _.cloneDeep(busiData["APPR_INFO"][v]);
                        delete busiData["APPR_INFO"][v]
                    }
                });
            }
        }
        _this.historyData = Object.assign(_this.historyData, busiData);
      
        _this.oppBusiData.CUST_CODE = busiData.CUST_CODE;
        _this.oppBusiData.CUST_ORG_CODE = busiData.CUST_ORG_CODE;
        //加载流水
        let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
        //手动转换为VTM数据
        let custOtherInfo = {};
        let custOtherIdInfo = {}
        if (busiData.ORG_INFO && busiData.ORG_INFO.ORG_BASIC_INFO) {
            custOtherInfo = {
                CREDIT_TYPE: busiData.ORG_INFO.ORG_BASIC_INFO[0].CREDIT_TYPE, //诚信记录
                CREDIT_TYPE_EXP: busiData.ORG_INFO.ORG_BASIC_INFO[0].CREDIT_TYPE_EXP, //其他的诚信记录
                EDUCATION: busiData.ORG_INFO.ORG_BASIC_INFO[0].EDUCATION,
                INDUS_TYPE: busiData.ORG_INFO.ORG_BASIC_INFO[0].INDUS_TYPE,
                OCCU_TYPE: busiData.ORG_INFO.ORG_BASIC_INFO[0].OCCU_TYPE,
                POSITION: busiData.ORG_INFO.ORG_BASIC_INFO[0].POSITION,
                CITIZENSHIP: busiData.ORG_INFO.ORG_BASIC_INFO[0].CITIZENSHIP,
                NATIVE_PLACE: busiData.ORG_INFO.ORG_BASIC_INFO[0].NATIVE_PLACE,
                WORKPLACE: busiData.ORG_INFO.ORG_BASIC_INFO[0].WORKPLACE,//工作单位
                INOUTSIDE_IDENTITY: busiData.ORG_INFO.ORG_BASIC_INFO[0].INOUTSIDE_IDENTITY,//境内外标志
                SUBJECT_IDENTITY: busiData.ORG_INFO.ORG_BASIC_INFO[0].SUBJECT_IDENTITY,//主体身份
            }
            custOtherIdInfo = {
                OTHER_ID_TYPE: busiData.ORG_INFO.ORG_BASIC_INFO[0].OTHER_ID_TYPE, //辅助证件类型
                OTHER_ID_CODE: busiData.ORG_INFO.ORG_BASIC_INFO[0].OTHER_ID_CODE, //辅助证件号码
                OTHER_ID_EXP_DATE: busiData.ORG_INFO.ORG_BASIC_INFO[0].OTHER_ID_EXP_DATE,//辅助证件有效期
                OTHER_CUST_NAME: busiData.ORG_INFO.ORG_BASIC_INFO[0].OTHER_CUST_NAME//辅助证件姓名
            }
        }
        let custAcctInfo = {
            CUST_ORG_CODE: busiData.CUST_ORG_CODE || ""
        }
        let vtmData = {
            ORG_INFO: {
                CUST_OTHER_ID_INFO: [custOtherIdInfo],
                CUST_OTHER_INFO: [custOtherInfo],//其他信息模块
                CUST_ACCT_INFO: [custAcctInfo],//账户信息模块
            }
        }
        busiData = _.merge(busiData, vtmData)
        //账户信息模块
        if (busiData.RELA_INFO) {
            //根据实际控制人信息 自动回填 账户实际控制人字段是否为本人
            if (busiData.RELA_INFO && busiData.RELA_INFO.CUST_CONTROLLER_INFO && busiData.RELA_INFO.CUST_CONTROLLER_INFO[0]) {
                busiData.ORG_INFO.CUST_CONTROLLER_INFO = busiData.RELA_INFO.CUST_CONTROLLER_INFO
                busiData.ORG_INFO.CUST_CONTROLLER_INFO[0].IS_MYSELF = busiData.ORG_INFO.CUST_CONTROLLER_INFO[0].ASSOCIATE_NAME == busiData.ORG_INFO.ORG_BASIC_INFO[0].CUST_FNAME ? "1" : "0"
            }
            if (busiData.RELA_INFO && busiData.RELA_INFO.CUST_CONTROLLER_INFO && busiData.RELA_INFO.CUST_BENEFICIARY_INFO[0]) {
                busiData.ORG_INFO.CUST_BENEFICIARY_INFO = busiData.RELA_INFO.CUST_BENEFICIARY_INFO
                busiData.ORG_INFO.CUST_BENEFICIARY_INFO[0].IS_MYSELF = busiData.ORG_INFO.CUST_BENEFICIARY_INFO[0].BENEFICIARY_NAME == busiData.ORG_INFO.ORG_BASIC_INFO[0].CUST_FNAME ? "1" : "0"
            }
        }
        //保存数据到缓存
        if (busiData.ORG_INFO.ORG_BASIC_INFO[0].ID_TYPE == "00" || busiData.ORG_INFO.ORG_BASIC_INFO[0].ID_TYPE == "0s") {
            //身份证跟港澳台居住证，直接根据证件号码计算出生日期跟年龄
            let codeObject = _this.$blMethod.analyzeIDCard(busiData.ORG_INFO.ORG_BASIC_INFO[0].ID_CODE);
            _this.$blMethod.saveCustInfoTosession(_this, "AGE", codeObject.age);
            _this.$blMethod.saveCustInfoTosession(_this, "BIRTHDAY", codeObject.birthDay);
            _this.$blMethod.saveCustInfoTosession(_this, "SEX", codeObject.sex);
        } else if (busiData.ORG_INFO.ORG_BASIC_INFO[0].BIRTHDAY) {
            //其他证件 应该是需要选择出生日期的，根据出生日期计算年龄
            _this.$blMethod.saveCustInfoTosession(_this, "AGE", date.getDifferYears(busiData.ORG_INFO.ORG_BASIC_INFO[0].BIRTHDAY, date.getClientDate()))
        }
        let custFname = busiData.ORG_INFO.ORG_BASIC_INFO[0].CUST_FNAME
        //将数据保存到客户信息里
        busiData["CUST_CODE"] && _this.$blMethod.saveCustInfoTosession(_this, "CUST_CODE", busiData["CUST_CODE"])
        busiData["CUST_CODE"] && _this.$blMethod.saveCustInfoTosession(_this, "CUACCT_CODE", busiData["CUST_CODE"])
        busiData["CUACCT_CODE"] = busiData["CUST_CODE"]
        busiData.CUST_ORG_CODE && _this.$blMethod.saveCustInfoTosession(_this, "CUST_ORG_CODE", busiData["CUST_ORG_CODE"])
        busiData.CUST_ORG_CODE && _this.$blMethod.saveCustInfoTosession(_this, "INT_ORG", busiData["CUST_ORG_CODE"])
        busiData.CUST_ORG_NAME && _this.$blMethod.saveCustInfoTosession(_this, "CUST_ORG_NAME", busiData["CUST_ORG_NAME"])
        _this.$blMethod.saveCustInfoTosession(_this, "CUST_NAME", utils.cutCustFullName(custFname))
        //重新加载转换之后的历史数据
        _this.historyData = busiData;
        return this.openBizOrgInfoNodeParseOldBiz(_this, busiData)
    },

    /**
    * openBizOrgInfoNodeParseOldBiz 重新加载转换之后的历史数据
    * @param _this
    */
    openBizOrgInfoNodeParseOldBiz: function (_this, bdata) { // 解析身份证读卡数据
        console.log("openBizOrgInfoNodeParseOldBiz==========开始")
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
                                    if (_this.userType == "1" && fk == "REGISTER_FUND") {
                                        let tval = (typeof (bdd[fk]) === 'object' && Object.prototype.toString.call(bdd[fk]) !== '[object Array]') ? bdd[fk]["newVal"] : bdd[fk];
                                        mdd["FIELDS"][fk]["DEFAULT_VALUE"] = utils.divide(tval, 10000);
                                    } else {
                                        //需要根据数据类型来赋值
                                        mdd["FIELDS"][fk]["DEFAULT_VALUE"] = (typeof (bdd[fk]) === 'object' && Object.prototype.toString.call(bdd[fk]) !== '[object Array]') ? bdd[fk]["newVal"] : bdd[fk];
                                    }
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
        console.log("openBizOrgInfoNodeParseOldBiz==========结束")
    },
    //--------------------------------------------------检查逻辑--------------------------------------------------

    //证件号码的关联逻辑，检查黑名单和重复开户
    "CHECK_CUST_INFO": (_this, field, fieldData) => {
        
    },
    /**
        *【CHECK_ID_CODE】证件号码相关逻辑
        * a)证件类型为“身份证”时，根据号码自动计算出性别、出生日期，且为不可编辑状态，自动填充主体身份，可编辑
        * b)有效证明文件为18位或24位“工商营业执照”时，《重要信息》组中“组织机构代码证”及对应的“有效期”自动填充且不可编辑，其他的都可编辑
        * c)有效证明文件为18位或24位“工商营业执照”时，《重要信息》组中自动填充“国税登记号码”及“有效期”且不可编辑。若为15位账号，“组织机构代码证税务登记号码”由其手动录入，必填
        */
    "CHECK_ID_CODE": (_this, field, fieldData) => {
        console.log("ID_CODE--------------");

    },
    "CHECK_ID_TYPE": (_this, field, fieldData) => {
        // 选择了证件类型 通过证件类型以及开户逻辑过滤"SUBJECT_IDENTITY,INOUTSIDE_IDENTITY,LEGAL_REP_TYPE,SZORG_TYPE,CITIZENSHIP"的字典项
        let dictFilter = filterOpenLogicData(_this, {
            ID_TYPE: field.DEFAULT_VALUE
        });
        let loadWhichDataArr = "SUBJECT_IDENTITY,INOUTSIDE_IDENTITY,LEGAL_REP_TYPE,SZORG_TYPE,CITIZENSHIP";
        // 避免入参空值
        if (!loadWhichDataArr) {
            loadWhichDataArr = loadWhichDataArr || [];
        } else if (_.isString(loadWhichDataArr)) {
            loadWhichDataArr = loadWhichDataArr.split(",");
        }
        // 修改需要重新加载数据的表单
        _.each(loadWhichDataArr, function (key) {
            let moduleId;
            if (key == "CITIZENSHIP") {
                moduleId = "ORG_BASIC_INFO";
            } else {
                moduleId = "ORG_OTHER_INFO";
            }
            _this.groupDatas.ORG_INFO[moduleId][0].FIELDS[key].FIELD_DICT_FILTER = dictFilter[key];
            if (dictFilter[key].length == 1) {
                _this.groupDatas.ORG_INFO[moduleId][0].FIELDS[key].DEFAULT_VALUE = dictFilter[key][0];
                _this.groupDatas.ORG_INFO[moduleId][0].FIELDS[key].FIELD_CONTROL = "2";
            } 
        });
    },
    /*
        * CHECK_ID_BEG_DATE 证件开始日期
        * 1.增加选择证件开始日期把注册日期同时填写上
        */
    "CHECK_ID_BEG_DATE": (_this, field, fieldData) => {
        
    },
    /*
    * CHECK_AML_CUST_TYPE#反洗钱客户类型
    */
    "CHECK_AML_CUST_TYPE": (_this, field, fieldData) => {
        
    },
    /*
    * CHECK_INDUS_SUB#行业大类：
    */
    "CHECK_INDUS_GB": (_this, field, fieldData) => {
        
    },
    /**
     * CHECK_NATIONAL_ATTR  国有属性
     */
    "CHECK_NATIONAL_ATTR": (_this, filed, fieldData) => {
        
    },
    /**
     * 【CHECK_SUBJECT_IDENTITY】主体身份：
     */
    "CHECK_SUBJECT_IDENTITY": (_this, field, fieldData) => {
        
    },
    /**
     * 【CHECK_CUST_FNAME】客户全称
     */
    "CHECK_CUST_FNAME": (_this, field, fieldData) => {
        
    },
    /**
   * 【ID_EXP_DATE】证件结束日期
   */
    "CHECK_ID_EXP_DATE": (_this, field, fieldData) => {
        
    },
    /**
     * 【CHECK_CITIZENSHIP】税收居民国/地区
     */
    "CHECK_CITIZENSHIP": (_this, field, fieldData) => {
        
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
        
    },
    /**
     * 【CHECK_LEGAL_REP_TYPE】法人类别：
     * 
     */
    "CHECK_LEGAL_REP_TYPE": (_this, field, fieldData) => {
        
    },
    /**
     * 【CHECK_INOUTSIDE_IDENTITY】境内外标识：
     *  a)为“境外”时不显示“组织机构代码证、国税登记证和地税登记证信息”。
     */
    "CHECK_INOUTSIDE_IDENTITY": (_this, field, fieldData) => {
        
    },
    /**
    * 地址组件点击使用证件地址
    */
    "USE_ID_ADDRESS__CLICK": (_this, field, fieldData) => {
        if (_this.userType == "1" || _this.userType == "2") {
            if ("ID_ADDR" in _this.groupDatas["ORG_INFO"]["ORG_BASIC_INFO"][0].FIELDS) {
                field.DEFAULT_VALUE = _this.groupDatas["ORG_INFO"]["ORG_BASIC_INFO"][0].FIELDS["ID_ADDR"].DEFAULT_VALUE;
            }
        }
        if (fieldData.ZIP_CODE && field.ZIP_CODE) {
            fieldData.ZIP_CODE.DEFAULT_VALUE = field.ZIP_CODE;
        }
    },
    // 点击添加模块按钮
    "addModule": (_this, moduleld, fieldData) => {
        if (moduleld == "CREDIT_RECORD_INFO") {
            //自定义 诚信记录 添加模块 检查逻辑
            if (fieldData.RECORD_SOURCE.DEFAULT_VALUE === "") {
                _this.$vux.alert.show({
                    content: "请填写完已有记录再添加！"
                })
                return false;
            } else {
                return true;
            }
        } else if (moduleld == "ORG_PARTNER_INFO") {
            //自定义 合伙人 添加模块 检查逻辑
            for (let fk in fieldData) {
                if (fieldData[fk] == "") {
                    _this.$vux.alert.show({
                        content: "请填写完整的合伙企业资料！"
                    })
                    return false;
                }
            }
            return true;
        }
        return true;
    },
    /*
     *@method CHECK_NORMAL_BUTTON__CLICK
     *@desc 普通按钮点击事件
     *@MethodAuthor  linsc
     *@Date: 2019-07-16 10:52:58
    */
    "CHECK_NORMAL_BUTTON__CLICK": (_this, field, fieldData) => {
    },
    /**
     * 地址组件触发函数
     */
    "USE_ID_ADDRESS": (_this, field, fieldData) => {
        if (fieldData.ZIP_CODE && "ZIP_CODE" in field) {
            fieldData.ZIP_CODE.DEFAULT_VALUE = field.ZIP_CODE;
        }
    },
    /**
     * 办公地址组件触发函数
     */
    "CHECK_OFFICE_ADDR": (_this, field, fieldData) => {
        if (fieldData.ZIP_CODE && "ZIP_CODE" in field) {
            //如果正在加载历史流水数据不能清除
            fieldData.ZIP_CODE.DEFAULT_VALUE = field.ZIP_CODE;
        }
    },
    /**
     * 与某个模块保持一致单选按钮
     */
    "CHECK_MODULE_RADIO": (_this, field, fieldData) => {
        if (field.DEFAULT_VALUE !== "true") {
            for (let fk in fieldData) {
                if (fk != "MODULE_RADIO_BUTTON") {
                    fieldData[fk].DEFAULT_VALUE = "";
                    fieldData[fk].FIELD_CONTROL = fieldData[fk].FIELD_CONTROL == "1" ? "1" : "0";
                }
            }
            return;
        }
        if (_this.userType == '1') {
            if (field.MODULE_ID == "ORG_CONTROLER_INFO") {
                // 实际控制人信息与法定代表人信息一致
                let legalrep_info = _this.groupDatas["RELA_INFO"]["ORG_LEGAL_REP_INFO"][0]["FIELDS"];
                // 名称、证件类型、证件号码、证件有效期 不可编辑
                fieldData["CONTROLER_NAME"].DEFAULT_VALUE = legalrep_info["LEGAL_REP"].DEFAULT_VALUE;
                fieldData["CONTROLER_ID_TYPE"].DEFAULT_VALUE = legalrep_info["LEGAL_REP_ID_TYPE"].DEFAULT_VALUE;
                fieldData["CONTROLER_ID_NO"].DEFAULT_VALUE = legalrep_info["LEGAL_REP_ID_CODE"].DEFAULT_VALUE;
                fieldData["CONTROLER_ID_EXP_DATE"].DEFAULT_VALUE = legalrep_info["LEGAL_REP_ID_EXP_DATE"].DEFAULT_VALUE;
                fieldData["CONTROLER_NAME"].FIELD_CONTROL = "2";
                fieldData["CONTROLER_ID_TYPE"].FIELD_CONTROL = "2";
                fieldData["CONTROLER_ID_NO"].FIELD_CONTROL = "2";
                fieldData["CONTROLER_ID_EXP_DATE"].FIELD_CONTROL = "2";
            } else if (field.MODULE_ID == "ORG_STOCKHOLDER_INFO") {
                // 控股股东信息与法定代表人信息一致
                openBizPubTools.syncOrgLegalRepInfo(_this);
            } else if (field.MODULE_ID == "ORG_BENEFICIARY_INFO" || field.MODULE_ID == "ORG_BENEFICIARY_ALL_INFO") {
                // 受益人信息，受益人所有人信息与实际控制人信息一致
                let controlerInfo = _this.groupDatas["RELA_INFO"]["ORG_CONTROLER_INFO"][0]["FIELDS"];
                // 名称、证件类型、证件号码、证件有效期 不可编辑
                fieldData["BENEFICIARY_NAME"].DEFAULT_VALUE = controlerInfo["CONTROLER_NAME"].DEFAULT_VALUE;
                fieldData["BENEFICIARY_ID_TYPE"].DEFAULT_VALUE = controlerInfo["CONTROLER_ID_TYPE"].DEFAULT_VALUE;
                fieldData["BENEFICIARY_ID"].DEFAULT_VALUE = controlerInfo["CONTROLER_ID_NO"].DEFAULT_VALUE;
                fieldData["BENEFICIARY_EXP_DATE"].DEFAULT_VALUE = controlerInfo["CONTROLER_ID_EXP_DATE"].DEFAULT_VALUE;
                fieldData["BENEFICIARY_TEL"].DEFAULT_VALUE = controlerInfo["CONTROLER_TEL"].DEFAULT_VALUE;

                fieldData["BENEFICIARY_NAME"].FIELD_CONTROL = "2";
                fieldData["BENEFICIARY_ID_TYPE"].FIELD_CONTROL = "2";
                fieldData["BENEFICIARY_ID"].FIELD_CONTROL = "2";
                fieldData["BENEFICIARY_EXP_DATE"].FIELD_CONTROL = "2";
                fieldData["BENEFICIARY_TEL"].FIELD_CONTROL = "2";
            } else if (field.MODULE_ID == "ORG_BENEFICIARY_OWNER_INFO") {
                //受益所有人信息与实际控制代表信息一致
                let module1 = _this.groupDatas["RELA_INFO"]["ORG_CONTROLER_INFO"];
                let module2 = _this.groupDatas["RELA_INFO"]["ORG_BENEFICIARY_OWNER_INFO"];
               openBizPubTools.syncModule1Tomodule2(_this, module1, module2, "CONTROLER", "BENEFICIARY", [], [["CONTROLER_ID_NO", "BENEFICIARY_ID"], ["CONTROLER_ID_EXP_DATE", "BENEFICIARY_EXP_DATE"]]);
            } else if (field.MODULE_ID == "ORG_AML_INFO") {
                // //反洗钱专有模块信息与实际控制代表信息一致
                let module1 = _this.groupDatas["RELA_INFO"]["ORG_CONTROLER_INFO"];
                let module2 = _this.groupDatas["RELA_INFO"]["ORG_AML_INFO"];
                openBizPubTools.syncModule1Tomodule2(_this, module1, module2, "CONTROLER", "", [], [["CONTROLER_NAME", "USER_NAME"], ["CONTROLER_ID_NO", "ID_CODE"]]);
            }
        }
    },
}