/*
 * @Description: 非关键信息变更 个人信息部分
 * @Date: 2019-06-27 10:55:56
 */

import oppService from '../../../../../service/opp-service.js'
import date from '../../../../../tools/date.js'
import smsService from '../../../../../service/sms-service'
import * as utils from "../../../../../tools/util"
import stringConfig from '../../../../../tools/stringConfig';
import {
    parseAddress
} from '../../../../../tools/util'
import dict from '../../../../../tools/dict.js';

const custInfoLoadBizData = async function (_this, busiData) {
    //根据业务逻辑对业务字段进行设置
    return custInfoParseOppBiz(_this, busiData)
}

const custInfoParseOppBiz = function (_this, bdata) { // 解析身份证读卡数据
    if (_this.userType == "0") {
        let oppData = {};
        if (bdata.CUST_INFO) {
            if (bdata.CUST_INFO.CUST_BASIC_INFO)
                Object.assign(oppData, bdata.CUST_INFO.CUST_BASIC_INFO);
            if (bdata.CUST_LINK_INFO) {
                Object.assign(oppData, bdata.CUST_LINK_INFO);
            }
        }
        //更新流水数据的字段解析
        _this.$blMethod.parseGroupsMouduleData(_this, ["CUST_BASIC_INFO", "CUST_LINK_INFO", "CREDIT_TYPE_MODULE1"], oppData);
    }
}
export default {
    //----------------------------------钩子函数----------------------//
    /*
     * @Description: 钩子函数 加载历史数据之前触发
     * @Author: chencheng
     * @Date: 2019-06-27 11:03:56
     */
    custInfoBeforeLoadBiz: function (_this) {
        if (_this.userType == "0") {
            //设置证件类型
            _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.ID_TYPE.FIELD_DICT_FILTER = ["00", "01", "05", "08", "09", "0b", "0c", "0d", "0e", "0i", "0j", "0s"];
            //初始化字段
            _this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.VALIDATE_CODE.FIELD_REQUIRED = "0"; // 手机验证码非必填
            //初始化字段
            //联系信息模块  显示手机号发送验证码按钮
            _this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.VALIDATE_CODE.IS_SHOW_BUTTON = true;
            _this.$set(_this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.VALIDATE_CODE,'FIELD_BUTTON_TXT',`发送验证码`);
            //解析用户证件类型 用于控制辅助证件类型得显示
            let idType = _this.oppBusiData.custAllInfo.BASIC_INFO.ID_TYPE;
            this.updateFzIdInfo(_this, idType);
            //解析客户360数据
            this.custInfoParseOldBiz(_this); // beforeLoadBiz  后台返回数据渲染到页面
        }
    },
    /*
     *@Description: 钩子函数  加载历史数据后触发
     *@Author: yangypc
     *@Date: 2019-07-04 16:31:00
     */

    custInfoAfterLoadBiz: function (_this) {
        //重新解析历史数据
        custInfoLoadBizData(_this, _this.historyData)
    },

    /*
     *@method custInfoPageActivated
     *@desc 钩子函数：页面激活
     *@MethodAuthor  yangyp
     *@Date: 2019-07-04 15:19:09
     */
    custInfoPageActivated: function (_this) {
        //必须放在这里否则还原不显示使用地址按钮
        _this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.ADDRESS.isShowUseIDAddress = true;
        _this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.ADDRESS.FIELD_FUNCTION = "USE_ID_ADDRESS";

        _this.$router.updateRoute(_this.$router.getCurrentRouteIndex(), "nextBtnText", "填写完成");
        _this.oppBusiData.currentMobile = _this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.MOBILE_TEL.DEFAULT_VALUE;

        if (_.indexOf(["CUST_INFO", "CUST_LINK_INFO", "CREDIT_TYPE_GROUP"], _this.groupId) != -1) {
            _this.$el.getElementsByClassName("prev")[0].parentElement.style.display = "none";
        } else {
            _this.$el.getElementsByClassName("prev")[0].parentElement.style.display = "block";
        }
        //判断诚信记录模块信息是否显示
        if(_this.groupId == "CREDIT_TYPE_GROUP"){
            let modelOne = _this.groupDatas.CREDIT_TYPE_GROUP.CREDIT_TYPE_MODULE1[0];
            let hasCredit = _this.groupDatas.CREDIT_TYPE_GROUP.HAS_CREDIT_RECORD[0].FIELDS.HAS_CREDIT_RECORD.DEFAULT_VALUE;
            //如果诚信记录 标志存在 并且值为1 表示模块需要隐藏
            if(hasCredit == "0"){
                modelOne.MODULE_CONTROL = 0;
            }
        }
    },
    /*
     *@Description: 解析客户360数据
     *@Author: yangyp
     *@Date: 2019-07-04 19:04:44
     */
    custInfoParseOldBiz: function (_this) {
        //解析基本模块数据
        let oppData = _this.oppBusiData.custAllInfo.BASIC_INFO;
        let baseInfo = _this.oppBusiData.BASIC_INFO;
        if(oppData.FZ_ID_EXP_DATE == "0" && baseInfo.FZ_ID_EXP_DATE == "0"){
            oppData.FZ_ID_EXP_DATE = "";
            baseInfo.FZ_ID_EXP_DATE = "";
        }
        // 添加职业大类信息
        oppData.INDUS_GB = _this.oppBusiData.custAllInfo.OCCUPATION_INFO.INDUS_GB;
        oppData.INDUS_GB_SUB = _this.oppBusiData.custAllInfo.OCCUPATION_INFO.INDUS_GB_SUB;
        oppData.OCCU_GB = _this.oppBusiData.custAllInfo.OCCUPATION_INFO.OCCU_GB;
        oppData.OCCU_GB_SUB = _this.oppBusiData.custAllInfo.OCCUPATION_INFO.OCCU_GB_SUB;
        oppData.POSITION = _this.oppBusiData.custAllInfo.OCCUPATION_INFO.POSITION;
        oppData.FZ_ID_CODE = oppData.ID_CODE2 != "" ? oppData.ID_CODE2 : "";
        oppData.FZ_ID_TYPE = oppData.ID_TYPE2 != "" ? oppData.ID_TYPE2 : "";
        oppData.FZ_ID_EXP_DATE = oppData.ID_EXP_DATE2 != "" && oppData.ID_EXP_DATE2 != "0" ? oppData.ID_EXP_DATE2 : "";
        _this.oppBusiData.oppData = oppData;
        _this.$blMethod.parseGroupsMouduleData(_this, ["CUST_BASIC_INFO", "CUST_LINK_INFO"], oppData);
    },
    
    /*
     * @Description: 保存拼接的数据
     * @Author: chencheng
     * @Date: 2019-06-27 13:31:33
     */
    custInfoBeforeSave: function (_this, params) {
        return this.saveBeforeRequestValidate(_this, params);
    },
    /*
     * @Description: 
     * 1、保存数据前数据校验
     * @Author: chencheng
     * @Date: 2019-07-25 17:36:20
     */
    saveBeforeRequestValidate: function (_this, params) {
        let that = this;
        let oldBaseForm = _this.oppBusiData.custAllInfo.BASIC_INFO,
            newBaseForm = {};
        Object.assign(newBaseForm, _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS);
        Object.assign(newBaseForm, _this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS);

        let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
        let syncYMTFlag = _this.$blMethod.isSyncYMTFlag(_this, oldBaseForm, newBaseForm);
        let syncFundFlag = this.isSyncFundInfo(_this);
        let syncBankFlag = this.isSyncBankInfo(_this);
        let tempSysFlag = "2";
        if (syncYMTFlag == "1") {
            tempSysFlag += ",1";
        }
        if (syncFundFlag) {
            tempSysFlag += ",3";
        }
        if (syncBankFlag) {
            tempSysFlag += ",4";
        }
        let param = {
            "CUST_CODE": customerInfo.CUST_CODE,
            "BUSI_CODE": _this.busiCode,
            "BUSI_NAME": _this.$storage.getSession(_this.$definecfg.BUSI_NAME),
            "INT_ORG": customerInfo.INT_ORG,
            "SUBJECT_IDENTITY": customerInfo.SUBJECT_IDENTITY,
            "SYNC_SYS_FLAG": tempSysFlag,
            "CITIZENSHIP": customerInfo.CITIZENSHIP,
            "IS_CAN_EXPAND_FLAG": (!_.isObject(newBaseForm.USER_FNAME.DEFAULT_VALUE) && !_.isObject(newBaseForm.ID_TYPE.DEFAULT_VALUE) && _.isObject(newBaseForm.ID_CODE.DEFAULT_VALUE) && _.trim(oldBaseForm.ID_CODE).length === 15 && utils.updateCardNo(oldBaseForm.ID_CODE) == newBaseForm.ID_CODE.DEFAULT_VALUE) ? "1" : "0",
            "OLD_CUST_FNAME": oldBaseForm.USER_FNAME,
            "OLD_ID_TYPE": oldBaseForm.ID_TYPE,
            "OLD_ID_CODE": oldBaseForm.ID_CODE,
            "NEW_CUST_FNAME": newBaseForm.USER_FNAME.DEFAULT_VALUE,
            "NEW_ID_TYPE": newBaseForm.ID_TYPE.DEFAULT_VALUE,
            "NEW_ID_CODE": newBaseForm.ID_CODE.DEFAULT_VALUE
        };
        params.SYNC_SYS_FLAG = param.SYNC_SYS_FLAG;

        return _this.$syscfg.K_Request('W0000168', param).then(function (res) {
            if (res.Code == "0") {
                if (_.get(res, "Data[0].VALIDATE_TYPE", "") == "0") {
                    _this.messageBox({
                        hasMask: true,
                        messageText: res.Data[0].VALIDATE_MSG,
                        confirmButtonText: '确定',
                        typeMessage: 'warn',
                        showMsgBox: true,
                        confirmedAction: function () {
                            _this.$router.push({
                                path: _this.$bizhomecfg.getHomeConfig()
                            });
                        }
                    })
                    throw "preventNextStep";
                } else if (_.get(res, "Data[0].VALIDATE_TYPE", "") == "1") {
                    //中登没有正常的一码通
                    let that = this;
                    _this.messageBox({
                        hasMask: true,
                        messageText: res.Data[0].VALIDATE_MSG + "如您仍需办理此业务，请到柜台办理或联系现场工作人员。",
                        confirmButtonText: '点击重试',
                        cancelButtonText: '返回首页',
                        typeMessage: 'warn',
                        showMsgBox: true,
                        confirmedAction: function () {
                            that.requestSaveValideData(_this, params);
                        },
                        canceledAction: function () {
                            _this.$router.push({
                                path: _this.$bizhomecfg.getHomeConfig()
                            });
                        }
                    })
                    throw "preventNextStep";
                    // if(syncYMTFlag ){
                    //     syncYMTFlag = false;
                    //     if(syncBankFlag && _this.oppBusiData.bankSignInfo && _this.oppBusiData.bankSignInfo.length){
                    //       tempSysFlag = "2,3,4";
                    //     }else{
                    //       tempSysFlag = "2,3";
                    //     }
                    // }
                }
                if (res.Data && res.Data.length > 1) {
                    params.SELECT_YMT_CODE = res.Data[0].YMT_CODE || "";
                    params.jumpJudgeBusiTimes = res.Data[0].jumpJudgeBusiTimes || "0";
                }
                if (params.SELECT_YMT_CODE == "") {
                    syncYMTFlag = "0";
                }

                params.SYNC_SYS = {
                        NEW_YMT_FLAG: syncYMTFlag,
                        NEW_SHARE_FLAG: "1", //同步股东
                        NEW_FUND_FLAG: "1",
                        NEW_BANK_FLAG: "0",
                        NEW_OP_REMARK: ""
                },

                //中登无纸化一码通单据盖章
                params.YMT_CODE = params.SELECT_YMT_CODE || params.YMT_CODE || "";
                params.IS_YMT_CODE_SEAL = !!params.YMT_CODE ? "0" : "1";

                params.jumpJudgeBusiTimes = _.get(res, "Data[0].jumpJudgeBusiTimes", "") == '1' ? "1" : "0";

                params.COLLECT_RISK_IMG_FLAG = "0";
                if (_this.oppBusiData.custTaxInfo.TAX_FLAG == "" || _this.oppBusiData.custTaxInfo.TAX_FLAG == undefined) {
                    params.COLLECT_TAX_IMG_FLAG = "1";
                } else {
                    params.COLLECT_TAX_IMG_FLAG = "0";
                }

                params.COLLECT_ZD_IMG_FLAG = syncYMTFlag;
                that.syncObjGetData(_this, params);
                return that.custInfoGetData(_this, params);
            } else {
                _this.messageBox({
                    hasMask: true,
                    messageText: res.Msg + "如您仍需办理此业务，请到柜台办理或联系现场工作人员。",
                    confirmButtonText: '点击重试',
                    cancelButtonText: '返回首页',
                    typeMessage: 'warn',
                    showMsgBox: true,
                    confirmedAction: function () {
                        that.saveCustomerBusiData(_this, params);
                    },
                    canceledAction: function () {
                        _this.$router.push({
                            path: _this.$bizhomecfg.getHomeConfig()
                        });
                    }
                })
                throw "preventNextStep";
            }
        });
    },

    /**
     * 拼接同步信息,key
     */
    syncObjGetData: function (_this, params) {

        let oppData = _this.oppBusiData;
        if (params.YMT_CODE == "") {
            params.SYNC_SYS_FLAG = params.SYNC_SYS_FLAG.replace("1,", "");
        }
        oppData.SYNC_OBJ.SYNC_SYS_FLAG = params.SYNC_SYS_FLAG;
        oppData.SYNC_OBJ.CSDC_YMT_CODE = params.YMT_CODE;
        oppData.SYNC_OBJ.BANK_LIST = oppData.BANKSIGN_INFO.CUST_CODE + oppData.BANKSIGN_INFO.key;
        oppData.SYNC_OBJ.BANK_LIST_TEXT = oppData.BANKSIGN_INFO.EXT_ORG_TEXT;
        let syncObj = oppData.SYNC_OBJ;
        if (oppData.BANKSIGN_INFO && oppData.BANKSIGN_INFO.length > 0) {
            syncObj.BANK_LIST = oppData.BANKSIGN_INFO[0].CUST_CODE + "_" + oppData.BANKSIGN_INFO[0].CURRENCY + "_" + oppData.BANKSIGN_INFO[0].EXT_ORG;
            syncObj.BANK_LIST_TEXT = oppData.BANKSIGN_INFO[0].EXT_ORG_TEXT;
        }
        let result = {
            SYNC_SYS_FORM: syncObj,
            SYNC_YMT_FLAG: syncObj.SYNC_SYS_FLAG.indexOf("1") != "-1" ? "1" : "0",
            SYNC_SYS: {
                NEW_YMT_FLAG: syncObj.SYNC_SYS_FLAG.indexOf("1") != -1 ? "1" : "0",
                NEW_SHARE_FLAG: syncObj.SYNC_SYS_FLAG.indexOf("2") != -1 ? "1" : "0",
                NEW_FUND_FLAG: syncObj.SYNC_SYS_FLAG.indexOf("3") != -1 ? "1" : "0",
                NEW_BANK_FLAG: syncObj.SYNC_SYS_FLAG.indexOf("4") != -1 ? "1" : "0",
                IS_SYNC_BANK_FLAG: syncObj.SYNC_SYS_FLAG.indexOf("4") != -1 ? "1" : "0",
                BSB_USER_FNAME: syncObj.BSB_USER_FNAME,
                BSB_ID_TYPE: syncObj.BSB_ID_TYPE,
                BSB_ID_CODE: syncObj.BSB_ID_CODE
            },
            SYNC_BANK_LIST: oppData.BANKSIGN_INFO
            // SYNC_BANK_LIST: syncObj.BANKSIGN_INFO
        }
        Object.assign(params, result);
    },
    /*
     * @Description: 拼接数据
     * @Author: chencheng
     * @Date: 2019-06-27 13:32:11
     */
    custInfoGetData: function (_this, params) {
        let CUST_BASIC_INFO_NEW = {};
        // form表单值 CUST_INFO
        _this.$blMethod.changeObjKeys(_this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS, CUST_BASIC_INFO_NEW);
     
        // form表单值 CUST_LINK_INFO
        let newCustLinkInfoObj = {};
        _this.$blMethod.changeObjKeys(_this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS, newCustLinkInfoObj);
        CUST_BASIC_INFO_NEW.ID_TYPE2 = _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.FZ_ID_TYPE.DEFAULT_VALUE || "";
        CUST_BASIC_INFO_NEW.ID_CODE2 = _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.FZ_ID_CODE.DEFAULT_VALUE || "";
        CUST_BASIC_INFO_NEW.ID_EXP_DATE2 = _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.FZ_ID_EXP_DATE.DEFAULT_VALUE || "";
        //去除CUST_BASIC_INFO_NEW中对应得FZ_XXXX_XXX
        CUST_BASIC_INFO_NEW = _.omit(CUST_BASIC_INFO_NEW, ["FZ_ID_TYPE", "FZ_ID_CODE", "FZ_ID_EXP_DATE"]);
        // 对比差异
        let custAllInfoBasicInfo = _this.oppBusiData.custAllInfo.BASIC_INFO;
        let data1 = _this.$blMethod.compareInfo2(custAllInfoBasicInfo, CUST_BASIC_INFO_NEW);
        let data2 = _this.$blMethod.compareInfo2(_this.oppBusiData.BASIC_INFO, newCustLinkInfoObj);
     
        let newForm = Object.assign(CUST_BASIC_INFO_NEW, newCustLinkInfoObj)
        let dataAll = _this.$blMethod.compareInfo2(_this.oppBusiData.BASIC_INFO, newForm);
        newForm.DIFF_INFO = dataAll;
        let CUST_BASIC_INFO = Object.assign(CUST_BASIC_INFO_NEW, {
            "SUBJECT_IDENTITY": _this.oppBusiData.BASIC_INFO.SUBJECT_IDENTITY || "",
            "INOUTSIDE_IDENTITY": _this.oppBusiData.BASIC_INFO.INOUTSIDE_IDENTITY,
            "SPECIAL_FLAG_TYPE": _this.oppBusiData.BASIC_INFO.SPECIAL_FLAG_TYPE || "",
        })
        newCustLinkInfoObj.DIFF_INFO = data2;
        let CUST_LINK_INFO = Object.assign(newCustLinkInfoObj, {
            "MOBILE_TEL": _this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.MOBILE_TEL.DEFAULT_VALUE || "",
            "EMAIL": _this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.EMAIL.DEFAULT_VALUE || "",
            "TEL": _this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.TEL.DEFAULT_VALUE || "",
            "ZIP_CODE": _this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.ZIP_CODE.DEFAULT_VALUE || "",
            "ADDRESS": _this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.ADDRESS.DEFAULT_VALUE || ""
        });
        //当证件类型为：香港居民通行证、澳门居民通行证，标记其他证件类型为修改还是新增，0：新增，1：修改
        //OTHER_CARD_INFO_OPER_TYPE 这个字段在标准版不知道有没有对应
        _this.oppBusiData.custAllInfo.BASIC_INFO.FZ_ID_TYPE ? _this.oppBusiData.OTHER_CARD_INFO_OPER_TYPE = "1" : _this.oppBusiData.OTHER_CARD_INFO_OPER_TYPE = "";
        // 判断身份证有效期是否过期
        _this.oppBusiData.tagTime = "";
        if (_this.oppBusiData.custAllInfo.BASIC_INFO.ID_TYPE == "00") {
            let cardExpDate = _this.oppBusiData.BASIC_INFO.ID_EXP_DATE;
            let dates = date.getClientDateTime();
            let dif = date.compareDate(cardExpDate, date.getClientDate())
            if (dif == -1) {
                _this.oppBusiData.tagTime = "1";
            }
        }
        _this.oppBusiData.IDCARD_READ_FLAG = _this.oppBusiData.BASIC_INFO.IDCARD_READ_FLAG || "0";
        if (_this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.CITIZENSHIP.DEFAULT_VALUE != _this.oppBusiData.oppData ||
            (_this.oppBusiData.BASIC_INFO.ID_TYPE == "01" && _this.$blMethod.isSubjectIdentity(_this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.SUBJECT_IDENTITY.DEFAULT_VALUE, "p"))) {
            _this.oppBusiData.VALIDATE_CITY = "1";
        }
        let specialFlag = _.find(data1, function (item) {
            return item.FIELD == "SPECIAL_FLAG_TYPE";
        })
        let SPECIAL_FLAG_TYPE_ADD_FIN,
            SPECIAL_FLAG_TYPE_DEL_FIN;
        if (specialFlag) {
            let newArr = specialFlag.NEW.split(",");
            let oldArr = specialFlag.OLD.split(",");
            let SPECIAL_FLAG_TYPE_ADD = _.difference(newArr, oldArr) || [];
            if (SPECIAL_FLAG_TYPE_ADD.length == 1 && SPECIAL_FLAG_TYPE_ADD[0] == "") {
                SPECIAL_FLAG_TYPE_ADD = [];
            }
            let SPECIAL_FLAG_TYPE_DEL = _.difference(oldArr, newArr) || [];
            if (SPECIAL_FLAG_TYPE_DEL.length == 1 && SPECIAL_FLAG_TYPE_DEL[0] == "") {
                SPECIAL_FLAG_TYPE_DEL = [];
            }
            SPECIAL_FLAG_TYPE_ADD_FIN = _.map(SPECIAL_FLAG_TYPE_ADD, function (item) {
                return {
                    SPECIAL_FLAG_TYPE: item
                }
            })
            SPECIAL_FLAG_TYPE_DEL_FIN = _.map(SPECIAL_FLAG_TYPE_DEL, function (item) {
                return {
                    SPECIAL_FLAG_TYPE: item
                }
            })
        }
        let custAllInfo = _this.$storage.getJsonSession(_this.$definecfg.CUST_ALL_INFO) || {};
        let oldBaseInfo = custAllInfo.BASIC_INFO;
        oldBaseInfo.OCCU_TYPE_TEXT = oldBaseInfo.OCCU_TYPE_EX;

        if (JSON.stringify(_this.oppBusiData.custAssociateInfo) != "{}") {
            let otherObj = {
                "OTHER_ID_TYPE": _this.oppBusiData.custAssociateInfo && _this.oppBusiData.custAssociateInfo.ID_TYPE || "",
                "OTHER_ID_EXP_DATE": _this.oppBusiData.custAssociateInfo && _this.oppBusiData.custAssociateInfo.ID_EXP_DATE || "",
                "OTHER_ID_CODE": _this.oppBusiData.custAssociateInfo && _this.oppBusiData.custAssociateInfo.ID_CODE || "",
                "OTHER_CUST_NAME": _this.oppBusiData.custAssociateInfo && _this.oppBusiData.custAssociateInfo.ASSOCIATE_NAME || ""
            }
            Object.assign(oldBaseInfo, otherObj);
        }
        //判断三要素是否改变
        let changeImportantFlag = "0";
        if(_this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.USER_FNAME !=_this.oppBusiData.BASIC_INFO.USER_FNAME
        || _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.ID_TYEP != _this.oppBusiData.BASIC_INFO.ID_TYEP
        || _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.ID_CODE != _this.oppBusiData.BASIC_INFO.ID_CODE){
            changeImportantFlag = "1";
        }
        let res = {
            "OLD_BASE_INFO": oldBaseInfo,
            // "NEW_BASE_INFO" : CUST_BASIC_INFO,
            "NEW_BASE_INFO": newForm,
            "IS_CHANGE_TO_FOREIGNER": _this.oppBusiData.custAllInfo.BASIC_INFO.ID_TYPE == "01" &&
                _this.$blMethod.isSubjectIdentity(_this.oppBusiData.custAllInfo.BASIC_INFO.SUBJECT_IDENTITY, "p") ? "1" : "0",
            "OTHER_CARD_INFO_OPER_TYPE": _this.oppBusiData.OTHER_CARD_INFO_OPER_TYPE,
            "CUST_BASIC_INFO": CUST_BASIC_INFO,
            "CUST_LINK_INFO": CUST_LINK_INFO,
            "TAGTIME": _this.oppBusiData.tagTime, // 标记时间是否是过期,为1的话就是过期，为空的话不过期
            "IDCARD_READ_FLAG": _this.oppBusiData.IDCARD_READ_FLAG, // 读卡标志 0：未读卡 1：已读卡
            "isOnlyChangeTax": null, // 仅修改涉税信息 1：是 null 否
            "VALIDATE_CITY": _this.oppBusiData.VALIDATE_CITY || "0", // 审核时是否校验黑名单国籍的标志
            "ID_TYPE": _this.oppBusiData.BASIC_INFO.ID_TYPE,
            "OTHER_ID_TYPE": CUST_BASIC_INFO.OTHER_ID_TYPE || "",
            "SPECIAL_FLAG_TYPE_ADD": SPECIAL_FLAG_TYPE_ADD_FIN, // 客户特殊标志
            "SPECIAL_FLAG_TYPE_DEL": SPECIAL_FLAG_TYPE_DEL_FIN,
            "IS_YMT_CODE_SEAL": "1", //中登无纸化 所需参数
            "CSDC_SIGN_TYPE": "0", //中登无纸化表单049 取变更签名
            // "ACCT_LIMIT" : ACCT_LIMIT_LIST,
            "NEW_KSBP_REMARK": _this.oppBusiData.custAllInfo.BASIC_INFO.BS_REMARK1,
            "NEW_KUAS_REMARK": _this.oppBusiData.custAllInfo.BASIC_INFO.REMARK,
            "OLD_KSBP_REMARK": _this.oppBusiData.custAllInfo.BASIC_INFO.BS_REMARK1,
            "OLD_KUAS_REMARK": _this.oppBusiData.custAllInfo.BASIC_INFO.REMARK,
            "CUST_WORK_LEARNING_EXPERIENCE": {},
            "CHANGE_IMPORTANT_FLAG": changeImportantFlag,
            "CHANGE_CITIZENSHIP_FLAG": _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.CITIZENSHIP.DEFAULT_VALUE ==_this.oppBusiData.BASIC_INFO.CITIZENSHIP ? "0":"1",
        }

        return Object.assign(params, res);
    },

    /*
     * @Description: 点击下一步验证
     * @Author: chencheng
     * @Date: 2019-06-27 13:59:47
     */
    custInfoValidate: function (_this, params) {

        if (_this.groupId == "CUST_INFO") {
            if(_this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.NATIVE_PLACE != ""
            || _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.ID_ISS_AGCY != ""
            || _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.ID_ADDR != ""){
                _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.NATIVE_PLACE.correct = true;
                _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.ID_ISS_AGCY.correct = true;
                _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.ID_ADDR.correct = true;
            }
            // 职业类型是否可以修改
            if (_this.oppBusiData.custAllInfo.BASIC_INFO.OCCU_TYPE !== "99" && _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.OCCU_TYPE.DEFAULT_VALUE === "99") {
                _this.alert({
                    messageText: '职业类型不允许修改为其他！'
                });
                return false;
            } else {
                _this.loading = true;
                _this.loadingText = '正在核对您的业务数据，请稍候...';
                let custBaseInfo = _this.$blMethod.getCustomerAllData(_this);
                let validateCustInfoObj = {
                    "BIRTHDAY": _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.BIRTHDAY.DEFAULT_VALUE,
                    "SEX": custBaseInfo.SEX,
                    "OCCU_TYPE": _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.OCCU_TYPE.DEFAULT_VALUE,
                    "EDUCATION": _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.EDUCATION.DEFAULT_VALUE,
                    "TRADE": "0",
                    //"TRADE": _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.INDUS_TYPE.DEFAULT_VALUE,
                    "POSITION": _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.POSITION.DEFAULT_VALUE,
                    // "CREDIT_FLAG": _this.oppBusiData.custAllInfo.BASIC_INFO.CREDIT_FLAG || "0",
                    // "CREDIT_TYPE":_this.oppBusiData.custAllInfo.BASIC_INFO.CREDIT_TYPE || ""
                    "CREDIT_FLAG": "0",
                    "CREDIT_TYPE": "pp",

                }
                // 职务联动入参不能为空
                // for (let fk in validateCustInfoObj) {
                //     if (!validateCustInfoObj[fk] && fk != "POSITION" && fk != "CREDIT_TYPE") {
                //         // if (fk == "TRADE") {
                //         //     fk = "INDUS_TYPE";
                //         // }
                //         if (!!_this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS[fk]) {
                //             _this.$blMethod.showMsgBox(_this, _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS[fk].FIELD_TITLE + "不能为空")
                //         } else {
                //             _this.$blMethod.showMsgBox(_this, _this.groupDatas.CUST_INFO.CUST_OTHER_INFO[0].FIELDS[fk].FIELD_TITLE + "不能为空")
                //         }
                //         return false;
                //     }
                // }
                return Promise.all([
                    oppService.W0000215(validateCustInfoObj)
                ]).then(function (res) {
                    if (res[0].Code == "0") {
                        if (_this.$router.getCurrentRoute().nextBtnText == "填写完成") {
                            let data = _this.parseGroupData();
                            if (data[0].length) {
                                return true;
                            }
                            //当保存前存在字段变更则 弹出同步框 否则不弹出同步框
                            if(_this.oppBusiData.syncIdType != _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.ID_TYPE.DEFAULT_VALUE
                            || _this.oppBusiData.syncIdCode != _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.ID_CODE.DEFAULT_VALUE
                            || _this.oppBusiData.syncUserFname != _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.USER_FNAME.DEFAULT_VALUE
                            || _this.oppBusiData.syncIdExpDate != _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.ID_EXP_DATE.DEFAULT_VALUE){
                                _this.oppBusiData.isSyncBase = false;
                            }
                            //这里需要判断 如果当前收益人和控制人
                            if(!_this.oppBusiData.isSyncBase &&(_this.oppBusiData.BASIC_INFO.ID_EXP_DATE != _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.ID_EXP_DATE.DEFAULT_VALUE
                            || _this.oppBusiData.BASIC_INFO.USER_FNAME != _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.USER_FNAME.DEFAULT_VALUE
                            || _this.oppBusiData.BASIC_INFO.ID_TYPE != _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.ID_TYPE.DEFAULT_VALUE
                            || _this.oppBusiData.BASIC_INFO.ID_CODE != _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.ID_CODE.DEFAULT_VALUE)) {
                                _this.messageBox({
                                    hasMask:true,
                                    messageText:'基本信息已同步到控制人和受益人信息',
                                    confirmButtonText:'确认',
                                    typeMessage:'success', 
                                    showMsgBox:true ,
                                    confirmedAction: function(){
                                        _this.$router.goRoute("业务导航");
                                    },
                                })
                                //当实际收益人 是本人得时候同步实际受益人信息 否则不同步
                                if(_this.groupDatas.BENEFICIARY_INFO.BENEFICIARY_MODULE[0].FIELDS.BENEFICIARY_RELA.DEFAULT_VALUE == "0Z"){
                                    _this.oppBusiData.selfBenFlag = true;
                                    let BENEFICIARY_INFO = _this.groupDatas["BENEFICIARY_INFO"]["BENEFICIARY_MODULE"][0].FIELDS;
                                    _.forEach(BENEFICIARY_INFO,function(value, key) {
                                        if(key != "BENEFICIARY_NO"){
                                            BENEFICIARY_INFO[key].FIELD_CONTROL = 1
                                        }
                                    })
                                    let selfBeneficiaryInfo = [{
                                        "BENEFICIARY_NO":  _this.oppBusiData.custAllInfo.BENEFICIARY_INFO.length==0?"": "1",
                                        "BENEFICIARY_RELA": _this.groupDatas.BENEFICIARY_INFO.BENEFICIARY_MODULE[0].FIELDS.BENEFICIARY_RELA.DEFAULT_VALUE,
                                        "BENEFICIARY_NAME": _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.USER_FNAME.DEFAULT_VALUE,
                                        "BENEFICIARY_ID_TYPE": _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.ID_TYPE.DEFAULT_VALUE,
                                        "BENEFICIARY_ID": _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.ID_CODE.DEFAULT_VALUE,
                                        "BENEFICIARY_ID_EXP_DATE": _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.ID_EXP_DATE.DEFAULT_VALUE,
                                    }]
                                    _this.$blMethod.parseMoudleArray(_this,_this.groupDatas["BENEFICIARY_INFO"]["BENEFICIARY_MODULE"], selfBeneficiaryInfo);
                                    _.forEach(BENEFICIARY_INFO,function(value, key) {
                                        if(key != "BENEFICIARY_NO"){
                                            BENEFICIARY_INFO[key].FIELD_CONTROL = 2
                                        }
                                    })
                                }
                                //当实际控制人为本人时 同步控制人信息
                                if(_this.groupDatas.CONTROLLER_INFO.CONTROLLER_MODULE[0].FIELDS.CONTROLER_RELATION.DEFAULT_VALUE == "0Z"){
                                    _this.oppBusiData.selfCtlFlag = true;
                                    let CONTROLLER_INFO = _this.groupDatas["CONTROLLER_INFO"]["CONTROLLER_MODULE"][0].FIELDS;
                                    _.forEach(CONTROLLER_INFO,function(value, key) {
                                        if(key != "CONTROLER_NUM"){
                                            CONTROLLER_INFO[key].FIELD_CONTROL = 1
                                        }
                                    })
                                    let selfControllerInfo = [{
                                        "CONTROLER_NUM": _this.oppBusiData.custAllInfo.CONTROLLER_INFO.length==0?"": "1",
                                        "CONTROLER_RELATION": _this.groupDatas.CONTROLLER_INFO.CONTROLLER_MODULE[0].FIELDS.CONTROLER_RELATION.DEFAULT_VALUE,
                                        "CONTROLER_NAME": _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.USER_FNAME.DEFAULT_VALUE,
                                        "CONTROLER_ID_TYPE": _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.ID_TYPE.DEFAULT_VALUE,
                                        "CONTROLER_ID_NO": _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.ID_CODE.DEFAULT_VALUE,
                                        "CONTROLER_ID_EXP_DATE": _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.ID_EXP_DATE.DEFAULT_VALUE,
                                    }]
                                    _this.$blMethod.parseMoudleArray(_this,_this.groupDatas["CONTROLLER_INFO"]["CONTROLLER_MODULE"], selfControllerInfo);
                                    _.forEach(CONTROLLER_INFO,function(value, key) {
                                        if(key != "CONTROLER_NUM"){
                                            CONTROLLER_INFO[key].FIELD_CONTROL = 2
                                        }
                                    })
                                }
                                _this.oppBusiData.syncIdType = _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.ID_TYPE.DEFAULT_VALUE;
                                _this.oppBusiData.syncIdCode = _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.ID_CODE.DEFAULT_VALUE;
                                _this.oppBusiData.syncUserFname = _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.USER_FNAME.DEFAULT_VALUE;
                                _this.oppBusiData.syncIdExpDate = _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.ID_EXP_DATE.DEFAULT_VALUE;
                                _this.oppBusiData.isSyncBase = true;
                                return true
                             }else {
                                let data = _this.parseGroupData();
                                if(data[0].length) {
                                    return true;
                                }
                                _this.$router.goRoute("业务导航");
                             }
                            _this.$router.goRoute("业务导航");
                            return false;
                        }
                    } else {
                        _this.messageBox({
                            hasMask: true,
                            messageText: res[0].Msg,
                            confirmButtonText: '继续修改',
                            cancelButtonText: '返回首页',
                            typeMessage: 'warn',
                            showMsgBox: true,
                            confirmedAction: function () {

                            },
                            canceledAction: function () {
                                _this.$router.push({
                                    path: _this.$bizhomecfg.getHomeCustomerConfig()
                                });
                            }
                        })
                        return false;
                    }

                }).finally(function () {
                    _this.loading = false;
                })
            }
            // this.custInfoGetData(_this, params)
        }
        if (_this.groupId == "CREDIT_TYPE_GROUP") {

            if (_this.$router.getCurrentRoute().nextBtnText == "填写完成") {
                let data = _this.parseGroupData();
                if (data[0].length) {
                    return true
                }
                //当 第一个模块的状态为隐藏的时候 在这里将其设置为显示  在进入页面的时候将其设置为隐藏
                let modelOne = _this.groupDatas.CREDIT_TYPE_GROUP.CREDIT_TYPE_MODULE1[0];
                if (modelOne.MODULE_CONTROL == '0'){
                    //将其显示
                    modelOne.MODULE_CONTROL = '1';
                    _this.oppBusiData.showCredit = 1;
                }
                _this.$router.goRoute("业务导航");
                return false;
            }
        }

        if (_this.groupId == "CUST_LINK_INFO") {
            if(!_this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.MOBILE_TEL.DEFAULT_VALUE) {
                _this.alert({
                    messageText:'手机号码不能为空'
                });
                return false;
            }
            if( _this.oppBusiData.currentMobile != _this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.MOBILE_TEL.DEFAULT_VALUE ){
                _this.alert({
                    messageText:'手机号码已修改，请重新发送验证码'
                });
                return false;
            }
            if (!_this.oppBusiData.IDENTIFY_CODE_CHECK_FLAG && _this.oppBusiData.currentMobile != _this.oppBusiData.custAllInfo.BASIC_INFO.MOBILE_TEL) {
                let fieldData = _this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS,
                    field = fieldData.VALIDATE_CODE;
                return this.CHECK_VALIDATE_CODE(_this, field, fieldData).then(function (errTxt) {
                    if (errTxt == '') {
                        let data = _this.parseGroupData();
                        if (data[0].length) {
                            return true;
                        }
                        _this.$router.goRoute("业务导航");
                        clearInterval(_this.oppBusiData.interTimer);
                        _this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.VALIDATE_CODE.BUTTON_ENABLE = false;
                        _this.$set(_this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.VALIDATE_CODE, 'FIELD_BUTTON_TXT', `发送验证码`);
                        return false;
                    } else {
                        _this.alert(errTxt);
                        return false;
                    }
                });
            }
            if(_this.oppBusiData.syncMobile != _this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.MOBILE_TEL.DEFAULT_VALUE
            || _this.oppBusiData.syncAddress != _this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.ADDRESS.DEFAULT_VALUE){
                _this.oppBusiData.isSyncBC = false;
            }
            if (_this.$router.getCurrentRoute().nextBtnText == "填写完成") {        
                //当实际收益人 是本人得时候同步实际受益人信息 否则不同步
                if(_this.oppBusiData.BASIC_INFO.MOBILE_TEL !=_this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.MOBILE_TEL.DEFAULT_VALUE
                    || _this.oppBusiData.BASIC_INFO.ADDRESS != _this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.ADDRESS.DEFAULT_VALUE){
                    if(_this.groupDatas.BENEFICIARY_INFO.BENEFICIARY_MODULE[0].FIELDS.BENEFICIARY_RELA.DEFAULT_VALUE == "0Z"){
                        _this.oppBusiData.selfBenFlag = true;
                        let BENEFICIARY_INFO = _this.groupDatas["BENEFICIARY_INFO"]["BENEFICIARY_MODULE"][0].FIELDS;
                        _.forEach(BENEFICIARY_INFO,function(value, key) {
                            if(key != "BENEFICIARY_NO"){
                                BENEFICIARY_INFO[key].FIELD_CONTROL = 1
                            }
                        })
                        let selfBeneficiaryInfo = [{
                            "BENEFICIARY_TEL": _this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.MOBILE_TEL.DEFAULT_VALUE,
                            "BENEFICIARY_ADDR": _this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.ADDRESS.DEFAULT_VALUE
                        }]
                        _this.$blMethod.parseMoudleArray(_this,_this.groupDatas["BENEFICIARY_INFO"]["BENEFICIARY_MODULE"], selfBeneficiaryInfo);
                        _.forEach(BENEFICIARY_INFO,function(value, key) {
                            if(key != "BENEFICIARY_NO"){
                                BENEFICIARY_INFO[key].FIELD_CONTROL = 2
                            }
                        })
                    }
                    //当实际控制人为本人时 同步控制人信息
                    if(_this.groupDatas.CONTROLLER_INFO.CONTROLLER_MODULE[0].FIELDS.CONTROLER_RELATION.DEFAULT_VALUE == "0Z"){
                        _this.oppBusiData.selfCtlFlag = true;
                        let CONTROLLER_INFO = _this.groupDatas["CONTROLLER_INFO"]["CONTROLLER_MODULE"][0].FIELDS;
                        _.forEach(CONTROLLER_INFO,function(value, key) {
                            if(key != "CONTROLER_NUM"){
                                CONTROLLER_INFO[key].FIELD_CONTROL = 1
                            }
                        })
                        let selfControllerInfo = [{
                            "CONTROLER_TEL":_this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.MOBILE_TEL.DEFAULT_VALUE,
                        }]
                        _this.$blMethod.parseMoudleArray(_this,_this.groupDatas["CONTROLLER_INFO"]["CONTROLLER_MODULE"], selfControllerInfo);
                        _.forEach(CONTROLLER_INFO,function(value, key) {
                            if(key != "CONTROLER_NUM"){
                                CONTROLLER_INFO[key].FIELD_CONTROL = 2
                            }
                        })
                    }
                    //当收益人为本人  或者当收益人为本人且更改该了号码则提示  其余情况不提示
                    if(!_this.oppBusiData.isSyncBC && (_this.groupDatas.BENEFICIARY_INFO.BENEFICIARY_MODULE[0].FIELDS.BENEFICIARY_RELA.DEFAULT_VALUE == "0Z"
                    || (_this.groupDatas.CONTROLLER_INFO.CONTROLLER_MODULE[0].FIELDS.CONTROLER_RELATION.DEFAULT_VALUE == "0Z" 
                    && _this.oppBusiData.BASIC_INFO.MOBILE_TEL !=_this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.MOBILE_TEL.DEFAULT_VALUE))){
                        _this.messageBox({
                            hasMask:true,
                            messageText:'基本信息已同步到控制人和受益人信息',
                            confirmButtonText:'确认',
                            typeMessage:'success', 
                            showMsgBox:true ,
                            confirmedAction: function(){
                                _this.$router.goRoute("业务导航");
                            },
                        })
                        _this.oppBusiData.syncMobile = _this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.MOBILE_TEL.DEFAULT_VALUE;
                        _this.oppBusiData.syncAddress  = _this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.ADDRESS.DEFAULT_VALUE;
                        //同步一遍后面在这些信息修改后再进行同步 否则不进行同步
                        _this.oppBusiData.isSyncBC = true;
                        return false;
                    }
                }
                _this.$router.goRoute("业务导航");
                clearInterval(_this.oppBusiData.interTimer);
                _this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.VALIDATE_CODE.BUTTON_ENABLE = false;
                _this.$set(_this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.VALIDATE_CODE, 'FIELD_BUTTON_TXT', `发送验证码`);
                return false;
            }
        }
        return true;
    },
    /*
     *@Description: 上一步钩子
     *@Author: yangyp
     *@Date: 2019-07-09 11:13:33
     */
    custInfoPreValidate: function (_this) {
        clearInterval(_this.oppBusiData.interTimer);
        _this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.VALIDATE_CODE.BUTTON_ENABLE = false;
        _this.$set(_this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.VALIDATE_CODE, 'FIELD_BUTTON_TXT', `发送验证码`);
        _this.$router.goRoute("业务导航");
    },

    /*
     *@Description: 对比过滤去掉验证码
     *@Author: yangyp
     *@Date: 2019-07-11 15:34:40
     */
    updateChangedData: function (_this, changeDatas) {
        //去掉隐藏字段对比
        let creditType = changeDatas.CREDIT_TYPE_MODULE1;
        if(creditType){
            for(let md in creditType){
                for(let item in creditType[md]){
                    if(item == "items"){
						for(let fk in creditType[md][item]){
                        	for(let title in creditType[md][item][fk].FIELDS){
                            	if(creditType[md][item][fk].FIELDS[title].title == "诚信记录序号 : "){
									creditType[md][item][fk].FIELDS.splice(title, 1)
                                }
							}
						}
					}
                }
            }
        }
        //诚信记录只有一个显示逗号
        if (changeDatas.CREDIT_TYPE_MODULE1 &&
            changeDatas.CREDIT_TYPE_MODULE1[0].items &&
            changeDatas.CREDIT_TYPE_MODULE1[0].items.length &&
            changeDatas.CREDIT_TYPE_MODULE1[0].items[0].FIELDS &&
            changeDatas.CREDIT_TYPE_MODULE1[0].items[0].FIELDS.length) {
            for (let index = 0; index < changeDatas.CREDIT_TYPE_MODULE1[0].items[0].FIELDS.length; index++) {
                let item = changeDatas.CREDIT_TYPE_MODULE1[0].items[0].FIELDS[index];
                if (item.title === "不良诚信记录 : ") {
                    _.forEach(item.newVal, function (obj) {
                        if (obj == '，') {
                            obj = _this.groupDatas.CREDIT_TYPE_GROUP.CREDIT_TYPE_MODULE1[0].FIELDS.CREDIT_TYPE.DEFAULT_VALUE;
                            changeDatas.CREDIT_TYPE_MODULE1[0].items[0].FIELDS[index].newVal = [dict.getSysDict("CREDIT_TYPE", _this.groupDatas.CREDIT_TYPE_GROUP.CREDIT_TYPE_MODULE1[0].FIELDS.CREDIT_TYPE.DEFAULT_VALUE)];
                            return false;
                        }
                    });
                    break;
                }
            }
        }
        if (changeDatas.CUST_LINK_INFO &&
            changeDatas.CUST_LINK_INFO[0].items &&
            changeDatas.CUST_LINK_INFO[0].items.length &&
            changeDatas.CUST_LINK_INFO[0].items[0].FIELDS &&
            changeDatas.CUST_LINK_INFO[0].items[0].FIELDS.length) {
            for (let index = 0; index < changeDatas.CUST_LINK_INFO[0].items[0].FIELDS.length; index++) {
                let item = changeDatas.CUST_LINK_INFO[0].items[0].FIELDS[index];
                if (item.title === "验证码 : ") {
                    changeDatas.CUST_LINK_INFO[0].items[0].FIELDS.splice(index, 1);
                    break;
                }
            }
            if (changeDatas.CUST_LINK_INFO[0].items[0].FIELDS.length == 0) {
                delete changeDatas.CUST_LINK_INFO;
            }
        }
        if (_.isEmpty(changeDatas)) {
            _this.oppBusiData.isOnlyChangeValidateCode = true;
            _this.$router.goRoute("业务导航");
            throw "";
        }

    },
     /*
     *@Description: 通过主证件类型 控制 辅助证件类型得显示与否
     *@Author: ljc
     *@Date: 2019-10-17 15:34:40
     */
    updateFzIdInfo: function(_this, idType){
        //如果传入得证件类型 证件有效期 和 先前得证件类型一致  则证件号码 填为先前得证件号码 否则则置空
        if(idType == _this.oppBusiData.custAllInfo.BASIC_INFO.ID_TYPE){
            _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.ID_CODE.DEFAULT_VALUE = _this.oppBusiData.custAllInfo.BASIC_INFO.ID_CODE;
            _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.ID_EXP_DATE.DEFAULT_VALUE = _this.oppBusiData.custAllInfo.BASIC_INFO.ID_EXP_DATE;
        }else{
            _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.ID_CODE.DEFAULT_VALUE = "";
            _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.ID_EXP_DATE.DEFAULT_VALUE = "";
        }
        // 判断用户身份类型 （身份证、护照、港澳台）["0b", "0c", "0d", "0e", "0i", "0j", "0s"]
        if (_.indexOf(["0b", "0c", "0d", "0s"], idType) != -1) {
            _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.FZ_ID_TYPE.FIELD_CONTROL = "0"; // 1: 隐藏 0: 显示
            _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.FZ_ID_CODE.FIELD_CONTROL = "0";
            _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.FZ_ID_EXP_DATE.FIELD_CONTROL = "0";
        } else {
            _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.FZ_ID_TYPE.FIELD_CONTROL = "1"; // 1: 隐藏 0: 显示
            _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.FZ_ID_CODE.FIELD_CONTROL = "1";
            _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.FZ_ID_EXP_DATE.FIELD_CONTROL = "1";
        }
        //境内外标准设置  户口本 身份证 临时身份证 为境内  其他未境外
        if(_.indexOf(["00", "05", "08"], idType) != -1){
            _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.INOUTSIDE_IDENTITY.DEFAULT_VALUE = "0";
        }else{
            _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.INOUTSIDE_IDENTITY.DEFAULT_VALUE = "1";
        }
        if(_.indexOf(["0b","0c","0d",""]))
        switch (idType){
            //身份证 户口本 临时身份证 默认国籍为中国
            case "00":
            case "05":
            case "08":
                _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.CITIZENSHIP.FIELD_CONTROL = "2";
                _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.CITIZENSHIP.DEFAULT_VALUE = "CHN";
                break;
            case "01":
            case "09":
            case "0e":
                //国籍为可编辑 同时将其值置为空
                _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.CITIZENSHIP.FIELD_CONTROL = "0";
                _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.CITIZENSHIP.DEFAULT_VALUE = "";
                break;
            case "0b":
                //国籍设置为不可编辑，同时设置职位HKG  辅助证件类型为0s
                _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.CITIZENSHIP.FIELD_CONTROL = "2";
                _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.CITIZENSHIP.DEFAULT_VALUE = "HKG";
                _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.FZ_ID_TYPE.FIELD_DICT_FILTER = ["0s"];
                break;
            case "0i":
                _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.CITIZENSHIP.FIELD_CONTROL = "2";
                _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.CITIZENSHIP.DEFAULT_VALUE = "HKG";
                break;
            case "0c":
                //国籍设置为不可编辑，同时设置职位MAC  辅助证件类型为0s
                _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.CITIZENSHIP.FIELD_CONTROL = "2";
                _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.CITIZENSHIP.DEFAULT_VALUE = "MAC";
                _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.FZ_ID_TYPE.FIELD_DICT_FILTER = ["0s"];
                break;
            case "0j":
                _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.CITIZENSHIP.FIELD_CONTROL = "2";
                _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.CITIZENSHIP.DEFAULT_VALUE = "MAC";
                break;
            case "0d":
                //国籍设置为不可编辑，同时设置职位CTN  辅助证件类型为0s
                _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.CITIZENSHIP.FIELD_CONTROL = "2";
                _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.CITIZENSHIP.DEFAULT_VALUE = "CTN";
                _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.FZ_ID_TYPE.FIELD_DICT_FILTER = ["0s"];
                break;
            case "0s":
                //国籍设置为可编辑，字典包括 HKG  MAC CTN 辅助证件类型为0s
                _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.CITIZENSHIP.FIELD_CONTROL = "0";
                _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.CITIZENSHIP.FIELD_DICT_FILTER = ["HKG", "MAC", "CTN"];
                _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.CITIZENSHIP.DEFAULT_VALUE = "CTN";
                _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.FZ_ID_TYPE.FIELD_DICT_FILTER = ["0b", "0c", "0d"];
                break;
        }

    },
    //--------------------------------------------------检查逻辑--------------------------------------------------

    "CHECK_MOBILE_TEL": (_this, field, fieldData) => {
        if(field.DEFAULT_VALUE == _this.oppBusiData.custAllInfo.BASIC_INFO.MOBILE_TEL 
            && _this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.MOBILE_TEL.DEFAULT_VALUE.length == 11) {
            _this.oppBusiData.currentMobile = field.DEFAULT_VALUE
            _this.oppBusiData.IDENTIFY_CODE_CHECK_FLAG = true;
            _this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.VALIDATE_CODE.DEFAULT_VALUE = ""
        }
        if(field.DEFAULT_VALUE == _this.oppBusiData.currentMobile) {
            _this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.VALIDATE_CODE.FIELD_CONTROL = "2"
        }else {
            _this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.VALIDATE_CODE.FIELD_CONTROL = "0"
            _this.oppBusiData.IDENTIFY_CODE_CHECK_FLAG = false;
        }
    },
    /**
     * 地址组件点击使用证件地址
     */
    "USE_ID_ADDRESS__CLICK": (_this, field, fieldData) => {
        console.log('点击了与证件地址一致的按钮');
        if (_this.userType == "0") {
            if ("ID_ADDR" in _this.groupDatas["CUST_INFO"]["CUST_BASIC_INFO"][0].FIELDS) {
                field.DEFAULT_VALUE = _this.groupDatas["CUST_INFO"]["CUST_BASIC_INFO"][0].FIELDS["ID_ADDR"].DEFAULT_VALUE;
            }
            let addressTextInfo = parseAddress(_this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.ID_ADDR.DEFAULT_VALUE);
            field.addressInfo = addressTextInfo;
            // if (_this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.MAIL_ZIP_CODE && "addressInfo" in field) {
            //   _this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.MAIL_ZIP_CODE.DEFAULT_VALUE = field.addressInfo[3];
            // }
        }
    },
    /*
     *@method CHECK_MAIL_ADDR
     *@desc 地址组件触发函数 自动邮编填值
     *@MethodAuthor  yangyp
     *@Date: 2019-06-18 12:01:16
     */
    "CHECK_MAIL_ADDR": (_this, field, fieldData) => {
        if (field.DEFAULT_VALUE && fieldData.MAIL_ZIP_CODE && "addressInfo" in field) {
            if (field.addressInfo.length > 3 && stringConfig.isNotEmptyStr(field.addressInfo[3])) {
                fieldData.MAIL_ZIP_CODE.DEFAULT_VALUE = field.addressInfo[3];
                fieldData.MAIL_ZIP_CODE.correct = true;
            }
        }
    },
    "CHECK_VALIDATE_CODE": function (_this, field, fieldData) {
        if (field.DEFAULT_VALUE && field.correct) {
            let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
            //校验一下紧急联系人的电话和客户电话是否相同
            // if(field.DEFAULT_VALUE == customerInfo.MOBILE){
            //     field.correct = false;
            //     field.message = "紧急联系人手机号码不能与您的手机号码相同，请重新输入";
            //     return false;
            // }else{
            _this.removeFlowTip('mobile');
            if (field.DEFAULT_VALUE) {
                if (_this.oppBusiData.AUTH_ID) {
                    if (_this.oppBusiData.isTimeout60) {
                        return smsService.checkUpValidCode({
                            AUTH_ID: _this.oppBusiData.AUTH_ID,
                            AUTH_CODE: field.DEFAULT_VALUE,
                            MOBILE: fieldData.MOBILE_TEL.DEFAULT_VALUE
                        }).then(function (res) {
                            if (res.CHECK_FLAG && res.CHECK_FLAG == "1") {
                                _this.oppBusiData.IDENTIFY_CODE_CHECK_FLAG = true;
                                return '';
                            } else {
                                _this.oppBusiData.IDENTIFY_CODE_CHECK_FLAG = false;
                                field.message = '请输入正确的验证码'
                                return '请输入正确的验证码';
                            }
                        })
                    } else {
                        return new Promise((resolve) => {
                            resolve('请重新发送验证码')
                        })
                    }
                } else {
                    return new Promise((resolve) => {
                        resolve('请输入正确的验证码')
                    })
                }
            } else {
                return new Promise((resolve) => {
                    resolve('请输入验证码')
                })
            }
            // }
        } else if (field.DEFAULT_VALUE == '') {
            return new Promise((resolve) => {
                resolve('请输入验证码')
            })
        } else if (field.DEFAULT_VALUE != '') {
            return new Promise((resolve) => {
                resolve('请输入正确的验证码')
            })
        }
    },
    /*
     *@Description: 职业联动
     *@Author: yangyp
     *@Date: 2019-08-05 10:33:22
     */
    "CHECK_POSITION": (_this, field, fieldData) => {
        if (field.DEFAULT_VALUE && field.DEFAULT_VALUE != "4") {
            fieldData.WORKPLACE.FIELD_REQUIRED = "1";
            // if(stringConfig.isEmptyStr(fieldData.WORKPLACE.DEFAULT_VALUE)){
            //     fieldData.WORKPLACE.FIELD_REQUIRED = "1";
            // }
        } else {
            fieldData.WORKPLACE.FIELD_REQUIRED = "0";
        }
    },
    /*
     *@Description: 工作单位联动
     *@Author: yangyp
     *@Date: 2019-08-05 10:33:22
     */
    "CHECK_WORKPLACE": (_this, field, fieldData) => {
        if (field.DEFAULT_VALUE) {
            fieldData.POSITION.FIELD_REQUIRED = "1";
            // if(stringConfig.isEmptyStr(fieldData.POSITION.DEFAULT_VALUE)){
            //     fieldData.POSITION.FIELD_REQUIRED = "1";
            // }
        } else {
            fieldData.POSITION.FIELD_REQUIRED = "0";
        }
    },
   
    "CHECK_VALIDATE_CODE__CLICK": (_this, field, fieldData) => {
        let that = _this;
        if (fieldData.MOBILE_TEL.DEFAULT_VALUE && field.correct) {
            let userInfo = that.$storage.getJsonSession(that.$definecfg.USER_INFO),
                params = {
                    ORG_CODE: userInfo.ORG_CODE,
                    MOBILE: fieldData.MOBILE_TEL.DEFAULT_VALUE,
                    // AUTH_LENGTH:'验证码长度 默认6位  入参5=5位  入参4=4位',
                    // TPL_ID:'模板编号',
                    // REMARK:'备注信息',
                    EXP_SECS: 90 //有效期
                };
            that.myLoading('短信验证码发送中...');
            smsService.getSmsValidCode(params).then(function (resultObj) {
                if (resultObj && resultObj.SEND_FLAG == "1") {
                    //vue深层次响应理
                    that.myLoading({
                        sloadingText: '发送中。。。',
                        showLoading: false
                    });
                    that.messageBox({
                        hasMask: true,
                        messageText: "验证码已发送到：【" + params.MOBILE + "】，请注意查收！",
                        confirmButtonText: '确定',
                        typeMessage: '',
                        showMsgBox: true
                    });
                    that.$set(field, 'BUTTON_ENABLE', true);
                    let remainTime = parseInt(that.oppBusiData.busiCommonParams.MOBILE_VALID_TIME) || 60;
                    that.oppBusiData.interTimer = setInterval(function () {
                        remainTime--;
                        field.FIELD_BUTTON_TXT = `${remainTime}秒`;
                    }, 1000);
                    //发送验证码以后开始倒计时 设置标识 默认true
                    that.oppBusiData.isTimeout60 = true;
                    //将发送验证码的手机号码保存起来 当验证码通过后再修改手机号码时应该提示重新发送验证码
                    that.oppBusiData.currentMobile = fieldData.MOBILE_TEL.DEFAULT_VALUE;
                    setTimeout(() => {
                        that.oppBusiData.isTimeout60 = false;
                        field.BUTTON_ENABLE = false;
                        _this.$set(_this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.VALIDATE_CODE, 'FIELD_BUTTON_TXT', `发送验证码`);
                        clearInterval(that.oppBusiData.interTimer);
                    }, 90000)
                    that.oppBusiData.AUTH_ID = resultObj.AUTH_ID;
                } else {
                    that.messageBox({
                        hasMask: true,
                        messageText: "获取验证码失败！",
                        confirmButtonText: '确定',
                        typeMessage: '',
                        showMsgBox: true
                    });
                }
            });
        }
    },
    /** 
     * 地址组件点击使用证件地址
     */
    // "USE_ID_ADDRESS__CLICK": (_this, field, fieldData) => {
    //     console.log('点击了与证件地址一致的按钮');
    //     if (_this.userType == "0") {
    //         if ("ID_ADDR" in _this.groupDatas["CUST_INFO"]["CUST_BASIC_INFO"][0].FIELDS) {
    //             field.DEFAULT_VALUE = _this.groupDatas["CUST_INFO"]["CUST_BASIC_INFO"][0].FIELDS["ID_ADDR"].DEFAULT_VALUE;
    //         }
    //         let addressTextInfo = parseAddress(_this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.ID_ADDR.DEFAULT_VALUE);
    //         field.addressInfo = addressTextInfo;
    //         if (_this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.MAIL_ZIP_CODE && "addressInfo" in field) {
    //         if(stringConfig.isNotEmptyStr(field.addressInfo[3])){
    //             _this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.MAIL_ZIP_CODE.DEFAULT_VALUE = field.addressInfo[3];
    //         }
    //         }
    //     }
    // },
    /*
     *@method CHECK_MAIL_ADDR
     *@desc 地址组件触发函数 自动邮编填值
     *@MethodAuthor  yangyp
     *@Date: 2019-06-18 12:01:16
     */
    "USE_ID_ADDRESS": (_this, field, fieldData) => {
        if (field.DEFAULT_VALUE && fieldData.MAIL_ZIP_CODE && "addressInfo" in field) {
            if (field.addressInfo.length > 3 && stringConfig.isNotEmptyStr(field.addressInfo[3])) {
                fieldData.MAIL_ZIP_CODE.DEFAULT_VALUE = field.addressInfo[3];
                fieldData.MAIL_ZIP_CODE.FIELD_CONTROL = "2";
                fieldData.MAIL_ZIP_CODE.correct = true;
            } else {
                fieldData.MAIL_ZIP_CODE.FIELD_CONTROL = "0";
            }
        }
    },
    
    CHECK_ID_TYPE: function(_this, field, fieldData) {
        this.updateFzIdInfo(_this, field.DEFAULT_VALUE);
    },
    "CHECK_CREDIT_TYPE": (_this, field, fieldData) => {
        _this.groupDatas["CREDIT_TYPE_GROUP"]["CREDIT_TYPE_MODULE1"][0]["FIELDS"]["CREDIT_TYPE"]["isShowAllBtn"] = false;
        let creditType = field.DEFAULT_VALUE;
        if (!creditType || creditType == "") {
            fieldData.CREDIT_TYPE_EXP.FIELD_CONTROL = "1";
            return;
        }
        //如果同时选了无不良记录就不能选择其他的
        if (creditType.indexOf("00") != -1 && creditType.split(',').length > 1) {
            // _this.$blMethod.showMsgBox(_this,"不良诚信记录选择“无”后不能选择其他选项")
            if (creditType.split(',')[0] == "00") {
                field.DEFAULT_VALUE = creditType.split(',').splice(1).join(',');
            } else {
                _this.$blMethod.showMsgBox(_this, "不良诚信记录选择“无”后不能选择其他选项");
                field.DEFAULT_VALUE = creditType.split(',')[creditType.split(',').length - 1];
            }

        }
        //如果选了其他要显示输入框
        if (creditType.indexOf("99") != -1) {
            fieldData.CREDIT_TYPE_EXP.FIELD_CONTROL = "0";
            // fieldData.CREDIT_TYPE_EXP.DEFAULT_VALUE = ""
            fieldData.CREDIT_TYPE_EXP.FIELD_REQUIRED = "1"

        } else {
            fieldData.CREDIT_TYPE_EXP.FIELD_CONTROL = "1";
        }
    },
    "CHECK_ LINKMAN_MOBILE": (_this, field, fieldData) => {
        if (field.DEFAULT_VALUE == _this.oppBusiData.custAllInfo.BASIC_INFO.MOBILE_TEL) {
            _this.$blMethod.showMsgBox(_this, "其他联系人信息手机号码不能是本人留存的电话")


        }
    },
    /*
     * CHECK_INDUS_SUB#行业大类：
     */
    "CHECK_INDUS_GB": (_this, field, fieldData) => {
        var outINDUS_GB_SUBData = _.map(_.filter(fieldData["INDUS_GB_SUB"].FIELD_DICT_NAME, function (v) {
            if (field.DEFAULT_VALUE && v.DICT_ITEM) {
                return _.indexOf(field.DEFAULT_VALUE.charAt(0), v.DICT_ITEM.charAt(0)) != -1;
            }
        }), "DICT_ITEM");
        fieldData["INDUS_GB_SUB"].FIELD_DICT_FILTER = outINDUS_GB_SUBData;
    },
    /*
     * CHECK_INDUS_SUB#职业大类：
     */
    "CHECK_OCCU_GB": (_this, field, fieldData) => {
        var outOCCU_GB_SUBData = _.map(_.filter(fieldData["OCCU_GB_SUB"].FIELD_DICT_NAME, function (v) {
            if (field.DEFAULT_VALUE && v.DICT_ITEM) {
                return _.indexOf(field.DEFAULT_VALUE.charAt(0), v.DICT_ITEM.charAt(0)) != -1;
            }
        }), "DICT_ITEM");
        fieldData["OCCU_GB_SUB"].FIELD_DICT_FILTER = outOCCU_GB_SUBData;
    },

    "addModule": (_this, moduleId, fieldData) => {
        console.log("点击添加按钮")
        if (moduleId == "CUST_OTHER_LINK_INFO") {
            if (_this.groupDatas.RELA_INFO.CUST_OTHER_LINK_INFO[0].FIELDS.LINKMAN_MOBILE_TEL.DEFAULT_VALUE == "" &&
                _this.groupDatas.RELA_INFO.CUST_OTHER_LINK_INFO[0].FIELDS.LINKMAN_NAME.DEFAULT_VALUE == "") {
                //其他联系人信息手机号码一项为空
                return true;
            }
        }
        console.log(moduleId)

        return true;
    },
  

    // 客户资料变更是否需要同步基金账户
    "isSyncFundInfo": (_this) => {
        let hasFundsData = _this.oppBusiData.hasFundsData;
        return hasFundsData.length == 0 ? false : true;
    },

    // 客户资料变更是否需要同步银行
    "isSyncBankInfo": (_this) => {
        //客户只有外币银证账户时，适当信息节点，信息同步模块中的勾选银行，当未勾选银行，应不勾选同步银行
        var bankSignData = _.find(_this.oppBusiData.BANKSIGN_INFO, function (v) {
            return v.CURRENCY == "0";
        }) || "";
        //只有外币银行数据时，银行勾选需求取消。
        if (_.isEmpty(bankSignData)) {
            return false;
        } else {
            return true;
        }
    },
}
