//客户信息节点
import bizCustBasicInfoNode from "../commonModules/commonBizNode/cust/custInfo/bizCustBasicInfoNode";
//联系信息节点
import bizCustLinkInfoNode from "../commonModules/commonBizNode/cust/linkInfo/bizCustLinkInfoNode";
//实际控制人
import bizActualControllerNode from "../commonModules/commonBizNode/cust/custInfo/bizActualControllerNode"
//其他联系人信息
import bizCustOtherLinkNode from "../commonModules/commonBizNode/cust/custInfo/bizCustOtherLinkNode"
//受益人信息
import bizCustBeneficiaryInfoNode from "../commonModules/commonBizNode/cust/custInfo/bizActualBeneficiaryNode"
//诚信记录信息
import bizProCreditRecordInfoNode from "../commonModules/commonBizNode/pro/proInfo/bizProCreditRecordInfoNode"
//涉税节点
import bizCustTaxInfoNode from "../commonModules/commonBizNode/cust/custInfo/bizCustTaxInfoNode"


import oppService from '../../../../service/opp-service'
import { getSex } from '../../../../tools/util'
import custSerivce from '../../../../service/cust-service'
import csdsSerivce from '../../../../service/csdc-service'
import bizPublicMethod from "../../../businessTools/bizPublicMethod.js"
import date from "../../../../tools/date.js";
import * as bizPublicTools from "../commonModules/commonBizNode/bizPublicTools.js"
import * as utils from "../../../../tools/util.js"
import dict from "../../../../tools/dict"

const axiosCfg = {
    retry: 1,
}
/**
 * 获取客户历史数据
 * @param USER_TYPE   用户类型
 * @param INT_ORG     客户机构
 */
const W0000312 = (_this, param) => {
    return _this.$syscfg.K_Request('W0000312', param, false, axiosCfg).then( res => {
        return res;
    }).catch( err => {
        throw err
    });
}

const getValidIdTypeData = (_this) => {
    return Promise.all([
        bizPublicTools.getValidIdTypeData(_this)
    ]).then(res => {
        var validIdTypeObj = {
            "0": [],
            "1": [],
            "2": []
        };
        res[0] && res[0].Data.forEach((v) => {
            validIdTypeObj[v.USER_TYPE].push(v.ID_TYPE)
        })
        //个人证件类型数组
        _this["oppBusiData"]["VALID_ID_TYPE_FOR_PERSON"] = validIdTypeObj["0"]
        //机构证件类型编码数组
        _this["oppBusiData"]["VALID_ID_TYPE_FOR_ORG"] = validIdTypeObj["1"]
        //产品证件类型编码数组  10
        if (validIdTypeObj["2"] && validIdTypeObj["2"].length) {
            _this["oppBusiData"]["VALID_ID_TYPE_FOR_PRO"] = validIdTypeObj["2"]
        } else {
            _this["oppBusiData"]["VALID_ID_TYPE_FOR_PRO"] = validIdTypeObj["1"]
        }
        //机构+个人 证件类型合并数组
        _this["oppBusiData"]["VALID_ID_TYPE_FOR_BOTH"] = validIdTypeObj["0"].concat(validIdTypeObj["1"])

    }).catch( err => {
        throw err;
    })
}
const getDictArrData = (_this) => {
    return dict.getDictData(["CITIZENSHIP_ST", "SUBJECT_IDENTITY", "INOUTSIDE_IDENTITY", "EXT_ORG"]).then(res => {
        _this.oppBusiData.dictAll = res;
    }).catch( err => {
        throw err;
    })
}
//YG003660 查询基本信息 由于现有的w0000312用的是建投的接口导致有部分字段没有查回来
const YG003660 = (_this) => {
    let customerInfo = _this.oppBusiData.customerInfo;
    return _this.$syscfg.K_Request("YG003660", {
        USER_CODE: customerInfo.CUST_CODE,
        CUST_CODE: customerInfo.CUST_CODE,
        MODEL_TYPE: "CUST_BASE_INFO"
    }, false, axiosCfg).then( res => {
        return _.get(res, "Data[0]", {});
    }).catch( err => {
        throw err;
    })
}
//机构查询 ORG_TYPE 0-内部 1-银行
const Y1000200  = (_this) => {
    return _this.$syscfg.K_Request('Y1000200', {
        ORG_TYPE: "1"
    }, false, axiosCfg).then( (res) => {
        _this.oppBusiData.bankDataAll = _.get(res, "Data", []);
    }).catch( err => {
        throw err;
    });
}
//一码通
const getCSDCYmtData = (_this) => {
    let customerInfo = _this.oppBusiData.customerInfo;
    return csdsSerivce.getCSDCYmtData(customerInfo.CUST_FNAME, customerInfo.ID_TYPE, customerInfo.ID_CODE).then( res => {
        _this.oppBusiData.ymtData = _.filter(res, item => {return item.YMT_CODE != "" && item.YMT_STATUS != "1"}) || [];
    }).catch( err => {
        throw err;
    })
}
//一账通信息
const getTopSubacctInfo = (_this) => {
    let customerInfo = _this.oppBusiData.customerInfo;
    _this.oppBusiData.topacctInfo = [];
    _this.oppBusiData.topacctCode = "";
    return _this.$syscfg.K_Request("W0000119", {
        bex_codes: "YGT_A1160806",
        CUST_CODE: customerInfo.CUST_CODE,
        TOPACCT_CODE: ""
    }).then( res => {
        let topacctCode = _.get(res, "Data[0].TOPACCT_CODE", "");
        let topacctInfo = [];
        _this.oppBusiData.topacctCode = topacctCode;
        if (topacctCode) {
            return _this.$syscfg.K_Request("W0000119", {
                bex_codes: "YGT_A0001000",
                QUERY_MODE: "QUERY",
                F_FUNCTION: "991500010",
                TOPACCT_CODE: topacctCode,
                SUMMARY_FLAG: ""
            }).then( infoArr => {
                topacctInfo = _.get(infoArr, "Data", []);
                topacctInfo = _.filter(topacctInfo, topacctInfoItem => {
                    topacctInfoItem.TOPACCT_CODE = topacctCode;
                    topacctInfoItem.TOPACCT_NO = topacctCode;
                    return topacctInfoItem.CUST_STATUS != "9"
                });
                return dict.transformDict(topacctInfo, "CUST_STATUS").then( dictInfo => {
                    topacctInfo = dictInfo || [];
                    _this.oppBusiData.topacctInfo = topacctInfo;
                })
            })
        }
    }).catch( err => {
        throw err;
    })
}
//获取系统内证券账户
const setSysTrdacctArr = (_this) => {
    // 筛选证券账号
    let sysTrdacctArr = _.filter(_this.oppBusiData.oldBusiData.SYS_TRDACCT, (item) => {
        return item.TRDACCT_STATUS !== "9"
    });
    _this.oppBusiData.sysTrdacctArr = sysTrdacctArr;           
}
const setOldBusiData = (_this, res) => {
    let isOpenAcct = _this.$storage.getJsonSession(_this.$definecfg.IS_OPEN_ACCT_BIZ);  //0-新开客户、1是存量客户
    if (_.isEmpty(_this.oppBusiData.oldBusiData)) {
        _this.oppBusiData.oldBusiData = {};
    }
    if (!_.isEmpty(_.get(res, "[0].Data[0]", {}))) {
        //获取客户历史数据
        _.merge(_this.oppBusiData.oldBusiData, _.get(res, "[0].Data[0]", {}));
    }
    if (_.isEmpty(_this.oppBusiData.oldBusiData) && isOpenAcct == "0") {
        let sysCommonParam = _this.$storage.getJsonSession(_this.$definecfg.SYS_COMM_PARAM_OBJS);
        _this.oppBusiData.oldBusiData = {};
        _.merge(_this.oppBusiData.oldBusiData, customerInfo, { isOpenAcct: isOpenAcct }, { SYS_PARAM: sysCommonParam });
    }
    _.merge(_this.oppBusiData.oldBusiData, { RECOGNITE_TIME: date.getClientDateTime() });
    if (!_.isEmpty(res[5]) && _this.oppBusiData.oldBusiData.CUST_BASIC_INFO) {
        _.merge(_this.oppBusiData.oldBusiData, {
            CUST_BASIC_INFO: {
                AML_REMARK: res[5].AML_REMARK,
                FZ_ID_CODE: res[5].FZ_ID_CODE,
                FZ_ID_EXP_DATE: res[5].FZ_ID_EXP_DATE,
                FZ_ID_TYPE: res[5].FZ_ID_TYPE
            },
            CUST_OTHER_INFO: {
                CRITERION: res[5].CRITERION,
                RISK_FACTOR: res[5].RISK_FACTOR,
                CUST_CLS: res[5].CUST_CLS,
            }
        });
    }

}
/**
 * 根据字典项名称获取字典项
 * @param {Object} dictData 字典数组
 * @param {String} value 字典项名称
 * @returns 字典项
 */
 const getDictKeyByValue = function(dictData, value) {
    let dict = _.find(dictData, obj => {
        return obj.DICT_ITEM_NAME == value;
    })
    return _.isEmpty(dict) ? "" : dict.DICT_ITEM;
}
/**
 * 回填读卡数据
 * @param {Object} _this 
 * @param {String} moduleId 
 * @param {Object} fieldData 
 * @param {Object} ocrCardInfo 
 */
const backfillCardData = function(_this, moduleId, fieldData, ocrCardInfo) {
    if (!_.isEmpty(ocrCardInfo)) {
        // 证件信息
        if (moduleId.indexOf("CUST_CARD_INFO") != -1) {
            fieldData.CUST_FNAME.DEFAULT_VALUE = ocrCardInfo.CUST_FNAME;
            fieldData.ID_TYPE.DEFAULT_VALUE = ocrCardInfo.ID_TYPE;
            fieldData.ID_CODE.DEFAULT_VALUE = ocrCardInfo.ID_CODE;
            fieldData.ID_BEG_DATE.DEFAULT_VALUE = ocrCardInfo.ID_BEG_DATE;
            fieldData.ID_EXP_DATE.DEFAULT_VALUE = ocrCardInfo.ID_EXP_DATE;
            fieldData.ID_ADDR.DEFAULT_VALUE = utils.toCDB(ocrCardInfo.ID_ADDR);
            fieldData.BIRTHDAY.DEFAULT_VALUE = ocrCardInfo.BIRTHDAY;
            let sexValue = getDictKeyByValue(fieldData.SEX.FIELD_DICT_NAME, ocrCardInfo.SEX);
            if (_.isEmpty(fieldData.SEX.FIELD_DICT_NAME)) {
                if (ocrCardInfo.SEX.indexOf("男") > -1) {
                    sexValue = "0";
                }
                if (ocrCardInfo.SEX.indexOf("女") > -1) {
                    sexValue = "1";
                }
            }
            fieldData.SEX.DEFAULT_VALUE = sexValue;
        }
        //实际控制人
        if (moduleId.indexOf("CUST_CONTROLER_INFO") != -1) {
            fieldData.CONTROLER_ID_TYPE.DEFAULT_VALUE = "00";
            fieldData.CONTROLER_NAME.DEFAULT_VALUE = ocrCardInfo.CUST_NAME;
            setTimeout(function () {
                fieldData.CONTROLER_ID_NO.DEFAULT_VALUE = ocrCardInfo.ID_CODE;
                let f = fieldData.CONTROLER_SEX;
                let value = fieldData.CONTROLER_ID_NO.DEFAULT_VALUE;
                let sex = getSex(value);
                if (sex == "M") {
                    f.DEFAULT_VALUE = "0"; // 0-男性
                    // f.FIELD_CONTROL = "2";
                } else if (sex == "F") {
                    f.DEFAULT_VALUE = "1"; // 1-女性
                    // f.FIELD_CONTROL = "2";
                } else {
                    // f.FIELD_CONTROL = "0";
                    f.DEFAULT_VALUE = "";
                }
            }, 300)
            fieldData.REG_DATE.DEFAULT_VALUE = ocrCardInfo.BIRTHDAY;
            fieldData.CONTROLER_ID_EXP_DATE.DEFAULT_VALUE = ocrCardInfo.END_DATE;
            fieldData.REG_ADDR.DEFAULT_VALUE = ocrCardInfo.ID_ADDR;
        }
        //其他联系人
        if (moduleId.indexOf("CUST_OTHER_LINK_INFO") != -1) {
            fieldData.LINKMAN_ID_TYPE.DEFAULT_VALUE = "00";
            fieldData.LINKMAN_NAME.DEFAULT_VALUE = ocrCardInfo.CUST_NAME;
            setTimeout(function () {
                fieldData.LINKMAN_ID.DEFAULT_VALUE = ocrCardInfo.ID_CODE;
            }, 300)
            fieldData.LINKMAN_EXP_DATE.DEFAULT_VALUE = ocrCardInfo.END_DATE;
            let f = fieldData.LINKMAN_SEX;
            let value = ocrCardInfo.ID_CODE;
            let sex = getSex(value);
            if (sex == "M") {
                f.DEFAULT_VALUE = "0"; // 0-男性
                // f.FIELD_CONTROL = "2";
            } else if (sex == "F") {
                f.DEFAULT_VALUE = "1"; // 1-女性
                // f.FIELD_CONTROL = "2";
            } else {
                // f.FIELD_CONTROL = "0";
                f.DEFAULT_VALUE = "";
            }
        }
        //实际受益人
        if (moduleId.indexOf("CUST_BENEFICIARY_INFO") != -1) {
            fieldData.BENEFICIARY_ID_TYPE.DEFAULT_VALUE = "00";
            fieldData.BENEFICIARY_NAME.DEFAULT_VALUE = ocrCardInfo.CUST_NAME;
            setTimeout(function () {
                fieldData.BENEFICIARY_ID.DEFAULT_VALUE = ocrCardInfo.ID_CODE;
                let f = fieldData.SEX;
                let value = fieldData.BENEFICIARY_ID.DEFAULT_VALUE;
                let sex = getSex(value);
                if (sex == "M") {
                    f.DEFAULT_VALUE = "0"; // 0-男性
                    // f.FIELD_CONTROL = "2";
                } else if (sex == "F") {
                    f.DEFAULT_VALUE = "1"; // 1-女性
                    // f.FIELD_CONTROL = "2";
                } else {
                    // f.FIELD_CONTROL = "0";
                    f.DEFAULT_VALUE = "";
                }
            }, 300)
            fieldData.BENEFICIARY_EXP_DATE.DEFAULT_VALUE = ocrCardInfo.END_DATE;
            fieldData.BIRTHDAY.DEFAULT_VALUE = ocrCardInfo.BIRTHDAY;
            fieldData.BENEFICIARY_ADDR.DEFAULT_VALUE = ocrCardInfo.ID_ADDR;
           
        }
        //监护人
        if (moduleId.indexOf("CUST_GUARDIAN_INFO") != -1) {
            fieldData.GUARDIAN_ID_TYPE.DEFAULT_VALUE = "00";
            fieldData.GUARDIAN_NAME.DEFAULT_VALUE = ocrCardInfo.CUST_NAME;
            setTimeout(function () {
                fieldData.GUARDIAN_ID.DEFAULT_VALUE = ocrCardInfo.ID_CODE;
            }, 300)
            fieldData.GUARDIAN_EXP_DATE.DEFAULT_VALUE = ocrCardInfo.END_DATE;
        }
        // 由于此函数是在 activated 中调用的，需要 set 一下，以刷新视图。否则回填的数据不会展示出来
        _this.$set(_this, "groupDatas", _this.groupDatas);
    }
}
const V0049_CUST = _.merge(
        _.cloneDeep(bizCustBasicInfoNode),
        _.cloneDeep(bizCustLinkInfoNode),
        _.cloneDeep(bizActualControllerNode),
        _.cloneDeep(bizCustOtherLinkNode),
        _.cloneDeep(bizCustBeneficiaryInfoNode),
        _.cloneDeep(bizProCreditRecordInfoNode),
        _.cloneDeep(bizCustTaxInfoNode),
        {
            'beforeLoadBiz': (_this) => {
                //获取机构代码
                let userInfo = _this.$storage.getJsonSession(_this.$definecfg.USER_INFO);
                let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
                _this.oppBusiData.INT_ORG = userInfo.ORG_CODE ? userInfo.ORG_CODE : "";
    
                if(_.isEmpty(_this.oppBusiData.customerInfo)) {
                    _this.oppBusiData.customerInfo = customerInfo;
                }
                return Promise.all([
                    //获取客户历史数据oldBusiData
                    customerInfo && customerInfo.CUST_CODE && W0000312(_this, {
                        "sysParamKeys": "ACCT_TYPE,ID_TYPE,APP_POLICE_VALIDATE,APP_AML_RISK_FLAG,APP_IS_OPEN_SECONDARY_DOC,IS_MUST_POLICE_VALIDATE,APP_EMAIL_VALID_SWITCH,APP_EMAIL_VALID_TIME,APP_MSG_VALID_SWITCH,MSG_VALID_TIME,APP_VOICE_MSG_VALID_SWITCH",
                        "USER_TYPE": customerInfo.USER_TYPE,
                        "CUST_CODE": customerInfo.CUST_CODE,
                        ID_TYPE: customerInfo.ID_TYPE,
                        ID_CODE: customerInfo.ID_CODE,
                        USER_TYPE: customerInfo.USER_TYPE,
                        CUST_FNAME: customerInfo.CUST_FNAME,
                        "AGENT_USER_CODE": ""
                    }),
                    csdsSerivce.queryCSDCTime(),
                    oppService.getBusiCommonParams(_this.busiCode),
                    getValidIdTypeData(_this),
                    getDictArrData(_this),
                    YG003660(_this),
                    getCSDCYmtData(_this),
                    getTopSubacctInfo(_this),
                    Y1000200(_this)
                ]).then(res => {
                    
                    setOldBusiData(_this, res);
                    setSysTrdacctArr(_this)
                    let oppCustInfo = {};
                    if (_.isEmpty(_this.oppBusiData.newBusiData)) {
                        _this.oppBusiData.newBusiData = {};
                    }
    
                    //客户原始数据（落地数据）保存到缓存
                    _this.$storage.setSession(_this.$definecfg.CUST_ORIGINAL_DATA, _this.oppBusiData.oldBusiData);
                    _.merge(_this.oppBusiData.newBusiData, _this.oppBusiData.oldBusiData, oppCustInfo);
                    if (res[2]) {
                        _this.$storage.setSession(_this.$definecfg.BUSI_COMM_PARAM, res[2]);
                        //业务公共参数转为对象，方便取值 @linsc
                        let busiCommonParams = {};
                        _.each(res[2] || [], (obj) => {
                            busiCommonParams[obj.PARAM_CODE] = obj.PARAM_VALUE
                        });
                        _this.$storage.setSession(_this.$definecfg.BUSI_COMM_PARAM_OBJS, busiCommonParams);
                    }
                    _this.oppBusiData.busiCommonParams = _this.$storage.getJsonSession(_this.$definecfg.BUSI_COMM_PARAM_OBJS);
                    _this.oppBusiData.IS_IN_ZD_TIME = res[1];
                    return Promise.all([
                        bizCustBasicInfoNode.bizCustBasicInfoNodeBeforeLoadBiz && bizCustBasicInfoNode.bizCustBasicInfoNodeBeforeLoadBiz(_this),
                        bizCustLinkInfoNode.bizCustLinkInfoNodeBeforeLoadBiz && bizCustLinkInfoNode.bizCustLinkInfoNodeBeforeLoadBiz(_this),
                        bizActualControllerNode.bizActualControllerNodeBeforeLoadBiz && bizActualControllerNode.bizActualControllerNodeBeforeLoadBiz(_this,),
                        bizCustOtherLinkNode.bizCustOtherLinkNodeBeforeLoadBiz && bizCustOtherLinkNode.bizCustOtherLinkNodeBeforeLoadBiz(_this),
                        bizCustBeneficiaryInfoNode.bizCustBeneficiaryInfoNodeBeforeLoadBiz && bizCustBeneficiaryInfoNode.bizCustBeneficiaryInfoNodeBeforeLoadBiz(_this),
                        bizProCreditRecordInfoNode.bizProCreditRecordInfoBeforeLoadBiz && bizProCreditRecordInfoNode.bizProCreditRecordInfoBeforeLoadBiz(_this),
                        bizCustTaxInfoNode.bizCustTaxInfoNodeBeforeLoadBiz && bizCustTaxInfoNode.bizCustTaxInfoNodeBeforeLoadBiz(_this)
    
                    ])
                }).catch(err => {
                    _this.messageBox({
                        hasMask: true,
                        messageText: "查询失败，请重试",
                        confirmButtonText: '重新查询',
                        cancelButtonText: '返回首页',
                        typeMessage: 'warn',
                        showMsgBox: true,
                        confirmedAction: () => {
                            _this.refreshPage();
                        },
                        canceledAction: function () {
                            _this.$router.push(_this.$bizhomecfg.getHomeCustomerConfig());
                        },
                    })
                    throw err;
                })
            },
            "afterLoadBiz": (_this) => {
                return Promise.all([
                    bizCustBasicInfoNode.bizCustBasicInfoNodeAfterLoadBiz && bizCustBasicInfoNode.bizCustBasicInfoNodeAfterLoadBiz(_this),
                    bizCustLinkInfoNode.bizCustLinkInfoNodeAfterLoadBiz && bizCustLinkInfoNode.bizCustLinkInfoNodeAfterLoadBiz(_this),
                    bizActualControllerNode.bizActualControllerNodeAfterLoadBiz && bizActualControllerNode.bizActualControllerNodeAfterLoadBiz(_this),
                    bizCustOtherLinkNode.bizCustOtherLinkNodeAfterLoadBiz && bizCustOtherLinkNode.bizCustOtherLinkNodeAfterLoadBiz(_this),
                    bizCustBeneficiaryInfoNode.bizCustBeneficiaryInfoNodeAfterLoadBiz && bizCustBeneficiaryInfoNode.bizCustBeneficiaryInfoNodeAfterLoadBiz(_this),
                    bizProCreditRecordInfoNode.bizProCreditRecordInfoAfterLoadBiz && bizProCreditRecordInfoNode.bizProCreditRecordInfoAfterLoadBiz(_this),
                    bizCustTaxInfoNode.bizCustTaxInfoNodeAfterLoadBiz && bizCustTaxInfoNode.bizCustTaxInfoNodeAfterLoadBiz(_this),
                ]).then(res => {
                    //保存就数据 到oppBusiData 用于对比
                    _this.oppBusiData.oldGroupDatas = _.cloneDeep(_this.oldGroupDatas);
                    return;
                })
            },
            "addModule": (_this, moduleld, fieldData) => {
                if (moduleld == "CUST_OTHER_LINK_INFO") {
                    let maxLength = _this.oppBusiData.MAX_OTHER_LINKER;
                    if (_this.groupDatas.LINK_INFO.CUST_OTHER_LINK_INFO.length >= maxLength) {
                        _this.$blMethod.showMsgBox(_this, "个人其他联系人数量最大值为" + maxLength + ",不能再添加!");
                        return false;
                    } else {
                        // 其他联系人 姓名 或者 电话 其他一项必填, 则这两个字段都必填
                        if (fieldData.LINKMAN_NAME.DEFAULT_VALUE != '') {
                            if (fieldData.LINKMAN_MOBILE_TEL.DEFAULT_VALUE != '') {
                                return true;
                            } else {
                                _this.$blMethod.showMsgBox(_this, "填写了姓名字段,必须填写手机号码字段!");
                                return false;
                            }
                        }
                        if (fieldData.LINKMAN_MOBILE_TEL.DEFAULT_VALUE != '') {
                            if (fieldData.LINKMAN_NAME.DEFAULT_VALUE != '') {
                                return true;
                            } else {
                                _this.$blMethod.showMsgBox(_this, "填写了手机号码字段,必须填写姓名字段!");
                                return false;
                            }
                        }
                        return true;
                    }
                }else {
                    return true;
                }
            },
            "addModuleFinished": (_this, fieldData) => {
                if (_this.moduleId.indexOf("CUST_TAX_INFO_MODULE4") != -1) {
                    bizCustTaxInfoNode.custTaxInfoAddModuleFinished && bizCustTaxInfoNode.custTaxInfoAddModuleFinished(_this, fieldData);
                }
                if (_this.moduleId.indexOf("CUST_BENEFICIARY_INFO") != -1) { 
                    bizCustBeneficiaryInfoNode.bizCustBeneficiaryInfoNodeAddModuleFinished && bizCustBeneficiaryInfoNode.bizCustBeneficiaryInfoNodeAddModuleFinished(_this, fieldData);
                }
                if (_this.moduleId.indexOf("CREDIT_RECORD_INFO") != -1) {
                    bizProCreditRecordInfoNode.bizProCreditRecordInfoNodeAddModuleFinished && bizProCreditRecordInfoNode.bizProCreditRecordInfoNodeAddModuleFinished(_this, fieldData);
                }
            },
            "deleteModuleFinished": (_this, deleteObj, moduleData) => {
                if (_this.moduleId.indexOf("CUST_CONTROLER_INFO") > -1) {
                    bizActualControllerNode.CONTROLERINFO_DELETE_MODULE_FINISHED && bizActualControllerNode.CONTROLERINFO_DELETE_MODULE_FINISHED(_this, deleteObj);
                }
                if (_this.moduleId.indexOf("CUST_OTHER_LINK_INFO") > -1) {
                    bizCustOtherLinkNode.OTHERLINKINFO_DELETE_MODULE_FINISHED && bizCustOtherLinkNode.OTHERLINKINFO_DELETE_MODULE_FINISHED(_this, deleteObj);
                }
                if (_this.moduleId.indexOf("CUST_BENEFICIARY_INFO") > -1) {
                    bizCustBeneficiaryInfoNode.BENEFICIARYINFO_DELETE_MODULE_FINISHED && bizCustBeneficiaryInfoNode.BENEFICIARYINFO_DELETE_MODULE_FINISHED(_this, deleteObj);
                }
                if (_this.moduleId.indexOf("CREDIT_RECORD_INFO") > -1) {
                    bizProCreditRecordInfoNode.CREDITRECORDINFO__DELETE_MODULE_FINISHED && bizProCreditRecordInfoNode.CREDITRECORDINFO__DELETE_MODULE_FINISHED(_this, deleteObj);
                }
            },
            "deleteModule": (_this, moduleld, fieldData) => {
                return true
            },
            "pageActivated": (_this) => {
                let goBackInfo = _this.$route.query;
                // 是否从读卡界面返回
                if (!_.isEmpty(goBackInfo.from) && goBackInfo.from == "readCard") {
                    let moduleId = goBackInfo.moduleId;
                    let fieldData = _this.groupDatas[_this.groupId][moduleId][0].FIELDS;
                    // 回填读卡数据
                    backfillCardData(_this, moduleId, fieldData, goBackInfo.cardInfo);
                }
                _this.$refs.flowTip.flowTips = [];
                //开户机构
                if (_this.moduleId.indexOf("CUST_CARD_INFO") != -1 || _this.moduleId.indexOf("CUST_FZCARD_INFO") != -1 || _this.moduleId.indexOf("CUST_EXPERIENCE_INFO") != -1) {
                    bizCustBasicInfoNode.bizCustBasicInfoNodePageActivated && bizCustBasicInfoNode.bizCustBasicInfoNodePageActivated(_this)
                }
                //联系信息
                if (_this.moduleId.indexOf("CUST_LINK_INFO") != -1) {
                    bizCustLinkInfoNode.bizCustLinkInfoNodePageActivated && bizCustLinkInfoNode.bizCustLinkInfoNodePageActivated(_this);
                }
                //实际控制人
                if (_this.moduleId.indexOf("CUST_CONTROLER_INFO") != -1) {
                    bizActualControllerNode.bizActualControllerNodePageActivated && bizActualControllerNode.bizActualControllerNodePageActivated(_this);
                }
                //其他联系人信息
                if (_this.moduleId.indexOf("CUST_OTHER_LINK_INFO") != -1) {
                    bizCustOtherLinkNode.bizCustOtherLinkNodePageActivated && bizCustOtherLinkNode.bizCustOtherLinkNodePageActivated(_this)
                }
                //受益人信息
                if (_this.moduleId.indexOf("CUST_BENEFICIARY_INFO") != -1) {
                    bizCustBeneficiaryInfoNode.bizCustBeneficiaryInfoNodePageActivated && bizCustBeneficiaryInfoNode.bizCustBeneficiaryInfoNodePageActivated(_this)
                }
                //不良诚信记录
                if (_this.moduleId.indexOf("CREDIT_RECORD_INFO") != -1) {
                    bizProCreditRecordInfoNode.bizProCreditRecordInfoPageActived && bizProCreditRecordInfoNode.bizProCreditRecordInfoPageActived(_this)
                }
                //涉税信息
                if (_this.moduleId.indexOf("ORG_TAX_INFO") != -1 ||
                    _this.moduleId.indexOf("ORG_TAX_BASIC_INFO") != -1 ||
                    _this.moduleId.indexOf("CUST_TAX_INFO_MODULE2") != -1 ||
                    _this.moduleId.indexOf("CUST_TAX_INFO_MODULE3") != -1 ||
                    _this.moduleId.indexOf("CUST_TAX_INFO_MODULE4") != -1 ||
                    _this.moduleId.indexOf("TAX_ASSET_INFO") != -1 ||
                    _this.moduleId.indexOf("TAX_PAYMENT_INFO") != -1 ||
                    _this.moduleId.indexOf("CUST_TAX_INFO_MODULE6") != -1) {
                    bizCustTaxInfoNode.bizCustTaxInfoNodePageActivated && bizCustTaxInfoNode.bizCustTaxInfoNodePageActivated(_this)
                }
            },
            'beforeSave': (_this, params) => {
                if (!_this.moduleId) {
                    return;
                }
                if (_this.moduleId.indexOf("CUST_CARD_INFO") != -1 || _this.moduleId.indexOf("CUST_FZCARD_INFO") != -1 || _this.moduleId.indexOf("CUST_EXPERIENCE_INFO") != -1) {
                    bizCustBasicInfoNode.bizCustBasicInfoNodeBeforeSave && bizCustBasicInfoNode.bizCustBasicInfoNodeBeforeSave(_this, params);
                }
                if (_this.moduleId.indexOf("CUST_LINK_INFO") != -1) {
                    bizCustLinkInfoNode.bizCustLinkInfoNodeBeforeSave && bizCustLinkInfoNode.bizCustLinkInfoNodeBeforeSave(_this, params);
                }
                //实际控制人
                if (_this.moduleId.indexOf("CUST_CONTROLER_INFO") != -1) {
                    bizActualControllerNode.bizActualControllerNodeBeforeSave && bizActualControllerNode.bizActualControllerNodeBeforeSave(_this, params);
                }
                //其他联系人信息
                if (_this.moduleId.indexOf("CUST_OTHER_LINK_INFO") != -1) {
                    bizCustOtherLinkNode.bizCustOtherLinkNodeBeforeSave && bizCustOtherLinkNode.bizCustOtherLinkNodeBeforeSave(_this, params)
                }
                //受益人信息
                if (_this.moduleId.indexOf("CUST_BENEFICIARY_INFO") != -1) {
                    bizCustBeneficiaryInfoNode.bizCustBeneficiaryInfoNodeBeforeSave && bizCustBeneficiaryInfoNode.bizCustBeneficiaryInfoNodeBeforeSave(_this, params)
                }
                //不良诚信记录
                if (_this.moduleId.indexOf("CREDIT_RECORD_INFO") != -1) {
                    bizProCreditRecordInfoNode.bizProCreditRecordInfoBeforeSave && bizProCreditRecordInfoNode.bizProCreditRecordInfoBeforeSave(_this, params)
                }
                //涉税信息
                if (_this.moduleId.indexOf("ORG_TAX_INFO") != -1 ||
                    _this.moduleId.indexOf("ORG_TAX_BASIC_INFO") != -1 ||
                    _this.moduleId.indexOf("CUST_TAX_INFO_MODULE2") != -1 ||
                    _this.moduleId.indexOf("CUST_TAX_INFO_MODULE3") != -1 ||
                    _this.moduleId.indexOf("CUST_TAX_INFO_MODULE4") != -1 ||
                    _this.moduleId.indexOf("TAX_ASSET_INFO") != -1 ||
                    _this.moduleId.indexOf("TAX_PAYMENT_INFO") != -1 ||
                    _this.moduleId.indexOf("CUST_TAX_INFO_MODULE6") != -1) {
                    bizCustTaxInfoNode.bizCustTaxInfoNodeBeforeSave && bizCustTaxInfoNode.bizCustTaxInfoNodeBeforeSave(_this, params)
                }
                _this.oppBusiData.copyCurrentGroupData = _.cloneDeep(_this.groupDatas);
            },
            //保存完成之后的回调
            "afterSave": (_this, res) => {
                if (!_this.moduleId) {
                    return;
                }
                let newData = _.get(res, "Data[0]", {});
                let fromName = _this.$router.getCurrentRoute().fromName;
                let isRejcet = _this.$storage.getSession(_this.$definecfg.IS_REJECT);
                let rejectModuleInfo = _this.$storage.getJsonSession(_this.$definecfg.REJECT_MODULE_INFO);

                //证件信息
                if (_this.moduleId.indexOf("CUST_CARD_INFO") != -1 || _this.moduleId.indexOf("CUST_FZCARD_INFO") != -1) {
                    bizCustBasicInfoNode.bizCustBasicInfoNodeAfterSave && bizCustBasicInfoNode.bizCustBasicInfoNodeAfterSave(_this, newData);
                    if(isRejcet == 1 && rejectModuleInfo.CUST_INFO_MODIFY_CARD){
                        delete rejectModuleInfo.CUST_INFO_MODIFY_CARD;
                        _this.$storage.setSession(_this.$definecfg.REJECT_MODULE_INFO, rejectModuleInfo);
                    }
                    _this.$router.goRoute("信息列表", {fromName: fromName});
                    return false;
                }
                //基本信息1
                if(_this.moduleId.indexOf("CUST_EXPERIENCE_INFO") != -1){
                    bizCustBasicInfoNode.bizCustBasicInfoNodeAfterSave && bizCustBasicInfoNode.bizCustBasicInfoNodeAfterSave(_this, newData);
                }
                //基本信息2：不良诚信记录
                if (_this.moduleId.indexOf("CREDIT_RECORD_INFO") != -1) {
                    bizProCreditRecordInfoNode.bizProCreditRecordInfoAfterSave && bizProCreditRecordInfoNode.bizProCreditRecordInfoAfterSave(_this, newData)
                    
                    if(isRejcet == 1 && rejectModuleInfo.CUST_INFO_MODIFY){
                        delete rejectModuleInfo.CUST_INFO_MODIFY;
                        _this.$storage.setSession(_this.$definecfg.REJECT_MODULE_INFO, rejectModuleInfo);
                    }
                    _this.$router.goRoute("信息列表", {fromName: fromName});
                    return false;
                }
                //联系信息
                if (_this.moduleId.indexOf("CUST_LINK_INFO") != -1) {
                    bizCustLinkInfoNode.bizCustLinkInfoNodeAfterSave && bizCustLinkInfoNode.bizCustLinkInfoNodeAfterSave(_this, newData);
                }
                //其他联系人信息
                if (_this.moduleId.indexOf("CUST_OTHER_LINK_INFO") != -1) {
                    bizCustOtherLinkNode.bizCustOtherLinkNodeAfterSave && bizCustOtherLinkNode.bizCustOtherLinkNodeAfterSave(_this, newData);
                    if(isRejcet == 1 && rejectModuleInfo.CUST_INFO_MODIFY_LINK){
                        delete rejectModuleInfo.CUST_INFO_MODIFY_LINK;
                        _this.$storage.setSession(_this.$definecfg.REJECT_MODULE_INFO, rejectModuleInfo);
                    }
                    _this.$router.goRoute("信息列表", {fromName: fromName});
                    return false;
                }
                //实际控制人
                if (_this.moduleId.indexOf("CUST_CONTROLER_INFO") != -1) {
                    bizActualControllerNode.bizActualControllerNodeAfterSave && bizActualControllerNode.bizActualControllerNodeAfterSave(_this, newData);
                }

                //受益人信息
                if (_this.moduleId.indexOf("CUST_BENEFICIARY_INFO") != -1) {
                    bizCustBeneficiaryInfoNode.bizCustBeneficiaryInfoNodeAfterSave && bizCustBeneficiaryInfoNode.bizCustBeneficiaryInfoNodeAfterSave(_this, newData);
                    if(isRejcet == 1 && rejectModuleInfo.CUST_INFO_MODIFY_RELA){
                        delete rejectModuleInfo.CUST_INFO_MODIFY_RELA;
                        _this.$storage.setSession(_this.$definecfg.REJECT_MODULE_INFO, rejectModuleInfo);
                    }
                    _this.$router.goRoute("信息列表", {fromName: fromName});
                    return false;
                }
                //涉税信息
                if (_this.moduleId.indexOf("ORG_TAX_INFO") != -1 ||
                    _this.moduleId.indexOf("ORG_TAX_BASIC_INFO") != -1 ||
                    _this.moduleId.indexOf("CUST_TAX_INFO_MODULE2") != -1 ||
                    _this.moduleId.indexOf("CUST_TAX_INFO_MODULE3") != -1 ||
                    _this.moduleId.indexOf("CUST_TAX_INFO_MODULE4") != -1 ||
                    _this.moduleId.indexOf("TAX_ASSET_INFO") != -1 ||
                    _this.moduleId.indexOf("TAX_PAYMENT_INFO") != -1 ||
                    _this.moduleId.indexOf("CUST_TAX_INFO_MODULE6") != -1) {
                    bizCustTaxInfoNode.bizCustTaxInfoNodeAfterSave && bizCustTaxInfoNode.bizCustTaxInfoNodeAfterSave(_this, newData);
                    if(isRejcet == 1 && rejectModuleInfo.CUST_INFO_MODIFY_ADEQ){
                        delete rejectModuleInfo.CUST_INFO_MODIFY_ADEQ;
                        _this.$storage.setSession(_this.$definecfg.REJECT_MODULE_INFO, rejectModuleInfo);
                    }
                    if(_this.moduleId.indexOf("ORG_TAX_INFO") != -1 ){
                        if(_this.groupDatas.APPR_INFO.ORG_TAX_INFO[0].FIELDS.TAX_RESIDENT_TYPE.DEFAULT_VALUE == "1"){
                            _this.$router.goRoute("信息列表", {fromName: fromName});
                            return false;
                        }
                    }
                    if(_this.moduleId.indexOf("CUST_TAX_INFO_MODULE4") != -1 ){
                        _this.$router.goRoute("信息列表", {fromName: fromName});
                        return false;
                    }
                }
            },
    
            validate: function (_this) {
                let validateFnArr = [];
                if (_this.moduleId.indexOf("CUST_CARD_INFO") != -1 || _this.moduleId.indexOf("CUST_FZCARD_INFO") != -1 || _this.moduleId.indexOf("CUST_EXPERIENCE_INFO") != -1) {
                    //客户三要素 客户信息 页面保存函数
                    bizCustBasicInfoNode.bizCustBasicInfoNodeValidate && validateFnArr.push( bizCustBasicInfoNode.bizCustBasicInfoNodeValidate(_this) );
                }
                if (_this.moduleId.indexOf("CUST_LINK_INFO") != -1) {
                    bizCustLinkInfoNode.bizCustLinkInfoNodeValidate && validateFnArr.push(bizCustLinkInfoNode.bizCustLinkInfoNodeValidate(_this))
                }
                if (_this.moduleId.indexOf("CUST_OTHER_LINK_INFO") != -1) {
                    bizCustOtherLinkNode.bizCustOtherLinkNodeValidate && validateFnArr.push(bizCustOtherLinkNode.bizCustOtherLinkNodeValidate(_this))
                }
                if (_this.moduleId.indexOf("CUST_CONTROLER_INFO") != -1) {
                    bizActualControllerNode.bizActualControllerNodeValidate && validateFnArr.push(bizActualControllerNode.bizActualControllerNodeValidate(_this))
                }
                if (_this.moduleId.indexOf("CREDIT_RECORD_INFO") != -1) {
                    bizProCreditRecordInfoNode.bizProCreditRecordInfoValidate && validateFnArr.push(bizProCreditRecordInfoNode.bizProCreditRecordInfoValidate(_this))
                }
                if(_this.moduleId.indexOf("ORG_TAX_INFO") != -1 ||
                        _this.moduleId.indexOf("ORG_TAX_BASIC_INFO") != -1 ||
                        _this.moduleId.indexOf("CUST_TAX_INFO_MODULE2") != -1||
                        _this.moduleId.indexOf("CUST_TAX_INFO_MODULE3") != -1 ||
                        _this.moduleId.indexOf("CUST_TAX_INFO_MODULE4") != -1) {
                    bizCustTaxInfoNode.bizCustTaxInfoNodeValidate && validateFnArr.push(bizCustTaxInfoNode.bizCustTaxInfoNodeValidate(_this));
                }
                if(_this.moduleId.indexOf("CUST_BENEFICIARY_INFO") != -1){
                    bizCustBeneficiaryInfoNode.bizCustBeneficiaryInfoNodeValidate&& validateFnArr.push(bizCustBeneficiaryInfoNode.bizCustBeneficiaryInfoNodeValidate(_this));
                }
                return Promise.all(validateFnArr).then( res => {
                    if (_.includes(res, false)) {
                        return false;
                    }
                    if (this.ishavTipError(_this)) {
                        return false;
                    }
                })
            },
    
            preValidate: function (_this) {
                return true;
    
            },
            //返回导航栏校验
            goBackListValidate: function(_this) {
                //返回导航栏的时候 还原数据 不做保存
                let groupId = _this.groupId;
                // let moduleId = _this.moduleId;
                _.each(_this.groupDatas[groupId], (item, key) => {
                    _this.groupDatas[groupId][key] = _.cloneDeep(_this.oppBusiData.copyCurrentGroupData[groupId][key]);
                })
                _this.moduleDatas = {};
                _this.changedField = [];
            },
    
            /********************************************审核*********************************************************/
            //读卡按钮触发事件
            "readModule": (_this, moduleId, fieldData) => {
                _this.ocrCardType = "0";
                _this.$router.goModule("readCardModule", {"moduleId": moduleId});
    
            },
    
            //读卡数据返回
            "readModuleCardInfoAction": (_this, moduleId, fieldData, ocrCardInfo) => {
                if (!_.isEmpty(ocrCardInfo)) {
                    //实际控制人
                    if (moduleId.indexOf("CUST_CONTROLER_INFO") != -1) {
                        fieldData.CONTROLER_ID_TYPE.DEFAULT_VALUE = "00";
                        fieldData.CONTROLER_NAME.DEFAULT_VALUE = ocrCardInfo.CUST_NAME;
                        setTimeout(function () {
                            fieldData.CONTROLER_ID_NO.DEFAULT_VALUE = ocrCardInfo.ID_CODE;
                            let f = fieldData.CONTROLER_SEX;
                            let value = fieldData.CONTROLER_ID_NO.DEFAULT_VALUE;
                            let sex = getSex(value);
                            if (sex == "M") {
                                f.DEFAULT_VALUE = "0"; // 0-男性
                                // f.FIELD_CONTROL = "2";
                            } else if (sex == "F") {
                                f.DEFAULT_VALUE = "1"; // 1-女性
                                // f.FIELD_CONTROL = "2";
                            } else {
                                // f.FIELD_CONTROL = "0";
                                f.DEFAULT_VALUE = "";
                            }
                        }, 300)
                        fieldData.REG_DATE.DEFAULT_VALUE = ocrCardInfo.BIRTHDAY;
                        fieldData.CONTROLER_ID_EXP_DATE.DEFAULT_VALUE = ocrCardInfo.END_DATE;
                        fieldData.REG_ADDR.DEFAULT_VALUE = ocrCardInfo.ID_ADDR;
                    }
                    //其他联系人
                    if (moduleId.indexOf("CUST_OTHER_LINK_INFO") != -1) {
                        fieldData.LINKMAN_ID_TYPE.DEFAULT_VALUE = "00";
                        fieldData.LINKMAN_NAME.DEFAULT_VALUE = ocrCardInfo.CUST_NAME;
                        setTimeout(function () {
                            fieldData.LINKMAN_ID.DEFAULT_VALUE = ocrCardInfo.ID_CODE;
                        }, 300)
                        fieldData.LINKMAN_EXP_DATE.DEFAULT_VALUE = ocrCardInfo.END_DATE;
                        let f = fieldData.LINKMAN_SEX;
                        let value = ocrCardInfo.ID_CODE;
                        let sex = getSex(value);
                        if (sex == "M") {
                            f.DEFAULT_VALUE = "0"; // 0-男性
                            // f.FIELD_CONTROL = "2";
                        } else if (sex == "F") {
                            f.DEFAULT_VALUE = "1"; // 1-女性
                            // f.FIELD_CONTROL = "2";
                        } else {
                            // f.FIELD_CONTROL = "0";
                            f.DEFAULT_VALUE = "";
                        }
                    }
                    //实际受益人
                    else if (moduleId.indexOf("CUST_BENEFICIARY_INFO") != -1) {
                        fieldData.BENEFICIARY_ID_TYPE.DEFAULT_VALUE = "00";
                        fieldData.BENEFICIARY_NAME.DEFAULT_VALUE = ocrCardInfo.CUST_NAME;
                        setTimeout(function () {
                            fieldData.BENEFICIARY_ID.DEFAULT_VALUE = ocrCardInfo.ID_CODE;
                            let f = fieldData.SEX;
                            let value = fieldData.BENEFICIARY_ID.DEFAULT_VALUE;
                            let sex = getSex(value);
                            if (sex == "M") {
                                f.DEFAULT_VALUE = "0"; // 0-男性
                                // f.FIELD_CONTROL = "2";
                            } else if (sex == "F") {
                                f.DEFAULT_VALUE = "1"; // 1-女性
                                // f.FIELD_CONTROL = "2";
                            } else {
                                // f.FIELD_CONTROL = "0";
                                f.DEFAULT_VALUE = "";
                            }
                        }, 300)
                        fieldData.BENEFICIARY_EXP_DATE.DEFAULT_VALUE = ocrCardInfo.END_DATE;
                        fieldData.BIRTHDAY.DEFAULT_VALUE = ocrCardInfo.BIRTHDAY;
                        fieldData.BENEFICIARY_ADDR.DEFAULT_VALUE = ocrCardInfo.ID_ADDR;
                       
                    }
                    //监护人
                    if (moduleId.indexOf("CUST_GUARDIAN_INFO") != -1) {
                        fieldData.GUARDIAN_ID_TYPE.DEFAULT_VALUE = "00";
                        fieldData.GUARDIAN_NAME.DEFAULT_VALUE = ocrCardInfo.CUST_NAME;
                        setTimeout(function () {
                            fieldData.GUARDIAN_ID.DEFAULT_VALUE = ocrCardInfo.ID_CODE;
                        }, 300)
                        fieldData.GUARDIAN_EXP_DATE.DEFAULT_VALUE = ocrCardInfo.END_DATE;
    
                    }
                }
            },
            //自定义按钮 公安联网/中登手机号码核查
            "customizeModule": (_this, moduleId, fieldData) => {
                if (moduleId == "CUST_LINK_INFO") {
                    bizCustLinkInfoNode.CHECK_LINKINFO_CUSTOMEIZE_MODULE && bizCustLinkInfoNode.CHECK_LINKINFO_CUSTOMEIZE_MODULE(_this, moduleId, fieldData)
                    return;
                }
                let ID_TYPE = '',
                    ID_CODE = '',
                    USER_NAME = '',
                    moduleIdCopy = moduleId;
    
                if (moduleIdCopy.indexOf("CUST_CARD_INFO") != -1) {
                    ID_TYPE = fieldData.ID_TYPE.DEFAULT_VALUE;
                    USER_NAME = fieldData.CUST_FNAME.DEFAULT_VALUE;
                    ID_CODE = fieldData.ID_CODE.DEFAULT_VALUE;
                }
                if (moduleIdCopy.indexOf("CUST_GUARDIAN_INFO") != -1) {
                    ID_TYPE = fieldData.GUARDIAN_ID_TYPE.DEFAULT_VALUE;
                    USER_NAME = fieldData.GUARDIAN_NAME.DEFAULT_VALUE;
                    ID_CODE = fieldData.GUARDIAN_ID.DEFAULT_VALUE;
                }
                if (moduleIdCopy.indexOf("CUST_BENEFICIARY_INFO") != -1){
                    ID_TYPE = fieldData.BENEFICIARY_ID_TYPE.DEFAULT_VALUE;
                    USER_NAME = fieldData.BENEFICIARY_NAME.DEFAULT_VALUE;
                    ID_CODE = fieldData.BENEFICIARY_ID.DEFAULT_VALUE;
                }
                if (!ID_TYPE) {
                    alert("公安联网校验，证件类型不能为空！");
                    return;
                }else if (ID_TYPE != "00" && ID_TYPE != "08")  {
                    bizPublicMethod.$blMethod.showMsgBox(_this, "证件类型不是身份证或临时身份证，不支持公安联网校验！");
                    return;
                }
                if (!ID_CODE || !USER_NAME) {
                    bizPublicMethod.$blMethod.showMsgBox(_this, "证件号码和姓名不能为空");
                    return;
                }
    
                //校验姓名中是否有生僻字
                if (!_this.$blMethod.isCommonChar(USER_NAME)) {
                    bizPublicMethod.$blMethod.showMsgBox(_this, "姓名包含生僻字，不支持公安联网校验!")
                    return;
                }
    
                //获取机构代码
                let userInfo = _this.$storage.getJsonSession(_this.$definecfg.USER_INFO);
                let params = {
                    ID_CODE: ID_CODE,
                    CUST_NAME: USER_NAME,
                    CUST_FNAME: USER_NAME,
                    ID_TYPE: ID_TYPE,
                    CUST_ORG_CODE: userInfo.ORG_CODE,
                    USER_NAME: USER_NAME
                }
                
                loading.open("正在进行公安联网校验！") ;
                custSerivce.runPoliceValidate(params).then(data => {
                    _this.oppBusiData.isCscdAndPoliceChecked = true;
                    if (data.flag === true) {
                        custSerivce.syncIdCardChkFlag(ID_TYPE, ID_CODE, USER_NAME);
                        if (data.result && data.result.length) {
                            _this.policeValidateInfo.result.splice(0, _this.policeValidateInfo.result.length);
                            _.each(data.result, v => _this.policeValidateInfo.result.push(v));
                            _this.$refs.policeValidateInfoBox.show();
                        }else{
                            confirm(data.msg);
                        }
                        // bizPublicMethod.$blMethod.showSuccessMsgBox(_this, "公安联网校验成功！");
                    } else {
                        bizPublicMethod.$blMethod.showMsgBox(_this, data.Msg || "公安联网校验失败！");
    
                    }
                }).catch(error => {
    
                }).finally(() => {
                    loading.close();
                })
            },
            //中登身份校验
            "ZDCustomizeModule":(_this, csdcInfo,fieldData) => {
                let that = this;
                let messageBoxFn = (messageText) => {
                    _this.messageBox({
                        hasMask: true,
                        messageText: messageText,
                        confirmButtonText: '确定',
                        typeMessage: 'warn', 
                        showMsgBox: true
                      })
                }
                if(csdcInfo == "CUST_CARD_INFO"){                      
                    if (!fieldData.CUST_FNAME.DEFAULT_VALUE) {
                        messageBoxFn("中登身份校验，客户全称不能为空！");
                        return;
                    }
                    if (!utils.isCommonChar(fieldData.CUST_FNAME.DEFAULT_VALUE)) {
                        messageBoxFn("姓名包含生僻字，不支持公安联网校验！");
                        return;
                    }
                    if (!fieldData.ID_TYPE.DEFAULT_VALUE) {
                        messageBoxFn("中登身份校验，证件类型不能为空！");
                        return;
                    }
                    if (fieldData.ID_TYPE.DEFAULT_VALUE != "00" && fieldData.ID_TYPE.DEFAULT_VALUE != "08" && fieldData.ID_TYPE.DEFAULT_VALUE != "0s") {
                        messageBoxFn("证件类型不是身份证、临时身份证或港澳台居民居住证，不支持中登身份校验");
                        return;
                    }
                    if (!fieldData.ID_CODE.DEFAULT_VALUE) {
                        messageBoxFn("中登身份校验，证件号码不能为空！");
                        return;
                    }
                    if (!fieldData.SEX.DEFAULT_VALUE) {
                        messageBoxFn("中登身份校验，性别不能为空！");
                        return;
                    }
                    if (!fieldData.BIRTHDAY.DEFAULT_VALUE) {
                        messageBoxFn("中登身份校验，出生日期不能为空！");
                        return;
                    }
                    fieldData.SEX.DEFAULT_VALUE = (fieldData.ID_CODE.DEFAULT_VALUE.substring(16, 17) % 2) ? "0" : "1";
                    fieldData.BIRTHDAY.DEFAULT_VALUE = fieldData.ID_CODE.DEFAULT_VALUE.substr(6, 8);
                    let param = {
                        BIRTHDAY: fieldData.BIRTHDAY.DEFAULT_VALUE,
                        CUST_FNAME: fieldData.CUST_FNAME.DEFAULT_VALUE,
                        ID_CODE: fieldData.ID_CODE.DEFAULT_VALUE,
                        ID_TYPE: fieldData.ID_TYPE.DEFAULT_VALUE,
                        SEX: fieldData.SEX.DEFAULT_VALUE,
                        USER_TYPE:_this.userType,
                    }
                    let errorFailFn = () => {
                        messageBoxFn("中登身份校验失败。");
                    }
                    _this.loading = true;
                    _this.loadingText = '正在核对您的身份信息...';
                    return Promise.all([csdsSerivce.validate(param)]).then(result =>{
                        _this.oppBusiData.isCscdAndPoliceChecked = true;
                        if(result.length && !_.isEmpty(result[0])){
                            if (!result[0]) {
                                errorFailFn();
                                return
                            }
                            let tempResult = {};
                            Object.assign(tempResult,result[0]);
                            if("1" === tempResult.flag || "true" === tempResult.flag || true === tempResult.flag) {
                                custSerivce.syncIdCardChkFlag(param.ID_TYPE, param.ID_CODE, param.CUST_FNAME);
                            }     
                            //中登校验结果展示
                            _this.zdValidateInfo.result.splice(0, _this.zdValidateInfo.result.length);
                            
                            _.forEach(tempResult.LOCALCUSTINFO,function(value,key){
                                let zdItem = {};
                                if(key == "BIRTHDAY"){
                                    zdItem[key] =  value;
                                    zdItem.FIELD_TXT = "出生日期";
                                    zdItem.input = param.BIRTHDAY;
                                    if(tempResult.CSDCCUSTINFO &&tempResult.CSDCCUSTINFO.BIRTHDAY ){
                                        zdItem.output = tempResult.CSDCCUSTINFO.BIRTHDAY;
                                    }
                                }
                                if(key == "CUST_FNAME"){
                                    zdItem[key] =  value;
                                    zdItem.FIELD_TXT = "姓名";
                                    zdItem.input = param.CUST_FNAME;
                                    if(tempResult.CSDCCUSTINFO &&tempResult.CSDCCUSTINFO.CUST_FNAME ){
                                        zdItem.output = tempResult.CSDCCUSTINFO.CUST_FNAME;
                                    }
                                }
                                if(key == "ID_CODE"){
                                    zdItem[key] =  value;
                                    zdItem.FIELD_TXT = "证件号码";
                                    zdItem.input = param.ID_CODE;
                                    if(tempResult.CSDCCUSTINFO &&tempResult.CSDCCUSTINFO.ID_CODE ){
                                        zdItem.output = tempResult.CSDCCUSTINFO.ID_CODE;
                                    }
                                }
                                if(key == "SEX"){
                                    zdItem[key] =  value;
                                    zdItem.FIELD_TXT = "性别";
                                    if(tempResult.CSDCCUSTINFO &&tempResult.CSDCCUSTINFO.SEX ){
                                        zdItem.output = tempResult.CSDCCUSTINFO.SEX;
                                    }
                                    _.filter(fieldData.SEX.FIELD_DICT_NAME, (item) => {
                                        if(item.DICT_ITEM == value){
                                            zdItem.input = item.DICT_ITEM_NAME;
                                        }    
                                    });
                                }
                                if(!_.isEmpty(zdItem)){
                                    if(zdItem.input == zdItem.output){
                                        zdItem.flag = "一致";
                                    }else{
                                        zdItem.flag = "不一致";
                                    }
                                    _this.zdValidateInfo.result.push(zdItem); 
                                } 
                            })
                            _this.zdValidateInfo.url = "data:image/jpg;base64," + tempResult.CSDCCUSTINFO.IMG_DATA || "";
                            _this.$refs.zdValidateInfoBox.show();
                        } else {
                            errorFailFn();
                        }
                    }).finally( () => {
                        _this.loading = false;
                    });
                }
               
            },
            //国籍
            "CHECK_CITIZENSHIP": (_this, field, fieldData) => {
                if (field.MODULE_ID == "CUST_CARD_INFO") {
                    _this.busiLogic.CHECK_BASICINFO_CITIZENSHIP(_this, field, fieldData);
                }
    
            },
    
            "CHECK_ID_CODE": (_this, field, fieldData) => {
                if (field.MODULE_ID == "CUST_CARD_INFO") {
                    _this.busiLogic.CHECK_BASICINFO_ID_CODE(_this, field, fieldData);
                }
    
            },
            "CHECK_ID_TYPE": (_this, field, fieldData) => {
                if (field.MODULE_ID == "CUST_CARD_INFO") {
                    _this.busiLogic.CHECK_BASICINFO_ID_TYPE(_this, field, fieldData);
                }
    
            },
            "CHECK_OCCU_TYPE": (_this, field, fieldData) => {
                //基本信息
                if (field.MODULE_ID == "CUST_EXPERIENCE_INFO") {
                    _this.busiLogic.CHECK_BASICINFO_OCCU_TYPE && _this.busiLogic.CHECK_BASICINFO_OCCU_TYPE(_this, field, fieldData);
                }
    
                //实际控制人
                if (field.MODULE_ID == "CUST_CONTROLER_INFO") {
                    _this.busiLogic.CHECK_CONTROLERINFO_OCCU_TYPE && _this.busiLogic.CHECK_CONTROLERINFO_OCCU_TYPE(_this, field, fieldData);
                }
            },
            //出生日期
            "CHECK_BIRTHDAY": (_this, field, fieldData) => {
                //基本信息
                if (field.MODULE_ID == "CUST_CARD_INFO") {
                    _this.busiLogic.CHECK_BASICINFO_BIRTHDAY && _this.busiLogic.CHECK_BASICINFO_BIRTHDAY(_this, field, fieldData);
                }
                //其他联系人信息
                if (field.MODULE_ID == "CUST_OTHER_LINK_INFO") {
                    _this.busiLogic.CHECK_OTHERLINKINFO_BIRTHDAY && _this.busiLogic.CHECK_OTHERLINKINFO_BIRTHDAY(_this, field, fieldData);
                }
            },
            CHECK_IS_SELF:(_this, field, fieldData,moduleItem) => {
                if (field.MODULE_ID == "CUST_CONTROLER_INFO") {
                    _this.busiLogic.CHECK_CONTROLER_IS_SELF && _this.busiLogic.CHECK_CONTROLER_IS_SELF(_this, field, fieldData,moduleItem);
                }
                if (field.MODULE_ID == "CUST_BENEFICIARY_INFO") {
                    _this.busiLogic.CHECK_BENEFICIARY_IS_SELF && _this.busiLogic.CHECK_BENEFICIARY_IS_SELF(_this, field, fieldData,moduleItem);
                }
            },
            //性别
            CHECK_SEX: (_this, field, fieldData) => {
                if (field.MODULE_ID == "CUST_CARD_INFO") {
                    _this.busiLogic.CHECK_BASICINFO_SEX && _this.busiLogic.CHECK_BASICINFO_SEX(_this, field, fieldData);
                }
                if (field.MODULE_ID == "CUST_BENEFICIARY_INFO") {
                    _this.busiLogic.CHECK_BENEFICIARYINFO_SEX && _this.busiLogic.CHECK_BENEFICIARYINFO_SEX(_this, field, fieldData);
                }
            },
            //国家地区
            CHECK_NATION: (_this, field, fieldData,moduleItem) => {
                if (field.MODULE_ID == "CUST_CONTROLER_INFO") {
                    _this.busiLogic.CHECK_CONTROLERINFO_NATION && _this.busiLogic.CHECK_CONTROLERINFO_NATION(_this, field, fieldData,moduleItem);
                }
                if (field.MODULE_ID.indexOf("CUST_BENEFICIARY_INFO") != -1) {
                    _this.busiLogic.CHECK_BENEFICIARYINFO_NATION && _this.busiLogic.CHECK_BENEFICIARYINFO_NATION(_this, field, fieldData,moduleItem);
                }
            },
            CHECK_BENEFICIARY_ADDR:(_this, field, fieldData,moduleItem) => {
                if (field.MODULE_ID.indexOf("CUST_BENEFICIARY_INFO") != -1) {
                    _this.busiLogic.CHECK_CUST_BENEFICIARY_ADDR && _this.busiLogic.CHECK_CUST_BENEFICIARY_ADDR(_this, field, fieldData);
                }
            },
            CHECK_ADDRESS: (_this, field, fieldData) => {
                if (field.MODULE_ID.indexOf("CUST_LINK_INFO") != -1) {
                    _this.busiLogic.CHECK_CUST_LINK_INFO_ADDRESS && _this.busiLogic.CHECK_CUST_LINK_INFO_ADDRESS(_this, field, fieldData);
                }
                if (field.MODULE_ID.indexOf("CUST_TAX_INFO_MODULE2") != -1) {
                    _this.busiLogic.CHECK_CUST_TAX_INFO_MODULE2_ADDRESS && _this.busiLogic.CHECK_CUST_TAX_INFO_MODULE2_ADDRESS(_this, field, fieldData);
                }
            },

            //字段改变
            fieldDataChange: (_this, field, fieldData, moduleInfo) => {
                let that = this;
                if (_this.moduleId.indexOf("CUST_TAX_INFO_MODULE3") > -1 && field.FIELD_ID == "BIRTH_ADDRESS") {
                    bizCustTaxInfoNode.CHECK_BIRTH_ADDRESS && bizCustTaxInfoNode.CHECK_BIRTH_ADDRESS(_this, field, fieldData);
                }
                if (_this.moduleId.indexOf("CUST_TAX_INFO_MODULE3") > -1 && field.FIELD_ID == "ADDRESS") {
                    bizCustTaxInfoNode.CHECK_CUST_TAX_INFO_MODULE2_ADDRESS && bizCustTaxInfoNode.CHECK_CUST_TAX_INFO_MODULE2_ADDRESS(_this, field, fieldData);
                }
                if (_this.moduleId.indexOf("CUST_CARD_INFO") > -1 && field.FIELD_ID == "FZ_ID_TYPE") {
                    bizCustBasicInfoNode.checkChangeFzRequired && bizCustBasicInfoNode.checkChangeFzRequired(_this, field, fieldData);
                }
                if (_this.moduleId.indexOf("CUST_CARD_INFO") > -1 && field.FIELD_ID == "FZ_ID_CODE") {
                    bizCustBasicInfoNode.checkChangeFzRequired && bizCustBasicInfoNode.checkChangeFzRequired(_this, field, fieldData);
                }
                
                if (_this.moduleId.indexOf("CUST_TAX_INFO_MODULE2") > -1 && field.FIELD_ID == "ADDRESS") {
                    bizCustTaxInfoNode.CHECK_CUST_TAX_INFO_MODULE2_ADDRESS && bizCustTaxInfoNode.CHECK_CUST_TAX_INFO_MODULE2_ADDRESS(_this, field, fieldData);
                }
                if (_this.moduleId.indexOf("CUST_OTHER_LINK_INFO") > -1) {
                    bizCustOtherLinkNode.bizCustOtherLinkNodeFieldDataChange && bizCustOtherLinkNode.bizCustOtherLinkNodeFieldDataChange(_this, field, fieldData, moduleInfo);
                }
                if (moduleInfo.MODULE_CONTROL == "1" && !field.DEFAULT_VALUE && field.FIELD_REQUIRED == "1" && field.FIELD_CONTROL != "1") {
                    _this.disableNext = true;
                    return
                }
                //触发生日校验
                if (field.FIELD_ID == "BIRTHDAY" && _this.moduleId.indexOf("CUST_CARD_INFO") > -1) {
                    bizCustBasicInfoNode.CHECK_BASICINFO_BIRTHDAY && bizCustBasicInfoNode.CHECK_BASICINFO_BIRTHDAY(_this, field, fieldData);
                }
                //查看按钮是否禁止
                if (that.default.isKeyTip && (that.default.isKeyTip(_this, "beneficiaryHasNoSelf") || that.default.isKeyTip(_this, "controlTip") || that.default.isKeyTip(_this, "checkCITIZENSHIP"))) {
                    _this.disableNext = true;
                    return;
                }
                //查看是否证件类型禁止
                if (that.default.isKeyTip && (that.default.isKeyTip(_this, "idTypeInvalid"))) {
                    _this.disableNext = true;
                    return;
                }
                that.default.eachAllModule(_this);
            },
            //遍历所有模块是否有必填未填项
            eachAllModule: (_this) => {
                let flag = false;
                let moduleArr = _this.moduleId;
                _.each(_this.groupDatas[_this.groupId], modules => {
                    if (flag) {
                        return false;
                    }
                    _.each(modules, moduleItem => {
                        if (flag) {
                            return false;
                        }
                        if (moduleArr.indexOf(moduleItem.MODULE_ID) > -1 && moduleItem.MODULE_CONTROL == "1") {
                            _.each(moduleItem.FIELDS, fieldItem => {
                                if (!fieldItem.DEFAULT_VALUE && fieldItem.FIELD_REQUIRED == "1" && fieldItem.FIELD_CONTROL != "1") {
                                    flag = true;
                                    return false;
                                }
                            })
                        }
                    })
                })
                _this.disableNext = flag;
            },
            //是否存在禁止条件提示
            ishavTipError: (_this) => {
                let tipArr = _this.$refs.flowTip.flowTips;
                let findTip = _.find(tipArr, {type: "error"});
                return !_.isEmpty(findTip);
            },
            //是否存在某个提示
            isKeyTip: (_this, key) => {
                let tipArr = _this.$refs.flowTip.flowTips;
                let findTip = _.find(tipArr, {key: key});
                return !_.isEmpty(findTip);
            }
        })
export default V0049_CUST;