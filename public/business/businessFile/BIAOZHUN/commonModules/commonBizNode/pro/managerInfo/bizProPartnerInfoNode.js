/*
 *   合伙人信息
 *   方法封装
 */

import date from '../../../../../../../tools/date.js'
import * as utils from "../../../../../../../tools/util"
import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../businessTools/bizPublicMethod.js"
import custInfoModel from '../../common/cust-info-model.js'

const GROUP_ID = "MANAGER_INFO";

/**
 * 需要展示合伙人信息的机构类型：21-普通合伙企业, 22-特殊普通合伙企业, 23-有限合伙企业,
 * 24-非法人非合伙制创投企业, 25a-私募基金管理人（合伙企业）
 */
const NEEDED_DISPLAYED_PARTNER_INFO_ORG_TYPES = ["21", "22", "23", "24", "25a"];

/**
 * 合伙人要去掉的证件类型：军官证、士兵证、户口本、台胞证、解放军文职干部、武警文职干部、
 * 社会保障号、文职证、警官证
 */
const EXCLUDE_ID_TYPES = ["02", "03", "04", "05", "07", "0a", "0f", "0g", "0h"];

/**
 * 合伙人信息变更后提醒的唯一标识，值无意义，在使用范围内保持唯一即可
 */
const PARTNER_INFO_CHANGED_TIP_KEY = "partnerInfoChanged";

/**
 * 合伙人信息变更后提醒的内容
 */
const PARTNER_INFO_CHANGED_TIP_TITLE = "稍后需采集您的合伙人信息名录，请您继续办理";

const backfillHistoryData = (_this) => {
    let partnerInfo = _this.historyData["ORG_PARTNER_INFO"];
    if( !_.isEmpty(partnerInfo)){
        bizPublicMethod.$blMethod.parseMoudleArray(_this, _this.groupDatas[GROUP_ID]["PARTNER_INFO"], 
        _.filter(partnerInfo, item => {
            return item.OPER_TYPE && item.OPER_TYPE != "2";
        }));     
    }
 }

const pushMyFlowTip = (_this, tipKey, tipTitle, tipType) => {
    _this.$refs.flowTip.pushFlowTip({
        key: tipKey,
        title: tipTitle,
        type: tipType
    })
}

const removeMyFlowTip = (_this, tipKey) => {
    _this.$refs.flowTip.removeFlowTip(tipKey);
}

const isPartnerInfoChanged = (_this) => {
    let partnerInfo = bizPublicSaveMethod.getModuleArrFoyKey(_this, "PARTNER_INFO", true);
    // 如果模块被隐藏了，赋值为空
    if (_this.groupDatas[GROUP_ID].PARTNER_INFO[0].MODULE_CONTROL == "0") {
        partnerInfo = [];
    }
    let originalPartnerInfo = custInfoModel.getOriginaPartnerInfo(_this.oppBusiData.oldBusiData);
    return bizPublicMethod.$blMethod.isArrayModuleChanged(partnerInfo, originalPartnerInfo);
}

const showTipIfPartnerInfoChanged = (_this) => {
    // 产品开户不用采集合伙人信息名录
    if (_this.busiCode == "V0051") {
        return;
    }
    removeMyFlowTip(_this, PARTNER_INFO_CHANGED_TIP_KEY);
    let szOrgType = _this.groupDatas.MANAGER_INFO.MANAGER_BASIC_INFO[0].FIELDS.SZORG_TYPE.DEFAULT_VALUE;
    if (isPartnerInfoChanged(_this) && NEEDED_DISPLAYED_PARTNER_INFO_ORG_TYPES.includes(szOrgType)) {
        pushMyFlowTip(_this, PARTNER_INFO_CHANGED_TIP_KEY, PARTNER_INFO_CHANGED_TIP_TITLE, "warnning");
    }
}

/**
 * 判断字段是否没有改变
 * @param {object} field 字段对象
 */
 const isFieldValueNotChanged = (field) => {
    return field.LAST_DEFAULT_VALUE == field.DEFAULT_VALUE;
}

const isShowPartnerInfoNeeded = (_this) => {
    let orgType = _this.groupDatas.MANAGER_INFO.MANAGER_BASIC_INFO[0].FIELDS.SZORG_TYPE.DEFAULT_VALUE;
    return NEEDED_DISPLAYED_PARTNER_INFO_ORG_TYPES.indexOf(orgType) > -1;
}

const showPartnerInfoModuleIfNeeded = (_this) => {
    let moduleControl = isShowPartnerInfoNeeded(_this) ? "1" : "0";
    _.each(_this.groupDatas[GROUP_ID].PARTNER_INFO, module => {
        module.MODULE_CONTROL = moduleControl;
    })
}

//开户和非开户 字段数据加载 公共操作
const bizProPartnerInfoBeforeLoadBizCommon = (_this) => {
    _this.groupDatas[GROUP_ID].PARTNER_INFO[0].MAX_LENGTH = "999";
    _this.groupDatasTpl[GROUP_ID].PARTNER_INFO[0] = _.cloneDeep(_this.groupDatas[GROUP_ID].PARTNER_INFO[0]);
}
const modifyFieldConfig = (_this) => {
    let allIdTypes = _.union(_this.oppBusiData.individualValidIdTypes, _this.oppBusiData.orgValidIdTypes);
    bizPublicMethod.$blMethod.filterOptionsButRetainHistoryOptions(_this, GROUP_ID, "PARTNER_INFO",
     "PID_TYPE", allIdTypes, EXCLUDE_ID_TYPES, custInfoModel.getOriginaPartnerInfo(_this.oppBusiData.oldBusiData));
}
export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizProPartnerInfoBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     */
    bizProPartnerInfoBeforeLoadBiz: function (_this) {
        bizProPartnerInfoBeforeLoadBizCommon(_this)
        let partnerInfo = custInfoModel.getOriginaPartnerInfo(_this.oppBusiData.oldBusiData);
        if (!_.isEmpty(partnerInfo)) {
            bizPublicMethod.$blMethod.parseMoudleArray(_this, _this.groupDatas[GROUP_ID]["PARTNER_INFO"], 
            partnerInfo);
        }

    },
    bizProPartnerInfoBeforeLoadBizOpenAcct: function (_this) {
        bizProPartnerInfoBeforeLoadBizCommon(_this)
    },
    /*
     *@method bizProPartnerInfoAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     */
    bizProPartnerInfoAfterLoadBiz: function (_this) {
        backfillHistoryData(_this);
        modifyFieldConfig(_this);
        showPartnerInfoModuleIfNeeded(_this);
    },
    /*
     *@method bizProPartnerInfoBeforeSave
     *@desc 钩子函数 自定义保存数
     */
    bizProPartnerInfoBeforeSave: function (_this, params) {
        let partnerInfo = isShowPartnerInfoNeeded(_this) ? 
            bizPublicSaveMethod.getModuleArrFoyKey(_this, "PARTNER_INFO", true) : [];
        
        let tempParam = {};
        let originalPartnerInfo = custInfoModel.getOriginaPartnerInfo(_this.oppBusiData.oldBusiData);

        let partnerChangeInfo = bizPublicMethod.$blMethod.getArrDiff(
            partnerInfo, originalPartnerInfo, "PARTNER_NO", "");

        tempParam.isPartnerInfoChanged = 
            bizPublicMethod.$blMethod.isArrayModuleChanged(partnerInfo, originalPartnerInfo);

        Object.assign(params, {
            ORG_PARTNER_INFO: partnerChangeInfo && partnerChangeInfo.INFO || [],
            IS_PARTNER_INFO_CHANGE: partnerChangeInfo && partnerChangeInfo.IS_CHANGE || "0"
        })
        /**开户数据保存 */
        if (_this.busiCode == "V0051") {
            let managerInfo = params.MANAGER_INFO || {};
            managerInfo.ORG_PARTNER_INFO = params.ORG_PARTNER_INFO;
            delete managerInfo.ORG_PARTNER_INFO.DIFF_INFO;
            managerInfo.ORG_PARTNER_INFO_FLAG = _.isEmpty(partnerInfo) ? false : true;
            Object.assign(params, {
                MANAGER_INFO: managerInfo
            })
        }
        //增加diffinfo 属性 用于展示
        let partnerInfoFields = _this.groupDatas[GROUP_ID].PARTNER_INFO[0].FIELDS;
        let webShow = _this.$blMethod.addDiffAttArr(partnerInfoFields, partnerChangeInfo.INFO);
        webShow = _.each(webShow, infoItem => {
            if (infoItem.OPER_TYPE != "2") {
                infoItem.DIFF_INFO = _.filter(infoItem.DIFF_INFO, diffInfoItem => {
                    return diffInfoItem.NEW != diffInfoItem.OLD;
                })
            }
            if (infoItem.OPER_TYPE == "2") {
                infoItem.deleteDiff = _.filter(infoItem.deleteDiff, deleteDiffItem => {
                    return deleteDiffItem.NEW != deleteDiffItem.OLD;
                })
            }
        })
        params.PARTNER_INFO_WEB_SHOW = webShow;

        return params;
    },
    /*
     *@method bizProPartnerInfoAfterSave
     *@desc 钩子函数 自定义保存数
     */
    bizProPartnerInfoAfterSave: (_this, newData) => {
    },
    /*
     *@method bizProPartnerInfoValidate
     *@desc 钩子函数 下一步验证
     */
    bizProPartnerInfoValidate: function (_this) {
        let saveGroupId = GROUP_ID;
        let partnerInfo = _this.groupDatas[saveGroupId].PARTNER_INFO;
        let fieldArr = ["PID_CODE", "ID_DATE"];
        let promiseArr = bizPublicMethod.$blMethod.getValidatePromises(_this, partnerInfo, fieldArr);
        return Promise.all(promiseArr).then( (res)=> {
            if (_.includes(res, false)) {
                return false
            }
        })
    },

    /*
     *@method bizProPartnerInfoPageActivated
     *@desc 钩子函数：页面激活
     */
    bizProPartnerInfoPageActivated: function (_this) {
        showPartnerInfoModuleIfNeeded(_this);
    },

    bizProPartnerInfoNodeAddModuleFinished: function (_this, module) {
        let allIdTypes = _.union(_this.oppBusiData.individualValidIdTypes, _this.oppBusiData.orgValidIdTypes);
        bizPublicMethod.$blMethod.filterOptionsButRetainHistoryOptions(_this, GROUP_ID, "PARTNER_INFO",
        "PID_TYPE", allIdTypes, EXCLUDE_ID_TYPES, custInfoModel.getOriginaPartnerInfo(_this.oppBusiData.oldBusiData));
        showTipIfPartnerInfoChanged(_this);
    },

    bizProPartnerInfoNodeDeleteModuleFinished: function (_this, module) {
        showTipIfPartnerInfoChanged(_this);
    },

    bizProPartnerInfoPreValidate: function (_this) {},
    //----------------------业务函数----------------------------------//

    "CHECK_PID_CODE": (_this, field, fieldData) => {
        if (isFieldValueNotChanged(field)) {
            return;
        }
        let existFlag = _this.$blMethod.checkIdCodeIsExisted(_this, field, "合伙人证件号码不能重复");
        if (existFlag) {
            return false;
        }
        showTipIfPartnerInfoChanged(_this);
        field.LAST_DEFAULT_VALUE = field.DEFAULT_VALUE;
    },
    "CHECK_PARTNER_NAME": (_this, field, fieldData) => {
        if (isFieldValueNotChanged(field)) {
            return;
        }
        showTipIfPartnerInfoChanged(_this);
        field.LAST_DEFAULT_VALUE = field.DEFAULT_VALUE;
    },
    "CHECK_PID_TYPE": (_this, field, fieldData) => {
        if (isFieldValueNotChanged(field)) {
            return;
        }
        fieldData["PID_CODE"].DEFAULT_VALUE = "";
        fieldData["ID_DATE"].DEFAULT_VALUE = "";
        fieldData["PID_CODE"].VALID_TYPE = bizPublicMethod.$blMethod.getIdCodeValidType(field.DEFAULT_VALUE);
        showTipIfPartnerInfoChanged(_this);
        field.LAST_DEFAULT_VALUE = field.DEFAULT_VALUE;
    },
    "CHECK_ID_DATE": (_this, field, fieldData) => {
        if (isFieldValueNotChanged(field)) {
            return;
        }
        showTipIfPartnerInfoChanged(_this);
        field.LAST_DEFAULT_VALUE = field.DEFAULT_VALUE;
    },
    "CHECK_LIAB_TYPE": (_this, field, fieldData) => {
        if (isFieldValueNotChanged(field)) {
            return;
        }
        showTipIfPartnerInfoChanged(_this);
        field.LAST_DEFAULT_VALUE = field.DEFAULT_VALUE;
    },
    "CHECK_ID_DATE": (_this, field, fieldData, module) => {
        if (bizPublicMethod.$blMethod.isExpired(_this, field.DEFAULT_VALUE)) {
            _this.$nextTick( () => {
                bizPublicMethod.$blMethod.changeFieldError(field, false, field.FIELD_TITLE + "已过期");
            })
            return false;
        }
    },


}
