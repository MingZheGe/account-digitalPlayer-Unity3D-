/**
* 业务代码：V0024
* 业务名称：关联人信息模块--是否持有限售股股份信息
* @author tsy
* @date 2021-08-04
*/
<template>
    <div class="V0024-restrict-stock">
        <kui-fieldset :options="{title:'是否持有限售股股份信息',theme:'concise'}">
            <div class="restrict-stock-tip">{{restrictStockTip}}</div>
            <div class="has-restrict-stock-wrap">
                <div class="restrict-stock-select" :class="selectType == 'yes' ? 'isChecked' : ''">
                    <div class="restrictStockText" @click="stockSelect('yes')">
                        <span>是</span>
                    </div>
                </div>
                <div class="restrict-stock-select" :class="selectType  == 'no' ? 'isChecked' : ''">
                    <div class="restrictStockText" @click="stockSelect('no')">
                        <span>否</span>
                    </div>
                </div>
            </div>
            <div class="restrict-stock-box" v-for="(restrictInfo,index) in restrictStockInfoList" :key="index">
                <div class="restrict-stock-form-wrap">
                    <kui-form :ref="'restrictStockForm'+ index">
                        <kui-combobox ref='REMOVE_FORBID_FLAG' :options="{title:'类型',labelWidth:200,width:400,required:true,field:'REMOVE_FORBID_FLAG',dict:'REMOVE_FORBID_FLAG'}" />
                        <kui-combobox ref='STKBD' :options="{title:'交易板块',labelWidth:200,width:400,required:false,field:'STKBD',dict:'STKBD'}" />
                        <kui-textinput :ref="'TRDACCT'+index" :options="{title:'证券账户',labelWidth:200,width:400,required:true,field:'TRDACCT',validType:'numchar[10]'}" />
                        <kui-textinput :ref="'STK_CODE'+index" :options="{title:'证券代码',labelWidth:200,width:400,required:true,field:'STK_CODE',validType:'numchar[6]'}" />
                        <kui-combobox :ref="'STKEX'+index" :options="{title:'交易市场',labelWidth:200,width:400,required:true,field:'STKEX',dict:'STKEX',disabled:true}" />
                        <kui-textinput :ref="'STK_NAME'+index" :options="{title:'证券名称',labelWidth:200,width:400,required:true,field:'STK_NAME',validType:'en_ch[0,40]',disabled:true}" />
                        <kui-textinput ref="STK_AVL" :options="{title:'可用数量',labelWidth:200,width:400,required:true,field:'STK_AVL',validType:'numberex[10, 20, 3]'}" />
                        <kui-textinput ref="MARKET_PRICE" :options="{title:'市值',labelWidth:200,width:400,required:true,field:'MARKET_PRICE',validType:'numberex[10, 20, 3]'}" />
                        <kui-combobox :ref="'HOLD_TYPE'+index" :options="{title:'持有性质',labelWidth:200,width:400,required:true,field:'HOLD_TYPE',
                                      valueField:'DICT_ITEM', textField:'DICT_ITEM_NAME',  data:[{DICT_ITEM: '0',DICT_ITEM_NAME: '未解除限售'},{DICT_ITEM: '1',DICT_ITEM_NAME: '解除限售'}]}" />
                    </kui-form>
                    <div class="restrict-stock-info-btn" v-if="restrictStockInfoList.length > 1">
                        <img :src="require('@icons/yinheVTM/icon-area-del-normal.svg')" @click="removeRestrictInfoHandler(index)">
                    </div>
                </div>
            </div>
            <div class="stock-add-bank-info" v-if="selectType=='yes' && restrictStockInfoList.length < maxRestrictStock">
                <span class='stock-add-bank-text' @click="addRestrictInfoHandler"><i class='el-icon-circle-plus-outline' />添加限售股股份信息</span>
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
    return ajax.post({
        service: "W0000001",
        YGT_SERVICE_CODE: 'Y2001051',
        STKCODE: stkCode,
        FISL: "1" //查询融资融券
    }).then(([data]) => {
        return data && data[0] && data[0].length && data[0][0] || {}
    }).finally(() => {
        _this.loading = false;
    })
}
export default {
    data() {
        return {
            restrictStockTip: '若您持有限售股股份，请选择“是”',
            restrictStockInfoList: [],
            selectType: "",
            loading: false,
            loadingText: ''
        };
    },
    components: {
        loading
    },
    computed: {
        maxRestrictStock() {
            return parseInt(this.oppBusiData.MAX_RESTRICTED_STOCK || 3) || 3
        },
    },
    watch: {
        restrictStockInfoList(val) {
            this.$nextTick(() => {
                this.bindFormEvents();
            })
        }
    },
    props: ['bizData', 'historyData', 'oppBusiData', 'groupDatas', 'busiCode'],

    mounted() {
        let that = this;
        let reqArr = [];
        _.each(this.oppBusiData.restrictedStock, item => {
            reqArr.push(getStkCodeInfo(that, item.STK_CODE));
        })
        return Promise.all(reqArr).then(res => {
            _.each(res, (item, index) => {
                this.oppBusiData.restrictedStock[index].STK_NAME = item.STKNAME;
            })
            that.$nextTick(function () {
                this.bindEvents();
                this.show();
            })
        })
    },
    methods: {
        show() {
            this.$nextTick(() => {
                this.setData();
            });
        },
        setData() {
            if (this.historyData.QUOTA_INFO && this.historyData.QUOTA_INFO.RESTRICT_STOCK_INFO && !_.isEmpty(this.historyData.QUOTA_INFO.RESTRICT_STOCK_INFO)) {
                this.restrictStockInfoList = _.filter(this.historyData.QUOTA_INFO.RESTRICT_STOCK_INFO, obj => obj.OPER_TYPE !== "2");
            } else if (!_.isEmpty(this.oppBusiData.restrictedStock)) {
                this.restrictStockInfoList = _.cloneDeep(this.oppBusiData.restrictedStock);
            }

            this.selectType = this.restrictStockInfoList.length ? "yes" : "no";

            this.$nextTick(() => {
                _.each(this.restrictStockInfoList, (obj, index) => {
                    this.$refs["restrictStockForm" + index] && this.$refs["restrictStockForm" + index][0].form("loadData", obj)
                })
            })
        },
        bindEvents() {
            var that = this;

        },
        stockSelect(value) {
            let that = this;
            that.selectType = value;

            if (value == "yes") {
                that.initDomRestrictStockInfo(true);
            } else {
                that.restrictStockInfoList = [];
            }
        },
        bindFormEvents() {
            var that = this;
            _.each(that.restrictStockInfoList, (obj, index) => {
                var $STK_CODE_REFS = that.$refs["STK_CODE" + index] && that.$refs["STK_CODE" + index][0];
                var $STKEX_REFS = that.$refs["STKEX" + index] && that.$refs["STKEX" + index][0];
                var $TRDACCT_REFS = that.$refs["TRDACCT" + index] && that.$refs["TRDACCT" + index][0];
                var $STK_NAME_REFS = that.$refs["STK_NAME" + index] && that.$refs["STK_NAME" + index][0];
                var $restrictStockForm = that.$refs["restrictStockForm" + index] && that.$refs["restrictStockForm" + index][0];
                $STK_CODE_REFS && $STK_CODE_REFS.textinput({
                    onBlur(value) {
                        if (!value) {
                            return false;
                        }
                        var restrictStockInfoDomData = that.getDomData();
                        var sameRestrictStockStkCodeList = _.filter(restrictStockInfoDomData, obj => obj.STK_CODE == value);
                        if (value && sameRestrictStockStkCodeList.length >= 2) {
                            $STK_CODE_REFS && $STK_CODE_REFS.textinput("showTips", "不允许添加相同重复的证券代码").textinput("clear")
                            return false;
                        }
                        return getStkCodeInfo(that ,value).then((res) => {
                            if (_.isEmpty(res)) {
                                $STK_CODE_REFS && $STK_CODE_REFS.textinput("showTips", "证券代码[" + value + "]在交易市场不存在,请重新输入！").textinput("clear")
                                return false;
                            }
                            $STK_NAME_REFS && $STK_NAME_REFS.textinput("setValue", res.STKNAME).textinput("setDisabled").textinput("hideTips");
                            $STKEX_REFS && $STKEX_REFS.combobox("setValue", res.MARKET).combobox("setDisabled").combobox("hideTips");
                        })

                    }
                })
            })
        },
        initDomRestrictStockInfo(value) {
            (!value || this.restrictStockInfoList.length == 0) && this.restrictStockInfoList.push(this.getEmptyRestrictStockInfo())
        },

        getEmptyRestrictStockInfo() {
            return {
                REMOVE_FORBID_FLAG: "",
                STKBD: "",
                STKEX: "",
                TRDACCT: "",
                STK_CODE: "",
                STK_NAME: "",
                STK_AVL: "",
                MARKET_PRICE: "",
                REMOVE_DATE: "",
                HOLD_TYPE: ""
            }
        },
        addRestrictInfoHandler() {
            let that = this;
            if (that.restrictStockInfoList.length >= that.maxRestrictStock) {
                that.dialog({
                    hasMask: true,
                    messageText: "最多只能添加 " + that.maxRestrictStock + " 个限售股申报信息",
                    confirmButtonText: '确定'
                });
                return;
            }
            return that.validateDomForm().then((flag) => {
                if (flag == false) {
                    that.dialog({
                        hasMask: true,
                        messageText: "请先完善已有记录信息再添加！",
                        confirmButtonText: '确定'
                    });
                    return;
                }
                that.initDomRestrictStockInfo()
            })
        },
        removeRestrictInfoHandler(index) {
            var that = this;
            that.dialog({
                hasMask: true,
                messageText: "确认是否删除此条限售股申报信息？",
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                confirmedAction: function () {
                    that.$delete(that.restrictStockInfoList, index)
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
                var restrictStockInfoListDom = that.getDomData();
                var domStkCodeList = _.chain(restrictStockInfoListDom).map("STK_CODE").uniq().value();

                if (domStkCodeList.length < restrictStockInfoListDom.length) {
                    if (flag == false) {
                        that.dialog({
                            hasMask: true,
                            messageText: "证券代码有重复记录，请删掉重复记录",
                            confirmButtonText: '确定'
                        });
                        return;
                    }
                    return false;
                }
                return true;
            })
        },
        validateDomForm() {
            var syncValidateFunc = [];
            var that = this;
            _.each(that.restrictStockInfoList, (obj, index) => {
                var restrictStockForm = that.$refs["restrictStockForm" + index] && that.$refs["restrictStockForm" + index][0];
                restrictStockForm && syncValidateFunc.push(restrictStockForm.form("validate"));
            })
            return Promise.all(syncValidateFunc).then((flags) => {
                if (_.includes(flags, false)) {
                    return false;
                }
            })
        },
        getDomData() {
            var restrictStockInfoListDom = [];
            var that = this;
            _.each(that.restrictStockInfoList, (obj, index) => {
                var restrictStockInfoData = that.$refs["restrictStockForm" + index] && that.$refs["restrictStockForm" + index][0].form("getData")
                restrictStockInfoData && restrictStockInfoListDom.push(restrictStockInfoData);
            })
            return restrictStockInfoListDom;
        },
        getData() {
            let that = this;
            var params = {};
            Object.assign(params, {
                RESTRICT_STOCK_INFO: that.getDomData()
            });
            return params;
        }

    }
}
</script>

<style lang="less" >
.V0024-restrict-stock {
    position: relative;
    .restrict-stock-tip {
        position: absolute;
        left: 350px;
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

    .restrict-stock-box {
        position: relative;
        margin-bottom: 15px;
        &:last-child {
            border-bottom: none;
        }
        .restrict-stock-info-btn {
            display: flex;
            align-items: center;
        }

        .restrict-stock-form-wrap {
            display: flex;
            align-items: center;
            width: 1413px;
            height: 402px;
            background-color: #f7f7fa;
            border-radius: 4px;
        }
    }
    .has-restrict-stock-wrap {
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
            border: 1px solid #b7b7b7;
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

    .stock-add-bank-info {
        display: flex;
        align-items: center;
        justify-content: center;

        width: 1416px;
        height: 60px;
        background-color: #f8faff;
        border: 1px solid #bed0ff;
        border-radius: 4px;
        box-shadow: 0px 3px 18px rgba(0, 0, 0, 0.03);
        .stock-add-bank-text {
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
