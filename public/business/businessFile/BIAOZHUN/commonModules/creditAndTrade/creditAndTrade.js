import custService from "../../../../../service/cust-service";
import dict from "../../../../../tools/dict";

export default {
    //查集中交易、融资融券的客户状态
    queryCustStatus(_this, params) {
        // 获取客户属性
        let CUST_EXT_ATTR = params.CUST_EXT_ATTR;
        return Promise.all([
            CUST_EXT_ATTR.indexOf("0") > -1 && _this.$syscfg.K_Request("W0000119", {
                bex_codes: "YGT_W0120190",
                ORGID: params.INT_ORG,
                CUSTID: params.CUST_CODE
            }),
            CUST_EXT_ATTR.indexOf("1") > -1 && _this.$syscfg.K_Request("W0000119", {
                bex_codes: "YGT_R120190",
                ORGID: params.INT_ORG,
                CUSTID: params.CUST_CODE
            })
        ]).then(res => {
            let kspb = _.get(res[0], "Data[0].STATUS", false);
            let kfis = _.get(res[1], "Data[0].STATUS", false);
            return {
                kspbStatus: kspb,
                kfisStatus: kfis,
                flag: kspb != "0" && kfis != "0" ? "1" : "0"
            }
        })
    },
    queryFundAcctInfoTrade(_this, params) {
        return _this.$syscfg.K_Request("W0000119", {
            bex_codes: "KSPB_141001",
            F_CUST_ORG_CODE: params.ORGID,//暂时强制转虚拟柜员为客户所属机构（解决非临柜业务客户识别后，其他菜单其他机构下的客户查询报权限不够的问题）
            ORGID: params.ORGID,
            FUNDID: params.FUNDID
        }).then(res => {
            return res.Data[0] || {}
        }).catch(err => {   
            console.error("获取资金账户失败" + err)
        })
    },
    queryFundAcctInfoCredit(_this, params) {
        return _this.$syscfg.K_Request("W0000119", {
            bex_codes: "KFIS_141001",
            F_CUST_ORG_CODE: params.ORGID,//暂时强制转虚拟柜员为客户所属机构（解决非临柜业务客户识别后，其他菜单其他机构下的客户查询报权限不够的问题）
            ORGID: params.ORGID,
            FUNDID: params.FUNDID
        }).then(res => {
            return res.Data[0] || {}
        }).catch(err => {   
            console.error("获取资金账户失败" + err)
        })
    },
    queryFundAcctInfo(_this, params) {
        return Promise.all([
            params.CUACCT_ATTR === "0" ? this.queryFundAcctInfoTrade(_this, params) : this.queryFundAcctInfoCredit(_this, params)
        ]).then(res => {
            if (res && res[0]) {
                res[0].FUNDID = params.FUNDID;
                return res[0];
            }
            return {};
        })
    },
    queryFundInfoTrade(_this, params) {
        return _this.$syscfg.K_Request("W0000119", {
            bex_codes: "KSPB_141002",
            ORGID: params.ORGID,
            FUNDID: params.FUNDID,
            MONEYTYPE: params.MONEYTYPE
        }).then(res => {
            return res.Data[0] || {}
        }).catch(err => {   
            console.error("获取资金账户失败" + err)
        })
    },
    queryFundInfoCredit(_this, params) {
        return _this.$syscfg.K_Request("W0000119", {
            bex_codes: "KFIS_141002",
            ORGID: params.ORGID,
            FUNDID: params.FUNDID,
            MONEYTYPE: params.MONEYTYPE
        }).then(res => {
            return res.Data[0] || {}
        }).catch(err => {   
            console.error("获取资金账户失败" + err)
        })
    },
    // 查询资金账号
    getCustCuacctData(_this, params) {
        let that = this;
        return custService.getCustFundInfo(params.CUST_CODE ,params).then(data => {
            let reqFundAccArr = [],
                resultFundAcc = [],
                reqFundInfoArr = [],
                resultFundInfoArr = [],
                tempFund = [],
                cuacctInfo = _.filter(data,function(dataObj){
                    return (dataObj.CUACCT_ATTR === "0" || dataObj.CUACCT_ATTR === "1") &&  dataObj.CUACCT_STATUS != "9";
                });
            _.each(cuacctInfo, function (v) {
                //银河个性：交易且是主资金账户、两融
                if(v.CUACCT_ATTR == "0" && v.MAIN_FLAG !== "1"){
                    return;
                }
                var reqParam = {
                    FUNDID: v.CUACCT_CODE,
                    ORGID: v.INT_ORG,
                    MONEYTYPE: v.CURRENCY,
                    CUACCT_ATTR: v.CUACCT_ATTR
                };
                if(_.isEmpty(_.find(tempFund,function(tempFundObj){
                    return tempFundObj.FUNDID === v.CUACCT_CODE ;
                })|| {})){
                    reqFundAccArr.push(that.queryFundAcctInfo(_this, reqParam));
                    tempFund.push(reqParam);
                }
                if (v.CUACCT_ATTR === "0") {
                    reqFundInfoArr.push(that.queryFundInfoTrade(_this, reqParam));
                } else if (v.CUACCT_ATTR === "1") {
                    reqFundInfoArr.push(that.queryFundInfoCredit(_this, reqParam));
                }
            });

            return Promise.all(reqFundAccArr).then(res => {
                _.each(res, item => {
                    item && resultFundAcc.push(item);
                });
                return dict.transformDict(resultFundAcc, { "FUNDIDSTATUS": "Bzhzt" }).then(resultFundAccTrans => {
                    //银河个性：过滤销户状态的
                    var yinHeData = _.filter(resultFundAccTrans, function(dataObj){ return dataObj.FUNDIDSTATUS != "*"; });
                    return Promise.all(reqFundInfoArr).then(res => {
                        _.each(res, item => {
                            item && resultFundInfoArr.push(item);
                        });
                        return dict.transformDict(resultFundInfoArr,{"MONEYTYPE":"Djsbz"}).then(function(resultFundInfoArrTrans){
                            return {
                                cuacctInfo: cuacctInfo,
                                fundAcctInfo: yinHeData,
                                fundInfo: resultFundInfoArrTrans || []
                            }
                        });
                    })
                })
            })
            
        })
    }
}