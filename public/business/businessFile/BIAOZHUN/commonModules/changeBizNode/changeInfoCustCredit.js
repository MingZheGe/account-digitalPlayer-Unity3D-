import bizTaxMethod from "../../../../businessTools/bizTaxMethod";

export default {
    creditInfoBeforeLoadBiz: function (_this) {
        _this.oppBusiData.creditModule = _this.groupDatas["CUST_INFO"]["CREDIT_TYPE_MODULE1"][0];
        //解析诚信记录模块数据
        _this.$blMethod.parseMoudleArray(_this,_this.groupDatas["CUST_INFO"]["CREDIT_TYPE_MODULE1"],_this.oppBusiData.custAllInfo.CREDIT_RECORD_INFO);
        //当诚信记录长度为0的时候 是否有诚信记录选填否   否则默认填是
        if(_this.oppBusiData.custAllInfo.CREDIT_RECORD_INFO.length == 0){
            _this.groupDatas.CUST_INFO.HAS_CREDIT_RECORD[0].FIELDS.HAS_CREDIT_RECORD.DEFAULT_VALUE='0'
        }else{
            _this.groupDatas.CUST_INFO.HAS_CREDIT_RECORD[0].FIELDS.HAS_CREDIT_RECORD.DEFAULT_VALUE='1'
        }
    },

    custInfoLoadBizData: function (_this, busiData) {
        this.custInfoParseOppBiz(_this, busiData);
    },

    /**
     * custInfoParseOldBiz 重新加载转换之后的历史数据
     * @param _this
     */
    custInfoParseOppBiz: function (_this, bdata) { // 解析身份证读卡数据
        if (_this.userType == "0") {
            if (bdata.CUST_CREDIT_RECORD) {
                _this.$blMethod.parseMoudleArray(_this, _this.groupDatas["CUST_INFO"]["CREDIT_TYPE_MODULE1"], bdata.CUST_CREDIT_RECORD);
            }
            //更新流水数据的字段解析
            _this.$blMethod.parseGroupsMouduleData(_this, ["CUST_LINK_INFO"], bdata.CUST_LINK_INFO);
            _this.$blMethod.parseGroupsMouduleData(_this, ["CUST_BASIC_INFO"], bdata.CUST_BASE_INFO);
        }

    },


    creditInfoPageActivated: function (_this, groupId, modules) {
        _this.$router.updateRoute(_this.$router.getCurrentRouteIndex(), "nextBtnText", "填写完成");
    },

    creditInfoGetData: function(_this,params) {
        let creditRecordInfo = [];
        _.each(_this.groupDatas.CUST_INFO.CREDIT_TYPE_MODULE1,function(item){
            let record ={
                RECORD_SOURCE:item.FIELDS.RECORD_SOURCE.DEFAULT_VALUE,
                RECORD_SCORE:item.FIELDS.RECORD_SCORE.DEFAULT_VALUE,
                RECORD_TXT:item.FIELDS.RECORD_TXT.DEFAULT_VALUE,
                RECORD_NUM:item.FIELDS.RECORD_NUM.DEFAULT_VALUE
            };
            creditRecordInfo.push(record);
        })
        creditRecordInfo = this.getCreditArrDiff(creditRecordInfo, _this.oppBusiData.CREDIT_RECORD_INFO, "RECORD_NUM","");
        let result = {
            CUST_CREDIT_RECORD: creditRecordInfo && creditRecordInfo.INFO
        };
        Object.assign(params,result);
    },


     /**
         * 处理已变更的资料项
         * @param newData
         * @param oldArr
         * @param keyId
         * @param skipKeys
         * @param keepOldVal
         * @returns {{INFO: Array, IS_CHANGE: string}}
         */
        getCreditArrDiff: function (newData, oldArr, keyId, skipKeys, keepOldVal) {
            var that = this,
                newArr = [],
                isChange = "0",
                skipKeyArr = skipKeys && skipKeys.split(",") || [],
                skipValObj = {};
            _.each(newData, function (newObj) {
                var oldObj = {},
                    matchObj = {},
                    skipValObj = {},
                    diff = [],
                    operType = "3";//OPER_TYPE 0-新增 1-修改 2-删除 3-不变

                // 用于匹配的关键属性值
                matchObj[keyId] = newObj[keyId];
                // 排除不需比较的属性
                _.each(skipKeyArr, function (skipkey) {
                    skipValObj[skipkey] = newObj[skipkey];//保留不需要比较属性的新值，
                    matchObj = _.omit(matchObj, skipkey);
                    newObj = _.omit(newObj, skipkey);
                });
                // 旧值
                oldObj = _.find(oldArr, matchObj);

                if (oldArr.length == 0 && _.compact(_.values(newObj)).length == 0) {
                    //防止开户的时候没有值，然后变更的时候也没有值，传operType=0新增的情况
                    operType = "3";
                } else if (_.isEmpty(oldObj) && !_.isEmpty(newObj)) {
                    // 旧值没有，但新值有
                    operType = "0";
                    diff = !oldObj ? that.compareInfo(oldObj, newObj) : [];
                } else {
                    // 旧值、新值都有
                    diff = !oldObj ? [] : that.compareInfo(oldObj, newObj);
                    operType = diff.length ? "1" : (!oldObj ? "0" : "3");
                    // 20180410：兼容涉税信息需求变更，修改时候若需要保留变更前信息，需要把变更前的信息缓存进去
                    if (keepOldVal && diff.length) {
                        _.each(oldObj, function (v, k) {
                            var tmpObj = _.find(diff, function (o) {
                                return o.FIELD == k;
                            });
                            if (!tmpObj && v) { 
                                diff.push({
                                    FIELD: k,
                                    NEW: v,
                                    OLD: v
                                })
                            }
                        })
                    }
                }
                if (operType !== "3") {
                    isChange = "1";
                }
                newArr.push(Object.assign({},{
                    DIFF_INFO: diff,
                    OPER_TYPE: operType
                },newObj, skipValObj));
            });
           var arr = oldArr.filter(function (v) {
                var matchObj = {};
                matchObj[keyId] = v[keyId];
                return !_.find(newArr, matchObj);
            });
            arr.forEach(function(v){
                newArr.push(Object.assign({},v,{DIFF_INFO:[v],OPER_TYPE:"2"}));
                isChange = "1";
            })
            return {
                INFO: newArr,
                IS_CHANGE: isChange
            };
        },

        /**
         * 比较普通对象资料变更
         * @param objOld
         * @param objNew
         * @param skipKeys
         * @returns {Array}
         */
        compareInfo: function (objOld, objNew, skipKeys) {
            var diff = [], newObj = objNew;
            // 排除指定不需比较的属性
            skipKeys && _.each(skipKeys.split(","), function (skipkey) {
                newObj = _.omit(newObj, skipkey);
            });
            _.each(newObj, function (v, k) {
                // 过滤调不需要检查的key
                if (!objOld || (null !== (objOld[k] || "") && v !== (objOld[k] || ""))) {
                    diff.push({
                        FIELD: k,
                        OLD: objOld && objOld[k] || "",
                        NEW: v || ""
                    });
                }
            });
            return diff;
        },
        "CHECK_HAS_CREDIT_RECORD": (_this, field, fieldData) => {
            //当选择否的时候  需要将全部的诚信记录删除
            if(field.DEFAULT_VALUE == "0"){
                let modules = _this.groupDatas.CUST_INFO.CREDIT_TYPE_MODULE1;
                //获取模块的个数
                let moduleLength = _this.groupDatas.CUST_INFO.CREDIT_TYPE_MODULE1.length;
                //将所有模块删除
                modules.splice(0, moduleLength);
                let field = _.cloneDeep(_this.oppBusiData.creditModule);
                let addModule = bizTaxMethod.getEmptyGroupFieldObj(_this, field);
                addModule["MODULE_SEQ"] = parseInt(addModule["MODULE_SEQ"]) + moduleLength + "";
                addModule["MODULE_ADD"] = "1";
                addModule["MODULE_NUM"] = '';
                modules.push(addModule);
                //验证之后
                if(!_this.oppBusiData.showCredit){
                    _this.groupDatas.CUST_INFO.CREDIT_TYPE_MODULE1[0].MODULE_CONTROL = '0';
                }else{
                    delete _this.oppBusiData.showCredit;
                }
            }
            //否则显示出一个模块
            else{
                let modules = _this.groupDatas["CUST_INFO"]["CREDIT_TYPE_MODULE1"];
                for(let md in modules){
                    modules[md].MODULE_CONTROL = '1';
                }
            }
        }
}
