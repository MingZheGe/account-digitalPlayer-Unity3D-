/*
 *   受益人信息模块
 *   方法封装
 */
import stringConfig from "../../../../../../../tools/stringConfig.js";
import bizPublicMethod from "../../../../../../businessTools/bizPublicMethod.js"
import bizPublicSaveMethod from "../../../../../../businessTools/bizPublicSaveMethod.js"
import custInfoModel  from "../../common/cust-info-model"

//开户和非开户 字段数据加载 公共操作
const bizCustBeneficiaryInfoNodeBeforeLoadBizCommon = (_this) => {
    
    //过滤证件类型
    let saveGroupId = _this.userType == "2" ? "ORG_INFO" : "RELA_INFO";

    let dictItem = _this["oppBusiData"]["VALID_ID_TYPE_FOR_BOTH"] || 
                    ( _this.groupDatas[saveGroupId].ORG_CONTROLER_INFO 
                    &&_.map(_this.groupDatas[saveGroupId].ORG_CONTROLER_INFO[0].FIELDS.CONTROLER_ID_TYPE.FIELD_DICT_NAME, 'DICT_ITEM')) || []
    _this.groupDatas[saveGroupId].CUST_BENEFICIARY_INFO[0].FIELDS.BENEFICIARY_ID_TYPE.FIELD_DICT_FILTER = _.filter(dictItem, function (item) {
        return item.charAt(0) == '0'
    })

    _this.groupDatas.RELA_INFO.CUST_BENEFICIARY_INFO[0].MODULE_READ = "0";
    _this.groupDatas.RELA_INFO.CUST_BENEFICIARY_INFO[0].MODULE_ADD = "0"

    _this.oppBusiData.POLICE_BTN_BENEFICIARY = _this.$blMethod.getJsonSessionBusiCommParam(_this, "POLICE_BTN_BENEFICIARY") || "0";
    if (_this.oppBusiData.POLICE_BTN_BENEFICIARY == "1") {
        _this.groupDatas.RELA_INFO.CUST_BENEFICIARY_INFO[0].MODULE_CUSTOMIZE = "1";
        _this.groupDatas.RELA_INFO.CUST_BENEFICIARY_INFO[0].MODULE_CUSTOMIZE_TXT = "公安联网校验";
    }
    _this.groupDatasTpl.RELA_INFO.CUST_BENEFICIARY_INFO[0] = _.cloneDeep(_this.groupDatas.RELA_INFO.CUST_BENEFICIARY_INFO[0]);
}

export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizCustBeneficiaryInfoNodeBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     *@Date: 2019-06-11 15:19:09
     */
    bizCustBeneficiaryInfoNodeBeforeLoadBiz: function (_this) {
        bizCustBeneficiaryInfoNodeBeforeLoadBizCommon(_this)
        let custBeneficiaryInfo = custInfoModel.getOriginaBeneficiaryInfo(_this.oppBusiData.oldBusiData);
        bizPublicMethod.$blMethod.parseMoudleArray(_this, _this.groupDatas.RELA_INFO["CUST_BENEFICIARY_INFO"], custBeneficiaryInfo);
        _this.groupDatas.RELA_INFO.CUST_BENEFICIARY_INFO.forEach(function(field){
            field.MODULE_ADD = "0";
            field.FIELDS.IS_SELF.FIELED_CHECKBOX_BOTTON = true;
            field.FIELDS.IS_SELF.multiple = true;
            field.FIELDS.IS_SELF.labelWidth = 200;
            field.FIELDS.IS_SELF.FIELED_CHECKBOX_BOTTON = true;
            field.FIELDS.IS_SELF.FIELD_RADIO_TYPE = false;  //false为单选
            if( field.FIELDS.BENEFICIARY_RELA.DEFAULT_VALUE == "0Z" ){
                field.FIELDS.IS_SELF.DEFAULT_VALUE = "1";
            }
            if ( field.FIELDS.BENEFICIARY_RELA.DEFAULT_VALUE && field.FIELDS.BENEFICIARY_RELA.DEFAULT_VALUE != "0Z") {
                field.FIELDS.IS_SELF.DEFAULT_VALUE = "0";
                field.MODULE_DELETE = "1";
            }
        })
    },
    bizCustBeneficiaryInfoNodeBeforeLoadBizOpenAcct: function (_this) {
        bizCustBeneficiaryInfoNodeBeforeLoadBizCommon(_this)
        _this.groupDatas.RELA_INFO.CUST_BENEFICIARY_INFO[0].MODULE_ADD = "0";
        _this.groupDatas.RELA_INFO.CUST_BENEFICIARY_INFO[0].FIELDS.IS_SELF.FIELED_CHECKBOX_BOTTON = true;
        _this.groupDatas.RELA_INFO.CUST_BENEFICIARY_INFO[0].FIELDS.IS_SELF.multiple = false;
        _this.groupDatas.RELA_INFO.CUST_BENEFICIARY_INFO[0].FIELDS.IS_SELF.labelWidth = 200;
        _this.groupDatas.RELA_INFO.CUST_BENEFICIARY_INFO[0].FIELDS.IS_SELF.FIELED_CHECKBOX_BOTTON = true;
        _this.groupDatas.RELA_INFO.CUST_BENEFICIARY_INFO[0].FIELDS.IS_SELF.FIELD_RADIO_TYPE = false;  //false为单选
        _this.groupDatasTpl.RELA_INFO.CUST_BENEFICIARY_INFO[0] = _.cloneDeep(_this.groupDatas.RELA_INFO.CUST_BENEFICIARY_INFO[0]);
    },
    /*
     *@method bizCustBeneficiaryInfoNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     *@Date: 2019-06-13 09:42:56
     */
    bizCustBeneficiaryInfoNodeAfterLoadBiz: function (_this) {
        //重新解析历史数据
        if(_this.historyData && _this.historyData.RELA_INFO ){
            let custBeneficiaryInfo = _.get(_this.historyData, "RELA_INFO.CUST_BENEFICIARY_INFO", {});
            if (!_.isEmpty(custBeneficiaryInfo)) {
                bizPublicMethod.$blMethod.parseMoudleArray(_this, _this.groupDatas.RELA_INFO["CUST_BENEFICIARY_INFO"], custBeneficiaryInfo)
            }
        }
        // 由于上面 bizPublicMethod.$blMethod.parseMoudleArray 把模块的 MODULE_ADD 赋值为 1，此处将其改回 0
        _.each(_this.groupDatas.RELA_INFO.CUST_BENEFICIARY_INFO, (item) => {
            item.MODULE_ADD = "0";
        })
    },
    /*
     *@method bizCustBeneficiaryInfoNodeBeforeSave
     *@desc 钩子函数 自定义保存数
     *@Date: 2019-06-11 15:19:09
     */
    bizCustBeneficiaryInfoNodeBeforeSave: function (_this, params) {
        let custBeneficiaryInfo = bizPublicSaveMethod.getModuleArrFoyKey(_this, "CUST_BENEFICIARY_INFO",true);
        let custBeneficiaryInfoFields = _this.groupDatas.RELA_INFO.CUST_BENEFICIARY_INFO[0].FIELDS;
        let busiData = _this.historyData || {};
        let relaInfo = busiData.RELA_INFO || {};
        let CUST_CARD_INFO = _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].FIELDS;
        let CUST_EXPERIENCE_INFO = _this.groupDatas.CUST_INFO.CUST_EXPERIENCE_INFO[0].FIELDS;
        let CUST_LINK_INFO = _this.groupDatas.LINK_INFO.CUST_LINK_INFO[0].FIELDS;
        //添加本人的其他信息
        _.merge(custBeneficiaryInfo[0], {
            BENEFICIARY_RELA: "0Z",
            BENEFICIARY_NAME: _.get(CUST_CARD_INFO, "CUST_FNAME.DEFAULT_VALUE", ""),
            BENEFICIARY_ID_TYPE: _.get(CUST_CARD_INFO, "ID_TYPE.DEFAULT_VALUE", ""),
            BENEFICIARY_ID: _.get(CUST_CARD_INFO, "ID_CODE.DEFAULT_VALUE", ""),
            BENEFICIARY_EXP_DATE: _.get(CUST_CARD_INFO, "ID_EXP_DATE.DEFAULT_VALUE", ""),
            BENEFICIARY_TEL:  _.get(CUST_LINK_INFO, "MOBILE_TEL.DEFAULT_VALUE", ""),
            EMAIL: _.get(CUST_LINK_INFO, "EMAIL.DEFAULT_VALUE", ""),
            NATION: _.get(CUST_EXPERIENCE_INFO, "CITIZENSHIP.DEFAULT_VALUE", ""),
            OCCU_TYPE: _.get(CUST_EXPERIENCE_INFO, "OCCU_TYPE.DEFAULT_VALUE", ""),
            ZIP_CODE: _.get(CUST_LINK_INFO, "ZIP_CODE.DEFAULT_VALUE", ""),
            SEX: _.get(CUST_CARD_INFO, "SEX.DEFAULT_VALUE", ""),
            BIRTHDAY: _.get(CUST_CARD_INFO, "BIRTHDAY.DEFAULT_VALUE", ""),
            BENEFICIARY_ADDR: _.get(CUST_LINK_INFO, "ADDRESS.DEFAULT_VALUE", ""),
        })
        relaInfo.CUST_BENEFICIARY_INFO = _.cloneDeep(custBeneficiaryInfo);
        let isOpenAcct = _this.$storage.getJsonSession(_this.$definecfg.IS_OPEN_ACCT_BIZ);
        if(isOpenAcct == "0"){
            relaInfo.CUST_BENEFICIARY_INFO.forEach(function(item){
                item.OPER_TYPE =  "0";
            });
        }
        if( _this.busiCode == "V0049" || _this.busiCode == "V0163") {
            let oldData = custInfoModel.getOriginaBeneficiaryInfo(_this.oppBusiData.oldBusiData);
            _.each(oldData, (item, key) => {
                if (item.BENEFICIARY_RELA == "0Z") {
                    oldData[key].IS_SELF = "1";
                }
                if (item.BENEFICIARY_RELA && item.BENEFICIARY_RELA != "0Z") {
                    oldData[key].IS_SELF = "0";
                }
            })
            
            //审核端展示的信息过滤
            let ygtFieldIgore = "SEX,BIRTHDAY,BENEFICIARY_EXP_DATE,NATION,OCCU_TYPE,BENEFICIARY_ADDR,BENEFICIARY_ADDRESS,ZIP_CODE,EMAIL,BENEFICIARY_TEL,BENEFICIARY_NAME,BENEFICIARY_ID_TYPE,BENEFICIARY_ID";
            let dataYGT = bizPublicMethod.$blMethod.getArrDiff(custBeneficiaryInfo, oldData, "BENEFICIARY_NO");
            dataYGT.INFO = _.each(dataYGT.INFO, item => {
                if (item.OPER_TYPE == "2") {
                    return true
                }
                item.DIFF_INFO = _.filter(item.DIFF_INFO, diffInfoItem => { return diffInfoItem.FIELD == "BENEFICIARY_RELA"})
            })
            //vtm 对比页面展示
            let fieldIgore = "BENEFICIARY_RELA,SEX,BIRTHDAY,BENEFICIARY_EXP_DATE,NATION,OCCU_TYPE,BENEFICIARY_ADDR,BENEFICIARY_ADDRESS,ZIP_CODE,EMAIL,BENEFICIARY_TEL,IS_SELF";
            let fieldIgoreArr = fieldIgore.split(",");
            let data1 = bizPublicMethod.$blMethod.getArrDiff(custBeneficiaryInfo, oldData, "BENEFICIARY_NO", fieldIgore);
            data1.INFO = _this.$blMethod.addDiffAttArr(custBeneficiaryInfoFields, _.cloneDeep(data1.INFO));
            dataYGT.SHOW_INFO = _.each(data1.INFO, infoItem => {
                infoItem.deleteDiff = _.filter(infoItem.deleteDiff, deleteDiffItem => {
                    return fieldIgoreArr.indexOf(deleteDiffItem.FIELD) == -1
                })
            })
            //对比页面的展示（跟审核端不一样 所以区分开）

            relaInfo.CUST_BENEFICIARY_CHANGE_INFO = dataYGT;
            Object.assign(params, {
                CUST_BENEFICIARY_INFO: relaInfo.CUST_BENEFICIARY_CHANGE_INFO.INFO,
                //银河影像配置需要 本人“0” 非本人“1” 修改资料只能是本人
                BENEFICIARY_IMG_IS_MUST: "0",
            });
        }
        params.RELA_INFO = params.RELA_INFO || {};
        Object.assign(params.RELA_INFO, relaInfo);
        return params;
    },
    /*
     *@method bizCustBeneficiaryInfoNodeAfterSave
     *@desc 钩子函数 自定义保存数
     */
    bizCustBeneficiaryInfoNodeAfterSave: (_this, newData) => {
    },
    /*
     *@method bizCustBeneficiaryInfoNodeValidate
     *@desc 钩子函数 下一步验证
     *@Date: 2019-06-11 15:19:09
     */
    bizCustBeneficiaryInfoNodeValidate: function (_this) {
        //是否存在非本人数据

        let CUST_BENEFICIARY_INFO = _this.groupDatas.RELA_INFO.CUST_BENEFICIARY_INFO;
        let fieldArr = ["BENEFICIARY_ID", "IS_SELF"];
        let promiseArr = [];
        _.each(CUST_BENEFICIARY_INFO, (item, key) => {
            _.each(fieldArr, fieldId => {
                let fieldData = CUST_BENEFICIARY_INFO[key].FIELDS;
                let field = CUST_BENEFICIARY_INFO[key].FIELDS[fieldId];
                let fieldFn = field.FIELD_FUNCTION;
                _this.busiLogic[fieldFn] && promiseArr.push(_this.busiLogic[fieldFn](_this, field, fieldData));
            })
        })
        return Promise.all(promiseArr).then( (res)=> {
            if (_.includes(res, false)) {
                return false
            }
        })
    }, 
    /*
     *@method bizCustBeneficiaryInfoNodePageActivated
     *@desc 钩子函数：页面激活
     *@Date: 2019-06-11 15:19:09
     */
    bizCustBeneficiaryInfoNodePageActivated: function (_this) {
        //关系 如果为空值 则默认为本人
        let BENEFICIARY_RELA = _.get(_this.groupDatas, "RELA_INFO.CUST_BENEFICIARY_INFO[0].FIELDS.BENEFICIARY_RELA.DEFAULT_VALUE", "");
        let beneficiaryDictFilter = _.get(_this.groupDatas, "RELA_INFO.CUST_BENEFICIARY_INFO[0].FIELDS.BENEFICIARY_RELA.FIELD_DICT_FILTER", []);
        if (!BENEFICIARY_RELA && beneficiaryDictFilter.indexOf("0Z") > -1) {
            _this.groupDatas.RELA_INFO.CUST_BENEFICIARY_INFO[0].FIELDS.BENEFICIARY_RELA.DEFAULT_VALUE = "0Z";
        }
        if (_this.moduleId && _this.moduleId.indexOf("CUST_BENEFICIARY_INFO") > -1) {
            //三要素空 提示 保存
            _this.removeFlowTip("benThreeTip");
            if (!checkThreeSelf(_this)) {
                _this.pushFlowTip( {
                    title: "已经根据本人信息，自动填充受益人三要素，请点击本页面【保存修改】进行确认",
                    type: "warning",
                    key: "benThreeTip"
                } )
            }
        }
    },

    bizCustBeneficiaryInfoNodePreValidate: function(_this) {
    },
    /**
     * 检查受益人是否为本人 （仅供 V0052 开户业务调用）
     * @param _this 
     * @returns 
     */
    CHECK_BENEFICIARY_IS_SELF_OPEN_BIZ: (_this, field, fieldData) => {
        //是否存在非本人数据
        _this.$refs.flowTip.removeFlowTip("beneficiaryIsNotSelf");
        if (!field.DEFAULT_VALUE) {
            return false;
        }
        // DEFAULT_VALUE = 1 表示受益人为本人，DEFAULT_VALUE = 0 表示受益人非本人
        let isSelf = field.DEFAULT_VALUE === "1";
        if (!isSelf) {
            _this.$refs.flowTip.pushFlowTip({
                title:"账户受益人不为本人，请您前往柜台办理。",
                type:'error',
                key:'beneficiaryIsNotSelf'
            });
            return false;
        }
    },
    CHECK_BENEFICIARY_IS_SELF: (_this, field, fieldData, moduleItem) => {
        if (field.DEFAULT_VALUE == "1") {
            let CUST_CARD_INFO = _.get(_this.groupDatas, "CUST_INFO.CUST_CARD_INFO[0].FIELDS", {});
            let CUST_LINK_INFO = _.get(_this.groupDatas, "LINK_INFO.CUST_LINK_INFO[0].FIELDS", {});
            fieldData.BENEFICIARY_RELA.DEFAULT_VALUE = "0Z";
            fieldData.BENEFICIARY_NAME.DEFAULT_VALUE = CUST_CARD_INFO.CUST_FNAME.DEFAULT_VALUE || "";
            fieldData.BENEFICIARY_ID_TYPE.DEFAULT_VALUE = CUST_CARD_INFO.ID_TYPE.DEFAULT_VALUE || "";
            fieldData.BENEFICIARY_ID.DEFAULT_VALUE = CUST_CARD_INFO.ID_CODE.DEFAULT_VALUE || "";
            fieldData.BENEFICIARY_TEL.DEFAULT_VALUE = CUST_LINK_INFO.MOBILE_TEL.DEFAULT_VALUE || "";
        }

        
        let CUST_BENEFICIARY_INFO = _this.groupDatas.RELA_INFO.CUST_BENEFICIARY_INFO;
        let moreSelf = _.filter(CUST_BENEFICIARY_INFO, item => {
            return item.FIELDS.IS_SELF.DEFAULT_VALUE == "1";
        }) || [];
        let custBeneficiaryInfo = custInfoModel.getOriginaBeneficiaryInfo(_this.oppBusiData.oldBusiData) || [];
        _.each(CUST_BENEFICIARY_INFO, (item, key) => {
            CUST_BENEFICIARY_INFO[key].FIELDS.BENEFICIARY_NAME.FIELD_CONTROL = "1";
            CUST_BENEFICIARY_INFO[key].FIELDS.BENEFICIARY_ID_TYPE.FIELD_CONTROL = "1";
            CUST_BENEFICIARY_INFO[key].FIELDS.BENEFICIARY_ID.FIELD_CONTROL = "1";
            CUST_BENEFICIARY_INFO[key].MODULE_DELETE = "0";
            let itemBENEFICIARY_NO = item.FIELDS.BENEFICIARY_NO.DEFAULT_VALUE || "";
            let infoItem = _.find(custBeneficiaryInfo, {BENEFICIARY_NO: itemBENEFICIARY_NO}) || {};
            if (item.FIELDS.IS_SELF.DEFAULT_VALUE == "0" && !_.isEmpty(infoItem) && infoItem.BENEFICIARY_RELA != "0Z") {
                CUST_BENEFICIARY_INFO[key].FIELDS.BENEFICIARY_NAME.DEFAULT_VALUE = infoItem.BENEFICIARY_NAME || "";
                CUST_BENEFICIARY_INFO[key].FIELDS.BENEFICIARY_ID_TYPE.DEFAULT_VALUE = infoItem.BENEFICIARY_ID_TYPE || "";
                CUST_BENEFICIARY_INFO[key].FIELDS.BENEFICIARY_ID.DEFAULT_VALUE = infoItem.BENEFICIARY_ID || "";
                CUST_BENEFICIARY_INFO[key].FIELDS.BENEFICIARY_NAME.FIELD_CONTROL = "2";
                CUST_BENEFICIARY_INFO[key].FIELDS.BENEFICIARY_ID_TYPE.FIELD_CONTROL = "2";
                CUST_BENEFICIARY_INFO[key].FIELDS.BENEFICIARY_ID.FIELD_CONTROL = "2";
            }
            //受益人 存在本人 且为系统内数据 则 置灰 非本人
            if (CUST_BENEFICIARY_INFO[key].FIELDS.IS_SELF.DEFAULT_VALUE == "1" && !_.isEmpty(infoItem) && infoItem.BENEFICIARY_RELA == "0Z") {
                let fieldDictName = _.cloneDeep(field.FIELD_DICT_NAME) || {};
                fieldDictName = _.map(fieldDictName, item => {
                    item.disabled = item.DICT_ITEM == "0"  ? true : false;
                    return item;
                })
                CUST_BENEFICIARY_INFO[key].FIELDS.IS_SELF.FIELD_DICT_NAME = fieldDictName;
            }
            //有受益人有本人 则置灰非本人按钮 没有则不置灰
            if (CUST_BENEFICIARY_INFO[key].FIELDS.IS_SELF.DEFAULT_VALUE != "1") {
                let fieldDictName = _.cloneDeep(field.FIELD_DICT_NAME) || {};
                fieldDictName = _.map(fieldDictName, item => {
                    item.disabled = (!_.isEmpty(moreSelf) && item.DICT_ITEM == "1") ? true : false;
                    return item;
                })
                //如果只有一个受益人信息 则不显示 删除按钮
                if (CUST_BENEFICIARY_INFO.length > 1) {
                    CUST_BENEFICIARY_INFO[key].MODULE_DELETE = "1";
                }
                CUST_BENEFICIARY_INFO[key].FIELDS.IS_SELF.FIELD_DICT_NAME = fieldDictName;
            }
        })

        //是否存在非本人数据
        _this.$refs.flowTip.removeFlowTip("beneficiaryHasNoSelf");
        let beneficiaryModuleArr = _.get(_this.groupDatas, "RELA_INFO.CUST_BENEFICIARY_INFO", []);
        let hasNoSelf = _.find(beneficiaryModuleArr, item => {
            return item.FIELDS.IS_SELF.DEFAULT_VALUE == "0";
        })
        if (!_.isEmpty(hasNoSelf)) {
            _this.$refs.flowTip.pushFlowTip({
                title:"账户受益人有非本人，请您前往柜台办理。",
                type:'error',
                key:'beneficiaryHasNoSelf'
            });
            return false;
        }
        //是否重复添加本人
        _this.$refs.flowTip.removeFlowTip("beneficiaryMoreSelf");
        if (moreSelf.length > 1) {
            _this.$nextTick(() => {
                _this.$refs.flowTip.pushFlowTip({
                    title:"已经有本人受益人信息，不能重复添加",
                    type:'error',
                    key:'beneficiaryMoreSelf'
                });
            })
            return false;
        }
        
    },
    //----------------------业务函数----------------------------------//
    
    CHECK_BENEFICIARY_ID_TYPE: (_this, field, fieldData) => {
        _this.$blMethod.setValidType(_this, field, fieldData, "BENEFICIARY_ID");
    },
    CHECK_BENEFICIARY_ID: (_this, field, fieldData) => {
        let defaultValue = field.DEFAULT_VALUE || "";
        let rela = fieldData.BENEFICIARY_RELA.DEFAULT_VALUE || "";
        if (rela != '0Z' && defaultValue) {
            let existFlag = _this.$blMethod.checkIdCodeIsExisted(_this, field, "受益人证件号码已经存在，不能重复添加");
            if (existFlag) {
                return false;
            }
            if (defaultValue == _.get(_this.groupDatas, "CUST_INFO.CUST_CARD_INFO[0].FIELDS.ID_CODE.DEFAULT_VALUE", "")) {
                _this.$nextTick(() => {
                    _this.$blMethod.changeFieldError(field, false, "非本人时，受益人的证件号码不能是本人证件号码");
                })
                return false;
            }
        }
        
    },
    bizCustBeneficiaryInfoNodeAddModuleFinished:function(_this , modulelData){
        modulelData.FIELDS.IS_SELF.FIELD_CONTROL = "0";
        modulelData.FIELDS.IS_SELF.multiple = true;
        modulelData.FIELDS.IS_SELF.labelWidth = 200;
        modulelData.FIELDS.IS_SELF.FIELD_RADIO_TYPE = false;  //false为单选
        modulelData.FIELDS.IS_SELF.FIELED_CHECKBOX_BOTTON = true;
        modulelData.FIELDS.IS_SELF.DEFAULT_VALUE = "";
        modulelData.MODULE_ADD = "0";
    },
    BENEFICIARYINFO_DELETE_MODULE_FINISHED: (_this, fieldData) => {
        let CUST_BENEFICIARY_INFO = _this.groupDatas.RELA_INFO.CUST_BENEFICIARY_INFO;
        let fieldArr = ["BENEFICIARY_ID", "IS_SELF"];
        let promiseArr = [];
        _.each(CUST_BENEFICIARY_INFO, (item, key) => {
            CUST_BENEFICIARY_INFO[key].MODULE_ADD = "0";
            _.each(fieldArr, fieldId => {
                let fieldData = CUST_BENEFICIARY_INFO[key].FIELDS;
                let field = CUST_BENEFICIARY_INFO[key].FIELDS[fieldId];
                let fieldFn = field.FIELD_FUNCTION;
                _this.busiLogic[fieldFn] && promiseArr.push(_this.busiLogic[fieldFn](_this, field, fieldData));
            })
        })
        return Promise.all(promiseArr).then( (res)=> {
            if (_.includes(res, false)) {
                return false
            }
        })
    },
    //信息列表校验
    bizCustBeneficiaryInfoNodeCheckModule: (_this, moduleIdArr) => {
        if (moduleIdArr.indexOf("CUST_BENEFICIARY_INFO") > -1) {
            return checkThreeSelf(_this) && isSelfInfo(_this);
        }
        return true;
    }
}
//是否为本人信息
const isSelfInfo = (_this) => {
    let CUST_BENEFICIARY_INFO_ARR = _this.groupDatas.RELA_INFO.CUST_BENEFICIARY_INFO;
    let beneficiaryHavNotIsSelf = !_.isEmpty(_.find(CUST_BENEFICIARY_INFO_ARR, moduleItem => {
        return _.get(moduleItem, "FIELDS.IS_SELF.DEFAULT_VALUE", "") != "1"
    }))
    if (beneficiaryHavNotIsSelf) {
        return false;
    }
    return true;
}
//本人的时候 判断是否有缺失的三要素信息
const checkThreeSelf = (_this) => {
    let oldData = custInfoModel.getOriginaBeneficiaryInfo(_this.oppBusiData.oldBusiData) || [];
    let newData = _.get(_this.historyData, "RELA_INFO.CUST_BENEFICIARY_INFO", []);
    if (_.isEmpty(newData) && oldData.length == 1 && oldData[0].BENEFICIARY_RELA == "0Z") {
        let oldDataItem = oldData[0] || {};
        if (_.isEmpty(oldDataItem.BENEFICIARY_NAME) || _.isEmpty(oldDataItem.BENEFICIARY_ID_TYPE) || _.isEmpty(oldDataItem.BENEFICIARY_ID) ) {
            return false;
        }
    }
    return true;
}
//字段属性设置
const setFieldsAtt = (_this, FIELDS, fieldId, att, value) => {
    let field = _.get(FIELDS, fieldId, {});
    if (!_.isEmpty(field)) {
        FIELDS[fieldId][att] = value;
    }
}