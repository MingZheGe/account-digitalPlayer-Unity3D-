/*
 *   管理人基本信息模块
 *   方法封装
 */
import date from '../../../../../../../tools/date.js'
import * as util from "../../../../../../../tools/util"
import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../../business/businessTools/bizPublicMethod.js"
import custInfoModel  from "../../common/cust-info-model"
import {parseAddress} from '../../../../../../../tools/util' //地址解析组件

const WRONG_OFFICE_ADDRESS_TIP_KEY = "wrongOfficeAddress";

const WRONG_OFFICE_ADDRESS_TIP_TITLE = "办公地址请精确到门牌号！";

const SYNC_ADDRESS_BUTTON_TEXT = "从注册地址同步";

const CANCEL_ADDRESS_SYNC = "撤销同步";

const WRONG_ID_CODE_TIP_KEY = "wrongIdCode";

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
 * 法定代表人、执行事务合伙人要去掉的证件类型：军官证、士兵证、户口本、台胞证、解放军文职干部、武警文职干部、
 * 社会保障号、文职证、警官证
 */
 const LEGAL_REP_EXCLUDE_ID_TYPES = ["02", "03", "04", "05", "07", "0a", "0f", "0g", "0h"];

 /**
 * 需要展示合伙人信息的机构类型：21-普通合伙企业, 22-特殊普通合伙企业, 23-有限合伙企业,
 * 24-非法人非合伙制创投企业, 25a-私募基金管理人（合伙企业）
 */
const NEEDED_DISPLAYED_PARTNER_INFO_ORG_TYPES = ["21", "22", "23", "24", "25a"];

/**
 * 根据 ID_TYPE 修改国籍的显示与否和值
 * @param {object} _this 
 */
 const modifyCitizenshipAccordingToIdType = (_this) => {
    let docInfoFields = _this.groupDatas.MANAGER_INFO.MANAGER_DOC_INFO[0].FIELDS;
    let idType = docInfoFields.PRO_MANAGER_ID_TYPE.DEFAULT_VALUE;
    if (_.indexOf(["10", "11", "12", "13"], idType) != -1) {
        docInfoFields.CITIZENSHIP.FIELD_DICT_FILTER = "";
        docInfoFields.CITIZENSHIP.FIELD_CONTROL = "2";
        docInfoFields.CITIZENSHIP.DEFAULT_VALUE = "CHN";
    } else if ("14" == idType) {
        if (docInfoFields.CITIZENSHIP.DEFAULT_VALUE == "CHN") {
            docInfoFields.CITIZENSHIP.DEFAULT_VALUE = "";
        }
        docInfoFields.CITIZENSHIP.FIELD_DICT_FILTER = "!CHN";
        docInfoFields.CITIZENSHIP.FIELD_CONTROL = "0";
    } else if ("19" == idType) {
        docInfoFields.CITIZENSHIP.FIELD_DICT_FILTER = "";
        docInfoFields.CITIZENSHIP.FIELD_CONTROL = "0";
    }
}

/**
 * 根据《开户逻辑配置》获取境内外标识
 * @param {object} _this 
 * @param {string} idType 证件类型
 * @param {string} citizenship 注册国家
 */
 const getInoutsideIdentity = (_this) => {
    let docInfoFields = _this.groupDatas.MANAGER_INFO.MANAGER_DOC_INFO[0].FIELDS;
    let idType = docInfoFields.PRO_MANAGER_ID_TYPE.DEFAULT_VALUE;
    let citizenship = docInfoFields.CITIZENSHIP.DEFAULT_VALUE;
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
 * 隐藏 “获取验证码按钮”、“验证码输入框”
 * @param {object} _this 
 */
 const hideValidateCodeInput = (_this) => {
    let fields = _this.groupDatas.MANAGER_INFO.MANAGER_BASIC_INFO[0].FIELDS; 
    fields.MOBILE_TEL.IS_SHOW_BUTTON = false;
    fields.VALIDATE_CODE.DEFAULT_VALUE = "";
    fields.VALIDATE_CODE.FIELD_CONTROL = "1";
}

/**
 * 展示 “获取验证码按钮”、“验证码输入框”
 * @param {object} _this 
 */
const showValidateCodeInput = (_this) => {
    _this.oppBusiData.VALID_MOBILE = _this.oppBusiData.busiCommonParams.VALID_MOBILE || "1";
    if (_this.oppBusiData.VALID_MOBILE != "1") {
        return;
    }
    let fields = _this.groupDatas.MANAGER_INFO.MANAGER_BASIC_INFO[0].FIELDS; 
    fields.MOBILE_TEL.IS_SHOW_BUTTON = true;
    fields.MOBILE_TEL.FIELD_BUTTON_TXT = "获取验证码";
    fields.MOBILE_TEL.SUFFIX_ICON = "";
    fields.VALIDATE_CODE.FIELD_CONTROL = "0";
    fields.VALIDATE_CODE.DEFAULT_VALUE = "";
}

/**
 * 字段值是否与历史数据不一样
 * @param {object} _this 
 * @param {object} field  字段对象
 */
const isDifferentFromHistory = (_this, field) => {
    let historyManagerInfo = _.get(_this.historyData, "PRO_MANAGER_INFO");
    return _.isEmpty(historyManagerInfo) || field.DEFAULT_VALUE != historyManagerInfo[[field.FIELD_ID]];
}
/**
 * 字段值是否与原始数据不一样
 * @param {object} _this 
 * @param {object} field  字段对象
 */
const isDifferentFromOriginal = (_this, field) => {
    let originalManagerInfo = custInfoModel.getOriginaProManagerBasicInfo(_this.oppBusiData.oldBusiData);
    return _.isEmpty(originalManagerInfo) || field.DEFAULT_VALUE != originalManagerInfo[[field.FIELD_ID]];
}

const isShowPartnerInfoNeeded = (_this) => {
    let orgType = _this.groupDatas.MANAGER_INFO.MANAGER_BASIC_INFO[0].FIELDS.SZORG_TYPE.DEFAULT_VALUE;
    return NEEDED_DISPLAYED_PARTNER_INFO_ORG_TYPES.indexOf(orgType) > -1;
}

const showPartnerInfoModuleIfNeeded = (_this) => {
    let moduleControl = isShowPartnerInfoNeeded(_this) ? "1" : "0";
    _.each(_this.groupDatas.MANAGER_INFO.PARTNER_INFO, module => {
        module.MODULE_CONTROL = moduleControl;
    })
    let isOpenAcct = _this.$storage.getSession(_this.$definecfg.IS_OPEN_ACCT_BIZ) || "";
    if (isOpenAcct == "0") {
        //更新路由
        _this.busiLogic.leftUpadateRouter(_this);
    }
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
    _this.groupDatas.MANAGER_INFO.LEGAL_REP_INFO[0].MODULE_TITLE = moduleTitle;
    bizPublicMethod.$blMethod.filterOptionsButRetainHistoryOptions(_this, "MANAGER_INFO", "LEGAL_REP_INFO",
        "LEGAL_REP_ID_TYPE", idTypes, LEGAL_REP_EXCLUDE_ID_TYPES, custInfoModel.getOriginaOrgLegalRepInfo(_this.oppBusiData.oldBusiData));
}
/**
 * 根据《开户信息逻辑配置》，用“证件类型”、“产品类别”过滤注册国家选项
 * @param {object} _this 
 */
 const filterCitizenshipOptionsAccordingToOpenLogic = (_this) => {
    let idType = _this.groupDatas.PRO_INFO.DOC_INFO[0].FIELDS.ID_TYPE.DEFAULT_VALUE;
    let proCls = _this.groupDatas.PRO_INFO.PRODUCT_INFO[0].FIELDS.PRO_CLS.DEFAULT_VALUE;
    let params = {
        ID_TYPE: idType,
        PRO_CLS: proCls
    }
    let filteredOpenLogicData = bizPublicMethod.$blMethod.filterOpenLogicData(params, _this.oppBusiData.allAcctOpenLogicData);
    let citizenshipField = _this.groupDatas.MANAGER_INFO.MANAGER_DOC_INFO[0].FIELDS.CITIZENSHIP || {};
    citizenshipField.FIELD_DICT_FILTER = filteredOpenLogicData.CITIZENSHIP || [];
    clearFieldValueIfNotInOpenLogic(citizenshipField, filteredOpenLogicData.CITIZENSHIP);
    if (filteredOpenLogicData.CITIZENSHIP.length == 1) {
        citizenshipField.DEFAULT_VALUE = filteredOpenLogicData.CITIZENSHIP[0];
        citizenshipField.FIELD_CONTROL = "2";
    } else {
        citizenshipField.FIELD_CONTROL = "0";
    }
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
 * 根据“证件类型”、“注册国家”来修改“机构组织代码”的 FIELD_CONTROL
 * 规则：
 * 1、境外，1-不展示
 * 2、中国，证件类型为 10-营业执照：2-不可编辑；证件类型不为 10-营业执照：参照 ID_TYPE_ORG_ID_CODE_FIELD_CONTROL
 * @param {object} _this 
 */
 const modifyOrgIdCodeAccordingToIdTypeAndCitizenship = (_this) => {
    let docInfoFields = _this.groupDatas.MANAGER_INFO.MANAGER_DOC_INFO[0].FIELDS;
    let idType = docInfoFields.PRO_MANAGER_ID_TYPE.DEFAULT_VALUE;
    let citizenship = docInfoFields.CITIZENSHIP.DEFAULT_VALUE;
    if (!_.isEmpty(citizenship) && citizenship != "CHN") {
        docInfoFields.PRO_MANAGER_ASSI_CODE.FIELD_CONTROL = "1";
    } else if (idType == "10") {
        docInfoFields.PRO_MANAGER_ASSI_CODE.FIELD_CONTROL = "2";
    } else {
        docInfoFields.PRO_MANAGER_ASSI_CODE.FIELD_CONTROL = ID_TYPE_ORG_ID_CODE_FIELD_CONTROL[idType] || "0";
    }
}

/**
 * 回填历史数据
 * @param {object} _this 
 */
 const backfillHistoryData = (_this) => {
    let proManagerInfo = _this.historyData["PRO_MANAGER_INFO"];
    if (!_.isEmpty(proManagerInfo)) {
        bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["MANAGER_DOC_INFO"], proManagerInfo);
        bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["MANAGER_BASIC_INFO"], proManagerInfo);
        // 处理注册资金
        let fields = _this.groupDatas.MANAGER_INFO.MANAGER_DOC_INFO[0].FIELDS;
        if (!_.isEmpty(fields.REGISTER_FUND.DEFAULT_VALUE)) {
            fields.REGISTER_FUND.DEFAULT_VALUE = "" + 
            util.divide(myParseFloat(fields.REGISTER_FUND.DEFAULT_VALUE), 10000);
        }
    }
}

/**
 * 是否为中文字符
 * @param {string} char 
 * @returns 
 */
 const isChineseChar = (char) => {
    let reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
    return reg.test(char);
}

const isAllNumber = (s) => {
    let reg = new RegExp("[0-9]" + "{" + s.length + "}", "g");
    return reg.test(s);
}

/**
 * 获取地址长度，中文算两个字符
 * @param {string} address 
 */
const getAddressLength = (address) => {
    if (_.isEmpty(address) || address.length == 0) {
        return 0;
    }
    let count = 0;
    for (let i = 0; i < address.length; i++) {
        if (isChineseChar(address.charAt(i))) {
            count += 2;
        } else {
            count++;
        }
    }
    return count;
}

const isCorrectOverseasAddress = (address) => {
    if (_.isEmpty(address)) {
        return false;
    }
    address = address.replace("市辖区", "").replace(/不详/g, "").replace("其他", "");
    if (getAddressLength(address) <= 16 || isAllNumber(address)) {
        return false;
    }
    return true;
}

/**
 * 是否为正确的境内地址
 * @param {string} address 
 * @returns 
 */
 const isCorrectDomesticAddress = (address) => {
    if (_.isEmpty(address)) {
        return false;
    }
    address = address.replace(/不详/g, "").replace("其他", "");
    let addressTextInfo = parseAddress(address);
    let inputAddress = _.get(addressTextInfo, "[2]", "");
    inputAddress = inputAddress.replace(/不详/g, "").replace("其他", "");
    return bizPublicMethod.$blMethod.checkLeagelAddress(address, inputAddress);
}

const isCorrectAddress = (_this, address) => {
    let inoutsideIdentity = getInoutsideIdentity(_this);
    if (inoutsideIdentity == "0") {
        return isCorrectDomesticAddress(address);
    } else {
        return isCorrectOverseasAddress(address);
    }
}

const myParseFloat = (s) => {
    let result = parseFloat(s);
    return isNaN(result) ? 0 : result; 
}
/**
 * 根据工商营业执照自动填充组织机构代码
 * @param {object} orgIdCodeFiled 组织机构代码字段对象
 * @param {object} idCodeFiled 证件号码字段对象
 */
 const autofillOrgIdCode = (orgIdCodeField, idCodeField) => {
    orgIdCodeField.DEFAULT_VALUE = parseOrgIdCode(idCodeField.DEFAULT_VALUE);
    // orgIdCodeField.FIELD_CONTROL = "2";
}

/**
 * 解析工商营业执照得到组织机构代码
 * @param {string} idCode 18/24位工商营业执照 
 */
 const parseOrgIdCode = (idCode) => {
    let orgIdCode = "";
    if (typeof idCode == "string" && idCode.length == 18) {
        orgIdCode = idCode.substring(8, 16) + "-" + idCode.substr(16, 1);
    } else if (typeof idCode == "string" && idCode.length == 24) {
        orgIdCode = idCode.substring(15, 23) + "-" + idCode.substr(23, 1);
    }
    return orgIdCode;
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

const handleWrongIdCode = (_this, orgIdCodeField) => {
    pushMyFlowTip(_this, WRONG_ID_CODE_TIP_KEY, 
            "您的有效身份证明文件未加载统一社会信用代码，请先更新您的证件号码。", "error");
    _this.$nextTick( () => {
        orgIdCodeField.DEFAULT_VALUE = "";
        // orgIdCodeField.FIELD_CONTROL = "1";
    })
}
const isWrongIdCode = (idTypeField, idCodeField) => {
    let idType = idTypeField.DEFAULT_VALUE;
    let idCodeLength = idCodeField.DEFAULT_VALUE.length;
    return idType == "10" && !(idCodeLength == 18 || idCodeLength == 24);
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
 * 初始化模块字段配置
 * @param {object} _this 
 */
 const initFieldsConfig = (_this) => {
    let docInfoFields = _this.groupDatas.MANAGER_INFO.MANAGER_DOC_INFO[0].FIELDS;
    //读卡按钮改名字为MODULE_CONTROL_TXT 拍证识别
    _this.groupDatas.MANAGER_INFO.MANAGER_DOC_INFO[0].MODULE_CONTROL_TXT = "拍证识别";
    docInfoFields.PRO_MANAGER_NAME.VALID_TYPE = "val[4,64]";
    docInfoFields.CORP_ADDR.VALID_TYPE = "val[16,128]|on-blur";
    docInfoFields.BUSINESS_RANGE.VALID_TYPE = "normalinput|length[4,2000]|on-blur";
    docInfoFields.REGISTER_FUND.VALID_TYPE = "money[12,4]";
    docInfoFields.PRO_MANAGER_ID_TYPE.FIELD_DICT_FILTER = ["10", "11", "12", "13", "14", "19"];
    docInfoFields.CITIZENSHIP.showDictItem = "1";
    let managerBasicInfoFields = _this.groupDatas.MANAGER_INFO.MANAGER_BASIC_INFO[0].FIELDS;
    managerBasicInfoFields.TRADE.FIELD_DICT_FILTER = "!m";
    managerBasicInfoFields.SMFUND_MANAGER_ID.VALID_TYPE = "length[0,10]";
    managerBasicInfoFields.LEGAL_REP_TYPE.FIELD_DICT_FILTER = "01,03,07,08";
    managerBasicInfoFields.OFFICE_ADDR.FIELD_FUNCTION  = "CHECK_MANAGER_OFFICE_ADDR";
    managerBasicInfoFields.OFFICE_ADDR.FIELD_BUTTON_TXT = SYNC_ADDRESS_BUTTON_TEXT;
    managerBasicInfoFields.OFFICE_ADDR.VALID_TYPE = "length[16,128]";
    managerBasicInfoFields.OFFICE_TEL.VALID_TYPE = "tel";
    _.each(managerBasicInfoFields, (item, key) => {
        managerBasicInfoFields[key].labelWidth = "240";
    })
}
/**
 * 判断字段是否没有改变
 * @param {object} field 字段对象
 */
const isFieldValueNotChanged = (field) => {
    return field.LAST_DEFAULT_VALUE == field.DEFAULT_VALUE;
}
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
     *@method bizProManagerBasicInfoNodeBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     */
    bizProManagerBasicInfoNodeBeforeLoadBiz: async function (_this) {
        initFieldsConfig(_this);
        let managerBasicInfo = custInfoModel.getOriginaProManagerBasicInfo(_this.oppBusiData.oldBusiData);
        //对比数据的时候保证 oldGroupDatas的数据为正确的值
        if (!_.isEmpty(managerBasicInfo.REGISTER_FUND)) {
            managerBasicInfo.REGISTER_FUND = "" + 
                util.divide(myParseFloat(managerBasicInfo.REGISTER_FUND), 10000);
        }
        if (!_.isEmpty(managerBasicInfo)) {
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["MANAGER_DOC_INFO"], managerBasicInfo);
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["MANAGER_BASIC_INFO"], managerBasicInfo);
            showPartnerInfoModuleIfNeeded(_this);
        }
    },
    /*
     *@method bizProManagerBasicInfoNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     */
    bizProManagerBasicInfoNodeAfterLoadBiz: function (_this) {
        backfillHistoryData(_this);
        let docInfoFields = _this.groupDatas.MANAGER_INFO.MANAGER_DOC_INFO[0].FIELDS;
        docInfoFields.PRO_MANAGER_ASSI_CODE.FIELD_CONTROL = 
            docInfoFields.PRO_MANAGER_ID_TYPE.DEFAULT_VALUE == "10" ? "2" : "0";
        let managerBasicInfoFields = _this.groupDatas.MANAGER_INFO.MANAGER_BASIC_INFO[0].FIELDS;
        managerBasicInfoFields.SMFUND_MANAGER_ID.FIELD_CONTROL = 
            ["25a", "25b", "25"].indexOf(managerBasicInfoFields.SZORG_TYPE.DEFAULT_VALUE) > -1 ? "0" : "1";
            filterCitizenshipOptionsAccordingToOpenLogic(_this);
            modifyOrgIdCodeAccordingToIdTypeAndCitizenship(_this);
    },
    /*
     *@method bizProManagerBasicInfoNodeBeforeSave
     *@desc 钩子函数 自定义保存数
     */
    bizProManagerBasicInfoNodeBeforeSave: function (_this, params) {
        /** 1、从 groupDatas 中获取最新数据 */
        let docInfo = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "MANAGER_DOC_INFO");
        // 注册资金转换为 “元”
        docInfo.REGISTER_FUND = "" + util.multi(myParseFloat(docInfo.REGISTER_FUND), 10000);
        let basicInfo = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "MANAGER_BASIC_INFO");
        basicInfo.OFFICE_ADDR = basicInfo.OFFICE_ADDR.replace("市辖区","").replace(/不详/g,"").replace("辖县", "");
        let docInfoFields = _this.groupDatas.MANAGER_INFO.MANAGER_DOC_INFO[0].FIELDS;
        let basicInfoFields = _this.groupDatas.MANAGER_INFO.MANAGER_BASIC_INFO[0].FIELDS;
        // 私募基金管理人编码要特殊处理：如果字段隐藏了，要赋值为空
        if (basicInfoFields.SMFUND_MANAGER_ID.FIELD_CONTROL == "1") {
            basicInfo.SMFUND_MANAGER_ID = "";
        }
        // 组织机构代码要特殊处理：如果字段隐藏了，要赋值为空
        if (docInfoFields.PRO_MANAGER_ASSI_CODE.FIELD_CONTROL == "1") {
            docInfo.PRO_MANAGER_ASSI_CODE = "";
        }
        // 行业大类
        basicInfo.INDUS_GB = industryMap[basicInfo.TRADE];

        /** 2、获取原始数据 */
        let originalManagerBasicInfo = custInfoModel.getOriginaProManagerBasicInfo(_this.oppBusiData.oldBusiData);

        if (!_.isEmpty(originalManagerBasicInfo.CITIZENSHIP) && originalManagerBasicInfo.CITIZENSHIP != "CHN") {
            originalManagerBasicInfo.PRO_MANAGER_ASSI_CODE = "";
        }else if (ID_TYPE_ORG_ID_CODE_FIELD_CONTROL[originalManagerBasicInfo.ID_TYPE] == "1") {
            originalManagerBasicInfo.PRO_MANAGER_ASSI_CODE = "";
        }
        
        let oldDocInfo = bizPublicMethod.$blMethod.getOriginalFieldValues(docInfoFields, originalManagerBasicInfo);
        let oldBasicInfo = bizPublicMethod.$blMethod.getOriginalFieldValues(basicInfoFields, originalManagerBasicInfo);
        /** 修改后的数据与原始数据比较 */
        let docInfoDiff = bizPublicMethod.$blMethod.compareInfo2(oldDocInfo, docInfo, "");
        let basicInfoDiff = bizPublicMethod.$blMethod.compareInfo2(oldBasicInfo, basicInfo, "");
        docInfo.DIFF_INFO = docInfoDiff;
        basicInfo.DIFF_INFO = basicInfoDiff;

        let changedFieldIds = _.concat([], _.map(_.cloneDeep(docInfoDiff), "FIELD"), _.map(_.cloneDeep(basicInfoDiff), "FIELD"));
        let changedFieldIdsObj = {};
        _.each(changedFieldIds, obj => {
            changedFieldIdsObj[obj] = true;
        })
        /** 3、数据变更标志 */
        /**
         * 银河个性： 产品客户变更了客户名称、产品名称、证件类型、证件号码、管理人名称、管理人证件类型、管理人证件号码、
         * 私募基金管理人编码、管理人组织机构代码证、管理人法人名称中的任意一项  需要采集变更证明
         */
        let needCollectChangeFlag = 0;
        if (changedFieldIdsObj["PRO_MANAGER_NAME"] || changedFieldIdsObj["PRO_MANAGER_ID_TYPE"] ||
        changedFieldIdsObj["PRO_MANAGER_ID_CODE"] || changedFieldIdsObj["SMFUND_MANAGER_ID"] || 
        changedFieldIdsObj["PRO_MANAGER_ASSI_CODE"]) {
            needCollectChangeFlag = "1";
        }
        /** 4、数据转换 */
        basicInfo.OFFICE_TEL_INSIDE = basicInfo.OFFICE_TEL;
        basicInfo.ADDRESS = basicInfo.OFFICE_ADDR;
        if (docInfo.PRO_MANAGER_ID_TYPE == "10") {
            docInfo.ORG_ID_EXP_DATE = docInfo.PRO_MANAGER_ID_EXP_DATE;
        }
        /** 5、模块间的数据合并 */
        let proManagerInfo = Object.assign({}, _.cloneDeep(docInfo), _.cloneDeep(basicInfo));
        proManagerInfo.DIFF_INFO = _.unionBy(docInfo.DIFF_INFO, basicInfo.DIFF_INFO, "FIELD");
        let inoutsideIdentity = getInoutsideIdentity(_this);
        proManagerInfo.INOUTSIDE_IDENTITY = inoutsideIdentity;
        // 管理人电话号码应该落入联系人电话号码
        /** 6、添加到 params 中 */
        Object.assign(params, {
            PRO_MANAGER_INFO: Object.assign(params.PRO_MANAGER_INFO || {}, proManagerInfo),
            LEGAL_REP_TYPE_NEW: basicInfo.LEGAL_REP_TYPE,
            SZORG_TYPE_NEW: basicInfo.SZORG_TYPE,
            RISK_FACTOR: params.RISK_FACTOR || _.get(_this.oppBusiData.oldBusiData, "RISK_FACTOR", ""),
            NEED_COLLECT_CHANGE_FLAG_MANAGER: needCollectChangeFlag,
            INOUTSIDE_IDENTITY: inoutsideIdentity,
            // 防止差错处理: null
            PRO_MANAGER_IMPORT_INFO: {},
            ORG_LINK_INFO: {},
            PRO_SHAREREG_ORG_INFO: {},
            PRO_INVEST_ADVISER_INFO: {},
            isGrayCitizenship: _this.oppBusiData.isGrayCitizenship === undefined ? (params.isGrayCitizenship || "0") : (_this.oppBusiData.isGrayCitizenship == "1" ? "1" : "0")
        })
        /**开户数据保存 */
        if (_this.busiCode == "V0051") {
            let managerInfo = params.MANAGER_INFO || {};
            managerInfo.PRO_MANAGER_INFO = params.PRO_MANAGER_INFO;
            managerInfo.PRO_MANAGER_INFO.INOUTSIDE_IDENTITY = inoutsideIdentity;
            params.LEGAL_REP_TYPE = basicInfo.LEGAL_REP_TYPE;
            params.SZORG_TYPE = basicInfo.SZORG_TYPE;
            let orgInfo = params.ORG_INFO || {};
            orgInfo.ORG_BASIC_INFO.INOUTSIDE_IDENTITY = inoutsideIdentity;

            delete managerInfo.PRO_MANAGER_INFO.DIFF_INFO;
            Object.assign(params, {
                MANAGER_INFO: managerInfo
            })
        }

        //增加diffinfo 属性 用于展示
        let MANAGER_DOC_INFO = _this.groupDatas.MANAGER_INFO.MANAGER_DOC_INFO[0].FIELDS;
        let MANAGER_BASIC_INFO = _this.groupDatas.MANAGER_INFO.MANAGER_BASIC_INFO[0].FIELDS;
        let fieldsAll = _.assign({}, MANAGER_DOC_INFO, MANAGER_BASIC_INFO);
        let diffInfo = _.cloneDeep(proManagerInfo.DIFF_INFO);
        diffInfo = _.uniqBy(diffInfo, 'FIELD');
        _.each(diffInfo, item => {
            if (item.FIELD == "REGISTER_FUND") {
                item.OLD = "" + util.divide(myParseFloat(item.OLD), 10000);
                item.NEW = "" + util.divide(myParseFloat(item.NEW), 10000);
            }
        })
        let webShow = _this.$blMethod.addDiffAtt(fieldsAll, diffInfo);
        params.MANAGER_BASIC_WEB_SHOW = webShow;
        return params;
    },
    /*
     *@method bizProManagerBasicInfoNodeAfterSave
     *@desc 钩子函数 自定义保存数
     */
    bizProManagerBasicInfoNodeAfterSave: (_this, newData) => {
        
    },
    /*
     *@method bizProManagerBasicInfoNodeValidate
     *@desc 钩子函数 下一步验证
     */
    bizProManagerBasicInfoNodeValidate: function (_this) {
        let modules = _this.groupDatas.MANAGER_INFO.MANAGER_DOC_INFO;
        let fieldIds = ["PRO_MANAGER_ID_EXP_DATE"];
        let promiseArr = bizPublicMethod.$blMethod.getValidatePromises(_this, modules, fieldIds);
        return Promise.all(promiseArr).then( (res)=> {
            if (_.includes(res, false)) {
                return false;
            }
        })
    },

    /*
     *@method bizProManagerBasicInfoNodePageActivated
     *@desc 钩子函数：页面激活
     */
    bizProManagerBasicInfoNodePageActivated: function (_this, groupId) {
        //经营范围修改为多行模式
        let docInfoFields = _this.groupDatas.MANAGER_INFO.MANAGER_DOC_INFO[0].FIELDS;
        docInfoFields.BUSINESS_RANGE.VALID_TYPE = "normalinput|length[4,2000]|on-blur";
        _this.$nextTick(function () {
            setTimeout(() => {
                docInfoFields.BUSINESS_RANGE.VALID_TYPE = "text|length[4,2000]|on-blur";
            }, 10);
            docInfoFields.BUSINESS_RANGE.FIELD_AUTOSIZE = {
                minRows: 1,
                maxRows: 4
            }
        })
    },

    bizProManagerBasicInfoNodePreValidate: function(_this) {
    },

    //路由更新
    bizProManagerBasicInfoNodeUpdateRouter: (_this, bizRouteTable) => {
        //是否需要展示合伙人
        let isShow = isShowPartnerInfoNeeded(_this) == "1" ? "true" : "false";
        //合伙人数据
        let ORG_PARTNER_INFO_FLAG = _.get(_this.historyData, "MANAGER_INFO.ORG_PARTNER_INFO_FLAG", ""); 
        //合伙人所在路由 关联人信息
        let routerIndex = _this.$router.getRouteIndex("管理人关联人信息");
        let routerItem = bizRouteTable[routerIndex];
        if (routerItem.stepState == "isSonFinish" && isShow.toString() != ORG_PARTNER_INFO_FLAG.toString()) {
            bizRouteTable[routerIndex].stepState = "isWaiting";
        }
        return bizRouteTable;
    },
    //----------------------业务函数----------------------------------//

    "CHECK_PRO_MANAGER_ID_TYPE": (_this, field, fieldData) => {
        if (isFieldValueNotChanged(field)) {
            return;
        }
        if (!field.disableClear) {
            fieldData.PRO_MANAGER_ID_CODE.DEFAULT_VALUE = "";
            fieldData.PRO_MANAGER_ID_EXP_DATE.DEFAULT_VALUE = "";
        }
        field.disableClear = false;

        let HIS_ID_TYPE = _.get(_this.oppBusiData.oldBusiData, "PRO_MANAGER_INFO.PRO_MANAGER_ID_TYPE", '');
        let HIS_ID_CODE = _.get(_this.oppBusiData.oldBusiData, "PRO_MANAGER_INFO.PRO_MANAGER_ID_CODE", '');
        let HIS_ID_EXP_DATE = _.get(_this.oppBusiData.oldBusiData, "PRO_MANAGER_INFO.PRO_MANAGER_ID_EXP_DATE", '');
        if(field.DEFAULT_VALUE != '' && field.DEFAULT_VALUE == HIS_ID_TYPE) {
            fieldData.PRO_MANAGER_ID_CODE.DEFAULT_VALUE = HIS_ID_CODE || '';
            fieldData.PRO_MANAGER_ID_EXP_DATE.DEFAULT_VALUE = HIS_ID_EXP_DATE || '';
        }
        // modifyCitizenshipAccordingToIdType(_this);
        modifyOrgIdCodeAccordingToIdTypeAndCitizenship(_this);
        fieldData["PRO_MANAGER_ID_CODE"].VALID_TYPE = bizPublicMethod.$blMethod.getIdCodeValidType(field.DEFAULT_VALUE);
        field.LAST_DEFAULT_VALUE = field.DEFAULT_VALUE;
    },

    "CHECK_PRO_MANAGER_ID_CODE": (_this, field, fieldData) => {
        if (isFieldValueNotChanged(field)) {
            return;
        }
        removeMyFlowTip(_this, WRONG_ID_CODE_TIP_KEY);
        if (isWrongIdCode(fieldData["PRO_MANAGER_ID_TYPE"], field)) {
            handleWrongIdCode(_this, fieldData["PRO_MANAGER_ASSI_CODE"]);
        }
        if (isAbleToAutofillOrgIdCode(fieldData["PRO_MANAGER_ID_TYPE"], field)) {
            autofillOrgIdCode(fieldData["PRO_MANAGER_ASSI_CODE"], field);
        }
        field.LAST_DEFAULT_VALUE = field.DEFAULT_VALUE;
    },
    "CHECK_LEGAL_REP_TYPE": (_this, field, fieldData) => {
        if (isFieldValueNotChanged(field)) {
            return;
        }
        modifyLegalRepConfigAccordingToLegalType(_this, field.DEFAULT_VALUE);
        field.LAST_DEFAULT_VALUE = field.DEFAULT_VALUE;
    },
    "CHECK_SZORG_TYPE": (_this, field, fieldData) => {
        if (isFieldValueNotChanged(field)) {
            return;
        }
        fieldData.SMFUND_MANAGER_ID.FIELD_CONTROL = 
            ["25a", "25b", "25"].indexOf(field.DEFAULT_VALUE) > -1 ? "0" : "1";
        showPartnerInfoModuleIfNeeded(_this);
        field.LAST_DEFAULT_VALUE = field.DEFAULT_VALUE;
    },
    "USE_ID_ADDRESS__CLICK": (_this, field, fieldData) => {
        let idAddress = _this.groupDatas.MANAGER_INFO.MANAGER_DOC_INFO[0].FIELDS.CORP_ADDR.DEFAULT_VALUE;
        let btnTxt = field.FIELD_BUTTON_TXT;
        if (btnTxt == SYNC_ADDRESS_BUTTON_TEXT) {
            _this.$set(field, 'FIELD_BUTTON_TXT', CANCEL_ADDRESS_SYNC);
            _this.oppBusiData.linkAddrDefault = field.DEFAULT_VALUE;
            _this.oppBusiData.linkZipCodeDefault = fieldData.ZIP_CODE.DEFAULT_VALUE;
            field.DEFAULT_VALUE = idAddress;
            field.LAST_ADDRESS_REGION = field.DEFAULT_VALUE;
            if (field.showRegionSelector) {
                if (idAddress != "") {
                    let addressTextInfo = parseAddress(idAddress);
                    field.addressInfo = addressTextInfo;
                    field.addressCode = addressTextInfo[3] || "";
                    // 证件地址 idAddress 可能不包含地级市，获取到包含地级市的 addressTextInfo 后，需要对  
                    // field.DEFAULT_VALUE 重新赋值
                    // 注：如果将来组件兼容了不包含地级市的地址，以下这个 if 中的代码可以去掉
                    if (addressTextInfo && addressTextInfo[1] && addressTextInfo[1].length === 3) {
                        let address = addressTextInfo[1][0] + addressTextInfo[1][1] + addressTextInfo[1][2] +
                        (addressTextInfo[2] ? addressTextInfo[2] : "");
                        field.DEFAULT_VALUE = address;
                    }
                    let region = addressTextInfo[1] || [];
                    region = region.join("");
                    field.LAST_ADDRESS_REGION = _.cloneDeep(region);
                }
                if (fieldData.ZIP_CODE && "addressInfo" in field) {
                    if (field.addressInfo && field.addressInfo.length > 3 && !_.isEmpty(field.addressInfo[3])) {
                        fieldData.ZIP_CODE.DEFAULT_VALUE = field.addressInfo[3];
                        fieldData.ZIP_CODE.correct = true;
                    }
                }
            }
        } else if (btnTxt == CANCEL_ADDRESS_SYNC) {
            _this.$set(field, 'FIELD_BUTTON_TXT', SYNC_ADDRESS_BUTTON_TEXT);
            field.DEFAULT_VALUE = _this.oppBusiData.linkAddrDefault;
            fieldData.ZIP_CODE.DEFAULT_VALUE = _this.oppBusiData.linkZipCodeDefault;
            if (field.showRegionSelector) {
                let addressTextInfo = parseAddress(field.DEFAULT_VALUE );
                let region = addressTextInfo[1] || [];
                region = region.join("");
                field.LAST_ADDRESS_REGION = _.cloneDeep(region);
            }
        }
    },
    "CHECK_MANAGER_OFFICE_ADDR": (_this, field, fieldData) => {
        removeMyFlowTip(_this, WRONG_OFFICE_ADDRESS_TIP_KEY);
        if (!isCorrectAddress(_this, field.DEFAULT_VALUE)) {
            pushMyFlowTip(_this, WRONG_OFFICE_ADDRESS_TIP_KEY, WRONG_OFFICE_ADDRESS_TIP_TITLE, "error");
        }
        let addressTextInfo = parseAddress(field.DEFAULT_VALUE);
        if (fieldData.ZIP_CODE) {
            if (addressTextInfo && addressTextInfo.length > 3 && !_.isEmpty(addressTextInfo[3])) {
                fieldData.ZIP_CODE.DEFAULT_VALUE = addressTextInfo[3];
                fieldData.ZIP_CODE.correct = true;
            }
        }
    },
    "CHECK_PRO_MANAGER_ID_EXP_DATE": (_this, field, fieldData, module) => {
        if (bizPublicMethod.$blMethod.isExpired(_this, field.DEFAULT_VALUE)) {
            _this.$nextTick( () => {
                bizPublicMethod.$blMethod.changeFieldError(field, false, field.FIELD_TITLE + "已过期");
            })
            return false;
        }
    },
    "CHECK_MOBILE_TEL": (_this, field, fieldData) => {
        if (isFieldValueNotChanged(field)) {
            return;
        }
        if (isDifferentFromOriginal(_this, field) && isDifferentFromHistory(_this, field)) {
            _this.$nextTick(() => {
                showValidateCodeInput(_this);
            })
        } else {
            _this.$nextTick(() => {
                hideValidateCodeInput(_this);
            })
        }
        field.LAST_DEFAULT_VALUE = field.DEFAULT_VALUE;
    },
    "CHECK_MOBILE_TEL__CLICK": _.debounce(async function (_this, field, fieldData) {
        if (field.disableNext) {
            return;
        }
        let mobileField = _this.groupDatas.MANAGER_INFO.MANAGER_BASIC_INFO[0].FIELDS.MOBILE_TEL;
        let codeField = _this.groupDatas.MANAGER_INFO.MANAGER_BASIC_INFO[0].FIELDS.VALIDATE_CODE;
        field.disableNext = true;
        let runValidateMobileData = await bizPublicMethod.$blMethod.runValidateGetMobileCode(_this, mobileField, codeField);
        field.disableNext = false;
        if (!runValidateMobileData) {
            return;
        }
        let userInfo = _this.$storage.getJsonSession(_this.$definecfg.USER_INFO);
        let mobile = fieldData.MOBILE_TEL.DEFAULT_VALUE || "";
        let params = {
            MOBILE: mobile,
            ORG_CODE: getOrgCodeAndOrgName(_this).ORG_CODE
        }
        _this.$blMethod.getVerificationCode(_this, params, field, 60, () => {
            fieldData.VALIDATE_CODE.DEFAULT_VALUE = "";
        });
    }, 1000, {
            'leading': true,
            'trailing': false
    }),
    "CHECK_VALIDATE_CODE": (_this, field, fieldData) => {
        if (field.FIELD_CONTROL == "1") {
            return;
        }
        let params = {
            MOBILE: fieldData["MOBILE_TEL"].DEFAULT_VALUE,
            AUTH_CODE: field.DEFAULT_VALUE
        }
        bizPublicMethod.$blMethod.validateVerificationCode(_this, params, field, fieldData.MOBILE_TEL, () => {
            fieldData.MOBILE_TEL.SUFFIX_ICON = "el-icon-success";
            hideValidateCodeInput(_this);
        });
    },
    "CHECK_CITIZENSHIP":async (_this, field, fieldData) => {
        let officeAddrField = _this.groupDatas.MANAGER_INFO.MANAGER_BASIC_INFO[0].FIELDS.OFFICE_ADDR;
        if (field.DEFAULT_VALUE == "CHN") {
            officeAddrField.showRegionSelector = true;
        } else {
            officeAddrField.showRegionSelector = false;
        }
        modifyOrgIdCodeAccordingToIdTypeAndCitizenship(_this);

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
}
