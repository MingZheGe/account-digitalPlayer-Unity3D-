<template>
    <div ref="V0052_YZTInfoNode"></div>
</template>

<script>
import sysConfig from '../../../../config/sysConfig'
import des from '../../../../tools/libs/standard-des'
export default {
    props: ["bizData", "historyData", "oppBusiData", "groupData"],
    data() {
        return {
            topAcct: '',
            curTopAcct: '',
            syncTopacctList: [],
            sameCustData: [],
        }
    },
    computed: {
        busiCode() {
            return this.$store.state.busicode;
        }
    },
    mounted() {
        
    },
    methods: {
        changeNextDisable() {
            this.$emit('change-next-disabled', true);         
        },
        initData() {
            let that = this;
            let custInfo = that.$storage.getJsonSession(that.$definecfg.CUSTOMER_INFO) || {};
            let custCode = custInfo.CUST_CODE || '';
            let busiCode = that.busiCode || '';
            return Promise.all([
                that.getSameCustInfo(custInfo)
            ]).then(() => {
                return Promise.all([
                    that.setTopAcctInfo(custCode, busiCode)
                ]).then(() => {
                    // 判断当前客户是否开通的一账通
                    let curTopAcct = that.curTopAcct;
                    // 当前三要素下已开通的一账通
                    let topAcct = that.topAcct;
                    // 是否展示登录信息
                    let busiCommParamObj = that.$storage.getJsonSession(that.$definecfg.BUSI_COMM_PARAM_OBJS);
                    // 根据公参控制: 是否不展示 登陆类型 登陆信息 密码 等字段
                    let IS_SHOW_LOGIN_INFO = busiCommParamObj.IS_SHOW_LOGIN_INFO == '1';
                    let syncTopacctList = that.syncTopacctList || [];
                    // 若客户已开通一账通则跳过此模块
                    if(curTopAcct){
                        // flow.showPromptTip("当前客户已开通或绑定一账通账号，无需再次开通或绑定。");
                        //that.$emit('on-next-click');
                        return;
                    }

                    let sameCustData = _.filter(that.sameCustData, (v) => {
                        v.APPLY_STATUS = topAcct ? "绑定":"开通";
                        return (v.TOPACCT_NO == "" || v.TOPACCT_NO == "0") && v.CUST_STATUS == "0";
                    });
                    that.sameCustData = sameCustData;

                    //that.$emit('on-next-click');
                    return;
                })
            })
        },
        getTopAcctInfo(custCode, flag) {
            return this.$syscfg.K_Request("W0000119", { 
                bex_codes:"YGT_A1100807",
                TOPACCT_NO: "",	
                CUST_CODE: custCode,
                QUERY_FLAG: flag //0-查客户是否开了一账通，2-查询相同三要素是否开了一账通
            })
            .then((res) => {
                return res.Data && res.Data[0] && res.Data[0].TOPACCT_NO;
            })
        },
        //查询一账通信息
        setTopAcctInfo(custCode, busiCode) {
            let that = this; 
            if(busiCode == 'V0052') {
                let obj = _.find(that.sameCustData, function(v){
                    return v.TOPACCT_NO != "" && v.TOPACCT_NO != "0"
                }) || {};
                that.curTopAcct = '';
                console.log("sameCustData" + JSON.stringify(that.sameCustData))
                console.log("topAcct:" + obj.TOPACCT_NO);
                that.topAcct = obj && obj.TOPACCT_NO || '';
                return Promise.resolve(that);
            }
            return getTopAcctInfo(that, custCode, "0").then(curTopAcct => {
                that.curTopAcct = curTopAcct;
                if(!curTopAcct){
                    return getTopAcctInfo(that, custCode, "2").then((topAcct) => {
                        that.topAcct = topAcct;
                        return Promise.resolve(that);
                    });
                }
            })
        },
        //查询一人多户信息
        getSameCustInfo(custInfo) {
            let that = this;
            let custCode = custInfo.CUST_CODE || '';
            return that.$syscfg.K_Request("W0000119",{ 
                bex_codes:"YGT_A1100821",
                USER_NAME: custInfo.CUST_FNAME,
                ID_TYPE: custInfo.ID_TYPE,
                ID_CODE: custInfo.ID_CODE
            })
            .then((data) => {
                console.log("sameCustData")
                if(!sysConfig.$syscfg.isQSMZ('WUKUANG')){
                    let sameCustData = _.filter(data.Data, function(v){
                        return v.USER_CODE != custCode && v.CUST_STATUS != "9" && v.USER_TYPE == custInfo.USER_TYPE;;
                    }) || [];
                    that.sameCustData = sameCustData;
                    let obj = _.find(sameCustData, function (v) {
                        return v.TOPACCT_NO != "" && v.TOPACCT_NO != "0";
                    });
                    let topacctNo = obj && obj.TOPACCT_NO || "";
                    if(!_.isEmpty(topacctNo)){
                        return that.$syscfg.K_Request("W0000119",{ 
                            bex_codes:"YGT_A0001000",
                            QUERY_MODE: "QUERY",
                            F_FUNCTION: "991500010",
                            TOPACCT_CODE: topacctNo,
                            SUMMARY_FLAG: ""
                        }) 
                        .then(data => {
                            that.syncTopacctList = _.filter(data && data.Data || [],function (obj) {
                                return obj.CUST_STATUS === "0";
                            })
                        })
                    } else {
                        that.syncTopacctList = [];
                    }
                } else {
                    that.sameCustData =  _.filter(data[0], function(v){
                        return v.USER_CODE != custCode && v.CUST_STATUS == "0";
                    }) || [];
                }
            });
        },
        pageActivated(_this) {
            let that = _this.$refs.V0052_YZTInfoNode;
            if (!that) return;
            console.log("YZTMOUNTED");
            _this.loading = false;
            that.changeNextDisable();
            that.$emit('on-next-click');
        },
        beforeSave(_this, params) {
            let that = _this.$refs.V0052_YZTInfoNode;
            _this.loading = true;
            console.log("YZTBEFORESAVE");
            return Promise.all([that.initData()]).then(() => {
                console.log("YZTBEFORESAVE---");
                let custInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO) || {};
                let busiData = JSON.parse(_this.$storage.getSession(_this.$definecfg.BUSI_INFO)) || {};
                if(that.curTopAcct){
                    return {};
                }
                let topAcct = that.topAcct;
    
                let BIND_SET_INFO = _this.oppBusiData.BIND_SET_INFO || {};
                // 当前的账户信息
                let formData = Object.assign(BIND_SET_INFO, {
                    AUTH_DATA: !_.isEmpty(BIND_SET_INFO) && des.decrypt(BIND_SET_INFO.AUTH_DATA, _this.oppBusiData.CUST_CODE || custInfo.CUST_CODE || busiData.CUST_CODE) || '',
                    OPERATION_TYPE: topAcct ? "1" : "0",
                    TOPACCT_NO: topAcct,
                    CUST_CODE: _this.oppBusiData.CUST_CODE || custInfo.CUST_CODE || busiData.CUST_CODE
                });
                // 勾选全部账户
                let selection = that.sameCustData;
                
                let bindSetInfo = Object.assign(formData, {
                    OPERATION_TYPE_TEXT: topAcct ? "绑定" : "开通",
                    // LOGIN_TYPE_TEXT: _this.$LOGIN_TYPE.combobox("getText"),
                    LOGIN_CODE: "",
                    LOGIN_TYPE: "",
                    LOGIN_TYPE_TEXT: "",
                    USER_CODE: formData.CUST_CODE,
                    AUTH_DATA: des.encrypt(formData.AUTH_DATA, _this.oppBusiData.CUST_CODE || custInfo.CUST_CODE || busiData.CUST_CODE),
                    BIND_USER_CODES: _.pluck(selection, "USER_CODE").join(",")
                });
                var bindtopacctcodes = _.pluck(that.syncTopacctList,"CUST_CODE") || [];
    
                Object.assign(params, {
                    BIND_SET_INFO: bindSetInfo,
                    //一账通号 用于填影像
                    TOPACCTCODE: that.topAcct || "", 
                    //一账通号下正常客户号 用于填影像
                    BINDTOPACCTCODES: custInfo.USER_TYPE === "2"? "" : _.union(bindtopacctcodes, _.pluck(selection, "USER_CODE")).join(",") || "" 
                })
            })
 
        }
    }
}
</script>