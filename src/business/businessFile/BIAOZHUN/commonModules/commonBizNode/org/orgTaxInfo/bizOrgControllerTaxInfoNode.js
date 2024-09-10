/*
 *   机构涉税信息模块
 *   方法封装
 *   @author linsc
 */
import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../businessTools/bizPublicMethod.js"
import stringPinyinConfig from '../../../../../../../tools/stringPinyinConfig.js'
import { parseAddress } from "../../../../../../../tools/util" //地址解析组件


const getOldControlTaxInfoArr = (_this) => {
    let infoArr = _.cloneDeep(_.get(_this.oppBusiData, "oldBusiData.CONTROLLER_TAX_INFO", {}));
    if (_.isEmpty(infoArr)) {
        return [];
    }
    infoArr = _.map( infoArr, info => {
        info = _.mapValues(info, _.trim);
        //数据返回的HAS_TAXPAYER_IDNO有误 根据 税收居民国信息转换为数组类型数据 转换 是否有纳税人识别号：存在纳税人识别号，但没有无纳税识别号原因
        info.HAS_TAXPAYER_IDNO = info.TAXPAYER_IDNO && !info.NO_TAXPAYERID_REASON ? "1" : "0";
        info.HAS_TAXPAYER_IDNO2 = info.TAXPAYER_IDNO2 && !info.NO_TAXPAYERID_REASON2 ? "1" : "0";
        info.HAS_TAXPAYER_IDNO3 = info.TAXPAYER_IDNO3 && !info.NO_TAXPAYERID_REASON3 ? "1" : "0";
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
        return info;
    })
    return infoArr;
}
const bizOrgControllerTaxInfoNodeBeforeLoadBizCommon = function (_this) {
    let CITIZENSHIP_ST_DICT = _.get(_this.oppBusiData, "dictAll.CITIZENSHIP_ST", ""); 

    //客户涉税信息
    let ORG_TAX_CONTROLER_MODULE1 = _this.groupDatas.CONTROLLER_TAX_INFO.ORG_TAX_CONTROLER_MODULE1[0].FIELDS;
    setFieldsAtt(_this, ORG_TAX_CONTROLER_MODULE1, "TAX_RESIDENT_TYPE", "FIELED_CHECKBOX_BOTTON", true);
    setFieldsAtt(_this, ORG_TAX_CONTROLER_MODULE1, "TAX_RESIDENT_TYPE", "FIELD_RADIO_TYPE", false);
    setFieldsAtt(_this, ORG_TAX_CONTROLER_MODULE1, "TAX_RESIDENT_TYPE", "labelWidth", 280);

    
    //控制人信息
    let ORG_TAX_CONTROLER_MODULE2 = _this.groupDatas.CONTROLLER_TAX_INFO.ORG_TAX_CONTROLER_MODULE2[0].FIELDS;
    setFieldsAtt(_this, ORG_TAX_CONTROLER_MODULE2, "CUST_NAME", "VALID_TYPE", "val[1,256]");

    //控制人出生信息
    let ORG_TAX_CONTROLER_MODULE3 = _this.groupDatas.CONTROLLER_TAX_INFO.ORG_TAX_CONTROLER_MODULE3[0].FIELDS;
    setFieldsAtt(_this, ORG_TAX_CONTROLER_MODULE3, "BIRTH_NATION_ENG", "showDictItem", "1");
    setFieldsAtt(_this, ORG_TAX_CONTROLER_MODULE3, "BIRTH_ADDRESS", "VALID_TYPE", "addressLength[16,128]");
    
    _this.groupDatas.CONTROLLER_TAX_INFO.ORG_TAX_CONTROLER_MODULE3.forEach(function(moduleItem){
        for (let key in moduleItem.FIELDS) {
            moduleItem.FIELDS[key].labelWidth = 280;
        }
    })

    //控制人现居国家信息
    let ORG_TAX_CONTROLER_MODULE4 = _this.groupDatas.CONTROLLER_TAX_INFO.ORG_TAX_CONTROLER_MODULE4[0].FIELDS;

    setFieldsAtt(_this, ORG_TAX_CONTROLER_MODULE4, "NATION_ENG", "showDictItem", "1");
    setFieldsAtt(_this, ORG_TAX_CONTROLER_MODULE4, "PROVINCE", "showDictItem", "1");
    setFieldsAtt(_this, ORG_TAX_CONTROLER_MODULE4, "CITYCN", "showDictItem", "1");
    setFieldsAtt(_this, ORG_TAX_CONTROLER_MODULE4, "DISTRICT_NAME", "showDictItem", "1");
    setFieldsAtt(_this, ORG_TAX_CONTROLER_MODULE4, "ADDRESS", "VALID_TYPE", "addressLength[16,128]");
    _this.groupDatas.CONTROLLER_TAX_INFO.ORG_TAX_CONTROLER_MODULE4.forEach(function(moduleItem){
        for (let key in moduleItem.FIELDS) {
            moduleItem.FIELDS[key].labelWidth = 280;
        }
    })
    
    //税收居民国/地区信息
    let ORG_TAX_CONTROLER_MODULE5 = _this.groupDatas.CONTROLLER_TAX_INFO.ORG_TAX_CONTROLER_MODULE5[0].FIELDS;
    _this.groupDatas.CONTROLLER_TAX_INFO.ORG_TAX_CONTROLER_MODULE5.forEach(function(moduleItem){
        for (let key in moduleItem.FIELDS) {
            moduleItem.FIELDS[key].labelWidth = 280;
        }
    })
    setFieldsAtt(_this, ORG_TAX_CONTROLER_MODULE5, "CITIZENSHIP", "FIELD_DICT_NAME", CITIZENSHIP_ST_DICT);
    setFieldsAtt(_this, ORG_TAX_CONTROLER_MODULE5, "CITIZENSHIP", "showDictItem", "1");

    _this.groupDatasTpl.CONTROLLER_TAX_INFO.ORG_TAX_CONTROLER_MODULE1[0] = _.cloneDeep(_this.groupDatas.CONTROLLER_TAX_INFO.ORG_TAX_CONTROLER_MODULE1[0]);
    _this.groupDatasTpl.CONTROLLER_TAX_INFO.ORG_TAX_CONTROLER_MODULE2[0] = _.cloneDeep(_this.groupDatas.CONTROLLER_TAX_INFO.ORG_TAX_CONTROLER_MODULE2[0]);
    _this.groupDatasTpl.CONTROLLER_TAX_INFO.ORG_TAX_CONTROLER_MODULE3[0] = _.cloneDeep(_this.groupDatas.CONTROLLER_TAX_INFO.ORG_TAX_CONTROLER_MODULE3[0]);
    _this.groupDatasTpl.CONTROLLER_TAX_INFO.ORG_TAX_CONTROLER_MODULE4[0] = _.cloneDeep(_this.groupDatas.CONTROLLER_TAX_INFO.ORG_TAX_CONTROLER_MODULE4[0]);
    _this.groupDatasTpl.CONTROLLER_TAX_INFO.ORG_TAX_CONTROLER_MODULE5[0] = _.cloneDeep(_this.groupDatas.CONTROLLER_TAX_INFO.ORG_TAX_CONTROLER_MODULE5[0]);

    // 重新加载 省、市、县区代码信息
    let addrDict = {
        PROVINCE_DATA: ORG_TAX_CONTROLER_MODULE4.PROVINCE.FIELD_DICT_NAME,
        CITICN_DATA: ORG_TAX_CONTROLER_MODULE4.CITYCN.FIELD_DICT_NAME,
        DISTRICT_DATA: ORG_TAX_CONTROLER_MODULE4.DISTRICT_NAME.FIELD_DICT_NAME,
    }
    let addrDictTran = dealWithProvinceAndCityData(_this, addrDict)
    setFieldsAtt(_this, ORG_TAX_CONTROLER_MODULE4, "PROVINCE", "FIELD_DICT_NAME", addrDictTran.PROVINCE_DATA);
    setFieldsAtt(_this, ORG_TAX_CONTROLER_MODULE4, "CITYCN", "FIELD_DICT_NAME", addrDictTran.CITICN_DATA);
    setFieldsAtt(_this, ORG_TAX_CONTROLER_MODULE4, "DISTRICT_NAME", "FIELD_DICT_NAME", addrDictTran.DISTRICT_DATA);
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
    bizOrgControllerTaxInfoNodeBeforeLoadBiz: function (_this) {
        bizOrgControllerTaxInfoNodeBeforeLoadBizCommon(_this);
        let oldData = getOldControlTaxInfoArr(_this);
        _this.oppBusiData.currentControllerTaxInfo = _.cloneDeep(oldData);
    },
    bizOrgControllerTaxInfoNodeBeforeLoadBizOpenAcct: function (_this) {
        bizOrgControllerTaxInfoNodeBeforeLoadBizCommon(_this);
    },
    bizOrgControllerTaxInfoNodeAfterLoadBiz: function (_this) {
        let historyData = _.cloneDeep(_this.historyData) || {};
        if(!_.isEmpty(historyData.controllerTaxInfoArr)) {
            _this.oppBusiData.currentControllerTaxInfo = historyData.controllerTaxInfoArr
        }
    },
    bizOrgControllerTaxInfoNodeValidate: function (_this) {
        let isOpenAcct = _this.$storage.getSession(_this.$definecfg.IS_OPEN_ACCT_BIZ) || "";
        if (isOpenAcct == "0") {
            let ORG_TAX_CONTROLER_MODULE2 = _this.groupDatas.CONTROLLER_TAX_INFO.ORG_TAX_CONTROLER_MODULE2[0];
            let ORG_TAX_CONTROLER_MODULE3 = _this.groupDatas.CONTROLLER_TAX_INFO.ORG_TAX_CONTROLER_MODULE3[0];
            let ORG_TAX_CONTROLER_MODULE4 = _this.groupDatas.CONTROLLER_TAX_INFO.ORG_TAX_CONTROLER_MODULE4[0];
            let ORG_TAX_CONTROLER_MODULE5 = _this.groupDatas.CONTROLLER_TAX_INFO.ORG_TAX_CONTROLER_MODULE5;
            if (ORG_TAX_CONTROLER_MODULE2.MODULE_CONTROL == "0") {
                //隐藏模块数据清空
                _.each(ORG_TAX_CONTROLER_MODULE2.FIELDS, (item, key) => {
                    ORG_TAX_CONTROLER_MODULE2.FIELDS[key].DEFAULT_VALUE = "";
                })
            }
            if (ORG_TAX_CONTROLER_MODULE3.MODULE_CONTROL == "0") {
                //隐藏模块数据清空
                _.each(ORG_TAX_CONTROLER_MODULE3.FIELDS, (item, key) => {
                    ORG_TAX_CONTROLER_MODULE3.FIELDS[key].DEFAULT_VALUE = "";
                })
            }
            if (ORG_TAX_CONTROLER_MODULE4.MODULE_CONTROL == "0") {
                //隐藏模块数据清空
                _.each(ORG_TAX_CONTROLER_MODULE4.FIELDS, (item, key) => {
                    ORG_TAX_CONTROLER_MODULE4.FIELDS[key].DEFAULT_VALUE = "";
                })
            }
            if(ORG_TAX_CONTROLER_MODULE5[0].MODULE_CONTROL == "0") {
                ORG_TAX_CONTROLER_MODULE5.splice(1, ORG_TAX_CONTROLER_MODULE5.length || 0);
                _.each(ORG_TAX_CONTROLER_MODULE5[0].FIELDS, (item, key) => {
                    ORG_TAX_CONTROLER_MODULE5[0].FIELDS[key].DEFAULT_VALUE = "";
                })
            }
        }
        
        return true;
    },
    bizOrgControllerTaxInfoNodePageActivated: function (_this) {
        let isOpenAcct = _this.$storage.getSession(_this.$definecfg.IS_OPEN_ACCT_BIZ) || "";
        if (isOpenAcct == "0") {
            if (_this.moduleId && _this.moduleId.indexOf("ORG_TAX_CONTROLER_MODULE1") > -1)
            _this.pushFlowTip({
                title: "请选择控制人的涉税居民身份",
                key: "controlerTaxInfo",
                type: 'warning'
            })
        }
    },
    bizOrgControllerTaxInfoNodeBeforeSave: function (_this, params, isNotSaveInfo) {
        let controlTaxInfo = {};
        let controlTaxInfoArr = [];
        let taxCountryObj = _.cloneDeep( _this.$blMethod.getEmptyTaxCountry());

        let ORG_TAX_CONTROLER_MODULE1 = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "ORG_TAX_CONTROLER_MODULE1");
        let ORG_TAX_CONTROLER_MODULE2 = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "ORG_TAX_CONTROLER_MODULE2");
        let ORG_TAX_CONTROLER_MODULE3 = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "ORG_TAX_CONTROLER_MODULE3");
        let ORG_TAX_CONTROLER_MODULE4 = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "ORG_TAX_CONTROLER_MODULE4");
        
        let ORG_TAX_CONTROLER_MODULE5 = bizPublicSaveMethod.getModuleArrFoyKey(_this, "ORG_TAX_CONTROLER_MODULE5", true);

        let orgTaxControlerModule1Fields = _this.groupDatas.CONTROLLER_TAX_INFO.ORG_TAX_CONTROLER_MODULE1[0].FIELDS;
        let orgTaxControlerModule2Fields = _this.groupDatas.CONTROLLER_TAX_INFO.ORG_TAX_CONTROLER_MODULE2[0].FIELDS;
        let orgTaxControlerModule3Fields = _this.groupDatas.CONTROLLER_TAX_INFO.ORG_TAX_CONTROLER_MODULE3[0].FIELDS;
        let orgTaxControlerModule4Fields = _this.groupDatas.CONTROLLER_TAX_INFO.ORG_TAX_CONTROLER_MODULE4[0].FIELDS;
        let orgTaxControlerModule5Fields = _this.groupDatas.CONTROLLER_TAX_INFO.ORG_TAX_CONTROLER_MODULE5[0].FIELDS;
        let fieldsAll = _.assign({}, orgTaxControlerModule1Fields, orgTaxControlerModule2Fields, orgTaxControlerModule3Fields, orgTaxControlerModule4Fields, orgTaxControlerModule5Fields);

        ORG_TAX_CONTROLER_MODULE3.BIRTH_ADDRESS = orgTaxControlerModule3Fields.BIRTH_ADDRESS.newAddressVal || ORG_TAX_CONTROLER_MODULE3.BIRTH_ADDRESS;
        ORG_TAX_CONTROLER_MODULE4.ADDRESS = orgTaxControlerModule4Fields.ADDRESS.newAddressVal || ORG_TAX_CONTROLER_MODULE4.ADDRESS;


        //获取id_code
        let docInfo = _this.groupDatas.ORG_INFO.DOC_INFO[0].FIELDS;
        let idCode = docInfo.ID_CODE.DEFAULT_VALUE || "";

        let otherParams = {
            //修改同步字段，避免账户系统CRS非居民涉税信息导出报送出错
            LIVING_COUNTRY: ORG_TAX_CONTROLER_MODULE4.NATION_ENG || "",
            CITYEN: ORG_TAX_CONTROLER_MODULE4.CITY_ENG || "",
            BIRTH_COUNTRY: ORG_TAX_CONTROLER_MODULE3.BIRTH_NATION_ENG || "",
            // 是否控制人标志：非控制人，默认为0
            CTRL_FLAG: "1", 
            CTRL_NON_RESIDENT: "",
        }
        
        controlTaxInfo = _.assign(
            {},
            ORG_TAX_CONTROLER_MODULE1,
            ORG_TAX_CONTROLER_MODULE2,
            ORG_TAX_CONTROLER_MODULE3,
            ORG_TAX_CONTROLER_MODULE4,
            otherParams,
            taxCountryObj,
            _this.$blMethod.transTaxInfoToObj(ORG_TAX_CONTROLER_MODULE5),
        )
        //去除已经删除的
        _this.oppBusiData.currentControllerTaxInfo =  _.differenceBy(_.cloneDeep(_this.oppBusiData.currentControllerTaxInfo), _.cloneDeep(_this.oppBusiData.controlTaxInfoDeleteArr), "CTRL_NO");
        _this.oppBusiData.controlTaxInfoDeleteArr = [];
        let differenceControllerTaxInfoArr = _.differenceBy(_this.oppBusiData.currentControllerTaxInfo, [controlTaxInfo], "CTRL_NO");
        controlTaxInfoArr = _.concat([], differenceControllerTaxInfoArr, [controlTaxInfo]);
        controlTaxInfoArr = isNotSaveInfo ? _this.oppBusiData.currentControllerTaxInfo : controlTaxInfoArr;
        //如果PASSIVE_NFE 为 3-其它机构 则隐藏控制人涉税信息
        let passiveNFE = _.get(_this.groupDatas, "TAX_INFO.ORG_TAX_INFO[0].FIELDS.PASSIVE_NFE.DEFAULT_VALUE", "");
        if (passiveNFE == "3") {
            controlTaxInfoArr = [];
        }
        _.each(controlTaxInfoArr, taxInfoItem => {
            if (taxInfoItem.HAS_TAXPAYER_IDNO == "0") {
                taxInfoItem.TAXPAYER_IDNO = idCode;
            }
            if (taxInfoItem.HAS_TAXPAYER_IDNO2 == "0") {
                taxInfoItem.TAXPAYER_IDNO2 = idCode;
            }
            if (taxInfoItem.HAS_TAXPAYER_IDNO3 == "0") {
                taxInfoItem.TAXPAYER_IDNO3 = idCode;
            }
            if (["2", "3"].indexOf(taxInfoItem.TAX_RESIDENT_TYPE) > -1) {
                taxInfoItem.CTRL_NON_RESIDENT = "1";
            }

        })
        params.controllerTaxInfoArr = controlTaxInfoArr;
        _this.oppBusiData.currentControllerTaxInfo = controlTaxInfoArr;
        
        if (_this.busiCode == "V0049" || _this.busiCode == "V0163") {
            let oldControlTaxInfoArr = getOldControlTaxInfoArr(_this);
            //无纳税人识别号原因
            let oldcontrolTaxInfo = _.find(oldControlTaxInfoArr, {CTRL_NO: controlTaxInfo.CTRL_NO, CTRL_FLAG: "1"}) || {}
            //审核端展示的信息过滤
            let ygtFilterArr = ["OPP_NO_TAXPAYERID_REASON","OPP_NO_TAXPAYERID_REASON2","OPP_NO_TAXPAYERID_REASON3","CTRL_NON_RESIDENT"];
            //审核端展示数据
            let dataYGT = bizPublicMethod.$blMethod.getArrDiff(_.cloneDeep(controlTaxInfoArr), _.cloneDeep(oldControlTaxInfoArr), "CTRL_NO", ygtFilterArr.join(","));
            //前端展示的信息过滤
            let webFilterArr = ["CUST_CODE", "CUST_NAME", "CTRL_NO", "OPERATOR_TYPE", "OPER_TYPE", "CITYEN", "CTRL_FLAG", "PAYMENT_AMNT1", "PAYMENT_AMNT2", "PAYMENT_AMNT3", "MODULE_RADIO_BUTTON","BIRTHDAY", "OPP_NO_TAXPAYERID_REASON", "BIRTH_COUNTRY", "REG_COUNTRY", "LIVING_COUNTRY", "ADDRESS_TYPE", "NO_ACCESS_ID_REASON1", "NO_ACCESS_ID_REASON2", "NO_ACCESS_ID_REASON3","REMARK1", "REMARK2", "REMARK3", "NO_TAXER_ID_REASON1", "NO_TAXER_ID_REASON2", "NO_TAXER_ID_REASON3", "HAS_TAXPAYER_IDNO", "HAS_TAXPAYER_IDNO2", "HAS_TAXPAYER_IDNO3","CTRL_NON_RESIDENT"];
            //前端展示数据
            let webControlTaxinfoArr = _.cloneDeep(controlTaxInfoArr);
            _.each(webControlTaxinfoArr, webControlTaxinfoItem => {
                if (webControlTaxinfoItem.HAS_TAXPAYER_IDNO == "0" || webControlTaxinfoItem.HAS_TAXPAYER_IDNO == "") {
                    webControlTaxinfoItem.TAXPAYER_IDNO = "";
                }
                if (webControlTaxinfoItem.HAS_TAXPAYER_IDNO2 == "0" || webControlTaxinfoItem.HAS_TAXPAYER_IDNO2 == "") {
                    webControlTaxinfoItem.TAXPAYER_IDNO2 = "";
                }
                if (webControlTaxinfoItem.HAS_TAXPAYER_IDNO3 == "0" || webControlTaxinfoItem.HAS_TAXPAYER_IDNO3 == "") {
                    webControlTaxinfoItem.TAXPAYER_IDNO3 = "";
                }
            })
            let dataWeb = bizPublicMethod.$blMethod.getArrDiff(webControlTaxinfoArr, _.cloneDeep(oldControlTaxInfoArr), "CTRL_NO", ygtFilterArr.join(","));
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
                dataYGT.INFO  = _this.$blMethod.getTaxCountryDiffData(dataYGT.INFO, oldcontrolTaxInfo);
                dataYGT.INFO  = _this.$blMethod.getTaxAssetDiffData(dataYGT.INFO, oldcontrolTaxInfo);
            }
            //遍历所有涉税 增加居民国涉税审核端显示
            let orgTaxInfoItem = [];
            _.each(params.controllerTaxInfoArr, taxinfoItem => {
                let ctrlNo = taxinfoItem.CTRL_NO;
                let ctrlFlag = taxinfoItem.CTRL_FLAG;
                let oldObj = _.find(oldControlTaxInfoArr, function (v) {
                    return v.CTRL_NO === ctrlNo && v.CTRL_FLAG === ctrlFlag;
                });
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
                if (newObj.DIFF_INFO.length > 0) {
                    tmpObj.IS_CHANGE = "1";
                }
                orgTaxInfoItem.push(_.omit(tmpObj, "INFO"));
            });
            // 需要把删除类型的数据塞进去
            let dataYgtInfo = _.filter(_.cloneDeep(dataYGT.INFO), (tax) => {
                return tax.OPER_TYPE === "2";
            });
            _.each(dataYgtInfo, function (taxInfo) {
                var tmpObj = bizPublicMethod.$blMethod.getArrDiff([], bizPublicMethod.$blMethod.transTaxInfoToArr(taxInfo), "TAX_ID", "", true);
                tmpObj.CTRL_NO = taxInfo.CTRL_NO;
                tmpObj.TAX_INFO = taxInfo;
                tmpObj.COUNTRY_INFO = [];
                // 由于增加了TAX_ID去比对，需要对新增类型重新赋值
                _.each(tmpObj.INFO, function (v) {
                    if (v.OPER_TYPE === "0") {
                        v.DIFF_INFO = bizPublicMethod.$blMethod.compareInfo({}, _.omit(v, "DIFF_INFO"));
                    }
                    tmpObj.COUNTRY_INFO.push(v);
                });

                orgTaxInfoItem.push(_.omit(tmpObj, "INFO"));
            });
            dataYGT.orgTaxInfoItem = orgTaxInfoItem;
            params.controllerTaxInfoArrChange = _.cloneDeep(dataYGT);
        }
    },
    bizOrgControllerTaxInfoNodeAfterSave: (_this) => {
        let routeName = _this.$router.getCurrentRoute().name;
        let currentRouteIndex =  _this.$router.getCurrentRouteIndex();
        let nextRoute = _this.$router.getRoute(currentRouteIndex + 1);
        if (nextRoute.show && routeName != "控制人税收居民国/地区信息") {
            return true;
        }
        //下一个节点是否隐藏
        _this.$router.goRoute("控制人涉税声明信息");
        return false;
    },
    CHECK_ORG_CONTROLLER_TAX_RESIDENT_TYPE: (_this, field, fieldData) => {
        let defaultValue = field.DEFAULT_VALUE || "";
        taxInfoTypeHideOrShow(_this)
        //税收居民身份类型“2-仅为非居民”时，税收居民国不能填写中国
        let ORG_TAX_CONTROLER_MODULE5 = _this.groupDatas.CONTROLLER_TAX_INFO.ORG_TAX_CONTROLER_MODULE5 || [];
        _.each(ORG_TAX_CONTROLER_MODULE5, item => {
            item.FIELDS.CITIZENSHIP.FIELD_DICT_FILTER = defaultValue == "2" ? "!CN" : [];
            if (item.FIELDS.CITIZENSHIP.DEFAULT_VALUE == "CN" && defaultValue == "2") {
                item.FIELDS.CITIZENSHIP.DEFAULT_VALUE = "";
            }
        })

        if (defaultValue == "1") {
            let isOpenAcct = _this.$storage.getSession(_this.$definecfg.IS_OPEN_ACCT_BIZ) || "";
            _this.$router.updateRoute(_this.$router.getCurrentRouteIndex(), "nextBtnText", "保存修改");
            if (isOpenAcct == "0") {
                _this.$router.updateRoute(_this.$router.getCurrentRouteIndex(), "nextBtnText", "保存");
            }
        }else{
            _this.$router.updateRoute(_this.$router.getCurrentRouteIndex(), "nextBtnText", "下一步");
        }
        setFilterCitizenship(_this)
        
    },
    //所在国家
    CHECK_ORG_CONTROLLER_NATION_ENG: (_this, field, fieldData) => {
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
    //出生地址国
    CHECK_BIRTH_NATION_ENG: (_this, field, fieldData) => {
        if (checkShowRegionSelector(_this, field.DEFAULT_VALUE)) {
            fieldData.BIRTH_ADDRESS.showRegionSelector = true;
        } else {
            fieldData.BIRTH_ADDRESS.showRegionSelector = false;
        }
    },
    CHECK_ORG_CONTROLLER_TAX_ADDRESS: (_this, field, fieldData) => {
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
    CHECK_ORG_CONTROLLER_TAX_BIRTH_ADDRESS: (_this, field, fieldData) => {
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
    CHECK_ORG_CONTROLLER_PROVINCE: (_this, field, fieldData) => {
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
    CHECK_ORG_CONTROLLER_CITYCN: (_this, field, fieldData) => {
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
    CHECK_ORG_CONTROLLER_HAS_TAXPAYER_IDNO: (_this, field,fieldData) =>{
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
    CHECK_ORG_CONTROLLER_OPP_NO_TAXPAYERID_REASON: (_this, field,fieldData) =>{
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
    CHECK_CTRL_SHARE_RATIO: (_this, field, fieldData) => {
        if (Number(field.DEFAULT_VALUE) > 100) {
            field.DEFAULT_VALUE = "100";
        }
    },
    orgControllerTaxCountryInfoAddModuleFinished: (_this, fieldData) => {
        if (_this.moduleId.indexOf("ORG_TAX_CONTROLER_MODULE5") != -1) {
            fieldData.FIELDS.TAX_ID.DEFAULT_VALUE = _this.groupDatas.CONTROLLER_TAX_INFO.ORG_TAX_CONTROLER_MODULE5.length + "";
        }
    },
    
}
//根据税收居民身份 隐藏显示模块
const taxInfoTypeHideOrShow = (_this) => {
    let ORG_TAX_CONTROLER_MODULE1 = _this.groupDatas.CONTROLLER_TAX_INFO.ORG_TAX_CONTROLER_MODULE1[0].FIELDS;
    let typeDefalutValue = ORG_TAX_CONTROLER_MODULE1.TAX_RESIDENT_TYPE.DEFAULT_VALUE;
    bizPublicMethod.$blMethod.hideRouteAndMoudle(_this, "控制人出生/现居国家信息");
    bizPublicMethod.$blMethod.hideRouteAndMoudle(_this, "控制人税收居民国/地区信息");
    if (typeDefalutValue && typeDefalutValue != "1" && typeDefalutValue != "5") {
        bizPublicMethod.$blMethod.showRouteAndMoudle(_this, "控制人出生/现居国家信息");
        bizPublicMethod.$blMethod.showRouteAndMoudle(_this, "控制人税收居民国/地区信息");
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
    let ORG_TAX_CONTROLER_MODULE1 = _this.groupDatas.CONTROLLER_TAX_INFO.ORG_TAX_CONTROLER_MODULE1[0].FIELDS;
    let taxResidentType = _.get(ORG_TAX_CONTROLER_MODULE1, "TAX_RESIDENT_TYPE.DEFAULT_VALUE", "");
    let ORG_TAX_CONTROLER_MODULE5 = _this.groupDatas.CONTROLLER_TAX_INFO.ORG_TAX_CONTROLER_MODULE5;
    let isFilterCN = taxResidentType == "2" ? true : false;
    _.each(ORG_TAX_CONTROLER_MODULE5, infoItem => {
        infoItem.FIELDS.CITIZENSHIP.FIELD_DICT_FILTER = isFilterCN ? "!CN" : "";
        _this.$blMethod.isDictClean(infoItem.FIELDS.CITIZENSHIP);
    })
}