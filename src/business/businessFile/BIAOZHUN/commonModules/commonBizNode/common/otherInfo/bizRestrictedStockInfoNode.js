/*
 *   持有限售股信息
 *   方法封装
 *   @author  yangyp
 */

import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../../business/businessTools/bizPublicMethod.js"
import stringConfig from "../../../../../../../tools/stringConfig.js"

    // 更改字段数据
    const changeStkOpType = function(_this, field, fieldData) {
        let ischange = false;
        let originalData = _this.oppBusiData.oldBusiData.RESTRICTED_STOCK;
        // let current;
        // 根据证券账号
        let currentOne = _.filter(originalData, {"STK_CODE": fieldData.STK_CODE.DEFAULT_VALUE});
        // if(currentOne && fieldData.STK_CODE.DEFAULT_VALUE == currentOne.STK_CODE) {
        //     current = _.filter(originalData, {"STK_CODE": fieldData.STK_CODE.DEFAULT_VALUE, "REMOVE_FORBID_FLAG": fieldData.REMOVE_FORBID_FLAG.DEFAULT_VALUE})[0];
        // }else {
            // }
            
        // let current = _.filter(originalData, {"STK_CODE": fieldData.STK_CODE.DEFAULT_VALUE, "REMOVE_FORBID_FLAG": fieldData.REMOVE_FORBID_FLAG.DEFAULT_VALUE})[0];
        let current = _.filter(originalData, {"STK_CODE": fieldData.STK_CODE.DEFAULT_VALUE, "REMOVE_FORBID_FLAG": fieldData.REMOVE_FORBID_FLAG.orginValue})[0];
        if(current&&Object.keys(current).length&&field.DEFAULT_VALUE != current[field.FIELD_ID]) {
            fieldData.OP_TYPE.DEFAULT_VALUE = "1"
        }else {
            fieldData.OP_TYPE.DEFAULT_VALUE = "";
            fieldData.STK_CODE.FIELD_CONTROL = "2";
            fieldData.STKEX.FIELD_CONTROL = "2";
            fieldData.TRDACCT.FIELD_CONTROL = "2";

        }
         // let originalData = _this.oppBusiData.oldBusiData.RESTRICTED_STOCK;
        // if(fieldData.STK_CODE.FIELD_CONTROL == "2") {
        //     let currentOne = _.filter(originalData, {"STK_CODE": fieldData.STK_CODE.DEFAULT_VALUE})[0];
        //     if(field.DEFAULT_VALUE != currentOne.TRD_DATE) {
        //         fieldData.OP_TYPE.DEFAULT_VALUE = "1"
        //   
        // if(current&&Object.keys(current).length || fieldData.STK_CODE.FIELD_CONTROL=="2") { // 页面上只要不可编辑就是已经落地的数据，只有不变或者修复
        if(current&&Object.keys(current).length) { // 页面上只要不可编辑就是已经落地的数据，只有不变或者修复
            _.forEach(fieldData, function(value, key) {
                if(key!="OP_TYPE" && key!="DATA_SOURCE") {
                    if(fieldData[key].showchange) {
                        ischange = true
                    }
                }
            })
            if(ischange) {
                fieldData.OP_TYPE.DEFAULT_VALUE = "1"
            }else {
                fieldData.OP_TYPE.DEFAULT_VALUE = ""
            }
        }
        // if(!current) {
        //     fieldData.OP_TYPE.DEFAULT_VALUE = "0"
        //     fieldData.STK_CODE.FIELD_CONTROL = "0";
        //     fieldData.STKEX.FIELD_CONTROL = "0";
        //     fieldData.TRDACCT.FIELD_CONTROL = "0";
        // }
        if(originalData && !originalData.length) {
            fieldData.OP_TYPE.DEFAULT_VALUE = "0";
            fieldData.STK_CODE.FIELD_CONTROL = "0";
            fieldData.STKEX.FIELD_CONTROL = "0";
            fieldData.TRDACCT.FIELD_CONTROL = "0";
        }
        // 只有一条，但是落地的数据
        if(_this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO.length == 1 && _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO[0].FIELDS.STK_CODE.DEFAULT_VALUE =="") {
            fieldData.OP_TYPE.DEFAULT_VALUE = "";
        }
        // 只有一条，是增加的数据
        if(_this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO.length == 1 && !current) {
            if(fieldData.STK_CODE.DEFAULT_VALUE =="") {
                fieldData.OP_TYPE.DEFAULT_VALUE = ""
            }else {
                fieldData.OP_TYPE.DEFAULT_VALUE = "0"
            }
            fieldData.STK_CODE.FIELD_CONTROL = "0";
            fieldData.STKEX.FIELD_CONTROL = "0";
            fieldData.TRDACCT.FIELD_CONTROL = "0";
        }
    }
    const filterUnique = arr => arr.filter(i => arr.indexOf(i) !== arr.lastIndexOf(i));

    const fetchRestrictedStock = (_this, CUST_CODE) => {
        return _this.$syscfg.K_Request("W0000119", {
            bex_codes: "L2100023",
            CUST_CODE: CUST_CODE
        }).then(res => {
            return _.get(res, "Data", []);
        })
    }
export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizRestrictedStockInfoNodeBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizRestrictedStockInfoNodeBeforeLoadBiz: function (_this) {
        let custInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
        let CUST_CODE = custInfo.CUST_CODE || "";
        return Promise.all([
            CUST_CODE && fetchRestrictedStock(_this, CUST_CODE)
        ]).then( data => {
            let keyMap = {
                REC_SN:{
                    name: "记录序号",
                    hidden: true
                },
                STK_CODE: {
                    name: "证券代码"
                },
                PUB_COM_NAME: {
                    name: "公司名称"
                },
                STKEX: {
                    name: "证券交易所",
                    dict: "STKEX"
                },
                TRDACCT: {
                    name: "证券账户"
                },
                REMOVE_FORBID_FLAG: {
                    name: "限售类型",
                    dict: "REMOVE_FORBID_FLAG"
                },
                STK_AVL: {
                    name: "可用数量"
                },
                TRD_DATE: {
                    name: "解禁日期"
                },
                DATA_SOURCE: {
                    name: "数据来源",
                    hidden: true
                }
            };
            let stockInfo = data || [];
            if(_this.oppBusiData.oldBusiData.RESTRICTED_STOCK &&
                _this.oppBusiData.oldBusiData.RESTRICTED_STOCK.length){
                _this.oppBusiData.restrictedStock =  _.map(stockInfo[0], function (obj) {
                    return _.pick(obj, _.keys(keyMap));
                })
                
                 bizPublicMethod.$blMethod.parseOldBiz(_this,_this.groupDatas, {"OTHER_INFO" :{"RESTRICTED_STOCK_INFO" :_this.oppBusiData.restrictedStock}});
             } 
             //强制模块显示删除按钮
            _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO[0].showDelete = true;   
    
            _this.groupDatasTpl.OTHER_INFO.RESTRICTED_STOCK_INFO[0].MAX_LENGTH = "1000";
            _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO[0].MAX_LENGTH = "1000";
            // _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO.forEach((item)=> {
            //     item.
            // })
            _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO.forEach((item) => {
                item.FIELDS.REMOVE_FORBID_FLAG.orginValue = item.FIELDS.REMOVE_FORBID_FLAG.DEFAULT_VALUE;
            })
            _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO[0].allowRepeat = "1";
            _this.oppBusiData.isAddForbid = true;
        })
        
    },
    /*
     *@method bizRestrictedStockInfoNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-13 09:42:56
     */
    bizRestrictedStockInfoNodeAfterLoadBiz: function (_this) {
        if(_this.oppBusiData.newBusiData &&
            _this.oppBusiData.newBusiData.OTHER_INFO && 
            _this.oppBusiData.newBusiData.OTHER_INFO.RESTRICTED_STOCK_INFO && 
            _this.oppBusiData.newBusiData.OTHER_INFO.RESTRICTED_STOCK_INFO.length){
                var newData = _.filter(_this.oppBusiData.newBusiData.OTHER_INFO.RESTRICTED_STOCK_INFO, function (v) {
                    return  v.OP_TYPE != 2;
                });
                // _this.$blMethod.parseMoudleArray(_this,_this.groupDatas["OTHER_INFO"]["RESTRICTED_STOCK_INFO"],newData);
                bizPublicMethod.$blMethod.parseOldBiz(_this,_this.groupDatas, {"OTHER_INFO" :{"RESTRICTED_STOCK_INFO" : newData}});
                if(!newData.length) {
                    let noData = [{
                        DATA_SOURCE: "",
                        OP_TYPE: "",
                        REC_SN: "",
                        REMOVE_FORBID_FLAG: "",
                        STKEX: "",
                        STK_AVL: "",
                        STK_CODE: "",
                        TRDACCT: "",
                        TRD_DATE: "",
                    }]
                    bizPublicMethod.$blMethod.parseOldBiz(_this,_this.groupDatas, {"OTHER_INFO" :{"RESTRICTED_STOCK_INFO" : noData}});
                }
         }

        let modules = _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO;
        //  _.each(modules, function(item) {
        //     if(stringConfig.isEmptyStr(item.FIELDS.STK_CODE.DEFAULT_VALUE)
        //     && stringConfig.isEmptyStr(item.FIELDS.STKEX.DEFAULT_VALUE)
        //     && stringConfig.isEmptyStr(item.FIELDS.TRDACCT.DEFAULT_VALUE)){
        //         item.FIELDS.STK_CODE.FIELD_CONTROL = "2";
        //         item.FIELDS.STKEX.FIELD_CONTROL = "2";
        //         item.FIELDS.TRDACCT.FIELD_CONTROL = "2";
        //     }
        // })
        _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO.forEach((item) => {
            if(!item.FIELDS.REMOVE_FORBID_FLAG.showchange) {
                item.FIELDS.REMOVE_FORBID_FLAG.orginValue = item.FIELDS.REMOVE_FORBID_FLAG.DEFAULT_VALUE;
            }
        })
         
    },

    /*
     *@method bizRestrictedStockInfoNodeBeforeSave
     *@desc 钩子函数 自定义保存数
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizRestrictedStockInfoNodeBeforeSave: async function (_this, params) {
        let restrictedStockInfo = _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO;
        let rowsData = []; // 获取页面上最新的值
        _.each(restrictedStockInfo, (item, index) => {
            rowsData[index] = {};
            Object.keys(item.FIELDS).forEach((key) => {
                rowsData[index][key] = item.FIELDS[key].DEFAULT_VALUE || "";
            })
            // bizPublicMethod.$blMethod.changeObjKeys(item.FIELDS, rowsData[index]);
            // if(item.FIELDS.REMOVE_FORBID_FLAG.orginValue) {
            //     rowsData[index].orginValue = item.FIELDS.REMOVE_FORBID_FLAG.orginValue;
            // }
        })
        let originalData = _this.oppBusiData.restrictedStock || [], // 获取原始数据 oldBusiData
            datagridData = [];

        _.each(rowsData, function (item, index) {
            //判断当前是新增还是修改 OP_TYPE 0-新增 1-修改 2-删除 ""-不变
            var diff = item.OP_TYPE !== "0" ? bizPublicMethod.$blMethod.compareInfoZT(_.filter(originalData, {
                // STK_CODE: item.STK_CODE, REMOVE_FORBID_FLAG: item.REMOVE_FORBID_FLAG
                STK_CODE: item.STK_CODE
                })[0], item) : [];
                // diff = _.filter(diff, function(item){
                //     return item.FIELD != "orginValue";
                // })
            datagridData.push(_.extend({}, {
                DIFF_INFO: diff
            }, item));
        });
        _.filter(originalData, function (v) {
            return !_.find(datagridData, {STK_CODE: v.STK_CODE});
        }).forEach(function (v) {
            datagridData.push(_.extend({}, v, {DIFF_INFO: [], OP_TYPE: "2"}));
        });
        if(datagridData.length == 1 && (datagridData[0].STK_CODE==""|| datagridData[0].STKEX==""||datagridData[0].TRDACCT==""
            ||datagridData[0].REMOVE_FORBID_FLAG==""||datagridData[0].STK_AVL==""
        )) {
            // datagridData[0].OP_TYPE = ""
            datagridData = [];
        }else {
            datagridData = _.filter(datagridData, item => {
                return item.STK_CODE != "" && item.STKEX != ""
            })
        }
        _.map(datagridData, item => {
            if(item.OP_TYPE == "0") {
                item.IS_NEW= true;
            }else if(item.OP_TYPE == "1") {
                item.PUB_COM_NAME = ""
            }
            // let originalItem = _.find(originalData, {STK_CODE: item.STK_CODE})
            // if (!!originalItem) {
            //     item.REC_SN = originalItem.REC_SN
            //     item.DATA_SOURCE = originalItem.DATA_SOURCE
            // }
        })
        params.OTHER_INFO.RESTRICTED_STOCK_INFO = datagridData;
    },
    /*
     *@method bizRestrictedStockInfoNodeValidate
     *@desc 钩子函数 下一步验证
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizRestrictedStockInfoNodeValidate: function (_this) {
      // 遍历当前页面所有模块的证券代码和限售类型
      let stkcodeForbidflagArr = [];
      _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO.forEach(function(moduleItem,index){
         let mainValue = moduleItem.FIELDS.REMOVE_FORBID_FLAG.DEFAULT_VALUE + "T" + moduleItem.FIELDS.STK_CODE.DEFAULT_VALUE;
         stkcodeForbidflagArr.push(mainValue)
     })
     
     // 去重
     let arrs = [...new Set(stkcodeForbidflagArr)];
     if(arrs.length < stkcodeForbidflagArr.length) {
        let REMOVE_FORBID_FLAG = filterUnique(stkcodeForbidflagArr)[0].split('T')[0]=="0"?"0-未解禁":"1-已解禁";
        let STK_CODE = filterUnique(stkcodeForbidflagArr)[0].split('T')[1];
        _this.messageBox({
            hasMask: true,
            // messageText: '证券代码['+ filterUnique(stkcodeForbidflagArr)[0] +']已存在，请重新输入！',
            messageText: '不能存在多条相同的证券代码['+ STK_CODE +']和限售类型['+ REMOVE_FORBID_FLAG +']，请重新输入！',
            confirmButtonText: '确认',
            typeMessage: 'warn',
            showMsgBox: true,
            confirmedAction: function () {}
        });
        return false;
     }
    },

    /*
     *@method bizRestrictedStockInfoNodePageActivated
     *@desc 钩子函数：页面激活
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizRestrictedStockInfoNodePageActivated: function (_this, groupId) {
        _this.$set(_this.groupDatas["OTHER_INFO"]["RESTRICTED_STOCK_INFO"][_this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO.length-1], "MAX_LENGTH", 1000);

        _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO[0].allowRepeat = "1";
        console.log('显示【持有限售股信息】页面')
        _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO.forEach(element => {
            element.FIELDS.STK_CODE.FIELD_FUNCTION = "CHECK_RES_STK_CODE";
            element.FIELDS.STKEX.FIELD_FUNCTION = "CHECK_RES_STKEX";
            element.FIELDS.TRDACCT.FIELD_FUNCTION = "CHECK_RES_TRDACCT";
            element.FIELDS.REMOVE_FORBID_FLAG.FIELD_FUNCTION = "CHECK_RES_REMOVE_FORBID_FLAG";
            element.FIELDS.STK_AVL.FIELD_FUNCTION = "CHECK_RES_STK_AVL";
            element.FIELDS.TRD_DATE.FIELD_FUNCTION = "CHECK_RES_TRD_DATE";
            // 有清算的数据，置灰
            if(element.FIELDS.DATA_SOURCE.DEFAULT_VALUE == "0") {
                element.FIELDS.STK_CODE.FIELD_CONTROL = "2";
                element.FIELDS.STKEX.FIELD_CONTROL = "2";
                element.FIELDS.TRDACCT.FIELD_CONTROL = "2";
                element.FIELDS.REMOVE_FORBID_FLAG.FIELD_CONTROL = "2";
                element.FIELDS.STK_AVL.FIELD_CONTROL = "2";
                element.FIELDS.TRD_DATE.FIELD_CONTROL = "2";
            }
            // 新增 正常
            if(element.FIELDS.OP_TYPE.DEFAULT_VALUE == "0") {
                element.FIELDS.STK_CODE.FIELD_CONTROL = "0";
                element.FIELDS.STKEX.FIELD_CONTROL = "0";
                element.FIELDS.TRDACCT.FIELD_CONTROL = "0";
                element.FIELDS.REMOVE_FORBID_FLAG.FIELD_CONTROL = "0";
                element.FIELDS.STK_AVL.FIELD_CONTROL = "0";
                element.FIELDS.TRD_DATE.FIELD_CONTROL = "0";
            }
        });

        //  //判断已有数据.证券代码不可编辑
        //  _this.oppBusiData.oldBusiData.RESTRICTED_STOCK && _this.oppBusiData.oldBusiData.RESTRICTED_STOCK.forEach(function(oldItem){
        //     let tempSecuCodeCountInfo = {"COUNT": 0 ,INDEX : -1};
        //     _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO.forEach(function(newField,index){
        //         if(oldItem.STK_CODE == newField.FIELDS.STK_CODE.DEFAULT_VALUE){
        //             tempSecuCodeCountInfo.COUNT ++;
        //             if(tempSecuCodeCountInfo.COUNT == 1){
        //                 tempSecuCodeCountInfo.INDEX = index;
        //             }
        //         }
        //     })
            
        //     if(tempSecuCodeCountInfo.COUNT > 0 && tempSecuCodeCountInfo.INDEX != -1 ){
        //         _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO[tempSecuCodeCountInfo.INDEX].FIELDS.STK_CODE.FIELD_CONTROL = "2";
        //     }
        // })


        // _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO.forEach(function(moduleItem,index){
        //     let tempSecuCodeCountInfo = {"COUNT": 0 ,INDEX : -1,RPEAT_INDEX : -1};
        //     _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO.forEach(function(newField,index){
        //         if(moduleItem.FIELDS.STK_CODE.DEFAULT_VALUE == newField.FIELDS.STK_CODE.DEFAULT_VALUE){
        //             tempSecuCodeCountInfo.COUNT ++;
        //             tempSecuCodeCountInfo.RPEAT_INDEX = index;
        //             if(tempSecuCodeCountInfo.COUNT == 1){
        //                 tempSecuCodeCountInfo.INDEX = index;
        //                 _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO[tempSecuCodeCountInfo.INDEX].FIELDS.STK_CODE.FIELD_CONTROL = "2";
        //             }
        //         }
        //     })
            
        //     // if(tempSecuCodeCountInfo.COUNT > 0 && tempSecuCodeCountInfo.INDEX != -1 ){
        //     //     if(tempSecuCodeCountInfo.COUNT > 1){
        //     //         if(tempSecuCodeCountInfo.COUNT > 0 && tempSecuCodeCountInfo.INDEX != -1){
        //     //             _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO[tempSecuCodeCountInfo.RPEAT_INDEX].FIELDS.STK_CODE.correct = false;
        //     //             _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO[tempSecuCodeCountInfo.RPEAT_INDEX].FIELDS.STK_CODE.showerr = true; 
        //     //             _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO[tempSecuCodeCountInfo.RPEAT_INDEX].FIELDS.STK_CODE.message = "输入的证券代码已存在，请重新输入";
                        
        //     //         }
        //     //     }
        //     // }
        // })
        // 当存在一组但没有数据，证券代码 字段不可以置灰色
        if(!_this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO[0].FIELDS.STK_CODE.DEFAULT_VALUE) {
            _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO[0].FIELDS.STK_CODE.FIELD_CONTROL = "0";
            _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO[0].FIELDS.STKEX.FIELD_CONTROL = "0";
            _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO[0].FIELDS.TRDACCT.FIELD_CONTROL = "0";
        }
    },
    bizRestrictedStockInfoNodeAddModule: function(_this, groupId, fieldData) {
        if(!_this.oppBusiData.isAddForbid) {
            _this.messageBox({
                hasMask: true,
                messageText: '不能添加两条相同的证券代码和限售类型的数据！',
                confirmButtonText: '确认',
                typeMessage: 'warn',
                showMsgBox: true,
                confirmedAction: function () {}
            });
            return false
        }
        
        return true
    },
    // 点击添加按钮后执行 AddModuleFinished
    bizRestrictedStockInfoNodeAddModuleFinished: (_this, moduleld, fieldData) => {
        console.log("点击【持有限售股】添加按钮【结束】")
        moduleld.FIELDS.STK_CODE.FIELD_CONTROL = "0";
        moduleld.FIELDS.OP_TYPE.DEFAULT_VALUE = "0";
        // 添加的模块设置必填
        moduleld.FIELDS.STK_CODE.FIELD_REQUIRED = "1";
        moduleld.FIELDS.STKEX.FIELD_REQUIRED = "1";
        moduleld.FIELDS.TRDACCT.FIELD_REQUIRED = "1";
        moduleld.FIELDS.REMOVE_FORBID_FLAG.FIELD_REQUIRED = "1";
        moduleld.FIELDS.STK_AVL.FIELD_REQUIRED = "1";
        moduleld.FIELDS.TRD_DATE.FIELD_REQUIRED = "1";
        // 添加后的字段不进行修改，会执行默认的CHECK函数，比如STK_CODE字段就会执行CHECK_STK_CODE，与持股5%以上股东信息冲突
        moduleld.FIELDS.STK_CODE.FIELD_FUNCTION = "CHECK_RES_STK_CODE";
        moduleld.FIELDS.STKEX.FIELD_FUNCTION = "CHECK_RES_STKEX";
        moduleld.FIELDS.TRDACCT.FIELD_FUNCTION = "CHECK_RES_TRDACCT";
        moduleld.FIELDS.REMOVE_FORBID_FLAG.FIELD_FUNCTION = "CHECK_RES_REMOVE_FORBID_FLAG";
        moduleld.FIELDS.STK_AVL.FIELD_FUNCTION = "CHECK_RES_STK_AVL";
        moduleld.FIELDS.TRD_DATE.FIELD_FUNCTION = "CHECK_RES_TRD_DATE";
    },
    //删除模块响应事件 删除动作未结束
    "bizRestrictedStockInfoNodeDeleteModule":(_this,deleteObj) =>{
        console.log(deleteObj)
        if(deleteObj.FIELDS.DATA_SOURCE.DEFAULT_VALUE == "0") {
            _this.messageBox({
                hasMask: true,
                messageText: "该行数据来源于清算,不能修改或删除！",
                confirmButtonText: '确定',
                typeMessage: 'warn',
                showMsgBox: true
            })
            return false;

        }
        if(deleteObj.FIELDS.REMOVE_FORBID_FLAG.message.length) {
            _this.oppBusiData.isAddForbid = true;
        }
        if(_this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO.length==1) {
            // _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO[0].FIELDS."STK_CODE",.FIELD_REQUIRED = "0";
            // _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO[0].FIELDS."STKEX",.FIELD_REQUIRED = "0";
            // _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO[0].FIELDS."TRDACCT",.FIELD_REQUIRED = "0";
            // _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO[0].FIELDS."REMOVE_FORBID_FLAG",.FIELD_REQUIRED = "0";
            // _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO[0].FIELDS."STK_AVL",.FIELD_REQUIRED = "0";
            // _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO[0].FIELDS."TRD_DATE",.FIELD_REQUIRED = "0";
            // _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO[0].FIELDS."OP_TYPE",.FIELD_REQUIRED = "0";
            _.each(["STK_CODE","STKEX","TRDACCT","REMOVE_FORBID_FLAG","STK_AVL","TRD_DATE","OP_TYPE"],(c)=> {
                _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO[0].FIELDS[c].FIELD_REQUIRED = "0"
                _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO[0].FIELDS[c].correct = true;
                _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO[0].FIELDS[c].message = ""
          })

        }
        if(_this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO.length==1 && _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO[0].FIELDS.STK_CODE.DEFAULT_VALUE=="") {
            _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO[0].FIELDS.STK_CODE.FIELD_CONTROL = "0";
            _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO[0].FIELDS.STKEX.FIELD_CONTROL = "0";
            _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO[0].FIELDS.TRDACCT.FIELD_CONTROL = "0";
        }
        return true;
    },
    //删除模块响应事件 删除动作已结束
    "bizRestrictedStockInfoNodeDeleteModuleFinished":(_this,deleteObj) =>{
        if(_this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO.length==1) {
            _.each(["STK_CODE","STKEX","TRDACCT","REMOVE_FORBID_FLAG","STK_AVL","TRD_DATE","OP_TYPE"],(c)=> {
                _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO[0].FIELDS[c].FIELD_REQUIRED = "0"
                _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO[0].FIELDS[c].correct = true;
                _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO[0].FIELDS[c].message = ""
          })
          if(_this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO[0].FIELDS.STK_CODE.DEFAULT_VALUE =="") {
            _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO[0].FIELDS.OP_TYPE.DEFAULT_VALUE = ""
          }
        }
    },
    /**
     *【CHECK_STKEX】证券交易所联动证券账户
     * 
     */
    // "CHECK_STKEX": (_this, field, fieldData) => {
    //     if (_this.moduleId.indexOf("RESTRICTED_STOCK_INFO") != -1 ) {
    //         if(fieldData.TRDACCT)
    //             fieldData.TRDACCT.DEFAULT_VALUE = "";
    //         if(!field.DEFAULT_VALUE){
    //             return false;
    //         }else{
    //             fieldData.TRDACCT.FIELD_DICT_NAME = _.chain(_this.oppBusiData.oldBusiData.SYS_TRDACCT || []).filter(o => {
    //                 return o.STKBD && o.STKBD.charAt("0") == field.DEFAULT_VALUE && o.STKBD.charAt("1") == "0";
    //             }).each(i => {
    //                 i.DICT_ITEM = i.TRDACCT;
    //                 i.DICT_ITEM_NAME = i.TRDACCT;
    //             }).value();
    //             fieldData.TRDACCT.hideDictItem = true;
    //         }
    //     }
    // },


    // 证券代码
    "CHECK_RES_STK_CODE": function(_this, field, fieldData) {
        if(field.DEFAULT_VALUE.length) {
            let regularExpression = /^[0-9]\d*$/;
            if(!regularExpression.test(field.DEFAULT_VALUE)||field.DEFAULT_VALUE.length <6) {
                field.correct = false;
                field.showerr = true;
                field.message = "请输入6位数字";
                return true
            }
            if(field.DEFAULT_VALUE.length >6) {
                field.DEFAULT_VALUE = field.DEFAULT_VALUE.substring(0,6)
            }
        }
        if(fieldData.OP_TYPE.DEFAULT_VALUE != "0") {
            changeStkOpType(_this, field, fieldData)
        }else {
            // // 新增
            // let removeFlag = fieldData.REMOVE_FORBID_FLAG.DEFAULT_VALUE == "1"? "已解禁": "未解禁";
            // _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO.forEach(function(moduleItem,index){
            //     if(index < _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO.length-1 && moduleItem.FIELDS.STK_CODE.DEFAULT_VALUE == fieldData.STK_CODE.DEFAULT_VALUE 
            //         && moduleItem.FIELDS.REMOVE_FORBID_FLAG.DEFAULT_VALUE == fieldData.REMOVE_FORBID_FLAG.DEFAULT_VALUE ) {
            //             fieldData.REMOVE_FORBID_FLAG.correct = false;
            //             fieldData.REMOVE_FORBID_FLAG.showerr = true; 
            //             fieldData.REMOVE_FORBID_FLAG.message = "证券代码、限售类型不能完全一致";
            //             _this.messageBox({
            //                 hasMask: true,
            //                 messageText: '证券代码['+ fieldData.STK_CODE.DEFAULT_VALUE +'],限售类型['+ removeFlag +']已存在，请重新输入！',
            //                 confirmButtonText: '确认',
            //                 typeMessage: 'warn',
            //                 showMsgBox: true,
            //                 confirmedAction: function () {}
            //             });
            //         return;
            //     }
            // })
        }
        if(field.DEFAULT_VALUE) {
            fieldData.STK_CODE.FIELD_REQUIRED = "1";
            fieldData.STKEX.FIELD_REQUIRED = "1";
            fieldData.TRDACCT.FIELD_REQUIRED = "1";
            fieldData.REMOVE_FORBID_FLAG.FIELD_REQUIRED = "1";
            fieldData.STK_AVL.FIELD_REQUIRED = "1";
            fieldData.TRD_DATE.FIELD_REQUIRED = "1";
        }else {
            fieldData.STK_CODE.FIELD_REQUIRED = "0";
            fieldData.STKEX.FIELD_REQUIRED = "0";
            fieldData.TRDACCT.FIELD_REQUIRED = "0";
            fieldData.REMOVE_FORBID_FLAG.FIELD_REQUIRED = "0";
            fieldData.STK_AVL.FIELD_REQUIRED = "0";
            fieldData.TRD_DATE.FIELD_REQUIRED = "0";
        }

        // //判断添加或修改的证券代码如果已存在，需要增加提示
        // _this.$refs.flowTip.flowTips = [];
        // let currentIndex = -1;
        // _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO.forEach(function(moduleItem,index){
        //     if(moduleItem && moduleItem.FIELDS.STK_CODE.DEFAULT_VALUE == field.DEFAULT_VALUE  ){
        //         currentIndex =  index;
        //         return;
        //     }
        // })
        // if(currentIndex > 0){
        //     let tempObj = {"COUNT":0,"INDEX": -1 };
        //     _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO.forEach(function(moduleItem,index){
        //         let tempValue = moduleItem.FIELDS.STK_CODE.DEFAULT_VALUE;
        //         let removeFlag = moduleItem.FIELDS.REMOVE_FORBID_FLAG.DEFAULT_VALUE;
        //         if(tempValue == field.DEFAULT_VALUE && removeFlag == fieldData.REMOVE_FORBID_FLAG.DEFAULT_VALUE){
        //             tempObj.COUNT ++;
        //             tempObj.INDEX = index ;
        //         }
        //     })

        //     // if(tempObj.COUNT > 1 && tempObj.INDEX != -1){
        //     //     _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO[tempObj.INDEX].FIELDS.STK_CODE.correct = false;
        //     //     _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO[tempObj.INDEX].FIELDS.STK_CODE.showerr = true; 
        //     //     _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO[tempObj.INDEX].FIELDS.STK_CODE.message = "输入的证券代码已存在，请重新输入";
        //     //     let removeFlag = fieldData.REMOVE_FORBID_FLAG.DEFAULT_VALUE == "1"? "已解禁": "未解禁";
        //     //     _this.messageBox({
        //     //         hasMask: true,
        //     //         messageText: '证券代码['+ field.DEFAULT_VALUE +'],限售类型['+ removeFlag +']已存在，请重新输入！',
        //     //         confirmButtonText: '确认',
        //     //         typeMessage: 'warn',
        //     //         showMsgBox: true,
        //     //         confirmedAction: function () {}
        //     //     });
        //     // }
        // }
         // 遍历当前页面所有模块的证券代码和限售类型
         let stkcodeForbidflagArr = [];
         _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO.forEach(function(moduleItem,index){
            let mainValue = "F" +  moduleItem.FIELDS.REMOVE_FORBID_FLAG.DEFAULT_VALUE + "T" + moduleItem.FIELDS.STK_CODE.DEFAULT_VALUE;
            stkcodeForbidflagArr.push(mainValue)
        })
        // 去重
        let arrs = [...new Set(stkcodeForbidflagArr)];
        if(arrs.length < stkcodeForbidflagArr.length &&_this.oppBusiData.isAddForbid) {
            _this.oppBusiData.isAddForbid = false;
            let removeFlag = fieldData.REMOVE_FORBID_FLAG.DEFAULT_VALUE == "1"? "已解禁": "未解禁";
            fieldData.REMOVE_FORBID_FLAG.correct = false;
            fieldData.REMOVE_FORBID_FLAG.showerr = true; 
            fieldData.REMOVE_FORBID_FLAG.message = "证券代码、限售类型不能完全一致";
            _this.messageBox({
                hasMask: true,
                messageText: '证券代码['+ fieldData.STK_CODE.DEFAULT_VALUE +'],限售类型['+ removeFlag +']已存在，请重新输入！',
                confirmButtonText: '确认',
                typeMessage: 'warn',
                showMsgBox: true,
                confirmedAction: function () {}
            });
            return;
        }else {
            _this.oppBusiData.isAddForbid = true;
            _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO.forEach(function(moduleItem,index){
                moduleItem.FIELDS.REMOVE_FORBID_FLAG.correct = true;
                moduleItem.FIELDS.REMOVE_FORBID_FLAG.message = "";
                moduleItem.FIELDS.REMOVE_FORBID_FLAG.showerr = false;
            })
        }
    },
    // 证券交易所
    "CHECK_RES_STKEX": function(_this, field, fieldData) {
        if(fieldData.TRDACCT)
            fieldData.TRDACCT.DEFAULT_VALUE = "";
        if(!field.DEFAULT_VALUE){
            return false;
        }else{
            fieldData.TRDACCT.FIELD_DICT_NAME = _.chain(_this.oppBusiData.oldBusiData.SYS_TRDACCT || []).filter(o => {
                return o.STKBD && o.STKBD.charAt("0") == field.DEFAULT_VALUE && o.STKBD.charAt("1") == "0";
            }).each(i => {
                i.DICT_ITEM = i.TRDACCT;
                i.DICT_ITEM_NAME = i.TRDACCT;
            }).value();
            fieldData.TRDACCT.hideDictItem = true;
        }
        if(fieldData.OP_TYPE.DEFAULT_VALUE != "0") {
            changeStkOpType(_this, field, fieldData)
        }
        
        if(field.DEFAULT_VALUE) {
            fieldData.STK_CODE.FIELD_REQUIRED = "1";
            fieldData.STKEX.FIELD_REQUIRED = "1";
            fieldData.TRDACCT.FIELD_REQUIRED = "1";
            fieldData.REMOVE_FORBID_FLAG.FIELD_REQUIRED = "1";
            fieldData.STK_AVL.FIELD_REQUIRED = "1";
            fieldData.TRD_DATE.FIELD_REQUIRED = "1";
        }
    },
    // 证券账户
    "CHECK_RES_TRDACCT": function(_this, field, fieldData) {
        if(fieldData.OP_TYPE.DEFAULT_VALUE != "0") {
            changeStkOpType(_this, field, fieldData)
        }
        
        if(field.DEFAULT_VALUE) {
            fieldData.STK_CODE.FIELD_REQUIRED = "1";
            fieldData.STKEX.FIELD_REQUIRED = "1";
            fieldData.TRDACCT.FIELD_REQUIRED = "1";
            fieldData.REMOVE_FORBID_FLAG.FIELD_REQUIRED = "1";
            fieldData.STK_AVL.FIELD_REQUIRED = "1";
            fieldData.TRD_DATE.FIELD_REQUIRED = "1";
        }
    },
    // 限售类型
    "CHECK_RES_REMOVE_FORBID_FLAG": function(_this, field, fieldData) {
        if(fieldData.OP_TYPE.DEFAULT_VALUE != "0") {
            changeStkOpType(_this, field, fieldData)
        }else {
            // // 新增
            // let removeFlag = fieldData.REMOVE_FORBID_FLAG.DEFAULT_VALUE == "1"? "已解禁": "未解禁";
            // _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO.forEach(function(moduleItem,index){
            //     if(index < _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO.length-1 && moduleItem.FIELDS.STK_CODE.DEFAULT_VALUE == fieldData.STK_CODE.DEFAULT_VALUE 
            //         && moduleItem.FIELDS.REMOVE_FORBID_FLAG.DEFAULT_VALUE == fieldData.REMOVE_FORBID_FLAG.DEFAULT_VALUE ) {
            //             fieldData.REMOVE_FORBID_FLAG.correct = false;
            //             fieldData.REMOVE_FORBID_FLAG.showerr = true; 
            //             fieldData.REMOVE_FORBID_FLAG.message = "证券代码、限售类型不能完全一致";
            //             _this.messageBox({
            //                 hasMask: true,
            //                 messageText: '证券代码['+ fieldData.STK_CODE.DEFAULT_VALUE +'],限售类型['+ removeFlag +']已存在，请重新输入！',
            //                 confirmButtonText: '确认',
            //                 typeMessage: 'warn',
            //                 showMsgBox: true,
            //                 confirmedAction: function () {}
            //             });
            //         return;
            //     }
            // })
        }
        
        if(field.DEFAULT_VALUE) {
            fieldData.STK_CODE.FIELD_REQUIRED = "1";
            fieldData.STKEX.FIELD_REQUIRED = "1";
            fieldData.TRDACCT.FIELD_REQUIRED = "1";
            fieldData.REMOVE_FORBID_FLAG.FIELD_REQUIRED = "1";
            fieldData.STK_AVL.FIELD_REQUIRED = "1";
            fieldData.TRD_DATE.FIELD_REQUIRED = "1";
        }

        // 遍历当前页面所有模块的证券代码和限售类型
        let stkcodeForbidflagArr = [];
         _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO.forEach(function(moduleItem,index){
            let mainValue = "F" +  moduleItem.FIELDS.REMOVE_FORBID_FLAG.DEFAULT_VALUE + "T" + moduleItem.FIELDS.STK_CODE.DEFAULT_VALUE;
            stkcodeForbidflagArr.push(mainValue)
        })
        // 去重
        let arrs = [...new Set(stkcodeForbidflagArr)];
        if(arrs.length < stkcodeForbidflagArr.length &&_this.oppBusiData.isAddForbid) {
            _this.oppBusiData.isAddForbid = false;
            let removeFlag = fieldData.REMOVE_FORBID_FLAG.DEFAULT_VALUE == "1"? "已解禁": "未解禁";
            fieldData.REMOVE_FORBID_FLAG.correct = false;
            fieldData.REMOVE_FORBID_FLAG.showerr = true; 
            fieldData.REMOVE_FORBID_FLAG.message = "证券代码、限售类型不能完全一致";
            _this.messageBox({
                hasMask: true,
                messageText: '证券代码['+ fieldData.STK_CODE.DEFAULT_VALUE +'],限售类型['+ removeFlag +']已存在，请重新输入！',
                confirmButtonText: '确认',
                typeMessage: 'warn',
                showMsgBox: true,
                confirmedAction: function () {}
            });
            return;
        }else {
            _this.oppBusiData.isAddForbid = true;
            _this.groupDatas.OTHER_INFO.RESTRICTED_STOCK_INFO.forEach(function(moduleItem,index){
                moduleItem.FIELDS.REMOVE_FORBID_FLAG.correct = true;
                moduleItem.FIELDS.REMOVE_FORBID_FLAG.message = "";
                moduleItem.FIELDS.REMOVE_FORBID_FLAG.showerr = false;
            })
        }

        // 如果是置灰
        // let originalData = _this.oppBusiData.oldBusiData.RESTRICTED_STOCK;
        // if(fieldData.STK_CODE.FIELD_CONTROL == "2") {
        //     let currentOne = _.filter(originalData, {"STK_CODE": fieldData.STK_CODE.DEFAULT_VALUE});
        //     if(field.DEFAULT_VALUE != currentOne[].REMOVE_FORBID_FLAG) {
        //         fieldData.OP_TYPE.DEFAULT_VALUE = "1"
        //     }
        // }
        
    },
    // 可用数量
    "CHECK_RES_STK_AVL": function(_this, field, fieldData) {
        if(fieldData.OP_TYPE.DEFAULT_VALUE != "0") {
            changeStkOpType(_this, field, fieldData)
        }
        // 如果是置灰
        // let originalData = _this.oppBusiData.oldBusiData.RESTRICTED_STOCK;
        // if(fieldData.STK_CODE.FIELD_CONTROL == "2") {
        //     let currentOne = _.filter(originalData, {"STK_CODE": fieldData.STK_CODE.DEFAULT_VALUE})[0];
        //     if(field.DEFAULT_VALUE != currentOne.STK_AVL) {
        //         fieldData.OP_TYPE.DEFAULT_VALUE = "1"
        //     }
        // }
        
        if(field.DEFAULT_VALUE) {
            fieldData.STK_CODE.FIELD_REQUIRED = "1";
            fieldData.STKEX.FIELD_REQUIRED = "1";
            fieldData.TRDACCT.FIELD_REQUIRED = "1";
            fieldData.REMOVE_FORBID_FLAG.FIELD_REQUIRED = "1";
            fieldData.STK_AVL.FIELD_REQUIRED = "1";
            fieldData.TRD_DATE.FIELD_REQUIRED = "1";
        }
    },
    // 解禁日期
    "CHECK_RES_TRD_DATE": function(_this, field, fieldData) {
        if(fieldData.OP_TYPE.DEFAULT_VALUE != "0") {
            changeStkOpType(_this, field, fieldData)
        }
        // 如果是置灰
        // let originalData = _this.oppBusiData.oldBusiData.RESTRICTED_STOCK;
        // if(fieldData.STK_CODE.FIELD_CONTROL == "2") {
        //     let currentOne = _.filter(originalData, {"STK_CODE": fieldData.STK_CODE.DEFAULT_VALUE})[0];
        //     if(field.DEFAULT_VALUE != currentOne.TRD_DATE) {
        //         fieldData.OP_TYPE.DEFAULT_VALUE = "1"
        //     }
        // }
        
        if(field.DEFAULT_VALUE) {
            fieldData.STK_CODE.FIELD_REQUIRED = "1";
            fieldData.STKEX.FIELD_REQUIRED = "1";
            fieldData.TRDACCT.FIELD_REQUIRED = "1";
            fieldData.REMOVE_FORBID_FLAG.FIELD_REQUIRED = "1";
            fieldData.STK_AVL.FIELD_REQUIRED = "1";
            fieldData.TRD_DATE.FIELD_REQUIRED = "1";
        }
    },
    
}

