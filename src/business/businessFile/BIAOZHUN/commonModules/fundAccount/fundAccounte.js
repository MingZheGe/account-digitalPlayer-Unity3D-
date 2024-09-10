// 资金账户级接口查询
import custService from '../../../../../service/cust-service';
import date from '../../../../../tools/date';
import dict from '../../../../../tools/dict';
import org from '../../../../../tools/org';
import { addZero, parseAddress } from '../../../../../tools/util';

export default {
    // 获取客户所有的资金账户
    getCustFundAccount(_this, params) {
        return _this.$syscfg.K_Request("YG003661", {
            USER_CODE: params.CUST_CODE,
        }).then(res => {    
            // 过滤出状态正常的资金账户
            let allFundData = _.filter(res.Data || [], item => {
                return "0" == item.CUACCT_STATUS;
            });
            // 期权资金账户
            let optionsAccount = _.filter(allFundData, item => {
                return item.CUACCT_ATTR === "3";
            })
            // 普通和信用资金账户
            let fundAccount = _.filter(allFundData, item => {
                return item.CUACCT_ATTR === "0" || item.CUACCT_ATTR === "1";
            })
            return {
                // 期权资金帐户
                optionsAccount: optionsAccount,
                fundAccount: fundAccount,
            }

        }).catch(err => {
            console.error(err);
            throw new Error("查询客户资金账户信息失败")
        })
    },
    // 获取客户签约信息
    getCustFundAcctSignUpInfo(_this, signType, params) {
        // 普通签约信息
        if (signType === "0") {
            return _this.$syscfg.K_Request("Y3000019", {
                CUST_CODE: params.CUST_CODE
            }).then(res => {
                if(res.Data && res.Data.length> 0){
                    _.each(res.Data,function(v){
                        v.EXT_ORG = addZero(v.EXT_ORG);
                    })
                }
                return {
                    signInfo: res.Data || []
                }
            }).catch(err => {
                console.error(err)
                throw new Error("查询普通签约信息失败")
            })
        }
        // 信用签约信息
        else if (signType === "1") {
            return _this.$syscfg.K_Request("Y3000203", {
                CUST_CODE: params.CUST_CODE,
                // 信用资金账号
                CUACCT_CODE: params.CUACCT_CODE,
                FISL:'1'
            }).then(res => {
                if (res.Data && res.Data[0] && res.Data[1] && res.Data[1].errMsg == "") {
                    let creditSignUpInfo = res.Data[0];
                    creditSignUpInfo.EXT_ORG = addZero(creditSignUpInfo.EXT_ORG)
                    return {
                        creditSignUpInfo: creditSignUpInfo
                    }
                }
                return {
                    creditSignUpInfo: {}
                }
            }).catch(err => {
                console.error(err)
                throw new Error("查询信用签约信息失败")
            })
        } 
        // 期权签约信息
        else if (signType === "3") {
            return _this.$syscfg.K_Request("W0000119", {
                bex_codes: 'YGT_A1262562',
                CUST_CODE:params.CUST_CODE,
                CUACCT_CODE:params.CUACCT_CODE  //期权资产账户
            }).then(res => {
                let optionsSignUpInfo = res.Data || [];
                let optionsSignUped = _.filter(optionsSignUpInfo,function(item){
                    return _.indexOf(["0", "1"], item.CONTRACT_STATUS) > -1;
                })
                let bannedSignUp = _.filter(optionsSignUpInfo || [],function(item){
                    return item.CONTRACT_STATUS == "0" || item.CONTRACT_STATUS == "1";
                })
                return {
                    // 所有期权签约信息
                    optionsSignUpInfo: optionsSignUpInfo || [],
                    // 已签约的期权信息
                    optionsSignUped: optionsSignUped || [],
                    // 未到银行确认的签约信息,
                    bannedSignUp: bannedSignUp || []
                }
            }).catch(err => {
                console.error(err)
                throw new Error("查询期权签约信息失败")
            })
        }
    },
    // 获取外部机构
    getFinaBankConfData(_this, orgCode) {
        return Promise.all([
            this.getCommExtOrgData(_this, orgCode, "0", "2"),
            this.getCommExtOrgData(_this, orgCode, "1", "2"),
            this.getCommExtOrgData(_this, orgCode, "2", "2")
        ]).then(res => {
            let tmpData = _.chain(res[0].Data || []).filter((item) => {
                return Object.getOwnPropertyNames(item).length >= 3
            }).sortBy("EXT_ORG").value() || [];
            return {
                finaBankConfData: tmpData.concat(res[1].Data, res[2].Data)
            }
        })
    },
    // 获取外部机构
    getCommExtOrgData(_this, orgCode, currency, cubsbType) {
        return _this.$syscfg.K_Request("Y3000058", {
            INT_ORG: orgCode,
            CURRENCY: currency,
            CUBSB_TYPE: cubsbType,
        });
    },
    // 获取普通银行信息
    getBankOrgData(_this, orgCode) {
        return _this.$syscfg.K_Request("Y3000042", {
            INT_ORG: orgCode,
            CURRENCY: "0",
            CUBSB_TYPE: "1"
        }).then(res => {
            return org.transFormData(res.Data, "EXT_ORG", "1").then(rmbBankOrgArr => {
                return {
                    rmbBankOrgArr: _.sortBy(rmbBankOrgArr, function (v) {
                        return parseInt(v.EXT_ORG)
                    })
                }
            })
        })
    },
    // 获取所有银行数据
    getBankInfo(_this) {
        return _this.$syscfg.K_Request("Y1000200", {
            ORG_TYPE: "1"
        }).then(res => {
            return {
                bankAll: _.chain(res.Data || []).sortBy(function (v) {
                    v.EXT_ORG = v.ORG_CODE;
                    v.EXT_ORG_TEXT = v.ORG_NAME;
                    return parseInt(v.ORG_CODE);
                }).value() || []
            }
        })
    },
    // 获取账户系统参数
    getAccountSysParams(_this, paramKey) {
        let reqArr = []
        let needSysParams = {};
        _.each(paramKey, item => {
            reqArr.push(_this.$syscfg.getSysConfig(item, "10"));
        })
        return Promise.all(reqArr).then(res => {
            _.each(res, function(item, index) {
                needSysParams[paramKey[index]] = _.get(item, "Data[0].PAR_VAL", "");
            })
            return {
                needSysParams
            }
        })
    },
    // 过滤机构
    filterExtOrg(bankData, bankParam) {
        let bankDataTemp = bankData;
        let dormantVirtualBankCodes = bankParam.DORMANT_VIRTUAL_BANKCODE && bankParam.DORMANT_VIRTUAL_BANKCODE || "";
        let unQulifiedVirtualBankCodes = bankParam.UNQULIFIED_VIRTUAL_BANKCODE && bankParam.UNQULIFIED_VIRTUAL_BANKCODE || "";

        bankDataTemp = _.filter(bankData,function(v){
            return dormantVirtualBankCodes.indexOf(v.EXT_ORG) === -1 && unQulifiedVirtualBankCodes.indexOf(v.EXT_ORG) === -1 ;
        });
        return bankDataTemp;
    },
    // 获取诚信银行信息
    getCreditBankInfo(_this) {
        return Promise.all([
            this.getBankInfo(_this),
            this.getAccountSysParams(_this, ["CREDIT_BANKS", "OPEN_FILTER_CREDIT_BANKS","DORMANT_VIRTUAL_BANKCODE","UNQULIFIED_VIRTUAL_BANKCODE"])
        ]).then(res => {
            let bankAll = res[0].bankAll;
            let needSysParams = res[1].needSysParams;

            return {
                // 所有银行
                bankDataAll: this.filterExtOrg(bankAll, needSysParams),
                // 公参配置的信用银行号
                creditBankArr: needSysParams.CREDIT_BANKS || "",
                // 过滤掉的银行编号
                openFilter: needSysParams.OPEN_FILTER_CREDIT_BANKS || ""
            }               
        })
    },
    // 银证配置信息查询
    getBankConfData(_this, params) {
        return _this.$syscfg.K_Request("Y3000015", {
            CURRENCY: params.CURRENCY,
            EXT_ORG: params.EXT_ORG,
            INT_ORG: params.INT_ORG,
            CUBSB_TRD_ID: params.CUBSB_TRD_ID
        }).then(res => {
            return {
                ["bankConf_" + params.CUBSB_TRD_ID]: res.Data || []
            }
        })
    },
    // 客户签约要素信息
    getBankSignInfo(_this, params) {
        // 期权和个人
        return custService.getCustSignAcctInfo(params.CUST_CODE, params.CUACCT_CODE, {"secondAttr": "3"}).then(res => {
            return {
                resSignObj: res
            }
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
    getRiskFacctorData(_this, params) {
        return Promise.all([
            _this.$syscfg.getSysConfig('sfcgjzkh','6'),
            params.CUST_EXT_ATTR.indexOf("1") != -1 && _this.$syscfg.getSysConfig('sfcgjzkh','20') || {},
            dict.getDictData(["RISK_FACTOR", "CUACCT_STATUS"]),
        ]).then(res => {
            return {
                kspbArr: _.get(res, "[0].Data[0].PAR_VAL", "").split(""),
                kfisArr: _.get(res, "[1].Data[0].PAR_VAL", "").split(""),
                dictData: res[2] || {},
            }
        })
    },
    // 综合账户业务管理权限开通
    // 通过客户号查询oneid信息，并通过oneid查询可签约账户信息
    queryOneidByCustNo(_this, custCode, busiCode) {
        return _this.$syscfg.K_Request("QS000012", {
            CUST_CODE: custCode,
        }).then(oneidData => {
            let oneid = _.get(oneidData, "Data[0].ONEID", "");
            if (oneid) {
                // 获取可签约账户信息
                return _this.$syscfg.K_Request("QS000011", {
                    ONEID: oneid,
                    FLAG: "1"
                }).then(signData => {
                    let resultArr = signData.Data || [];
                    resultArr = _.filter(resultArr, function (v) {
                        v.ASSETACCTTYPE_TEXT = v.ASSETACCTTYPE === "0" ? (v.MAINACCTFLAG === "1" ? "普通客户-主" : "普通客户-辅") : (v.ASSETACCTTYPE === "1" ? "信用交易客户" : v.ASSETACCTTYPE === "3" ? "股票期权客户" :"")
                        return v.ASSETACCTSTS === "0";
                    });
                    // 同名账户资金划转服务开通 需要过滤未签约综合账户的账户
                    // ISSIGNOAS 为1标识已经开通了 综合账户的账户
                    if (busiCode == "V0152") {
                        resultArr = _.filter(resultArr, function (v) {
                            return v.ISSIGNOAS === "1";
                        })
                    }
                    return {
                        oneidAcctList: resultArr,
                        ONEID: oneid
                    }
                }).catch(err => {
                    console.error("查询可签约账户信息失败" + err)
                })
            }
            return {
                oneidAcctList: [],
                ONEID: oneid
            }
        }).catch(err =>  {
            console.error("获取oneid信息失败" + err);
        })
    },
    // 通过客户三要素查询客户是否已经绑定手机号
    queryBindUsing(_this, params) {
        return _this.$syscfg.K_Request("QS000010", {
            CUST_NAME: params[_this.oppBusiData.busiCommonParams["CUST_NAME"]],
            ID_TYPE: JSON.parse(_this.oppBusiData.busiCommonParams["ID_TYPE_TO_ONEID"])["ID_TYPE_" + params.ID_TYPE],
            ID_CODE: params.ID_CODE,
            USER_TYPE: params.USER_TYPE,
            sysCode: "COS",
        }).then(data => {
            return {
                bindUsingInfo: data.Data || []
            }
        }).catch(err => {
            console.error("通过三要素查询客户是否已经绑定手机号失败" + err)
        })
    },
    // 检查手机号
    checkMobUsing(_this, params) {
        return _this.$syscfg.K_Request("QS000009", {
            CUST_CODE: params.CUST_CODE,
            MOB: params.mob
            // 忽略错误，接口处理逻辑处理
        }, true).then(res => {
            let msgCode = res.Code;
            // 校验不通过
            if (msgCode !== "0") {
                console.error(res.Msg)
                return {
                    wait: false,
                    msg: res.Msg
                };
            } else {
                return {
                    wait: parseInt(_.get(res, "Data[0].RESENDINTERVAL", 60))
                };
            }
        })
    }, 
    // 校验短信验证码 即为绑定的手机号
    bindMobProcess(_this, param) {
        return _this.$syscfg.K_Request("QS000013", {
            CUST_CODE: param.CUST_CODE,
            SMS_CODE: param.SMS_CODE,
            MOB: param.MOBILE_TEL,
            CUST_NAME: param[_this.oppBusiData.busiCommonParams["CUST_NAME"]],
            ID_TYPE: JSON.parse(_this.oppBusiData.busiCommonParams["ID_TYPE_TO_ONEID"])["ID_TYPE_" + param.ID_TYPE],
            ID_CODE: param.ID_CODE,
            USER_TYPE: param.USER_TYPE
        }, true).then(res => {
            let msgCode = res.Code, msg = res.Msg.substring(res.Msg.indexOf('9999') + 12, res.Msg.length - 2);
            // 校验不通过
            if (msgCode !== "0") {
                return {
                    msg 
                };
            } else {
                return true;
            }
        })
    },
    queryInnerTransHisFlow(_this, param) {
        return _this.$syscfg.K_Request("QS000014", {
            CUSTNO: param.CUSTNO,
            ASSETACCT: param.ASSETACCT,
            TRDDATE: date.getClientDate(),
            ASSETACCTTYPE: param.ASSETACCTTYPE,
            ORGNO: param.ORGNO,
        }, true).then(res => {
            return !(res.Data &&  res.Data.length > 0 )
        })
    },
    // 根据客户代码查询一账通信息，并根据一账通信息的客户代码查询系统内的客户信息获取手机号码
    getCustMobileInfo(_this, custCode, userType) {
        return _this.$syscfg.K_Request("W0000119", {
            bex_codes:"YGT_A1160806",
            TOPACCT_CODE: "",	
            CUST_CODE: custCode
        }).then(res => {
            let topacctArr = res.Data || [];
            topacctArr = _.filter(topacctArr, item => {
                return item.USER_TYPE == userType && item.CUST_CODE != "" && item.CUST_CODE != "0"
            })
            let mobileReq = [];
            _.each(topacctArr, item => {
                mobileReq.push(_this.$syscfg.K_Request("W0000119", {
                    bex_codes: "KUAS_L1160001",
                    USER_CODE: item.CUST_CODE
                }))
            })
            return Promise.all(mobileReq).then(mobildArr =>{
                let mobileList = [];
                _.each(mobildArr || [], item => {
                    mobileList.push(item.Data[0].MOBILE_TEL)
                })
                return {
                    mobileList
                }
            })
        }).catch(err => {
            console.error("一账通信息查询失败" + err);
        })
    },
}