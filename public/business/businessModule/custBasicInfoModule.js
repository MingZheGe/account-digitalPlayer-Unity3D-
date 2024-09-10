/*
 * @Description: 
 * 个人客户基本信息模块
 * @Author:  yangyp
 * @Date: 2019-07-30 11:17:48
*/
import custSerivce from "../../service/cust-service.js"
import bizPublicMethod from '../businessTools/bizPublicMethod'
import bizPublicSaveMethod from '../businessTools/bizPublicSaveMethod.js'
import dict from '../../tools/dict';
import stringConfig from '../../tools/stringConfig'
import bizBasicMethod from '../businessTools/bizBasicMethod'
import oppService from '../../service/opp-service'
import csdcService from '../../service/csdc-service';

export default {
    /**
     * 获取关键信息变更初始化数据
     * @param cust_code   客户代码
     * @param int_org     客户机构
     * @param user_type   客户类型
     */
    W0000132 :function (_this, param){
        return _this.$syscfg.K_Request('W0000132', param);
    },
   
    //获取数据
    getData : function(_this,oldBaseForm,newBaseForm,params,syncYMTFlag,isServerTime,SYNC_SYS_FLAG){
        var bankAcctInfoForm = _this.oppBusiData.bankAcctInfo&&_this.oppBusiData.bankAcctInfo,
            bankSignInfo=_this.oppBusiData.bankSignInfo,
            syncBankFlag = bizPublicMethod.$blMethod.isSyncBankFlag(_this,bankAcctInfoForm,newBaseForm);
        let bankList = _this.groupDatas.SYNC_INFO_PAGE.SYNC_INFO_MODULE[0].FIELDS.SYNC_SYS_BANK.DEFAULT_VALUE;
        
        let syncSysForm = {
            // BANK_LIST:_.pluck(bankSignInfo, 'key').join(','),
            BANK_LIST:"",
            SYNC_REMARK:'',
            SYNC_SYS_FLAG:SYNC_SYS_FLAG
        }
    
        let sysSignInfo = [];
        let asynchronyBankStr= oppService.getBusiCommonParamsByCode(_this.oppBusiData.busiCommonParamsArray,'ASYNCHRONY_BANK');
        let asynchronyBankArr = [];
        if(asynchronyBankStr){
            asynchronyBankArr = asynchronyBankStr.split(",");
        }
        if(_this.oppBusiData.bankSignInfo &&_this.oppBusiData.bankSignInfo.length){
            _this.oppBusiData.bankSignInfo.forEach(element => {
                // console.log('银行状态===',element.CONTRACT_STATUS);
                // if(_.indexOf(asynchronyBankArr,element.EXT_ORG) == -1 && element.CONTRACT_STATUS == "0"){
                //     //如果不在这个列表，就需要进行同步银行
                //     sysSignInfo.push(element);
                // }
                if(bankList.includes(element.EXT_ORG)){
                    sysSignInfo.push(element);
                }
            });
        }
        
        if(sysSignInfo.length){
             syncSysForm = {
                BANK_LIST:_.pluck(sysSignInfo, 'key').join(','),
                SYNC_REMARK:'',
                SYNC_SYS_FLAG:SYNC_SYS_FLAG
            }
        }
        
        let custAllInfo = _this.$storage.getJsonSession(_this.$definecfg.CUST_ALL_INFO) || {};
        let oldBaseInfo  = custAllInfo.BASIC_INFO;
        if(_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_TYPE.FIELD_CONTROL == "0"){
            let otherObj = {};
            if(_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_CUST_NAME){
                otherObj.OTHER_CUST_NAME = _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_CUST_NAME.DEFAULT_VALUE;
            }
            if(_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_TYPE){
                otherObj.OTHER_ID_TYPE = _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_TYPE.DEFAULT_VALUE;
                otherObj.FZ_ID_TYPE = _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_TYPE.DEFAULT_VALUE;
            }
            if(_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_EXP_DATE){
                otherObj.OTHER_ID_EXP_DATE = _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_EXP_DATE.DEFAULT_VALUE;
                otherObj.FZ_ID_EXP_DATE = _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_EXP_DATE.DEFAULT_VALUE;
            }
            if(_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_CODE){
                otherObj.OTHER_ID_CODE = _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_CODE.DEFAULT_VALUE;
                otherObj.FZ_ID_CODE = _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_CODE.DEFAULT_VALUE;
            }
            if(_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_ADDR){
                otherObj.OTHER_ID_ADDR = _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_ADDR.DEFAULT_VALUE;
                otherObj.FZ_ID_ADDR = _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_ADDR.DEFAULT_VALUE;
            }
            Object.assign(oldBaseInfo,otherObj);
        }else {
            delete oldBaseInfo.FZ_ID_TYPE;
            delete oldBaseInfo.FZ_ID_ADDR;
            delete oldBaseInfo.FZ_ID_CODE;
            delete oldBaseInfo.FZ_ID_EXP_DATE;
        }
    
        let validateCityStr= "0";
        if(oldBaseInfo.ID_TYPE == "01"){
            //护照的
            if(oldBaseInfo.INOUTSIDE_IDENTITY == "0"){
                validateCityStr = "1";
            }
        }
    
        let newBankAcctObj  = {
            "IDTYPE":_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.ID_TYPE.DEFAULT_VALUE,
            "FULLNAME":_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.USER_FNAME.DEFAULT_VALUE,
            "IDNO":_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.ID_CODE.DEFAULT_VALUE,
        }

        let saveModel = ["CUST_BASIC_INFO_STEP1"];
        
        let NEW_BASIC_INFO = bizPublicSaveMethod.getNewBaseForm(_this,newBaseForm);
        if("CUST_BASIC_INFO_STEP2" in _this.groupDatas){
            Object.assign(saveModel,"CUST_BASIC_INFO_STEP2");
        }
        if("CUST_BASIC_INFO_STEP3" in _this.groupDatas){
            Object.assign(saveModel,"CUST_BASIC_INFO_STEP3");
        }
        // let saveBasicInfo = bizPublicSaveMethod.getSaveData(_this,"CUST_BASIC_INFO",saveModel,oldBaseInfo);
        // console.log('saveBasicInfo====', JSON.stringify(saveBasicInfo));
        // Object.assign(params,{"CUST_BASIC_INFO":saveBasicInfo});

        let syncDefault = _this.groupDatas.SYNC_INFO_PAGE.SYNC_INFO_MODULE[0].FIELDS.SYNC_SYS_FLAG.DEFAULT_VALUE;

        var resObj = {
            //是否港澳台居民证之间变化的标志
            HMT_RESIDENT_FLAG: (_.indexOf(["0s","0b","0c","0d"],oldBaseForm.ID_TYPE) != -1 &&  _.indexOf(["0s","0b","0c","0d"],newBaseForm.ID_TYPE.DEFAULT_VALUE)!=-1 )? "1" : "0",
            //判断修改了证件类型使客户变成境内工作的外国人标志
            IS_CHANGE_TO_FOREIGNER: "0" ,
            jumpJudgeBusiTimes : isServerTime == "1"?"1":"0",
            policeCheckFlag : _this.oppBusiData.policeCheckFlag,
            policeData : _this.oppBusiData.policeData,
            is15To18 : (!_.isObject(newBaseForm.USER_FNAME.DEFAULT_VALUE) && !_.isObject(newBaseForm.ID_TYPE.DEFAULT_VALUE) && _.isObject(newBaseForm.ID_CODE.DEFAULT_VALUE) && _.trim(oldBaseForm.ID_CODE).length === 15 && utils.updateCardNo(oldBaseForm.ID_CODE) == newBaseForm.ID_CODE.DEFAULT_VALUE) ? "1" : "0",
            bankSignInfo : bankSignInfo,
            OLD_BASE_INFO : oldBaseInfo,
            CHANGE_KEY_FLAG:bizPublicMethod.$blMethod.checkImportantInfoChange(_this.oppBusiData.custBaseInfo, _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS)?"1":"0",
            CHANGE_IMPORTANT:bizPublicMethod.$blMethod.checkImportantInfoChange(_this.oppBusiData.custBaseInfo, _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS)?"1":"0",
            CITIZENSHIP:oldBaseInfo.CITIZENSHIP,
            OLD_BANK_ACCT : bizPublicMethod.$blMethod.getOldBankAcct(_this),
            CHANGE_BANK_INFO : syncBankFlag,
            noSameFlag : _this.oppBusiData.noSameFlag,  //客户银证信息是否相同，false相同 true不相同
            IDCARD_READ_FLAG: _this.$storage.getSession(_this.$definecfg.READ_CARD)== 1 ? "1" :"0",
            NEW_BASE_INFO : NEW_BASIC_INFO,
            SYNC_SYS : {
                NEW_YMT_FLAG :  syncDefault.includes('1')? "1" : "0",
                NEW_SHARE_FLAG :  syncDefault.includes('2')? "1" : "0",  //同步股东
                NEW_FUND_FLAG :  syncDefault.includes('3')? "1" : "0",
                NEW_BANK_FLAG : syncBankFlag
            }, //同步中登标识  修改关键信息三要素， 职业，联系地址，邮编，学历 需要同步中登
            SYNC_BANK_LIST:_.filter(bankSignInfo, function(obj){
                return syncSysForm.BANK_LIST.indexOf(obj.key) !== -1;
            }),
            SYNC_SYS_FORM:syncSysForm,
            ID_TYPE:_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.ID_TYPE.DEFAULT_VALUE,
            COLLECT_ZD_IMG_FLAG: syncYMTFlag,//未勾选同步中登，无需采集证券账户业务申请表 "1" 需要采集 "0" 不需要采集
            NEW_BANK_ACCT : newBankAcctObj,
            MONITOR_CTRL_FLAG : "0",  //重点监控账户名单标识：1:提示（需要采集影像），2:禁止，其余的为正常
            VALIDATE_CITY : validateCityStr || "0"
        };
        if(_.isObject(newBaseForm.USER_FNAME.DEFAULT_VALUE) || _.isObject(newBaseForm.ID_CODE.DEFAULT_VALUE) || _.isObject(newBaseForm.ID_TYPE.DEFAULT_VALUE) ) {
            params["IDENTITY_CHANGED"] = "1"; // 提交三要素身份变化标志位
            if(!_.isObject(newBaseForm.USER_FNAME.DEFAULT_VALUE) && !_.isObject(newBaseForm.ID_TYPE.DEFAULT_VALUE) && _.isObject(newBaseForm.ID_CODE.DEFAULT_VALUE) && _.trim(oldBaseForm.ID_CODE).length === 15 && utils.updateCardNo(oldBaseForm.ID_CODE) == newBaseForm.ID_CODE.DEFAULT_VALUE) {
                params["COLLECT_IDENTITY_CHANGED"] = "0";
            }else {
                params["COLLECT_IDENTITY_CHANGED"] = "1";
            }
        }else {
            params["COLLECT_IDENTITY_CHANGED"] = "0";
            params["IDENTITY_CHANGED"] = "0"; 
        }

        //中登无纸化一码通单据盖章
        resObj.YMT_CODE = params.SELECT_YMT_CODE || params.YMT_CODE || oldBaseInfo.YMT_CODE;
        resObj.CSDC_YMT_DATA = params.SELECT_YMT_CODE || params.YMT_CODE || oldBaseInfo.YMT_CODE;
        resObj.IS_YMT_CODE_SEAL = !!resObj.YMT_CODE ? "0" : "1";
        resObj.CODE_FLAG = syncYMTFlag;
        let bankImageFlag='noNeed';
        let changeFlag='noChange';
        var oldfms= _this.oppBusiData.bankInfoFms &&_.extend({},{FULLNAME: _this.oppBusiData.bankInfoFms.TRANS_NAME,IDTYPE: _this.oppBusiData.bankInfoFms.ID_TYPE,IDNO: _this.oppBusiData.bankInfoFms.ID_CODE});
        if(oldfms && !_.isEmpty(oldfms) && bankAcctInfoForm && !_.isEmpty(bankAcctInfoForm) ){
            if(oldfms.FULLNAME != bankAcctInfoForm.FULLNAME ||  oldfms.IDTYPE != bankAcctInfoForm.IDTYPE || oldfms.IDNO != bankAcctInfoForm.IDNO){
                changeFlag='change';
            }
        }
        resObj.OLD_BANK_ACCT_FMS = oldfms;
        if(_this.userType == '2' && syncSysForm.SYNC_SYS_FLAG.indexOf("4") != -1 &&  changeFlag =='change'){
            bankImageFlag='need';
        }
        resObj.BANKIMAGEFLAG = bankImageFlag;
        let limitFlag = false;
        var limitData = [{
            value:"1",
            text: "禁止买入"
        },{
            value:"2",
            text: "禁止卖出"
        },{
            value:"3",
            text: "禁止指定交易"
        },{
            value : "C",
            text : "禁止撤指定"
        },{
            value : "Z",
            text : "禁止转托管"
        }];
        limitData = _.filter(limitData,function(o){
            return _.indexOf(_this.oppBusiData.limitData, o.value) != -1;
        });
        if(limitData && limitData.length > 0){
            limitFlag = true;
        }else{
            limitFlag = false;
        }
        resObj.limitFlag = limitFlag;
        resObj.limitData = limitData;
        Object.assign(params,resObj);
    },
    
    // 封装请求中登认证函数
    requestSaveValideData : function (_this,params)  {
        let that = this;
        let oldBaseForm = _this.oppBusiData.custBaseInfo;
        let newBaseForm = {};
        if("CUST_BASIC_INFO_STEP2" in _this.groupDatas.CUST_INFO_PAGE1) {
            if(_this.groupDatas.CUST_INFO_PAGE2&&_this.groupDatas.CUST_INFO_PAGE2.CUST_BASIC_INFO_STEP3){
                Object.assign(newBaseForm   ,_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS
                    ,_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS
                    ,_this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS
                    ,_this.groupDatas.CUST_INFO_PAGE2.CUST_BASIC_INFO_STEP3[0].FIELDS);
            }else{
                Object.assign(newBaseForm   ,_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS
                    ,_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS
                    );
                
            }
            
        }else{
            if(!_this.groupDatas.CUST_INFO_PAGE2){
                Object.assign(newBaseForm,_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS);
            }else if(_this.groupDatas.CUST_INFO_PAGE2&&_this.groupDatas.CUST_INFO_PAGE2.CUST_BASIC_INFO_STEP3){
                Object.assign(newBaseForm,_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS
                    ,_this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS
                    ,_this.groupDatas.CUST_INFO_PAGE2.CUST_BASIC_INFO_STEP3[0].FIELDS);
            }else{
                Object.assign(newBaseForm,_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS
                    ,_this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS);
            }
            
        }
       
        
        let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
        // let syncYMTFlag = bizPublicMethod.$blMethod.isSyncYMTFlag(_this,oldBaseForm,newBaseForm);
        let syncBankFlag = bizPublicMethod.$blMethod.isSyncBankFlag(_this, _this.oppBusiData.bankAcctInfo,newBaseForm);
        let tempSysFlag =  "2,3";
        let syncDefault = _this.groupDatas.SYNC_INFO_PAGE.SYNC_INFO_MODULE[0].FIELDS.SYNC_SYS_FLAG.DEFAULT_VALUE;
        let syncYMTFlag = syncDefault.includes('1')? "1" : "0";
        if(syncYMTFlag == "1"){
            if(syncBankFlag  == "1"&& _this.oppBusiData.bankSignInfo && _this.oppBusiData.bankSignInfo.length){
                tempSysFlag = "1,2,3,4";
            }else{
                tempSysFlag = "1,2,3";
            }
        }else{
            if(syncBankFlag  == "1"&& _this.oppBusiData.bankSignInfo && _this.oppBusiData.bankSignInfo.length){
            tempSysFlag = "2,3,4";
            }else{
            tempSysFlag = "2,3";
            }
        }
        let param = { "CUST_CODE":customerInfo.CUST_CODE,
                        "BUSI_CODE":_this.busiCode,
                        "BUSI_NAME": _this.$storage.getSession(_this.$definecfg.BUSI_NAME),
                        "INT_ORG":customerInfo.INT_ORG,
                        "SUBJECT_IDENTITY":customerInfo.SUBJECT_IDENTITY,
                        "SYNC_SYS_FLAG":syncDefault,
                        "CITIZENSHIP":customerInfo.CITIZENSHIP,
                        "IS_CAN_EXPAND_FLAG":(!_.isObject(newBaseForm.USER_FNAME.DEFAULT_VALUE) && !_.isObject(newBaseForm.ID_TYPE.DEFAULT_VALUE) && _.isObject(newBaseForm.ID_CODE.DEFAULT_VALUE) && _.trim(oldBaseForm.ID_CODE).length === 15 && utils.updateCardNo(oldBaseForm.ID_CODE) == newBaseForm.ID_CODE.DEFAULT_VALUE) ? "1" : "0",
                        "OLD_CUST_FNAME":oldBaseForm.USER_FNAME,
                        "OLD_ID_TYPE":oldBaseForm.ID_TYPE,
                        "OLD_ID_CODE":oldBaseForm.ID_CODE,
                        "NEW_CUST_FNAME":newBaseForm.USER_FNAME.DEFAULT_VALUE,
                        "NEW_ID_TYPE":newBaseForm.ID_TYPE.DEFAULT_VALUE,
                        "NEW_ID_CODE":newBaseForm.ID_CODE.DEFAULT_VALUE};
        return _this.$syscfg.K_Request('W0000168', param).then(function(res){
            console.log('提交前的确认准入res===', res);
            if(res.Code == "0"){
                // if(res.Data && res.Data[0].VALIDATE_TYPE == "0"){
                //     _this.messageBox({
                //         hasMask:true,
                //         messageText:res.Data[0].VALIDATE_MSG,
                //         confirmButtonText:'确定',
                //         typeMessage:'warn', 
                //         showMsgBox:true,
                //         confirmedAction: function(){
                //             _this.$router.push(_this.$bizhomecfg.getHomeConfig());
                //         }
                //     }
                //     throw "preventNextStep";
                // }else if(res.Data&&res.Data[0].VALIDATE_TYPE == "1"){
                //     //中登没有正常的一码通
                //     let that = this;
                //     _this.messageBox({
                //         hasMask:true,
                //         messageText:res.Data[0].VALIDATE_MSG + "如您仍需办理此业务，请到柜台办理或联系现场工作人员。",
                //         confirmButtonText:'点击重试',
                //         cancelButtonText:'返回首页',
                //         typeMessage:'warn', 
                //         showMsgBox:true,
                //         confirmedAction: function(){
                //             that.requestSaveValideData(_this,params);
                //         },
                //         canceledAction: function(){
                //             _this.$router.push(_this.$bizhomecfg.getHomeConfig()); 
                //         }
                //     })
                //     throw "preventNextStep";
                //         // if(syncYMTFlag ){
                //         //     syncYMTFlag = false;
                //         //     if(syncBankFlag && _this.oppBusiData.bankSignInfo && _this.oppBusiData.bankSignInfo.length){
                //         //       tempSysFlag = "2,3,4";
                //         //     }else{
                //         //       tempSysFlag = "2,3";
                //         //     }
                //         // }
                // }

                let qsName = _this.$bizcfg.getBizConfigName(_this.$definecfg.QSJGDM_CONST[_this.$basecfg.qsVersion]);
                let ymtFlag = false;
                let msgTxt = '没有查询到您到一码通账号,如您仍需办理此业务，请到柜台办理或联系现场工作人员。';
                if(qsName == 'GUOXIN'){
                    if(res.Data && res.Data.length){
                        params.SELECT_YMT_CODE = res.Data[0].YMT_CODE || "";
                        params.jumpJudgeBusiTimes = res.Data[0].jumpJudgeBusiTimes || "0" ;
                        params.SELECT_YMT_CODE == "" && (ymtFlag = true);
                    }
                }else{
                    if(_.isEmpty(res.Data[0].YMT_DATA)){
                        ymtFlag = true;
                    }else if(res.Data[0].YMT_DATA.length>1){
                        ymtFlag = true;
                        msgTxt = '您有多个中登一码通账户，无法同步一码通';
                    }else{
                        params.SELECT_YMT_CODE = res.Data[0].YMT_DATA[0].YMT_CODE || "";
                        params.jumpJudgeBusiTimes = res.Data[0].jumpJudgeBusiTimes || "0" ;
                        ymtFlag = false;
                    };
                }
                
                // if(ymtFlag && params.jumpJudgeBusiTimes == "1" && syncYMTFlag == "1"){
                //     _this.messageBox({
                //         hasMask:true,
                //         messageText:"没有查询到您到一码通账号" + "，如您仍需办理此业务，请到柜台办理或联系现场工作人员。",
                //         confirmButtonText:'点击重试',
                //         cancelButtonText:'返回首页',
                //         typeMessage:'warn', 
                //         showMsgBox:true,
                //         confirmedAction: function(){
                //             that.requestSaveValideData(_this,params);
                //         },
                //         canceledAction: function(){
                //             _this.$router.push(_this.$bizhomecfg.getHomeConfig()); 
                //         }
                //     })
                //     throw "preventNextStep";
                // }
                return that.getData(_this,oldBaseForm,newBaseForm,params,syncYMTFlag,res.Data[0].jumpJudgeBusiTimes,syncDefault);
                
            }else{
                _this.messageBox({
                    hasMask:true,
                    messageText:res.Msg + "如您仍需办理此业务，请到柜台办理或联系现场工作人员。",
                    confirmButtonText:'点击重试',
                    cancelButtonText:'返回首页',
                    typeMessage:'warn', 
                    showMsgBox:true,
                    confirmedAction: function(){
                        that.requestSaveValideData(_this,params);
                    },
                    canceledAction: function(){
                        _this.$router.push({ path: _this.$bizhomecfg.getHomeConfig() }); 
                    }
                })
                throw "preventNextStep";
            }
            
        });
    },
    /*
    * @Description: 钩子函数 加载历史数据之前触发
    *@Date: 2019-07-30 11:17:48
    */
    custBasicInfoBeforeLoadBiz: function (_this) {
        _this.$set(_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0], "MODULE_CUSTOMIZE", "1");
        _this.$set(_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0], "MODULE_READ", "1");
        _this.$set(_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0], "MODULE_ZDCUSTOMIZE", "1");
        return Promise.all([
            this.W0000132(_this,bizPublicMethod.$blMethod.getBaseRequestData(_this)),
            custSerivce.W0000134(bizPublicMethod.$blMethod.getBaseRequestData(_this)),
            custSerivce.W0000135(bizPublicMethod.$blMethod.getBlackListRequestData(_this)),
            _this.$syscfg.getSysDate() ,
            dict.getDictData("CUACCT_STATUS")
        ]).then(res => {
            let busiData = res[0],//数据回填
                accountKeyMarking = res[1],//重点账户信息检查
                accountWhiteListMarking = res[2],//国籍白名单检查
                getSystemDate = res[3];//获取当天时间
            if(busiData.Code != 0){
                //重点账户检查
                _this.messageBox({
                    hasMask:true,
                    messageText:busiData.Msg,
                    confirmButtonText:'刷新重试',
                    cancelButtonText:'返回首页',
                    typeMessage:'warn', 
                    showMsgBox:true ,
                    confirmedAction: function(){
                        _this.refreshPage();
                    },
                    canceledAction: function(){
                        _this.$router.push({ path: _this.$bizhomecfg.getHomeConfig() }); 
                    }
                })
                return;
            }else{
                if(accountKeyMarking){
                    //重点账户检查
                    _this.messageBox({
                        hasMask:true,
                        messageText:"您当前仍处于深沪交易所重点监控账户监控期，禁止通过VTM办理此业务，请到柜台联系现场工作人员处理。点击确定返回首页",
                        confirmButtonText:'确定',
                        typeMessage:'warn', 
                        showMsgBox:true ,
                        confirmedAction: function(){
                            _this.$router.push({ path: _this.$bizhomecfg.getHomeConfig() }); 
                        }
                    })
                    return;
                }
    
                if(accountWhiteListMarking){
                    ///国籍白名单检查
                    _this.messageBox({
                        hasMask:true,
                        messageText:"您所属国家（地区）为洗钱高风险地区，禁止通过VTM自助办理此业务，请到柜台联系现场工作人员处理。点击确定返回首页",
                        confirmButtonText:'确定',
                        typeMessage:'warn', 
                        showMsgBox:true,
                        confirmedAction: function(){
                            _this.$router.push({ path: _this.$bizhomecfg.getHomeConfig() });
                        }
                    })
                    return;
                }
                if(getSystemDate){
                    //获取系统时间
                    _this.$storage.setSession(_this.$definecfg.TODAY_TIME,getSystemDate);
                }

                //合并数据
                Object.assign(_this.oppBusiData, busiData.Data[0]);
               
                ///银证三要素不相同的标志
                _this.oppBusiData.noSameFlag = false;
                var cancelBank = _.filter(_this.oppBusiData.bankSignInfo, function(obj){ return obj.CONTRACT_STATUS === "9" }),
                    cancelBankCode = _.pluck(cancelBank, "EXT_ORG");
                _this.oppBusiData.bankAcctInfo = _.filter(_this.oppBusiData.bankAcctInfo, function(obj){ return _.indexOf(cancelBankCode, obj.BANKCODE) === -1 });
                _.each(_this.oppBusiData.bankAcctInfo, function(obj){
                    _.each(_this.oppBusiData.bankAcctInfo, function(tempObj){
                        if( obj.BANKCODE !== tempObj.BANKCODE && ( obj.FULLNAME !== tempObj.FULLNAME || obj.IDNO !== tempObj.IDNO || obj.IDTYPE !== tempObj.IDTYPE ) ){
                            _this.oppBusiData.noSameFlag = true;
                            return false;
                        }
                    });
                });
    
                if( _this.oppBusiData.noSameFlag === true && _this.oppBusiData.bankAcctInfo.length >1){  //银证三要素不相同
                    _this.messageBox({
                        hasMask:true,
                        messageText:"您存在多条与三要素不一致的银证信息，请临柜通过银证信息修改菜单进行修改或联系现场工作人员！",
                        confirmButtonText:'返回首页',
                        typeMessage:'warn', 
                        showMsgBox:true,
                        confirmedAction: function(){
                            _this.$router.push({ path: _this.$bizhomecfg.getHomeConfig() }); 
                        }
                    })
                    return;
                _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1
                }
                // 以下证件类型已经禁用 ：军官证和士兵证 户口本 回乡证
                let idFilter = '00,01,06,07,08,09,0b,0c,0d,0e,0f,0g,0h,0i,0j,0s';
                _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.ID_CODE.VALID_TYPE = "length[6,30]|on-blur";
                _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.ID_TYPE.FIELD_DICT_FILTER = idFilter.split(",");
                _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.ID_ADDR.FIELD_TYPE = "normalinput";

                //中泰 个人开户姓名只能输入中英文数字跟. 不然无法签名
                if(_this.userType == "0"){
                    _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0]["FIELDS"]["USER_FNAME"].VALID_TYPE =  "valZT[1,128]";
                    _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0]["FIELDS"]["USER_NAME"].VALID_TYPE =  "valZT[1,16]"; 
                }
                //解析历史数据
                this.custBasicInfoParseParseOldBiz(_this);
            }
        });
    },
    /*
    *@Description: 钩子函数：加载历史数据后触发
    *@Date: 2019-07-30 11:17:48
    */
    custBasicInfoAfterLoadBiz: function (_this) {
        //每次进入的时候 默认客户没有点击输入完毕按钮
        _this.oppBusiData.bankTypeBool = false;
        _this.groupDatas["CUST_INFO_PAGE1"]["CUST_BASIC_INFO_STEP1"][0]["FIELDS"]["ID_CODE"].VALID_TYPE = "length[6,30]";
        //设置辅助证件信息
        let oppBasicInfo = _this.historyData.CUST_BASIC_INFO;
        if(oppBasicInfo){
            //证件类型是0s的话 即使不修改三要素也展示辅助证件
            if(_.indexOf(["0b","0c","0d","0e","0i","0j","0s"], oppBasicInfo.ID_TYPE) != -1){
                if(_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_CUST_NAME){
                    _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_CUST_NAME.FIELD_CONTROL = "0";
                }
                if(_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_ADDR){
                    _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_ADDR.FIELD_CONTROL = "0";
                }
                _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_CODE.FIELD_CONTROL = "0";
                _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_EXP_DATE.FIELD_CONTROL = "0";
                _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_TYPE.FIELD_CONTROL = "0";
            }
            // bizPublicMethod.$blMethod.parseGroupsMouduleData(_this,["CUST_BASIC_INFO_STEP1","CUST_BASIC_INFO_STEP2","CUST_BASIC_INFO_STEP3"],oppBasicInfo);
        }
    },
    /*
    *@Description: 钩子函数：页面激活
    *@Date: 2019-07-30 11:17:48
    */
    custBasicInfoPageActivated: function (_this) {
        _this.$refs.flowTip.pushFlowTip({
            title:`若客户身份信息无法读取，请手工录入相关客户信息，并进行公安联网校验和中登校验！`,
            type:'warning',
            key:'name'
        });
        if(_.isEmpty(_this.oppBusiData.ZDCSDCYmt) && _.isEmpty(_this.oppBusiData.abnorStateZdYmt)){
            _this.$refs.flowTip.pushFlowTip({
                title:`该客户三要素下未找到对应中登一码通账户，若要同步修改一码通信息，请在账户注册资料修改菜单进行！`,
                type:'warning',
                key:'name10'
            });
        }else if(_.isEmpty(_this.oppBusiData.ZDCSDCYmt) && _this.oppBusiData.abnorStateZdYmt.length>0){
            _this.$refs.flowTip.pushFlowTip({
                title:`客户中登一码通状态不正常，请勿勾选“同步中登”！`,
                type:'warning',
                key:'name10'
            });
        }else if(_this.oppBusiData.ZDCSDCYmt.length == 1) {
            let cnt = 0;
            _.each(_this.oppBusiData.changeImportHistoryData,function(obj){
                // 过滤身份证正常升位                           
                if( obj.NEW_ID_CODE && !(obj.ID_TYPE == "00" && obj.ID_CODE.length == 15 && obj.NEW_ID_TYPE == "00" && obj.NEW_ID_CODE.length == 18)){
                    cnt ++;
                }
            });
            if(cnt >=1) {
                _this.$refs.flowTip.pushFlowTip({
                    title:`客户曾进行关键信息变更，如需再次变更另一项关键信息，请通过邮寄方式将投资者的业务申请资料提交至中国登记结算公司。`,
                    type:'warning',
                    key:'name1'
                });
            }
        }else if(_this.oppBusiData.ZDCSDCYmt.length > 1) {
            _this.$refs.flowTip.pushFlowTip({
                title:`客户在中登系统内存在多个一码通账户，请先进行一码通账户规范！`,
                type:'warning',
                key:'name2'
            });
        }
        if(_this.groupDatas.CUST_INFO_PAGE2 && _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO){
            _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.BANK_AUTH_DATA.FIELD_CONTROL = "1";
             //银行卡信息数据回填
            if(bizPublicMethod.$blMethod.check_Bank_Module_Radio_flag(_this)){
                _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.MODULE_BANK_RADIO_BUTTON.DEFAULT_VALUE = "true";
            }else{
                _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.MODULE_BANK_RADIO_BUTTON.DEFAULT_VALUE = "false";
            }
        }

        if(_this.groupDatas.CUST_INFO_PAGE2&&_this.groupDatas.CUST_INFO_PAGE2.CUST_BASIC_INFO_STEP3){
            _this.groupDatas.CUST_INFO_PAGE2.CUST_BASIC_INFO_STEP3[0].FIELDS.MAIL_ADDR.isShowUseIDAddress = true;
            _this.groupDatas.CUST_INFO_PAGE2.CUST_BASIC_INFO_STEP3[0].FIELDS.MAIL_ADDR.FIELD_FUNCTION = "USE_ID_ADDRESS";
        }
       
        //港澳台用户解析
        let tempIdType  = _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.ID_TYPE.DEFAULT_VALUE;
        if(_.indexOf(["0b","0c","0d","0e","0i","0j","0s"],tempIdType) != -1){
          //设置港澳台
          if(tempIdType == "0s"){
            //港澳台居住证
            _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_TYPE.FIELD_DICT_FILTER = ["0b","0c","0d"];
          }else if(tempIdType == "0b"){
            //香港居民通行证
            _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_TYPE.FIELD_DICT_FILTER = ["0i","0s"];
          }else if(tempIdType == "0c"){
            //澳门居民通行证
            _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_TYPE.FIELD_DICT_FILTER = ["0j","0s"];
          }else if(tempIdType == "0d"){
            //台湾居民通行证
            _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_TYPE.FIELD_DICT_FILTER = ["0s"];
          }else if(tempIdType == "0i"){
            //香港居民身份证
            _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_TYPE.FIELD_DICT_FILTER = ["0b","0s"];
          }else if(tempIdType == "0j"){
            //澳门居民通行证
            _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_TYPE.FIELD_DICT_FILTER = ["0c","0s"];
          }
        }
    
    
        //银行密码还原按钮是否显示的逻辑
        //默认银行信息与证件信息保持一致
        if(_this.groupId == "CUST_INFO_PAGE2"){
          if(bizPublicMethod.$blMethod.checkImportantInfoChange(_this.oppBusiData.custBaseInfo, _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS) && _this.oppBusiData.bankSignInfo && _this.oppBusiData.bankSignInfo.length){
            _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].MODULE_CONTROL = "1";//隐藏模块  
          }else{
            _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].MODULE_CONTROL = "0";//隐藏模块        
          }       
        }
    
        // TODO 回填身份证读卡信息
        if(_this.$storage.getSession(_this.$definecfg.READ_CARD) == 1 && _.get(_this.$route,"query.moduleId") == "CUST_BASIC_INFO_STEP1"){
          console.error(_this.$route.query["moduleId"]);
          console.error(_this.$store.state.cardData);
          let readCardData = _this.$store.state.cardData;
          let tempIDType = _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0]["FIELDS"]["ID_TYPE"].DEFAULT_VALUE;
          //读卡0 二代身份证   1外国人永久居民证  2港澳台居住证
          if((readCardData.ID_TYPE == "0" && tempIDType != "00") 
          || (readCardData.ID_TYPE == "1" && tempIDType != "0K") 
          || (readCardData.ID_TYPE == "2" && tempIDType != "0s") ){
            _this.messageBox({
              hasMask:true,
              messageText:"对不起，暂时不支持变更证件类型，如您仍需办理此业务，请到柜台办理或联系现场工作人员。",
              confirmButtonText:'确定',
              typeMessage:'warn', 
              showMsgBox:true,
              confirmedAction: function(){
                _this.$router.push({ path: _this.$bizhomecfg.getHomeConfig() });
              }
            })
            return;
          }
       
          //  CUST_FNAME: i[0].replace("Name=", ""),
          // USER_FNAME: i[0].replace("Name=", ""),
          // SEX: i[1].replace("Sex=", "") + "性",
          // NATIONALITY: i[2].replace("Nation=", "") + "族",
          // BIRTHDAY: i[3].replace("Born=", ""),
          // ID_ADDR: i[4].replace("Address=", ""),
          // ID_CODE: i[5].replace("IDCardNo=", ""),
          // ID_ISS_AGCY: i[6].replace("GrantDept=", ""),
          // ID_BEG_DATE: i[7].replace("UserLifeBegin=", ""),
          // ID_EXP_DATE: i[8].replace("UserLifeEnd=", ""),
          // ID_TYPE: "00"
          _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0]["FIELDS"]["USER_FNAME"].DEFAULT_VALUE = readCardData.CUST_FNAME;
          _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0]["FIELDS"]["USER_NAME"].DEFAULT_VALUE = readCardData.CUST_NAME; 
          _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0]["FIELDS"]["ID_CODE"].DEFAULT_VALUE = readCardData.ID_CODE;
          _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0]["FIELDS"]["ID_BEG_DATE"].DEFAULT_VALUE = readCardData.ID_BEG_DATE;
          _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0]["FIELDS"]["ID_EXP_DATE"].DEFAULT_VALUE = readCardData.ID_EXP_DATE;
          _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0]["FIELDS"]["ID_ISS_AGCY"].DEFAULT_VALUE = readCardData.ID_ISS_AGCY;
          _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0]["FIELDS"]["ID_ADDR"].DEFAULT_VALUE = readCardData.ID_ADDR;
          if(_this.groupDatas.CUST_INFO_PAGE2&&_this.groupDatas.CUST_INFO_PAGE2.CUST_BASIC_INFO_STEP3){
            _this.groupDatas.CUST_INFO_PAGE2.CUST_BASIC_INFO_STEP3[0]["FIELDS"]["BIRTHDAY"].DEFAULT_VALUE = readCardData.BIRTHDAY;
          }
        }
        let custAllInfo = _this.$storage.getJsonSession(_this.$definecfg.CUST_ALL_INFO) || {};
        let oppUserInfo  = custAllInfo.BASIC_INFO;
        let defUserInfo = _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS;
        let Case = {
            case1: false,
            case2: false,
            case3: false,
            case4: false,
            case5: false,
            case6: false,
            case7: false,
        };
        let oppFname = oppUserInfo.USER_FNAME,
            oppIdType = oppUserInfo.ID_TYPE,
            oppIdCode = oppUserInfo.ID_CODE,
            defFname = defUserInfo.USER_FNAME.DEFAULT_VALUE,
            defIdType = defUserInfo.ID_TYPE.DEFAULT_VALUE,
            defIdCode = defUserInfo.ID_CODE.DEFAULT_VALUE;
        if(oppFname==defFname && oppIdType!=defIdType && oppIdCode==defIdCode) {
            Case.case1 = true;
        }
        if(oppFname==defFname && oppIdType==defIdType && oppIdCode!==defIdCode) {
            Case.case2 = true;
        }
        if(oppFname==defFname && oppIdType!=defIdType && oppIdCode!=defIdCode) {
            Case.case3 = true;
        }
        if(oppFname!=defFname && oppIdType!=defIdType && oppIdCode==defIdCode) {
            Case.case4 = true;
        }
        if(oppFname!=defFname && oppIdType==defIdType && oppIdCode!=defIdCode) {
            Case.case5 = true;
        }
        if(oppFname!=defFname && oppIdType!=defIdType && oppIdCode!=defIdCode) {
            Case.case6 = true;
        }
        if(oppFname!=defFname && oppIdType==defIdType && oppIdCode==defIdCode) {
            Case.case7 = true;
        }
        _this.oppBusiData.doubleMod = Case;
        
        
    
    },
    /*
    *@Description: 数据解析或回填
    *@Date: 2019-07-30 11:17:48
    */
    custBasicInfoLoadBizData: async function (_this, busiData) {
    
    },
    /*
    *@Description: 解析客户360数据
    *@Date: 2019-07-30 11:17:48
    */
    custBasicInfoParseParseOldBiz: function (_this) {
        let oppData = bizPublicMethod.$blMethod.getCustomerAllData(_this);
        oppData["OTHER_ID_TYPE"] =  _this.oppBusiData.custAssociateInfo && _this.oppBusiData.custAssociateInfo.ID_TYPE
                                 || _this.oppBusiData.custBaseInfo&&_this.oppBusiData.custBaseInfo.FZ_ID_TYPE || "";
        oppData["OTHER_ID_EXP_DATE"] =  _this.oppBusiData.custAssociateInfo &&  _this.oppBusiData.custAssociateInfo.ID_EXP_DATE
                                     || _this.oppBusiData.custBaseInfo&&_this.oppBusiData.custBaseInfo.FZ_ID_EXP_DATE || "";
        oppData["OTHER_ID_CODE"] =  _this.oppBusiData.custAssociateInfo &&  _this.oppBusiData.custAssociateInfo.ID_CODE
                                 || _this.oppBusiData.custBaseInfo&&_this.oppBusiData.custBaseInfo.FZ_ID_CODE || "";
        oppData["OTHER_CUST_NAME"] =  _this.oppBusiData.custAssociateInfo &&  _this.oppBusiData.custAssociateInfo.ASSOCIATE_NAME || "";
        oppData["OTHER_ID_ADDR"] =  _this.oppBusiData.custAssociateInfo &&  _this.oppBusiData.custAssociateInfo.ASSOCIATE_NAME
                                     || _this.oppBusiData.custBaseInfo&&_this.oppBusiData.custBaseInfo.FZ_ID_ADDR || "";
        if( !_.isEmpty(_this.oppBusiData.bankInfoFms)){
            oppData.FULLNAME = _this.oppBusiData.bankInfoFms.TRANS_NAME;
            oppData.IDTYPE = _this.oppBusiData.bankInfoFms.ID_TYPE;
            oppData.IDNO = _this.oppBusiData.bankInfoFms.ID_CODE;
        }
        if(_this.groupDatas.CUST_INFO_PAGE2&&_this.groupDatas.CUST_INFO_PAGE2 && _this.groupDatas.CUST_INFO_PAGE2.CUST_BASIC_INFO_STEP3){
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this,["CUST_BASIC_INFO_STEP1","CUST_BASIC_INFO_STEP2","CUST_BASIC_INFO_STEP3","CUST_BANK_INFO"],oppData);
        }else if(!_this.groupDatas.CUST_INFO_PAGE2){
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this,["CUST_BASIC_INFO_STEP1","CUST_BASIC_INFO_STEP2"],oppData);
        }else{
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this,["CUST_BASIC_INFO_STEP1","CUST_BASIC_INFO_STEP2","CUST_BANK_INFO"],oppData);
        }
       
    },
    /*
    *@Description: 重新加载转换之后的历史数据
    *@Date: 2019-07-30 11:17:48
    */
    custBasicInfoParseOppBiz: function (_this, bdata) { // 解析身份证读卡数据
    
    },
    /* 
    *@Description: 钩子函数：保存拼接的数据
    *@Date: 2019-07-30 11:17:48
    */
    custBasicInfoBeforeSave: function (_this, params) {
        if(_this.groupId == undefined){
            let that = this;
            return that.requestSaveValideData(_this,params);
        }
        
    },
        /**
     * 双录查询
     * 入參 NEW_CUST_FNAME-新客户名称
 *      OLD_CUST_FNAME-旧客户名称
 *      NEW_ID_TYPE-新证件类型
 *      OLD_ID_TYPE-旧证件类型
 *      NEW_ID_CODE-新证件代码
 *      OLD_ID_CODE-旧证件代码
 *      CUST_CODE-客户代码
 *      INT_ORG-客户所属机构
 * 出參 IS_CAN_ACCEPT-是否可继续受理：0-不可以；1-可以   
 *      IS_SYNC_CSDC-是否可同步中登：0-不可以；1-可以   
 *      MSG-提示内容
     */
    W0000295 :function (_this, param){
        return _this.$syscfg.K_Request('W0000295', param);
    },
    custBasicInfoValidate:function(_this){
        if(_this.groupId == "SYNC_INFO_PAGE"){
            let fields = _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS;
            let syncFields = _this.groupDatas.SYNC_INFO_PAGE.SYNC_INFO_MODULE[0].FIELDS;
            let bankInfoFms = _this.oppBusiData.bankInfoFms
            let syncDefault = _this.groupDatas.SYNC_INFO_PAGE.SYNC_INFO_MODULE[0].FIELDS.SYNC_SYS_FLAG.DEFAULT_VALUE;
            if(syncDefault.includes('1')) {
                if(_.isEmpty(_this.oppBusiData.ymtData)){
                    _this.messageBox({
                        hasMask:true,
                        messageText:"客户没有中登一码通账户，不能同步中登！",
                        confirmButtonText:'确定',
                        typeMessage:'warn', 
                        showMsgBox:true,
                        confirmedAction:function () {}
                    })
                    return false;
                }else if(_.isEmpty(_this.oppBusiData.ZDCSDCYmt) && _this.oppBusiData.abnorStateZdYmt.length>0){
                    _this.messageBox({
                        hasMask:true,
                        messageText:"客户中登一码通状态不正常，不能同步中登！",
                        confirmButtonText:'确定',
                        typeMessage:'warn', 
                        showMsgBox:true,
                        confirmedAction:function () {}
                    })
                    return false;
                }
            }
            let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
            let newCustInfo = _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS;
            let dMod = {
                "NEW_CUST_FNAME": newCustInfo.USER_FNAME.DEFAULT_VALUE,
                "OLD_CUST_FNAME": customerInfo.CUST_FNAME,
                "NEW_ID_TYPE": newCustInfo.ID_TYPE.DEFAULT_VALUE,
                "OLD_ID_TYPE": customerInfo.ID_TYPE,
                "NEW_ID_CODE": newCustInfo.ID_CODE.DEFAULT_VALUE,
                "OLD_ID_CODE": customerInfo.ID_CODE,
                "CUST_CODE": customerInfo.CUST_CODE,
                "INT_ORG": customerInfo.INT_ORG,
            }
            return Promise.all([
                this.W0000295(_this,dMod),
            ]).then((res)=> {
                if(res.length && res[0].Code=="0") {
                    if(res[0].Data[0].IS_SYNC_CSDC == "0" && syncDefault.includes('1')) { // 不可以同步中登
                        _this.messageBox({
                            hasMask:true,
                            messageText:res[0].Data[0].MSG,
                            confirmButtonText:'确定',
                            typeMessage:'warn', 
                            showMsgBox:true,
                            confirmedAction:function () {}
                        })
                        return false;
                    }
                    if(res[0].Data[0].IS_CAN_ACCEPT == "0") { // 禁止修改
                        _this.messageBox({
                            hasMask:true,
                            messageText:res[0].Data[0].MSG,
                            confirmButtonText:'确定',
                            typeMessage:'warn', 
                            showMsgBox:true,
                            confirmedAction:function () {}
                        })
                        return false;
                    }
                }
                let doubleMod = _this.oppBusiData.doubleMod;
                if(doubleMod.case4 || doubleMod.case5 || doubleMod.case6) {
                    _this.messageBox({
                        hasMask:true,
                        messageText:"请告知客户：此次为关键信息变更，可能涉及信息双改的情况，若为双改，不能立马生效，需按照公司双改流程进行，且在无特殊情况下，将于5-6个工作日完成!",
                        confirmButtonText:'确定',
                        typeMessage:'warn', 
                        showMsgBox:true,
                        confirmedAction:function () {
                            _this.$router.goRoute("修改对比")
                        }
                    })
                    return false
                }
            })
            // if((bankInfoFms.TRANS_NAME != fields.USER_FNAME.DEFAULT_VALUE || bankInfoFms.ID_TYPE != fields.ID_TYPE.DEFAULT_VALUE) && syncFields.SYNC_SYS_FLAG.DEFAULT_VALUE.includes("1")) {
            //     _this.messageBox({
            //         hasMask:true,
            //         messageText:"请告知客户：此次为关键信息变更，可能涉及信息双改的情况，若为双改，不能立马生效，需按照公司双改流程进行，且在无特殊情况下，将于5-6个工作日完成!",
            //         confirmButtonText:'确定',
            //         typeMessage:'warn', 
            //         showMsgBox:true,
            //         confirmedAction:function () {
            //             _this.$router.goRoute("修改对比")
            //         }
            //     })
            //     return false
            // }
            
        }
        //资料完善和关键信息变更业务逻辑不一致，需要在业务代码里面各自写自己的逻辑，不做逻辑封装
        if(_this.groupId == "CUST_INFO_PAGE1"){  //当前第一页
            
            if(_this.moduleId != "CUST_BASIC_INFO_STEP3" && bizBasicMethod.isDoubleChange(_this)){
                 //判断是否双改。VTM不支持信息双改
                // _this.messageBox({
                //     hasMask:true,
                //     messageText:"您不能同时修改姓名（名称）、证件号码。如有疑问，请详询现场工作人员或致电95538。",
                //     confirmButtonText:'确定',
                //     typeMessage:'warn', 
                //     showMsgBox:true  
                // } )
                // return false;
            }else if(!bizPublicMethod.$blMethod.checkImportantInfoChange(_this.oppBusiData.custBaseInfo, _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS) && _this.busiCode != 'V0009'){
                //判断是否未做任何修改
                _this.messageBox({
                    hasMask:true,
                    messageText:"客户三要素没有变更，不能进行关键信息变更!",
                    confirmButtonText:'确定',
                    typeMessage:'warn', 
                    showMsgBox:true  
                })
                return false;
            }else{
                 //判断证件结束日前不能小于当天
                let todayStr = _this.$storage.getSession(_this.$definecfg.TODAY_TIME);
                if(todayStr){
                    if(stringConfig.isNotEmptyStr(_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.ID_EXP_DATE.DEFAULT_VALUE) ){
                        if(parseInt(_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.ID_EXP_DATE.DEFAULT_VALUE) < parseInt(todayStr)){
                            _this.messageBox({
                                hasMask:true,
                                messageText:"您的证件结束日期不能小于当天",
                                confirmButtonText:'确定',
                                typeMessage:'warn', 
                                showMsgBox:true  
                            })
                            return false;
                        }
                    }
                }
                // return true;
                // //进行公安联网校验
                // _this.loading = true;
                // _this.loadingText = '正在核对您的业务数据，请稍候...';
                // return Promise.all([
                //     bizPublicMethod.$blMethod.runPoliceValidate(_this),//判断是否需要公安联网校验后发请求验证
                // ]).then(function(res) {
                //     let policeStatus = res[0];//判断是否需要公安联网校验后发请求验证 true 验证成功
                //     if(!policeStatus){
                //         _this.messageBox({
                //             hasMask:true,
                //             messageText:"身份核查失败，请填写您最新证件上的信息，如有疑问可联系现场工作人员协助处理！",
                //             confirmButtonText:'确定',
                //             typeMessage:'warn', 
                //             showMsgBox:true,
                //             confirmedAction: function(){
                //                 _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].MODULE_CONTROL = "0";  
                //             }   
                //         })
                //         return false;
                //     }else{
                //         //公安联网成功
                //         // 设置银证信息与身份证信息一致
                //         // if(bizPublicMethod.$blMethod.checkImportantInfoChange(_this.oppBusiData.custBaseInfo, _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS) && _this.oppBusiData.bankSignInfo && _this.oppBusiData.bankSignInfo.length){
                //         //     _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.MODULE_BANK_RADIO_BUTTON.DEFAULT_VALUE = true;
                //         //     if(_this.oppBusiData.bankTypeBool == false ){
                //         //         _this.oppBusiData.bankTypeBool = true;
                //         //         bizPublicMethod.$blMethod.setBankInfoToBasicInfo(_this);
                //         //     }
                //         //     _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].MODULE_CONTROL = "1";//隐藏模块  
                //         // }else{
                //         //     _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].MODULE_CONTROL = "0";//隐藏模块        
                //         // } 
                //     }
                // }).finally(function(){
                //     _this.loading = false;
                // })
            } 
        }
        if(_this.groupId == "CUST_INFO_PAGE1"){
            // if(_.isEmpty(_this.oppBusiData.ymtData)){
            //     _this.groupDatas.SYNC_INFO_PAGE.SYNC_INFO_MODULE[0].FIELDS.SYNC_SYS_FLAG.DEFAULT_VALUE = "2,3,4";
            //     _this.groupDatas.SYNC_INFO_PAGE.SYNC_INFO_MODULE[0].FIELDS.SYNC_SYS_FLAG.FIELD_DICT_DISABLE = ["1"];
            // }else {
            //     _this.groupDatas.SYNC_INFO_PAGE.SYNC_INFO_MODULE[0].FIELDS.SYNC_SYS_FLAG.DEFAULT_VALUE = "1,2,3,4";
            // }
            let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
            let newCustInfo = _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS;
            let dMod = {
                "NEW_CUST_FNAME": newCustInfo.USER_FNAME.DEFAULT_VALUE,
                "OLD_CUST_FNAME": customerInfo.CUST_FNAME,
                "NEW_ID_TYPE": newCustInfo.ID_TYPE.DEFAULT_VALUE,
                "OLD_ID_TYPE": customerInfo.ID_TYPE,
                "NEW_ID_CODE": newCustInfo.ID_CODE.DEFAULT_VALUE,
                "OLD_ID_CODE": customerInfo.ID_CODE,
                "CUST_CODE": customerInfo.CUST_CODE,
                "INT_ORG": customerInfo.INT_ORG,
            }
            return Promise.all([
                this.W0000295(_this,dMod),
            ]).then((res)=> {
                if(res.length && res[0].Code=="0") {
                    if(res[0].Data[0].IS_SYNC_CSDC == "0") { // 不可以同步中登
                        _this.groupDatas.SYNC_INFO_PAGE.SYNC_INFO_MODULE[0].FIELDS.SYNC_SYS_FLAG.FIELD_DICT_DISABLE = ["1"];
                        _this.groupDatas.SYNC_INFO_PAGE.SYNC_INFO_MODULE[0].FIELDS.SYNC_SYS_FLAG.DEFAULT_VALUE = "2,3,4";
                    }else{
                        _this.groupDatas.SYNC_INFO_PAGE.SYNC_INFO_MODULE[0].FIELDS.SYNC_SYS_FLAG.FIELD_DICT_DISABLE = [];
                    }
                    if(res[0].Data[0].IS_CAN_ACCEPT == "0") { // 禁止修改
                        _this.messageBox({
                            hasMask:true,
                            messageText:res[0].Data[0].MSG,
                            confirmButtonText:'确定',
                            typeMessage:'warn', 
                            showMsgBox:true,
                            confirmedAction:function () {}
                        })
                        return false;
                    }
                }
            })
        }
    },
    //--------------------------------------------------检查逻辑--------------------------------------------------
    "CHECK_USER_FNAME" : (_this, field, fieldData) => {
        
        // var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？+ - \\\\ ]");
        let userName = field.DEFAULT_VALUE;
        
        // if(pattern.test(userName)){
        //   field.correct = false;
        //   field.message = "不能包含特殊字符";
        // }
       
        if(bizPublicMethod.$blMethod.checkBaseInfoChange(_this)) {
            //1显示  0不显示
            // _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].MODULE_CONTROL = "1";
            if(_this.userType == "0"){
                //证件类型是0s的话 即使不修改三要素也展示辅助证件
                if(_.indexOf(["0b","0c","0d","0e","0i","0j","0s"], fieldData.ID_TYPE.DEFAULT_VALUE) != -1){
                    if(_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_CUST_NAME){
                        _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_CUST_NAME.FIELD_CONTROL = "0";
                    }
                    if(_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_ADDR){
                        _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_ADDR.FIELD_CONTROL = "0";
                    }
                    _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_CODE.FIELD_CONTROL = "0";
                    _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_EXP_DATE.FIELD_CONTROL = "0";
                    _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_TYPE.FIELD_CONTROL = "0";
                }else{
                    if(_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_CUST_NAME){
                        _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_CUST_NAME.FIELD_CONTROL = "1";
                    }
                    if(_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_ADDR){
                        _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_ADDR.FIELD_CONTROL = "1";
                    }
                    _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_CODE.FIELD_CONTROL = "1";
                    _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_EXP_DATE.FIELD_CONTROL = "1";
                    _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_TYPE.FIELD_CONTROL = "1";
                }
            }
        } else {
            // _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].MODULE_CONTROL = "0";
        }
    
        if((stringConfig.strLen(fieldData.USER_FNAME.DEFAULT_VALUE))> 16){
          fieldData.USER_NAME.DEFAULT_VALUE = stringConfig.subCHStr(userName, 0,16);
        }else{
          fieldData.USER_NAME.DEFAULT_VALUE = userName;
        }
      },
    "CHECK_ID_TYPE" : (_this, field, fieldData) => {
        let userName = field.DEFAULT_VALUE;
        // if(bizPublicMethod.$blMethod.checkBaseInfoChange(_this)) {
        //1显示  0不显示
            //证件类型是0s的话 即使不修改三要素也展示辅助证件
            // _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].MODULE_CONTROL = "1";
            if(_this.userType == "0"){
                if(_.indexOf(["0b","0c","0d","0e","0i","0j","0s"], fieldData.ID_TYPE.DEFAULT_VALUE) != -1){
                    if(_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_CUST_NAME){
                        _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_CUST_NAME.FIELD_CONTROL = "0";
                    }
                    if(_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_ADDR){
                        _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_ADDR.FIELD_CONTROL = "0";
                    }
                    _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_CODE.FIELD_CONTROL = "0";
                    _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_EXP_DATE.FIELD_CONTROL = "0";
                    _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_TYPE.FIELD_CONTROL = "0";
                }else{
                    if(_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_CUST_NAME){
                        _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_CUST_NAME.FIELD_CONTROL = "1";
                    }
                    if(_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_ADDR){
                        _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_ADDR.FIELD_CONTROL = "1";
                    }
                    _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_CODE.FIELD_CONTROL = "1";
                    _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_EXP_DATE.FIELD_CONTROL = "1";
                    _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_TYPE.FIELD_CONTROL = "1";
                }
            }
        // } else {
        //     // _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].MODULE_CONTROL = "0";
        // }
    },
    "CHECK_USER_NAME" : (_this, field, fieldData) => {
        // var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？+ - \\\\ ]");
        let userName = field.DEFAULT_VALUE;
        
        // if(pattern.test(userName)){
        //     field.correct = false;
        //     field.message = "不能包含特殊字符";
        // }
        if("CUST_BASIC_INFO_STEP2" in _this.groupDatas.CUST_INFO_PAGE1) {
            if(bizPublicMethod.$blMethod.checkBaseInfoChange(_this)) {
                // _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].MODULE_CONTROL = "1";
                if(_.indexOf(["0b","0c","0d","0e","0i","0j","0s"], fieldData.ID_TYPE.DEFAULT_VALUE) != -1){
                    if(_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_CUST_NAME){
                        _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_CUST_NAME.FIELD_CONTROL = "0";
                    }
                    if(_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_ADDR){
                        _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_ADDR.FIELD_CONTROL = "0";
                    }
                    _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_CODE.FIELD_CONTROL = "0";
                    _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_EXP_DATE.FIELD_CONTROL = "0";
                    _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_TYPE.FIELD_CONTROL = "0";
                }else{
                    if(_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_CUST_NAME){
                        _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_CUST_NAME.FIELD_CONTROL = "1";
                    }
                    if(_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_ADDR){
                        _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_ADDR.FIELD_CONTROL = "1";
                    }
                    _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_CODE.FIELD_CONTROL = "1";
                    _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_EXP_DATE.FIELD_CONTROL = "1";
                    _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_TYPE.FIELD_CONTROL = "1";
                }
            } else {
                // _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].MODULE_CONTROL = "0";
            }
        }
    },

    /**
     *【CHECK_ID_CODE】证件号码相关逻辑
    * a)证件类型为"身份证"时，根据号码自动计算出性别、出生日期，且为不可编辑状态，自动填充主体身份，可编辑
    * b)有效证明文件为18位或24位"工商营业执照"时，《重要信息》组中"组织机构代码证"及对应的"有效期"自动填充且不可编辑，其他的都可编辑
    * c)有效证明文件为18位或24位"工商营业执照"时，《重要信息》组中自动填充"国税登记号码"及"有效期"且不可编辑。若为15位账号，"组织机构代码证税务登记号码"由其手动录入，必填
    */
    "CHECK_ID_CODE": (_this, field, fieldData) => {
        let value = field.DEFAULT_VALUE;
        _this.oppBusiData["ID_CODE"] = field.DEFAULT_VALUE;
        //增加身份证校验
      
        if(_this.groupId == "CUST_INFO_PAGE2"){
          //yangyp 验证银行卡的身份证类别
            bizPublicMethod.$blMethod.filterIdCode(_this, fieldData["IDTYPE"], field, fieldData)
        }else{
            if(_this.groupId&&_this.groupId!= undefined){
                bizPublicMethod.$blMethod.filterIdCode(_this, fieldData["ID_TYPE"], field, fieldData);
            }
        }
        
        if (field.VALID_TYPE.indexOf("cardno") > -1) {
            if (value.length == 15) { // 目前15位身份证号码提示升位信息，并提供升位功能
                field.correct = false;
                field.message = "您输入的身份证号为15位，请输入正确的18位身份证号或升位！";
                field.FIELD_BUTTON_TXT = "升位"
                field.IS_SHOW_BUTTON = true;
            } else {
                field.IS_SHOW_BUTTON = false;
            }
        } 
        if( bizBasicMethod.isDoubleChange(_this)){
            // _this.messageBox({
            //     hasMask: true,
            //     messageText: "您不能同时修改姓名（名称）、证件号码。如有疑问，请详询现场工作人员或致电95536。",
            //     confirmButtonText: '确定',
            //     typeMessage: 'warn',
            //     showMsgBox: true,
            // })
        }

        if("CUST_BASIC_INFO_STEP2" in _this.groupDatas.CUST_INFO_PAGE1) {
            if(bizPublicMethod.$blMethod.checkBaseInfoChange(_this)) {
                // _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].MODULE_CONTROL = "1";
                if(_this.userType == "0"){
                    if(_.indexOf(["0b","0c","0d","0e","0i","0j","0s"], fieldData.ID_TYPE.DEFAULT_VALUE) != -1){
                        if(_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_CUST_NAME){
                            _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_CUST_NAME.FIELD_CONTROL = "0";
                        }
                        if(_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_ADDR){
                            _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_ADDR.FIELD_CONTROL = "0";
                        }
                        _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_CODE.FIELD_CONTROL = "0";
                        _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_EXP_DATE.FIELD_CONTROL = "0";
                        _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_TYPE.FIELD_CONTROL = "0";
                    }else{
                        if(_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_CUST_NAME){
                            _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_CUST_NAME.FIELD_CONTROL = "1";
                        }
                        if(_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_ADDR){
                            _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_ADDR.FIELD_CONTROL = "1";
                        }
                        _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_CODE.FIELD_CONTROL = "1";
                        _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_EXP_DATE.FIELD_CONTROL = "1";
                        _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS.OTHER_ID_TYPE.FIELD_CONTROL = "1";
                    }
                }
            } else {
                // _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].MODULE_CONTROL = "0";
            }
        }
    },
    
    "CHECK_ID_ADDRR":(_this, field, fieldData) =>{

    },
    
    "CHECK_ID_CODE__CLICK": (_this, field, fieldData) => {
        bizBasicMethod.updateId15to18(_this, field, fieldData)
    },

    "CHECK_FULLNAME": (_this, field, fieldData) =>{
        if(_this.userType == "0"){
            _this.$nextTick(() => {
                if(fieldData.IDTYPE.DEFAULT_VALUE != _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.ID_TYPE.DEFAULT_VALUE
                ||fieldData.FULLNAME.DEFAULT_VALUE != _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.USER_FNAME.DEFAULT_VALUE){
                _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.MODULE_BANK_RADIO_BUTTON.DEFAULT_VALUE = "false";
                }else{
                _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.MODULE_BANK_RADIO_BUTTON.DEFAULT_VALUE = "true";
                }
                //屏蔽银行密码逻辑
                // if(field.DEFAULT_VALUE != _this.oppBusiData.bankAcctInfo&&_this.oppBusiData.bankAcctInfo[0]&&_this.oppBusiData.bankAcctInfo[0].IDNO
                //   && !field.DEFAULT_VALUE == "" && _this.oppBusiData.bankAcctInfo&&_this.oppBusiData.bankAcctInfo[0]&&_this.oppBusiData.bankAcctInfo[0].IDNO != ""){
                //   showBankPwdButton(_this);
                // }
            })
        }else{
            // _this.$nextTick(() => {
            //     if(fieldData.IDNO.DEFAULT_VALUE != _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.ID_CODE.DEFAULT_VALUE
            //     || fieldData.FULLNAME.DEFAULT_VALUE != _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.USER_FNAME.DEFAULT_VALUE
            //     || fieldData.IDTYPE.DEFAULT_VALUE != _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.ID_TYPE.DEFAULT_VALUE){
            //     _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.MODULE_BANK_RADIO_BUTTON.DEFAULT_VALUE = "false";
            //     }else{
            //     _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.MODULE_BANK_RADIO_BUTTON.DEFAULT_VALUE = "true";
            //     }
            //     //屏蔽银行密码逻辑
            //     // if(field.DEFAULT_VALUE != _this.oppBusiData.bankAcctInfo&&_this.oppBusiData.bankAcctInfo[0]&&_this.oppBusiData.bankAcctInfo[0].IDNO
            //     //   && !field.DEFAULT_VALUE == "" && _this.oppBusiData.bankAcctInfo&&_this.oppBusiData.bankAcctInfo[0]&&_this.oppBusiData.bankAcctInfo[0].IDNO != ""){
            //     //   showBankPwdButton(_this);
            //     // }
            // })
        }
      },
    
    "CHECK_IDNO" : (_this, field, fieldData) =>{
        if(_this.userType == "0"){
            _this.$nextTick(() => {
                if(fieldData.IDNO.DEFAULT_VALUE != _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.ID_CODE.DEFAULT_VALUE
                ||fieldData.FULLNAME.DEFAULT_VALUE != _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.USER_FNAME.DEFAULT_VALUE){
                _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.MODULE_BANK_RADIO_BUTTON.DEFAULT_VALUE = "false";
                }else{
                _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.MODULE_BANK_RADIO_BUTTON.DEFAULT_VALUE = "true";
                }
                //屏蔽银行密码逻辑
                // if(field.DEFAULT_VALUE != _this.oppBusiData.bankAcctInfo&&_this.oppBusiData.bankAcctInfo[0]&&_this.oppBusiData.bankAcctInfo[0].IDNO
                //   && !field.DEFAULT_VALUE == "" && _this.oppBusiData.bankAcctInfo&&_this.oppBusiData.bankAcctInfo[0]&&_this.oppBusiData.bankAcctInfo[0].IDNO != ""){
                //   showBankPwdButton(_this);
                // }
            })
        }else{
            _this.$nextTick(() => {
                // if(fieldData.IDNO.DEFAULT_VALUE != _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.ID_CODE.DEFAULT_VALUE
                // || fieldData.FULLNAME.DEFAULT_VALUE != _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.USER_FNAME.DEFAULT_VALUE
                // || fieldData.IDTYPE.DEFAULT_VALUE != _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.ID_TYPE.DEFAULT_VALUE){
                // _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.MODULE_BANK_RADIO_BUTTON.DEFAULT_VALUE = "false";
                // }else{
                // _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.MODULE_BANK_RADIO_BUTTON.DEFAULT_VALUE = "true";
                // }
                // //屏蔽银行密码逻辑
                // // if(field.DEFAULT_VALUE != _this.oppBusiData.bankAcctInfo&&_this.oppBusiData.bankAcctInfo[0]&&_this.oppBusiData.bankAcctInfo[0].IDNO
                // //   && !field.DEFAULT_VALUE == "" && _this.oppBusiData.bankAcctInfo&&_this.oppBusiData.bankAcctInfo[0]&&_this.oppBusiData.bankAcctInfo[0].IDNO != ""){
                // //   showBankPwdButton(_this);
                // // }
            })
        }
    },

    //银行卡与本人信息是否一致
    "CHECK_BANK_MODULE_RADIO" :(_this,field,fieldData) => {
        if(_this.userType == "0"){
            if(field.DEFAULT_VALUE === "true"){
                _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.FULLNAME.DEFAULT_VALUE = _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.USER_FNAME.DEFAULT_VALUE;
                _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.IDTYPE.DEFAULT_VALUE = _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.ID_TYPE.DEFAULT_VALUE;
            }else{
                _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.FULLNAME.DEFAULT_VALUE = _this.oppBusiData.USER_FNAME;
                _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.IDTYPE.DEFAULT_VALUE = _this.oppBusiData.ID_TYPE;
            }
        }else{
            if(field.DEFAULT_VALUE === "true"){
                _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.FULLNAME.DEFAULT_VALUE = _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.USER_FNAME.DEFAULT_VALUE;
                _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.IDTYPE.DEFAULT_VALUE = _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.ID_TYPE.DEFAULT_VALUE;
                _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.IDNO.DEFAULT_VALUE = _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.ID_CODE.DEFAULT_VALUE;

            }else{
                _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.FULLNAME.DEFAULT_VALUE = _this.oppBusiData.USER_FNAME;
                _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.IDTYPE.DEFAULT_VALUE = _this.oppBusiData.ID_TYPE;
                _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.IDNO.DEFAULT_VALUE = _this.oppBusiData.ID_CODE;

            }
        }
       
    },

    "CHECK_BANK_AUTH_DATA" :(_this,field,fieldData) =>{
        // _this.oppBusiData.hasClickedCompleteButton = false;
    },

    "CHECK_BANK_AUTH_DATA__CLICK": (_this, field, fieldData) => {
        // showPwdBox(_this,'请再次输入银行卡密码',field.MODULE_ID + '-' + field.FIELD_ID,field, fieldData,function(_this ,isEqual){
        //   console.log('isEqual', isEqual);
        //   _this.oppBusiData.hasClickedCompleteButton = isEqual;
        // });
    },
   
    // 点击识别按钮触发逻辑
    "readModule":(_this, moduleId, fieldData) => {
        console.log('moduleId====',moduleId);
        _this.$router.goModule("readCardModule", {"moduleId": moduleId});
    },
     /*
     *@Description: 
     *@Author: yangyp
     *@Date: 2019-06-28 14:57:00
    */
    "CHECK_MAIL_ZIP_CODE" : (_this, field, fieldData) => {
    },
    /*
    * CHECK_INDUS_SUB#行业大类：
    */
    "CHECK_INDUS_GB":(_this, field, fieldData) => {
        var outINDUS_GB_SUBData = _.map(_.filter(fieldData["INDUS_GB_SUB"].FIELD_DICT_NAME, function (v) {
            if(field.DEFAULT_VALUE&&v.DICT_ITEM){
                return _.indexOf(field.DEFAULT_VALUE.charAt(0), v.DICT_ITEM.charAt(0)) != -1;
            }
        }), "DICT_ITEM");
        fieldData["INDUS_GB_SUB"].FIELD_DICT_FILTER = outINDUS_GB_SUBData;
    },
    /*
    * CHECK_OCCU_GB#职业大类：
    */
    "CHECK_OCCU_GB":(_this, field, fieldData) => {
        var outOCCU_GB_SUBData = _.map(_.filter(fieldData["OCCU_GB_SUB"].FIELD_DICT_NAME, function (v) {
            if(field.DEFAULT_VALUE&&v.DICT_ITEM){
                return _.indexOf(field.DEFAULT_VALUE.charAt(0), v.DICT_ITEM.charAt(0)) != -1;
            }
        }), "DICT_ITEM");
        fieldData["OCCU_GB_SUB"].FIELD_DICT_FILTER = outOCCU_GB_SUBData;
    },
    //读卡按钮
    "readModule_CUST_BASIC_INFO": (_this,moduleId)=>{
        _this.$router.goModule("customerSearchModule", {"moduleId": moduleId});
    },
    //中登校验
    "ZDCustomizeModule_CUST_BASIC_INFO": (_this, moduleObj) => {
        console.log('点击 中登校验 按钮');
        let fieldData = moduleObj.FIELDS;
        let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
        let getAllfiedValue = function(fileds){
            let emptyObject = {};
            for(let fk in fileds){
                emptyObject[fk] =  fileds[fk].DEFAULT_VALUE;
            }
            return emptyObject; 
        }
        let allfieldObj = Object.assign({},getAllfiedValue(_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS),getAllfiedValue(_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP2[0].FIELDS))
        let INT_ORG = customerInfo.INT_ORG;
        if (!allfieldObj.ID_TYPE || ! allfieldObj.ID_CODE || !allfieldObj.USER_FNAME) {
            _this.$blMethod.showMsgBox(_this,"客户名称、证件号码和姓名不能为空");
            return;
        }
        let params = {
            CUST_FNAME: allfieldObj.USER_FNAME,
            FZ_ID_ADDR: allfieldObj.OTHER_ID_ADDR,
            FZ_ID_CODE: allfieldObj.OTHER_ID_CODE,
            FZ_ID_EXP_DATE: allfieldObj.OTHER_ID_EXP_DATE,
            FZ_ID_TYPE: allfieldObj.OTHER_ID_TYPE,
            ID_ADDR: allfieldObj.ID_ADDR,
            ID_BEG_DATE: allfieldObj.ID_BEG_DATE,
            ID_CODE: allfieldObj.ID_CODE,
            ID_EXP_DATE: allfieldObj.ID_EXP_DATE,
            ID_ISS_AGCY: allfieldObj.ID_ISS_AGCY,
            ID_TYPE: allfieldObj.ID_TYPE,
            USER_FNAME: allfieldObj.USER_FNAME,
            USER_NAME: allfieldObj.USER_NAME,
            isOpenAcctBiz: _this.$syscfg.isOpenAcctBiz(_this.busiCode) ? "1" : "0",//是否开户业务 1是 0不是
        }
        _this.loading = true;
        _this.loadingText = '正在进行中登校验！';
        csdcService.W0000278(params).then(res=>{
            if(res && res.flag){
                _this.$blMethod.showMsgBox(_this,"中登校验通过！")
                _this.oppBusiData.ASSIGN_CSDC_CHECK_FLAG = '1'
            }else{
                _this.$blMethod.showMsgBox(_this,"中登校验：记录不存在！")
                _this.oppBusiData.ASSIGN_CSDC_CHECK_FLAG = '2'
            }
        }).catch(err=>{
            _this.$blMethod.showMsgBox(_this,"中登校验失败" + err.toString())
            _this.oppBusiData.ASSIGN_CSDC_CHECK_FLAG = '0'
        }).finally(()=>{
            _this.loading = false;
            _this.loadingText = '';
        })
    },
    //公安联网
    "customizeModule_CUST_BASIC_INFO": (_this, moduleObj) => {
        let fieldData = moduleObj.FIELDS;
        let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
        let ID_TYPE = fieldData.ID_TYPE.DEFAULT_VALUE,
            USER_FNAME = fieldData.USER_FNAME.DEFAULT_VALUE,
            USER_NAME = fieldData.USER_NAME.DEFAULT_VALUE,
            ID_CODE = fieldData.ID_CODE.DEFAULT_VALUE,
            SEX = customerInfo.SEX
        
        if (ID_TYPE != '00') {
            _this.$blMethod.showMsgBox(_this,"证件类型不是身份证，不支持公安联网校验！");
            return;
        }
        if (!ID_CODE || !USER_FNAME) {
            _this.$blMethod.showMsgBox(_this,"证件号码和姓名不能为空");
            return;
        }
        let params = {
            ID_CODE: ID_CODE,
            CUST_NAME: USER_FNAME,
            USER_NAME: USER_FNAME,
            GET_FLAG:1,
        }
        _this.loading = true;
        _this.loadingText = '正在进行公安联网校验！';
        custSerivce.runPoliceValidate(params).then( data => {
            if(data) {
                _this.loading = false;
            }
            if (data.flag) {
                _this.$blMethod.showMsgBox(_this,"公安联网校验成功！")
                _this.oppBusiData.ASSIGN_IDCARD_CHECK_FLAG ='1'
            } else {
                if(data.Msg) {
                    _this.$blMethod.showMsgBox(_this,data.Msg)
                } else {
                    _this.$blMethod.showMsgBox(_this,"公安联网校验失败！")
                }
            }
        }).finally(()=>{
            _this.loadingText = '';
            _this.loading = false;
        })
    },
}