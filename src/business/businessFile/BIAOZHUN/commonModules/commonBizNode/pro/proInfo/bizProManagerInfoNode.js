/*
 *   产品管理人模块
 *   方法封装
 *   @author  yangyp
 */

import date from '../../../../../../../tools/date.js'
import * as utils from "../../../../../../../tools/util"
import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../../business/businessTools/bizPublicMethod.js"
import custInfoModel from '../../common/cust-info-model.js'

let proManagerIdType = ""
const orgLegalRepInfoTitleOne = "执行事务合伙人信息";
const orgLegalRepInfoTitleTwo = "法定代表人信息";

//开户和非开户 字段数据加载 公共操作
const bizProManagerInfoNodeBeforeLoadBizCommon = (_this) => {
    _this.groupDatas["MANAGER_INFO"]["MANAGER_CARD_INFO"]["0"]["FIELDS"]["NATIVE_PLACE"].VALID_TYPE = "val[2,16]"
}
export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizProManagerInfoNodeBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizProManagerInfoNodeBeforeLoadBiz: function (_this) {
        let MANAGER_CARD_INFO = _this.groupDatas.MANAGER_INFO.MANAGER_CARD_INFO[0].FIELDS;
        let MANAGER_BASIC_INFO = _this.groupDatas.MANAGER_INFO.MANAGER_BASIC_INFO[0].FIELDS; 
        bizProManagerInfoNodeBeforeLoadBizCommon(_this)
        var proManagerInfo = custInfoModel.getOriginaProManagerBasicInfo(_this.oppBusiData.oldBusiData)
        if(!_.isEmpty(proManagerInfo)){
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["MANAGER_CARD_INFO"], proManagerInfo);
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["MANAGER_BASIC_INFO"], proManagerInfo);
        }
        let REGISTER_FUND = _.cloneDeep(proManagerInfo.REGISTER_FUND) || "";
        MANAGER_CARD_INFO["REGISTER_FUND"].DEFAULT_VALUE = REGISTER_FUND ? Number((Number(REGISTER_FUND) / 10000).toFixed(4)) + "" : "";
    },
    bizProManagerInfoNodeBeforeLoadBizOpenAcct: function (_this) {
        bizProManagerInfoNodeBeforeLoadBizCommon(_this)
    },
    /*
     *@method bizProManagerInfoNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-13 09:42:56
     */
    bizProManagerInfoNodeAfterLoadBiz: function (_this) {
        let MANAGER_CARD_INFO = _this.groupDatas.MANAGER_INFO.MANAGER_CARD_INFO[0].FIELDS;
        let MANAGER_BASIC_INFO = _this.groupDatas.MANAGER_INFO.MANAGER_BASIC_INFO[0].FIELDS; 
        let PRO_MANAGER_INFO = _.get(_this.oppBusiData.newBusiData, "MANAGER_INFO.PRO_MANAGER_INFO", "");
        if(PRO_MANAGER_INFO){
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["MANAGER_CARD_INFO"], PRO_MANAGER_INFO);
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["MANAGER_BASIC_INFO"], PRO_MANAGER_INFO);
        }
        // 法人类型 只显示“01-内资企业法人”、“03-金融机构法人”、“08-合伙企业”和“07-境外法人”
        let PRO_LEGAL_REP_TYPE = _this.$blMethod.getJsonSessionBusiCommParam(_this, "PRO_LEGAL_REP_TYPE") || "01,03,07,08";
        MANAGER_BASIC_INFO.LEGAL_REP_TYPE.FIELD_DICT_FILTER = PRO_LEGAL_REP_TYPE.split(",")

        let REGISTER_FUND = _.cloneDeep(PRO_MANAGER_INFO.REGISTER_FUND) || "";
        MANAGER_CARD_INFO["REGISTER_FUND"].DEFAULT_VALUE = REGISTER_FUND ? Number((Number(REGISTER_FUND) / 10000).toFixed(4)) + "" : MANAGER_CARD_INFO["REGISTER_FUND"].DEFAULT_VALUE;
        
        let LEGAL_REP_TYPE = MANAGER_BASIC_INFO.LEGAL_REP_TYPE.DEFAULT_VALUE || "";
        //当管理人属性选择“08”时，“法定代表人”为“执行事务合伙人” 其他则相反
        let lealNameChange = "08";
        let isLealNameChange = _.indexOf(lealNameChange.split(","), LEGAL_REP_TYPE) > -1;
        let moduleTitle = isLealNameChange ? orgLegalRepInfoTitleOne : orgLegalRepInfoTitleTwo;
        //原来的title
        let oldTitle = isLealNameChange ? orgLegalRepInfoTitleTwo : orgLegalRepInfoTitleOne;
        _this.groupDatas.MANAGER_INFO.ORG_LEGAL_REP_INFO[0].MODULE_TITLE = moduleTitle;
        _this.oldGroupDatas.MANAGER_INFO.ORG_LEGAL_REP_INFO[0].MODULE_TITLE = moduleTitle;
        _this.$blMethod.updateRouteName(_this, oldTitle, moduleTitle)
        //修改负责人信息和控股股东信息 按钮文案
        let radioButtonTitle = "与" + moduleTitle + "一致"
        // 同步标题变化到oldGroupDatas和groupDatasTpl里,防止点击还原按钮后字段标题是以前的标题
        _this.groupDatas.OTHER_INFO.ORG_RESPONSIBLE_INFO[0].FIELDS.MODULE_RADIO_BUTTON.FIELD_TITLE = radioButtonTitle;
        _this.oldGroupDatas.OTHER_INFO.ORG_RESPONSIBLE_INFO[0].FIELDS.MODULE_RADIO_BUTTON.FIELD_TITLE = radioButtonTitle;
        _this.groupDatas.EQUITY_INFO.ORG_STOCKHOLDER_INFO[0].FIELDS.MODULE_RADIO_BUTTON.FIELD_TITLE = radioButtonTitle;
        _this.oldGroupDatas.EQUITY_INFO.ORG_STOCKHOLDER_INFO[0].FIELDS.MODULE_RADIO_BUTTON.FIELD_TITLE = radioButtonTitle;
        _this.groupDatasTpl.EQUITY_INFO.ORG_STOCKHOLDER_INFO[0].FIELDS.MODULE_RADIO_BUTTON.FIELD_TITLE = radioButtonTitle;
    },
    /*
     *@method bizProManagerInfoNodeBeforeSave
     *@desc 钩子函数 自定义保存数
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizProManagerInfoNodeBeforeSave: function (_this, params) {
        let isOpenAcct = _this.$storage.getJsonSession(_this.$definecfg.IS_OPEN_ACCT_BIZ);

        let managerCardInfo = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "MANAGER_CARD_INFO");
        let managerBasicInfo = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "MANAGER_BASIC_INFO");
        let proManagerInfo = _.assign({}, managerCardInfo, managerBasicInfo);
        let busiData = _this.oppBusiData.newBusiData;
        let managerInfo = busiData && busiData.MANAGER_INFO || {};
        proManagerInfo.REGISTER_FUND = (proManagerInfo.REGISTER_FUND * 10000).toFixed() ; //注册资金乘一万（单位万元->元)
        managerInfo.PRO_MANAGER_INFO = proManagerInfo;
        //法人类型
        params.LEGAL_REP_TYPE = proManagerInfo.LEGAL_REP_TYPE;
        //管理人属性（机构类型）
        params.SZORG_TYPE = proManagerInfo.SZORG_TYPE;

        if(isOpenAcct == "1") {
            var managerDiffInfo = bizPublicMethod.$blMethod.compareInfo2(custInfoModel.getOriginaProManagerBasicInfo(_this.oppBusiData.oldBusiData), proManagerInfo);
            managerInfo.PRO_MANAGER_CHANGE_INFO = Object.assign({}, proManagerInfo, {
                DIFF_INFO: managerDiffInfo
            })
        }
        //管理人重要信息隐藏
        if (!_this.oppBusiData.PRO_MANAGER_IMPORT_INFO_FLAG) {
            managerInfo.PRO_MANAGER_IMPORT_INFO = {};
            if(isOpenAcct =="1") {
                managerInfo.PRO_MANAGER_IMPORT_CHANGE_INFO = {
                    DIFF_INFO: [],
                }
            }
        }
        
        Object.assign(params.MANAGER_INFO, managerInfo);
    },
    /*
     *@method bizProManagerInfoNodeAfterSave
     *@desc 钩子函数 自定义保存数
     */
    bizProManagerInfoNodeAfterSave: (_this, newData) => {
        if (_this.oppBusiData.newBusiData) {
            let newObj = { 
                MANAGER_INFO: _.get(newData, "MANAGER_INFO", {})
            }
            _.assign(_this.oppBusiData.newBusiData, newObj);
        }
        
    },
    /*
     *@method bizProManagerInfoNodeValidate
     *@desc 钩子函数 下一步验证
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizProManagerInfoNodeValidate: function (_this) {
      
    },

    /*
     *@method bizProManagerInfoNodePageActivated
     *@desc 钩子函数：页面激活
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizProManagerInfoNodePageActivated: function (_this, groupId) {
        // 字段设置
        let MANAGER_CARD_INFO = _this.groupDatas.MANAGER_INFO.MANAGER_CARD_INFO[0].FIELDS;
        let MANAGER_BASIC_INFO = _this.groupDatas.MANAGER_INFO.MANAGER_BASIC_INFO[0].FIELDS; 
        // 法人类型 只显示“01-内资企业法人”、“03-金融机构法人”、“08-合伙企业”和“07-境外法人”
        let PRO_LEGAL_REP_TYPE = _this.$blMethod.getJsonSessionBusiCommParam(_this, "PRO_LEGAL_REP_TYPE") || "01,03,07,08";
        MANAGER_BASIC_INFO.LEGAL_REP_TYPE.FIELD_DICT_FILTER = PRO_LEGAL_REP_TYPE.split(",")

        //过滤证件类型
        let dictItem = _this["oppBusiData"]["VALID_ID_TYPE_FOR_BOTH"] || _.map(MANAGER_CARD_INFO.PRO_MANAGER_ID_TYPE.FIELD_DICT_NAME, 'DICT_ITEM')
        MANAGER_CARD_INFO.PRO_MANAGER_ID_TYPE.FIELD_DICT_FILTER = _.filter(dictItem, function(item) {
            return item.charAt(0) != '0'
        })
        MANAGER_BASIC_INFO.BUSINESS_RANGE.VALID_TYPE = "normalinput|length[4,2000]|on-blur"
        _this.$nextTick( () => {
            setTimeout(() => {
                MANAGER_BASIC_INFO.BUSINESS_RANGE.VALID_TYPE = "normalinput|length[4,2000]|on-blur"
            }, 10);
            MANAGER_BASIC_INFO.BUSINESS_RANGE.FIELD_AUTOSIZE = {minRows: 1, maxRows: 4}
        })
    },

    bizProManagerInfoNodePreValidate: function(_this) {
    },
    //----------------------业务函数----------------------------------//
    //管理人证件类型
    "CHECK_PRO_MANAGER_ID_TYPE": function(_this, field, fieldData) {
        _this.oppBusiData.preIdType = field.OLD_DEFAULT_VALUE || "";
        field.OLD_DEFAULT_VALUE = field.DEFAULT_VALUE;
        _this.$blMethod.setValidType(_this, field, fieldData, "PRO_MANAGER_ID_CODE")
        if(proManagerIdType && field.DEFAULT_VALUE != proManagerIdType) {
        fieldData.PRO_MANAGER_ID_CODE.DEFAULT_VALUE = '';
        }
        proManagerIdType = field.DEFAULT_VALUE;
        _this.oppBusiData.PRO_MANAGER_IMPORT_INFO_FLAG = false;
        if (field.DEFAULT_VALUE == "14") {
            _this.groupDatas.MANAGER_INFO.PRO_MANAGER_IMPORT_INFO[0].MODULE_CONTROL = "0";
            fieldData.CORP_ADDR.showRegionSelector = false;
        } else {
            _this.groupDatas.MANAGER_INFO.PRO_MANAGER_IMPORT_INFO[0].MODULE_CONTROL = "1";
            _this.oppBusiData.PRO_MANAGER_IMPORT_INFO_FLAG = true;
            fieldData.CORP_ADDR.showRegionSelector = true;
        }
    },
    //管理人名称
    "CHECK_PRO_MANAGER_ID_CODE": (_this, field, fieldData) => {
        autoSetMangerImportantInfo(_this, field, fieldData);
    },
    "CHECK_PRO_MANAGER_ID_EXP_DATE":(_this, field, fieldData) => {
        autoSetMangerImportantInfo(_this, field, fieldData);
    },
    //法人类型
    "CHECK_LEGAL_REP_TYPE": (_this, field, fieldData) => {
        let defaultValue = field.DEFAULT_VALUE || "";

        if(defaultValue == "01"){//内资企业法人
            fieldData.SZORG_TYPE.FIELD_DICT_FILTER = ["01","02","03","04","05","09","25"];
        }
        if(defaultValue == "03"){//金融机构法人
            fieldData.SZORG_TYPE.FIELD_DICT_FILTER = ["10","11","12","13","14","25b","61","62","63","64","QH","41"]
        }if(defaultValue == "08"){//合伙企业
            fieldData.SZORG_TYPE.FIELD_DICT_FILTER  = ["21","22","23","24","25a"];
        }if(defaultValue == "07"){//境外法人
            fieldData.SZORG_TYPE.FIELD_DICT_FILTER = ["31","32","33","34","35","99","7D"];
        }
        //管理人属性的值不在当前过滤中时候 清空
        if (_.indexOf(fieldData.SZORG_TYPE.FIELD_DICT_FILTER, fieldData.SZORG_TYPE.DEFAULT_VALUE) == -1) {
            fieldData.SZORG_TYPE.DEFAULT_VALUE = "";
        }

        //当管理人属性选择“08”时，“法定代表人”为“执行事务合伙人” 其他则相反
        let lealNameChange = "08";
        let isLealNameChange = _.indexOf(lealNameChange.split(","), defaultValue) > -1;
        let moduleTitle = isLealNameChange ? orgLegalRepInfoTitleOne : orgLegalRepInfoTitleTwo;
        //原来的title
        let oldTitle = isLealNameChange ? orgLegalRepInfoTitleTwo : orgLegalRepInfoTitleOne;
        _this.groupDatas.MANAGER_INFO.ORG_LEGAL_REP_INFO[0].MODULE_TITLE = moduleTitle;
        _this.oldGroupDatas.MANAGER_INFO.ORG_LEGAL_REP_INFO[0].MODULE_TITLE = moduleTitle;
        _this.$blMethod.updateRouteName(_this, oldTitle, moduleTitle)
        //修改负责人信息和控股股东信息 按钮文案
        let radioButtonTitle = "与" + moduleTitle + "一致"
        // 同步标题变化到oldGroupDatas和groupDatasTpl里,防止点击还原按钮后字段标题是以前的标题
        _this.groupDatas.OTHER_INFO.ORG_RESPONSIBLE_INFO[0].FIELDS.MODULE_RADIO_BUTTON.FIELD_TITLE = radioButtonTitle;
        _this.oldGroupDatas.OTHER_INFO.ORG_RESPONSIBLE_INFO[0].FIELDS.MODULE_RADIO_BUTTON.FIELD_TITLE = radioButtonTitle;
        _this.groupDatas.EQUITY_INFO.ORG_STOCKHOLDER_INFO[0].FIELDS.MODULE_RADIO_BUTTON.FIELD_TITLE = radioButtonTitle;
        _this.oldGroupDatas.EQUITY_INFO.ORG_STOCKHOLDER_INFO[0].FIELDS.MODULE_RADIO_BUTTON.FIELD_TITLE = radioButtonTitle;
        _this.groupDatasTpl.EQUITY_INFO.ORG_STOCKHOLDER_INFO[0].FIELDS.MODULE_RADIO_BUTTON.FIELD_TITLE = radioButtonTitle;
    },
    //管理人属性
    "CHECK_SZORG_TYPE": (_this, field, fieldData) => {
        let defaultValue = field.DEFAULT_VALUE || "";
        // 若管理人属性选择“25a”或“25b”或“25”时，私募基金管理人编码为必填，其他的不显示
        let PRO_SZORG_TYPE_FOR_SMFUND_MANAGER_ID = _this.$blMethod.getJsonSessionBusiCommParam(_this, "PRO_SZORG_TYPE_FOR_SMFUND_MANAGER_ID") || "25,25a,25b";
        if (_.indexOf(PRO_SZORG_TYPE_FOR_SMFUND_MANAGER_ID.split(","), defaultValue) > -1) {
            fieldData.SMFUND_MANAGER_ID.FIELD_CONTROL = "0";
        } else {
            fieldData.SMFUND_MANAGER_ID.FIELD_CONTROL = "1";
        }
        // 当管理人属性选择“21,22,23,24,25a”时，“合伙人信息”一栏展示，管理人属性选择其他选项时，该栏不展示
        let PRO_SZORG_TYPE_FOR_PARTNER = _this.$blMethod.getJsonSessionBusiCommParam(_this, "PRO_SZORG_TYPE_FOR_PARTNER") || "21,22,23,24,25a";
        if (_.indexOf(PRO_SZORG_TYPE_FOR_PARTNER.split(","), defaultValue) > -1) {
            _this.$router.showRoute("合伙人信息")
        } else {
            _this.$router.hideRoute("合伙人信息")
        }
    },
    "CHECK_INDUS_GB": (_this, field, fieldData) => {
        let defaultValue = field.DEFAULT_VALUE || "";
        let dict = fieldData.INDUS_GB_SUB.FIELD_DICT_NAME || [];
        if (defaultValue) {
            let indusGbSubFilter = _.filter(dict, item => {
                return item.DICT_ITEM.charAt(0) ==  defaultValue;
            })
            fieldData.INDUS_GB_SUB.FIELD_DICT_FILTER = _.map(indusGbSubFilter, item => {
                return item.DICT_ITEM;
            });
            fieldData.INDUS_GB_SUB.DEFAULT_VALUE = "";
        }
        
    },
}
const autoSetMangerImportantInfo = (_this, field, fieldData) => {
    let idType = fieldData.PRO_MANAGER_ID_TYPE.DEFAULT_VALUE || "";
    let idCode = fieldData.PRO_MANAGER_ID_CODE.DEFAULT_VALUE || "";
    let idExpDaTe =  fieldData.PRO_MANAGER_ID_EXP_DATE.DEFAULT_VALUE || "";
    if (fieldData.PRO_MANAGER_ID_TYPE.DEFAULT_VALUE == "10" || _this.oppBusiData.preIdType == "10") {
        _this.busiLogic.setBusinessTaxNo(_this, idType, idCode);
        _this.busiLogic.setTaxNoExpDate(_this, idType, idCode, idExpDaTe);
    }
    
}