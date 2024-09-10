import sysConfig from "../config/sysConfig";

export default {
    getBankSignInfo(custCode) {
        if(!custCode) {
            return Promise.resolve([])
        }
        return sysConfig.$syscfg.K_Request("YG003669", { //获取客户银证签约信息
            ALL_FLAG: "1",
            CUST_CODE: custCode,
            USER_CODE: custCode,
            secondAttr: "3"
        }).then((res) => {
            return res.Data
        }) 
    },
    getCuacctInfo(custCode) { //获取资金账户信息
        if(!custCode) {
            return Promise.resolve([])
        }
        return sysConfig.$syscfg.K_Request("YG003661", {//获取用户资金账户信息
            CUST_CODE: custCode,
            USER_CODE: custCode,
        }).then((res) => {
            return res.Data
        })
    },
    getfundAssetInfo(custCode) { //获取用户资产帐户资产查询
        if(!custCode) {
            return Promise.resolve([])
        }
        return sysConfig.$syscfg.K_Request("YG003662", {//获取用户资金账户信息
            CUST_CODE: custCode,
            USER_CODE: custCode,
        }).then((res) => {
            return res.Data
        })
    },
    getCptlLogData(intOrg,custCode,cuacctCode) {
        if(!custCode) {
            return Promise.resolve([])
        }
        return sysConfig.$syscfg.K_Request("Y0180231", {//获取客户的资金流水 
            begindate: dateUtils.getClientDate(),
            enddate: dateUtils.getClientDate(),
            orgid: intOrg,
            brhid: intOrg,
            orderid: "",
            reportkind: "",
            bankflag: 0,
            bankcode: "",
            bankbranch: "",
            banknetplace: "",
            custkind: "",
            custgroup: "",
            custid: custCode,
            fundkind: "",
            fundlevel: "",
            fundgroup: "",
            fundid: cuacctCode,
            moneytype: "0",//标准版2206:W币种,默认人民币
            market: "",
            secuid: "",
            stktype: "",
            stkcode: "",
            prodcode: "",
            trdid: "",
            ptoperway: "",
            digestid: "",
            operid: -1,
            brokerid: -1,
            agentid: -1,
            stationno: "",
            sno: -1,
            queryflag: 0,
            specialkind: "",
            posstr: "",
            qryrec: "",
            beginbal: -999999999999.99,
            endbal: 999999999999.99,
            groupstrings: "",
            START_DATE: dateUtils.getClientDate("yyyy-MM-dd"),
            END_DATE: dateUtils.getClientDate("yyyy-MM-dd"),
            USER_CODE: custCode,
            CUSTOMER: custCode,
            ACCOUNT: cuacctCode,
            BRANCHES: intOrg,
            CURRENCY: "0",//标准版2206:U币种,默认人民币
            R_COUNT: "100"
        }).then((res)=> res.Data)
    },
    getOrdersLogData(intOrg, custCode, cuacctCode) {
        if(!custCode) {
            return Promise.resolve([])
        }
        return sysConfig.$syscfg.K_Request("Y0305129", {//获取客户的交易流水
            queryoption: 0,
            begindate: dateUtils.getClientDate(),
            enddate: dateUtils.getClientDate(),
            orgid: intOrg,
            brhid: intOrg,
            bankflag: 0,
            bankcode: "",
            bankbranch: "",
            banknetplace: "",
            custid: custCode,
            fundkind: "",
            fundlevel: "",
            fundgroup: "",
            fundid: cuacctCode,
            moneytype: "",
            market: "",
            seat: "",
            secuid: "",
            stkcode: "",
            stktype: "",
            prodcode: "",
            bsflag: "",
            bjhgmrtype: "",
            ydghbusitype: "",
            orderstatus: "",
            nightflag: "",
            cancelflag: "",
            ptoperway: "",
            operid: -1,
            stationno: "",
            remark1: "",
            agentid: -1,
            queryflag: 0,
            specialkind: "",
            creditid: "",
            creditflag: "",
            qryrec: "",
            posstr: "",
            groupstrings: "",
            BGN_DATE: dateUtils.getClientDate("yyyy-MM-dd"),
            END_DATE: dateUtils.getClientDate("yyyy-MM-dd"),
            CUSTOMER: custCode,
            ACCOUNT: cuacctCode,
            R_LAST_SN: "0",
            R_COUNT: "100",
            BRANCHES: intOrg
        }).then((res)=> res.Data)
    },
    getCustBankInfo(custCode) {
        if(!custCode) {
            return Promise.resolve([])
        }
        return sysConfig.$syscfg.K_Request("Y3000203", {//查询所有已签约银行信息
            ALL_FLAG: "1",
            CUST_CODE: custCode
        }).then((res)=> res.Data) 
    },
    getBankTranLog(intOrg,custCode, cuacctCode) {
        if(!custCode) {
            return Promise.resolve([])
        }
        return sysConfig.$syscfg.K_Request("Y0852506", {//查询所有已签约银行信息
            begindate: dateUtils.getClientDate(),
            enddate: dateUtils.getClientDate(),
            orgid: intOrg,
            brhid: intOrg,
            CUSTID: custCode,
            SNO: "",
            othersno: "",
            bankflag: 3, //三方存管
            bankcode: "",
            bankid: "",
            fundkind: "",
            fundlevel: "",
            fundgroup: "",
            FUNDID: -1,
            moneytype: "",
            banktranid: "",
            OPERID: -1,
            status: "",
            posstr: "",
            qryrec: "",
            queryflag: 0,
            specialkind: "",
            ptoperway: "",
            CUST_CODE: custCode,
            TRD_DATE: dateUtils.getClientDate(),
            BGN_DATE: dateUtils.getClientDate("yyyy-MM-dd"),
            END_DATE: dateUtils.getClientDate("yyyy-MM-dd"),
            BRANCH: intOrg,
            EXT_FUNC: "40",
            R_COUNT: 100,
            R_LAST_SN: 0
        }).then((res)=> res.Data) 
    },
    getSpecCuacctInfo(custCode) {
        if(!custCode) {
            return Promise.resolve([])
        }
        return sysConfig.$syscfg.K_Request("Y3000001", {
            LBM: "L1262001",
            USER_CODE: custCode,
            CUACCT_CODE: ""
        }).then((res) => {
            var reqArr = [],
            cuacctArr = _.chain(res.Data || []).filter((obj) => {
                return obj.CUACCT_EXT_ATTR.indexOf("0") !== -1;
            }).map(obj => obj.CUACCT_CODE).value();
            _.each(cuacctArr, function (v, i) {
                reqArr.push(
                    sysConfig.$syscfg.K_Request("Y3000001", {
                        LBM: "YGT_A1160108",
                        CUACCT_CODE: v,
                        CUACCT_FLAG_ID: "6"    //CUACCT_FLAG_ID  6 -股票质押融资专用账户
                    }).then(res=> res.Data && res.Data.length && res.Data[0] || {})
                );
            });
            //根据资金账户查询账户标识设置
            return Promise.all(reqArr).then((data) => {
                return _.filter(data, obj => !_.isEmpty(obj))
            })
        })
    },
    getAllowHasFundOpenBank(isWin) {//获取支持带资金开户的银行
        return sysConfig.$syscfg.K_Request("YG210020", {
            PARA_CODE: isWin ? "sfcgkhkz" : "ZCDZJKHYH"  
        }).then((res) => {
            var paramsVal = _.get(res,"Data[0].PARA_VALUE","");
            if(!isWin) {
                return paramsVal.replace(/;/g, ",")
            }
            return paramsVal;
        })
    },
    getAllowHasFundCancelBank(isWin) {//获取支持带资金销户户的银行
        return sysConfig.$syscfg.K_Request("YG210020", {
            PARA_CODE: isWin ? "sfcgxhbz" : "ZCDZJXHYH" 
        }).then((res) => {
            var paramsVal = _.get(res,"Data[0].PARA_VALUE","");
            if(!isWin) {
                return paramsVal.replace(/;/g, ",")
            }
            return paramsVal;
        })
    },
    getBankAcctConf(CURRENCY, EXT_ORG, INT_ORG, CUBSB_TRD_ID) {
        return sysConfig.$syscfg.K_Request("Y3000015", {
            CURRENCY: CURRENCY,
            EXT_ORG: EXT_ORG,
            INT_ORG: INT_ORG,
            CUBSB_TRD_ID: CUBSB_TRD_ID
        }).then(res => {
            return res && res.Data || [];
        })
    }
}
