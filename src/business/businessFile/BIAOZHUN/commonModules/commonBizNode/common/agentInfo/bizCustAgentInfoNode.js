/*
 *   代理人信息模块
 *   方法封装
 *   @author  yyp
 */

import bizPublicMethod from "../../../../../../../business/businessTools/bizPublicMethod.js";
import date from '../../../../../../../tools/date.js';
import smsService from '../../../../../../../service/sms-service';
import * as utils from "../../../../../../../tools/util";
import stringConfig from "../../../../../../../tools/stringConfig.js";
import {parseAddress} from '../../../../../../../tools/util';//地址解析组件

const  judgingAgentInfo = function(obj) {
    return  !!obj.USER_CODE? true : obj.USER_NAME || obj.ADDRESS || obj.ID_CODE || obj.ID_EXP_DATE || obj.MOBILE_TEL || obj.ID_TYPE ? false : true;
}
const fieldInit = function(_this) {
    // 验证码 start  手机验证功能 校验函数
    _this.groupDatas.CUST_AGENT_INFO.CUST_AGENT_INFO[0].FIELDS.MOBILE_TEL.FIELD_FUNCTION = 'CHECK_AGENT_MOBILE_TEL'
    _this.groupDatas.CUST_AGENT_INFO.CUST_AGENT_INFO[0].FIELDS.VALIDATE_CODE.FIELD_FUNCTION = "CHECK_AGENT_VALIDATE_CODE";
    // 验证码 end
    _this.groupDatas.CUST_AGENT_INFO.CUST_AGENT_INFO[0].FIELDS.ID_CODE.FIELD_FUNCTION = 'CHECK_AGENT_ID_CODE'
    _this.groupDatas.CUST_AGENT_INFO.CUST_AGENT_INFO[0].FIELDS.ID_TYPE.FIELD_FUNCTION = 'CHECK_AGENT_ID_TYPE'
    _this.groupDatas["CUST_AGENT_INFO"]["CUST_AGENT_INFO"]["0"]["FIELDS"]["ID_CODE"].firstValidate = true;
    // 地址
    _this.groupDatas.CUST_AGENT_INFO.CUST_AGENT_INFO[0].FIELDS.ADDRESS.FIELD_FUNCTION = 'CHECK_AGENT_ADDRESS'
    // 职业类型
    _this.groupDatas.CUST_AGENT_INFO.CUST_AGENT_INFO[0].FIELDS.AGT_OCCU_TYPE.FIELD_FUNCTION = 'CHECK_AGENT_OCCU_TYPE';
    _this.groupDatas.CUST_AGENT_INFO.CUST_AGENT_INFO[0].FIELDS.BIRTHDAY.FIELD_FUNCTION = 'CHECK_AGENT_BIRTHDAY';
    _this.groupDatas.CUST_AGENT_INFO.CUST_AGENT_INFO[0].FIELDS.CITIZENSHIP.FIELD_FUNCTION = 'CHECK_AGENT_CITIZENSHIP'; // 国籍或者地区
    // 证件有效期截止日期，早于今天之前的日期应该默认置灰，不可勾选
    _this.groupDatas.CUST_AGENT_INFO.CUST_AGENT_INFO[0].FIELDS.ID_EXP_DATE.VALID_TYPE='end';
    _this.groupDatas.CUST_AGENT_INFO.CUST_AGENT_INFO[0].FIELDS.BIRTHDAY.VALID_TYPE='begin';
}
const isAddAgent = function (_this) {
    // 验证码 end
    let loginTypeInfo =  _this.$storage.getJsonSession(_this.$definecfg.LOGIN_TYPE_INFO);
    // 是否是添加代理人
    let isAddAgent = false;
    if (loginTypeInfo && loginTypeInfo.region == "1" && loginTypeInfo.agentNum == "新增代理人"
        || !loginTypeInfo || (loginTypeInfo && loginTypeInfo.region != "1")) {
        isAddAgent = true;
    }
    return isAddAgent;
}
let agentIdType = ""
let isShowIcon = false
export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizCustAgentInfoNodeBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */ 
    bizCustAgentInfoNodeBeforeLoadBiz: function (_this) {
        fieldInit(_this)
        // 验证码 start
        let msg_valid_switch = _this.oppBusiData.oldBusiData.SYS_PARAM.APP_MSG_VALID_SWITCH && _this.oppBusiData.oldBusiData.SYS_PARAM.APP_MSG_VALID_SWITCH.value || "0",
            msg_valid_time = _this.oppBusiData.oldBusiData.SYS_PARAM.MSG_VALID_TIME && _this.oppBusiData.oldBusiData.SYS_PARAM.MSG_VALID_TIME.value || "60",
            voice_msg_valid_switch = _this.oppBusiData.oldBusiData.SYS_PARAM.APP_VOICE_MSG_VALID_SWITCH && _this.oppBusiData.oldBusiData.SYS_PARAM.APP_VOICE_MSG_VALID_SWITCH.value || "0";
        _this.oppBusiData.SEND_COUNT = 0;
        _this.oppBusiData.agentValid = {
            "msg_valid_switch": msg_valid_switch,
            "msg_valid_time": msg_valid_time,
            "voice_msg_valid_switch": voice_msg_valid_switch
        }
        isShowIcon = _this.oppBusiData.agentValid.msg_valid_switch == "0" ? false : true;
        
        // 如果是添加代理人 则不进行获取session或者流水里的agentInfo信息 否则 将其保存到oppBusiData里
        let agentInfo = !isAddAgent(_this) && (_this.$storage.getJsonSession(_this.$definecfg.AGENT_SELECT_INFO) || _this.oppBusiData.newBusiData.agentInfo)
        if(agentInfo){
            _this.oppBusiData.agentInfo = agentInfo;
            this.bizCustAgentInfoNodeLoadBizData(_this, agentInfo);
            _this.oppBusiData.oldAgentMobileTel = agentInfo.MOBILE_TEL;
            _this.groupDatas.CUST_AGENT_INFO.CUST_AGENT_INFO[0].FIELDS.MOBILE_TEL.currentAgentMobile = agentInfo.MOBILE_TEL;
        }
    },
    bizCustAgentInfoNodeBeforeLoadBizOpenAcct: function(_this) {
        fieldInit(_this)
        let sysCommonParam = _this.$storage.getJsonSession(_this.$definecfg.SYS_COMM_PARAM_OBJS);
        _this.oppBusiData.agentValid = {
            "msg_valid_switch": sysCommonParam.APP_MSG_VALID_SWITCH || "0",
            "msg_valid_time": sysCommonParam.MSG_VALID_TIME || "60",
	        "voice_msg_valid_switch": sysCommonParam.APP_VOICE_MSG_VALID_SWITCH || "0"
        }
        isShowIcon = _this.oppBusiData.agentValid.msg_valid_switch == "0" ? false : true
        _this.oppBusiData.SEND_COUNT = 0
    },
    /*
     *@method bizCustAgentInfoNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-13 09:42:56
     */
    bizCustAgentInfoNodeAfterLoadBiz: function (_this) {
        // 登录类型
        let loginTypeInfo =  _this.$storage.getJsonSession(_this.$definecfg.LOGIN_TYPE_INFO);
        //重新解析历史数据
        //获取代理人信息
        let agentInfo =  _this.oppBusiData.agentInfo // 选择现有的代理人
        let agentInfo2 = _this.oppBusiData.newBusiData.AGENT_INFO&&_this.oppBusiData.newBusiData.AGENT_INFO[0]; // 流水
        
        // 如果选择的代理人为空 且代理人类型为新增 用新增的代理人进行解析
        if((loginTypeInfo && loginTypeInfo.region=="1" && !agentInfo && agentInfo2 && agentInfo2.OP_TYPE == "0")
            || (!loginTypeInfo && agentInfo2 && agentInfo2.OP_TYPE == "0")){
            this.bizCustAgentInfoNodeLoadBizData(_this, agentInfo2);
            _this.groupDatas.CUST_AGENT_INFO.CUST_AGENT_INFO[0].FIELDS.MOBILE_TEL.currentAgentMobile = agentInfo2.MOBILE_TEL;
            _this.oppBusiData.isCheckClose = agentInfo2.TEL_CHK_FLAG || "";
        }
        if((agentInfo&&agentInfo2)&&agentInfo2.OP_TYPE =="1") {
            // 这里获得了 带*号的数据
            if (agentInfo2.MOBILE_TEL.includes("*")) {
                _this.groupDatas.CUST_AGENT_INFO.CUST_AGENT_INFO[0].FIELDS.MOBILE_TEL.currentAgentMobile = agentInfo.MOBILE_TEL;
                agentInfo2.MOBILE_TEL = agentInfo.MOBILE_TEL;
            } else {
                _this.groupDatas.CUST_AGENT_INFO.CUST_AGENT_INFO[0].FIELDS.MOBILE_TEL.currentAgentMobile = agentInfo2.MOBILE_TEL;
            }
            // 关闭验证码前 这个手机号是否进行过校验
            _this.oppBusiData.isCheckClose = agentInfo2.TEL_CHK_FLAG || "";
            this.bizCustAgentInfoNodeLoadBizData(_this, agentInfo2);
        }

        _this.$set(_this.groupDatas.CUST_AGENT_INFO.CUST_AGENT_INFO[0], "MODULE_CUSTOMIZE", "1");
        _this.$set(_this.groupDatas.CUST_AGENT_INFO.CUST_AGENT_INFO[0], "MODULE_CUSTOMIZE_TXT", "公安联网");
    },
    /*
     *@method bizCustAgentInfoNodeBeforeSave
     *@desc 钩子函数 自定义保存数
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizCustAgentInfoNodeBeforeSave: function (_this, params) {
        let tempArr = [], 
        // agentInfo = _this.oppBusiData.oldBusiData.AGENT_INFO,
        agentInfo1 = !isAddAgent(_this) && (_this.$storage.getJsonSession(_this.$definecfg.AGENT_SELECT_INFO) || _this.oppBusiData.agentInfo),
        obj1 = {}, 
        obj2 = {},
        agentInfo = [];
        bizPublicMethod.$blMethod.changeObjKeys(_this.groupDatas.CUST_AGENT_INFO.CUST_AGENT_INFO[0].FIELDS, obj1); // 将数据转换为Object
        bizPublicMethod.$blMethod.changeObjKeys(_this.groupDatas.CUST_AGENT_INFO.THIS_AGENT_INFO[0].FIELDS, obj2); // 将数据转换为Object
        // let obj = Object.assign({}, obj1, obj2);
        let obj = Object.assign({}, obj1);
        if(agentInfo1) {
            agentInfo.push(agentInfo1);
            agentInfo[0].USER_NAME = agentInfo[0].USER_FNAME;
        }
        let isChangeMobile = false;
        // 如果当前手机号码包含****则不进行对手机号码得比较
        if (!obj1.MOBILE_TEL.includes('****')) {
            isChangeMobile = true;
        }
        let diff = !!obj.USER_CODE ? bizPublicMethod.$blMethod.compareInfoZT(_.filter(agentInfo, {USER_CODE: obj.USER_CODE})[0], obj) : [];
        // 验证码 start 验证码校验字段
        // 首先查看器是否改变了号码 如果没有改变 说明其是一开的认证数据
        Object.assign(obj, {
            TEL_CHK_FLAG: _this.oppBusiData.AGENT_TEL_CHK_FLAG ? _this.oppBusiData.AGENT_TEL_CHK_FLAG : "0"
        })
        // 公安联网校验
        Object.assign(obj, {
            IDCARD_CHECK_FLAG: _this.oppBusiData.agentPoliceValidate ? _this.oppBusiData.agentPoliceValidate : "0",
        });
        // 验证码 end
        // 如果没有改变手机号码 则不对手机号码进行对比
        if (!isChangeMobile){
            diff = _.filter(diff, item => {
                return item.FIELD != "MOBILE_TEL";
            })
            if (agentInfo1 && agentInfo1.TEL_CHK_FLAG == "" && obj.TEL_CHK_FLAG == "1") {
                diff.push({
                    FIELD: "TEL_CHK_FLAG",
                    OLD: "0",
                    NEW: "1"
                })
            }
        } else {
            if (agentInfo1 && obj.TEL_CHK_FLAG == "1" && agentInfo1.TEL_CHK_FLAG == "") {
                diff.push({
                    FIELD: "TEL_CHK_FLAG",
                    OLD: "",
                    NEW: "1"
                })
            }
        }
        let saveTempObj = {};
        _.extend(saveTempObj, {
            DIFF_INFO: diff,
            OP_TYPE: diff.length ? "1" : judgingAgentInfo(obj) ? "3" : "0", //1:修改 3:不变 0::新增
        }, obj);
        tempArr.push(saveTempObj);
        params.AGENT_INFO = tempArr;
        let loginTypeInfo =  _this.$storage.getJsonSession(_this.$definecfg.LOGIN_TYPE_INFO);
        // 保存一下登录方式，用于判断 从代理人切换到法人 时 申请人节点不应该 ✔
        params.LOGIN_TYPE_INFO = loginTypeInfo;
        if (_this.oppBusiData.agentInfo) {
            params.agentInfo = _this.oppBusiData.agentInfo;
        }
    },
    // 上一步
    bizCustAgentInfoNodePreValidate: function(_this) {
        // _this.$router.goRoute("客户联系信息");
    },

  
    /*
     *@method bizCustAgentInfoNodeValidate
     *@desc 钩子函数 下一步验证 
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizCustAgentInfoNodeValidate: function (_this) {
        let AGENT_INFO = _this.groupDatas["CUST_AGENT_INFO"]["CUST_AGENT_INFO"]["0"]["FIELDS"];
        return new Promise((resolve, reject) => {
            if (AGENT_INFO.ID_EXP_DATE.DEFAULT_VALUE && date.compareDate(AGENT_INFO.ID_EXP_DATE.DEFAULT_VALUE, date.getClientDate("yyyyMMdd")) == -1) {
                _this.pushFlowTip({
                    title:"客户的证件已经过期，请变更！",
                    key:'warningTip',
                    type:'warning'
                })
                reject(false);
            }else{
                _this.groupDatas.CUST_AGENT_INFO.THIS_AGENT_INFO[0].FIELDS.AGENT_NAME.DEFAULT_VALUE = AGENT_INFO.USER_NAME.DEFAULT_VALUE;
                resolve(true);
            }
        })
    },

    /*
     *@method bizCustAgentInfoNodeGetData
     *@desc 拼接数据
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizCustAgentInfoNodeGetData: function (_this, params) {
    
    },

    /*
     *@method bizCustAgentInfoNodePageActivated
     *@desc 钩子函数：页面激活
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizCustAgentInfoNodePageActivated: function (_this) {
        fieldInit(_this)
        let loginTypeInfo =  _this.$storage.getJsonSession(_this.$definecfg.LOGIN_TYPE_INFO);
        let agentNum = loginTypeInfo?loginTypeInfo.agentNum:"";
        if(agentNum == "" || agentNum == undefined){
            agentNum = "";
        }
        //过滤证件类型
        let dictItem = _.map(_this.groupDatas.CUST_AGENT_INFO.CUST_AGENT_INFO[0].FIELDS.ID_TYPE.FIELD_DICT_NAME, 'DICT_ITEM')
        _this.groupDatas.CUST_AGENT_INFO.CUST_AGENT_INFO[0].FIELDS.ID_TYPE.FIELD_DICT_FILTER = _.filter(dictItem, function(item) {
            return item.charAt(0) == '0'
        })
        if(loginTypeInfo && loginTypeInfo.region == "1"){
            //代理人
            if(loginTypeInfo.agentNum == "新增代理人"){
                agentNum = "";
                if(_this.moduleId.includes("CUST_AGENT_INFO")){
                    _this.pushFlowTip({
                        title:"★新增代理人信息需和实际办理业务的代理人一致",
                        key:'US1',
                        // type:'warning'
                        type:'warning'
                    })
                    if (_this.userType == '0') {
                        _this.pushFlowTip({
                            title:"★此处仅能新增公证授权代理人，非公证授权代理人需使用非组合业务添加非公证授权代理人（自然人）菜单进行操作",
                            key:'US2',
                            // type:'warning'
                            type:'warning'
                        })
                    }
                    _this.pushFlowTip({
                        title:"★如果修改为其他代理人，该笔业务所有影像均需要重新采集",
                        key:'US3',
                        // type:'warning'
                        type:'warning'
                    })
                }

            }else{
                if(_this.moduleId.includes("CUST_AGENT_INFO")){
                    _this.pushFlowTip({
                        title:"★客户识别时选择的代理人需和实际办理业务的代理人一致",
                        key:'US1',
                        // type:'warning'
                        type:'warning'
                    })
                    _this.pushFlowTip({
                        title:"★如果修改为其他代理人，该笔业务所有影像均需要重新采集",
                        key:'US2',
                        // type:'warning'
                        type:'warning'
                    })
                }
            }
        }
        //对会清空别的字段的值上一次值进行赋值，避免删除自动赋值
        _this.groupDatas.CUST_AGENT_INFO.CUST_AGENT_INFO[0].FIELDS.ADDRESS.FIELD_LAST_VALUE = _this.groupDatas.CUST_AGENT_INFO.CUST_AGENT_INFO[0].FIELDS.ADDRESS.DEFAULT_VALUE;
    },

    
    bizCustAgentInfoNodeGetCustInfo: function (_this) {},

    /**
     * bizCustAgentInfoNodeLoadBizData 数据解析或回填
     * @param _this
     */
    bizCustAgentInfoNodeLoadBizData: async function (_this, busiData) {
        if (!busiData || _.isEmpty(busiData)) {
            return;
        }
        let cloneBusiData = _.cloneDeep(busiData);
        bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["CUST_AGENT_INFO"], cloneBusiData);
        // 如果业务数据
        _this.groupDatas.CUST_AGENT_INFO.CUST_AGENT_INFO[0].FIELDS.USER_NAME.DEFAULT_VALUE = busiData.USER_NAME || busiData.USER_FNAME;
        _this.groupDatas.CUST_AGENT_INFO.CUST_AGENT_INFO[0].FIELDS.ADDRESS.DEFAULT_VALUE = busiData.ADDRESS;
        _this.groupDatas.CUST_AGENT_INFO.CUST_AGENT_INFO[0].FIELDS.ID_CODE.promptValue = busiData.ID_CODE;
    }, 

    "CHECK_LINKMAN_ADDR":(_this, field, fieldData) => {
        console.log("field.D==",field.DEFAULT_VALUE);
    },
    "CHECK_AGENT_ID_TYPE" : (_this,field,fieldData) =>{
        if (agentIdType && agentIdType != field.DEFAULT_VALUE) {
            fieldData.ID_CODE.DEFAULT_VALUE = '';
            fieldData.ID_CODE.promptValue = '';
            fieldData.SEX.DEFAULT_VALUE = '';
            fieldData.SEX.FIELD_CONTROL = '0';
            fieldData.BIRTHDAY.DEFAULT_VALUE = '';
            fieldData.BIRTHDAY.FIELD_CONTROL = '0';
        }
        agentIdType = field.DEFAULT_VALUE; 
        if (_.indexOf(["0b", "0c"], field.DEFAULT_VALUE) !== -1) {
            fieldData.ID_CODE.VALID_TYPE = 'fixedNumLength[9]|on-prompt|on-blur';
            _this.$set(fieldData.ID_CODE, "MAX_LENGTH", 9);
            fieldData.ID_CODE.MAX_LENGTH = 9;
        } else if(field.DEFAULT_VALUE == '0d') {
            fieldData.ID_CODE.VALID_TYPE = 'fixedNumLength[8]|on-prompt|on-blur';
            _this.$set(fieldData.ID_CODE, "MAX_LENGTH", 8);
            fieldData.ID_CODE.MAX_LENGTH = 8;
        } else if (field.DEFAULT_VALUE == '00' || field.DEFAULT_VALUE == '08') {
            fieldData.ID_CODE.VALID_TYPE = 'iscard|on-prompt|on-blur';
            _this.$set(fieldData.ID_CODE, "MAX_LENGTH", 32);
            fieldData.ID_CODE.MAX_LENGTH = 18;
        } else {
            fieldData.ID_CODE.VALID_TYPE = 'charMinus[0,32]|on-prompt|on-blur';
            _this.$set(fieldData.ID_CODE, "MAX_LENGTH", 32);
        }
    },
    "CHECK_AGENT_ID_CODE" : (_this,field,fieldData) =>{
        field.DEFAULT_VALUE = _.trim(field.DEFAULT_VALUE);
        if (field.DEFAULT_VALUE == "") return false;
        
        let value = field.DEFAULT_VALUE,
            SEX = "SEX",
            BIRTHDAY = "BIRTHDAY";
        if (_this.moduleId.indexOf("CUST_AGENT_INFO") != -1) {
            let idtype = _this.groupDatas.CUST_AGENT_INFO.CUST_AGENT_INFO[0].FIELDS.ID_TYPE.DEFAULT_VALUE;
            // if (idtype == "00") {
            //     if(utils.IDCardCheck(value) == false){
            //         _this.pushFlowTip({
            //             title:"输入的身份证号长度或号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。",
            //             key:'warningTip',
            //             type:'warning'
            //         })
            //         return;
            //     }
            // }
            if (idtype == "") {
                _this.pushFlowTip({
                    title:"请选择证件类型！",
                    key:'warningTip',
                    type:'warning'
                })
                return false;
            }
          
            if (SEX in fieldData) { // 关联性别
                let f = fieldData[SEX];
              
                if ((idtype == "00") && value) {
                    let sex = utils.getSex(value);
                    if (sex == "M") {
                        f.DEFAULT_VALUE = "0"; // 0-男性
                        f.FIELD_CONTROL = "2";
                    } else if (sex == "F") {
                        f.DEFAULT_VALUE = "1"; // 1-女性
                        f.FIELD_CONTROL = "2";
                    } else {
                        f.FIELD_CONTROL = "0";
                        f.DEFAULT_VALUE = "";
                    }
                } else {
                    // f.DEFAULT_VALUE = "";
                    f.FIELD_CONTROL = "0";
                }
            }
            if (BIRTHDAY in fieldData) { // 关联出生日期
                let f = fieldData[BIRTHDAY];
                if ((idtype == "00") && value) {
                    f.DEFAULT_VALUE = utils.getBirthday(value);
                    f.FIELD_CONTROL = '2';
                } else {
                    f.FIELD_CONTROL = '0';
                }
            }

        };
    },
    // 验证码 start
    "CHECK_AGENT_MOBILE_TEL": (_this, field,fieldData) => {
        _this.$nextTick( () => {
            let agentValid = _this.oppBusiData.agentValid;
            let agentInfo = _this.oppBusiData.agentInfo;
            // 取前11位
            if(field.DEFAULT_VALUE.length > 11) {
                field.DEFAULT_VALUE = field.DEFAULT_VALUE.substr(0,11);
            }
            //有打码 不需要改变颜色
            if (field.DEFAULT_VALUE.includes('****')) {
                field.showchange = false;
            }
            // 获取最初的 即从一柜通获取的号码
            let oldMobile = _.get(_this.oppBusiData, 'agentInfo.MOBILE_TEL', '');
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
            // 包含  * 删除一个字符 删除所有
            if(field.DEFAULT_VALUE.includes('*')&&field.DEFAULT_VALUE.length==10) {
                fieldData["MOBILE_TEL"]["VALID_TYPE"] = "mobile|on-focus";
                field.OLD_DEFAULT_VALUE = oldMobile;
                field.DEFAULT_VALUE = '';
            }
            //获取焦点清空操作
            if (field.DEFAULT_VALUE.includes('****') && currentValid == 'focus') {
                fieldData["MOBILE_TEL"]["VALID_TYPE"] = "mobile|on-focus";
                field.OLD_DEFAULT_VALUE = oldMobile;
                field.DEFAULT_VALUE = '';
                return;
            }
            if (field.DEFAULT_VALUE == oldMobile && field.currentAgentMobile == oldMobile) {
                fieldData["MOBILE_TEL"]["VALID_TYPE"] = "on-focus";
                field.showchange = false;
                field.DEFAULT_VALUE = oldMobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
            }
            if (field.DEFAULT_VALUE == oldMobile && agentValid && agentValid.msg_valid_switch == "0") {
                fieldData["MOBILE_TEL"]["VALID_TYPE"] = "on-focus";
                field.showchange = false;
                field.DEFAULT_VALUE = oldMobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
            }
            let defaultValue = field.DEFAULT_VALUE.includes('****') ? oldMobile : field.DEFAULT_VALUE;
            if (agentValid && agentValid.msg_valid_switch == "0") {
                if (defaultValue == oldMobile && field.currentAgentMobile == defaultValue && agentInfo && agentInfo.TEL_CHK_FLAG == "1"
                    || defaultValue == field.currentAgentMobile && _this.oppBusiData.isCheckClose == "1") {
                    _this.oppBusiData.AGENT_TEL_CHK_FLAG = "1";
                } else {
                    _this.oppBusiData.AGENT_TEL_CHK_FLAG = "0";
                }
            }
            // 开启开关
            if (agentValid && (agentValid.msg_valid_switch == "1" || agentValid.msg_valid_switch == "2")) {
                if ((defaultValue == oldMobile && field.currentAgentMobile == defaultValue && agentInfo && agentInfo.TEL_CHK_FLAG == "1")
                    || (field.currentAgentMobile == defaultValue && _this.oppBusiData.isCheckClose == "1")) {
                    _this.oppBusiData.AGENT_TEL_CHK_FLAG = "1";
                    _this.$set(fieldData.VALIDATE_CODE,'FIELD_CONTROL', "1");
                    _this.$set(fieldData.MOBILE_TEL,'IS_SHOW_BUTTON', false);
                    _this.$set(fieldData.MOBILE_TEL,'IS_SHOW_BUTTON_TWO', false);
                    _this.$set(field,'SUFFIX_ICON', "el-icon-success");
                    return;
                }
                _this.oppBusiData.AGENT_TEL_CHK_FLAG = "0";
                // 验证码 正常展示
                _this.$set(fieldData.VALIDATE_CODE, 'FIELD_CONTROL', "0");
                _this.$set(fieldData.VALIDATE_CODE, 'IS_SHOW_BUTTON', true);
                _this.$set(fieldData.VALIDATE_CODE, 'FIELD_BUTTON_TXT', `确认验证码`);
                // 重要手机字段
                _this.$set(fieldData.MOBILE_TEL,'IS_SHOW_BUTTON', true);
                _this.$set(fieldData.MOBILE_TEL,'FIELD_BUTTON_TXT',`发送验证码`);
                _this.$set(field,'SUFFIX_ICON',"el-icon-warning red");
            }
        })
    },
    "CHECK_AGENT_MOBILE_TEL__CLICK": (_this, field, fieldData) => {
        let that = _this;
        //手机号码不正确时，不能发送验证码
        if(!field.correct){
            return false;
        }
        let userInfo = that.$storage.getJsonSession(that.$definecfg.USER_INFO),
            custInfo = that.$storage.getJsonSession(that.$definecfg.CUSTOMER_INFO),
            params = {
                ORG_CODE:userInfo.ORG_CODE,
                MOBILE_TEL:fieldData.MOBILE_TEL.DEFAULT_VALUE.includes('*') ? _this.oppBusiData.oldAgentMobileTel : fieldData.MOBILE_TEL.DEFAULT_VALUE,
                CUST_CODE:custInfo.CUST_CODE,
                ID_TYPE:custInfo.ID_TYPE,
                ID_CODE:custInfo.ID_CODE
            };
        if(fieldData.MOBILE_TEL.DEFAULT_VALUE && fieldData.MOBILE_TEL.correct){
            that.myLoading('短信验证码发送中...');
            smsService.getSmsValidCode(params).then(function(resultObj){
                if(resultObj && resultObj.SEND_FLAG == "1"){
                    //vue深层次响应理
                    that.myLoading({sloadingText:'发送中...',showLoading:false});
                    field.FIELD_CONTROL = "2";
                    _this.$set(field,'BUTTON_ENABLE',true)
                    _this.oppBusiData.SEND_COUNT++;
                    let remainTime = _this.oppBusiData.agentValid.msg_valid_time;
                    _this.oppBusiData.interTimer = setInterval(function(){
                        remainTime--;
                        field.FIELD_BUTTON_TXT = `重新发送(${remainTime}秒)`;
                    },1000);
                    //发送验证码以后开始倒计时 设置标识 默认true
                    setTimeout(() => {
                        field.FIELD_CONTROL = "0";
                        _this.$set(field,'BUTTON_ENABLE',false)
                        _this.$set(field,'FIELD_BUTTON_TXT',`发送验证码`);
                        if ((_this.oppBusiData.agentValid.voice_msg_valid_switch == "1" || _this.oppBusiData.agentValid.voice_msg_valid_switch == "2") && _this.oppBusiData.SEND_COUNT >= 2) {
                            field.IS_SHOW_BUTTON_TWO = true;
                            _this.$set(field, 'FIELD_BUTTON_TXT_TWO', `语音验证码`)
                        }
                        clearInterval(_this.oppBusiData.interTimer);
                    },remainTime*1000);
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
    "CHECK_AGENT_MOBILE_TEL__CLICK_TWO": (_this, field, fieldData) => {
        let that = _this;
        //手机号码不正确时，不能发送验证码
        if(!field.correct){
            return false;
        }
        let userInfo = that.$storage.getJsonSession(that.$definecfg.USER_INFO),
            custInfo = that.$storage.getJsonSession(that.$definecfg.CUSTOMER_INFO),
            params = {
                ORG_CODE:userInfo.ORG_CODE,
                MOBILE_TEL:fieldData.MOBILE_TEL.DEFAULT_VALUE.includes('*') ? _this.oppBusiData.oldAgentMobileTel : fieldData.MOBILE_TEL.DEFAULT_VALUE,
                CUST_CODE:custInfo.CUST_CODE,
                ID_TYPE:custInfo.ID_TYPE,
                ID_CODE:custInfo.ID_CODE
            };
        if(fieldData.MOBILE_TEL.DEFAULT_VALUE && fieldData.MOBILE_TEL.correct){
            that.myLoading('正在发送验证码...');
        }
        // 这个应该是发送语音验证码的方法
        smsService.getVoiceValidCode(params).then(function(resultObj){
            if(resultObj && resultObj.SEND_FLAG == "1"){
                //vue深层次响应理
                that.myLoading({sloadingText:'发送中...',showLoading:false});
                that.messageBox({
                    hasMask:true,
                    messageText:"验证码已发送到：【" + params.MOBILE_TEL + "】，请注意查收！",
                    confirmButtonText:'确定',
                    typeMessage:'', 
                    showMsgBox:true  
                });
                field.FIELD_CONTROL = "2";
                // 禁用第二个button
                _this.$set(field,'BUTTON_ENABLE_TWO',true)
                _this.oppBusiData.SEND_COUNT++;
                let remainTime = _this.oppBusiData.agentValid.msg_valid_time;
                //let remainTime = 10;
                _this.oppBusiData.interTimerTwo = setInterval(function(){
                    remainTime--;
                    field.FIELD_BUTTON_TXT_TWO = `重新发送(${remainTime}秒)`;
                },1000);
                //发送验证码以后开始倒计时 设置标识 默认true
                setTimeout(() => {
                    field.FIELD_CONTROL = "0";
                    // 启用第二个button
                    _this.$set(field,'BUTTON_ENABLE_TWO',false)
                    if ((_this.oppBusiData.agentValid.voice_msg_valid_switch == "1" || _this.oppBusiData.agentValid.voice_msg_valid_switch == "2") && _this.oppBusiData.SEND_COUNT >= 2) {
                        field.IS_SHOW_BUTTON_TWO = true;
                        _this.$set(field, 'FIELD_BUTTON_TXT_TWO', `语音验证码`)
                    }
                    clearInterval(_this.oppBusiData.interTimerTwo);
                },remainTime*1000);
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
    "CHECK_AGENT_VALIDATE_CODE__CLICK": (_this, field,fieldData) => {
        let that = _this;
        if(field.FIELD_CONTROL == "1" || fieldData.MOBILE_TEL.DEFAULT_VALUE == ""){return ;}
        let validateCode = field.DEFAULT_VALUE;
        if(validateCode.length != 6){return ;}
        if(field.DEFAULT_VALUE){
            let userInfo = that.$storage.getJsonSession(that.$definecfg.USER_INFO),
            custInfo = that.$storage.getJsonSession(that.$definecfg.CUSTOMER_INFO),
            params = {
                ORG_CODE:userInfo.ORG_CODE,
                MOBILE:fieldData.MOBILE_TEL.DEFAULT_VALUE.includes('*') ? _this.oppBusiData.oldAgentMobileTel : fieldData.MOBILE_TEL.DEFAULT_VALUE,
                AUTH_CODE:validateCode,
                CUST_CODE:custInfo.CUST_CODE,
                ID_TYPE:custInfo.ID_TYPE,
                ID_CODE:custInfo.ID_CODE
            };
            that.myLoading('校验中...');
            smsService.checkUpValidCode(params).then(function(resultObj){
                if(resultObj.VALID_FLAG == "1"){
                    that.myLoading({sloadingText:'校验中...',showLoading:false});
                    that.messageBox({
                        hasMask:true,
                        messageText:"校验成功！",
                        confirmButtonText:'确定',
                        typeMessage:'', 
                        showMsgBox:true  
                    });
                    fieldData.MOBILE_TEL.currentAgentMobile = fieldData.MOBILE_TEL.DEFAULT_VALUE.includes('*') ? _this.oppBusiData.oldAgentMobileTel : fieldData.MOBILE_TEL.DEFAULT_VALUE;
                    field.FIELD_CONTROL = 1;
                    that.oppBusiData.AGENT_TEL_CHK_FLAG = "1";
                    _this.oppBusiData.isCheckClose = "1";
                    fieldData.MOBILE_TEL.IS_SHOW_BUTTON = false;
                    fieldData.MOBILE_TEL.FIELD_CONTROL = "0";
                    that.$set(field,'FIELD_BUTTON_TXT',`校验通过`);
                    isShowIcon && _this.$set(fieldData.MOBILE_TEL, "SUFFIX_ICON", "el-icon-success")
                    field.DEFAULT_VALUE = "";

                    that.$set(fieldData.MOBILE_TEL,'BUTTON_ENABLE',false)
                    that.$set(fieldData.MOBILE_TEL,'FIELD_BUTTON_TXT',`发送验证码`);
                    clearInterval(that.oppBusiData.interTimer);
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
                }
            })
        }
       
    },
    "CHECK_USER_NAME" : (_this,field,fieldData) =>{
        if(_this.groupId.indexOf("AGENT_INFO") != -1){
            _this.groupDatas.CUST_AGENT_INFO.THIS_AGENT_INFO[0].FIELDS.AGENT_NAME.DEFAULT_VALUE = field.DEFAULT_VALUE;
        }
    },
    // 职业类型 
    "CHECK_AGENT_OCCU_TYPE": (_this,field,fieldData) => {

    },
    "CHECK_AGENT_CITIZENSHIP": (_this,field,fieldData) => {
        if(!field.DEFAULT_VALUE.length) {
            field.DEFAULT_VALUE = "CHN";
        }
    },
    // 地址和邮编联动
    "CHECK_AGENT_ADDRESS": (_this,field,fieldData) => {
        if(field.FIELD_CONTROL == "1") {
            return;
        }
        //获取地址的邮编
        let lastV = parseAddress(field.FIELD_LAST_VALUE);
        let deftV = parseAddress(field.DEFAULT_VALUE);
        if(_.get(lastV,[3],"") ==_.get(deftV,[3],"") && field.DEFAULT_VALUE != "") return;
        if (field.DEFAULT_VALUE && fieldData.ZIP_CODE && "addressInfo" in field) {
            if(field.addressInfo.length > 3 ){
                fieldData.ZIP_CODE.DEFAULT_VALUE = field.addressInfo[3];
                fieldData.ZIP_CODE.correct = true;
            }
            field.FIELD_LAST_VALUE = field.DEFAULT_VALUE;
            fieldData.ZIP_CODE.FIELD_CONTROL = "0";
        }
        // let addressTextInfo = parseAddress(field.DEFAULT_VALUE);
        // field.addressInfo = addressTextInfo;
        // if (fieldData.ZIP_CODE && "addressInfo" in field) {
        //     if(field.addressInfo.length > 3 &&stringConfig.isNotEmptyStr(field.addressInfo[3])){
        //         fieldData.ZIP_CODE.DEFAULT_VALUE = field.addressInfo[3];
        //         fieldData.ZIP_CODE.FIELD_CONTROL = "0";
        //         fieldData.ZIP_CODE.correct = true;
        //     }else{
        //         fieldData.ZIP_CODE.FIELD_CONTROL = "0";
        //     }
        // }
    },
    // 验证码end 

    CHECK_AGENT_BIRTHDAY: (_this, field, fieldData) => {
        let AGE = date.getDifferYears(field.DEFAULT_VALUE, date.getClientDate());
        let sex = fieldData.SEX.DEFAULT_VALUE;
        if( AGE < 20 && ( sex == "0" || sex == "1")){
            fieldData.AGT_OCCU_TYPE.FIELD_DICT_FILTER = "'!99,0A,02,11'"
            if (fieldData.AGT_OCCU_TYPE.DEFAULT_VALUE == '02' || fieldData.AGT_OCCU_TYPE.DEFAULT_VALUE == '11') {
                fieldData.AGT_OCCU_TYPE.DEFAULT_VALUE = ''
            }
        }else if( 20 <= AGE && AGE <= 40 && (sex == "0" || sex == "1")){
            fieldData.AGT_OCCU_TYPE.FIELD_DICT_FILTER = "'!99,0A,11'"
            if (fieldData.AGT_OCCU_TYPE.DEFAULT_VALUE == '11') {
                fieldData.AGT_OCCU_TYPE.DEFAULT_VALUE = ''
            }
        } else {
            fieldData.AGT_OCCU_TYPE.FIELD_DICT_FILTER = "'!99,0A'";
        }
    },
    
}
