import sysConfig from "../config/sysConfig.js";
import definecfg from "../config/defineConfig.js";
import storage from '../tools/storage.js'
import store from '../vuex'
import types from "../vuex/mutation-types.js";

import baseConfig from '../config/baseConfig'
import bizcfg from '../config/bizConfig'
import date from "../tools/date.js";

export default {

    /** 
     * 获取一柜通服务器数据库的日期
     */
    getSysDate: () => {
        return sysConfig.$syscfg.K_Request("P9999997").then((data) => {
            return data && data.Data && data.Data[0].length && data.Data[0][0].DB_DATE || ""
        });
    },

    /**
     * 
     * @param {*} BUSI_CODE 业务代码 
     * @param {*} CUST_CODE 客户号
     * @param {*} PROC_STATUS 流水状态
     * @description 根据三要素查询流水信息 
     */
    getBizData: function(param) {
        return sysConfig.$syscfg.K_Request("W0000114", {
            BUSI_CODE: param.BUSI_CODE, 
            CUST_CODE: param.CUST_CODE,
            PROC_STATUS: param.PROC_STATUS,
        }).then(function(data){
            if(data.Code == '0'){
                return data.Data && data.Data || [];
            }else{
                throw ("根据三要素查询流水信息失败，原因：" + data.Msg);
                return [];
            }
        });
    },

    /** 
     * 根据业务流水号获取一柜通的业务数据
     */
    getOppBusiData: function(B_SNO, isAceept){
        let that = this;
        if(!B_SNO){
            throw '流水号不能为空';
        }
        return sysConfig.$syscfg.K_Request("W0000114", {
            B_SNO: B_SNO
        }).then(function(data) {
            let oppBusiData = data && data.Data && data.Data.length && data.Data[0] || {};
            let acceptParams = oppBusiData.ACCEPT_PARAM && JSON.parse(decodeURIComponent(oppBusiData.ACCEPT_PARAM)) || {};
            let busiData = isAceept ? acceptParams : Object.assign({}, oppBusiData, acceptParams);
            delete busiData.ACCEPT_PARAM
            delete busiData.DEAL_PARAM
            if(!_.isEmpty(busiData)) {
                // return that.W0000115({
                //     USER_TYPE: oppBusiData.USER_TYPE,
                //     BUSI_CODE: oppBusiData.BUSI_CODE
                // }).then(function(preData) {
                    // // 如果存在预录入配置，且状态为预录入，需要根据预录入配置转换
                    // if(preData && preData.Data&& preData.Data.length && busiData.BUSI_CODE == 'Z0035' && busiData.USER_TYPE == '1') {
                    //     _.each(preData.Data, function (cfg) {
                    //         // 存在数据，且数据类型为对象，需要转换为对象
                    //         if (busiData[cfg.GROUP_ID] && busiData[cfg.GROUP_ID][cfg.MODULE_ID]) {
                    //             switch (cfg.MODULE_DATA_TYPE){
                    //                 case "00": // 表示无分组，且为对象结果，需干掉分组
                    //                     busiData[cfg.MODULE_ID] = busiData[cfg.GROUP_ID][cfg.MODULE_ID][0];
                    //                     delete busiData[cfg.GROUP_ID][cfg.MODULE_ID]
                    //                     if(_.isEmpty(busiData[cfg.GROUP_ID])){
                    //                         delete busiData[cfg.GROUP_ID]
                    //                     }
                    //                     break;
                    //                 case "01": // 表示无分组，且为数组结构，需干掉分组
                    //                     busiData[cfg.MODULE_ID] = busiData[cfg.GROUP_ID][cfg.MODULE_ID];
                    //                     delete busiData[cfg.GROUP_ID][cfg.MODULE_ID]
                    //                     if(_.isEmpty(busiData[cfg.GROUP_ID])){
                    //                         delete busiData[cfg.GROUP_ID]
                    //                     }
                    //                     break;
                    //                 case "10": // 表示有分组，且为对象结构，需进行转换
                    //                     busiData[cfg.GROUP_ID][cfg.MODULE_ID] = busiData[cfg.GROUP_ID][cfg.MODULE_ID][0];
                    //                     break;
                    //                 case "11": // 表示有分组，且为数组结构，不处理
                    //                     break;
                    //                 case "20": // 表示需要把数据打散到busiData里面
                    //                     Object.assign(busiData, busiData[cfg.GROUP_ID][cfg.MODULE_ID][0]);
                    //                     delete busiData[cfg.GROUP_ID][cfg.MODULE_ID]
                    //                     if(_.isEmpty(busiData[cfg.GROUP_ID])){
                    //                         delete busiData[cfg.GROUP_ID]
                    //                     }
                    //                     break;
                    //             }
                    //         }
                    //     })
                    // }
                    return that.parseToVtmBusiData(oppBusiData).then(data => {
                        return busiData;
                    });
                   
                // }) 
            }else {
                return {}
            }
        })     
    },
    /**
     * 
     * 根据busicode 获取该业务的业务相关信息
     */
    getBusiDefInfo: (busiCode) => {
        return new Promise((resolve, reject) => {
            if (!busiCode) {
                throw "调用getBusiDefInfo方法，busicode【业务代码】没有传入！";
                reject(arguments)
            }
            sysConfig.$syscfg.K_Request("W0000096", {
                BUSI_CODE: busiCode
            }).then((data) => {
                resolve(data && data.Data && data.Data.length && data.Data[0])
            }).catch(function(err) {
                reject(err)
            });
        })
    },
    /**
     * 
     * 根据USER_CODE 获取该柜员的相关信息
     */
    getOpUserInfo: (userCode) => {
        return new Promise((resolve, reject) => {
            if (!userCode) {
                throw "调用getOpUserInfo方法，必要参数userCode【操作员代码】没有传入！";
                reject(arguments)
            }
            sysConfig.$syscfg.K_Request("W0000116", { USER_CODE: userCode }).then((data) => {
                resolve(data && data.Data && data.Data.length && data.Data[0] || {})
            }).catch(function(err) {
                reject(err)
            })
        })
    },
    /**
     * 
     * 根据custCode 获取客户的一码通信息（系统内）
     */
    getCustSysInYmtInfo: (custCode) => {
        return new Promise((resolve, reject) => {
            if (!custCode) {
                throw "调用getCustSysInYmtInfo方法，必要参数custCode【客户代码】没有传入！";
                reject(arguments)
            }
            sysConfig.$syscfg.K_Request("W0000119", {
                bex_codes: "L2100417",
                CUST_CODE: custCode
            }).then(function(data) {
                resolve(data && data.Data && data.Data.length && data.Data || [])
            }).catch(function(err) {
                reject(err)
            })
        });
    },
    /**
     * 
     * 账户系统通用查询，根据custCode 获取客户的一码通信息
     */
    getAcctGeneralQueryYmtInfo: function(custCode) {
        return new Promise((resolve, reject) => {
            if (!custCode) {
                throw "调用getAcctGeneralQueryYmtInfo方法，必要参数custCode【客户代码】没有传入！";
                reject(arguments)
            }
            sysConfig.$syscfg.K_Request("Y3000045", {
                F_FUNCTION: '980105030',
                p_gnbh: '980105030',
                QUERY_MODE: 'QUERY',
                CUST_CODE: custCode,
                USER_CODE: custCode,
                CUSTID: custCode,
                SYS_CUST_NO: custCode
            }).then(function(data) {
                resolve(data && data.Data && data.Data.length && data.Data[0] || {})
            }).catch(function(err) {
                reject(err);
            })
        })
    },
    /**
     * 
     * 证券账号业务信息查询，包括扩展信息
     */
    queryTrdacctBizInfo: function(param) {
        return new Promise((resolve, reject) => {
            if (!param) {
                throw "调用queryTrdacctBizInfo方法，参数不正确！";
                reject(arguments)
            }
            sysConfig.$syscfg.K_Request("W0000119", {
                bex_codes: 'YGT_A2100027',
                EXTERNAL_SN: param.EXTERNAL_SN,
                ACCTBIZ_EXCODE: param.ACCTBIZ_EXCODE,
                INT_ORG: param.INT_ORG,
                BGN_DATE: param.OCCUR_DATE,
                END_DATE: param.OCCUR_DATE
            }).then(function(data) {
                resolve(data && data.Data && data.Data.length && data.Data[0] || {})
            }).catch(function(err) {
                reject(err);
            })
        })
    },
    /**
     * 获取业务流水数据表字段
     * @returns Array
     * 查询本地表 OPP_BUSI_DATA字段名
     */
    getBizFields: function(){
        return sysConfig.$syscfg.K_Request("W0000174").then(data => {
            let filterFields = [];
            _.each(data.Data, function(obj) {
                if(obj.COLUMN_NAME !== "ACCEPT_PARAM" && obj.COLUMN_NAME !== "DEAL_PARAM") {
                    filterFields.push(obj.COLUMN_NAME);
                }
            });
            return  filterFields;
        }) 
    },
    parseParam:function(fields, param) {
        let pkgParam, normalParam = {};
        pkgParam = _.pickBy(param, function(v, k) {
            if(-1 === _.indexOf(fields, k)) {
                return true;
            }
            normalParam[k] = v;
            return false;
        });

        return {
            pkgParam: pkgParam,
            normalParam: normalParam
        }
    },
    //在业务数据落地之前 先处理一遍数据 在数据库表里面的字段不允许更改
    carryOutBizData:function(param,isAccept,procStatus){
        let that = this,
            B_SNO = storage.$storage.getSession(definecfg.$definecfg.B_SNO),
            CUST_INFO = storage.$storage.getJsonSession(definecfg.$definecfg.CUSTOMER_INFO) || {},
            isDoubleRecord = storage.$storage.getSession(definecfg.$definecfg.IS_DOUBLE_RECORD) == 1,
            vtmYztChannel = that.getSysCommonParamsFromCacheObjs("VTM_YZT_CHANNEL"),
            userInfo = storage.$storage.getJsonSession(definecfg.$definecfg.USER_INFO) || {};
        return that.getBizFields().then(function(fields) {
            let newParsedObj = that.parseParam(fields, param),
                newPkgParam = newParsedObj.pkgParam, //不在数据库流水表字段表里的字段 需要丢到acceptParam里面的字段
                newNormalParam = newParsedObj.normalParam, //数据库流水表里面的字段
                //优先取历史流水里面的流水号 没有就取本地的
                //流水表OPP_BUSI_DATA里面的字段强制更新
                mustUpdateData = {
                    CUST_ORG_CODE:param.CUST_ORG_CODE,
                    OP_ORG : userInfo.ORG_CODE, //vtm柜员所在机构
                    ORG_CODE: userInfo.ORG_CODE, 
                    PROC_STATUS: procStatus,//默认00预录入状态 如果提交影像后需要将状态改为02预受理
                    YZT_CHANNEL: vtmYztChannel || sysConfig.$syscfg.getYztChannel(),   //安信YZT_CHANNEL为12，所以这里改为去拿公参，没有配置的话走原来逻辑获取YZT_CHANNEL @liwei2 20191218
                    HANDLE_CODE: userInfo.OP_CODE,
                    OP_CODE: userInfo.OP_CODE,
                    APPT_SN:storage.$storage.getSession(definecfg.$definecfg.APPT_SN) || '' //预约表唯一标识
                };

                //custInfo:修改资料、开户需要传递的智能审核信息；kscsKiscBasicInfo：非修改资料、非开户业务需要传递的智能审核信息
                let custInfo, proManagerInfo, kscsKiscBasicInfo;
                if(sysConfig.$syscfg.isCustInfoModify(param.BUSI_CODE)){
                    custInfo = CUST_INFO.USER_TYPE != "2" ? newPkgParam.NEW_BASE_INFO : newPkgParam.PRO_MANAGER_INFO;
                }else if(sysConfig.$syscfg.isOpenAcctBiz(param.BUSI_CODE)){
                    Object.assign(newPkgParam, CUST_INFO.USER_TYPE == "0" ? {
                        CUST_BASIC_INFO: newPkgParam && newPkgParam.CUST_INFO && newPkgParam.CUST_INFO.CUST_BASIC_INFO
                    } : {});
                    custInfo = CUST_INFO.USER_TYPE == "0" ? CUST_INFO : CUST_INFO.USER_TYPE == "1" ? newPkgParam.ORG_BASIC_INFO : newPkgParam.PRO_MANAGER_INFO; 
                }else if(param.BUSI_CODE == "V0106"){
                    kscsKiscBasicInfo = CUST_INFO.USER_TYPE == "0" ? newPkgParam.CUST_CARD_INFO : CUST_INFO.USER_TYPE == "1" ? newPkgParam.ORG_INFO && newPkgParam.ORG_INFO.ORG_BASIC_INFO || {} : {}
                }else{
                    kscsKiscBasicInfo = CUST_INFO;
                }
                //机构户产品户：获取法定代表人信息或者执行事务合伙人
                if(CUST_INFO.USER_TYPE != "0"){
                    // Object.assign(newPkgParam, {
                    //     LEGAL_REP: newPkgParam.LEGAL_REP_INFO && newPkgParam.LEGAL_REP_INFO.LEGAL_REP || CUST_INFO.LEGAL_REP || ""
                    // });
                    let LEGAL_REP_INFO = newPkgParam.RELA_INFO && newPkgParam.RELA_INFO.ORG_LEGAL_REP_INFO || {}
                    if (param.BUSI_CODE == "V0106" && !_.isEmpty(LEGAL_REP_INFO)) {
                        newPkgParam.LEGAL_REP_INFO = LEGAL_REP_INFO;
                    }
                }
                //产品户：获取产品管理人信息
                if(CUST_INFO.USER_TYPE == "2"){
                    let custAllInfo = storage.$storage.getJsonSession(definecfg.$definecfg.CUST_ALL_INFO) || {};
                    proManagerInfo = custAllInfo && custAllInfo.PRODUCT_INFO || {}
                }             
                    
                !_.isEmpty(custInfo) && Object.assign(newPkgParam, CUST_INFO.USER_TYPE == "0" ? {
                    CUST_FNAME: custInfo.CUST_FNAME,
                    BIRTHDAY: custInfo.BIRTHDAY,
                    ID_ADDR: custInfo.ID_ADDR,
                    ID_CODE: custInfo.ID_CODE,
                    SEX: custInfo.SEX,
                    ID_BEG_DATE: custInfo.ID_BEG_DATE,
                    ID_EXP_DATE: custInfo.ID_EXP_DATE
                } : CUST_INFO.USER_TYPE == "1" ? {
                    CUST_FNAME: custInfo.CUST_FNAME,
                    //LEGAL_REP: newPkgParam.LEGAL_REP_INFO && newPkgParam.LEGAL_REP_INFO.LEGAL_REP || CUST_INFO.LEGAL_REP || "",
                    REGISTER_FUND: custInfo.REGISTER_FUND,
                    ID_CODE: custInfo.ID_CODE,
                    BUSINESS_RANGE: custInfo.BUSINESS_RANGE,
                    ID_EXP_DATE: custInfo.ID_EXP_DATE,
                    CORP_ADDR: custInfo.CORP_ADDR
                } : {
                    PRO_MANAGER_ID_CODE: custInfo.PRO_MANAGER_ID_CODE,
                    PRO_MANAGER_NAME: custInfo.PRO_MANAGER_NAME,
                    //LEGAL_REP: newPkgParam.LEGAL_REP_INFO && newPkgParam.LEGAL_REP_INFO.LEGAL_REP || CUST_INFO.LEGAL_REP || "",
                    PRO_BUSINESS_RANGE: custInfo.BUSINESS_RANGE,
                    PRO_MANAGER_ID_EXP_DATE: custInfo.PRO_MANAGER_ID_EXP_DATE,
                    CORP_ADDR: custInfo.CORP_ADDR
                });
                !_.isEmpty(kscsKiscBasicInfo) && Object.assign(newPkgParam, {
                    KSCS_KISC_BASIC_INFO: {
                        CUST_FNAME: kscsKiscBasicInfo.CUST_FNAME || "",
                        BIRTHDAY: kscsKiscBasicInfo.BIRTHDAY || "",
                        ID_ADDR: kscsKiscBasicInfo.ID_ADDR || "",
                        ID_CODE: kscsKiscBasicInfo.ID_CODE || "",
                        SEX: kscsKiscBasicInfo.SEX || "",
                        ID_BEG_DATE: kscsKiscBasicInfo.ID_BEG_DATE || CUST_INFO.ID_BEG_DATE || "",
                        ID_EXP_DATE: kscsKiscBasicInfo.ID_EXP_DATE || CUST_INFO.ID_EXP_DATE || "",
                        CORP_ADDR: kscsKiscBasicInfo.CORP_ADDR || "",
                        //LEGAL_REP: newPkgParam.LEGAL_REP_INFO && newPkgParam.LEGAL_REP_INFO.LEGAL_REP || CUST_INFO.LEGAL_REP || "",
                        BUSINESS_RANGE: kscsKiscBasicInfo.BUSINESS_RANGE || CUST_INFO.BUSINESS_RANGE || "",
                        REGISTER_FUND: kscsKiscBasicInfo.REGISTER_FUND || "",
                        PRO_MANAGER_ID_CODE: proManagerInfo && proManagerInfo.PRO_MANAGER_ID_CODE || "",
                        PRO_MANAGER_NAME: proManagerInfo && proManagerInfo.PRO_MANAGER_NAME || "",
                        PRO_MANAGER_ID_EXP_DATE: proManagerInfo && proManagerInfo.PRO_MANAGER_ID_EXP_DATE || ""
                    }
                });
            let legalReg = newPkgParam.LEGAL_REP_INFO && newPkgParam.LEGAL_REP_INFO.LEGAL_REP || CUST_INFO.LEGAL_REP || "";
            if (!_.isEmpty(legalReg)) {
                newPkgParam.LEGAL_REP = legalReg;
                !_.isEmpty(kscsKiscBasicInfo) && (newPkgParam.KSCS_KISC_BASIC_INFO.LEGAL_REP = legalReg);
            }
            Object.assign(newNormalParam, mustUpdateData);
            !newNormalParam.B_SNO && (newNormalParam.B_SNO = B_SNO);
            if(newNormalParam.B_SNO) { 
                return that.getOppBusiData(newNormalParam.B_SNO, isAccept).then(function(data) {
                        var parsedObj = that.parseParam(fields, data || {}),
                            pkgParam = parsedObj.pkgParam;//不在数据库流水表字段表里的字段 需要丢到acceptParam里面的字段

                        if(!_.isEmpty(newPkgParam) && !_.isEqual(pkgParam, newPkgParam)) {
                            newNormalParam[isAccept ? "ACCEPT_PARAM" : "DEAL_PARAM"] = encodeURIComponent(JSON.stringify(_.extend(pkgParam, newPkgParam)));
                            newNormalParam['OP_START_TIME'] = param.OP_START_TIME ||'';
                        }

                        return that.W0000113(newNormalParam);
                    });
            }

            if(!_.isEmpty(newPkgParam)) {
                newNormalParam[isAccept ? "ACCEPT_PARAM" : "DEAL_PARAM"] = encodeURIComponent(JSON.stringify(newPkgParam));
                newNormalParam['OP_START_TIME'] = param.OP_START_TIME ||'';
            }

            return that.W0000113(newNormalParam);
        })

    },
    W0000113:function(newParams){
        return sysConfig.$syscfg.K_Request("W0000113", newParams);
    },
    /**
     * 保存基本信息
     */
    saveBizData: function(params, bData, procStatus) {
        let that = this,
            isDoubleRecord = storage.$storage.getSession(definecfg.$definecfg.IS_DOUBLE_RECORD) == 1,
            csdcCheckFlag = storage.$storage.getSession(definecfg.$definecfg.CSDC_CHECKED_FLAG),
            userInfo = storage.$storage.getJsonSession(definecfg.$definecfg.USER_INFO) || {},
            OPEN_ORG_INFO = storage.$storage.getJsonSession(definecfg.$definecfg.OPEN_ORG_INFO) || {},
            deviceInfo = storage.$storage.getJsonSession(definecfg.$definecfg.DEVICE_INFO),
            busiInfo = storage.$storage.getJsonSession(definecfg.$definecfg.BUSI_INFO) || {},
            customerInfo = storage.$storage.getJsonSession(definecfg.$definecfg.CUSTOMER_INFO) || {},
            B_SNO = storage.$storage.getSession(definecfg.$definecfg.B_SNO),
            busiName = storage.$storage.getSession(definecfg.$definecfg.BUSI_NAME),
            isReadCard =  storage.$storage.getSession(definecfg.$definecfg.READ_CARD),
            orgCurrentAgent = storage.$storage.getJsonSession(definecfg.$definecfg.ORG_CURRENT_AGENT) || {},
            orgOutSideBaseData = {
                ORG_CURRENT_AGENT: orgCurrentAgent,
                IS_AGENT: orgCurrentAgent.IS_AGENT,
                AGT_ID_TYPE: orgCurrentAgent.IS_AGENT == "1" ? orgCurrentAgent.ID_TYPE : "",
                CORP_TYPE:customerInfo.CORP_TYPE || '',
                LEGAL_REP_ID_TYPE:customerInfo.LEGAL_REP_ID_TYPE || params.LEGAL_REP_ID_TYPE,
            };
        let vtmYztChannel =  that.getSysCommonParamsFromCacheObjs("VTM_YZT_CHANNEL");
        //先获取流程模板
        let flowProcStatus = busiInfo.PROC_STATUS ? busiInfo.PROC_STATUS : sysConfig.$syscfg.getFlowModel();
        //优先取bdata（最新的业务逻辑数据）,次取旧流水数据（复用数据），否则取客户数据（新流水）
        const getNewValue = (key)=>{
            return  (bData&&bData[key]) || (params&&params[key]) || (busiInfo&&busiInfo[key]) || (customerInfo&&customerInfo[key]) || ""
        };
        let busiCode = store.state.busicode;
        //需要放在busiData最外层的其他参数数据（不在acceptParams里面）
        let outsideData = {
                //是否读卡
                IDCARD_READ_FLAG: isReadCard,
                flowIdcardCustInfo: isReadCard == "1" ? "1" : "",
                //专业投资者类别
                //PROF_INVESTOR_SOURCE : params.PROF_INVESTOR_SOURCE || customerInfo.PROF_INVESTOR_SOURCE,
                //主体身份
                SUBJECT_IDENTITY :customerInfo.SUBJECT_IDENTITY,
                SZORG_TYPE: getNewValue("SZORG_TYPE"),
                //业务名称
                BUSI_NAME:busiName,
                //当前设备信息
                DEVICE_ID :deviceInfo&&deviceInfo.DEVICE_ID,
                DEVICE_NAME : deviceInfo&&deviceInfo.DEVICE_NAME,
                OP_ORG : userInfo.ORG_CODE, //vtm柜员所在机构
                ORG_CODE: userInfo.ORG_CODE,
                ORG_FULL_NAME: userInfo.ORG_FULL_NAME,
                OP_USER_NAME: userInfo.USER_NAME,
                NODE_CODE: "1",
                PROC_STATUS: procStatus || flowProcStatus,//如果为00预录入状态 提交影像后需要将状态改为02预受理
                YZT_CHANNEL: vtmYztChannel || sysConfig.$syscfg.getYztChannel(), //安信YZT_CHANNEL为12，所以这里改为去拿公参，没有配置的话走原来逻辑获取YZT_CHANNEL @liwei2 20191218
                HANDLE_CODE: userInfo.OP_CODE,
                CUST_ORG_CODE: customerInfo.INT_ORG,
                BUSI_CODE: busiCode,
                USER_TYPE: customerInfo.USER_TYPE || store.state.usertype,
                ID_TYPE:  customerInfo.ID_TYPE,
                ID_CODE: customerInfo.ID_CODE,
                OP_CODE: userInfo.OP_CODE,
                PRE_OP_CODE: userInfo.OP_CODE,
                INT_ORG: customerInfo.INT_ORG,
                CUST_CODE: customerInfo.CUST_CODE||params.CUST_CODE||"",
                USER_CODE: customerInfo.CUST_CODE||params.CUST_CODE||"",
                CUST_FNAME: customerInfo.USER_FNAME || customerInfo.CUST_FNAME || "",
                CUST_NAME: customerInfo.CUST_NAME,
                OPP_BUSI_SCOPE:storage.$storage.getSession(definecfg.$definecfg.BUSI_SCOPE) || 21,//业务范围 21移动业务
                APPT_SN:storage.$storage.getSession(definecfg.$definecfg.APPT_SN) || '', //预约表唯一标识
                // 主风险测评试题
                KH_SURVEY_SN: JSON.parse(storage.$storage.getSession(definecfg.$definecfg.KH_SURVEY_SN)) || {},
                //增加一个时间
                OP_START_DATE: busiInfo.OP_START_DATE || date.getClientDate(),
                //由于流水取回来的时候op_org会被org_code代替 导致柜员的所在机构没办法拿到 在流水中重新存一个值代替
                OP_ORG_CODE: userInfo.ORG_CODE, //vtm柜员所在机构
            };
        // 存管账户开户，资金账户保存在最外层，保存过程中存在被客户资金账号覆盖的情况
        if (_.indexOf(["V0062"], busiCode) > -1) {
            Object.assign(params, bData, outsideData, { CUACCT_CODE: params.CUACCT_CODE || busiInfo.CUACCT_CODE || customerInfo.CUACCT_CODE })
        } else {
            Object.assign(params, bData, outsideData, { CUACCT_CODE: params.CUACCT_CODE || customerInfo.CUACCT_CODE });
        }
        // 双录业务加一下客户投资者来源
        if (sysConfig.$syscfg.isDoubleBiz(busiCode)) {
            Object.assign(params, { PROF_INVESTOR_SOURCE: customerInfo.PROF_INVESTOR_SOURCE})
        }
		if(deviceInfo){
			let netaddr=sysConfig.$syscfg.getDeviceInfoFormat1(deviceInfo);
			let netaddr2=sysConfig.$syscfg.getDeviceInfoFormat2(deviceInfo);
			Object.assign(params,{netaddr:netaddr,netaddr2:netaddr2});
        }
        
        //若是机构或者产品户 将机构相关字段放进流水
        outsideData.USER_TYPE != '0' && Object.assign(params , orgOutSideBaseData);
        // storage.$storage.setSession(definecfg.$definecfg.BUSI_INFO, params);

        //add linjinbin 标准版需要添加新的参数
        if (_.includes(["BIAOZHUN",'ANXIN','YINHE'], bizcfg.$bizcfg.getBizConfigName(definecfg.$definecfg.QSJGDM_CONST[baseConfig.$basecfg.qsVersion]))) {
            let BUSI_DEF_INFO = storage.$storage.getJsonSession(definecfg.$definecfg.BUSI_DEF_INFO) || {};
            params.PROCESS_KEY = BUSI_DEF_INFO.PROCDEF_KEY || '';
        }
        //如果启用了中登校验存在中登校验标志需要保存到流水里
        if(csdcCheckFlag){
            params.CSDC_CHECKED_FLAG = csdcCheckFlag == "1" ? "1" : "0";
        }
        let cloneParams = _.cloneDeep(params)
        return that.parseToYGTBusiData(cloneParams).then(YGTdata => {
             return sysConfig.$syscfg.K_Request_ALL([
                that.carryOutBizData(YGTdata, true, procStatus || flowProcStatus)
            ]).then(function (data) {
                if(data[0].Code != '0'){
                    throw data[0].Msg;
                    return [];
                }
                let newbsno = B_SNO || data[0] && data[0].Data.length && data[0].Data[0].B_SNO;
                if (!newbsno) {
                    return {
                        Code: "-9999",
                        Msg: "调用一柜通W0000113接口异常，未获取到流水号数据！",
                        Data: []
                    }
                }
           
                //将转换成YGT格式的数据存在本地
                storage.$storage.setSession(definecfg.$definecfg.BUSI_INFO_YGT,  YGTdata);
                storage.$storage.setSession(definecfg.$definecfg.B_SNO, newbsno);
                store.commit(types.$types.IMG_TO_PREV, "0");
                return that.getOppBusiData(newbsno).then(function (busiData) {
                    // 没有生成流水号需要重新生成
                    if (!busiData.KIDM_SNO) {
                        return {
                            Code: "-9999",
                            Msg: "影像流水号生成失败，请重新保存生成流水号！",
                            Data: []
                        }
                    }
                    return {
                        Code: "0",
                        Msg: "调用getOppBusiData方法获取业务数据成功",
                        Data: [busiData]
                    }
                })
            })
        })
    },
     /**
     * 移动端 保存基本信息
     */
    saveMobileBizData: function(params, bData, procStatus) {
        let that = this;
        let isDoubleRecord = storage.$storage.getSession(definecfg.$definecfg.IS_DOUBLE_RECORD) == "isDoubleRecode";
        let userInfo = JSON.parse(storage.$storage.getSession(definecfg.$definecfg.USER_INFO)) || {};
        let customerInfo = JSON.parse(storage.$storage.getSession(definecfg.$definecfg.CUSTOMER_INFO)) || {};
        let B_SNO = storage.$storage.getSession(definecfg.$definecfg.B_SNO);
        var basedata = {
            "NODE_CODE": "1",
            "PROC_STATUS": procStatus || "00",//默认00预录入状态 如果提交影像后需要将状态改为02预受理
            "YZT_CHANNEL": sysConfig.$syscfg.getYztChannel(),
            "HANDLE_CODE": userInfo.OP_CODE,
            "CUST_ORG_CODE": customerInfo.INT_ORG,
            "BUSI_CODE": store.state.busicode,
            "USER_TYPE": customerInfo.USER_TYPE || store.state.usertype,
            "ID_TYPE": customerInfo.ID_TYPE,
            "ID_CODE": customerInfo.ID_CODE,
            "OP_CODE": userInfo.OP_CODE,
            "PRE_OP_CODE": userInfo.OP_CODE,
            "OP_ORG": userInfo.ORG_CODE,
            "ORG_CODE": userInfo.ORG_CODE,
            "INT_ORG": customerInfo.INT_ORG,
            "CUST_CODE": customerInfo.CUST_CODE,
            "USER_CODE": customerInfo.CUST_CODE,
            "CUST_FNAME": customerInfo.CUST_FNAME,
            "CUACCT_CODE": customerInfo.CUACCT_CODE,
            "SUBJECT_IDENTITY": "0",
            "CUST_NAME": customerInfo.CUST_NAME,
        };
        Object.assign(basedata, bData);
		
		
		let deviceInfo = storage.$storage.getJsonSession(definecfg.$definecfg.DEVICE_INFO);
		if(deviceInfo){
			let netaddr=sysConfig.$syscfg.getDeviceInfoFormat1(deviceInfo);
			let netaddr2=sysConfig.$syscfg.getDeviceInfoFormat2(deviceInfo);
			Object.assign(params,{netaddr:netaddr,netaddr2:netaddr2});
        }
		
        storage.$storage.setSession(definecfg.$definecfg.BUSI_INFO, params);
        console.log("提交前的流水号",B_SNO);
        B_SNO &&  Object.assign(basedata, {
            B_SNO: B_SNO
        })
        return sysConfig.$syscfg.K_Request_ALL([
           sysConfig.$syscfg.K_Request("YG003644", Object.assign(basedata, {
                ACCEPT_PARAM: encodeURIComponent(JSON.stringify(params || {}))
            })) 
        ]).then(function(data) {
            let newbsno = B_SNO || data[0] && data[0].Data.length && data[0].Data[0].B_SNO;
            console.log("提交后的流水号",newbsno);
            if (!newbsno) {
                return {
                    Code: "0",
                    Message: "调用一柜通YG003644接口异常，未获取到流水号数据！",
                    Data: []
                }
            }
            return that.getOppBusiData(newbsno).then(function(busiData) {
                return {
                    Code: "0",
                    Message: "调用getOppBusiData方法获取业务数据成功",
                    Data: [busiData]
                }
            })
        })
    },
    /**
     * 根据机构代码获取该机构信息
     * @param {*} orgCode 
     */
    getOppOrgInfo(orgCode) {
        return new Promise(function(resolve, reject) {
            if (!orgCode) {
                throw "调用getOppOrgInfo方法失败，原因：未传入orgCode参数！";
                reject(arguments);
            }
            sysConfig.$syscfg.K_Request("Y1000200", {
                ORG_CODE: orgCode
            }).then(function(data) {
                if (data.Code != 0) {
                    reject(data)
                } else {
                    resolve(data.Data[0]);
                }
            }).catch(function(data) {
                reject(data);
            })
        })

    },
    /**
     * 根据流水号，驳回当前流水至预受理状态
     * @param {*} orgCode 
     */
    rejectBusiToPreAccept(bsno) {
        return sysConfig.$syscfg.K_Request("W0000120", {
                B_SNO: bsno
            }).then(function() {
            return {
                Code: "0",
                Data: [],
                Message: "流水号【" + bsno+"】驳回至预受理状态成功"
            }
        })
    },

    //将vtm预录入流水转换为一柜通可识别的流水
    parseToYGTBusiData: (params) => {
        var that = this;
        return new Promise((resolve, reject) => {
            let customerInfo = JSON.parse(storage.$storage.getSession(definecfg.$definecfg.CUSTOMER_INFO)) || {};
            if (!params) {
                reject('转换流水数据失败，入参params为空');
            }
            return that.a.W0000115({
                USER_TYPE: customerInfo.USER_TYPE || '',
                BUSI_CODE: params.BUSI_CODE
            }).then(function (preRes) {
                if (preRes.Code != 0) {
                    reject("获取预录入数据接口调用失败-" + JSON.stringify(preRes.Msg));
                }
                // 如果存在预录入配置，需要根据预录入配置转换
                if (preRes && preRes.Data && preRes.Data.length) {
                    _.each(preRes.Data, function (cfg) {
                        // 存在数据，且数据类型为对象，需要转换为对象
                        if (params[cfg.GROUP_ID] && params[cfg.GROUP_ID][cfg.MODULE_ID] && _.isArray(params[cfg.GROUP_ID][cfg.MODULE_ID])) {
                            switch (cfg.MODULE_DATA_TYPE) {
                                case "00": // 表示无分组，且为对象结果，需干掉分组
                                    params[cfg.MODULE_ID] = params[cfg.GROUP_ID][cfg.MODULE_ID][0];
                                    delete params[cfg.GROUP_ID][cfg.MODULE_ID]
                                    if (_.isEmpty(params[cfg.GROUP_ID])) {
                                        delete params[cfg.GROUP_ID]
                                    }
                                    break;

                                case "01": // 表示无分组，且为数组结构，需干掉分组
                                    params[cfg.MODULE_ID] = params[cfg.GROUP_ID][cfg.MODULE_ID];
                                    delete params[cfg.GROUP_ID][cfg.MODULE_ID]
                                    if (_.isEmpty(params[cfg.GROUP_ID])) {
                                        delete params[cfg.GROUP_ID]
                                    }
                                    break;
                                case "10": // 表示有分组，且为对象结构，需进行转换
                                    params[cfg.GROUP_ID][cfg.MODULE_ID] = params[cfg.GROUP_ID][cfg.MODULE_ID][0];
                                    break;
                                case "11": // 表示有分组，且为数组结构，不处理
                                    break;
                                case "20": // 表示需要把数据打散到busiData里面
                                    _.extend(params, params[cfg.GROUP_ID][cfg.MODULE_ID][0]);
                                    delete params[cfg.GROUP_ID][cfg.MODULE_ID]
                                    if (_.isEmpty(params[cfg.GROUP_ID])) {
                                        delete params[cfg.GROUP_ID]
                                    }
                                    break;
                            }
                        }
                    })

                }
                //that.a.transDiffData(params);
                delete params.acceptParams;
                resolve(params);
            }).catch((err) => {
                reject(err);
            })
        })

    },

    //将数据转为DiffInfo
    transDiffData: function(obj){
        var that = this;
        if(!_.isPlainObject(obj)) {
            return;
        }
        obj.DIFF_INFO = [];
        _.forEach(obj, function(value, key) {
            if(_.isPlainObject(value) && (_.has(value,'newVal') || _.has(value,'oldVal')) && (value.newVal || value.oldVal)) {
                obj.DIFF_INFO.push({
                    "FIELD": key,
                    "OLD": value.oldVal,
                    "NEW": value.newVal,
                })
                obj[key] = value.newVal;
            }else if (_.isPlainObject(value) && (!_.has(value,'newVal') && !_.has(value,'oldVal'))) {
                that.transDiffData(value)
            }else if (_.isArray(value)) {
                _.each(value, function(res) {
                    that.transDiffData(res)
                })
            }
        });
        !obj.DIFF_INFO.length && delete obj.DIFF_INFO;
    },


    //一柜通流水转换为vtm流水数据
    parseToVtmBusiData(bizInfo) {
        let that = this;
        return new Promise((resolve, reject) => {
            let customerInfo = JSON.parse(storage.$storage.getSession(definecfg.$definecfg.CUSTOMER_INFO)) || {};
            if (!bizInfo) {
                resolve();
            }
            //流水数据中的最外层数据跟acceptParam混合到一起才是busiData
            let acceptParams = bizInfo.ACCEPT_PARAM && JSON.parse(decodeURIComponent(bizInfo.ACCEPT_PARAM)) || {};
            let busiData = Object.assign({}, bizInfo, acceptParams);

            delete bizInfo.ACCEPT_PARAM;
            delete bizInfo.DEAL_PARAM;

            //转成VTM数据格式之前 保存一份一柜通格式数据的原始数据(将请求流水接口返回的流水数据里面的acceptParams解析出来和外层合并，然后保存)
            storage.$storage.setSession(definecfg.$definecfg.BUSI_INFO_YGT, Object.assign({}, bizInfo, acceptParams));
            console.log("一柜通流水转换为vtm流水数据")
            return sysConfig.$syscfg.K_Request_ALL( [that.W0000115({
                USER_TYPE: bizInfo.USER_TYPE || customerInfo.USER_TYPE || '',
                    BUSI_CODE: bizInfo.BUSI_CODE
                 }),
                that.W0000098({
                    USER_TYPE: bizInfo.USER_TYPE ||customerInfo.USER_TYPE || '',
                    BUSI_CODE: bizInfo.BUSI_CODE
                }),
            ]).then(function (res) {
                if (res[0].Code != 0 || res[1].Code != 0) {
                    reject("获取预录入数据接口调用失败");
                }
                console.log("获取预录入数据接口调用结束",res)
                let preRes = res[0];
                let fieldData = res[1] && res[1].Data && res[1].Data[0] || [];
                // 如果存在预录入配置,需要根据预录入配置转换
                if (preRes && preRes.Data && preRes.Data.length) {
                    _.each(preRes.Data, function (cfg) {
                        // 存在数据，且数据类型为对象，需要转换为对象
                        switch (cfg.MODULE_DATA_TYPE) {
                            case "00": // 表示无分组，且为对象结果，需干掉分组
                                if(busiData[cfg.GROUP_ID]) {
                                    busiData[cfg.GROUP_ID][cfg.MODULE_ID] = [busiData[cfg.MODULE_ID] || busiData[cfg.GROUP_ID][cfg.MODULE_ID]];
                                }else {
                                    busiData = Object.assign(busiData , {
                                        [cfg.GROUP_ID] : {
                                            [cfg.MODULE_ID]: [busiData[cfg.MODULE_ID]]
                                        }
                                    })
                                    delete busiData[cfg.MODULE_ID]
                                }   
                                break;
                            case "01": // 表示无分组，且为数组结构，需干掉分组
                                if(busiData[cfg.GROUP_ID]) {
                                    busiData[cfg.GROUP_ID][cfg.MODULE_ID] = busiData[cfg.MODULE_ID] || busiData[cfg.GROUP_ID][cfg.MODULE_ID];
                                }else {
                                    busiData = Object.assign(busiData , {
                                        [cfg.GROUP_ID] : {
                                            [cfg.MODULE_ID]: busiData[cfg.MODULE_ID]
                                        }
                                    })
                                    delete busiData[cfg.MODULE_ID]
                                }   
                                break;
                            case "10": // 表示有分组，且为对象结构，需进行转换
                                let tempData = busiData[cfg.GROUP_ID] && busiData[cfg.GROUP_ID][cfg.MODULE_ID];
                                if(!tempData) {
                                    busiData =  _.merge(busiData , {
                                        [cfg.GROUP_ID] : {
                                            [cfg.MODULE_ID]: []
                                        }
                                    })
                                    return;
                                }
                                if(!Array.isArray(tempData)) {
                                    busiData[cfg.GROUP_ID][cfg.MODULE_ID] = [busiData[cfg.GROUP_ID][cfg.MODULE_ID]]
                                }   
                                break;
                            case "11": // 表示有分组，且为数组结构，不处理
                                break;
                            case "20": // 表示需要把数据打散到busiData里面
                                if(!busiData[cfg.GROUP_ID] || !busiData[cfg.GROUP_ID][cfg.MODULE_ID]) {
                                    let fields = fieldData[cfg.GROUP_ID] && fieldData[cfg.GROUP_ID][cfg.MODULE_ID] && fieldData[cfg.GROUP_ID][cfg.MODULE_ID][0]['FIELDS'] || {};
                                    let fieldsArr = Object.keys(fields);
                                    let busiFieldsObj = {};
                                     _.each(fieldsArr, function(key) {
                                        busiFieldsObj[key] = busiData[key] || "";
                                    })
                                    busiData = _.merge(busiData , {
                                        [cfg.GROUP_ID] : {
                                            [cfg.MODULE_ID]: [busiFieldsObj]
                                        }
                                    })
                                }
                                break;
                        }
                    })
                }

                //转成VTM数据格式以后保存下 vtm格式数据流水 busiData是经过转换vtm格式的数据 删除acceptParam 存入本地
                delete busiData.ACCEPT_PARAM;
                delete busiData.DEAL_PARAM;
                storage.$storage.setSession(definecfg.$definecfg.BUSI_INFO, Object.assign({} ,busiData));
                store.commit(types.$types.UPDATE_OLD_BIZ_DATA, Object.assign({}, busiData));
                resolve(busiData);
            }).catch((err) => {
                reject(err);
            })
        })
    },
     /**
     * 根据业务代码拿到该业务公共参数
     * @param {string} busiCode 
     * @param {string} PARAM_CODE  具体业务参数的名称 
     */
    getBusiCommonParams(busiCode,PARAM_CODE){
        let that = this, custInfo = storage.$storage.getJsonSession(definecfg.$definecfg.CUSTOMER_INFO);
        return sysConfig.$syscfg.K_Request("W0000125", {
          BUSI_CODE:busiCode,
          USER_TYPE:custInfo && custInfo.USER_TYPE || store.state.usertype,
        }).then((data) => {
          if(data.Code == 0){
            if(PARAM_CODE){
                return that.getBusiCommonParamsByCode(data.Data,PARAM_CODE);
            }else{
                return data.Data;
            }
          }else{
            console.log('业务公共参数查询失败');
            throw ('业务公共参数查询失败,原因：'+ data.Msg);
          }
        })
    },
    /**
     * 根据参数名称拿到该业务公共参数
     * @param {array} 所有参数的集合 
     * @param {string} PARAM_CODE  具体业务参数的名称 
     */
    getBusiCommonParamsByCode(paramsArray,paramCode){
        if(!_.isArray(paramsArray)){
            //防止报错，阻止空字符或空对象
            return null;
        }
        let valFilter = (paramsArray|| []).filter(v => {
            return v.PARAM_CODE ==  paramCode;
        });
        return valFilter.length>0 && valFilter[0].PARAM_VALUE || "";
    },
     /**
     * 根据参数名称拿到该业务公共参数
     * @param {string} PARAM_CODE  具体业务参数的名称 
     */
    getBusiCommonParamsFromCacheObjs(paramCode){
        let comObjs = storage.$storage.getJsonSession(definecfg.$definecfg.BUSI_COMM_PARAM_OBJS);
        return comObjs && comObjs[paramCode]|| "";
    },
    /**
     * 根据参数名称拿到系统公共参数
     * @param {string} parCOde  具体业务参数的名称 
     */
    getSysCommonParamsFromCacheObjs(parCOde){
        let isRefreshSys = store.state.isRefreshSys;
        let comObjs = storage.$storage.getJsonSession(definecfg.$definecfg.SYS_COMM_PARAM_OBJS);
        return comObjs && comObjs[parCOde]|| "";
    },
    /**
    *日历信息获取
    * @returns {Object} 日历信息获取
    * Object={ BOOKSET:帐套编号,PHYSICAL_DATE:日期,DATE_FLAG:日期标志,DATE_STATUS:日期状态
    *     }
    * */
    fetchCalendarInfo(params){
        return sysConfig.$syscfg.K_Request("W0000119",Object.assign({
            bex_codes: "L1260601",
        },params || {})).then(function(data){
            if(data.Code == '0'){
                return data.Data && data.Data[0] || null;
            }else{
                console.log('日历信息获取失败');
                throw ('日历信息获取失败原因：'+data.Msg);
            }
        });
    },

     /**
     * 预约数据提交任务
     * @param busiData
     * @returns {*}
     */
    apptBizTaskSubmit(){
        let bSno = storage.$storage.getSession(definecfg.$definecfg.B_SNO);
        if(!bSno){
            throw '预约数据提交流水号不能为空'
        }
        return sysConfig.$syscfg.K_Request("W0000122",{
            ACCEPT_TYPE:0,
            B_SNO: bSno
        });
    },


    /**
     * 业务受理最后一步提交任务
     * @param busiData
     * @returns {*}
     */
    acceptTaskSubmit(param){
        let bSno = storage.$storage.getSession(definecfg.$definecfg.B_SNO);
        if(!bSno){
            throw '业务受理最后一步提交流水号不能为空'
        }
        return sysConfig.$syscfg.K_Request("W0000122",{
            ACCEPT_TYPE: 1,
            B_SNO: bSno,
            INTELLIGENT_STATUS: "1",
            // 业务依赖的时间片
            TMSL_ID: param.TMSL_ID || ""
        });
    },

    /**
     * 业务受理提交至受理提交中
     * @param busiData
     * @returns {*}
     */
    acceptTaskSubmit2(){
        let bSno = storage.$storage.getSession(definecfg.$definecfg.B_SNO);
        if(!bSno){
            throw '业务受理提交至受理提交中流水号不能为空'
        }
        return sysConfig.$syscfg.K_Request("W0000122",{
            ACCEPT_TYPE:2,
            B_SNO: bSno
        });
    },

    /**
     * 业务受理提交至待双录
     * @param busiData
     * @returns {*}
     */
    acceptTaskSubmit3(){
        let bSno = storage.$storage.getJsonSession(definecfg.$definecfg.B_SNO);
        if(!bSno){
            throw '业务受理提交至待双录流水号不能为空'
        }
        return sysConfig.$syscfg.K_Request("W0000122",{
            ACCEPT_TYPE:3,
            B_SNO: bSno
        }); 
    },
	//是否双录
    async isDoubleRecord() {
        let that = this;
		var busiCode=store.state.busicode;
		if(busiCode=='V0050'||busiCode=='V0051'||busiCode=='V0052'){
			return true;
		}
		let custInfo=storage.$storage.getJsonSession(definecfg.$definecfg.CUST_ALL_INFO)||{};
		var custCode=custInfo.CUST_CODE;
		if((!busiCode)|| (!custCode)){
			let bSno = storage.$storage.getSession(definecfg.$definecfg.B_SNO);
			if(bSno){
				let busiRecord=	await  sysConfig.$syscfg.K_Request("W0000114", {
					B_SNO: bSno
				}).then(function(data) {
					let oppBusiData = data && data.Data && data.Data.length && data.Data[0] || {};
				   return oppBusiData;
				});
				busiCode=busiRecord.BUSI_CODE;
				custCode=busiRecord.CUST_CODE;
			}
		}
		let accessData= await Promise.all([sysConfig.$syscfg
            .K_Request("YG003435", {
                ACS_TYPE: "2",
                BUSI_CODE: busiCode,
                CUST_CODE: custCode,
                BUSI_MODE: "",
            })
            .then(function (res) {
                if (res && res.Data && res.Data[0]) {
                    return res.Data;
                }
                return [];
            }),	
			sysConfig.$syscfg
            .K_Request("YG003435", {
                ACS_TYPE: "2",
                BUSI_CODE: busiCode,
                CUST_CODE: custCode,
                BUSI_MODE: "1",
            })
            .then(function (res) {
                if (res && res.Data && res.Data[0]) {
                    return res.Data;
                }
                return [];
            }),	
			sysConfig.$syscfg
            .K_Request("YG003435", {
                ACS_TYPE: "2",
                BUSI_CODE: busiCode,
                CUST_CODE: custCode,
                BUSI_MODE: "2",
            })
            .then(function (res) {
                if (res && res.Data && res.Data[0]) {
                    return res.Data;
                }
                return [];
            })]).then(function (tempData){
				let tempResult=[];
				tempResult=tempResult.concat(tempData[0]);
				tempResult=tempResult.concat(tempData[1]);
				tempResult=tempResult.concat(tempData[2]);
				return tempResult;
			});	
		if(accessData){
			let accessFlag= 0 ;
			for(let key in accessData){
				if(accessData[key].CON_ID=="100" && accessData[key].RESTRICT_TYPE =='2'){
					accessFlag=1;
				}
				if(busiCode=='V0001'&& accessData[key].CON_NAME=="客户双录检查（含在线风险揭示）(APP)" && accessData[key].RESTRICT_TYPE =='2'){
					accessFlag=1;
				}
			}
			if(accessFlag == 1){
				 return false;
			}
		}
		return true;
    },
    /*
    *@Description: 客户信息规则校验 .检测职业、年龄、行业、诚信类型等的联动控制
    *@Author: yangyp
    *@Date: 2019-07-20 10:50:27
    * @param BIRTHDAY    生日
    * @param SEX         性别
    * @param OCCU_TYPE   职业类型    对应字典 OCCU_EXTYPE
    * @param EDUCATION   学历       对应字典 EDUCATION
    * @param TRADE       行业类别    对应字典 IF_TRADE 
    * @param POSITION    职务       对应字典 POSITION 
    * @param CREDIT_FLAG 不良诚信记录类型    无字典需要从客户CUST_BASIC_INFO中获取
    * @param CREDIT_TYPE 不良诚信记录选项       对应字典 CREDIT_TYPE 
    */
    W0000215(param){
        return  sysConfig.$syscfg.K_Request('W0000215', param);
    },
    /*
    *@Description:获取缓存的预录入配置或者请求预录入模块配置
    *@Author: linsc
    */
    W0000115(param){
        let preDataCache = storage.$storage.getJsonSession(definecfg.$definecfg.PRE_MODULE_DATA_CACHE)
        if(!preDataCache){
            //缓存没有就重新请求
            return  sysConfig.$syscfg.K_Request('W0000115', param).then(res=>{
                console.log("重新请求了W0000115",res)
                if(res.Code == "0" && res.Data && res.Data.length){
                    storage.$storage.setSession(definecfg.$definecfg.PRE_MODULE_DATA_CACHE, res)
                }
                return res
            });
        }else{
            return new Promise((resolve, reject) => {
                console.log("复用W0000115的缓存",preDataCache)
                resolve(preDataCache)
            })
        }
    },
      /*
    *@Description:获取缓存的预录入配置或者请求预录入分组字段配置
    *@Author: linsc
    */
    W0000098(param){
        let preGroupDataCache = storage.$storage.getJsonSession(definecfg.$definecfg.PRE_GROUP_DATA_CACHE)
        if(!preGroupDataCache){
            //缓存没有就重新请求
            return sysConfig.$syscfg.K_Request('W0000098', param).then(res=>{
                console.log("重新请求了W0000098",res)
                if(res.Code == "0" && res.Data && res.Data.length){
                    storage.$storage.setSession(definecfg.$definecfg.PRE_GROUP_DATA_CACHE, res)
                }
                return res
            });
        }else{
            return new Promise((resolve, reject) => {
                console.log("复用W0000098的缓存", preGroupDataCache)
                resolve(preGroupDataCache)
            })
        }
    },      
    async isServiceTime(busiCode, type, params) {
        let that = this;
        let result = { Code: "0", Msg: "" };
        if (!busiCode) {
            return result;
        } else {
            return Promise.all([
                sysConfig.$syscfg.getSysTime(),
                sysConfig.$syscfg.K_Request("Y1260601", {}), // 是否交易日
                sysConfig.$syscfg.K_Request("YG003800", {}), // 获取时间片
                //sysConfig.$syscfg.K_Request("YG003810", {}), // 获取业务时间片
                sysConfig.$syscfg.K_Request("YG003825", {RES_TYPE: "1", RES_IDS: "1"}), // 获取业务时间片
            ]).then(function (res) {
                let data1 = res[0];
                let data2 = res[1].Data;
                let data3 = res[2].Data;
                let data4 = res[3].Data;
                let sysTime = data1;
                let isTrdDate =
                    data2[0] && data2[0] && data2[0].DATE_STATUS == "1";
                let sysTimeSliceArr = data3 || [];
                let busiTimeSliceArr = data4 || [];
                let curBusiObj = _.find(busiTimeSliceArr, function (v) {
                    return v.BUSI_CODE === busiCode;
                });
                // 如果无系统时间片、业务时间片、当前业务时间片，返回true，默认自然日全天可以受理和办理
                if (
                    !sysTimeSliceArr.length ||
                    !busiTimeSliceArr.length ||
                    !curBusiObj
                ) {
                    return { Code: "0", Msg: "" };
                }

                let sysTimeSliceObj = {},
                    tmslIdArr = [],
                    msgArr = [];
                // 若存在时间片设置，默认不在服务时间内
                let result = { Code: "0", Msg: "在在服务时间内" };
                // 将数组转换为对象
                _.each(sysTimeSliceArr, function (v) {
                    sysTimeSliceObj[v.TMSL_ID] = v;
                });

                // 仅配置了受理 或 办理时间片的情况
                if (type == "deal" && !_.trim(curBusiObj.DEAL_TMSL_ID)) {
                    // 没配置办理时间片
                    return result;
                } else if (!_.trim(curBusiObj.ACCEPT_TMSL_ID)) {
                    // 没配置受理时间片
                    return result;
                }

                // 默认检查业务受理时间片
                tmslIdArr =
                    type == "deal"
                        ? curBusiObj.DEAL_TMSL_ID.split(",")
                        : curBusiObj.ACCEPT_TMSL_ID.split(",");

                _.each(tmslIdArr, function (v) {
                    if (
                        sysTime < sysTimeSliceObj[v].TMSL_BGN_TIME || // 服务器时间小于开始时间片时间
                        sysTime > sysTimeSliceObj[v].TMSL_END_TIME || // 服务器时间大于时间片结束时间
                        (!isTrdDate && sysTimeSliceObj[v].TMSL_CALENDAR == "1")
                    ) {
                        // 时间依赖交易日，但当日为非交易日
                        result.Code = "1";
                        msgArr.push(
                            sysTimeSliceObj[v].TMSL_NAME +
                                "[" +
                                sysTimeSliceObj[v].TMSL_BGN_TIME +
                                "-" +
                                sysTimeSliceObj[v].TMSL_END_TIME +
                                "]"
                        );
                    }
                });

                if (result.Code != "0") {
                    result.Msg = msgArr.join(" 或 ");
                }
                return result;
            }).catch(data => {
                console.log("查询异常:" + data);
            });
        }
    },

    /**
     * VTM员工认证流水新增
     * 在VTM的员工认证环节，员工认证成功后，需要留痕到YGT的表：KSCS_OP_VERIFY_LOG
     * 对应集中运营菜单：VTM员工认证流水查询
     */

     saveOpVerifyLog(param) {
        return new Promise(function (resolve, reject) {
            return sysConfig.$syscfg.K_Request("KSCS0063", param).then(data => {
                if(data.Code == "0"){
                    resolve({
                        code: "0",
                        msg: "员工认证流水保存成功！"
                    });
                }else{
                    resolve({
                        code: "9999",
                        msg: "员工认证流水保存失败！"
                    });
                }
            });
        })  
    },

    /**
     * 客户规范性检查增加读卡信息校验
     * 在VTM读卡登录的存量客户，需要校验：姓名、性别、证件有效期、证件地址与系统内是否一致
     */

    checkCardCustInfo(cardInfo, custInfo){
        let cardInfoSex = cardInfo.SEX == "男性" ? "0" : cardInfo.SEX == "女性" ? "1" : "2",
        checkInfo = "";
        if(cardInfo.CUST_FNAME != custInfo.CUST_FNAME){
            checkInfo += ",姓名";
        }
        if(cardInfoSex != custInfo.SEX){
            checkInfo += ",性别";
        }
        if(cardInfo.ID_EXP_DATE != custInfo.ID_EXP_DATE){
            checkInfo += ",证件有效期";
        }
        if(utils.ToCDB(cardInfo.ID_ADDR) != utils.ToCDB(custInfo.ID_ADDR) && (utils.ToCDB(cardInfo.ID_ADDR) + "").replace(/[^\x00-\xff]/g, "**").length <= 64){
            checkInfo += ",证件地址";
        }
        if(utils.ToCDB(cardInfo.ID_ADDR) != utils.ToCDB(custInfo.ID_ADDR) && 
        ((utils.ToCDB(cardInfo.ID_ADDR) + "").replace(/[^\x00-\xff]/g, "**").length > 64 || (utils.ToCDB(cardInfo.ID_ADDR) + "").replace(/[^\x00-\xff]/g, "**").length < 12) &&
        ((utils.ToCDB(custInfo.ID_ADDR) + "").replace(/[^\x00-\xff]/g, "**").length > 64 || (utils.ToCDB(custInfo.ID_ADDR) + "").replace(/[^\x00-\xff]/g, "**").length < 12)
        ){
            checkInfo += ",证件地址";
        }
        if(checkInfo != ""){
            checkInfo = checkInfo.charAt() == "," ? checkInfo.substring(1) : checkInfo;
        }
        return checkInfo;
        
    },

    /**
     * VTM打印对账单流水查询
     * 对应YGT的表：KSCS_PRINT_BILL_LOG
     * 对应集中运营菜单：VTM打印对账单流水查询
     */
    queryPrintLog(param) {
        return new Promise(function (resolve, reject) {
            return sysConfig.$syscfg.K_Request("KSCS0064", param).then(data => {
                if(data.Code == "0"){
                    resolve(data);

                }else{
                    resolve({
                        code: "9999",
                        msg: "打印对账单流水查询失败！"
                    });
                }
            });
        })  
    },

    /**
     * VTM打印对账单流水新增
     * 对应YGT的表：KSCS_PRINT_BILL_LOG
     * 对应集中运营菜单：VTM打印对账单流水新增
     */
    addPrintLog(param) {
        return new Promise(function (resolve, reject) {
            return sysConfig.$syscfg.K_Request("KSCS0065", param).then(data => {
                if(data.Code == "0"){
                    resolve({
                        code: "0",
                        msg: "打印对账单流水新增成功！"
                    });
                }else{
                    resolve({
                        code: "9999",
                        msg: "打印对账单流水新增失败！"
                    });
                }
            });
        })  
    },

    //获取集中运营（一柜通）的省市县地址组件的下拉数据，并缓存到indexDB
    getOppCityData(isValidateSession) {
        return sysConfig.$syscfg.K_Request('W0000001', {
            YGT_SERVICE_CODE:"YG900126"
        },"","",isValidateSession == false ? "0":"1").then(res=> {
            var tempProviceCityData = [];
            var pData = _.filter(res.Data || [], function (obj) {
                    return obj.AREA_TYPE == "p"; 
                }) || [], //一级：省、直辖市、香港特别行政区、澳门特别行政区
                nData = _.filter(res.Data || [], function (obj) {
                    return obj.AREA_TYPE == "n"; 
                }) || [], //二级：市、市辖区、辖县
                sData = _.filter(res.Data || [], function (obj) {
                    return obj.AREA_TYPE == "s"; 
                }) || []; //三级：区
    
            _.each(pData, function (obj, i) {
                var tempData = {},  //用于保存每一个一级区域下的所有二级、三级区域数据
                    cData = _.filter(nData, function (o, v) {
                        return o.PAR_ID == obj.AREA_ID; 
                    }) || [];  //一级下的全部二级区域数据
                tempData.p = obj.AREA_NAME;
                tempData.name_spell = obj.AREA_SPELL;

                if ( cData.length > 0 ) {
                    tempData.c = [];
                }

                _.each(cData, function (obj1, i1) {

                    var aData = _.filter(sData, function (o, v) {
                        return o.PAR_ID == obj1.AREA_ID; 
                    }) || []; //二级下的全部三级数据

                    tempData.c.push(aData.length > 0 ? {n: obj1.AREA_NAME, name_spell: obj1.AREA_SPELL, a: []} : {n: obj1.AREA_NAME, name_spell: obj1.AREA_SPELL});

                    _.each(aData, function (obj2, i2) {
                        tempData.c[i1].a.push({ s: obj2.AREA_NAME, z: obj2.POST_CODE, name_spell: obj2.AREA_SPELL });
                    });
                });

                tempProviceCityData.push(tempData);
            });
            var oppCityData = utils.parserKcopCityDataToKmsp(tempProviceCityData);
            oppCityData.forEach(item => {
                if(!item.children) {
                    item.children = [{
                        "value": "不详",
                        "label": "不详",
                        "code": "",
                        "children":[]
                    }]
                }
                if(item.children){
                    item.children.forEach(ele => {
                        if((ele.children && !((ele.children || []).find(map=> map.value == "不详")))){
                            ele.children.push({
                                "value": "不详",
                                "label": "不详",
                                "code": ""
                            })
                        } else if (!ele.children) {
                            ele.children = [{
                                "value": "不详",
                                "label": "不详",
                                "code": ""
                            }]
                        }
                    })
                }
            })
            return webStorage.set("OPP_CITY_DATA",oppCityData).then(()=> {
                window.oppCityData = oppCityData;
                return oppCityData;
            })
        })
    },
    isSpeOrg(szorgType, szorgTypeArr) {
        if (_.isEmpty(szorgTypeArr)) {
            szorgTypeArr = (this.getSysCommonParamsFromCacheObjs('SPE_SZORG_TYPE') || '10,11,12,13,14,19,25b,41').split(",");
        }
        return _.indexOf(szorgTypeArr, szorgType) != -1;
    },
}

