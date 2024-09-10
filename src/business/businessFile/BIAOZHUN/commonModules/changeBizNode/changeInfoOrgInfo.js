import bizPublicMethod from '@/business/businessTools/bizPublicMethod'
import oppService from '@/service/opp-service.js'

export default {
    orgCustInfoBeforeLoadBiz: function (_this) {
        // 初始化字段
        if (_this.userType == "1") {
            //公共参数AML_ENABLE(是否启用反洗钱功能);0-不启用;1-启用
            _this.amlEnable = oppService.getBusiCommonParamsByCode(_this.oppBusiData.busiCommonParamsArray, "AML_ENABLE")
            //是否显示行业大类 行业小类字段
            _this.SHOW_INDUS_GB_FIELDS = oppService.getBusiCommonParamsByCode(_this.oppBusiData.busiCommonParamsArray, "SHOW_INDUS_GB_FIELDS");
            // 是否显示发证机关
            _this.SHOW_ID_ISS_AGCY_FIELDS = oppService.getBusiCommonParamsByCode(_this.oppBusiData.busiCommonParamsArray, "SHOW_ID_ISS_AGCY_FIELDS");
            _this.AML_FLAG = _this.amlEnable == "1"; //标识,是否具有反洗钱功能
            _this.ORG_CODE = _this.oppBusiData.ORG_CODE || "";
            _this.CUST_CODE = _this.oppBusiData.CUST_CODE || "";
            _this.jumpJudgeBusiTimes = true;
            // 机构客户三大模块视图数据
            _this.ORG_BASIC_INFO = _this.oppBusiData.ORG_BASIC_INFO || {};
            _this.ORG_IMPORT_INFO = _this.oppBusiData.ORG_IMPORT_INFO || {};
            _this.ORG_LINK_INFO = _this.oppBusiData.ORG_LINK_INFO || {};


            _this.groupDatas.ORG_CUST_INFO.ORG_CUST_BASIC_MODULE[0].FIELDS.INDUS_GB.FIELD_CONTROL = "1";
            _this.groupDatas.ORG_CUST_INFO.ORG_CUST_BASIC_MODULE[0].FIELDS.INDUS_GB_SUB.FIELD_CONTROL = "1";
            if (_this.SHOW_INDUS_GB_FIELDS == "1") {
                _this.groupDatas.ORG_CUST_INFO.ORG_CUST_BASIC_MODULE[0].FIELDS.INDUS_GB.FIELD_CONTROL = "1";
                _this.groupDatas.ORG_CUST_INFO.ORG_CUST_BASIC_MODULE[0].FIELDS.INDUS_GB_SUB.FIELD_CONTROL = "1";
            }
            this.getOriginalData(_this);
            //保存当前手机号码
            _this.oppBusiData.currentMobile = _this.oppBusiData.ORG_LINK_INFO.MOBILE_TEL;
            this.orgCustInfoParseOldBiz(_this);

        }
    },

    // 获取客户原始数据
    getOriginalData: function (_this) {
        let oppBusiData = _this.oppBusiData;
        oppBusiData.custAllInfo.ORG_INFO.BUS_MAIN_ADDR = oppBusiData.custAllInfo.ORG_INFO.C6;
        oppBusiData.custAllInfo.ORG_INFO.HEAD_ADDR = oppBusiData.custAllInfo.ORG_INFO.C7;
        // 机构基本信息,去除空格
        oppBusiData.ORG_BASIC_INFO = _.mapValues(_.extend({},
            _.pick(oppBusiData.custAllInfo.BASIC_INFO, ["USER_FNAME", "USER_NAME", "ID_BEG_DATE", "ID_TYPE", "ID_CODE", "ID_EXP_DATE", "ID_ADDR", "CITIZENSHIP", "NATIVE_PLACE", "BIRTHDAY"]),
            _.pick(oppBusiData.custAllInfo.OTHER_INFO, ["SUBJECT_IDENTITY", "INOUTSIDE_IDENTITY", "SMFUND_MANAGER_ID", "SZORG_TYPE", "AML_CUST_TYPE"]),
            _.pick(oppBusiData.custAllInfo.ORG_INFO, ["REGISTER_FUND", "LEGAL_REP_TYPE", "CORP_TYPE", "INDUS_TYPE", "TRADE", "INDUS_GB", "INDUS_GB_SUB", "BUSINESS_RANGE", "BUS_MAIN_ADDR", "HEAD_ADDR"]), {
                "CORP_ADDR": oppBusiData.custAllInfo.BASIC_INFO.OFFICE_ADDR || ""
            }), function (val) {
            return _.trim(val);
        })

        let orgImportInfo = _.pick(oppBusiData.custAllInfo.ORG_INFO, ["ORG_ID_CODE", "ORG_ID_EXP_DATE", "BUSINESS_TAX_NO", "TAX_NO_EXP_DATE", "LAND_TAX_NO", "LAND_TAX_NO_EXP_DATE", "INDUS_TYPE", "CORP_TYPE", "CAPITAL_ATTR"])

        //机构重要信息
        oppBusiData.ORG_IMPORT_INFO = _.extend({}, orgImportInfo,
            _.pick(oppBusiData.custAllInfo.OTHER_INFO, ["NATIONAL_ATTR", "LISTED_ATTR"]));

        oppBusiData.ORG_LINK_INFO = _.extend({},
            _.pick(oppBusiData.custAllInfo.BASIC_INFO, ["MOBILE_TEL", "FAX", "EMAIL", "OFFICE_TEL", "OFFICE_ADDR", "FISL_EMAIL"]), {
                ZIP_CODE: oppBusiData.custAllInfo.BASIC_INFO.ID_ZIP_CODE
            }, {
                "OFFICE_ADDR": oppBusiData.custAllInfo.BASIC_INFO.CORP_ADDR || ""
            });
    },

    orgCustInfoValidate: function (_this) {
        if (_this.groupId == "ORG_CUST_INFO") {
            if (_this.$router.getCurrentRoute().nextBtnText == "填写完成") {
                let data = _this.parseGroupData();
                if (data[0].length) {
                    return true;
                }
                _this.$router.goRoute("业务导航");
                clearInterval(_this.oppBusiData.interTimer);
                _this.groupDatas.ORG_CUST_LINK_INFO.ORG_CUST_LINK_MODULE[0].FIELDS.VALIDATE_CODE.BUTTON_ENABLE = false;
                _this.$set(_this.groupDatas.ORG_CUST_LINK_INFO.ORG_CUST_LINK_MODULE[0].FIELDS.VALIDATE_CODE, 'FIELD_BUTTON_TXT', `发送验证码`);
                return false;
            }
        }
        if (_this.groupId == "ORG_CUST_LINK_INFO") {
            if (_this.oppBusiData.currentMobile != _this.groupDatas.ORG_CUST_LINK_INFO.ORG_CUST_LINK_MODULE[0].FIELDS.MOBILE_TEL.DEFAULT_VALUE) {
                _this.oppBusiData.isChangeMobile = true;
                _this.alert({
                    messageText: '手机号码已修改，请重新发送验证码'
                });
                return false;
            }
            if (!_this.oppBusiData.IDENTIFY_CODE_CHECK_FLAG && _this.oppBusiData.currentMobile != _this.oppBusiData.custAllInfo.BASIC_INFO.MOBILE_TEL) {
                let fieldData = _this.groupDatas.ORG_CUST_LINK_INFO.ORG_CUST_LINK_MODULE[0].FIELDS,
                    field = fieldData.VALIDATE_CODE;
                return this.CHECK_ORG_VALIDATE_CODE(_this, field, fieldData).then(function (errTxt) {
                    if (errTxt == '') {
                        //认证验证码成功的逻辑
                        if (_this.$router.getCurrentRoute().nextBtnText == "填写完成") {
                            let data = _this.parseGroupData();
                            if (data[0].length) {
                                return true;
                            }
                            _this.$router.goRoute("业务导航");
                            clearInterval(_this.oppBusiData.interTimer);
                            _this.groupDatas.ORG_CUST_LINK_INFO.ORG_CUST_LINK_MODULE[0].FIELDS.VALIDATE_CODE.BUTTON_ENABLE = false;
                            _this.$set(_this.groupDatas.ORG_CUST_LINK_INFO.ORG_CUST_LINK_MODULE[0].FIELDS.VALIDATE_CODE, 'FIELD_BUTTON_TXT', `发送验证码`);
                            return false;
                        }
                    } else {
                        _this.alert(errTxt);
                        return false;
                    }
                });
            }
            if (_this.$router.getCurrentRoute().nextBtnText == "填写完成") {
                let data = _this.parseGroupData();
                if (data[0].length) {
                    return true;
                }
                clearInterval(_this.oppBusiData.interTimer);
                _this.groupDatas.ORG_CUST_LINK_INFO.ORG_CUST_LINK_MODULE[0].FIELDS.VALIDATE_CODE.BUTTON_ENABLE = false;
                _this.$set(_this.groupDatas.ORG_CUST_LINK_INFO.ORG_CUST_LINK_MODULE[0].FIELDS.VALIDATE_CODE, 'FIELD_BUTTON_TXT', `发送验证码`);
                _this.$router.goRoute("业务导航");
                return false;
            }
        }
        return true;
    },

    orgCustInfoPageActivated: function (_this, groupId) {
        _this.groupDatas.ORG_CUST_INFO.ORG_CUST_BASIC_MODULE[0].FIELDS.ID_TYPE.FIELD_FUNCTION = "SELECT_ID_TYPE";
        _this.groupDatas.ORG_CUST_INFO.ORG_CUST_BASIC_MODULE[0].FIELDS.CITIZENSHIP.FIELD_FUNCTION = "SELECT_CITIZENSHIP";
        _this.groupDatas.ORG_CUST_INFO.ORG_CUST_BASIC_MODULE[0].FIELDS.LEGAL_REP_TYPE.FIELD_FUNCTION = "SELECT_LEGALREPTYPE";
        _this.groupDatas.ORG_CUST_INFO.ORG_CUST_BASIC_MODULE[0].FIELDS.INDUS_GB.FIELD_FUNCTION = "CHECK_INDUS_GB";
        _this.oppBusiData.currentMobile = _this.oppBusiData.custAllInfo.BASIC_INFO.MOBILE_TEL;
        _this.$router.updateRoute(_this.$router.getCurrentRouteIndex(), "nextBtnText", "填写完成");
        if (_.indexOf(["ORG_CUST_INFO", "ORG_CUST_LINK_INFO"], _this.groupId) != -1) {
            _this.$el.getElementsByClassName("prev")[0].parentElement.style.display = "none";
        } else {
            _this.$el.getElementsByClassName("prev")[0].parentElement.style.display = "block";
        }
    },

    orgCustInfoPreValidate: function (_this) {
        _this.$router.goRoute("业务导航");
    },

    orgCustInfoParseOldBiz: function (_this) {
        let oppBusiData = _this.oppBusiData;
        let oppData = _.extend({}, oppBusiData.ORG_BASIC_INFO, oppBusiData.ORG_IMPORT_INFO, oppBusiData.ORG_LINK_INFO);
        bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["ORG_CUST_BASIC_MODULE", "ORG_CUST_IMPORT_MODULE", "ORG_CUST_LINK_MODULE"], oppData);
    },

    /**
     * 设置组织机构代码证
     * @param idTypeVal
     * @param idCodeVal
     */
    setBusinessTaxNo: function (_this, idTypeVal, idCodeVal, idExpDate) {
        let fieldArr = ["ORG_ID_CODE", "ORG_ID_EXP_DATE", "BUSINESS_TAX_NO", "TAX_NO_EXP_DATE"];
        if (_.indexOf(["10"], idTypeVal) !== -1 && idCodeVal.length === 18) {
            _this.groupDatas.ORG_CUST_INFO.ORG_CUST_IMPORT_MODULE[0].FIELDS.ORG_ID_CODE.DEFAULT_VALUE = bizPublicMethod.$blMethod.getOrgIdCode(idCodeVal);
            _this.groupDatas.ORG_CUST_INFO.ORG_CUST_IMPORT_MODULE[0].FIELDS.ORG_ID_EXP_DATE.DEFAULT_VALUE = idExpDate;
            fieldArr.forEach(function (item) {
                _this.groupDatas.ORG_CUST_INFO.ORG_CUST_IMPORT_MODULE[0].FIELDS[item].FIELD_CONTROL = '2';
            })
        } else {
            fieldArr.forEach(function (item) {
                _this.groupDatas.ORG_CUST_INFO.ORG_CUST_IMPORT_MODULE[0].FIELDS[item].DEFAULT_VALUE = '';
                _this.groupDatas.ORG_CUST_INFO.ORG_CUST_IMPORT_MODULE[0].FIELDS[item].FIELD_CONTROL = '0';
            })
        }
    },

    /**
     * 拼接数据
     */
    orgCustInfoGetData: function (_this, params) {
        let oldOrgBasicInfo = _this.oppBusiData.ORG_BASIC_INFO,
            oldOrgLinkInfo = _this.oppBusiData.ORG_LINK_INFO,
            oldOrgImportInfo = _this.oppBusiData.ORG_IMPORT_INFO,
            newOrgBasicInfo = {},
            newOrgLinkInfo = {},
            newOrgImportInfo = {};
        bizPublicMethod.$blMethod.changeObjKeys(_this.groupDatas.ORG_CUST_INFO.ORG_CUST_BASIC_MODULE[0].FIELDS, newOrgBasicInfo);
        bizPublicMethod.$blMethod.changeObjKeys(_this.groupDatas.ORG_CUST_INFO.ORG_CUST_IMPORT_MODULE[0].FIELDS, newOrgImportInfo);
        bizPublicMethod.$blMethod.changeObjKeys(_this.groupDatas.ORG_CUST_LINK_INFO.ORG_CUST_LINK_MODULE[0].FIELDS, newOrgLinkInfo);
        newOrgBasicInfo.DIFF_INFO = bizPublicMethod.$blMethod.compareInfo(oldOrgBasicInfo, newOrgBasicInfo);
        newOrgLinkInfo.DIFF_INFO = bizPublicMethod.$blMethod.compareInfo(oldOrgLinkInfo, newOrgLinkInfo);
        newOrgImportInfo.DIFF_INFO = bizPublicMethod.$blMethod.compareInfo(oldOrgImportInfo, newOrgImportInfo);
        let tempObj = {};
        _.each(newOrgBasicInfo.DIFF_INFO, function (v) {
            if (v.FIELD === "ID_EXP_DATA") { //有效期
                tempObj.NEW_ID_EXP_DATA = v.NEW;
            }
            if (v.FIELD === "REGISTER_FUND") { //注册资金
                tempObj.NEW_REGISTER_FUND = v.NEW;
            }
            if (v.FIELD === "NATIVE_PLACE") { //注册地
                tempObj.NEW_NATIVE_PLACE = v.NEW;
            }
            if (v.FIELD === "ID_ADDR") { //注册地址
                tempObj.NEW_ID_ADDR = v.NEW;
            }
        });
        if (tempObj.NEW_ID_EXP_DATA || tempObj.NEW_NATIVE_PLACE || tempObj.NEW_REGISTER_FUND || tempObj.NEW_ID_ADDR) {
            _this.isBusinessLicenseChange = "1";
        }
        _.each(newOrgImportInfo.DIFF_INFO, function (v) {
            if (v.FIELD === "ORG_ID_CODE") { //组织机构代码
                tempObj.NEW_ORG_ID_CODE = v.NEW;
            }
            if (v.FIELD === "ORG_ID_EXP_DATE") { //组织机构证有效期
                tempObj.NEW_ORG_ID_EXP_DATE = v.NEW;
            }
            if (v.FIELD === "BUSINESS_TAX_NO") { //国税登记证
                tempObj.NEW_BUSINESS_TAX_NO = v.NEW;
            }
            if (v.FIELD === "TAX_NO_EXP_DATE") { //国税登记证有效期
                tempObj.NEW_TAX_NO_EXP_DATE = v.NEW;
            }
            if (v.FIELD === "LAND_TAX_NO") { //地税登记证
                tempObj.NEW_LAND_TAX_NO = v.NEW;
            }
            if (v.FIELD === "LAND_TAX_NO_EXP_DATE") { //地税登记证有效期
                tempObj.NEW_LAND_TAX_NO_EXP_DATE = v.NEW;
            }
        });
        if (tempObj.NEW_ORG_ID_CODE || tempObj.NEW_ORG_ID_EXP_DATE) {
            _this.isOrgIdInfoChange = "1";
        }
        if (tempObj.NEW_BUSINESS_TAX_NO || tempObj.NEW_TAX_NO_EXP_DATE || tempObj.NEW_LAND_TAX_NO || tempObj.NEW_LAND_TAX_NO_EXP_DATE) {
            _this.isTaxationInfoChange = "1";
        }
        //若变更了三要素,机构组织代码证号码任何一个,需要进入二审
        if (oldOrgBasicInfo.USER_FNAME != newOrgBasicInfo.USER_FNAME ||
            oldOrgBasicInfo.ID_TYPE != newOrgBasicInfo.ID_TYPE ||
            oldOrgBasicInfo.ID_CODE != newOrgBasicInfo.ID_CODE ||
            tempObj.NEW_ORG_ID_CODE) {
            _this.isChangeImport = "1";
            _this.isNotmorMal = "1";
        }
        if (oldOrgBasicInfo.CITIZENSHIP != newOrgBasicInfo.CITIZENSHIP) {
            _this.isChangeCitizenship = "1";
        } else {
            _this.isChangeCitizenship = "0";
        }
        if (_.trim(oldOrgImportInfo.NATIONAL_ATTR) !== _.trim(newOrgImportInfo.NATIONAL_ATTR)) {
            _this.IS_CHANGE_NATION_ATTR = "1";
        } else {
            _this.IS_CHANGE_NATION_ATTR = "0";
        }
        let res = {
            NEW_BASE_INFO: _.extend({}, newOrgBasicInfo, newOrgImportInfo),
            OLD_BASE_INFO: _.extend({}, oldOrgBasicInfo, oldOrgImportInfo),
            ORG_BASIC_INFO: newOrgBasicInfo,
            ORG_IMPORT_INFO: newOrgImportInfo,
            ORG_LINK_INFO: newOrgLinkInfo,
            CHANGE_IMPORTANT_FLAG: _this.isChangeImport,
            NOT_NORMAL: _this.isNotmorMal || "0",
            IS_BUSINESS_LICENSE_INFO_CHANGE: _this.isBusinessLicenseChange || "0",
            IS_ORG_ID_INFO_CHANGE: _this.isOrgIdInfoChange || "0",
            IS_TAXATION_INFO_CHANGE: _this.isTaxationInfoChange || "0",
            // 是否改变了手机号码,如果改了,同步一柜通CIF_CUST_IDENTIF表
            newMobile: _this.oppBusiData.isChangeMobile ? newOrgLinkInfo.MOBILE_TEL : "0",
            IS_CHANGE_TEL_ADDRESS: newOrgLinkInfo.OFFICE_ADDR != oldOrgLinkInfo.OFFICE_ADDR || newOrgLinkInfo.OFFICE_TEL != oldOrgLinkInfo.OFFICE_TEL ? "1" : "0",
            CHANGE_CITIZENSHIP_FALG: _this.isChangeCitizenship || "",
            CHANGE_NATION_ATTR: _this.CHANGE_NATION_ATTR,
            LEGAL_REP_TYPE_NEW: newOrgBasicInfo.LEGAL_REP_TYPE,
            SZORG_TYPE_NEW: newOrgBasicInfo.SZORG_TYPE,
            IS_CHANGE_NATION_ATTR: _this.IS_CHANGE_NATION_ATTR || "0",
        }
        Object.assign(params, res);
    },



    // 有效证明文件触发函数
    'SELECT_ID_TYPE': function (_this) {
        let curIdType = _this.groupDatas.ORG_CUST_INFO.ORG_CUST_BASIC_MODULE[0].FIELDS.ID_TYPE.DEFAULT_VALUE,
            oldIdType = _this.oppBusiData.custAllInfo.BASIC_INFO.ID_TYPE,
            orgCustBaseInfoFields = _this.groupDatas.ORG_CUST_INFO.ORG_CUST_BASIC_MODULE[0].FIELDS,
            outCountryData = _.filter(orgCustBaseInfoFields.CITIZENSHIP.FIELD_DICT_NAME, function (v) {
                return _.indexOf(["CHN"], v.DICT_ITEM) == -1;
            })
        //回填原来的信息
        if (curIdType == oldIdType) {
            let idCode = _this.oppBusiData.BASIC_INFO.ID_CODE;
            let idExpDate = _this.oppBusiData.BASIC_INFO.ID_EXP_DATE;
            orgCustBaseInfoFields.ID_CODE.DEFAULT_VALUE = idCode;
            orgCustBaseInfoFields.ID_BEG_DATE.DEFAULT_VALUE = _this.oppBusiData.BASIC_INFO.ID_BEG_DATE;
            orgCustBaseInfoFields.ID_EXP_DATE.DEFAULT_VALUE = idExpDate;
            this.setBusinessTaxNo(_this, curIdType, idCode, idExpDate);
        } else {
            //若修改证件类型,则自动将证件号码,证件开始日期,证件结束日期清空
            orgCustBaseInfoFields.ID_CODE.DEFAULT_VALUE = '';
            orgCustBaseInfoFields.ID_BEG_DATE.DEFAULT_VALUE = '';
            orgCustBaseInfoFields.ID_EXP_DATE.DEFAULT_VALUE = '';
        }
        // 若展示了发证机关,需要根据所选择的证件类型控制是否必传
        if (_this.SHOW_ID_ISS_AGCY_FIELDS == "1") {
            orgCustBaseInfoFields.ID_ISS_AGCY.required = (curIdType == "10");
        }

        orgCustBaseInfoFields.CITIZENSHIP.FIELD_CONTROL = '2';
        orgCustBaseInfoFields.INOUTSIDE_IDENTITY.FIELD_CONTROL = '2';
        orgCustBaseInfoFields.INOUTSIDE_IDENTITY.DEFAULT_VALUE = '';
        orgCustBaseInfoFields.LEGAL_REP_TYPE.DEFAULT_VALUE = '';
        orgCustBaseInfoFields.SZORG_TYPE.DEFAULT_VALUE = '';
        switch (curIdType) {
            case "14": // 14-境外有效商业登记证明文件
                orgCustBaseInfoFields.CITIZENSHIP.FIELD_DICT_NAME = outCountryData;
                orgCustBaseInfoFields.CITIZENSHIP.FIELD_CONTROL = '0';
                orgCustBaseInfoFields.INOUTSIDE_IDENTITY.DEFAULT_VALUE = "1";
                break;
            case "19": //19-其他证件
                orgCustBaseInfoFields.CITIZENSHIP.FIELD_CONTROL = '0';
                orgCustBaseInfoFields.CITIZENSHIP.DEFAULT_VALUE = '';
                _this.groupDatas.ORG_BASIC_INFO.ORG_CUST_BASIC_MODULE[0].FIELDS.INOUTSIDE_IDENTITY.FIELD_CONTROL = '0';
                _this.groupDatas.ORG_BASIC_INFO.ORG_CUST_BASIC_MODULE[0].FIELDS.INOUTSIDE_IDENTITY.DEFAULT_VALUE = '0';
                break;
            default:
                orgCustBaseInfoFields.CITIZENSHIP.DEFAULT_VALUE = "CHN";
                orgCustBaseInfoFields.INOUTSIDE_IDENTITY.DEFAULT_VALUE = '0';
                break;
        }
    },

    // 注册国家触发函数
    'SELECT_CITIZENSHIP': function (_this) {
        let orgCustInfoFields = _this.groupDatas.ORG_CUST_INFO.ORG_CUST_BASIC_MODULE[0].FIELDS;
        let citizenshipVal = orgCustInfoFields.CITIZENSHIP.DEFAULT_VALUE;
        orgCustInfoFields.INOUTSIDE_IDENTITY.FIELD_CONTROL = '2'
        if (citizenshipVal == 'CHN') {
            orgCustInfoFields.INOUTSIDE_IDENTITY.DEFAULT_VALUE = '0';
        } else {
            orgCustInfoFields.INOUTSIDE_IDENTITY.DEFAULT_VALUE = '1';
        }
    },

    // 法人类别触发函数
    'SELECT_LEGALREPTYPE': function (_this, field, fieldData) {
        this.selectLegalRepType(_this,field.DEFAULT_VALUE);
        if (field.DEFAULT_VALUE == '') {
            _this.groupDatas.ORG_CUST_INFO.ORG_CUST_BASIC_MODULE[0].SZORG_TYPE.DEFAULT_VALUE = '';
        }
    },

    /*
     * CHECK_INDUS_SUB#行业大类：
     */
    "CHECK_INDUS_GB": (_this, field, fieldData) => {
        var outINDUS_GB_SUBData = _.map(_.filter(fieldData["INDUS_GB_SUB"].FIELD_DICT_NAME, function (v) {
            if (field.DEFAULT_VALUE && v.DICT_ITEM) {
                return _.indexOf(field.DEFAULT_VALUE.charAt(0), v.DICT_ITEM.charAt(0)) != -1;
            }
        }), "DICT_ITEM");
        fieldData["INDUS_GB_SUB"].FIELD_DICT_FILTER = outINDUS_GB_SUBData;
    },

    selectLegalRepType: function (_this, legalRepType) {
        let filterStr = "",
            orgCustBaseInfoFields = _this.groupDatas.ORG_CUST_INFO.ORG_CUST_BASIC_MODULE[0].FIELDS,
            idTypeVal = orgCustBaseInfoFields.ID_TYPE.DEFAULT_VALUE;
        orgCustBaseInfoFields.SZORG_TYPE.DEFAULT_VALUE = '';
        switch (idTypeVal) {
            case "10":
                switch (legalRepType) {
                    case "01":
                        filterStr = "01,02,03,04,05,09,25";
                        break;
                    case "02": //缺少了02
                        filterStr = "01,02,03,04,05,09";
                        break;
                    case "03": //2018-1-17 xiaojb 02是不对的，03才是对的
                        filterStr = "10,11,12,13,14,19,25b,41,61,62,63,64,QH";
                        break;
                    case "08":
                        filterStr = "21,22,23,24,25,25a,25b";
                        break;
                }
                break;
            case "11":
                filterStr = "04";
                break;
            case "12": //机关法人成立批文
                filterStr = "02";
                break;
            case "13":
                filterStr = "03";
                break;
            case "14":
                break;
            case "19": //其它证件类型
                switch (legalRepType) {
                    case "01": //内资企业法人对应的只有05 工会法人 09 其它非金融机构法人
                        filterStr = "05,09";
                        break;
                    case "07":
                        break;
                    case "08":
                        filterStr = "21,22,23,24,25a";
                        break;
                }
                break;
        }
        if (filterStr.length) {
            orgCustBaseInfoFields.SZORG_TYPE.FIELD_DICT_NAME = _.filter(orgCustBaseInfoFields.SZORG_TYPE.FIELD_DICT_NAME, function (v) {
                return _.indexOf(filterStr.split(","), v.DICT_ITEM) != -1;
            });
        }
    },
}
