/*
 *   紧急联系人模块
 *   方法封装
 *   @author  yangyp
 */

import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../../business/businessTools/bizPublicMethod.js"
import stringConfig from '../../../../../../../tools/stringConfig.js';
export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizCriticalerInfoNodeBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizCriticalerInfoNodeBeforeLoadBiz: function (_this) {
        _this.groupDatas.OTHER_INFO.CRITICALER_INFO[0].allowRepeat = "1";
        _this.groupDatas.OTHER_INFO.CRITICALER_INFO[0].MAX_LENGTH = "5";
        if( _this.oppBusiData.oldBusiData &&
            _this.oppBusiData.oldBusiData.CUST_CRITICALER_INFO &&
            _this.oppBusiData.oldBusiData.CUST_CRITICALER_INFO.length){
            let cloneOldBusiDataCriticaler = _.cloneDeep( _this.oppBusiData.oldBusiData.CUST_CRITICALER_INFO);
            
            cloneOldBusiDataCriticaler.forEach(element => {
                element.MOBILE_TEL = element.MOBILE_TEL.substring(0,3) + "****" + element.MOBILE_TEL.substring(element.MOBILE_TEL.length-4);
             });

            bizPublicMethod.$blMethod.parseOldBiz(_this,_this.groupDatas, {"OTHER_INFO":{"CRITICALER_INFO":  cloneOldBusiDataCriticaler}}); 
            _this.groupDatas.OTHER_INFO.CRITICALER_INFO.forEach(function(tempItem,index){
                tempItem.FIELDS.MOBILE_TEL.COPYVALUE = _this.oppBusiData.oldBusiData.CUST_CRITICALER_INFO[index].MOBILE_TEL;
            })
        }

        _this.groupDatasTpl.OTHER_INFO.CRITICALER_INFO[0].MAX_LENGTH = "5";
        //强制模块显示删除按钮
        if(_this.oppBusiData.oldBusiData && _this.oppBusiData.oldBusiData.CUST_CRITICALER_INFO && _this.oppBusiData.oldBusiData.CUST_CRITICALER_INFO.length == 0 ){
            _this.groupDatas.OTHER_INFO.CRITICALER_INFO[0].showDelete = true;
            if(_this.groupDatas.OTHER_INFO.CRITICALER_INFO[0].FIELDS.CRITICALER_NAME.DEFAULT_VALUE
            || _this.groupDatas.OTHER_INFO.CRITICALER_INFO[0].FIELDS.MOBILE_TEL.DEFAULT_VALUE){
                _this.groupDatas.OTHER_INFO.CRITICALER_INFO[0].showDelete = true;
            }else{
                _this.groupDatas.OTHER_INFO.CRITICALER_INFO[0].showDelete = false;
            }
            
        }else{
            _this.groupDatas.OTHER_INFO.CRITICALER_INFO[0].FIELDS.CRITICALER_NAME.FIELD_REQUIRED = "1";
            _this.groupDatas.OTHER_INFO.CRITICALER_INFO[0].FIELDS.MOBILE_TEL.FIELD_REQUIRED = "1";
        }
    },
    /*
     *@method bizCriticalerInfoNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-13 09:42:56
     */
    bizCriticalerInfoNodeAfterLoadBiz: function (_this) {
        console.log("bizCriticalerInfoNodeAfterLoadBiz")
        if(_this.oppBusiData.newBusiData && 
           _this.oppBusiData.newBusiData.OTHER_INFO && 
           _this.oppBusiData.newBusiData.OTHER_INFO.CRITICALER_INFO && 
           _this.oppBusiData.newBusiData.OTHER_INFO.CRITICALER_INFO.length){

            _this.oppBusiData.cloneNewBusiDataCriticaler = _.cloneDeep(_this.oppBusiData.newBusiData.OTHER_INFO.CRITICALER_INFO)
            
            _this.oppBusiData.cloneNewBusiDataCriticaler.forEach(element => {
                if(element.OP_TYPE == "3") {
                    element.MOBILE_TEL = element.MOBILE_TEL.substring(0,3) + "****" + element.MOBILE_TEL.substring(element.MOBILE_TEL.length-4);
                }
             });
            let newData = _.filter( _this.oppBusiData.cloneNewBusiDataCriticaler, function (v) {
                return  v.OP_TYPE != 2;
            });
            bizPublicMethod.$blMethod.parseOldBiz(_this,_this.groupDatas, {"OTHER_INFO" :{"CRITICALER_INFO" : newData}});
            _this.groupDatas.OTHER_INFO.CRITICALER_INFO.forEach(function(tempItem,index){
                if(tempItem.FIELDS.MOBILE_TEL.DEFAULT_VALUE.includes("****")) {
                    tempItem.FIELDS.MOBILE_TEL.COPYVALUE = _.filter(_this.oppBusiData.oldBusiData.CUST_CRITICALER_INFO, {CRITICALER_ID: tempItem.FIELDS.CRITICALER_ID.DEFAULT_VALUE})[0].MOBILE_TEL || "";
                }
                // tempItem.FIELDS.MOBILE_TEL.COPYVALUE = _this.oppBusiData.newBusiData.OTHER_INFO.CRITICALER_INFO[index].MOBILE_TEL;
                tempItem.FIELDS.MOBILE_TEL.OP_TYPE = newData[index].OP_TYPE;
            })
        }
    },
    /*
     *@method bizCriticalerInfoNodeBeforeSave
     *@desc 钩子函数 自定义保存数
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizCriticalerInfoNodeBeforeSave: async function (_this, params) {
        if(!_this.oppBusiData.sysTrdacctArr.length) {
            params.OTHER_INFO.RESTRICTED_STOCK_INFO = [];
        }
        let originalData = _this.oppBusiData.newBusiData.CUST_CRITICALER_INFO; // 原始数据
        let newCriticalerInfo = _this.groupDatas.OTHER_INFO.CRITICALER_INFO; // 页面新值
        let newCriticalerInfoArr = []; // 获取页面上最新的值
        _.each(newCriticalerInfo, (item, index) => {
            newCriticalerInfoArr[index] = {};
            newCriticalerInfoArr[index].CRITICALER_ID = item.FIELDS.CRITICALER_ID.DEFAULT_VALUE;
            // newCriticalerInfoArr[index].MOBILE_TEL = item.FIELDS.MOBILE_TEL.DEFAULT_VALUE.includes("****")? item.FIELDS.MOBILE_TEL.COPYVALUE:item.FIELDS.MOBILE_TEL.DEFAULT_VALUE;
            newCriticalerInfoArr[index].CRITICALER_NAME = item.FIELDS.CRITICALER_NAME.DEFAULT_VALUE;
            // bizPublicMethod.$blMethod.changeObjKeys(item.FIELDS, newCriticalerInfoArr[index]);
            if(item.FIELDS.MOBILE_TEL.DEFAULT_VALUE.includes('****')) {
                newCriticalerInfoArr[index].MOBILE_TEL = _.filter(originalData, {CRITICALER_ID: item.FIELDS.CRITICALER_ID.DEFAULT_VALUE})[0].MOBILE_TEL;
            }else {
                newCriticalerInfoArr[index].MOBILE_TEL = item.FIELDS.MOBILE_TEL.DEFAULT_VALUE;
            }
        })

        let criticalerInfoArr = [];

        _.each(newCriticalerInfoArr, function (v) {
            let CRITICALER_ID = v.CRITICALER_ID,
                CRITICALER_NAME = v.CRITICALER_NAME,
                MOBILE_TEL = v.MOBILE_TEL;
            if (CRITICALER_ID || CRITICALER_NAME || MOBILE_TEL) {
                var obj = {
                    CRITICALER_ID: CRITICALER_ID,
                    CRITICALER_NAME: CRITICALER_NAME,
                    MOBILE_TEL: MOBILE_TEL
                };

                //判断当前是新增还是修改 OP_TYPE 0-新增 1-修改 2-删除 3-不变
                var old = bizPublicMethod.$blMethod.findOldObjZT(originalData || {}, obj, "CRITICALER_ID"),
                    diff = !!obj.CRITICALER_ID ? bizPublicMethod.$blMethod.compareInfoZT(old, obj) : [];

                criticalerInfoArr.push(_.extend({}, {
                    DIFF_INFO: diff,
                    OP_TYPE: diff.length ? "1" : !!obj.CRITICALER_ID ? "3" : "0"
                }, obj));
            }
        });

        originalData && originalData.filter(function (v) {
            return !_.filter(criticalerInfoArr, {CRITICALER_ID: v.CRITICALER_ID})[0];
        }).forEach(function (v) {
            criticalerInfoArr.push(_.extend({}, v, {DIFF_INFO: [], OP_TYPE: "2"}));
        });
        //数据保存
        params.OTHER_INFO.CRITICALER_INFO = criticalerInfoArr;
    },
 
    /*
     *@method bizCriticalerInfoNodeValidate
     *@desc 钩子函数 下一步验证
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizCriticalerInfoNodeValidate: function (_this) {
        //与客户名称USER_FNAME不能相同，客户重要手机MOBILE_TEL不能相同
        let CUST_BASIC_INFO = _this.groupDatas["OTHER_INFO"]["CRITICALER_INFO"];// 紧急联系人
        let impMobile = _this.groupDatas.CUST_LINK_INFO.IMP_LINK_INFO[0].FIELDS.MOBILE_TEL.DEFAULT_VALUE; // 重要手机号
        let userFname = _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.USER_FNAME.DEFAULT_VALUE;
        _this.pressNextSetpBool = true;
        let errArrName = _.filter(CUST_BASIC_INFO, o => {
            return  o.FIELDS.CRITICALER_NAME.DEFAULT_VALUE == userFname
        })
        if(errArrName.length){
            
            _this.messageBox({
                hasMask: true,
                messageText: '紧急联系人姓名与客户名称相同，已清空，请重新填写！',
                confirmButtonText: '确认',
                typeMessage: 'warn',
                showMsgBox: true,
                confirmedAction: function () {}
          });
          _.each(errArrName, item => {
            item.FIELDS.CRITICALER_NAME.DEFAULT_VALUE = ""
            })
            return false;
        }
        let errArr = _.filter(CUST_BASIC_INFO, o => {
            if(impMobile.includes("****")) {
                return  o.FIELDS.MOBILE_TEL.DEFAULT_VALUE == _this.oppBusiData.oldBusiData.CUST_BASIC_INFO.MOBILE_TEL || o.FIELDS.MOBILE_TEL.COPYVALUE == _this.oppBusiData.oldBusiData.CUST_BASIC_INFO.MOBILE_TEL;
            }else {
                // return  o.FIELDS.MOBILE_TEL.DEFAULT_VALUE == impMobile || o.FIELDS.MOBILE_TEL.COPYVALUE == _this.oppBusiData.oldBusiData.CUST_BASIC_INFO.MOBILE_TEL 
                return  o.FIELDS.MOBILE_TEL.DEFAULT_VALUE == impMobile 
                || o.FIELDS.MOBILE_TEL.COPYVALUE == impMobile;
            }
        })
        if(errArr.length){
            
            _this.messageBox({
                hasMask: true,
                messageText: '紧急联系人手机与客户重要手机相同，已清空，请重新填写！',
                confirmButtonText: '确认',
                typeMessage: 'warn',
                showMsgBox: true,
                confirmedAction: function () {}
            });
          _.each(errArr, item => {
            item.FIELDS.MOBILE_TEL.DEFAULT_VALUE = ""
            })
            return false;
        }else{
            return true;
        }
        
    },
    // 上一步
    bizCriticalerInfoNodePreValidate: function(_this) {
        // _this.$router.goRoute("首次交易日 ");
        
    },

    /*
     *@method bizCriticalerInfoNodePageActivated
     *@desc 钩子函数：页面激活
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizCriticalerInfoNodePageActivated: function (_this, groupId) {
        _this.groupDatas.OTHER_INFO.CRITICALER_INFO[0].allowRepeat = "1";

        //点击还原按钮的响应事件
        let cloneOldBusiDataCriticaler = [];
        if( _this.oppBusiData.oldBusiData &&
            _this.oppBusiData.oldBusiData.CUST_CRITICALER_INFO &&
            _this.oppBusiData.oldBusiData.CUST_CRITICALER_INFO.length){
            cloneOldBusiDataCriticaler = _.cloneDeep(_this.oppBusiData.oldBusiData.CUST_CRITICALER_INFO);
            
            // cloneOldBusiDataCriticaler.forEach(element => {
            //     element.MOBILE_TEL = element.MOBILE_TEL.substring(0,3) + "****" + element.MOBILE_TEL.substring(element.MOBILE_TEL.length-4);
            //  });
        }
        _this.pressNextSetpBool = false;
        _this.pageActivedBool = true;
        _this.groupDatas.OTHER_INFO.CRITICALER_INFO.forEach( function(element,index){
            element.FIELDS.MOBILE_TEL.FIELD_FUNCTION = "CHECK_CRIT_MOBILE_TEL";
            element.FIELDS.CRITICALER_NAME.VALID_TYPE = "length[4,16]|on-blur";
            if(_this.oppBusiData.newBusiData.OTHER_INFO && index < _this.oppBusiData.newBusiData.OTHER_INFO.length){
                element.FIELDS.MOBILE_TEL.OP_TYPE = _this.oppBusiData.newBusiData.OTHER_INFO.CRITICALER_INFO[index].OP_TYPE;
            }
            cloneOldBusiDataCriticaler.forEach(function(oldItem){
                if(oldItem.MOBILE_TEL == element.FIELDS.MOBILE_TEL.COPYVALUE){
                    if(element.FIELDS.MOBILE_TEL.DEFAULT_VALUE.length == 11){
                        if(element.FIELDS.MOBILE_TE&&element.FIELDS.MOBILE_TE.addField&&!element.FIELDS.MOBILE_TEL.addField) {
                            element.FIELDS.MOBILE_TEL.DEFAULT_VALUE =  element.FIELDS.MOBILE_TEL.DEFAULT_VALUE .substring(0,3) + "****" +  element.FIELDS.MOBILE_TEL.DEFAULT_VALUE .substring( element.FIELDS.MOBILE_TEL.DEFAULT_VALUE .length-4);
                        }
                        element.FIELDS.MOBILE_TEL.VALID_TYPE = "on-focus";
                    }
                }
            })
        });

    },  
    bizCriticalerInfoNodeAddModule: function (_this, moduleld, fieldData) {
        let criticalerInfo = _this.groupDatas.OTHER_INFO.CRITICALER_INFO[0].FIELDS;
        if(criticalerInfo.length==1 && (criticalerInfo.CRITICALER_NAME.DEFAULT_VALUE=="" || criticalerInfo.CRITICALER_NAME.message.length)
        || (criticalerInfo.MOBILE_TEL.DEFAULT_VALUE=="" || criticalerInfo.MOBILE_TEL.message.length)) {
            _this.messageBox({
                hasMask: true,
                messageText: '请检查信息是否填写正确！',
                confirmButtonText: '确认',
                typeMessage: 'warn',
                showMsgBox: true,
                confirmedAction: function () {}
            });
          return false;
        }
        console.log("点击了【紧急联系人】添加按钮")
        return true
    },
    bizCriticalerInfoNodeAddModuleFinished: function (_this, moduleld, fieldData) {
        _this.groupDatas.OTHER_INFO.CRITICALER_INFO[0].showDelete = true;
        _this.groupDatas.OTHER_INFO.CRITICALER_INFO[0].MODULE_DELETE = '1';
        moduleld.FIELDS.CRITICALER_NAME.FIELD_REQUIRED = "1";
        moduleld.FIELDS.MOBILE_TEL.FIELD_REQUIRED = "1";
        moduleld.FIELDS.CRITICALER_NAME.VALID_TYPE = "length[4,16]|on-blur";
        moduleld.FIELDS.MOBILE_TEL.VALID_TYPE = "mobile";
        moduleld.FIELDS.MOBILE_TEL.addField = true;
        console.log("【紧急联系人】添加按钮【结束】")

    },
    bizCriticalerInfoNodeDeleteModuleFinished: function (_this, moduleld, fieldData) {
        if(_this.groupDatas.OTHER_INFO.CRITICALER_INFO.length == 1) {
            _this.groupDatas.OTHER_INFO.CRITICALER_INFO[0].showDelete = false;
            _this.groupDatas.OTHER_INFO.CRITICALER_INFO[0].MODULE_DELETE = '0';
        }
    },

    "CHECK_CRIT_MOBILE_TEL": function(_this, field, fieldData) {
        _this.$nextTick( () => {
            let impFieldData = _this.groupDatas.CUST_LINK_INFO.IMP_LINK_INFO[0].FIELDS;
            if(!field.DEFAULT_VALUE.includes("*") && field.DEFAULT_VALUE == impFieldData.MOBILE_TEL.DEFAULT_VALUE) {
                field.DEFAULT_VALUE = "";
                _this.messageBox({
                    hasMask: true,
                    messageText: '紧急联系人手机与客户重要手机相同，已清空，请重新填写！',
                    confirmButtonText: '确认',
                    typeMessage: 'warn',
                    showMsgBox: true,
                    confirmedAction: function () {}
                });

            }
            if(stringConfig.isNotEmptyStr(field.DEFAULT_VALUE)) {
                fieldData.CRITICALER_NAME.FIELD_REQUIRED = "1";
            }
 

            if(stringConfig.isEmptyStr(fieldData.MOBILE_TEL.DEFAULT_VALUE)
            && stringConfig.isEmptyStr(fieldData.CRITICALER_NAME.DEFAULT_VALUE)){
                fieldData.MOBILE_TEL.FIELD_REQUIRED = "0";
                fieldData.CRITICALER_NAME.FIELD_REQUIRED = "0";
            }
            if(_this.oppBusiData.oldBusiData.CUST_CRITICALER_INFO && _this.oppBusiData.oldBusiData.CUST_CRITICALER_INFO.length == 0 ){
                _this.groupDatas.OTHER_INFO.CRITICALER_INFO[0].showDelete = true; 
            }
            // 获取最初的 即从一柜通获取的号码
            let oldMobile = field.COPYVALUE || "";
            let currentValid = _.cloneDeep(field.currentValid)
            field.currentValid = '';
            if (!field.DEFAULT_VALUE && !oldMobile || currentValid == 'blur' && !field.DEFAULT_VALUE) {
                return;
            }
            if (!field.DEFAULT_VALUE) {
                fieldData["MOBILE_TEL"]["VALID_TYPE"] = "on-focus";
                field.DEFAULT_VALUE = oldMobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
                return;
            }
             //获取焦点清空操作
             if (field.DEFAULT_VALUE.includes('****') && currentValid == 'focus') {
                fieldData["MOBILE_TEL"]["VALID_TYPE"] = "mobile|on-focus";
                field.OLD_DEFAULT_VALUE = oldMobile;
                field.DEFAULT_VALUE = '';
                return;
            }
            if (field.DEFAULT_VALUE == oldMobile) {
                fieldData["MOBILE_TEL"]["VALID_TYPE"] = "on-focus";
                field.showchange = false;
                field.DEFAULT_VALUE = oldMobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
            }
            // if(field.DEFAULT_VALUE.includes('****') && !_this.pressNextSetpBool && !_this.pageActivedBool) {
            //     field.DEFAULT_VALUE = "";
            //     fieldData["MOBILE_TEL"]["VALID_TYPE"] = "mobile";
            //     field.correct = true;
            //     field.showerr = false;
            //     field.message = "";
            //     return true
            // }else if(field.DEFAULT_VALUE.includes('****') ){
            //     fieldData["MOBILE_TEL"]["VALID_TYPE"] = "on-focus";
            // }else {
            //     if(field.DEFAULT_VALUE.length == 11){
            //         field.COPYVALUE = field.DEFAULT_VALUE;
            //     }
            //     fieldData["MOBILE_TEL"]["VALID_TYPE"] = "mobile";
            // }
            let lastField = _this.groupDatas.OTHER_INFO.CRITICALER_INFO[_this.groupDatas.OTHER_INFO.CRITICALER_INFO.length - 1].FIELDS;
            if(field.DEFAULT_VALUE == lastField.MOBILE_TEL.DEFAULT_VALUE && fieldData.CRITICALER_NAME.DEFAULT_VALUE != ""
            && fieldData.CRITICALER_NAME.DEFAULT_VALUE == lastField.CRITICALER_NAME.DEFAULT_VALUE && fieldData.CRITICALER_NAME.DEFAULT_VALUE != ""){
                _this.pageActivedBool = false;
            }
            
         
        })
    },

    "CHECK_CRITICALER_NAME":function(_this, field, fieldData) {
        // 与“客户名称” 相同或 与“修改后的客户名称”相同，则自动清空客户填写的“紧急联系人姓名”并给予弹框提示信息
        let custFieldData = _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS;
        //let userFname = _this.oppBusiData.oldBusiData.CUST_BASIC_INFO.USER_FNAME;
        if(field.DEFAULT_VALUE == custFieldData.USER_FNAME.DEFAULT_VALUE) {
            field.DEFAULT_VALUE = "";
            _this.messageBox({
                hasMask: true,
                messageText: '紧急联系人姓名与客户名称相同，已清空，请重新填写！',
                confirmButtonText: '确认',
                typeMessage: 'warn',
                showMsgBox: true,
                confirmedAction: function () {}
            });
        }
        if(stringConfig.isNotEmptyStr(field.DEFAULT_VALUE)) {
            fieldData.MOBILE_TEL.FIELD_REQUIRED = "1";
            field.FIELD_REQUIRED = "1";
        }

        if(stringConfig.isEmptyStr(fieldData.MOBILE_TEL.DEFAULT_VALUE)
        && stringConfig.isEmptyStr(fieldData.CRITICALER_NAME.DEFAULT_VALUE)){
            fieldData.MOBILE_TEL.FIELD_REQUIRED = "0";
            fieldData.CRITICALER_NAME.FIELD_REQUIRED = "0";
        }
        if(_this.oppBusiData.oldBusiData.CUST_CRITICALER_INFO && _this.oppBusiData.oldBusiData.CUST_CRITICALER_INFO.length == 0 ){
            _this.groupDatas.OTHER_INFO.CRITICALER_INFO[0].showDelete = true; 
        }
    }
    
}

