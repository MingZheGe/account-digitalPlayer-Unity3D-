/*
 * @Description: 客户资料变更 机构联系信息部分
 * @Date: 2019-06-27 10:55:56
*/

import bizPublicMethod from '../../../../businessTools/bizPublicMethod';

export default {
    //----------------------------------钩子函数----------------------//
    /*
     * @Description: 钩子函数 加载历史数据之前触发
     * @Date: 2019-06-27 11:03:56
    */
   orgRelaInfoBeforeLoadBiz: function (_this) {
        //初始化字段
        if(_this.userType == "1") {
            let LEGAL_INFO = _this.oppBusiData.custAllInfo.ORG_INFO; // 法人信息
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this,["ORG_LEGAL_MODULE"],LEGAL_INFO);
            // beforeLoadBiz  后台返回数据渲染到页面
            let STOCKHOLDER_INFO = _this.oppBusiData.custAllInfo.STOCKHOLDER_INFO;
            let CONTROLER_INFO = _this.oppBusiData.custAllInfo.CONTROLER_INFO;
            let BENEFICIARY_INFO = _this.oppBusiData.custAllInfo.BENEFICIARY_INFO;
            if (STOCKHOLDER_INFO){
                bizPublicMethod.$blMethod.parseMoudleArray(_this,_this.groupDatas["ORG_STOCKHOLDER_INFO"]["ORG_STOCKHOLDER_MODULE"],STOCKHOLDER_INFO);
            }
            if(CONTROLER_INFO){
                _this.oppBusiData.selfCtlFlag = true;
                bizPublicMethod.$blMethod.parseMoudleArray(_this,_this.groupDatas["ORG_CONTROLLER_INFO"]["ORG_CONTROLLER_MODULE"],CONTROLER_INFO);
            }
            if(BENEFICIARY_INFO){
                _this.oppBusiData.selfBenFlag = true;
                bizPublicMethod.$blMethod.parseMoudleArray(_this,_this.groupDatas["ORG_BENEFICIARY_INFO"]["ORG_BENEFICIARY_MODULE"],BENEFICIARY_INFO);
            }
            let custAllInfo = _this.oppBusiData.custAllInfo;
            custAllInfo.AML_FLAG = _this.busiData.AML_FLAG;
            custAllInfo.AML_CUST_TYPE = _this.busiData.ORG_BASIC_INFO && _this.busiData.ORG_BASIC_INFO || "";
            if(custAllInfo.AML_FLAG){
                custAllInfo.AML_INFO_FLAG  = custAllInfo.AML_CUST_TYPE !== "1";
                custAllInfo.ORG_AML_INFO = custAllInfo.AML_INFO_FLAG ? (_this.busiData.ORG_AML_INFO || []) : [];
            }
        }

    },

    orgRelaInfoAfterLoadBiz: function (_this) {
        //重新解析历史数据
        if(_this.historyData.ORG_STOCKHOLDER_INFO && _this.historyData.ORG_CONTROLLER_INFO && _this.historyData.ORG_BENEFICIARY_INFO) {
            bizPublicMethod.$blMethod.parseMoudleArray(_this,_this.groupDatas["ORG_STOCKHOLDER_INFO"]["ORG_STOCKHOLDER_MODULE"],_this.historyData.ORG_STOCKHOLDER_INFO);
            bizPublicMethod.$blMethod.parseMoudleArray(_this,_this.groupDatas["ORG_CONTROLLER_INFO"]["ORG_CONTROLLER_MODULE"],_this.historyData.ORG_CONTROLLER_INFO);
            bizPublicMethod.$blMethod.parseMoudleArray(_this,_this.groupDatas["ORG_BENEFICIARY_INFO"]["ORG_BENEFICIARY_MODULE"],_this.historyData.ORG_BENEFICIARY_INFO);
        }
    },

    orgRelaInfoPageActivated: function (_this, groupId) {
        _this.$router.updateRoute(_this.$router.getCurrentRouteIndex(),"nextBtnText","填写完成");
    },

    orgRelaInfoLoadBizData: async function (_this, busiData) {

    },

    orgRelaInfoParseOldBiz: function (_this) {
        // let CORP_INFO = _this.oppBusiData.custAllInfo.CORP_INFO; // 法人信息
        // let STOCKHOLDER_INFO = _this.oppBusiData.custAllInfo.STOCKHOLDER_INFO; // 控股股东信息
        // let CONTROLLER_INFO = _this.oppBusiData.custAllInfo.CONTROLLER_INFO; // 机构实际控制人信息
        // let BENEFICIARY_INFO = _this.oppBusiData.custAllInfo.BENEFICIARY_INFO; // 机构受益人信息,"ORG_STOCKHOLDER_MODULE","ORG_CONTROLLER_MODULE","ORG_BENEFICIARY_MODULE"
        // bizPublicMethod.$blMethod.parseGroupsMouduleData(_this,["ORG_LEGAL_MODULE"],CORP_INFO);
        // if(STOCKHOLDER_INFO.length){bizTaxMethod.parseCountyContentArray(_this,_this.groupDatas["ORG_STOCKHOLDER_INFO"]["ORG_STOCKHOLDER_MODULE"],STOCKHOLDER_INFO)};
        // if(CONTROLLER_INFO.length){bizTaxMethod.parseCountyContentArray(_this,_this.groupDatas["ORG_CONTROLLER_INFO"]["ORG_CONTROLLER_MODULE"],CONTROLLER_INFO)};
        // if(BENEFICIARY_INFO.length){bizTaxMethod.parseCountyContentArray(_this,_this.groupDatas["ORG_BENEFICIARY_INFO"]["ORG_BENEFICIARY_MODULE"],BENEFICIARY_INFO)};
        // // _this.oppBusiData.oppData = oppData;
        // // bizPublicMethod.$blMethod.parseGroupsMouduleData(_this,["ORG_LEGAL_MODULE","ORG_STOCKHOLDER_MODULE","ORG_CONTROLLER_MODULE","ORG_BENEFICIARY_MODULE"],oppData);

    },

    orgRelaInfoParseOppBiz: function (_this, bdata) { // 解析身份证读卡数据

    },

    orgRelaInfoBeforeSave: function (_this, params) {
        this.orgRelaInfoGetData(_this, params);
    },


    orgRelaInfoGetData: function (_this, params) {
        let legalInfo = this.getLegalInfo(_this);
        let ORG_STOCKHOLDER_INFO = this.getStockHolderInfo(_this);
        let ORG_CONTROLLER_INFO = this.getControllerInfo(_this);
        let ORG_BENEFICIARY_INFO = this.getBeneficiaryInfo(_this);
        let custAllInfo = _this.oppBusiData.custAllInfo;
        let ORG_PARTNER_INFO = {};
        // if(isPartnerFlag){
        //     let oppPartnerInfo = _this.oppBusiData.custAllInfo.PARTNER_INFO;
        //     // 获取修改后页面字段数据
        //     ORG_PARTNER_INFO = this.getArrDiff(_this.groupDatas.ORG_PARTNER_INFO.ORG_PARTNER_MODULE, oppPartnerInfo,"PARTNER_NO", "PARTNER_NAME");
        // }
        // let oppBaseInfo = _this.oppBusiData.custAllInfo.OTHER_INFO;
        // let ORG_OTHER_INFO = {
        //     "SPECIAL_STATUS": oppBaseInfo.SPECIAL_STATUS,
        //     "CUST_GRP": oppBaseInfo.CUST_GRP,
        //     "CUST_CLS": oppBaseInfo.CUST_CLS,
        //     "AML_LVL": oppBaseInfo.AML_LVL,
        //     "IDCARD_TYPE": oppBaseInfo.IDCARD_TYPE,
        // }
        // let data2 = bizPublicMethod.$blMethod.compareInfo2(_this.oppBusiData.custAllInfo.OTHER_INFO, ORG_OTHER_INFO);
        // ORG_OTHER_INFO.DIFF_INFO = data2;
        
        if(ORG_CONTROLLER_INFO.IS_CHANGE ==="1" || ORG_STOCKHOLDER_INFO.IS_CHANGE ==="1" || ORG_BENEFICIARY_INFO.IS_CHANGE ==="1" ){
            _this.oppBusiData.IS_EXT_INFO_CHANGE = "1";
        }
        let res ={
            "LEGAL_TYPE": "",
            "ORG_LEGAL_REP_INFO": legalInfo.ORG_LEGAL_INFO,
            "ORG_CONTROLER_INFO": ORG_CONTROLLER_INFO.INFO || [],
            "ORG_STOCKHOLDER_INFO": ORG_STOCKHOLDER_INFO.INFO || [],
            "ORG_BENEFICIARY_INFO": ORG_BENEFICIARY_INFO.INFO || [],
            "ORG_ZT_CONTROLER_INFO": custAllInfo.ZT_CONTROLER_INFO || [],
            "ORG_BENEFICIARY_OWNER_INFO": custAllInfo.BENEFICIARY_OWNER_INFO || [],
            "IS_LEGAL_INFO_CHANGE": legalInfo.IS_LEGAL_INFO_CHANGE,
            "IS_CONTROLER_INFO_CHANGE": ORG_CONTROLLER_INFO.IS_CHANGE,
            "IS_STOCKHOLDER_INFO_CHANGE": ORG_STOCKHOLDER_INFO.IS_CHANGE,
            "IS_BENEFICIARY_INFO_CHANGE": ORG_BENEFICIARY_INFO.IS_CHANGE,
            "AML_INFO_FLAG": !!custAllInfo.AML_INFO_FLAG,
            "AML_INFO_CHANGE_FLAG": "0",
        }
        Object.assign(params, res);
    },

    /*
     * @Description: 点击下一步验证
     * @Author: chencheng
     * @Date: 2019-06-27 13:59:47
    */
   orgRelaInfoValidate: function (_this) {
        if (_this.$router.getCurrentRoute().nextBtnText == "填写完成") {
            _this.$router.goRoute("业务导航");
            return false;
        }
        return true;
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
    // 法人信息
    getLegalInfo: function(_this) {
        // 页面回填时的数据(旧值)
        let oppCorpInfo = _this.oppBusiData.custAllInfo.ORG_INFO;
        // 获取修改后页面字段数据
        let ORG_LEGAL_INFO = {}; // 存储当前页面填写的数据
        bizPublicMethod.$blMethod.changeObjKeys(_this.groupDatas.ORG_LEGAL_INFO.ORG_LEGAL_MODULE[0].FIELDS, ORG_LEGAL_INFO); // 将数据转换为Object
        ORG_LEGAL_INFO.LEGAL_EMAIL = oppCorpInfo.LEGAL_EMAIL;
        ORG_LEGAL_INFO.LEGAL_PERSON_TEL = oppCorpInfo.LEGAL_PERSON_TEL;
        ORG_LEGAL_INFO.LEGAL_REP_ID_BGN_DATE = oppCorpInfo.LEGAL_REP_ID_BGN_DATE;
        ORG_LEGAL_INFO.LEGAL_REP_POSITION = oppCorpInfo.LEGAL_REP_POSITION;
        ORG_LEGAL_INFO.LEGAL_REP_POSITION_PATION = ORG_LEGAL_INFO.LEGAL_REP_POSITION_PATION;
        let data1 = bizPublicMethod.$blMethod.compareInfo2(oppCorpInfo, ORG_LEGAL_INFO, "LEGAL_REP"); // 对比修改
        ORG_LEGAL_INFO.DIFF_INFO = data1;
        let IS_LEGAL_INFO_CHANGE = "0";
        if(data1.length){
            IS_LEGAL_INFO_CHANGE = "1";
        }
      
        return {
            "ORG_LEGAL_INFO": ORG_LEGAL_INFO,
            "IS_LEGAL_INFO_CHANGE": IS_LEGAL_INFO_CHANGE,
        };

    },
    // 控股股东信息
    getStockHolderInfo: function(_this) {
        // 页面回填时的数据(旧值)
        let oppStockHolderInfo = _this.oppBusiData.custAllInfo.STOCKHOLDER_INFO;
        // 获取修改后页面字段数据
        let ORG_STOCKHOLDER_INFO = {};
        ORG_STOCKHOLDER_INFO = this.getArrDiff(_this.groupDatas.ORG_STOCKHOLDER_INFO.ORG_STOCKHOLDER_MODULE, oppStockHolderInfo,"CONTROLLER_NO", "CONTROLLER");
        return ORG_STOCKHOLDER_INFO;
    },
    // 实际控制人信息ORG_CONTROLLER_INFO
    getControllerInfo: function(_this) {
        let oppControllerInfo = _this.oppBusiData.custAllInfo.CONTROLLER_INFO;
        // 获取修改后页面字段数据
        let ORG_CONTROLLER_INFO = {};
        ORG_CONTROLLER_INFO = this.getArrDiff(_this.groupDatas.ORG_CONTROLLER_INFO.ORG_CONTROLLER_MODULE, oppControllerInfo,"CONTROLER_NUM", "CONTROLER_NAME");
        return ORG_CONTROLLER_INFO;
    },
    // 受益人信息 ORG_BENEFICIARY_INFO
    getBeneficiaryInfo: function(_this) {
        let oppBeneficiaryInfo = _this.oppBusiData.custAllInfo.BENEFICIARY_INFO;
        // 获取修改后页面字段数据
        let ORG_BENEFICIARY_INFO = {};
        ORG_BENEFICIARY_INFO = this.getArrDiff(_this.groupDatas.ORG_BENEFICIARY_INFO.ORG_BENEFICIARY_MODULE, oppBeneficiaryInfo,"BENEFICIARY_NO", "BENEFICIARY_NAME");
        return ORG_BENEFICIARY_INFO;
    },

    /*
     * @Description: 
     * 1、对控股股东信息、机构实际控制信息  修改数据对比
     * @Author: chencheng
     * @Date: 2019-07-12 10:41:05
    */
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
        // if(keyId == "CONTROLLER_NO" || keyId == "STOCKHOLDER_NO"){ //当为控制人或控股股东时增加联系地址
        //     obj = _.extend({},obj,{ADDRESS: $(form).find("#ADDRESS").cityselect("getValue")});
        // }else if(keyId == "BENEFICIARY_OWNER"){ //当为受益人时增加联系地址
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

    //--------------------------------------------------检查逻辑--------------------------------------------------
}
