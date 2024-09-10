/*
 *   机构基本信息模块
 *  
 */

import * as util from "../../../../../../../tools/util"
import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../../business/businessTools/bizPublicMethod.js"
import custInfoModel from "../../common/cust-info-model"
import custService from '../../../../../../../service/cust-service.js'
import date from '../../../../../../../tools/date.js'

const WRONG_ID_CODE_TIP_KEY = "wrongIdCode";

const AUTOFILL_CITIZENSHIP_TIP_KEY = "autoFillCitizenship";

const AUTOFILL_ORG_ID_CODE_TIP_KEY = "autoFillOrgIdCode";

const NATIONAL_ATTR_CHANGED_WARNING_TIP_KEY = "nationalAttrChanged";

const SPECIAL_ORG_TYPE_TIP_KEY = "specialOrgType";

const SPECIAL_ORG_TYPE_TIP_TITLE = "您属于特殊机构，请提供证券账户开户办理确认单。";

/**
 * 法定代表人、执行事务合伙人要去掉的证件类型：军官证、士兵证、户口本、台胞证、解放军文职干部、武警文职干部、
 * 社会保障号、文职证、警官证
 */
const LEGAL_REP_EXCLUDE_ID_TYPES = ["02", "03", "04", "05", "07", "0a", "0f", "0g", "0h"];

/**
 * 机构开户动态准入中的“特殊机构”
 */
const SPECIAL_ORG_TYPES = ["10", "11", "12", "13", "61", "14", "19", "41"];

/**
 * 投资者为“专业投资者”的机构类别
 */
const PROFESSIONAL_INVESTOR_ORG_TYPES = ["10", "11", "12", "13", "14", "62", "19", "25", "25a", "25b", "33", "34", "QH", "63", "61", "64"];

/**
 * 支持的“法人类别”，如果系统内的“法人类别”不在此列，则需要清空
 */
const AVAILABLE_LEGAL_REP_TYPES = ["01", "03", "07", "08"];

/**
 * 支持的“机构类别”，如果系统内的“机构类别”不在此列，则需要清空
 */
const AVAILABLE_SZCORP_TYPES = ["01", "02", "03", "04", "05", "25", "09", "21", "22", "23", "25a", "24", "10", "11", "12", "13", "25b", "14", "19", "61", "62", "63", "64", "QH", "41", "31", "32", "33", "35", "99", "7D"];

/**
 * 行业类型与行业大类的映射关系
 */
const industryMap = {
    "1": "A",
    "2": "B",
    "3": "C",
    "4": "D",
    "5": "E",
    "6": "M",
    "7": "G",
    "8": "F",
    "9": "J",
    "a": "K",
    "b": "L",
    "c": "Q",
    "d": "R",
    "e": "S",
    "f": "I",
    "g": "H",
    "h": "N",
    "i": "O",
    "j": "P",
    "k": "T",
    "l": "S",
}

/**
 * 证件类型与组织机构代码字段控制的映射关系
 */
const ID_TYPE_ORG_ID_CODE_FIELD_CONTROL = {
    "10": "2",
    "11": "0",
    "12": "0",
    "13": "0",
    "14": "1",
    "19": "0",
}

/**
 * 需要展示合伙人信息的机构类型：21-普通合伙企业, 22-特殊普通合伙企业, 23-有限合伙企业,
 * 24-非法人非合伙制创投企业, 25a-私募基金管理人（合伙企业）
 */
const NEEDED_DISPLAYED_PARTNER_INFO_ORG_TYPES = ["21", "22", "23", "24", "25a"];

//开户与非开户 获取机构代码跟机构名称
const getOrgCodeAndOrgName = (_this) => {
    let isOpenAcct = _this.$storage.getSession(_this.$definecfg.IS_OPEN_ACCT_BIZ) || "";
    let userInfo = _this.$storage.getJsonSession(_this.$definecfg.USER_INFO);
    let obj = {
        ORG_CODE: userInfo.ORG_CODE || userInfo.INT_ORG,
        ORG_NAME: userInfo.ORG_NAME
    }
    if (isOpenAcct == "0") {
        let OPEN_ORG_INFO = _this.$storage.getJsonSession(_this.$definecfg.OPEN_ORG_INFO) || {};
        obj.ORG_CODE = OPEN_ORG_INFO.ORG_CODE || "";
        obj.ORG_NAME = OPEN_ORG_INFO.ORG_NAME || "";
    }
    return obj;
}
/**
 * 根据法人类型修改法定代表人的配置信息
 * @param {object} _this 
 * @param {string} legalRepType 
 */
const modifyLegalRepConfigAccordingToLegalType = (_this, legalRepType) => {
    let moduleTitle = "";
    let idTypes = [];
    if (legalRepType == "08") {
        moduleTitle = "执行事务合伙人";
        idTypes = _.union(_this.oppBusiData.individualValidIdTypes, _this.oppBusiData.orgValidIdTypes);
    } else {
        moduleTitle = "法定代表人";
        idTypes = _this.oppBusiData.individualValidIdTypes;
    }
    _this.groupDatas.RELA_INFO.LEGAL_REP_INFO[0].MODULE_TITLE = moduleTitle;
    bizPublicMethod.$blMethod.filterOptionsButRetainHistoryOptions(_this, "RELA_INFO", "LEGAL_REP_INFO",
        "LEGAL_REP_ID_TYPE", idTypes, LEGAL_REP_EXCLUDE_ID_TYPES, custInfoModel.getOriginaOrgLegalRepInfo(_this.oppBusiData.oldBusiData));
}

/**
 * 去掉字符串两端的空格
 * @param {string} s 
 */
const myTrim = (s) => {
    return typeof s == "string" ? s.trim() : s; 
}

const checkIdTypeChange = (_this) => {
    let originalIdType = _.get(custInfoModel.getOriginaOrgBasicInfoByOrg(_this.oppBusiData.oldBusiData), "ID_TYPE", "");
    let originalCitizenship = _.get(custInfoModel.getOriginaOrgBasicInfoByOrg(_this.oppBusiData.oldBusiData), "CITIZENSHIP", "");
    if (_.isEmpty(originalIdType) || _.isEmpty(myTrim(originalCitizenship))) {
        return;
    }
    _this.removeFlowTip("checkIdTypeChange");
    let currentIdType = _this.groupDatas.ORG_INFO.DOC_INFO[0].FIELDS.ID_TYPE.DEFAULT_VALUE;
    let idTypeDict = _this.groupDatas.ORG_INFO.DOC_INFO[0].FIELDS.ID_TYPE.FIELD_DICT_NAME;
    let originalIdTypeText = _.get(_.find(idTypeDict, obj => {return obj.DICT_ITEM == originalIdType;}), "DICT_ITEM_NAME", "");
    let currentIdTypeText = _.get(_.find(idTypeDict, obj => {return obj.DICT_ITEM == currentIdType;}), "DICT_ITEM_NAME", "");
    // 如果证件类型对应的注册国家由境外改为境内，或境内改为境外，则需要同步注册国家，应提醒前往柜台办理
    if ((originalCitizenship != "CHN" && ["10", "11", "12", "13"].indexOf(currentIdType) != -1) ||
    (currentIdType == "14" && ["10", "11", "12", "13"].indexOf(originalIdType) != -1)) {
        _this.pushFlowTip({
            title: "您机构的证件类型由“"+ originalIdTypeText +"”修改为“"+ currentIdTypeText +"”，需同步变更注册国家信息，请您前往柜台办理。",
            key: "checkIdTypeChange",
            type: 'error'
        })
    }
}

/**
 * 三要素修改后的校验
 * @param {object} _this 
 * @returns 
 */
const checkCustThreeEle = (_this) => {
    if (_.isEmpty(_this.oppBusiData.oldBusiData)) {
        return;
    }
    let isChangeThreFlag = isChangeThree(_this);
    //关联关系
    _this.removeFlowTip("checkThreeRelation");
    if (isChangeThreFlag && _this.oppBusiData.parentRelationFlag != undefined &&!_this.oppBusiData.parentRelationFlag) {
        _this.pushFlowTip({
            title: "您的证券账户关联关系未确认，不允许变更名称、证件类型/证件号码" + (_this.userType == "1" ? "、组织机构代码" : "") + "，若需变更，请先进行关联关系确认。",
            key: "checkThreeRelation",
            type: 'error',
            buttonText: "关联关系确认",
            isShowButton: true,
            buttonFn: () => {
                _this.$storage.removeSession(_this.$definecfg.B_SNO);
                _this.$storage.removeSession(_this.$definecfg.EVALUATE_SN); 
                let menuObj = _this.$storage.getJsonSession(_this.$definecfg.ALL_MENU).find(o => o.BUSI_CODE == "V0007") || {};
                _this.$store.commit(_this.$types.UPDATE_MENU_NAME, menuObj && menuObj.MENU_NAME);
                _this.$storage.setSession(_this.$definecfg.BUSI_NAME, menuObj && menuObj.MENU_NAME);
                _this.$router.replace({ name: 'customerCheck', params: { busiCode: "V0007", userType: _this.userType } });
            }
        })
        return true;
    }
    //银河信息
    _this.removeFlowTip("checkThreeBank");
    if(isChangeThreFlag && _this.oppBusiData.isBankTip) {
        _this.pushFlowTip({
            title: "您账户绑定的存管银行不支持在券商端修改银行账户的关键信息，请您稍后前往银行柜台进行银行账户资料变更，否则可能影响转账功能。",
            key: "checkThreeBank",
            type: 'warning'
        })
        return true;
    }
    
}

/**
 * 关联关系确认
 * @param {object} _this 
 * @returns 
 */
const getRelationFlag = (_this) => {
    let relationFlag = true;
    let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
    return _this.$syscfg.K_Request("YG003674", {
        CUST_FNAME: customerInfo.CUST_FNAME,
        ID_TYPE: customerInfo.ID_TYPE,
        ID_CODE: customerInfo.ID_CODE,
        ACCTBIZ_EXCODE: "07",
    }).then( res => {
        let acctList = _.get(res, "Data", []);
        let filterType = ["11", "12", "13", "21", "22", "23"];                
        _.each(acctList, acctListItem => {
            let relatFlag = acctListItem.RELATION_FLAG;
            let acctType = acctListItem.ACCT_TYPE;
            let status = acctListItem.ACCT_STATUS;
            let unqualiFlag = acctListItem.UNQUALI_FLAG;
            //(0)去掉已确认的(1)过滤交易账户类型的，(2)证券账户状态不为注销、休眠,(3)过滤掉不合格账户
            if (relatFlag != "1" && filterType.indexOf(acctType) > -1 && ["4", "9"].indexOf(status) == -1 && unqualiFlag == "0") {
                let range1 = /^F97[\w]+$/;  //基金的配号为F97XXXXXXX.
                let range2 = /^F[5-9]{1}[\w]+$/;//基金配号的区间F500000000-F999999999
                let range3 = /(^05[\w]+$)|(^001[6-9]{1}[\w]+$)|(^04[\w]+$)/;//基金配号05xxxxxxxx 001[6-9]xxxxxx 增加 04xxxxxxxx段配号账户不需要做关联关系确认
                let range4 = /(^F[5-9]{1}[\w]+$)|(^F0[\w]+$)/;  //广州证券个性专用：基金的配号为F97XXXXXXX.F0XXXXXX开头
                let trdAcct = acctListItem.TRDACCT;
                if(acctType == "13"){//沪市
                    if(!range2.test(trdAcct) || range1.test(trdAcct)){
                        relationFlag = false;
                        return false;
                    }
                    return true;
                }
                if(acctType == "23"){//深市
                    let interval = [
                        [10100000, 10834330],
                        [10834332, 10999999],
                        [13100000, 13880784],
                        [13880786, 13999999],
                        [14000000, 14716490],
                        [14716492, 14999999],
                        [16000000, 19999999]];
                    let matchFlag = false;
                    if(range3.test(trdAcct)){
                        matchFlag = true;
                    }
                    if(trdAcct.startsWith("001")){
                        let end8 = Number(String(trdAcct).substring(2));
                        _.each(interval, intervalItem => {
                            if (end8 >= intervalItem[0] && end8 <= intervalItem[1]) {
                                matchFlag = true;
                            }
                        })
                    }
                    if(!matchFlag){
                        relationFlag = false;
                        return false;
                    }
                    return true;
                }
                relationFlag = false;
                return false;
            }
        })
        _this.oppBusiData.parentRelationFlag = relationFlag;
        return relationFlag;
    }).catch( err => {
        throw err;
    })
}

/**
 * 银证信息
 * @param {object} _this 
 * @returns 
 */
const getCustBankSignInfo = (_this) => {
    let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
    let userInfo = _this.$storage.getJsonSession(_this.$definecfg.USER_INFO);
    return custService.getCustBankSignInfo(customerInfo.CUST_CODE).then( res => {
        let bankArr = _.get(res, "Data", []);
        if (bankArr.length != 0) {
            let resArr = [];
            _.each(bankArr, item => {
                resArr.push(_this.$syscfg.K_Request("Y3000015", {
                    CURRENCY: item.CURRENCY,
                    EXT_ORG: item.EXT_ORG,
                    INT_ORG: getOrgCodeAndOrgName(_this).ORG_CODE,
                    CUBSB_TRD_ID: "1B", //券商发起，客户资料同步
                    USER_TYPE: "0"
                }))
            })
            return Promise.all(resArr).then( (res2) => {
                _.each(res2, res2Item => {
                    let filterRes = _.filter(_.get(res2Item, "Data", []), item => {
                        return item.CUBSB_TRD_ID == "1B" && item.USER_TYPES.indexOf("0") > -1;
                    })
                    if (_.isEmpty(filterRes)) {
                        _this.oppBusiData.isBankTip = true;//是否需要提醒银行
                        return false;
                    }
                })
            })
        }
    }).catch(err => {
        console.error("getCustBankSignInfo err=", err.toString());
    })
}
/**
 * 校验三要素是否修改了
 * @param {object} _this 
 * @returns 
 */
const isChangeThree = (_this) => {
    let docInfoFields = _this.groupDatas.ORG_INFO.DOC_INFO[0].FIELDS; 
    let idType = _.get(docInfoFields, "ID_TYPE.DEFAULT_VALUE", "");
    let idCode = _.get(docInfoFields, "ID_CODE.DEFAULT_VALUE", "");
    let fname = _.get(docInfoFields, "CUST_FNAME.DEFAULT_VALUE", "");
    let orgIdCode = _.get(docInfoFields, "ORG_ID_CODE.DEFAULT_VALUE", "");
    let orgBasicInfo = custInfoModel.getOriginaOrgBasicInfoByOrg(_this.oppBusiData.oldBusiData);
    let oldType = orgBasicInfo.ID_TYPE || "";
    let oldCode = orgBasicInfo.ID_CODE || "";
    let oldFname = orgBasicInfo.CUST_FNAME || "";
    let oldOrgIdCode = orgBasicInfo.ORG_ID_CODE || "";
    let isChange = idType != oldType || idCode != oldCode || fname != oldFname || orgIdCode != oldOrgIdCode;
    return isChange;
}

const setLinkMobileTelUnrequiredIfOutside = (_this) => {
    let idType = _this.groupDatas.ORG_INFO.DOC_INFO[0].FIELDS.ID_TYPE.DEFAULT_VALUE;
    let citizenship = _this.groupDatas.ORG_INFO.DOC_INFO[0].FIELDS.CITIZENSHIP.DEFAULT_VALUE;
    if (getInoutsideIdentity(_this, idType, citizenship) == "1") {
        _this.groupDatas.LINK_INFO.ORG_LINK_INFO[0].FIELDS.MOBILE_TEL.FIELD_REQUIRED = "0";
    }
}

const isShowPartnerInfoNeeded = (_this) => {
    let orgType = _this.groupDatas.ORG_INFO.SUBJECT_IDENTITY_INFO[0].FIELDS.SZORG_TYPE.DEFAULT_VALUE;
    return NEEDED_DISPLAYED_PARTNER_INFO_ORG_TYPES.indexOf(orgType) > -1;
}

const showPartnerInfoModuleIfNeeded = (_this) => {
    let moduleControl = isShowPartnerInfoNeeded(_this) ? "1" : "0";
    _.each(_this.groupDatas.RELA_INFO.PARTNER_INFO, module => {
        module.MODULE_CONTROL = moduleControl;
    })
    let isOpenAcct = _this.$storage.getSession(_this.$definecfg.IS_OPEN_ACCT_BIZ) || "";
    if (isOpenAcct == "0") {
        //更新路由
        _this.busiLogic.leftUpadateRouter(_this);
    }
}

const backfillHistoryData = (_this) => {
    let orgBasicInfo = _.get(_this.historyData, "ORG_BASIC_INFO");
    let orgImportInfo = _.get(_this.historyData, "ORG_IMPORT_INFO");
    if (!_.isEmpty(orgBasicInfo)) {
        bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["DOC_INFO"], orgBasicInfo);
    }
    if (!_.isEmpty(orgImportInfo)) {
        bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["SUBJECT_IDENTITY_INFO"], orgImportInfo);
    }
}
/**
 * 根据“证件类型”、“注册国家”来修改“机构组织代码”的 FIELD_CONTROL
 * 规则：
 * 1、境外，1-不展示
 * 2、中国，证件类型为 10-营业执照：2-不可编辑；证件类型不为 10-营业执照：参照 ID_TYPE_ORG_ID_CODE_FIELD_CONTROL
 * @param {object} _this 
 */
const modifyOrgIdCodeAccordingToIdTypeAndCitizenship = (_this) => {
    let docInfoFields = _this.groupDatas.ORG_INFO.DOC_INFO[0].FIELDS;
    let idType = docInfoFields.ID_TYPE.DEFAULT_VALUE;
    let citizenship = docInfoFields.CITIZENSHIP.DEFAULT_VALUE;
    if (!_.isEmpty(citizenship) && citizenship != "CHN") {
        docInfoFields.ORG_ID_CODE.FIELD_CONTROL = "1";
        docInfoFields.ORG_ID_EXP_DATE.FIELD_CONTROL = "1";
    } else if (idType == "10") {
        docInfoFields.ORG_ID_CODE.FIELD_CONTROL = "2";
        docInfoFields.ORG_ID_EXP_DATE.FIELD_CONTROL = "2";
    } else {
        docInfoFields.ORG_ID_CODE.FIELD_CONTROL = ID_TYPE_ORG_ID_CODE_FIELD_CONTROL[idType] || "0";
        docInfoFields.ORG_ID_EXP_DATE.FIELD_CONTROL = ID_TYPE_ORG_ID_CODE_FIELD_CONTROL[idType] || "0";
    }
}

const myParseFloat = (s) => {
    let result = parseFloat(s);
    return isNaN(result) ? 0 : result; 
}

/**
 * 如果《开户逻辑配置》中没有该字段中的值就清空字段的 DEFAULT_VALUE
 * @param {object} field 
 * @param {object} fieldOpenLogicData 该字段的开户逻辑配置数据，类型为数组
 */
const clearFieldValueIfNotInOpenLogic = (field, fieldOpenLogicData) => {
    if (_.indexOf(fieldOpenLogicData, field.DEFAULT_VALUE) == -1) {
        field.DEFAULT_VALUE = "";
    }
}

/**
 * 根据《开户信息逻辑配置》，用“证件类型”、“主体身份”、“境内外标识”过滤法人代表选项
 * @param {object} _this 
 */
const filterLegalRepOptionsAccordingToOpenLogic = (_this) => {
    let orgBasicInfo = custInfoModel.getOriginaOrgBasicInfoByOrg(_this.oppBusiData.oldBusiData);
    let idType = _this.groupDatas.ORG_INFO.DOC_INFO[0].FIELDS.ID_TYPE.DEFAULT_VALUE;
    let citizenship = _this.groupDatas.ORG_INFO.DOC_INFO[0].FIELDS.CITIZENSHIP.DEFAULT_VALUE;
    let params = {
        ID_TYPE: idType,
        SUBJECT_IDENTITY: orgBasicInfo.SUBJECT_IDENTITY,
        INOUTSIDE_IDENTITY: getInoutsideIdentity(_this, idType, citizenship)
    }
    let filteredOpenLogicData = bizPublicMethod.$blMethod.filterOpenLogicData(params, _this.oppBusiData.allAcctOpenLogicData);
    let legalRepField = _this.groupDatas.ORG_INFO.SUBJECT_IDENTITY_INFO[0].FIELDS.LEGAL_REP_TYPE;
    legalRepField.FIELD_DICT_FILTER = filteredOpenLogicData.LEGAL_REP_TYPE;
    clearFieldValueIfNotInOpenLogic(legalRepField, filteredOpenLogicData.LEGAL_REP_TYPE);
}

/**
 * 根据《开户信息逻辑配置》，用“证件类型”、“主体身份”、“境内外标识”、“法人代表”过滤机构类别选项
 * @param {object} _this 
 */
const filterOrgTypeOptionsAccordingToOpenLogic = (_this) => {
    let orgBasicInfo = custInfoModel.getOriginaOrgBasicInfoByOrg(_this.oppBusiData.oldBusiData);
    let idType = _this.groupDatas.ORG_INFO.DOC_INFO[0].FIELDS.ID_TYPE.DEFAULT_VALUE;
    let citizenship = _this.groupDatas.ORG_INFO.DOC_INFO[0].FIELDS.CITIZENSHIP.DEFAULT_VALUE;
    let legalRep = _this.groupDatas.ORG_INFO.SUBJECT_IDENTITY_INFO[0].FIELDS.LEGAL_REP_TYPE.DEFAULT_VALUE;
    let params = {
        ID_TYPE: idType,
        SUBJECT_IDENTITY: orgBasicInfo.SUBJECT_IDENTITY,
        INOUTSIDE_IDENTITY: getInoutsideIdentity(_this, idType, citizenship),
        LEGAL_REP_TYPE: legalRep
    }
    let filteredOpenLogicData = bizPublicMethod.$blMethod.filterOpenLogicData(params, _this.oppBusiData.allAcctOpenLogicData);
    let orgTypeFiled = _this.groupDatas.ORG_INFO.SUBJECT_IDENTITY_INFO[0].FIELDS.SZORG_TYPE;
    orgTypeFiled.FIELD_DICT_FILTER = filteredOpenLogicData.SZORG_TYPE;
    _this.$nextTick( () => {
        clearFieldValueIfNotInOpenLogic(orgTypeFiled, filteredOpenLogicData.SZORG_TYPE);
    })
}



/**
 * 根据“机构类别”修改“私募基金管理人编码”字段配置 
 * @param {object} _this 
 * @param {string} orgType 
 */
const modifySmfundManagerFieldConfigAccordingToOrgType = (_this, orgType) => {
    let smfundManagerField = _this.groupDatas.ORG_INFO.SUBJECT_IDENTITY_INFO[0].FIELDS.SMFUND_MANAGER_ID;
    if (_.indexOf(["25","25a","25b"], orgType) != -1) {
        smfundManagerField.FIELD_REQUIRED = "1";
        smfundManagerField.FIELD_CONTROL = "0";
    } else {
        smfundManagerField.FIELD_REQUIRED = "0";
        smfundManagerField.FIELD_CONTROL = "1";
    }
}


/**
 * 系统内是否存在某个数据
 * @param {object} _this 
 * @param {object} certainData 
 * @param {object} systemOrgData 系统数据(可不传)
 * @returns boolean 
 */
const isSystemOrgDataContainsCertainData = (_this, certainData, systemOrgData) => {
    if (systemOrgData == undefined) {
        systemOrgData = custInfoModel.getOriginaOrgBasicInfoByOrg(_this.oppBusiData.oldBusiData);
    }
    return !_.isEmpty(myTrim(systemOrgData[certainData]));
}


/**
 * 判断字段是否没有改变
 * @param {object} field 字段对象
 */
const isFieldValueNotChanged = (field) => {
    return field.LAST_DEFAULT_VALUE == field.DEFAULT_VALUE;
}

/**
 * 根据《开户逻辑配置》获取境内外标识
 * @param {object} _this 
 * @param {string} idType 证件类型
 * @param {string} citizenship 注册国家
 */
const getInoutsideIdentity = (_this, idType, citizenship) => {
    let params = {
        ID_TYPE: idType,
        CITIZENSHIP: citizenship
    }
    let filteredOpenLogicData = bizPublicMethod.$blMethod.filterOpenLogicData(params, _this.oppBusiData.allAcctOpenLogicData);
    if (filteredOpenLogicData.INOUTSIDE_IDENTITY.length == 1 && 
        filteredOpenLogicData.INOUTSIDE_IDENTITY[0] == "0") {
        return "0";
    } else if (filteredOpenLogicData.INOUTSIDE_IDENTITY.length == 1 && 
        filteredOpenLogicData.INOUTSIDE_IDENTITY[0] == "1") {
        return "1";
    }
}

/**
 * 当系统内注册国家为空，且证件类型为 10,11,12,13 时需要自动填充注册国家
 * @param {object} _this 
 * @returns 
 */
const isAutofillCitizenshipRequired = (_this) => {
    let idTypeField = _this.groupDatas.ORG_INFO.DOC_INFO[0].FIELDS.ID_TYPE;
    let orgBasicInfo = custInfoModel.getOriginaOrgBasicInfoByOrg(_this.oppBusiData.oldBusiData);
    return orgBasicInfo && _.isEmpty(myTrim(orgBasicInfo.CITIZENSHIP)) &&
     _.indexOf(["10", "11", "12", "13"], idTypeField.DEFAULT_VALUE) != -1;
}

/**
 * 根据 ID_TYPE 修改国籍的显示与否和值
 * @param {object} _this 
 */
const modifyCitizenshipAccordingToIdType = (_this) => {
    let docInfoFields = _this.groupDatas.ORG_INFO.DOC_INFO[0].FIELDS;
    if (_this.busiCode == "V0049" || _this.busiCode == "V0163") {
        // 系统内注册国家不为空的，置灰不可编辑
        if (isSystemOrgDataContainsCertainData(_this, "CITIZENSHIP")) {
            docInfoFields.CITIZENSHIP.FIELD_CONTROL = "2";
            return;
        }
    }
    let idType = docInfoFields.ID_TYPE.DEFAULT_VALUE;
    if (_.indexOf(["10", "11", "12", "13"], idType) != -1) {
        docInfoFields.CITIZENSHIP.FIELD_DICT_FILTER = "";
        docInfoFields.CITIZENSHIP.FIELD_CONTROL = "2";
        docInfoFields.CITIZENSHIP.DEFAULT_VALUE = "CHN";
    } else if ("14" == idType) {
        docInfoFields.CITIZENSHIP.DEFAULT_VALUE = "";
        docInfoFields.CITIZENSHIP.FIELD_DICT_FILTER = "!CHN";
        docInfoFields.CITIZENSHIP.FIELD_CONTROL = "0";
    } else if ("19" == idType) {
        docInfoFields.CITIZENSHIP.DEFAULT_VALUE = "";
        docInfoFields.CITIZENSHIP.FIELD_DICT_FILTER = "";
        docInfoFields.CITIZENSHIP.FIELD_CONTROL = "0";
    }
}

const isWrongIdCode = (idTypeField, idCodeField) => {
    let idType = idTypeField.DEFAULT_VALUE;
    let idCodeLength = idCodeField.DEFAULT_VALUE.length;
    return idType == "10" && !(idCodeLength == 18 || idCodeLength == 24);
}

const handleWrongIdCode = (_this, orgIdCodeField) => {
    pushMyFlowTip(_this, WRONG_ID_CODE_TIP_KEY, 
            "您的有效身份证明文件未加载统一社会信用代码，请先更新您的证件号码。", "error");
    _this.$nextTick( () => {
        orgIdCodeField.DEFAULT_VALUE = "";
        orgIdCodeField.FIELD_CONTROL = "1";
    })
}

const pushMyFlowTip = (_this, tipKey, tipTitle, tipType) => {
    _this.$refs.flowTip.pushFlowTip({
        key: tipKey,
        title: tipTitle,
        type: tipType
    })
}

const removeMyFlowTip = (_this, tipKey) => {
    _this.$refs.flowTip.removeFlowTip(tipKey);
}

const isClearIdCodeAndIdExpDateRequired = (idTypeField) => {
    return idTypeField.LAST_DEFAULT_VALUE && idTypeField.LAST_DEFAULT_VALUE !=  idTypeField.DEFAULT_VALUE;
}

const clearIdCodeAndIdExpDate = (idCodeField, idExpDateField) => {
    idCodeField.DEFAULT_VALUE = "";
    idExpDateField.DEFAULT_VALUE = "";
}

/**
 * 判断是否可以自动填充组织机构代码
 * @param {object} idTypeField 证件类型字段对象
 * @param {object} idCodeField 证件号码字段对象
 */
const isAbleToAutofillOrgIdCode = (idTypeField, idCodeField) => {
    let idType = idTypeField.DEFAULT_VALUE;
    let idCodeLength = idCodeField.DEFAULT_VALUE.length;
    return idType == "10" && (idCodeLength == 18 || idCodeLength == 24);
}

/**
 * 根据工商营业执照自动填充组织机构代码
 * @param {object} orgIdCodeFiled 组织机构代码字段对象
 * @param {object} idCodeFiled 证件号码字段对象
 */
const autofillOrgIdCode = (orgIdCodeField, idCodeField) => {
    orgIdCodeField.DEFAULT_VALUE = parseOrgIdCode(idCodeField.DEFAULT_VALUE);
    orgIdCodeField.FIELD_CONTROL = "2";
}

/**
 * 解析工商营业执照得到组织机构代码
 * @param {string} idCode 18/24位工商营业执照 
 */
const parseOrgIdCode = (idCode) => {
    let orgIdCode = "";
    if (typeof idCode == "string" && idCode.length == 18) {
        orgIdCode = idCode.substring(8, 16) + "-" + idCode.substr(16, 1);
    } 
    // if (typeof idCode == "string" && idCode.length == 24) {
    //     orgIdCode = idCode.substring(15, 23) + "-" + idCode.substr(23, 1);
    // }
    return orgIdCode;
}

/**
 * 初始化模块字段配置
 * @param {object} _this 
 */
const initFieldsConfig = (_this) => {
    //读卡按钮改名字为MODULE_CONTROL_TXT 拍证识别
    _this.groupDatas.ORG_INFO.DOC_INFO[0].MODULE_CONTROL_TXT = "拍证识别";
    let docInfoFields = _this.groupDatas.ORG_INFO.DOC_INFO[0].FIELDS;
    docInfoFields.CORP_ADDR.VALID_TYPE = "length[4,64]";
    docInfoFields.BUSINESS_RANGE.VALID_TYPE = "normalinput|length[4,1024]|on-blur";
    docInfoFields.REGISTER_FUND.VALID_TYPE = "money[13,4]";
    docInfoFields.ID_TYPE.FIELD_DICT_FILTER = _this["oppBusiData"]["VALID_ID_TYPE_FOR_ORG"];//["10", "11", "12", "13", "14", "19"];
    let subjectIdentityInfoFields = _this.groupDatas.ORG_INFO.SUBJECT_IDENTITY_INFO[0].FIELDS;
    subjectIdentityInfoFields.TRADE.FIELD_DICT_FILTER = "!m";
    subjectIdentityInfoFields.SMFUND_MANAGER_ID.VALID_TYPE = "length[0,10]";
    _.each(subjectIdentityInfoFields, (item, key) => {
        subjectIdentityInfoFields[key].labelWidth = "240";
    })
    _.each(docInfoFields, (item, key) => {
        docInfoFields[key].labelWidth = "220";
    })
}

/**
 * 初始化模块字段配置(开户)
 * @param {object} _this 
 */
 const initFieldsConfigOpenAcct = (_this) => {
    let docInfoFields = _this.groupDatas.ORG_INFO.DOC_INFO[0].FIELDS;
    docInfoFields.CORP_ADDR.VALID_TYPE = "length[4,64]";
    docInfoFields.BUSINESS_RANGE.VALID_TYPE = "normalinput|length[4,1024]|on-blur";
    docInfoFields.REGISTER_FUND.VALID_TYPE = "money[13,4]";
    docInfoFields.ID_TYPE.FIELD_DICT_FILTER = ["10", "11", "12", "13"];
    let subjectIdentityInfoFields = _this.groupDatas.ORG_INFO.SUBJECT_IDENTITY_INFO[0].FIELDS;
    subjectIdentityInfoFields.TRADE.FIELD_DICT_FILTER = "!m";
    subjectIdentityInfoFields.SMFUND_MANAGER_ID.VALID_TYPE = "length[0,10]";
    subjectIdentityInfoFields.CORP_TYPE.FIELD_DICT_FILTER = "!10,11,12,13";
    _.each(subjectIdentityInfoFields, (item, key) => {
        subjectIdentityInfoFields[key].labelWidth = "240";
    })
    _.each(docInfoFields, (item, key) => {
        docInfoFields[key].labelWidth = "220";
    })
}

/**
 * 根据业务需求修改字段配置
 * @param {object} _this 
 */
const modifyFieldsConfig = (_this) => {
    /**  证件信息 */
    let docInfoFields = _this.groupDatas.ORG_INFO.DOC_INFO[0].FIELDS;
    modifyCitizenshipAccordingToIdType(_this);
    // 注册资金
    //有历史数据才需要处理注册资金
    if (!_.isEmpty(docInfoFields.REGISTER_FUND.DEFAULT_VALUE) && !_.isEmpty(_this.historyData.ORG_BASIC_INFO)) {
        docInfoFields.REGISTER_FUND.DEFAULT_VALUE = "" + 
        util.divide(myParseFloat(docInfoFields.REGISTER_FUND.DEFAULT_VALUE), 10000);
    }
    /**  主体身份信息 */
    let subjectIdentityInfoFiels = _this.groupDatas.ORG_INFO.SUBJECT_IDENTITY_INFO[0].FIELDS;
    modifySmfundManagerFieldConfigAccordingToOrgType(_this, subjectIdentityInfoFiels.SZORG_TYPE.DEFAULT_VALUE);
    filterLegalRepOptionsAccordingToOpenLogic(_this);
    filterOrgTypeOptionsAccordingToOpenLogic(_this);
    modifyOrgIdCodeAccordingToIdTypeAndCitizenship(_this);
}

/**
 * 回填原始数据
 * @param {object} _this 
 */
const backfillOriginalData = (_this) => {
    let orgBasicInfo = custInfoModel.getOriginaOrgBasicInfoByOrg(_this.oppBusiData.oldBusiData);
    //对比数据的时候保证 oldGroupDatas的数据为正确的值
    if (!_.isEmpty(orgBasicInfo.REGISTER_FUND)) {
        orgBasicInfo.REGISTER_FUND = "" + 
            util.divide(myParseFloat(orgBasicInfo.REGISTER_FUND), 10000);
    }
    bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["DOC_INFO"], orgBasicInfo);
    bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["SUBJECT_IDENTITY_INFO"], orgBasicInfo);
}

/**
 * 查询证券账户开户初始化数据
 */
const getAcctOpenInitData = (_this) => {
    return _this.$syscfg.K_Request("W0000075", {
      BUSI_CODE: _this.busiCode,
      USER_TYPE: _this.userType
    });
  };
// 获取灰、黑名单国籍信息
const getGrayBlackInfo = (_this, nationCode) => {
    return _this.$syscfg.K_Request("W0000001", {
        YGT_SERVICE_CODE: 'QS000018',
        NATIONCODE: nationCode
    }).then(res => {
        return _.get(res, "Data[0]", {})
    })
}
export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizOrgBasicInfoNodeBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     */
    bizOrgBasicInfoNodeBeforeLoadBiz: function (_this) {
        return Promise.all([
            getRelationFlag(_this),
            getCustBankSignInfo(_this),
        ]).then(res => {
            initFieldsConfig(_this);
            backfillOriginalData(_this);
            showPartnerInfoModuleIfNeeded(_this);
        }).catch(error => {
            console.error(error);
        })
    },
    bizOrgBasicInfoNodeBeforeLoadBizOpenAcct: function (_this) {
        initFieldsConfigOpenAcct(_this);
        let userInfo = _this.$storage.getJsonSession(_this.$definecfg.USER_INFO);
        // 开户机构默认为柜台机所属营业部
        _this.groupDatas.ORG_INFO.DOC_INFO[0].FIELDS.OP_ORG_FULL_NAME.DEFAULT_VALUE = userInfo.ORG_NAME;
        // 开户方式默认为 0-柜台开户
        _this.groupDatas.ORG_INFO.DOC_INFO[0].FIELDS.OPEN_SOURCE.DEFAULT_VALUE = "0";
        // 无论是否为 OCR 都需要填充三要素
        let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
        let fields = _this.groupDatas.ORG_INFO.DOC_INFO[0].FIELDS;
        fields.CUST_FNAME.DEFAULT_VALUE = customerInfo.CUST_FNAME;
        fields.ID_TYPE.DEFAULT_VALUE = customerInfo.ID_TYPE;
        fields.ID_CODE.DEFAULT_VALUE = customerInfo.ID_CODE;
        // 填充组织机构代码
        fields.ORG_ID_CODE.DEFAULT_VALUE = customerInfo.ORG_ID_CODE;

        // 存在读卡信息并回填
        let ocrReadInfo = _this.$store.state.ocrReadInfo;
        if(!_.isEmpty(ocrReadInfo)) {
            fields.CUST_NAME.DEFAULT_VALUE = ocrReadInfo.CUST_NAME;
            fields.ID_EXP_DATE.DEFAULT_VALUE = ocrReadInfo.ID_EXP_DATE;
            fields.CORP_ADDR.DEFAULT_VALUE = ocrReadInfo.CORP_ADDR || ocrReadInfo.ID_ADDR;
            fields.BUSINESS_RANGE.DEFAULT_VALUE = ocrReadInfo.BUSINESS_SCOPE;
            fields.BIRTHDAY.DEFAULT_VALUE = ocrReadInfo.FOUND_DATE;  
            fields.CITIZENSHIP.DEFAULT_VALUE = "CHN";
            fields.REGISTER_FUND.DEFAULT_VALUE = ocrReadInfo.REGISTER_FUND;
            fields.REGISTER_CURRENCY.DEFAULT_VALUE = ocrReadInfo.REGISTER_CURRENCY;
        }
        let OPEN_ORG_INFO = _this.$storage.getJsonSession(_this.$definecfg.OPEN_ORG_INFO) || {};
        return Promise.all([
            getAcctOpenInitData(_this),
            custService.getOpenTemplateData(_this, OPEN_ORG_INFO.ORG_CODE),
            custService.getCustModelSet(_this, OPEN_ORG_INFO.ORG_CODE)
        ]).then(res => {
            if (res[0].Data.length == 0) {
                _this.$blMethod.showMsgBox(_this, "开户逻辑配置为空！")
            }
            //开户逻辑
            _this.oppBusiData.allAcctOpenLogicData = _.get(res[0], "Data[0].openLogicData", {});
            _this.oppBusiData.rateObj = _.get(res[1], "Data[0]", {});
            // 客户模板设置
            _this.oppBusiData.templData = _.get(res[2], "Data", []);
            // 过滤出当前用户类型且取第一个模板
            _this.oppBusiData.templData = _.filter(_this.oppBusiData.templData, item => {
                return item.USER_TYPE == _this.userType;
            }) || [];
            let rateObj = _this.oppBusiData.rateObj;
            _this.oppBusiData.OPEN_TEMPLATE = _.extend(_this.oppBusiData.templData[0] || {}, {
                RMB_INT_RATE_SN: rateObj.RMB_INT_RATE_SN,
                HK_INT_RATE_SN: rateObj.HK_INT_RATE_SN,
                US_INT_RATE_SN: rateObj.US_INT_RATE_SN,
                RMB_DR_RATE_GRP: rateObj.RMB_DR_RATE_GRP,
                HK_DR_RATE_GRP: rateObj.HK_DR_RATE_GRP,
                US_DR_RATE_GRP: rateObj.US_DR_RATE_GRP
            })
            if (!_this.oppBusiData.allAcctOpenLogicData) {
                _this.$blMethod.showMsgBox(_this, "开户逻辑配置为空！")
            }
        })
    },
    /*
     *@method bizOrgBasicInfoNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     */
    bizOrgBasicInfoNodeAfterLoadBiz: function (_this) {
        backfillHistoryData(_this);
        modifyFieldsConfig(_this);
        let subjectIdentityInfoFields = _this.groupDatas.ORG_INFO.SUBJECT_IDENTITY_INFO[0].FIELDS;
        if (AVAILABLE_LEGAL_REP_TYPES.indexOf(subjectIdentityInfoFields.LEGAL_REP_TYPE.DEFAULT_VALUE) == -1) {
            subjectIdentityInfoFields.LEGAL_REP_TYPE.DEFAULT_VALUE = "";
        }
        if (AVAILABLE_SZCORP_TYPES.indexOf(subjectIdentityInfoFields.SZORG_TYPE.DEFAULT_VALUE) == -1) {
            subjectIdentityInfoFields.SZORG_TYPE.DEFAULT_VALUE = "";
        }
        showPartnerInfoModuleIfNeeded(_this);
        
    },
    /*
     *@method bizOrgBasicInfoNodeBeforeSave
     *@desc 钩子函数 自定义保存数
     */
    bizOrgBasicInfoNodeBeforeSave: async function (_this, params) {
        /** 1、从 groupDatas 中获取最新数据 */
        // 证件信息
        let docInfo = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "DOC_INFO");
        // 注册资金转换为 “元”
        docInfo.REGISTER_FUND = "" + util.multi(myParseFloat(docInfo.REGISTER_FUND), 10000);
        
        // 主体身份
        let subjectIdentityInfo = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "SUBJECT_IDENTITY_INFO");
        // 行业大类
        subjectIdentityInfo.INDUS_GB = industryMap[subjectIdentityInfo.TRADE];
        // 如果"SMFUND_MANAGER_ID"字段控制为 1-隐藏，将其值赋值为空
        if (_this.groupDatas.ORG_INFO.SUBJECT_IDENTITY_INFO[0].FIELDS.SMFUND_MANAGER_ID.FIELD_CONTROL == "1") {
            subjectIdentityInfo.SMFUND_MANAGER_ID = "";
        }

        /** 2、获取原始数据 */
        let docInfoFields = _this.groupDatas.ORG_INFO.DOC_INFO[0].FIELDS;
        let subjectIdentityInfoFields = _this.groupDatas.ORG_INFO.SUBJECT_IDENTITY_INFO[0].FIELDS;
        let originalOrgBasicInfo = custInfoModel.getOriginaOrgBasicInfoByOrg(_this.oppBusiData.oldBusiData);
        let oldDocInfo = bizPublicMethod.$blMethod.getOriginalFieldValues(docInfoFields, originalOrgBasicInfo);
        let oldSubjectIdentityInfo = bizPublicMethod.$blMethod.getOriginalFieldValues(subjectIdentityInfoFields, originalOrgBasicInfo);
        oldSubjectIdentityInfo.INDUS_GB = industryMap[originalOrgBasicInfo.TRADE];

        // 如果"ORG_ID_CODE"字段控制为 1-隐藏，将 ORG_ID_CODE、ORG_ID_EXP_DATE 不修改为原值
        if (_this.groupDatas.ORG_INFO.DOC_INFO[0].FIELDS.ORG_ID_CODE.FIELD_CONTROL == "1") {
            docInfo.ORG_ID_CODE = originalOrgBasicInfo.ORG_ID_CODE || "";
        }
        if (_this.groupDatas.ORG_INFO.DOC_INFO[0].FIELDS.ORG_ID_EXP_DATE.FIELD_CONTROL == "1") {
            docInfo.ORG_ID_EXP_DATE = originalOrgBasicInfo.ORG_ID_EXP_DATE || "";
        }

        // 加上反洗钱类型
        docInfo.AML_CUST_TYPE = _this.groupDatas.RELA_INFO.AML_INFO[0].FIELDS.AML_CUST_TYPE.DEFAULT_VALUE;
        oldDocInfo.AML_CUST_TYPE = originalOrgBasicInfo.AML_CUST_TYPE;

        /** 修改后的数据与原始数据比较 */
        let docInfoDiff = bizPublicMethod.$blMethod.compareInfo2(oldDocInfo, docInfo, "");
        let subjectIdentityInfoDiff = bizPublicMethod.$blMethod.compareInfo2(oldSubjectIdentityInfo, subjectIdentityInfo, "INDUS_GB");
        docInfo.DIFF_INFO = docInfoDiff;
        subjectIdentityInfo.DIFF_INFO = subjectIdentityInfoDiff;
        
        let changedFieldIds = _.concat([], _.map(_.cloneDeep(docInfoDiff), "FIELD"), _.map(_.cloneDeep(subjectIdentityInfoDiff), "FIELD"));
        let changedFieldIdsObj = {};
        _.each(changedFieldIds, obj => {
            changedFieldIdsObj[obj] = true;
        })
        /** 3、数据变更标志 */
        let tempParam = {};
        // 营业执照
        if (changedFieldIdsObj["ID_EXP_DATE"] || changedFieldIdsObj["REGISTER_FUND"] || 
        changedFieldIdsObj["CORP_ADDR"]) {
            tempParam.isBusinessLicenseChange = "1";
        }
        ["ID_EXP_DATE", "REGISTER_FUND", "CORP_ADDR"]
        // 证件信息
        if (changedFieldIdsObj["ID_CODE"] || changedFieldIdsObj["ID_EXP_DATE"]) {
            tempParam.isOrgIdInfoChange = "1"; 
        }
        // 若变更了三要素、机构组织代码证号码、私募基金管理人编码任何一个，需要进入二审
        if (changedFieldIdsObj["CUST_FNAME"] || changedFieldIdsObj["ID_TYPE"] || changedFieldIdsObj["ID_CODE"] ||
        changedFieldIdsObj["ORG_ID_CODE"] || changedFieldIdsObj["SMFUND_MANAGER_ID"]) {
            tempParam.isChangeImportant = "1";
            tempParam.isNotmorMal = "1";
        }
        //若变更了三要素、机构组织代码证号码 需要审核端进行机构信息核查
        if (changedFieldIdsObj["CUST_FNAME"] || changedFieldIdsObj["ID_TYPE"] || changedFieldIdsObj["ID_CODE"] ||
        changedFieldIdsObj["ORG_ID_CODE"]) {
            tempParam.NEED_ORG_CHECK_FLAG = "1";
        }
        // 三要素
        if (changedFieldIdsObj["CUST_FNAME"] || changedFieldIdsObj["ID_TYPE"] || changedFieldIdsObj["ID_CODE"] || changedFieldIdsObj["ORG_ID_CODE"]) {
            //银河证券 基金自动开户协议设置 一账通绑定设置 升位也需要同步变更
            tempParam.CHANGE_IMPORTANT_FLAG_YINHE = "1";
        }
        // 国籍
        if (changedFieldIdsObj["CITIZENSHIP"]) {
            tempParam.isChangeCitizenship = "1"; 
        } else {
            tempParam.isChangeCitizenship = "0"; 
        }
        // 国有属性
        if (changedFieldIdsObj["NATIONAL_ATTR"]) {
            tempParam.IS_CHANGE_NATION_ATTR = "1";
        } else {
            tempParam.IS_CHANGE_NATION_ATTR = "0";
        }


        /**  4、数据转换 */
        Object.assign(docInfo, {
            USER_FNAME: docInfo.CUST_FNAME,
            USER_NAME: docInfo.CUST_NAME
        })
        Object.assign(oldDocInfo, {
            USER_FNAME: oldDocInfo.CUST_FNAME,
            USER_NAME: oldDocInfo.CUST_NAME
        })
        _.each(docInfo.DIFF_INFO, item => {
            if (item.FIELD == "CUST_FNAME") {
                item.FIELD = "USER_FNAME"
            }
            if (item.FIELD == "CUST_NAME") {
                item.FIELD = "USER_NAME"
            }
        })
        
        /**  5、模块间的数据合并 */
        // 法人类别、机构类别、行业类别、企业类型、私募基金管理人编码，需要合到基本信息中
        let orgBasicInfo = Object.assign({}, _.cloneDeep(docInfo), _.pick(_.cloneDeep(subjectIdentityInfo), 
            "LEGAL_REP_TYPE", "SZORG_TYPE", "TRADE", "INDUS_GB", "CORP_TYPE", "SMFUND_MANAGER_ID"));
        _.each(subjectIdentityInfo.DIFF_INFO, item => {
            if (_.indexOf(["LEGAL_REP_TYPE", "SZORG_TYPE", "TRADE", "INDUS_GB", "CORP_TYPE", "SMFUND_MANAGER_ID"], 
            item.FIELD) > -1) {
                orgBasicInfo.DIFF_INFO.push(_.cloneDeep(item));
            }
        })
        // 组织机构代码、组织机构证有效期，需要合到重要信息中
        let orgImportantInfo = Object.assign({}, _.cloneDeep(subjectIdentityInfo), _.pick(_.cloneDeep(docInfo), 
        "ORG_ID_CODE", "ORG_ID_EXP_DATE"));
        _.each(docInfo.DIFF_INFO, item => {
            if (_.indexOf(["ORG_ID_CODE", "ORG_ID_EXP_DATE"], 
            item.FIELD) > -1) {
                orgImportantInfo.DIFF_INFO.push(_.cloneDeep(item));
            }
        })
        // 重要信息需要从主体身份中去掉的字段
        let importantInfoExcludeFields = ["LEGAL_REP_TYPE", "SZORG_TYPE", "TRADE", "INDUS_GB", "CORP_TYPE", "SMFUND_MANAGER_ID"];
        _.each(importantInfoExcludeFields, item => {
            delete orgImportantInfo[item];
        })
        orgImportantInfo.DIFF_INFO = _.filter(orgImportantInfo.DIFF_INFO || [], item => {
            return !importantInfoExcludeFields.includes(item.FIELD);
        })
        //删除orgBasicInfo里的重要信息
        let orgImportantFields = ["ORG_ID_CODE", "ORG_ID_EXP_DATE", "CAPITAL_ATTR", "NATIONAL_ATTR"];
        orgBasicInfo = _.omit(orgBasicInfo, orgImportantFields)
        orgBasicInfo.DIFF_INFO = _.filter(orgBasicInfo.DIFF_INFO, diffInfoItem => {
            return orgImportantFields.indexOf(diffInfoItem.FIELD) == -1;
        })

        //增加diffinfo 属性 用于展示
        let DOC_INFO = _this.groupDatas.ORG_INFO.DOC_INFO[0].FIELDS;
        let SUBJECT_IDENTITY_INFO = _this.groupDatas.ORG_INFO.SUBJECT_IDENTITY_INFO[0].FIELDS;
        let AML_INFO = _this.groupDatas.RELA_INFO.AML_INFO[0].FIELDS;
        let fieldsAll = _.assign({}, DOC_INFO, SUBJECT_IDENTITY_INFO, AML_INFO);
        let diffInfo = _.concat([], _.cloneDeep(orgBasicInfo.DIFF_INFO), _.cloneDeep(orgImportantInfo.DIFF_INFO));
        diffInfo = _.uniqBy(diffInfo, 'FIELD');
        _.each(diffInfo, item => {
            if (item.FIELD == "USER_FNAME") {
                item.FIELD = "CUST_FNAME" 
            }
            if (item.FIELD == "USER_NAME") {
                item.FIELD = "CUST_NAME"
            }
            if (item.FIELD == "REGISTER_FUND") {
                item.OLD = "" + util.divide(myParseFloat(item.OLD), 10000);
                item.NEW = "" + util.divide(myParseFloat(item.NEW), 10000);
            }
        })
        let webShow = _this.$blMethod.addDiffAtt(fieldsAll, diffInfo);
        params.BASIC_WEB_SHOW = webShow;

        /** 6、添加到 params 中 */
        Object.assign(params, {
            NEW_BASE_INFO: Object.assign(params.NEW_BASE_INFO || {}, 
                _.cloneDeep(docInfo), _.cloneDeep(subjectIdentityInfo)
            ),
            OLD_BASE_INFO: Object.assign(params.OLD_BASE_INFO || {}, 
                _.cloneDeep(oldDocInfo), _.cloneDeep(oldSubjectIdentityInfo)
            ),
            ORG_BASIC_INFO: Object.assign(params.ORG_BASIC_INFO || {}, orgBasicInfo),
            ORG_IMPORT_INFO: orgImportantInfo,
            CHANGE_IMPORTANT_FLAG: tempParam.isChangeImportant || "0",
            NEED_ORG_CHECK_FLAG: tempParam.NEED_ORG_CHECK_FLAG || "0",
            NOT_NORMAL: tempParam.isNotmorMal || "0",
            IS_BUSINESS_LICENSE_INFO_CHANGE: tempParam.isBusinessLicenseChange || "0",
            IS_ORG_ID_INFO_CHANGE: tempParam.isOrgIdInfoChange || "0",
            CHANGE_IMPORTANT_FLAG_YINHE: tempParam.CHANGE_IMPORTANT_FLAG_YINHE,
            CHANGE_CITIZENSHIP_FLAG: tempParam.isChangeCitizenship || "",
            IS_CHANGE_NATION_ATTR: tempParam.IS_CHANGE_NATION_ATTR || "0",
            SZORG_TYPE_NEW: subjectIdentityInfoFields.SZORG_TYPE,
            AML_CUST_TYPE: originalOrgBasicInfo.AML_CUST_TYPE == docInfo.AML_CUST_TYPE ? "" : docInfo.AML_CUST_TYPE,
            NEW_ID_TYPE: changedFieldIdsObj["ID_TYPE"] ? docInfo["ID_TYPE"] : "",
            LEGAL_REP_TYPE_NEW: subjectIdentityInfo.LEGAL_REP_TYPE,
            INOUTSIDE_IDENTITY: getInoutsideIdentity(_this, docInfo.ID_TYPE, docInfo.CITIZENSHIP),
            INDUS_GB: subjectIdentityInfo.INDUS_GB,
            RISK_FACTOR: originalOrgBasicInfo.RISK_FACTOR,
            CITIZENSHIP: docInfo.CITIZENSHIP,
            AML_FLAG: true,
            isGrayCitizenship: _this.oppBusiData.isGrayCitizenship === undefined ? (params.isGrayCitizenship || "0") : (_this.oppBusiData.isGrayCitizenship == "1" ? "1" : "0")
        })
        // 国税登记证信息
        params.BUSINESS_TAX_NO = docInfo.ID_CODE;
        params.NEW_BASE_INFO.BUSINESS_TAX_NO = docInfo.ID_CODE;
        params.OLD_BASE_INFO.BUSINESS_TAX_NO = _.get(_this.oppBusiData.oldBusiData, "CORP_INFO.BUSINESS_TAX_NO");
        params.ORG_IMPORT_INFO.BUSINESS_TAX_NO = docInfo.ID_CODE;
        
        //y042表单添加FIELD_TITLE
        params.ORG_BASIC_INFO && (params.ORG_BASIC_INFO.DIFF_INFO = _this.$blMethod.addDiffAtt(fieldsAll, params.ORG_BASIC_INFO.DIFF_INFO, {
            USER_FNAME: "CUST_FNAME",
            USER_NAME: "CUST_NAME"
        }));
        params.ORG_IMPORT_INFO && (params.ORG_IMPORT_INFO.DIFF_INFO = _this.$blMethod.addDiffAtt(fieldsAll, params.ORG_IMPORT_INFO.DIFF_INFO));
        
        

        /**开户数据保存 */
        if (_this.busiCode == "V0050") {
            let orgInfo = params.ORG_INFO || {};
            orgInfo.ORG_BASIC_INFO = params.ORG_BASIC_INFO;
            orgInfo.ORG_IMPORT_INFO = params.ORG_IMPORT_INFO;
            delete orgInfo.ORG_BASIC_INFO.DIFF_INFO;
            delete orgInfo.ORG_IMPORT_INFO.DIFF_INFO;
            // 审核端不展示证件地址
            orgInfo.ORG_BASIC_INFO.ID_ADDR = "";
            // 主体身份先默认为 0-普通
            orgInfo.ORG_BASIC_INFO.SUBJECT_IDENTITY = "0";
            orgInfo.ORG_BASIC_INFO.INOUTSIDE_IDENTITY = params.INOUTSIDE_IDENTITY;
            // 开户机构
            params.OP_ORG_FULL_NAME = _this.groupDatas.ORG_INFO.DOC_INFO[0].FIELDS.OP_ORG_FULL_NAME.DEFAULT_VALUE;
            // 开户补充ORG_OPEN_TEMPLATE
            orgInfo.ORG_OPEN_TEMPLATE = _this.oppBusiData.OPEN_TEMPLATE;
            // 开通协议、操作渠道、投资者分类、投资者来源
            Object.assign(orgInfo.ORG_BASIC_INFO, {
                CUST_AGMT_TYPE: _this.oppBusiData.OPEN_TEMPLATE.CUST_AGMT_TYPES,
                CHANNELS: bizPublicMethod.$blMethod.separate(_this.oppBusiData.OPEN_TEMPLATE.CHANNELS, ","),
                PROF_INVESTOR_TYPE: subjectIdentityInfo.PROF_INVESTOR_TYPE,
                PROF_INVESTOR_SOURCE: subjectIdentityInfo.PROF_INVESTOR_SOURCE,
            })
            // 翻译字段字典项，以便影像展示
            let docInfoFields = _this.groupDatas.ORG_INFO.DOC_INFO[0].FIELDS;
            let subjectIdentityInfoFields = _this.groupDatas.ORG_INFO.SUBJECT_IDENTITY_INFO[0].FIELDS;
            orgInfo.ORG_BASIC_INFO.SZORG_TYPE_TEXT = 
                bizPublicMethod.$blMethod.getFieldDictItemName(subjectIdentityInfoFields.SZORG_TYPE);
            orgInfo.ORG_BASIC_INFO.LEGAL_REP_TYPE_TEXT = 
                bizPublicMethod.$blMethod.getFieldDictItemName(subjectIdentityInfoFields.LEGAL_REP_TYPE);
            orgInfo.ORG_BASIC_INFO.ID_TYPE_TEXT = 
                bizPublicMethod.$blMethod.getFieldDictItemName(docInfoFields.ID_TYPE);
            Object.assign(params, {
                ORG_INFO: orgInfo,
                PROF_INVESTOR_SOURCE: orgInfo.ORG_BASIC_INFO.PROF_INVESTOR_SOURCE,
                LEGAL_REP_TYPE: orgInfo.ORG_BASIC_INFO.LEGAL_REP_TYPE,
                SZORG_TYPE: orgInfo.ORG_BASIC_INFO.SZORG_TYPE,

                ID_EXP_DATE: params.ORG_BASIC_INFO.ID_EXP_DATE,
                ORG_ID_CODE: params.ORG_IMPORT_INFO.ORG_ID_CODE,
                ORG_ID_EXP_DATE: params.ORG_IMPORT_INFO.ORG_ID_EXP_DATE,
                SMFUND_MANAGER_ID: params.ORG_BASIC_INFO.SMFUND_MANAGER_ID,

                NATIONAL_ATTR: params.ORG_IMPORT_INFO.NATIONAL_ATTR,
                CAPITAL_ATTR: params.ORG_IMPORT_INFO.CAPITAL_ATTR,
            })
            //如果专i投资者 则置空风险评测数据
            if (params.PROF_INVESTOR_SOURCE == "10") {
                params.RISK_INFO = [];
                params.RATINT_LVL_FLAG = "";
                //专业投资者告知及确认书影像所需要字段
                params.PROF_INVESTOR_SOURCE_TEXT = bizPublicMethod.$blMethod.getFieldDictItemName(subjectIdentityInfoFields.PROF_INVESTOR_SOURCE);
                params.PROF_EXP_DATE = "30001231";
                params.SIGN_DATE = date.getClientDate();
            }
            
        }
        return params;
    },
    /*
     *@method bizOrgBasicInfoNodeValidate
     *@desc 钩子函数 下一步验证
     */
    bizOrgBasicInfoNodeValidate: function (_this) {
        let modules = _this.groupDatas.ORG_INFO.DOC_INFO;
        let fieldIds = ["ID_EXP_DATE"];
        let promiseArr = bizPublicMethod.$blMethod.getValidatePromises(_this, modules, fieldIds);
        return Promise.all(promiseArr).then( (res)=> {
            if (_.includes(res, false)) {
                return false;
            }
        })
    },

    /*
     *@method bizOrgBasicInfoNodePageActivated
     *@desc 钩子函数：页面激活
     */
    bizOrgBasicInfoNodePageActivated: function (_this) {
        //经营范围修改为多行模式
        let docInfoFields = _this.groupDatas.ORG_INFO.DOC_INFO[0].FIELDS;
        docInfoFields.BUSINESS_RANGE.VALID_TYPE = "normalinput|length[4,1024]|on-blur";
        _this.$nextTick(function () {
            setTimeout(() => {
                docInfoFields.BUSINESS_RANGE.VALID_TYPE = "text|length[4,1024]|on-blur";
            }, 10);
            docInfoFields.BUSINESS_RANGE.FIELD_AUTOSIZE = {
                minRows: 1,
                maxRows: 4
            }
        })
        if (_this.busiCode == "V0049" || _this.busiCode == "V0163") {
            if (_this.moduleId.indexOf("DOC_INFO") > -1) {
                if (isAutofillCitizenshipRequired(_this)) {
                    pushMyFlowTip(_this, AUTOFILL_CITIZENSHIP_TIP_KEY, 
                        "已根据证件类型自动填写注册国家，请点击本页面【保存修改】进行确认", "warnning")
                }
                let docInfoFields = _this.groupDatas.ORG_INFO.DOC_INFO[0].FIELDS;
                if (!isSystemOrgDataContainsCertainData(_this, "ORG_ID_CODE") &&
                isAbleToAutofillOrgIdCode(docInfoFields.ID_TYPE, docInfoFields.ID_CODE)) {
                    pushMyFlowTip(_this, AUTOFILL_ORG_ID_CODE_TIP_KEY, 
                        "已根据证件类型自动填写组织机构代码，请点击本页面【保存修改】进行确认", "warnning")
                }
            }
        }
    },
    /*
     *@method bizProBasicInfoNodeAfterSave
     *@desc 钩子函数 自定义保存数
     */
    bizOrgBasicInfoNodeAfterSave: (_this, newData) => {
        
    },
    //路由更新
    bizOrgBasicInfoNodeUpdateRouter: (_this, bizRouteTable) => {
        //是否需要展示合伙人
        let isShow = isShowPartnerInfoNeeded(_this) == "1" ? "true" : "false";
        //合伙人数据
        let ORG_PARTNER_INFO_FLAG = _.get(_this.historyData, "RELA_INFO.ORG_PARTNER_INFO_FLAG", ""); 
        //合伙人所在路由 关联人信息
        let routerIndex = _this.$router.getRouteIndex("关联人信息");
        let routerItem = bizRouteTable[routerIndex];
        if (routerItem.stepState == "isSonFinish" && isShow.toString() != ORG_PARTNER_INFO_FLAG.toString()) {
            bizRouteTable[routerIndex].stepState = "isWaiting";
        }
        return bizRouteTable;
    },

    //----------------------业务函数----------------------------------//
    "CHECK_ID_TYPE": (_this, field, fieldData) => {
        if (isFieldValueNotChanged(field)) {
            return;
        }
        checkCustThreeEle(_this);
        checkIdTypeChange(_this);
        if (isClearIdCodeAndIdExpDateRequired(field)) {
            if (!field.disableClear) {
                clearIdCodeAndIdExpDate(fieldData.ID_CODE, fieldData.ID_EXP_DATE);
            }
            field.disableClear = false;
        }

        let HIS_ID_TYPE = _.get(_this.oppBusiData.oldBusiData, "CUST_BASIC_INFO.ID_TYPE", '');
        let HIS_ID_CODE = _.get(_this.oppBusiData.oldBusiData, "CUST_BASIC_INFO.ID_CODE", '');
        let HIS_ID_EXP_DATE = _.get(_this.oppBusiData.oldBusiData, "CUST_BASIC_INFO.ID_EXP_DATE", '');
        if(field.DEFAULT_VALUE != '' && field.DEFAULT_VALUE == HIS_ID_TYPE) {
            fieldData.ID_CODE.DEFAULT_VALUE = HIS_ID_CODE || '';
            fieldData.ID_EXP_DATE.DEFAULT_VALUE = HIS_ID_EXP_DATE || '';
        }

        modifyOrgIdCodeAccordingToIdTypeAndCitizenship(_this);
        modifyCitizenshipAccordingToIdType(_this);
        filterLegalRepOptionsAccordingToOpenLogic(_this);
        filterOrgTypeOptionsAccordingToOpenLogic(_this);
        field.LAST_DEFAULT_VALUE = field.DEFAULT_VALUE;
    },
    "CHECK_ID_CODE": (_this, field, fieldData) => {
        if (isFieldValueNotChanged(field)) {
            return;
        }
        checkCustThreeEle(_this);
        removeMyFlowTip(_this, WRONG_ID_CODE_TIP_KEY);
        if (isWrongIdCode(fieldData["ID_TYPE"], field)) {
            handleWrongIdCode(_this, fieldData["ORG_ID_CODE"]);
        }
        if (isAbleToAutofillOrgIdCode(fieldData["ID_TYPE"], field)) {
            autofillOrgIdCode(fieldData["ORG_ID_CODE"], field);
        }
        field.LAST_DEFAULT_VALUE = field.DEFAULT_VALUE;
    },
    "CHECK_ORG_ID_CODE": (_this, field, fieldData) => {
        if (fieldData["ID_TYPE"] == "10") {
            return;
        }
        checkCustThreeEle(_this);
    },
    "CHECK_SZORG_TYPE": (_this, field, fieldData) => {
        if (isFieldValueNotChanged(field)) {
            return;
        }
        modifySmfundManagerFieldConfigAccordingToOrgType(_this, field.DEFAULT_VALUE);
        showPartnerInfoModuleIfNeeded(_this);
        if (_this.busiCode == "V0050" && !_.isEmpty(field.DEFAULT_VALUE)) {
           // 投资者分类、投资者来源 
           if (PROFESSIONAL_INVESTOR_ORG_TYPES.indexOf(field.DEFAULT_VALUE) > -1) {
                fieldData.PROF_INVESTOR_TYPE.DEFAULT_VALUE = "1";
                fieldData.PROF_INVESTOR_SOURCE.DEFAULT_VALUE = "10";
           } else {
                fieldData.PROF_INVESTOR_TYPE.DEFAULT_VALUE = "0";
                fieldData.PROF_INVESTOR_SOURCE.DEFAULT_VALUE = "00";
           }
           // 动态准入
           removeMyFlowTip(_this, SPECIAL_ORG_TYPE_TIP_KEY);
           if (SPECIAL_ORG_TYPES.indexOf(field.DEFAULT_VALUE) != -1) {
                pushMyFlowTip(_this, SPECIAL_ORG_TYPE_TIP_KEY, SPECIAL_ORG_TYPE_TIP_TITLE, "info");
           }
        }
        field.LAST_DEFAULT_VALUE = field.DEFAULT_VALUE;
    },
    "CHECK_LEGAL_REP_TYPE": (_this, field, fieldData) => {
        if (isFieldValueNotChanged(field)) {
            return;
        }
        filterOrgTypeOptionsAccordingToOpenLogic(_this);
        modifyLegalRepConfigAccordingToLegalType(_this, field.DEFAULT_VALUE);
        field.LAST_DEFAULT_VALUE = field.DEFAULT_VALUE;
    },
    "CHECK_CITIZENSHIP": async (_this, field, fieldData) => {
        modifyOrgIdCodeAccordingToIdTypeAndCitizenship(_this);
        filterLegalRepOptionsAccordingToOpenLogic(_this);
        setLinkMobileTelUnrequiredIfOutside(_this);
        let officeAddrField = _this.groupDatas.LINK_INFO.ORG_LINK_INFO[0].FIELDS.OFFICE_ADDR;
        if (["CHN", "CTN", "HKG", "MAC"].indexOf(field.DEFAULT_VALUE) > -1) {
            officeAddrField.showRegionSelector = true;
        } else {
            officeAddrField.showRegionSelector = false;
        }
        // 可以编辑的登记文件
        // 是否为灰名单国家 默认为0
        _this.oppBusiData.isGrayCitizenship = "0";
        let countryValue = field.DEFAULT_VALUE;
        if (!_.isEmpty(countryValue) && countryValue != "CHN") {
            _this.removeFlowTip('black-gray-info');
            // 查询国家是否属于灰黑色名单国籍
            let blackInfo = await getGrayBlackInfo(_this, countryValue);
            if (!_.isEmpty(blackInfo)) {
                // 201黑名单 202灰名单
                if (blackInfo.LISTTYPE == "201") {
                    _this.pushFlowTip( {
                        title: "为了更好的为您提供服务，请前往柜台办理，感谢您的配合。",
                        type: "error",
                        key: "black-gray-info"
                    })
                    field.DEFAULT_VALUE = "";
                    return false;
                }
                // 灰名单需要流转营业部负责人 及合规岗
                if (blackInfo.LISTTYPE == "202") {
                    // 灰名单国家
                    _this.oppBusiData.isGrayCitizenship = "1";
                }
            }
        }
    },
    "CHECK_ID_EXP_DATE": (_this, field, fieldData) => {
        // 若客户的证件类型为营业执照的，自动送营业执照的证件结束日期到组织机构证有效期，其他证件类型不送
        if (fieldData.ID_TYPE.DEFAULT_VALUE == "10") {
            fieldData.ORG_ID_EXP_DATE.DEFAULT_VALUE = field.DEFAULT_VALUE;
        }
        if (bizPublicMethod.$blMethod.isExpired(_this, field.DEFAULT_VALUE)) {
            _this.$nextTick( () => {
                bizPublicMethod.$blMethod.changeFieldError(field, false, field.FIELD_TITLE + "已过期");
            })
            return false;
        }
    },
    "CHECK_CUST_FNAME": (_this, field, fieldData) => {
        checkCustThreeEle(_this);
    },
    "CHECK_NATIONAL_ATTR": (_this, field, fieldData) => {
        if (_this.userType == "1") {
            let sysCommParam =  _this.$storage.getJsonSession(_this.$definecfg.SYS_COMM_PARAM_OBJS);
            let specialSzorgTypes = _.isEmpty(sysCommParam.SPE_SZORG_TYPE) ? [] : sysCommParam.SPE_SZORG_TYPE.split(",");
            let szorgType = _this.groupDatas.ORG_INFO.SUBJECT_IDENTITY_INFO[0].FIELDS.SZORG_TYPE.DEFAULT_VALUE;
            if (specialSzorgTypes.indexOf(szorgType) != -1) {
                // 特殊机构不需要校验
                return;
            }
            removeMyFlowTip(_this, NATIONAL_ATTR_CHANGED_WARNING_TIP_KEY);
            let originalNationalAttr = _.get(custInfoModel.getOriginaOrgBasicInfoByOrg(_this.oppBusiData.oldBusiData), "NATIONAL_ATTR", "") || "";
            // 中登查询时间内，系统内国有属性和中登不一致，需要警告提示
            if (_this.oppBusiData.IS_IN_ZD_TIME == "true" && _this.oppBusiData.zdYmtData.length == 1 &&
            originalNationalAttr != field.DEFAULT_VALUE) {
                if (_this.oppBusiData.zdYmtData[0].NATIONAL_ATTR != field.DEFAULT_VALUE) {
                    pushMyFlowTip(_this, NATIONAL_ATTR_CHANGED_WARNING_TIP_KEY, 
                        "您机构的国有属性与中国结算信息不一致，如需修改中国结算信息请联系现场工作人员。", "warn");
                }
            } 
        }
    },
}