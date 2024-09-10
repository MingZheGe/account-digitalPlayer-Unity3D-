/*
 *   实际受益人(受益所有人)
 *   方法封装
 *   @author  yangyp
 */

import date from '../../../../../../../tools/date.js'
import * as utils from "../../../../../../../tools/util"
import smsService from '../../../../../../../service/sms-service'
import * as bizPubTools from "./../../bizPublicTools"
import stringConfig from "../../../../../../../tools/stringConfig.js"
import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../../business/businessTools/bizPublicMethod.js"
import custInfoModel from '../../common/cust-info-model.js'


export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizOrgBeneficiaryNodeBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizOrgBeneficiaryNodeBeforeLoadBiz: function (_this) {
        // 字段设置
        let saveGroupId = _this.userType == "2" ? "ORG_INFO" : "RELA_INFO";
        let fieldData = _this.groupDatas[saveGroupId].ORG_BENEFICIARY_INFO[0]["FIELDS"];
        fieldData.BENEFICIARY_NAME.VALID_TYPE = "length[1,64]";
        fieldData.BENEFICIARY_ADDR.VALID_TYPE = "length[12,256]|on-blur";
        fieldData.BENEFICIARY_ID_TYPE.FIELD_FUNCTION = "CHECK_BENEFICIARY_ID_TYPE__BENEFICIARYINFO";
        fieldData.BENEFICIARY_ADDR.FIELD_FUNCTION = "CHECK_BENEFICIARY_ADDR__BENEFICIARYINFO";
        fieldData.BENEFICIARY_ID.FIELD_FUNCTION = "CHECK_BENEFICIARY_ID__BENEFICIARYINFO";

        _this.groupDatas[saveGroupId].ORG_BENEFICIARY_INFO[0].MAX_LENGTH = (_this.oppBusiData.busiCommonParams && _this.oppBusiData.busiCommonParams.MAX_BENEFICIARY && parseInt(_this.oppBusiData.busiCommonParams.MAX_BENEFICIARY)) || 3;
        let dictItem = _this["oppBusiData"]["VALID_ID_TYPE_FOR_BOTH"] || _.map(fieldData.BENEFICIARY_ID_TYPE.FIELD_DICT_NAME, 'DICT_ITEM')
        _this.groupDatas[saveGroupId].ORG_BENEFICIARY_INFO[0].FIELDS.BENEFICIARY_ID_TYPE.FIELD_DICT_FILTER = _.filter(dictItem, function (item) {
            return item.charAt(0) == '0'
        })
        _this.groupDatasTpl[saveGroupId].ORG_BENEFICIARY_INFO = _.cloneDeep(_this.groupDatas[saveGroupId].ORG_BENEFICIARY_INFO);

        let showBeneficiaryInfo = _this.oppBusiData.busiCommonParams && _this.oppBusiData.busiCommonParams.SHOW_BENEFICIARY == "1",
            amlEnable = _this.$storage.getJsonSession(_this.$definecfg.SYS_COMM_PARAM_OBJS).AML_ENABLE == "1";
        _this.oppBusiData.BENEFICIARY_FLAG = false;
        if (amlEnable) {
            if (showBeneficiaryInfo) {
                _this.oppBusiData.BENEFICIARY_FLAG = true;
                _.each(_this.groupDatas[saveGroupId].ORG_BENEFICIARY_INFO, (item, key) => {
                    item.MODULE_CONTROL = "1";
                })
                if(_this.userType == "1") {
                    _this.$router.showRoute("受益人信息")
                }
            } else {
                _.each(_this.groupDatas[saveGroupId].ORG_BENEFICIARY_INFO, (item, key) => {
                    item.MODULE_CONTROL = "0";
                })
                if(_this.userType == "1") {
                    _this.$router.hideRoute("受益人信息")
                }
            }
        } else {
            _.each(_this.groupDatas[saveGroupId].ORG_BENEFICIARY_INFO, (item, key) => {
                item.MODULE_CONTROL = "0";
            })
            if(_this.userType == "1") {
                _this.$router.hideRoute("受益人信息")
            }
        }
        let beneficiaryInfo = custInfoModel.getOriginaBeneficiaryInfo(_this.oppBusiData.oldBusiData);
        if (beneficiaryInfo.length) {
            bizPublicMethod.$blMethod.parseMoudleArray(_this, _this.groupDatas[saveGroupId]["ORG_BENEFICIARY_INFO"], beneficiaryInfo);
        }
        // 展示公安联网校验按钮
        _this.oppBusiData.POLICE_BTN_BENEFICIARY = _this.$blMethod.getJsonSessionBusiCommParam(_this, "POLICE_BTN_BENEFICIARY") || "0";
        if (_this.oppBusiData.POLICE_BTN_BENEFICIARY == "1") {
            _this.groupDatas[saveGroupId].ORG_BENEFICIARY_INFO[0].MODULE_CUSTOMIZE = "1";
            _this.groupDatasTpl[saveGroupId].ORG_BENEFICIARY_INFO[0].MODULE_CUSTOMIZE = "1";
            _this.groupDatas[saveGroupId].ORG_BENEFICIARY_INFO[0].MODULE_CUSTOMIZE_TXT = "公安联网校验";
            _this.groupDatasTpl[saveGroupId].ORG_BENEFICIARY_INFO[0].MODULE_CUSTOMIZE_TXT = "公安联网校验";
        }
        
    },
    /*
     *@method bizOrgBeneficiaryNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-13 09:42:56
     */
    bizOrgBeneficiaryNodeAfterLoadBiz: function (_this) {
        // 字段设置
        let saveGroupId = _this.userType == "1" ? "RELA_INFO" : _this.userType == "2" ? "ORG_INFO" : "RELA_INFO";
        if (_.get(_this.oppBusiData.newBusiData, saveGroupId + ".ORG_BENEFICIARY_INFO", "")) {
            bizPublicMethod.$blMethod.parseMoudleArray(_this, _this.groupDatas[saveGroupId]["ORG_BENEFICIARY_INFO"], _.get(_this.oppBusiData.newBusiData, saveGroupId + ".ORG_BENEFICIARY_INFO", []));
        }
    },
    /*
     *@method bizOrgBeneficiaryNodeBeforeSave
     *@desc 钩子函数 自定义保存数
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizOrgBeneficiaryNodeBeforeSave: async function (_this, params) {
        let saveGroupId = _this.userType == "1" ? "RELA_INFO" : _this.userType == "2" ? "ORG_INFO" : "RELA_INFO";
        let isOpenAcct = _this.$storage.getJsonSession(_this.$definecfg.IS_OPEN_ACCT_BIZ);

        let orgBeneficiaryInfo = bizPublicSaveMethod.getModuleArrFoyKey(_this, "ORG_BENEFICIARY_INFO", true);
        let busiData = _this.oppBusiData.newBusiData;
        let orgInfo = busiData && busiData[saveGroupId] || {};
        orgInfo.ORG_BENEFICIARY_INFO = orgBeneficiaryInfo;
        if (isOpenAcct == "1") {
            let orgBeneficiaryInfoChange = bizPublicMethod.$blMethod.getArrDiff(orgBeneficiaryInfo, custInfoModel.getOriginaBeneficiaryInfo(_this.oppBusiData.oldBusiData), "BENEFICIARY_NO", "MODULE_RADIO_BUTTON")
            orgInfo.ORG_BENEFICIARY_CHANGE_INFO = orgBeneficiaryInfoChange;
        }

        params[saveGroupId] = params[saveGroupId] || {};
        Object.assign(params[saveGroupId], orgInfo);
    },
    /*
     *@method bizOrgBeneficiaryNodeAfterSave
     *@desc 钩子函数 自定义保存数
     */
    bizOrgBeneficiaryNodeAfterSave: (_this, newData) => {
        let saveGroupId = _this.userType == "1" ? "RELA_INFO" : _this.userType == "2" ? "ORG_INFO" : "RELA_INFO";
        if (_this.oppBusiData.newBusiData) {
            let newObj = {
                [saveGroupId]: _.get(newData, saveGroupId, {})
            }
            _.assign(_this.oppBusiData.newBusiData, newObj);
        }
    },

    // 添加按钮
    "bizOrgBeneficiaryNodeAddModuleFinished": (_this, fieldData) => {
        let saveGroupId = _this.userType == "1" ? "RELA_INFO" : _this.userType == "2" ? "ORG_INFO" : "RELA_INFO";
        let lastNo = _.last(_this.groupDatas[saveGroupId]["ORG_BENEFICIARY_INFO"]).FIELDS.BENEFICIARY_NO.DEFAULT_VALUE;
        lastNo && (fieldData.BENEFICIARY_NO.DEFAULT_VALUE = parseInt(lastNo) + 1 + "");
    },
    /*
     *@method bizOrgBeneficiaryNodeValidate
     *@desc 钩子函数 下一步验证
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizOrgBeneficiaryNodeValidate: function (_this) {
        let saveGroupId = _this.userType == "1" ? "RELA_INFO" : _this.userType == "2" ? "ORG_INFO" : "RELA_INFO";
        let idCodeList = _.map(_this.groupDatas[saveGroupId].ORG_BENEFICIARY_INFO, module => {
            return module.FIELDS.BENEFICIARY_ID.DEFAULT_VALUE;
        })
        if (idCodeList.length > _.uniq(idCodeList).length) {
            confirm("受益人信息的证件号码有重复记录，请删掉重复记录！")
            return false;
        }
        return true
    },

    /*
     *@method bizOrgBeneficiaryNodePageActivated
     *@desc 钩子函数：页面激活
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizOrgBeneficiaryNodePageActivated: function (_this, groupId) {
        _this.oppBusiData.isCheckFn = false;
    },
    CHECK_BENEFICIARY_ID_TYPE__BENEFICIARYINFO: (_this, field, fieldData) => {

        _this.$blMethod.setValidType(_this, field, fieldData, "BENEFICIARY_ID")
        if (_.indexOf(["00", "08"], field.DEFAULT_VALUE) === -1) {
            fieldData.SEX.FIELD_CONTROL = "0";
            fieldData.BIRTHDAY.FIELD_CONTROL = "0";
        }
        if (_.indexOf(["00", "08"], field.DEFAULT_VALUE) > -1) {
            fieldData.NATION.DEFAULT_VALUE = "CHN"
        }
        if (_this.userType == "1") {
            fieldData.MODULE_RADIO_BUTTON.DEFAULT_VALUE == "false" && (fieldData.BENEFICIARY_ID.DEFAULT_VALUE = "");
        }
        if  (_this.userType == "2") {
            fieldData.BENEFICIARY_ID.DEFAULT_VALUE = ""
        }
        if(field.DEFAULT_VALUE == "00"&&fieldData.BENEFICIARY_ID.DEFAULT_VALUE != ""){
            bizPublicMethod.$blMethod.autoSexBirthday(_this,fieldData.BENEFICIARY_ID, fieldData, "SEX", "BIRTHDAY", fieldData.BENEFICIARY_ID_TYPE.DEFAULT_VALUE)
        }
    },
    CHECK_BENEFICIARY_ADDR__BENEFICIARYINFO: (_this, field, fieldData) => {
        //获取地址的邮编
        let addressCode = field.addressCode;
        if (addressCode && fieldData.ZIP_CODE) {
            fieldData.ZIP_CODE.DEFAULT_VALUE = addressCode;
        }
    },
    CHECK_BENEFICIARY_ID__BENEFICIARYINFO: (_this, field, fieldData) => {
        let saveGroupId = _this.userType == "1" ? "RELA_INFO" : _this.userType == "2" ? "ORG_INFO" : "RELA_INFO";
        if (field.DEFAULT_VALUE != "") {
            let repeatModule = _.filter(_this.groupDatas[saveGroupId].ORG_BENEFICIARY_INFO, module => {
                return module.FIELDS.BENEFICIARY_ID.DEFAULT_VALUE == field.DEFAULT_VALUE;
            })
            if (repeatModule && repeatModule.length >= 2) {
                _this.$nextTick(() => {
                    _this.$blMethod.changeFieldError(field, false, "受益人证件号码已经存在，不能重复输入");
                })
                return
            }
            bizPublicMethod.$blMethod.autoSexBirthday(_this, field, fieldData, "SEX", "BIRTHDAY", fieldData.BENEFICIARY_ID_TYPE.DEFAULT_VALUE)
        }
    },
    //国家
    CHECK_BENEFICIARYINFO_NATION: (_this, field, fieldData) => {
        //国家不为中国 联系地址字段为输入框组件
        let defaultValue = field.DEFAULT_VALUE;
        if (defaultValue == "CHN") {
            _this.$nextTick(() => {
                fieldData.BENEFICIARY_ADDR.showRegionSelector = true;
            })

        } else {
            _this.$nextTick(() => {
                fieldData.BENEFICIARY_ADDR.showRegionSelector = false;
            })
        }
    },
    BENEFICIARYINFO_DELETE_MODULE_FINISHED: (_this, fieldData) => {
        _.each(_this.$refs, (item, key) => {
            if (key.indexOf("ORG_BENEFICIARY_INFO") > -1 && item.length > 0) {
                item[0].$refs.BENEFICIARY_ID[0].field.message = "";
                item[0].$refs.BENEFICIARY_ID[0].$refs.BENEFICIARY_ID.validate("change");
            }
        })
    }
}
