/*
 *   产品托管人信息模块
 *   方法封装
 */

import date from '../../../../../../../tools/date.js'
import * as utils from "../../../../../../../tools/util"
import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../../business/businessTools/bizPublicMethod.js"
import custInfoModel  from "../../common/cust-info-model"

const GROUP_ID = "OTHER_INFO";

/**
 * 回填历史数据
 * @param {object} _this 
 */
const backfillHistoryData = (_this) => {
    let proTrusteeInfo = _this.historyData["PRO_TRUSTEE_INFO"];
    if (!_.isEmpty(proTrusteeInfo)) {
        bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["TRUSTEE_INFO"], proTrusteeInfo);
    }
}

const setFieldsControl = (allFields, excludeFields, fieldControl) => {
    for (let fieldId in allFields) {
        if (_.indexOf(excludeFields, fieldId) == -1) {
            allFields[fieldId].FIELD_CONTROL = fieldControl;
        }
    }
}

const initFieldConfig = (_this) => {
    _this.groupDatas[GROUP_ID].TRUSTEE_INFO[0].FIELDS.HAS_TRUSTEE.isShowAllBtn = false;
    _this.groupDatas[GROUP_ID].TRUSTEE_INFO[0].FIELDS.HAS_TRUSTEE.FIELED_CHECKBOX_BOTTON = true;
    _this.groupDatas[GROUP_ID].TRUSTEE_INFO[0].FIELDS.HAS_TRUSTEE.multiple = true;
    _this.groupDatas[GROUP_ID].TRUSTEE_INFO[0].FIELDS.HAS_TRUSTEE.labelWidth = 280;
    _this.groupDatas[GROUP_ID].TRUSTEE_INFO[0].FIELDS.HAS_TRUSTEE.FIELED_CHECKBOX_BOTTON = true;
    _this.groupDatas[GROUP_ID].TRUSTEE_INFO[0].FIELDS.HAS_TRUSTEE.FIELD_RADIO_TYPE = false;  //false为单选
    _this.groupDatas[GROUP_ID].TRUSTEE_INFO[0].FIELDS.PRO_TRUSTEE_ID_TYPE.FIELD_DICT_FILTER = _this.oppBusiData.orgValidIdTypes.join(",");
    _this.groupDatas[GROUP_ID].TRUSTEE_INFO[0].FIELDS.PRO_TRUSTEE_NAME.VALID_TYPE = "val[4,64]";
}

/**
 * 判断字段是否没有改变
 * @param {object} field 字段对象
 */
const isFieldValueNotChanged = (field) => {
    return field.LAST_DEFAULT_VALUE == field.DEFAULT_VALUE;
}

export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizProTrusteeInfoNodeBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     */
    bizProTrusteeInfoNodeBeforeLoadBiz: function (_this) {
        initFieldConfig(_this);
        let trusteeInfo = custInfoModel.getOriginaProTrusteInfo(_this.oppBusiData.oldBusiData);
        if (!_.isEmpty(trusteeInfo)) {
            _this.groupDatas[GROUP_ID].TRUSTEE_INFO[0].FIELDS.HAS_TRUSTEE.DEFAULT_VALUE = "1";
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["TRUSTEE_INFO"], trusteeInfo);
        } else {
            _this.groupDatas[GROUP_ID].TRUSTEE_INFO[0].FIELDS.HAS_TRUSTEE.DEFAULT_VALUE = "0";
        }
    },
    /*
     *@method bizProTrusteeInfoNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     */
    bizProTrusteeInfoNodeAfterLoadBiz: function (_this) {
        backfillHistoryData(_this);
        let trusteeFields = _this.groupDatas.OTHER_INFO.TRUSTEE_INFO[0].FIELDS;
        setFieldsControl(trusteeFields, ["HAS_TRUSTEE"], trusteeFields["HAS_TRUSTEE"].DEFAULT_VALUE == "1" ? "0" : "1");
    },
    /*
     *@method bizProTrusteeInfoNodeBeforeSave
     *@desc 钩子函数 自定义保存数
     */
    bizProTrusteeInfoNodeBeforeSave: function (_this, params) {
        let trusteeInfo = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "TRUSTEE_INFO");
        if (trusteeInfo.HAS_TRUSTEE == "0") {
            for (let i in trusteeInfo) {
                if (i == "HAS_TRUSTEE") {
                    continue;
                }
                trusteeInfo[i] = "";
            }
        }
        let originalTrusteeInfo = custInfoModel.getOriginaProTrusteInfo(_this.oppBusiData.oldBusiData);

        let trusteeFields = _this.groupDatas.OTHER_INFO.TRUSTEE_INFO[0].FIELDS;
        let oldTrusteeInfo = bizPublicMethod.$blMethod.getOriginalFieldValues(trusteeFields, originalTrusteeInfo);
        oldTrusteeInfo.HAS_TRUSTEE = _.isEmpty(originalTrusteeInfo) ? "0" : "1";
        let trusteeInfoDiff = bizPublicMethod.$blMethod.compareInfo2(oldTrusteeInfo, trusteeInfo, "");
        trusteeInfo.DIFF_INFO = trusteeInfoDiff;

        Object.assign(params, {
            PRO_TRUSTEE_INFO: Object.assign(params.PRO_TRUSTEE_INFO || {}, trusteeInfo),
            IS_CHANGE_PRO_TRUSTEE: trusteeInfo.DIFF_INFO.length > 0 ? "1": "0",
        })
        /**开户数据保存 */
        if (_this.busiCode == "V0051") {
            let relaInfo = params.RELA_INFO || {};
            relaInfo.PRO_TRUSTEE_INFO = params.PRO_TRUSTEE_INFO;
            delete relaInfo.PRO_TRUSTEE_INFO.DIFF_INFO;
            Object.assign(params, {
                RELA_INFO: relaInfo
            })
        }
        
        //增加diffinfo 属性 用于展示
        let webShow = _this.$blMethod.addDiffAtt(_.cloneDeep(trusteeFields), trusteeInfoDiff) || [];
        params.TRUSTEE_INFO_WEB_SHOW = webShow;
        return params;
    },
    /*
     *@method bizProTrusteeInfoNodeAfterSave
     *@desc 钩子函数 自定义保存数
     */
    bizProTrusteeInfoNodeAfterSave: (_this, newData) => {
        
    },
    /*
     *@method bizProTrusteeInfoNodeValidate
     *@desc 钩子函数 下一步验证
     */
    bizProTrusteeInfoNodeValidate: function (_this) {
        let modules = _this.groupDatas.OTHER_INFO.TRUSTEE_INFO;
        let fieldIds = ["PRO_TRUSTEE_ID_EXP_DATE"];
        let promiseArr = bizPublicMethod.$blMethod.getValidatePromises(_this, modules, fieldIds);
        return Promise.all(promiseArr).then( (res)=> {
            if (_.includes(res, false)) {
                return false;
            }
        })
    },

    /*
     *@method bizProTrusteeInfoNodePageActivated
     *@desc 钩子函数：页面激活
     */
    bizProTrusteeInfoNodePageActivated: function (_this, groupId) {
        
    },

    bizProTrusteeInfoNodePreValidate: function(_this) {
    },
    //----------------------业务函数----------------------------------//

    "CHECK_HAS_TRUSTEE": (_this, field, fieldData) => {
        if (isFieldValueNotChanged(field)) {
            return;
        }
        setFieldsControl(fieldData, ["HAS_TRUSTEE"], field.DEFAULT_VALUE == "1" ? "0" : "1");
        field.LAST_DEFAULT_VALUE = field.DEFAULT_VALUE;
    },
    "CHECK_PRO_TRUSTEE_ID_TYPE": (_this, field, fieldData) => {
        if (isFieldValueNotChanged(field)) {
            return;
        }
        fieldData["PRO_TRUSTEE_ID_CODE"].DEFAULT_VALUE = "";
        fieldData["PRO_TRUSTEE_ID_EXP_DATE"].DEFAULT_VALUE = "";

        let HIS_ID_TYPE = _.get(_this.oppBusiData.oldBusiData, "PRO_TRUSTE_INFO.PRO_TRUSTEE_ID_TYPE", '');
        let HIS_ID_CODE = _.get(_this.oppBusiData.oldBusiData, "PRO_TRUSTE_INFO.PRO_TRUSTEE_ID_CODE", '');
        let HIS_ID_EXP_DATE = _.get(_this.oppBusiData.oldBusiData, "PRO_TRUSTE_INFO.PRO_TRUSTEE_ID_EXP_DATE", '');
        if(field.DEFAULT_VALUE != '' && field.DEFAULT_VALUE == HIS_ID_TYPE) {
            fieldData.PRO_TRUSTEE_ID_CODE.DEFAULT_VALUE = HIS_ID_CODE || '';
            fieldData.PRO_TRUSTEE_ID_EXP_DATE.DEFAULT_VALUE = HIS_ID_EXP_DATE || '';
        }

        fieldData["PRO_TRUSTEE_ID_CODE"].VALID_TYPE = bizPublicMethod.$blMethod.getIdCodeValidType(field.DEFAULT_VALUE);
        field.LAST_DEFAULT_VALUE = field.DEFAULT_VALUE;
    },
    "CHECK_PRO_TRUSTEE_ID_EXP_DATE": (_this, field, fieldData, module) => {
        if (bizPublicMethod.$blMethod.isExpired(_this, field.DEFAULT_VALUE)) {
            _this.$nextTick( () => {
                bizPublicMethod.$blMethod.changeFieldError(field, false, field.FIELD_TITLE + "已过期");
            })
            return false;
        }
    },
}
