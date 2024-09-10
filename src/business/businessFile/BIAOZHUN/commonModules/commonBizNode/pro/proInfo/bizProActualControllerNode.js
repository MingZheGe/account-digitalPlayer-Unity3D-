/*
 *   实际控制人
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
     *@method bizOrgActualControllerNodeBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizOrgActualControllerNodeBeforeLoadBiz: function (_this) {
        // 字段设置
        var actualControllerInfo = custInfoModel.getOriginaActualControllerInfo(_this.oppBusiData.oldBusiData);        
       if(!_.isEmpty(actualControllerInfo)) {
            bizPublicMethod.$blMethod.parseMoudleArray(_this, _this.groupDatas.ORG_INFO["ORG_ACTUAL_CONTROLER_INFO"], actualControllerInfo);
        }
        
    },
    /*
     *@method bizOrgActualControllerNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-13 09:42:56
     */
    bizOrgActualControllerNodeAfterLoadBiz: function (_this) {
        if(_.get(_this.oppBusiData.newBusiData, "ORG_INFO.ORG_ACTUAL_CONTROLER_INFO", "")){
            bizPublicMethod.$blMethod.parseMoudleArray(_this, _this.groupDatas.ORG_INFO["ORG_ACTUAL_CONTROLER_INFO"], _.get(_this.oppBusiData.newBusiData, "ORG_INFO.ORG_ACTUAL_CONTROLER_INFO", []));
        }
        
    },
    /*
     *@method bizOrgActualControllerNodeBeforeSave
     *@desc 钩子函数 自定义保存数
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizOrgActualControllerNodeBeforeSave: async function (_this, params) {
        let isOpenAcct = _this.$storage.getJsonSession(_this.$definecfg.IS_OPEN_ACCT_BIZ);

        let orgActualConrollerInfo = bizPublicSaveMethod.getModuleArrFoyKey(_this, "ORG_ACTUAL_CONTROLER_INFO", true);
        let busiData = _this.oppBusiData.newBusiData;
        let orgInfo = busiData && busiData.ORG_INFO || {};
        orgInfo.ORG_ACTUAL_CONTROLER_INFO = orgActualConrollerInfo;
        if(isOpenAcct == "1") {
            let orgActualConrollerChangeInfo  = bizPublicMethod.$blMethod.getArrDiff(orgActualConrollerInfo,custInfoModel.getOriginaActualControllerInfo(_this.oppBusiData.oldBusiData),"CONTROLER_NUM","MODULE_RADIO_BUTTON")
            orgInfo.ORG_ACTUAL_CONTROLER_CHANGE_INFO = orgActualConrollerChangeInfo;
        }
        
        Object.assign(params.ORG_INFO, orgInfo);
    },
    /*
     *@method bizOrgActualControllerNodeAfterSave
     *@desc 钩子函数 自定义保存数
     */
    bizOrgActualControllerNodeAfterSave: (_this, newData) => {
        if (_this.oppBusiData.newBusiData) {
            let newObj = { 
                ORG_INFO: _.get(newData, "ORG_INFO", {})
            }
            _.assign(_this.oppBusiData.newBusiData, newObj);
        }
    },
    /*
     *@method bizOrgActualControllerNodeValidate
     *@desc 钩子函数 下一步验证
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizOrgActualControllerNodeValidate: function (_this) {
        let saveGroupId = _this.userType == "1" ? "RELA_INFO" : _this.userType == "2" ? "ORG_INFO" : "RELA_INFO";
        let idCodeList = _.map(_this.groupDatas[saveGroupId].ORG_ACTUAL_CONTROLER_INFO, module => {
            return module.FIELDS.CONTROLER_ID_NO.DEFAULT_VALUE;
        })
        if (idCodeList.length > _.uniq(idCodeList).length) {
            _this.messageBox({
                hasMask: true,
                messageText: "控制人信息的证件号码有重复记录，请删掉重复记录！",
                confirmButtonText: '确定',
                typeMessage: 'warn',
                showMsgBox: true,
            });
            return false;
        }
    },

    /*
     *@method bizOrgActualControllerNodePageActivated
     *@desc 钩子函数：页面激活
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizOrgActualControllerNodePageActivated: function (_this, groupId) {
        //过滤证件类型
        let dictItem = _this["oppBusiData"]["VALID_ID_TYPE_FOR_BOTH"] || _.map(_this.groupDatas.ORG_INFO.ORG_ACTUAL_CONTROLER_INFO[0].FIELDS.CONTROLER_ID_TYPE.FIELD_DICT_NAME, 'DICT_ITEM')
        _this.groupDatas.ORG_INFO.ORG_ACTUAL_CONTROLER_INFO[0].FIELDS.CONTROLER_ID_TYPE.FIELD_DICT_FILTER = _.filter(dictItem, function(item) {
            return item.charAt(0) == '0'
        })

        let fields = _this.groupDatas.ORG_INFO.ORG_ACTUAL_CONTROLER_INFO[0].FIELDS;     
        fields.CONTROLER_ID_NO.promptValue =  fields.CONTROLER_ID_NO.DEFAULT_VALUE;       
        _this.$refs.flowTip.flowTips = [];
        _this.oppBusiData.isCheckFn = false;
    },
    /**
     * 实际控制人
     * 
     * custBasicInfo 选择的是_this内部的，可以选择session内部的，或者_this.groupDatas里面的
     */
    CHECK_CONTROLER_RELATION: (_this, field, fieldData) => {
    },
    CHECK_ACUTALCONTROLERINFO_ID_NO: (_this, field, fieldData) => {
        let saveGroupId = _this.userType == "1" ? "RELA_INFO" : _this.userType == "2" ? "ORG_INFO" : "RELA_INFO";
        if (field.DEFAULT_VALUE != "") {
            let repeatModule = _.filter(_this.groupDatas[saveGroupId].ORG_ACTUAL_CONTROLER_INFO, module => {
                return module.FIELDS.CONTROLER_ID_NO.DEFAULT_VALUE == field.DEFAULT_VALUE;
            })
            if (repeatModule && repeatModule.length >= 2) {
                _this.$nextTick(() => {
                    _this.$blMethod.changeFieldError(field, false, "控制人证件号码已经存在，不能重复输入");
                })
            }
        }
    },
    CHECK_ACUTALCONTROLERINFO_ID_TYPE:(_this, field, fieldData) => {
        _this.$blMethod.setValidType(_this, field, fieldData, "CONTROLER_ID_NO");
    },
    CHECK_CONTROLLER_MODULE_RADIO:(_this, field, fieldData) => {
        
    },
    CONTROLLER_MODULE_customizeModule: (_this, moduleId, fieldData) => {
    },
    ACTUALCONTROLERINFO_DELETE_MODULE_FINISHED: (_this, fieldData) => {
        _.each(_this.$refs, (item, key) => {
            if (key.indexOf("ORG_ACTUAL_CONTROLER_INFO") > -1 && item.length > 0) {
                item[0].$refs.CONTROLER_ID_NO[0].field.message = "";
                item[0].$refs.CONTROLER_ID_NO[0].$refs.CONTROLER_ID_NO.validate("change");
            }
        })
    }

}


