/*
 *   机构联系人信息模块
 *   方法封装
 */

import bizPublicMethod from "../../../../../../../business/businessTools/bizPublicMethod.js"
import bizPublicSaveMethod from "../../../../../../businessTools/bizPublicSaveMethod.js"
import custInfoModel from '../../common/cust-info-model.js'

const GROUP_ID = "OTHER_INFO";

/**
 * 联系人要去掉的证件类型：军官证、士兵证、户口本、台胞证、解放军文职干部、武警文职干部、社会保障号、文职证、警官证
 */
const LINKMAN_EXCLUDE_ID_TYPES = ["02", "03", "04", "05", "07", "0a", "0f", "0g", "0h"];

/**
 * 根据证件类型改变证件号码的校验规则
 * @param {object} _this 
 * @param {object} idCodeField 
 * @param {string} idType 
 */
const changeIdCodeValidateTypeAccordingToIdType = (_this, idCodeField, idType) => {
    let idCodeValidateType = bizPublicMethod.$blMethod.getIdCodeValidType(idType);
    idCodeField.VALID_TYPE = idCodeValidateType
}

const backfillHistoryData = (_this) => {
    let orgLinkmanInfo = _this.historyData["ORG_LINKMAN_INFO"];
    if (!_.isEmpty(orgLinkmanInfo)) {
        bizPublicMethod.$blMethod.parseMoudleArray(_this, 
            _this.groupDatas[GROUP_ID]["LINKMAN_INFO"], _.filter(orgLinkmanInfo, item => {
                return item.OPER_TYPE && item.OPER_TYPE != "2";
            }));
    }
}

const initFieldConfig = (_this) => {
    let maxLinkman = _.get(_this.oppBusiData, "busiCommonParams.MAX_LINKMAN", "");
    _this.groupDatas[GROUP_ID].LINKMAN_INFO[0].MAX_LENGTH = _.isEmpty(maxLinkman) ? "999" : maxLinkman;
    _this.groupDatasTpl[GROUP_ID].LINKMAN_INFO[0] = _.cloneDeep(_this.groupDatas[GROUP_ID].LINKMAN_INFO[0]);

    let fields = _this.groupDatas[GROUP_ID].LINKMAN_INFO[0].FIELDS;
    fields.LINKMAN_NAME.VALID_TYPE = "length[1,16]";
}

const modifyFieldConfig = (_this) => {
    bizPublicMethod.$blMethod.filterOptionsButRetainHistoryOptions(_this, GROUP_ID, "LINKMAN_INFO",
     "LINKMAN_ID_TYPE", _this.oppBusiData.individualValidIdTypes, LINKMAN_EXCLUDE_ID_TYPES, getOldData(_this));
}
/**
 * 判断字段是否没有改变
 * @param {object} field 字段对象
 */
 const isFieldValueNotChanged = (field) => {
    return field.LAST_DEFAULT_VALUE == field.DEFAULT_VALUE;
}
const getOldData = (_this) => {
    let orgLinkmanInfo = custInfoModel.getOriginaLinkManInfo(_this.oppBusiData.oldBusiData);
    orgLinkmanInfo = _.map(orgLinkmanInfo, orgLinkmanInfoItem => {
        return _.pick(orgLinkmanInfoItem, ["LINKMAN_NO", "LINKMAN_NAME", "LINKMAN_ID_TYPE", "LINKMAN_ID", "LINKMAN_MOBILE_TEL"]);
    })
    return orgLinkmanInfo;
}
export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizProLinkmanInfoNodeBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     */
    bizProLinkmanInfoNodeBeforeLoadBiz: function (_this) {
        initFieldConfig(_this);
        return Promise.all([
            
        ]).then(res => {
            let orgLinkmanInfo = getOldData(_this)
            !_.isEmpty(orgLinkmanInfo) && bizPublicMethod.$blMethod.parseMoudleArray(_this, _this.groupDatas[GROUP_ID]["LINKMAN_INFO"], orgLinkmanInfo);
        })
    },
    /*
     *@method bizProLinkmanInfoNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     */
    bizProLinkmanInfoNodeAfterLoadBiz: function (_this) {
        backfillHistoryData(_this);
        modifyFieldConfig(_this);
    },
    /*
     *@method bizProLinkmanInfoNodeBeforeSave
     *@desc 钩子函数 自定义保存数
     */
    bizProLinkmanInfoNodeBeforeSave: function (_this, params) {
        let linkmanInfo = bizPublicSaveMethod.getModuleArrFoyKey(_this, "LINKMAN_INFO", true);

        let originalLinkmanInfo = getOldData(_this);

        let linkmanChangeInfo = bizPublicMethod.$blMethod.getArrDiff(
            linkmanInfo, originalLinkmanInfo, "LINKMAN_NO", "");

        //增加diffinfo 属性 用于展示
        let linkmanInfoInfoFields = _this.groupDatas[GROUP_ID].LINKMAN_INFO[0].FIELDS;
        let webShow = _this.$blMethod.addDiffAttArr(linkmanInfoInfoFields, linkmanChangeInfo.INFO);
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
        params.LINK_MAN_WEB_SHOW = webShow;
    
        //y042表单添加FIELD_TITLE
        linkmanChangeInfo && (linkmanChangeInfo.INFO = webShow);

        Object.assign(params, {
            ORG_LINKMAN_INFO: linkmanChangeInfo && linkmanChangeInfo.INFO || [],
        })

        

        /**开户数据保存 */
        if (_this.busiCode == "V0050" || _this.busiCode == "V0051") {
            let relaInfo = params.RELA_INFO || {};
            relaInfo.ORG_LINKMAN_INFO = params.ORG_LINKMAN_INFO;
            delete relaInfo.ORG_LINKMAN_INFO.DIFF_INFO;
            Object.assign(params, {
                RELA_INFO: relaInfo
            })
        }
        return params;
    },
    /*
     *@method bizProLinkmanInfoNodeValidate
     *@desc 钩子函数 下一步验证
     */
    bizProLinkmanInfoNodeValidate: function (_this) {
        let saveGroupId = GROUP_ID;
        let linkmanInfo = _this.groupDatas[saveGroupId].LINKMAN_INFO;
        let fieldArr = ["LINKMAN_ID", "LINKMAN_MOBILE_TEL", "LINKMAN_NAME"];
        let promiseArr = bizPublicMethod.$blMethod.getValidatePromises(_this, linkmanInfo, fieldArr);
        return Promise.all(promiseArr).then( (res)=> {
            if (_.includes(res, false)) {
                return false
            }
        })
    },

    /*
     *@method bizProLinkmanInfoNodeGetData
     *@desc 拼接数据
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizProLinkmanInfoNodeGetData: function (_this, params) {
    
    },

    /*
     *@method bizProLinkmanInfoNodePageActivated
     *@desc 钩子函数：页面激活
     */
    bizProLinkmanInfoNodePageActivated: function (_this) {

       
    },


    bizProLinkmanInfoNodeAddModuleFinished: function (_this, module) {
        let fields = module.FIELDS;
        fields.LINKMAN_ID_TYPE.FIELD_DICT_FILTER = _.filter(_this.oppBusiData.individualValidIdTypes, idType => {
            return _.indexOf(LINKMAN_EXCLUDE_ID_TYPES, idType) == -1;
        });
        fields.LINKMAN_NAME.VALID_TYPE = "length[1,16]";
    },
    bizProLinkmanInfoNodeDeleteModuleFinished: function (_this, module) {
    },
    "CHECK_LINKMAN_NAME": (_this, field, fieldData) => {
        let existFlag = _this.$blMethod.checkIdCodeIsExisted(_this, field, "联系人姓名不能重复");
        if (existFlag) {
            return false;
        }
    },
    "CHECK_LINKMAN_ID_TYPE": (_this, field, fieldData) => {
        if (isFieldValueNotChanged(field)) {
            return;
        }
        if (!field.disableClear) {
            fieldData["LINKMAN_ID"].DEFAULT_VALUE = "";
        }
        field.disableClear = false;
        fieldData["LINKMAN_ID"].VALID_TYPE = bizPublicMethod.$blMethod.getIdCodeValidType(field.DEFAULT_VALUE);
        field.LAST_DEFAULT_VALUE = field.DEFAULT_VALUE;
    },
    "CHECK_LINKMAN_ID": (_this, field, fieldData) => {
        let existFlag = _this.$blMethod.checkIdCodeIsExisted(_this, field, "联系人证件号码不能重复");
        if (existFlag) {
            return false;
        }
    },
    "CHECK_LINKMAN_MOBILE_TEL": (_this, field, fieldData) => {
        let existFlag = _this.$blMethod.checkIdCodeIsExisted(_this, field, "联系人手机号码不能重复");
        if (existFlag) {
            return false;
        }
    },

}
