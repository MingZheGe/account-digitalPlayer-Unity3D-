/*
 *   合伙人信息
 *   方法封装
 */

import date from '../../../../../../../tools/date.js'
import * as utils from "../../../../../../../tools/util"
import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../businessTools/bizPublicMethod.js"
import custInfoModel from '../../common/cust-info-model.js'


//开户和非开户 字段数据加载 公共操作
const bizProPartnerInfoBeforeLoadBizCommon = (_this) => {
    let saveGroupId = _this.userType == "1" ? "RELA_INFO" : _this.userType == "2" ? "OTHER_INFO" : "RELA_INFO";
    _this.groupDatas[saveGroupId]["ORG_PARTNER_INFO"][0].MAX_LENGTH = 99;
    _this.groupDatasTpl[saveGroupId]["ORG_PARTNER_INFO"][0].MAX_LENGTH = 99;
}

export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizProPartnerInfoBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizProPartnerInfoBeforeLoadBiz: function (_this) {
        bizProPartnerInfoBeforeLoadBizCommon(_this)
        let saveGroupId = _this.userType == "1" ? "RELA_INFO" : _this.userType == "2" ? "OTHER_INFO" : "RELA_INFO";
        var partnerInfo = custInfoModel.getOriginaPartnerInfo(_this.oppBusiData.oldBusiData);
        if (!_.isEmpty(partnerInfo)) {
            bizPublicMethod.$blMethod.parseMoudleArray(_this, _this.groupDatas[saveGroupId]["ORG_PARTNER_INFO"], partnerInfo);
        }

    },
    bizProPartnerInfoBeforeLoadBizOpenAcct: function (_this) {
        bizProPartnerInfoBeforeLoadBizCommon(_this)
    },
    /*
     *@method bizProPartnerInfoAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-13 09:42:56
     */
    bizProPartnerInfoAfterLoadBiz: function (_this) {
        let saveGroupId = _this.userType == "1" ? "RELA_INFO" : _this.userType == "2" ? "MANAGER_INFO" : "RELA_INFO";
        let groupId = _this.userType == "1" ? "RELA_INFO" : _this.userType == "2" ? "OTHER_INFO" : "RELA_INFO";
        if (_.get(_this.oppBusiData.newBusiData, saveGroupId + ".ORG_PARTNER_INFO", "")) {
            bizPublicMethod.$blMethod.parseMoudleArray(_this, _this.groupDatas[groupId]["ORG_PARTNER_INFO"], _.get(_this.oppBusiData.newBusiData, saveGroupId + ".ORG_PARTNER_INFO", []));
        }
        
        let SZORG_TYPE = _this.userType == "1" ? 
        _this.groupDatas["ORG_INFO"]["ORG_BASIC_INFO"]["0"]["FIELDS"]["SZORG_TYPE"].DEFAULT_VALUE : _this.groupDatas["MANAGER_INFO"]["MANAGER_BASIC_INFO"]["0"]["FIELDS"]["SZORG_TYPE"].DEFAULT_VALUE;
        let PRO_SZORG_TYPE_FOR_PARTNER = _this.$blMethod.getJsonSessionBusiCommParam(_this, "PRO_SZORG_TYPE_FOR_PARTNER") || "21,22,23,24,25a";
        if (_.indexOf(PRO_SZORG_TYPE_FOR_PARTNER.split(","), SZORG_TYPE) > -1) {
            _this.$router.showRoute("合伙人信息")
        } else {
            _this.$router.hideRoute("合伙人信息")
        }
    },
    /*
     *@method bizProPartnerInfoBeforeSave
     *@desc 钩子函数 自定义保存数
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizProPartnerInfoBeforeSave: function (_this, params) {
        let orgPartnerInfo = bizPublicSaveMethod.getModuleArrFoyKey(_this, "ORG_PARTNER_INFO", true),
            saveGroupId = _this.userType == "1" ? "RELA_INFO" : _this.userType == "2" ? "MANAGER_INFO" : "RELA_INFO";
        let isOpenAcct = _this.$storage.getJsonSession(_this.$definecfg.IS_OPEN_ACCT_BIZ);

        let busiData = _this.oppBusiData.newBusiData;
        let managerInfo = busiData && busiData[saveGroupId] || {};
        managerInfo.ORG_PARTNER_INFO = orgPartnerInfo;
        if (isOpenAcct == "1") {
            let originaOrgPartnerInfo = custInfoModel.getOriginaPartnerInfo(_this.oppBusiData.oldBusiData);
            let partnerChangeInfo = bizPublicMethod.$blMethod.getArrDiff(
                orgPartnerInfo, originaOrgPartnerInfo, "PARTNER_NO"
            )
            managerInfo.ORG_PARTNER_CHANGE_INFO = partnerChangeInfo;
        }

        params[saveGroupId] = params[saveGroupId] || {};
        Object.assign(params[saveGroupId], managerInfo);
    },
    /*
     *@method bizProPartnerInfoAfterSave
     *@desc 钩子函数 自定义保存数
     */
    bizProPartnerInfoAfterSave: (_this, newData) => {
        let saveGroupId = _this.userType == "1" ? "RELA_INFO" : _this.userType == "2" ? "MANAGER_INFO" : "RELA_INFO";
        if (_this.oppBusiData.newBusiData) {
            let newObj = {
                [saveGroupId]: _.get(newData, saveGroupId, {})
            }
            _.assign(_this.oppBusiData.newBusiData, newObj);
        }
    },
    /*
     *@method bizProPartnerInfoValidate
     *@desc 钩子函数 下一步验证
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizProPartnerInfoValidate: function (_this) {

    },

    /*
     *@method bizProPartnerInfoPageActivated
     *@desc 钩子函数：页面激活
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizProPartnerInfoPageActivated: function (_this) {
        let saveGroupId = _this.userType == "1" ? "RELA_INFO" : _this.userType == "2" ? "OTHER_INFO" : "RELA_INFO";

        _this.groupDatas[saveGroupId].ORG_PARTNER_INFO[0].FIELDS.PID_CODE.promptValue = _this.groupDatas[saveGroupId].ORG_PARTNER_INFO[0].FIELDS.PID_CODE.DEFAULT_VALUE;

        let groupId = _this.userType == "1" ? "RELA_INFO" : _this.userType == "2" ? "OTHER_INFO" : "RELA_INFO";
        _.each(_this.groupDatas[groupId]["ORG_PARTNER_INFO"], item => {
            item.FIELDS.PID_TYPE.FIELD_DICT_FILTER = _this.oppBusiData["VALID_ID_TYPE_FOR_BOTH"];
        })
    },

    bizProPartnerInfoPreValidate: function (_this) {},
    //----------------------业务函数----------------------------------//

    CHECK_PID_TYPE: (_this, field, fieldData) => {
        _this.$blMethod.setValidType(_this, field, fieldData, "PID_CODE")
    },
    CHECK_PID_CODE: (_this, field, fieldData) => {
        let saveGroupId = _this.userType == "1" ? "RELA_INFO" : _this.userType == "2" ? "OTHER_INFO" : "RELA_INFO";
        if (field.DEFAULT_VALUE != "") {
            let repeatModule = _.filter(_this.groupDatas[saveGroupId].ORG_PARTNER_INFO, module => {
                return module.FIELDS.PID_CODE.DEFAULT_VALUE == field.DEFAULT_VALUE;
            })
            if (repeatModule && repeatModule.length >= 2) {
                _this.$nextTick(() => {
                    _this.$blMethod.changeFieldError(field, false, "合伙人证件号码已经存在，不能重复输入");
                })
            }
        }
    },
    PARTNERINFO_DELETE_MODULE_FINISHED: (_this, fieldData) => {
        _.each(_this.$refs, (item, key) => {
            if (key.indexOf("ORG_PARTNER_INFO") > -1 && item.length > 0) {
                item[0].$refs.PID_CODE[0].field.message = "";
                item[0].$refs.PID_CODE[0].$refs.PID_CODE.validate("change");
            }
        })
    }

}
