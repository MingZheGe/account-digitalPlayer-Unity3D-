<template>
    <div class="V0024-bank-info">
        <kui-fieldset :options="{title:'银行签约信息',theme:'concise'}">
            <kui-form ref="companyConnmanForm" class="credit-bank-info-form-wrap">
                <div class = "underline">
                <div>
                    <kui-textinput ref="CUST_FNAME" :options="{title:'签约姓名',labelWidth:115,width:385,required:true,field:'CUST_FNAME',validType:'val[1,128]'}" />
                    <kui-combobox ref="ID_TYPE" :options="{title:'签约证件类型',labelWidth:315,width:385,required:true,field:'ID_TYPE',dict:'ID_TYPE'}" />
                </div>

                <div>
                    <kui-textinput ref="ID_CODE" :options="{title:'证件号码',labelWidth:115,width:385,required:true,field:'ID_CODE',validType:'numCharMinus[6,48]'}" />
                    <kui-datebox class="self-datePick" ref='BSB_ID_EXP_DATE' :options="{title:'证件有效期',labelWidth:315,width:385,required:true,field:'BSB_ID_EXP_DATE',isShowLongTime:true}" />
                </div>
                </div>
                <div class="tip-svg">
                    <div class="tip-tb">
                        <img :src="require('@icons/V0014/icon-warning.svg')">
                    </div>
                    <div class="tip-content" v-html="signTipsContent"></div>
                </div>
            </kui-form>
        </kui-fieldset>
    </div>
</template>

<script> 

export default {
    name: "V0024BankInfo",
    data() {
        return {
            signTipsContent: '为保证银行签约成功，请您确保银行签约信息与您在存管银行的开户资料一致。',
        };
    },
    components: {
    
    },
    props: ['bizData', 'historyData', 'oppBusiData', 'groupDatas', 'busiCode'],
    created() {
        let that = this;
        that.BANK_ACCOUNT = that.historyDataACCT_INFO && that.historyData.ACCT_INFO.BANK_ACCOUNT || {};
    },
    mounted() {
        let that = this;
        that.$nextTick(function () {
            that.bindEvents();
            that.setData();
        });
    },
    activated() { },
    computed: {
        userType() {
            return this.$store.state.usertype;
        },
        customerInfo() {
            return this.$storage.getJsonSession(this.$definecfg.CUSTOMER_INFO) || {};
        }
    },
    watch: {},
    methods: {
        setData() {
            let that = this;
            that.$nextTick(function () {
                var custBankAccInfo = that.oppBusiData.custBankAccInfo;
                let BANK_ACCOUNT = _.get(that.historyData, "ACCT_INFO.BANK_ACCOUNT", {});
                that.$refs['CUST_FNAME'].textinput("setValue", BANK_ACCOUNT.CUST_FNAME || custBankAccInfo.BSB_USER_FNAME || "");
                that.$refs['ID_TYPE'].combobox("setValue", BANK_ACCOUNT.ID_TYPE || custBankAccInfo.BSB_ID_TYPE || "");
                that.$refs['ID_CODE'].textinput("setValue", BANK_ACCOUNT.ID_CODE || custBankAccInfo.BSB_ID_CODE || "");

                that.$refs['BSB_ID_EXP_DATE'].datebox("setValue", BANK_ACCOUNT.BSB_ID_EXP_DATE || custBankAccInfo.BSB_ID_EXP_DATE);

                if (!_.isEmpty(that.BANK_ACCOUNT)) {
                    // 如果提交过流程，优先使用流程数据
                    that.BANK_ACCOUNT.ID_TYPE && that.$refs['ID_TYPE'].combobox("setValue", that.BANK_ACCOUNT.ID_TYPE);

                    that.$refs['companyConnmanForm'].form("load", that.BANK_ACCOUNT);
                }
            });
        },
        isLongTime: function (str) {
            return "30001231" === str;
        },
        bindEvents() {
            var that = this;
            that.$refs["ID_TYPE"] && that.$refs["ID_TYPE"].combobox({
                loadFilter(data) {
                    var firstChar = that.customerInfo.USER_TYPE == "0" ? "0" : "1";
                    return _.chain(data).filter(function (v) {
                        return firstChar === v.DICT_ITEM.charAt(0);
                    }).value();
                },
                onChange(value) {
                    that.$refs['ID_CODE'].textinput("clear");

                    if ('00' == value || '08' == value) {
                        that.$refs['ID_CODE'].textinput("changeValid", 'cardno[true]');
                    } else {
                        that.$refs['ID_CODE'].textinput("changeValid", 'numCharMinus[6,48]');
                    }

                    //标准版2214：当证件类型是1Z-批文时，证件号码允许输入汉字和中文括号，例如证件号码：九泰证基（2019）5019
                    if (that.customerInfo.USER_TYPE == "2" && value === "1Z") {
                        that.$refs['ID_CODE'].textinput("changeValid", 'address[6,48]');
                    }
                }
            });
        },
        validate() {
            let that = this;
            let custFname = that.$refs['CUST_FNAME'].textinput("getValue"),
                idType = that.$refs['ID_TYPE'].combobox("getValue"),
                idCode = that.$refs['ID_CODE'].textinput("getValue"),
                expDate = that.$refs['BSB_ID_EXP_DATE'].datebox("getValue");

            that.bankAcctData = {
                CUST_FNAME: custFname,
                ID_TYPE: idType,
                ID_CODE: idCode,
                BSB_ID_EXP_DATE: expDate
            };

            if (!custFname) {
                that.dialog({
                    hasMask: true,
                    messageText: "客户姓名，不能为空。",
                    confirmButtonText: '确定'
                });
                return false;
            }

            if (!idType) {
                that.dialog({
                    hasMask: true,
                    messageText: "证件类型，不能为空。",
                    confirmButtonText: '确定'
                });
                return false;
            }

            if (!idCode) {
                that.dialog({
                    hasMask: true,
                    messageText: "证件号码，不能为空。",
                    confirmButtonText: '确定'
                });
                return false;
            }

            if (!expDate) {
                that.dialog({
                    hasMask: true,
                    messageText: "证件有效期，不能为空。",
                    confirmButtonText: '确定'
                });
                return false;
            }
            return that.$refs['companyConnmanForm'].form("validate").then(res => {
                return res;
            })
        },
        getData() {
            let that = this;
            return that.bankAcctData;
        }
    }
}
</script>

<style lang="less" >
.V0024-bank-info {
    .kui-fieldset .fieldset-legend .fieldset-legend-title {
        width: 281px;
        height: 35px;
        font-family: Alibaba PuHuiTi;
        font-weight: 500;
        color: #1f59db;
        font-size: 26px;
    }
    .credit-bank-info-form-wrap {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        width: 1402px;
        height: 286px;
        background-color: #f7f7fa;
        border-radius: 4px;

        .underline {
            border-bottom: 1px solid;
            border-color: #eaeaea;
            margin-left: 60px;
            padding-bottom: 17px;
            margin-top: 20px;
        }
        .tip-svg {
            display: flex;
            align-items: center;
            margin-left: 60px;
            .tip-tb {
                display: inline-block;
            }
            .tip-content {
                display: inline-block;
                width: 1234.8px;
                margin-left: 20px;
                font-family: Alibaba PuHuiTi;
                color: #eb6e20;
                font-size: 22px;
                line-height: 58px;
            }
        }
    }
}
</style>
