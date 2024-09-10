/*
 *   个人基本信息模块
 *   方法封装
 *   @author  yangyp
 */

import date from '../../../../../../../tools/date.js'
import * as util from "../../../../../../../tools/util"
import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../../business/businessTools/bizPublicMethod.js"
import custInfoModel from "../../common/cust-info-model"
import csdsSerivce from "../../../../../../../service/csdc-service"
import oppService  from '../../../../../../../service/opp-service'
import custService from '../../../../../../../service/cust-service.js'
import validateRules from "../../../../../../../components/preEntry/validateRules.js"
import stringConfig from '../../../../../../../tools/stringConfig.js'
import csdcService from '../../../../../../../service/csdc-service'


//开户与非开户 获取机构代码跟机构名称
const getOrgCodeAndOrgName = (_this) => {
    let isOpenAcct = _this.$storage.getSession(_this.$definecfg.IS_OPEN_ACCT_BIZ) || "";
    let userInfo = _this.$storage.getJsonSession(_this.$definecfg.USER_INFO);
    let obj = {
        ORG_CODE: userInfo.ORG_CODE || userInfo.INT_ORG,
        ORG_NAME: userInfo.ORG_NAME
    }
    if (isOpenAcct == "0") {
        let OPEN_ORG_INFO = _this.$storage.getJsonSession(_this.$definecfg.OPEN_ORG_INFO) || {};
        obj.ORG_CODE = OPEN_ORG_INFO.ORG_CODE || "";
        obj.ORG_NAME = OPEN_ORG_INFO.ORG_NAME || "";
    }
    return obj;
}
//需要展示辅助证件的类型
const showFzTypeArr = ["0b", "0c", "0d", "0s"];
const changeFzRequired = function (_this, requiredFlag) {
    let fields = _this.groupDatas.CUST_INFO.CUST_FZCARD_INFO[0].FIELDS;
    let flag = requiredFlag ? "1" : "0";
    fields.FZ_ID_TYPE.FIELD_REQUIRED = flag;
    fields.FZ_ID_CODE.FIELD_REQUIRED = flag;
}

const changeFzIdInfoShow = function (_this) {
    let CUST_FZCARD_INFO = _this.groupDatas.CUST_INFO.CUST_FZCARD_INFO[0].FIELDS;
    let CUST_CARD_INFO = _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].FIELDS;
    // 开户业务只有证件类型为“港澳台居住证”时才展示辅助证件
    let busiDefInfo = _this.$storage.getJsonSession(_this.$definecfg.BUSI_DEF_INFO) || {};
    let showFzTypeArrTpl = _.cloneDeep(showFzTypeArr);
    if (busiDefInfo.BUSI_CODE == "V0052") {
        showFzTypeArrTpl = ["0s"];
    }
    if (_.indexOf(showFzTypeArrTpl, CUST_CARD_INFO.ID_TYPE.DEFAULT_VALUE) > -1) {
        _this.groupDatas.CUST_INFO.CUST_FZCARD_INFO[0].MODULE_CONTROL = "1";
        CUST_FZCARD_INFO.FZ_ID_TYPE.FIELD_CONTROL = "0";
        CUST_FZCARD_INFO.FZ_ID_CODE.FIELD_CONTROL = "0";
        CUST_FZCARD_INFO.FZ_ID_EXP_DATE.FIELD_CONTROL = "0";
        if (_.indexOf(["0b", "0c", "0d"], CUST_CARD_INFO.ID_TYPE.DEFAULT_VALUE) > -1) {
            changeFzRequired(_this, false);
        } else {
            changeFzRequired(_this, true);
        }
    } else {
        _this.groupDatas.CUST_INFO.CUST_FZCARD_INFO[0].MODULE_CONTROL = "0";
        CUST_FZCARD_INFO.FZ_ID_TYPE.DEFAULT_VALUE = ""
        CUST_FZCARD_INFO.FZ_ID_TYPE.FIELD_CONTROL = "1";
        CUST_FZCARD_INFO.FZ_ID_CODE.DEFAULT_VALUE = "";
        CUST_FZCARD_INFO.FZ_ID_CODE.FIELD_CONTROL = "1";
        CUST_FZCARD_INFO.FZ_ID_EXP_DATE.DEFAULT_VALUE = "";
        CUST_FZCARD_INFO.FZ_ID_EXP_DATE.FIELD_CONTROL = "1";
    }
}

// 历史数据加载公共
const bizCustBasicInfoNodeBeforeLoadBizCommon = function (_this) {
    let CUST_CARD_INFO = _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].FIELDS || {}
    let CUST_EXPERIENCE_INFO = _this.groupDatas.CUST_INFO.CUST_EXPERIENCE_INFO[0].FIELDS || {}

    //证件有效日期开始日期不能大于今天
    setFieldsAtt(_this, CUST_CARD_INFO, "ID_BEG_DATE", "VALID_TYPE", "begin")
    //生日日期不能大于今天
    setFieldsAtt(_this, CUST_CARD_INFO, "BIRTHDAY", "VALID_TYPE", "birthday")

    //字段校验
    setFieldsAtt(_this, CUST_CARD_INFO, "ID_BEG_DATE", "FIELD_FUNCTION", "CHECK_ID_BEG_DATE")
    setFieldsAtt(_this, CUST_CARD_INFO, "CUST_FNAME", "changeMessage", "客户全称长度必须大于等于2个汉字或4个英文字符，长度为4~256个英文字符");
    setFieldsAtt(_this, CUST_CARD_INFO, "CUST_NAME", "changeMessage", "客户简称长度必须大于等于2个汉字或4个英文字符，长度为4~16个英文字符");
    setFieldsAtt(_this, CUST_EXPERIENCE_INFO, "VOCATION_CONFORM_SELECT", "textField", "DICT_ITEM_NAME");
    //设置职务联动有误时，增加对应的提示 yangyp
    let fieldDictName =  [
        {
          DICT_CODE: "VOCATION_CONFORM_SELECT",
          DICT_ITEM: "1",
          DICT_ITEM_NAME: "本人已确认，该职业为真实职业",
          DICT_ORD: "0",
          ORG_CODE: "0000",
        },
      ]
      setFieldsAtt(_this, CUST_EXPERIENCE_INFO, "VOCATION_CONFORM_SELECT", "FIELD_DICT_NAME", fieldDictName)
    

    //职业使用模式公参getJsonSessionSysCommParam
    /**
     * 职业的使用模式 PROFESSION_MODE
     * 0-只显示职业类型；
     * 1-只显示职业；
     * 2-同时显示职业、职业类型，且职业与职业类型之间联动；
     */
    _this.oppBusiData.PROFESSION_MODE = _this.$blMethod.getJsonSessionSysCommParam(_this, "VTM_PROFESSION_MODE") || "0";
    //行业大类、子类
    _this.oppBusiData.SHOW_INDUS_GB_FIELDS = _this.$blMethod.getJsonSessionBusiCommParam(_this, "SHOW_INDUS_GB_FIELDS") || "0";
    //职业大类、子类
    _this.oppBusiData.SHOW_OCCU_GB_FIELDS = _this.$blMethod.getJsonSessionBusiCommParam(_this, "SHOW_OCCU_GB_FIELDS") || "0";
    // 境外信息核查是否显示04人像比对选项
    _this.oppBusiData.IS_SHOW_FOREIGN_CHECK_PHOTO = _this.$blMethod.getJsonSessionBusiCommParam(_this, "IS_SHOW_FOREIGN_CHECK_PHOTO") || "0";
    // 是否强制校验 出入境证件信息未核查或核查不通过，禁止继续提交业务
    _this.oppBusiData.IS_NEED_FOREIGN_CHINESE = _this.$blMethod.getJsonSessionBusiCommParam(_this, "IS_NEED_FOREIGN_CHINESE") || "0";

     //是否显示职业以及职业类型
    /**
     * 职业的使用模式 PROFESSION_MODE
     * 0-只显示职业类型；
     * 1-只显示职业；
     * 2-同时显示职业、职业类型，且职业与职业类型之间联动；
     */
    setFieldsAtt(_this, CUST_EXPERIENCE_INFO, "OCCU_TYPE", "FIELD_CONTROL", "1")
    setFieldsAtt(_this, CUST_EXPERIENCE_INFO, "VOCATION", "FIELD_CONTROL", "1")
    if (_this.oppBusiData.PROFESSION_MODE == "0" || _this.oppBusiData.PROFESSION_MODE == "2") {
        setFieldsAtt(_this, CUST_EXPERIENCE_INFO, "OCCU_TYPE", "FIELD_CONTROL", "0")
    }
    if (_this.oppBusiData.PROFESSION_MODE == "1" || _this.oppBusiData.PROFESSION_MODE == "2") {
        setFieldsAtt(_this, CUST_EXPERIENCE_INFO, "VOCATION", "FIELD_CONTROL", "0")
    }
    //行业大类、子类
    setFieldsAtt(_this, CUST_EXPERIENCE_INFO, "INDUS_GB", "FIELD_CONTROL", "1")
    setFieldsAtt(_this, CUST_EXPERIENCE_INFO, "INDUS_GB_SUB", "FIELD_CONTROL", "1")
    if (_this.oppBusiData.SHOW_INDUS_GB_FIELDS == "1") {
        setFieldsAtt(_this, CUST_EXPERIENCE_INFO, "INDUS_GB", "FIELD_CONTROL", "0")
        setFieldsAtt(_this, CUST_EXPERIENCE_INFO, "INDUS_GB_SUB", "FIELD_CONTROL", "0")
    }
    //职业大类、子类
    setFieldsAtt(_this, CUST_EXPERIENCE_INFO, "OCCU_GB", "FIELD_CONTROL", "1")
    setFieldsAtt(_this, CUST_EXPERIENCE_INFO, "OCCU_GB_SUB", "FIELD_CONTROL", "1")
    if (_this.oppBusiData.SHOW_OCCU_GB_FIELDS == "1") {
        setFieldsAtt(_this, CUST_EXPERIENCE_INFO, "OCCU_GB", "FIELD_CONTROL", "0")
        setFieldsAtt(_this, CUST_EXPERIENCE_INFO, "OCCU_GB_SUB", "FIELD_CONTROL", "0")
    }
    let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
    // 0-不显示，1-显示公安联网校验，2-显示中登校验，3-都显示
    _this.oppBusiData.CUST_INFO_VALID_TYPE = _this.$blMethod.getJsonSessionBusiCommParam(_this, "CUST_INFO_VALID_TYPE") || "2";
    
    let ID_TYPE = customerInfo.ID_TYPE;
    if (ID_TYPE == "08") {
        // 如果证件类型为临时身份证时，证件有效结束日期默认置灰
        setFieldsAtt(_this, CUST_CARD_INFO, "ID_EXP_DATE", "FIELD_CONTROL", "2")
    }
    return Promise.all([
        _this.$blMethod.getBusiAcctOpenLogic(_this, { USER_TYPE: customerInfo.USER_TYPE || "0"}),
    ]).then(([allAcctOpenLogicData]) => {
        _this.oppBusiData.allAcctOpenLogicData = allAcctOpenLogicData;
    })
}
//银证信息
const getCustBankSignInfo = (_this) => {
    let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
    return custService.getCustBankSignInfo(customerInfo.CUST_CODE).then( res => {
        let bankArr = _.get(res, "Data", []);
        if (bankArr.length != 0) {
            let resArr = [];
            _.each(bankArr, item => {
                resArr.push(_this.$syscfg.K_Request("Y3000015", {
                    CURRENCY: item.CURRENCY,
                    EXT_ORG: item.EXT_ORG,
                    INT_ORG: getOrgCodeAndOrgName(_this).ORG_CODE,
                    CUBSB_TRD_ID: "1B", //券商发起，客户资料同步
                    USER_TYPE: "0"
                }))
            })
            return Promise.all(resArr).then( (res2) => {
                _.each(res2, res2Item => {
                    let filterRes = _.filter(_.get(res2Item, "Data", []), item => {
                        return item.CUBSB_TRD_ID == "1B" && item.USER_TYPES.indexOf("0") > -1;
                    })
                    if (_.isEmpty(filterRes)) {
                        _this.oppBusiData.isBankTip = true;//是否需要提醒银行
                        return false;
                    }
                })
            })
        }
    }).catch(err => {
        console.error("getCustBankSignInfo err=",err.toString());
    })
}
//获取历史数据
const oldCustBasicInfo = (_this) => {
    let info = custInfoModel.getOriginaCustBasicInfo(_this.oppBusiData.oldBusiData);
    //如果证件类型为不需要展示辅助证件的类型 则 置空辅助证件类型
    if (showFzTypeArr.indexOf(info.ID_TYPE) == -1) {
        info.FZ_ID_CODE = "";
        info.FZ_ID_EXP_DATE = "";
        info.FZ_ID_TYPE = "";
    }
    let amlRemark = info.AML_REMARK || "";
    if (amlRemark.indexOf("1") > -1) {
        info.VOCATION_CONFORM_SELECT = "1";
    }
    //职业认证
    let OCCU_CHK_FLAG = _.get(_this.oppBusiData, "oldBusiData.CUST_BASIC_INFO.OCCU_CHK_FLAG", "") || "0";
    if (OCCU_CHK_FLAG == "0") {
        info.OCCU_TYPE = "";
    }
    return info;
}
// 获取灰、黑名单国籍信息
const getGrayBlackInfo = (_this, nationCode) => {
    return _this.$syscfg.K_Request("W0000001", {
        YGT_SERVICE_CODE: 'QS000018',
        NATIONCODE: nationCode
    }).then(res => {
        return _.get(res, "Data[0]", {})
    })
}
// 根据辅助证件类 查询是否中登开过一码通，开过则不让进行再开
const getFzYmtData = (_this, custFname, idType, idCode) => {
    return csdcService.getCSDCYmtData(custFname, idType, idCode).then(res => {
        let normaleYmtArr = _.filter(res, item => {
            return item.YMT_STATUS === "0"
        }) || [];
        // 中登有正常一码通账户
        if (normaleYmtArr.length) {
            return true;
        }
        // 无正常一码通账户
        return false;
    })
}
//关联关系确认
const getRelationFlag = (_this) => {
    let relationFlag = true;
    let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
    return _this.$syscfg.K_Request("YG003674", {
        CUST_FNAME: customerInfo.CUST_FNAME,
        ID_TYPE: customerInfo.ID_TYPE,
        ID_CODE: customerInfo.ID_CODE,
        ACCTBIZ_EXCODE: "07",
    }).then( res => {
        let acctList = _.get(res, "Data", []);
        let filterType = ["11", "12", "13", "21", "22", "23"];                
        _.each(acctList, acctListItem => {
            let relatFlag = acctListItem.RELATION_FLAG;
            let acctType = acctListItem.ACCT_TYPE;
            let status = acctListItem.ACCT_STATUS;
            let unqualiFlag = acctListItem.UNQUALI_FLAG;
            //(0)去掉已确认的(1)过滤交易账户类型的，(2)证券账户状态不为注销、休眠,(3)过滤掉不合格账户
            if (relatFlag != "1" && filterType.indexOf(acctType) > -1 && ["4", "9"].indexOf(status) == -1 && unqualiFlag == "0") {
                let range1 = /^F97[\w]+$/;  //基金的配号为F97XXXXXXX.
                let range2 = /^F[5-9]{1}[\w]+$/;//基金配号的区间F500000000-F999999999
                let range3 = /(^05[\w]+$)|(^001[6-9]{1}[\w]+$)|(^04[\w]+$)/;//基金配号05xxxxxxxx 001[6-9]xxxxxx 增加 04xxxxxxxx段配号账户不需要做关联关系确认
                let range4 = /(^F[5-9]{1}[\w]+$)|(^F0[\w]+$)/;  //广州证券个性专用：基金的配号为F97XXXXXXX.F0XXXXXX开头
                let trdAcct = acctListItem.TRDACCT;
                if(acctType == "13"){//沪市
                    if(!range2.test(trdAcct) || range1.test(trdAcct)){
                        relationFlag = false;
                        return false;
                    }
                    return true;
                }
                if(acctType == "23"){//深市
                    let interval = [
                        [10100000, 10834330],
                        [10834332, 10999999],
                        [13100000, 13880784],
                        [13880786, 13999999],
                        [14000000, 14716490],
                        [14716492, 14999999],
                        [16000000, 19999999]];
                    let matchFlag = false;
                    if(range3.test(trdAcct)){
                        matchFlag = true;
                    }
                    if(trdAcct.startsWith("001")){
                        let end8 = Number(String(trdAcct).substring(2));
                        _.each(interval, intervalItem => {
                            if (end8 >= intervalItem[0] && end8 <= intervalItem[1]) {
                                matchFlag = true;
                            }
                        })
                    }
                    if(!matchFlag){
                        relationFlag = false;
                        return false;
                    }
                    return true;
                }
                relationFlag = false;
                return false;
            }
        })
        _this.oppBusiData.parentRelationFlag = relationFlag;
        return relationFlag;
    }).catch( err => {
        throw err;
    })
}
const check0SInfoChange = function(_this) {
    let baseFieldData = _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].FIELDS;
    let newData = {
        CUST_FNAME: baseFieldData.CUST_FNAME.DEFAULT_VALUE,
        ID_CODE: baseFieldData.ID_CODE.DEFAULT_VALUE,
        ID_TYPE: baseFieldData.ID_TYPE.DEFAULT_VALUE,
    }
    if (_.isEmpty(_this.oppBusiData.PHOTO_CHECK_RESULT)) {
        return true;
    }
    if (_this.oppBusiData.PHOTO_CHECK_RESULT.CUST_FNAME) {
        if (_this.oppBusiData.PHOTO_CHECK_RESULT.CUST_FNAME != newData.CUST_FNAME
            || _this.oppBusiData.PHOTO_CHECK_RESULT.ID_CODE != newData.ID_CODE 
            || _this.oppBusiData.PHOTO_CHECK_RESULT.ID_TYPE != newData.ID_TYPE) {
            return true;
        }
    }
    return false;
}
//客户证件属于出入境证件类型，且已做过出入境证件核查，需要对比信息是否变动
const checkCustInfoChange = function (_this) {
    let baseFieldData = _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].FIELDS,
        experienceFieldData = _this.groupDatas.CUST_INFO.CUST_EXPERIENCE_INFO[0].FIELDS;

    let newData = {
        BIRTHDAY: baseFieldData.BIRTHDAY.DEFAULT_VALUE,
        CUST_FNAME: baseFieldData.CUST_FNAME.DEFAULT_VALUE,
        ID_CODE: baseFieldData.ID_CODE.DEFAULT_VALUE,
        ID_TYPE: baseFieldData.ID_TYPE.DEFAULT_VALUE,
        SEX: baseFieldData.SEX.DEFAULT_VALUE,
        ID_EXP_DATE: baseFieldData.ID_EXP_DATE.DEFAULT_VALUE,
        CITIZENSHIP: experienceFieldData.CITIZENSHIP.DEFAULT_VALUE,
    }

    let isNeedForeignChinese = true,
        FOREIGN_CHINESE_ACCTBIZ_CLS = _this.oppBusiData.FOREIGN_CHINESE_CHECK_RESULT.ACCTBIZ_CLS || _.get(_this.historyData, "CUST_INFO.CUST_BASIC_INFO.FOREIGN_CHINESE_ACCTBIZ_CLS", ""),
        oldCustBasicInfo = _this.oppBusiData.FOREIGN_CHINESE_CHECK_RESULT || _.get(_this.historyData, "CUST_INFO.CUST_BASIC_INFO.FOREIGN_CHINESE_CHECK_RESULT", "");

        if (!_.isEmpty(FOREIGN_CHINESE_ACCTBIZ_CLS)) {
            if (
                // 核查类型01：主要身份证明文件类别 + 主要身份证明文件代码 + 国籍/地区代码 + 客户名称
                (FOREIGN_CHINESE_ACCTBIZ_CLS === "01"
                && newData.ID_TYPE === oldCustBasicInfo.ID_TYPE
                && newData.ID_CODE === oldCustBasicInfo.ID_CODE
                && newData.CITIZENSHIP === oldCustBasicInfo.CITIZENSHIP
                && (newData.CUST_FNAME || newData.USER_FNAME) === oldCustBasicInfo.CUST_FNAME)
                // 核查类型02：主要身份证明文件类别 + 主要身份证明文件代码 + 国籍/地区代码+ 出生日期
                || (FOREIGN_CHINESE_ACCTBIZ_CLS === "02"
                && newData.ID_TYPE === oldCustBasicInfo.ID_TYPE
                && newData.ID_CODE === oldCustBasicInfo.ID_CODE
                && newData.CITIZENSHIP === oldCustBasicInfo.CITIZENSHIP
                && newData.BIRTHDAY === oldCustBasicInfo.BIRTHDAY)
                // 核查类型03：主要身份证明文件类别 + 主要身份证明文件代码 + 国籍/地区代码 + 主要身份证明文件截止日期 + 客户名称 + 出生日期 + 性别
                || (FOREIGN_CHINESE_ACCTBIZ_CLS === "03"
                && newData.ID_TYPE === oldCustBasicInfo.ID_TYPE
                && newData.ID_CODE === oldCustBasicInfo.ID_CODE
                && newData.CITIZENSHIP === oldCustBasicInfo.CITIZENSHIP
                && newData.ID_EXP_DATE === oldCustBasicInfo.ID_EXP_DATE
                && (newData.CUST_FNAME || newData.USER_FNAME) === oldCustBasicInfo.CUST_FNAME
                && newData.BIRTHDAY === oldCustBasicInfo.BIRTHDAY
                && newData.SEX === oldCustBasicInfo.SEX)
                // 核查类型04：不展示直接通过，展示比较主要身份证明文件类别 + 主要身份证明文件代码 + 国籍/地区代码 + 主要身份证明文件截止日期 + 客户名称 + 出生日期 + 性别
                || (FOREIGN_CHINESE_ACCTBIZ_CLS === "04"
                && newData.ID_TYPE === oldCustBasicInfo.ID_TYPE
                && newData.ID_CODE === oldCustBasicInfo.ID_CODE
                && newData.CITIZENSHIP === oldCustBasicInfo.CITIZENSHIP
                && newData.ID_EXP_DATE === oldCustBasicInfo.ID_EXP_DATE
                && (newData.CUST_FNAME || newData.USER_FNAME) === oldCustBasicInfo.CUST_FNAME
                && newData.BIRTHDAY === oldCustBasicInfo.BIRTHDAY
                && newData.SEX === oldCustBasicInfo.SEX)
            ) {
                // 被核查过的字段，没变更，不需要重新核查
                isNeedForeignChinese = false;
            } else {
                checkChangeField(_this, newData, oldCustBasicInfo, FOREIGN_CHINESE_ACCTBIZ_CLS);
            }
        }
        return isNeedForeignChinese;
}
//出入境证件信息核查，变更字段
const checkChangeField = function (_this, newCustBasicInfo, oldCustBasicInfo, acctBizCls) {
    var that = this,
        defaultField = {
            "ID_TYPE" : "证件类型",
            "ID_CODE" : "证件代码",
            "CITIZENSHIP" : "国籍/地区代码",
            "CUST_FNAME" : "客户名称",
            "BIRTHDAY" : "出生日期",
            "ID_EXP_DATE" : "证件有效期",
            "SEX" : "性别"
        };
    //如果新旧信息发生变动，则将变动字段保存在该字段中，给提示使用
    _this.oppBusiData.foreignChineseChangeField = [];
    _.extend(newCustBasicInfo, {CUST_FNAME: newCustBasicInfo.CUST_FNAME || newCustBasicInfo.USER_FNAME});
    var tempNewBasic = {}, tempOldBasic = {};
    if (acctBizCls === "01") {
        tempNewBasic = _.pick(newCustBasicInfo, "ID_TYPE", "ID_CODE", "CITIZENSHIP", "CUST_FNAME");
        tempOldBasic = _.pick(oldCustBasicInfo, "ID_TYPE", "ID_CODE", "CITIZENSHIP", "CUST_FNAME");
    }
    if (acctBizCls === "02") {
        tempNewBasic = _.pick(newCustBasicInfo, "ID_TYPE", "ID_CODE", "CITIZENSHIP", "BIRTHDAY");
        tempOldBasic = _.pick(oldCustBasicInfo, "ID_TYPE", "ID_CODE", "CITIZENSHIP", "BIRTHDAY");
    }
    if (acctBizCls === "03") {
        tempNewBasic = _.pick(newCustBasicInfo, "ID_TYPE", "ID_CODE", "CITIZENSHIP", "ID_EXP_DATE", "CUST_FNAME", "BIRTHDAY", "SEX");
        tempOldBasic = _.pick(oldCustBasicInfo, "ID_TYPE", "ID_CODE", "CITIZENSHIP", "ID_EXP_DATE", "CUST_FNAME", "BIRTHDAY", "SEX");
    }
    //选项展示时处理数据
    if (_this.oppBusiData.IS_SHOW_FOREIGN_CHECK_PHOTO === '1' && acctBizCls === "04") {
        tempNewBasic = _.pick(newCustBasicInfo, "ID_TYPE", "ID_CODE", "CITIZENSHIP", "ID_EXP_DATE", "CUST_FNAME", "BIRTHDAY", "SEX");
        tempOldBasic = _.pick(oldCustBasicInfo, "ID_TYPE", "ID_CODE", "CITIZENSHIP", "ID_EXP_DATE", "CUST_FNAME", "BIRTHDAY", "SEX");
    }
    _.each(tempNewBasic, function (val, key) {
        if (val != tempOldBasic[key]) {
            _this.oppBusiData.foreignChineseChangeField.push(defaultField[key]);
        }
    });
}

export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizCustBasicInfoNodeBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizCustBasicInfoNodeBeforeLoadBiz: async function (_this) {
        return Promise.all([
            bizCustBasicInfoNodeBeforeLoadBizCommon(_this),
            getRelationFlag(_this),
            getCustBankSignInfo(_this),
        ]).then(() => {
            let custBasicInfo = oldCustBasicInfo(_this);
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["CUST_CARD_INFO"], custBasicInfo);
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["CUST_FZCARD_INFO"], custBasicInfo);
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["CUST_EXPERIENCE_INFO"], custBasicInfo);
            let CUST_EXPERIENCE_INFO = _this.groupDatas.CUST_INFO.CUST_EXPERIENCE_INFO[0].FIELDS || {}
            //反洗钱备注信息 职业备注信息 1-客户已确认，职业为客户真实职业
            let amlRemark = custBasicInfo.AML_REMARK || "";
            amlRemark.split(",")
            if (amlRemark.indexOf("1") > -1) {
                setFieldsAtt(_this, CUST_EXPERIENCE_INFO, "VOCATION_CONFORM_SELECT", "FIELD_CONTROL", "0");
                setFieldsAtt(_this, CUST_EXPERIENCE_INFO, "VOCATION_CONFORM", "FIELD_CONTROL", "0")
            }
            
        }).catch( err => {
            throw err;
        })

    },
    // 开户历史数据加载
    bizCustBasicInfoNodeBeforeLoadBizOpenAcct: function (_this) {
        let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
        let openObj = {};
        Object.assign(openObj,_this.oppBusiData.oldBusiData,customerInfo);
        return Promise.all([
            bizCustBasicInfoNodeBeforeLoadBizCommon(_this)
        ]).then(() => {
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["CUST_CARD_INFO"], openObj);
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["CUST_FZCARD_INFO"], openObj);
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["CUST_EXPERIENCE_INFO"], openObj);
            let openLogicObj = _this.$blMethod.loadOpenLogicData(_this, {
                ID_TYPE: openObj.ID_TYPE || "",
                SUBJECT_IDENTITY: "",
                INOUTSIDE_IDENTITY: "",
                OCCU_TYPE: "",
            })
            //过滤主体身份
            let CUST_EXPERIENCE_INFO = _this.groupDatas.CUST_INFO.CUST_EXPERIENCE_INFO[0].FIELDS || {};
            let CUST_CARD_INFO = _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].FIELDS || {};
            let SUBJECT_IDENTITY_DICT = _.cloneDeep(openLogicObj.SUBJECT_IDENTITY) || {};
            //过滤1-未成年 2-年长者 两者只能临柜开户
            SUBJECT_IDENTITY_DICT = _.difference(SUBJECT_IDENTITY_DICT, ["1"]);
            setFieldsAtt(_this, CUST_EXPERIENCE_INFO, "SUBJECT_IDENTITY", "FIELD_DICT_FILTER", SUBJECT_IDENTITY_DICT);
            let INOUTSIDE_IDENTITY_DICT = _.cloneDeep(openLogicObj.INOUTSIDE_IDENTITY) || {};
            setFieldsAtt(_this, CUST_CARD_INFO, "INOUTSIDE_IDENTITY", "DEFAULT_VALUE", INOUTSIDE_IDENTITY_DICT[0] || "0");
            //证件地址去除 非身份证和港澳台居住证的时候
            if (["00", "0s"].indexOf(openObj.ID_TYPE) == -1) {
                setFieldsAtt(_this, CUST_CARD_INFO, "ID_ADDR", "FIELD_CONTROL", "1");
            }
        })
    },
    /*
     *@method bizCustBasicInfoNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-13 09:42:56
     */
    bizCustBasicInfoNodeAfterLoadBiz: function (_this) {
        //重新解析历史数据
        if (_this.historyData && _this.historyData.CUST_INFO) {
            let basicInfo = _.get(_this.historyData, "CUST_INFO.CUST_BASIC_INFO", {});
            if (!_.isEmpty(basicInfo)) {
                bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["CUST_CARD_INFO"], basicInfo);
                bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["CUST_FZCARD_INFO"], basicInfo);
                bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["CUST_EXPERIENCE_INFO"], basicInfo);
            }
        }

        let CUST_CARD_INFO = _this.groupDatas["CUST_INFO"].CUST_CARD_INFO[0].FIELDS;
        let CUST_FZCARD_INFO = _this.groupDatas["CUST_INFO"].CUST_FZCARD_INFO[0].FIELDS;
        let CUST_EXPERIENCE_INFO = _this.groupDatas.CUST_INFO.CUST_EXPERIENCE_INFO[0].FIELDS || {};
        let ocrCardInfo = _this.$storage.getJsonSession(_this.$definecfg.OCR_CARD_INFO);
        if (!_.isEmpty(ocrCardInfo)) {
            _this.oppBusiData.IDCARD_READ_FLAG = "1";
            var nationItem = _.map(_.filter(CUST_CARD_INFO["NATIONALITY"].FIELD_DICT_NAME, function (v) {
                return _.indexOf(v.DICT_ITEM_NAME, ocrCardInfo.NATION) != -1;
            }), "DICT_ITEM");
            setFieldsAtt(_this, CUST_CARD_INFO, "ID_BEG_DATE", "DEFAULT_VALUE", ocrCardInfo.BEGIN_DATE || "")
            setFieldsAtt(_this, CUST_CARD_INFO, "ID_EXP_DATE", "DEFAULT_VALUE", ocrCardInfo.END_DATE || "")
            setFieldsAtt(_this, CUST_CARD_INFO, "ID_ADDR", "DEFAULT_VALUE", ocrCardInfo.ID_ADDR || "")
            setFieldsAtt(_this, CUST_CARD_INFO, "NATIONALITY", "DEFAULT_VALUE", nationItem && nationItem.length ? nationItem[0] : "")
            setFieldsAtt(_this, CUST_CARD_INFO, "ID_ISS_AGCY", "DEFAULT_VALUE", ocrCardInfo.ID_ISS_AGCY || "")
        }
        //过滤证件
        let idTypeFilterArr = _.cloneDeep(_this.oppBusiData.VALID_ID_TYPE_FOR_PERSON) || [];
        if (!_this.busiLogic.checkIdTypeInvaild(_this)) {
            let oldBasicInfo = oldCustBasicInfo(_this);
            if (oldBasicInfo.ID_TYPE) {
                idTypeFilterArr.push(oldBasicInfo.ID_TYPE);
            }
        }
        setFieldsAtt(_this, CUST_CARD_INFO, "ID_TYPE", "FIELD_DICT_FILTER", idTypeFilterArr);
        //证件类型是否在字典内 不在字典内则清空
        _this.$blMethod.isDictClean(CUST_CARD_INFO.ID_TYPE);
        
        setFieldsAtt(_this, CUST_CARD_INFO, "SEX", "FIELD_DICT_FILTER", "!2")
        
        //涉税信息模块处理
        taxInfoShowOrHide(_this);
    
	    setFZ_ID_TYPE(_this, true);
        checkVocationDetail(_this);
        changeFzIdInfoShow(_this);

        //对身份证进行升位
        if (!check15IdCode(_this)) {
            let idCode = _.cloneDeep(CUST_CARD_INFO.ID_CODE.DEFAULT_VALUE);
            CUST_CARD_INFO.ID_CODE.DEFAULT_VALUE  = utils.updateCardNo(_.cloneDeep(idCode));
        }
        //职业认证
        let OCCU_CHK_FLAG = _.get(_this.historyData, "CUST_INFO.CUST_BASIC_INFO.OCCU_CHK_FLAG", "") || _.get(_this.oppBusiData, "oldBusiData.CUST_BASIC_INFO.OCCU_CHK_FLAG", "") || "0";
        if (OCCU_CHK_FLAG == "0") {
            setFieldsAtt(_this, CUST_EXPERIENCE_INFO, "OCCU_TYPE", "DEFAULT_VALUE", "");
        }
        //生日性别处理
        checkBirthDayOrSex(_this);
        let isOpenAcct = _this.$storage.getSession(_this.$definecfg.IS_OPEN_ACCT_BIZ) || "";
        if (isOpenAcct == "0") {
            let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
            let openObj = {};
            Object.assign(openObj,_this.oppBusiData.oldBusiData, customerInfo);
            let openLogicObj = _this.$blMethod.loadOpenLogicData(_this, {
                ID_TYPE: openObj.ID_TYPE || "",
                SUBJECT_IDENTITY: openObj.SUBJECT_IDENTITY || "",
                INOUTSIDE_IDENTITY: openObj.INOUTSIDE_IDENTITY || "",
                OCCU_TYPE: openObj.OCCU_TYPE || "",
            })
            let INOUTSIDE_IDENTITY_DICT = _.cloneDeep(openLogicObj.INOUTSIDE_IDENTITY) || {};
            setFieldsAtt(_this, CUST_CARD_INFO, "INOUTSIDE_IDENTITY", "DEFAULT_VALUE", INOUTSIDE_IDENTITY_DICT[0] || "0");
            if (customerInfo.ID_TYPE == "06") {
                setFieldsAtt(_this, CUST_EXPERIENCE_INFO, "SUBJECT_IDENTITY", "DEFAULT_VALUE", "b");
                setFieldsAtt(_this, CUST_EXPERIENCE_INFO, "SUBJECT_IDENTITY", "FIELD_CONTROL", "2");
            }
        }
        //校验参数回填
        let POLICE_VALID_PASS_FLAG = _this.$storage.getJsonSession(_this.$definecfg.POLICE_VALID_PASS_FLAG) || '0';
        _this.oppBusiData.IDCARD_CHECK_FLAG = _.get(_this.historyData, "IDCARD_CHECK_FLAG", POLICE_VALID_PASS_FLAG);
        _this.oppBusiData.isNeedPoliceChecked = _.get(_this.historyData, "isNeedPoliceChecked", "0") == "1" ? true : false;
        // 能进行【出入境证件信息核查】的【证件类别】
        _this.oppBusiData.foreignChineseIdType = oppService.getSysCommonParamsFromCacheObjs('FOREIGN_CHINESE_ID_TYPE')
        if (!_.isEmpty(_this.oppBusiData.foreignChineseIdType)) {
            _this.oppBusiData.foreignChineseIdType = _this.oppBusiData.foreignChineseIdType.split(',') || [];
        }
    },
    /*
     *@method bizCustBasicInfoNodeBeforeSave
     *@desc 钩子函数 自定义保存数
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizCustBasicInfoNodeBeforeSave: async function (_this, params) {
        let custCardInfo = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "CUST_CARD_INFO");
        let custFZCardInfo = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "CUST_FZCARD_INFO");
        let custExperienceInfo = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "CUST_EXPERIENCE_INFO");
        let custCardInfoFields = _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].FIELDS;
        let custFZCardInfoFields = _this.groupDatas.CUST_INFO.CUST_FZCARD_INFO[0].FIELDS;
        let custExperienceInfoFields = _this.groupDatas.CUST_INFO.CUST_EXPERIENCE_INFO[0].FIELDS;
        let custBasicInfo = {};
        Object.assign(custBasicInfo, custCardInfo, custFZCardInfo, custExperienceInfo);
        //如果不是基本信息模块 则不保存国籍 导致国籍 根据证件自动填写之后 没有进入基本信息 就已经保存 基本信息变为已修改
        let otherParams = {
            CUST_FNAME: custBasicInfo.CUST_FNAME,
            USER_FNAME: custBasicInfo.CUST_FNAME,
            CUST_NAME: custBasicInfo.CUST_NAME,
            USER_NAME: custBasicInfo.CUST_NAME,
            ID_TYPE: custBasicInfo.ID_TYPE,
            ID_CODE: custBasicInfo.ID_CODE,
            PROF_INVESTOR_SOURCE: "00",
            PROF_INVESTOR_TYPE: "0",
            AGE: custBasicInfo.BIRTHDAY && "" + date.getDifferYears(custBasicInfo.BIRTHDAY, date.getClientDate()) || "-1",
            SEX: custBasicInfo.SEX,
            BIRTHDAY: custBasicInfo.BIRTHDAY,
            EDUCATION: custBasicInfo.EDUCATION,
            VOCATION: custBasicInfo.VOCATION || "",
            OCCU_TYPE: custBasicInfo.OCCU_TYPE,
            ID_BEG_DATE: custBasicInfo.ID_BEG_DATE,
            ID_EXP_DATE: custBasicInfo.ID_EXP_DATE,
            ID_TYPE: custBasicInfo.ID_TYPE,
            ID_CODE: custBasicInfo.ID_CODE,
            CITIZENSHIP: custBasicInfo.CITIZENSHIP,
            //增加是否录入辅助证件标志，用于采集影像
            IS_INPUT_FZ_ID_TYPE: (!_.isEmpty(custBasicInfo.FZ_ID_TYPE) || !_.isEmpty(custBasicInfo.FZ_ID_CODE)) ? "1" : "0",
            //是否【通过中登公安联网校验】 1-校验通过 2-校验不通过 0-未校验
            IS_CSCD_POLICE_CHECKED_PASS: _this.oppBusiData.IDCARD_CHECK_FLAG == "1" || !_this.oppBusiData.isNeedPoliceChecked ? "1" : "0",
            IDCARD_CHECK_FLAG: _this.oppBusiData.IDCARD_CHECK_FLAG || "0",
            isNeedPoliceChecked: _this.oppBusiData.isNeedPoliceChecked ? "1" : "0",
            isGrayCitizenship: _this.oppBusiData.isGrayCitizenship === undefined ? (params.isGrayCitizenship || "0") : (_this.oppBusiData.isGrayCitizenship == "1" ? "1" : "0")
        }
        Object.assign(params, otherParams);
        custBasicInfo.AGE = otherParams.AGE;
        let busiData = _this.historyData || {};
        //如果是开户业务，这里的busiData = undefined
        let custInfo = busiData.CUST_INFO || {};
        if (!_.isEmpty(custBasicInfo.OCCU_TYPE)) {
            custBasicInfo.OCCU_CHK_FLAG = "1";
        }
        custInfo.CUST_BASIC_INFO = custBasicInfo;
        custInfo.CUST_OPEN_TEMPLATE = _this.oppBusiData.OPEN_TEMPLATE_DATA || {};

        if (_this.busiCode == "V0049" || _this.busiCode == "V0163") {
            let custBasicInfoOld = oldCustBasicInfo(_this);
            let OLD_SUBJECT_IDENTITY = custBasicInfoOld.SUBJECT_IDENTITY || "";
            let data1 = bizPublicMethod.$blMethod.compareInfo2(custBasicInfoOld, custBasicInfo, "AGE,VOCATION_CONFORM,VOCATION_CONFORM_SELECT");
            let fieldsAll = _.assign({}, custCardInfoFields, custFZCardInfoFields, custExperienceInfoFields);
            let CHANGE_FZ_FLAG = "0"
            data1 = _this.$blMethod.addDiffAtt(fieldsAll, data1);
            custInfo.CUST_BASIC_CHANGE_INFO = Object.assign({}, custBasicInfo, {
                DIFF_INFO: data1
            });
            !!_.find(data1, obj => obj.FIELD == 'CUST_NAME') && (data1 = _.concat([{
                FIELD:'USER_NAME',
                NEW:_.get(custBasicInfo,"CUST_NAME",""),
                OLD: custBasicInfoOld.CUST_NAME || "",
                FIELD_TITLE: "客户简称"
            }], data1))
            !!_.find(data1, obj => obj.FIELD == 'CUST_FNAME') && (data1 = _.concat([{
                FIELD:'USER_FNAME',
                NEW:_.get(custBasicInfo, "CUST_FNAME",""),
                OLD: custBasicInfoOld.CUST_FNAME || "",
                FIELD_TITLE: "客户姓名"
            }], data1))

            //资料修改主体身份根据年龄变化
            //由未成年变为普通，普通变为年长者，空值变为未成年，空值变为年长者
            custBasicInfo.SUBJECT_IDENTITY = OLD_SUBJECT_IDENTITY;
            if (custBasicInfo.AGE < 18 && !OLD_SUBJECT_IDENTITY) {
                custBasicInfo.SUBJECT_IDENTITY = "1";
            }
            if (custBasicInfo.AGE >= 18 && custBasicInfo.AGE < 70 && (OLD_SUBJECT_IDENTITY == "1")) {
                custBasicInfo.SUBJECT_IDENTITY = "0";
            }
            if (custBasicInfo.AGE >= 70 && (!OLD_SUBJECT_IDENTITY || OLD_SUBJECT_IDENTITY == "0")) {
                custBasicInfo.SUBJECT_IDENTITY = "2";
            }
            if (custBasicInfo.SUBJECT_IDENTITY != OLD_SUBJECT_IDENTITY) {
                let SUBJECT_IDENTITY_DICTS = _.get(_this.oppBusiData, "dictAll.SUBJECT_IDENTITY", []);
                data1.push({
                    FIELD_TITLE: "主体身份",
                    FIELD: 'SUBJECT_IDENTITY',
                    NEW: custBasicInfo.SUBJECT_IDENTITY || "",
                    NEW_TEXT: getDictItemName( SUBJECT_IDENTITY_DICTS, custBasicInfo.SUBJECT_IDENTITY || "" ),
                    OLD: OLD_SUBJECT_IDENTITY || "",
                    OLD_TEXT: getDictItemName( SUBJECT_IDENTITY_DICTS, OLD_SUBJECT_IDENTITY)
                })
            }
            //境内外标识
            let OLD_INOUTSIDE_IDENTITY = _.cloneDeep(custBasicInfoOld.INOUTSIDE_IDENTITY) || "";
            let loadOpenLogicDataParams = {
                ID_TYPE: custBasicInfo.ID_TYPE || "",
                SUBJECT_IDENTITY: "",
                INOUTSIDE_IDENTITY: "",
                OCCU_TYPE: "",
            }
            custBasicInfo.INOUTSIDE_IDENTITY = OLD_INOUTSIDE_IDENTITY;
            let filterOpenLogicInfo = _this.$blMethod.loadOpenLogicData(_this, loadOpenLogicDataParams);
            custBasicInfo.INOUTSIDE_IDENTITY = _.get(filterOpenLogicInfo, "INOUTSIDE_IDENTITY[0]", "");
            if (custBasicInfo.INOUTSIDE_IDENTITY != OLD_INOUTSIDE_IDENTITY) {
                let INOUTSIDE_IDENTITY_DICTS = _.get(_this.oppBusiData, "dictAll.INOUTSIDE_IDENTITY", []);
                data1.push({
                    FIELD_TITLE: "境内外标志",
                    FIELD: 'INOUTSIDE_IDENTITY',
                    NEW: custBasicInfo.INOUTSIDE_IDENTITY || "",
                    NEW_TEXT: getDictItemName( INOUTSIDE_IDENTITY_DICTS, custBasicInfo.INOUTSIDE_IDENTITY),
                    OLD: OLD_INOUTSIDE_IDENTITY || "",
                    OLD_TEXT: getDictItemName( INOUTSIDE_IDENTITY_DICTS, OLD_INOUTSIDE_IDENTITY)
                })
            }
            //职业反洗钱备注
            let newAmlRemark = [];
            let oldAmlRemark = custBasicInfoOld.AML_REMARK;
            if (custExperienceInfoFields.VOCATION_CONFORM_SELECT.DEFAULT_VALUE == "1") {
                newAmlRemark.push("1");
            }
            if (oldAmlRemark.indexOf("1") > -1 != newAmlRemark.indexOf("1") > -1) {
                data1.push({
                    FIELD: 'VOCATION_AML_REMARK',
                    NEW: newAmlRemark.indexOf("1") > -1 ? "1" : "",
                    OLD: oldAmlRemark.indexOf("1") > -1 ? "1" : "",
                })
            }
            //是否变更重要信息，正常升位不算变更
            let CHANGE_IMPORTANT_FLAG = "0";
            let CHANGE_IMPORTANT_FLAG_YINHE = "0";//银河证券 基金自动开户协议设置 一账通绑定设置 升位也需要同步变更
            let ID_CODE_CHANGE_FLAG = "0"
            if (custBasicInfoOld.CUST_FNAME != custBasicInfo.CUST_FNAME || custBasicInfoOld.ID_TYPE != custBasicInfo.ID_TYPE || custBasicInfoOld.ID_CODE != custBasicInfo.ID_CODE ){
                CHANGE_IMPORTANT_FLAG = "1"
                CHANGE_IMPORTANT_FLAG_YINHE = "1";
                //变更前和变更后都是身份证，且旧证件号码为15位长度，新证件号码降位后与旧证件号码一致，属于正常升位，不属于变更三要素
                if (custBasicInfoOld.CUST_FNAME === custBasicInfo.CUST_FNAME && custBasicInfoOld.ID_TYPE === "00" &&
                    custBasicInfo.ID_TYPE === "00" && custBasicInfoOld.ID_CODE.length === 15 &&
                    custBasicInfoOld.ID_CODE === util.lowerCardNo(custBasicInfo.ID_CODE)) {
                    CHANGE_IMPORTANT_FLAG = "0";
                    ID_CODE_CHANGE_FLAG = "1";
                }
            }
            // if (isChangeThree(_this)) {
                //如果三要素修改了
                let CUST_CONTROLER_INFO = _this.groupDatas.RELA_INFO.CUST_CONTROLER_INFO;
                let CUST_BENEFICIARY_INFO = _this.groupDatas.RELA_INFO.CUST_BENEFICIARY_INFO;
                _.each(CUST_CONTROLER_INFO, (item, key) => {
                    if (item.FIELDS.IS_SELF.DEFAULT_VALUE == "1") {
                        _this.groupDatas.RELA_INFO.CUST_CONTROLER_INFO[key].FIELDS.CONTROLER_NAME.DEFAULT_VALUE = custBasicInfo.CUST_FNAME;
                        _this.groupDatas.RELA_INFO.CUST_CONTROLER_INFO[key].FIELDS.CONTROLER_ID_TYPE.DEFAULT_VALUE = custBasicInfo.ID_TYPE;
                        _this.groupDatas.RELA_INFO.CUST_CONTROLER_INFO[key].FIELDS.CONTROLER_ID_NO.DEFAULT_VALUE = custBasicInfo.ID_CODE;
                    }
                })
                _.each(CUST_BENEFICIARY_INFO, (item, key) => {
                    if (item.FIELDS.IS_SELF.DEFAULT_VALUE == "1") {
                        _this.groupDatas.RELA_INFO.CUST_BENEFICIARY_INFO[key].FIELDS.BENEFICIARY_NAME.DEFAULT_VALUE = custBasicInfo.CUST_FNAME;
                        _this.groupDatas.RELA_INFO.CUST_BENEFICIARY_INFO[key].FIELDS.BENEFICIARY_ID_TYPE.DEFAULT_VALUE = custBasicInfo.ID_TYPE;
                        _this.groupDatas.RELA_INFO.CUST_BENEFICIARY_INFO[key].FIELDS.BENEFICIARY_ID.DEFAULT_VALUE = custBasicInfo.ID_CODE;
                    }
                })
                //关联人信息保存
                _this.busiLogic.bizActualControllerNodeBeforeSave && _this.busiLogic.bizActualControllerNodeBeforeSave(_this, params);
                _this.busiLogic.bizCustBeneficiaryInfoNodeBeforeSave && _this.busiLogic.bizCustBeneficiaryInfoNodeBeforeSave(_this, params);
            // }
            //辅助证件修改了
            params.IS_INPUT_FZ_ID_TYPE = "0";
            if (changeFzInfo(_this)) {
                CHANGE_FZ_FLAG = "1";
                params.IS_INPUT_FZ_ID_TYPE = "1"
            }
            //修改了辅助证件日期
            let CHANGE_FZ_DATE_FLAG = "0"
            if (changeFzInfoDate(_this)) {
                CHANGE_FZ_DATE_FLAG = "1";
            }
            let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
            params.PROF_INVESTOR_SOURCE = customerInfo.PROF_INVESTOR_SOURCE || "00";
            params.PROF_INVESTOR_TYPE = customerInfo.PROF_INVESTOR_TYPE || "0";
            //数据转换
            Object.assign(params, {
                NEW_BASE_INFO: Object.assign({}, custBasicInfo, {
                    USER_FNAME: custBasicInfo.CUST_FNAME,
                    USER_NAME: custBasicInfo.CUST_NAME,
                }),
                OLD_BASE_INFO: Object.assign({}, custBasicInfoOld, {
                    USER_FNAME: custBasicInfoOld.CUST_FNAME,
                    USER_NAME: custBasicInfoOld.CUST_NAME,
                }),
                CUST_BASIC_INFO: Object.assign({}, custBasicInfo, {
                    USER_FNAME: custBasicInfo.CUST_FNAME,
                    USER_NAME: custBasicInfo.CUST_NAME,
                    DIFF_INFO: data1
                }),
                //银河影像配置需要
                NEW_ID_TYPE: custBasicInfo.ID_TYPE, //客户证件类型
                RISK_FACTOR: _this.oppBusiData.oldBusiData.RISK_FACTOR, // 客户风险因素
                CHANGE_IMPORTANT_FLAG: CHANGE_IMPORTANT_FLAG, //是否变更重要信息，正常升位不算变更
                CHANGE_IMPORTANT_FLAG_YINHE: CHANGE_IMPORTANT_FLAG_YINHE,//银河证券 基金自动开户协议设置 一账通绑定设置 升位也需要同步变更
                ID_CODE_CHANGE_FLAG: ID_CODE_CHANGE_FLAG,
                //辅助证件变更了
                CHANGE_FZ_FLAG: CHANGE_FZ_FLAG,
                CHANGE_FZ_DATE_FLAG: CHANGE_FZ_DATE_FLAG,
            }, {
                SUBJECT_IDENTITY: custBasicInfo.SUBJECT_IDENTITY,
                INOUTSIDE_IDENTITY: custBasicInfo.INOUTSIDE_IDENTITY
            })
        }
        if (_this.busiCode == "V0052") {
            let IS_MUST_POLICE_VALIDATE = _this.$blMethod.getJsonSessionSysCommParam(_this, "IS_MUST_POLICE_VALIDATE");
            let isReadCard =  _this.$storage.getSession(_this.$definecfg.READ_CARD) || "0";
            // 只有身份证才能公安联网校验
            // 如何客户是通过读卡的方式开户的，读卡、证件校验标志初始化为 1-已读卡、1-已校验
            let idType = custBasicInfo.ID_TYPE || "";
            let IDCARD_CHECK_FLAG = (IS_MUST_POLICE_VALIDATE == "1" && idType == "00") ? "1" : "0"
            params.IDCARD_READ_FLAG = "0";
            params.IDCARD_CHECK_FLAG = IDCARD_CHECK_FLAG;
            custInfo.IDCARD_READ_FLAG = "0";
            custInfo.IDCARD_CHECK_FLAG = IDCARD_CHECK_FLAG;
            custInfo.CUST_BASIC_INFO.IDCARD_READ_FLAG = "0";
            custInfo.CUST_BASIC_INFO.IDCARD_CHECK_FLAG = IDCARD_CHECK_FLAG;
            if (isReadCard == "1") {
                params.IDCARD_READ_FLAG = "1";
                params.IDCARD_CHECK_FLAG = IDCARD_CHECK_FLAG;
                custInfo.IDCARD_READ_FLAG = "1";
                custInfo.IDCARD_CHECK_FLAG = IDCARD_CHECK_FLAG;
                custInfo.CUST_BASIC_INFO.IDCARD_READ_FLAG = "1";
                custInfo.CUST_BASIC_INFO.IDCARD_CHECK_FLAG = IDCARD_CHECK_FLAG;
            }
            //客户的证件为身份证时，界面不展示：“主体身份”字段，后台此字段送“普通”
            if (idType == '00' && !_.isEmpty(params.CUST_INFO.CUST_EXPERIENCE_INFO)) {
                if (custInfo.CUST_BASIC_INFO.AGE >= 70) {
                    custInfo.CUST_BASIC_INFO.SUBJECT_IDENTITY = "2";
                } else {
                    custInfo.CUST_BASIC_INFO.SUBJECT_IDENTITY = "0";
                }
                // params.CUST_INFO.CUST_EXPERIENCE_INFO[0].SUBJECT_IDENTITY = '0' ;
            }
            // 客户证件类型为护照时 主体身份证默认填写 境内工作的外籍人员
            if (idType == "06") {
                custInfo.CUST_BASIC_INFO.SUBJECT_IDENTITY = "b";
            }
            if (idType == '0s') {
                params.PHOTO_CHECK_RESULT = _.extend(_this.oppBusiData.PHOTO_CHECK_RESULT || _this.historyData.PHOTO_CHECK_RESULT, {
                    CUST_FNAME: custInfo.CUST_BASIC_INFO.CUST_FNAME,
                    ID_CODE: custInfo.CUST_BASIC_INFO.ID_CODE,
                    ID_TYPE: custInfo.CUST_BASIC_INFO.ID_TYPE,
                });
            }
            if (_this.oppBusiData.foreignChineseIdType.indexOf(idType) > -1 && !_.isEmpty(_this.oppBusiData.FOREIGN_CHINESE_CHECK_RESULT)) {
                // 是否做过出入境检查
                custInfo.CUST_BASIC_INFO.isForeignChineseChecked = _this.oppBusiData.FOREIGN_CHINESE_CHECK_RESULT.isForeignChineseChecked || false;
                // 【定居国外的中国公民护照查询标识】
                custInfo.CUST_BASIC_INFO.FOREIGN_CHINESE_FLAG = _this.oppBusiData.FOREIGN_CHINESE_CHECK_RESULT.FOREIGN_CHINESE_FLAG || "";
                //中登检查接口返回值：1：接口返回成功，0：接口返回失败
                custInfo.CUST_BASIC_INFO.FOREIGN_CHINESE_CHECK_FLAG = _this.oppBusiData.FOREIGN_CHINESE_CHECK_RESULT.FLAG;
                //出入境证件信息核查【业务类别】
                custInfo.CUST_BASIC_INFO.FOREIGN_CHINESE_ACCTBIZ_CLS = _this.oppBusiData.FOREIGN_CHINESE_CHECK_RESULT.ACCTBIZ_CLS
                // 历史的核查数据
                custInfo.CUST_BASIC_INFO.FOREIGN_CHINESE_CHECK_RESULT = _this.oppBusiData.FOREIGN_CHINESE_CHECK_RESULT
            } else {
                // 是否做过出入境检查
                custInfo.CUST_BASIC_INFO.isForeignChineseChecked =  false;
                // 【定居国外的中国公民护照查询标识】
                custInfo.CUST_BASIC_INFO.FOREIGN_CHINESE_FLAG = "";
                //中登检查接口返回值：1：接口返回成功，0：接口返回失败
                custInfo.CUST_BASIC_INFO.FOREIGN_CHINESE_CHECK_FLAG = "";
                //出入境证件信息核查【业务类别】
                custInfo.CUST_BASIC_INFO.FOREIGN_CHINESE_ACCTBIZ_CLS = "";
                // 历史的核查数据
                custInfo.CUST_BASIC_INFO.FOREIGN_CHINESE_CHECK_RESULT = {}
            }
            // 添加审核端少的字段
            custInfo.CUST_BASIC_INFO.PROF_INVESTOR_SOURCE = "00";
            custInfo.CUST_BASIC_INFO.PROF_INVESTOR_TYPE = "0";
            custInfo.CUST_BASIC_INFO.CHANNELS = (custInfo.CUST_OPEN_TEMPLATE.CHANNELS && custInfo.CUST_OPEN_TEMPLATE.CHANNELS.split("").join(",")) || "";
            custInfo.CUST_BASIC_INFO.CUST_AGMT_TYPE = custInfo.CUST_OPEN_TEMPLATE.CUST_AGMT_TYPES || "";
        }
        params.CUST_INFO = params.CUST_INFO || {};
        params.ORG_CODE = getOrgCodeAndOrgName(_this).ORG_CODE;
        params.ORG_NAME = getOrgCodeAndOrgName(_this).ORG_NAME;
        params.CUST_FNAME = custInfo.CUST_BASIC_INFO.CUST_FNAME;
        Object.assign(params.CUST_INFO, custInfo);
        return params;
    },
    /*
     *@method bizCustBasicInfoNodeAfterSave
     *@desc 钩子函数 自定义保存数
     */
    bizCustBasicInfoNodeAfterSave: (_this, newData) => {
        let INOUTSIDE_IDENTITY = newData.INOUTSIDE_IDENTITY;
        //根据境内外改变联系信息里的邮政编码 是否必填
        let CUST_LINK_INFO = _this.groupDatas.LINK_INFO.CUST_LINK_INFO[0].FIELDS;
        if (INOUTSIDE_IDENTITY == "0") {
            setFieldsAtt(_this, CUST_LINK_INFO, "ZIP_CODE", "FIELD_REQUIRED", "1");
        }
        if (INOUTSIDE_IDENTITY == "1") {
            setFieldsAtt(_this, CUST_LINK_INFO, "ZIP_CODE", "FIELD_REQUIRED", "0");
        }
        _this.oppBusiData.copyCurrentGroupData = _.cloneDeep(_this.groupDatas);
        return true;
    },
    /*
     *@method bizCustBasicInfoNodeValidate
     *@desc 钩子函数 下一步验证
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizCustBasicInfoNodeValidate: async function (_this) {

        let CUST_CARD_INFO = _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].FIELDS;
        let idType = _.get(CUST_CARD_INFO, "ID_TYPE.DEFAULT_VALUE", "");
        let custFname = _.get(CUST_CARD_INFO, "CUST_FNAME.DEFAULT_VALUE", "");
        let sex = _.get(CUST_CARD_INFO, "SEX.DEFAULT_VALUE", "");
        let idExpDate = _.get(CUST_CARD_INFO, "ID_EXP_DATE.DEFAULT_VALUE", "");
        let idAddr = _.get(CUST_CARD_INFO, "ID_ADDR.DEFAULT_VALUE", "");

        //存量客户读卡登录，修改了【姓名、性别、证件有效期、证件地址】后，需要保证填写的信息与证件信息一致
        let isOpenAcct = _this.$storage.getSession(_this.$definecfg.IS_OPEN_ACCT_BIZ) || "";
        if(isOpenAcct != "0"){
            _this.removeFlowTip("custInfoDiff1");
            _this.removeFlowTip("custInfoDiff2");
            //存量户
            let readCard = _this.$storage.getSession(_this.$definecfg.READ_CARD);
            if(readCard == "1"){
                let cardInfo = _this.$store.state.cardData;
                let checkCardInfoStr = cardInfo && oppService.checkCardCustInfo(cardInfo,{
                    CUST_FNAME: custFname,
                    SEX: sex,
                    ID_EXP_DATE: idExpDate,
                    ID_ADDR: idAddr
                }) || "";
                if(checkCardInfoStr != ""){
                    if(checkCardInfoStr.search("证件地址") > -1 && 
                    (utils.ToCDB(cardInfo.ID_ADDR) + "").replace(/[^\x00-\xff]/g, "**").length > 64 ){
                        if((idAddr + "").replace(/[^\x00-\xff]/g, "**").length > 64 || (idAddr + "").replace(/[^\x00-\xff]/g, "**").length < 12){
                            _this.pushFlowTip( {
                                title: `请核对并完善证件地址，因您的证件地址超长，请省略非关键字后录入。
                                例如：证件上为“北京市东城区XX街道YY胡同ZZ小区9号楼2单元101室”，可省略非关键字“市、区、室”等录入“北京东城XX街道YY胡同ZZ小区9号楼2单元101”`,
                                isBreakLine: true,
                                type: "error",
                                key: "custInfoDiff1"
                            });
                        }
                        if(checkCardInfoStr.search("姓名") > -1 || checkCardInfoStr.search("性别") > -1 || checkCardInfoStr.search("证件有效期") > -1 ){
                            _this.pushFlowTip({
                                title:"您证件的[" + checkCardInfoStr + "]信息与界面填写的不一致，请先进行处理！",
                                type:'error',
                                key:'custInfoDiff2'
                            });
                        }
                    }else{
                        _this.pushFlowTip({
                            title:"您证件的[" + checkCardInfoStr + "]信息与界面填写的不一致，请先进行处理！",
                            type:'error',
                            key:'custInfoDiff2'
                        });
                    }
                }else{
                    _this.removeFlowTip("custInfoDiff1");
                    _this.removeFlowTip("custInfoDiff2");
                }
            }
        }

        //受益人和账户实际控制人弹框提示信息
        let isChangeThreFlag = isChangeThree(_this);
        let cbIsSelfTip;
    
        if (_this.moduleId && (_this.moduleId.indexOf("CUST_CARD_INFO") > -1 || _this.moduleId.indexOf("CUST_FZCARD_INFO") > -1)) {
            _this.oppBusiData.isNeedPoliceChecked = false;
            if (isChangeThreFlag) {
                cbIsSelfTip = checkControlOrBeneficiary(_this);
                if(!_.isEmpty(cbIsSelfTip)) {
                    let promiseDialog = () => {
                        return new Promise( (resolve, reject) => {
                            _this.loading = false;
                            _this.messageBox({
                                hasMask:true,
                                messageText: cbIsSelfTip,
                                confirmButtonText: "确定",
                                typeMessage: "warn", 
                                showMsgBox: true,
                                confirmedAction: () => {
                                    _this.loading = true;
                                    resolve(true)
                                }
                            })
                        })
                    } 
                    await promiseDialog();
                }
            }            
            
            _this.removeFlowTip("threeValidate");
            if (isChangeThree(_this) && idType == "00") {
                _this.oppBusiData.IDCARD_CHECK_FLAG = "0";
                _this.oppBusiData.isNeedPoliceChecked = true;
                let validate = await validateThree(_this);
                if(validate == "2" || validate == "3" || validate == "4" || validate == "5" ){
                    //在前面做了提示
                    return false;
                }
            }
            if(checkCustThreeEle(_this)){
            }
            let fieldArr = ["ID_BEG_DATE", "ID_EXP_DATE"];
            let promiseArr = [];
            _.each(fieldArr, fieldId => {
                let field = CUST_CARD_INFO[fieldId];
                let fieldFn = field.FIELD_FUNCTION;
                _this.busiLogic[fieldFn] && promiseArr.push(_this.busiLogic[fieldFn](_this, field, CUST_CARD_INFO));
            })
            return Promise.all(promiseArr).then( (res)=> {
                if (_.includes(res, false)) {
                    return false;
                }
            })
        }
    },
    bizCustBasicInfoNodeValidateBizOpenAcct: async function (_this) {
        let validateFn = [];
        //客户的证件结束日期与证件开始日期做比对，不符合以下规则，身份证：3个月、5年、10年、20年、长期；
        let CUST_CARD_INFO = _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].FIELDS; 
        let idType = _.get(CUST_CARD_INFO, "ID_TYPE.DEFAULT_VALUE", "");
        if (_this.moduleId && (_this.moduleId.indexOf("CUST_CARD_INFO") > -1 || _this.moduleId.indexOf("CUST_FZCARD_INFO") > -1)) {
            if (idType == "00") {
                let ID_BEG_DATE = _.get(CUST_CARD_INFO, "ID_BEG_DATE.DEFAULT_VALUE", "");
                let ID_EXP_DATE = _.get(CUST_CARD_INFO, "ID_EXP_DATE.DEFAULT_VALUE", "");
                let isValidFlag = _this.$blMethod.checkIdExpDate(ID_BEG_DATE, ID_EXP_DATE);
                if (!isValidFlag) {
                    validateFn.push(
                        new Promise( (resolve, reject) => {
                            _this.loading = false;
                            _this.messageBox({
                                hasMask:true,
                                messageText: "根据《居民身份证法》，身份证的有效期限应为3个月、5年、10年、20年或长期，请核对是否正确。",
                                confirmButtonText: "确定",
                                cancelButtonText: "取消",
                                typeMessage: "warn", 
                                showMsgBox: true,
                                confirmedAction: () => {
                                    _this.loading = true;
                                    resolve(true)
                                },
                                canceledAction: () => {
                                    resolve(false)
                                }
                              })
                        })
                    ) 
                }
            }
        }
        return Promise.all(validateFn).then(async res => {
            if (_.includes(res, false)) {
                return false;
            }

            if (_this.moduleId && _this.moduleId.indexOf("CUST_CARD_INFO") > -1 
                && idType == '0s') {
                let isCsdcTime = await csdsSerivce.isServiceTime({
                    RES_IDS: "5",
                    RES_TYPE: "1"
                })
                if (isCsdcTime.flag && check0SInfoChange(_this)) {
                    return new Promise((resolve, reject) => {
                        _this.loading = false;
                        _this.messageBox({
                            hasMask: true,
                            messageText: `请点击“中登人像比对”按钮，进行中登人像比对信息核查。`,
                            confirmButtonText: '确定',
                            typeMessage: 'warn',
                            showMsgBox: true,
                            confirmedAction: function () {
                                resolve(false)
                            },
                        })
                    })
                } else {
                    _this.oppBusiData.PHOTO_CHECK_RESULT = {};
                    return true;
                }
            }
            if (_this.moduleId && (_this.moduleId.indexOf("CUST_EXPERIENCE_INFO") > -1)) {
                // 需要出入境信息核查， 并且身份信息没变更
                if (_this.oppBusiData.IS_NEED_FOREIGN_CHINESE === "1" && _this.oppBusiData.foreignChineseIdType.indexOf(idType) > -1 && checkCustInfoChange(_this)) {   
                    let isCsdcTime = await csdsSerivce.isServiceTime({
                        RES_IDS: "5",
                        RES_TYPE: "1"
                    })
                    if(_this.oppBusiData.foreignChineseChangeField && _this.oppBusiData.foreignChineseChangeField.length > 0) {
                        _this.loading = false;
                        return new Promise((resolve, reject) => {
                            _this.loading = false;
                            _this.messageBox({
                                hasMask: true,
                                messageText: `您的出入境证件信息核查关联信息【${_this.oppBusiData.foreignChineseChangeField.join(',')}】已发生变更，请点击“出入境证件信息核查”按钮，重新进行出入境证件信息核查。`,
                                confirmButtonText: '确定',
                                typeMessage: 'warn',
                                showMsgBox: true,
                                confirmedAction: function () {
                                    resolve(false)
                                },
                            })
                        })
                    } else {
                        // 非中登时间不校验
                        if (!isCsdcTime.flag) {
                            _this.oppBusiData.FOREIGN_CHINESE_CHECK_RESULT = {};
                            return true;
                        }
                        return new Promise((resolve, reject) => {
                            _this.loading = false;
                            _this.messageBox({
                                hasMask: true,
                                messageText: `请您点击“出入境证件信息核查”，进行核验。`,
                                confirmButtonText: '确定',
                                typeMessage: 'warn',
                                showMsgBox: true,
                                confirmedAction: function () {
                                    resolve(false)
                                },
                            })
                        })
                    }
                } else if (_this.oppBusiData.IS_NEED_FOREIGN_CHINESE === "0" && _this.oppBusiData.foreignChineseIdType.indexOf(idType) > -1 && checkCustInfoChange(_this)) {
                    if(_this.oppBusiData.foreignChineseChangeField && _this.oppBusiData.foreignChineseChangeField.length > 0) {
                        return new Promise((resolve, reject) => {
                            _this.loading = false;
                            _this.messageBox({
                                hasMask: true,
                                messageText: `您的出入境证件信息核查关联信息【${_this.oppBusiData.foreignChineseChangeField.join(',')}】已发生变更，其核查信息已失效，确定继续？`,
                                confirmButtonText: '确定',
                                cancelButtonText: "取消",
                                typeMessage: 'warn',
                                showMsgBox: true,
                                confirmedAction: function () {
                                    // 重置出入境核查信息
                                    _this.oppBusiData.FOREIGN_CHINESE_CHECK_RESULT = {};
                                    _this.loading = true;
                                    resolve(true)
                                },
                                canceledAction: () => {
                                    resolve(false)
                                },
                            })
                        })
                    } else {
                        _this.oppBusiData.FOREIGN_CHINESE_CHECK_RESULT = {};
                        return true;
                    }
                }
            }
        })
    },

    // 上一步
    bizCustBasicInfoNodePreValidate: function (_this) {
    },

    /*
     *@method bizCustBasicInfoNodePageActivated
     *@desc 钩子函数：页面激活
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizCustBasicInfoNodePageActivated: function (_this) {
        let CUST_EXPERIENCE_INFO = _this.groupDatas.CUST_INFO.CUST_EXPERIENCE_INFO[0].FIELDS || {};   
        let CUST_CARD_INFO = _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].FIELDS || {};  

        //设置国籍
        if (_this.moduleId && _this.moduleId.indexOf("CUST_EXPERIENCE_INFO") > -1) {
            setCITIZENSHIP(_this);
        }
        //设置证件有效期
        if (_this.moduleId && _this.moduleId.indexOf("CUST_CARD_INFO") > -1) {
            idExpDateDetail(_this);
        }
        
        //地址设置
        let idType = _.get(CUST_CARD_INFO, "ID_TYPE.DEFAULT_VALUE", "");
        let addressRequired = ["00", "0s"].indexOf(idType) > -1 ? "1" : "0" 
        setFieldsAtt(_this, CUST_CARD_INFO, "ID_ADDR", "FIELD_REQUIRED", addressRequired);
        //证件号码校验设置
        _this.$blMethod.setValidType(_this, CUST_CARD_INFO.ID_TYPE, CUST_CARD_INFO, "ID_CODE");

        //身份证证件升位
        if (_this.moduleId && _this.moduleId.indexOf("CUST_CARD_INFO") > -1) {
            _this.removeFlowTip("check15IdCode");
            if (!check15IdCode(_this)) {
                _this.pushFlowTip( {
                    title: "已经对15位身份证进行升位，请点击本页面【保存修改】进行确认",
                    type: "warning",
                    key: "check15IdCode"
                } )
            }

            let CUST_CARD_INFO = _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].FIELDS;
            let custFname = _.get(CUST_CARD_INFO, "CUST_FNAME.DEFAULT_VALUE", "");
            let sex = _.get(CUST_CARD_INFO, "SEX.DEFAULT_VALUE", "");
            let idExpDate = _.get(CUST_CARD_INFO, "ID_EXP_DATE.DEFAULT_VALUE", "");
            let idAddr = _.get(CUST_CARD_INFO, "ID_ADDR.DEFAULT_VALUE", "");

            let isOpenAcct = _this.$storage.getSession(_this.$definecfg.IS_OPEN_ACCT_BIZ) || "";
            if(isOpenAcct != "0"){
                _this.removeFlowTip("custInfoDiff1");
                _this.removeFlowTip("custInfoDiff2");
                _this.removeFlowTip("custInfoDiff3");
                //存量户
                let readCard = _this.$storage.getSession(_this.$definecfg.READ_CARD);
                if(readCard == "1"){
                    let cardInfo = _this.$store.state.cardData,
                    custInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
                    //读卡信息与系统内不一致
                    let checkCardInfoStr1 = cardInfo && oppService.checkCardCustInfo(cardInfo,custInfo) || "";
                    //读卡信息与填写信息不一致
                    let checkCardInfoStr2 = cardInfo && oppService.checkCardCustInfo(cardInfo,{
                        CUST_FNAME: custFname,
                        SEX: sex,
                        ID_EXP_DATE: idExpDate,
                        ID_ADDR: idAddr
                    }) || "";

                    if(checkCardInfoStr1 != ""){
                        if(checkCardInfoStr1.search("证件地址") > -1 &&
                        (utils.ToCDB(cardInfo.ID_ADDR) + "").replace(/[^\x00-\xff]/g, "**").length <= 64 ){
                            setFieldsAtt(_this, CUST_CARD_INFO, "ID_ADDR", "DEFAULT_VALUE", utils.ToCDB(cardInfo.ID_ADDR));
                            _this.pushFlowTip( {
                                title: "已根据证件信息自动填写证件地址，请点击本页面【保存修改】进行确认",
                                type: "warning",
                                key: "custInfoDiff3"
                            });
                            if(checkCardInfoStr2.search("姓名") > -1 || checkCardInfoStr2.search("性别") > -1 || checkCardInfoStr2.search("证件有效期") > -1 ){
                                _this.pushFlowTip({
                                    title:"您证件的[" + checkCardInfoStr2 + "]信息与界面填写的不一致，请先进行处理！",
                                    type:'error',
                                    key:'custInfoDiff2'
                                });
                            }
                        }else if(checkCardInfoStr1.search("证件地址") > -1 && 
                        (utils.ToCDB(cardInfo.ID_ADDR) + "").replace(/[^\x00-\xff]/g, "**").length > 64 ){
                            if(idAddr.replace(/[^\x00-\xff]/g, "**").length > 64 || idAddr.replace(/[^\x00-\xff]/g, "**").length < 12){
                                _this.pushFlowTip( {
                                    title: `请核对并完善证件地址，因您的证件地址超长，请省略非关键字后录入。
                                    例如：证件上为“北京市东城区XX街道YY胡同ZZ小区9号楼2单元101室”，可省略非关键字“市、区、室”等录入“北京东城XX街道YY胡同ZZ小区9号楼2单元101”`,
                                    isBreakLine: true,
                                    type: "error",
                                    key: "custInfoDiff1"
                                });
                            }
                            if(checkCardInfoStr2.search("姓名") > -1 || checkCardInfoStr2.search("性别") > -1 || checkCardInfoStr2.search("证件有效期") > -1 ){
                                _this.pushFlowTip({
                                    title:"您证件的[" + checkCardInfoStr2 + "]信息与界面填写的不一致，请先进行处理！",
                                    type:'error',
                                    key:'custInfoDiff2'
                                });
                            }
                        }else if(checkCardInfoStr2 != ""){
                            _this.pushFlowTip({
                                title:"您证件的[" + checkCardInfoStr2 + "]信息与界面填写的不一致，请先进行处理！",
                                type:'error',
                                key:'custInfoDiff2'
                            });
                        }
                    }
                }
            }
            if (isOpenAcct == "0") {
                let idType = _.get(CUST_CARD_INFO, "ID_TYPE.DEFAULT_VALUE", "");
                // 护照
                if (idType == "06") {
                    _this.pushFlowTip( {
                        title: "如您在境内工作，请提供境内机构出具的就业证明及该机构的营业执照复印件；如您不在境内工作，请您前往柜台办理，感谢您的配合。",
                        type: "warning",
                        key: "hzjn"
                    })
                }
            }
        }
        
        //客户的证件为身份证时，界面不展示：“主体身份”字段，后台此字段送“普通”
        if (_this.busiCode == 'V0052' && idType == '00') {
            let CUST_EXPERIENCE_INFO = _this.groupDatas.CUST_INFO.CUST_EXPERIENCE_INFO[0].FIELDS;
            setFieldsAtt(_this, CUST_EXPERIENCE_INFO, "SUBJECT_IDENTITY", "FIELD_CONTROL",'1');
        }
        // 客户的证件类型为“境外居留签证中国护照”、“香港居民通行证”、“澳门居民通行证”、“台湾居民通行证”、“外国人永久居留证”，则显示“出入境证件信息核查”按钮
        if (_this.busiCode == "V0052" && _this.oppBusiData.foreignChineseIdType.indexOf(idType) > -1) {
            // 是否需要做出入境核查
            _this.groupDatas.CUST_INFO.CUST_EXPERIENCE_INFO[0].MODULE_ZDCUSTOMIZE = "1";
            _this.groupDatas.CUST_INFO.CUST_EXPERIENCE_INFO[0].MODULE_ZDCUSTOMIZE_TXT = "出入境证件信息核查";
        }
        // 若客户的证件类型为“港澳台居民居住证”，则显示“中登人像比对”按钮
        if (_this.busiCode == "V0052" && "0s".indexOf(idType) > -1) {
            _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].MODULE_ZDCUSTOMIZE = "1";
            _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].MODULE_ZDCUSTOMIZE_TXT = "中登人像比对";
            _this.oppBusiData.PHOTO_CHECK_RESULT = _this.oppBusiData.PHOTO_CHECK_RESULT || _.get(_this.historyData, "CUST_INFO.CUST_BASIC_INFO.PHOTO_CHECK_RESULT", {});
        }
        if (_this.busiCode == "V0052" && !_.isEmpty(_this.$route.query)) {
            _this.oppBusiData.FOREIGN_CHINESE_CHECK_RESULT = _.get(_this.historyData, "CUST_INFO.CUST_BASIC_INFO.FOREIGN_CHINESE_CHECK_RESULT", {});
            if (_this.$route.query.FLAG !== undefined) {
                _this.oppBusiData.FOREIGN_CHINESE_CHECK_RESULT = _this.$route.query;
                if (_this.$route.query.serviceTimeFlag === false) {
                    _this.pushFlowTip( {
                        title: "非中登出入境证件信息核查服务时间，不支持出入境证件信息核查！",
                        type: "warning",
                        key: "foreignChinses"
                    } )
                }
            }
        }
    },
    //----------------------业务函数----------------------------------//
    /**
     *【CHECK_BASICINFO_ID_CODE】证件号码相关逻辑
     * a)证件类型为“身份证”时，根据号码自动计算出性别、自动填充主体身份，可编辑
     */
    "CHECK_BASICINFO_ID_CODE": (_this, field, fieldData) => {
        checkCustThreeEle(_this);
        //设置出生 性别
        setSEXorBIRTHDAY(_this, field, fieldData);
        //无效证件类型处理
        invalidDetail(_this);
    },
    /**
     * 【CHECK_USER_FNAME】客户全称
     */
    "CHECK_CUST_FNAME": (_this, field, fieldData) => {
        checkCustThreeEle(_this);
        fieldData.CUST_NAME.DEFAULT_VALUE = utils.cutCustFullName(field.DEFAULT_VALUE);
    },
    
    /** 身份证
     */
    CHECK_BASICINFO_ID_TYPE: function (_this, field, fieldData) {
        if (!field.DEFAULT_VALUE) {
            return;
        }
        if (field.firstDefalutValue == field.DEFAULT_VALUE) {
            return;
        }
        field.firstDefalutValue = field.DEFAULT_VALUE;
        //证件号码校验设置
        _this.$blMethod.setValidType(_this, field, fieldData, "ID_CODE");
        //地址设置
        let addressRequired = ["00", "0s"].indexOf(field.DEFAULT_VALUE) > -1 ? "1" : "0" 
        setFieldsAtt(_this, fieldData, "ID_ADDR", "FIELD_REQUIRED", addressRequired);
        //国家设置
        setCITIZENSHIP(_this);
        //辅助证件以及国家
        checkFzIdCardCitizenship(_this);
        //性别 出生日期设置
        let sexOrBirthdayControl = (["00", "0s"].indexOf(field.DEFAULT_VALUE) > -1 && stringConfig.isNotEmptyStr(fieldData.BIRTHDAY.DEFAULT_VALUE)) ? "2" : "0"
        setFieldsAtt(_this, fieldData, "SEX", "FIELD_CONTROL", sexOrBirthdayControl);
        setFieldsAtt(_this, fieldData, "BIRTHDAY", "FIELD_CONTROL", sexOrBirthdayControl);
        //证件类型跟原来的不一致 则清空提示
        let oldData = oldCustBasicInfo(_this);
        if (field.DEFAULT_VALUE != oldData.ID_TYPE) {
            _this.removeFlowTip("checkSexTip");
            _this.removeFlowTip("checkBirthTip");
        }
        
        
        
        //清空证件号码 开始日期 结束日期
        setFieldsAtt(_this, fieldData, "ID_CODE", "DEFAULT_VALUE", "");
        setFieldsAtt(_this, fieldData, "ID_BEG_DATE", "DEFAULT_VALUE", "");
        setFieldsAtt(_this, fieldData, "ID_EXP_DATE", "DEFAULT_VALUE", "");

        let HIS_ID_TYPE = _.get(_this.oppBusiData.oldBusiData, "CUST_BASIC_INFO.ID_TYPE", '');
        let HIS_ID_CODE = _.get(_this.oppBusiData.oldBusiData, "CUST_BASIC_INFO.ID_CODE", '');
        let HIS_ID_BEG_DATE = _.get(_this.oppBusiData.oldBusiData, "CUST_BASIC_INFO.ID_BEG_DATE", '');
        let HIS_ID_EXP_DATE = _.get(_this.oppBusiData.oldBusiData, "CUST_BASIC_INFO.ID_EXP_DATE", '');
        if(field.DEFAULT_VALUE != '' && field.DEFAULT_VALUE == HIS_ID_TYPE) {
            fieldData.ID_CODE.DEFAULT_VALUE = HIS_ID_CODE || '';
            fieldData.ID_BEG_DATE.DEFAULT_VALUE = HIS_ID_BEG_DATE || '';
            fieldData.ID_EXP_DATE.DEFAULT_VALUE = HIS_ID_EXP_DATE || '';
        }

        checkCustThreeEle(_this);
        //辅助证件显示隐藏
        changeFzIdInfoShow(_this);
        //辅助证件类型设置
        setFZ_ID_TYPE(_this);
        //无效证件类型处理
        invalidDetail(_this);
        
        //开户不需要读卡按钮
        let isOpenAcct = _this.$storage.getSession(_this.$definecfg.IS_OPEN_ACCT_BIZ) || "";
        if ((field.DEFAULT_VALUE == "00" || field.DEFAULT_VALUE == "08") && isOpenAcct != "0") {
            //只有证件类型是身份证时才展示
            // 展示读卡按钮
            _this.groupDatas["CUST_INFO"].CUST_CARD_INFO[0].MODULE_READ = "1";
        } else {
            _this.groupDatas["CUST_INFO"].CUST_CARD_INFO[0].MODULE_READ = "0";
        }
    },
    //出生日期
    CHECK_BASICINFO_BIRTHDAY: (_this, field, fieldData) => {
        _this.removeFlowTip("checkBirthDayTip")
        if (!checkBirthDay(_this)) {
            _this.pushFlowTip({
                title: "客户为未成年客户，不支持在自助柜员机办理该业务，请前往柜台办理。",
                type: "error",
                key: "checkBirthDayTip",
            })
            _this.disableNext = true;
        }
        checkVocationDetail(_this);
    },
    //出生日期 开户
    CHECK_BASICINFO_BIRTHDAY_OPEN: (_this, field, fieldData) => {
        _this.removeFlowTip("checkBirthDayTip")
        if (!checkBirthDayOpen(_this)) {
            _this.pushFlowTip({
                // title: "您的年龄未满18周岁/超过70周岁（含），为了保护您的合法权益，请前往柜台办理，感谢您的配合。",
                title: "您的年龄未满18周岁，为了保护您的合法权益，请前往柜台办理，感谢您的配合。",
                type: "error",
                key: "checkBirthDayTip",
            })
            _this.disableNext = true;
        }
    },
    //工作单位
    "CHECK_WORKPLACE": (_this, field, fieldData) => {
    },
    //选择职业模块
    "CHECK_VOCATION":(_this, field, fieldData) => {
        if (!field.DEFAULT_VALUE) {
            return;
        }
        //职业模块校验
        // checkVocationDetail(_this);
        // //职业为军人的时候 涉税信息隐藏
        // taxInfoShowOrHide(_this);
    },
    //职业类型
    "CHECK_BASICINFO_OCCU_TYPE": (_this, field, fieldData) => {
        //职业模块校验
        checkVocationDetail(_this);
        //职业为军人的时候 涉税信息隐藏
        taxInfoShowOrHide(_this);
    },
    //主体身份
    "CHECK_SUBJECT_IDENTITY": async (_this, field, fieldData) => {
    },
    //境内外
    "CHECK_INOUTSIDE_IDENTITY": (_this, field, fieldData) => {
    },
    //职务
    "CHECK_POSITION": (_this, field, fieldData) => {
    },
    "CHECK_BASICINFO_CITIZENSHIP": (_this, field, fieldData) => {
        checkCITIZENSHIP(_this, field.DEFAULT_VALUE);
    },
    "CHECK_EXPERIENCE_CITIZENSHIP":async (_this, field, fieldData) => {
        if (field.LAST_DEFAULT_VALUE && field.LAST_DEFAULT_VALUE == field.DEFAULT_VALUE) {
            return;
        }
        // 是否为灰名单国家 默认为0
        _this.oppBusiData.isGrayCitizenship = "0";
        let countryValue = field.DEFAULT_VALUE;
        if (!_.isEmpty(countryValue) && countryValue != "CHN") {
            _this.removeFlowTip('black-gray-info');
            // 查询国家是否属于灰黑色名单国籍
            let blackInfo = await getGrayBlackInfo(_this, countryValue);
            if (!_.isEmpty(blackInfo)) {
                // 201黑名单 202灰名单
                if (blackInfo.LISTTYPE == "201") {
                    _this.pushFlowTip( {
                        title: "为了更好的为您提供服务，请前往柜台办理，感谢您的配合。",
                        type: "error",
                        key: "black-gray-info"
                    })
                    field.DEFAULT_VALUE = "";
                    return false;
                }
                // 灰名单需要流转营业部负责人 及合规岗
                if (blackInfo.LISTTYPE == "202") {
                    // 灰名单国家
                    _this.oppBusiData.isGrayCitizenship = "1";
                }
            }
        }
        if (!_.isEmpty(countryValue) && countryValue != "CHN") {
            // 如果不是中国国籍，固定电话的校验类型设置为 tel、样式设置为 normalinput
            _this.groupDatas.LINK_INFO.CUST_LINK_INFO[0].FIELDS.TEL.VALID_TYPE = "tel";
            _this.groupDatas.LINK_INFO.CUST_LINK_INFO[0].FIELDS.TEL.FIELD_TYPE = "normalinput";
        }
        // 当客户的国籍为”中国香港、中国澳门、台湾“时，联系地址应该依然显示成省市区的模式
        if (!_.isEmpty(countryValue) && "CTN,HKG,MAC".indexOf(countryValue) > -1) {
            _this.groupDatas.LINK_INFO.CUST_LINK_INFO[0].FIELDS.ADDRESS["showRegionSelector"] = true;
        }
        field.LAST_DEFAULT_VALUE = field.DEFAULT_VALUE;
    },
    "CHECK_FZ_ID_TYPE": (_this, field, fieldData) => {
        _this.$blMethod.setValidType(_this, field, fieldData, "FZ_ID_CODE");
        changeFzInfoDetail(_this);
        if(stringConfig.isNotEmptyStr(field.DEFAULT_VALUE)){
            fieldData.FZ_ID_CODE.FIELD_REQUIRED = "1";
            field.FIELD_REQUIRED = "1";
        }
        let CUST_CARD_INFO = _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].FIELDS;
        if(CUST_CARD_INFO.ID_TYPE.DEFAULT_VALUE != "0s"){
            if(stringConfig.isEmptyStr(fieldData.FZ_ID_CODE.DEFAULT_VALUE)
            && stringConfig.isEmptyStr(fieldData.FZ_ID_TYPE.DEFAULT_VALUE)){
                fieldData.FZ_ID_CODE.FIELD_REQUIRED = "0";
                fieldData.FZ_ID_TYPE.FIELD_REQUIRED = "0";
            }
        }
        checkFzIdCardCitizenship(_this);
        checkFzYmtData(_this);
    },
    "CHECK_FZ_ID_CODE": (_this, field, fieldData) => {
        changeFzInfoDetail(_this);
        if(stringConfig.isNotEmptyStr(field.DEFAULT_VALUE)){
            fieldData.FZ_ID_TYPE.FIELD_REQUIRED = "1";
            field.FIELD_REQUIRED = "1";
        }
        let CUST_CARD_INFO = _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].FIELDS;
        if(CUST_CARD_INFO.ID_TYPE.DEFAULT_VALUE != "0s"){
            if(stringConfig.isEmptyStr(fieldData.FZ_ID_CODE.DEFAULT_VALUE)
            && stringConfig.isEmptyStr(fieldData.FZ_ID_TYPE.DEFAULT_VALUE)){
                fieldData.FZ_ID_CODE.FIELD_REQUIRED = "0";
                fieldData.FZ_ID_TYPE.FIELD_REQUIRED = "0";
            }
        }
        checkFzYmtData(_this);
    },
    "CHECK_FZ_ID_EXP_DATE": (_this, field, fieldData) => {
        changeFzInfoDetail(_this);
    },
    //行业大类
    "CHECK_INDUS_GB": (_this, field, fieldData) => {
    },
    "CHECK_ID_BEG_DATE": (_this, field, fieldData) => {
        if (!_this.busiLogic.checkIdBegDate(_this)) {
            _this.$nextTick( () => {
                _this.$blMethod.changeFieldError(field, false, "请选择正确证件开始日期");
            })
            return false
        }
    },
    //职业大类
    "CHECK_OCCU_GB": (_this, field, fieldData) => {
    },
    "CHECK_ID_EXP_DATE": (_this, field, fieldData) => {
        //无效证件类型处理
        invalidDetail(_this);
        //时间校验
        if (!_this.busiLogic.checkIdExpDate(_this)) {
            _this.$nextTick( () => {
                _this.$blMethod.changeFieldError(field, false, "请选择正确证件结束日期");
            })
            return false
        }
    },
    //读卡时 证件开始结束日期与读的卡片不一致
    checkIdCardDate: (_this) => {
        let isReadCard = _this.$storage.getSession(_this.$definecfg.READ_CARD) == "1" ? true : false;
        if (isReadCard) {
            let readCardData = _this.$store.state.cardData;
            let CUST_CARD_INFO = _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].FIELDS;
            //当前数据与读卡后的数据是否一致 不一致则提示
            if (CUST_CARD_INFO.ID_BEG_DATE.DEFAULT_VALUE != readCardData.ID_BEG_DATE || CUST_CARD_INFO.ID_EXP_DATE.DEFAULT_VALUE != readCardData.ID_EXP_DATE) {
                return false;
            }
        }
        return true;
    },
    //无效证件类型
    checkIdTypeInvaild: (_this) => {
        let oldBasicInfo = oldCustBasicInfo(_this);
        let oldIdType = oldBasicInfo.ID_TYPE || "";
        let validIdTypeArr = _this.oppBusiData.VALID_ID_TYPE_FOR_PERSON || [];
        if (validIdTypeArr.indexOf(oldIdType) == -1) {
            return false;
        }
        return true;
    },
    //是否变更了 证件类型、证件号码、证件有效期
    checkUpdateIdtype: (_this) => {
        let oldBasicInfo = oldCustBasicInfo(_this);
        let CUST_CARD_INFO = _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0];
        let oldIdType = oldBasicInfo.ID_TYPE || "";
        let oldIdCode = oldBasicInfo.ID_CODE || "";
        let newIdType = _.get(CUST_CARD_INFO, "FIELDS.ID_TYPE.DEFAULT_VALUE", "");
        let newIdCode = _.get(CUST_CARD_INFO, "FIELDS.ID_TYPE.DEFAULT_VALUE", "");
        if (!this.default.checkIdTypeInvaild(_this)) {
            if (oldIdType && (oldIdType == newIdType || oldIdCode == newIdCode)) {
                return false;
            }
        }
        return true;
    },
    //证件结束日期 大于 证件开始日期 以及 小于今天
    checkIdExpDate: (_this) => {
        let CUST_CARD_INFO = _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].FIELDS;
        let idExpDate = CUST_CARD_INFO.ID_EXP_DATE.DEFAULT_VALUE;
        let idBegDate = CUST_CARD_INFO.ID_BEG_DATE.DEFAULT_VALUE;
        if (idExpDate) {
            if (idBegDate && idBegDate != "0" && date.compareDate(idBegDate, idExpDate) > -1) {
                return false;
            }
            if (date.compareDate(idExpDate,date.getClientDate()) == -1) {
                return false;
            }
        }
        return true;
    },
    //证件开始日期 大于今天
    checkIdBegDate: (_this) => {
        let CUST_CARD_INFO = _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].FIELDS;
        let idBegDate = CUST_CARD_INFO.ID_BEG_DATE.DEFAULT_VALUE;
        if (idBegDate && idBegDate != "0") {
            if (date.compareDate(idBegDate, date.getClientDate()) < 1) {
                return true;
            }
        }
        return false;
    },
    bizCustBasicInfoNodeCheckModule: (_this, moduleIdArr) => {
        if (moduleIdArr.indexOf("CUST_CARD_INFO") > -1) {
            return check15IdCode(_this) && checkBirthDay(_this) && checkCardInfoDiff(_this);
        }
        return true;
    },
    checkChangeFzRequired: (_this, field, fieldData) => {
        let CUST_CARD_INFO = _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].FIELDS;
        if (_.indexOf(["0b", "0c", "0d"], CUST_CARD_INFO.ID_TYPE.DEFAULT_VALUE) > -1) {
            fieldData.FZ_ID_CODE.FIELD_REQUIRED = "0";
            fieldData.FZ_ID_TYPE.FIELD_REQUIRED = "0";
            if (fieldData.FZ_ID_CODE.DEFAULT_VALUE || fieldData.FZ_ID_TYPE.DEFAULT_VALUE) {
                fieldData.FZ_ID_CODE.FIELD_REQUIRED = "1";
                fieldData.FZ_ID_TYPE.FIELD_REQUIRED = "1";
            }
        }
    }
}
//读卡时 证件开始结束日期是否需要变更
const idExpDateDetail = (_this) => {
    let isOpenAcct = _this.$storage.getSession(_this.$definecfg.IS_OPEN_ACCT_BIZ) || "";
    if (isOpenAcct != "0") {
        let isReadCard = _this.$storage.getSession(_this.$definecfg.READ_CARD) == "1" ? true : false;
        if (isReadCard) {
            let readCardData = _this.$store.state.cardData;
            let CUST_CARD_INFO = _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].FIELDS;
            setFieldsAtt(_this, CUST_CARD_INFO, "ID_BEG_DATE", "DEFAULT_VALUE", readCardData.ID_BEG_DATE);
            setFieldsAtt(_this, CUST_CARD_INFO, "ID_EXP_DATE", "DEFAULT_VALUE", readCardData.ID_EXP_DATE);
            //原数据与读卡后的数据是否一致 不一致则提示
            let oldData = oldCustBasicInfo(_this);
            if (oldData.ID_BEG_DATE != readCardData.ID_BEG_DATE || oldData.ID_EXP_DATE != readCardData.ID_EXP_DATE) {
                _this.pushFlowTip( {
                    title: "已根据证件信息自动填写证件有效期限，请点击本页面【保存修改】进行确认",
                    type: "warning",
                    key: "idExpDateDetail"
                })
            }
        }
    }
    
}

//是否变更的辅助证件
const changeFzInfo = (_this) => {
    let custBasicInfoOld = oldCustBasicInfo(_this);
    let custFZCardInfo = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "CUST_FZCARD_INFO");
    let CUST_FZCARD_INFO = _this.groupDatas.CUST_INFO.CUST_FZCARD_INFO[0].FIELDS;
    let isFzIdTypeRequired = _.get(CUST_FZCARD_INFO, "FZ_ID_TYPE.FIELD_REQUIRED", "") == '1';
    let isFzIdCodeRequired = _.get(CUST_FZCARD_INFO, "FZ_ID_CODE.FIELD_REQUIRED", "") == '1';
    // 个人资料修改：
    // 当客户证件类型为香港居民通行证/澳门居民通行证/台湾居民通行证时，新增或修改了辅助证件类型、辅助证件号码、辅助证件结束日期中的任意一项，界面提示
    // 当客户证件类型为港澳台居民居住证时，新增或修改了辅助证件结束日期，界面提示
    if(_this.busiCode == 'V0049') {
        if((isFzIdTypeRequired || isFzIdCodeRequired) || custFZCardInfo.FZ_ID_EXP_DATE != '') {
            return custBasicInfoOld.FZ_ID_TYPE != custFZCardInfo.FZ_ID_TYPE || custBasicInfoOld.FZ_ID_CODE != custFZCardInfo.FZ_ID_CODE || custBasicInfoOld.FZ_ID_EXP_DATE != custFZCardInfo.FZ_ID_EXP_DATE
            || (isFzIdTypeRequired && custFZCardInfo.FZ_ID_TYPE == '') || (isFzIdCodeRequired && custFZCardInfo.FZ_ID_CODE == '');
        }
        else {
            return false;
        }
    }
    return custBasicInfoOld.FZ_ID_TYPE != custFZCardInfo.FZ_ID_TYPE || custBasicInfoOld.FZ_ID_CODE != custFZCardInfo.FZ_ID_CODE || custBasicInfoOld.FZ_ID_EXP_DATE != custFZCardInfo.FZ_ID_EXP_DATE;
}
//是否变更的辅助证日期
const changeFzInfoDate = (_this) => {
    let custBasicInfoOld = oldCustBasicInfo(_this);
    let custFZCardInfo = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "CUST_FZCARD_INFO");
    //由于辅助证件日期为非必填项 所以如果是新增了 辅助证件类型和辅助证件号码 也算是 变更辅助证件日期
    let newAdd = false;
    if (_.isEmpty(custBasicInfoOld.FZ_ID_TYPE) && !_.isEmpty(custFZCardInfo.FZ_ID_TYPE)) {
        newAdd = true;
    }
    if (_.isEmpty(custBasicInfoOld.FZ_ID_CODE) && !_.isEmpty(custFZCardInfo.FZ_ID_CODE)) {
        newAdd = true;
    }
    return custBasicInfoOld.FZ_ID_EXP_DATE != custFZCardInfo.FZ_ID_EXP_DATE || newAdd;
}
const changeFzInfoDetail = (_this) => {
    _this.removeFlowTip("changeFzInfoTip");
    let CUST_CARD_INFO = _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].FIELDS;
    let newIdType = _.get(CUST_CARD_INFO, "ID_TYPE.DEFAULT_VALUE", "");
    if(['0s', '0b', '0c', '0d'].indexOf(newIdType) < 0) {
        return;
    }
    if (changeFzInfo(_this)) {
        _this.pushFlowTip({
            title: "稍后需采集您的辅助身份证件，请您继续办理。",
            type: "warning",
            key: "changeFzInfoTip"
        });
    }
}
const check15IdCode = (_this) => {
    return true;
}
//18岁生日日期校验
const checkBirthDay = (_this) => {
    let CUST_CARD_INFO = _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].FIELDS;
    let birthday = CUST_CARD_INFO.BIRTHDAY.DEFAULT_VALUE || "";
    //增加当出生日期为空时，不应做对应提示
    if(stringConfig.isNotEmptyStr(birthday)){
        let age = date.getDifferYears(birthday, date.getClientDate());
        if (age < 18) {
            return false;
        }
    }
    return true;
}
const checkBirthDayOpen = (_this) => {
    let CUST_CARD_INFO = _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].FIELDS;
    let birthday = CUST_CARD_INFO.BIRTHDAY.DEFAULT_VALUE || "";
    //增加当出生日期为空时，不应做对应提示
    if(stringConfig.isNotEmptyStr(birthday)){
        let age = date.getDifferYears(birthday, date.getClientDate());
        // if (age >= 70 || age < 18) {
        //     return false;
        // }
        if (age < 18) {
            return false;
        }
    }
    return true;
}

//校验客户的证件信息与系统内信息是否一致【姓名、性别、证件有效期、证件地址】
const checkCardInfoDiff = (_this) => {
    let isOpenAcct = _this.$storage.getSession(_this.$definecfg.IS_OPEN_ACCT_BIZ) || "";
    if(isOpenAcct != "0"){
        //存量户
        let readCard = _this.$storage.getSession(_this.$definecfg.READ_CARD);
        if(readCard == "1"){
            let CUST_CARD_INFO = _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].FIELDS;
            let custFname = _.get(CUST_CARD_INFO, "CUST_FNAME.DEFAULT_VALUE", "");
            let sex = _.get(CUST_CARD_INFO, "SEX.DEFAULT_VALUE", "");
            let idExpDate = _.get(CUST_CARD_INFO, "ID_EXP_DATE.DEFAULT_VALUE", "");
            let idAddr = _.get(CUST_CARD_INFO, "ID_ADDR.DEFAULT_VALUE", "");

            let cardInfo = _this.$store.state.cardData,
            custInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
            //读卡信息与系统内不一致
            let checkCardInfoStr1 = cardInfo && oppService.checkCardCustInfo(cardInfo,custInfo) || "";
            //读卡信息与填写信息不一致
            let checkCardInfoStr2 = cardInfo && oppService.checkCardCustInfo(cardInfo,{
                CUST_FNAME: custFname,
                SEX: sex,
                ID_EXP_DATE: idExpDate,
                ID_ADDR: idAddr
            }) || "";

            if(checkCardInfoStr1.search("证件地址") > -1){
                if((utils.ToCDB(cardInfo.ID_ADDR) + "").replace(/[^\x00-\xff]/g, "**").length <= 64){
                    if(checkCardInfoStr2 != ""){
                        return false;
                    }else{
                        return true;
                    }
                }
                if((utils.ToCDB(cardInfo.ID_ADDR) + "").replace(/[^\x00-\xff]/g, "**").length > 64 && 
                (utils.ToCDB(idAddr) + "").replace(/[^\x00-\xff]/g, "**").length <= 64){
                    if(checkCardInfoStr2.search("姓名") > -1 || checkCardInfoStr2.search("性别") > -1 || checkCardInfoStr2.search("证件有效期") > -1 ){
                        return false;
                    }else{
                        return true;
                    }
                }
            }else{
                if(checkCardInfoStr1 != "" && checkCardInfoStr2 == ""){
                    return true;
                }else if(checkCardInfoStr1 != "" && checkCardInfoStr2 != ""){
                    return false;
                }else{
                    return true;
                }
            }
        }else{
            return true;
        }
    }else{
        return true;
    }
}
//字段属性设置
const setFieldsAtt = (_this, FIELDS, fieldId, att, value) => {
    let field = _.get(FIELDS, fieldId, {});
    if (!_.isEmpty(field)) {
        FIELDS[fieldId][att] = value;
    }
} 
//无效证件类型处理
const invalidDetail = (_this) => {
    _this.removeFlowTip("idTypeInvalid");
    if (!_this.busiLogic.checkUpdateIdtype(_this)) {
        _this.pushFlowTip({
            title: "证件类型为无效证件类型，需要变更证件类型、证件号码、证件有效期",
            key: "idTypeInvalid",
            type: 'error'
        })
    }
}
//涉税信息隐藏显示
const taxInfoShowOrHide = (_this) => {
    //职业信息
    let CUST_EXPERIENCE_INFO = _this.groupDatas.CUST_INFO.CUST_EXPERIENCE_INFO[0].FIELDS;
    let OCCU_TYPE = bizPublicMethod.$blMethod.getFieldValueName(CUST_EXPERIENCE_INFO.OCCU_TYPE.FIELD_DICT_NAME,CUST_EXPERIENCE_INFO.OCCU_TYPE.DEFAULT_VALUE);
    if (OCCU_TYPE == "军人") {
        _this.$blMethod.hideRouteAndMoudle(_this, "税收居民身份");
        _this.$blMethod.hideRouteAndMoudle(_this, "客户出生信息/现居国家信息");
        _this.$blMethod.hideRouteAndMoudle(_this, "税收居民国/地区信息");
        return;
    }
    let ORG_TAX_INFO = _this.groupDatas.APPR_INFO.ORG_TAX_INFO[0].FIELDS;
    let TAX_RESIDENT_TYPE = _.get(ORG_TAX_INFO, "TAX_RESIDENT_TYPE.DEFAULT_VALUE", "");
    _this.$blMethod.showRouteAndMoudle(_this, "税收居民身份");
    if (TAX_RESIDENT_TYPE && TAX_RESIDENT_TYPE != "1" && TAX_RESIDENT_TYPE != "5") {
        bizPublicMethod.$blMethod.showRouteAndMoudle(_this, "客户出生信息/现居国家信息");
        bizPublicMethod.$blMethod.showRouteAndMoudle(_this, "税收居民国/地区信息");
    } else {
        bizPublicMethod.$blMethod.hideRouteAndMoudle(_this, "客户出生信息/现居国家信息");
        bizPublicMethod.$blMethod.hideRouteAndMoudle(_this, "税收居民国/地区信息");
    }
}
//辅助证件类型设置
const setFZ_ID_TYPE = (_this, firstEnterFlag) => {
    let CUST_CARD_INFO = _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].FIELDS;
    let CUST_FZCARD_INFO = _this.groupDatas.CUST_INFO.CUST_FZCARD_INFO[0].FIELDS;
    let idType = _.get(CUST_CARD_INFO, "ID_TYPE.DEFAULT_VALUE", "");
    //当证件类型为香港居民通行证、澳门居民通行证或台湾居民通行证时
    // 辅助证件类型、辅助证件号码和辅助证件结束日期为非必填
    // 辅助证件类型只能是港澳台居住证
    if (_.indexOf(["0b", "0c", "0d"], idType) > -1) {
        !firstEnterFlag && setFieldsAtt(_this, CUST_FZCARD_INFO, "FZ_ID_TYPE", "DEFAULT_VALUE", "");
        !firstEnterFlag && setFieldsAtt(_this, CUST_FZCARD_INFO, "FZ_ID_CODE", "DEFAULT_VALUE", "");
        !firstEnterFlag && setFieldsAtt(_this, CUST_FZCARD_INFO, "FZ_ID_EXP_DATE", "DEFAULT_VALUE", "");
        setFieldsAtt(_this, CUST_FZCARD_INFO, "FZ_ID_TYPE", "FIELD_REQUIRED", "0");
        setFieldsAtt(_this, CUST_FZCARD_INFO, "FZ_ID_CODE", "FIELD_REQUIRED", "0");
        setFieldsAtt(_this, CUST_FZCARD_INFO, "FZ_ID_EXP_DATE", "FIELD_REQUIRED", "0");
        setFieldsAtt(_this, CUST_FZCARD_INFO, "FZ_ID_TYPE", "FIELD_DICT_FILTER", "0s");
    }
    // 当证件类型为港澳台居住证，
    // 辅助证件类型、辅助证件号码且必填，辅助证件结束日期非必填
    // 辅助证件类型只能选择“香港居民通行证”、“澳门居民通行证” 或 “台湾居民通行证”
    // 默认值根据系统内国籍来定
    else if (idType == "0s") {
        setFieldsAtt(_this, CUST_FZCARD_INFO, "FZ_ID_TYPE", "FIELD_REQUIRED", "1");
        setFieldsAtt(_this, CUST_FZCARD_INFO, "FZ_ID_CODE", "FIELD_REQUIRED", "1");
        setFieldsAtt(_this, CUST_FZCARD_INFO, "FZ_ID_EXP_DATE", "FIELD_REQUIRED", "0");
        setFieldsAtt(_this, CUST_FZCARD_INFO, "FZ_ID_TYPE", "FIELD_DICT_FILTER", ["0b", "0c", "0d"]);
        
        if(!firstEnterFlag) {
            //系统内国籍 
            let custBasicInfo = custInfoModel.getOriginaCustBasicInfo(_this.oppBusiData.oldBusiData);
            let CITIZENSHIP = custBasicInfo.CITIZENSHIP;
    
            //香港默认 香港居民通行证
            if (CITIZENSHIP == "HKG") {
                setFieldsAtt(_this, CUST_FZCARD_INFO, "FZ_ID_TYPE", "DEFAULT_VALUE", "0b");
            }
            //澳门默认 澳门居民通行证
            else if (CITIZENSHIP == "MAC") {
                setFieldsAtt(_this, CUST_FZCARD_INFO, "FZ_ID_TYPE", "DEFAULT_VALUE", "0c");
            }
            //台湾默认 台湾居民通行证
            else if (CITIZENSHIP == "CTN") {
                setFieldsAtt(_this, CUST_FZCARD_INFO, "FZ_ID_TYPE", "DEFAULT_VALUE", "0d");
            }
            else {
                setFieldsAtt(_this, CUST_FZCARD_INFO, "FZ_ID_TYPE", "DEFAULT_VALUE", "");
            }

            setFieldsAtt(_this, CUST_FZCARD_INFO, "FZ_ID_CODE", "DEFAULT_VALUE", "");
            setFieldsAtt(_this, CUST_FZCARD_INFO, "FZ_ID_EXP_DATE", "DEFAULT_VALUE", "");
        }
    }
}
//设置性别
const setSEXorBIRTHDAY = (_this, field, fieldData) => {
    let CUST_CARD_INFO = _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].FIELDS;
    let idType = _.get(CUST_CARD_INFO, "ID_TYPE.DEFAULT_VALUE", "");
    let idCode = _.get(CUST_CARD_INFO, "ID_CODE.DEFAULT_VALUE", "");
    _this.removeFlowTip("checkSexTip");
    _this.removeFlowTip("checkBirthTip");
    if(idType == "00" || idType == "0s") {
        let oldData = oldCustBasicInfo(_this);
        let newData = _.get(_this.historyData, "CUST_INFO.CUST_BASIC_INFO", "");
        _this.$nextTick( () => {
            _this.$blMethod.autoSexBirthday(_this, field, fieldData, "SEX", "BIRTHDAY", idType);
            let sex = newData.SEX || oldData.SEX;
            let birthDay = newData.BIRTHDAY || oldData.BIRTHDAY;
            if ((sex != _.get(fieldData, "SEX.DEFAULT_VALUE", "")) && oldData.ID_TYPE == idType && oldData.ID_CODE == idCode) {
                _this.pushFlowTip( {
                    title: "已根据证件号码自动填写性别，请点击本页面【保存修改】进行确认",
                    type: "warning",
                    key: "checkSexTip"
                })
            }
            if ((birthDay != _.get(fieldData, "BIRTHDAY.DEFAULT_VALUE", "")) && oldData.ID_TYPE == idType && oldData.ID_CODE == idCode) {
                _this.pushFlowTip( {
                    title: "已根据证件号码自动填写出生日期，请点击本页面【保存修改】进行确认",
                    type: "warning",
                    key: "checkBirthTip"
                })
            }
        })
    }
}
//国籍设置
const setCITIZENSHIP = (_this) => {
    let custBasicInfo = oldCustBasicInfo(_this);
    let idType = custBasicInfo.ID_TYPE;
    let CUST_CARD_INFO = _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].FIELDS;
    let idType_CUST_CARD_INFO = _.get(CUST_CARD_INFO, "ID_TYPE.DEFAULT_VALUE", "");
    idType_CUST_CARD_INFO && (idType = idType_CUST_CARD_INFO);
    let CUST_EXPERIENCE_INFO = _this.groupDatas.CUST_INFO.CUST_EXPERIENCE_INFO[0].FIELDS;
    let CUST_FZCARD_INFO = _this.groupDatas.CUST_INFO.CUST_FZCARD_INFO[0].FIELDS;
    let isCardInfo = _this.moduleId.indexOf("CUST_CARD_INFO") > -1;
    let setCiptizenshipValue = _.cloneDeep(CUST_EXPERIENCE_INFO.CITIZENSHIP.DEFAULT_VALUE ) || "";
    let setCiptizenshipControl = _.cloneDeep(CUST_EXPERIENCE_INFO.CITIZENSHIP.FIELD_CONTROL ) || "";
    let setCiptizenshipFilter = _.cloneDeep(CUST_EXPERIENCE_INFO.CITIZENSHIP.FIELD_DICT_FILTER ) || "";
    //如果存量国籍为空
    if (!custBasicInfo.CITIZENSHIP) {
        setCiptizenshipFilter = "";
        //00-身份证、01-境外居留签证中国护照 中国不可编辑
        if (idType == "00" || idType == "01") {
            setCiptizenshipValue = "CHN"
            setCiptizenshipControl = "2";         
        }
        //06-外国护照、09-其他证件、0e-外国人永久居留证 可编辑 选择外国国籍
        if (idType == "06" || idType == "09" || idType == "0e") {
            setCiptizenshipFilter = "!CHN,CTN,HKG,MAC"
            setCiptizenshipControl = "0";
            _this.$blMethod.isDictClean(CUST_EXPERIENCE_INFO.CITIZENSHIP);
        }
        //香港 香港不可编辑
        if (idType == "0b" || idType == "0i") {
            setCiptizenshipValue = "HKG"
            setCiptizenshipControl = "2";
        }
        //澳门  澳门不可编辑
        if (idType == "0c" || idType == "0j") {
            setCiptizenshipValue = "MAC"
            setCiptizenshipControl = "2";
        }
        //台湾  台湾不可编辑
        if (idType == "0d") {
            setCiptizenshipValue = "CTN"
            setCiptizenshipControl = "2";
        }
        //港澳台 根据辅助证件类型判断：“香港居民通行证”填充“中国香港”；“澳门居民通行证”填充“中国澳门”；“台湾居民通行证”填充“中国台湾”。
        if (idType == "0s") {
            let fzIdType = CUST_FZCARD_INFO.FZ_ID_TYPE.DEFAULT_VALUE || "";
            
            setCiptizenshipControl = "2";
            if (fzIdType == "0b") {
                setCiptizenshipValue = "HKG"
            }
            if (fzIdType == "0c") {
                setCiptizenshipValue = "MAC"
            }
            if (fzIdType == "0d") {
                setCiptizenshipValue = "CTN"
            }
        }
        let isOpenAcct = _this.$storage.getSession(_this.$definecfg.IS_OPEN_ACCT_BIZ) || "";
        //非开户 存量为空 然后自动填写 且 未保存 提示需要保存
        if(_this.moduleId.indexOf("CUST_EXPERIENCE_INFO") > -1 && isOpenAcct != "0") {
            let newCITIZENSHIP =  setCiptizenshipValue;
            let newCITIZENSHIP_control = setCiptizenshipControl;
            let basicInfo = _.get(_this.historyData, "CUST_INFO.CUST_BASIC_INFO", {});
            let saveCITIZENSHIP = basicInfo.CITIZENSHIP || "";
            _this.removeFlowTip("saveCITIZENSHIP");
            if (newCITIZENSHIP != saveCITIZENSHIP && newCITIZENSHIP_control == "2") {
                _this.pushFlowTip({
                    title: "已根据证件类型自动填写国籍，请点击本页面【保存修改】进行确认",
                    type: "warning",
                    key: "saveCITIZENSHIP",
                })
            }
        }
        
    }
    if (custBasicInfo.CITIZENSHIP) {
        //如果存量国籍不为空 根据开户信息逻辑配置表 判断是否改变了国籍
        let params = {
            ID_TYPE: idType_CUST_CARD_INFO|| "",
            SUBJECT_IDENTITY: "",
            INOUTSIDE_IDENTITY: "",
            OCCU_TYPE: "",
        }
        let filterOpenLogicInfo = _this.$blMethod.loadOpenLogicData(_this, params);
        let CITIZENSHIP_filterArr = filterOpenLogicInfo.CITIZENSHIP || [];
        setCiptizenshipFilter = CITIZENSHIP_filterArr;
        setCiptizenshipControl = "2";
        if (CITIZENSHIP_filterArr.length == 1) {
            setCiptizenshipValue = CITIZENSHIP_filterArr[0];
            setCiptizenshipControl = "2";
        }
        if (setCiptizenshipFilter.indexOf(setCiptizenshipValue) == -1) {
            setCiptizenshipValue = "";
        }
    }
    if (_this.moduleId.indexOf("CUST_EXPERIENCE_INFO") > -1) {
        setFieldsAtt(_this, CUST_EXPERIENCE_INFO, "CITIZENSHIP", "FIELD_DICT_FILTER", setCiptizenshipFilter);
        setFieldsAtt(_this, CUST_EXPERIENCE_INFO, "CITIZENSHIP", "DEFAULT_VALUE", setCiptizenshipValue);
        setFieldsAtt(_this, CUST_EXPERIENCE_INFO, "CITIZENSHIP", "FIELD_CONTROL", setCiptizenshipControl);
        _this.$blMethod.isDictClean(CUST_EXPERIENCE_INFO.CITIZENSHIP);
    }
    checkCITIZENSHIP(_this, setCiptizenshipValue);
}
//校验生日和性别是否跟证件号一致  不一致则置空
const checkBirthDayOrSex = (_this) => {
    let CUST_CARD_INFO = _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].FIELDS;
    let idType = _.get(CUST_CARD_INFO, "ID_TYPE.DEFAULT_VALUE", "");
    let birthday = _.get(CUST_CARD_INFO, "BIRTHDAY.DEFAULT_VALUE", "");
    let idCode = _.get(CUST_CARD_INFO, "ID_CODE.DEFAULT_VALUE", "");
    let sex = _.get(CUST_CARD_INFO, "SEX.DEFAULT_VALUE", "");
    //根据身份证获取性别生日
    if (["00", "0s"].indexOf(idType) > -1) {
        let newSex = utils.getSex(idCode) == "M" ? "0" : "1";
        let newBirthday = utils.getBirthday(idCode);
        if (birthday != newBirthday) {
            setFieldsAtt(_this, CUST_CARD_INFO, "BIRTHDAY", "DEFAULT_VALUE", "");
        }
        if (sex != newSex) {
            setFieldsAtt(_this, CUST_CARD_INFO, "SEX", "DEFAULT_VALUE", "");
        }
    }
}
const checkFzYmtData = async (_this, field) => {
    let isOpenAcct = _this.$storage.getSession(_this.$definecfg.IS_OPEN_ACCT_BIZ);
    // 开户才需要检查
    if(isOpenAcct == "0"){
        let CUST_CARD_INFO = _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].FIELDS;
        let CUST_FZCARD_INFO = _this.groupDatas.CUST_INFO.CUST_FZCARD_INFO[0].FIELDS;
        let custFname = _.get(CUST_CARD_INFO, "CUST_FNAME.DEFAULT_VALUE", "");
        let fzIdType = _.get(CUST_FZCARD_INFO, "FZ_ID_TYPE.DEFAULT_VALUE", "");
        let fzIdCode = _.get(CUST_FZCARD_INFO, "FZ_ID_CODE.DEFAULT_VALUE", "");
        setFieldsAtt(_this, CUST_FZCARD_INFO, "FZ_ID_CODE", "VALIDATE_AT_SAME_VALUE", "0");
        _this.removeFlowTip("checkFzYmtData");
        let flag = false;
        // 三个都存在则进行查询
        if (custFname && fzIdType && fzIdCode) {
            _this.loading = true;
            _this.loadingText = "一码通账户查询中,请稍候...";
            flag = await getFzYmtData(_this, custFname, fzIdType, fzIdCode);
            _this.loading = false;
        }
        if (flag) {
            let idTypeDict = _.get(CUST_FZCARD_INFO, "FZ_ID_TYPE.FIELD_DICT_NAME", []);
            let fzIdTypeDict = _.get(_.find(idTypeDict, {DICT_ITEM: fzIdType}), "DICT_ITEM_NAME") || "";
            // 将证件号清空 并提示
            _this.pushFlowTip({
                title: `您的【${fzIdTypeDict}】已开立一码通账户，不允许重复开户。`,
                key: "checkFzYmtData",
                type: 'error'
            })
            setFieldsAtt(_this, CUST_FZCARD_INFO, "FZ_ID_CODE", "DEFAULT_VALUE", "");
        }
        return flag;
    }
}
//证件类型为0s-港澳台居民居住证 辅助证件改变 是否与国籍一致 如果不一致
const checkFzIdCardCitizenship = (_this) => {
    let isOpenAcct = _this.$storage.getSession(_this.$definecfg.IS_OPEN_ACCT_BIZ);
    if(isOpenAcct == "0"){
        //开户不做此逻辑 控制
        return;
    }
    let custBasicInfo = custInfoModel.getOriginaCustBasicInfo(_this.oppBusiData.oldBusiData);
    let oldCITIZENSHIP = custBasicInfo.CITIZENSHIP || "";
    let oldFzIdType = custBasicInfo.FZ_ID_TYPE || "";
    let CUST_CARD_INFO = _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].FIELDS;
    let CUST_FZCARD_INFO = _this.groupDatas.CUST_INFO.CUST_FZCARD_INFO[0].FIELDS;
    let newIdType = _.get(CUST_CARD_INFO, "ID_TYPE.DEFAULT_VALUE", "");
    let newFzIdType = _.get(CUST_FZCARD_INFO, "FZ_ID_TYPE.DEFAULT_VALUE", "");
    let idTypeDict = _.get(CUST_FZCARD_INFO, "FZ_ID_TYPE.FIELD_DICT_NAME", []);
    let oldFzIdTypeDict = _.get(_.find(idTypeDict, {DICT_ITEM: oldFzIdType}), "DICT_ITEM_NAME") || "无";
    let newFzIdTypeDict = _.get(_.find(idTypeDict, {DICT_ITEM: newFzIdType}), "DICT_ITEM_NAME") || "";
    _this.removeFlowTip("checkFzIdCardCitizenship");
    if (newIdType == "0s" && oldCITIZENSHIP && newFzIdType) {
        if (newFzIdType == "0b" && oldCITIZENSHIP == "HKG") {
            return;
        }
        if (newFzIdType == "0c" && oldCITIZENSHIP == "MAC") {
            return;
        }
        if (newFzIdType == "0d" && oldCITIZENSHIP == "CTN") {
            return;
        }
        // 存在禁止提示的情况下，移除‘稍后需采集您的辅助身份证件，请您继续办理。’提示
        _this.removeFlowTip("changeFzInfoTip");
        _this.pushFlowTip({
            title: `您的辅助证件类型为“${newFzIdTypeDict}”，需同步变更国籍信息，请您前往柜台办理。`,
            key: "checkFzIdCardCitizenship",
            type: 'error'
        })
    }
}
//判断是否国籍变化了 如果变化了 则提示
const checkCITIZENSHIP = (_this, setCiptizenshipValue) => {
    let isOpenAcct = _this.$storage.getSession(_this.$definecfg.IS_OPEN_ACCT_BIZ);
    if(isOpenAcct == "0"){
        //开户不做此逻辑 控制
        return;
    }
    let custBasicInfo = custInfoModel.getOriginaCustBasicInfo(_this.oppBusiData.oldBusiData);
    let oldCITIZENSHIP = custBasicInfo.CITIZENSHIP || "";
    let oldType = custBasicInfo.ID_TYPE || "";
    let CUST_EXPERIENCE_INFO = _this.groupDatas.CUST_INFO.CUST_EXPERIENCE_INFO[0].FIELDS;
    let newCITIZENSHIP = setCiptizenshipValue;
    let CUST_CARD_INFO = _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].FIELDS;
    let newIdType = _.get(CUST_CARD_INFO, "ID_TYPE.DEFAULT_VALUE", "");
    let idTypeDict = _.get(CUST_CARD_INFO, "ID_TYPE.FIELD_DICT_NAME", []);
    let oldTypeDict = _.find(idTypeDict, {DICT_ITEM: oldType}).DICT_ITEM_NAME;
    let newIdTypeDict = _.find(idTypeDict, {DICT_ITEM: newIdType}).DICT_ITEM_NAME;
    if (oldCITIZENSHIP && oldCITIZENSHIP != newCITIZENSHIP && oldType != newIdType) {
        _this.pushFlowTip({
            title: `您的证件类型由“${oldTypeDict}”修改为“${newIdTypeDict}”，需同步变更国籍信息，请您前往柜台办理。`,
            key: "checkCITIZENSHIP",
            type: 'error'
        })
        _this.disableNext = true;
        return;
    }
    _this.busiLogic.fieldDataChange(_this, CUST_CARD_INFO.ID_TYPE, CUST_CARD_INFO, _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0]); 
    _this.removeFlowTip("checkCITIZENSHIP");
}
//校验三要素是否修改了
const isChangeThree = (_this) => {
    let CUST_CARD_INFO = _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].FIELDS; 
    let idType = _.get(CUST_CARD_INFO, "ID_TYPE.DEFAULT_VALUE", "");
    let idCode = _.get(CUST_CARD_INFO, "ID_CODE.DEFAULT_VALUE", "");
    let fname = _.get(CUST_CARD_INFO, "CUST_FNAME.DEFAULT_VALUE", "");
    let custBasicInfo = custInfoModel.getOriginaCustBasicInfo(_this.oppBusiData.oldBusiData);
    let oldType = custBasicInfo.ID_TYPE || "";
    let oldCode = custBasicInfo.ID_CODE || "";
    let oldFname = custBasicInfo.CUST_FNAME || "";
    // 如果是升位，算未修改三要素
    // let idCodeTo18Flag = utils.updateCardNo(oldCode) == idCode;
    // let flag = idType != oldType || (idCode != oldCode && !idCodeTo18Flag) || fname != oldFname;
    let flag = idType != oldType || idCode != oldCode || fname != oldFname;
    return flag
}
//三要素修改后 的校验
const checkCustThreeEle = (_this) => {
    let isChangeThreFlag = isChangeThree(_this);
    //关联关系
    _this.removeFlowTip("checkThreeRelation");
    if (isChangeThreFlag && _this.oppBusiData.parentRelationFlag != undefined &&!_this.oppBusiData.parentRelationFlag) {
        _this.pushFlowTip({
            title: "您的证券账户关联关系未确认，不允许变更名称、证件类型/证件号码，若需变更，请先进行关联关系确认。",
            key: "checkThreeRelation",
            type: 'error',
            buttonText: "关联关系确认",
            isShowButton: true,
            buttonFn: () => {
                _this.$storage.removeSession(_this.$definecfg.B_SNO);
                _this.$storage.removeSession(_this.$definecfg.EVALUATE_SN); 
                let menuObj = _this.$storage.getJsonSession(_this.$definecfg.ALL_MENU).find(o => o.BUSI_CODE == "V0007") || {};
                _this.$store.commit(_this.$types.UPDATE_MENU_NAME, menuObj && menuObj.MENU_NAME);
                _this.$storage.setSession(_this.$definecfg.BUSI_NAME, menuObj && menuObj.MENU_NAME);
                _this.$router.replace({ name: 'customerCheck', params: { busiCode: "V0007", userType: _this.userType } });
            }
        })
        return true;
    }
    //银河信息
    _this.removeFlowTip("checkThreeBank");
    if(isChangeThreFlag && _this.oppBusiData.isBankTip) {
        _this.pushFlowTip({
            title: "您账户绑定的存管银行不支持在券商端修改银行账户的关键信息，请您稍后前往银行柜台进行银行账户资料变更，否则可能影响转账功能。",
            key: "checkThreeBank",
            type: 'warning'
        })
        return true;
    }
    
}
//实际控制人和受益人 校验
const checkControlOrBeneficiary = (_this) => {
    //控制人
    let CUST_CONTROLER_INFO = _this.groupDatas.RELA_INFO.CUST_CONTROLER_INFO[0].FIELDS;
    let controlerIsSelf = _.get(CUST_CONTROLER_INFO, "IS_SELF.DEFAULT_VALUE", "") == "1" ? true : false;
    //受益人
    let CUST_BENEFICIARY_INFO_ARR = _this.groupDatas.RELA_INFO.CUST_BENEFICIARY_INFO;
    let beneficiaryHavIsSelf = !_.isEmpty(_.find(CUST_BENEFICIARY_INFO_ARR, moduleItem => {
        return _.get(moduleItem, "FIELDS.IS_SELF.DEFAULT_VALUE", "") == "1"
    }))
    let cbIsSelfTip = "";
    if (controlerIsSelf && !beneficiaryHavIsSelf) {
        cbIsSelfTip = "您本次修改的证件信息将同步修改至实际控制人信息";
        
    }
    if (controlerIsSelf && beneficiaryHavIsSelf) {
        cbIsSelfTip = "您本次修改的证件信息将同步修改至实际控制人信息和受益人信息";
    }
    if (!controlerIsSelf && beneficiaryHavIsSelf) {
        cbIsSelfTip = "您本次修改的证件信息将同步修改至受益人信息";
    }
    return cbIsSelfTip;
}
//职业信息同客户 年龄 性别比较提示
const checkVocationAndAge = function (_this){
    let oldData = oldCustBasicInfo(_this);
    let CUST_CARD_INFO = _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].FIELDS;
    let CUST_EXPERIENCE_INFO = _this.groupDatas.CUST_INFO.CUST_EXPERIENCE_INFO[0].FIELDS;
    let vacationValue = _.get(CUST_EXPERIENCE_INFO, "OCCU_TYPE.DEFAULT_VALUE", "");
    let birthdayValue = _.get(CUST_CARD_INFO, "BIRTHDAY.DEFAULT_VALUE", "") || _.get(oldData, "BIRTHDAY", "");
    let sexValue = _.get(CUST_CARD_INFO, "SEX.DEFAULT_VALUE", "");;
    let ageValue = date.getDifferYears(birthdayValue, date.getClientDate());
    let occuTypeDictName = bizPublicMethod.$blMethod.getFieldValueName(CUST_EXPERIENCE_INFO.OCCU_TYPE.FIELD_DICT_NAME, vacationValue) || "";
    let tipString = "";
    let flag = false;
    if (["21","22","23","24","25","26","27","28","29","30","31","35","39","41","44","45","46","49","50","52","54"].indexOf(vacationValue) > -1 && parseInt(ageValue) > 65) {
        flag = true;
    }
    if (["32", "33"].indexOf(vacationValue) > -1 && parseInt(ageValue) > 62) {
        flag = true;
    }
    if( ["36", "37", "38", "40", "42", "43", "47", "48"].indexOf(vacationValue) > -1 && (parseInt(ageValue) > 62 && parseInt(sexValue) == 0 || parseInt(ageValue) > 57 && parseInt(sexValue) == 1)){
        flag = true;
    }
    if( ["55"].indexOf(vacationValue) > -1 && (parseInt(ageValue) < 50 && parseInt(sexValue) == 0 || parseInt(ageValue) < 45 && parseInt(sexValue) == 1)){
        flag = true;
    }
    if(["53"].indexOf(vacationValue) > -1 && parseInt(ageValue) > 57){
        flag = true;
    }
    if(["58"].indexOf(vacationValue) > -1 && parseInt(ageValue) > 32){
        flag = true;
    }
    tipString = flag && "您提供的职业为“"+ occuTypeDictName +"”，年龄为“" + parseInt(ageValue) +"”周岁，请核对职业信息是否准确，若有误，请进行修改。";
    return tipString;
}
//职业提示 显示相关按钮
const checkVocationDetail = (_this) => {
    let tipString = checkVocationAndAge(_this);
    let CUST_EXPERIENCE_INFO = _this.groupDatas.CUST_INFO.CUST_EXPERIENCE_INFO[0].FIELDS;
    if(tipString  != ""){
        setFieldsAtt(_this, CUST_EXPERIENCE_INFO, "VOCATION_CONFORM_SELECT", "FIELD_CONTROL", "0");
        setFieldsAtt(_this, CUST_EXPERIENCE_INFO, "VOCATION_CONFORM", "FIELD_CONTROL", "0");
        setFieldsAtt(_this, CUST_EXPERIENCE_INFO, "VOCATION_CONFORM", "DEFAULT_VALUE", tipString);
    } else {
        let oldData = oldCustBasicInfo(_this);
        let VOCATION_CONFORM_SELECT_VALUE = "";
        if (oldData.VOCATION_CONFORM_SELECT) {
            VOCATION_CONFORM_SELECT_VALUE = oldData.VOCATION_CONFORM_SELECT;
        }
        setFieldsAtt(_this, CUST_EXPERIENCE_INFO, "VOCATION_CONFORM_SELECT", "FIELD_CONTROL", "1");
        setFieldsAtt(_this, CUST_EXPERIENCE_INFO, "VOCATION_CONFORM_SELECT", "DEFAULT_VALUE", VOCATION_CONFORM_SELECT_VALUE);
        setFieldsAtt(_this, CUST_EXPERIENCE_INFO, "VOCATION_CONFORM", "FIELD_CONTROL", "1");
    }
}

//根据字典、dict_item返回dict_item_name
const getDictItemName = (dicts, dictItem) => {
    let dictItemName = "";
    let dict = _.find(dicts, {DICT_ITEM: dictItem}) || {};
    dictItemName = _.get(dict, "DICT_ITEM_NAME");
    return dictItemName;
}
//return 0= 不需要公安联网校验  1=公安联网校验通过  2=传入参数有问题 3=请求超时 4=校验失败 5=检测不到的异常 后期要写上5对应的出错日志
const validateThree = (_this) => {
    let IS_NEED_POLICE = _this.$blMethod.getJsonSessionBusiCommParam(_this, "IS_NEED_POLICE") == "0";
    if(IS_NEED_POLICE) {
        return "0";
    }
    let CUST_CARD_INFO = _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].FIELDS;
    if (!CUST_CARD_INFO.CUST_FNAME.DEFAULT_VALUE) {
        _this.messageAlert("身份信息校验，客户全称不能为空！");
        return "2";
    }
    if (!util.isCommonChar(CUST_CARD_INFO.CUST_FNAME.DEFAULT_VALUE)) {
        _this.messageAlert("姓名包含生僻字，不支持公安联网校验！");
        return "2";
    }
    if (!CUST_CARD_INFO.ID_TYPE.DEFAULT_VALUE) {
        _this.messageAlert("身份信息校验，证件类型不能为空！");
        return "2";
    }
     if (["00", "08", "0S"].indexOf(CUST_CARD_INFO.ID_TYPE.DEFAULT_VALUE) == -1) {
        _this.messageAlert("证件类型不是身份证、临时身份证或港澳台居民居住证，不支持中登身份校验");
        return "2";
    }
     if (!CUST_CARD_INFO.ID_CODE.DEFAULT_VALUE) {
        _this.messageAlert("身份信息校验，证件号码不能为空！");
        return "2";
    }
    let params = {
        CUST_FNAME: _.get(CUST_CARD_INFO, "CUST_FNAME.DEFAULT_VALUE", ""),
        USER_NAME: _.get(CUST_CARD_INFO, "CUST_FNAME.DEFAULT_VALUE", ""),
        ID_TYPE: _.get(CUST_CARD_INFO, "ID_TYPE.DEFAULT_VALUE", ""),
        ID_CODE: _.get(CUST_CARD_INFO, "ID_CODE.DEFAULT_VALUE", ""),
        USER_TYPE: _.get(CUST_CARD_INFO, "USER_TYPE.DEFAULT_VALUE", ""),
        SEX: _.get(CUST_CARD_INFO, "SEX.DEFAULT_VALUE", ""),
        BIRTHDAY: _.get(CUST_CARD_INFO, "BIRTHDAY.DEFAULT_VALUE", "")
    }
    if(stringConfig.isEmptyStr(params.USER_TYPE)){
        params.USER_TYPE = _this.userType;
    }
    return csdsSerivce.validate(params).then( res => {
        let tempResult = {};
        Object.assign(tempResult, res);
        if("1" === tempResult.flag || "true" === tempResult.flag || true === tempResult.flag) {
            _this.oppBusiData.isCscdAndPoliceChecked = true;
            _this.oppBusiData.IDCARD_CHECK_FLAG = "1";
            return "1";
        }
        return custService.runPoliceValidate(params).then( policeRes => {
            if (policeRes.flag === true) {
                _this.oppBusiData.isCscdAndPoliceChecked = true;
                _this.oppBusiData.IDCARD_CHECK_FLAG = "1";
                return "1";
            }else if(policeRes.flag === false){
                _this.messageAlert("公安联网校验失败，请您前往柜台办理。");
                return "4";
            }else{
                _this.messageAlert("公安联网校验失败，请您前往柜台办理。");
                return "5";
            }
            return "1";
        }).catch(error => {
            _this.messageAlert("公安联网校验失败，请您前往柜台办理。");
            return "3";
        })
    })
}
