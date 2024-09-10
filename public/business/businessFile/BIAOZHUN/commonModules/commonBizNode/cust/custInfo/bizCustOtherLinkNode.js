/*
 *   其他联系人信息模块
 *   方法封装
 */

import stringConfig from "../../../../../../../tools/stringConfig.js";
import bizPublicMethod from "../../../../../../businessTools/bizPublicMethod.js"
import bizPublicSaveMethod from "../../../../../../businessTools/bizPublicSaveMethod.js"
import custInfoModel from "../../common/cust-info-model"
//开户和非开户 字段数据加载 公共操作
const otherLinkshowFieldArr = ['LINKMAN_ID_TYPE', 'LINKMAN_ID', 'LINKMAN_EXP_DATE', 'LINKMAN_SEX', 'LINKMAN_TEL', 'LINKMAN_RELA', 'LINKMAN_CORP_FAX', 'IME_TYPE', 'IME_NAME', 'LINKMAN_ADDR', 'LINKMAN_ZIP', 'LINKMAN_CORP_URL', 'LINKMAN_EMAIL'];
const bizCustOtherLinkNodeBeforeLoadBizCommon = (_this) => {
    let fieldData = _this.groupDatas.LINK_INFO.CUST_OTHER_LINK_INFO[0].FIELDS;
    //联系人关系为输入框
    fieldData.LINKMAN_RELA.FIELD_TYPE = "normalinput";
    //电话号码
    fieldData.LINKMAN_TEL.FIELD_TYPE = "telephone"
    fieldData.LINKMAN_TEL.VALID_TYPE = "tel"
    fieldData.LINKMAN_TEL.telPhoneType = "0"
    //单位传真
    fieldData.LINKMAN_CORP_FAX.FIELD_TYPE = "telephone"
    fieldData.LINKMAN_CORP_FAX.VALID_TYPE = "tel"
    fieldData.LINKMAN_CORP_FAX.telPhoneType = "0"

    //手机号码
    fieldData.LINKMAN_MOBILE_TEL.VALID_TYPE = "mobile"
    //值改变后触发函数
    fieldData.LINKMAN_NAME.FIELD_FUNCTION_CHANGE = "CHANGE_LINKMAN_NAME"
    fieldData.LINKMAN_MOBILE_TEL.FIELD_FUNCTION_CHANGE = "CHANGE_LINKMAN_MOBILE_TEL"
    //证件类型过滤
    fieldData.LINKMAN_ID_TYPE.FIELD_DICT_FILTER = _this.oppBusiData.VALID_ID_TYPE_FOR_PERSON;

    //fieldData.LINKMAN_CORP_URL.VALID_TYPE = "length[2,64]";
    //业务公参
    _this.oppBusiData.MAX_OTHER_LINKER = _this.$blMethod.getJsonSessionBusiCommParam(_this, "MAX_OTHER_LINKER") || "999";
    _this.groupDatas.LINK_INFO.CUST_OTHER_LINK_INFO[0].MAX_LENGTH = _this.oppBusiData.MAX_OTHER_LINKER;
    if (Number(_this.oppBusiData.MAX_OTHER_LINKER) > 1) {
        _this.groupDatas.LINK_INFO.CUST_OTHER_LINK_INFO[0].MODULE_ADD = "1"
    } else {
        _this.groupDatas.LINK_INFO.CUST_OTHER_LINK_INFO[0].MODULE_ADD = "0"
    }
    

    //新增是否需要展示普通联系人全部字段公共参数
    let linkManFieldShowAll = _this.oppBusiData.busiCommonParams.LINKMAN_FIELD_SHOWALL || "0";
    if (linkManFieldShowAll == "1") {
        _.each(otherLinkshowFieldArr, fieldId => fieldData[fieldId].FIELD_CONTROL = "0");
    } else {
        _.each(otherLinkshowFieldArr, fieldId => fieldData[fieldId].FIELD_CONTROL = "1");
    }
    fieldData.LINKMAN_MOBILE_TEL.MAX_LENGTH = "11";
    _this.groupDatasTpl.LINK_INFO.CUST_OTHER_LINK_INFO[0] = _.cloneDeep(_this.groupDatas.LINK_INFO.CUST_OTHER_LINK_INFO[0])
}

export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizCustOtherLinkNodeBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     *@Date: 2019-06-11 15:19:09
     */
    bizCustOtherLinkNodeBeforeLoadBiz: function (_this) {
        bizCustOtherLinkNodeBeforeLoadBizCommon(_this);
        //其他联系人过滤两融的紧急联系人
        let LINK_MAN_FILTER = _this.$blMethod.getJsonSessionSysCommParam(_this, "LINK_MAN_FILTER") || "";
        _this.oppBusiData.oldBusiData.LINK_INFO = _.filter(_this.oppBusiData.oldBusiData.LINK_INFO, item => {
            return LINK_MAN_FILTER.indexOf(item.LINKMAN_FLAG) == -1 || item.LINKMAN_FLAG.trim() == "";
        })
        let custOtherLinkInfo = custInfoModel.getOriginaLinkManInfo(_this.oppBusiData.oldBusiData);
        bizPublicMethod.$blMethod.parseMoudleArray(_this, _this.groupDatas.LINK_INFO["CUST_OTHER_LINK_INFO"], custOtherLinkInfo);

    },
    bizCustOtherLinkNodeBeforeLoadBizOpenAcct: function (_this) {
        bizCustOtherLinkNodeBeforeLoadBizCommon(_this)
    },
    /*
     *@method bizCustOtherLinkNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     *@Date: 2019-06-13 09:42:56
     */
    bizCustOtherLinkNodeAfterLoadBiz: function (_this) {
        //重新解析历史数据
        if (_this.historyData && _this.historyData.RELA_INFO) {
            let custOtherLinkInfo = _.get(_this.historyData, "RELA_INFO.CUST_OTHER_LINK_INFO", []);
            let CUST_OTHER_LINK_INFO_CHANGE = _.get(_this.historyData, "RELA_INFO.CUST_OTHER_LINK_INFO_CHANGE", "");
            if (!_.isEmpty(custOtherLinkInfo) ) {
                bizPublicMethod.$blMethod.parseMoudleArray(_this, _this.groupDatas.LINK_INFO["CUST_OTHER_LINK_INFO"], custOtherLinkInfo);
            }
            //数据为空 然而有保存 则为 清空了所有数据 其他联系人可以清空所有数据
            if ( _.isEmpty(custOtherLinkInfo) && !_.isEmpty(CUST_OTHER_LINK_INFO_CHANGE)) {
                let maxLength = parseInt(_this.groupDatas.LINK_INFO["CUST_OTHER_LINK_INFO"][0].MAX_LENGTH) || 3;
                _this.groupDatas.LINK_INFO["CUST_OTHER_LINK_INFO"].splice(1, maxLength + 1);
                _this.groupDatas.LINK_INFO["CUST_OTHER_LINK_INFO"][0].FIELDS = _.each(_this.groupDatas.LINK_INFO["CUST_OTHER_LINK_INFO"][0].FIELDS, field => {
                    field.DEFAULT_VALUE = "";
                })
            }
        }
        //遍历所有模块 更改必填与非必填项
        let CUST_OTHER_LINK_INFO = _this.groupDatas.LINK_INFO.CUST_OTHER_LINK_INFO;
        _.each(CUST_OTHER_LINK_INFO, (moduleItem, key) => {
            let fields = moduleItem.FIELDS;
            let linkManName = fields.LINKMAN_NAME.DEFAULT_VALUE || "";
            let linkManMobileTel = fields.LINKMAN_MOBILE_TEL.DEFAULT_VALUE || "";
            if (linkManName || linkManMobileTel) {
                CUST_OTHER_LINK_INFO[key].FIELDS.LINKMAN_NAME.FIELD_REQUIRED = "1";
                CUST_OTHER_LINK_INFO[key].FIELDS.LINKMAN_MOBILE_TEL.FIELD_REQUIRED = "1";
            } else {
                CUST_OTHER_LINK_INFO[key].FIELDS.LINKMAN_NAME.FIELD_REQUIRED = "0";
                CUST_OTHER_LINK_INFO[key].FIELDS.LINKMAN_MOBILE_TEL.FIELD_REQUIRED = "0";
            }
            
        })
    },
    /*
     *@method bizCustOtherLinkNodeBeforeSave
     *@desc 钩子函数 自定义保存数
     *@Date: 2019-06-11 15:19:09
     */
    bizCustOtherLinkNodeBeforeSave: function (_this, params) {
        let custOtherLinkInfo = bizPublicSaveMethod.getModuleArrFoyKey(_this, "CUST_OTHER_LINK_INFO", true);
        let custOtherLinkInfoFields = _this.groupDatas.LINK_INFO.CUST_OTHER_LINK_INFO[0].FIELDS;

        let busiData = _this.historyData || {};
        //开户业务这里为undefined
        let relaInfo = busiData.RELA_INFO || {};
        relaInfo.CUST_OTHER_LINK_INFO = custOtherLinkInfo;
        //判断是否保存过其他联系信息 有可能 系统有数据 清空数据保存 没有回填成功
        relaInfo.CUST_OTHER_LINK_INFO_CHANGE = "1"
        if (_this.busiCode == "V0049" || _this.busiCode == "V0163") {
            let otherLinkshowFieldArrTpl = _.cloneDeep(otherLinkshowFieldArr);
            //新增是否需要展示普通联系人全部字段公共参数
            let linkManFieldShowAll = _this.oppBusiData.busiCommonParams.LINKMAN_FIELD_SHOWALL || "0";
            if (linkManFieldShowAll == "1") {
                otherLinkshowFieldArrTpl = [];
            }
            let oldData = custInfoModel.getOriginaLinkManInfo(_this.oppBusiData.oldBusiData);
            //其他数据不更改
            if (linkManFieldShowAll == "0") {
                custOtherLinkInfo = _.each(custOtherLinkInfo, item => {
                    if (item.LINKMAN_NO) {
                        let findItem = _.find(_.cloneDeep(oldData), {LINKMAN_NO: item.LINKMAN_NO});
                        if (!_.isEmpty(findItem)) {
                            findItem.LINKMAN_NAME = item.LINKMAN_NAME;
                            findItem.LINKMAN_MOBILE_TEL = item.LINKMAN_MOBILE_TEL;
                        }
                        item = findItem;
                    }
                })
            }
            
            let otherLinkshowFieldText = otherLinkshowFieldArrTpl.join(",");
            let data1 = _this.$blMethod.getArrDiff(custOtherLinkInfo, oldData, "LINKMAN_NO", otherLinkshowFieldText)
            data1.INFO = _.filter(data1.INFO || [], (item) => {
                let diffInfo = item.DIFF_INFO || [];
                let deleteLinkMan = _.find(diffInfo, item => {
                    return "LINKMAN_NAME" == item.FIELD && item.NEW == "" && item.OLD == ""
                })
                return _.isEmpty(deleteLinkMan)
            })
            // 当名称直接修改为了空 则代表数据为删除
            _.each(data1.INFO || [], item => {
                let diffInfo = item.DIFF_INFO || [];
                let deleteLinkMan = _.find(diffInfo, item => {
                    return "LINKMAN_NAME" == item.FIELD && item.NEW == ""
                })
                if (!_.isEmpty(deleteLinkMan)) {
                    let oldLinkInfo = _.find(oldData || [], oldItem => {
                        return oldItem.LINKMAN_NO == item.LINKMAN_NO
                    }) || {}
                    Object.assign(item, oldLinkInfo);
                    item.DIFF_INFO = [oldLinkInfo];
                    item.OPER_TYPE = "2";
                }
            })
            data1.INFO = _this.$blMethod.addDiffAttArr(custOtherLinkInfoFields, _.cloneDeep(data1.INFO));
            data1.INFO = _.each(data1.INFO, infoItem => {
                if (infoItem.OPER_TYPE != "2") {
                    infoItem.DIFF_INFO = _.filter(infoItem.DIFF_INFO, diffInfoItem => {
                        return diffInfoItem.NEW != diffInfoItem.OLD;
                    })
                }
                if (infoItem.OPER_TYPE == "2") {
                    infoItem.deleteDiff = _.filter(infoItem.deleteDiff, deleteDiffItem => {
                        return otherLinkshowFieldArrTpl.indexOf(deleteDiffItem.FIELD) == -1 && deleteDiffItem.NEW != deleteDiffItem.OLD;
                    })
                }
            })
            relaInfo.CUST_OTHER_LINK_CHANGE_INFO = data1;
            Object.assign(params, {
                CUST_OTHER_LINK_INFO: relaInfo.CUST_OTHER_LINK_CHANGE_INFO.INFO,
            });

        }
        params.RELA_INFO = params.RELA_INFO || {}
        Object.assign(params.RELA_INFO, relaInfo);
        return params;
    },
    /*
     *@method bizCustOtherLinkNodeAfterSave
     *@desc 钩子函数 自定义保存数
     */
    bizCustOtherLinkNodeAfterSave: (_this, newData) => {
    },
    /*
     *@method bizCustOtherLinkNodeValidate
     *@desc 钩子函数 下一步验证
     *@Date: 2019-06-11 15:19:09
     */
    bizCustOtherLinkNodeValidate: function (_this) {
        // _this.$refs.flowTip.flowTips = [];
        // 其他联系人 姓名 或者 电话 其他一项必填, 则这两个字段都必填
        let index = _this.groupDatas.LINK_INFO.CUST_OTHER_LINK_INFO.length - 1;
        if (_this.groupDatas.LINK_INFO.CUST_OTHER_LINK_INFO[index].FIELDS.LINKMAN_NAME.DEFAULT_VALUE != '') {
            if (_this.groupDatas.LINK_INFO.CUST_OTHER_LINK_INFO[index].FIELDS.LINKMAN_MOBILE_TEL.DEFAULT_VALUE == '') {
                _this.$blMethod.showMsgBox(_this, "填写了姓名字段,必须填写手机号码字段!");
                return false;
            }       
        }
        if (_this.groupDatas.LINK_INFO.CUST_OTHER_LINK_INFO[index].FIELDS.LINKMAN_MOBILE_TEL.DEFAULT_VALUE != '') {
            if (_this.groupDatas.LINK_INFO.CUST_OTHER_LINK_INFO[index].FIELDS.LINKMAN_NAME.DEFAULT_VALUE == '') {
                _this.$blMethod.showMsgBox(_this, "填写了手机号码字段,必须填写姓名字段!");
                return false;
            } 
        }
        let flag = true;
        _.each(_this.groupDatas.LINK_INFO.CUST_OTHER_LINK_INFO, moduleItem => {
            let ME_LINKMAN_MOBILE_TEL = _.get(_this.groupDatas, "LINK_INFO.CUST_LINK_INFO[0].FIELDS.MOBILE_TEL.DEFAULT_VALUE", "");
            let ME_CUST_FNAME = _.get(_this.groupDatas, "CUST_INFO.CUST_CARD_INFO[0].FIELDS.CUST_FNAME.DEFAULT_VALUE", "");
            let LINKMAN_MOBILE_TEL = moduleItem.FIELDS.LINKMAN_MOBILE_TEL.DEFAULT_VALUE || "";
            let LINKMAN_NAME = moduleItem.FIELDS.LINKMAN_NAME.DEFAULT_VALUE || "";
            if (ME_LINKMAN_MOBILE_TEL == LINKMAN_MOBILE_TEL && LINKMAN_MOBILE_TEL) {
                _this.$refs.flowTip.pushFlowTip({
                    title:`普通联系人电话不能与您本人电话相同!`,
                    type:'warning',
                    key:'name'
                });
                flag = false;
                return false;
            }
            if (LINKMAN_NAME == ME_CUST_FNAME && ME_CUST_FNAME) {
                _this.$refs.flowTip.pushFlowTip({
                    title:`普通联系人姓名不能与您本人姓名相同!`,
                    type:'warning',
                    key:'name'
                });
                flag = false;
                return false;
            }
        })
        let CUST_OTHER_LINK_INFO = _this.groupDatas.LINK_INFO.CUST_OTHER_LINK_INFO;
        let fieldArr = ["LINKMAN_MOBILE_TEL", "LINKMAN_NAME"];
        let promiseArr = [];
        _.each(CUST_OTHER_LINK_INFO, (item, key) => {
            _.each(fieldArr, fieldId => {
                let fieldData = CUST_OTHER_LINK_INFO[key].FIELDS;
                let field = CUST_OTHER_LINK_INFO[key].FIELDS[fieldId];
                let fieldFn = field.FIELD_FUNCTION;
                _this.busiLogic[fieldFn] && promiseArr.push(_this.busiLogic[fieldFn](_this, field, fieldData));
            })
        })
            
        return Promise.all(promiseArr).then( (res)=> {
            if (_.includes(res, false)) {
                return false;
            }
        })
    },

    /*
     *@method bizCustOtherLinkNodePageActivated
     *@desc 钩子函数：页面激活
     *@Date: 2019-06-11 15:19:09
     */
    bizCustOtherLinkNodePageActivated: function (_this) {

    },

    bizCustOtherLinkNodePreValidate: function (_this) {
    },
    //----------------------业务函数----------------------------------//
    //出生日期
    CHECK_OTHERLINKINFO_BIRTHDAY: (_this, field, fieldData) => {

    },
    //联系人姓名
    CHECK_LINKMAN_NAME: (_this, field, fieldData) => {
        if(stringConfig.isNotEmptyStr(field.DEFAULT_VALUE)){         
            fieldData.LINKMAN_NAME.FIELD_REQUIRED = "1";
            fieldData.LINKMAN_MOBILE_TEL.FIELD_REQUIRED = "1";
        }
        let existFlag = _this.$blMethod.checkIdCodeIsExisted(_this, field, "普通联系人姓名已存在，不能重复添加!");
        if (existFlag) {
            return false;
        }
        if (field.DEFAULT_VALUE == _.get(_this.groupDatas, "CUST_INFO.CUST_CARD_INFO[0].FIELDS.CUST_FNAME.DEFAULT_VALUE", "")) {
            _this.$nextTick(() => {
                _this.$blMethod.changeFieldError(field, false, "普通联系人姓名不能与您本人姓名相同!");
            })
            return false;
        }
    },
    //联系人电话
    CHECK_LINKMAN_MOBILE_TEL: (_this, field, fieldData) => {
        let defaultValue = field.DEFAULT_VALUE || "";
        if (defaultValue) {
            if(stringConfig.isNotEmptyStr(defaultValue)){         
                fieldData.LINKMAN_NAME.FIELD_REQUIRED = "1";
                fieldData.LINKMAN_MOBILE_TEL.FIELD_REQUIRED = "1";
            }
            let existFlag = _this.$blMethod.checkIdCodeIsExisted(_this, field, "普通联系人手机号码已存在，不能重复添加!");
            if (existFlag) {
                return false;
            }
            if (defaultValue == _.get(_this.groupDatas, "LINK_INFO.CUST_LINK_INFO[0].FIELDS.MOBILE_TEL.DEFAULT_VALUE", "")) {
                _this.$nextTick(() => {
                    _this.$blMethod.changeFieldError(field, false, "普通联系人电话不能与您本人电话相同!");
                })
                return false;
            }
        }
        return true;
    },
    //证件类型
    CHECK_LINKMAN_ID_TYPE: (_this, field, fieldData) => {
        let defaultValue = field.DEFAULT_VALUE || "";
        _this.$blMethod.setValidType(_this, field, fieldData, "LINKMAN_ID")
        fieldData.LINKMAN_ID.DEFAULT_VALUE = "";
        if (defaultValue) {
            fieldData.LINKMAN_ID.FIELD_REQUIRED = "1"
        } else {
            fieldData.LINKMAN_ID.FIELD_REQUIRED = "0"
        }
    },
    //证件号码
    CHECK_LINKMAN_ID: (_this, field, fieldData) => {
        let defaultValue = field.DEFAULT_VALUE || "";
        if (defaultValue) {
            let existFlag = _this.$blMethod.checkIdCodeIsExisted(_this, field, "普通联系人证件号码已存在，不能重复添加!");
            if (existFlag) {
                return false;
            }
            if (defaultValue == _.get(_this.groupDatas, "CUST_INFO.CUST_CARD_INFO[0].FIELDS.ID_TYPE.DEFAULT_VALUE", "")) {
                _this.$nextTick(() => {
                    _this.$blMethod.changeFieldError(field, false, "普通联系人证件不能与您本人证件相同!");
                })
                return false;
            }
        }
        return true
    },
    OTHERLINKINFO_DELETE_MODULE_FINISHED: (_this, fieldData) => {
        _.each(_this.$refs, (item, key) => {
            if (key.indexOf("CUST_OTHER_LINK_INFO") > -1 && item.length > 0) {
                item[0].$refs.LINKMAN_ID[0].field.message = "";
                item[0].$refs.LINKMAN_ID[0].$refs.LINKMAN_ID.validate("change");
            }
        })
    },
    CHANGE_LINKMAN_NAME: (_this, field, fieldData) => {
        _this.$blMethod.arrHasValue(_this, fieldData, ["LINKMAN_NAME", "LINKMAN_MOBILE_TEL"]);
    },
    CHANGE_LINKMAN_MOBILE_TEL: (_this, field, fieldData) => {
        _this.$blMethod.arrHasValue(_this, fieldData, ["LINKMAN_NAME", "LINKMAN_MOBILE_TEL"]);
    },
    bizCustOtherLinkNodeFieldDataChange: (_this, field, fieldData, moduleInfo) => {
        if (field.FIELD_ID == "LINKMAN_NAME") {
            _this.busiLogic.CHANGE_LINKMAN_NAME && _this.busiLogic.CHANGE_LINKMAN_NAME(_this, field, fieldData);
        }
        if (field.FIELD_ID == "LINKMAN_MOBILE_TEL") {
            _this.busiLogic.CHANGE_LINKMAN_NAME && _this.busiLogic.CHANGE_LINKMAN_MOBILE_TEL(_this, field, fieldData);
        }
    }
    
}