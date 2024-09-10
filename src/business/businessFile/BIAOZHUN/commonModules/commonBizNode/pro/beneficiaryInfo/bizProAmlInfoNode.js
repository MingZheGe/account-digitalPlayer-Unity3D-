/*
 *   受益所有人类型
 *   方法封装
 */

import date from '../../../../../../../tools/date.js'
import * as utils from "../../../../../../../tools/util"
import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../businessTools/bizPublicMethod.js"
import custInfoModel from '../../common/cust-info-model.js'

const GROUP_ID = "BENEFICIARY_INFO";

/**
 * “非自然人身份类别”需要屏蔽的字典项
 */
const EXCLUDE_AML_CUST_TYPES = ["1", "2", "3", "4", "5", "6"];

/**
 * 非自然人身份类别（反洗钱客户类型）与受益所有人类型的映射关系
 */
const AML_CUST_TYPE_BENEFICIARY_TYPES_MAP = {
    "1": [],
    "2": ["1", "2", "3"],
    "3": ["2", "4", "5", "6"],
    "4": ["7"],
    "5": ["7"],
    "6": ["7"],
    "7": ["8"],
    "8": ["9", "a"],
    "9": ["9", "a"],
    "a": ["1", "2", "3", "b"]
}

/**
 * 受益人类型与展示持股比例的映射关系
 */
const BENEFICIARY_TYPE_SHOW_SHARE_RADIO_MAP = {
    "1": true,
    "2": false,
    "3": false,
    "4": true,
    "5": false,
    "6": false,
    "7": false,
    "8": false,
    "9": true,
    "a": false,
    "b": false
}


const backfillHistoryData = (_this) => {
    let proBasicInfo = _this.historyData["PRO_BASIC_INFO"];
    let beneficiaryOwnerInfo = _this.historyData["ORG_BENEFICIARY_OWNER_INFO"];
    let amlInfo = _.pick(proBasicInfo, "AML_CUST_TYPE", "BENEFICIARY_TYPE")
    if (!_.isEmpty(amlInfo)) {
        if (!_.isEmpty(beneficiaryOwnerInfo)) {
            amlInfo.BENEFICIARY_TYPE = beneficiaryOwnerInfo[0].BENEFICIARY_TYPE;
        }
        bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["AML_INFO"], amlInfo);
    }
}

/**
 * 判断字段是否没有改变
 * @param {object} field 字段对象
 */
const isFieldValueNotChanged = (field) => {
    return field.LAST_DEFAULT_VALUE == field.DEFAULT_VALUE;
}

/**
 * 根据非自然人身份类型（反洗钱客户类型）修改受益人可选选项，同时清空受益人当前选择
 * @param {object} beneficiaryTypeField 
 * @param {string} amlCustType 非自然人身份类别
 */
const modifyAvailableBeneficiaryTypesAccordingToAmlCustTypeAndClear = (beneficiaryTypeField, amlCustType) => {
    let availableBeneficiaryTypes = _.isEmpty(amlCustType) ? [] : 
            AML_CUST_TYPE_BENEFICIARY_TYPES_MAP[amlCustType];
    beneficiaryTypeField.FIELD_DICT_FILTER = availableBeneficiaryTypes;
    beneficiaryTypeField.DEFAULT_VALUE = "";
}

/**
 * 非自然人身份类别不为“特定客户”时，展示受益所有人模块
 * @param {object} _this 
 * @param {string} amlCustType 非自然人身份类别
 */
const showBeneficiaryModuleIfNeeded = (_this, amlCustType) => {
    let isShow = amlCustType == "1" || _.isEmpty(amlCustType) ? false : true;
    let beneficiaryTypeField = _this.groupDatas[GROUP_ID].AML_INFO[0].FIELDS.BENEFICIARY_TYPE;
    beneficiaryTypeField.FIELD_CONTROL = isShow ? "0" : "1";
    let moduleControl = isShow ? "1" : "0";
    _.each(_this.groupDatas[GROUP_ID].BENEFICIARY_OWNER_INFO, module => {
        module.MODULE_CONTROL = moduleControl;
    })
}

/**
 * 展示“持股比例”字段，如果受益人类型属于特定类别，参考映射关系 BENEFICIARY_TYPE_SHOW_SHARE_RADIO_MAP
 * @param {object} _this 
 * @param {string} beneficiaryType 
 */
const showShareRadioIfNeeded = (_this, beneficiaryType) => {
    let isShow = BENEFICIARY_TYPE_SHOW_SHARE_RADIO_MAP[beneficiaryType] || false;
    let fieldControl = isShow ? "0" : "1";
    _.each(_this.groupDatas[GROUP_ID].BENEFICIARY_OWNER_INFO, module => {
        module.FIELDS.SHARE_RATIO.FIELD_CONTROL = fieldControl;
    })

}

const bizProAmlInfoBeforeLoadBizCommon = (_this) => {

}

export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizProAmlInfoBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     */
    bizProAmlInfoBeforeLoadBiz: function (_this) {
        bizProAmlInfoBeforeLoadBizCommon(_this)
        let originaOrgBeneficiaryType = custInfoModel.getOriginaOrgBeneficiaryType(_this.oppBusiData.oldBusiData);
        bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["AML_INFO"], originaOrgBeneficiaryType);
        showBeneficiaryModuleIfNeeded(_this, originaOrgBeneficiaryType.AML_CUST_TYPE);
    },
    bizProAmlInfoBeforeLoadBizOpenAcct: function (_this) {
        bizProAmlInfoBeforeLoadBizCommon(_this)
    },
    /*
     *@method bizProAmlInfoAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     */
    bizProAmlInfoAfterLoadBiz: function (_this) {
        backfillHistoryData(_this);
        bizPublicMethod.$blMethod.filterOptionsButRetainHistoryOptions(_this, GROUP_ID, 
            "AML_INFO", "AML_CUST_TYPE", [], EXCLUDE_AML_CUST_TYPES, custInfoModel.getOriginaOrgBeneficiaryType(_this.oppBusiData.oldBusiData));
        let amlCustType = _this.groupDatas[GROUP_ID].AML_INFO[0].FIELDS.AML_CUST_TYPE.DEFAULT_VALUE;
        showBeneficiaryModuleIfNeeded(_this, amlCustType);
    },
    /*
     *@method bizProAmlInfoBeforeSave
     *@desc 钩子函数 自定义保存数
     */
    bizProAmlInfoBeforeSave: function (_this, params) {
        return params;
    },
    /*
     *@method bizProAmlInfoAfterSave
     *@desc 钩子函数 自定义保存数
     */
    bizProAmlInfoAfterSave: (_this, newData) => {

    },
    /*
     *@method bizProAmlInfoValidate
     *@desc 钩子函数 下一步验证
     */
    bizProAmlInfoValidate: function (_this) {

    },

    /*
     *@method bizProAmlInfoPageActivated
     *@desc 钩子函数：页面激活
     */
    bizProAmlInfoPageActivated: function (_this) {

    },

    bizProAmlInfoPreValidate: function (_this) {},
    //----------------------业务函数----------------------------------//

    "CHECK_AML_CUST_TYPE": (_this, field, fieldData) => {
        if (isFieldValueNotChanged(field)) {
            return;
        }
        modifyAvailableBeneficiaryTypesAccordingToAmlCustTypeAndClear(fieldData.BENEFICIARY_TYPE, 
            field.DEFAULT_VALUE);
        showBeneficiaryModuleIfNeeded(_this, field.DEFAULT_VALUE);
        field.LAST_DEFAULT_VALUE = field.DEFAULT_VALUE;
    },

    "CHECK_BENEFICIARY_TYPE": (_this, field, fieldData) => {
        if (isFieldValueNotChanged(field)) {
            return;
        }
        showShareRadioIfNeeded(_this, field.DEFAULT_VALUE);
        if (fieldData.AML_CUST_TYPE.DEFAULT_VALUE == "1") {
            // 受益所有人类别不展示时，数据不改变
            let originaOrgBeneficiaryType = custInfoModel.getOriginaOrgBeneficiaryType(_this.oppBusiData.oldBusiData);
            if (!_.isEmpty(originaOrgBeneficiaryType)) {
                field.DEFAULT_VALUE = originaOrgBeneficiaryType.BENEFICIARY_TYPE;
            }
        }
        field.LAST_DEFAULT_VALUE = field.DEFAULT_VALUE;
    }

}
