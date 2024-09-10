/*
 *   产品联系人信息模块
 *   方法封装
 *   @author  lindw
 */

import date from '../../../../../../../tools/date.js'
import * as utils from "../../../../../../../tools/util"
import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../../business/businessTools/bizPublicMethod.js"
import custInfoModel from '../../common/cust-info-model.js'

export default {
    bizProLinkmanInfoBeforeLoadBiz: (_this) => {
        // 字段设置
        let fieldData = _this.groupDatas.LINK_INFO.ORG_LINKMAN_INFO[0]["FIELDS"];
        //过滤证件类型
        let dictItem = _this["oppBusiData"]["VALID_ID_TYPE_FOR_BOTH"]
        fieldData.LINKMAN_ID_TYPE.FIELD_DICT_FILTER = _.filter(dictItem, function (item) {
            return item.charAt(0) == '0'
        })
        fieldData.LINKMAN_TEL.VALID_TYPE = "tel";
        // fieldData.LINKMAN_EMAIL.
        //新增是否需要展示普通联系人全部字段公共参数
        let linkManFieldShowAll = _this.oppBusiData.busiCommonParams.LINKMAN_FIELD_SHOWALL;
        let showFieldArr = ['LINKMAN_TEL', 'LINKMAN_RELA', 'LINKMAN_SEX', 'LINKMAN_ZIP', 'IME_TYPE', 'IME_NAME', 'LINKMAN_CORP_FAX', 'LINKMAN_CORP_URL', 'LINKMAN_ADDR'];
        if (linkManFieldShowAll == "1") {
            _.each(showFieldArr, fieldId => fieldData[fieldId].FIELD_CONTROL = "0");
            fieldData.LINKMAN_RELA.FIELD_TYPE = 'normalinput';
        } else {
            _.each(showFieldArr, fieldId => fieldData[fieldId].FIELD_CONTROL = "1");
        }
        // 需求: 需要展示联系人邮箱字段
        fieldData.LINKMAN_EMAIL.FIELD_CONTROL = "0";
        _this.groupDatasTpl.LINK_INFO.ORG_LINKMAN_INFO = _.cloneDeep(_this.groupDatas.LINK_INFO.ORG_LINKMAN_INFO);
        var linkManInfo = custInfoModel.getOriginaLinkManInfo(_this.oppBusiData.oldBusiData);
        if (!_.isEmpty(linkManInfo)) {
            bizPublicMethod.$blMethod.parseMoudleArray(_this, _this.groupDatas.LINK_INFO["ORG_LINKMAN_INFO"], linkManInfo);
        }
        fieldData.LINKMAN_RELA.VALID_TYPE = "length[0,32]";
    },
    bizProLinkmanInfoAfterLoadBiz: (_this) => {
        if (_this.oppBusiData.newBusiData && _this.oppBusiData.newBusiData.RELA_INFO && _this.oppBusiData.newBusiData.RELA_INFO.ORG_LINKMAN_INFO) {
            bizPublicMethod.$blMethod.parseMoudleArray(_this, _this.groupDatas.LINK_INFO["ORG_LINKMAN_INFO"], _this.oppBusiData.newBusiData.RELA_INFO.ORG_LINKMAN_INFO);
        }
    },
    bizProLinkmanInfoPageActived: (_this) => {
        // 字段设置
        let fieldData = _this.groupDatas.LINK_INFO.ORG_LINKMAN_INFO[0]["FIELDS"];
        fieldData.LINKMAN_ID.VALID_TYPE = 'numCharMinus[0,48]|on-blur'
        fieldData.LINKMAN_NAME.VALID_TYPE = 'val[1,16]'
        //todo
    },
    bizProLinkmanInfoValidate: (_this) => {
        let idCodeList = _.map(_this.groupDatas.LINK_INFO.ORG_LINKMAN_INFO, module => {
            return module.FIELDS.LINKMAN_ID.DEFAULT_VALUE;
        })
        if (idCodeList.length > _.uniq(idCodeList).length) {
            _this.messageBox({
                hasMask: true,
                messageText: "联系人信息的证件号码有重复记录，请删掉重复记录！",
                confirmButtonText: '确定',
                typeMessage: 'warn',
                showMsgBox: true,
            });
            return false;
        }
    },
    bizProLinkmanInfoBeforeSave: (_this, params) => {
        let linkmanData = bizPublicSaveMethod.getModuleArrFoyKey(_this, "ORG_LINKMAN_INFO", true);
        let isOpenAcct = _this.$storage.getJsonSession(_this.$definecfg.IS_OPEN_ACCT_BIZ);

        let busiData = _this.oppBusiData.newBusiData;
        let relaInfo = busiData && busiData.RELA_INFO || {};
        relaInfo.ORG_LINKMAN_INFO = linkmanData;
        if (isOpenAcct == "1") {
            let orgLinkManChangeInfo = bizPublicMethod.$blMethod.getArrDiff(linkmanData, custInfoModel.getOriginaLinkManInfo(_this.oppBusiData.oldBusiData), "LINKMAN_NO", "VALIDATE_CODE");
            relaInfo.ORG_LINKMAN_CHANGE_INFO = orgLinkManChangeInfo;
        }
        params.RELA_INFO = params.RELA_INFO || {};
        Object.assign(params.RELA_INFO, relaInfo);
    },
    //=======================================字段关联逻辑=======================================//
    "CHECK_LINKMAN_ID_TYPE": (_this, field, fieldData) => {
        _this.$blMethod.setValidType(_this, field, fieldData, "LINKMAN_ID")
        fieldData.LINKMAN_ID.DEFAULT_VALUE = "";
    },
    "CHECK_LINKMAN_ID": (_this, field, fieldData) => {
        if (field.DEFAULT_VALUE != "") {
            let repeatModule = _.filter(_this.groupDatas.LINK_INFO.ORG_LINKMAN_INFO, module => {
                return module.FIELDS.LINKMAN_ID.DEFAULT_VALUE == field.DEFAULT_VALUE;
            })
            if (repeatModule && repeatModule.length >= 2) {
                _this.$nextTick(() => {
                    _this.$blMethod.changeFieldError(field, false, '联系人证件号码已经存在，不能重复添加')
                })
            }
        }
    },
    LINKMANINFO_DELETE_MODULE_FINISHED: (_this, fieldData) => {
        _.each(_this.$refs, (item, key) => {
            if (key.indexOf("ORG_LINKMAN_INFO") > -1 && item.length > 0) {
                item[0].$refs.LINKMAN_ID[0].field.message = "";
                item[0].$refs.LINKMAN_ID[0].$refs.LINKMAN_ID.validate("change");
            }
        })
    }
}
