import storage from "../../../../../../tools/storage";
import date from "../../../../../../tools/date";
import defineConfig from "../../../../../../config/defineConfig";
import sysConfig from "../../../../../../config/sysConfig";
import oppService from "../../../../../../service/opp-service";
export default {
    /**
     * @name  获取产品基本信息
     * @method getOriginaOrgBasicInfoByPro
     * @param {Object} oldBusiData 
     * @returns {Object}
     */
    getOriginaOrgBasicInfoByPro(oldBusiData) {
        if (_.isEmpty(oldBusiData) || _.isEmpty(oldBusiData.CUST_BASIC_INFO)) {
            return {};
        }
        var obj = Object.assign({
            PRO_SIZE: oldBusiData.PRO_BASIC_INFO && oldBusiData.PRO_BASIC_INFO.PRO_SIZE.replace(/,/g, "") || "",
            TA_NAME: ""
        },
            _.pick(oldBusiData.CUST_BASIC_INFO, "USER_FNAME", "USER_NAME", "ID_TYPE", "ID_CODE", "ID_BEG_DATE", "ID_EXP_DATE", "ID_ADDR", "CITIZENSHIP", "INOUTSIDE_IDENTITY", "AML_CUST_TYPE"),
            _.pick(oldBusiData.PRO_BASIC_INFO, "PRO_NAME", "PRO_CLS", "PRO_EXP_DATE", "INIT_LEVERAGE", "PRO_BAK_DATE", "PRO_BAK_CODE", "PRO_BAK_ORG", "PRO_OPEN_DATE",
                "STRUCT_PRO_FLAG", "PRO_CON_SNO", "SMFUND_MANAGER_TYPE", "SMFUND_TYPE", "INVEST_RANAGE", "PRO_CREAT_DATE", "STKEX", "TA_PRO_STKPBU", "TA_CODE", "FUND_CODE"),
            _.pick(oldBusiData.CORP_INFO, "TRADE", "ANTI_MONEYLAUNDRY_TYPE", "INDUS_GB", "INDUS_GB_SUB", "INDUS_TYPE"),
            _.pick(oldBusiData.EXT_INFO, "BUS_MAIN_ADDR", "HEAD_ADDR")
        );
        return Object.assign(obj, {
            CUST_FNAME: obj.USER_FNAME,
            CUST_NAME: obj.USER_NAME,
            ID_EXP_BGN_DATE: obj.ID_BEG_DATE,
            SMFUND_MANAGER_TYPE: _.get(oldBusiData, "PRO_BASIC_INFO.SMF_MAG_TYPE", ""),
            SMFUND_TYPE: _.get(oldBusiData, "PRO_BASIC_INFO.SMF_TYPE", "")
        })

    },
    /**
     * @name  获取机构基本信息
     * @method getOriginaOrgBasicInfoByOrg
     * @param {Object} oldBusiData 
     * @returns {Object}
     */
    getOriginaOrgBasicInfoByOrg(oldBusiData) {
        if (_.isEmpty(oldBusiData) || _.isEmpty(oldBusiData.CUST_BASIC_INFO)) {
            return {};
        }
        var obj = Object.assign({},
            _.pick(oldBusiData.CUST_BASIC_INFO, "USER_FNAME", "USER_NAME", "ID_TYPE", "ID_CODE", "ID_BEG_DATE", "ID_EXP_DATE",
                "ID_ADDR", "CITIZENSHIP", "INOUTSIDE_IDENTITY", "AML_CUST_TYPE", "NATIVE_PLACE", "BIRTHDAY", "SUBJECT_IDENTITY",
                "INOUTSIDE_IDENTITY", "ID_ISS_AGCY", "SMFUND_MANAGER_ID","SZORGTYPE","ORG_ID_CODE","NATIONAL_ATTR","CAPITAL_ATTR","SMFUND_MANAGER_ID", "RISK_FACTOR", "OFFICE_ADDR"),
            _.pick(oldBusiData.CORP_INFO, "REGISTER_CURRENCY", "REGISTER_FUND", "TRADE", "SZORGTYPE", "LEGAL_REP_TYPE", "CORP_TYPE", "BUSINESS_RANGE","ORG_ID_EXP_DATE"),
            _.pick(oldBusiData.BUSINESS_INFO, "BENEFICIARY_LEVEL")
        );
        return Object.assign(obj, {
            CUST_FNAME: obj.USER_FNAME,
            CUST_NAME: obj.USER_NAME,
            ID_EXP_BGN_DATE: obj.ID_BEG_DATE,
            SZORG_TYPE: obj.SZORGTYPE,
            NATIVE_PLACE: obj.ID_ADDR,
            CORP_ADDR: obj.OFFICE_ADDR,
        })

    },
    /**
     * @name  获取实际控制人信息
     * @method getOriginaOrgControllerInfo
     * @param {Object} oldBusiData 
     * @returns {Array}
     */
    getOriginaOrgControllerInfo(oldBusiData) {
        if (!oldBusiData || _.isEmpty(oldBusiData) || !oldBusiData.CONTROLLER_INFO || _.isEmpty(oldBusiData.CONTROLLER_INFO)) {
            return [];
        }
        return oldBusiData.CONTROLLER_INFO || []
    },
    /**
    * @name  获取账户实际操作人信息
    * @method getOriginaActualControllerInfo
    * @param {Object} oldBusiData 
    * @returns {Array}
    */
    getOriginaActualControllerInfo(oldBusiData) {
        if (!oldBusiData || _.isEmpty(oldBusiData) || !oldBusiData.ACTUAL_CONTROLLER_INFO || _.isEmpty(oldBusiData.ACTUAL_CONTROLLER_INFO)) {
            return [];
        }
        return oldBusiData.ACTUAL_CONTROLLER_INFO || []
    },
    /**
    * @name  获取收益所有人信息
    * @method getOriginaBeneficiaryOwnerInfo
    * @param {Object} oldBusiData 
    * @returns {Array}
    */
    getOriginaBeneficiaryOwnerInfo(oldBusiData) {
        if (!oldBusiData || _.isEmpty(oldBusiData) || !oldBusiData.ACTUAL_BENEFICIARY_INFO || _.isEmpty(oldBusiData.ACTUAL_BENEFICIARY_INFO)) {
            return [];
        }
        return oldBusiData.ACTUAL_BENEFICIARY_INFO || []
    },

    /**
    * @name  获取机构联系信息
    * @method getOriginaOrgLinkInfo
    * @param {Object} oldBusiData 
    * @returns {Object}
    */
    getOriginaOrgLinkInfo(oldBusiData) {
        if (!oldBusiData || _.isEmpty(oldBusiData) || !oldBusiData.CUST_BASIC_INFO || _.isEmpty(oldBusiData.CUST_BASIC_INFO)) {
            return {};
        }
        var linkInfo = _.pick(oldBusiData.CUST_BASIC_INFO, "EMAIL", "FAX", "MOBILE_TEL", "OFFICE_ADDR", "ADDRESS", "OFFICE_TEL", "ZIP_CODE");
        return Object.assign(linkInfo,
            //机构产品户 CORP_ADDR 办公地址  与 OFFICE_ADDR注册地址 取反了   这里转换字段展示
            {
                CORP_ADDR: oldBusiData.CUST_BASIC_INFO.OFFICE_ADDR || "",
                OFFICE_ADDR: oldBusiData.CUST_BASIC_INFO.CORP_ADDR || 
                    oldBusiData.CUST_BASIC_INFO.OFFICE_ADDR
            }
        );
    },
    /**
    * @name  获取产品管理人基本信息
    * @method getOriginaProManagerBasicInfo
    * @param {Object} oldBusiData 
    * @returns {Object}
    */
    getOriginaProManagerBasicInfo(oldBusiData) {
        if (!oldBusiData || _.isEmpty(oldBusiData) || _.isEmpty(oldBusiData.CUST_BASIC_INFO)) {
            return {};
        }
        return Object.assign({}, oldBusiData.PRO_MANAGER_INFO, _.pick(oldBusiData.CUST_BASIC_INFO, "MOBILE_TEL"));
    },
    /**
    * @name  获取产品管理人重要信息
    * @method getOriginaProManagerImportantInfo
    * @param {Object} oldBusiData 
    * @returns {Object}
    */
    getOriginaProManagerImportantInfo(oldBusiData) {
        if (!oldBusiData || _.isEmpty(oldBusiData) || !oldBusiData.CORP_INFO || _.isEmpty(oldBusiData.CORP_INFO)) {
            return {};
        }
        return {
            PRO_MANAGER_ASSI_CODE: oldBusiData.CORP_INFO.ORG_ID_CODE,//组织机构代码证
            PRO_MANAGER_ASSI_EXP: oldBusiData.CORP_INFO.ORG_ID_EXP_DATE,//组织机构代码证有效期
            BUSINESS_TAX_NO: oldBusiData.CORP_INFO.BUSINESS_TAX_NO,//国税登记证
            TAX_NO_EXP_DATE: oldBusiData.CORP_INFO.TAX_NO_EXP_DATE,//国税登记证有效期
            LAND_TAX_NO: oldBusiData.CORP_INFO.LAND_TAX_NO,//地税登记证
            LAND_TAX_NO_EXP_DATE: oldBusiData.CORP_INFO.LAND_TAX_NO_EXP_DATE,//地税登记证有效期
        }
    },
    /**
     * @name  获取机构重要信息
     * @method getOriginaOrgImportantInfo
     * @param {Object} oldBusiData 
     * @returns {Object}
     */
    getOriginaOrgImportantInfo(oldBusiData) {
        if (!oldBusiData || _.isEmpty(oldBusiData) || !oldBusiData.CORP_INFO || _.isEmpty(oldBusiData.CORP_INFO)) {
            return {};
        }
        return {
            ORG_ID_CODE: oldBusiData.CORP_INFO.ORG_ID_CODE, //组织机构代码证
            ORG_ID_EXP_DATE: oldBusiData.CORP_INFO.ORG_ID_EXP_DATE, //组织机构代码证有效期
            BUSINESS_TAX_NO: oldBusiData.CORP_INFO.BUSINESS_TAX_NO, //国税登记证
            TAX_NO_EXP_DATE: oldBusiData.CORP_INFO.TAX_NO_EXP_DATE, //国税登记证有效期
            LAND_TAX_NO: oldBusiData.CORP_INFO.LAND_TAX_NO, //地税登记证
            LAND_TAX_NO_EXP_DATE: oldBusiData.CORP_INFO.LAND_TAX_NO_EXP_DATE, //地税登记证有效期
            CAPITAL_ATTR: oldBusiData.CORP_INFO.CAPITAL_ATTR, //资本属性
            NATIONAL_ATTR: oldBusiData.EXT_INFO ? oldBusiData.EXT_INFO.NATIONAL_ATTR : "", //国有属性
            LISTED_ATTR: oldBusiData.EXT_INFO ? oldBusiData.EXT_INFO.LISTED_ATTR : "", //上市属性
        }
    },
    /**
     * @name  获取机构法人信息
     * @method getOriginaOrgLegalInfo
     * @param {Object} oldBusiData 
     * @returns {Object}
     */
    getOriginaOrgLegalRepInfo(oldBusiData) {
        if (!oldBusiData || !oldBusiData.EXT_INFO || _.isEmpty(oldBusiData.EXT_INFO)) {
            return {}
        }

        return Object.assign(
            {},
            _.pick(oldBusiData.EXT_INFO, "LEGAL_EMAIL", "LEGAL_PER_TEL", "LEGAL_REP", "LEGAL_REP_ID_CODE", "LEGAL_REP_ID_EXP_DATE", "LEGAL_REP_ID_TYPE", "LEGAL_REP_POSITION", "LEGAL_REP_POSITION_PATION", "LEGAL_SEX"),
            {
                LEGAL_PERSON_TEL: _.get(oldBusiData, "EXT_INFO.LEGAL_PER_TEL", "")
            }
        )
    },
    /**
     * @name  获取控制股东信息
     * @method getOriginaOrgStockholderInfo
     * @param {Object} oldBusiData 
     * @returns {Array}
     */
    getOriginaOrgStockholderInfo(oldBusiData) {
        if (!oldBusiData || !oldBusiData.ORG_STOCKHOLDER_INFO || _.isEmpty(oldBusiData.ORG_STOCKHOLDER_INFO)) {
            return [];
        }
        _.each(oldBusiData.ORG_STOCKHOLDER_INFO || [], item => {
            Object.assign(item, {
                CONTROLLER: item.CONTROLER_NAME,
                CONTROLLER_ID_TYPE: item.CONTROLER_ID_TYPE,
                CONTROLLER_ID_CODE: item.CONTROLER_ID_NO,
                CONTROLLER_ID_EXP_DATE: item.CONTROLER_ID_EXP_DATE,
                CONTROLLER_NO: item.CONTROLER_NUM
            })
        })
        return oldBusiData.ORG_STOCKHOLDER_INFO || [];
    },
    /**
     * @name  获取产品托管人信息
     * @method getOriginaProTrusteInfo
     * @param {Object} oldBusiData 
     * @returns {Object}
     */
    getOriginaProTrusteInfo(oldBusiData) {
        if (!oldBusiData || !oldBusiData.PRO_TRUSTE_INFO || _.isEmpty(oldBusiData.PRO_TRUSTE_INFO) || _.isEmpty(oldBusiData.PRO_TRUSTE_INFO.PRO_TRUSTEE_NAME)) {
            return {};
        }
        return oldBusiData.PRO_TRUSTE_INFO || {};
    },
    /**
     * @name  获取产品投资顾问信息
     * @method getOriginaProInvestAdviserInfo
     * @param {Object} oldBusiData 
     * @returns {Object}
     */
    getOriginaProInvestAdviserInfo(oldBusiData) {
        if (!oldBusiData || !oldBusiData.PRO_INVEST_ADVISER_INFO || _.isEmpty(oldBusiData.PRO_INVEST_ADVISER_INFO) || _.isEmpty(oldBusiData.PRO_INVEST_ADVISER_INFO.INVEST_ADVISER)) {
            return {};
        }
        return oldBusiData.PRO_INVEST_ADVISER_INFO || {}
    },
    /**
     * @name  获取联系人信息
     * @method getOriginaLinkManInfo
     * @param {Object} oldBusiData 
     * @returns {Array}
     */
    getOriginaLinkManInfo(oldBusiData) {
        if (!oldBusiData || !oldBusiData.LINK_INFO || _.isEmpty(oldBusiData.LINK_INFO)) {
            return [];
        }
        oldBusiData.LINK_INFO = _.each( oldBusiData.LINK_INFO, (item, key) => {
            oldBusiData.LINK_INFO[key] = _.pick(item, ["LINKMAN_NO", "LINKMAN_NAME", "LINKMAN_ID_TYPE", "LINKMAN_ID", "LINKMAN_EXP_DATE", "LINKMAN_SEX", "LINKMAN_MOBILE_TEL", "LINKMAN_TEL", "LINKMAN_EMAIL", "LINKMAN_RELA", "LINKMAN_CORP_FAX", "IME_TYPE", "IME_NAME", "LINKMAN_ADDR", "LINKMAN_ZIP", "LINKMAN_CORP_URL"])
            oldBusiData.LINK_INFO[key] = _.mapValues(oldBusiData.LINK_INFO[key], _.trim);
        })
        return _.map(oldBusiData.LINK_INFO || [], obj => {
            return Object.assign({}, obj, {
                LINKMAN_EXP_DATE: obj.LINKMAN_EXP_DATE !== "0" ? obj.LINKMAN_EXP_DATE : ""
            })
        })
    },
    /**
     * @name  获取经办人信息
     * @method getOriginaAssignPersonInfo
     * @param {Object} oldBusiData 
     * @returns {Object}
     */
    getOriginaAssignPersonInfo(oldBusiData) {

        if (!oldBusiData || !oldBusiData.CORP_INFO || !oldBusiData.CORP_INFO.ASSIGN_PERSON_NAME) {
            return {};
        }
        return _.pick(oldBusiData.CORP_INFO, "ASSIGN_PERSON_ID", "ASSIGN_PERSON_ID_DAT", "ASSIGN_PERSON_ID_TYPE", "ASSIGN_PERSON_MOBILE_TEL", "ASSIGN_PERSON_NAME", "ASSIGN_PERSON_TEL")
    },
    /**
     * @name  获取诚信记录信息
     * @method getOriginaCreditRecordInfo
     * @param {Object} oldBusiData 
     * @returns {Array}
     */
    getOriginaCreditRecordInfo(oldBusiData) {
        if (!oldBusiData || !oldBusiData.CREDIT_RECORD_ARR || _.isEmpty(oldBusiData.CREDIT_RECORD_ARR) || !_.find(oldBusiData.CREDIT_RECORD_ARR, obj => !!obj.RECORD_SOURCE)) {
            return [];
        }
        oldBusiData.CREDIT_RECORD_ARR = _.map(oldBusiData.CREDIT_RECORD_ARR, item => {
            return _.mapValues(item, _.trim);
        })
        return oldBusiData.CREDIT_RECORD_ARR || []
    },
    /**
    * @name  获取负责人信息
    * @method getOriginaOrgResponsibleInfo
    * @param {Object} oldBusiData 
    * @returns {Object}
    */
    getOriginaOrgResponsibleInfo(oldBusiData) {
        if (!oldBusiData || !oldBusiData.CORP_INFO || !oldBusiData.CORP_INFO.ASSIGN_PERSON_NAME) {
            return {};
        }
        return _.pick(oldBusiData.CORP_INFO, "RESPONSIBILITY_REP", "RESPONSIBILITY_REP_ID_TYPE", 
            "RESPONSIBILITY_REP_ID_CODE", "RESPONSIBILITY_REP_ID_EXP_DATE");
    },
    /**
    * @name  获取份额登记机构信息
    * @method getOriginaShareRegOrgInfo
    * @param {Object} oldBusiData 
    * @returns {Object}
    */
    getOriginaShareRegOrgInfo(oldBusiData) {
        if (!oldBusiData || _.isEmpty(oldBusiData.PRO_SHAREREG_ORG_INFO)) {
            return {};
        }
        return oldBusiData.PRO_SHAREREG_ORG_INFO;
    },
    /**
    * @name  获取合伙人信息
    * @method getOriginaPartnerInfo
    * @param {Object} oldBusiData 
    * @returns {Array}
    */
    getOriginaPartnerInfo(oldBusiData) {
        if (!oldBusiData || _.isEmpty(oldBusiData.ORG_PARTNER_INFO)) {
            return {};
        }
        return _.map(oldBusiData.ORG_PARTNER_INFO || [], obj => _.pick(obj, "PARTNER_NAME", "LIAB_TYPE", "PARTNER_NO", "ID_DATE", "PID_CODE", "PID_TYPE"));
    },
    /**
    * @name  获取委派代表信息
    * @method getOriginaOrgLegalClientInfo
    * @param {Object} oldBusiData 
    * @returns {Object}
    */
    getOriginaOrgLegalClientInfo(oldBusiData) {
        if (!oldBusiData || _.isEmpty(oldBusiData.CORP_INFO)) {
            return {};
        }
        return _.pick(oldBusiData.CORP_INFO, "LEGAL_CLIENT_NAME", "LEGAL_CLIENT_ID_TYPE", "LEGAL_CLIENT_ID_CODE", "LEGAL_CLIENT_EXP_DATE");
    },
    /**
     * @name  获取反洗钱专有信息
     * @method getOriginaOrgAmlInfo
     * @param {Object} oldBusiData 
     * @returns {Array}
     */
    getOriginaOrgAmlInfo(oldBusiData) {
        if (!oldBusiData || _.isEmpty(oldBusiData.ORG_AML_INFO)) {
            return [];
        }
        return oldBusiData.ORG_AML_INFO
    },
    /**
     * 获取实际受益人信息
     * @param {object} oldBusiData 
     * @returns {array}
     */
    getOriginalOrgActualBeneficiaryInfo(oldBusiData) {
        if (_.isEmpty(oldBusiData) || _.isEmpty(oldBusiData.ACTUAL_BENEFICIARY_INFO)) {
            return [];
        }
        return _.map(oldBusiData.ACTUAL_BENEFICIARY_INFO, obj => {
            return _.pick(obj, "SPECIAL_PERSON_FLAG", "BENEFICIARY_ID_TYPE", "BENEFICIARY_TYPE", 
            "BENEFICIARY_ADDR", "SHARE_RATIO", "BENEFICIARY_EXP_DATE", "BENEFICIARY_NO", 
            "NATION", "BENEFICIARY_NAME", "BENEFICIARY_ID");
        })
    },
    /**
     * 获取非自然人类别（反洗钱客户类型）、受益所有人类别
     * @param {object} oldBusiData 
     */
    getOriginaOrgBeneficiaryType(oldBusiData) {
        if (_.isEmpty(oldBusiData)) {
            return {};
        }
        let beneficiaryInfo = this.getOriginalOrgActualBeneficiaryInfo(oldBusiData);
        let beneficiaryType = "";
        if (beneficiaryInfo.length) {
            beneficiaryType = beneficiaryInfo[0].BENEFICIARY_TYPE;
        }
        return Object.assign(_.pick(oldBusiData.CUST_BASIC_INFO, "AML_CUST_TYPE"), {
            BENEFICIARY_TYPE: beneficiaryType
        })
    },
    /*个人 */
    /**
     * @name  获取基本信息
     * @method getOriginaCustBasicInfo
     * @param {Object} oldBusiData 
     * @returns {Array}
     */
    getOriginaCustBasicInfo(oldBusiData) {
        if (!oldBusiData || _.isEmpty(oldBusiData.CUST_BASIC_INFO)) {
            return {};
        }
        let basicInfo = Object.assign(
            {},
            _.pick(oldBusiData.CUST_BASIC_INFO || {},
                "ID_TYPE", "ID_CODE", "ID_BEG_DATE", "ID_EXP_DATE", "SEX",
                "BIRTHDAY", "NATIONALITY", "SUBJECT_IDENTITY", "INOUTSIDE_IDENTITY", "CITIZENSHIP",
                "UNDER_AGE", "NATIVE_PLACE", "EDUCATION", "FZ_ID_TYPE", "FZ_ID_CODE", "FZ_ID_EXP_DATE",
                "ANTI_MONEYLAUNDRY_TYPE", "OCCU_TYPE", "VOCATION", "WORKPLACE", "OCCUPATION", "TRADE",
                "ID_ADDR", "ID_ISS_AGCY", "AML_REMARK"
            ),
            _.pick(oldBusiData.CUST_EXT_INFO || {}, "POSITION", "POSITION_PATION", "INDUS_GB", "INDUS_GB_SUB", "OCCU_GB", "OCCU_GB_SUB", "ANNUAL_INCOME", "OCCUPATION"), {
                CUST_FNAME: oldBusiData.CUST_BASIC_INFO.USER_FNAME || "",
                CUST_NAME: oldBusiData.CUST_BASIC_INFO.USER_NAME || "",
            }
        )
        basicInfo = _.mapValues(basicInfo, _.trim);
        return basicInfo || {};
    },
    /**
     * @name  获取联系信息
     * @method getOriginaCustLinkInfo
     * @param {Object} oldBusiData 
     * @returns {Array}
     */
    getOriginaCustLinkInfo(oldBusiData) {
        if(oldBusiData){
            let linkInfo = Object.assign(
                {},
                _.pick(oldBusiData.CUST_BASIC_INFO || {},
                    "MOBILE_TEL", "TEL", "EMAIL", "FAX", "ADDRESS", "ZIP_CODE", "AML_REMARK"
                )
            )
            linkInfo = _.mapValues(linkInfo, _.trim);
            return linkInfo || {};
        }else{
            return {};
        }
       
    },
    /**
     * @name  获取控制人信息
     * @method getOriginaCustLinkInfo
     * @param {Object} oldBusiData 
     * @returns {Array}
     */
    getOriginaCustControlerInfo(oldBusiData) {
        if(oldBusiData){
            let controlInfo = _.map(oldBusiData.CONTROLLER_INFO, item => {
                let controlInfo = _.pick(item,
                    "CONTROLER_NUM", "CONTROLER_RELATION", "CONTROLER_NAME", "CONTROLER_ID_TYPE", "CONTROLER_ID_NO",
                    "CONTROLER_SEX", "REG_DATE", "CONTROLER_ID_EXP_DATE", "CONTROLER_TEL", "CONTROLER_EMAIL",
                    "NATION", "OCCU_TYPE", "REG_ADDR", "ZIP_CODE"
                )
                controlInfo = _.mapValues(controlInfo, _.trim);
                return controlInfo
            })
            return controlInfo || [];
        }else{
            return [];
        }
      
    },

    /**
     * @name  获取受益人信息
     * @method getOriginaCustBeneficiaryInfo
     * @param {Object} oldBusiData 
     * @returns {Array}
     */
    getOriginaBeneficiaryInfo(oldBusiData) {
        if(oldBusiData){
            let beneficiaryInfo = _.map(oldBusiData.BENEFICIARY_INFO, item => {
                let infoItem = Object.assign(_.pick(item,
                    "BENEFICIARY_NO", "BENEFICIARY_RELA", "BENEFICIARY_NAME", "BENEFICIARY_ID_TYPE", "BENEFICIARY_ID",
                    "SEX", "BIRTHDAY", "BENEFICIARY_EXP_DATE", "BENEFICIARY_TEL", "EMAIL",
                    "NATION", "OCCU_TYPE", "BENEFICIARY_ADDR", "ZIP_CODE"
                ), {
                    BIRTHDAY: item.BIRTHDAY && item.BIRTHDAY !== '0' && item.BIRTHDAY || ""
                })
                infoItem = _.mapValues(infoItem, _.trim);
                return infoItem;
            })
            return beneficiaryInfo || [];  
        }else{
            return [];
        }
       
    },
    /**
     * @name  获取监护人信息
     * @method getOriginaCustGuardianInfo
     * @param {Object} oldBusiData 
     * @returns {Array}
     */
    getOriginaCustGuardianInfo(oldBusiData) {
        if(oldBusiData){
            let guardianInfo = _.map(oldBusiData.GUARDIAN_INFO, item => {
                return _.pick(item,
                    "GUARDIAN_NO", "GUARDIAN_RELA", "GUARDIAN_NAME", "GUARDIAN_ID_TYPE", "GUARDIAN_ID",
                    "GUARDIAN_EXP_DATE", "GUARDIAN_TEL"
                )
            })
            return guardianInfo || [];
        }else{
            return [];
        }
      
    },
    /**
     * @name  获取涉税信息
     * @method getOriginaOrgTaxInfo
     * @param {Object} oldBusiData 
     * @returns {Array}
     */
    getOriginaOrgTaxInfo(oldBusiData) {
        if (!oldBusiData || _.isEmpty(oldBusiData.CUST_TAX_INFO)) {
            return {};
        }
        return oldBusiData.CUST_TAX_INFO
    },
    /**
     * @name  获取控制人涉税信息
     * @method getOriginaOrgControllerTaxInfo
     * @param {Object} oldBusiData 
     * @returns {Array}
     */
    getOriginaOrgControllerTaxInfo(oldBusiData) {
        if (!oldBusiData || _.isEmpty(oldBusiData.CONTROLLER_TAX_INFO)) {
            return [];
        }
        return oldBusiData.CONTROLLER_TAX_INFO
    },

    /**
     *获取存量信息客户数据组装到KSCS_BUSI_CUST_INFO临时表数据
     * 
     */
    getKscsBusiCustInfoByPerson() {
        let customerInfo = storage.$storage.getJsonSession(defineConfig.$definecfg.CUSTOMER_INFO);
        //选择的登录方式
        let loginTypeInfo = storage.$storage.getJsonSession(defineConfig.$definecfg.LOGIN_TYPE_INFO);
        let agentNum = loginTypeInfo && loginTypeInfo.agentNum || "";
        if (!customerInfo || !customerInfo.CUST_CODE) {
            return {};
        }
        return sysConfig.$syscfg.K_Request('W0000312', {
            sysParamKeys: "ACCT_TYPE,ID_TYPE,APP_POLICE_VALIDATE,APP_BLACK_LIST_ZS,APP_AML_RISK_FLAG,APP_IS_OPEN_SECONDARY_DOC,IS_MUST_POLICE_VALIDATE,APP_EMAIL_VALID_SWITCH,APP_EMAIL_VALID_TIME,APP_MSG_VALID_SWITCH,MSG_VALID_TIME,APP_VOICE_MSG_VALID_SWITCH",
            USER_TYPE: customerInfo.USER_TYPE,
            CUST_CODE: customerInfo.CUST_CODE,
            ID_TYPE: customerInfo.ID_TYPE,
            ID_CODE: customerInfo.ID_CODE,
            CUST_FNAME: customerInfo.CUST_FNAME,
            AGENT_USER_CODE: agentNum
        }).then(res => {
            var oldBusiData = _.get(res, "Data[0]", {});
            return {
                ACCESS_MDF_INFO: {},
                CUST_INFO: {
                    CUST_BASIC_INFO: this.getOriginaCustBasicInfo(oldBusiData),
                    CUST_BASIC_CHANGE_INFO: Object.assign({}, this.getOriginaCustBasicInfo(oldBusiData), { DIFF_INFO: [] }),
                    CUST_LINK_CHANGE_INFO: Object.assign({}, this.getOriginaCustLinkInfo(oldBusiData), { DIFF_INFO: [] }),
                    CUST_LINK_INFO: this.getOriginaCustLinkInfo(oldBusiData)
                },
                INT_ORG: customerInfo.INT_ORG,
                PROF_INVESTOR_SOURCE: customerInfo.PROF_INVESTOR_SOURCE,
                PROF_INVESTOR_TYPE: customerInfo.PROF_INVESTOR_TYPE,
                USER_FNAME: this.getOriginaCustBasicInfo(oldBusiData).USER_FNAME,
                USER_NAME: this.getOriginaCustBasicInfo(oldBusiData).USER_NAME
            }
        });
    },
    /*****************继续办理**开始*********************************************************************** */
    /**
    * 获取客户数据库原始数据信息
    * @param {*} custInfo
    */
    getOriginalData(custTempInfo, userType) {
        let that = this;
        let custOriginalData = storage.$storage.getJsonSession(defineConfig.$definecfg.CUST_ORIGINAL_DATA);
        let loginTypeInfo = storage.$storage.getJsonSession(defineConfig.$definecfg.LOGIN_TYPE_INFO);
        let custmerInfo = storage.$storage.getJsonSession(defineConfig.$definecfg.CUSTOMER_INFO);
        _.isEmpty(custTempInfo.BASIC_INFO) && (custTempInfo.BASIC_INFO = custmerInfo);
        return Promise.all([
            sysConfig.$syscfg.K_Request("W0000312", {
                USER_TYPE: userType,
                CUST_CODE: custTempInfo.BASIC_INFO && custTempInfo.BASIC_INFO.CUST_CODE,
                ID_TYPE: custTempInfo.BASIC_INFO && custTempInfo.BASIC_INFO.ID_TYPE,
                ID_CODE: custTempInfo.BASIC_INFO && custTempInfo.BASIC_INFO.ID_CODE,
                CUST_FNAME: custTempInfo.BASIC_INFO && (custTempInfo.BASIC_INFO.USER_FNAME || custTempInfo.BASIC_INFO.CUST_FNAME),
                "AGENT_USER_CODE": loginTypeInfo ? loginTypeInfo.agentNum : ""
            })
        ]).then(data => {
            let newCustInfoData = data[0].Data && data[0].Data[0] || {};
            custOriginalData = _.assign(custOriginalData, newCustInfoData);

            if (userType == "0") {
                return that.getCustOriginalData(custOriginalData).then(cust360Data => {
                    return _.extend({}, cust360Data);
                });
            } else if (userType == "1") {
                return that.getOrgOriginalData(custOriginalData).then(cust360Data => {
                    return _.extend({}, cust360Data);
                });
            } else if (userType == "2") {
                return that.getProOriginalData(custOriginalData).then(cust360Data => {
                    return _.extend({}, cust360Data);
                });
            }
        })
    },

    /**
     * 获取个人户原始数据
     */
    getCustOriginalData: function (custInfo) {
        let that = this;
        let originalData = {
            CUST_INFO: {
                //联系信息
                CUST_LINK_INFO: that.getOriginaCustLinkInfo(custInfo),
                "CUST_LINK_CHANGE_INFO": _.extend({}, that.getOriginaCustLinkInfo(custInfo), { DIFF_INFO: [] }),

                //客户基本信息
                CUST_BASIC_INFO: _.extend({}, that.getOriginaCustBasicInfo(custInfo), {
                    "AGE": custInfo.BIRTHDAY && "" + date.getDifferYears(custInfo.BIRTHDAY, date.getClientDate()) || -1
                }),
                "CUST_BASIC_CHANGE_INFO": _.extend({}, that.getOriginaCustBasicInfo(custInfo), {
                    "AGE": custInfo.BIRTHDAY && "" + date.getDifferYears(custInfo.BIRTHDAY, date.getClientDate()) || -1,
                    "DIFF_INFO": []
                })
            },
            RELA_INFO: {
                //其他联系人信息
                CUST_OTHER_LINK_INFO: that.getOriginaLinkManInfo(custInfo),
                "CUST_OTHER_LINK_CHANGE_INFO": { "INFO": [], "IS_CHANGE": "0" },

                //受益人信息
                CUST_BENEFICIARY_INFO: that.getOriginaBeneficiaryInfo(custInfo),
                "CUST_BENEFICIARY_CHANGE_INFO": { "INFO": [], "IS_CHANGE": "0" },

                //实际控制人信息
                CUST_CONTROLER_INFO: that.getOriginaCustControlerInfo(custInfo),
                "CUST_CONTROLER_CHANGE_INFO": { "INFO": [], "IS_CHANGE": "0" },

                //监护人信息
                CUST_GUARDIAN_INFO: that.getOriginaCustGuardianInfo(custInfo),
                "CUST_GUARDIAN_CHANGE_INFO": { "INFO": [], "IS_CHANGE": "0" },

                //诚信记录信息
                CREDIT_RECORD_INFO: that.getOriginaCreditRecordInfo(custInfo),
                "CREDIT_RECORD_CHANGE_INFO": { "INFO": [], "IS_CHANGE": "0" },

                //客户涉税信息
                CUST_TAX_INFO: [that.getOriginaOrgTaxInfo(custInfo)],
                "CUST_TAX_CHANGE_INFO": [_.extend({}, that.getOriginaOrgTaxInfo(custInfo), { DIFF_INFO: [] })]
            },
            CUST_TAX_INFO: [_.extend({}, that.getOriginaOrgTaxInfo(custInfo), { DIFF_INFO: [] })]
        };

        return oppService.extendAccessMDFInfo(originalData);
    },

    /**
     * 获取机构户原始数据
     */
    getOrgOriginalData: function (custInfo) {
        let that = this;
        let originalData = {
            ORG_INFO: {
                //联系信息
                ORG_LINK_INFO: that.getOriginaOrgLinkInfo(custInfo),
                "ORG_LINK_CHANGE_INFO": _.extend({}, that.getOriginaOrgLinkInfo(custInfo), { "DIFF_INFO": [], OPER_TYPE: "3" }),

                //客户基本信息
                ORG_BASIC_INFO: _.extend({}, that.getOriginaOrgBasicInfoByOrg(custInfo), {
                    AGE: custInfo.BIRTHDAY && "" + date.getDifferYears(custInfo.BIRTHDAY, date.getClientDate()) || -1
                }),
                "ORG_BASIC_CHANGE_INFO": _.extend({}, that.getOriginaOrgBasicInfoByOrg(custInfo), { "DIFF_INFO": [], OPER_TYPE: "3" }),

                ////客户重要信息
                ORG_IMPORT_INFO: that.getOriginaOrgImportantInfo(custInfo),
                "ORG_IMPORT_CHANGE_INFO": _.extend({}, that.getOriginaOrgImportantInfo(custInfo), { "DIFF_INFO": [], OPER_TYPE: "3" })
            },
            RELA_INFO: {
                //受益所有人信息
                ORG_BENEFICIARY_OWNER_INFO: that.getOriginaBeneficiaryOwnerInfo(custInfo),
                "ORG_BENEFICIARY_OWNER_CHANGE_INFO": { "INFO": [], "IS_CHANGE": "0" },

                //实际受益人信息
                ORG_BENEFICIARY_INFO: that.getOriginaBeneficiaryInfo(custInfo),
                "ORG_BENEFICIARY_CHANGE_INFO": { "INFO": [], "IS_CHANGE": "0" },

                //实际控制人信息
                ORG_CONTROLER_INFO: that.getOriginaOrgControllerInfo(custInfo),
                "ORG_BENEFICIARY_CHANGE_INFO": { "INFO": [], "IS_CHANGE": "0" },

                //负责人信息
                ORG_RESPONSIBLE_INFO: that.getOriginaOrgResponsibleInfo(custInfo),
                "ORG_RESPONSIBLE_CHANGE_INFO": _.extend({}, that.getOriginaOrgResponsibleInfo(custInfo), { "DIFF_INFO": [], OPER_TYPE: "3" }),

                //控股股东信息
                ORG_STOCKHOLDER_INFO: that.getOriginaOrgStockholderInfo(custInfo),
                "ORG_STOCKHOLDER_CHANGE_INFO": { "INFO": [], "IS_CHANGE": "0" },

                //法定代表人信息
                ORG_LEGAL_REP_INFO: that.getOriginaOrgLegalRepInfo(custInfo),
                "ORG_LEGAL_REP_CHANGE_INFO": _.extend({}, that.getOriginaOrgLegalRepInfo(custInfo), { "DIFF_INFO": [], OPER_TYPE: "3" }),

                //合伙人信息
                ORG_PARTNER_INFO: that.getOriginaPartnerInfo(custInfo),
                "ORG_PARTNER_CHANGE_INFO": { "INFO": [], "IS_CHANGE": "0" },

                //委派代表人信息
                ORG_LEGAL_CLIENT_INFO: that.getOriginaOrgLegalClientInfo(custInfo),
                "ORG_LEGAL_CLIENT_CHANGE_INFO": { "DIFF_INFO": [], OPER_TYPE: "3" },

                //开户经办人信息
                ORG_ASSIGN_PERSON_INFO: that.getOriginaAssignPersonInfo(custInfo),
                "ORG_ASSIGN_PERSON_CHANGE_INFO": _.extend({}, that.getOriginaAssignPersonInfo(custInfo), { "DIFF_INFO": [], OPER_TYPE: "3" }),

                //联系人信息 
                ORG_LINKMAN_INFO: that.getOriginaLinkManInfo(custInfo),
                "ORG_LINKMAN_CHANGE_INFO": { "INFO": [], "IS_CHANGE": "0" },

                //诚信记录信息
                CREDIT_RECORD_INFO: that.getOriginaCreditRecordInfo(custInfo),
                "CREDIT_RECORD_CHANGE_INFO": { "INFO": [], "IS_CHANGE": "0" },

                //客户涉税信息
                ORG_TAX_INFO: [that.getOriginaOrgTaxInfo(custInfo)],
                "ORG_TAX_CHANGE_INFO": _.extend({}, that.getOriginaOrgTaxInfo(custInfo), { "DIFF_INFO": [], OPER_TYPE: "3" }),
                "CREDIT_RECORD_CHANGE_INFO": { "INFO": [], "IS_CHANGE": "0" }
            }
        };

        return oppService.extendAccessMDFInfo(originalData);
    },

    /**
     * 获取产品户原始数据
     */
    getProOriginalData: function (custInfo) {
        let that = this;
        let originalData = {
            ORG_INFO: {
                //联系信息
                ORG_LINK_INFO: that.getOriginaOrgLinkInfo(custInfo),
                "ORG_LINK_CHANGE_INFO": _.extend({}, that.getOriginaOrgLinkInfo(custInfo), { "DIFF_INFO": [], OPER_TYPE: "3" }),

                //受益所有人
                ORG_BENEFICIARY_OWNER_INFO: that.getOriginaBeneficiaryOwnerInfo(custInfo),
                "ORG_BENEFICIARY_OWNER_CHANGE_INFO": { "INFO": [], "IS_CHANGE": "0" },

                //受益人信息
                ORG_BENEFICIARY_INFO: that.getOriginaBeneficiaryInfo(custInfo),
                "ORG_BENEFICIARY_CHANGE_INFO": { "INFO": [], "IS_CHANGE": "0" },

                //账户实际操作人信息
                ORG_ACTUAL_CONTROLER_INFO: that.getOriginaActualControllerInfo(custInfo),
                "ORG_ACTUAL_CONTROLER_CHANGE_INFO": { "INFO": [], "IS_CHANGE": "0" },

                //实际控制人信息
                ORG_CONTROLER_INFO: that.getOriginaOrgControllerInfo(custInfo),
                "ORG_CONTROLER_CHANGE_INFO": { "INFO": [], "IS_CHANGE": "0" },

                //机构基本信息
                ORG_BASIC_INFO: that.getOriginaOrgBasicInfoByPro(custInfo),
                "ORG_BASIC_CHANGE_INFO": _.extend({}, that.getOriginaOrgBasicInfoByPro(custInfo), { "DIFF_INFO": [], OPER_TYPE: "3" })
            },
            MANAGER_INFO: {
                //管理人基本信息
                PRO_MANAGER_INFO: that.getOriginaProManagerBasicInfo(custInfo),
                "PRO_MANAGER_CHANGE_INFO": _.extend({}, that.getOriginaProManagerBasicInfo(custInfo), { "DIFF_INFO": [], OPER_TYPE: "3" }),

                //控股股东信息
                ORG_STOCKHOLDER_INFO: that.getOriginaOrgStockholderInfo(custInfo),
                "ORG_STOCKHOLDER_CHANGE_INFO": { "INFO": [], "IS_CHANGE": "0" },

                //负责人信息
                ORG_RESPONSIBLE_INFO: that.getOriginaOrgResponsibleInfo(custInfo),
                "ORG_RESPONSIBLE_CHANGE_INFO": _.extend({}, that.getOriginaOrgResponsibleInfo(custInfo), { "DIFF_INFO": [], OPER_TYPE: "3" }),

                //法定代表人信息
                ORG_LEGAL_REP_INFO: that.getOriginaOrgLegalRepInfo(custInfo),
                "ORG_LEGAL_REP_CHANGE_INFO": _.extend({}, that.getOriginaOrgLegalRepInfo(custInfo), { "DIFF_INFO": [] }),

                //管理人重要信息
                PRO_MANAGER_IMPORT_INFO: that.getOriginaProManagerImportantInfo(custInfo),
                "PRO_MANAGER_IMPORT_CHANGE_INFO": _.extend({}, that.getOriginaProManagerImportantInfo(custInfo), { "DIFF_INFO": [] }),

                //委派代表人信息
                ORG_LEGAL_CLIENT_INFO: that.getOriginaOrgLegalClientInfo(custInfo),
                "ORG_LEGAL_CLIENT_CHANGE_INFO": { "DIFF_INFO": [] }
            },
            RELA_INFO: {
                //产品托管人信息
                PRO_TRUSTEE_INFO: that.getOriginaProTrusteInfo(custInfo),
                "PRO_TRUSTEE_CHANGE_INFO": _.extend({}, that.getOriginaProTrusteInfo(custInfo), { "DIFF_INFO": [] }),

                //产品投资顾问信息
                PRO_INVEST_ADVISER_INFO: that.getOriginaProInvestAdviserInfo(custInfo),
                "PRO_INVEST_ADVISER_CHANGE_INFO": _.extend({}, that.getOriginaProInvestAdviserInfo(custInfo), { "DIFF_INFO": [] }),

                //份额登记机构信息
                PRO_SHAREREG_ORG_INFO: that.getOriginaShareRegOrgInfo(custInfo),
                "PRO_SHAREREG_ORG_CHANGE_INFO": _.extend({}, that.getOriginaShareRegOrgInfo(custInfo), { "DIFF_INFO": [] }),

                //反洗钱专有信息
                ORG_AML_INFO: that.getOriginaOrgAmlInfo(custInfo),
                "ORG_AML_CHANGE_INFO": { "INFO": [], "IS_CHANGE": "0" },

                //产品联系人信息
                ORG_LINKMAN_INFO: that.getOriginaLinkManInfo(custInfo),
                "ORG_LINKMAN_CHANGE_INFO": { "INFO": [], "IS_CHANGE": "0" },

                //开户经办人信息
                ORG_ASSIGN_PERSON_INFO: that.getOriginaAssignPersonInfo(custInfo),
                "ORG_ASSIGN_PERSON_CHANGE_INFO": _.extend({}, that.getOriginaAssignPersonInfo(custInfo), { "DIFF_INFO": [] }),

                //诚信记录信息
                CREDIT_RECORD_INFO: that.getOriginaCreditRecordInfo(custInfo),
                "CREDIT_RECORD_CHANGE_INFO": { "INFO": [], "IS_CHANGE": "0" },

                //获取涉税信息
                ORG_TAX_INFO: that.getOriginaOrgTaxInfo(custInfo),

                //获取控制人涉税信息
                CONTROLLER_TAX_INFO: that.getOriginaOrgControllerTaxInfo(custInfo)
            }
        };
        return oppService.extendAccessMDFInfo(originalData);
    }
    /*****************继续办理**结束*********************************************************************** */


}