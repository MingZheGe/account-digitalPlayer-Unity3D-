/*
 *   法定代表人信息
 *   方法封装
 */

import date from '../../../../../../../tools/date.js'
import * as utils from "../../../../../../../tools/util"
import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../businessTools/bizPublicMethod.js"
import custInfoModel from '../../common/cust-info-model.js'


/**
 * 法定代表人、执行事务合伙人要去掉的证件类型：军官证、士兵证、户口本、台胞证、解放军文职干部、武警文职干部、
 * 社会保障号、文职证、警官证
 */
 const LEGAL_REP_EXCLUDE_ID_TYPES = ["02", "03", "04", "05", "07", "0a", "0f", "0g", "0h"];

/**
 * 判断字段是否没有改变
 * @param {object} field 字段对象
 */
 const isFieldValueNotChanged = (field) => {
    return field.LAST_DEFAULT_VALUE == field.DEFAULT_VALUE;
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

const cascadeUpdate = _.debounce((_this, module) => {
    let sourceGroupInfo = {
        GROUP_ID: module.GROUP_ID,
        MODULE_ID: module.MODULE_ID,
        MODULE_SEQ: module.MODULE_SEQ,
    }
    bizPublicMethod.$blMethod.cascadeUpdate(_this, sourceGroupInfo);
 }, 50, {'trailing': true, 'leading': false});

const backfillHistoryData = (_this) => {
    let orgLegalRepInfo = _this.historyData["ORG_LEGAL_REP_INFO"];
    if( !_.isEmpty(orgLegalRepInfo)){
        bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["LEGAL_REP_INFO"], orgLegalRepInfo);      
    }
 }

/**
 * 若执行事务合伙人信息为个人时，不显示委派代表信息
 * @param {object} _this 
 * @param {string} legalRepIdType 
 */
const showLegalClientIfOrgLegalRep = (_this, legalRepIdType) => {
    //需要公参控制
    let SHOW_LEGAL_CLIENT = _this.$blMethod.getJsonSessionBusiCommParam(_this, "SHOW_LEGAL_CLIENT") || "1";
    let isOrgLegalRep = _.indexOf(_this.oppBusiData.orgValidIdTypes, legalRepIdType) > -1;
    let moduleControl = (isOrgLegalRep && SHOW_LEGAL_CLIENT == "1") ? "1" : "0";
    _.each(_this.groupDatas.RELA_INFO.LEGAL_CLIENT_INFO, legalClient => {
        legalClient.MODULE_CONTROL = moduleControl;
    })
}

//开户和非开户 字段数据加载 公共操作
const bizOrgLegalRepInfoBeforeLoadBizCommon = (_this) => {
}


const modifyFieldConfig = (_this) => {
    // 此函数在 beforeload 中被调用，被调用时法人类别不一定已经被回填，因此，证件类型先设置为个人证件+机构证件
    let idTypes = [];
    idTypes = _.union(_this.oppBusiData.individualValidIdTypes, _this.oppBusiData.orgValidIdTypes);
    bizPublicMethod.$blMethod.filterOptionsButRetainHistoryOptions(_this, "RELA_INFO", "LEGAL_REP_INFO",
    "LEGAL_REP_ID_TYPE", idTypes, LEGAL_REP_EXCLUDE_ID_TYPES, custInfoModel.getOriginaOrgLegalRepInfo(_this.oppBusiData.oldBusiData));
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
        moduleTitle = "执行事务合伙人信息";
        idTypes = _.union(_this.oppBusiData.individualValidIdTypes, _this.oppBusiData.orgValidIdTypes);
    } else {
        moduleTitle = "法定代表人信息";
        idTypes = _this.oppBusiData.individualValidIdTypes;
    }
    _this.groupDatas.RELA_INFO.LEGAL_REP_INFO[0].MODULE_TITLE = moduleTitle;
    bizPublicMethod.$blMethod.filterOptionsButRetainHistoryOptions(_this, "RELA_INFO", "LEGAL_REP_INFO",
        "LEGAL_REP_ID_TYPE", idTypes, LEGAL_REP_EXCLUDE_ID_TYPES, custInfoModel.getOriginaOrgLegalRepInfo(_this.oppBusiData.oldBusiData));
}

export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizOrgLegalRepInfoBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     */
    bizOrgLegalRepInfoBeforeLoadBiz: function (_this) {
        bizOrgLegalRepInfoBeforeLoadBizCommon(_this)
        let orgLegalRepInfo = custInfoModel.getOriginaOrgLegalRepInfo(_this.oppBusiData.oldBusiData);
        if( !_.isEmpty(orgLegalRepInfo)){
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["LEGAL_REP_INFO"], orgLegalRepInfo);
            showLegalClientIfOrgLegalRep(_this, orgLegalRepInfo.LEGAL_REP_ID_TYPE);     
        }
    },
    /*
     *@method bizOrgLegalRepInfoAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     */
    bizOrgLegalRepInfoAfterLoadBiz: function (_this) {
        backfillHistoryData(_this);
        modifyFieldConfig(_this);
        //委派代表隐藏显示 用于状态的
        let legalRepIdType = _this.groupDatas["RELA_INFO"]["LEGAL_REP_INFO"][0].FIELDS.LEGAL_REP_ID_TYPE.DEFAULT_VALUE;
        showLegalClientIfOrgLegalRep(_this, legalRepIdType);
    },
    /*
     *@method bizOrgLegalRepInfoBeforeSave
     *@desc 钩子函数 自定义保存数
     */
    bizOrgLegalRepInfoBeforeSave: function (_this, params) {
        let legalRepInfo = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "LEGAL_REP_INFO");

        let originlLegalRepInfo = custInfoModel.getOriginaOrgLegalRepInfo(_this.oppBusiData.oldBusiData);
        let legalInfoFields = _this.groupDatas.RELA_INFO.LEGAL_REP_INFO[0].FIELDS;
        let oldLegalRepInfo = bizPublicMethod.$blMethod.getOriginalFieldValues(legalInfoFields, 
            originlLegalRepInfo);
        
        let legalInfoDiff = bizPublicMethod.$blMethod.compareInfo2(oldLegalRepInfo, legalRepInfo, "");
        legalRepInfo.DIFF_INFO = legalInfoDiff;
        let changedFieldIds = Object.assign({}, _.map(legalInfoDiff, "FIELD"));
        let changedFieldIdsObj = {};
        _.each(changedFieldIds, obj => {
            changedFieldIdsObj[obj] = true;
        })
        let tempParam = {};
        if (changedFieldIdsObj["LEGAL_REP"]) {
            tempParam.isLegalRepNameChange = "1";
            tempParam.isLegalInfoChange = "1";
            tempParam.isLealInfoImportChange = "1";
        }
        if (changedFieldIdsObj["LEGAL_REP_ID_TYPE"] || changedFieldIdsObj["LEGAL_REP_ID_CODE"]) {
            tempParam.isLegalInfoChange = "1";
            tempParam.isLealInfoImportChange = "1";
        }

        Object.assign(params, {
            ORG_LEGAL_REP_INFO: legalRepInfo,
            IS_LEGAL_REP_NAME_CHANGE: tempParam.isLegalRepNameChange || "",
            NEED_SYNC_CSDC_FLAG: tempParam.isLealInfoImportChange == "1" ? "1" : 
                params.NEED_SYNC_CSDC_FLAG
        })

        //增加diffinfo 属性 用于展示
        let webShow = _this.$blMethod.addDiffAtt(legalInfoFields, legalInfoDiff) || [];
        params.LEGAL_REP_INFO_WEB_SHOW = webShow;
        let moduleName =  _this.groupDatas.RELA_INFO.LEGAL_REP_INFO[0].MODULE_TITLE || "";
        webShow = _.each(webShow, webShowItem => {
            webShowItem.FIELD_TITLE = moduleName + webShowItem.FIELD_TITLE;
        })
        //y042表单添加FIELD_TITLE
        params.ORG_LEGAL_REP_INFO && (params.ORG_LEGAL_REP_INFO.DIFF_INFO = webShow)
        
        /**开户数据保存 */
        if (_this.busiCode == "V0050") {
            let relaInfo = params.RELA_INFO || {};
            relaInfo.ORG_LEGAL_REP_INFO = params.ORG_LEGAL_REP_INFO;
            delete relaInfo.ORG_LEGAL_REP_INFO.DIFF_INFO
            // 翻译字段字典项，以便影像展示
            let fields = _this.groupDatas.RELA_INFO.LEGAL_REP_INFO[0].FIELDS;
            relaInfo.ORG_LEGAL_REP_INFO.LEGAL_REP_ID_TYPE_TEXT = 
                bizPublicMethod.$blMethod.getFieldDictItemName(fields.LEGAL_REP_ID_TYPE);
            Object.assign(params, params.ORG_LEGAL_REP_INFO, {
                RELA_INFO: relaInfo,
                NEED_IDENTITY_INFO: _this.oppBusiData.NEED_IDENTITY_INFO == "1" ? "1" : "0"
            })
        }
        return params;
    },
    /*
     *@method bizOrgLegalRepInfoAfterSave
     *@desc 钩子函数 自定义保存数
     */
    bizOrgLegalRepInfoAfterSave: (_this, newData) => {

    },
    /*
     *@method bizOrgLegalRepInfoValidate
     *@desc 钩子函数 下一步验证
     */
    bizOrgLegalRepInfoValidate: function (_this) {
        let modules = _this.groupDatas.RELA_INFO.LEGAL_REP_INFO;
        let fieldIds = ["LEGAL_REP_ID_EXP_DATE"];
        let promiseArr = bizPublicMethod.$blMethod.getValidatePromises(_this, modules, fieldIds);
        return Promise.all(promiseArr).then((res)=> {
            if (_.includes(res, false)) {
                return false;
            }
            let fieldData = modules[0].FIELDS;
            // 开户需要展示中登联网校验按钮
            if (_this.busiCode == "V0050" && fieldData.LEGAL_REP_ID_TYPE.DEFAULT_VALUE == "00") {
                let SEX = (fieldData.LEGAL_REP_ID_CODE.DEFAULT_VALUE.substring(16, 17) % 2) ? "0" : "1";
                let BIRTHDAY = fieldData.LEGAL_REP_ID_CODE.DEFAULT_VALUE.substr(6, 8);
                _this.removeFlowTip('not-cdsc');
                return bizPublicMethod.$blMethod.validateThree(_this, {
                    CUST_FNAME: fieldData.LEGAL_REP.DEFAULT_VALUE,
                    USER_NAME: fieldData.LEGAL_REP.DEFAULT_VALUE,
                    ID_TYPE: fieldData.LEGAL_REP_ID_TYPE.DEFAULT_VALUE,
                    ID_CODE: fieldData.LEGAL_REP_ID_CODE.DEFAULT_VALUE,
                    USER_TYPE: _this.userType,
                    SEX: SEX,
                    BIRTHDAY: BIRTHDAY
                }).then(validate => {
                    _this.oppBusiData.NEED_IDENTITY_INFO = "0"
                    // 公参设置不需要校验 直接过去 
                    if (validate == "0") {
                        return true;
                    }
                    if (validate != "1") {
                        // 这个得改成非禁止项并提供影像证明
                        // _this.pushFlowTip( {
                        //     title: "中登联网校验失败，请重试或联系工作人员进行处理",
                        //     type: "error",
                        //     key: "not-cdsc"
                        // })
                        // return false;
                        _this.loading = false;
                        return new Promise((resolve) => {
                            _this.messageBox({
                                hasMask:true,
                                messageText:"中登联网校验不通过，需提供身份证明材料。",
                                confirmButtonText:'确定',
                                cancelButtonText: "返回修改",
                                typeMessage:'error', 
                                showMsgBox:true,
                                confirmedAction: () => {
                                    _this.oppBusiData.NEED_IDENTITY_INFO = "1"
                                    _this.loading = true;
                                    resolve(true);
                                },
                                canceledAction: () => {
                                    resolve(false)
                                },
                            }) 
                        })
                    }
                });
                
            }
        })
    },

    /*
     *@method bizOrgLegalRepInfoPageActivated
     *@desc 钩子函数：页面激活
     */
    bizOrgLegalRepInfoPageActivated: function (_this) {
        let legalRepType = 
            _this.groupDatas.ORG_INFO.SUBJECT_IDENTITY_INFO[0].FIELDS.LEGAL_REP_TYPE.DEFAULT_VALUE;
        modifyLegalRepConfigAccordingToLegalType(_this, legalRepType);
    },

    bizOrgLegalRepInfoPreValidate: function(_this) {
    },
    //----------------------业务函数----------------------------------//

    "CHECK_LEGAL_REP_ID_TYPE": (_this, field, fieldData, module) => {
        if (isFieldValueNotChanged(field)) {
            return;
        }
        if (!field.disableClear) {
            fieldData["LEGAL_REP_ID_CODE"].DEFAULT_VALUE = "";
            fieldData["LEGAL_REP_ID_EXP_DATE"].DEFAULT_VALUE = "";
        }
        field.disableClear = false;
        
        let HIS_ID_TYPE = _.get(_this.oppBusiData.oldBusiData, 'LEGAL_INFO[0].LEGAL_REP_ID_TYPE', '');
        let HIS_ID_CODE = _.get(_this.oppBusiData.oldBusiData, 'LEGAL_INFO[0].LEGAL_REP_ID_CODE', '');
        let HIS_ID_EXP_DATE = _.get(_this.oppBusiData.oldBusiData, "LEGAL_INFO[0].LEGAL_REP_ID_EXP_DATE", '');
        if(field.DEFAULT_VALUE != '' && field.DEFAULT_VALUE == HIS_ID_TYPE) {
            fieldData.LEGAL_REP_ID_CODE.DEFAULT_VALUE = HIS_ID_CODE || '';
            fieldData.LEGAL_REP_ID_EXP_DATE.DEFAULT_VALUE = HIS_ID_EXP_DATE || '';
        }

        fieldData["LEGAL_REP_ID_CODE"].VALID_TYPE = bizPublicMethod.$blMethod.getIdCodeValidType(field.DEFAULT_VALUE);
        showLegalClientIfOrgLegalRep(_this, field.DEFAULT_VALUE);
        let isOrgValidIdType = _.indexOf(_this.oppBusiData.orgValidIdTypes, field.DEFAULT_VALUE) > -1;
        if (isOrgValidIdType) {
            let sourceGroupInfo = {
                GROUP_ID: module.GROUP_ID,
                MODULE_ID: module.MODULE_ID,
                MODULE_SEQ: module.MODULE_SEQ,
            }
            // 机构法人，负责人与控制人如果原来有级联关系的，要取消级联关系，且要清空模块字段值、字段设置为可编辑
            bizPublicMethod.$blMethod.clearCascadeModuleAndSetEditable(_this, sourceGroupInfo,
                "RELA_INFO", "RESPONSIBLE_PERSON_INFO");
            bizPublicMethod.$blMethod.clearCascadeModuleAndSetEditable(_this, sourceGroupInfo,
                "EQUITY_INFO", "ACTUAL_CONTROLLER_INFO");
            bizPublicMethod.$blMethod.cancelCascade(_this, sourceGroupInfo,
                "RELA_INFO", "RESPONSIBLE_PERSON_INFO");
            bizPublicMethod.$blMethod.cancelCascade(_this, sourceGroupInfo,
                "EQUITY_INFO", "ACTUAL_CONTROLLER_INFO");
        }
        cascadeUpdate(_this, module);
        updateRadioButtonsFieldControl(_this, "RELA_INFO", "RESPONSIBLE_PERSON_INFO");
        updateRadioButtonsFieldControl(_this, "EQUITY_INFO", "ACTUAL_CONTROLLER_INFO");
        field.LAST_DEFAULT_VALUE = field.DEFAULT_VALUE;
    },
    "CHECK_LEGAL_REP": (_this, field, fieldData, module) => {
        cascadeUpdate(_this, module);
    },
    "CHECK_LEGAL_REP_ID_CODE": (_this, field, fieldData, module) => {
        cascadeUpdate(_this, module);
    },
    "CHECK_LEGAL_REP_ID_EXP_DATE": (_this, field, fieldData, module) => {
        cascadeUpdate(_this, module);
        if (bizPublicMethod.$blMethod.isExpired(_this, field.DEFAULT_VALUE)) {
            _this.$nextTick( () => {
                bizPublicMethod.$blMethod.changeFieldError(field, false, field.FIELD_TITLE + "已过期");
            })
            return false;
        }
    },
}

