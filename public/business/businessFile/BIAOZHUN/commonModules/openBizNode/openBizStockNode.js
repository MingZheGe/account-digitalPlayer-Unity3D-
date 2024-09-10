import tool_dict from '../../../../../tools/dict.js';
import custService from '../../../../../service/cust-service';
import csdcService from '../../../../../service/csdc-service';
import date from "../../../../../tools/date";
import oppService from "../../../../../service/opp-service";

//股东模块初始化接口
const W0000348 = (_this, param) => {
    return _this.$syscfg.K_Request('W0000348', param).then(res=>{
        let csdcTrdacctArr = res.Data&&res.Data[0]&&res.Data[0].csdcTrdacctArr||[];
        return tool_dict.transformDict(_.map(csdcTrdacctArr,(acct) => (Object.assign({},acct,{"TRDACCT_STATUS":acct.ACCT_STATUS}))),["TRDACCT_STATUS"]).then((res1) => {
            Object.assign(res.Data[0],{csdcTrdacctArr:res1});
            return res;
        });
    })
}    
const openBizStockNode =  _.merge({
    'openBizStockNodeBeforeLoadBiz' :(_this) => {
        let custObj = Object.assign({},_this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO),
                 (_this.historyData.ORG_INFO&&_this.historyData.ORG_INFO.ORG_BASIC_INFO[0]) || (_this.historyData.CUST_INFO&&_this.historyData.CUST_INFO.CUST_BASIC_INFO[0]));
        let userInfo = _this.$storage.getJsonSession(_this.$definecfg.USER_INFO);
        _this.oppBusiData.custObj = custObj;
        _this.oppBusiData.userInfo = userInfo;
        let params = {
            USER_TYPE: _this.userType,
            "ID_TYPE": custObj&&custObj.ID_TYPE,
            "ID_CODE": custObj&&custObj.ID_CODE,
            "CUST_FNAME": custObj&&custObj.USER_FNAME || custObj.CUST_FNAME,
            "INT_ORG": userInfo&&userInfo.ORG_CODE,
            "ORG_CODE":userInfo&&userInfo.ORG_CODE,
            "QSJGDM": _this.$basecfg.qsVersion
        }
        _this.oppBusiData.stockBasedata = Object.assign(params,{});
        // // 初始化数据   
        return Promise.all([
            W0000348(_this,params), // 初始化数据获取
            tool_dict.getDictData(["TRDACCT_STATUS", "ACCT_TYPE", "ID_TYPE"]),
        ]).then((res) => {
            console.info("res1 = ", res);
            let res1 = res[0];
            let res2 = res[1]
            if(res1.Code == "0" && res1.Data && res1.Data[0]){
                // 这里看是否需要翻译  证券账户类别
                _this.oppBusiData = Object.assign(_this.oppBusiData, res1.Data[0]);
                _this.oppBusiData.jumpJudgeBusiTimes = res1.Data[0].jumpJudgeBusiTimes && res1.Data[0].jumpJudgeBusiTimes == 'true' || false;
                if(_this.$syscfg.isQSMZ('YINHE')&& _this.oppBusiData.allowGzArr){
                    //银河版本需要排除深基金沪基金
                    _this.oppBusiData.allowGzArr = _this.oppBusiData.allowGzArr.filter(v=>{
                        return v.TRDACCT_EXCLS == '016'
                    })
                }
                _this.oppBusiData["dictData"] = _this.$storage.getJsonLocal(_this.$definecfg.SYS_DICT_CACHE) || {};
                _this.oppBusiData["dictData"]["ACCT_TYPE"] = res2 && res2.ACCT_TYPE;
                _this.oppBusiData["dictData"]["dictAcctStat"] = res2 && res2.TRDACCT_STATUS;
                _this.oppBusiData["dictData"]["ID_TYPE"] = res2&& res2.ID_TYPE;
                //_this.oppBusiData.openLogicData = loginData;
                _.each(_this.oppBusiData.csdcTrdacctArr, (val) => {
                    let accType = _.filter(_this.oppBusiData.dictData.ACCT_TYPE, function (c) {
                        return c.DICT_ITEM == val.ACCT_TYPE
                    })
                    if (accType.length != "0") {
                        val["ACCT_TYPE_TEXT"] = accType[0].DICT_ITEM_NAME
                    }
                });
                _this.oppBusiData.ymtCode = _.get(_this.oppBusiData,"csdcYmtArr[0].YMT_CODE","").trim();
                _this.oppBusiData.CSDC_SEARCH_FALG = true;
            }else{
                _this.$blMethod.showMsgBox(_this, "初始化错误" + res.Msg)
                console.error("股东模块初始化失败1'", res.Msg)
                throw "初始化错误" + res.Msg
            }
        }).catch(err =>{
            _this.oppBusiData.CSDC_SEARCH_FALG = false;
            console.error("股东模块初始化失败2'", err)
            throw err
        })
    },
    'openBizStockNodeAfterLoadBiz' : (_this) => {
        // return setData(_this);
    },
})
export default openBizStockNode;