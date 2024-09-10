/*
 *   产品基本信息模块
 *   方法封装
 */

import date from '../../../../../../../tools/date.js'
import * as utils from "../../../../../../../tools/util"
import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../../business/businessTools/bizPublicMethod.js"
import custInfoModel  from "../../common/cust-info-model"

import custService from '../../../../../../../service/cust-service.js'


/**
 * 产品类别与产品代码字段控制的映射关系
 * 0-正常（必填），1-隐藏
 */
const PRO_CLS_FUND_CODE_MAP = {
    "01": "1",
    "02": "1",
    "02a": "1",
    "02b": "1",
    "02c": "1",
    "02d": "1",
    "02e": "1",
    "02f": "1",
    "03": "1",
    "03a": "1",
    "05b": "1",
    "05c": "1",
    "04": "1",
    "05": "1",
    "05a": "1",
    "06": "0",
    "07": "0",
    "08": "1",
    "09": "1",
    "10": "1",
    "10a": "1",
    "11": "1",
    "12": "1",
    "13": "1",
    "14": "1",
    "14a": "1",
    "15": "1",
    "16": "1",
    "17": "1",
    "18": "1",
    "19": "1",
    "20": "1",
    "21": "1",
    "22": "1",
    "23": "1",
    "23a": "1",
    "23b": "1",
    "23c": "1",
    "23d": "1",
    "23e": "1",
    "23f": "1",
    "24": "1",
    "25": "1",
    "26": "1",
    "99": "1",
    "99a": "1",
    "99e": "1",
    "99f": "1",
    "99k": "1",
    "99m": "1"
}

/**
 * 产品类别与备案编码字段控制的映射关系
 * 0-正常（必填），1-隐藏，00-正常（非必填）
 */
 const PRO_CLS_PRO_BAK_CODE_MAP = {
    "01": "0",
    "02": "00",
    "02a": "00",
    "02b": "00",
    "02c": "00",
    "02d": "00",
    "02e": "00",
    "02f": "00",
    "03": "0",
    "03a": "0",
    "05b": "0",
    "05c": "0",
    "04": "0",
    "05": "0",
    "05a": "0",
    "06": "1",
    "07": "1",
    "08": "0",
    "09": "00",
    "10": "00",
    "10a": "00",
    "11": "00",
    "12": "0",
    "13": "00",
    "14": "00",
    "14a": "00",
    "15": "0",
    "16": "0",
    "17": "00",
    "18": "00",
    "19": "00",
    "20": "00",
    "21": "00",
    "22": "00",
    "23": "0",
    "23a": "0",
    "23b": "0",
    "23c": "0",
    "23d": "0",
    "23e": "0",
    "23f": "0",
    "24": "0",
    "25": "0",
    "26": "00",
    "99": "00",
    "99a": "00",
    "99e": "00",
    "99f": "00",
    "99k": "00",
    "99m": "00"
}

/**
 * 产品类别需要屏蔽并置空（存量）的字典项
 */
const EXCLUDE_PRO_CLS = ["27", "28", "99b", "99c", "99d", "99g", "99h", "99i", "99j", "99l"];

/**
 * 是否展示备案编码
 * @param {string} proCls 产品类别 
 */
const isShowProBakCode = (proCls) => {
    return PRO_CLS_PRO_BAK_CODE_MAP[proCls] == "0" || PRO_CLS_PRO_BAK_CODE_MAP[proCls] == "00";
}
/**
 * 是否展示产品代码
 * @param {string} proCls 产品类别 
 */
const isShowFunCode = (proCls) => {
    return PRO_CLS_FUND_CODE_MAP[proCls] == "0";
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
 * 根据《开户信息逻辑配置》，用“证件类型”、“主体身份”、“境内外标识”过滤法人代表选项
 * @param {object} _this 
 */
const filterLegalRepOptionsAccordingToOpenLogic = (_this) => {
    let idType = _this.groupDatas.PRO_INFO.DOC_INFO[0].FIELDS.ID_TYPE.DEFAULT_VALUE;
    let params = {
        ID_TYPE: idType,
        SUBJECT_IDENTITY: "0",
        INOUTSIDE_IDENTITY: "0",
        CITIZENSHIP: "CHN",
    }
    let filteredOpenLogicData = bizPublicMethod.$blMethod.filterOpenLogicData(params, _this.oppBusiData.allAcctOpenLogicData);
    if (_this.busiCode == "V0051") {
        bizPublicMethod.$blMethod.filterOptionsAndEmptyExcludedOption(_this, "PRO_INFO", "PRODUCT_INFO", 
            "PRO_CLS", EXCLUDE_PRO_CLS, filteredOpenLogicData.PRO_CLS);
    } else {
        bizPublicMethod.$blMethod.filterOptionsAndEmptyExcludedOption(_this, "PRO_INFO", "PRODUCT_INFO", 
            "PRO_CLS", EXCLUDE_PRO_CLS);
    }
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
 * 查询证券账户开户初始化数据
 */
const getAcctOpenInitData = (_this) => {
    return _this.$syscfg.K_Request("W0000075", {
      BUSI_CODE: _this.busiCode,
      USER_TYPE: _this.userType
    });
};

/**
 * 回填历史数据
 * @param {object} _this 
 */
const backfillHistoryData = (_this) => {
    let proBasicInfo = _this.historyData["PRO_BASIC_INFO"];
    if (!_.isEmpty(proBasicInfo)) {
        bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["DOC_INFO"], proBasicInfo);
        bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["PRODUCT_INFO"], proBasicInfo);
    }
}

/**
 * 根据产品类型，修改产品代码、备案编号的字段控制（显示与否、是否必填等）
 * @param {object} _this 
 */
const modifyFundCodeAndProBakCodeConfigAccordingToProCls = (_this) => {
    let productFields = _this.groupDatas.PRO_INFO.PRODUCT_INFO[0].FIELDS;
    let proCls = productFields.PRO_CLS.DEFAULT_VALUE;
    if (!_.isEmpty(proCls)) {
        productFields.FUND_CODE.FIELD_CONTROL = PRO_CLS_FUND_CODE_MAP[proCls];
        if (PRO_CLS_PRO_BAK_CODE_MAP[proCls] == "00") {
            productFields.PRO_BAK_CODE.FIELD_REQUIRED = "0";
            productFields.PRO_BAK_CODE.FIELD_CONTROL = "0";
        } else {
            productFields.PRO_BAK_CODE.FIELD_CONTROL = PRO_CLS_PRO_BAK_CODE_MAP[proCls];
            productFields.PRO_BAK_CODE.FIELD_REQUIRED = "1";
        }
    }
}

const initFieldConfig = (_this) => {
    let docInfoFields = _this.groupDatas.PRO_INFO.DOC_INFO[0].FIELDS;
    docInfoFields.CUST_FNAME.VALID_TYPE = "val[4,256]";
    docInfoFields.CUST_NAME.VALID_TYPE = "val[4,32]";
    docInfoFields.ID_TYPE.FIELD_DICT_FILTER = _this["oppBusiData"]["VALID_ID_TYPE_FOR_PRO"];//"10,11,12,13";
    let productFields = _this.groupDatas.PRO_INFO.PRODUCT_INFO[0].FIELDS;
    productFields.PRO_NAME.VALID_TYPE = "val[4,120]";
    productFields.PRO_SIZE.VALID_TYPE = "money[12,4]|on-blur";
    productFields.PRO_BAK_CODE.VALID_TYPE = "address[1,48]|on-blur";
    productFields.FUND_CODE.VALID_TYPE = "length[1,32]";
}
/**
 * 判断字段是否没有改变
 * @param {object} field 字段对象
 */
const isFieldValueNotChanged = (field) => {
    return field.LAST_DEFAULT_VALUE == field.DEFAULT_VALUE;
}

/**
 * 获取小数位位数
 * @param {string} s 
 * @returns 
 */
const getDecimalFractionNum = (s) => {
    if (_.isEmpty(s) || !s.includes(".") || isNaN(s)) {
        return 0;
    }
    return s.length - s.indexOf(".") - 1;
}

/**
 * 补零
 * @param {string} s 
 * @param {number} zeroNum 
 * @returns 
 */
const fillZero = (s, zeroNum) => {
    if (!_.isEmpty(s) && getDecimalFractionNum(s) < zeroNum) {
        let num = getDecimalFractionNum(s);
        let base = num == 0 ? "." : "";
        let zero = "";
        for (let i = num; i < zeroNum; i++) {
            zero += "0";
        }
        s = s + base + zero;
    }
    return s;
}

export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizProBasicInfoNodeBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     */
    bizProBasicInfoNodeBeforeLoadBiz: async function (_this) {
        initFieldConfig(_this);
        let basicInfo = custInfoModel.getOriginaOrgBasicInfoByPro(_this.oppBusiData.oldBusiData);
        if (!_.isEmpty(basicInfo)) {
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["DOC_INFO"], basicInfo);
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["PRODUCT_INFO"], basicInfo);
        }
        if (_this.busiCode == "V0051") {
            // 填充三要素
            let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
            let fields = _this.groupDatas.PRO_INFO.DOC_INFO[0].FIELDS;
            fields.CUST_FNAME.DEFAULT_VALUE = customerInfo.CUST_FNAME;
            fields.ID_TYPE.DEFAULT_VALUE = customerInfo.ID_TYPE;
            fields.ID_CODE.DEFAULT_VALUE = customerInfo.ID_CODE;

            // 存在读卡信息并回填
            let ocrReadInfo = _this.$store.state.ocrReadInfo;
            if(!_.isEmpty(ocrReadInfo)) {
                fields.CUST_NAME.DEFAULT_VALUE = ocrReadInfo.CUST_NAME;

                // fields.ID_EXP_DATE.DEFAULT_VALUE = ocrReadInfo.ID_EXP_DATE;
                // fields.CORP_ADDR.DEFAULT_VALUE = ocrReadInfo.ID_ADDR;
                // fields.BUSINESS_RANGE.DEFAULT_VALUE = ocrReadInfo.BUSINESS_SCOPE;
                // fields.BIRTHDAY.DEFAULT_VALUE = ocrReadInfo.FOUND_DATE;  
                // fields.CITIZENSHIP.DEFAULT_VALUE = "CHN";
                // fields.REGISTER_FUND.DEFAULT_VALUE = ocrReadInfo.REGISTER_FUND;
                // fields.REGISTER_CURRENCY.DEFAULT_VALUE = ocrReadInfo.REGISTER_CURRENCY;
            } 

            // 投资者分类、投资者来源
            let productFields = _this.groupDatas.PRO_INFO.PRODUCT_INFO[0].FIELDS;
            productFields.PROF_INVESTOR_TYPE.DEFAULT_VALUE = "1";
            productFields.PROF_INVESTOR_SOURCE.DEFAULT_VALUE = "10";
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
        }
    },
    /*
     *@method bizProBasicInfoNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     */
    bizProBasicInfoNodeAfterLoadBiz: function (_this) {
        backfillHistoryData(_this);
        modifyFundCodeAndProBakCodeConfigAccordingToProCls(_this);
        if (_this.busiCode == "V0051") {
            let productFields = _this.groupDatas.PRO_INFO.PRODUCT_INFO[0].FIELDS;
            productFields.PRO_NAME_TIP.DEFAULT_VALUE = "请填写在基金业协会或有关备案部门备案证明上的名称";
        }
        filterLegalRepOptionsAccordingToOpenLogic(_this);
    },
    /*
     *@method bizProBasicInfoNodeBeforeSave
     *@desc 钩子函数 自定义保存数
     */
    bizProBasicInfoNodeBeforeSave: function (_this, params) {
        /** 1、从 groupDatas 中获取最新数据 */
        let docInfo = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "DOC_INFO");
        let productInfo = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "PRODUCT_INFO");
        let productFields = _this.groupDatas.PRO_INFO.PRODUCT_INFO[0].FIELDS;

        /** 2、获取原始数据 */
        let docInfoFields = _this.groupDatas.PRO_INFO.DOC_INFO[0].FIELDS;
        let originalBasicInfo = custInfoModel.getOriginaOrgBasicInfoByPro(_this.oppBusiData.oldBusiData) || {};
        let oldDocInfo = bizPublicMethod.$blMethod.getOriginalFieldValues(docInfoFields, originalBasicInfo);
        let oldProductInfo = bizPublicMethod.$blMethod.getOriginalFieldValues(productFields, originalBasicInfo);
        docInfo.INOUTSIDE_IDENTITY = getInoutsideIdentity(_this);
        // 产品代码、备案编码要特殊处理：如果原始数据是显示的，现在被隐藏了，要赋值为空
        if (isShowFunCode(oldProductInfo.PRO_CLS) && !isShowFunCode(productInfo.PRO_CLS)) {
            productInfo.FUND_CODE = "";
        }
        if (isShowProBakCode(oldProductInfo.PRO_CLS) && !isShowProBakCode(productInfo.PRO_CLS)) {
            productInfo.PRO_BAK_CODE = "";
        }
        oldDocInfo.INOUTSIDE_IDENTITY = originalBasicInfo.INOUTSIDE_IDENTITY;
        // 加上反洗钱类型
        docInfo.AML_CUST_TYPE = _this.groupDatas.BENEFICIARY_INFO.AML_INFO[0].FIELDS.AML_CUST_TYPE.DEFAULT_VALUE;
        oldDocInfo.AML_CUST_TYPE = originalBasicInfo.AML_CUST_TYPE;
        /** 修改后的数据与原始数据比较 */
        let docInfoDiff = bizPublicMethod.$blMethod.compareInfo2(oldDocInfo, docInfo, "");
        let productInfoDiff = bizPublicMethod.$blMethod.compareInfo2(oldProductInfo, productInfo, "");
        docInfo.DIFF_INFO = docInfoDiff;
        productInfo.DIFF_INFO = productInfoDiff;

        let changedFieldIds = _.concat([], _.map(_.cloneDeep(docInfoDiff), "FIELD"), _.map(_.cloneDeep(productInfoDiff), "FIELD"));
        let changedFieldIdsObj = {};
        _.each(changedFieldIds, obj => {
            changedFieldIdsObj[obj] = true;
        })

        /** 3、数据变更标志 */
        let tempParam = {};
        // 若变更了三要素
        if (changedFieldIdsObj["CUST_FNAME"] || changedFieldIdsObj["ID_TYPE"] || changedFieldIdsObj["ID_CODE"]) {
            tempParam.isChangeImportant = "1";
            tempParam.isNotmorMal = "1";
            tempParam.CHANGE_IMPORTANT_FLAG_YINHE = "1";
        }
        // 证件信息
        if (changedFieldIdsObj["ID_CODE"] || changedFieldIdsObj["ID_EXP_DATE"]) {
            tempParam.isOrgIdInfoChange = "1"; 
        }
        /**
         * 银河个性： 产品客户变更了客户名称、产品名称、证件类型、证件号码、管理人名称、管理人证件类型、管理人证件号码、
         * 私募基金管理人编码、管理人组织机构代码证、管理人法人名称中的任意一项  需要采集变更证明
         */
         let needCollectChangeFlag = "0";
         if (changedFieldIdsObj["CUST_FNAME"] || changedFieldIdsObj["PRO_NAME"] ||
         changedFieldIdsObj["ID_TYPE"] || changedFieldIdsObj["ID_CODE"]) {
             needCollectChangeFlag = "1";
         }
        /** 4、数据转换 */
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
        /** 5、模块间的数据合并 */
        let proBasicInfo = Object.assign({}, _.cloneDeep(docInfo), _.cloneDeep(productInfo));
        proBasicInfo.DIFF_INFO = _.unionBy(docInfo.DIFF_INFO, productInfo.DIFF_INFO, "FIELD");
        /** 6、添加到 params 中 */
        Object.assign(params, {
            NEW_BASE_INFO: Object.assign(params.NEW_BASE_INFO || {}, 
                proBasicInfo
            ),
            OLD_BASE_INFO: Object.assign(params.OLD_BASE_INFO || {}, 
                _.cloneDeep(oldDocInfo), _.cloneDeep(oldProductInfo)
            ),
            PRO_BASIC_INFO: Object.assign(params.PRO_BASIC_INFO || {}, proBasicInfo, {
                ID_EXP_DATE: originalBasicInfo.ID_EXP_DATE || ""
            }),
            CHANGE_IMPORTANT_FLAG: tempParam.isChangeImportant || "0",
            NOT_NORMAL: tempParam.isNotmorMal || "0",
            CHANGE_IMPORTANT_FLAG_YINHE: tempParam.CHANGE_IMPORTANT_FLAG_YINHE,
            IS_ORG_ID_INFO_CHANGE: tempParam.isOrgIdInfoChange || "0",
            AML_CUST_TYPE: docInfo.AML_CUST_TYPE,
            NEED_COLLECT_CHANGE_FLAG_BASIC: needCollectChangeFlag,
            AML_FLAG: true,
        })

        /**开户数据保存 */
        if (_this.busiCode == "V0051") {
            let orgInfo = params.ORG_INFO || {};
            orgInfo.ORG_BASIC_INFO = params.PRO_BASIC_INFO;
            delete orgInfo.ORG_BASIC_INFO.DIFF_INFO;
            orgInfo.ORG_BASIC_INFO.INOUTSIDE_IDENTITY = getInoutsideIdentity(_this);
            // 开户补充ORG_OPEN_TEMPLATE
            orgInfo.ORG_OPEN_TEMPLATE = _this.oppBusiData.OPEN_TEMPLATE;
            // 开通协议、操作渠道
            Object.assign(orgInfo.ORG_BASIC_INFO, {
                CUST_AGMT_TYPE:_this.oppBusiData.OPEN_TEMPLATE.CUST_AGMT_TYPES,
                CHANNELS: bizPublicMethod.$blMethod.separate(_this.oppBusiData.OPEN_TEMPLATE.CHANNELS, ","),
            })
            // 审核端字段显示不全，需添加此字段
            orgInfo.ORG_ACTUAL_CONTROLER_INFO = [];
            // 专业投资者告知及确认书影像所需要字段
            params.PROF_INVESTOR_SOURCE_TEXT = bizPublicMethod.$blMethod.getFieldDictItemName(productFields.PROF_INVESTOR_SOURCE);
            params.PROF_EXP_DATE = "30001231";
            params.SIGN_DATE = _this.oppBusiData.SYS_DATE;
            // y087-投资者基本信息表（机构）
            orgInfo.ORG_BASIC_INFO.ID_TYPE_TEXT = bizPublicMethod.$blMethod.getFieldDictItemName(docInfoFields.ID_TYPE);
            Object.assign(params, {
                ORG_INFO: orgInfo,
                PROF_INVESTOR_TYPE: proBasicInfo.PROF_INVESTOR_TYPE,
                PROF_INVESTOR_SOURCE: proBasicInfo.PROF_INVESTOR_SOURCE,
                CUST_AGMT_TYPE: _this.oppBusiData.OPEN_TEMPLATE.CUST_AGMT_TYPES,
                CHANNELS: _this.oppBusiData.OPEN_TEMPLATE.CHANNELS,
                // 风险测评数据置空
                RISK_INFO: [],
                RATINT_LVL_FLAG: "",
                PRO_CLS: orgInfo.ORG_BASIC_INFO.PRO_CLS || ""
            })
        }

        //增加diffinfo 属性 用于展示
        let DOC_INFO = _this.groupDatas.PRO_INFO.DOC_INFO[0].FIELDS;
        let PRODUCT_INFO = _this.groupDatas.PRO_INFO.PRODUCT_INFO[0].FIELDS;
        let AML_INFO = _this.groupDatas.BENEFICIARY_INFO.AML_INFO[0].FIELDS;
        let fieldsAll = _.assign({}, DOC_INFO, PRODUCT_INFO, AML_INFO);
        let diffInfo = _.cloneDeep(proBasicInfo.DIFF_INFO);
        diffInfo = _.uniqBy(diffInfo, 'FIELD');
        _.each(diffInfo, item => {
            if (item.FIELD == "USER_FNAME") {
                item.FIELD = "CUST_FNAME" 
            }
            if (item.FIELD == "USER_NAME") {
                item.FIELD = "CUST_NAME"
            }
        })
        let webShow = _this.$blMethod.addDiffAtt(fieldsAll, diffInfo);
        params.BASIC_WEB_SHOW = webShow;
        return params;
    },
    /*
     *@method bizProBasicInfoNodeAfterSave
     *@desc 钩子函数 自定义保存数
     */
    bizProBasicInfoNodeAfterSave: (_this, newData) => {
        
    },
    /*
     *@method bizProBasicInfoNodeValidate
     *@desc 钩子函数 下一步验证
     */
    bizProBasicInfoNodeValidate: function (_this) {
        let modules = _this.groupDatas.PRO_INFO.PRODUCT_INFO;
        let fieldIds = ["PRO_EXP_DATE"];
        let promiseArr = bizPublicMethod.$blMethod.getValidatePromises(_this, modules, fieldIds);
        return Promise.all(promiseArr).then( (res)=> {
            if (_.includes(res, false)) {
                return false;
            }
        })
    },

    /*
     *@method bizProBasicInfoNodePageActivated
     *@desc 钩子函数：页面激活
     */
    bizProBasicInfoNodePageActivated: function (_this, groupId) {
        
    },

    bizProBasicInfoNodePreValidate: function(_this) {
    },
    //----------------------业务函数----------------------------------//


    "CHECK_ID_TYPE": (_this, field, fieldData) => {
        if (isFieldValueNotChanged(field)) {
            return;
        }
        filterLegalRepOptionsAccordingToOpenLogic(_this);
        filterCitizenshipOptionsAccordingToOpenLogic(_this);
        // 修改证件类型，则自动将证件号码清空
        fieldData.ID_CODE.DEFAULT_VALUE = "";

        let HIS_ID_TYPE = _.get(_this.oppBusiData.oldBusiData, "CUST_BASIC_INFO.ID_TYPE", '');
        let HIS_ID_CODE = _.get(_this.oppBusiData.oldBusiData, "CUST_BASIC_INFO.ID_CODE", '');
        if(field.DEFAULT_VALUE != '' && field.DEFAULT_VALUE == HIS_ID_TYPE) {
            fieldData.ID_CODE.DEFAULT_VALUE = HIS_ID_CODE || '';
        }

        fieldData["ID_CODE"].VALID_TYPE = bizPublicMethod.$blMethod.getIdCodeValidType(field.DEFAULT_VALUE);
        field.LAST_DEFAULT_VALUE = field.DEFAULT_VALUE;
    },
    "CHECK_PRO_CLS": (_this, field, fieldData) => {
        if (isFieldValueNotChanged(field)) {
            return;
        }
        modifyFundCodeAndProBakCodeConfigAccordingToProCls(_this);
        filterCitizenshipOptionsAccordingToOpenLogic(_this);
        field.LAST_DEFAULT_VALUE = field.DEFAULT_VALUE;
    },
    "CHECK_PRO_EXP_DATE": (_this, field, fieldData, module) => {
        if (bizPublicMethod.$blMethod.isExpired(_this, field.DEFAULT_VALUE)) {
            _this.$nextTick( () => {
                bizPublicMethod.$blMethod.changeFieldError(field, false, field.FIELD_TITLE + "已过期");
            })
            return false;
        }
    },
    "CHECK_PRO_SIZE": (_this, field, fieldData, module) => {
        if (!_.isEmpty(field.DEFAULT_VALUE) && getDecimalFractionNum(field.DEFAULT_VALUE) < 4 && field.currentValid == "blur") {
            _this.$nextTick( () => {
                field.DEFAULT_VALUE = fillZero(field.DEFAULT_VALUE, 4);
            })
        }
    },
}
