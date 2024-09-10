/*
 *   其他联系人信息
 *   方法封装
 *   @author  zky
 */

export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method openBizCustOtherLinkInfoNodeBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     *@MethodAuthor  zky
     *@Date: 2020-11-16
     */
    openBizCustOtherLinkInfoNodeBeforeLoadBiz: function (_this) {
        
    },

    /*
     *@method openBizCustOtherLinkInfoNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     *@MethodAuthor  zky
     *@Date: 2020-11-16
     */
    openBizCustOtherLinkInfoNodeAfterLoadBiz: function (_this) {
       
    },
    /*
     *@method openBizCustOtherLinkInfoNodePageActivated
     *@desc 钩子函数：页面激活
     *@MethodAuthor  zky
     *@Date: 2020-11-16
     */
    openBizCustOtherLinkInfoNodePageActivated: function (_this) {
       
    },

    /*
     *@method openBizCustOtherLinkInfoNodeValidate
     *@desc 钩子函数 下一步验证
     *@MethodAuthor  zky
     *@Date: 2020-11-16
     */
    openBizCustOtherLinkInfoNodeValidate: function (_this) {

    },

    /*
     *@method openBizCustOtherLinkInfoNodeBeforeSavecjfhvddfiujsdfkilsdseokloikxkjkxchjksdfiokjsdsdjkl
     *@desc 钩子函数 自定义保存数
     *@MethodAuthor  zky
     *@Date: 2020-11-16
     */
    openBizCustOtherLinkInfoNodeBeforeSave: function (_this, params) {
        let tempSaveBasicObject = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "CUST_OTHER_LINK_INFO");
        let resultObj = {
            RELA_INFO: Object.assign({}, params.RELA_INFO, {
                CUST_CONTROLER_INFO: tempSaveControlerArr,
                CUST_OTHER_LINK_INFO: tempSaveBasicObject,
            }),
          }
          Object.assign(params, resultObj);
    },
    "CHECK_LINKMAN_NAME": (_this,field,fieldData) => {
        //联系人姓名填了，电话就必填
        if(field.DEFAULT_VALUE != "") {
            fieldData.LINKMAN_TEL.FIELD_REQUIRED = "1"
        } else {
            fieldData.LINKMAN_TEL.FIELD_REQUIRED = "0"
            fieldData.LINKMAN_TEL.message = ""
            fieldData.LINKMAN_TEL.correct = true
        }
    },
    "CHECK_LINKMAN_TEL": (_this,field,fieldData) => {
        if(field.DEFAULT_VALUE != "" && field.DEFAULT_VALUE == _this.groupDatas.CUST_INFO.CUST_LINK_INFO[0].FIELDS.MOBILE_TEL.DEFAULT_VALUE) {
            field.message = "其他联系人信息的手机号码不能是客户本人的手机号码";
            field.correct = false;
        } else {
            field.message = "";
        }
    }
}

