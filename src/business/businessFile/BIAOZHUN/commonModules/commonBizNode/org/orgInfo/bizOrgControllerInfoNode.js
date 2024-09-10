/*
 *   个人基本信息模块
 *   方法封装
 *   @author  yangyp
 */

import bizPublicMethod from "../../../../../../../business/businessTools/bizPublicMethod.js"
import bizPublicSaveMethod from "../../../../../../businessTools/bizPublicSaveMethod.js"
import date from '../../../../../../../tools/date.js'

export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizOrgControllerInfoNodeBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizOrgControllerInfoNodeBeforeLoadBiz: function (_this) {
        bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["CONTROLLER_INFO"], _this.oppBusiData.oldBusiData.CONTROLLER_INFO);
    },
    /*
     *@method bizOrgControllerInfoNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-13 09:42:56
     */
    bizOrgControllerInfoNodeAfterLoadBiz: function (_this) {
        if(_this.oppBusiData.newBusiData && 
            _this.oppBusiData.newBusiData.CONTROLLER_INFO){
                bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["CONTROLLER_INFO"], _this.oppBusiData.newBusiData.CONTROLLER_INFO);
         }
    },
    /*
     *@method bizOrgControllerInfoNodeBeforeSave
     *@desc 钩子函数 自定义保存数
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizOrgControllerInfoNodeBeforeSave: function (_this, params) {
        let ControlerInfo = {};
        let data2 = [];
        bizPublicMethod.$blMethod.changeObjKeys(_this.groupDatas.ORG_INFO.CONTROLLER_INFO[0].FIELDS, ControlerInfo);
        if(_this.oppBusiData.oldBusiData.CONTROLLER_INFO && Object.keys(_this.oppBusiData.oldBusiData.CONTROLLER_INFO).length) {
            data2 = bizPublicMethod.$blMethod.compareInfoZT(_this.oppBusiData.oldBusiData.CONTROLLER_INFO, ControlerInfo);
        }
        ControlerInfo.CONTROLER_NUM = _this.oppBusiData.oldBusiData.CONTROLLER_INFO && _this.oppBusiData.oldBusiData.CONTROLLER_INFO.CONTROLER_NUM || "";
        params.CONTROLLER_INFO = ControlerInfo;
        params.CONTROLLER_INFO.DIFF_INFO = data2;
        params.CONTROLLER_INFO_COPY = params.CONTROLLER_INFO;
    },
    /*
     *@method bizOrgControllerInfoNodeValidate
     *@desc 钩子函数 下一步验证
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizOrgControllerInfoNodeValidate: function (_this) {
       
    },

    /*
     *@method bizOrgControllerInfoNodePageActivated
     *@desc 钩子函数：页面激活
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizOrgControllerInfoNodePageActivated: function (_this, groupId) {
        
        let fields = _this.groupDatas.ORG_INFO.CONTROLLER_INFO[0].FIELDS;
        fields.CONTROLER_ID_NO.firstValidate = true;
        fields["CONTROLER_ID_EXP_DATE"].VALID_TYPE = "end";

        fields.CONTROLER_ID_TYPE.FIELD_FUNCTION = "CHECK_ORG_CTR_ID_TYPE";
        _this.groupDatas["ORG_INFO"]["CONTROLLER_INFO"][0].FIELDS.CONTROLER_ID_NO.promptValue = _this.groupDatas["ORG_INFO"]["CONTROLLER_INFO"][0].FIELDS.CONTROLER_ID_NO.DEFAULT_VALUE;
      
        _this.$refs.flowTip.flowTips = [];
        if (fields.CONTROLER_ID_EXP_DATE.DEFAULT_VALUE && date.compareDate(fields.CONTROLER_ID_EXP_DATE.DEFAULT_VALUE, date.getClientDate("yyyyMMdd")) == -1 ) {
            _this.pushFlowTip({
                title:"控股人资料的证件有效期截止日期[" + fields.CONTROLER_ID_EXP_DATE.DEFAULT_VALUE + "]小于当前系统日期[" + date.getClientDate("yyyyMMdd") + "]！",
                key:'warningTip',
                type:'warning'
            })
        }
    },

    
    bizOrgControllerInfoNodeGetCustInfo: function (_this, groupId) {},


    CHECK_ORG_CTR_ID_TYPE: function(_this, field, fieldData) {
        if (_this.oppBusiData.idTypeOrgCtr && _this.oppBusiData.idTypeOrgCtr != field.DEFAULT_VALUE){
            fieldData.CONTROLER_ID_NO.DEFAULT_VALUE = ""
        }
        _this.oppBusiData.idTypeOrgCtr = field.DEFAULT_VALUE;
        if (_.indexOf(["0b", "0c"], field.DEFAULT_VALUE) !== -1) {
            fieldData.CONTROLER_ID_NO.VALID_TYPE = 'fixedNumLength[9]|on-prompt|on-blur'
        } else if(field.DEFAULT_VALUE == '0d') {
            fieldData.CONTROLER_ID_NO.VALID_TYPE = 'fixedNumLength[8]|on-prompt|on-blur'
        } else if (field.DEFAULT_VALUE == '00' || field.DEFAULT_VALUE == '08') {
            fieldData.CONTROLER_ID_NO.VALID_TYPE = 'iscard|on-prompt|on-blur'
        }  else if (field.DEFAULT_VALUE == '10') {
            fieldData.CONTROLER_ID_NO.VALID_TYPE = 'licensecode|on-prompt|on-blur'
        } else {
            fieldData.CONTROLER_ID_NO.VALID_TYPE = 'charMinus[0,32]|on-prompt|on-blur'
        }
    }

}
