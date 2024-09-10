/*
 *   产品份额登记机构信息模块
 *   方法封装
 *   @author  lindw
 */

import date from '../../../../../../../tools/date.js'
import * as utils from "../../../../../../../tools/util"
import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../../business/businessTools/bizPublicMethod.js"
import custInfoModel from '../../common/cust-info-model.js'

const changeRequired = (_this, field, fieldData) => {
    if (field.DEFAULT_VALUE != "") {
        fieldData.SHAREREG_ORG.FIELD_REQUIRED = "1";
        fieldData.SHAREREG_ORG_ID_CODE.FIELD_REQUIRED = "1";
        fieldData.SHAREREG_ORG_ID_TYPE.FIELD_REQUIRED = "1";
        fieldData.SHAREREG_ORG_TYPE.FIELD_REQUIRED = "1";
    } else {
        let required = false;
        _.each(fieldData, function (item) {
            if (item.DEFAULT_VALUE != "") {
                required = true;
            }
        })
        if (!required) {
            fieldData.SHAREREG_ORG.FIELD_REQUIRED = "0";
            fieldData.SHAREREG_ORG_ID_CODE.FIELD_REQUIRED = "0";
            fieldData.SHAREREG_ORG_ID_TYPE.FIELD_REQUIRED = "0";
            fieldData.SHAREREG_ORG_TYPE.FIELD_REQUIRED = "0";
        }
    }
}

export default {
    bizProShareRegOrgInfoBeforeLoadBiz: (_this) => {
        var proShareRegOrgInfo = custInfoModel.getOriginaShareRegOrgInfo(_this.oppBusiData.oldBusiData);
        if (!_.isEmpty(proShareRegOrgInfo)) {
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["PRO_SHAREREG_ORG_INFO"], proShareRegOrgInfo);
        }
        _this.groupDatas.RELA_INFO.PRO_SHAREREG_ORG_INFO[0].FIELDS.SHAREREG_ORG_ID_TYPE.FIELD_FUNCTION_CHANGE = "CHANGE_SHAREREG_ORG_ID_TYPE";
        _this.groupDatas.RELA_INFO.PRO_SHAREREG_ORG_INFO[0].FIELDS.SHAREREG_ORG_ID_CODE.FIELD_FUNCTION_CHANGE = "CHANGE_SHAREREG_ORG_ID_CODE";
        _this.groupDatas.RELA_INFO.PRO_SHAREREG_ORG_INFO[0].FIELDS.SHAREREG_ORG_TYPE.FIELD_FUNCTION_CHANGE = "CHANGE_SHAREREG_ORG_TYPE";
        _this.groupDatas.RELA_INFO.PRO_SHAREREG_ORG_INFO[0].FIELDS.SHAREREG_ORG.FIELD_FUNCTION_CHANGE = "CHANGE_SHAREREG_ORG";
    },
    bizProShareRegOrgInfoAfterLoadBiz: (_this) => {
        if (_this.oppBusiData.newBusiData && _this.oppBusiData.newBusiData.RELA_INFO && _this.oppBusiData.newBusiData.RELA_INFO.PRO_SHAREREG_ORG_INFO) {
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["PRO_SHAREREG_ORG_INFO"], _this.oppBusiData.newBusiData.RELA_INFO.PRO_SHAREREG_ORG_INFO);
        }
    },
    bizProShareRegOrgInfoPageActived: (_this) => {
        // 字段设置
        let fieldData = _this.groupDatas.RELA_INFO.PRO_SHAREREG_ORG_INFO[0]["FIELDS"];
        fieldData.SHAREREG_ORG_ID_CODE.VALID_TYPE = "charMinus[0,32]|on-blur"
        fieldData.SHAREREG_ORG_ID_TYPE.FIELD_CLEARABLE = true;
        fieldData.SHAREREG_ORG_TYPE.FIELD_CLEARABLE = true;
        //过滤证件类型
        let dictItem = _this["oppBusiData"]["VALID_ID_TYPE_FOR_BOTH"]
        fieldData.SHAREREG_ORG_ID_TYPE.FIELD_DICT_FILTER = _.filter(dictItem, function (item) {
            return item.charAt(0) != '0'
        })
        _this.groupDatas.RELA_INFO.PRO_SHAREREG_ORG_INFO[0].FIELDS.SHAREREG_ORG_ID_TYPE.FIELD_FUNCTION_CHANGE = "CHANGE_SHAREREG_ORG_ID_TYPE";
        _this.groupDatas.RELA_INFO.PRO_SHAREREG_ORG_INFO[0].FIELDS.SHAREREG_ORG_ID_CODE.FIELD_FUNCTION_CHANGE = "CHANGE_SHAREREG_ORG_ID_CODE";
        _this.groupDatas.RELA_INFO.PRO_SHAREREG_ORG_INFO[0].FIELDS.SHAREREG_ORG_TYPE.FIELD_FUNCTION_CHANGE = "CHANGE_SHAREREG_ORG_TYPE";
        _this.groupDatas.RELA_INFO.PRO_SHAREREG_ORG_INFO[0].FIELDS.SHAREREG_ORG.FIELD_FUNCTION_CHANGE = "CHANGE_SHAREREG_ORG";
    },
    bizProShareRegOrgInfoValidate: (_this) => {
        //todo
        let fieldData = _this.groupDatas.RELA_INFO.PRO_SHAREREG_ORG_INFO[0]["FIELDS"];
        let isAllEmpty = true,
            isNotCompletion = false;
        _.each(fieldData, function (item) {
            if (item.DEFAULT_VALUE != "") {
                isAllEmpty = false;
            };
            if (item.DEFAULT_VALUE == "") {
                isNotCompletion = true;
            }
        })
        if (!isAllEmpty && isNotCompletion) {
            _this.messageBox({
                hasMask: true,
                messageText: "如有份额登记机构信息，请填写完整！",
                confirmButtonText: '确定',
                typeMessage: 'warn',
                showMsgBox: true,
            });
            return false;
        }
    },
    bizProShareRegOrgInfoBeforeSave: (_this, params) => {
        let busiData = _this.oppBusiData.newBusiData;
        let isOpenAcct = _this.$storage.getJsonSession(_this.$definecfg.IS_OPEN_ACCT_BIZ);
        let relaInfo = busiData && busiData.RELA_INFO || {},
            proShareRegOrgInfo = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "PRO_SHAREREG_ORG_INFO");
        relaInfo.PRO_SHAREREG_ORG_INFO = proShareRegOrgInfo;
        if (isOpenAcct == "1") {
            var proShareRegOrgDiffInfo = bizPublicMethod.$blMethod.compareInfo2(custInfoModel.getOriginaShareRegOrgInfo(_this.oppBusiData.oldBusiData), proShareRegOrgInfo);
            relaInfo.PRO_SHAREREG_ORG_CHANGE_INFO = Object.assign({}, proShareRegOrgInfo, {
                DIFF_INFO: proShareRegOrgDiffInfo
            })
        }

        Object.assign(params.RELA_INFO, relaInfo);
    },
    //====================================字段关联逻辑====================================//
    "CHECK_SHAREREG_ORG_ID_TYPE": (_this, field, fieldData) => {
        if (field.DEFAULT_VALUE != "") {
            _this.$blMethod.setValidType(_this, field, fieldData, "SHAREREG_ORG_ID_CODE")
            fieldData.SHAREREG_ORG_ID_CODE.DEFAULT_VALUE = "";
        }
    },
    "CHANGE_SHAREREG_ORG_ID_TYPE":(_this, field, fieldData) => {
       changeRequired(_this,field,fieldData);
    },
    "CHANGE_SHAREREG_ORG_ID_CODE":(_this, field, fieldData) => {
        changeRequired(_this,field,fieldData);
     },
     "CHANGE_SHAREREG_ORG_TYPE":(_this, field, fieldData) => {
        changeRequired(_this,field,fieldData);
     },
     "CHANGE_SHAREREG_ORG": (_this, field, fieldData)  => {
        changeRequired(_this,field,fieldData);
     }

}
