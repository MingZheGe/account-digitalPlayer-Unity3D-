/* 
*   开户 密码设置模块
*   注意：方法名称与V0035一样的，需要加前缀，不能覆盖V0035的方法，比如openBizPwdNodePageActivated
*   方法封装
*   @author  linsc
*/
import des from "../../../../../tools/libs/standard-des"
/*
 *@method showMsgBox
 *@desc 提示框
 *@MethodAuthor  linsc
 *@Date: 2019-05-30 17:00:28
 *@param messageText 提示内容,
 *@param confirmedAction 确认按钮事件,
 *@returns false
*/
const showMsgBox = (_this, messageText, confirmedAction) => {
    _this.messageBox({
        hasMask: true,
        messageText: messageText,
        confirmButtonText: "确定",
        confirmedAction: _.isFunction(confirmedAction) && confirmedAction,
        typeMessage: "warn",
        showMsgBox: true
    })
    return false;
}
/*
 *@method checkPassword
 *@desc 弱密校验
 *@MethodAuthor  linsc
 *@Date: 2019-05-30 17:00:12
 *@param opts
 *@returns {*}
*/
const checkPassword = function(_this,opts) {
    let busiInfo =  _this.$storage.getJsonSession(_this.$definecfg.BUSI_INFO);
    var custBasicInfo = busiInfo.CUST_INFO && busiInfo.CUST_INFO.CUST_BASIC_INFO[0];
    var custLinkInfo = busiInfo.CUST_INFO && busiInfo.CUST_INFO.CUST_LINK_INFO[0];
    var orgBasicInfo = busiInfo.ORG_INFO && busiInfo.ORG_INFO.DOC_INFO[0];
    var orgLinkInfo = busiInfo.ORG_INFO && busiInfo.LINK_INFO.ORG_LINK_INFO[0];
    let param = {
        service: "Y3000501",
        CUST_CODE: _this.oppBusiData.CUST_CODE,
        OPEN_FLAG: "0",
        USER_ROLE: "1",
        AUTH_TYPE: "0",
        USE_SCOPE: opts.USE_SCOPE,
        AUTH_DATA: opts.NEW_AUTH_DATA,
        ID_CODE: custBasicInfo && custBasicInfo.ID_CODE || orgBasicInfo && orgBasicInfo.ID_CODE || "",
        BIRTHDAY: custBasicInfo && custBasicInfo.BIRTHDAY || "",
        MOBILE_TEL: custLinkInfo && custLinkInfo.MOBILE_TEL || orgLinkInfo && orgLinkInfo.MOBILE_TEL,
        TEL: custLinkInfo && custLinkInfo.TEL || "",
        OFFICE_TEL: orgLinkInfo && orgLinkInfo.OFFICE_TEL || ""
    }
    _this.loading = true;
    let loadingText = _this.loadingText 
    _this.loadingText = "正在进行弱密校验！";
    return _this.$syscfg.K_Request('W0000178', param).then(function(res) {
        _this.loading = false;
        _this.loadingText = loadingText
        if(res.Code == "0"){
            return true;
        }else{
            showMsgBox(_this, res.Msg)
            return false;
        }
    }).catch(function(err) {
        _this.loading = false;
        _this.loadingText = loadingText
     });
}
/*
 *@method validPassword
 *@desc 校验密码的有效性
 *@MethodAuthor  linsc
 *@Date: 2019-05-30 17:00:12
*/
const validPassword = function(_this,USE_SCOPE,pwd,pwd2){

}
/*
 *@method checkTwoPassword
 *@desc 检查确认密码是否一致
 *@MethodAuthor  linsc
 *@Date: 2019-05-30 17:00:12
 *@param $pwd
 *@param $pwd2
*/
const checkTwoPassword = function(field1,field2){
   if(field1.DEFAULT_VALUE != field2.DEFAULT_VALUE){
        field2.correct = false;
        field2.message = "两次密码输入不一样"
        return new Promise((resolve) => {
            resolve('两次密码输入不一样')
        })
   }else{
        field2.correct = true;
        field2.message = "";

        field1.correct = true;
        field1.message = "";
   }
}

/**
 * 获得弱密码校验的 promise
 * @param {Object} _this 
 * @param {Object} pwdField 待校验的密码
 * @param {String} useScope 参考系统数据字典(USE_SCOPE)
 * @returns Promise 对象
 */
const getValidateWeakPwdPromise = function(_this, pwdField, useScope) {
    let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
    let custCode = customerInfo.CUST_CODE || _this.historyData.CUST_CODE;
    let param = {
        service: "Y3000501",
        CUST_CODE: custCode,
        OPEN_FLAG: "0",
        USER_ROLE: "1",
        AUTH_TYPE: "0",
        USE_SCOPE: useScope,
        AUTH_DATA: des.encrypt(pwdField.DEFAULT_VALUE, custCode)
    }
    return new Promise(function(resolve, reject){
        let success = {
            "message": "弱密码校验通过",
            "fields":[pwdField]
        };
        let fail = {
            "message": "您输入的密码过于简单，请重新输入。",
            "fields":[pwdField],
            "typeMessage": "info"
        };
        _this.$syscfg.K_Request('W0000178', param).then(function(res) {
            if(res.Code == "0"){
                resolve(success);
            }else{
                reject(fail);
            }
        }).catch(function(err) {
            reject(fail)
        });
    });
}
/**
 * 获得校验两次输入的密码是否一致的 promise
 * @param {Object} pwdField 输入的密码field
 * @param {Object} confirmPwdField 确认密码field（再次输入的密码）
 * @returns Promise 对象
 */
const getValidateConfirmPwdPromise = function(pwdField, confirmPwdField) {
    let success = {
        "message": "确认密码校验通过",
        "fields":[pwdField, confirmPwdField]
    };
    let fail = {
        "message": "您两次输入的密码不一致，请重新输入。",
        "fields":[pwdField, confirmPwdField],
        "typeMessage": "info"
    };
    return new Promise(function(resolve, reject) {
        if (pwdField.DEFAULT_VALUE !== confirmPwdField.DEFAULT_VALUE) {
            reject(fail);
        } else {
            resolve(success);
        }
    })
}

/**
 * 校验密码，若校验不通过则弹框提醒并清空相应的密码框
 * @param {Object} _this 
 * @param {Object} field 待校验密码的字段
 * @param {Object} validatingPromise 校验所需的 promise
 */
const showMessageAndClearPwdIfFailInValidating = function(_this, field, validatingPromise) {
    validatingPromise.then((res) => {
        console.log(res)
    }
    ).catch((err) => {
        _this.messageAlert(err.message, err.typeMessage);
        clearFieldValueAndSetLastValueUndefine(field);
        if (isNotConfirmPwd(field)) {
            clearFieldValueAndSetLastValueUndefine(getItsConfirmPwd(_this, field));
        }
        _this.disableNext = true;
    });
}

/**
 * 清空字段值
 * @param {object} pwdField 密码字段对象
 */
const clearFieldValueAndSetLastValueUndefine = (field) => {
    if (!_.isEmpty(field)) {
        field.DEFAULT_VALUE = "";
        field.LAST_DEFAULT_VALUE = undefined;
    }
}

/**
 * 
 * @param {object} pwdField 密码字段对象
 */
const isNotConfirmPwd = (pwdField) => {
    if (pwdField.FIELD_ID == "TRD_PWD" || pwdField.FIELD_ID == "FUND_PWD") {
        return true;
    }
    return false;
}

/**
 * 得到密码对应的确认密码字段对象
 * @param {object} _this 
 * @param {object} pwdField 
 */
const getItsConfirmPwd = (_this, pwdField) => {
    if (pwdField.FIELD_ID == "TRD_PWD") {
        return _this.groupDatas.ACCT_INFO.CUST_PWD_INFO[0].FIELDS["TRD_PWD2"];
    } else if (pwdField.FIELD_ID == "FUND_PWD") {
        return _this.groupDatas.ACCT_INFO.CUST_PWD_INFO[0].FIELDS["FUND_PWD2"];
    }
}
/**
 * 判断字段是否没有改变
 * @param {object} field 字段对象
 */
const isFieldValueNotChanged = (field) => {
    return field.LAST_DEFAULT_VALUE == field.DEFAULT_VALUE;
}

/**
 * 交易密码与基金密码是否已设置为一样的
 * @param {object} _this 
 */
const isTrdPwdSettedSameAsFundPwd = (_this) => {
    return _this.groupDatas.ACCT_INFO.CUST_PWD_INFO[0].FIELDS.LINK_FLAG.DEFAULT_VALUE == "1";
}

export default  {
   /*
    *@method openBizPwdNodeAfterLoadBiz
    *@desc 数据回填之后 密码模块的钩子函数
    *@MethodAuthor  linsc
    *@Date: 2019-05-30 16:38:39
   */
    openBizPwdNodeAfterLoadBiz:function(_this){
        console.log("调用openBizPwdNodeParseOldBiz");
        _this.oppBusiData.playVoiceFlag = true;
        //_this.groupDatas.ACCT_INFO.CUST_PWD_INFO[0].FIELDS.LINK_FLAG.FIELD_DICT_NAME = [{DICT_ITEM:"1",DICT_ITEM_NAME:"开通"}];
        let pwdLinkFlag = _this.historyData.ACCT_INFO && _this.historyData.ACCT_INFO.LINK_FLAG || "";
        let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
        if(_this.userType == "0") {
            _this.oppBusiData.ID_CODE = _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].FIELDS.ID_CODE.DEFAULT_VALUE || customerInfo.ID_CODE;
        }
        else if(_this.userType == "1") {
            _this.oppBusiData.ID_CODE = _this.groupDatas.ORG_INFO.DOC_INFO[0].FIELDS.ID_CODE.DEFAULT_VALUE || customerInfo.ID_CODE;
        }
        else if(_this.userType == "2") {
            _this.oppBusiData.ID_CODE = _this.groupDatas.PRO_INFO.DOC_INFO[0].FIELDS.ID_CODE.DEFAULT_VALUE || customerInfo.ID_CODE;
        }
        _this.groupDatas.ACCT_INFO.CUST_PWD_INFO[0].FIELDS.LINK_FLAG.DEFAULT_VALUE = pwdLinkFlag;
        if (pwdLinkFlag == "1") {
            if (_this.historyData.ACCT_INFO.AUTH_DATA_INFO && _this.historyData.ACCT_INFO.AUTH_DATA_INFO.length) {
                _.each(_this.historyData.ACCT_INFO.AUTH_DATA_INFO, obj => {
                    let authData = des.decrypt(obj.NEW_AUTH_DATA, _this.oppBusiData.ID_CODE);
                    if (obj.USE_SCOPE == "0") {
                        _this.groupDatas.ACCT_INFO.CUST_PWD_INFO[0].FIELDS.TRD_PWD.DEFAULT_VALUE = authData;
                        _this.groupDatas.ACCT_INFO.CUST_PWD_INFO[0].FIELDS.TRD_PWD2.DEFAULT_VALUE = authData;
                    }
                })
            }
        } else if (pwdLinkFlag == "0") {
            if (_this.historyData.ACCT_INFO.AUTH_DATA_INFO && _this.historyData.ACCT_INFO.AUTH_DATA_INFO.length) {
                _.each(_this.historyData.ACCT_INFO.AUTH_DATA_INFO, obj => {
                    let authData = des.decrypt(obj.NEW_AUTH_DATA, _this.oppBusiData.ID_CODE);
                    if (obj.USE_SCOPE == "0") {
                        _this.groupDatas.ACCT_INFO.CUST_PWD_INFO[0].FIELDS.TRD_PWD.DEFAULT_VALUE = authData;
                        _this.groupDatas.ACCT_INFO.CUST_PWD_INFO[0].FIELDS.TRD_PWD2.DEFAULT_VALUE = authData;
                    } else if (obj.USE_SCOPE == "1") {
                        _this.groupDatas.ACCT_INFO.CUST_PWD_INFO[0].FIELDS.FUND_PWD.DEFAULT_VALUE = authData;
                        _this.groupDatas.ACCT_INFO.CUST_PWD_INFO[0].FIELDS.FUND_PWD2.DEFAULT_VALUE = authData;
                    }
                })
            }
        }
    },
    openBizPwdNodeBeforeLoadBiz: function(_this){
        _this.groupDatas.ACCT_INFO.CUST_PWD_INFO[0].FIELDS.TRD_PWD.VALID_TYPE = "num[6]|password";
        _this.groupDatas.ACCT_INFO.CUST_PWD_INFO[0].FIELDS.FUND_PWD.VALID_TYPE = "num[6]|password";
        _this.groupDatas.ACCT_INFO.CUST_PWD_INFO[0].FIELDS.TRD_PWD2.VALID_TYPE = "num[6]|password";
        _this.groupDatas.ACCT_INFO.CUST_PWD_INFO[0].FIELDS.FUND_PWD2.VALID_TYPE = "num[6]|password";
        _this.groupDatas.ACCT_INFO.CUST_PWD_INFO[0].FIELDS.LINK_FLAG.isShowAllBtn = false;
        _this.groupDatas.ACCT_INFO.CUST_PWD_INFO[0].FIELDS.LINK_FLAG.FIELED_CHECKBOX_BOTTON = true;
        _this.groupDatas.ACCT_INFO.CUST_PWD_INFO[0].FIELDS.LINK_FLAG.multiple = true;
        _this.groupDatas.ACCT_INFO.CUST_PWD_INFO[0].FIELDS.LINK_FLAG.labelWidth = 280;
        _this.groupDatas.ACCT_INFO.CUST_PWD_INFO[0].FIELDS.LINK_FLAG.FIELED_CHECKBOX_BOTTON = true;
        _this.groupDatas.ACCT_INFO.CUST_PWD_INFO[0].FIELDS.LINK_FLAG.FIELD_RADIO_TYPE = false;  //false为单选

    },
     /**
    * 自定义保存数 函数
    * @param busiData 历史数据
    * @returns Object
    */
    openBizPwdNodeBeforeSave:function(_this, params){
        console.log("openBizPwdNodeBeforeSave");
        this.openBizPwdNodeGetData(_this, params)
        return params;
    },
    /**
     * V0052 业务专用的下上步验证
     * 1、进行弱密码校验
     * 2、对比两次输入的密码是否一致
     * @param  _this 
     */
    openBizPwdNodeValidateV0052 : function(_this) {
        let fieldData = _this.groupDatas.ACCT_INFO.CUST_PWD_INFO[0].FIELDS;
        let fieldTrdPwd = fieldData.TRD_PWD;
        let fieldTrdPwd2 = fieldData.TRD_PWD2;
        let fieldFundPwd = fieldData.FUND_PWD;
        let fieldFundPwd2 = fieldData.FUND_PWD2;
        let promises = [];
        if (_this.groupDatas.ACCT_INFO.CUST_PWD_INFO[0].FIELDS.LINK_FLAG.DEFAULT_VALUE == "0") {
            // LINK_FLAG.DEFAULT_VALUE = 0 表示交易密码和资金密码不是同一个，需要校验交易密码和资金密码
            promises.push(getValidateWeakPwdPromise(_this, fieldTrdPwd, "0"));
            promises.push(getValidateConfirmPwdPromise(fieldTrdPwd, fieldTrdPwd2));
            promises.push(getValidateWeakPwdPromise(_this, fieldFundPwd, "1"));
            promises.push(getValidateConfirmPwdPromise(fieldFundPwd, fieldFundPwd2));
        } else {
            // LINK_FLAG.DEFAULT_VALUE = 1 表示交易密码和资金密码是同一个，只需要校验交易密码
            promises.push(getValidateWeakPwdPromise(_this, fieldTrdPwd, "1"));
            promises.push(getValidateConfirmPwdPromise(fieldTrdPwd, fieldTrdPwd2));
        }
        return Promise.all(promises).then((resolves)=>{
            _.each(resolves, (resolve)=>{
                let fields = resolve.fields;
                let message = resolve.message;
                _.each(fields, (field)=> {
                    field.correct = true;
                    field.message = message;
                })
            })
            return true;
        }
        ).catch((reject)=>{
            return false;
        });
    },
    //下一步验证
    openBizPwdNodeValidate : function(_this) {
        //点击下一步 手动触发一次密码校验，防止输入密码错误，直接点击下一步，页面没有报错
        let reqList = [],
            fieldData = _this.groupDatas.ACCT_INFO.CUST_PWD_INFO[0].FIELDS;
        let fieldTrdPwd = fieldData.TRD_PWD;
        let fieldTrdPwd2 = fieldData.TRD_PWD2;
        let fieldFundPwd = fieldData.FUND_PWD;
        let fieldFundPwd2 = fieldData.FUND_PWD2;
        if(isTrdPwdSettedSameAsFundPwd(_this)){
            //选择了联动
            reqList.push(this.CHECK_TRD_PWD(_this, fieldTrdPwd, fieldData));
            reqList.push(this.CHECK_TRD_PWD2(_this, fieldTrdPwd2, fieldData));     
        }else{
            //没选择联动
            reqList.push(this.CHECK_TRD_PWD(_this, fieldTrdPwd, fieldData));
            reqList.push(this.CHECK_TRD_PWD2(_this, fieldTrdPwd2, fieldData));  
            reqList.push(this.CHECK_FUND_PWD(_this, fieldFundPwd, fieldData));
            reqList.push(this.CHECK_FUND_PWD2(_this, fieldFundPwd2, fieldData));  
        }
        return Promise.all(reqList).then(function(res) {
            console.log(res);
            if(!!res[0]){
                _this.messageAlert(res[0]);
                return false;
            }else if(!!res[1]){
                _this.messageAlert(res[1]);
                return false;
            }
            return true;
        });
    },
    //拼装提交的业务数据字段
    openBizPwdNodeGetData : function(_this,params) {
        console.log("openBizPwdNodeGetData")
        //获取密码信息
        let LINK_FLAG = "0";
        let AUTH_DATA_INFO = [];
        if(_this.userType == "0" || _this.userType == "1" || _this.userType == '2'){
            LINK_FLAG = params.ACCT_INFO.CUST_PWD_INFO[0].LINK_FLAG;
            if(LINK_FLAG === "1"){//开通联动
                var trdPwdVal = des.encrypt(params.ACCT_INFO.CUST_PWD_INFO[0].TRD_PWD, _this.oppBusiData.ID_CODE);
                AUTH_DATA_INFO.push({
                    USE_SCOPE: "0",
                    NEW_AUTH_DATA: trdPwdVal,
                    USER_ROLE: "1"
                });
                AUTH_DATA_INFO.push({
                    USE_SCOPE: "1",
                    NEW_AUTH_DATA: trdPwdVal,
                    USER_ROLE: "1"
                });
            }else{
                var trdPwdVal = des.encrypt(params.ACCT_INFO.CUST_PWD_INFO[0].TRD_PWD, _this.oppBusiData.ID_CODE);
                AUTH_DATA_INFO.push({
                    USE_SCOPE: "0",
                    NEW_AUTH_DATA: trdPwdVal,
                    USER_ROLE: "1"
                });
                var fundPwdVal = des.encrypt(params.ACCT_INFO.CUST_PWD_INFO[0].FUND_PWD, _this.oppBusiData.ID_CODE);
                AUTH_DATA_INFO.push({
                    USE_SCOPE: "1",
                    NEW_AUTH_DATA: fundPwdVal,
                    USER_ROLE: "1"
                });
            }
        }
        else {
            LINK_FLAG = "0";
            var trdPwdVal = des.encrypt(params.ACCT_INFO.CUST_PWD_INFO[0].TRD_PWD, _this.oppBusiData.ID_CODE);
            AUTH_DATA_INFO.push({
                USE_SCOPE: "0",
                NEW_AUTH_DATA: trdPwdVal,
                USER_ROLE: "1"
            });
            var fundPwdVal = des.encrypt(params.ACCT_INFO.CUST_PWD_INFO[0].FUND_PWD, _this.oppBusiData.ID_CODE);
            AUTH_DATA_INFO.push({
                USE_SCOPE: "1",
                NEW_AUTH_DATA: fundPwdVal,
                USER_ROLE: "1"
            });
        }
        let custInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
        Object.assign(params.ACCT_INFO, {
            CHECK_PWD_0: "true",//提交肯定是验证过密码的
            CHECK_PWD_1: "true",
            CUST_CODE:custInfo.CUST_CODE,
            LINK_FLAG: LINK_FLAG,
            AUTH_DATA_INFO: AUTH_DATA_INFO
        })
        delete params.ACCT_INFO.CUST_PWD_INFO;
        return params;
    },
    //页面激活
    openBizPwdNodePageActivated : function(_this, groupId){
        console.log("openBizPwdNodePageActivated");
    },
    openBizPwdNodeFieldDataChange : function(_this, field, fieldData, moduleInfo) {
        let fields = [];
        fields.push(fieldData.TRD_PWD);
        fields.push(fieldData.TRD_PWD2);
        if (_this.groupDatas.ACCT_INFO.CUST_PWD_INFO[0].FIELDS.LINK_FLAG.DEFAULT_VALUE == "0") {
            fields.push(fieldData.FUND_PWD);
            fields.push(fieldData.FUND_PWD2);
        }
        _this.disableNext = false;
        _.each(fields, (field) => {
            // 密码输入不合法，禁用下一步按钮
            if (!field.correct || field.DEFAULT_VALUE == "") {
                _this.disableNext = true;
                return false;
            }
        });
    },
    // ---------------- 字段关联逻辑------------------//
    "CHECK_LINK_FLAG" : (_this,field,fieldData) => {
        if(field.DEFAULT_VALUE != "" && field.FIELD_LAST_CHOOSE_VALUE && field.FIELD_LAST_CHOOSE_VALUE != undefined && field.FIELD_LAST_CHOOSE_VALUE != ""){
            field.DEFAULT_VALUE = field.FIELD_LAST_CHOOSE_VALUE;
        }
        let showMsg = "";
        if(field.DEFAULT_VALUE !== "" && field.DEFAULT_VALUE == "1" ){
            //是否勾选密码联动，勾选的话只显示一组密码
            fieldData["TRD_PWD"].FIELD_TITLE  =  "交易/资金密码"
            fieldData["TRD_PWD2"].FIELD_TITLE = "确认密码"
            fieldData["TRD_PWD"].FIELD_CONTROL = "0"
            fieldData["TRD_PWD2"].FIELD_CONTROL = "0"
            fieldData["FUND_PWD"].FIELD_CONTROL = "1"
            fieldData["FUND_PWD2"].FIELD_CONTROL = "1"
            showMsg = "温馨提示：您已将交易密码与资金密码设为相同！"
            _this.$refs.flowTip.pushFlowTip({
                title: showMsg,
                type: 'warning',
                key: 'open'
            })
        } else if (field.DEFAULT_VALUE !== "" && field.DEFAULT_VALUE == "0") {
            //不勾选 显示两组密码
            fieldData["TRD_PWD"].FIELD_TITLE  =  "交易密码"
            fieldData["TRD_PWD2"].FIELD_TITLE = "确认交易密码"
            fieldData["TRD_PWD"].FIELD_CONTROL = "0"
            fieldData["TRD_PWD2"].FIELD_CONTROL = "0"
            fieldData["FUND_PWD"].FIELD_CONTROL = "0"
            fieldData["FUND_PWD2"].FIELD_CONTROL = "0"
            _this.$refs.flowTip.removeFlowTip("open")
        } else {
            fieldData["TRD_PWD"].FIELD_CONTROL = "1"
            fieldData["TRD_PWD2"].FIELD_CONTROL = "1"
            fieldData["FUND_PWD"].FIELD_CONTROL = "1"
            fieldData["FUND_PWD2"].FIELD_CONTROL = "1"
            _this.$refs.flowTip.removeFlowTip("open")
        }
    },
    "CHECK_TRD_PWD" : (_this,field,fieldData) => {
        //如果修改后的密码跟上次一样就不需要再次校验了
        if(field.DEFAULT_VALUE !== "" && field.FIELD_LAST_CHOOSE_VALUE !=  field.DEFAULT_VALUE ){
            field.FIELD_LAST_CHOOSE_VALUE =  field.DEFAULT_VALUE;
            //先清空确认密码输入框的值，再进行弱密码校验
            fieldData.TRD_PWD2.DEFAULT_VALUE = "";
            validPassword(_this,'0',field,fieldData.TRD_PWD2)
        }
    },
    "CHECK_TRD_PWD2" : (_this,field,fieldData) => {
        if(field.DEFAULT_VALUE !== ""){
            return checkTwoPassword(fieldData.TRD_PWD,field)
        }
    },
    "CHECK_FUND_PWD" : (_this,field,fieldData) => {
        if(field.DEFAULT_VALUE !== ""){
            //先清空确认密码输入框的值，再进行弱密码校验
            fieldData.FUND_PWD2.DEFAULT_VALUE = "";
            validPassword(_this,'1',field,fieldData.FUND_PWD2)
        }
    },
    "CHECK_FUND_PWD2" : (_this,field,fieldData) => {
        if(field.DEFAULT_VALUE !== ""){
            checkTwoPassword(fieldData.FUND_PWD,field)
        }
    },
    /**
     * 进行弱密码校验
     * 注：此函数进行校验时会把确认密码置空，仅用于密码框完成填写时的触发事件，严禁用于点击下一步时的触发事件！
     * @param {Object} _this 
     * @param {Object} field 
     * @param {Object} fieldData 
     */
    "OPEN_BIZ_CHECK_TRD_PWD" : (_this, field, fieldData) => {
        if (isFieldValueNotChanged(field) || _.isEmpty(field.DEFAULT_VALUE)) {
            return;
        }
        clearFieldValueAndSetLastValueUndefine(fieldData.TRD_PWD2);
        // 交易密码的 useScope 为 0
        let useScope = "0";
        if(isTrdPwdSettedSameAsFundPwd(_this)) {
            // 如果选择了密码联动，则 useScope 要与资金密码的 useScope 相同，即为 1
            useScope = "1";
        }
        showMessageAndClearPwdIfFailInValidating(_this, field, getValidateWeakPwdPromise(_this, field, useScope));
        field.LAST_DEFAULT_VALUE = field.DEFAULT_VALUE;
    },
    /**
     * 校验确认密码是否与密码相同
     * @param {Object} _this 
     * @param {Object} field 
     * @param {Object} fieldData 
     */
    "OPEN_BIZ_CHECK_TRD_PWD2" : (_this, field, fieldData) => {
        if (isFieldValueNotChanged(field) || _.isEmpty(field.DEFAULT_VALUE)) {
            return;
        }
        showMessageAndClearPwdIfFailInValidating(_this, field, getValidateConfirmPwdPromise(fieldData.TRD_PWD, field));
        field.LAST_DEFAULT_VALUE = field.DEFAULT_VALUE;
    },
    /**
     * 进行弱密码校验
     * 注：此函数进行校验时会把确认密码置空，仅用于密码框完成填写时的触发事件，严禁用于点击下一步时的触发事件！
     * @param {Object} _this 
     * @param {Object} field 
     * @param {Object} fieldData 
     */
    "OPEN_BIZ_CHECK_FUND_PWD" : (_this, field, fieldData) => {
        if (isFieldValueNotChanged(field) || _.isEmpty(field.DEFAULT_VALUE) || isTrdPwdSettedSameAsFundPwd(_this)) {
            return;
        }
        clearFieldValueAndSetLastValueUndefine(fieldData.FUND_PWD2);
        showMessageAndClearPwdIfFailInValidating(_this, field, getValidateWeakPwdPromise(_this, field, "1"));
        field.LAST_DEFAULT_VALUE = field.DEFAULT_VALUE;
    },
    /**
     * 校验确认密码是否与密码相同
     * @param {Object} _this 
     * @param {Object} field 
     * @param {Object} fieldData 
     */
    "OPEN_BIZ_CHECK_FUND_PWD2" : (_this, field, fieldData) => {
        if (isFieldValueNotChanged(field) || _.isEmpty(field.DEFAULT_VALUE) || isTrdPwdSettedSameAsFundPwd(_this)) {
            return;
        }
        showMessageAndClearPwdIfFailInValidating(_this, field, getValidateConfirmPwdPromise(fieldData.FUND_PWD, field));
        field.LAST_DEFAULT_VALUE = field.DEFAULT_VALUE;
    }
}