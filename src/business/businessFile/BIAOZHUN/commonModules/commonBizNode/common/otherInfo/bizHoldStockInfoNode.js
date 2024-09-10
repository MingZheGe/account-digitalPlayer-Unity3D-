/*
 *   持股5%以上股东信息
 *   方法封装
 *   @author  yangyp
 */

import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../../business/businessTools/bizPublicMethod.js"
export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizHoldStockInfoNodeBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizHoldStockInfoNodeBeforeLoadBiz: function (_this) {
        if(_this.oppBusiData.oldBusiData.HOLD_STOCK &&
            _this.oppBusiData.oldBusiData.HOLD_STOCK.length){
             bizPublicMethod.$blMethod.parseOldBiz(_this,_this.groupDatas, {"OTHER_INFO" :{"HOLD_STOCK_INFO" :_this.oppBusiData.oldBusiData.HOLD_STOCK}});
        }
        //强制模块显示删除按钮
        _this.groupDatas.OTHER_INFO.HOLD_STOCK_INFO[0].showDelete = true;

        _this.groupDatasTpl.OTHER_INFO.HOLD_STOCK_INFO[0].MAX_LENGTH = "1000";
        _this.groupDatas.OTHER_INFO.HOLD_STOCK_INFO[0].MAX_LENGTH = "1000";
        _this.groupDatas.OTHER_INFO.HOLD_STOCK_INFO[0].FIELDS.STKCODE_SCALE.VALID_TYPE = "numberex[10,2,3]";

        
    },
    /*
     *@method bizHoldStockInfoNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-13 09:42:56
     */
    bizHoldStockInfoNodeAfterLoadBiz: function (_this) {
        if(_this.oppBusiData.newBusiData &&
        _this.oppBusiData.newBusiData.OTHER_INFO && 
        _this.oppBusiData.newBusiData.OTHER_INFO.HOLD_STOCK_INFO && 
        _this.oppBusiData.newBusiData.OTHER_INFO.HOLD_STOCK_INFO.length){
            var newData = _.filter(_this.oppBusiData.newBusiData.OTHER_INFO.HOLD_STOCK_INFO, function (v) {
                return  v.OP_TYPE != 2;
            });
            bizPublicMethod.$blMethod.parseOldBiz(_this,_this.groupDatas, {"OTHER_INFO" :{"HOLD_STOCK_INFO" : newData}});
            if(!newData.length) {
                let noData = [{
                    PUB_NAME: "",
                    STKCODE_SCALE: "",
                    STKEX: "",
                    STK_CODE: "",
                    STK_NUM: "",
                    OP_TYPE: "",
                }]
                bizPublicMethod.$blMethod.parseOldBiz(_this,_this.groupDatas, {"OTHER_INFO" :{"HOLD_STOCK_INFO" : noData}});
            }
            // bizPublicMethod.$blMethod.parseOldBiz(_this.groupDatas, {"OTHER_INFO" :{"HOLD_STOCK_INFO" :_this.oppBusiData.newBusiData.OTHER_INFO.HOLD_STOCK_INFO}});
        }
    },
    /*
     *@method bizHoldStockInfoNodeBeforeSave
     *@desc 钩子函数 自定义保存数
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizHoldStockInfoNodeBeforeSave: async function (_this, params) {
        let holdStockInfo = _this.groupDatas.OTHER_INFO.HOLD_STOCK_INFO;
        let rowsData = []; // 获取页面上最新的值
        _.each(holdStockInfo, (item, index) => {
            rowsData[index] = {};
            bizPublicMethod.$blMethod.changeObjKeys(item.FIELDS, rowsData[index]);
        })
        let originalData = _this.oppBusiData.oldBusiData.HOLD_STOCK, // 获取原始数据 oldBusiData
            datagridData = [];
    
        _.each(rowsData, function (item, index) {
            //判断当前是新增还是修改 OP_TYPE 0-新增 1-修改 2-删除 ""-不变
            var diff = item.OP_TYPE !== "0" ? bizPublicMethod.$blMethod.compareInfoZT(_.filter(originalData || {}, {
                    STK_CODE: item.STK_CODE
                })[0], item) : [];
    
            datagridData.push(_.extend({}, {
                DIFF_INFO: diff
            }, item));
        });
        originalData && originalData.filter(function (v) {
            return !_.filter(datagridData, {STK_CODE: v.STK_CODE})[0];
        }).forEach(function (v) {
            datagridData.push(_.extend({}, v, {DIFF_INFO: [], OP_TYPE: "2"}));
        });
        if(datagridData.length == 1 && (datagridData[0].STK_CODE==""|| datagridData[0].STKEX==""||datagridData[0].STK_NUM=="")) {
            // datagridData[0].OP_TYPE = ""
            datagridData = [];
        }else {
            datagridData = _.filter(datagridData, item => {
                return item.STK_CODE != "" && item.STKEX != ""
            })
        }
        params.OTHER_INFO.HOLD_STOCK_INFO = datagridData;
    },
    
    /*
     *@method bizHoldStockInfoNodeValidate
     *@desc 钩子函数 下一步验证
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizHoldStockInfoNodeValidate: function (_this) {
      
    },
    "bizHoldStockInfoNodeAddModuleFinished": (_this, moduleld, fieldData) => {
        console.log("点击了【5%以上股东】添加按钮【结束】")
        moduleld.FIELDS.STK_CODE.FIELD_CONTROL = "0";
        moduleld.FIELDS.OP_TYPE.DEFAULT_VALUE = "0"; 
         // 添加的模块设置必填
         moduleld.FIELDS.STK_CODE.FIELD_REQUIRED = "1";
         moduleld.FIELDS.STKEX.FIELD_REQUIRED = "1";
         moduleld.FIELDS.STK_NUM.FIELD_REQUIRED = "1";
         moduleld.FIELDS.STKCODE_SCALE.FIELD_REQUIRED = "1";
         moduleld.FIELDS.STKCODE_SCALE.VALID_TYPE = "numberex[10,2,3]";
    },
    //删除模块响应事件 删除动作未结束
    "bizHoldStockInfoNodeDeleteModule":(_this,deleteObj) =>{
        console.log(deleteObj)
        if(_this.groupDatas.OTHER_INFO.HOLD_STOCK_INFO.length==1) {
            _.each(["STK_CODE","STKEX","STK_NUM","STKCODE_SCALE","OP_TYPE"],(c)=> {
                 _this.groupDatas.OTHER_INFO.HOLD_STOCK_INFO[0].FIELDS[c].FIELD_REQUIRED = "0"
                 _this.groupDatas.OTHER_INFO.HOLD_STOCK_INFO[0].FIELDS[c].correct = true;
                 _this.groupDatas.OTHER_INFO.HOLD_STOCK_INFO[0].FIELDS[c].message = ""
           })
        }
        return true;
    },
    //删除模块响应事件 删除动作已结束
    "bizHoldStockInfoNodeDeleteModuleFinished":(_this,deleteObj) =>{
        if(_this.groupDatas.OTHER_INFO.HOLD_STOCK_INFO.length==1) {
            _.each(["STK_CODE","STKEX","STK_NUM","STKCODE_SCALE","OP_TYPE"],(c)=> {
                 _this.groupDatas.OTHER_INFO.HOLD_STOCK_INFO[0].FIELDS[c].FIELD_REQUIRED = "0"
                 _this.groupDatas.OTHER_INFO.HOLD_STOCK_INFO[0].FIELDS[c].correct = true;
                 _this.groupDatas.OTHER_INFO.HOLD_STOCK_INFO[0].FIELDS[c].message = ""
           })
        }
    },
    /*
     *@method bizHoldStockInfoNodePageActivated
     *@desc 钩子函数：页面激活
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizHoldStockInfoNodePageActivated: function (_this, groupId) {
        _this.$set(_this.groupDatas["OTHER_INFO"]["HOLD_STOCK_INFO"][_this.groupDatas.OTHER_INFO.HOLD_STOCK_INFO.length-1], "MAX_LENGTH", 1000);
        let holdStockInfo = _this.groupDatas.OTHER_INFO.HOLD_STOCK_INFO;
        if(holdStockInfo.length == "1"&&holdStockInfo[0].FIELDS.STK_CODE.DEFAULT_VALUE=="") {
            holdStockInfo[0].FIELDS.STK_CODE.FIELD_CONTROL = "0"; 
        }
        _this.groupDatas.OTHER_INFO.HOLD_STOCK_INFO.forEach(element => {
            // element.FIELDS.STK_CODE.FIELD_FUNCTION = "CHECK_HOLD_STK_CODE";
            element.FIELDS.STK_NUM.FIELD_FUNCTION = "CHECK_HOLD_STK_NUM"; // 股票数目
            element.FIELDS.STK_NUM.VALID_TYPE = "zint[20]|on-blur";
            element.FIELDS.STKEX.FIELD_FUNCTION = "CHECK_HOLD_STKEX"; // 证券交易所
            element.FIELDS.STKCODE_SCALE.FIELD_FUNCTION = "CHECK_HOLD_STKCODE_SCALE";
            element.FIELDS.STKCODE_SCALE.VALID_TYPE = "numberex[10,2,3]";
            if(element.FIELDS.OP_TYPE.DEFAULT_VALUE=="0" || element.FIELDS.OP_TYPE.DEFAULT_VALUE=="1" ) {
                holdStockInfo[0].FIELDS.STK_CODE.FIELD_CONTROL = "0"; 
            }
        });

          //判断已有数据.证券代码不可编辑
          _this.oppBusiData.oldBusiData.HOLD_STOCK && _this.oppBusiData.oldBusiData.HOLD_STOCK.forEach(function(oldItem){
            let tempSecuCodeCountInfo = {"COUNT": 0 ,INDEX : -1};
            _this.groupDatas.OTHER_INFO.HOLD_STOCK_INFO.forEach(function(newField,index){
                if(oldItem.STK_CODE == newField.FIELDS.STK_CODE.DEFAULT_VALUE){
                    tempSecuCodeCountInfo.COUNT ++;
                    if(tempSecuCodeCountInfo.COUNT == 1){
                        tempSecuCodeCountInfo.INDEX = index;
                    }
                }
            })
            
            if(tempSecuCodeCountInfo.COUNT > 0 && tempSecuCodeCountInfo.INDEX != -1 ){
                _this.groupDatas.OTHER_INFO.HOLD_STOCK_INFO[tempSecuCodeCountInfo.INDEX].FIELDS.STK_CODE.FIELD_CONTROL = "2";
            }
        })


        _this.groupDatas.OTHER_INFO.HOLD_STOCK_INFO.forEach(function(moduleItem,index){
            let tempSecuCodeCountInfo = {"COUNT": 0 ,INDEX : -1,RPEAT_INDEX : -1};
            _this.groupDatas.OTHER_INFO.HOLD_STOCK_INFO.forEach(function(newField,index){
                if(moduleItem.FIELDS.STK_CODE.DEFAULT_VALUE == newField.FIELDS.STK_CODE.DEFAULT_VALUE){
                    tempSecuCodeCountInfo.COUNT ++;
                    tempSecuCodeCountInfo.RPEAT_INDEX = index;
                    if(tempSecuCodeCountInfo.COUNT == 1){
                        tempSecuCodeCountInfo.INDEX = index;
                        _this.groupDatas.OTHER_INFO.HOLD_STOCK_INFO[tempSecuCodeCountInfo.INDEX].FIELDS.STK_CODE.FIELD_CONTROL = "2";
                    }
                }
            })
            
            if(tempSecuCodeCountInfo.COUNT > 0 && tempSecuCodeCountInfo.INDEX != -1 ){
                if(tempSecuCodeCountInfo.COUNT > 1){
                    if(tempSecuCodeCountInfo.COUNT > 0 && tempSecuCodeCountInfo.INDEX != -1){
                        _this.groupDatas.OTHER_INFO.HOLD_STOCK_INFO[tempSecuCodeCountInfo.RPEAT_INDEX].FIELDS.STK_CODE.correct = false;
                        _this.groupDatas.OTHER_INFO.HOLD_STOCK_INFO[tempSecuCodeCountInfo.RPEAT_INDEX].FIELDS.STK_CODE.showerr = true; 
                        _this.groupDatas.OTHER_INFO.HOLD_STOCK_INFO[tempSecuCodeCountInfo.RPEAT_INDEX].FIELDS.STK_CODE.message = "输入的证券代码已存在，请重新输入";
                    }
                }
            }
        })
        // 当存在一组但没有数据，证券代码 字段不可以置灰色
        if(!_this.groupDatas.OTHER_INFO.HOLD_STOCK_INFO[0].FIELDS.STK_CODE.DEFAULT_VALUE) {
            _this.groupDatas.OTHER_INFO.HOLD_STOCK_INFO[0].FIELDS.STK_CODE.FIELD_CONTROL = "0";
        }
    },
    // 对比两个对象是否一样
    // "comp": function(obj1, obj2, ignoreArr=["ignore"]) {
    //     _.forEach(obj1, (value, key)=> {
    //         if(!ignoreArr.includes(key) && value.) {
                
    //         }
    //     })
    // },
    // 更改字段数据
    "changeOpType":function(_this, field, fieldData) {
        let ischange = false;
        let originalData = _this.oppBusiData.oldBusiData.HOLD_STOCK;
        let current = _.filter(originalData || {}, {"STK_CODE": fieldData.STK_CODE.DEFAULT_VALUE})[0];
        // if(current&&Object.keys(current).length&&field.DEFAULT_VALUE != current[field.FIELD_ID]) {
        if(current&&Object.keys(current).length) {
            _.forEach(fieldData, function(value, key) {
                if(key!="OP_TYPE") {
                    if(fieldData[key].DEFAULT_VALUE != current[key]) {
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

        if(!current) {
            fieldData.OP_TYPE.DEFAULT_VALUE = "0";
        }
        if(field.DEFAULT_VALUE) {
            fieldData.STK_CODE.FIELD_REQUIRED = "1";
            fieldData.STKEX.FIELD_REQUIRED = "1";
            fieldData.STK_NUM.FIELD_REQUIRED = "1";
            fieldData.STKCODE_SCALE.FIELD_REQUIRED = "1";
        }
        if(_this.groupDatas.OTHER_INFO.HOLD_STOCK_INFO.length == 1 && _this.groupDatas.OTHER_INFO.HOLD_STOCK_INFO[0].FIELDS.STK_CODE.DEFAULT_VALUE =="") {
            fieldData.OP_TYPE.DEFAULT_VALUE = ""
        }
    },

    // 
    "CHECK_HOLD_STK_NUM": function(_this, field, fieldData) {
        this.changeOpType(_this, field, fieldData)
    },
    "CHECK_HOLD_STKEX": function(_this, field, fieldData) {
        this.changeOpType(_this, field, fieldData)
    },
    "CHECK_HOLD_STKCODE_SCALE": function(_this, field, fieldData) {
        field.VALID_TYPE = "numberex[10,2,3]";
        this.changeOpType(_this, field, fieldData)
    },
    "CHECK_STK_CODE" : function(_this, field, fieldData) {
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
        
        if(field.DEFAULT_VALUE) {
            fieldData.STK_CODE.FIELD_REQUIRED = "1";
            fieldData.STKEX.FIELD_REQUIRED = "1";
            fieldData.STK_NUM.FIELD_REQUIRED = "1";
            fieldData.STKCODE_SCALE.FIELD_REQUIRED = "1";
        }else {
            fieldData.STK_CODE.FIELD_REQUIRED = "0";
            fieldData.STK_CODE.FIELD_CONTROL = "0";
            fieldData.STKEX.FIELD_REQUIRED = "0";
            fieldData.STK_NUM.FIELD_REQUIRED = "0";
            fieldData.STKCODE_SCALE.FIELD_REQUIRED = "0";
        }
         //判断添加或修改的证券代码如果已存在，需要增加提示
         _this.$refs.flowTip.flowTips = [];
         let currentIndex = -1;
         _this.groupDatas.OTHER_INFO.HOLD_STOCK_INFO.forEach(function(moduleItem,index){
             if(moduleItem && moduleItem.FIELDS.STK_CODE.DEFAULT_VALUE == field.DEFAULT_VALUE  ){
                 currentIndex =  index;
                 return;
             }
         })
         if(currentIndex > 0){
             let tempObj = {"COUNT":0,"INDEX": -1 };
             _this.groupDatas.OTHER_INFO.HOLD_STOCK_INFO.forEach(function(moduleItem,index){
                 let tempValue = moduleItem.FIELDS.STK_CODE.DEFAULT_VALUE;
                 if(tempValue == field.DEFAULT_VALUE  ){
                     tempObj.COUNT ++;
                     tempObj.INDEX = index ;
                 }
             })
 
             if(tempObj.COUNT > 1 && tempObj.INDEX != -1){
                 _this.groupDatas.OTHER_INFO.HOLD_STOCK_INFO[tempObj.INDEX].FIELDS.STK_CODE.correct = false;
                 _this.groupDatas.OTHER_INFO.HOLD_STOCK_INFO[tempObj.INDEX].FIELDS.STK_CODE.showerr = true; 
                 _this.groupDatas.OTHER_INFO.HOLD_STOCK_INFO[tempObj.INDEX].FIELDS.STK_CODE.message = "输入的证券代码已存在，请重新输入";
             }
         }
        this.changeOpType(_this, field, fieldData)
    }
}

