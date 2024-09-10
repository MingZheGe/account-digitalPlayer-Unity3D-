/*
 * @Description: 非关键信息变更 联系信息部分
 * @Date: 2019-06-27 10:55:56
*/
import bizPublicMethod from '../../../../businessTools/bizPublicMethod.js'

export default {
    //----------------------------------钩子函数----------------------//
    /*
     * @Description: 钩子函数 加载历史数据之前触发
     * @Date: 2019-06-27 11:03:56
    */
    relaInfoBeforeLoadBiz: function (_this) {
        if(_this.userType == "0") {
            _this.groupDatas.BENEFICIARY_INFO.BENEFICIARY_MODULE[0].FIELDS.BENEFICIARY_NO.FIELD_CONTROL = 1;
            //公共的基本数据解析
            //公共的基本数据解析
            if(_this.oppBusiData.custAllInfo) {
                _this.$blMethod.parseMoudleArray(_this,_this.groupDatas["RELA_INFO"]["CUST_OTHER_LINK_INFO"],_this.oppBusiData.custAllInfo.LINKMAN_INFO);
                if(_this.oppBusiData.custAllInfo.CONTROLLER_INFO.length != 0 ) {
                    _this.oppBusiData.selfCtlFlag = true;
                    _this.$blMethod.parseMoudleArray(_this,_this.groupDatas["CONTROLLER_INFO"]["CONTROLLER_MODULE"],_this.oppBusiData.custAllInfo.CONTROLLER_INFO);
                }
                if(_this.oppBusiData.custAllInfo.BENEFICIARY_INFO.length != 0) {
                    _this.oppBusiData.selfBenFlag = true;
                    _this.$blMethod.parseMoudleArray(_this,_this.groupDatas["BENEFICIARY_INFO"]["BENEFICIARY_MODULE"],_this.oppBusiData.custAllInfo.BENEFICIARY_INFO);
                }
            }
        }
    },

    /*
    *@Description: 钩子函数  加载历史数据后触发
    *@Author: yangyp
    *@Date: 2019-07-04 16:31:00
    */

    relaInfoAfterLoadBiz: function(_this){
        //重新解析历史数据
         //this.relaInfoLoadBizData(_this,_this.historyData)
         if(_this.historyData) {
            if(_this.historyData.CUST_CONTROLLER_INFO) {
                _this.oppBusiData.selfCtlFlag = true;
                _this.$blMethod.parseMoudleArray(_this,_this.groupDatas["CONTROLLER_INFO"]["CONTROLLER_MODULE"],_this.historyData.CUST_CONTROLLER_INFO);
            }
            if(_this.historyData.CUST_BENEFICIARY_INFO) {
                _this.oppBusiData.selfBenFlag = true;
                _this.$blMethod.parseMoudleArray(_this,_this.groupDatas["BENEFICIARY_INFO"]["BENEFICIARY_MODULE"],_this.historyData.CUST_BENEFICIARY_INFO);
            }
            if(_this.historyData.CUST_OTHER_LINK_INFO ) {
                _this.$blMethod.parseMoudleArray(_this,_this.groupDatas["RELA_INFO"]["CUST_OTHER_LINK_INFO"],_this.historyData.CUST_OTHER_LINK_INFO);
            }
        }
        let otherLinkmanInfo = _this.groupDatas.RELA_INFO.CUST_OTHER_LINK_INFO;
        for(let md in otherLinkmanInfo){
            for(let fk in otherLinkmanInfo[md].FIELDS){
                //为创业板联系人，则将模块标题显示为创业板联系人
                if(fk == "LINKMAN_FLAG" && otherLinkmanInfo[md]["FIELDS"][fk].DEFAULT_VALUE == "2"){
                    otherLinkmanInfo[md].MODULE_TITLE = "创业板联系人";
                }
            }
        }
    },
    /*
    *@Description: 数据解析或回填
    *@Author: yangyp
    *@Date: 2019-07-04 16:32:08
    */
    relaInfoLoadBizData : async function(_this,busiData){
        return this.relaInfoParseOppBiz(_this, busiData)
    },
    /**
    * crelaInfoParseOldBiz 重新加载转换之后的历史数据
    * @param _this
    */
    relaInfoParseOppBiz :function (_this, bdata) { // 解析身份证读卡数据
         
    },
    /*
     * @Description: 保存拼接的数据
     * @Author: chencheng
     * @Date: 2019-06-27 13:31:33
    */
    relaInfoBeforeSave: async function (_this, params) {
        this.relaInfoGetData(_this, params);
    },
    /*
    *@method relaInfoPageActivated
    *@desc 钩子函数：页面激活
    *@MethodAuthor  yangyp
    *@Date: 2019-07-04 15:19:09
    */
    relaInfoPageActivated : function(_this, groupId){
        if(groupId == "CONTROLLER_INFO" && _this.oppBusiData.custAllInfo) {
            //如果控制人 关系为 本人，则所有信息不能修改
            
            if(_this.groupDatas.CONTROLLER_INFO.CONTROLLER_MODULE[0].FIELDS.CONTROLER_RELATION.DEFAULT_VALUE == "0Z"){
                let CONTROLLER_INFO = _this.groupDatas.CONTROLLER_INFO.CONTROLLER_MODULE[0].FIELDS;
                _.forEach(CONTROLLER_INFO,function(value, key) {
                    if(key != "CONTROLER_NUM"){
                        CONTROLLER_INFO[key].FIELD_CONTROL = 2
                    }
                })
            }else{
                _this.groupDatas.CONTROLLER_INFO.CONTROLLER_MODULE[0].FIELDS.CONTROLER_RELATION.FIELD_CONTROL=0;
            }
        }
        //收益人得关系是可以选得
        if(groupId == "BENEFICIARY_INFO" && _this.oppBusiData.custAllInfo) {
            _this.groupDatas.BENEFICIARY_INFO.BENEFICIARY_MODULE[0].FIELDS.BENEFICIARY_RELA.FIELD_CONTROL = 0;
            _this.groupDatas.BENEFICIARY_INFO.BENEFICIARY_MODULE[0].FIELDS.BENEFICIARY_NO.FIELD_CONTROL = 1;
        }
        if(groupId == "RELA_INFO" && _this.oppBusiData.custAllInfo){
            let otherLinkmanInfo = _this.groupDatas.RELA_INFO.CUST_OTHER_LINK_INFO;
            for(let md in otherLinkmanInfo){
                for(let fk in otherLinkmanInfo[md].FIELDS){
                    if(fk == "LINKMAN_FLAG"){
                        otherLinkmanInfo[md]["FIELDS"][fk].FIELD_CONTROL = 1;
                    }
                }
            }
        }
        _this.$router.updateRoute(_this.$router.getCurrentRouteIndex(),"nextBtnText","填写完成");
        if(_.indexOf(["RELA_INFO","CONTROLLER_INFO","BENEFICIARY_INFO"],_this.groupId) != -1) {
            _this.$el.getElementsByClassName("prev")[0].parentElement.style.display = "none";
        }else {
            _this.$el.getElementsByClassName("prev")[0].parentElement.style.display = "block";
        }
    },
    /*
     * @Description: 拼接数据
     * @Author: chencheng
     * @Date: 2019-06-27 13:32:11
    */
    relaInfoGetData: function (_this,params) {
        let custOtherLinkInfo = this.getArrDiff(_this.groupDatas.RELA_INFO.CUST_OTHER_LINK_INFO, _this.oppBusiData.LINKMAN_INFO,"LINKMAN_NO", "LINKMAN_NAME");
        // let custOtherLinkInfo = _this.$blMethod.getMoudleArrDiff(_this.groupDatas.RELA_INFO.CUST_OTHER_LINK_INFO,_this.oppBusiData.LINKMAN_INFO,"LINKMAN","LINKMAN_MOBILE");
        // let custOtherLinkInfo = _this.$blMethod.getMoudleArrDiff(_this.groupDatas.RELA_INFO.CUST_OTHER_LINK_INFO,_this.oppBusiData.LINKMAN_INFO,"LINKMAN","LINKMAN_MOBILE");
        let oppControllerInfo = _this.oppBusiData.custAllInfo.CONTROLLER_INFO;
        let CUST_CONTROLLER_INFO = this.getArrDiff(_this.groupDatas.CONTROLLER_INFO.CONTROLLER_MODULE, oppControllerInfo,"CONTROLER_NUM", "CONTROLER_NAME");
        let oppBeneficiaryInfo = _this.oppBusiData.custAllInfo.BENEFICIARY_INFO;
        // 获取修改后页面字段数据
        let CUST_BENEFICIARY_INFO = this.getArrDiff(_this.groupDatas.BENEFICIARY_INFO.BENEFICIARY_MODULE, oppBeneficiaryInfo,"BENEFICIARY_NO", "BENEFICIARY_NAME");

        _this.oppBusiData.isUnderageFlag = _this.$blMethod.isSubjectIdentity(_this.oppBusiData.BASIC_INFO.SUBJECT_IDENTITY, "1,3,f,h");
        let CUST_GUARDIAN_INFO = {};

        if (_this.oppBusiData.isUnderageFlag) {
            CUST_GUARDIAN_INFO.IS_CHANGE = "0";
            CUST_GUARDIAN_INFO.INFO = {
                "DIFF_INFO": [],
                "OPER_TYPE": "3",
            }
        }
        _this.oppBusiData.LAU_MONEYTYPEB = _this.oppBusiData.custAllInfo.BASIC_INFO.LAU_MONEYTYPEB == ""? "0": _this.oppBusiData.custAllInfo.BASIC_INFO.LAU_MONEYTYPEB;
        // 其他信息
        let CUST_OTHER_INFO = {
            "AML_LVL": _this.oppBusiData.custAllInfo.OTHER_INFO.AML_LVL,
            "AVOCATION": _this.oppBusiData.custAllInfo.BASIC_INFO.AVOCATION,
            "CUST_CLS": _this.oppBusiData.custAllInfo.OTHER_INFO.CUST_CLS,
            "CUST_GRP": _this.oppBusiData.custAllInfo.OTHER_INFO.CUST_GRP,
            "DIFF_INFO": [],
            "IDCARD_TYPE":_this.$storage.getSession(_this.$definecfg.READ_CARD)== 1 ?"2":(_this.oppBusiData.custAllInfo.OTHER_INFO.IDCARD_TYPE||""),
            "LAU_MONEYTYPEB": _this.oppBusiData.custAllInfo.BASIC_INFO.LAU_MONEYTYPEB,
            "SPECIAL_STATUS": _this.oppBusiData.custAllInfo.OTHER_INFO.SPECIAL_STATUS,
        }
        //联系人，实际控制人、实际受益人、监护人  客户拓展信息单
        if (custOtherLinkInfo.length != _this.oppBusiData.LINKMAN_INFO.length 
         || _this.$blMethod.getMoudleArrIsChangeBool(_this,custOtherLinkInfo) 
         || CUST_CONTROLLER_INFO.IS_CHANGE === "1" 
         || CUST_BENEFICIARY_INFO.IS_CHANGE === "1" 
         || CUST_GUARDIAN_INFO.IS_CHANGE === "1") {
            _this.oppBusiData.IS_EXT_INFO_CHANGE = "1";
        }
        if (CUST_CONTROLLER_INFO.IS_CHANGE === "1") {
            _this.oppBusiData.IS_CONTROLLER_CHANGE = "1";
        }
        if (CUST_GUARDIAN_INFO.IS_CHANGE === "1") {
            _this.oppBusiData.IS_GUARDIAN_INFO_CHANGE = "1";
        }
        let retSyncData = { NEW_YMT_FLAG: 0, NEW_SHARE_FLAG: 1, NEW_FUND_FLAG: 1, NEW_BANK_FLAG: 0, NEW_OP_REMARK: "" };
        let res = {
            // "jumpJudgeBusiTimes" : that.isOnlyChangeTax === "1" ? true : that.jumpJudgeBusiTimes, // 
            "CUST_OTHER_LINK_INFO": custOtherLinkInfo.INFO,
            "CUST_CONTROLLER_INFO": CUST_CONTROLLER_INFO.INFO,
            "CUST_BENEFICIARY_INFO": CUST_BENEFICIARY_INFO.INFO,
            "CUST_GUARDIAN_INFO": _this.oppBusiData.isUnderageFlag ? CUST_GUARDIAN_INFO.INFO : [],
            "CUST_OTHER_INFO": CUST_OTHER_INFO,
            "IS_CONTROLLER_CHANGE": _this.oppBusiData.IS_CONTROLLER_CHANGE || "0",
            "IS_EXT_INFO_CHANGE": _this.oppBusiData.IS_EXT_INFO_CHANGE || "0",
            "IS_GUARDIAN_INFO_CHANGE": _this.oppBusiData.IS_GUARDIAN_INFO_CHANGE || "0",
            "SYNC_SYS" : retSyncData,
            // "SELECT_YMT_CODE": that.csdcCheckInfo && that.csdcCheckInfo.YMT_CODE || "",
            "COLLECT_ZD_IMG_FLAG":retSyncData.NEW_YMT_FLAG ? "1" : "0",
            "selfCtlFlag": _this.oppBusiData.selfCtlFlag,

        }
        Object.assign(params, res);
    },

    /*
     * @Description: 点击下一步验证
     * @Author: chencheng
     * @Date: 2019-06-27 13:59:47
    */
    relaInfoValidate: function (_this) {
        if(_this.groupDatas.RELA_INFO.CUST_OTHER_LINK_INFO[0].FIELDS.LINKMAN_MOBILE_TEL.DEFAULT_VALUE == _this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.MOBILE_TEL.DEFAULT_VALUE 
            && _this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.MOBILE_TEL.DEFAULT_VALUE.length == 11
            && _this.groupDatas.RELA_INFO.CUST_OTHER_LINK_INFO[0].FIELDS.LINKMAN_MOBILE_TEL.DEFAULT_VALUE){
                //其他联系人信息手机号码不能是本人留存的电话
                _this.messageBox({
                     hasMask:true,
                     messageText:'其他联系人信息手机号码不能是本人留存的电话',
                     confirmButtonText:'继续修改',
                     typeMessage:'warn', 
                     showMsgBox:true ,
                     confirmedAction: function(){
                         
                     },
                 }) 
                 return false;
             }
    
            if(_this.$router.getCurrentRoute().nextBtnText == "填写完成"){
                // this.relaInfoGetData(_this);
                if(_.indexOf(_this.$router.getCurrentRoute().modules ,"CUST_OTHER_LINK_INFO") != -1) {
                    //在这里校验 
                    //当不同得联系人类型 填写得电话 和 联系人姓名相同表示可以添加
                    //当相同得联系人类型 填写得电话 和 联系人姓名相同表示不可添加
                    let otherLinkmanInfo = _this.groupDatas.RELA_INFO.CUST_OTHER_LINK_INFO;
                    //普通联系人
                    let commonLinkman = [];
                    //创业板联系人
                    let gemLinkman = [];
                    for(let md in otherLinkmanInfo){
                        for(let fk in otherLinkmanInfo[md].FIELDS){
                            if(fk == "LINKMAN_FLAG"){
                                 // 如果时创业板联系人 放入创业板数组里
                                if(otherLinkmanInfo[md]["FIELDS"][fk].DEFAULT_VALUE == "2"){
                                    gemLinkman.push(otherLinkmanInfo[md]);
                                }
                                //否则放入普通联系人 数组里
                                else{
                                    commonLinkman.push(otherLinkmanInfo[md]);
                                }
                            }
                            
                        }
                    }
                    
                    //再分别对比两个分组里得电话号码和联系人姓名是否相同  相同则弹出提示框
                    let isError = this.isSameLinkman(_this, commonLinkman) && this.isSameLinkman(_this, gemLinkman);
                    if(!isError){
                        _this.messageBox({
                            hasMask:true,
                            messageText:'不能添加相同得联系人',
                            confirmButtonText:'继续修改',
                            typeMessage:'warn', 
                            showMsgBox:true ,
                            confirmedAction: function(){
                                
                            },
                        })
                        return false;
                    }

                    for(let md in otherLinkmanInfo){
                        for(let fk in otherLinkmanInfo[md].FIELDS){
                            // 如果时创业板联系人 放入创业板数组里
                            if(fk == "LINKMAN_FLAG"){
                                otherLinkmanInfo[md]["FIELDS"][fk].FIELD_CONTROL = "0";
                            }
                        }
                    }

                    let data = _this.parseGroupData();
                    if(data[0].length) {
                        return true;
                    }
                        
                }
                if(_.indexOf(_this.$router.getCurrentRoute().modules ,"BENEFICIARY_MODULE") != -1) {
                    let data = _this.parseGroupData();
                    if(data[0].length) {
                        return true;
                    }
                        
                }
                _this.$router.goRoute("业务导航");
                return false;
            }
            return true;
    },
    //判断是否添加了相同的联系人
    isSameLinkman: function(_this, linkman){
        for(let i = 0; i < linkman.length; i++){
            for(let j = i + 1; j < linkman.length; j++){
                if(linkman[i]["FIELDS"]["LINKMAN_NAME"].DEFAULT_VALUE == linkman[j]["FIELDS"]["LINKMAN_NAME"].DEFAULT_VALUE
                && linkman[i]["FIELDS"]["LINKMAN_MOBILE_TEL"].DEFAULT_VALUE == linkman[j]["FIELDS"]["LINKMAN_MOBILE_TEL"].DEFAULT_VALUE){
                    return false;
                }
            }
        }
        return true;
    },
    /*
     *@Description: 上一步钩子
     *@Author: yangyp
     *@Date: 2019-07-09 11:13:33
    */
    relaInfoPreValidate:function(_this){
        _this.$router.goRoute("业务导航");
    },
    /*
     * @Description: 
     * 1、点击上一步验证
     * @Author: chencheng
     * @Date: 2019-07-09 13:12:59
    */
   orgRelaInfoPreValidate:function(_this){
    _this.$router.goRoute("业务导航");
    },
    // 实际控制人信息ORG_CONTROLLER_INFO
    getControllerInfo: function(_this) {
        let oppControllerInfo = _this.oppBusiData.custAllInfo.CONTROLLER_INFO;
        // 获取修改后页面字段数据
        let ORG_CONTROLLER_INFO = {};
        ORG_CONTROLLER_INFO = this.getArrDiff(_this.groupDatas.ORG_CONTROLLER_INFO.ORG_CONTROLLER_MODULE, oppControllerInfo,"CONTROLER_NUM", "ASSOCIATE_NAME");
    },
    // 受益人信息 ORG_BENEFICIARY_INFO
    getBeneficiaryInfo: function(_this) {
        let oppBeneficiaryInfo = _this.oppBusiData.custAllInfo.BENEFICIARY_INFO;
        // 获取修改后页面字段数据
        let ORG_BENEFICIARY_INFO = {};
        ORG_BENEFICIARY_INFO = this.getArrDiff(_this.groupDatas.ORG_BENEFICIARY_INFO.ORG_BENEFICIARY_MODULE, oppBeneficiaryInfo,"BENEFICIARY_NO", "BENEFICIARY_NAME");
    },
    //--------------------------------------------------检查逻辑--------------------------------------------------
    getArrDiff: function(group,oldArr,keyId, mainKey){
        var that = this,newArr=[],isChange = "0";
        // _.each($wrap.find(".kui-form"),function(form){
        //     newArr.push($(form).form("getData"));
        // });
        // newArr = group;
        _.each(group,function(item){
            let obj = {};
            bizPublicMethod.$blMethod.changeObjKeys(item.FIELDS, obj);
            let keyObj = {};
            // if(keyId == "CONTROLER_NUM" || keyId == "STOCKHOLDER_NO"){ //当为控制人或控股股东时增加联系地址
            //     obj = _.extend({},obj,{ADDRESS: $(form).find("#ADDRESS").cityselect("getValue")});
            // }else if(keyId == "BENEFICIARY_NO"){ //当为受益人时增加联系地址
            //     obj = _.extend({},obj,{BENEFICIARY_ADDR: $(form).find("#BENEFICIARY_ADDR").cityselect("getValue")});
            // }
            //判断当前是新增还是修改 OPER_TYPE 0-新增 1-修改 2-删除 3-不变
            keyObj[keyId] = obj[keyId];
            //如果主要字段为空，则当此条信息没有修改或者添加（非关键非临柜里需要去掉所有校验,数据为空会有问题,这里控制一下）
            var diff,operType;
            if(mainKey && !obj[mainKey]) {
                operType = "3";
                diff = [];
            } else {
                diff = !!obj[keyId] ? bizPublicMethod.$blMethod.compareInfo2(_.find(oldArr,keyObj),obj) : [];
                // obj.DIFF_INFO = diff;
                // obj.OPER_TYPE = diff.length ? "1" : !!obj[keyId] ? "3" : "0";
                operType = diff.length ? "1" : !!obj[keyId] ? "3" : "0";
            }
            if(operType !== "3"){
                isChange = "1";
            }
            newArr.push(Object.assign({},{
                DIFF_INFO: diff,
                OPER_TYPE: operType
            },obj));
        });
        _.filter(oldArr,function(v){
            var keyObj = {};
            keyObj[keyId] = v[keyId];
            return !_.find(newArr, keyObj);
        }).forEach(function(v){
            newArr.push(Object.assign({},v,{DIFF_INFO:[],OPER_TYPE: "2"}));
            isChange = "1";
        });
        return {
            INFO: newArr,
            IS_CHANGE: isChange
        };
    },
    
    /*
     *@Description: 其他联系人手机号码验证
     *@Author: yangyp
     *@Date: 2019-08-08 21:47:42
    */
    "CHECK_LINKMAN_MOBILE" : (_this, field, fieldData) => {
        if(field.DEFAULT_VALUE == _this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.MOBILE_TEL.DEFAULT_VALUE && _this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.MOBILE_TEL.DEFAULT_VALUE.length == 11){
           //其他联系人信息手机号码不能是本人留存的电话
           _this.messageBox({
                hasMask:true,
                messageText:'其他联系人信息手机号码不能是本人留存的电话',
                confirmButtonText:'继续修改',
                typeMessage:'warn', 
                showMsgBox:true ,
                confirmedAction: function(){
                    
                },
            })
        }
    },
    "CHECK_SYNC_SYS" : (_this, field, fieldData) => {
        _this.groupDatas["SYNC_INFO"]["SYNC_MODULE"][0]["FIELDS"]["SYNC_SYS"]["isShowAllBtn"] = false;
        let bankArr = [];
        let custCuacctInfo = _this.oppBusiData.BASIC_INFO.CUST_CUACCT_INFO;
        for (let i = 0;custCuacctInfo && i < custCuacctInfo.length; i++) { 
            bankArr[i] = custCuacctInfo[i].EXT_ORG;
        }
        let bank = _.map(_.filter(fieldData["EXT_ORG"].FIELD_DICT_NAME, function (v) {
            if(v.DICT_ITEM){
              return _.indexOf(bankArr, v.DICT_ITEM) != -1;
            }
          }), "DICT_ITEM");
        //选择的是银行
        if(_.indexOf(field.DEFAULT_VALUE, "3") != -1){
            fieldData.EXT_ORG.FIELD_CONTROL = "0";
            fieldData["EXT_ORG"].FIELD_DICT_FILTER = bank;
        }else{
            fieldData.EXT_ORG.FIELD_CONTROL = "1";
            fieldData["EXT_ORG"].DEFAULT_VALUE = "";
        }
    },
    "CHECK_EXT_ORG" : (_this, field, fieldData) => {
        console.log("test");
        if(field.DEFAULT_VALUE){
            // 显示提示信息
            // 将隐藏的组件显示出来
            fieldData.PROMPT_INFO.FIELD_CONTROL = "0";
            fieldData.GUARDIAN_ID.FIELD_CONTROL = "0";
            fieldData.GUARDIAN_ID_TYPE.FIELD_CONTROL = "0";
            fieldData.GUARDIAN_NAME.FIELD_CONTROL = "0";

            //给显示出来的 设置默认值
            fieldData.GUARDIAN_ID.DEFAULT_VALUE = _this.oppBusiData.BASIC_INFO.ID_CODE;
            fieldData.GUARDIAN_ID_TYPE.DEFAULT_VALUE = _this.oppBusiData.BASIC_INFO.ID_TYPE;
            fieldData.GUARDIAN_NAME.DEFAULT_VALUE = _this.oppBusiData.BASIC_INFO.USER_FNAME;
            fieldData.PROMPT_INFO.DEFAULT_VALUE = "请核对客户的银证账户信息是否与客户的银行信息一致，若不一致，请修改银证账户信息！";
        }else{
            // 将组件隐藏 
            fieldData.PROMPT_INFO.FIELD_CONTROL = "1";
            fieldData.GUARDIAN_ID.FIELD_CONTROL = "1";
            fieldData.GUARDIAN_ID_TYPE.FIELD_CONTROL = "1";
            fieldData.GUARDIAN_NAME.FIELD_CONTROL = "1";
        }
    },
    //受益人对应得字段当不是本人得时候其他字段是可以编辑得
    "CHECK_BENEFICIARY_RELA": (_this, field, fieldData) => {
        let BENEFICIARY_INFO = _this.groupDatas["BENEFICIARY_INFO"]["BENEFICIARY_MODULE"][0].FIELDS;
        if(field.DEFAULT_VALUE != "0Z" && _this.oppBusiData.BENEFICIARY_INFO[0].BENEFICIARY_RELA != _this.groupDatas.BENEFICIARY_INFO.BENEFICIARY_MODULE[0].FIELDS.BENEFICIARY_RELA.DEFAULT_VALUE){
            _.forEach(BENEFICIARY_INFO,function(value, key) {
                if(key != "BENEFICIARY_NO" && key != "BENEFICIARY_RELA"){
                    BENEFICIARY_INFO[key].FIELD_CONTROL = 0;
                    BENEFICIARY_INFO[key].DEFAULT_VALUE = "";
                }
            })
        }else if(field.DEFAULT_VALUE != "0Z" && _this.oppBusiData.BENEFICIARY_INFO[0].BENEFICIARY_RELA == _this.groupDatas.BENEFICIARY_INFO.BENEFICIARY_MODULE[0].FIELDS.BENEFICIARY_RELA.DEFAULT_VALUE){
            let selfBeneficiaryInfo = [{
                "BENEFICIARY_NO":  _this.oppBusiData.custAllInfo.BENEFICIARY_INFO.length==0?"": "1",
                "BENEFICIARY_RELA": _this.oppBusiData.BENEFICIARY_INFO[0].BENEFICIARY_RELA,
                "BENEFICIARY_NAME": _this.oppBusiData.BENEFICIARY_INFO[0].BENEFICIARY_NAME,
                "BENEFICIARY_ID_TYPE": _this.oppBusiData.BENEFICIARY_INFO[0].BENEFICIARY_ID_TYPE,
                "BENEFICIARY_ID": _this.oppBusiData.BENEFICIARY_INFO[0].BENEFICIARY_ID,
                "BENEFICIARY_EXP_DATE": _this.oppBusiData.BENEFICIARY_INFO[0].BENEFICIARY_EXP_DATE,
                "BENEFICIARY_TEL": _this.oppBusiData.custAllInfo.BENEFICIARY_INFO[0].BENEFICIARY_TEL,
                "BENEFICIARY_ADDR": _this.oppBusiData.custAllInfo.BENEFICIARY_INFO[0].BENEFICIARY_ADDR
            }]
            _this.$blMethod.parseMoudleArray(_this,_this.groupDatas["BENEFICIARY_INFO"]["BENEFICIARY_MODULE"], selfBeneficiaryInfo);
            
        }else if(field.DEFAULT_VALUE == "0Z"){
            let selfBeneficiaryInfo = [{
                "BENEFICIARY_NO":  _this.oppBusiData.custAllInfo.BENEFICIARY_INFO.length==0?"": "1",
                "BENEFICIARY_RELA": _this.groupDatas.BENEFICIARY_INFO.BENEFICIARY_MODULE[0].FIELDS.BENEFICIARY_RELA.DEFAULT_VALUE,
                "BENEFICIARY_NAME": _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.USER_FNAME.DEFAULT_VALUE,
                "BENEFICIARY_ID_TYPE": _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.ID_TYPE.DEFAULT_VALUE,
                "BENEFICIARY_ID": _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.ID_CODE.DEFAULT_VALUE,
                "BENEFICIARY_EXP_DATE": _this.groupDatas.CUST_INFO.CUST_BASIC_INFO[0].FIELDS.ID_EXP_DATE.DEFAULT_VALUE,
                "BENEFICIARY_TEL": _this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.MOBILE_TEL.DEFAULT_VALUE,
                "BENEFICIARY_ADDR": _this.groupDatas.CUST_LINK_INFO.CUST_LINK_INFO[0].FIELDS.ADDRESS.DEFAULT_VALUE
            }]
            _this.$blMethod.parseMoudleArray(_this,_this.groupDatas["BENEFICIARY_INFO"]["BENEFICIARY_MODULE"], selfBeneficiaryInfo);
            _.forEach(BENEFICIARY_INFO,function(value, key) {
                if(key != "BENEFICIARY_NO" && key != "BENEFICIARY_RELA"){
                    BENEFICIARY_INFO[key].FIELD_CONTROL = 2
                }
            })
        }
    }
}