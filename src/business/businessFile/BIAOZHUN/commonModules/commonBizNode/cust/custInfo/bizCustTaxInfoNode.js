/* 
*   个人涉税模块
*   方法封装
*   @author  yangyp
*/

import stringConfig from "../../../../../../../tools/stringConfig.js"
import stringPinyinConfig from '../../../../../../../tools/stringPinyinConfig.js'
import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import { parseAddress } from "../../../../../../../tools/util" //地址解析组件
import bizPublicMethod from "../../../../../../businessTools/bizPublicMethod.js"

const bizCustTaxInfoNodeBeforeLoadBizCommon = function (_this) {
    let ORG_TAX_INFO = _this.groupDatas.APPR_INFO.ORG_TAX_INFO[0].FIELDS;
    let CUST_TAX_INFO_MODULE3 = _this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE3[0].FIELDS;
    let CUST_TAX_INFO_MODULE2 = _this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE2[0].FIELDS;
    let CUST_TAX_INFO_MODULE4 = _this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE4[0].FIELDS;
    let TAX_ASSET_INFO = _this.groupDatas.APPR_INFO.TAX_ASSET_INFO[0].FIELDS;
    let TAX_PAYMENT_INFO = _this.groupDatas.APPR_INFO.TAX_PAYMENT_INFO[0].FIELDS;
    //客户涉税居民身份 为下拉框选择
    ORG_TAX_INFO.TAX_RESIDENT_TYPE.labelWidth = 280;
    ORG_TAX_INFO.TAX_RESIDENT_TYPE.FIELED_CHECKBOX_BOTTON = true;
    ORG_TAX_INFO.TAX_RESIDENT_TYPE.FIELD_RADIO_TYPE = false;  //false为单选
    ORG_TAX_INFO.TAX_RESIDENT_TYPE.FIELD_DICT_FILTER =  "!4,5";
    //取得投资人申明标识
    ORG_TAX_INFO.GET_INVEST_CERFLAG.FIELD_TYPE = "checker";
    ORG_TAX_INFO.GET_INVEST_CERFLAG.labelWidth = 280;
    ORG_TAX_INFO.GET_INVEST_CERFLAG.FIELED_CHECKBOX_BOTTON = true;
    ORG_TAX_INFO.GET_INVEST_CERFLAG.FIELD_RADIO_TYPE = false;  //false为单选
    //默认为是且不展示
    ORG_TAX_INFO.GET_INVEST_CERFLAG.DEFAULT_VALUE = "1";
    

    CUST_TAX_INFO_MODULE2.NATION_ENG.showDictItem = "1";
    CUST_TAX_INFO_MODULE2.PROVINCE.showDictItem = "1";
    CUST_TAX_INFO_MODULE2.CITYCN.showDictItem = "1";
    CUST_TAX_INFO_MODULE2.DISTRICT_NAME.showDictItem = "1"
    CUST_TAX_INFO_MODULE2.ADDRESS.VALID_TYPE = "addressLength[16,320]"

    
    CUST_TAX_INFO_MODULE3.BIRTH_NATION_ENG.showDictItem = "1";
    CUST_TAX_INFO_MODULE3.BIRTH_ADDRESS.VALID_TYPE = "addressLength[16,128]";

    TAX_ASSET_INFO.CURR_CODE.showDictItem = "1";

    TAX_PAYMENT_INFO.PAYMENT_CURR.showDictItem = "1";

    CUST_TAX_INFO_MODULE4.CITIZENSHIP.showDictItem = "1";
    CUST_TAX_INFO_MODULE4.CITIZENSHIP.FIELD_DICT_NAME = _.get(_this.oppBusiData, "dictAll.CITIZENSHIP_ST", CUST_TAX_INFO_MODULE4.CITIZENSHIP.FIELD_DICT_NAME); 
    //labelWidth调整
    _this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE2.forEach(function(moduleItem){
        for (let key in moduleItem.FIELDS) {
            moduleItem.FIELDS[key].labelWidth = 260;
        }
    })
    _this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE3.forEach(function(moduleItem){
        for (let key in moduleItem.FIELDS) {
            moduleItem.FIELDS[key].labelWidth = 260;
        }
    })
    _this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE4.forEach(function(moduleItem){
        for (let key in moduleItem.FIELDS) {
            moduleItem.FIELDS[key].labelWidth = 280;
        }
    })

    _this.groupDatasTpl.APPR_INFO.TAX_PAYMENT_INFO[0] = _.cloneDeep(_this.groupDatas.APPR_INFO.TAX_PAYMENT_INFO[0]);
    _this.groupDatasTpl.APPR_INFO.TAX_ASSET_INFO[0] = _.cloneDeep(_this.groupDatas.APPR_INFO.TAX_ASSET_INFO[0]);
    _this.groupDatasTpl.APPR_INFO.CUST_TAX_INFO_MODULE2[0] = _.cloneDeep(_this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE2[0]);
    _this.groupDatasTpl.APPR_INFO.CUST_TAX_INFO_MODULE3[0] = _.cloneDeep(_this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE3[0]);
    _this.groupDatasTpl.APPR_INFO.CUST_TAX_INFO_MODULE4[0] = _.cloneDeep(_this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE4[0]);

    // 重新加载 省、市、县区代码信息
    let addrDict = {
        PROVINCE_DATA: CUST_TAX_INFO_MODULE2.PROVINCE.FIELD_DICT_NAME,
        CITICN_DATA: CUST_TAX_INFO_MODULE2.CITYCN.FIELD_DICT_NAME,
        DISTRICT_DATA: CUST_TAX_INFO_MODULE2.DISTRICT_NAME.FIELD_DICT_NAME,
    }
    let addrDictTran = dealWithProvinceAndCityData(_this, addrDict)
    CUST_TAX_INFO_MODULE2.PROVINCE.FIELD_DICT_NAME = addrDictTran.PROVINCE_DATA
    CUST_TAX_INFO_MODULE2.CITYCN.FIELD_DICT_NAME = addrDictTran.CITICN_DATA
    CUST_TAX_INFO_MODULE2.DISTRICT_NAME.FIELD_DICT_NAME = addrDictTran.DISTRICT_DATA
}
const dealWithProvinceAndCityData = (_this, params) => {
    let provinceData = params.PROVINCE_DATA,
        citicnData = params.CITICN_DATA,
        districtData = params.DISTRICT_DATA,
        specialProvinces = ("110000,120000,310000,500000,710000,810000,820000").split(",");
    _.each(specialProvinces, function (provinceCode) {
        // 在市区代码中查找直辖市数据
        var prefixStr = provinceCode.substr(0, 2),
            obj = _.find(citicnData, function (v) {
                return (v.dict_val || v.DICT_ITEM).substr(0, 2) == prefixStr;
            });
        if (!obj) {
            // 若不存在，则增加直辖市的数据
            obj = _.find(provinceData, function (v) {
                return v.dict_val == provinceCode || v.DICT_ITEM == provinceCode;
            });
            if (obj.DICT_CODE) {
                obj.DICT_CODE = "CRS_CITY_CODE";
            }
            citicnData.push(obj);
        }
        // 在县区代码中查找直辖市数据
        obj = _.find(districtData, function (v) {
            return (v.dict_val || v.DICT_ITEM).substr(0, 2) == prefixStr;
        });
        if (!obj) {
            // 若不存在，则增加直辖市的数据
            obj = _.find(provinceData, function (v) {
                return v.dict_val == provinceCode || v.DICT_ITEM == provinceCode;
            });
            if (obj.DICT_CODE) {
                obj.DICT_CODE = "CRS_COUNTY_CODE";
            }
            districtData.push(obj);
        }
    });

    return {
        PROVINCE_DATA: provinceData,
        CITICN_DATA: citicnData,
        DISTRICT_DATA: districtData
    }
}
const getOldTaxInfo = (_this) => {
    let info = _.get(_this.oppBusiData, "oldBusiData.CUST_TAX_INFO", {});
    if (_.isEmpty(info)) {
        return {};
    }
    info = _.mapValues(info, _.trim);
    if ( _.isEmpty(info.CITIZENSHIP) || info.TAX_RESIDENT_TYPE == "1") {
        info.CITIZENSHIP = "";
        info.HAS_TAXPAYER_IDNO = "";
        info.TAXPAYER_IDNO = "";
        info.OPP_NO_TAXPAYERID_REASON = "";
        info.NO_TAXER_ID_REASON1 = "";
        info.NO_TAXPAYERID_REASON = "";
        info.NO_ACCESS_ID_REASON1 = "";
    }
    if ( _.isEmpty(info.CITIZENSHIP2) || info.TAX_RESIDENT_TYPE == "1") {
        info.CITIZENSHIP2 = "";
        info.HAS_TAXPAYER_IDNO2 = "";
        info.TAXPAYER_IDNO2 = "";
        info.OPP_NO_TAXPAYERID_REASON2 = "";
        info.NO_TAXER_ID_REASON2 = "";
        info.NO_TAXPAYERID_REASON2 = "";
        info.NO_ACCESS_ID_REASON2 = "";
    }
    if ( _.isEmpty(info.CITIZENSHIP3) || info.TAX_RESIDENT_TYPE == "1") {
        info.CITIZENSHIP3 = "";
        info.HAS_TAXPAYER_IDNO3 = "";
        info.TAXPAYER_IDNO3 = "";
        info.OPP_NO_TAXPAYERID_REASON3 = "";
        info.NO_TAXER_ID_REASON3 = "";
        info.NO_TAXPAYERID_REASON3 = "";
        info.NO_ACCESS_ID_REASON3 = "";
    }
    if (info.TAX_RESIDENT_TYPE == "1") {
        info.BIRTH_ADDRESS = "";
        info.ADDRESS = "";
    }
    //如果HAS_TAXPAYER_IDNO-是否有纳税人识别号 为否 则置空TAXPAYER_IDNO-纳税人识别号
    //如果HAS_TAXPAYER_IDNO-是否有纳税人识别号 为是 则置空OPP_NO_TAXPAYERID_REASON-无纳税人识别号原因 、 NO_TAXPAYERID_REASON-未取得纳税人识别号原因
    if (info.HAS_TAXPAYER_IDNO == "0") {
        info.TAXPAYER_IDNO = "";
    }
    if (info.HAS_TAXPAYER_IDNO2 == "0") {
        info.TAXPAYER_IDNO2 = "";
    }
    if (info.HAS_TAXPAYER_IDNO3 == "0") {
        info.TAXPAYER_IDNO3 = "";
    }
    if (info.HAS_TAXPAYER_IDNO == "1") {
        info.OPP_NO_TAXPAYERID_REASON = "";
        info.NO_TAXPAYERID_REASON = "";
    }
    if (info.HAS_TAXPAYER_IDNO2 == "1") {
        info.OPP_NO_TAXPAYERID_REASON2 = "";
        info.NO_TAXPAYERID_REASON2 = "";
    }
    if (info.HAS_TAXPAYER_IDNO3 == "1") {
        info.OPP_NO_TAXPAYERID_REASON3 = "";
        info.NO_TAXPAYERID_REASON3 = "";
    }
    return _.cloneDeep(info);
}
export default {
    bizCustTaxInfoNodeBeforeLoadBiz: async function (_this) {
        await bizCustTaxInfoNodeBeforeLoadBizCommon(_this);
        let oppData = getOldTaxInfo(_this);
        this.custTaxInfoModuleParseOppBiz(_this, oppData); 
        
    },
    bizCustTaxInfoNodeBeforeLoadBizOpenAcct: async function(_this) {
        await bizCustTaxInfoNodeBeforeLoadBizCommon(_this);
    },
    bizCustTaxInfoNodeAfterLoadBiz: function (_this) {
        let historyData = _.cloneDeep(_this.historyData);
        let custTaxInfo = _.get(historyData, "RELA_INFO.CUST_TAX_INFO[0]")  ||  {};
        if(!_.isEmpty(custTaxInfo)){
            let newAddressValBirthAddress = _.cloneDeep(custTaxInfo.BIRTH_ADDRESS);
            let newAddressValAddress = _.cloneDeep(custTaxInfo.ADDRESS);
            custTaxInfo.BIRTH_ADDRESS = historyData.newHistoryTaxBirthAddress || custTaxInfo.BIRTH_ADDRESS;
            custTaxInfo.ADDRESS = historyData.newHistoryTaxAddress || custTaxInfo.ADDRESS;
            this.custTaxInfoModuleParseOppBiz(_this, custTaxInfo);
            _this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE3[0]["FIELDS"].BIRTH_ADDRESS.newAddressVal = newAddressValBirthAddress;
            _this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE2[0]["FIELDS"].ADDRESS.newAddressVal = newAddressValAddress;
        }
        //取得投资人声明标识 不做回填依然用的原始数据 只有报送的时候 才报送1-是
        let oldData = getOldTaxInfo(_this);
        _this.groupDatas.APPR_INFO.ORG_TAX_INFO[0].FIELDS.GET_INVEST_CERFLAG.DEFAULT_VALUE = _.cloneDeep(oldData.GET_INVEST_CERFLAG);
        taxInfoTypeHideOrShow(_this)   
    },
    bizCustTaxInfoNodeValidate: function (_this) {
        _this.$refs.flowTip.flowTips = [];

        if(_this.moduleId.indexOf("ORG_TAX_INFO") != -1 ){

        }
        if(_this.moduleId.indexOf("CUST_TAX_INFO_MODULE2") != -1){

        }
        if(_this.moduleId.indexOf("CUST_TAX_INFO_MODULE3") != -1){
            if (_this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE3[0].FIELDS.BIRTH_ADDRESS.FIELD_REQUIRED == "1") {
                let birthAddressStr = _this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE3[0].FIELDS.BIRTH_ADDRESS.DEFAULT_VALUE;
                birthAddressStr = birthAddressStr.replace("市辖区","").replace(/不详/g,"");
                let strLength = birthAddressStr.replace(/[^\x00-\xff]/g, "**");
                if(strLength.length < 16 || strLength.length > 128){
                    _this.$refs.flowTip.pushFlowTip({
                        title:`出生地址请输入16-128个字符，1个中文算2个字符`,
                        type:'warning',
                        key:'name'
                    });
                    return false;
                }
            }
            

        }
        if(_this.moduleId.indexOf("CUST_TAX_INFO_MODULE4") != -1){

        }                                
    },
    // 上一步
    bizCustTaxInfoNodePreValidate: function(_this) {
    },

    bizCustTaxInfoNodePageActivated: function (_this) {
    },
    bizCustTaxInfoNodeBeforeSave: function (_this, params) {
        let taxCountryObj = _this.$blMethod.getEmptyTaxCountry();
        let taxAssetObj = _this.$blMethod.getEmptyTaxAsset();
        let taxInfoItemData = [];//涉税信息
        let taxAssetData = [];//资金

        let ORG_TAX_INFO = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "ORG_TAX_INFO");
        let CUST_TAX_INFO_MODULE2 = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "CUST_TAX_INFO_MODULE2");
        let CUST_TAX_INFO_MODULE3 = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "CUST_TAX_INFO_MODULE3");
        let CUST_TAX_INFO_MODULE4 = bizPublicSaveMethod.getModuleArrFoyKey(_this, "CUST_TAX_INFO_MODULE4", true);
        let TAX_ASSET_INFO = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "TAX_ASSET_INFO", true);
        let TAX_PAYMENT_INFO = bizPublicSaveMethod.getModuleArrFoyKey(_this, "TAX_PAYMENT_INFO", true);

        let orgTaxInfoFields = _this.groupDatas.APPR_INFO.ORG_TAX_INFO[0].FIELDS;
        let custTaxInfoModule2Fields = _this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE2[0].FIELDS;
        let custTaxInfoModule3Fields = _this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE3[0].FIELDS;
        let custTaxInfoModule4Fields = _this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE4[0].FIELDS;
        let taxAssetInfoFields = _this.groupDatas.APPR_INFO.TAX_ASSET_INFO[0].FIELDS;
        let taxPaymentInfoFields = _this.groupDatas.APPR_INFO.TAX_PAYMENT_INFO[0].FIELDS;
        let custTaxInfoModule6Fields = _this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE6[0].FIELDS;

        //增加一个地址字段用于保存address留有不详市辖区辖县 用于回填
        params.newHistoryTaxAddress = _.cloneDeep(CUST_TAX_INFO_MODULE2.ADDRESS);
        CUST_TAX_INFO_MODULE2.ADDRESS = _.cloneDeep(custTaxInfoModule2Fields.ADDRESS.newAddressVal) || params.newHistoryTaxAddress;
        params.newHistoryTaxBirthAddress = _.cloneDeep(CUST_TAX_INFO_MODULE3.BIRTH_ADDRESS);
        CUST_TAX_INFO_MODULE3.BIRTH_ADDRESS = _.cloneDeep(custTaxInfoModule3Fields.BIRTH_ADDRESS.newAddressVal) || params.newHistoryTaxBirthAddress;

        //客户涉税居民身份
        let TAX_RESIDENT_TYPE = ORG_TAX_INFO.TAX_RESIDENT_TYPE || "";
        //资金
        taxAssetData = TAX_RESIDENT_TYPE != "1" ? TAX_PAYMENT_INFO : [];
        taxInfoItemData = TAX_RESIDENT_TYPE != "1" ? CUST_TAX_INFO_MODULE4 : [];


        let custTaxInfo = {};
        let busiData = _this.oppBusiData.newBusiData;
        let otherParams = {
            MONAMNT: TAX_RESIDENT_TYPE != "1" ? _.get(TAX_ASSET_INFO, "MONAMNT", "") : "",
            CURR_CODE: TAX_RESIDENT_TYPE != "1" ? _.get(TAX_ASSET_INFO, "CURR_CODE", "") : "",
            CTRL_FLAG: "0",
            CTRL_NO: "0",
            PASSIVE_NFE: "",
            CTRL_NON_RESIDENT: "",
            BIRTHDAY: TAX_RESIDENT_TYPE != "1" ? _.get(_this.groupDatas, "CUST_INFO.CUST_CARD_INFO[0].FIELDS.BIRTHDAY.DEFAULT_VALUE", "") : "",
            BIRTH_ADDRESS: TAX_RESIDENT_TYPE != "1" ? _.get(CUST_TAX_INFO_MODULE3, "BIRTH_ADDRESS", "") : "",
            ADDRESS: TAX_RESIDENT_TYPE != "1" ? _.get(CUST_TAX_INFO_MODULE2, "ADDRESS", "") : "",
            BIRTH_COUNTRY: _.get(CUST_TAX_INFO_MODULE3, "BIRTH_NATION_ENG","")
        }
        let formData = _.assign(
            {},
            ORG_TAX_INFO,
            CUST_TAX_INFO_MODULE2,
            CUST_TAX_INFO_MODULE3,
        )
        //纳入标准版2205：税收居民身份为1时，不取其他字段值，避免有涉税数据差异导致修改；
        if (TAX_RESIDENT_TYPE == 1) {
            formData = _.pick(formData, "TAX_RESIDENT_TYPE","GET_INVEST_CERFLAG");
        }
        custTaxInfo = _.assign(
            {},
            formData,
            otherParams,
            taxCountryObj,
            taxAssetObj,
            TAX_RESIDENT_TYPE != "1" ? _this.$blMethod.transTaxInfoToObj(taxInfoItemData) : {},
            TAX_RESIDENT_TYPE != "1" ? _this.$blMethod.transTaxAssetInfoToObj(taxAssetData) : {}
        )
        //GET_INVEST_CERFLAG
        custTaxInfo.GET_INVEST_CERFLAG = "1";
        custTaxInfo = [custTaxInfo];
        let relaInfo = busiData && busiData.RELA_INFO || {};
        relaInfo.CUST_TAX_INFO = custTaxInfo;
        !params.RELA_INFO && (params.RELA_INFO = {})
        if(_this.busiCode == "V0049" || _this.busiCode == "V0163") {
            let oldTaxInfo = getOldTaxInfo(_this);
            let CUST_EXPERIENCE_INFO = _this.groupDatas.CUST_INFO.CUST_EXPERIENCE_INFO[0].FIELDS;
            //不知道为什么国籍会有数据 地址 生日等 删除落地后依然有数据（ygt问题）在这里如果税收居民身份没有变更 是1则相关数据不变
            if (oldTaxInfo.TAX_RESIDENT_TYPE == TAX_RESIDENT_TYPE && TAX_RESIDENT_TYPE == "1" && oldTaxInfo.CITIZENSHIP) {
                custTaxInfo[0].CITIZENSHIP = oldTaxInfo.CITIZENSHIP;
                custTaxInfo[0].BIRTH_ADDRESS = oldTaxInfo.BIRTH_ADDRESS;
                custTaxInfo[0].ADDRESS = oldTaxInfo.ADDRESS;
                custTaxInfo[0].TAXPAYER_IDNO = oldTaxInfo.TAXPAYER_IDNO
            }
            //涉税资产和涉税收入信息不变 不更改
            {
                oldTaxInfo.CURR_CODE && (custTaxInfo[0].CURR_CODE = oldTaxInfo.CURR_CODE);
                oldTaxInfo.MONAMNT && (custTaxInfo[0].MONAMNT = oldTaxInfo.MONAMNT);
                oldTaxInfo.PAYMENT_TYPE && (custTaxInfo[0].PAYMENT_TYPE = oldTaxInfo.PAYMENT_TYPE);
                oldTaxInfo.PAYMENT_TYPE1 && (custTaxInfo[0].PAYMENT_TYPE1 = oldTaxInfo.PAYMENT_TYPE1);
                oldTaxInfo.PAYMENT_TYPE2 && (custTaxInfo[0].PAYMENT_TYPE2 = oldTaxInfo.PAYMENT_TYPE2);
                oldTaxInfo.PAYMENT_TYPE3 && (custTaxInfo[0].PAYMENT_TYPE3 = oldTaxInfo.PAYMENT_TYPE3);
                oldTaxInfo.PAYMENT_TYPE4 && (custTaxInfo[0].PAYMENT_TYPE4 = oldTaxInfo.PAYMENT_TYPE4);

                oldTaxInfo.PAYMENT_CURR && (custTaxInfo[0].PAYMENT_CURR = oldTaxInfo.PAYMENT_CURR);
                oldTaxInfo.PAYMENT_CURR1 && (custTaxInfo[0].PAYMENT_CURR1 = oldTaxInfo.PAYMENT_CURR1);
                oldTaxInfo.PAYMENT_CURR2 && (custTaxInfo[0].PAYMENT_CURR2 = oldTaxInfo.PAYMENT_CURR2);
                oldTaxInfo.PAYMENT_CURR3 && (custTaxInfo[0].PAYMENT_CURR3 = oldTaxInfo.PAYMENT_CURR3);
                oldTaxInfo.PAYMENT_CURR4 && (custTaxInfo[0].PAYMENT_CURR4 = oldTaxInfo.PAYMENT_CURR4);

                oldTaxInfo.PAYMENT_ASSET && (custTaxInfo[0].PAYMENT_ASSET = oldTaxInfo.PAYMENT_ASSET);
                oldTaxInfo.PAYMENT_ASSET1 && (custTaxInfo[0].PAYMENT_ASSET1 = oldTaxInfo.PAYMENT_ASSET1);
                oldTaxInfo.PAYMENT_ASSET2 && (custTaxInfo[0].PAYMENT_ASSET2 = oldTaxInfo.PAYMENT_ASSET2);
                oldTaxInfo.PAYMENT_ASSET3 && (custTaxInfo[0].PAYMENT_ASSET3 = oldTaxInfo.PAYMENT_ASSET3);
                oldTaxInfo.PAYMENT_ASSET4 && (custTaxInfo[0].PAYMENT_ASSET4 = oldTaxInfo.PAYMENT_ASSET4);
            }
            
            //军人删除涉税信息
            let vocation = bizPublicMethod.$blMethod.getFieldValueName(CUST_EXPERIENCE_INFO.OCCU_TYPE.FIELD_DICT_NAME,CUST_EXPERIENCE_INFO.OCCU_TYPE.DEFAULT_VALUE);
            if (vocation == "军人") {
                custTaxInfo = [];
            }
            
            let fieldIgoreArr = ["CTRL_NO", "OPERATOR_TYPE", "OPER_TYPE", "CITYEN", "CTRL_FLAG", "PAYMENT_AMNT1", "PAYMENT_AMNT2", "PAYMENT_AMNT3", "MODULE_RADIO_BUTTON","BIRTHDAY", "OPP_NO_TAXPAYERID_REASON", "BIRTH_COUNTRY", "REG_COUNTRY", "LIVING_COUNTRY", "ADDRESS_TYPE", "NO_ACCESS_ID_REASON1", "NO_ACCESS_ID_REASON2", "NO_ACCESS_ID_REASON3","REMARK1", "REMARK2", "REMARK3", "NO_TAXER_ID_REASON1", "NO_TAXER_ID_REASON2", "NO_TAXER_ID_REASON3", "HAS_TAXPAYER_IDNO", "HAS_TAXPAYER_IDNO2", "HAS_TAXPAYER_IDNO3"];
            //审核端展示的信息过滤
            let dataYGT = bizPublicMethod.$blMethod.getArrDiff(_.cloneDeep(custTaxInfo), _.isEmpty(oldTaxInfo) ? [] : [_.cloneDeep(oldTaxInfo)], "CTRL_NO", "OPP_NO_TAXPAYERID_REASON,OPP_NO_TAXPAYERID_REASON2,OPP_NO_TAXPAYERID_REASON3");
            //vtm 对比页面展示
            let data1 = bizPublicMethod.$blMethod.getArrDiff(_.cloneDeep(custTaxInfo), _.isEmpty(oldTaxInfo) ? [] : [_.cloneDeep(oldTaxInfo)], "CTRL_NO", "OPP_NO_TAXPAYERID_REASON,OPP_NO_TAXPAYERID_REASON2,OPP_NO_TAXPAYERID_REASON3");
            let fieldConversion = {
                CITIZENSHIP2: "CITIZENSHIP",
                CITIZENSHIP3: "CITIZENSHIP",
                TAXPAYER_IDNO2: "TAXPAYER_IDNO",
                TAXPAYER_IDNO3: "TAXPAYER_IDNO",
                NO_TAXPAYERID_REASON2: "NO_TAXPAYERID_REASON",
                NO_TAXPAYERID_REASON3: "NO_TAXPAYERID_REASON",
                OPP_NO_TAXPAYERID_REASON2: "OPP_NO_TAXPAYERID_REASON",
                OPP_NO_TAXPAYERID_REASON3: "OPP_NO_TAXPAYERID_REASON",
                HAS_TAXPAYER_IDNO2: "HAS_TAXPAYER_IDNO",
                HAS_TAXPAYER_IDNO3: "HAS_TAXPAYER_IDNO"
            }
            let fieldsAll = _.assign({}, orgTaxInfoFields, custTaxInfoModule2Fields, custTaxInfoModule3Fields, custTaxInfoModule4Fields, taxAssetInfoFields, taxPaymentInfoFields, custTaxInfoModule6Fields);
            data1.INFO = _this.$blMethod.addDiffAttArr(fieldsAll, _.cloneDeep(data1.INFO), fieldConversion);
            dataYGT.SHOW_INFO = _.each(data1.INFO, infoItem => {
                infoItem.DIFF_INFO = _.filter(infoItem.DIFF_INFO, diffItem => {
                    return fieldIgoreArr.indexOf(diffItem.FIELD) == -1 && diffItem.NEW != diffItem.OLD;
                })
                let deleteDiffField = ["CUST_CODE", "CUST_NAME"];
                if (oldTaxInfo.TAX_RESIDENT_TYPE == "1") {
                    deleteDiffField.push("CITIZENSHIP");
                }
                infoItem.deleteDiff = _.filter(infoItem.deleteDiff, deleteDiffItem => {
                    return fieldIgoreArr.indexOf(deleteDiffItem.FIELD) == -1 && deleteDiffItem.NEW != deleteDiffItem.OLD && deleteDiffField.indexOf(deleteDiffItem.FIELD) == -1;
                })
            })
            let custTaxChangeInfo = _.cloneDeep(dataYGT.INFO);
            if (!_.isEmpty(custTaxChangeInfo)) {
                custTaxChangeInfo[0].showDiffInfo = _.get(dataYGT, "SHOW_INFO[0].DIFF_INFO");
                custTaxChangeInfo[0].deleteDiff = _.get(dataYGT, "SHOW_INFO[0].deleteDiff");
            }
            if (custTaxChangeInfo.length) {
                custTaxChangeInfo  = _this.$blMethod.getTaxCountryDiffData(custTaxChangeInfo, oldTaxInfo);
                custTaxChangeInfo  = _this.$blMethod.getTaxAssetDiffData(custTaxChangeInfo, oldTaxInfo);
            }
            relaInfo.CUST_TAX_CHANGE_INFO = custTaxChangeInfo[0];

            //一柜通审核端需要展示的涉税
            // 如果不显示涉税信息 或 选择了“仅为中国税收居民”，需要删除存量的居民国信息
            let custTaxInfoItem = bizPublicMethod.$blMethod.getArrDiff(
                custTaxInfo && custTaxInfo.TAX_RESIDENT_TYPE != "1" ? bizPublicMethod.$blMethod.transTaxInfoToArr(custTaxInfo[0]) : [],
                !_.isEmpty(oldTaxInfo) ? bizPublicMethod.$blMethod.transTaxInfoToArr(oldTaxInfo) : [],
                "TAX_ID", "", true
            );
            // 审核端数据结构要求：将基本涉税信息与居民国信息合并在一起，保持个人、机构、产品的数据结构一致性
            custTaxInfoItem.CTRL_NO = "0";
            custTaxInfoItem.CTRL_FLAG = "0";
            custTaxInfoItem.TAX_INFO = custTaxChangeInfo || [];
            custTaxInfoItem.COUNTRY_INFO = custTaxInfoItem.INFO;

            //IS_CHANGE_TAX_RESIDENT_TYPE 税收居民身份是否修改了
            let IS_CHANGE_TAX_RESIDENT_TYPE = "0"
            if (oldTaxInfo.TAX_RESIDENT_TYPE != TAX_RESIDENT_TYPE) {
                IS_CHANGE_TAX_RESIDENT_TYPE = "1"
            }
            Object.assign(params, {
                CUST_TAX_INFO: custTaxChangeInfo || [],
                TAX_INFO_FLAG: TAX_RESIDENT_TYPE,
                CUST_TAX_INFO_ITEM: [custTaxInfoItem],
                TAX_RESIDENT_TYPE: TAX_RESIDENT_TYPE,
                IS_CHANGE_TAX_RESIDENT_TYPE: IS_CHANGE_TAX_RESIDENT_TYPE,
            });
        }
        params.TAX_RESIDENT_TYPE = TAX_RESIDENT_TYPE,
        params.RELA_INFO = params.RELA_INFO || {};
        Object.assign(params.RELA_INFO, relaInfo);
        return params;
    },
    bizCustTaxInfoNodeAfterSave: function (_this, newData) {
        if (_this.oppBusiData.newBusiData) {
            let newObj = { 
                RELA_INFO: _.get(newData, "RELA_INFO", {})
            }
            _.assign(_this.oppBusiData.newBusiData, newObj);
        }
    },

    //----------------------业务函数----------------------------------//

    /**
     *custTaxInfoModuleParseOppBiz 重新加载转换之后的历史数据
    * @param _this
    */
    custTaxInfoModuleParseOppBiz :function (_this, bdata) {
        
        bizPublicMethod.$blMethod.parseGroupsMouduleData(_this,[
            "ORG_TAX_INFO",
            "CUST_TAX_INFO_MODULE2",
            "CUST_TAX_INFO_MODULE3",
            "CUST_TAX_INFO_MODULE4",
            "TAX_ASSET_INFO",
            "TAX_PAYMENT_INFO",
        ],bdata);
        bizPublicMethod.$blMethod.parseTaxWithTaxPayerData(_this,"APPR_INFO","CUST_TAX_INFO_MODULE4",bdata);
        bizPublicMethod.$blMethod.parseTaxWithPayMentTaxData(_this,"APPR_INFO","TAX_PAYMENT_INFO",bdata);
        //资产信息  金额 与 货币代码回填
        _this.groupDatas.APPR_INFO.TAX_ASSET_INFO[0].FIELDS.MONAMNT.DEFAULT_VALUE = bdata.MONAMNT;
        _this.groupDatas.APPR_INFO.TAX_ASSET_INFO[0].FIELDS.CURR_CODE.DEFAULT_VALUE = bdata.CURR_CODE;
        //现居国家是否为中国 为中国则把省市区打开
        let CUST_TAX_INFO_MODULE2 = _this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE2[0].FIELDS || {};
        let isChina = CUST_TAX_INFO_MODULE2.NATION_ENG.DEFAULT_VALUE == "CN";
        CUST_TAX_INFO_MODULE2.PROVINCE.FIELD_CONTROL = isChina ? "0" : "1";
        CUST_TAX_INFO_MODULE2.CITYCN.FIELD_CONTROL = isChina ? "0" : "1";
        CUST_TAX_INFO_MODULE2.DISTRICT_NAME.FIELD_CONTROL = isChina ? "0" : "1";
    },
    //--------------------------------------------------检查逻辑--------------------------------------------------
    //个人等涉税信息
    //客户涉税居民身份
    "CHECK_TAX_RESIDENT_TYPE": (_this, field, fieldData) => {
        let defaultValue = field.DEFAULT_VALUE || "";
        taxInfoTypeHideOrShow(_this)
        //税收居民身份类型“2-仅为非居民”时，税收居民国不能填写中国
        let CUST_TAX_INFO_MODULE4 = _this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE4 || [];
        _.each(CUST_TAX_INFO_MODULE4, item => {
            item.FIELDS.CITIZENSHIP.FIELD_DICT_FILTER = defaultValue == "2" ? "!CN" : [];
            if (item.FIELDS.CITIZENSHIP.DEFAULT_VALUE == "CN" && defaultValue == "2") {
                item.FIELDS.CITIZENSHIP.DEFAULT_VALUE = "";
            }
        })
        _this.removeFlowTip("notOpen");
       
        if (defaultValue == "1") {
            _this.$router.updateRoute(_this.$router.getCurrentRouteIndex(), "nextBtnText", "保存修改");
            
        }else{
            _this.$router.updateRoute(_this.$router.getCurrentRouteIndex(), "nextBtnText", "下一步");
        }
        //税收提示
        checkTaxInfoTip(_this);
    },
    //涉税号
    CHECK_TAX_ID: (_this, field, fieldData) => {
        let defaultValue = field.DEFAULT_VALUE || "";
        
        if (!defaultValue) {
            let arr = ["1", "2", "3"];
            let nowArr = [];
            let module = _.get(_this.groupDatas, _this.groupId + "." + field.moduleId, []);
            _.each(module, item => {
                let taxId = item.FIELDS[field.FIELD_ID].DEFAULT_VALUE;
                if (taxId) {
                    nowArr.push(taxId)
                }
            })
            field.DEFAULT_VALUE = _.difference(arr, nowArr)[0];
        }
    },
    //取得投资人声明标识按钮响应
    "CHECK_GET_INVEST_CERFLAG":(_this, field, fieldData) => {
    },
    //出生地址国
    "CHECK_BIRTH_NATION_ENG": (_this, field, fieldData) => {
        if (field.DEFAULT_VALUE == "CN") {
            fieldData.BIRTH_ADDRESS.showRegionSelector = true;
        } else {
            fieldData.BIRTH_ADDRESS.showRegionSelector = false;
        }
    },
    //是否有纳税人识别号
    "CHECK_HAS_TAXPAYER_IDNO":(_this, field,fieldData) =>{
        if(field.DEFAULT_VALUE == "1") {
            fieldData.TAXPAYER_IDNO.FIELD_CONTROL = "0";
            fieldData.OPP_NO_TAXPAYERID_REASON.FIELD_CONTROL = "1";
            fieldData.OPP_NO_TAXPAYERID_REASON.DEFAULT_VALUE = "";
            fieldData.NO_TAXPAYERID_REASON.FIELD_CONTROL = "1";
            fieldData.NO_TAXPAYERID_REASON.DEFAULT_VALUE = "";
        } 
        if (field.DEFAULT_VALUE == "0") {
            fieldData.TAXPAYER_IDNO.FIELD_CONTROL = "1"; //纳税人识别号
            fieldData.TAXPAYER_IDNO.DEFAULT_VALUE = "";
            fieldData.OPP_NO_TAXPAYERID_REASON.FIELD_CONTROL = "0"; 
        }
        taxInfoCheck(_this, fieldData)
    },
    "CHECK_CUSTTAXINFO_CITIZENSHIP": (_this, field, fieldData) => {
        if (field.DEFAULT_VALUE == "" && field.FIELD_REQUIRED == "0") {
            return
        }
    },
    //无纳税人识别号原因
    "CHECK_OPP_NO_TAXPAYERID_REASON":(_this, field,fieldData) =>{
        if(field.DEFAULT_VALUE == "1"){
            fieldData.NO_TAXPAYERID_REASON.FIELD_CONTROL = "1";
            fieldData.NO_TAXPAYERID_REASON.FIELD_REQUIRED = "0";
            fieldData.NO_TAXPAYERID_REASON.DEFAULT_VALUE = "";
        }
        if(field.DEFAULT_VALUE == "2"){
            fieldData.NO_TAXPAYERID_REASON.FIELD_CONTROL = "0"; 
            fieldData.NO_TAXPAYERID_REASON.FIELD_REQUIRED = "1"; 
        }
    },
    "CHECK_TAXPAYER_IDNO":(_this, field, fieldData) => {
        let citizenship = fieldData.CITIZENSHIP.DEFAULT_VALUE;
        if (fieldData.TAXPAYER_IDNO.currentValid == "blur" && _this.busiCode == "V0052" 
            && fieldData.TAXPAYER_IDNO.DEFAULT_VALUE != "" && citizenship != "") {
            let result = fieldData.TAXPAYER_IDNO.TAX_CHECK;
            if (result.CHKVALUE_TYPE == "0") {
                var arr = result.TAXPAYER_IDNO_CHKVALUE.split(";");
                if (arr.indexOf(""+ fieldData.TAXPAYER_IDNO.DEFAULT_VALUE.length) < 0) {
                    fieldData.TAXPAYER_IDNO.DEFAULT_VALUE = '';
                    _this.messageBox({
                        hasMask: true,
                        messageText: `您录入的纳税识别号位数不符合该税收居民国的纳税人识别号位数要求，请重新录入。`,
                        confirmButtonText: '确认',
                        typeMessage: 'warn',
                        showMsgBox: true,
                        confirmedAction: function () {}
                    });
                }
            } else if (result.CHKVALUE_TYPE == "1") {
                var arr = result.TAXPAYER_IDNO_CHKVALUE.split("-");
                if (fieldData.TAXPAYER_IDNO.DEFAULT_VALUE.length < parseInt(arr[0]) || fieldData.TAXPAYER_IDNO.DEFAULT_VALUE.length > parseInt(arr[1])) {
                    fieldData.TAXPAYER_IDNO.DEFAULT_VALUE = '';
                    _this.messageBox({
                        hasMask: true,
                        messageText: `您录入的纳税识别号位数不符合该税收居民国的纳税人识别号位数要求，请重新录入。`,
                        confirmButtonText: '确认',
                        typeMessage: 'warn',
                        showMsgBox: true,
                        confirmedAction: function () {}
                    });
                }
            }
        }
    },
    //未取得纳税人识别号原因
    "CHECK_NO_TAXPAYERID_REASON":(_this, field,fieldData) =>{
    },

    custTaxInfoAddModuleFinished: (_this, fieldData) => {
        if (_this.moduleId.indexOf("CUST_TAX_INFO_MODULE4") != -1) {
            _this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE4
            fieldData.FIELDS.TAX_ID.DEFAULT_VALUE = _this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE4.length + "";
           
        }
    },
    
    custTaxInfoDeleteModuleFinished :(_this,fieldData) =>{
        if(_this.moduleId.indexOf("CUST_TAX_INFO_MODULE4") != -1){
            _.forEach(_this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE5, function (obj,index) {
                for(let key in obj.FIELDS){
                    if(key == "CITIZENSHIP"){
                        obj.FIELDS[key].FIELD_TITLE = obj.FIELDS[key].FIELD_TITLE.split("地区")["0"] +("地区" + (index + 1));
                    }else{
                        obj.FIELDS[key].FIELD_TITLE = (obj.FIELDS[key].FIELD_TITLE).substring(0,obj.FIELDS[key].FIELD_TITLE.length -1) + (index + 1);
                    }
                }
            })
        }
    },
    


    // 现居国家
    "CHECK_TAX_LIVING_COUNTRY": function(_this, field, fieldData) {
        _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE2[0].FIELDS.ADDRESS.FIELD_CONTROL = "0";
        if(field.DEFAULT_VALUE == "CN") {
            _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE2[0].FIELDS.ADDRESS.FIELD_REQUIRED = "1"
        }else {
            _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE2[0].FIELDS.ADDRESS.FIELD_REQUIRED = "0"
        }
        _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE2[0].FIELDS.NATION_ENG.DEFAULT_VALUE = field.DEFAULT_VALUE;

    },
    
    CHECK_BIRTH_ADDRESS: (_this, field, fieldData) => {
        let addressTextInfo = parseAddress(field.DEFAULT_VALUE);
        let region = addressTextInfo[1] || [];
        region = region.join("");
        let regionChange = true;
        let addressChange = true;
        if (field.lastRegionValue == region) {
            regionChange = false;
        }
        if (field.lastAddressValue == field.DEFAULT_VALUE) {
            addressChange = false;
        }
        field.lastAddressValue = field.DEFAULT_VALUE;
        field.lastRegionValue = region;
        if(addressTextInfo[1].length == 3){
            let specialCity = ['北京市', '天津市', '上海市', '重庆市', '台湾省', '澳门特别行政区', '香港特别行政区'];
            let birthProvince = addressTextInfo[1][0];
            let birthCity = addressTextInfo[1][1];
            let addressText = _.cloneDeep(addressTextInfo[2]);
            if (regionChange) {
                addressText = "";
            }
            let birthAddress = addressTextInfo[1][2] + addressText
            if (addressTextInfo[1][2] == "不详") {
                birthAddress = addressText;
            }
            
            if (specialCity.indexOf(birthProvince) > -1 && ["不详", "市辖区", "辖县"].indexOf(birthCity) > -1) {
                birthCity = addressTextInfo[1][0];
                if (birthProvince == "台湾省") {
                    birthCity = "";
                }
            }
            if (regionChange) {
                fieldData.BIRTH_PROVINCE_ENG.DEFAULT_VALUE = stringPinyinConfig.ConvertPinyin(birthProvince);
                fieldData.BIRTH_CITY_ENG.DEFAULT_VALUE = stringPinyinConfig.ConvertPinyin(birthCity);
            }
            if (addressChange) {
                fieldData.BIRTH_ADDRESS_ENG.DEFAULT_VALUE = stringPinyinConfig.ConvertPinyin(birthAddress);
            }
        }   
    },
    "CHECK_TAX_BIRTHDAY": (_this, field, fieldData) => {},
    "CHECK_TAX_NAME_ENG": (_this, field, fieldData) => {},
    "CHECK_TAX_SURNAME_ENG": (_this, field, fieldData) => {},
    //国家
    "CHECK_NATION_ENG": (_this, field, fieldData) => {
        if (field.lastValue == field.DEFAULT_VALUE) {
            return;
        }
        field.lastValue = field.DEFAULT_VALUE;
        if (field.DEFAULT_VALUE == "") return
        if (field.DEFAULT_VALUE == "CN") {
            fieldData.ADDRESS.showRegionSelector = true;
            fieldData.PROVINCE.FIELD_CONTROL = "0";
            fieldData.CITYCN.FIELD_CONTROL = "0";
            fieldData.DISTRICT_NAME.FIELD_CONTROL = "0";
            fieldData.PROVINCE.FIELD_REQUIRED = "1";
            fieldData.CITYCN.FIELD_REQUIRED = "1";
            fieldData.DISTRICT_NAME.FIELD_REQUIRED = "1";                                         
        } else {
            fieldData.PROVINCE.FIELD_CONTROL = "1";
            fieldData.CITYCN.FIELD_CONTROL = "1";
            fieldData.DISTRICT_NAME.FIELD_CONTROL = "1";
            fieldData.PROVINCE.FIELD_REQUIRED = "0";
            fieldData.CITYCN.FIELD_REQUIRED = "0";
            fieldData.DISTRICT_NAME.FIELD_REQUIRED = "0";
            fieldData.PROVINCE.DEFAULT_VALUE = "";
            fieldData.CITYCN.DEFAULT_VALUE = "";
            fieldData.DISTRICT_NAME.DEFAULT_VALUE = "";
            fieldData.ADDRESS && (fieldData.ADDRESS.showRegionSelector = false);
        }
    },
    CHECK_CUST_TAX_INFO_MODULE2_ADDRESS: (_this, field, fieldData) => {
        let addressTextInfo = parseAddress(field.DEFAULT_VALUE);
        let region = addressTextInfo[1] || [];
        region = region.join("");
        let regionChange = true;
        let addressChange = true;
        if (field.lastRegionValue == region) {
            regionChange = false;
        }
        if (field.lastAddressValue == field.DEFAULT_VALUE) {
            addressChange = false;
        }
        field.lastAddressValue = field.DEFAULT_VALUE;
        field.lastRegionValue = region;
        if(addressTextInfo[1].length == 3){
            let specialCity = ['北京市', '天津市', '上海市', '重庆市', '台湾省', '澳门特别行政区', '香港特别行政区'];
            let birthProvince = addressTextInfo[1][0];
            let birthCity = addressTextInfo[1][1];
            let addressText = _.cloneDeep(addressTextInfo[2]);
                
            if ((regionChange && fieldData.PROVINCE.FIELD_CONTROL == "0") || (_.isEmpty(fieldData.PROVINCE.DEFAULT_VALUE) && fieldData.PROVINCE.FIELD_CONTROL == "0")) {
                let proDictFilter = _.chain(fieldData.PROVINCE.FIELD_DICT_NAME).filter(v => {
                    return v.DICT_ITEM_NAME == addressTextInfo[1][0];
                }).map(v => {
                    return v.DICT_ITEM;
                }).value();
                (fieldData.PROVINCE.DEFAULT_VALUE = proDictFilter && proDictFilter.length && proDictFilter[0] || "");
            }
            let provinceDefault = fieldData.PROVINCE.DEFAULT_VALUE || "";
            if ((regionChange && fieldData.CITYCN.FIELD_CONTROL == "0") || (_.isEmpty(fieldData.CITYCN.DEFAULT_VALUE) && fieldData.CITYCN.FIELD_CONTROL == "0")) {
                let cityDictFilter = _.chain(fieldData.CITYCN.FIELD_DICT_NAME).filter(v => {
                    return (v.DICT_ITEM.substring(0, 2) == provinceDefault.substring(0, 2)) && (v.DICT_ITEM_NAME == (addressTextInfo[1][1] == "市辖区" ? addressTextInfo[1][0] : addressTextInfo[1][1] ));
                }).map(v => {
                    return v.DICT_ITEM;
                }).value();
                fieldData.CITYCN.DEFAULT_VALUE = cityDictFilter && cityDictFilter.length && cityDictFilter[0] || "";    
            }
            if ((regionChange && fieldData.DISTRICT_NAME.FIELD_CONTROL == "0") || (_.isEmpty(fieldData.DISTRICT_NAME.DEFAULT_VALUE) && fieldData.DISTRICT_NAME.FIELD_CONTROL == "0")) { 
                let disDictFilter = _.chain(fieldData.DISTRICT_NAME.FIELD_DICT_NAME).filter(v => {
                    return (v.DICT_ITEM.substring(0, 2) == provinceDefault.substring(0, 2)) && (v.DICT_ITEM_NAME == addressTextInfo[1][2]);
                }).map(v => {
                    return v.DICT_ITEM;
                }).value();
                fieldData.DISTRICT_NAME.DEFAULT_VALUE = disDictFilter && disDictFilter.length && disDictFilter[0] || "";
            }
            if (regionChange) {
                addressText = "";
            }
            let birthAddress = addressTextInfo[1][2] + addressText
            if (addressTextInfo[1][2] == "不详") {
                birthAddress = addressText;
            }
            
            if (specialCity.indexOf(birthProvince) > -1 && ["不详", "市辖区", "辖县"].indexOf(birthCity) > -1) {
                birthCity = addressTextInfo[1][0];
                if (birthProvince == "台湾省") {
                    birthCity = "";
                }
            }
            if (regionChange) {
                fieldData.PROVINCE_ENG.DEFAULT_VALUE = stringPinyinConfig.ConvertPinyin(birthProvince);
                fieldData.CITY_ENG.DEFAULT_VALUE = stringPinyinConfig.ConvertPinyin(birthCity);
            }
            if (addressChange) {
                fieldData.ADDRESS_ENG.DEFAULT_VALUE = stringPinyinConfig.ConvertPinyin(birthAddress);
            }
        }
                                                        
    },
    
    "CHECK_PROVINCE": (_this, field, fieldData) => {
        let dictFilter = _.chain(fieldData.CITYCN.FIELD_DICT_NAME).filter(v => {
            return v.DICT_ITEM.substring(0, 2) == field.DEFAULT_VALUE.substring(0, 2);
        }).map(v => {
            return v.DICT_ITEM;
        }).value();
        fieldData.CITYCN.FIELD_DICT_FILTER = dictFilter;
        if (fieldData.CITYCN.FIELD_DICT_FILTER.indexOf(fieldData.CITYCN.DEFAULT_VALUE) == -1) {
            fieldData.CITYCN.DEFAULT_VALUE = "";
        }
    },
    "CHECK_CITYCN": (_this, field, fieldData) => {
        let specialCity = ['110000', '120000', '310000', '500000']; //四个直辖市
        let dictFilter = _.chain(fieldData.DISTRICT_NAME.FIELD_DICT_NAME).filter(v => {
            if (specialCity.indexOf(field.DEFAULT_VALUE) != -1) {
                return v.DICT_ITEM.substring(0, 2) == field.DEFAULT_VALUE.substring(0, 2);
            } else {
                return v.DICT_ITEM.substring(0, 4) == field.DEFAULT_VALUE.substring(0, 4);
            }
        }).map(v => {
            return v.DICT_ITEM;
        }).value();
        fieldData.DISTRICT_NAME.FIELD_DICT_FILTER = dictFilter;
        if (fieldData.DISTRICT_NAME.FIELD_DICT_FILTER.indexOf(fieldData.DISTRICT_NAME.DEFAULT_VALUE) == -1) {
            fieldData.DISTRICT_NAME.DEFAULT_VALUE = "";
        }
        // 选择了市区代码， 但是过滤之后没有县区代码，则将县区代码置灰并且修改为非必填
        if (field.DEFAULT_VALUE != "") {
            if (dictFilter.length == 0) {
                fieldData.DISTRICT_NAME.FIELD_REQUIRED = '0'
                fieldData.DISTRICT_NAME.FIELD_CONTROL = '2'
            } else {
                fieldData.DISTRICT_NAME.FIELD_REQUIRED = '1'
                fieldData.DISTRICT_NAME.FIELD_CONTROL = '0'
            }
        }
    },
    "CHECK_DISTRICT_NAME": (_this, field, fieldData) => {
    },
    CHECK_REG_COUNTRY: (_this, field, fieldData) => {
        isTaxBasicInfoSame(_this, fieldData);
    },
    CHECK_SURNAME_ENG: (_this, field, fieldData) => {
        isTaxBasicInfoSame(_this, fieldData);
    },
    CHECK_NAME_ENG: (_this, field, fieldData) => {
        isTaxBasicInfoSame(_this, fieldData);
    },
    CHECK_TAX_CITIZENSHIP: (_this, field, fieldData) => {
        if(stringConfig.isEmptyStr(field.DEFAULT_VALUE)){
            return;
        }
        if(_this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE4.length > 1){
            if(_this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE4.length == 2){
               if(_this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE4[0].FIELDS.CITIZENSHIP.DEFAULT_VALUE == _this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE4[1].FIELDS.CITIZENSHIP.DEFAULT_VALUE && stringConfig.isNotEmptyStr(_this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE4[0].FIELDS.CITIZENSHIP.DEFAULT_VALUE)&&stringConfig.isNotEmptyStr(_this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE4[1].FIELDS.CITIZENSHIP.DEFAULT_VALUE)){
                    _this.$refs.flowTip.pushFlowTip({
                        title:`已存在"` + _this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE4[0].FIELDS.CITIZENSHIP.DEFAULT_VALUE + "-" +bizPublicMethod.$blMethod.getFieldValueName(field.FIELD_DICT_NAME,_this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE4[0].FIELDS.CITIZENSHIP.DEFAULT_VALUE) + `"纳税信息，不能重复添加！`,
                        type:'warning',
                        key:'sameEnShip'
                    });
                    field.DEFAULT_VALUE = "";
                }else if(_this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE4[0].FIELDS.CITIZENSHIP.DEFAULT_VALUE != _this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE4[1].FIELDS.CITIZENSHIP.DEFAULT_VALUE && stringConfig.isNotEmptyStr(_this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE4[0].FIELDS.CITIZENSHIP.DEFAULT_VALUE)&&stringConfig.isNotEmptyStr(_this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE4[1].FIELDS.CITIZENSHIP.DEFAULT_VALUE)){
                    _this.removeFlowTip("sameEnShip");
                }

            }else if(_this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE4.length == 3){
                if(_this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE4[0].FIELDS.CITIZENSHIP.DEFAULT_VALUE == _this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE4[1].FIELDS.CITIZENSHIP.DEFAULT_VALUE && stringConfig.isNotEmptyStr(_this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE4[0].FIELDS.CITIZENSHIP.DEFAULT_VALUE)&&stringConfig.isNotEmptyStr(_this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE4[1].FIELDS.CITIZENSHIP.DEFAULT_VALUE)){
                    _this.$refs.flowTip.pushFlowTip({
                        title:`已存在"` + _this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE4[0].FIELDS.CITIZENSHIP.DEFAULT_VALUE + "-"+ bizPublicMethod.$blMethod.getFieldValueName(field.FIELD_DICT_NAME,_this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE4[0].FIELDS.CITIZENSHIP.DEFAULT_VALUE)  + `"纳税信息，不能重复添加！`,
                        type:'warning',
                        key:'sameEnShip'
                    });
                    field.DEFAULT_VALUE = "";
                }else if(_this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE4[0].FIELDS.CITIZENSHIP.DEFAULT_VALUE == _this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE4[2].FIELDS.CITIZENSHIP.DEFAULT_VALUE && stringConfig.isNotEmptyStr(_this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE4[0].FIELDS.CITIZENSHIP.DEFAULT_VALUE)&&stringConfig.isNotEmptyStr(_this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE4[2].FIELDS.CITIZENSHIP.DEFAULT_VALUE)){
                    _this.$refs.flowTip.pushFlowTip({
                        title:`已存在"` + _this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE4[0].FIELDS.CITIZENSHIP.DEFAULT_VALUE + "-"+  bizPublicMethod.$blMethod.getFieldValueName(field.FIELD_DICT_NAME,_this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE4[0].FIELDS.CITIZENSHIP.DEFAULT_VALUE)  + `"纳税信息，不能重复添加！`,
                        type:'warning',
                        key:'sameEnShip'
                    });
                    field.DEFAULT_VALUE = "";
                }else if(_this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE4[1].FIELDS.CITIZENSHIP.DEFAULT_VALUE == _this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE4[2].FIELDS.CITIZENSHIP.DEFAULT_VALUE && stringConfig.isNotEmptyStr(_this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE4[1].FIELDS.CITIZENSHIP.DEFAULT_VALUE)&&stringConfig.isNotEmptyStr(_this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE4[2].FIELDS.CITIZENSHIP.DEFAULT_VALUE)){
                    _this.$refs.flowTip.pushFlowTip({
                        title:`已存在"` + _this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE4[1].FIELDS.CITIZENSHIP.DEFAULT_VALUE + "-"+ bizPublicMethod.$blMethod.getFieldValueName(field.FIELD_DICT_NAME,_this.groupDatas.APPR_INFO.CUST_TAX_INFO_MODULE4[1].FIELDS.CITIZENSHIP.DEFAULT_VALUE)  + `"纳税信息，不能重复添加！`,
                        type:'warning',
                        key:'sameEnShip'
                    });
                    field.DEFAULT_VALUE = "";
                }else {
                    _this.removeFlowTip("sameEnShip");
                }
            }
        }
        fieldData.TAXPAYER_IDNO.DEFAULT_VALUE = "";
        taxInfoCheck(_this, fieldData)
    }
}
const checkTaxInfoTip = (_this) => {
    let ORG_TAX_INFO = _this.groupDatas.APPR_INFO.ORG_TAX_INFO[0].FIELDS;
    let TAX_RESIDENT_TYPE = _.get(ORG_TAX_INFO, "TAX_RESIDENT_TYPE.DEFAULT_VALUE", "");
    let taxInfo = getOldTaxInfo(_this);
    let CUST_CARD_INFO = _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].FIELDS;
    let idType = CUST_CARD_INFO.ID_TYPE.DEFAULT_VALUE || "";
    if ((TAX_RESIDENT_TYPE == "1"  || TAX_RESIDENT_TYPE == "3") && idType != "00") {
        //证件类型不为“身份证”，且税收身份由空/非居民修改为中国税收居民身份/既是中国税收居民又是非居民时
        if( !taxInfo.TAX_RESIDENT_TYPE || taxInfo.TAX_RESIDENT_TYPE == "2" ){
            _this.pushFlowTip({
                title: "稍后需采集您的中国税收居民身份证明，请您继续办理。",
                type: "warning",
                key: "checkTaxInfoTip"
            });
            return
        }
    }
    _this.removeFlowTip("checkTaxInfoTip")
}
//根据税收居民身份 隐藏显示模块
const taxInfoTypeHideOrShow = (_this) => {
    let ORG_TAX_INFO = _this.groupDatas.APPR_INFO.ORG_TAX_INFO[0].FIELDS;
    let typeDefalutValue = ORG_TAX_INFO.TAX_RESIDENT_TYPE.DEFAULT_VALUE;
    bizPublicMethod.$blMethod.hideRouteAndMoudle(_this, "客户出生信息/现居国家信息");
    bizPublicMethod.$blMethod.hideRouteAndMoudle(_this, "税收居民国/地区信息");
    if (typeDefalutValue && typeDefalutValue != "1" && typeDefalutValue != "5") {
        bizPublicMethod.$blMethod.showRouteAndMoudle(_this, "客户出生信息/现居国家信息");
        bizPublicMethod.$blMethod.showRouteAndMoudle(_this, "税收居民国/地区信息");
    }
}
//判断是否与身份证件信息一致
const isTaxBasicInfoSame = (_this, fieldData) => {
    let CUST_CARD_INFO = _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].FIELDS;
    let CUST_EXPERIENCE_INFO = _this.groupDatas.CUST_INFO.CUST_EXPERIENCE_INFO[0].FIELDS;
    let nameObj = stringConfig.getFirstName(CUST_CARD_INFO.CUST_FNAME.DEFAULT_VALUE);//过滤姓
    let custBasicInfoNameEng = stringPinyinConfig.ConvertPinyin(_.get(nameObj, "[1]", ""));
    let custBasicInfoSurnameEng = stringPinyinConfig.ConvertPinyin(_.get(nameObj, "[0]", ""));

    let CITIZENSHIP_DICT = CUST_EXPERIENCE_INFO.CITIZENSHIP.FIELD_DICT_NAME;
    let CITIZENSHIP = CUST_EXPERIENCE_INFO.CITIZENSHIP.DEFAULT_VALUE;
    let CITIZENSHIP_DICT_ITEM_NAME = _.get(_.find(CITIZENSHIP_DICT, {DICT_ITEM: CITIZENSHIP}), "DICT_ITEM_NAME", ""); 
    let custBasicInfoCitizenship = CITIZENSHIP_DICT_ITEM_NAME;

    let taxBasicInfoNameEng = fieldData.NAME_ENG.DEFAULT_VALUE || "";
    let taxBasicInfoSurnameEng = fieldData.SURNAME_ENG.DEFAULT_VALUE || "";
    let regCountryValue = fieldData.REG_COUNTRY.DEFAULT_VALUE || "";
    let REG_COUNTRY_DICT = fieldData.REG_COUNTRY.FIELD_DICT_NAME;
    let  REG_COUNTRY_DICT_ITEM_NAME = _.get(_.find(REG_COUNTRY_DICT, {DICT_ITEM: regCountryValue}), "DICT_ITEM_NAME", ""); 
    let taxBasicInfoRegCountry = REG_COUNTRY_DICT_ITEM_NAME;
    if (custBasicInfoNameEng != taxBasicInfoNameEng || custBasicInfoSurnameEng != taxBasicInfoSurnameEng || custBasicInfoCitizenship != taxBasicInfoRegCountry) {
        //不触发清空
        _this.oppBusiData.isSaveTaxBasicInfo = true;
        fieldData.MODULE_RADIO_BUTTON.DEFAULT_VALUE = "false"
    } else {
        fieldData.MODULE_RADIO_BUTTON.DEFAULT_VALUE = "true"
    }
}
// 涉税信息勾稽关系检查
const taxInfoCheck = (_this, fieldData) => {
    let citizenship = fieldData.CITIZENSHIP.DEFAULT_VALUE;
    if (citizenship && _this.busiCode == 'V0052') {
        return _this.$syscfg.K_Request("W0000001", {
            YGT_SERVICE_CODE: "F0903604",
            CITIZENSHIP: citizenship,
            USER_TYPE: _this.userType
        }).then(res => {
            // 勾稽关系配置
            let result = _.get(res, "Data[0]", {});
            setFieldsAtt(_this, fieldData, "TAX_INFO_TIP", "FIELD_CONTROL", "1");
            setFieldsAtt(_this, fieldData, "TAX_INFO_TIP1", "FIELD_CONTROL", "1");
            // 黑名单
            if(result && result.BLACK_FLAG == "1") {
                let citizenshipObj = _.find(fieldData.CITIZENSHIP.FIELD_DICT_NAME, item => {
                    return item.DICT_ITEM == citizenship
                })
                setFieldsAtt(_this, fieldData, "TAX_INFO_TIP", "FIELD_CONTROL", "0");
                setFieldsAtt(_this, fieldData, "TAX_INFO_TIP", "DEFAULT_VALUE", "您选择的税收居民国【" + citizenshipObj.DICT_ITEM_NAME + "】为高风险国家（地区），请您确认勾选是否正确。");
            }
            // 是否有纳税人识别号配置为有 界面选择无
            if(result && result.TAXPAYER_IDNO_FLAG == "1" && fieldData.HAS_TAXPAYER_IDNO.DEFAULT_VALUE == "0") {
                setFieldsAtt(_this, fieldData, "TAX_INFO_TIP1", "FIELD_CONTROL", "0");
                setFieldsAtt(_this, fieldData, "TAX_INFO_TIP1", "DEFAULT_VALUE", "该税收居民国向所有税收居民发放纳税人识别号，请您确认勾选是否正确。");
            }
            // 录入纳税人识别号不符合配置
            if(result && result.TAXPAYER_IDNO_CHKVALUE != "") {
                fieldData.TAXPAYER_IDNO.TAX_CHECK = result;
            } else {
                fieldData.TAXPAYER_IDNO.TAX_CHECK = undefined;
            }
        })
    }
}
//字段属性设置
const setFieldsAtt = (_this, FIELDS, fieldId, att, value) => {
    let field = _.get(FIELDS, fieldId, {});
    if (!_.isEmpty(field)) {
        FIELDS[fieldId][att] = value;
    }
}