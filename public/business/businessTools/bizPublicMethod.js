/* 
 *   所有业务公共方法
 *   方法封装
 *   @author  yangyp
 */
import custSerivce from "../../service/cust-service.js"
import oppService from '../../service/opp-service.js'
import stringConfig from '../../tools/stringConfig.js';
import dict from '../../tools/dict';
import bizTaxMethod from "./bizTaxMethod.js";
import keyFieldMap from "../../pages/imageAcquisition/common/key-field-map"
import smsService from '../../service/sms-service'
import  * as nativeBridgeService from '../../service/nativeBridge-service'
import * as utils from "../../tools/util"
import keysJson from "../../config/cust-keys-json";//字段翻译
import date from "../../tools/date.js";
import store from "../../vuex";
import sysConfig from "../../config/sysConfig";
import csdcService from "../../service/csdc-service.js";
import custService from "../../service/cust-service.js";
const validateMobile = "validateMobile"
const bizPublicMethod = {
    //获取客户的全量信息
    getCustomerAllData: function (_this) {
        let customerAllData = {
            Code: "0",
            Data: []
        };
        let c = _this.$storage.getJsonSession(_this.$definecfg.CUST_ALL_INFO);
        if (c) {
            //基本信息里面如果没有辅助证件相关信息，就手动添加一个空值 @liwei2
            c.BASIC_INFO && !c.BASIC_INFO.OTHER_CUST_NAME && (c.BASIC_INFO.OTHER_CUST_NAME = "");
            c.BASIC_INFO && !c.BASIC_INFO.OTHER_ID_CODE && (c.BASIC_INFO.OTHER_ID_CODE = "");
            c.BASIC_INFO && !c.BASIC_INFO.OTHER_ID_EXP_DATE && (c.BASIC_INFO.OTHER_ID_EXP_DATE = "");
            c.BASIC_INFO && !c.BASIC_INFO.OTHER_ID_TYPE && (c.BASIC_INFO.OTHER_ID_TYPE = "");
            customerAllData["Data"].push(c);
            Object.assign(_this.oppBusiData, customerAllData.Data[0]);
        }
        return customerAllData && customerAllData.Data && customerAllData.Data[0].BASIC_INFO;
    },

    //判断是中国人
    isChinese: function (_this) {
        let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
        //true 属于外国人 true = 中国人
        return _.indexOf(["CHN", "CTN", "HKG", "MAC"], customerInfo.CITIZENSHIP) != -1;
    },

    //增加判断是身份证15位升18位标示
    is15To18CodeBool: function (_this) {
        let newBaseForm = _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0];
        if (_.trim(newBaseForm.FIELDS.ID_CODE.DEFAULT_VALUE).length === 18 && newBaseForm.FIELDS.ID_TYPE.DEFAULT_VALUE == "00") {
            return true;
        } else {
            return false;
        }
    },

    //增加判断是身份证15位升18位标示
    is15To18CodeFromCustInfoBool: function (_this) {
        let newBaseForm = this.getCustomerAllData(_this);
        if (_.trim(newBaseForm.ID_CODE).length === 18 && newBaseForm.ID_TYPE == "00") {
            return true;
        } else {
            return false;
        }
    },
    //增加判断是身份证15位升18位标示
    is15To18OrgInfoBool: function (_this) {
        let newBaseForm = this.getCustomerAllData(_this);
        if (_.trim(newBaseForm.ID_CODE).length === 15) {
            if (_this.groupDatas.CUST_BASIC_INFO.CUST_BASIC_INFO_STEP1[0].FIELDS.ID_CODE.DEFAULT_VALUE.length == 18) {
                return true;
            } else {
                return false;
            }

        } else {
            return false;
        }
    },

    //请求公安联网校验
    runPoliceValidate: function (_this) {
        // _this.loading = true;
        // _this.loadingText = '正在进行身份核实';
        let tempObj = _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS;
        if (_this.userType != "0" || tempObj.ID_TYPE.DEFAULT_VALUE != "00") {
            //如果不是个人用户，直接返回true 不用进行校验
            return true;
        }
        let that = this;

        let params = {
            ID_CODE: tempObj.ID_CODE.DEFAULT_VALUE,
            USER_NAME: tempObj.USER_FNAME.DEFAULT_VALUE || "",
        }
        let res = "";
        return custSerivce.runPoliceValidate(params).then(function (resultData) {
            if (resultData.flag) {
                _this.oppBusiData.policeCheckFlag = resultData.flag;
                _this.oppBusiData.policeData = resultData.result;
            }
            return resultData.flag;
        }).catch(err => {
            console.error('公安联网校验失败：' + err);
            res = "false";
            return res;
        });
    },

    //银行卡与本人信息是否一致
    setBankInfoToBasicInfo: function (_this) {
        if (_this.userType == "0") {
            _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.FULLNAME.DEFAULT_VALUE = _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.USER_FNAME.DEFAULT_VALUE;
            _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.IDTYPE.DEFAULT_VALUE = _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.ID_TYPE.DEFAULT_VALUE;
        } else {
            if (_this.busiCode == "V0009") {
                _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.FULLNAME.DEFAULT_VALUE = _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.USER_FNAME.DEFAULT_VALUE;
                _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.IDNO.DEFAULT_VALUE = _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.ID_CODE.DEFAULT_VALUE;
                _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.IDTYPE.DEFAULT_VALUE = _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.ID_TYPE.DEFAULT_VALUE;
            } else if (_this.busiCode == "V0011") {
                _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.FULLNAME.DEFAULT_VALUE = _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.USER_FNAME.DEFAULT_VALUE;
                _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.IDNO.DEFAULT_VALUE = _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.ID_CODE.DEFAULT_VALUE;
                _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.IDTYPE.DEFAULT_VALUE = _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.ID_TYPE.DEFAULT_VALUE;
            }
        }
    },

    //是否需要同步一码通
    isSyncYMTFlag: function (_this, oldBaseForm, newBaseForm) {
        //职业，联系地址，邮编，学历 需要同步中登
        if (_this.userType == "0") {
            if (_this.busiCode == "V0019") {
                return (oldBaseForm.USER_FNAME != newBaseForm.USER_FNAME.DEFAULT_VALUE ||
                    oldBaseForm.ID_CODE != newBaseForm.ID_CODE.DEFAULT_VALUE ||
                    oldBaseForm.ID_ADDR != newBaseForm.ID_ADDR.DEFAULT_VALUE ||
                    oldBaseForm.MAIL_ZIP_CODE != newBaseForm.MAIL_ZIP_CODE.DEFAULT_VALUE ||
                    oldBaseForm.OCCU_TYPE != newBaseForm.OCCU_TYPE.DEFAULT_VALUE ||
                    oldBaseForm.EDUCATION != newBaseForm.EDUCATION.DEFAULT_VALUE ||
                    oldBaseForm.ID_BEG_DATE != newBaseForm.ID_BEG_DATE.DEFAULT_VALUE ||
                    oldBaseForm.ID_EXP_DATE != newBaseForm.ID_EXP_DATE.DEFAULT_VALUE) ? "1" : "0";

            } else if (_this.busiCode == 'V0049') {
                //个人需要 发送中登得字段
                return (oldBaseForm.CITIZENSHIP != newBaseForm.CITIZENSHIP.DEFAULT_VALUE ||
                    oldBaseForm.ID_TYPE != newBaseForm.ID_TYPE.DEFAULT_VALUE ||
                    oldBaseForm.ID_CODE != newBaseForm.ID_CODE.DEFAULT_VALUE ||
                    oldBaseForm.ID_EXP_DATE != newBaseForm.ID_EXP_DATE.DEFAULT_VALUE ||
                    oldBaseForm.ID_ADDR != newBaseForm.ID_ADDR.DEFAULT_VALUE ||
                    oldBaseForm.ID_TYPE2 != newBaseForm.FZ_ID_TYPE.DEFAULT_VALUE ||
                    oldBaseForm.ID_CODE2 != newBaseForm.FZ_ID_CODE.DEFAULT_VALUE ||
                    oldBaseForm.ID_EXP_DATE2 != newBaseForm.FZ_ID_EXP_DATE.DEFAULT_VALUE ||
                    oldBaseForm.BIRTHDAY != newBaseForm.BIRTHDAY.DEFAULT_VALUE ||
                    oldBaseForm.SEX != newBaseForm.SEX.DEFAULT_VALUE ||
                    oldBaseForm.EDUCATION != newBaseForm.EDUCATION.DEFAULT_VALUE ||
                    oldBaseForm.NATIONALITY != newBaseForm.NATIONALITY.DEFAULT_VALUE ||
                    oldBaseForm.OCCU_TYPE != newBaseForm.OCCU_TYPE.DEFAULT_VALUE ||
                    oldBaseForm.FAX != newBaseForm.FAX ||
                    oldBaseForm.TEL != newBaseForm.TEL ||
                    oldBaseForm.MOBILE_TEL != newBaseForm.MOBILE_TEL ||
                    oldBaseForm.ADDRESS != newBaseForm.ADDRESS ||
                    oldBaseForm.EMAIL != newBaseForm.EMAIL ||
                    oldBaseForm.ZIP_CODE != newBaseForm.ZIP_CODE
                ) ? "1" : "0";
            } else {
                return (oldBaseForm.USER_FNAME != newBaseForm.USER_FNAME.DEFAULT_VALUE ||
                    oldBaseForm.ID_CODE != newBaseForm.ID_CODE.DEFAULT_VALUE ||
                    oldBaseForm.ID_TYPE != newBaseForm.ID_TYPE.DEFAULT_VALUE ||
                    oldBaseForm.ID_ADDR != newBaseForm.ID_ADDR.DEFAULT_VALUE ||
                    oldBaseForm.ID_BEG_DATE != newBaseForm.ID_BEG_DATE.DEFAULT_VALUE ||
                    oldBaseForm.ID_EXP_DATE != newBaseForm.ID_EXP_DATE.DEFAULT_VALUE) ? "1" : "0";
            }
        }else if (_this.userType == "1" || _this.userType == "2") {
            if (_this.busiCode == "V0019") {
                return (oldBaseForm.USER_FNAME != newBaseForm.USER_FNAME.DEFAULT_VALUE ||
                    oldBaseForm.ID_CODE != newBaseForm.ID_CODE.DEFAULT_VALUE ||
                    oldBaseForm.ID_ADDR != newBaseForm.ID_ADDR.DEFAULT_VALUE ||
                    oldBaseForm.MAIL_ZIP_CODE != newBaseForm.MAIL_ZIP_CODE.DEFAULT_VALUE ||
                    // oldBaseForm.OCCU_TYPE != newBaseForm.OCCU_TYPE.DEFAULT_VALUE ||
                    // oldBaseForm.EDUCATION != newBaseForm.EDUCATION.DEFAULT_VALUE ||
                    oldBaseForm.ID_BEG_DATE != newBaseForm.ID_BEG_DATE.DEFAULT_VALUE ||
                    oldBaseForm.ID_EXP_DATE != newBaseForm.ID_EXP_DATE.DEFAULT_VALUE) ? "1" : "0";

            } else if (_this.busiCode == 'V0049') {
                //个人需要 发送中登得字段
                return (oldBaseForm.CITIZENSHIP != newBaseForm.CITIZENSHIP.DEFAULT_VALUE ||
                    oldBaseForm.ID_TYPE != newBaseForm.ID_TYPE.DEFAULT_VALUE ||
                    oldBaseForm.ID_CODE != newBaseForm.ID_CODE.DEFAULT_VALUE ||
                    oldBaseForm.ID_EXP_DATE != newBaseForm.ID_EXP_DATE.DEFAULT_VALUE ||
                    oldBaseForm.ID_ADDR != newBaseForm.ID_ADDR.DEFAULT_VALUE ||
                    oldBaseForm.ID_TYPE2 != newBaseForm.FZ_ID_TYPE.DEFAULT_VALUE ||
                    oldBaseForm.ID_CODE2 != newBaseForm.FZ_ID_CODE.DEFAULT_VALUE ||
                    oldBaseForm.ID_EXP_DATE2 != newBaseForm.FZ_ID_EXP_DATE.DEFAULT_VALUE ||
                    oldBaseForm.BIRTHDAY != newBaseForm.BIRTHDAY.DEFAULT_VALUE ||
                    oldBaseForm.SEX != newBaseForm.SEX.DEFAULT_VALUE ||
                    oldBaseForm.EDUCATION != newBaseForm.EDUCATION.DEFAULT_VALUE ||
                    oldBaseForm.NATIONALITY != newBaseForm.NATIONALITY.DEFAULT_VALUE ||
                    oldBaseForm.OCCU_TYPE != newBaseForm.OCCU_TYPE.DEFAULT_VALUE ||
                    oldBaseForm.FAX != newBaseForm.FAX ||
                    oldBaseForm.TEL != newBaseForm.TEL ||
                    oldBaseForm.MOBILE_TEL != newBaseForm.MOBILE_TEL ||
                    oldBaseForm.ADDRESS != newBaseForm.ADDRESS ||
                    oldBaseForm.EMAIL != newBaseForm.EMAIL ||
                    oldBaseForm.ZIP_CODE != newBaseForm.ZIP_CODE
                ) ? "1" : "0";
            } else {
                return (oldBaseForm.USER_FNAME != newBaseForm.USER_FNAME.DEFAULT_VALUE ||
                    oldBaseForm.ID_CODE != newBaseForm.ID_CODE.DEFAULT_VALUE ||
                    oldBaseForm.ID_TYPE != newBaseForm.ID_TYPE.DEFAULT_VALUE ||
                    oldBaseForm.ID_ADDR != newBaseForm.ID_ADDR.DEFAULT_VALUE ||
                    oldBaseForm.ID_BEG_DATE != newBaseForm.ID_BEG_DATE.DEFAULT_VALUE ||
                    oldBaseForm.ID_EXP_DATE != newBaseForm.ID_EXP_DATE.DEFAULT_VALUE) ? "1" : "0";
            }
        }
    },
     //是否需要同步一码通
     isSyncYMTFlagByCardInfo: function (_this, oldBaseForm, newBaseForm) {
        //职业，联系地址，邮编，学历 需要同步中登
        if (_this.userType == "0") {
          if (_this.busiCode == 'V0049') {
                //个人需要 发送中登得字段
                return (oldBaseForm.CITIZENSHIP != newBaseForm.CITIZENSHIP.DEFAULT_VALUE ||
                    oldBaseForm.ID_TYPE != newBaseForm.ID_TYPE.DEFAULT_VALUE ||
                    oldBaseForm.ID_CODE != newBaseForm.ID_CODE.DEFAULT_VALUE ||
                    oldBaseForm.ID_EXP_DATE != newBaseForm.ID_EXP_DATE.DEFAULT_VALUE ||
                    oldBaseForm.ID_ADDR != newBaseForm.ID_ADDR.DEFAULT_VALUE ||
                    oldBaseForm.BIRTHDAY != newBaseForm.BIRTHDAY.DEFAULT_VALUE ||
                    oldBaseForm.SEX != newBaseForm.SEX.DEFAULT_VALUE ||
                    oldBaseForm.ADDRESS != newBaseForm.ADDRESS
                ) ? "1" : "0";
            } else {
                return (oldBaseForm.USER_FNAME != newBaseForm.USER_FNAME.DEFAULT_VALUE ||
                    oldBaseForm.ID_CODE != newBaseForm.ID_CODE.DEFAULT_VALUE ||
                    oldBaseForm.ID_TYPE != newBaseForm.ID_TYPE.DEFAULT_VALUE ||
                    oldBaseForm.ID_ADDR != newBaseForm.ID_ADDR.DEFAULT_VALUE ||
                    oldBaseForm.ID_BEG_DATE != newBaseForm.ID_BEG_DATE.DEFAULT_VALUE ||
                    oldBaseForm.ID_EXP_DATE != newBaseForm.ID_EXP_DATE.DEFAULT_VALUE) ? "1" : "0";
            }
        }else if (_this.userType == "1" || _this.userType == "2") {
            if (_this.busiCode == "V0019") {
                return (oldBaseForm.USER_FNAME != newBaseForm.USER_FNAME.DEFAULT_VALUE ||
                    oldBaseForm.ID_CODE != newBaseForm.ID_CODE.DEFAULT_VALUE ||
                    oldBaseForm.ID_ADDR != newBaseForm.ID_ADDR.DEFAULT_VALUE ||
                    oldBaseForm.MAIL_ZIP_CODE != newBaseForm.MAIL_ZIP_CODE.DEFAULT_VALUE ||
                    // oldBaseForm.OCCU_TYPE != newBaseForm.OCCU_TYPE.DEFAULT_VALUE ||
                    // oldBaseForm.EDUCATION != newBaseForm.EDUCATION.DEFAULT_VALUE ||
                    oldBaseForm.ID_BEG_DATE != newBaseForm.ID_BEG_DATE.DEFAULT_VALUE ||
                    oldBaseForm.ID_EXP_DATE != newBaseForm.ID_EXP_DATE.DEFAULT_VALUE) ? "1" : "0";

            } else if (_this.busiCode == 'V0049') {
                //个人需要 发送中登得字段
                return (oldBaseForm.CITIZENSHIP != newBaseForm.CITIZENSHIP.DEFAULT_VALUE ||
                    oldBaseForm.ID_TYPE != newBaseForm.ID_TYPE.DEFAULT_VALUE ||
                    oldBaseForm.ID_CODE != newBaseForm.ID_CODE.DEFAULT_VALUE ||
                    oldBaseForm.ID_EXP_DATE != newBaseForm.ID_EXP_DATE.DEFAULT_VALUE ||
                    oldBaseForm.ID_ADDR != newBaseForm.ID_ADDR.DEFAULT_VALUE ||
                    oldBaseForm.ID_TYPE2 != newBaseForm.FZ_ID_TYPE.DEFAULT_VALUE ||
                    oldBaseForm.ID_CODE2 != newBaseForm.FZ_ID_CODE.DEFAULT_VALUE ||
                    oldBaseForm.ID_EXP_DATE2 != newBaseForm.FZ_ID_EXP_DATE.DEFAULT_VALUE ||
                    oldBaseForm.BIRTHDAY != newBaseForm.BIRTHDAY.DEFAULT_VALUE ||
                    oldBaseForm.SEX != newBaseForm.SEX.DEFAULT_VALUE ||
                    oldBaseForm.EDUCATION != newBaseForm.EDUCATION.DEFAULT_VALUE ||
                    oldBaseForm.NATIONALITY != newBaseForm.NATIONALITY.DEFAULT_VALUE ||
                    oldBaseForm.OCCU_TYPE != newBaseForm.OCCU_TYPE.DEFAULT_VALUE ||
                    oldBaseForm.FAX != newBaseForm.FAX ||
                    oldBaseForm.TEL != newBaseForm.TEL ||
                    oldBaseForm.MOBILE_TEL != newBaseForm.MOBILE_TEL ||
                    oldBaseForm.ADDRESS != newBaseForm.ADDRESS ||
                    oldBaseForm.EMAIL != newBaseForm.EMAIL ||
                    oldBaseForm.ZIP_CODE != newBaseForm.ZIP_CODE
                ) ? "1" : "0";
            } else {
                return (oldBaseForm.USER_FNAME != newBaseForm.USER_FNAME.DEFAULT_VALUE ||
                    oldBaseForm.ID_CODE != newBaseForm.ID_CODE.DEFAULT_VALUE ||
                    oldBaseForm.ID_TYPE != newBaseForm.ID_TYPE.DEFAULT_VALUE ||
                    oldBaseForm.ID_ADDR != newBaseForm.ID_ADDR.DEFAULT_VALUE ||
                    oldBaseForm.ID_BEG_DATE != newBaseForm.ID_BEG_DATE.DEFAULT_VALUE ||
                    oldBaseForm.ID_EXP_DATE != newBaseForm.ID_EXP_DATE.DEFAULT_VALUE) ? "1" : "0";
            }
        }
    },
    //是否需要同步一码通 非关键信息变更
    isSyncYMTFlagNoImp: function (_this, oldBaseForm, newBaseForm) {
        //职业，联系地址，邮编，学历 需要同步中登
        if (_this.userType == "0") {
            return (newBaseForm.USER_FNAME && oldBaseForm.USER_FNAME != newBaseForm.USER_FNAME.DEFAULT_VALUE ||
                newBaseForm.ID_CODE && oldBaseForm.ID_CODE != newBaseForm.ID_CODE.DEFAULT_VALUE ||
                newBaseForm.ID_ADDR && oldBaseForm.ID_ADDR != newBaseForm.ID_ADDR.DEFAULT_VALUE ||
                newBaseForm.ZIP_CODE && oldBaseForm.ZIP_CODE != newBaseForm.ZIP_CODE.DEFAULT_VALUE ||
                newBaseForm.OCCU_TYPE && oldBaseForm.OCCU_TYPE != newBaseForm.OCCU_TYPE.DEFAULT_VALUE ||
                newBaseForm.EDUCATION && oldBaseForm.EDUCATION != newBaseForm.EDUCATION.DEFAULT_VALUE ||
                newBaseForm.NATIONALITY && oldBaseForm.NATIONALITY != newBaseForm.NATIONALITY.DEFAULT_VALUE ||
                newBaseForm.SEX && oldBaseForm.SEX != newBaseForm.SEX.DEFAULT_VALUE ||
                newBaseForm.CITIZENSHIP && oldBaseForm.CITIZENSHIP != newBaseForm.CITIZENSHIP.DEFAULT_VALUE ||
                newBaseForm.BIRTHDAY && oldBaseForm.BIRTHDAY != newBaseForm.BIRTHDAY.DEFAULT_VALUE ||
                newBaseForm.NATIVE_PLACE && oldBaseForm.NATIVE_PLACE != newBaseForm.NATIVE_PLACE.DEFAULT_VALUE ||
                newBaseForm.MOBILE_TEL && oldBaseForm.MOBILE_TEL != newBaseForm.MOBILE_TEL.DEFAULT_VALUE ||
                newBaseForm.EMAIL && oldBaseForm.EMAIL != newBaseForm.EMAIL.DEFAULT_VALUE ||
                newBaseForm.ADDRESS && oldBaseForm.ADDRESS != newBaseForm.ADDRESS.DEFAULT_VALUE ||
                newBaseForm.ID_BEG_DATE && oldBaseForm.ID_BEG_DATE != newBaseForm.ID_BEG_DATE.DEFAULT_VALUE ||
                newBaseForm.FAX && oldBaseForm.FAX != newBaseForm.FAX.DEFAULT_VALUE ||
                newBaseForm.TEL && oldBaseForm.TEL != newBaseForm.TEL.DEFAULT_VALUE ||
                newBaseForm.ID_EXP_DATE && oldBaseForm.ID_EXP_DATE != newBaseForm.ID_EXP_DATE.DEFAULT_VALUE) ? "1" : "0";

        } else {
            return (newBaseForm.USER_FNAME && oldBaseForm.USER_FNAME != newBaseForm.USER_FNAME.DEFAULT_VALUE ||
                newBaseForm.ID_CODE && oldBaseForm.ID_CODE != newBaseForm.ID_CODE.DEFAULT_VALUE ||
                newBaseForm.ID_TYPE && oldBaseForm.ID_TYPE != newBaseForm.ID_TYPE.DEFAULT_VALUE ||
                newBaseForm.ID_ADDR && oldBaseForm.ID_ADDR != newBaseForm.ID_ADDR.DEFAULT_VALUE ||
                newBaseForm.ID_BEG_DATE && oldBaseForm.ID_BEG_DATE != newBaseForm.ID_BEG_DATE.DEFAULT_VALUE ||
                newBaseForm.ID_EXP_DATE && oldBaseForm.ID_EXP_DATE != newBaseForm.ID_EXP_DATE.DEFAULT_VALUE) ? "1" : "0";
        }
    },

    //获取W000132 和 W000134请求参数
    getBaseRequestData: function (_this) {
        //获取业务基本数据
        let customerInfo = this.getCustomerAllData(_this);
        let int_org = customerInfo && customerInfo.INT_ORG ? customerInfo.INT_ORG : "";
        var basedata = {
            "BUSI_CODE": _this.busiCode,
            "USER_TYPE": customerInfo != null ? customerInfo.USER_TYPE : _this.userType,
            "ID_TYPE": customerInfo != null ? customerInfo.ID_TYPE : _this.oppBusiData.ID_TYPE,
            "ID_CODE": customerInfo != null ? customerInfo.ID_CODE : _this.oppBusiData.ID_CODE,
            "CUST_CODE": customerInfo != null ? customerInfo.CUST_CODE : "",
            "CUST_FNAME": customerInfo != null ? customerInfo.USER_FNAME : _this.oppBusiData.CUST_FNAME,
            "CITIZENSHIP": customerInfo != null ? customerInfo.CITIZENSHIP : _this.oppBusiData.CITIZENSHIP,
            "SUBJECT_IDENTITY": customerInfo != null ? customerInfo.SUBJECT_IDENTITY : _this.oppBusiData.SUBJECT_IDENTITY,
            "INT_ORG": int_org,
            "ORG_CODE": int_org
        }
        return basedata;
    },
    //获取W0000135请求参数
    getBlackListRequestData: function (_this) {
        //获取业务基本数据
        let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
        var basedata = {
            "ID_TYPE": customerInfo != null ? customerInfo.ID_TYPE : _this.oppBusiData.ID_TYPE,
            "CITIZENSHIP": customerInfo != null ? customerInfo.CITIZENSHIP : _this.oppBusiData.CITIZENSHIP,
            "SUBJECT_IDENTITY": customerInfo != null ? customerInfo.SUBJECT_IDENTITY : _this.oppBusiData.SUBJECT_IDENTITY,
        }
        return basedata;
    },

    //隐藏路由并且隐藏模块
    hideRouteAndMoudle: function (_this, routerName) {
        _this.$router.hideRoute(routerName);
        let pageIndex = -1;
        for (let i = 0; i < _this.$store.state.bizRouteTable.length; i++) {
            let r = _this.$store.state.bizRouteTable[i];
            if (r.name == routerName) {
                pageIndex = i;
                break;
            }
        }

        if (pageIndex > -1) {
            let routerObj = _this.$router.getRoute(pageIndex);
            console.log('routerObj===', routerObj);
            //1显示  0不显示
            if (routerObj.group && routerObj.modules.length) {
                _.forEach(routerObj.modules, function (moduleID) {
                    _.forEach(_this.groupDatas[routerObj.group][moduleID], (item, indexKey) => {
                        _this.groupDatas[routerObj.group][moduleID][indexKey].MODULE_CONTROL = "0"
                    })
                })
            }
        }
    },
    //显示路由并且显示隐藏模块
    showRouteAndMoudle: function (_this, routerName) {
        _this.$router.showRoute(routerName);
        let pageIndex = -1;
        for (let i = 0; i < _this.$store.state.bizRouteTable.length; i++) {
            let r = _this.$store.state.bizRouteTable[i];
            if (r.name == routerName) {
                pageIndex = i;
                break;
            }
        }

        if (pageIndex > -1) {
            let routerObj = _this.$router.getRoute(pageIndex);
            console.log('routerObj===', routerObj);
            //1显示  0不显示
            if (routerObj.group && routerObj.modules.length) {
                _.forEach(routerObj.modules, function (moduleID) {
                    _.forEach(_this.groupDatas[routerObj.group][moduleID], (item, indexKey) => {
                        _this.groupDatas[routerObj.group][moduleID][indexKey].MODULE_CONTROL = "1"
                    }) 
                })
            }
        }
    },
    //设置模块数组 显示或者隐藏  moduleContrl 0为隐藏 1位显示
    setModulesControl: function (mds, moduleContrl) {
        if (mds && mds.length) {
            mds.forEach(md => {
                md.MODULE_CONTROL = moduleContrl;
            })
        } else {
            console.log("设置模块不存在");
        }
    },
    //隐藏路由并且显示模块
    hideRouteAndShowMoudle: function (_this, routerName) {
        _this.$router.hideRoute(routerName);
        let pageIndex = -1;
        for (let i = 0; i < _this.$store.state.bizRouteTable.length; i++) {
            let r = _this.$store.state.bizRouteTable[i];
            if (r.name == routerName) {
                pageIndex = i;
                break;
            }
        }

        if (pageIndex > -1) {
            let routerObj = _this.$router.getRoute(pageIndex);
            console.log('routerObj===', routerObj);
            //1显示  0不显示
            if (routerObj.group && routerObj.modules.length) {
                _.forEach(routerObj.modules, function (moduleID) {
                    _this.groupDatas[routerObj.group][moduleID][0].MODULE_CONTROL = "1"
                })
            }
        }
    },
    //获取客户风险测评状态
    getCustRiskStatus: function (_this) {
        if (_this.$syscfg.isQSJG(_this.$definecfg.QSJGDM_CONST.GUOXIN)) {
            let tempSurveySn = "";
            return _this.$syscfg.getSysConfig("CUST_MAIN_SURVEY_SN", "99").then((response) => {
                if (response.Code == "0" && response.Data.length > 0) {
                    let tempSurveySnArr = response.Data[0].PAR_VAL.split(";");
                    if (_this.userType == "0") {
                        tempSurveySn = tempSurveySnArr[0]; //个人
                    } else if (_this.userType == "1") {
                        tempSurveySn = tempSurveySnArr[1]; // 机构
                    } else if (_this.userType == "2") {
                        if (tempSurveySnArr.length > 2) {
                            tempSurveySn = tempSurveySnArr[2]; //产品
                        } else {
                            tempSurveySn = tempSurveySnArr[1];
                        }
                    }
                }


                if (tempSurveySn) {
                    let custAllInfo = this.getCustomerAllData(_this);
                    return _this.$syscfg.K_Request("W0000102", {
                        ID_TYPE: custAllInfo.ID_TYPE,
                        USER_CODE: custAllInfo.CUST_CODE,
                        SURVEY_SN: tempSurveySn,
                        CUST_CODE: custAllInfo.CUST_CODE,
                        INT_ORG: custAllInfo.INT_ORG,
                        USER_ROLE: 1
                    }).then((res) => {
                        let ratingData = res.Data && res.Data[0]; //测试答案
                        return ratingData;
                    });
                } else {
                    return {};
                }
            });
        }
    },
    //弹出密码输入框  包括资金和银行卡密码
    /**
     * 
     * @param {*} _this 
     * @param {*} messageText 标题名称
     * @param {*} callBack 
     * @param {*} field 相应字段的字段信息
     */
    showPwdBox: function (_this, messageText, field, callBack) {
        let fieldId = field.FIELD_ID,
            fieldTitle = field.FIELD_TITLE;
        return _this.$prompt(fieldTitle, messageText, {
            customClass: 'pwd-msgbox ' + fieldId,
            showCancelButton: true,
            showClose: false,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /^\d{6}$/,
            inputType: 'password',
            inputErrorMessage: '密码格式不正确，只能为六位数字',
            beforeClose: function (action, instance, done) {
                if (action == 'confirm') { //需要在弹出框逻辑内做处理
                    //比较当前弹出框的值和fieldata里面的DEFAULT_VALUE比较 是否一致
                    if (instance.inputValue != field.DEFAULT_VALUE) {
                        instance.editorErrorMessage = '两次输入不一致，请重新输入';
                        return;
                    }
                }
                done();
            }
        }).then(({
            value
        }) => {
            callBack && callBack(true, value)
        }).catch( action => {
            callBack && callBack(false, action)
        })
    },
    //弹出重复输入检验框
    /**
     * 
     * @param {*} _this 
     * @param {*} messageText 标题名称
     * @param {*} callBack 回调处理
     * @param {*} field 相应字段的字段信息
     */
    showReEnterBox: function (_this, params, field, callBack) {
        let fieldId = field.FIELD_ID,
            fieldTitle = field.FIELD_TITLE;
        let inputPattern = params.inputPattern || '',
            inputType = params.inputType || '',
            inputErrorMessage = params.inputErrorMessage || '输入格式错误，请重新输入',
            messageText = params.messageText || '确认输入';
        return _this.$prompt(fieldTitle, messageText, {
            customClass: 'reenter-msgbox ' + fieldId,
            showCancelButton: true,
            showClose: false,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: inputPattern,
            inputType: inputType,
            inputErrorMessage: inputErrorMessage,
            beforeClose: function (action, instance, done) {
                if (action == 'confirm') { //需要在弹出框逻辑内做处理
                    //比较当前弹出框的值和fieldata里面的DEFAULT_VALUE比较 是否一致
                    if (instance.inputValue != field.DEFAULT_VALUE) {
                        instance.editorErrorMessage = '两次输入不一致，请重新输入';
                        return;
                    }
                }
                done();
            }
        }).then(({
            value
        }) => {
            callBack && callBack(true, value)
        }).catch( action => {
            callBack && callBack(false, action)
        })
    },
    /**
     * 根据身份证号得到姓别和精确计算年龄
     */
    analyzeIDCard: function (IDCard) {
        var sexAndAge = {};
        //获取用户身份证号码
        var userCard = IDCard;
        //如果身份证号码为undefind则返回空
        if (!userCard) {
            return sexAndAge;
        }
        //获取性别
        if (parseInt(userCard.substr(16, 1)) % 2 == 1) {
            sexAndAge.sex = '0' //（男）
        } else {
            sexAndAge.sex = '1' //（女）
        }
        //获取出生年月日
        //userCard.substring(6,10) + "-" + userCard.substring(10,12) + "-" + userCard.substring(12,14);
        var yearBirth = userCard.substring(6, 10);
        var monthBirth = userCard.substring(10, 12);
        var dayBirth = userCard.substring(12, 14);
        sexAndAge.birthDay = yearBirth + monthBirth + dayBirth;
        //获取当前年月日并计算年龄
        var myDate = new Date();
        var monthNow = myDate.getMonth() + 1;
        var dayNow = myDate.getDate();
        var age = myDate.getFullYear() - yearBirth;
        if (monthNow < monthBirth || (monthNow == monthBirth && dayNow < dayBirth)) {
            age--;
        }
        //得到年龄
        sexAndAge.age = age;
        //返回性别和年龄
        return sexAndAge;
    },
    //保存数据到客户信息里
    saveCustInfoTosession: function (_this, key, value) {
        let custInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
        if (!custInfo) {
            custInfo = {};
        }
        custInfo[key] = value;
        _this.$storage.setSession(_this.$definecfg.CUSTOMER_INFO, custInfo)
    },
    /**
     * filterIdCode 设置证件号码校验函数
     * @param _this
     */
    filterIdCode: function (_this, idTypefield, idCodeField, fieldData) {
        let idType = idTypefield.DEFAULT_VALUE;
        //加上判断 防止重复添加
        if (idType == "00") {
            idCodeField.VALID_TYPE = "cardno[true]|" + idCodeField.VALID_TYPE; // 更新证件号码的验证类型为身份证验证
        } else if (idType == "10") {
            idCodeField.VALID_TYPE = "busino|" + idCodeField.VALID_TYPE; // 中山个性 更新证件号码的验证类型为工商营业执照
        } else {
            idCodeField.VALID_TYPE = idCodeField.VALID_TYPE.replace('cardno[true]|', '').replace('|cardno[true]', '').replace('cardno', '').replace('busino|', '');
        }
    },
    by: function (name) {
        // 用于数组字典排序
        return function (o, p) {
            var a, b;
            if (typeof o === "object" && typeof p === "object" && o && p) {
                a = o[name];
                b = p[name];
                if (a === b) {
                    return 0;
                }
                a = parseInt(a);
                b = parseInt(b);
                return a < b ? -1 : 1;
            } else {
                throw "error";
            }
        };
    },
    /**
     * 提示框
     * @param messageText 提示内容,
     * @param confirmedAction 确认按钮事件,
     * @param canceledAction 取消按钮事件,
     * @param confirmButtonText 确认按钮文字,
     * @param cancelButtonText 取消按钮文字,
     * @returns false
     */
    showMsgBox: function (_this, messageText, confirmedAction, canceledAction, confirmButtonText, cancelButtonText, typeMessage) {
        nativeBridgeService.getNativeViewShow(_this).then(firstResponseIsNative=>{
            if(firstResponseIsNative == "true"){
                nativeBridgeService.showNativeMessageDialog(_this,messageText,confirmButtonText,cancelButtonText,'warn',confirmedAction, canceledAction);
            }else{
                _this.messageBoxProps = {
                    hasMask: true,
                    messageText: _.isString(messageText) && messageText || '',
                    confirmButtonText: (_.isString(confirmButtonText) && confirmButtonText) || "确定",
                    cancelButtonText: (_.isString(cancelButtonText) && cancelButtonText) || "",
                    confirmedAction: _.isFunction(confirmedAction) && confirmedAction,
                    canceledAction: _.isFunction(canceledAction) && canceledAction,
                    typeMessage: typeMessage || "warn",
                    showMsgBox: true,
                }
                if(!_.isString(messageText)){
                    _this.messageBoxProps = Object.assign({}, _this.messageBoxProps , messageText);
                }
                _this.messageBox(_this.messageBoxProps);
            }
        })
        // return false;
    },
    //获取目标导航/路由 
    getTargetItem: function(config, parItem){
        //先获取目标路由配置
        let obj = {
          title:config.title
        }
        if(config.title2){
          obj.title2 = config.title2
        }
        let item = _.find(parItem||[],obj)
        console.log('已找到目标导航元素', item);
        return item||{}
    },
    /*
     *@Description: 根据key值路径获取字段对象
     *@ClassAuthor: linsc
      @param keyStr 分组模块字段id字符串，比如“CUST_INFO.CUST_BASIC_INFO.ID_TYPE”
     *@Date: 2019-11-09 18:14:31
    */
    getFieldObj: (_this, keyStr) => {
        if (!_this || !_this.groupDatas || _.isEmpty(_this.groupDatas)) {
            return {}
        }
        let oldObj = _this.groupDatas;
        let keyArr = keyStr.split(".") || [];
        let newObj = {};
        if (keyArr.length == 3) {
            let groupId = keyArr[0];
            let moduleId = keyArr[1];
            let fieldId = keyArr[2]
            newObj = oldObj[groupId] && oldObj[groupId][moduleId] && oldObj[groupId][moduleId][0] && oldObj[groupId][moduleId][0]["FIELDS"] && oldObj[groupId][moduleId][0]["FIELDS"][fieldId]
        }
        return newObj || {};
    },
    /*
     *@Description: 根据key值路径获取模块对象
     *@ClassAuthor: linsc
      @param keyStr 分组模块id拼成的字符串，比如“CUST_INFO.CUST_BASIC_INFO.ID_TYPE”
     *@Date: 2019-11-09 18:14:31
    */
    getModuleObj: (_this, keyStr) => {
        if (!_this || !_this.groupDatas || _.isEmpty(_this.groupDatas)) {
            return {}
        }
        let oldObj = _this.groupDatas;
        let keyArr = keyStr.split(".") || [];
        let newObj = {};
        if (keyArr.length == 2) {
            let groupId = keyArr[0];
            let moduleId = keyArr[1];
            newObj = oldObj[groupId] && oldObj[groupId][moduleId] && oldObj[groupId][moduleId][0] && oldObj[groupId][moduleId][0]
        }
        return newObj || {};
    },
    //改变字段的对错
    changeFieldError: (field, correct, errMessage) => {
        field.correct = correct;
        field.showerr = true;
        field.showErrorMsg = errMessage;
        field.message = errMessage;
    },
    /*
     * @Description: 1、接口数据格式：data: {key: value};
     *  2、把接口数据字段遍历存储在流水中
     * @Author: chencheng
     * @Date: 2019-06-27 19:59:18
     */
    addOppBusiData: function (_this, data) {
        Object.keys(data).forEach((key) => {
            _this.oppBusiData[key] = data[key];
        })
    },
    /*
     * @Description: 1、遍历模块配置字段的DEFAULT_VALUE（刚配置后为空）
     * 2、将addOppBusiData存储的数据赋值给对应的字段 
     * (注意：赋值就是根据相同的字段配置的，所以要和接口数据字段要一致； 例：配置的ID_CODE 对应接口数据 ID_CODE)
     * @Author: chencheng
     * @Date: 2019-07-01 10:37:56
     */
    parseOppBusiData: function (_this) {
        for (let gk in _this.groupDatas) {
            for (let md in _this.groupDatas[gk]) {
                for (let fk in _this.oppBusiData) {
                    if (fk in _this.groupDatas[gk][md][0].FIELDS) {
                        if (stringConfig.isEmptyStr(_this.groupDatas[gk][md][0]["FIELDS"][fk]["DEFAULT_VALUE"])) {
                            _this.groupDatas[gk][md][0]["FIELDS"][fk]["DEFAULT_VALUE"] = _this.oppBusiData[fk];
                        }
                    }
                }
            }
        }
    },
    /**
     * 税收居民国信息转换为数组类型数据
     * @param taxInfoObj
     * @returns {Array}
     */
    transTaxInfoToArr: function (taxInfoObj) {
        var taxInfo = taxInfoObj || {},
            commonReason = "居民国(地区)不发放纳税人识别号", //常用理由
            otherReasonPrefix = "账户持有人未能取得纳税人识别号:", //其他理由的前缀
            rtnArr = [];
        if (taxInfo.TAX_RESIDENT_TYPE && ["1", "5"].indexOf(taxInfo.TAX_RESIDENT_TYPE) == -1) {
            var mainKey = "CITIZENSHIP",
                arrKeys = _.chain(taxInfo).keys().filter(function (v) {
                    return v.indexOf(mainKey) == 0 && v !== "CITIZENSHIP_TEXT";
                }).value();
            //ljc 这里需要对得到的arrKey进行排序，避免后面对比时出现交叉
            arrKeys = _.sortBy(arrKeys);
            _.each(arrKeys, function (key, i) {
                if (taxInfo[key]) {
                    let index = key.replace(mainKey, "");
                    let taxNo = taxInfo["TAXPAYER_IDNO" + index];
                    let reasonTxt = _.trim(taxInfo["NO_TAXPAYERID_REASON" + index]);
                    let reasonVal = reasonTxt && reasonTxt.replace(otherReasonPrefix, "");
                    let hasIdNo = taxInfo["HAS_TAXPAYER_IDNO" + index] || (taxNo && !reasonTxt ? "1" : "0"); // 是否有纳税人识别号：存在纳税人识别号，但没有无纳税识别号原因
                    let obj = {
                        TAX_ID: index || "1",
                        CITIZENSHIP: taxInfo[key],
                        HAS_TAXPAYER_IDNO: hasIdNo, // 临时字段转换：是否存在纳税人识别号
                        TAXPAYER_IDNO: hasIdNo == "1" ? taxNo : "",  // 纳税人识别号
                        OPP_NO_TAXPAYERID_REASON: hasIdNo == "0" ? (reasonVal == commonReason ? "1" : "2") : "", // 临时字段转换：无纳税识别号原因，需要判断是否存在纳税人识别号
                        NO_TAXPAYERID_REASON: reasonVal == commonReason ? "" : reasonVal // 未取得纳税人识别号原因
                    };
                    // 需要判断特殊情况
                    if (obj.OPP_NO_TAXPAYERID_REASON == "1") {
                        obj.NO_TAXPAYERID_REASON = ""
                    }
                    rtnArr.push(obj);
                }
            })
        }
        return rtnArr;
    },
    /**
     * 税收居民国信息转换为数组类型数据 中泰版本
     * @param taxInfoObj
     * @returns {Array}
     */
    transTaxInfoToArrWithZT: function (taxInfoObj) {
        let taxInfo = taxInfoObj,
            rtnArr = [],
            mainKey = "CITIZENSHIP",
            arrKeys = _.chain(taxInfo).keys().filter(function (v) {
                return v.indexOf(mainKey) == 0
            }).value();
            //ljc 这里需要对得到的arrKey进行排序，避免后面对比时出现交叉
            arrKeys = _.sortBy(arrKeys);
            _.each(arrKeys, function (key, i) {
                console.log("taxInfo[key]==",taxInfo[key]);
                if (taxInfo[key]) {
                    let index = key.replace(mainKey, ""); // 获取索引CITIZENSHIP  CITIZENSHIP2 CITIZENSHIP3  返回  空  2  3
                    let taxNo = taxInfo["TAXPAYER_IDNO" + index];
                    let reasonVal = taxInfo["NO_TAXPAYERID_REASON" + index];
                    let obj = {
                        TAX_ID: index || "0",
                        CITIZENSHIP: taxInfo[key],
                        HAS_TAXPAYER_IDNO: taxInfo["HAS_TAXPAYER_IDNO" + index] || (!taxNo ? "0" : "1"), // 临时字段转换：是否存在纳税人识别号
                        TAXPAYER_IDNO: taxInfo["TAXPAYER_IDNO" + index], // 纳税人识别号
                        NO_TAXPAYERID_REASON: (reasonVal&&reasonVal.split(":")&&reasonVal.split(":")[0]) ,
                        NO_TAXPAYERID_REASON_INPUT: taxInfo["NO_TAXPAYERID_REASON" + index + "_INPUT"] 
                                                    ||(reasonVal&&reasonVal.split(":")&&reasonVal.split(":")[1])||"" // 未取得纳税人识别号原因
                    };
                    obj.NO_TAXPAYERID_REASON = obj.NO_TAXPAYERID_REASON == "居民国(地区)不发放纳税人识别号" ? "1" : obj.NO_TAXPAYERID_REASON == "账户持有人未能取得纳税人识别号" ? "2" : obj.NO_TAXPAYERID_REASON
                    rtnArr.push(obj);
                }
            })
        return rtnArr;
    },
    /**
     * 资产信息转换为对象数据类型
     * @param taxInfoArr
     * @returns {Array}
     */
    transTaxAssetInfoToObj: function (taxInfoArr) {
        var itemKeys = ["PAYMENT_TYPE", "PAYMENT_CURR", "PAYMENT_ASSET", "PAYMENT_AMNT"],
            rtnObj = {};

        _.each(taxInfoArr, function (v) {
            //PAYMENT_ASSET为空时PAYMENT_AMNT不能送&&，否则CRS非居民涉税信息收集有报错 by hew
            v.PAYMENT_AMNT = v.PAYMENT_ASSET ? v.PAYMENT_ASSET + "&&" + v.PAYMENT_CURR : "";
        });

        // 账户存储数据特殊性，需要拼接多条资产信息
        _.each(taxInfoArr || [], function (taxInfo) {
            _.each(itemKeys, function (key) {
                rtnObj[key + taxInfo.TAX_ID] = taxInfo[key];
            });
        });

        return rtnObj;
    },
    /**
     * 税收居民国信息转换为对象数据类型
     * @param taxInfoArr
     * @returns {Array}
     */
    transTaxInfoToObj: function (taxInfoArr) {
        var commonReason = "居民国(地区)不发放纳税人识别号", //常用理由
            otherReasonPrefix = "账户持有人未能取得纳税人识别号:", //其他理由的前缀
            itemKeys = ["HAS_TAXPAYER_IDNO", "CITIZENSHIP", "TAXPAYER_IDNO", "OPP_NO_TAXPAYERID_REASON", "NO_TAXPAYERID_REASON"],
            rtnObj = {};
        // 账户存储数据特殊性，需要拼接多条纳税居民国信息
        _.each(taxInfoArr || [], function (taxInfo) {
            _.each(itemKeys || [], function (key) {
                taxInfo[key] = taxInfo[key] || "";
                if (taxInfo.TAX_ID == "1") {
                    rtnObj[key] = taxInfo[key];
                } else {
                    rtnObj[key + taxInfo.TAX_ID] = taxInfo[key];
                }
            });
        });
        // 1）如果居民国不发放纳税识别号，需要把原因填充到NO_TAXPAYERID_REASON
        // 2）如果不是上面的原因，需要拼接前缀到所录入的原因里面
        _.each(rtnObj, function (v, k) {
            if (k.indexOf("OPP_NO_TAXPAYERID_REASON") == 0 && v) {
                var key = k.replace("OPP_", ""),
                    idx = k.replace("OPP_NO_TAXPAYERID_REASON", ""),
                    haxTaxIno = rtnObj["HAS_TAXPAYER_IDNO" + idx],
                    taxNo = _.trim(rtnObj["TAXPAYER_IDNO" + idx]);
                // 无纳税识别号时
                rtnObj[key] = !taxNo || haxTaxIno == "0" ? (v == "1" ? commonReason : otherReasonPrefix + rtnObj[key]) : "";
            }
        });
        return rtnObj;
    },
    /**
     * 资产信息转换为数组类型数据
     * @param taxInfoObj
     * @returns {Array}
     */
    transTaxAssetInfoToArr: function (taxInfoObj, userType) {
        var taxInfo = taxInfoObj || {},
            rtnArr = [];
        //机构产品
        // 1）选择“1-仅为中国税收居民”，且“消极非金融机构标识”选择“是”“1”或“2”时
        // 2）税收居民身份选择“2”或“3”或“4”显示
        //个人  税收居民身份选择“2”或“3”或“4”显示
        if (taxInfo.TAX_RESIDENT_TYPE && (taxInfo.TAX_RESIDENT_TYPE !== "1" || userType != "0" && ["1", "2"].indexOf(taxInfo.PASSIVE_NFE) != -1)) {
            var mainKey = "PAYMENT_TYPE",
                arrKeys = _.chain(taxInfo).keys().filter(function (v) {
                    return v.indexOf(mainKey) === 0;
                }).value();
            //LJC 将查询出的东西排序
            arrKeys = _.sortBy(arrKeys);
            _.each(arrKeys, function (key) {
                if (taxInfo[key]) {
                    var index = key.replace(mainKey, ""),
                        //历史数据中 PAYMENT_TYPE和PAYMENT_ASSET是由PAYMENT_AMNT拼接保存的
                        PAYMENT_AMNT = taxInfo["PAYMENT_AMNT" + index] ? taxInfo["PAYMENT_AMNT" + index].split("&&") : [],
                        obj = {
                            TAX_ID: index || "1",
                            PAYMENT_TYPE: taxInfo["PAYMENT_TYPE" + index],
                            PAYMENT_CURR: taxInfo["PAYMENT_CURR" + index] || (PAYMENT_AMNT.length > 1 ? PAYMENT_AMNT[1] : ""),
                            PAYMENT_ASSET: taxInfo["PAYMENT_ASSET" + index] || (PAYMENT_AMNT.length > 0 ? PAYMENT_AMNT[0] : "")
                        };
                    rtnArr.push(obj);
                }
            });
        }
        return rtnArr;
    },
    /**
     * 获取空的居民国信息
     * @returns {{CITIZENSHIP: string, CITIZENSHIP2: string, CITIZENSHIP3: string, TAXPAYER_IDNO: string, TAXPAYER_IDNO2: string, TAXPAYER_IDNO3: string, NO_TAXPAYERID_REASON: string, NO_TAXPAYERID_REASON2: string, NO_TAXPAYERID_REASON3: string}}
     */
    getEmptyTaxCountry: function () {
        return {
            CITIZENSHIP: "",
            CITIZENSHIP2: "",
            CITIZENSHIP3: "",
            TAXPAYER_IDNO: "",
            TAXPAYER_IDNO2: "",
            TAXPAYER_IDNO3: "",
            NO_TAXPAYERID_REASON: "",
            NO_TAXPAYERID_REASON2: "",
            NO_TAXPAYERID_REASON3: "",
            HAS_TAXPAYER_IDNO: "",
            HAS_TAXPAYER_IDNO2: "",
            HAS_TAXPAYER_IDNO3: "",
            OPP_NO_TAXPAYERID_REASON: "",
            OPP_NO_TAXPAYERID_REASON2: "",
            OPP_NO_TAXPAYERID_REASON3: "",
        };
    },

    /**
     * 获取空的资产信息
     * @returns
     */
    getEmptyTaxAsset: function () {
        return {
            PAYMENT_TYPE1: "",
            PAYMENT_TYPE2: "",
            PAYMENT_TYPE3: "",
            PAYMENT_TYPE4: "",
            PAYMENT_CURR1: "",
            PAYMENT_CURR2: "",
            PAYMENT_CURR3: "",
            PAYMENT_CURR4: "",
            PAYMENT_ASSET1: "",
            PAYMENT_ASSET2: "",
            PAYMENT_ASSET3: "",
            PAYMENT_ASSET4: ""
        };
    },
    /*
     *@Description: 解析标准版涉税国信息模块
     *@Author: yangyp
     *@Date: 2019-09-10 16:31:56
     */
    parseTaxWithTaxPayerData: function (_this, groupId, moduleId, taxInfo) {
        let bdata = {};
        if (taxInfo) {
            bdata[groupId] = {};
            let taxInfoTpl = this.transTaxInfoToArr(_.cloneDeep(taxInfo));
            taxInfoTpl = _.map(taxInfoTpl, taxInfoTplItem => {
                if (taxInfoTplItem.OPP_NO_TAXPAYERID_REASON == "1") {
                    taxInfoTplItem.NO_TAXPAYERID_REASON = ""
                }
                return taxInfoTplItem;
            })
            bdata[groupId][moduleId] = taxInfoTpl;
            this.parseOldBiz(_this,_this.groupDatas, bdata);
        }
    },
    /*
    *@Description: 解析中泰证券涉税国信息模块
    *@Author: yangyp
    *@Date: 2019-09-10 16:31:56
    */
    parseTaxCountryForZTData: function (_this, groupId, moduleId, taxInfo) {
        let bdata = {};
        if (taxInfo) {
            bdata[groupId] = {};
            bdata[groupId][moduleId] = this.transTaxInfoToArrWithZT(taxInfo);
            this.parseOldBiz(_this,_this.groupDatas, bdata)
        }
    },
    /*
     *@Description: 解析标准版涉税收入类型模块 
     *@Author: Liujc
     *@Date: 2019-10-11 16:31:56
     */
    parseHistoryTaxWithTaxPayerData: function (_this, groupId, moduleId, taxInfo) {
        let bdata = {};
        if (taxInfo) {
            bdata[groupId] = {};
            bdata[groupId][moduleId] = this.transTaxInfoToArr(taxInfo);
            //将每个涉税国信息中得国家  从CITIZENSHIP转为CITIZENSHIP_ST
            _.forEach(bdata[groupId][moduleId], function (item) {
                item.CITIZENSHIP_ST = item.CITIZENSHIP
            })
            for (let bk in bdata) {
                if (bk in _this.groupDatas) {
                    let bd = bdata[bk];
                    let md = _this.groupDatas[bk];
                    for (let bdk in bd) {
                        if (bdk in md) {
                            this.parseHistoryMoudleArray(_this, md[bdk], bd[bdk]);
                        }
                    }
                }
            }
        }
    },
    /*
     *@Description: 解析标准版涉税收入类型模块
     *@Author: yangyp
     *@Date: 2019-09-10 16:31:56
     */
    parseTaxWithPayMentTaxData: function (_this, groupId, moduleId, taxInfo) {
        let bdata = {};
        if (taxInfo) {
            bdata[groupId] = {};
            bdata[groupId][moduleId] = this.transTaxAssetInfoToArr(taxInfo, "0");
            if (bdata[groupId][moduleId].length == 0) {
                bdata[groupId][moduleId].push({});
            }
            this.parseOldBiz(_this,_this.groupDatas, bdata)
        }
    },
    /*
     *@Description: 解析标准版涉税收入类型模块
     *@Author: LiuJC
     *@Date: 2019-10-11 16:31:56
     */
    parseHistoryTaxWithPayMentTaxData: function (_this, groupId, moduleId, taxInfo) {
        let bdata = {};
        if (taxInfo) {
            bdata[groupId] = {};
            bdata[groupId][moduleId] = this.transTaxAssetInfoToArr(taxInfo, "0");
            for (let bk in bdata) {
                if (bk in _this.groupDatas) {
                    let bd = bdata[bk];
                    let md = _this.groupDatas[bk];
                    for (let bdk in bd) {
                        if (bdk in md) {
                            this.parseHistoryMoudleArray(_this, md[bdk], bd[bdk]);
                        }
                    }
                }
            }
        }
    }, /*
    *@Description: 解析中泰涉税模块
    *@Author: 杨云鹏
    *@Date: 2020-1-27 16:31:56
    */
    parseCountryTaxWithTaxDataForZT: function (_this, groupId, moduleId, taxInfo) {
        let bdata = {};
        if (taxInfo) {
            bdata[groupId] = {};
            bdata[groupId][moduleId] = this.transTaxAssetInfoToArr(taxInfo, "0");
            for (let bk in bdata) {
                if (bk in _this.groupDatas) {
                    let bd = bdata[bk];
                    let md = _this.groupDatas[bk];
                    for (let bdk in bd) {
                        if (bdk in md) {
                            this.parseHistoryMoudleArray(_this, md[bdk], bd[bdk]);
                        }
                    }
                }
            }
        }
    },
    /*
     * @Description: 1、遍历模块配置字段的DEFAULT_VALUE（刚配置后为空）
     * 2、将addOppBusiData存储的数据赋值给对应的字段 
     * (注意：赋值就是根据相同的字段配置的，所以要和接口数据字段要一致； 例：配置的ID_CODE 对应接口数据 ID_CODE)
     * @Author: chencheng
     * @Date: 2019-07-01 10:37:56
     */
    parseGroupsMouduleData: function (_this, mouduleArr, oppData) {
        for (let gk in _this.groupDatas) {
            for (let md in _this.groupDatas[gk]) {
                if (mouduleArr.indexOf(md) != -1) {
                    for (let fk in oppData) {
                        if (fk in _this.groupDatas[gk][md][0].FIELDS) {
                            _this.groupDatas[gk][md][0]["FIELDS"][fk]["DEFAULT_VALUE"] = oppData[fk];
                            if (_this.groupDatas[gk][md][0]["FIELDS"][fk].FIELD_TYPE == "addressInput") {
                                _this.groupDatas[gk][md][0]["FIELDS"][fk]["newAddressVal"] = "";
                            }
                        }
                    }
                }
            }
        }
    },
    /*
     *@Description: 标准版 回填历史数据
     *@Author: yangyp
     *@Date: 2019-09-10 16:31:56
     */
    parseOldBiz: function (_this, groupdDatas, bdata) {
        try{
            for (let bk in bdata) {
                if (bk in groupdDatas) {
                    let bd = bdata[bk];
                    let md = groupdDatas[bk];
                    for (let bdk in bd) {
                        if (bdk in md) {
                            if(!bd[bdk]  || !bd[bdk].length){
                                continue;
                            }
                            //历史数据模块
                            let oldBizMd =  bd[bdk];
                            let newMddArr = [];
                            let mdtpl = _.cloneDeep(md[bdk][0]);
                            if(md[bdk]&&md[bdk].length == 1){
                                //如果只有模块下一个对象，则需要复制原始模块
                                let groupBizMd = _.cloneDeep(mdtpl);
                                newMddArr = this.getNewMdArr(newMddArr, groupBizMd, oldBizMd);
                                _this.$set(md,bdk, newMddArr)
                            }else{
                                //如果有多个模块对象，可以直接回填
                                //支持先构造分组模块数据再正确回填，而不会覆盖掉构造的模块字段结构
                                for (let i = 0; i < oldBizMd.length; i++) {
                                    let oldBizMdObj = _.cloneDeep(oldBizMd[i]);
                                    //模块数组结构
                                    let mdObj = _.cloneDeep( md[bdk][i]);
                                    for (let fk in oldBizMdObj) {
                                        if (fk in mdObj.FIELDS && oldBizMdObj[fk] !== null) {
                                            let field =  mdObj["FIELDS"][fk];
                                            //需要根据数据类型来赋值
                                            field["DEFAULT_VALUE"] = (typeof (oldBizMdObj[fk]) === 'object' && Object.prototype.toString.call(oldBizMdObj[fk]) !== '[object Array]') ? oldBizMdObj[fk]["newVal"] : oldBizMdObj[fk];
                                            // 如果当前历史数据模块字段里面为null为删除模块，中断并过滤此模块
                                            if(field["DEFAULT_VALUE"] === null) {
                                                mdObj = null;
                                                break;
                                            }
                                            //如果字段需要二次输入，回填数据默认给字段的第二个值赋值
                                            if(field.VALID_TYPE.indexOf("prompt") > -1 && !!field.DEFAULT_VALUE) {
                                              field.promptValue = field.DEFAULT_VALUE              
                                            }
                                        }
                                    }
                                    _this.$set(md[bdk],i, mdObj)
                                }
                            }
                        }
                    }
                }
            }
        }catch(err){
            console.error('err', err);
        }
    },
    //根据历史数据模块回填构造，并返回回填后的模块数组
    getNewMdArr: function(newMddArr,groupBizMd, oldBizMd){
        groupBizMd["MODULE_NUM"] = ""; //先清掉module_num
        for (let i = 0; i < oldBizMd.length; i++) {
            let oldBizMdObj = oldBizMd[i];
            //如果模块子元素还是数组 手动转为对象
            if (Object.prototype.toString.call(oldBizMdObj) == '[object Array]') {
                oldBizMdObj = oldBizMdObj[0];
            }
            //模块数组结构
            let mdObj = _.cloneDeep(groupBizMd);
            mdObj["MODULE_ADD"] == '1' && (mdObj["MODULE_NUM"] = String(i));
            for (let fk in oldBizMdObj) {
                //转换一柜通的与xx保持致字段
                if (fk === "USESAME_INFO" && "MODULE_RADIO_BUTTON" in mdObj.FIELDS) {
                    mdObj["FIELDS"]["MODULE_RADIO_BUTTON"]["DEFAULT_VALUE"] = oldBizMdObj["USESAME_INFO"] == "1" ? "true" : "false";
                }
                if (fk in mdObj.FIELDS && oldBizMdObj[fk] !== null) {
                    let field =  mdObj["FIELDS"][fk];
                    //需要根据数据类型来赋值
                    field["DEFAULT_VALUE"] = (typeof (oldBizMdObj[fk]) === 'object' && Object.prototype.toString.call(oldBizMdObj[fk]) !== '[object Array]') ? oldBizMdObj[fk]["newVal"] : oldBizMdObj[fk];
                    // 如果当前历史数据模块字段里面为null为删除模块，中断并过滤此模块
                    if(field["DEFAULT_VALUE"] === null) {
                        mdObj = null;
                        break;
                    }
                    //如果字段需要二次输入，回填数据默认给字段的第二个值赋值
                    if(field.VALID_TYPE.indexOf("prompt") > -1 && !!field.DEFAULT_VALUE) {
                      field.promptValue = field.DEFAULT_VALUE              
                    }
                } else if ("MODULE_NUM_FIELD" in mdObj && fk === mdObj["MODULE_NUM_FIELD"]) { // 多组数据，取出一柜通NUM字段值并赋值MODULE_NUM
                    mdObj["MODULE_NUM"] = oldBizMdObj[fk];
                }
            }
            if (i > 0 && mdObj)
                mdObj.MODULE_SEQ = parseInt(mdObj["MODULE_SEQ"]) + i + "";
            newMddArr.push(mdObj);
        }
        return newMddArr;
    },
    /*
     *@Description: 解析联系人数组
     *@Author: yangyp
     *@Date: 2019-07-15 14:30:57
     */
     parseMoudleArray: function (_this, moudletpl, moudleArray) {
        if (moudleArray.length == 0) {
            return;
        }
        let maxLength = parseInt(moudletpl[0].MAX_LENGTH) || 3;
        let mdtpl = bizTaxMethod.getEmptyGroupFieldObj(_this, moudletpl[0]);
        // mdtpl.MAX_LENGTH = maxLength;
        moudletpl.splice(0, maxLength + 1);
        for (let i = 0; i < moudleArray.length; i++) {
            let bdd = moudleArray[i];
            let mdd = _.cloneDeep(mdtpl);
            mdd.MAX_LENGTH = maxLength;
            mdd["MODULE_NUM"] = String(i);
            if (i > 0) {
                mdd.MODULE_SEQ = String(parseInt(mdd["MODULE_SEQ"]) + i);
            }

            for (let fk in bdd) {
                if (fk in mdd.FIELDS && bdd[fk] !== null) {
                    if (mdd["FIELDS"][fk]) {
                        mdd["FIELDS"][fk]["DEFAULT_VALUE"] = bdd[fk];
                        //时间组件 如果初始值为0 则置空字符串 （账户系统会把空字符串初始化为0 导致对比错误）
                        if (mdd["FIELDS"][fk].FIELD_TYPE == "date" && bdd[fk] == "0") {
                            mdd["FIELDS"][fk].DEFAULT_VALUE = "";
                        }
                        if (mdd["FIELDS"][fk].VALID_TYPE.indexOf("prompt") > -1 && !!mdd["FIELDS"][fk].DEFAULT_VALUE) {
                            mdd["FIELDS"][fk].promptValue = mdd["FIELDS"][fk].DEFAULT_VALUE;
                        }
                    }
                }
            }
            //3   i = 2  moudletpl =1
            if (moudleArray.length == 1) {
                mdd.MODULE_ADD = "1";
                mdd.MODULE_DELETE = "0";
            } else {
                if (i == moudleArray.length - 1 && moudleArray.length < maxLength) {
                    mdd.MODULE_ADD = "1";
                } else {
                    mdd.MODULE_ADD = "0";
                }
                mdd.MODULE_DELETE = "1";
            }
            if (i > moudletpl.length - 1) {
                moudletpl.push(mdd);
            } else {
                moudletpl[i] = mdd;
            }
        }
    },
    /*
     *@Description: 解析涉税居民国和资产信息
     *@Author: Liujc
     *@Date: 2019-10-12 14:30:57
     */
    parseHistoryMoudleArray: function (_this, moudletpl, moudleArray) {
        if (moudleArray.length == 0) {
            return;
        }
        if (moudleArray.length > moudletpl.length) {
            let mdtpl = bizTaxMethod.getEmptyGroupFieldObj(_this, moudletpl[0]);
            for (let i = 0; i < moudleArray.length; i++) {
                let bdd = moudleArray[i];
                let mdd = _.cloneDeep(mdtpl);
                mdd["MODULE_NUM"] = String(i);
                if (i > 0) {
                    mdd.MODULE_SEQ = String(parseInt(mdd["MODULE_SEQ"]) + i);
                }

                for (let fk in bdd) {
                    if (fk in mdd.FIELDS && bdd[fk] !== null) {
                        if (mdd["FIELDS"][fk]) {
                            mdd["FIELDS"][fk]["DEFAULT_VALUE"] = bdd[fk];
                        }
                    }
                }
                //3   i = 2  moudletpl =1

                if (i > moudletpl.length - 1) {
                    if (i == 1 && moudleArray.length == 2) {
                        mdd.MODULE_ADD = "1";
                    } else {
                        mdd.MODULE_ADD = "0";
                    }

                    mdd.MODULE_DELETE = "1";
                    moudletpl.push(mdd);

                } else {
                    if (moudleArray.length == 1) {
                        mdd.MODULE_ADD = "1";
                        mdd.MODULE_DELETE = "0";
                    } else {

                        if (moudleArray.length && i == moudleArray.length - 1) {
                            mdd.MODULE_ADD = "1";
                            mdd.MODULE_DELETE = "1";
                        } else {
                            mdd.MODULE_ADD = "0";
                        }

                    }
                    moudletpl[i] = mdd;
                }
            }
        } else {
            moudletpl.length = moudleArray.length;
            for (let i = 0; i < moudletpl.length; i++) {
                moudletpl[i]["MODULE_NUM"] = String(i);
                if (i < moudleArray.length) {
                    let bdd = moudleArray[i];
                    for (let fk in bdd) {
                        if (fk in moudletpl[i].FIELDS && bdd[fk] !== null) {
                            moudletpl[i]["FIELDS"][fk]["DEFAULT_VALUE"] = bdd[fk];
                        }
                    }
                }
                //3   i = 2  moudletpl =1

                if (i > moudleArray.length - 1) {
                    if (moudleArray.length && i == moudleArray.length - 1) {
                        moudletpl[i].MODULE_ADD = "1";
                    } else {
                        moudletpl[i].MODULE_ADD = "0";
                    }
                    moudletpl[i].MODULE_DELETE = "1";
                } else {
                    if (moudleArray.length == 1) {
                        moudletpl[i].MODULE_ADD = "1";
                        moudletpl[i].MODULE_DELETE = "0";
                    } else {

                        if (i == 1 && moudleArray.length == 2) {
                            moudletpl[i].MODULE_ADD = "1";
                            moudletpl[i].MODULE_DELETE = "1";
                        } else {
                            moudletpl[i].MODULE_ADD = "0";
                        }
                    }
                }
            }
        }
    },
    /*
     * @Description: 
     * 1、遍历模块里的数据，由每个字段为对象key:{XX:XX}改成key:value的形式
     * 2、moduleFields为要遍历的值（配置的模块）targetValue为接收的对象（空对象{}）
     * @Author: chencheng
     * @Date: 2019-06-29 10:51:33
     */
    changeObjKeys: function (moduleFields, targetValue) {
        Object.keys(moduleFields).forEach((key) => {
            // console.log(key,moduleFields[key]);
            targetValue[key] = moduleFields[key].DEFAULT_VALUE;
            // console.log(targetValue);
        })
    },
    /**
     * 处理已变更的资料项 标准版 @liwe12
     * @param newData
     * @param oldArr
     * @param keyId
     * @param skipKeys
     * @param keepOldVal
     * @returns {{INFO: Array, IS_CHANGE: string}}
     */
    getArrDiff: function (newData, oldArr, keyId, skipKeys, keepOldVal) {
        var that = this,
            newArr = [],
            isChange = "0",
            skipKeyArr = skipKeys && skipKeys.split(",") || [],
            skipValObj = {};
        _.each(newData, function (newObj) {
            var oldObj = {},
                matchObj = {},
                skipValObj = {},
                diff = [],
                operType = "3"; //OPER_TYPE 0-新增 1-修改 2-删除 3-不变

            // 用于匹配的关键属性值
            matchObj[keyId] = newObj[keyId];
            // 排除不需比较的属性
            _.each(skipKeyArr, function (skipkey) {
                skipValObj[skipkey] = newObj[skipkey]; //保留不需要比较属性的新值，
                matchObj = _.omit(matchObj, skipkey);
                newObj = _.omit(newObj, skipkey);
            });
            // 旧值
            oldObj = _.findWhere(oldArr, matchObj);

            if (oldArr.length == 0 && _.compact(_.values(newObj)).length == 0) {
                //防止开户的时候没有值，然后变更的时候也没有值，传operType=0新增的情况
                operType = "3";
            } else if (_.isEmpty(oldObj) && !_.isEmpty(newObj)) {
                // 旧值没有，但新值有
                operType = "0";
                diff = !oldObj ? that.compareInfoStandard(oldObj, newObj) : [];
            } else {
                // 旧值、新值都有
                diff = !oldObj ? [] : that.compareInfoStandard(oldObj, newObj);
                operType = diff.length ? "1" : (!oldObj ? "0" : "3");
                // 20180410：兼容涉税信息需求变更，修改时候若需要保留变更前信息，需要把变更前的信息缓存进去
                if (keepOldVal && diff.length) {
                    _.each(oldObj, function (v, k) {
                        var tmpObj = _.find(diff, function (o) {
                            return o.FIELD == k;
                        });
                        if (!tmpObj && v) {
                            diff.push({
                                FIELD: k,
                                NEW: v,
                                OLD: v
                            })
                        }
                    })
                }
            }
            if (operType !== "3") {
                isChange = "1";
            }
            newArr.push(Object.assign({}, {
                DIFF_INFO: diff,
                OPER_TYPE: operType
            }, newObj, skipValObj));
        });
        _.chain(oldArr).filter(function (v) {
            var matchObj = {};
            matchObj[keyId] = v[keyId];
            return !_.findWhere(newArr, matchObj);
        }).each(function (v) {
            newArr.push(Object.assign({}, v, {
                DIFF_INFO: [v],
                OPER_TYPE: "2"
            }));
            isChange = "1";
        }).value();
        return {
            INFO: newArr,
            IS_CHANGE: isChange
        };
    },
    /**
     * @description 获取涉税国diff信息 标准版 @liwe2
     * @param {*} infoArr 
     * @param {*} oldTaxInfo 
     */
    getTaxCountryDiffData: function (infoArr, oldTaxInfo) {
        _.each(infoArr, function (tax) {
            var arrKeys = ["CITIZENSHIP", "CITIZENSHIP2", "CITIZENSHIP3",
                "TAXPAYER_IDNO", "TAXPAYER_IDNO2", "TAXPAYER_IDNO3",
                "NO_TAXPAYERID_REASON", "NO_TAXPAYERID_REASON2", "NO_TAXPAYERID_REASON3"
            ];
            _.each(arrKeys, function (key) {
                if (tax.DIFF_INFO.length) {
                    var tmpObj = _.find(tax.DIFF_INFO, function (v) {
                        return v.FIELD == key;
                    }) || "";
                    if (!_.isEmpty(tmpObj)) {
                        tax.DIFF_INFO.push({
                            FIELD: key,
                            NEW: oldTaxInfo[key],
                            OLD: oldTaxInfo[key]
                        })
                    }
                }
            });
        });
        return infoArr;
    },
    /**
     * @description 获取涉税资产diff信息  标准版 @liwe2
     * @param {*} infoArr 
     * @param {*} oldTaxInfo 
     */
    getTaxAssetDiffData: function (infoArr, oldTaxInfo) {
        _.each(infoArr, function (tax) {
            var arrKeys = [
                "PAYMENT_TYPE1", "PAYMENT_TYPE2", "PAYMENT_TYPE3", "PAYMENT_TYPE4",
                "PAYMENT_CURR1", "PAYMENT_CURR2", "PAYMENT_CURR3", "PAYMENT_CURR4",
                "PAYMENT_ASSET1", "PAYMENT_ASSET2", "PAYMENT_ASSET3", "PAYMENT_ASSET4"
            ];
            _.each(arrKeys, function (key) {
                if (tax.DIFF_INFO.length) {
                    var tmpObj = _.find(tax.DIFF_INFO, function (v) {
                        return v.FIELD == key;
                    }) || "";
                    if (!_.isEmpty(tmpObj)) {
                        tax.DIFF_INFO.push({
                            FIELD: key,
                            NEW: oldTaxInfo[key],
                            OLD: oldTaxInfo[key]
                        });
                    }
                }
            });
        });
        return infoArr;
    },
    /**
     * 比较普通对象资料变更 标准版 @liwe12
     * @param objOld
     * @param objNew
     * @param skipKeys
     * @returns {Array}
     */
    compareInfoStandard: function (objOld, objNew, skipKeys) {
        var diff = [],
            newObj = objNew;
        // 排除指定不需比较的属性
        skipKeys && _.each(skipKeys.split(","), function (skipkey) {
            newObj = _.omit(newObj, skipkey);
        });
        _.each(newObj, function (v, k) {
            // 过滤调不需要检查的key
            if (!objOld || (null !== (objOld[k] || "") && v !== (objOld[k] || ""))) {
                diff.push({
                    FIELD: k,
                    OLD: objOld && objOld[k] || "",
                    NEW: v || ""
                });
            }
        });
        return diff;
    },
    //判断是汉字
    isChineseStr: function (temp) {
        if (escape(temp).indexOf("%u") < 0) {
            return false ;
        }
        return true ;
    },
    /*
     * @Description: 
     * 1、自定义修改的字段前后数据对比 oldVal{key: value} newVal: {key: value}
     * @Author: chencheng
     * @Date: 2019-07-01 11:02:32
     */
    compareInfo: function (oldVal, newVal) {
        let arr = [];
        Object.keys(newVal).forEach((key) => {
            if (newVal[key] !== oldVal[key] //新旧值不等
                &&
                oldVal //有历史数据对象
                &&
                !(oldVal[key] == undefined && stringConfig.isEmptyStr(newVal[key])) //历史数据的字段不存在并且当前值字段为空。其他联系人证件名称存在此问题
            ) {
                arr.push({
                    FIELD: key,
                    OLD: oldVal[key],
                    NEW: newVal[key]
                })
            }
        })
        return arr;
    },
    // 一柜通的对比方法。对应一柜通的compareInfo方法。 
    // 不同：不比较json文件中有，历史数据和页面没有且不需要传递的值
    compareJsonDiff: function (objOld, objNew, mainKey) {
        var diff = [];
        //如果新信息的主要字段为空，则当无操作处理。
        if (objNew && mainKey && !objNew[mainKey]) {
            return diff;
        }
        _.each(objNew, function (v, k) {
            if (Object.keys(objOld).includes(k)) {
                if (!objOld || (null !== (_.trim(objOld[k]) || "") && v !== (_.trim(objOld[k]) || ""))) {
                    diff.push({
                        FIELD: k,
                        OLD: objOld && objOld[k] || "",
                        NEW: v || ""
                    });
                }
            }

        });
        return diff;
    },
    /*
     * @Description: 
     * 1、 str json文件字段
     * 2、 oldObj 接口数据字段（本身旧值）
     * 3、 newObj 页面数据字段 (页面填写的新值)
     * @Author: chencheng
     * @Date: 2019-08-25 18:18:49
     */
    compareJsonField: function (str, oldVal, newVal) {
        let jsonField = keyFieldMap[str];
        let selfField = {};
        _.forEach(jsonField, function (jsonValue, jsonKey) {
            selfField[jsonKey] = ""
            if (Object.keys(oldVal).includes(jsonKey)) {
                selfField[jsonKey] = oldVal[jsonKey]
            }
            if (Object.keys(newVal).includes(jsonKey)) {
                selfField[jsonKey] = newVal[jsonKey].DEFAULT_VALUE
            }

        })
        selfField.DIFF_INFO = this.compareJsonDiff(oldVal, selfField)
        return selfField;
    },
    // 一柜通的对比方法。对应一柜通的compareInfo方法。
    compareInfo2: function (objOld, objNew, skipkey) {
        //objOld 如果为空对象 则所有属性都为空字符串
        var diff = [],
            skipKeyArr = skipkey && skipkey.split(",") || [];
        //如果新信息的主要字段为空，则当无操作处理。
        if (_.isEmpty(objNew)) {
            return diff;
        }
        _.each(objNew, function (v, k) {
            if (!objOld || v !== (_.trim(objOld[k]) || "")) {
                !_.includes(skipKeyArr,k) && diff.push({
                    FIELD: k,
                    OLD: objOld && objOld[k] || "",
                    NEW: v || ""
                });
            }
        });
        return diff;
    },
    //V0106个人对比方法
    compareInfo3: function (objOld, objNew, mainKey) {
        var diff = [];
        //如果新信息的主要字段为空，则当无操作处理。
        if (objNew && mainKey && !objNew[mainKey]) {
            return diff;
        }
        _.each(objNew, function (v, k) {
            if (!objOld || (null !== (_.trim(objOld[k]) || "") && v !== (_.trim(objOld[k]) || ""))) {
                if (_.indexOf(["ID_TYPE", "SEX", "CITIZENSHIP", "NATIONALITY", "OCCU_TYPE", "EDUCATION"], k) > -1) {
                } else {
                    if (k.indexOf("_TEXT") > -1) {
                        //将k翻译成字段名
                        let name = keysJson.tranCodeKeysText("0")[k.split("_TEXT")[0]];
                        diff.push({
                            title: name,
                            OLD_VAL_TEXT: objOld && objOld[k] || "",
                            NEW_VAL_TEXT: v || ""
                        });
                    } else {
                        //将k翻译成字段名
                        let name = keysJson.tranCodeKeysText("0")[k];
                        diff.push({
                            title: name,
                            OLD_VAL_TEXT: objOld && objOld[k] || "",
                            NEW_VAL_TEXT: v || ""
                        });
                    }

                }
            }
        });
        return diff;
    },
   //V0106机构对比方法
   compareInfo4: function (objOld, objNew, mainKey) {
       var diff = [];
       //如果新信息的主要字段为空，则当无操作处理。
       if (objNew && mainKey && !objNew[mainKey]) {
           return diff;
       }
       _.each(objNew, function (v, k) {
           if (!objOld || (null !== (_.trim(objOld[k]) || "") && v !== (_.trim(objOld[k]) || ""))) {
               if (_.indexOf(["ID_TYPE", "SEX", "CITIZENSHIP", "NATIONALITY", "OCCU_TYPE", "EDUCATION", "SZORG_TYPE", "FZ_ID_TYPE", "LEGAL_REP_ID_TYPE", "LINKMAN_ID_TYPE"], k) > -1) {} else {
                   if (k.indexOf("_TEXT") > -1) {
                       //将k翻译成字段名
                       let name = keysJson.tranCodeKeysText("1")[k.split("_TEXT")[0]];
                       diff.push({
                           title: name,
                           OLD_VAL_TEXT: objOld && objOld[k] || "",
                           NEW_VAL_TEXT: v || ""
                       });
                   } else {
                       //将k翻译成字段名
                       let name = keysJson.tranCodeKeysText("1")[k];
                       diff.push({
                           title: name,
                           OLD_VAL_TEXT: objOld && objOld[k] || "",
                           NEW_VAL_TEXT: v || ""
                       });
                   }

               }
           }
       });
       return diff;
   },

    // 校验主体身份
    isSubjectIdentity: (custIdent, checkIdent) => {
        if (_.isUndefined(custIdent) || _.isUndefined(checkIdent)) {
            alert("主体身份没有传入！")
        }
        if (!_.isString(custIdent) || !_.isString(checkIdent)) {
            return false;
        }
        let checkIdents = checkIdent.split(","),
            custIdents = custIdent.split(""),
            flag = false;
        _.each(checkIdents, function (v) {
            if (_.indexOf(custIdents, dict[v]) != -1) {
                flag = true;
                return false;
            }
        })
        return flag;
    },
    /*
     *@Description: 获取模块对比数据
     *@Author: yangyp
     *@Date: 2019-07-15 13:50:10
     */
    getMoudleArrDiff: function (fieldData, oldArr, mainKey, otherKey) {
        let saveArr = [];
        if (oldArr.length == 0) {
            //一个都没有，就是新增
            _.each(fieldData, function (curFieldItem) {
                if (stringConfig.isNotEmptyStr(curFieldItem.FIELDS[mainKey].DEFAULT_VALUE)) {

                    let saveItemObj = {};
                    saveItemObj[mainKey] = curFieldItem.FIELDS[mainKey].DEFAULT_VALUE;
                    saveItemObj[otherKey] = curFieldItem.FIELDS[otherKey].DEFAULT_VALUE;
                    saveItemObj["OPER_TYPE"] = 1;
                    saveItemObj["DIFF_INFO"] = [{
                        "FIELD": mainKey,
                        "OLD": "",
                        "NEW": curFieldItem.FIELDS[mainKey].DEFAULT_VALUE
                    }, {
                        "FIELD": otherKey,
                        "OLD": "",
                        "NEW": curFieldItem.FIELDS[otherKey].DEFAULT_VALUE
                    }];
                    saveArr.push(saveItemObj);
                }
            });
        } else {
            //有值，如果是判断完全相同，就是不变=== 3  如果是判断数据在原有里面完全没有 ==== 2   其他类型均为1
            //把现有的数据 先同步写进来，然后在写对比数据
            let newArr = [];
            _.each(fieldData, function (curFieldItem) {
                let saveItemObj = {};
                saveItemObj[mainKey] = curFieldItem.FIELDS[mainKey].DEFAULT_VALUE;
                saveItemObj[otherKey] = curFieldItem.FIELDS[otherKey].DEFAULT_VALUE;
                saveItemObj["OPER_TYPE"] = "3";
                saveItemObj["DIFF_INFO"] = [];
                newArr.push(saveItemObj);
            });


            //先获取新增的模型数组
            let addModArr = _.differenceWith(newArr, oldArr, function (a, b) {
                return (a[mainKey] === b[mainKey]) && (a[otherKey] === b[otherKey]);
            });
            //再获取删除的模型数组
            let delModArr = _.differenceWith(oldArr, newArr, function (a, b) {
                return (a[mainKey] === b[mainKey]) && (a[otherKey] === b[otherKey]);
            });

            //求交集，NUM相等的而且字段不同的就是发生了模块变更
            let modModArr = [];
            _.intersectionWith(oldArr, newArr, function (a, b) {
                // //先遍历每个字段看是否有错误
                if (a[mainKey] === b[mainKey]) {
                    if ((b[otherKey] != a[otherKey] && typeof b[otherKey] != "object") ||
                        !(_.isEqual(b[otherKey], a[otherKey]))) { // 有修改
                        let tempObj = {};
                        tempObj[mainKey] = b[mainKey];
                        tempObj[otherKey] = b[otherKey];
                        tempObj.OPER_TYPE = "1";
                        tempObj.DIFF_INFO = [{
                            "FIELD": otherKey,
                            "old": a[otherKey],
                            "new": b[otherKey]
                        }]
                        modModArr.push(tempObj);
                    }
                } else {
                    if ((b[otherKey] != a[otherKey] && typeof b[otherKey] != "object") || !(_.isEqual(b[otherKey], a[otherKey]))) { // 有修改
                        let tempObj = {};
                        tempObj[mainKey] = b[mainKey];
                        tempObj[otherKey] = b[otherKey];
                        tempObj.OPER_TYPE = "0";
                        tempObj.DIFF_INFO = [{
                            "FIELD": mainKey,
                            "old": a[mainKey],
                            "new": b[mainKey]
                        }, {
                            "FIELD": mainKey,
                            "old": a[mainKey],
                            "new": b[otherKey]
                        }];
                        modModArr.push(tempObj);
                    } else {
                        let tempObj = {};
                        tempObj[mainKey] = b[mainKey];
                        tempObj[otherKey] = b[otherKey];
                        tempObj.OPER_TYPE = "1";
                        tempObj.DIFF_INFO = [{
                            "FIELD": mainKey,
                            "old": a[mainKey],
                            "new": b[mainKey]
                        }];
                        modModArr.push(tempObj);
                    }

                }
            })

            if (addModArr.length) {
                console.log("新增的数组===", addModArr);
                _.each(addModArr, function (addItem) {
                    let upDataBool = false;
                    _.each(saveArr, function (saveItem) {
                        //去重复
                        if (addItem[mainKey] == saveItem[mainKey]) {
                            upDataBool = true;
                            return false;
                        }
                    })
                    if (!upDataBool) {
                        let defObj = {};
                        defObj[mainKey] = addItem[mainKey];
                        defObj[otherKey] = addItem[otherKey];
                        defObj["OPER_TYPE"] = "1";
                        defObj["DIFF_INFO"] = [{
                            "FIELD": mainKey,
                            "OLD": "",
                            "NEW": addItem[mainKey]
                        }, {
                            "FIELD": otherKey,
                            "OLD": "",
                            "NEW": addItem[otherKey]
                        }];
                        saveArr.push(defObj);
                    }
                })
            }
            console.log("删除的数组===", saveArr);
            if (delModArr.length) {
                _.each(delModArr, function (addItem) {
                    let upDataBool = false;
                    _.each(saveArr, function (saveItem) {
                        //去重复
                        if (addItem[mainKey] == saveItem[mainKey] && addItem[otherKey] == saveItem[otherKey]) {
                            upDataBool = true;
                            return false;
                        }
                    })
                    if (!upDataBool) {

                        let defObj = {};
                        defObj[mainKey] = addItem[mainKey];
                        defObj[otherKey] = addItem[otherKey];
                        defObj["OPER_TYPE"] = "2";
                        defObj["DIFF_INFO"] = [];
                        saveArr.push(defObj);
                    }
                })
            }
            console.log("删除的数组===", saveArr);
            if (modModArr.length) {
                _.each(modModArr, function (addItem) {
                    let upDataBool = false;
                    _.each(saveArr, function (saveItem) {
                        //去重复
                        if (addItem[mainKey] == saveItem[mainKey] && addItem[otherKey] == saveItem[otherKey]) {
                            upDataBool = true;
                            return false;
                        }
                    })
                    if (!upDataBool) {
                        saveArr.push(addItem);
                    }
                })
            }

            //最后合并没有修改的数据
            _.each(newArr, function (newItem) {
                let upDataBool = false;
                _.each(saveArr, function (saveItem) {
                    //去重复
                    if (newItem[mainKey] == saveItem[mainKey] && newItem[otherKey] == saveItem[otherKey]) {
                        upDataBool = true;
                        return false;
                    }
                })
                if (!upDataBool) {
                    saveArr.push(newItem);
                }
            })
        }
        return saveArr;
    },
    /*
     *@Description: 判断其他联系人数组是否有修改
     *@Author: yangyp
     *@Date: 2019-07-15 15:36:40
     */
    getMoudleArrIsChangeBool: function (_this, moudleArray) {
        let isChangeBool = false;
        _.forEach(moudleArray, function (item) {
            if (item.DIFF_INFO.length) {
                isChangeBool = true;
                return;
            }
        });
        return isChangeBool;
    },
    /*
     *@Description: 校验信息规则请求返回逻辑封装逻辑
     *@Author: yangyp
     *@Date: 2019-07-20 13:58:56
     *数据有异常直接返回错误信息，如果无问题返回false
     */
    checkInfoRuler: function (response) {
        let showMsg = "";
        if (response.AGE_OCCU_CHECK) {
            if (response.AGE_OCCU_CHECK.CHECK_CODE && response.AGE_OCCU_CHECK.CHECK_CODE != "1") {
                showMsg = showMsg + response.AGE_OCCU_CHECK.CHECK_RES || "" + "/n";
            }
        }
        if (response.OCCU_POSI_CHECK) {
            if (response.OCCU_POSI_CHECK.CHECK_CODE && response.OCCU_POSI_CHECK.CHECK_CODE != "1") {
                showMsg = showMsg + response.OCCU_POSI_CHECK.CHECK_RES || "" + "/n";
            }
        }

        if (response.OCCU_EDU_CHECK) {
            if (response.OCCU_EDU_CHECK.CHECK_CODE && response.OCCU_EDU_CHECK.CHECK_CODE != "1") {
                showMsg = showMsg + response.OCCU_EDU_CHECK.CHECK_RES || "" + "/n";
            }
        }

        if (response.CREDIT_CHECK) {
            if (response.CREDIT_CHECK.CHECK_CODE && response.CREDIT_CHECK.CHECK_CODE != "1") {
                showMsg = showMsg + response.AGE_OCCU_CHECK.CHECK_RES || "" + "/n";
            }
        }

        if (response.AGE_EDU_CHECK) {
            if (response.AGE_EDU_CHECK.CHECK_CODE && response.AGE_EDU_CHECK.CHECK_CODE != "1") {
                showMsg = showMsg + response.AGE_OCCU_CHECK.CHECK_RES || "" + "/n";
            }
        }
        return showMsg;
    },
    //判断银行证件是否与证件信息一致
    check_Bank_Module_Radio_flag: function (_this) {
        if (_this.userType == "0") {
            return _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.IDTYPE.DEFAULT_VALUE == _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.ID_TYPE.DEFAULT_VALUE &&
                _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.FULLNAME.DEFAULT_VALUE == _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.USER_FNAME.DEFAULT_VALUE;
        } else {
            return _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.IDTYPE.DEFAULT_VALUE == _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.ID_TYPE.DEFAULT_VALUE &&
                _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.IDNO.DEFAULT_VALUE == _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.ID_CODE.DEFAULT_VALUE &&
                _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.FULLNAME.DEFAULT_VALUE == _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.USER_FNAME.DEFAULT_VALUE;
        }
    },

    //基本信息校验
    isSyncBankFlag: function (_this, bankAcctInfoForm, newBaseForm) {
        //客户全称或者身份证号码有一个不一致就要同步银行
        let tempBool = "0";
        _.forEach(bankAcctInfoForm, function (item) {
            if (item.FULLNAME != newBaseForm.USER_FNAME.DEFAULT_VALUE ||
                item.IDNO != newBaseForm.ID_CODE.DEFAULT_VALUE ||
                item.IDTYPE != newBaseForm.ID_TYPE.DEFAULT_VALUE) {
                // let asynchronyBankStr= oppService.getBusiCommonParamsByCode(_this.oppBusiData.busiCommonParamsArray,'ASYNCHRONY_BANK');
                // let asynchronyBankArr = asynchronyBankStr.split(",");
                // if(_this.oppBusiData.bankSignInfo && _this.oppBusiData.bankSignInfo.length){
                //     _this.oppBusiData.bankSignInfo.forEach(element => {
                //         if(_.indexOf(asynchronyBankArr,element.EXT_ORG) == -1 && element.CONTRACT_STATUS == "0"){
                //             //如果不在这个列表，就需要进行同步银行
                //             tempBool = "1";
                //             return false;
                //         }
                //     });
                // }
                tempBool = "1";
                return false;
            }
        });

        return tempBool;
    },
    //判断三要素信息是否有修改
    checkImportantInfoChange: function (oldBaseForm, newBaseForm) {
        return oldBaseForm.CUST_FNAME != newBaseForm.CUST_FNAME.DEFAULT_VALUE ||
            oldBaseForm.ID_TYPE != newBaseForm.ID_TYPE.DEFAULT_VALUE ||
            oldBaseForm.ID_CODE != newBaseForm.ID_CODE.DEFAULT_VALUE;
    },
    getOldBankAcct: function (_this) {
        // _this.oppBusiData.bankAcctInfo
        let oldBankInfo = _this.oppBusiData.bankAcctInfo;
        _.forEach(oldBankInfo, function (oldItem) {
            //这里处理一下银证信息的客户全称 将BSB_USER_FNAME全称复制一份给FULLNAME
            oldItem.FULLNAME = oldItem.BSB_USER_FNAME;
            _.forEach(_this.oppBusiData.bankData, function (sysItem) {
                if (oldItem.BANKCODE == sysItem.EXT_ORG) {
                    oldItem.ORG_NAME = sysItem.ORG_NAME;
                    return false;
                }
            })
        })

        return oldBankInfo;

    },
    //三要素信息是否有修改
    checkBaseInfoChange: function (_this) {
        let oldBaseForm = _this.oppBusiData.custBaseInfo,
            newBaseForm = _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS;

        return oldBaseForm.USER_FNAME != newBaseForm.USER_FNAME.DEFAULT_VALUE ||
            oldBaseForm.ID_TYPE != newBaseForm.ID_TYPE.DEFAULT_VALUE ||
            oldBaseForm.ID_CODE != newBaseForm.ID_CODE.DEFAULT_VALUE ||
            oldBaseForm.USER_NAME != newBaseForm.USER_NAME.DEFAULT_VALUE;
    },
    getSignBankRequestData: function (_this) {
        let customerInfo = this.getCustomerAllData(_this);
        var basedata = {
            "CUST_CODE": customerInfo != null ? customerInfo.CUST_CODE : "",
            "CUACCT_CODE": customerInfo != null ? customerInfo.CUACCT_CODE : ""
        }
        return basedata;
    },
    // 从18位统一社会信用代码计算出组织机构代码
    getOrgIdCode: function (idCode) {
        if (!idCode || idCode.length !== 18) {
            return idCode;
        }
        var tmpCode = idCode.substring(8, 17);
        return tmpCode.substring(0, 8) + "-" + tmpCode.substring(8, 9);
    },
    getValidateMobile: () => {
        return validateMobile;
    },
    /**
     * 校验手机号码
     */
    runValidateMobile: async function(_this, mobileField, codeField, callBack)  {
        let that = this;
        return new Promise( async (resolve, reject) => {
            let validateMobileData = mobileField[validateMobile] || {};
            let mobile = mobileField.DEFAULT_VALUE || "";
            let authCode = codeField.DEFAULT_VALUE || "";
            let authId = validateMobileData.AUTH_ID || "";
            if (validateMobileData.MOBILE && validateMobileData.MOBILE == mobile && validateMobileData.AUTH_CODE == authCode) {
                resolve(true)
                return
            }
          
            if (!mobile) {
                _this.$nextTick( () => {
                    that.changeFieldError(mobileField, false, '请输入正确的手机号码')
                })
                resolve(false)
                return
            }
            if (!authId) {
                _this.$nextTick( () => {
                    that.changeFieldError(mobileField, false, '请先点击获取验证码')
                })
                resolve(false)
                return
            }

            if (!authCode) {
                _this.$nextTick( () => {
                    that.changeFieldError(codeField, false, '请输入验证码')
                })
                resolve(false)
                return;
            }
            let  checkUpValidCodeData = await smsService.checkUpValidCode({
                AUTH_ID: authId,
                AUTH_CODE: authCode,
                MOBILE: mobile
            });
            if ( _.get(checkUpValidCodeData, "CHECK_FLAG", "") == "1") {
                mobileField[validateMobile] = _.assign(mobileField[validateMobile], {
                    AUTH_CODE: authCode,
                    MOBILE: mobile
                })
                //检验完成后操作
                callBack && callBack();
                resolve(true)
                return;
            }
            _this.$nextTick( () => {
                that.changeFieldError(codeField, false, '请输入正确的验证码')
            })
            resolve(false);
        })
        
    },
    /**
     * 获取验证码校验逻辑，判断手机号是否正确
     */
    runValidateGetMobileCode: async function(_this, mobileField, codeField, callBack)  {
        let that = this;
        return new Promise( async (resolve, reject) => {
            let validateMobileData = mobileField[validateMobile] || {};
            let mobile = mobileField.DEFAULT_VALUE || "";
            let authCode = codeField.DEFAULT_VALUE || "";
            if (validateMobileData.MOBILE == mobile && validateMobileData.AUTH_CODE == authCode) {
                resolve(true)
                return
            }
          
            if (!mobile) {
                _this.$nextTick( () => {
                    that.changeFieldError(mobileField, false, '请输入正确的手机号码')
                })
                resolve(false)
                return
            }
            resolve(true);
        })
        
    },
    
    /**
     * 验证码获取
     */
    getVerificationCode: function (_this, params, field, remainTime, callBack) {
        if (params.MOBILE) {
            let obj = {
                ORG_CODE: params.ORG_CODE,
                MOBILE: params.MOBILE,
                EXP_SECS: remainTime || 60 //有效期
            };
            let that = this;
            let time = parseInt(remainTime) || 60;
            _this.loadingText = "正在获取验证码";
            _this.loading = true;
            let timeStamp = (new Date()).getTime();

            smsService.getSmsValidCode(obj).then(data => {
                field[validateMobile] = _.assign(field[validateMobile], {
                    codeStatus: false
                })
                if (data && data.SEND_FLAG == "1") {
                    this.showMsgBox(_this, "验证码已发送到：【" + params.MOBILE + "】，请注意查收！", null, null, null, null, "success")
                   //vue深层次响应理
                    _this.$set(field, 'BUTTON_ENABLE', true);
                    let interTimer = setInterval(() => {
                        time--
                        if (time <= 0 || field[validateMobile].codeStatus) {
                            field.BUTTON_ENABLE = false;
                            field.FIELD_BUTTON_TXT = '获取验证码';
                            clearInterval(interTimer);
                            return;
                        }
                        field.FIELD_BUTTON_TXT = `${time}秒` + '后重新获取';
                    }, 1000)
                    field[validateMobile] = _.assign(field[validateMobile], {
                        AUTH_ID: data.AUTH_ID || ""
                    })
                    callBack && callBack();
                } else {
                    this.showMsgBox(_this, "获取验证码失败")
                }
            }).catch( err => {
                _this.loading = false;
                this.showMsgBox(_this, "获取验证码失败");
            }).finally(() => {
                let newTimeStamp = (new Date()).getTime();
                let waitTime = newTimeStamp - timeStamp > 1500 ? 0: 1500;
                let timer = setTimeout(() => {
                    _this.loading = false;
                    timer = null;
                }, waitTime);
            });
        } else {
            this.showMsgBox(_this, "请输入正确的手机号")
        }
    },
    /**
     * 验证码验证
     */
    validateVerificationCode: function(_this, params, field, mobileField, callBack) {
        let mobile = params.MOBILE || "";
        let authCode = params.AUTH_CODE || "";
        let authId = _.get(mobileField, (validateMobile + "." + "AUTH_ID"), "");
        if (!authCode) {
            _this.$nextTick( () => {
                this.changeFieldError(field, false, '请输入验证码')
            })
            
            return;
        }
        if (!mobile) {
            _this.$nextTick( () => {
                this.changeFieldError(field, false, '请输入正确的手机号码')
            })
           
            return
        }
        if (!authId) {
            _this.$nextTick( () => {
                this.changeFieldError(field, false, '请先获取验证码')
            })
            
            return
        }
        if(authCode.length != 6){
            return;
        }
        _this.loading = true;
        _this.loadingText = "正在校验验证码";
        let timeStamp = (new Date()).getTime();
        
        smsService.checkUpValidCode({
            AUTH_ID: authId,
            AUTH_CODE: authCode,
            MOBILE: mobile
        }).then( res => {
            if (res.CHECK_FLAG && res.CHECK_FLAG == "1") {
                mobileField[validateMobile] = _.assign(mobileField[validateMobile], {
                    AUTH_CODE: authCode,
                    MOBILE: mobile,
                    codeStatus: true
                })
                //检验完成后操作
                callBack && callBack();
                return;
            }
            _this.$nextTick( () => {
                this.changeFieldError(field, false, '请输入正确的验证码')
            })
            
        }).finally( res => {
            let newTimeStamp = (new Date()).getTime();
            let waitTime = newTimeStamp - timeStamp > 1500 ? 0: 1500;
            let timer = setTimeout(() => {
                _this.loading = false;
                _this.loadingText = "";
                timer = null;
            }, waitTime);
        })
    },
    //通用读卡数据回填逻辑
    parseReadData: function(_this, fields){
        let includesSameNameOrkey = function(key1,key2){
            //2个字段同时包含相同的部分，
            // 比如字段标题都含有 “号码”，“类型”
            // 比如字段ID都含有 “NAME”，“TYPE”ID_EXP_DATE
            return  (key1.includes("NAME")&&key2.includes("NAME")) || (key1.includes("ID_TYPE")&&key2.includes("ID_TYPE")) || (key1.includes("ID_CODE")&&key2.includes("ID_CODE"))
            || (key1.includes("ID_ADDR")&&key2.includes("ID_ADDR")) || (key1.includes("ID_BEG_DATE")&&key2.includes("ID_BEG_DATE")) || (key1.includes("ID_EXP_DATE")&&key2.includes("ID_EXP_DATE")) 
            || ((key1.includes("姓名")||key1.includes("名称"))&&key2.includes("姓名")) || (key1.includes("证件号码")&&key2.includes("证件号码"))
            || (key1.includes("类型")&&key2.includes("类型"))|| (key1.includes("有效期")&&key2.includes("结束日期"))
        }
        let isEqual = function(key1,key2){
            return key1 == key2 || key1.includes(key2) || key2.includes(key1) || includesSameNameOrkey(key1,key2)
        }
        // TODO 回填身份证读卡信息
        if(_this.$storage.getSession(_this.$definecfg.READ_CARD) == 1){
            console.log("cardData",_this.$store.state.cardData);
            let readCardData = _this.$store.state.cardData;
            if(readCardData && ["00","0s","0e"].includes(readCardData.ID_TYPE)){
                for(let key in fields){
                    let title = fields[key].FIELD_TITLE;
                    for(let cardKey in readCardData){
                        let readCardDataTietle = {
                            BIRTHDAY: "出生日期",
                            CUST_FNAME:"姓名", 
                            ID_ADDR: "证件地址",
                            ID_BEG_DATE: "开始日期",
                            ID_CODE: "证件号码",
                            ID_EXP_DATE: "结束日期",
                            ID_ISS_AGCY: "发证机关",
                            ID_TYPE:"证件类型",
                            NATIONALITY: "民族",
                            SEX:"性别",
                        }
                        let cardTitle = readCardDataTietle[cardKey];
                        if(key && cardKey && title && cardTitle && (isEqual(key,cardKey) || isEqual(title, cardTitle))){
                            let cardValue = readCardData[cardKey] || "";
                            let fieldDict = fields[key].FIELD_DICT_NAME || [];
                            if (!_.isEmpty(fieldDict)) {
                                cardValue = _.get( _.find(fieldDict, {DICT_ITEM_NAME: cardValue}), "DICT_ITEM", "") || cardValue
                            }
                            fields[key].DEFAULT_VALUE = cardValue;
                            break;
                        }
                    }
                }
                return true;
            }else{
                _this.$blMethod.showMsgBox("目前仅支持以下证件类型的读卡：身份证，外国人永久居住证以及港澳台居民居住证")
                return false;
            }
        }
    },
    /**
    * 检查一码通资料完整性
    * @param localInfo
    * @param csdcInfo
    * @returns {{CHECK_FLAG: number, SYNC_INFO: {}}}
    */
    checkYmtInfoPerfect(localInfo, csdcInfo) {
        var checkFlag = 0,
            checkField = "0" == localInfo.USER_TYPE ? [
                {field1: "BIRTHDAY", field2: "BIRTHDAY", text: "出生日期", notNull: true},
                {field1: "SEX", field2: "SEX", text: "性别"},
                {field1: "EDUCATION", field2: "EDUCATION", text: "学历"},
                {field1: "OCCU_TYPE", field2: "OCCU_TYPE", text: "职业"},
                {field1: "MOBILE_TEL", field2: "MOBILE_TEL", text: "移动电话号码"},
                {field1: "ADDRESS", field2: "ADDRESS", text: "联系地址"},
                {field1: "ZIP_CODE", field2: "ZIP_CODE", text: "邮政编码"}
            ] : [
                {field1: "SZORG_TYPE", field2: "ORGANIZATION_CLS", text: "机构类别"},
                {field1: "CAPITAL_ATTR", field2: "CAPITAL_ATTR", text: "资本属性"},
                {field1: "USER_NAME", field2: "ORG_SIMPLE_NAME", text: "机构简称"},
                {field1: "LEGAL_REP", field2: "LEGAL_REP", text: "法人代表姓名"},
                {field1: "LEGAL_REP_ID_TYPE", field2: "LEGAL_REP_ID_TYPE", text: "法定代表人证件类型"},
                {field1: "LEGAL_REP_ID_CODE", field2: "LEGAL_REP_ID_CODE", text: "法定代表人证件号码"},
                {field1: "LINKMAN", field2: "LINKMAN", text: "联系人姓名"},
                {field1: "LINKMAN_ID_TYPE", field2: "LINKMAN_ID_TYPE", text: "联系人证件类型"},
                {field1: "LINKMAN_ID", field2: "LINKMAN_ID_CODE", text: "联系人证件号码"},
                {field1: "OFFICE_TEL", field2: "TEL", text: "固定电话"},
                {field1: "OFFICE_ADDR", field2: "ADDRESS", text: "联系地址"},
                {field1: "ZIP_CODE", field2: "ZIP_CODE", text: "邮政编码"}
            ],
            syncInfo = {};
        localInfo.LINKMAN ? "" : (localInfo.LINKMAN = localInfo.LINKMAN_NAME) 
        _.each(checkField, function (confObj, index) {
            var checkVal = confObj.notNull ? "0" : "",
                csdcVal = csdcInfo && csdcInfo[confObj.field2] && csdcInfo[confObj.field2].trim(),
                localVal = localInfo && localInfo[confObj.field1] && localInfo[confObj.field1].trim();
            if (csdcVal == checkVal && localVal == checkVal) {
                checkFlag = 1;//中登为空，且账户为空
                return false;
            } else if (csdcVal == checkVal && localVal != checkVal) {
                var tempObj = {};
                checkFlag = 2;//中登为空，但账户不为空
                tempObj[confObj.field2] = localInfo[confObj.field1];
                tempObj.fieldText = (syncInfo.fieldText ? (syncInfo.fieldText + ",") : "") + confObj.text;
                _.extend(syncInfo, tempObj);
            }
        });
        return {
            CHECK_FLAG: checkFlag,
            SYNC_INFO: _.extend(syncInfo, {fieldText: checkFlag == 2 ? syncInfo.fieldText : ""})
        };
    },
     /**
     * 获取session存储的系统公参数据
     */
    getJsonSessionSysCommParam: (_this, key) => {
        let sysCommonParam = _this.$storage.getJsonSession(_this.$definecfg.SYS_COMM_PARAM_OBJS) || {};
        return sysCommonParam[key] || '';
    },
    /**
     * 获取session存储的业务公参数据
     */
    getJsonSessionBusiCommParam: (_this, key) => {
        let busiCommonParams = _this.$storage.getJsonSession(_this.$definecfg.BUSI_COMM_PARAM_OBJS) || {};
        return busiCommonParams[key] || '';
    },
    /**
     * 更新路由的名称
     */
    updateRouteName: (_this, oldName, newName) => {
        // 获取路由表
        let routeTable = _.cloneDeep(_this.$store.state.bizRouteTable)
        // 获取对应得路由表索引
        let index = _this.$router.getRouteIndex(oldName) || -1;
        if (index == -1) {
            return;
        }
        routeTable[index] && (routeTable[index]["name"] = newName);

        // 更新路由表信息
        _this.$store.commit(_this.$types.UPDATE_BIZ_ROUTE_TABLE, routeTable);
    },
    /**
    * 逐个过滤出开户逻辑数据
    * @param param
    * @param openLogicData
    */
    filterOpenLogicData: function (param, openLogicData) {
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
    },
    loadOpenLogicData: function (_this, params) {
        let logicObj = this.filterOpenLogicData({
            ID_TYPE: params.ID_TYPE || "",
            SUBJECT_IDENTITY: params.SUBJECT_IDENTITY || "",
            INOUTSIDE_IDENTITY: params.INOUTSIDE_IDENTITY || "",
            OCCU_TYPE: params.OCCU_TYPE || "",
        }, _this.oppBusiData.allAcctOpenLogicData);
        // 修改需要重新加载数据的表单
        return logicObj;
    },
    /**
     * 证件号获取性别生日
     */
    autoSexBirthday: function (_this, field, fieldData, SEX, BIRTHDAY, idtype) {
        let value = field.DEFAULT_VALUE || "";
        if (SEX in fieldData) { // 关联性别
            let f = fieldData[SEX];
          
            if ((idtype == "00" || idtype == "08" || idtype == "0s") && value) {
                let sex = utils.getSex(value);
                if (sex == "M") {
                    f.DEFAULT_VALUE = "0"; // 0-男性
                    f.FIELD_CONTROL = "2";
                } else {
                    f.DEFAULT_VALUE = "1"; // 1-女性
                    f.FIELD_CONTROL = "2";
                }
            } else {
                f.FIELD_CONTROL = "0";
            }
        }
        if (BIRTHDAY in fieldData) { // 关联出生日期
            let f = fieldData[BIRTHDAY];
            if ((idtype == "00" || idtype == "08"|| idtype == "0s") && value) {
                f.DEFAULT_VALUE = utils.getBirthday(value);
                f.FIELD_CONTROL = '2';
            } else {
                f.FIELD_CONTROL = '0';
            }
        }
    },
    /**
     * 选项是否在字典内 不在则清除
    */
    isDictClean: (field) => {
        //值改变的时候判断是否在字典内
        let defaultValue = field.DEFAULT_VALUE || ""
        let dict = field.FIELD_DICT_NAME || [];
        let filterDict = field.FIELD_DICT_FILTER || "";
        let dictVal = _.find(dict, {DICT_ITEM: defaultValue}) || {};
        if (_.isEmpty(dictVal) || 
        !_.isEmpty(filterDict) && (filterDict.indexOf("!") > -1 && filterDict.indexOf(defaultValue) > -1) || 
        !_.isEmpty(filterDict) && (filterDict.indexOf("!") == -1 && filterDict.indexOf(defaultValue) == -1)
        ) {
            field.DEFAULT_VALUE = "";
        }
    },
    /**
     * 判断是否有生僻字
     */
     isCommonChar: (str) => {
        let flag = /^.*(（[a-zA-Z]+）).*$/.test(str);
        return !flag;
    },
    //获取时间片
    isServiceTime: (_this, params) => {
        return _this.$syscfg.K_Request("YG003825", {
            RES_IDS: params.RES_IDS,
            RES_TYPE: params.RES_TYPE
        }).then( res => {
            if (_.get(res, "Code", "") == "0") {
                return _.get(res, "Data[0].CHECK_FLAG", "") == "true" ? true : false
            }
            return false;
        })
    },
    /**
     * 重复检查
    */
    checkIdCodeIsExisted: function (_this, field, errorContent) {
        let defaultValue = field.DEFAULT_VALUE || "";
        let hasNum = _.filter(_.get(_this.groupDatas, _this.groupId + "." + field.MODULE_ID, []), item => {
            return item.FIELDS[field.FIELD_ID].DEFAULT_VALUE == defaultValue
        }) || []
        if(field.FIELD_ID == "BENEFICIARY_RELA" && defaultValue != "0Z"){
            hasNum = [];
        }
        
        if (hasNum.length > 1) {
            _this.$nextTick(() => {
                this.changeFieldError(field, false, errorContent);
            })
        }
        if (hasNum.length <= 1) {
            _.each(_this.groupDatas[_this.groupId][field.MODULE_ID], moduleItem => {
                if (moduleItem.FIELDS[field.FIELD_ID].message == errorContent && moduleItem.FIELDS[field.FIELD_ID].showerr) {
                    moduleItem.FIELDS[field.FIELD_ID].message = "";
                    moduleItem.FIELDS[field.FIELD_ID].showerr = false;
                }
            })
        }
        return hasNum.length > 1;
    },
    /**
    * 获取证券账户开户逻辑设置
    * @param param
    * @returns {*}
    */
    getBusiAcctOpenLogic: (_this, param) => {
        // // 初始化数据   
        return Promise.all([
            _this.$syscfg.K_Request("YG003405", _.extend(param || {}, {IS_USED: "1"})),
            _this.$syscfg.K_Request('Y3000001', {  
                LBM: "KUAS_L0001000",
                F_FUNCTION: "980302011",
                QUERY_MODE: "QUERY"
            })
        ]).then((res1, res2) => {
            let logicArr = _.get(res1,"[0].Data");
            let overInfo = _.get(res2,"[0].Data"),
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
        })
    },
    /**
     * 证件校验规则赋值
     */
     setValidType: function (_this, field, fieldData, idName) {
        let defaultValue = field.DEFAULT_VALUE || "";
        let VALID_TYPE = this.getIdCodeValidType(defaultValue);
        fieldData[idName].VALID_TYPE = VALID_TYPE;
    },
    //获取证件号码的校验规则
    getIdCodeValidType: (idType) => {
        let VALID_TYPE = "address[6,48]|on-blur";
        if (idType == "00" || idType == "08") {
            VALID_TYPE = "cardno[true]|on-blur"
        } 
        if (idType == "0s") {
            VALID_TYPE = "ABCcardno[true]|on-blur"
        }
        // if (idType == '10') {
        //     VALID_TYPE = "licensecode|on-blur"
        // }
        return VALID_TYPE
    },
    /*
        * 是否特殊机构
        * @param szorgType  机构类别
    */
    isSpeOrg(szorgType, szorgTypeArr) {
        if (_.isEmpty(szorgTypeArr)) {
            szorgTypeArr = (oppService.getSysCommonParamsFromCacheObjs('SPE_SZORG_TYPE') || '10,11,12,13,14,19,25b,41').split(",");
        }
        return _.indexOf(szorgTypeArr, szorgType) != -1;
    },
     /*检测一码通信息 */
     checkYmtInfo:function(_this, csdcYmtData, sysYmtData, idTypeRelationInfo, idTypeDict){
        let that = _this;
        let ymtListArr = _.filter(csdcYmtData && csdcYmtData.YMT_LIST || [], function (v) {
            return v.YMT_STATUS != "9"
        })
        let trdAcct = _.filter(csdcYmtData && csdcYmtData.TRDACCT_LIST || [], function (v) {
            return v.ACCT_STATUS != "9"
        })[0] || {}
        let relationIdTypeData = idTypeRelationInfo && _.find(idTypeRelationInfo, {
            DD_ITEM: sysYmtData.ID_TYPE
        });
        //中登存在两个一码通，过滤出有证券账户的一码通账号
        let ymtList = _.find(ymtListArr, function (obj) {
            return obj.YMT_CODE == trdAcct.YMT_CODE
        }) || ymtListArr[0] || {};
        if (!(Object.keys(ymtList) == 0) && (ymtList.CUST_FNAME != sysYmtData.CUST_FNAME || (ymtList.ID_TYPE != sysYmtData.ID_TYPE && (!relationIdTypeData || relationIdTypeData.RLTO_DD_ITEM != ymtList.ID_TYPE)) || ymtList.ID_CODE != sysYmtData.ID_CODE)) {
            let sysType = sysYmtData["ID_TYPE"] + "-" + _.get(_.filter(idTypeDict, function (c) {
                return c.DICT_ITEM == sysYmtData["ID_TYPE"]
            })[0], "DICT_ITEM_NAME", "");
            let csdcType = ymtList["ID_TYPE"] + "-" + _.get(_.filter(idTypeDict, function (c) {
                return c.DICT_ITEM == ymtList["ID_TYPE"]
            })[0], "DICT_ITEM_NAME", "")
            //系统内三要素和中登三要素不一致
            that.oppBusiData.csdcDiffArr = [{
                FIELD: "CUST_FNAME",
                SYS: sysYmtData["CUST_FNAME"],
                CARD: ymtList["CUST_FNAME"],
                FIELD_TXT: "客户名称"
            },
            {
                FIELD: "ID_TYPE",
                SYS: sysType,
                CARD: csdcType,
                FIELD_TXT: "证件类型",
            },
            {
                FIELD: "ID_CODE",
                SYS: sysYmtData["ID_CODE"],
                CARD: ymtList["ID_CODE"],
                FIELD_TXT: "证件号码",
            }
            ]
            return true;
        } else {
            return false
        }
    },
    /**
    * 关联性必填 如果有一个字段有值 则其他都必填
    */
     arrHasValue: (_this, fieldData, arr) => {
        let isRequired = false;
        _.each(arr, item => {
            if (fieldData[item].DEFAULT_VALUE) {
                isRequired = true;
                return false;
            }
        })
        _.each(arr, item => {
            fieldData[item].FIELD_REQUIRED = isRequired ? "1" : "0"
            if (isRequired == "0") {
                fieldData[item].message = "";
                fieldData[item].correct = true;
                fieldData[item].showerr = false;
            }
        })
    },
    addDiffAttArr: function (fields, info, fieldConversion) {
        let infoTpl = _.cloneDeep(info);
        _.each(infoTpl, (infoItem, key) => {
            //删除 增加一个deleteDiff 用于对比页面展示
            
            if (infoItem.OPER_TYPE == "2") {
                let deleteDiff = [];
                _.each(_.get(infoItem, "DIFF_INFO.[0]", {}), (item, key) => {
                    deleteDiff.push({NEW: "", OLD: item, FIELD: key});
                })
                infoTpl[key].deleteDiff = this.addDiffAtt(fields, deleteDiff, fieldConversion);
            }
            infoTpl[key].DIFF_INFO = this.addDiffAtt(fields, infoItem.DIFF_INFO, fieldConversion);
        })
        return infoTpl
    },
    //add:ljb 对比进行转换以及添加属性 主要转换字典 以及添加字段名字
    //fieldConversion: 转换成其他字段 例如 涉税 CITIZENSHIP2转换为CITIZENSHIP
    addDiffAtt: (fields, diff, fieldConversion) => {
        let fieldsTpl = _.cloneDeep(fields) || {};
        let feildsNew = {};
        _.each(fieldsTpl, (item, key) => {
            feildsNew[key] = {
                FIELD_TITLE: item.FIELD_TITLE || "",
                FIELD_DICT_NAME: item.FIELD_DICT_NAME || [],
                MODULE_ID: item.MODULE_ID,
                FIELD_SEQ: item.FIELD_SEQ
            }
        })

        //添加其他字段函数处理
        let addAttFn = (diffTpl) => {
            _.map(diffTpl, item => {
                let fieldItem = feildsNew[item.FIELD || ""] || {};
                if (!_.isEmpty(fieldConversion) && fieldConversion[item.FIELD]) {
                    fieldItem = feildsNew[fieldConversion[item.FIELD] || ""];
                }
                if (fieldItem.FIELD_TITLE) {
                    item.FIELD_TITLE = fieldItem.FIELD_TITLE;
                }
                if (!_.isEmpty(fieldItem.FIELD_DICT_NAME)) {
                    let oldText = _.find(fieldItem.FIELD_DICT_NAME, {DICT_ITEM: item.OLD}) || {};
                    let newText = _.find(fieldItem.FIELD_DICT_NAME, {DICT_ITEM: item.NEW}) || {};
                    item.OLD_TEXT = oldText.DICT_ITEM_NAME || "";
                    item.NEW_TEXT = newText.DICT_ITEM_NAME || "";
                }
                item.MODULE_ID = fieldItem.MODULE_ID;
                return item
            })
            return diffTpl;
        }
        diff = addAttFn(_.cloneDeep(diff));
        return diff;
    },
    /*
         * 检查联系地址是否合法
         * 1.以关键字或词之一开头：“北京、天津、河北、山西、内蒙、辽宁、吉林、黑龙江、上海、江苏、浙江、安徽、福建、江西、山东、河南、湖北、湖南、广东、广西、海南、重庆、四川、贵州、云南、西藏、陕西、甘肃、青海、宁夏、新疆、台湾、香港、澳门、济南、石家庄、长春、哈尔滨、沈阳、呼和浩特、乌鲁木齐、兰州、银川、太原、西安、郑州、合肥、南京、杭州、福州、广州、南昌、海口、南宁、贵阳、长沙、武汉、成都、昆明、拉萨、西宁、深圳、青岛、大连、苏州、厦门、洛阳、桂林、宁波、三亚、包头、珠海”。
         * 2.含关键字或词之一：“村、组、委、排、庄、屯、铺、堡、里、弄、巷、胡同、条、路、街、道、栋、楼、层、院、厦、座、寓、场、园、苑、号、单元、室、房、小区、幢、门、队、户
         * 3.含汉字数字、阿拉伯数字、大小写字母的一种
         * 4.不以关键字之一结尾：“省、市、州、旗、区、盟、县、乡、镇、路、街、道”。
         * 5.不包含“不详”
         * */
    checkLeagelAddress: function (addRess,inputAddress) {
        let rule1 = "北京、天津、河北、山西、内蒙、辽宁、吉林、上海、江苏、浙江、安徽、福建、江西、山东、河南、湖北、湖南、广东、广西、海南、重庆、四川、贵州、云南、西藏、陕西、甘肃、青海、宁夏、新疆、台湾、香港、澳门、济南、长春、沈阳、兰州、银川、太原、西安、郑州、合肥、南京、杭州、福州、广州、南昌、海口、南宁、贵阳、长沙、武汉、成都、昆明、拉萨、西宁、深圳、青岛、大连、苏州、厦门、洛阳、桂林、宁波、三亚、包头、珠海",
            reul1a = "黑龙江、哈尔滨、石家庄",
            reul1b = "呼和浩特、乌鲁木齐",
            //标准版2201新增：幢、门、队、户  银河业务部门不需要这四个字 个性去掉
            rule2 = "村、组、委、排、庄、屯、铺、堡、里、弄、巷、条、路、街、道、栋、楼、层、院、厦、座、寓、场、园、苑、号、室、房", //胡同  单元 小区  两个字放在后面判断；
            //标准版2201新增：零
            rule3 = "一、二、三、四、五、六、七、八、九、十、零、壹、贰、叁、肆、伍、陆、柒、捌、玖、拾",
            rule4= "省、市、州、旗、区、盟、县、乡、镇、路、街、道";
        if(_.isEmpty(addRess)){
            return;
        }

        //标准版2201新增：因银河校验地址的范围更广，有的地址取不到输入部分，只能校验全部地址，故此处判断一下。
        // 输入部分有入参就校验输入部分，反之就校验全部。
        let yinheAddress = utils.toCDB(inputAddress || addRess);

        let newAddress = utils.toCDB(addRess); //全角转半角

        //step1 是否以关键字或词之一开头
        let flag1 = _.includes(rule1.split("、"),newAddress.substr(0,2)) || _.includes(reul1a.split("、"),newAddress.substr(0,3)) ||  _.includes(reul1b.split("、"),newAddress.substr(0,4)),
            //step2 含关键字或词之一
            flag2 = !!_.intersection(rule2.split("、"),yinheAddress.split("")).length || yinheAddress.indexOf("胡同") != -1 || yinheAddress.indexOf("单元") != -1 || yinheAddress.indexOf("小区") != -1,
            //step3 含汉字数字、阿拉伯数字、大小写字母的一种。
            flag3 = /[0-9a-z]/i.test(yinheAddress) || !!_.intersection(rule3.split("、"),yinheAddress.split("")).length,
            //step4 不以关键字之一结尾
            flag4 = !_.includes(rule4.split("、"),yinheAddress.substr(yinheAddress.length - 1,1)),
            //step5 不包含“不详”
            flag5 = newAddress.indexOf("不详") == -1;
        if(flag1 && flag2 && flag3 && flag4 && flag5){
            return true;
        }
        return false;
    },
    /*
     * 录入的证件结束日期与证件开始日期做比对，不符合以下规则，身份证：3个月、5年、10年、20年、长期   此需求纳入标准版
     * */
    checkIdExpDate: function (idBegDate,idEndDate) {
        //录入的证件结束日期与证件开始日期做比对，不符合以下规则，身份证：3个月、5年、10年、20年、长期
        var isValidFlag = false;
        //step1  3个月  开始日期 + 3个月 == 结束日期
        var flag1 = idEndDate === date.getMonthBeforeToday("3",idBegDate);
        //step2  5年  开始日期 + 5*12个月 == 结束日期
        var flag2 = idEndDate === date.getMonthBeforeToday("60",idBegDate);
        //step3  10年  开始日期 + 10*12个月 == 结束日期
        var flag3 = idEndDate === date.getMonthBeforeToday("120",idBegDate);
        //step4  20年  开始日期 + 20*12个月 == 结束日期
        var flag4 = idEndDate === date.getMonthBeforeToday("240",idBegDate);
        //step5 证件结束日期为长期
        var flag5 = idEndDate === "30001231";
        if(flag1 || flag2 || flag3 || flag4 || flag5){
            isValidFlag = true;
        }
        return isValidFlag;
    },
    //获取字典项对应的中文名称
    getFieldValueName :function(FIELD_DICT_NAME, DEFAULT_VALUE) {
        if (FIELD_DICT_NAME && DEFAULT_VALUE) {
            let defaultDict = _.find(FIELD_DICT_NAME, item => {
                return item.DICT_ITEM == DEFAULT_VALUE;
            })
            return defaultDict && defaultDict.DICT_ITEM_NAME || '';
        }
        return '';
    },
    /**
     * 获取模块分组中具有相同的值的字段对象
     * @param {object} _this 
     * @param {object} field 
     * @returns {array} 具有相同的值的字段对象
     */
    getDuplicatedFields: function(_this, field) {
        let defaulteValue = field.DEFAULT_VALUE;
        let modules = _.filter(_.get(_this.groupDatas, _this.groupId + "." + field.MODULE_ID, []), module => {
            return module.FIELDS[field.FIELD_ID].DEFAULT_VALUE == defaulteValue;
        });
        return _.map(modules, "FIELDS." + field.FIELD_ID);
    },
    /**
     * 模块分组中的字段值重复时，在字段输入框下显示提醒信息
     * @param {object} _this 
     * @param {object} field 
     * @param {string} message 提醒信息
     */
    showWarningIfFieldValueDuplicated: function(_this, field, message) {
        let duplicatedFields = this.getDuplicatedFields(_this, field);
        if (duplicatedFields && duplicatedFields.length > 1) {
            _this.$nextTick( () => {
                this.changeFieldError(field, false, message);
            })
        }
    },
    /**
     * 模块分组中的某字段值是否重复
     * @param {object} _this 
     * @param {object} groupId 
     * @param {object} moduleId 
     * @param {object} fieldId 
     */
    isFieldDuplicated: function(_this, groupId, moduleId, fieldId) {
        let map = {};
        for (let i = 0; i < _this.groupDatas[groupId][moduleId].length; i++) {
            module = _this.groupDatas[groupId][moduleId][i];
            if (_.isEmpty(map[module.FIELDS[fieldId].DEFAULT_VALUE])) {
                // 这里存放什么并不重要，非空即可
                map[module.FIELDS[fieldId].DEFAULT_VALUE] = fieldId;
            } else {
                return true;
            }
        }
        return false;
    },
    /**
     * 过滤模块中某个字段的选项，但是不过滤存量数据
     * 注意：如果选中的选项不在可选范围内，将会被清空！！！
     * @param {object} _this 
     * @param {string} groupId 
     * @param {string} moduleId 
     * @param {string} fieldId 
     * @param {array} allOptions 全部可选选项数组(可以传空，为空时默认为字段定义的字典项)
     * @param {array} excludeOptions 需要过滤掉的选项数组
     * @param {object} originalData 存量数据
     */
    filterOptionsButRetainHistoryOptions: function(_this, groupId, moduleId, fieldId, allOptions, excludeOptions, originalData) {
        if (_.isEmpty(allOptions)) {
            allOptions = _.map(_this.groupDatas[groupId][moduleId][0].FIELDS[fieldId].FIELD_DICT_NAME, "DICT_ITEM");
        }
        _.each(_this.groupDatas[groupId][moduleId], module => {
            let fields = module.FIELDS;
            let filteredOptions = _.filter(allOptions, option => {
                return _.indexOf(excludeOptions, option) == -1;
            })
            // 保留存量选项，不过滤
            let fieldDictFilter = _.union(filteredOptions, _.filter(this.getOriginalOptions(originalData, fieldId), item => {
                return excludeOptions.indexOf(item) > -1;
            })) || [];
            // 如果当前值不在可选选项中，则清空当前值
            if (fieldDictFilter.indexOf(fields[fieldId].DEFAULT_VALUE) == -1) {
                fields[fieldId].DEFAULT_VALUE = "";
            }
            fields[fieldId].FIELD_DICT_FILTER = fieldDictFilter;
        })
    },
    /**
     * 从原始数据中获取原始选项
     * @param {object} originalData 
     * @param {string} fieldId 
     * @returns 
     */
    getOriginalOptions: function(originalData, fieldId) {
        let originalOptions = [];
        if (_.isEmpty(originalData)) {
            return originalOptions;
        }
        if (originalData.length == undefined) {
            // 对象类型型数据
            if (this.isNotEmptyString(originalData[fieldId])) {
                originalOptions.push(originalData[fieldId]);
            }
        } else {
            // 数组类型数据
            for (let i = 0; i < originalData.length; i++) {
                let data = originalData[i];
                if (originalOptions.indexOf(data[fieldId]) == -1) {
                    if (this.isNotEmptyString(data[fieldId])) {
                        originalOptions.push(data[fieldId]);
                    }
                }
            }
        }
        return originalOptions;
    },
    /**
     * 是否为非空字符串
     * @param {string} str 
     * @returns 
     */
    isNotEmptyString: function(str) {
        if (typeof str == "string" && !_.isEmpty(str.trim())) {
            return true;
        }
        return false;
    },
    /**
     * 过滤模块中某个字段的选项并且置空存量被过滤掉的数据
     * @param {object} _this 
     * @param {string} groupId 
     * @param {string} moduleId 
     * @param {string} fieldId 
     * @param {array} excludeOptions 需要过滤掉的选项数组
     * @param {array} allOptions 可不传，有值时，过滤前的全部可选选项为 allOptions
     */
     filterOptionsAndEmptyExcludedOption: function(_this, groupId, moduleId, fieldId, excludeOptions, allOptions) {
        _.each(_this.groupDatas[groupId][moduleId], module => {
            let fields = module.FIELDS;
            if (!_.isEmpty(allOptions)) {
                let options = _.filter(allOptions, obj => {
                    return !excludeOptions.includes(obj);
                })
                fields[fieldId].FIELD_DICT_FILTER = options.join(",");
            } else {
               fields[fieldId].FIELD_DICT_FILTER = _.isEmpty(excludeOptions) ? "" : "!" + excludeOptions.join(","); 
            }
            if (excludeOptions.indexOf(fields[fieldId].DEFAULT_VALUE) != -1) {
                fields[fieldId].DEFAULT_VALUE = "";
            }
        })
    },
    /**
     * 过滤模块中某个字段的选项
     * @param {object} _this 
     * @param {string} groupId 
     * @param {string} moduleId 
     * @param {string} fieldId 
     * @param {array} allOptions 全部可选选项数组
     * @param {array} excludeOptions 需要过滤掉的选项数组
     */
     filterOptions: function(_this, groupId, moduleId, fieldId, allOptions, excludeOptions) {
        _.each(_this.groupDatas[groupId][moduleId], module => {
            let fields = module.FIELDS;
            let filteredOptions = _.filter(allOptions, option => {
                return _.indexOf(excludeOptions, option) == -1;
            })
            fields[fieldId].FIELD_DICT_FILTER = filteredOptions;
        })
    },
    /**
     * 根据模块的序列号，获取模块在分组中的下标
     * @param {object} _this 
     * @param {string} groupId 
     * @param {string} moduleId 
     * @param {string} moduleSeq 
     * @returns 
     */
    getModuleNum: function(_this, groupId, moduleId, moduleSeq) {
        let moduleArr = _this.groupDatas[groupId][moduleId];
        for (let i = 0; i < moduleArr.length; i++) {
            if (moduleArr[i].MODULE_SEQ == moduleSeq) {
                return i;
            }
        }
        console.error("获取 moduleNum 失败！");
        return "";
    },
    /**
     * 将 cascadeGroupInfo 模块注册到 sourceGroupInfo 模块上，当 sourceGroupInfo 模块字段更新时，可调用 cascadeUpdate() 
     * 级联更新 cascadeGroupInfo 模块字段，sourceGroupInfo 可注册多个 cascadeGroupInfo。
     * 可调用 cancelCascade() 取消级联关系
     * @param {object} _this 关联数据将存放在 _this.oppBusiData.cascadeData 中
     * @param {object} sourceGroupInfo 要关联的模块的 group 配置信息: {GROUP_ID: "", MODULE_ID: "", MODULE_SEQ:""}
     * @param {object} cascadeGroupInfo 自身模块的 group 配置信息: {GROUP_ID: "", MODULE_ID: "", MODULE_SEQ:""}
     * @param {object} fieldsMap 关联模块与自身模块的字段ID映射关系表: {"":"", "":"" ....}，在映射表中的字段才会级联更新
     */
    cascadeTo: function(_this, sourceGroupInfo, cascadeGroupInfo, fieldsMap) {
        let sourceId = sourceGroupInfo.GROUP_ID + "-" + sourceGroupInfo.MODULE_ID + "-" + sourceGroupInfo.MODULE_SEQ;
        let cascadeId = cascadeGroupInfo.GROUP_ID + "-" + cascadeGroupInfo.MODULE_ID + "-" + cascadeGroupInfo.MODULE_SEQ;
        if (_.isEmpty(_this.oppBusiData.cascadeData) || _.isEmpty(_this.oppBusiData.cascadeData[sourceId])) {
            _this.oppBusiData.cascadeData = Object.assign(_this.oppBusiData.cascadeData || {}, {
                [sourceId]: {
                    [cascadeId]: {
                        GROUP_ID: cascadeGroupInfo.GROUP_ID,
                        MODULE_ID: cascadeGroupInfo.MODULE_ID,
                        MODULE_SEQ: cascadeGroupInfo.MODULE_SEQ,
                        fieldsMap: fieldsMap
                    }
                }
            })
        } else {
            Object.assign(_this.oppBusiData.cascadeData[sourceId], {
                [cascadeId]: {
                    GROUP_ID: cascadeGroupInfo.GROUP_ID,
                    MODULE_ID: cascadeGroupInfo.MODULE_ID,
                    MODULE_SEQ: cascadeGroupInfo.MODULE_SEQ,
                    fieldsMap: fieldsMap
                }
            })
        }
    },

    /**
     * 级联更新 sourceGroupInfo 模块下注册的模块，关联信息保存在 _this.oppBusiData.cascadeData 中
     * @param {object} _this 
     * @param {object} sourceGroupInfo {GROUP_ID: "", MODULE_ID: "", MODULE_SEQ:""}
     * @param {string} fieldId 非必传，有值时只级联更新 fieldId 字段，否则更新所有注册的字段
     * @returns 
     */
    cascadeUpdate: function(_this, sourceGroupInfo, fieldId) {
        let sourceId = sourceGroupInfo.GROUP_ID + "-" + sourceGroupInfo.MODULE_ID + "-" + sourceGroupInfo.MODULE_SEQ;
        if (_.isEmpty(_this.oppBusiData.cascadeData) || _.isEmpty(_this.oppBusiData.cascadeData[sourceId])) {
            return;
        }
        let sourceModuleNum = this.getModuleNum(_this, sourceGroupInfo.GROUP_ID, sourceGroupInfo.MODULE_ID, 
            sourceGroupInfo.MODULE_SEQ);
        let sourceFields = _this.groupDatas[sourceGroupInfo.GROUP_ID][sourceGroupInfo.MODULE_ID][sourceModuleNum].FIELDS;
        for (let cascadeId in _this.oppBusiData.cascadeData[sourceId]) {
            let item = _this.oppBusiData.cascadeData[sourceId][cascadeId];
            let cascadedModuleNum = this.getModuleNum(_this, item.GROUP_ID, item.MODULE_ID, item.MODULE_SEQ);
            let cascadedFields = _this.groupDatas[item.GROUP_ID][item.MODULE_ID][[cascadedModuleNum]].FIELDS;
            let tempFieldsMap = _.cloneDeep(item.fieldsMap);
            if (!_.isEmpty(fieldId)) {
                tempFieldsMap = {
                    [fieldId]: tempFieldsMap[fieldId]
                }
            }
            this.copyFieldsAndTrigerCheck(cascadedFields, sourceFields, tempFieldsMap, 
                    _this, _this.groupDatas[item.GROUP_ID][item.MODULE_ID][[cascadedModuleNum]]);
        }
    },
    /**
     * 复制字段值
     * @param {object} targetFields 
     * @param {object} sourceFields 
     * @param {object} fieldsMap sourceFields 与 targetFields 字段id映射关系
     */
    copyFields: function(targetFields, sourceFields, fieldsMap) {
        for (let sourceFieldId in fieldsMap) {
            let targetFieldId = fieldsMap[sourceFieldId];
            if (sourceFieldId in sourceFields && targetFieldId in targetFields) {
                targetFields[targetFieldId].DEFAULT_VALUE = sourceFields[sourceFieldId].DEFAULT_VALUE;
            } else {
                console.error("sourceFields 与 targetFields 字段id映射关系有误！");
            }
        }
    },
    /**
     * 复制字段值，并触发 check 函数
     * @param {object} targetFields 
     * @param {object} sourceFields 
     * @param {object} fieldsMap 
     * @param {object} _this 
     * @param {object} targetModule 
     */
    copyFieldsAndTrigerCheck: function(targetFields, sourceFields, fieldsMap, _this, targetModule) {
        for (let sourceFieldId in fieldsMap) {
            let targetFieldId = fieldsMap[sourceFieldId];
            if (sourceFieldId in sourceFields && targetFieldId in targetFields) {
                targetFields[targetFieldId].disableClear = true;
                targetFields[targetFieldId].DEFAULT_VALUE = sourceFields[sourceFieldId].DEFAULT_VALUE;
                let functions = targetFields[targetFieldId].FIELD_FUNCTION.split("|");
                _.each(functions, func => {
                    _this.busiLogic[func] && _this.busiLogic[func](_this, targetFields[targetFieldId], 
                        targetFields, targetModule);
                })
                targetFields[targetFieldId].disableClear = false;
            } else {
                console.error("sourceFields 与 targetFields 字段id映射关系有误！");
            }
        }
    },

    /**
     * 取消级联关系
     * @param {object} _this 
     * @param {object} sourceGroupInfo {GROUP_ID: "", MODULE_ID: "", MODULE_SEQ:""}
     * @param {string} groupId 要取消级联关系的模块的分组ID
     * @param {string} moduleId 要取消级联关系的模块的模块ID
     * @param {string} moduleSeq 要取消级联关系的模块的模块序号 （可不传，为空时取消该模块的级联关系）
     */
    cancelCascade: function(_this, sourceGroupInfo, groupId, moduleId, moduleSeq) {
        if (_.isEmpty(groupId) || _.isEmpty(moduleId)) {
            return;
        }
        let sourceId = sourceGroupInfo.GROUP_ID + "-" + sourceGroupInfo.MODULE_ID + "-" + sourceGroupInfo.MODULE_SEQ;
        let targetId = groupId + "-" + moduleId + (moduleSeq == undefined ? "" : "-" + moduleSeq);
        if (!_.isEmpty(_this.oppBusiData.cascadeData) && !_.isEmpty(_this.oppBusiData.cascadeData[sourceId])) {
            for (let cascadeId in _this.oppBusiData.cascadeData[sourceId]) {
                if (cascadeId.indexOf(targetId) != -1) {
                    delete _this.oppBusiData.cascadeData[sourceId][cascadeId];
                }
            }
        }
    },
    /**
     * 清空关联模块中的值，并且设置为可编辑
     * @param {object} _this 
     * @param {object} sourceGroupInfo {GROUP_ID: "", MODULE_ID: "", MODULE_SEQ:""}
     * @param {string} groupId 目标模块的分组ID
     * @param {string} moduleId 目标模块的模块ID
     */
    clearCascadeModuleAndSetEditable: function(_this, sourceGroupInfo, groupId, moduleId) {
        if (_.isEmpty(groupId) || _.isEmpty(moduleId)) {
            return;
        }
        let sourceId = sourceGroupInfo.GROUP_ID + "-" + sourceGroupInfo.MODULE_ID + "-" + sourceGroupInfo.MODULE_SEQ;
        if (!_.isEmpty(_this.oppBusiData.cascadeData) && !_.isEmpty(_this.oppBusiData.cascadeData[sourceId])) {
            for (let cascadeId in _this.oppBusiData.cascadeData[sourceId]) {
                if (cascadeId.indexOf(groupId + "-" + moduleId) != -1) {
                    let cascadeInfo = _this.oppBusiData.cascadeData[sourceId][cascadeId];
                    this.clearModuleAndSetEditable(_this, cascadeInfo);
                }
            }
        }
    },
    /**
     * 清空关联模块中的值，并且设置为可编辑
     * @param {object} _this 
     * @param {object} cascadeInfo 级联信息
     */
    clearModuleAndSetEditable: function(_this, cascadeInfo) {
        let groupId = cascadeInfo.GROUP_ID;
        let moduleId = cascadeInfo.MODULE_ID;
        let moduleSeq = cascadeInfo.MODULE_SEQ;
        let moduleNum = this.getModuleNum(_this, groupId, moduleId, moduleSeq);
        let fieldsMap = cascadeInfo.fieldsMap;
        for (let sourceFieldId in fieldsMap) {
            let cascadeFieldId = fieldsMap[sourceFieldId];
            if (cascadeFieldId in _this.groupDatas[groupId][moduleId][moduleNum].FIELDS) {
                _this.groupDatas[groupId][moduleId][moduleNum].FIELDS[cascadeFieldId].DEFAULT_VALUE = "";
                _this.groupDatas[groupId][moduleId][moduleNum].FIELDS[cascadeFieldId].FIELD_CONTROL = "0";
            }
        }
    },
    /**
     * 判断两个字段模块中各字段的值是否各自相等
     * @param {object} fields1 
     * @param {object} fields2 
     * @param {object} fieldsMap fields1 与 fields2 字段id映射关系
     * @returns {boolean} true: 相等，false：不相等
     */
    assertFieldsValuesIsSame: function(fields1, fields2, fieldsMap) {
        for (let fieldId in fieldsMap) {
            let value1 = fields1[fieldId].DEFAULT_VALUE;
            let value2 = fields2[fieldsMap[fieldId]].DEFAULT_VALUE;
            if (value1 != value2) {
                return false;
            }
        }
        return true;
    },
    /**
     * 设置字段为不可编辑
     * @param {object} allFields 
     * @param {array} excludeFields
     */
    setFieldsUneditable: function (allFields, excludeFields) {
        for (let fieldId in allFields) {
            if (_.indexOf(excludeFields, fieldId) == -1) {
                allFields[fieldId].FIELD_CONTROL = "2";
            }
        }
    },
    /**
     * 设置字段为可编辑
     * @param {object} allFields 
     * @param {array} excludeFields
     */
    setFieldsEditable: function (allFields, excludeFields) {
        for (let fieldId in allFields) {
            if (_.indexOf(excludeFields, fieldId) == -1) {
                allFields[fieldId].FIELD_CONTROL = "0";
            }
        }
    },
    /**
     * 获取模块字段的原始数据
     * @param {object} fields 模块字段
     * @param {object} originalData 原始数据
     * @returns 
     */
    getOriginalFieldValues: function(fields, originalData) {
        let info = {};
        for (let field in fields) {
            let fieldId = fields[field].FIELD_ID;
            if (!_.isEmpty(fieldId)) {
                info[fieldId] = originalData[fieldId];
            }
        }
        return info;
    },
    /**
     * 判断数组类型的模块，数据是否已经改变
     * @param {array} currentInfo  当前数据
     * @param {array} originalInfo  原始数据
     */
    isArrayModuleChanged: function (currentInfo, originalInfo) {
        if (_.isEmpty(currentInfo) && _.isEmpty(originalInfo)) {
            return false;
        }
        if (currentInfo.length != originalInfo.length) {
            return true;
        } else {
            for (let i = 0; i < currentInfo.length; i++) {
                // 查看原始数据中是否有各字段的值都相同的模块，无则已修改
                let obj = _.find(originalInfo, origianlItem => {
                    for (let key in currentInfo[i]) {
                        if (currentInfo[i][key] != origianlItem[key]) {
                            return false;
                        }
                    }
                    return true; 
                })
                if (_.isEmpty(obj)) {
                    return true;
                }
            }
        }
        return false;
    },
    /**
     * 获取字段选中字典的字典项名称（DICT_ITEM_NAME）
     * @param {object} field 字段对象 
     * @returns 
     */
    getFieldDictItemName: function (field) {
        let dict = field.FIELD_DICT_NAME;
        for (let i = 0; i < dict.length; i++) {
            if (field.DEFAULT_VALUE == dict[i].DICT_ITEM) {
                return dict[i].DICT_ITEM_NAME;
            }
        }
        return "";
    },
    /**
     * 日期是否已过期
     * @param {object} _this
     * @param {string} dateStr 日期字符串 
     * @returns 
     */
    isExpired: function(_this, dateStr) {
        if (_.isEmpty(dateStr) || typeof dateStr != "string") {
            return false;
        }
        let nowDateStr = _.get(_this, "oppBusiData.SYS_DATE", "");
        if (_.isEmpty(nowDateStr)) {
            // 如果服务器时间没有设置就用浏览器时间
            let nowDate = new Date();
            let year = nowDate.getFullYear();
            let month = nowDate.getMonth() + 1;
            let day = nowDate.getDate();
            nowDateStr = "" + year + (month < 10 ? "0" + month : month) + (day < 10 ? "0" + day : day);
        }
        return parseInt(dateStr) < parseInt(nowDateStr);
    },
    /**
     * 获取字段 check 校验结果
     * @param {object} _this 
     * @param {object} modules 
     * @param {object} fieldIds 需要校验的字段
     * @returns 
     */
    getValidatePromises: function(_this, modules, fieldIds) {
        let promiseArr = [];
        _.each(modules, module => {
            if (module.MODULE_CONTROL == "0") {
                // 模块隐藏时不校验
                return;
            }
            let fields = module.FIELDS;
            _.each(fieldIds, fieldId => {
                let field = fields[fieldId];
                if (field.FIELD_CONTROL == "1") {
                    // 模块隐藏时不校验
                    return;
                }
                let fieldFunction = field.FIELD_FUNCTION;
                _this.busiLogic[fieldFunction] && promiseArr.push(_this.busiLogic[fieldFunction](_this, field, 
                    fields, module)); 
            })
         })
         return promiseArr;
    },
    /**
     * 将字符串，用特定字符隔开
     * @param {string} s 
     * @returns 
     */
    separate: function(s, symbol) {
        if (typeof s != "string") {
            return s;
        } else {
            let arr = [];
            for (let i in s) {
                arr.push(s.charAt(i));
            }
            return arr.join(symbol);
        }
    },
    /**
     * 数组中是否包含某对象
     * @param {object} array 
     * @param {object} obj 
     * @returns {boolean}
     */
    includes: function(array, obj) {
        if (_.isEmpty(array)) {
            return false;
        } else {
            for (let i = 0; i < array.length; i++) {
                let temp = array[i];
                if (_.isEqual(temp, obj)) {
                    return true;
                }
            }
            return false;
        }
    },
    /**
     * 根据字典项获取字典项名称
     * @param {object} dictData 字典数据
     * @param {string} key 字典项
     * @returns 
     */
    getDictValueByKey(dictData, key) {
        let value = _.find(dictData, obj => {
            return obj.DICT_ITEM == key;
        })
        return _.isEmpty(value) ? "" : value.DICT_ITEM_NAME;
    },
    //等待返回
    async awaitFnCallBack(fn, time) {
        let firstTime = new Date().getTime();
        let timeNum = Number(time) || 0;
        return fn().then( data => {
            let secondTime = new Date().getTime();
            let tiemDiff = secondTime - firstTime || 0;
            if (tiemDiff > timeNum) {
                return data;
            }
            return new Promise( (resolve, reject) => {
                setTimeout( () => {
                    resolve(data);
                }, timeNum - tiemDiff)
            })
        })
    },
    //获取营业部机构数据
    getOrgCodeArr() {
        let orgList = store.state.storageOrgCodeArr || [];
        if (_.isEmpty(orgList)) {
            return sysConfig.$syscfg.K_Request("Y1000200", {ORG_TYPE: "0"}).then(data => {
                return data.Data || [];
            }).catch( err => {
                console.err(err);
                return [];
            });
        }
        return orgList;
    },
    //return 0= 不需要公安联网校验  1=公安联网校验通过  2=传入参数有问题 3=请求超时 4=校验失败 5=检测不到的异常 后期要写上5对应的出错日志
    validateThree(_this, paramsArr) {
        let IS_NEED_POLICE = this.getJsonSessionBusiCommParam(_this, "IS_NEED_POLICE") == "0";
        if(IS_NEED_POLICE) {
            return new Promise((resolve) => { resolve("0")});
        }
        if (!paramsArr.CUST_FNAME) {
            _this.messageAlert("身份信息校验，客户全称不能为空！");
            return new Promise((resolve) => { resolve("2") });
        }
        if (!utils.isCommonChar(paramsArr.CUST_FNAME)) {
            _this.messageAlert("姓名包含生僻字，不支持公安联网校验！");
            return new Promise((resolve) => { resolve("2") });
        }
        if (!paramsArr.ID_TYPE) {
            _this.messageAlert("身份信息校验，证件类型不能为空！");
            return new Promise((resolve) => { resolve("2") });
        }
        if (["00", "08", "0S"].indexOf(paramsArr.ID_TYPE) == -1) {
            _this.messageAlert("证件类型不是身份证、临时身份证或港澳台居民居住证，不支持中登身份校验");
            return new Promise((resolve) => { resolve("2") });
        }
        if (!paramsArr.ID_CODE) {
            _this.messageAlert("身份信息校验，证件号码不能为空！");
            return new Promise((resolve) => { resolve("2") });
        }
        let params = {
            CUST_FNAME: paramsArr.CUST_FNAME,
            USER_NAME: paramsArr.CUST_FNAME,
            ID_TYPE: paramsArr.ID_TYPE,
            ID_CODE: paramsArr.ID_CODE,
            USER_TYPE: paramsArr.USER_TYPE,
            SEX: paramsArr.SEX,
            BIRTHDAY: paramsArr.BIRTHDAY
        }
        if(stringConfig.isEmptyStr(params.USER_TYPE)){
            params.USER_TYPE = _this.userType;
        }
        return csdcService.validate(params).then( res => {
            let tempResult = {};
            Object.assign(tempResult, res);
            if("1" === tempResult.flag || "true" === tempResult.flag || true === tempResult.flag) {
                return "1";
            }
            return custService.runPoliceValidate(params).then( policeRes => {
                if (policeRes.flag === true) {
                    return "1";
                }else if(policeRes.flag === false){
                    _this.messageAlert("公安联网校验失败，请您前往柜台办理。");
                    return "4";
                }else{
                    _this.messageAlert("公安联网校验失败，请您前往柜台办理。");
                    return "5";
                }
            }).catch(error => {
                _this.messageAlert("公安联网校验失败，请您前往柜台办理。");
                return "3";
            })
        })
    },
    findErrorElement() {
        //如果找到对应错误节点就展示
        let firstErrorFormItemArr = [];
        _.each(document.querySelectorAll('.validatebox-message'), item => {
          if (item.style && item.style.display !== 'none') {
            if (item.parentElement && item.parentElement.parentElement && item.parentElement.parentElement.parentElement) {
              firstErrorFormItemArr.push(item);
            }
          }
        })
        return firstErrorFormItemArr;
    },
    //聚焦错误表单项
    focusOnErrFormItem (busiCode) {
        //如果找到对应错误节点就展示
        let firstErrorFormItemArr = this.findErrorElement();
        let firstErrorFormItem = firstErrorFormItemArr[0] && firstErrorFormItemArr[0].parentElement && firstErrorFormItemArr[0].parentElement.parentElement && firstErrorFormItemArr[0].parentElement.parentElement.parentElement;
        if (firstErrorFormItem) {
            let errorElName = "errorName" + new Date().getTime();
            firstErrorFormItem.setAttribute("name", errorElName);
            this.messageAlert("字段填写有误，请确认！");
        }
    },
    focusOnErrFormItemBizPage(busiCode, validateMsg) {
        let firstErrorFormItem;
        if (validateMsg) {
            let errmsgItem = document.querySelector(".el-form-item:not([style='display: none;']) .validatebox-message:not([style='display: none;'])");
            if (errmsgItem) {
                firstErrorFormItem = this.findParentFormItem(errmsgItem);
            } else {
                errmsgItem = document.querySelector(".validatebox-message:not([style='display: none;'])");
                firstErrorFormItem = this.findParentHasField(errmsgItem);
            }
            
        } else {
            firstErrorFormItem = document.querySelector(".el-form-item.is-error");
        }
        if (firstErrorFormItem) {
            let errorElName = "errorName" + new Date().getTime();
            firstErrorFormItem.setAttribute("name", errorElName);
            this.messageAlert("字段填写有误，请确认！");
        }
    },
    findParentFormItem(el) {
        while(el.parentElement) {
            let res;
            _.each(el.parentElement.classList, item => {
                if (item === 'el-form-item') {
                    res = el.parentElement;
                    return false;
                }
            })
            if (!_.isEmpty(res)) {
                return res;
            }
            el = el.parentElement
        }
        return res;
    },
    // .parentElement.parentElement.parentElement.attributes.field
    findParentHasField(el) {
        while(el.parentElement) {
            let field = el.parentElement.attributes.field;
            if (field !== undefined) {
                return el.parentElement;
            }
            el = el.parentElement
        }
        return res;
    },
    //是否为非大陆手机号
    isNotOutbackPhone: (val, isNeedValid=true) => {
        if (isNeedValid) {
            return  /^([5|6|9])\d{7}$/.exec(val) || /^[0][9]\d{8}$/.exec(val);//香港澳门台湾手机号
        }
         return false;
    }
}
const plugin = {
    install(Vue) {
        //添加全局方法或属性
        Vue.lbm = bizPublicMethod
        //添加实例方法
        Vue.prototype.$blMethod = bizPublicMethod
    },
    $blMethod: bizPublicMethod
}

export default plugin
export const install = plugin.install
