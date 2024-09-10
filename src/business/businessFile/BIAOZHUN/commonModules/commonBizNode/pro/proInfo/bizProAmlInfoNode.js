/*
 *   产品反洗钱专有信息模块
 *   方法封装
 *   @author  lindw
 */

import date from '../../../../../../../tools/date.js'
import * as utils from "../../../../../../../tools/util"
import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../../business/businessTools/bizPublicMethod.js"
import custInfoModel from '../../common/cust-info-model.js'

//开户和非开户 字段数据加载 公共操作
const bizProAmlInfoBeforeLoadBizCommon = (_this) => {
    let groupId = _this.userType == "1" ? "RELA_INFO" : "ORG_INFO";

    let fieldData = _this.groupDatas[groupId].ORG_AML_INFO[0].FIELDS;

    fieldData.ID_TYPE.FIELD_FUNCTION = "CHECK_ID_TYPE__AML_INFO";
    fieldData.ID_CODE.FIELD_FUNCTION = "CHECK_ID_CODE__AML_INFO";
    fieldData.ID_TYPE.FIELD_REQUIRED = "0";
    fieldData.ID_TYPE.FIELD_FUNCTION_CHANGE = "CHANGE_ID_TYPE__AML_INFO"
    fieldData.SHARE_RATIO.FIELD_FUNCTION = "CHECK_SHARE_RATIO__AML_INFO";
    fieldData.USER_NAME.VALID_TYPE = "length[1,64]";
    fieldData.SHARE_NUM.VALID_TYPE = "intex[23, 10]";
    fieldData.SHARE_RATIO.VALID_TYPE = "numberex[1,3,3,100]";
    
    _this.groupDatasTpl[groupId].ORG_AML_INFO = _.cloneDeep(_this.groupDatas[groupId].ORG_AML_INFO);

    if (_this.$storage.getJsonSession(_this.$definecfg.SYS_COMM_PARAM_OBJS).AML_ENABLE == "1") {
        bizPublicMethod.$blMethod.showRouteAndMoudle(_this, '反洗钱专有信息');
    } else {
        bizPublicMethod.$blMethod.hideRouteAndMoudle(_this, '反洗钱专有信息');
    }
}

export default {
    bizProAmlInfoBeforeLoadBizOpenAcct: (_this) => {
        bizProAmlInfoBeforeLoadBizCommon(_this)
    },
    bizProAmlInfoBeforeLoadBiz: (_this) => {
        bizProAmlInfoBeforeLoadBizCommon(_this);
        let groupId = _this.userType == "1" ? "RELA_INFO" : "ORG_INFO";
        let originaOrgAmlInfo = custInfoModel.getOriginaOrgAmlInfo(_this.oppBusiData.oldBusiData);
        bizPublicMethod.$blMethod.parseMoudleArray(_this, _this.groupDatas[groupId]["ORG_AML_INFO"], originaOrgAmlInfo);
    },
    bizProAmlInfoAfterLoadBiz: (_this) => {
        if (_.get(_this.oppBusiData.newBusiData, "RELA_INFO.ORG_AML_INFO", "")) {
            let groupId = _this.userType == "1" ? "RELA_INFO" : "ORG_INFO";
            bizPublicMethod.$blMethod.parseMoudleArray(_this, _this.groupDatas[groupId]["ORG_AML_INFO"], _.get(_this.oppBusiData.newBusiData, "RELA_INFO.ORG_AML_INFO", []));
        }

    },
    bizProAmlInfoPageActived: (_this) => {
        //todo
    },
    bizProAmlInfoValidate: (_this) => {
        let groupId = _this.userType == "1" ? "RELA_INFO" : "ORG_INFO";
        let idCodeList = _.chain(_this.groupDatas[groupId].ORG_AML_INFO).filter(module => {
            return module.FIELDS.ID_CODE.DEFAULT_VALUE != "";
        }).map(module => {
            return module.FIELDS.ID_CODE.DEFAULT_VALUE;
        }).value();
        let saveGroupId = _this.userType == "1" ? "RELA_INFO" : _this.userType == "2" ? "ORG_INFO" : "RELA_INFO";
        let idCodeListB = _.map(_this.groupDatas[saveGroupId].ORG_BENEFICIARY_OWNER_INFO, module => {
            return module.FIELDS.BENEFICIARY_ID.DEFAULT_VALUE;
        })
        if (idCodeListB.length > _.uniq(idCodeListB).length) {
            confirm("受益人信息的证件号码有重复记录，请删掉重复记录!")
            return false;
        }
        if (idCodeList.length > _.uniq(idCodeList).length) {
            confirm("反洗钱客户信息的证件号码有重复记录，请删掉重复记录！")
            return false;
        }

        if(_this.moduleId.indexOf("ORG_AML_INFO") != -1){
            let isRuturnBool = false;
            let groupId = _this.userType == "1" ? "RELA_INFO" : "ORG_INFO";
            _this.groupDatas[groupId].ORG_AML_INFO.forEach(function(item,index){
                if(parseInt(item.FIELDS.SHARE_RATIO.DEFAULT_VALUE) > 100){
                    isRuturnBool = true;
                    _this.$nextTick(() => {
                        _this.$blMethod.changeFieldError(item.FIELDS.SHARE_RATIO, false, "持股比例大于100%，请填写正确的持股比例");
                    })
                            
                    let titleStr =  "反洗钱专有信息";
                    if(index > 0){
                        titleStr = titleStr + (index +1) +"持股比例大于100%，请填写正确的持股比例"
                    }else{
                        titleStr = titleStr +"持股比例大于100%，请填写正确的持股比例"
                    }
                    _this.$refs.flowTip.pushFlowTip({
                        title: titleStr,
                        type: 'warning',
                        key: 'name2',
                    })
                    return false;
                }
            });
            if(isRuturnBool){
                return false;
            }
        }
        return true;
    },
    bizProAmlInfoBeforeSave: (_this, params) => {
        let orgAmlInfo = bizPublicSaveMethod.getModuleArrFoyKey(_this, "ORG_AML_INFO", true),
            isOpenAcct = _this.$storage.getJsonSession(_this.$definecfg.IS_OPEN_ACCT_BIZ);

        let busiData = _this.oppBusiData.newBusiData;
        let relaInfo = busiData && busiData["RELA_INFO"] || {};
        relaInfo.ORG_AML_INFO = orgAmlInfo;
        if (isOpenAcct == "1") {
            let originaOrgAmlInfo = custInfoModel.getOriginaOrgAmlInfo(_this.oppBusiData.oldBusiData);
            let AmlChangeInfo = bizPublicMethod.$blMethod.getArrDiff(
                orgAmlInfo, originaOrgAmlInfo, "RISK_NUM"
            )
            relaInfo.ORG_AML_CHANGE_INFO = AmlChangeInfo;
        } else {
            relaInfo.ORG_AML_INFO = _.map(relaInfo.ORG_AML_INFO, item => {
                return Object.assign(item, {
                    OPER_TYPE: "0"
                })
            })
        }

        params["RELA_INFO"] = params["RELA_INFO"] || {};
        Object.assign(params["RELA_INFO"], relaInfo);
    },
    //================================================字段关联逻辑================================================
    "CHECK_ID_TYPE__AML_INFO": (_this, field, fieldData) => {
        if (field.DEFAULT_VALUE != "") {
            _this.$blMethod.setValidType(_this, field, fieldData, "ID_CODE")
            fieldData.ID_CODE.FIELD_REQUIRED = "1";
        } else {
            fieldData.ID_CODE.FIELD_REQUIRED = "0";
        }
        fieldData.ID_CODE.DEFAULT_VALUE = "";
    },
    "CHANGE_ID_TYPE__AML_INFO": (_this, field, fieldData) => {
        if (field.DEFAULT_VALUE != "") {
            fieldData.ID_CODE.FIELD_REQUIRED = "1";
        } else {
            fieldData.ID_CODE.FIELD_REQUIRED = "0";
        }
    },
    "CHECK_SHARE_RATIO__AML_INFO": (_this, field, fieldData) => {
        let defaultValue = field.DEFAULT_VALUE || "";
        if (isNaN(Number(defaultValue)) || Number(defaultValue) < 0) {
           _this.$nextTick(() => {
            _this.$blMethod.changeFieldError(field, false, "请输入大于0且小于等于100的数字，小数点后最多3位");
           })
        }else if(Number(defaultValue) > 100){
            _this.$nextTick(() => {
                _this.$blMethod.changeFieldError(field, false, "持股比例大于100%，请填写正确的持股比例");
            })
        }
    },
    "CHECK_ID_CODE__AML_INFO": (_this, field, fieldData) => {
        if (field.DEFAULT_VALUE != "") {
            let groupId = _this.userType == "1" ? "RELA_INFO" : "ORG_INFO";
            let repeatModule = _.filter(_this.groupDatas[groupId].ORG_AML_INFO, module => {
                return module.FIELDS.ID_CODE.DEFAULT_VALUE == field.DEFAULT_VALUE;
            })
            if (repeatModule && repeatModule.length >= 2) {
                _this.$nextTick(() => {
                    _this.$blMethod.changeFieldError(field, false, "反洗钱客户证件号码已经存在，不能重复输入");
                })
            }
        }
    },
    AMLINFO_DELETE_MODULE_FINISHED: (_this, fieldData) => {
        _.each(_this.$refs, (item, key) => {
            if (key.indexOf("ORG_AML_INFO") > -1 && item.length > 0) {
                item[0].$refs.ID_CODE[0].field.message = "";
                item[0].$refs.ID_CODE[0].$refs.ID_CODE.validate("change");
            }
        })
    }
}
