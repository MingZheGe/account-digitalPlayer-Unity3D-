import csdcService from '../../../../../service/csdc-service';
import custService from '../../../../../service/cust-service';
import dict from "../../../../../tools/dict.js";

// 证券账户，一码通相关接口请求
export default {
    // 查询我司已申报的使用信息
    queryUsedInfo(acctList, custName) {
        let proArray = [];
        _.each(acctList, v => {
            proArray.push(csdcService.csdcAcctQuery({
                ACCTBIZ_CLS: "03",
                ACCTBIZ_EXCODE: "11",
                ACCT_TYPE: v.ACCT_TYPE,
                TRDACCT: v.TRDACCT,
                QUERY_CSDC: "1"
            }))
        })
        return Promise.all(proArray).then(resArr => {
            let res = _.flatMap(resArr)
            return {
                usedArr: _.map(res, item => {
                    return _.pick(item, ["TRDACCT", "ACCTBIZ_ORGCODE", "ACCTBIZ_ORGNAME", "FIR_ORG_NAME"])
                })
            }
        })
        return csdcService.getCSDCAcctsExtInfo("11", acctList, {
        //     CUST_FNAME: custName,
        //     ACCTBIZ_CLS: "03",
        //     QUERY_CSDC: "1"
        // }).then(res => {
        //     return {
        //         usedArr: _.map(res, item => {
        //             return _.pick(item, ["TRDACCT", "ACCTBIZ_ORGCODE", "ACCTBIZ_ORGNAME", "FIR_ORG_NAME"])
        //         })
        //     }
        })
    },
    queryAcctInfo(params) {
        return csdcService.csdcAcctQuery({
            CUST_FNAME: params.CUST_FNAME,
            ID_TYPE: params.ID_TYPE,
            ID_CODE: params.ID_CODE,
            ACCTBIZ_EXCODE: "07",
            IS_PROMPT: "0",
            QUERY_CSDC: "1"
        }).then(data => {
            if (data[0] && data[0].RETURN_MSG.trim() === "记录不存在") {
                data = []
            }
            let szaAcctNum = _.filter(data || [], item => item.ACCT_TYPE == '21' && item.ACCT_STATUS != '9') || [],
                shaAcctNum = _.filter(data || [], item => item.ACCT_TYPE == '11' && item.ACCT_STATUS != '9') || [],
                szJjAcctNum = _.filter(data || [], item => item.ACCT_TYPE == '23' && item.ACCT_STATUS != '9') || [],
                shJjAcctNum = _.filter(data || [], item => item.ACCT_TYPE == '13' && item.ACCT_STATUS != '9') || [],
                normalSzbAcct = _.filter(data || [], item => item.ACCT_TYPE == '22' && item.ACCT_STATUS != '9') || [],
                normalShbAcct = _.filter(data || [], item => item.ACCT_TYPE == '12' && item.ACCT_STATUS != '9') || [],
                normalShaCreAcct = _.filter(data || [], item => item.ACCT_TYPE == '14' && item.ACCT_STATUS != '9') || [],
                normalSzaCreAcct = _.filter(data || [], item => item.ACCT_TYPE == '24' && item.ACCT_STATUS != '9') || [],
                normalShaOptAcct = _.filter(data || [], item => item.ACCT_TYPE == '15' && item.ACCT_STATUS != '9') || [],
                normalSzaOptAcct = _.filter(data || [], item => item.ACCT_TYPE == '25' && item.ACCT_STATUS != '9') || [];
            return {
                szaAcctNum,
                shaAcctNum,
                szJjAcctNum,
                shJjAcctNum,
                normalSzbAcct,
                normalShbAcct,
                normalShaCreAcct,
                normalSzaCreAcct,
                normalShaOptAcct,
                normalSzaOptAcct,
                acctInfo:  data   
            }
        })
    },
    //获取期权合约账户信息
    getOptTrdacct(_this, custCode) {
        let that = this;
        return _this.$syscfg.K_Request("Y3000049", {
            CUST_CODE: custCode
        }).then(data => {
            let optTrdacctArr = _.filter(data.Data || [], obj => {
                return obj.SUBACCT_STATUS != "9"
            })
            return {
                optioConInfo: optTrdacctArr
            }
        }).catch(err => {
            console.error("获取期权合约账户信息错误" + err)
        })
    },
    // 获取客户证券账户信息（系统内）
    getTrdacctInfo(_this, custCode) {
        return custService.getCustAccountInfo(custCode).then(data => {
            return {
                trdacctInfo: data || []
            }
        })
    },

    // 股票期权合约账户新增接口
    // 查询中登一码通信息
    getCsdcYMTArr(_this, params) {
        return _this.$syscfg.K_Request("YG003674",{
            OPERATOR_TYPE: "0",
            ACCTBIZ_EXCODE: "08",
            CHK_STATUS: "2",
            CUST_CODE: params.CUST_CODE,
            CUST_FNAME: params.CUST_FNAME,
            ID_TYPE: params.ID_TYPE,
            ID_CODE: params.ID_CODE
        }).then(res => {
            return {
                ymtArr: _.filter(res.Data || [], item => {
                    return item.YMT_STATUS == "0";
                })
            }
        })
    },
    // 获取中登客户资料
    getCsdcCustInfo(ymtCode) {
        return csdcService.csdcAcctQuery({
            YMT_CODE: ymtCode,
            ACCTBIZ_EXCODE: "06"
        }).then(res => {
            return {
                csdcCustInfo: res[0] || {}
            }
        })
    },
    // 获取期权资金账户信息
    getCustFundAccount(_this, params) {
        return _this.$syscfg.K_Request("YG003661", {
            USER_CODE: params.CUST_CODE,
        }).then(res => {    
            // 期权资金账户
            let optionsAccount = _.filter(res.Data || [], item => {
                return item.CUACCT_ATTR === "3";
            })
            let cuacctCodeArr = [];
            _.each(res.Data, function (obj) {
                if (_.isEmpty(_.findWhere(cuacctCodeArr, {CUACCT_CODE: obj.CUACCT_CODE}))) {
                    cuacctCodeArr.push(obj);
                }
            });
            let custFundInfo = _.filter(cuacctCodeArr, function (obj) {
                return obj.CUACCT_ATTR == "1" && obj.CUACCT_STATUS !== '9';
            }) || [];
            return {
                // 期权资金帐户
                optionsAccount: optionsAccount,
                // 信用资金账户
                custFundInfo: custFundInfo
            }

        }).catch(err => {
            console.error(err);
            throw new Error("查询客户资金账户信息失败")
        })
    },
    // 获取系统内已有账户
    queryOldTrdacct(_this, custCode) {
        let shAArr = [], allShAArr = [];
        return custService.getCustAccountInfo(custCode).then(trdacctData => {
            trdacctData = _.filter(trdacctData || [], (obj) => {
                return _.indexOf(["00", "10"], obj.STKBD) != -1 && -1 != _.indexOf(["0", "1", "6"], obj.TRDACCT_EXCLS) && "9" != obj.TRDACCT_STATUS;
            }) || [];//筛选出普通证券账户，并过滤掉已注销的证券账户
            // 兼容QF客户在系统内没有配号证券账户的情况
            if(!trdacctData.length){
                return {
                    allTrdacctData: [],
                    shAtrdacctData: [],
                    szATrdacctData: [],
                }
            }
            return trdacctData && dict.transformDict(trdacctData, 
                                [{"TRDACCT_STATUS": "TRDACCT_STATUS"}, {"TREG_STATUS": "TREG_STATUS"}]).then(data => {
                // 证券账户对应的交易单元，取集中交易的
                let kspbSTKPBUReqArr = [];
                _.each(trdacctData, function (obj) {
                    kspbSTKPBUReqArr.push(_this.$syscfg.K_Request("W0000119", {
                        bex_codes: "L1160159", // 查集中交易的证券账户信息
                        CUST_CODE: obj.CUST_CODE,
                        TRDACCT: obj.TRDACCT
                    }));
                });        
                return Promise.all(kspbSTKPBUReqArr).then(kspbSTKPBUData => {
                    _.each(kspbSTKPBUData, function (kspbInfo) {
                        _.each(trdacctData.Data || [], function(kuasInfo) {
                            if (kuasInfo.TRDACCT === kspbInfo.TRDACCT && kuasInfo.STKBD === kspbInfo.STKBD) {
                                kuasInfo.STKPBU = kspbInfo.STKPBU;
                            }
                        });
                    });
                    return {
                        allTrdacctData: _.filter(allData, function (acct) {
                            return "9" != acct.TRDACCT_STATUS;
                        }),
                        trdacctData: trdacctData
                    }
                })
            })
        })
    },
    // 获取期权证券账户信息
    getOptTrdacctInfo(_this, custCode) {
        return _this.$syscfg.K_Request("W0000119", Object.assign({
            bex_codes: "YGT_A1160815",
            CUST_CODE: custCode
        })).then(res => {
            return {
                optionsTrdacct: res.Data || []
            }
        })
    },
    //获取期权系统合约级别信息
    getOptTrdacctLvl(_this, param) {
        return _this.$syscfg.K_Request("Y3000001", {
            LBM: 'GGQ_GeneralQuery',
            F_FUNCTION: '850090205',
            p_gnbh: '850090205',
            QUERY_MODE: 'QUERY',
            CUST_CODE: param.CUST_CODE
        }).then(function(data){
            return {
                optTrdacctLvlData: data.Data || []
            }
        }).catch(err => {
            console.error("获取期权合约系统级别信息失败" + err)
        });
    },
    
    // 获取个股期权客户资产信息(买入额度信息)
    getBuyQuatoInfo(_this, param) {
        return Promise.all([
            custService.getYinHeCustAssetsData({
                CUST_CODE: param.CUST_CODE,
            }),
            custService.getCustStockOptionCreditRatingByCrm({
                CUST_CODE: param.CUST_CODE,
            })
        ]).then(res => {
            return {
                buyQuatoInfo: {
                    FUND_ASSET: res[0].TDYNETASSET || "",//净资产
                    AVG_MKT_VAL: res[0].NETASSET || "",//日均资产
                    MTH_6_AVGH_OLD_MKT_ASSET: res[1].MTH6AVGHOLDMKTVALHS || "0"//近6个月日均持有沪深总市值
                }
            }
        })
    },
    //客户买入额度查询(查询股票期权系统数据)
    getBuyQuotaQty(_this, param) {
        return _this.$syscfg.K_Request("Y3000001", {
            LBM: "ggqq_tradingAccount",
            CUST_CODE: param.CUST_CODE
        }).then(res => {
            return {
                custBuyQuotaAmount: res.Data
            }
        }).catch(err => {
            console.error("客户买入额度查询失败" + err)
        })
    },
    // 获取期权银行签约信息
    getCustBankSignInfo(_this, param) {
        return custService.getCustBankSignInfo(param.CUST_CODE, { OPT_FLAG: "1"}).then(data => {
            let bankSignInfo = _.filter(data.Data || [], function (obj) {
                return "9" != obj.CONTRACT_STATUS;
            });
            if (!_.isEmpty(bankSignInfo)) {
                ajax.post({
                    req: {
                        service: "Y1000200",
                        ORG_TYPE: "1"
                    }
                }).then(function (bankData) {
                    return {
                        bankSignInfo: bankSignInfo || [],
                        bankData: bankData.Data || []
                    }
                });
            } else {
                return {
                    bankSignInfo: bankSignInfo || []
                }
            }
        })
    },
    //获取期权客户信息
    getOptCustInfo(_this, param) {
        return _this.$syscfg.K_Request("Y3000002", {
            CUST_CODE: param.CUST_CODE
        }).then(res => {
            return {
                optCustInfo: _.get(res, "Data[0]", {}),
            }
        }).catch(err => {
            console.error("获取期权客户信息" + err)
        })
    },
    // 获取结算账户
    getSettAcctInfo(_this, param) {
        return _this.$syscfg.K_Request("Y3000062", {
            STKEX: '0' //深市
        }).then(res => {
            let settAcct = _.filter(res.Data || [], function (acctObj) {
                return _.indexOf(["31", "32"], acctObj.SETTTYPE) > -1;
            }) || [];//筛选期权结算账户
            dict.transformDict(settAcct, [{"SETTTYPE": "SETT_TYPE"}]).then(settAcct => {
                return {
                    settAcct: settAcct
                }
            })
        })
    },
    // 特殊机构和产品户查询中登证券账户信息
    getSpeCsdcAcctData(_this, custCode) {
        return _this.$syscfg.K_Request("Y3000907", {
            CUST_CODE: custCode
        }).then(res => {
            return res.Data || [];
        })
    },
    // 查询中登证券账户
    getCsdcAcctData(_this, speFlag){
        let custInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
        return Promise.all([
            speFlag == "1" ? this.getSpeCsdcAcctData(_this, custInfo.CUST_CODE) : csdcService.getCSDCAcctData(custInfo.CUST_FNAME, custInfo.ID_TYPE, custInfo.ID_CODE)
        ]).then(acctList => {
            let csdcAcctData = _.filter(acctList[0] || [], acctObj => {
                return acctObj.ACCT_STATUS != "9";
            })
            return dict.transformDict(csdcAcctData, [{"ACCT_STATUS": "TRDACCT_STATUS"}]).then((csdcAcctData) => {
                return {
                    csdcAcctData: csdcAcctData
                }
            });
        }).catch(err => {
            console.error("查询中登证券账户失败" + err)
        }); 
    },
    // 获取中登TA账户
    getCSDCTaAcct(_this, speFlag) {
        return this.getCsdcAcctData(_this, speFlag).then(res => {
            let tempData = _.filter(res.csdcAcctData, item => {
                return _.indexOf(["11", "21", "13", "23"], item.ACCT_TYPE) != -1 
            }) || [];
            let proArray = [];
            // 获取证券账户对应的TA账户
            _.each(tempData, item => {
                if (item.ACCT_STATUS != "9") {
                    proArray.push(csdcService.csdcAcctQuery({
                        ACCTBIZ_CLS: "02",
                        ACCTBIZ_EXCODE: "30",
                        ACCT_TYPE: item.ACCT_TYPE,
                        TRDACCT: item.TRDACCT,
                        QUERY_CSDC: "1"
                    }))
                }
            })
            return Promise.all(proArray).then(res => {
                let result = [], rowsList = [];
                _.each(res, item => {
                    result = result.concat(item);
                })
                _.each(result, function (v2) {
                    if (!_.isEmpty(v2) && v2.RTN_ERR_CODE == "0000" && _.trim(v2.OF_ACCT)) {
                        var tempData1 = _.find(tempData, function (v3) {
                            return v2.TRDACCT == v3.TRDACCT;
                        });
                        rowsList.push(_.extend(v2, {"OFACCT_STATUS": v2.ACCT_STATUS}, _.pick(tempData1, "ACCT_TYPE", "TRDACCT", "YMT_CODE", "ACCT_STATUS")));
                    }
                });
                return {
                    csdcTrdacctData: tempData,
                    ZDTaInfo: rowsList
                }
            })
        }).catch(err => {
            console.error("查询中登TA证券账户失败" + err)
        })
    },
    getSZSHFUND(_this) {
        return _this.$syscfg.getSysConfig("SZ_SH_FUND").then(res => {
            if (res.Data && res.Data[0]) {
                let szShFund = res.Data[0].PAR_VAL || "";
                let SZ_SH_FUND = szShFund.split(",").map(item => {
                    let tmpArr = item.split("|"),
                        taCode = tmpArr[0],
                        newTaCode = "0000" + taCode;
                    return [taCode, taCode * 1, newTaCode.substring(newTaCode.length - 4)];
                }).flatten();
                return SZ_SH_FUND
            }
            return [];
        })
    },
    getOpenFunds(_this, params) {
        return this.getSZSHFUND(_this).then(SZ_SH_FUND => {
            return _this.$syscfg.K_Request("Y3000038", {
                CUST_CODE: params.CUST_CODE,
                OTC_ACCT_FLAG: "1"
            }).then(res => {
                let hasFundData = res.Data || [];
                return {
                    hasFundsData: _.filter(hasFundData, function (obj) {
                        return obj.OFACCT_STATUS == "0" && _.indexOf(SZ_SH_FUND, obj.TA_CODE) != -1
                    })
                }
            }).catch(err => {
                console.error("获取已有基金公司失败", err)
            })
        })
    },
    getTaTrdacctInfo(_this, params) {
        return csdcService.csdcAcctQuery({
            ACCTBIZ_EXCODE: "33",
            CUST_FNAME: params.CUST_FNAME,
            ID_TYPE: params.ID_TYPE,
            ID_CODE: params.ID_CODE,
            USER_TYPE: params.USER_TYPE || (params.ID_TYPE.charAt(0) == "0" ? "0" : "1"),
            QUERY_CSDC: "1"
        }).then(res => {
            let tempData = _.filter(res, function (obj) { return obj.RTN_ERR_CODE == "0000" }), proArray = [];
            _.each(tempData, function (obj) {
                proArray.push(csdcService.csdcAcctQuery({
                    ACCTBIZ_CLS: "01",
                    ACCTBIZ_EXCODE: "30",
                    ACCT_TYPE: obj.ACCT_TYPE,
                    OF_ACCT: obj.OF_ACCT,
                    OF_ACCT_CLS: obj.OF_ACCT_CLS,
                    QUERY_CSDC: "1"
                }));
            });
            return Promise.all(proArray).then(res => {
                let result = [], rowsList = [];
                _.each(res, item => {
                    result = result.concat(item);
                })
                _.each(result, function (v2) {
                    if (!_.isEmpty(v2) && v2.RTN_ERR_CODE == "0000" && _.trim(v2.OF_ACCT)) {
                        let taObj = _.find(tempData, function (v3) {
                            return v2.OF_ACCT_CLS == v3.OF_ACCT_CLS && v2.OF_ACCT == v3.OF_ACCT
                        });
                        let checked = _.find(rowsList, item => {
                            return item.OF_ACCT_CLS == taObj.OF_ACCT_CLS && item.OF_ACCT == taObj.OF_ACCT
                        })
                        if(_.isEmpty(checked)) {
                            rowsList.push(_.extend(taObj, {"OFACCT_STATUS": v2.ACCT_STATUS})); //组装基金账户状态 用于界面展示
                        }
                    }
                });
                return {
                    taTrdacct: rowsList
                }
            })
        })
    },
    async checkInTimeer() {
        let isCsdcTime = await csdcService.isServiceTime({
            RES_IDS: "1",
            RES_TYPE: "1"
        });
        return {
            csdcTime: isCsdcTime.flag
        }
    },
    // 获取所有交易席位
    getAllStkpbu(_this) {
        //查询交易席位
        let that = _this;
        let custInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
        let orgCode = custInfo.INT_ORG;
        let allStkPbu = [];
        return that.$syscfg.K_Request_ALL([
            that.$syscfg.K_Request("W0000119", {
                bex_codes: "YGT_A1000003",
                F_FUNCTION: "500105020",
                TAB_CODE: "STK_PBU_ORG",
                INT_ORG: orgCode,
                F_CUST_ORG_CODE: orgCode
            }),
            that.$syscfg.K_Request("W0000119", {
                bex_codes: "YGT_A1000003",
                F_FUNCTION: "500105020",
                TAB_CODE: "STK_PBU",
                INT_ORG: orgCode,
                F_CUST_ORG_CODE:orgCode
            }),
        ]).then(res => {
            _.each(res[0].Data, function (item) {
                _.each(res[1].Data, function (item1) {
                    if (item.STKPBU == item1.STKPBU && "0" == item1.STKPBU_TYPE && item.STKBD == item1.STKBD && ("1" == item1.STKPBU_CLS || "2" == item1.STKPBU_CLS)) {
                        if (item.STKBD == "20") {
                            allStkPbu.push({
                                STKPBU: item.STKPBU,
                                STKPBUTEXT: item.STKPBU,
                                STKBD: item.STKBD,
                                MAJPBU_FLAG: item.MAJPBU_FLAG,
                                STKPBU_CLS: item1.STKPBU_CLS
                            });//股转A不区分主辅交易单元
                        } else {
                            allStkPbu.push({
                                STKPBU: item.STKPBU,
                                STKPBUTEXT: item.STKPBU + (item1.STKPBU_CLS == "2" ? "【QFII】" : ("1" == item.MAJPBU_FLAG ? "【主】" : "【辅】")),
                                STKBD: item.STKBD,
                                MAJPBU_FLAG: item.MAJPBU_FLAG,
                                STKPBU_CLS: item1.STKPBU_CLS
                            });
                        }
                    }
                });
            });
            return {
                allStkPbu: allStkPbu
            }
        })
    },
    // 测评结果查询
    getRiskSurveyInfo(_this, userType, custCode) {
        return _this.$syscfg.getSysConfig('CUST_MAIN_SURVEY_SN','10').then(res => {
            if (res.Data && res.Data[0]) {
                let CUST_MAIN_SURVEY_SN = res.Data[0].PAR_VAL || "";
                let KH_SURVEY_SN = "";
                if (CUST_MAIN_SURVEY_SN) {
                    if (userType == "0") {
                        KH_SURVEY_SN = CUST_MAIN_SURVEY_SN.split(";")[0];
                    } else {
                        KH_SURVEY_SN = CUST_MAIN_SURVEY_SN.split(";")[0];
                    }
                }
                return custService.getCustSurveyData({
                    CUST_CODE: custCode,
                    surveySn: KH_SURVEY_SN
                }).then(res => {
                    return {
                        riskSurveyInfo: _.get(res, "Data[0]", {})
                    }
                })
            }
        })
    },
    /**
     * 获取客户一账通下是否已开通期权合约账户
     * 1.先通过当前客户号查询关联一码通是否存在其他客户号
     * 2.查询一账通下其他客户下的期权合约账号
     */
    getTopSubacctInfo(_this, params) {
        return _this.$syscfg.getSysConfig('TOPACCT_NO_ENABLE').then(res => {
            if (res.Data && res.Data[0]) {
                let TOPACCT_NO_ENABLE = res.Data[0].PAR_VAL || "";
                if (TOPACCT_NO_ENABLE !== "1") {
                    return {
                        topAcctOptArr: []
                    }
                }
                // 查询一账通信息
                return _this.$syscfg.K_Request("W0000119", {
                    bex_codes: "YGT_A1160806",
                    CUST_CODE: params.CUST_CODE,
                    TOPACCT_CODE: ""
                }).then(res => {
                    let proArray = [];
                    let topAcctOptArr = []
                    let rData = res.Data || []
                    if (rData.length) {
                        _.each(rData, item => {
                            item.CUST_CODE !== params.CUST_CODE && proArray.push(
                                _this.$syscfg.K_Request("W0000119", {
                                    bex_codes: "YGT_A1160815",
                                    CUST_CODE: item.CUST_CODE
                                })
                            )
                        })
                    }
                    if (proArray.length) {
                        return Promise.all(proArray).then(res => {
                            _.each(res, item => {
                                if (item.Data && item.Data.length) {
                                    var tempDataArr = _.filter(item.Data, function(tempImgObj){
                                        return  "9" !== tempImgObj.SUBACCT_STATUS ;
                                    }) || [];
                                    tempDataArr.length > 0 && (topAcctOptArr = topAcctOptArr.concat(tempDataArr));
                                }
                            })
                            return {
                                topAcctOptArr: topAcctOptArr
                            }
                        })
                    }
                })
            }
        })
    },

    // 信用证券账户新增
    //获取证券账号数据（账户系统）
    querySysTrdacct: function(custCode){
        var that = this;
        return custService.getCustAccountInfo(custCode).then(function (data) {
            //过滤深A沪A  正常的股东账户
            var SZA_TRDACCT = [],SHA_TRDACCT = [],SZA_C_AC_TRDACCT = [],SHA_C_AC_TRDACCT = [],SZA_EX_AC_TRDACCT = [],SHA_EX_AC_TRDACCT = [],allSysTrdacctArr = [], TA_SYS_ACCT = [];
            return data  && dict.transformDict(data, ["TRDACCT_STATUS", "TREG_STATUS"]).then(function (data) {
                    _.each(data, function (item) {
                        item["STATUS"] = item.TRDACCT_STATUS_TEXT;
                        item["HAVE"] = false;
                        //配号证券账号下拉框仅显示已确认关联关系、系统内状态正常且已指定在我司的证券账户
                        if (item.STKBD === '00' && "9" != item.TRDACCT_STATUS && _.indexOf(["0", "1", "6"], item.TRDACCT_EXCLS) > -1) {
                            if (item.TRDACCT_STATUS != "0") item.DISABLE = true;
                            if (item.TRDACCT_STATUS == "0") SZA_TRDACCT.push(item);
                            allSysTrdacctArr.push(item);
                        } else if (item.STKBD === '10' && "9" != item.TRDACCT_STATUS && _.indexOf(["0", "1", "6"], item.TRDACCT_EXCLS) > -1) {
                            if (item.TRDACCT_STATUS != "0") item.DISABLE = true;
                            if (item.TRDACCT_STATUS == "0" && item.TREG_STATUS == "2") SHA_TRDACCT.push(item);
                            allSysTrdacctArr.push(item);
                        } else if (item.STKBD === '00' && _.indexOf(["2", "3", "8"], item.TRDACCT_EXCLS) > -1) {
                            "9" == item.TRDACCT_STATUS ? SZA_C_AC_TRDACCT.push(item) : SZA_EX_AC_TRDACCT.push(item);
                            allSysTrdacctArr.push(item);
                        } else if (item.STKBD === '10' && "9" !== item.TRDACCT_STATUS && _.indexOf(["2", "3", "8"], item.TRDACCT_EXCLS) > -1) {
                            "9" == item.TRDACCT_STATUS ? SHA_C_AC_TRDACCT.push(item) : SHA_EX_AC_TRDACCT.push(item);
                            allSysTrdacctArr.push(item);
                        }
                        // 可以与TA账户进行关联维护的 包括深A沪A深基沪基
                        if (_.indexOf(["00", "10"], item.STKBD) > -1 && _.indexOf(["0", "1", "4", "5"], item.TRDACCT_EXCLS) > -1) {
                            TA_SYS_ACCT.push(item)
                        }
                    });
                    return {
                        allSysTrdacctArr: allSysTrdacctArr,
                        szTrdacctArr: SZA_TRDACCT,
                        shTrdacctArr: SHA_TRDACCT,
                        szCCTrdacctArr: SZA_C_AC_TRDACCT,  //深市信用-已注销账户
                        shCCTrdacctArr: SHA_C_AC_TRDACCT,  //沪市信用-已注销账户
                        szEXCTrdacctArr: SZA_EX_AC_TRDACCT, //深市信用-未注销账户
                        shEXCTrdacctArr: SHA_EX_AC_TRDACCT,
                        sysAcct: TA_SYS_ACCT
                    }
            });

        });
    },
    //查询证券交易单元
    querySTKPBU(_this, intOrg) {
        var that = this;
        return _this.$syscfg.K_Request("Y2160010", {
            INT_ORG: intOrg,
            STKPBU_TYPE: "1" //交易单元类型(1-信用交易单元)
        }).then(res => {
            return {
                stkpbuList: res.Data || []
            }
        }).catch(err => {
            console.error("查询证券交易单元失败" + err)
        })
    },
    queryCsdcTrdacctData(param) {
        return csdcService.getCSDCExtSearch(param).then(res => {
            return {
                csdcTrdacctArr: res || []
            }
        })
    },
    //查询是否是在我司使用
    getCsdcAcctQuery(trdacct, acctType, QSZWMC) {
        //_this.oppBusiData.QSZWMC = oppService.getSysCommonParamsFromCacheObjs('QSZWMC');
        if (acctType == "21" || acctType == "11") {
            return new Promise((resolve) => resolve(true));
        }
        return csdcService.csdcAcctQuery({
            "ACCTBIZ_CLS":"03",
            "ACCTBIZ_EXCODE": "11",
            "ACCT_TYPE": acctType,
            "QUERY_CLS": "3",
            "QUERY_CSDC": "1",
            "TRDACCT": trdacct
        }).then(acctData => {
            if (!acctData.length || !acctData[0].RTN_ERR_CODE || acctData[0].RTN_ERR_CODE != "0000") {
                return true;
            } else if (acctData.length && acctData[0].ACCTBIZ_STATUS === "2") {
                if(acctData[0].ACCTBIZ_ORGNAME  &&acctData[0].ACCTBIZ_ORGNAME !="" &&  acctData[0].ACCTBIZ_ORGNAME.indexOf(QSZWMC) == -1){
                    return false;
                }
            }
            return true;
        })
    },
    //查询是否是自己客户代码下的信用证券账户-单客户模式
    getCustOneOwnAcctData(_this, trdacct){
        return custService.getCustAccountByTrdacct(_this, {TRDACCT:trdacct}).then(function(res){
            return {
                custTrdAcctObj: _.get(res, "Data[0]", {})
            }
        })
    },
    getCustOwnAcctData(_this, acctArr, custCode) {
        let proArray = [],
            innerOtherTrd = [],
            resultArr = acctArr;
        _.each(acctArr, function(v){
            v.TRDACCT && proArray.push(custService.getCustAccountByTrdacct(_this, {TRDACCT:v.TRDACCT}));
        });
        if(proArray.length <= 0){
            return {
                innerOtherTrd: innerOtherTrd
            };
        }
        return Promise.all(proArray).then(res => {
            _.each(res,function(tempArg){
                _.each(tempArg.Data || [],function(v2){
                    if(v2 && v2.CUST_CODE && v2.CUST_CODE !== custCode){
                        innerOtherTrd.push(v2);
                    }
                });
            });
            _.each(innerOtherTrd,function(v){
                _.each(resultArr,function(v1){
                    if(v.TRDACCT == v1.TRDACCT){
                        v1.CUST_CODE = v.CUST_CODE;
                        v1.TRDACCT_STATUS = v.TRDACCT_STATUS;
                    }
                });
            });
            return {
                innerOtherTrd: resultArr
            };
        })
    },
    //特殊机构通过证券账户查询中登数据
    getSpeFlagCsdcTrdAcctArr(speFlag, trdacct, acctType) {
        if (speFlag == "0") {
            return {
                csdcTrdacctObj: {}
            }
        }
        return Promise.all([
            csdcService.getCSDCTrdacctDataByAcctType(acctType, trdacct),
            csdcService.getCSDCUnqualiTrdacctData(acctType, trdacct)
        ]).then(([acctData, unqualiData]) => {
            if (!acctData.length || !acctData[0].RTN_ERR_CODE || acctData[0].RTN_ERR_CODE != "0000") {
                return {
                    csdcTrdacctObj: {}
                }
            } else if (acctData.length && acctData[0].ACCTBIZ_STATUS === "2") {
                //关联关系未确认时，需查询不合格账户，不合格账户无需校验关联关系
                if(unqualiData.length && unqualiData[0].ACCTBIZ_STATUS === "2" && unqualiData[0].UNQUALI_FLAG === "1"){
                    acctData[0].UNQUALI_FLAG = unqualiData[0].UNQUALI_FLAG ;
                }
                return {
                    csdcTrdacctObj: acctData[0]
                }
            }
        })
    },
    /**
     * 获取机构客户联系人资料
     * @param {*} _this 
     * @param {*} custCode 
     * @returns 
     */
     getCustLinkInfo(_this, custCode){
        return _this.$syscfg.K_Request('Y3000001', {
            LBM: 'L1190156',
            CUST_CODE : custCode
        }).then(data => {
            let custLinkInfo = data && data.Data && data.Data[0] || {};
            return {
                custLinkInfo
            };
        })
    },
    getMainStkacct(_this, params) {
        return custService.getTradeOtherInfoData(params.CUST_CODE, "L0301002", {
            CUACCT_CODE: params.CUACCT_CODE,
            INT_ORG: params.INT_ORG
        }).then(data => {
            let SZA_MAIN_TRDACCT = _.find(data || [], function (obj) {
                return obj.STKBD == "00" && obj.TRDACCT_STATUS == "0" && obj.TRDACCT_NO == "0";
            }) || "";
            let SHA_MAIN_TRDACCT = _.find(data || [], function(obj) {
                return obj.STKBD == "10" && (obj.TRDACCT_STATUS == "0" && obj.TREG_STATUS == "2") && obj.TRDACCT_NO == "0";
            }) || "";
            return {
                SZA_MAIN_TRDACCT,
                SHA_MAIN_TRDACCT
            }
        })
    },

    //查询中登一码通信息
    queryCsdcInfo(params) {
        return csdcService.csdcAcctQuery({
            ID_TYPE: params.ID_TYPE,
            ID_CODE: params.ID_CODE,
            CUST_FNAME: params.CUST_FNAME,
            ACCTBIZ_EXCODE: "08",
            IS_PROMPT: "0",
            QUERY_CSDC: "1"
        }).then(res => {
            return {
                ymtInfo: _.get(res, "[0]", {}),
                notCancelYmtInfo: _.filter(res || [], function (v) {
                    return v.YMT_STATUS != "1"   //过滤注销的
                })
            }
        }).catch(err => {
            console.error('查询中登一码通信息失败' + err)
        })
    },
    queryAcctInfoByYmt(ymtCode) {
        return csdcService.csdcAcctQuery({
            YMT_CODE: ymtCode,
            ACCTBIZ_EXCODE: "07",
            QUERY_TREG_INFO: "1",
            QUERY_CSDC: "1"
        })
    }
}