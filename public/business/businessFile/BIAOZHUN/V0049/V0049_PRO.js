// 基本信息
import bizProBasicInfoNode from '../../BIAOZHUN/commonModules/commonBizNode/pro/proInfo/bizProBasicInfoNode'
// 反洗钱信息
import bizProAmlInfoNode from "../commonModules/commonBizNode/pro/beneficiaryInfo/bizProAmlInfoNode"
// 实际受益人（受益所有人）
import bizProBeneficiaryOwnerNode from "../commonModules/commonBizNode/pro/beneficiaryInfo/bizProBeneficiaryOwnerNode"
// 管理人基本信息
import bizProManagerBasicInfoNode from '../commonModules/commonBizNode/pro/managerInfo/bizProManagerBasicInfoNode'
// 法定代表人信息
import bizProLegalRepInfoNode from "../commonModules/commonBizNode/pro/managerInfo/bizProLegalRepInfoNode"
// 委派代表人信息
import bizProLegalClientInfoNode from "../commonModules/commonBizNode/pro/managerInfo/bizProLegalClientInfoNode"
// 负责人信息
import bizProResponsibleInfoNode from "../commonModules/commonBizNode/pro/managerInfo/bizProResponsibleInfoNode"
// 合伙人信息
import bizProPartnerInfoNode from "../commonModules/commonBizNode/pro/managerInfo/bizProPartnerInfoNode"
// 控股股东信息
import bizProStockholderInfoNode from "../commonModules/commonBizNode/pro/managerInfo/bizProStockholderInfoNode"
// 实际控制人
import bizProActualControllerNode from "../commonModules/commonBizNode/pro/managerInfo/bizProActualControllerNode"
// 诚信记录信息
import bizProCreditRecordInfoNode from "../commonModules/commonBizNode/pro/managerInfo/bizProCreditRecordInfoNode"
// 产品托管人信息
import bizProTrusteeInfoNode from '../commonModules/commonBizNode/pro/otherInfo/bizProTrusteeInfoNode'
// 产品联系人信息
import bizProLinkmanInfoNode from '../commonModules/commonBizNode/pro/otherInfo/bizProLinkmanInfoNode'

import oppService from '../../../../service/opp-service'
import date from "../../../../tools/date.js";
import * as bizPublicTools from "../commonModules/commonBizNode/bizPublicTools.js"
import dict from "../../../../tools/dict"
import custService from '../../../../service/cust-service'
import csdsSerivce from '../../../../service/csdc-service'

const axiosCfg = {
    retry: 1,
}
//YG003660 查询基本信息 由于现有的w0000312用的是建投的接口导致有部分字段没有查回来
const YG003660 = (_this) => {
    let customerInfo = _this.oppBusiData.customerInfo;
    return _this.$syscfg.K_Request("YG003660", {
        USER_CODE: customerInfo.CUST_CODE,
        CUST_CODE: customerInfo.CUST_CODE,
        MODEL_TYPE: "CUST_ALL_INFO",
        INFO_TYPE: "BASIC_INFO,ORG_INFO,STOCKHOLDER_INFO,LINKMAN_INFO,PARTNER_INFO,PRODUCT_INFO,OTHER_INFO",
    }, false, axiosCfg).then( res => {
        return _.get(res, "Data[0]", {});
    }).catch( err => {
        throw err;
    })
}
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
//一码通
const getCSDCYmtData = (_this) => {
    let customerInfo = _this.oppBusiData.customerInfo;
    return csdsSerivce.getCSDCYmtData(customerInfo.CUST_FNAME, customerInfo.ID_TYPE, customerInfo.ID_CODE).then( res => {
        _this.oppBusiData.ymtData = _.filter(res, item => {return item.YMT_CODE != "" && item.YMT_STATUS != "1"}) || [];
        _this.oppBusiData.zdYmtData = _.filter(_this.oppBusiData.ymtData, obj => {
            return !_.isEmpty(obj.YMT_CODE);
        }) || [];
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
    if (!_.isEmpty(res[4]) && _this.oppBusiData.oldBusiData.PRO_MANAGER_INFO) {
        let data = res[4];
        _.merge(_this.oppBusiData.oldBusiData, {
            PRO_MANAGER_INFO: {
                PRO_MANAGER_ASSI_CODE: data.PRODUCT_INFO && data.PRODUCT_INFO.PRO_MANAGER_ASSI_CODE || "",
                BIRTHDAY: data.BASIC_INFO && data.BASIC_INFO.BIRTHDAY || "",
                REGISTER_CURRENCY: data.ORG_INFO && data.ORG_INFO.REGISTER_CURRENCY || "",
                REGISTER_FUND: data.ORG_INFO && data.ORG_INFO.REGISTER_FUND || "",
                CORP_ADDR: data.BASIC_INFO && data.BASIC_INFO.OFFICE_ADDR || "",
                BUSINESS_RANGE: data.ORG_INFO && data.ORG_INFO.BUSINESS_RANGE || "",
                LEGAL_REP_TYPE: data.ORG_INFO && data.ORG_INFO.LEGAL_REP_TYPE || "",
                SZORG_TYPE: data.OTHER_INFO && data.OTHER_INFO.SZORG_TYPE || "",
                TRADE: data.ORG_INFO && data.ORG_INFO.TRADE || "",
                SMFUND_MANAGER_ID: data.ORG_INFO && data.ORG_INFO.SMFUND_MANAGER_ID || "",
                OFFICE_TEL: data.BASIC_INFO && data.BASIC_INFO.OFFICE_TEL || "",
                EMAIL: data.BASIC_INFO && data.BASIC_INFO.EMAIL || "",
                OFFICE_ADDR: data.BASIC_INFO && data.BASIC_INFO.CORP_ADDR || "",
                ZIP_CODE: data.BASIC_INFO && data.BASIC_INFO.ZIP_CODE || "",
                CITIZENSHIP: data.BASIC_INFO && data.BASIC_INFO.CITIZENSHIP || "",
                INDUS_GB: data.ORG_INFO && data.ORG_INFO.INDUS_GB || "",
                PRO_MANAGER_TEL: data.PRODUCT_INFO && data.PRODUCT_INFO.PRO_MANAGER_TEL || "",
                INOUTSIDE_IDENTITY: data.BASIC_INFO && data.BASIC_INFO.INOUTSIDE_IDENTITY || "",
                CITIZENSHIP: data.BASIC_INFO && data.BASIC_INFO.CITIZENSHIP || "",
            }
        });
    }
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


const V0049_PRO = _.merge(
            _.cloneDeep(bizProBasicInfoNode),
            _.cloneDeep(bizProCreditRecordInfoNode),
            _.cloneDeep(bizProLinkmanInfoNode),
            _.cloneDeep(bizProLegalRepInfoNode),
            _.cloneDeep(bizProResponsibleInfoNode),
            _.cloneDeep(bizProStockholderInfoNode),
            _.cloneDeep(bizProActualControllerNode),
            _.cloneDeep(bizProLegalClientInfoNode),
            _.cloneDeep(bizProPartnerInfoNode),
            _.cloneDeep(bizProAmlInfoNode),
            _.cloneDeep(bizProBeneficiaryOwnerNode),
            _.cloneDeep(bizProManagerBasicInfoNode),
            _.cloneDeep(bizProTrusteeInfoNode),
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
                    oppService.getBusiCommonParams(_this.busiCode),
                    getValidIdTypeData(_this),
                    getDictArrData(_this),
                    YG003660(_this),
                    csdsSerivce.queryCSDCTime(),
                    _this.$syscfg.getSysDate(),
                    _this.$blMethod.getBusiAcctOpenLogic(_this, { USER_TYPE: "2"}),
                    custService.queryValidIDType("0"),
                    custService.queryValidIDType("2"),
                    getCSDCYmtData(_this),
                    getTopSubacctInfo(_this),
                    Y1000200(_this),
                ]).then(res => {
                    _this.oppBusiData.SYS_DATE = res[6];
                    _this.oppBusiData.IS_IN_ZD_TIME = res[5];
                    _this.oppBusiData.allAcctOpenLogicData = res[7];
                    _this.oppBusiData.individualValidIdTypes = _.map(res[8], "DICT_ITEM");
                    _this.oppBusiData.orgValidIdTypes = _.map(res[9], "DICT_ITEM");
                    setOldBusiData(_this, res);
                    setSysTrdacctArr(_this);
                    let oppCustInfo = {};
                    if (_.isEmpty(_this.oppBusiData.newBusiData)) {
                        _this.oppBusiData.newBusiData = {};
                    }
    
                    //客户原始数据（落地数据）保存到缓存
                    _this.$storage.setSession(_this.$definecfg.CUST_ORIGINAL_DATA, _this.oppBusiData.oldBusiData);
                    _.merge(_this.oppBusiData.newBusiData, _this.oppBusiData.oldBusiData, oppCustInfo);
                    if (res[1]) {
                        _this.$storage.setSession(_this.$definecfg.BUSI_COMM_PARAM, res[1]);
                        //业务公共参数转为对象，方便取值 @linsc
                        let busiCommonParams = {};
                        _.each(res[1] || [], (obj) => {
                            busiCommonParams[obj.PARAM_CODE] = obj.PARAM_VALUE
                        });
                        _this.$storage.setSession(_this.$definecfg.BUSI_COMM_PARAM_OBJS, busiCommonParams);
                    }
                    _this.oppBusiData.busiCommonParams = _this.$storage.getJsonSession(_this.$definecfg.BUSI_COMM_PARAM_OBJS);
                    return Promise.all([
                        bizProBasicInfoNode.bizProBasicInfoNodeBeforeLoadBiz && bizProBasicInfoNode.bizProBasicInfoNodeBeforeLoadBiz(_this),
                        bizProCreditRecordInfoNode.bizProCreditRecordInfoBeforeLoadBiz && bizProCreditRecordInfoNode.bizProCreditRecordInfoBeforeLoadBiz(_this), 
                        bizProLinkmanInfoNode.bizProLinkmanInfoNodeBeforeLoadBiz && bizProLinkmanInfoNode.bizProLinkmanInfoNodeBeforeLoadBiz(_this),
                        bizProLegalRepInfoNode.bizProLegalRepInfoBeforeLoadBiz && bizProLegalRepInfoNode.bizProLegalRepInfoBeforeLoadBiz(_this),
                        bizProResponsibleInfoNode.bizProResponsibleInfoBeforeLoadBiz && bizProResponsibleInfoNode.bizProResponsibleInfoBeforeLoadBiz(_this),
                        bizProStockholderInfoNode.bizProStockholderInfoBeforeLoadBiz && bizProStockholderInfoNode.bizProStockholderInfoBeforeLoadBiz(_this),
                        bizProActualControllerNode.bizProActualControllerNodeBeforeLoadBiz && bizProActualControllerNode.bizProActualControllerNodeBeforeLoadBiz(_this),
                        bizProLegalClientInfoNode.bizProLegalClientInfoBeforeLoadBiz && bizProLegalClientInfoNode.bizProLegalClientInfoBeforeLoadBiz(_this),
                        bizProPartnerInfoNode.bizProPartnerInfoBeforeLoadBiz && bizProPartnerInfoNode.bizProPartnerInfoBeforeLoadBiz(_this),
                        bizProAmlInfoNode.bizProAmlInfoBeforeLoadBiz && bizProAmlInfoNode.bizProAmlInfoBeforeLoadBiz(_this),
                        bizProBeneficiaryOwnerNode.bizProBeneficiaryOwnerBeforeLoadBiz && bizProBeneficiaryOwnerNode.bizProBeneficiaryOwnerBeforeLoadBiz(_this),
                        bizProManagerBasicInfoNode.bizProManagerBasicInfoNodeBeforeLoadBiz && bizProManagerBasicInfoNode.bizProManagerBasicInfoNodeBeforeLoadBiz(_this),
                        bizProTrusteeInfoNode.bizProTrusteeInfoNodeBeforeLoadBiz && bizProTrusteeInfoNode.bizProTrusteeInfoNodeBeforeLoadBiz(_this),
                    ]).then({

                    }).catch(err => {
                        console.error(err);
                    })
                }).catch(err => {
                    throw err;
                })
            },
            "afterLoadBiz": (_this) => {
                return Promise.all([
                        bizProBasicInfoNode.bizProBasicInfoNodeAfterLoadBiz && bizProBasicInfoNode.bizProBasicInfoNodeAfterLoadBiz(_this),
                        bizProCreditRecordInfoNode.bizProCreditRecordInfoAfterLoadBiz && bizProCreditRecordInfoNode.bizProCreditRecordInfoAfterLoadBiz(_this),
                        bizProLinkmanInfoNode.bizProLinkmanInfoNodeAfterLoadBiz && bizProLinkmanInfoNode.bizProLinkmanInfoNodeAfterLoadBiz(_this),
                        bizProLegalRepInfoNode.bizProLegalRepInfoAfterLoadBiz && bizProLegalRepInfoNode.bizProLegalRepInfoAfterLoadBiz(_this),
                        bizProLegalClientInfoNode.bizProLegalClientInfoAfterLoadBiz && bizProLegalClientInfoNode.bizProLegalClientInfoAfterLoadBiz(_this),
                        bizProResponsibleInfoNode.bizProResponsibleInfoAfterLoadBiz && bizProResponsibleInfoNode.bizProResponsibleInfoAfterLoadBiz(_this),
                        bizProPartnerInfoNode.bizProPartnerInfoAfterLoadBiz && bizProPartnerInfoNode.bizProPartnerInfoAfterLoadBiz(_this),
                        bizProStockholderInfoNode.bizProStockholderInfoAfterLoadBiz && bizProStockholderInfoNode.bizProStockholderInfoAfterLoadBiz(_this),
                        bizProActualControllerNode.bizProActualControllerNodeAfterLoadBiz && bizProActualControllerNode.bizProActualControllerNodeAfterLoadBiz(_this),
                        bizProAmlInfoNode.bizProAmlInfoAfterLoadBiz && bizProAmlInfoNode.bizProAmlInfoAfterLoadBiz(_this),
                        bizProBeneficiaryOwnerNode.bizProBeneficiaryOwnerAfterLoadBiz && bizProBeneficiaryOwnerNode.bizProBeneficiaryOwnerAfterLoadBiz(_this), 
                        bizProManagerBasicInfoNode.bizProManagerBasicInfoNodeAfterLoadBiz && bizProManagerBasicInfoNode.bizProManagerBasicInfoNodeAfterLoadBiz(_this),
                        bizProTrusteeInfoNode.bizProTrusteeInfoNodeAfterLoadBiz && bizProTrusteeInfoNode.bizProTrusteeInfoNodeAfterLoadBiz(_this),
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
                    bizProCreditRecordInfoNode.bizProCreditRecordInfoNodeAddModuleFinished && bizProCreditRecordInfoNode.bizProCreditRecordInfoNodeAddModuleFinished(_this, module);
                }
                // 联系人
                if (module.MODULE_ID.indexOf("LINKMAN_INFO") != -1) {
                    bizProLinkmanInfoNode.bizProLinkmanInfoNodeAddModuleFinished && bizProLinkmanInfoNode.bizProLinkmanInfoNodeAddModuleFinished(_this, module);
                }
                // 合伙人
                if (module.MODULE_ID.indexOf("PARTNER_INFO") != -1) {
                    bizProPartnerInfoNode.bizProPartnerInfoNodeAddModuleFinished && bizProPartnerInfoNode.bizProPartnerInfoNodeAddModuleFinished(_this, module);
                }
                // 控股股东
                if (module.MODULE_ID.indexOf("STOCKHOLDER_INFO") != -1) {
                    bizProStockholderInfoNode.bizProStockholderInfoNodeAddModuleFinished && bizProStockholderInfoNode.bizProStockholderInfoNodeAddModuleFinished(_this, module);
                }
                // 实际控制人
                if (module.MODULE_ID.indexOf("ACTUAL_CONTROLLER_INFO") != -1) {
                    bizProActualControllerNode.bizProActualControllerNodeAddModuleFinished && bizProActualControllerNode.bizProActualControllerNodeAddModuleFinished(_this, module);
                }
                // 受益所有人
                if (module.MODULE_ID.indexOf("BENEFICIARY_OWNER_INFO") != -1) {
                    bizProBeneficiaryOwnerNode.bizProBeneficiaryOwnerAddModuleFinished && bizProBeneficiaryOwnerNode.bizProBeneficiaryOwnerAddModuleFinished(_this, module);
                }
            },
            "deleteModuleFinished": (_this, deleteObj, moduleData) => {
                let module = deleteObj[0];
                if (module.MODULE_ID.indexOf("CREDIT_RECORD_INFO") > -1) {
                    bizProCreditRecordInfoNode.bizProCreditRecordInfoNodeDeleteModuleFinished && bizProCreditRecordInfoNode.bizProCreditRecordInfoNodeDeleteModuleFinished(_this, deleteObj);
                }
                // 合伙人
                if (module.MODULE_ID.indexOf("PARTNER_INFO") != -1) {
                    bizProPartnerInfoNode.bizProPartnerInfoNodeDeleteModuleFinished && bizProPartnerInfoNode.bizProPartnerInfoNodeDeleteModuleFinished(_this, module);
                }
                // 控股股东
                if (module.MODULE_ID.indexOf("STOCKHOLDER_INFO") != -1) {
                    bizProStockholderInfoNode.bizProStockholderInfoNodeDeleteModuleFinished && bizProStockholderInfoNode.bizProStockholderInfoNodeDeleteModuleFinished(_this, module);
                }
                // 实际控制人
                if (module.MODULE_ID.indexOf("ACTUAL_CONTROLLER_INFO") != -1) {
                    bizProActualControllerNode.bizProActualControllerNodeDeleteModuleFinished && bizProActualControllerNode.bizProActualControllerNodeDeleteModuleFinished(_this, module);
                }
                // 联系人
                if (module.MODULE_ID.indexOf("LINKMAN_INFO") != -1) {
                    bizProLinkmanInfoNode.bizProLinkmanInfoNodeDeleteModuleFinished && bizProLinkmanInfoNode.bizProLinkmanInfoNodeDeleteModuleFinished(_this, module);
                }
                // 受益所有人
                if (module.MODULE_ID.indexOf("BENEFICIARY_OWNER_INFO") != -1) {
                    bizProBeneficiaryOwnerNode.bizProBeneficiaryOwnerDeleteModuleFinished && bizProBeneficiaryOwnerNode.bizProBeneficiaryOwnerDeleteModuleFinished(_this, module);
                }
            },
            "deleteModule": (_this, moduleld, fieldData) => {
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
                //管理人身份信息
                if (_this.moduleId.indexOf("MANAGER_DOC_INFO") != -1 || _this.moduleId.indexOf("MANAGER_BASIC_INFO") != -1) {
                    bizProManagerBasicInfoNode.bizProManagerBasicInfoNodePageActivated && bizProManagerBasicInfoNode.bizProManagerBasicInfoNodePageActivated(_this);
                }
                //不良诚信记录
                if (_this.moduleId.indexOf("CREDIT_RECORD_INFO") != -1) {
                    bizProCreditRecordInfoNode.bizProCreditRecordInfoPageActived && bizProCreditRecordInfoNode.bizProCreditRecordInfoPageActived(_this);
                }
                // 法定代表人/执行事务合伙人
                if (_this.moduleId.indexOf("LEGAL_REP_INFO") != -1) {
                    bizProLegalRepInfoNode.bizProLegalRepInfoPageActivated && bizProLegalRepInfoNode.bizProLegalRepInfoPageActivated(_this);
                }
                // 负责人信息
                if (_this.moduleId.indexOf("RESPONSIBLE_PERSON_INFO") != -1) {
                    bizProResponsibleInfoNode.bizProResponsibleInfoPageActivated && bizProResponsibleInfoNode.bizProResponsibleInfoPageActivated(_this);
                }
                // 合伙人信息
                if (_this.moduleId.indexOf("PARTNER_INFO") != -1) {
                    bizProPartnerInfoNode.bizProPartnerInfoPageActivated && bizProPartnerInfoNode.bizProPartnerInfoPageActivated(_this);
                }
                // 控股股东
                if (_this.moduleId.indexOf("STOCKHOLDER_INFO") != -1) {
                    bizProStockholderInfoNode.bizProStockholderInfoPageActivated && bizProStockholderInfoNode.bizProStockholderInfoPageActivated(_this);
                }
                // 实际控制人
                if (_this.moduleId.indexOf("ACTUAL_CONTROLLER_INFO") != -1) {
                    bizProActualControllerNode.bizProActualControllerNodePageActivated && bizProActualControllerNode.bizProActualControllerNodePageActivated(_this);
                }
            },
            'beforeSave': async (_this, params) => {
                if (!_this.moduleId) {
                    return;
                }
                // 基本信息
                if (_this.moduleId.indexOf("DOC_INFO") != -1 || _this.moduleId.indexOf("PRODUCT_INFO") != -1) {
                    bizProBasicInfoNode.bizProBasicInfoNodeBeforeSave && bizProBasicInfoNode.bizProBasicInfoNodeBeforeSave(_this, params)
                }
                // 管理人身份信息
                if (_this.moduleId.indexOf("MANAGER_DOC_INFO") != -1 || _this.moduleId.indexOf("MANAGER_BASIC_INFO") != -1) {
                    bizProManagerBasicInfoNode.bizProManagerBasicInfoNodeBeforeSave && bizProManagerBasicInfoNode.bizProManagerBasicInfoNodeBeforeSave(_this, params)
                }
                // 托管人信息
                if (_this.moduleId.indexOf("TRUSTEE_INFO") != -1) {
                    bizProTrusteeInfoNode.bizProTrusteeInfoNodeBeforeSave && bizProTrusteeInfoNode.bizProTrusteeInfoNodeBeforeSave(_this, params)
                }
                // 不良诚信记录
                if (_this.moduleId.indexOf("CREDIT_RECORD_INFO") != -1) {
                    bizProCreditRecordInfoNode.bizProCreditRecordInfoBeforeSave && bizProCreditRecordInfoNode.bizProCreditRecordInfoBeforeSave(_this, params)
                }
                // 联系人信息
                if (_this.moduleId.indexOf("LINKMAN_INFO") != -1) {
                    bizProLinkmanInfoNode.bizProLinkmanInfoNodeBeforeSave && bizProLinkmanInfoNode.bizProLinkmanInfoNodeBeforeSave(_this, params);
                }
                // 法定代表人信息
                if (_this.moduleId.indexOf("LEGAL_REP_INFO") != -1) {
                    bizProLegalRepInfoNode.bizProLegalRepInfoBeforeSave && bizProLegalRepInfoNode.bizProLegalRepInfoBeforeSave(_this, params);
                }
                // 委派代表人信息
                if (_this.moduleId.indexOf("LEGAL_CLIENT_INFO") != -1) {
                    bizProLegalClientInfoNode.bizProLegalClientInfoBeforeSave && bizProLegalClientInfoNode.bizProLegalClientInfoBeforeSave(_this, params);
                }
                // 负责人信息
                if (_this.moduleId.indexOf("RESPONSIBLE_PERSON_INFO") != -1) {
                    bizProResponsibleInfoNode.bizProResponsibleInfoBeforeSave && bizProResponsibleInfoNode.bizProResponsibleInfoBeforeSave(_this, params);
                }
                // 合伙人信息
                if (_this.moduleId.indexOf("PARTNER_INFO") != -1) {
                    bizProPartnerInfoNode.bizProPartnerInfoBeforeSave && bizProPartnerInfoNode.bizProPartnerInfoBeforeSave(_this, params);
                }
                // 控股股东信息
                if (_this.moduleId.indexOf("STOCKHOLDER_INFO") != -1) {
                    bizProStockholderInfoNode.bizProStockholderInfoBeforeSave && bizProStockholderInfoNode.bizProStockholderInfoBeforeSave(_this, params);
                }
                // 实际控制人
                if (_this.moduleId.indexOf("ACTUAL_CONTROLLER_INFO") != -1) {
                    bizProActualControllerNode.bizProActualControllerNodeBeforeSave && bizProActualControllerNode.bizProActualControllerNodeBeforeSave(_this, params);
                }
                // 反洗钱信息
                if (_this.moduleId.indexOf("AML_INFO") != -1) {
                    // 为了简化逻辑，反洗钱信息与基本信息一同保存
                    bizProBasicInfoNode.bizProBasicInfoNodeBeforeSave && bizProBasicInfoNode.bizProBasicInfoNodeBeforeSave(_this, params);
                }
                // 受益所有人
                if (_this.moduleId.indexOf("BENEFICIARY_OWNER_INFO") != -1) {
                    bizProBeneficiaryOwnerNode.bizProBeneficiaryOwnerBeforeSave && bizProBeneficiaryOwnerNode.bizProBeneficiaryOwnerBeforeSave(_this, params);
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

                //产品信息
                if (_this.moduleId.indexOf("DOC_INFO") != -1 || _this.moduleId.indexOf("PRODUCT_INFO") != -1) {
                    if(isRejcet == 1 && rejectModuleInfo.PRO_INFO_MODIFY){
                        delete rejectModuleInfo.PRO_INFO_MODIFY;
                        _this.$storage.setSession(_this.$definecfg.REJECT_MODULE_INFO, rejectModuleInfo);
                    }
                    _this.$router.goRoute("信息列表", {fromName: fromName});
                    return false;
                }

                //受益所有人信息
                if (_this.moduleId.indexOf("AML_INFO") != -1 || _this.moduleId.indexOf("BENEFICIARY_OWNER_INFO") != -1) {
                    if(isRejcet == 1 && rejectModuleInfo.PRO_INFO_MODIFY_BENEFICIARY){
                        delete rejectModuleInfo.PRO_INFO_MODIFY_BENEFICIARY;
                        _this.$storage.setSession(_this.$definecfg.REJECT_MODULE_INFO, rejectModuleInfo);
                    }
                    _this.$router.goRoute("信息列表", {fromName: fromName});
                    return false;
                }

                //管理人证件信息、管理人基本信息
                if (_this.moduleId.indexOf("MANAGER_DOC_INFO") != -1 || _this.moduleId.indexOf("MANAGER_BASIC_INFO") != -1) {
                    _this.$router.goRoute("管理人关联人信息", {fromName: fromName});
                    return false;
                }
                
                //法定代表人信息/执行事务合伙人信息、委派代表信息、负责人信息、合伙人信息
                if (_this.moduleId.indexOf("LEGAL_REP_INFO") != -1 ||
                _this.moduleId.indexOf("LEGAL_CLIENT_INFO") != -1 ||
                _this.moduleId.indexOf("RESPONSIBLE_PERSON_INFO") != -1 ||
                _this.moduleId.indexOf("PARTNER_INFO") != -1) {
                    _this.$router.goRoute("控股股东信息/实际控制人", {fromName: fromName});
                    return false;
                }
                
                //控股股东信息、实际控制人信息
                if (_this.moduleId.indexOf("STOCKHOLDER_INFO") != -1 || _this.moduleId.indexOf("ACTUAL_CONTROLLER_INFO") != -1) {
                    _this.$router.goRoute("诚信记录", {fromName: fromName});
                    return false;
                }

                //诚信记录
                if(_this.moduleId.indexOf("HAS_CREDIT_RECORD") != -1 || _this.moduleId.indexOf("CREDIT_RECORD_INFO") != -1){
                    if(isRejcet == 1 && rejectModuleInfo.PRO_INFO_MODIFY_MANAGER){
                        delete rejectModuleInfo.PRO_INFO_MODIFY_MANAGER;
                        _this.$storage.setSession(_this.$definecfg.REJECT_MODULE_INFO, rejectModuleInfo);
                    }
                    _this.$router.goRoute("信息列表", {fromName: fromName});
                    return false;
                }
                
                //其他信息：托管人信息、产品联系人信息
                if(_this.moduleId.indexOf("TRUSTEE_INFO") != -1 || _this.moduleId.indexOf("LINKMAN_INFO") != -1){
                    if(isRejcet == 1 && rejectModuleInfo.PRO_INFO_MODIFY_RELA){
                        delete rejectModuleInfo.PRO_INFO_MODIFY_RELA;
                        _this.$storage.setSession(_this.$definecfg.REJECT_MODULE_INFO, rejectModuleInfo);
                    }
                    _this.$router.goRoute("信息列表", {fromName: fromName});
                    return false;
                }
            },
    
            validate: function (_this) {
                let validateFnArr = [];
                if (_this.moduleId.indexOf("CREDIT_RECORD_INFO") != -1) {
                    bizProCreditRecordInfoNode.bizProCreditRecordInfoValidate && validateFnArr.push(bizProCreditRecordInfoNode.bizProCreditRecordInfoValidate(_this))
                }
                // 产品信息
                if (_this.moduleId.indexOf("PRODUCT_INFO") != -1) {
                    bizProBasicInfoNode.bizProBasicInfoNodeValidate && validateFnArr.push(bizProBasicInfoNode.bizProBasicInfoNodeValidate(_this));
                }
                // 管理人信息
                if (_this.moduleId.indexOf("MANAGER_DOC_INFO") != -1) {
                    bizProManagerBasicInfoNode.bizProManagerBasicInfoNodeValidate && validateFnArr.push(bizProManagerBasicInfoNode.bizProManagerBasicInfoNodeValidate(_this));
                }
                // 法人代表
                if (_this.moduleId.indexOf("LEGAL_REP_INFO") != -1) {
                    bizProLegalRepInfoNode.bizProLegalRepInfoValidate && validateFnArr.push(bizProLegalRepInfoNode.bizProLegalRepInfoValidate(_this));
                }
                // 委派代表
                if (_this.moduleId.indexOf("LEGAL_CLIENT_INFO") != -1) {
                    bizProLegalClientInfoNode.bizProLegalClientInfoValidate && validateFnArr.push(bizProLegalClientInfoNode.bizProLegalClientInfoValidate(_this));
                }
                // 负责人
                if (_this.moduleId.indexOf("RESPONSIBLE_PERSON_INFO") != -1) {
                    bizProResponsibleInfoNode.bizProResponsibleInfoValidate && validateFnArr.push(bizProResponsibleInfoNode.bizProResponsibleInfoValidate(_this));
                }
                // 控股股东
                if (_this.moduleId.indexOf("STOCKHOLDER_INFO") != -1) {
                    bizProStockholderInfoNode.bizProStockholderInfoValidate && validateFnArr.push(bizProStockholderInfoNode.bizProStockholderInfoValidate(_this));
                }
                // 实际控制人
                if (_this.moduleId.indexOf("ACTUAL_CONTROLLER_INFO") != -1) {
                    bizProActualControllerNode.bizProActualControllerNodeValidate && validateFnArr.push(bizProActualControllerNode.bizProActualControllerNodeValidate(_this));
                }
                // 联系人
                if (_this.moduleId.indexOf("LINKMAN_INFO") != -1) {
                    bizProLinkmanInfoNode.bizProLinkmanInfoNodeValidate && validateFnArr.push(bizProLinkmanInfoNode.bizProLinkmanInfoNodeValidate(_this));
                }
                // 合伙人信息
                if (_this.moduleId.indexOf("PARTNER_INFO") != -1) {
                    bizProPartnerInfoNode.bizProPartnerInfoValidate && validateFnArr.push(bizProPartnerInfoNode.bizProPartnerInfoValidate(_this));
                }
                // 受益所有人
                if (_this.moduleId.indexOf("BENEFICIARY_OWNER_INFO") != -1) {
                    bizProBeneficiaryOwnerNode.bizProBeneficiaryOwnerValidate && validateFnArr.push(bizProBeneficiaryOwnerNode.bizProBeneficiaryOwnerValidate(_this));
                }
                // 托管人
                if (_this.moduleId.indexOf("TRUSTEE_INFO") != -1) {
                    bizProTrusteeInfoNode.bizProTrusteeInfoNodeValidate && validateFnArr.push(bizProTrusteeInfoNode.bizProTrusteeInfoNodeValidate(_this));
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
                            _.cloneDeep(_this.oppBusiData.copyCurrentGroupData[groupId][moduleId]);
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
                if (moduleId == "MANAGER_DOC_INFO") {
                    ocrCardType = "1";
                }
                _this.$router.goModule("readCardModule", {"moduleId": moduleId, "groupInfo": groupInfo, "ocrCardType":ocrCardType});
            },
            "handleReadCardSuccess": (_this, module, cardInfo, groupInfo)  => {
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
                if (module && module.MODULE_ID  == "MANAGER_DOC_INFO") {
                    module.FIELDS.PRO_MANAGER_NAME.DEFAULT_VALUE = cardInfo.CUST_FNAME;
                    // 防止 ID_TYPE 更新后清空证件号码、证件有效期
                    module.FIELDS.PRO_MANAGER_ID_TYPE.disableClear = true;
                    module.FIELDS.PRO_MANAGER_ID_TYPE.DEFAULT_VALUE = cardInfo.ID_TYPE;
                    module.FIELDS.PRO_MANAGER_ID_CODE.DEFAULT_VALUE = cardInfo.ID_CODE;
                    module.FIELDS.PRO_MANAGER_ID_EXP_DATE.DEFAULT_VALUE = cardInfo.ID_EXP_DATE;
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
                if (module && module.MODULE_ID  == "BENEFICIARY_OWNER_INFO") {
                    module.FIELDS.BENEFICIARY_NAME.DEFAULT_VALUE = cardInfo.CUST_FNAME;
                    module.FIELDS.BENEFICIARY_ID_TYPE.disableClear = true;
                    module.FIELDS.BENEFICIARY_ID_TYPE.DEFAULT_VALUE = cardInfo.ID_TYPE;
                    module.FIELDS.BENEFICIARY_ID.DEFAULT_VALUE = cardInfo.ID_CODE;
                    module.FIELDS.BENEFICIARY_EXP_DATE.DEFAULT_VALUE = cardInfo.ID_EXP_DATE;
                }
            },
    
            //字段改变
            fieldDataChange: (_this, field, fieldData, moduleInfo) => {
                let that = this;

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
                    bizProResponsibleInfoNode.CHECK_MODULE_RADIO(_this, field, fieldData, module);
                }
                if ("STOCKHOLDER_INFO" == field.MODULE_ID) {
                    bizProStockholderInfoNode.CHECK_MODULE_RADIO(_this, field, fieldData, module);
                }
                if ("ACTUAL_CONTROLLER_INFO" == field.MODULE_ID) {
                    bizProActualControllerNode.CHECK_MODULE_RADIO(_this, field, fieldData, module);
                }
            },
        })
export default V0049_PRO;
