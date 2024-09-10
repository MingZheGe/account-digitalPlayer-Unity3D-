/*
 *   个人基本信息模块
 *   方法封装
 *   @author  yangyp
 */
import validateRules from "../../../../../../../components/preEntry/validateRules.js"
import bizPublicMethod from "../../../../../../../business/businessTools/bizPublicMethod.js"
import bizPublicSaveMethod from "../../../../../../businessTools/bizPublicSaveMethod.js"
import {parseAddress} from '../../../../../../../tools/util' //地址解析组件
import custInfoModel from "../../common/cust-info-model"
import stringConfig from "../../../../../../../tools/stringConfig.js"
const axiosCfg = {
    retry: 1,
}
//开户和非开户 字段数据加载 公共操作
const bizCustLinkInfoNodeBeforeLoadBizCommon = (_this) => {
    let fieldData = _this.groupDatas.LINK_INFO.CUST_LINK_INFO[0]["FIELDS"];
    // fieldData.OFFICE_ADDR.VALID_TYPE = "length[16,120]";
    //显示验证码
    fieldData.MOBILE_TEL.IS_SHOW_BUTTON = true;
    fieldData.MOBILE_TEL.FIELD_BUTTON_TXT = "获取验证码";
    fieldData.MOBILE_TEL.SUFFIX_ICON = "";
    // //验证码的检验函数修改防止冲突
    fieldData.VALIDATE_CODE.FIELD_FUNCTION = "CHECK_LINK_VALIDATE_CODE";
    fieldData.VALIDATE_CODE.VALID_TYPE = "num[6]";
    fieldData.VALIDATE_CODE.FIELD_CONTROL = "1";
    fieldData.ADDRESS.FIELD_FUNCTION = fieldData.ADDRESS.FIELD_FUNCTION + "|USE_ID_ADDRESS";
    _this.$set(fieldData.ADDRESS, 'FIELD_BUTTON_TXT', `从证件地址同步`);
    _this.groupDatas.LINK_INFO.CUST_LINK_INFO[0].FIELDS.MOBILE_TEL.MAX_LENGTH = "11";

    
    setFieldsAtt(_this, fieldData, "ZIP_CODE", "MAX_LENGTH", "6");
    setFieldsAtt(_this, fieldData, "MOBILE_CONFORM_SELECT", "textField", "DICT_ITEM_NAME");
    setFieldsAtt(_this, fieldData, "ADDRESS_CONFORM_SELECT", "textField", "DICT_ITEM_NAME");
    
    setFieldsAtt(_this, fieldData, "ADDRESS", "VALID_TYPE", "length[16,64]");
    setFieldsAtt(_this, fieldData, "ADDRESS", "changeMessage", "联系地址长度必须大于等于16个字符8个汉字，小于等于64个字符或32个汉字");
    //设置职务联动有误时，增加对应的提示 yangyp
    let mobileDict =  [
        {
          DICT_CODE: "MOBILE_CONFORM_SELECT",
          DICT_ITEM: "1",
          DICT_ITEM_NAME: "本人已确认，与家人共用同一联系方式",
          DICT_ORD: "0",
          ORG_CODE: "0000",
        },
      ]
    setFieldsAtt(_this, fieldData, "MOBILE_CONFORM_SELECT", "FIELD_DICT_NAME", mobileDict);
    setFieldsAtt(_this, fieldData, "MOBILE_CONFORM", "DEFAULT_VALUE", "您提供的手机号码已绑定在其他客户账户下，请核对手机号码是否为您本人使用，若有误，请进行修改。");
    //设置职务联动有误时，增加对应的提示 yangyp
    let addressDict =  [
        {
          DICT_CODE: "ADDRESS_CONFORM_SELECT",
          DICT_ITEM: "1",
          DICT_ITEM_NAME: "本人已确认，该联系地址为真实常住地址",
          DICT_ORD: "0",
          ORG_CODE: "0000",
        },
      ]
      setFieldsAtt(_this, fieldData, "ADDRESS_CONFORM_SELECT", "FIELD_DICT_NAME", addressDict);
      setFieldsAtt(_this, fieldData, "ADDRESS_CONFORM", "DEFAULT_VALUE", "您提供的联系地址与开户营业部不在同一省份，请核对联系地址是否为常住地址，若有误，请进行修改。");

      return Promise.all([
        getOrgProvince(_this)
      ])
}
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
//获取营业部省份
const getOrgProvince = (_this) => {
    return _this.$syscfg.K_Request("Y1000200", {
        ORG_TYPE: "0",
        ORG_CODE: getOrgCodeAndOrgName(_this).ORG_CODE,
    }, false, axiosCfg).then( res => {
        _this.oppBusiData.areaAddr = _.get(res, "Data[0].AREA_ADDR") || "";
    }).catch( err => {
        throw err;
    })
}
const getOldLinkInfo = (_this) => {
    let info = custInfoModel.getOriginaCustLinkInfo(_this.oppBusiData.oldBusiData);
    let amlRemark = info.AML_REMARK || "";
    if (amlRemark.indexOf("2") > -1) {
        info.MOBILE_CONFORM_SELECT = "1";
    }
    if (amlRemark.indexOf("0") > -1) {
        info.ADDRESS_CONFORM_SELECT = "1";
    }
    return info;
}
export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizCustLinkInfoNodeBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizCustLinkInfoNodeBeforeLoadBiz: async function (_this) {
        await bizCustLinkInfoNodeBeforeLoadBizCommon(_this)
        let linkInfo = getOldLinkInfo(_this);
        return Promise.all([
            getMobileOpenedNum(_this, linkInfo.MOBILE_TEL, true),
        ]).then( () => {
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["CUST_LINK_INFO"], linkInfo);
            
            let CUST_LINK_INFO = _this.groupDatas.LINK_INFO.CUST_LINK_INFO[0]["FIELDS"];
            let amlRemark = linkInfo.AML_REMARK || "";
            amlRemark.split(",")
            //反洗钱备注信息 2-客户已确认，客户与家人共用同一联系方式
            if (amlRemark.indexOf("2") > -1) {
                setFieldsAtt(_this, CUST_LINK_INFO, "MOBILE_CONFORM_SELECT", "FIELD_CONTROL", "0");
                setFieldsAtt(_this, CUST_LINK_INFO, "MOBILE_CONFORM", "FIELD_CONTROL", "0");
            }
            //反洗钱备注信息 0-客户已确认，联系地址为其真实常住地址
            if (amlRemark.indexOf("0") > -1) {
                setFieldsAtt(_this, CUST_LINK_INFO, "ADDRESS_CONFORM_SELECT", "FIELD_CONTROL", "0");
                setFieldsAtt(_this, CUST_LINK_INFO, "ADDRESS_CONFORM", "FIELD_CONTROL", "0");
            }
        }).catch( err => {
            throw err;
        })
        
    },
    bizCustLinkInfoNodeBeforeLoadBizOpenAcct: async function (_this) {
        await bizCustLinkInfoNodeBeforeLoadBizCommon(_this)
        //证件地址去除 非身份证和港澳台居住证的时候
        let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
        let CUST_LINK_INFO = _this.groupDatas.LINK_INFO.CUST_LINK_INFO[0]["FIELDS"];
        if (["00", "0s"].indexOf(customerInfo.ID_TYPE) == -1) {
            let functionStr = _.get(CUST_LINK_INFO, "ADDRESS.FIELD_FUNCTION", "");
            functionStr = functionStr.replace(/\|USE_ID_ADDRESS/g,"");
            setFieldsAtt(_this, CUST_LINK_INFO, "ADDRESS", "FIELD_FUNCTION", functionStr);
        }
    },
    /*
     *@method bizCustLinkInfoNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-13 09:42:56
     */
    bizCustLinkInfoNodeAfterLoadBiz: function (_this) {
        //重新解析历史数据
        let historyData = _.cloneDeep(_this.historyData);
        if (historyData && historyData.CUST_INFO) {
            
            let linkInfo = _.get(historyData, "CUST_INFO.CUST_LINK_INFO", {});
            if (!_.isEmpty(linkInfo)) {
                let newAddressVal = _.cloneDeep(linkInfo.ADDRESS);
                linkInfo.ADDRESS = historyData.newHistoryAddress || linkInfo.ADDRESS;
                bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["CUST_LINK_INFO"], linkInfo);
                _this.groupDatas.LINK_INFO.CUST_LINK_INFO[0]["FIELDS"].ADDRESS.newAddressVal = newAddressVal;
            }
        }
        //根据公参是否显示验证码
        let fieldData = _this.groupDatas.LINK_INFO.CUST_LINK_INFO[0]["FIELDS"];
        _this.oppBusiData.VALID_MOBILE = _this.oppBusiData.busiCommonParams.VALID_MOBILE || "1";
        if (_this.oppBusiData.VALID_MOBILE != "1") {
            fieldData.MOBILE_TEL.IS_SHOW_BUTTON = false;
            fieldData.VALIDATE_CODE.FIELD_CONTROL = "1";
            fieldData.MOBILE_TEL.SUFFIX_ICON = "";
        }
        let validateMobile = _this.$blMethod.getValidateMobile();
        let mobile = fieldData.MOBILE_TEL.DEFAULT_VALUE || "";
        let authCode = fieldData.VALIDATE_CODE.DEFAULT_VALUE || "";
        fieldData.MOBILE_TEL[validateMobile] = _.assign({}, {
            MOBILE: mobile,
            AUTH_CODE: authCode
        })
        _this.oppBusiData.MOBILE_NO_SELF = _.get(historyData, "CUST_INFO.CUST_LINK_INFO.MOBILE_NO_SELF", "0");
        //手机号码是否核查标志 0-未检测
        _this.oppBusiData.isMobileChecked = _.get(historyData, "CUST_INFO.CUST_LINK_INFO.isMobileChecked", "0");
        _this.busiLogic.checkMobileDetail(_this);
        _this.busiLogic.checkAddressDetail(_this);
    },
    /*
     *@method bizCustLinkInfoNodeBeforeSave
     *@desc 钩子函数 自定义保存数
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizCustLinkInfoNodeBeforeSave: function (_this, params) {
        let custLinkInfo = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "CUST_LINK_INFO");
        let custLinkInfoFields = _this.groupDatas.LINK_INFO.CUST_LINK_INFO[0].FIELDS;
        let custExperienceInfoFields = _this.groupDatas.CUST_INFO.CUST_EXPERIENCE_INFO[0].FIELDS;

        //增加一个地址字段用于保存address留有不详市辖区辖县 用于回填
        params.newHistoryAddress = _.cloneDeep(custLinkInfo.ADDRESS);
        custLinkInfo.ADDRESS = _.cloneDeep(custLinkInfoFields.ADDRESS.newAddressVal) || params.newHistoryAddress;

        custLinkInfo.MOBILE_NO_SELF = _this.oppBusiData.MOBILE_NO_SELF || "0";
        //反洗钱客户备注
        let amlRemark = [];
        if (custLinkInfoFields.ADDRESS_CONFORM_SELECT.DEFAULT_VALUE == "1") {
            amlRemark.push("0");
        }
        if (custExperienceInfoFields.VOCATION_CONFORM_SELECT.DEFAULT_VALUE == "1") {
            amlRemark.push("1");
        }
        if (custLinkInfoFields.MOBILE_CONFORM_SELECT.DEFAULT_VALUE == "1") {
            amlRemark.push("2");
        }
        custLinkInfo.AML_REMARK = amlRemark.join(",");
        params.AML_REMARK = amlRemark.join(",");
        let busiData = _this.historyData || {};
        let custInfo = busiData.CUST_INFO || {};
        custInfo.CUST_LINK_INFO = _.cloneDeep(custLinkInfo);
        
        // 如果邮箱改变了,实际控制人,受益人信息模块需要强制保存,否则实际控制人,受益人模块邮箱字段不会保存到流水
        if (_this.oppBusiData.needSyncFlag) {
            Object.assign(params, {TRAVEL: _this.oppBusiData.tempTravel})
        }
        custInfo.CUST_LINK_INFO.isMobileChecked = _this.oppBusiData.isMobileChecked
        
        if (_this.busiCode == "V0049" || _this.busiCode == "V0163") {
            let oldLinkInfo = getOldLinkInfo(_this);
            custLinkInfo = _.assign({}, oldLinkInfo, custLinkInfo);
            let data1 = bizPublicMethod.$blMethod.compareInfo2(oldLinkInfo, custLinkInfo, "VALIDATE_CODE,MOBILE_NO_SELF,MOBILE_CONFORM,MOBILE_CONFORM_SELECT,ADDRESS_CONFORM,ADDRESS_CONFORM_SELECT", "AML_REMARK");
            data1 = _this.$blMethod.addDiffAtt(custLinkInfoFields, data1);
            custInfo.CUST_LINK_CHANGE_INFO = Object.assign({}, custLinkInfo, {
                DIFF_INFO: data1
            });
            //是否修改了手机号码
            let oldMobile = _.get(oldLinkInfo, "MOBILE_TEL", "");
            let newMobile = custLinkInfo.MOBILE_TEL || "";
            
            if (oldLinkInfo.AML_REMARK != params.AML_REMARK) {
                data1.push({
                    FIELD: 'AML_REMARK',
                    NEW: params.AML_REMARK || "",
                    OLD: oldLinkInfo.AML_REMARK || ""
                })
            }
            //提交展示去除 1 职业反洗钱类型 客户需求 分开展示
            let diffAmlRemarkNew = _.cloneDeep(amlRemark);
            let diffAmlRemarkOld = _.cloneDeep(oldLinkInfo.AML_REMARK.split(",")) || [];
            _.pull(diffAmlRemarkNew, "1");
            _.pull(diffAmlRemarkOld, "1");
            if (diffAmlRemarkNew != diffAmlRemarkOld) {
                data1.push({
                    FIELD: 'LINK_AML_REMARK',
                    NEW: diffAmlRemarkNew.join(",") || "",
                    OLD: diffAmlRemarkOld.join(",") || ""
                })
            }
            
            //数据转化
            Object.assign(params, {
                CUST_LINK_INFO: custInfo.CUST_LINK_CHANGE_INFO,
                newMobile: newMobile == oldMobile ? "0" : newMobile //影像条件
            });
            if (newMobile != oldMobile) {
                //关联人信息保存
                _this.busiLogic.bizActualControllerNodeBeforeSave && _this.busiLogic.bizActualControllerNodeBeforeSave(_this, params);
                _this.busiLogic.bizCustBeneficiaryInfoNodeBeforeSave && _this.busiLogic.bizCustBeneficiaryInfoNodeBeforeSave(_this, params);
            }
        }
        params.LINK_INFO && (params.LINK_INFO.CUST_LINK_INFO = custInfo);
        params.CUST_INFO = params.CUST_INFO || {}
        Object.assign(params.CUST_INFO, custInfo);
        return params;

    },
    /*
     *@method bizCustLinkInfoNodeAfterSave
     *@desc 钩子函数 自定义保存数
     */
    bizCustLinkInfoNodeAfterSave: (_this, newData) => {
    },
    /*
     *@method bizCustLinkInfoNodeValidate
     *@desc 钩子函数 下一步验证
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizCustLinkInfoNodeValidate: async function (_this) {
        // _this.$refs.flowTip.flowTips = [];
        let mdd = _.get(_this.groupDatas, "LINK_INFO.CUST_LINK_INFO[0]", {});
        let mobileField = _.get(mdd, "FIELDS.MOBILE_TEL", {});
        if (_this.oppBusiData.VALID_MOBILE == "1") {
            
            let codeField = _.get(mdd, "FIELDS.VALIDATE_CODE", {});
            if (codeField.FIELD_CONTROL == "0") {
                let runValidateMobileData = await _this.$blMethod.runValidateMobile(_this, mobileField, codeField);
                if (!runValidateMobileData) {
                    return false;
                }
            }
        }
        let oldLinkInfo = getOldLinkInfo(_this);
        //是否修改了手机号码
        let oldMobile = _.get(oldLinkInfo, "MOBILE_TEL", "");
        if (mobileField.DEFAULT_VALUE != oldMobile) {
            let CUST_CONTROLER_INFO = _this.groupDatas.RELA_INFO.CUST_CONTROLER_INFO;
            let CUST_BENEFICIARY_INFO = _this.groupDatas.RELA_INFO.CUST_BENEFICIARY_INFO;
            _.each(CUST_CONTROLER_INFO, (item, key) => {
                if (item.FIELDS.IS_SELF.DEFAULT_VALUE == "1") {
                    _this.groupDatas.RELA_INFO.CUST_CONTROLER_INFO[key].FIELDS.CONTROLER_TEL.DEFAULT_VALUE = mobileField.DEFAULT_VALUE;
                }
            })
            _.each(CUST_BENEFICIARY_INFO, (item, key) => {
                if (item.FIELDS.IS_SELF.DEFAULT_VALUE == "1") {
                    _this.groupDatas.RELA_INFO.CUST_BENEFICIARY_INFO[key].FIELDS.BENEFICIARY_TEL.DEFAULT_VALUE = mobileField.DEFAULT_VALUE;
                }
            })
        }
        return Promise.all([
            _this.busiLogic.checkAddress(_this),
            checkEmail(_this)
        ]).then( res => {
            _this.removeFlowTip("checkAddress");
            if (res[0] == false) {
                _this.pushFlowTip({
                    title: "联系地址请精确到门牌号！",
                    key: "checkAddress",
                    type: 'error'
                })
            }
            if (_.includes(res, false)) {
                return false;
            }
        })
    },

    /*
     *@method bizCustLinkInfoNodePageActivated
     *@desc 钩子函数：页面激活
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizCustLinkInfoNodePageActivated: function (_this, groupId) {

        let fieldData = _this.groupDatas.LINK_INFO.CUST_LINK_INFO[0]["FIELDS"];
        if (_this.oppBusiData.VALID_MOBILE != "1") {
            fieldData.MOBILE_TEL.IS_SHOW_BUTTON = false;
            fieldData.VALIDATE_CODE.FIELD_CONTROL = "1";
            fieldData.MOBILE_TEL.SUFFIX_ICON = "";
        }        


        let CUST_LINK_INFO = _this.groupDatas.LINK_INFO.CUST_LINK_INFO[0]["FIELDS"];

        let checkShow = checkShowRegionSelector(_this);
        if (checkShow) {
            setFieldsAtt(_this, CUST_LINK_INFO, "ADDRESS", "showRegionSelector", true);
        }
        if (!checkShow) {
            setFieldsAtt(_this, CUST_LINK_INFO, "ADDRESS", "showRegionSelector", false);
        }
    },

    bizCustLinkInfoNodePreValidate: function (_this) {},
    //----------------------业务函数----------------------------------//
    CHECK_ZIP_CODE: (_this, field, fieldData) => {
    },
    CHECK_CUST_LINK_INFO_ADDRESS: (_this, field, fieldData) => {
        let isOpenAcct = _this.$storage.getSession(_this.$definecfg.IS_OPEN_ACCT_BIZ) || "";
        let checkShow = checkShowRegionSelector(_this);
        _this.busiLogic.checkAddressDetail(_this);
        if (!checkShow) {
            return;
        }
        let idAddress = fieldData.ADDRESS.DEFAULT_VALUE || "";
        let addressTextInfo = parseAddress(idAddress);
            let region = addressTextInfo[1] || [];
            region = region.join("");
            let regionChange = true;
            if (field.lastRegionValue == region) {
                regionChange = false;
            }
            field.lastRegionValue = region;
        if (!checkZipCode(_this) && isOpenAcct != "0") {
            if (fieldData.ZIP_CODE && regionChange) {
                _this.removeFlowTip("checkZipCodeTip");
                if (addressTextInfo && addressTextInfo.length > 3) {
                    _this.$nextTick( () => {
                        fieldData.ZIP_CODE.DEFAULT_VALUE = addressTextInfo[3];
                    })
                    _this.pushFlowTip( {
                        title: "已根据联系地址自动填写邮政编码，请点击本页面【保存修改】进行确认",
                        type: "warning",
                        key: "checkZipCodeTip"
                    })
                    
                }
            }
        }
        //校验地址是否符合要求
        _this.removeFlowTip("checkAddress");
        if(stringConfig.isEmptyStr(idAddress)){
            //地址为空就不进入，点击保存会报错。需要填写后才有值
            return;
        }
        if (fieldData.ZIP_CODE && regionChange) {
            if (addressTextInfo && addressTextInfo.length > 3 ) {
                fieldData.ZIP_CODE.DEFAULT_VALUE = addressTextInfo[3];
                fieldData.ZIP_CODE.correct = true;
            }
        }

        if (!_this.busiLogic.checkAddress(_this)) {
            _this.pushFlowTip({
                title: "联系地址请精确到门牌号！",
                key: "checkAddress",
                type: 'error'
            })
        }
        //校验一下是否按钮置灰
        let CUST_LINK_INFO = _this.groupDatas.LINK_INFO.CUST_LINK_INFO[0];
        _this.busiLogic.fieldDataChange(_this, field, fieldData, CUST_LINK_INFO); 
    },
    "USE_ID_ADDRESS__CLICK": (_this, field, fieldData) => {
        let idAddress = _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].FIELDS.ID_ADDR.DEFAULT_VALUE;
        let btnTxt = field.FIELD_BUTTON_TXT;
        if (btnTxt == "从证件地址同步") {
            _this.$set(field, 'FIELD_BUTTON_TXT', `撤销同步`);
            _this.oppBusiData.linkAddrDefault = field.DEFAULT_VALUE;
            field.DEFAULT_VALUE = idAddress;
            field.LAST_ADDRESS_REGION = field.DEFAULT_VALUE ;
            if (field.showRegionSelector) {
                if (idAddress != "") {
                    let addressTextInfo = parseAddress(idAddress);
                    field.addressInfo = addressTextInfo;
                    field.addressCode = addressTextInfo[3] || "";
                    // 证件地址 idAddress 可能不包含地级市，获取到包含地级市的 addressTextInfo 后，需要对  
                    // field.DEFAULT_VALUE 重新赋值
                    // 注：如果将来组件兼容了不包含地级市的地址，以下这个 if 中的代码可以去掉
                    if (addressTextInfo && addressTextInfo[1] && addressTextInfo[1].length === 3) {
                        let address = addressTextInfo[1][0] + addressTextInfo[1][1] + addressTextInfo[1][2] +
                        (addressTextInfo[2] ? addressTextInfo[2] : "");
                        field.DEFAULT_VALUE = address;
                    }
                    let region = addressTextInfo[1] || [];
                    region = region.join("");
                    field.LAST_ADDRESS_REGION = _.cloneDeep(region);
                }
                if (fieldData.ZIP_CODE && "addressInfo" in field) {
                    if (field.addressInfo && field.addressInfo.length > 3 && !_.isEmpty(field.addressInfo[3])) {
                        fieldData.ZIP_CODE.DEFAULT_VALUE = field.addressInfo[3];
                        fieldData.ZIP_CODE.correct = true;
                    }
                }
            }
        } else if (btnTxt == "撤销同步") {
            _this.$set(field, 'FIELD_BUTTON_TXT', `从证件地址同步`);
            field.DEFAULT_VALUE = _this.oppBusiData.linkAddrDefault;
            if (field.showRegionSelector) {
                let addressTextInfo = parseAddress(field.DEFAULT_VALUE );
                let region = addressTextInfo[1] || [];
                region = region.join("");
                field.LAST_ADDRESS_REGION = _.cloneDeep(region);
            }
            fieldData.ZIP_CODE.DEFAULT_VALUE = "";
        }
    },
    //邮箱
    CHECK_EMAIL: (_this, field, fieldData) => {
        if (checkEmail(_this)) {
            return
        }
    },
    /**
     * 手机号码
     */
    CHECK_MOBILE_TEL: async (_this, field, fieldData) => {
        if (_this.oppBusiData.VALID_MOBILE != "1") {
            return;
        }
        let defaultValue = field.DEFAULT_VALUE || "";
        let validateMobile = _this.$blMethod.getValidateMobile();
        let validateMobileData = field[validateMobile] || {};

        // 避免onblur的时候再触发loading
        if(_this.oppBusiData.oldMobile == defaultValue) {
            return;
        }
        //已经检验过的手机号码
        let checkMobile = validateMobileData.MOBILE || _.get(_this.historyData, "CUST_INFO.CUST_LINK_INFO.MOBILE_TEL", "");
        let linkInfo = custInfoModel.getOriginaCustLinkInfo(_this.oppBusiData.oldBusiData)
        let oldMobile = linkInfo.MOBILE_TEL || "";
        //已经校验过不显示获取验证码按钮
        if (defaultValue && (checkMobile == defaultValue || defaultValue == oldMobile)) {
            field.IS_SHOW_BUTTON = false;
            fieldData.VALIDATE_CODE.FIELD_CONTROL = "1";
            if (checkPhone(_this)) {
                fieldData.MOBILE_TEL.SUFFIX_ICON = "el-icon-success";
            }
            return;
        }
        let getMobileOpenedNumData = await getMobileOpenedNum(_this);

        field.IS_SHOW_BUTTON = true;
        field.showchange = true;
        field.changeFlag = '1';
        fieldData.VALIDATE_CODE.DEFAULT_VALUE = "";
        fieldData.VALIDATE_CODE.FIELD_CONTROL = "0";
        fieldData.MOBILE_TEL.SUFFIX_ICON = "";

        _this.oppBusiData.oldMobile = defaultValue;

        _this.removeFlowTip("checkMobile")
        if (!getMobileOpenedNumData) {
            _this.pushFlowTip({
                title: "您输入的手机号已登记在多个账户下，存在安全风险，请重新输入。",
                key: "checkMobile",
                type: 'error'
            })    
            field.DEFAULT_VALUE = "";
            _this.oppBusiData.oldMobile = "";      
        }
    },
    /**
     * 获取验证码按钮点击事件
     */
    CHECK_MOBILE_TEL__CLICK : _.debounce( async function (_this, field, fieldData) {
        if (field.disableNext) {
            return;
        }
        let mobileField = _this.groupDatas.LINK_INFO.CUST_LINK_INFO[0].FIELDS.MOBILE_TEL;
        let codeField = _this.groupDatas.LINK_INFO.CUST_LINK_INFO[0].FIELDS.VALIDATE_CODE;
        field.disableNext = true;
        let runValidateMobileData = await _this.$blMethod.runValidateGetMobileCode(_this, mobileField, codeField);
        field.disableNext = false;
        if (!runValidateMobileData) {
            return;
        }
        let getMobileOpenedNumData = await getMobileOpenedNum(_this);
        if (!getMobileOpenedNumData) {
            return;
        }

        //手机号码已经绑定在其他客户下
        _this.busiLogic.checkMobileDetail(_this);
        
        let mobile = fieldData.MOBILE_TEL.DEFAULT_VALUE || "";
        let params = {
            MOBILE: mobile,
            ORG_CODE: getOrgCodeAndOrgName(_this).ORG_CODE
        }
        _this.$blMethod.getVerificationCode(_this, params, field, 60, () => {
            //清空验证码
            fieldData.VALIDATE_CODE.DEFAULT_VALUE = "";
        });
    }, 1000, {
        'leading': true,
        'trailing': false
    }),
    /**
     * 验证码
     */
    CHECK_LINK_VALIDATE_CODE: (_this, field, fieldData) => {
        // 不可编辑的时候不用验证验证码 防止第一次进来的时候 校验
        // 在手机号改变清空验证码的时候，不校验
        if (field.FIELD_CONTROL == "1" || (fieldData.MOBILE_TEL.showchange && field.FIELD_CONTROL == "0")) {
            fieldData.MOBILE_TEL.showchange = false;
            return;
        }
        let mobile = fieldData.MOBILE_TEL.DEFAULT_VALUE || "";
        let defaultValue = field.DEFAULT_VALUE || "";
        let params = {
            MOBILE: mobile,
            AUTH_CODE: defaultValue
        }
        _this.$blMethod.validateVerificationCode(_this, params, field, fieldData.MOBILE_TEL, () => {
            fieldData.MOBILE_TEL.SUFFIX_ICON = "el-icon-success";
            //手机号码获取验证码按钮消失
            fieldData.MOBILE_TEL.IS_SHOW_BUTTON = false;
            //验证码置灰
            field.FIELD_CONTROL = "1";
        });
    },
    //联系地址校验
    checkAddress: (_this) => {
        //只有中国 才需要具体到 门牌号
        let isChina = checkIsChina(_this);
        if (!isChina) {
            return true;
        }
        
        let CUST_LINK_INFO = _this.groupDatas.LINK_INFO.CUST_LINK_INFO[0]["FIELDS"];
        let address = _.get(CUST_LINK_INFO, "ADDRESS.DEFAULT_VALUE", "");
        address = address.replace(/不详/g,"");
        address = address.replace("其他","");
        let addressTextInfo = parseAddress(address);
        let inputAddress = _.get(addressTextInfo, "[2]", "");
        inputAddress = inputAddress.replace(/不详/g,"");
        inputAddress = inputAddress.replace("其他","");
        let checkAddressFlag = _this.$blMethod.checkLeagelAddress(address, inputAddress);
        return checkAddressFlag;
    },
    //地址校验是否跟营业部一个省份 不一致则展示反洗钱备注
    checkAddressDetail: (_this) => {
        let CUST_LINK_INFO = _this.groupDatas.LINK_INFO.CUST_LINK_INFO[0].FIELDS;
        let addressTextInfo = parseAddress(_.get(CUST_LINK_INFO, "ADDRESS.DEFAULT_VALUE"));
        let addressDetailFn = () => {
            let oldData = getOldLinkInfo(_this);
            let ADDRESS_CONFORM_SELECT_VALUE = oldData.ADDRESS_CONFORM_SELECT || ""; 
            setFieldsAtt(_this, CUST_LINK_INFO, "ADDRESS_CONFORM_SELECT", "FIELD_CONTROL", "1");
            setFieldsAtt(_this, CUST_LINK_INFO, "ADDRESS_CONFORM_SELECT", "DEFAULT_VALUE", ADDRESS_CONFORM_SELECT_VALUE);
            setFieldsAtt(_this, CUST_LINK_INFO, "ADDRESS_CONFORM", "FIELD_CONTROL", "1");
        }
        if(addressTextInfo[1].length >= 1 && addressTextInfo[1][0]){
            if (_this.oppBusiData.areaAddr == addressTextInfo[1][0]) {
                addressDetailFn();
                return true;
            }
        }
        //地址为空也不展示
        if (_.isEmpty(CUST_LINK_INFO.ADDRESS.DEFAULT_VALUE)) {
            addressDetailFn();
            return true;
        }
        setFieldsAtt(_this, CUST_LINK_INFO, "ADDRESS_CONFORM_SELECT", "FIELD_CONTROL", "0");
        setFieldsAtt(_this, CUST_LINK_INFO, "ADDRESS_CONFORM", "FIELD_CONTROL", "0");
        return false;
    },
    //校验手机
    checkMobileDetail: (_this) => {
        let CUST_LINK_INFO = _this.groupDatas.LINK_INFO.CUST_LINK_INFO[0].FIELDS;
        if (parseInt(_this.oppBusiData.mobileOpenedNum) > 0) {
            setFieldsAtt(_this, CUST_LINK_INFO, "MOBILE_CONFORM_SELECT", "FIELD_CONTROL", "0");
            setFieldsAtt(_this, CUST_LINK_INFO, "MOBILE_CONFORM", "FIELD_CONTROL", "0");
            return false;
        } else {
            let oldData = getOldLinkInfo(_this);
            let MOBILE_CONFORM_SELECT_VALUE = oldData.MOBILE_CONFORM_SELECT || ""; 
            setFieldsAtt(_this, CUST_LINK_INFO, "MOBILE_CONFORM_SELECT", "FIELD_CONTROL", "1");
            setFieldsAtt(_this, CUST_LINK_INFO, "MOBILE_CONFORM_SELECT", "DEFAULT_VALUE", MOBILE_CONFORM_SELECT_VALUE);
            setFieldsAtt(_this, CUST_LINK_INFO, "MOBILE_CONFORM", "FIELD_CONTROL", "1");
        }
        return true;
    },
    bizCustLinkInfoNodeCheckModule: (_this, moduleIdArr) => {
        if (moduleIdArr.indexOf("CUST_LINK_INFO") > -1) {
            return checkAddressValidType(_this)
        }
        return true;
    }
}

//查询手机号已登记个数
const getMobileOpenedNum = (_this, mobile, isNotShowLoading) => {
    let CUST_LINK_INFO = _this.groupDatas.LINK_INFO.CUST_LINK_INFO[0]["FIELDS"];
    let newMobile = mobile || _.get(CUST_LINK_INFO, "MOBILE_TEL.DEFAULT_VALUE", "");
    let SAME_MOBIL_LIMIT_ACCTS = _this.$blMethod.getJsonSessionSysCommParam(_this, "SAME_MOBIL_LIMIT_ACCTS") || "3";
    if (!newMobile) {
        return true;
    }
    _this.oppBusiData.mobileData = _.assign({}, _this.oppBusiData.mobileData);
    let mobileDataItem = _this.oppBusiData.mobileData[newMobile];
    if (mobileDataItem) {
        if (parseInt(mobileDataItem) >= parseInt(SAME_MOBIL_LIMIT_ACCTS)) {
            return false;
        }
        return true;
    }
    if (!isNotShowLoading) {
        _this.loading = true;
        _this.loadingText = "正在验证手机号码..."
        _this.oppBusiData.loaddingSetClose = false;
        setTimeout(() => {
            if (_this.loading && _this.oppBusiData.loaddingSetClose) {
                _this.loading = false;
                _this.oppBusiData.loaddingSetClose = false;
                return
            }
            _this.oppBusiData.loaddingSetClose = true;
        }, 1500);
    }
    return _this.$syscfg.K_Request("Y3000001", {
        LBM: "KUAS_L1192319",
        MOBILE_TEL: newMobile, 
        USER_TYPE: "0"
    }, false, axiosCfg).then( res => {
        let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
        let OPEND_NUM = _.get(res, "Data[0].OPEND_NUM", "0");
        //是否包含了本人的 如果包含则-1
        let hasSelf = _.find(_.get(res, "Data", []), {USER_CODE: customerInfo.CUST_CODE});
        if (!_.isEmpty(hasSelf)){
            OPEND_NUM = parseInt(OPEND_NUM) - 1;
        }
        _this.oppBusiData.mobileOpenedNum = parseInt(OPEND_NUM);
        _this.oppBusiData.mobileData[newMobile] = OPEND_NUM;
        if (parseInt(OPEND_NUM) >= parseInt(SAME_MOBIL_LIMIT_ACCTS)) {
            return false;
        }
        return true;
    }).catch( err => {
        _this.oppBusiData.mobileData[newMobile] = "0";
        return err;
    }).finally( () => {
        if (!isNotShowLoading) {
            if (_this.loading && _this.oppBusiData.loaddingSetClose) {
                _this.loading = false;
                _this.oppBusiData.loaddingSetClose = false;
                return
            }
            _this.oppBusiData.loaddingSetClose = true;
        }
    })
}
//字段属性设置
const setFieldsAtt = (_this, FIELDS, fieldId, att, value) => {
    let field = _.get(FIELDS, fieldId, {});
    if (!_.isEmpty(field)) {
        FIELDS[fieldId][att] = value;
    }
}
//校验地址是否显示省市区
const checkShowRegionSelector = (_this) => {
    let CUST_EXPERIENCE_INFO = _this.groupDatas.CUST_INFO.CUST_EXPERIENCE_INFO[0].FIELDS;
    let CITIZENSHIP = _.get(CUST_EXPERIENCE_INFO, "CITIZENSHIP.DEFAULT_VALUE", "");
    let showIdTypeCITIZENSHIP = ["CHN", "CTN", "HKG", "MAC"];
    if (showIdTypeCITIZENSHIP.indexOf(CITIZENSHIP) > -1) {
        return true;
    }
    return false;
}
//校验地址是否精确到门牌号
const checkIsChina = (_this) => {
    let CUST_EXPERIENCE_INFO = _this.groupDatas.CUST_INFO.CUST_EXPERIENCE_INFO[0].FIELDS;
    let CITIZENSHIP = _.get(CUST_EXPERIENCE_INFO, "CITIZENSHIP.DEFAULT_VALUE", "");
    let showIdTypeCITIZENSHIP = ["CHN"];
    if (showIdTypeCITIZENSHIP.indexOf(CITIZENSHIP) > -1) {
        return true;
    }
    return false;
}
//获取境内外标识
const getINOUTSIDE_IDENTITY = (_this)  => {
    //境内外判断
    let CUST_CARD_INFO = _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].FIELDS;
    let idType = _.get(CUST_CARD_INFO, "ID_TYPE.DEFAULT_VALUE", "");
    if (_.isEmpty(idType)) {
        return "";
    }
    let params = {
        ID_TYPE: idType || "",
        SUBJECT_IDENTITY: "",
        INOUTSIDE_IDENTITY: "",
        OCCU_TYPE: "",
    }
    let filterOpenLogicInfo = _this.$blMethod.loadOpenLogicData(_this, params);
    return _.get(filterOpenLogicInfo, "INOUTSIDE_IDENTITY[0]", "");
}
//邮政编码校验
const checkZipCode = (_this) => {
    let oldData = getOldLinkInfo(_this);
    let newData = _.get(_this.historyData, "CUST_INFO.CUST_LINK_INFO", {});
    let oldZipCode = oldData.ZIP_CODE;
    let zipCode = newData.ZIP_CODE || oldZipCode;
    if (_.isEmpty(zipCode)) {
        return false;
    }
    let rule = validateRules["num"];
    let isPass = rule.valid(zipCode, [6]);
    if (!isPass) {
        return false;
    }
    return true;
}
//地址校验
const checkAddressValidType = (_this) => {
    let CUST_LINK_INFO = _this.groupDatas.LINK_INFO.CUST_LINK_INFO[0];
    let addressField = CUST_LINK_INFO.FIELDS.ADDRESS
    let defaultValue = addressField.DEFAULT_VALUE || "";
    if (_.isEmpty(defaultValue)) {
        return false
    }
    let addressTextInfo = parseAddress(defaultValue);
    let region = addressTextInfo[1] || [];
    region = region.join("");
    defaultValue = _.cloneDeep(region).replace(/不详|市辖区|辖县/gm, '') + addressTextInfo[2];
    let rule = validateRules["length"];
    let params = [16,64];
    let isPass = rule.valid(defaultValue, params);
    if (!isPass) {
        return false;
    }
    return true;
}
//手机号码校验
const checkPhone = (_this) => {
    let CUST_LINK_INFO = _this.groupDatas.LINK_INFO.CUST_LINK_INFO[0];
    let phoneField = CUST_LINK_INFO.FIELDS.MOBILE_TEL;
    let defaultValue = phoneField.DEFAULT_VALUE;
    if (_.isEmpty(defaultValue)) {
        return false
    }
    //校验 手机号
    let rule = validateRules["mobile"];
    let isPass = rule.valid(defaultValue);
    if (!isPass) {
        return false;
    }
    return true;
}
//邮箱校验
const checkEmail = (_this) => {
    let CUST_LINK_INFO = _this.groupDatas.LINK_INFO.CUST_LINK_INFO[0];
    let emailField = CUST_LINK_INFO.FIELDS.EMAIL
    let defaultValue = emailField.DEFAULT_VALUE;
    if (_.isEmpty(defaultValue)) {
        return true
    }
    //校验 length[4,64]
    let rule = validateRules["length"];
    let params = [4,64];
    let isPass = rule.valid(defaultValue, params);
    let msg = rule.msg;
    for (var i = 0; i < params.length; i++) {
        msg = msg.replace(new RegExp("\\{" + i + "\\}", "g"), params[i]);
    }
    if (!isPass) {
        _this.$nextTick( () => {
            _this.$blMethod.changeFieldError(emailField, false, msg);
        })
        return false;
    }
    return true;
}
