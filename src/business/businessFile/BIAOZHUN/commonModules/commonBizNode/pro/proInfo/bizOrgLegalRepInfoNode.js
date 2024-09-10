/*
 *   法定代表人信息
 *   方法封装
 *   @author  yangyp
 */

import date from '../../../../../../../tools/date.js'
import * as utils from "../../../../../../../tools/util"
import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../businessTools/bizPublicMethod.js"
import custInfoModel from '../../common/cust-info-model.js'


//开户和非开户 字段数据加载 公共操作
const bizOrgLegalRepInfoBeforeLoadBizCommon = (_this) => {
    
}

const syncModules = (_this, field) => {
    if (field.BUSI_CODE == 'V9997') {
        let moduleGroupArr = [
            {groupId: 'EQUITY_INFO', moduleId: 'ORG_STOCKHOLDER_INFO'},
            {groupId: 'OTHER_INFO', moduleId: 'ORG_RESPONSIBLE_INFO'}
        ]
        _this.$blMethod.syncToOtherModule(_this, moduleGroupArr);
    } else if (field.BUSI_CODE == 'V9998') {
        let moduleGroupArr = [
            {groupId: 'EQUITY_INFO', moduleId: 'ORG_STOCKHOLDER_INFO'},
            {groupId: 'RELA_INFO', moduleId: 'ORG_RESPONSIBLE_INFO'},
            {groupId: 'EQUITY_INFO', moduleId: 'ORG_CONTROLER_INFO'}
        ]
        _this.$blMethod.syncToOtherModule(_this, moduleGroupArr);
    }
}

const syncValidate = (_this, fieldData) => {
    let saveGroupId = _this.userType == "1" ? "RELA_INFO" : _this.userType == "2" ? "MANAGER_INFO" : "RELA_INFO";
    let moduleArr = [
        {groupId:  "EQUITY_INFO", moduleId: 'ORG_STOCKHOLDER_INFO' , name: '控股股东信息'},
        {groupId:  _this.userType == "1" ? "RELA_INFO" : "OTHER_INFO",moduleId: 'ORG_RESPONSIBLE_INFO', name: '负责人信息'}
    ]
    if (_this.userType == '1') {
        moduleArr.push({groupId: "EQUITY_INFO", moduleId: 'ORG_CONTROLER_INFO', name: '实际控制人信息'})
    } 
    let radioChecked = false;
    let routerIndexArr = [];
    _.each(moduleArr, obj => {
        if (_this.groupDatas[obj.groupId][obj.moduleId][0].FIELDS.MODULE_RADIO_BUTTON.DEFAULT_VALUE == 'true') {
            routerIndexArr.push(_this.$router.getRouteIndex(obj.name))
            radioChecked = true;
        }
    })
    if (radioChecked) {
        let historyLegalRepInfo = _.get(_this.historyData, saveGroupId + '.ORG_LEGAL_REP_INFO', {});
        if (!_.isEmpty(historyLegalRepInfo)) {
            let isChange = false;
            _.each(historyLegalRepInfo, (value, key) => {
                if (value != fieldData[key].DEFAULT_VALUE) {
                    isChange = true;
                    return false;
                }
            })
            let travel = _this.historyData.TRAVEL;
            if (isChange && fieldData.LEGAL_REP_ID_CODE.DEFAULT_VALUE != '') {
                _this.oppBusiData.legalChecked = true;
            }
            if (_this.oppBusiData.legalChecked) {
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
     *@method bizOrgLegalRepInfoBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizOrgLegalRepInfoBeforeLoadBiz: function (_this) {
        bizOrgLegalRepInfoBeforeLoadBizCommon(_this)
        // 预约信息
        let APPT_INFO = _this.$definecfg.APPT_INFO && JSON.parse(_this.$storage.getSession(_this.$definecfg.APPT_INFO));
        !_.isEmpty(APPT_INFO) && bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["ORG_LEGAL_REP_INFO"], APPT_INFO.ORG_LEGAL_REP_INFO);

        var orgLegalRepInfo = custInfoModel.getOriginaOrgLegalRepInfo(_this.oppBusiData.oldBusiData);
        if( !_.isEmpty(orgLegalRepInfo)){
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["ORG_LEGAL_REP_INFO"], orgLegalRepInfo);      
        }

    },
    bizOrgLegalRepInfoBeforeLoadBizOpenAcct: function (_this) {
        bizOrgLegalRepInfoBeforeLoadBizCommon(_this)
    },
    /*
     *@method bizOrgLegalRepInfoAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-13 09:42:56
     */
    bizOrgLegalRepInfoAfterLoadBiz: function (_this) {
        let saveGroupId = _this.userType == "1" ? "RELA_INFO" : _this.userType == "2" ? "MANAGER_INFO" : "RELA_INFO";
        let groupId = _this.userType == "1" ? "ORG_INFO" : _this.userType == "2" ? "MANAGER_INFO" : "ORG_INFO";
        if (_.get(_this.oppBusiData.newBusiData, saveGroupId + ".ORG_LEGAL_REP_INFO", "") &&
            Object.keys(_this.oppBusiData.newBusiData[saveGroupId].ORG_LEGAL_REP_INFO).length) {
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["ORG_LEGAL_REP_INFO"], _this.oppBusiData.newBusiData[saveGroupId].ORG_LEGAL_REP_INFO);
        }
        let legalRepIdType = _.get(_this.groupDatas, groupId + ".ORG_LEGAL_REP_INFO[0].FIELDS.LEGAL_REP_ID_TYPE.DEFAULT_VALUE", "");
        showLegalClientView(_this, legalRepIdType);
        // 展示公安联网校验按钮
        _this.groupDatas[groupId].ORG_LEGAL_REP_INFO[0].MODULE_CUSTOMIZE = "1";
        _this.groupDatasTpl[groupId].ORG_LEGAL_REP_INFO[0].MODULE_CUSTOMIZE = "1";
        _this.oldGroupDatas[groupId].ORG_LEGAL_REP_INFO[0].MODULE_CUSTOMIZE = "1";
        _this.groupDatas[groupId].ORG_LEGAL_REP_INFO[0].MODULE_CUSTOMIZE_TXT = "公安联网校验";
        _this.groupDatasTpl[groupId].ORG_LEGAL_REP_INFO[0].MODULE_CUSTOMIZE_TXT = "公安联网校验";
        _this.oldGroupDatas[groupId].ORG_LEGAL_REP_INFO[0].MODULE_CUSTOMIZE_TXT = "公安联网校验";
    },
    /*
     *@method bizOrgLegalRepInfoBeforeSave
     *@desc 钩子函数 自定义保存数
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizOrgLegalRepInfoBeforeSave: function (_this, params) {
        let saveGroupId = _this.userType == "1" ? "RELA_INFO" : _this.userType == "2" ? "MANAGER_INFO" : "RELA_INFO",
            groupId = _this.userType == "1" ? "ORG_INFO" : _this.userType == "2" ? "MANAGER_INFO" : "ORG_INFO",
            orgLegalRepInfo = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "ORG_LEGAL_REP_INFO");
        let isOpenAcct = _this.$storage.getJsonSession(_this.$definecfg.IS_OPEN_ACCT_BIZ);
        let busiData = _this.oppBusiData.newBusiData;
        let managerInfo = busiData && busiData[saveGroupId] || {};
        managerInfo["ORG_LEGAL_REP_INFO"] = orgLegalRepInfo;

        if(isOpenAcct =="1") {
            let orgLegalRepDiffInfo = bizPublicMethod.$blMethod.compareInfo2(custInfoModel.getOriginaOrgLegalRepInfo(_this.oppBusiData.oldBusiData), orgLegalRepInfo, );
            managerInfo["ORG_LEGAL_REP_CHANGE_INFO"] = Object.assign({}, orgLegalRepInfo, {
                DIFF_INFO: orgLegalRepDiffInfo
            });
        }
        
        params.ORG_LEGAL_REP_INFO_TITLE = _this.groupDatas[groupId].ORG_LEGAL_REP_INFO[0].MODULE_TITLE;
        //委派代表
        if (!_this.oppBusiData.ORG_LEGAL_CLIENT_INFO_FLAG) {
            managerInfo.ORG_LEGAL_CLIENT_INFO = {};
            
            if(isOpenAcct =="1") {
                managerInfo.ORG_LEGAL_CLIENT_CHANGE_INFO = {
                    DIFF_INFO: [],
                }
            }
        }
        let moduleArr = [
            {groupId: 'EQUITY_INFO', moduleId: 'ORG_STOCKHOLDER_INFO', name: '控股股东信息'},
            {groupId:  _this.userType == "1" ? "RELA_INFO" : "OTHER_INFO",moduleId: 'ORG_RESPONSIBLE_INFO', name: '负责人信息'}
        ]
        if (_this.userType == '1') {
            moduleArr.push({groupId: 'EQUITY_INFO', moduleId: 'ORG_CONTROLER_INFO', name: '实际控制人信息'})
        } 
        params.TRAVEL = _this.historyData.TRAVEL;
        _.each(moduleArr, obj => {
            if (_this.groupDatas[obj.groupId][obj.moduleId][0].FIELDS.MODULE_RADIO_BUTTON.DEFAULT_VALUE == 'true') {
                let isChange = false;
                _.each(orgLegalRepInfo, (value, key) => {
                    console.log(value)
                    if (_this.historyData[saveGroupId]['ORG_LEGAL_REP_INFO'] && value != _this.historyData[saveGroupId]['ORG_LEGAL_REP_INFO'][key]) {
                        isChange = true;
                    }
                })
                if (isChange) {
                    let routerIndex = _this.$router.getRouteIndex(obj.name);
                    params.TRAVEL[routerIndex] && (params.TRAVEL[routerIndex].REJECT = "2");
                }
            }
        })
        params[saveGroupId] = params[saveGroupId] || {}
        Object.assign(params[saveGroupId], managerInfo);
        Object.assign(params[groupId], busiData[groupId]);
    },
    /*
     *@method bizOrgLegalRepInfoAfterSave
     *@desc 钩子函数 自定义保存数
     */
    bizOrgLegalRepInfoAfterSave: (_this, newData) => {
        let saveGroupId = _this.userType == "1" ? "RELA_INFO" : _this.userType == "2" ? "MANAGER_INFO" : "RELA_INFO";
        if (_this.oppBusiData.newBusiData) {
            let newObj = {
                [saveGroupId]: _.get(newData, saveGroupId, {})
            }
            _.assign(_this.oppBusiData.newBusiData, newObj);
        }
    },
    /*
     *@method bizOrgLegalRepInfoValidate
     *@desc 钩子函数 下一步验证
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizOrgLegalRepInfoValidate: function (_this) {
      
    },

    /*
     *@method bizOrgLegalRepInfoPageActivated
     *@desc 钩子函数：页面激活
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizOrgLegalRepInfoPageActivated: function (_this) {
        let saveGroupId = _this.userType == "1" ? "ORG_INFO" : _this.userType == "2" ? "MANAGER_INFO" : "ORG_INFO",
            legalRepType = _this.userType == "1" ? _this.groupDatas.ORG_INFO.ORG_BASIC_INFO[0].FIELDS.LEGAL_REP_TYPE.DEFAULT_VALUE : _this.groupDatas.MANAGER_INFO.MANAGER_BASIC_INFO[0].FIELDS.LEGAL_REP_TYPE.DEFAULT_VALUE;
        //过滤证件类型
        let dictItem = _this["oppBusiData"]["VALID_ID_TYPE_FOR_BOTH"] || _.map(_this.groupDatas[saveGroupId].ORG_LEGAL_REP_INFO[0].FIELDS.LEGAL_REP_ID_TYPE.FIELD_DICT_NAME, 'DICT_ITEM')
        //管理人信息法人类型为08 则不用过滤 不为08则过滤非个人证件类型
        if (legalRepType != "08") {
            _this.groupDatas[saveGroupId].ORG_LEGAL_REP_INFO[0].FIELDS.LEGAL_REP_ID_TYPE.FIELD_DICT_FILTER = _.filter(dictItem, function (item) {
                return item.charAt(0) == '0'
            })
        } else {
            _this.groupDatas[saveGroupId].ORG_LEGAL_REP_INFO[0].FIELDS.LEGAL_REP_ID_TYPE.FIELD_DICT_FILTER = dictItem;
        }
        if (_this.userType == "1") {
            if (legalRepType == '08') {
                _this.groupDatas[saveGroupId].ORG_LEGAL_REP_INFO[0].MODULE_TITLE = "执行事务合伙人信息";
                _this.groupDatas.EQUITY_INFO.ORG_STOCKHOLDER_INFO[0].FIELDS.MODULE_RADIO_BUTTON.FIELD_TITLE = "与执行事务合伙人信息一致"
                _this.groupDatas.RELA_INFO.ORG_RESPONSIBLE_INFO[0].FIELDS.MODULE_RADIO_BUTTON.FIELD_TITLE = "与执行事务合伙人信息一致"
                _this.groupDatas.EQUITY_INFO.ORG_CONTROLER_INFO[0].FIELDS.MODULE_RADIO_BUTTON.FIELD_TITLE = "与执行事务合伙人信息一致"
                _this.oldGroupDatas.EQUITY_INFO.ORG_STOCKHOLDER_INFO[0].FIELDS.MODULE_RADIO_BUTTON.FIELD_TITLE = "与执行事务合伙人信息一致"
                _this.oldGroupDatas.RELA_INFO.ORG_RESPONSIBLE_INFO[0].FIELDS.MODULE_RADIO_BUTTON.FIELD_TITLE = "与执行事务合伙人信息一致"
                _this.oldGroupDatas.EQUITY_INFO.ORG_CONTROLER_INFO[0].FIELDS.MODULE_RADIO_BUTTON.FIELD_TITLE = "与执行事务合伙人信息一致"
                _this.groupDatasTpl.EQUITY_INFO.ORG_STOCKHOLDER_INFO[0].FIELDS.MODULE_RADIO_BUTTON.FIELD_TITLE = "与执行事务合伙人信息一致"
                _this.groupDatasTpl.RELA_INFO.ORG_RESPONSIBLE_INFO[0].FIELDS.MODULE_RADIO_BUTTON.FIELD_TITLE = "与执行事务合伙人信息一致"
                _this.groupDatasTpl.EQUITY_INFO.ORG_CONTROLER_INFO[0].FIELDS.MODULE_RADIO_BUTTON.FIELD_TITLE = "与执行事务合伙人信息一致"
            } else {
                if (!_this.groupDatas[saveGroupId].ORG_LEGAL_REP_INFO[0].FIELDS.LEGAL_REP_ID_TYPE.FIELD_DICT_FILTER.includes(_this.groupDatas[saveGroupId].ORG_LEGAL_REP_INFO[0].FIELDS.LEGAL_REP_ID_TYPE.DEFAULT_VALUE)) {
                    _this.groupDatas[saveGroupId].ORG_LEGAL_REP_INFO[0].FIELDS.LEGAL_REP_ID_TYPE.DEFAULT_VALUE = '';
                }
                _this.groupDatas[saveGroupId].ORG_LEGAL_REP_INFO[0].MODULE_TITLE = "法定代表人信息"
                _this.groupDatas.EQUITY_INFO.ORG_STOCKHOLDER_INFO[0].FIELDS.MODULE_RADIO_BUTTON.FIELD_TITLE = "与法定代表人信息一致"
                _this.oldGroupDatas.EQUITY_INFO.ORG_STOCKHOLDER_INFO[0].FIELDS.MODULE_RADIO_BUTTON.FIELD_TITLE = "与法定代表人信息一致"
                _this.groupDatasTpl.EQUITY_INFO.ORG_STOCKHOLDER_INFO[0].FIELDS.MODULE_RADIO_BUTTON.FIELD_TITLE = "与法定代表人信息一致"
                _this.groupDatas.RELA_INFO.ORG_RESPONSIBLE_INFO[0].FIELDS.MODULE_RADIO_BUTTON.FIELD_TITLE = "与法定代表人信息一致"
                _this.oldGroupDatas.RELA_INFO.ORG_RESPONSIBLE_INFO[0].FIELDS.MODULE_RADIO_BUTTON.FIELD_TITLE = "与法定代表人信息一致"
                _this.groupDatasTpl.RELA_INFO.ORG_RESPONSIBLE_INFO[0].FIELDS.MODULE_RADIO_BUTTON.FIELD_TITLE = "与法定代表人信息一致"
                _this.groupDatas.EQUITY_INFO.ORG_CONTROLER_INFO[0].FIELDS.MODULE_RADIO_BUTTON.FIELD_TITLE = "与法定代表人信息一致"
                _this.oldGroupDatas.EQUITY_INFO.ORG_CONTROLER_INFO[0].FIELDS.MODULE_RADIO_BUTTON.FIELD_TITLE = "与法定代表人信息一致"
                _this.groupDatasTpl.EQUITY_INFO.ORG_CONTROLER_INFO[0].FIELDS.MODULE_RADIO_BUTTON.FIELD_TITLE = "与法定代表人信息一致"
            }
        } else if (_this.userType == "2") {
            if (!(legalRepType == '08')) {
                if (!_this.groupDatas[saveGroupId].ORG_LEGAL_REP_INFO[0].FIELDS.LEGAL_REP_ID_TYPE.FIELD_DICT_FILTER.includes(_this.groupDatas[saveGroupId].ORG_LEGAL_REP_INFO[0].FIELDS.LEGAL_REP_ID_TYPE.DEFAULT_VALUE)) {
                    _this.groupDatas[saveGroupId].ORG_LEGAL_REP_INFO[0].FIELDS.LEGAL_REP_ID_TYPE.DEFAULT_VALUE = '';
                }
            }
        }

        _this.groupDatas[saveGroupId].ORG_LEGAL_REP_INFO[0].FIELDS.LEGAL_REP_ID_CODE.promptValue = _this.groupDatas[saveGroupId].ORG_LEGAL_REP_INFO[0].FIELDS.LEGAL_REP_ID_CODE.DEFAULT_VALUE;
        _this.oppBusiData.legalChecked = false;
    },

    bizOrgLegalRepInfoPreValidate: function(_this) {
    },
    //----------------------业务函数----------------------------------//
    //职业选择
    CHECK_LEGAL_REP_POSITION: (_this, field, fieldData) => {
        let defaultValue = field.DEFAULT_VALUE || "";
        //其他类型 则显示手输职业字段
        if (defaultValue == "Z") {
            fieldData.LEGAL_REP_POSITION_PATION.FIELD_CONTROL = "0";
        } else {
            fieldData.LEGAL_REP_POSITION_PATION.DEFAULT_VALUE = "";
            fieldData.LEGAL_REP_POSITION_PATION.FIELD_CONTROL = "1";
        }
    },
    //证件类型
    CHECK_LEGAL_REP_ID_TYPE: (_this, field, fieldData) => {
        let defaultValue = field.DEFAULT_VALUE || "";
        _this.$blMethod.setValidType(_this, field, fieldData, "LEGAL_REP_ID_CODE")
        fieldData.LEGAL_REP_ID_CODE.DEFAULT_VALUE = '';
        showLegalClientView(_this, defaultValue);
        let isCustFlag = false;
        // 法定代表人的证件类型是否为个人证件类型
        if (field.DEFAULT_VALUE && field.DEFAULT_VALUE.charAt(0) == "0") {
            isCustFlag = true;
        }
        if (!isCustFlag) {// 若执行事务合伙人为机构，则勾选框去掉
            if (_this.userType == "1") {
                if (_this.groupDatas.EQUITY_INFO && _this.groupDatas.EQUITY_INFO.ORG_CONTROLER_INFO) {
                    let fieldData = _this.groupDatas.EQUITY_INFO.ORG_CONTROLER_INFO[0].FIELDS;
                    fieldData.MODULE_RADIO_BUTTON.FIELD_CONTROL = '1';
                    fieldData.MODULE_RADIO_BUTTON.DEFAULT_VALUE = 'false';
                    fieldData.CONTROLER_NAME.FIELD_CONTROL = "0";
                    fieldData.CONTROLER_ID_NO.FIELD_CONTROL = "0";
                    fieldData.CONTROLER_ID_TYPE.FIELD_CONTROL = "0";
                    fieldData.CONTROLER_ID_EXP_DATE.FIELD_CONTROL = "0"
                }
                if (_this.groupDatas.RELA_INFO && _this.groupDatas.RELA_INFO.ORG_RESPONSIBLE_INFO) {
                    let fieldData = _this.groupDatas.RELA_INFO.ORG_RESPONSIBLE_INFO[0].FIELDS;
                    fieldData.MODULE_RADIO_BUTTON.FIELD_CONTROL = '1';
                    fieldData.MODULE_RADIO_BUTTON.DEFAULT_VALUE = 'false';
                    fieldData.RESPONSIBILITY_REP.FIELD_CONTROL = "0";
                    fieldData.RESPONSIBILITY_REP_ID_CODE.FIELD_CONTROL = "0";
                    fieldData.RESPONSIBILITY_REP_ID_TYPE.FIELD_CONTROL = "0";
                    fieldData.RESPONSIBILITY_REP_ID_EXP_DATE.FIELD_CONTROL = "0"
                }
            } 
            if (_this.userType == '2') {
                if (_this.groupDatas.MANAGER_INFO && _this.groupDatas.MANAGER_INFO.ORG_RESPONSIBLE_INFO) {
                    let fieldData = _this.groupDatas.MANAGER_INFO.ORG_RESPONSIBLE_INFO[0].FIELDS;
                    fieldData.MODULE_RADIO_BUTTON.FIELD_CONTROL = '1';
                    fieldData.MODULE_RADIO_BUTTON.DEFAULT_VALUE = 'false';
                    fieldData.RESPONSIBILITY_REP.FIELD_CONTROL = '0';
                    fieldData.RESPONSIBILITY_REP_ID_CODE.FIELD_CONTROL = '0';
                    fieldData.RESPONSIBILITY_REP_ID_TYPE.FIELD_CONTROL = '0';
                    fieldData.RESPONSIBILITY_REP_ID_EXP_DATE.FIELD_CONTROL = '0';
                }
            }
        } else {
            if (_this.userType == "1") {
                if (_this.groupDatas.EQUITY_INFO && _this.groupDatas.EQUITY_INFO.ORG_CONTROLER_INFO) {
                    _this.groupDatas.EQUITY_INFO.ORG_CONTROLER_INFO[0].FIELDS.MODULE_RADIO_BUTTON.FIELD_CONTROL = '0';
                }
                if (_this.groupDatas.RELA_INFO && _this.groupDatas.RELA_INFO.ORG_RESPONSIBLE_INFO) {
                    _this.groupDatas.RELA_INFO.ORG_RESPONSIBLE_INFO[0].FIELDS.MODULE_RADIO_BUTTON.FIELD_CONTROL = '0';
                }
            } 
            if (_this.userType == '2') {
                if (_this.groupDatas.MANAGER_INFO && _this.groupDatas.MANAGER_INFO.ORG_RESPONSIBLE_INFO) {
                    _this.groupDatas.MANAGER_INFO.ORG_RESPONSIBLE_INFO[0].FIELDS.MODULE_RADIO_BUTTON.FIELD_CONTROL = '0';
                }
            }
        }
        syncModules(_this, field);
        syncValidate(_this, fieldData);
    },
    CHECK_LEGAL_REP_ID_CODE: (_this, field, fieldData) => {
        syncModules(_this, field);
        syncValidate(_this, fieldData)
    },
    // 名称
    CHECK_LEGAL_REP: (_this, field, fieldData) => {
        syncModules(_this, field);
        syncValidate(_this, fieldData);
    },

    // 证件有效期
    CHECK_LEGAL_REP_ID_EXP_DATE: (_this, field, fieldData) => {
        syncModules(_this, field);
        syncValidate(_this, fieldData);
    }
}
/**
 * 是否显示委派代表信息
 */
const showLegalClientView = (_this, idType) => {
    let groupId = _this.userType == "1" ? "ORG_INFO" : "MANAGER_INFO";
    _this.oppBusiData.ORG_LEGAL_CLIENT_INFO_FLAG = false;
    let SHOW_LEGAL_CLIENT = (_this.$blMethod.getJsonSessionBusiCommParam(_this, "SHOW_LEGAL_CLIENT") || "1") == "1";
    if (SHOW_LEGAL_CLIENT && idType && idType.charAt(0) != "0") {
        _this.groupDatas[groupId].ORG_LEGAL_CLIENT_INFO[0].MODULE_CONTROL = "1";
        _this.oppBusiData.ORG_LEGAL_CLIENT_INFO_FLAG = true;
    } else {
        _this.groupDatas[groupId].ORG_LEGAL_CLIENT_INFO[0].MODULE_CONTROL = "0";
    }
}
