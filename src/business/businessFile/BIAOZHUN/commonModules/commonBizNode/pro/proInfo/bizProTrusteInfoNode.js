/*
 *   产品托管人模块
 *   方法封装
 *   @author  yangyp
 */

import date from '../../../../../../../tools/date.js'
import * as utils from "../../../../../../../tools/util"
import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../../business/businessTools/bizPublicMethod.js"
import custInfoModel from '../../common/cust-info-model.js';

let proTrusteeIdType = "";

export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizProTrusteInfoNodeBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizProTrusteInfoNodeBeforeLoadBiz: function (_this) {
        var proTrusteInfo = custInfoModel.getOriginaProTrusteInfo(_this.oppBusiData.oldBusiData)
        if (!_.isEmpty(proTrusteInfo)) {
            _this.groupDatas.RELA_INFO.HAS_TRUSTEE[0].FIELDS.HAS_TRUSTEE.DEFAULT_VALUE = "1"
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["PRO_TRUSTEE_INFO"], proTrusteInfo);
        } else {
            _this.groupDatas.RELA_INFO.HAS_TRUSTEE[0].FIELDS.HAS_TRUSTEE.DEFAULT_VALUE = "0"
        }
    },
    /*
     *@method bizProTrusteInfoNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-13 09:42:56
     */
    bizProTrusteInfoNodeAfterLoadBiz: function (_this) {
        if (_this.oppBusiData.newBusiData && _this.oppBusiData.newBusiData.RELA_INFO && _this.oppBusiData.newBusiData.RELA_INFO.PRO_TRUSTEE_INFO) {
            if (!_.isEmpty(_this.oppBusiData.newBusiData.RELA_INFO.PRO_TRUSTEE_INFO) && _this.oppBusiData.newBusiData.RELA_INFO.PRO_TRUSTEE_INFO.PRO_TRUSTEE_NAME) {
                _this.groupDatas.RELA_INFO.HAS_TRUSTEE[0].FIELDS.HAS_TRUSTEE.DEFAULT_VALUE = "1"
                bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["PRO_TRUSTEE_INFO"], _this.oppBusiData.newBusiData.RELA_INFO.PRO_TRUSTEE_INFO);
            } else {
                _this.groupDatas.RELA_INFO.HAS_TRUSTEE[0].FIELDS.HAS_TRUSTEE.DEFAULT_VALUE = "0"
            }
        }

        // // 针对于产品托管人  其可能一开始就为空
        // if (_this.groupDatas.RELA_INFO.PRO_TRUSTEE_INFO[0].FIELDS.PRO_TRUSTEE_ID_TYPE.DEFAULT_VALUE == "") {
        //     _this.groupDatas.RELA_INFO.PRO_TRUSTEE_INFO[0].FIELDS.PRO_TRUSTEE_ID_TYPE.promptValue = "";
        // }
    },
    /*
     *@method bizProTrusteInfoNodeBeforeSave
     *@desc 钩子函数 自定义保存数
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizProTrusteInfoNodeBeforeSave: function (_this, params) {
        //数据保存
        let busiData = _this.oppBusiData.newBusiData;
        let isOpenAcct = _this.$storage.getJsonSession(_this.$definecfg.IS_OPEN_ACCT_BIZ);
        let relaInfo = busiData && busiData.RELA_INFO || {},
            proTrusteeInfo = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "PRO_TRUSTEE_INFO");
        relaInfo.PRO_TRUSTEE_INFO = proTrusteeInfo;

        if (isOpenAcct == "1") {
            var proTrusteeDiffInfo = bizPublicMethod.$blMethod.compareInfo2(custInfoModel.getOriginaProTrusteInfo(_this.oppBusiData.oldBusiData), proTrusteeInfo, "HAS_TRUSTEE");
            relaInfo.PRO_TRUSTEE_CHANGE_INFO = Object.assign({}, proTrusteeInfo, {
                DIFF_INFO: proTrusteeDiffInfo
            })
        }
        params.HAS_TRUSTEE = _this.groupDatas.RELA_INFO.HAS_TRUSTEE[0].FIELDS.HAS_TRUSTEE.DEFAULT_VALUE;
        Object.assign(params.RELA_INFO, relaInfo);
    },
    /*
     *@method bizProTrusteInfoNodeValidate
     *@desc 钩子函数 下一步验证
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizProTrusteInfoNodeValidate: function (_this) {

    },

    /*
     *@method bizProTrusteInfoNodePageActivated
     *@desc 钩子函数：页面激活
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizProTrusteInfoNodePageActivated: function (_this, groupId) {
        // 字段设置
        let fieldData = _this.groupDatas.RELA_INFO.PRO_TRUSTEE_INFO[0]["FIELDS"];
        fieldData.PRO_TRUSTEE_NAME.VALID_TYPE = "val[4,64]|on-blur";
        fieldData.PRO_TRUSTEE_ID_CODE.VALID_TYPE = "charMinus[0,32]|on-blur";
        //过滤证件类型
        let dictItem = _this["oppBusiData"]["VALID_ID_TYPE_FOR_BOTH"]
        fieldData.PRO_TRUSTEE_ID_TYPE.FIELD_DICT_FILTER = _.filter(dictItem, function (item) {
            return item.charAt(0) != '0'
        });

    },

    bizProTrusteInfoNodePreValidate: function (_this) {

    },
    //----------------------业务函数----------------------------------//
    "CHECK_PRO_TRUSTEE_ID_TYPE": function (_this, field, fieldData) {
        _this.$blMethod.setValidType(_this, field, fieldData, "PRO_TRUSTEE_ID_CODE")
        if (proTrusteeIdType && field.DEFAULT_VALUE != proTrusteeIdType) {
            fieldData.PRO_TRUSTEE_ID_CODE.DEFAULT_VALUE = '';
        }
        proTrusteeIdType = field.DEFAULT_VALUE;
    },
    "CHECK_HAS_TRUSTEE": function (_this, field, fieldData) {
        if (field.DEFAULT_VALUE == "0") {
            _this.groupDatas.RELA_INFO.PRO_TRUSTEE_INFO[0].MODULE_CONTROL = "0";
            _this.groupDatas.RELA_INFO.PRO_TRUSTEE_INFO[0].FIELDS.PRO_TRUSTEE_NAME.DEFAULT_VALUE = "";
            _this.groupDatas.RELA_INFO.PRO_TRUSTEE_INFO[0].FIELDS.PRO_TRUSTEE_ID_TYPE.DEFAULT_VALUE = "";
            _this.groupDatas.RELA_INFO.PRO_TRUSTEE_INFO[0].FIELDS.PRO_TRUSTEE_ID_CODE.DEFAULT_VALUE = "";
            _this.groupDatas.RELA_INFO.PRO_TRUSTEE_INFO[0].FIELDS.PRO_TRUSTEE_ID_EXP_DATE.DEFAULT_VALUE = "";
        } else {
            _this.groupDatas.RELA_INFO.PRO_TRUSTEE_INFO[0].MODULE_CONTROL = "1";
        }
    }
}
