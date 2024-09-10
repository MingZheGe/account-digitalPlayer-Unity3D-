<template>
    <div class="open-custody V0052_openBizBankInfoNode">
        <flowTip ref="flowTip"></flowTip>
        <div class="newBank">
            <div class="title">
                <div class="logo"></div>
                <div class="titleContent">
                    请选择需要开通的存管银行
                </div>
            </div>
            <div class="newBankInfo">
                <el-form :rules="rules" :model="newBankInfo" ref="newBankInfo">
                    <el-form-item :class="{'self-normalInput-required': requireController.NEW_EXT_ORG}" :required="requireController.NEW_EXT_ORG" class="NEW_EXT_ORG" label="" prop="NEW_EXT_ORG">
                        <img class="bank-icon" :src="newBankInfo.BANK_ICON">
                        <el-input :disabled="true" v-model="newBankInfo.NEW_EXT_ORG"></el-input>
                        <!-- <el-button v-show="USER_TYPE == 0" @click="openBankAcct()">重新识别</el-button> -->
                        <el-button @click="selectBank()">{{ !!newBankInfo.NEW_EXT_ORG ? '返回重选 >' : '选择银行 >'}}</el-button>
                    </el-form-item>
                    <el-form-item v-show="USER_TYPE == 0 && !disabledController.NEW_BANK_ACCT" :class="{'self-normalInput-required': requireController.NEW_BANK_ACCT}" label="银行账户:" prop="NEW_BANK_ACCT">
                        <el-input :disabled="disabledController.NEW_BANK_ACCT_DISABLED" v-model="newBankInfo.NEW_BANK_ACCT"></el-input>
                    </el-form-item>
                    <el-form-item v-show="USER_TYPE == 0 && !disabledController.NEW_BANK_ACCT && !disabledController.NEW_BANK_PWD" :class="{'self-normalInput-required': requireController.NEW_BANK_PWD}" label="银行密码:" prop="NEW_BANK_PWD">
                        <el-input type="password" class="PASSWORD" ref="NEW_BANK_PWD" :disabled="disabledController.NEW_BANK_PWD" v-model="newBankInfo.NEW_BANK_PWD"></el-input>
                    </el-form-item>
                    <!-- <div class="password-tips" v-if="!disabledController.NEW_BANK_PWD && USER_TYPE == 0">请确保您的银行卡密码输入正确</div> -->
                </el-form>
                <div class="tipsContent" v-if="showTips">
                    <img class='img' :src="require('@icons/V0014/icon-warning.svg')">
                    {{tipsContent}}
                </div>
            </div>
        </div>
        <loading
            :loadingText="loadingText"
            :showLoading="isLoading"
            ownClass="movi"
        ></loading>
    </div>
</template>

<script>
import bankInfoMap from '../../../../pages/bankSelect/bankIconInfo';
import loading from '../../../../components/common/loading.vue';
import flowTip from '../../../../components/common/flowTip.vue';
import des from "../../../../tools/libs/standard-des"
import validateRules from '../../../../components/preEntry/validateRules';
import { googlePlayVoice } from '../../../../device/voice/voice';

export default {
    
    data() {
        var checkNewBankAcct = (rule, value, callback) => {
            let that = this;
            if (that.userType != "0") {
                callback()
            }
            if (that.requireController.NEW_BANK_ACCT && _.isEmpty(value)) {
                callback(new Error('银行账号不能为空！'));
                return false;
            }
            let numVaild = validateRules['num'].valid(value, [1, 25]);
            if (!(!that.requireController.NEW_BANK_ACCT && _.isEmpty(value))) {
                if (!numVaild) {
                    callback(new Error('请输入1到25位数字'));
                    return false;
                }
            }
            if (_.isEmpty(value)) {
                that.newBankInfo.NEW_BANK_PWD = "";
                that.newBankInfo.CONFIRM_NEW_BANK_PWD = "";
                that.requireController.NEW_BANK_PWD = false;
                that.disabledController.NEW_BANK_PWD = true;
                callback()
            } else {
                that.bankAcctOnBlur(false)
                callback();
            }
        }
        var checkNewBankPwd = (rule, value, callback) => {
            let that = this;
            if (that.userType != "0") {
                callback()
            }
            if (!that.requireController.NEW_BANK_PWD || that.disabledController.NEW_BANK_PWD) {
                callback()
                return;
            }
            if (that.requireController.NEW_BANK_PWD && _.isEmpty(value)) {
                callback(new Error('银行密码不能为空！'));
                return;
            }
            let numVaild = validateRules['num'].valid(value, [6]);
            if (!numVaild) {
                callback(new Error('请输入6位数字'));
                return;
            }
            // 已经验证过密码 
            if (that.newBankInfo.NEW_BANK_PWD != that.newBankInfo.CONFIRM_NEW_BANK_PWD) {
                that.canShowConfim && that.confirmPwd({
                    fieldLabel: "银行密码",
                    title: "请再次输入银行密码"
                }, value, callback)
            } else {
                callback()
            }
        }

        return {
            newBankInfo: {
                NEW_EXT_ORG: '',
                NEW_EXT_ORG_CODE: '',
                NEW_BANK_ACCT: '',
                NEW_BANK_PWD: '',
                CONFIRM_NEW_BANK_PWD: '',
                BANK_ICON: ''
            },

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

            rules: {
                NEW_BANK_ACCT: [{ validator: checkNewBankAcct, trigger: "blur"}],
                NEW_BANK_PWD: [{ validator: checkNewBankPwd, trigger: "blur"}],
            },

            bankList: [],

            isLoading: false,
            loadingText: "正在加载数据...",

            showTips: false,
            tipsContent: '',

            USER_TYPE: '',
            //ID_TYPE_ARR: [],

            canPlayVoice: true,
            bankInfoMap: null,
            canShowConfim: true
        }
    },
    components: {
        loading,
        flowTip,
    },
    props: ["bizData", "historyData", "oppBusiData", "groupData"],
    computed: {
        busiCode() {
            return this.$store.state.busicode;
        },
        userType() {
            return this.$store.state.usertype;
        },
        keydownSure() {
            return this.$store.state.keyCodeSure;
        }
    },
    watch: {
        'newBankInfo.NEW_EXT_ORG': {
            immediate: true,
            handler(val) {
                if (val.length) {
                    this.changeNextDisable(false)
                } else {
                    this.changeNextDisable(true)
                }
            }
        },
        keydownSure(val){
            if (val) {
                (this.newBankInfo.NEW_BANK_PWD != this.newBankInfo.CONFIRM_NEW_BANK_PWD) && this.$refs.NEW_BANK_PWD.blur()
            }
        },
    },
    mounted() {
        let that = this;
        that.USER_TYPE = that.userType;

        that.bankInfoMap = bankInfoMap;

        //that.getIdTypeArr();

        that.initData();

        that.loadBizData();
    },
    // activated() {
    //     let that = this;
    //     that.bankInfoMap = bankInfoMap;
    //     that.updateChooseBank();
    // },
    methods: {
        pageActivated(_this){
            console.log("pageactivated");
            let that = _this.$refs.V0052_openBizBankInfoNode;
            if (that) {
                that.bankInfoMap = bankInfoMap;
                that.updateChooseBank();
            }
        },
        confirmPwd(tipObj, value, callBack) {
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
                        that.oppBusiData.CONFIRM_NEW_BANK_PWD = that.newBankInfo.CONFIRM_NEW_BANK_PWD;
                        that.oppBusiData.NEW_BANK_PWD = that.newBankInfo.NEW_BANK_PWD;
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
        updateChooseBank() {
            let that = this;
            console.log(that.$route.query)
            if (that.$route.query.selectVal && (that.$route.query.bankName !== undefined)) {
                that.oppBusiData.readBankCard = "1";
            } else {
                that.oppBusiData.readBankCard = "0";
            }
            if (that.$route.query && that.$route.query.selectVal && that.$route.query.selectVal != '') {
                that.oppBusiData.NEW_BANK_ACCT = "";
                that.oppBusiData.NEW_BANK_PWD = "";
                that.oppBusiData.CONFIRM_NEW_BANK_PWD = "";
                let selectOrg = _.find(that.bankList, function(obj){
                    return obj.EXT_ORG == that.$route.query.selectVal;
                })
                that.checkNewBankOrg(selectOrg);
            }
        },
        loadBizData() {
            let that = this;
            that.historyData.NEW_BANK_PWD && (that.newBankInfo.NEW_BANK_PWD = des.decrypt(that.historyData.NEW_BANK_PWD, that.historyData.CUST_CODE))
            that.historyData.BANK_ACCT && (that.newBankInfo.BANK_ACCT = that.historyData.BANK_ACCT);
            if (!that.oppBusiData.readBankCard) {
                that.historyData.readBankCard && (that.oppBusiData.readBankCard = that.historyData.readBankCard)
            }
            if (that.historyData.EXT_ORG) {
                that.newBankInfo.NEW_EXT_ORG = that.historyData.NEW_EXT_ORG_TEXT;
                that.newBankInfo.NEW_EXT_ORG_CODE = that.historyData.EXT_ORG
                let selectOrg = _.find(that.bankList, function(obj){
                    return obj.EXT_ORG == that.historyData.EXT_ORG;
                })
                that.checkNewBankOrg(selectOrg, true);
            } 
            // 没有历史流水 直接跳转到读卡界面
            else {
                that.selectBank(true);
            }
        },
        getBankConfData(EXT_ORG, CUBSB_TRD_ID) {
            let that = this;
            let userInfo = that.$storage.getJsonSession(that.$definecfg.USER_INFO);
            let OPEN_ORG_INFO = that.$storage.getJsonSession(that.$definecfg.OPEN_ORG_INFO) || {};
            let orgCode = OPEN_ORG_INFO.ORG_CODE || userInfo.ORG_CODE || "";
            return that.$syscfg.K_Request("Y3000015", {
                CURRENCY: "0",
                EXT_ORG: EXT_ORG,
                INT_ORG: orgCode,
                CUBSB_TRD_ID: CUBSB_TRD_ID
            });
        },
        checkNewBankOrg(bankOrg, isHistory) {
            let that = this;
            let proArray = [],
                bankConfData = [];
            that.newBankInfo.NEW_BANK_ACCT = "";
            that.newBankInfo.NEW_BANK_PWD = "";
            that.isLoading = true;
            that.loadingText = "正在查询银证配置信息！";
            _.each(['16', '17'], function (v) {
                proArray.push(that.getBankConfData(bankOrg.EXT_ORG, v));
            });
            that.oppBusiData.CHECK_NEW_BANK = bankOrg.CHK_BANK_PWD || "0";
            if (proArray.length > 0) {
                return Promise.all(proArray).then(res => {
                    _.each(res, function(item) {
                        let userType = that.userType === "0" ? "0" : "1";
                        if (item.Data.length > 0 
                            && item.Data[0].CUBSB_TRD_ID
                            && (item.Data[0].USER_TYPES == "@" || item.Data[0].USER_TYPES == "" || _.indexOf(item.Data[0].USER_TYPES || "", userType) > -1)
                            && (_.indexOf(item.Data[0].CUACCT_ATTRS || "", "0") > -1 || item.Data[0].CUACCT_ATTRS == "")) {
                            bankConfData.push(item.Data[0]);
                        }
                    });
                    let flag = that.getTrdType(bankConfData,bankOrg.EXT_ORG);
                    if (that.historyData.EXT_ORG && bankOrg.EXT_ORG == that.historyData.EXT_ORG) {
                        that.newBankInfo.NEW_EXT_ORG_CODE = that.historyData.EXT_ORG || "";
                        that.newBankInfo.NEW_BANK_ACCT = that.historyData.BANK_ACCT || "";
                        that.newBankInfo.NEW_BANK_PWD = des.decrypt(that.historyData.NEW_BANK_PWD, that.historyData.CUST_CODE);
                        that.newBankInfo.CONFIRM_NEW_BANK_PWD = that.newBankInfo.NEW_BANK_PWD;
                    } else {
                        that.newBankInfo.NEW_EXT_ORG_CODE = bankOrg.EXT_ORG;
                        that.newBankInfo.NEW_BANK_ACCT = that.oppBusiData.NEW_BANK_ACCT || "";
                        that.newBankInfo.NEW_BANK_PWD = that.oppBusiData.NEW_BANK_PWD || "";
                        that.newBankInfo.CONFIRM_NEW_BANK_PWD = that.oppBusiData.CONFIRM_NEW_BANK_PWD || "";
                    }
                    // 如果是读卡 取读卡最新数据
                    if (that.$route.query 
                        && that.$route.query.cardNum 
                        && that.$route.query.cardNum != '' 
                        && !that.disabledController.NEW_BANK_ACCT) {
                        that.newBankInfo.NEW_EXT_ORG_CODE = bankOrg.EXT_ORG;
                        that.newBankInfo.NEW_EXT_ORG = bankOrg.ORG_NAME;
                        that.newBankInfo.NEW_BANK_ACCT = that.$route.query.cardNum;
                    }
                    if (that.newBankInfo.NEW_BANK_ACCT != '') {
                        that.bankAcctOnBlur(isHistory);
                    }

                    if (flag === false) {
                        that.newBankInfo.NEW_EXT_ORG = "";
                        that.newBankInfo.NEW_EXT_ORG_CODE = "";
                        that.newBankInfo.BANK_ICON = "";
                        that.oppBusiData.NEW_EXT_ORG = "";
                        that.oppBusiData.NEW_BANK_ACCT = "";
                    } else {
                        let BANK_ICON = that.bankInfoMap.get(bankOrg.ORG_NAME) 
                            ? require("../../../../icons/bank/" + that.bankInfoMap.get(bankOrg.ORG_NAME) + ".svg") 
                            : require("../../../../icons/bank/chinaBank.svg") ;
                        that.newBankInfo.BANK_ICON = BANK_ICON;
                        that.newBankInfo.NEW_EXT_ORG_CODE = bankOrg.EXT_ORG;
                        that.newBankInfo.NEW_EXT_ORG = bankOrg.ORG_NAME;
                        that.oppBusiData.NEW_EXT_ORG = bankOrg.ORG_NAME;
                        that.oppBusiData.NEW_EXT_ORG_CODE = bankOrg.EXT_ORG;
                    }
                }).finally(() => {
                    that.isLoading = false;
                })
            }
        },
        bankAcctOnBlur(isHistory) {
            let that = this;
            that.oppBusiData.NEW_BANK_ACCT = that.newBankInfo.NEW_BANK_ACCT;
            if (that.oppBusiData.CUBSB_TRD_INFO && that.oppBusiData.CUBSB_TRD_INFO.CUBSB_TRD_ID == "16") {
                let userInfo = that.$storage.getJsonSession(that.$definecfg.USER_INFO);
                let OPEN_ORG_INFO = that.$storage.getJsonSession(that.$definecfg.OPEN_ORG_INFO) || {};
                let orgCode = OPEN_ORG_INFO.ORG_CODE || userInfo.ORG_CODE || "";
                //根据选择的银行查询银证交易配置
                return that.$syscfg.K_Request("Y3000015", {
                    CURRENCY: '0',
                    EXT_ORG: that.newBankInfo.NEW_EXT_ORG_CODE,
                    INT_ORG: orgCode,
                    CUBSB_TRD_ID: "16"
                }).then(res => {
                    if (res.Data.length > 0 && res.Data[0].CHK_BANK_PWD == "1") {
                        that.disabledController.NEW_BANK_PWD = false;
                        that.requireController.NEW_BANK_PWD = true;
                        if (that.canPlayVoice && !isHistory) {
                            googlePlayVoice("请输入您的存管银行卡密码，并按确认键结束");
                        }
                    } else {
                        that.disabledController.NEW_BANK_PWD = true;
                        that.requireController.NEW_BANK_PWD = false;
                    }
                })
            } else {
                that.disabledController.NEW_BANK_PWD = true;
                that.requireController.NEW_BANK_PWD = false;
            }
        },
        getTrdType(bankConfData, extOrg) {
            let that = this;
            let bankConf16 = "", bankConf17 = "";
            that.showTips = false;
            _.each(bankConfData, function (bank, i) {
                //判断该银行是否设置了不支持一步式签约
                let isAllowFlag = that.oppBusiData.notAllowOneStepBanks.indexOf(extOrg) === -1;
                //机构产品 只支持预指定 银行账户与银行密码不可填  只控制人民币 港币美元不控制
                if(that.justAllowTwoSteps === "1" && bank.CURRENCY === "0"){
                    isAllowFlag = false;
                }
                //对于配置了不支持一步式签约的银行则强制设置16为空；
                if (bank.CUBSB_TRD_ID === "16" && isAllowFlag) {//券商发起,银证开户 一步式
                    bankConf16 = bank;
                } else if (bank.CUBSB_TRD_ID === "17") {//券商发起,预指定银行  预指定
                    bankConf17 = bank;
                }
            });
            //券商端一步式 或者券商端两步式银行
            if ("" === bankConf16 && "" === bankConf17) {
                that.messageBox({
                    typeMessage: 'warn',
                    messageText: '选择银行不支持三方存管签约，请返回重选',
                    confirmButtonText: '返回重选',
                    confirmedAction: function () {
                        that.selectBank(true);
                    },
                })
                that.$nextTick(() => {
                    that.newBankInfo.NEW_EXT_ORG = "";
                    that.newBankInfo.NEW_EXT_ORG_CODE = "";
                    that.newBankInfo.BANK_ICON = "";
                })
                return false;
            }
            if (bankConf16 && bankConf17) {
                that.oppBusiData.CUBSB_TRD_INFO = bankConf16;
                that.oppBusiData.CUBSB_TRD_INFO.CUBSB_TRD_TYPE = '0';
                that.requireController.NEW_BANK_ACCT = false;
                that.requireController.NEW_BANK_PWD = false;
                that.disabledController.NEW_BANK_ACCT = false;
                that.disabledController.NEW_BANK_PWD = true;
                if (that.oppBusiData.readBankCard == "1") {
                    that.disabledController.NEW_BANK_ACCT_DISABLED = true;
                    that.showTips = false;
                } else {
                    that.disabledController.NEW_BANK_ACCT_DISABLED = false;
                    that.showTips = true;
                    that.tipsContent = '若未填写银行账户，需要在业务办理完成后前往银行网点办理第三方存管签约确认手续，请您知悉。';
                }
            } else if (bankConf17 && !bankConf16) {
                that.oppBusiData.CUBSB_TRD_INFO = _.extend(bankConf17, {CUBSB_TRD_TYPE: '1'});
                that.requireController.NEW_BANK_ACCT = false;
                that.requireController.NEW_BANK_PWD = false;
                that.disabledController.NEW_BANK_ACCT = true;
                that.disabledController.NEW_BANK_PWD = true;
                that.showTips = true;
                that.tipsContent = '您选择的存管银行仅支持“预指定”签约，请您在业务办理完成后前往银行网点办理第三方存管签约确认手续。';
                if (that.userType != 0) {
                    that.tipsContent = "请您在业务办理完成后，前往银行网点办理第三方存管签约确认手续。"
                }
            } else if (!bankConf17 && bankConf16) {
                that.requireController.NEW_BANK_ACCT = true;
                that.disabledController.NEW_BANK_ACCT = false;
                that.oppBusiData.CUBSB_TRD_INFO = _.extend(bankConf16, {CUBSB_TRD_TYPE: '0'});
                if (that.oppBusiData.CHECK_NEW_BANK == "1") {
                    that.requireController.NEW_BANK_PWD = true;
                    that.disabledController.NEW_BANK_PWD = false;
                } else {
                    that.requireController.NEW_BANK_PWD = false;
                    that.disabledController.NEW_BANK_PWD = true;
                }
            }
            return that.oppBusiData.CUBSB_TRD_INFO;
        },
        selectBank(firstIn) {
            let that = this;
            if (that.userType == "0") {
                that.openBankAcct(firstIn);
            } else {
                that.$router.goModule("bankSelect", { bankList: that.bankList, firstIn: firstIn || false, showHot: true });
            }
        },
        openBankAcct(firstIn) {
            this.$router.goModule("readBankCard", {
                ORG_CLS: "11",
                bankList: this.bankList,
                index: this.$router.getCurrentRouteIndex(),
                firstIn: firstIn || false,
                showHot: true
            });
       },
        initData() {
            let that = this;
            that.bankList = that.oppBusiData.bankList;
            // 屏蔽小休 和 不合格银行
            that.bankList = _.filter(that.bankList, item => {
                return _.indexOf(["9901", "9902"], item.EXT_ORG) == -1;
            })
            _.each(that.bankList, item => {
                item.DICT_ITEM = item.EXT_ORG
            });
        },
        // getIdTypeArr(){
        //    let that = this;
        //    return dict.getDictData('ID_TYPE').then(res => {
        //        console.log(res)
        //        let userType = that.userType == "0" ? "0" : "1";
        //        that.ID_TYPE_ARR = _.filter(res["ID_TYPE"], item => {
        //            return userType == item.DICT_ITEM.charAt(0);
        //        })
        //    })
        // },
        changeNextDisable(val) {
            this.$emit('change-next-disabled', val)            
        },
        messageBoxHandler(msg, callBack, cancel) {
            let that = this;
            that.messageBox({
                messageText: msg,
                cancelButtonText: '取消',
                confirmButtonText:'确定',
                confirmedAction: function(){
                    callBack && callBack()
                },
                canceledAction: function() {
                    cancel && cancel()
                }
            })
        },
        validate: (_this) => {
            let that = _this.$refs.V0052_openBizBankInfoNode;
            _this.loading = false;
            that.canPlayVoice = false;
            return Promise.all([
                that.bankAcctOnBlur(true)
            ]).then(res => {
                return that.fieldValidate(_this, that);
            })
        },
        fieldValidate(_this, that) {
            return that.$refs.newBankInfo.validate().then(res => {
                if (that.newBankInfo.NEW_BANK_PWD != that.newBankInfo.CONFIRM_NEW_BANK_PWD) {
                    return false;
                }
                _this.loading = true;
            }).catch(error => {
                return false;
            })
        },
        beforeSave: (_this, params) => {
            let that = _this.$refs.V0052_openBizBankInfoNode;

            let openTemplateData = that.oppBusiData.OPEN_TEMPLATE_DATA;

            let dictBank = that.oppBusiData.dictBank;
            let dictAll = that.oppBusiData.dictAll;
            let clsObj = _.find(dictBank.CUACCT_CLS, item => {
                return item.DICT_ITEM == openTemplateData.CUACCT_CLS;
            }) || {};
            let grpObj = _.find(dictBank.CUACCT_GRP, item => {
                return item.DICT_ITEM == openTemplateData.CUACCT_GRP
            }) || {};
            let lvlObj = _.find(dictBank.CUACCT_LVL, item => {
                return item.DICT_ITEM == openTemplateData.CUACCT_LVL
            }) || {};
            let attrObj = _.find(dictAll.CUACCT_ATTR, item => {
                return item.DICT_ITEM == openTemplateData.CUACCT_ATTR
            }) || {};
            
            let newBankPwd = des.decrypt(that.newBankInfo.NEW_BANK_PWD, that.historyData.CUST_CODE);
            console.log(newBankPwd);
            let result = {
                CUACCT_CODE: that.historyData.CUST_CODE,
                // start 取开户模板数据
                CUACCT_CLS: openTemplateData.CUACCT_CLS,
                CUACCT_CLS_TEXT: clsObj.DICT_ITEM_NAME || "",
                CUACCT_GRP: openTemplateData.CUACCT_GRP,
                CUACCT_GRP_TEXT: grpObj.DICT_ITEM_NAME || "",
                CUACCT_LVL: openTemplateData.CUACCT_LVL,
                CUACCT_LVL_TEXT: lvlObj.DICT_ITEM_NAME || "",
                CUACCT_ATTR: openTemplateData.CUACCT_ATTR,
                CUACCT_ATTR_TEXT: attrObj.DICT_ITEM_NAME || "",
                // end
                NINGBO_BANK_FLAG: "0",
                EXT_ORG_FLAG: "0",
                THREE_BANK_FLAG: "1",
                CNY_BANK_OPEN_FLAG: "1",
                CNY_BANK_ONE_FLAG: !_.isEmpty(that.newBankInfo.NEW_BANK_ACCT) ? "1" : "0",
                CNY_BANK_INFO: {
                    EXT_ORG: that.newBankInfo.NEW_EXT_ORG_CODE,
                    EXT_ORG_TEXT: that.newBankInfo.NEW_EXT_ORG,
                    BANK_ACCT: that.newBankInfo.NEW_BANK_ACCT,
                    BANK_AUTH_DATA: des.decrypt(that.newBankInfo.NEW_BANK_PWD, that.historyData.ID_CODE),
                    CUBSB_TRD_ID: that.newBankInfo.NEW_BANK_ACCT ? "16" : "17",
                    CUBSB_TYPE: "1",
                    BANK_CUST_NAME: that.newBankInfo.NEW_EXT_ORG_CODE && that.historyData.CUST_FNAME || "",
                    CUST_NAME: that.historyData.CUST_FNAME || that.historyData.CUST_NAME || "",
                    BANK_ID_TYPE: that.newBankInfo.NEW_EXT_ORG_CODE && that.historyData.ID_TYPE || "",
                    ID_TYPE: that.historyData.ID_TYPE || "",
                    BANK_ID_CODE: that.newBankInfo.NEW_EXT_ORG_CODE && that.historyData.ID_CODE || "",
                    ID_CODE: that.historyData.ID_CODE || "",
                    CURRENCY: "0",
                    BSB_ID_EXP_DATE: that.newBankInfo.NEW_EXT_ORG_CODE && that.historyData.ID_EXP_DATE || ""
                },
                HK_BANK_INFO: {
                        EXT_ORG: "",
                        EXT_ORG_TEXT: "",
                        BANK_ACCT: "",
                        BANK_AUTH_DATA: "",
                        CUBSB_TRD_ID: "",
                        CUBSB_TYPE: "",  //中投个性化 外币银行，走存管通道  标准版走转账通道
                        CURRENCY: "",
                        BANK_CUST_NAME: "",
                        BANK_ID_CODE: "",
                        BANK_ID_TYPE: "",
                        BSB_ID_EXP_DATE: ""
                },
                US_BANK_INFO: {
                    EXT_ORG: "",
                    EXT_ORG_TEXT: "",
                    BANK_ACCT: "",
                    BANK_AUTH_DATA: "",
                    CUBSB_TRD_ID: "",
                    CUBSB_TYPE: "",   //中投个性化 外币银行，走存管通道  标准版走转账通道
                    CURRENCY: "",
                    BANK_CUST_NAME: "",
                    BANK_ID_CODE: "",
                    BANK_ID_TYPE: "",
                    BSB_ID_EXP_DATE: ""
                },
                BANK_INFO_DIFF_THREE_INFO_FLAG: "",
                CNY_BANK_ACCT_FLAG: that.newBankInfo.NEW_BANK_ACCT ? "1" : "0",
                NEW_BANK_PWD: that.newBankInfo.NEW_BANK_PWD == '' ? '' : des.encrypt(that.newBankInfo.NEW_BANK_PWD, that.historyData.CUST_CODE),
                BANK_ACCT: that.newBankInfo.NEW_BANK_ACCT,
                EXT_ORG: that.newBankInfo.NEW_EXT_ORG_CODE || "",
                NEW_EXT_ORG_TEXT: that.newBankInfo.NEW_EXT_ORG,
            }
            Object.assign(params.ACCT_INFO, result, {
                ENCRYPT_KEY: "ID_CODE", // 开户涉及密码时所使用的key
            })
            Object.assign(params, result);
        }
    }
}
</script>

<style lang="less">
.open-custody.V0052_openBizBankInfoNode {
    font-family: Alibaba PuHuiTi;
    margin-left: 46px;
    margin-right: 62px;

    .self-normalInput-required {
        .el-form-item__label:before {
            content: "*";
            color: #f56c6c;
            margin-right: 4px;
        }
    }
    .title {
        height: 30px;
        line-height: 30px;
        font-size: 24px;
        font-weight: 700;
        display: flex;
        margin-top: 25px;
        margin-bottom: 25px;
    }
    .logo {
        width: 10px;
        height: 30px;
        background-color: #3b6aff;
        border-radius: 20px;
    }
    .titleContent {
        padding-left: 10px;
        font-family: Alibaba PuHuiTi;
        font-weight: 500;
        color: #3b6aff;
        font-size: 26px;
    }
    .newBank {
        .newBankInfo {
            background-color: #f7f7fa;
            border-radius: 8px;
            padding: 20px;
            .el-form {
                .el-form-item {
                    padding-top: 20px;
                    .el-form-item__label{
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
                    width: 1268px;
                    display: flex;
                    margin-left: 32px;
                    padding-top: 20px;
                    padding-left: 20px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid;
                    border-color: #eaeaea;
                    .el-form-item__content {
                        display: flex;
                        align-items: center;
                        width: 715px;
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
                        }
                    }
                }
            }
            .tipsContent {
                margin-left: 30px;
                font-family: Alibaba PuHuiTi;
                color: #eb6e20;
                font-size: 22px;
                line-height: 58px;
                img {
                    display: inline-block;
                    position: relative;
                    top: 8px;
                    padding-right: 12px;
                }
            }
        }
        
    }
}
</style>