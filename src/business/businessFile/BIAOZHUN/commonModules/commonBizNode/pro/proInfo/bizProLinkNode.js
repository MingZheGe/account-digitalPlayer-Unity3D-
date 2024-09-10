/*
 *   产品管理人模块
 *   方法封装
 *   @author  yangyp
 */

import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../businessTools/bizPublicMethod.js"
import custInfoModel from '../../common/cust-info-model.js'
//由于需求经常变更需不需要验证码 所以设置这个控制
const isOpenMobile = false;
//开户和非开户 字段数据加载 公共操作
const bizProLinkNodeBeforeLoadBizCommon = (_this) => {
    let fieldData = _this.groupDatas.LINK_INFO.ORG_LINK_INFO[0]["FIELDS"];
        fieldData.OFFICE_ADDR.VALID_TYPE = "length[16,120]";
        fieldData.MOBILE_TEL.MAX_LENGTH = "11"
        if (isOpenMobile) {
            //显示验证码
            fieldData.MOBILE_TEL.IS_SHOW_BUTTON = true;
            fieldData.MOBILE_TEL.FIELD_BUTTON_TXT = "获取验证码";
            fieldData.MOBILE_TEL.SUFFIX_ICON = "";
            //验证码的检验函数修改防止冲突
            fieldData.VALIDATE_CODE.FIELD_FUNCTION = "CHECK_LINK_VALIDATE_CODE";
            fieldData.VALIDATE_CODE.VALID_TYPE = "num[6]|on-blur";
            fieldData.VALIDATE_CODE.FIELD_CONTROL = "1";
        }
        
}

export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizProLinkNodeBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizProLinkNodeBeforeLoadBiz: function (_this) {
        bizProLinkNodeBeforeLoadBizCommon(_this)

        var proLinkInfo = custInfoModel.getOriginaOrgLinkInfo(_this.oppBusiData.oldBusiData)
        if(!_.isEmpty(proLinkInfo)) {
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["ORG_LINK_INFO"], proLinkInfo);      
        }
    },
    bizProLinkNodeBeforeLoadBizOpenAcct: function (_this) {
        bizProLinkNodeBeforeLoadBizCommon(_this)
    },
    /*
     *@method bizProLinkNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-13 09:42:56
     */
    bizProLinkNodeAfterLoadBiz: function (_this) {
        if(_.get(_this.oppBusiData.newBusiData, "ORG_INFO.ORG_LINK_INFO", "")
            && Object.keys(_this.oppBusiData.newBusiData.ORG_INFO.ORG_LINK_INFO).length){
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["ORG_LINK_INFO"], _this.oppBusiData.newBusiData.ORG_INFO.ORG_LINK_INFO);      
        }
        
        
    },
    /*
     *@method bizProLinkNodeBeforeSave
     *@desc 钩子函数 自定义保存数
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizProLinkNodeBeforeSave: function (_this, params) {
        let orgLinkInfo = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "ORG_LINK_INFO");
        let isOpenAcct = _this.$storage.getJsonSession(_this.$definecfg.IS_OPEN_ACCT_BIZ);

        let busiData = _this.oppBusiData.newBusiData;
        let orgInfo = busiData && busiData.ORG_INFO || {};
        orgInfo.ORG_LINK_INFO = orgLinkInfo;

        if(isOpenAcct == "1") {
            var orgLinkDiffInfo = bizPublicMethod.$blMethod.compareInfo2(custInfoModel.getOriginaOrgLinkInfo(_this.oppBusiData.oldBusiData), orgLinkInfo,"VALIDATE_CODE")
            orgInfo.ORG_LINK_CHANGE_INFO = Object.assign({}, orgLinkInfo, {
                DIFF_INFO: orgLinkDiffInfo
            })
        }
        
        params.ORG_INFO = params.ORG_INFO || {};
        Object.assign(params.ORG_INFO, orgInfo);

    },
    /*
     *@method bizProLinkNodeAfterSave
     *@desc 钩子函数 自定义保存数
     */
    bizProLinkNodeAfterSave: (_this, newData) => {
        if (_this.oppBusiData.newBusiData) {
            let newObj = { 
                ORG_INFO: _.get(newData, "ORG_INFO", {})
            }
            _.assign(_this.oppBusiData.newBusiData, newObj);
        }
    },
    /*
     *@method bizProLinkNodeValidate
     *@desc 钩子函数 下一步验证
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizProLinkNodeValidate: async function (_this) {
        if (isOpenMobile) {
            if ( _this.oppBusiData.VALID_MOBILE == "1") {
                let mdd = _.get(_this.groupDatas, "LINK_INFO.ORG_LINK_INFO[0]", {});
                let mobileField = _.get(mdd, "FIELDS.MOBILE_TEL", {});
                let codeField = _.get(mdd, "FIELDS.VALIDATE_CODE", {});
                if (codeField.FIELD_CONTROL == "0") {
                    let runValidateMobileData = await _this.$blMethod.runValidateMobile(_this, mobileField , codeField);
                    if (!runValidateMobileData) {
                        return false;
                    }
                }
            }
        }
    },

    /*
     *@method bizProLinkNodePageActivated
     *@desc 钩子函数：页面激活
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizProLinkNodePageActivated: function (_this, groupId) {
        if (isOpenMobile) {
            //根据公参是否显示验证码
            let fieldData = _this.groupDatas.LINK_INFO.ORG_LINK_INFO[0]["FIELDS"];
            _this.oppBusiData.VALID_MOBILE = _this.oppBusiData.busiCommonParams.VALID_MOBILE || "0";
            if (_this.oppBusiData.VALID_MOBILE != "1") {
                fieldData.MOBILE_TEL.IS_SHOW_BUTTON = false;
                fieldData.VALIDATE_CODE.FIELD_CONTROL = "1";
                fieldData.MOBILE_TEL.SUFFIX_ICON = "";
            }
            let validateMobile = _this.$blMethod.getValidateMobile();
            let mobile = fieldData.MOBILE_TEL.DEFAULT_VALUE || "";
            let authCode = fieldData.VALIDATE_CODE.DEFAULT_VALUE || "";
            fieldData.MOBILE_TEL[validateMobile] = _.assign({}, {
                MOBILE: mobile,
                AUTH_CODE: authCode
            })
        }
    },

    bizProLinkNodePreValidate: function(_this) {
    },
    //----------------------业务函数----------------------------------//
    CHECK_OFFICE_ADDR : (_this, field, fieldData) => {
        //获取地址的邮编
        let addressCode = field.addressCode;
        if (addressCode && fieldData.ZIP_CODE) {
            fieldData.ZIP_CODE.DEFAULT_VALUE = addressCode;
        }
    },
    /**
     * 手机号码
     */
    CHECK_MOBILE_TEL: (_this, field, fieldData) => {
        if (!isOpenMobile) {
            return;
        }
        if (_this.oppBusiData.VALID_MOBILE != "1") {
            return;
        }
        let defaultValue = field.DEFAULT_VALUE || "";
        let validateMobile = _this.$blMethod.getValidateMobile();
        let validateMobileData = field[validateMobile] || {};
        //已经检验过的手机号码
        let checkMobile = validateMobileData.MOBILE || _.get(_this.oppBusiData, "newBusiData.ORG_INFO.ORG_LINK_INFO.MOBILE_TEL", "");
        let proLinkInfo = custInfoModel.getOriginaOrgLinkInfo(_this.oppBusiData.oldBusiData)
        let oldMobile = proLinkInfo.MOBILE_TEL || "";
        //已经校验过不显示获取验证码按钮
        if (defaultValue && (checkMobile == defaultValue || oldMobile == defaultValue)) {
            field.IS_SHOW_BUTTON = false;
            fieldData.VALIDATE_CODE.FIELD_CONTROL = "1";
            fieldData.MOBILE_TEL.SUFFIX_ICON = "el-icon-success";
            return;
        }
        field.IS_SHOW_BUTTON = true;
        fieldData.VALIDATE_CODE.FIELD_CONTROL = "0";
        fieldData.MOBILE_TEL.SUFFIX_ICON = "";
    },
    /**
     * 验证码第一按钮点击事件
     */
    CHECK_MOBILE_TEL__CLICK: async (_this, field, fieldData) => {
        if (!isOpenMobile) {
            return;
        }
        if (field.message) {
            return;
        }
        let userInfo = _this.$storage.getJsonSession(_this.$definecfg.USER_INFO);
        let mobile = fieldData.MOBILE_TEL.DEFAULT_VALUE || "";
        let params = {
            MOBILE: mobile,
            ORG_CODE: userInfo.ORG_CODE
        }
        _this.$blMethod.getVerificationCode(_this, params, field, 60, () => {
            //清空验证码
            fieldData.VALIDATE_CODE.DEFAULT_VALUE = "";
        });
    },
    /**
     * 验证码
     */
    CHECK_LINK_VALIDATE_CODE: (_this, field, fieldData) => {
        if (!isOpenMobile) {
            return;
        }
        //不可编辑的时候不用验证验证码 防止第一次进来的时候 校验
        if (field.FIELD_CONTROL == "1") {
            return;
        }
        let mobile = fieldData.MOBILE_TEL.DEFAULT_VALUE || "";
        let defaultValue = field.DEFAULT_VALUE || "";
        let params = {
            MOBILE: mobile,
            AUTH_CODE: defaultValue
        }
        _this.$blMethod.validateVerificationCode(_this, params, field, fieldData.MOBILE_TEL, () => {
            //验证码置灰
            field.FIELD_CONTROL = "1";
            //手机号码获取验证码按钮消失
            fieldData.MOBILE_TEL.IS_SHOW_BUTTON = false;
            fieldData.MOBILE_TEL.SUFFIX_ICON = "el-icon-success";
        });
    }
}
