/*
 * @Description: 
 * 1、财务与资产相关
 * @Author: chencheng
 * @Date: 2020-09-18 18:10:21
*/

import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../../business/businessTools/bizPublicMethod.js"


export default {
    //----------------------------------钩子函数----------------------//

    bizAnnualIncomeNodeBeforeLoadBiz: function (_this) {
        console.log("bizAnnualIncomeNodeBeforeLoadBiz")
        if(_this.oppBusiData.oldBusiData && _this.oppBusiData.oldBusiData.CUST_EXT_INFO && Object.keys(_this.oppBusiData.oldBusiData.CUST_EXT_INFO).length) {
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["ANNUAL_INCOME_MODULE"], _this.oppBusiData.oldBusiData.CUST_EXT_INFO);
        }
        // 新开默认值 0-12万
        let isOpenAcct = _this.$storage.getJsonSession(_this.$definecfg.IS_OPEN_ACCT_BIZ)
        if (isOpenAcct == '0') {
            _this.groupDatas.CUST_INFO.ANNUAL_INCOME_MODULE[0].FIELDS.ANNUAL_INCOME.DEFAULT_VALUE = "0";
        }
    },
    bizAnnualIncomeNodeAfterLoadBiz: function (_this) {
        if(_this.oppBusiData.newBusiData && _this.oppBusiData.newBusiData.ASSETS_INFO
            && Object.keys(_this.oppBusiData.newBusiData.ASSETS_INFO).length && _this.oppBusiData.newBusiData.ASSETS_INFO.ANNUAL_INCOME.length ){
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["ANNUAL_INCOME_MODULE"], _this.oppBusiData.newBusiData.ASSETS_INFO);
        }
    },
    
    bizAnnualIncomeNodeBeforeSave: function (_this, params) {
        //数据保存
        console.log("保存-----bizAnnualIncomeNodeBeforeLoadBiz")
        if (_this.moduleId.indexOf("ANNUAL_INCOME_MODULE") != -1) {
            let isOpenAcct = _this.$storage.getJsonSession(_this.$definecfg.IS_OPEN_ACCT_BIZ);  //0-新开客户、1是存量客户
            let chkFlagObj = {};
            
            let originalData = _this.oppBusiData.oldBusiData && _this.oppBusiData.oldBusiData.CUST_EXT_INFO || {};
            let newAssetsInfo = {};
            let data1 = [];
            bizPublicMethod.$blMethod.changeObjKeys(_this.groupDatas.CUST_INFO.ANNUAL_INCOME_MODULE[0].FIELDS, newAssetsInfo);
            if(_this.userType =="0" && isOpenAcct =="0") { // 个人新开
                chkFlagObj.ANNUAL_INCOME_CHK = "1";
                newAssetsInfo.ANNUAL_INCOME_CHK = "1";
            }else { // 存量
                if(_this.oppBusiData.oldBusiData.CUST_EXT_INFO && _this.oppBusiData.oldBusiData.CUST_EXT_INFO.ANNUAL_INCOME != newAssetsInfo.ANNUAL_INCOME
                    || _this.groupDatas.CUST_INFO.ANNUAL_INCOME_MODULE[0].FIELDS.ANNUAL_INCOME.ischeckSelect) {
                    newAssetsInfo.ANNUAL_INCOME_CHK = "1";
                }else {
                    newAssetsInfo.ANNUAL_INCOME_CHK = _this.oppBusiData.oldBusiData.CUST_EXT_INFO.ANNUAL_INCOME_CHK || "";
                }
                data1 = bizPublicMethod.$blMethod.compareInfo2(originalData, newAssetsInfo);
            }
            newAssetsInfo.DIFF_INFO = data1;
            Object.assign(params,{
                ASSETS_INFO: newAssetsInfo,
            })
        }
    },
   
    bizAnnualIncomeNodePageActivated: function (_this) {
        let isOpenAcct = _this.$storage.getJsonSession(_this.$definecfg.IS_OPEN_ACCT_BIZ);  //0-新开客户、1是存量客户
        if(_this.oppBusiData.oldBusiData.CUST_EXT_INFO && (!_this.oppBusiData.oldBusiData.CUST_EXT_INFO.ANNUAL_INCOME_CHK.length
        || _this.oppBusiData.oldBusiData.CUST_EXT_INFO.ANNUAL_INCOME_CHK == "0")) {
            _this.groupDatas.CUST_INFO.ANNUAL_INCOME_MODULE[0].FIELDS.ANNUAL_INCOME.isShowSelectCheck = true; // select后面的勾选框
        }else {
            _this.groupDatas.CUST_INFO.ANNUAL_INCOME_MODULE[0].FIELDS.ANNUAL_INCOME.isShowSelectCheck = false;
        }
        // 存量客户没有值就不展示 认证 按钮
        if(isOpenAcct == "1") {
            if(_this.groupDatas.CUST_INFO.ANNUAL_INCOME_MODULE[0].FIELDS.ANNUAL_INCOME.DEFAULT_VALUE.length && _this.oppBusiData.oldBusiData.CUST_EXT_INFO && (!_this.oppBusiData.oldBusiData.CUST_EXT_INFO.ANNUAL_INCOME_CHK.length
                || _this.oppBusiData.oldBusiData.CUST_EXT_INFO.ANNUAL_INCOME_CHK == "0")) {
                    _this.groupDatas.CUST_INFO.ANNUAL_INCOME_MODULE[0].FIELDS.ANNUAL_INCOME.isShowSelectCheck = true; // select后面的勾选框
            }else {
                _this.groupDatas.CUST_INFO.ANNUAL_INCOME_MODULE[0].FIELDS.ANNUAL_INCOME.isShowSelectCheck = false;
            }
        }
        _this.groupDatas.CUST_INFO.ANNUAL_INCOME_MODULE[0].FIELDS.ANNUAL_INCOME.hideDictItem = true;
        // _this.$refs.flowTip.removeFlowTip('annualIncome');
        // _this.$refs.flowTip.pushFlowTip({
        //     title: `温馨提示：若在此项目下填写相关资产情况，需要客户提交相应的资产证明文件。其中系统内金融资产为系统内前十日日均金融资产。`,
        //     type: 'warning',
        //     key: 'annualIncome'
        // })

    },
    bizAnnualIncomeNodeValidate: function (_this) {
      
    },
    CHECK_ANNUAL_INCOME: function(_this, field,fieldData) {
        if(_this.oppBusiData.oldBusiData.CUST_EXT_INFO && (!_this.oppBusiData.oldBusiData.CUST_EXT_INFO.ANNUAL_INCOME_CHK.length
        || _this.oppBusiData.oldBusiData.CUST_EXT_INFO.ANNUAL_INCOME_CHK == "0")) {
            if(_this.oppBusiData.oldBusiData.CUST_EXT_INFO.ANNUAL_INCOME != field.DEFAULT_VALUE) {
                _this.groupDatas.CUST_INFO.ANNUAL_INCOME_MODULE[0].FIELDS.ANNUAL_INCOME.isShowSelectCheck = false;
            }else {
                _this.groupDatas.CUST_INFO.ANNUAL_INCOME_MODULE[0].FIELDS.ANNUAL_INCOME.isShowSelectCheck = true;
            }
        }
        // 存量客户没有值就不展示 认证 按钮
        let isOpenAcct = _this.$storage.getJsonSession(_this.$definecfg.IS_OPEN_ACCT_BIZ);  //0-新开客户、1是存量客户
        if(isOpenAcct == "1") {
            if(field.DEFAULT_VALUE.length && _this.oppBusiData.oldBusiData.CUST_EXT_INFO && (!_this.oppBusiData.oldBusiData.CUST_EXT_INFO.ANNUAL_INCOME_CHK.length
                || _this.oppBusiData.oldBusiData.CUST_EXT_INFO.ANNUAL_INCOME_CHK == "0") && _this.oppBusiData.oldBusiData.CUST_EXT_INFO.ANNUAL_INCOME == field.DEFAULT_VALUE) {
                _this.groupDatas.CUST_INFO.ANNUAL_INCOME_MODULE[0].FIELDS.ANNUAL_INCOME.isShowSelectCheck = true;
            }else {
                _this.groupDatas.CUST_INFO.ANNUAL_INCOME_MODULE[0].FIELDS.ANNUAL_INCOME.isShowSelectCheck = false;
            }
        }
        
    },
}

