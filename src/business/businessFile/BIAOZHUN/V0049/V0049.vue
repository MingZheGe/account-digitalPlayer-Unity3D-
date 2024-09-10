<template>
    <div class="openList">
        <div class="openList-content">
            <div class="title-border"></div>
            <div class="title">请选择需要修改的信息</div>
            <ul class="right-ul">
                <template v-for="(item, index) in currentInfoList">
                    <div :key="index" @click="clickItem(index)" v-if="!item.isHide">
                        <li class="right-li" :key="index" :class="busiStatusType[item.isShowType].style">
                            <div class="li-img"><img :src="busiStatusType[item.isShowType].style == 'current' ? item.img_blue : item.img_grad"></div>
                            <div class="li-info">
                                <p class="name" :class=" currentStep =='5'&& index=='6' ? '' : 'name-funture'">{{item.name}}</p>
                                <p class="desc">{{item.desc}}</p>
                            </div>
                            <div class="tip">{{busiStatusType[item.isShowType].text}}</div>
                        </li>
                    </div>
                </template>
            </ul>
        </div>
        <div class="footer">
            <el-button type="primary" :disabled="buttonDisabled"  @click="nextStep">修改完成</el-button>
        </div>
    </div>
</template>
<script>
import bizPublicSaveMethod from '../../../businessTools/bizPublicSaveMethod'
import date from '../../../../tools/date.js'
import validateRules from '../../../../components/preEntry/validateRules'
import dict from '../../../../tools/dict';
import custService from '../../../../service/cust-service'
import bizPublicMethod from "../../../businessTools/bizPublicMethod"
export default {
    components: {

    },
    data() {
        return {
            buttonDisabled: false,
            currentStep: 0,
            busiStatusType: [{text: "", style: "current"}, {text: "待完善", style: "improving"}, {text: "已修改", style: "modified"}, {text: "驳回", style: "reject"}],
            currentInfoList: [],
            infoList: [
                //个人
                [{
                    img_blue: require("../../../../icons/openList/ic/icon-open-baseinfo.svg"),
                    img_grad: require("../../../../icons/openList/ic/icon-open-baseinfo-gray.svg"),
                    name: "证件信息",
                    desc: "姓名、证件类型、证件号码、证件有效期等",
                    isShowType: 0,  // 0：不需要修改  1：待完善  2：已修改 3：驳回
                    ygt_module: "CUST_INFO_MODIFY_CARD" //业务审核模块配置(对应一柜通的审核模块)
                },
                {
                    img_blue: require("../../../../icons/openList/ic/icon-open-otherinfo.svg"),
                    img_grad: require("../../../../icons/openList/ic/icon-open-otherinfo-gray.svg"),
                    name: "基本信息",
                    desc: "学历、职业、年均收入、诚信记录等",
                    isShowType: 0,
                    ygt_module: "CUST_INFO_MODIFY"
                },
                {
                    img_blue: require("../../../../icons/openList/ic/icon-open-phoneinfo.svg"),
                    img_grad: require("../../../../icons/openList/ic/icon-open-phoneinfo-gray.svg"),
                    name: "联系信息",
                    desc: "手机号码、联系地址、邮政编码、联系人信息",
                    isShowType: 0,
                    ygt_module: "CUST_INFO_MODIFY_LINK"
                },
                {
                    img_blue: require("../../../../icons/openList/ic/icon-open-control.svg"),
                    img_grad: require("../../../../icons/openList/ic/icon-open-control-gray.svg"),
                    name: "关联人信息",
                    desc: "实际控制人、受益人",
                    isShowType: 0,
                    ygt_module: "CUST_INFO_MODIFY_RELA"
                },
                {
                    img_blue: require("../../../../icons/openList/ic/icon-open-tax.svg"),
                    img_grad: require("../../../../icons/openList/ic/icon-open-tax-gray.svg"),
                    name: "涉税信息",
                    desc: "涉税居民身份信息",
                    isShowType: 0,
                    isHide: false, // 是否隐藏整个信息
                    ygt_module: "CUST_INFO_MODIFY_ADEQ"
                }]
            ]
        }
    },
    //bizData 是流水数据可读写，用作保存流水  historyData是历史数据，只读 oppBusiData用作中转挂载数据
    props: ["bizData", "historyData", "oppBusiData","groupDatas"],
    computed: {
        customerInfo() {
            return this.$storage.getJsonSession( this.$definecfg.CUSTOMER_INFO )
        },
        fromName() {
            return this.$route.query.fromName;
        },
        bizRouteTable() {
            return this.$store.state.bizRouteTable;
        },
        userType() {
            return this.$store.state.usertype;
        },
        qsVersionName(){
            return this.$bizcfg.getBizConfigName(this.$definecfg.QSJGDM_CONST[this.$basecfg.qsVersion]);
        },
        busiCode() {
            return this.$store.state.busicode;
        },
        busiLogic() { //busiLogic业务逻辑数据体
            return require(`../../../businessFile/${this.qsVersionName}/${this.busiCode}/${this.busiCode}.js`).default;
        },
        updateRouteTableFlag(){
            return this.$store.state.updateRouteTableFlag
        },
        isRejcet(){
            return this.$storage.getSession(this.$definecfg.IS_REJECT);
        }
    },
    created() {
        let rejectModuleInfo = this.$storage.getJsonSession(this.$definecfg.REJECT_MODULE_INFO);
        Promise.all([
            this.busiLogic.bizCustBasicInfoNodePageActivated(this),
            this.busiLogic.bizCustLinkInfoNodePageActivated(this),
            this.busiLogic.bizActualControllerNodePageActivated(this),
            this.busiLogic.bizCustOtherLinkNodePageActivated(this),
            this.busiLogic.bizCustBeneficiaryInfoNodePageActivated(this),
            this.busiLogic.bizProCreditRecordInfoPageActived(this),
            this.busiLogic.bizCustTaxInfoNodePageActivated(this)
        ]).then( ()=> {
            this.oppBusiData.copyCurrentGroupData = _.cloneDeep(this.groupDatas);
            let newInfoList = _.cloneDeep(this.infoList[this.userType]);
            newInfoList = this.taxInfoHide(newInfoList);
            //通过名字取出路由配置里的所有groupid和moduleid
            _.map(newInfoList, info => {
                _.each(this.bizRouteTable, item => {
                    if ( info.name == item.fromName ) {
                        info.groupId = item.group;
                        info.moduleIdArr = _.concat([], info.moduleIdArr || [], item.modules);
                    }
                });
                //更新
                info.isShowType = this.updateIsshowType(info, this.filterModuleId(info.groupId, info.moduleIdArr));
                if(this.isRejcet == "1" && !_.isEmpty(rejectModuleInfo) && rejectModuleInfo[info.ygt_module]){
                    info.isShowType = 3;
                }
                return info
            })
            this.currentInfoList = newInfoList;
        })
    },
    pageActive(){
    },
    activated() {
        let rejectModuleInfo = this.$storage.getJsonSession(this.$definecfg.REJECT_MODULE_INFO);
        if (this.historyData.CURRENT_STEP) {
            this.currentStep = parseInt(this.historyData.CURRENT_STEP);
        } else {
            this.currentStep = 0;
        }
        if (this.fromName) {
            let newInfoList = _.cloneDeep(this.currentInfoList);
            newInfoList = this.taxInfoHide(newInfoList);
            _.map(newInfoList, info => {
                info.isShowType = this.updateIsshowType(info, this.filterModuleId(info.groupId, info.moduleIdArr));
                if(this.isRejcet == "1" && !_.isEmpty(rejectModuleInfo) && rejectModuleInfo[info.ygt_module]){
                    info.isShowType = 3;
                }
                return info;
            })
            this.currentInfoList = newInfoList;
        }
    },
    mounted() {
        if (this.historyData.CURRENT_STEP) {
            this.currentStep = parseInt(this.historyData.CURRENT_STEP);
        } else {
            this.currentStep = 0;
        }
    },
    watch: {
        currentInfoList(newVal) {
            // if (!_.isEmpty(this.getShowTypeTwo(newVal))) {
            //     this.buttonDisabled = false;
            // }
            this.buttonDisabled = false;
            if (!_.isEmpty(this.getShowTypeOneOrThree(newVal))) {
                this.buttonDisabled = true;
            }
        }, 
    },
    methods: {
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
            if (field.FIELD_TYPE.indexOf("telephone") > -1 && (_.isEmpty(validCfgs) || validCfgs.indexOf("tel") > -1)) {
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
                    if (!_.isEmpty(validCfgs)) {
                        telCodeIsPass = rule.valid(TEL_CODE, [7,8]);
                    } else {
                        //有区号有电话
                        let telLength = AREA_CODE.length + TEL_CODE.length;
                        if (AREA_CODE && TEL_CODE && (telLength < 10 ||telLength > 16)) {
                            telCodeIsPass = false;
                        }
                    }
                    flag = telCodeIsPass && areaCodeIsPass;
                }
                return flag;
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
        //涉税信息是否隐藏
        taxInfoHide (newInfoList) {
            //判断涉税是否隐藏
            let newInfoListTpl = _.cloneDeep(newInfoList);
            let bizRouteTableTpl = _.cloneDeep(this.bizRouteTable);
            let isHide = true;
            _.each(bizRouteTableTpl, item => {
                if (item.fromName == "涉税信息" && item.show) {
                    isHide = false;
                    return false;
                }
            })
            newInfoListTpl = _.map(newInfoListTpl, item => {
                if (item.name == "涉税信息") {
                    item.isHide = isHide;
                }
                return item;
            })
            return newInfoListTpl;
        },
        //获取已修改
        getShowTypeTwo(val) {
            return _.find(val, item => {return item.isShowType == "2"})
        },
        //获取待完善以及驳回的
        getShowTypeOneOrThree(val) {
            return _.find(val, item => {return item.isShowType == "1" || item.isShowType == "3"})
        },
        //过滤路由隐藏了的moduleid
        filterModuleId (groupId, moduleIdArr) {
            let routeTable =  _.filter(this.bizRouteTable, item => {return item.group == groupId});
            let newModuleIdArr = _.cloneDeep(moduleIdArr);
            _.each(routeTable, routeItem => {
                if (!routeItem.show) {
                    newModuleIdArr = _.difference(newModuleIdArr, routeItem.modules);
                }
            })
            return newModuleIdArr;
        },
        //获取更新需要展示的状态
        updateIsshowType (info, moduleIdArr) {
            let groupId = info.groupId;
            let isShowType = 0; // 0：不需要修改  1：待完善  2：已修改 3：驳回
            let oldGroupDatas = _.cloneDeep(this.oppBusiData.oldGroupDatas);
            let newGroupDatas = _.cloneDeep(this.groupDatas);
            let moduleAllFieldInfo = {};//当前模块字段所有default_value数据
            let RISK_FACTOR = this.oppBusiData.oldBusiData.RISK_FACTOR || "";

            //校验证件有效日期
            let validateIdData = () => {
                if (moduleIdArr.indexOf("CUST_CARD_INFO") > -1) {
                    if (!this.busiLogic.checkIdExpDate(this) || !this.busiLogic.checkIdBegDate(this) || !this.busiLogic.checkIdCardDate(this)) {
                        return false;
                    }
                }
                return true;
            }
            //校验证件类型是否规范 不规范则显示待完善
            let validateIdTypeInvalid = () => {
                if (moduleIdArr.indexOf("CUST_CARD_INFO") > -1) {
                    if (!this.busiLogic.checkUpdateIdtype(this)) {
                        return false;
                    }
                }
                return true;
            }
            //校验风险因素位33和34地址是否规范 只要地址不规范就显示待完善
            //(RISK_FACTOR.indexOf("P") > -1 || RISK_FACTOR.indexOf("O") > -1)
            let validateC33ORC34 = () => {
                if (moduleIdArr.indexOf("CUST_LINK_INFO") > -1) {
                    if (!this.busiLogic.checkAddress(this)) {
                        return false;
                    }
                }
                return true;
            }
            //自动校验客户手机号码是否已登记在其他三要素不同的客户代码下（1个以上），若是且未有对应的反洗钱信息备注的；
            let validateMobile = () => {
                let MOBILE_CONFORM_SELECT = _.get(this.groupDatas, "LINK_INFO.CUST_LINK_INFO[0].FIELDS.MOBILE_CONFORM_SELECT.DEFAULT_VALUE", "");
                if (moduleIdArr.indexOf("CUST_LINK_INFO") > -1) {
                    if (!this.busiLogic.checkMobileDetail(this) && MOBILE_CONFORM_SELECT != "1") {
                        return false;
                    }
                }
                return true;
            }
            //自动校验联系地址与开户营业部是否在一个省份，若否且未有对应的反洗钱信息备注的
            let validateAddress = () => {
                let ADDRESS_CONFORM_SELECT_VALUE = _.get(this.groupDatas, "LINK_INFO.CUST_LINK_INFO[0].FIELDS.ADDRESS_CONFORM_SELECT.DEFAULT_VALUE", "");
                if (moduleIdArr.indexOf("CUST_LINK_INFO") > -1) {
                    if (!this.busiLogic.checkAddressDetail(this) && ADDRESS_CONFORM_SELECT_VALUE != "1") {
                        return false;
                    }
                }
                return true;
            }
            //校验证件信息是否待完善
            let validateCardInfo = () => {
                return this.busiLogic.bizCustBasicInfoNodeCheckModule(this, moduleIdArr);
            }
            //校验联系信息是否待完善
            let validateLinkInfo = () => {
                return this.busiLogic.bizCustLinkInfoNodeCheckModule(this, moduleIdArr);
            }
            //校验受益人是否待完善
            let validateBeneficiaryInfo = () => {
                return this.busiLogic.bizCustBeneficiaryInfoNodeCheckModule(this, moduleIdArr);
            }
            //校验控制人是否待完善
            let validateControlerInfo = () => {
                return this.busiLogic.bizActualControllerNodeCheckModule(this, moduleIdArr);
            }
            //1.检验是否存在 必填 不隐藏 值为空的字段 存在则检验不通过 返回false 不存在则校验通过 返回false
            //2.将字段所对应的值取出来保存在moduleAllFieldInfo中
            let validateFieldDefault = (moduleIdArr, newGroupDatas) => {
                let flag = true;
                _.each(moduleIdArr, moduleId => {
                    let arr = [];
                    let newModuleData = _.get(newGroupDatas, groupId + "." + moduleId, []);
                    if (!flag) {
                        return false;
                    }
                    _.each(newModuleData, moduleInfo => {
                        if (!flag) {
                            return false;
                        }
                        let obj = {};
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
                            obj[field.FIELD_ID] = field.DEFAULT_VALUE;
                            if (field.FIELD_TYPE == "addressInput") {
                                obj[field.FIELD_ID] = field.newAddressVal ||  field.DEFAULT_VALUE;
                            }
                        })
                        obj.MODULE_SEQ = moduleInfo.MODULE_SEQ;
                        obj.MODULE_CONTROL = moduleInfo.MODULE_CONTROL;
                        arr.push(obj);
                    })
                    moduleAllFieldInfo[moduleId] = arr;
                })
                return flag;
            }
            //新老数据 对比 模块里的字段是否修改了数值
            let compareModule = (oldModuleData, newModuleData, moduleId) => {
                //不做对比字段
                let ignoreFieldArr = ["VOCATION_CONFORM"];
                let controlIgnoreFieldArr = ["CONTROLER_ID_EXP_DATE", "CONTROLER_TEL", "CONTROLER_EMAIL", "NATION", "OCCU_TYPE", "ZIP_CODE", "CONTROLER_SEX", "REG_DATE", "REG_ADDR"];
                let beneficiaryFieldArr = ["BENEFICIARY_EXP_DATE", "BENEFICIARY_TEL", "EMAIL", "NATION", "OCCU_TYPE", "ZIP_CODE", "SEX", "BIRTHDAY", "BENEFICIARY_ADDR"];
                let flag = true;
                _.each(oldModuleData, moduleInfo => {
                    if (!flag) {
                        return false;
                    }
                    let obj = {};
                    _.each(moduleInfo.FIELDS, field => {
                        obj[field.FIELD_ID] = field.DEFAULT_VALUE;
                        if (field.FIELD_TYPE == "addressInput") {
                            obj[field.FIELD_ID] = field.newAddressVal ||  field.DEFAULT_VALUE;
                        }
                    })
                    obj.MODULE_SEQ = moduleInfo.MODULE_SEQ;
                    obj.MODULE_CONTROL = moduleInfo.MODULE_CONTROL;
                    
                    let newObj = _.find(moduleAllFieldInfo[moduleId], item => {
                        return item.MODULE_SEQ == obj.MODULE_SEQ;
                    }) || {}
                    //两个模块都隐藏
                    if (newObj.MODULE_CONTROL == "0" && obj.MODULE_CONTROL == "0") {
                        return true;
                    }
                    let oneObj = _.cloneDeep(newObj);
                    let twoObj = _.cloneDeep(obj);
                    oneObj.MODULE_SEQ = "";
                    oneObj.MODULE_CONTROL = "";
                    twoObj.MODULE_SEQ = "";
                    twoObj.MODULE_CONTROL = "";
                    if (ignoreFieldArr.length > -1) {
                        _.each(ignoreFieldArr, item => {
                            delete oneObj[item];
                            delete twoObj[item];
                        })
                    }
                    //控制人
                    if (moduleInfo.MODULE_ID == "CUST_CONTROLER_INFO") {
                        _.each(controlIgnoreFieldArr, item => {
                            delete oneObj[item];
                            delete twoObj[item];
                        })
                    }
                    //受益人
                    if (moduleInfo.MODULE_ID == "CUST_BENEFICIARY_INFO") {
                        _.each(beneficiaryFieldArr, item => {
                            delete oneObj[item];
                            delete twoObj[item];
                        })
                    }
                    let isSame = _.isEqual(oneObj, twoObj)
                    if (!isSame) {
                        flag = false;
                        return false;
                    }
                })
                return flag;
            }
            //对所有模块进行校验对比 决定isShowType展示的状态
            if (!validateIdData()) {
                isShowType = 1;
                return isShowType;
            }
            if (!validateIdTypeInvalid()) {
                isShowType = 1;
                return isShowType;
            }
            if (!validateAddress()) {
                isShowType = 1;
                return isShowType;
            }
            if (!validateMobile()) {
                isShowType = 1;
                return isShowType;
            }
            if (!validateC33ORC34()) {
                isShowType = 1;
                return isShowType;
            }
            //校验证件信息
            if (!validateCardInfo()) {
                isShowType = 1;
                return isShowType;
            }
            //校验联系信息
            if(!validateLinkInfo()) {
                isShowType = 1;
                return isShowType;
            }
            //校验受益人
            if (!validateBeneficiaryInfo()) {
                isShowType = 1;
                return isShowType;
            }
            //检验控制人和受益人是否为本人
            if (!validateControlerInfo()) {
                isShowType = 1;
                return isShowType;
            }
            //检验必填是否为空
            if (!validateFieldDefault(moduleIdArr, newGroupDatas)) {
                isShowType = 1;
                return isShowType;
            }
            _.each(moduleIdArr, moduleId => {
                let oldModuleData = _.get(oldGroupDatas, groupId + "." + moduleId, []);
                let newModuleData = _.get(newGroupDatas, groupId + "." + moduleId, []);
                //模块数组长度是否一样
                if (oldModuleData.length != newModuleData.length) {
                    isShowType = 2;
                    return false
                }
                //模块字段的值是否一样
                if (!compareModule(oldModuleData, newModuleData, moduleId)) {
                    isShowType = 2;
                    return false;
                }
            })
            
            
            return isShowType;
        },
        clickItem(index){
            switch(index) {
                case 0: {
                    this.$router.goRoute('证件信息')
                }
                break;
                case 1: {
                    this.$router.goRoute('基本信息')
                }
                break;
                case 2: {
                    this.$router.goRoute('联系信息')
                }
                break;
                case 3: {
                    this.$router.goRoute('关联人信息')
                }
                break;
                case 4: {
                    this.$router.goRoute('税收居民身份')
                }
                break;
                default:
                    break;
            }
        },
        async validate(_this) {
            let that = _this.$refs.V0049;
            let currentInfoListTpl = _.cloneDeep(that.currentInfoList);
            let hasOneType =  that.getShowTypeOneOrThree(currentInfoListTpl);
            let hasTwoType = that.getShowTypeTwo(currentInfoListTpl);
            if (!_.isEmpty(hasOneType)) {
                alert("有待完善或者驳回的模块");
                return false;
            }
            //黑名单校验
            let custCardInfo = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "CUST_CARD_INFO");
            let userInfo = _this.$storage.getJsonSession(_this.$definecfg.USER_INFO);
            let isInBlackListParmas = {
                USER_NAME: custCardInfo.CUST_FNAME,
                ID_TYPE: custCardInfo.ID_TYPE,
                ID_CODE: custCardInfo.ID_CODE,
                F_CUST_ORG_CODE: userInfo.ORG_CODE || ""
            }
            let isInBlackListFn = await custService.isInBlackList(isInBlackListParmas);
            let idTypeDict = await dict.getDictData("ID_TYPE");
            let blackInfo = [];
            if (!_.isEmpty(isInBlackListFn) && (isInBlackListFn.CHECK_RESULT == "1" || isInBlackListFn.CHECK_RESULT == "2")) {
                _this.oppBusiData.flowTurnflag = "1";
                let info = Object.assign(isInBlackListFn, {
                    blackType: "客户基本信息",
                    USER_FNAME: isInBlackListFn.USER_FNAME || isInBlackListFn.USER_NAME,
                    ID_TYPE_TEXT: bizPublicMethod.$blMethod.getDictValueByKey(idTypeDict.ID_TYPE, isInBlackListFn.ID_TYPE),
                })
                blackInfo.push(info);
            } else {
                _this.oppBusiData.flowTurnflag = "0";
            }
            _this.oppBusiData.blackInfo = blackInfo;
            let promiseMonthFlag = true;
            //客户的证件结束日期与证件开始日期做比对，不符合以下规则，身份证：3个月、5年、10年、20年、长期；
            let CUST_CARD_INFO = _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].FIELDS; 
            let idType = _.get(CUST_CARD_INFO, "ID_TYPE.DEFAULT_VALUE", "");
            if (idType == "00") {
                let ID_BEG_DATE = _.get(CUST_CARD_INFO, "ID_BEG_DATE.DEFAULT_VALUE", "");
                let ID_EXP_DATE = _.get(CUST_CARD_INFO, "ID_EXP_DATE.DEFAULT_VALUE", "");
                let compareYearDate = date.getDifferYears(ID_BEG_DATE, ID_EXP_DATE);
                let compareMonthDate = date.getDifferMonths(ID_BEG_DATE, ID_EXP_DATE);
                let sameMonthAndDate = ID_BEG_DATE.substr(4) == ID_EXP_DATE.substr(4);
                let sameDate = ID_BEG_DATE.substr(6) == ID_EXP_DATE.substr(6);
                if (!( ID_EXP_DATE == "30001231" || 
                     (compareMonthDate == "3" && sameDate) || 
                     ((compareYearDate == "5" || compareYearDate == "10" || compareYearDate =="20") && sameMonthAndDate)
                    )) {
                    let promiseMonth = () => {
                        return new Promise( (resolve, reject) => {
                            _this.loading = false;
                            _this.messageBox({
                                hasMask:true,
                                messageText: "根据《居民身份证法》，身份证的有效期限应为3个月、5年、10年、20年或长期，请核对是否正确。",
                                confirmButtonText: "确定",
                                cancelButtonText: "取消",
                                typeMessage: "warn", 
                                showMsgBox: true,
                                confirmedAction: () => {
                                    _this.loading = true;
                                    resolve(true)
                                },
                                canceledAction: () => {
                                    resolve(false)
                                }
                            })
                        })
                    } 
                    promiseMonthFlag = await promiseMonth();
                }
            }
            
            return Promise.all([promiseMonthFlag]).then( res => {
                if (_.includes(res, false)) {
                    return false;
                }
                return true;
            })
        },
        //获取变更后的一账通信息
        getOtherTopacctinfo: (_this, params) => {
            _this.oppBusiData.otherTopacctinfo = [];
            return _this.$syscfg.K_Request("W0000119", {
                bex_codes: "YGT_A1100821",
                USER_NAME: params.USER_FNAME,
                ID_TYPE: params.ID_TYPE,
                ID_CODE: params.ID_CODE
            }).then( res => {
                let otherTopacctinfo = [];
                otherTopacctinfo = _.get(res, "Data", []);
                otherTopacctinfo = _.filter( otherTopacctinfo, otherTopacctItem => {
                    let topacctCode = _this.oppBusiData.topacctCode;
                    let topacctNo = otherTopacctItem.TOPACCT_NO || "";
                    otherTopacctItem.TOPACCT_CODE = topacctNo;
                    otherTopacctItem.CUST_CODE = otherTopacctItem.USER_CODE;
                    return !_.isEmpty(topacctNo) && topacctNo != "0" && topacctNo != topacctCode && otherTopacctItem.CUST_STATUS != 9;
                })
                return dict.transformDict(otherTopacctinfo, "CUST_STATUS").then( dictArr => {
                    _this.oppBusiData.otherTopacctinfo = dictArr;
                    _this.oppBusiData.otherTopacctCode = _.get(dictArr, "[0].TOPACCT_CODE", "");
                });
            });
        },
        async beforeSave(_this, params) {
            delete params.APPR_INFO;
            return Promise.all([
                _this.$refs.V0049.busiLogic.bizCustBasicInfoNodeBeforeSave(_this, {}),
                _this.$refs.V0049.busiLogic.bizCustLinkInfoNodeBeforeSave(_this, {}),
                _this.$refs.V0049.busiLogic.bizActualControllerNodeBeforeSave(_this, {}),
                _this.$refs.V0049.busiLogic.bizCustOtherLinkNodeBeforeSave(_this, {}),
                _this.$refs.V0049.busiLogic.bizCustBeneficiaryInfoNodeBeforeSave(_this, {}),
                _this.$refs.V0049.busiLogic.bizProCreditRecordInfoBeforeSave(_this, {}),
                _this.$refs.V0049.busiLogic.bizCustTaxInfoNodeBeforeSave(_this, {}),
            ]).then( async res => {
                let otherPrams = {};
                _.each(res, (item, key) => {
                    otherPrams = _.merge(otherPrams, item);
                    if (key == 6) {
                        otherPrams.RELA_INFO.CUST_TAX_INFO = item.RELA_INFO.CUST_TAX_INFO;
                        otherPrams.RELA_INFO.CUST_TAX_CHANGE_INFO = item.RELA_INFO.CUST_TAX_CHANGE_INFO;
                    }
                })
                let custInfo = _.assign({}, params.CUST_INFO, otherPrams.CUST_INFO);
                let relaInfo = _.assign({}, params.RELA_INFO, otherPrams.RELA_INFO);
                //模块的数据
                //没有使用到的数据
                let noUseParams = {
                    CUST_EXT_ASSETS: {},//资产信息
                    CUST_INVEST_EXPERIENCE: {},//学习经历
                    CUST_WORK_LEARNING_EXPERIENCE: {}, //投资经验
                    IS_CHANGE_FIN_WORK_TIME: "0",
                    IS_CHANGE_FIN_QUAL_CERT: "0",
                    IS_CHANGE_FIN_MANAGER_FLAG: "0",
                    ORG_CORP_QUAL_INFO:{},
                }
                //其他信息数据
                let oldCustOhterInfo = _.get(_this.oppBusiData, "oldBusiData.CUST_OTHER_INFO", {});
                let custOhterInfo = _.cloneDeep(oldCustOhterInfo);
                custOhterInfo.CRITERION = "0";
                custOhterInfo.CUST_CLS = custOhterInfo.CUST_CLS || "0";
                custOhterInfo.RISK_FACTOR = _this.oppBusiData.oldBusiData.RISK_FACTOR;
                custOhterInfo.ACCEPT_RISK_FACTOR = _this.oppBusiData.oldBusiData.RISK_FACTOR;
                // let diff = _this.$blMethod.compareInfo2(oldCustOhterInfo, custOhterInfo);
                custOhterInfo.OLD_RISK_FACTOR = _this.oppBusiData.oldBusiData.RISK_FACTOR;
                custOhterInfo.DIFF_INFO = [];
                if (oldCustOhterInfo.CRITERION != custOhterInfo.CRITERION) {
                    custOhterInfo.DIFF_INFO.push({
                        FIELD:'CRITERION',
                        NEW: custOhterInfo.CRITERION || "0",
                        OLD: oldCustOhterInfo.CRITERION || "",
                    })
                }
                if (oldCustOhterInfo.CUST_CLS != custOhterInfo.CUST_CLS) {
                    custOhterInfo.DIFF_INFO.push({
                        FIELD:'CUST_CLS',
                        NEW: custOhterInfo.CUST_CLS || "0",
                        OLD: oldCustOhterInfo.CUST_CLS || "",
                    })
                }
                Object.assign(params, {
                    CUST_OTHER_INFO: custOhterInfo,
                })

                Object.assign(params, otherPrams, {
                    CUST_INFO: custInfo,
                    RELA_INFO: relaInfo
                }, noUseParams, {
                    LINK_INFO: {
                        CUST_LINK_INFO: otherPrams.CUST_INFO.CUST_LINK_INFO,
                        CUST_OTHER_LINK_INFO: otherPrams.CUST_INFO.CUST_OTHER_LINK_INFO
                    }
                });
                //流转条件参数
                let procPrams = {
                    FLOW_TURN_FLAG: _this.oppBusiData.flowTurnflag,
                    FLOW_TURN_FLAG2: _this.oppBusiData.flowTurnflag
                }
                if (_this.oppBusiData.flowTurnflag == "0") {
                    let amlLvl = _.get(_this.oppBusiData, "oldBusiData.CUST_BASIC_INFO.AML_LVL", "");
                    if (amlLvl == "2" && (params.CHANGE_IMPORTANT_FLAG == "1" || params.ID_CODE_CHANGE_FLAG == "1")) {
                        procPrams.FLOW_TURN_FLAG = "1";
                        procPrams.FLOW_TURN_FLAG2 = "1";
                    }
                }
                Object.assign(params, procPrams);
                //信息同步数据
                let syncInfo = await this.setSyncSys(_this, params);
                Object.assign(params, syncInfo);
                this.setCsdcChangeInfo(params);
                this.setCheckCsdcAndYMT(_this, params);
                //电子签名约定书
                let isNotExsitAgmtX1 = await this.getIsNotExsitAgmtX1(_this, params);
                Object.assign(params, {
                    IS_NOT_EXSIT_AMGT_X1: isNotExsitAgmtX1
                });
                // 黑名单信息
                params.BLACK_INFO = _this.oppBusiData.blackInfo || [];
                params.IS_IN_ZD_TIME = _this.oppBusiData.IS_IN_ZD_TIME;
            })
        },
        //变更相关信息（名称、证件类型、证件号码、手机号码、证件结束日期、出生日期、性别、学历、职业、联系地址） 同步需要同步中登 展示证券账户业务申请表
        setCsdcChangeInfo(params) {
            let csdcChangeInfo = ["CUST_FNAME", "ID_TYPE", "ID_CODE", "ID_EXP_DATE", "BIRTHDAY", "SEX", "EDUCATION", "OCCU_TYPE", "MOBILE_TEL", "ADDRESS"];
            let change = [];
            let basicChnage = _.get(params, "CUST_INFO.CUST_BASIC_CHANGE_INFO.DIFF_INFO", []);
            let linkChange = _.get(params, "CUST_INFO.CUST_LINK_CHANGE_INFO.DIFF_INFO", []);
            change = _.concat([], linkChange, basicChnage);
            change = _.filter(change, changeItem => {
                return csdcChangeInfo.indexOf(changeItem.FIELD) > -1
            })
            params.CHANGE_CSDC_FLAG = "0";
            if (change.length > 0) {
                params.CHANGE_CSDC_FLAG = "1";
            }
        },
        // 判断个人 在进入7*24小时逻辑后是否需要进一步检查关联关系及一码通个数
        setCheckCsdcAndYMT(_this, params) {
            // 默认检查
            let IS_CHECK_7_24 = "1";
            // 如果
            // 1. 系统内无证券账户 
            // 2. 系统内有证券账户，但未修改姓名、证件类型、证件号码、国籍、证件有效日期、证件地址、辅助证件类型、辅助证件号码、出生日期、性别、学历、职业、手机号码、联系地址
            let csdcYmtCheckInfo = ["CUST_FNAME", "ID_TYPE", "ID_CODE", "CITIZENSHIP", "ID_EXP_DATE", "ID_ADDR", "FZ_ID_TYPE", "FZ_ID_CODE", "BIRTHDAY", "SEX", "EDUCATION", "OCCU_TYPE", "MOBILE_TEL", "ADDRESS"];
            
            let change = [];
            let basicChnage = _.get(params, "CUST_INFO.CUST_BASIC_CHANGE_INFO.DIFF_INFO", []);
            let linkChange = _.get(params, "CUST_INFO.CUST_LINK_CHANGE_INFO.DIFF_INFO", []);

            change = _.concat([], linkChange, basicChnage);
            change = _.filter(change, changeItem => {
                return csdcYmtCheckInfo.indexOf(changeItem.FIELD) > -1
            }) || []

            let sysTrdacct = _this.oppBusiData.oldBusiData.SYS_TRDACCT;
            if (_.isEmpty(sysTrdacct) || (!_.isEmpty(sysTrdacct) && change.length == 0)) {
                IS_CHECK_7_24 = "0";
            }
            // 是否检查7*24小时任务
            params.IS_CHECK_7_24 = IS_CHECK_7_24;
        },
        //判断是否禁止置灰中登一码通信息；
        getDisableCsdcFlag(_this) {
            let disableCsdcFlag = false;
            // 非中登时间，默认需要同步
            if (_this.oppBusiData.IS_IN_ZD_TIME == 'false') {
                return disableCsdcFlag;
            }
            //关联关系未确认时，需要置灰禁止同步一码通
            if (!_this.oppBusiData.parentRelationFlag) {
                disableCsdcFlag = true;
            }
            //有多个一码通时需要置灰或者没有一码通时需要置灰禁止同步一码通
            if (_.isEmpty(_this.oppBusiData.ymtData) || _this.oppBusiData.ymtData.length > 1) {
                disableCsdcFlag = true;
            }
            //客户在系统内无证券账户，需要置灰禁止同步一码通
            if (_.isEmpty(_this.oppBusiData.sysTrdacctArr) && _this.userType == "0") {
                disableCsdcFlag = true;
            }
            return disableCsdcFlag
        },
        //是否有电子签名约定书
        async getIsNotExsitAgmtX1 (_this, params) {
            let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
            return custService.getCustAgmtData(customerInfo.CUST_CODE, "X1").then( res => {
                return _.isEmpty(res) ? "1" : ""
            })
        },
        //同步信息数据处理
        async setSyncSys(_this, params) {
            params.CHANGE_IMPORTANT_FLAG_YINHE && await this.getOtherTopacctinfo(_this, params);
            let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
            let getDisableCsdcFlag = this.getDisableCsdcFlag(_this);
            let CSDC_YMT_CODE = "";
            let CUST_BASIC_INFO = params.CUST_BASIC_INFO;
            //一码通处理
            if (!getDisableCsdcFlag) {
                CSDC_YMT_CODE = _.get(_this.oppBusiData, "ymtData[0].YMT_CODE");
            }
            //一账通处理
            let CUST_CODE_TEXT = customerInfo.CUST_CODE;
            let CUST_CODE_TEXT_ARR = [];
            let topacctinfo = _.concat([], _this.oppBusiData.topacctInfo || [], _this.oppBusiData.otherTopacctinfo || []);
            let bindtopacctcodesArr = [];
            let bindtopacctcodes = "";
            //一账通的 客户需要请求银行
            let bankRequest = [];
            //资金账户处理
            let cuacctRequest = [];
            let custCodeArr = [];//一人多户
            custCodeArr.push(customerInfo.CUST_CODE);
            _.each(topacctinfo, topacctItem => {
                CUST_CODE_TEXT_ARR.push(topacctItem.CUST_CODE + "-" + topacctItem.CUST_STATUS_TEXT);
                if (topacctItem.CUST_STATUS == "0" && topacctItem.CUST_CODE != customerInfo.CUST_CODE) {
                    bindtopacctcodesArr.push(topacctItem.CUST_CODE);
                }
                custCodeArr.push(topacctItem.CUST_CODE);
            })
            custCodeArr = _.uniq(custCodeArr);
            _.each( custCodeArr, custCodeItem => {
                bankRequest.push(custService.getCustBankSignInfo(custCodeItem, {ALL_FLAG:"1"}));
                cuacctRequest.push(_this.$syscfg.K_Request("W0000119", {bex_codes: "YGT_A1160821", USER_CODE: custCodeItem}));
            })
            CUST_CODE_TEXT = CUST_CODE_TEXT_ARR.join(",");
            bindtopacctcodes = bindtopacctcodesArr.join(",");
            //获取所有资金账号
            return Promise.all(cuacctRequest).then( (cuacctData) => {
                //获取所有签约信息
                let cuacctArr = [];
                _.each(cuacctData, cuacctDataItem => {
                    cuacctArr = _.concat([], cuacctArr, _.get(cuacctDataItem, "Data", []));
                })
                return Promise.all(bankRequest).then( (bankData) => {
                    //银行处理
                    let bankList = [];
                    _.each(bankData, bankDataList => {
                        bankList = _.concat([], bankList, _.get(bankDataList, "Data", []))
                    })
                    bankList = _.filter(bankList, bankItem => {
                        bankItem.CUST_NAME = CUST_BASIC_INFO.CUST_FNAME || bankItem.CUST_NAME;
                        bankItem.ID_TYPE = CUST_BASIC_INFO.ID_TYPE || bankItem.ID_TYPE;
                        bankItem.ID_CODE = CUST_BASIC_INFO.ID_CODE || bankItem.ID_CODE;
                        bankItem.ID_EXP_DATE = CUST_BASIC_INFO.ID_EXP_DATE || bankItem.ID_EXP_DATE;

                        bankItem.BSB_USER_FNAME = bankItem.CUST_NAME;
                        bankItem.BSB_ID_TYPE = bankItem.ID_TYPE;
                        bankItem.BSB_ID_CODE = bankItem.ID_CODE;
                        bankItem.BSB_ID_EXP_DATE = bankItem.ID_EXP_DATE;
                        let extOrgText = bankItem.EXT_ORG;
                        if (!_.isEmpty(_this.oppBusiData.bankDataAll)) {
                            let extOrgItem = _.find(_this.oppBusiData.bankDataAll, {ORG_CODE: bankItem.EXT_ORG}) || {};
                            extOrgText = extOrgItem.ORG_NAME || extOrgText;
                        }
                        bankItem.EXT_ORG_TEXT = extOrgText + "-" + bankItem.CUACCT_CODE;                        
                        let cuacctItem = _.find(cuacctArr, {CUACCT_CODE: bankItem.CUACCT_CODE}) || {};
                        bankItem.CUACCT_ATTR = cuacctItem.CUACCT_ATTR;
                        bankItem.key = bankItem.CUST_CODE + "_" + bankItem.CUACCT_CODE + "_" + bankItem.CURRENCY + "_" + bankItem.EXT_ORG;
                        //资金账号审核展示
                        bankItem.BSB_ID_CUACCT_CODE = bankItem.CUACCT_CODE + "-" + (bankItem.CUACCT_ATTR === "0" ? (cuacctItem.MAIN_FLAG === "1" ? "主" : "辅") :  bankItem.CUACCT_ATTR === "1" ?  "信用"  : bankItem.CUACCT_ATTR === "3" ?  "期权" : "");
                        return bankItem.CONTRACT_STATUS != "9"
                    })
                    return {
                        //信息同步
                        SYNC_SYS_FORM: {
                            BANK_LIST: bankList,
                            BANK_LIST_TEXT: "",
                            CSDC_YMT_CODE: CSDC_YMT_CODE,
                            CUST_CODE: "",
                            CUST_CODE_ALL: CUST_CODE_TEXT,
                            CUST_CODE_TEXT: CUST_CODE_TEXT,
                            SYNC_REMARK: "",
                            SYNC_SYS_FLAG: "",
                        },
                        SYNC_YMT_FLAG: getDisableCsdcFlag ? "0" : "1",
                        SYNC_YMT_ENABLE_FLAG: "1",
                        SYNC_SYS: {
                            NEW_YMT_FLAG: getDisableCsdcFlag ? "0" : "1",
                            NEW_SHARE_FLAG: "1",
                            NEW_FUND_FLAG: "1",
                            NEW_BANK_FLAG: "1",
                            NEW_TOPACCT_FLAG: "1",
                            IS_SYNC_BANK_FLAG: bankList.length > 0 ? "1" : "0"
                        },
                        SYNC_BANK_LIST: bankList,
                        SYNC_SIGN_LIST: bankList,
                        SYNC_TOPACCT_LIST: topacctinfo,
                        IS_SYNC_BANK_FLAG: "6",
                        IsChangeSyncInfo: "",
                        BINDTOPACCTCODES: bindtopacctcodes,
                        topacctEnable: "1",
                        OTHER_TOPACCT_CODE: _this.oppBusiData.otherTopacctCode,

                    }
                })
            })
            
            
        },
        afterSave(_this, res) {
            _this.$router.goRoute("修改对比");
            return false;
        },
        nextStep() {
            let rTable = this.bizRouteTable || [];
            for(let i = 0; i < rTable.length; i++){
                let v = rTable[i];
                if(v.name == '风险测评'){
                    this.$store.commit(this.$types.UPDATE_BIZ_ROUTE_INDEX, i-1);
                    break
                }
            }
            //将左侧导航数据保存到流水里
            this.$vtmDispatch(this,'bizFlow','changeNextLeftNav')
            this.$emit('on-next-click')
            // this.$router.goRoute("修改对比");
        }
    },
}
</script>
<style lang="less" scoped>
.openList {
    width: 100%;
    height: 100%;
    .openList-content {
        .title-border {
            display: inline-block;
            margin-left: 30px;
            width: 6px;
            margin-top: 10px;
            height: 28px !important;
            background-color: #2e79db;
            margin-right: 18px;
            width: 10px;
            height: 26px;
            background-color: #1f59db;
            border-radius: 20px;
        }
        .title {
            display: inline-block;
            color: #4A90E2;
            line-height: 40px;
            margin-top: 20px;
            text-align: center;
            font-size: 30px;
            font-weight: 600;
            font-stretch: normal;
            line-height: 35px;
            letter-spacing: 0px;
            color: #1f59db;
        }
        .right-ul {
            display: flex;
            flex-wrap: wrap;
            li {
                display: flex;
                position: relative;
                justify-content: center;
                align-items: center;
                width: 440px;
                height: 166px;
                margin-right: 30px;
                margin-top: 30px;
                // margin: 30px 40px 0 0;
                // padding: 30px 0 30px 10px;
                background: #FAFAFA;
                border: 1px solid #EAEAEA;
                .li-img {
                    margin-right: 24px;
                }
                .li-info {
                    width: 253px;
                    .name {
                        font-size: 28px;
                        font-stretch: normal;
                        font-family:Alibaba PuHuiTi;
                        font-weight:700;
                        height: 18px;
                        color:#252525;
                    }
                    .desc {
                        font-size: 22px;
                        font-weight: normal;
                        font-stretch: normal;
                        line-height: 35px;
                        font-family:Alibaba PuHuiTi;
                        color:#3c3c3c;
                    }
                    .name-funture {
                        color: #252525;
                    }
                }
                
            }
            .current {
                background-color: #ffffff;
                box-shadow: 0px 3px 18px 
                    rgba(0, 0, 0, 0.03);
                border-radius: 4px;
                border: solid 1px #EAEAEA;
            }
            .improving {
                background-color: #fffbf5;
                box-shadow: 0px 3px 18px 
                    rgba(0, 0, 0, 0.03);
                border-radius: 4px;
                border: solid 1px #ffc786;
                .tip {
                    position: absolute;
                    top: 0;
                    right: 0;
                    padding: 5px;
                    font-size:18px;
                    font-weight: bold;
                    background: #FFDBB1;
                    color:#803600;
                    width:92px;
                    height:32px;
                    text-align: center;
                    font-size: 20px;
                    line-height: 1.5;
                    border-radius:0px 3px 0px 12px;
                }
            }
            .modified {
                background-color: #F8FAFF;
                box-shadow:0px 3px 18px 
                    rgba(0, 0, 0, 0.03);
                border-radius: 4px;
                border: solid 1px #BED0FF;
                .tip {
                    position: absolute;
                    top: 0;
                    right: 0;
                    padding: 5px;
                    font-size:18px;
                    font-weight: bold;
                    background: #DEE7FF;
                    color:#3B6AFF;
                    width:92px;
                    height:32px;
                    text-align: center;
                    font-size: 20px;
                    line-height: 1.5;
                    border-radius:0px 3px 0px 12px;
                }
            }          
            .reject {
                background-color: #FFFBFA;
                box-shadow: 0px 3px 18px 
                    rgba(0, 0, 0, 0.03);
                border-radius: 4px;
                border: solid 1px #FFBEBE;
                .tip {
                    position: absolute;
                    top: 0;
                    right: 0;
                    padding: 5px;
                    font-size:18px;
                    font-weight: bold;
                    background: #FFD1D1;
                    color:#C93E2C;
                    width:92px;
                    height:32px;
                    text-align: center;
                    font-size: 20px;
                    line-height: 1.5;
                    border-radius:0px 3px 0px 12px;
                }
            }
        }
    }
    .footer {
        position: absolute;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
        .el-button {
            font-size:24px;
            text-align: center;
            width: 230px;
            height: 60px !important;
            border-radius: 4px !important;
            background-image: linear-gradient(270deg, #1f59db 0%, #217fff 100%);
        }
        .el-button.is-disabled {
            background-image: none;
        }
    }
}
</style>
