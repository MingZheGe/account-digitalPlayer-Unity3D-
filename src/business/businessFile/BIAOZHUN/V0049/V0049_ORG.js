//客户基本信息
import bizOrgBasicInfoNode from "../commonModules/commonBizNode/org/orgInfo/bizOrgBasicInfoNode";
//联系信息
import bizOrgLinkInfoNode from "../commonModules/commonBizNode/org/orgLinkInfo/bizOrgLinkInfoNode";
//联系人信息
import bizOrgLinkmanInfoNode from "../commonModules/commonBizNode/org/orgLinkInfo/bizOrgLinkmanInfoNode";
//法定代表人信息
import bizOrgLegalRepInfoNode from "../commonModules/commonBizNode/org/orgRelaInfo/bizOrgLegalRepInfoNode";
//委派代表人信息
import bizOrgLegalClientInfoNode from "../commonModules/commonBizNode/org/orgRelaInfo/bizOrgLegalClientInfoNode"
//负责人信息
import bizOrgResponsibleInfoNode from "../commonModules/commonBizNode/org/orgRelaInfo/bizOrgResponsibleInfoNode";
//合伙人信息
import bizOrgPartnerInfoNode from "../commonModules/commonBizNode/org/orgRelaInfo/bizOrgPartnerInfoNode"
//控股股东信息
import bizOrgStockholderInfoNode from "../commonModules/commonBizNode/org/orgEquityInfo/bizOrgStockholderInfoNode"
//实际控制人
import bizOrgActualControllerNode from "../commonModules/commonBizNode/org/orgEquityInfo/bizOrgActualControllerNode"
//反洗钱信息
import bizOrgAmlInfoNode from "../commonModules/commonBizNode/org/orgRelaInfo/bizOrgAmlInfoNode"
//实际受益人（受益所有人）
import bizOrgBeneficiaryOwnerNode from "../commonModules/commonBizNode/org/orgRelaInfo/bizOrgBeneficiaryOwnerNode"
//诚信记录信息
import bizOrgCreditRecordInfoNode from "../commonModules/commonBizNode/org/orgInfo/bizOrgCreditRecordInfoNode"
//涉税信息
import bizOrgTaxInfoNode from "../commonModules/commonBizNode/org/orgTaxInfo/bizOrgTaxInfoNode"
//控制人信息
import bizOrgControllerTaxInfoNode from "../commonModules/commonBizNode/org/orgTaxInfo/bizOrgControllerTaxInfoNode"

import oppService from '../../../../service/opp-service'
import date from "../../../../tools/date.js";
import * as bizPublicTools from "../commonModules/commonBizNode/bizPublicTools.js"
import dict from "../../../../tools/dict"
import custService from '../../../../service/cust-service'
import csdsSerivce from '../../../../service/csdc-service'


/**
 * 获取客户历史数据
 * @param USER_TYPE   用户类型
 * @param INT_ORG     客户机构
 */
const W0000312 = (_this, param) => {
    return _this.$syscfg.K_Request('W0000312', param);
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

    })
}
const getDictArrData = (_this) => {
    return dict.getDictData(["CITIZENSHIP_ST", "SUBJECT_IDENTITY", "INOUTSIDE_IDENTITY", "EXT_ORG"]).then(res => {
        _this.oppBusiData.dictAll = res;
    })
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
}
//中登账户注册资料查询
const queryAcctInfo = function (_this, ymtInfo) {
    return csdsSerivce.csdcAcctQuery({
        QUERY_CSDC: "1",
        YMT_CODE: ymtInfo.YMT_CODE,
        ACCTBIZ_EXCODE: "06"
    }).then(csdcAcctInfo => {
        var tmpObj = _.mapValues(csdcAcctInfo[0] || {}, _.trim);
        return _.assign({}, ymtInfo, tmpObj);
    });
}
//一码通
const getCSDCYmtData = async (_this) => {
    let customerInfo = _this.oppBusiData.customerInfo;
    _this.oppBusiData.ymtData = [];
    _this.oppBusiData.zdYmtData = [];
    return csdsSerivce.getCSDCYmtData(customerInfo.CUST_FNAME, customerInfo.ID_TYPE, customerInfo.ID_CODE).then( async res => {
        let ymtData = _.filter(res, item => {return !_.isEmpty(item.YMT_CODE) && item.YMT_STATUS != "1"}) || [];
        let arrFn = [];
        _.each(ymtData, async ymtDataItem => {
            arrFn.push(queryAcctInfo(_this, ymtDataItem))
        })
        return Promise.all(arrFn).then( res => {
            _this.oppBusiData.ymtData = res || [];
            _this.oppBusiData.zdYmtData = res || [];
        })
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
//机构查询 ORG_TYPE 0-内部 1-银行
const Y1000200  = (_this) => {
    return _this.$syscfg.K_Request('Y1000200', {
        ORG_TYPE: "1"
    }, false, {
        retry: 1,
    }).then( (res) => {
        _this.oppBusiData.bankDataAll = _.get(res, "Data", []);
    }).catch( err => {
        throw err;
    });
}
/**
 * 是否需要联动修改控股股东信息
 * @param {object} _this 
 */
const isNeedCascadeUpdateStockholder =(_this) => {
    for (let i in _this.groupDatas.EQUITY_INFO.STOCKHOLDER_INFO) {
        let module = _this.groupDatas.EQUITY_INFO.STOCKHOLDER_INFO[i];
        if (module.FIELDS.MODULE_RADIO_BUTTON.DEFAULT_VALUE == "true") {
            return true;
        }
    }
    return false;
}

/**
 * 是否需要联动修改实际控制人信息
 * @param {object} _this 
 */
 const isNeedCascadeUpdateActualController =(_this) => {
    for (let i in _this.groupDatas.EQUITY_INFO.ACTUAL_CONTROLLER_INFO) {
        let module = _this.groupDatas.EQUITY_INFO.ACTUAL_CONTROLLER_INFO[i];
        if (module.FIELDS.MODULE_RADIO_BUTTON.DEFAULT_VALUE == "true") {
            return true;
        }
    }
    return false;
}

// 读卡页面自动滚动到对应模块
const switchToCurModule = (_this, module, groupInfo) => {
    let ancestorNode = document.getElementsByClassName(groupInfo.GROUP_ID)[0];
    // 所有模块容器
    let parentNode = ancestorNode.getElementsByClassName('el-form')[0]; 
    // 当前模块容器
    let curModuleNode = parentNode.getElementsByClassName(module.MODULE_ID)[0];
    let node = curModuleNode.getElementsByClassName('self-module')[groupInfo.MODULE_NUM];
    // 有滚动条
    if(parentNode.scrollHeight > ancestorNode.offsetHeight) {
        ancestorNode.scrollTop = node.offsetTop + curModuleNode.offsetTop - ancestorNode.offsetHeight + node.offsetHeight;
    }
}

const V0049_ORG = _.merge(
        _.cloneDeep(bizOrgBasicInfoNode),
        _.cloneDeep(bizOrgCreditRecordInfoNode),
        _.cloneDeep(bizOrgLinkInfoNode),
        _.cloneDeep(bizOrgLinkmanInfoNode),
        _.cloneDeep(bizOrgLegalRepInfoNode),
        _.cloneDeep(bizOrgResponsibleInfoNode),
        _.cloneDeep(bizOrgStockholderInfoNode),
        _.cloneDeep(bizOrgActualControllerNode),
        _.cloneDeep(bizOrgLegalClientInfoNode),
        _.cloneDeep(bizOrgPartnerInfoNode),
        _.cloneDeep(bizOrgAmlInfoNode),
        _.cloneDeep(bizOrgBeneficiaryOwnerNode),
        _.cloneDeep(bizOrgTaxInfoNode),
        _.cloneDeep(bizOrgControllerTaxInfoNode),
        {
            'beforeLoadBiz': (_this) => {
                //获取机构代码
                let userInfo = _this.$storage.getJsonSession(_this.$definecfg.USER_INFO);
                let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
                let agentInfo = _this.$storage.getJsonSession(_this.$definecfg.ORG_CURRENT_AGENT);    
                if(_.isEmpty(_this.oppBusiData.customerInfo)) {
                    _this.oppBusiData.customerInfo = customerInfo;
                }
                return Promise.all([
                    //获取客户历史数据oldBusiData
                    customerInfo &&  agentInfo && W0000312(_this, {
                        "sysParamKeys": "",
                        "USER_TYPE": customerInfo.USER_TYPE,
                        "CUST_CODE": customerInfo.CUST_CODE,
                        "AGENT_USER_CODE": agentInfo.USER_CODE
                    }),
                    csdsSerivce.queryCSDCTime(),
                    oppService.getBusiCommonParams(_this.busiCode),
                    getValidIdTypeData(_this),
                    getDictArrData(_this),
                    _this.$blMethod.getBusiAcctOpenLogic(_this, { USER_TYPE: "1"}),
                    custService.queryValidIDType("0"),
                    custService.queryValidIDType("1"),
                    getCSDCYmtData(_this),
                    getTopSubacctInfo(_this),
                    Y1000200(_this),
                    _this.$syscfg.getSysDate(),
                ]).then(res => {
                    _this.oppBusiData.SYS_DATE = res[11];
                    _this.oppBusiData.IS_IN_ZD_TIME = res[1];
                    _this.oppBusiData.allAcctOpenLogicData = res[5];
                    _this.oppBusiData.individualValidIdTypes = _.map(res[6], "DICT_ITEM");
                    _this.oppBusiData.orgValidIdTypes = _.map(res[7], "DICT_ITEM");
                    setOldBusiData(_this, res);
                    setSysTrdacctArr(_this);
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
                    return Promise.all([
                        bizOrgBasicInfoNode.bizOrgBasicInfoNodeBeforeLoadBiz && bizOrgBasicInfoNode.bizOrgBasicInfoNodeBeforeLoadBiz(_this),
                        bizOrgCreditRecordInfoNode.bizOrgCreditRecordInfoBeforeLoadBiz && bizOrgCreditRecordInfoNode.bizOrgCreditRecordInfoBeforeLoadBiz(_this),
                        bizOrgLinkInfoNode.bizOrgLinkInfoNodeBeforeLoadBiz && bizOrgLinkInfoNode.bizOrgLinkInfoNodeBeforeLoadBiz(_this),    
                        bizOrgLinkmanInfoNode.bizOrgLinkmanInfoNodeBeforeLoadBiz && bizOrgLinkmanInfoNode.bizOrgLinkmanInfoNodeBeforeLoadBiz(_this),
                        bizOrgLegalRepInfoNode.bizOrgLegalRepInfoBeforeLoadBiz && bizOrgLegalRepInfoNode.bizOrgLegalRepInfoBeforeLoadBiz(_this),
                        bizOrgResponsibleInfoNode.bizOrgResponsibleInfoBeforeLoadBiz && bizOrgResponsibleInfoNode.bizOrgResponsibleInfoBeforeLoadBiz(_this),
                        bizOrgStockholderInfoNode.bizOrgStockholderInfoBeforeLoadBiz && bizOrgStockholderInfoNode.bizOrgStockholderInfoBeforeLoadBiz(_this),
                        bizOrgActualControllerNode.bizOrgActualControllerNodeBeforeLoadBiz && bizOrgActualControllerNode.bizOrgActualControllerNodeBeforeLoadBiz(_this),
                        bizOrgLegalClientInfoNode.bizOrgLegalClientInfoBeforeLoadBiz && bizOrgLegalClientInfoNode.bizOrgLegalClientInfoBeforeLoadBiz(_this),
                        bizOrgPartnerInfoNode.bizOrgPartnerInfoBeforeLoadBiz && bizOrgPartnerInfoNode.bizOrgPartnerInfoBeforeLoadBiz(_this),
                        bizOrgAmlInfoNode.bizOrgAmlInfoBeforeLoadBiz && bizOrgAmlInfoNode.bizOrgAmlInfoBeforeLoadBiz(_this),
                        bizOrgBeneficiaryOwnerNode.bizOrgBeneficiaryOwnerBeforeLoadBiz && bizOrgBeneficiaryOwnerNode.bizOrgBeneficiaryOwnerBeforeLoadBiz(_this),
                        bizOrgTaxInfoNode.bizOrgTaxInfoNodeBeforeLoadBiz && bizOrgTaxInfoNode.bizOrgTaxInfoNodeBeforeLoadBiz(_this),
                        bizOrgControllerTaxInfoNode.bizOrgControllerTaxInfoNodeBeforeLoadBiz && bizOrgControllerTaxInfoNode.bizOrgControllerTaxInfoNodeBeforeLoadBiz(_this),
                    ])
                }).catch(err => {
                    throw err;
                })
            },
            "afterLoadBiz": (_this) => {
                return Promise.all([
                    bizOrgBasicInfoNode.bizOrgBasicInfoNodeAfterLoadBiz && bizOrgBasicInfoNode.bizOrgBasicInfoNodeAfterLoadBiz(_this),
                    bizOrgCreditRecordInfoNode.bizOrgCreditRecordInfoAfterLoadBiz && bizOrgCreditRecordInfoNode.bizOrgCreditRecordInfoAfterLoadBiz(_this),
                    bizOrgLinkInfoNode.bizOrgLinkInfoNodeAfterLoadBiz && bizOrgLinkInfoNode.bizOrgLinkInfoNodeAfterLoadBiz(_this),
                    bizOrgLinkmanInfoNode.bizOrglinkmanInfoNodeAfterLoadBiz && bizOrgLinkmanInfoNode.bizOrglinkmanInfoNodeAfterLoadBiz(_this),
                    bizOrgLegalRepInfoNode.bizOrgLegalRepInfoAfterLoadBiz && bizOrgLegalRepInfoNode.bizOrgLegalRepInfoAfterLoadBiz(_this),
                    bizOrgLegalClientInfoNode.bizOrgLegalClientInfoAfterLoadBiz && bizOrgLegalClientInfoNode.bizOrgLegalClientInfoAfterLoadBiz(_this),
                    bizOrgResponsibleInfoNode.bizOrgResponsibleInfoAfterLoadBiz && bizOrgResponsibleInfoNode.bizOrgResponsibleInfoAfterLoadBiz(_this),
                    bizOrgPartnerInfoNode.bizOrgPartnerInfoAfterLoadBiz && bizOrgPartnerInfoNode.bizOrgPartnerInfoAfterLoadBiz(_this),
                    bizOrgStockholderInfoNode.bizOrgStockholderInfoAfterLoadBiz && bizOrgStockholderInfoNode.bizOrgStockholderInfoAfterLoadBiz(_this),
                    bizOrgActualControllerNode.bizOrgActualControllerNodeAfterLoadBiz && bizOrgActualControllerNode.bizOrgActualControllerNodeAfterLoadBiz(_this),
                    bizOrgAmlInfoNode.bizOrgAmlInfoAfterLoadBiz && bizOrgAmlInfoNode.bizOrgAmlInfoAfterLoadBiz(_this),
                    bizOrgBeneficiaryOwnerNode.bizOrgBeneficiaryOwnerAfterLoadBiz && bizOrgBeneficiaryOwnerNode.bizOrgBeneficiaryOwnerAfterLoadBiz(_this),
                    bizOrgTaxInfoNode.bizOrgTaxInfoNodeAfterLoadBiz && bizOrgTaxInfoNode.bizOrgTaxInfoNodeAfterLoadBiz(_this),
                    bizOrgControllerTaxInfoNode.bizOrgControllerTaxInfoNodeAfterLoadBiz && bizOrgControllerTaxInfoNode.bizOrgControllerTaxInfoNodeAfterLoadBiz(_this),
                ]).then(res => {
                    //保存就数据 到oppBusiData 用于对比
                    _this.oppBusiData.oldGroupDatas = _.cloneDeep(_this.oldGroupDatas);
                    return;
                })
            },
            "addModule": (_this, moduleld, fieldData) => {
                return true;
            },
            "addModuleFinished": (_this, module) => {
                // 诚信记录
                if (module.MODULE_ID.indexOf("CREDIT_RECORD_INFO") != -1) {
                    bizOrgCreditRecordInfoNode.bizOrgCreditRecordInfoNodeAddModuleFinished && bizOrgCreditRecordInfoNode.bizOrgCreditRecordInfoNodeAddModuleFinished(_this, module);
                }
                // 联系人
                if (module.MODULE_ID.indexOf("LINKMAN_INFO") != -1) {
                    bizOrgLinkmanInfoNode.bizOrglinkmanInfoNodeAddModuleFinished && bizOrgLinkmanInfoNode.bizOrglinkmanInfoNodeAddModuleFinished(_this, module);
                }
                // 合伙人
                if (module.MODULE_ID.indexOf("PARTNER_INFO") != -1) {
                    bizOrgPartnerInfoNode.bizOrgPartnerInfoNodeAddModuleFinished && bizOrgPartnerInfoNode.bizOrgPartnerInfoNodeAddModuleFinished(_this, module);
                }
                // 控股股东
                if (module.MODULE_ID.indexOf("STOCKHOLDER_INFO") != -1) {
                    bizOrgStockholderInfoNode.bizOrgStockholderInfoNodeAddModuleFinished && bizOrgStockholderInfoNode.bizOrgStockholderInfoNodeAddModuleFinished(_this, module);
                }
                // 实际控制人
                if (module.MODULE_ID.indexOf("ACTUAL_CONTROLLER_INFO") != -1) {
                    bizOrgActualControllerNode.bizOrgActualControllerNodeAddModuleFinished && bizOrgActualControllerNode.bizOrgActualControllerNodeAddModuleFinished(_this, module);
                }
                // 受益所有人
                if (module.MODULE_ID.indexOf("BENEFICIARY_OWNER_INFO") != -1) {
                    bizOrgBeneficiaryOwnerNode.bizOrgBeneficiaryOwnerAddModuleFinished && bizOrgBeneficiaryOwnerNode.bizOrgBeneficiaryOwnerAddModuleFinished(_this, module);
                }
                //涉税信息
                if (module.MODULE_ID.indexOf("ORG_TAX_COUNTRY_INFO") != -1) {
                    bizOrgTaxInfoNode.orgTaxCountryInfoAddModuleFinished && bizOrgTaxInfoNode.orgTaxCountryInfoAddModuleFinished(_this, module);
                }
                //控制人涉税信息
                if (module.MODULE_ID.indexOf("ORG_TAX_CONTROLER_MODULE5") != -1) {
                    bizOrgControllerTaxInfoNode.orgControllerTaxCountryInfoAddModuleFinished && bizOrgControllerTaxInfoNode.orgControllerTaxCountryInfoAddModuleFinished(_this, module);
                }
                
            },
            "deleteModuleFinished": (_this, deleteObj, moduleData) => {
                let module = deleteObj[0];
                if (module.MODULE_ID.indexOf("CREDIT_RECORD_INFO") > -1) {
                    bizOrgCreditRecordInfoNode.bizOrgCreditRecordInfoNodeDeleteModuleFinished && bizOrgCreditRecordInfoNode.bizOrgCreditRecordInfoNodeDeleteModuleFinished(_this, deleteObj);
                }
                // 合伙人
                if (module.MODULE_ID.indexOf("PARTNER_INFO") != -1) {
                    bizOrgPartnerInfoNode.bizOrgPartnerInfoNodeDeleteModuleFinished && bizOrgPartnerInfoNode.bizOrgPartnerInfoNodeDeleteModuleFinished(_this, module);
                }
                // 控股股东
                if (module.MODULE_ID.indexOf("STOCKHOLDER_INFO") != -1) {
                    bizOrgStockholderInfoNode.bizOrgStockholderInfoNodeDeleteModuleFinished && bizOrgStockholderInfoNode.bizOrgStockholderInfoNodeDeleteModuleFinished(_this, module);
                }
                // 实际控制人
                if (module.MODULE_ID.indexOf("ACTUAL_CONTROLLER_INFO") != -1) {
                    bizOrgActualControllerNode.bizOrgActualControllerNodeDeleteModuleFinished && bizOrgActualControllerNode.bizOrgActualControllerNodeDeleteModuleFinished(_this, module);
                }
                // 联系人
                if (module.MODULE_ID.indexOf("LINKMAN_INFO") != -1) {
                    bizOrgLinkmanInfoNode.bizOrglinkmanInfoNodeDeleteModuleFinished && bizOrgLinkmanInfoNode.bizOrglinkmanInfoNodeDeleteModuleFinished(_this, module);
                }
                // 受益所有人
                if (module.MODULE_ID.indexOf("BENEFICIARY_OWNER_INFO") != -1) {
                    bizOrgBeneficiaryOwnerNode.bizOrgBeneficiaryOwnerDeleteModuleFinished && bizOrgBeneficiaryOwnerNode.bizOrgBeneficiaryOwnerDeleteModuleFinished(_this, module);
                }
            },
            "deleteModule": (_this, module, index) => {
                // 实际控制人
                if (module.MODULE_ID.indexOf("ACTUAL_CONTROLLER_INFO") != -1) {
                    bizOrgActualControllerNode.bizOrgActualControllerNodeDeleteModule && bizOrgActualControllerNode.bizOrgActualControllerNodeDeleteModule(_this, module, index);
                }
                return true
            },
            "pageActivated": (_this) => {
                // 是读卡取消返回，则定位到该模块,
                let readCardCancelInfo = _this.$store.state.readCardCancelInfo;
                if(!_.isEmpty(readCardCancelInfo) && readCardCancelInfo.READ_CARD == '0') {
                    let groupInfo = readCardCancelInfo.groupInfo;
                    let module = _this.groupDatas[groupInfo.GROUP_ID][groupInfo.MODULE_ID][groupInfo.MODULE_NUM];
                    switchToCurModule(_this, module, groupInfo);
                    _this.$store.commit(_this.$types.UPDATE_READ_CARD_CANCEL_INFO, {});
                }
                
                _this.$refs.flowTip.flowTips = [];
                // 证件信息、基本信息
                if (_this.moduleId.indexOf("DOC_INFO") != -1 || _this.moduleId.indexOf("SUBJECT_IDENTITY_INFO") != -1) {
                    bizOrgBasicInfoNode.bizOrgBasicInfoNodePageActivated && bizOrgBasicInfoNode.bizOrgBasicInfoNodePageActivated(_this);
                }
                if (_this.moduleId.indexOf("ORG_LINK_INFO") != -1) {
                    bizOrgLinkInfoNode.bizOrgLinkInfoNodePageActivated && bizOrgLinkInfoNode.bizOrgLinkInfoNodePageActivated(_this);
                }
                //不良诚信记录
                if (_this.moduleId.indexOf("CREDIT_RECORD_INFO") != -1) {
                    bizOrgCreditRecordInfoNode.bizOrgCreditRecordInfoPageActived && bizOrgCreditRecordInfoNode.bizOrgCreditRecordInfoPageActived(_this);
                }
                // 法定代表人/执行事务合伙人
                if (_this.moduleId.indexOf("LEGAL_REP_INFO") != -1) {
                    bizOrgLegalRepInfoNode.bizOrgLegalRepInfoPageActivated && bizOrgLegalRepInfoNode.bizOrgLegalRepInfoPageActivated(_this);
                }
                // 负责人信息
                if (_this.moduleId.indexOf("RESPONSIBLE_PERSON_INFO") != -1) {
                    bizOrgResponsibleInfoNode.bizOrgResponsibleInfoPageActivated && bizOrgResponsibleInfoNode.bizOrgResponsibleInfoPageActivated(_this);
                }
                // 合伙人信息
                if (_this.moduleId.indexOf("PARTNER_INFO") != -1) {
                    bizOrgPartnerInfoNode.bizOrgPartnerInfoPageActivated && bizOrgPartnerInfoNode.bizOrgPartnerInfoPageActivated(_this);
                }
                // 控股股东
                if (_this.moduleId.indexOf("STOCKHOLDER_INFO") != -1) {
                    bizOrgStockholderInfoNode.bizOrgStockholderInfoPageActivated && bizOrgStockholderInfoNode.bizOrgStockholderInfoPageActivated(_this);
                }
                // 实际控制人
                if (_this.moduleId.indexOf("ACTUAL_CONTROLLER_INFO") != -1) {
                    bizOrgActualControllerNode.bizOrgActualControllerNodePageActivated && bizOrgActualControllerNode.bizOrgActualControllerNodePageActivated(_this);
                }
                // 受益所有人
                if (_this.moduleId.indexOf("BENEFICIARY_OWNER_INFO") != -1) {
                    bizOrgBeneficiaryOwnerNode.bizOrgBeneficiaryOwnerPageActivated && bizOrgBeneficiaryOwnerNode.bizOrgBeneficiaryOwnerPageActivated(_this);
                }
                //涉税信息
                if (_this.moduleId.indexOf("ORG_TAX_INFO") != -1 || 
                    _this.moduleId.indexOf("ORG_TAX_BASIC_INFO") != -1 || 
                    _this.moduleId.indexOf("ORG_TAX_COUNTRY_INFO") != -1) {
                    bizOrgTaxInfoNode.bizOrgTaxInfoNodePageActivated && bizOrgTaxInfoNode.bizOrgTaxInfoNodePageActivated(_this);
                }
                //控制人涉税信息
                if (_this.moduleId.indexOf("ORG_TAX_CONTROLER_MODULE1") != -1 || 
                    _this.moduleId.indexOf("ORG_TAX_CONTROLER_MODULE2") != -1 || 
                    _this.moduleId.indexOf("ORG_TAX_CONTROLER_MODULE3") != -1 || 
                    _this.moduleId.indexOf("ORG_TAX_CONTROLER_MODULE4") != -1 ||
                    _this.moduleId.indexOf("ORG_TAX_CONTROLER_MODULE5") != -1) {
                    bizOrgControllerTaxInfoNode.bizOrgControllerTaxInfoNodePageActivated && bizOrgControllerTaxInfoNode.bizOrgControllerTaxInfoNodePageActivated(_this);
                }
            },
            'beforeSave': async (_this, params) => {
                if (!_this.moduleId) {
                    return;
                }
                // 证件信息、基本信息
                if (_this.moduleId.indexOf("DOC_INFO") != -1 || _this.moduleId.indexOf("SUBJECT_IDENTITY_INFO") != -1) {
                    bizOrgBasicInfoNode.bizOrgBasicInfoNodeBeforeSave && bizOrgBasicInfoNode.bizOrgBasicInfoNodeBeforeSave(_this, params);
                }
                // 不良诚信记录
                if (_this.moduleId.indexOf("CREDIT_RECORD_INFO") != -1) {
                    bizOrgCreditRecordInfoNode.bizOrgCreditRecordInfoBeforeSave && bizOrgCreditRecordInfoNode.bizOrgCreditRecordInfoBeforeSave(_this, params)
                }
                // 联系信息
                if (_this.moduleId.indexOf("ORG_LINK_INFO") != -1) {
                    bizOrgLinkInfoNode.bizOrgLinkInfoNodeBeforeSave && bizOrgLinkInfoNode.bizOrgLinkInfoNodeBeforeSave(_this, params);
                }
                // 联系人信息
                if (_this.moduleId.indexOf("LINKMAN_INFO") != -1) {
                    bizOrgLinkmanInfoNode.bizOrglinkmanInfoNodeBeforeSave && bizOrgLinkmanInfoNode.bizOrglinkmanInfoNodeBeforeSave(_this, params);
                }
                // 法定代表人信息
                if (_this.moduleId.indexOf("LEGAL_REP_INFO") != -1) {
                    bizOrgLegalRepInfoNode.bizOrgLegalRepInfoBeforeSave && bizOrgLegalRepInfoNode.bizOrgLegalRepInfoBeforeSave(_this, params);
                    if (isNeedCascadeUpdateStockholder(_this) || isNeedCascadeUpdateActualController(_this)) {
                        let promiseDialog = () => {
                            return new Promise( (resolve, reject) => {
                                _this.loading = false;
                                _this.messageBox({
                                    hasMask:true,
                                    messageText: "您本次修改的证件信息将同步修改至实际控制人信息/控制股东信息",
                                    confirmButtonText: "确定",
                                    typeMessage: "warn", 
                                    showMsgBox: true,
                                    confirmedAction: () => {
                                        _this.loading = true;
                                        resolve(true)
                                    }
                                })
                            })
                        }
                        await promiseDialog();
                        bizOrgStockholderInfoNode.bizOrgStockholderInfoBeforeSave && bizOrgStockholderInfoNode.bizOrgStockholderInfoBeforeSave(_this, params);
                        bizOrgActualControllerNode.bizOrgActualControllerNodeBeforeSave && bizOrgActualControllerNode.bizOrgActualControllerNodeBeforeSave(_this, params);
                    }
                }
                // 委派代表人信息
                if (_this.moduleId.indexOf("LEGAL_CLIENT_INFO") != -1) {
                    bizOrgLegalClientInfoNode.bizOrgLegalClientInfoBeforeSave && bizOrgLegalClientInfoNode.bizOrgLegalClientInfoBeforeSave(_this, params);
                }
                // 负责人信息
                if (_this.moduleId.indexOf("RESPONSIBLE_PERSON_INFO") != -1) {
                    bizOrgResponsibleInfoNode.bizOrgResponsibleInfoBeforeSave && bizOrgResponsibleInfoNode.bizOrgResponsibleInfoBeforeSave(_this, params);
                }
                // 合伙人信息
                if (_this.moduleId.indexOf("PARTNER_INFO") != -1) {
                    bizOrgPartnerInfoNode.bizOrgPartnerInfoBeforeSave && bizOrgPartnerInfoNode.bizOrgPartnerInfoBeforeSave(_this, params);
                }
                // 控股股东信息
                if (_this.moduleId.indexOf("STOCKHOLDER_INFO") != -1) {
                    bizOrgStockholderInfoNode.bizOrgStockholderInfoBeforeSave && bizOrgStockholderInfoNode.bizOrgStockholderInfoBeforeSave(_this, params);
                }
                // 实际控制人
                if (_this.moduleId.indexOf("ACTUAL_CONTROLLER_INFO") != -1) {
                    bizOrgActualControllerNode.bizOrgActualControllerNodeBeforeSave && bizOrgActualControllerNode.bizOrgActualControllerNodeBeforeSave(_this, params);
                    let beneficiaryModuleArr = _this.groupDatas.RELA_INFO.BENEFICIARY_OWNER_INFO;
                    if (beneficiaryModuleArr[0].MODULE_CONTROL == "1" && 
                    beneficiaryModuleArr[0].FIELDS.MODULE_RADIO_BUTTON.DEFAULT_VALUE == "true") {
                        bizOrgBeneficiaryOwnerNode.bizOrgBeneficiaryOwnerBeforeSave && bizOrgBeneficiaryOwnerNode.bizOrgBeneficiaryOwnerBeforeSave(_this, params);
                    } 
                }
                // 反洗钱信息
                if (_this.moduleId.indexOf("AML_INFO") != -1) {
                    // 为了简化逻辑，反洗钱信息与基本信息一同保存
                    bizOrgBasicInfoNode.bizOrgBasicInfoNodeBeforeSave && bizOrgBasicInfoNode.bizOrgBasicInfoNodeBeforeSave(_this, params);
                }
                // 受益所有人
                if (_this.moduleId.indexOf("BENEFICIARY_OWNER_INFO") != -1) {
                    bizOrgBeneficiaryOwnerNode.bizOrgBeneficiaryOwnerBeforeSave && bizOrgBeneficiaryOwnerNode.bizOrgBeneficiaryOwnerBeforeSave(_this, params);
                }
                //涉税信息
                if (_this.moduleId.indexOf("ORG_TAX_INFO") != -1 || 
                    _this.moduleId.indexOf("ORG_TAX_BASIC_INFO") != -1 || 
                    _this.moduleId.indexOf("ORG_TAX_COUNTRY_INFO") != -1) {
                    bizOrgTaxInfoNode.bizOrgTaxInfoNodeBeforeSave && bizOrgTaxInfoNode.bizOrgTaxInfoNodeBeforeSave(_this, params);
                }
                //控制人涉税信息
                if (_this.moduleId.indexOf("ORG_TAX_CONTROLER_MODULE1") != -1 || 
                    _this.moduleId.indexOf("ORG_TAX_CONTROLER_MODULE2") != -1 || 
                    _this.moduleId.indexOf("ORG_TAX_CONTROLER_MODULE3") != -1 || 
                    _this.moduleId.indexOf("ORG_TAX_CONTROLER_MODULE4") != -1 ||
                    _this.moduleId.indexOf("ORG_TAX_CONTROLER_MODULE5") != -1) {
                    bizOrgControllerTaxInfoNode.bizOrgControllerTaxInfoNodeBeforeSave && bizOrgControllerTaxInfoNode.bizOrgControllerTaxInfoNodeBeforeSave(_this, params);
                }
                _this.oppBusiData.copyCurrentGroupData = _.cloneDeep(_this.groupDatas);
            },
            "afterSave": (_this, res) => {
                if (!_this.moduleId) {
                    return;
                }
                let newData = _.get(res, "Data[0]", {});
                let fromName = _this.$router.getCurrentRoute().fromName;
                let isRejcet = _this.$storage.getSession(_this.$definecfg.IS_REJECT);
                let rejectModuleInfo = _this.$storage.getJsonSession(_this.$definecfg.REJECT_MODULE_INFO);

                //证件信息
                if (_this.moduleId.indexOf("DOC_INFO") != -1) {
                    bizOrgBasicInfoNode.bizOrgBasicInfoNodeAfterSave && bizOrgBasicInfoNode.bizOrgBasicInfoNodeAfterSave(_this, newData);
                    if(isRejcet == 1 && rejectModuleInfo.ORG_INFO_MODIFY_CARD){
                        delete rejectModuleInfo.ORG_INFO_MODIFY_CARD;
                        _this.$storage.setSession(_this.$definecfg.REJECT_MODULE_INFO, rejectModuleInfo);
                    }
                    _this.$router.goRoute("信息列表", {fromName: fromName});
                    return false;
                }

                //基本信息1：主体身份信息
                if (_this.moduleId.indexOf("SUBJECT_IDENTITY_INFO") != -1) {
                    bizOrgBasicInfoNode.bizOrgBasicInfoNodeAfterSave && bizOrgBasicInfoNode.bizOrgBasicInfoNodeAfterSave(_this, newData);
                    if(isRejcet == 1 && rejectModuleInfo.ORG_INFO_MODIFY){
                        delete rejectModuleInfo.ORG_INFO_MODIFY;
                        _this.$storage.setSession(_this.$definecfg.REJECT_MODULE_INFO, rejectModuleInfo);
                    }
                }

                //基本信息2：诚信记录
                if (_this.moduleId.indexOf("CREDIT_RECORD_INFO") != -1) {
                    if(isRejcet == 1 && rejectModuleInfo.ORG_INFO_MODIFY){
                        delete rejectModuleInfo.ORG_INFO_MODIFY;
                        _this.$storage.setSession(_this.$definecfg.REJECT_MODULE_INFO, rejectModuleInfo);
                    }
                    _this.$router.goRoute("信息列表", {fromName: fromName});
                    return false;
                }

                // 联系信息、联系人信息
                if (_this.moduleId.indexOf("ORG_LINK_INFO") != -1 || _this.moduleId.indexOf("LINKMAN_INFO") != -1) {
                    if(isRejcet == 1 && rejectModuleInfo.ORG_INFO_MODIFY_LINK){
                        delete rejectModuleInfo.ORG_INFO_MODIFY_LINK;
                        _this.$storage.setSession(_this.$definecfg.REJECT_MODULE_INFO, rejectModuleInfo);
                    }
                    _this.$router.goRoute("信息列表", {fromName: fromName});
                    return false;
                }
                
                // 法定代表人信息、委派代表人信息、负责人信息、合伙人信息
                if (_this.moduleId.indexOf("LEGAL_REP_INFO") != -1 || _this.moduleId.indexOf("LEGAL_CLIENT_INFO") != -1 
                 || _this.moduleId.indexOf("RESPONSIBLE_PERSON_INFO") != -1 || _this.moduleId.indexOf("PARTNER_INFO") != -1) {
                    if(isRejcet == 1 && rejectModuleInfo.ORG_INFO_MODIFY_RELA){
                        delete rejectModuleInfo.ORG_INFO_MODIFY_RELA;
                        _this.$storage.setSession(_this.$definecfg.REJECT_MODULE_INFO, rejectModuleInfo);
                    }
                    _this.$router.goRoute("信息列表", {fromName: fromName});
                    return false;
                }

                // 控股股东信息、实际控制人
                if (_this.moduleId.indexOf("STOCKHOLDER_INFO") != -1 || _this.moduleId.indexOf("ACTUAL_CONTROLLER_INFO") != -1) {
                    if(isRejcet == 1 && rejectModuleInfo.ORG_INFO_MODIFY_CONTROL){
                        delete rejectModuleInfo.ORG_INFO_MODIFY_CONTROL;
                        _this.$storage.setSession(_this.$definecfg.REJECT_MODULE_INFO, rejectModuleInfo);
                    }
                    _this.$router.goRoute("信息列表", {fromName: fromName});
                    return false;
                }

                // 反洗钱信息、受益所有人
                if (_this.moduleId.indexOf("AML_INFO") != -1 || _this.moduleId.indexOf("BENEFICIARY_OWNER_INFO") != -1) {
                    if(isRejcet == 1 && rejectModuleInfo.ORG_INFO_MODIFY_BENEFICIARY){
                        delete rejectModuleInfo.ORG_INFO_MODIFY_BENEFICIARY;
                        _this.$storage.setSession(_this.$definecfg.REJECT_MODULE_INFO, rejectModuleInfo);
                    }
                    _this.$router.goRoute("信息列表", {fromName: fromName});
                    return false;
                }

                //涉税信息
                if (_this.moduleId.indexOf("ORG_TAX_INFO") != -1 || 
                    _this.moduleId.indexOf("ORG_TAX_BASIC_INFO") != -1 || 
                    _this.moduleId.indexOf("ORG_TAX_COUNTRY_INFO") != -1) {
                        if(isRejcet == 1 && rejectModuleInfo.ORG_INFO_MODIFY_ADEQ){
                            delete rejectModuleInfo.ORG_INFO_MODIFY_ADEQ;
                            _this.$storage.setSession(_this.$definecfg.REJECT_MODULE_INFO, rejectModuleInfo);
                        }
                    return bizOrgTaxInfoNode.bizOrgTaxInfoNodeAfterSave && bizOrgTaxInfoNode.bizOrgTaxInfoNodeAfterSave(_this, newData)
                }

                //控制人涉税信息
                if (_this.moduleId.indexOf("ORG_TAX_CONTROLER_MODULE1") != -1 || 
                    _this.moduleId.indexOf("ORG_TAX_CONTROLER_MODULE2") != -1 || 
                    _this.moduleId.indexOf("ORG_TAX_CONTROLER_MODULE3") != -1 || 
                    _this.moduleId.indexOf("ORG_TAX_CONTROLER_MODULE4") != -1 ||
                    _this.moduleId.indexOf("ORG_TAX_CONTROLER_MODULE5") != -1) {
                        if(isRejcet == 1 && rejectModuleInfo.ORG_INFO_MODIFY_CTAX){
                            delete rejectModuleInfo.ORG_INFO_MODIFY_CTAX;
                            _this.$storage.setSession(_this.$definecfg.REJECT_MODULE_INFO, rejectModuleInfo);
                        }
                    return bizOrgControllerTaxInfoNode.bizOrgControllerTaxInfoNodeAfterSave && bizOrgControllerTaxInfoNode.bizOrgControllerTaxInfoNodeAfterSave(_this, newData)
                }
                _this.$router.goRoute("信息列表", {fromName: fromName});  
                return false;         
            },
    
            validate: function (_this) {
                let validateFnArr = [];
                if (_this.moduleId.indexOf("DOC_INFO") != -1) {
                    bizOrgBasicInfoNode.bizOrgBasicInfoNodeValidate && validateFnArr.push(bizOrgBasicInfoNode.bizOrgBasicInfoNodeValidate(_this))
                }
                if (_this.moduleId.indexOf("CREDIT_RECORD_INFO") != -1) {
                    bizOrgCreditRecordInfoNode.bizOrgCreditRecordInfoValidate && validateFnArr.push(bizOrgCreditRecordInfoNode.bizOrgCreditRecordInfoValidate(_this))
                }
                if (_this.moduleId.indexOf("ORG_LINK_INFO") != -1) {
                    bizOrgLinkInfoNode.bizOrgLinkInfoNodeValidate && validateFnArr.push(bizOrgLinkInfoNode.bizOrgLinkInfoNodeValidate(_this))
                }
                // 法人代表
                if (_this.moduleId.indexOf("LEGAL_REP_INFO") != -1) {
                    bizOrgLegalRepInfoNode.bizOrgLegalRepInfoValidate && validateFnArr.push(bizOrgLegalRepInfoNode.bizOrgLegalRepInfoValidate(_this));
                }
                // 委派代表
                if (_this.moduleId.indexOf("LEGAL_CLIENT_INFO") != -1) {
                    bizOrgLegalClientInfoNode.bizOrgLegalClientInfoValidate && validateFnArr.push(bizOrgLegalClientInfoNode.bizOrgLegalClientInfoValidate(_this));
                }
                // 负责人
                if (_this.moduleId.indexOf("RESPONSIBLE_PERSON_INFO") != -1) {
                    bizOrgResponsibleInfoNode.bizOrgResponsibleInfoValidate && validateFnArr.push(bizOrgResponsibleInfoNode.bizOrgResponsibleInfoValidate(_this));
                }
                // 控股股东
                if (_this.moduleId.indexOf("STOCKHOLDER_INFO") != -1) {
                    bizOrgStockholderInfoNode.bizOrgStockholderInfoValidate && validateFnArr.push(bizOrgStockholderInfoNode.bizOrgStockholderInfoValidate(_this));
                }
                // 实际控制人
                if (_this.moduleId.indexOf("ACTUAL_CONTROLLER_INFO") != -1) {
                    bizOrgActualControllerNode.bizOrgActualControllerNodeValidate && validateFnArr.push(bizOrgActualControllerNode.bizOrgActualControllerNodeValidate(_this));
                }
                // 联系人
                if (_this.moduleId.indexOf("LINKMAN_INFO") != -1) {
                    bizOrgLinkmanInfoNode.bizOrglinkmanInfoNodeValidate && validateFnArr.push(bizOrgLinkmanInfoNode.bizOrglinkmanInfoNodeValidate(_this));
                }
                // 合伙人信息
                if (_this.moduleId.indexOf("PARTNER_INFO") != -1) {
                    bizOrgPartnerInfoNode.bizOrgPartnerInfoValidate && validateFnArr.push(bizOrgPartnerInfoNode.bizOrgPartnerInfoValidate(_this));
                }
                // 受益所有人
                if (_this.moduleId.indexOf("BENEFICIARY_OWNER_INFO") != -1) {
                    bizOrgBeneficiaryOwnerNode.bizOrgBeneficiaryOwnerValidate && validateFnArr.push(bizOrgBeneficiaryOwnerNode.bizOrgBeneficiaryOwnerValidate(_this));
                }
                //涉税信息
                if (_this.moduleId.indexOf("ORG_TAX_INFO") != -1 || 
                    _this.moduleId.indexOf("ORG_TAX_BASIC_INFO") != -1 || 
                    _this.moduleId.indexOf("ORG_TAX_COUNTRY_INFO") != -1) {
                        bizOrgTaxInfoNode.bizOrgTaxInfoNodeValidate && validateFnArr.push(bizOrgTaxInfoNode.bizOrgTaxInfoNodeValidate(_this));
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
                for (let groupId in _this.oppBusiData.copyCurrentGroupData) {
                    for (let moduleId in _this.oppBusiData.copyCurrentGroupData[groupId]) {
                        _this.groupDatas[groupId][moduleId] = 
                            _.cloneDeep(_this.oppBusiData.copyCurrentGroupData[groupId][moduleId])
                        // 特例： 控股股东/实际控制人/受益所有人，要触发一下 MODULE_RADIO_BUTTON 的 check 函数，防止级联关系没有被取消
                        if (["STOCKHOLDER_INFO", "ACTUAL_CONTROLLER_INFO", "BENEFICIARY_OWNER_INFO"].includes(moduleId)) {
                            _.each(_this.groupDatas[groupId][moduleId], module => {
                                let fields = module.FIELDS;
                                if (fields["MODULE_RADIO_BUTTON"]) {
                                    let func = fields["MODULE_RADIO_BUTTON"].FIELD_FUNCTION;
                                    _this.busiLogic[func] && _this.busiLogic[func](_this, fields["MODULE_RADIO_BUTTON"], fields, module);
                                }
                            })
                        }
                    }
                }
                _this.moduleDatas = {};
                _this.changedField = [];
            },
    
            /********************************************审核*********************************************************/
            //读卡按钮触发事件
            "readModule": (_this, moduleId, fieldData, groupInfo) => {
                // 勾选了“与xx一致”按钮时，不允许读卡
                if (fieldData.MODULE_RADIO_BUTTON && fieldData.MODULE_RADIO_BUTTON.DEFAULT_VALUE == "true") {
                    _this.messageBox({
                        hasMask: true,
                        messageText: "请先取消勾选\"" + fieldData.MODULE_RADIO_BUTTON.FIELD_TITLE + "\"" + "再进行读卡。",
                        confirmButtonText: '确定',
                        typeMessage: 'warn',
                        showMsgBox: true,
                    })
                    return;
                }
                // 0-身份证 1-工商营业执照，为空时不支持 OCR
                let ocrCardType = ""; 
                if (moduleId == "DOC_INFO") {
                    ocrCardType = "1";
                }
                _this.$router.goModule("readCardModule", {"moduleId": moduleId, "groupInfo": groupInfo, "ocrCardType":ocrCardType});
            },
            "handleReadCardSuccess": (_this, module, cardInfo, groupInfo) => {
                switchToCurModule(_this, module, groupInfo);

                let nowDate = parseInt(_this.oppBusiData.SYS_DATE);
                let idExpDate = parseInt(cardInfo.ID_EXP_DATE);
                if (isNaN(idExpDate) || idExpDate < nowDate) {
                    _this.messageBox({
                        hasMask: true,
                        messageText: "您的证件有效期已过期或不可识别，请手动输入！",
                        confirmButtonText: '确定',
                        typeMessage: 'warn',
                        showMsgBox: true,

                    })
                    cardInfo.ID_EXP_DATE = "";
                }
                if (module && module.MODULE_ID  == "DOC_INFO") {
                    module.FIELDS.CUST_FNAME.DEFAULT_VALUE = cardInfo.CUST_FNAME;
                    module.FIELDS.CUST_NAME.DEFAULT_VALUE = cardInfo.CUST_NAME;
                    // 防止 ID_TYPE 更新后清空证件号码、证件有效期
                    module.FIELDS.ID_TYPE.disableClear = true;
                    module.FIELDS.ID_TYPE.DEFAULT_VALUE = cardInfo.ID_TYPE;
                    module.FIELDS.ID_CODE.DEFAULT_VALUE = cardInfo.ID_CODE;
                    module.FIELDS.ID_EXP_DATE.DEFAULT_VALUE = cardInfo.ID_EXP_DATE;
                    module.FIELDS.BUSINESS_RANGE.DEFAULT_VALUE = cardInfo.BUSINESS_SCOPE;
                    module.FIELDS.REGISTER_CURRENCY.DEFAULT_VALUE = cardInfo.REGISTER_CURRENCY;
                    module.FIELDS.REGISTER_FUND.DEFAULT_VALUE = cardInfo.REGISTER_FUND;
                    module.FIELDS.BIRTHDAY.DEFAULT_VALUE = cardInfo.FOUND_DATE;
                    module.FIELDS.CORP_ADDR.DEFAULT_VALUE = cardInfo.ID_ADDR;
                }
                if (module && module.MODULE_ID  == "LINKMAN_INFO") {
                    module.FIELDS.LINKMAN_NAME.DEFAULT_VALUE = cardInfo.CUST_FNAME;
                    module.FIELDS.LINKMAN_ID_TYPE.disableClear = true;
                    module.FIELDS.LINKMAN_ID_TYPE.DEFAULT_VALUE = cardInfo.ID_TYPE;
                    module.FIELDS.LINKMAN_ID.DEFAULT_VALUE = cardInfo.ID_CODE;
                }
                if (module && module.MODULE_ID  == "LEGAL_REP_INFO") {
                    module.FIELDS.LEGAL_REP.DEFAULT_VALUE = cardInfo.CUST_FNAME;
                    module.FIELDS.LEGAL_REP_ID_TYPE.disableClear = true;
                    module.FIELDS.LEGAL_REP_ID_TYPE.DEFAULT_VALUE = cardInfo.ID_TYPE;
                    module.FIELDS.LEGAL_REP_ID_CODE.DEFAULT_VALUE = cardInfo.ID_CODE;
                    module.FIELDS.LEGAL_REP_ID_EXP_DATE.DEFAULT_VALUE = cardInfo.ID_EXP_DATE;
                }
                if (module && module.MODULE_ID  == "LEGAL_CLIENT_INFO") {
                    module.FIELDS.LEGAL_CLIENT_NAME.DEFAULT_VALUE = cardInfo.CUST_FNAME;
                    module.FIELDS.LEGAL_CLIENT_ID_TYPE.disableClear = true;
                    module.FIELDS.LEGAL_CLIENT_ID_TYPE.DEFAULT_VALUE = cardInfo.ID_TYPE;
                    module.FIELDS.LEGAL_CLIENT_ID_CODE.DEFAULT_VALUE = cardInfo.ID_CODE;
                    module.FIELDS.LEGAL_CLIENT_EXP_DATE.DEFAULT_VALUE = cardInfo.ID_EXP_DATE;
                }
                if (module && module.MODULE_ID  == "RESPONSIBLE_PERSON_INFO") {
                    module.FIELDS.RESPONSIBILITY_REP.DEFAULT_VALUE = cardInfo.CUST_FNAME;
                    module.FIELDS.RESPONSIBILITY_REP_ID_TYPE.disableClear = true;
                    module.FIELDS.RESPONSIBILITY_REP_ID_TYPE.DEFAULT_VALUE = cardInfo.ID_TYPE;
                    module.FIELDS.RESPONSIBILITY_REP_ID_CODE.DEFAULT_VALUE = cardInfo.ID_CODE;
                    module.FIELDS.RESPONSIBILITY_REP_ID_EXP_DATE.DEFAULT_VALUE = cardInfo.ID_EXP_DATE;
                }
                if (module && module.MODULE_ID  == "STOCKHOLDER_INFO") {
                    module.FIELDS.CONTROLLER.DEFAULT_VALUE = cardInfo.CUST_FNAME;
                    module.FIELDS.CONTROLLER_ID_TYPE.disableClear = true;
                    module.FIELDS.CONTROLLER_ID_TYPE.DEFAULT_VALUE = cardInfo.ID_TYPE;
                    module.FIELDS.CONTROLLER_ID_CODE.DEFAULT_VALUE = cardInfo.ID_CODE;
                    module.FIELDS.CONTROLLER_ID_EXP_DATE.DEFAULT_VALUE = cardInfo.ID_EXP_DATE;
                }
                if (module && module.MODULE_ID  == "ACTUAL_CONTROLLER_INFO") {
                    module.FIELDS.CONTROLER_NAME.DEFAULT_VALUE = cardInfo.CUST_FNAME;
                    module.FIELDS.CONTROLER_ID_TYPE.disableClear = true;
                    module.FIELDS.CONTROLER_ID_TYPE.DEFAULT_VALUE = cardInfo.ID_TYPE;
                    module.FIELDS.CONTROLER_ID_NO.DEFAULT_VALUE = cardInfo.ID_CODE;
                    module.FIELDS.CONTROLER_ID_EXP_DATE.DEFAULT_VALUE = cardInfo.ID_EXP_DATE;
                }
            },
            //读卡数据返回
            "readModuleCardInfoAction": (_this, moduleId, fieldData, ocrCardInfo) => {
                if (!_.isEmpty(ocrCardInfo)) {
                }
            },
            //字段改变
            fieldDataChange: (_this, field, fieldData, moduleInfo) => {
                let that = this;  
                if (_this.moduleId.indexOf("ORG_LINK_INFO") > -1 && field.FIELD_ID == "OFFICE_ADDR") {
                    bizOrgLinkInfoNode.CHECK_OFFICE_ADDR && bizOrgLinkInfoNode.CHECK_OFFICE_ADDR(_this, field, fieldData);
                }
                if (_this.moduleId.indexOf("ORG_TAX_BASIC_INFO") > -1 && field.FIELD_ID == "ADDRESS") {
                    bizOrgTaxInfoNode.CHECK_ORG_TAX_BASIC_INFO_ADDRESS && bizOrgTaxInfoNode.CHECK_ORG_TAX_BASIC_INFO_ADDRESS(_this, field, fieldData);
                }
                if (_this.moduleId.indexOf("ORG_TAX_CONTROLER_MODULE3") > -1 && field.FIELD_ID == "BIRTH_ADDRESS") {
                    bizOrgControllerTaxInfoNode.CHECK_ORG_CONTROLLER_TAX_BIRTH_ADDRESS && bizOrgControllerTaxInfoNode.CHECK_ORG_CONTROLLER_TAX_BIRTH_ADDRESS(_this, field, fieldData);
                }
                if (_this.moduleId.indexOf("ORG_TAX_CONTROLER_MODULE4") > -1 && field.FIELD_ID == "ADDRESS") {
                    bizOrgControllerTaxInfoNode.CHECK_ORG_CONTROLLER_TAX_ADDRESS && bizOrgControllerTaxInfoNode.CHECK_ORG_CONTROLLER_TAX_ADDRESS(_this, field, fieldData);
                }
                if (!field.DEFAULT_VALUE && field.FIELD_REQUIRED == "1" && field.FIELD_CONTROL != "1") {
                    _this.disableNext = true;
                    return
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
            },
            "CHECK_MODULE_RADIO": (_this, field, fieldData, module) => {
                if ("RESPONSIBLE_PERSON_INFO" == field.MODULE_ID) {
                    bizOrgResponsibleInfoNode.CHECK_MODULE_RADIO(_this, field, fieldData, module);
                }
                if ("STOCKHOLDER_INFO" == field.MODULE_ID) {
                    bizOrgStockholderInfoNode.CHECK_MODULE_RADIO(_this, field, fieldData, module);
                }
                if ("ACTUAL_CONTROLLER_INFO" == field.MODULE_ID) {
                    bizOrgActualControllerNode.CHECK_MODULE_RADIO(_this, field, fieldData, module);
                }
                if ("BENEFICIARY_OWNER_INFO" == field.MODULE_ID) {
                    bizOrgBeneficiaryOwnerNode.CHECK_MODULE_RADIO(_this, field, fieldData, module);
                }
            },
            CHECK_TAX_RESIDENT_TYPE: (_this, field, fieldData) => {
                if (_this.groupId == "TAX_INFO") {
                    bizOrgTaxInfoNode.CHECK_ORG_TAX_RESIDENT_TYPE && bizOrgTaxInfoNode.CHECK_ORG_TAX_RESIDENT_TYPE(_this, field, fieldData);
                }
                if (_this.groupId == "CONTROLLER_TAX_INFO") {
                    bizOrgControllerTaxInfoNode.CHECK_ORG_CONTROLLER_TAX_RESIDENT_TYPE && bizOrgControllerTaxInfoNode.CHECK_ORG_CONTROLLER_TAX_RESIDENT_TYPE(_this, field, fieldData);
                }
            },
            CHECK_NATION_ENG: (_this, field, fieldData) => {
                if (_this.groupId == "TAX_INFO") {
                    bizOrgTaxInfoNode.CHECK_ORG_NATION_ENG && bizOrgTaxInfoNode.CHECK_ORG_NATION_ENG(_this, field, fieldData);
                }
                if (_this.groupId == "CONTROLLER_TAX_INFO") {
                    bizOrgControllerTaxInfoNode.CHECK_ORG_CONTROLLER_NATION_ENG && bizOrgControllerTaxInfoNode.CHECK_ORG_CONTROLLER_NATION_ENG(_this, field, fieldData);
                }
            },
            CHECK_PROVINCE: (_this, field, fieldData) => {
                if (_this.groupId == "TAX_INFO") {
                    bizOrgTaxInfoNode.CHECK_ORG_PROVINCE && bizOrgTaxInfoNode.CHECK_ORG_PROVINCE(_this, field, fieldData);
                }
                if (_this.groupId == "CONTROLLER_TAX_INFO") {
                    bizOrgControllerTaxInfoNode.CHECK_ORG_CONTROLLER_PROVINCE && bizOrgControllerTaxInfoNode.CHECK_ORG_CONTROLLER_PROVINCE(_this, field, fieldData);
                }
            },
            CHECK_CITYCN: (_this, field, fieldData) => {
                if (_this.groupId == "TAX_INFO") {
                    bizOrgTaxInfoNode.CHECK_ORG_CITYCN && bizOrgTaxInfoNode.CHECK_ORG_CITYCN(_this, field, fieldData);
                }
                if (_this.groupId == "CONTROLLER_TAX_INFO") {
                    bizOrgControllerTaxInfoNode.CHECK_ORG_CONTROLLER_CITYCN && bizOrgControllerTaxInfoNode.CHECK_ORG_CONTROLLER_CITYCN(_this, field, fieldData);
                }
            },
            CHECK_HAS_TAXPAYER_IDNO: (_this, field, fieldData) => {
                if (_this.groupId == "TAX_INFO") {
                    bizOrgTaxInfoNode.CHECK_ORG_HAS_TAXPAYER_IDNO && bizOrgTaxInfoNode.CHECK_ORG_HAS_TAXPAYER_IDNO(_this, field, fieldData);
                }
                if (_this.groupId == "CONTROLLER_TAX_INFO") {
                    bizOrgControllerTaxInfoNode.CHECK_ORG_CONTROLLER_HAS_TAXPAYER_IDNO && bizOrgControllerTaxInfoNode.CHECK_ORG_CONTROLLER_HAS_TAXPAYER_IDNO(_this, field, fieldData);
                }
            },
            CHECK_OPP_NO_TAXPAYERID_REASON: (_this, field, fieldData) => {
                if (_this.groupId == "TAX_INFO") {
                    bizOrgTaxInfoNode.CHECK_ORG_OPP_NO_TAXPAYERID_REASON && bizOrgTaxInfoNode.CHECK_ORG_OPP_NO_TAXPAYERID_REASON(_this, field, fieldData);
                }
                if (_this.groupId == "CONTROLLER_TAX_INFO") {
                    bizOrgControllerTaxInfoNode.CHECK_ORG_CONTROLLER_OPP_NO_TAXPAYERID_REASON && bizOrgControllerTaxInfoNode.CHECK_ORG_CONTROLLER_OPP_NO_TAXPAYERID_REASON(_this, field, fieldData);
                }
            },
        })
export default V0049_ORG;