/*
 *   代理人信息
 *   方法封装
 */

import date from '../../../../../../../tools/date.js'
import * as utils from "../../../../../../../tools/util"
import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../businessTools/bizPublicMethod.js"
import custInfoModel from '../../common/cust-info-model.js'
import {parseAddress} from '../../../../../../../tools/util' //地址解析组件

const CHECK_ADULT_TIP_KEY = "checkAdult";

const CHECK_ADULT_TIP_TITLE = "未满18周岁不允许成为代理人。";

const CHECK_INVALID_MOBILE_TEL_KEY = "checkMobileTel";

const CHECK_INVALID_MOBILE_TEL_TITILE = "代理人的手机号码不能与客户本人的一样，请重新输入！";


const isSameWithCustMobileTel = (_this, agentMobileTel) => {
    if (_.isEmpty(agentMobileTel)) {
        return false;
    }
    return agentMobileTel == getCustMobileTel(_this);
}

const getCustMobileTel = (_this) => {
    let custMobileTel = "";
    return custMobileTel;
}

const getBirthDateByIdCode = (idCode) => {
    if (_.isEmpty(idCode) || idCode.length != 18) {
        return "";
    }
    return idCode.substr(6, 8);
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
 * 隐藏 “获取验证码按钮”、“验证码输入框”
 * @param {object} _this 
 */
 const hideValidateCodeInput = (_this) => {
    let fields = _this.groupDatas.RELA_INFO.AGENT_INFO[0].FIELDS; 
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
    let fields = _this.groupDatas.RELA_INFO.AGENT_INFO[0].FIELDS; 
    fields.MOBILE_TEL.IS_SHOW_BUTTON = true;
    fields.MOBILE_TEL.FIELD_BUTTON_TXT = "获取验证码";
    fields.MOBILE_TEL.SUFFIX_ICON = "";
    fields.VALIDATE_CODE.FIELD_CONTROL = "0";
    fields.VALIDATE_CODE.DEFAULT_VALUE = "";
}

/**
 * 字段值是否与历史数据不一样
 * @param {object} _this 
 * @param {object} field  字段对象
 */
const isDifferentFromHistory = (_this, field) => {
    let historyAgentInfo = _.get(_this.historyData, "RELA_INFO.ASSIGN_INFO");
    return _.isEmpty(historyAgentInfo) || field.DEFAULT_VALUE != historyAgentInfo[[field.FIELD_ID]];
}

/**
 * 判断字段是否没有改变
 * @param {object} field 字段对象
 */
 const isFieldValueNotChanged = (field) => {
    return field.LAST_DEFAULT_VALUE == field.DEFAULT_VALUE;
}

const backfillHistoryData = (_this) => {
    let agentInfo = _.get(_this.historyData, "RELA_INFO.ASSIGN_INFO");
    if (!_.isEmpty(agentInfo)) {
        bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["AGETN_INFO"], agentInfo);
    }
}

const getAdultDate = (birthDate) => {
    let birthDateInt = parseInt(birthDate);
    return isNaN(birthDateInt) ? undefined : birthDateInt + 180000;
}

const getSexByIdCode = (idCode) => {
    if (idCode.length == 15) {
        return idCode.charAt(14) % 2 == 0 ? "1" : "0";
    } else if (idCode.length == 18) {
        return idCode.charAt(16) % 2 == 0 ? "1" : "0";
    }
    return "";
}
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

export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizOrgAgentInfoBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     */
    bizOrgAgentInfoBeforeLoadBiz: function (_this) {
    },
    bizOrgAgentInfoBeforeLoadBizOpenAcct: function (_this) {
        // 性别屏蔽 2-其他
        let fields = _this.groupDatas.RELA_INFO.AGENT_INFO[0].FIELDS;
        fields.SEX.FIELD_DICT_FILTER = "!2";
        fields.ADDRESS.VALID_TYPE = "val[16,128]|on-blur";
        fields.ADDRESS.changeMessage = "请输入 16 到 128个字符，1个中文算2个字符，“不详”算0个字符";
        let orgCurrentAgent = _this.$storage.getJsonSession(_this.$definecfg.ORG_CURRENT_AGENT) || {};
        let customerInfo = _this.oppBusiData.customerInfo;
        // 经办人，若开户经办人已在系统内开户（状态非“注销”），自动填充该代理人在系统内的信息
        return Promise.all([_this.$syscfg.K_Request("Y1100010", {
                ID_CODE: orgCurrentAgent.ID_CODE,
                ID_TYPE: orgCurrentAgent.ID_TYPE,
                USER_ROLES: "4",
            }),
        ]).then(res => {
            let agentList = res[0].Data;
            agentList = _.filter(agentList, obj => {
                return obj.USER_STATUS != "9" && obj.INT_ORG == customerInfo.INT_ORG && 
                obj.USER_NAME == orgCurrentAgent.CUST_FNAME;
            });
            // 若存在多条满足条件的代理人，默认取开户时间最近的
            if (agentList.length > 0) {
                return _this.$syscfg.K_Request("Y3000001", {
                    LBM:"L1160001",
                    USER_CODE: _.max(agentList, function (obj) { return Number(obj.OPEN_DATE) }).USER_CODE,
                    USER_ROLE: "4"
                }).then(res => {
                    let agentObj = _.get(res, "Data[0]", {});
                    _this.$blMethod.parseGroupsMouduleData(_this, ["AGENT_INFO"], agentObj);
                })
            }
        }).catch(err => {
            console.error(err);
        })
    },
    /*
     *@method bizOrgAgentInfoAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     */
    bizOrgAgentInfoAfterLoadBiz: function (_this) {
        backfillHistoryData(_this);
        let custInfo =  _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO) || {};
        let agentCardInfo = custInfo.AGENT_CARD_INFO;
        // 回填登录时录入的代理人三要素
        let orgCurrentAgent = _this.$storage.getJsonSession(_this.$definecfg.ORG_CURRENT_AGENT) || {};
        if (!_.isEmpty(orgCurrentAgent)) {
            _this.groupDatas.RELA_INFO.AGENT_INFO[0].FIELDS.USER_NAME.DEFAULT_VALUE = orgCurrentAgent.CUST_FNAME;
            _this.groupDatas.RELA_INFO.AGENT_INFO[0].FIELDS.ID_TYPE.DEFAULT_VALUE = orgCurrentAgent.ID_TYPE;
            _this.groupDatas.RELA_INFO.AGENT_INFO[0].FIELDS.ID_CODE.DEFAULT_VALUE = orgCurrentAgent.ID_CODE;
            if (orgCurrentAgent.ID_TYPE == "00") {
                _this.groupDatas.RELA_INFO.AGENT_INFO[0].FIELDS.BIRTHDAY.DEFAULT_VALUE = getBirthDateByIdCode(orgCurrentAgent.ID_CODE);
                _this.groupDatas.RELA_INFO.AGENT_INFO[0].FIELDS.SEX.DEFAULT_VALUE = getSexByIdCode(orgCurrentAgent.ID_CODE);
            }
        }
        // 如果是读卡或者ocr识别开户的，要回填证件有效期
        if (!_.isEmpty(agentCardInfo)) {
            _this.groupDatas.RELA_INFO.AGENT_INFO[0].FIELDS.ID_EXP_DATE.DEFAULT_VALUE = agentCardInfo.ID_EXP_DATE;
        }
        // 根据公参是否显示验证码
        let fieldData = _this.groupDatas.RELA_INFO.AGENT_INFO[0]["FIELDS"];
        _this.oppBusiData.VALID_MOBILE = _this.oppBusiData.busiCommonParams.VALID_MOBILE || "1";
        if (_this.oppBusiData.VALID_MOBILE != "1") {
            fieldData.MOBILE_TEL.IS_SHOW_BUTTON = false;
            fieldData.VALIDATE_CODE.FIELD_CONTROL = "1";
            fieldData.MOBILE_TEL.SUFFIX_ICON = "";
        }
    },
    /*
     *@method bizOrgAgentInfoBeforeSave
     *@desc 钩子函数 自定义保存数
     */
    bizOrgAgentInfoBeforeSave: function (_this, params) {
        let agentInfo = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "AGENT_INFO");
        agentInfo.ADDRESS = agentInfo.ADDRESS.replace("市辖区","").replace(/不详/g,"").replace("辖县", "");
        agentInfo.IS_OPEN_AGENT = "1";
        let relaInfo = params.RELA_INFO || {};
        relaInfo.ASSIGN_INFO = agentInfo;
        // 翻译字段字典项，以便影像展示
        let fields = _this.groupDatas.RELA_INFO.AGENT_INFO[0].FIELDS;
        relaInfo.ASSIGN_INFO.ID_TYPE_TEXT = 
            bizPublicMethod.$blMethod.getFieldDictItemName(fields.ID_TYPE);
        _this.$storage.setSession(_this.$definecfg.ORG_CURRENT_AGENT, _.extend(agentInfo, {
            CUST_FNAME: agentInfo.USER_NAME || ""
        }));
        Object.assign(params, {
            RELA_INFO: relaInfo,
            NEW_IS_AGENT: "1", // 是否开通代理人 用于影像采集
            NEW_AGT_ID_TYPE: agentInfo.ID_TYPE,
            AGENT_CSDC_VALID_FLAG: "1", // 代理人联网校验成功失败标志
        })
        return params;
    },
    /*
     *@method bizOrgAgentInfoAfterSave
     *@desc 钩子函数 自定义保存数
     */
    bizOrgAgentInfoAfterSave: (_this, newData) => {

    },
    /*
     *@method bizOrgAgentInfoValidate
     *@desc 钩子函数 下一步验证
     */
    bizOrgAgentInfoValidate: async function (_this) {
        let modules = _this.groupDatas.RELA_INFO.AGENT_INFO;
        let VALIDATE_CODE = modules[0].FIELDS.VALIDATE_CODE;
        
        if (VALIDATE_CODE.FIELD_CONTROL != "1") {
            let flag = await this.CHECK_VALIDATE_CODE(_this, VALIDATE_CODE, modules[0].FIELDS);
            if (!flag) {
                return false;
            }
        }
        let fieldIds = ["ID_EXP_DATE", "END_DATE"];
        let promiseArr = bizPublicMethod.$blMethod.getValidatePromises(_this, modules, fieldIds);
        return Promise.all(promiseArr).then( (res)=> {
            if (_.includes(res, false)) {
                return false;
            }
        })
    },

    /*
     *@method bizOrgAgentInfoPageActivated
     *@desc 钩子函数：页面激活
     */
    bizOrgAgentInfoPageActivated: function (_this) {

    },

    bizOrgAgentInfoPreValidate: function (_this) {},
    //----------------------业务函数----------------------------------//
    "CHECK_MOBILE_TEL": (_this, field, fieldData) => {
        if (isFieldValueNotChanged(field)) {
            return;
        }
        removeMyFlowTip(_this, CHECK_INVALID_MOBILE_TEL_KEY);
        if (isSameWithCustMobileTel(_this, field.DEFAULT_VALUE)) {
            pushMyFlowTip(_this, CHECK_INVALID_MOBILE_TEL_KEY, CHECK_INVALID_MOBILE_TEL_TITILE, "error");
        }
        if (isDifferentFromHistory(_this, field)) {
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
        let mobileField = _this.groupDatas.RELA_INFO.AGENT_INFO[0].FIELDS.MOBILE_TEL;
        let codeField = _this.groupDatas.RELA_INFO.AGENT_INFO[0].FIELDS.VALIDATE_CODE;
        field.disableNext = true;
        let runValidateMobileData = await _this.$blMethod.runValidateGetMobileCode(_this, mobileField, codeField);
        field.disableNext = false;
        if (!runValidateMobileData) {
            return;
        }
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
            return true;
        });
    },
    "CHECK_BIRTHDAY": (_this, field, fieldData) => {
        removeMyFlowTip(_this, CHECK_ADULT_TIP_KEY);
        let adultDate = getAdultDate(field.DEFAULT_VALUE);
        let nowDate = parseInt(_this.oppBusiData.SYS_DATE);
        if (adultDate != undefined && adultDate > nowDate) {
            pushMyFlowTip(_this, CHECK_ADULT_TIP_KEY, CHECK_ADULT_TIP_TITLE, "error");
        }
    },
    "CHECK_ID_TYPE": (_this, field, fieldData) => {
        // 国内证件类型展示地址下拉框，国外不展示
        if (["00", "0b", "0c", "0d", "oi", "0j", "0s"].indexOf(field.DEFAULT_VALUE) > -1) {
            fieldData["ADDRESS"].showRegionSelector = true;
        } else {
            fieldData["ADDRESS"].showRegionSelector = false;
        }
        // 证件类型为身份证时，需自动填充出生日期、性别，设置为不可编辑
        fieldData.BIRTHDAY.FIELD_CONTROL = fieldData.ID_TYPE.DEFAULT_VALUE == "00" ? "2" : "0";
        fieldData.SEX.FIELD_CONTROL = fieldData.ID_TYPE.DEFAULT_VALUE == "00" ? "2" : "0";
    },
    "CHECK_ADDRESS": (_this, field, fieldData) => {
        let addressTextInfo = parseAddress(field.DEFAULT_VALUE);
        if (fieldData.ZIP_CODE) {
            if (addressTextInfo && addressTextInfo.length > 3 && !_.isEmpty(addressTextInfo[3])) {
                fieldData.ZIP_CODE.DEFAULT_VALUE = addressTextInfo[3];
                fieldData.ZIP_CODE.correct = true;
            }
        }
    },
    "CHECK_ID_CODE": (_this, field, fieldData) => {
        if (fieldData.ID_TYPE.DEFAULT_VALUE == "00") {
            fieldData.BIRTHDAY.DEFAULT_VALUE = getBirthDateByIdCode(field.DEFAULT_VALUE);
            fieldData.SEX.DEFAULT_VALUE = getSexByIdCode(field.DEFAULT_VALUE);
        }
    },
    "CHECK_ID_EXP_DATE": (_this, field, fieldData, module) => {
        if (bizPublicMethod.$blMethod.isExpired(_this, field.DEFAULT_VALUE)) {
            _this.$nextTick( () => {
                bizPublicMethod.$blMethod.changeFieldError(field, false, field.FIELD_TITLE + "已过期");
            })
            return false;
        }
    },
    "CHECK_END_DATE": (_this, field, fieldData, module) => {
        if (bizPublicMethod.$blMethod.isExpired(_this, field.DEFAULT_VALUE)) {
            _this.$nextTick( () => {
                bizPublicMethod.$blMethod.changeFieldError(field, false, field.FIELD_TITLE + "已过期");
            })
            return false;
        }
    },

}
