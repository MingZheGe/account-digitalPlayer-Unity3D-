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
 * 实际控制人与受益所有人字段的映射关系
 */
 const ACTUAL_CONTROLLER_BENEFICIARY_OWNER_FIELDS_MAP = {
    "CONTROLER_NAME": "BENEFICIARY_NAME",
    "CONTROLER_ID_TYPE": "BENEFICIARY_ID_TYPE",
    "CONTROLER_ID_NO": "BENEFICIARY_ID",
    "CONTROLER_ID_EXP_DATE": "BENEFICIARY_EXP_DATE"
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
    let legalRepIdType = _this.groupDatas["RELA_INFO"]["LEGAL_REP_INFO"][0].FIELDS.LEGAL_REP_ID_TYPE.DEFAULT_VALUE;
    if (_.indexOf(_this.oppBusiData.orgValidIdTypes, legalRepIdType) > -1) {
        _.each(_this.groupDatas[groupId][moduleId], obj => {
            obj.FIELDS.MODULE_RADIO_BUTTON.DEFAULT_VALUE = "";
            obj.FIELDS.MODULE_RADIO_BUTTON.FIELD_CONTROL = "1";
        })
    }
}

const backfillHistoryData = (_this) => {
    let controllerInfo = _this.historyData["ORG_CONTROLER_INFO"];
    if (!_.isEmpty(controllerInfo)) {
        bizPublicMethod.$blMethod.parseMoudleArray(_this, 
            _this.groupDatas["EQUITY_INFO"]["ACTUAL_CONTROLLER_INFO"], _.filter(controllerInfo, item => {
                return item.OPER_TYPE && item.OPER_TYPE != "2";
            }));
        let legalRepGroupInfo = {
            GROUP_ID: "RELA_INFO",
            MODULE_ID: "LEGAL_REP_INFO",
            MODULE_SEQ: _this.groupDatas["RELA_INFO"]["LEGAL_REP_INFO"][0].MODULE_SEQ,
        }
        _.each(_this.groupDatas.EQUITY_INFO.ACTUAL_CONTROLLER_INFO, module => {
            if (module.FIELDS.MODULE_RADIO_BUTTON.DEFAULT_VALUE == "true") {
                let cascadeGroupInfo = {
                    GROUP_ID: module.GROUP_ID,
                    MODULE_ID: module.MODULE_ID,
                    MODULE_SEQ: module.MODULE_SEQ,
                }
                bizPublicMethod.$blMethod.cascadeTo(_this, legalRepGroupInfo, cascadeGroupInfo, 
                    LEGAL_REP_ACTUAL_CONTROLLER_FIELDS_MAP);
            }
        })
    }
}

const modifyRadioButtonTitleAccordingToLegalRepType = (_this, module) => {
    let legalRepType = _this.groupDatas.ORG_INFO.SUBJECT_IDENTITY_INFO[0].FIELDS.LEGAL_REP_TYPE.DEFAULT_VALUE;
    let btnfieldTitle = legalRepType == "08" ? "与执行事务合伙人信息一致" : "与法定代表人信息一致";
    module.FIELDS.MODULE_RADIO_BUTTON.FIELD_TITLE = btnfieldTitle;
}

const modifyFieldsConfig = (_this) => {
    let allIdTypes = _this.oppBusiData.individualValidIdTypes;
    bizPublicMethod.$blMethod.filterOptionsButRetainHistoryOptions(_this, "EQUITY_INFO", "ACTUAL_CONTROLLER_INFO",
        "CONTROLER_ID_TYPE", allIdTypes, EXCLUDE_ID_TYPES, custInfoModel.getOriginaOrgControllerInfo(_this.oppBusiData.oldBusiData));
}
/**
 * 判断字段是否没有改变
 * @param {object} field 字段对象
 */
const isFieldValueNotChanged = (field) => {
    return field.LAST_DEFAULT_VALUE == field.DEFAULT_VALUE;
}

const cascadeUpdate = _.debounce((_this, module) => {
    let sourceGroupInfo = {
        GROUP_ID: module.GROUP_ID,
        MODULE_ID: module.MODULE_ID,
        MODULE_SEQ: module.MODULE_SEQ,
    }
    bizPublicMethod.$blMethod.cascadeUpdate(_this, sourceGroupInfo);
 }, 50, {'trailing': true, 'leading': false});

export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizOrgControllerNodeBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     */
    bizOrgActualControllerNodeBeforeLoadBiz: function (_this) {
        _this.groupDatas.EQUITY_INFO.ACTUAL_CONTROLLER_INFO[0].FIELDS.CONTROLER_NAME.VALID_TYPE = "length[1,64]";
        let maxController = _.get(_this.oppBusiData, "busiCommonParams.MAX_CONTROLER", "");
        _this.groupDatas.EQUITY_INFO.ACTUAL_CONTROLLER_INFO[0].MAX_LENGTH = _.isEmpty(maxController) ? "999" : maxController;
        _this.groupDatasTpl.EQUITY_INFO.ACTUAL_CONTROLLER_INFO[0] = _.cloneDeep(_this.groupDatas.EQUITY_INFO.ACTUAL_CONTROLLER_INFO[0]);
        let originaControllerinfo = custInfoModel.getOriginaOrgControllerInfo(_this.oppBusiData.oldBusiData);
        if (originaControllerinfo && originaControllerinfo.length) {
            bizPublicMethod.$blMethod.parseMoudleArray(_this, _this.groupDatas["EQUITY_INFO"]["ACTUAL_CONTROLLER_INFO"], originaControllerinfo);
        }
    },
    /*
     *@method bizOrgControllerNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     */
    bizOrgActualControllerNodeAfterLoadBiz: function (_this) {
        backfillHistoryData(_this);
        modifyFieldsConfig(_this);
    },
    /*
     *@method bizOrgControllerNodeBeforeSave
     *@desc 钩子函数 自定义保存数
     */
    bizOrgActualControllerNodeBeforeSave: async function (_this, params) {
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
        if (_this.busiCode == "V0050") {
            let relaInfo = params.RELA_INFO || {};
            relaInfo.ORG_CONTROLER_INFO = params.ORG_CONTROLER_INFO;
            delete relaInfo.ORG_CONTROLER_INFO.DIFF_INFO;
            // 翻译字段字典项，以便影像展示
            for (let i in relaInfo.ORG_CONTROLER_INFO) {
                let fields = _this.groupDatas.EQUITY_INFO.ACTUAL_CONTROLLER_INFO[i].FIELDS;
                relaInfo.ORG_CONTROLER_INFO[i].CONTROLER_ID_TYPE_TEXT = 
                    bizPublicMethod.$blMethod.getFieldDictItemName(fields.CONTROLER_ID_TYPE);
            }
            Object.assign(params, {
                RELA_INFO: relaInfo
            })
        }
        //增加diffinfo 属性 用于展示
        let actualControllerInfoFields = _this.groupDatas.EQUITY_INFO.ACTUAL_CONTROLLER_INFO[0].FIELDS;
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
    bizOrgActualControllerNodeAfterSave: (_this, newData) => {

    },
    /*
     *@method bizOrgControllerNodeValidate
     *@desc 钩子函数 下一步验证
     */
    bizOrgActualControllerNodeValidate: function (_this) {
        let saveGroupId = "EQUITY_INFO";
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
    bizOrgActualControllerNodePageActivated: function (_this, groupId) {
        _.each(_this.groupDatas.EQUITY_INFO.ACTUAL_CONTROLLER_INFO, module => {
            modifyRadioButtonTitleAccordingToLegalRepType(_this, module)
        })
        updateRadioButtonsFieldControl(_this, "EQUITY_INFO", "ACTUAL_CONTROLLER_INFO");
    },

    bizOrgActualControllerNodeAddModuleFinished: function(_this, module) {
        modifyFieldsConfig(_this);
        modifyRadioButtonTitleAccordingToLegalRepType(_this, module);
        updateRadioButtonsFieldControl(_this, module.GROUP_ID, module.MODULE_ID);
        // 添加时如果受益所有人勾选了“与实际控制人一致”，直接触发一下 CHECK_MODULE_RADIO 即可
        let beneficiaryModuleArr = _this.groupDatas.RELA_INFO.BENEFICIARY_OWNER_INFO;
        if (beneficiaryModuleArr[0].FIELDS.MODULE_RADIO_BUTTON.DEFAULT_VALUE == "true") {
            _this.busiLogic["CHECK_MODULE_RADIO"] && _this.busiLogic["CHECK_MODULE_RADIO"](_this, 
                beneficiaryModuleArr[0].FIELDS.MODULE_RADIO_BUTTON,  beneficiaryModuleArr[0].FIELDS,
                beneficiaryModuleArr[0]);
        }

    },
    bizOrgActualControllerNodeDeleteModule: function(_this, module, index) {
        // 删除时如果受益所有人勾选了“与实际控制人一致”，要把对应的受益所有人删除
        let beneficiaryModuleArr = _this.groupDatas.RELA_INFO.BENEFICIARY_OWNER_INFO;
        if (beneficiaryModuleArr[0].FIELDS.MODULE_RADIO_BUTTON.DEFAULT_VALUE == "true") {
            let moduleNum = bizPublicMethod.$blMethod.getModuleNum(_this, module.GROUP_ID, 
                module.MODULE_ID, module.MODULE_SEQ);
            beneficiaryModuleArr.splice(moduleNum, 1);
            // 如果删除的是第一条，要把受益所有人的勾选框显示出来，并勾选
            if (moduleNum == 0) {
                _this.oppBusiData.enableBeneficiaryModuleRadioCheck = false;
                beneficiaryModuleArr[0].FIELDS.MODULE_RADIO_BUTTON.FIELD_CONTROL = "0";
                beneficiaryModuleArr[0].FIELDS.MODULE_RADIO_BUTTON.DEFAULT_VALUE = "true";
                _this.$nextTick(() => {
                    _this.oppBusiData.enableBeneficiaryModuleRadioCheck = true;
                })
            }
        }
    },

    bizOrgActualControllerNodeDeleteModuleFinished: function(_this, module) {
        updateRadioButtonsFieldControl(_this, module.GROUP_ID, module.MODULE_ID);
    },

    "CHECK_CONTROLER_ID_NO": (_this, field, fieldData, module) => {
        cascadeUpdate(_this, module);
        let existFlag = _this.$blMethod.checkIdCodeIsExisted(_this, field, "实际控制人证件号码不能重复");
        if (existFlag) {
            return false;
        }
    },
    "CHECK_MODULE_RADIO": (_this, field, fieldData,module) => {
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
    "CHECK_CONTROLER_ID_TYPE": (_this, field, fieldData, module) => {
        if (isFieldValueNotChanged(field)) {
            return;
        }
        cascadeUpdate(_this, module);
        if (!field.disableClear) {
            fieldData["CONTROLER_ID_NO"].DEFAULT_VALUE = "";
            fieldData["CONTROLER_ID_EXP_DATE"].DEFAULT_VALUE = "";
        }
        field.disableClear = false;
        fieldData["CONTROLER_ID_NO"].VALID_TYPE = bizPublicMethod.$blMethod.getIdCodeValidType(field.DEFAULT_VALUE);
        field.LAST_DEFAULT_VALUE = field.DEFAULT_VALUE;
    },
    "CHECK_CONTROLER_ID_EXP_DATE": (_this, field, fieldData, module) => {
        cascadeUpdate(_this, module);
        if (bizPublicMethod.$blMethod.isExpired(_this, field.DEFAULT_VALUE)) {
            _this.$nextTick( () => {
                bizPublicMethod.$blMethod.changeFieldError(field, false, field.FIELD_TITLE + "已过期");
            })
            return false;
        }
    },
    "CHECK_CONTROLER_NAME": (_this, field, fieldData, module) => {
        cascadeUpdate(_this, module);
    },
}
