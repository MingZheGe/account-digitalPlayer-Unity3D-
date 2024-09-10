/*
 *   产品投资顾问模块
 *   方法封装
 *   @author  lindw
 */

import date from '../../../../../../../tools/date.js'
import * as utils from "../../../../../../../tools/util"
import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../../business/businessTools/bizPublicMethod.js"
import custInfoModel from '../../common/cust-info-model.js'

export default {
    bizProInvestAdviserInfoBeforeLoadBiz: (_this) => {

        var proInvestAdviserInfo = custInfoModel.getOriginaProInvestAdviserInfo(_this.oppBusiData.oldBusiData)
        if (!_.isEmpty(proInvestAdviserInfo)) {
            _this.groupDatas.RELA_INFO.HAS_INVEST_ADVISER[0].FIELDS.HAS_INVEST_ADVISER.DEFAULT_VALUE = "1"
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["PRO_INVEST_ADVISER_INFO"], proInvestAdviserInfo);
        } else {
            _this.groupDatas.RELA_INFO.HAS_INVEST_ADVISER[0].FIELDS.HAS_INVEST_ADVISER.DEFAULT_VALUE = "0"
        }
    },
    bizProInvestAdviserInfoAfterLoadBiz: (_this) => {
        if(_this.oppBusiData.newBusiData && _this.oppBusiData.newBusiData.RELA_INFO && _this.oppBusiData.newBusiData.RELA_INFO.PRO_INVEST_ADVISER_INFO) {
            if(!_.isEmpty(_this.oppBusiData.newBusiData.RELA_INFO.PRO_INVEST_ADVISER_INFO) && _this.oppBusiData.newBusiData.RELA_INFO.PRO_INVEST_ADVISER_INFO.INVEST_ADVISER) {
                _this.groupDatas.RELA_INFO.HAS_INVEST_ADVISER[0].FIELDS.HAS_INVEST_ADVISER.DEFAULT_VALUE = "1"
                bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["PRO_INVEST_ADVISER_INFO"], _this.oppBusiData.newBusiData.RELA_INFO.PRO_INVEST_ADVISER_INFO);
            }else {
                _this.groupDatas.RELA_INFO.HAS_INVEST_ADVISER[0].FIELDS.HAS_INVEST_ADVISER.DEFAULT_VALUE = "0"            
            }
        }
    },
    bizProInvestAdviserInfoPageActived: (_this) => {
        // 字段设置
        let fieldData = _this.groupDatas.RELA_INFO.PRO_INVEST_ADVISER_INFO[0]["FIELDS"];
        fieldData.INVESTASER_ID_CODE.VALID_TYPE = "charMinus[0,32]|on-blur"
        fieldData.INVEST_REP_ID_CODE.VALID_TYPE = "length[6,30]|on-blur"
        //过滤证件类型
        let dictItem = _this["oppBusiData"]["VALID_ID_TYPE_FOR_BOTH"]
        fieldData.INVESTASER_ID_TYPE.FIELD_DICT_FILTER = _.filter(dictItem, function (item) {
            return item.charAt(0) != '0'
        })
        fieldData.INVEST_REP_ID_TYPE.FIELD_DICT_FILTER = _.filter(dictItem, function (item) {
            return item.charAt(0) == '0'
        })
    },
    bizProInvestAdviserInfoValidate: (_this) => {
        //todo
    },
    bizProInvestAdviserInfoBeforeSave: (_this, params) => {
        let busiData = _this.oppBusiData.newBusiData;
        let isOpenAcct = _this.$storage.getJsonSession(_this.$definecfg.IS_OPEN_ACCT_BIZ);

        let relaInfo = busiData && busiData.RELA_INFO || {},
            proInvestAdviserInfo = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "PRO_INVEST_ADVISER_INFO", true);
        relaInfo.PRO_INVEST_ADVISER_INFO = proInvestAdviserInfo;

        if (isOpenAcct == "1") {
            var proInvestAdviserDiffInfo = bizPublicMethod.$blMethod.compareInfo2(custInfoModel.getOriginaProInvestAdviserInfo(_this.oppBusiData.oldBusiData), proInvestAdviserInfo, "HAS_INVEST_ADVISER");
            relaInfo.PRO_INVEST_ADVISER_CHANGE_INFO = Object.assign({}, proInvestAdviserInfo, {
                DIFF_INFO: proInvestAdviserDiffInfo
            })
        }

        params.HAS_INVEST_ADVISER = _this.groupDatas.RELA_INFO.HAS_INVEST_ADVISER[0].FIELDS.HAS_INVEST_ADVISER.DEFAULT_VALUE
        Object.assign(params.RELA_INFO, relaInfo);
    },
    //====================================字段关联逻辑====================================//
    "CHECK_HAS_INVEST_ADVISER": (_this, field, fieldData) => {
        if (field.DEFAULT_VALUE == "0") {
            _this.groupDatas.RELA_INFO.PRO_INVEST_ADVISER_INFO[0].MODULE_CONTROL = "0";
            _this.groupDatas.RELA_INFO.PRO_INVEST_ADVISER_INFO[0].FIELDS.INVESTASER_ID_CODE.DEFAULT_VALUE = "";
            _this.groupDatas.RELA_INFO.PRO_INVEST_ADVISER_INFO[0].FIELDS.INVESTASER_ID_TYPE.DEFAULT_VALUE = "";
            _this.groupDatas.RELA_INFO.PRO_INVEST_ADVISER_INFO[0].FIELDS.INVEST_ADVISER.DEFAULT_VALUE = "";
            _this.groupDatas.RELA_INFO.PRO_INVEST_ADVISER_INFO[0].FIELDS.INVEST_REP.DEFAULT_VALUE = "";
            _this.groupDatas.RELA_INFO.PRO_INVEST_ADVISER_INFO[0].FIELDS.INVEST_REP_ID_CODE.DEFAULT_VALUE = "";
            _this.groupDatas.RELA_INFO.PRO_INVEST_ADVISER_INFO[0].FIELDS.INVEST_REP_ID_TYPE.DEFAULT_VALUE = "";
        } else {
            _this.groupDatas.RELA_INFO.PRO_INVEST_ADVISER_INFO[0].MODULE_CONTROL = "1";
        }
    },
    "CHECK_INVEST_REP_ID_TYPE": (_this, field, fieldData) => {
        _this.$blMethod.setValidType(_this, field, fieldData, "INVEST_REP_ID_CODE")
        fieldData.INVEST_REP_ID_CODE.DEFAULT_VALUE = "";
    },
    "CHECK_INVESTASER_ID_TYPE": (_this, field, fieldData) => {
        _this.$blMethod.setValidType(_this, field, fieldData, "INVESTASER_ID_CODE")
        fieldData.INVESTASER_ID_CODE.DEFAULT_VALUE = "";
    }
}
