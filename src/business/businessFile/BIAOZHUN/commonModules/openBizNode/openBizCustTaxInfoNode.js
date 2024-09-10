/* 
*   个人-开户涉税信息模块
*   方法封装
*   @author  linsc
*/
import stringConfig from "../../../../../tools/stringConfig"
import stringPinyinConfig from "../../../../../tools/stringPinyinConfig"
import bizPublicSaveMethod from '../../../../businessTools/bizPublicSaveMethod'
import date from '../../../../../tools/date.js'
import * as utils from "../../../../../tools/util"

const checkPaymentInfoRequired = function (_this, fieldData) {
    if (fieldData.PAYMENT_ASSET != "" || fieldData.PAYMENT_CURR != "" || fieldData.PAYMENT_TYPE != "") {
        fieldData.PAYMENT_ASSET.FIELD_REQUIRED = "1";
        fieldData.PAYMENT_CURR.FIELD_REQUIRED = "1";
        fieldData.PAYMENT_TYPE.FIELD_REQUIRED = "1";
    } else {
        fieldData.PAYMENT_ASSET.FIELD_REQUIRED = "0";
        fieldData.PAYMENT_CURR.FIELD_REQUIRED = "0";
        fieldData.PAYMENT_TYPE.FIELD_REQUIRED = "0";
    }
}

const transTaxInfoToObj = function (taxInfoArr) {
    var commonReason = "居民国(地区)不发放纳税人识别号",
        otherReasonPrefix = "账户持有人未能取得纳税人识别号:",
        itemKeys = ["CITIZENSHIP", "TAXPAYER_IDNO", "OPP_NO_TAXPAYERID_REASON", "NO_TAXPAYERID_REASON"],
        rtnObj = {};
    // 账户存储数据特殊性，需要拼接多条纳税居民国信息
    _.each(taxInfoArr || [], function (taxInfo) {
        _.each(itemKeys, function (key) {
            if (taxInfo.TAX_ID == "0") {
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
                taxNo = rtnObj["TAXPAYER_IDNO" + k.replace("OPP_NO_TAXPAYERID_REASON", "")];
            // 无纳税识别号时
            rtnObj[key] = !taxNo ? (v == "1" ? commonReason : otherReasonPrefix + rtnObj[key]) : "";
        }
    });
    return rtnObj;
}

export default {
    //业务初始化
    openCusttaxInfoNodeBeforeLoad: function (_this, busiData) {
        // //居住国家选项把value也展示
        // _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE3[0].FIELDS.COUNTRY_EN.FIELD_DICT_NAME = _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE3[0].FIELDS.COUNTRY_EN.FIELD_DICT_NAME.map((v) => {
        //     return { DICT_ITEM: v.DICT_ITEM, DICT_ITEM_NAME: v.DICT_ITEM + "-" + v.DICT_ITEM_NAME }
        // })
        // //出生国家选项把value也展示
        // _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE4[0].FIELDS.BRH_COUNTRY_EN.FIELD_DICT_NAME = _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE4[0].FIELDS.BRH_COUNTRY_EN.FIELD_DICT_NAME.map((v) => {
        //     return { DICT_ITEM: v.DICT_ITEM, DICT_ITEM_NAME: v.DICT_ITEM + "-" + v.DICT_ITEM_NAME }
        // })
        //居民身份屏蔽
        _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE1[0].FIELDS.TAX_RESIDENT_TYPE.FIELD_DICT_FILTER = ["1", "2", "3"]
        _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE1[0].FIELDS.TAX_RESIDENT_TYPE.isShowAllBtn = false;
        _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE1[0].FIELDS.GET_INVEST_CERFLAG.isShowAllBtn = false;
        //街道地址
        _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE8[0].FIELDS.ADDRESS_ENG.VALID_TYPE = 'length[1,183]'
        _this.groupDatasTpl.TAX_INFO.CUST_TAX_INFO_MODULE8[0].FIELDS.ADDRESS_ENG.VALID_TYPE = 'length[1,183]';
        
        // 县区代码有2000多条，禁止初始化
        _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE3[0].FIELDS.DISTRICT_NAME.forbidInitDict = true;
        _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE8[0].FIELDS.DISTRICT_NAME.forbidInitDict = true;
    },
    openCusttaxInfoNodeAfterLoadBiz: function (_this) {
        //业务数据初始化
        if (_this.$syscfg.isOpenAcctBiz(_this.busiCode)) {
            console.log("openCusttaxInfoNodeParseOldBiz")
            // return this.paserOpenCusttaxInfoNode(_this, _this.historyData);
        }
    },
    openCustTaxInfoNodeBeforeSave: function (_this, params) {
        console.log("openCustTaxInfoNodeBeforeSave");
        let CUST_TAX_INFO_MODULE1 = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "CUST_TAX_INFO_MODULE1");
        let CUST_TAX_INFO_MODULE2 = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "CUST_TAX_INFO_MODULE2");
        let CUST_TAX_INFO_MODULE3 = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "CUST_TAX_INFO_MODULE3");
        let CUST_TAX_INFO_MODULE4 = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "CUST_TAX_INFO_MODULE4");
        let CUST_TAX_INFO_MODULE5 = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "CUST_TAX_INFO_MODULE5");
        // let CUST_TAX_INFO_MODULE6 = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "CUST_TAX_INFO_MODULE6");
        // let CUST_TAX_INFO_MODULE7 = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "CUST_TAX_INFO_MODULE7");
        let CUST_TAX_INFO_MODULE8 = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "CUST_TAX_INFO_MODULE8");
        let HAVE_CREDIT_INFO = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "HAVE_CREDIT_INFO");
        let CREDIT_INFO = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "CREDIT_INFO");

        let taxCountryObj = {
            CITIZENSHIP: "",
            CITIZENSHIP2: "",
            CITIZENSHIP3: "",
            TAXPAYER_IDNO: "",
            TAXPAYER_IDNO2: "",
            TAXPAYER_IDNO3: "",
            NO_TAXPAYERID_REASON: "",
            NO_TAXPAYERID_REASON2: "",
            NO_TAXPAYERID_REASON3: ""
        },
            taxAssetObj = {
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
            },
            taxInfoItemData = [],
            taxAssetData = [];
        taxInfoItemData = _.isArray(CUST_TAX_INFO_MODULE5) ? CUST_TAX_INFO_MODULE5 : [CUST_TAX_INFO_MODULE5];
        let formData = Object.assign({}, CUST_TAX_INFO_MODULE1, CUST_TAX_INFO_MODULE2, CUST_TAX_INFO_MODULE3, CUST_TAX_INFO_MODULE4, CUST_TAX_INFO_MODULE5, CUST_TAX_INFO_MODULE8)
        if (formData.TAX_RESIDENT_TYPE == "1") {
            formData = _.pick(formData, "TAX_RESIDENT_TYPE", "GET_INVEST_CERFLAG");
        }
        let taxResObj = Object.assign({}, formData, {
            FOUNDATION_AML_INFO: {},
            CTRL_FLAG: "0", // 是否控制人标志：非控制人，默认为0
            CTRL_NO: "0", // 控制人编号：非控制人，默认为0
            PASSIVE_NFE: "",   // 是否消极非金融机构：个人客户默认空值
            CTRL_NON_RESIDENT: "", // 控制人是否非居民：个人客户默认空值
            BIRTHDAY: formData.TAX_RESIDENT_TYPE != 1 ? params.CUST_INFO.CUST_BASIC_INFO.BIRTHDAY : "", // 个人客户默认送出生日期
            BIRTH_ADDRESS: formData.TAX_RESIDENT_TYPE != 1 ? formData.BIRTH_ADDRESS : "",
            ADDRESS: formData.TAX_RESIDENT_TYPE != 1 ? params.CUST_INFO.CUST_BASIC_INFO.ADDRESS : ""
        }, taxCountryObj, formData.TAX_RESIDENT_TYPE != 1 ? transTaxInfoToObj(taxInfoItemData) : {}
            , taxAssetObj);
        let sysCommParamObjs = _this.$storage.getJsonSession(_this.$definecfg.SYS_COMM_PARAM_OBJS);
        let OPP_NO_CREDIT_RECORD_ITEM = sysCommParamObjs && sysCommParamObjs['OPP_NO_CREDIT_RECORD_ITEM'];
        let NO_CREDIT_RECORD = {}
        if (OPP_NO_CREDIT_RECORD_ITEM) {
            let tmpArr = OPP_NO_CREDIT_RECORD_ITEM.split('|');
            NO_CREDIT_RECORD = {
                RECORD_SOURCE: tmpArr[0] || "07",
                RECORD_SCORE: tmpArr[1] || "",
                RECORD_TXT: tmpArr[2] || ""
            }
        }
        let creditRecordInfo = [];
        if (HAVE_CREDIT_INFO.HAVE_CREDIT_INFO == "0") {
            let tmpObj = {
                OPER_TYPE: "0",
                RECORD_SOURCE: NO_CREDIT_RECORD && NO_CREDIT_RECORD.RECORD_SOURCE || "",
                RECORD_SCORE: NO_CREDIT_RECORD && NO_CREDIT_RECORD.RECORD_SCORE || "",
                RECORD_TXT: NO_CREDIT_RECORD && NO_CREDIT_RECORD.RECORD_TXT || ""
            };
            creditRecordInfo.push(tmpObj);
        } else {
            CREDIT_INFO = _.isArray(CREDIT_INFO) ? CREDIT_INFO : [CREDIT_INFO];
            _.each(CREDIT_INFO, v => {
                creditRecordInfo.push(Object.assign(v, { OPER_TYPE: "0", }));
            })
        }
        Object.assign(params, {
            RELA_INFO: Object.assign({}, params.RELA_INFO, {
                HAS_CREDIT_RECORD: HAVE_CREDIT_INFO.HAVE_CREDIT_INFO,
                CREDIT_RECORD_INFO: creditRecordInfo,
                CUST_TAX_INFO: [taxResObj],
                FOUNDATION_AML_INFO: CUST_TAX_INFO_MODULE8,
            }),
            RECORD_SOURCE_ARR: _.pluck(creditRecordInfo, "RECORD_SOURCE"),
            HAS_CREDIT_RECORD: HAVE_CREDIT_INFO.HAVE_CREDIT_INFO,
            //银河用于配置影像采集
            TAX_RESIDENT_TYPE: taxResObj.TAX_RESIDENT_TYPE,
        })

    },
    openCustTaxInfoNodePageActivated: function (_this) {
        let NATION_ENG = _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE8[0].FIELDS.NATION_ENG;
        NATION_ENG.FIELD_REQUIRED=="1" && NATION_ENG.DEFAULT_VALUE=="" ?  NATION_ENG.DEFAULT_VALUE = 'CN' :"";
        console.log("openCustTaxInfoNodePageActivated");

        // 县区代码有2000多条，禁止初始化
        _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE3[0].FIELDS.DISTRICT_NAME.forbidInitDict = true;
        _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE8[0].FIELDS.DISTRICT_NAME.forbidInitDict = true;
        
        if(["YINHE"].indexOf(_this.$definecfg.QSJGDM_CONST[_this.$basecfg.qsVersion])!= -1) {
            //若税收居民身份不为仅为中国税收居民
            _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE4[0].FIELDS.BIRTH_ADDRESS_ENG.FIELD_REQUIRED = "1";
            _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE4[0].FIELDS.BIRTH_ADDRESS.FIELD_REQUIRED = "1";
        }
    
    },
    openCustTaxInfoNodeValidate: function (_this) {
        console.log("openCustTaxInfoNodeValidate");
    },
    //解析 开户涉税模块
    paserOpenCusttaxInfoNode: async function (_this, busiData) {
        //开户业务 涉税只是展示 所以全部都显示
        _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE2[0].MODULE_CONTROL = "1";
        _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE3[0].MODULE_CONTROL = "1";
        _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE4[0].MODULE_CONTROL = "1";
        _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE5[0].MODULE_CONTROL = "1";
        _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE6[0].MODULE_CONTROL = "1";
        _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE7[0].MODULE_CONTROL = "1";

        //_this.oppBusiData = _.merge(_this.oppBusiData, busiData)
        _this.oppBusiData.TAX_INFO = busiData.TAX_INFO
        if (!_.isEmpty(_this.oppBusiData.TAX_INFO)) {
            //获取涉税国回填数据
            //"1:AGO uoipu,2:AIA oiyoi,3:AIA oiuuio"
            let custTaxMoudleArray = _this.oppBusiData.TAX_INFO.TAX_NUM_INFO || _this.oppBusiData.custNumInfo || [];
            //回填联系地址和出生地址
            let tempLinkAddress = "";
            if (_.indexOf(["CHN", "HKG", "MAC", "CTN"], _this.oppBusiData.TAX_INFO.TAX_BASIC_INFO.COUNTRY) != -1
                && _this.oppBusiData.TAX_INFO
                && _this.oppBusiData.TAX_INFO.TAX_BASIC_INFO.COUNTRY) {
                let transArray = await dict.transformDict([{ "CITIZENSHIP": _this.oppBusiData.TAX_INFO.TAX_BASIC_INFO.COUNTRY }], "CITIZENSHIP")
                tempLinkAddress = (transArray[0] && transArray[0].CITIZENSHIP_TEXT || "") + _this.oppBusiData.TAX_INFO.TAX_BASIC_INFO.PROVINCE + _this.oppBusiData.TAX_INFO.TAX_BASIC_INFO.CITY + _this.oppBusiData.TAX_INFO.TAX_BASIC_INFO.STREET1 + _this.oppBusiData.TAX_INFO.TAX_BASIC_INFO.STREET2 || "";//吉林省长春市九台区;//天津市红桥区 asdf
                _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE5[0].FIELDS.ADDRESS.showCountrySelector = false;
                _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE5[0].FIELDS.ADDRESS.DEFAULT_VALUE = tempLinkAddress;
                _this.oppBusiData.TAX_INFO.TAX_BASIC_INFO.ADDRESS = tempLinkAddress;
            }

            let tempBirthAddress = "";
            if (_.indexOf(["CHN", "HKG", "MAC", "CTN"], _this.oppBusiData.TAX_INFO.TAX_BASIC_INFO.BRH_COUNTRY) != -1
                && _this.oppBusiData.TAX_INFO
                && _this.oppBusiData.TAX_INFO.TAX_BASIC_INFO.BRH_COUNTRY_EN) {
                let transArray = await dict.transformDict([{ "CITIZENSHIP": _this.oppBusiData.TAX_INFO.TAX_BASIC_INFO.BRH_COUNTRY }], "CITIZENSHIP")
                tempBirthAddress = (transArray[0] && transArray[0].CITIZENSHIP_TEXT || "") + _this.oppBusiData.TAX_INFO.TAX_BASIC_INFO.BRH_PROVINCE + _this.oppBusiData.TAX_INFO.TAX_BASIC_INFO.BRH_CITY + _this.oppBusiData.TAX_INFO.TAX_BASIC_INFO.BRH_STREET1 + _this.oppBusiData.TAX_INFO.TAX_BASIC_INFO.BRH_STREET2 || "";//吉林省长春市九台区
                _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE5[0].FIELDS.BIRTH_ADDRESS.showCountrySelector = false;
                _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE5[0].FIELDS.BIRTH_ADDRESS.DEFAULT_VALUE = tempBirthAddress;
                _this.oppBusiData.TAX_INFO.TAX_BASIC_INFO.BIRTH_ADDRESS = tempBirthAddress;
            }

            if (!_this.oppBusiData.TAX_INFO) {
                _this.oppBusiData.TAX_INFO = {};
            }
            console.log(' _this.oppBusiData.TAX_INFO===', _this.oppBusiData.TAX_INFO);
            //回填个人涉税信息数据
            for (let gk in _this.groupDatas) {
                if (gk !== "TAX_INFO") {
                    continue;
                }
                for (let md in _this.groupDatas[gk]) {
                    if (!_.isEmpty(_this.oppBusiData.TAX_INFO)) {
                        for (let fk in _this.groupDatas[gk][md][0].FIELDS) {
                            if (fk == "TAX_RESIDENT_TYPE") {
                                _this.groupDatas[gk][md][0]["FIELDS"][fk]["DEFAULT_VALUE"] = _this.oppBusiData.TAX_INFO.TAX_BASIC_INFO["TAX_FLAG"] || "";
                            } else if (fk == "TAX_ID_FLAG") {
                                _this.groupDatas[gk][md][0]["FIELDS"][fk]["DEFAULT_VALUE"] = _this.oppBusiData.TAX_INFO["TAX_ID_FLAG"] || "";
                            } else if (fk == "TAX_ID_RESON") {
                                _this.groupDatas[gk][md][0]["FIELDS"][fk]["DEFAULT_VALUE"] = _this.oppBusiData.TAX_INFO["TAX_DES_REASON"] || "";
                            } else if (_this.oppBusiData.TAX_INFO.TAX_BASIC_INFO[fk]) {
                                _this.groupDatas[gk][md][0]["FIELDS"][fk]["DEFAULT_VALUE"] = _this.oppBusiData.TAX_INFO.TAX_BASIC_INFO[fk];
                            } else {
                                //历史数据没有该字段的值 不回填，防止把标题字段的值清除掉
                            }
                        }
                    }
                    if (_this.groupDatas[gk][md][0].MODULE_ID === "CUST_TAX_INFO_MODULE7") {
                        let mdtpl = _.cloneDeep(_this.groupDatas[gk][md][0]);
                        for (let i = 0; i < custTaxMoudleArray.length; i++) {
                            let bdd = custTaxMoudleArray[i];
                            let mdd = _.cloneDeep(mdtpl);
                            for (let fk in bdd) {
                                if (fk in mdd.FIELDS && bdd[fk] !== null) {
                                    mdd["FIELDS"][fk]["DEFAULT_VALUE"] = bdd[fk];
                                } else if ("MODULE_NUM_FIELD" in mdd && fk === mdd["MODULE_NUM_FIELD"]) { // 多组数据，取出一柜通NUM字段值并赋值MODULE_NUM
                                    mdd["MODULE_NUM"] = bdd[fk];
                                }
                            }
                            if (i > 0) {
                                mdd.MODULE_SEQ = parseInt(mdd["MODULE_SEQ"]) + _this.groupDatas[gk][md].length + "";
                                _this.groupDatas[gk][md].push(mdd);
                            } else {
                                _this.groupDatas[gk][md][i] = mdd;
                            }
                        }
                    }
                }
            }
            //如果custTaxMoudleArray 涉税国信息为空，则需要勾选涉税国信息为空原因
            if (_this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE6[0].FIELDS.TAX_ID_FLAG.DEFAULT_VALUE == 1) {
                _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE7[0].MODULE_CONTROL = "1";
            } else {
                _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE7[0].MODULE_CONTROL = "0";
            }
            //暂时屏蔽银行逻辑 
            // //默认银行密码为空
            // if(_this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.BANK_AUTH_DATA){
            //     _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.BANK_AUTH_DATA.DEFAULT_VALUE = ""; 
            // }
            //判断信息是否与本人信息一致。如果一致，则与本人一致按钮选中
            let custNameStr = "";
            if (_this.busiCode == "V0011") {
                if (_this.oppBusiData.custBaseInfo && _this.oppBusiData.custBaseInfo.USER_FNAME) {
                    custNameStr = _this.oppBusiData.custBaseInfo.USER_FNAME;
                }
            } else {
                custNameStr = _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.CUST_FNAME.DEFAULT_VALUE;
            }

            let nameObj = stringConfig.getFirstName(custNameStr);//过滤姓
            if (JSON.stringify(_this.oppBusiData.TAX_INFO) != "{}"
                && _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE2[0].FIELDS.LAST_NAME.DEFAULT_VALUE == nameObj && _.isObject(nameObj) && nameObj[0]
                && _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE2[0].FIELDS.FIRST_NAME.DEFAULT_VALUE == nameObj && _.isObject(nameObj) && nameObj[1]
                && _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE2[0].FIELDS.LAST_NAME_EN.DEFAULT_VALUE == stringPinyinConfig.ConvertPinyin(nameObj[0])
                && _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE2[0].FIELDS.FIRST_NAME_EN.DEFAULT_VALUE == stringPinyinConfig.ConvertPinyin(nameObj[1])
                && _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE2[0].FIELDS.BIRTH_DAY.DEFAULT_VALUE == _this.oppBusiData.TAX_INFO.TAX_BASIC_INFO.BIRTH_DAY.length > 7 && (_this.oppBusiData.TAX_INFO.TAX_BASIC_INFO.BIRTH_DAY.substring(0, 4) + _this.oppBusiData.TAX_INFO.TAX_BASIC_INFO.BIRTH_DAY.substring(4, 6) + _this.oppBusiData.TAX_INFO.TAX_BASIC_INFO.BIRTH_DAY.substring(6, 8)) || _this.oppBusiData.TAX_INFO.TAX_BASIC_INFO.BIRTH_DAY) {
            } else {
                _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE2[0].FIELDS.LAST_NAME.DEFAULT_VALUE = JSON.stringify(_this.oppBusiData.TAX_INFO) != "{}" ? _this.oppBusiData.TAX_INFO.TAX_BASIC_INFO.LAST_NAME : "";
                _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE2[0].FIELDS.FIRST_NAME.DEFAULT_VALUE = JSON.stringify(_this.oppBusiData.TAX_INFO) != "{}" ? _this.oppBusiData.TAX_INFO.TAX_BASIC_INFO.FIRST_NAME : "";
                _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE2[0].FIELDS.LAST_NAME_EN.DEFAULT_VALUE = JSON.stringify(_this.oppBusiData.TAX_INFO) != "{}" ? _this.oppBusiData.TAX_INFO.TAX_BASIC_INFO.LAST_NAME_EN : "";
                _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE2[0].FIELDS.FIRST_NAME_EN.DEFAULT_VALUE = JSON.stringify(_this.oppBusiData.TAX_INFO) != "{}" ? _this.oppBusiData.TAX_INFO.TAX_BASIC_INFO.FIRST_NAME_EN : "";
                _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE2[0].FIELDS.BIRTH_DAY.DEFAULT_VALUE = JSON.stringify(_this.oppBusiData.TAX_INFO) != "{}" ? _this.oppBusiData.TAX_INFO.TAX_BASIC_INFO.BIRTH_DAY : "";
            }
        }
    },
    //个人等涉税信息
    "CHECK_TAX_FLAG": function (_this, field, fieldData) {
        _this.$router.getCurrentRoute().nextBtnText = "下一步";
        if (field.DEFAULT_VALUE != "" && field.FIELD_LAST_CHOOSE_VALUE && field.FIELD_LAST_CHOOSE_VALUE != undefined && field.FIELD_LAST_CHOOSE_VALUE != "")
            field.DEFAULT_VALUE = field.FIELD_LAST_CHOOSE_VALUE;
        //关联数据
        if (field.MODULE_ID == "CUST_TAX_INFO_MODULE1") {
            if (_this.userType == "0") {
                if (field.DEFAULT_VALUE === "" || field.DEFAULT_VALUE === undefined) {
                    //字段为空时，隐藏关联模块
                    //如果不选择提示当前字段为必填项
                    _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE2[0].MODULE_CONTROL = "0";
                    //_this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE8[0].MODULE_CONTROL = "0";

                } else if (field.DEFAULT_VALUE === "1") {
                    //选择了仅中国居民和豁免
                    _this.$router.hideRoute("涉税信息现居出生国家信息");
                    _this.$router.hideRoute("涉税信息税收居民国信息");
                    // _this.$router.hideRoute("涉税信息资产信息");
                    _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE2[0].MODULE_CONTROL = "0";
                    //_this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE8[0].MODULE_CONTROL = "1";

                } else {
                    //上面过滤了条件，这里仅剩类型2和3
                    _this.$router.showRoute("涉税信息现居出生国家信息");
                    _this.$router.showRoute("涉税信息税收居民国信息");
                    // _this.$router.showRoute("涉税信息资产信息");
                    _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE2[0].MODULE_CONTROL = "1";
                    //_this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE8[0].MODULE_CONTROL = "0";
                }
            }
        }
    },
    "CHECK_COUNTRY_EN": function (_this, field, fieldData) {
        if (field.DEFAULT_VALUE != "" && field.FIELD_LAST_CHOOSE_VALUE && field.FIELD_LAST_CHOOSE_VALUE != undefined && field.FIELD_LAST_CHOOSE_VALUE != "")
            field.DEFAULT_VALUE = field.FIELD_LAST_CHOOSE_VALUE;

        if (_.indexOf(["CHN", "HKG", "MAC", "CTN"], field.DEFAULT_VALUE) != -1) {
            _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE5[0].MODULE_CONTROL = "1";
            _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE5[0].FIELDS.ADDRESS.FIELD_CONTROL = "0";
        } else {
            _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE5[0].FIELDS.ADDRESS.FIELD_CONTROL = "1";
            //如果出生国家也非中国 需要隐藏整个模块
            if (_.indexOf(["CHN", "HKG", "MAC", "CTN"], _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE4[0].FIELDS.BRH_COUNTRY_EN.DEFAULT_VALUE) == -1) {
                _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE5[0].MODULE_CONTROL = "0";
            } else {
                _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE5[0].MODULE_CONTROL = "1";
            }
        }


    },
    "CHECK_BRH_COUNTRY_EN": function (_this, field, fieldData) {
        if (field.DEFAULT_VALUE != "" && field.FIELD_LAST_CHOOSE_VALUE && field.FIELD_LAST_CHOOSE_VALUE != undefined && field.FIELD_LAST_CHOOSE_VALUE != "")
            field.DEFAULT_VALUE = field.FIELD_LAST_CHOOSE_VALUE;

        if (_.indexOf(["CHN", "HKG", "MAC", "CTN"], field.DEFAULT_VALUE) != -1) {
            _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE5[0].MODULE_CONTROL = "1";
            _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE5[0].FIELDS.BIRTH_ADDRESS.FIELD_CONTROL = "0";
        } else {
            _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE5[0].FIELDS.BIRTH_ADDRESS.FIELD_CONTROL = "1";
            //如果居住国家也非中国 需要隐藏整个模块
            if (_.indexOf(["CHN", "HKG", "MAC", "CTN"], _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE3[0].FIELDS.COUNTRY_EN.DEFAULT_VALUE) == -1) {
                _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE5[0].MODULE_CONTROL = "0";
            } else {
                _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE5[0].MODULE_CONTROL = "1";
            }
        }
    },
    "CHECK_GET_INVEST_CERFLAG": function (_this, field, fieldData) {
        if (field.DEFAULT_VALUE != "" && field.FIELD_LAST_CHOOSE_VALUE && field.FIELD_LAST_CHOOSE_VALUE != undefined && field.FIELD_LAST_CHOOSE_VALUE != "")
            field.DEFAULT_VALUE = field.FIELD_LAST_CHOOSE_VALUE;
    },
    "CHECK_NATION_ENG": (_this, field, fieldData) => {
        if (field.DEFAULT_VALUE == "CN") {
            fieldData.PROVINCE.FIELD_CONTROL = "0"
            fieldData.CITYCN.FIELD_CONTROL = "0"
            fieldData.DISTRICT_NAME.FIELD_CONTROL = "0"
            fieldData.PROVINCE.FIELD_REQUIRED = "1"
            fieldData.CITYCN.FIELD_REQUIRED = "1"
            fieldData.DISTRICT_NAME.FIELD_REQUIRED = "1"
            if (field.MODULE_ID == "CUST_TAX_INFO_MODULE3") {
                fieldData.ADDRESS.FIELD_REQUIRED = "1"
            }
        } else {
            fieldData.PROVINCE.FIELD_CONTROL = "2"
            fieldData.CITYCN.FIELD_CONTROL = "2"
            fieldData.DISTRICT_NAME.FIELD_CONTROL = "2"
            fieldData.PROVINCE.FIELD_REQUIRED = "0"
            fieldData.CITYCN.FIELD_REQUIRED = "0"
            fieldData.DISTRICT_NAME.FIELD_REQUIRED = "0"
            fieldData.PROVINCE.DEFAULT_VALUE = ""
            fieldData.CITYCN.DEFAULT_VALUE = ""
            fieldData.DISTRICT_NAME.DEFAULT_VALUE = ""
            if (field.MODULE_ID == "CUST_TAX_INFO_MODULE3") {
                fieldData.ADDRESS.FIELD_REQUIRED = "0"
            }
        }
    },
    "CHECK_BIRTH_NATION_ENG": (_this, field, fieldData) => {
        if (field.DEFAULT_VALUE == "CN") {
            fieldData.BIRTH_ADDRESS_ENG.FIELD_REQUIRED = "1"
        } else {
            fieldData.BIRTH_ADDRESS_ENG.FIELD_REQUIRED = "0"
        }
    },
    "CHECK_PROVINCE": (_this, field, fieldData) => {
        if (field.DEFAULT_VALUE != "") {
            fieldData.CITYCN.DEFAULT_VALUE = ""
            fieldData.DISTRICT_NAME.DEFAULT_VALUE = ""
            fieldData.CITYCN.FIELD_DICT_FILTER = _.chain(fieldData.CITYCN.FIELD_DICT_NAME).map(v => {
                return v.DICT_ITEM;
            }).filter(v => {
                return _.startsWith(v, field.DEFAULT_VALUE.slice(0, 2));
            }).value();
        }
    },
    "CHECK_CITYCN": (_this, field, fieldData) => {
        fieldData.DISTRICT_NAME.DEFAULT_VALUE = ""
        if (field.DEFAULT_VALUE != "") {
            fieldData.DISTRICT_NAME.FIELD_DICT_FILTER = _.chain(fieldData.DISTRICT_NAME.FIELD_DICT_NAME).map(v => {
                return v.DICT_ITEM;
            }).filter(v => {
                if (_.endsWith(field.DEFAULT_VALUE, "0000")) {
                    //直辖市
                    return _.startsWith(v, field.DEFAULT_VALUE.slice(0, 2));
                } else {
                    return _.startsWith(v, field.DEFAULT_VALUE.slice(0, 4));
                }
            }).value();
             // 县区代码有2000多条，设置了过滤项之后开始初始化
            _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE8[0].FIELDS.DISTRICT_NAME.forbidInitDict = false;
            console.log('DISTRICT_NAME.FIELD_DICT_FILTER',fieldData.DISTRICT_NAME.FIELD_DICT_FILTER)
        }
    },
    "CHECK_HAS_TAXPAYER_IDNO": (_this, field, fieldData) => {
        if (field.DEFAULT_VALUE == "0") {
            fieldData.OPP_NO_TAXPAYERID_REASON.FIELD_CONTROL = "0";
            fieldData.TAXPAYER_IDNO.FIELD_CONTROL = "1"
            fieldData.TAXPAYER_IDNO.DEFAULT_VALUE = ""
        } else if (field.DEFAULT_VALUE == "1") {
            fieldData.OPP_NO_TAXPAYERID_REASON.FIELD_CONTROL = "1";
            fieldData.TAXPAYER_IDNO.FIELD_CONTROL = "0"
            fieldData.OPP_NO_TAXPAYERID_REASON.DEFAULT_VALUE = ""
        }
    },
    "CHECK_OPP_NO_TAXPAYERID_REASON": (_this, field, fieldData) => {
        if (field.DEFAULT_VALUE == "2") {
            fieldData.NO_TAXPAYERID_REASON.FIELD_CONTROL = "0"
        } else {
            fieldData.NO_TAXPAYERID_REASON.FIELD_CONTROL = "1"
            fieldData.NO_TAXPAYERID_REASON.DEFAULT_VALUE = ""
        }
    },
    "CHECK_PAYMENT_ASSET": (_this, field, fieldData) => {
        checkPaymentInfoRequired(_this, fieldData);
    },
    "CHECK_PAYMENT_CURR": (_this, field, fieldData) => {
        checkPaymentInfoRequired(_this, fieldData);
    },
    "CHECK_PAYMENT_TYPE": (_this, field, fieldData) => {
        checkPaymentInfoRequired(_this, fieldData);
    },
}