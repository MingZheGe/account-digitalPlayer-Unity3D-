/*
 *   负责人信息
 *   方法封装
 */

import date from '../../../../../../../tools/date.js'
import * as utils from "../../../../../../../tools/util"
import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../businessTools/bizPublicMethod.js"
import custInfoModel from '../../common/cust-info-model.js'

/**
 * 实际控制人要去掉的证件类型：军官证、士兵证、户口本、台胞证、解放军文职干部、武警文职干部、
 * 社会保障号、文职证、警官证
 */
 const EXCLUDE_ID_TYPES = ["02", "03", "04", "05", "07", "0a", "0f", "0g", "0h"];

/**
 * 法定代表人与负责人字段的映射关系
 */
const LEGAL_REP_RESPONSIBLE_PERSON_FIELDS_MAP = {
    "LEGAL_REP": "RESPONSIBILITY_REP",
    "LEGAL_REP_ID_TYPE": "RESPONSIBILITY_REP_ID_TYPE",
    "LEGAL_REP_ID_CODE": "RESPONSIBILITY_REP_ID_CODE",
    "LEGAL_REP_ID_EXP_DATE": "RESPONSIBILITY_REP_ID_EXP_DATE"
}

/**
 * 判断字段是否没有改变
 * @param {object} field 字段对象
 */
const isFieldValueNotChanged = (field) => {
    return field.LAST_DEFAULT_VALUE == field.DEFAULT_VALUE;
}
const backfillHistoryData = (_this) => {
    let bizOrgResponsibleInfo = _this.historyData["ORG_RESPONSIBLE_INFO"];
    if (!_.isEmpty(bizOrgResponsibleInfo)) {
        bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, 
            ["RESPONSIBLE_PERSON_INFO"], bizOrgResponsibleInfo);
        let module = _this.groupDatas.RELA_INFO.RESPONSIBLE_PERSON_INFO[0];
        if (module.FIELDS.MODULE_RADIO_BUTTON.DEFAULT_VALUE == "true") {
            let cascadeGroupInfo = {
                GROUP_ID: module.GROUP_ID,
                MODULE_ID: module.MODULE_ID,
                MODULE_SEQ: module.MODULE_SEQ,
            }
            let legalRepGroupInfo = {
                GROUP_ID: "RELA_INFO",
                MODULE_ID: "LEGAL_REP_INFO",
                MODULE_SEQ: _this.groupDatas["RELA_INFO"]["LEGAL_REP_INFO"][0].MODULE_SEQ,
            }
            bizPublicMethod.$blMethod.cascadeTo(_this, legalRepGroupInfo, cascadeGroupInfo, 
                LEGAL_REP_RESPONSIBLE_PERSON_FIELDS_MAP);
        }
    }
 }

//开户和非开户 字段数据加载 公共操作
const bizOrgResponsibleInfoBeforeLoadBizCommon = (_this) => {

}

export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizOrgResponsibleInfoBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     */
    bizOrgResponsibleInfoBeforeLoadBiz: function (_this) {
        bizOrgResponsibleInfoBeforeLoadBizCommon(_this);
        let bizOrgResponsibleInfo = custInfoModel.getOriginaOrgResponsibleInfo(_this.oppBusiData.oldBusiData);
        if (!_.isEmpty(bizOrgResponsibleInfo)) {
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["RESPONSIBLE_PERSON_INFO"], bizOrgResponsibleInfo);
        }
    },
    bizOrgResponsibleInfoBeforeLoadBizOpenAcct: function (_this) {
        bizOrgResponsibleInfoBeforeLoadBizCommon(_this)
    },
    /*
     *@method bizOrgResponsibleInfoAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     */
    bizOrgResponsibleInfoAfterLoadBiz: function (_this) {
        backfillHistoryData(_this);
        let allIdTypes = _.union(_this.oppBusiData.individualValidIdTypes);
        bizPublicMethod.$blMethod.filterOptionsButRetainHistoryOptions(_this, "RELA_INFO", "RESPONSIBLE_PERSON_INFO",
        "RESPONSIBILITY_REP_ID_TYPE", allIdTypes, EXCLUDE_ID_TYPES, custInfoModel.getOriginaOrgResponsibleInfo(_this.oppBusiData.oldBusiData));
    },
    /*
     *@method bizOrgResponsibleInfoBeforeSave
     *@desc 钩子函数 自定义保存数
     */
    bizOrgResponsibleInfoBeforeSave: function (_this, params) {
        let responsibleInfo = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "RESPONSIBLE_PERSON_INFO");

        let originalResponsibleInfo = custInfoModel.getOriginaOrgResponsibleInfo(_this.oppBusiData.oldBusiData);

        let responsibleInfoDiff = bizPublicMethod.$blMethod.compareInfo2(originalResponsibleInfo, responsibleInfo, "");
        responsibleInfo.DIFF_INFO = responsibleInfoDiff;

        Object.assign(params, {
            ORG_RESPONSIBLE_INFO: responsibleInfo
        })
        /**开户数据保存 */
        if (_this.busiCode == "V0050") {
            let relaInfo = params.RELA_INFO || {};
            relaInfo.ORG_RESPONSIBLE_INFO = params.ORG_RESPONSIBLE_INFO;
            delete relaInfo.ORG_RESPONSIBLE_INFO.DIFF_INFO;
            // 翻译字段字典项，以便影像展示
            let fields = _this.groupDatas.RELA_INFO.RESPONSIBLE_PERSON_INFO[0].FIELDS;
            relaInfo.ORG_RESPONSIBLE_INFO.RESPONSIBILITY_REP_ID_TYPE_TEXT = 
                bizPublicMethod.$blMethod.getFieldDictItemName(fields.RESPONSIBILITY_REP_ID_TYPE);
            Object.assign(params, {
                RELA_INFO: relaInfo
            })
        }
        //增加diffinfo 属性 用于展示
        let responsiblePersonFields = _this.groupDatas.RELA_INFO.RESPONSIBLE_PERSON_INFO[0].FIELDS;
        let webShow = _this.$blMethod.addDiffAtt(responsiblePersonFields, responsibleInfoDiff);
        params.RESPONSIBLE_PERSON_INFO_WEB_SHOW = webShow;
        
        return params;
        
    },
    /*
     *@method bizOrgResponsibleInfoAfterSave
     *@desc 钩子函数 自定义保存数
     */
    bizOrgResponsibleInfoAfterSave: (_this, newData) => {

    },
    /*
     *@method bizOrgResponsibleInfoValidate
     *@desc 钩子函数 下一步验证
     */
    bizOrgResponsibleInfoValidate: function (_this) {
        let modules = _this.groupDatas.RELA_INFO.RESPONSIBLE_PERSON_INFO;
        let fieldIds = ["RESPONSIBILITY_REP_ID_EXP_DATE"];
        let promiseArr = bizPublicMethod.$blMethod.getValidatePromises(_this, modules, fieldIds);
        return Promise.all(promiseArr).then( (res)=> {
            if (_.includes(res, false)) {
                return false;
            }
        })
    },

    /*
     *@method bizOrgResponsibleInfoPageActivated
     *@desc 钩子函数：页面激活
     */
    bizOrgResponsibleInfoPageActivated: function (_this) {
        let legalRepType = 
            _this.groupDatas.ORG_INFO.SUBJECT_IDENTITY_INFO[0].FIELDS.LEGAL_REP_TYPE.DEFAULT_VALUE;
        _this.groupDatas.RELA_INFO.RESPONSIBLE_PERSON_INFO[0].FIELDS.MODULE_RADIO_BUTTON.FIELD_TITLE = 
            legalRepType == "08" ? "与执行事务合伙人信息一致" : "与法定代表人信息一致";
    },

    bizOrgResponsibleInfoPreValidate: function (_this) {},
    //----------------------业务函数----------------------------------//

    "CHECK_MODULE_RADIO": (_this, field, fieldData, module) => {
        let legalRepFields = _this.groupDatas.RELA_INFO.LEGAL_REP_INFO[0].FIELDS;
        let cascadeGroupInfo = {
            GROUP_ID: module.GROUP_ID,
            MODULE_ID: module.MODULE_ID,
            MODULE_SEQ: module.MODULE_SEQ,
        }
        let legalRepGroupInfo = {
            GROUP_ID: "RELA_INFO",
            MODULE_ID: "LEGAL_REP_INFO",
            MODULE_SEQ: _this.groupDatas["RELA_INFO"]["LEGAL_REP_INFO"][0].MODULE_SEQ,
        }
        if (field.DEFAULT_VALUE == "true") {
            bizPublicMethod.$blMethod.cascadeTo(_this, legalRepGroupInfo, cascadeGroupInfo, 
                LEGAL_REP_RESPONSIBLE_PERSON_FIELDS_MAP);
            bizPublicMethod.$blMethod.copyFieldsAndTrigerCheck(fieldData, legalRepFields, 
                LEGAL_REP_RESPONSIBLE_PERSON_FIELDS_MAP, _this, module);
            bizPublicMethod.$blMethod.setFieldsUneditable(fieldData, ["MODULE_RADIO_BUTTON"]);
        } else {
            bizPublicMethod.$blMethod.cancelCascade(_this, legalRepGroupInfo, module.GROUP_ID,
                module.MODULE_ID);
            bizPublicMethod.$blMethod.setFieldsEditable(fieldData, ["MODULE_RADIO_BUTTON"]);
        }
    },
    "CHECK_RESPONSIBILITY_REP_ID_TYPE": (_this, field, fieldData, module) => {
        if (isFieldValueNotChanged(field)) {
            return;
        }
        if (!field.disableClear) {
            fieldData["RESPONSIBILITY_REP_ID_CODE"].DEFAULT_VALUE = "";
            fieldData["RESPONSIBILITY_REP_ID_EXP_DATE"].DEFAULT_VALUE = "";
        }
        field.disableClear = false;

        let HIS_ID_TYPE = _.get(_this.oppBusiData.oldBusiData, 'CORP_INFO.RESPONSIBILITY_REP_ID_TYPE', '');
        let HIS_ID_CODE = _.get(_this.oppBusiData.oldBusiData, 'CORP_INFO.RESPONSIBILITY_REP_ID_CODE', '');
        let HIS_ID_EXP_DATE = _.get(_this.oppBusiData.oldBusiData, "CORP_INFO.RESPONSIBILITY_REP_ID_EXP_DATE", '');
        if(field.DEFAULT_VALUE != '' && field.DEFAULT_VALUE == HIS_ID_TYPE) {
            fieldData.RESPONSIBILITY_REP_ID_CODE.DEFAULT_VALUE = HIS_ID_CODE || '';
            fieldData.RESPONSIBILITY_REP_ID_EXP_DATE.DEFAULT_VALUE = HIS_ID_EXP_DATE || '';
        }

        fieldData["RESPONSIBILITY_REP_ID_CODE"].VALID_TYPE = bizPublicMethod.$blMethod.getIdCodeValidType(field.DEFAULT_VALUE);
        field.LAST_DEFAULT_VALUE = field.DEFAULT_VALUE;
    },
    "CHECK_RESPONSIBILITY_REP_ID_EXP_DATE": (_this, field, fieldData) => {
        if (bizPublicMethod.$blMethod.isExpired(_this, field.DEFAULT_VALUE)) {
            _this.$nextTick( () => {
                bizPublicMethod.$blMethod.changeFieldError(field, false, field.FIELD_TITLE + "已过期");
            })
            return false;
        }
    },

}
