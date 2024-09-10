/*
 *   实际控制人
 *   方法封装
 *   @author  ljb
 */

import date from '../../../../../../../tools/date.js'
import * as utils from "../../../../../../../tools/util"
import smsService from '../../../../../../../service/sms-service'
import * as bizPubTools from "./../../bizPublicTools"
import stringConfig from "../../../../../../../tools/stringConfig.js"
import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../../business/businessTools/bizPublicMethod.js"
import custInfoModel from '../../common/cust-info-model.js'

const syncModules = (_this, field) => {
    if (_this.userType == "1") {
        let groupModuleArr = []
        if (field.BUSI_CODE == 'V9998') {
            groupModuleArr = [
                { groupId: 'RELA_INFO', moduleId: 'ORG_BENEFICIARY_OWNER_INFO' },
                { groupId: 'RELA_INFO', moduleId: 'ORG_BENEFICIARY_INFO' }
            ]
        }
        _this.$blMethod.syncToOtherModule(_this, groupModuleArr);
    }
}
const syncValidate = (_this, fieldData) => {
    if (_this.userType == "1") {
        let saveGroupId =  "RELA_INFO";
        let moduleArr = [
            {moduleId: 'ORG_BENEFICIARY_OWNER_INFO', name: '受益所有人信息'},
            {moduleId: 'ORG_BENEFICIARY_INFO', name: '受益人信息'}
        ]
        let radioChecked = false;
        let routerIndexArr = [];
        let orgControlerInfo = bizPublicSaveMethod.getModuleArrFoyKey(_this, "ORG_CONTROLER_INFO", true);
        let syncFieldArr = ['CONTROLER_ID_EXP_DATE', 'CONTROLER_ID_NO', 'CONTROLER_ID_TYPE', 'CONTROLER_NAME'];
        _.each(moduleArr, obj => {
            if (_this.groupDatas[saveGroupId][obj.moduleId][0].FIELDS.MODULE_RADIO_BUTTON.DEFAULT_VALUE == 'true') {
                routerIndexArr.push(_this.$router.getRouteIndex(obj.name))
                radioChecked = true;
            }
        })
        if (radioChecked) {
            let isChange = false;
            if (orgControlerInfo.length != (_this.historyData[saveGroupId]['ORG_CONTROLER_INFO'] && _this.historyData[saveGroupId]['ORG_CONTROLER_INFO'].length || 0)) {
                isChange = true;
            } else {
                _.each(orgControlerInfo, (obj, index) => {
                    for(let i = 0; i < syncFieldArr.length; i++) {
                        let propName = syncFieldArr[i];
                        if (obj[propName] != _this.historyData[saveGroupId]['ORG_CONTROLER_INFO'][index][propName]) {
                            isChange = true;
                            return false;
                        }
                    }
                })
            }
            let travel = _this.historyData.TRAVEL;
            if (isChange && fieldData.CONTROLER_ID_NO.DEFAULT_VALUE != '') {
                _this.oppBusiData.controlerChecked = true;
            }
            if (_this.oppBusiData.controlerChecked) {
                if (isChange) {
                    _.each(routerIndexArr, v => travel[v] && (travel[v].REJECT = "2"))
                } else {
                    _.each(routerIndexArr, v => travel[v] && (travel[v].REJECT = ""))
                }
                _this.$emit('travel-change', !isChange, routerIndexArr)
            }
        }
    }
}
export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizProControllerNodeBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizProControllerNodeBeforeLoadBiz: function (_this) {
        
        var originaControllerinfo = custInfoModel.getOriginaOrgControllerInfo(_this.oppBusiData.oldBusiData),
            saveGroupId = "EQUITY_INFO";
        // 预约信息
        let APPT_INFO = _this.$definecfg.APPT_INFO && JSON.parse(_this.$storage.getSession(_this.$definecfg.APPT_INFO));
        if(!_.isEmpty(APPT_INFO) && APPT_INFO.ORG_CONTROLER_INFO&& APPT_INFO.ORG_CONTROLER_INFO.length) {
            bizPublicMethod.$blMethod.parseMoudleArray(_this, _this.groupDatas[saveGroupId]["ORG_CONTROLER_INFO"], APPT_INFO.ORG_CONTROLER_INFO);
        }

        if (originaControllerinfo.length) {
            bizPublicMethod.$blMethod.parseMoudleArray(_this, _this.groupDatas[saveGroupId]["ORG_CONTROLER_INFO"], originaControllerinfo);
        }
        if (_this.groupDatas[saveGroupId].ORG_CONTROLER_INFO[0].FIELDS.CONTROLER_RELATION) {
            let relationFilter = _.get(_this.groupDatas, saveGroupId + ".ORG_CONTROLER_INFO[0].FIELDS.CONTROLER_RELATION.FIELD_DICT_NAME", []);
            relationFilter = _.map(relationFilter, 'DICT_ITEM')
            relationFilter = _.filter(relationFilter, item => {
                return item.charAt(0) == "0" && item != "0Z";
            })
            _this.groupDatas[saveGroupId].ORG_CONTROLER_INFO[0].FIELDS.CONTROLER_RELATION.FIELD_DICT_FILTER = relationFilter;
        }
        //过滤证件类型
        let dictItem = _this["oppBusiData"]["VALID_ID_TYPE_FOR_BOTH"] || _.map(_this.groupDatas[saveGroupId].ORG_CONTROLER_INFO[0].FIELDS.CONTROLER_ID_TYPE.FIELD_DICT_NAME, 'DICT_ITEM')
        _this.groupDatas[saveGroupId].ORG_CONTROLER_INFO[0].FIELDS.CONTROLER_ID_TYPE.FIELD_DICT_FILTER = _.filter(dictItem, function (item) {
            return item.charAt(0) == '0'
        });
        _this.groupDatas[saveGroupId].ORG_CONTROLER_INFO[0].FIELDS.CONTROLER_NAME.VALID_TYPE = 'valFirst[1,64]'

    },
    /*
     *@method bizProControllerNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-13 09:42:56
     */
    bizProControllerNodeAfterLoadBiz: function (_this) {
        let saveGroupId = _this.userType == "1" ? "RELA_INFO" : _this.userType == "2" ? "ORG_INFO" : "RELA_INFO";
        let groupId = "EQUITY_INFO";
        if (_.get(_this.oppBusiData.newBusiData, saveGroupId + ".ORG_CONTROLER_INFO", "")) {

            bizPublicMethod.$blMethod.parseMoudleArray(_this, _this.groupDatas[groupId]["ORG_CONTROLER_INFO"], _.get(_this.oppBusiData.newBusiData, saveGroupId + ".ORG_CONTROLER_INFO", []));
        }
    },
    /*
     *@method bizProControllerNodeBeforeSave
     *@desc 钩子函数 自定义保存数
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizProControllerNodeBeforeSave: async function (_this, params) {
        let isOpenAcct = _this.$storage.getJsonSession(_this.$definecfg.IS_OPEN_ACCT_BIZ);
        let saveGroupId = _this.userType == "1" ? "RELA_INFO" : _this.userType == "2" ? "ORG_INFO" : "RELA_INFO";

        let orgControlerInfo = bizPublicSaveMethod.getModuleArrFoyKey(_this, "ORG_CONTROLER_INFO", true);
        let originaControllerinfo = custInfoModel.getOriginaOrgControllerInfo(_this.oppBusiData.oldBusiData);
        let orgConrollerChangeInfo = bizPublicMethod.$blMethod.getArrDiff(
            orgControlerInfo, originaControllerinfo, "CONTROLER_NUM", "MODULE_RADIO_BUTTON"
        )

        let busiData = _this.oppBusiData.newBusiData;
        let orgInfo = busiData && busiData[saveGroupId] || {};

        orgInfo.ORG_CONTROLER_INFO = orgControlerInfo;
        if (isOpenAcct == "1") {
            orgInfo.ORG_CONTROLER_CHANGE_INFO = orgConrollerChangeInfo;
        }
        if (_this.userType == "1") {
            // 勾选了与本模块同步的模块,如果本模块数据改变了,同步的模块必须强制保存
            let moduleArr = [
                { moduleId: 'ORG_BENEFICIARY_OWNER_INFO', name: '受益所有人信息' },
                { moduleId: 'ORG_BENEFICIARY_INFO', name: _this.userType == "2" ? '产品受益人信息' : '受益人信息' }
            ]
            let syncFieldArr = ['CONTROLER_ID_EXP_DATE', 'CONTROLER_ID_NO', 'CONTROLER_ID_TYPE', 'CONTROLER_NAME'];
            params.TRAVEL = _this.historyData.TRAVEL;
            _.each(moduleArr, obj => {
                if (_this.groupDatas[saveGroupId][obj.moduleId][0].FIELDS.MODULE_RADIO_BUTTON.DEFAULT_VALUE == 'true') {
                    let isChange = false;
                    if (orgControlerInfo.length != (_this.historyData[saveGroupId]['ORG_CONTROLER_INFO'] && _this.historyData[saveGroupId]['ORG_CONTROLER_INFO'].length || 0)) {
                        isChange = true;
                    } else {
                        _.each(orgControlerInfo, (obj, index) => {
                            for (let i = 0; i < syncFieldArr.length; i++) {
                                let propName = syncFieldArr[i];
                                if (obj[propName] != _this.historyData[saveGroupId]['ORG_CONTROLER_INFO'][index][propName]) {
                                    isChange = true;
                                    return false;
                                }
                            }
                        })
                    }
                    if (isChange) {
                        let routerIndex = _this.$router.getRouteIndex(obj.name);
                        params.TRAVEL[routerIndex] && (params.TRAVEL[routerIndex].REJECT = "2");
                    }
                }
            })
        }
        params[saveGroupId] = params[saveGroupId]  || {}
        Object.assign(params[saveGroupId], orgInfo);
    },
    /*
     *@method bizProControllerNodeAfterSave
     *@desc 钩子函数 自定义保存数
     */
    bizProControllerNodeAfterSave: (_this, newData) => {
        let saveGroupId = _this.userType == "1" ? "RELA_INFO" : _this.userType == "2" ? "ORG_INFO" : "RELA_INFO";
        if (_this.oppBusiData.newBusiData) {
            let newObj = {
                [saveGroupId]: _.get(newData, saveGroupId, {})
            }
            _.assign(_this.oppBusiData.newBusiData, newObj);
        }
    },
    /*
     *@method bizProControllerNodeValidate
     *@desc 钩子函数 下一步验证
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizProControllerNodeValidate: function (_this) {
        let saveGroupId = "EQUITY_INFO";
        let idCodeList = _.map(_this.groupDatas[saveGroupId].ORG_CONTROLER_INFO, module => {
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
     *@method bizProControllerNodePageActivated
     *@desc 钩子函数：页面激活
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizProControllerNodePageActivated: function (_this, groupId) {

        let saveGroupId = "EQUITY_INFO";

        let fields = _this.groupDatas[saveGroupId].ORG_CONTROLER_INFO[0].FIELDS;
        fields.CONTROLER_ID_NO.promptValue = fields.CONTROLER_ID_NO.DEFAULT_VALUE;
        _this.groupDatas[saveGroupId]["ORG_CONTROLER_INFO"][0].FIELDS.CONTROLER_ID_NO.promptValue = _this.groupDatas[saveGroupId]["ORG_CONTROLER_INFO"][0].FIELDS.CONTROLER_ID_NO.DEFAULT_VALUE;

        _this.$refs.flowTip.flowTips = [];
        if (fields.CONTROLER_ID_EXP_DATE.DEFAULT_VALUE && date.compareDate(fields.CONTROLER_ID_EXP_DATE.DEFAULT_VALUE, date.getClientDate("yyyyMMdd")) == -1) {
            _this.pushFlowTip({
                title: "实际控制人证件有效截止日期[" + fields.CONTROLER_ID_EXP_DATE.DEFAULT_VALUE + "]小于当前系统日期[" + date.getClientDate("yyyyMMdd") + "]！",
                key: 'warningTip',
                type: 'warning'
            })
        }
        // 控制人信息模块只显示一个同步按钮,其他按钮需要隐藏
        if (_this.groupDatas[saveGroupId].ORG_CONTROLER_INFO.length > 1) {
            for (let i = 1; i < _this.groupDatas[saveGroupId].ORG_CONTROLER_INFO.length; i++) {
                _this.groupDatas[saveGroupId].ORG_CONTROLER_INFO[i].FIELDS.MODULE_RADIO_BUTTON && (_this.groupDatas[saveGroupId].ORG_CONTROLER_INFO[i].FIELDS.MODULE_RADIO_BUTTON.FIELD_CONTROL = '1');
                _this.groupDatas[saveGroupId].ORG_CONTROLER_INFO[i].FIELDS.MODULE_RADIO_BUTTON && (_this.groupDatas[saveGroupId].ORG_CONTROLER_INFO[i].FIELDS.MODULE_RADIO_BUTTON.FIELD_FUNCTION = '');
            }
        }
        _this.oppBusiData.isCheckFn = false;
        _this.oppBusiData.controlerChecked = false;
    },
    /**
     * 实际控制人
     * 
     * custBasicInfo 选择的是_this内部的，可以选择session内部的，或者_this.groupDatas里面的
     */
    CHECK_CONTROLER_RELATION: (_this, field, fieldData, moduleData) => {
        let old = _this.oppBusiData.newBusiData && _this.oppBusiData.newBusiData.ORG_CONTROLER_INFO;
        if (old && old.CONTROLER_RELATION && field.DEFAULT_VALUE == old.CONTROLER_RELATION) {
            fieldData["CONTROLER_NAME"].DEFAULT_VALUE = old && old.CONTROLER_NAME;
            fieldData["CONTROLER_ID_TYPE"].DEFAULT_VALUE = old && old.CONTROLER_ID_TYPE;
            fieldData["CONTROLER_ID_NO"].DEFAULT_VALUE = old && old.CONTROLER_ID_NO;
            fieldData["CONTROLER_ID_EXP_DATE"].DEFAULT_VALUE = old && old.CONTROLER_ID_EXP_DATE;
            fieldData["CONTROLER_ID_NO"].promptValue = old && old.CONTROLER_ID_NO;
        } else {
            for (let key in fieldData) {
                if (key != "CONTROLER_RELATION" && key !== "CONTROLER_NUM") {
                    fieldData[key].FIELD_CONTROL = "0";
                    fieldData[key].DEFAULT_VALUE = "";
                }
            }
        }
        if (field.DEFAULT_VALUE == "0Z") {
            moduleData.MODULE_READ = "0";
        } else {
            moduleData.MODULE_READ = "1";
        }

    },
    CHECK_CONTROLERINFO_ID_NO: (_this, field, fieldData) => {
        let saveGroupId = "EQUITY_INFO";
        if (field.DEFAULT_VALUE != "") {
            let repeatModule = _.filter(_this.groupDatas[saveGroupId].ORG_CONTROLER_INFO, module => {
                return module.FIELDS.CONTROLER_ID_NO.DEFAULT_VALUE == field.DEFAULT_VALUE;
            })
            if (repeatModule && repeatModule.length >= 2) {
                _this.$nextTick(() => {
                    _this.$blMethod.changeFieldError(field, false, "控制人证件号码已经存在，不能重复输入");
                })

            }

        }
        if (field.MODULE_ID != 'ORG_ACTUAL_CONTROLER_INFO') {
            syncModules(_this, field)

            syncValidate(_this, fieldData)
        }
    },
    CHECK_CONTROLERINFO_ID_TYPE: (_this, field, fieldData) => {
        _this.$blMethod.setValidType(_this, field, fieldData, "CONTROLER_ID_NO");
        fieldData.MODULE_RADIO_BUTTON && fieldData.MODULE_RADIO_BUTTON.DEFAULT_VALUE == "false" && (fieldData.CONTROLER_ID_NO.DEFAULT_VALUE = "");
        if (field.MODULE_ID != 'ORG_ACTUAL_CONTROLER_INFO') {
            syncModules(_this, field);
            syncValidate(_this, fieldData)
        }
    },
    CHECK_CONTROLER_NAME: (_this, field, fieldData) => {
        if (field.MODULE_ID != 'ORG_ACTUAL_CONTROLER_INFO') {
            syncModules(_this, field)
            syncValidate(_this, fieldData)
        }
    },
    CHECK_CONTROLER_ID_EXP_DATE: (_this, field, fieldData) => {
        syncModules(_this, field)
        syncValidate(_this, fieldData)
    },
    CHECK_CONTROLER_TEL: (_this, field, fieldData) => {
        syncModules(_this, field);
        syncValidate(_this, fieldData)
    },
    CONTROLLER_MODULE_customizeModule: (_this, moduleId, fieldData) => { },
    // 本模块添加模块完成时,需要同步到已经勾选同步本模块的模块信息
    PROCONTROLLER_ADD_MODULE_FINISHED: (_this, fieldData) => {
        syncModules(_this, fieldData.FIELDS.CONTROLER_ID_TYPE);
    },
    PROCONTROLLER_DELETE_MODULE_FINISHED: (_this, fieldData) => {
        _.each(_this.$refs, (item, key) => {
            if (key.indexOf("ORG_CONTROLER_INFO") > -1 && item.length > 0) {
                item[0].$refs.CONTROLER_ID_NO[0].field.message = "";
                item[0].$refs.CONTROLER_ID_NO[0].$refs.CONTROLER_ID_NO.validate("change");
            }
        })
        syncModules(_this, _this.groupDatas['EQUITY_INFO'].ORG_CONTROLER_INFO[0].FIELDS.CONTROLER_ID_TYPE);
    }

}
