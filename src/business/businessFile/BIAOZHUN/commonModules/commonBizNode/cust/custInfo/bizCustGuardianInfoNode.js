/*
 *   受益人信息模块
 *   方法封装
 */

import bizPublicMethod from "../../../../../../businessTools/bizPublicMethod.js"
import bizPublicSaveMethod from "../../../../../../businessTools/bizPublicSaveMethod.js"
import * as utils from "../../../../../../../tools/util.js"
import date from "../../../../../../../tools/date.js"
import custInfoModel from "../../common/cust-info-model"
import oppService from "../../../../../../../service/opp-service"

//开户和非开户 字段数据加载 公共操作
const bizCustGuardianInfoNodeBeforeLoadBizCommon = (_this) => {
    let guardianRelationItemDict = _.map(_.get(_this.groupDatas, "RELA_INFO.CUST_GUARDIAN_INFO[0].FIELDS.GUARDIAN_RELA.FIELD_DICT_NAME", []), "DICT_ITEM");
    _this.groupDatas.RELA_INFO.CUST_GUARDIAN_INFO[0].FIELDS.GUARDIAN_RELA.FIELD_DICT_FILTER = _.filter(guardianRelationItemDict, item => {
        return item.charAt(0) == "0" && item != "0Z";
    })
    let data = getValidIdType(_this);
    // 设置证件类型字典有效证件类型
    _this.groupDatas.RELA_INFO.CUST_GUARDIAN_INFO[0].FIELDS.GUARDIAN_ID_TYPE.FIELD_DICT_NAME = _.filter(data, function (v) {
        return '0' == v.DICT_ITEM.charAt(0);
    });
    // 设置证件类型字典有效证件类型
    _this.groupDatasTpl.RELA_INFO.CUST_GUARDIAN_INFO[0].FIELDS.GUARDIAN_ID_TYPE.FIELD_DICT_NAME = _.filter(data, function (v) {
        return '0' == v.DICT_ITEM.charAt(0);
    });
    _this.groupDatas.RELA_INFO.CUST_GUARDIAN_INFO[0].MODULE_READ = "1";
    _this.groupDatasTpl.RELA_INFO.CUST_GUARDIAN_INFO[0].MODULE_READ = "1";

    
    _this.oppBusiData.POLICE_BTN_GUARDIAN = _this.$blMethod.getJsonSessionBusiCommParam(_this, "POLICE_BTN_GUARDIAN") || "0";
    if (_this.oppBusiData.POLICE_BTN_GUARDIAN == "1") {
        _this.groupDatas.RELA_INFO.CUST_GUARDIAN_INFO[0].MODULE_CUSTOMIZE = "1";
        _this.groupDatasTpl.RELA_INFO.CUST_GUARDIAN_INFO[0].MODULE_CUSTOMIZE = "1";
        _this.groupDatas.RELA_INFO.CUST_GUARDIAN_INFO[0].MODULE_CUSTOMIZE_TXT = "公安联网校验";
        _this.groupDatasTpl.RELA_INFO.CUST_GUARDIAN_INFO[0].MODULE_CUSTOMIZE_TXT = "公安联网校验";
    }
}

const getValidIdType = (_this) => {
    let custIdTypeArr = _this.oppBusiData.VALID_ID_TYPE_FOR_PERSON;
    let idTypeData = _this.groupDatas.RELA_INFO.CUST_GUARDIAN_INFO[0].FIELDS.GUARDIAN_ID_TYPE.FIELD_DICT_NAME;
    return _.filter(idTypeData, function (v) {
        var str = v.dict_val || v.DICT_ITEM;
        return _.indexOf(custIdTypeArr, str) != -1;
    });
}

export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizCustGuardianInfoNodeBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     *@Date: 2019-06-11 15:19:09
     */
    bizCustGuardianInfoNodeBeforeLoadBiz: function (_this) {
        bizCustGuardianInfoNodeBeforeLoadBizCommon(_this)
        let custGuardianInfo = custInfoModel.getOriginaCustGuardianInfo(_this.oppBusiData.oldBusiData);
        bizPublicMethod.$blMethod.parseMoudleArray(_this, _this.groupDatas.RELA_INFO["CUST_GUARDIAN_INFO"], custGuardianInfo);
    },
    bizCustGuardianInfoNodeBeforeLoadBizOpenAcct: function (_this) {
        bizCustGuardianInfoNodeBeforeLoadBizCommon(_this)
    },
    /*
     *@method bizCustGuardianInfoNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     *@Date: 2019-06-13 09:42:56
     */
    bizCustGuardianInfoNodeAfterLoadBiz: function (_this) {
        //重新解析历史数据
        if (_this.oppBusiData.newBusiData && _this.oppBusiData.newBusiData.RELA_INFO) {
            let custGuardianInfo = _.get(_this.oppBusiData.newBusiData, "RELA_INFO.CUST_GUARDIAN_INFO", {});
            if (!_.isEmpty(custGuardianInfo)) {
                bizPublicMethod.$blMethod.parseMoudleArray(_this, _this.groupDatas.RELA_INFO["CUST_GUARDIAN_INFO"], custGuardianInfo)
            }
        }
        //监护人信息：主体身份选择“1-未成年”、“3-残疾人”（自动显示，且必填），其他主体身份不需要显示，此时支持新增不超过三个
        let SUBJECT_IDENTITY = _.get(_this.groupDatas, "CUST_INFO.CUST_CARD_INFO[0].FIELDS.SUBJECT_IDENTITY.DEFAULT_VALUE", "");
        if (_.indexOf(["1", "3", "f", "h"], SUBJECT_IDENTITY) > -1) {
            _this.$router.showRoute("监护人信息")
        } else {
            _this.$router.hideRoute("监护人信息")
        }
    },
    /*
     *@method bizCustGuardianInfoNodeBeforeSave
     *@desc 钩子函数 自定义保存数
     *@Date: 2019-06-11 15:19:09
     */
    bizCustGuardianInfoNodeBeforeSave: function (_this, params) {
        let custGuardianInfo = bizPublicSaveMethod.getModuleArrFoyKey(_this, "CUST_GUARDIAN_INFO", true);
        let busiData = _this.oppBusiData.newBusiData;
        let relaInfo = busiData && busiData.RELA_INFO || {};
        relaInfo.CUST_GUARDIAN_INFO = custGuardianInfo;
        let isOpenAcct = _this.$storage.getJsonSession(_this.$definecfg.IS_OPEN_ACCT_BIZ);
        if (isOpenAcct == "1") {
            let data1 = bizPublicMethod.$blMethod.getArrDiff(custGuardianInfo, custInfoModel.getOriginaCustGuardianInfo(_this.oppBusiData.oldBusiData), "GUARDIAN_NO")
            relaInfo.CUST_GUARDIAN_CHANGE_INFO = data1
        }
        Object.assign(params.RELA_INFO, relaInfo);
    },
    /*
     *@method bizCustGuardianInfoNodeAfterSave
     *@desc 钩子函数 自定义保存数
     */
    bizCustGuardianInfoNodeAfterSave: (_this, newData) => {
        if (_this.oppBusiData.newBusiData) {
            let newObj = {
                RELA_INFO: _.get(newData, "RELA_INFO", {})
            }
            _.assign(_this.oppBusiData.newBusiData, newObj);
        }
    },
    /*
     *@method bizCustGuardianInfoNodeValidate
     *@desc 钩子函数 下一步验证
     *@Date: 2019-06-11 15:19:09
     */
    bizCustGuardianInfoNodeValidate: function (_this) {
        let custGuardianInfo = bizPublicSaveMethod.getModuleArrFoyKey(_this, "CUST_GUARDIAN_INFO", true);
        let formDataArr = [];
        _.each(custGuardianInfo, formData => {
            // 防止没有填写任何信息的情况下有误判
            if (formData.GUARDIAN_ID_TYPE && formData.GUARDIAN_ID) {
                formDataArr.push(formData.GUARDIAN_ID_TYPE + "-" + formData.GUARDIAN_ID);
            }
        })
        if (formDataArr.length && _.uniq(formDataArr).length < custGuardianInfo.length) {
            _this.alert("监护人信息的证件类型、证件号码有重复记录，请删掉重复记录！");
            return false;
        }
        return true;
    },

    /*
     *@method bizCustGuardianInfoNodePageActivated
     *@desc 钩子函数：页面激活
     *@Date: 2019-06-11 15:19:09
     */
    bizCustGuardianInfoNodePageActivated: function (_this) {

    },

    bizCustGuardianInfoNodePreValidate: function (_this) {
    },
    //----------------------业务函数----------------------------------//
    CHECK_GUARDIAN_ID_TYPE: (_this, field, fieldData) => {
        _this.$blMethod.setValidType(_this, field, fieldData, "GUARDIAN_ID");
        fieldData.GUARDIAN_ID.DEFAULT_VALUE = "";
    },
    CHECK_GUARDIAN_ID: (_this, field, fieldData) => {
        let defaultValue = field.DEFAULT_VALUE || "";
        let idType = fieldData.GUARDIAN_ID_TYPE.DEFAULT_VALUE || "";
        if (!defaultValue) {
            return;
        }
        let existFlag = _this.$blMethod.checkIdCodeIsExisted(_this, field, "监护人证件号码已经存在，不能重复添加");
        if (existFlag) {
            return;
        }
        let idCode = _.get(_this.groupDatas, "CUST_INFO.CUST_CARD_INFO[0].FIELDS.ID_CODE.DEFAULT_VALUE", "");
        if (idType == "00" || idType == "08") {
            let age = date.getDifferYears(utils.getBirthday(defaultValue), date.getClientDate()) || "";
            if (age < 18) {
                _this.$blMethod.showMsgBox(_this, "监护人不能为未成年人，请重新填写！")
                field.DEFAULT_VALUE = "";
                return;
            }
        }
        if (idCode == defaultValue) {
            _this.$blMethod.showMsgBox(_this, "监护人证件号码不能与本人证件号码相同！")
            field.DEFAULT_VALUE = "";
            return;
        }
    },
    GUARDIANINFO_DELETE_MODULE_FINISHED: (_this, fieldData) => {
        _.each(_this.$refs, (item, key) => {
            if (key.indexOf("CUST_GUARDIAN_INFO") > -1 && item.length > 0) {
                item[0].$refs.GUARDIAN_ID[0].field.message = "";
                item[0].$refs.GUARDIAN_ID[0].$refs.GUARDIAN_ID.validate("change");
            }
        })
    }
}