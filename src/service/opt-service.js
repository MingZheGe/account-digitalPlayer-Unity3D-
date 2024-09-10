import custService from "./cust-service"
import sysConfig from "../config/sysConfig.js";

export default {
    /**
     * 期权资产账户信息查询
     * @param custCode
     * @param param
     * @returns {*}
     */
    getOptCuacctInfo: (custCode, param) => {
        return custService.getCustFundInfo(custCode, _.extend(param || {}, {CUACCT_ATTR: "3"})).then(function (data) {
            var cuacctInfo = _.filter(data || [], function (obj) {
                return "3" == obj.CUACCT_ATTR;
            });
            return cuacctInfo;
        });
    },
    /**
     * 证券衍生账户信息查询
     * @param custCode [客户代码]
     * @param param    []
     * @returns {*}
     */
    getOptTrdacctInfo: (custCode, param) => {
        return  sysConfig.$syscfg.K_Request("W0000119", _.extend({
            bex_codes: "YGT_A1160815",
            CUST_CODE: custCode
        }, param || {})).then(function (data) {
            return data && data.Data || [];
        });
    },
    /**
     * 查询客户银衍签约信息
     * @param custCode
     * @param param
     * @returns {*}
     */
    getOptBankSignInfo: (custCode, param) => {
        return custService.getCustBankSignInfo(custCode, _.extend(param || {}, {OPT_FLAG: "1"})).then(function (data) {
            return data && data.Data || [];
        });
    },
    async getJGInfo(param, arr) {
        let that = this;
        return this.getHisoryJGInfo(param).then(data => {
            arr.push(...data)
            if (data.length == param.num) {
                param.pos = param.pos + param.num + 1;
                return this.getJGInfo(param, arr)
            }
            return arr;
        });
    },
    /**
     * 历史交割单查询 每次只能查三个月的
     */
    getHisoryJGInfo(param) {
        return sysConfig.$syscfg.K_Request("Y3000001", {
            LBM:"KSOT_L2912039",
            BGN_DATE:param.beginDate,
            END_DATE:param.endDate,
            QRY_POS: param.pos,
            QRY_NUM: param.num,
            CUST_CODE: param.CUST_CODE,
            CUACCT_CODE: param.CUACCT_CODE
        }).then(res => {
            let data = res.Data || [];
            return data
        })
    },
    async getFundInfo(param, arr) {
        let that = this;
        return this.getHisoryFundInfo(param).then(data => {
            arr.push(...data)
            if (data.length == param.num) {
                param.pos = param.pos + param.num + 1;
                return this.getJGInfo(param, arr)
            }
            return arr;
        });
    },
    /**
     * 对账单历史资金资产查询 L2912018
     */
    getHisoryFundInfo(param){
        return sysConfig.$syscfg.K_Request("Y3000001", {
            LBM:"KSOT_L2912018",
            BGN_DATE:param.beginDate,
            END_DATE:param.endDate,
            QRY_POS: param.pos,
            QRY_NUM: param.num,
            CUST_CODE: param.CUST_CODE,
            CUACCT_CODE: param.CUACCT_CODE
        }).then(res => {
            let data = res.Data || [];
            return data
        })
    }
}