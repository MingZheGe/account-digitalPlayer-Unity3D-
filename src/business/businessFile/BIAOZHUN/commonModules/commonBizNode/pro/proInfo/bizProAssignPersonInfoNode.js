/*
 *   产品联系人信息模块
 *   方法封装
 *   @author  lindw
 */
import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../../business/businessTools/bizPublicMethod.js"
import custInfoModel from '../../common/cust-info-model.js'
import date from '../../../../../../../tools/date.js';

let proAssignPersonIdType = "";
let mustValid = "1";
let lastMobile = '';
export default {
    bizProAssignPersonInfoBeforeLoadBiz: (_this) => {
        let IS_HIDE_AGENT = _this.$storage.getJsonSession(_this.$definecfg.SYS_COMM_PARAM_OBJS).IS_HIDE_AGENT;
        let assignTypeData = [{
            DICT_ITEM: "0",
            DICT_ITEM_NAME: "与法定代表人一致"
        }]
        if ("1" !== IS_HIDE_AGENT) {
            assignTypeData.push({
                DICT_ITEM: "1",
                DICT_ITEM_NAME: "代理人"
            })
        }
        let fieldData = _this.groupDatas.ASSIGN_PERSON_INFO.ORG_ASSIGN_PERSON_INFO[0].FIELDS || {};
        fieldData.USESAME_INFO.FIELD_DICT_NAME = assignTypeData;
        //显示验证码
        fieldData.ASSIGN_PERSON_MOBILE_TEL.IS_SHOW_BUTTON = true;
        fieldData.ASSIGN_PERSON_MOBILE_TEL.FIELD_BUTTON_TXT = "获取验证码";
        fieldData.ASSIGN_PERSON_MOBILE_TEL.SUFFIX_ICON = "";
        //验证码的检验函数修改防止冲突
        fieldData.VALIDATE_CODE.FIELD_FUNCTION = "CHECK_ASSIGN_VALIDATE_CODE";
        fieldData.VALIDATE_CODE.VALID_TYPE = "num[6]|on-blur";
        fieldData.VALIDATE_CODE.FIELD_CONTROL = "1";
        fieldData.ASSIGN_PERSON_MOBILE_TEL.MAX_LENGTH = "11"

        var orgAssignPersonInfo = custInfoModel.getOriginaAssignPersonInfo(_this.oppBusiData.oldBusiData);
        // 预约信息
        let APPT_INFO = _this.$definecfg.APPT_INFO && JSON.parse(_this.$storage.getSession(_this.$definecfg.APPT_INFO));
        !_.isEmpty(APPT_INFO) && bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["ORG_ASSIGN_PERSON_INFO"], APPT_INFO.ORG_ACCOUNT_MANAGER_INFO);

        if (!_.isEmpty(orgAssignPersonInfo)) {
            _this.groupDatas.ASSIGN_PERSON_INFO.ORG_ASSIGN_PERSON_INFO[0].FIELDS.USESAME_INFO.FIELD_CONTROL = "1";
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["ORG_ASSIGN_PERSON_INFO"], orgAssignPersonInfo);
        }

    },
    bizProAssignPersonInfoAfterLoadBiz: (_this) => {
        if (_this.oppBusiData.newBusiData && _this.oppBusiData.newBusiData.RELA_INFO && _this.oppBusiData.newBusiData.RELA_INFO.ORG_ASSIGN_PERSON_INFO) {
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["ORG_ASSIGN_PERSON_INFO"], _this.oppBusiData.newBusiData.RELA_INFO.ORG_ASSIGN_PERSON_INFO);
        }
        let fieldData = _this.groupDatas.ASSIGN_PERSON_INFO.ORG_ASSIGN_PERSON_INFO[0].FIELDS;
        _this.oppBusiData.usersameInfo = fieldData.USESAME_INFO.DEFAULT_VALUE;
        // 展示公安联网校验按钮
        _this.groupDatas["ASSIGN_PERSON_INFO"].ORG_ASSIGN_PERSON_INFO[0].MODULE_CUSTOMIZE = "1";
        _this.groupDatasTpl["ASSIGN_PERSON_INFO"].ORG_ASSIGN_PERSON_INFO[0].MODULE_CUSTOMIZE = "1";
        _this.oldGroupDatas["ASSIGN_PERSON_INFO"].ORG_ASSIGN_PERSON_INFO[0].MODULE_CUSTOMIZE = "1";
        _this.groupDatas["ASSIGN_PERSON_INFO"].ORG_ASSIGN_PERSON_INFO[0].MODULE_CUSTOMIZE_TXT = "公安联网校验";
        _this.groupDatasTpl["ASSIGN_PERSON_INFO"].ORG_ASSIGN_PERSON_INFO[0].MODULE_CUSTOMIZE_TXT = "公安联网校验";
        _this.oldGroupDatas["ASSIGN_PERSON_INFO"].ORG_ASSIGN_PERSON_INFO[0].MODULE_CUSTOMIZE_TXT = "公安联网校验";
    },
    bizProAssignPersonInfoPageActived: (_this) => {
        // 字段设置
        let fieldData = _this.groupDatas.ASSIGN_PERSON_INFO.ORG_ASSIGN_PERSON_INFO[0]["FIELDS"];
        let saveGroupId = _this.userType == "1" ? "ORG_INFO" : "MANAGER_INFO";
        //过滤证件类型
        let dictItem = _this["oppBusiData"]["VALID_ID_TYPE_FOR_BOTH"]
        fieldData.ASSIGN_PERSON_ID_TYPE.FIELD_DICT_FILTER = _.filter(dictItem, function (item) {
            return item.charAt(0) == '0'
        })
        let ORG_LEGAL_REP_INFO_TITLE = _this.groupDatas[saveGroupId].ORG_LEGAL_REP_INFO[0].MODULE_TITLE;
        fieldData.USESAME_INFO.FIELD_DICT_NAME[0].DICT_ITEM_NAME = "与" + ORG_LEGAL_REP_INFO_TITLE + "一致";
        _this.busiLogic["CHECK_USESAME_INFO"](_this, fieldData.USESAME_INFO, fieldData);
        //根据公参是否显示验证码
        _this.oppBusiData.VALID_MOBILE = _this.oppBusiData.busiCommonParams.VALID_MOBILE || "0";
        if (_this.oppBusiData.VALID_MOBILE != "1") {
            fieldData.ASSIGN_PERSON_MOBILE_TEL.IS_SHOW_BUTTON = false;
            fieldData.VALIDATE_CODE.FIELD_CONTROL = "1";
            fieldData.ASSIGN_PERSON_MOBILE_TEL.SUFFIX_ICON = "";
        }
        let validateMobile = _this.$blMethod.getValidateMobile();
        let mobile = fieldData.ASSIGN_PERSON_MOBILE_TEL.DEFAULT_VALUE || "";
        let authCode = fieldData.VALIDATE_CODE.DEFAULT_VALUE || "";
        fieldData.ASSIGN_PERSON_MOBILE_TEL[validateMobile] = _.assign({}, {
            MOBILE: mobile,
            AUTH_CODE: authCode
        })
    },
    bizProAssignPersonInfoValidate: async (_this) => {
        let mdd = _.get(_this.groupDatas, "ASSIGN_PERSON_INFO.ORG_ASSIGN_PERSON_INFO[0]", {});
        if (_this.oppBusiData.VALID_MOBILE == "1") {
            let mobileField = _.get(mdd, "FIELDS.ASSIGN_PERSON_MOBILE_TEL", {});
            let codeField = _.get(mdd, "FIELDS.VALIDATE_CODE", {});
            if (codeField.FIELD_CONTROL == "0") {
                let runValidateMobileData = await _this.$blMethod.runValidateMobile(_this, mobileField, codeField);
                if (!runValidateMobileData) {
                    return false;
                }
            }
        }
    },
    bizProAssignPersonInfoBeforeSave: (_this, params) => {
        let assignPersonInfo = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "ORG_ASSIGN_PERSON_INFO");
        let saveGroupId = _this.userType == "1" ? "ORG_INFO" : "MANAGER_INFO";
        let isOpenAcct = _this.$storage.getJsonSession(_this.$definecfg.IS_OPEN_ACCT_BIZ);

        var assignPersonData = Object.assign({}, assignPersonInfo, {
            IDCARD_READ_FLAG: "0", //读卡标志，先写死
            IDCARD_CHECK_FLAG: "0", //公安联网检验标志，先写死
            IS_OPEN_AGENT: assignPersonInfo.USESAME_INFO,
            LEGAL_REP_FIELDSET_TITLE: _this.groupDatas[saveGroupId].ORG_LEGAL_REP_INFO[0].MODULE_TITLE,
        })
        let busiData = _this.oppBusiData.newBusiData;
        let relaInfo = busiData && busiData.RELA_INFO || {};
        relaInfo.ORG_ASSIGN_PERSON_INFO = assignPersonData;
        if (isOpenAcct == "1") {
            var assignPersonDiffInfo = bizPublicMethod.$blMethod.compareInfo2(custInfoModel.getOriginaAssignPersonInfo(_this.oppBusiData.oldBusiData), assignPersonInfo, "VALIDATE_CODE");
            relaInfo.ORG_ASSIGN_PERSON_CHANGE_INFO = Object.assign({}, assignPersonInfo, {
                DIFF_INFO: assignPersonDiffInfo
            })
        }

        params.RELA_INFO = params.RELA_INFO || {}
        Object.assign(params.RELA_INFO, relaInfo);
        params.KICS_TRANSACTOR_NAME = assignPersonData.ASSIGN_PERSON_NAME || ""; //经办人名称统一字段，用于智能审核公安网纹照对比
        params.KICS_TRANSACTOR_ID = assignPersonData.ASSIGN_PERSON_ID || ""; //经办人证件号统一字段，用于智能审核公安网纹照对比
    },
    //============================================字段关联逻辑============================================//
    "CHECK_USESAME_INFO": (_this, field, fieldData) => {
        let saveGroupId = _this.userType == "1" ? "ORG_INFO" : "MANAGER_INFO",
            leaglRepInfo = _this.groupDatas[saveGroupId].ORG_LEGAL_REP_INFO[0];
        if (field.DEFAULT_VALUE == "0") {
            if (_.isEmpty(leaglRepInfo.FIELDS.LEGAL_REP.DEFAULT_VALUE)) {
                _this.messageBox({
                    hasMask: true,
                    messageText: "无法定代表人信息，请先填写法定代表人信息！",
                    confirmButtonText: '确定',
                    typeMessage: 'warn',
                    showMsgBox: true,
                });
                field.DEFAULT_VALUE = "";
            } else {
                proAssignPersonIdType = leaglRepInfo.FIELDS.LEGAL_REP_ID_TYPE.DEFAULT_VALUE;
                fieldData.ASSIGN_PERSON_NAME.DEFAULT_VALUE = leaglRepInfo.FIELDS.LEGAL_REP.DEFAULT_VALUE;
                fieldData.ASSIGN_PERSON_ID_TYPE.DEFAULT_VALUE = leaglRepInfo.FIELDS.LEGAL_REP_ID_TYPE.DEFAULT_VALUE;
                fieldData.ASSIGN_PERSON_ID.DEFAULT_VALUE = leaglRepInfo.FIELDS.LEGAL_REP_ID_CODE.DEFAULT_VALUE;
                fieldData.ASSIGN_PERSON_ID_DAT.DEFAULT_VALUE = leaglRepInfo.FIELDS.LEGAL_REP_ID_EXP_DATE.DEFAULT_VALUE;
                fieldData.ASSIGN_PERSON_NAME.FIELD_CONTROL = "2";
                fieldData.ASSIGN_PERSON_ID_TYPE.FIELD_CONTROL = "2";
                fieldData.ASSIGN_PERSON_ID.FIELD_CONTROL = "2";
                fieldData.ASSIGN_PERSON_ID_DAT.FIELD_CONTROL = "2";
                _this.groupDatas.ASSIGN_PERSON_INFO.ORG_ASSIGN_PERSON_INFO[0].MODULE_READ = "0"
            }
            _this.$nextTick(function () {
                if (fieldData.ASSIGN_PERSON_ID_TYPE.DEFAULT_VALUE == "") {
                    fieldData.ASSIGN_PERSON_ID_TYPE.FIELD_CONTROL = "0";
                    fieldData.ASSIGN_PERSON_ID.FIELD_CONTROL = "0";
                }
            })
            fieldData.AGENT_END_DATE.FIELD_CONTROL = "1";
            fieldData.AGENT_END_DATE.DEFAULT_VALUE = "";
        } else if (field.DEFAULT_VALUE == "1") {
            if (_this.oppBusiData.usersameInfo != "1") {
                fieldData.ASSIGN_PERSON_NAME.DEFAULT_VALUE = "";
                fieldData.ASSIGN_PERSON_ID_TYPE.DEFAULT_VALUE = "";
                fieldData.ASSIGN_PERSON_ID.DEFAULT_VALUE = "";
                fieldData.ASSIGN_PERSON_ID_DAT.DEFAULT_VALUE = "";
            }
            fieldData.ASSIGN_PERSON_NAME.FIELD_CONTROL = "0";
            fieldData.ASSIGN_PERSON_ID_TYPE.FIELD_CONTROL = "0";
            fieldData.ASSIGN_PERSON_ID.FIELD_CONTROL = "0";
            fieldData.ASSIGN_PERSON_ID_DAT.FIELD_CONTROL = "0";
            _this.groupDatas.ASSIGN_PERSON_INFO.ORG_ASSIGN_PERSON_INFO[0].MODULE_READ = "1"
            if (_this.oppBusiData.busiCommonParams.IS_SHOW_AGENT_END_DATE == "1") {
                fieldData.AGENT_END_DATE.FIELD_CONTROL = "0";
            }
        }
        _this.oppBusiData.usersameInfo = field.DEFAULT_VALUE;
    },
    "CHECK_ASSIGN_PERSON_ID_TYPE": (_this, field, fieldData) => {
        _this.$blMethod.setValidType(_this, field, fieldData, "ASSIGN_PERSON_ID")
        if (proAssignPersonIdType && field.DEFAULT_VALUE != proAssignPersonIdType) {
            fieldData.ASSIGN_PERSON_ID.DEFAULT_VALUE = '';
        }
        proAssignPersonIdType = field.DEFAULT_VALUE;
    },
    "CHECK_ASSIGN_PERSON_MOBILE_TEL": (_this, field, fieldData) => {
        if (_this.oppBusiData.VALID_MOBILE != "1") {
            return;
        }
        let defaultValue = field.DEFAULT_VALUE || "";
        let validateMobile = _this.$blMethod.getValidateMobile();
        let validateMobileData = field[validateMobile] || {};
        //已经检验过的手机号码
        let checkMobile = validateMobileData.MOBILE || _.get(_this.oppBusiData, "newBusiData.RELA_INFO.ORG_ASSIGN_PERSON_INFO.ASSIGN_PERSON_MOBILE_TEL", "");
        let orgAssignPersonInfo = custInfoModel.getOriginaAssignPersonInfo(_this.oppBusiData.oldBusiData);
        let oldMobile = orgAssignPersonInfo.ASSIGN_PERSON_MOBILE_TEL || "";
        //已经校验过不显示获取验证码按钮
        if (defaultValue && (checkMobile == defaultValue || defaultValue == oldMobile)) {
            field.IS_SHOW_BUTTON = false;
            fieldData.VALIDATE_CODE.FIELD_CONTROL = "1";
            fieldData.ASSIGN_PERSON_MOBILE_TEL.SUFFIX_ICON = "el-icon-success";
            return;
        }
        field.IS_SHOW_BUTTON = true;
        fieldData.VALIDATE_CODE.FIELD_CONTROL = "0";
        fieldData.ASSIGN_PERSON_MOBILE_TEL.SUFFIX_ICON = "";
    },
    //身份验证模块 点击获取验证码
    "CHECK_ASSIGN_PERSON_MOBILE_TEL__CLICK": (_this, field, fieldData) => {
        if (field.message) {
            return;
        }
        let userInfo = _this.$storage.getJsonSession(_this.$definecfg.USER_INFO);
        let mobile = fieldData.ASSIGN_PERSON_MOBILE_TEL.DEFAULT_VALUE || "";
        let params = {
            MOBILE: mobile,
            ORG_CODE: userInfo.ORG_CODE
        }
        _this.$blMethod.getVerificationCode(_this, params, field, 60, () => {
            //清空验证码
            fieldData.VALIDATE_CODE.DEFAULT_VALUE = "";
        });
    },
    //身份验证模块  验证码校验函数
    "CHECK_ASSIGN_VALIDATE_CODE": function (_this, field, fieldData) {
        //不可编辑的时候不用验证验证码 防止第一次进来的时候 校验
        if (field.FIELD_CONTROL == "1") {
            return;
        }
        let mobile = fieldData.ASSIGN_PERSON_MOBILE_TEL.DEFAULT_VALUE || "";
        let defaultValue = field.DEFAULT_VALUE || "";
        let params = {
            MOBILE: mobile,
            AUTH_CODE: defaultValue
        }
        _this.$blMethod.validateVerificationCode(_this, params, field, fieldData.ASSIGN_PERSON_MOBILE_TEL, () => {
            //验证码置灰
            field.FIELD_CONTROL = "1";
            //手机号码获取验证码按钮消失
            fieldData.ASSIGN_PERSON_MOBILE_TEL.IS_SHOW_BUTTON = false;
            fieldData.ASSIGN_PERSON_MOBILE_TEL.SUFFIX_ICON = "el-icon-success";
        });
    },
}
