/*
 *   控股股东信息
 *   方法封装
 */

import date from '../../../../../../../tools/date.js'
import * as utils from "../../../../../../../tools/util"
import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../businessTools/bizPublicMethod.js"
import custInfoModel from '../../common/cust-info-model.js'


//开户和非开户 字段数据加载 公共操作
const bizProStockholderInfoBeforeLoadBizCommon = (_this) => {
}

const getValidIdType = (_this) => {
    let custIdTypeArr =  _.concat(_this.oppBusiData.VALID_ID_TYPE_FOR_PERSON, _this.oppBusiData.VALID_ID_TYPE_FOR_ORG);
    let idTypeData = _this.groupDatas.EQUITY_INFO.ORG_STOCKHOLDER_INFO[0].FIELDS.CONTROLLER_ID_TYPE.FIELD_DICT_NAME;
    return _.filter(idTypeData, function (v) {
        var str = v.dict_val || v.DICT_ITEM;
        return _.indexOf(custIdTypeArr, str) != -1;
    });
}

export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizProStockholderInfoBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizProStockholderInfoBeforeLoadBiz: function (_this) {
        bizProStockholderInfoBeforeLoadBizCommon(_this)
        let saveGroupId = "EQUITY_INFO";
        // 预约信息
        let APPT_INFO = _this.$definecfg.APPT_INFO && JSON.parse(_this.$storage.getSession(_this.$definecfg.APPT_INFO));
        if(!_.isEmpty(APPT_INFO) && APPT_INFO.ORG_STOCKHOLDER_INFO && APPT_INFO.ORG_STOCKHOLDER_INFO.length) {
            bizPublicMethod.$blMethod.parseMoudleArray(_this, _this.groupDatas[saveGroupId]["ORG_STOCKHOLDER_INFO"], APPT_INFO.ORG_STOCKHOLDER_INFO);
        }

        var orgStockholderInfo = custInfoModel.getOriginaOrgStockholderInfo(_this.oppBusiData.oldBusiData)
        if (!_.isEmpty(orgStockholderInfo)) {
            bizPublicMethod.$blMethod.parseMoudleArray(_this, _this.groupDatas[saveGroupId]["ORG_STOCKHOLDER_INFO"], orgStockholderInfo);
        }
    },
    bizProStockholderInfoBeforeLoadBizOpenAcct: function (_this) {
    },
    /*
     *@method bizProStockholderInfoAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-13 09:42:56
     */
    bizProStockholderInfoAfterLoadBiz: function (_this) {
        let saveGroupId = _this.userType == "1" ? "RELA_INFO" : _this.userType == "2" ? "MANAGER_INFO" : "RELA_INFO";
        let groupId = "EQUITY_INFO";
        if (_.get(_this.oppBusiData.newBusiData, saveGroupId + ".ORG_STOCKHOLDER_INFO", "")) {
            bizPublicMethod.$blMethod.parseMoudleArray(_this, _this.groupDatas[groupId]["ORG_STOCKHOLDER_INFO"], _.get(_this.oppBusiData.newBusiData, saveGroupId + ".ORG_STOCKHOLDER_INFO", []));
        }
    },

    /*
     *@method bizProStockholderInfoBeforeSave
     *@desc 钩子函数 自定义保存数
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizProStockholderInfoBeforeSave: function (_this, params) {
        let orgStockholderInfo = bizPublicSaveMethod.getModuleArrFoyKey(_this, "ORG_STOCKHOLDER_INFO", true),
            saveGroupId = _this.userType == "1" ? "RELA_INFO" : _this.userType == "2" ? "MANAGER_INFO" : "RELA_INFO";
        let isOpenAcct = _this.$storage.getJsonSession(_this.$definecfg.IS_OPEN_ACCT_BIZ);

        let busiData = _this.oppBusiData.newBusiData;
        let managerInfo = busiData && busiData[saveGroupId] || {};
        managerInfo.ORG_STOCKHOLDER_INFO = orgStockholderInfo;

        if (isOpenAcct == "1") {
            var orgStockholderChangeInfo = bizPublicMethod.$blMethod.getArrDiff(orgStockholderInfo, custInfoModel.getOriginaOrgStockholderInfo(_this.oppBusiData.oldBusiData), "CONTROLLER_NO", "MODULE_RADIO_BUTTON")
            managerInfo.ORG_STOCKHOLDER_CHANGE_INFO = orgStockholderChangeInfo

        }

        params[saveGroupId] = params[saveGroupId] || {};
        Object.assign(params[saveGroupId], managerInfo);
    },
    /*
     *@method bizProStockholderInfoAfterSave
     *@desc 钩子函数 自定义保存数
     */
    bizProStockholderInfoAfterSave: (_this, newData) => {
        let saveGroupId = _this.userType == "1" ? "RELA_INFO" : _this.userType == "2" ? "MANAGER_INFO" : "RELA_INFO";
        if (_this.oppBusiData.newBusiData) {
            let newObj = {
                [saveGroupId]: _.get(newData, saveGroupId, {})
            }
            _.assign(_this.oppBusiData.newBusiData, newObj);
        }
    },
    /*
     *@method bizProStockholderInfoValidate
     *@desc 钩子函数 下一步验证
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizProStockholderInfoValidate: function (_this) {
        let saveGroupId = "EQUITY_INFO";
        let idCodeList = _.map(_this.groupDatas[saveGroupId].ORG_STOCKHOLDER_INFO, module => {
            return module.FIELDS.CONTROLLER_ID_CODE.DEFAULT_VALUE;
        })
        if (idCodeList.length > _.uniq(idCodeList).length) {
            _this.messageBox({
                hasMask: true,
                messageText: "控股股东证件号码已经存在，不能重复输入",
                confirmButtonText: '确定',
                typeMessage: 'warn',
                showMsgBox: true,
            });
            return false;
        }
    },

    /*
     *@method bizProStockholderInfoPageActivated
     *@desc 钩子函数：页面激活
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizProStockholderInfoPageActivated: function (_this) {
        //过滤证件类型
        let saveGroupId = "EQUITY_INFO";
        _this.groupDatas[saveGroupId].ORG_STOCKHOLDER_INFO[0].FIELDS.CONTROLLER_ID_CODE.promptValue = _this.groupDatas[saveGroupId].ORG_STOCKHOLDER_INFO[0].FIELDS.CONTROLLER_ID_CODE.DEFAULT_VALUE;

        if (_this.groupDatas[saveGroupId].ORG_STOCKHOLDER_INFO.length > 1) {
            for(let i = 1; i < _this.groupDatas[saveGroupId].ORG_STOCKHOLDER_INFO.length; i++) {
                _this.groupDatas[saveGroupId].ORG_STOCKHOLDER_INFO[i].FIELDS.MODULE_RADIO_BUTTON && (_this.groupDatas[saveGroupId].ORG_STOCKHOLDER_INFO[i].FIELDS.MODULE_RADIO_BUTTON.FIELD_CONTROL = "1");
                _this.groupDatas[saveGroupId].ORG_STOCKHOLDER_INFO[i].FIELDS.MODULE_RADIO_BUTTON && (_this.groupDatas[saveGroupId].ORG_STOCKHOLDER_INFO[i].FIELDS.MODULE_RADIO_BUTTON.FIELD_FUNCTION = "");
            }
        }
        _this.oppBusiData.isCheckFn = false;
        let data = getValidIdType(_this)
        // 设置证件类型字典有效证件类型
        _this.groupDatas[saveGroupId].ORG_STOCKHOLDER_INFO[0].FIELDS.CONTROLLER_ID_TYPE.FIELD_DICT_NAME = data;
        // // 设置证件类型字典有效证件类型
        // _this.groupDatas[saveGroupId].ORG_STOCKHOLDER_INFO[0].FIELDS.CONTROLLER_ID_TYPE.FIELD_DICT_NAME = _.filter(data, function (v) {
        //     return '0' == v.DICT_ITEM.charAt(0);
        // });
    },

    bizProStockholderInfoPreValidate: function (_this) {},
    //----------------------业务函数----------------------------------//
    CHECK_CONTROLLER_ID_TYPE: (_this, field, fieldData) => {
        _this.$blMethod.setValidType(_this, field, fieldData, "CONTROLLER_ID_CODE");
        fieldData.MODULE_RADIO_BUTTON.DEFAULT_VALUE == "false" && (fieldData.CONTROLLER_ID_CODE.DEFAULT_VALUE = "")
    },
    CHECK_CONTROLLER_ID_CODE: (_this, field, fieldData) => {
        if (field.DEFAULT_VALUE != "") {
            let saveGroupId = "EQUITY_INFO";
            let repeatModule = _.filter(_this.groupDatas[saveGroupId].ORG_STOCKHOLDER_INFO, module => {
                return module.FIELDS.CONTROLLER_ID_CODE.DEFAULT_VALUE == field.DEFAULT_VALUE;
            })
            if (repeatModule && repeatModule.length >= 2) {
                _this.$nextTick( ()=> {
                    _this.$blMethod.changeFieldError(field, false, "控股股东证件号码已经存在，不能重复输入");
                })
                
                return
            }
        }
    },
    STOCKHOLDERINFO_DELETE_MODULE_FINISHED: (_this, fieldData) => {
        _.each(_this.$refs, (item, key) => {
            if (key.indexOf("ORG_STOCKHOLDER_INFO") > -1 && item.length > 0) {
                item[0].$refs.CONTROLLER_ID_CODE[0].field.message = "";
                item[0].$refs.CONTROLLER_ID_CODE[0].$refs.CONTROLLER_ID_CODE.validate("change");
            }
        })
    }
}
