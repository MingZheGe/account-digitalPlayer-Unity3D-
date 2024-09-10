
import sysConfig from "../config/sysConfig";
import definecfg from "../config/defineConfig.js";
import storage from '../tools/storage.js'
import oppService from "./opp-service"
import baseConfig from '../config/baseConfig'
import date from '../tools/date'

export default {
    getAcctType(STKBD, TRDACCT_EXCLS) {
        if (STKBD == "10" && (TRDACCT_EXCLS == "0" || TRDACCT_EXCLS == "1")) {
            return "11";
        } else if (STKBD == "11" && (TRDACCT_EXCLS == "0" || TRDACCT_EXCLS == "1")) {
            return "12";
        } else if (STKBD == "10" && (TRDACCT_EXCLS == "4" || TRDACCT_EXCLS == "5")) {
            return "13";
        } else if (STKBD == "10" && (TRDACCT_EXCLS == "2" || TRDACCT_EXCLS == "3")) {
            return "14";
        } else if (STKBD == "00" && (TRDACCT_EXCLS == "6" || TRDACCT_EXCLS == "7")) {
            return "15";
        } else if (STKBD == "00" && (TRDACCT_EXCLS == "0" || TRDACCT_EXCLS == "1")) {
            return "21";
        } else if (STKBD == "01" && (TRDACCT_EXCLS == "0" || TRDACCT_EXCLS == "1")) {
            return "22";
        } else if (STKBD == "00" && (TRDACCT_EXCLS == "4" || TRDACCT_EXCLS == "5")) {
            return "23";
        } else if (STKBD == "00" && (TRDACCT_EXCLS == "2" || TRDACCT_EXCLS == "3")) {
            return "24";
        } else if (STKBD == "00" && (TRDACCT_EXCLS == "6" || TRDACCT_EXCLS == "6")) {
            return "25";
        } else if (STKBD == "20") {
            return "31";
        } else if (STKBD == "0") {
            return "99";
        }
    },
    //中登一码通查询
    getCSDCYmtData(custName,idType,idCode){
        let that = this;
        return that.queryCSDCTime().then(function(isInCsdcTime){
            if(isInCsdcTime == 'true'){
                return sysConfig.$syscfg.K_Request('W0000107', {
                    ACCTBIZ_EXCODE:"08",
                    CHK_STATUS:"2",
                    CUST_FNAME:custName,
                    F_CUST_ORG_CODE:storage.$storage.getSession(definecfg.$definecfg.F_CUST_ORG_CODE),
                    ID_CODE:idCode,
                    ID_TYPE:idType,
                    OPERATOR_TYPE:"0",
                    QUERY_CSDC:"1"
                }).then(data => {
                    if(data.Code == '0'){
                        return data.Data;
                    }else{
                        console.error('获取中登一码通数据失败,原因：'+ data.Msg);
                        return [];
                    }
                })
            }else{
                //非中登时间
                return [];
            }
        })
    },
    // 获取一码通拓展信息 
    getCSDCYmtExData(params) {
        return sysConfig.$syscfg.K_Request('Y1001137', {
            CUST_CODE: params.CUST_CODE,
            CUST_FNAME: params.CUST_FNAME,
            ID_TYPE: params.ID_TYPE,
            ID_CODE: params.ID_CODE
        }).then(res => {
            return res.Data || [];
        }).catch(error => {
            console.log("获取一码通拓展信息失败" + error)
        })
    },
    //获取证券账号数据（中登）
    getCSDCAcctData(custName,idType,idCode){
        let that = this;
        return sysConfig.$syscfg.K_Request('W0000144', {
            ACCTBIZ_EXCODE:"07",
            CHK_STATUS:"2",
            CUST_FNAME:custName,
            ID_CODE:idCode,
            ID_TYPE:idType,
            OPERATOR_TYPE:"0",
            QUERY_CSDC:"1"
        }).then(data => {
            return that.queryCSDCTime().then(function(isInCsdcTime){
                if(isInCsdcTime == 'true'){
                    if(data.Code == '0'){
                        return data.Data;
                    }else{
                        console.error('获取证券账号数据失败,原因：'+ data.Msg);
                        return [];
                    }
                }else{
                    //非中登时间
                    return [];
                }
            })
           
        })
    },
    getCSDCAgreeMentData(custFname, idType, idCode, agmtType, acctList, params) {
        let that = this;
        return sysConfig.$syscfg.K_Request('W0000148', Object.assign({
            CUST_FNAME : custFname,
            ID_TYPE: idType,
            ID_CODE: idCode,
            PROPER_CLS: agmtType,
            ACCT_LIST: acctList || [],
            ACCTBIZ_EXCODE: "13",
            OPERATOR_TYPE: "0",
            ACCTBIZ_CLS:'02',
            CHK_STATUS : "2",
            F_CUST_ORG_CODE : storage.$storage.getSession(definecfg.$definecfg.F_CUST_ORG_CODE),
        }, params)).then(data => {
            return that.queryCSDCTime().then(function(isInCsdcTime){
                if(isInCsdcTime == 'true'){
                    if(data.Code == '0'){
                        return data.Data;
                    }else{
                        console.error('获取中登一码通数据失败,原因：'+ data.Msg);
                        return [];
                    }
                }else{
                    //非中登时间
                    return [];
                }
            })
        });
    },
    //判断是否在中登时间内
    queryCSDCTime(custName,idType,idCode){
        let custInfo = storage.$storage.getJsonSession(definecfg.$definecfg.CUSTOMER_INFO)
        return sysConfig.$syscfg.K_Request('W0000106', {
            CUST_FNAME:custName || custInfo.CUST_FNAME,
            ID_CODE: idCode  || custInfo.ID_CODE,
            ID_TYPE: idType || custInfo.ID_TYPE
        }).then(res => {
            if(res.Code == '0'){
                return res.Data[0] && res.Data[0].CHECK_FLAG;
            }else{
                throw ('判断是否在中登时间内请求失败,原因：'+ res.Msg);
            }
        })
    },

    //edit linjinbin 添加一个过滤的参数
    /**
     * 获取客户首次交易日
     * @param {*} custName 
     * @param {*} idType 
     * @param {*} idCode 
     * @param {*} filterAcctType //需要过滤的交易账户类型
     */
    getCDSCFirstTrdDate(custName, idType, idCode, filterAcctType){
        let that = this;
        return sysConfig.$syscfg.K_Request("W0000105", {
            ACCTBIZ_EXCODE:"09",
            CHK_STATUS:"2",
            CUST_FNAME:custName,
            ID_CODE:idCode,
            ID_TYPE:idType,
            OPERATOR_TYPE:"0",
        }).then(res => {
            if(res.Code == '0'){
                let firstTrdDate = "0";
                let arr = res.Data;
                filterAcctType = filterAcctType || [];
                let filterArr = _.isArray(filterAcctType) ? filterAcctType : filterAcctType.split(",");
                if (arr && arr.length > 0) {
                    let qsVersion = oppService.getBusiCommonParamsFromCacheObjs("QSJGDM_FILTER") ? oppService.getBusiCommonParamsFromCacheObjs("QSJGDM_FILTER").split(",") : [];   
                    // 防止部分有首次交易日，部分没有的情况，要先排除空和0的账户，并对存在首次交易日的进行顺序排序
                    arr = _.chain(arr).filter(function(obj){
                        //去除掉空格和0的
                        obj.FIRST_TRD_DATE = _.trim(obj.FIRST_TRD_DATE);
                        //中泰返回的数据过滤为
                        if(_.includes(qsVersion, baseConfig.$basecfg.qsVersion)){
                            return obj.FIRST_TRD_DATE != "" && obj.FIRST_TRD_DATE != "0" && obj.FIRST_TRD_DATE != "19000101" && (obj.ACCT_STATUS == "0" || obj.ACCT_STATUS == "4" || obj.ACCT_STATUS == "9");
                        }else{
                            //其他
                            return obj.FIRST_TRD_DATE != "" && obj.FIRST_TRD_DATE != "0" && obj.FIRST_TRD_DATE != "19000101";
                        } 
                    }).filter(function (v) {
                        // 如果需要过滤交易账户类型的
                        if (filterArr.length) {
                            return _.indexOf(filterArr, v.ACCT_TYPE) != -1;
                        } else {
                            return true;
                        }
                    }).sortBy("FIRST_TRD_DATE").map(function(obj){
                        return obj.FIRST_TRD_DATE;
                    }).value();
                    firstTrdDate = arr && arr[0];
                }
                return firstTrdDate;
            }else{
                console.error('获取客户首次交易日失败,原因：'+ res.Msg);
                return '0';
            }
        })
    },
    /**
     * /存量客户的中登校验 先查账户再查中登
     * @param {*} params 入参 
     * @param {*} filterAcctType //需要过滤的交易账户类型
     */
    W0000278(params){
        return sysConfig.$syscfg.K_Request('W0000278', params).then(function (res) {
            if(res.Code == "0"){
                let data = res.Data[0];
                if(data && data.ISSAMEFLAG == "true"){
                    return {
                        flag: true
                    };
                }else{
                    return {
                        msg:  data.RESULTSTR || "中登校验失败！",
                        flag: false
                    };
                }
            }else{
                throw `中登校验失败`+res.Ms
            }
        }).catch(err => {
            throw `中登校验失败`+ err.toString()
        });
    },
    getTrdDate() {
        var currDate = date.getClientDate(); // 当前日期
        var begDate = date.addDays(currDate, -30);
        return sysConfig.$syscfg.K_Request("W0000119",{
                bex_codes: "YGT_A1260602",
                BEGIN_DATE: begDate,
                BOOKSET: "1",
                END_DATE: currDate,
                F_FUNCTION: "103005010",
            }).then(function (data) {
                var dates = data.Data;
                for (var i = dates.length - 2; i > 0; i--) {
                    if (dates[i].DATE_FLAG === "1") {
                        return dates[i].PHYSICAL_DATE;
                    }
                }
            });
    },
    /**
     * 中登账户业务申报+查询
     * @param param
     * @returns {*}
     */
    csdcAcctQuery(param) {
        return sysConfig.$syscfg.K_Request("Y3000005", Object.assign({
            OPERATOR_TYPE: '0',
            CHK_STATUS: '2',
            ZD_OP_CHANNEL: "1",
        }, param)).then(res => {
            // 获取中登数据成功
            if (res.Code == "0" && res.Data.length > 0) {
                return res.Data;
            }
            return [];
        }).catch(e => {
            console.error(e + "中登账户业务申报+查询: Y3000005")
        })
    },
    // 通过证券账户类型、证券账户查询中登证券账户
    getCSDCTrdacctDataByAcctType (acctType, trdacct) {
        return this.csdcAcctQuery({
            ACCT_TYPE: acctType,
            TRDACCT: trdacct,
            ACCTBIZ_EXCODE: "07"
        }).then(function (acctData) {
            return acctData;
        })
    },
    //通过证券账户类型、证券账户查询中登不合格账户
    getCSDCUnqualiTrdacctData (acctType, trdacct) {
        return this.csdcAcctQuery({
            ACCT_TYPE: acctType,
            TRDACCT: trdacct,
            ACCTBIZ_EXCODE: "26"
        }).then(function (acctData) {
            return acctData;
        })
    },
    
    /**
     * 批量查407+413中登拓展信息(只要是需要传递证券账号信息的中登查询，比如核对信息，使用信息等)
     * @params acctList 证券账户信息，包括TRDACCT和ACCT_TYPE
     * @params params 其他查询所需要的公共参数
     *
     * */
    getCSDCAcctsExtInfo(acctBizExcode='', acctList = [], param={}, refreshFlag) {
        return sysConfig.$syscfg.K_Request("YG003679", _.extend({
            OPERATOR_TYPE: '0',
            CHK_STATUS: '2',
            ZD_OP_CHANNEL: "1",
            ACCT_LIST: acctList || [],
            ACCTBIZ_EXCODE: acctBizExcode
        }, param)).then(res => {
            // 获取中登数据成功
            if (res.Code == "0" && res.Data.length > 0) {
                return res.Data;
            }
            return [];
        }).catch(e => {
            console.error(e + "批量查407+413中登拓展信息: YG003679")
        })
    },
    getCSDCExtSearch(param) {
        return new Promise((resolve, reject) => {
            if (_.isEmpty(param.ACCTBIZ_EXCODE)) {
                console.error("账户代理业务类型不能为空");
                resolve(false)
                return;
            }
            if (_.isEmpty(param.QUERY_CLS)) {
                console.error("查询类型不能为空");
                resolve(false)
                return;
            }
            if ("2" == param.QUERY_CLS) {//一码通查询
                if (_.isEmpty(param.YMT_CODE)) {
                    console.error("一码通查询时一码通号不能为空！");
                    resolve(false)
                    return;
                }
            } else if ("3" == param.QUERY_CLS) {//证券账户查询
                if ((_.isEmpty(param.ID_TYPE) && _.isEmpty(param.ID_CODE)) && (_.isEmpty(param.ACCT_TYPE) && _.isEmpty(param.TRDACCT))) {
                    console.error("证券账户查询时证券账户类别和账户或证件类型和号码不能同时为空！");
                    resolve(false)
                    return;
                }
            }
            return sysConfig.$syscfg.K_Request("Y3000005", _.extend({
                INT_ORG: param.INT_ORG || param.ORG_CODE,
                CHK_STATUS: "2",
                ZD_OP_CHANNEL: "1",
                OPERATOR_TYPE: "0"
            }, param)).then(res => {
                resolve(res.Data || [])
            }).catch(err => {
                console.log("中登拓展查询失败" + err)
                reject(false)
            })
        });
    },
    //查询中登账户注册信息
    getQueryAcctInfo(param){
        return this.csdcAcctQuery(Object.assign({
            ACCTBIZ_EXCODE: "06",
            CUST_CODE: param.CUST_CODE || "",
            QUERY_CSDC: "1"
        }, param)).then(function (csdcAcctInfo) {
            // 去除空格
            var tmpObj = _.mapValues(csdcAcctInfo[0] || {}, function (val) {
                return _.trim(val);
            });
            // 处理辅助证件日期为0的情况，避免影响表单
            tmpObj.ID_EXP_DATE2 = tmpObj.ID_EXP_DATE2 == "0" ? "" : tmpObj.ID_EXP_DATE2;
            return tmpObj;
        });
    },

    getRelationAcctChangeData(acctList) {
        var relationAcctChangeArr = [],
        filterAcctType = "11,12,13,21,22,23,31",
        filterArr = filterAcctType.split(",");

        var range1 = /^F97[\w]+$/,//基金的配号为F97XXXXXXX.
            range2 = /^A99[0-1]{1}[\w]+$/;//沪市 B 转 A 特殊账户（A990*****;A991*****）
        if (acctList && acctList.length > 0) {
            relationAcctChangeArr = _.chain(acctList).filter(function (v) {
                // (1)过滤交易账户类型的，(2)证券账户状态过滤掉9-销户
                return _.indexOf(filterArr, v.ACCT_TYPE) !== -1 && v.ACCT_STATUS !== "9";
            }).filter(function (v) { //沪不包含F97段
                return !(v.ACCT_TYPE === "13" && range1.test(v.TRDACCT));   //沪市
            }).filter(function (v) { //沪市B转A特殊账户（A990**,A991**）
                return !range2.test(v.TRDACCT);
            }).value();
        }
        return relationAcctChangeArr;
    },
    
    /**
     * 过滤特定的未确认关联关系的证券账户
     * @param acctList  中登证券账户数据
     * @param showConfirmed 是否展示已确认的证券账户
     */
    getUnRelationAcctData(acctList,showConfirmed) {
        //沪A/B 深A/B  沪/深市封闭式基金账户(沪F500000000-F999999999(不包含Ｆ９７段) 深05xxxxxxxx不在这个区间段的要确定关联关系)
        var unRelationAcctArr = [],
            filterAcctType = "11,12,13,21,22,23",
            filterArr = filterAcctType.split(",");
        var range1 = /^F97[\w]+$/,  //基金的配号为F97XXXXXXX.
            range2 = /^F[5-9]{1}[\w]+$/,//基金配号的区间F500000000-F999999999
            range3 = /(^05[\w]+$)|(^001[6-9]{1}[\w]+$)|(^04[\w]+$)/,//基金配号05xxxxxxxx 001[6-9]xxxxxx 增加 04xxxxxxxx段配号账户不需要做关联关系确认
            range4 = /(^F[5-9]{1}[\w]+$)|(^F0[\w]+$)/,  //广州证券个性专用：基金的配号为F97XXXXXXX.F0XXXXXX开头
            interval = [
                [10100000, 10834330],
                [10834332, 10999999],
                [13100000, 13880784],
                [13880786, 13999999],
                [14000000, 14716490],
                [14716492, 14999999],
                [16000000, 19999999]];// 基金配号 001开头的部分区间

        if (acctList && acctList.length > 0) {
            unRelationAcctArr = _.chain(acctList).filter(function (v) {
                // (1)过滤交易账户类型的，(2)2510需求：证券账户状态不为注销、休眠,(3)过滤掉不合格账户
                return (showConfirmed || v.RELATION_FLAG != '1') && _.indexOf(filterArr, v.ACCT_TYPE) != -1 && _.indexOf(["9", '4'], v.ACCT_STATUS) == -1 && v.UNQUALI_FLAG == "0";
            }).filter(function (v) {
                    //沪F500000000-F999999999(不包含F97段) 不在这个范围内的
                if (sysConfig.$syscfg.isQSMZ(["GUANGZHOU"])) {
                    return !(v.ACCT_TYPE == "13"  && range4.test(v.TRDACCT) && !range1.test(v.TRDACCT));  //沪市
                }else{
                    return !(v.ACCT_TYPE == "13"  && range2.test(v.TRDACCT) && !range1.test(v.TRDACCT));  //沪市
                }
            }).filter(function (v) {//深市 05xxxxxxxx
                var matchFlag = false;  //配号区间内的标志
                if (v.ACCT_TYPE == "23" && range3.test(v.TRDACCT)) {
                    matchFlag = true;
                } else if (v.ACCT_TYPE == "23" && String(v.TRDACCT).startsWith("001")) {
                    var end8 = Number(String(v.TRDACCT).substring(2));
                    for (var key in interval) {
                        if (!isNaN(end8) && end8 >= interval[key][0] && end8 <= interval[key][1]) {
                            matchFlag = true;
                            break;
                        }
                    }
                }
                return !matchFlag;
                //return v.ACCT_TYPE != "23" || (v.ACCT_TYPE == "23" && !range3.test(v.TRDACCT))
            }).value();
        }
        return unRelationAcctArr || [];
    },
    /**
     * 中登身份校验
     * 第一步：优先查询账户本地数据，若不存在，才查中登
     * 第二步：非中登服务时间，直接返回结果
     * @param param
     * @returns {*}
     */
    validate(param) {
        let that = this;
        return that.isServiceTime({
            RES_IDS: "5",
            RES_TYPE: "1"
        }).then(timeObj => {
            // 第一步：先查询本地是否已经存在身份校验信息，若存在则直接返回已存在的校验结果
            return that.policeCheck(param).then(checkObj => {
                // 第二步：本地不存在或者校验结果不一致的时候，重新发起中登身份校验，请求最新的结果
                return Promise.all([
                    !checkObj.ISSAMEFLAG ? that.csdcCheck(param, timeObj && timeObj.flag) : checkObj
                ]).then(res => {
                    let result = res[0] || {};
                    result.IS_AGENT = param.isAgent || "0";
                    result.AGT_CODE = param.agtCode || param.AGT_CODE || "";
                    result.AGT_USER_NAME = param.AGT_USER_NAME || "";
                    result.AGT_ID_TYPE = param.AGT_ID_TYPE || "";
                    result.AGT_ID_CODE = param.AGT_ID_CODE || "";
                    // 是否显示客户资料变更、跳过按钮连接
                    result.showCustInfoModify = param.showCustInfoModify || false;
                    result.showCustInfoModify = false;
                    result.showRepeatCheck = param.showRepeatCheck || false;
                    result.showAgentInfoModify = param.showAgentInfoModify || false;
                    result.showSkipCsdcCheck = param.showSkipCsdcCheck || false;
                    result.skipCallback = param.skipCallback || undefined;
                    result.flag = result.ISSAMEFLAG || false;
                    //机构/产品户中登校验失败后，选择客户资料变更链接需要传送相关参数
                    result.RECO_CUST_INFO = param.RECO_CUST_INFO;
                    return result;
                })
            })
        }).catch(err=> {
            return false;
        })
    },
    // 个人中登身份校验核心方法
    csdcCheck(param, inTimeFlag) {
        let that = this;
        // service: "Y3000005",
        let reqParams = _.extend({
            OPERATOR_TYPE: "0",
            ACCTBIZ_CLS: "02",
            ACCTBIZ_EXCODE: "23",
            CHK_STATUS: "2"
        }, param);
        if (!inTimeFlag) {
            return {
                LOCALCUSTINFO: param,
                CSDCCUSTINFO: {CUST_FNAME: "", SEX: "", NATIONALITY: "", BIRTHDAY: "", ID_CODE: ""},
                RESULTSTR: "非中国结算身份校验服务时间",
                ISSAMEFLAG: false
            }
        }
        return sysConfig.$syscfg.K_Request("Y3000005", reqParams).then(res => {
            if (_.isString(_.get(res, "Data[0]", ""))) {
                return {};
            } else {
                // 查询客户身份信息验证结果信息
                return that.getCustIdentityValidResult({
                    CUST_FNAME: param.CUST_FNAME,
                    ID_TYPE: param.ID_TYPE,
                    ID_CODE: param.ID_CODE
                }).then(resultData => {
                    if (!resultData.length) {
                        return {
                            LOCALCUSTINFO: param,
                            CSDCCUSTINFO: {CUST_FNAME: "", SEX: "", NATIONALITY: "", BIRTHDAY: "", ID_CODE: ""},
                            RESULTSTR: param.isAgent == "1"?  "未查询到代理人身份信息" : param.USER_TYPE == "0" ? "未查询到客户身份信息" : "未查询到法定代表人身份信息",
                            ISSAMEFLAG: false
                        }
                    }
                    let compareResult = that.getCustCompareInfoText(param, resultData[0]);
                    return {
                        LOCALCUSTINFO: param,
                        CSDCCUSTINFO: compareResult.csdcInfo,
                        RESULTSTR: compareResult.isSameFlag ? "" : param.isAgent == "1"?  "代理人身份信息校验不一致！" : param.USER_TYPE == "0" ? "客户身份信息校验不一致！" : "法定代表人身份信息校验不一致！" ,
                        ISSAMEFLAG: compareResult.isSameFlag
                    }
                })
            }
        })
    },
    // 获取本地的身份校验结果
    policeCheck(param) {
        let that = this;
        return that.getCustIdentityValidResult({
            CUST_FNAME: param.CUST_FNAME,
            ID_TYPE: param.ID_TYPE,
            ID_CODE: param.ID_CODE
        }).then(resultData => {
            if (!resultData.length) {
                return {
                    LOCALCUSTINFO: param,
                    CSDCCUSTINFO: {CUST_FNAME: "", SEX: "", NATIONALITY: "", BIRTHDAY: "", ID_CODE: ""},
                    RESULTSTR: param.isAgent == "1"?  "未查询到代理人身份信息" : param.USER_TYPE == "0" ? "未查询到客户身份信息" : "未查询到法定代表人身份信息",
                    ISSAMEFLAG: false
                }
            }
            let compareResult = that.getCustCompareInfoText(param, resultData[0]);
            return {
                LOCALCUSTINFO: param,
                CSDCCUSTINFO: compareResult.csdcInfo,
                RESULTSTR: compareResult.isSameFlag ? "" : param.isAgent == "1"?  "代理人身份信息校验不一致！" : param.USER_TYPE == "0" ? "客户身份信息校验不一致！" : "法定代表人身份信息校验不一致！" ,
                ISSAMEFLAG: compareResult.isSameFlag
            };
        })
    },
    // 查询本地已有的客户身份信息验证结果信息
    getCustIdentityValidResult(param) {
        return sysConfig.$syscfg.K_Request("YG210418", param).then(res => {
            return res.Data;
        })
    }, 
    getCustCompareInfoText(localInfo, csdcInfo) {
        let isSameFlag = true;
        // 姓名
        if (localInfo.CUST_FNAME != csdcInfo.CUST_FNAME) {
            csdcInfo.CUST_FNAME_RESULT = "不一致";
            isSameFlag = false;
        } else {
            csdcInfo.CUST_FNAME_RESULT = "一致";
        }
        // 身份证号码
        if (localInfo.ID_CODE != csdcInfo.ID_CODE) {
            csdcInfo.ID_CODE_RESULT = "不一致";
            isSameFlag = false;
        } else {
            csdcInfo.ID_CODE_RESULT = "一致";
        }
        return {
            csdcInfo: csdcInfo,
            isSameFlag: isSameFlag
        };
    },
    isServiceTime(param) {
        if (!param.RES_IDS) {
            return {
                flag: false,
                msg: "RES_IDS未传入"
            };
        }
        return sysConfig.$syscfg.K_Request("YG003825", param).then(res => {
            return {
                flag: _.get(res, "Data[0].CHECK_FLAG", "false") === "true" ? true : false,
                msg: _.get(res, "Data[0].CHECK_MSG", "")
            }
        })
    },
    getCustCSDCChineseIdTypeInfo(param) {
        let req = _.extend({
            OPERATOR_TYPE: "0",
            CHK_STATUS : "2",
            F_CUST_ORG_CODE : param.ORG_CODE || param.INT_ORG
        }, param || {});

        return sysConfig.$syscfg.K_Request("Y3000004", req).then(res => {
            let head = {
                MSG_CODE: res.Code,
                MSG_TEXT: res.Msg
            }
            if (res.Data.length && !_.isEmpty(res.Data[0].SERIAL_NO)) {
                return sysConfig.$syscfg.K_Request("Y3000001", {
                    LBM: "KUAS_L2100027",
                    SERIAL_NO: res.Data[0].SERIAL_NO
                }).then(res => {
                    var tempObj = _.pick(res.Data && res.Data[0] || {}, "CITIZENSHIP", "SEX", "BIRTHDAY", "DECLARE_DATE");
                    _.each(res.Data, function(obj) {
                        _.extend(obj, tempObj);
                    });
                    return {
                        DATA: res.Data,
                        HEAD: head
                    }
                })
            }
            return {
                DATA: res.Data,
                HEAD: head
            };
        }).catch(err => {
            return {
                DATA: [],
                HEAD: {
                    MSG_CODE: '-1001',
                    MSG_TEXT: err
                }
            };
        })
        
    },
    getCsdcFaceValidate(param) {
        return this.isServiceTime({
            RES_IDS: "5",
            RES_TYPE: "1"
        }).then(isCsdcTime => {
            if (isCsdcTime && isCsdcTime.flag) {
                return new Promise((resolve, reject) => {
                    this.dealImage(storage.$storage.getSession(definecfg.$definecfg.FACE_IMAGE), 200, (base64) => {
                        let csdcReq = _.extend({
                            ACCTBIZ_EXCODE:"23", //用戶身份信息核查
                            CUST_FNAME: param.CUST_FNAME,
                            ID_TYPE: param.ID_TYPE,
                            ID_CODE: param.ID_CODE,
                            ATTACHMENT_NAME: date.getClientDate() + parseInt(Math.random() * 1000000) + ".jpg",
                            IMG_BASE64_DATA: base64.split(';base64,')[1],
                            IS_NEED_IMG_DATA: "1",//后台进行base64转byte[]的标识
                            ACCTBIZ_CLS: "03", // 03 人像比对
                            OPERATOR_TYPE: "0",
                            CHK_STATUS: "2",
                        });
                        return sysConfig.$syscfg.K_Request("Y3000004", csdcReq).then(res => {
                            let chkObj = res.Data[0] || {
                                FLAG: '0',
                                OUTPUT: '中登人像比对失败'
                            }
                            if ( !_.isEmpty(chkObj) ) {
                                chkObj.FLAG = chkObj.RTN_ERR_CODE == "0000" ? "1" : "0";
                                chkObj.OUTPUT = chkObj.RETURN_MSG;
                            }
                            resolve(chkObj);
                        }).catch(err => {
                            let chkObj = {};
                            chkObj.FLAG = "0";
                            chkObj.OUTPUT = err ||"中登人像比对失败";
                            resolve(chkObj)
                        })
                    })
                })
            } else {
                // 非中登时间无法校验，即校验不通过
                let chkObj = {
                    serviceTimeFlag: false,
                    FLAG: '0'
                }
                return chkObj;
            }
        })
    },
    dealImage(base64, w, callback) {
        var newImage = new Image();
        var quality = 0.6;    //压缩系数0-1之间
        newImage.src = 'data:image/gif;base64,' + base64;
        newImage.setAttribute("crossOrigin", 'Anonymous');	//url为外域时需要
        var imgWidth, imgHeight;
        newImage.onload = function () {
            imgWidth = this.width;
            imgHeight = this.height;
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            if (Math.max(imgWidth, imgHeight) > w) {
                if (imgWidth > imgHeight) {
                    canvas.width = w;
                    canvas.height = w * imgHeight / imgWidth;
                } else {
                    canvas.height = w;
                    canvas.width = w * imgWidth / imgHeight;
                }
            } else {
                canvas.width = imgWidth;
                canvas.height = imgHeight;
                quality = 0.6;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
            var base64 = canvas.toDataURL("image/jpeg", quality); //压缩语句
            // 防止最后一次压缩低于最低尺寸，只要quality递减合理，无需考虑
            while (base64.length / 1024 > 30) {
                quality -= 0.01;
                base64 = canvas.toDataURL("image/jpeg", quality);
            }
            while (base64.length / 1024 < 15) {
            	quality += 0.001;
            	base64 = canvas.toDataURL("image/jpeg", quality);
            }
            callback(base64);
        }
    },
    getSysCustCsdcYmtCode(param) {
        let that = this;
        param = param || {};
        // 产品户 或 特殊机构 不查询中登一码通号码
        if (param.USER_TYPE == "2" || (param.USER_TYPE == "1" && oppService.isSpeOrg(param.SZORGTYPE))) {
            return new Promise(resolve => resolve(""));
        }
        return that.isServiceTime({
            RES_IDS: "1",
            RES_TYPE: "1"
        }).then(function (data) {
            // 非中登服务时间，不查询中登一码通号码
            if (!data || !data.flag) {
                return "";
            }
            var custFname = param.USER_FNAME || param.CUST_FNAME || urlParam.USER_FNAME,
                idType = param.ID_TYPE || urlParam.ID_TYPE,
                idCode = param.ID_CODE || urlParam.ID_CODE;
            return that.getCSDCYmtData(custFname, idType, idCode).then(function (data) {
                var ymtArr = _.filter(data, function (obj) {
                        return obj.YMT_STATUS == "0";
                    }),
                    tmpObj = _.groupBy(ymtArr, function (obj) {
                        return obj.ID_CODE.length;
                    }),
                    ymtInfoObj = {},
                    ymtCode = "";
                if (param.USER_TYPE == "0") {
                    // 个人客户，优先采用18位身份证开通的一码通，然后才是15位身份证开的
                    ymtInfoObj = tmpObj["18"] && tmpObj["18"][0] || tmpObj["15"] && tmpObj["15"][0] || ymtArr[0] || {};
                } else {
                    // 机构客户取第一条记录
                    ymtInfoObj = ymtArr[0] || {};
                }
                ymtCode = ymtInfoObj && ymtInfoObj.YMT_CODE || "";
                return ymtCode
            });
        });
    },
    getCustCSDCInfoByOther(param) {
        let req = _.extend({
            service:  "Y3000004",
            OPERATOR_TYPE: "0",
            CHK_STATUS : "2",
            F_CUST_ORG_CODE : param.F_CUST_ORG_CODE || param.INT_ORG || param.ORG_CODE
        }, params || {});
        return sysConfig.$syscfg.K_Request("Y3000004", req).then(res => {
            return _.get(res, "Data", [])
        })
    }
}