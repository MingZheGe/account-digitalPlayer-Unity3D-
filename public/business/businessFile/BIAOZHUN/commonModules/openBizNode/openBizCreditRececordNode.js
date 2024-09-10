/*
 *   诚信记录信息
 *   方法封装
 *   @author  zky
 */

export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method openBizCreditRececordNodeBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     *@MethodAuthor  zky
     *@Date: 2020-11-16
     */
    openBizCreditRececordNodeBeforeLoadBiz: function (_this) {
         //诚信记录
        let that = _this;
        let CustFlag = true; 
        if(_.isEmpty(_this.groupDatas.CUST_INFO))
            CustFlag = false;
        let creditInfo = CustFlag? _this.groupDatas.CUST_INFO.CREDIT_INFO[0].FIELDS  : _this.groupDatas.APPR_INFO.CREDIT_INFO[0].FIELDS;
        if (["YINHE"].indexOf(_this.$definecfg.QSJGDM_CONST[_this.$basecfg.qsVersion]) != -1) {
            creditInfo.RECORD_SCORE.FIELD_CONTROL = "0";
            //银河 - 不良诚信记录来源中的字典项屏蔽“无不良诚信记录”
            creditInfo.RECORD_SOURCE.FIELD_DICT_FILTER = ["99"]
        }
        if(CustFlag)
            _this.groupDatasTpl.CUST_INFO.CREDIT_INFO[0].FIELDS = creditInfo
        else
            _this.groupDatasTpl.APPR_INFO.CREDIT_INFO[0].FIELDS = creditInfo
        
    },

    /*
     *@method openBizCreditRececordNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     *@MethodAuthor  zky
     *@Date: 2020-11-16
     */
    openBizCreditRececordNodeAfterLoadBiz: function (_this) {
       
    },
    /*
     *@method openBizCreditRececordNodePageActivated
     *@desc 钩子函数：页面激活
     *@MethodAuthor  zky
     *@Date: 2020-11-16
     */
    openBizCreditRececordNodePageActivated: function (_this) {
       
    },

    /*
     *@method openBizCreditRececordNodeValidate
     *@desc 钩子函数 下一步验证
     *@MethodAuthor  zky
     *@Date: 2020-11-16
     */
    openBizCreditRececordNodeValidate: function (_this) {
      
    },

    /*
     *@method openBizCreditRececordNodeBeforeSave
     *@desc 钩子函数 自定义保存数
     *@MethodAuthor  zky
     *@Date: 2020-11-16
     */
    openBizCreditRececordNodeBeforeSave: function (_this, params) {
        
    },

    /**
     * 
     */
    "CHECK_IS_HONEST": (_this, field, fieldData) => {
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
     /**
      * 银河
      * 是否有诚信记录来源
      */
    "CHECK_HAVE_CREDIT_INFO": (_this, field, fieldData) => {
        let CustFlag = true;
        if(_.isEmpty(_this.groupDatas.CUST_INFO))
            CustFlag = false;
        if (field.DEFAULT_VALUE != "" && field.FIELD_LAST_CHOOSE_VALUE && field.FIELD_LAST_CHOOSE_VALUE != undefined && field.FIELD_LAST_CHOOSE_VALUE != "")
            field.DEFAULT_VALUE = field.FIELD_LAST_CHOOSE_VALUE;
        if(CustFlag) {
            if (field.DEFAULT_VALUE == "1") {
                //显示诚信记录信息
                _this.groupDatas.CUST_INFO.CREDIT_INFO[0].MODULE_CONTROL = "1"
                _this.groupDatasTpl.CUST_INFO.CREDIT_INFO[0].MODULE_CONTROL = "1"
                //银河 - 选择诚信记录为是时 过滤掉 “诚信记录来源”过滤掉“07-无不良诚信记录”
                let RECORD_SOURCE = _this.groupDatas.CUST_INFO.CREDIT_INFO[0].FIELDS.RECORD_SOURCE;
                RECORD_SOURCE.FIELD_DICT_FILTER = _.map(_.filter(RECORD_SOURCE.FIELD_DICT_NAME, item => {
                    return item.DICT_ITEM != "07";
                }), "DICT_ITEM");
            } else {
                //银河 - 隐藏并清空诚信记录信息
                _this.groupDatas.CUST_INFO.CREDIT_INFO[0].MODULE_CONTROL = "0"
                _this.groupDatas.CUST_INFO.CREDIT_INFO[0].MODULE_ADD = "1"
                _this.groupDatas.CUST_INFO.CREDIT_INFO.splice(1, _this.groupDatas.CUST_INFO.CREDIT_INFO.length);
                for (let fk in _this.groupDatas.CUST_INFO.CREDIT_INFO[0].FIELDS) {
                    _this.groupDatas.CUST_INFO.CREDIT_INFO[0].FIELDS[fk].DEFAULT_VALUE = "";
                }
                _this.groupDatasTpl.CUST_INFO.CREDIT_INFO[0].MODULE_CONTROL = "0"
            }
        }else {
            if (field.DEFAULT_VALUE == "1") {
                //显示诚信记录信息
                _this.groupDatas.APPR_INFO.CREDIT_INFO[0].MODULE_CONTROL = "1"
                _this.groupDatasTpl.APPR_INFO.CREDIT_INFO[0].MODULE_CONTROL = "1"
                //银河 - 选择诚信记录为是时 过滤掉 “诚信记录来源”过滤掉“07-无不良诚信记录”
                let RECORD_SOURCE = _this.groupDatas.APPR_INFO.CREDIT_INFO[0].FIELDS.RECORD_SOURCE;
                RECORD_SOURCE.FIELD_DICT_FILTER = _.map(_.filter(RECORD_SOURCE.FIELD_DICT_NAME, item => {
                    return item.DICT_ITEM != "07";
                }), "DICT_ITEM");
            } else {
                //银河 - 隐藏并清空诚信记录信息
                _this.groupDatas.APPR_INFO.CREDIT_INFO[0].MODULE_CONTROL = "0"
                _this.groupDatas.APPR_INFO.CREDIT_INFO[0].MODULE_ADD = "1"
                _this.groupDatas.APPR_INFO.CREDIT_INFO.splice(1, _this.groupDatas.APPR_INFO.CREDIT_INFO.length);
                for (let fk in _this.groupDatas.APPR_INFO.CREDIT_INFO[0].FIELDS) {
                    _this.groupDatas.APPR_INFO.CREDIT_INFO[0].FIELDS[fk].DEFAULT_VALUE = "";
                }
                _this.groupDatasTpl.APPR_INFO.CREDIT_INFO[0].MODULE_CONTROL = "0"
            }
        }
    },
    /**
     * 	诚信记录来源
     */
    "CHECK_RECORD_SOURCE" : (_this, field, fieldData) => {
        if(field.DEFAULT_VALUE == "") return 
        //银河 - 诚信记录来源选其他时为必填
        if (field.DEFAULT_VALUE == "99") {
            fieldData.RECORD_TXT.FIELD_REQUIRED = "1"
        } else {
            fieldData.RECORD_TXT.FIELD_REQUIRED = "0"
        }
        if(["YINHE"].indexOf(_this.$definecfg.QSJGDM_CONST[_this.$basecfg.qsVersion]) != -1) {
            //银河 - 增加多条不良诚信记录信息时，“不良诚信记录来源”中的字典项不得重复选择。
            let tem = "";
            _.each(_this.groupDatas.CREDIT_INFO,(item,index)=> {
                let rela =  _.get(item.FIELDS.RECORD_SOURCE,"DEFAULT_VALUE","")
                tem.push(rela)
            })
            if( tem.length != _.uniq(tem).length) {
                field.message = "不良诚信记录来源选项不得重复选择";
                field.correct = false;
            } else {
                field.correct = true;
            }
        }
    },
    "CHECK_RECORD_TXT" : (_this, field, fieldData) => {
        //银河 - 不良诚信记录来源选择“其他”，不良诚信备注必填且不能填“无”；
        if(["YINHE"].indexOf(_this.$definecfg.QSJGDM_CONST[_this.$basecfg.qsVersion]) != -1 && fieldData.DEFAULT_VALUE == '99' && field.DEFAULT_VALUE == "无") {
            field.message = "不良诚信记录来源选项不得重复选择";
            field.correct = false;
        }
    }
}

