/* 
 *   个人-开户基本信息模块
 *   方法封装
 *   @author  linsc
 */
import stringConfig from "../../../../../tools/stringConfig"
import stringPinyinConfig from "../../../../../tools/stringPinyinConfig"
import bizPublicSaveMethod from '../../../../businessTools/bizPublicSaveMethod'
import date from '../../../../../tools/date.js'
import mobile from '../../../../../tools/mobile.js'
import * as utils from "../../../../../tools/util"
import smsService from '../../../../../service/sms-service'
import oppService from '../../../../../service/opp-service';
import custService from '../../../../../service/cust-service';

//默认送  手机加证件
const ACCTBIZ_CLS = ["03"]

/**
 * 查询证券账户开户初始化数据
 */
const getAcctOpenInitData = (_this) => {
    let custInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
    return _this.$syscfg.K_Request("W0000075", {
        BUSI_CODE: _this.busiCode,
        USER_TYPE: _this.userType,
        ID_TYPE: custInfo.ID_TYPE
    });
};

const getNewCustCode = (_this, orgCode) => {
    return _this.$syscfg.K_Request("Y1100001", {
        INT_ORG: orgCode,
        USER_ROLE: "1"
    })
}

/**
* 逐个过滤出开户逻辑数据
* @param param
* @param openLogicData
*/
const filterOpenLogicData = function (param, openLogicData) {
    var rtnObj = {
        SUBJECT_IDENTITY: [],
        INOUTSIDE_IDENTITY: [],
        OCCU_TYPE: [],
        LEGAL_REP_TYPE: [],
        SZORG_TYPE: [],
        CITIZENSHIP: [],
        TRADE: [],
        PRO_CLS: []
    };

    if (!param || _.isEmpty(param)) {
        return rtnObj;
    }
    // 证件不为空
    if (!!param.ID_TYPE) {
        openLogicData = _.filter(openLogicData, function (v) {
            return v.ID_TYPE == param.ID_TYPE // 匹配当前证件类型
                || (_.indexOf(["00", "08"], param.ID_TYPE) == -1 && v.ID_TYPE == "99"); // 若当前证件类型不是身份证、临时身份证、还需返回99类型的
        })
    }
    // 主体身份不为空
    if (!!param.SUBJECT_IDENTITY) {
        openLogicData = _.filter(openLogicData, function (v) {
            return _.indexOf(v.SUBJECT_IDENTITY.split(","), param.SUBJECT_IDENTITY) != -1;
        })
    }
    // 境内外标识不为空
    if (!!param.INOUTSIDE_IDENTITY) {
        openLogicData = _.filter(openLogicData, function (v) {
            return v.INOUTSIDE_IDENTITY == param.INOUTSIDE_IDENTITY;
        })
    }
    // 职业类型不为空
    if (!!param.OCCU_TYPE) {
        openLogicData = _.filter(openLogicData, function (v) {
            return _.indexOf(v.OCCU_TYPE.split(","), param.OCCU_TYPE) != -1;
        })
    }
    // 法人类型不为空
    if (!!param.LEGAL_REP_TYPE) {
        openLogicData = _.filter(openLogicData, function (v) {
            return _.indexOf(v.LEGAL_REP_TYPE.split(","), param.LEGAL_REP_TYPE) != -1;
        })
    }
    // 机构类型不为空
    if (!!param.SZORG_TYPE) {
        openLogicData = _.filter(openLogicData, function (v) {
            return _.indexOf(v.SZORG_TYPE.split(","), param.SZORG_TYPE) != -1;
        })
    }
    // 行业类型类型不为空
    if (!!param.TRADE) {
        openLogicData = _.filter(openLogicData, function (v) {
            return _.indexOf(v.TRADE.split(","), param.TRADE) != -1;
        })
    }
    // 产品类型不为空
    if (!!param.PRO_CLS) {
        openLogicData = _.filter(openLogicData, function (v) {
            return _.indexOf(v.PRO_CLS.split(","), param.PRO_CLS) != -1;
        })
    }
    // 国籍地区不为空
    if (!!param.CITIZENSHIP) {
        openLogicData = _.filter(openLogicData, function (v) {
            return _.indexOf(v.CITIZENSHIP.split(","), param.CITIZENSHIP) != -1;
        })
    }
    // 多条配置数据整合
    _.each(rtnObj, function (value, key) {
        _.each(openLogicData, function (item) {
            rtnObj[key] = _.union(rtnObj[key], item[key].split(","));
        });
    });
    return rtnObj;
}

const loadOpenLogicData = function (_this, loadWhichDataObj) {
    let ID_TYPE = _this.groupDatas["CUST_INFO"]["CUST_BASIC_INFO"]["0"]["FIELDS"]["ID_TYPE"],
        SUBJECT_IDENTITY = _this.groupDatas["CUST_INFO"]["CUST_OTHER_INFO"]["0"]["FIELDS"]["SUBJECT_IDENTITY"],
        INOUTSIDE_IDENTITY = _this.groupDatas["CUST_INFO"]["CUST_OTHER_INFO"]["0"]["FIELDS"]["INOUTSIDE_IDENTITY"],
        OCCU_TYPE = _this.groupDatas["CUST_INFO"]["CUST_OTHER_INFO"]["0"]["FIELDS"]["OCCU_TYPE"],
        CITIZENSHIP = _this.groupDatas["CUST_INFO"]["CUST_OTHER_INFO"]["0"]["FIELDS"]["CITIZENSHIP"],
        logicObj = filterOpenLogicData({
            ID_TYPE: ID_TYPE.DEFAULT_VALUE,
            SUBJECT_IDENTITY: SUBJECT_IDENTITY.DEFAULT_VALUE,
            INOUTSIDE_IDENTITY: (ID_TYPE.DEFAULT_VALUE == "00" || ID_TYPE.DEFAULT_VALUE == "08") ? "0" : INOUTSIDE_IDENTITY.DEFAULT_VALUE,
            OCCU_TYPE: OCCU_TYPE.DEFAULT_VALUE,
            CITIZENSHIP: CITIZENSHIP.DEFAULT_VALUE,
        }, _this.oppBusiData.allAcctOpenLogicData);
    // 修改需要重新加载数据的表单
    _.each(loadWhichDataObj, function (item, key) {
        var filterData = _.filter(item.FIELD_DICT_NAME, function (v) {
            return _.indexOf(logicObj[key], v.DICT_ITEM) != -1;
        });
        item.FIELD_DICT_FILTER = _.pluck(filterData, 'DICT_ITEM');
        if (item.FIELD_DICT_FILTER.length == 1) {
            item.DEFAULT_VALUE = item.FIELD_DICT_FILTER[0];
            item.FIELD_CONTROL == "2";
        }
    });
}

/**
 * 录入的职业信息需同客户的年龄、性别进行比对，不符合下列规则时需警告提示：“录入的职业信息与您的年龄不符，请您确认职业信息是否准确！”
 * @param {*} value 
 * @param {*} age 
 * @param {*} sex 
 */
const matchAgeSex = function (value,age,sex) {
    let res = true;
    switch (value){
        case '0':
        case '1':
        case '5':
        case 'E':
            res= age>60 ? false : true;
            break;
        case '4':
            res= age>32 ? false : true;
            break;
        case '6':
            res= age>55 ? false : true;
            break;
        case '8':
            res= age>65 ? false : true;
            break;
        case '9':
        case 'C':
            res= sex == '0' ? (age<50 ? false : true) : (age < 45 ? false: true);
            break;
        case 'B':
            res= sex == '0' ? (age<60 ? false : true) : (age < 55 ? false: true);
            break;
        default:
            res= true;
            break;
    }
    return res
}

/**
* 获取证券账户开户逻辑设置
* @param param
* @returns {*}
*/
const getBusiAcctOpenLogic=(_this, param) => {
    // // 初始化数据   
    return Promise.all([
        _this.$syscfg.K_Request("YG003405", _.extend(param||{}, {IS_USED: "1"})),
        _this.$syscfg.K_Request('Y3000001', {  
            LBM: "KUAS_L0001000",
            F_FUNCTION: "980302011",
            QUERY_MODE: "QUERY"
        })
    ]).then((res1) => {
       let logicArr = res1[0].Data;
       let overInfo = res1[1].Data,
           overseasOrgInfo = _.map(overInfo, function (v) {
               return v.CITIZENSHIP;
           }).join(",");

       //银河个性  如果账户未配置境外证券(期货)监管机构信息   就取开户信息逻辑
       if(_this.$syscfg.isQSMZ("YINHE") && overseasOrgInfo.length === 0){
           return logicArr;
       }
       _.each(logicArr, function (v) {
           if (v.SUBJECT_IDENTITY == "b") {
               v.CITIZENSHIP = overseasOrgInfo;
           }
       });
       return logicArr;
   });
}
const setFzIdType = function (_this, curIdType, citizenship) {
    let fzInfo = _this.groupDatas.CUST_INFO.CUST_OTHER_ID_INFO[0].FIELDS;
    if ("0s" == curIdType) {//港澳台居民居住证
        var fzIdType = "";
        switch (citizenship) {
            case "HKG":
                fzIdType = "0b";
                break;
            case "MAC":
                fzIdType = "0c";
                break;
            case "CTN":
                fzIdType = "0d";
                break;
        }
        //自动勾选证件类型且不可编辑
        fzInfo.FZ_ID_TYPE.DEFAULT_VALUE = fzIdType;
        fzInfo.FZ_ID_TYPE.FIELD_CONTROL = '2';
        //清除掉证件号码跟证件日期
        // fzInfo.FZ_ID_CODE.DEFAULT_VALUE = '';
        // fzInfo.FZ_ID_EXP_DATE.DEFAULT_VALUE = '';
    } else if (_.includes(["0b", "0c", "0d"], curIdType)) {
        fzInfo.FZ_ID_TYPE.FIELD_CONTROL = '0';
    }
}

export default {
    //业务初始化
    openBizCustInfoNodeBeforeLoadBiz: function (_this) {
        let that = _this;
        console.log("openBizCustBasicInfoNodeBeforeLoadBiz");
        !_this.oppBusiData["busiData"] && (_this.oppBusiData["busiData"] = {});
        //保存读卡信息
        if (_this.cardData) {
            _this.oppBusiData.cardData = _this.cardData;
        }
        // 根据业务公共参数配置是否显示客户分组、开通协议、操作渠道、年收入字段
        let SHOW_EXT_INFO_FIELDS = oppService.getBusiCommonParamsByCode(_this.oppBusiData.busiCommonParamsArray, "SHOW_EXT_INFO_FIELDS") || "0";
        // 根据业务公共参数配置是否显示行业大类和子类
        let SHOW_INDUS_GB_FIELDS = oppService.getBusiCommonParamsByCode(_this.oppBusiData.busiCommonParamsArray, "SHOW_INDUS_GB_FIELDS") || "0";
        // 根据业务公共参数配置是否显示职业大类和子类 SHOW_OCCU_GB_FIELDS
        let SHOW_OCCU_GB_FIELDS = oppService.getBusiCommonParamsByCode(_this.oppBusiData.busiCommonParamsArray, "SHOW_OCCU_GB_FIELDS") || "0";
        if (SHOW_INDUS_GB_FIELDS == "1") {
            //_this.groupDatas.CUST_INFO.CUST_OTHER_INFO[0].FIELDS.INDUS_GB.FIELD_CONTROL = '0';
            //_this.groupDatas.CUST_INFO.CUST_OTHER_INFO[0].FIELDS.INDUS_GB_SUB.FIELD_CONTROL = '0';
        }
        if (SHOW_OCCU_GB_FIELDS == "1") {
            //_this.groupDatas.CUST_INFO.CUST_OTHER_INFO[0].FIELDS.OCCU_GB.FIELD_CONTROL = '0';
            //_this.groupDatas.CUST_INFO.CUST_OTHER_INFO[0].FIELDS.OCCU_GB_SUB.FIELD_CONTROL = '0';
        }

        //根据业务公参选择是否显示验证码  VALID_MOBILE  
        if (oppService.getBusiCommonParamsFromCacheObjs("VALID_MOBILE") == "1") {
            that.groupDatas.CUST_INFO.CUST_LINK_INFO[0].FIELDS.MOBILE_TEL.IS_SHOW_BUTTON = true;
            that.groupDatas.CUST_INFO.CUST_LINK_INFO[0].FIELDS.MOBILE_TEL.FIELD_BUTTON_TXT = "获取验证码";
            that.groupDatas.CUST_INFO.CUST_LINK_INFO[0].FIELDS.MOBILE_TEL.FIELD_CONTROL= "0";
            that.groupDatas.CUST_INFO.CUST_LINK_INFO[0].FIELDS.VALIDATE_CODE.FIELD_CONTROL= "0";
        } else {
            that.groupDatas.CUST_INFO.CUST_LINK_INFO[0].FIELDS.MOBILE_TEL.IS_SHOW_BUTTON = false;
            that.groupDatas.CUST_INFO.CUST_LINK_INFO[0].FIELDS.MOBILE_TEL.FIELD_CONTROL= "1";
            that.groupDatas.CUST_INFO.CUST_LINK_INFO[0].FIELDS.VALIDATE_CODE.FIELD_CONTROL= "1";
        }

        return Promise.all([
            custService.getCustModelSet(_this),
            custService.getOpenTemplateData(_this),
            getAcctOpenInitData(_this),
        ]).then(res => {
            let OPEN_TEMPLATE_DATA = _.filter(res[0].Data, v => {
                return v.USER_TYPE == _this.userType;
            })[0];
            if (!OPEN_TEMPLATE_DATA) {
                throw "开户模板未配置！"
            }
            _this.oppBusiData.OPEN_TEMPLATE_DATA = OPEN_TEMPLATE_DATA;
            _this.oppBusiData.OPEN_TEMPLATE_DATA.RMB_INT_RATE_SN = res[1].Data[0].RMB_INT_RATE_SN;
            _this.oppBusiData.OPEN_TEMPLATE_DATA.HK_INT_RATE_SN = res[1].Data[0].HK_INT_RATE_SN;
            _this.oppBusiData.OPEN_TEMPLATE_DATA.US_INT_RATE_SN = res[1].Data[0].US_INT_RATE_SN;

            _this.oppBusiData.OPEN_TEMPLATE_DATA.RMB_DR_RATE_GRP = res[1].Data[0].RMB_DR_RATE_GRP;
            _this.oppBusiData.OPEN_TEMPLATE_DATA.HK_DR_RATE_GRP = res[1].Data[0].HK_DR_RATE_GRP;
            _this.oppBusiData.OPEN_TEMPLATE_DATA.US_DR_RATE_GRP = res[1].Data[0].US_DR_RATE_GRP;
            Object.assign(_this.oppBusiData,  _this.oppBusiData.OPEN_TEMPLATE_DATA)
            _this.oppBusiData.allAcctOpenLogicData = res[2].Data[0].openLogicData;
            //地址
            _this.groupDatas.CUST_INFO.CUST_LINK_INFO[0].FIELDS.MAIL_ADDR.FIELD_FUNCTION = "USE_ID_ADDRESS";
            //动态绑定 修复无法修改按钮文字bug
            _this.$set(_this.groupDatas.CUST_INFO.CUST_LINK_INFO[0].FIELDS.MAIL_ADDR, "FIELD_BUTTON_TXT", "从证件地址同步")
            // _this.groupDatas.CUST_INFO.CUST_LINK_INFO[0].FIELDS.MAIL_ADDR.FIELD_BUTTON_TXT = "从证件地址同步"

        }).catch(err => {
            _this.alert(err);
        })

    },
    openBizCustInfoNodeAfterLoadBiz: function (_this) {
        console.log("openBizCustBasicInfoNodeAfterLoadBiz");
        let custInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);

        //客户三要素填充
        _this.groupDatas["CUST_INFO"]["CUST_BASIC_INFO"]["0"]["FIELDS"]["CUST_FNAME"].DEFAULT_VALUE = custInfo.CUST_FNAME;
        _this.groupDatas["CUST_INFO"]["CUST_BASIC_INFO"]["0"]["FIELDS"]["ID_TYPE"].DEFAULT_VALUE = custInfo.ID_TYPE;
        _this.groupDatas["CUST_INFO"]["CUST_BASIC_INFO"]["0"]["FIELDS"]["ID_CODE"].DEFAULT_VALUE = custInfo.ID_CODE;

        _this.oppBusiData.CUST_FNAME = custInfo.CUST_FNAME
        _this.oppBusiData.ID_TYPE = custInfo.ID_TYPE
        _this.oppBusiData.ID_CODE = custInfo.ID_CODE

        if (stringConfig.isEmptyStr(_this.groupDatas.CUST_INFO.CUST_OTHER_INFO[0].FIELDS.CITIZENSHIP.DEFAULT_VALUE)) {
            if (_this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.ID_TYPE.DEFAULT_VALUE == "00") {
                _this.groupDatas.CUST_INFO.CUST_OTHER_INFO[0].FIELDS.CITIZENSHIP.DEFAULT_VALUE = "CHN";
            }
        }
        //回填其他信息模块数据
        let otherInfo = _.get(_this.historyData,"CUST_INFO.CUST_BASIC_INFO[0]");
        let otherInfoFields = _this.groupDatas.CUST_INFO.CUST_OTHER_INFO[0].FIELDS
        if (!_.isEmpty(otherInfo)) {
            for(let fk in otherInfoFields){
                let field = otherInfoFields[fk];
                field.DEFAULT_VALUE = otherInfo[fk]||"";
            }
        }
        _this.groupDatas.CUST_INFO.HAVE_CREDIT_INFO[0].FIELDS.HAVE_CREDIT_INFO.isShowAllBtn = false;
        _this.groupDatasTpl.CUST_INFO.HAVE_CREDIT_INFO[0].FIELDS.HAVE_CREDIT_INFO.isShowAllBtn = false;
        let bitrhday = _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.BIRTHDAY.DEFAULT_VALUE;
        //修复开户业务续办直接点击了录入完成，没有进入基础信息模块导致的客观题目回填失败
        if(bitrhday){
            let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
            customerInfo.AGE = date.getDifferYears(bitrhday, date.getClientDate());
            customerInfo.BIRTHDAY = bitrhday;
            customerInfo.CUST_CODE =  customerInfo.CUST_CODE || _this.historyData.CUST_CODE;
            _this.$storage.setSession(_this.$definecfg.CUSTOMER_INFO, Object.assign({}, customerInfo));
        }

    },
    openBizCustInfoNodeValidate: function (_this) {
        let that = _this,
            customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
        
        if(that.moduleId.indexOf("CUST_BASIC_INFO") != -1){
            let CUST_BASIC_INFO = _this.groupDatas["CUST_INFO"]["CUST_BASIC_INFO"]["0"]["FIELDS"];
            let custBasicModule = _this.groupDatas["CUST_INFO"]["CUST_BASIC_INFO"][0];

            if (CUST_BASIC_INFO.ID_BEG_DATE.DEFAULT_VALUE && date.compareDate(CUST_BASIC_INFO.ID_BEG_DATE.DEFAULT_VALUE, date.getClientDate("yyyyMMdd")) == 1 ) {
                _this.pushFlowTip({
                    title:"客户的证件开始日期[" + CUST_BASIC_INFO.ID_BEG_DATE.DEFAULT_VALUE + "]不能晚于当前系统日期[" + date.getClientDate("yyyyMMdd") + "]！",
                    key:'warningTip',
                    type:'warning'
                })
                return false;
            }
            if (!custBasicModule.MODULE_ASH && CUST_BASIC_INFO.ID_EXP_DATE.DEFAULT_VALUE && date.compareDate(CUST_BASIC_INFO.ID_EXP_DATE.DEFAULT_VALUE, date.getClientDate("yyyyMMdd")) == -1 ) {
                _this.pushFlowTip({
                    title:"客户的证件结束日期[" + CUST_BASIC_INFO.ID_EXP_DATE.DEFAULT_VALUE + "]不能早于当前系统日期[" + date.getClientDate("yyyyMMdd") + "]！",
                    key:'warningTip',
                    type:'warning'
                })
                return false;
            }
            if (CUST_BASIC_INFO.BIRTHDAY.DEFAULT_VALUE && CUST_BASIC_INFO.ID_BEG_DATE.DEFAULT_VALUE && date.compareDate(CUST_BASIC_INFO.BIRTHDAY.DEFAULT_VALUE,CUST_BASIC_INFO.ID_BEG_DATE.DEFAULT_VALUE) == 1) {
                _this.pushFlowTip({
                    title:"证件开始日期[" + CUST_BASIC_INFO.ID_BEG_DATE.DEFAULT_VALUE + "]不能早于出生日期[" + CUST_BASIC_INFO.BIRTHDAY.DEFAULT_VALUE + "]！",
                    key:'warningTip',
                    type:'warning'
                })
                return false;
            }
            if (CUST_BASIC_INFO.BIRTHDAY.DEFAULT_VALUE && CUST_BASIC_INFO.ID_EXP_DATE.DEFAULT_VALUE && date.compareDate(CUST_BASIC_INFO.BIRTHDAY.DEFAULT_VALUE,CUST_BASIC_INFO.ID_EXP_DATE.DEFAULT_VALUE) == 1) {
                _this.pushFlowTip({
                    title:"证件结束日期[" + CUST_BASIC_INFO.ID_EXP_DATE.DEFAULT_VALUE + "]不能早于出生日期[" + CUST_BASIC_INFO.BIRTHDAY.DEFAULT_VALUE + "]！",
                    key:'warningTip',
                    type:'warning'
                })
                return false;
            }
            if (CUST_BASIC_INFO.ID_BEG_DATE.DEFAULT_VALUE && CUST_BASIC_INFO.ID_EXP_DATE.DEFAULT_VALUE && date.compareDate(CUST_BASIC_INFO.ID_BEG_DATE.DEFAULT_VALUE,CUST_BASIC_INFO.ID_EXP_DATE.DEFAULT_VALUE) == 1) {
                _this.pushFlowTip({
                    title:"证件结束日期[" + CUST_BASIC_INFO.ID_EXP_DATE.DEFAULT_VALUE + "]不能早于证件开始日期[" + CUST_BASIC_INFO.ID_BEG_DATE.DEFAULT_VALUE + "]！",
                    key:'warningTip',
                    type:'warning'
                })
                return false;
            }
        } else if(that.moduleId.indexOf("CUST_OTHER_INFO") != -1){
             /**境内外身份不显示在界面上，系统按照综合运营平台的《开户信息逻辑配置》自动取默认值传到后台 */
            let ID_TYPE = that.groupDatas["CUST_INFO"]["CUST_BASIC_INFO"]["0"]["FIELDS"]["ID_TYPE"],
            logicObj = filterOpenLogicData({
                ID_TYPE: ID_TYPE.DEFAULT_VALUE,
            }, that.oppBusiData.allAcctOpenLogicData)
            let INOUTSIDE_IDENTITY = logicObj["INOUTSIDE_IDENTITY"].length==1 ? logicObj["INOUTSIDE_IDENTITY"][0] :"";
            if(INOUTSIDE_IDENTITY == "") {
                that.messageBox({
                    hasMask: true,
                    messageText: "开户逻辑配置错误，请系统管理员检查!",
                    confirmButtonText: '确定',
                    typeMessage: 'error',
                    showMsgBox: true
                })
                return false;
            }
            that.groupDatas["CUST_INFO"]["CUST_OTHER_INFO"]["0"]["FIELDS"].INOUTSIDE_IDENTITY.DEFAULT_VALUE = INOUTSIDE_IDENTITY;
        } else  if(that.moduleId.indexOf("CUST_LINK_INFO") != -1){
            //强制中登手机号码校验
            let IS_CSDC_CHECK_MOBILE = oppService.getBusiCommonParamsByCode(that.oppBusiData.busiCommonParamsArray, "IS_CSDC_CHECK_MOBILE") || "1",
                IS_USE_JIZHU_CHECK = oppService.getBusiCommonParamsByCode(that.oppBusiData.busiCommonParamsArray, "IS_USE_JIZHU_CHECK") || "1",
                custLinkInfo = that.groupDatas["CUST_INFO"]["CUST_LINK_INFO"]["0"]["FIELDS"];
                //手机号码中登校验储存信息
                _this.oppBusiData.mobileInfo = _this.oppBusiData.mobileInfo || {};
            if(IS_CSDC_CHECK_MOBILE == "1") {
                if(custLinkInfo.MOBILE_TEL.DEFAULT_VALUE != ""){
                    if(_this.oppBusiData.mobileInfo.mobile != custLinkInfo.MOBILE_TEL.DEFAULT_VALUE){
                        that.loadingText="中登手机号码核查";
                        if (_.indexOf(["00","08"], that.userType) == -1 && IS_USE_JIZHU_CHECK) {
                            return new Promise((resolve, reject) => {
                                mobile.mobileValidate({
                                    CUST_FNAME: customerInfo.CUST_FNAME,
                                    ID_TYPE:  customerInfo.ID_TYPE,
                                    ID_CODE: customerInfo.ID_CODE,
                                    MOBILE_TEL: custLinkInfo.MOBILE_TEL.DEFAULT_VALUE,
                                    INT_ORG: customerInfo.INT_ORG,
                                    USER_TYPE: customerInfo.USER_TYPE,
                                    CUST_CODE: customerInfo.CUST_CODE || "",
                                    ACCTBIZ_CLS: ACCTBIZ_CLS[0],//默认送手机加证件
                                    JIZHU_FLAG: false
                                }).then(function (res) {
                                    _this.loading = false;
                                    _this.oppBusiData.mobileInfo.mobile = _.cloneDeep(custLinkInfo.MOBILE_TEL.DEFAULT_VALUE)
                                    _this.oppBusiData.mobileInfo.MOBILE_CHECK_FLAG = res[0].flag || "0";
                                    _this.validateInfo.result=[{
                                        busiCode: _.get(res[0].result[0],"NAME",""),
                                        checkRes:_.get(res[0].result[0],"FLAG","") == "0" ? "不通过" : "通过",
                                        output:_.get(res[0].result[0],"OUTPUT",""),
                                    }]
                                    _this.oppBusiData.mobileInfo.isMobileChecked = true;
                                    _this.$refs.validateInfoBox.show();
                                });
                            }) 
                        }
                    }
                    
                } else {
                    that.messageBox({
                        hasMask: true,
                        messageText: "中登手机号码校验，手机号码不能为空！!",
                        confirmButtonText: '确定',
                        typeMessage: 'error',
                        showMsgBox: true
                    })
                    return false;
                }
            }
        }
    },
    openBizCustInfoNodeBeforeSave: function (_this, params) {
        let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
        let userInfo = _this.$storage.getJsonSession(_this.$definecfg.USER_INFO);
        let tempSaveBasicObject = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "CUST_BASIC_INFO");
        let tempSaveLinkObject = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "CUST_LINK_INFO");
        let tempSaveOtherObject = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "CUST_OTHER_INFO");
        if(_this.moduleId.indexOf("CUST_LINK_INFO") != -1){
            //；联系信息模块添加字段
            tempSaveLinkObject.isChinese = tempSaveOtherObject.CITIZENSHIP == "CHN" ? true : false;
            tempSaveLinkObject.MOBILE_CHECK_FLAG =_this.oppBusiData.mobileInfo.MOBILE_CHECK_FLAG || tempSaveLinkObject.MOBILE_CHECK_FLAG || "0";
            tempSaveLinkObject.JIZHU_OBJ = {};
            tempSaveLinkObject.ACCTBIZ_CLS = ACCTBIZ_CLS;
        }
        
        Object.assign(customerInfo, tempSaveBasicObject, tempSaveLinkObject, tempSaveOtherObject);
        customerInfo.AGE = date.getDifferYears(tempSaveBasicObject.BIRTHDAY, date.getClientDate());
        customerInfo.INT_ORG = userInfo.ORG_CODE;
        customerInfo.CUST_NAME = customerInfo.CUST_FNAME;
        customerInfo.ADDRESS = customerInfo.MAIL_ADDR;
        customerInfo.USER_TYPE = _this.userType;
        customerInfo.CUST_CODE = params.CUST_CODE;
        _this.$storage.setSession(_this.$definecfg.CUSTOMER_INFO, Object.assign({}, customerInfo));
        let returnObj = {
            USER_TYPE: _this.userType,
            ORG_CODE: userInfo.ORG_CODE,
            // USER_CODE: custCodeCreateInfo.CUST_CODE,//用来覆盖流程中的柜员信息值 且填银河影像表单的数据
            USER_FNAME: customerInfo.CUST_FNAME,//用来覆盖流程中的柜员信息值 且填银河影像表单的数据
            USER_NAME: customerInfo.CUST_NAME,//用来覆盖流程中的柜员信息值 且填银河影像表单的数据
            CUST_FNAME: customerInfo.CUST_FNAME,
            CUST_NAME: customerInfo.CUST_NAME,
            CUST_ORG_NAME: userInfo.ORG_NAME,
            OP_REMARK: userInfo.OP_REMARK,
            AGE: customerInfo.AGE,
            SEX: customerInfo.SEX,
            BIRTHDAY: customerInfo.BIRTHDAY,
            EDUCATION: customerInfo.EDUCATION,
            VOCATION: customerInfo.VOCATION || "",
            OCCU_TYPE: customerInfo.OCCU_TYPE,
            ID_BEG_DATE: customerInfo.ID_BEG_DATE,
            ID_EXP_DATE: customerInfo.ID_EXP_DATE,
            ID_TYPE: customerInfo.ID_TYPE,
            ID_CODE: customerInfo.ID_CODE,
            CITIZENSHIP: customerInfo.CITIZENSHIP,
            // APPO_INFO: that.APPO_INFO,
            // APPT_SERIAL_NO: that.APPT_SERIAL_NO,
            UNDER_AGE: customerInfo.UNDER_AGE || "",
            SUBJECT_IDENTITY: customerInfo.SUBJECT_IDENTITY,
            PROF_INVESTOR_TYPE: "0",
            PROF_INVESTOR_SOURCE: "00",
        };
        customerInfo.PROF_INVESTOR_TYPE = "0";
        customerInfo.PROF_INVESTOR_SOURCE = "00";
        params.MONITOR_ACCT_FLAG = "0";
        Object.assign(params, returnObj, customerInfo);
        params.CUST_INFO = {
            CUST_BASIC_INFO: customerInfo,
            IDCARD_READ_FLAG: _this.cardData ? "1" : "0",
            // IDCARD_CHECK_FLAG: custBasicInfo.IDCARD_CHECK_FLAG,
            CUST_LINK_INFO: tempSaveLinkObject,
            CUST_OPEN_TEMPLATE: _this.oppBusiData.OPEN_TEMPLATE_DATA
        };
        let baseInfoObj = _.pick(returnObj, "USER_TYPE", "SUBJECT_IDENTITY", "OCCU_TYPE", "LEGAL_REP_TYPE", "INOUTSIDE_IDENTITY", "CITIZENSHIP", "ID_TYPE", "SZORG_TYPE");
        return getBusiAcctOpenLogic(_this, baseInfoObj).then(res => {
            _this.oppBusiData.openLogicData = res;
            params.openLogicData = res;
            if (!params.CUST_CODE) {
                return Promise.all([getNewCustCode(_this, userInfo.ORG_CODE)]).then(res => {
                    if (res && res[0] && res[0].Data[0] && res[0].Data[0].USER_CODE) {
                        params.CUST_CODE = res[0].Data[0].USER_CODE;
                        params.USER_CODE = res[0].Data[0].USER_CODE;
                        customerInfo.CUST_CODE = res[0].Data[0].USER_CODE;
                        _this.$storage.setSession(_this.$definecfg.CUSTOMER_INFO, Object.assign({}, customerInfo));
                    } else {
                        _this.alert("客户号生产失败！");
                    }
                }).catch(err => {
                    console.error(err)
                    _this.alert("客户号生产失败！");
                })
            }
        })
    },
    openBizCustInfoNodePageActivated: function (_this) {
        _this.groupDatas["CUST_INFO"]["CUST_BASIC_INFO"]["0"]["FIELDS"]["CUST_FNAME"].FIELD_CONTROL = "2";
        _this.groupDatas["CUST_INFO"]["CUST_BASIC_INFO"]["0"]["FIELDS"]["ID_TYPE"].FIELD_CONTROL = "2";
        _this.groupDatas["CUST_INFO"]["CUST_BASIC_INFO"]["0"]["FIELDS"]["ID_CODE"].FIELD_CONTROL = "2";
        if(_this.moduleId.includes('CUST_OTHER_ID_INFO')){
            _this.busiLogic.CHECK_ID_TYPE(_this,_this.groupDatas["CUST_INFO"]["CUST_BASIC_INFO"]["0"]["FIELDS"]["ID_TYPE"], _this.groupDatas["CUST_INFO"]["CUST_BASIC_INFO"]["0"]["FIELDS"])
            if(_this.oppBusiData.AGE < 18) {
                _this.groupDatas["CUST_INFO"]["CUST_OTHER_INFO"]["0"]["FIELDS"]["SUBJECT_IDENTITY"].DEFAULT_VALUE == "1"
                _this.groupDatas["CUST_INFO"]["CUST_OTHER_INFO"]["0"]["FIELDS"]["SUBJECT_IDENTITY"].FIELD_CONTROL == "2"

            }
        }
    },

    //--------------------------------------------------检查逻辑--------------------------------------------------
    /**
     *【CHECK_ID_CODE】证件号码相关逻辑
     * a)证件类型为“身份证”时，根据号码自动计算出性别、自动填充主体身份，可编辑
     */
    "CHECK_ID_CODE": (_this, field, fieldData) => {
        //字段为空 或者 不是基础信息模块下的字段 不做校验
        if (field.DEFAULT_VALUE == "" || (["CUST_BASIC_INFO"].indexOf(field.MODULE_ID) == -1)) {
            return;
        }
        field.DEFAULT_VALUE = _.trim(field.DEFAULT_VALUE);
        let value = field.DEFAULT_VALUE,
            SEX = "SEX",
            BIRTHDAY = "BIRTHDAY";
        if (SEX in fieldData) { // 关联性别
            let f = fieldData[SEX];
            if ((_this.oppBusiData.ID_TYPE == "00" || _this.oppBusiData.ID_TYPE == "08") && value && utils.IDCardCheck(value)) {
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

            }
        }
        if (BIRTHDAY in fieldData) { // 关联出生日期
            let f = fieldData[BIRTHDAY];
            if ((_this.oppBusiData.ID_TYPE == "00" || _this.oppBusiData.ID_TYPE == "08" || _this.oppBusiData.ID_TYPE == "0s") && value && utils.IDCardCheck(value)) {
                f.DEFAULT_VALUE = utils.getBirthday(value);
                f.FIELD_CONTROL = '2';
            } else {
                f.FIELD_CONTROL = '0';
            }
        }
        _this.oppBusiData["ID_CODE"] = field.DEFAULT_VALUE;
    },
    "CHECK_ID_TYPE": (_this, field, fieldData) => {
        if (!field.DEFAULT_VALUE) {
            return
        }
        let otherInfo = _this.groupDatas.CUST_INFO.CUST_OTHER_INFO[0].FIELDS;
        if (field.DEFAULT_VALUE == "00" || field.DEFAULT_VALUE == "08") {
            otherInfo.INOUTSIDE_IDENTITY.DEFAULT_VALUE == "0";
        }
        let loadFzIdType =  function (idType) {
            let custOtherInfo = _this.groupDatas.CUST_INFO.CUST_OTHER_INFO[0].FIELDS;
            let custOtherIdInfo = _this.groupDatas.CUST_INFO.CUST_OTHER_ID_INFO[0];
            let fieldDatas = custOtherIdInfo.FIELDS;
            let showFlag =  ["0b", "0c", "0d", "0s"].includes(idType),
                fzIdTypes = idType == "0s" ? ["0b", "0c", "0d"] : ["0s"],
                fieldsArr = ["FZ_ID_TYPE", "FZ_ID_CODE", "FZ_ID_EXP_DATE"];
            if (showFlag) {
                custOtherIdInfo.MODULE_CONTROL = '1';
                _.forEach(fieldsArr, key=>{
                    fieldDatas[key].FIELD_CONTROL = '0';
                    fieldDatas[key].FIELD_REQUIRED = idType == "0s" ? "1" : "0" ;
                })
                // that.$longCheckFzIdExpDate.obviousbox("enable");
                fieldDatas.FZ_ID_TYPE.FIELD_DICT_FILTER =  fzIdTypes;
                //对于港澳台个人客户，辅助身份证明文件截止日期修改为非必填
                fieldDatas.FZ_ID_EXP_DATE.FIELD_REQUIRED = '0';
                //辅助证件类型的 国籍只能选台湾，澳门跟香港
                custOtherInfo.CITIZENSHIP.FIELD_DICT_FILTER = ['CTN','HKG','MAC']

            } else {
                custOtherInfo.CITIZENSHIP.FIELD_DICT_FILTER = [];
                custOtherIdInfo.MODULE_CONTROL = '0';
                _.forEach(fieldsArr, key=>{
                    fieldDatas[key].FIELD_CONTROL = '2';
                    fieldDatas[key].DEFAULT_VALUE = "" ;
                })
            }
        }
        //显示隐藏辅助证件模块信息
        loadFzIdType(field.DEFAULT_VALUE)
        loadOpenLogicData(_this, {
            SUBJECT_IDENTITY: otherInfo.SUBJECT_IDENTITY,
            INOUTSIDE_IDENTITY: otherInfo.INOUTSIDE_IDENTITY,
            CITIZENSHIP: otherInfo.CITIZENSHIP,
            OCCU_TYPE: otherInfo.OCCU_TYPE,
        })
    },
    "CHECK_CREDIT_TYPE": (_this, field, fieldData) => {
        if (field.DEFAULT_VALUE == "99") {
            fieldData.CREDIT_TYPE_EXP.FIELD_CONTROL = "0";
            fieldData.CREDIT_TYPE_EXP.FIELD_REQUIRED = "1";
        } else {
            fieldData.CREDIT_TYPE_EXP.FIELD_CONTROL = "1";
            fieldData.CREDIT_TYPE_EXP.FIELD_REQUIRED = "0";
            fieldData.CREDIT_TYPE_EXP.DEFAULT_VALUE = "";
        }
    },
    "CHECK_CITIZENSHIP":(_this, field, fieldData) => {
        let idType = _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.ID_TYPE.DEFAULT_VALUE;
        if(_this.$syscfg.isQSMZ("YINHE")){
            //非银河版本需要检查黑名单
            // if (.ID_TYPE && formData.ID_CODE) {
            //     that.isInBlackList($.extend({}, formData, {
            //         CITIZENSHIP: obj.dict_val
            //     })).then(function (flag) {
            //         if (!flag) {
            //             that.$CITIZENSHIP.combobox("clear");
            //         } else {
            //             that.setFzIdType(that.$ID_TYPE.combobox("getValue"), obj.dict_val);
            //         }
            //     });
            // }
        } else {
            setFzIdType(_this, idType, field.DEFAULT_VALUE);
        }
        //如果不是中国大陆以及港澳台地区，则不用填写民族
        if(["CHN","CTN","HKG","MAC"].indexOf(field.DEFAULT_VALUE) == -1){
            let NATIONALITY = _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.NATIONALITY;
            NATIONALITY.FIELD_CONTROL = '1';
            NATIONALITY.FIELD_CONTROL = '';
        }
    },
    "CHECK_OTHER_INFO_OCCU_TYPE": (_this, field, fieldData) => {
        let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
        // if (field.DEFAULT_VALUE == "99") {
        //     fieldData.OCCUPATION.FIELD_CONTROL = "0";
        //     fieldData.OCCUPATION.FIELD_REQUIRED = "1";
        // } else {
        //     fieldData.OCCUPATION.FIELD_CONTROL = "1";
        //     fieldData.OCCUPATION.FIELD_REQUIRED = "0";
        //     fieldData.OCCUPATION.DEFAULT_VALUE = "";
        // }
        _this.removeFlowTip('occuTypeWarning');
        if(matchAgeSex(field.DEFAULT_VALUE,customerInfo.AGE,customerInfo.SEX) == false) {
            _this.pushFlowTip({
                title: '录入的职业信息与您的年龄不符，请您确认职业信息是否准确！',
                type: 'warning',
                key: 'occuTypeWarning'
            });
        }
        loadOpenLogicData(_this, {
            SUBJECT_IDENTITY: fieldData.SUBJECT_IDENTITY,
            INOUTSIDE_IDENTITY: fieldData.INOUTSIDE_IDENTITY,
            CITIZENSHIP: fieldData.CITIZENSHIP,
        })
    },
    "CHECK_SUBJECT_IDENTITY": (_this, field, fieldData) => {
        if (field.DEFAULT_VALUE == "1") {
            fieldData.UNDER_AGE.FIELD_CONTROL = "0";
            fieldData.UNDER_AGE.FIELD_REQUIRED = "1"
        } else {
            fieldData.UNDER_AGE.FIELD_CONTROL = "1";
            fieldData.UNDER_AGE.FIELD_REQUIRED = "0"
            fieldData.UNDER_AGE.DEFAULT_VALUE = "";
        }
        loadOpenLogicData(_this, {
            INOUTSIDE_IDENTITY: fieldData.INOUTSIDE_IDENTITY,
            OCCU_TYPE: fieldData.OCCU_TYPE,
        })
    },
    "CHECK_INOUTSIDE_IDENTITY": (_this, field, fieldData) => {
        loadOpenLogicData(_this, {
            CITIZENSHIP: fieldData.CITIZENSHIP,
            OCCU_TYPE: fieldData.OCCU_TYPE,
        })
    },
    "CHECK_INDUS_GB": (_this, field, fieldData) => {
        if (field.DEFAULT_VALUE != "") {
            fieldData.INDUS_GB_SUB.DEFAULT_VALUE = ""
            fieldData.INDUS_GB_SUB.FIELD_DICT_FILTER = _.chain(fieldData.INDUS_GB_SUB.FIELD_DICT_NAME).map(v => {
                return v.DICT_ITEM;
            }).filter(v => {
                return _.startsWith(v, field.DEFAULT_VALUE);
            }).value();
        }
    },
    "CHECK_OCCU_GB": (_this, field, fieldData) => {
        if (field.DEFAULT_VALUE != "") {
            fieldData.OCCU_GB_SUB.DEFAULT_VALUE = ""
            fieldData.OCCU_GB_SUB.FIELD_DICT_FILTER = _.chain(fieldData.OCCU_GB_SUB.FIELD_DICT_NAME).map(v => {
                return v.DICT_ITEM;
            }).filter(v => {
                return _.startsWith(v, field.DEFAULT_VALUE);
            }).value();
        }
    },
    "CHECK_CUST_FNAME": (_this, field, fieldData) => {
        if (stringConfig.isNotEmptyStr(field.DEFAULT_VALUE)) {
            if (stringConfig.isEmptyStr(_this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.CUST_NAME.DEFAULT_VALUE)) {
                _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.CUST_NAME.DEFAULT_VALUE = field.DEFAULT_VALUE;
            }
        }
    },
    "CHECK_VALIDATE_CODE":function(_this, field, fieldData){
        if(field.DEFAULT_VALUE == "") {}
        if(field.DEFAULT_VALUE && field.correct){
            let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
                _this.removeFlowTip('mobile');
                if(field.DEFAULT_VALUE){
                    if(_this.oppBusiData.AUTH_ID){
                        if(_this.oppBusiData.isTimeout60){
                            return smsService.checkUpValidCode({
                                AUTH_ID : _this.oppBusiData.AUTH_ID,
                                AUTH_CODE: field.DEFAULT_VALUE,
                                MOBILE:fieldData.MOBILE_TEL.DEFAULT_VALUE
                            }).then(function(res){
                                if(res.CHECK_FLAG && res.CHECK_FLAG == "1"){
                                    _this.oppBusiData.currentMobile = fieldData.MOBILE_TEL.DEFAULT_VALUE
                                    _this.oppBusiData.IDENTIFY_CODE_CHECK_FLAG = true;
                                    fieldData.MOBILE_TEL.IS_SHOW_BUTTON = false;
                                    // field.DEFAULT_VALUE = "";
                                    field.message = '';
                                    field.FIELD_CONTROL = "2";
                                    return '';
                                }else{
                                    _this.oppBusiData.IDENTIFY_CODE_CHECK_FLAG = false;
                                    field.message = '请输入正确的验证码'
                                    return '请输入正确的验证码';
                                }
                            })
                        }else{
                            return new Promise((resolve) => {
                                resolve('请重新发送验证码')
                            })
                        }
                    }else{
                        return new Promise((resolve) => {
                            resolve('请输入正确的验证码')
                        })
                    }
                }else{
                    return new Promise((resolve) => {
                        resolve('请输入验证码')
                    })
                }
            // }
        }else if(field.DEFAULT_VALUE == ''){
            return new Promise((resolve) => {
                resolve('请输入验证码')
            })
        }else if(field.DEFAULT_VALUE != '') {
            return new Promise((resolve) => {
                resolve('请输入正确的验证码')
            })
        }
    },
    "CHECK_MOBILE_TEL__CLICK": (_this, field, fieldData) => {
        let that = _this;
        field.FIELD_REQUIRED = "1";
        if(fieldData.MOBILE_TEL.DEFAULT_VALUE && fieldData.MOBILE_TEL.correct){
            let customerInfo = that.$storage.getJsonSession(that.$definecfg.CUSTOMER_INFO),
                userInfo = that.$storage.getJsonSession(that.$definecfg.USER_INFO),
            params = {
                CUST_CODE: customerInfo.CUST_CODE ||  that.historyData.CUST_CODE || "",//银河证券需要入参客户代码和客户姓名
                CUST_NAME: customerInfo.CUST_NAME ||  that.historyData.CUST_NAME || "",
                B_SNO: that.$storage.getSession(that.$definecfg.B_SNO) || "",
                ORG_CODE: userInfo.ORG_CODE,
                MOBILE: fieldData.MOBILE_TEL.DEFAULT_VALUE,
                IDF_LENGTH: "",
                // AUTH_LENGTH:'验证码长度 默认6位  入参5=5位  入参4=4位',
                // TPL_ID:'模板编号',
                // REMARK:'备注信息',
                EXP_SECS:90 //有效期
            };
            _this.loading = true;
            that.loadingText='短信验证码发送中...';
            smsService.getSmsValidCode(params).then(function(resultObj){
                if(resultObj && resultObj.SEND_FLAG == "1"){
                    field.FIELD_CONTROL = "0"
                    //vue深层次响应理
                    that.messageBox({
                        hasMask:true,
                        messageText:"验证码已发送到:【" + params.MOBILE + "】请注意查收！",
                        confirmButtonText:'确定',
                        typeMessage:'', 
                        showMsgBox:true  
                    });
                    _this.loading = false;
                    _this.$set(field,'BUTTON_ENABLE',true);
                    let remainTime = 90;
                    that.oppBusiData.interTimer = setInterval(function(){
                        remainTime--;
                        field.FIELD_BUTTON_TXT = `${remainTime}秒`;
                    },1000);
                    //发送验证码以后开始倒计时 设置标识 默认true
                    that.oppBusiData.isTimeout60 = true;
                    //将发送验证码的手机号码保存起来 当验证码通过后再修改手机号码时应该提示重新发送验证码
                    that.oppBusiData.currentMobile = fieldData.MOBILE_TEL.DEFAULT_VALUE;
                    setTimeout(() => {
                        that.oppBusiData.isTimeout60 = false;
                        _this.$set(field,'BUTTON_ENABLE',false);
                        _this.$set(_this.groupDatas.CUST_INFO.CUST_LINK_INFO[0].FIELDS.VALIDATE_CODE,'FIELD_BUTTON_TXT',`发送验证码`);
                        clearInterval(that.oppBusiData.interTimer);
                    },90000)
                    that.oppBusiData.AUTH_ID = resultObj.AUTH_ID;
                }else{
                    that.messageBox({
                        hasMask:true,
                        messageText:"获取验证码失败！",
                        confirmButtonText:'确定',
                        typeMessage:'error', 
                        showMsgBox:true  
                    });
                }
            }).catch(err=> {
                that.messageBox({
                    hasMask:true,
                    messageText:err,
                    confirmButtonText:'确定',
                    typeMessage:'error', 
                    showMsgBox:true  
                });
                _this.loading=false;
            });
        }
    },
    "CHECK_BIRTHDAY" : (_this, field, fieldData) => {

        if (field.DEFAULT_VALUE == "" || field.DEFAULT_VALUE == undefined) {
            return;
        }
        let CUST_BASIC_INFO = _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS;

        let AGE = date.getDifferYears(field.DEFAULT_VALUE, date.getClientDate());
        _this.oppBusiData.AGE = AGE;
        _this.removeFlowTip("birthtip");
        if(_this.$definecfg.QSJGDM_CONST[_this.$basecfg.qsVersion] == "YINHE" && CUST_BASIC_INFO.ID_TYPE.DEFAULT_VALUE == "09" && AGE < 18){
            field.DEFAULT_VALUE=""
            _this.pushFlowTip({
                title:"客户证件类型为“其他证件”，出生日期不允许录入小于18岁！",
                key:'birthtip',
                type:'warning'
            })
        }
    }
}
