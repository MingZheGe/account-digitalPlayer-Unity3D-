/*
 *   董监高信息
 *   方法封装
 *   @author  yangyp
 */

import bizPublicMethod from "../../../../../../../business/businessTools/bizPublicMethod.js"
export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizChairmanInfoNodeBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizChairmanInfoNodeBeforeLoadBiz: function (_this) {

        _this.groupDatas.OTHER_INFO.CHAIRMAN_INFO[0].FIELDS.REMARK.FIELD_TYPE = "date";
        _this.groupDatasTpl.OTHER_INFO = _.cloneDeep(_this.groupDatas.OTHER_INFO);
        if(_this.oppBusiData.oldBusiData.CHAIRMAN_INFO &&
            _this.oppBusiData.oldBusiData.CHAIRMAN_INFO.length){
             bizPublicMethod.$blMethod.parseOldBiz(_this,_this.groupDatas, {"OTHER_INFO" :{"CHAIRMAN_INFO" :_this.oppBusiData.oldBusiData.CHAIRMAN_INFO}});
        }

        //强制模块显示删除按钮
        _this.groupDatas.OTHER_INFO.CHAIRMAN_INFO[0].showDelete = true;

        _this.groupDatasTpl.OTHER_INFO.CHAIRMAN_INFO[0].MAX_LENGTH = "1000";
        _this.groupDatas.OTHER_INFO.CHAIRMAN_INFO[0].MAX_LENGTH = "1000";
        
    },
    /*
     *@method bizChairmanInfoNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-13 09:42:56
     */
    bizChairmanInfoNodeAfterLoadBiz: function (_this) {
        if(_this.oppBusiData.newBusiData && 
            _this.oppBusiData.newBusiData.OTHER_INFO && 
            _this.oppBusiData.newBusiData.OTHER_INFO.CHAIRMAN_INFO && 
            _this.oppBusiData.newBusiData.OTHER_INFO.CHAIRMAN_INFO.length){
                let newData = _.filter(_this.oppBusiData.newBusiData.OTHER_INFO.CHAIRMAN_INFO, function (v) {
                    return  v.OP_TYPE != 2;
                });
                bizPublicMethod.$blMethod.parseOldBiz(_this,_this.groupDatas, {"OTHER_INFO" :{"CHAIRMAN_INFO" : newData}});
                if(!newData.length) {
                    let noData = [{
                        CHIEF_NAME: "",
                        CHIEF_SOURCE_CLS: "",
                        MARKET_FIRM: "",
                        OP_TYPE: "",
                        REMARK: "",
                        SECU_CODE: "",
                        STKEX: "",
                    }]
                    bizPublicMethod.$blMethod.parseOldBiz(_this,_this.groupDatas, {"OTHER_INFO" :{"CHAIRMAN_INFO" : noData}});
                }
         }
         let chairManModule = _this.groupDatas.OTHER_INFO.CHAIRMAN_INFO;
         chairManModule[chairManModule.length-1].MODULE_ADD = "1";
    },
    /*
     *@method bizChairmanInfoNodeBeforeSave
     *@desc 钩子函数 自定义保存数
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizChairmanInfoNodeBeforeSave: async function (_this, params) {
        let chairmanInfo = _this.groupDatas.OTHER_INFO.CHAIRMAN_INFO;
        let rowsData = []; // 获取页面上最新的值
        _.each(chairmanInfo, (item, index) => {
            rowsData[index] = {};
            bizPublicMethod.$blMethod.changeObjKeys(item.FIELDS, rowsData[index]);
        })
        let originalData = _this.oppBusiData.oldBusiData.CHAIRMAN_INFO, // 获取原始数据 oldBusiData
            datagridData = [];

        _.each(rowsData, function (item, index) {
            //判断当前是新增还是修改 OP_TYPE 0-新增 1-修改 2-删除 ""-不变
            var diff = item.OP_TYPE !== "0" ? bizPublicMethod.$blMethod.compareInfoZT(_.filter(originalData || {}, {
                    SECU_CODE: item.SECU_CODE
                })[0], item) : [];

            datagridData.push(_.extend({}, {
                DIFF_INFO: diff
            }, item));
        });
        originalData && originalData.filter(function (v) {
            return !_.filter(datagridData, {SECU_CODE: v.SECU_CODE})[0];
        }).forEach(function (v) {
            datagridData.push(_.extend({}, v, {DIFF_INFO: [], OP_TYPE: "2"}));
        });
        if(datagridData.length == 1 && (datagridData[0].STKEX==""|| datagridData[0].SECU_CODE==""||datagridData[0].MARKET_FIRM=="")) {
            // datagridData[0].OP_TYPE = ""
            datagridData = [];
        }else {
            datagridData = _.filter(datagridData, item => {
                return item.SECU_CODE != "" && item.STKEX != ""
            })
        }
        params.OTHER_INFO.CHAIRMAN_INFO = datagridData;
    },
    /*
     *@method bizChairmanInfoNodeValidate
     *@desc 钩子函数 下一步验证
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizChairmanInfoNodeValidate: function (_this) {
      
    },

    /*
     *@method bizChairmanInfoNodePageActivated
     *@desc 钩子函数：页面激活
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizChairmanInfoNodePageActivated: function (_this, groupId) {
        _this.$set(_this.groupDatas["OTHER_INFO"]["CHAIRMAN_INFO"][_this.groupDatas.OTHER_INFO.CHAIRMAN_INFO.length-1], "MAX_LENGTH", 1000);

        _this.groupDatas.OTHER_INFO.CHAIRMAN_INFO.forEach(element => {
            element.FIELDS.CHIEF_NAME.FIELD_FUNCTION = "CHECK_CHAIR_CHIEF_NAME";
            element.FIELDS.MARKET_FIRM.FIELD_FUNCTION = "CHECK_CHAIR_MARKET_FIRM";
            element.FIELDS.STKEX.FIELD_FUNCTION = "CHECK_CHAIR_STKEX";
            element.FIELDS.REMARK.FIELD_FUNCTION = "CHECK_CHAIR_REMARK";
            element.FIELDS.REMARK.FIELD_TYPE = "date";
        });
        //判断已有数据.证券代码不可编辑
        _this.oppBusiData.oldBusiData.CHAIRMAN_INFO && _this.oppBusiData.oldBusiData.CHAIRMAN_INFO.forEach(function(oldItem){
            let tempSecuCodeCountInfo = {"COUNT": 0 ,INDEX : -1};
            _this.groupDatas.OTHER_INFO.CHAIRMAN_INFO.forEach(function(newField,index){
                if(oldItem.SECU_CODE == newField.FIELDS.SECU_CODE.DEFAULT_VALUE){
                    tempSecuCodeCountInfo.COUNT ++;
                    if(tempSecuCodeCountInfo.COUNT == 1){
                        tempSecuCodeCountInfo.INDEX = index;
                    }
                }
            })
            
            if(tempSecuCodeCountInfo.COUNT > 0 && tempSecuCodeCountInfo.INDEX != -1 ){
                if(_this.groupDatas.OTHER_INFO.CHAIRMAN_INFO[tempSecuCodeCountInfo.INDEX].FIELDS.SECU_CODE.DEFAULT_VALUE){
                    _this.groupDatas.OTHER_INFO.CHAIRMAN_INFO[tempSecuCodeCountInfo.INDEX].FIELDS.SECU_CODE.FIELD_CONTROL = "2";
                }
            }
        })


        _this.groupDatas.OTHER_INFO.CHAIRMAN_INFO.forEach(function(moduleItem,index){
            let tempSecuCodeCountInfo = {"COUNT": 0 ,INDEX : -1,RPEAT_INDEX : -1};
            _this.oppBusiData.oldBusiData.CHAIRMAN_INFO && _this.oppBusiData.oldBusiData.CHAIRMAN_INFO.forEach(function(newField,index){
                if(moduleItem.FIELDS.SECU_CODE.DEFAULT_VALUE == newField.SECU_CODE){
                    tempSecuCodeCountInfo.COUNT ++;
                    tempSecuCodeCountInfo.RPEAT_INDEX = index;
                    if(tempSecuCodeCountInfo.COUNT == 1){
                        tempSecuCodeCountInfo.INDEX = index;
                        _this.groupDatas.OTHER_INFO.CHAIRMAN_INFO[tempSecuCodeCountInfo.INDEX].FIELDS.SECU_CODE.FIELD_CONTROL = "2";
                    }
                }
            })
            
            if(tempSecuCodeCountInfo.COUNT > 0 && tempSecuCodeCountInfo.INDEX != -1 ){
                if(tempSecuCodeCountInfo.COUNT > 1){
                    if(tempSecuCodeCountInfo.COUNT > 0 && tempSecuCodeCountInfo.INDEX != -1){
                        _this.groupDatas.OTHER_INFO.CHAIRMAN_INFO[tempSecuCodeCountInfo.RPEAT_INDEX].FIELDS.SECU_CODE.correct = false;
                        _this.groupDatas.OTHER_INFO.CHAIRMAN_INFO[tempSecuCodeCountInfo.RPEAT_INDEX].FIELDS.SECU_CODE.showerr = true; 
                        _this.groupDatas.OTHER_INFO.CHAIRMAN_INFO[tempSecuCodeCountInfo.RPEAT_INDEX].FIELDS.SECU_CODE.message = "输入的证券代码已存在，请重新输入";
                    }
                }
            }
        })
        // 当存在一组但没有数据，证券代码 字段不可以置灰色
        if(!_this.groupDatas.OTHER_INFO.CHAIRMAN_INFO[0].FIELDS.SECU_CODE.DEFAULT_VALUE) {
            _this.groupDatas.OTHER_INFO.CHAIRMAN_INFO[0].FIELDS.SECU_CODE.FIELD_CONTROL = "0";
        }

    },

    "bizChairmanInfoNodeAddModule": (_this, moduleld, fieldData) => {
        console.log("点击了【董监高】添加按钮")
        return true
    },
    //删除模块响应事件
    "bizChairmanInfoDeleteModule":(_this,deleteObj) =>{
        console.log(deleteObj)
        if(deleteObj.FIELDS.CHIEF_SOURCE_CLS.DEFAULT_VALUE == "0") {
            _this.messageBox({
                hasMask: true,
                messageText: "该行数据来源于清算,不能修改或删除！",
                confirmButtonText: '确定',
                typeMessage: 'warn',
                showMsgBox: true
            })
            return false;

        }
        if(_this.groupDatas.OTHER_INFO.CHAIRMAN_INFO.length==1) {
            _.each(["CHIEF_NAME","CHIEF_SOURCE_CLS","MARKET_FIRM","OP_TYPE","REMARK","SECU_CODE","STKEX"],(c)=> {
                _this.groupDatas.OTHER_INFO.CHAIRMAN_INFO[0].FIELDS[c].FIELD_REQUIRED = "0"
                _this.groupDatas.OTHER_INFO.CHAIRMAN_INFO[0].FIELDS[c].correct = true;
                _this.groupDatas.OTHER_INFO.CHAIRMAN_INFO[0].FIELDS[c].message = ""
          })
        }
        return true;
    },
    "bizChairmanInfoDeleteModuleFinished": (_this,deleteObj) => {
        if(_this.groupDatas.OTHER_INFO.CHAIRMAN_INFO.length==1) {
            _.each(["CHIEF_NAME","CHIEF_SOURCE_CLS","MARKET_FIRM","OP_TYPE","REMARK","SECU_CODE","STKEX"],(c)=> {
                _this.groupDatas.OTHER_INFO.CHAIRMAN_INFO[0].FIELDS[c].FIELD_REQUIRED = "0"
                _this.groupDatas.OTHER_INFO.CHAIRMAN_INFO[0].FIELDS[c].correct = true;
                _this.groupDatas.OTHER_INFO.CHAIRMAN_INFO[0].FIELDS[c].message = ""
          })
        }
    },
    "bizChairmanInfoNodeAddModuleFinished": (_this, moduleld, fieldData) => {
        console.log("点击了【董监高】添加按钮【结束】")
        moduleld.FIELDS.SECU_CODE.FIELD_CONTROL = "0";
        moduleld.FIELDS.OP_TYPE.DEFAULT_VALUE = "0";
        // 添加的模块设置必填
        moduleld.FIELDS.SECU_CODE.FIELD_REQUIRED = "1";
        moduleld.FIELDS.MARKET_FIRM.FIELD_REQUIRED = "1";
        moduleld.FIELDS.STKEX.FIELD_REQUIRED = "1";
        moduleld.FIELDS.CHIEF_NAME.FIELD_REQUIRED = "1";
        moduleld.FIELDS.REMARK.FIELD_REQUIRED = "1";
    },
    // 更改字段数据
    "changeChairOpType":function(_this, field, fieldData) {
        let ischange = false;
        if (fieldData.CHIEF_SOURCE_CLS.DEFAULT_VALUE === "0") {
            _.forEach(fieldData, function(value, key) {
                if(key != "CHIEF_SOURCE_CLS") {
                    fieldData[key].FIELD_CONTROL = "2"
                }
            })
        }
        if(field.DEFAULT_VALUE) {
            fieldData.SECU_CODE.FIELD_REQUIRED = "1";
            // 添加的模块设置必填
            fieldData.MARKET_FIRM.FIELD_REQUIRED = "1";
            fieldData.STKEX.FIELD_REQUIRED = "1";
            fieldData.CHIEF_NAME.FIELD_REQUIRED = "1";
            fieldData.REMARK.FIELD_REQUIRED = "1";
        }

        let originalData = _this.oppBusiData.oldBusiData.CHAIRMAN_INFO;
        let current = _.filter(originalData || {}, {"SECU_CODE": fieldData.SECU_CODE.DEFAULT_VALUE})[0];
        // if(current&&Object.keys(current).length&&field.DEFAULT_VALUE != current[field.FIELD_ID]) {
        //     fieldData.OP_TYPE.DEFAULT_VALUE = "1"
        // }else {
        //     fieldData.OP_TYPE.DEFAULT_VALUE = "";
            
        // }
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
            fieldData.OP_TYPE.DEFAULT_VALUE = "0"
        }
        if(_this.groupDatas.OTHER_INFO.CHAIRMAN_INFO.length == 1 && _this.groupDatas.OTHER_INFO.CHAIRMAN_INFO[0].FIELDS.SECU_CODE.DEFAULT_VALUE =="") {
            fieldData.OP_TYPE.DEFAULT_VALUE = ""
        }
    },

    // 职务
    "CHECK_CHAIR_CHIEF_NAME" : function(_this, field, fieldData) {
        
        this.changeChairOpType(_this, field, fieldData)
    },
    // 公司名称
    "CHECK_CHAIR_MARKET_FIRM" : function(_this, field, fieldData) {
        if(field.DEFAULT_VALUE.length > 64) {
            field.DEFAULT_VALUE = field.DEFAULT_VALUE.substr(0,64);
        }
        this.changeChairOpType(_this, field, fieldData)
    },
    // 证券交易所
    "CHECK_CHAIR_STKEX" : function(_this, field, fieldData) {
        
        this.changeChairOpType(_this, field, fieldData)
    },
    // 任职期限
    "CHECK_CHAIR_REMARK" : function(_this, field, fieldData) {

        this.changeChairOpType(_this, field, fieldData)
    },
    "CHECK_SECU_CODE" : function(_this, field, fieldData) {
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
            fieldData.SECU_CODE.FIELD_REQUIRED = "1";
            fieldData.MARKET_FIRM.FIELD_REQUIRED = "1";
            fieldData.STKEX.FIELD_REQUIRED = "1";
            fieldData.CHIEF_NAME.FIELD_REQUIRED = "1";
            fieldData.REMARK.FIELD_REQUIRED = "1";
        }else {
            fieldData.SECU_CODE.FIELD_REQUIRED = "0";
            fieldData.SECU_CODE.FIELD_CONTROL = "0";
            fieldData.MARKET_FIRM.FIELD_REQUIRED = "0";
            fieldData.STKEX.FIELD_REQUIRED = "0";
            fieldData.CHIEF_NAME.FIELD_REQUIRED = "0";
            fieldData.REMARK.FIELD_REQUIRED = "0";
        }
        _this.$refs.flowTip.flowTips = [];


        //判断添加或修改的证券代码如果已存在，需要增加提示
        _this.$refs.flowTip.flowTips = [];
        let currentIndex = -1;
        _this.groupDatas.OTHER_INFO.CHAIRMAN_INFO.forEach(function(moduleItem,index){
            if(moduleItem && moduleItem.FIELDS.SECU_CODE.DEFAULT_VALUE == field.DEFAULT_VALUE  ){
                currentIndex =  index;
                return;
            }
        })
        if(currentIndex > 0){
            let tempObj = {"COUNT":0,"INDEX": -1 };
            _this.groupDatas.OTHER_INFO.CHAIRMAN_INFO.forEach(function(moduleItem,index){
                let tempValue = moduleItem.FIELDS.SECU_CODE.DEFAULT_VALUE;
                if(tempValue == field.DEFAULT_VALUE  ){
                    tempObj.COUNT ++;
                    tempObj.INDEX = index ;
                }
            })

            if(tempObj.COUNT > 1 && tempObj.INDEX != -1){
                _this.groupDatas.OTHER_INFO.CHAIRMAN_INFO[tempObj.INDEX].FIELDS.SECU_CODE.correct = false;
                _this.groupDatas.OTHER_INFO.CHAIRMAN_INFO[tempObj.INDEX].FIELDS.SECU_CODE.showerr = true; 
                _this.groupDatas.OTHER_INFO.CHAIRMAN_INFO[tempObj.INDEX].FIELDS.SECU_CODE.message = "输入的证券代码已存在，请重新输入";
            }
        }
        this.changeChairOpType(_this, field, fieldData)
    }
}

