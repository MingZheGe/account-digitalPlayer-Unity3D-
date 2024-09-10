/* 
*   个人涉税模块
*   方法封装
*   @author  yangyp
*/

import stringConfig from '../../tools/stringConfig.js'
import bizTaxMethod from '../../business/businessTools/bizTaxMethod.js'
import stringPinyinConfig from '../../tools/stringPinyinConfig.js'
import bizPublicSaveMethod from '../../business/businessTools/bizPublicSaveMethod.js'
import date from '../../tools/date.js'
import * as utils from "../../tools/util"

import bizPublicMethod from '../businessTools/bizPublicMethod'

export default  {
//----------------------------------钩子函数----------------------//
    /*
    *@method custTaxInfoModuleBeforeLoadBiz
    *@desc 钩子函数 加载历史数据之前触发
    *@MethodAuthor  linsc
    *@Date: 2019-06-11 15:19:09
    */
    custTaxInfoModuleBeforeLoadBiz: function(_this){
        //字段初始化
        //解析客户360数据
        let oppData = _this.oppBusiData.custTaxInfo;
        //
        this.custTaxInfoModuleParseOldBiz(_this, oppData); // beforeLoadBiz  后台返回数据渲染到页面
    },
    /*
     *@method custTaxInfoModuleAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     *@MethodAuthor  linsc
     *@Date: 2019-06-13 09:42:56
    */
   custTaxInfoModuleAfterLoadBiz: function(_this){
        // this.custTaxInfoModuleLoadBizData(_this,_this.historyData);
        let custTaxInfo =  _this.historyData.CUST_TAX_INFO && _this.historyData.CUST_TAX_INFO.length && _this.historyData.CUST_TAX_INFO[0] || {};
        if(custTaxInfo){
            this.custTaxInfoModuleParseOldBiz(_this, custTaxInfo);
        }
        

        //解析后做页面渲染。动态判断业务的流程节点
        if (_this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE1[0].FIELDS.TAX_RESIDENT_TYPE.DEFAULT_VALUE === "1") {
            //选择了仅中国居民
            //隐藏关联模块
            _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE2[0].MODULE_CONTROL = "0";
            _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE3[0].MODULE_CONTROL = "0";
            _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE4[0].MODULE_CONTROL = "0";
            _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE6[0].MODULE_CONTROL = "0";

            bizPublicMethod.$blMethod.setModulesControl(_this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE5, "0")
            bizPublicMethod.$blMethod.setModulesControl(_this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE7, "0")
        } else {
            //显示关联模块
            _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE2[0].MODULE_CONTROL = "1";
            _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE3[0].MODULE_CONTROL = "1";
            _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE4[0].MODULE_CONTROL = "1";
            _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE6[0].MODULE_CONTROL = "1";

            bizPublicMethod.$blMethod.setModulesControl(_this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE5, "1")
            bizPublicMethod.$blMethod.setModulesControl(_this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE7, "1")
        }
   },
    /*
    *@method custTaxInfoModuleBeforeSave
    *@desc 钩子函数 自定义保存数
    *@MethodAuthor  linsc
    *@Date: 2019-06-11 15:19:09
    */
    custTaxInfoModuleBeforeSave: function(_this, params){
        //数据保存
        if(_this.groupId == undefined){
            return this.getCustTaxInfoData(_this,params);
        }
    },
    /*
    *@method custTaxInfoModuleValidate
    *@desc 钩子函数 下一步验证
    *@MethodAuthor  linsc
    *@Date: 2019-06-11 15:19:09
    */
    custTaxInfoModuleValidate : function(_this) {

        return true;
    },

    /*
    *@method getData
    * 1、_this. 页面索引
    * 2、 saveDicName  在keyFieldMap中的保存结构
    * 3、 要解析的模块数组 mouduleArr
    * 4、 oldObject 接口数据字段（本身旧值）
    *@Author: yangyp
    *@desc 拼接数据
    *@Date: 2019-06-11 15:19:09
    */
    getCustTaxInfoData : function(_this,params) {
        //手动转换为VTM数据
        let saveModel = ["CUST_TAX_INFO_MODULE1","CUST_TAX_INFO_MODULE2","CUST_TAX_INFO_MODULE3","CUST_TAX_INFO_MODULE4","CUST_TAX_INFO_MODULE6"];
        let saveTaxInfo = bizPublicSaveMethod.getSaveData(_this,"CUST_TAX_INFO",saveModel,_this.oppBusiData.custTaxInfo);
        console.log('saveTaxeInfo====', JSON.stringify(saveTaxInfo));
       
        //以下是自定义保存逻辑
        if(_this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE5[0].MODULE_CONTROL == "1"){
            saveTaxInfo = bizPublicSaveMethod.getSaveCustTaxData(_this,saveTaxInfo,_this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE5,_this.oppBusiData.custTaxInfo);
        }
        if(_this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE7[0].MODULE_CONTROL == "1"){
            saveTaxInfo = bizPublicSaveMethod.getSaveCustPayMentTaxData(_this,saveTaxInfo,_this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE7,_this.oppBusiData.custTaxInfo);
        }


        //标准版审核 拼装CUST_TAX_INFO_ITEM
        let custAllInfo = _this.$storage.getJsonSession(_this.$definecfg.CUST_ALL_INFO) || {};
        let custTaxInfo = custAllInfo && custAllInfo.TAX_INFO || []; //这里对应一柜通的 that.model.get("CUST_TAX_INFO")

        //如果客户信息custAllInfo.TAX_INFO有CTRL_FLAG则取这个值否则默认0  是否控制人标志：非控制人，默认为0
        Object.assign(saveTaxInfo, {
            CTRL_FLAG: custTaxInfo && custTaxInfo.length && custTaxInfo[0].CTRL_FLAG || "0", // 是否控制人标志：非控制人，默认为0
            CTRL_NO: "0", // 控制人编号：非控制人，默认为0
            PASSIVE_NFE: "",   // 是否消极非金融机构：个人客户默认空值
            CTRL_NON_RESIDENT: "", // 控制人是否非居民：个人客户默认空值
        }) 
        //custTaxInfoDiff 对应一柜通的 custTaxInfo
        let custTaxInfoDiff = bizPublicMethod.$blMethod.getArrDiff([saveTaxInfo], custTaxInfo, "CTRL_FLAG", "OPP_NO_TAXPAYERID_REASON");
        // 居民国存储特殊性，需要判断其中任意一个变了，对应的其他都要入参，否则账户会删掉
        if (custTaxInfoDiff.INFO.length) {
            custTaxInfoDiff.INFO = bizPublicMethod.$blMethod.getTaxCountryDiffData(custTaxInfoDiff.INFO, custTaxInfo);
            custTaxInfoDiff.INFO = bizPublicMethod.$blMethod.getTaxAssetDiffData(custTaxInfoDiff.INFO, custTaxInfo);
        }
        // 如果不显示涉税信息 或 选择了“仅为中国税收居民”，需要删除存量的居民国信息
        let custTaxInfoItem = bizPublicMethod.$blMethod.getArrDiff(
            saveTaxInfo && saveTaxInfo.TAX_RESIDENT_TYPE != "1" ? bizPublicMethod.$blMethod.transTaxInfoToArr(saveTaxInfo) : [],
            !_.isEmpty(custTaxInfo) ? bizPublicMethod.$blMethod.transTaxInfoToArr(custTaxInfo[0]) : [],
            "TAX_ID", "", true
        );

        // 如果不显示涉税信息 或 选择了“仅为中国税收居民”，需要删除存量的居民国资产信息
        let custTaxAssetInfoItem = bizPublicMethod.$blMethod.getArrDiff(
            saveTaxInfo && saveTaxInfo.TAX_RESIDENT_TYPE != "1" ? bizPublicMethod.$blMethod.transTaxAssetInfoToArr(saveTaxInfo) : [],
            !_.isEmpty(custTaxInfo) ? bizPublicMethod.$blMethod.transTaxAssetInfoToArr(custTaxInfo[0]) : [],
            "TAX_ID", "", true
        );

        // 审核端数据结构要求：将基本涉税信息与居民国信息合并在一起，保持个人、机构、产品的数据结构一致性
        custTaxInfoItem.CTRL_NO = "0";
        custTaxInfoItem.CTRL_FLAG = "0";
        custTaxInfoItem.TAX_INFO = custTaxInfoDiff ? custTaxInfoDiff.INFO : [];
        custTaxInfoDiff && (custTaxInfoItem.IS_CHANGE = custTaxInfoDiff.IS_CHANGE);

        custTaxInfoItem.COUNTRY_INFO = custTaxInfoItem.INFO;
        //资产信息
        custTaxInfoItem.ASSET_INFO = custTaxAssetInfoItem.INFO;

        let CUST_TAX_INFO = {"CUST_TAX_INFO":custTaxInfoDiff.INFO};
        Object.assign(params,CUST_TAX_INFO,{CUST_TAX_INFO_ITEM: [custTaxInfoItem]});
    },

    /*
    *@method custTaxInfoModulePageActivated
    *@desc 钩子函数：页面激活
    *@MethodAuthor  linsc
    *@Date: 2019-06-11 15:19:09
    */
    custTaxInfoModulePageActivated : function(_this){
    
         if(_this.groupId === 'TAX_INFO'){
             //隐藏全选按钮
             _this.groupDatas["TAX_INFO"]["CUST_TAX_INFO_MODULE1"][0]["FIELDS"]["TAX_RESIDENT_TYPE"]["isShowAllBtn"] = false;
             _this.groupDatas["TAX_INFO"]["CUST_TAX_INFO_MODULE1"][0]["FIELDS"]["GET_INVEST_CERFLAG"]["isShowAllBtn"] = false;
             _this.groupDatas["TAX_INFO"]["CUST_TAX_INFO_MODULE1"][0]["FIELDS"]["GET_INVEST_CERFLAG"].FIELD_TYPE = "checker";

         }
    },

//----------------------业务函数----------------------------------//
    /**
     * 截取客户全称作为客户简称
     * @param custFullName
     * @returns {*}
     */
    cutCustFullName : function (custFullName) {
        var tmpStr = "", curStr;
        if (utils.getCharLength(custFullName) <= 16) {
            return custFullName;
        }
        for (var i = 0, l = custFullName.length; i < l; i++) {
            curStr = custFullName.charAt(i);
            if (lenToFourteen && /^[\u4e00-\u9fa5]*$/.test(curStr)) { //长度为16并且为中文return;
                return tmpStr
            } else {
                tmpStr += curStr;
                if (15 === utils.getCharLength(tmpStr)) {  //如果长度有15位给一个变量
                    var lenToFourteen = true;
                }
                if (utils.getCharLength(tmpStr) >= 16) {
                    return tmpStr;
                }
            }
        }
    },

    /**
    *custTaxInfoModuleParseOldBiz 重新加载转换之后的历史数据
    * @param _this
    */
    custTaxInfoModuleParseOldBiz :function (_this, bdata) { 
        bizPublicMethod.$blMethod.parseGroupsMouduleData(_this,["CUST_TAX_INFO_MODULE1",
                                                    "CUST_TAX_INFO_MODULE2",
                                                    "CUST_TAX_INFO_MODULE3",
                                                    "CUST_TAX_INFO_MODULE4",
                                                    "CUST_TAX_INFO_MODULE6"],bdata);

        bizPublicMethod.$blMethod.parseTaxWithTaxPayerData(_this,"TAX_INFO","CUST_TAX_INFO_MODULE5",bdata);
        bizPublicMethod.$blMethod.parseTaxWithPayMentTaxData(_this,"TAX_INFO","CUST_TAX_INFO_MODULE7",bdata);
    },
    //--------------------------------------------------检查逻辑--------------------------------------------------
     //个人等涉税信息
    "CHECK_TAX_FLAG" : (_this, field, fieldData) => {
        _this.$router.getCurrentRoute().nextBtnText = "下一步";
        if(field.DEFAULT_VALUE != "" && field.FIELD_LAST_CHOOSE_VALUE && field.FIELD_LAST_CHOOSE_VALUE != undefined && field.FIELD_LAST_CHOOSE_VALUE != "")
            field.DEFAULT_VALUE = field.FIELD_LAST_CHOOSE_VALUE;

        if(field.DEFAULT_VALUE === "" || field.DEFAULT_VALUE === undefined){
            //字段为空时，隐藏关联模块
            //如果不选择提示当前字段为必填项
            _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE2[0].MODULE_CONTROL = "0";
        }else if(field.DEFAULT_VALUE === "1"){
            //选择了仅中国居民和豁免
            let customerInfo = bizPublicMethod.$blMethod.getCustomerAllData(_this);
            //证件类型为境内护照/港澳身份证/港澳居民居住证/港澳居民通行证/台湾居民来往大陆通行证，
            //勾选‘仅为中国税收居民’时，没有额外提示，
            //应该提示：您开户时使用的是护照/港澳身份证件/台湾居民来往大陆通行证，您确认您的税收居民身份证是“仅为中国税收居民”吗？
            if(field.DEFAULT_VALUE === "1" && _.indexOf(["0b","0c","0d","0e","0i","0j","0s"],customerInfo.ID_TYPE ) != -1){
                _this.$refs.flowTip.pushFlowTip({
                    title : "您开户时使用的是"+ dict.getSysDict("ID_TYPE",_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.ID_TYPE.DEFAULT_VALUE)+"，您确认您的税收居民身份证是“仅为中国税收居民”吗？",
                    type:'warning',
                    key:'name'
                })
            }else if(field.DEFAULT_VALUE === "1" && customerInfo.ID_TYPE == "01"){
                //护照的
                if(customerInfo.INOUTSIDE_IDENTITY == "0"){
                    _this.$refs.flowTip.pushFlowTip({
                        title : "您开户时使用的是境内护照，您确认您的税收居民身份证是“仅为中国税收居民”吗？",
                        type:'warning',
                        key:'name'
                    })
                }
            }else{
                _this.$refs.flowTip.flowTips = [];
            }
            //如果字段为1，4，5时，隐藏关联模块。甚至要隐藏联系地址涉税国等页面 如果是有添加多个模块的 比如涉税国里面有两个涉税国 则需要全部隐藏 因此需要遍历去隐藏
            bizTaxMethod.hideSomeModulesByIndex(_this.groupDatas.TAX_INFO, "CUST_TAX_INFO_MODULE", 2, 7);
        }else{
            _this.$refs.flowTip.flowTips = [];
            //上面过滤了条件，这里仅剩类型2和3
            field.MODULE_CONTROL = "1";
            _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE2[0].MODULE_CONTROL = "1";
            if(bizTaxMethod.check_Module_Radio_flag2(_this,_this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE2[0].FIELDS)){
                _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE2[0].FIELDS.MODULE_RADIO_BUTTON.DEFAULT_VALUE = true;
            }
            //显示关联模块
            _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE3[0].MODULE_CONTROL = "1";
            _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE4[0].MODULE_CONTROL = "1";
            if(!bizPublicMethod.$blMethod.isChinese(_this)){
                _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE5[0].MODULE_CONTROL = "0" ;
            }else{
                _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE5[0].MODULE_CONTROL = "1";
            }
            
            _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE6[0].MODULE_CONTROL = "1";
            _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE7[0].MODULE_CONTROL = "1";
        }
        //关联数据
        // if(field.MODULE_ID == "CUST_TAX_INFO_MODULE1"){
        //     if(_this.userType == "0"){
        //         if(field.DEFAULT_VALUE === "" || field.DEFAULT_VALUE === undefined){
        //         //字段为空时，隐藏关联模块
        //         //如果不选择提示当前字段为必填项
        //         _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE2[0].MODULE_CONTROL = "0";
        //         }else if(field.DEFAULT_VALUE === "1" || field.DEFAULT_VALUE === "4" || field.DEFAULT_VALUE === "5"){
        //         //选择了仅中国居民和豁免
        //         let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
        //         //证件类型为境内护照/港澳身份证/港澳居民居住证/港澳居民通行证/台湾居民来往大陆通行证，
        //         //勾选‘仅为中国税收居民’时，没有额外提示，
        //         //应该提示：您开户时使用的是护照/港澳身份证件/台湾居民来往大陆通行证，您确认您的税收居民身份证是“仅为中国税收居民”吗？
        //         if(field.DEFAULT_VALUE === "1" && _.indexOf(["0b","0c","0d","0e","0i","0j","0s"],customerInfo.ID_TYPE ) != -1){
        //             _this.$refs.flowTip.pushFlowTip({
        //                 title : "您开户时使用的是"+ dict.getSysDict("ID_TYPE",_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.ID_TYPE.DEFAULT_VALUE)+"，您确认您的税收居民身份证是“仅为中国税收居民”吗？",
        //                 type:'warning',
        //                 key:'name'
        //             })
        //         }else if(field.DEFAULT_VALUE === "1" && customerInfo.ID_TYPE == "01"){
        //             //护照的
        //             if(customerInfo.INOUTSIDE_IDENTITY == "0"){
        //                 _this.$refs.flowTip.pushFlowTip({
        //                     title : "您开户时使用的是境内护照，您确认您的税收居民身份证是“仅为中国税收居民”吗？",
        //                     type:'warning',
        //                     key:'name'
        //                 })
        //             }
        //         }else{
        //             _this.$refs.flowTip.flowTips = [];
        //         }
        
        //         //如果字段为1，4，5时，隐藏关联模块。甚至要隐藏联系地址涉税国等页面
        //         _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE2[0].MODULE_CONTROL = "0";
        //         //隐藏关联页面
        //         _this.$router.hideRoute("/bizFlow/V0011/0/bizEntry/3"); 
        //         _this.$router.hideRoute("/bizFlow/V0011/0/bizEntry/4");
        
        //         //隐藏关联模块
        //         _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE3[0].MODULE_CONTROL = "0";
        //         _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE4[0].MODULE_CONTROL = "0";
        //         _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE5[0].MODULE_CONTROL = "0";
        //         _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE6[0].MODULE_CONTROL = "0";
                
        //         }else{
        //         _this.$refs.flowTip.flowTips = [];
        //         //上面过滤了条件，这里仅剩类型2和3
        //         field.MODULE_CONTROL = "1";
        //         _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE2[0].MODULE_CONTROL = "1";
        //         if(bizTaxMethod.check_Module_Radio_flag2(_this,_this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE2[0].FIELDS)){
        //             _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE2[0].FIELDS.MODULE_RADIO_BUTTON.DEFAULT_VALUE = true;
        //         }
        
        //         //显示关联页面
        //         _this.$router.showRoute("/bizFlow/V0011/0/bizEntry/3"); 
        //         _this.$router.showRoute("/bizFlow/V0011/0/bizEntry/4");
        
        //         //显示关联模块
        //         _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE3[0].MODULE_CONTROL = "1";
        //         _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE4[0].MODULE_CONTROL = "1";
        //         if(!bizPublicMethod.$blMethod.isChinese(_this)){
        //             _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE5[0].MODULE_CONTROL = "0" ;
        //         }else{
        //             _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE5[0].MODULE_CONTROL = "1";
        //         }
                
        //         _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE6[0].MODULE_CONTROL = "1";
        //         }
        //     }else if(_this.userType == "1" || _this.userType == "2"){
        //         if(field.DEFAULT_VALUE === "" || field.DEFAULT_VALUE === undefined){
        //             _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE2[0].MODULE_CONTROL = "0";
        //         }else if(field.DEFAULT_VALUE === "1" || field.DEFAULT_VALUE === "4" || field.DEFAULT_VALUE === "5"){
        //         //选择了仅中国居民和豁免
        //             _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE2[0].MODULE_CONTROL = "0";
        //         }else if(field.DEFAULT_VALUE !== "1"){
        //             field.MODULE_CONTROL = "1";
        //             _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE2[0].MODULE_CONTROL = "1";
        //             if(bizTaxMethod.check_Module_Radio_flag2(_this,)){
        //                 _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE2[0].FIELDS.MODULE_RADIO_BUTTON.DEFAULT_VALUE = true;
        //             }
        //         }
        //     }
        // }else if(field.MODULE_ID == "ORG_TAX_CONTROLER_MODULE1"){
        //     if(field.DEFAULT_VALUE === "" || field.DEFAULT_VALUE === undefined){
        //         _this.groupDatas.ORG_TAX_CONTROL_INFO.ORG_TAX_CONTROLER_MODULE2[0].MODULE_CONTROL = "0";
        //     }else if(field.DEFAULT_VALUE === "1" || field.DEFAULT_VALUE === "4" || field.DEFAULT_VALUE === "5"){
        //         //选择了仅中国居民和豁免
        //         _this.groupDatas.ORG_TAX_CONTROL_INFO.ORG_TAX_CONTROLER_MODULE2[0].MODULE_CONTROL = "0";
        //         bizPublicMethod.$blMethod.hideRouteAndMoudle(_this,"控制人涉税联系地址"); 
        //         bizPublicMethod.$blMethod.hideRouteAndMoudle(_this,"控制人涉税序列号");
        //         _this.$router.updateRoute(_this.$router.getCurrentRouteIndex(),"nextBtnText","填写完成");
        //     }else if(field.DEFAULT_VALUE !== "1"){
        //         field.MODULE_CONTROL = "1";
        //         bizPublicMethod.$blMethod.showRouteAndMoudle(_this,"控制人涉税联系地址"); 
        //         bizPublicMethod.$blMethod.showRouteAndMoudle(_this,"控制人涉税序列号");
        //         _this.groupDatas.ORG_TAX_CONTROL_INFO.ORG_TAX_CONTROLER_MODULE2[0].MODULE_CONTROL = "1";
        //     }
        // }else if(field.MODULE_ID == "ORG_TAX_FLAG_MODULE"){
        //     if(field.DEFAULT_VALUE === "" || field.DEFAULT_VALUE === undefined){
        //     }else if(field.DEFAULT_VALUE === "1" || field.DEFAULT_VALUE === "4" || field.DEFAULT_VALUE === "5"){
        //         //选择了仅中国居民和豁
        //         bizPublicMethod.$blMethod.hideRouteAndMoudle(_this,"涉税信息3");
        //     }else if(field.DEFAULT_VALUE !== "1"){
        //         bizPublicMethod.$blMethod.showRouteAndMoudle(_this,"涉税信息3");
        //     }
        // }
    },
    //取得投资人声明标识按钮响应
    "CHECK_GET_INVEST_CERFLAG":(_this, field, fieldData) => {
        if(field.DEFAULT_VALUE != "" && field.FIELD_LAST_CHOOSE_VALUE && field.FIELD_LAST_CHOOSE_VALUE != undefined && field.FIELD_LAST_CHOOSE_VALUE != "")
            field.DEFAULT_VALUE = field.FIELD_LAST_CHOOSE_VALUE;
    },
    //与身份证件信息一致
    "CHECK_MODULE_RADIO" : (_this, field, fieldData) => {
        if(_this.userType == "0"){
            if(field.DEFAULT_VALUE === "true"){
                let nameObj = stringConfig.getFirstName(_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.USER_FNAME.DEFAULT_VALUE);//过滤姓
            
                if(nameObj&&_.isObject(nameObj)&&nameObj[1]){
                    _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE2[0].FIELDS.NAME_ENG.DEFAULT_VALUE = stringPinyinConfig.ConvertPinyin(nameObj[1]);
                }
                if(nameObj&&_.isObject(nameObj)&&nameObj[0]){
                    _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE2[0].FIELDS.SURNAME_ENG.DEFAULT_VALUE = stringPinyinConfig.ConvertPinyin(nameObj[0]);
                }
                if(stringConfig.isNotEmptyStr(_this.groupDatas.CUST_INFO_PAGE2.CUST_BASIC_INFO_STEP3[0].FIELDS.MAIL_ADDR.DEFAULT_VALUE)){
                    _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE2[0].FIELDS.ADDRESS.DEFAULT_VALUE = _this.groupDatas.CUST_INFO_PAGE2.CUST_BASIC_INFO_STEP3[0].FIELDS.MAIL_ADDR.DEFAULT_VALUE;
                }
            }else{
                _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE2[0].FIELDS.SURNAME_ENG.DEFAULT_VALUE =  _this.oppBusiData.custTaxInfo?_this.oppBusiData.custTaxInfo.SURNAME_ENG:"";
                _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE2[0].FIELDS.NAME_ENG.DEFAULT_VALUE = _this.oppBusiData.custTaxInfo?_this.oppBusiData.custTaxInfo.NAME_ENG:"";
                _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE2[0].FIELDS.ADDRESS.DEFAULT_VALUE = _this.oppBusiData.custTaxInfo?_this.oppBusiData.custTaxInfo.ADDRESS:"";
            }
        }
    },
    "CHECK_CITIZENSHIP" : (_this, field, fieldData) => {

    },
    //机构独有字段，不需要控制
    "CHECK_ORG_TAX_TYPE" : (_this, field, fieldData) => {
        field.DEFAULT_VALUE = field.FIELD_LAST_CHOOSE_VALUE;
        if(field.DEFAULT_VALUE == undefined){
        field.DEFAULT_VALUE = _this.oppBusiData.orgTaxInfo.ORG_TYPE;
        }
    },
    //涉税原因
    "CHECK_TAX_ID_FLAG" : (_this, field) =>{
        if(_this.userType == "0"){
            // FIELD_CONTROL  0= 显示 1= 隐藏      MODULE_CONTROL 1显示  0不显示
            if(field.DEFAULT_VALUE == "3"){
                _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE7.forEach(element => {
                    element.MODULE_CONTROL = "0";
                })
                _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE6[0].FIELDS.TAX_ID_RESON.FIELD_CONTROL =  "0";
                return;
            }else if(field.DEFAULT_VALUE == "1"){
                _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE7.forEach(element => {
                    element.MODULE_CONTROL = "1";
                })

                if(_this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE7.length == 1){
                    _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE7[0].MODULE_ADD = "1";
                }
            }else{
                _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE7.forEach(element => {
                    element.MODULE_CONTROL = "0";
                })
            }
            if(_this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE6[0].FIELDS.TAX_ID_RESON)
            _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE6[0].FIELDS.TAX_ID_RESON.FIELD_CONTROL =  "1";

            
            
        }else if(_this.userType == "1" || _this.userType == "2"){
            // FIELD_CONTROL  0= 显示 1= 隐藏      MODULE_CONTROL 1显示  0不显示
            if(field.DEFAULT_VALUE == "3"){
                if(_.indexOf(_this.$router.getCurrentRoute().modules ,"ORG_TAX_INFO_MODULE2") != -1){
                    _this.groupDatas.ORG_TAX_INFO.ORG_TAX_INFO_MODULE2[0].FIELDS.TAX_ID_RESON.FIELD_CONTROL =  "0";
                    _this.groupDatas.ORG_TAX_INFO.ORG_TAX_INFO_MODULE3.forEach(element => {
                        element.MODULE_CONTROL = "0";
                    })
                }else if(_.indexOf(_this.$router.getCurrentRoute().modules ,"ORG_TAX_CONTROLER_MODULE6") != -1){
                    _this.groupDatas.ORG_TAX_CONTROL_INFO.ORG_TAX_CONTROLER_MODULE6[0].FIELDS.TAX_ID_RESON.FIELD_CONTROL =  "0";
                    _this.groupDatas.ORG_TAX_CONTROL_INFO.ORG_TAX_CONTROLER_MODULE7.forEach(element => {
                        element.MODULE_CONTROL = "0";
                    })
                }
                return;
            }else if(field.DEFAULT_VALUE == "1"){
                if(_.indexOf(_this.$router.getCurrentRoute().modules ,"ORG_TAX_INFO_MODULE2") != -1){
                    _this.groupDatas.ORG_TAX_INFO.ORG_TAX_INFO_MODULE3.forEach(element => {
                        element.MODULE_CONTROL = "1";
                    })

                    if(_this.groupDatas.ORG_TAX_INFO.ORG_TAX_INFO_MODULE3.length == 1){
                        _this.groupDatas.ORG_TAX_INFO.ORG_TAX_INFO_MODULE3[0].MODULE_ADD = "1";
                    }
                }else if(_.indexOf(_this.$router.getCurrentRoute().modules ,"ORG_TAX_CONTROLER_MODULE6") != -1){
                    _this.groupDatas.ORG_TAX_CONTROL_INFO.ORG_TAX_CONTROLER_MODULE7.forEach(element => {
                        element.MODULE_CONTROL = "1";
                    })
                    if( _this.groupDatas.ORG_TAX_CONTROL_INFO.ORG_TAX_CONTROLER_MODULE7.length == 1){
                    _this.groupDatas.ORG_TAX_CONTROL_INFO.ORG_TAX_CONTROLER_MODULE7[0].MODULE_ADD = "1";
                    }
                }
            }else{
                if(_.indexOf(_this.$router.getCurrentRoute().modules ,"ORG_TAX_INFO_MODULE2") != -1){
                    _this.groupDatas.ORG_TAX_INFO.ORG_TAX_INFO_MODULE3.forEach(element => {
                        element.MODULE_CONTROL = "0";
                    })
                }else if(_.indexOf(_this.$router.getCurrentRoute().modules ,"ORG_TAX_CONTROLER_MODULE6") != -1){
                    _this.groupDatas.ORG_TAX_CONTROL_INFO.ORG_TAX_CONTROLER_MODULE7.forEach(element => {
                        element.MODULE_CONTROL = "0";
                    })
                }
            }
            if(_.indexOf(_this.$router.getCurrentRoute().modules ,"ORG_TAX_INFO_MODULE2") != -1){
                if(_this.groupDatas.ORG_TAX_INFO.ORG_TAX_INFO_MODULE2[0].FIELDS.TAX_ID_RESON)
                    _this.groupDatas.ORG_TAX_INFO.ORG_TAX_INFO_MODULE2[0].FIELDS.TAX_ID_RESON.FIELD_CONTROL =  "1";
                }else if(_.indexOf(_this.$router.getCurrentRoute().modules ,"ORG_TAX_CONTROLER_MODULE6") != -1){
                if(_this.groupDatas.ORG_TAX_CONTROL_INFO.ORG_TAX_CONTROLER_MODULE6[0].FIELDS.TAX_ID_RESON)
                    _this.groupDatas.ORG_TAX_CONTROL_INFO.ORG_TAX_CONTROLER_MODULE6[0].FIELDS.TAX_ID_RESON.FIELD_CONTROL =  "1";
                }
             }
    },
    
    //涉税原因
    "CHECK_TAX_ID" : (_this, field,fieldData) =>{
    // if(_this.userType == "0"){
    //   if((fieldData.TAX_CITIZENSHIP.DEFAULT_VALUE && fieldData.TAX_CITIZENSHIP.DEFAULT_VALUE != "")|| (field.DEFAULT_VALUE&&field.DEFAULT_VALUE != "")){
    //     _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE7[0].FIELDS.TAX_ID_FLAG.FIELD_CONTROL =  "2";
    //     _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE7[0].FIELDS.TAX_ID_FLAG.DEFAULT_VALUE = "1";
    //   }else{
    //     _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE7[0].FIELDS.TAX_ID_FLAG.FIELD_CONTROL =  "0";
    //     _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE7[0].FIELDS.TAX_ID_FLAG.DEFAULT_VALUE = "";
    //   }
    // }
    },


    //涉税原因
    "CHECK_TAX_CITIZENSHIP" : (_this, field,fieldData) =>{
    // if(_this.userType == "0"){
    //   if((fieldData.TAX_ID.DEFAULT_VALUE && fieldData.TAX_ID.DEFAULT_VALUE != "")|| (field.DEFAULT_VALUE&&field.DEFAULT_VALUE != "")){
    //     _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE7[0].FIELDS.TAX_ID_FLAG.FIELD_CONTROL =  "2";
    //     _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE7[0].FIELDS.TAX_ID_FLAG.DEFAULT_VALUE = "1";
    //   }else{
    //     _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE7[0].FIELDS.TAX_ID_FLAG.FIELD_CONTROL =  "0";
    //     _this.groupDatas.TAX_INFO.CUST_TAX_INFO_MODULE7[0].FIELDS.TAX_ID_FLAG.DEFAULT_VALUE = "";
    //   }
    // }
    },
    //现居地址国
    "CHECK_NATION_ENG": (_this, field,fieldData) =>{
        if(field.DEFAULT_VALUE == "CN"){
            fieldData.PROVINCE.FIELD_CONTROL = "0";
            fieldData.CITYCN.FIELD_CONTROL = "0";
            fieldData.DISTRICT_NAME.FIELD_CONTROL = "0";
        }else{
            fieldData.PROVINCE.FIELD_CONTROL = "1";
            fieldData.CITYCN.FIELD_CONTROL = "1";
            fieldData.DISTRICT_NAME.FIELD_CONTROL = "1";
        }
    },
    //出生地址国
    "CHECK_BIRTH_NATION_ENG": (_this, field,fieldData) =>{
        if(field.DEFAULT_VALUE == "CN"){
            fieldData.BIRTH_ADDRESS.FIELD_REQUIRED = "1";
            fieldData.BIRTH_ADDRESS.FIELD_CONTROL = "0";
            fieldData.BIRTH_ADDRESS1.FIELD_CONTROL = "1";
        }else{
            fieldData.BIRTH_ADDRESS.FIELD_REQUIRED = "0";
            fieldData.BIRTH_ADDRESS.FIELD_CONTROL = "1";
            fieldData.BIRTH_ADDRESS1.FIELD_CONTROL = "0";
        }
    },
    //省区联动
    "CHECK_PROVINCE":(_this, field,fieldData) =>{

        var outCityData = _.map(_.filter(fieldData["CITYCN"].FIELD_DICT_NAME, function (v) {
            if(field.DEFAULT_VALUE&&v.DICT_ITEM){
                return _.indexOf(field.DEFAULT_VALUE.charAt(0), v.DICT_ITEM.charAt(0)) != -1 && _.indexOf(field.DEFAULT_VALUE.charAt(1), v.DICT_ITEM.charAt(1)) != -1;
            }
        }), "DICT_ITEM");
        if(outCityData&&outCityData.length == 1){
            fieldData["CITYCN"].DEFAULT_VALUE =  outCityData[0];
        }
        fieldData["CITYCN"].FIELD_DICT_FILTER = outCityData;

        var outDistrictData = _.map(_.filter(fieldData["DISTRICT_NAME"].FIELD_DICT_NAME, function (v) {
            if(field.DEFAULT_VALUE&&v.DICT_ITEM){
                return _.indexOf(field.DEFAULT_VALUE.charAt(0), v.DICT_ITEM.charAt(0)) != -1 && _.indexOf(field.DEFAULT_VALUE.charAt(1), v.DICT_ITEM.charAt(1)) != -1;
            }
        }), "DICT_ITEM");
        if(outDistrictData&&outDistrictData.length == 1){
            fieldData["DISTRICT_NAME"].DEFAULT_VALUE =  outDistrictData[0];
        }
        fieldData["DISTRICT_NAME"].FIELD_DICT_FILTER = outDistrictData;
    },
    //市区联动
    "CHECK_CITYCN":(_this, field,fieldData) =>{
        if(stringConfig.isEmptyStr(fieldData.PROVINCE.DEFAULT_VALUE) && fieldData.PROVINCE.FIELD_CONTROL == "0"){
            _this.messageBox({
                hasMask:true,
                messageText:"请先填写省区代码",
                confirmButtonText:'确定',
                typeMessage:'warn', 
                showMsgBox:true  
            })
        }
    },
    //省区联动
    "CHECK_DISTRICT_NAME":(_this, field,fieldData) =>{
        if(stringConfig.isEmptyStr(fieldData.PROVINCE.DEFAULT_VALUE)&& fieldData.PROVINCE.FIELD_CONTROL == "0"){
            _this.messageBox({
                hasMask:true,
                messageText:"请先填写省区代码",
                confirmButtonText:'确定',
                typeMessage:'warn', 
                showMsgBox:true  
            })
        }else  if(stringConfig.isEmptyStr(fieldData.CITYCN.DEFAULT_VALUE)&& fieldData.CITYCN.FIELD_CONTROL == "0"){
            _this.messageBox({
                hasMask:true,
                messageText:"请先填写市区代码",
                confirmButtonText:'确定',
                typeMessage:'warn', 
                showMsgBox:true  
            })
        }

    },
    //是否有纳税人识别号
    "CHECK_HAS_TAXPAYER_IDNO":(_this, field,fieldData) =>{
        if(field.DEFAULT_VALUE == "0" ){
            fieldData.TAXPAYER_IDNO.FIELD_CONTROL = "1"; //纳税人识别号
            fieldData.OPP_NO_TAXPAYERID_REASON.FIELD_CONTROL = "0"; //
            if(fieldData.OPP_NO_TAXPAYERID_REASON.DEFAULT_VALUE == "2"){
                fieldData.NO_TAXPAYERID_REASON.FIELD_CONTROL = "0";
            }else{
                fieldData.NO_TAXPAYERID_REASON.FIELD_CONTROL = "1";
            }
            
        }else if(field.DEFAULT_VALUE == "1" ){
            fieldData.TAXPAYER_IDNO.FIELD_CONTROL = "0";
            fieldData.NO_TAXPAYERID_REASON.FIELD_CONTROL = "1";
            fieldData.OPP_NO_TAXPAYERID_REASON.FIELD_CONTROL = "1";

        }
    },

    //无纳税人识别号原因
    "CHECK_OPP_NO_TAXPAYERID_REASON":(_this, field,fieldData) =>{
        if(field.DEFAULT_VALUE == "1"){
            fieldData.NO_TAXPAYERID_REASON.FIELD_CONTROL = "1";
        }else if(field.DEFAULT_VALUE == "2"){
            fieldData.NO_TAXPAYERID_REASON.FIELD_CONTROL = "0";
        }
    },

    //未取得纳税人识别号原因
    "CHECK_NO_TAXPAYERID_REASON":(_this, field,fieldData) =>{

    },

    //收入类型联动
    "CHECK_PAYMENT_TYPE":(_this, field,fieldData) =>{
        if(stringConfig.isNotEmptyStr(field.DEFAULT_VALUE)){
            fieldData.PAYMENT_CURR.FIELD_REQUIRED = "1";
            fieldData.PAYMENT_ASSET.FIELD_REQUIRED = "1";
        }else{
            fieldData.PAYMENT_CURR.FIELD_REQUIRED = "0";
            fieldData.PAYMENT_ASSET.FIELD_REQUIRED = "0";
        }
    },
    
    "addModuleFinished": (_this,moduleObj) => {
        let fieldData = moduleObj.FIELDS
        if(fieldData.MODULE_ID == "CUST_TAX_INFO_MODULE5"){
            fieldData.FIELDS.TAXPAYER_IDNO.FIELD_CONTROL = "1";
            fieldData.FIELDS.NO_TAXPAYERID_REASON.FIELD_CONTROL = "1";
            fieldData.FIELDS.OPP_NO_TAXPAYERID_REASON.FIELD_CONTROL = "1";
        }
        return true;
    },
}