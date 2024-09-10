/*
 *   投资经验
 *   方法封装
 *   @author  yangyp
 */
import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../../business/businessTools/bizPublicMethod.js"
import date from '../../../../../../../tools/date.js'


export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizInvestmentExperienceNodeBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizInvestmentExperienceNodeBeforeLoadBiz: function (_this) {
        if(_this.oppBusiData.oldBusiData &&
            _this.oppBusiData.oldBusiData.INVESTMENT_EXPERIENCE ){
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["INVESTMENT_EXPERIENCE"], _this.oppBusiData.oldBusiData.INVESTMENT_EXPERIENCE);      
        }
        _this.groupDatas.INVESTMENT_INFO.INVESTMENT_EXPERIENCE[0].FIELDS.EARLY_TRD_DATE.FIELD_CONTROL = "2";
        let isOpenAcct = _this.$storage.getJsonSession(_this.$definecfg.IS_OPEN_ACCT_BIZ);  //0-新开客户、1是存量客户

        
        let csdcData = _this.$storage.getJsonSession(_this.$definecfg.CSDC_CACHE_DATA) || {};
        let investmentExperience = _.get(_this.oppBusiData.oldBusiData.INVESTMENT_EXPERIENCE,"EARLY_TRD_DATE","");
        let arr = _.chain(csdcData.ACCT_LIST).filter(v => {
            v.FIRST_TRD_DATE = _.trim(v.FIRST_TRD_DATE);
            if(!v.FIRST_TRD_DATE || "0" == v.FIRST_TRD_DATE){
                return false;
            }else{
                return true;
            }
        }).map(o => {
            return o.FIRST_TRD_DATE;
        }).uniq().value();

        let getFirstTrdDate = arr.length ? Math.min.apply(null, arr) + "" : "0";
        if(isOpenAcct == 0){
            _this.groupDatas.INVESTMENT_INFO.INVESTMENT_EXPERIENCE[0].FIELDS.EARLY_TRD_DATE.DEFAULT_VALUE = getFirstTrdDate;
        }else{
            _this.groupDatas.INVESTMENT_INFO.INVESTMENT_EXPERIENCE[0].FIELDS.EARLY_TRD_DATE.DEFAULT_VALUE = 
            date.compareDate(getFirstTrdDate,investmentExperience) == 1 ? investmentExperience : getFirstTrdDate;
        }
    },
    /*
     *@method bizInvestmentExperienceNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-13 09:42:56
     */
    bizInvestmentExperienceNodeAfterLoadBiz: function (_this) {
        if(_this.oppBusiData.newBusiData &&
            _this.oppBusiData.newBusiData.INVESTMENT_EXPERIENCE ){
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["INVESTMENT_EXPERIENCE"], _this.oppBusiData.newBusiData.INVESTMENT_EXPERIENCE);      
        }
    },
    /*
     *@method bizInvestmentExperienceNodeBeforeSave
     *@desc 钩子函数 自定义保存数
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizInvestmentExperienceNodeBeforeSave: async function (_this, params) {
        //数据保存
        // if (_this.moduleId.indexOf("CUST_INFO_WRAP") != -1) {
        //     if(_this.userType == "0" ){
        //         _this.oppBusiData[templateId]["CHANNELS"] = params.CUST_INFO.CUST_INFO_WRAP[0].CHANNELS && params.CUST_INFO.CUST_INFO_WRAP[0].CHANNELS.replace(/\,/g,"")
        //         params[groupId][templateId] = _this.oppBusiData[templateId] 
        //     }else{
        //         _this.oppBusiData[templateId]["CHANNELS"] = params.ORG_INFO.CUST_INFO_WRAP[0].CHANNELS && params.ORG_INFO.CUST_INFO_WRAP[0].CHANNELS.replace(/\,/g,"")
        //         params[groupId][templateId] = _this.oppBusiData[templateId]
        //     }
        //     params.ORG_CODE = _this.oppBusiData.CUST_ORG_CODE;
        //     params[groupId]["CUST_INFO_WRAP"][0].CHANNELS =params[groupId]["CUST_INFO_WRAP"][0].CHANNELS.split(",").join("");
        // }
    },
    /*
     *@method bizInvestmentExperienceNodeValidate
     *@desc 钩子函数 下一步验证
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizInvestmentExperienceNodeValidate: function (_this) {
      
    },
    // 上一步
    bizInvestmentExperienceNodePreValidate: function(_this) {
        // _this.$router.goRoute("本次业务办理信息");
    },

    /*
     *@method bizInvestmentExperienceNodePageActivated
     *@desc 钩子函数：页面激活
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizInvestmentExperienceNodePageActivated: function (_this, groupId) {
    },
    
}

