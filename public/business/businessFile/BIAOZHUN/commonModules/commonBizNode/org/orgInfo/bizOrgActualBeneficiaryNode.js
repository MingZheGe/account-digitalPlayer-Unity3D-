/*
 *   实际受益人(受益所有人)
 *   方法封装
 *   @author  yangyp
 */

import date from '../../../../../../../tools/date.js'
import * as utils from "../../../../../../../tools/util"
import smsService from '../../../../../../../service/sms-service'
import * as bizPubTools from "./../../bizPublicTools"
import stringConfig from "../../../../../../../tools/stringConfig.js"
import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../../business/businessTools/bizPublicMethod.js"
import {parseAddress} from '../../../../../../../tools/util'         //地址解析组件


const fetchActualBeneficiaryInfo = (_this,param)=> {
    return _this.$syscfg.K_Request('W0000119', param)
}
// 数据提交
const getData = function (_this) {

    let that = this,
        newBenefitInfo = _this.groupDatas.ORG_INFO.ACTUAL_BENEFICIARY,
        rowsData = []; // 获取页面上最新的值
    _.each(newBenefitInfo, (item, index) => {
        rowsData[index] = {};
        bizPublicMethod.$blMethod.changeObjKeys(item.FIELDS, rowsData[index]);
        rowsData[index].BENEFICIARY_NO = item.FIELDS.BENEFICIARY_NO.DEFAULT_VALUE
    })
    let benefitInfo = _this.oppBusiData.oldBusiData.ACTUAL_BENEFICIARY_INFO || [], // 获取原始数据 oldBusiData
        benefitInfoArr = [];

    _.each(rowsData, function (obj, index) {
        //判断当前是新增还是修改 OP_TYPE 0-新增 1-修改 2-删除 3-不变(后台需要对此进行过滤)
        let old = bizPublicMethod.$blMethod.findOldObjZT(benefitInfo, obj, "BENEFICIARY_NO"),
            diff = !!obj.BENEFICIARY_NO ? bizPublicMethod.$blMethod.compareInfoZT(old, obj) : [];
            
        benefitInfoArr.push(_.extend({}, {
            DIFF_INFO: diff,
            OP_TYPE: diff.length ? "1" : !!obj.BENEFICIARY_NO ? "3" : !!obj.BENEFICIARY_RELA ? "0" : "3", //1:修改 3:不变 0::新增
            isSync: syncInfo(_this, obj) ? "1" : "0", //受益人是否为法定代表人
            CHANGE_KEY: isChangeKeyField(old, obj, ["BENEFICIARY_NAME","BENEFICIARY_ID_TYPE","BENEFICIARY_ID"]) ? "1" : "0"//是否修改受益人三要素
        }, obj));
    })
    benefitInfo.filter(function (v) {
        return !_.filter(benefitInfoArr, {BENEFICIARY_NO: v.BENEFICIARY_NO})[0];
    }).forEach(function (v) {
        benefitInfoArr.push(_.extend({}, v, {DIFF_INFO: [], OP_TYPE: "2"})); // 2: 删除
    });
    // if(benefitInfoArr.length == 1 && (benefitInfoArr[0].STKEX==""|| benefitInfoArr[0].SECU_CODE==""||benefitInfoArr[0].MARKET_FIRM=="")) {
    //     benefitInfoArr[0].OP_TYPE = ""
    // }
    return benefitInfoArr;
}
const syncInfo = function (_this, formData){
    let legalData = {},
        legaFields = _this.groupDatas.ORG_INFO.LEGAL_INFO[0].FIELDS;
    for(let k in legaFields) {
        legalData[k] = legaFields[k].DEFAULT_VALUE
    }
    if(legalData.LEGAL_REP == formData.BENEFICIARY_NAME && legalData.LEGAL_REP_ID_TYPE == formData.BENEFICIARY_ID_TYPE && legalData.LEGAL_REP_ID_CODE == formData.BENEFICIARY_ID) {
        return true;
    }

    return false;
}
const isChangeKeyField = function(oldObj, newObj, key){
    let changeFlag = false;
    if(!oldObj){
        return true;
    }
    _.each(_.isArray(key) ? key : key.split(','), function(name){
        if(oldObj[name] != newObj[name]){
            changeFlag = true;
            return false;
        }
    });
    return changeFlag;
}
export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizOrgActualBeneficiaryNodeBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizOrgActualBeneficiaryNodeBeforeLoadBiz: function (_this) {
        // 字段设置
        let fieldData = _this.groupDatas.ORG_INFO.ACTUAL_BENEFICIARY[0]["FIELDS"];
        fieldData.BENEFICIARY_ADDR.VALID_TYPE = "length[24,64]|on-blur";
        fieldData.BENEFICIARY_NAME.VALID_TYPE = "length[4,64]";
        fieldData.SHARE_RATIO.IS_SHOW_BUTTON = true;
        fieldData.SHARE_RATIO.FIELD_BUTTON_TXT = '%';
        fieldData.BENEFICIARY_NO.FIELD_CONTROL = "1";
        fieldData.BENEFICIARY_EXP_DATE.VALID_TYPE = "end";
        fieldData.BENEFICIARY_ID.VALID_TYPE = "val[0,32]|on-blur|on-prompt";
        fieldData.SHARE_RATIO.VALID_TYPE =  "numberex[10, 3, 2]";

        _this.groupDatas.ORG_INFO.ACTUAL_BENEFICIARY[0].MAX_LENGTH = 10;
        let dictItem=  _.map(fieldData.BENEFICIARY_ID_TYPE.FIELD_DICT_NAME, 'DICT_ITEM')
        fieldData.BENEFICIARY_ID_TYPE.FIELD_DICT_FILTER = _.filter(dictItem, function(item) {
            return item.charAt(0) == '0'
        })
        _this.groupDatasTpl.ORG_INFO.ACTUAL_BENEFICIARY = _.cloneDeep(_this.groupDatas.ORG_INFO.ACTUAL_BENEFICIARY);

        if(_this.oppBusiData.oldBusiData && _this.oppBusiData.oldBusiData.ACTUAL_BENEFICIARY_INFO && _this.oppBusiData.oldBusiData.ACTUAL_BENEFICIARY_INFO.length) {
            bizPublicMethod.$blMethod.parseOldBiz(_this,_this.groupDatas, {"ORG_INFO" :{"ACTUAL_BENEFICIARY" : _this.oppBusiData.oldBusiData.ACTUAL_BENEFICIARY_INFO}});
        }
       
        
    },
    /*
     *@method bizOrgActualBeneficiaryNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-13 09:42:56
     */
    bizOrgActualBeneficiaryNodeAfterLoadBiz: function (_this) {
         // 字段设置
        
        if(_this.oppBusiData.newBusiData && 
            _this.oppBusiData.newBusiData.ACTUAL_BENEFICIARY && 
            _this.oppBusiData.newBusiData.ACTUAL_BENEFICIARY.length){
                let newBeneficiary = _this.oppBusiData.newBusiData.ACTUAL_BENEFICIARY.filter(item => {
                    return item.OP_TYPE != "2"
                })
                bizPublicMethod.$blMethod.parseOldBiz(_this,_this.groupDatas, {"ORG_INFO" :{"ACTUAL_BENEFICIARY" : newBeneficiary}});
                _.each(_this.groupDatas["ORG_INFO"]["ACTUAL_BENEFICIARY"],(item) => {
                    item.FIELDS.SHARE_RATIO.IS_SHOW_BUTTON = true;
                    item.FIELDS.SHARE_RATIO.FIELD_BUTTON_TXT = '%';
                })
         }

        //  _.each(_this.groupDatas["ORG_INFO"]["ACTUAL_BENEFICIARY"],function(c,v){
        //     c.FIELDS.BENEFICIARY_ID_TYPE.FIELD_LAST_VALUE = c.FIELDS.BENEFICIARY_ID_TYPE.DEFAULT_VALUE
        // }) 
    },
    /*
     *@method bizOrgActualBeneficiaryNodeBeforeSave
     *@desc 钩子函数 自定义保存数
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizOrgActualBeneficiaryNodeBeforeSave: async function (_this, params) {
        params.ACTUAL_BENEFICIARY = getData(_this)
    },
    
    // 添加按钮
    "bizOrgActualBeneficiaryNodeAddModuleFinished": (_this, moduleld) => {
        moduleld.FIELDS.BENEFICIARY_EXP_DATE.VALID_TYPE = "end";
        
        moduleld.FIELDS.SHARE_RATIO.IS_SHOW_BUTTON = true;
        moduleld.FIELDS.SHARE_RATIO.FIELD_BUTTON_TXT = '%';
        moduleld.FIELDS.SHARE_RATIO.VALID_TYPE =  "numberex[10, 3, 2]";
        moduleld.FIELDS.NATION.DEFAULT_VALUE = "CHN";
    },
    /*
     *@method bizOrgActualBeneficiaryNodeValidate
     *@desc 钩子函数 下一步验证
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizOrgActualBeneficiaryNodeValidate: function (_this) {
        // var that = this,
        // benefitInfo = that.getOriginalData();
        // that.benefitInfoArr = [];
        // that.isChanged = false;
      
    },

    /*
     *@method bizOrgActualBeneficiaryNodePageActivated
     *@desc 钩子函数：页面激活
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizOrgActualBeneficiaryNodePageActivated: function (_this, groupId) {  
        /**只有第一个有从法人资料同步，且不需要写入tpl中 */
        // _this.groupDatas.ORG_INFO.ACTUAL_BENEFICIARY[0].MODULE_CUSTOMIZE_TXT = _this.oppBusiData.copyContentName;
        // _this.groupDatas.ORG_INFO.ACTUAL_BENEFICIARY[0].MODULE_CUSTOMIZE = '1';
        _this.$set( _this.groupDatas.ORG_INFO.ACTUAL_BENEFICIARY[0], "MODULE_CUSTOMIZE_TXT", _this.oppBusiData.copyContentName)
        _this.$set(_this.groupDatas.ORG_INFO.ACTUAL_BENEFICIARY[0], "MODULE_CUSTOMIZE",'1');
        // _this.groupDatas.ORG_INFO.ACTUAL_BENEFICIARY.forEach(function(item){
        //     item.FIELDS["BENEFICIARY_NO"].FIELD_CONTROL = "1";
        //     item.FIELDS["BENEFICIARY_EXP_DATE"].VALID_TYPE = "end";
        //     // item.FIELDS.BENEFICIARY_TYPE.FIELD_FUNCTION = "CHECK_PRO_BENEFICIARY_TYPE";
        //     item.FIELDS.BENEFICIARY_ID.VALID_TYPE = "val[0,32]|on-blur|on-prompt";
        //     item.FIELDS.BENEFICIARY_ID.promptValue =  item.FIELDS.BENEFICIARY_ID.DEFAULT_VALUE;           
        //     item.FIELDS.SHARE_RATIO.VALID_TYPE =  "numberex[10, 3, 2]";
        // })
        

        if(_this.userType == "1") {
            if(["02","03",].includes(_this.groupDatas.ORG_INFO.CUST_BASIC_INFO[0].FIELDS.SZORGTYPE.DEFAULT_VALUE)) {
                let  field = _this.groupDatas.ORG_INFO.ACTUAL_BENEFICIARY[0].FIELDS;
                _.each(field, function(item) {
                    item.FIELD_REQUIRED = "0";
                    item.message = "";
                    item.correct = true;
                    item.showerr = false;
                })
                // field.FIELDS.BENEFICIARY_ID.FIELD_REQUIRED = "0";
                // field.FIELDS.BENEFICIARY_ID.message = "";
                // field.FIELDS.BENEFICIARY_RELA.FIELD_REQUIRED = "0";
                // field.FIELDS.BENEFICIARY_NAME.FIELD_REQUIRED = "0";
                // field.FIELDS.BENEFICIARY_NAME.message = "";
                // field.FIELDS.BENEFICIARY_ID_TYPE.FIELD_REQUIRED = "0";
                // field.FIELDS.BENEFICIARY_ADDR.FIELD_REQUIRED = "0";
                // field.FIELDS.BENEFICIARY_EXP_DATE.FIELD_REQUIRED = "0";
                // field.FIELDS.BENEFICIARY_TYPE.FIELD_REQUIRED = "0";
                for (let index = 1; index < _this.groupDatas.ORG_INFO.ACTUAL_BENEFICIARY.length; index++) {
                    const element = _this.groupDatas.ORG_INFO.ACTUAL_BENEFICIARY[index];
                    element.FIELDS.BENEFICIARY_ID.FIELD_REQUIRED = "1";
                    element.FIELDS.BENEFICIARY_RELA.FIELD_REQUIRED = "1";
                    element.FIELDS.BENEFICIARY_NAME.FIELD_REQUIRED = "1";
                    element.FIELDS.BENEFICIARY_ID_TYPE.FIELD_REQUIRED = "1";
                    element.FIELDS.BENEFICIARY_ADDR.FIELD_REQUIRED = "1";
                    element.FIELDS.BENEFICIARY_EXP_DATE.FIELD_REQUIRED = "1";
                    element.FIELDS.BENEFICIARY_TYPE.FIELD_REQUIRED = "1";
                    element.FIELDS.NATION.FIELD_REQUIRED = "1";
                    element.FIELDS.SPECIAL_PERSON_FLAG.FIELD_REQUIRED = "1";
                }
                // field.NATION.FIELD_REQUIRED = "1";
                // field.SPECIAL_PERSON_FLAG.FIELD_REQUIRED = "1";
            }else {
                _this.pushFlowTip({
                    title:"为最终控制非自然人客户及交易过程或者最终享有交易利益的自然人，需要进行受益所有人识别的非自然人客户至少有一名受益所有人。",
                    key:'warningTip',
                    type:'warning'
                })
                let  field = _this.groupDatas.ORG_INFO.ACTUAL_BENEFICIARY[0];
                field.FIELDS.BENEFICIARY_ID.FIELD_REQUIRED = "1";
                field.FIELDS.BENEFICIARY_RELA.FIELD_REQUIRED = "1";
                field.FIELDS.BENEFICIARY_NAME.FIELD_REQUIRED = "1";
                field.FIELDS.BENEFICIARY_ID_TYPE.FIELD_REQUIRED = "1";
                field.FIELDS.BENEFICIARY_ADDR.FIELD_REQUIRED = "1";
                field.FIELDS.BENEFICIARY_EXP_DATE.FIELD_REQUIRED = "1";
                field.FIELDS.BENEFICIARY_TYPE.FIELD_REQUIRED = "1";
                field.FIELDS.NATION.FIELD_REQUIRED = "1";
                field.FIELDS.SPECIAL_PERSON_FLAG.FIELD_REQUIRED = "1";
            }

        }else if(_this.userType == "2") {
            _this.pushFlowTip({
                title:`1.基金类产品：至少有一名受益所有人。（1）拥有超过 25%产品份额（2）基金经理（3）直接操作管理基金的自然人（填写此项还应进一步说明相关自然人与基金产品的关系）;
                2.信托产品：至少有两名受益所有人。（1）受益人（2）委托人（3）受托人（4） 其他（填写此项还应进一步说明相关自然人与信托产品的关系）`,
                key:'warningTip',
                type:'warning'
            })
            
        }
        // _this.$refs.flowTip.flowTips = [];
        // if (_this.groupDatas.ORG_INFO.ACTUAL_BENEFICIARY[0].FIELDS.BENEFICIARY_EXP_DATE.DEFAULT_VALUE && date.compareDate(_this.groupDatas.ORG_INFO.ACTUAL_BENEFICIARY[0].FIELDS.BENEFICIARY_EXP_DATE.DEFAULT_VALUE, date.getClientDate("yyyyMMdd")) == -1 ) {
        //     _this.pushFlowTip({
        //         title:"实际受益人(受益所有人)的证件有效期（止）[" + _this.groupDatas.ORG_INFO.ACTUAL_BENEFICIARY[0].FIELDS.BENEFICIARY_EXP_DATE.DEFAULT_VALUE + "]小于当前系统日期[" + date.getClientDate("yyyyMMdd") + "]！",
        //         key:'warningTip',
        //         type:'warning'
        //     })
        // }
        _this.groupDatas.ORG_INFO.ACTUAL_BENEFICIARY[0].FIELDS.NATION.FIELD_FUNCTION = "CHECK_NATION";

    },
    /**
     * @method bizOrgActualBeneficiaryNodeDeleteModuleFinished
     * @desc 钩子函数：实际受益人模块的删除
     * @param {*} _this 
     * @param {*} fieldData 删除的模块
     * @author zky
     */
    bizOrgActualBeneficiaryNodeDeleteModuleFinished: function (_this, fieldData) {  
        if (fieldData[0].MODULE_CUSTOMIZE_TXT == "从法人资料同步") {
            _this.$set( _this.groupDatas.ORG_INFO.ACTUAL_BENEFICIARY[0],"MODULE_CUSTOMIZE_TXT", _this.oppBusiData.copyContentName)
            _this.$set(_this.groupDatas.ORG_INFO.ACTUAL_BENEFICIARY[0],"MODULE_CUSTOMIZE",'1');
        }
    },
    CHECK_BENEFICIARY_RELA:(_this, field, fieldData) => {
        let oldBusi = _this.oppBusiData.newBusiData &&  _this.oppBusiData.newBusiData.ACTUAL_BENEFICIARY;
        let index = _.findIndex(oldBusi, function(o) { return o.BENEFICIARY_RELA == field.DEFAULT_VALUE; });
        if (oldBusi && index != -1 && index == _this.$store.state.fieldchange.index) {
            fieldData["BENEFICIARY_NAME"].DEFAULT_VALUE = oldBusi && oldBusi[index].BENEFICIARY_NAME;
            fieldData["BENEFICIARY_ID_TYPE"].DEFAULT_VALUE = oldBusi && oldBusi[index].BENEFICIARY_ID_TYPE;
            fieldData["BENEFICIARY_ID"].DEFAULT_VALUE = oldBusi && oldBusi[index].BENEFICIARY_ID;
            fieldData["BENEFICIARY_ADDR"].DEFAULT_VALUE = oldBusi && oldBusi[index].BENEFICIARY_ADDR;
            fieldData["BENEFICIARY_EXP_DATE"].DEFAULT_VALUE = oldBusi && oldBusi[index].BENEFICIARY_EXP_DATE;
            fieldData["BENEFICIARY_TYPE"].DEFAULT_VALUE = oldBusi && oldBusi[index].BENEFICIARY_TYPE;
            fieldData["SHARE_RATIO"].DEFAULT_VALUE = oldBusi && oldBusi[index].SHARE_RATIO;
            fieldData["BENEFICIARY_ID"].promptValue = oldBusi && oldBusi[index].BENEFICIARY_ID;
            
        } else {
            for (let key in fieldData) {
                if (key != "BENEFICIARY_RELA"&&key !== "BENEFICIARY_NO" && key!= "SHARE_RATIO" && key!= "NATION") {
                    fieldData[key].FIELD_CONTROL = "0";
                    fieldData[key].DEFAULT_VALUE = "";
                }
            }
        }

        if(field.DEFAULT_VALUE == "0Z"){
            _this.groupDatas.ORG_INFO.ACTUAL_BENEFICIARY[0].MODULE_READ = "0";
        }else{
            _this.groupDatas.ORG_INFO.ACTUAL_BENEFICIARY[0].MODULE_READ = "1";
        }
    },
    CHECK_BENEFICIARY_TYPE: function(_this, field, fieldData) {
        let benefiType = ['1', '4', '9'];
        if(benefiType.includes(field.DEFAULT_VALUE)) {
            fieldData.SHARE_RATIO.FIELD_CONTROL = "0";
            fieldData.SHARE_RATIO.FIELD_REQUIRED = "1";
        }else {
            fieldData.SHARE_RATIO.FIELD_CONTROL = "1";
            fieldData.SHARE_RATIO.FIELD_REQUIRED = "0";
        }
        if(_this.userType=="1" && ["02","03",].includes(_this.groupDatas.ORG_INFO.CUST_BASIC_INFO[0].FIELDS.SZORGTYPE.DEFAULT_VALUE)) {
            fieldData.SHARE_RATIO.FIELD_REQUIRED = "0";
        }

    },
    CHECK_BENEFICIARY_MODULE_RADIO:(_this, field, fieldData) => {
        if(field.DEFAULT_VALUE === "true"){
            let legalFields = _this.groupDatas.ORG_INFO.LEGAL_INFO[0].FIELDS;
            fieldData.BENEFICIARY_NAME.DEFAULT_VALUE = legalFields.LEGAL_REP.DEFAULT_VALUE;
            fieldData.BENEFICIARY_ID.DEFAULT_VALUE = legalFields.LEGAL_REP_ID_CODE.DEFAULT_VALUE;
            fieldData.BENEFICIARY_EXP_DATE.DEFAULT_VALUE = legalFields.LEGAL_REP_ID_EXP_DATE.DEFAULT_VALUE;
            fieldData.BENEFICIARY_ID_TYPE.DEFAULT_VALUE = legalFields.LEGAL_REP_ID_TYPE.DEFAULT_VALUE;
        }else{
            fieldData.BENEFICIARY_NAME.DEFAULT_VALUE = _this.oppBusiData.newBusiData.ACTUAL_BENEFICIARY_INFO && _this.oppBusiData.newBusiData.ACTUAL_BENEFICIARY_INFO.BENEFICIARY_NAME || "";
            fieldData.BENEFICIARY_ID.DEFAULT_VALUE = _this.oppBusiData.newBusiData.ACTUAL_BENEFICIARY_INFO && _this.oppBusiData.newBusiData.ACTUAL_BENEFICIARY_INFO.BENEFICIARY_ID || "";
            fieldData.BENEFICIARY_EXP_DATE.DEFAULT_VALUE = _this.oppBusiData.newBusiData.ACTUAL_BENEFICIARY_INFO && _this.oppBusiData.newBusiData.ACTUAL_BENEFICIARY_INFO.BENEFICIARY_EXP_DATE || "";
            fieldData.BENEFICIARY_ID_TYPE.DEFAULT_VALUE = _this.oppBusiData.newBusiData.ACTUAL_BENEFICIARY_INFO && _this.oppBusiData.newBusiData.ACTUAL_BENEFICIARY_INFO.BENEFICIARY_ID_TYPE || "";
        }
    },
    CHECK_BENEFICIARY_ID_TYPE: (_this, field, fieldData) => {
        // if(field.DEFAULT_VALUE == field.FIELD_LAST_VALUE && field.DEFAULT_VALUE != "") return;

        if (_.indexOf(["0b", "0c"], field.DEFAULT_VALUE) !== -1) {
            fieldData.BENEFICIARY_ID.VALID_TYPE = 'fixedNumLength[9]|on-prompt|on-blur'
        } else if(field.DEFAULT_VALUE == '0d') {
            fieldData.BENEFICIARY_ID.VALID_TYPE = 'fixedNumLength[8]|on-prompt|on-blur'
        } else if (field.DEFAULT_VALUE == '00' || field.DEFAULT_VALUE == '08') {
            fieldData.BENEFICIARY_ID.VALID_TYPE = 'iscard|on-prompt|on-blur'
        } else if (field.DEFAULT_VALUE == '10') {
            fieldData.BENEFICIARY_ID.VALID_TYPE = 'licensecode|on-prompt|on-blur'
        } else {
            fieldData.BENEFICIARY_ID.VALID_TYPE = 'charMinus[0,32]|on-prompt|on-blur'
        }
        // if (field.DEFAULT_VALUE != _this.oppBusiData.preIdType) {
        //     _this.oppBusiData.preIdType = field.DEFAULT_VALUE;
        //     fieldData.BENEFICIARY_ID.DEFAULT_VALUE = '';
        // }
        if((field.DEFAULT_VALUE == field.FIELD_LAST_VALUE || field.FIELD_LAST_VALUE == "") && field.DEFAULT_VALUE != "" ) return;

        field.FIELD_LAST_VALUE = field.DEFAULT_VALUE;
        fieldData.BENEFICIARY_ID.DEFAULT_VALUE = "";
        fieldData.BENEFICIARY_ID.promptValue = ""; 

        let LEGAL_INFO = _.get(_this.groupDatas, 'ORG_INFO.LEGAL_INFO[0].FIELDS', {});
        let newOld = _.get(_this.oppBusiData,"ACTUAL_BENEFICIARY",{});
        if((field.DEFAULT_VALUE == LEGAL_INFO.LEGAL_REP_ID_TYPE.DEFAULT_VALUE && fieldData.BENEFICIARY_ID.DEFAULT_VALUE == LEGAL_INFO.LEGAL_REP_ID_CODE.DEFAULT_VALUE)
         || (field.DEFAULT_VALUE == newOld.BENEFICIARY_ID_TYPE && fieldData.BENEFICIARY_ID.DEFAULT_VALUE == newOld.BENEFICIARY_ID)){}else {
            fieldData.BENEFICIARY_ID.DEFAULT_VALUE = "";
            fieldData.BENEFICIARY_ID.promptValue = "";
        }
    },
    CHECK_BENEFICIARY_ADDR: (_this, field, fieldData) => {
        let addressTextInfo = parseAddress(field.DEFAULT_VALUE);
        field.addressInfo = addressTextInfo;
        if (fieldData.ZIP_CODE && "addressInfo" in field) {
            if(field.addressInfo && field.addressInfo.length > 3 &&stringConfig.isNotEmptyStr(field.addressInfo[3])){
                fieldData.ZIP_CODE.DEFAULT_VALUE = field.addressInfo[3];
                fieldData.ZIP_CODE.FIELD_CONTROL = "2";
                fieldData.ZIP_CODE.correct = true;
            }else{
                fieldData.ZIP_CODE.FIELD_CONTROL = "0";
            }
        }
    },
    CHECK_NATION:  (_this, field, fieldData) => {
        field.DEFAULT_VALUE = field.DEFAULT_VALUE.length? field.DEFAULT_VALUE : "CHN";
    },
    
    BENEFICIARY_MODULE_customizeModule: (_this, moduleId, fieldData) => {
    }
}

