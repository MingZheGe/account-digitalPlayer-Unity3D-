/**
* 业务代码：V0024
* 业务名称：关联人信息模块--是否存在关联人
* @author tsy
* @date 2021-08-05
*/
<template>
    <div class="V0206-connected-acct">
        <kui-fieldset :options="{title:'是否存在关联人',theme:'concise'}">
            <div class="connected-acct-tip">{{connectedAcctTip}}</div>

            <div class="has-connected-acct-wrap">
                <div class="restrict-stock-select" :class="connectedSelectType == 'yes' ? 'isChecked' : ''">
                    <div class="restrictStockText" @click="stockSelect('yes')">
                        <span>是</span>
                    </div>
                </div>
                <div class="restrict-stock-select" :class="connectedSelectType == 'no' ? 'isChecked' : ''">
                    <div class="restrictStockText" @click="stockSelect('no')">
                        <span>否</span>
                    </div>
                </div>
            </div>
            <div class="connected-acct-box" v-for="(connectedAcctInfo,index) in connectedAcctInfoList" :key="index">
                <div class="connected-acct-form-wrap">
                    <kui-form :ref="'connectedAcctForm'+ index">
                        <kui-combobox :ref="'RELAKIND_COMM'+index" :options="{title:'关联关系',labelWidth:200,width:400,required:true,field:'RELAKIND_COMM',dict:'RELAKIND_COMM'}" />
                        <kui-combobox :ref="'ID_TYPE'+index" :options="{title:'证件类型',labelWidth:200,width:400,required:true,field:'ID_TYPE',dict:'ID_TYPE'}" />
                        <kui-textinput :ref="'ID_CODE'+index" :options="{title:'证件号码',labelWidth:200,width:400,required:true,field:'ID_CODE'}" />
                        <kui-textinput :ref="'RELA_NAME'+index" :options="{title:'姓名',labelWidth:200,width:400,required:true,field:'RELA_NAME',validType:'val[1,32]'}" />
                        <kui-combobox :ref="'STKEX'+index" :options="{title:'交易市场',labelWidth:200,width:400,required:true,field:'STKEX',dict:'STKEX'}" />
                        <kui-combobox :ref="'TRDACCT'+index" :options="{title:'证券账户',labelWidth:200,width:400,required:true,field:'TRDACCT',validType:'numchar[10]',textField:'TRDACCT',valueField:'TRDACCT'}" />
                        <kui-textinput :ref="'RC_CUST_CODE'+index" :options="{title:'关联人客户代码',labelWidth:200,width:400,required:false,field:'RC_CUST_CODE',placeholder:'', disabled:true}" />
                        <kui-combobox :ref="'INT_ORG'+index" :options="{title:'关联人机构代码',labelWidth:200,width:400,required:false,field:'INT_ORG',placeholder:'',
                                req: { service:'W0000001', YGT_SERVICE_CODE: 'Y1000200', ORG_TYPE:'0'}, valueField:'ORG_CODE', textField:'ORG_CODE,ORG_NAME', disabled: true}" />
                        <kui-textinput :ref="'CONNECT_REMARK'+index" :options="{title:'备注',labelWidth:200,width:1026,required:false,field:'CONNECT_REMARK',placeholder:'',validType:'length[0,256]'}" />
                        <kui-combobox :ref="'USER_TYPE'+index" :options="{title:'关联人用户性质',labelWidth:200,width:400,required:false,field:'USER_TYPE',dict:'USER_TYPE' ,hidden:true}" />

                    </kui-form>
                    <div class="restrict-stock-info-btn" v-if="connectedAcctInfoList.length > 1">
                        <img :src="require('@icons/yinheVTM/icon-area-del-normal.svg')" @click="removeConnectedAcctHandler(index)">
                    </div>
                </div>
            </div>
            <div class="connected-add-bank-info" @click="addConnectedAcctHandler" v-if="connectedSelectType=='yes' && connectedAcctInfoList.length < maxConnectedAcct">
                <span class='connected-add-bank-text'><i class='el-icon-circle-plus-outline' />添加关联人信息</span>
            </div>
        </kui-fieldset>
        <loading :showLoading='loading' :loadingText='loadingText'></loading> 
    </div>
</template>

<script>
import loading from '@/components/common/loading'
const getConnectAcctInfo = (_this, idType, idCode) => {
    _this.loading = true;
    _this.loadingText = "正在校验关联人信息，请稍候...";
    return Promise.all([
        _this.$syscfg.K_Request("Y3000001", {
            LBM: "YGT_A2100124",
            ID_TYPE: idType,
            ID_CODE: idCode,
            CUST_CODE: ""
        })
    ]).then((res) => {
        var trdacctData = res && res[0].Data || [];
        if (_.isEmpty(trdacctData)) {
            return false;
        }
        return Promise.all([
            _this.$syscfg.K_Request("Y3000001", {
                LBM: "YGT_A1160001",
                ID_TYPE: idType,
                USER_CODE: trdacctData[0].CUST_CODE,
                USER_ROLE: ""
            })
        ]).then((customerInfo) => {
            return {
                CONNECT_CUST_INFO: customerInfo && customerInfo[0].Data && customerInfo[0].Data[0] || {},
                CONNECT_TRDACCT_INFO: _.filter(trdacctData, (obj) => {
                    return !_.includes(["01", "11", "20", "21", "03", "13"], obj.STKBD);
                })
            }
        }).finally(() => {
            _this.loading = false;
        })
    }).finally(() => {
        _this.loading = false;
    })
}
export default {
    data() {
        return {
            connectedAcctTip: '若您的亲属、朋友等已在我司开立证券账户，请选择“是”',
            connectedAcctInfoList: [],
            connectedSelectType: "",
            loading: false,
            loadingText: ''
        };
    },
    components: {
        loading
    },
    computed: {
        maxConnectedAcct() {
            return parseInt(this.oppBusiData.MAX_CONNECTED_ACCT || 3) || 3
        },
        customerInfo() {
            return this.$storage.getJsonSession(this.$definecfg.CUSTOMER_INFO) || {};
        },
        isMarginTradeCust() {
            return _.indexOf(this.customerInfo.CUST_EXT_ATTR, "1") !== -1;
        },
    },
    watch: {
        connectedAcctInfoList(val) {
            this.$nextTick(() => {
                this.bindFormEvents();
            })
        }
    },
    props: ['bizData', 'historyData', 'oppBusiData', 'groupDatas', 'busiCode'],

    mounted() {
        this.$nextTick(() => {
            this.show();
        });
    },
    methods: {
        show() {
            this.$nextTick(() => {
                this.setData();
            });
        },
        setData() {
            let that = this;
            if (this.historyData.QUOTA_INFO && this.historyData.QUOTA_INFO.CONNECTED_ACCT_INFO && !_.isEmpty(this.historyData.QUOTA_INFO.CONNECTED_ACCT_INFO)) {
                this.connectedAcctInfoList = _.filter(this.historyData.QUOTA_INFO.CONNECTED_ACCT_INFO, obj => obj.OPER_TYPE !== "2");
            } else if (!_.isEmpty(this.oppBusiData.CONNECTED_ACCT_INFO)) {
                this.connectedAcctInfoList = _.cloneDeep(this.oppBusiData.CONNECTED_ACCT_INFO);
            }

            this.connectedSelectType = this.connectedAcctInfoList.length ? "yes" : "no";

            this.$nextTick(() => {
                var syncGetConnectAcctArr = []
                _.each(this.connectedAcctInfoList, (obj, index) => {
                    syncGetConnectAcctArr.push(getConnectAcctInfo(this, obj.ID_TYPE, obj.ID_CODE))
                })
                return Promise.all(syncGetConnectAcctArr).then((syncAconnetAcctData) => {
                    _.each(this.connectedAcctInfoList, (obj, index) => {
                        this.trdacctBindEvents(this.$refs["TRDACCT" + index] && this.$refs["TRDACCT" + index][0], 
                            obj.STKEX, _.get(syncAconnetAcctData[index], "CONNECT_TRDACCT_INFO", []));
                        this.$refs["RC_CUST_CODE" + index] && this.$refs["RC_CUST_CODE" + index][0].textinput("setValue", _.get(syncAconnetAcctData[index], "CONNECT_CUST_INFO.USER_CODE", obj.RC_CUST_CODE)).textinput("setDisabled");
                        this.$refs["RELA_NAME" + index] && this.$refs["RELA_NAME" + index][0].textinput("setValue", _.get(syncAconnetAcctData[index], "CONNECT_CUST_INFO.USER_FNAME", obj.RELA_NAME)).textinput("setDisabled");
                        this.$refs["USER_TYPE" + index] && this.$refs["USER_TYPE" + index][0].combobox("setValue", _.get(syncAconnetAcctData[index], "CONNECT_CUST_INFO.USER_TYPE", obj.USER_TYPE)).combobox("setDisabled");
                        this.$refs["ID_TYPE" + index] && this.$refs["ID_TYPE" + index][0].combobox("setValue", obj.ID_TYPE);
                        this.$refs["ID_CODE" + index] && this.$refs["ID_CODE" + index][0].textinput("setValue", obj.ID_CODE);
                        this.$refs["INT_ORG" + index] && this.$refs["INT_ORG" + index][0].combobox("setValue", obj.INT_ORG);
                        this.$refs["RELAKIND_COMM" + index] && this.$refs["RELAKIND_COMM" + index][0].combobox("setValue", obj.RELAKIND_COMM);
                        this.$refs["CONNECT_REMARK" + index] && this.$refs["CONNECT_REMARK" + index][0].textinput("setValue", obj.CONNECT_REMARK);
                        this.$refs["STKEX" + index] && this.$refs["STKEX" + index][0].combobox("setValue", obj.STKEX, true);
                        this.$refs["TRDACCT" + index] && this.$refs["TRDACCT" + index][0].combobox("setValue", obj.TRDACCT, true);
                        // this.$refs["connectedAcctForm" + index] && this.$refs["connectedAcctForm" + index][0].form("loadData", obj)
                    })
                })
            })
        },
        stockSelect(value) {
            let that = this;
            that.connectedSelectType = value;

            if (value == "yes") {
                that.initDomConnectedAcctInfo(true);
            } else {
                that.connectedAcctInfoList = [];
            }
        },
        bindFormEvents() {
            var that = this;
            _.each(that.connectedAcctInfoList, (obj, index) => {
                var $ID_TYPE_REF = that.$refs["ID_TYPE" + index] && that.$refs["ID_TYPE" + index][0];
                var $ID_CODE_REF = that.$refs["ID_CODE" + index] && that.$refs["ID_CODE" + index][0];
                var $RC_CUST_CODE_REF = that.$refs["RC_CUST_CODE" + index] && that.$refs["RC_CUST_CODE" + index][0];
                var $INT_ORG = that.$refs["INT_ORG" + index] && that.$refs["INT_ORG" + index][0];
                var $USER_TYPE_REF = that.$refs["USER_TYPE" + index] && that.$refs["USER_TYPE" + index][0];
                var $RELA_NAME_REF = that.$refs["RELA_NAME" + index] && that.$refs["RELA_NAME" + index][0];
                var $STKEX_REF = that.$refs["STKEX" + index] && that.$refs["STKEX" + index][0];
                var $TRDACCT_REF = that.$refs["TRDACCT" + index] && that.$refs["TRDACCT" + index][0];
                $ID_TYPE_REF && $ID_TYPE_REF.combobox({
                    onChange(value) {
                        if (value == "00" || value == "08") {
                            $ID_CODE_REF && $ID_CODE_REF.textinput("changeValid", "cardno")
                        } else {
                            $ID_CODE_REF && $ID_CODE_REF.textinput("changeValid", "numCharMinus[0,48]")
                        }

                    }
                })
                $TRDACCT_REF && $TRDACCT_REF.combobox({
                    onChange(value) {
                        var connectedAcctInfoListDom = that.getDomData();
                        let stkex = $STKEX_REF.combobox("getValue");
                        var domCompareList = _.filter(connectedAcctInfoListDom, item => {
                            return item.STKEX === stkex && value === item.TRDACCT && stkex !== ""
                        }) || [];
                        if (domCompareList.length > 0) {
                            $TRDACCT_REF && $TRDACCT_REF.combobox("showTips", "该关联人已存在，不能重复添加").combobox("clear");
                            return false;
                        }
                    }
                });
                $ID_CODE_REF && $ID_CODE_REF.textinput({
                    onBlur(value) {
                        if (!value || !$ID_TYPE_REF || !$ID_TYPE_REF.combobox("validate")) {
                            return false
                        }
                        if (value == that.oppBusiData.custBaseInfo[0].ID_CODE && $ID_TYPE_REF.combobox("getValue") == that.oppBusiData.custBaseInfo[0].ID_TYPE) {
                            that.dialog({
                                hasMask: true,
                                messageText: "关联人证件号码不能与您本人证件号码一致",
                                confirmButtonText: '确定'
                            });
                            $ID_CODE_REF && $ID_CODE_REF.textinput("clear");
                            return false;
                        }
                        return getConnectAcctInfo(that, $ID_TYPE_REF.combobox("getValue"), value).then((data) => {
                            $RC_CUST_CODE_REF && $RC_CUST_CODE_REF.textinput("setValue", _.get(data, "CONNECT_CUST_INFO.USER_CODE", "")).textinput("setDisabled");
                            $RELA_NAME_REF && $RELA_NAME_REF.textinput("setValue", _.get(data, "CONNECT_CUST_INFO.USER_FNAME", "")).textinput("setDisabled");
                            $USER_TYPE_REF && $USER_TYPE_REF.combobox("setValue", _.get(data, "CONNECT_CUST_INFO.USER_TYPE", "")).combobox("setDisabled");
                            $INT_ORG && $INT_ORG.combobox("setValue", _.get(data, "CONNECT_CUST_INFO.INT_ORG", "0")).combobox("setDisabled");
                            var stkes = $STKEX_REF && $STKEX_REF.combobox("getValue");
                            that.trdacctBindEvents($TRDACCT_REF, stkes, _.get(data, "CONNECT_TRDACCT_INFO", []))
                        })
                    },
                    onChange(val) {
                        $TRDACCT_REF && $TRDACCT_REF.combobox("clear");
                    }
                })

                $STKEX_REF && $STKEX_REF.combobox({
                    onChange(value) {
                        var connectedAcctInfoListDom = that.getDomData();
                        let trdacct = $TRDACCT_REF.combobox("getValue");
                        var domCompareList = _.filter(connectedAcctInfoListDom, item => {
                            return item.STKEX === value && trdacct === item.TRDACCT && trdacct !== ""
                        }) || [];
                        if (domCompareList.length > 0) {
                            $STKEX_REF && $STKEX_REF.combobox("showTips", "该关联人已存在，不能重复添加").combobox("clear");
                            return false;
                        }
                        var trdacctData = $TRDACCT_REF && $TRDACCT_REF.combobox("getOriginalData")
                        that.trdacctBindEvents($TRDACCT_REF, value, trdacctData)
                    }
                })
            })
        },
        trdacctBindEvents($TRDACCT_REF, stkex, trdacctData) {
            $TRDACCT_REF && $TRDACCT_REF.combobox({
                loadFilter(data) {
                    return _.filter(trdacctData, obj => !stkex || obj.STKBD.startsWith(stkex))
                }
            }).combobox('loadData', trdacctData)
        },
        initDomConnectedAcctInfo(value) {
            (!value || this.connectedAcctInfoList.length == 0) && this.connectedAcctInfoList.push(this.getEmptyConnectedAcctInfo())
        },

        getEmptyConnectedAcctInfo() {
            return {
                RELAKIND_COMM: "",
                RELA_NAME: "",
                ID_TYPE: "",
                ID_CODE: "",
                RC_CUST_CODE: "",
                USER_TYPE: "",
                STKEX: "",
                TRDACCT: "",
                CONNECT_REMARK: ""
            }
        },
        addConnectedAcctHandler() {
            if (this.connectedAcctInfoList.length >= this.maxConnectedAcct) {
                this.dialog({
                    hasMask: true,
                    messageText: "最多只能添加 " + this.maxConnectedAcct + " 个上市公司关联人信息",
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
                this.initDomConnectedAcctInfo()
            })
        },
        removeConnectedAcctHandler(index) {
            var that = this;
            that.dialog({
                hasMask: true,
                messageText: "确认是否删除此条关联人信息？",
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                confirmedAction: function () {
                    that.$delete(that.connectedAcctInfoList, index);
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
                return true;
            })
        },
        validateDomForm() {
            var syncValidateFunc = [];
            var that = this;
            _.each(that.connectedAcctInfoList, (obj, index) => {
                var connectedAcctForm = that.$refs["connectedAcctForm" + index] && that.$refs["connectedAcctForm" + index][0];
                connectedAcctForm && syncValidateFunc.push(connectedAcctForm.form("validate"));
            })
            return Promise.all(syncValidateFunc).then((flags) => {
                if (_.includes(flags, false)) {
                    return false;
                }
            })
        },
        getChangeConnectedAcctInfo(newDataArr, oldDataArr) {
            var changeResultArr = [];
            _.each(newDataArr, (newData) => {
                var curOldConnectedAcct = _.find(oldDataArr, obj => obj.STKEX == newData.STKEX && obj.TRDACCT == newData.TRDACCT);
                if (!_.isEmpty(curOldConnectedAcct)) {
                    newData.OPER_TYPE = _.chain(curOldConnectedAcct).pick(_.keys(newData)).isEqual(newData).value() ? "3" : "1";
                } else {
                    newData.OPER_TYPE = "0"
                }
                changeResultArr.push(newData)
            })
            _.each(oldDataArr, obj => {
                if (!_.find(newDataArr, newObj => newObj.STKEX == obj.STKEX && obj.TRDACCT == newObj.TRDACCT)) {
                    changeResultArr.push(Object.assign({}, obj, {
                        OPER_TYPE: "2"
                    }))
                }
            });
            return changeResultArr;

        },
        getDomData() {
            var connectedAcctInfoListDom = [];
            var that = this;
            _.each(that.connectedAcctInfoList, (obj, index) => {
                var connectedAcctFormData = that.$refs["connectedAcctForm" + index] && that.$refs["connectedAcctForm" + index][0].form("getData");
                if (!_.isEmpty(connectedAcctFormData)) {
                    connectedAcctInfoListDom.push(connectedAcctFormData);
                }
            })
            return connectedAcctInfoListDom;
        },
        getData() {
            let that = this;
            var connectedAcctInfoListDom = that.getDomData();
            var params = {};

            Object.assign(params, {
                CONNECTED_ACCT_INFO: that.getChangeConnectedAcctInfo(connectedAcctInfoListDom, that.oppBusiData.CONNECTED_ACCT_INFO || [])
            });
            return params;
        }

    }
}
</script>

<style lang="less">
.V0206-connected-acct {
    position: relative;
    .connected-acct-tip {
        position: absolute;
        left: 250px;
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

    .has-connected-acct-wrap {
        display: flex;
        align-items: center;
        width: 1413px;
        height: 140px;
        background-color: #f7f7fa;
        border-radius: 4px;
        margin-bottom: 15px;

        .restrict-stock-select {
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
        .restrict-stock-select.isChecked {
            border: 1px solid #3b6aff;
            background-color: #3b6aff;
            .restrictStockText {
                color: #ffffff;
                font-weight: 700;
            }
        }
    }

    .connected-acct-box {
        position: relative;
        margin-bottom: 15px;
        &:last-child {
            border-bottom: none;
        }

        .connected-acct-form-wrap {
            display: flex;
            align-items: center;
            width: 1413px;
            height: 372px;
            background-color: #f7f7fa;
            border-radius: 4px;
        }
    }

    .connected-add-bank-info {
        display: flex;
        align-items: center;
        justify-content: center;

        width: 1416px;
        height: 60px;
        background-color: #f8faff;
        border: 1px solid #bed0ff;
        border-radius: 4px;
        box-shadow: 0px 3px 18px rgba(0, 0, 0, 0.03);
        .connected-add-bank-text {
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
