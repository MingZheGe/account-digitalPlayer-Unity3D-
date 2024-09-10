/*
 *   诚信记录信息
 *   方法封装
 *   @author  yangyp
 */

import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../../business/businessTools/bizPublicMethod.js"
const fetchCreditRecordArr = (_this,param)=> {
    return _this.$syscfg.K_Request('W0000119', param)
}
const bizCreditRececordNodeBeforeLoadBizCommon = function(_this) {
    if(_this.userType != "0"){
        groupId = "ORG_INFO";
    }else{
        groupId = "CUST_INFO"; 
    }
    _this.groupDatas[groupId].CREDIT_RECORD[0].MAX_LENGTH = "10";
    _this.groupDatasTpl[groupId].CREDIT_RECORD[0].MAX_LENGTH = "10";
    _this.groupDatas[groupId].IS_CREDIT_RECORD[0].FIELDS.IS_HONEST.isShowAllBtn = false;
}
let groupId = "CUST_INFO";
export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizCreditRececordNodeBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizCreditRececordNodeBeforeLoadBiz: function (_this) {
        bizCreditRececordNodeBeforeLoadBizCommon(_this)
        let param = {
            bex_codes: "L1192181",
            CUST_CODE: _this.customerInfo.CUST_CODE ,
        }
        return Promise.all([
            fetchCreditRecordArr(_this,param)
        ]).then(res => {
            
            var d = res && res[0] && res[0].Data && res[0].Data || [];
            let filterCreditRecordData = _.filter(d, function (v) {
                return  v.RECORD_SOURCE != "07";
            });
            if (filterCreditRecordData.length) {
                _this.groupDatas[groupId].IS_CREDIT_RECORD[0].FIELDS.IS_HONEST.DEFAULT_VALUE = "1";
                _this.groupDatas[groupId].CREDIT_RECORD[0].MODULE_CONTROL = "1";
                if(groupId == "CUST_INFO"){
                    bizPublicMethod.$blMethod.parseOldBiz(_this,_this.groupDatas, {"CUST_INFO" :  {"CREDIT_RECORD" : filterCreditRecordData}});
                }else if(groupId == "ORG_INFO"){
                    bizPublicMethod.$blMethod.parseOldBiz(_this,_this.groupDatas, {"ORG_INFO" :  {"CREDIT_RECORD" : filterCreditRecordData}});
                }
            } else {
                _this.groupDatas[groupId].IS_CREDIT_RECORD[0].FIELDS.IS_HONEST.DEFAULT_VALUE = "0";
                _this.groupDatas[groupId].CREDIT_RECORD[0].MODULE_CONTROL = "0";
            }
        })
    },
    bizCreditRececordNodeBeforeLoadBizOpenAcct: function (_this) {
        bizCreditRececordNodeBeforeLoadBizCommon(_this)
        _this.groupDatas[groupId].IS_CREDIT_RECORD[0].FIELDS.IS_HONEST.DEFAULT_VALUE = "0";
        _this.groupDatas[groupId].CREDIT_RECORD[0].MODULE_CONTROL = "0";
    },
    /*
     *@method bizCreditRececordNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-13 09:42:56
     */
    bizCreditRececordNodeAfterLoadBiz: function (_this) {
        _this.groupDatasTpl[groupId].CREDIT_RECORD[0].showDelete = true;
        _this.groupDatasTpl[groupId].CREDIT_RECORD[0].MODULE_DELETE = '1';
        let criditRecordInfo = [];
        if(_this.oppBusiData.newBusiData &&
            _this.oppBusiData.newBusiData.CREDIT_RECORD && 
            _this.oppBusiData.newBusiData.CREDIT_RECORD.length){
            criditRecordInfo =_this.oppBusiData.newBusiData.CREDIT_RECORD;
        }else if(_this.oppBusiData.newBusiData &&
            _this.oppBusiData.newBusiData.CREDIT_RECORD_ARR && 
            _this.oppBusiData.newBusiData.CREDIT_RECORD_ARR.length){
            criditRecordInfo =_this.oppBusiData.newBusiData.CREDIT_RECORD_ARR;
        }
        if(criditRecordInfo.length){
            let filterCreditRecordData = _.filter(criditRecordInfo, function (v) {
                return  v.RECORD_SOURCE != "07";
            });
            if(filterCreditRecordData.length) {
                filterCreditRecordData = _.filter(filterCreditRecordData, function (v) {
                    return  v.OP_TYPE != "2";
                });
            }
            if(filterCreditRecordData.length){
                _this.groupDatas[groupId].CREDIT_RECORD[0].MODULE_CONTROL = "1"
                _this.groupDatas[groupId].CREDIT_RECORD[0].MODULE_DELETE = "0";
                _this.groupDatas[groupId].CREDIT_RECORD[0].MODULE_CLEAN = "0";
                _this.groupDatas[groupId].IS_CREDIT_RECORD[0].FIELDS.IS_HONEST.DEFAULT_VALUE = "1";
                if(groupId == "CUST_INFO"){
                    bizPublicMethod.$blMethod.parseOldBiz(_this,_this.groupDatas, {"CUST_INFO" :  {"CREDIT_RECORD" : filterCreditRecordData}});
                }else if(groupId == "ORG_INFO"){
                    bizPublicMethod.$blMethod.parseOldBiz(_this,_this.groupDatas, {"ORG_INFO" :  {"CREDIT_RECORD" : filterCreditRecordData}});
                }
                
            }else {
                _this.groupDatas[groupId].CREDIT_RECORD[0].MODULE_CONTROL = "0"
                _this.groupDatas[groupId].CREDIT_RECORD[0].MODULE_DELETE = "0";
                _this.groupDatas[groupId].CREDIT_RECORD[0].MODULE_CLEAN = "0";
                _this.groupDatas[groupId].IS_CREDIT_RECORD[0].FIELDS.IS_HONEST.DEFAULT_VALUE = "0";
            }
        }else{
            _this.groupDatas[groupId].CREDIT_RECORD[0].MODULE_CONTROL = "0"
            _this.groupDatas[groupId].IS_CREDIT_RECORD[0].FIELDS.IS_HONEST.DEFAULT_VALUE = "0";
        }
    },
    /*
     *@method bizCreditRececordNodeBeforeSave
     *@desc 钩子函数 自定义保存数
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizCreditRececordNodeBeforeSave: function (_this, params) {
        let creditRececordInfo = _this.groupDatas[groupId].CREDIT_RECORD;
        let rowsData = []; // 获取页面上最新的值
        _.each(creditRececordInfo, (item, index) => {
            rowsData[index] = {};
            bizPublicMethod.$blMethod.changeObjKeys(item.FIELDS, rowsData[index]);
        })
        // 原始数据
        let originalData = _this.oppBusiData.oldBusiData.CREDIT_RECORD_ARR,
            creditRecordArr = [];
        
        
        if(_this.groupDatas[groupId].IS_CREDIT_RECORD[0].FIELDS.IS_HONEST.DEFAULT_VALUE=="0"){
            let obj = {
                RECORD_NUM: "",
                RECORD_SOURCE: "07",
                RECORD_TXT: "无不良诚信记录"
            };
            let old = originalData ? bizPublicMethod.$blMethod.findInfoAndAddId(originalData, obj, "RECORD_NUM") : {};
            let diff = !!obj.RECORD_NUM ? bizPublicMethod.$blMethod.compareInfoZT(old, obj) : [];
            creditRecordArr.push(_.extend({}, {
                DIFF_INFO: diff,
                OP_TYPE: diff.length ? "1" : obj.RECORD_NUM ? "3" : "0"
            }, obj));
        }else{
            _.each(rowsData, function (obj, index) {
                //判断当前是新增还是修改 OP_TYPE 0-新增 1-修改 2-删除 3-不变(后台需要对此进行过滤)
                let old = originalData ? bizPublicMethod.$blMethod.findOldObjZT(originalData, obj, "RECORD_NUM") : {};
                let diff = !!obj.RECORD_NUM ? bizPublicMethod.$blMethod.compareInfoZT(old, obj) : [];
                creditRecordArr.push(_.extend({}, {
                    DIFF_INFO: diff,
                    OP_TYPE: diff.length ? "1" : obj.RECORD_NUM ? "3" : "0"
                }, obj));
            })
        }
        
        originalData && originalData.filter(function (v) {
            return !_.filter(creditRecordArr, {RECORD_NUM: v.RECORD_NUM})[0];
        }).forEach(function (v) {
            creditRecordArr.push(_.extend({}, v, {DIFF_INFO: [], OP_TYPE: "2"}));
        });
        //数据保存
        params.CREDIT_RECORD = creditRecordArr;
    },

    /*
     *@method bizCreditRececordNodeValidate
     *@desc 钩子函数 下一步验证
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizCreditRececordNodeValidate: function (_this) {
      
    },

    /*
     *@method bizCreditRececordNodePageActivated
     *@desc 钩子函数：页面激活
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizCreditRececordNodePageActivated: function (_this) {
        bizCreditRececordNodeBeforeLoadBizCommon(_this)
       let sysCommParam = _this.$storage.getJsonSession(_this.$definecfg.SYS_COMM_PARAM_OBJS);
       let recordSourceFilter = sysCommParam && sysCommParam.RECORD_SOURCE_FILTER.split(",") || [];
       _this.groupDatas[groupId].CREDIT_RECORD.forEach((row, index, arr) => {
            let rowRecordSourceFilter = row.FIELDS.RECORD_SOURCE.FIELD_DICT_FILTER.split(",");
            let sourceArr = [];
            rowRecordSourceFilter.forEach((item)=> {
                if(!recordSourceFilter.includes(item)) {
                    sourceArr.push(item);
                }
            })
             row.FIELDS.RECORD_SOURCE.FIELD_DICT_FILTER = sourceArr.join(",");
             // 文本输入框
             row.FIELDS.RECORD_TXT.VALID_TYPE = "text";
       })
    },

    "deleteModuleFinished":(_this,fieldData) =>{
        // _this.groupDatas[groupId].IS_CREDIT_RECORD[0].MODULE_CONTROL = "0";
        if(!_this.groupDatas[groupId].CREDIT_RECORD || _this.groupDatas[groupId].CREDIT_RECORD.length == 0){
            // _this.groupDatas[groupId].IS_CREDIT_RECORD[0].MODULE_CONTROL = "1";
        }

    },
    "bizCriticalerInfoNodedeleteModule":(_this,fields) => {
        if (_this.groupDatas[groupId].CREDIT_RECORD.length == "1") {
            _this.groupDatas[groupId].IS_CREDIT_RECORD[0].FIELDS.IS_HONEST.DEFAULT_VALUE = "0";
            let ref = _this.userType == "2" ? "IS_CREDIT_RECORD50" : "IS_CREDIT_RECORD40";
            _this.$refs[ref][0].$refs.IS_HONEST[0].handleSingleChange(true,"0");   
            return false;
        }
        return true
    },
    "addModuleFinished": (_this, fieldData) => {
        // fieldData.FIELDS.RECORD_SOURCE.FIELD_DICT_FILTER = _this.groupDatas[groupId].CREDIT_RECORD[0].RECORD_SOURCE.FIELD_DICT_FILTER;
        fieldData.FIELDS.RECORD_TXT.VALID_TYPE = "text";
    },
    //点击添加模块按钮
    "addModule": (_this, moduleld, fieldData) => {
        if (moduleld == "CREDIT_RECORD") {
           
        }
        return true;
    },
    CHECK_IS_HONEST: (_this, field, fieldData) => {
        if (field.DEFAULT_VALUE != "" && field.FIELD_LAST_CHOOSE_VALUE && field.FIELD_LAST_CHOOSE_VALUE != undefined && field.FIELD_LAST_CHOOSE_VALUE != ""){
            field.DEFAULT_VALUE = field.FIELD_LAST_CHOOSE_VALUE;
        }
        if (field.DEFAULT_VALUE == "1") {
            _.each(_this.groupDatas[groupId].CREDIT_RECORD, item => {
                item.MODULE_CONTROL = "1";
            })
        } else {
            _.each(_this.groupDatas[groupId].CREDIT_RECORD, item => {
                item.MODULE_CONTROL = "0";
            })
        }
    },
    
}

