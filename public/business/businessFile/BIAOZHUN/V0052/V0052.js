//客户信息节点
import bizCustBasicInfoNode from "../commonModules/commonBizNode/cust/custInfo/bizCustBasicInfoNode";
//联系信息节点
import bizCustLinkInfoNode from "../commonModules/commonBizNode/cust/linkInfo/bizCustLinkInfoNode";
//实际控制人
import bizActualControllerNode from "../commonModules/commonBizNode/cust/custInfo/bizActualControllerNode"
//其他联系人信息
import bizCustOtherLinkNode from "../commonModules/commonBizNode/cust/custInfo/bizCustOtherLinkNode"
//受益人信息
import bizCustBeneficiaryInfoNode from "../commonModules/commonBizNode/cust/custInfo/bizActualBeneficiaryNode"
//诚信记录信息
import bizProCreditRecordInfoNode from "../commonModules/commonBizNode/pro/proInfo/bizProCreditRecordInfoNode"
//涉税节点
import bizCustTaxInfoNode from "../commonModules/commonBizNode/cust/custInfo/bizCustTaxInfoNode"
// 三方存管节点
import openBizBankAcctNode from "../commonModules/openBizNode/openBizBankAcctNode"
//密码设置
import openBizPwdNode from "../commonModules/openBizNode/openBizPwdNode"


//短信模块
import oppService from '../../../../service/opp-service'
//解析地址
import { getSex } from '../../../../tools/util'
import custSerivce from '../../../../service/cust-service'
import csdsSerivce from '../../../../service/csdc-service'
import sysConfig from '../../../../config/sysConfig'
import bizPublicMethod from "../../../businessTools/bizPublicMethod.js"
import date from "../../../../tools/date.js";
import * as openBizPubTools from "../commonModules/openBizNode/openBizPublicTools"
import * as utils from "../../../../tools/util.js"
import dict from "../../../../tools/dict"
import bizPublicSaveMethod from '../../../businessTools/bizPublicSaveMethod'
import stringConfig from '../../../../tools/stringConfig';



// 新开户生成新客户代码
const getNewCustCode = (_this) => {
    let OPEN_ORG_INFO = _this.$storage.getJsonSession(_this.$definecfg.OPEN_ORG_INFO) || {}
    return openBizPubTools.getNewCustCode(_this, OPEN_ORG_INFO.ORG_CODE || "")
}

const getValidIdTypeData = (_this) => {
    return Promise.all([
        openBizPubTools.getValidIdTypeData(_this)
    ]).then(res => {
        var validIdTypeObj = {
            "0": [],
            "1": [],
            "2": []
        };
        res[0] && res[0].Data.forEach((v) => {
            validIdTypeObj[v.USER_TYPE].push(v.ID_TYPE)
        })
        //个人证件类型数组
        _this["oppBusiData"]["VALID_ID_TYPE_FOR_PERSON"] = validIdTypeObj["0"]
        //机构证件类型编码数组
        _this["oppBusiData"]["VALID_ID_TYPE_FOR_ORG"] = validIdTypeObj["1"]
        //产品证件类型编码数组  10
        if (validIdTypeObj["2"] && validIdTypeObj["2"].length) {
            _this["oppBusiData"]["VALID_ID_TYPE_FOR_PRO"] = validIdTypeObj["2"]
        } else {
            _this["oppBusiData"]["VALID_ID_TYPE_FOR_PRO"] = validIdTypeObj["1"]
        }
        //机构+个人 证件类型合并数组
        _this["oppBusiData"]["VALID_ID_TYPE_FOR_BOTH"] = validIdTypeObj["0"].concat(validIdTypeObj["1"])

    })
}
const getDictArrData = (_this) => {
    return dict.getDictData(["CITIZENSHIP_ST", "SUBJECT_IDENTITY", "INOUTSIDE_IDENTITY", "CUACCT_ATTR"]).then(res => {
        _this.oppBusiData.dictAll = res;
    })
}
const getDictBankData = (_this) => {
    let OPEN_ORG_INFO = _this.$storage.getJsonSession(_this.$definecfg.OPEN_ORG_INFO) || {}
    return dict.getDictData(["CUACCT_CLS", "CUACCT_GRP", "CUACCT_LVL"], OPEN_ORG_INFO.ORG_CODE).then(function (res) {
        _this.oppBusiData.dictBank = res;
    })
}

//获取开户模版
const getCustModelSet = (_this) => {
    let OPEN_ORG_INFO = _this.$storage.getJsonSession(_this.$definecfg.OPEN_ORG_INFO) || {};
    return custSerivce.getCustModelSet(_this, OPEN_ORG_INFO.ORG_CODE).then( res => {
       let OPEN_TEMPLATE_ARR = _.filter(_.get(res, "Data", []), v => {
           return v.USER_TYPE == _this.userType && v.CUACCT_ATTR == "0";
       });
       if (!OPEN_TEMPLATE_ARR.length) {
           _this.messageBox({
               messageText: "开户模板未配置, 请联系现场工作人员！",
               confirmButtonText: '确定',
               typeMessage: 'warn', 
               showMsgBox: true,
               confirmedAction: function () {
                _this.$router.push({
                    path: _this.$bizhomecfg.getHomeConfig()
                 });
               },
           })
           return
       }
       _this.oppBusiData.OPEN_TEMPLATE_DATA = OPEN_TEMPLATE_ARR && OPEN_TEMPLATE_ARR[0];
    })
}
const isNormalTemplate = function(_this) {
    let that = _this;
    let openTemplateData = that.oppBusiData.OPEN_TEMPLATE_DATA;

    let dictBank = that.oppBusiData.dictBank;
    let dictAll = that.oppBusiData.dictAll;
    let clsObj = _.find(dictBank.CUACCT_CLS, item => {
        return item.DICT_ITEM == openTemplateData.CUACCT_CLS;
    }) || {};
    let grpObj = _.find(dictBank.CUACCT_GRP, item => {
        return item.DICT_ITEM == openTemplateData.CUACCT_GRP
    }) || {};
    let lvlObj = _.find(dictBank.CUACCT_LVL, item => {
        return item.DICT_ITEM == openTemplateData.CUACCT_LVL
    }) || {};
    let attrObj = _.find(dictAll.CUACCT_ATTR, item => {
        return item.DICT_ITEM == openTemplateData.CUACCT_ATTR
    }) || {};
    // 存在字典项没有翻译过来 则抛出异常
    if (_.isEmpty(clsObj.DICT_ITEM_NAME) 
        || _.isEmpty(grpObj.DICT_ITEM_NAME) 
        || _.isEmpty(lvlObj.DICT_ITEM_NAME)
        || _.isEmpty(attrObj.DICT_ITEM_NAME)
        || _.isEmpty(_.trim(openTemplateData.CUST_TYPE))
        || _.isEmpty(_.trim(openTemplateData.CHANNELS))
        || _.isEmpty(_.trim(openTemplateData.CRITERION))
        || _.isEmpty(_.trim(openTemplateData.CUST_GRP))) {
        that.messageBox({
            typeMessage: 'warn',
            messageText: '系统所配置的开户模板异常，请联系现场工作人员。',
            confirmButtonText: '确定',
            confirmedAction: function () {
                that.$router.push({
                    path: that.$bizhomecfg.getHomeConfig()
                });
            },
        })
        return false;
    }
    return true;
}
const V0052 = _.merge(
    _.cloneDeep(bizCustBasicInfoNode),
    _.cloneDeep(bizCustLinkInfoNode),
    _.cloneDeep(bizActualControllerNode),
    _.cloneDeep(bizCustOtherLinkNode),
    _.cloneDeep(bizCustBeneficiaryInfoNode),
    _.cloneDeep(bizProCreditRecordInfoNode),
    _.cloneDeep(bizCustTaxInfoNode),
    _.cloneDeep(openBizPwdNode),
    _.cloneDeep(openBizBankAcctNode),
    {
        'beforeLoadBiz': (_this) => {
            let custLinkInfoFields = _this.groupDatas.LINK_INFO.CUST_LINK_INFO[0].FIELDS;
            custLinkInfoFields.ADDRESS.VALID_TYPE = "length[16,64]";
            
            let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
            _this.oppBusiData.getNewCustCode = getNewCustCode;

            if(_.isEmpty(_this.oppBusiData.customerInfo)) {
                _this.oppBusiData.customerInfo = customerInfo;
            }
            _this.oppBusiData.CUST_CODE = customerInfo.CUST_CODE
            return Promise.all([
                getCustModelSet(_this),                 
                getDictArrData(_this),                 
                getDictBankData(_this),
                getValidIdTypeData(_this)
            ]).then(([res]) => {
                                    // 判断开户模板是否正常
                if (!isNormalTemplate(_this)) {
                    throw "开户模板设置异常"
                }
                return Promise.all([
                    bizCustBasicInfoNode.bizCustBasicInfoNodeBeforeLoadBizOpenAcct && bizCustBasicInfoNode.bizCustBasicInfoNodeBeforeLoadBizOpenAcct(_this),
                    bizCustLinkInfoNode.bizCustLinkInfoNodeBeforeLoadBizOpenAcct && bizCustLinkInfoNode.bizCustLinkInfoNodeBeforeLoadBizOpenAcct(_this),
                    bizActualControllerNode.bizActualControllerNodeBeforeLoadBizOpenAcct && bizActualControllerNode.bizActualControllerNodeBeforeLoadBizOpenAcct(_this,),
                    bizCustOtherLinkNode.bizCustOtherLinkNodeBeforeLoadBizOpenAcct && bizCustOtherLinkNode.bizCustOtherLinkNodeBeforeLoadBizOpenAcct(_this),
                    bizCustBeneficiaryInfoNode.bizCustBeneficiaryInfoNodeBeforeLoadBizOpenAcct && bizCustBeneficiaryInfoNode.bizCustBeneficiaryInfoNodeBeforeLoadBizOpenAcct(_this),
                    bizProCreditRecordInfoNode.bizProCreditRecordInfoBeforeLoadBiz && bizProCreditRecordInfoNode.bizProCreditRecordInfoBeforeLoadBiz(_this),
                    bizCustTaxInfoNode.bizCustTaxInfoNodeBeforeLoadBizOpenAcct && bizCustTaxInfoNode.bizCustTaxInfoNodeBeforeLoadBizOpenAcct(_this),
                    openBizPwdNode.openBizPwdNodeBeforeLoadBiz && openBizPwdNode.openBizPwdNodeBeforeLoadBiz(_this),
                    openBizBankAcctNode.openBizBankAcctNodeBeforeLoadBiz && openBizBankAcctNode.openBizBankAcctNodeBeforeLoadBiz(_this),
                ])
            })
            
        },
        "afterLoadBiz": (_this) => {
            return Promise.all([
                bizCustBasicInfoNode.bizCustBasicInfoNodeAfterLoadBiz && bizCustBasicInfoNode.bizCustBasicInfoNodeAfterLoadBiz(_this),
                bizCustLinkInfoNode.bizCustLinkInfoNodeAfterLoadBiz && bizCustLinkInfoNode.bizCustLinkInfoNodeAfterLoadBiz(_this),
                bizActualControllerNode.bizActualControllerNodeAfterLoadBiz && bizActualControllerNode.bizActualControllerNodeAfterLoadBiz(_this),
                bizCustOtherLinkNode.bizCustOtherLinkNodeAfterLoadBiz && bizCustOtherLinkNode.bizCustOtherLinkNodeAfterLoadBiz(_this),
                bizCustBeneficiaryInfoNode.bizCustBeneficiaryInfoNodeAfterLoadBiz && bizCustBeneficiaryInfoNode.bizCustBeneficiaryInfoNodeAfterLoadBiz(_this),
                bizProCreditRecordInfoNode.bizProCreditRecordInfoAfterLoadBiz && bizProCreditRecordInfoNode.bizProCreditRecordInfoAfterLoadBiz(_this),
                bizCustTaxInfoNode.bizCustTaxInfoNodeAfterLoadBiz && bizCustTaxInfoNode.bizCustTaxInfoNodeAfterLoadBiz(_this),
                openBizPwdNode.openBizPwdNodeAfterLoadBiz && openBizPwdNode.openBizPwdNodeAfterLoadBiz(_this)
            ]).then(res => {
                //保存就数据 到oppBusiData 用于对比
                _this.oppBusiData.oldGroupDatas = _.cloneDeep(_this.oldGroupDatas);
                let travel = _this.historyData.TRAVEL;
                let bizRouteTable = _.cloneDeep(_this.bizRouteTable)
                _.each(travel, travelItem => {
                    let name = travelItem.MODULE_NAME;
                    bizRouteTable = _.each(bizRouteTable, bizRouteTableItem => {
                        //不需要跳转的模块
                        let notJumpArr = ["风险测评", "开立证券账户", "查看所有", "开立基金账户", "存管银行签约", "设置账户密码", "一账通信息"];
                        if (bizRouteTableItem.name == name && notJumpArr.indexOf(name) == -1) {
                            bizRouteTableItem.stepState = "isSonFinish";
                        }
                    })
                })
                _this.$store.commit(_this.$types.UPDATE_BIZ_ROUTE_TABLE, bizRouteTable);
                _this.$store.commit(_this.$types.UPDATE_ROUTE_TABLE_FLAG, true);
                return;
            })
        },
        "addModule": (_this, moduleld, fieldData) => {
            if (moduleld == "CUST_OTHER_LINK_INFO") {
                let maxLength = _this.oppBusiData.MAX_OTHER_LINKER;
                if (_this.groupDatas.LINK_INFO.CUST_OTHER_LINK_INFO.length >= maxLength) {
                    _this.$blMethod.showMsgBox(_this, "个人其他联系人数量最大值为" + maxLength + ",不能再添加!");
                    return false;
                } else {
                    // 其他联系人 姓名 或者 电话 其他一项必填, 则这两个字段都必填
                    if (fieldData.LINKMAN_NAME.DEFAULT_VALUE != '') {
                        if (fieldData.LINKMAN_MOBILE_TEL.DEFAULT_VALUE != '') {
                            return true;
                        } else {
                            _this.$blMethod.showMsgBox(_this, "填写了姓名字段,必须填写手机号码字段!");
                            return false;
                        }
                    }
                    if (fieldData.LINKMAN_MOBILE_TEL.DEFAULT_VALUE != '') {
                        if (fieldData.LINKMAN_NAME.DEFAULT_VALUE != '') {
                            return true;
                        } else {
                            _this.$blMethod.showMsgBox(_this, "填写了手机号码字段,必须填写姓名字段!");
                            return false;
                        }
                    }
                    return true;
                }
            }else {
                return true;
            }
        },
        "addModuleFinished": (_this, fieldData) => {
            if (_this.moduleId.indexOf("CUST_TAX_INFO_MODULE4") != -1) {
                bizCustTaxInfoNode.custTaxInfoAddModuleFinished && bizCustTaxInfoNode.custTaxInfoAddModuleFinished(_this, fieldData);
            }
            if (_this.moduleId.indexOf("CUST_BENEFICIARY_INFO") != -1) { 
                bizCustBeneficiaryInfoNode.bizCustBeneficiaryInfoNodeAddModuleFinished && bizCustBeneficiaryInfoNode.bizCustBeneficiaryInfoNodeAddModuleFinished(_this, fieldData);
            }
            if (_this.moduleId.indexOf("CREDIT_RECORD_INFO") != -1) {
                bizProCreditRecordInfoNode.bizProCreditRecordInfoNodeAddModuleFinished && bizProCreditRecordInfoNode.bizProCreditRecordInfoNodeAddModuleFinished(_this, fieldData);
            }
        },
        "deleteModuleFinished": (_this, deleteObj, moduleData) => {
            if (_this.moduleId.indexOf("CUST_CONTROLER_INFO") > -1) {
                bizActualControllerNode.CONTROLERINFO_DELETE_MODULE_FINISHED && bizActualControllerNode.CONTROLERINFO_DELETE_MODULE_FINISHED(_this, deleteObj);
            }
            if (_this.moduleId.indexOf("CUST_OTHER_LINK_INFO") > -1) {
                bizCustOtherLinkNode.OTHERLINKINFO_DELETE_MODULE_FINISHED && bizCustOtherLinkNode.OTHERLINKINFO_DELETE_MODULE_FINISHED(_this, deleteObj);
            }
            if (_this.moduleId.indexOf("CUST_BENEFICIARY_INFO") > -1) {
                bizCustBeneficiaryInfoNode.BENEFICIARYINFO_DELETE_MODULE_FINISHED && bizCustBeneficiaryInfoNode.BENEFICIARYINFO_DELETE_MODULE_FINISHED(_this, deleteObj);
            }
            if (_this.moduleId.indexOf("CREDIT_RECORD_INFO") > -1) {
                bizProCreditRecordInfoNode.CREDITRECORDINFO__DELETE_MODULE_FINISHED && bizProCreditRecordInfoNode.CREDITRECORDINFO__DELETE_MODULE_FINISHED(_this, deleteObj);
            }
        },
        "deleteModule": (_this, moduleld, fieldData) => {
            return true
        },
        "pageActivated": (_this) => {
            _this.$refs.flowTip.flowTips = [];
            //开户机构
            if (_this.moduleId.indexOf("CUST_CARD_INFO") != -1 || _this.moduleId.indexOf("CUST_FZCARD_INFO") != -1 || _this.moduleId.indexOf("CUST_EXPERIENCE_INFO") != -1) {
                bizCustBasicInfoNode.bizCustBasicInfoNodePageActivated && bizCustBasicInfoNode.bizCustBasicInfoNodePageActivated(_this)
            }
            //联系信息
            if (_this.moduleId.indexOf("CUST_LINK_INFO") != -1) {
                bizCustLinkInfoNode.bizCustLinkInfoNodePageActivated && bizCustLinkInfoNode.bizCustLinkInfoNodePageActivated(_this);
            }
            //实际控制人
            if (_this.moduleId.indexOf("CUST_CONTROLER_INFO") != -1) {
                bizActualControllerNode.bizActualControllerNodePageActivated && bizActualControllerNode.bizActualControllerNodePageActivated(_this);
            }
            //其他联系人信息
            if (_this.moduleId.indexOf("CUST_OTHER_LINK_INFO") != -1) {
                bizCustOtherLinkNode.bizCustOtherLinkNodePageActivated && bizCustOtherLinkNode.bizCustOtherLinkNodePageActivated(_this)
            }
            //受益人信息
            if (_this.moduleId.indexOf("CUST_BENEFICIARY_INFO") != -1) {
                bizCustBeneficiaryInfoNode.bizCustBeneficiaryInfoNodePageActivated && bizCustBeneficiaryInfoNode.bizCustBeneficiaryInfoNodePageActivated(_this)
            }
            //不良诚信记录
            if (_this.moduleId.indexOf("CREDIT_RECORD_INFO") != -1) {
                bizProCreditRecordInfoNode.bizProCreditRecordInfoPageActived && bizProCreditRecordInfoNode.bizProCreditRecordInfoPageActived(_this)
            }
            //涉税信息
            if (_this.moduleId.indexOf("ORG_TAX_INFO") != -1 ||
                _this.moduleId.indexOf("ORG_TAX_BASIC_INFO") != -1 ||
                _this.moduleId.indexOf("CUST_TAX_INFO_MODULE2") != -1 ||
                _this.moduleId.indexOf("CUST_TAX_INFO_MODULE3") != -1 ||
                _this.moduleId.indexOf("CUST_TAX_INFO_MODULE4") != -1 ||
                _this.moduleId.indexOf("TAX_ASSET_INFO") != -1 ||
                _this.moduleId.indexOf("TAX_PAYMENT_INFO") != -1 ||
                _this.moduleId.indexOf("CUST_TAX_INFO_MODULE6") != -1) {
                bizCustTaxInfoNode.bizCustTaxInfoNodePageActivated && bizCustTaxInfoNode.bizCustTaxInfoNodePageActivated(_this)
            }
            //密码设置
            if(_this.moduleId.indexOf("CUST_PWD_INFO") != -1){
                openBizPwdNode.openBizPwdNodePageActivated && openBizPwdNode.openBizPwdNodePageActivated (_this);
            }
        },
        'beforeSave': async(_this, params) => {
            let OPEN_ORG_INFO = _this.$storage.getJsonSession(_this.$definecfg.OPEN_ORG_INFO) || {};
            if (!_this.moduleId) {
                return;
            }
            if (_this.moduleId.indexOf("CUST_CARD_INFO") != -1 || _this.moduleId.indexOf("CUST_FZCARD_INFO") != -1 || _this.moduleId.indexOf("CUST_EXPERIENCE_INFO") != -1) {
                bizCustBasicInfoNode.bizCustBasicInfoNodeBeforeSave && bizCustBasicInfoNode.bizCustBasicInfoNodeBeforeSave(_this, params);
                let custCardInfo = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "CUST_CARD_INFO");
                let isInBlackListParmas = {
                    USER_NAME: custCardInfo.CUST_FNAME,
                    ID_TYPE: custCardInfo.ID_TYPE,
                    ID_CODE: custCardInfo.ID_CODE,
                    F_CUST_ORG_CODE: OPEN_ORG_INFO.ORG_CODE || ""
                }
                let isInBlackListFn = await custSerivce.isInBlackList(isInBlackListParmas);
                let idTypeDict = await dict.getDictData("ID_TYPE");
                let blackInfo = [];
                if (!_.isEmpty(isInBlackListFn) && (isInBlackListFn.CHECK_RESULT == "1" || isInBlackListFn.CHECK_RESULT == "2")) {
                    _this.oppBusiData.flowTurnflag = "1";
                    let info = Object.assign(isInBlackListFn, {
                        blackType: "客户基本信息",
                        USER_FNAME: isInBlackListFn.USER_FNAME || isInBlackListFn.USER_NAME,
                        ID_TYPE_TEXT: bizPublicMethod.$blMethod.getDictValueByKey(idTypeDict.ID_TYPE, isInBlackListFn.ID_TYPE),
                    })
                    blackInfo.push(info);
                } else {
                    _this.oppBusiData.flowTurnflag = "0";
                }
                // 黑名单信息
                params.BLACK_INFO = blackInfo;
                let procPrams = {
                    FLOW_TURN_FLAG: _this.oppBusiData.flowTurnflag,
                    FLOW_TURN_FLAG2: _this.oppBusiData.flowTurnflag
                }
                Object.assign(params, procPrams);
            }
            if (_this.moduleId.indexOf("CUST_LINK_INFO") != -1) {
                bizCustLinkInfoNode.bizCustLinkInfoNodeBeforeSave && bizCustLinkInfoNode.bizCustLinkInfoNodeBeforeSave(_this, params);
            }
            //实际控制人
            if (_this.moduleId.indexOf("CUST_CONTROLER_INFO") != -1) {
                bizActualControllerNode.bizActualControllerNodeBeforeSave && bizActualControllerNode.bizActualControllerNodeBeforeSave(_this, params);
            }
            //其他联系人信息
            if (_this.moduleId.indexOf("CUST_OTHER_LINK_INFO") != -1) {
                bizCustOtherLinkNode.bizCustOtherLinkNodeBeforeSave && bizCustOtherLinkNode.bizCustOtherLinkNodeBeforeSave(_this, params)
            }
            //受益人信息
            if (_this.moduleId.indexOf("CUST_BENEFICIARY_INFO") != -1) {
                bizCustBeneficiaryInfoNode.bizCustBeneficiaryInfoNodeBeforeSave && bizCustBeneficiaryInfoNode.bizCustBeneficiaryInfoNodeBeforeSave(_this, params)
            }
            //不良诚信记录
            if (_this.moduleId.indexOf("CREDIT_RECORD_INFO") != -1) {
                bizProCreditRecordInfoNode.bizProCreditRecordInfoBeforeSave && bizProCreditRecordInfoNode.bizProCreditRecordInfoBeforeSave(_this, params)
            }
            //涉税信息
            if (_this.moduleId.indexOf("ORG_TAX_INFO") != -1 ||
                _this.moduleId.indexOf("ORG_TAX_BASIC_INFO") != -1 ||
                _this.moduleId.indexOf("CUST_TAX_INFO_MODULE2") != -1 ||
                _this.moduleId.indexOf("CUST_TAX_INFO_MODULE3") != -1 ||
                _this.moduleId.indexOf("CUST_TAX_INFO_MODULE4") != -1 ||
                _this.moduleId.indexOf("TAX_ASSET_INFO") != -1 ||
                _this.moduleId.indexOf("TAX_PAYMENT_INFO") != -1 ||
                _this.moduleId.indexOf("CUST_TAX_INFO_MODULE6") != -1) {
                bizCustTaxInfoNode.bizCustTaxInfoNodeBeforeSave && bizCustTaxInfoNode.bizCustTaxInfoNodeBeforeSave(_this, params)
            }
            let currentRoute = _this.$router.getCurrentRoute();
            if (currentRoute.path.indexOf("baseInfoNode") > -1) {
            
                // 流水里没有客户代码就生成客户代码
                let CUST_CODE = _this.historyData.CUST_CODE || '';
                if(_.isEmpty(CUST_CODE)) {
                    let res = await _this.oppBusiData.getNewCustCode(_this);
                    CUST_CODE = !_.isEmpty(res.Data) && res.Data[0].USER_CODE || CUST_CODE;
                }
                let custInfo = _.assign({}, params.CUST_INFO);
                //yangyp如果客户开户时，在A营业部做了一笔开户流水，
                //进入B营业部，自动取回填数据后，把开户营业部变更为当前机器所属营业部
                custInfo.CUST_BASIC_INFO.ORG_CODE = OPEN_ORG_INFO.ORG_CODE;
                custInfo.CUST_BASIC_INFO.ORG_NAME = OPEN_ORG_INFO.ORG_NAME;
                custInfo.CUST_BASIC_INFO.INT_ORG = OPEN_ORG_INFO.ORG_CODE;
                let custLocalInfo =  _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO)|| {};
                if(stringConfig.isNotEmptyStr(CUST_CODE)){
                    custLocalInfo.CUST_CODE =  CUST_CODE;
                }
                Object.assign(custLocalInfo, custInfo.CUST_BASIC_INFO);
                _this.$storage.setSession(_this.$definecfg.CUSTOMER_INFO,custLocalInfo);
                let relaInfo = _.assign({}, params.RELA_INFO) || {};
                relaInfo.ASSIGN_INFO =  {};
                relaInfo.CUST_OTHER_INFO = {
                    CUST_CLS: "0",
                    RISK_FACTOR: "1"
                }
                Object.assign(params, {
                    CUST_CODE: CUST_CODE,
                    USER_CODE: CUST_CODE,
                    CUST_INFO: custInfo,
                    RELA_INFO: relaInfo,
                    INT_ORG: OPEN_ORG_INFO.ORG_CODE,
                    ORG_CODE : OPEN_ORG_INFO.ORG_CODE,
                    ORG_NAME : OPEN_ORG_INFO.ORG_NAME,
                    CUST_ORG_NAME: OPEN_ORG_INFO.ORG_NAME,
                    NEW_IS_AGENT: "0", //是否开通代理人 用于影像采集
                    NEW_AGT_ID_TYPE: "",
                    AGENT_CSDC_VALID_FLAG: "",
                });
            }
            //是否显示涉税信息
            let isShowTaxInfoFlag = true;
            let CUST_EXPERIENCE_INFO = _this.groupDatas.CUST_INFO.CUST_EXPERIENCE_INFO[0].FIELDS || {};
            let vocation = bizPublicMethod.$blMethod.getFieldValueName(CUST_EXPERIENCE_INFO.OCCU_TYPE.FIELD_DICT_NAME,CUST_EXPERIENCE_INFO.OCCU_TYPE.DEFAULT_VALUE);
            if (vocation == "军人") {
                isShowTaxInfoFlag = false;
            }
            if (!isShowTaxInfoFlag) {
                params.TAX_RESIDENT_TYPE = "";
                params.RELA_INFO && (params.RELA_INFO.CUST_TAX_INFO = []);
                params.RELA_INFO && (params.RELA_INFO.TAX_FLAG = "");
            }
             //密码设置
             if(_this.moduleId.indexOf("CUST_PWD_INFO") != -1){
                openBizPwdNode.openBizPwdNodeBeforeSave && openBizPwdNode.openBizPwdNodeBeforeSave (_this,params);
            }
            _this.oppBusiData.copyCurrentGroupData = _.cloneDeep(_this.groupDatas);        
        },
        //保存完成之后的回调
        "afterSave": (_this, res) => {
            if (!_this.moduleId) {
                return;
            }
            let newData = _.get(res, "Data[0]", {});
            let fromName = _this.$router.getCurrentRoute().fromName;
            //基本信息
            if (_this.moduleId.indexOf("CUST_CARD_INFO") != -1 || _this.moduleId.indexOf("CUST_FZCARD_INFO") != -1 || _this.moduleId.indexOf("CUST_EXPERIENCE_INFO") != -1) {
                bizCustBasicInfoNode.bizCustBasicInfoNodeAfterSave && bizCustBasicInfoNode.bizCustBasicInfoNodeAfterSave(_this, newData);
            }
            //联系信息
            if (_this.moduleId.indexOf("CUST_LINK_INFO") != -1) {
                bizCustLinkInfoNode.bizCustLinkInfoNodeAfterSave && bizCustLinkInfoNode.bizCustLinkInfoNodeAfterSave(_this, newData);
            }
            //实际控制人
            if (_this.moduleId.indexOf("CUST_CONTROLER_INFO") != -1) {
                bizActualControllerNode.bizActualControllerNodeAfterSave && bizActualControllerNode.bizActualControllerNodeAfterSave(_this, newData);
            }
            //受益人信息
            if (_this.moduleId.indexOf("CUST_BENEFICIARY_INFO") != -1) {
                bizCustBeneficiaryInfoNode.bizCustBeneficiaryInfoNodeAfterSave && bizCustBeneficiaryInfoNode.bizCustBeneficiaryInfoNodeAfterSave(_this, newData)
            }
            //不良诚信记录
            if (_this.moduleId.indexOf("CREDIT_RECORD_INFO") != -1) {
                bizProCreditRecordInfoNode.bizProCreditRecordInfoAfterSave && bizProCreditRecordInfoNode.bizProCreditRecordInfoAfterSave(_this, newData)
            }

            //涉税信息
            if (_this.moduleId.indexOf("ORG_TAX_INFO") != -1 ||
                _this.moduleId.indexOf("ORG_TAX_BASIC_INFO") != -1 ||
                _this.moduleId.indexOf("CUST_TAX_INFO_MODULE2") != -1 ||
                _this.moduleId.indexOf("CUST_TAX_INFO_MODULE3") != -1 ||
                _this.moduleId.indexOf("CUST_TAX_INFO_MODULE4") != -1 ||
                _this.moduleId.indexOf("TAX_ASSET_INFO") != -1 ||
                _this.moduleId.indexOf("TAX_PAYMENT_INFO") != -1 ||
                _this.moduleId.indexOf("CUST_TAX_INFO_MODULE6") != -1) {
                bizCustTaxInfoNode.bizCustTaxInfoNodeAfterSave && bizCustTaxInfoNode.bizCustTaxInfoNodeAfterSave(_this, newData);
            }
        },

        validate: function (_this) {
            let validateFnArr = [];
            if (_this.moduleId.indexOf("CUST_CARD_INFO") != -1 || _this.moduleId.indexOf("CUST_FZCARD_INFO") != -1 || _this.moduleId.indexOf("CUST_EXPERIENCE_INFO") != -1) {
                //客户三要素 客户信息 页面保存函数
                bizCustBasicInfoNode.bizCustBasicInfoNodeValidateBizOpenAcct && validateFnArr.push( bizCustBasicInfoNode.bizCustBasicInfoNodeValidateBizOpenAcct(_this) );
            }
            if (_this.moduleId.indexOf("CUST_LINK_INFO") != -1) {
                bizCustLinkInfoNode.bizCustLinkInfoNodeValidate && validateFnArr.push(bizCustLinkInfoNode.bizCustLinkInfoNodeValidate(_this))
            }
            if (_this.moduleId.indexOf("CUST_OTHER_LINK_INFO") != -1) {
                bizCustOtherLinkNode.bizCustOtherLinkNodeValidate && validateFnArr.push(bizCustOtherLinkNode.bizCustOtherLinkNodeValidate(_this))
            }
            if (_this.moduleId.indexOf("CUST_CONTROLER_INFO") != -1) {
                bizActualControllerNode.bizActualControllerNodeValidate && validateFnArr.push(bizActualControllerNode.bizActualControllerNodeValidate(_this))
            }
            if (_this.moduleId.indexOf("CREDIT_RECORD_INFO") != -1) {
                bizProCreditRecordInfoNode.bizProCreditRecordInfoValidate && validateFnArr.push(bizProCreditRecordInfoNode.bizProCreditRecordInfoValidate(_this))
            }
            if(_this.moduleId.indexOf("ORG_TAX_INFO") != -1 ||
                    _this.moduleId.indexOf("ORG_TAX_BASIC_INFO") != -1 ||
                    _this.moduleId.indexOf("CUST_TAX_INFO_MODULE2") != -1||
                    _this.moduleId.indexOf("CUST_TAX_INFO_MODULE3") != -1 ||
                    _this.moduleId.indexOf("CUST_TAX_INFO_MODULE4") != -1) {
                bizCustTaxInfoNode.bizCustTaxInfoNodeValidate && validateFnArr.push(bizCustTaxInfoNode.bizCustTaxInfoNodeValidate(_this));
            }
               //密码设置
            if(_this.moduleId.indexOf("CUST_PWD_INFO") != -1){
                return openBizPwdNode.openBizPwdNodeValidateV0052 && openBizPwdNode.openBizPwdNodeValidateV0052 (_this);
            }

            if(_this.moduleId.indexOf("CUST_BENEFICIARY_INFO") != -1){
                bizCustBeneficiaryInfoNode.bizCustBeneficiaryInfoNodeValidate&& validateFnArr.push(bizCustBeneficiaryInfoNode.bizCustBeneficiaryInfoNodeValidate(_this));
            }
            return Promise.all(validateFnArr).then( res => {
                if (_.includes(res, false)) {
                    return false;
                }
                if (this.ishavTipError(_this)) {
                    return false;
                }
            })
        },

        preValidate: function (_this) {
            return true;

        },
        //返回导航栏校验
        goBackListValidate: function(_this) {
            //返回导航栏的时候 还原数据 不做保存
            let groupId = _this.groupId;
            // let moduleId = _this.moduleId;
            _.each(_this.groupDatas[groupId], (item, key) => {
                _this.groupDatas[groupId][key] = _.cloneDeep(_this.oppBusiData.copyCurrentGroupData[groupId][key]);
            })
            _this.moduleDatas = {};
            _this.changedField = [];
        },

        /********************************************审核*********************************************************/
        //读卡按钮触发事件
        "readModule": (_this, moduleId, fieldData) => {
            console.log('读卡')
            _this.showOcrCard = true;
            _this.ocrCardType = "0";
            _this.showOcrModuleId = moduleId;

        },

        //读卡数据返回
        "readModuleCardInfoAction": (_this, moduleId, fieldData, ocrCardInfo) => {
            if (!_.isEmpty(ocrCardInfo)) {
                //实际控制人
                if (moduleId.indexOf("CUST_CONTROLER_INFO") != -1) {
                    fieldData.CONTROLER_ID_TYPE.DEFAULT_VALUE = "00";
                    fieldData.CONTROLER_NAME.DEFAULT_VALUE = ocrCardInfo.CUST_NAME;
                    setTimeout(function () {
                        fieldData.CONTROLER_ID_NO.DEFAULT_VALUE = ocrCardInfo.ID_CODE;
                        let f = fieldData.CONTROLER_SEX;
                        let value = fieldData.CONTROLER_ID_NO.DEFAULT_VALUE;
                        let sex = getSex(value);
                        if (sex == "M") {
                            f.DEFAULT_VALUE = "0"; // 0-男性
                            // f.FIELD_CONTROL = "2";
                        } else if (sex == "F") {
                            f.DEFAULT_VALUE = "1"; // 1-女性
                            // f.FIELD_CONTROL = "2";
                        } else {
                            // f.FIELD_CONTROL = "0";
                            f.DEFAULT_VALUE = "";
                        }
                    }, 300)
                    fieldData.REG_DATE.DEFAULT_VALUE = ocrCardInfo.BIRTHDAY;
                    fieldData.CONTROLER_ID_EXP_DATE.DEFAULT_VALUE = ocrCardInfo.END_DATE;
                    fieldData.REG_ADDR.DEFAULT_VALUE = ocrCardInfo.ID_ADDR;
                }
                //其他联系人
                if (moduleId.indexOf("CUST_OTHER_LINK_INFO") != -1) {
                    fieldData.LINKMAN_ID_TYPE.DEFAULT_VALUE = "00";
                    fieldData.LINKMAN_NAME.DEFAULT_VALUE = ocrCardInfo.CUST_NAME;
                    setTimeout(function () {
                        fieldData.LINKMAN_ID.DEFAULT_VALUE = ocrCardInfo.ID_CODE;
                    }, 300)
                    fieldData.LINKMAN_EXP_DATE.DEFAULT_VALUE = ocrCardInfo.END_DATE;
                    let f = fieldData.LINKMAN_SEX;
                    let value = ocrCardInfo.ID_CODE;
                    let sex = getSex(value);
                    if (sex == "M") {
                        f.DEFAULT_VALUE = "0"; // 0-男性
                        // f.FIELD_CONTROL = "2";
                    } else if (sex == "F") {
                        f.DEFAULT_VALUE = "1"; // 1-女性
                        // f.FIELD_CONTROL = "2";
                    } else {
                        // f.FIELD_CONTROL = "0";
                        f.DEFAULT_VALUE = "";
                    }
                }
                //实际受益人
                else if (moduleId.indexOf("CUST_BENEFICIARY_INFO") != -1) {
                    fieldData.BENEFICIARY_ID_TYPE.DEFAULT_VALUE = "00";
                    fieldData.BENEFICIARY_NAME.DEFAULT_VALUE = ocrCardInfo.CUST_NAME;
                    setTimeout(function () {
                        fieldData.BENEFICIARY_ID.DEFAULT_VALUE = ocrCardInfo.ID_CODE;
                        let f = fieldData.SEX;
                        let value = fieldData.BENEFICIARY_ID.DEFAULT_VALUE;
                        let sex = getSex(value);
                        if (sex == "M") {
                            f.DEFAULT_VALUE = "0"; // 0-男性
                            // f.FIELD_CONTROL = "2";
                        } else if (sex == "F") {
                            f.DEFAULT_VALUE = "1"; // 1-女性
                            // f.FIELD_CONTROL = "2";
                        } else {
                            // f.FIELD_CONTROL = "0";
                            f.DEFAULT_VALUE = "";
                        }
                    }, 300)
                    fieldData.BENEFICIARY_EXP_DATE.DEFAULT_VALUE = ocrCardInfo.END_DATE;
                    fieldData.BIRTHDAY.DEFAULT_VALUE = ocrCardInfo.BIRTHDAY;
                    fieldData.BENEFICIARY_ADDR.DEFAULT_VALUE = ocrCardInfo.ID_ADDR;
                   
                }
                //监护人
                if (moduleId.indexOf("CUST_GUARDIAN_INFO") != -1) {
                    fieldData.GUARDIAN_ID_TYPE.DEFAULT_VALUE = "00";
                    fieldData.GUARDIAN_NAME.DEFAULT_VALUE = ocrCardInfo.CUST_NAME;
                    setTimeout(function () {
                        fieldData.GUARDIAN_ID.DEFAULT_VALUE = ocrCardInfo.ID_CODE;
                    }, 300)
                    fieldData.GUARDIAN_EXP_DATE.DEFAULT_VALUE = ocrCardInfo.END_DATE;

                }
            }
        },
        //自定义按钮 公安联网/中登手机号码核查
        "customizeModule": (_this, moduleId, fieldData) => {
            if (moduleId == "CUST_LINK_INFO") {
                bizCustLinkInfoNode.CHECK_LINKINFO_CUSTOMEIZE_MODULE && bizCustLinkInfoNode.CHECK_LINKINFO_CUSTOMEIZE_MODULE(_this, moduleId, fieldData)
                return;
            }
            let ID_TYPE = '',
                ID_CODE = '',
                USER_NAME = '',
                moduleIdCopy = moduleId;

            if (moduleIdCopy.indexOf("CUST_CARD_INFO") != -1) {
                ID_TYPE = fieldData.ID_TYPE.DEFAULT_VALUE;
                USER_NAME = fieldData.CUST_FNAME.DEFAULT_VALUE;
                ID_CODE = fieldData.ID_CODE.DEFAULT_VALUE;
            }
            if (moduleIdCopy.indexOf("CUST_GUARDIAN_INFO") != -1) {
                ID_TYPE = fieldData.GUARDIAN_ID_TYPE.DEFAULT_VALUE;
                USER_NAME = fieldData.GUARDIAN_NAME.DEFAULT_VALUE;
                ID_CODE = fieldData.GUARDIAN_ID.DEFAULT_VALUE;
            }
            if (moduleIdCopy.indexOf("CUST_BENEFICIARY_INFO") != -1){
                ID_TYPE = fieldData.BENEFICIARY_ID_TYPE.DEFAULT_VALUE;
                USER_NAME = fieldData.BENEFICIARY_NAME.DEFAULT_VALUE;
                ID_CODE = fieldData.BENEFICIARY_ID.DEFAULT_VALUE;
            }
            if (!ID_TYPE) {
                alert("公安联网校验，证件类型不能为空！");
                return;
            }else if (ID_TYPE != "00" && ID_TYPE != "08")  {
                bizPublicMethod.$blMethod.showMsgBox(_this, "证件类型不是身份证或临时身份证，不支持公安联网校验！");
                return;
            }
            if (!ID_CODE || !USER_NAME) {
                bizPublicMethod.$blMethod.showMsgBox(_this, "证件号码和姓名不能为空");
                return;
            }

            //校验姓名中是否有生僻字
            if (!_this.$blMethod.isCommonChar(USER_NAME)) {
                bizPublicMethod.$blMethod.showMsgBox(_this, "姓名包含生僻字，不支持公安联网校验!")
                return;
            }

            //获取机构代码
            let OPEN_ORG_INFO = _this.$storage.getJsonSession(_this.$definecfg.OPEN_ORG_INFO) || {}
            let params = {
                ID_CODE: ID_CODE,
                CUST_NAME: USER_NAME,
                CUST_FNAME: USER_NAME,
                ID_TYPE: ID_TYPE,
                CUST_ORG_CODE: OPEN_ORG_INFO.ORG_CODE,
                USER_NAME: USER_NAME
            }
            
            loading.open("正在进行公安联网校验！") ;
            custSerivce.runPoliceValidate(params).then(data => {
                _this.oppBusiData.isCscdAndPoliceChecked = true;
                if (data.flag === true) {
                    custSerivce.syncIdCardChkFlag(ID_TYPE, ID_CODE, USER_NAME);
                    if (data.result && data.result.length) {
                        _this.policeValidateInfo.result.splice(0, _this.policeValidateInfo.result.length);
                        _.each(data.result, v => _this.policeValidateInfo.result.push(v));
                        _this.$refs.policeValidateInfoBox.show();
                    }else{
                        confirm(data.msg);
                    }
                    // bizPublicMethod.$blMethod.showSuccessMsgBox(_this, "公安联网校验成功！");
                } else {
                    bizPublicMethod.$blMethod.showMsgBox(_this, data.Msg || "公安联网校验失败！");

                }
            }).catch(error => {

            }).finally(() => {
                loading.close();
            })
        },
        
        //中登身份校验
        "ZDCustomizeModule":(_this, csdcInfo,fieldData) => {
            let that = this;
            let messageBoxFn = (messageText) => {
                _this.messageBox({
                    hasMask: true,
                    messageText: messageText,
                    confirmButtonText: '确定',
                    typeMessage: 'warn', 
                    showMsgBox: true
                  })
            }
            if(csdcInfo == "CUST_CARD_INFO"){    
                // 港澳台居民居住证 只做中登人脸对比功能
                if (fieldData.ID_TYPE.DEFAULT_VALUE === "0s") {
                    _this.loading = true;
                    _this.loadingText = "正在进行中登人像对比，请稍候..."
                    return Promise.all([
                        csdsSerivce.getCsdcFaceValidate({
                            CUST_FNAME: fieldData.CUST_FNAME.DEFAULT_VALUE,
                            ID_CODE: fieldData.ID_CODE.DEFAULT_VALUE,
                            ID_TYPE: fieldData.ID_TYPE.DEFAULT_VALUE,
                        })
                    ]).then(res => {
                        _this.oppBusiData.PHOTO_CHECK_RESULT = res[0];
                        // 非中登服务时间
                        if (res[0].serviceTimeFlag === false) {
                            _this.oppBusiData.PHOTO_CHECK_RESULT = {};
                            messageBoxFn("非中登出入境证件信息核查服务时间，不支持人像比对信息核查！");
                        } else {
                            messageBoxFn(res[0].OUTPUT);
                        }
                    }).finally( () => {
                        _this.loading = false;
                    });
                }              
                if (!fieldData.CUST_FNAME.DEFAULT_VALUE) {
                    messageBoxFn("中登身份校验，客户全称不能为空！");
                    return;
                }
                if (!utils.isCommonChar(fieldData.CUST_FNAME.DEFAULT_VALUE)) {
                    messageBoxFn("姓名包含生僻字，不支持公安联网校验！");
                    return;
                }
                if (!fieldData.ID_TYPE.DEFAULT_VALUE) {
                    messageBoxFn("中登身份校验，证件类型不能为空！");
                    return;
                }
                if (fieldData.ID_TYPE.DEFAULT_VALUE != "00" && fieldData.ID_TYPE.DEFAULT_VALUE != "08" && fieldData.ID_TYPE.DEFAULT_VALUE != "0s") {
                    messageBoxFn("证件类型不是身份证、临时身份证或港澳台居民居住证，不支持中登身份校验");
                    return;
                }
                if (!fieldData.ID_CODE.DEFAULT_VALUE) {
                    messageBoxFn("中登身份校验，证件号码不能为空！");
                    return;
                }
                if (!fieldData.SEX.DEFAULT_VALUE) {
                    messageBoxFn("中登身份校验，性别不能为空！");
                    return;
                }
                if (!fieldData.BIRTHDAY.DEFAULT_VALUE) {
                    messageBoxFn("中登身份校验，出生日期不能为空！");
                    return;
                }
                fieldData.SEX.DEFAULT_VALUE = (fieldData.ID_CODE.DEFAULT_VALUE.substring(16, 17) % 2) ? "0" : "1";
                fieldData.BIRTHDAY.DEFAULT_VALUE = fieldData.ID_CODE.DEFAULT_VALUE.substr(6, 8);
                let param = {
                    BIRTHDAY: fieldData.BIRTHDAY.DEFAULT_VALUE,
                    CUST_FNAME: fieldData.CUST_FNAME.DEFAULT_VALUE,
                    ID_CODE: fieldData.ID_CODE.DEFAULT_VALUE,
                    ID_TYPE: fieldData.ID_TYPE.DEFAULT_VALUE,
                    SEX: fieldData.SEX.DEFAULT_VALUE,
                    USER_TYPE:_this.userType,
                }
                let errorFailFn = () => {
                    messageBoxFn("中登身份校验失败。");
                }
                _this.loading = true;
                return Promise.all([csdsSerivce.validate(param)]).then(result =>{
                    _this.oppBusiData.isCscdAndPoliceChecked = true;
                    if(result.length && !_.isEmpty(result[0])){
                        if (!result[0]) {
                            errorFailFn();
                            return
                        }
                        let tempResult = {};
                        Object.assign(tempResult,result[0]);
                        if("1" === tempResult.flag || "true" === tempResult.flag || true === tempResult.flag) {
                            custSerivce.syncIdCardChkFlag(param.ID_TYPE, param.ID_CODE, param.CUST_FNAME);
                        }     
                        //中登校验结果展示
                        _this.zdValidateInfo.result.splice(0, _this.zdValidateInfo.result.length);
                        
                        _.forEach(tempResult.LOCALCUSTINFO,function(value,key){
                            let zdItem = {};
                            if(key == "BIRTHDAY"){
                                zdItem[key] =  value;
                                zdItem.FIELD_TXT = "出生日期";
                                zdItem.input = param.BIRTHDAY;
                                if(tempResult.CSDCCUSTINFO &&tempResult.CSDCCUSTINFO.BIRTHDAY ){
                                    zdItem.output = tempResult.CSDCCUSTINFO.BIRTHDAY;
                                }
                            }
                            if(key == "CUST_FNAME"){
                                zdItem[key] =  value;
                                zdItem.FIELD_TXT = "姓名";
                                zdItem.input = param.CUST_FNAME;
                                if(tempResult.CSDCCUSTINFO &&tempResult.CSDCCUSTINFO.CUST_FNAME ){
                                    zdItem.output = tempResult.CSDCCUSTINFO.CUST_FNAME;
                                }
                            }
                            if(key == "ID_CODE"){
                                zdItem[key] =  value;
                                zdItem.FIELD_TXT = "证件号码";
                                zdItem.input = param.ID_CODE;
                                if(tempResult.CSDCCUSTINFO &&tempResult.CSDCCUSTINFO.ID_CODE ){
                                    zdItem.output = tempResult.CSDCCUSTINFO.ID_CODE;
                                }
                            }
                            if(key == "SEX"){
                                zdItem[key] =  value;
                                zdItem.FIELD_TXT = "性别";
                                if(tempResult.CSDCCUSTINFO &&tempResult.CSDCCUSTINFO.SEX ){
                                    zdItem.output = tempResult.CSDCCUSTINFO.SEX;
                                }
                                _.filter(fieldData.SEX.FIELD_DICT_NAME, (item) => {
                                    if(item.DICT_ITEM == value){
                                        zdItem.input = item.DICT_ITEM_NAME;
                                    }    
                                });
                            }
                            if(!_.isEmpty(zdItem)){
                                if(zdItem.input == zdItem.output){
                                    zdItem.flag = "一致";
                                }else{
                                    zdItem.flag = "不一致";
                                }
                                _this.zdValidateInfo.result.push(zdItem); 
                            } 
                        })
                        _this.zdValidateInfo.url = "data:image/jpg;base64," + tempResult.CSDCCUSTINFO.IMG_DATA || "";
                        _this.$refs.zdValidateInfoBox.show();
                    } else {
                        errorFailFn();
                    }
                }).finally( () => {
                    _this.loading = false;
                });
            }
            // 出入境信息核查
            if (csdcInfo == "CUST_EXPERIENCE_INFO") {
                let baseFieldData = _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].FIELDS;
                let custInfo = {
                    BIRTHDAY: baseFieldData.BIRTHDAY.DEFAULT_VALUE,
                    CUST_FNAME: baseFieldData.CUST_FNAME.DEFAULT_VALUE,
                    ID_CODE: baseFieldData.ID_CODE.DEFAULT_VALUE,
                    ID_TYPE: baseFieldData.ID_TYPE.DEFAULT_VALUE,
                    SEX: baseFieldData.SEX.DEFAULT_VALUE,
                    ID_EXP_DATE: baseFieldData.ID_EXP_DATE.DEFAULT_VALUE,
                    CITIZENSHIP: fieldData.CITIZENSHIP.DEFAULT_VALUE,
                    IS_SHOW_FOREIGN_CHECK_PHOTO: _this.oppBusiData.IS_SHOW_FOREIGN_CHECK_PHOTO
                }
                _this.$router.goModule("csdcValidateModule", {"moduleId": csdcInfo, "custInfo": custInfo});
            }
        },
        //国籍
        "CHECK_CITIZENSHIP": (_this, field, fieldData) => {
            if (field.MODULE_ID == "CUST_CARD_INFO") {
                _this.busiLogic.CHECK_BASICINFO_CITIZENSHIP(_this, field, fieldData);
            }else if(field.MODULE_ID == "CUST_TAX_INFO_MODULE4"){
                _this.busiLogic.CHECK_TAX_CITIZENSHIP(_this, field, fieldData);
            } else if (field.MODULE_ID == "CUST_EXPERIENCE_INFO") {
                _this.busiLogic.CHECK_EXPERIENCE_CITIZENSHIP(_this, field, fieldData);
            }
        },

        "CHECK_ID_CODE": (_this, field, fieldData) => {
            if (field.MODULE_ID == "CUST_CARD_INFO") {
                _this.busiLogic.CHECK_BASICINFO_ID_CODE(_this, field, fieldData);
            }

        },
        "CHECK_ID_TYPE": (_this, field, fieldData) => {
            if (field.MODULE_ID == "CUST_CARD_INFO") {
                _this.busiLogic.CHECK_BASICINFO_ID_TYPE(_this, field, fieldData);
            }

        },
        "CHECK_OCCU_TYPE": (_this, field, fieldData) => {
            //基本信息
            if (field.MODULE_ID == "CUST_EXPERIENCE_INFO") {
                _this.busiLogic.CHECK_BASICINFO_OCCU_TYPE && _this.busiLogic.CHECK_BASICINFO_OCCU_TYPE(_this, field, fieldData);
            }

            //实际控制人
            if (field.MODULE_ID == "CUST_CONTROLER_INFO") {
                _this.busiLogic.CHECK_CONTROLERINFO_OCCU_TYPE && _this.busiLogic.CHECK_CONTROLERINFO_OCCU_TYPE(_this, field, fieldData);
            }
        },
        //出生日期
        "CHECK_BIRTHDAY": (_this, field, fieldData) => {
            //基本信息
            if (field.MODULE_ID == "CUST_CARD_INFO") {
                _this.busiLogic.CHECK_BASICINFO_BIRTHDAY_OPEN && _this.busiLogic.CHECK_BASICINFO_BIRTHDAY_OPEN(_this, field, fieldData);
            }
            //其他联系人信息
            if (field.MODULE_ID == "CUST_OTHER_LINK_INFO") {
                _this.busiLogic.CHECK_OTHERLINKINFO_BIRTHDAY && _this.busiLogic.CHECK_OTHERLINKINFO_BIRTHDAY(_this, field, fieldData);
            }
        },
        CHECK_IS_SELF:(_this, field, fieldData,moduleItem) => {
            if (field.MODULE_ID == "CUST_CONTROLER_INFO") {
                _this.busiLogic.CHECK_CONTROLER_IS_SELF && _this.busiLogic.CHECK_CONTROLER_IS_SELF(_this, field, fieldData,moduleItem);
            }
            if (field.MODULE_ID == "CUST_BENEFICIARY_INFO") {
                _this.busiLogic.CHECK_BENEFICIARY_IS_SELF_OPEN_BIZ && _this.busiLogic.CHECK_BENEFICIARY_IS_SELF_OPEN_BIZ(_this, field, fieldData,moduleItem);
            }
        },
        //性别
        CHECK_SEX: (_this, field, fieldData) => {
            if (field.MODULE_ID == "CUST_CARD_INFO") {
                _this.busiLogic.CHECK_BASICINFO_SEX && _this.busiLogic.CHECK_BASICINFO_SEX(_this, field, fieldData);
            }
            if (field.MODULE_ID == "CUST_BENEFICIARY_INFO") {
                _this.busiLogic.CHECK_BENEFICIARYINFO_SEX && _this.busiLogic.CHECK_BENEFICIARYINFO_SEX(_this, field, fieldData);
            }
        },
        //国家地区
        CHECK_NATION: (_this, field, fieldData,moduleItem) => {
            if (field.MODULE_ID == "CUST_CONTROLER_INFO") {
                _this.busiLogic.CHECK_CONTROLERINFO_NATION && _this.busiLogic.CHECK_CONTROLERINFO_NATION(_this, field, fieldData,moduleItem);
            }
            if (field.MODULE_ID.indexOf("CUST_BENEFICIARY_INFO") != -1) {
                _this.busiLogic.CHECK_BENEFICIARYINFO_NATION && _this.busiLogic.CHECK_BENEFICIARYINFO_NATION(_this, field, fieldData,moduleItem);
            }
        },
        CHECK_BENEFICIARY_ADDR:(_this, field, fieldData,moduleItem) => {
            if (field.MODULE_ID.indexOf("CUST_BENEFICIARY_INFO") != -1) {
                _this.busiLogic.CHECK_CUST_BENEFICIARY_ADDR && _this.busiLogic.CHECK_CUST_BENEFICIARY_ADDR(_this, field, fieldData);
            }
        },
        CHECK_ADDRESS: (_this, field, fieldData) => {
            if (field.MODULE_ID.indexOf("CUST_LINK_INFO") != -1) {
                _this.busiLogic.CHECK_CUST_LINK_INFO_ADDRESS && _this.busiLogic.CHECK_CUST_LINK_INFO_ADDRESS(_this, field, fieldData);
            }
            if (field.MODULE_ID.indexOf("CUST_TAX_INFO_MODULE2") != -1) {
                _this.busiLogic.CHECK_CUST_TAX_INFO_MODULE2_ADDRESS && _this.busiLogic.CHECK_CUST_TAX_INFO_MODULE2_ADDRESS(_this, field, fieldData);
            }
        },
        //弹窗删除按钮事件
        "closeFlowtip": function (_this, flowTip) {
            let that = _this;
            let paramObj = {};
            paramObj.tableList = [];
            that.oppBusiData.csdcDiffArr.forEach(function (item) {
                paramObj.tableList.push(item);
            })
            
            that.importDataResult =  paramObj;
            that.$refs.zdSearchDialog.dialog("open")
        },
        submitZDDialogSurvey:function(_this,itemDatas,fieldData){
            _this.$refs.flowTip.flowTips = [];
            if(!_.isEmpty(itemDatas) && itemDatas.tableList && itemDatas.tableList.length){
                _.forEach( itemDatas.tableList,function(item){
                    console.log("ddd",item);
                    if(item.FIELD != "ID_TYPE"){
                        fieldData[item.FIELD].DEFAULT_VALUE = item.CARD;
                        if(item.FIELD == "CUST_FNAME"){
                            fieldData.CUST_NAME.DEFAULT_VALUE = bizPublicMethod.$blMethod.cutCustFullName(item.CARD);
                        }
                    }
                });
            }
        },
        cancelZDDialogSurvey:function(_this,itemDatas,fieldData){
            let isOpenAcct = _this.$storage.getJsonSession(_this.$definecfg.IS_OPEN_ACCT_BIZ);
            _this.$refs.flowTip.show();
            if (!(isOpenAcct == "0")) {
                _this.$syscfg.K_Request('W0000119', {
                    bex_codes: 'YGT_1000003',
                    TAB_CODE: "SYS_DD_RELATION",
                    DD_ID: "ID_TYPE",
                    F_FUNCTION: "100500030",
                    RLTO_DD_ID: "ID_TYPE"
                }).then((res) => {
                    let csdcData = _this.$storage.getJsonSession(_this.$definecfg.CSDC_CACHE_DATA) || {};
                    let sysCustInfo = {
                        ID_TYPE:  _.get(fieldData, 'ID_TYPE.DEFAULT_VALUE', ''),
                        ID_CODE: _.get(fieldData, 'ID_CODE.DEFAULT_VALUE', ''),
                        CUST_FNAME: _.get(fieldData, 'CUST_FNAME.DEFAULT_VALUE', '')
                    }
                    if (bizPublicMethod.$blMethod.checkYmtInfo(_this, csdcData, sysCustInfo, res.Data)) {
                        setTimeout(() => {
                            _this.$refs.flowTip.pushFlowTip({
                                title: '系统内三要素信息和中登返回的三要素信息不一致，点此查看详情',
                                type: 'warning',
                                key: 'name1',
                                button: true,
                                buttonText: "查看详情",
                                isShowCloseButton: true
                            })
                        },500)
                    } else {
                        _this.$refs.flowTip.flowTips = [];
                        fieldData.ID_CODE.promptValue = fieldData.ID_CODE.DEFAULT_VALUE;
                    }
                })
            }
        },
        //字段改变
        fieldDataChange: (_this, field, fieldData, moduleInfo) => {
            let that = this;
            if (_this.moduleId.indexOf("CUST_TAX_INFO_MODULE3") > -1 && field.FIELD_ID == "BIRTH_ADDRESS") {
                bizCustTaxInfoNode.CHECK_BIRTH_ADDRESS && bizCustTaxInfoNode.CHECK_BIRTH_ADDRESS(_this, field, fieldData);
            }
            if (_this.moduleId.indexOf("CUST_TAX_INFO_MODULE3") > -1 && field.FIELD_ID == "ADDRESS") {
                bizCustTaxInfoNode.CHECK_CUST_TAX_INFO_MODULE2_ADDRESS && bizCustTaxInfoNode.CHECK_CUST_TAX_INFO_MODULE2_ADDRESS(_this, field, fieldData);
            }
            if (_this.moduleId.indexOf("CUST_OTHER_LINK_INFO") > -1) {
                bizCustOtherLinkNode.bizCustOtherLinkNodeFieldDataChange && bizCustOtherLinkNode.bizCustOtherLinkNodeFieldDataChange(_this, field, fieldData, moduleInfo);
            }
            if (_this.moduleId.indexOf("CUST_PWD_INFO") > -1) {
                openBizPwdNode.openBizPwdNodeFieldDataChange && openBizPwdNode.openBizPwdNodeFieldDataChange(_this, field, fieldData, moduleInfo);
                return;
            }
            if ( moduleInfo.MODULE_CONTROL == "1" && !field.DEFAULT_VALUE && field.FIELD_REQUIRED == "1" && field.FIELD_CONTROL != "1") {
                _this.disableNext = true;
                return
            }
            //触发生日校验
            if (field.FIELD_ID == "BIRTHDAY" && _this.moduleId.indexOf("CUST_CARD_INFO") > -1) {
                bizCustBasicInfoNode.CHECK_BASICINFO_BIRTHDAY_OPEN && bizCustBasicInfoNode.CHECK_BASICINFO_BIRTHDAY_OPEN(_this, field, fieldData);
            }
            //查看按钮是否禁止
            if (that.default.isKeyTip && 
                (   that.default.isKeyTip(_this, "beneficiaryIsNotSelf") || 
                    that.default.isKeyTip(_this, "controlTip") || 
                    that.default.isKeyTip(_this, "checkBirthDayTip")
                )
            ) {
                _this.disableNext = true;
                return;
            }
            
            that.default.eachAllModule(_this);
        },
        //遍历所有模块是否有必填未填项
        eachAllModule: (_this) => {
            let flag = false;
            let moduleArr = _this.moduleId;
            _.each(_this.groupDatas[_this.groupId], modules => {
                if (flag) {
                    return false;
                }
                _.each(modules, moduleItem => {
                    if (flag) {
                        return false;
                    }
                    if (moduleArr.indexOf(moduleItem.MODULE_ID) > -1 && moduleItem.MODULE_CONTROL == "1") {
                        _.each(moduleItem.FIELDS, fieldItem => {
                            if (!fieldItem.DEFAULT_VALUE && fieldItem.FIELD_REQUIRED == "1" && fieldItem.FIELD_CONTROL != "1") {
                                flag = true;
                                return false;
                            }
                        })
                    }
                })
            })
            _this.disableNext = flag;
        },
        //是否存在禁止条件提示
        ishavTipError: (_this) => {
            let tipArr = _this.$refs.flowTip.flowTips;
            let findTip = _.find(tipArr, {type: "error"});
            return !_.isEmpty(findTip);
        },
        //是否存在某个提示
        isKeyTip: (_this, key) => {
            let tipArr = _this.$refs.flowTip.flowTips;
            let findTip = _.find(tipArr, {key: key});
            return !_.isEmpty(findTip);
        }
    })
export default V0052;