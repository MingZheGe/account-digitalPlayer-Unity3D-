/*
 *   个人基本信息模块
 *   方法封装
 *   @author  yangyp
 */

import bizPublicMethod from "../../../../../../../business/businessTools/bizPublicMethod.js"
import smsService from '../../../../../../../service/sms-service'
import bizPublicSaveMethod from "../../../../../../businessTools/bizPublicSaveMethod.js"

let email_valid_switch = "0",//邮件验证功能开关
    email_valid_time = "14",//验证邮件有效时间(天)
    msg_valid_switch = "0",//短信验证功能开关 
    msg_valid_time = "60";//短信验证码有效时间


const alertMessageNoRouter = function (_this, message) {
    _this.messageBox({
        hasMask: true,
        messageText: message,
        confirmButtonText: "确定",
        typeMessage: "warn",
        showMsgBox: true
    })
};
//开户和非开户 字段数据加载 公共操作
const bizCustImportantLinkInfoNodeBeforeLoadBizCommon = (_this) => {
    _this.oppBusiData.valid = {
        "email_valid_switch": _this.$blMethod.getJsonSessionSysCommParam(_this, 'APP_EMAIL_VALID_SWITCH') || "0",
        "email_valid_time": _this.$blMethod.getJsonSessionSysCommParam(_this, 'APP_EMAIL_VALID_TIME') || "14",
        "msg_valid_switch": _this.$blMethod.getJsonSessionSysCommParam(_this, 'APP_MSG_VALID_SWITCH') || "0",
        "msg_valid_time": _this.$blMethod.getJsonSessionSysCommParam(_this, 'MSG_VALID_TIME') || "60",
        "voice_msg_valid_switch": _this.$blMethod.getJsonSessionSysCommParam(_this, 'APP_VOICE_MSG_VALID_SWITCH') || "0"
    }
    let custInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
    if (custInfo.USER_TYPE == "0") {
        let fieldData = _this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS;
        fieldData["ADDRESS"]["VALID_TYPE"] = "length[24,64]|on-blur";
    }
    
}
export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizCustImportantLinkInfoNodeBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizCustImportantLinkInfoNodeBeforeLoadBiz: function (_this) {
        _this.oppBusiData.IMP_SEND_COUNT = 0;
        bizCustImportantLinkInfoNodeBeforeLoadBizCommon(_this)
        _this.oppBusiData.cloneOldBusiImpInfo = _.cloneDeep( _.get(_this.oppBusiData, 'oldBusiData.CUST_BASIC_INFO', ''));
        //这里将默认值的手机号码改为打码 为了让打码号码不显示变色
        _this.oppBusiData.cloneOldBusiImpInfo.MOBILE_TEL = _this.oppBusiData.cloneOldBusiImpInfo.MOBILE_TEL.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
        bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["IMP_LINK_INFO"], _this.oppBusiData.cloneOldBusiImpInfo);
    },
    bizCustImportantLinkInfoNodeBeforeLoadBizOpenAcct: function(_this) {
        _this.oppBusiData.IMP_SEND_COUNT = 0;
        bizCustImportantLinkInfoNodeBeforeLoadBizCommon(_this);
        let fieldData = _this.groupDatas.CUST_LINK_INFO.IMP_LINK_INFO[0].FIELDS;
        fieldData["MOBILE_TEL"]["VALID_TYPE"] = "mobile";
        // 根据公参判断 页面展示的逻辑
        if (_this.oppBusiData.valid.msg_valid_switch == "1") {
            // 验证码 正常展示
            _this.$set(fieldData.VALIDATE_CODE,'FIELD_CONTROL',"2");
            _this.$set(fieldData.VALIDATE_CODE,'IS_SHOW_BUTTON',true);
            _this.$set(fieldData.VALIDATE_CODE,'FIELD_BUTTON_TXT',`确认验证码`);
            // 重要手机字段
            fieldData.MOBILE_TEL.IS_SHOW_BUTTON = true;
            _this.$set(fieldData.MOBILE_TEL,'SUFFIX_ICON',"el-icon-warning red");
            _this.$set(fieldData.MOBILE_TEL,'FIELD_BUTTON_TXT',`发送验证码`);
        } else {
            _this.$set(fieldData.VALIDATE_CODE,'FIELD_CONTROL',"1");
            _this.$set(fieldData.VALIDATE_CODE,'IS_SHOW_BUTTON',false);
            fieldData.MOBILE_TEL.IS_SHOW_BUTTON = false;
        }
        
        
    },
    /*
     *@method bizCustImportantLinkInfoNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-13 09:42:56
     */
    bizCustImportantLinkInfoNodeAfterLoadBiz: function (_this) {
        //重新解析历史数据
        let custInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
        
        if( _this.oppBusiData.newBusiData && _this.oppBusiData.newBusiData.IMP_LINK_INFO){
            _this.oppBusiData.cloneNewBusiImpInfo = _.cloneDeep(_this.oppBusiData.newBusiData.IMP_LINK_INFO);
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["IMP_LINK_INFO"], _this.oppBusiData.cloneNewBusiImpInfo);
        }
        
        
        if (!_.isEmpty(custInfo.CUST_CODE)) {
            return Promise.all([
                _this.$syscfg.K_Request('Y8000007', Object.assign({
                            "CUST_CODE": custInfo.CUST_CODE
                    })),
                ]).then(data => {
                    console.log(data);
                    _this.oppBusiData.ygtEmailValidData = data&&data[0]&&data[0].Data&&data[0].Data[0] || {};
            }).catch(err => {

            })
        } else {
            _this.oppBusiData.ygtEmailValidData = {};
        }
    },
    /*
     *@method bizCustImportantLinkInfoNodeBeforeSave
     *@desc 钩子函数 自定义保存数
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizCustImportantLinkInfoNodeBeforeSave: function (_this, params) {
        let oldBusiData = _this.oppBusiData.oldBusiData || {};
        let custInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
        let IMPORT_INFO_NEW = {};
        bizPublicMethod.$blMethod.changeObjKeys(_this.groupDatas.CUST_LINK_INFO.IMP_LINK_INFO[0].FIELDS, IMPORT_INFO_NEW);
        
        
        let isChangeMobile = false;
        if(IMPORT_INFO_NEW.MOBILE_TEL.includes('*') || _.get(_this.oppBusiData, 'oldBusiData.CUST_BASIC_INFO.MOBILE_TEL', '') == IMPORT_INFO_NEW.MOBILE_TEL) {
            IMPORT_INFO_NEW.MOBILE_TEL = _.get(oldBusiData, 'CUST_BASIC_INFO.MOBILE_TEL', '');
            isChangeMobile = false; //包含*号，表示没有修改手机号，还是原来的值
        }else{
            isChangeMobile = true;
        }

        let custExtAttr = _.get(oldBusiData, 'CUST_BASIC_INFO.CUST_EXT_ATTR', '');
        let changFlag = IMPORT_INFO_NEW.EMAIL !== _.get(oldBusiData, 'CUST_BASIC_INFO.EMAIL', '');
        let EMAIL_CHK_FLAG = _this.oppBusiData.EMAIL_CHK_FLAG || _.get(oldBusiData, 'CUST_BASIC_INFO.EMAIL_CHK_FLAG', '');
        Object.assign(IMPORT_INFO_NEW, {
            "FISL_EMAIL": (changFlag || EMAIL_CHK_FLAG === "1") && custExtAttr.indexOf("1") > 0 ? IMPORT_INFO_NEW.EMAIL : (oldBusiData.CUST_BASIC_INFO && oldBusiData.CUST_BASIC_INFO.FISL_EMAIL) || "",
            "OPT_EMAIL": (changFlag || EMAIL_CHK_FLAG === "1") && custExtAttr.indexOf("3") > 0 ? IMPORT_INFO_NEW.EMAIL : (oldBusiData.CUST_BASIC_INFO && oldBusiData.CUST_BASIC_INFO.OPT_EMAIL) || "",
            "MOBILE_TEL": IMPORT_INFO_NEW.MOBILE_TEL,
            "TEL_CHK_FLAG": _this.oppBusiData.TEL_CHK_FLAG || '',
            "EMAIL_CHK_FLAG": EMAIL_CHK_FLAG,
        } );
        if (!_this.oppBusiData.TEL_CHK_FLAG) {
            delete IMPORT_INFO_NEW.TEL_CHK_FLAG
        }
        if (!_this.oppBusiData.EMAIL_CHK_FLAG) {
            delete IMPORT_INFO_NEW.EMAIL_CHK_FLAG
        }
        let data2 = bizPublicMethod.$blMethod.compareInfo2(oldBusiData.CUST_BASIC_INFO || {}, IMPORT_INFO_NEW);
        //开户为空数组
        let DIFF_INFO = isOpenAcct(_this) ? [] : data2;
        // //数据保存 个人重要手机修改了需要视频见证
        if (_this.moduleId.indexOf("IMP_LINK_INFO") != -1 ) {
            Object.assign(params, {
                IMP_LINK_INFO: IMPORT_INFO_NEW
            })
            if (custInfo.USER_TYPE == "0") {
                params.witnessFlag = (_this.$store.state.witnessFlag == "1" || isChangeMobile) ? "1" : "0";
            }
            params.IMP_LINK_INFO.DIFF_INFO = DIFF_INFO;
            if(params.witnessFlag == "0"){
                params.SEEOPENACC_TYPE = "3";
                params.witnessNum = "";
            }
        }
        clearInterval(_this.oppBusiData.interTimer);
        // 数据保存
        
    },
    /*
     *@method bizCustImportantLinkInfoNodeValidate
     *@desc 钩子函数 下一步验证
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizCustImportantLinkInfoNodeValidate: function (_this) {
        // 手机号码相关逻辑
        if(_this.oppBusiData.valid.msg_valid_switch != "0" && _this.oppBusiData.TEL_CHK_FLAG != '1'){
            _this.messageBox({
                hasMask:true,
                messageText:"请校验手机号码！",
                confirmButtonText:'确定',
                typeMessage:'warn', 
                showMsgBox:true,
                confirmedAction: function () {
                }
            });
            return false;
        }

        // 邮箱相关逻辑
        let originalData = _.get(_this.oppBusiData, 'oldBusiData.CUST_BASIC_INFO', {});
        let email263ActiveFlag = /.*@csc.263.net/.test(_.get(originalData, 'FISL_EMAIL', ''));
        let email = _.get(_this.groupDatas, 'CUST_LINK_INFO.IMP_LINK_INFO[0].FIELDS.EMAIL.DEFAULT_VALUE', '');
        let validFlag = true; //邮箱认证状态
        let EMAIL_CHK_FLAG = _this.oppBusiData.EMAIL_CHK_FLAG || '';


        if (!isOpenAcct(_this)) {
            if (originalData.EMAIL) {
                if (originalData.EMAIL_CHK_FLAG === "1") {
                    if (!email) {
                        if (/[137]/.test(originalData.CUST_EXT_ATTR)) {
                            alertMessageNoRouter(_this, "客户已开通“融资融券、贵金属或期权”业务，不能删除邮箱！");
                        } else {
                            alertMessageNoRouter(_this, "客户邮箱已激活，不能删除！");
                        }
                        validFlag = false;
                    } else if (EMAIL_CHK_FLAG !== "1") {
                        alertMessageNoRouter(_this, "重要邮箱未认证！");
                        validFlag = false;
                    }
                } else if (email263ActiveFlag) {
                    if (!email) {
                        alertMessageNoRouter(_this, "客户邮箱已激活，不能删除！");
                        validFlag = false;
                    } else if (email !== originalData.EMAIL && EMAIL_CHK_FLAG !== "1") {
                        alertMessageNoRouter(_this, "重要邮箱未认证！");
                        validFlag = false;
                    }
                } else {
                    // 若客户存量重要邮箱有内容且未认证，需要检查客户是否开通“融资融券、贵金属、期权”业务
                    if (/[137]/.test(originalData.CUST_EXT_ATTR)) {
                        // 若客户开过此三项业务，可应用留存重要邮箱或变更新的重要邮箱。必须当场发送验证邮件，强制当场验证
                        if (EMAIL_CHK_FLAG !== "1") {
                            alertMessageNoRouter(_this, "重要邮箱未认证！");
                            validFlag = false;
                        }
                    }
                }
            } else if(email263ActiveFlag && email && EMAIL_CHK_FLAG !== "1") {
                alertMessageNoRouter(_this, "重要邮箱未认证！");
                validFlag = false;
            } else if (/[137]/.test(originalData.CUST_EXT_ATTR)) {
                // 若客户存量重要邮箱有内容且未认证，需要检查客户是否开通“融资融券、贵金属、期权”业务
                // 若客户开过此三项业务，可应用留存重要邮箱或变更新的重要邮箱。必须当场发送验证邮件，强制当场验证
                if (!email) {
                    alertMessageNoRouter(_this, "客户已开通“融资融券、贵金属或期权”业务，必须填写重要邮箱！");
                    validFlag = false;
                } else if (EMAIL_CHK_FLAG !== "1") {
                    alertMessageNoRouter(_this, "重要邮箱未认证！");
                    validFlag = false;
                }
            }
        }
        return validFlag;
       
    },

    // 上一步
    bizCustImportantLinkInfoNodePreValidate: function(_this) {
        
        let custInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
        if (custInfo.USER_TYPE == '0') {
            // _this.$router.goRoute("诚信记录");
            // _this.$router.goRoute("税收居民身份");
        }
        // if (custInfo.USER_TYPE == '1') {
        //     if(["1", "2"].includes(_this.groupDatas.TAX_INFO.ORG_PASSIVE_INFO[0].FIELDS.PASSIVE_NFE.DEFAULT_VALUE)) {
        //         _this.$router.goRoute("控制人涉税声明信息");
        //     }else {
        //         _this.$router.goRoute("税收居民身份信息");
        //     }
            
        // }
        if (custInfo.USER_TYPE == '2') {
            // _this.$router.goRoute("基本资料");
        }
        // throw "preventNextStep";
        
    },

    /*
     *@method bizCustImportantLinkInfoNodePageActivated
     *@desc 钩子函数：页面激活
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizCustImportantLinkInfoNodePageActivated: function (_this) {
        let busi_info = _this.$storage.getJsonSession(_this.$definecfg.BUSI_INFO) || {};
        _this.groupDatas.CUST_LINK_INFO.IMP_LINK_INFO[0].FIELDS.MOBILE_TEL.FIELD_FUNCTION = "CHECK_IMP_MOBILE_TEL";
        _this.groupDatas.CUST_LINK_INFO.IMP_LINK_INFO[0].FIELDS.VALIDATE_CODE.FIELD_FUNCTION = "CHECK_IMP_VALIDATE_CODE";
        _this.groupDatas.CUST_LINK_INFO.IMP_LINK_INFO[0].FIELDS.EMAIL.FIELD_FUNCTION = "CHECK_IMP_EMAIL";
        if(_this.moduleId.indexOf("IMP_LINK_INFO") != -1){
            _this.$refs.flowTip.pushFlowTip({
                title : "重要邮箱（重要手机）是我公司向客户发送相关通知信息的重要途径之一，如客户在我公司开立融资融券、股票期权、贵金属等账户，重要邮箱（重要手机）修改、认证激活后将默认同步至客户名下该客户号下所有账户，请提示客户重点关注，确认客户修改意愿。",
                type:'warning',
                key:'name'
            })
            if (isOpenAcct(_this)) {
                _this.$refs.flowTip.pushFlowTip({
                    title : "开户后会对联系人进行电话回访，请提示联系人注意接听。",
                    type:'warning',
                    key:'name'
                })
            }
        }
        let fields = _this.groupDatas.CUST_LINK_INFO.IMP_LINK_INFO[0].FIELDS;
        let oldBusiData = _.get(_this.oppBusiData, 'oldBusiData.CUST_BASIC_INFO', {});
        let newBusiData_IMP_LINK_INFO = busi_info.IMP_LINK_INFO || _.get(_this.oppBusiData, 'newBusiData.IMP_LINK_INFO', {});
        // 重要邮箱
        _this.oppBusiData.EMAIL_CHK_FLAG = _.get(newBusiData_IMP_LINK_INFO, 'EMAIL_CHK_FLAG', '') || _.get(oldBusiData, 'EMAIL_CHK_FLAG', '')
        // 重要电话
        _this.oppBusiData.OLD_TEL_CHK_FLAG = oldBusiData.TEL_CHK_FLAG || "";
        _this.oppBusiData.TEL_CHK_FLAG = newBusiData_IMP_LINK_INFO.TEL_CHK_FLAG || "";
        //当前组件的数值
        let currentMobile = _.get(_this.groupDatas, 'CUST_LINK_INFO.IMP_LINK_INFO[0].FIELDS.MOBILE_TEL.DEFAULT_VALUE', '');
        if (currentMobile.includes("****")) {
            currentMobile = oldBusiData.MOBILE_TEL;
        }
        //手机验证码展示逻辑
        const phoneCheckFn = (isCheck) => {
            if (isCheck && _this.oppBusiData.valid.msg_valid_switch != "0") {
                // 重要手机显示校验
                _this.$set(fields.VALIDATE_CODE,'FIELD_CONTROL', "2");
                _this.$set(fields.VALIDATE_CODE,'IS_SHOW_BUTTON', true);
                _this.$set(fields.VALIDATE_CODE,'FIELD_BUTTON_TXT', `确认验证码`);
                _this.$set(fields.MOBILE_TEL,'IS_SHOW_BUTTON', true);
                _this.$set(fields.MOBILE_TEL,'SUFFIX_ICON',"el-icon-warning red");
                _this.$set(fields.MOBILE_TEL,'FIELD_BUTTON_TXT', `发送验证码`);
                return;
            }
            _this.oppBusiData.checkMobile = currentMobile;
            _this.oppBusiData.TEL_CHK_FLAG = "1";
            fields.VALIDATE_CODE.FIELD_CONTROL = "1"; // 验证码 隐藏
            fields.MOBILE_TEL.IS_SHOW_BUTTON = false;
            _this.$set(fields.MOBILE_TEL, 'SUFFIX_ICON', _this.oppBusiData.valid.msg_valid_switch == "0" ? "" : "el-icon-success");
        }
        //1.当前值为空（即没有填写过重要手机号）
        //2.当前值与落地数据一致 且未校验
        //3.当前值与缓存数据一致 且未校验
        //4.当前值不为空且与缓存数据不一致
        phoneCheckFn( !currentMobile || !(currentMobile == oldBusiData.MOBILE_TEL && _this.oppBusiData.OLD_TEL_CHK_FLAG == "1" || currentMobile == newBusiData_IMP_LINK_INFO.MOBILE_TEL && _this.oppBusiData.TEL_CHK_FLAG == "1"))
        
        
    },

    //----------------------业务函数----------------------------------//
    bizCustImportantLinkInfoNodeGetCustInfo: function (_this, groupId) {

    },

    "CHECK_ADDRESS": (_this, field,fieldData) => {
        //获取地址的邮编
        let addressCode = field.addressCode;
        if (addressCode && fieldData.ZIP_CODE) {
            fieldData.ZIP_CODE.DEFAULT_VALUE = addressCode;
        }
    },
    "CHECK_IMP_MOBILE_TEL": (_this, field,fieldData) => {
        _this.$nextTick( () => {
            if (field.FIELD_CONTROL == '2') {
                return;
            }
            //有打码 不需要改变颜色
            if (field.DEFAULT_VALUE.includes('****')) {
                fieldData["MOBILE_TEL"]["VALID_TYPE"] = "on-focus";
            }
            let currentValid = _.cloneDeep(field.currentValid)
            field.currentValid = '';
            let oldMobile = _.get(_this.oppBusiData, 'oldBusiData.CUST_BASIC_INFO.MOBILE_TEL', '');
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
            let defaultValue = field.DEFAULT_VALUE.includes('****') ? oldMobile : field.DEFAULT_VALUE;
            let newMobile = _.get(_this.oppBusiData, 'newBusiData.IMP_LINK_INFO.MOBILE_TEL', '');
            if (_this.oppBusiData.valid.msg_valid_switch != "0") {
                if ( !(defaultValue == oldMobile && _this.oppBusiData.OLD_TEL_CHK_FLAG == "1" 
                || _this.oppBusiData.checkMobile == defaultValue
                || defaultValue == newMobile && _this.oppBusiData.TEL_CHK_FLAG == "1")) {
                    _this.oppBusiData.TEL_CHK_FLAG = "";
                    // 验证码 正常展示
                    _this.$set(fieldData.VALIDATE_CODE, 'FIELD_CONTROL', "2");
                    _this.$set(fieldData.VALIDATE_CODE, 'IS_SHOW_BUTTON', true);
                    _this.$set(fieldData.VALIDATE_CODE, 'FIELD_BUTTON_TXT', `确认验证码`);
                    // 重要手机字段
                    _this.$set(fieldData.MOBILE_TEL,'IS_SHOW_BUTTON', true);
                    _this.$set(fieldData.MOBILE_TEL,'FIELD_BUTTON_TXT',`发送验证码`);
                    _this.$set(field,'SUFFIX_ICON',"el-icon-warning red");
                    return;
                }
                _this.oppBusiData.TEL_CHK_FLAG = "1";
                _this.$set(fieldData.VALIDATE_CODE,'FIELD_CONTROL', "1");
                _this.$set(fieldData.MOBILE_TEL,'IS_SHOW_BUTTON', false);
                _this.$set(fieldData.MOBILE_TEL,'IS_SHOW_BUTTON_TWO', false);
                _this.$set(field,'SUFFIX_ICON', "el-icon-success");
            }
            // 验证开关（关）
            if (_this.oppBusiData.valid.msg_valid_switch == "0") {
                _this.oppBusiData.TEL_CHK_FLAG = "";
                _this.$set(fieldData.VALIDATE_CODE,'FIELD_CONTROL', "1");
                _this.$set(fieldData.MOBILE_TEL,'IS_SHOW_BUTTON', false);
                _this.$set(fieldData.MOBILE_TEL,'IS_SHOW_BUTTON_TWO', false);
                _this.$set(field,'SUFFIX_ICON', "");
            }
        })
        
    },
    "CHECK_IMP_VALIDATE_CODE__CLICK": (_this, field,fieldData) => {
        let that = _this;
        if(field.FIELD_CONTROL == "1" || !fieldData.MOBILE_TEL.DEFAULT_VALUE){return ;}
        let validateCode = field.DEFAULT_VALUE;
        if(validateCode.length != 6){return ;}
        if(field.DEFAULT_VALUE) {
            let userInfo = that.$storage.getJsonSession(that.$definecfg.USER_INFO),
            custInfo = that.$storage.getJsonSession(that.$definecfg.CUSTOMER_INFO),
            params = {
                ORG_CODE: userInfo.ORG_CODE,
                MOBILE: fieldData.MOBILE_TEL.DEFAULT_VALUE,
                AUTH_CODE: validateCode,
                CUST_CODE: custInfo.CUST_CODE,
                ID_TYPE: custInfo.ID_TYPE,
                ID_CODE: custInfo.ID_CODE
            };
            let oldBusiData = _.get(_this.oppBusiData, 'oldBusiData.CUST_BASIC_INFO', {});
            if (params.MOBILE.includes("****")) {
                params.MOBILE = oldBusiData.MOBILE_TEL;
            }
            that.myLoading('校验中...');
            smsService.checkUpValidCode(params).then( function(resultObj) {
                if(resultObj.VALID_FLAG == "1") {
                    that.myLoading({loadingText:'校验中...',showLoading:false});
                    that.messageBox({
                        hasMask:true,
                        messageText:"校验成功！",
                        confirmButtonText:'确定',
                        typeMessage:'', 
                        showMsgBox:true  
                    });
                    _this.oppBusiData.checkMobile = fieldData.MOBILE_TEL.DEFAULT_VALUE;
                    that.oppBusiData.TEL_CHK_FLAG = "1";
                    fieldData.MOBILE_TEL.IS_SHOW_BUTTON = false;
                    fieldData.MOBILE_TEL.IS_SHOW_BUTTON_TWO = false
                    fieldData.MOBILE_TEL.FIELD_CONTROL = "0";
                    _this.$set(fieldData.MOBILE_TEL,'SUFFIX_ICON',"el-icon-success");
                    _this.$set(field,'FIELD_BUTTON_TXT',`校验通过`);
                    field.DEFAULT_VALUE = ""
                    field.FIELD_CONTROL = 1;

                    clearInterval(_this.oppBusiData.interTimer);
                }else{
                    that.myLoading({sloadingText:'校验失败！',showLoading:false});
                    that.messageBox({
                        hasMask:true,
                        messageText:"认证失败，验证码错误或已过期！",
                        confirmButtonText:'确定',
                        typeMessage:'warn', 
                        showMsgBox:true  
                    });
                    field.DEFAULT_VALUE = ""
                    _this.$set(fieldData.MOBILE_TEL,'SUFFIX_ICON',"el-icon-warning red");
                }
            })
        }
       
    },
    "CHECK_IMP_MOBILE_TEL__CLICK": (_this, field, fieldData) => {
        let that = _this;
        //手机号码不正确时，不能发送验证码
        if(!field.correct){
            return false;
        }
        if ( field.BUTTON_ENABLE_TWO && field.BUTTON_ENABLE_TWO == true  ) {
            that.messageBox({
                hasMask:true,
                messageText:"验证码已发已为您发送验证码，请先使用！",
                confirmButtonText:'确定',
                typeMessage:'', 
                showMsgBox:true  
            });
            return false;
        }
        let oldBusiData = _.get(_this.oppBusiData, 'oldBusiData.CUST_BASIC_INFO', {});
        let userInfo = that.$storage.getJsonSession(that.$definecfg.USER_INFO),
            custInfo = that.$storage.getJsonSession(that.$definecfg.CUSTOMER_INFO),
            params = {
                ORG_CODE:userInfo.ORG_CODE,
                MOBILE_TEL:fieldData.MOBILE_TEL.DEFAULT_VALUE,
                CUST_CODE:custInfo.CUST_CODE,
                ID_TYPE:custInfo.ID_TYPE,
                ID_CODE:custInfo.ID_CODE
            };
        if (params.MOBILE_TEL.includes("****")) {
            params.MOBILE_TEL = oldBusiData.MOBILE_TEL;
        }
        if(fieldData.MOBILE_TEL.DEFAULT_VALUE && fieldData.MOBILE_TEL.correct){
            that.myLoading('短信验证码发送中...');
            smsService.getSmsValidCode(params).then(function(resultObj){
                if(resultObj && resultObj.SEND_FLAG == "1"){
                    //vue深层次响应理
                    that.myLoading({sloadingText: '发送中...',showLoading: false});
                    _this.$set(field,'FIELD_CONTROL', "2");
                    _this.$set(field,'BUTTON_ENABLE', true);
                    _this.$set(fieldData.VALIDATE_CODE, 'FIELD_CONTROL', "0");
                    _this.oppBusiData.IMP_SEND_COUNT++;
                    let remainTime = _this.oppBusiData.valid.msg_valid_time;
                    _this.oppBusiData.interTimer = setInterval(function(){
                        if (remainTime <= 0) {
                            _this.oppBusiData.isTimeout60 = false;
                            _this.$set(field,'BUTTON_ENABLE', false);
                            _this.$set(field,'FIELD_CONTROL', "0");
                            _this.$set(field,'FIELD_BUTTON_TXT',`发送验证码`);
                            if ((_this.oppBusiData.valid.voice_msg_valid_switch != "0") && _this.oppBusiData.IMP_SEND_COUNT >= 2) {
                                _this.$set(field, 'IS_SHOW_BUTTON_TWO', true)
                                _this.$set(field, 'FIELD_BUTTON_TXT_TWO', `语音验证码`)
                            }
                            clearInterval(_this.oppBusiData.interTimer);
                            return;
                        }
                        remainTime--;
                        field.FIELD_BUTTON_TXT = `重新发送(${remainTime}秒)`;
                    },1000);
                    
                    //发送验证码以后开始倒计时 设置标识 默认true
                    that.oppBusiData.isTimeout60 = true;

                }else{
                    that.messageBox({
                        hasMask:true,
                        messageText:"获取验证码失败！",
                        confirmButtonText:'确定',
                        typeMessage:'error', 
                        showMsgBox:true  
                    });
                }
            });
        }
    },
    "CHECK_IMP_MOBILE_TEL__CLICK_TWO": (_this, field, fieldData) => {
        let that = _this;
        //手机号码不正确时，不能发送验证码
        if(!field.correct){
            return false;
        }
        if ( field.BUTTON_ENABLE && field.BUTTON_ENABLE== true ) {
            that.messageBox({
                hasMask:true,
                messageText:"验证码已发已为您发送验证码，请先使用！",
                confirmButtonText:'确定',
                typeMessage:'', 
                showMsgBox:true  
            });
            return false;
        }
        let oldBusiData = _.get(_this.oppBusiData, 'oldBusiData.CUST_BASIC_INFO', {});
        let userInfo = that.$storage.getJsonSession(that.$definecfg.USER_INFO),
            custInfo = that.$storage.getJsonSession(that.$definecfg.CUSTOMER_INFO),
            params = {
                ORG_CODE: userInfo.ORG_CODE,
                MOBILE_TEL: fieldData.MOBILE_TEL.DEFAULT_VALUE,
                CUST_CODE: custInfo.CUST_CODE,
                ID_TYPE: custInfo.ID_TYPE,
                ID_CODE: custInfo.ID_CODE,
                TYPE: "0"
            };
        if (params.MOBILE_TEL.includes("****")) {
            params.MOBILE_TEL = oldBusiData.MOBILE_TEL;
        }
        that.myLoading('正在发送验证码...');
        // 这个应该是发送语音验证码的方法
        smsService.getVoiceValidCode(params).then(function(resultObj){
            if(resultObj && resultObj.SEND_FLAG == "1"){
                //vue深层次响应理
                that.myLoading({sloadingText:'发送中...',showLoading:false});
                _this.$set(field,'FIELD_CONTROL', "2");
                _this.$set(field,'BUTTON_ENABLE_TWO', true)
                _this.$set(fieldData.VALIDATE_CODE, 'FIELD_CONTROL', "0");
                let remainTime = _this.oppBusiData.valid.msg_valid_time;
                _this.oppBusiData.interTimerTwo = setInterval(function(){
                    if (remainTime <= 0) {
                        that.oppBusiData.isTimeout60 = false;
                        _this.$set(field,'FIELD_CONTROL', "0");
                        _this.$set(field,'BUTTON_ENABLE_TWO',false)
                        _this.$set(field, 'FIELD_BUTTON_TXT_TWO', `语音验证码`)
                        clearInterval(_this.oppBusiData.interTimerTwo);
                        return;
                    }
                    remainTime--;
                    field.FIELD_BUTTON_TXT_TWO = `重新发送(${remainTime}秒)`;
                },1000);
                //发送验证码以后开始倒计时 设置标识 默认true
                that.oppBusiData.isTimeout60 = true;
            }else{
                that.messageBox({
                    hasMask:true,
                    messageText:"获取验证码失败！",
                    confirmButtonText:'确定',
                    typeMessage:'error', 
                    showMsgBox:true  
                });
            }
        });
    },
    "CHECK_IMP_EMAIL": (_this, field, fieldData) => {
        let originalData = _.get(_this.oppBusiData, 'oldBusiData.CUST_BASIC_INFO', {}); // 原始值
        let origEmail = originalData && originalData.EMAIL || "",
            origEmailFlag = originalData && originalData.EMAIL_CHK_FLAG || "";
        let oldEmail = _.get(_this.oppBusiData, 'oldBusiData.CUST_BASIC_INFO.EMAIL', '');
        let oldEmailFlay = _.get(_this.oppBusiData, 'oldBusiData.CUST_BASIC_INFO.EMAIL_CHK_FLAG', '');
        let defaultValue = field.DEFAULT_VALUE || '';
        if (!defaultValue) {
            return;
        }

        if(_this.oppBusiData.valid.email_valid_switch != "0" && !isOpenAcct(_this)) {
            // 邮箱为原邮箱且已验证标识 或 值为一码通已验证过的邮箱
            if (oldEmail === defaultValue && oldEmailFlay == "1" 
            || (_.get(_this.oppBusiData, 'ygtEmailValidData.ACTIVE_STATUS', '') == "1" && _.get(_this.oppBusiData, 'ygtEmailValidData.EMAIL', '') == defaultValue)
            ) {
                _this.oppBusiData.EMAIL_CHK_FLAG = "1";
                _this.$set(fieldData.EMAIL,'IS_SHOW_BUTTON', false);
                _this.$set(fieldData.EMAIL,'IS_SHOW_BUTTON_TWO', false);
                _this.$set(fieldData.EMAIL,'SUFFIX_ICON', "el-icon-success");
                return
            } 
            _this.oppBusiData.EMAIL_CHK_FLAG = "";
            fieldData.EMAIL.IS_SHOW_BUTTON = true;
            _this.$set(fieldData.EMAIL,'FIELD_BUTTON_TXT',`发送认证邮件`);
            _this.$set(fieldData.EMAIL,'IS_SHOW_BUTTON_TWO', true);
            _this.$set(fieldData.EMAIL,'SUFFIX_ICON',"el-icon-warning red");
            _this.$set(fieldData.EMAIL,'FIELD_BUTTON_TXT_TWO',`刷新认证状态`);
        }
    },
    "CHECK_IMP_EMAIL__CLICK": (_this, field, fieldData) => {
        let that = _this;
        let userInfo = that.$storage.getJsonSession(that.$definecfg.USER_INFO),
            custInfo = that.$storage.getJsonSession(that.$definecfg.CUSTOMER_INFO),
            params = {
                EMAIL:fieldData.EMAIL.DEFAULT_VALUE,
                CUST_CODE:custInfo.CUST_CODE,
                ID_TYPE: custInfo.ID_TYPE,
                ID_CODE: custInfo.ID_CODE,
                SOURCE: "0"
            };
            if(fieldData.EMAIL.DEFAULT_VALUE && fieldData.EMAIL.correct) {
                smsService.sendEmailValid(params).then( resultObj => {
                    if(resultObj && resultObj.SEND_EMAIL_FLAG == "1") {
                        _this.$set(field,'BUTTON_ENABLE',true);
                        _this.$set(fieldData.EMAIL,'SUFFIX_ICON',"el-icon-warning red");
                        let remainTime = 60 ;
                        _this.oppBusiData.interTimer = setInterval(function(){
                            if (remainTime <= 0) {
                                that.oppBusiData.isTimeout60 = false;
                                _this.$set(field,'FIELD_BUTTON_TXT',`发送认证邮件`);
                                _this.$set(field,'BUTTON_ENABLE',false);
                                clearInterval(_this.oppBusiData.interTimer);
                                return;
                            }
                            remainTime--;
                            field.FIELD_BUTTON_TXT = `重新发送(${remainTime}秒)`;
                        },1000);
                        //发送验证码以后开始倒计时 设置标识 默认true
                        that.oppBusiData.isTimeout60 = true;
                    }else{
                        that.messageBox({
                            hasMask:true,
                            messageText:"发送认证邮件失败！",
                            confirmButtonText:'确定',
                            typeMessage:'error', 
                            showMsgBox:true  
                        });
                    }
                });
            }
    },
    "CHECK_IMP_EMAIL__CLICK_TWO": (_this, field, fieldData) => {
        let that = _this;
        let custInfo = that.$storage.getJsonSession(that.$definecfg.CUSTOMER_INFO);
        if(!isOpenAcct(_this)){
            return Promise.all([
                that.$syscfg.K_Request('Y8000007', Object.assign({
                            "CUST_CODE": custInfo.CUST_CODE || ""
                        })),
                ]).then(data => {
                if(_.get(data, '[0].Data[0].ACTIVE_STATUS', '') == "1" && _.get(data, '[0].Data[0].EMAIL', '') == field.DEFAULT_VALUE) {
                    _this.oppBusiData.ygtEmailValidData = _.get(data, '[0].Data[0]', {});
                    _this.$set(field,'IS_SHOW_BUTTON', false);
                    _this.$set(field,'IS_SHOW_BUTTON_TWO', false);
                    _this.$set(field,'SUFFIX_ICON', "el-icon-success");
                    _this.oppBusiData.EMAIL_CHK_FLAG = "1";
                    clearInterval(_this.oppBusiData.interTimer);
                    return false
                    
                }else {
                    _this.oppBusiData.EMAIL_CHK_FLAG = "";
                    _this.$set(field,'IS_SHOW_BUTTON',true);
                    _this.$set(field,'IS_SHOW_BUTTON_TWO',true);
                    that.messageBox({
                        hasMask: true,
                        messageText: field.DEFAULT_VALUE+"邮箱未认证通过",
                        confirmButtonText: '确认',
                        typeMessage: 'warn',
                        showMsgBox: true,
                        confirmedAction: function () {}
                    })
                    return false
                }
            })
        }
       
    },
}
const isOpenAcct = (_this) => {
    return _this.$storage.getJsonSession(_this.$definecfg.IS_OPEN_ACCT_BIZ) == '0' ? true : false;
}
