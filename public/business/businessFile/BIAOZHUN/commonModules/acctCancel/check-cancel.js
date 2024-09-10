import custService from "../../../../../service/cust-service";

export default {
    /**
         * 封装校验数据对象  提供给私有模块调用
         * @param chk_type        销户检查类型（CHK_TYPE）
         * @param chk_arr         销户检查数据（数组）
         * @param cust_ext_attr   销户检查客户类型（CUST_EXT_ATTR）
         * @param field_trans_arr 销户检查数据与原始数据有不同的域值（数组）
         * @returns {{CHECK_ARR: Array, IS_CONTINUE: boolean, OPER_TYPE: boolean}}
         */
    setCheckArr: function (chk_type, chk_arr, cust_ext_attr, field_trans_arr) {
        var checkvalArr = [],hasRecord = false,isContinue = true,
            fieldArr = [],//检查类型对应必传参数的域值数组
            fieldTransArr = [];//检查数据与原始数据有不同的域值
        switch (chk_type){
            /*CHK_TYPE:00-客户销户，客户代码 + 检查类型（00=客户）+ 客户扩展属性
                       checkval数组项：CUST_CODE,CUST_EXT_ATTR,CHK_TYPE

              CHK_TYPE:01-资金账户销户/银证账户销户，客户代码 + 检查类型（01=资金账户）+ 客户扩展属性 + 账户（资金账户）
                       04-资金账户销户/银证账户销户，客户代码 + 检查类型（04=支付账户）+ 客户扩展属性 + 账户（支付账户）
                       06-合同终止，客户代码 + 检查类型（06=合同终止）+ 客户扩展属性 + 账户（资金账户：U版必传）
                       checkval数组项：CUST_CODE,CUACCT_CODE,CUST_EXT_ATTR,CHK_TYPE

              CHK_TYPE:02-证券账户销户，客户代码 + 检查类型（02=证券账户）+ 客户扩展属性 + 市场（板块）+ 账户（股东代码）
                       08-上海撤指定，客户代码 + 检查类型（08=沪市撤指定）+ 客户扩展属性 + 市场（板块）+ 账户（股东代码）
                       checkval数组项：CUST_CODE,CUACCT_CODE,STKBD,ACCT,CUST_EXT_ATTR,CHK_TYPE

              CHK_TYPE:03-基金账户销户，客户代码 + 检查类型（03=基金账户）+ 客户扩展属性 + 市场（基金代码）
                       05-登记账户销户，客户代码 + 检查类型（05=登记账户）+ 客户扩展属性 + 市场（登记代码）
                       checkval数组项：CUST_CODE,STKBD,CUST_EXT_ATTR,CHK_TYPE

              CHK_TYPE:07-深圳转托管，客户代码 + 检查类型（07=深圳转托管）+ 客户扩展属性 + 市场（板块）+ 账户（股东代码）
                       checkval数组项：CUST_CODE,CUACCT_CODE,STKBD,ACCT,STK_CODE(为空值时表示全体转托管),CUST_EXT_ATTR,CHK_TYPE

             CHK_TYPE:09-财富账户销户，客户代码 + 检查类型（09=财富账户）+ 客户扩展属性 + 财富账户 + 账户（资金账户）
                       checkval数组项：CUST_CODE,CUACCT_CODE,FORTUNE_CODE,CUST_EXT_ATTR,CHK_TYPE
            */
            case "00":
                fieldArr = ["CUST_CODE"];
                break;
            case "01":
            case "04":
            case "06":
                fieldArr = ["CUST_CODE", "CUACCT_CODE"];
                break;
            case "02":
            case "08":
                fieldArr = ["CUST_CODE", "CUACCT_CODE", "STKBD", "ACCT"];
                fieldTransArr = [{key: "ACCT", value: "TRDACCT"}];
                break;
            case "03":
                fieldArr = ["CUST_CODE", "STKBD"];
                fieldTransArr = [{key: "STKBD", value: "TA_CODE"}];
                break;
            case "05":
                fieldArr = ["CUST_CODE", "STKBD"];
                fieldTransArr = [{key: "STKBD", value: "OTC_CODE"}];
                break;
            case "09":
                fieldArr = ["CUST_CODE", "CUACCT_CODE", "FORTUNE_CODE"];
                break;
        }

        //外部私有模块有传入转换入参域值数组则使用外部数组field_trans_arr，外部没有传入则使用默认的fieldTransArr
        fieldTransArr = !_.isEmpty(field_trans_arr) ? field_trans_arr : fieldTransArr;
        _.each(chk_arr, function(obj){
            if(!obj || _.isEmpty(obj)){
                return false;
            }
            hasRecord = true;

            if(!_.isEmpty(fieldTransArr)){
                _.each(fieldTransArr, function (o) {
                    obj[o.key] = obj[o.value];
                });
            }
            checkvalArr.push(_.extend({
                CUST_EXT_ATTR: cust_ext_attr,
                CHK_TYPE: chk_type
            }, _.pick(obj, fieldArr)));
        });

        return {
            CHECK_ARR : checkvalArr,
            IS_CONTINUE: isContinue,
            OPER_TYPE : hasRecord
        };
    },
    /**
     * 销户检验
     * @param checkTypeObj 销户校验数组对象：
     *         CUST_CANCEL_INFO：         00-客户销户
     *         CUACCT_CANCEL_INFO：       09-银证账户销户，01-资产账户销户，
     *         STK_ACCOUNT_CANCEL_INFO：  02-证券账户销户
     *         FUND_ACCOUNT_CANCEL_INFO:  03-基金账户销户
     *         PAY_CANCEL_INFO：          04-支付账户销户
     *         OTCCODE_CANCEL_INFO：      05-登记账户销户
     *         CONTRACT_CANCEL_INFO：     06-合同终止
     *         SH_CZD_INFO：               4-上海撤指定
     *         SZ_ZTG_INFO：               0-深圳转托管，1-深A全体转托管
     *         GZ_ZTG_INFO：               2-股转转托管，3-股转全体转托管
     *         FUND_ZTG_INFO：             6-基金转托管
     */
    cancelCheckType: function (checkTypeObj, opts) {
        var that = this,
            checkedData = opts && opts.checkedData || null;
        return Promise.all([
            !checkedData ? custService.cancelCheckType(checkTypeObj) : checkedData
        ]).then(function ([checkedData]) {
            /* 销户检查参数：
               CHECK_TYPE     4-上海撤销指定，0-深A转托管，1-深A全体转托管，2-股转转托管，3-股转全体转托管，6-基金转托管，
                              04-支付账户销户，05-登记账户销户，06-合同终止，
                              02-证券账户销户，03-基金账户销户，
                              09-银证账户销户，01-资产账户销户，
                              00-客户销户
                CUST_EXT_ATTR 0-普通客户，1-信用交易客户，2-OTC客户，3-股票期权客户，5-资金系统客户，7-VIP客户，11-账户客户
                ERR_LEVEL     1-禁止 2-警告 3-提示
                ERR_DESC
                只要销户检查接口中有错误级别为0的 不能下一步到采影像环节
                只要销户检查接口中有错误级别为1的 ，则只做提示，可以提交到审核
            */
            checkedData = _.uniq(checkedData, "ERROR_MSG") || []; //根据返回的错误信息去重
            if (checkedData.length) {
                return checkedData;
            } else {
                return true;
            }
        })
    },
    // 期权销户检查
    checkOptCancel (cancelCustArr, cancelCuacctArr, cancelTrdacctArr, busiCode) {
        let that = this;
        let cuacctFieldTransArr = [{key: "CUST_CODE", value: "USER_CODE"}],
            custCancelObj = that.setCheckArr("00", cancelCustArr, "3") || {},//期权客户销户
            cuacctCancelObj = that.setCheckArr("01", cancelCuacctArr, "3", cuacctFieldTransArr) || {},//期权资金账户销户
            stkAccountCancelObj = that.setCheckArr("02", cancelTrdacctArr, "3") || {};//期权证券账户销户
        let checkTypeObj = {
            CUST_CANCEL_INFO: custCancelObj.CHECK_ARR || [],
            CUACCT_CANCEL_INFO: cuacctCancelObj.CHECK_ARR || [],
            STK_ACCOUNT_CANCEL_INFO: stkAccountCancelObj.CHECK_ARR || [],
            BUSI_CODE: busiCode
        };
        return that.cancelCheckType(checkTypeObj) || true;
    },
    checkCreditCancel (cancelCustArr, cancelCuacctArr, cancelTrdacctArr, contractInfo, busiCode) {
        let that = this;
        let cuacctFieldTransArr = [{key: "CUST_CODE", value: "USER_CODE"}],
            custCancelObj = that.setCheckArr("00", cancelCustArr, "1") || {},//信用客户销户
            cuacctCancelObj = that.setCheckArr("01", cancelCuacctArr, "1", cuacctFieldTransArr) || {},//信用资金账户销户
            stkAccountCancelObj = that.setCheckArr("02", cancelTrdacctArr, "1") || {},//信用证券账户销户
            contractCancelObj = that.setCheckArr("06", [contractInfo], "1") || {};//信用合同终止
        var checkTypeObj = {
            CUST_CANCEL_INFO: custCancelObj.CHECK_ARR || [],
            CUACCT_CANCEL_INFO: cuacctCancelObj.CHECK_ARR || [],
            STK_ACCOUNT_CANCEL_INFO: stkAccountCancelObj.CHECK_ARR || [],
            CONTRACT_CANCEL_INFO: contractCancelObj.CHECK_ARR || [],
            BUSI_CODE: busiCode
        };
        return that.cancelCheckType(checkTypeObj) || true;
    },

}