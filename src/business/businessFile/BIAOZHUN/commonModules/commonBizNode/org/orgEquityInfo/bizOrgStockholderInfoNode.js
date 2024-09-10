/*
 *   控股股东信息
 *   方法封装
 */

import date from '../../../../../../../tools/date.js'
import * as utils from "../../../../../../../tools/util"
import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../businessTools/bizPublicMethod.js"
import custInfoModel from '../../common/cust-info-model.js'

/**
 * 控股股东要去掉的证件类型：军官证、士兵证、户口本、台胞证、解放军文职干部、武警文职干部、
 * 社会保障号、文职证、警官证
 */
 const EXCLUDE_ID_TYPES = ["02", "03", "04", "05", "07", "0a", "0f", "0g", "0h"];

/**
 * 法定代表人与控股股东字段的映射关系
 */
 const LEGAL_REP_STOCKHOLDER_FIELDS_MAP = {
    "LEGAL_REP": "CONTROLLER",
    "LEGAL_REP_ID_TYPE": "CONTROLLER_ID_TYPE",
    "LEGAL_REP_ID_CODE": "CONTROLLER_ID_CODE",
    "LEGAL_REP_ID_EXP_DATE": "CONTROLLER_ID_EXP_DATE"
}

/**
 * 更新单选框选择状态。
 * 更新规则：
 * 1、如果存在 true，则 true 的单选框设置为 0-正常，其他设置为 2-不可编辑；
 * 2、如果不存在 true，则全部设置为 0-正常
 * @param {object} _this 
 * @param {object} groupId 
 * @param {object} moduleId 
 */
const updateRadioButtonsFieldControl = (_this, groupId, moduleId) => {
    let trueRadioButtonModule = _.find(_this.groupDatas[groupId][moduleId], obj => {
        return obj.FIELDS.MODULE_RADIO_BUTTON.DEFAULT_VALUE == "true";
    });
    if (_.isEmpty(trueRadioButtonModule)) {
        _.each(_this.groupDatas[groupId][moduleId], obj => {
            obj.FIELDS.MODULE_RADIO_BUTTON.FIELD_CONTROL = "0";
        })
    } else {
        _.each(_this.groupDatas[groupId][moduleId], obj => {
            obj.FIELDS.MODULE_RADIO_BUTTON.FIELD_CONTROL = "2";
        })
        trueRadioButtonModule.FIELDS.MODULE_RADIO_BUTTON.FIELD_CONTROL = "0";
    }
}


const backfillHistoryData = (_this) => {
    let stockholderInfo = _this.historyData["ORG_STOCKHOLDER_INFO"];
    if (!_.isEmpty(stockholderInfo)) {
        bizPublicMethod.$blMethod.parseMoudleArray(_this, 
            _this.groupDatas["EQUITY_INFO"]["STOCKHOLDER_INFO"], _.filter(stockholderInfo, item => {
                return item.OPER_TYPE && item.OPER_TYPE != "2";
            }));
        _.each(_this.groupDatas.EQUITY_INFO.STOCKHOLDER_INFO, module => {
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
                    LEGAL_REP_STOCKHOLDER_FIELDS_MAP);
            } else {
                module.FIELDS.MODULE_RADIO_BUTTON.DEFAULT_VALUE == "false";
            }
        })
    }
 }

 


//开户和非开户 字段数据加载 公共操作
const bizOrgStockholderInfoBeforeLoadBizCommon = (_this) => {
    _this.groupDatas.EQUITY_INFO.STOCKHOLDER_INFO[0].MAX_LENGTH = "999";
    _this.groupDatasTpl.EQUITY_INFO.STOCKHOLDER_INFO[0] = _.cloneDeep(_this.groupDatas.EQUITY_INFO.STOCKHOLDER_INFO[0]);
}


const modifyRadioButtonTitleAccordingToLegalRepType = (_this, module) => {
    let legalRepType = _this.groupDatas.ORG_INFO.SUBJECT_IDENTITY_INFO[0].FIELDS.LEGAL_REP_TYPE.DEFAULT_VALUE;
    let btnfieldTitle = legalRepType == "08" ? "与执行事务合伙人信息一致" : "与法定代表人信息一致";
    module.FIELDS.MODULE_RADIO_BUTTON.FIELD_TITLE = btnfieldTitle;
}

const modifyFieldsConfig = (_this) => {
    let allIdTypes = _.union(_this.oppBusiData.individualValidIdTypes, _this.oppBusiData.orgValidIdTypes);
    bizPublicMethod.$blMethod.filterOptionsButRetainHistoryOptions(_this, "EQUITY_INFO", "STOCKHOLDER_INFO",
        "CONTROLLER_ID_TYPE", allIdTypes, EXCLUDE_ID_TYPES, custInfoModel.getOriginaOrgStockholderInfo(_this.oppBusiData.oldBusiData));
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
     *@method bizOrgStockholderInfoBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     */
    bizOrgStockholderInfoBeforeLoadBiz: function (_this) {
        bizOrgStockholderInfoBeforeLoadBizCommon(_this);
        
        let stockholderInfo = custInfoModel.getOriginaOrgStockholderInfo(_this.oppBusiData.oldBusiData);
        if (stockholderInfo && stockholderInfo.length) {
            bizPublicMethod.$blMethod.parseMoudleArray(_this, _this.groupDatas["EQUITY_INFO"]["STOCKHOLDER_INFO"], stockholderInfo);
        }
    },
    bizOrgStockholderInfoBeforeLoadBizOpenAcct: function (_this) {
    },
    /*
     *@method bizOrgStockholderInfoAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     */
    bizOrgStockholderInfoAfterLoadBiz: function (_this) {
        backfillHistoryData(_this);
        modifyFieldsConfig(_this);
    },

    /*
     *@method bizOrgStockholderInfoBeforeSave
     *@desc 钩子函数 自定义保存数
     */
    bizOrgStockholderInfoBeforeSave: function (_this, params) {
        let stockholderInfo = bizPublicSaveMethod.getModuleArrFoyKey(_this, "STOCKHOLDER_INFO", true);

        let tempParam = {};
        let originalStockholderInfo = custInfoModel.getOriginaOrgStockholderInfo(_this.oppBusiData.oldBusiData);
        let originalStockholderInfoPick = [];
        _.each(originalStockholderInfo, item => {
            let obj = {};
            _.each(_.keys(item), key => {
                if (["CONTROLLER", "CONTROLLER_ID_TYPE", "CONTROLLER_ID_CODE", "CONTROLLER_ID_EXP_DATE", "CONTROLLER_NO"].indexOf(key) > -1) {
                    obj[key] = item[key]
                }
            });
            originalStockholderInfoPick.push(obj)
        })

        let stockholderChangeInfo = bizPublicMethod.$blMethod.getArrDiff(
            stockholderInfo, originalStockholderInfoPick, "CONTROLLER_NO", "");

        tempParam.isStockholderInfoChanged = 
            bizPublicMethod.$blMethod.isArrayModuleChanged(stockholderInfo, originalStockholderInfoPick);

        Object.assign(params, {
            ORG_STOCKHOLDER_INFO: stockholderChangeInfo && stockholderChangeInfo.INFO || [],
            IS_STOCKHOLDER_INFO_CHANGE: stockholderChangeInfo && stockholderChangeInfo.IS_CHANGE || "0"
        })
        /**开户数据保存 */
        if (_this.busiCode == "V0050") {
            let relaInfo = params.RELA_INFO || {};
            relaInfo.ORG_STOCKHOLDER_INFO = params.ORG_STOCKHOLDER_INFO;
            delete relaInfo.ORG_STOCKHOLDER_INFO.DIFF_INFO;
            // 翻译字段字典项，以便影像展示
            for (let i in relaInfo.ORG_STOCKHOLDER_INFO) {
                let fields = _this.groupDatas.EQUITY_INFO.STOCKHOLDER_INFO[i].FIELDS;
                relaInfo.ORG_STOCKHOLDER_INFO[i].CONTROLLER_ID_TYPE_TEXT = 
                    bizPublicMethod.$blMethod.getFieldDictItemName(fields.CONTROLLER_ID_TYPE);
            }
            Object.assign(params, {
                RELA_INFO: relaInfo
            })
        }
        //增加diffinfo 属性 用于展示
        let stockholderInfoFields = _this.groupDatas.EQUITY_INFO.STOCKHOLDER_INFO[0].FIELDS;
        let webShow = _this.$blMethod.addDiffAttArr(stockholderInfoFields, stockholderChangeInfo.INFO);
        webShow = _.each(webShow, infoItem => {
            if (infoItem.OPER_TYPE != "2") {
                infoItem.DIFF_INFO = _.filter(infoItem.DIFF_INFO, diffInfoItem => {
                    return diffInfoItem.NEW != diffInfoItem.OLD;
                })
            }
            if (infoItem.OPER_TYPE == "2") {
                infoItem.deleteDiff = _.filter(infoItem.deleteDiff, deleteDiffItem => {
                    return deleteDiffItem.NEW != deleteDiffItem.OLD;
                })
            }
        })
        params.STOCKHOLDER_INFO_WEB_SHOW = webShow;

        return params;
    },
    /*
     *@method bizOrgStockholderInfoAfterSave
     *@desc 钩子函数 自定义保存数
     */
    bizOrgStockholderInfoAfterSave: (_this, newData) => {

    },
    /*
     *@method bizOrgStockholderInfoValidate
     *@desc 钩子函数 下一步验证
     */
    bizOrgStockholderInfoValidate: function (_this) {
        let saveGroupId = "EQUITY_INFO";
        let stockholderInfo = _this.groupDatas[saveGroupId].STOCKHOLDER_INFO;
        let fieldArr = ["CONTROLLER_ID_CODE", "CONTROLLER_ID_EXP_DATE"];
        let promiseArr = bizPublicMethod.$blMethod.getValidatePromises(_this, stockholderInfo, fieldArr);
        return Promise.all(promiseArr).then( (res)=> {
            if (_.includes(res, false)) {
                return false
            }
        })
    },

    /*
     *@method bizOrgStockholderInfoPageActivated
     *@desc 钩子函数：页面激活
     */
    bizOrgStockholderInfoPageActivated: function (_this) {
        _.each(_this.groupDatas.EQUITY_INFO.STOCKHOLDER_INFO, module => {
            modifyRadioButtonTitleAccordingToLegalRepType(_this, module)
        })
    },

    bizOrgStockholderInfoNodeAddModuleFinished: function(_this, module) {
        modifyFieldsConfig(_this);
        modifyRadioButtonTitleAccordingToLegalRepType(_this, module);
        updateRadioButtonsFieldControl(_this, module.GROUP_ID, module.MODULE_ID);
    },

    bizOrgStockholderInfoNodeDeleteModuleFinished: function(_this, module) {
        updateRadioButtonsFieldControl(_this, module.GROUP_ID, module.MODULE_ID);
    },

    bizOrgStockholderInfoPreValidate: function (_this) {},
    //----------------------业务函数----------------------------------//


    "CHECK_CONTROLLER_ID_CODE": (_this, field, fieldData) => {
        let existFlag = _this.$blMethod.checkIdCodeIsExisted(_this, field, "控股股东证件号码不能重复");
        if (existFlag) {
            return false;
        }
    },

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
                LEGAL_REP_STOCKHOLDER_FIELDS_MAP);
            bizPublicMethod.$blMethod.copyFieldsAndTrigerCheck(fieldData, legalRepFields, 
                LEGAL_REP_STOCKHOLDER_FIELDS_MAP, _this, module);
            bizPublicMethod.$blMethod.setFieldsUneditable(fieldData, ["MODULE_RADIO_BUTTON", "CONTROLLER_NO"]);
        } else {
            bizPublicMethod.$blMethod.cancelCascade(_this, legalRepGroupInfo, module.GROUP_ID,
                module.MODULE_ID, cascadeGroupInfo.MODULE_SEQ);
            bizPublicMethod.$blMethod.setFieldsEditable(fieldData, ["MODULE_RADIO_BUTTON", "CONTROLLER_NO"]);
        }
        updateRadioButtonsFieldControl(_this, module.GROUP_ID, module.MODULE_ID);
    },
    "CHECK_CONTROLLER_ID_TYPE": (_this, field, fieldData) => {
        if (isFieldValueNotChanged(field)) {
            return;
        }
        if (!field.disableClear) {
            fieldData["CONTROLLER_ID_CODE"].DEFAULT_VALUE = "";
            fieldData["CONTROLLER_ID_EXP_DATE"].DEFAULT_VALUE = "";
        }
        field.disableClear = false;
        fieldData["CONTROLLER_ID_CODE"].VALID_TYPE = bizPublicMethod.$blMethod.getIdCodeValidType(field.DEFAULT_VALUE);
        field.LAST_DEFAULT_VALUE = field.DEFAULT_VALUE;
    },
    "CHECK_CONTROLLER_ID_EXP_DATE": (_this, field, fieldData) => {
        if (bizPublicMethod.$blMethod.isExpired(_this, field.DEFAULT_VALUE)) {
            _this.$nextTick( () => {
                bizPublicMethod.$blMethod.changeFieldError(field, false, field.FIELD_TITLE + "已过期");
            })
            return false;
        }
    },

}
