import sysConfig from "../config/sysConfig";
import baseConfig from "../config/baseConfig";
import dict from "../tools/dict";
import oppService from './opp-service'
import storge from '../tools/storage'
import definecfg from "../config/defineConfig.js";
import date from '../tools/date'
import csdcService from './csdc-service'
import bizcfg from "../config/bizConfig.js";
import org from '../tools/org'
export default {
    /**
     * 客户基本信息查询
     * 包含了一码通信息
     * @param {String} custCode 
     * @returns {Object}
     */
    getCustBaseData(custCode) {
        return sysConfig.$syscfg.K_Request("YG003660",{
            USER_CODE: custCode,
            CUST_CODE: custCode,
            MODEL_TYPE: "CUST_BASE_INFO"
        }).then(res => {
            return res.Data && res.Data[0] || {};
        })
    },
    /**
     * 获取客户模板的数据
     */
    getCustModelSet(_this, intOrg) {
        let userInfo = _this.$storage.getJsonSession(_this.$definecfg.USER_INFO),
            params = {
                LBM: "L1000003",
                TAB_CODE: "OPENTMPL_CFG",
                F_FUNCTION: "103500010",
                INT_ORG: intOrg || userInfo.ORG_CODE,
                CUACCT_ATTR: "0",
                F_CUST_ORG_CODE: intOrg || userInfo.ORG_CODE
            };
        return _this.$syscfg.K_Request("Y3000001", params);
    },
    /**
     * 获取客户开户模板
     * @param  _this 
     */
    getOpenTemplateData(_this, intOrg) {
        let userInfo = _this.$storage.getJsonSession(_this.$definecfg.USER_INFO),
            params = {
                INT_ORG: intOrg || userInfo.ORG_CODE,
                USER_TYPE: _this.userType,
                F_CUST_ORG_CODE: intOrg || userInfo.ORG_CODE,
            }
        return _this.$syscfg.K_Request("YG003684", params);
    },
    /**
     * 根据客户代码获取该客户在系统内的股东账户信息
     * @param {*} custCode 
     */
    getCustSYStrdacctInfo (custCode) {
        return new Promise(function (resolve, reject) {
            if (!custCode) {
                reject(arguments);
                throw "调用getCustSYStrdacctInfo方法失败，原因：客户代码【CUST_CODE】未传！";
            }
            sysConfig.$syscfg.K_Request("W0000137", {
                USER_CODE: custCode,
                CUST_CODE: custCode
            }).then(function (data) {
                if (data.Code == "0") {
                    resolve(data.Data);
                } else {
                    reject(data)
                }
            }).catch(function (data) {
                reject(data)
            })
        })
    },

    // 查询客户资金信息
    getExtAssetsData (custCode, params, refreshFlag) {
        return new Promise(function (resolve, reject) {
            if (!custCode) {
                reject(arguments);
                throw "调用getCustSYStrdacctInfo方法失败，原因：客户代码【CUST_CODE】未传！";
            }
            sysConfig.$syscfg.K_Request("W0000229", {
                USER_CODE: custCode,
                CUST_CODE: custCode,
                MODEL_TYPE: "CUST_ALL_INFO",
                INFO_TYPE: "OCCUPATION_INFO,EXT_ASSETS,CREDIT_RECORD_INFO,TAX_INFO",
                CUST_EXT_ATTR: params.CUST_EXT_ATTR
            }).then(function (data) {
                if (data.Code == "0") {
                    resolve(data.Data);
                } else {
                    reject(data)
                }
            }).catch(function (data) {
                reject(data)
            })
        })
    },

    /**
     * 根据客户代码获取该客户在系统内的场外开放式基金（即基金加挂户）
     * @param {*} custCode 
     */
    getCustSysOpenJjtrdacctInfo (custCode) {
        return sysConfig.$syscfg.K_Request("W0000179", {
            CUST_CODE: custCode
        }).then(function (data) {
            if (data.Code == "0") {
                return data.Data;
            } else {
                throw `W0000137接口调用失败，原因：${data.Msg}`;
                return [];
            }
        })
    },
    /**
     * 获取客户的已经开通的基金账户信息
     * @param {Number} CUST_CODE 
     */
    getCustFundsInfo (CUST_CODE) {
        return new Promise(function (resolve, reject) {
            if (!CUST_CODE) {
                console.warn("调用getCustFundsInfo方法失败，原因：客户代码【CUST_CODE】未传！");
                resolve([]);
            }
            sysConfig.$syscfg.K_Request("Y3000038", {
                CUST_CODE: CUST_CODE
            }).then(function (data) {
                if (data.Code == "0") {
                    resolve(data.Data);
                } else {
                    reject(data)
                }
            }).catch(function (data) {
                reject(data)
            })
        })
    },
    /**
     *获取客户签署协议信息
     */
    getCustAgmtData: function (custCode, agmtType, params) {
        return new Promise(function (resolve, reject) {
            sysConfig.$syscfg.K_Request("W0000138", _.extend({
                CUST_AGMT_TYPE: agmtType,
                CUST_CODE: custCode
            }, params)).then(function (data) {
                resolve(data && data.Data && data.Data.length && data.Data || [])
            }).catch(function (data) {
                reject(data)
            })
        })
    },
    /**
    * 客户检查协议配置。 标准版
    * @author liwei2
    * @param
    *
    */
    getCustAgmtChkCfgData: function (agmtType, params) {
        params = params || {};
        return sysConfig.$syscfg.K_Request("Y1100139", Object.assign({
            CUST_AGMT_TYPE: agmtType
        }, params)).then(function (data) {
            if (data.Code == "0") {
                return data.Data;
            } else {
                throw `Y1100139接口调用失败，原因：${data.Msg}`;
                return [];
            }
        })
    },

    getMulCustAgmtChkCfgData: function(agmtType, params) {
        return sysConfig.$syscfg.K_Request('Y1100139', Object.assign({CUST_AGMT_TYPES: agmtType}, params)).then(res => {
            return res.Data;
        })
    },

    /**
     * 客户黑名单校验
     * @param {Object} custObj
     *      数据字典：BL_MATCH_MODE
     *      1：姓名/曾用名/别名
     *      2：证件号码
     *      3：证件类型+证件号码
     *      4：身份三要素
     *      5：(姓名/曾用名/别名)+证件类别+证件号码
     *      6：客户代码
     *      7：(姓名/曾用名/别名)|(证件类别+证件号码)
     *      8：国籍
     *      9：国籍+（姓名/曾用名/别名）
     *      A：国籍+(姓名/曾用名/别名)+证件类型+证件号码
     * @returns {*}
     */
    isInBlackList: function (custObj) {
        return new Promise(function (resolve, reject) {
            sysConfig.$syscfg.K_Request("Y3000059", Object.assign({
                // service: "Y3000044",
                bex_codes: "YGT_A1192027",
                EUSER_TYPE: "0",
                USER_NAME: custObj.CUST_NAME,
                F_CUST_ORG_CODE: custObj.F_CUST_ORG_CODE || custObj.INT_ORG || custObj.ORG_CODE
            }, custObj)).then(function (data) {
                return dict.transformDict(data.Data && data.Data[0] || {}, [{
                    "MATCH_MODE": "BL_MATCH_MODE"
                }]).then(function (newObj) {
                    resolve(newObj);
                });
            }).catch(function (data) {
                reject(data)
            })
        })
    },

    suitablyResult: function (params) {
        let req = {
            USER_TYPE: params.USER_TYPE,
            CUST_AGMT_TYPE: params.CUST_AGMT_TYPE,
            STKBD: params.STKBD,
            TRDACCT_EXCLS: params.TRDACCT_EXCLS,
            PROF_INVESTOR: params.PROF_INVESTOR,
            // 这里有其他参数这里添加
        }
        return Promise.all([
            this.getCustMatchData(params.CUST_CODE, req),
            this.getCustSurveyData({ CUST_CODE: params.CUST_CODE }),
        ]).then(res => {
            if(res[0].CHK_INVEST_LMT && _.indexOf(res[0].CHK_INVEST_LMT,",") === -1){
                res[0].CHK_INVEST_LMT = res[0].CHK_INVEST_LMT.split("").join(",");
            }
            let dictArr = [
                "EXPECT_INCOME",
                "INVEST_LMT",
                "INVEST_PRO",
                {
                    "BUSIRATING_LVL": "RISK_PROPRIGHT",
                    "CHK_EXPECT_INCOME": "EXPECT_INCOME",
                    "CHK_INVEST_LMT": "INVEST_LMT",
                    "CHK_INVEST_PRO": "INVEST_PRO",
                    //账户系统客户协议检查：中业务协议风险等级字典
                    "RATING_LVL_PROP": "RATING_LVL"
                }];
            return dict.transformDict(res[0], dictArr).then(function (newData) {
                // 避免客户不存在测评等级的情况
                newData.CUST_RATING_LVL_NAME = _.pick(newData, "CUST_RATING_LVL_NAME") && _.pick(newData, "CUST_RATING_LVL_NAME").CUST_RATING_LVL_NAME;
                newData.CHK_SURVEY_SCORE_TEXT = (newData.CHK_SURVEY_SCORE_TEXT || "").replace("C", "R");
                return newData;
            })
        }).catch(err => {
          console.error(err)
          throw new Error("适当性匹配信息查询失败")
        })
    },
    // 开户适当性匹配结果
    async openAccountSuitablyResult (params) {
        // 先取缓存系统公参
        let RISK_MATE_SYS = oppService.getSysCommonParamsFromCacheObjs("RISK_MATE_SYS");
        // 再从系统中获取
        if (_.isEmpty(RISK_MATE_SYS)) {
            await sysConfig.$syscfg.getSysConfig("RISK_MATE_SYS").then(data => {
                if (data.Code == '0' && data.Data.length > 0) {
                    RISK_MATE_SYS = data.Data[0].PAR_VAL
                }
            })
        }
        return Promise.all([
            RISK_MATE_SYS == "0" ?
                this.kbssOpenAccountApprMatch(params) : _.extend(params.MATCH_OBJ, { MATCH_FLAG: params.MATCH_FLAG })
        ]).then(function (newObj) {
            return dict.transformDict(newObj[0], [
                "EXPECT_INCOME",
                "INVEST_LMT",
                "INVEST_PRO",
                {
                    "BUSIRATING_LVL": "RISK_PROPRIGHT",
                    "CHK_EXPECT_INCOME": "EXPECT_INCOME",
                    "CHK_INVEST_LMT": "INVEST_LMT",
                    "CHK_INVEST_PRO": "INVEST_PRO",
                    //账户系统客户协议检查：中业务协议风险等级字典
                    "RATING_LVL_PROP": "RATING_LVL"
                }
            ]).then(function (newData) {
                // 避免客户不存在测评等级的情况
                newData.CUST_RATING_LVL_NAME = _.pick(newData, "CUST_RATING_LVL_NAME") && _.pick(newData, "CUST_RATING_LVL_NAME").CUST_RATING_LVL_NAME;
                newData.CHK_SURVEY_SCORE_TEXT = (newData.CHK_SURVEY_SCORE_TEXT || "").replace("C", "R");
                return newData;
            })
        });
    },
    // 获取适当性匹配信息
    kbssOpenAccountApprMatch: function (params) {
        let userType = params.USER_TYPE;
        let busiCommonParams = storge.$storage.getJsonSession(definecfg.$definecfg.BUSI_COMM_PARAM);

        // 主试题编号
        // let surveySn = this.getSurveySn(params);
        let riskObj = params.RISK_INFO instanceof Array ? params.RISK_INFO[0] : (
            params.RISK_INFO == undefined ? {} : params.RISK_INFO
        );
        let req = {
            USER_TYPE: userType,
            CUST_AGMT_TYPE: "AB",
            STKBD: oppService.getBusiCommonParamsByCode(busiCommonParams, "SUITABLY_STKBD") || "@",
            TRDACCT_EXCLS: userType == "0" ? "0" : "1",
            CUST_CODE: "0",
            MAIN_RATING_LVL: riskObj.RATING_LVL,
            RATING_LVL: riskObj.RATING_LVL,
            RATING_LVL_NAME: riskObj.RATING_LVL_NAME,
            SURVEY_SCORE: riskObj.SURVEY_SCORE,
            INVEST_PRO: riskObj.INVEST_PRO,
            INVEST_LMT: riskObj.INVEST_LMT,
            EXPECT_INCOME: riskObj.EXPECT_INCOME,
            BUSI_CODE: params.BUSI_CODE
        }
        return sysConfig.$syscfg.K_Request("Y1100140", req).then(data => {
            return _.get(data, "Data[0]", {});
        });
    },
    /**
     * 获取客户匹配信息（深圳私募债券合格投资者权限开通(适当性匹配)）
     * 先发起匹配，再查询匹配结果
     * @param {String} custCode 用户代码
     * @param {Object} params 入参对象 {MATCH_BIZ_TYPE：适当性业务类型（表CUSTRIGHT_MATCH_RULE），PRO_CODE：产品代码}
     * @return {Object}
     */
    getCustMatchData (custCode, params) {
        return new Promise(function (resolve, reject) {
            sysConfig.$syscfg.K_Request("W0000101", _.extend({
                CUST_CODE: custCode,
            }, params)).then(function (data) {
                if (data.Code == '0') {
                    resolve(data.Data && data.Data[0] || {})
                } else {
                    reject(Object.assign(data, {
                        message: data.Msg
                    }))
                }
            }).catch(function (error) {
                reject(Object.assign(error, {
                    message: error.Msg
                }))
            })
        })
    },

    /**
     * 将客户适当性匹配新的结果组成新的对象包括匹配结果（创业板 和 分级基金都有用到）
     * @param BUSI_CODE 业务代码
     * @param USER_TYPE 客户类型
     * @param CUST_CODE 用户代码
     * @param {Object} suitablyResult （可直接调取查询客户适当性匹配结果的函数返回适当性匹配结果）
     */
    async assembleCustMatchData (params, custSurveyData) {
        let that = this,
            suitablyResult = (params.BUSI_CODE && await that.suitablyResult(params)) || params,
            customerInfo = storge.$storage.getJsonSession(definecfg.$definecfg.CUSTOMER_INFO),
            IS_PROF_FLAG = _.includes(["10", "11", "12"], customerInfo.PROF_INVESTOR_SOURCE);
        //edit linjinbin 这里有可能是其他券商 但是还是用标准版的配置 
        let qsVersionName = bizcfg.$bizcfg.getBizConfigName();
        if (qsVersionName == definecfg.$definecfg.QSJGDM_CONST["100041"]) { //国信版
            return {
                MATCH_FLAG: suitablyResult.MATCH_RESULT, //0: 不匹配
                MATCH_RESULT: suitablyResult.MATCH_RESULT_TEXT || "", //0: 不匹配
                MATCH_RESULT_TEXT: suitablyResult.MATCH_RESULT_TEXT || "", //0: 不匹配
                RATING_DATE: suitablyResult.RATING_DATE && suitablyResult.RATING_DATE != "0" && date.formatDate(suitablyResult.RATING_DATE, "yyyy-MM-dd") || "",
                RATING_LVL: suitablyResult.RATING_LVL || "",
                RATING_LVL_TEXT: suitablyResult.RATING_LVL_TEXT || "",
                INVEST_LIMIT: suitablyResult.INVEST_LIMIT || "",
                INVEST_LIMIT_TEXT: suitablyResult.INVEST_LIMIT_TEXT || "",
                INVEST_TYPE: suitablyResult.INVEST_TYPE || "",
                INVEST_TYPE_TEXT: suitablyResult.INVEST_TYPE_TEXT || "",
                PRATING_LVL: suitablyResult.PRATING_LVL || "",
                PRATING_LVL_TEXT: suitablyResult.PRATING_LVL_TEXT || "",
                PINVEST_LIMIT: suitablyResult.PINVEST_LIMIT || "",
                PINVEST_LIMIT_TEXT: suitablyResult.PINVEST_LIMIT_TEXT || "",
                PINVEST_TYPE: suitablyResult.PINVEST_TYPE || "",
                PINVEST_TYPE_TEXT: suitablyResult.PINVEST_TYPE_TEXT || "",
                RATING_TIME: suitablyResult.RATING_TIME || "",
                SURVEY_CELL_DATA: suitablyResult.SURVEY_CELL_DATA || [],
                MATCH_BIZ_TYPE: suitablyResult.MATCH_BIZ_TYPE || "",
                MATCH_BIZ_TYPE_TEXT: suitablyResult.MATCH_BIZ_TYPE_TEXT || "",
                IS_INVESTOR: IS_PROF_FLAG ? "1" : "0", //标记客户是否是专业客户,用于开户双录判断
                RATING_LVL_MATCH_FLAG: suitablyResult.PRATING_LVL && suitablyResult.RATING_LVL ? (suitablyResult.PRATING_LVL > suitablyResult.RATING_LVL ? "0" : "1") : "",
                INVEST_LIMIT_MATCH_FLAG: suitablyResult.INVEST_LIMIT && suitablyResult.PINVEST_LIMIT ? (suitablyResult.INVEST_LIMIT != suitablyResult.PINVEST_LIMIT ? "0" : "1") : "",
                INVEST_TYPE_MATCH_FLAG: suitablyResult.INVEST_TYPE && suitablyResult.PINVEST_TYPE ? (suitablyResult.INVEST_TYPE.indexOf(suitablyResult.PINVEST_TYPE) == -1 ? "0" : "1") : ""
            }
        } else if (_.includes([definecfg.$definecfg.QSJGDM_CONST["000000"], definecfg.$definecfg.QSJGDM_CONST["100081"]], qsVersionName)) { //标准版
            return Object.assign({}, {
                MATCH_FLAG: suitablyResult.MATCH_FLAG,
                MATCH_RESULT: suitablyResult.MATCH_FLAG == '0' ? '匹配' : '不匹配', //0---通过，1--不通过
                BUSIRATING_LVL: suitablyResult.BUSIRATING_LVL_TEXT && !_.isEmpty(suitablyResult.BUSIRATING_LVL_TEXT) ? suitablyResult.BUSIRATING_LVL_TEXT : !_.isEmpty(suitablyResult.RATING_LVL_TEXT) ? suitablyResult.RATING_LVL_TEXT : suitablyResult.CHK_SURVEY_SCORE_TEXT || "", //业务风险等级
            }, suitablyResult)
        } else if (definecfg.$definecfg.QSJGDM_CONST["100223"] == qsVersionName) { //安信
            return Object.assign({}, suitablyResult, custSurveyData, {

                "PROPER_MATCHING_RESULTS": suitablyResult.MATCH_RESULT !== '1',
                // "ERROR_CODE": "",
                // "ERROR_MSG": "",
                // "INVEST_PRO_ERROR_CODE": "",
                // "INVEST_PRO_ERROR_MSG": "",
                "INVEST_PRO": suitablyResult.INVEST_PRO,
                "INVEST_PRO_TEXT": suitablyResult.INVEST_PRO_TEXT,
                //以下部分字段需要配置业务公参
                "PROPER_RISK_SURVEY_LVL": "3",
                "PROPER_INVEST_LMT": "",
                "CHECK_PROPER_RESULT": "",
                "PROPER_INVEST_PRO": "02",
                "PROPER_INVEST_PRO_TEXT": "权益类",
                "PROPER_BIZ_RISK_LVL": "2",
                "PROPER_BIZ_RISK_LVL_TEXT": "中"

            })
        }


    },

    /**
     * 查询客户资产 国信使用
     * @param {String} custCode  客户代码
     * @param {String} intOrg 机构代码
     * @param {String} cuacctCode 资金账号
     * @param {String} bizType 业务类型  0:股转相关资产 1：分级基金和港股通资产 2：其他适当性资产 3：融资融券相关适当性资产 4：备用
     * @param {String} subBizType 业务子类 0-T-1日资产，1-T日资产，2-20日均资产
     * @returns {*}
     */
    getTradeOtherInfoData (custCode, intOrg, cuacctCode, bizType, subBizType, param) {
        return sysConfig.$syscfg.K_Request("W0000136", {
            GENRPCLBMNO: "L5450120",
            CUST_CODE: custCode,
            INT_ORG: intOrg,
            CUACCT_CODE: cuacctCode,
            BIZ_TYPE: bizType,
            SUBBIZ_TYPE: subBizType,
            noProcess: param.noProcess || false
        }).then(function (data) {
            return data && data.Data[0] && data.Data[0].SUITABLEASSET || "0";
        });
    },
    /**
     * 查询集中交易日均资产。 标准版
     * @param custCode 客户代码
     * @param params 入参对象 查询客户所有系统的资产，需要入参CUST_EXT_ATTR(客户拓展属性),不传，默认只查集中交易资产
     * @param  DIFF_DAYS 前多少个交易日 为负数，不传就是20天，
     * @author liwei2
     */
    getAvgFundAssetData (custCode, params) {
        params = params || {};
        return sysConfig.$syscfg.K_Request("W0000237", Object.assign({
            CUST_CODE: custCode,
        }), params).then(function (data) {
            if (data.Code != '0') {
                throw data.Msg;
            }
            return data && data.Data[0] && data.Data[0] || null;
        });
    },
    /**
     * 获取主试题号
     * @param {*} basedata 
     */
    getSurveySn (params) {
        let userType = params.USER_TYPE || '';
        //如果缓存有则拿缓存 如果没有则请求接口拿取主试题号(注：如果业务公参没有这两个参数则去添加这两个参数不修改这里逻辑)
        let surver_sn_key = userType == '0' ? "KH_SURVEY_SN_PERSON" : "KH_SURVEY_SN_ORG"
        return sysConfig.$syscfg.getSysConfig(surver_sn_key).then(surveySn => {
            return surveySn.Data[0].PAR_VAL;
        })
    },
    /**
     * 获取客户风险测评题结果
     * 调用账户接口 L1160011：客户风险测评结果查询
     * @param {String} CUST_CODE 客户代码
     * @param {String} USER_TYPE 测评题编号
     * @param {String} BUSI_CODE 业务代码
     */
    async getCustSurveyData (params) {//params 必须要有BUSI_CODE、USER_TYPE、CUST_CODE
        let surveySn = _.get(params, "surveySn", "")
        let custCode = params.CUST_CODE;
        return sysConfig.$syscfg.K_Request("W0000102", {
            USER_CODE: custCode,
            CUST_CODE: custCode,
            USER_ROLE: 1, //默认为客户
            SURVEY_SN: surveySn,
        }).then(data => {
            if (data.Code == '0') {
                return data.Data && data.Data[0] || {};
            } else {
                throw ("获取客户风险测评题结果失败，原因：" + data.Msg);
            }
        })

    },
    // 中登校验 开户的中登校验 直接查询中登
    runCsdcValidate: function (params) {
        return sysConfig.$syscfg.getSysConfig('IS_MUST_CSDC_VALIDATE').then((data) => {
            if (data.Code == 0) {
                //校验通过系统公参控制是否校验 1：校验 0：不校验
                if (data.Data[0] && data.Data[0].PAR_VAL == '0') {
                    return {
                        result: [],
                        flag: true
                    };
                } else {
                    var that = this;
                    return that.CsdcValidate(params);
                }
            } else {
                throw data.Msg
            }
        })
    },
    CsdcValidate (params) {
        return sysConfig.$syscfg.K_Request('W0000105', {
            OPERATOR_TYPE: "0",
            ACCTBIZ_CLS: '02',
            CHK_STATUS: "2",
            F_CUST_ORG_CODE: params.F_CUST_ORG_CODE || params.INT_ORG || params.ORG_CODE,
            ID_CODE: params.ID_CODE,
            ID_TYPE: params.ID_TYPE,
            CUST_FNAME: params.CUST_FNAME,
            ACCTBIZ_EXCODE: "23"
        }).then(function (res) {
            if (res.Code == "0") {
                let data = res.Data[0];
                if (data && data.ISSAMEFLAG == "true") {
                    return {
                        result: [],
                        flag: true
                    };
                } else {
                    return {
                        result: [],
                        flag: false
                    };
                    //   let errStr = data && data.RESULTSTR || `中登校验失败！`
                    //   that.csdcValidateFaild(errStr.replace(/<br>/g,","));
                }
            } else {
                return {
                    result: [],
                    flag: false
                };
            }
        }).catch(err => {
            return {
                result: [],
                flag: false
            };
        });
    },
    //公安联网校验核心方法
    runPoliceValidate: function (param) {
        var that = this,
            inputObj = _.assign({ REQFLAG: "0" }, param),
            sexText;
        if (param.SEX) {
            return dict.transformDict(param, 'SEX').then(param => {
                sexText = param.SEX_TEXT;
                sexText && (inputObj.SEX = sexText.charAt(0));
                return that.policeValidate(inputObj, param, sexText)
            })
        } else {
            return that.policeValidate(inputObj, param, sexText);
        }
    },
    policeValidate (inputObj, param, sexText) {
        return sysConfig.$syscfg.K_Request("W0000095", inputObj).then(data => {
            if (data.Code != '0') {
                throw JSON.stringify(data);
            }
            if (!data.Data || !data.Data.length) {
                return {
                    result: [],
                    isError: false,
                    flag: true
                }
            }
            var output = data.Data && data.Data[0],
                keyArr = [{
                        name: "证件号码",
                        key: "ID_CODE"
                    },
                    {
                        name: "姓名",
                        key: "USER_NAME"
                    }
                ],
                tmpArr = [],
                flag = true;
            param.SEX && keyArr.push({
                name: "性别",
                key: "SEX"
            });
            param.BIRTHDAY && keyArr.push({
                name: "出生日期",
                key: "BIRTHDAY"
            });

            _.chain(keyArr).each(function (obj) {
                var key = obj.key,
                    inputStr = inputObj[key],
                    outputStr = "ID_CODE" === key ?
                        output[key + "_CHKRLT"] == "一致" ? inputObj[key] : output[key + "_CHKRLT"] :
                        output[key + "_CHKRLT"].replace(/-/g, ""),
                    isEqual = inputStr === outputStr;

                if (!isEqual) {
                    flag = false;
                }

                tmpArr.push({
                    key: key,
                    name: obj.name,
                    input: inputStr,
                    output: outputStr,
                    flag: isEqual,
                });
            }).value();
            return {
                result: tmpArr,
                flag: flag,
                isError: false,
                IMG_DATA: output.IMG_DATA,
            };
        }).catch(err => {
            console.error("policeValidate" + err);
            return {
                flag: false,
                result: err,
                isError: true,
            }
        })
    },
    //同步公安联网校验标志 传入参数param(idType,idCode,fName)
    syncIdCardChkFlag(idType, idCode, fName) {
        let param = {
            ID_CODE: idCode,
            ID_TYPE: idType,
            USER_ROLES: "1" //默认查普通客户
        }
        return sysConfig.$syscfg.K_Request('Y1100010', param).then(res => {
            
            if(res.Code == "0") {
                var chkFlagReqArr = [];
                let data = res.Data;
                _.each(data, obj => {
                    if(obj.USER_NAME == fName) {
                        chkFlagReqArr.push(sysConfig.$syscfg.K_Request('W0000119',{
                            bex_codes:'Y1000025',
                            USER_CODE: obj.USER_CODE,
                            ID_CARD_CHK_FLAG: "1"
                        }));
                    }
                });
                sysConfig.$syscfg.K_Request_ALL(chkFlagReqArr);
            }
        })
    },
    //重点监控账户名单校验
    W0000134 (param) {
        return sysConfig.$syscfg.K_Request('W0000134', param).then(res => {
            return !!res.Data.length;
        });
    },

    //查询黑白名单国籍和地区
    W0000135 (param) {
        return sysConfig.$syscfg.K_Request('W0000135', param).then(res => {
            if (res.Code == "888888") {
                return true;
            }
            return !!res.Data.length;
        });
    },
    /**
     * 根据客户三要素查询是否是重点监控账户
     * @param custObj
     * 客户三要素 姓名，证件类型，证件号码
     * @returns {*}
     */
    getKeyMonitorListByCustInfo (param) {
        return sysConfig.$syscfg.K_Request('W0000119', {
            bex_codes: "KUAS_L1192258",
            USER_NAME: param.USER_NAME,
            ID_CODE: param.ID_CODE,
            ID_TYPE: param.ID_TYPE,
        })
    },
    //获取客户职业信息
    getCustProfessionInfo(custCode) {
        return sysConfig.$syscfg.K_Request('W0000119',{
            bex_codes: "L1160003",
            USER_CODE: custCode,
            OUTPUT_TYPE: "1"
        }).then(function (res) {
            return (res.Data && res.Data[0]) || {};
        });
    },
    //获取客户手机机主信息
    getMobileOwnerInfo(custCode, mobileTel) {
        return sysConfig.$syscfg.K_Request('W0000119',{
            bex_codes: "KUAS_L2100421",
            MOBILE_TEL: mobileTel,
            CUST_CODE: custCode
        }).then(function (res) {
            return (res.Data && res.Data[0]) || {};
        });
    },
    /**
     * 根据客户号、三要素、协议类型获取协议签署信息
     * @param custObj
     * 客户号以及客户三要素 姓名，证件类型，证件号码、协议类型、经办柜员机构
     * @returns {*}
     */
    getAddSignAgreements (param) {
        return sysConfig.$syscfg.K_Request('W0000119', {
            bex_codes: "YGT_A1200012",
            CUST_CODE: param.CUST_CODE || '0',
            USER_NAME: param.USER_NAME,
            ID_CODE: param.ID_CODE,
            ID_TYPE: param.ID_TYPE,
            CUST_AGMT_TYPE: param.CUST_AGMT_TYPE,
            INT_ORG: param.ORG_CODE
        })
    },
    //一站式销户检查
    cancelCheckType (param) {
        return sysConfig.$syscfg.K_Request('YG210021', param).then(data => {
            if (data.Code == '0') {
                return data.Data && data.Data || [];
            } else {
                throw ("一站式销户检查接口调取失败，原因：" + data.Msg);
                return [];
            }
        });
    },

    /**
     * 
     * @param {*} param 
     * @param {*} SPECIAL_FLAG_TYPE 客户标识 01长期不使用 02失联客户
     * @param {*} INT_ORG 客户所属机构
     * @param {*} CUST_CODE   客户代码
     * @description  留痕“已提示客户为‘长期不使用客户’或者‘失联客户’
     */
    W0000201 (param) {
        return sysConfig.$syscfg.K_Request('W0000201', param).then(function (data) {
            if (data.Code == '0') {
                return true;
            } else {
                throw `系统调用账户系统接口L1102335留痕已提示客户失败,原因：${data.Msg}`
                return false;
            }
        });
    },

    /**
     * 获取用户资金账户信息
     * @param {String} custCode
     */
    getCustFundInfo (custCode) {
        return sysConfig.$syscfg.K_Request("W0000191", {
            CUST_CODE: custCode,
            USER_CODE: custCode
        }).then(function (data) {
            if (data.Code == '0') {
                return data.Data && data.Data || [];
            } else {
                throw ("获取用户资金账户信息，原因：" + data.Msg);
                return [];
            }
        })
    },
    /**
     * @description 获取客户的涉税信息数据
     * @param {*} custCode 客户代码
     * @param {*} userType 用户类型
     */
    getCustTaxInfo (custCode, userType) {
        return sysConfig.$syscfg.K_Request("W0000204", {
            CUST_CODE: custCode,
            USER_TYPE: userType
        }).then(function (data) {
            if (data.Code == '0') {
                return data.Data && data.Data || [];
            } else {
                throw ("获取客户的涉税信息数据，原因：" + data.Msg);
                return [];
            }
        })
    },
    /**
     *  @description 查询有效证件类型
     *  @param {*} USER_TYPE 客户类型
     */
    queryValidIDType (USER_TYPE) {
        let params = {
            USER_TYPE: USER_TYPE,
        }
        // IS_PRODUCT_CUST区分是机构还是产品 国信只有(0，1)会将产品2转为机构1
        if (USER_TYPE == '1') {
            params.IS_PRODUCT_CUST = 0;
        }
        if (USER_TYPE == '2') {
            params.IS_PRODUCT_CUST = 1;
        }
        return new Promise((resolve, reject) => {
            sysConfig.$syscfg.K_Request("W0000209", params).then(res => {
                judgeData(res, resolve, reject)
            }).catch(error => {
                reject(error);
            })
        })
    },

    /**
     *  @description 新开户生成新客户代码
     *  @param {*} USER_TYPE 客户类型
     */
    getNewCustCode: (intOrg) => {
        let params = {
            INT_ORG: intOrg
        }
        return new Promise((resolve, reject) => {
            sysConfig.$syscfg.K_Request("W0000192", params).then(res => {
                judgeData(res, resolve, reject)
            }).catch(error => {
                reject(error);
            })
        })
    },
    /**
     *  @description 客户适当性信息查询
     *  @param {*} CUST_CODE 客户代码
     */
    getCustInvestPro: (custCode) => {
        let params = {
            CUST_CODE: custCode
        }
        return new Promise((resolve, reject) => {
            // sysConfig.$syscfg.K_Request("W0000216", params).then(res => {
            sysConfig.$syscfg.K_Request("Y1190082", params).then(res => {
                judgeData(res, resolve, reject)
            }).catch(error => {
                reject(error);
            })
        })
    },
    /**
     * 获取协议参数设置
     * @param 
     * @returns {*}
     */
    getAgmtCfgData: function (custCode) {
        let params = {
            CUST_CODE: custCode
        }
        return new Promise((resolve, reject) => {
            sysConfig.$syscfg.K_Request("W0000230", params).then(res => {
                judgeData(res, resolve, reject)
            }).catch(error => {
                reject(error);
            })
        })
    },


    /**
     * 查询客户交易系统信息，通过账户转发到交易接口。
     * @param custCode 客户代码
     * @param  Lbm  功能LBM号
     * @param params 调用交易的接口入参
     * @returns Object 交易账户信息
     * @dec:Lbm=L3100027( 查询密码状态)、L030100(交易账户信息查询功能)
     */
    getTradeOtherInfoData: (custCode, Lbm, paramsTpl) => {
        let params = _.assign({
            CUST_CODE: custCode,
            GENRPCLBMNO: Lbm
        }, paramsTpl)
        return new Promise((resolve, reject) => {
            sysConfig.$syscfg.K_Request("YG003671", params).then(res => {
                judgeData(res, resolve, reject)
            }).catch(error => {
                reject(error);
            })
        })
    },
    /**
     * 获取证券账户股转标识，系统外客户非中登服务时间默认为false
     * @param params
     * @returns {*}
     */
    getNeeqAcctFlag (params) {
        return new Promise((resolve, reject) => {
            if (_.isEmpty(params) || _.isEmpty(params.TRDACCT)) {
                reject("获取股转账户标识标记类型必须入参TRADACCT");
            }
            let customerInfo = storge.$storage.getJsonSession(definecfg.$definecfg.CUSTOMER_INFO);
            let userInfo = JSON.parse(storge.$storage.getSession(definecfg.$definecfg.USER_INFO));
            let TRDACCT = params.TRDACCT || '';
            csdcService.queryCSDCTime(customerInfo.CUST_FNAME, customerInfo.ID_TYPE, customerInfo.ID_CODE).then(isInCsdcTime => {
                if (isInCsdcTime === 'true') {
                    sysConfig.$syscfg.K_Request("Y3000005", {
                        OPERATOR_TYPE: "0",
                        CHK_STATUS: "2",
                        ZD_OP_CHANNEL: "1",
                        F_OP_USER: userInfo.F_OP_USER_ENC,
                        F_SESSION: userInfo.USER_TICKET_INFO,
                        ACCTBIZ_EXCODE: "27",
                        ACCTBIZ_CLS: "03",
                        INT_ORG: userInfo.ORG_CODE, //柜员机构代码
                        TRDACCT: params.TRDACCT
                    }).then(res => {
                        var flag = res.Data && res.Data[0] && res.Data[0].RTN_ERR_CODE == "0000" && res.Data[0].NEEQ_FLAG == "1" ? "1" : "0";
                        resolve(flag);
                    }).catch(error => {
                        var flag = "1";
                        resolve(flag);
                    })
                } else {
                    // 外部客户，非中登服务时间，直接默认无股转账户标识，V0135北交所，非中登时间也默认无股转标识 
                    if (params.EXT_CUST_FLAG) {
                        resolve("0");
                        return
                    }
                    sysConfig.$syscfg.K_Request("W0000119",{
                        bex_codes: "KUAS_L1192269",
                        TRDACCT: TRDACCT
                    }).then(res => {
                        var flag = res.Data && res.Data[0] && res.Data[0].NEEQ_FLAG == "1" ? "1" : "0";
                        resolve(flag);
                    }).catch(error => {
                        reject(error);
                    })
                }
            })
        })
    },
    /**
     * 查询客户证券账户  返回结果包含主辅标志
     * @param custCode
     * */
    getCustTrdacct: function (custCode){
        return sysConfig.$syscfg.K_Request("Y2001050",{
            CUST_CODE: custCode,
            CUSTOMER: custCode
        }).then(function(data){
            return data.Data || [];
        })
    },
    /**
     *  查询证券账号股转标识
     *  @param {Array} trdacctData 证券账号数组
     *  @param {Boolean} extCustFlag 是否为外来客户 默认为false
     */
    getNeeqFlagForCsdc: function (trdacctData, extCustFlag) {
        let that = this;
        return new Promise((resolve,reject)=>{
            var proArray = [],
                proResultArr = [],
                resultObj = {
                    GZ_TRDACCT_DATA: [],
                    NEEQ_FLAG_FOR_CSDC: "0"
                };
            trdacctData = Array.from(new Set(trdacctData));
            // 需要排除股转A、股转B使用相同配号的情况
            trdacctData = _.chain(trdacctData).compact().uniq().value();
            // 入参是空，返回0
            if (_.isEmpty(trdacctData)) {
                resolve(resultObj);
            }
            _.each(trdacctData, trdacct => {
                proArray.push(new Promise((resolve, reject) => {
                    that.getNeeqAcctFlag({
                        TRDACCT: trdacct||[],
                        EXT_CUST_FLAG: extCustFlag || false,
                        // CSDC_ACCT_LIST: csdcTrdacctArr
                    }).then(flag => {
                        proResultArr.push({
                            TRDACCT: trdacct,
                            NEEQ_FLAG: flag
                        });
                        resolve();
                    }).catch(error => {
                        console.error(error);
                        reject(error);
                    })
                }))
            })
            return Promise.all(proArray).then(function () {
                // 过滤出无股转账户标识的股转账户，需要避免
                resultObj.GZ_TRDACCT_DATA = _.chain(proResultArr).filter(function (obj) {
                    return obj.NEEQ_FLAG == "0";
                }).map(function (obj) {
                    return obj.TRDACCT
                }).value();
                // 若存在需要新增股转标识的则需要采集表单
                resultObj.NEEQ_FLAG_FOR_CSDC = resultObj.GZ_TRDACCT_DATA.length ? "1" : "0";
                resolve(resultObj);
            })
        })
    },
    /**
     * 获取股转账户标识原因
     * @param obj
     * @returns {*}
     */
    getNeeqFlagForCsdcReason: function(obj) {
        if(_.isEmpty(obj) || !obj.NEEQ_FLAG_FOR_CSDC_REASON || obj.NEEQ_FLAG_FOR_CSDC_REASON == "-1"){
            return "";
        }
        return obj.NEEQ_FLAG_FOR_CSDC_REASON.trim();
    },
    getExtParam: function (CUST_CODE) {
        return sysConfig.$syscfg.K_Request("Y2001010", {
            CLEARUP_PRV: "1",
            EXT_CUST_CODE: CUST_CODE,
        })
            .then(function (data) {
                var extAvgAsset,
                    extTotalAsset,
                    extCreditAsset,
                    extAcctAsset,
                    extTolalAssetCredit,
                    extOtcAsset,
                    extTotalAssetGz,
                    avgAssetBroker,
                    avgAssetOpt,
                    avgAssetKcb,
                    avgAssetJjyw,
                    funStatusKcb1,
                    funStatusKcb2,
                    avgAssetHk,
                    extTotalUfpAsset,
                    bizDate;
                if (data && data.Data && data.Data[0]) {
                    extAvgAsset = data.Data[0].AVG_ASSET;
                    extTotalAsset = data.Data[0].TOTAL_ASSET;
                    extCreditAsset = data.Data[0].CREDIT_ASSET;
                    extAcctAsset = data.Data[0].ACCT_ASSET;
                    extTolalAssetCredit = data.Data[0].TOTAL_ASSET_CREDIT;
                    extOtcAsset = data.Data[0].OTC_ASSET;
                    extTotalAssetGz = data.Data[0].TOTAL_ASSET_GZ;
                    avgAssetBroker = data.Data[0].AVG_ASSET_BROKER;
                    avgAssetOpt = data.Data[0].AVG_ASSET_OPT;
                    avgAssetHk = data.Data[0].AVG_ASSET_HK;
                    avgAssetKcb = data.Data[0].ASSET_AVG20_KCB;
                    avgAssetJjyw = data.Data[0].ASSET_AVG5_JJYW;
                    funStatusKcb1 = data.Data[0].KCB_FUND_STATUS_NO1;
                    funStatusKcb2 = data.Data[0].KCB_FUND_STATUS_NO2;
                    extTotalUfpAsset = data.Data[0].TOTAL_UFP_ASSET;
                    bizDate = data.Data[0].BIZ_DATE;
                } else {
                    extAvgAsset = 0;
                    extTotalAsset = 0;
                    extCreditAsset = 0;
                    extAcctAsset = 0;
                    extTolalAssetCredit = 0;
                    extOtcAsset = 0;
                    extTotalAssetGz = 0;
                    avgAssetBroker = 0;
                    avgAssetOpt = 0;
                    avgAssetHk = 0;
                    avgAssetKcb = 0;
                    avgAssetJjyw = 0;
                    funStatusKcb1 = "";
                    funStatusKcb1 = "";
                    extTotalUfpAsset = 0;
                    bizDate = null;
                }
                return {
                    EXT_AVG_ASSET: extAvgAsset,
                    EXT_TOTAL_ASSET: extTotalAsset,
                    EXT_CREDIT_ASSET: extCreditAsset,
                    EXT_ACCT_ASSET: extAcctAsset,
                    TOTAL_ASSET_CREDIT: extTolalAssetCredit,
                    EXT_OTC_ASSET: extOtcAsset,
                    TOTAL_ASSET_GZ: extTotalAssetGz,
                    AVG_ASSET_BROKER: avgAssetBroker,
                    AVG_ASSET_OPT: avgAssetOpt,
                    AVG_ASSET_HK: avgAssetHk,
                    ASSET_AVG20_KCB: avgAssetKcb,
                    ASSET_AVG5_JJYW: avgAssetJjyw,
                    KCB_FUND_STATUS_NO1: funStatusKcb1,
                    KCB_FUND_STATUS_NO2: funStatusKcb2,
                    EXT_TOTAL_UFP_ASSET: extTotalUfpAsset,
                    BIZ_DATE: bizDate,
                };
            });
    },
    //获取客户信息
    getCustInfo (_this, param) {

        let that = _this;
        return new Promise((resolve, reject) => {
            if (!param.CUST_CODE || that.$syscfg.isOpenAcctBiz(param.BUSI_CODE)) {
                resolve({
                    BASIC_INFO: _.pick(param, ['CUST_FNAME', 'CUST_NAME', 'ID_TYPE', 'ID_CODE', 'USER_TYPE', 'ORG_CODE']),
                });
            }
            that.$syscfg.K_Request("W0000004", { IDENT_CODE: param.CUST_CODE, checkPwdFlag: "0" }).then(response => {
                if (response.Code != "0" || _.get(response, "Data[0].loginResult.loginFlag") == "0") {
                    reject({ message: response.loginResult && response.loginResult.loginErrorMsg || "客户数据获取失败" })
                } else {
                    let data = response.Data && response.Data[0];
                    if (data && data.custAllInfo && data.custAllInfo.BASIC_INFO) {
                        resolve(data.custAllInfo);
                    } else {
                        reject({ message: "客户数据为空!" });
                    }
                }
            })
        })
    },
    getYinHeCustAssetsData (param) {
        let serviceCode = param.QUERY_RT_ASSET === "1" ? "QS000035" : "QS000002";
        return sysConfig.$syscfg.K_Request(serviceCode, param).then(res => {
            if (res.Code == "0") {
                return res.Data && res.Data[0] || {};
            }
        }).catch(e => {
            console.error(e + "银河证券个性化-查询客户资产失败：QS000002");
        })
    },
    //银河个性化：客户个股期权征信指标查询(来源数据中心，主要用于查询客户首个沪A指定交易日期，风险测评日期等)
    getCustStockOptionCreditRatingByCrm(_this, param) {
        return _this.$syscfg.K_Request("QS000005", param).then(res => {
            if (res.Code == "0") {
                return res.Data && res.Data[0] || {};
            }
        }).catch(e => {
            console.error(e + "客户个股期权征信指标查询：QS000005");
        })
    },
      /**
     * 功能描述：用于华林证券查询他们的CRM(集中服务平台)查港股权限开通与分级基金资产
     * 对接系统：华林证券，CRM(集中服务平台)
     */
    getHuaLinCustAssetsData(CUACCT_CODE){
        return sysConfig.$syscfg.K_Request("W0000119",{
            bex_codes: "WS_91100737",
            CUACCT_CODE
        }).then(res => {
            if (res.Code == "0") {
                return res.Data && res.Data[0] || {};
            }
        }).catch(e => {
            console.error(e + "银河证券个性化-查询客户资产失败：QS000002");
        })
    },
    getCustFundInfo(custCode, params) {
        return sysConfig.$syscfg.K_Request("YG003661", _.extend({}, {
            USER_CODE: custCode,
            CUST_CODE: custCode
        }, params)).then(res => {
            return res.Data || []
        }).catch(err => {
            console.error(err)
        })
    },
     /**
     * 通过股东账号查询股东信息
     */
    getCustAccountByTrdacct (_this, param){
        if (!param.CUST_CODE && !param.TRDACCT) {
            _this.$blMethod.showMsgbox(_this, "客户代码与股东账号不可同时为空");
            return { Code:'-1',msg:"客户代码与股东账号不可同时为空"}
        }
        return new Promise((resolve) => {
            sysConfig.$syscfg.K_Request("YG003663", {
                CUST_CODE: param.CUST_CODE || "",
                TRDACCT:param.TRDACCT,
                STKEX:param.STKEX || "",
                STKBD: param.STKBD || ""
            }).then(res => {
                resolve(res);
            }).catch(error => {
                console.error(error);
            })
        })
    },
    /**
     * 获取用户证券账户信息
     */
    getCustAccountInfo(custCode, params) {
        return sysConfig.$syscfg.K_Request("YG003663", Object.assign({
            USER_CODE: custCode,
            CUST_CODE: custCode
        }, params)).then(res => {
            return res.Data || []
        }).catch(err => {
            console.error(err)
            throw new Error("获取用户证券账户信息异常")
        })
    },
        /**
     * 长城个性：获取交易净资产
     * @param params
     * @param custCode
     * @returns {*}
     */
    getTradeAsset(custCode,intOrg){
        return sysConfig.$syscfg.K_Request("W0000119",  {
            bex_codes:"YGT_A1160120",
            INT_ORG:intOrg,
            CUST_CODE:custCode,
            CUACCT_CODE:"",
            CURRENCY:"0",
            FISL:""
        }).catch(e => {
            console.error(e + "获取交易净资产失败");
        })
    },
        /**
     * 长城个性：获取两融净资产
     * @param params
     * @param custCode
     * @returns {*}
     */
     getRzrqAsset(custCode,intOrg){
        return sysConfig.$syscfg.K_Request("W0000119",  {
            bex_codes:"YGT_A1160120",
            INT_ORG:intOrg,
            CUST_CODE:custCode,
            CUACCT_CODE:"",
            CURRENCY:"0",
            FISL:"1"
        }).catch(e => {
            console.error(e + "获取交易净资产失败");
        })
    },
    /**
     * 长城个性：获取OTC净资产
     * @param params
     * @param custCode
     * @returns {*}
     */
     getOtcAsset(custCode,cuacctCode){
        return sysConfig.$syscfg.K_Request("W0000119",  {
            bex_codes:"YGT_L0001050",
            GENRPCLBMNO: "L6000397",
            CUST_CODE: custCode,
            CUACCT_CODE:cuacctCode,
            CURRENCY:0
        }).catch(e => {
            console.error(e + "获取otc资产失败");
        })
    },
        /**
     * 长城个性：获取期权净资产
     * @param params
     * @param custCode
     * @returns {*}
     */
    getOptionAsset(custCode,intOrg){
        return sysConfig.$syscfg.K_Request("W0000119",  {
            bex_codes: "YGT_L0001050",
            GENRPCLBMNO: "L6012534",
            CUST_CODE: custCode,
            INT_ORG:intOrg,
            OPT_FLAG:1,
            CURRENCY:0
        }).catch(e => {
            console.error(e + "获取获取期权净资产失败");
        })
    },    
    /**
     * 查询用户视频业务流水信息
     * @param videoCls
     * @param custCode
     * @returns {*}
     */
    queryVideoRecord(videoCls, custCode, sysDate){
        return sysConfig.$syscfg.K_Request("W0000119",  {
            bex_codes: "KUAS_1192166",
            VIDEO_CLS: videoCls,
            CUST_CODE: custCode
        }).then(res=>{
            let data = res.Data;
            if(data.length){
                var validDate = data[0].VALID_DATE == "0" ? "30001231" : data[0].VALID_DATE;
                return utils.compareDate(validDate, sysDate) != -1 ? "1" : "0";
            }else{
                return "0";
            }
        }).catch(e => {
            console.error(e + "获取otc资产失败");
        })
    },
    /**
     * 查询全市场全量 投资者适当性管理信息
     * @param params
     * @returns {*}
     */
    getAllMarketQualification(params) {
        return sysConfig.$syscfg.K_Request('Y3000001', _.extend({LBM: 'L1190216'}, params)).then(res => {
            return res.Data || null;
        })
    },
    /**
     * 查询全市场增量 投资者适当性管理信息
     * @param params
     * @returns {*}
     */
    getGrowMarketQualification(params) {
        return sysConfig.$syscfg.K_Request('Y3000001', _.extend({LBM: 'L1190072'}, params)).then(res => {
            return res.Data || null;
        })
    },

    getInvestorSource(custCode, params) {
        return sysConfig.$syscfg.K_Request('Y1192198', _.extend({CUST_CODE: custCode, AUTO_UPD_TYPE: '1'}, params)).then(res => {
            return res.Data;
        })
    },
    /*
     *@Description: 通过客户号获取法人信息
     *@MethodAuthor: LJC
     *@Date: 2020-11-25 14:04:43
    */
    getLegalInfo(params) {
        return sysConfig.$syscfg.K_Request('W0000119', {
            bex_codes: 'L1160012',
            USER_CODE: params.CUST_CODE,
            TAB_CODE: 'USER_EXT_INFO',
            FLD_CODE: 'CORP_INFO',
            PKG_TYPE: '1'
        }).then(res => {
            return res.Data;
        });
    },
    /*
     *@Description: 获取代理人信息
     *@MethodAuthor: LJC
     *@Date: 2020-11-25 14:08:54
    */
    getAgentInfo(params) {
        return sysConfig.$syscfg.K_Request('Y3000021', {
            CUST_CODE: params.CUST_CODE
        }).then(res => {
            return _.filter(res.Data || [], function(obj) {
                return obj.AGT_STATUS != "9";
            });
        })
    },
    /**
     * 获取客户银证签约信息
     * @param custCode 客户代码
     * @param params 入参对象 {CUACCT_CODE：资产帐户，FISL：查询接融资融券系统（1-查询接融资融券系统），OPT_FLAG：查询对接个股}
     * @param refreshFlag 刷新标志
     * @returns Array 客户签约信息
     */
    getCustBankSignInfo(custCode, params) {
        return sysConfig.$syscfg.K_Request('YG003669', _.extend({
            USER_CODE: custCode,
            CUST_CODE: custCode
        }, params || {}));
    },
    /**
     * 获取客户签署协议信息
     * 调用账户接口 L1160109：客户签署协议查询
     * @param custCode 客户代码
     * @param agmtType  协议类型  数据字典：CUST_AGMT_TYPE
     * @param params 扩展参数 {REMOTE_SYS:对接远程系统,CUACCT_CODE:资产账户,STKBD:交易板块,TRDACCT:交易账户}
     */
    getCustAgmtData2(custCode, agmtType, params) {
        return sysConfig.$syscfg.K_Request('YG003668', _.extend({
            CUST_AGMT_TYPE: agmtType,
            CUST_CODE: custCode
        }, params || {}));
    },
    /**
     * 根据客户三要素，查询已开通某个协议的证券账户（可以根据客户三要素查询到一人多户的数据）
    */
    queryCustAgmtData(params) {
        return sysConfig.$syscfg.K_Request('Y3000001', Object.assign({
            LBM: "YGT_A1190241"
        },params)).then(res => {
            return res.Data || [];
        }).catch(err => {
            console.error(err);
            throw new Error("根据客户三要素，查询已开通某个协议的证券账户异常")
        })
    },
    /**
     * 查询【协议参数设置】菜单配置
     */
    queryProtoParamSet(params) {
        return sysConfig.$syscfg.K_Request("Y3000001", Object.assign({
            LBM: "YGT_A1000003",
            F_FUNCTION: "100100005",
            TAB_CODE: "AGMT_CFG"
        }, params)).then(res => {
            return res.Data || [];
        }).catch(err => {
            console.error(err);
            throw new Error("查询【协议参数设置】菜单配置异常")
        })
    },
    /**
     * 获取客户银证要素信息
     * @param custCode 客户代码
     * @param mainCuact 主资金账户
     * @param cuacctAttr 扩展属性
     * @param params 入参对象
     */
    getCustSignAcctInfo(custCode, mainCuact, cuacctAttr, params) {
        return sysConfig.$syscfg.K_Request('YG003669', _.extend({
            USER_CODE: custCode,
            CUST_CODE: custCode,
            ALL_FLAG: "1"
        }, params || {})).then(data => {
            let signArr = _.filter(data.Data, item => {
                return item.CONTRACT_STATUS != "9";
            }), signObj, resSignObj = {}

            signObj = signArr && signArr[0];
            if (!_.isEmpty(signObj)) {
                let valFalg = true;
                _.each(signObj, function(val, key){
                    if((_.indexOf(["CUST_NAME","ID_TYPE","ID_CODE"], key) > -1 && _.trim(val) == "") || (key == "ID_EXP_DATE" && (val == "0" || _.trim(val) == ""))){
                        valFalg = false;
                        return false;
                    }
                });
                resSignObj = {
                    BSB_USER_FNAME: signObj.CUST_NAME,
                    BSB_ID_TYPE: signObj.ID_TYPE,
                    BSB_ID_CODE: signObj.ID_CODE,
                    BSB_ID_EXP_DATE: (signObj.ID_EXP_DATE == "0" || signObj.ID_EXP_DATE == "") ? "" : signObj.ID_EXP_DATE
                };
                if(valFalg){
                    return resSignObj;
                }
            }
            return sysConfig.$syscfg.K_Request('Y3000001', {
                LBM: "YGT_A1160012",
                USER_CODE: custCode,
                FLD_CODE:"EXTEND_INFO",
                TAB_CODE:"USER_EXT_INFO",
                PKG_TYPE: "1"
            }).then(res => {
                let obj = _.get(res, "Data[0]", {}),
                    tempBsbIdExpDate = resSignObj.BSB_ID_EXP_DATE || obj.BSB_ID_EXP_DATE;
                return {
                    BSB_USER_FNAME: resSignObj.BSB_USER_FNAME || obj.BSB_USER_FNAME,
                    BSB_ID_TYPE: resSignObj.BSB_ID_TYPE || obj.BSB_ID_TYPE,
                    BSB_ID_CODE: resSignObj.BSB_ID_CODE || obj.BSB_ID_CODE,
                    BSB_ID_EXP_DATE: (tempBsbIdExpDate == "0" || tempBsbIdExpDate == "") ? "" : tempBsbIdExpDate
                };
            })
        });
    },
    getCustFundAssetInfo(custCode, params) {
        return sysConfig.$syscfg.K_Request('YG003662', _.extend({
            USER_CODE: custCode,
            CUST_CODE: custCode
        }, params || {}));
    },
    /**
     * 获取新的资产账户代码
     */
    getNewCuacctCode(param) {
        return sysConfig.$syscfg.K_Request('Y1202006', {
            INT_ORG: param.INT_ORG,
            CUACCT_CODE: param.CUACCT_CODE,
            CUACCT_USES: param.CUACCT_USES
        });
    },
    validateCustPwd(custCode, params) {
        return sysConfig.$syscfg.K_Request('Y3000201', _.extend({
            CUST_CODE: custCode
        }, params || {}));
    },
    // 获取客户反洗钱等级及 风险信息
    getCustAmlLvlInfo(custCode) {
        return sysConfig.$syscfg.K_Request("W0000119", {
            bex_codes: "YGT_A1160103",
            CUST_CODE: custCode
        }).then(res => {
            return _.get(res, "Data[0]", {});
        })
    },
    getCustAccountStockInfo(custCode, params) {
        return sysConfig.$syscfg.K_Request("YG003664", _.extend({
            USER_CODE: custCode,
            CUST_CODE: custCode
        }, params || {})).then(res => {
            return _.get(res, "Data[0]", {})
        })
        
    },
    getCustYZTInfo(param) {
        //禁止批量查询,客户代码和三要素不能同时为空
        if (!param.CUST_CODE && !param.CUST_FNAME) {
            return [];
        }
        return sysConfig.$syscfg.K_Request("W0000119", {
            bex_codes: "YGT_A0001000",
            QUERY_MODE: "QUERY",
            SUMMARY_FLAG: "",
            F_FUNCTION: "351500285",
            INT_ORGES: param.INT_ORGES || "0",
            CUST_CODE: param.CUST_CODE || -1,
            USER_NAME: param.CUST_FNAME || "",
            ID_TYPE: param.ID_TYPE || "",
            ID_CODE: param.ID_CODE || "",
            PAGE_RECNUM: "",
            PAGE_RECCNT: "100"
        }).then(res => {
            return _.get(res, "Data", []);
        })
    },
    esbSuccess(code) {
        return code == "0000"
    },
    getCrmInfo(param) {
        // 先取缓存系统公参
        let VTM_VERIFY_POST_TEXT = oppService.getSysCommonParamsFromCacheObjs("VTM_VERIFY_POST_TEXT") || "技术经理岗,合规经理";
        let VTM_VERIFY_POST_ARR = VTM_VERIFY_POST_TEXT.split(",")
        return sysConfig.$syscfg.K_Request("W9900015", {
            STAFF_CODE: param.STAFF_CODE
        }).then(res => {
            let code = _.get(res, "Data[0].meta.code", "");
            let data = _.get(res, "Data[0].data", []);
            // 查询成功
            if (this.esbSuccess(code)) {
                // 循环判断 data 中的数据，如果存在
                let isPassFlag = true;
                let msg = "";
                if (data.length > 0) {
                    let forbidPost =  _.find(data, item => {
                        // 员工状态
                        let EmpStsCode = item.EmpStsCode;
                        // 员工的岗位
                        let EmpUposName = item.EmpUposName;
                        return VTM_VERIFY_POST_ARR.indexOf(EmpUposName) > -1 && EmpStsCode == "001"
                    })
                    if (!_.isEmpty(forbidPost)) {
                        return {
                            verifyFlag: false,
                            message: "您输入的服务人岗位不满足业务认证要求",
                            data: data
                        }
                    }
                    let noramlPost = _.find(data, item => {
                        // 员工状态
                        let EmpStsCode = item.EmpStsCode;
                        return EmpStsCode == "001"
                    })
                    if (!_.isEmpty(noramlPost)) {
                        return {
                            verifyFlag: true,
                            data: data
                        }
                    } else {
                        // 需要等岗位字段
                        return {
                            verifyFlag: false,
                            message: "您输入的服务人代码状态不正常",
                            data: data
                        };
                    }
                } else {
                    // 需要等岗位字段
                    return {
                        verifyFlag: false,
                        message: "请您输入正确的8位服务人代码",
                        data: data
                    };
                }
            } else {
                return {
                    verifyFlag: false,
                    message: "查询服务人员代码失败，请重试",
                    data: _.get(res, "Data[0]", {})
                };
            }
        })
    },
    /**
     * 附件上传
     */
    annexUpload(params) {
        return sysConfig.$syscfg.K_Request("W9900016", {
            BASE64: params.BASE64,
            FILE_NAME: params.FILE_NAME,
            FILE_TYPE: params.FILE_TYPE,
        }).then(res => {
            // 这个地方需要获取到id
            let code = _.get(res, "Data[0].meta.code", "");
            let data = _.get(res, "Data[0].data", {});
            if (this.esbSuccess(code)) {
                // 附件id
                return {
                    AssocId: data.AssocId
                }
            } else {
                // 上传失败
                return false;
            }
        })
    },
    /**
     * 发送邮件
     */
    satatmentEmail(params) {
        return sysConfig.$syscfg.K_Request("W9900017", {
            fromMail: "yhzqvtm@chinastock.com.cn",
            sendMail: params.sendMail || "",
            copyMail: params.copyMail || "",
            mailTitle: params.mailTitle || "",
            mailContent: params.mailContent || "",
            annexId: params.annexId || "",
        }).then(res => {
            console.log("==========发送邮件=============")
            console.log(res)
            let code = _.get(res, "Data[0].meta.code", "");
            let data = _.get(res, "Data[0].data", {});
            if (this.esbSuccess(code)) {
                // 附件id
                return {
                    MsgId: data.MsgId
                }
            } else {
                // 发送失败
                return false;
            }
        })
    }
}

function judgeData (res, resolve, reject) {
    if (res && res.Code && res.Code === '0') {
        resolve(res.Data || []);
    } else {
        let msg = res.Msg || '系统出错'
        reject(msg);
    }
}
