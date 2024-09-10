import custService from "../../../../../service/cust-service"
import dict from "../../../../../tools/dict"
// 智能定投协议开通公共接口模块
export default {
    // 查询资金账户信息
    queryFundAcctAllInfo(_this, params) {
        return _this.$syscfg.K_Request('W0000119', {
            bex_codes: 'KSPB_120252',
            ORGID: params.ORG_CODE,
            FUNDID: params.CUACCT_CODE,
            MONEYTYPE: params.MONEYTYPE
        }).then(res =>{ 
            let cuacctInfo = _.get(res, "Data[0]", {});
            return dict.transformDict(cuacctInfo, [{ "STATUS": "Bzhzt" }, { "CUSTSTATUS": "Bzhzt" }]).then(transData => {
                return {
                    fundAcctAllInfo: transData,
                    cuacctInfo: cuacctInfo
                }
            });
        }).catch(err => {
            console.error(err)
            throw new Error("查询资金账户信息异常")
        })
    },
    // 查询基金公司
    getTacodeData(_this, params) {
        return _this.$syscfg.K_Request("YG210022", {
            TACODE: "-1" //返回全部
        }).then(res => {
            // tacodeArr
            return {
                tacodeArr: res.Data || []
            } 
        }).catch(err => {
            console.error(err)
            throw new Error("查询基金公司异常")
        })
    },
    // 获取所有的基金公司 与 getTacodeData 返回的数据结构信息存在不同
    getFundsData(_this, params) {
        return _this.$syscfg.K_Request("Y3000001", {
            LBM: 'YGT_A0063001',
            F_FUNCTION: '102001000',
            ORG_TYPE: '3'
        }).then(res => {
            // fundsData
            return res.Data || []
        }).catch(err => {
            console.error(err)
            throw new Error("获取所有的基金公司异常")
        })
    },
    // 基金改造了 后面方法弃用
    // 查询基金代码
    getOfcodeData(_this, params) {
        return _this.$syscfg.K_Request("YG210023", {
            TACODE: ""
        }).then(res => {
            // ofcodeArr 
            return {
                ofcodeArr: res.Data || []
            }
        }).catch(err => {
            console.error(err)
            throw new Error("查询基金代码异常")
        })
    },
    getOfcodeCacheData(_this, params) {
        return _this.$syscfg.K_Request("W0000001", {
            YGT_SERVICE_CODE: "F0900028",
            CACHE_CODE: "ofCodeInfoCache"
        }).then(res => {
            // ofcodeArr 
            return {
                ofcodeArr: res.Data || []
            }
        })
    },
    // 获取客户已开通的基金公司
    getHasFundData(_this, params) {
        return _this.$syscfg.K_Request("Y3000038", {
            CUST_CODE: params.CUST_CODE
        }).then(res => {
            // hasFundData
            return res.Data || []
        }).catch(err => {
            console.error(err)
            throw new Error("获取客户已开通的基金公司异常")
        })
    },
    // 查询智能定投协议信息
    queryIntelDecProInfo(_this, params) {
        return _this.$syscfg.K_Request('W0000119', _.extend({
            bex_codes: 'KSPB_240163',
        }, params)).then(res => {
            return res.Data || []
        }).catch(err => {
            console.error(err)
            throw new Error("查询智能定投协议信息异常")
        })
    },
    // 获取已经开通定投协议的基金公司信息
    getHasOpenIntelInfo(_this, params) {
        return Promise.all([
            this.getHasFundData(_this, params),
            this.getFundsData(_this, params),
        ]).then(res => {
            let hasFundsData = res[0],
                fundsData = res[1];
            let tmpArr = [], proArray = [];
            _.each(hasFundsData, function (v) {
                var obj = _.find(fundsData, function (item) {
                        return v.TA_CODE === ((item.ORG_CODE | 0) + '');
                    }) || {};
                tmpArr.push(_.extend({}, v, {TA_NAME: obj.ORG_NAME}));
            });
            let hasOpenTaCodeArr = _.sortBy(tmpArr,"TA_CODE") || [];
            _.each(tmpArr, obj => {
                proArray.push(this.queryIntelDecProInfo(_this ,{  //获取已开通定投协议
                    ORGID : params.ORG_CODE,
                    FUNDID : params.CUACCT_CODE,
                    TACODE : obj.TA_CODE,
                    TRANSACC : "",
                    OFCODE : "",
                    ORDERDATE : "-1",
                    SNO : "-1",
                    SENDSN : "",
                    CUSTID : "-1",
                    TAACC : "",
                    OVERKINDS : params.OVERKINDS || "0,1,2"
                }));
            });
            return Promise.all(proArray).then(res => {
                let tempList = [];
                _.each(res, function (obj) {
                    if (!_.isEmpty(obj)) {
                        tempList = _.union(tempList, obj);
                    }
                });
                return tempList && dict.transformDict(tempList,[{"SENDDAY": "Njjwtfs"}]).then(tempListArr => {
                    _.each(tempListArr, function (v) {
                        let obj = _.find(fundsData || [], function (item) {
                                return v.TACODE === ((item.ORG_CODE | 0) + '');
                            }) || {};
                        v.TANAME = obj.ORG_NAME;
                        if (v.OVERKIND === "1") {
                            v.OVERPARAMAMT = parseFloat(v.OVERPARAMAMT)
                        } else {
                            v.OVERPARAMAMT = parseFloat(v.OVERPARAMAMT).toFixed(2);
                        }
                        
                        //期满参数/协议期限根据期满种类显示不同的值
                        v.TEMPVALUE1 = v.OVERKIND === "0" ? v.ENDDATE : v.OVERPARAMAMT;
                        //周期发送日
                        v.TEMPVALUE2 = v.ACTIONMODE === "3" ? v.SENDDAY_TEXT : v.SENDDAY;
                    });
                    return {
                        hasOpenTaCodeArr,
                        quotaApplyArr: tempListArr
                    };
                })
            })
        })
    },
    // 获取智能定投字典数据
    getDictData(_this, params) {
        //Nznkkzq-智能定投扣款周期
        return dict.getDictData("Nznkkzq").then(function (data) {
            return {
                actionModeDictData: data.Nznkkzq || []
            }
        }).catch(err => {
            console.error(err)
            throw new Error("获取智能定投扣款周期字典异常")
        });
    },
    getFundDict() {
        return dict.getDictData(["Nqmzl"]).then(data => {
            return {
                fundProDict: data
            }
        }).catch(err => {
            console.error(err)
            throw new Error("获取基金适当性信息字典异常")
        })
    },
    // 获取OTC的产品信息
    getOtcProInfo(_this) {
        return _this.$syscfg.K_Request("Y2612014", {}).then(res => {
            return {
                otcProInfo: res.Data || []
            }
        }).catch(err => {
            console.error(err)
            throw new Error("获取OTC的产品信息异常")
        })
    },
    //查询特殊机构设置
    getSpecialOrgSetting(_this) {
        return _this.$syscfg.K_Request("W0000119", {
            bex_codes: "YGT_A1000003_org",
            TAB_CODE: "SPEC_ORG",
            F_FUNCTION: "707001001"
        }).then(res => {
            //只取登记机构
            let specialOrg = _.filter(res.Data, function (obj) {
                return obj.SPEC_ORG_TYPES === "1";
            });
            return {
                specialOrg
            }
        })
    },
    // 查询OTC登记机构
    getOtcOrg(_this, specialOrg = []) {
        return _this.$syscfg.K_Request("Y3000016", {
            SPEC_ORG_TYPE: "1"
        }).then(res => {
            if (!_.isEmpty(res.Data)) {
                //根据特殊机构设置：过滤掉“基金公司”且“基金开户发送标识”不为“1”的登记机构
                let otcOrg = _.filter(res.Data, function (item) {
                    let specialOrg = _.find(specialOrg, function (v) {
                        return v.SPEC_ORG_CODE === item.SPEC_ORG_CODE;
                    });
                    //未找到特殊机构配置/非“基金公司”/“基金开户发送标识”为“1”，不过滤
                    if (!specialOrg || specialOrg.TA_ORG_CLS !== "3" || specialOrg.REMOTE_FLAG === "1") {
                        return true;
                    }
                    //返回REMOTE_FLAG为1的登记机构
                    return item.REMOTE_FLAG === "1";
                });
                return {
                    otcOrgInfo: otcOrg || []
                }
            } else {
                return {
                    otcOrgInfo: []
                }
            }
        }).catch(err => {
            console.error(err)
            throw new Error("查询OTC登记机构异常")
        })
    },
    // 获取已开通的登记账户
    getOtcHasRegisterTaAcct(_this, params) {
        return _this.$syscfg.K_Request("Y3006003", {
            CUST_CODE: params.CUST_CODE,
            CUACCT_CODE:'',
            OTC_CODE:'',
            TRANS_ACCT:''
        }).then(res => {
            return res.Data || []
        }).catch(err => {
            console.error(err)
            throw new Error("获取已开通的OTC登记账户异常")
        })
    },
    // 获取OTC登记机构 与getOtcOrg数据信息不同
    getOtcRegisterTaAcct(_this, params) {
        return _this.$syscfg.K_Request("W0000119", {
            bex_codes:'L1160813',
            SPEC_ORG_TYPE:'1'
        }).then(res => {
            return res.Data || []
        }).catch(err => {
            console.error(err)
            throw new Error("获取OTC登记机构异常")
        })
    },
    getOtcTaAcct(_this, params) {
        return Promise.all([
            this.getOtcHasRegisterTaAcct(_this, params),
            this.getOtcRegisterTaAcct(_this)
        ]).then(res => {
            let hasRegisterOrg = res[0],
                registerOrg = res[1] || [];
            //有效登记账户
            let trdArr = hasRegisterOrg && _.filter(hasRegisterOrg,obj => {
                return obj.ACCT_STAT != '9';
            }), tmpOrgArr=[];
            return dict.transformDict(trdArr, [
                "ACCT_STAT"
            ]).then(data => {
                //已开登记机构翻译
                _.each(data, v => {
                    var obj = _.find(registerOrg, function (item) {
                        return v.OTC_CODE == item.SPEC_ORG_CODE;
                    });
                    obj && tmpOrgArr.push(_.extend({}, v, {ORG_NAME:obj.SPEC_ORG_FNAME||''},{TA_CODE:v.OTC_CODE},{TA_NAME_TEXT:obj.SPEC_ORG_FNAME||""},{IS_REGISTER:true},{OFACCT:v.OTC_ACCT},{OF_TRDACCT:v.TRANS_ACCT},{OFACCT_STATUS_TEXT:v.ACCT_STAT_TEXT},{OFACCT_STATUS:v.ACCT_STAT}));
                });
                return {
                    otcInfo: tmpOrgArr,
                    registerOrg
                }
            });
        })
    },
    // 查询客户OTC的已签署定投协议
    getAutoInvestAgr(_this, params) {
        return _this.$syscfg.K_Request("Y2620137", {
            CUST_CODE: params.CUST_CODE
        }).then(res => {
            return res.Data && dict.transformDict(res.Data,[{"CYCLE_SEND_DAY": "Njjwtfs"}]).then(tempListArr => {
                return {
                    autoInvestAgr: _.filter(tempListArr, function (obj) {
                        return obj.TRD_ID == "115" && obj.AGR_STAT != "3";//交易类别：115-定投；协议状态：3-已撤销
                    })
                }
            });
        }).catch(err => {
            console.error(err)
            throw new Error("查询客户OTC的已签署定投协议异常")
        })
    },
    // 获取OTC系统的客户产品限额设置
    getOtcSetProInfo(_this, params) {
        return _this.$syscfg.K_Request("Y2612039", {}).then(res => {
            return {
                otcSetProInfo: res.Data || []
            }
        }).catch(err => {
            console.error(err)
            throw new Error("获取OTC系统的客户产品限额设置异常")
        })
    },
    // 查询基金帐户信息
    getTaaccInfo(_this, params) {
        return _this.$syscfg.K_Request("YG210024", {
            CUST_CODE: params.CUST_CODE,
            CUACCT_CODE: params.CUACCT_CODE,
            INT_ORG: params.INT_ORG,
            TACODE: params.TACODE
        }).then(res => {
            return {
                taaccInfo: _.get(res, "Data[0]", {})
            }
        }).catch(err => {
            //console.error(err)
            // throw new Error("查询基金帐户信息异常")
            return {
                taaccInfo: {}
            }
        })
    },
    // 查询基金代码信息（基金代码属性）
    getOfcodeConfInfo(_this, params) {
        return _this.$syscfg.K_Request("Y3000001", {
            LBM:'YGT_W0240310',
            ORGID: params.INT_ORG,
            FUNDID: params.CUACCT_CODE,
            TACODE: params.TACODE,
            OFCODE: params.OFCODE
        }).then(res => {
            return {
                ofcodeConfInfo: _.get(res, "Data[0]", {})
            }
        }).catch(err => {
            console.error(err)
            throw new Error("查询基金代码信息（基金代码属性）异常")
        })
    },
    // 获取客户基金产品适当性信息设置信息
    getFundSuitablyData(_this, params) {
        return _this.$syscfg.K_Request("YG210026", params).then(res => {
            return {
                fundSuitablyPro: _.get(res, "Data[0]", {})
            }
        }).catch(err => {
            console.error(err)
            throw new Error("获取客户基金产品适当性信息设置信息异常")
        })
        
    },
    // 客户与基金产品适当性匹配校验
    checkSuitablyResult(_this, params) {
        return _this.$syscfg.K_Request("YG210027", Object.assign({
            CUSTRISKLEVEL: '',
            OFRISKLEVEL: '',
            CUST_CODE: params.CUST_CODE,
            CUACCT_CODE: params.CUACCT_CODE,
            INT_ORG: params.INT_ORG
        }, params)).then(res => {
            return {
                suitablyResult: _.get(res, "Data[0]", {})
            }
        }).catch(err => {
            console.error(err)
            throw new Error("获取客户基金产品适当性信息设置信息异常")
        })
    },
    // 获取适当性匹配信息
    getFundMatchInfo(_this, custInvestPro, params) {
        return Promise.all([
            this.getFundSuitablyData(_this, params),
            this.checkSuitablyResult(_this, params)
        ]).then(res => {
            let fundSuitablyPro = res[0].fundSuitablyPro;
            let suitablyResult = res[1].suitablyResult;
            _.extend(suitablyResult, custInvestPro, fundSuitablyPro);
            return dict.transformDict(suitablyResult,  [
                "INVEST_PRO",//客户投资品种
                "INVEST_LMT",//客户投资期限
                "EXPECT_INCOME",//客户预期收益
                {   "PROPRISKLEVEL": "Bcpfxdj",//基金风险等级
                    "INVESTMENTTYPE": "Ntzpz",//基金投资品种
                    "INVESTMENTPERIOD": "Ntzqx",//基金投资期限
                    "EXINCOMETYPE": "Bsdxyqsy"//基金预期收益
                }
            ]).then(newData => {
                newData.MATCH_FLAG = newData.ERRCODE == "0" ? "0" : "1";//0-匹配，1-不匹配
                newData.MATCH_RESULT = newData.ERRCODE == "0" ? "匹配" : "不匹配";

                let notMatchItem = newData.ERRMSG.trim().split("不匹配项：")[1] || "";
                _.extend(newData, {
                    SURVEY_SCORE_STATUS: notMatchItem.indexOf("风险等级") > -1 ? "0" : "1",
                    INVEST_PRO_STATUS: notMatchItem.indexOf("投资品种") > -1 ? "0" : "1",
                    INVEST_LMT_STATUS: notMatchItem.indexOf("投资期限") > -1 ? "0" : "1",
                    EXPECT_INCOME_STATUS: notMatchItem.indexOf("预期收益") > -1 ? "0" : "1"
                });

                return {
                    suitablyResult: newData
                };
            })
        })
        
    },
    // 获取客户风险测评题结果
    getCustSurveyData(_this, params) {
        return _this.$syscfg.K_Request("YG003667", Object.assign({
            USER_CODE: params.CUST_CODE,
            CUST_CODE: params.CUST_CODE,
            SURVEY_SN: params.SURVEY_SN,
            USER_ROLE: 1   //默认为客户
        }, params)).then(res => {
            return {
                surveyData: res.Data || []
            }
        }).catch(err => {
            console.error(err)
            throw new Error("获取客户基金产品适当性信息设置信息异常")
        })
    },
    // 客户适当性信息查询
    getCustInvestPro(_this, params) {
        return _this.$syscfg.K_Request("Y1190082", {
            CUST_CODE: params.CUST_CODE,
            INT_ORG: params.INT_ORG,
            USER_TYPE: params.USER_TYPE
        }).then(res => {
            return {
                custInvestPro: _.get(res, "Data[0]", {})
            }
        })
    },

    getTAFunds(_this,params){
        return _this.$syscfg.K_Request("W0000119", {
            bex_codes: "YGT_W0240904",
            serverid: '0',
            custorgid: params.INT_ORG || "",
            orgid: params.INT_ORG || "",
            tacode: '-1'
        }).then(res =>{
            return {
                taFunds: _.get(res,"Data",[])
            }
        }).catch(err => {
            console.error(err)
            throw new Error("获取TA账户属性失败")
        })
    },
    queryFinancialContract(_this,params){
        return _this.$syscfg.K_Request("Y3000001", {
            LBM: "KSPB_240454",
            BEGINDATE: "0",
            ENDDATE: "0",
            OFCODE: params.OFCODE || "", //传空代表，查询所有客户已签署的所有理财产品合同
            CUSTID: params.CUST_CODE,
            FUNDID: params.FUNDID || -1,
            SNO: '',
            ORGID: params.INT_ORG,
            DEALFLAG: "",
            STATUS: "",
            REDEEMCONTRACT: ""
        }).then(res =>{
            return {
                financialContractData: _.get(res,"Data",[])
            }
        }).catch(err => {
            console.error(err)
            throw new Error("理财产品合同查询失败")
        })
    },
    // 查询基金现金类产品信息
    getOfCodeDataCash(_this) {
        return _this.$syscfg.K_Request("W0000119", {
            bex_codes: "KSPB_240564",
            OFCODE: ""
        }).then(res => {
            return {
                ofCodeData: res.Data || []
            }
        }).catch(err => {
            console.error("查询基金现金类产品信息" + err)
        })
    },
    // 获取基金代码特性
    getOfCodeInfo(_this, ofcode, tacode) {
        return _this.$syscfg.K_Request("W0000119", {
            bex_codes: "KSPB_240309",
            TACODE: tacode || "-1",
            OFCODE: ofcode || ""
        }).then(res => {
            return {
                ofCodeInfo: _.get(res, "Data[0]", {})
            }
        }).catch(err => {
            console.error("查询基金代码特性失败" + err)
        })
    },
    // 查询基金帐户信息
    getOftaaccInfo(_this, tacode, params) {
        return Promise.all([
            _this.$syscfg.K_Request("W0000119", {
                bex_codes: "KSPB_240307",//查询基金帐户
                ORGID: params.ORGID || "",
                FUNDID: params.FUNDID || "",
                TACODE: tacode || ""
            }),
            _this.$syscfg.K_Request("W0000119", {
                bex_codes: "KSPB_240308",//查询基金帐户详细信息
                ORGID: params.ORGID || "",
                FUNDID: params.FUNDID || "",
                TACODE: tacode || ""
            }),
        ]).then(res => {
            return {
                oftaaccInfo: _.extend({}, _.get(res[0], "Data[0]", {}), _.get(res[1], "Data[0]", {}))
            }
        }).catch(err => {
            console.error("查询基金帐户信息失败" + err)
        })
    }
}