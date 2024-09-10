<template>
    <div class="V0024-bank-select">
        <kui-fieldset :options="{title:'请选择需要签约的银行',theme:'concise'}">
        <div class="newBank">
            <div class="newBankInfo">
                <el-form :ref="'listRef'" :model="newBankInfo">
                    <el-form-item class="NEW_EXT_ORG" label="" prop="EXT_ORG" >
                        <img class="bank-icon" :src="newBankInfo.BANK_ICON" v-if="newBankInfo.BANK_ICON">
                        <el-input v-model="newBankInfo.NEW_EXT_ORG" :disabled='true'></el-input>
                        <el-button @click="selectBank()" >返回重选 ></el-button>
                    </el-form-item>
                    <div v-show="USER_TYPE == 0 && !disabledController.NEW_BANK_ACCT">
                            <kui-textinput ref="BANK_ACCT" :options="{title:'银行账户',labelWidth:150,width:400,field:'BANK_ACCT',validType:'num[16,20]',isNeedSecondInput:false, onBlur:this.checkNewBankAcct}" />
                            <kui-textinput class="BANK_AUTH_DATA" ref="BANK_PWD" :options="{title:'银行密码',labelWidth:315,width:400,field:'BANK_PWD', inputType:'password',showPassword:false,validType:'num[6]',maxlength:6}" />                                    
                    </div>
                    </el-form>
                <div class="tip-svg" v-if="showTips">
                    <div class="tip-tb">
                        <img :src="require('@icons/V0014/icon-warning.svg')">
                    </div>
                    <div class="tip-content" v-html="tipsContent"></div>
                </div>
            </div>
        </div>
        </kui-fieldset>       
    </div>
</template>

<script>
import { googlePlayVoice } from '../../../../../device/voice/voice';
import bankInfoMap from '../../../../../pages/bankSelect/bankIconInfo'
import des from "../../../../../tools/libs/standard-des"

export default {
    name: "v0024BankSelect",
    data() {
        return {
            newBankInfo: {
                bankAcctDisabled: true,
                NEW_EXT_ORG: '',
                NEW_EXT_ORG_CODE: '',
                NEW_BANK_ACCT: '',
                NEW_BANK_PWD: '',
                CONFIRM_NEW_BANK_PWD: '',
                BANK_ICON: ''
            },
            pwdFlag: false,
            ID_TYPE_ARR: [],
            isLoading: false,
            loadingText: "正在加载数据...",
            requireController: {
                NEW_EXT_ORG: false,
                NEW_BANK_ACCT: false,
                NEW_BANK_PWD: false
            },
            disabledController: {
                NEW_EXT_ORG: false,
                NEW_BANK_ACCT: false,
                NEW_BANK_PWD: false,
                NEW_BANK_ACCT_DISABLED: false,
            },
            showTips: false,
            tipsContent: '',
            signTipsContent: '',
            USER_TYPE: '',
            diagleTitle: '请确认您的存管银行及签约信息',
            centerDialogVisible: false,
            confirm: function() {},
            cancle: function() {},
            canPlayVoice: true,
            bankInfoMap: null,
            canShowConfim: true
        };
    },
    components: {

    },
    props: ['bizData', 'historyData', 'oppBusiData', 'groupDatas', 'busiCode'],
    mounted() {
        let that = this;
        that.bankInfoMap = bankInfoMap;
        that.bindEvents();
        that.loadBizData();
    },
    // activated() {
    //     let that = this;   
    //     that.bankInfoMap = bankInfoMap;     
    //     that.updateChooseBank();
    // },
    computed: {
        userType() {
            return this.$store.state.usertype;
        },

    },
    watch: {

    },
    methods: {
        pageActivated(_this){
            let that = this;
            if (that) {
                that.bankInfoMap = bankInfoMap;
                that.updateChooseBank();
            }
        },
        bindEvents(){
            let that = this;
            that.$refs["BANK_PWD"] && that.$refs["BANK_PWD"].textinput({ 
                onBlur(value){
                    if (value != that.newBankInfo.CONFIRM_NEW_BANK_PWD) {
                        that.canShowConfim && that.confirmPwd(value)
                    }
                }
            });
        },
        confirmPwd(value, callBack) {
            let that = this;
            googlePlayVoice("请再次输入您的银行卡密码");
            that.canShowConfim = false;
            that.password({
                title: '请再次输入您的银行卡密码',
                showForget: false,
                confirmedAction: function(params) {
                    that.canShowConfim = true;
                    // 如果输入得密码和当前弹出框内容相同 则校验通过
                    if (params.password == value) {
                        // 设置当前密码值给老密码
                        that.newBankInfo.CONFIRM_NEW_BANK_PWD = params.password;
                        callBack && callBack()
                        return {
                            checkResult: true,
                            errorText: ""
                        }
                    } else {
                        return {
                            checkResult: false,
                            errorText: "您两次输入的密码不一致，请重新输入"
                        }
                    }
                },
                canceledAction: function() {
                    that.canShowConfim = true;
                    that.newBankInfo.CONFIRM_NEW_BANK_PWD = "";
                    callBack && callBack()
                }
            })
        },
        checkNewBankAcct(value,e){
            let that = this;
            if (that.userType != "0") {
                return;
            }
            if (_.isEmpty(value)) {
                that.newBankInfo.NEW_BANK_PWD = "";
                that.newBankInfo.CONFIRM_NEW_BANK_PWD = "";
                that.requireController.NEW_BANK_PWD = false;
                that.disabledController.NEW_BANK_PWD = true;
                that.$refs["BANK_PWD"].textinput("changeRequired",false);
                that.$refs["BANK_PWD"].textinput("setDisabled");
                that.$refs["BANK_PWD"].textinput("setValue","");
                that.$refs["BANK_ACCT"].textinput("changeRequired",false);
            } else {
                that.$refs["BANK_ACCT"].textinput("changeRequired",true);
                that.bankAcctOnBlur(false)
            }
        },
        bankAcctOnBlur(isHistory) {
            let that = this;
            let customerInfo = that.$storage.getJsonSession(that.$definecfg.CUSTOMER_INFO);
            if (that.oppBusiData.CUBSB_TRD_INFO && that.oppBusiData.CUBSB_TRD_INFO.CUBSB_TRD_ID == "16") {
                //根据选择的银行查询银证交易配置
                return that.$syscfg.K_Request("Y3000015", {
                    CURRENCY: '0',
                    EXT_ORG: that.newBankInfo.NEW_EXT_ORG_CODE,
                    INT_ORG: customerInfo.INT_ORG,
                    CUBSB_TRD_ID: "16"
                }).then(res => {
                    if (res.Data.length > 0 && res.Data[0].CHK_BANK_PWD == "1") {
                        that.disabledController.NEW_BANK_PWD = false;
                        that.requireController.NEW_BANK_PWD = true;
                        that.$refs["BANK_PWD"].textinput("changeRequired",true);
                        that.$refs["BANK_PWD"].textinput("setEnabled");
                    } else {
                        that.disabledController.NEW_BANK_PWD = true;
                        that.requireController.NEW_BANK_PWD = false;
                        that.$refs["BANK_PWD"].textinput("changeRequired",false);
                        that.$refs["BANK_PWD"].textinput("setDisabled");
                        that.$refs['BANK_PWD'].textinput("setValue","");
                    }
                })
            } else {
                that.disabledController.NEW_BANK_PWD = true;
                that.requireController.NEW_BANK_PWD = false;
                that.$refs["BANK_PWD"].textinput("changeRequired",false);
                that.$refs["BANK_PWD"].textinput("setDisabled");
                that.$refs['BANK_PWD'].textinput("setValue","");
            }
        },

        loadBizData() {
            let that = this;
            let customerInfo = that.$storage.getJsonSession(that.$definecfg.CUSTOMER_INFO);
            that.historyData.ACCT_INFO.BANK_INFO && that.historyData.ACCT_INFO.BANK_INFO.BANK_AUTH_DATA && (that.newBankInfo.NEW_BANK_PWD = des.decrypt(that.historyData.ACCT_INFO.BANK_INFO.BANK_AUTH_DATA, customerInfo.CUST_CODE))
            that.historyData.ACCT_INFO.BANK_INFO && that.historyData.ACCT_INFO.BANK_INFO.BANK_ACCT && (that.newBankInfo.NEW_BANK_ACCT = that.historyData.ACCT_INFO.BANK_INFO.BANK_ACCT);
            that.historyData.ACCT_INFO.BANK_INFO && that.historyData.ACCT_INFO.BANK_INFO.pwdFlag && (that.pwdFlag = that.historyData.ACCT_INFO.BANK_INFO.pwdFlag);
            if (that.historyData.ACCT_INFO && that.historyData.ACCT_INFO.BANK_INFO) {
                that.newBankInfo.NEW_EXT_ORG = that.historyData.ACCT_INFO.BANK_INFO.EXT_ORG;
                that.newBankInfo.NEW_EXT_ORG_CODE = that.historyData.ACCT_INFO.BANK_INFO.ORG_CODE
                let selectOrg = _.find(that.oppBusiData.creditBankData, function(obj){
                    return obj.ORG_CODE == that.historyData.ACCT_INFO.BANK_INFO.ORG_CODE;
                })
                that.checkNewBankOrg(selectOrg, true);
            } 
            // 没有历史流水 直接跳转到读卡界面
            else {
                that.selectBank(true);
            }
        },
       /*
        *@Description: 选择银行
        *@MethodAuthor: LJC
        *@Date: 2020-11-06 13:52:32
       */
       selectBank(firstIn) {
            let that = this;
            if (that.userType == "0") {
                that.openBankAcct(firstIn);
            } else {
                that.$router.goModule("bankSelect", { bankList: that.oppBusiData.creditBankData, firstIn: firstIn || false, showHot: true });
            }
       },
       /*
        *@Description: 识别
        *@MethodAuthor: LJC
        *@Date: 2020-11-06 13:53:02
       */
       openBankAcct(firstIn) {
            this.$router.goModule("readBankCard", {
                ORG_CLS: "11",
                bankList: this.oppBusiData.creditBankData,
                index: this.$router.getCurrentRouteIndex(),
                firstIn: firstIn || false,
                showHot: true
            });
       },
        /*
         *@Description: 更新选择的银行信息
         *@MethodAuthor: LJC
         *@Date: 2020-11-06 15:07:18
        */
               /*
         *@Description: 银证参数配置查询
         *@MethodAuthor: LJC
         *@Date: 2020-11-06 16:18:32
        */
        getBankConfData(EXT_ORG, CUBSB_TRD_ID) {
            let that = this;
            let customerInfo = that.$storage.getJsonSession(that.$definecfg.CUSTOMER_INFO);
            return that.$syscfg.K_Request("Y3000015", {
                CURRENCY: "0",
                EXT_ORG: EXT_ORG,
                INT_ORG: customerInfo.INT_ORG,
                CUBSB_TRD_ID: CUBSB_TRD_ID
            });
        },
        updateChooseBank() {
            let that = this;
            console.log(that.$route.query)
            if (that.$route.query.selectVal && (that.$route.query.bankName !== undefined)) {
                that.oppBusiData.readBankCard = "1";
            } else {
                that.oppBusiData.readBankCard = "0";
            }
            if (that.$route.query && that.$route.query.selectVal && that.$route.query.selectVal != '') {
                let selectOrg = {};
                selectOrg = _.find(that.oppBusiData.creditBankData, function(obj){
                    return obj.ORG_CODE == that.$route.query.selectVal;
                })
                that.checkNewBankOrg(selectOrg);
            }
        },

                /*
        *@Description: 识别
        *@MethodAuthor: LJC
        *@Date: 2020-11-06 13:53:02
        */

        /*
         *@Description: 选择新存管银行操作
         *@MethodAuthor: LJC
         *@Date: 2020-11-06 15:24:02
        */
        checkNewBankOrg(bankOrg, isHistory) {
            let that = this;
            let customerInfo = that.$storage.getJsonSession(that.$definecfg.CUSTOMER_INFO);
            let proArray = [],
                bankConfData = [],
                cuacctArray =  _.pluck((_.filter(that.oppBusiData.cuacctInfo, function(v){
                    return v.CUACCT_ATTR === that.oppBusiData.CUACCT_ATTR ;
                }) || []),"CUACCT_CODE");
            that.newBankInfo.NEW_BANK_ACCT = "";
            that.newBankInfo.NEW_BANK_PWD = "";
            let hasSign = _.filter(that.oppBusiData.allSignUpInfo, function (v) {
                //银河个性化：银河证券的账户需要增加补0操作，否则该判断会不生效
                let retrunFlag = addZero(v.EXT_ORG) === bankOrg.ORG_CODE && v.CURRENCY === '0' && cuacctArray.indexOf(v.CUACCT_CODE) > -1;
                return  retrunFlag;
            }) || [];
            if (hasSign.length) {
                that.messageBox({
                    typeMessage: 'warn',
                    messageText: "您的资金账号【"+ cuacctCode + "】已签约" + bankOrg.ORG_FULL_NAME + "银行，不支持重复签约。",
                    confirmButtonText: '返回重选',
                    confirmedAction: function () {
                        that.selectBank(true);
                    },
                })
                return false;
            }
            
            that.isLoading = true;
            that.loadingText = "正在查询银证配置信息！";
            _.each(['16', '17', '18'], function (v) {
                proArray.push(that.getBankConfData(bankOrg.ORG_CODE, v));
            });
            that.oppBusiData.CHECK_NEW_BANK = bankOrg.CHK_BANK_PWD || "0";
            if (proArray.length > 0) {
                return Promise.all(proArray).then(res => {
                    console.log(res);
                    _.each(res, function(item) {
                        let userType = that.userType === "0" ? "0" : "1";
                        if (item.Data.length > 0 
                            && item.Data[0].CUBSB_TRD_ID
                            && (item.Data[0].USER_TYPES == "@" || item.Data[0].USER_TYPES == "" || _.indexOf(item.Data[0].USER_TYPES || "", userType) > -1)
                            && (_.indexOf(item.Data[0].CUACCT_ATTRS || "", "0") > -1 || item.Data[0].CUACCT_ATTRS == "")) {
                            bankConfData.push(item.Data[0]);
                        }
                    });
                    let flag = that.getTrdType(bankConfData,bankOrg.ORG_CODE);
                    if (that.historyData.CUACCT_CODE && that.historyData.ACCT_INFO.BANK_INFO && bankOrg.ORG_CODE == that.historyData.ACCT_INFO.BANK_INFO.ORG_CODE) {
                        that.newBankInfo.NEW_BANK_ACCT = that.historyData.ACCT_INFO.BANK_INFO.BANK_ACCT || "";
                        that.newBankInfo.NEW_BANK_PWD = des.decrypt(that.historyData.ACCT_INFO.BANK_INFO.BANK_AUTH_DATA, customerInfo.CUST_CODE);
                        that.newBankInfo.CONFIRM_NEW_BANK_PWD = that.newBankInfo.NEW_BANK_PWD;
                    } else {
                        that.newBankInfo.NEW_BANK_ACCT = "";
                        that.newBankInfo.NEW_BANK_PWD = "";
                        that.newBankInfo.CONFIRM_NEW_BANK_PWD = "";
                    }
                    // 如果是读卡 取读卡最新数据
                    if (that.$route.query && that.$route.query.cardNum && that.$route.query.cardNum != '' && !that.disabledController.NEW_BANK_ACCT) {
                        that.newBankInfo.NEW_EXT_ORG_CODE = bankOrg.ORG_CODE;
                        that.newBankInfo.NEW_EXT_ORG = bankOrg.ORG_NAME;
                        that.newBankInfo.NEW_BANK_ACCT = that.$route.query.cardNum;
                        that.$refs['BANK_ACCT'].textinput("setDisabled");
                        
                    }
                    if (that.newBankInfo.NEW_BANK_ACCT != '') {
                        that.bankAcctOnBlur(isHistory);
                    }
                    if (flag === false) {
                        that.newBankInfo.NEW_EXT_ORG = "";
                        that.newBankInfo.NEW_EXT_ORG_CODE = "";
                        that.newBankInfo.BANK_ICON = "";
                    } else {
                        let BANK_ICON = that.bankInfoMap.get(bankOrg.ORG_NAME) 
                            ? require("../../../../../icons/bank/" + that.bankInfoMap.get(bankOrg.ORG_NAME) + ".svg") 
                            : require("../../../../../icons/bank/chinaBank.svg") ;
                        that.newBankInfo.BANK_ICON = BANK_ICON;
                        that.newBankInfo.NEW_EXT_ORG_CODE = bankOrg.ORG_CODE;
                        that.newBankInfo.NEW_EXT_ORG = bankOrg.ORG_NAME;
                    }
                }).finally(() => {
                    that.oppBusiData.searchFlag = true;
                    that.isLoading = false;
                    that.$refs['BANK_ACCT'].textinput("setValue",that.newBankInfo.NEW_BANK_ACCT);
                    that.$refs['BANK_PWD'].textinput("setValue",that.newBankInfo.NEW_BANK_PWD);
                })
            } else {
                that.oppBusiData.searchFlag = true;
            }
        },
        /*
         *@Description: 获取三方存管签约方式
         *@MethodAuthor: LJC
         *@Date: 2020-11-06 16:56:33
        */
        getTrdType(bankConfData,extOrg) {
            let that = this;
                //判断该银行是否设置了不支持一步式签约
            that.oppBusiData.notAllowOneStepBanks = "";
            let isAllowFlag = that.oppBusiData.notAllowOneStepBanks.indexOf(extOrg) === -1;
            // 对于配置了不支持一步式签约的银行则强制设置16为空；
            let bankConf16 = isAllowFlag ? (_.find(bankConfData, function (v) {
                    return v.CUBSB_TRD_ID === '16';
                }) || "") : "",
                bankConf17 = _.find(bankConfData, function (v) {
                    return v.CUBSB_TRD_ID === '17';
                }) || "";

            if (that.userType != "0") {
                bankConf16 = '';
            }
            that.oppBusiData.CUBSB_TRD_INFO = '';

            //支持两种签约方式
            if (bankConf16 && bankConf17) {
                that.oppBusiData.CUBSB_TRD_INFO = bankConf16 || bankConf18;
                that.oppBusiData.CUBSB_TRD_INFO.CUBSB_TRD_TYPE = '0';
                that.requireController.NEW_BANK_ACCT = false;
                that.requireController.NEW_BANK_PWD = false;
                that.$refs["BANK_PWD"].textinput("changeRequired",false);
                that.$refs["BANK_ACCT"].textinput("changeRequired",false);
                that.disabledController.NEW_BANK_ACCT = false;
                that.disabledController.NEW_BANK_PWD = true;
                that.$refs["BANK_PWD"].textinput("setDisabled");
                that.$refs["BANK_ACCT"].textinput("setEnabled");
                if (that.oppBusiData.readBankCard == "1") {
                    that.disabledController.NEW_BANK_ACCT_DISABLED = true;
                    that.$refs["BANK_ACCT"].textinput("setDisabled");
                    that.showTips = false;
                } else {
                    that.disabledController.NEW_BANK_ACCT_DISABLED = false;
                    that.$refs["BANK_ACCT"].textinput("setEnabled");
                    that.showTips = true;
                    that.tipsContent = '若未填写银行账户，需要在业务办理完成后前往银行网点办理第三方存管签约确认手续，请您知悉。';
                }
            } else if (bankConf17 && !bankConf16) {
                that.oppBusiData.CUBSB_TRD_INFO = _.extend(bankConf17, {CUBSB_TRD_TYPE: '1'});
                that.requireController.NEW_BANK_ACCT = false;
                that.requireController.NEW_BANK_PWD = false;
                that.$refs["BANK_PWD"].textinput("changeRequired",false);
                that.$refs["BANK_ACCT"].textinput("changeRequired",false);
                that.disabledController.NEW_BANK_ACCT = true;
                that.disabledController.NEW_BANK_PWD = true;
                that.$refs["BANK_PWD"].textinput("setDisabled");
                that.$refs["BANK_ACCT"].textinput("setDisabled");
                that.showTips = true;
                that.tipsContent = '您选择的存管银行仅支持“预指定”签约，请您在业务办理完成后前往银行网点办理第三方存管签约确认手续。';
                if (that.userType != 0) {
                    that.tipsContent = "请您在业务办理完成后，前往银行网点办理第三方存管签约确认手续。"
                }
             
            } else if (!bankConf17 && bankConf16) {
                that.showTips = false;
                that.requireController.NEW_BANK_ACCT = true;
                that.$refs["BANK_ACCT"].textinput("changeRequired",true);
                that.disabledController.NEW_BANK_ACCT = false;
                that.$refs["BANK_ACCT"].textinput("setEnabled");
                that.oppBusiData.CUBSB_TRD_INFO = _.extend(bankConf16, {CUBSB_TRD_TYPE: '0'});
                if (bankConf16.CHK_BANK_PWD == "1") {
                    that.requireController.NEW_BANK_PWD = true;
                    that.$refs["BANK_PWD"].textinput("changeRequired",true);
                    that.disabledController.NEW_BANK_PWD = false;
                    that.$refs["BANK_PWD"].textinput("setEnabled");
                } else {
                    that.requireController.NEW_BANK_PWD = false;
                    that.$refs["BANK_PWD"].textinput("changeRequired",false);
                    that.disabledController.NEW_BANK_PWD = true;
                    that.$refs["BANK_PWD"].textinput("setDisabled");
                }
            }
            return that.oppBusiData.CUBSB_TRD_INFO;
        },
        bankAcctValidate() {
            let that = this;
            let customerInfo = that.$storage.getJsonSession(that.$definecfg.CUSTOMER_INFO);
            if (that.oppBusiData.CUBSB_TRD_INFO && that.oppBusiData.CUBSB_TRD_INFO.CUBSB_TRD_ID == "16") {
                //根据选择的银行查询银证交易配置
                return that.$syscfg.K_Request("Y3000015", {
                    CURRENCY: '0',
                    EXT_ORG: that.newBankInfo.NEW_EXT_ORG_CODE,
                    INT_ORG: customerInfo.INT_ORG,
                    CUBSB_TRD_ID: "16"
                }).then(res => {
                    if (res.Data.length > 0 && res.Data[0].CHK_BANK_PWD == "1") {
                        return false;
                    }
                    return true;
                })
            }
        },
        validate() {
            let that = this;
            if(!(that.$refs["BANK_ACCT"].textinput("validate")) || !(that.$refs["BANK_PWD"].textinput("validate"))){
                return false;
            }
            let password = that.$refs["BANK_PWD"].textinput("getValue");
            if (password && (password != that.newBankInfo.CONFIRM_NEW_BANK_PWD)) {
                return false;
            }
            let bankAcct = that.$refs["BANK_ACCT"].textinput("getValue");
            if (bankAcct && !password) {
                return that.bankAcctValidate();
            } else {
                return true;
            }
        },
        getData: function(){
            let that = this;
            let customerInfo = that.$storage.getJsonSession(that.$definecfg.CUSTOMER_INFO);
            return {
                BANK_INFO: {
                    EXT_ORG: that.newBankInfo.NEW_EXT_ORG_CODE || "",
                    ORG_CODE: that.newBankInfo.NEW_EXT_ORG_CODE || "", 
                    EXT_ORG_TEXT: `${that.newBankInfo.NEW_EXT_ORG_CODE}-${that.newBankInfo.NEW_EXT_ORG}` || "",
                    BANK_ACCT: that.$refs["BANK_ACCT"].textinput("getValue") || "",
                    BANK_AUTH_DATA: that.$refs["BANK_PWD"].textinput("getValue") && utils.encrypt(that.$refs["BANK_PWD"].textinput("getValue"), customerInfo.CUST_CODE) || "",
                    CUBSB_TRD_ID: that.$refs["BANK_ACCT"].textinput("getValue") ? "16" : "17",
                    CUBSB_TYPE: "1",
                    pwdFlag:that.pwdFlag //增加一个密码启用或者禁用的标志
                }
            };
        }
    }
}
</script>

<style lang="less" >
.V0024-bank-select {
    .kui-fieldset .fieldset-legend .fieldset-legend-title {
        width: 281px;
        height: 35px;
        font-family: Alibaba PuHuiTi;
        font-weight: 500;
        color: #1f59db;
        font-size: 26px;
    }

    .flow-div {
        margin-top: 0px;
    }
    .self-normalInput-required {
        .el-form-item__label:before {
            content: "*";
            color: #f56c6c;
            margin-right: 4px;
        }
    }
    .accountInfo {
        .mainAccountInfo {
            background-color: #f1f7fc;
            border-radius: 8px;
            padding: 20px;
            .el-form {
                .el-form-item {
                    .el-form-item__label{
                        font-size: 24px;
                    }
                    .el-form-item__content {
                        width: 400px;
                        .el-input {
                            font-size: 24px;
                            .el-input__inner {
                                height: 50px;
                            }
                        }
                        .el-input.is-disabled {
                            .el-input__inner {
                                background-color: #f7f4f4;
                                border-color: #d6d8dc;
                                color: #36393f;
                            }
                        }
                    }
                }
                .el-form-item.MAIN_CUACCT, .el-form-item.MAIN_CUACCT_PWD {
                    padding-top: 20px;
                }
            }
        }
    }
    .newBank {
        margin: 0 0;
        width: 1400px;
        .newBankInfo {
            background-color: #f7f7fa;
            border-radius: 8px;
            padding: 20px 0;
            margin-bottom: 30px;
            .el-form {
                    .el-form-item {
                    padding-top: 20px;
                    .el-form-item__label{
                        color:#252525;
                        font-size:24px;
                        line-height: 50px;
                    }
                    .el-form-item__label2{
                        color:#252525;
                        font-size:24px;
                        line-height: 50px;
                    }
                    .el-form-item__content {
                        width: 400px;
                        .el-input {
                            font-size: 24px;
                            .el-input__inner {
                                height: 54px;
                                border-radius: 2px;
                                font-size: 24px;
                                line-height: 68px;
                            }
                        }
                        .el-input.is-disabled {
                            .el-input__inner {
                                background-color: #edf0f8;
                                border: 1px solid;
                                border-color: #d6d8dc;
                                color: #999999;
                            }
                        }
                    }
                }
                .el-form-item.NEW_EXT_ORG {
                    // width: 1268px;
                    width: 90%;
                    display: flex;
                    margin-left: 32px;
                    padding-top: 20px;
                    padding-left: 20px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid;
                    border-color: #eaeaea;
                    .fund-del {
                        position: absolute;
                        right: -124px;
                    }
                    .el-form-item__content {
                        display: flex;
                        align-items: center;
                        // width: 715px;
                        width: 100%;
                        .bank-icon {
                            width: 50px;
                        }
                        .el-button {
                            width: 156px;
                            margin-left: 15px;
                            background-color: #ebf0ff;
                            color: #3b6aff;
                            border: 1px solid #3b6aff;
                            font-family: Alibaba PuHuiTi;
                            font-size: 24px;
                        }
                    }
                    .el-input {
                        width: 150px;
                    }
                    .el-input.is-disabled {
                        .el-input__inner {
                            font-family: Alibaba PuHuiTi;
                            background-color: transparent;
                            border: none;
                            color: #000;
                            //margin-left: 30px;
                        }
                    }
                }
            }
            .password-tips {
                margin-left: 756px;
                font-family: Alibaba PuHuiTi;
                color: #eb6e20;
                font-size: 22px;
            }
            .tip-svg {
                display: flex;
                align-items: center;
                margin-left: 60px;
                margin-top: 20px;
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
            .tipsContent {
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
        .el-button-add {
            height: 60px;
            width: 100%;
            color: #1f5fd8;
            border: 1px solid #1f5fd8;
            font-size: 20px;
            border-radius: 12px;
            margin-top: 15px;
    }
}
</style>
