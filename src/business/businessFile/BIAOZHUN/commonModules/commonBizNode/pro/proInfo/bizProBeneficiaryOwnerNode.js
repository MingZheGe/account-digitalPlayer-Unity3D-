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
import {
    parseAddress
} from '../../../../../../../tools/util' //地址解析组件
import custInfoModel from '../../common/cust-info-model.js'

export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizProBeneficiaryOwnerNodeBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizProBeneficiaryOwnerNodeBeforeLoadBiz: function (_this) {
        // 字段设置
        let saveGroupId = _this.userType == "2" ? "ORG_INFO" : "RELA_INFO";
        let fieldData = _this.groupDatas[saveGroupId].ORG_BENEFICIARY_OWNER_INFO[0]["FIELDS"];
        fieldData.SHARE_RATIO.IS_SHOW_BUTTON = true;
        // 设置默认值0
        fieldData.SPECIAL_PERSON_FLAG.DEFAULT_VALUE = '0';
        
        fieldData.BENEFICIARY_NAME.VALID_TYPE = "length[1, 64]";
        fieldData.SHARE_RATIO.VALID_TYPE = "numberex[1,3,3,100]";
        let dictItem = _.map(fieldData.BENEFICIARY_ID_TYPE.FIELD_DICT_NAME, 'DICT_ITEM')
        fieldData.BENEFICIARY_ID_TYPE.FIELD_DICT_FILTER = _.filter(dictItem, function (item) {
            return item.charAt(0) == '0'
        })
        if (_this.userType == "1") {
            fieldData.BENEFICIARY_TEL.FIELD_CONTROL = "1";
            fieldData.DUTY_DESC.FIELD_CONTROL = "1";
        }
        _this.groupDatasTpl[saveGroupId].ORG_BENEFICIARY_OWNER_INFO = _.cloneDeep(_this.groupDatas[saveGroupId].ORG_BENEFICIARY_OWNER_INFO);
        // 预约信息
        let APPT_INFO = _this.$definecfg.APPT_INFO && JSON.parse(_this.$storage.getSession(_this.$definecfg.APPT_INFO));
        if(!_.isEmpty(APPT_INFO) && APPT_INFO.ORG_BENEFICIARY_OWNER_INFO&& APPT_INFO.ORG_BENEFICIARY_OWNER_INFO.length) {
            bizPublicMethod.$blMethod.parseMoudleArray(_this, _this.groupDatas[saveGroupId]["ORG_BENEFICIARY_OWNER_INFO"], APPT_INFO.ORG_BENEFICIARY_OWNER_INFO);
        }

        var actualBeneficiaryInfo = custInfoModel.getOriginaBeneficiaryOwnerInfo(_this.oppBusiData.oldBusiData);
        
        if (actualBeneficiaryInfo.length) {
            bizPublicMethod.$blMethod.parseMoudleArray(_this, _this.groupDatas[saveGroupId]["ORG_BENEFICIARY_OWNER_INFO"], actualBeneficiaryInfo);
        }

        // 展示公安联网校验按钮
        _this.groupDatas[saveGroupId].ORG_BENEFICIARY_OWNER_INFO[0].MODULE_CUSTOMIZE = "1";
        _this.groupDatasTpl[saveGroupId].ORG_BENEFICIARY_OWNER_INFO[0].MODULE_CUSTOMIZE = "1";
        _this.groupDatas[saveGroupId].ORG_BENEFICIARY_OWNER_INFO[0].MODULE_CUSTOMIZE_TXT = "公安联网校验";
        _this.groupDatasTpl[saveGroupId].ORG_BENEFICIARY_OWNER_INFO[0].MODULE_CUSTOMIZE_TXT = "公安联网校验";
    },
    /*
     *@method bizProBeneficiaryOwnerNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-13 09:42:56
     */
    bizProBeneficiaryOwnerNodeAfterLoadBiz: function (_this) {
        // 字段设置
        let saveGroupId = _this.userType == "2" ? "ORG_INFO" : "RELA_INFO";
        if (_.get(_this.oppBusiData.newBusiData, saveGroupId + ".ORG_BENEFICIARY_OWNER_INFO", "")) {
            bizPublicMethod.$blMethod.parseMoudleArray(_this, _this.groupDatas[saveGroupId]["ORG_BENEFICIARY_OWNER_INFO"], _.get(_this.oppBusiData.newBusiData, saveGroupId + ".ORG_BENEFICIARY_OWNER_INFO", []));
        }
        
    },
    /*
     *@method bizProBeneficiaryOwnerNodeBeforeSave
     *@desc 钩子函数 自定义保存数
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizProBeneficiaryOwnerNodeBeforeSave: async function (_this, params) {
        let saveGroupId = _this.userType == "1" ? "RELA_INFO" : _this.userType == "2" ? "ORG_INFO" : "RELA_INFO";
        let isOpenAcct = _this.$storage.getJsonSession(_this.$definecfg.IS_OPEN_ACCT_BIZ);

        let orgBeneficiaryOwnerInfo = bizPublicSaveMethod.getModuleArrFoyKey(_this, "ORG_BENEFICIARY_OWNER_INFO", true);
        let busiData = _this.oppBusiData.newBusiData;
        let orgInfo = busiData && busiData[saveGroupId] || {};
        orgInfo.ORG_BENEFICIARY_OWNER_INFO = orgBeneficiaryOwnerInfo;
        if (isOpenAcct == "1") {
            let orgActualBeneficiaryInfoChange = bizPublicMethod.$blMethod.getArrDiff(orgBeneficiaryOwnerInfo, custInfoModel.getOriginaBeneficiaryOwnerInfo(_this.oppBusiData.oldBusiData), "BENEFICIARY_NO", "MODULE_RADIO_BUTTON")
            _.each(orgActualBeneficiaryInfoChange.INFO, obj => {
                obj.IS_OWNER = "1" //IS_OWNER(是否受益所有人):1-是; 0-否
            }) 
            orgInfo.ORG_BENEFICIARY_OWNER_CHANGE_INFO = orgActualBeneficiaryInfoChange;

        }

        params[saveGroupId] = params[saveGroupId] || {};
        Object.assign(params[saveGroupId], orgInfo);
    },
    /*
     *@method bizProBeneficiaryOwnerNodeAfterSave
     *@desc 钩子函数 自定义保存数
     */
    bizProBeneficiaryOwnerNodeAfterSave: (_this, newData) => {
        let saveGroupId = _this.userType == "2" ? "ORG_INFO" : "RELA_INFO";
        if (_this.oppBusiData.newBusiData) {
            let newObj = {
                [saveGroupId]: _.get(newData, saveGroupId, {})
            }
            _.assign(_this.oppBusiData.newBusiData, newObj);
        }
    },

    // 添加按钮
    "bizProBeneficiaryOwnerNodeAddModuleFinished": (_this, moduleld) => {
        moduleld.FIELDS.BENEFICIARY_EXP_DATE.VALID_TYPE = "end";

        moduleld.FIELDS.SHARE_RATIO.IS_SHOW_BUTTON = true;
    },
    /*
     *@method bizProBeneficiaryOwnerNodeValidate
     *@desc 钩子函数 下一步验证
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizProBeneficiaryOwnerNodeValidate: function (_this) {
        let saveGroupId =  _this.userType == "2" ? "ORG_INFO" : "RELA_INFO";
        let idCodeList = _.map(_this.groupDatas[saveGroupId].ORG_BENEFICIARY_OWNER_INFO, module => {
            return module.FIELDS.BENEFICIARY_ID.DEFAULT_VALUE;
        })
        if (idCodeList.length > _.uniq(idCodeList).length) {
            confirm("受益人信息的证件号码有重复记录，请删掉重复记录!")
            return false;
        }
        if(_this.moduleId.indexOf("ORG_BENEFICIARY_OWNER_INFO") != -1){
            let isRuturnBool = false;
            _this.groupDatas[saveGroupId].ORG_BENEFICIARY_OWNER_INFO.forEach(function(item,index){
                if(parseInt(item.FIELDS.SHARE_RATIO.DEFAULT_VALUE) > 100){
                    isRuturnBool = true;
                    _this.$nextTick(() => {
                        _this.$blMethod.changeFieldError(item.FIELDS.SHARE_RATIO, false, "持股比例大于100%，请填写正确的持股比例");
                    })
                    let titleStr =  "受益所有人信息";
                    if(index > 0){
                        titleStr = titleStr + (index +1) +"持股比例大于100%，请填写正确的持股比例"
                    }else{
                        titleStr = titleStr +"持股比例大于100%，请填写正确的持股比例"
                    }
                    _this.$refs.flowTip.pushFlowTip({
                        title: titleStr,
                        type: 'warning',
                        key: 'name1',
                    })
                }
            });
            if(isRuturnBool){
                return false;
            }
        }
        return true;
    },

    /*
     *@method bizProBeneficiaryOwnerNodePageActivated
     *@desc 钩子函数：页面激活
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizProBeneficiaryOwnerNodePageActivated: function (_this, groupId) {       
        //过滤证件类型
        let saveGroupId = _this.userType == "2" ? "ORG_INFO" : "RELA_INFO";
        let dictItem = _this["oppBusiData"]["VALID_ID_TYPE_FOR_BOTH"] || _.map(_this.groupDatas[saveGroupId].ORG_BENEFICIARY_OWNER_INFO[0].FIELDS.BENEFICIARY_ID_TYPE.FIELD_DICT_NAME, 'DICT_ITEM')
        _this.groupDatas[saveGroupId].ORG_BENEFICIARY_OWNER_INFO[0].FIELDS.BENEFICIARY_ID_TYPE.FIELD_DICT_FILTER = _.filter(dictItem, function (item) {
            return item.charAt(0) == '0'
        })
        let AML_CUST_TYPE = _.get(_this.groupDatas, "ORG_INFO.ORG_BASIC_INFO[0].FIELDS.AML_CUST_TYPE.DEFAULT_VALUE", "");
        let beneficiaryType = "";
        if (AML_CUST_TYPE == "2") { //2-公司
            beneficiaryType = "1,2,3";
        }
        if (AML_CUST_TYPE == "3") {
            beneficiaryType = "4,5,6"
        }
        if (AML_CUST_TYPE == "4" || AML_CUST_TYPE == "5" || AML_CUST_TYPE == "6") { //6-受政府控制的企事业单位
            beneficiaryType = "7";
        }
        if (AML_CUST_TYPE == "7") { //7-信托
            beneficiaryType = "8";
        }
        if (AML_CUST_TYPE == "8") { //8-基金
            beneficiaryType = "9,a";
        }
        if (AML_CUST_TYPE == "9") { //9-其他金融产品
            beneficiaryType = "b";
        }
        _.each(_this.groupDatas[saveGroupId].ORG_BENEFICIARY_OWNER_INFO, item => {
            item.FIELDS.BENEFICIARY_TYPE.FIELD_DICT_FILTER = beneficiaryType
            // 如果值不在字典项里面则清空值
            if (beneficiaryType.indexOf(item.FIELDS.BENEFICIARY_TYPE.DEFAULT_VALUE) == -1) {
                item.FIELDS.BENEFICIARY_TYPE.DEFAULT_VALUE = ''
            }
        })
        _this.oppBusiData.isCheckFn = false;
    },
    /**
     * @method bizProBeneficiaryOwnerNodeDeleteModuleFinished
     * @desc 钩子函数：实际受益人模块的删除
     * @param {*} _this 
     * @param {*} fieldData 删除的模块
     * @author zky
     */
    bizProBeneficiaryOwnerNodeDeleteModuleFinished: function (_this, fieldData) {
        let saveGroupId = _this.userType == "1" ? "RELA_INFO" : _this.userType == "2" ? "ORG_INFO" : "RELA_INFO";
        if (fieldData[0].MODULE_CUSTOMIZE_TXT == "从法人资料同步") {
            _this.$set(_this.groupDatas[saveGroupId].ORG_BENEFICIARY_OWNER_INFO[0], "MODULE_CUSTOMIZE_TXT", _this.oppBusiData.copyContentName)
            _this.$set(_this.groupDatas[saveGroupId].ORG_BENEFICIARY_OWNER_INFO[0], "MODULE_CUSTOMIZE", '1');
        }
    },

    CHECK_BENEFICIARY_TYPE: function (_this, field, fieldData) {
        let benefiType = ['1', '4', '9'];
        if (benefiType.includes(field.DEFAULT_VALUE)) {
            fieldData.SHARE_RATIO.FIELD_REQUIRED = "1";
        } else {
            fieldData.SHARE_RATIO.FIELD_REQUIRED = "0";
        }
    },
    CHECK_BENEFICIARY_ID: (_this, field, fieldData) => {
        let saveGroupId = _this.userType == "1" ? "RELA_INFO" : _this.userType == "2" ? "ORG_INFO" : "RELA_INFO";
        if (field.DEFAULT_VALUE != "") {
            let repeatModule = _.filter(_this.groupDatas[saveGroupId].ORG_BENEFICIARY_OWNER_INFO, module => {
                return module.FIELDS.BENEFICIARY_ID.DEFAULT_VALUE == field.DEFAULT_VALUE;
            })
            if (repeatModule && repeatModule.length >= 2) {
                _this.$nextTick(() => {
                    _this.$blMethod.changeFieldError(field, false, "受益人所有人证件号码已经存在，不能重复输入");
                })

            }

        }
    },
    CHECK_SHARE_RATIO:function(_this, field, fieldData){
        if(stringConfig.isEmptyStr(field.DEFAULT_VALUE)){
            if(parseInt(field.DEFAULT_VALUE) > 100){
                _this.$refs.flowTip.pushFlowTip({
                    title: '持股比例大于100%，请填写正确的持股比例',
                    type: 'warning',
                    key: 'name1',
                })
            }
        }
    },
    CHECK_BENEFICIARY_ID_TYPE: (_this, field, fieldData) => {
        _this.$blMethod.setValidType(_this, field, fieldData, "BENEFICIARY_ID")
        if (_.indexOf(["00", "08"], field.DEFAULT_VALUE) > -1) {
            fieldData.NATION.DEFAULT_VALUE = "CHN"
        }
        if (_this.userType == "1") {
            fieldData.MODULE_RADIO_BUTTON.DEFAULT_VALUE == "false" && (fieldData.BENEFICIARY_ID.DEFAULT_VALUE = "");
        }
        if  (_this.userType == "2") {
            fieldData.BENEFICIARY_ID.DEFAULT_VALUE = ""
        }
    },
    CHECK_BENEFICIARY_ADDR: (_this, field, fieldData) => {
        let addressTextInfo = parseAddress(field.DEFAULT_VALUE);
        field.addressInfo = addressTextInfo;
        if (fieldData.ZIP_CODE && "addressInfo" in field) {
            if (field.addressInfo && field.addressInfo.length > 3 && stringConfig.isNotEmptyStr(field.addressInfo[3])) {
                fieldData.ZIP_CODE.DEFAULT_VALUE = field.addressInfo[3];
                fieldData.ZIP_CODE.FIELD_CONTROL = "2";
                fieldData.ZIP_CODE.correct = true;
            } else {
                fieldData.ZIP_CODE.FIELD_CONTROL = "0";
            }
        }
    },
    //受益所有人类型
    CHECK_BENEFICIARY_TYPE: (_this, field, fieldData) => {
        //受益所有人类型 选择 【1-直接或者间接拥有超过25%(含)公司股权或者表决权的自然人】时，持股比例必填
        //标准版2194新增:受益所有人类型为【4--拥有超过25％(含)合伙权益的自然人】、【9--拥有超过25％(含)权益份额的自然人】时持股比例为必填
        let defaultValue = field.DEFAULT_VALUE || "";
        if (_.indexOf(["1", "4", "9"], defaultValue) > -1) {
            fieldData.SHARE_RATIO.FIELD_REQUIRED = "1"
        } else {
            fieldData.SHARE_RATIO.FIELD_REQUIRED = "0"
        }
        fieldData.SHARE_RATIO.message = "";
    },
    //国家
    CHECK_BENEFICIARYOWNERINFO_NATION: (_this, field, fieldData) => {
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
    BENEFICIARY_MODULE_customizeModule: (_this, moduleId, fieldData) => {},
    BENEFICIARYOWNERINFO_DELETE_MODULE_FINISHED: (_this, fieldData) => {
        _.each(_this.$refs, (item, key) => {
            if (key.indexOf("ORG_BENEFICIARY_OWNER_INFO") > -1 && item.length > 0) {
                item[0].$refs.BENEFICIARY_ID[0].field.message = "";
                item[0].$refs.BENEFICIARY_ID[0].$refs.BENEFICIARY_ID.validate("change");
            }
        })
    }
}
