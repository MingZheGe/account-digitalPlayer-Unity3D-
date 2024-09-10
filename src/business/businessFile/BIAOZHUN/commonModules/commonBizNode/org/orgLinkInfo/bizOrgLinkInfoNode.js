/*
 *   机构联系信息模块
 *   方法封装
 */

import bizPublicMethod from "../../../../../../../business/businessTools/bizPublicMethod.js"
import bizPublicSaveMethod from "../../../../../../businessTools/bizPublicSaveMethod.js"
import custInfoModel from '../../common/cust-info-model.js'
import {parseAddress} from '../../../../../../../tools/util' //地址解析组件

const WRONG_OFFICE_ADDRESS_TIP_KEY = "wrongOfficeAddress";

const WRONG_OFFICE_ADDRESS_TIP_TITLE = "办公地址请精确到门牌号！";

let SYNC_ADDRESS_BUTTON_TEXT = "从注册地址同步";

const CANCEL_ADDRESS_SYNC = "撤销同步";


//开户与非开户 获取机构代码跟机构名称
const getOrgCodeAndOrgName = (_this) => {
    let isOpenAcct = _this.$storage.getSession(_this.$definecfg.IS_OPEN_ACCT_BIZ) || "";
    let userInfo = _this.$storage.getJsonSession(_this.$definecfg.USER_INFO);
    let obj = {
        ORG_CODE: userInfo.ORG_CODE || userInfo.INT_ORG,
        ORG_NAME: userInfo.ORG_NAME
    }
    if (isOpenAcct == "0") {
        let OPEN_ORG_INFO = _this.$storage.getJsonSession(_this.$definecfg.OPEN_ORG_INFO) || {};
        obj.ORG_CODE = OPEN_ORG_INFO.ORG_CODE || "";
        obj.ORG_NAME = OPEN_ORG_INFO.ORG_NAME || "";
    }
    return obj;
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

const isCorrectAddress = (_this, address) => {
    let inoutsideIdentity = getInoutsideIdentity(_this);
    if (inoutsideIdentity == "0") {
        return isCorrectDomesticAddress(address);
    } else {
        return isCorrectOverseasAddress(address);
    }
}

const backfillHistoryData = (_this) => {
    let orgLinkInfo = _this.historyData["ORG_LINK_INFO"];
    if( !_.isEmpty(orgLinkInfo)){
        bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["ORG_LINK_INFO"], orgLinkInfo);     
    }
}

/**
 * 根据《开户逻辑配置》获取境内外标识
 * @param {object} _this 
 * @returns 0-境内；1-境外
 */
 const getInoutsideIdentity = (_this) => {
    let idType = _this.groupDatas.ORG_INFO.DOC_INFO[0].FIELDS.ID_TYPE.DEFAULT_VALUE;
    let citizenship = _this.groupDatas.ORG_INFO.DOC_INFO[0].FIELDS.CITIZENSHIP.DEFAULT_VALUE;
    let params = {
        ID_TYPE: idType,
        CITIZENSHIP: citizenship
    }
    let filteredOpenLogicData = bizPublicMethod.$blMethod.filterOpenLogicData(params, _this.oppBusiData.allAcctOpenLogicData);
    if (filteredOpenLogicData.INOUTSIDE_IDENTITY.length == 1 && 
        filteredOpenLogicData.INOUTSIDE_IDENTITY[0] == "0") {
        return "0";
    } else if (filteredOpenLogicData.INOUTSIDE_IDENTITY.length == 1 && 
        filteredOpenLogicData.INOUTSIDE_IDENTITY[0] == "1") {
        return "1";
    }
}

/**
 * 隐藏 “获取验证码按钮”、“验证码输入框”
 * @param {object} _this 
 */
const hideValidateCodeInput = (_this) => {
    let fields = _this.groupDatas.LINK_INFO.ORG_LINK_INFO[0].FIELDS; 
    fields.MOBILE_TEL.IS_SHOW_BUTTON = false;
    fields.VALIDATE_CODE.DEFAULT_VALUE = "";
    fields.VALIDATE_CODE.FIELD_CONTROL = "1";
}

/**
 * 展示 “获取验证码按钮”、“验证码输入框”
 * @param {object} _this 
 */
const showValidateCodeInput = (_this) => {
    _this.oppBusiData.VALID_MOBILE = _this.oppBusiData.busiCommonParams.VALID_MOBILE || "1";
    if (_this.oppBusiData.VALID_MOBILE != "1") {
        return;
    }
    let fields = _this.groupDatas.LINK_INFO.ORG_LINK_INFO[0].FIELDS; 
    fields.MOBILE_TEL.IS_SHOW_BUTTON = true;
    fields.MOBILE_TEL.FIELD_BUTTON_TXT = "获取验证码";
    fields.MOBILE_TEL.SUFFIX_ICON = "";
    fields.VALIDATE_CODE.FIELD_CONTROL = "0";
    fields.VALIDATE_CODE.DEFAULT_VALUE = "";
}

/**
 * 字段值是否与原始数据不一样
 * @param {object} _this 
 * @param {object} field  字段对象
 */
const isDifferentFromOriginal = (_this, field) => {
    let orgLinkInfo = custInfoModel.getOriginaOrgLinkInfo(_this.oppBusiData.oldBusiData);
    return _.isEmpty(orgLinkInfo) || field.DEFAULT_VALUE != orgLinkInfo[field.FIELD_ID];
}

/**
 * 字段值是否与史历数据不一样
 * @param {object} _this 
 * @param {object} field  字段对象
 */
const isDifferentFromHistory = (_this, field) => {
    let historyOrgLinkInfo = _this.historyData["ORG_LINK_INFO"];
    return _.isEmpty(historyOrgLinkInfo) || field.DEFAULT_VALUE != historyOrgLinkInfo[[field.FIELD_ID]];
}

/**
 * 判断字段是否没有改变
 * @param {object} field 字段对象
 */
const isFieldValueNotChanged = (field) => {
    return field.LAST_DEFAULT_VALUE == field.DEFAULT_VALUE;
}

const initFieldConfig = (_this) => {
    let fields = _this.groupDatas.LINK_INFO.ORG_LINK_INFO[0].FIELDS; 
    fields.MOBILE_TEL.IS_SHOW_BUTTON = false;
    fields.VALIDATE_CODE.FIELD_CONTROL = "1";
    if(_this.busiCode == 'V0050') {
        SYNC_ADDRESS_BUTTON_TEXT = '使用注册地址'
    } else {
        SYNC_ADDRESS_BUTTON_TEXT = "从注册地址同步";
    }
    fields.OFFICE_ADDR.FIELD_BUTTON_TXT = SYNC_ADDRESS_BUTTON_TEXT;
    fields.OFFICE_ADDR.VALID_TYPE = "length[16,64]";
    fields.OFFICE_TEL.VALID_TYPE = "tel";
}

const modifyFieldConfig = (_this) => {
    let fields = _this.groupDatas.LINK_INFO.ORG_LINK_INFO[0].FIELDS; 
    let inoutsideIdentity = getInoutsideIdentity(_this);
    if (inoutsideIdentity == "1") {
        fields.MOBILE_TEL.FIELD_REQUIRED = "0";
    }
}
export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizOrgLinkInfoNodeBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     */
    bizOrgLinkInfoNodeBeforeLoadBiz: function (_this) {
        initFieldConfig(_this);
        let orgLinkInfo = custInfoModel.getOriginaOrgLinkInfo(_this.oppBusiData.oldBusiData);
        !_.isEmpty(orgLinkInfo) && bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["ORG_LINK_INFO"], orgLinkInfo);
    },
    /*
     *@method bizOrgLinkInfoNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     */
    bizOrgLinkInfoNodeAfterLoadBiz: function (_this) {
        backfillHistoryData(_this);
        modifyFieldConfig(_this);
        // 根据公参是否显示验证码
        let fieldData = _this.groupDatas.LINK_INFO.ORG_LINK_INFO[0]["FIELDS"];
        _this.oppBusiData.VALID_MOBILE = _this.oppBusiData.busiCommonParams.VALID_MOBILE || "1";
        if (_this.oppBusiData.VALID_MOBILE != "1") {
            fieldData.MOBILE_TEL.IS_SHOW_BUTTON = false;
            fieldData.VALIDATE_CODE.FIELD_CONTROL = "1";
            fieldData.MOBILE_TEL.SUFFIX_ICON = "";
        }
    },
    /*
     *@method bizOrgLinkInfoNodeBeforeSave
     *@desc 钩子函数 自定义保存数
     */
    bizOrgLinkInfoNodeBeforeSave: function (_this, params) {
        let orgLinkInfo = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "ORG_LINK_INFO");
        orgLinkInfo.OFFICE_ADDR = orgLinkInfo.OFFICE_ADDR.replace("市辖区","").replace(/不详/g,"").replace("辖县", "");
        delete orgLinkInfo.VALIDATE_CODE;

        let originalOrgLinkInfo = custInfoModel.getOriginaOrgLinkInfo(_this.oppBusiData.oldBusiData);
        let orgLinkInfoFields = _this.groupDatas.LINK_INFO.ORG_LINK_INFO[0].FIELDS;
        let oldOrgLinkInfo = bizPublicMethod.$blMethod.getOriginalFieldValues(orgLinkInfoFields, 
            originalOrgLinkInfo);
        
        // 修改后的数据与原始数据比较
        let orgLinkInfoDiff = bizPublicMethod.$blMethod.compareInfo2(oldOrgLinkInfo, orgLinkInfo, "");
        orgLinkInfo.DIFF_INFO = orgLinkInfoDiff;
        let changedFieldIds = Object.assign({}, _.map(orgLinkInfoDiff, "FIELD"));
        let changedFieldIdsObj = {};
        _.each(changedFieldIds, obj => {
            changedFieldIdsObj[obj] = true;
        })
        //增加diffinfo 属性 用于展示
        let ORG_LINK_INFO = _this.groupDatas.LINK_INFO.ORG_LINK_INFO[0].FIELDS;
        let webShow = _this.$blMethod.addDiffAtt(ORG_LINK_INFO, orgLinkInfoDiff);
        params.LINK_WEB_SHOW = webShow;

        //y042表单添加FIELD_TITLE
        orgLinkInfo.DIFF_INFO = webShow;

        Object.assign(params, {
            ORG_LINK_INFO: orgLinkInfo,
            newMobile: changedFieldIdsObj["MOBILE_TEL"] ? orgLinkInfo.MOBILE_TEL : "0",
            IS_CHANGE_TEL_ADDRESS: changedFieldIdsObj["MOBILE_TEL"] || changedFieldIdsObj["OFFICE_ADDR"] ? "1" : "0",
        })
        // 为了避免 opp-service.js 中 parseToYGTBusiData() 覆盖 ORG_LINK_INFO 的值
        if (params["LINK_INFO"] && params["LINK_INFO"]["ORG_LINK_INFO"] && params["LINK_INFO"]["ORG_LINK_INFO"].length) {
            params["LINK_INFO"]["ORG_LINK_INFO"][0] = orgLinkInfo;
        }

        /**开户数据保存 */
        if (_this.busiCode == "V0050") {
            let orgInfo = params.ORG_INFO || {};
            orgInfo.ORG_LINK_INFO = params.ORG_LINK_INFO;
            delete orgInfo.ORG_LINK_INFO.DIFF_INFO;
            Object.assign(params, {
                ORG_INFO: orgInfo,

                OFFICE_TEL: params.ORG_LINK_INFO.OFFICE_TEL,
                OFFICE_ADDR: params.ORG_LINK_INFO.OFFICE_ADDR,
                ZIP_CODE: params.ORG_LINK_INFO.ZIP_CODE,
                EMAIL: params.ORG_LINK_INFO.EMAIL,
            })
        }
        return params;
    },
    /*
     *@method bizOrgLinkInfoNodeValidate
     *@desc 钩子函数 下一步验证
     */
    bizOrgLinkInfoNodeValidate: function (_this) {
        let officeAddressField = _this.groupDatas.LINK_INFO.ORG_LINK_INFO[0].FIELDS.OFFICE_ADDR;
        removeMyFlowTip(_this, WRONG_OFFICE_ADDRESS_TIP_KEY);
        if (!isCorrectAddress(_this, officeAddressField.DEFAULT_VALUE)) {
            pushMyFlowTip(_this, WRONG_OFFICE_ADDRESS_TIP_KEY, WRONG_OFFICE_ADDRESS_TIP_TITLE, "error");
            return false;
        }
        return true;
    },

    /*
     *@method bizOrgLinkInfoNodeGetData
     *@desc 拼接数据
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizOrgLinkInfoNodeGetData: function (_this, params) {
    
    },

    /*
     *@method bizOrgLinkInfoNodePageActivated
     *@desc 钩子函数：页面激活
     */
    bizOrgLinkInfoNodePageActivated: function (_this) {
        let citizenship = _this.groupDatas.ORG_INFO.DOC_INFO[0].FIELDS.CITIZENSHIP;
        let officeAddrField = _this.groupDatas.LINK_INFO.ORG_LINK_INFO[0].FIELDS.OFFICE_ADDR;
        if (["CHN", "CTN", "HKG", "MAC"].indexOf(citizenship.DEFAULT_VALUE) > -1) {
            officeAddrField.showRegionSelector = true;
        } else {
            officeAddrField.showRegionSelector = false;
        }
    },

    "CHECK_MOBILE_TEL": (_this, field, fieldData) => {
        if (isFieldValueNotChanged(field)) {
            return;
        }
        if (isDifferentFromOriginal(_this, field) && isDifferentFromHistory(_this, field)) {
            _this.$nextTick(() => {
                showValidateCodeInput(_this);
            })
        } else {
            _this.$nextTick(() => {
                hideValidateCodeInput(_this);
            })
        }
        field.LAST_DEFAULT_VALUE = field.DEFAULT_VALUE;
    },

    "CHECK_MOBILE_TEL__CLICK" : _.debounce( async function (_this, field, fieldData) {
        if (field.disableNext) {
            return;
        }
        let mobileField = _this.groupDatas.LINK_INFO.ORG_LINK_INFO[0].FIELDS.MOBILE_TEL;
        let codeField = _this.groupDatas.LINK_INFO.ORG_LINK_INFO[0].FIELDS.VALIDATE_CODE;
        field.disableNext = true;
        let runValidateMobileData = await _this.$blMethod.runValidateGetMobileCode(_this, mobileField, codeField);
        field.disableNext = false;
        if (!runValidateMobileData) {
            return;
        }
        let userInfo = _this.$storage.getJsonSession(_this.$definecfg.USER_INFO);
        let mobile = fieldData.MOBILE_TEL.DEFAULT_VALUE || "";
        let params = {
            MOBILE: mobile,
            ORG_CODE: getOrgCodeAndOrgName(_this).ORG_CODE
        }
        _this.$blMethod.getVerificationCode(_this, params, field, 60, () => {
            fieldData.VALIDATE_CODE.DEFAULT_VALUE = "";
        });
    }, 1000, {
            'leading': true,
            'trailing': false
    }),
    "CHECK_VALIDATE_CODE": (_this, field, fieldData) => {
        if (field.FIELD_CONTROL == "1") {
            return;
        }
        let params = {
            MOBILE: fieldData["MOBILE_TEL"].DEFAULT_VALUE,
            AUTH_CODE: field.DEFAULT_VALUE
        }
        bizPublicMethod.$blMethod.validateVerificationCode(_this, params, field, fieldData.MOBILE_TEL, () => {
            fieldData.MOBILE_TEL.SUFFIX_ICON = "el-icon-success";
            hideValidateCodeInput(_this);
        });
    },
    "USE_ID_ADDRESS__CLICK": (_this, field, fieldData) => {
        let idAddress = _this.groupDatas.ORG_INFO.DOC_INFO[0].FIELDS.CORP_ADDR.DEFAULT_VALUE;
        let btnTxt = field.FIELD_BUTTON_TXT;
        if (btnTxt == SYNC_ADDRESS_BUTTON_TEXT) {
            _this.$set(field, 'FIELD_BUTTON_TXT', CANCEL_ADDRESS_SYNC);
            _this.oppBusiData.linkAddrDefault = field.DEFAULT_VALUE;
            _this.oppBusiData.linkZipCodeDefault = fieldData.ZIP_CODE.DEFAULT_VALUE;
            field.DEFAULT_VALUE = idAddress;
            field.LAST_ADDRESS_REGION = field.DEFAULT_VALUE;
            if (field.showRegionSelector) {
                if (idAddress != "") {
                    let addressTextInfo = parseAddress(idAddress);
                    field.addressInfo = addressTextInfo;
                    field.addressCode = addressTextInfo[3] || "";
                    // 证件地址 idAddress 可能不包含地级市，获取到包含地级市的 addressTextInfo 后，需要对  
                    // field.DEFAULT_VALUE 重新赋值
                    // 注：如果将来组件兼容了不包含地级市的地址，以下这个 if 中的代码可以去掉
                    if (addressTextInfo && addressTextInfo[1] && addressTextInfo[1].length === 3) {
                        let address = addressTextInfo[1][0] + addressTextInfo[1][1] + addressTextInfo[1][2] +
                        (addressTextInfo[2] ? addressTextInfo[2] : "");
                        field.DEFAULT_VALUE = address;
                    }
                    let region = addressTextInfo[1] || [];
                    region = region.join("");
                    field.LAST_ADDRESS_REGION = _.cloneDeep(region);
                }
                if (fieldData.ZIP_CODE && "addressInfo" in field) {
                    if (field.addressInfo && field.addressInfo.length > 3 && !_.isEmpty(field.addressInfo[3])) {
                        fieldData.ZIP_CODE.DEFAULT_VALUE = field.addressInfo[3];
                        fieldData.ZIP_CODE.correct = true;
                    }
                }
            }
        } else if (btnTxt == CANCEL_ADDRESS_SYNC) {
            _this.$set(field, 'FIELD_BUTTON_TXT', SYNC_ADDRESS_BUTTON_TEXT);
            field.DEFAULT_VALUE = _this.oppBusiData.linkAddrDefault;
            fieldData.ZIP_CODE.DEFAULT_VALUE = _this.oppBusiData.linkZipCodeDefault;
            if (field.showRegionSelector) {
                let addressTextInfo = parseAddress(field.DEFAULT_VALUE );
                let region = addressTextInfo[1] || [];
                region = region.join("");
                field.LAST_ADDRESS_REGION = _.cloneDeep(region);
            }
        }
    },
    "CHECK_OFFICE_ADDR":(_this, field, fieldData) => {
        removeMyFlowTip(_this, WRONG_OFFICE_ADDRESS_TIP_KEY);
        if (!isCorrectAddress(_this, field.DEFAULT_VALUE)) {
            pushMyFlowTip(_this, WRONG_OFFICE_ADDRESS_TIP_KEY, WRONG_OFFICE_ADDRESS_TIP_TITLE, "error");
        }
        let addressTextInfo = parseAddress(field.DEFAULT_VALUE);
        let region = addressTextInfo[1] || [];
        region = region.join("");
        let regionChange = true;
        if (field.lastRegionValue == region) {
            regionChange = false;
        }
        field.lastRegionValue = region;
        if (fieldData.ZIP_CODE && regionChange) {
            if (addressTextInfo && addressTextInfo.length > 3) {
                fieldData.ZIP_CODE.DEFAULT_VALUE = addressTextInfo[3];
                fieldData.ZIP_CODE.correct = true;
            }
        }
    }
    // "USE_ID_ADDRESS": (_this, field, fieldData) => {
    //     removeMyFlowTip(_this, WRONG_OFFICE_ADDRESS_TIP_KEY);
    //     if (!isCorrectAddress(_this, field.DEFAULT_VALUE)) {
    //         pushMyFlowTip(_this, WRONG_OFFICE_ADDRESS_TIP_KEY, WRONG_OFFICE_ADDRESS_TIP_TITLE, "error");
    //     }
    //     let addressTextInfo = parseAddress(field.DEFAULT_VALUE);
    //     if (fieldData.ZIP_CODE) {
    //         if (addressTextInfo && addressTextInfo.length > 3 && !_.isEmpty(addressTextInfo[3])) {
    //             fieldData.ZIP_CODE.DEFAULT_VALUE = addressTextInfo[3];
    //             fieldData.ZIP_CODE.correct = true;
    //         }
    //     }
    // },
}
