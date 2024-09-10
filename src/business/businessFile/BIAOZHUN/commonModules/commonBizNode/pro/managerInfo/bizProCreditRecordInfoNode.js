/*
 *   诚信记录信息
 *   方法封装
 */

import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../../business/businessTools/bizPublicMethod.js"
import custInfoModel from '../../common/cust-info-model.js'

export default {
    "bizProCreditRecordInfoBeforeLoadBiz": (_this) => {
        let saveGroupId = "MANAGER_INFO";
        _this.groupDatas[saveGroupId].CREDIT_RECORD_INFO[0].FIELDS.RECORD_SOURCE.FIELD_DICT_FILTER = "!07"
        _this.groupDatas[saveGroupId].CREDIT_RECORD_INFO[0].MAX_LENGTH = "999";
        _this.groupDatasTpl[saveGroupId].CREDIT_RECORD_INFO = _.cloneDeep(_this.groupDatas[saveGroupId].CREDIT_RECORD_INFO);
        var creditRecordInfo = custInfoModel.getOriginaCreditRecordInfo(_this.oppBusiData.oldBusiData)
        _this.groupDatas[saveGroupId].CREDIT_RECORD_INFO[0].MODULE_CONTROL = "0";
        if (!_.isEmpty(creditRecordInfo) && creditRecordInfo[0].RECORD_SOURCE != "07") {
            _this.groupDatas[saveGroupId].HAS_CREDIT_RECORD[0].FIELDS.HAS_CREDIT_RECORD.DEFAULT_VALUE = "1";
            _this.groupDatas[saveGroupId].CREDIT_RECORD_INFO[0].MODULE_CONTROL = "1";
            bizPublicMethod.$blMethod.parseMoudleArray(_this, _this.groupDatas[saveGroupId]["CREDIT_RECORD_INFO"], creditRecordInfo);
        } 
        if (!_.isEmpty(creditRecordInfo) && creditRecordInfo[0].RECORD_SOURCE == "07") {
            _this.groupDatas[saveGroupId].CREDIT_RECORD_INFO[0].MODULE_CONTROL = "0";
            _this.groupDatas[saveGroupId].HAS_CREDIT_RECORD[0].FIELDS.HAS_CREDIT_RECORD.DEFAULT_VALUE = "0";
        }
    },
    "bizProCreditRecordInfoAfterLoadBiz": (_this) => {
        let saveGroupId = "MANAGER_INFO";
        if (_this.historyData && _this.historyData["RELA_INFO"]) {
            if (_this.historyData.HAS_CREDIT_RECORD == "0") {
                _this.groupDatas[saveGroupId].HAS_CREDIT_RECORD[0].FIELDS.HAS_CREDIT_RECORD.DEFAULT_VALUE = "0";
                _this.groupDatas[saveGroupId].CREDIT_RECORD_INFO[0].MODULE_CONTROL = "0";
                _this.groupDatas[saveGroupId].CREDIT_RECORD_INFO.splice(1, _this.groupDatas[saveGroupId].CREDIT_RECORD_INFO.length - 1);
                _this.groupDatas[saveGroupId].CREDIT_RECORD_INFO[0].FIELDS.RECORD_SOURCE.DEFAULT_VALUE = "";
                _this.groupDatas[saveGroupId].CREDIT_RECORD_INFO[0].FIELDS.RECORD_TXT.DEFAULT_VALUE = "";
            } 
            if (_this.historyData.HAS_CREDIT_RECORD == "1" && _this.historyData["RELA_INFO"].CREDIT_RECORD_INFO) {
                _this.groupDatas[saveGroupId].HAS_CREDIT_RECORD[0].FIELDS.HAS_CREDIT_RECORD.DEFAULT_VALUE = "1";
                _this.groupDatas[saveGroupId].CREDIT_RECORD_INFO[0].MODULE_CONTROL = "1";
                bizPublicMethod.$blMethod.parseMoudleArray(_this, _this.groupDatas[saveGroupId]["CREDIT_RECORD_INFO"], _this.historyData["RELA_INFO"].CREDIT_RECORD_INFO);
            }
        }
        _.each(_this.groupDatas[saveGroupId].CREDIT_RECORD_INFO, module => {
            module.FIELDS.RECORD_SOURCE.labelWidth = "240";
        })
    },
    "bizProCreditRecordInfoPageActived": (_this) => {
        let saveGroupId = "MANAGER_INFO";
        let HAS_CREDIT_RECORD = _this.groupDatas[saveGroupId].HAS_CREDIT_RECORD[0].FIELDS;
        HAS_CREDIT_RECORD.HAS_CREDIT_RECORD.isShowAllBtn = false;
        let HAS_CREDIT_RECORD_VALUE = _.get(HAS_CREDIT_RECORD, "HAS_CREDIT_RECORD.DEFAULT_VALUE", "");
        if (HAS_CREDIT_RECORD_VALUE == "1") {
            _.each(_this.groupDatas[saveGroupId].CREDIT_RECORD_INFO, (item, key) => {
                _this.groupDatas[saveGroupId].CREDIT_RECORD_INFO[key].MODULE_CONTROL = "1";
                //如果诚信记录来源为其他则诚信备注为必填
                if (_this.groupDatas[saveGroupId].CREDIT_RECORD_INFO[key].FIELDS.RECORD_SOURCE.DEFAULT_VALUE == "99") {
                    _this.groupDatas[saveGroupId].CREDIT_RECORD_INFO[key].FIELDS.RECORD_TXT.FIELD_REQUIRED = "1"
                } else {
                    _this.groupDatas[saveGroupId].CREDIT_RECORD_INFO[key].FIELDS.RECORD_TXT.FIELD_REQUIRED = "0"
                }
            })
        }
    },
    "bizProCreditRecordInfoValidate": (_this) => {
        //todo
        let saveGroupId = "MANAGER_INFO";
        let CREDIT_RECORD_INFO = _this.groupDatas[saveGroupId].CREDIT_RECORD_INFO;
        let fieldArr = ["RECORD_SOURCE", "RECORD_TXT"];
        let promiseArr = [];
        _.each(CREDIT_RECORD_INFO, (item, key) => {
            _.each(fieldArr, fieldId => {
                let fieldData = CREDIT_RECORD_INFO[key].FIELDS;
                let field = CREDIT_RECORD_INFO[key].FIELDS[fieldId];
                let fieldFn = field.FIELD_FUNCTION;
                _this.busiLogic[fieldFn] && promiseArr.push(_this.busiLogic[fieldFn](_this, field, fieldData));
            })
        })
        return Promise.all(promiseArr).then( (res)=> {
            if (_.includes(res, false)) {
                return false
            }
        })
    },
    "bizProCreditRecordInfoBeforeSave": (_this, params) => {
        let saveGroupId = "MANAGER_INFO";
        let OPP_NO_CREDIT_RECORD_ITEM = bizPublicMethod.$blMethod.getJsonSessionSysCommParam(_this, "OPP_NO_CREDIT_RECORD_ITEM"),
            tmpArr = OPP_NO_CREDIT_RECORD_ITEM.split("|");

        let originaCreditRecordInfo = custInfoModel.getOriginaCreditRecordInfo(_this.oppBusiData.oldBusiData);
        let originaCreditRecordInfoFields = _this.groupDatas[saveGroupId].CREDIT_RECORD_INFO[0].FIELDS;

        let creditRecordInfo = _.filter(bizPublicSaveMethod.getModuleArrFoyKey(_this, "CREDIT_RECORD_INFO", true), obj => obj.HAS_CREDIT_RECORD != "0" && !!obj.RECORD_SOURCE) || [];
        creditRecordInfo.map(creditRecordInfoItem => {
            !creditRecordInfoItem.RECORD_SCORE && (creditRecordInfoItem.RECORD_SCORE = "0")
            return creditRecordInfoItem;
        })
        if (!creditRecordInfo.length) {
            creditRecordInfo.push({
                RECORD_SOURCE: tmpArr[0] || "07",
                RECORD_TXT: tmpArr[2] || "",
                RECORD_NUM: originaCreditRecordInfo.length && originaCreditRecordInfo[0].RECORD_SOURCE == "07" ? originaCreditRecordInfo[0].RECORD_NUM : "",
                RECORD_SCORE: tmpArr[1] || "0"
            })
        }
        
        let busiData = _this.historyData || {};
        let relaInfo = busiData["RELA_INFO"] || {};
        relaInfo.CREDIT_RECORD_INFO = creditRecordInfo;
        if (_this.busiCode == "V0049" || _this.busiCode == "V0163") {
            let data1 = bizPublicMethod.$blMethod.getArrDiff(creditRecordInfo, originaCreditRecordInfo, "RECORD_NUM", "HAS_CREDIT_RECORD");
            data1.INFO = _this.$blMethod.addDiffAttArr(originaCreditRecordInfoFields, _.cloneDeep(data1.INFO));
            relaInfo.CREDIT_RECORD_CHANGE_INFO = data1;

            Object.assign(params, {
                ORG_CREDIT_RECORD: relaInfo.CREDIT_RECORD_CHANGE_INFO.INFO
            });
        }
        params["RELA_INFO"] = relaInfo;
        params.HAS_CREDIT_RECORD = _this.groupDatas[saveGroupId].HAS_CREDIT_RECORD[0].FIELDS.HAS_CREDIT_RECORD.DEFAULT_VALUE;
        //银河用于填写影像表单
        let creditRecordInfoTpl = _.cloneDeep(creditRecordInfo);
        params.RECORD_SOURCE_ARR = _.map(creditRecordInfoTpl, "RECORD_SOURCE");
        // TODO: 使审核端不报 undefine 的错
        params.ORG_EXT_ASSETS = {
            DIFF_INFO: []
        }
        return params;
    },
    //=======================================字段关联逻辑=======================================//
    "CHECK_HAS_CREDIT_RECORD": (_this, field, fieldData) => {
        let saveGroupId = "MANAGER_INFO";
        if (field.DEFAULT_VALUE == "1") {
            _.each(_this.groupDatas[saveGroupId].CREDIT_RECORD_INFO, (item, key) => {
                _this.groupDatas[saveGroupId].CREDIT_RECORD_INFO[key].MODULE_CONTROL = "1";
            })
        } 
        if (field.DEFAULT_VALUE == "0") {
            _this.groupDatas[saveGroupId].CREDIT_RECORD_INFO[0].MODULE_CONTROL = "0";
            _this.groupDatas[saveGroupId].CREDIT_RECORD_INFO[0].MODULE_ADD = "1";
            _this.groupDatas[saveGroupId].CREDIT_RECORD_INFO[0].MODULE_DELETE = "0";
            _this.groupDatas[saveGroupId].CREDIT_RECORD_INFO.splice(1, _this.groupDatas[saveGroupId].CREDIT_RECORD_INFO.length - 1);
            _this.groupDatas[saveGroupId].CREDIT_RECORD_INFO[0].FIELDS.RECORD_SOURCE.DEFAULT_VALUE = "";
            _this.groupDatas[saveGroupId].CREDIT_RECORD_INFO[0].FIELDS.RECORD_TXT.DEFAULT_VALUE = "";
            _this.groupDatas[saveGroupId].CREDIT_RECORD_INFO[0].FIELDS.RECORD_SCORE.DEFAULT_VALUE = "";
        }
    },
    CHECK_RECORD_SOURCE: (_this, field, fieldData) => {
        //如果是其他则诚信备注 为必填
        if (field.DEFAULT_VALUE == "99") {
            fieldData.RECORD_TXT.FIELD_REQUIRED = "1";
        } else {
            fieldData.RECORD_TXT.FIELD_REQUIRED = "0";
        }
        let existFlag = _this.$blMethod.checkIdCodeIsExisted(_this, field, "诚信记录来源已经存在，不能重复添加");
        if (existFlag) {
            return false;
        }
    },
    CHECK_RECORD_TXT: (_this, field, fieldData) => {
        if (fieldData.RECORD_SOURCE.DEFAULT_VALUE == "99" && field.DEFAULT_VALUE == "无") {
            _this.$nextTick( () => {
                _this.$blMethod.changeFieldError(field, false, "请输入正确的诚信备注");
            })
            return false;
        }
    },
    bizProCreditRecordInfoNodeAddModuleFinished: (_this, module) => {
        module.FIELDS.RECORD_SOURCE.labelWidth = "240";
    },
    bizProCreditRecordInfoNodeDeleteModuleFinished: (_this, deleteObj) => {
        _this.$nextTick(() => {
            let saveGroupId = "MANAGER_INFO";
            let CREDIT_RECORD_INFO = _this.groupDatas[saveGroupId].CREDIT_RECORD_INFO;
            _.each(CREDIT_RECORD_INFO, item => {
                let field = item.FIELDS.RECORD_SOURCE;
                _this.$refs[item.MODULE_ID+item.MODULE_SEQ][0].$refs[field.FIELD_ID][0].$refs[field.FIELD_ID].validate("blur");
                _this.$refs[item.MODULE_ID+item.MODULE_SEQ][0].$refs[field.FIELD_ID][0].$refs[field.FIELD_ID].validate("custom");
            })
        })
    }
    
}