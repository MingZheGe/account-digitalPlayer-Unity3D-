/* 
 *   所有业务公共方法
 *   方法封装
 *   @author  yangyp
 */

import stringConfig from '../../tools/stringConfig.js';
import dict from '../../tools/dict';
import keyFieldMap from "../../pages/imageAcquisition/common/key-field-map"
import bizPublicMethod from '../businessTools/bizPublicMethod'
export default {
    /*
     * @Description: 按照提交模块，逐一进行保存，数据返回当前保存结构的完整对象
     * 1、_this. 页面索引
     * 2、 saveDicName  在keyFieldMap中的保存结构
     * 3、 要解析的模块数组 mouduleArr
     * 4、 oldObject 接口数据字段（本身旧值）
     * @Author: yangyp
     * @Date: 2019-08-30 18:18:49
     */
    getSaveData: function (_this, saveDicName, mouduleArr, oldObject) {
        //获取保存的数据结构
        let saveData = this.getEmptySaveObject(keyFieldMap[saveDicName]);
        console.log('saveData====', JSON.stringify(saveData));

        //对保存对数据结构赋值。首先对页面上的数据进行赋值。如果页面上的字段没有，取历史数据
        saveData = this.setDataWithNewObject(_this, saveData, mouduleArr, oldObject);
        console.log('saveData===', JSON.stringify(saveData));
        //如果 所选得国家不为中国  这居住省 市 区代码置为空
        if (saveData.NATION_ENG != "CN") {
            saveData.PROVINCE = "";
            saveData.DISTRICT_NAME = "";
            saveData.CITYCN = "";
        }
        if (!_.isEmpty(oldObject)) {
            let diffInfo = _this.$blMethod.compareInfo(oldObject, saveData);
            saveData.DIFF_INFO = diffInfo;
        }
        console.log('对比后的saveData =', JSON.stringify(saveData));
        //获取对比值。用saveData数据与历史数据oldObject对比，获取出DIFF_INFO 数据

        return saveData;
    },
    /**
     *@Description: 获取模块数据
     *@Author: yangyp
     *moduleKey == 模块名
     *@Date: 2019-11-13 16:03:12
     */
    getModuleObjctFoyKey: function (_this, moduleKey) {
        let emptyObject = {};
        for (let gk in _this.groupDatas) {
            for (let md in _this.groupDatas[gk]) {
                if (md == moduleKey) {
                    if (_this.groupDatas[gk][md].length == 1) {
                        for (let fk in _this.groupDatas[gk][md][0]["FIELDS"]) {
                            emptyObject[fk] = _this.groupDatas[gk][md][0]["FIELDS"][fk].DEFAULT_VALUE;
                        }
                        return emptyObject;
                    } else {
                        let emptyArr = [];
                        _.each(_this.groupDatas[gk][md], (obj) => {
                            for (let fk in obj["FIELDS"]) {
                                emptyObject[fk] = obj["FIELDS"][fk].DEFAULT_VALUE;
                            }
                            emptyArr.push(emptyObject);
                            emptyObject = {};
                        })
                        return emptyArr;
                    }
                }
            }
        }
    },
    /**
     *@Description: 获取模块数据
    *moduleKey == 模块名
    */
    getModuleArrFoyKey : function(_this, moduleKey, isSkipHideField){
        for(let gk in _this.groupDatas) {
            for (let md in _this.groupDatas[gk]){
                if( md == moduleKey ){
                    let arr = [];
                    _.each(_this.groupDatas[gk][md], moduleItem => {
                        let emptyObject = {};
                        for(let fk in moduleItem["FIELDS"]){
                            let fieldControl = moduleItem["FIELDS"][fk].FIELD_CONTROL;
                            if(!isSkipHideField && (fieldControl == 1 || fieldControl == 3)) // 如果为 1 3 都是隐藏的字段，不采集，跳过
                            continue;
                            emptyObject[fk] =  moduleItem["FIELDS"][fk].DEFAULT_VALUE;
                        }
                        arr.push(emptyObject)
                    })
                return arr;
                }
            }
        }
    },
    /**
     *@Description: 获取模块下所有字段机构
     *@Author: yangyp
     *moduleKey == 模块名
     *@Date: 2019-11-13 16:03:12
     */
    getAllFieldKeyFromModule: function (_this, moduleKey) {
        let emptyObject = {};
        for (let gk in _this.groupDatas) {
            for (let md in _this.groupDatas[gk]) {
                if (md == moduleKey) {
                    for (let fk in _this.groupDatas[gk][md][0]["FIELDS"]) {
                        let fieldControl = _this.groupDatas[gk][md][0]["FIELDS"][fk].FIELD_CONTROL;
                        if (fieldControl == 3) // 如果为 3 是废弃的字段，不采集，跳过
                            continue;
                        emptyObject[fk] = "";
                    }
                    return emptyObject;
                }
            }
        }
    },
    /*
     *@Description: 按照配置的对象提交字段
     *@Author: yangyp
     *@Date: 2019-08-30 16:03:12
     */
    getEmptySaveObject: function (keyFieldMapData) {
        let saveObject = {};
        _.forEach(keyFieldMapData, function (jsonValue, jsonKey) {
            saveObject[jsonKey] = "";
        })
        return saveObject;
    },
    /*
     *@Description: 对页面上的数据进行赋值
     *@Author: yangyp
     *@Date: 2019-08-30 17:38:56
     */
    setDataWithNewObject: function (_this, saveData, mouduleArr, oldObject) {
        _.forEach(saveData, function (jsonValue, jsonKey) {
            //对页面上的字段赋值
            for (let gk in _this.groupDatas) {
                let gkBreakBool = false;
                for (let md in _this.groupDatas[gk]) {
                    let mdBreakBool = false;
                    if (_.indexOf(mouduleArr, md) != -1) {
                        for (let fk in _this.groupDatas[gk][md][0]["FIELDS"]) {
                            ;
                            if (fk == jsonKey) {
                                saveData[fk] = _this.groupDatas[gk][md][0]["FIELDS"][fk].DEFAULT_VALUE;
                                mdBreakBool = true;
                                break;
                            }
                        }
                    }
                    if (mdBreakBool) {
                        mdBreakBool = false;
                        gkBreakBool = true;
                        break;
                    }
                }
                if (gkBreakBool) {
                    gkBreakBool = false;
                    break;
                }
            }
        })

        //第二遍如果页面上的值为空，查询历史数据，如果有对其赋值，没有默认空字符串“”
        _.forEach(saveData, function (jsonValue, jsonKey) {
            if (stringConfig.isEmptyStr(jsonValue)) {
                if ([jsonKey in oldObject]) {
                    saveData[jsonKey] = oldObject[jsonKey] || "";
                }
            }
        })
        return saveData;
    },
    /*
     *@Description: 获取涉税提交数据
     *@Author: yangyp
     *@Date: 2019-09-03 18:07:12
     */
    getSaveCustTaxData: function (_this, saveTaxInfo, modulesData, oldObject) {
        _.forEach(modulesData, function (item, index) {
            for (let fk in item.FIELDS) {
                let saveKey = fk;
                if (index != 0) {
                    if (fk == "NO_TAXPAYERID_REASON_INPUT") {
                        saveKey = "NO_TAXPAYERID_REASON" + (index + 1) + "_INPUT";
                    } else {
                        saveKey = saveKey + (index + 1);
                    }

                }
                saveTaxInfo[saveKey] = item.FIELDS[fk].DEFAULT_VALUE;
                if (!_.isEmpty(oldObject)) {
                    if (saveTaxInfo[saveKey] != oldObject[saveKey] &&
                        (stringConfig.isNotEmptyStr(saveTaxInfo[saveKey]) || stringConfig.isNotEmptyStr(oldObject[saveKey]))) {
                        saveTaxInfo.DIFF_INFO.push({
                            FIELD: saveKey,
                            OLD: oldObject[saveKey] || "",
                            NEW: saveTaxInfo[saveKey]
                        })
                    }
                }
            }
        });
        return saveTaxInfo;
    },
    /*
     *@Description: 涉税收入类型
     *@Author: yangyp
     *@Date: 2019-09-03 18:07:12
     */
    getSaveCustPayMentTaxData: function (_this, saveTaxInfo, modulesData, oldObject) {
        _.forEach(modulesData, function (item, index) {
            console.log('item===', item);
            console.log('index===', index);
            for (let fk in item.FIELDS) {
                ;
                let saveKey = item.FIELDS[fk].FIELD_ID;
                let paymentAmntKey = 'PAYMENT_AMNT' + (index + 1);
                saveKey = saveKey + (index + 1);
                saveTaxInfo[saveKey] = item.FIELDS[fk].DEFAULT_VALUE;
                saveTaxInfo[paymentAmntKey] = saveTaxInfo["PAYMENT_ASSET" + (index + 1)] + "&&" + saveTaxInfo["PAYMENT_CURR" + (index + 1)];
                if (saveTaxInfo[saveKey] != oldObject[saveKey] &&
                    (stringConfig.isNotEmptyStr(saveTaxInfo[saveKey]) || stringConfig.isNotEmptyStr(oldObject[saveKey]))) {
                    saveTaxInfo.DIFF_INFO.push({
                        FIELD: saveKey,
                        OLD: oldObject[saveKey] || "",
                        NEW: saveTaxInfo[saveKey]
                    })
                    if (saveKey.indexOf("PAYMENT_ASSET") != -1 || saveKey.indexOf("PAYMENT_CURR") != -1 && _.findIndex(saveTaxInfo.DIFF_INFO, function (o) {
                            return o.FIELD == paymentAmntKey
                        }) == -1) {
                        saveTaxInfo.DIFF_INFO.push({
                            FIELD: paymentAmntKey,
                            OLD: "",
                            NEW: saveTaxInfo[paymentAmntKey]
                        });
                    }
                }
            }
        });
        return saveTaxInfo;
    },
    getSavePaymentAssetData: function (_this, saveTaxInfo, modulesData, oldObject) {
        _.forEach(modulesData, function (item, index) {
            for (let fk in item.FIELDS) {
                let paymentAmnt = "PAYMENT_AMNT";
                let saveKey = item.FIELDS[fk].FIELD_ID;
                paymentAmnt = paymentAmnt + (index + 1);
                saveKey = saveKey + (index + 1);
                saveTaxInfo[saveKey] = item.FIELDS[fk].DEFAULT_VALUE;
                //当 资金变化时
                if (saveKey.indexOf("PAYMENT_ASSET") != -1) {
                    saveTaxInfo[paymentAmnt] = saveTaxInfo[saveKey] + "&&";
                }
                if (saveKey.indexOf("PAYMENT_CURR") != -1) {
                    saveTaxInfo[paymentAmnt] = saveTaxInfo[paymentAmnt] + saveTaxInfo[saveKey];
                }
                if (saveTaxInfo[saveKey] != oldObject[saveKey] &&
                    (stringConfig.isNotEmptyStr(saveTaxInfo[saveKey]) || stringConfig.isNotEmptyStr(oldObject[saveKey]))) {
                    saveTaxInfo.DIFF_INFO.push({
                        FIELD: saveKey,
                        OLD: oldObject[saveKey] || "",
                        NEW: saveTaxInfo[saveKey]
                    });
                    if (saveKey.indexOf("PAYMENT_ASSET") != -1 || saveKey.indexOf("PAYMENT_CURR") != -1) {
                        saveTaxInfo.DIFF_INFO.push({
                            FIELD: paymentAmnt,
                            OLD: "",
                            NEW: saveTaxInfo[paymentAmnt]
                        });
                    }

                }
            }
        });
        return saveTaxInfo;
    },
    //MONAMNT
    getSaveMonamntData: function (_this, saveTaxInfo, modulesData, oldObject) {
        _.forEach(modulesData, function (item) {
            for (let fk in item.FIELDS) {
                let saveKey = item.FIELDS[fk].FIELD_ID;
                saveTaxInfo[saveKey] = item.FIELDS[fk].DEFAULT_VALUE;
                if (saveTaxInfo[saveKey] != oldObject[saveKey] &&
                    (stringConfig.isNotEmptyStr(saveTaxInfo[saveKey]) || stringConfig.isNotEmptyStr(oldObject[saveKey]))) {
                    saveTaxInfo.DIFF_INFO.push({
                        FIELD: saveKey,
                        OLD: oldObject[saveKey] || "",
                        NEW: saveTaxInfo[saveKey]
                    })
                }
            }
        });
        return saveTaxInfo;
    },
    //拼装提交的业务数据字段
    getNewBaseForm: function (_this, newBaseForm) {
        let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
        var newForm = {
            "USER_FNAME": stringConfig.isNotEmptyStr(newBaseForm.USER_FNAME.DEFAULT_VALUE) && newBaseForm.USER_FNAME.DEFAULT_VALUE || "",
            "USER_NAME": stringConfig.isNotEmptyStr(newBaseForm.USER_NAME.DEFAULT_VALUE) && newBaseForm.USER_NAME.DEFAULT_VALUE || "",
            "ID_TYPE": stringConfig.isNotEmptyStr(newBaseForm.ID_TYPE.DEFAULT_VALUE) && newBaseForm.ID_TYPE.DEFAULT_VALUE || "",
            "ID_CODE": stringConfig.isNotEmptyStr(newBaseForm.ID_CODE.DEFAULT_VALUE) && newBaseForm.ID_CODE.DEFAULT_VALUE || "",
            "ID_BEG_DATE": stringConfig.isNotEmptyStr(newBaseForm.ID_BEG_DATE.DEFAULT_VALUE) && newBaseForm.ID_BEG_DATE.DEFAULT_VALUE || "",
            "ID_EXP_DATE": stringConfig.isNotEmptyStr(newBaseForm.ID_EXP_DATE.DEFAULT_VALUE) && newBaseForm.ID_EXP_DATE.DEFAULT_VALUE || "",
            "ID_ISS_AGCY": stringConfig.isNotEmptyStr(newBaseForm.ID_ISS_AGCY.DEFAULT_VALUE) && newBaseForm.ID_ISS_AGCY.DEFAULT_VALUE || "",
            "ID_ADDR": stringConfig.isNotEmptyStr(newBaseForm.ID_ADDR.DEFAULT_VALUE) && newBaseForm.ID_ADDR.DEFAULT_VALUE || "",
            "IDCARD_TYPE": _this.$storage.getSession(_this.$definecfg.READ_CARD) == 1 ? "2" : customerInfo.IDCARD_TYPE,
            "FULLNAME": newBaseForm.FULLNAME && stringConfig.isNotEmptyStr(newBaseForm.FULLNAME.DEFAULT_VALUE) && newBaseForm.FULLNAME.DEFAULT_VALUE || "",
            "IDTYPE": newBaseForm.IDTYPE && stringConfig.isNotEmptyStr(newBaseForm.IDTYPE.DEFAULT_VALUE) && newBaseForm.IDTYPE.DEFAULT_VALUE || "",
        }
        if (_.indexOf(["0b", "0c", "0d", "0e", "0i", "0j", "0s"], customerInfo.ID_TYPE) != -1) {
            Object.assign(newForm, {
                "OTHER_ID_ADDR": stringConfig.isNotEmptyStr(newBaseForm.OTHER_ID_ADDR.DEFAULT_VALUE) && newBaseForm.OTHER_ID_ADDR.DEFAULT_VALUE || "",
                "OTHER_ID_CODE": stringConfig.isNotEmptyStr(newBaseForm.OTHER_ID_CODE.DEFAULT_VALUE) && newBaseForm.OTHER_ID_CODE.DEFAULT_VALUE || "",
                "OTHER_ID_EXP_DATE": stringConfig.isNotEmptyStr(newBaseForm.OTHER_ID_EXP_DATE.DEFAULT_VALUE) && newBaseForm.OTHER_ID_EXP_DATE.DEFAULT_VALUE || "",
                "OTHER_ID_TYPE": stringConfig.isNotEmptyStr(newBaseForm.OTHER_ID_TYPE.DEFAULT_VALUE) && newBaseForm.OTHER_ID_TYPE.DEFAULT_VALUE || "",

                "FZ_ID_ADDR": stringConfig.isNotEmptyStr(newBaseForm.OTHER_ID_ADDR.DEFAULT_VALUE) && newBaseForm.OTHER_ID_ADDR.DEFAULT_VALUE || "",
                "FZ_ID_CODE": stringConfig.isNotEmptyStr(newBaseForm.OTHER_ID_CODE.DEFAULT_VALUE) && newBaseForm.OTHER_ID_CODE.DEFAULT_VALUE || "",
                "FZ_ID_EXP_DATE": stringConfig.isNotEmptyStr(newBaseForm.OTHER_ID_EXP_DATE.DEFAULT_VALUE) && newBaseForm.OTHER_ID_EXP_DATE.DEFAULT_VALUE || "",
                "FZ_ID_TYPE": stringConfig.isNotEmptyStr(newBaseForm.OTHER_ID_TYPE.DEFAULT_VALUE) && newBaseForm.OTHER_ID_TYPE.DEFAULT_VALUE || "",
            });
        }
        if (newForm.EDUCATION != undefined) {
            newBaseForm.EDUCATION = stringConfig.isNotEmptyStr(newBaseForm.EDUCATION.DEFAULT_VALUE) && newBaseForm.EDUCATION.DEFAULT_VALUE || "";
        }
        if (newForm.MAIL_ADDR != undefined) {
            newBaseForm.MAIL_ADDR = stringConfig.isNotEmptyStr(newBaseForm.MAIL_ADDR.DEFAULT_VALUE) && newBaseForm.MAIL_ADDR.DEFAULT_VALUE || "";
        }
        if (newForm.MAIL_ZIP_CODE != undefined) {
            newBaseForm.MAIL_ZIP_CODE = stringConfig.isNotEmptyStr(newBaseForm.MAIL_ZIP_CODE.DEFAULT_VALUE) && newBaseForm.MAIL_ZIP_CODE.DEFAULT_VALUE || "";
        }
        if (newForm.EMAIL != undefined) {
            newBaseForm.EMAIL = stringConfig.isNotEmptyStr(newBaseForm.EMAIL.DEFAULT_VALUE) && newBaseForm.EMAIL.DEFAULT_VALUE || "";
        }
        if (newForm.BIRTHDAY != undefined) {
            newBaseForm.BIRTHDAY = stringConfig.isNotEmptyStr(newBaseForm.BIRTHDAY.DEFAULT_VALUE) && newBaseForm.BIRTHDAY.DEFAULT_VALUE || "";
        }
        if (newForm.OCCU_TYPE != undefined) {
            newForm.OCCU_TYPE = stringConfig.isNotEmptyStr(newBaseForm.OCCU_TYPE.DEFAULT_VALUE) && newBaseForm.OCCU_TYPE.DEFAULT_VALUE || "";
        }
        if (newForm.OCCU_STATUS != undefined) {
            newForm.OCCU_STATUS = stringConfig.isNotEmptyStr(newBaseForm.OCCU_STATUS.DEFAULT_VALUE) && newBaseForm.OCCU_STATUS.DEFAULT_VALUE || "";
        }
        if (newForm.INDUS_GB != undefined) {
            newForm.INDUS_GB = stringConfig.isNotEmptyStr(newBaseForm.INDUS_GB.DEFAULT_VALUE) && newBaseForm.INDUS_GB.DEFAULT_VALUE || "";
        }
        if (newForm.INDUS_GB_SUB != undefined) {
            newForm.INDUS_GB_SUB = stringConfig.isNotEmptyStr(newBaseForm.INDUS_GB_SUB.DEFAULT_VALUE) && newBaseForm.INDUS_GB_SUB.DEFAULT_VALUE || "";
        }
        if (newForm.OCCU_GB != undefined) {
            newForm.OCCU_GB = stringConfig.isNotEmptyStr(newBaseForm.OCCU_GB.DEFAULT_VALUE) && newBaseForm.OCCU_GB.DEFAULT_VALUE || "";
        }
        if (newForm.OCCU_GB_SUB != undefined) {
            newForm.OCCU_GB_SUB = stringConfig.isNotEmptyStr(newBaseForm.OCCU_GB_SUB.DEFAULT_VALUE) && newBaseForm.OCCU_GB_SUB.DEFAULT_VALUE || "";
        }
        _this.oppBusiData.IDCARD_TYPE = newForm.IDCARD_TYPE;
        return newForm;
    },
    transTaxInfoCountry: function (_this, saveTaxInfo) {
        let allTaxSaveInfo = {};
        if (_this.groupDatas.APPR_INFO.ORG_TAX_COUNTRY_INFO[0].MODULE_CONTROL == "1") {
            allTaxSaveInfo = this.getSaveCustTaxData(_this, saveTaxInfo, _this.groupDatas.APPR_INFO.ORG_TAX_COUNTRY_INFO, {});
        } else {
            allTaxSaveInfo = this.getSaveCustTaxData(_this, saveTaxInfo, _this.groupDatas.APPR_INFO.ORG_TAX_COUNTRY_INFO, {});
            allTaxSaveInfo["TAXPAYER_IDNO"] = ""
            allTaxSaveInfo["TAXPAYER_IDNO1"] = ""
            allTaxSaveInfo["TAXPAYER_IDNO2"] = ""
        }
        let getFieldValueName = (FIELD_DICT_NAME, DEFAULT_VALUE) => {
            if (FIELD_DICT_NAME && DEFAULT_VALUE) {
                let defaultDict = _.find(FIELD_DICT_NAME, item => {
                    return item.DICT_ITEM == DEFAULT_VALUE;
                })
                return defaultDict && defaultDict.DICT_ITEM_NAME || '';
            }
            return '';
        }
        let FIELD_DICT_NAME = _this.groupDatas.APPR_INFO.ORG_TAX_COUNTRY_INFO[0].FIELDS.NO_TAXPAYERID_REASON.FIELD_DICT_NAME;
        //翻译无涉税原因
        _.forEach(_this.groupDatas.APPR_INFO.ORG_TAX_COUNTRY_INFO, function (obj, index) {
            for (let key in obj.FIELDS) {
                if (key == "NO_TAXPAYERID_REASON") {
                    if (index == 0) {
                        allTaxSaveInfo["NO_TAXPAYERID_REASON"] = getFieldValueName(FIELD_DICT_NAME, obj.FIELDS[key].DEFAULT_VALUE);
                    } else if (index == 1) {
                        allTaxSaveInfo["NO_TAXPAYERID_REASON2"] = getFieldValueName(FIELD_DICT_NAME, obj.FIELDS[key].DEFAULT_VALUE);
                    } else if (index == 2) {
                        allTaxSaveInfo["NO_TAXPAYERID_REASON3"] = getFieldValueName(FIELD_DICT_NAME, obj.FIELDS[key].DEFAULT_VALUE);
                    }
                } else if (key == "NO_TAXPAYERID_REASON_INPUT") {
                    // }
                    if (index == 0) {
                        allTaxSaveInfo["NO_TAXPAYERID_REASON_INPUT"] = obj.FIELDS[key].DEFAULT_VALUE;
                        allTaxSaveInfo["NO_TAXPAYERID_REASON"] = allTaxSaveInfo["NO_TAXPAYERID_REASON_INPUT"] ? (allTaxSaveInfo["NO_TAXPAYERID_REASON"] + ":" + obj.FIELDS[key].DEFAULT_VALUE) : allTaxSaveInfo["NO_TAXPAYERID_REASON"];
                    } else if (index == 1) {
                        allTaxSaveInfo["NO_TAXPAYERID_REASON2_INPUT"] = obj.FIELDS[key].DEFAULT_VALUE;
                        allTaxSaveInfo["NO_TAXPAYERID_REASON2"] = allTaxSaveInfo["NO_TAXPAYERID_REASON2_INPUT"] ? (allTaxSaveInfo["NO_TAXPAYERID_REASON2"] + ":" + obj.FIELDS[key].DEFAULT_VALUE) : allTaxSaveInfo["NO_TAXPAYERID_REASON2"];
                    } else if (index == 2) {
                        allTaxSaveInfo["NO_TAXPAYERID_REASON3_INPUT"] = obj.FIELDS[key].DEFAULT_VALUE;
                        allTaxSaveInfo["NO_TAXPAYERID_REASON3"] = allTaxSaveInfo["NO_TAXPAYERID_REASON3_INPUT"] ? (allTaxSaveInfo["NO_TAXPAYERID_REASON3"] + ":" + obj.FIELDS[key].DEFAULT_VALUE) : allTaxSaveInfo["NO_TAXPAYERID_REASON3"];
                    }
                }
            }
        })
        return allTaxSaveInfo;
    }
}
