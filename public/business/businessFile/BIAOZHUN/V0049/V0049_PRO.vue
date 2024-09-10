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
import custSerivce from '../../../../service/cust-service';
import validateRules from '../../../../components/preEntry/validateRules'
import custInfoModel from "../commonModules/commonBizNode/common/cust-info-model.js"
import bizPublicMethod from "../../../businessTools/bizPublicMethod"
import dict from "../../../../tools/dict"
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
                {
                    img_blue: require("../../../../icons/openList/ic/icon-open-baseinfo.svg"),
                    img_grad: require("../../../../icons/openList/ic/icon-open-baseinfo-gray.svg"),
                    name: "产品信息",
                    desc: "产品名称、产品类别、产品规模等",
                    isShowType: "0",  // 0：不需要修改  1：待完善  2：已修改 3：驳回
                    ygt_module: "PRO_INFO_MODIFY"
                },
                {
                    img_blue: require("../../../../icons/openList/ic/icon-open-bnf.svg"),
                    img_grad: require("../../../../icons/openList/ic/icon-open-bnf-gray.svg"),
                    name: "受益所有人信息",
                    desc: "姓名、证件信息等",
                    isShowType: "0",
                    ygt_module: "PRO_INFO_MODIFY_BENEFICIARY"
                },
                {
                    img_blue: require("../../../../icons/openList/ic/icon-open-control.svg"),
                    img_grad: require("../../../../icons/openList/ic/icon-open-control-gray.svg"),
                    name: "管理人信息",
                    desc: "管理人身份信息、法定代表人信息等",
                    isShowType: "0",
                    ygt_module: "PRO_INFO_MODIFY_MANAGER"
                },
                {
                    img_blue: require("../../../../icons/openList/ic/icon-open-otherinfo.svg"),
                    img_grad: require("../../../../icons/openList/ic/icon-open-otherinfo-gray.svg"),
                    name: "其他信息",
                    desc: "托管人信息、联系人信息等",
                    isShowType: "0",
                    ygt_module: "PRO_INFO_MODIFY_RELA"
                }
            ]
        }
    },
    //bizData 是流水数据可读写，用作保存流水  historyData是历史数据，只读 oppBusiData用作中转挂载数据
    props: ["bizData", "historyData", "oppBusiData","groupDatas", "groupDatasTpl"],
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
        let that = this;
        let rejectModuleInfo = that.$storage.getJsonSession(that.$definecfg.REJECT_MODULE_INFO);
        Promise.all([
                
        ]).then( ()=> {
            that.oppBusiData.copyCurrentGroupData = _.cloneDeep(that.groupDatas);
            let newInfoList = _.cloneDeep(that.infoList);
            //通过名字取出路由配置里的所有groupid和moduleid
            _.map(newInfoList, info => {
                _.each(that.bizRouteTable, item => {
                    if ( info.name == item.fromName ) {
                        info.groupId = item.group;
                        info.moduleIdArr = _.concat([], info.moduleIdArr || [], item.modules);
                    }
                });
                //更新
                info.isShowType = that.updateIsshowType(info, that.filterModuleId(info.groupId, info.moduleIdArr));
                if(that.isRejcet == "1" && !_.isEmpty(rejectModuleInfo) && rejectModuleInfo[info.ygt_module]){
                    info.isShowType = 3;
                }
                return info;
            })
            that.currentInfoList = newInfoList;
        })
    },
    pageActive(){
    },
    activated() {
        let newInfoList = _.cloneDeep(this.currentInfoList);
        let rejectModuleInfo = this.$storage.getJsonSession(this.$definecfg.REJECT_MODULE_INFO);
        _.map(newInfoList, info => {
            //更新
            info.isShowType = this.updateIsshowType(info, this.filterModuleId(info.groupId, info.moduleIdArr));
            if(this.isRejcet == "1" && !_.isEmpty(rejectModuleInfo) && rejectModuleInfo[info.ygt_module]){
                info.isShowType = 3;
            }
            return info;
        });
        this.currentInfoList = newInfoList;
    },
    mounted() {

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
        bizRouteTable(val) {
        }
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
                return flag
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
        //获取已修改
        getShowTypeTwo(val) {
            return _.find(val, item => {return item.isShowType == "2"})
        },
        //获取待完善以及驳回的 且非隐藏的模块
        getShowTypeOneOrThree(val) {
            return _.find(val, item => {return (item.isShowType == "1" || item.isShowType == "3") && !item.isHide})
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
            let isShowType = "0"; // 0：不需要修改  1：待完善  2：已修改 3：驳回
            let oldGroupDatas = _.cloneDeep(this.oppBusiData.oldGroupDatas);
            let newGroupDatas = _.cloneDeep(this.groupDatas);
            let moduleAllFieldInfo = {};//当前模块字段所有default_value数据
            
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
                            if (moduleInfo.MODULE_CONTROL == "1" && field.FIELD_CONTROL != "1" && !this.validateField(field)) {
                                flag = false;
                                return false;
                            }
                            // 证件有效期是否已过期
                            if (moduleInfo.MODULE_CONTROL == "1" && field.FIELD_CONTROL != "1" && field.FIELD_TYPE == "date" && field.VALID_TYPE == "end" && 
                            bizPublicMethod.$blMethod.isExpired(this, field.DEFAULT_VALUE)) {
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
                let ignoreFieldArr = ["MODULE_RADIO_BUTTON"];
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
                    // 旧模块为显示，新模块被隐藏了直接显示“已修改”
                    if (newObj.MODULE_CONTROL == "0" && obj.MODULE_CONTROL == "1") {
                        flag = false;
                        return false;
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
                    let isSame = _.isEqual(oneObj, twoObj)
                    if (!isSame) {
                        flag = false;
                        return false;
                    }
                })
                return flag;
            }
            //对所有模块进行校验对比 决定isShowType展示的状态
            
            //检验必填是否为空
            if (!validateFieldDefault(moduleIdArr, newGroupDatas)) {
                isShowType = "1";
                return isShowType;
            }
            _.each(moduleIdArr, moduleId => {
                let oldModuleData = _.get(oldGroupDatas, groupId + "." + moduleId, []);
                let newModuleData = _.get(newGroupDatas, groupId + "." + moduleId, []);
                //模块数组长度是否一样
                if (oldModuleData.length != newModuleData.length) {
                    isShowType = "2";
                    return false
                }
                //模块字段的值是否一样
                if (!compareModule(oldModuleData, newModuleData, moduleId)) {
                    isShowType = "2";
                    return false;
                }
            })
            return isShowType;
        },
        clickItem(index){
            switch(index) {
                case 0: {
                    this.$router.goRoute('产品信息')
                }
                break;
                case 1: {
                    this.$router.goRoute('受益所有人信息')
                }
                break;
                case 2: {
                    this.$router.goRoute('管理人身份信息')
                }
                break;
                case 3: {
                    this.$router.goRoute('其他信息')
                }
                break;
                default:
                    break;
            }
        },
        async validate(_this) {
            /** 黑名单校验 */
            _this.oppBusiData.flowTurnflag = "0";
            let userInfo = _this.$storage.getJsonSession(_this.$definecfg.USER_INFO);
            let persons = [];
            // 产品本身 
            let docInfo = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "DOC_INFO");
            if (!_.isEmpty(docInfo)) {
                persons.push({
                    IDENTITY: "客户基本信息",
                    NAME: docInfo.CUST_FNAME,
                    ID_TYPE: docInfo.ID_TYPE,
                    ID_CODE: docInfo.ID_CODE
                })
            }
            // 法定代表人
            let legalRepInfo = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "LEGAL_REP_INFO");
            if (!_.isEmpty(legalRepInfo)) {
                persons.push({
                    IDENTITY: "法人信息",
                    NAME: legalRepInfo.LEGAL_REP,
                    ID_TYPE: legalRepInfo.LEGAL_REP_ID_TYPE,
                    ID_CODE: legalRepInfo.LEGAL_REP_ID_CODE
                })
            }
            // 负责人
            let responsibleInfo = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "RESPONSIBLE_PERSON_INFO");
            if (!_.isEmpty(responsibleInfo)) {
                persons.push({
                    IDENTITY: "负责人信息",
                    NAME: responsibleInfo.RESPONSIBILITY_REP,
                    ID_TYPE: responsibleInfo.RESPONSIBILITY_REP_ID_TYPE,
                    ID_CODE: responsibleInfo.RESPONSIBILITY_REP_ID_CODE
                })
            }
            // 控股股东
            let stockholderInfoArr = bizPublicSaveMethod.getModuleArrFoyKey(_this, "STOCKHOLDER_INFO", true);
            if (!_.isEmpty(stockholderInfoArr)) {
                _.each(stockholderInfoArr, stockholderInfo => {
                    persons.push({
                        IDENTITY: "控股股东信息",
                        NAME: stockholderInfo.CONTROLLER,
                        ID_TYPE: stockholderInfo.CONTROLLER_ID_TYPE,
                        ID_CODE: stockholderInfo.CONTROLLER_ID_CODE
                    })
                })
            }
            // 控制人
            let controllerInfoArr = bizPublicSaveMethod.getModuleArrFoyKey(_this, "ACTUAL_CONTROLLER_INFO", true);
            if (!_.isEmpty(controllerInfoArr)) {
                _.each(controllerInfoArr, controllerInfo => {
                    persons.push({
                        IDENTITY: "实际控制人信息",
                        NAME: controllerInfo.CONTROLER_NAME,
                        ID_TYPE: controllerInfo.CONTROLER_ID_TYPE,
                        ID_CODE: controllerInfo.CONTROLER_ID_NO
                    })
                })
            }
            // 代理人
            let agentInfoArr = _.get(_this.oppBusiData.oldBusiData, "AGENT_INFO");
            if (!_.isEmpty(agentInfoArr)) {
                _.each(agentInfoArr, agentInfo => {
                    persons.push({
                        IDENTITY: "经办人信息",
                        NAME: agentInfo.USER_NAME,
                        ID_TYPE: agentInfo.ID_TYPE,
                        ID_CODE: agentInfo.ID_CODE
                    })
                })
            }
            // 受益所有人
            let beneficiaryInfoArr = bizPublicSaveMethod.getModuleArrFoyKey(_this, "BENEFICIARY_OWNER_INFO", true);
            if (!_.isEmpty(beneficiaryInfoArr)) {
                _.each(beneficiaryInfoArr, beneficiaryInfo => {
                    persons.push({
                        IDENTITY: "受益所有人信息",
                        NAME: beneficiaryInfo.BENEFICIARY_NAME,
                        ID_TYPE: beneficiaryInfo.BENEFICIARY_ID_TYPE,
                        ID_CODE: beneficiaryInfo.BENEFICIARY_ID
                    })
                })
            }
            let idTypeDict = await dict.getDictData("ID_TYPE");
            let blackInfo = []
            for (let i = 0; i < persons.length; i++) {
                let params = {
                    USER_NAME: persons[i].NAME,
                    ID_TYPE: persons[i].ID_TYPE,
                    ID_CODE: persons[i].ID_CODE,
                    F_CUST_ORG_CODE: userInfo.ORG_CODE || ""
                }
                if (_.isEmpty(params.USER_NAME) || _.isEmpty(params.ID_TYPE) ||
                _.isEmpty(params.ID_CODE) || _.isEmpty(params.F_CUST_ORG_CODE)) {
                    continue;
                }
                let isInBlackListFn = await custSerivce.isInBlackList(params);
                if (!_.isEmpty(isInBlackListFn) && (isInBlackListFn.CHECK_RESULT == "1" || isInBlackListFn.CHECK_RESULT == "2")) {
                    _this.oppBusiData.flowTurnflag = "1";
                    let info = Object.assign(isInBlackListFn, {
                        blackType: persons[i].IDENTITY,
                        USER_FNAME: isInBlackListFn.USER_FNAME || isInBlackListFn.USER_NAME,
                        ID_TYPE_TEXT: bizPublicMethod.$blMethod.getDictValueByKey(idTypeDict.ID_TYPE, isInBlackListFn.ID_TYPE),
                    })
                    blackInfo.push(info);
                }
            }
            Object.assign(_this.oppBusiData, {
                blackInfo: blackInfo
            })

            /**客户反洗钱等级为“高”且修改以下信息：客户名称、证件类型、证件号码、组织机构代码证）时，也需要流程流转 */
            let originalBasicInfo = _.get(_this.oppBusiData.oldBusiData, "CUST_BASIC_INFO");
            let basicInfo = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "DOC_INFO");
            if (!_.isEmpty(originalBasicInfo)) {
                let amlLvl = originalBasicInfo.AML_LVL;
                if (amlLvl == "2") {
                    let isKeyInfoChanged = 
                        basicInfo.CUST_FNAME != originalBasicInfo.USER_FNAME ||
                        basicInfo.ID_TYPE != originalBasicInfo.ID_TYPE ||
                        basicInfo.ID_CODE != originalBasicInfo.ID_CODE
                    if (isKeyInfoChanged) {
                        _this.oppBusiData.flowTurnflag = "1";
                    }
                }
            }
        },
        //获取变更后的一账通信息
        getOtherTopacctinfo: (_this, params) => {
        },
        beforeSave(_this, params) {
            return Promise.all([
                _this.$refs.V0049_PRO.busiLogic.bizProBasicInfoNodeBeforeSave(_this, params),
                _this.$refs.V0049_PRO.busiLogic.bizProManagerBasicInfoNodeBeforeSave(_this, params),
                _this.$refs.V0049_PRO.busiLogic.bizProCreditRecordInfoBeforeSave(_this, params),
                _this.$refs.V0049_PRO.busiLogic.bizProLinkmanInfoNodeBeforeSave(_this, params),
                _this.$refs.V0049_PRO.busiLogic.bizProLegalRepInfoBeforeSave(_this, params),
                _this.$refs.V0049_PRO.busiLogic.bizProLegalClientInfoBeforeSave(_this, params),
                _this.$refs.V0049_PRO.busiLogic.bizProResponsibleInfoBeforeSave(_this, params),
                _this.$refs.V0049_PRO.busiLogic.bizProPartnerInfoBeforeSave(_this, params),
                _this.$refs.V0049_PRO.busiLogic.bizProStockholderInfoBeforeSave(_this, params),
                _this.$refs.V0049_PRO.busiLogic.bizProActualControllerNodeBeforeSave(_this, params),
                _this.$refs.V0049_PRO.busiLogic.bizProBeneficiaryOwnerBeforeSave(_this, params),
                _this.$refs.V0049_PRO.busiLogic.bizProTrusteeInfoNodeBeforeSave(_this, params),
            ]).then( async res => {
                // 流转条件
                params.FLOW_TURN_FLAG = _this.oppBusiData.flowTurnflag || "0";
                // 信息同步数据
                let syncInfo = await this.setSyncSys(_this, params);
                Object.assign(params, syncInfo);
                //增加代理人信息
                this.detailOrgAssignInfo(_this, params); 
                //增加企业资质
                this.detailCorpQualInfo(_this, params)
                //增加其他信息
                this.detailOtherInfo(_this, params);
                params.NEED_COLLECT_CHANGE_FLAG = "0";
                if (params.NEED_COLLECT_CHANGE_FLAG_MANAGER == "1" 
                    || params.NEED_COLLECT_CHANGE_FLAG_BASIC == "1") {
                    params.NEED_COLLECT_CHANGE_FLAG = "1";
                }
                params.IS_CHECK_7_24 = "0";
                // 启用反洗钱功能
                params.AML_FLAG = true;
                // 代理人
                let agentInfo = _this.$storage.getJsonSession(_this.$definecfg.ORG_CURRENT_AGENT);
                params.AGT_ID_TYPE = _.isEmpty(agentInfo) ? "" : agentInfo.ID_TYPE;
                // 黑名单信息
                params.BLACK_INFO = _this.oppBusiData.blackInfo || [];
                // 覆盖柜员信息
                let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
                params.USER_NAME = customerInfo.CUST_NAME;
                // 规范标志：提交后设置为 0-合规
                params.CRITERION = "0";
                params.IS_IN_ZD_TIME = _this.oppBusiData.IS_IN_ZD_TIME;
            }).catch(error => {
                console.error("保存失败:" + error);
            })
        },
        //企业资质处理
        detailCorpQualInfo(_this, params) {
            let corpInfo = _.get(_this.oppBusiData, "oldBusiData.CORP_INFO", {});
            let corpQualInfo = _.pick(corpInfo, "C1", "C2", "C3", "C4", "C5")
            let showOrgCorpQualFlag = (_this.$blMethod.getJsonSessionBusiCommParam(_this, "SHOW_ORG_CORP_QUAL") || "0") == "1";
            let qualInfo = {
                CORP_QUAL_ID_CODE: "",
                CORP_QUAL_ID_EXP_DATE: "",
                CORP_QUAL_ID_ISS_AGCY_PRO: "",
                CORP_QUAL_ID_NAME: "",
                CORP_QUAL_PERMIT: "",
                QUAL_CERT: "0"
            }
            if (showOrgCorpQualFlag && (corpQualInfo.C1 || corpQualInfo.C2 || corpQualInfo.C3 && corpQualInfo.C3 != "-1" || corpQualInfo.C4 || corpQualInfo.C5)) {
                qualInfo = {
                    CORP_QUAL_ID_CODE: corpQualInfo.C1 || "",
                    CORP_QUAL_ID_EXP_DATE: corpQualInfo.C2 || "",
                    CORP_QUAL_ID_ISS_AGCY_PRO: corpQualInfo.C3 || "",
                    CORP_QUAL_ID_NAME: corpQualInfo.C4 || "",
                    CORP_QUAL_PERMIT: corpQualInfo.C5 || "",
                    QUAL_CERT: "1"
                }
            }
            qualInfo.DIFF_INFO = [];
            params.ORG_CORP_QUAL_INFO = qualInfo;
        },
        //处理其他信息
        detailOtherInfo(_this, params) {
            let basicInfo = _.get(_this.oppBusiData, "oldBusiData.CUST_BASIC_INFO", {});
            let otherInfo = _.pick(basicInfo, "AML_FACTOR", "AML_LVL", "CRITERION", "CUST_CLS", "CUST_FLAG", "CUST_GRP", "NET_ASSET", "NET_FIN_ASSET", "OPT_TRDACCT_LVL", "OP_REMARK", "RISK_FACTOR")
            otherInfo.ACCEPT_RISK_FACTOR = otherInfo.RISK_FACTOR;
            otherInfo.OLD_RISK_FACTOR = otherInfo.RISK_FACTOR;
            otherInfo.DIFF_INFO = [];
            if (otherInfo.CRITERION != "0") {
                otherInfo.DIFF_INFO.push({
                    FIELD:'CRITERION',
                    NEW: "0",
                    OLD: _.cloneDeep(otherInfo.CRITERION) || "",
                })
                otherInfo.CRITERION = "0";
            }
            if (otherInfo.CUST_CLS == "") {
                otherInfo.DIFF_INFO.push({
                    FIELD:'CUST_CLS',
                    NEW: "0",
                    OLD: "",
                })
                otherInfo.CUST_CLS = "0";
            }
            params.ORG_OTHER_INFO = otherInfo;
        },
        //处理代理人信息
        detailOrgAssignInfo(_this, params) {
            let agentInfo = custInfoModel.getOriginaAssignPersonInfo(_this.oppBusiData.oldBusiData);
            agentInfo.DIFF_INFO = [];
            params.ORG_ASSIGN_PERSON_INFO = agentInfo;
        },
        /**
         * 同步信息数据处理
         */
        async setSyncSys(_this, params) {
            params.CHANGE_IMPORTANT_FLAG_YINHE && await this.getOtherTopacctinfo(_this, params);
            let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
            let getDisableCsdcFlag = this.getDisableCsdcFlag(_this);
            let CSDC_YMT_CODE = "";
            let CUST_BASIC_INFO = params.PRO_BASIC_INFO;
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
                bankRequest.push(custSerivce.getCustBankSignInfo(custCodeItem, {ALL_FLAG:"1"}));
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
                        // 产品同步管理人证件有效期
                        bankItem.ID_EXP_DATE = params.PRO_MANAGER_ID_EXP_DATE || CUST_BASIC_INFO.ID_EXP_DATE || bankItem.ID_EXP_DATE;

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
                        // 信息同步
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
                        SYNC_YMT_ENABLE_FLAG: "0",
                        SYNC_SYS: {
                            NEW_YMT_FLAG: getDisableCsdcFlag ? "0" : "1",
                            NEW_SHARE_FLAG: "1",
                            NEW_FUND_FLAG: "1",
                            NEW_BANK_FLAG: "1",
                            NEW_TOPACCT_FLAG: "0", // 产品客户，需置灰同步一账通按钮
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
        //判断是否禁止置灰中登一码通信息；
        getDisableCsdcFlag(_this) {
            let disableCsdcFlag = false;
            if (_this.oppBusiData.IS_IN_ZD_TIME == "false") {
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
            // 产品客户、特殊机构不勾选一码通
            let sysCommParam =  _this.$storage.getJsonSession(_this.$definecfg.SYS_COMM_PARAM_OBJS);
            let specialSzorgTypes = _.isEmpty(sysCommParam.SPE_SZORG_TYPE) ? [] : sysCommParam.SPE_SZORG_TYPE.split(",");
            let szorgType = _this.groupDatas.MANAGER_INFO.MANAGER_BASIC_INFO[0].FIELDS.SZORG_TYPE.DEFAULT_VALUE;
            if (specialSzorgTypes.indexOf(szorgType) != -1 || _this.userType == "2") {
                disableCsdcFlag = true;
            }
            return disableCsdcFlag
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
                    margin-right: 5px;
                }
                .li-info {
                    width: 330px;
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
