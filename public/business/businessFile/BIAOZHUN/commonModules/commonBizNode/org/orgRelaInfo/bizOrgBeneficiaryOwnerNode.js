/*
 *   受益所有人类型
 *   方法封装
 */

import date from '../../../../../../../tools/date.js'
import * as utils from "../../../../../../../tools/util"
import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../businessTools/bizPublicMethod.js"
import custInfoModel from '../../common/cust-info-model.js'
import {parseAddress} from '../../../../../../../tools/util' //地址解析组件

/**
 * 受益所有人要去掉的证件类型：军官证、士兵证、户口本、台胞证、解放军文职干部、武警文职干部、
 * 社会保障号、文职证、警官证
 */
const EXCLUDE_ID_TYPES = ["02", "03", "04", "05", "07", "0a", "0f", "0g", "0h"];

const WRONG_ADDRESS_TIP_KEY = "wrongAddress";

const WRONG_ADDRESS_TIP_TITLE = "联系地址请精确到门牌号！";

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
 * 实际控制人与受益所有人字段的映射关系
 */
 const ACTUAL_CONTROLLER_BENEFICIARY_OWNER_FIELDS_MAP = {
    "CONTROLER_NAME": "BENEFICIARY_NAME",
    "CONTROLER_ID_TYPE": "BENEFICIARY_ID_TYPE",
    "CONTROLER_ID_NO": "BENEFICIARY_ID",
    "CONTROLER_ID_EXP_DATE": "BENEFICIARY_EXP_DATE"
}

/**
 * 启用“与实际控制人一致”按钮
 */
const ENABLE_SAME_WITH_CONTROLLER_BUTTON = false;

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


const isCorrectAddress = (idType, address) => {
    if (idType == "00") {
        return isCorrectDomesticAddress(address);
    } else {
        return isCorrectOverseasAddress(address);
    }
}

const backfillHistoryData = (_this) => {
    let beneficiaryOwnerInfo = _this.historyData["ORG_BENEFICIARY_OWNER_INFO"];
    if (!_.isEmpty(beneficiaryOwnerInfo)) {
        beneficiaryOwnerInfo = _.each(beneficiaryOwnerInfo, beneficiaryOwnerInfoItem => {
            if (!_.toNumber(beneficiaryOwnerInfoItem.SHARE_RATIO)) {
                beneficiaryOwnerInfoItem.SHARE_RATIO = "";
            }
        })
        bizPublicMethod.$blMethod.parseMoudleArray(_this, 
            _this.groupDatas["RELA_INFO"]["BENEFICIARY_OWNER_INFO"], _.filter(beneficiaryOwnerInfo, item => {
                return item.OPER_TYPE && item.OPER_TYPE != "2";
            }));
    }
 }

/**
 * 判断字段是否没有改变
 * @param {object} field 字段对象
 */
const isFieldValueNotChanged = (field) => {
    return field.LAST_DEFAULT_VALUE == field.DEFAULT_VALUE;
}

const bizOrgBeneficiaryOwnerBeforeLoadBizCommon = (_this) => {
    let maxBeneficialOwner = _.get(_this.oppBusiData, "busiCommonParams.MAX_BENEFICIARY_OWNER", "");
    _this.groupDatas.RELA_INFO.BENEFICIARY_OWNER_INFO[0].MAX_LENGTH = _.isEmpty(maxBeneficialOwner) ? "999" : maxBeneficialOwner;
    
    _.each(_this.groupDatas.RELA_INFO.BENEFICIARY_OWNER_INFO, obj => {
        let fields = obj.FIELDS;
        fields.BENEFICIARY_ADDR.VALID_TYPE = "length[16,128]";
    })
    _this.groupDatas.RELA_INFO.AML_INFO[0].FIELDS.AML_CUST_TYPE.labelWidth = "240";
    _this.groupDatas.RELA_INFO.AML_INFO[0].FIELDS.BENEFICIARY_TYPE.labelWidth = "240";

    _this.groupDatas.RELA_INFO.BENEFICIARY_OWNER_INFO[0].FIELDS.NATION.showDictItem = "1";
    _this.groupDatasTpl.RELA_INFO.BENEFICIARY_OWNER_INFO[0] = _.cloneDeep(_this.groupDatas.RELA_INFO.BENEFICIARY_OWNER_INFO[0]);
}

/**
 * 设置模块属性的值
 * @param {object} _this 
 * @param {string} groupId 
 * @param {string} moduleId 
 * @param {string} attribute 属性名称 
 * @param {string} value 属性值
 */
const setModuleAttribute = (_this, groupId, moduleId, attribute, value) => {
    _.each(_this.groupDatas[groupId][moduleId], module => {
        module[attribute] = value;
    })
}
/**
 * 第一条记录，展示与xx一致按钮
 * @param {object} _this 
 */
const displayFirstModuleRadioButton = (_this) => {
    let moduleArr = _this.groupDatas["RELA_INFO"]["BENEFICIARY_OWNER_INFO"];
    for (let i in moduleArr) {
        let fieldControl = "1";
        if (ENABLE_SAME_WITH_CONTROLLER_BUTTON) {
            fieldControl = i == 0 ? "0" : "1";
        }
        moduleArr[i].FIELDS.MODULE_RADIO_BUTTON.FIELD_CONTROL = fieldControl;
    }
}
/**
 * 设置字段属性值
 * @param {object} _this 
 * @param {string} groupId 
 * @param {string} moduleId 
 * @param {object} fieldIds 字段 id 数组
 * @param {string} attribute 属性名称
 * @param {string} value 属性值
 */
const setFieldsAttribute = (_this, groupId, moduleId, fieldIds, attribute, value) => {
    let moduleArr = _this.groupDatas[groupId][moduleId];
    _.each(moduleArr, module => {
        _.each(fieldIds, fieldId => {
            module.FIELDS[fieldId][attribute] = value;
        })
    })
}


const getEmptyBeneficiaryModule = (_this) => {
    let moduleArr = _this.groupDatas.RELA_INFO.BENEFICIARY_OWNER_INFO;
    let module = _.cloneDeep(moduleArr[moduleArr.length - 1]);
    // 清空 DEFAULT_VALUE
    _.each(module.FIELDS, field => {
        field.DEFAULT_VALUE = "";
    })
    module.MODULE_SEQ = "" + (Number(module.MODULE_SEQ) + 1);
    return module;
}

const handleBeneficiaryModuleRadioCheck =  (_this, field, fieldData, module) => {
    let controllerModuleArr = _this.groupDatas["EQUITY_INFO"]["ACTUAL_CONTROLLER_INFO"];
    let beneficiaryModuleArr = _this.groupDatas[module.GROUP_ID][module.MODULE_ID];
    displayFirstModuleRadioButton(_this);
    /**1. 使受益所有人与实际控制人数量一致 */
    if (field.DEFAULT_VALUE == "true") {
        _this.oppBusiData.enableBeneficiaryModuleRadioCheck = false;
        if (beneficiaryModuleArr.length > controllerModuleArr.length) {
            for (let i = 0; i < beneficiaryModuleArr.length - controllerModuleArr.length; i++) {
                beneficiaryModuleArr.pop();
            }
        } else if (beneficiaryModuleArr.length < controllerModuleArr.length) {
            for (let i = 0; i < controllerModuleArr.length - beneficiaryModuleArr.length; i++) {
                beneficiaryModuleArr.push(getEmptyBeneficiaryModule(_this));
            }
        }
        _this.oppBusiData.enableBeneficiaryModuleRadioCheck = true;
    }
    /**2. 更新“添加”、“删除”、“读卡”按钮 */
    if (field.DEFAULT_VALUE == "true") {
        setModuleAttribute(_this, module.GROUP_ID, module.MODULE_ID, "MODULE_ADD", "0");
        setModuleAttribute(_this, module.GROUP_ID, module.MODULE_ID, "MODULE_DELETE", "0");
        setModuleAttribute(_this, module.GROUP_ID, module.MODULE_ID, "MODULE_READ", "0");
    } else {
        let moduleArr = _this.groupDatas[module.GROUP_ID][module.MODULE_ID];
        let maxBeneficialOwner = _.get(_this.oppBusiData, "busiCommonParams.MAX_BENEFICIARY_OWNER", "");
        if (_.isEmpty(maxBeneficialOwner) || moduleArr.length < maxBeneficialOwner) {
            // 最大受益所有人数量没有设置，或者当前数量少于设置的数量，最后一个模块要加上“添加”按钮
            moduleArr[moduleArr.length - 1].MODULE_ADD = "1";
        }
        // 有多条记录时，添加“删除”按钮
        setModuleAttribute(_this, module.GROUP_ID, module.MODULE_ID, "MODULE_DELETE", 
            moduleArr.length > 1 ? "1" : "0");
        // 开户有读卡，资料修改没有
        if (_this.busiCode == "V0050") {
            setModuleAttribute(_this, module.GROUP_ID, module.MODULE_ID, "MODULE_READ", "1");
        }
    }
    /**3. 更新“三要素”及证件有效期的可编辑状态 */
    let fieldIds = ["BENEFICIARY_NAME",  "BENEFICIARY_ID_TYPE", "BENEFICIARY_ID", "BENEFICIARY_EXP_DATE"];
    if (field.DEFAULT_VALUE == "true") {
        setFieldsAttribute(_this, module.GROUP_ID, module.MODULE_ID, fieldIds, "FIELD_CONTROL", "2");
    } else {
        setFieldsAttribute(_this, module.GROUP_ID, module.MODULE_ID, fieldIds, "FIELD_CONTROL", "0");
    }
    /**4. 注册/注销级联关系*/
    if (field.DEFAULT_VALUE == "true") {
        for (let i = 0; i < controllerModuleArr.length; i++) {
            let controllerModule = controllerModuleArr[i];
            let beneficiaryModule = beneficiaryModuleArr[i];
            let controllerGroupInfo = {
                GROUP_ID: controllerModule.GROUP_ID,
                MODULE_ID: controllerModule.MODULE_ID,
                MODULE_SEQ: controllerModule.MODULE_SEQ,
            }
            let beneficiaryGroupInfo = {
                GROUP_ID: beneficiaryModule.GROUP_ID,
                MODULE_ID: beneficiaryModule.MODULE_ID,
                MODULE_SEQ: beneficiaryModule.MODULE_SEQ,
            }
            bizPublicMethod.$blMethod.cascadeTo(_this, controllerGroupInfo, beneficiaryGroupInfo, 
                ACTUAL_CONTROLLER_BENEFICIARY_OWNER_FIELDS_MAP);
            bizPublicMethod.$blMethod.copyFieldsAndTrigerCheck(beneficiaryModule.FIELDS, controllerModule.FIELDS, 
                ACTUAL_CONTROLLER_BENEFICIARY_OWNER_FIELDS_MAP, _this, beneficiaryModule);
        }
    } else {
        _.each(controllerModuleArr, controllerModule => {
            let controllerGroupInfo = {
                GROUP_ID: controllerModule.GROUP_ID,
                MODULE_ID: controllerModule.MODULE_ID,
                MODULE_SEQ: controllerModule.MODULE_SEQ,
            }
            bizPublicMethod.$blMethod.cancelCascade(_this, controllerGroupInfo, "RELA_INFO",
                "BENEFICIARY_OWNER_INFO");
        })
    }
}

export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizOrgBeneficiaryOwnerBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     */
    bizOrgBeneficiaryOwnerBeforeLoadBiz: function (_this) {
        bizOrgBeneficiaryOwnerBeforeLoadBizCommon(_this)
        let actualBeneficiaryInfo = custInfoModel.getOriginalOrgActualBeneficiaryInfo(_this.oppBusiData.oldBusiData);
        actualBeneficiaryInfo = _.each(actualBeneficiaryInfo, actualBeneficiaryInfoItem => {
            if (!_.toNumber(actualBeneficiaryInfoItem.SHARE_RATIO)) {
                actualBeneficiaryInfoItem.SHARE_RATIO = "";
            }
        })
        if (!_.isEmpty(actualBeneficiaryInfo)) {
            bizPublicMethod.$blMethod.parseMoudleArray(_this, _this.groupDatas["RELA_INFO"]["BENEFICIARY_OWNER_INFO"], actualBeneficiaryInfo);
        }
    },
    bizOrgBeneficiaryOwnerBeforeLoadBizOpenAcct: function (_this) {
        bizOrgBeneficiaryOwnerBeforeLoadBizCommon(_this)
    },
    /*
     *@method bizOrgBeneficiaryOwnerAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     */
    bizOrgBeneficiaryOwnerAfterLoadBiz: function (_this) {
        backfillHistoryData(_this);
        displayFirstModuleRadioButton(_this);
        bizPublicMethod.$blMethod.filterOptionsButRetainHistoryOptions(_this, "RELA_INFO", 
        "BENEFICIARY_OWNER_INFO", "BENEFICIARY_ID_TYPE", _this.oppBusiData.individualValidIdTypes, EXCLUDE_ID_TYPES, custInfoModel.getOriginalOrgActualBeneficiaryInfo(_this.oppBusiData.oldBusiData));
        let beneficiaryType = _this.groupDatas.RELA_INFO.AML_INFO[0].FIELDS.BENEFICIARY_TYPE.DEFAULT_VALUE;
        let isShow = BENEFICIARY_TYPE_SHOW_SHARE_RADIO_MAP[beneficiaryType] || false;
        _.each(_this.groupDatas.RELA_INFO.BENEFICIARY_OWNER_INFO, module => {
            module.FIELDS.SHARE_RATIO.FIELD_CONTROL = isShow ? "0" : "1";
        })
        _this.oppBusiData.enableBeneficiaryModuleRadioCheck = true;
        let beneficiaryModuleArr = _this.groupDatas.RELA_INFO.BENEFICIARY_OWNER_INFO;
        if (beneficiaryModuleArr[0].FIELDS.MODULE_RADIO_BUTTON.DEFAULT_VALUE == "true") {
            handleBeneficiaryModuleRadioCheck(_this, beneficiaryModuleArr[0].FIELDS.MODULE_RADIO_BUTTON, 
                beneficiaryModuleArr[0].FIELDS, beneficiaryModuleArr[0]);
        }
    },
    /*
     *@method bizOrgBeneficiaryOwnerBeforeSave
     *@desc 钩子函数 自定义保存数
     */
    bizOrgBeneficiaryOwnerBeforeSave: function (_this, params) {
        let beneficiaryInfo = bizPublicSaveMethod.getModuleArrFoyKey(_this, "BENEFICIARY_OWNER_INFO", true);
        let beneficiaryType = _this.groupDatas.RELA_INFO.AML_INFO[0].FIELDS.BENEFICIARY_TYPE.DEFAULT_VALUE;
        _.each(beneficiaryInfo, obj => {
            obj.BENEFICIARY_TYPE = beneficiaryType
            obj.BENEFICIARY_ADDR = obj.BENEFICIARY_ADDR.replace("市辖区","").replace(/不详/g,"").replace("辖县", "");
        })
        // 持股比例不展示时赋值为空
        let isShow = BENEFICIARY_TYPE_SHOW_SHARE_RADIO_MAP[beneficiaryType] || false;
        if (!isShow) {
            _.each(beneficiaryInfo, obj => {
                obj.SHARE_RATIO = ""
            })
        }

        let originalBeneficiaryInfo = 
            custInfoModel.getOriginalOrgActualBeneficiaryInfo(_this.oppBusiData.oldBusiData);
        if (_this.groupDatas.RELA_INFO.AML_INFO[0].FIELDS.AML_CUST_TYPE.DEFAULT_VALUE == "1") {
            // 模块不展示时，数据不改变
            beneficiaryInfo = originalBeneficiaryInfo;
            // 回填到 groupDatas 中
            if (!_.isEmpty(originalBeneficiaryInfo)) {
                bizPublicMethod.$blMethod.parseMoudleArray(_this, _this.groupDatas["RELA_INFO"]["BENEFICIARY_OWNER_INFO"], originalBeneficiaryInfo);
            }
        }

        let beneficiaryChangeInfo = bizPublicMethod.$blMethod.getArrDiff(
            beneficiaryInfo, originalBeneficiaryInfo, "BENEFICIARY_NO", "MODULE_RADIO_BUTTON");
        
        
        
        let tempParam = {};
        tempParam.isbeneficiaryInfoChanged = 
            bizPublicMethod.$blMethod.isArrayModuleChanged(beneficiaryInfo, originalBeneficiaryInfo);

        let isbeneficiaryInfoChanged = "0";
        _.each(beneficiaryChangeInfo.INFO, obj => {
            // 是否受益所有人标示
            obj.IS_OWNER = "1";
            //判断持股比例新老值 都为0或者空字符串 则不展示对比
            obj.DIFF_INFO = _.filter(obj.DIFF_INFO, diffInfoItem => {
                if (diffInfoItem.FIELD == "SHARE_RATIO" && !_.toNumber(diffInfoItem.NEW) && !_.toNumber(diffInfoItem.OLD)) {
                    return false;
                }
                return true;
            })
            if (obj.OPER_TYPE == "0") {
                isbeneficiaryInfoChanged = "1";
            }
            if (obj.OPER_TYPE == "1") {
                let diffInfo = _.cloneDeep(obj.DIFF_INFO);
                diffInfo = _.filter(diffInfo, diffInfoItem => {
                    return !(diffInfoItem.FIELD == "SPECIAL_PERSON_FLAG" || diffInfoItem.FIELD == "NATION");
                })
                if (diffInfo.length > 0) {
                    isbeneficiaryInfoChanged = "1";
                }
            }
        })
        //受益所有人是否需要采集 x208-银河证券非自然人客户受益所有人信息采集表 排除特定自然人标识和国家 的修改
        
        Object.assign(params, {
            ORG_BENEFICIARY_OWNER_INFO: beneficiaryChangeInfo && beneficiaryChangeInfo.INFO || [],
            IS_BENEFICIARY_OWNER_INFO_CHANGE: isbeneficiaryInfoChanged || "0",
            BENEFICIARY_OWNER_FLAG: _this.groupDatas.RELA_INFO.AML_INFO[0].FIELDS.AML_CUST_TYPE.DEFAULT_VALUE == "1" ? false : true,
            ORG_BENEFICIARY_INFO: [],
            IS_BENEFICIARY_INFO_CHANGE: "0",
        })
        /**开户数据保存 */
        if (_this.busiCode == "V0050") {
            let relaInfo = params.RELA_INFO || {};
            relaInfo.ORG_BENEFICIARY_OWNER_INFO = params.ORG_BENEFICIARY_OWNER_INFO;
            delete relaInfo.ORG_BENEFICIARY_OWNER_INFO.DIFF_INFO;
            relaInfo.BENEFICIARY_OWNER_FLAG = _.isEmpty(beneficiaryInfo) ? false : true;
            // 翻译字段字典项，以便影像展示
            for (let i in relaInfo.ORG_BENEFICIARY_OWNER_INFO) {
                let fields = _this.groupDatas.RELA_INFO.BENEFICIARY_OWNER_INFO[i].FIELDS;
                relaInfo.ORG_BENEFICIARY_OWNER_INFO[i].BENEFICIARY_ID_TYPE_TEXT = 
                    bizPublicMethod.$blMethod.getFieldDictItemName(fields.BENEFICIARY_ID_TYPE);
            }
            Object.assign(params, {
                RELA_INFO: relaInfo,
                NEED_IDENTITY_INFO: _this.oppBusiData.NEED_IDENTITY_INFO == "1" ? "1" : "0"
            })
        }
        //增加diffinfo 属性 用于展示
        let beneficiaryFields = _this.groupDatas.RELA_INFO.BENEFICIARY_OWNER_INFO[0].FIELDS;
        let AML_INFO = _this.groupDatas.RELA_INFO.AML_INFO[0].FIELDS;
        let webShow = _this.$blMethod.addDiffAttArr(_.assign({}, beneficiaryFields, AML_INFO), beneficiaryChangeInfo.INFO);
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
        params.BENEFICIARY_OWNER_INFO_WEB_SHOW = webShow;

        return params;

    },
    /*
     *@method bizOrgBeneficiaryOwnerAfterSave
     *@desc 钩子函数 自定义保存数
     */
    bizOrgBeneficiaryOwnerAfterSave: (_this, newData) => {

    },
    /*
     *@method bizOrgBeneficiaryOwnerValidate
     *@desc 钩子函数 下一步验证
     */
    bizOrgBeneficiaryOwnerValidate: function (_this) {
        // 模块隐藏时不校验
        if (_this.groupDatas.RELA_INFO.BENEFICIARY_OWNER_INFO[0].MODULE_CONTROL == "0") {
            return true;
        }

        removeMyFlowTip(_this, WRONG_ADDRESS_TIP_KEY);
        for (let i = 0; i < _this.groupDatas.RELA_INFO.BENEFICIARY_OWNER_INFO.length; i++) {
            let module = _this.groupDatas.RELA_INFO.BENEFICIARY_OWNER_INFO[i];
            let idTypeField = module.FIELDS.BENEFICIARY_ID_TYPE;
            let addressField = module.FIELDS.BENEFICIARY_ADDR;
            if (!isCorrectAddress(idTypeField.DEFAULT_VALUE, addressField.DEFAULT_VALUE)) {
                pushMyFlowTip(_this, WRONG_ADDRESS_TIP_KEY, idTypeField.DEFAULT_VALUE == "00" ?
            "受益所有人证件类型为身份证，" +  WRONG_ADDRESS_TIP_TITLE : WRONG_ADDRESS_TIP_TITLE, "error");
                return false;
            }
        }
        let saveGroupId = "RELA_INFO";
        let beneficiaryOwnerInfo = _this.groupDatas[saveGroupId].BENEFICIARY_OWNER_INFO;
        let fieldArr = ["BENEFICIARY_ID", "BENEFICIARY_EXP_DATE"];
        let promiseArr = bizPublicMethod.$blMethod.getValidatePromises(_this, beneficiaryOwnerInfo, fieldArr);
        return Promise.all(promiseArr).then( (res)=> {
            if (_.includes(res, false)) {
                return false
            }
            // 开户需要展示中登联网校验按钮
            if (_this.busiCode == "V0050") {
                let idType00Arr = []
                // 只检查证件类型为身份证的情况
                _.each(beneficiaryOwnerInfo, moduleItem => {
                    let fieldData = moduleItem.FIELDS;
                    let SEX = (fieldData.BENEFICIARY_ID.DEFAULT_VALUE.substring(16, 17) % 2) ? "0" : "1";
                    let BIRTHDAY = fieldData.BENEFICIARY_ID.DEFAULT_VALUE.substr(6, 8);
                    if (fieldData.BENEFICIARY_ID_TYPE.DEFAULT_VALUE == "00") {
                        idType00Arr.push(bizPublicMethod.$blMethod.validateThree(_this, {
                            CUST_FNAME: fieldData.BENEFICIARY_NAME.DEFAULT_VALUE,
                            USER_NAME: fieldData.BENEFICIARY_NAME.DEFAULT_VALUE,
                            ID_TYPE: fieldData.BENEFICIARY_ID_TYPE.DEFAULT_VALUE,
                            ID_CODE: fieldData.BENEFICIARY_ID.DEFAULT_VALUE,
                            USER_TYPE: _this.userType,
                            SEX: SEX,
                            BIRTHDAY: BIRTHDAY
                        }))
                    }
                });
                _this.oppBusiData.NEED_IDENTITY_INFO = "0"
                if (idType00Arr.length) {
                    // _this.removeFlowTip('not-cdsc');
                    return Promise.all(idType00Arr).then(res => {
                        let canGoNext = true;
                        _.each(res, item => {
                            if (item == "0") {
                                return false;
                            }
                            if (item != "1") {
                                // _this.pushFlowTip( {
                                //     title: "中登联网校验失败，请重试或联系工作人员进行处理",
                                //     type: "error",
                                //     key: "not-cdsc"
                                // })
                                canGoNext = false;
                                return false;
                            }
                        })
                        // 校验不通过
                        if (!canGoNext) {
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
                        // return canGoNext;
                    })
                }
            }
        })
    },

    /*
     *@method bizOrgBeneficiaryOwnerPageActivated
     *@desc 钩子函数：页面激活
     */
    bizOrgBeneficiaryOwnerPageActivated: function (_this) {
        displayFirstModuleRadioButton(_this);
    },

    bizOrgBeneficiaryOwnerDeleteModuleFinished: function(_this, module) {
        displayFirstModuleRadioButton(_this);
    },

    bizOrgBeneficiaryOwnerPreValidate: function (_this) {},

    bizOrgBeneficiaryOwnerAddModuleFinished: function (_this, module) {
        displayFirstModuleRadioButton(_this);
        bizPublicMethod.$blMethod.filterOptionsButRetainHistoryOptions(_this, "RELA_INFO", 
        "BENEFICIARY_OWNER_INFO", "BENEFICIARY_ID_TYPE", _this.oppBusiData.individualValidIdTypes, EXCLUDE_ID_TYPES, custInfoModel.getOriginalOrgActualBeneficiaryInfo(_this.oppBusiData.oldBusiData));
        // 设置“持股比例”是否展示
        let beneficiaryType = _this.groupDatas.RELA_INFO.AML_INFO[0].FIELDS.BENEFICIARY_TYPE.DEFAULT_VALUE;
        let isShow = BENEFICIARY_TYPE_SHOW_SHARE_RADIO_MAP[beneficiaryType] || false;
        module.FIELDS.SHARE_RATIO.FIELD_CONTROL = isShow ? "0" : "1";
        // “特定自然人标识”默认为 0-否
        module.FIELDS.SPECIAL_PERSON_FLAG.DEFAULT_VALUE = "0";
        module.FIELDS.BENEFICIARY_ADDR.VALID_TYPE = "length[16,128]";
        module.FIELDS.NATION.showDictItem = "1";
    },

    checkBeneficiaryAddress: function(idType, address) {
        return isCorrectAddress(idType, address);
    },

    //----------------------业务函数----------------------------------//


    "CHECK_BENEFICIARY_ID": (_this, field, fieldData) => {
        let existFlag = _this.$blMethod.checkIdCodeIsExisted(_this, field, "受益人证件号码不能重复");
        if (existFlag) {
            return false;
        }
    },
    "CHECK_BENEFICIARY_ADDR": (_this, field, fieldData) => {
    },
    "CHECK_NATION": (_this, field, fieldData) => {
    },
    "CHECK_BENEFICIARY_ID_TYPE": (_this, field, fieldData) => {
        if (isFieldValueNotChanged(field)) {
            return;
        }
        if (!field.disableClear) {
            fieldData["BENEFICIARY_ID"].DEFAULT_VALUE = "";
            fieldData["BENEFICIARY_EXP_DATE"].DEFAULT_VALUE = "";
        }
        field.disableClear = false;
        fieldData["BENEFICIARY_ID"].VALID_TYPE = bizPublicMethod.$blMethod.getIdCodeValidType(field.DEFAULT_VALUE);
        if (["00", "0b", "0c", "0d", "oi", "0j", "0s"].indexOf(field.DEFAULT_VALUE) > -1) {
            fieldData["BENEFICIARY_ADDR"].showRegionSelector = true;
        } else {
            fieldData["BENEFICIARY_ADDR"].showRegionSelector = false;
        }
        field.LAST_DEFAULT_VALUE = field.DEFAULT_VALUE;
    },
    "CHECK_BENEFICIARY_ADDR": (_this, field, fieldData) => {
        if (_this.groupDatas.RELA_INFO.BENEFICIARY_OWNER_INFO[0].MODULE_CONTROL == "0") {
            // 模块被隐藏时，不进行校验
            return;
        }
        removeMyFlowTip(_this, WRONG_ADDRESS_TIP_KEY);
        if (!isCorrectAddress(fieldData.BENEFICIARY_ID_TYPE.DEFAULT_VALUE, fieldData.BENEFICIARY_ADDR.DEFAULT_VALUE)) {
            pushMyFlowTip(_this, WRONG_ADDRESS_TIP_KEY, fieldData.BENEFICIARY_ID_TYPE.DEFAULT_VALUE == "00" ?
            "受益所有人证件类型为身份证，" +  WRONG_ADDRESS_TIP_TITLE : WRONG_ADDRESS_TIP_TITLE, "error");
        }
    },
    "CHECK_SHARE_RATIO": (_this, field, fieldData) => {
        let value = parseFloat(field.DEFAULT_VALUE);
        if (!isNaN(value) && value > 100) {
            field.DEFAULT_VALUE = "100";
        }
    },
    "CHECK_SPECIAL_PERSON_FLAG": (_this, field, fieldData) => {
        if (_.isEmpty(field.DEFAULT_VALUE)) {
            field.DEFAULT_VALUE = "0";
        }
    },
    "CHECK_BENEFICIARY_EXP_DATE": (_this, field, fieldData) => {
        if (bizPublicMethod.$blMethod.isExpired(_this, field.DEFAULT_VALUE)) {
            _this.$nextTick( () => {
                bizPublicMethod.$blMethod.changeFieldError(field, false, field.FIELD_TITLE + "已过期");
            })
            return false;
        }
    },
    "CHECK_MODULE_RADIO": (_this, field, fieldData, module) => {
        if (!_this.oppBusiData.enableBeneficiaryModuleRadioCheck || !ENABLE_SAME_WITH_CONTROLLER_BUTTON) {
            /**
             * ----------------------------------【WARNING】------------------------------------------
             * 由于 handleBeneficiaryModuleRadioCheck 中可能会改变受益所有人的 groupDatas 结构，在此过程中
             * 可能触发 CHECK_MODULE_RADIO，引起受益所有人的 groupDatas 结构再次发生改变。因此，在修改
             * 受益所有人的 groupDatas 结构的时候，一定要将 _this.oppBusiData.enableBeneficiaryModuleRadioCheck
             * 赋值为 false，避免重复触发 check 函数！！！
             */
            return;
        }
        handleBeneficiaryModuleRadioCheck(_this, field, fieldData, module);
    },
}
