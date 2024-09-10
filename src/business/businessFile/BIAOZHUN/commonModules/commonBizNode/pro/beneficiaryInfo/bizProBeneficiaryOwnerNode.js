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

const GROUP_ID = "BENEFICIARY_INFO";


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
            _this.groupDatas[GROUP_ID]["BENEFICIARY_OWNER_INFO"], _.filter(beneficiaryOwnerInfo, item => {
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

const bizProBeneficiaryOwnerBeforeLoadBizCommon = (_this) => {
    let maxBeneficialOwner = _.get(_this.oppBusiData, "busiCommonParams.MAX_BENEFICIARY_OWNER", "");
    _this.groupDatas[GROUP_ID].BENEFICIARY_OWNER_INFO[0].MAX_LENGTH = _.isEmpty(maxBeneficialOwner) ? "999" : maxBeneficialOwner;
    _this.groupDatasTpl[GROUP_ID].BENEFICIARY_OWNER_INFO[0] = _.cloneDeep(_this.groupDatas[GROUP_ID].BENEFICIARY_OWNER_INFO[0]);
    _.each(_this.groupDatas[GROUP_ID].BENEFICIARY_OWNER_INFO, obj => {
        let fields = obj.FIELDS;
        fields.BENEFICIARY_ADDR.VALID_TYPE = "length[16,128]";
    })
    _this.groupDatas[GROUP_ID].AML_INFO[0].FIELDS.AML_CUST_TYPE.labelWidth = "240";
    _this.groupDatas[GROUP_ID].AML_INFO[0].FIELDS.BENEFICIARY_TYPE.labelWidth = "240";
    _this.groupDatas[GROUP_ID].BENEFICIARY_OWNER_INFO[0].FIELDS.NATION.showDictItem = "1";
}

export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizProBeneficiaryOwnerBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     */
    bizProBeneficiaryOwnerBeforeLoadBiz: function (_this) {
        bizProBeneficiaryOwnerBeforeLoadBizCommon(_this);
        let actualBeneficiaryInfo = custInfoModel.getOriginalOrgActualBeneficiaryInfo(_this.oppBusiData.oldBusiData);
        actualBeneficiaryInfo = _.each(actualBeneficiaryInfo, actualBeneficiaryInfoItem => {
            if (!_.toNumber(actualBeneficiaryInfoItem.SHARE_RATIO)) {
                actualBeneficiaryInfoItem.SHARE_RATIO = "";
            }
        })
        if (!_.isEmpty(actualBeneficiaryInfo)) {
            bizPublicMethod.$blMethod.parseMoudleArray(_this, _this.groupDatas[GROUP_ID]["BENEFICIARY_OWNER_INFO"], actualBeneficiaryInfo);
        }
    },
    bizProBeneficiaryOwnerBeforeLoadBizOpenAcct: function (_this) {
        bizProBeneficiaryOwnerBeforeLoadBizCommon(_this)
    },
    /*
     *@method bizProBeneficiaryOwnerAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     */
    bizProBeneficiaryOwnerAfterLoadBiz: function (_this) {
        backfillHistoryData(_this);
        bizPublicMethod.$blMethod.filterOptionsButRetainHistoryOptions(_this, GROUP_ID, 
        "BENEFICIARY_OWNER_INFO", "BENEFICIARY_ID_TYPE", _this.oppBusiData.individualValidIdTypes, EXCLUDE_ID_TYPES, custInfoModel.getOriginalOrgActualBeneficiaryInfo(_this.oppBusiData.oldBusiData));
        let beneficiaryType = _this.groupDatas[GROUP_ID].AML_INFO[0].FIELDS.BENEFICIARY_TYPE.DEFAULT_VALUE;
        let isShow = BENEFICIARY_TYPE_SHOW_SHARE_RADIO_MAP[beneficiaryType] || false;
        _.each(_this.groupDatas[GROUP_ID].BENEFICIARY_OWNER_INFO, module => {
            module.FIELDS.SHARE_RATIO.FIELD_CONTROL = isShow ? "0" : "1";
        })
    },
    /*
     *@method bizProBeneficiaryOwnerBeforeSave
     *@desc 钩子函数 自定义保存数
     */
    bizProBeneficiaryOwnerBeforeSave: function (_this, params) {
        let beneficiaryInfo = bizPublicSaveMethod.getModuleArrFoyKey(_this, "BENEFICIARY_OWNER_INFO", true);
        let beneficiaryType = _this.groupDatas[GROUP_ID].AML_INFO[0].FIELDS.BENEFICIARY_TYPE.DEFAULT_VALUE;
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
        if (_this.groupDatas[GROUP_ID].AML_INFO[0].FIELDS.AML_CUST_TYPE.DEFAULT_VALUE == "1") {
            // 模块不展示时，数据不改变
            beneficiaryInfo = originalBeneficiaryInfo;
        }
        let beneficiaryChangeInfo = bizPublicMethod.$blMethod.getArrDiff(
            beneficiaryInfo, originalBeneficiaryInfo, "BENEFICIARY_NO", "");
        
        let tempParam = {};
        tempParam.isbeneficiaryInfoChanged = 
            bizPublicMethod.$blMethod.isArrayModuleChanged(beneficiaryInfo, originalBeneficiaryInfo);

        

        // 是否受益所有人标示
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
        
        Object.assign(params, {
            ORG_BENEFICIARY_OWNER_INFO: beneficiaryChangeInfo && beneficiaryChangeInfo.INFO || [],
            IS_BENEFICIARY_OWNER_INFO_CHANGE: isbeneficiaryInfoChanged || "0",
            BENEFICIARY_OWNER_FLAG: _this.groupDatas[GROUP_ID].AML_INFO[0].FIELDS.AML_CUST_TYPE.DEFAULT_VALUE == "1" ? false : true,
            ORG_BENEFICIARY_INFO: [],
            IS_BENEFICIARY_INFO_CHANGE: "0",
        })
        /**开户数据保存 */
        if (_this.busiCode == "V0051") {
            let orgInfo = params.ORG_INFO || {};
            orgInfo.ORG_BENEFICIARY_OWNER_INFO = params.ORG_BENEFICIARY_OWNER_INFO;
            delete orgInfo.ORG_BENEFICIARY_OWNER_INFO.DIFF_INFO;
            orgInfo.BENEFICIARY_OWNER_FLAG = _.isEmpty(beneficiaryInfo) ? false : true;
            // 翻译字段字典项，以便影像展示
            for (let i in orgInfo.ORG_BENEFICIARY_OWNER_INFO) {
                let fields = _this.groupDatas[GROUP_ID].BENEFICIARY_OWNER_INFO[i].FIELDS;
                orgInfo.ORG_BENEFICIARY_OWNER_INFO[i].BENEFICIARY_ID_TYPE_TEXT = 
                    bizPublicMethod.$blMethod.getFieldDictItemName(fields.BENEFICIARY_ID_TYPE);
            }
            Object.assign(params, {
                ORG_INFO: orgInfo,
            })
        }
        //增加diffinfo 属性 用于展示
        let beneficiaryFields = _this.groupDatas[GROUP_ID].BENEFICIARY_OWNER_INFO[0].FIELDS;
        let AML_INFO = _this.groupDatas[GROUP_ID].AML_INFO[0].FIELDS;
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
     *@method bizProBeneficiaryOwnerAfterSave
     *@desc 钩子函数 自定义保存数
     */
    bizProBeneficiaryOwnerAfterSave: (_this, newData) => {

    },
    /*
     *@method bizProBeneficiaryOwnerValidate
     *@desc 钩子函数 下一步验证
     */
    bizProBeneficiaryOwnerValidate: function (_this) {
        // 模块隐藏时不校验
        if (_this.groupDatas[GROUP_ID].BENEFICIARY_OWNER_INFO[0].MODULE_CONTROL == "0") {
            return true;
        }

        removeMyFlowTip(_this, WRONG_ADDRESS_TIP_KEY);
        for (let i = 0; i < _this.groupDatas[GROUP_ID].BENEFICIARY_OWNER_INFO.length; i++) {
            let module = _this.groupDatas[GROUP_ID].BENEFICIARY_OWNER_INFO[i];
            let idTypeField = module.FIELDS.BENEFICIARY_ID_TYPE;
            let addressField = module.FIELDS.BENEFICIARY_ADDR;
            if (!isCorrectAddress(idTypeField.DEFAULT_VALUE, addressField.DEFAULT_VALUE)) {
                pushMyFlowTip(_this, WRONG_ADDRESS_TIP_KEY, idTypeField.DEFAULT_VALUE == "00" ?
            "受益所有人证件类型为身份证，" +  WRONG_ADDRESS_TIP_TITLE : WRONG_ADDRESS_TIP_TITLE, "error");
                return false;
            }
        }

        let saveGroupId = GROUP_ID;
        let beneficiaryOwnerInfo = _this.groupDatas[saveGroupId].BENEFICIARY_OWNER_INFO;
        let fieldArr = ["BENEFICIARY_ID", "BENEFICIARY_EXP_DATE"];
        let promiseArr = bizPublicMethod.$blMethod.getValidatePromises(_this, beneficiaryOwnerInfo, fieldArr);
        return Promise.all(promiseArr).then( (res)=> {
            if (_.includes(res, false)) {
                return false
            }
        })
    },

    /*
     *@method bizProBeneficiaryOwnerPageActivated
     *@desc 钩子函数：页面激活
     */
    bizProBeneficiaryOwnerPageActivated: function (_this) {

    },

    bizProBeneficiaryOwnerDeleteModuleFinished: function(_this, module) {
    },

    bizProBeneficiaryOwnerPreValidate: function (_this) {},

    bizProBeneficiaryOwnerAddModuleFinished: function (_this, module) {
        bizPublicMethod.$blMethod.filterOptionsButRetainHistoryOptions(_this, GROUP_ID, 
        "BENEFICIARY_OWNER_INFO", "BENEFICIARY_ID_TYPE", _this.oppBusiData.individualValidIdTypes, EXCLUDE_ID_TYPES, custInfoModel.getOriginalOrgActualBeneficiaryInfo(_this.oppBusiData.oldBusiData));
        // 设置“持股比例”是否展示
        let beneficiaryType = _this.groupDatas[GROUP_ID].AML_INFO[0].FIELDS.BENEFICIARY_TYPE.DEFAULT_VALUE;
        let isShow = BENEFICIARY_TYPE_SHOW_SHARE_RADIO_MAP[beneficiaryType] || false;
        module.FIELDS.SHARE_RATIO.FIELD_CONTROL = isShow ? "0" : "1";
        // “特定自然人标识”默认为 0-否
        module.FIELDS.SPECIAL_PERSON_FLAG.DEFAULT_VALUE = "0";
        module.FIELDS.BENEFICIARY_ADDR.VALID_TYPE = "length[16,128]";
        module.FIELDS.NATION.showDictItem = "1";
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
        if (_this.groupDatas[GROUP_ID].BENEFICIARY_OWNER_INFO[0].MODULE_CONTROL == "0") {
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
}
