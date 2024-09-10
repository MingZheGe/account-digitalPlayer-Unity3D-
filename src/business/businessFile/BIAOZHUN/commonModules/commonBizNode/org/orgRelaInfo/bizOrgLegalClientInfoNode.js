/*
 *   委派代表人信息
 *   方法封装
 */

import date from '../../../../../../../tools/date.js'
import * as utils from "../../../../../../../tools/util"
import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../businessTools/bizPublicMethod.js"
import custInfoModel from '../../common/cust-info-model.js'


const backfillHistoryData = (_this) => {
    let legalClientInfo = _this.historyData["ORG_LEGAL_CLIENT_INFO"];
    if( !_.isEmpty(legalClientInfo)){
        bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["LEGAL_CLIENT_INFO"], legalClientInfo);      
    }
 }


const initFieldConfig = (_this) => {
    _this.groupDatas.RELA_INFO.LEGAL_CLIENT_INFO[0].FIELDS.LEGAL_CLIENT_ID_TYPE.FIELD_DICT_FILTER = 
        _this.oppBusiData.individualValidIdTypes;
}

/**
 * 判断字段是否没有改变
 * @param {object} field 字段对象
 */
 const isFieldValueNotChanged = (field) => {
    return field.LAST_DEFAULT_VALUE == field.DEFAULT_VALUE;
}


export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizOrgLegalClientInfoBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     */
    bizOrgLegalClientInfoBeforeLoadBiz: function (_this) {
        initFieldConfig(_this);
        let originaOrgLegalClientInfo = custInfoModel.getOriginaOrgLegalClientInfo(_this.oppBusiData.oldBusiData);
        if(!_.isEmpty(originaOrgLegalClientInfo)) {
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["LEGAL_CLIENT_INFO"], originaOrgLegalClientInfo);
        }
    },
    /*
     *@method bizOrgLegalClientInfoAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     */
    bizOrgLegalClientInfoAfterLoadBiz: function (_this) {
        backfillHistoryData(_this);

    },
    /*
     *@method bizOrgLegalClientInfoBeforeSave
     *@desc 钩子函数 自定义保存数
     */
    bizOrgLegalClientInfoBeforeSave: function (_this, params) {
        let legalRepIdType = 
            _this.groupDatas.RELA_INFO.LEGAL_REP_INFO[0].FIELDS.LEGAL_REP_ID_TYPE.DEFAULT_VALUE;
        let isIndividualLegalRep = _.indexOf(_this.oppBusiData.individualValidIdTypes, legalRepIdType) > -1;
        // 若执行事务合伙人信息为个人时，没有委派代表人
        let legalClientInfo = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "LEGAL_CLIENT_INFO");

        let originalLegalClientInfo = custInfoModel.getOriginaOrgLegalClientInfo(_this.oppBusiData.oldBusiData);
        if (isIndividualLegalRep) {
            // 模块不展示，数据不改变
            legalClientInfo = originalLegalClientInfo;
        }
        legalClientInfo.DIFF_INFO = bizPublicMethod.$blMethod.compareInfo2(originalLegalClientInfo, legalClientInfo, "");
        
        Object.assign(params, {
            ORG_LEGAL_CLIENT_INFO: legalClientInfo
        })

        //增加diffinfo 属性 用于展示
        let legalClientFields = _this.groupDatas.RELA_INFO.LEGAL_CLIENT_INFO[0].FIELDS;
        let webShow = _this.$blMethod.addDiffAtt(legalClientFields, legalClientInfo.DIFF_INFO);
        params.LEGAL_CLIENT_INFO_WEB_SHOW = webShow;

        /**开户数据保存 */
        if (_this.busiCode == "V0050") {
            let relaInfo = params.RELA_INFO || {};
            relaInfo.ORG_LEGAL_CLIENT_INFO = params.ORG_LEGAL_CLIENT_INFO;
            delete relaInfo.ORG_LEGAL_CLIENT_INFO.DIFF_INFO;
            relaInfo.ORG_LEGAL_CLIENT_INFO_FLAG = isIndividualLegalRep ? false : true;
            Object.assign(params, {
                RELA_INFO: relaInfo,
            })
        }
        return params;
    },
    /*
     *@method bizOrgLegalClientInfoAfterSave
     *@desc 钩子函数 自定义保存数
     */
    bizOrgLegalClientInfoAfterSave: (_this, newData) => {

    },
    /*
     *@method bizOrgLegalClientInfoValidate
     *@desc 钩子函数 下一步验证
     */
    bizOrgLegalClientInfoValidate: function (_this) {
        let modules = _this.groupDatas.RELA_INFO.LEGAL_CLIENT_INFO;
        let fieldIds = ["LEGAL_CLIENT_EXP_DATE"];
        let promiseArr = bizPublicMethod.$blMethod.getValidatePromises(_this, modules, fieldIds);
        return Promise.all(promiseArr).then( (res)=> {
            if (_.includes(res, false)) {
                return false;
            }
        })
    },

    /*
     *@method bizOrgLegalClientInfoPageActivated
     *@desc 钩子函数：页面激活
     */
    bizOrgLegalClientInfoPageActivated: function (_this) {

    },

    bizOrgLegalClientInfoPreValidate: function (_this) {},
    //----------------------业务函数----------------------------------//

    "CHECK_LEGAL_CLIENT_ID_TYPE": (_this, field, fieldData) => {
        if (isFieldValueNotChanged(field)) {
            return;
        }
        if (!field.disableClear) {
            fieldData["LEGAL_CLIENT_ID_CODE"].DEFAULT_VALUE = "";
            fieldData["LEGAL_CLIENT_EXP_DATE"].DEFAULT_VALUE = "";
        }
        field.disableClear = false;

        let HIS_ID_TYPE = _.get(_this.oppBusiData.oldBusiData, 'CORP_INFO.LEGAL_CLIENT_ID_TYPE', '');
        let HIS_ID_CODE = _.get(_this.oppBusiData.oldBusiData, 'CORP_INFO.LEGAL_CLIENT_ID_CODE', '');
        let HIS_ID_EXP_DATE = _.get(_this.oppBusiData.oldBusiData, "CORP_INFO.LEGAL_CLIENT_EXP_DATE", '');
        if(field.DEFAULT_VALUE != '' && field.DEFAULT_VALUE == HIS_ID_TYPE) {
            fieldData.LEGAL_CLIENT_ID_CODE.DEFAULT_VALUE = HIS_ID_CODE || '';
            fieldData.LEGAL_CLIENT_EXP_DATE.DEFAULT_VALUE = HIS_ID_EXP_DATE || '';
        }
        
        fieldData["LEGAL_CLIENT_ID_CODE"].VALID_TYPE = bizPublicMethod.$blMethod.getIdCodeValidType(field.DEFAULT_VALUE);
        field.LAST_DEFAULT_VALUE = field.DEFAULT_VALUE;
    },
    "CHECK_LEGAL_CLIENT_EXP_DATE": (_this, field, fieldData) => {
        if (bizPublicMethod.$blMethod.isExpired(_this, field.DEFAULT_VALUE)) {
            _this.$nextTick( () => {
                bizPublicMethod.$blMethod.changeFieldError(field, false, field.FIELD_TITLE + "已过期");
            })
            return false;
        }
    },
}
