/*
 *   机构重要信息模块
 *   方法封装
 *   @author  lindw
 */

import date from '../../../../../../../tools/date.js'
import * as utils from "../../../../../../../tools/util"
import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../../business/businessTools/bizPublicMethod.js"
import custInfoModel from "../../common/cust-info-model"
import dict from '../../../../../../../tools/dict.js'

const bizOrgImportInfoNodeBeforeLoadBizCommon = (_this) => {
    _this.groupDatas.ORG_INFO.ORG_IMPORT_INFO[0].MODULE_CUSTOMIZE = "1";
    _this.groupDatasTpl.ORG_INFO.ORG_IMPORT_INFO[0].MODULE_CUSTOMIZE = "1";
    _this.groupDatas.ORG_INFO.ORG_IMPORT_INFO[0].MODULE_CUSTOMIZE_TXT = "机构信息核查";
    _this.groupDatasTpl.ORG_INFO.ORG_IMPORT_INFO[0].MODULE_CUSTOMIZE_TXT = "机构信息核查";
}
export default {
    bizOrgImportInfoNodeBeforeLoadBizOpenAcct: (_this) => {
        bizOrgImportInfoNodeBeforeLoadBizCommon(_this);
    },
    "bizOrgImportInfoNodeBeforeLoadBiz": (_this) => {
        var orgImportInfo = custInfoModel.getOriginaOrgImportantInfo(_this.oppBusiData.oldBusiData);
        !_.isEmpty(orgImportInfo) && bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["ORG_IMPORT_INFO"], orgImportInfo);
        bizOrgImportInfoNodeBeforeLoadBizCommon(_this);

    },
    "bizOrgImportInfoNodeAfterLoadBiz": (_this) => {
        if (_this.oppBusiData.newBusiData && _this.oppBusiData.newBusiData.ORG_INFO && _this.oppBusiData.newBusiData.ORG_INFO.ORG_IMPORT_INFO) {
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["ORG_IMPORT_INFO"], _this.oppBusiData.newBusiData.ORG_INFO.ORG_IMPORT_INFO);
        }
    },
    "bizOrgImportInfoNodePageActived": (_this) => {
        // let idType = _this.oppBusiData.newBusiData.ORG_INFO.ORG_BASIC_INFO.ID_TYPE,
        //     idCode = _this.oppBusiData.newBusiData.ORG_INFO.ORG_BASIC_INFO.ID_CODE,
        //     isChina = _this.oppBusiData.newBusiData.ORG_INFO.ORG_BASIC_INFO.INOUTSIDE_IDENTITY == "0",
        //     importFieldData = _this.groupDatas.ORG_INFO.ORG_IMPORT_INFO[0].FIELDS,
        //     orgFieldData = _this.groupDatas.ORG_INFO.ORG_BASIC_INFO[0].FIELDS;
        // importFieldData.ORG_ID_CODE.FIELD_CONTROL = '0';
        // importFieldData.BUSINESS_TAX_NO.FIELD_CONTROL = '0';
        // if (orgFieldData.ID_TYPE.DEFAULT_VALUE == "10") {
        //     let idCode = orgFieldData.ID_CODE.DEFAULT_VALUE;
        //     if (idCode.length == 18) {
        //         importFieldData.ORG_ID_CODE.DEFAULT_VALUE = idCode.substring(8, 16) + "-" + idCode.substring(16, 17);
        //         importFieldData.BUSINESS_TAX_NO.DEFAULT_VALUE = idCode;
        //         importFieldData.ORG_ID_CODE.FIELD_CONTROL = '2';
        //     } else if (idCode.length == 24) {
        //         importFieldData.ORG_ID_CODE.DEFAULT_VALUE = idCode.substring(15, 23) + "-" + idCode.substring(23, 24);
        //         importFieldData.BUSINESS_TAX_NO.DEFAULT_VALUE = idCode;
        //         importFieldData.ORG_ID_CODE.FIELD_CONTROL = '2';
        //     }
        // }
        // if (orgFieldData.ID_TYPE.DEFAULT_VALUE == "10" && (orgFieldData.ID_CODE.DEFAULT_VALUE.length == 18 || orgFieldData.ID_CODE.DEFAULT_VALUE.length == 24)) {
        //     importFieldData.ORG_ID_EXP_DATE && (importFieldData.ORG_ID_EXP_DATE.DEFAULT_VALUE = orgFieldData.ID_EXP_DATE.DEFAULT_VALUE);
        //     importFieldData.TAX_NO_EXP_DATE && (importFieldData.TAX_NO_EXP_DATE.DEFAULT_VALUE = orgFieldData.ID_EXP_DATE.DEFAULT_VALUE);
        //     importFieldData.TAX_NO_EXP
        // }
        // _this.oppBusiData.ORGINFO_CHECK_FLAG = _.get(_this.oppBusiData, "newBusiData.ORG_INFO.ORG_IMPORT_INFO.ORGINFO_CHECK_FLAG", "false");
        // if (isChina) {
        //     importFieldData.LAND_TAX_NO.FIELD_CONTROL = "0";
        //     importFieldData.LAND_TAX_NO_EXP_DATE.FIELD_CONTROL = "0";
        //     if (idType == "10" && (idCode.length == 18 || idCode.length == 24)) {
        //         importFieldData.ORG_ID_CODE.FIELD_CONTROL = "2";
        //         importFieldData.ORG_ID_EXP_DATE.FIELD_CONTROL = "2";
        //         importFieldData.BUSINESS_TAX_NO.FIELD_CONTROL = "2";
        //         importFieldData.TAX_NO_EXP_DATE.FIELD_CONTROL = "2";
        //     } else {
        //         importFieldData.ORG_ID_CODE.FIELD_CONTROL = "0";
        //         importFieldData.ORG_ID_EXP_DATE.FIELD_CONTROL = "0";
        //         importFieldData.BUSINESS_TAX_NO.FIELD_CONTROL = "0";
        //         importFieldData.TAX_NO_EXP_DATE.FIELD_CONTROL = "0";
        //     }
        // } else {
        //     importFieldData.ORG_ID_CODE.FIELD_CONTROL = "1";
        //     importFieldData.ORG_ID_EXP_DATE.FIELD_CONTROL = "1";
        //     importFieldData.BUSINESS_TAX_NO.FIELD_CONTROL = "1";
        //     importFieldData.TAX_NO_EXP_DATE.FIELD_CONTROL = "1";
        //     importFieldData.LAND_TAX_NO.FIELD_CONTROL = "1";
        //     importFieldData.LAND_TAX_NO_EXP_DATE.FIELD_CONTROL = "1";
        //     importFieldData.ORG_ID_CODE.DEFAULT_VALUE = "";
        //     importFieldData.ORG_ID_EXP_DATE.DEFAULT_VALUE = "";
        //     importFieldData.BUSINESS_TAX_NO.DEFAULT_VALUE = "";
        //     importFieldData.TAX_NO_EXP_DATE.DEFAULT_VALUE = "";
        //     importFieldData.LAND_TAX_NO.DEFAULT_VALUE = "";
        //     importFieldData.LAND_TAX_NO_EXP_DATE.DEFAULT_VALUE = "";
        // }
    },
    "bizOrgImportInfoNodeBeforeSave": (_this, params) => {
        //数据保存
        let busiData = _this.oppBusiData.newBusiData;
        let isOpenAcct = _this.$storage.getJsonSession(_this.$definecfg.IS_OPEN_ACCT_BIZ);
        busiData.ORG_INFO || (busiData.ORG_INFO = {});
        let orgInfo = busiData && busiData.ORG_INFO || {},
            orgImportInfo = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "ORG_IMPORT_INFO");
        // 地税登记证为空时,不应该保存地税登记有效期
        if (orgImportInfo.LAND_TAX_NO == '') {
            orgImportInfo.LAND_TAX_NO_EXP_DATE = ''
        }
        orgImportInfo.ORGINFO_CHECK_FLAG = _this.oppBusiData.ORGINFO_CHECK_FLAG;
        orgInfo.ORG_IMPORT_INFO = orgImportInfo;
        if (isOpenAcct == "1") {
            let data1 = bizPublicMethod.$blMethod.compareInfo2(custInfoModel.getOriginaOrgImportantInfo(_this.oppBusiData.oldBusiData), bizPublicSaveMethod.getModuleObjctFoyKey(_this, "ORG_IMPORT_INFO"));
            orgInfo.ORG_IMPORT_CHANGE_INFO = Object.assign({}, orgImportInfo, {
                DIFF_INFO: data1
            });
        }
        Object.assign(params.ORG_INFO, orgInfo);
    },
    "bizOrgImportInfoNodeAfterSave": (_this, newData) => {
        //todo
    },
    "bizOrgImportInfoNodeValidate": (_this) => {
        let isChina = _this.groupDatas.ORG_INFO.ORG_BASIC_INFO[0].FIELDS.INOUTSIDE_IDENTITY.DEFAULT_VALUE == "0",
            importFieldData = _this.groupDatas.ORG_INFO.ORG_IMPORT_INFO[0].FIELDS;
        _this.$refs.flowTip.removeFlowTip("idCodeHandleTip");
        if (isChina) {
            if (!((importFieldData.BUSINESS_TAX_NO.DEFAULT_VALUE && importFieldData.TAX_NO_EXP_DATE.DEFAULT_VALUE) || (importFieldData.LAND_TAX_NO.DEFAULT_VALUE && importFieldData.LAND_TAX_NO_EXP_DATE.DEFAULT_VALUE))) {
                alert("请至少填写国税或地税信息其中一类!")
                return false;
            }
        }
        
        let IS_NEED_ORGINFO_CHECK = _this.$blMethod.getJsonSessionBusiCommParam(_this, "IS_NEED_ORGINFO_CHECK") || "1";
        if (IS_NEED_ORGINFO_CHECK == '1' && _this.oppBusiData.ORGINFO_CHECK_FLAG != 'true') {
            alert("机构开户必须先进行机构信息核查，请点击机构信息核查按钮!")
            return false;
        }
    },
    "CHECK_BUSINESS_TAX_NO": (_this, field, fieldData) => {
        // if (field.DEFAULT_VALUE != "") {
        //     fieldData.TAX_NO_EXP_DATE.FIELD_REQUIRED = "1";
        // } else {
        //     fieldData.TAX_NO_EXP_DATE.FIELD_REQUIRED = "0";
        // }
    },
    "CHECK_TAX_NO_EXP_DATE": (_this, field, fieldData) => {
        // if (field.DEFAULT_VALUE != "") {
        //     fieldData.BUSINESS_TAX_NO.FIELD_REQUIRED = "1";
        // } else {
        //     fieldData.BUSINESS_TAX_NO.FIELD_REQUIRED = "0";
        // }
    },
    "CHECK_LAND_TAX_NO": (_this, field, fieldData) => {
        // if (field.DEFAULT_VALUE != "") {
        //     fieldData.LAND_TAX_NO_EXP_DATE.FIELD_REQUIRED = "1";
        // } else {
        //     fieldData.LAND_TAX_NO_EXP_DATE.FIELD_REQUIRED = "0";
        // }
    },
    "CHECK_LAND_TAX_NO_EXP_DATE": (_this, field, fieldData) => {
        // if (field.DEFAULT_VALUE != "") {
        //     fieldData.LAND_TAX_NO.FIELD_REQUIRED = "1";
        // } else {
        //     fieldData.LAND_TAX_NO.FIELD_REQUIRED = "0";
        // }
    },
    //根据国有属性过滤资本属性
    "CHECK_NATIONAL_ATTR": (_this, field, fieldData) => {
        let fieldCapital = fieldData.CAPITAL_ATTR;
        fieldCapital.DEFAULT_VALUE = '';
        let dictItem = _.map(fieldCapital.FIELD_DICT_NAME, 'DICT_ITEM');
        if (field.DEFAULT_VALUE == '1' || field.DEFAULT_VALUE == '2') {
            fieldCapital.FIELD_DICT_FILTER  = _.filter(dictItem, v => v == "1");
        } else if (field.DEFAULT_VALUE == '3') {
            fieldCapital.FIELD_DICT_FILTER = _.filter(dictItem, v => v != '3')
        } else {
            fieldCapital.FIELD_DICT_FILTER = []
        }
    },
    CUSTOMIZE_MODULE_FUNCTION: (_this, moduleId, fieldData) => {
        _this.oppBusiData.ORGINFO_CHECK_FLAG = 'false';
        let orgCardInfo = _.get(_this.groupDatas, "ORG_INFO.ORG_CARD_INFO[0].FIELDS", {})
        let orgbasicInfo = _.get(_this.groupDatas, "ORG_INFO.ORG_BASIC_INFO[0].FIELDS", {});
        if (!orgCardInfo.CUST_FNAME.DEFAULT_VALUE) {
            _this.$blMethod.showMsgBox(_this, "中国结算机构信息核查，机构全称不能为空！");
            return;
        }
        if (!orgCardInfo.ID_CODE.DEFAULT_VALUE) {
            _this.$blMethod.showMsgBox(_this, "中国结算机构信息核查，统一社会信用代码不能为空！");
            return;
        }
        //境外机构不需要校验 组织机构代码
        if (orgCardInfo.ID_TYPE.DEFAULT_VALUE !== "14" && orgbasicInfo.INOUTSIDE_IDENTITY.DEFAULT_VALUE !== "1" && !fieldData.ORG_ID_CODE.DEFAULT_VALUE) {
            _this.$blMethod.showMsgBox(_this, "中国结算机构信息核查，组织机构代码不能为空！");
            return;
        }
        loading.open("正在进行机构信息核查...");
        _this.$blMethod.isServiceTime(_this, {
            RES_IDS: "5",
            RES_TYPE: "1"
        }).then(flag => {
            if (!flag) {
                _this.oppBusiData.ORGINFO_CHECK_FLAG = "true";
                _this.$blMethod.showMsgBox(_this, "非服务时间，中国结算机构信息核查校验失败！");
                return;
            }
            _this.$syscfg.K_Request('Y3000005', {
                OPERATOR_TYPE: "0",
                ACCTBIZ_CLS: '02',
                ACCTBIZ_EXCODE: "25",
                CHK_STATUS: "2",
                CUST_FNAME: orgCardInfo.CUST_FNAME.DEFAULT_VALUE || "",
                //组织机构代码证，存在表里需要去掉 "-"
                ID_CODE2: fieldData.ORG_ID_CODE.DEFAULT_VALUE.replace("-", ""),
                ID_CODE: orgCardInfo.ID_CODE.DEFAULT_VALUE,
                ID_TYPE: orgCardInfo.ID_TYPE.DEFAULT_VALUE,
            }, true).then(data => {
                let SERIAL_NO = _.get(data, "Data[0].SERIAL_NO", "");
                if (!SERIAL_NO) {
                    _this.oppBusiData.ORGINFO_CHECK_FLAG = "true";
                    _this.$blMethod.showMsgBox(_this, "中国结算机构信息核查校验失败！");
                    return;
                }
                _this.$syscfg.K_Request("YG210423", {
                    SERIAL_NO: SERIAL_NO
                }).then(validRes => {
                    if (_.get(validRes, "Data[0]", "")) {
                        dict.transformDict(validRes.Data[0], ["ID_TYPE", { ORGANIZATION_TYPE: "SZORG_TYPE" }, "BUS_STATUS"]).then(res => {
                            _.extend(res, { OPPUGN_FLAG_TEXT: res.OPPUGN_FLAG == "1" ? "正常" : "质疑" });
                            _this.$store.commit(_this.$types.UPDATE_CSDC_DATA, res);
                            _this.csdcIdType = "orgOppugn"
                            _this.showCsdcInfoPage = true;
                            _this.oppBusiData.ORGINFO_CHECK_FLAG = "true";
                        })
                        return;
                    }
                    _this.$blMethod.showMsgBox(_this, "中国结算机构信息核查校验失败！");
                })
            }).catch((error) => {
                _this.oppBusiData.ORGINFO_CHECK_FLAG = "true";
                _this.$blMethod.showMsgBox(_this, "中国结算机构信息核查校验失败！");
            }).finally((data) => {
                loading.close();

            })
        })

    },
}
