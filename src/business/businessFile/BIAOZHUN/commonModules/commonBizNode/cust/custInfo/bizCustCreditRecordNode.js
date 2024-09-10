/*
 *   诚信记录信息模块
 *   方法封装
 */

import bizPublicMethod from "../../../../../../businessTools/bizPublicMethod.js"
import bizPublicSaveMethod from "../../../../../../businessTools/bizPublicSaveMethod.js"
import * as utils from "../../../../../../../tools/util.js"
import date from "../../../../../../../tools/date.js"

//开户和非开户 字段数据加载 公共操作
const bizCustCreditRecordNodeBeforeLoadBizCommon = (_this) => {
    
}

export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizCustCreditRecordNodeBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     *@Date: 2019-06-11 15:19:09
     */
    bizCustCreditRecordNodeBeforeLoadBiz: function (_this) {
        bizCustCreditRecordNodeBeforeLoadBizCommon(_this)

    },
    bizCustCreditRecordNodeBeforeLoadBizOpenAcct: function (_this) {
        bizCustCreditRecordNodeBeforeLoadBizCommon(_this)
    },
    /*
     *@method bizCustCreditRecordNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     *@Date: 2019-06-13 09:42:56
     */
    bizCustCreditRecordNodeAfterLoadBiz: function (_this) {
        //重新解析历史数据
        if(_this.oppBusiData.newBusiData && _this.oppBusiData.newBusiData.RELA_INFO ){
            let creditRecordInfo = _.get(_this.oppBusiData.newBusiData, "RELA_INFO.CREDIT_RECORD_INFO", {});
            if (!_.isEmpty(creditRecordInfo)) {
                bizPublicMethod.$blMethod.parseMoudleArray(_this, _this.groupDatas.APPR_INFO["CREDIT_RECORD_INFO"], creditRecordInfo)
            }
        }
    },
    /*
     *@method bizCustCreditRecordNodeBeforeSave
     *@desc 钩子函数 自定义保存数
     *@Date: 2019-06-11 15:19:09
     */
    bizCustCreditRecordNodeBeforeSave: function (_this, params) {
        let creditRecordInfo = bizPublicSaveMethod.getModuleArrFoyKey(_this, "CREDIT_RECORD_INFO");
        let busiData = _this.oppBusiData.newBusiData;
            let relaInfo = busiData && busiData.RELA_INFO || {};
            relaInfo.CREDIT_RECORD_INFO = creditRecordInfo;

            !params.RELA_INFO && (params.RELA_INFO = {})
            Object.assign(params.RELA_INFO, relaInfo);
    },
    /*
     *@method bizCustCreditRecordNodeAfterSave
     *@desc 钩子函数 自定义保存数
     */
    bizCustCreditRecordNodeAfterSave: (_this, newData) => {
        if (_this.oppBusiData.newBusiData) {
            let newObj = { 
                RELA_INFO: _.get(newData, "RELA_INFO", {})
            }
            _.assign(_this.oppBusiData.newBusiData, newObj);
        }
    },
    /*
     *@method bizCustCreditRecordNodeValidate
     *@desc 钩子函数 下一步验证
     *@Date: 2019-06-11 15:19:09
     */
    bizCustCreditRecordNodeValidate: function (_this) {
    },

    /*
     *@method bizCustCreditRecordNodePageActivated
     *@desc 钩子函数：页面激活
     *@Date: 2019-06-11 15:19:09
     */
    bizCustCreditRecordNodePageActivated: function (_this) {
        
    },

    bizCustCreditRecordNodePreValidate: function(_this) {
    },
    //----------------------业务函数----------------------------------//
    CHECK_HAS_CREDIT_RECORD: (_this, field, fieldData) => {
        let defaultValue = field.DEFAULT_VALUE || "";
        if (defaultValue == "1") {
            fieldData.RECORD_SOURCE.FIELD_CONTROL = "0";
            fieldData.RECORD_SCORE.FIELD_CONTROL = "0";
            fieldData.RECORD_TXT.FIELD_CONTROL = "0"
        } else {
            fieldData.RECORD_SOURCE.FIELD_CONTROL = "1";
            fieldData.RECORD_SOURCE.DEFAULT_VALUE = "";
            fieldData.RECORD_SCORE.FIELD_CONTROL = "1";
            fieldData.RECORD_SCORE.DEFAULT_VALUE = "";
            fieldData.RECORD_TXT.FIELD_CONTROL = "1";
            fieldData.RECORD_TXT.DEFAULT_VALUE = "";
        }
    }
}