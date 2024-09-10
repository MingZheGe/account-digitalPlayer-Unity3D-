<template>
    <div class="commom-cuacct-info-box fieldset-content">
        <flowTip ref="flowTip"></flowTip>
        <kui-fieldset ref="fundContent" :options="{ title:'请输入银行密码', theme:'concise' }" class='cuacct-info'>
            <kui-form ref="" v-for="(item, index) in cuacctList" :key="index" class="cuacct-form">
                <div class="line">
                    <div class="cuacct-item"><span class="cuacct-lable">资金账户：</span><span class="cuacct-value">{{item.CUACCT_CODE}}</span></div>
                    <div class="cuacct-item"><span class="cuacct-lable">签约银行名称：</span><span class="cuacct-value">{{getExtOrgName(item.EXT_ORG)}}</span></div>
                </div>
                <div class="line">
                    <div class="cuacct-item"><span class="cuacct-lable">银行卡号：</span><span class="cuacct-value">{{item.BANK_ACCT}}</span></div>
                    <kui-textinput class="cuacct-password PASSWORD" :ref="'BANK_PWD' + index" :options="{title:'银行密码', labelWidth:290, width:250, inputType: 'password', required:false, field:'BANK_PWD' + index, validType:'num[6]', required: true}" />
                </div>
            </kui-form>
        </kui-fieldset>
    </div>
</template>

<script>
import des from '../../../../../tools/libs/standard-des';
import flowTip from '../../../../../components/common/flowTip.vue'

export default {
    props: ["bankList", "bankData", "CUACCT_DATA", "oppBusiData"],
    data() {
        return {
            cuacctList: [],
        }
    },
    components:{
        flowTip
    },
    created() {
        let that = this;
        let pwdCuacct = _.filter(that.bankList, item => {
            return item.CHK_BANK_PWD == "1"
        }) || [];
        this.cuacctList = pwdCuacct;
        this.bankConf = _.filter(that.bankData, function(obj){
            return obj.ORG_TYPE ==="1"
        })
    },
    mounted() {
        let that = this;
        that.$refs.flowTip.pushFlowTip({
            title : "根据相关银行要求，解绑银行账户前需要校验银行密码",
            type: 'warning',
            key: 'validate-psw'
        })
        that.setData();
    },
    methods: {
        setData() {
            let that = this;
            if (!_.isEmpty(that.CUACCT_DATA)) {
                _.each(that.CUACCT_DATA, cuacct => {
                    let index = _.findIndex(that.cuacctList, (item, index) => {
                        return item.CUACCT_CODE == cuacct.CUACCT_CODE && item.CURRENCY == cuacct.CURRENCY
                    })
                    if (index > -1) {
                        that.$refs['BANK_PWD' + index][0].textinput("setValue", des.decrypt(cuacct.BANK_AUTH_DATA, that.oppBusiData.customerInfo.CUST_CODE))
                    }
                })
            }
        },
        formatterExtOrg(arg) {
            var that = this;
            if (!that.oppBusiData.isWin || _.isEmpty(arg.trim())) {
                return arg;
            }
            for (var i = 0, n = 4 - arg.length; i < n; i++) {
                arg = "0" + arg;
            }
            return arg;
        },
        getExtOrgName(EXT_ORG) {
            let that = this;
            let obj = _.find(this.bankConf, item => {
                return that.formatterExtOrg(item.ORG_CODE) == EXT_ORG
            })
            return (obj && obj.ORG_NAME) || EXT_ORG
        },
        validate() {
            let that = this;
            let flag = true;
            _.each(that.cuacctList, (item, index) => {
                flag = flag && that.$refs["BANK_PWD" + index][0].validate();
            })
            if(!flag) {
                // 请校验密码
                return false;
            }
        },
        mergeCodeMsg(arr) {
            let mergerArr = [];
            _.each(arr, item => {
                mergerArr.push(_.extend({}, item, {
                    "CODE": "",
                    "MSG": "",
                    "CSDC_CODE": "",
                    "CSDC_MSG": ""
                }))
            });
            return mergerArr;
        },
        getData() {
            let that = this;
            _.each(that.cuacctList, (item, index) => {
                let pwd = that.$refs['BANK_PWD' + index][0].textinput('getValue');
                _.each(that.oppBusiData.cuacctDataArr, cuacct => {
                    if (item.CUACCT_CODE == cuacct.CUACCT_CODE && item.CURRENCY == cuacct.CURRENCY) {
                        cuacct.BANK_AUTH_DATA = des.encrypt(pwd, that.oppBusiData.customerInfo.CUST_CODE);
                        cuacct.BANK_PWD = des.encrypt(pwd, that.oppBusiData.customerInfo.CUST_CODE);
                    }
                })
            })
            let custCancelObj = {};
            custCancelObj.CUACCT_DATA = _.cloneDeep(that.bankList);
            custCancelObj.CUACCT_CANCEL = that.bankList.length ? "1" : "0";
            return custCancelObj
        }
    }
}
</script>

<style lang="less">
.commom-cuacct-info-box {
    .cuacct-info {
        .kui-fieldset-wrap {
            position: relative;
            .lookOpened {
                display: flex;
                align-items: center;
                position: absolute;
                z-index: 1;
                right: 17px;
                top: -58px;
                .el-button {
                    background-color: #f7f7fa;
                    border-radius: 4px;
                    font-family: Alibaba PuHuiTi;
                    color: #666666;
                    font-size: 24px;
                    
                    height: 50px;
                    .show-more {
                        position: relative;
                        top: -4px;
                    }
                }
            }
        }
        .cuacct-form {
            width: 100%;
            border: 1px solid;
            border-color: #e0e0e0;
            border-radius: 4px;
            margin-bottom: 20px;
            padding: 20px 0;
            background: #f7f7fa;
            .line {
                display: flex;
                line-height: 60px;
                align-items: center;
            }
            .cuacct-item {
                width: 30%;
                font-size: 24px;
                padding-left: 144px;
                .cuacct-lable {
                    font-weight: 700;
                }
                .cuacct-value {

                }
            }
            .kui-textinput-title {
                font-size: 24px;
                font-weight: 700;
            }
        }
    }
    
}
</style>

