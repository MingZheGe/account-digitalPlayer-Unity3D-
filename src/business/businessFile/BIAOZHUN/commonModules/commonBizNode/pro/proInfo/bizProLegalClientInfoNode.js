/*
 *   委派代表人信息
 *   方法封装
 */

import date from '../../../../../../../tools/date.js'
import * as utils from "../../../../../../../tools/util"
import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../businessTools/bizPublicMethod.js"
import custInfoModel from '../../common/cust-info-model.js'


//开户和非开户 字段数据加载 公共操作
const bizProLegalClientInfoBeforeLoadBizCommon = (_this) => {

}

export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizProLegalClientInfoBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizProLegalClientInfoBeforeLoadBiz: function (_this) {
        bizProLegalClientInfoBeforeLoadBizCommon(_this)
        var originaOrgLegalClientInfo = custInfoModel.getOriginaOrgLegalClientInfo(_this.oppBusiData.oldBusiData);
        if(!_.isEmpty(originaOrgLegalClientInfo)) {
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["ORG_LEGAL_CLIENT_INFO"], originaOrgLegalClientInfo);
        }

    },
    bizProLegalClientInfoBeforeLoadBizOpenAcct: function (_this) {
        bizProLegalClientInfoBeforeLoadBizCommon(_this)
    },
    /*
     *@method bizProLegalClientInfoAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-13 09:42:56
     */
    bizProLegalClientInfoAfterLoadBiz: function (_this) {
        let saveGroupId = _this.userType == "2" ? "MANAGER_INFO" : "RELA_INFO";
        let groupId = _this.userType == "2" ? "MANAGER_INFO" : "ORG_INFO";
        if (_.get(_this.oppBusiData.newBusiData, saveGroupId + ".ORG_LEGAL_CLIENT_INFO", "") &&
            Object.keys(_this.oppBusiData.newBusiData[saveGroupId].ORG_LEGAL_CLIENT_INFO).length) {
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["ORG_LEGAL_CLIENT_INFO"], _this.oppBusiData.newBusiData[saveGroupId].ORG_LEGAL_CLIENT_INFO);
        }
         // 展示公安联网校验按钮
         _this.groupDatas[groupId].ORG_LEGAL_CLIENT_INFO[0].MODULE_CUSTOMIZE = "1";
         _this.groupDatasTpl[groupId].ORG_LEGAL_CLIENT_INFO[0].MODULE_CUSTOMIZE = "1";
         _this.oldGroupDatas[groupId].ORG_LEGAL_CLIENT_INFO[0].MODULE_CUSTOMIZE = "1";
         _this.groupDatas[groupId].ORG_LEGAL_CLIENT_INFO[0].MODULE_CUSTOMIZE_TXT = "公安联网校验";
         _this.groupDatasTpl[groupId].ORG_LEGAL_CLIENT_INFO[0].MODULE_CUSTOMIZE_TXT = "公安联网校验";
         _this.oldGroupDatas[groupId].ORG_LEGAL_CLIENT_INFO[0].MODULE_CUSTOMIZE_TXT = "公安联网校验";
    },
    /*
     *@method bizProLegalClientInfoBeforeSave
     *@desc 钩子函数 自定义保存数
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizProLegalClientInfoBeforeSave: function (_this, params) {
        let orgLegalClientInfo = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "ORG_LEGAL_CLIENT_INFO"),
            saveGroupId = _this.userType == "2" ? "MANAGER_INFO" : "RELA_INFO",
            groupId = _this.userType == "2" ? "MANAGER_INFO" : "ORG_INFO";
        let isOpenAcct = _this.$storage.getJsonSession(_this.$definecfg.IS_OPEN_ACCT_BIZ);

        //委派代表不显示就传空对象
        if (_this.groupDatas[groupId].ORG_LEGAL_CLIENT_INFO[0].MODULE_CONTROL == "0") {
            orgLegalClientInfo = {};
        }
        let busiData = _this.oppBusiData.newBusiData;
        let managerInfo = busiData && busiData[saveGroupId] || {};
        managerInfo.ORG_LEGAL_CLIENT_INFO = orgLegalClientInfo;
        if(isOpenAcct == "1") {
            var orgLegalClientDiffInfo = bizPublicMethod.$blMethod.compareInfo2(custInfoModel.getOriginaOrgLegalClientInfo(_this.oppBusiData.oldBusiData), orgLegalClientInfo);
            managerInfo.ORG_LEGAL_CLIENT_CHANGE_INFO = Object.assign({}, orgLegalClientInfo, {
                DIFF_INFO: orgLegalClientDiffInfo
            })
        }

        Object.assign(params[saveGroupId], managerInfo);
    },
    /*
     *@method bizProLegalClientInfoAfterSave
     *@desc 钩子函数 自定义保存数
     */
    bizProLegalClientInfoAfterSave: (_this, newData) => {
        let saveGroupId = _this.userType == "1" ? "RELA_INFO" : _this.userType == "2" ? "MANAGER_INFO" : "RELA_INFO";
        if (_this.oppBusiData.newBusiData) {
            let newObj = {
                [saveGroupId]: _.get(newData, saveGroupId, {})
            }
            _.assign(_this.oppBusiData.newBusiData, newObj);
        }
    },
    /*
     *@method bizProLegalClientInfoValidate
     *@desc 钩子函数 下一步验证
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizProLegalClientInfoValidate: function (_this) {

    },

    /*
     *@method bizProLegalClientInfoPageActivated
     *@desc 钩子函数：页面激活
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizProLegalClientInfoPageActivated: function (_this) {
        //过滤证件类型
        let saveGroupId = _this.userType == "2" ? "MANAGER_INFO" : "ORG_INFO",
            dictItem = _this["oppBusiData"]["VALID_ID_TYPE_FOR_BOTH"]
        _this.groupDatas[saveGroupId].ORG_LEGAL_CLIENT_INFO[0].FIELDS.LEGAL_CLIENT_ID_TYPE.FIELD_DICT_FILTER = _.filter(dictItem, function (item) {
            return item.charAt(0) == '0'
        })

        _this.groupDatas[saveGroupId].ORG_LEGAL_CLIENT_INFO[0].FIELDS.LEGAL_CLIENT_ID_CODE.promptValue = _this.groupDatas[saveGroupId].ORG_LEGAL_CLIENT_INFO[0].FIELDS.LEGAL_CLIENT_ID_CODE.DEFAULT_VALUE;

    },

    bizProLegalClientInfoPreValidate: function (_this) {},
    //----------------------业务函数----------------------------------//

    CHECK_LEGAL_CLIENT_ID_TYPE: (_this, field, fieldData) => {
        let defaultValue = field.DEFAULT_VALUE || "";
        _this.$blMethod.setValidType(_this, field, fieldData, "LEGAL_CLIENT_ID_CODE");
    }

}
