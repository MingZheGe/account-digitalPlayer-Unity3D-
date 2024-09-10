/*
 *   关联人信息
 *   方法封装
 *   @author  yangyp
 */

import sysConfig from "../../../../../../../config/sysConfig";
import date from '../../../../../../../tools/date.js'
import * as utils from "../../../../../../../tools/util"
import smsService from '../../../../../../../service/sms-service'
import * as bizPubTools from "./../../bizPublicTools"
import stringConfig from "../../../../../../../tools/stringConfig.js"
import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../../business/businessTools/bizPublicMethod.js"

const getConnectedInfo = function (_this,fieldData) {
    _this.$refs.flowTip.flowTips = [];
    if(stringConfig.isNotEmptyStr(fieldData.ID_TYPE.DEFAULT_VALUE)
    && stringConfig.isNotEmptyStr(fieldData.ID_CODE.DEFAULT_VALUE)){
        console.log("getConnectedInfogetConnectedInfo if");
        _this.loading = true;
        _this.loadingText = "正在加载关联账户信息...";
        return sysConfig.$syscfg.K_Request("W0000119", {
            "bex_codes": "YGT_A2100124",
            "ID_TYPE": fieldData.ID_TYPE.DEFAULT_VALUE,
            "ID_CODE": fieldData.ID_CODE.DEFAULT_VALUE
        }).then(data => {
            if (data.Code == "0") {
                if (data.Data.length) {
                    let szTrdAcctArr = _.chain(data.Data).filter(o => {
                        return o.STKBD == "00";
                    }).each(i => {
                        i.DICT_ITEM = i.TRDACCT,
                            i.DICT_ITEM_NAME = i.TRDACCT
                    }).value(),
                        shTrdAcctArr = _.chain(data.Data).filter(o => {
                            return o.STKBD == "10";
                        }).each(i => {
                            i.DICT_ITEM = i.TRDACCT,
                                i.DICT_ITEM_NAME = i.TRDACCT
                        }).value();
                    fieldData.SZ_TRDACCT.FIELD_DICT_NAME = szTrdAcctArr;
                    fieldData.SZ_TRDACCT.hideDictItem = true;
                    if(szTrdAcctArr.length){
                        if(stringConfig.isNotEmptyStr(fieldData.SZ_TRDACCT.DEFAULT_VALUE)){
                            fieldData.SZ_TRDACCT.FIELD_CONTROL = "2";
                        }else{
                            fieldData.SZ_TRDACCT.FIELD_CONTROL = "0";
                        }
                       
                        fieldData.SZ_TRDACCT.FIELD_REQUIRED = "1";
                    }
                    else{
                        fieldData.SZ_TRDACCT.FIELD_CONTROL = "2";
                        fieldData.SZ_TRDACCT.FIELD_REQUIRED = "0";
                    }
                    fieldData.SH_TRDACCT.FIELD_DICT_NAME = shTrdAcctArr;
                    fieldData.SH_TRDACCT.hideDictItem = true;
                    if(shTrdAcctArr.length){
                        if(stringConfig.isNotEmptyStr(fieldData.SH_TRDACCT.DEFAULT_VALUE)){
                            fieldData.SH_TRDACCT.FIELD_CONTROL = "2";
                        }else{
                            fieldData.SH_TRDACCT.FIELD_CONTROL = "0";
                        }
                        fieldData.SH_TRDACCT.FIELD_REQUIRED = "1";
                    }else{
                        fieldData.SH_TRDACCT.FIELD_CONTROL = "2";
                        fieldData.SH_TRDACCT.FIELD_REQUIRED = "0";
                    }
                    // 不变的或者修改的 都是置灰的
                    if(fieldData.OP_TYPE.DEFAULT_VALUE == "" || fieldData.OP_TYPE.DEFAULT_VALUE == "1") {
                        fieldData.SH_TRDACCT.FIELD_CONTROL = "2";
                        fieldData.SZ_TRDACCT.FIELD_CONTROL = "2";

                        fieldData.SH_TRDACCT.FIELD_REQUIRED = "0";
                        fieldData.SZ_TRDACCT.FIELD_REQUIRED = "0";
                    }
                    // 添加的
                    if(fieldData.OP_TYPE.DEFAULT_VALUE == "0") {
                        fieldData.SH_TRDACCT.FIELD_CONTROL = "0";
                        fieldData.SZ_TRDACCT.FIELD_CONTROL = "0";
                    }
                    _this.groupDatas["OTHER_INFO"]["CONNECTED_ACCT_INFO"].forEach(moduleItem => {
                        if(moduleItem.FIELDS.SZ_TRDACCT.DEFAULT_VALUE) {
                            moduleItem.FIELDS.SH_TRDACCT.FIELD_REQUIRED = "0"
                        }
                        if(moduleItem.FIELDS.SH_TRDACCT.DEFAULT_VALUE) {
                            moduleItem.FIELDS.SZ_TRDACCT.FIELD_REQUIRED = "0"
                        }
                    })
                    return sysConfig.$syscfg.K_Request("W0000119", {
                        "bex_codes": "L1160001",
                        "USER_CODE": data.Data[0].CUST_CODE
                    }).then(info => {
                        if (info.Code == "0") {
                            fieldData.RELA_NAME.DEFAULT_VALUE = info.Data[0].USER_NAME || "";
                            fieldData.INT_ORG.DEFAULT_VALUE = info.Data[0].INT_ORG || "";
                            return true;
                        }
                        return false;
                    })
                } else {
                    _this.pushFlowTip({
                        title:"未查询到关联人信息,请重新修改或点击删除/还原!",
                        key:'warningTip',
                        type:'warning'
                    })
                    fieldData.SZ_TRDACCT.FIELD_DICT_NAME = [];
                    fieldData.SH_TRDACCT.FIELD_DICT_NAME = [];

                    fieldData.SZ_TRDACCT.DEFAULT_VALUE = "";
                    fieldData.SZ_TRDACCT.FIELD_CONTROL = "0";
                    fieldData.SZ_TRDACCT.FIELD_REQUIRED = "1";

                    fieldData.SH_TRDACCT.DEFAULT_VALUE = "";
                    fieldData.SH_TRDACCT.FIELD_CONTROL = "0";
                    fieldData.SH_TRDACCT.FIELD_REQUIRED = "1";

                    
                    fieldData.RELA_NAME.FIELD_CONTROL = "2";
                    fieldData.RELA_NAME.FIELD_REQUIRED = "0";
                    fieldData.RELA_NAME.DEFAULT_VALUE = "";

                    fieldData.INT_ORG.FIELD_CONTROL = "2";
                    fieldData.INT_ORG.FIELD_REQUIRED = "0";
                    fieldData.INT_ORG.DEFAULT_VALUE = "";
                    return false;
                }
            }
        }).finally(function () {
            _this.loading = false;
        })
    }else{
        console.log("getConnectedInfogetConnectedInfo else");
        if(stringConfig.isEmptyStr(_this.groupDatas.OTHER_INFO.CONNECTED_ACCT_INFO[0].FIELDS.RELAKIND_COMM.DEFAULT_VALUE)){

        }
    }
}

export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizConnectedAcctInfoNodeBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizConnectedAcctInfoNodeBeforeLoadBiz: function (_this) {
        _this.groupDatas.OTHER_INFO.CONNECTED_ACCT_INFO.forEach(function(moduleItem){
            moduleItem["FIELDS"]["ID_CODE"].VALID_TYPE = "length[1,48]|on-prompt|on-blur"
            // moduleItem.FIELDS.REMARK.VALID_TYPE = "length[1,64]|on-prompt|on-change"
            moduleItem.FIELDS.REMARK.VALID_TYPE = "length[1,64]|on-change";
        })
        if (_this.oppBusiData.oldBusiData.CONNECTED_ACCT_INFO &&
            _this.oppBusiData.oldBusiData.CONNECTED_ACCT_INFO.length) {
                if(_this.oppBusiData.oldBusiData.CONNECTED_ACCT_INFO.length==1 && _this.oppBusiData.oldBusiData.CONNECTED_ACCT_INFO[0].RELAKIND_COMM=="") {
                    _this.oppBusiData.oldBusiData.CONNECTED_ACCT_INFO = []
                }
            bizPublicMethod.$blMethod.parseOldBiz(_this,_this.groupDatas, { "OTHER_INFO": { "CONNECTED_ACCT_INFO": _this.oppBusiData.oldBusiData.CONNECTED_ACCT_INFO } });
        }
        //强制模块显示删除按钮
        _this.groupDatas.OTHER_INFO.CONNECTED_ACCT_INFO[0].showDelete = true;

        _this.groupDatasTpl.OTHER_INFO.CONNECTED_ACCT_INFO[0].MAX_LENGTH = "1000";
        _this.groupDatas.OTHER_INFO.CONNECTED_ACCT_INFO[0].MAX_LENGTH = "1000";
    },
    /*
     *@method bizConnectedAcctInfoNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-13 09:42:56
     */
    bizConnectedAcctInfoNodeAfterLoadBiz: function (_this) {
        // 设置证件号码为失去焦点校验
        _this.groupDatas["OTHER_INFO"]["CONNECTED_ACCT_INFO"][0]["FIELDS"]["ID_CODE"]["VALID_TYPE"] = "length[1,48]|on-prompt|on-blur";
        _this.groupDatasTpl.OTHER_INFO = _.cloneDeep(_this.groupDatas.OTHER_INFO);
        if (_this.oppBusiData.newBusiData &&
            _this.oppBusiData.newBusiData.OTHER_INFO &&
            _this.oppBusiData.newBusiData.OTHER_INFO.CONNECTED_ACCT_INFO &&
            _this.oppBusiData.newBusiData.OTHER_INFO.CONNECTED_ACCT_INFO.length) {
            let newData = _.filter(_this.oppBusiData.newBusiData.OTHER_INFO.CONNECTED_ACCT_INFO, function (v) {
                return  v.OP_TYPE != 2;
            });
            bizPublicMethod.$blMethod.parseOldBiz(_this,_this.groupDatas, {"OTHER_INFO" :{"CONNECTED_ACCT_INFO" : newData}}); 
            if(!newData.length) {
                let noData = [{
                    ID_CODE: "",
                    ID_TYPE: "",
                    INT_ORG: "",
                    OP_TYPE: "",
                    RELAKIND_COMM: "",
                    RELA_NAME: "",
                    REMARK: "",
                    SH_TRDACCT: "",
                    SZ_TRDACCT: "",
                }]
                bizPublicMethod.$blMethod.parseOldBiz(_this,_this.groupDatas, {"OTHER_INFO" :{"CONNECTED_ACCT_INFO" : noData}});
            }
            if(_this.groupDatas.OTHER_INFO.CONNECTED_ACCT_INFO.length == 1){
                if(stringConfig.isEmptyStr(_this.groupDatas.OTHER_INFO.CONNECTED_ACCT_INFO[0].FIELDS.RELAKIND_COMM.DEFAULT_VALUE)
                && stringConfig.isEmptyStr(_this.groupDatas.OTHER_INFO.CONNECTED_ACCT_INFO[0].FIELDS.ID_TYPE.DEFAULT_VALUE)
                && stringConfig.isEmptyStr(_this.groupDatas.OTHER_INFO.CONNECTED_ACCT_INFO[0].FIELDS.ID_CODE.DEFAULT_VALUE)){
                    _this.groupDatas.OTHER_INFO.CONNECTED_ACCT_INFO[0].FIELDS.SZ_TRDACCT.FIELD_CONTROL = "2";
                    _this.groupDatas.OTHER_INFO.CONNECTED_ACCT_INFO[0].FIELDS.SH_TRDACCT.FIELD_CONTROL = "2";
                    _this.groupDatas.OTHER_INFO.CONNECTED_ACCT_INFO[0].FIELDS.RELA_NAME.FIELD_CONTROL = "2";
                }
            }
        }
        // _this.$set(_this.groupDatas["OTHER_INFO"]["CONNECTED_ACCT_INFO"]["2"], "MODULE_ADD", "1");
        // _this.groupDatas["OTHER_INFO"]["CONNECTED_ACCT_INFO"][_this.groupDatas.OTHER_INFO.CONNECTED_ACCT_INFO.length-1].MODULE_ADD = "1";
    },
    /*
     *@method bizConnectedAcctInfoNodeBeforeSave
     *@desc 钩子函数 自定义保存数
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizConnectedAcctInfoNodeBeforeSave: async function (_this, params) {
        if(!_this.oppBusiData.sysTrdacctArr.length) {
            params.OTHER_INFO.RESTRICTED_STOCK_INFO = [];
        }
        let connectedAcctInfo = _this.groupDatas.OTHER_INFO.CONNECTED_ACCT_INFO;
        let rowsData = []; // 获取页面上最新的值
        _.each(connectedAcctInfo, (item, index) => {
            rowsData[index] = {};
            bizPublicMethod.$blMethod.changeObjKeys(item.FIELDS, rowsData[index]);
        })
        let originalData = _this.oppBusiData.oldBusiData.CONNECTED_ACCT_INFO, // 获取原始数据 oldBusiData
            datagridData = [];

        _.each(rowsData, function (item, index) {
            //判断当前是新增还是修改 OP_TYPE 0-新增 1-修改 2-删除 ""-不变
            var diff = item.OP_TYPE !== "0" ? bizPublicMethod.$blMethod.compareInfoZT(_.filter(originalData || {}, {
                    SZ_TRDACCT: item.SZ_TRDACCT,
                    SH_TRDACCT: item.SH_TRDACCT
                })[0], item) : [];

            datagridData.push(_.extend({}, {
                DIFF_INFO: diff
            }, item));
        });
        originalData && originalData.filter(function (v) {
            return !_.filter(datagridData, {SZ_TRDACCT: v.SZ_TRDACCT, SH_TRDACCT: v.SH_TRDACCT})[0];
        }).forEach(function (v) {
            datagridData.push(_.extend({}, v, {DIFF_INFO: [], OP_TYPE: "2"}));
        });
        if(datagridData.length == 1 && (datagridData[0].RELAKIND_COMM==""|| datagridData[0].ID_CODE=="")) {
            // datagridData[0].OP_TYPE = ""
            datagridData = [];
        }else {
            datagridData = _.filter(datagridData, item => {
                return item.ID_CODE != "" && item.ID_TYPE != ""
            })
        }
        params.OTHER_INFO.CONNECTED_ACCT_INFO = datagridData;
    },
    /*
     *@method bizConnectedAcctInfoNodeValidate
     *@desc 钩子函数 下一步验证
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizConnectedAcctInfoNodeValidate: function (_this) {
        let groupDatas = _this.groupDatas.OTHER_INFO.CONNECTED_ACCT_INFO;
        let szTrdArr = _.chain(groupDatas).filter(gd => {
            return gd.FIELDS.SZ_TRDACCT.DEFAULT_VALUE != "";
        }).map(o =>{
            return o.FIELDS.SZ_TRDACCT.DEFAULT_VALUE;
        }).value();

        let shTrdArr = _.chain(groupDatas).filter(gd => {
            return gd.FIELDS.SH_TRDACCT.DEFAULT_VALUE != "";
        }).map(o =>{
            return o.FIELDS.SH_TRDACCT.DEFAULT_VALUE;
        }).value();

        if(szTrdArr.length != _.uniq(szTrdArr).length || shTrdArr.length != _.uniq(shTrdArr).length){
            _this.messageBox({
                hasMask: true,
                messageText: '不能添加多个相同的证券账户!',
                confirmButtonText: '确认',
                typeMessage: 'warn',
                showMsgBox: true,
                confirmedAction: function () {}
            });
            return false;
        }
    },

    /*
     *@method bizConnectedAcctInfoNodePageActivated
     *@desc 钩子函数：页面激活
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizConnectedAcctInfoNodePageActivated: function (_this, groupId) {
        _this.groupDatasTpl.OTHER_INFO.CONNECTED_ACCT_INFO[0].MAX_LENGTH = "1000";
        _this.groupDatas.OTHER_INFO.CONNECTED_ACCT_INFO[0].MAX_LENGTH = "1000";
        // _this.$set(_this.groupDatas["OTHER_INFO"]["CONNECTED_ACCT_INFO"]["2"], "MODULE_ADD", "1");
        _this.$set(_this.groupDatas["OTHER_INFO"]["CONNECTED_ACCT_INFO"][_this.groupDatas.OTHER_INFO.CONNECTED_ACCT_INFO.length-1], "MAX_LENGTH", 1000);

        _this.groupDatas["OTHER_INFO"]["CONNECTED_ACCT_INFO"].forEach(moduleItem => {
            moduleItem.FIELDS.ID_CODE.promptValue = moduleItem.FIELDS.ID_CODE.DEFAULT_VALUE;
            if(moduleItem.FIELDS.SZ_TRDACCT.DEFAULT_VALUE) {
                moduleItem.FIELDS.SH_TRDACCT.FIELD_REQUIRED = "0"
            }
            if(moduleItem.FIELDS.SH_TRDACCT.DEFAULT_VALUE) {
                moduleItem.FIELDS.SZ_TRDACCT.FIELD_REQUIRED = "0"
            }
            //手输关联关系
            moduleItem.FIELDS.REMARK.FIELD_FUNCTION = "CHECK_CONNECTED_REMARK";
            moduleItem.FIELDS.ID_TYPE.FIELD_FUNCTION = 'CHECK_CONNECTED_ID_TYPE';

            moduleItem.FIELDS.SZ_TRDACCT.FIELD_CLEARABLE = true;
            moduleItem.FIELDS.SH_TRDACCT.FIELD_CLEARABLE = true;
        });
    },
    bizConnectedAcctInfoNodeAddModule: (_this, moduleld) => {
        let groupDatas = _this.groupDatas.OTHER_INFO.CONNECTED_ACCT_INFO;
        let szTrdArr = _.chain(groupDatas).filter(gd => {
            return gd.FIELDS.SZ_TRDACCT.DEFAULT_VALUE != "";
        }).map(o =>{
            return o.FIELDS.SZ_TRDACCT.DEFAULT_VALUE;
        }).value();

        let shTrdArr = _.chain(groupDatas).filter(gd => {
            return gd.FIELDS.SH_TRDACCT.DEFAULT_VALUE != "";
        }).map(o =>{
            return o.FIELDS.SH_TRDACCT.DEFAULT_VALUE;
        }).value();

        if(szTrdArr.length != _.uniq(szTrdArr).length || shTrdArr.length != _.uniq(shTrdArr).length){
            _this.messageBox({
                hasMask: true,
                messageText: '不能添加多个相同的证券账户!',
                confirmButtonText: '确认',
                typeMessage: 'warn',
                showMsgBox: true,
                confirmedAction: function () {}
            });
            return false;
        }
        return true
    },
    bizConnectedAcctInfoNodeAddModuleFinished: (_this, moduleld, fieldData) => {
        console.log("点击了【关联人】添加按钮【结束】")
        // moduleld.FIELDS.SECU_CODE.FIELD_CONTROL = "0";
        moduleld.FIELDS.OP_TYPE.DEFAULT_VALUE = "0";
        // 添加的模块设置必填
        moduleld.FIELDS.RELAKIND_COMM.FIELD_REQUIRED = "1";
        moduleld.FIELDS.ID_TYPE.FIELD_REQUIRED = "1";
        // moduleld.FIELDS.ID_CODE.FIELD_REQUIRED = "1";
        // moduleld.FIELDS.SZ_TRDACCT.FIELD_REQUIRED = "1";
        // moduleld.FIELDS.SH_TRDACCT.FIELD_REQUIRED = "1";
        moduleld["FIELDS"]["ID_CODE"]["VALID_TYPE"] = "length[1,48]|on-prompt|on-blur";
        moduleld.FIELDS.SZ_TRDACCT.FIELD_CLEARABLE = true;
        moduleld.FIELDS.SH_TRDACCT.FIELD_CLEARABLE = true;
        moduleld.FIELDS.ID_TYPE.FIELD_FUNCTION = 'CHECK_CONNECTED_ID_TYPE';
        moduleld.FIELDS.ID_CODE.FIELD_CONTROL = "2";
    },
    bizConnectedAcctInfoNodeDeleteModule: (_this, moduleld, fieldData) => {
        if(_this.groupDatas.OTHER_INFO.CONNECTED_ACCT_INFO.length==1) {
            _this.groupDatas.OTHER_INFO.CONNECTED_ACCT_INFO[0].FIELDS.SZ_TRDACCT.FIELD_DICT_NAME = [];
            _this.groupDatas.OTHER_INFO.CONNECTED_ACCT_INFO[0].FIELDS.SH_TRDACCT.FIELD_DICT_NAME = [];
            _.each(["RELAKIND_COMM","REMARK","ID_TYPE","ID_CODE","SZ_TRDACCT","SH_TRDACCT",],(c)=> {
                 _this.groupDatas.OTHER_INFO.CONNECTED_ACCT_INFO[0].FIELDS[c].FIELD_REQUIRED = "0"
                 _this.groupDatas.OTHER_INFO.CONNECTED_ACCT_INFO[0].FIELDS[c].correct = true;
                 _this.groupDatas.OTHER_INFO.CONNECTED_ACCT_INFO[0].FIELDS[c].message = ""
            })
        }
        return true;
    },
    //删除模块响应事件 删除动作已结束
    "bizConnectedAcctInfoNodeDeleteModuleFinished":(_this,deleteObj) =>{
        if(_this.groupDatas.OTHER_INFO.CONNECTED_ACCT_INFO.length==1) {
            _.each(["RELAKIND_COMM","REMARK","ID_TYPE","ID_CODE","SZ_TRDACCT","SH_TRDACCT",],(c)=> {
                 _this.groupDatas.OTHER_INFO.CONNECTED_ACCT_INFO[0].FIELDS[c].FIELD_REQUIRED = "0"
                 _this.groupDatas.OTHER_INFO.CONNECTED_ACCT_INFO[0].FIELDS[c].correct = true;
                 _this.groupDatas.OTHER_INFO.CONNECTED_ACCT_INFO[0].FIELDS[c].message = ""
            })
        }
    },
    bizConnectedAcctInfoNodePreValidate: function(_this) {
    //    if(_this.userType != "0"){
    //      _this.$router.goRoute("首次交易日 ");
    //    }
    },

    // 更改字段数据OP_TYPE 0-新增 1-修改 2-删除 ""-不变
    "changeConnectOpType":function(_this, field, fieldData) {
        let originalData = _this.oppBusiData.oldBusiData.CONNECTED_ACCT_INFO;
        let current = _.filter(originalData || {}, {"ID_CODE": fieldData.ID_CODE.DEFAULT_VALUE})[0];
        if(current&&Object.keys(current).length&&field.DEFAULT_VALUE == current[field.FIELD_ID]) {
            fieldData.OP_TYPE.DEFAULT_VALUE = "";
            // 不可编辑
            fieldData.ID_TYPE.FIELD_CONTROL = "2";
            fieldData.ID_CODE.FIELD_CONTROL = "2";
            fieldData.SZ_TRDACCT.FIELD_CONTROL = "2";
            fieldData.SH_TRDACCT.FIELD_CONTROL = "2";
        }else {
            fieldData.OP_TYPE.DEFAULT_VALUE = "1"
        }
        if(!current) {
            fieldData.OP_TYPE.DEFAULT_VALUE = "0"

            fieldData.ID_TYPE.FIELD_CONTROL = "0";
            // fieldData.ID_CODE.FIELD_CONTROL = "0";
            fieldData.SZ_TRDACCT.FIELD_CONTROL = "0";
            fieldData.SH_TRDACCT.FIELD_CONTROL = "0";
            fieldData.SZ_TRDACCT.FIELD_CLEARABLE = true;
            fieldData.SH_TRDACCT.FIELD_CLEARABLE = true;
        }
        if(field.DEFAULT_VALUE) {
            fieldData.RELAKIND_COMM.FIELD_REQUIRED = "1";
            fieldData.ID_TYPE.FIELD_REQUIRED = "1";
            // fieldData.ID_CODE.FIELD_REQUIRED = "1";
        }
    },
    /**
     *【CHECK_RELAKIND_COMM】关联关系字段
     * 
     */
    "CHECK_RELAKIND_COMM": function(_this, field, fieldData) {
        
        if (!field.DEFAULT_VALUE) {
            return false;
        } else if (field.DEFAULT_VALUE == "2") {
            fieldData.REMARK.FIELD_CONTROL = "0";
            fieldData.REMARK.DEFAULT_VALUE = "";
            fieldData.REMARK.FIELD_REQUIRED = "1";
        } else {
            fieldData.REMARK.FIELD_CONTROL = "1";
            fieldData.REMARK.DEFAULT_VALUE = "";
            fieldData.REMARK.FIELD_REQUIRED = "0";
        }
        if(field.DEFAULT_VALUE) {
            fieldData.RELAKIND_COMM.FIELD_REQUIRED = "1";
            fieldData.ID_TYPE.FIELD_REQUIRED = "1";
            // fieldData.ID_CODE.FIELD_REQUIRED = "1";
            fieldData.SZ_TRDACCT.FIELD_REQUIRED = "1";
            fieldData.SH_TRDACCT.FIELD_REQUIRED = "1";
        }
        if(fieldData.SZ_TRDACCT.DEFAULT_VALUE) {
            fieldData.SH_TRDACCT.FIELD_REQUIRED = "0";
        }
        if(fieldData.SH_TRDACCT.DEFAULT_VALUE) {
            fieldData.SZ_TRDACCT.FIELD_REQUIRED = "0";
        }
        this.changeConnectOpType(_this, field, fieldData);

        // if(stringConfig.isNotEmptyStr(fieldData.RELAKIND_COMM)
        // &&stringConfig.isNotEmptyStr(fieldData.ID_TYPE)
        // &&stringConfig.isNotEmptyStr(fieldData.ID_CODE)){
        //   if(getConnectedInfo(_this,fieldData) == false){
        //       //
        //   }
        // }
    },

    /**
     *【CHECK_CONNECTED_ID_TYPE】证件类型变更相关逻辑length[6,30]|on-prompt|on-blur
     * 
     */
    "CHECK_CONNECTED_ID_TYPE": function(_this, field, fieldData){
        if(fieldData.ID_TYPE.DEFAULT_VALUE) {
            fieldData.ID_CODE.FIELD_CONTROL = "0";
            fieldData.ID_CODE.FIELD_REQUIRED = "1";
            this.changeConnectOpType(_this, field, fieldData);
        }else {
            fieldData.ID_CODE.FIELD_CONTROL = "2";
            fieldData.ID_CODE.FIELD_REQUIRED = "0";
        }
        if (_.indexOf(["0b", "0c"], field.DEFAULT_VALUE) !== -1) {
           fieldData.ID_CODE.VALID_TYPE = 'fixedNumLength[9]|on-prompt|on-blur'
        }else if(field.DEFAULT_VALUE == '0d') {
           fieldData.ID_CODE.VALID_TYPE = 'fixedNumLength[8]|on-prompt|on-blur'
        }else if (field.DEFAULT_VALUE == '00' || field.DEFAULT_VALUE == '08') {
           fieldData.ID_CODE.VALID_TYPE = 'iscard|on-prompt|on-blur'
        }else if (field.DEFAULT_VALUE == '10') {
            fieldData.ID_CODE.VALID_TYPE = 'licensecode|on-prompt|on-blur'
        } else {
           fieldData.ID_CODE.VALID_TYPE = 'charMinus[0,32]|on-prompt|on-blur'
        }
        
        if(fieldData.RELAKIND_COMM.DEFAULT_VALUE !="2"){
            fieldData.REMARK.DEFAULT_VALUE = "";
        }
        if (field.DEFAULT_VALUE != _this.oppBusiData.preIdType) {
            _this.oppBusiData.preIdType = field.DEFAULT_VALUE;
            fieldData.ID_CODE.DEFAULT_VALUE = '';
            fieldData.SZ_TRDACCT.DEFAULT_VALUE = '';
            fieldData.SH_TRDACCT.DEFAULT_VALUE = '';
            fieldData.SZ_TRDACCT.FIELD_DICT_NAME = [];
            fieldData.SH_TRDACCT.FIELD_DICT_NAME = [];
            fieldData.ID_CODE.promptValue = "";
        }
    },

    /**
     *【CHECK_CONNECTED_ID_CODE】证件号码变更相关逻辑
     * 
     */
    "CHECK_CONNECTED_ID_CODE": async (_this, field, fieldData) => {
        if (field.DEFAULT_VALUE != _this.oppBusiData.preIdCode) {
            _this.oppBusiData.preIdCode = field.DEFAULT_VALUE;
            fieldData.SZ_TRDACCT.DEFAULT_VALUE = '';
            fieldData.SH_TRDACCT.DEFAULT_VALUE = '';
            fieldData.SZ_TRDACCT.FIELD_DICT_NAME = [];
            fieldData.SH_TRDACCT.FIELD_DICT_NAME = [];
        }
        if (_this.moduleId.indexOf("CONNECTED_ACCT_INFO") != -1 ) {
            
            if (!field.DEFAULT_VALUE || !fieldData.ID_TYPE.DEFAULT_VALUE) {
                fieldData.SZ_TRDACCT.FIELD_DICT_NAME = [];
                fieldData.SH_TRDACCT.FIELD_DICT_NAME = [];
                return false;
            }else {
                if(_this.groupDatas["OTHER_INFO"]["CONNECTED_ACCT_INFO"][0].MODULE_ASH){
                    _this.groupDatas["OTHER_INFO"]["CONNECTED_ACCT_INFO"][0].MODULE_ASH = true;
                }else if(stringConfig.isNotEmptyStr(fieldData.RELAKIND_COMM)
                    && stringConfig.isNotEmptyStr(fieldData.ID_TYPE)
                    && stringConfig.isNotEmptyStr(fieldData.ID_CODE)){
                        // // _this.loading('正在加载关联账户信息...');
                        // _this.loading = true;
                        // _this.loadingText = '正在加载关联账户信息...';
                        return Promise.all([
                            getConnectedInfo(_this,fieldData)
                        ]).then(res=>{
                            //证件号码查询得到 而且操作类型为修改时 证件号码不可编辑
                            if(res == true && fieldData.OP_TYPE.DEFAULT_VALUE == '1'){
                                field.FIELD_CONTROL = '2';
                                fieldData.ID_TYPE.FIELD_CONTROL = '2';
                            }
                        })
                    }
            } 
        }
    },

    /**
     * 	深圳证券账户 与 上海证券账户 二选一必填
     */
    "CHECK_SZ_TRDACCT": (_this, field, fieldData) => {
        let fieldsInfo = _this.groupDatas.OTHER_INFO.CONNECTED_ACCT_INFO;
        if(fieldData.RELAKIND_COMM.DEFAULT_VALUE) {
            if(field.DEFAULT_VALUE || fieldData.SH_TRDACCT.DEFAULT_VALUE) {
                field.FIELD_REQUIRED = "0"
                fieldData.SH_TRDACCT.FIELD_REQUIRED = "0";
            }else {
                field.FIELD_REQUIRED = "1";
            }
        }
        
        // if(fieldData.SH_TRDACCT.DEFAULT_VALUE) {
        //     field.FIELD_REQUIRED = "1"
        // }
        
    },

    /**
     * 	深圳证券账户 与 上海证券账户 二选一必填
     */
    "CHECK_SH_TRDACCT": (_this, field, fieldData) => {
        let fieldsInfo = _this.groupDatas.OTHER_INFO.CONNECTED_ACCT_INFO;
        if(fieldData.RELAKIND_COMM.DEFAULT_VALUE) {
            if(field.DEFAULT_VALUE || fieldData.SZ_TRDACCT.DEFAULT_VALUE) {
                field.FIELD_REQUIRED = "0";
                fieldData.SZ_TRDACCT.FIELD_REQUIRED = "0";
            }else {
                field.FIELD_REQUIRED = "1";
            }
        }
        
        // if(fieldData.SZ_TRDACCT.DEFAULT_VALUE) {
        //     field.FIELD_REQUIRED = "1"
        // }
    },
    /**
     * 手输关联关系
     */
    "CHECK_CONNECTED_REMARK" : function(_this, field, fieldData) {
        if(field.DEFAULT_VALUE.length > 128) {
            field.DEFAULT_VALUE = field.DEFAULT_VALUE.substr(0,128);
        }
    }
}

