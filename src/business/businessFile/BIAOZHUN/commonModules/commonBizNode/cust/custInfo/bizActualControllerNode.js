/*
 *   实际控制人
 *   方法封装
 */

import date from '../../../../../../../tools/date.js'
import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../../business/businessTools/bizPublicMethod.js"
import custInfoModel from "../../common/cust-info-model"
const bizActualControllerNodeBeforeLoadBizCommon = function (_this) { 
}
export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizActualControllerNodeBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizActualControllerNodeBeforeLoadBiz: function (_this) {
        bizActualControllerNodeBeforeLoadBizCommon(_this)
        let controlerInfo = custInfoModel.getOriginaCustControlerInfo(_this.oppBusiData.oldBusiData);
        bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["CUST_CONTROLER_INFO"], controlerInfo[0] || {});
        _this.groupDatas.RELA_INFO.CUST_CONTROLER_INFO[0].FIELDS.IS_SELF.labelWidth = 200;
        _this.groupDatas.RELA_INFO.CUST_CONTROLER_INFO[0].FIELDS.IS_SELF.FIELED_CHECKBOX_BOTTON = true;
        _this.groupDatas.RELA_INFO.CUST_CONTROLER_INFO[0].FIELDS.IS_SELF.FIELD_RADIO_TYPE = false;  //false为单选

        let controlerRelation = _.get(_this.groupDatas, "RELA_INFO.CUST_CONTROLER_INFO[0].FIELDS.CONTROLER_RELATION.DEFAULT_VALUE", "");
        if (controlerRelation == "0Z") {
            _this.groupDatas.RELA_INFO.CUST_CONTROLER_INFO[0].FIELDS.IS_SELF.DEFAULT_VALUE = "1";
        }
        if (controlerRelation && controlerRelation != "0Z") {
            _this.groupDatas.RELA_INFO.CUST_CONTROLER_INFO[0].FIELDS.IS_SELF.DEFAULT_VALUE = "0";
        }
    },
    bizActualControllerNodeBeforeLoadBizOpenAcct: function (_this) {
        bizActualControllerNodeBeforeLoadBizCommon(_this);
        _this.groupDatas.RELA_INFO.CUST_CONTROLER_INFO[0].MODULE_ADD = "0";
        _this.groupDatas.RELA_INFO.CUST_CONTROLER_INFO[0].FIELDS.IS_SELF.labelWidth = 200;
        _this.groupDatas.RELA_INFO.CUST_CONTROLER_INFO[0].FIELDS.IS_SELF.FIELED_CHECKBOX_BOTTON = true;
        _this.groupDatas.RELA_INFO.CUST_CONTROLER_INFO[0].FIELDS.IS_SELF.FIELD_RADIO_TYPE = false;  //false为单选
        _this.groupDatasTpl.RELA_INFO.CUST_CONTROLER_INFO[0] = _.cloneDeep(_this.groupDatas.RELA_INFO.CUST_CONTROLER_INFO[0]);
    },
    /*
     *@method bizActualControllerNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-13 09:42:56
     */
    bizActualControllerNodeAfterLoadBiz: function (_this) {
        //重新解析历史数据
        if (_this.historyData && _this.historyData.RELA_INFO) {
            let controlerInfo = _.get(_this.historyData, "RELA_INFO.CUST_CONTROLER_INFO", {});
            if (!_.isEmpty(controlerInfo)) {
                bizPublicMethod.$blMethod.parseMoudleArray(_this, _this.groupDatas.RELA_INFO["CUST_CONTROLER_INFO"], controlerInfo);
            }
        }
        // 由于上面 bizPublicMethod.$blMethod.parseMoudleArray 把模块的 MODULE_ADD 赋值为 1，此处将其改回 0
        _.each(_this.groupDatas.RELA_INFO.CUST_CONTROLER_INFO, (item) => {
            item.MODULE_ADD = "0";
        })
        //证件号码过滤
        _this.groupDatas.RELA_INFO.CUST_CONTROLER_INFO[0].FIELDS.CONTROLER_ID_TYPE.FIELD_DICT_FILTER = _this["oppBusiData"]["VALID_ID_TYPE_FOR_PERSON"];
    },
    /*
     *@method bizActualControllerNodeBeforeSave
     *@desc 钩子函数 自定义保存数
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizActualControllerNodeBeforeSave: async function (_this, params) {
        let custControlerInfo = bizPublicSaveMethod.getModuleArrFoyKey(_this, "CUST_CONTROLER_INFO", true);
        let custControlerInfoFields = _this.groupDatas.RELA_INFO.CUST_CONTROLER_INFO[0].FIELDS;

        let busiData = _this.historyData || {};
        let relaInfo = busiData.RELA_INFO || {};
        let CUST_CARD_INFO = _this.groupDatas.CUST_INFO.CUST_CARD_INFO[0].FIELDS;
        let CUST_EXPERIENCE_INFO = _this.groupDatas.CUST_INFO.CUST_EXPERIENCE_INFO[0].FIELDS;
        let CUST_LINK_INFO = _this.groupDatas.LINK_INFO.CUST_LINK_INFO[0].FIELDS;
        //添加本人的其他信息
        _.merge(custControlerInfo[0], {
            CONTROLER_RELATION: "0Z",
            CONTROLER_NAME: _.get(CUST_CARD_INFO, "CUST_FNAME.DEFAULT_VALUE", ""),
            CONTROLER_ID_TYPE: _.get(CUST_CARD_INFO, "ID_TYPE.DEFAULT_VALUE", ""),
            CONTROLER_ID_NO: _.get(CUST_CARD_INFO, "ID_CODE.DEFAULT_VALUE", ""),
            CONTROLER_ID_EXP_DATE: _.get(CUST_CARD_INFO, "ID_EXP_DATE.DEFAULT_VALUE", ""),
            CONTROLER_TEL:  _.get(CUST_LINK_INFO, "MOBILE_TEL.DEFAULT_VALUE", ""),
            CONTROLER_EMAIL: _.get(CUST_LINK_INFO, "EMAIL.DEFAULT_VALUE", ""),
            NATION: _.get(CUST_EXPERIENCE_INFO, "CITIZENSHIP.DEFAULT_VALUE", ""),
            OCCU_TYPE: _.get(CUST_EXPERIENCE_INFO, "OCCU_TYPE.DEFAULT_VALUE", ""),
            ZIP_CODE: _.get(CUST_LINK_INFO, "ZIP_CODE.DEFAULT_VALUE", ""),
            CONTROLER_SEX: _.get(CUST_CARD_INFO, "SEX.DEFAULT_VALUE", ""),
            REG_DATE: _.get(CUST_CARD_INFO, "BIRTHDAY.DEFAULT_VALUE", ""),
            REG_ADDR: _.get(CUST_LINK_INFO, "ADDRESS.DEFAULT_VALUE", ""),
        })
        relaInfo.CUST_CONTROLER_INFO = _.cloneDeep(custControlerInfo);
        let isOpenAcct = _this.$storage.getJsonSession(_this.$definecfg.IS_OPEN_ACCT_BIZ);
        if(isOpenAcct == "0"){
            relaInfo.CUST_CONTROLER_INFO.forEach(function(item){
                item.OPER_TYPE =  "0";
            });
        }
        if (_this.busiCode == "V0049" || _this.busiCode == "V0163") {
            let oldData = custInfoModel.getOriginaCustControlerInfo(_this.oppBusiData.oldBusiData);
            _.each(oldData, (item, key) => {
                if (item.CONTROLER_RELATION == "0Z") {
                    oldData[key].IS_SELF = "1";
                }
                if (item.CONTROLER_RELATION && item.CONTROLER_RELATION != "0Z") {
                    oldData[key].IS_SELF = "0";
                }
            })
            
            //审核端展示的信息过滤
            let ygtFieldIgore = "CONTROLER_SEX,REG_DATE,CONTROLER_ID_EXP_DATE,CONTROLER_TEL,CONTROLER_EMAIL,NATION,OCCU_TYPE,REG_ADDR,ZIP_CODE,CONTROLER_NAME,CONTROLER_ID_TYPE,CONTROLER_ID_NO";
            let dataYGT = bizPublicMethod.$blMethod.getArrDiff(custControlerInfo, oldData, "CONTROLER_NUM");
            // dataYGT.INFO = _this.$blMethod.addDiffAttArr(custControlerInfoFields, _.cloneDeep(dataYGT.INFO));
            dataYGT.INFO = _.each(dataYGT.INFO, item => {
                if (item.OPER_TYPE == "2") {
                    return true
                }
                item.DIFF_INFO = _.filter(item.DIFF_INFO, diffInfoItem => { return diffInfoItem.FIELD == "CONTROLER_RELATION"})
            })
            //vtm 对比页面展示
            let fieldIgore = "CONTROLER_RELATION,CONTROLER_SEX,REG_DATE,CONTROLER_ID_EXP_DATE,CONTROLER_TEL,CONTROLER_EMAIL,NATION,OCCU_TYPE,REG_ADDR,ZIP_CODE,IS_SELF";
            let data1 = bizPublicMethod.$blMethod.getArrDiff(custControlerInfo, oldData, "CONTROLER_NUM", fieldIgore)
            dataYGT.SHOW_INFO = _this.$blMethod.addDiffAttArr(custControlerInfoFields, _.cloneDeep(data1.INFO));
            relaInfo.CUST_CONTROLER_CHANGE_INFO = dataYGT
            Object.assign(params, {
                CUST_CONTROLER_INFO: relaInfo.CUST_CONTROLER_CHANGE_INFO.INFO,
                CUST_CONTROLLER_INFO: relaInfo.CUST_CONTROLER_CHANGE_INFO.INFO, //中台转数据 将这个字段转为CUST_CONTROLER_INFO
                //银河影像配置需要 本人“0” 非本人“1” 修改资料只能是本人
                CONTROLLER_IMG_IS_MUST: "0",
            });
        }
        params.RELA_INFO = params.RELA_INFO || {};
        Object.assign(params.RELA_INFO, relaInfo);
        return params;
    },
    bizActualControllerNodeAfterSave: (_this, newData) => {
    },
    /*
     *@method bizActualControllerNodeValidate
     *@desc 钩子函数 下一步验证
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizActualControllerNodeValidate: async function (_this) {

        let CUST_CONTROLER_INFO = _this.groupDatas.RELA_INFO.CUST_CONTROLER_INFO;
        let fieldArr = ["CONTROLER_ID_NO", "IS_SELF"];
        let promiseArr = [];
        _.each(CUST_CONTROLER_INFO, (item, key) => {
            _.each(fieldArr, fieldId => {
                let fieldData = CUST_CONTROLER_INFO[key].FIELDS;
                let field = CUST_CONTROLER_INFO[key].FIELDS[fieldId];
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
     *@method bizActualControllerNodePageActivated
     *@desc 钩子函数：页面激活
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizActualControllerNodePageActivated: function (_this) {
        let BIRTHDAY = _.get(_this.groupDatas, "CUST_INFO.CUST_CARD_INFO[0].FIELDS.BIRTHDAY.DEFAULT_VALUE", 0);
        let age = date.getDifferYears(BIRTHDAY, date.getClientDate());
        let UNDER_AGE = _.get(_this.groupDatas, "CUST_INFO.CUST_CARD_INFO[0].FIELDS.UNDER_AGE.DEFAULT_VALUE")
        _this.oppBusiData.IS_DISABLE_ONESELF = true; //与本人关系为本人是否可以修改 true为不可以false为可以
               
         //与本人关系只能为非本人：未成年客户（16岁以下）、16到18岁遗产继承/公司股东
         _this.oppBusiData.UN_ONESELF_FLAG = age < 16 || (age >= 16 && age < 18 && (UNDER_AGE == "0" || UNDER_AGE == "1"));

         //与本人关系只能为本人：16到18岁有劳动收入、18以上70岁以下
         _this.oppBusiData.IS_ONESELF_FLAG = (age >= 16 && age < 18 && UNDER_AGE == "2") || (age >= 18 && age < 70);
         if (_this.moduleId && _this.moduleId.indexOf("CUST_CONTROLER_INFO") > -1) {
            //三要素空 提示 保存
            _this.removeFlowTip("conThreeTip");
            if (!checkThreeSelf(_this)) {
                _this.pushFlowTip( {
                    title: "已经根据本人信息，自动填充控制人三要素，请点击本页面【保存修改】进行确认",
                    type: "warning",
                    key: "conThreeTip"
                } )
            }
        }   
    },
    //是否是本人逻辑
    CHECK_CONTROLER_IS_SELF: (_this, field, fieldData) => {
        fieldData.CONTROLER_NAME.FIELD_CONTROL = "1";
        fieldData.CONTROLER_ID_TYPE.FIELD_CONTROL = "1";
        fieldData.CONTROLER_ID_NO.FIELD_CONTROL = "1";
        if (field.DEFAULT_VALUE == "1") {
            let CUST_CARD_INFO = _.get(_this.groupDatas, "CUST_INFO.CUST_CARD_INFO[0].FIELDS", {});
            let CUST_LINK_INFO = _.get(_this.groupDatas, "LINK_INFO.CUST_LINK_INFO[0].FIELDS", {});
            fieldData.CONTROLER_RELATION.DEFAULT_VALUE = "0Z";
            fieldData.CONTROLER_NAME.DEFAULT_VALUE = CUST_CARD_INFO.CUST_FNAME.DEFAULT_VALUE || "";
            fieldData.CONTROLER_ID_TYPE.DEFAULT_VALUE = CUST_CARD_INFO.ID_TYPE.DEFAULT_VALUE || "";
            fieldData.CONTROLER_ID_NO.DEFAULT_VALUE = CUST_CARD_INFO.ID_CODE.DEFAULT_VALUE || "";
            fieldData.CONTROLER_TEL.DEFAULT_VALUE = CUST_LINK_INFO.MOBILE_TEL.DEFAULT_VALUE || "";
        }
        if (field.DEFAULT_VALUE == "0") {
            let controlerInfoArr = custInfoModel.getOriginaCustControlerInfo(_this.oppBusiData.oldBusiData);
            let controlerInfoItem = controlerInfoArr[0] || {};
            //控制人信息 系统内有非本人的值的时候 显示 非本人信息 否则什么也不显示
            if (!_.isEmpty(controlerInfoItem) && controlerInfoItem.CONTROLER_RELATION != "0Z") {
                fieldData.CONTROLER_NAME.DEFAULT_VALUE = controlerInfoItem.CONTROLER_NAME || "";
                fieldData.CONTROLER_ID_TYPE.DEFAULT_VALUE = controlerInfoItem.CONTROLER_ID_TYPE || "";
                fieldData.CONTROLER_ID_NO.DEFAULT_VALUE = controlerInfoItem.CONTROLER_ID_NO || "";
                fieldData.CONTROLER_NAME.FIELD_CONTROL = "2";
                fieldData.CONTROLER_ID_TYPE.FIELD_CONTROL = "2";
                fieldData.CONTROLER_ID_NO.FIELD_CONTROL = "2";
            }
            _this.pushFlowTip({
                title:"账户实际控制人不为本人，请您前往柜台办理。",
                type:'error',
                key:'controlTip'
            });
            return false;
        }
        
        fieldData.CONTROLER_NAME.FIELD_CONTROL = "1";
        fieldData.CONTROLER_ID_TYPE.FIELD_CONTROL = "1";
        fieldData.CONTROLER_ID_NO.FIELD_CONTROL = "1";
        _this.removeFlowTip("controlTip");
    },

      
    /**
     * 实际控制人
     * 
     * custBasicInfo 选择的是_this内部的，可以选择session内部的，或者_this.groupDatas里面的
     */
    CHECK_CONTROLER_RELATION: (_this, field, fieldData) => {
    },
    CHECK_CONTROLER_ID_TYPE: (_this, field, fieldData) => {
        _this.$blMethod.setValidType(_this, field, fieldData, "CONTROLER_ID_NO");
    },
    CHECK_CONTROLER_ID_NO: (_this, field, fieldData) => {
        let defaultValue = field.DEFAULT_VALUE || "";
        if (fieldData.CONTROLER_RELATION.DEFAULT_VALUE != '0Z' && defaultValue) {
            let existFlag = _this.$blMethod.checkIdCodeIsExisted(_this, field, "实际控制人证件号码已经存在，不能重复添加");
            if (existFlag) {
                return false;
            }
            if (defaultValue == _.get(_this.groupDatas, "CUST_INFO.CUST_CARD_INFO[0].FIELDS.ID_CODE.DEFAULT_VALUE", "")) {
                _this.$nextTick(() => {
                    _this.$blMethod.changeFieldError(field, false, "非本人时，实际控制人的证件号码不能是本人证件号码");
                })
                return false;
            }
            let idtype = fieldData.CONTROLER_ID_TYPE.DEFAULT_VALUE || "";
            _this.$blMethod.autoSexBirthday(_this, field, fieldData, "CONTROLER_SEX", "REG_DATE", idtype);
        }
    },
    CONTROLERINFO_DELETE_MODULE_FINISHED: (_this, fieldData) => {
        _.each(_this.$refs, (item, key) => {
            if (key.indexOf("CUST_CONTROLER_INFO") > -1 && item.length > 0) {
                item[0].$refs.CONTROLER_ID_NO[0].field.message = "";
                item[0].$refs.CONTROLER_ID_NO[0].$refs.CONTROLER_ID_NO.validate("change");
            }
        })
    },
    bizActualControllerNodeCheckModule: (_this, moduleIdArr) => {
        if (moduleIdArr.indexOf("CUST_CONTROLER_INFO") > -1) {
            return checkThreeSelf(_this) && isSelfInfo(_this);
        }
        return true;
    }

}
//是否为本人信息
const isSelfInfo = (_this) => {
    let CUST_CONTROLER_INFO = _.get(_this.groupDatas, "RELA_INFO.CUST_CONTROLER_INFO[0].FIELDS", {});
    let controlerIsSelf = _.get(CUST_CONTROLER_INFO, "IS_SELF.DEFAULT_VALUE", "") == "1" ? true : false;
    if (!controlerIsSelf) {
        return false;
    }
    return true;
}
//本人的时候 判断是否有缺失的三要素信息
const checkThreeSelf = (_this) => {
    let oldData = custInfoModel.getOriginaCustControlerInfo(_this.oppBusiData.oldBusiData) || [];
    let newData = _.get(_this.historyData, "RELA_INFO.CUST_CONTROLER_INFO", []);
    if (_.isEmpty(newData) && oldData.length == 1 && oldData[0].CONTROLER_RELATION == "0Z") {
        let oldDataItem = oldData[0] || {};
        if (_.isEmpty(oldDataItem.CONTROLER_NAME) || _.isEmpty(oldDataItem.CONTROLER_ID_TYPE) || _.isEmpty(oldDataItem.CONTROLER_ID_NO) ) {
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