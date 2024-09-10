/*
 *   受益所有人类型
 *   方法封装
 */

import date from '../../../../../../../tools/date.js'
import * as utils from "../../../../../../../tools/util"
import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../businessTools/bizPublicMethod.js"
import custInfoModel from '../../common/cust-info-model.js'

const WRONG_ADDRESS_TIP_KEY = "wrongAddress";

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


/**
 * 字段值是否与原始数据不一样
 * @param {object} _this 
 * @param {object} field  字段对象
 */
 const isDifferentFromOriginal = (_this, field) => {
    let originaOrgBeneficiaryType = custInfoModel.getOriginaOrgBeneficiaryType(_this.oppBusiData.oldBusiData);
    return _.isEmpty(originaOrgBeneficiaryType) || field.DEFAULT_VALUE != originaOrgBeneficiaryType[field.FIELD_ID];
}

/**
 * 字段值是否与历史数据不一样
 * @param {object} _this 
 * @param {object} field  字段对象
 */
const isDifferentFromHistory = (_this, field) => {
    let historyOrgBasicInfo = _this.historyData["ORG_BASIC_INFO"];
    return _.isEmpty(historyOrgBasicInfo) || field.DEFAULT_VALUE != historyOrgBasicInfo[[field.FIELD_ID]];
}

const backfillHistoryData = (_this) => {
    let orgBasicInfo = _this.historyData["ORG_BASIC_INFO"];
    let beneficiaryOwnerInfo = _this.historyData["ORG_BENEFICIARY_OWNER_INFO"];
    let amlInfo = _.pick(orgBasicInfo, "AML_CUST_TYPE", "BENEFICIARY_TYPE")
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
    let beneficiaryTypeField = _this.groupDatas.RELA_INFO.AML_INFO[0].FIELDS.BENEFICIARY_TYPE;
    beneficiaryTypeField.FIELD_CONTROL = isShow ? "0" : "1";
    let moduleControl = isShow ? "1" : "0";
    _.each(_this.groupDatas.RELA_INFO.BENEFICIARY_OWNER_INFO, module => {
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
    _.each(_this.groupDatas.RELA_INFO.BENEFICIARY_OWNER_INFO, module => {
        module.FIELDS.SHARE_RATIO.FIELD_CONTROL = fieldControl;
    })

}

const bizOrgAmlInfoBeforeLoadBizCommon = (_this) => {

}

export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizOrgAmlInfoBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     */
    bizOrgAmlInfoBeforeLoadBiz: function (_this) {
        bizOrgAmlInfoBeforeLoadBizCommon(_this)
        let originaOrgBeneficiaryType = custInfoModel.getOriginaOrgBeneficiaryType(_this.oppBusiData.oldBusiData);
        bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["AML_INFO"], originaOrgBeneficiaryType);
        showBeneficiaryModuleIfNeeded(_this, originaOrgBeneficiaryType.AML_CUST_TYPE);
    },
    bizOrgAmlInfoBeforeLoadBizOpenAcct: function (_this) {
        bizOrgAmlInfoBeforeLoadBizCommon(_this)
    },
    /*
     *@method bizOrgAmlInfoAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     */
    bizOrgAmlInfoAfterLoadBiz: function (_this) {
        backfillHistoryData(_this);
        let amlCustType = _this.groupDatas.RELA_INFO.AML_INFO[0].FIELDS.AML_CUST_TYPE.DEFAULT_VALUE;
        showBeneficiaryModuleIfNeeded(_this, amlCustType);
    },
    /*
     *@method bizOrgAmlInfoBeforeSave
     *@desc 钩子函数 自定义保存数
     */
    bizOrgAmlInfoBeforeSave: function (_this, params) {
        return params;
    },
    /*
     *@method bizOrgAmlInfoAfterSave
     *@desc 钩子函数 自定义保存数
     */
    bizOrgAmlInfoAfterSave: (_this, newData) => {

    },
    /*
     *@method bizOrgAmlInfoValidate
     *@desc 钩子函数 下一步验证
     */
    bizOrgAmlInfoValidate: function (_this) {

    },

    /*
     *@method bizOrgAmlInfoPageActivated
     *@desc 钩子函数：页面激活
     */
    bizOrgAmlInfoPageActivated: function (_this) {

    },

    bizOrgAmlInfoPreValidate: function (_this) {},
    //----------------------业务函数----------------------------------//

    "CHECK_AML_CUST_TYPE": (_this, field, fieldData) => {
        if (isFieldValueNotChanged(field)) {
            return;
        }
        if (field.DEFAULT_VALUE == "1" && isDifferentFromOriginal(_this, field) && isDifferentFromHistory(_this, field)) {
            _this.letterBox({
                hasMask: true,
                confirmButtonText:'属于',
                cancelButtonText: '不属于',
                title: "特定客户是指：",
                letterContent: "1.各级党的机关、国家权力机关、行政机关、司法机关、军事机关、人民政协机关和人民解放军、武警部队、参照公务员法管理的事业单位。<br>2.政府间国际组织、外国政府驻华使领馆及办事处等机构及组织。",
                tip: "请您确认本机构是否属于上述类别。",
                typeMessage: "question",
                showMsgBox: true,
                confirmedAction: () => {
                },
                canceledAction: () =>  {
                    field.DEFAULT_VALUE = "";
                } 
            })
        }
        if (field.DEFAULT_VALUE == "1") {
            _this.$refs.flowTip.removeFlowTip(WRONG_ADDRESS_TIP_KEY);
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
