<template>
    <div class="V0049-orgControllerTaxInfo">
        <div class="V0049-OCTI-header">
            <div class="V0049-OCTI-header-icon"></div>
            <div class="V0049-OCTI-header-title">{{currentRouteTitle}}</div>
            <div class="V0049-OCTI-header-button" @click="addControlTaxInfo()"><i class="V0049-OCTI-header-button-icon el-icon-plus"></i>添加</div>
        </div>
        <div class="V0049-OCTI-body">
            <ul>
                <template v-for="(controlTaxInfoItem, index) in controlTaxInfoArr">
                    <li class="V0049-OCTI-body-li" :key="index" @click="controllerClick(controlTaxInfoItem)" :class="controlTaxInfoItem.showType == '1' ? '' : 'V0049-OCTI-body-li-finish'">
                        <div class="V0049-OCTI-li-title">
                            <div class="V0049-OCTI-li-mainTitle">控制人涉税声明信息{{index + 1}}</div>
                            <div class="V0049-OCTI-li-subtitle" v-if="controlTaxInfoItem.showType != '1' && controlTaxInfoItem.TAX_RESIDENT_TYPE != '1'">控制人：{{controlTaxInfoItem.CUST_NAME || (controlTaxInfoItem.TAX_RESIDENT_TYPE == "1" && getCustomerInfo().CUST_FNAME)}}</div>
                        </div>
                        <div class="V0049-OCTI-li-status">{{controlTaxInfoItem.showType == '1' ? '点击填写资料' : '已完善'}}</div>
                        <div class="V0049-OCTI-li-icon">
                            <div class="V0049-OCTI-li-icon-delete" v-if="controlTaxInfoArr.length != 1" @click.stop="deleteControlTaxInfo(controlTaxInfoItem)"></div>
                        </div>
                        
                    </li>
                </template>
            </ul>
        </div>
    </div>
</template>
<script>
import bizPublicMethod from '@/business/businessTools/bizPublicMethod'
import storage from '../../../../tools/storage'
import defineConfig from '../../../../config/defineConfig'
import validateRules from '../../../../components/preEntry/validateRules'

export default {
    components: {
        
    },
    data() {
        return {
            controlTaxInfoArr: [],
        }
    },
    props: ["bizData", "historyData", "oppBusiData","groupDatas","groupDatasTpl"],
    computed: {
        currentRoute() {
            return this.$router.getCurrentRoute()
        },
        currentRouteTitle() {
            return this.$router.getCurrentRoute().name;
        },
        busiLogic() { //busiLogic业务逻辑数据体
            return require(`../../../businessFile/${this.qsVersionName}/${this.busiCode}/${this.busiCode}.js`).default;
        },
        busiCode() {
            return this.$store.state.busicode;
        },
        qsVersionName(){
            return this.$bizcfg.getBizConfigName(this.$definecfg.QSJGDM_CONST[this.$basecfg.qsVersion]);
        },
        userType() {
            return this.$store.state.usertype;
        },
    },
    created() {
        this.controlTaxInfoArr = _.cloneDeep(this.oppBusiData.currentControllerTaxInfo);
        if (this.controlTaxInfoArr.length == 0) {
            this.addControlTaxInfo();
        }
        this.controlTaxInfoArr = this.updateControlTaxInfoArr(this.controlTaxInfoArr, this.groupDatasTpl.CONTROLLER_TAX_INFO);
        this.$blMethod.hideRouteAndMoudle(this, "控制人涉税居民身份信息");
        this.$blMethod.hideRouteAndMoudle(this, "控制人出生/现居国家信息");
        this.$blMethod.hideRouteAndMoudle(this, "控制人税收居民国/地区信息");
    },
    pageActive(){
    },
    activated() {
        this.controlTaxInfoArr = _.cloneDeep(this.oppBusiData.currentControllerTaxInfo);
        if (this.controlTaxInfoArr.length == 0) {
            this.addControlTaxInfo();
        }
        this.controlTaxInfoArr = this.updateControlTaxInfoArr(this.controlTaxInfoArr, this.groupDatasTpl.CONTROLLER_TAX_INFO);
        this.$blMethod.hideRouteAndMoudle(this, "控制人涉税居民身份信息");
        this.$blMethod.hideRouteAndMoudle(this, "控制人出生/现居国家信息");
        this.$blMethod.hideRouteAndMoudle(this, "控制人税收居民国/地区信息");
    },
    mounted() {
    },
    watch: {
    },
    methods: {
        getCustomerInfo() {
            let customerInfo = storage.$storage.getJsonSession(defineConfig.$definecfg.CUSTOMER_INFO);
            return customerInfo;
        },
        //对控制人涉税添加不同的状态 1：待完善  2：已修改
        updateControlTaxInfoArr(controlTaxInfoArr, groupDatasTpl) {
            let newControlTaxInfoArr = _.cloneDeep(controlTaxInfoArr)
            newControlTaxInfoArr = _.each(newControlTaxInfoArr, item => {
                //根据税收居民身份 隐藏显示模块
                let groupDatas = _.cloneDeep(groupDatasTpl);
                let bdata = _.cloneDeep(item);
                
                let obj = {groupDatas: {
                    CONTROLLER_TAX_INFO: groupDatas
                }}

                let typeDefalutValue = bdata.TAX_RESIDENT_TYPE;
                let isShow = typeDefalutValue && typeDefalutValue != "1" && typeDefalutValue != "5";
                obj.groupDatas.CONTROLLER_TAX_INFO = _.each(obj.groupDatas.CONTROLLER_TAX_INFO, (controllerTaxInfoItem, moduleId) => {
                    if(moduleId == "ORG_TAX_CONTROLER_MODULE1") {
                        return true;
                    }
                    controllerTaxInfoItem = _.each(controllerTaxInfoItem, info => {
                        info.MODULE_CONTROL = isShow ? "1" : "0"
                    })
                })

                bizPublicMethod.$blMethod.parseGroupsMouduleData(obj,[
                    "ORG_TAX_CONTROLER_MODULE1",
                    "ORG_TAX_CONTROLER_MODULE2",
                    "ORG_TAX_CONTROLER_MODULE3",
                    "ORG_TAX_CONTROLER_MODULE4",
                ],bdata);            
                let countryInfoArr =  bizPublicMethod.$blMethod.transTaxInfoToArr(bdata);
                countryInfoArr = _.map(countryInfoArr, countryInfoItem => {
                    if (countryInfoItem.OPP_NO_TAXPAYERID_REASON == "1") {
                        countryInfoItem.NO_TAXPAYERID_REASON = ""
                    }
                    return countryInfoItem;
                })
                bizPublicMethod.$blMethod.parseMoudleArray(obj, obj.groupDatas.CONTROLLER_TAX_INFO["ORG_TAX_CONTROLER_MODULE5"], countryInfoArr);

                //现居国家是否为中国 为中国则把省市区打开
                let ORG_TAX_CONTROLER_MODULE4 = obj.groupDatas.CONTROLLER_TAX_INFO.ORG_TAX_CONTROLER_MODULE4[0].FIELDS || {};
                let isChina = ORG_TAX_CONTROLER_MODULE4.NATION_ENG.DEFAULT_VALUE == "CN";
                ORG_TAX_CONTROLER_MODULE4.PROVINCE.FIELD_CONTROL = isChina ? "0" : "1";
                ORG_TAX_CONTROLER_MODULE4.CITYCN.FIELD_CONTROL = isChina ? "0" : "1";
                ORG_TAX_CONTROLER_MODULE4.DISTRICT_NAME.FIELD_CONTROL = isChina ? "0" : "1";

                item.showType = this.updateControlTaxIsshowType(obj.groupDatas);
            })
            return newControlTaxInfoArr;
        },
        //控制人涉税判断是否 有待完善以及修改
        updateControlTaxIsshowType(controlTaxGroupDatas) {
            let isShowType = "0"; // 0：不需要修改  1：待完善  2：已修改 3：驳回
            let moduleIdArr = ["ORG_TAX_CONTROLER_MODULE1", "ORG_TAX_CONTROLER_MODULE2", "ORG_TAX_CONTROLER_MODULE3", "ORG_TAX_CONTROLER_MODULE4", "ORG_TAX_CONTROLER_MODULE5"];
            //1.检验是否存在 必填 不隐藏 值为空的字段 存在则检验不通过 返回false 不存在则校验通过 返回false
            let validateFieldDefault = (moduleIdArr, newGroupDatas) => {
                let flag = true;
                _.each(moduleIdArr, moduleId => {
                    let newModuleData = _.get(newGroupDatas, "CONTROLLER_TAX_INFO." + moduleId, []);
                    if (!flag) {
                        return false;
                    }
                    _.each(newModuleData, moduleInfo => {
                        if (!flag) {
                            return false;
                        }
                        _.each(moduleInfo.FIELDS, field => {
                            //模块需要为显示状态
                            if (moduleInfo.MODULE_CONTROL == "1" && field.FIELD_REQUIRED == "1" && field.FIELD_CONTROL != "1" && _.isEmpty(field.DEFAULT_VALUE)) {
                                flag = false;
                                return false
                            }
                            //字段检验规则是否通过
                            if (!this.validateField(field)) {
                                flag = false;
                                return false;
                            }
                        })
                    })
                })
                return flag;
            }
            //对所有模块进行校验对比 决定isShowType展示的状态
            //检验必填是否为空
            if (!validateFieldDefault(moduleIdArr, controlTaxGroupDatas)) {
                isShowType = "1";
                return isShowType;
            }
            return isShowType;
        },
        //校验字段规则
        validateField(field){
            //某些组件不校验规则
            if (["date"].indexOf(field.FIELD_TYPE) > -1) {
                return true
            }
            //非必填不校验 且 值为空
            if (field.FIELD_REQUIRED == "0" && !field.DEFAULT_VALUE || field.FIELD_CONTROL == "1") {
                return true;
            }
            let separator = field.VALID_TYPE && field.VALID_TYPE.indexOf(";") !== -1 ? ";" : "|";
            let validCfgs = field.VALID_TYPE && field.VALID_TYPE.split(separator) || [],
                value = _.trim(field.DEFAULT_VALUE);
            let exclude = ['on-blur', 'on-prompt','on-change','normalinput', 'ignoreDiff','text'];
                validCfgs = validCfgs.filter( item => !exclude.includes(item));

            if(!value){
                return true;
            }
            //是否有传校验类型
            if(!validCfgs){
                return true;
            }
            var flag = true;
            if (field.FIELD_TYPE.indexOf("telephone") > -1 && _.isEmpty(validCfgs)) {
                let telList = value.split('-');
                let TEL_CODE = telList.pop(),
                AREA_CODE = telList.pop(),
                TEL_QUHAO = telList.pop();
                if (_.isEmpty(AREA_CODE) || _.isEmpty(TEL_CODE)) {
                    flag = false;
                } else {
                    let rule = validateRules["num"];
                    let areaCodeIsPass = rule.valid(AREA_CODE, [3,5]);
                    let telCodeIsPass = true;
                    //有区号有电话
                    let telLength = AREA_CODE.length + TEL_CODE.length;
                    if (AREA_CODE && TEL_CODE && (telLength < 10 ||telLength > 16)) {
                        telCodeIsPass = false;
                    }
                    flag = telCodeIsPass && areaCodeIsPass;
                }
            }
            while (validCfgs[0]) {
                let result = /([a-zA-Z_]+)(.*)/.exec(validCfgs.shift());
                let rule = validateRules[result[1]];
                var param = eval(result[2]);
                if (_.isEmpty(rule)) {
                    console.log("校验规则为空---" + result[1]);
                    return true
                }
                let isPass = rule.valid(value,param);
                if(!isPass){ //校验不通过
                    flag = false;
                    break;
                }; 
                flag = true;
            }
            return flag;
        },
        getNewControlTaxInfo() {
            return {
                CTRL_NO: "",
                TAX_RESIDENT_TYPE: "",
                CTRL_NON_RESIDENT: "",
                CTRL_TYPE: "",
                CUST_NAME: "",
                CTRL_SHARE_RATIO: "",
                NAME_ENG: "",
                SURNAME_ENG: "",
                ADDRESS_ENG: "",
                CITY_ENG: "",
                PROVINCE_ENG: "",
                NATION_ENG: "",
                DISTRICT_NAME: "",
                PROVINCE: "",
                CITYCN: "",
                ADDRESS: "",
                BIRTH_ADDRESS_ENG: "",
                BIRTH_CITY_ENG: "",
                BIRTH_PROVINCE_ENG: "",
                BIRTH_NATION_ENG: "",
                BIRTH_ADDRESS: "",
                BIRTHDAY: "",
                BIRTH_COUNTRY: "",
                CITIZENSHIP: "",
                CITIZENSHIP2: "",
                CITIZENSHIP3: "",
                DIFF_INFO: [],
                HAS_TAXPAYER_IDNO: "",
                HAS_TAXPAYER_IDNO2: "",
                HAS_TAXPAYER_IDNO3: "",
                LIVING_COUNTRY: "",
                NO_TAXPAYERID_REASON: "",
                NO_TAXPAYERID_REASON2: "",
                NO_TAXPAYERID_REASON3: "",
                OPP_NO_TAXPAYERID_REASON: "",
                OPP_NO_TAXPAYERID_REASON2: "",
                OPP_NO_TAXPAYERID_REASON3: "",
                TAXPAYER_IDNO: "",
                TAXPAYER_IDNO2: "",
                TAXPAYER_IDNO3: "",
            }
        },
        addControlTaxInfo: function () {
            let listTypeNot = _.find(this.controlTaxInfoArr, {showType: "1"});
            if (!_.isEmpty(listTypeNot)) {
                this.messageBox({
                    hasMask:true,
                    messageText: "存在待完善的控制人涉税信息，不能添加新的控制人涉税信息",
                    confirmButtonText:'确定',
                    typeMessage:'warn', 
                    showMsgBox:true
                })
                return;
            }
            let oldControlTaxInfo = _.cloneDeep(_.get(this.oppBusiData, "oldBusiData.CONTROLLER_TAX_INFO", {}));
            let ctrlNoArr = _.map(_.cloneDeep(this.controlTaxInfoArr), arrItem => {
                return arrItem.CTRL_NO * 1;
            }) || [];
            //将历史数据的 CTRL_NO也添加进来 防止删除 之后 重新从1开始
            ctrlNoArr = _.concat([], ctrlNoArr, _.map(_.cloneDeep(oldControlTaxInfo), oldControlTaxInfoItem => {
                return oldControlTaxInfoItem.CTRL_NO * 1
            }) || []);
            let newCtrlNo = (_.max(ctrlNoArr) || 0) + 1;
            this.controlTaxInfoArr.push( _.assign({}, this.getNewControlTaxInfo(), {CTRL_NO: newCtrlNo + "", showType: "1"}));
            
        },
        deleteControlTaxInfo: function (controlTaxInfoItem) {
            this.controlTaxInfoArr =_.filter(this.controlTaxInfoArr, controlTaxInfoItemTpl => {
                return controlTaxInfoItemTpl.CTRL_NO != controlTaxInfoItem.CTRL_NO;
            });
            let isOpenAcct = this.$storage.getSession(this.$definecfg.IS_OPEN_ACCT_BIZ) || "";
            if (isOpenAcct != "0") {
                this.oppBusiData.controlTaxInfoDeleteArr = _.concat([], _.cloneDeep(this.controlTaxInfoDeleteArr ), [_.cloneDeep(controlTaxInfoItem)])
            } else {
                this.oppBusiData.currentControllerTaxInfo = _.filter(this.oppBusiData.currentControllerTaxInfo, currentControllerTaxInfoItem => {
                    return currentControllerTaxInfoItem.CTRL_NO != controlTaxInfoItem.CTRL_NO;
                })
            }
        },
        controllerClick: function (taxInfoItem) {
            //清空原本控制人的数据
            this.custTaxInfoModuleParseOppBiz(taxInfoItem);
            this.$blMethod.showRouteAndMoudle(this, "控制人涉税居民身份信息");
            this.$router.goRoute("控制人涉税居民身份信息");
        },
        /**
         *custTaxInfoModuleParseOppBiz 重新加载转换之后的历史数据
        * @param _this
        */
        custTaxInfoModuleParseOppBiz: function (bdata) {
            bizPublicMethod.$blMethod.parseGroupsMouduleData(this,[
                "ORG_TAX_CONTROLER_MODULE1",
                "ORG_TAX_CONTROLER_MODULE2",
                "ORG_TAX_CONTROLER_MODULE3",
                "ORG_TAX_CONTROLER_MODULE4",
            ],bdata);            
            let countryInfoArr =  bizPublicMethod.$blMethod.transTaxInfoToArr(bdata);
            countryInfoArr = _.map(countryInfoArr, countryInfoItem => {
                if (countryInfoItem.OPP_NO_TAXPAYERID_REASON == "1") {
                    countryInfoItem.NO_TAXPAYERID_REASON = ""
                }
                return countryInfoItem;
            })
            bizPublicMethod.$blMethod.parseMoudleArray(this, this.groupDatas.CONTROLLER_TAX_INFO["ORG_TAX_CONTROLER_MODULE5"], countryInfoArr);
            if (_.isEmpty(countryInfoArr)) {
                let ORG_TAX_CONTROLER_MODULE5 = this.groupDatas.CONTROLLER_TAX_INFO.ORG_TAX_CONTROLER_MODULE5[0].FIELDS;
                ORG_TAX_CONTROLER_MODULE5 = _.each(ORG_TAX_CONTROLER_MODULE5, ORG_TAX_CONTROLER_MODULE5Item => {
                    ORG_TAX_CONTROLER_MODULE5Item.DEFAULT_VALUE = "";
                })
            }

            //现居国家是否为中国 为中国则把省市区打开
            let ORG_TAX_CONTROLER_MODULE4 = this.groupDatas.CONTROLLER_TAX_INFO.ORG_TAX_CONTROLER_MODULE4[0].FIELDS || {};
            let isChina = ORG_TAX_CONTROLER_MODULE4.NATION_ENG.DEFAULT_VALUE == "CN";
            ORG_TAX_CONTROLER_MODULE4.PROVINCE.FIELD_CONTROL = isChina ? "0" : "1";
            ORG_TAX_CONTROLER_MODULE4.CITYCN.FIELD_CONTROL = isChina ? "0" : "1";
            ORG_TAX_CONTROLER_MODULE4.DISTRICT_NAME.FIELD_CONTROL = isChina ? "0" : "1";
        },
        validate: (_this) => {
            let controlTaxInfoArr = _.cloneDeep(_this.$refs.V0049_orgControllerTaxInfo.controlTaxInfoArr);
            let fn = () => {
                _this.messageBox({
                    hasMask:true,
                    messageText: "存在待完善的控制人涉税信息，不能保存控制人涉税信息",
                    confirmButtonText:'确定',
                    typeMessage:'warn', 
                    showMsgBox:true
                })
            }
            
            if (_.isEmpty(controlTaxInfoArr)) {
                fn();
                return false;
            }
            let findControlTaxInfoItemOne = _.find(controlTaxInfoArr, {showType: "1"});
            if (!_.isEmpty(findControlTaxInfoItemOne)) {
                fn();
                return false;
            }
        },
        beforeSave: (_this, params) => {
            return Promise.all([
                _this.$refs.V0049_orgControllerTaxInfo.busiLogic.bizOrgControllerTaxInfoNodeBeforeSave(_this, params, true)
            ])
        },
        afterSave: (_this) => {
            let fromName = _this.$router.getCurrentRoute().fromName;
            _this.$router.goRoute("信息列表", {fromName: fromName});
            return false;
        }
    },
}
</script>
<style lang="less" scoped>
.V0049-orgControllerTaxInfo {
    padding: 0px 31px 10px 37px;
    .V0049-OCTI-header {
        display: flex;
        width: 100%;
        align-items: center;
        .V0049-OCTI-header-icon {
            width: 10px;
            height: 26px;
            background-color: #1f59db;
            border-radius: 5px;
        }
        .V0049-OCTI-header-title {
            margin-left: 12px;
            font-family:Alibaba PuHuiTi;
            font-weight:500;
            color:#1f59db;
            font-size:26px;
            line-height: 35px;
            flex: 1 0 auto;
        }
        .V0049-OCTI-header-button {
            width: 123px;
            height: 54px;
            background-color: #fff;
            border: 1px solid #506fed;
            border-radius: 2px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            color: #3b6aff;
            font-weight: 700;
            .V0049-OCTI-header-button-icon {
                font-size: 24px;
                color: #3b6aff;
                font-weight: 700;
                margin-right: 10px;
            }
        }
    }
    .V0049-OCTI-body {
        ul {
            padding: 0;
            margin: 0;
            .V0049-OCTI-body-li {
                width: 100%;
                height: 134px;
                border: 1px solid #eaeaea;
                border-radius: 4px;
                box-shadow: 0px 3px 18px rgba(0, 0, 0, 0.03);
                background-color: #fff;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: 30px;
                .V0049-OCTI-li-title {
                    flex: 1 0 auto;
                    margin-left: 55px;
                    .V0049-OCTI-li-mainTitle {
                        line-height: 35px;
                        font-family: Alibaba PuHuiTi;
                        font-weight: 700;
                        color: #252525;
                        font-size: 26px;
                    }
                    .V0049-OCTI-li-subtitle {
                        margin-top: 4px;
                        line-height: 33px;
                        font-family: Alibaba PuHuiTi;
                        color: #252525;
                        font-size: 24px;
                    }
                }
                .V0049-OCTI-li-status {
                    line-height: 35px;
                    font-family: Alibaba PuHuiTi;
                    color: #3b6aff;
                    font-size: 26px;
                }
                .V0049-OCTI-li-icon {
                    width: 122px;
                    height: 122px;
                    .V0049-OCTI-li-icon-delete {
                        width: 100%;
                        height: 100%;
                        background: url("~@icons/yinheVTM/icon-area-del-normal.svg") no-repeat;
                        background-size: 100% 100%;
                    }
                }
                &.V0049-OCTI-body-li-finish {
                    background-color: #f7f7fa;
                }
            }
            
        }
        
    }
}
</style>
