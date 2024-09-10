<template>
    <div class="V0052-wrap">
        <flowTip ref="flowTip"></flowTip>
        <div class="allTrdacctAcct" v-show="showTrdacctAcct">
           <el-container>
                <el-header>您已开通的账户</el-header>
                <el-main>
                    <div class="V0052-table-wrap">
                        <el-table
                            max-height="620px"
                            :data="sourceCsdcTrdacctArr"
                            style="width: 100%">
                            <el-table-column
                                prop="YMT_CODE"
                                label="一码通账户"
                                width="250">
                            </el-table-column>
                            <el-table-column
                                prop="ACCT_TYPE_TEXT"
                                label="证券账户类型"
                                width="290">
                            </el-table-column>
                            <el-table-column
                                prop="TRDACCT"
                                label="证券账户"
                                width="290">
                            </el-table-column>
                            <el-table-column
                                prop="TRDACCT_STATUS_TEXT"
                                label="账户状态"
                                width="220">
                            </el-table-column>
                            <el-table-column
                                prop="ZHIDING"
                                label="指定/委托交易券商">
                            </el-table-column>
                        </el-table>
                    </div>
                    <!-- <div class="footer">
                        <el-button @click="goBack">返回</el-button>
                    </div> -->
                </el-main>
            </el-container>
        </div>
        <div class="market-select-wrap" v-show="!showTrdacctAcct">
            <flowTip ref="flowTip"></flowTip>
            <div class="title">
                <div class="text-wrap">
                    <div class="logo"></div>
                    <div class="titleContent">
                        请选择要新增的市场
                    </div>
                </div>
                <div class="top-left" v-show="showCSDCAcctBtn">
                    <el-button @click="showAllTrdacct">
                        <img src="../../../../icons/common/icon-biz-seemore.svg" class="button-icon">
                        查看已有账户
                    </el-button>
                    <el-button @click="reloadData" v-show="showCsdcBtn">中登查询</el-button>
                </div>
            </div>
            <div class="market-list">
                <div class="market-item" v-for="(marketItem) in marketInfoArr" :key="marketItem.MARKET_CODE" v-show="!marketItem.disableFlag">
                    <el-checkbox @change="selectMarketHandle(marketItem)" :disabled="acctTypeFlag[marketItem.MARKET_CODE].isBanFlag" v-model="marketValue[marketItem.MARKET_CODE]">
                            <span>{{marketItem.MARKET_NAME}}</span>
                    </el-checkbox>
                    <el-radio-group class="open-type" :disabled="!marketValue[marketItem.MARKET_CODE]" v-model="openType[marketItem.MARKET_CODE]" @change="selectOpenTypeHandle($event,marketItem)">
                        <el-radio :label="'1'" class="new" :disabled="acctTypeFlag[marketItem.MARKET_CODE].addNewDisableFlag">新开证券账户</el-radio>
                        <el-radio :label="'0'" class="old" :disabled="acctTypeFlag[marketItem.MARKET_CODE].addOldDisableFlag">使用已有账户</el-radio>
                    </el-radio-group>
                    <el-select 
                        v-model="acctValue[marketItem.MARKET_CODE]" 
                        :disabled="!marketValue[marketItem.MARKET_CODE] || openType[marketItem.MARKET_CODE]!='0'"
                        placeholder="请选择证券账户"
                        @change="selectAcct($event,marketItem)">
                        <el-option
                            v-for="(acct, index) in acctInfo[marketItem.MARKET_CODE]"
                            :key="index"
                            :label="acct.TRDACCT_TEXT || acct.TRDACCT"
                            :value="acct.TRDACCT"
                            :disabled="acct.disableFlag"
                            class="trdacct-option">
                        </el-option>
                    </el-select>
                    <span class="edit-trdacct" v-show="openType[marketItem.MARKET_CODE] == '0' && isWriteTrdacctShow" @click="writeTrdacctHandle(marketItem)">
                        <img src="../../../../icons/common/icon-input-edit.svg">
                        手输证券账户
                    </span>
                </div>
            </div>
            <loading :loadingText="loadingText" :showLoading="loading" ownClass="movi"></loading>
        </div>
    </div>
</template>
<script>
import oppService from '../../../../service/opp-service'
import dict from '../../../../tools/dict'
import flowTip from '../../../../components/common/flowTip';
import custService from '../../../../service/cust-service';
import date from '../../../../tools/date';
import loading from '../../../../components/common/loading';
import csdcService from '../../../../service/csdc-service';
import validateRules from '../../../../components/preEntry/validateRules'
export default {
    props: ["bizData", "historyData", "oppBusiData"],
    data() {
        return {
            marketInfoArr:[],
            acctTypeFlag: [],
            showCsdcBtn:false,//是否显示中登查询按钮
            showCSDCAcctBtn: false, // 非中登查询时间不展示此节点
            marketValue: {},//保存勾选了那些市场
            openType: {},//1-新开还是0-加挂 
            acctInfo: {},//用于下拉展示的所有可加挂证券账户
            acctValue: {},//保存加挂时勾选了的账户
            loading: false,
            loadingText: '',
            dialogVisible: false,
            activeAcctType: '',
            csdcTrdacctArr: [],
            sourceCsdcTrdacctArr: [],
            showTrdacctAcct: false,
            isWriteTrdacctShow: true,
            userType:'0',
            isExeMounted: false,
            disableAll: false,
            specifiedHSAcctList: [], // 已指定别的券商的沪a账户列表
            showSpecifiedHSTip: false,
            writtenCsdcAcctList: [], // 手输账号所涉及的中登账户信息列表
        }
    },
    components: {
        flowTip,
        loading
    },
    watch: {
        showSpecifiedHSTip(newVal, oldVal) {
            if(!newVal || !this.specifiedHSAcctList.length) {
                this.$refs.flowTip.removeFlowTip('zd');
                return;
            }

            let acctList = [];
            _.each(this.specifiedHSAcctList, acct => {
                acctList.push(acct);
            })
            this.$refs.flowTip.pushFlowTip({
                title: `您的${acctList.join('、')}证券账户处于“已指定”状态，如需在我司交易，请先前往指定券商撤销指定交易。`,
                key: "zd",
                type: "warning",
            })
        },
    },
    mounted() {
        console.log("mountedmountedmounted")
        this.isExeMounted = true;
        this.initData();
    },
    activated() {
        if (this.isExeMounted) {
            this.isExeMounted = false;
            return;
        }
        console.log("activatedactivatedactivated")
        this.initData();
    },
    deactivated() {
        this.isExeMounted = false;
    },
    destroyed() {
        this.isExeMounted = false;
    },
    methods: {
        initData(){
            //1.重置数据
            this.marketInfoArr = [
                {MARKET_NAME: "深A", MARKET_CODE: 'sza', disableFlag: false},
                {MARKET_NAME: "沪A", MARKET_CODE: 'sha', disableFlag: false},
                {MARKET_NAME: "京A/股转A", MARKET_CODE: 'gza', disableFlag: false},
                {MARKET_NAME: "股转B", MARKET_CODE: 'gzb', disableFlag: false},
                {MARKET_NAME: "深基金", MARKET_CODE: 'szjj', disableFlag: false},
                {MARKET_NAME: "沪基金", MARKET_CODE: 'shjj', disableFlag: false},
            ];
            this.acctTypeFlag = { //控制 新开跟加挂的禁用 addNewDisableFlag禁用新开  addOldDisableFlag禁用加挂 isBanFlag禁止勾选市场 全部为true则所有勾选都禁止了
                sza: {addNewDisableFlag: false, addOldDisableFlag: false, isBanFlag: false, required: true},
                sha: {addNewDisableFlag: false, addOldDisableFlag: false, isBanFlag: false, required: true},
                szb: {addNewDisableFlag: false, addOldDisableFlag: false, isBanFlag: false, required: true},
                shb: {addNewDisableFlag: false, addOldDisableFlag: false, isBanFlag: false,  required: true},
                gza: {addNewDisableFlag: false, addOldDisableFlag: false, isBanFlag: false, hideAddNew: true, required: true},
                gzb: {addNewDisableFlag: false, addOldDisableFlag: false, isBanFlag: false, hideAddNew: true, required: true},
                szjj: {addNewDisableFlag: false, addOldDisableFlag: false, isBanFlag: false, required: true},
                shjj: {addNewDisableFlag: false, addOldDisableFlag: false, isBanFlag: false, required: true},
            };
            this.marketValue = {//保存勾选了那些市场
                sza: false,
                sha: false,
                szb: false,
                shb: false,
                gza: false,
                gzb: false,
                szjj: false,
                shjj: false,
                sgt: false,
                hgt: false
            };
            this.openType = {//1-新开还是0-加挂 
                sza: '',
                sha: '',
                szb: '',
                shb: '',
                gza: '',
                gzb: '',
                szjj: '',
                shjj: '',
                sgt: '',
                hgt: '',
            };
            this.acctInfo = {
                sza: [],
                sha: [],
                szb: [],
                shb: [],
                gza: [],
                gzb: [],
                szjj: [],
                shjj: [],
                sgt: [],
                hgt: []
            };
            this.acctValue = {//需要保存的加挂的账户
                sza: '',
                sha: '',
                szb: '',
                shb: '',
                gza: '',
                gzb: '',
                szjj:'',
                shjj: '',
                sgt: '',
                hgt: '',
            };
            let customerInfo = this.$storage.getJsonSession(this.$definecfg.CUSTOMER_INFO);

            if(!this.oppBusiData){
                this.oppBusiData = {}
            }
            //---------------开户前面模块未完成所以只能 写死数据customerInfo
            this.oppBusiData.customerInfo = customerInfo
            this.oppBusiData.custCodeObj = customerInfo;
            this.userType = customerInfo.USER_TYPE;
             //是否为QFII客户
            this.oppBusiData.IS_QF_CUST = false;
        
            this.oppBusiData.SPE_FLAG = "0";
            this.oppBusiData = Object.assign(this.oppBusiData, customerInfo)
            this.oppBusiData.USER_TYPE = customerInfo.USER_TYPE;
            this.oppBusiData.CUST_CODE = customerInfo.CUST_CODE;
            this.oppBusiData.CUST_FNAME = customerInfo.CUST_FNAME;
            this.oppBusiData.ID_TYPE = customerInfo.ID_TYPE;
            this.oppBusiData.ID_CODE = customerInfo.ID_CODE;
            this.oppBusiData.SZORG_TYPE = customerInfo.SZORG_TYPE;
            this.oppBusiData.QSZWMC = oppService.getSysCommonParamsFromCacheObjs('QSZWMC');
            this.oppBusiData.noAAcctFlag = false;
            this.oppBusiData.noBAcctFlag = false;
            this.oppBusiData.unRelationFlag = false;
            this.oppBusiData.only15YmtCodeFlag = false;
            this.oppBusiData.trdacctOpenLogicObj = {
                "01": "sza", // 深A
                "02": "sha", // 沪A
                "03": "szb", // 深B
                "04": "shb", // 沪B
                "05": "gza", // 股转A
                "06": "gzb", // 股转B
                "07": "szjj", // 深基金
                "08": "shjj", // 沪基金
            };
            this.oppBusiData.stkbdTrdacctOpenType = {
                "sza": "00",
                "sha": "10",
                "szb": "01",
                "shb": "11",
                "gza": "20",
                "gzb": "21",
                "szjj": "00",
                "shjj": "10",
            };
            this.oppBusiData.riskLvlNoPass = "1,4".indexOf(this.historyData.RATING_LVL) > -1;
            this.oppBusiData.OPEN_TRD_MODEL_DATA = {};
            let baseInfoObj = _.pick(customerInfo, "USER_TYPE", "SUBJECT_IDENTITY", "OCCU_TYPE", "LEGAL_REP_TYPE", "INOUTSIDE_IDENTITY", "CITIZENSHIP", "ID_TYPE", "SZORG_TYPE");
            this.loading = true;
            this.loadingText = "正在查询数据查询，请稍候……"
            return Promise.all([
                dict.getDictData(['STKBD','TRDACCT_STATUS','ACCT_TYPE']),
                this.$blMethod.getBusiAcctOpenLogic(this, baseInfoObj),
                this.$blMethod.isServiceTime(this, {//中登服务时间查询
                    RES_IDS: "1",
                    RES_TYPE: "1"
                }),
                this.getpbu(customerInfo.INT_ORG),
            ]).then(res => {
                this.loading = false;
                console.log(res);
                this.oppBusiData.dictSTKBD = _.get(res[0], "STKBD");
                this.oppBusiData.dictAcctStat = _.get(res[0], "TRDACCT_STATUS");
                this.oppBusiData.dictTrdacctStatus = _.get(res[0], "TRDACCT_STATUS");
                this.oppBusiData.dictAcctType = _.get(res[0], "ACCT_TYPE");
                this.oppBusiData.openLogicData = res[1];
                this.oppBusiData.jumpJudgeBusiTimes = res[2];
                if(this.oppBusiData.jumpJudgeBusiTimes) {
                    this.showCSDCAcctBtn = true;
                }
                this.show();
            }).catch(err => {
                that.loading = false;
            })
        },
        preValidate(_this){
            let that = _this.$refs.V0052_openBizStockAcctNode;
            if(that.showTrdacctAcct){
                that.showTrdacctAcct = false;
                _this.$router.getCurrentRoute().prevBtnText = "上一步";
                _this.$router.updateRoute(_this.$router.getCurrentRouteIndex(), "isShowNext", true);
                _this.$router.updateRoute(_this.$router.getCurrentRouteIndex(), "isShowPrev", true);
                return false;
            }
            return true;
        },
        show() {
            let that = this;
            that.disableAll = false;
             // 是否可以手动输入
            that.setEditable();
            // 设置特殊机构标识
            that.getSpeFlag();
            that.loading = true;
            that.loadingText = "中登查询中，请稍候……"
            return Promise.all([
                //获取证券账号数据（中登）
                (that.oppBusiData.customerInfo.USER_TYPE != "2" || that.$syscfg.isQSMZ("MINSHENG")) && that.oppBusiData.jumpJudgeBusiTimes ? csdcService.getCSDCAcctData(that.oppBusiData.customerInfo.CUST_FNAME, that.oppBusiData.customerInfo.ID_TYPE, that.oppBusiData.customerInfo.ID_CODE) : [], 
                (!that.oppBusiData.IS_QF_CUST && that.oppBusiData.jumpJudgeBusiTimes) ? csdcService.getCSDCYmtData(that.oppBusiData.customerInfo.CUST_FNAME,  that.oppBusiData.customerInfo.ID_TYPE,  that.oppBusiData.customerInfo.ID_CODE) : [],
            ]).then(res => {
                console.log(res);
                // 使用已有账户下拉框和显示中登账户模块，均要屏蔽中登状态“注销”的证券账户；
                let csdcNormalAcctList = _.filter(res[0], acct => acct.ACCT_STATUS != '9');
                that.oppBusiData.OPEN_TRD_MODEL_DATA.CSDC_TRDACCT_ARR = csdcNormalAcctList;
                that.oppBusiData.OPEN_TRD_MODEL_DATA.YMT_LIST = res[1] || [];
                
                //修复 【经纪业务开户】2020年9月8日已注销一码通账户，20201123办理开户业务，触发《证券账户业务申请表》且展示了部分资料变更项 原因：未过滤销户状态的一码通
                // 一码通信息
                that.oppBusiData.csdcYmtArr =_.filter(that.oppBusiData.OPEN_TRD_MODEL_DATA.YMT_LIST || [], function (v) {
                    return v.YMT_STATUS == "0";
                }) || []; 
                that.oppBusiData.ymtCode = _.isEmpty(that.oppBusiData.csdcYmtArr) ? '' : that.oppBusiData.csdcYmtArr[0].YMT_CODE.trim();
                // 中登证券账号
                that.oppBusiData.csdcTrdacctArr = that.oppBusiData.OPEN_TRD_MODEL_DATA.CSDC_TRDACCT_ARR || [];

                that.dealOpenType();// 先处理开户逻辑 后注册事件，因 事件中使用了开户逻辑部分，会导致异步
                that.oppBusiData.CSDC_SEARCH_FALG = true;
                // 中登时间
                return Promise.all([
                    that.loadBizData(),
                    //获取系统内的交易账户
                    that.queryOldTrdacctTwo(that.oppBusiData.csdcTrdacctArr),  
                    that.oppBusiData.jumpJudgeBusiTimes 
                        &&  that.oppBusiData.ymtCode 
                        &&  that.oppBusiData.ymtCode != "0" 
                        && that.getCsdcCustInfo( that.oppBusiData.ymtCode || ""),
                    // 获取中登的客户资料
                    that.oppBusiData.jumpJudgeBusiTimes 
                        && that.queryUsedInfo(that.oppBusiData.OPEN_TRD_MODEL_DATA.CSDC_TRDACCT_ARR),
                    that.oppBusiData.jumpJudgeBusiTimes 
                        && that.queryFIRRela(),
                    dict.getDictData(['ACCT_TYPE', 'TRDACCT_STATUS']),
                ]).then(res => {
                    return that.getModelData().then(() => { 
                        that.oppBusiData.acctTypeDict = _.get(res[5], "ACCT_TYPE");
                        that.oppBusiData.trdacctStatusDict = _.get(res[5], "TRDACCT_STATUS");
                        that.getCsdcTrdacctResult();
                        that.disableUI();

                        // 判断市场是否可以勾选
                        _.each(that.marketInfoArr, item => {
                            that.$set(that.marketValue, item.MARKET_CODE, true);
                            that.selectMarketHandle(item);
                            that.selectOpenTypeHandle(1, item);
                            that.selectOpenTypeHandle(0, item);
                            that.$set(that.marketValue, item.MARKET_CODE, false);
                            that.selectMarketHandle(item);
                        })
                        that.$refs.flowTip.removeFlowTipByParam('group', 'initHide');

                        // 数据回填
                        !_.isEmpty(that.historyData.ACCT_INFO) && !_.isEmpty(that.historyData.ACCT_INFO.TRDACCT_INFO) && that.setData();

                        if (that.disableAll) {
                            _.each(that.marketInfoArr, item => {
                                that.acctTypeFlag[item.MARKET_CODE].isBanFlag = true;
                                // 防止续办进来存在选择的账户即使disable了还选择了
                                that.marketValue[item.MARKET_CODE] = false;
                            })
                        }
                        // 经纪业务管理办法 稳健型一下无法无法开通深A 沪A 深基 沪基
                        if ("1,4".indexOf(that.historyData.RATING_LVL) > -1) {
                            let marketArr = ["sza", "sha", "szjj", "shjj"];
                            _.each(that.marketInfoArr, item => {
                                if (marketArr.indexOf(item.MARKET_CODE) > -1) {
                                    that.acctTypeFlag[item.MARKET_CODE].isBanFlag = true;
                                    // 防止续办进来存在选择的账户即使disable了还选择了
                                    that.marketValue[item.MARKET_CODE] = false;
                                }
                            })

                        }
                    }) 
                }).catch(err=>{
                    that.oppBusiData.CSDC_SEARCH_FALG = false;
                    that.messageBox({
                        hasMask:true,
                        messageText:"中登查询失败，请重新查询。",
                        confirmButtonText:'中登查询',
                        cancelButtonText: '返回首页',
                        typeMessage:'error', 
                        showMsgBox:true,
                        confirmedAction: () => {
                            that.show();
                        },
                        canceledAction: () => {
                            that.$router.replace({ path: that.$bizhomecfg.getHomeConfig() });
                        }
                    }) 
                })
            })
        },
        getCsdcTrdacctResult() {
            let that = this;
            let csdcTrdacctArr = this.oppBusiData.OPEN_TRD_MODEL_DATA.CSDC_TRDACCT_ARR;
            // 证券账户类型翻译
            csdcTrdacctArr = _.map(csdcTrdacctArr, obj => {
                let tempDict = _.find(that.oppBusiData.acctTypeDict, dict => dict.DICT_ITEM == obj.ACCT_TYPE) || '';
                obj.ACCT_TYPE_TEXT = tempDict && tempDict.DICT_ITEM_NAME || obj.ACCT_TYPE;
                tempDict = _.find(that.oppBusiData.trdacctStatusDict, dict => dict.DICT_ITEM == obj.ACCT_STATUS) || '';
                obj.TRDACCT_STATUS_TEXT = tempDict && tempDict.DICT_ITEM_NAME;
                obj.ZHIDING = '';
                if(['11', '12', '13'].indexOf(obj.ACCT_TYPE) > -1) {
                    var res = _.filter(that.oppBusiData.RelaAllList, trdacct => {
                        return obj.TRDACCT == trdacct.TRDACCT;
                    })
                    if(!_.isEmpty(res)) {
                        obj.ZHIDING = res[0].FIR_ORG_NAME;
                    }
                }
                else if(['21', '22', '23'].indexOf(obj.ACCT_TYPE) > -1) {
                    var res = _.filter(that.oppBusiData.RelaAllList, trdacct => {
                        return obj.TRDACCT == trdacct.TRDACCT;
                    })
                    if(!_.isEmpty(res)) {
                        obj.ZHIDING = res[0].ACCTBIZ_ORGNAME;
                    }
                }
                return obj;
            })
            this.sourceCsdcTrdacctArr = csdcTrdacctArr;
        },
        queryFIRRela() {
            let that = this;
            let acctList = _.filter(that.oppBusiData.OPEN_TRD_MODEL_DATA.CSDC_TRDACCT_ARR, v => v.ACCT_STATUS != '9')
            let userInfo = that.$storage.getJsonSession(that.$definecfg.USER_INFO) || {};
            let OPEN_ORG_INFO = that.$storage.getJsonSession(that.$definecfg.OPEN_ORG_INFO) || {};
            let orgCode = OPEN_ORG_INFO.ORG_CODE || userInfo.ORG_CODE || "";
            let acctAsyncArr = [];
            if (_.isEmpty(acctList)) {
                that.oppBusiData.FIRRelaAll = [];
                return;
            }
            _.each(acctList, v => {
                acctAsyncArr.push(csdcService.csdcAcctQuery({
                    ACCTBIZ_CLS: "03",
                    ACCTBIZ_EXCODE: "11",
                    ACCT_TYPE: v.ACCT_TYPE,
                    CUST_CODE: v.CUST_CODE,
                    OPERATOR_TYPE: "0",
                    ORG_CODE: orgCode,
                    QUERY_CSDC: "1",
                    TRDACCT: v.TRDACCT,
                }))
            })
            return Promise.all(acctAsyncArr).then(resArr => {
                let tempResult = [];
                _.each(resArr, res => {
                    _.isArray(res) && !_.isEmpty(res) && res[0].RTN_ERR_CODE == "0000" && tempResult.push(res[0]);
                })
                that.oppBusiData.RelaAllList = tempResult;
            })
        },
        //查询系统内已有账户
        queryOldTrdacctTwo (acctList) {
            let that = this;
            let reqList = [];
            _.each(acctList, function (v) {
                if(v.TRDACCT){
                    reqList.push(that.$syscfg.K_Request("W0000119", {
                        bex_codes: "YGT_A2160201",
                        TRDACCT:v.TRDACCT
                    }))
                }
            });
            if (reqList.length == 0) {
                that.oppBusiData.sysAcctArr = [];
                return;
            }
            // 根据中登证券账户 反向查询一下是否系统内的
            that.$syscfg.K_Request_ALL(reqList).then(res=>{
                let allowGzArr = [], sysAcctArr = [];
                for (var i = 0; i < res.length; i++) {
                    var row = _.filter(res[i].Data || [], function (obj) {
                        return obj.TRDACCT_STATUS !== "9";
                    });
                    if (row.length > 0) {
                        sysAcctArr.push(row[0].TRDACCT);
                        //存在中登深A证券账户 加挂股转的情况  如果通过一个证券账户 返回两条或者以上数据 说明此深市账户 在系统内加挂过股转  如果返回一条  说明此中登账户 可用来加挂股转账户
                        //排除深基金沪基金
                        if(row.length < 2 && row[0].STKEX === "0" && '016'.indexOf(row[0].TRDACCT_EXCLS) !== -1){
                            allowGzArr.push(row[0].TRDACCT);
                        }
                    }
                }
                // 系统内的证券账户 列表
                that.oppBusiData.sysAcctArr = sysAcctArr;
                // 允许开通的股转的证券账户
                that.oppBusiData.allowGzArr = allowGzArr;
            })
        },
        //获取客户中登资料
        getCsdcCustInfo: function (ymtCode) {
            var that = this;
            return csdcService.csdcAcctQuery({
                YMT_CODE: ymtCode,
                ACCTBIZ_EXCODE: "06"
            }).then(function (data) {
                that.oppBusiData.csdcCustInfo = _.isArray(data) && !_.isEmpty(data) && data[0] || {};
            });
        },
         //开户逻辑处理
        dealOpenType() {
            let that = this,
                logicPromptTipArr = [];
            let customerInfo =  that.oppBusiData.custCodeObj;
            // 若未配置对应的证券账户开户逻辑
            if (!that.oppBusiData.openLogicData.length) {
                dict.transformDict({
                    ID_TYPE: customerInfo.ID_TYPE,
                    INOUTSIDE_IDENTITY: customerInfo.INOUTSIDE_IDENTITY,
                    SUBJECT_IDENTITY: customerInfo.SUBJECT_IDENTITY,
                    OCCU_TYPE: customerInfo.OCCU_TYPE,
                    LEGAL_REP_TYPE: customerInfo.LEGAL_REP_TYPE,
                    SZORG_TYPE: customerInfo.SZORG_TYPE,
                    CITIZENSHIP: customerInfo.CITIZENSHIP
                }, [
                    "ID_TYPE",
                    "INOUTSIDE_IDENTITY",
                    "SUBJECT_IDENTITY",
                    "SZORG_TYPE",
                    {
                        "OCCU_TYPE": "OCCU_EXTYPE_NEW",
                        "LEGAL_REP_TYPE": "LEGAL_REP_EXTYPE"
                    },
                    "CITIZENSHIP"
                ]).then(function (newObj) {
                    let msg = ""
                    if (that.userType == "0") {
                        msg = "未配置个人客户证件类型为 [" + newObj.ID_TYPE_TEXT + "]、国籍为[" + newObj.CITIZENSHIP_TEXT + "]、境内标识为 [" + newObj.INOUTSIDE_IDENTITY_TEXT + "]、主体身份为 [" + newObj.SUBJECT_IDENTITY_TEXT + "]、职业类型为 [" + newObj.OCCU_TYPE_TEXT + "] 相匹配的证券账户开户逻辑，请联系管理员增加配置 或 启用配置！";
                    } else {
                        msg = "未配置" + (that.userType == "1" ? "机构" : "产品") + "证件类型为 [" + newObj.ID_TYPE_TEXT + "]、国籍为[" + newObj.CITIZENSHIP_TEXT + "]、境内标识为 [" + newObj.INOUTSIDE_IDENTITY_TEXT + "]、主体身份为 [" + newObj.SUBJECT_IDENTITY_TEXT + "]、法人类型为 [" + newObj.LEGAL_REP_TYPE_TEXT + "]、机构类型为 [" + newObj.SZORG_TYPE_TEXT + "] 相匹配的证券账户开户逻辑，请联系管理员增加配置 或 启用配置！";
                    }
                    that.$refs.flowTip.pushFlowTip({
                        title: msg,
                        type: 'error',
                        key: 'error'
                    });
                    that.disableAll = true;
                })
                return;
            }
            that.oppBusiData.TRADCCT_OPEN_ACCT_TYPE = [];
            that.oppBusiData.TRADCCT_OPEN_TYPE = {};
             // 把开户逻辑配置的提示信息显示出来，可能存在多条
            _.each(that.oppBusiData.openLogicData, function (v) {
                // 取出空格后再判断，避免空格误判
                if (_.trim(v.PROMPT_TIP).length) {
                    logicPromptTipArr.push(_.trim(v.PROMPT_TIP));
                }
                if (customerInfo.USER_TYPE == "0" && // 个人客户
                    (v.ID_TYPE == "@" || _.indexOf(v.ID_TYPE.split(","), customerInfo.ID_TYPE) != -1) // 证件类型为全部 或 包含客户的证件在内
                    && (v.INOUTSIDE_IDENTITY == "@" || v.INOUTSIDE_IDENTITY == customerInfo.INOUTSIDE_IDENTITY) // 境内外标识为全部 或 包含客户的境内外标识
                    && _.indexOf(v.SUBJECT_IDENTITY.split(","), customerInfo.SUBJECT_IDENTITY) != -1  // 主体身份包含客户的主体身份
                    && _.indexOf(v.CITIZENSHIP.split(","), customerInfo.CITIZENSHIP) != -1  // 国籍包含客户的国籍
                    && _.indexOf(v.OCCU_TYPE.split(","), customerInfo.OCCU_TYPE) != -1) { // 职业类型包含客户的职业类型

                    that.oppBusiData.TRADCCT_OPEN_ACCT_TYPE = _.union(that.oppBusiData.TRADCCT_OPEN_ACCT_TYPE, v.ACCT_TYPE.split(","));
                    that.filterAcctOpenType(v.ACCT_TYPE, v.OPEN_TYPE);

                } else if (customerInfo.USER_TYPE  == "1" && // 机构客户
                    (v.ID_TYPE == "@" || _.indexOf(v.ID_TYPE.split(","), customerInfo.ID_TYPE) != -1) // 证件类型为全部 或 包含客户的证件在内
                    && (v.INOUTSIDE_IDENTITY == "@" || v.INOUTSIDE_IDENTITY == customerInfo.INOUTSIDE_IDENTITY) // 境内外标识为全部 或 包含客户的境内外标识
                    && _.indexOf(v.SUBJECT_IDENTITY.split(","), customerInfo.SUBJECT_IDENTITY) != -1  // 主体身份包含客户的主体身份
                    && _.indexOf(v.LEGAL_REP_TYPE.split(","), customerInfo.LEGAL_REP_TYPE) != -1 // 法人类型包含客户的法人类型
                    && _.indexOf(v.SZORG_TYPE.split(","), customerInfo.SZORG_TYPE) != -1) { // 机构类型包含客户的机构类型

                    that.oppBusiData.TRADCCT_OPEN_ACCT_TYPE = _.union(that.oppBusiData.TRADCCT_OPEN_ACCT_TYPE, v.ACCT_TYPE.split(","));
                    that.filterAcctOpenType(v.ACCT_TYPE, v.OPEN_TYPE);

                } else if (customerInfo.USER_TYPE == "2" && // 产品客户
                    (v.ID_TYPE == "@" || _.indexOf(v.ID_TYPE.split(","), customerInfo.ID_TYPE) != -1) // 证件类型为全部 或 包含客户的证件在内
                    && (v.INOUTSIDE_IDENTITY == "@" || v.INOUTSIDE_IDENTITY == customerInfo.INOUTSIDE_IDENTITY)) {   // 境内外标识为全部 或 包含客户的境内外标识

                    that.oppBusiData.TRADCCT_OPEN_ACCT_TYPE = _.union(that.oppBusiData.TRADCCT_OPEN_ACCT_TYPE, v.ACCT_TYPE.split(","));
                    that.filterAcctOpenType(v.ACCT_TYPE, v.OPEN_TYPE);
                }
            })
            // 过滤掉重复配置的提示，避免显示重复的提示内容
            let arr = Array.from(new Set(logicPromptTipArr));
            _.each(arr, tip => {
                    that.$refs.flowTip.pushFlowTip({
                    title: tip,
                    type: 'info'
                })
            })
        },
        getSpeFlag() {
            let that= this,
                szorgType = that.oppBusiData.customerInfo.SZORG_TYPE || '';
            if (that.oppBusiData.customerInfo.USER_TYPE == "1" && !_.isEmpty(szorgType) && that.$blMethod.isSpeOrg(szorgType) || that.userType == "2") {
                that.SPE_FLAG = "1"; // 特殊机构
            } else {
                that.SPE_FLAG = "0";
            }
        },
        getpbu(orgCode){
            //查询交易席位
            let that = this;
            let allStkPbu = [];
            return that.$syscfg.K_Request_ALL([
                that.$syscfg.K_Request("W0000119", {
                    bex_codes: "YGT_A1000003",
                    F_FUNCTION: "500105020",
                    TAB_CODE: "STK_PBU_ORG",
                    INT_ORG: orgCode,
                    F_CUST_ORG_CODE: orgCode
                }),
                that.$syscfg.K_Request("W0000119", {
                    bex_codes: "YGT_A1000003",
                    F_FUNCTION: "500105020",
                    TAB_CODE: "STK_PBU",
                    INT_ORG: orgCode,
                    F_CUST_ORG_CODE:orgCode
                }),
            ]).then(res => {
                _.each(res[0].Data, function (item) {
                    _.each(res[1].Data, function (item1) {
                        if (item.STKPBU == item1.STKPBU && "0" == item1.STKPBU_TYPE && item.STKBD == item1.STKBD && ("1" == item1.STKPBU_CLS || "2" == item1.STKPBU_CLS)) {
                            if (item.STKBD == "20") {
                                allStkPbu.push({
                                    STKPBU: item.STKPBU,
                                    STKPBUTEXT: item.STKPBU,
                                    STKBD: item.STKBD,
                                    MAJPBU_FLAG: item.MAJPBU_FLAG,
                                    STKPBU_CLS: item1.STKPBU_CLS
                                });//股转A不区分主辅交易单元
                            } else {
                                allStkPbu.push({
                                    STKPBU: item.STKPBU,
                                    STKPBUTEXT: item.STKPBU + (item1.STKPBU_CLS == "2" ? "【QFII】" : ("1" == item.MAJPBU_FLAG ? "【主】" : "【辅】")),
                                    STKBD: item.STKBD,
                                    MAJPBU_FLAG: item.MAJPBU_FLAG,
                                    STKPBU_CLS: item1.STKPBU_CLS
                                });
                            }
                        }
                    });
                });
                that.oppBusiData.stkpbuList = allStkPbu;
            })
        },
        queryUsedInfo(acctList) {
            let queryAcctList = _.filter(acctList, v => v.ACCT_STATUS != '9');
            if (_.isEmpty(acctList)) {
                return;
            }
            let proArray = [];
            _.each(queryAcctList, acct => {
                proArray.push(csdcService.csdcAcctQuery({
                    ACCTBIZ_CLS: "03",
                    ACCTBIZ_EXCODE: "11",
                    ACCT_TYPE: acct.ACCT_TYPE,
                    TRDACCT: acct.TRDACCT,
                    QUERY_CSDC: "1"
                }).then(res => {
                    let usedInfo = [];
                    let ACCT_TYPES = ["11", "12", "13", "15"];
                    _.each(res, item => {
                        item && item.ACCTBIZ_STATUS == "2" && usedInfo.push(item)
                    });
                    let etsOrgName = _.map(usedInfo, v => {
                        return ACCT_TYPES.indexOf(v.ACCT_TYPE) > -1 ? v.FIR_ORG_NAME : v.ETS_ORG_NAME;
                    }).join("/");
                    _.find(acctList,obj => {
                        return obj.TRDACCT == acct.TRDACCT && obj.ACCT_TYPE == acct.ACCT_TYPE;
                    }).ETS_ORG_NAME = etsOrgName || "无";
                }))
            })
            return Promise.all(proArray).then(resArr => {
                this.oppBusiData.OPEN_TRD_MODEL_DATA.CSDC_TRDACCT_ARR = acctList;
            })
        },
        selectMarketHandle(marketItem) {
            if (this.marketValue[marketItem.MARKET_CODE]) {
                if(marketItem.MARKET_CODE == 'sha') {
                    this.showSpecifiedHSTip = true;
                }
                // 点击勾选其他市场移除所有提示
                !this.disableAll && this.$refs.flowTip && this.$refs.flowTip.removeAllFlowTip();
                this.commandSelect(marketItem)
                //当勾选时，要判断新开和加挂是否均不可以点击，满足则取消勾选市场并置灰
                if(this.acctTypeFlag[marketItem.MARKET_CODE].addNewDisableFlag && this.acctTypeFlag[marketItem.MARKET_CODE].addOldDisableFlag) {
                    let sourceAcctTypeFlag = Object.assign(this.acctTypeFlag[marketItem.MARKET_CODE], {
                        isBanFlag: true
                    });
                    this.$set(this.marketValue, marketItem.MARKET_CODE, '');
                    this.$set(this.acctTypeFlag, marketItem.MARKET_CODE, sourceAcctTypeFlag);
                }
            } else {
                this.showSpecifiedHSTip = false;
                this.openType[marketItem.MARKET_CODE] = '';
                this.acctValue[marketItem.MARKET_CODE] = '';
                this.commandUnSelect(marketItem.MARKET_CODE);
                // 点击取消当前市场移除当前市场的提示
                this.$refs.flowTip.removeFlowTip(marketItem.MARKET_CODE);
            }
        },
        commandUnSelect(marketCode) {
            let that = this;
            switch(marketCode) {
                case 'sza': {
                    that.acctValue.gza == "2" && (that.acctValue.gza = "")
                    that.acctValue.gzb == "2" && (that.acctValue.gzb = "")
                    // 选择了 深A 需要重置一下 股转a b的选择状态
                    that.commandSelect(_.find(that.marketInfoArr,v => v.MARKET_CODE == 'gza'));
                    that.commandSelect(_.find(that.marketInfoArr,v => v.MARKET_CODE == 'gzb'));

                    // 判断股转市场是否有账户可以加挂，没有则取消勾选置灰按钮
                    let gzaHasAcctFlag = false, gzbHasAcctFlag = false;
                    _.each(that.acctInfo['gza'], acct => {
                        // 有一个可勾选账户就不禁用(新开账户除外)
                        if(!acct.disableFlag && acct.TRDACCT != '2'){
                            gzaHasAcctFlag = true
                        }
                    })
                    _.each(that.acctInfo['gzb'], acct => {
                        // 有一个可勾选账户就不禁用
                        if(!acct.disableFlag && acct.TRDACCT != '2'){
                            gzbHasAcctFlag = true
                        }
                    })
                    if(!gzaHasAcctFlag) {
                        that.marketValue['gza'] = '';
                        that.acctTypeFlag.gza.isBanFlag = true;
                    }
                    if(!gzbHasAcctFlag) {
                        that.marketValue['gzb'] = '';
                        that.acctTypeFlag.gzb.isBanFlag = true;
                    }
                }
            }
        },
        writeTrdacctHandle(marketItem) {
            let that = this,
                marketCode = marketItem.MARKET_CODE;
            
            this.editBox({
                title: '请输入要加挂的证券账户',
                cancelButtonText : '取消',
                options: {
                    label: '证券账户',
                    name: 'trdacct',
                    pattern:/^[A-Za-z0-9]{10}$/,
                    errorMessage: '请输入10位证券账户',
                },
                confirmedAction: function(trdacct) {
                    // 校验验证规则
                    // 如果输入的在当前下拉列表里且非置灰的,可以直接填充
                    let newAcctObj = _.find(that.acctInfo[marketCode], obj => obj.TRDACCT == trdacct) || {};
                    if (!_.isEmpty(newAcctObj)) {
                        if(newAcctObj.disableFlag) return false;
                        that.acctValue[marketCode] = trdacct;
                        return true;
                    } else {
                        return that.checkTrdacctByInner(trdacct, marketCode).then(flag => {
                            if(flag.checkResult === false){
                                return flag;
                            } else if (flag && that.oppBusiData.jumpJudgeBusiTimes) {
                                return that.checkTrdacctByCSDC(trdacct, marketCode).then(flag => {
                                    if(flag === true){
                                        that.acctInfo[marketCode].push({TRDACCT: trdacct, TRDACCT_TEXT: trdacct})
                                        that.acctValue[marketCode] = trdacct;
                                        return {
                                            checkResult: true,
                                        }
                                    }else{
                                        return flag
                                    }
                                })
                            } else{
                                that.acctInfo[marketCode].push({TRDACCT: trdacct, TRDACCT_TEXT: trdacct})
                                that.acctValue[marketCode] = trdacct;
                                return  {
                                    checkResult: true,
                                }
                            }
                        })
                    }
                }
            })
        },
        showAllTrdacct() {
            this.csdcTrdacctArr = _.cloneDeep(this.oppBusiData.csdcTrdacctArr);
            this.$router.updateRoute(this.$router.getCurrentRouteIndex(), "isShowNext", false);
            this.$router.updateRoute(this.$router.getCurrentRouteIndex(), "isShowPrev", true);
            this.$router.updateRoute(this.$router.getCurrentRouteIndex(), "prevBtnText", "返回");
            this.showTrdacctAcct = true;
        },
        goBack(_this) {
            let that = _this.$refs.V0052_openBizStockAcctNode;
            _this.$router.updateRoute(_this.$router.getCurrentRouteIndex(), "isShowNext", true);
            _this.$router.updateRoute(_this.$router.getCurrentRouteIndex(), "prevBtnText", "上一步");
            that.showTrdacctAcct = false;
        },
        reloadData(){
            this.initData();
        },
        // 中登一码通信息查询
        checkCsdcInfo() {
            let that = this,
                ymtArr = _.filter(that.oppBusiData.csdcYmtArr, v => v.YMT_STATUS == "0"),
                 //客户存在未确认关联关系的深A/沪A/深B/沪B证券账户/非配号产生的封闭式基金
                unRelaAcctArr = csdcService.getUnRelationAcctData(that.oppBusiData.csdcTrdacctArr);
            if (that.userType == "2") {
                that.oppBusiData.ymtCode = ymtArr.length && ymtArr[0].YMT_CODE || "";
                //that.YMT_CODE = ymtArr.length && ymtArr[0].YMT_CODE || "";
                return;
            }
            if (unRelaAcctArr.length) {
                that.oppBusiData.unRelationFlag = true;
            }
            // 个人 或 机构客户，存在正常状态的一码通账户
            if (ymtArr.length) {
                 // 将正常状态的一码通按照长度进行分组
                let ymtGroup = _.partition(ymtArr, function (v) {
                    return v.ID_TYPE == "00" && v.ID_CODE.length == 15;
                });
                if (ymtGroup[0].length && !ymtGroup[1].length) {
                    that.oppBusiData.only15YmtCodeFlag = true;
                    that.$refs.flowTip.pushFlowTip({
                        title: "您只有15位身份证开通的一码通，不允许申请开通或加挂证券账户!",
                        type: 'error'
                    });
                    that.disableAll = true;
                } else {
                    // 取非15位一码通
                    // 选取所有关联关系都确认的一码通。如没有，返回false（具体看报错描述）。
                    _.each(ymtGroup[1], ymtInfo => {
                        let arr = _.filter(unRelaAcctArr, acctInfo => {
                            return acctInfo.YMT_CODE == ymtInfo.YMT_CODE;
                        })
                        if(!arr.length) {
                            that.oppBusiData.ymtCode = ymtInfo.YMT_CODE;
                            return false;
                        }
                    })
                    // that.oppBusiData.ymtCode = ymtGroup[1][0].YMT_CODE;
                    //that.YMT_CODE = ymtGroup[1][0].YMT_CODE;
                    //过滤不正常的状态
                    let ymtStuts = _.filter(ymtGroup[1], function (v) {
                        return v.YMT_STATUS == '0'
                    });
                    // 多一码通处理
                    if (ymtStuts.length > 1) {
                        that.$refs.flowTip.pushFlowTip({
                            title: "您在中登系统内存在多个一码通账户，可在本业务办理成功后，进行一码通账户规范！",
                            type: 'warning'
                        });
                    }
                    that.ymtIDCode = false;
                }
            }
        },
        //待修改
        setData() {
            let that = this,
                TRDACCT_INFO = _.get(that,"historyData.ACCT_INFO.TRDACCT_INFO", []),
                isForbidOpenAcctStock = that.isForbidOpenAcctStock();
            let acctTypeObj = {
                "00": "sza",
                "10": "sha",
                "01": "szb",
                "11": "shb",
                "20": "gza",
                "21": "gzb",
                "03": "sgt",
                "13": "hgt"
            };
            let jjAcctTypeObj = {
                "00": "szjj",
                "10": "shjj"
            };
            
            //存在首次有流程数据  又返回改了主体身份 或者职业 等影响开户信息逻辑变动
            var oldTradcctOpenType = that.historyData.OLD_TRADCCT_OPEN_TYPE || {}, //老数据的开户逻辑对应的证券账户开通情况
                newTradcctOpenType = that.oppBusiData.TRADCCT_OPEN_TYPE || {}; //新流程数据的开户逻辑对应的证券账户开通情况
            //如果有变动 则次此不在回填老数据  重新勾选
            if(!_.isEqual(oldTradcctOpenType,newTradcctOpenType)){
                TRDACCT_INFO = [];
            }
            
            _.each(TRDACCT_INFO, acct => {
                  // 有未关联股东禁止新开  并且不回填当前新开数据
                if (that.oppBusiData.unRelationFlag && acct.NEW_OPEN_FLAG == "1") {
                    // 跳出本次循环
                    return true;
                }
                 //ZQSZKDOP-1422：【经纪业务开户】 风险测评结果是C3，选择了加挂和新开证券账户，又返回上一步重新测评为最低类别，再下一步的时候，账户原选择的加挂和新开记录仍在，且加挂信息还能更改（应该清除原有选择）
                /**
                 * 业务公共参数ALLOWED_LASTRISK_FLAG_OPEN_ACCT为0,
                 * 当客户为：1、成年客户，最低风险标识为是；
                 * 2、未成年客户，未成年标志为2-有劳动收入，最低风险标识为是时，
                 * 禁止新开股东账户  并且不回填当前新开数据
                 */
                if (that.busiCode == "V0052" && isForbidOpenAcctStock && acct.NEW_OPEN_FLAG == "1") {
                    return true;
                }
                // 普通账户
                // 加挂
                if (acct.OPEN_TYPE == "0") {
                    if (that.oppBusiData.riskLvlNoPass && ["sza", "sha", "szjj", "shjj"].indexOf(acctTypeObj[acct.STKBD]) > -1) return;
                    //回填市场
                    that.marketValue[acctTypeObj[acct.STKBD]] = true;
                    let marketItem = _.find(that.marketInfoArr, item => {
                        return item.MARKET_CODE == acctTypeObj[acct.STKBD]
                    }) || {};
                    that.selectMarketHandle(marketItem);

                    //回填新开加挂
                    // 新开
                    if (acct.NEW_OPEN_FLAG == '1') {
                        let flag = that.acctTypeFlag[acctTypeObj[acct.STKBD]].addNewDisableFlag;
                        !flag && (that.openType[acctTypeObj[acct.STKBD]] = "1")
                        if (that.openType[acctTypeObj[acct.STKBD]] !== "") {
                            that.selectOpenTypeHandle(that.openType[acctTypeObj[acct.STKBD]], marketItem)
                        }
                    } else {
                        // 选择了新开 
                        that.openType[acctTypeObj[acct.STKBD]] = "0";
                        if (["20", "21", "03"].includes(acct.STKBD)) {
                            if (acct.STKBD == '20') {
                                // 深圳A新开
                                let acctSzaValue = _.find(that.historyData.addAcctList, v => v.STKBD == "00" && v.OPEN_TYPE == "0") || {};
                                if (acctSzaValue.NEW_OPEN_FLAG == "1" && !that.oppBusiData.riskLvlNoPass) {
                                    that.reloadAcctData("gza");
                                    that.acctValue.gza = "2";
                                }
                                acct.TRDACCT && (that.acctValue.gza = acct.TRDACCT)
                            } else if (acct.STKBD == "21") {
                                let acctSzbValue = _.find(that.historyData.addAcctList, v => v.STKBD == "01" || v.STKBD == "00" && v.OPEN_TYPE == "0" && v.NEW_OPEN_FLAG == "1") || {};
                                if(!_.isEmpty(acctSzbValue)  && !that.oppBusiData.riskLvlNoPass) {
                                    that.reloadAcctData("gzb");
                                    that.acctValue.gzb ='2';
                                }
                                acct.TRDACCT && (that.acctValue.gzb = acct.TRDACCT)
                            } else if (acct.STKBD == "03") {
                                let temp = _.find(that.historyData.addAcctList, v => v.STKBD == "00" && v.OPEN_TYPE == "0" && v.NEW_OPEN_FLAG == "0") || {}
                                if (!_.isEmpty(temp)) {
                                    that.reloadAcctData("sgt");
                                    that.acctValue.sgt='2';
                                }
                                acct.TRDACCT && (that.acctValue.sgt = acct.TRDACCT);
                            }
                        } else {
                            let acctValue = _.find(that.historyData.addAcctList, v => v.STKBD == acct.STKBD && v.OPEN_TYPE == "0") || {};
                            let flag = that.acctTypeFlag[acctTypeObj[acct.STKBD]].addOldDisableFlag;
                            // 不允许加挂
                            if (flag) {
                                that.openType[acctTypeObj[acct.STKBD]] = "";
                            }
                            !flag && (that.acctValue[acctTypeObj[acct.STKBD]] = acct.TRDACCT);
                        }
                    }
                } 
                // 新开
                else if (acct.OPEN_TYPE == "1") {
                    if (that.oppBusiData.riskLvlNoPass && ["sza", "sha", "szjj", "shjj"].indexOf(jjAcctTypeObj[acct.STKBD]) > -1) return;
                     //回填市场
                    that.marketValue[jjAcctTypeObj[acct.STKBD]] = true;
                    let marketItem = _.find(that.marketInfoArr, item => {
                        return item.MARKET_CODE == jjAcctTypeObj[acct.STKBD]
                    }) || {};
                    that.selectMarketHandle(marketItem);
                    if (acct.NEW_OPEN_FLAG == '1') {
                        let flag = that.acctTypeFlag[jjAcctTypeObj[acct.STKBD]].addNewDisableFlag;
                        !flag && (that.openType[jjAcctTypeObj[acct.STKBD]] = "1")
                        if (that.openType[jjAcctTypeObj[acct.STKBD]] !== "") {
                            that.selectOpenTypeHandle(that.openType[jjAcctTypeObj[acct.STKBD]], marketItem)
                        }
                    } else {
                        that.openType[jjAcctTypeObj[acct.STKBD]] = "0"
                        let flag = that.acctTypeFlag[jjAcctTypeObj[acct.STKBD]].addOldDisableFlag;
                        // 不允许加挂
                        if (flag) {
                            that.openType[jjAcctTypeObj[acct.STKBD]] = "";
                        }
                        !flag && (that.acctValue[jjAcctTypeObj[acct.STKBD]] = acct.TRDACCT);
                    }
                }
            })
        },
        loadBizData() {
            let that = this;
            //境内机构户不能新开加挂股转B
            if (that.oppBusiData.customerInfo.INOUTSIDE_IDENTITY == "0" && that.oppBusiData.USER_TYPE == "1") {
                let temp = _.find(that.marketInfoArr, v => v.MARKET_CODE == "gzb");
                temp.disableFlag = true;
            }
            let szAcct = [];
            _.each(_.filter(that.oppBusiData.csdcTrdacctArr, function (v) {
                return v.ACCT_TYPE == "11" || v.ACCT_TYPE == "12"
            }), function (v) {
                szAcct.push({TRDACCT: v.TRDACCT, ACCT_TYPE: v.ACCT_TYPE});
            });
            if (that.oppBusiData.jumpJudgeBusiTimes) {
                return this.queryZDacct({
                    CUST_FNAME: that.oppBusiData.customerInfo.CUST_FNAME,
                    ID_TYPE:  that.oppBusiData.customerInfo.ID_TYPE,
                    ID_CODE:  that.oppBusiData.customerInfo.ID_CODE
                }, szAcct).then(function () {
                    //个人或机构客户：判断一码通只有15位的提示。
                    that.checkCsdcInfo();
                });
            }
        },
        //查询中登上证券账号的指定状态
        queryZDacct (param, acctlist) {
            var that = this;
            let reqArr = [];
            _.each(acctlist, item =>{
                let reqObj = {
                    ACCTBIZ_CLS: "03",
                    ACCTBIZ_EXCODE: "11",
                    ACCT_TYPE: item.ACCT_TYPE,
                    CUST_FNAME: param.CUST_FNAME,
                    TRDACCT: item.TRDACCT
                }
                reqArr.push(csdcService.csdcAcctQuery(reqObj))
            });

            return Promise.all(reqArr).then(res => {
                that.oppBusiData.zdacct = _.filter([].concat.apply([], res), item => {
                    // 取能查到得记录信息
                    return item.RTN_ERR_CODE == "0000";
                });
            })
        },
        //识别客户身份主体控制交易板块
        disableUI() {
            let that = this;
             // 反向过滤出不允许开通的账户类型
            _.each(_.difference(_.keys(that.oppBusiData.trdacctOpenLogicObj), that.oppBusiData.TRADCCT_OPEN_ACCT_TYPE), v => {
                let marketkey = that.oppBusiData.trdacctOpenLogicObj[v];
                let market = _.find(that.marketInfoArr, v => v.MARKET_CODE == marketkey);
                // 置灰相应的市场
                market && (market.disableFlag = true);
            })
             // 禁止
            if (that.isForbidOpenAcctStock()) {
                // that.$refs.flowTip.pushFlowTip({
                //     title: "您为最低投资者类别标识，不允许开股东账户！",
                //     type: 'warning'
                // });
                that.disableAll = true;
                _.each(_.keys(that.oppBusiData.TRADCCT_OPEN_TYPE), v => {
                    that.acctTypeFlag[v].addNewDisableFlag = true;
                })
            }
            //银河个性  个人不允许 机构产品允许
            if (that.only15YmtCodeFlag && that.userType === "0") {//只有15位身份证的一码通  不允许新开 加挂股东
                _.each(_.keys( that.oppBusiData.TRADCCT_OPEN_TYPE), v => {
                    that.acctTypeFlag[v].addNewDisableFlag = true;
                    that.acctTypeFlag[v].addOldDisableFlag = true;
                })
            }
        },
        /** 控制加挂证券账户是否允许手动输入
            *  1、非中登服务时间，所有客户都可以进行手动录入
            *  2、中登服务时间内，只有产品户、特殊机构（私募基金管理人除外）、机构户件类型为"境外有效商业登记证明"，且主体身份为"境外战略投资者"或"合格境外战略投资者"支持手动录入，其他都不支持
        */
       //待修改
        setEditable() {
            let that = this;
            let editAbleFlag = !that.oppBusiData.jumpJudgeBusiTimes
                || that.oppBusiData.USER_TYPE == "2"
                || (that.oppBusiData.USER_TYPE == "1" 
                    && (that.oppBusiData.customerInfo.PROF_INVESTOR_SOURCE == "10" 
                            && that.oppBusiData.SZORG_TYPE != "25" 
                            || that.oppBusiData.ID_TYPE == "14" 
                            && (that.oppBusiData.customerInfo.SUBJECT_IDENTITY === "6" 
                                || that.oppBusiData.customerInfo.SUBJECT_IDENTITY === "7")));
            that.isWriteTrdacctShow = editAbleFlag;
        },
        // 过滤出允许开通账户类型的开通类型，是允许加挂/新开 OPEN_TYEP 0 加挂 1 新开
        filterAcctOpenType(accts, types) {
            let that = this,
                acctArr = accts.split(","),
                typeArr = types.split(",");
            _.each(acctArr, v => {
                let tempKey = that.oppBusiData.trdacctOpenLogicObj[v];
                if (tempKey) {
                    if (!that.oppBusiData.TRADCCT_OPEN_TYPE[tempKey]) {
                        that.oppBusiData.TRADCCT_OPEN_TYPE[tempKey] = typeArr;
                    } else {
                        that.oppBusiData.TRADCCT_OPEN_TYPE[tempKey] = _.union(that.oppBusiData.TRADCCT_OPEN_TYPE[tempKey], typeArr);
                    }
                }
            })
        },
        // 添加对应市场证券账户的显示
        transferData(acctData, marketCode) {
            let that = this;
            //that.$refs.flowTip.removeFlowTip("zd");
            // 需求调整：过滤系统内已有的证券账户
            _.each(acctData, v => {
                // 状态为非注销 或者 系统内 没有的
                if (!(v.HAVE || v.TRDACCT_STATUS == '9')) {
                    //证券账户-中登状态-指定状态，如A1000001-冻结-已指定
                    let ZHIDING =  v.ACCT_TYPE == "11" || v.ACCT_TYPE == "12" || v.ACCT_TYPE == "13" ? (v["FIR_ORG_NAME"] != "" ? "已指定" : "未指定") : "";
                    // 除正常和新开的深A，其他状态的账户禁用
                    if (typeof(v.ACCT_STATUS) != 'undefined' && v.ACCT_STATUS != '0') {
                        v.disableFlag = true
                    }
                    if(v.TRDACCT_TEXT){
                        if (['sza','szjj','szb','sha','shjj','shb'].indexOf(marketCode) != -1 && ZHIDING == "已指定") {
                            let specifiedHSAcctList = _.find(that.specifiedHSAcctList, acct => acct == v.TRDACCT);
                            // 防止提示重复的
                            if(_.isEmpty(specifiedHSAcctList)) {
                                that.specifiedHSAcctList.push(v.TRDACCT);
                            }
                            v.disableFlag = true
                        }
                        // 判断一下 防止添加重复的证券账号
                        if (_.isEmpty(_.find(that.acctInfo[marketCode], item => { return item.TRDACCT == v.TRDACCT}))) {
                            that.acctInfo[marketCode].push(v)
                        }
                        return
                    }
                    v.TRDACCT_TEXT = `${v.TRDACCT}-${v.TRDACCT_STATUS_TEXT} ${ZHIDING == "已指定" ? '-已指定' : ''}`
                    if(['sza','szjj','szb','sha','shjj','shb'].indexOf(marketCode) != -1 && ZHIDING == "已指定"){
                        let specifiedHSAcctList = _.find(that.specifiedHSAcctList, acct => acct == v.TRDACCT);
                        if (ZHIDING == "已指定") {
                            if(_.isEmpty(specifiedHSAcctList)) {
                                that.specifiedHSAcctList.push(v.TRDACCT);
                            }
                        }
                        v.disableFlag = true
                    }
                    if(['sgt','hgt'].indexOf(marketCode) != -1){
                        v.TRDACCT_TEXT = v.TRDACCT
                    }
                    // 判断一下 防止添加重复的证券账号
                    if (_.isEmpty(_.find(that.acctInfo[marketCode], item => { return item.TRDACCT == v.TRDACCT}))) {
                        that.acctInfo[marketCode].push(v)
                    }
                }
            });
        },
        getModelData() {
            let that = this;
             //避免中登查回来的数据是记录不存在；
            that.oppBusiData.csdcTrdacctArr = _.filter(that.oppBusiData.csdcTrdacctArr || [], v => v.YMT_CODE == that.oppBusiData.ymtCode && v.YMT_CODE != "");
            that.oppBusiData.csdcTrdacctArr = _.map(that.oppBusiData.csdcTrdacctArr, obj => {
                let tempDict = _.find(that.oppBusiData.dictAcctType, dict => dict.DICT_ITEM == obj.ACCT_TYPE) || '';
                obj.ACCT_TYPE_TEXT = tempDict && tempDict.DICT_ITEM_NAME;
                tempDict = _.find(that.oppBusiData.dictTrdacctStatus, dict => dict.DICT_ITEM == obj.ACCT_STATUS) || '';
                obj.TRDACCT_STATUS_TEXT = tempDict && tempDict.DICT_ITEM_NAME;
		         //数据筛选过滤RELATION_FLAG,导致缺省数据 @author chenxi
                _.extend(obj, _.filter(that.oppBusiData["zdacct"] || [], function (v1) {
                    return v1.TRDACCT == obj.TRDACCT
                })[0], {
                    'RELATION_FLAG':obj.RELATION_FLAG, 
                    YMT_CODE: obj.YMT_CODE, 
                    ACCT_STATUS: obj.ACCT_STATUS
                });
                return obj;
            })

            //设置账号的个数
            that.oppBusiData.SZ_A_MAX = oppService.getBusiCommonParamsFromCacheObjs("SZ_A_MAX") * 1;
            that.oppBusiData.SZ_B_MAX = oppService.getBusiCommonParamsFromCacheObjs("SZ_B_MAX") * 1;
            that.oppBusiData.SH_A_MAX = oppService.getBusiCommonParamsFromCacheObjs("SH_A_MAX") * 1;
            that.oppBusiData.SH_B_MAX = oppService.getBusiCommonParamsFromCacheObjs("SH_B_MAX") * 1;
            that.oppBusiData.SZ_JJ_MAX = oppService.getBusiCommonParamsFromCacheObjs("SZ_JJ_MAX") * 1;
            that.oppBusiData.SH_JJ_MAX = oppService.getBusiCommonParamsFromCacheObjs("SH_JJ_MAX") * 1;
            that.oppBusiData.GZ_A_MAX = oppService.getBusiCommonParamsFromCacheObjs("GZ_A_MAX") * 1;
            that.oppBusiData.GZ_B_MAX = oppService.getBusiCommonParamsFromCacheObjs("GZ_B_MAX") * 1;
            that.oppBusiData.SGT_MAX = oppService.getBusiCommonParamsFromCacheObjs("SGT_MAX") * 1;
            that.oppBusiData.HGT_MAX = oppService.getBusiCommonParamsFromCacheObjs("HGT_MAX") * 1;

            // 给中登证券账户 设置市场 中登只要账户类型 没有市场字段
            that.oppBusiData.allAcctList = that.translateAcctType(that.oppBusiData.csdcTrdacctArr);
            that.loading = true;
            that.loadingText = "正在处理证券账户……";
            return that.filterTrdacct(that.oppBusiData.allAcctList).then(res => {
                // 正常来说 这个数据应该为一个 空数组 因为目前看接口返回的FLAG 都为 1
                that.oppBusiData.trdacctArr = _.filter(res.Data || [], v => v.FLAG == "0") || [];
                
                //获取过滤了系统内账户的中登证券账户，加挂只能加挂系统内没有的账户
                that.oppBusiData.allAcctList = that.getCompareData(res.Data);
                
                // 过滤掉了系统内的证券账户
                that.oppBusiData.acctList = _.filter(that.oppBusiData.allAcctList, function (v) {
                    return v.ACCT_STATUS != "9" && _.indexOf(that.oppBusiData.sysAcctArr, v.TRDACCT) == -1 && v.RELATION_FLAG == "1"; //&& v.RELATION_FLA== "1";
                });

                // 当然这个也为空数组
                that.oppBusiData.packTrdData = that.packData(that.oppBusiData.trdacctArr);
                //深A已有账号
                that.oppBusiData.szaData = _.filter(that.oppBusiData.acctList, function (v) {
                    return (v.ACCT_TYPE == '21'|| v.ACCT_TYPE == 'H8')//xiexs add 20181122 增加H8回购专业证券账号
                });
                //深B已有账号
                that.oppBusiData.szbData = _.filter(that.oppBusiData.acctList, function (v) {
                    return v.ACCT_TYPE == '22'
                });
                //沪A已有账号
                that.oppBusiData.shaData = _.filter(that.oppBusiData.acctList, function (v) {
                    return v.ACCT_TYPE == '11'
                });
                //沪B已有账号
                that.oppBusiData.shbData = _.filter(that.oppBusiData.acctList, function (v) {
                    return v.ACCT_TYPE == '12'
                });
                //获取每个交易板块可选择的账户数据
                //存在中登深A 证券账户在系统内已开深A  但是未开股转  此证券账户可用来加挂股转
                var tempGZ = _.union(_.filter(that.oppBusiData.acctList, function (v) {
                    return v.ACCT_TYPE == "31"
                }), _.filter(that.oppBusiData.allAcctList, function (v) {
                    return v.ACCT_STATUS != "9" && _.indexOf(that.oppBusiData.allowGzArr, v.TRDACCT) !== -1;
                }));
                //股转A已有账号
                that.oppBusiData.gzaData = [];

                var tempGZA1 = _.filter(that.oppBusiData.packTrdData, function (v) {
                    return v.STKBD == '00' && v.TRDACCT_EXCLS != "4" && v.TRDACCT_EXCLS != "5" && v.TRDACCT_EXCLS != "7"
                });
                var tempGZA2 = _.filter(that.oppBusiData.packTrdData, function (v) {
                    return v.STKBD == '20'
                });
                if (tempGZA2.length == 0) {
                    that.oppBusiData.gzaData = tempGZA1;
                } else {
                    that.oppBusiData.gzaData = tempGZA1;
                    _.each(tempGZA1, function (v1) {
                        _.each(tempGZA2, function (v2) {
                            if (v1.TRDACCT == v2.TRDACCT) {
                                that.oppBusiData.gzaData = _.reject(that.oppBusiData.gzaData, function (v3) {
                                    return v3.TRDACCT == v2.TRDACCT
                                });
                                return false;
                            }
                        });
                    });
                }
                
                //银河证券 股转A 只能用深A 加挂 排除深B证券账户
                that.oppBusiData.gzaData = _.uniqBy(_.union(that.oppBusiData.szaData, that.oppBusiData.gzaData, _.filter(tempGZ,function(obj){ return obj.STKBD === "00"})), 'TRDACCT');
                
                //股转B已有账号
                that.oppBusiData.gzbData = [];
                var tempGZB1 = _.filter(that.oppBusiData.packTrdData, function (v) {
                    return (v.STKBD == '00' || v.STKBD == '01') && v.TRDACCT_EXCLS != "4" && v.TRDACCT_EXCLS != "5" &v.TRDACCT_EXCLS != "7"
                });
                var tempGZB2 = _.filter(that.oppBusiData.packTrdData, function (v) {
                    return v.STKBD == '21'
                });
                if (tempGZB2.length == 0) {
                    that.oppBusiData.gzbData = tempGZB1;
                } else {
                    that.oppBusiData.gzbData = tempGZB1;
                    _.each(tempGZB1, function (v1) {
                        _.each(tempGZB2, function (v2) {
                            if (v1.TRDACCT == v2.TRDACCT) {
                                that.oppBusiData.gzbData = _.reject(that.oppBusiData.gzbData, function (v3) {
                                    return v3.TRDACCT == v2.TRDACCT
                                });
                                return false;
                            }
                        });
                    });
                }
                that.oppBusiData.gzbData = _.uniqBy(_.union(that.oppBusiData.szaData, that.oppBusiData.szbData, that.oppBusiData.gzbData, tempGZ), 'TRDACCT');
                //深基金已有账号
                that.oppBusiData.szjjData = _.filter(that.oppBusiData.acctList, function (v) {
                    return v.ACCT_TYPE == '23';
                });
                //沪基金已有账号
                that.oppBusiData.shjjData = _.filter(that.oppBusiData.acctList, function (v) {
                    return v.ACCT_TYPE == '13';
                });
                that.oppBusiData.enSZA = _.filter(that.oppBusiData.allAcctList, function (acct) {
                    return (acct.ACCT_TYPE == "21" || acct.ACCT_TYPE == "H8")&& acct.ACCT_STATUS != "9";//xiexs ad20181122 增加H8回购专业证券账号
                });
                that.oppBusiData.enSZB = _.filter(that.oppBusiData.allAcctList, function (acct) {
                    return acct.ACCT_TYPE == "22" && acct.ACCT_STATUS != "9";
                });
                that.oppBusiData.enSHA = _.filter(that.oppBusiData.allAcctList, function (acct) {
                    return acct.ACCT_TYPE == "11" && acct.ACCT_STATUS != "9";
                });
                that.oppBusiData.enSHB = _.filter(that.oppBusiData.allAcctList, function (acct) {
                    return acct.ACCT_TYPE == "12" && acct.ACCT_STATUS != "9";
                });
                that.oppBusiData.enGZA = _.filter(that.oppBusiData.trdacctArr, function (acct) {
                    return acct.STKBD == "20" && acct.TRDACCCT_STATUS != "9";
                });
                that.oppBusiData.enGZB = _.filter(that.oppBusiData.trdacctArr, function (acct) {
                    return acct.STKBD == "21" && acct.TRDACCCT_STATUS != "9";
                });
                that.oppBusiData.enSZJJ = _.filter(that.oppBusiData.allAcctList, function (acct) {
                    return acct.ACCT_TYPE == "23" && acct.ACCT_STATUS != "9";
                });
                that.oppBusiData.enSHJJ = _.filter(that.oppBusiData.allAcctList, function (acct) {
                    return acct.ACCT_TYPE == "13" && acct.ACCT_STATUS != "9";
                });
                let tempArr = _.cloneDeep(that.oppBusiData.csdcTrdacctArr);
                that.oppBusiData.tranformedCsdcTrdacctArr = _.map(tempArr, obj => {
                    let tempDict = _.find(that.oppBusiData.dictAcctType, dict => dict.DICT_ITEM == obj.ACCT_TYPE) || '';
                    obj.ACCT_TYPE = tempDict && tempDict.DICT_ITEM_NAME;
                    tempDict = _.find(that.oppBusiData.dictAcctStat, dict => dict.DICT_ITEM == obj.ACCT_STATUS) || '';
                    obj.TRDACCT_STATUS = tempDict && tempDict.DICT_ITEM_NAME;
                    return obj;
                })
                that.getEnableData();
                that.getLoactEnableData();
                that.loading = false;
                if (that.oppBusiData.ymtCode) {
                    that.checkYmtInfo();
                }
            }).catch(error => that.loading = false);
        },
        translateAcctType(data) {
            var that = this;
            _.each(data, function (v) {
                switch (v.ACCT_TYPE) {
                    case "11":
                        v["STKBD"] = "10";
                        break;
                    case "12":
                        v["STKBD"] = "11";
                        break;
                    case "13":
                        v["STKBD"] = "10";
                        break;
                    case "21":
                        v["STKBD"] = "00";
                        break;
                    case "22":
                        v["STKBD"] = "01";
                        break;
                    case "23":
                        v["STKBD"] = "00";
                        break;
                    //xiexs add 20181122 增加H8回购专业证券账号 begin
                    case "H8":
                        v["STKBD"] = "00";
                        break;
                    //xiexs add 20181122 增加H8回购专业证券账号 end 							
                }
            });
            return data;
        },
        //过滤加挂的证券账户列表
        filterTrdacct(acctArr) {
            return this.$syscfg.K_Request("YG003680", {TRDACCT_LIST: acctArr});
        },
        //检验客户一码通资料是否完善
        checkYmtInfo() {
            let that = this;
            let custCodeObj = Object.assign(that.oppBusiData.customerInfo, {
                MOBILE_TEL: _.get(that, 'historyData.CUST_INFO.CUST_LINK_INFO.MOBILE_TEL', ''),
                ADDRESS: _.get(that, 'historyData.CUST_INFO.CUST_LINK_INFO.ADDRESS', ''),
                ZIP_CODE: _.get(that, 'historyData.CUST_INFO.CUST_LINK_INFO.ZIP_CODE', ''),
            });
            let checkObj = that.$blMethod.checkYmtInfoPerfect(custCodeObj, that.oppBusiData.csdcCustInfo);
            if (checkObj.CHECK_FLAG == "1") {
                that.oppBusiData.SYNC_CSDC = "0";
            } else if (checkObj.CHECK_FLAG == "2") {
                that.oppBusiData.SYNC_CSDC = "1";
            }
            that.oppBusiData.SYNC_INFO = checkObj.SYNC_INFO;
        },
        //获取中登系统各板块已开立账户（已销户的除外）
        getEnableData() {
            let that = this;
            that.oppBusiData.enSZA = _.filter(that.oppBusiData.allAcctList, acct => {
                if (that.$syscfg.isQSMZ("HUAXI")) {
                    return acct.STKBD == "00" && acct.TRDACCT_STATUS != "9" && (acct.TRDACCT_EXCLS == "0" || acct.TRDACCT_EXCLS == "1");
                }
                return acct.ACCT_TYPE == "21" && acct.ACCT_STATUS != "9";
            });
            that.oppBusiData.enSZB = _.filter(that.oppBusiData.allAcctList, function (acct) {
                if (that.$syscfg.isQSMZ("HUAXI")) {
                    return acct.STKBD == "01" && acct.TRDACCT_STATUS != "9" && (acct.TRDACCT_EXCLS == "0" || acct.TRDACCT_EXCLS == "1");
                }
                return acct.ACCT_TYPE == "22" && acct.ACCT_STATUS != "9";
            });
            that.oppBusiData.enSHA = _.filter(that.oppBusiData.allAcctList, function (acct) {
                if (that.$syscfg.isQSMZ("HUAXI")) {
                    return acct.STKBD == "10" && acct.TRDACCT_STATUS != "9" && (acct.TRDACCT_EXCLS == "0" || acct.TRDACCT_EXCLS == "1");
                }
                return acct.ACCT_TYPE == "11" && acct.ACCT_STATUS != "9";
            });
            that.oppBusiData.enSHB = _.filter(that.oppBusiData.allAcctList, function (acct) {
                if (that.$syscfg.isQSMZ("HUAXI")) {
                    return acct.STKBD == "11" && acct.TRDACCT_STATUS != "9" && (acct.TRDACCT_EXCLS == "0" || acct.TRDACCT_EXCLS == "1");
                }
                return acct.ACCT_TYPE == "12" && acct.ACCT_STATUS != "9";
            });
            that.oppBusiData.enGZA = _.filter(that.oppBusiData.trdacctArr, function (acct) {
                return acct.STKBD == "20" && acct.TRDACCT_STATUS != "9";
            });
            that.oppBusiData.enGZB = _.filter(that.oppBusiData.trdacctArr, function (acct) {
                return acct.STKBD == "21" && acct.TRDACCT_STATUS != "9";
            });
            that.oppBusiData.enSZJJ = _.filter(that.oppBusiData.allAcctList, function (acct) {
                if (that.$syscfg.isQSMZ("HUAXI")) {
                    return acct.STKBD == "00" && acct.TRDACCT_STATUS != "9" && (acct.TRDACCT_EXCLS == "4" || acct.TRDACCT_EXCLS == "5");
                }
                return acct.ACCT_TYPE == "23" && acct.ACCT_STATUS != "9";
            });
            that.oppBusiData.enSHJJ = _.filter(that.oppBusiData.allAcctList, function (acct) {
                if (that.$syscfg.isQSMZ("HUAXI")) {
                    return acct.STKBD == "10" && acct.TRDACCT_STATUS != "9" && (acct.TRDACCT_EXCLS == "4" || acct.TRDACCT_EXCLS == "5");
                }
                return acct.ACCT_TYPE == "13" && acct.ACCT_STATUS != "9";
            });
            that.oppBusiData.enSGT = _.filter(that.oppBusiData.allAcctList, function (acct) {
                return acct.STKBD == "03" && acct.TRDACCT_STATUS != "9";
            });
            that.oppBusiData.enHGT = _.filter(that.oppBusiData.allAcctList, function (acct) {
                return acct.STKBD == "13" && acct.TRDACCT_STATUS != "9";
            });
        },
        //获取本地证券账户已开数量
        getLoactEnableData() {
            var that = this;
            that.oppBusiData.enSZALocal = _.filter(that.oppBusiData.trdacctArr, function (acct) {//本地深A账户
                return acct.STKBD == "00" && acct.TRDACCT_STATUS != "9" && (acct.TRDACCT_EXCLS == "0" || acct.TRDACCT_EXCLS == "1");
            });
            that.oppBusiData.enSZBLocal = _.filter(that.oppBusiData.trdacctArr, function (acct) {//本地深B账户
                return acct.STKBD == "01" && acct.TRDACCT_STATUS != "9" && (acct.TRDACCT_EXCLS == "0" || acct.TRDACCT_EXCLS == "1");
            });
            that.oppBusiData.enSHALocal = _.filter(that.oppBusiData.trdacctArr, function (acct) {
                return acct.STKBD == "10" && acct.TRDACCT_STATUS != "9" && (acct.TRDACCT_EXCLS == "0" || acct.TRDACCT_EXCLS == "1");
            });
            that.oppBusiData.enSHBLocal = _.filter(that.oppBusiData.trdacctArr, function (acct) {
                return acct.STKBD == "11" && acct.TRDACCT_STATUS != "9" && (acct.TRDACCT_EXCLS == "0" || acct.TRDACCT_EXCLS == "1");
            });
            that.oppBusiData.enGZALocal = _.filter(that.oppBusiData.trdacctArr, function (acct) {
                return acct.STKBD == "20" && acct.TRDACCT_STATUS != "9";
            });
            that.oppBusiData.enGZBLocal = _.filter(that.oppBusiData.trdacctArr, function (acct) {
                return acct.STKBD == "21" && acct.TRDACCT_STATUS != "9";
            });
            that.oppBusiData.enSZJJLocal = _.filter(that.oppBusiData.trdacctArr, function (acct) {
                return acct.STKBD == "00" && acct.TRDACCT_STATUS != "9" && (acct.TRDACCT_EXCLS == "4" || acct.TRDACCT_EXCLS == "5");
            });
            that.oppBusiData.enSHJJLocal = _.filter(that.oppBusiData.trdacctArr, function (acct) {
                return acct.STKBD == "10" && acct.TRDACCT_STATUS != "9" && (acct.TRDACCT_EXCLS == "4" || acct.TRDACCT_EXCLS == "5");
            });
            that.oppBusiData.enSGTLocal = _.filter(that.oppBusiData.trdacctArr, function (acct) {
                return acct.STKBD == "03" && acct.TRDACCT_STATUS != "9";
            });
            that.oppBusiData.enHGTLocal = _.filter(that.oppBusiData.trdacctArr, function (acct) {
                return acct.STKBD == "13" && acct.TRDACCT_STATUS != "9";
            });
        },
        //翻译账户的状态
        packData(data) {
            let that = this;
            let resArr = [];
            _.map(_.filter(data, function (v) {
                    return v.TRDACCT_STATUS != "9"
            }), function (v1) {
                _.each(that.oppBusiData.dictAcctStat, function (v) {
                    if (v.DICT_ITEM == v1.TRDACCT_STATUS) {
                        v1["STATUS"] = v.DICT_ITEM_NAME;
                        return false;
                    }
                });
                v1["ACCT_STATUS"] = v1.TRDACCT_STATUS;
                v1["HAVE"] = false;
                resArr.push(v1);
            });
            return resArr;
        },
        // 标记中登里有、系统内没有的账户数据
        getCompareData(data) {
            let that = this;
            let zdTrdacctArr = data || _.filter(that.oppBusiData.allAcctList, function (v) {
                return v.ACCT_STATUS != "9"
            });
            let accttype = ["11", "12", "13", "21", "22", "23", "31"];
            let resArr = [];
            _.map(zdTrdacctArr, function (v1) {
                if (_.indexOf(accttype, v1.ACCT_TYPE) == -1) {
                    return false;
                }
                if (v1.YMT_CODE != that.oppBusiData.ymtCode) {
                    return false
                }
                // 目前 了解到得 HAVE的含义 
                // 当HAVE为false 表示证券账户中登有 系统内无 
                //       为true  表示证券账户中登有 系统内有
                if (v1.FLAG == "1") {
                    v1["HAVE"] = false;
                } else {
                    v1["HAVE"] = true;
                }
                v1["ZHIDING"] = v1["FIR_ORG_NAME"] != "" ? "已指定" : (v1.ACCT_TYPE == "11" || v1.ACCT_TYPE == "12" ? "未指定" : "");
                _.each(that.oppBusiData.dictAcctStat, function (v) {
                if (v.DICT_ITEM == v1.ACCT_STATUS) {
                        v1["STATUS"] = v.DICT_ITEM_NAME;
                        return false;
                    }
                });
                resArr.push(v1);
            });
            return resArr;
        },
        // 选择要加挂的证券账户事件
        selectAcct(trdacctValue,marketItem) {
            let that = this,
                marketCode = marketItem.MARKET_CODE,
                selectObj = _.find(that.acctInfo[marketCode],{TRDACCT: trdacctValue}),
                selectedItems = 1;
            if (["sha","shb"].includes(marketCode)) {
                let specifiedHSAcctList =_.find(that.specifiedHSAcctList, acct => acct == v.TRDACCT);
                if (selectObj.FIR_ORG_NAME && (that.$syscfg.isQSMZ("YINHE") ? oppService.getSysCommonParamsFromCacheObjs('QSZWMC') != selectObj.FIR_ORG_NAME : oppService.getSysCommonParamsFromCacheObjs("QSJC") != selectObj.FIR_ORG_NAME)) {
                    if(_.isEmpty(specifiedHSAcctList)) {
                        that.specifiedHSAcctList.push(v.TRDACCT);
                    }
                    v.disableFlag = true
                }
            }
            let tipmsg1 = that.$syscfg.isQSMZ("YINHE") ? "未注销" : "有效";
            if (marketCode == "sza") {
                if (selectedItems <= that.oppBusiData.SZ_A_MAX) {
                    that.matchGza(selectObj);
                    return;
                }
                that.messageBox({
                    messageText: "您在系统内的"+ tipmsg1 +"的深A账户数量已达" + that.oppBusiData.SZ_A_MAX + "个，请向客户确认是否要继续加挂？",
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    typeMessage: 'warn',
                    confirmedAction: function () {
                        that.matchGza(selectObj);
                    },
                    canceledAction: function() {
                        // 取消勾选
                        that.acctValue[marketCode] = '';
                        that.unSelectAcct(selectObj, "sza");
                    }
                })
            } else if (marketCode == "szjj") {
                if (selectedItems <= that.oppBusiData.SZ_JJ_MAX) {
                    return;
                }
                that.messageBox({
                    hasMask: true,
                    messageText: "您在系统内的"+ tipmsg1 +"的深基金账户数量已达" + that.oppBusiData.SZ_A_MAX + "个，请向客户确认是否要继续加挂？",
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    typeMessage: 'warn',
                    showMsgBox: true,
                    confirmedAction: function () {},
                    canceledAction: function() {
                        // 取消勾选
                        that.acctValue[marketCode] = '';
                    }
                })
            } else if (marketCode == "szb") {
                if (selectedItems <= that.oppBusiData.SZ_B_MAX) {
                    that.matchGzb(selectObj);
                    return;
                }
                that.messageBox({
                    hasMask: true,
                    messageText: "您在系统内的"+ tipmsg1 +"的深B账户数量已达" + that.oppBusiData.SZ_A_MAX + "个，确认是否要继续加挂？",
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    typeMessage: 'warn',
                    showMsgBox: true,
                    confirmedAction: function () {
                        that.matchGzB(selectObj);
                    },
                    canceledAction: function() {
                        // 取消勾选,触发事件
                        that.acctValue[marketCode] = '';
                        that.unSelectAcct(selectObj, "szb");
                    }
                })
            } else if (marketCode == "shjj") {
                if (selectedItems <= that.oppBusiData.SH_JJ_MAX) {
                    return;
                }
                that.messageBox({
                    hasMask: true,
                    messageText: "您在系统内的"+ tipmsg1 +"的上海基金账户数量已达" + that.oppBusiData.SZ_A_MAX + "个，确认是否要继续加挂？",
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    typeMessage: 'warn',
                    showMsgBox: true,
                    confirmedAction: function () {},
                    canceledAction: function() {
                        // 取消勾选
                        that.acctValue[marketCode] = '';
                    }
                })
            }
        },
        // 处理股转A备选账户
        matchGza(acct, type) {
            let that = this,
                gzaArr = that.oppBusiData.gzaData,
                gzbArr = that.oppBusiData.gzbData;
            if (type != "del") {
                !_.isEmpty(acct) && gzaArr.push(acct);
                !_.isEmpty(acct) && gzbArr.push(acct);
            }
            //需要去重，避免重复操作加入重复记录
            that.oppBusiData.gzaData = _.uniqBy(gzaArr, 'TRDACCT');
            that.oppBusiData.gzbData = _.uniqBy(gzbArr, 'TRDACCT');
            if (that.marketValue['gza'] && that.acctValue.gza == acct) {
                that.reloadAcctData('gza');
            } else {
                that.acctInfo.gza = [];
                that.transferData(that.oppBusiData.gzaData, 'gza');
            }
            if (that.marketValue['gzb'] && that.acctValue.gzb == acct) {
                that.reloadAcctData('gzb');
            } else {
                that.acctInfo.gzb = [];
                that.transferData(that.oppBusiData.gzbData, 'gzb');
            }
        },
        // 处理股转B备选账户
        matchGzb(acct, type) {
            let that = this;
            if (type != "del") {
                !_.isEmpty(acct) && that.oppBusiData.gzbData.push(acct);
                that.oppBusiData.gzbData = _.uniqBy(that.oppBusiData.gzbData, "TRDACCT");
                //过滤掉深B加挂中未勾选的，因为还没有加挂不可能开出股转
                let szBUnselect = _.pluck(_.filter(that.acctInfo.szb, obj => obj.TRDACCT != acct.TRDACCT), 'TRDACCT');
                _.each(szBUnselect, obj => {
                    that.oppBusiData.gzbData = _.filter(that.oppBusiData.gzbData, v => v.TRDACCT != obj);
                })
            } else {
                that.oppBusiData.gzbData = _.filter(that.oppBusiData.gzbData, v => v.TRDACCT != acct);
            }
            if (that.marketValue['gzb'] && that.acctValue.gzb == acct) {
                that.reloadAcctData('gzb');
            } else {
                that.acctInfo.gzb = [];
                that.transferData(that.oppBusiData.gzbData, 'gzb');
            }
        },
        selectOpenTypeHandle (openType,marketItem) {
            //openType 0: 加挂 1新开
            let that = this,
                marketCode = marketItem.MARKET_CODE;
            // 不是加挂的话 需要将选择的账号 置空
            if(openType != "0"){
                that.acctValue[marketCode] = '';
            }
            !that.disableAll && that.$refs.flowTip.removeAllFlowTip();
            // 如果是新开 则需要判断是否存在证券账户关联关系标识未确认的证券账户
            if(openType == "1"){
                // 存在则 不允许新开
                if (that.oppBusiData.unRelationFlag) {
                    that.openType[marketCode] = "";
                    // 禁用新开按钮
                    that.acctTypeFlag[marketCode].addNewDisableFlag = true;
                    // 如果新开加挂都不能点击，则取消当前勾选的市场并禁用
                    if(that.acctTypeFlag[marketCode].addOldDisableFlag) {
                        that.marketValue[marketCode] = '';
                        that.acctTypeFlag[marketCode].isBanFlag = true;
                    }
                    that.$refs.flowTip.pushFlowTip({
                        title: "您名下存在关联关系未确认的证券账户，不允许新开，请您先进行关联关系确认。",
                        key: "relation",
                        type: "error",
                        isShowButton: true,
                        buttonText: "证券账户关联关系确认 >",
                        buttonFn: () => {
                            that.$storage.removeSession(that.$definecfg.B_SNO);
                            that.$storage.removeSession(that.$definecfg.EVALUATE_SN); 
                            let menuObj = that.$storage.getJsonSession(that.$definecfg.ALL_MENU).find(o => o.BUSI_CODE == "V0007") || {};
                            that.$store.commit(that.$types.UPDATE_MENU_NAME, menuObj && menuObj.MENU_NAME);
                            that.$storage.setSession(that.$definecfg.BUSI_NAME, menuObj && menuObj.MENU_NAME);
                            that.$router.replace({ name: 'customerCheck', params: { busiCode: "V0007", userType: that.oppBusiData.customerInfo.USER_TYPE } });
                        }
                    })
                    return
                }
            }
            switch (marketCode) {
                case "sza":
                    // 如果股转A/B有数据则不进行清空
                    // 选择了 深A 需要重置一下 股转a b的选择状态
                    that.commandSelect(_.find(that.marketInfoArr,v => v.MARKET_CODE == 'gza'));
                    that.commandSelect(_.find(that.marketInfoArr,v => v.MARKET_CODE == 'gzb'));
                    // 加挂
                    if(openType != "1"){
                        // 值为 2 意味着 选择了是新开
                        that.acctValue.gza == "2" && (that.acctValue.gza = "")
                        that.acctValue.gzb == "2" && (that.acctValue.gzb = "")
                    }
                    // 新开
                    else{
                        // 设置股转 a、b市场可以选择
                        that.acctTypeFlag.gzb.isBanFlag = false;
                        that.acctTypeFlag.gza.isBanFlag = false;
                        if(that.oppBusiData.enSZA.length >= that.oppBusiData.SZ_A_MAX){
                            that.openType.sza = ""
                            that.acctTypeFlag.sza.addNewDisableFlag = true;
                            if(that.acctTypeFlag.sza.addOldDisableFlag) {
                                that.marketValue.sza = "";
                                that.selectMarketHandle(_.find(that.marketInfoArr,v => v.MARKET_CODE == 'gza'));
                                that.acctTypeFlag.sza.isBanFlag = true;
                            }
                            that.$refs.flowTip.pushFlowTip({
                                title: "您有效的深A账户数量已达" + that.oppBusiData.SZ_A_MAX + "个，不允许再新开。",
                                key: "sza",
                                type: "error",
                                group: "initHide"
                            })
                        }
                        // 这个地方得删除股转的提示
                        that.$refs.flowTip.removeFlowTip('gza-new');
                        that.$refs.flowTip.removeFlowTip('gzb-new');
                    }
                    break;
                case "sha":
                    if(openType == "1"){
                        if(that.oppBusiData.enSHA.length >= that.oppBusiData.SH_A_MAX){
                            that.openType.sha = ""
                            that.acctTypeFlag.sha.addNewDisableFlag = true;
                            if(that.acctTypeFlag.sha.addOldDisableFlag) {
                                that.marketValue.sha = "";
                                that.acctTypeFlag.sha.isBanFlag = true
                            }
                            that.$refs.flowTip.pushFlowTip({
                                title: "您有效的沪A账户数量已达" + that.oppBusiData.SH_A_MAX + "个，不允许再新开。",
                                key: "sha",
                                type: "error",
                                group: "initHide"
                            })
                        }
                    }
                    break;
                case "szjj":
                    if(openType == "1"){
                        if(that.oppBusiData.enSZJJ.length >= that.oppBusiData.SZ_JJ_MAX){
                            that.openType.szjj = ""
                            that.acctTypeFlag.szjj.addNewDisableFlag = true;
                            if(that.acctTypeFlag.szjj.addOldDisableFlag) {
                                that.marketValue.szjj = "";
                                that.acctTypeFlag.szjj.isBanFlag = true
                            }
                            that.$refs.flowTip.pushFlowTip({
                                title: "您有效的深基金账户数量已达" + that.oppBusiData.SZ_JJ_MAX + "个，不允许再新开。",
                                key: "szjj",
                                type: "error",
                                group: "initHide"
                            })
                        }
                    }
                    break;
                case "shjj":
                    if(openType == "1"){
                        if(that.oppBusiData.enSHJJ.length >= that.oppBusiData.SH_JJ_MAX){
                            that.openType.shjj = ""
                            that.acctTypeFlag.shjj.addNewDisableFlag = true;
                            if(that.acctTypeFlag.shjj.addOldDisableFlag) {
                                that.marketValue.shjj = "";
                                that.acctTypeFlag.shjj.isBanFlag = true
                            }
                            that.$refs.flowTip.pushFlowTip({
                                title: "您有效的深基金账户数量已达" + that.oppBusiData.SH_JJ_MAX + "个，不允许再新开。",
                                key: "shjj",
                                type: "error",
                                group: "initHide"
                            })
                        }
                    }
                    break;
            }
        },
        reloadAcctData(marketCode, noAddNewFlag) {
            let that = this;
            if (marketCode == 'gza') {
                that.acctValue.gza = "";
                that.acctInfo.gza.splice(0, that.acctInfo.gza.length);
                let tempAcct = _.cloneDeep(that.oppBusiData.gzaData);
                !noAddNewFlag && tempAcct.push({TRDACCT: "2", TRDACCT_TEXT: "深A-新开账户"});
                that.transferData(tempAcct, "gza");
            } else if (marketCode == 'gzb') {
                that.acctValue.gzb = "";
                that.acctInfo.gzb.splice(0, that.acctInfo.gzb.length);
                let tempAcct = _.cloneDeep(that.oppBusiData.gzbData);
                !noAddNewFlag && tempAcct.push({TRDACCT: "2", TRDACCT_TEXT: "深A-新开账户"});
                that.transferData(tempAcct, "gzb");
            } else if (marketCode == 'sgt') {
                that.acctValue.sgt = "";
                that.acctInfo.sgt.splice(0, that.acctInfo.sgt.length);
                let tempAcct = _.cloneDeep(that.oppBusiData.sgtData);
                !noAddNewFlag && tempAcct.push({TRDACCT: "2", TRDACCT_TEXT: that.acctValue.sza});
                that.transferData(tempAcct, "sgt");
            }else if (marketCode == 'hgt') {
                that.acctValue.hgt = "";
                that.acctInfo.hgt.splice(0, that.acctInfo.hgt.length);
                let tempAcct = _.cloneDeep(that.oppBusiData.hgtData);
                !noAddNewFlag && tempAcct.push({TRDACCT: "2", TRDACCT_TEXT: that.acctValue.sha});
                that.transferData(tempAcct, "hgt");
            }
            if (that.acctInfo[marketCode].length == 0) {
                that.marketValue[marketCode] = false;
            }
        },
        // 选择市场事件
        commandSelect(obj) {
            let that = this,
                addNewFlag = that.oppBusiData.TRADCCT_OPEN_TYPE[obj.MARKET_CODE] ? _.indexOf(that.oppBusiData.TRADCCT_OPEN_TYPE[obj.MARKET_CODE], "1") != -1 : true, // 允许新开 默认允许
                addOldFlag = that.oppBusiData.TRADCCT_OPEN_TYPE[obj.MARKET_CODE] ? _.indexOf(that.oppBusiData.TRADCCT_OPEN_TYPE[obj.MARKET_CODE], "0") != -1 : true; // 允许加挂
            if (that.oppBusiData.unRelationFlag || that.isForbidOpenAcctStock()) {
                that.checkCsdcInfo();
            }
            // 开户信息逻辑配置检查, 设置允许开通的类型
            if (!addNewFlag) {
                that.acctTypeFlag[obj.MARKET_CODE].addNewDisableFlag = true;
            } else {
                that.acctTypeFlag[obj.MARKET_CODE].addNewDisableFlag = false;
            }
            if (!addOldFlag) {
                that.acctTypeFlag[obj.MARKET_CODE].addOldDisableFlag = true
            } else {
                that.acctTypeFlag[obj.MARKET_CODE].addOldDisableFlag = false;
            }
            switch(obj.MARKET_CODE) {
                case "sza":
                    that.transferData(that.oppBusiData.szaData, "sza");
                    break;
                case "sha":
                    that.transferData(that.oppBusiData.shaData, "sha");
                    break;
                case "szjj":
                    that.transferData(that.oppBusiData.szjjData, "szjj");
                    break;
                case "shjj":
                    that.transferData(that.oppBusiData.shjjData, "shjj");
                    break;
                case "gza"://股转A
                     let gzaArr = _.filter(that.oppBusiData.gzaData, v => v.ACCT_STATUS != "9" || v.STATUS == '正常');
                    if (that.openType.sza == "1") {
                        // 深A选择新开
                        that.reloadAcctData("gza");
                    }else{
                        // 1.客户在中登系统中没有状态“正常”且未在系统内开通股转的深A或股转证券账户（400XXX账户）；
                        // 2.没有选择新开深A
                        gzaArr = _.filter(gzaArr, acct => acct.ACCT_STATUS == '0' || acct.STATUS == '正常');
                        if (gzaArr.length == 0 && that.marketValue[obj.MARKET_CODE]) {
                            // 深A选择加挂且无加挂账户时，股转不能加挂
                            that.marketValue[obj.MARKET_CODE] = '';
                            that.acctTypeFlag.gza.isBanFlag = true;
                            that.$refs.flowTip.pushFlowTip({
                                title: "您没有选择新开深A证券账户，不能开通京A/股转A证券账户。",
                                key: "gza-new",
                                type: "error",
                                group: "initHide"
                            })
                        } else { // 有可加挂的股转A账户
                            that.reloadAcctData("gza", true);
                        }
                    }
                    break;
                case "gzb"://股转B
                    let gzbArr = _.filter(that.oppBusiData.gzbData, v => v.ACCT_STATUS != "9" || v.STATUS == '正常');
                    if (that.openType.sza == "1") {
                        // 深A选择新开
                        that.reloadAcctData("gzb");
                    }else{
                        gzbArr = _.filter(gzbArr, acct => acct.ACCT_STATUS == '0' || acct.STATUS == '正常');
                        if (gzbArr.length == 0 && that.marketValue[obj.MARKET_CODE]){
                            // 深A选择加挂且无加挂账户时，股转不能加挂
                            that.marketValue[obj.MARKET_CODE] = '';
                            that.acctTypeFlag.gzb.isBanFlag = true;
                            that.$refs.flowTip.pushFlowTip({
                                title: "您没有选择新开深A证券账户，不能开通股转B证券账户。",
                                key: "gzb-new",
                                type: "error",
                                group: "initHide"
                            })
                        } else { // 有可加挂的股转B账户
                            that.reloadAcctData("gzb", true);
                        }
                    }
                    break;
            }

            // 这里需要处理 对于没有可加挂的市场 加挂按钮设置置灰 并且不可以手动输入时才做这种控制 否则还是按照开户逻辑进行处理
            if (that.acctInfo[obj.MARKET_CODE].length == "0" && !that.isWriteTrdacctShow) {
                that.acctTypeFlag[obj.MARKET_CODE].addOldDisableFlag = true
            }
        },
        isForbidOpenAcctStock() {
            var that = this;
            return that.oppBusiData.customerInfo.USER_TYPE == "0" && that.oppBusiData.busiCommonParams.ALLOWED_LASTRISK_FLAG_OPEN_ACCT == "0"
                && _.get(that.historyData.RISK_INFO && that.historyData.RISK_INFO[0], "CUST_LASTRISK_FLAG") == "1"
                && (!that.historyData.CUST_INFO.CUST_BASIC_INFO.UNDER_AGE || that.historyData.CUST_INFO.CUST_BASIC_INFO.UNDER_AGE == "2");
        },
        //待修改
        checkTrdacctByInner(trdacct, marketCode) {
            let that = this;
            that.loading = true;
            that.loadingText = "正在校验股东账户……"
            return new Promise((resolve, reject) => {
                custService.getCustAccountByTrdacct(that,{
                    TRDACCT: trdacct,
                    STKBD: that.oppBusiData.stkbdTrdacctOpenType[marketCode]
                }).then(res => {
                    if (res.Data && res.Data.length > 0) {
                        let tempAcctArr = _.filter(res.Data, v => v.TRDACCT_STATUS !== "9" && -1 < _.indexOf(["0", "1", "4", "5"], v.TRDACCT_EXCLS)) || [];
                        if (tempAcctArr.length) {
                           resolve(true);
                        } else if (_.find(tempAcctArr, {CUST_CODE: that.oppBusiData.CUST_CODE})) {
                            resolve({
                                checkResult: false,
                                errorText: "股东账户[" + trdacct + "]" + "已经加挂在客户代码" + tempAcctArr[0].CUST_CODE + "下，请重新选择"
                            });
                        } else {
                            that.messageBox({
                                hasMask: true,
                                messageText: "证券账户[" + trdacct + "]" + "已经加挂在资金账户" + tempAcctArr[0].CUACCT_CODE + "下，请确认是否继续？",
                                confirmButtonText: '确认',
                                cancelButtonText: '取消',
                                typeMessage: 'warn',
                                showMsgBox: true,
                                confirmedAction: function () {
                                    resolve(true);
                                },
                                canceledAction: function() {
                                    resolve(false);
                                }
                            })
                        }
                    } else {
                        resolve(true)
                    }
                }).finally(()=>{
                    that.loading = false;
                })
            })
        },
        //检查证券账户在中登系统对应板块是否存在
        //待修改
        checkTrdacctByCSDC(trdacct, acctType) {
            let that = this,
                isValidCust = false,//是否校验中登证券账户的客户三要素与系统内三要素是否一致
                isMustAdded = false;//输入的账户是否必须是本地已开账户（针对沪港通）
            that.loading = true;
            that.loadingText = "正在校验股东账户……";
            switch(acctType) {
                case "sza":
                    acctType = "21";
                    break;
                case "sha":
                    acctType = "11";
                    break;
                case "szb":
                    acctType = "22";
                    break;
                case "shb":
                    acctType = "12";
                    break;
                case "gza":
                    acctType = ["21"];  // 股转A的配号一定是深A
                    break;
                case "gzb":
                    acctType = ["21", "22"]; // 股转B的配号是深A或深B
                    break;
                case "szjj":
                    acctType = "23";
                    break;
                case "shjj":
                    acctType = "13";
                    break;
                case "sgt":
                    acctType = "21";
                    isMustAdded = true;
                    break;
                case "hgt":
                    acctType = "11";
                    isMustAdded = true;
                    break;
            }
            //银河个性化：个人和机构需要校验股东账户中登三要素是否与客户本人三要素信息一致，否则不可办理加挂，避免加挂的账户为他人账户；
            if (that.$syscfg.isQSMZ("YINHE")) {
                isValidCust = that.oppBusiData.USER_TYPE != "2";
            } else {//标准版：个人和普通机构需要校验股东账户中登三要素是否与客户本人三要素一致
                isValidCust = that.oppBusiData.USER_TYPE == "0" || (that.oppBusiData.USER_TYPE == "1" && -1 == _.indexOf(['10', '11', '12', '13', '14'], that.oppBusiData.SZORG_TYPE));
            }
            return new Promise((resolve, reject) => {
                that.$syscfg.K_Request("Y3000005", {
                    OPERATOR_TYPE: '0',
                    CHK_STATUS: '2',
                    ZD_OP_CHANNEL: "1",
                    ACCT_TYPE: acctType,
                    TRDACCT: trdacct,
                    ACCTBIZ_EXCODE: "07"
                }).then(acctData => {
                    let tmpFlag = true;
                    if (!acctData.length || !acctData[0].RTN_ERR_CODE || acctData[0].RTN_ERR_CODE != "0000") {
                        tmpFlag =  {
                            checkResult : false,
                            errorText: "股东账户[" + trdacct + "]" + (acctData[0] && acctData[0].RETURN_MSG || "证券账户号码不存在或与证券账户类别不匹配！")
                        }
                    } else if(acctData.length && acctData[0].ACCTBIZ_STATUS === "2") {
                        if (isValidCust && (acctData[0].ID_CODE !== that.oppBusiData.ID_CODE || acctData[0].ID_TYPE !== that.oppBusiData.ID_TYPE || acctData[0].CUST_FNAME !== that.oppBusiData.CUST_FNAME)) {
                            tmpFlag = {
                                checkResult : false,
                                errorText: "股东账户[" + trdacct + "]在中登对应三要素与客户在系统内三要素不一致！"
                            }
                        } else if (acctData[0].ACCT_STATUS != "0") {
                            tmpFlag = {
                                checkResult : false,
                                errorText: "股东账户[" + trdacct + "]证券账户状态异常！"
                            }
                        } else if (isMustAdded) {
                            tmpFlag = {
                                checkResult : false,
                                errorText: "股东账户[" + trdacct + "]未加挂在系统内本客户代码下！"
                            }
                        }
                    }
                    // 将证券号码信息保存，有重复的保留最新的
                    let acctList = _.filter(that.writtenCsdcAcctList, acct => acct.TRDACCT != acctData[0].TRDACCT);
                    acctList.push(acctData[0])
                    that.writtenCsdcAcctList = acctList;

                    that.loading = false;
                    resolve(tmpFlag);
                }).catch(e => {
                    let msg = e.split("【")[1] || "";
                    msg = msg.split("】")[0] || "";
                    that.messageBox({
                        hasMask:true,
                        messageText: msg,
                        confirmButtonText:'确定',
                        typeMessage:'error', 
                        showMsgBox:true  
                    }) 
                    that.loading = false;
                })
            }).finally(() => {
                that.loading = false;
            })
        },
        validate(_this) {
             let that = _this.$refs.V0052_openBizStockAcctNode,
                selectData = [],
                speFlag = false,
                szorgType = that.oppBusiData.customerInfo.SZORG_TYPE || '',
                subjectIdentity = that.oppBusiData.customerInfo.USER_TYPE == "1" && that.oppBusiData.customerInfo.SUBJECT_IDENTITY || '';
            if (that.$syscfg.isQSMZ("YINHE")) {
                //此处和公参配置的特殊机构不一样  证券公司、银行、信托投资公司、基金管理公司、基金管理公司子公司、保险公司、其他金融机构法人、破产管理人”或主体身份为“境外战略投资者/合格境外投资者
                //机构类别为“10 证券公司、11 银行、12 信托投资公司、13 基金管理公司、61 基金管理公司子公司、14 保险公司、19 其他金融机构法人、41 破产理人”
                if (that.oppBusiData.customerInfo.USER_TYPE == "1" && (!_.isEmpty(szorgType) || !_.isEmpty(subjectIdentity)) && (["10","11","12","13","61","14","19","41"].indexOf(szorgType) !== -1  || _.indexOf(['6','7'],subjectIdentity)  !=-1 )) {
                    speFlag = true;
                }
            } else {
                if (that.oppBusiData.customerInfo.USER_TYPE  == "1" && (!_.isEmpty(szorgType) || !_.isEmpty(subjectIdentity)) && (that.$blMethod.isSpeOrg(szorgType) || _.indexOf(['6','7'],subjectIdentity)  !=-1 )) {
                    speFlag = true;
                }
            }
            if (that.ymtIDCode) {
                 that.messageBox({
                    hasMask:true,
                    messageText:"客户只有15位身份证开通的一码通，不能办理此业务！",
                    confirmButtonText:'确定',
                    typeMessage:'error', 
                    showMsgBox:true  
                }) 
                return false;
            }

            _.each(that.marketValue,(value, key) => {
                value && selectData.push(key);
            })
            let tmpFlag = true;
            _.each(selectData, item => {
                let selectMarketName = _.find(that.marketInfoArr,v => v.MARKET_CODE == item);
                if(that.openType[item] == ""){
                    that.dialog({
                        hasMask:true,
                        messageText: '请选择' + (selectMarketName && selectMarketName.MARKET_NAME) + '市场的开通类型。',
                        confirmButtonText:'确定'
                    });
                    
                    tmpFlag = false;
                    return false;
                } else if (that.openType[item] == "0"){
                    if(that.acctValue[item] == ""){
                        that.dialog({
                            hasMask:true,
                            messageText: '请选择' + (selectMarketName && selectMarketName.MARKET_NAME)  + '市场的加挂账户。',
                            confirmButtonText:'确定'
                        });
                        tmpFlag =false;
                        return false;
                    }
                }
            })
            if (!tmpFlag) {
                return false;
            }
            _.each(selectData, item => {
                // 新开账户
                if (that.acctValue[item] == '1') {
                    if (speFlag) {
                        that.messageBox({
                            hasMask:true,
                            messageText:"特殊机构不允许新开证券账户！",
                            confirmButtonText:'确定',
                            typeMessage:'error', 
                            showMsgBox:true  
                        }) 
                        tmpFlag = false;
                        return false;
                    }
                    let tipmsg1 = that.$syscfg.isQSMZ("YINHE") ? "未注销" : "有效",
                        tipmsg2 = that.$syscfg.isQSMZ("YINHE") ? "已有未注销" : "已开通有效";
                    if (item == "sza" && that.oppBusiData.enSZA) {
                        if (that.oppBusiData.enSZA.length >= that.oppBusiData.SZ_A_MAX) {
                            that.messageBox({
                                hasMask:true,
                                messageText:"客户"+ tipmsg1 +"的深A账户数量已达" + that.oppBusiData.SZ_A_MAX + "个，不允许再新开！",
                                confirmButtonText:'确定',
                                typeMessage:'error', 
                                showMsgBox:true  
                            }) 
                            tmpFlag = false;
                            return false;
                        }
                    } else if (item == "szjj" && that.oppBusiData.enSZJJ) {
                        if (that.oppBusiData.enSZJJ.length >= that.oppBusiData.SZ_JJ_MAX) {
                            that.messageBox({
                                hasMask:true,
                                messageText: "客户"+ tipmsg1 +"的深基金账户数量已达" + that.oppBusiData.SZ_A_MAX + "个，不允许再新开！",
                                confirmButtonText:'确定',
                                typeMessage:'error', 
                                showMsgBox:true  
                            }) 
                            tmpFlag = false;
                            return false;
                        }
                    } else if (item == "shjj" && that.oppBusiData.enSHJJ) {
                        if (that.oppBusiData.enSHJJ.length >= that.oppBusiData.oppBusiData.SH_JJ_MAX) {
                            that.messageBox({
                                hasMask:true,
                                messageText: "客户"+ tipmsg1 +"的沪基金账户数量已达" + that.oppBusiData.SZ_A_MAX + "个，不允许再新开！",
                                confirmButtonText:'确定',
                                typeMessage:'error', 
                                showMsgBox:true  
                            }) 
                            tmpFlag = false;
                            return false;
                        }
                    }
                    if (item == "szb" && that.oppBusiData.enSZB) {
                        if (that.oppBusiData.enSZB.length >= that.oppBusiData.SZ_B_MAX) {
                            that.messageBox({
                                hasMask:true,
                                messageText: "客户"+ tipmsg1 +"的深B账户数量已达" + that.oppBusiData.SZ_A_MAX + "个，不允许再新开！",
                                confirmButtonText:'确定',
                                typeMessage:'error', 
                                showMsgBox:true  
                            }) 
                            tmpFlag = false;
                            return false;
                        }
                    }
                    if (item == "shb" && that.oppBusiData.enSHB) {
                        if (that.oppBusiData.enSHB.length >= that.oppBusiData.SH_B_MAX) {
                            that.messageBox({
                                hasMask:true,
                                messageText: "客户"+ tipmsg2 +"的沪B证券账户，不允许再新开！",
                                confirmButtonText:'确定',
                                typeMessage:'error', 
                                showMsgBox:true  
                            }) 
                            tmpFlag = false;
                            return false;
                        }
                    }
                }
            })
            if (!tmpFlag) {
                return false;
            }
            if (that.oppBusiData.jumpJudgeBusiTimes && that.oppBusiData.ymtCode && !_.isEmpty(that.oppBusiData.csdcCustInfo)) {
                that.checkYmtInfo();
            }
            return true;
        },
        getData() {
            let that = this,
                data = {},
                openFlagRelaObj = {
                    "sza": "OPEN_SZA_FLAG",
                    "szb": "OPEN_SZB_FLAG",
                    "sha": "OPEN_SHA_FLAG",
                    "shb": "OPEN_SHB_FLAG",
                    "gza": "OPEN_GZA_FLAG",
                    "gzb": "OPEN_GZB_FLAG",
                    "szjj": "OPEN_SZJJ_FLAG",
                    "shjj": "OPEN_SHJJ_FLAG"
                },
                OPT_TREG_FLAG = "0"; //沪A、沪B是否选择【指定委托】，默认为"0"：未选择（信达表单需要）
            data.acctList = [];
             // 重置所有开户标记
            _.each(_.values(openFlagRelaObj), function (key) {
                data[key] = "";
            });
            _.each(openFlagRelaObj, (value, key) => {
                let stkbd = that.oppBusiData.stkbdTrdacctOpenType[key],
                    openFlag = that.openType[key] == "1" ? "1" : "0",
                    stkpbuList = [];
                    //不显示席位时都默认送主交易单元
                    stkpbuList = _.filter(that.oppBusiData.stkpbuList, function (v) {
                        return v.STKBD == stkbd && v.MAJPBU_FLAG == "1"
                    });
                    //没有主交易单元就取辅交易单元
                    if (_.isEmpty(stkpbuList)) {
                        stkpbuList = _.filter(that.stkpbuList, function (v) {
                            return v.STKBD == stkbd && v.MAJPBU_FLAG == "0"
                        });
                    }
                if (!that.marketValue[key]) {
                    return true;
                }

                let obj = {
                    STKBD: stkbd,
                    NEW_OPEN_FLAG: openFlag,
                    STKPBU: stkpbuList.length && stkpbuList[0].STKPBU,
                    AUTO_TREG_FLAG: ''
                }
                //沪A股东 新开不指定，加挂指定
                if(stkbd == "10" && key != "shjj"){
                    obj.AUTO_TREG_FLAG = openFlag == "1" ? "0" :"1";
                }
                //沪B股东默认指定
                if(stkbd == "11"){
                    obj.AUTO_TREG_FLAG = "1";
                }
                if (obj.AUTO_TREG_FLAG == "1") {
                    OPT_TREG_FLAG = "1";
                }
                // 设置开户标记
                data[openFlagRelaObj[key]] = openFlag;
                //深B 沪B 股转B 属于外币 IS_FOREIGN_CURRENCY
                if (stkbd === "01" || stkbd === "11" || stkbd === "21") {
                    data.IS_OPEN_STOCK_B = "1";
                }
                if (stkbd === "00" || stkbd === "10" || stkbd === "20") {
                    data.IS_OPEN_STOCK_A = "1";
                }
                if (key == "szjj" || key == "shjj") {
                    _.extend(obj, {OPEN_TYPE: "1"});
                    data.IS_OPEN_FUND = "1";
                } else {
                    _.extend(obj, {OPEN_TYPE: "0"});
                }
                let trdacctExcls = "";
                if (obj.OPEN_TYPE == '1') {//基金账户
                    trdacctExcls = that.userType == "0" ? "4" : that.userType == "1" ? "5" : "7";
                } else { //普通账户
                    trdacctExcls = that.userType == "0" ? "0" : that.userType == "1" ? "1" : "6";
                }
                // 新开
                if (openFlag == "1") {
                    data.acctList.push(_.extend({}, obj, {TRDACCT: '', TRDACCT_EXCLS: trdacctExcls}));//TRDACCT_EXCLS 添加此字段用来填影像表单
                } else if (openFlag == "0") {
                    // 加挂
                    // 需求：每次只能加挂一个股东账户
                    let acct = that.acctValue[key];

                    //加挂需要送中登开户日期到后台, 账户中登查询接口返回字段为OPEN_DATE,  账户系统内查询接口返回字段为 ZD_OPEN_DATE  add by cjh20210120
                    if(acct) {
                        var trdacctObj = {};
                        if (!_.isEmpty(that.oppBusiData.csdcTrdacctArr)) {
                            trdacctObj = _.find(that.oppBusiData.csdcTrdacctArr || [], function (v) {
                                return v.TRDACCT == acct;
                            })
                        }
                        if (_.isEmpty(trdacctObj) && !_.isEmpty(that.writtenCsdcAcctList)) {
                            // 手动输入证券账户,会发起中登查询
                            trdacctObj = _.find(that.writtenCsdcAcctList, function (v) {
                                return v.TRDACCT == acct;
                            })
                        }

                        if (!_.isEmpty(trdacctObj) && trdacctObj.OPEN_DATE && "0" != trdacctObj.OPEN_DATE) {
                            obj.ZD_OPEN_DATE = trdacctObj.OPEN_DATE;
                        }
                    }

                     //加挂的情况，如果是股转，也要传
                    if (acct == "2" && (key == 'gza' || key == 'gzb')) {
                        data.acctList.push(_.extend({}, obj, {TRDACCT: '', TRDACCT_EXCLS: trdacctExcls}));
                    } else {
                        let temp = _.find(that.acctList, v => v.TRDACCT == acct);
                        data.acctList.push(_.extend({}, obj, {
                            TRDACCT: acct,
                            TREG_FLAG: temp ? (temp.FIR_ORG_NAME == "" ? "0" : "1") : "0",
                            TRDACCT_EXCLS: trdacctExcls
                        }));
                    }
                }
            });
            return {
                jumpJudgeBusiTimes: that.oppBusiData.jumpJudgeBusiTimes,
                YMT_CODE: that.oppBusiData.ymtCode || "",
                NET_INFO: {
                    NET_SERVICE: '0',
                    NET_SERVICEPASS: ''
                },
                TRDACCT_INFO: data.acctList,
                SPE_FLAG: that.oppBusiData.SPE_FLAG, // 特殊机构标识
                IS_OPEN_STOCK_A: data.IS_OPEN_STOCK_A || "0",
                IS_OPEN_STOCK_B: data.IS_OPEN_STOCK_B || "0",
                IS_OPEN_FUND: data.IS_OPEN_FUND || "0",
                OPEN_SZA_FLAG: data.OPEN_SZA_FLAG,
                OPEN_SZB_FLAG: data.OPEN_SZB_FLAG,
                OPEN_SHA_FLAG: data.OPEN_SHA_FLAG,
                OPEN_SHB_FLAG: data.OPEN_SHB_FLAG,
                OPEN_GZA_FLAG: data.OPEN_GZA_FLAG,
                OPEN_GZB_FLAG: data.OPEN_GZB_FLAG,
                OPEN_SZJJ_FLAG: data.OPEN_SZJJ_FLAG,
                OPEN_SHJJ_FLAG: data.OPEN_SHJJ_FLAG,
                SZA_TRDACCT: (that.acctValue.sza == '1' || that.acctValue.sza == '') ? '' : (that.acctValue.sza),
                SZB_TRDACCT: (that.acctValue.szb == '1' || that.acctValue.szb == '') ? '' : (that.acctValue.szb),
                SHA_TRDACCT: (that.acctValue.sha == '1' || that.acctValue.sha == '') ? '' : (that.acctValue.sha),
                SHB_TRDACCT: (that.acctValue.shb == '1' || that.acctValue.shb == '') ? '' : (that.acctValue.shb),
                GZA_TRDACCT: that.acctValue.gza == '2'? '' : (that.acctValue.gza || ''),
                GZB_TRDACCT: that.acctValue.gzb == '2'? '' : (that.acctValue.gzb || ''),
                SJJ_TRDACCT: (that.acctValue.szjj == '1' || that.acctValue.szjj == '') ? '' : (that.acctValue.szjj),
                HJJ_TRDACCT: (that.acctValue.shjj == '1' || that.acctValue.shjj == '') ? '' : (that.acctValue.shjj),
                SYNC_CSDC: that.oppBusiData.SYNC_CSDC || "0",//中登资料不完善
                SYNC_INFO: that.oppBusiData.SYNC_INFO || {},  //需同步的中登资料
                OLD_TRADCCT_OPEN_TYPE: that.oppBusiData.TRADCCT_OPEN_TYPE,
                OPT_TREG_FLAG: OPT_TREG_FLAG  //沪A、沪B是否选择【指定委托】，"1"：选择了【指定委托】，"0"：未选择【指定委托】（信达表单需要）
            }
        },
        beforeSave(_this, params) {
            let that = _this.$refs.V0052_openBizStockAcctNode,
                stockInfo = that.getData(),
                resultObj;
            let existTrdacctFlag = _.filter(stockInfo.TRDACCT_INFO,function(obj){
                return obj.NEW_OPEN_FLAG == "1" ;//NEW_OPEN_FLAG：1新开，0加挂
            });
            let custInfo = that.oppBusiData.customerInfo;
            resultObj = {
                NEW_OPEN_TRDACCT: "1",//新开股东卡标识
                INOUTSIDE_IDENTITY: custInfo.INOUTSIDE_IDENTITY,//境内外身份标识
                IS_OPEN_STOCK_B: stockInfo.IS_OPEN_STOCK_B,//深B、沪B、股转B 需要签外币银证转账协议
                IS_OPEN_STOCK_A: stockInfo.IS_OPEN_STOCK_A,//深A 沪A  股转A
                IS_OPEN_FUND: stockInfo.IS_OPEN_FUND,//开通开放式基金标识（深基金 沪基金）
                IS_OPEN_ACCT: stockInfo.TRDACCT_INFO.length ? "1" : "0",
                OPEN_SZA_FLAG: stockInfo.OPEN_SZA_FLAG,
                OPEN_SZB_FLAG: stockInfo.OPEN_SZB_FLAG,
                OPEN_SHA_FLAG: stockInfo.OPEN_SHA_FLAG,
                OPEN_SHB_FLAG: stockInfo.OPEN_SHB_FLAG,
                OPEN_GZA_FLAG: stockInfo.OPEN_GZA_FLAG,
                OPEN_GZB_FLAG: stockInfo.OPEN_GZB_FLAG,
                OPEN_SZJJ_FLAG: stockInfo.OPEN_SZJJ_FLAG,
                OPEN_SHJJ_FLAG: stockInfo.OPEN_SHJJ_FLAG,
                SZA_TRDACCT: stockInfo.SZA_TRDACCT,
                SZB_TRDACCT: stockInfo.SZB_TRDACCT,
                SHA_TRDACCT: stockInfo.SHA_TRDACCT,
                SHB_TRDACCT: stockInfo.SHB_TRDACCT,
                GZA_TRDACCT: stockInfo.GZA_TRDACCT,
                GZB_TRDACCT: stockInfo.GZB_TRDACCT,
                SJJ_TRDACCT: stockInfo.SJJ_TRDACCT,
                HJJ_TRDACCT: stockInfo.HJJ_TRDACCT,
                EXIST_NEWOPEN : existTrdacctFlag.length >0 ? "1": "0",  // 中山证券动态影像 新开或者加挂传1，否则传0，用于影像适当性匹配条件    注：银河复用
                OPT_TREG_FLAG: stockInfo.OPT_TREG_FLAG,  //沪A、沪B是否选择【指定委托】，"1"：选择了【指定委托】，"0"：未选择【指定委托】（信达表单需要）
                    //以下为长城证券需采集影像表单回填数据  注：银河复用  中登无深市证券账户选择加挂股转账户  需采集证券账户开立申请表
                CC_SZA_TRDACCT: stockInfo.SZA_TRDACCT,
                CC_SZB_TRDACCT: stockInfo.SZB_TRDACCT,
                CC_SHA_TRDACCT: stockInfo.SHA_TRDACCT,
                CC_SHB_TRDACCT: stockInfo.SHB_TRDACCT,
                CC_GZA_TRDACCT: stockInfo.GZA_TRDACCT,
                CC_GZB_TRDACCT: stockInfo.GZB_TRDACCT,
                CC_SJJ_TRDACCT: stockInfo.SJJ_TRDACCT,
                CC_HJJ_TRDACCT: stockInfo.HJJ_TRDACCT,
                SYNC_CSDC : stockInfo.SYNC_CSDC || "0", //银河 中登资料不完善 需采集证券账户业务申请表
                SYNC_INFO: stockInfo.SYNC_INFO || {},  //需同步的中登资料
                OLD_TRADCCT_OPEN_TYPE: stockInfo.OLD_TRADCCT_OPEN_TYPE
            }
            let acctInfo = {
                CUST_CODE: custInfo.CUST_CODE,
                YMT_CODE: stockInfo.YMT_CODE,
                NET_INFO: stockInfo.NET_INFO,
                CUST_FNAME: custInfo.CUST_FNAME,
                ID_TYPE: custInfo.ID_TYPE,
                ID_CODE: custInfo.ID_CODE,
                TRDACCT_INFO: stockInfo.TRDACCT_INFO,
            };
            // 增加股转账户标识
            return custService.getNeeqFlagForCsdc(_.compact([stockInfo.GZA_TRDACCT, stockInfo.GZB_TRDACCT]), true).then(neeqObj => {
                // 是否有新开股东账户
                let isOpenAcct = _.filter(stockInfo.TRDACCT_INFO, function (acct) {
                    return acct.NEW_OPEN_FLAG == "1";
                }).length,
                // 有新开股东账户，且加挂股转无配号
                neeqFlagForOpen = isOpenAcct && (stockInfo.OPEN_GZA_FLAG && !stockInfo.GZA_TRDACCT || stockInfo.OPEN_GZB_FLAG && !stockInfo.GZB_TRDACCT) ? "1" : "0";
                resultObj.YMT_CODE = stockInfo.YMT_CODE || "";
                resultObj.NEEQ_FLAG_FOR_OPEN = neeqFlagForOpen;
                resultObj.NEEQ_FLAG_FOR_CSDC = neeqObj.NEEQ_FLAG_FOR_CSDC;
                resultObj.NEEQ_FLAG_FOR_CSDC_REASON = custService.getNeeqFlagForCsdcReason(that.oppBusiData.busiCommonParams);
                resultObj.GZ_TRDACCT_DATA_OLD = _.map(neeqObj.GZ_TRDACCT_DATA, function (acct) {
                    return {TRDACCT: acct, TYPE: "0"}
                });
                resultObj.GZ_TRDACCT_DATA_NEW = _.map(neeqObj.GZ_TRDACCT_DATA, function (acct) {
                    return {TRDACCT: acct, TYPE: "1"}
                });
                resultObj.addAcctList = acctInfo && acctInfo.TRDACCT_INFO; //股东帐户，用于影像条件判断
                Object.assign(params, resultObj);
                if (_.isEmpty(params.ACCT_INFO)) {
                    params.ACCT_INFO = acctInfo;
                } else {
                    Object.assign(params.ACCT_INFO, acctInfo);
                }
            })
        }  
    }
}
</script>
<style lang="less">
.V0052-wrap {
    .allTrdacctAcct {
        .el-container{
            .el-header {
                font-weight:700;
                color:#252525;
                font-size:42px;
                line-height:35px;
                text-align:center;
                margin-top:20px;
            }
            .el-main{
                overflow: unset;
                .V0052-table-wrap{
                    .el-table{
                        border:1px solid;
                        border-color:#d9d9d9;
                        border-radius:8px;
                        box-shadow:0px 3px 22px rgba(0, 0, 0, 0.03);
                        .el-table__header-wrapper{
                            .el-table__header{
                                >thead{
                                    >tr{
                                        >th{
                                            background-color: #f7f7fa;
                                            height: 90px;
                                            padding-left: 35px;
                                            font-weight: 700;
                                            color: #666666;
                                            font-size: 26px;
                                            line-height: 28px;
                                            border:none;
                                            >div {
                                                height: 30px;
                                            }
                                        } 
                                    } 
                                }
                            }
                        }
                        .el-table__body-wrapper{
                            .el-table__body{
                                >tbody{
                                    >tr{
                                        >td{
                                            height: 90px;
                                            padding-left: 35px;
                                            color:#252525;
                                            font-size:24px;
                                            border:none;
                                            .cell{
                                                line-height:34px;
                                            }
                                        }
                                        &:hover{
                                            >td{
                                                background-color: #fff;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                .footer {
                    text-align: center;
                    .el-button {
                        width:170px;
                        height:60px;
                        background-image:linear-gradient(90deg,#3b6aff 0%,#208bff 100%);
                        border-radius:2px;
                        font-weight:500;
                        color:#fffdfd;
                        font-size:24px;
                        position: relative;
                        top: 45px;
                    }
                }
            }
        }
    }
    .market-select-wrap{
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        padding-left: 45px;
        padding-right: 45px;
        .title {
            height: 54px;
            font-size: 26px;
            font-weight: 700;
            display: flex;
            margin-top: 50px;
            margin-bottom: 30px;
            width: 100%;    
            justify-content: space-between;
            .text-wrap{
                display: flex;
                width: 50%;
                justify-content: flex-start;
                align-items: center;
                .logo {
                    width: 10px;
                    height: 26px;
                    border-radius:20px;
                    background-color: #3b6aff;
                }
                .titleContent {
                    padding-left: 12px;
                    color: #3b6aff;
                    font-weight: 700;
                }
            }
            .top-left{
                .el-button{
                    font-size: 24px;
                    background-color: #f7f7fa;
                    border-radius: 2px;
                    border: none;
                    span{
                        display: flex;
                        align-items: center;
                        .button-icon{
                            margin-right: 5px;
                        }
                    }
                }
            }
        }
        .market-list{
            display: flex;
            flex-wrap: wrap;
            width: 100%;
            border:1px solid;
            border-color:#d9d9d9;
            border-radius:8px;
            box-shadow:0px 3px 12px rgba(0, 0, 0, 0.04);
            padding: 10px 55px;
            max-height: 695px;
            overflow: scroll;
            .market-item{
                width: 100%;
                height: 110px;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                .el-checkbox{
                    height: 54px;
                    display: flex;
                    align-items: center;
                    .el-checkbox__input{
                        .el-checkbox__inner{
                            width: 30px;
                            height: 30px;
                            border: 1.5px solid;
                            border-color: #a0a0a0;
                            box-sizing: border-box;
                        }
                    }
                    .el-checkbox__label{
                        padding-left: 17px;
                        color: #666666;
                        font-size: 26px;
                        width: 80px;
                        text-align-last: justify;
                        >span{
                            width: 80px;
                            text-align-last: justify;
                            display: inline-block;
                        }
                    }
                    &.is-checked{
                        .el-checkbox__label{
                            color: #3b6aff;
                            font-weight: 500;
                        }
                        .el-checkbox__input{
                            .el-checkbox__inner{
                                border: none;
                                background: #3b6aff;
                                &::after{
                                    height: 15px;
                                    left: 10px;
                                    width: 6px;
                                    border-bottom: 3px solid #fff;
                                    border-right: 3px solid #fff;
                                }
                            }
                        }
                    }
                }
                .open-type{
                    height: 54px;
                    margin-left: 80px;
                    display: flex;
                    width: 460px;
                    .el-radio{
                        height: 54px;
                        border:1px solid;
                        border-color:#b7b7b7;
                        border-radius:2px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 220px;
                        box-sizing: border-box;
                        margin-right: 20px;
                        &.old-line {
                            width: 440px;
                        }
                        .el-radio__input{
                            display: none;
                        }
                        .el-radio__label{
                            padding: 0;
                            color:#252525;
                            font-size:24px;
                            letter-spacing:2.86px;
                            text-align:center;
                        }
                        &.is-checked{
                            background-color:#3b6aff;
                            border: none;
                            .el-radio__label{
                                color: #fff;
                            }
                        }
                        &.is-disabled{
                            border:1px solid;
                            border-color:#cbcbcb;
                            border-radius:2px;
                            background-color:#f0f0f0;
                            .el-radio__label{
                                color: #666666;
                            }
                        }
                    }
                }
                .el-select{
                    margin-left: 20px;
                    .el-input{
                        .el-input__inner{
                            height: 54px;
                            width: 390px;
                            border: 1px solid;
                            border-color: #8d8d8d;
                            color: #222222;
                            border-radius: 2px;
                            font-size: 24px;
                            line-height: 68px;
                            &::-webkit-input-placeholder{
                                color: #222222;
                            }
                        }
                        &.is-disabled{
                            .el-input__inner{
                                background-color:#f0f0f0;
                                border:1px solid;
                                border-color:#8d8d8d;
                                border-radius:2px;
                                color: #999999;
                                &::-webkit-input-placeholder{
                                    color: #999999;
                                }
                            }
                        }
                    }
                }
                .edit-trdacct{
                    color: #3b6aff;
                    font-size: 24px;
                    margin-left: 15px;
                    display: flex;
                    align-items: center;
                }
            }
            >:not(:last-child){
                border-bottom:4px dotted;
                border-color:#eaeaea;;
            }
        }
    }
}
.el-select-dropdown{
    .el-scrollbar{
        .el-select-dropdown__wrap{
            .el-scrollbar__view{
                .el-select-dropdown__item.trdacct-option {
                    font-size: 24px;
                    padding: 10px 20px;
                    height: auto;
                }
                .el-select-dropdown__item.trdacct-option.is-disabled {
                    opacity: 0.5;
                }
            }
        }
    }
}
</style>