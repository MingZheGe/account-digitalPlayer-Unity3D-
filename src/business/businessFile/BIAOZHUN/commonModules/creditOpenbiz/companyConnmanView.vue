/**
* 业务代码：V0024
* 业务名称：关联人信息模块--是否为上市公司关联人
* @author tsy
* @date 2021-08-05
*/
<template>
    <div class="V0024-company-connman">
        <kui-fieldset :options="{title:'是否为上市公司关联人',theme:'concise'}">
            <div class="company-connman-tip">{{companyConnmanInfoTip}}</div>

            <div class="has-company-connman-wrap">
                <div class="company-conn-man-select" :class="companySelectType == 'yes' ? 'isChecked' : ''">
                    <div class="restrictStockText" @click="stockSelect('yes')">
                        <span>是</span>
                    </div>
                </div>
                <div class="company-conn-man-select" :class="companySelectType  == 'no' ? 'isChecked' : ''">
                    <div class="restrictStockText" @click="stockSelect('no')">
                        <span>否</span>
                    </div>
                </div>
            </div>

            <div class="company-connman-box" v-for="(companyConnmanInfo,index) in companyConnmanInfoList" :key="index">
                <div class="company-connman-form-wrap">
                        <kui-form :ref="'companyConnmanForm'+ index">
                            <kui-textinput :ref="'STK_CODE'+index" :options="{title:'证券代码',labelWidth:200,width:400,required:true,field:'STK_CODE',validType:'numchar[6]'}" />
                            <kui-combobox :ref="'STKEX'+index" :options="{title:'交易市场',labelWidth:200,width:400,required:true,field:'STKEX',dict:'STKEX',disabled:true}" />
                            <kui-textinput :ref="'STK_NAME'+index" :options="{title:'证券名称',labelWidth:200,width:400,required:true,field:'STK_NAME',validType:'en_ch[0,40]',disabled:true}" />
                            <kui-textinput v-show="!isMarginTradeCust" :ref="'TRDACCT'+index" :options="{title:'信用证券账户',labelWidth:200,width:400,required:true,field:'TRDACCT',validType:'numchar[10]'}" />
                            <kui-combobox v-show="isMarginTradeCust" :ref="'CREDIT_TRDACCT'+index" :options="{title:'信用证券账户',labelWidth:200,width:400,required:true,field:'CREDIT_TRDACCT',validType:'numchar[10]'}" />
                            <kui-textinput :ref="'TRDACCT_NAME'+index" :options="{title:'账户名称',labelWidth:200,width:400,required:true,field:'TRDACCT_NAME',validType:'val[1,16]'}" />
                            <kui-combobox ref='RELAKIND_PUBCOM' :options="{title:'关联关系',labelWidth:200,width:400,required:true,field:'RELAKIND_PUBCOM',dict:'RELAKIND_PUBCOM'}" />
                        </kui-form>
                    <div class="company-connman-info-btn" v-if="companyConnmanInfoList.length > 1">
                        <img :src="require('@icons/yinheVTM/icon-area-del-normal.svg')" @click="removeCompanyConnmanHandler(index)">
                    </div>
                </div>
            </div>
            <div class="company-add-bank-info" v-if="companySelectType=='yes' && companyConnmanInfoList.length < maxCompanyConnman">
                <span class='company-add-bank-text' @click="addCompanyConnmanHandler"><i class='el-icon-circle-plus-outline' />添加上市公司关联人信息</span>
            </div>
        </kui-fieldset>
        <loading :showLoading='loading' :loadingText='loadingText'></loading> 
    </div>
</template>

<script>
import loading from '@/components/common/loading'
const getStkCodeInfo = (_this, stkCode) => {
    _this.loading = true;
    _this.loadingText = "证券代码信息查询中,请稍候...";
    return _this.$syscfg.K_Request("Y2001051", {
        STKCODE: stkCode,
        FISL: "1" //查询融资融券
    }).then((res) => {
        return res && res.Data && res.Data.length && res.Data[0] || {}
    }).finally(() => {
        _this.loading = false;
    })
}
export default {
    data() {
        return {
            companyConnmanInfoTip: '若您为上市公司董事、监事、高级管理人，或持有上市公司5%以上股份等，请选择“是”',
            companyConnmanInfoList: [],
            companySelectType: "",
            loading: false,
            loadingText: '',
            isCheckSzSTKEX: false,
            isCheckShSTKEX: false,
        };
    },
    components: {
        loading
    },
    computed: {
        maxCompanyConnman() {
            return parseInt(this.oppBusiData.MAX_COMPANY_CONNMAN || 3) || 3
        },
        customerInfo() {
            return this.$storage.getJsonSession(this.$definecfg.CUSTOMER_INFO) || {};
        },
        isMarginTradeCust() {
            return _.indexOf(this.customerInfo.CUST_EXT_ATTR, "1") !== -1;
        },
        creditTrdacctData() {
            return _.filter(this.oppBusiData.STKACCT_INFO, obj => ["2", "3", "8"].includes(obj.TRDACCT_EXCLS) && obj.TRDACCT_STATUS != '9');// 信用证券账户
        }
    },
    watch: {
        companyConnmanInfoList(val) {
            this.$nextTick(() => {
                this.bindFormEvents();
            })
        }
    },
    props: ['bizData', 'historyData', 'oppBusiData', 'groupDatas', 'busiCode'],

    mounted() {
        let that = this;
        that.$nextTick(function () {
            that.show();
        });
    },
    methods: {
        show() {
            this.$nextTick(() => {
                this.setData();
            });
        },
        setData() {
            this.isCheckSzSTKEX = _.isEmpty(this.historyData.ACCT_INFO.SZA_TRDACCT.TRDACCT) ? false : true;
            this.isCheckShSTKEX = _.isEmpty(this.historyData.ACCT_INFO.SHA_TRDACCT.TRDACCT) ? false : true;
            if (this.historyData.QUOTA_INFO && this.historyData.QUOTA_INFO.COMPANY_CONNMAN_INFO && !_.isEmpty(this.historyData.QUOTA_INFO.COMPANY_CONNMAN_INFO)) {
                // 选了深市市场和沪深 则可以
                if (this.isCheckSzSTKEX && this.isCheckShSTKEX) {
                    this.companyConnmanInfoList = _.filter(this.historyData.QUOTA_INFO.COMPANY_CONNMAN_INFO, obj => obj.OPER_TYPE !== "2");
                } 
                // 只选了深市
                else if (this.isCheckSzSTKEX) {
                    this.companyConnmanInfoList = _.filter(this.historyData.QUOTA_INFO.COMPANY_CONNMAN_INFO, obj => {
                        return obj.OPER_TYPE !== "2" && obj.STKEX === "0"
                    });
                } 
                // 只选了沪市
                else if (this.isCheckShSTKEX) {
                    this.companyConnmanInfoList = _.filter(this.historyData.QUOTA_INFO.COMPANY_CONNMAN_INFO, obj => {
                        return obj.OPER_TYPE !== "2" && obj.STKEX === "1"
                    });
                }
            } else if (!_.isEmpty(this.oppBusiData.COMPANY_CONNMAN_INFO)) {
                this.companyConnmanInfoList = _.cloneDeep(this.oppBusiData.COMPANY_CONNMAN_INFO);
            }

            this.companySelectType = this.companyConnmanInfoList.length ? "yes" : "no";

            this.$nextTick(() => {
                _.each(this.companyConnmanInfoList, (obj, index) => {
                    this.$refs["CREDIT_TRDACCT" + index] && this.$refs["CREDIT_TRDACCT" + index][0].combobox("loadData", this.creditTrdacctData)
                    this.$refs["companyConnmanForm" + index] && this.$refs["companyConnmanForm" + index][0].form("loadData", obj)
                })
            })
        },
        stockSelect(value) {
            let that = this;
            that.companySelectType = value;
            if (value == "yes") {
                that.initDomCompanyConnmanInfo(true);
            } else {
                that.companyConnmanInfoList = [];
            }
        },
        bindFormEvents() {
            var that = this;
            _.each(that.companyConnmanInfoList, (obj, index) => {
                var $STK_CODE_REFS = that.$refs["STK_CODE" + index] && that.$refs["STK_CODE" + index][0];
                var $STKEX_REFS = that.$refs["STKEX" + index] && that.$refs["STKEX" + index][0];
                var $TRDACCT_REFS = that.$refs["TRDACCT" + index] && that.$refs["TRDACCT" + index][0];
                var $STK_NAME_REFS = that.$refs["STK_NAME" + index] && that.$refs["STK_NAME" + index][0];
                var $CREDIT_TRDACCT_REFS = that.$refs["CREDIT_TRDACCT" + index] && that.$refs["CREDIT_TRDACCT" + index][0]
                var $companyConnmanForm = that.$refs["companyConnmanForm" + index] && that.$refs["companyConnmanForm" + index][0];
                $STK_CODE_REFS && $STK_CODE_REFS.textinput({
                    onBlur(value) {
                        if (!value) {
                            return false;
                        }
                        return getStkCodeInfo(that, value).then((res) => {
                            if (_.isEmpty(res)) {
                                $STK_CODE_REFS && $STK_CODE_REFS.textinput("showTips", "证券代码[" + value + "]在交易市场不存在,请重新输入！").textinput("clear")
                                return false;
                            }
                            // 为深市 但没有选择深圳市场信用账户 或者 为沪市 但没有选择上海市场信用账户
                            if ((res.MARKET === "0" && that.isCheckSzSTKEX) || (res.MARKET === "1" && that.isCheckShSTKEX)) {
                                $STK_NAME_REFS && $STK_NAME_REFS.textinput("setValue", res.STKNAME).textinput("setDisabled").textinput("hideTips");
                                $STKEX_REFS && $STKEX_REFS.combobox("setValue", res.MARKET).combobox("setDisabled").combobox("hideTips");
                                $companyConnmanForm && $companyConnmanForm.form("clear", ["TRDACCT", "TRDACCT_NAME", "RELAKIND_PUBCOM"])
                            } else {
                                $STK_NAME_REFS && $STK_NAME_REFS.textinput("clear");
                                $STKEX_REFS && $STKEX_REFS.combobox("clear");
                                $STK_CODE_REFS && $STK_CODE_REFS.textinput("showTips", "您输入的证券代码[" + value + "]与您要开通的信用账户市场不同，请重新输入！").textinput("clear")
                                return false;
                            }
                        })

                    }
                })

                $STKEX_REFS && $STKEX_REFS.combobox({
                    onChange(item) {
                        $CREDIT_TRDACCT_REFS && $CREDIT_TRDACCT_REFS.combobox("loadData", _.filter(this.creditTrdacctData, trdacct => trdacct.STKEX == item.DICT_ITEM))
                        $companyConnmanForm && $companyConnmanForm.form("clear", ["TRDACCT", "TRDACCT_NAME", "RELAKIND_PUBCOM"])
                    }
                })
            })
        },
        initDomCompanyConnmanInfo(value) {
            (!value || this.companyConnmanInfoList.length == 0) && this.companyConnmanInfoList.push(this.getEmptyCompanyConnmanInfo())
        },
        getEmptyCompanyConnmanInfo() {
            return {
                STK_CODE: "",
                STK_NAME: "",
                STKEX: "",
                TRDACCT: "",
                CREDIT_TRDACCT: "",
                TRDACCT_NAME: "",
                RELAKIND_PUBCOM: ""
            }
        },
        addCompanyConnmanHandler() {
            if (this.companyConnmanInfoList.length >= this.maxCompanyConnman) {
                this.dialog({
                    hasMask: true,
                    messageText: "最多只能添加 " + this.maxCompanyConnman + " 个上市公司关联人信息",
                    confirmButtonText: '确定'
                });
                return;
            }
            return this.validateDomForm().then((flag) => {
                if (flag == false) {
                    this.dialog({
                        hasMask: true,
                        messageText: "请先完善已有记录信息再添加！",
                        confirmButtonText: '确定'
                    });
                    return;
                }
                this.initDomCompanyConnmanInfo()
            })
        },
        removeCompanyConnmanHandler(index) {
            var that = this;
            that.dialog({
                hasMask: true,
                messageText: "确认是否删除此条上市公司关联人信息？",
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                confirmedAction: function () {
                    that.$delete(that.companyConnmanInfoList, index)
                },
                canceledAction: function () {
                }
            });
        },
        validate() {
            let that = this;
            return that.validateDomForm().then(flag => {
                if (flag === false) {
                    return false;
                }
                var companyConnmanInfoListDom = that.getDomData();
                var domCompareList = _.chain(companyConnmanInfoListDom).map(obj => _.pick(obj, ["STK_CODE", "TRDACCT", "RELAKIND_PUBCOM"])).uniqWith(_.isEqual).value();

                if (domCompareList.length < companyConnmanInfoListDom.length) {
                    that.dialog({
                        hasMask: true,
                        messageText: "上市公司关联人信息有重复记录，请删掉重复记录",
                        confirmButtonText: '确定'
                    });
                    return false;
                }
                return true;
            })
        },
        validateDomForm() {
            var syncValidateFunc = [];
            var that = this;
            _.each(that.companyConnmanInfoList, (obj, index) => {
                var companyConnmanForm = that.$refs["companyConnmanForm" + index] && that.$refs["companyConnmanForm" + index][0];
                companyConnmanForm && syncValidateFunc.push(companyConnmanForm.form("validate"));
            })
            return Promise.all(syncValidateFunc).then((flags) => {
                if (_.includes(flags, false)) {
                    return false;
                }
            })
        },
        getChangeCompanyConnmanInfo(newDataArr, oldDataArr) {
            var changeResultArr = [];
            _.each(newDataArr, (newData) => {
                var curOldCompanyConnman = _.find(oldDataArr, obj => obj.STK_CODE == newData.STK_CODE && obj.TRDACCT == newData.TRDACCT && obj.RELAKIND_PUBCOM == newData.RELAKIND_PUBCOM);
                if (!_.isEmpty(curOldCompanyConnman)) {
                    newData.OPER_TYPE = _.chain(curOldCompanyConnman).pick(_.keys(newData)).isEqual(newData).value() ? "3" : "1";
                } else {
                    newData.OPER_TYPE = "0"
                }
                changeResultArr.push(newData)
            })
            _.each(oldDataArr, obj => {
                if (!_.find(newDataArr, newObj => newObj.STK_CODE == obj.STK_CODE && obj.TRDACCT == newObj.TRDACCT && obj.RELAKIND_PUBCOM == newObj.RELAKIND_PUBCOM)) {
                    changeResultArr.push(Object.assign({}, obj, {
                        OPER_TYPE: "2"
                    }))
                }
            });
            return changeResultArr;

        },
        getDomData() {
            var companyConnmanInfoListDom = [];
            var that = this;
            _.each(that.companyConnmanInfoList, (obj, index) => {
                var companyConnmanInfData = that.$refs["companyConnmanForm" + index] && that.$refs["companyConnmanForm" + index][0].form("getData");
                if (!_.isEmpty(companyConnmanInfData)) {
                    companyConnmanInfData.TRDACCT = companyConnmanInfData.TRDACCT || companyConnmanInfData.CREDIT_TRDACCT || "";
                    companyConnmanInfoListDom.push(companyConnmanInfData);
                }
            })
            return companyConnmanInfoListDom;
        },
        getData() {
            let that = this;
            var companyConnmanInfoListDom = that.getDomData();
            let params = {};
            Object.assign(params, {
                COMPANY_CONNMAN_INFO: that.getChangeCompanyConnmanInfo(companyConnmanInfoListDom, that.oppBusiData.COMPANY_CONNMAN_INFO || [])
            });

            return params;
        }

    }
}
</script>

<style lang="less" >
.V0024-company-connman {
    position: relative;
    .company-connman-box {
        position: relative;
        margin-bottom: 15px;
        &:last-child {
            border-bottom: none;
        }
        .company-connman-info-btn {
        }

        .company-connman-form-wrap {
            display: flex;
            align-items: center;
            width: 1413px;
            height: 260px;
            background-color: #f7f7fa;
            border-radius: 4px;
        }
    }

    .company-connman-tip {
        position: absolute;
        left: 320px;
        top: 25px;
        width: 1066.8px;
        height: 31px;
        font-family: Alibaba PuHuiTi;
        color: #eb6e20;
        font-size: 22px;
    }
    .kui-fieldset .fieldset-legend .fieldset-legend-title {
        width: 281px;
        height: 35px;
        font-family: Alibaba PuHuiTi;
        font-weight: 500;
        color: #1f59db;
        font-size: 26px;
    }

    .has-company-connman-wrap {
        display: flex;
        align-items: center;
        width: 1413px;
        height: 140px;
        background-color: #f7f7fa;
        border-radius: 4px;
        margin-bottom: 15px;

        .company-conn-man-select {
            margin-left: 57px;
            width: 390px;
            height: 60px;
            border-radius: 2px;
            background: #ffffff;
            .restrictStockText {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 26px;
            }
        }
        .company-conn-man-select.isChecked {
            border: 1px solid #3b6aff;
            background-color: #3b6aff;
            .restrictStockText {
                color: #ffffff;
                font-weight: 700;
            }
        }
    }

    .company-add-bank-info {
        display: flex;
        align-items: center;
        justify-content: center;

        width: 1416px;
        height: 60px;
        background-color: #f8faff;
        border: 1px solid #bed0ff;
        border-radius: 4px;
        box-shadow: 0px 3px 18px rgba(0, 0, 0, 0.03);
        .company-add-bank-text {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 500px;
            height: 35px;
            font-family: Alibaba PuHuiTi;
            color: #3b6aff;
            font-size: 26px;
        }
    }
    &:first-child {
        margin-top: 0px;
    }
}
</style>
