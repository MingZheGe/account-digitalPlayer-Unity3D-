/*
 *   实际控制人
 *   方法封装
 *   @author  yangyp
 */

import date from '../../../../../../../tools/date.js'
import * as utils from "../../../../../../../tools/util"
import smsService from '../../../../../../../service/sms-service'
import * as bizPubTools from "./../../bizPublicTools"
import stringConfig from "../../../../../../../tools/stringConfig.js"
import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../../business/businessTools/bizPublicMethod.js"

const fetchOrgActualControllerInfo = (_this,param)=> {
    return _this.$syscfg.K_Request('W0000119', param)
}
export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizProControllerNodeBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizProControllerNodeBeforeLoadBiz: function (_this) {
        // 字段设置
        
        // if(_this.oppBusiData.oldBusiData && _this.oppBusiData.oldBusiData.ORG_CONTROLER_INFO_INFO && Object.keys(_this.oppBusiData.oldBusiData.ORG_CONTROLER_INFO_INFO).length) {
        //     bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["ORG_CONTROLER_INFO"], _this.oppBusiData.oldBusiData.ORG_CONTROLER_INFO_INFO);  
        // }
        
    },
    /*
     *@method bizProControllerNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-13 09:42:56
     */
    bizProControllerNodeAfterLoadBiz: function (_this) {
        // if(_this.oppBusiData.newBusiData && _this.oppBusiData.newBusiData.ORG_CONTROLER_INFO
        //     && Object.keys(_this.oppBusiData.newBusiData.ORG_CONTROLER_INFO).length
        //     && _this.oppBusiData.newBusiData.ORG_CONTROLER_INFO.OP_TYPE!="2"){
        //     bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["ORG_CONTROLER_INFO"], _this.oppBusiData.newBusiData.ORG_CONTROLER_INFO);      
        // }
    },
    /*
     *@method bizProControllerNodeBeforeSave
     *@desc 钩子函数 自定义保存数
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizProControllerNodeBeforeSave: async function (_this, params) {
        
    },
    /*
     *@method bizProControllerNodeValidate
     *@desc 钩子函数 下一步验证
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizProControllerNodeValidate: function (_this) {
      
    },

    /*
     *@method bizProControllerNodePageActivated
     *@desc 钩子函数：页面激活
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizProControllerNodePageActivated: function (_this, groupId) {

        _this.$set( _this.groupDatas.ORG_INFO.ORG_CONTROLER_INFO[0], "MODULE_CUSTOMIZE_TXT", _this.oppBusiData.copyContentName)
        _this.$set(_this.groupDatas.ORG_INFO.ORG_CONTROLER_INFO[0], "MODULE_CUSTOMIZE", '1');
        
        let fields = _this.groupDatas.ORG_INFO.ORG_CONTROLER_INFO[0].FIELDS;     
        fields.CONTROLER_NAME.VALID_TYPE = "length[4,64]";
        fields["CONTROLER_NUM"].FIELD_CONTROL = "1";
        fields["CONTROLER_ID_EXP_DATE"].VALID_TYPE = "end";
        fields.CONTROLER_ID_NO.VALID_TYPE = "val[0,32]|on-blur|on-prompt";
        fields.CONTROLER_ID_NO.promptValue =  fields.CONTROLER_ID_NO.DEFAULT_VALUE;
        _this.groupDatas["ORG_INFO"]["ORG_CONTROLER_INFO"][0].FIELDS.CONTROLER_ID_NO.promptValue = _this.groupDatas["ORG_INFO"]["ORG_CONTROLER_INFO"][0].FIELDS.CONTROLER_ID_NO.DEFAULT_VALUE;
       
        _this.$refs.flowTip.flowTips = [];
        if (fields.CONTROLER_ID_EXP_DATE.DEFAULT_VALUE && date.compareDate(fields.CONTROLER_ID_EXP_DATE.DEFAULT_VALUE, date.getClientDate("yyyyMMdd")) == -1 ) {
            _this.pushFlowTip({
                title:"实际控制人证件有效截止日期[" + fields.CONTROLER_ID_EXP_DATE.DEFAULT_VALUE + "]小于当前系统日期[" + date.getClientDate("yyyyMMdd") + "]！",
                key:'warningTip',
                type:'warning'
            })
        }
    },
    /**
     * 实际控制人
     * 
     * custBasicInfo 选择的是_this内部的，可以选择session内部的，或者_this.groupDatas里面的
     */
    CHECK_CONTROLER_RELATION:(_this, field, fieldData) => {
        let old = _this.oppBusiData.newBusiData &&  _this.oppBusiData.newBusiData.ORG_CONTROLER_INFO;
        if (old && old.CONTROLER_RELATION && field.DEFAULT_VALUE == old.CONTROLER_RELATION) {
            fieldData["CONTROLER_NAME"].DEFAULT_VALUE = old && old.CONTROLER_NAME;
            fieldData["CONTROLER_ID_TYPE"].DEFAULT_VALUE = old && old.CONTROLER_ID_TYPE;
            fieldData["CONTROLER_ID_NO"].DEFAULT_VALUE = old && old.CONTROLER_ID_NO;
            fieldData["CONTROLER_ID_EXP_DATE"].DEFAULT_VALUE = old && old.CONTROLER_ID_EXP_DATE;
            fieldData["CONTROLER_ID_NO"].promptValue = old && old.CONTROLER_ID_NO;
        } else {
            for (let key in fieldData) {
                if (key != "CONTROLER_RELATION"&&key !== "CONTROLER_NUM") {
                    fieldData[key].FIELD_CONTROL = "0";
                    fieldData[key].DEFAULT_VALUE = "";
                }
            }
        }
        if(field.DEFAULT_VALUE == "0Z"){
            _this.groupDatas.ORG_INFO.ORG_CONTROLER_INFO[0].MODULE_READ = "0";
        }else{
            _this.groupDatas.ORG_INFO.ORG_CONTROLER_INFO[0].MODULE_READ = "1";
        }
        
    },
    CHECK_CONTROLER_ID_TYPE:(_this, field, fieldData) => {
        
        if (_.indexOf(["0b", "0c"], field.DEFAULT_VALUE) !== -1) {
            _this.groupDatas.ORG_INFO.ORG_CONTROLER_INFO[0].FIELDS.CONTROLER_ID_NO.VALID_TYPE = 'fixedNumLength[9]|on-prompt|on-blur'
        } else if(field.DEFAULT_VALUE == '0d') {
            _this.groupDatas.ORG_INFO.ORG_CONTROLER_INFO[0].FIELDS.CONTROLER_ID_NO.VALID_TYPE = 'fixedNumLength[8]|on-prompt|on-blur'
        } else if (field.DEFAULT_VALUE == '00' || field.DEFAULT_VALUE == '08') {
            _this.groupDatas.ORG_INFO.ORG_CONTROLER_INFO[0].FIELDS.CONTROLER_ID_NO.VALID_TYPE = 'iscard|on-prompt|on-blur'
        } else if (field.DEFAULT_VALUE == '10') {
            _this.groupDatas.ORG_INFO.ORG_CONTROLER_INFO[0].FIELDS.CONTROLER_ID_NO.VALID_TYPE = 'licensecode|on-prompt|on-blur'
        } else {
            _this.groupDatas.ORG_INFO.ORG_CONTROLER_INFO[0].FIELDS.CONTROLER_ID_NO.VALID_TYPE = 'charMinus[0,32]|on-prompt|on-blur'
        }
        if((field.DEFAULT_VALUE == field.FIELD_LAST_VALUE || field.FIELD_LAST_VALUE == "") && field.DEFAULT_VALUE != "" ) return;
        field.FIELD_LAST_VALUE = field.DEFAULT_VALUE;
        fieldData.CONTROLER_ID_NO.DEFAULT_VALUE = "";
        fieldData.CONTROLER_ID_NO.promptValue = ""; 
        let LEGAL_INFO = _.get(_this.groupDatas, 'ORG_INFO.LEGAL_INFO[0].FIELDS', {});
        let newOld = _.get(_this.oppBusiData,"ORG_CONTROLER_INFO",{});
        if((field.DEFAULT_VALUE == LEGAL_INFO.LEGAL_REP_ID_TYPE.DEFAULT_VALUE && fieldData.CONTROLER_ID_NO.DEFAULT_VALUE == LEGAL_INFO.LEGAL_REP_ID_CODE.DEFAULT_VALUE)
         || (field.DEFAULT_VALUE == newOld.CONTROLER_ID_TYPE && fieldData.CONTROLER_ID_NO.DEFAULT_VALUE == newOld.CONTROLER_ID_NO)){} else {
            fieldData.CONTROLER_ID_NO.DEFAULT_VALUE = "";
            fieldData.CONTROLER_ID_NO.promptValue = "";
        }
        
    },
    CHECK_CONTROLLER_MODULE_RADIO:(_this, field, fieldData) => {
        if(field.DEFAULT_VALUE === "true"){
            let legalFields = _this.groupDatas.ORG_INFO.LEGAL_INFO[0].FIELDS;
            fieldData.CONTROLER_NAME.DEFAULT_VALUE = legalFields.LEGAL_REP.DEFAULT_VALUE;
            fieldData.CONTROLER_ID_NO.DEFAULT_VALUE = legalFields.LEGAL_REP_ID_CODE.DEFAULT_VALUE;
            fieldData.CONTROLER_ID_EXP_DATE.DEFAULT_VALUE = legalFields.LEGAL_REP_ID_EXP_DATE.DEFAULT_VALUE;
            fieldData.CONTROLER_ID_TYPE.DEFAULT_VALUE = legalFields.LEGAL_REP_ID_TYPE.DEFAULT_VALUE;
        }else{
            fieldData.CONTROLER_NAME.DEFAULT_VALUE = _this.oppBusiData.newBusiData.ORG_CONTROLER_INFO_INFO && _this.oppBusiData.newBusiData.ORG_CONTROLER_INFO_INFO.CONTROLER_NAME || "";
            fieldData.CONTROLER_ID_NO.DEFAULT_VALUE = _this.oppBusiData.newBusiData.ORG_CONTROLER_INFO_INFO && _this.oppBusiData.newBusiData.ORG_CONTROLER_INFO_INFO.CONTROLER_ID_NO || "";
            fieldData.CONTROLER_ID_EXP_DATE.DEFAULT_VALUE = _this.oppBusiData.newBusiData.ORG_CONTROLER_INFO_INFO && _this.oppBusiData.newBusiData.ORG_CONTROLER_INFO_INFO.CONTROLER_ID_EXP_DATE || "";
            fieldData.CONTROLER_ID_TYPE.DEFAULT_VALUE = _this.oppBusiData.newBusiData.ORG_CONTROLER_INFO_INFO && _this.oppBusiData.newBusiData.ORG_CONTROLER_INFO_INFO.CONTROLER_ID_TYPE || "";
        }
    },
    CONTROLLER_MODULE_customizeModule: (_this, moduleId, fieldData) => {
    }

}


