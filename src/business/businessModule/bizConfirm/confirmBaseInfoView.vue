<template>
    <div class='confirm-base-table-List'>
        <div class="custInfoTitle"><span></span>客户资料<span></span></div>
        <!-- <div class="normalText" v-if="isOpen">
            <div class="textTitle"><span>▌</span>客户开户</div>
            <div class="textContent">
                <div class="textLabel">客户代码:</div>
                <div class="textValue">开通</div>
            </div>
        </div> -->
        <div class="normalText" v-for="(normalValue,normalKey) in textInfoData" v-if="normalValue" :key="normalKey">
            <div class="textTitle"><span>▌</span>{{normalValue.title}}</div>
            <div :class="{textContent: !textItem.subFlag, longContent: textItem.isLongField}"
                 v-for="(textItem,tindex) in normalValue.filter" :key="tindex">
                <template v-if="textItem.subFlag">
                    <div class="subTitle">{{textItem.title}}</div>
                    <div :class="{textContent: true, longContent: subTextItem.isLongField}"
                         v-for="(subTextItem, sIndex) in textItem.subField" :key="sIndex">
                        <div class="textLabel">{{subTextItem.title+"："}}</div>
                        <div class="textValue">{{subTextItem.value}}</div>
                    </div>
                </template>
                <template v-else>
                    <div>
                        <div class="textLabel">{{textItem.title+"："}}</div>
                        <div class="textValue">{{textItem.value}}</div>
                    </div>
                </template>
            </div>
            <div class="text-tip" v-if="normalValue.tip"> {{normalValue.tip}}</div>
        </div>
    </div>
</template>
<script>
import dict from '../../../tools/dict'
import org from '../../../tools/org'
import custKeyFieldMap from './cust-key-field-map'
export default {
    data() {
        return {
            textInfoData: [],
            longField: [],
            keyFieldMap: {},
            hasInit: false,
            tempIndex: 0
        }
    },
     computed: {
        userType() { // 用户类型 0个人/1机构/2产品
            return this.$store.state.usertype;
        },
        busiCode() {
            return this.$store.state.busicode
        },
    },
    mounted() {
        // let busi_info = this.$storage.getJsonSession(this.$definecfg.BUSI_INFO);
        // if (this.userType == '0') {
        //     this.keyFieldMap = Object.assign({}, custKeyFieldMap);
        // }
        // if (!_.isEmpty(busi_info.CUST_INFO.CUST_BASIC_INFO)) {
        //     this.getBasicInfo(busi_info.CUST_INFO.CUST_BASIC_INFO[0]);
        // }
        // if (!_.isEmpty(busi_info.CUST_INFO.CUST_LINK_INFO)) {
        //     this.getCustLinkInfo(busi_info.CUST_INFO.CUST_LINK_INFO[0]);
        // }
        // this.hasInit = true;
    },
    activated() {
        let busi_info = this.$storage.getJsonSession(this.$definecfg.BUSI_INFO);
        this.busi_info = busi_info;
        this.busiCommParam = busi_info.BUSI_COMM_PARAM;
        this.textInfoData.splice(0, this.textInfoData.length);
        this.textInfoData.length = 20;
        this.tempIndex = 0;
        if (this.userType == '0') {
            this.keyFieldMap = Object.assign({}, custKeyFieldMap);
        }
        if (!_.isEmpty(busi_info.CUST_INFO.CUST_BASIC_INFO)) {
            this.getBasicInfo(busi_info.CUST_INFO.CUST_BASIC_INFO[0]);
        }
        if (!_.isEmpty(busi_info.CUST_INFO.CUST_LINK_INFO)) {
            this.getCustLinkInfo(busi_info.CUST_INFO.CUST_LINK_INFO[0]);
        }
        if (!_.isEmpty(busi_info.RELA_INFO.CUST_CONTROLER_INFO)) {
            this.getControllerInfo(busi_info.RELA_INFO.CUST_CONTROLER_INFO);
        }
        if (!_.isEmpty(busi_info.RELA_INFO.CUST_OTHER_LINK_INFO)) {
            this.getOtherLinkInfo(busi_info.RELA_INFO.CUST_OTHER_LINK_INFO);
        }
        if (!_.isEmpty(busi_info.RELA_INFO.CUST_BENEFICIARY_INFO)) {
            this.getBeneficiaryInfo(busi_info.RELA_INFO.CUST_BENEFICIARY_INFO);
        }
        if (!_.isEmpty(busi_info.RELA_INFO.CUST_GUARDIAN_INFO)) {
            this.getGuardianInfo(busi_info.RELA_INFO.CUST_GUARDIAN_INFO);
        }
        if (!_.isEmpty(busi_info.RELA_INFO.CUST_OTHER_INFO)) {
            this.getOtherInfo(busi_info.RELA_INFO.CUST_OTHER_INFO);
        }
        if (!_.isEmpty(busi_info.RELA_INFO.CREDIT_RECORD_INFO)) {
            this.getCustCreditRecordInfo(busi_info.RELA_INFO.CREDIT_RECORD_INFO);
        }
        // if (!_.isEmpty(busi_info.RELA_INFO.CUST_TAX_INFO)) {
        //     this.getCustTaxInfo(busi_info.RELA_INFO.CUST_TAX_INFO);
        // }
        if (!_.isEmpty(busi_info.ACCT_INFO.FOUNDATION_AML_INFO)) {
            this.getCustFundAmlInfo(busi_info.ACCT_INFO.FOUNDATION_AML_INFO);
        }
        if (!_.isEmpty(busi_info.ACCT_INFO.TRACCT_INFO)) {
            this.getCustTracctInfo(busi_info.ACCT_INFO.TRACCT_INFO);
        }
        this.getAcctBankInfo(busi_info.ACCT_INFO);
        if (!_.isEmpty(busi_info.ACCT_INFO.LINK_FLAG)) {
            this.getPwdInfo(busi_info.ACCT_INFO.LINK_FLAG);
        }
        if (!_.isEmpty(busi_info.RISK_INFO)) {
            this.getRiskInfo(busi_info.RISK_INFO);
        }
    },
    methods: {
        getBasicInfo(BASIC_INFO) {
            let lastIndex = this.tempIndex;
            this.tempIndex += 1;
            // let showFiled = ['CUST_FNAME', 'CUST_NAME', 'ID_TYPE', 'ID_CODE', 'ID_BEG_DATE',
            // 'ID_EXP_DATE', 'BIRTHDAY', 'SEX', 'NATIONALITY', 'ID_ADDR', 'ID_ISS_AGCY', 'SUBJECT_IDENTITY', 'NOUTSIDE_IDENTITY', 'CITIZENSHIP', 'NATIVE_PLACE', 'EDUCATION',
            // 'ANTI_MONEYLAUNDRY_TYPE', 'OCCU_TYPE', 'VOCATION', 'WORKPLACE', 'POSITION', 'TRADE','UNDER_AGE', 'INDUS_GB', 'INDUS_GB_SUB', 'INDUS_TYPE', 'OCCU_GB', 'OCCU_GB_SUB', 'CUST_GRP', 'CUST_AGMT_TYPE', 'CHANNELS', 'ANNUAL_INCOME', 'PROF_INVESTOR_TYPE']
            return dict.transformDict(BASIC_INFO, [
                "ID_TYPE",
                "SEX",
                "CITIZENSHIP",
                "NATIONALITY",
                "SUBJECT_IDENTITY",
                "SPECIAL_STATUS",
                "INOUTSIDE_IDENTITY",
                "EDUCATION",
                "UNDER_AGE",
                "POSITION",
                "OCCU_GB",
                "OCCU_GB_SUB",
                "INDUS_GB",
                "INDUS_GB_SUB",
                "PROF_INVESTOR_TYPE",
                "PROF_INVESTOR_SOURCE",
                "CUST_GRP",
                "CUST_AGMT_TYPE",
                "ANNUAL_INCOME",
                "ANTI_MONEYLAUNDRY_TYPE",
                {
                    "CHANNELS": "CHANNEL",
                    "OCCU_TYPE": "OCCU_EXTYPE",
                    "TRADE": "CIF_TRADE",
                    "OTHER_ID_TYPE": "ID_TYPE",
                    "FZ_ID_TYPE": "ID_TYPE",
                    "VOCATION": "CIF_VOCATION",
                    "INDUS_TYPE": "INDUS_EXTYPE"
                }
            ]).then(basicInfoObj => {
                this.addNewData(basicInfoObj, 'CUST_BASIC_INFO', '基本信息', lastIndex);
            })
        },
        getCustLinkInfo(CUST_LINK_INFO) {
            let lastIndex = this.tempIndex;
            this.tempIndex += 1;
            return dict.transformDict(CUST_LINK_INFO, [{"AML_REMARK": "AML_REM"}]).then(custLinkInfoObj => {
                this.addNewData(custLinkInfoObj, "CUST_LINK_INFO", '联系信息', lastIndex);
            })
        },
        getControllerInfo(CUST_CONTROLER_INFO) {
            let lastIndex = this.tempIndex;
            this.tempIndex += CUST_CONTROLER_INFO.length;
            let asyncArr = [];
            _.each(CUST_CONTROLER_INFO, objArr => {
                asyncArr.push(dict.transformDict(objArr, [
                    {
                        "CONTROLER_RELATION": "RELATION",
                        "CONTROLER_ID_TYPE": "ID_TYPE",
                        "OCCU_TYPE": "OCCU_EXTYPE",
                        "NATION":"CITIZENSHIP",
                        "CONTROLER_SEX":"SEX"
                    }
                ]))
            })
            return Promise.all(asyncArr).then(custControllerInfo => {
                _.each(custControllerInfo, (controllerObj, index)=> {
                    this.addNewData(controllerObj, "CUST_CONTROLLER_INFO", "实际控制人-" + index + 1, lastIndex + index);
                })
            })
        },
        getOtherLinkInfo(CUST_OTHER_LINK_INFO) {
            let asyncArr = [];
            let lastIndex = this.tempIndex;
            this.tempIndex += CUST_OTHER_LINK_INFO.length;
            _.each(CUST_OTHER_LINK_INFO, objArr => {
                asyncArr.push(dict.transformDict(objArr, [{"LINKMAN_ID_TYPE": "ID_TYPE","LINKMAN_SEX":"SEX","IME_TYPE":"IME_TYPE"}]))
            })
            return Promise.all(asyncArr).then(otherLinkInfo => {
                _.each(otherLinkInfo, (otherLinkInfoObj, index) => {
                    this.addNewData(otherLinkInfoObj, "CUST_OTHER_LINK_INFO", "其他联系人-" + index + 1, lastIndex + index);
                })
            })
        },
        getBeneficiaryInfo(CUST_BENEFICIARY_INFO) {
            let asyncArr = [];
            let lastIndex = this.tempIndex;
            this.tempIndex += CUST_BENEFICIARY_INFO.length;
            _.each(CUST_BENEFICIARY_INFO, objArr => {
                asyncArr.push(dict.transformDict(objArr, [
                    "BENEFICIARY_TYPE","SEX","SPECIAL_PERSON_FLAG",
                    {"BENEFICIARY_ID_TYPE": "ID_TYPE"},
                    {"BENEFICIARY_RELA": "RELATION"},
                    {"OCCU_TYPE": "OCCU_EXTYPE"},
                    {"NATION": "CITIZENSHIP"}
                ]))
            })
            return Promise.all(asyncArr).then(beneficiaryInfo => {
                _.each(beneficiaryInfo, (beneficiaryInfoObj, index) => {
                    this.addNewData(beneficiaryInfoObj, "CUST_BENEFICIARY_INFO", "受益人信息-" + index + 1, lastIndex + index);
                })
            })
        },
        getGuardianInfo(CUST_GUARDIAN_INFO) {
            let asyncArr = [];
            let lastIndex = this.tempIndex;
            this.tempIndex += CUST_BENEFICIARY_INFO.length;
            _.each(CUST_GUARDIAN_INFO, objArr => {
                asyncArr.push(dict.transformDict(objArr, [{
                    "GUARDIAN_ID_TYPE": "ID_TYPE",
                    "GUARDIAN_RELA": "RELATION"
                }]))
            })
            return Promise.all(asyncArr).then(guardianInfo => {
                _.each(guardianInfo, (guardianInfoObj, index) => {
                    this.addNewData(guardianInfoObj, "CUST_GUARDIAN_INFO", "监护人信息-" + index + 1, lastIndex + index);
                })
            })
        },
        getOtherInfo(CUST_OTHER_INFO) {
            let lastIndex = this.tempIndex;
            this.tempIndex += 1;
            CUST_OTHER_INFO.RISK_LVL = CUST_OTHER_INFO.OPT_TRDACCT_LVL || "";
            CUST_OTHER_INFO.AML_RANK = CUST_OTHER_INFO.AML_FACTOR || "";
            return dict.transformDict(CUST_OTHER_INFO, [
                "RISK_LVL",
                "AML_LVL",
                "AML_RANK",
                "CUST_CLS",
                "RISK_FACTOR"
            ]).then(otherInfoObj => {
                this.addNewData(otherInfoObj, "CUST_OTHER_INFO", "其他信息", lastIndex)
            })
        },
        getCustCreditRecordInfo(CUST_CREDIT_RECORD_INFO) {
            let lastIndex = this.tempIndex;
            let obj = {
                title: '不良诚信记录',
                filter: []
            };
            let recordFlag = this.getHascreditRecordFlag(CUST_CREDIT_RECORD_INFO)
            obj.filter.push({title: '是否有不良诚信记录信息', value: recordFlag == "1" ? "是" : "否"})
            if (recordFlag) {
                this.tempIndex += CUST_CREDIT_RECORD_INFO.length;
                let asyncArr = [];
                _.each(CUST_CREDIT_RECORD_INFO, objArr => {
                    asyncArr.push(dict.transformDict(objArr, ["RECORD_SOURCE"]))
                })
                return Promise.all(asyncArr).then(creditRecordInfo => {
                    _.each(creditRecordInfo, (data,index) => {
                        this.addNewData(data, "CUST_CREDIT_RECORD_INFO", "不良诚信记录-" + index + 1, lastIndex + index)
                    })
                })
            } else {
                this.tempIndex += 1;
                this.textInfoData.splice(lastIndex, 1, obj);
            }
        },
         /**
            * 检查是否存在不良诚信记录
            * @param creditRecordInfo
            * @returns {string}
        */
        getHascreditRecordFlag: function (creditRecordInfo) {
            var hasFlag = "1",
                OPP_NO_CREDIT_RECORD_ITEM = {
                    RECORD_SOURCE:  "07",
                    RECORD_SCORE:  "0",
                    RECORD_TXT:  ""
                },
                type07Obj = _.find(creditRecordInfo, function (v) {
                        return v.RECORD_SOURCE == OPP_NO_CREDIT_RECORD_ITEM.RECORD_SOURCE;
                 });
            if(_.isEmpty(creditRecordInfo) || type07Obj){
                hasFlag = "0";
            }
            return hasFlag;
        },
        getCustTaxInfo(CUST_TAX_INFO) {
            if (!_.isArray(CUST_TAX_INFO)) {
                CUST_TAX_INFO = [CUST_TAX_INFO];
            }
            let lastIndex = this.tempIndex;
            this.tempIndex += CUST_TAX_INFO.length;
            _.each(CUST_TAX_INFO, objArr => {
                if (objArr.ADDRESS_TYPE) {
                    objArr.ADDRESS_TYPE_TEXT = objArr.ADDRESS_TYPE == "0" ? "办公地址" : "注册地址";
                }
                objArr.TAX_INFO_ITEM_DATA1 = this.$blMethod.transTaxInfoToArr(objArr);
                objArr.TAX_INFO_ITEM_DATA2 = this.$blMethod.transTaxInfoToArr(objArr);
                dict.transformDictForAllData(objArr, "TAX_RESIDENT_TYPE,NO_CHK_ORG,OPP_NO_TAXPAYERID_REASON,PROVINCE:CRS_PROVINCE_CODE,CITYCN:CRS_CITY_CODE,DISTRICT_NAME:CRS_COUNTY_CODE," +
                        "LIVING_COUNTRY:CITIZENSHIP_ST,BIRTH_COUNTRY:CITIZENSHIP_ST,CITIZENSHIP:CITIZENSHIP_ST,NATION_ENG:CITIZENSHIP_ST,BIRTH_NATION_ENG:CITIZENSHIP_ST," +
                        "HAS_TAXPAYER_IDNO:YES_NO,CTRL_NON_RESIDENT:YES_NO,PASSIVE_NFE,GET_INVEST_CERFLAG:YES_NO,REG_COUNTRY:CITIZENSHIP_ST,CTRL_TYPE,CURR_CODE:CURR_ID,PAYMENT_TYPE:CRS_PAYMENT_TYPE,PAYMENT_CURR:CURR_ID").then(data => {
                            _.each(data, (taxInfoObj, index) => {
                                let taxInfo = _.pick(taxInfoObj, ['TAX_RESIDENT_TYPE', 'GET_INVEST_CERFLAG']);
                                if (taxInfoObj.TAX_RESIDENT_TYPE != "1") {
                                    let regCountryInfo = _.pick(taxInfoObj, ['REG_COUNTRY','NAME_ENG','SURNAME_ENG','ADDRESS']);
                                    let liveCountryInfo = _.pick(taxInfoObj, ['ADDRESS_ENG', 'CITY_ENG', 'PROVINCE_ENG', 'NATION_ENG', 'PROVINCE', 'CITYCN', 'DISTRICT_NAME']);
                                    let birthCountryInfo = _.pick(taxInfoObj, ['BIRTH_ADDRESS', 'BIRTH_ADDRESS_ENG', 'BIRTH_CITY_ENG', 'BIRTH_PROVINCE_ENG', 'BIRTH_NATION_ENG']);
                                }
                                let obj = {
                                    title: '客户涉税信息',
                                    filter: []
                                };
                                if (!_.isEmpty(taxInfo)) {
                                    let temp = {
                                        title: '税收居民身份',
                                        filter: [],
                                        subFlag: true
                                    };
                                    _.each(this.transFormTemplateData(taxInfo), (value, key) => {
                                        temp.push({title: key, subFlag: true, filter: value})
                                    });
                                    obj.filter.push(temp);
                                }
                                this.textInfoData.splice(lastIndex, 1, obj);
                                // // if (!_.isEmpty(regCountryInfo))
                                // _.each(this.transFormTemplateData(regCountryInfo), (value, key) => {
                                //     obj.filter.push({title: key, value: value});
                                // })
                                // _.each(this.transFormTemplateData(liveCountryInfo, (value, key) => {
                                //     obj.filter.push({title: key, value: value});
                                // }))
                            })
                        })
            })
        },
        getCustFundAmlInfo(FOUNDATION_AML_INFO) {
            let lastIndex = this.tempIndex;
            this.tempIndex += 1;
            return dict.transformDict(FOUNDATION_AML_INFO, {
                "NATION_ENG": "CITIZENSHIP_ST",
                "PROVINCE":"CRS_PROVINCE_CODE",
                "CITYCN":"CRS_CITY_CODE",
                "DISTRICT_NAME":"CRS_COUNTY_CODE"
            }).then(foundmlInfo => {
                this.addNewData(foundmlInfo, "FOUNDATION_AML_INFO", '基金反洗钱信息', lastIndex);
            })
        },
        getCustTracctInfo(TRACCT_INFO) {
            let lastIndex = this.tempIndex;
            this.tempIndex += 1;
            let tracctInfoArr = this.formatterTrdacctData(TRACCT_INFO, this.busi_info);
            let obj = {
                title: '股东账号',
                filter: []
            };
            _.each(tracctInfoArr, tracctInfoObj => {
                _.each(this.keyFieldMap[key], (value, key) => {
                    if (tracctInfoArr[key]) {
                        if (value.dict) {
                            obj.filter.push({title: value.name, value: TEMPLATE_DATA[key + '_TEXT']})
                        } else {
                            obj.filter.push({title: value.name,  value: TEMPLATE_DATA[key]})
                        }
                    }
                })
                if (tracctInfoObj.SHOW_STKPBU_FLAG && tracctInfoObj.OPEN_TYPE != "1") {
                    obj.filter.push({title: '交易单元', value: tracctInfoObj.STKPBU});
                }
                if (this.busiCommParam && this.busiCommParam.SHOW_TREG_FLAG == "1" && this.busiCommParam.AUTO_TREG_FLAG) {
                    obj.filter.push({title: '指定委托', value: tracctInfoObj.AUTO_TREG_FLAG == '1' ? '指定' : '不指定'});
                }
            })
            obj.filter.push({title: '网络服务', value: this.busi_info.ACCT_INFO.NET_INFO.NET_SERVICE == "1" ? "开通" : "不开通"});
            this.textInfoData.splice(lastIndex, 1, obj);
        },
        formatterTrdacctData: function (arr, busiData) {
            var acctArr = [],
                showStkpbuFlag = (busiData.BUSI_COMM_PARAM.SHOW_STKPBU_FLAG || busiData.BUSI_COMM_PARAM.SHOW_STKPBU_FALG || "0") == "1";
            _.each(arr, function (obj) {
                obj.SHOW_STKPBU = showStkpbuFlag;
                obj.TRDACCT = _.trim(obj.TRDACCT);
                obj.NEW_OPEN_FLAG_TEXT = obj.NEW_OPEN_FLAG === "0" ? "加挂" : "新开";
                switch (obj.STKBD){
                    case "00":
                        obj.STKBD_TEXT = obj.OPEN_TYPE === "0" ? "深A账户" : "深基金账户";
                        break;
                    case "10":
                         obj.STKBD_TEXT = obj.OPEN_TYPE === "0" ? "沪A账户" : "沪基金账户";
                        break;
                    case "01":
                        obj.STKBD_TEXT = "深B账户";
                        break;
                    case "11":
                        obj.STKBD_TEXT = "沪B账户";
                        break;
                    case "20":
                        obj.STKBD_TEXT = "股转A账户";
                        break;
                    case "21":
                        obj.STKBD_TEXT = "股转B账户";
                        break;
                }
                acctArr.push(obj);
            });
            return acctArr;
        },
        getAcctBankInfo(ACCT_INFO) {
            let CNY_BANK_INFO = ACCT_INFO.CNY_BANK_INFO,
                HK_BANK_INFO = ACCT_INFO.HK_BANK_INFO,
                US_BANK_INFO = ACCT_INFO.US_NANK_INFO;
            let lastIndex = this.tempIndex;
            this.tempIndex += 1;
            if (!_.isEmpty(CNY_BANK_INFO)) {
                if (_.isArray(CNY_BANK_INFO)) {
                    CNY_BANK_INFO = CNY_BANK_INFO[0]
                }
            }
            if (!_.isEmpty(HK_BANK_INFO)) {
                if (_.isArray(HK_BANK_INFO)) {
                    HK_BANK_INFO = HK_BANK_INFO[0];
                }
            }
            if (!_.isEmpty(US_BANK_INFO)) {
                if (_.isArray(US_BANK_INFO)) {
                    US_BANK_INFO = US_BANK_INFO[0];
                }
            }
            return dict.transformDict(CNY_BANK_INFO, [
                "ID_TYPE",
                {"BANK_ID_TYPE": "ID_TYPE"}
            ]).then(cnyBankInfoObj => {
                let asyncArr = [];
                !_.isEmpty(CNY_BANK_INFO) && asyncArr.push(org.transFormData(cnyBankInfoObj, "EXT_ORG", "1"));
                !_.isEmpty(HK_BANK_INFO) && asyncArr.push(org.transFormData(HK_BANK_INFO, "EXT_ORG", "1"));
                !_.isEmpty(US_BANK_INFO) && asyncArr.push(org.transFormData(US_BANK_INFO, "EXT_ORG", "1"));
                return Promise.all(asyncArr).then(data => {
                    let obj = {
                        title: '资金账户',
                        filter: []
                    };
                    obj.filter.push({title: '资金账号', value: ACCT_INFO.CUACCT_CODE});
                    // if (ACCT_INFO.CUACCT_ATTR) {
                    //     obj.filter.push({title: '资产属性', value: ACCT_INFO.CUACCT_ATTR_TEXT});
                    // }
                    // ACCT_INFO.CUACCT_CLS && obj.filter.push({title: '资金类别', value: ACCT_INFO.CUACCT_CLS_TEXT});
                    // ACCT_INFO.CUACCT_LVL && obj.filter.push({title: '资金级别', value: ACCT_INFO.CUACCT_LVL_TEXT});
                    // ACCT_INFO.CUACCT_GRP && obj.filter.push({title: '资金组别', value: ACCT_INFO.CUACCT_GRP_TEXT});
                    if (data[0] && data[0].EXT_ORG) {
                        obj.filter.push({title: '三方存管银行', value: data[0].EXT_ORG_TEXT});
                        obj.filter.push({title: '银行账户', value: data[0].BANK_ACCT});
                        data[0].BANK_CUST_NAME != "" && obj.filter.push({title: '银证账户客户姓名', value: data[0].BANK_CUST_NAME});
                        data[0].BANK_ID_TYPE != "" && obj.filter.push({title: '证件类型', value: data[0].BANK_ID_TYPE_TEXT});
                        data[0].BANK_ID_CODE != "" && obj.filter.push({title: '证件号码', value: data[0].BANK_ID_CODE});
                    }
                    if (data[1] && data[1].EXT_ORG) {
                        obj.filter.push({title: '港币转账银行', value: data[0].EXT_ORG_TEXT});
                        obj.filter.push({title: '银行账户', value: data[0].BANK_ACCT});
                    }
                    if (data[2] && data[2].EXT_ORG) {
                        obj.filter.push({title: '美元转账银行', value: data[0].EXT_ORG_TEXT});
                        obj.filter.push({title: '银行账户', value: data[0].BANK_ACCT});
                    }
                    this.textInfoData.splice(lastIndex, 1, obj);
                })
            })
        },
        getCnyBankInfo(CNY_BANK_INFO) {
            let lastIndex = this.tempIndex;
            this.tempIndex += 1;
            return dict.transformDict(CNY_BANK_INFO, [
                "ID_TYPE",
                {"BANK_ID_TYPE": "ID_TYPE"}
            ]).then(obj1 => {
                return org.transFormData(obj1, "EXT_ORG", "1").then(cnyBankInfoObj => {
                    this.addNewData(cnyBankInfoObj, 'CNY_BANK_INFO', "资金账户", lastIndex);
                })
            })
        },
        getHkBankInfo(HK_BANK_INFO) {
            let lastIndex = this.tempIndex;
            this.tempIndex += 1;
            return org.transformData(HK_BANK_INFO, "EXT_ORG", "1").then(hkBankInfoObj => {
                this.addNewData(hkBankInfoObj, 'HK_BANK_INFO', '')
            })
        },
        getFundAcctInfo(FUNDACCT_INFO_LIST) {
            let asyncArr = [];
            let lastIndex = this.tempIndex;
            this.tempIndex += FUNDACCT_INFO_LIST.length;
            _.each(FUNDACCT_INFO_LIST, fundAcctObj => {
                asyncArr.push(dict.transformDict(fundAcctObj, [
                    "BILL_MAIL_TYPE",
                    "DIV_METHOD"
                ])).then(data => {
                    _.each(data, (fundAcctObj, index) => {
                        this.addNewData(fundAcctObj, "FUNDACCT_INFO", '基金账户', lastIndex + index);
                    })
                })
            })
        },
        getPwdInfo(LINK_FLAG) {
            let lastIndex = this.tempIndex;
            this.tempIndex += 1;
            let obj = {
                title: '账户密码信息',
                filter: []
            };
            obj.filter.push({title: '设置为相同密码', value: LINK_FLAG == "1" ? "是" : "否"});
            obj.filter.push({title: '开通类型', value: '交易密码,资金密码'});
            this.textInfoData.splice(lastIndex, 1, obj);    
        },
        getRiskInfo(RISK_INFO) {
            let lastIndex = this.tempIndex;
            this.tempIndex += RISK_INFO.length;
            _.each(RISK_INFO, (riskInfoObj, index) => {
                this.addNewData(riskInfoObj, "RISK_INFO", "风险测评信息", lastIndex + index);
            })
        },
        transFormTemplateData(baseObj) {
            let TEMPLATE_DATA = {};
            _.each(baseObj, function (value, key) {
                if (value && _.isString(value)) {
                    if (that.custKeyMap[baseKey] && that.custKeyMap[baseKey][key] && that.custKeyMap[baseKey][key].name) {
                        if (!that.custKeyMap[baseKey][key].dict && !that.custKeyMap[baseKey][key].hidden) {
                            TEMPLATE_DATA[that.custKeyMap[baseKey][key].name] = value;
                        } else if (baseObj[key + "_TEXT"]) {
                            TEMPLATE_DATA[that.custKeyMap[baseKey][key].name] = baseObj[key + "_TEXT"];
                        }
                    }
                }
            })
            return TEMPLATE_DATA;
        },
        addNewData(TEMPLATE_DATA, key, title, index, SUB_TEMPLDATE_DATA) {
            // if (SUB_TEMPLDATE_DATA) {
            //     let obj = {
            //         title: title,
            //         filter: []
            //     };
            //      _.each(this.keyFieldMap[key], (value, key) => {
            //         if (TEMPLATE_DATA[key]) {
            //             if (value.dict) {
            //                 obj.filter.push({title: value.name, value: TEMPLATE_DATA[key + '_TEXT']})
            //             } else {
            //                 obj.filter.push({title: value.name,  value: TEMPLATE_DATA[key]})
            //             }
            //         }
            //     })
            //     _.each(SUB_TEMPLDATE_DATA, subData => {
                    
            //     })
            // }
            let obj = {
                title: title,
                filter: []
            }
            _.each(this.keyFieldMap[key], (value, key) => {
                if (TEMPLATE_DATA[key]) {
                    if (value.dict) {
                        obj.filter.push({title: value.name, value: TEMPLATE_DATA[key + '_TEXT']})
                    } else {
                        obj.filter.push({title: value.name,  value: TEMPLATE_DATA[key]})
                    }
                }
            })
            if (obj.filter.length) {
                this.textInfoData.splice(index, 1, obj);
            }
        }
    }
}
</script>
<style scoped lang="less">
    .confirm-base-table-List {
        flex: 1;
        flex-basis: 0%;
        overflow: auto;
        -ms-overflow-style: none;
        border: 1px solid #2e79db;
        border-radius: 3px;
        margin-top: 20px;
        background-color: #ffffff;
        .custInfoTitle {
            font-size: 42px;
            color: #344b66;
            letter-spacing: -0.58px;
            padding: 20px 0 25px 30px;
            margin: 0 10px;
            font-family: aliBold;
            text-align: center;
            span {
                display: inline-block;
                width: 70px;
                height: 2px;
                background-color: rgba(0, 22, 51, 0.08);
                border-radius: 3px;
                margin: 0 10px;
            }
        }

        .infochanged-table {
            text-align: center;

            .infochanged-title {
                font-size: 24px;
                color: #4a90e2;
                font-weight: 700;
                letter-spacing: -0.58px;
                background: #ffffff;
                height: 73px;
                line-height: 73px;
                border: none;
                padding-left: 150px;

                .cell {
                    height: 33px;
                }
            }

            .tableBox {
                width: 100%;
                height: 100%;
                text-align: left;
                margin-bottom: 30px;

                .tableTitel {
                    // display: flex;
                    // align-items: center;
                    background-color: #f2f7fd;
                    margin-bottom: 20px;
                    width: 100%;

                    .fieldsColumn {
                        color: #222;
                        font-weight: 700;
                    }

                    .oldValColumn {
                        font-weight: 700;
                        color: #222;
                    }

                    .column-title-modified {
                        font-weight: 700;
                    }

                    .column-title-del {
                        font-weight: 700;
                    }

                    .column-title-add {
                        font-weight: 700;
                    }
                }

                .tableList {
                    width: 100%;
                    padding: 10px 0;
                    // display: flex;
                }

                .fieldsColumn {
                    // float: left;
                    display: inline-block;
                    font-size: 17px;
                    color: #5c5c5c;
                    letter-spacing: -0.31px;
                    line-height: 30px;
                    border-bottom: 0;
                    width: 30%;
                    padding-left: 20px;
                    box-sizing: border-box;
                    word-break: break-all;
                }

                .oldValColumn {
                    // float: left;
                    display: inline-block;
                    font-size: 17px;
                    color: #001f24;
                    letter-spacing: -0.34px;
                    line-height: 30px;
                    width: 34%;
                    padding-right: 30px;
                    box-sizing: border-box;
                    word-break: break-all;
                }

                .newValColum {
                    // float: left;
                    display: inline-block;
                    line-height: 30px;
                    width: 34%;
                    word-break: break-all;
                }

                .column-title-modified {
                    font-size: 17px;
                    color: #d0021b;
                    letter-spacing: -0.31px;
                }

                .column-title-del {
                    color: #d0021b;
                    font-size: 17px;
                    letter-spacing: -0.34px;
                }

                .column-title-add {
                    font-size: 17px;
                    color: #4a515c;
                    letter-spacing: -0.31px;
                    // text-align: center;
                }
            }

            .text-tip {
                color: red;
                border-top: 2px dashed #4a90e2;
                padding-left: 15px;
                padding-right: 15px;
                text-align: left;
                font-size: 24px;
            }
        }

        .normalText {
            background: #ffffff;
            .textTitle {
                font-size: 32px;
                color: #4A98FF;
                font-weight: 700;
                letter-spacing: -0.58px;
                height: 73px;
                font-family: aliBold;
                line-height: 73px;
                border: none;
                text-align: left;
                padding-left: 20px;
                margin-bottom: 10px;
                .cell {
                    height: 33px;
                }
                span{
                    margin-right: 5px;
                }
            }

            .text-tip {
                color: red;
                border-top: 2px dashed #4a90e2;
                padding-left: 15px;
                font-size: 24px;
            }

            .subTitle {
                // font-weight: 700;
                color: #fb7440;
                padding-left: 15px;
                font-size: 17px;
                margin-bottom: 10px;
            }

            .textContent {
                width: 50%;
                display: inline-block;
                font-size: 24px;
                // color: #5c5c5c;
                letter-spacing: -0.31px;
                line-height: 30px;
                border-bottom: 0;
                padding-left: 20px;
                box-sizing: border-box;
                word-break: break-all;
                margin-bottom: 30px;

                .textLabel {
                    display: inline-block;
                    color: rgba(0,0,0,0.85);
                }

                .textValue {
                    display: inline-block;
                    color: #858C9E;
                }
            }
            .longContent{
                width: 100%;
            }
        }
    }
</style>
