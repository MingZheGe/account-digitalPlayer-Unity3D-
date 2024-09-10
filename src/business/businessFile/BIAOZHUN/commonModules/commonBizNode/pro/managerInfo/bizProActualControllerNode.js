/*
 *   实际控制人
 *   方法封装
 */

import date from '../../../../../../../tools/date.js'
import * as utils from "../../../../../../../tools/util"
import smsService from '../../../../../../../service/sms-service'
import * as bizPubTools from "./../../bizPublicTools"
import stringConfig from "../../../../../../../tools/stringConfig.js"
import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../../business/businessTools/bizPublicMethod.js"
import custInfoModel from '../../common/cust-info-model.js'

const GROUP_ID = "MANAGER_INFO";

/**
 * 实际控制人要去掉的证件类型：军官证、士兵证、户口本、台胞证、解放军文职干部、武警文职干部、
 * 社会保障号、文职证、警官证
 */
 const EXCLUDE_ID_TYPES = ["02", "03", "04", "05", "07", "0a", "0f", "0g", "0h"];

/**
 * 法定代表人与实际控制人字段的映射关系
 */
 const LEGAL_REP_ACTUAL_CONTROLLER_FIELDS_MAP = {
    "LEGAL_REP": "CONTROLER_NAME",
    "LEGAL_REP_ID_TYPE": "CONTROLER_ID_TYPE",
    "LEGAL_REP_ID_CODE": "CONTROLER_ID_NO",
    "LEGAL_REP_ID_EXP_DATE": "CONTROLER_ID_EXP_DATE"
}


/**
 * 更新单选框选择状态。
 * 更新规则：
 * 1、如果存在 true，则 true 的单选框设置为 0-正常，其他设置为 2-不可编辑；
 * 2、如果不存在 true，则全部设置为 0-正常
 * 3、如果法人代表人类型为机构，清空单选框的值并设置为 1-隐藏
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
    let legalRepIdType = _this.groupDatas[GROUP_ID]["LEGAL_REP_INFO"][0].FIELDS.LEGAL_REP_ID_TYPE.DEFAULT_VALUE;
    if (_.indexOf(_this.oppBusiData.orgValidIdTypes, legalRepIdType) > -1) {
        _.each(_this.groupDatas[groupId][moduleId], obj => {
            obj.FIELDS.MODULE_RADIO_BUTTON.DEFAULT_VALUE = "";
            obj.FIELDS.MODULE_RADIO_BUTTON.FIELD_CONTROL = "1";
        })
    }
}

const backfillHistoryData = (_this) => {
    let controllerinfo = _this.historyData["ORG_CONTROLER_INFO"];
    if (!_.isEmpty(controllerinfo)) {
        bizPublicMethod.$blMethod.parseMoudleArray(_this, 
            _this.groupDatas[GROUP_ID]["ACTUAL_CONTROLLER_INFO"], _.filter(controllerinfo, item => {
                return item.OPER_TYPE && item.OPER_TYPE != "2";
            }));
        _.each(_this.groupDatas[GROUP_ID].ACTUAL_CONTROLLER_INFO, module => {
            if (module.FIELDS.MODULE_RADIO_BUTTON.DEFAULT_VALUE == "true") {
                let cascadeGroupInfo = {
                    GROUP_ID: module.GROUP_ID,
                    MODULE_ID: module.MODULE_ID,
                    MODULE_SEQ: module.MODULE_SEQ,
                }
                let legalRepGroupInfo = {
                    GROUP_ID: GROUP_ID,
                    MODULE_ID: "LEGAL_REP_INFO",
                    MODULE_SEQ: _this.groupDatas[GROUP_ID]["LEGAL_REP_INFO"][0].MODULE_SEQ,
                }
                bizPublicMethod.$blMethod.cascadeTo(_this, legalRepGroupInfo, cascadeGroupInfo, 
                    LEGAL_REP_ACTUAL_CONTROLLER_FIELDS_MAP);
            }
        })
    }
}

const modifyRadioButtonTitleAccordingToLegalRepType = (_this, module) => {
    let legalRepType = _this.groupDatas.MANAGER_INFO.MANAGER_BASIC_INFO[0].FIELDS.LEGAL_REP_TYPE.DEFAULT_VALUE;
    let btnfieldTitle = legalRepType == "08" ? "与执行事务合伙人信息一致" : "与法定代表人信息一致";
    module.FIELDS.MODULE_RADIO_BUTTON.FIELD_TITLE = btnfieldTitle;
}

const modifyFieldsConfig = (_this) => {
    let allIdTypes = _this.oppBusiData.individualValidIdTypes;
    bizPublicMethod.$blMethod.filterOptionsButRetainHistoryOptions(_this, GROUP_ID, "ACTUAL_CONTROLLER_INFO",
        "CONTROLER_ID_TYPE", allIdTypes, EXCLUDE_ID_TYPES, custInfoModel.getOriginaOrgControllerInfo(_this.oppBusiData.oldBusiData));
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
     *@method bizOrgControllerNodeBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     */
    bizProActualControllerNodeBeforeLoadBiz: function (_this) {
        _this.groupDatas[GROUP_ID].ACTUAL_CONTROLLER_INFO[0].FIELDS.CONTROLER_NAME.VALID_TYPE = "length[1,64]";
        let maxController = _.get(_this.oppBusiData, "busiCommonParams.MAX_CONTROLER", "");
        _this.groupDatas[GROUP_ID].ACTUAL_CONTROLLER_INFO[0].MAX_LENGTH = _.isEmpty(maxController) ? "999" : maxController;
        _this.groupDatasTpl[GROUP_ID].ACTUAL_CONTROLLER_INFO[0] = _.cloneDeep(_this.groupDatas[GROUP_ID].ACTUAL_CONTROLLER_INFO[0]);
        let originaControllerinfo = custInfoModel.getOriginaOrgControllerInfo(_this.oppBusiData.oldBusiData);
        if (originaControllerinfo && originaControllerinfo.length) {
            bizPublicMethod.$blMethod.parseMoudleArray(_this, _this.groupDatas[GROUP_ID]["ACTUAL_CONTROLLER_INFO"], originaControllerinfo);
        }
    },
    /*
     *@method bizOrgControllerNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     */
    bizProActualControllerNodeAfterLoadBiz: function (_this) {
        backfillHistoryData(_this);
        modifyFieldsConfig(_this);
    },
    /*
     *@method bizOrgControllerNodeBeforeSave
     *@desc 钩子函数 自定义保存数
     */
    bizProActualControllerNodeBeforeSave: async function (_this, params) {
        let controllerInfo = bizPublicSaveMethod.getModuleArrFoyKey(_this, "ACTUAL_CONTROLLER_INFO", true);

        let tempParam = {};
        let originaControllerinfo = custInfoModel.getOriginaOrgControllerInfo(_this.oppBusiData.oldBusiData);
        let originaControllerinfoPick = [];
        // CONTROLLER、CONTROLLER_ID_TYPE、CONTROLLER_ID_CODE、CONTROLLER_ID_EXP_DATE、CONTROLER_NUM
        _.each(originaControllerinfo, item => {
            let obj = {};
            _.each(_.keys(item), key => {
                if (["CONTROLER_NAME", "CONTROLER_ID_TYPE", "CONTROLER_ID_NO", "CONTROLER_ID_EXP_DATE", "CONTROLER_NUM"].indexOf(key) > -1) {
                    obj[key] = item[key]
                }
            });
            originaControllerinfoPick.push(obj)
        })
        let controllerChangeInfo = bizPublicMethod.$blMethod.getArrDiff(
            controllerInfo, originaControllerinfoPick, "CONTROLER_NUM", "");

        tempParam.isControllerInfoChanged = 
            bizPublicMethod.$blMethod.isArrayModuleChanged(controllerInfo, originaControllerinfoPick);


        Object.assign(params, {
            ORG_CONTROLER_INFO: controllerChangeInfo && controllerChangeInfo.INFO || [],
            IS_CONTROLER_INFO_CHANGE: controllerChangeInfo && controllerChangeInfo.IS_CHANGE || "0"
        })
        /**开户数据保存 */
        if (_this.busiCode == "V0051") {
            let managerInfo = params.MANAGER_INFO || {};
            managerInfo.ORG_CONTROLER_INFO = params.ORG_CONTROLER_INFO;
            delete managerInfo.ORG_CONTROLER_INFO.DIFF_INFO;
            // 翻译字段字典项，以便影像展示
            for (let i in managerInfo.ORG_CONTROLER_INFO) {
                let fields = _this.groupDatas[GROUP_ID].ACTUAL_CONTROLLER_INFO[i].FIELDS;
                managerInfo.ORG_CONTROLER_INFO[i].CONTROLER_ID_TYPE_TEXT = 
                    bizPublicMethod.$blMethod.getFieldDictItemName(fields.CONTROLER_ID_TYPE);
            }
            Object.assign(params, {
                MANAGER_INFO: managerInfo
            })
        }
        //增加diffinfo 属性 用于展示
        let actualControllerInfoFields = _this.groupDatas[GROUP_ID].ACTUAL_CONTROLLER_INFO[0].FIELDS;
        let webShow = _this.$blMethod.addDiffAttArr(actualControllerInfoFields, controllerChangeInfo.INFO);
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
        params.ACTUAL_CONTROLLER_INFO_WEB_SHOW = webShow;
        return params;
    },
    /*
     *@method bizOrgControllerNodeAfterSave
     *@desc 钩子函数 自定义保存数
     */
    bizProActualControllerNodeAfterSave: (_this, newData) => {

    },
    /*
     *@method bizOrgControllerNodeValidate
     *@desc 钩子函数 下一步验证
     */
    bizProActualControllerNodeValidate: function (_this) {
        let saveGroupId = GROUP_ID;
        let actualControllerInfo = _this.groupDatas[saveGroupId].ACTUAL_CONTROLLER_INFO;
        let fieldArr = ["CONTROLER_ID_NO", "CONTROLER_ID_EXP_DATE"];
        let promiseArr = bizPublicMethod.$blMethod.getValidatePromises(_this, actualControllerInfo, fieldArr);
        return Promise.all(promiseArr).then( (res)=> {
            if (_.includes(res, false)) {
                return false
            }
        })
    },

    /*
     *@method bizOrgControllerNodePageActivated
     *@desc 钩子函数：页面激活
     */
    bizProActualControllerNodePageActivated: function (_this, groupId) {
        _.each(_this.groupDatas[GROUP_ID].ACTUAL_CONTROLLER_INFO, module => {
            modifyRadioButtonTitleAccordingToLegalRepType(_this, module)
        })
        updateRadioButtonsFieldControl(_this, GROUP_ID, "ACTUAL_CONTROLLER_INFO");
    },

    bizProActualControllerNodeAddModuleFinished: function(_this, module) {
        modifyFieldsConfig(_this);
        modifyRadioButtonTitleAccordingToLegalRepType(_this, module);
        updateRadioButtonsFieldControl(_this, module.GROUP_ID, module.MODULE_ID);
        module.FIELDS.CONTROLER_NAME.VALID_TYPE = "length[1,64]";
    },

    bizProActualControllerNodeDeleteModuleFinished: function(_this, module) {
        updateRadioButtonsFieldControl(_this, module.GROUP_ID, module.MODULE_ID);
    },

    "CHECK_CONTROLER_ID_NO": (_this, field, fieldData) => {
        let existFlag = _this.$blMethod.checkIdCodeIsExisted(_this, field, "实际控制人证件号码不能重复");
        if (existFlag) {
            return false;
        }
    },
    "CHECK_MODULE_RADIO": (_this, field, fieldData,module) => {
        let legalRepFields = _this.groupDatas[GROUP_ID].LEGAL_REP_INFO[0].FIELDS;
        let cascadeGroupInfo = {
            GROUP_ID: module.GROUP_ID,
            MODULE_ID: module.MODULE_ID,
            MODULE_SEQ: module.MODULE_SEQ,
        }
        let legalRepGroupInfo = {
            GROUP_ID: GROUP_ID,
            MODULE_ID: "LEGAL_REP_INFO",
            MODULE_SEQ: _this.groupDatas[GROUP_ID]["LEGAL_REP_INFO"][0].MODULE_SEQ,
        }
        if (field.DEFAULT_VALUE == "true") {
            bizPublicMethod.$blMethod.cascadeTo(_this, legalRepGroupInfo, cascadeGroupInfo, 
                LEGAL_REP_ACTUAL_CONTROLLER_FIELDS_MAP);
            bizPublicMethod.$blMethod.copyFieldsAndTrigerCheck(fieldData, legalRepFields, 
                LEGAL_REP_ACTUAL_CONTROLLER_FIELDS_MAP, _this, module);
            bizPublicMethod.$blMethod.setFieldsUneditable(fieldData, ["MODULE_RADIO_BUTTON", "CONTROLER_NUM"]);
        } else {
            bizPublicMethod.$blMethod.cancelCascade(_this, legalRepGroupInfo, module.GROUP_ID,
                module.MODULE_ID, cascadeGroupInfo.MODULE_SEQ);
            bizPublicMethod.$blMethod.setFieldsEditable(fieldData, ["MODULE_RADIO_BUTTON", "CONTROLER_NUM"]);
        }
        updateRadioButtonsFieldControl(_this, module.GROUP_ID, module.MODULE_ID);
    },
    "CHECK_CONTROLER_ID_TYPE": (_this, field, fieldData) => {
        if (isFieldValueNotChanged(field)) {
            return;
        }
        if (!field.disableClear) {
            fieldData["CONTROLER_ID_NO"].DEFAULT_VALUE = "";
            fieldData["CONTROLER_ID_EXP_DATE"].DEFAULT_VALUE = "";
        }
        field.disableClear = false;
        fieldData["CONTROLER_ID_NO"].VALID_TYPE = bizPublicMethod.$blMethod.getIdCodeValidType(field.DEFAULT_VALUE);
        field.LAST_DEFAULT_VALUE = field.DEFAULT_VALUE;
    },
    "CHECK_CONTROLER_ID_EXP_DATE": (_this, field, fieldData, module) => {
        if (bizPublicMethod.$blMethod.isExpired(_this, field.DEFAULT_VALUE)) {
            _this.$nextTick( () => {
                bizPublicMethod.$blMethod.changeFieldError(field, false, field.FIELD_TITLE + "已过期");
            })
            return false;
        }
    },
}
