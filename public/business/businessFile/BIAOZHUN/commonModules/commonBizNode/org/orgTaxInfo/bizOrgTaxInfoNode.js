/*
 *   机构涉税信息模块
 *   方法封装
 *   @author linsc
 */
import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../businessTools/bizPublicMethod.js"
import stringPinyinConfig from '../../../../../../../tools/stringPinyinConfig.js'
import { parseAddress } from "../../../../../../../tools/util" //地址解析组件

const getOldTaxInfo = (_this) => {
    let info = _.get(_this.oppBusiData, "oldBusiData.CUST_TAX_INFO", {});
    if (_.isEmpty(info)) {
        return {};
    }
    info = _.mapValues(info, _.trim);
    if ( _.isEmpty(info.CITIZENSHIP) || ["1", "5"].indexOf(info.TAX_RESIDENT_TYPE) > -1) {
        info.CITIZENSHIP = "";
        info.HAS_TAXPAYER_IDNO = "";
        info.TAXPAYER_IDNO = "";
        info.OPP_NO_TAXPAYERID_REASON = "";
        info.NO_TAXER_ID_REASON1 = "";
        info.NO_TAXPAYERID_REASON = "";
        info.NO_ACCESS_ID_REASON1 = "";
    }
    if ( _.isEmpty(info.CITIZENSHIP2) || ["1", "5"].indexOf(info.TAX_RESIDENT_TYPE) > -1) {
        info.CITIZENSHIP2 = "";
        info.HAS_TAXPAYER_IDNO2 = "";
        info.TAXPAYER_IDNO2 = "";
        info.OPP_NO_TAXPAYERID_REASON2 = "";
        info.NO_TAXER_ID_REASON2 = "";
        info.NO_TAXPAYERID_REASON2 = "";
        info.NO_ACCESS_ID_REASON2 = "";
    }
    if ( _.isEmpty(info.CITIZENSHIP3) || ["1", "5"].indexOf(info.TAX_RESIDENT_TYPE) > -1) {
        info.CITIZENSHIP3 = "";
        info.HAS_TAXPAYER_IDNO3 = "";
        info.TAXPAYER_IDNO3 = "";
        info.OPP_NO_TAXPAYERID_REASON3 = "";
        info.NO_TAXER_ID_REASON3 = "";
        info.NO_TAXPAYERID_REASON3 = "";
        info.NO_ACCESS_ID_REASON3 = "";
    }
    if (["1", "5"].indexOf(info.TAX_RESIDENT_TYPE) > -1 && info.PASSIVE_NFE != "1") {
        info.BIRTH_ADDRESS = "";
        info.ADDRESS = "";
    }
    if (["5"].indexOf(info.TAX_RESIDENT_TYPE) == -1) {
        info.NO_CHK_ORG = "";
    }
    //如果现居国家为非中国 省市区代码为空
    if (info.NATION_ENG != "CN") {
        info.PROVINCE = "";
        info.CITYCN = "";
        info.DISTRICT_NAME = "";
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
/**
 *custTaxInfoModuleParseOppBiz 重新加载转换之后的历史数据
* @param _this
*/
const custTaxInfoModuleParseOppBiz = (_this, bdata) => {
    
    bizPublicMethod.$blMethod.parseGroupsMouduleData(_this,[
        "ORG_TAX_INFO",
        "ORG_TAX_BASIC_INFO",
    ],bdata);
    bizPublicMethod.$blMethod.parseTaxWithTaxPayerData(_this, "TAX_INFO", "ORG_TAX_COUNTRY_INFO", bdata);

    //现居国家是否为中国 为中国则把省市区打开
    let ORG_TAX_BASIC_INFO = _this.groupDatas.TAX_INFO.ORG_TAX_BASIC_INFO[0].FIELDS || {};
    let isChina = ORG_TAX_BASIC_INFO.NATION_ENG.DEFAULT_VALUE == "CN";
    ORG_TAX_BASIC_INFO.PROVINCE.FIELD_CONTROL = isChina ? "0" : "1";
    ORG_TAX_BASIC_INFO.CITYCN.FIELD_CONTROL = isChina ? "0" : "1";
    ORG_TAX_BASIC_INFO.DISTRICT_NAME.FIELD_CONTROL = isChina ? "0" : "1";
}
const bizOrgTaxInfoNodeBeforeLoadBizCommon = function (_this) {
    let CITIZENSHIP_ST_DICT = _.get(_this.oppBusiData, "dictAll.CITIZENSHIP_ST", ""); 

    //客户涉税信息
    let ORG_TAX_INFO = _this.groupDatas.TAX_INFO.ORG_TAX_INFO[0].FIELDS;
    setFieldsAtt(_this, ORG_TAX_INFO, "TAX_RESIDENT_TYPE", "FIELED_CHECKBOX_BOTTON", true);
    setFieldsAtt(_this, ORG_TAX_INFO, "TAX_RESIDENT_TYPE", "FIELD_RADIO_TYPE", false);
    setFieldsAtt(_this, ORG_TAX_INFO, "TAX_RESIDENT_TYPE", "labelWidth", 280);
    setFieldsAtt(_this, ORG_TAX_INFO, "PASSIVE_NFE", "FIELED_CHECKBOX_BOTTON", true);
    setFieldsAtt(_this, ORG_TAX_INFO, "PASSIVE_NFE", "FIELD_RADIO_TYPE", false);
    setFieldsAtt(_this, ORG_TAX_INFO, "PASSIVE_NFE", "labelWidth", 280);
    setFieldsAtt(_this, ORG_TAX_INFO, "NO_CHK_ORG", "labelWidth", 280);

    //税收居民基本信息
    let ORG_TAX_BASIC_INFO = _this.groupDatas.TAX_INFO.ORG_TAX_BASIC_INFO[0].FIELDS;
    let addressTypeDict = [
            {DICT_ITEM_NAME: "0-办公地址", DICT_ITEM: "0"},
            {DICT_ITEM_NAME: "1-注册地址", DICT_ITEM: "1"}
    ]
    setFieldsAtt(_this, ORG_TAX_BASIC_INFO, "ADDRESS_TYPE", "FIELD_DICT_NAME", addressTypeDict);
    setFieldsAtt(_this, ORG_TAX_BASIC_INFO, "PROVINCE", "showDictItem", "1");
    setFieldsAtt(_this, ORG_TAX_BASIC_INFO, "CITYCN", "showDictItem", "1");
    setFieldsAtt(_this, ORG_TAX_BASIC_INFO, "DISTRICT_NAME", "showDictItem", "1");
    setFieldsAtt(_this, ORG_TAX_BASIC_INFO, "NATION_ENG", "showDictItem", "1");
    setFieldsAtt(_this, ORG_TAX_BASIC_INFO, "ADDRESS", "VALID_TYPE", "addressLength[16,128]");
    setFieldsAtt(_this, ORG_TAX_BASIC_INFO, "PROVINCE_ENG", "VALID_TYPE", "en_name_addr[1,256]");
    setFieldsAtt(_this, ORG_TAX_BASIC_INFO, "CITY_ENG", "VALID_TYPE", "en_name_addr[1,256]");
    
    
    
    
    _this.groupDatas.TAX_INFO.ORG_TAX_BASIC_INFO.forEach(function(moduleItem){
        for (let key in moduleItem.FIELDS) {
            moduleItem.FIELDS[key].labelWidth = 290;
        }
    })
    
    //税收居民国/地区信息
    let ORG_TAX_COUNTRY_INFO = _this.groupDatas.TAX_INFO.ORG_TAX_COUNTRY_INFO[0].FIELDS;
    _this.groupDatas.TAX_INFO.ORG_TAX_COUNTRY_INFO.forEach(function(moduleItem){
        for (let key in moduleItem.FIELDS) {
            moduleItem.FIELDS[key].labelWidth = 280;
        }
    })

    setFieldsAtt(_this, ORG_TAX_COUNTRY_INFO, "CITIZENSHIP", "FIELD_DICT_NAME", CITIZENSHIP_ST_DICT);
    setFieldsAtt(_this, ORG_TAX_COUNTRY_INFO, "CITIZENSHIP", "showDictItem", "1");

    _this.groupDatasTpl.TAX_INFO.ORG_TAX_COUNTRY_INFO[0] = _.cloneDeep(_this.groupDatas.TAX_INFO.ORG_TAX_COUNTRY_INFO[0]);

    // 重新加载 省、市、县区代码信息
    let addrDict = {
        PROVINCE_DATA: ORG_TAX_BASIC_INFO.PROVINCE.FIELD_DICT_NAME,
        CITICN_DATA: ORG_TAX_BASIC_INFO.CITYCN.FIELD_DICT_NAME,
        DISTRICT_DATA: ORG_TAX_BASIC_INFO.DISTRICT_NAME.FIELD_DICT_NAME,
    }
    let addrDictTran = dealWithProvinceAndCityData(_this, addrDict)
    setFieldsAtt(_this, ORG_TAX_BASIC_INFO, "PROVINCE", "FIELD_DICT_NAME", addrDictTran.PROVINCE_DATA);
    setFieldsAtt(_this, ORG_TAX_BASIC_INFO, "CITYCN", "FIELD_DICT_NAME", addrDictTran.CITICN_DATA);
    setFieldsAtt(_this, ORG_TAX_BASIC_INFO, "DISTRICT_NAME", "FIELD_DICT_NAME", addrDictTran.DISTRICT_DATA);
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
export default {
    bizOrgTaxInfoNodeBeforeLoadBiz: function (_this) {
        bizOrgTaxInfoNodeBeforeLoadBizCommon(_this);
        let oldData = getOldTaxInfo(_this);
        custTaxInfoModuleParseOppBiz(_this, oldData);
    },
    bizOrgTaxInfoNodeBeforeLoadBizOpenAcct: function (_this) {
        bizOrgTaxInfoNodeBeforeLoadBizCommon(_this);
    },
    bizOrgTaxInfoNodeAfterLoadBiz: function (_this) {
        //涉税信息税收居民国回填
        let historyData = _.cloneDeep(_this.historyData);
        let custTaxInfo = _.get(historyData, "taxInfoArr[0]")  ||  {};
        if (!_.isEmpty(custTaxInfo)) {
            if (custTaxInfo.HAS_TAXPAYER_IDNO == "0" || custTaxInfo.HAS_TAXPAYER_IDNO == "") {
                custTaxInfo.TAXPAYER_IDNO = "";
            }
            if (custTaxInfo.HAS_TAXPAYER_IDNO2 == "0" || custTaxInfo.HAS_TAXPAYER_IDNO2 == "") {
                custTaxInfo.TAXPAYER_IDNO2 = "";
            }
            if (custTaxInfo.HAS_TAXPAYER_IDNO3 == "0" || custTaxInfo.HAS_TAXPAYER_IDNO3 == "") {
                custTaxInfo.TAXPAYER_IDNO3 = "";
            }
            bizPublicMethod.$blMethod.parseTaxWithTaxPayerData(_this, "TAX_INFO", "ORG_TAX_COUNTRY_INFO", custTaxInfo);
            _this.groupDatas.TAX_INFO.ORG_TAX_BASIC_INFO[0].FIELDS.ADDRESS.newAddressVal = custTaxInfo.ADDRESS;
        }
        taxResidentTypeAndPassiveDetail(_this);
        bizPublicMethod.$blMethod.hideRouteAndMoudle(_this, "控制人涉税居民身份信息");
        bizPublicMethod.$blMethod.hideRouteAndMoudle(_this, "控制人出生信息");
        bizPublicMethod.$blMethod.hideRouteAndMoudle(_this, "控制人税收信息");
        bizPublicMethod.$blMethod.hideRouteAndMoudle(_this, "控制人税收联系地址");
        setFilterCitizenship(_this);
    },
    bizOrgTaxInfoNodeValidate: function (_this) {
        let ORG_TAX_INFO = _this.groupDatas.TAX_INFO.ORG_TAX_INFO[0];
        let ORG_TAX_BASIC_INFO = _this.groupDatas.TAX_INFO.ORG_TAX_BASIC_INFO[0];
        let ORG_TAX_COUNTRY_INFO = _this.groupDatas.TAX_INFO.ORG_TAX_COUNTRY_INFO;
        let oldData = getOldTaxInfo(_this);
        let newTaxResidentType = ORG_TAX_INFO.FIELDS.TAX_RESIDENT_TYPE.DEFAULT_VALUE || "";
        let newPassiveNFE = ORG_TAX_INFO.FIELDS.PASSIVE_NFE.DEFAULT_VALUE || "";
        let oldTaxResidentType = oldData.TAX_RESIDENT_TYPE || "";
        let oldPassiveNFE = oldData.PASSIVE_NFE || "";
        if (ORG_TAX_INFO.FIELDS.NO_CHK_ORG.FIELD_CONTROL == "1") {
            ORG_TAX_INFO.FIELDS.NO_CHK_ORG.DEFAULT_VALUE = "";
        }
        if (ORG_TAX_BASIC_INFO.MODULE_CONTROL == "0") {
            //隐藏模块数据清空
            _.each(ORG_TAX_BASIC_INFO.FIELDS, (item, key) => {
                ORG_TAX_BASIC_INFO.FIELDS[key].DEFAULT_VALUE = "";
            })
            let isOpenAcct = _this.$storage.getSession(_this.$definecfg.IS_OPEN_ACCT_BIZ) || "";
            //非开户 隐藏模块 且未修改 税收居民身份 、 消极非金融机构标识 数据还原为老数据 保证数据不变
            if (isOpenAcct != "0" && newTaxResidentType && newTaxResidentType == oldTaxResidentType && newPassiveNFE == oldPassiveNFE) {
                bizPublicMethod.$blMethod.parseGroupsMouduleData(_this,[
                    "ORG_TAX_BASIC_INFO",
                ], oldData);
            }
        }
        if(ORG_TAX_COUNTRY_INFO[0].MODULE_CONTROL == "0") {
            ORG_TAX_COUNTRY_INFO.splice(1, ORG_TAX_COUNTRY_INFO.length || 0);
            _.each(ORG_TAX_COUNTRY_INFO[0].FIELDS, (item, key) => {
                ORG_TAX_COUNTRY_INFO[0].FIELDS[key].DEFAULT_VALUE = "";
            })
            let isOpenAcct = _this.$storage.getSession(_this.$definecfg.IS_OPEN_ACCT_BIZ) || "";
            //非开户 隐藏模块 且未修改 税收居民身份 、 消极非金融机构标识 数据还原为老数据 保证数据不变
            if (isOpenAcct != "0" && newTaxResidentType && newTaxResidentType == oldTaxResidentType && newPassiveNFE == oldPassiveNFE) {
                bizPublicMethod.$blMethod.parseTaxWithTaxPayerData(_this, "TAX_INFO", "ORG_TAX_COUNTRY_INFO", oldData);
            }
        }
        return true;
    },
    bizOrgTaxInfoNodePageActivated: function (_this) {
        let isOpenAcct = _this.$storage.getSession(_this.$definecfg.IS_OPEN_ACCT_BIZ) || "";
        if (isOpenAcct == "0") {
            if (_this.moduleId && _this.moduleId.indexOf("ORG_TAX_INFO") > -1)
            _this.pushFlowTip({
                title: "请选择您的税收声明信息",
                key: "taxInfoTip",
                type: 'warning'
            })
        }
    },
    bizOrgTaxInfoNodeBeforeSave: function (_this, params) {
        let custTaxInfo = {};
        let taxCountryObj = _.cloneDeep( _this.$blMethod.getEmptyTaxCountry());

        let ORG_TAX_INFO = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "ORG_TAX_INFO");
        let ORG_TAX_BASIC_INFO = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "ORG_TAX_BASIC_INFO");
        let ORG_TAX_COUNTRY_INFO = bizPublicSaveMethod.getModuleArrFoyKey(_this, "ORG_TAX_COUNTRY_INFO", true);

        let orgTaxInfoFields = _this.groupDatas.TAX_INFO.ORG_TAX_INFO[0].FIELDS;
        let orgTaxBasicInfoFields = _this.groupDatas.TAX_INFO.ORG_TAX_BASIC_INFO[0].FIELDS;
        let orgTaxCountryInfo = _this.groupDatas.TAX_INFO.ORG_TAX_COUNTRY_INFO[0].FIELDS;
        let fieldsAll = _.assign({}, orgTaxInfoFields, orgTaxBasicInfoFields, orgTaxCountryInfo);
        let TAX_RESIDENT_TYPE = ORG_TAX_INFO.TAX_RESIDENT_TYPE || "";

        //获取id_code
        let docInfo = _this.groupDatas.ORG_INFO.DOC_INFO[0].FIELDS;
        let idCode = docInfo.ID_CODE.DEFAULT_VALUE || "";

        //地址去除不详市辖区辖县
        ORG_TAX_BASIC_INFO.ADDRESS = orgTaxBasicInfoFields.ADDRESS.newAddressVal || ORG_TAX_BASIC_INFO.ADDRESS;
        let otherParams = {
            //修改同步字段，避免账户系统CRS非居民涉税信息导出报送出错
            LIVING_COUNTRY: ORG_TAX_BASIC_INFO.NATION_ENG,
            CITYEN: ORG_TAX_BASIC_INFO.CITY_ENG,
            // 是否控制人标志：非控制人，默认为0
            CTRL_FLAG: "0", 
            // 控制人编号：非控制人，默认为0
            CTRL_NO: "0",
            CTRL_NON_RESIDENT: "", 
        }
        //如果HAS_TAXPAYER_IDNO 为0-无纳税人识别号的时候 TAXPAYER_IDNO 为机构id_code
        _.each(ORG_TAX_COUNTRY_INFO, countryInfoItem => {
            if (countryInfoItem.HAS_TAXPAYER_IDNO == "0") {
                countryInfoItem.TAXPAYER_IDNO = idCode || "";
            }
        })
        custTaxInfo = _.assign(
            {},
            ORG_TAX_INFO,
            ORG_TAX_BASIC_INFO,
            otherParams,
            taxCountryObj,
            _this.$blMethod.transTaxInfoToObj(ORG_TAX_COUNTRY_INFO),
        )
        custTaxInfo.GET_INVEST_CERFLAG = "1";
        params.taxInfoArr = [custTaxInfo];
        if (_this.busiCode == "V0049" || _this.busiCode == "V0163") {
            let oldTaxInfo = getOldTaxInfo(_this);
            //审核端展示的信息过滤
            let ygtFilterArr = ["OPP_NO_TAXPAYERID_REASON","OPP_NO_TAXPAYERID_REASON2","OPP_NO_TAXPAYERID_REASON3"];
            //前端展示的信息过滤
            let webFilterArr = ["CUST_CODE", "CUST_NAME", "CTRL_NO", "OPERATOR_TYPE", "OPER_TYPE", "CITYEN", "CTRL_FLAG", "PAYMENT_AMNT1", "PAYMENT_AMNT2", "PAYMENT_AMNT3", "MODULE_RADIO_BUTTON","BIRTHDAY", "OPP_NO_TAXPAYERID_REASON", "BIRTH_COUNTRY", "REG_COUNTRY", "LIVING_COUNTRY", "ADDRESS_TYPE", "NO_ACCESS_ID_REASON1", "NO_ACCESS_ID_REASON2", "NO_ACCESS_ID_REASON3","REMARK1", "REMARK2", "REMARK3", "NO_TAXER_ID_REASON1", "NO_TAXER_ID_REASON2", "NO_TAXER_ID_REASON3", "HAS_TAXPAYER_IDNO", "HAS_TAXPAYER_IDNO2", "HAS_TAXPAYER_IDNO3"];
            //如果税收居民身份为5-无需展开税收尽职调查 则过滤NO_CHK_ORG-无需展开熟睡调查机构
            if (TAX_RESIDENT_TYPE != "5") {
                ygtFilterArr.push("NO_CHK_ORG");
                webFilterArr.push("NO_CHK_ORG");
            }
            //审核端展示数据
            let dataYGT = bizPublicMethod.$blMethod.getArrDiff(_.cloneDeep([custTaxInfo]), [_.cloneDeep(oldTaxInfo)], "CTRL_NO", ygtFilterArr.join(","));
            //前端展示数据 处理
            let webCustTaxInfo = _.cloneDeep(custTaxInfo);
            if (webCustTaxInfo.HAS_TAXPAYER_IDNO == "0" || webCustTaxInfo.HAS_TAXPAYER_IDNO == "") {
                webCustTaxInfo.TAXPAYER_IDNO = "";
            }
            if (webCustTaxInfo.HAS_TAXPAYER_IDNO2 == "0" || webCustTaxInfo.HAS_TAXPAYER_IDNO2 == "") {
                webCustTaxInfo.TAXPAYER_IDNO2 = "";
            }
            if (webCustTaxInfo.HAS_TAXPAYER_IDNO3 == "0" || webCustTaxInfo.HAS_TAXPAYER_IDNO3 == "") {
                webCustTaxInfo.TAXPAYER_IDNO3 = "";
            }
            let dataWeb = bizPublicMethod.$blMethod.getArrDiff(_.cloneDeep([webCustTaxInfo]), [_.cloneDeep(oldTaxInfo)], "CTRL_NO", ygtFilterArr.join(","));
            
            //添加属性
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
            }//字段对应的字典数据
            dataWeb.INFO = _this.$blMethod.addDiffAttArr(fieldsAll, _.cloneDeep(dataWeb.INFO), fieldConversion);
            //去除不展示的字段
            dataWeb.INFO = _.map(dataWeb.INFO, dataWebInfoItem => {
                dataWebInfoItem.DIFF_INFO = _.filter(dataWebInfoItem.DIFF_INFO, diffItem => {
                    return webFilterArr.indexOf(diffItem.FIELD) == -1 && diffItem.NEW != diffItem.OLD;
                })
                dataWebInfoItem.deleteDiff = _.filter(dataWebInfoItem.deleteDiff, deleteDiffItem => {
                    return webFilterArr.indexOf(deleteDiffItem.FIELD) == -1 && deleteDiffItem.NEW != deleteDiffItem.OLD;
                })
                dataWebInfoItem.showDiffInfo = dataWebInfoItem.DIFF_INFO;
                dataWebInfoItem.deleteDiff = dataWebInfoItem.deleteDiff;
                return dataWebInfoItem;
            })
            dataYGT.WEB_SHOW = _.cloneDeep(dataWeb.INFO);
            //居民国存储特殊性，需要判断其中任意一个变了，对应的其他都要入参，否则账户会删掉(需要验证这一部的必要性)
            if (dataYGT.INFO.length) {
                dataYGT.INFO  = _this.$blMethod.getTaxCountryDiffData(dataYGT.INFO, oldTaxInfo);
                dataYGT.INFO  = _this.$blMethod.getTaxAssetDiffData(dataYGT.INFO, oldTaxInfo);
            }
            //遍历所有涉税 增加居民国涉税审核端显示
            let orgTaxInfoItem = [];
            _.each(params.taxInfoArr, taxinfoItem => {
                let ctrlNo = taxinfoItem.CTRL_NO;
                let ctrlFlag = taxinfoItem.CTRL_FLAG;
                let oldObj = oldTaxInfo;
                let newObj = _.find(dataYGT.INFO, function (v) {
                    return v.CTRL_NO === ctrlNo && v.CTRL_FLAG === ctrlFlag;
                });
                let tmpObj = bizPublicMethod.$blMethod.getArrDiff(
                    bizPublicMethod.$blMethod.transTaxInfoToArr(newObj),
                    !_.isEmpty(oldObj) ? bizPublicMethod.$blMethod.transTaxInfoToArr(oldObj) : [],
                    "TAX_ID", "", true
                );
                // 审核端数据结构要求：将基本涉税信息与居民国信息合并在一起，保持个人、机构、产品的数据结构一致性
                tmpObj.CTRL_NO = ctrlNo;
                tmpObj.CTRL_FLAG = ctrlFlag;
                tmpObj.TAX_INFO = newObj;
                tmpObj.COUNTRY_INFO = [];
                // 由于增加了TAX_ID去比对，需要对新增类型重新赋值
                _.each(tmpObj.INFO,  v => {
                    if (v.OPER_TYPE === "0") {
                        v.DIFF_INFO = bizPublicMethod.$blMethod.compareInfo({}, _.omit(v, "DIFF_INFO"));
                    }
                    tmpObj.COUNTRY_INFO.push(v);
                });
                orgTaxInfoItem.push(tmpObj);
            });
            dataYGT.orgTaxInfoItem = orgTaxInfoItem;
            params.taxInfoArrChange = _.cloneDeep(dataYGT);
        }
    },
    bizOrgTaxInfoNodeAfterSave: (_this) => {
        let routeName = _this.$router.getCurrentRoute().name;
        let fromName = _this.$router.getCurrentRoute().fromName;
        let currentRouteIndex =  _this.$router.getCurrentRouteIndex();
        let nextRoute = _this.$router.getRoute(currentRouteIndex + 1);
        if (nextRoute.show && routeName != "税收居民国/地区信息") {
            return true;
        }
        //下一个节点是否隐藏
        _this.$router.goRoute("信息列表", {fromName: fromName});
        return false;
    },
    //-----字段关联逻辑-----//
    /**
     * 【TAXINFO_TAX_RESIDENT_TYPE】税收居民身份：
     */
    CHECK_ORG_TAX_RESIDENT_TYPE: (_this, field, fieldData) => {
        taxResidentTypeAndPassiveDetail(_this);
        setFilterCitizenship(_this);
    },
    CHECK_PASSIVE_NFE: (_this, field, fieldData) => {
        if (field.DEFAULT_VALUE == "") {
            return;
        }
        taxResidentTypeAndPassiveDetail(_this)
    },
    //机构所在国家
    CHECK_ORG_NATION_ENG: (_this, field, fieldData) => {
        if (field.lastValue == field.DEFAULT_VALUE) {
            return;
        }
        field.lastValue = field.DEFAULT_VALUE;
        if (field.DEFAULT_VALUE == "") return

        if (checkShowRegionSelector(_this, field.DEFAULT_VALUE)) {
            fieldData.ADDRESS.showRegionSelector = true;
        } else {
            fieldData.ADDRESS.showRegionSelector = false;
        }
        if (field.DEFAULT_VALUE == "CN") {
            fieldData.PROVINCE.FIELD_CONTROL = "0";
            fieldData.CITYCN.FIELD_CONTROL = "0";
            fieldData.DISTRICT_NAME.FIELD_CONTROL = "0";
            fieldData.PROVINCE.FIELD_REQUIRED = "1";
            fieldData.CITYCN.FIELD_REQUIRED = "1";
            fieldData.DISTRICT_NAME.FIELD_REQUIRED = "1"; 
            return                                        
        } 
        fieldData.PROVINCE.FIELD_CONTROL = "1";
        fieldData.CITYCN.FIELD_CONTROL = "1";
        fieldData.DISTRICT_NAME.FIELD_CONTROL = "1";
        fieldData.PROVINCE.FIELD_REQUIRED = "0";
        fieldData.CITYCN.FIELD_REQUIRED = "0";
        fieldData.DISTRICT_NAME.FIELD_REQUIRED = "0";
        fieldData.PROVINCE.DEFAULT_VALUE = "";
        fieldData.CITYCN.DEFAULT_VALUE = "";
        fieldData.DISTRICT_NAME.DEFAULT_VALUE = "";
    },
    CHECK_ORG_TAX_BASIC_INFO_ADDRESS: (_this, field, fieldData) => {
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
            let detailRegionFn = (field, value, provinceDefault) => {
                if (regionChange && field.FIELD_CONTROL == "0" || _.isEmpty(field.DEFAULT_VALUE) && field.FIELD_CONTROL == "0") {
                    let dictFilter = _.filter(field.FIELD_DICT_NAME, v=> {
                        if (provinceDefault) {
                            return v.DICT_ITEM.substring(0, 2) == provinceDefault.substring(0, 2);
                        }
                        return v;
                    });
                    let findItem = _.chain(dictFilter).find({DICT_ITEM_NAME: value}).get("DICT_ITEM", "").value();
                    field.DEFAULT_VALUE = findItem;
                }
            }
            let citycnName = addressTextInfo[1][1] || "";
            if (["市辖区", "辖县", "不详"].indexOf(citycnName) > -1) {
                citycnName = addressTextInfo[1][0];
            }
            let districtName = addressTextInfo[1][2] || "";
            if (districtName == "不详") {
                districtName = "";
            }
            detailRegionFn(fieldData.PROVINCE, addressTextInfo[1][0]);
            let provinceDefault = fieldData.PROVINCE.DEFAULT_VALUE || "";
            detailRegionFn(fieldData.CITYCN, citycnName, provinceDefault);
            detailRegionFn(fieldData.DISTRICT_NAME, districtName, provinceDefault);
            
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
    CHECK_ORG_PROVINCE: (_this, field, fieldData) => {
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
    CHECK_ORG_CITYCN: (_this, field, fieldData) => {
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
    //是否有纳税人识别号
    CHECK_ORG_HAS_TAXPAYER_IDNO: (_this, field,fieldData) =>{
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
    },
    //无纳税人识别号原因
    CHECK_ORG_OPP_NO_TAXPAYERID_REASON: (_this, field,fieldData) =>{
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
    orgTaxCountryInfoAddModuleFinished: (_this, fieldData) => {
        if (_this.moduleId.indexOf("ORG_TAX_COUNTRY_INFO") != -1) {
            fieldData.FIELDS.TAX_ID.DEFAULT_VALUE = _this.groupDatas.TAX_INFO.ORG_TAX_COUNTRY_INFO.length + "";
        }
    },
}
//税收居民身份 关联逻辑
const taxResidentTypeAndPassiveDetail = (_this) => {
    let ORG_TAX_INFO = _this.groupDatas.TAX_INFO.ORG_TAX_INFO[0].FIELDS;
    let taxResidentType = _.get(ORG_TAX_INFO, "TAX_RESIDENT_TYPE.DEFAULT_VALUE", "");
    let passiveNFE = _.get(ORG_TAX_INFO, "PASSIVE_NFE.DEFAULT_VALUE", "");

    let PASSIVE_NFE_OBJ = {
        "1": ["1", "3"],        // 税收居民身份选择“1”，只能选“1-居民消极非金融机构”或“3-其他机构”
        "2": ["2", "3"],        // 税收居民身份选择“2”，只能选“2-非居民消极非金融机构”或“3-其他机构”
        "3": ["2", "3"],        // 税收居民身份选择“3”，只能选“2-非居民消极非金融机构”或“3-其他机构”
        "4": ["1", "2", "3"],    // 税收居民身份选择“4”，下拉选择不控制
        "5": ["3"]    // 税收居民身份选择“5”，只能选“3-其他机构”
    };

    setFieldsAtt(_this, ORG_TAX_INFO, "PASSIVE_NFE", "FIELD_DICT_FILTER", "");
    taxResidentType && setFieldsAtt(_this, ORG_TAX_INFO, "PASSIVE_NFE", "FIELD_DICT_FILTER", PASSIVE_NFE_OBJ[taxResidentType]);
    _this.$blMethod.isDictClean(ORG_TAX_INFO.PASSIVE_NFE);
    if (taxResidentType == "1") {
        //仅为税收居民
        bizPublicMethod.$blMethod.hideRouteAndMoudle(_this, '税收居民国/地区信息');
        if (passiveNFE == "1") {
            //居民消极非金融机构
            bizPublicMethod.$blMethod.showRouteAndMoudle(_this,'税收居民基本信息');
            bizPublicMethod.$blMethod.showRouteAndMoudle(_this,'控制人涉税声明信息');
        }
        if (passiveNFE == "3") {
            //其他机构
            bizPublicMethod.$blMethod.hideRouteAndMoudle(_this, '税收居民基本信息');
            
        }

    } 
    if (taxResidentType == "2") {
        //仅为非居民
        bizPublicMethod.$blMethod.showRouteAndMoudle(_this, '税收居民基本信息');
        bizPublicMethod.$blMethod.showRouteAndMoudle(_this, '税收居民国/地区信息');
        if (passiveNFE == "2") {
            //非居民消极非金融机构
            bizPublicMethod.$blMethod.showRouteAndMoudle(_this, '控制人涉税声明信息');
        } 
        if (passiveNFE == "3") {
            //其他机构
        }
    } 
    if (taxResidentType == "3") {
        //
        bizPublicMethod.$blMethod.showRouteAndMoudle(_this, '税收居民基本信息');
        bizPublicMethod.$blMethod.showRouteAndMoudle(_this, '税收居民国/地区信息');
        if (passiveNFE == "2") {
            //非居民消极非金融机构
            bizPublicMethod.$blMethod.showRouteAndMoudle(_this, '控制人涉税声明信息');
        } 
        if (passiveNFE == "3") {
            //其他机构
        }
    }
    
    if (taxResidentType == "5") {
        setFieldsAtt(_this, ORG_TAX_INFO, "PASSIVE_NFE", "DEFAULT_VALUE", "3");
        setFieldsAtt(_this, ORG_TAX_INFO, "PASSIVE_NFE", "FIELD_CONTROL", "1");
        setFieldsAtt(_this, ORG_TAX_INFO, "NO_CHK_ORG", "FIELD_CONTROL", "0");
        bizPublicMethod.$blMethod.hideRouteAndMoudle(_this, '税收居民基本信息');
        bizPublicMethod.$blMethod.hideRouteAndMoudle(_this, '税收居民国/地区信息');
        passiveNFE = "3";
    }
    if (taxResidentType != "5") {
        setFieldsAtt(_this, ORG_TAX_INFO, "PASSIVE_NFE", "FIELD_CONTROL", "0");
        setFieldsAtt(_this, ORG_TAX_INFO, "NO_CHK_ORG", "FIELD_CONTROL", "1");
        setFieldsAtt(_this, ORG_TAX_INFO, "NO_CHK_ORG", "DEFAULT_VALUE", "");
    }

    if (passiveNFE == "3") {
        bizPublicMethod.$blMethod.hideRouteAndMoudle(_this, '控制人涉税声明信息');
    }

    let isOpenAcct = _this.$storage.getSession(_this.$definecfg.IS_OPEN_ACCT_BIZ) || "";
    if (isOpenAcct != "0") {
        //税收居民身份 按钮文字 是保存修改还是下一步
        let taxRouteIndex = _this.$router.getRouteIndex("税收居民身份");
        if (taxResidentType == "1" && passiveNFE == "3") {
            _this.$router.updateRoute(taxRouteIndex, "nextBtnText", "保存修改");
            
        }else{
            _this.$router.updateRoute(taxRouteIndex, "nextBtnText", "下一步");
        }
        //税收居民基本信息 按钮文字 是保存修改还是下一步
        let taxBasicRouteIndex = _this.$router.getRouteIndex("税收居民基本信息");
        if (taxResidentType == "1" && passiveNFE == "1") {
            _this.$router.updateRoute(taxBasicRouteIndex, "nextBtnText", "保存修改");
            
        }else{
            _this.$router.updateRoute(taxBasicRouteIndex, "nextBtnText", "下一步");
        }
    }
    
}
//校验地址是否显示省市区
const checkShowRegionSelector = (_this, value) => {
    let showIdTypeCITIZENSHIP = ["CN", "HK", "MO", "TW"];
    if (showIdTypeCITIZENSHIP.indexOf(value) > -1) {
        return true;
    }
    return false;
}
//字段属性设置
const setFieldsAtt = (_this, FIELDS, fieldId, att, value) => {
    let field = _.get(FIELDS, fieldId, {});
    if (!_.isEmpty(field)) {
        FIELDS[fieldId][att] = value;
    }
}
//如果为仅为非居民 税收居民国/地区过滤中国
const setFilterCitizenship = (_this) => {
    let ORG_TAX_INFO = _this.groupDatas.TAX_INFO.ORG_TAX_INFO[0].FIELDS;
    let taxResidentType = _.get(ORG_TAX_INFO, "TAX_RESIDENT_TYPE.DEFAULT_VALUE", "");
    let ORG_TAX_COUNTRY_INFO = _this.groupDatas.TAX_INFO.ORG_TAX_COUNTRY_INFO;
    let isFilterCN = taxResidentType == "2" ? true : false;
    _.each(ORG_TAX_COUNTRY_INFO, infoItem => {
        infoItem.FIELDS.CITIZENSHIP.FIELD_DICT_FILTER = isFilterCN ? "!CN" : "";
        _this.$blMethod.isDictClean(infoItem.FIELDS.CITIZENSHIP);
    })
}